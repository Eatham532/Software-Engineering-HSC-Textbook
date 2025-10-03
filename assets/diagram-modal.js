// Diagram Modal System - Clean and Reliable
// Maps diagram container IDs to their SVG elements
window.diagramRegistry = new Map();

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    // Initialize modal immediately
    window.diagramModal = new DiagramModal();
    
    // Index diagrams with multiple attempts to catch late-loading Kroki content
    const indexAttempts = [100, 300, 500, 1000, 2000];
    indexAttempts.forEach(delay => {
        setTimeout(indexAllDiagrams, delay);
    });
    
    // Also re-index on any DOM changes (catches dynamically loaded content)
    const observer = new MutationObserver(indexAllDiagrams);
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
}

/**
 * Indexes all diagrams on the page by finding .diagram-content containers
 * and mapping their IDs to the SVG elements they contain.
 */
function indexAllDiagrams() {
    window.diagramRegistry.clear();
    
    // Find all diagram containers created by kroki_wrapper.py
    const diagramContainers = document.querySelectorAll('.diagram-content');
    
    diagramContainers.forEach((container) => {
        const containerId = container.id;
        if (!containerId) return;
        
        // Find the SVG inside this specific container
        const svg = container.querySelector('svg');
        if (svg) {
            window.diagramRegistry.set(containerId, svg);
        }
    });
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
        console.log("Creating diagram modal1");
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
                            <button class="zoom-btn" data-action="reset" title="Fit to Screen">⟳</button>
                            <button class="zoom-btn" data-action="fullscreen" title="Fullscreen">⛶</button>
                        </div>
                        <div class="diagram-info">
                            Zoom: <span id="zoom-display">100%</span>
                        </div>
                        <div class="diagram-help">
                            <strong>Controls:</strong><br>
                            Scroll: Pan up/down<br>
                            Shift+Scroll: Zoom<br>
                            Drag: Pan<br>
                            Pinch: Zoom<br>
                            Double-click: Reset<br>
                            ESC: Close
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
        // Look up the SVG from our registry
        const svg = window.diagramRegistry.get(diagramId);
        
        if (!svg) {
            console.error(`Diagram not found: ${diagramId}`);
            return;
        }

        const viewport = document.getElementById('diagram-viewport');
        const loading = document.getElementById('diagram-loading');
        
        // Show loading state
        if (loading) loading.style.display = 'flex';
        
        // Clone the SVG to avoid modifying the original
        const clonedSvg = svg.cloneNode(true);
        
        // Clear viewport and add cloned SVG
        viewport.innerHTML = '';
        viewport.appendChild(clonedSvg);
        
        this.currentSvg = clonedSvg;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update header
        const header = this.modal.querySelector('.diagram-modal-header h3');
        header.textContent = 'Diagram Viewer';
        
        // Setup interaction and fit to screen
        this.setupSvgInteraction(viewport);
        
        setTimeout(() => {
            this.fitToScreen();
            if (loading) loading.style.display = 'none';
        }, 100);
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
        // Enhanced wheel/touchpad handling
        viewport.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = viewport.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Shift + scroll = zoom
            if (e.shiftKey) {
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                this.zoomAt(mouseX, mouseY, delta);
            }
            // Ctrl + scroll = pinch zoom (touchpad)
            else if (e.ctrlKey) {
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                this.zoomAt(mouseX, mouseY, delta);
            }
            // Regular scroll = pan
            else {
                // Vertical scroll pans up/down
                this.translateY -= e.deltaY;
                // Horizontal scroll pans left/right
                this.translateX -= e.deltaX;
                this.updateTransform();
            }
        }, { passive: false });

        // Touch support for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartDistance = 0;
        let touchStartScale = 1;
        
        viewport.addEventListener('touchstart', (e) => {
            e.preventDefault();
            
            if (e.touches.length === 1) {
                // Single touch - pan
                this.isDragging = true;
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                this.lastX = touchStartX;
                this.lastY = touchStartY;
            } else if (e.touches.length === 2) {
                // Two finger pinch - zoom
                this.isDragging = false;
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                touchStartDistance = Math.sqrt(dx * dx + dy * dy);
                touchStartScale = this.scale;
            }
        }, { passive: false });
        
        viewport.addEventListener('touchmove', (e) => {
            e.preventDefault();
            
            if (e.touches.length === 1 && this.isDragging) {
                // Single touch pan
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                
                this.translateX += touchX - this.lastX;
                this.translateY += touchY - this.lastY;
                this.lastX = touchX;
                this.lastY = touchY;
                this.updateTransform();
            } else if (e.touches.length === 2) {
                // Pinch zoom
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                const scaleFactor = distance / touchStartDistance;
                const newScale = Math.max(0.1, Math.min(5, touchStartScale * scaleFactor));
                
                // Zoom towards center of pinch
                const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                const rect = viewport.getBoundingClientRect();
                const localX = centerX - rect.left;
                const localY = centerY - rect.top;
                
                const oldScale = this.scale;
                const ratio = newScale / oldScale;
                this.translateX = localX - (localX - this.translateX) * ratio;
                this.translateY = localY - (localY - this.translateY) * ratio;
                this.scale = newScale;
                this.updateTransform();
            }
        }, { passive: false });
        
        viewport.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.isDragging = false;
        }, { passive: false });

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
            this.modal.classList.add('is-fullscreen');
        } else {
            document.exitFullscreen?.() || 
            document.webkitExitFullscreen?.() || 
            document.mozCancelFullScreen?.();
            this.modal.classList.remove('is-fullscreen');
        }
    }
    
    handleFullscreenChange() {
        // Update fullscreen class based on actual fullscreen state
        if (document.fullscreenElement) {
            this.modal.classList.add('is-fullscreen');
        } else {
            this.modal.classList.remove('is-fullscreen');
        }
        
        // Re-fit diagram when entering/exiting fullscreen
        setTimeout(() => {
            if (this.currentSvg) {
                this.fitToScreen();
            }
        }, 100);
    }
}

// Global function to open diagram modal (called by onclick in HTML)
function openDiagramModal(diagramId) {
    if (!window.diagramModal) {
        // Try to initialize and retry
        setTimeout(() => {
            if (window.diagramModal) {
                window.diagramModal.open(diagramId);
            }
        }, 500);
        return;
    }
    window.diagramModal.open(diagramId);
}
