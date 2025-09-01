// Optimized SVG tracking
window.diagramSvgs = new Map();
let svgCounter = 0;

// Simple SVG observer
function initSvgTracking() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const svgs = node.tagName === 'svg' ? [node] : (node.querySelectorAll?.('svg') || []);
                    svgs.forEach(trackSvg);
                }
            });
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Track existing SVGs with multiple attempts to catch late-loading content
    setTimeout(() => {
        document.querySelectorAll('svg').forEach(trackSvg);
    }, 100);
    
    setTimeout(() => {
        document.querySelectorAll('svg').forEach(trackSvg);
    }, 500);
    
    setTimeout(() => {
        document.querySelectorAll('svg').forEach(trackSvg);
    }, 1000);
}

function trackSvg(svg) {
    // Handle both Mermaid diagrams (__mermaid_*) and Kroki diagrams (id="Kroki" or data-diagram-type)
    const isMermaid = svg?.id?.startsWith('__mermaid_');
    const isKroki = svg?.id === 'Kroki' || svg?.getAttribute('data-diagram-type');
    
    if ((!isMermaid && !isKroki) || window.diagramSvgs.has(svg.id)) return;
    
    const diagramId = `diagram-${svgCounter++}`;
    window.diagramSvgs.set(diagramId, svg);
    if (svg.id) {
        window.diagramSvgs.set(svg.id, svg);
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    initSvgTracking();
    setTimeout(() => {
        initializeDiagramButtons();
        window.diagramModal = new DiagramModal();
    }, 200);
}

class DiagramModal {
    constructor() {
        this.modal = null;
        this.currentSvg = null;
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.createModal();
        this.setupEventListeners();
    }

    createModal() {
        if (document.getElementById('diagram-modal')) return;
        
        document.body.insertAdjacentHTML('beforeend', `
            <div id="diagram-modal" class="diagram-modal">
                <div class="diagram-modal-content">
                    <div class="diagram-modal-header">
                        <h3>Diagram Viewer</h3>
                        <button class="diagram-modal-close" title="Close (ESC)">&times;</button>
                    </div>
                    <div class="diagram-modal-body">
                        <div class="diagram-viewport" id="diagram-viewport"></div>
                        <div class="diagram-controls">
                            <button class="zoom-btn" data-action="in" title="Zoom In">+</button>
                            <button class="zoom-btn" data-action="out" title="Zoom Out">−</button>
                            <button class="zoom-btn" data-action="reset" title="Fit to Screen">⌂</button>
                            <button class="zoom-btn" data-action="fullscreen" title="Fullscreen">⛶</button>
                        </div>
                        <div class="diagram-info">
                            Zoom: <span id="zoom-display">100%</span>
                        </div>
                        <div class="diagram-help">
                            <strong>Controls:</strong><br>
                            Mouse wheel: Zoom • Drag: Pan<br>
                            Double-click: Reset • ESC: Close
                        </div>
                        <div class="diagram-loading" id="diagram-loading" style="display: none;">
                            Loading diagram...
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        this.modal = document.getElementById('diagram-modal');
    }

    setupEventListeners() {
        // Close modal
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal || e.target.classList.contains('diagram-modal-close')) {
                this.close();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    this.zoom(0.2);
                    break;
                case '-':
                    e.preventDefault();
                    this.zoom(-0.2);
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.resetView();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.resetView();
                    break;
            }
        });
        
        // Control buttons
        this.modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('zoom-btn')) {
                const action = e.target.dataset.action;
                if (action === 'in') this.zoom(0.2);
                else if (action === 'out') this.zoom(-0.2);
                else if (action === 'reset') this.resetView();
                else if (action === 'fullscreen') this.toggleFullscreen();
            }
        });
        
        // Double-click to reset view
        this.modal.addEventListener('dblclick', (e) => {
            if (e.target.closest('.diagram-viewport')) {
                this.resetView();
            }
        });
        
        // Fullscreen change events
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
    }

    open(diagramId) {
        let svg = window.diagramSvgs?.get(diagramId);
        
        // Show loading state
        const loading = document.getElementById('diagram-loading');
        if (loading) loading.style.display = 'flex';
        
        // If not found in our map, try to find by container ID
        if (!svg) {
            const diagramContainer = document.getElementById(diagramId);
            if (diagramContainer) {
                svg = diagramContainer.querySelector('svg');
                if (svg) {
                    // Add to our tracking
                    trackSvg(svg);
                    window.diagramSvgs.set(diagramId, svg);
                }
            }
        }
        
        if (!svg) {
            console.error('SVG not found:', diagramId);
            if (loading) loading.style.display = 'none';
            return;
        }

        const viewport = document.getElementById('diagram-viewport');
        const clonedSvg = svg.cloneNode(true);
        
        // Reset viewport and add SVG
        viewport.innerHTML = '';
        viewport.appendChild(clonedSvg);
        
        this.currentSvg = clonedSvg;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update header with diagram type info
        const header = this.modal.querySelector('.diagram-modal-header h3');
        const diagramType = this.getDiagramType(svg);
        header.textContent = diagramType;
        
        // Setup interaction and fit to screen
        this.setupSvgInteraction(viewport);
        
        setTimeout(() => {
            this.fitToScreen();
            if (loading) loading.style.display = 'none';
        }, 100);
    }
    
    getDiagramType(svg) {
        const dataType = svg.getAttribute('data-diagram-type');
        if (dataType) {
            return dataType.charAt(0).toUpperCase() + dataType.slice(1).toLowerCase() + ' Diagram';
        }
        
        if (svg.id?.startsWith('__mermaid_')) {
            return 'Mermaid Diagram';
        }
        
        if (svg.id === 'Kroki') {
            return 'PlantUML Diagram';
        }
        
        return 'Diagram Viewer';
    }

    close() {
        // Exit fullscreen if currently in fullscreen mode
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
        }
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentSvg = null;
        this.resetTransform();
    }

    setupSvgInteraction(viewport) {
        // Mouse wheel zoom
        viewport.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = viewport.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            this.zoomAt(mouseX, mouseY, delta);
        });

        // Mouse drag
        viewport.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            viewport.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            this.translateX += e.clientX - this.lastX;
            this.translateY += e.clientY - this.lastY;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            this.updateTransform();
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            viewport.style.cursor = 'grab';
        });
    }

    fitToScreen() {
        if (!this.currentSvg) return;
        
        const viewport = document.getElementById('diagram-viewport');
        const viewportRect = viewport.getBoundingClientRect();
        
        // Get SVG dimensions
        let svgWidth, svgHeight;
        const viewBox = this.currentSvg.getAttribute('viewBox');
        
        if (viewBox) {
            const [, , width, height] = viewBox.split(' ').map(Number);
            svgWidth = width;
            svgHeight = height;
        } else {
            svgWidth = parseInt(this.currentSvg.getAttribute('width')) || this.currentSvg.getBoundingClientRect().width;
            svgHeight = parseInt(this.currentSvg.getAttribute('height')) || this.currentSvg.getBoundingClientRect().height;
        }
        
        // Calculate scale to fit 80% of viewport
        const padding = 40;
        const availableWidth = viewportRect.width - padding;
        const availableHeight = viewportRect.height - padding;
        
        const scaleX = availableWidth / svgWidth;
        const scaleY = availableHeight / svgHeight;
        this.scale = Math.min(scaleX, scaleY, 1) * 0.8; // 80% of available space
        
        // Center the SVG
        this.translateX = (viewportRect.width - svgWidth * this.scale) / 2;
        this.translateY = (viewportRect.height - svgHeight * this.scale) / 2;
        
        this.updateTransform();
    }

    zoomAt(x, y, delta) {
        const oldScale = this.scale;
        const newScale = Math.max(0.1, Math.min(5, this.scale + delta));
        
        if (newScale !== oldScale) {
            // Zoom towards mouse position
            const scaleFactor = newScale / oldScale;
            this.translateX = x - (x - this.translateX) * scaleFactor;
            this.translateY = y - (y - this.translateY) * scaleFactor;
            this.scale = newScale;
            this.updateTransform();
        }
    }

    zoom(delta) {
        const viewport = document.getElementById('diagram-viewport');
        const rect = viewport.getBoundingClientRect();
        this.zoomAt(rect.width / 2, rect.height / 2, delta);
    }

    resetView() {
        this.fitToScreen();
    }

    resetTransform() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }

    updateTransform() {
        if (this.currentSvg) {
            this.currentSvg.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
            this.currentSvg.style.transformOrigin = '0 0';
            
            const zoomDisplay = document.getElementById('zoom-display');
            if (zoomDisplay) {
                zoomDisplay.textContent = `${Math.round(this.scale * 100)}%`;
            }
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.modal.requestFullscreen?.() || 
            this.modal.webkitRequestFullscreen?.() || 
            this.modal.mozRequestFullScreen?.();
        } else {
            document.exitFullscreen?.() || 
            document.webkitExitFullscreen?.() || 
            document.mozCancelFullScreen?.();
        }
    }
    
    handleFullscreenChange() {
        // Re-fit diagram when entering/exiting fullscreen
        setTimeout(() => {
            if (this.currentSvg) {
                this.fitToScreen();
            }
        }, 100);
    }
}

// Global functions
function openDiagramModal(diagramId) {
    window.diagramModal?.open(diagramId);
}

function initializeDiagramButtons() {
    // Handle buttons that may not have been properly connected yet
    const buttons = document.querySelectorAll('.diagram-expand-btn');
    buttons.forEach((button, index) => {
        if (!button.onclick) {
            // Find the associated diagram content
            const container = button.closest('.diagram-container');
            if (container) {
                const diagramContent = container.querySelector('.diagram-content');
                if (diagramContent && diagramContent.id) {
                    const diagramId = diagramContent.id;
                    button.onclick = () => openDiagramModal(diagramId);
                } else if (diagramContent) {
                    // Create an ID if it doesn't exist
                    const diagramId = `diagram-${index}`;
                    diagramContent.id = diagramId;
                    button.onclick = () => openDiagramModal(diagramId);
                }
            }
        }
    });
    
    // Also track SVGs within diagram containers
    document.querySelectorAll('.diagram-content svg').forEach(svg => {
        trackSvg(svg);
    });
}
