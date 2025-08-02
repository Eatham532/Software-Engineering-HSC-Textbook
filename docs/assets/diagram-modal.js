// Global storage for rendered SVGs
window.mermaidRenderedSvgs = new Map();
window.svgOrderCounter = 0; // Counter to track SVG order (starts at 0)

// MutationObserver to detect when Mermaid renders SVGs
function setupMermaidObserver() {
    console.log('[DiagramModal] 🔄 Setting up SVG detection...');
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Check for added nodes
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if the added node is an SVG
                    if (node.tagName === 'svg') {
                        storeSvgElement(node);
                    }
                    
                    // Check if the added node contains SVGs
                    const svgs = node.querySelectorAll ? node.querySelectorAll('svg') : [];
                    svgs.forEach(svg => {
                        storeSvgElement(svg);
                    });
                }
            });
        });
    });
    
    // Observe the entire document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Also check for any existing SVGs when the observer starts
    setTimeout(() => {
        const existingSvgs = document.querySelectorAll('svg');
        console.log(`[DiagramModal] 🔍 Found ${existingSvgs.length} existing SVGs on page`);
        existingSvgs.forEach(svg => {
            storeSvgElement(svg);
        });
    }, 500);
}

function storeSvgElement(svg) {
    if (!svg.id) return;
    
    // Skip error SVGs - we don't want to store these
    if (svg.getAttribute('aria-roledescription') === 'error' || 
        svg.outerHTML.includes('Syntax error in text') ||
        svg.outerHTML.includes('error-text') ||
        svg.id.startsWith('dmermaid')) {
        return;
    }
    
    // Focus on Mermaid-generated SVGs that start with __mermaid_
    if (svg.id.startsWith('__mermaid_')) {
        // Check if we've already stored this SVG to avoid duplicates
        if (window.mermaidRenderedSvgs.has(svg.id)) {
            console.log(`[DiagramModal] ⚠️ SVG ${svg.id} already stored, skipping`);
            return;
        }
        
        // Store SVG ONLY by the order-based ID that buttons will use (diagram-0, diagram-1, etc.)
        const orderBasedId = `diagram-${window.svgOrderCounter}`;
        
        console.log(`[DiagramModal] 📝 Storing SVG #${window.svgOrderCounter}: ${svg.id} -> ${orderBasedId}`);
        
        // Store SVG by the order-based ID (this is what buttons will look for)
        window.mermaidRenderedSvgs.set(orderBasedId, svg);
        
        // Also store by original ID to track what we've seen (for duplicate detection)
        window.mermaidRenderedSvgs.set(svg.id, svg);
        
        // Increment counter for next SVG
        window.svgOrderCounter++;
    }
}

// Initialize Modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('[DiagramModal] DOM Content Loaded - Setting up diagram modal');
    
    // Reset SVG counter to ensure clean numbering from 0
    window.svgOrderCounter = 0;
    window.mermaidRenderedSvgs = new Map();
    
    // Set up the mutation observer to detect SVG rendering
    setupMermaidObserver();
    
    // Initialize diagram buttons with sequential IDs
    setTimeout(() => {
        initializeDiagramButtons();
    }, 500);
    
    // Wait a bit for initial rendering, then initialize modal
    setTimeout(() => {
        console.log('[DiagramModal] Initializing DiagramModal');
        window.diagramModal = new DiagramModal();
    }, 1000);
});

// Initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    console.log('[DiagramModal] DOM already loaded, initializing immediately');
    
    // Reset SVG counter to ensure clean numbering from 0
    window.svgOrderCounter = 0;
    window.mermaidRenderedSvgs = new Map();
    
    setupMermaidObserver();
    setTimeout(() => {
        initializeDiagramButtons();
        window.diagramModal = new DiagramModal();
    }, 500);
}

// Diagram Modal Functionality with Zoom and Pan
class DiagramModal {
    constructor() {
        this.currentModal = null;
        this.currentSvg = null;
        this.scale = 1;
        this.minScale = 0.1;
        this.maxScale = 5;
        this.translateX = 0;
        this.translateY = 0;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.init();
    }

    init() {
        // Create modal container if it doesn't exist
        if (!document.getElementById('diagram-modal-container')) {
            this.createModalContainer();
        }
        
        // Set up event listeners
        this.setupEventListeners();
    }

    createModalContainer() {
        const modalHtml = `
            <div id="diagram-modal-container" class="diagram-modal">
                <div class="diagram-modal-content">
                    <div class="diagram-modal-header">
                        <h3 class="diagram-modal-title">Diagram Viewer</h3>
                        <button class="diagram-modal-close" onclick="window.diagramModal.closeModal()">&times;</button>
                    </div>
                    <div class="diagram-modal-body">
                        <div class="diagram-modal-viewport" id="diagram-viewport">
                            <!-- SVG will be inserted here -->
                        </div>
                        <div class="diagram-info-panel">
                            <div>Use mouse wheel to zoom • Click and drag to pan</div>
                            <div id="zoom-level">Zoom: 100%</div>
                        </div>
                        <div class="diagram-zoom-controls">
                            <button class="diagram-zoom-btn" onclick="window.diagramModal.zoomIn()" title="Zoom In">+</button>
                            <button class="diagram-zoom-btn" onclick="window.diagramModal.zoomOut()" title="Zoom Out">−</button>
                            <button class="diagram-zoom-btn" onclick="window.diagramModal.resetZoom()" title="Reset Zoom">⌂</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    setupEventListeners() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('diagram-modal')) {
                this.closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal && this.currentModal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(diagramId) {
        const diagramElement = document.getElementById(diagramId);
        if (!diagramElement) {
            console.error(`[DiagramModal] ❌ Diagram element not found: ${diagramId}`);
            alert('Diagram not found: ' + diagramId);
            return;
        }

        console.log(`[DiagramModal] 🎭 Opening modal for: ${diagramId}`);

        // Try to find SVG element
        let svg = this.findSvgInElement(diagramElement);
        
        if (svg) {
            console.log(`[DiagramModal] ✅ Found SVG: ${svg.id}`);
        } else {
            console.log(`[DiagramModal] ⏳ SVG not found immediately, waiting for Mermaid...`);
        }
        
        // If still no SVG, wait a bit for Mermaid to render
        if (!svg) {
            // Show modal with loading message
            this.currentModal = document.getElementById('diagram-modal-container');
            const viewport = document.getElementById('diagram-viewport');
            
            if (!this.currentModal || !viewport) {
                console.error('[DiagramModal] ❌ Modal container or viewport not found');
                return;
            }
            
            viewport.innerHTML = '<div class="diagram-loading">Loading diagram...</div>';
            this.currentModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Try to find SVG with multiple retries
            let retryCount = 0;
            const maxRetries = 10;
            const retryInterval = 300;
            
            const findSvgWithRetry = () => {
                svg = this.findSvgInElement(diagramElement);
                retryCount++;
                
                if (svg) {
                    console.log(`[DiagramModal] ✅ Found SVG after ${retryCount} retries`);
                    this.setupModalWithSvg(svg, viewport);
                } else {
                    // Check if we found an SVG but it had errors
                    const errorSvg = diagramElement.querySelector('svg');
                    if (errorSvg && (errorSvg.outerHTML.includes('Syntax error in text') || errorSvg.outerHTML.includes('error-text'))) {
                        console.error('[DiagramModal] ❌ Found SVG but it contains errors');
                        viewport.innerHTML = '<div class="diagram-loading">Diagram syntax error detected.<br><br>Please check the Mermaid diagram syntax and refresh the page to try again.</div>';
                        return;
                    }
                    
                    if (retryCount < maxRetries) {
                        setTimeout(findSvgWithRetry, retryInterval);
                    } else {
                        console.error('[DiagramModal] ❌ Could not find valid SVG after maximum retries');
                        viewport.innerHTML = '<div class="diagram-loading">Unable to load diagram.<br><br>The diagram may still be rendering or contain syntax errors. Please try again in a moment.</div>';
                    }
                }
            };
            
            findSvgWithRetry();
            return;
        }

        // SVG found immediately
        console.log('[DiagramModal] ⚡ SVG found immediately, setting up modal');
        this.currentModal = document.getElementById('diagram-modal-container');
        const viewport = document.getElementById('diagram-viewport');
        
        if (!this.currentModal || !viewport) {
            console.error('[DiagramModal] ❌ Modal container or viewport not found');
            return;
        }
        
        this.setupModalWithSvg(svg, viewport);
    }

    findSvgInElement(element) {
        const buttonNumber = element.id.replace('diagram-', '');
        console.log(`[DiagramModal] 🔍 Looking for SVG for button #${buttonNumber} (ID: ${element.id})`);
        
        // PRIORITY 1: Check if we have the rendered SVG stored by element ID
        if (element.id && window.mermaidRenderedSvgs && window.mermaidRenderedSvgs.has(element.id)) {
            const svg = window.mermaidRenderedSvgs.get(element.id);
            console.log(`[DiagramModal] ✅ Found stored SVG for button: ${element.id} -> SVG ID: ${svg.id}`);
            return svg;
        }
        
        console.log(`[DiagramModal] ❌ No direct mapping found for ${element.id}`);
        console.log(`[DiagramModal] 📋 Available stored SVGs:`, Array.from(window.mermaidRenderedSvgs.keys()));
        
        return null;
    }

    setupModalWithSvg(svg, viewport) {
        console.log('[DiagramModal] 🔧 Setting up modal with SVG');
        
        // Log key information about the SVG being displayed
        if (svg.id) console.log(`[DiagramModal] 📊 SVG ID: ${svg.id}`);
        
        // Try to extract diagram type/content as identifier
        const titleElement = svg.querySelector('title');
        const textElements = svg.querySelectorAll('text');
        if (titleElement) {
            console.log(`[DiagramModal] 📝 SVG Title: ${titleElement.textContent}`);
        }
        if (textElements.length > 0) {
            const firstText = textElements[0].textContent.trim();
            if (firstText) console.log(`[DiagramModal] 📃 First text: "${firstText}"`);
        }
        
        // Clone the SVG more thoroughly to preserve all content
        const clonedSvg = this.deepCloneSvg(svg);
        
        if (!clonedSvg) {
            console.error('[DiagramModal] Failed to clone SVG - showing error message');
            viewport.innerHTML = '<div class="diagram-loading">Unable to display diagram.<br><br>The diagram contains syntax errors or failed to render properly.<br>Please check the Mermaid syntax and try refreshing the page.</div>';
            
            // Show modal anyway so user can see the error
            this.currentModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            return;
        }
        
        clonedSvg.classList.add('diagram-modal-svg');
        
        // Verify the cloned SVG has the expected content
        const clonedStyles = clonedSvg.querySelectorAll('style');
        const clonedGs = clonedSvg.querySelectorAll('g');
        console.log('[DiagramModal] Cloned SVG has', clonedStyles.length, 'style elements and', clonedGs.length, 'g elements');
        
        if (clonedStyles.length === 0 && originalStyles.length > 0) {
            console.error('[DiagramModal] WARNING: Style elements were not copied properly!');
        }
        
        if (clonedGs.length === 0 && originalGs.length > 0) {
            console.error('[DiagramModal] WARNING: G elements were not copied properly!');
        }
        
        // Ensure SVG has proper attributes for scaling
        if (!clonedSvg.getAttribute('viewBox') && clonedSvg.getAttribute('width') && clonedSvg.getAttribute('height')) {
            const width = clonedSvg.getAttribute('width').replace('px', '');
            const height = clonedSvg.getAttribute('height').replace('px', '');
            clonedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
            console.log('[DiagramModal] Added viewBox:', `0 0 ${width} ${height}`);
        }
        
        // Reset SVG positioning for proper centering
        clonedSvg.style.position = 'absolute';
        clonedSvg.style.top = '0';
        clonedSvg.style.left = '0';
        clonedSvg.style.maxWidth = 'none';
        clonedSvg.style.maxHeight = 'none';
        clonedSvg.style.width = 'auto';
        clonedSvg.style.height = 'auto';
        clonedSvg.style.display = 'block';
        clonedSvg.style.margin = '0';
        clonedSvg.style.transformOrigin = '0 0'; // Ensure transform origin is top-left
        
        console.log('[DiagramModal] Final cloned SVG outerHTML length:', clonedSvg.outerHTML.length);
        
        // Clear viewport and add cloned SVG
        viewport.innerHTML = '';
        viewport.appendChild(clonedSvg);
        
        // Store references
        this.currentSvg = clonedSvg;
        
        // Show modal
        this.currentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Set up interaction
        this.setupSvgInteraction(clonedSvg, viewport);
        
        // Auto-fit to screen initially with a small delay to ensure proper rendering
        setTimeout(() => {
            this.fitToScreen();
            
            // Debug: Show center points (remove this in production)
            if (window.location.hash === '#debug') {
                this.showCenterDebug();
            }
        }, 150);
        
        // Set up resize handler to adapt to screen size changes
        this.resizeHandler = () => {
            console.log('[DiagramModal] 📐 Screen resized, adapting modal...');
            // Small delay to let the modal adjust to new size
            setTimeout(() => this.fitToScreen(), 100);
        };
        window.addEventListener('resize', this.resizeHandler);
        
        console.log('[DiagramModal] ✅ Modal setup complete');
    }
    
    deepCloneSvg(svg) {
        console.log('[DiagramModal] Starting deep clone of SVG');
        console.log('[DiagramModal] Original SVG outerHTML preview:', svg.outerHTML.substring(0, 500));
        
        // Check if the original SVG contains error content
        if (svg.outerHTML.includes('Syntax error in text')) {
            console.error('[DiagramModal] Original SVG contains error - cannot clone error SVG');
            return null;
        }
        
        // Use importNode to properly clone the SVG with all its content
        const clonedSvg = document.importNode(svg, true);
        
        // Ensure the cloned SVG maintains its identity and styling
        if (!clonedSvg.hasAttribute('id')) {
            clonedSvg.setAttribute('id', 'cloned-' + Date.now());
        }
        
        console.log('[DiagramModal] Cloned SVG has', clonedSvg.childNodes.length, 'child nodes');
        console.log('[DiagramModal] Cloned SVG outerHTML preview:', clonedSvg.outerHTML.substring(0, 500));
        
        // Verify critical elements were copied
        const styles = clonedSvg.querySelectorAll('style');
        const gElements = clonedSvg.querySelectorAll('g');
        console.log('[DiagramModal] Cloned SVG contains', styles.length, 'style elements and', gElements.length, 'g elements');
        
        if (styles.length === 0 && gElements.length === 0) {
            console.error('[DiagramModal] Cloned SVG appears to be empty or malformed');
            return null;
        }
        
        return clonedSvg;
    }

    closeModal() {
        if (this.currentModal) {
            this.currentModal.classList.remove('active');
            document.body.style.overflow = '';
            this.currentModal = null;
            this.currentSvg = null;
            this.resetTransform();
            
            // Remove resize handler
            if (this.resizeHandler) {
                window.removeEventListener('resize', this.resizeHandler);
                this.resizeHandler = null;
            }
        }
    }

    setupSvgInteraction(svg, viewport) {
        // Mouse wheel zoom
        viewport.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            // Get mouse position relative to the viewport (not the entire screen)
            const viewportRect = viewport.getBoundingClientRect();
            const mouseX = e.clientX - viewportRect.left;
            const mouseY = e.clientY - viewportRect.top;
            
            // Reduced sensitivity for better control
            const delta = e.deltaY > 0 ? -0.05 : 0.05;
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
            
            const deltaX = e.clientX - this.lastX;
            const deltaY = e.clientY - this.lastY;
            
            this.translateX += deltaX;
            this.translateY += deltaY;
            this.updateTransform();
            
            this.lastX = e.clientX;
            this.lastY = e.clientY;
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            viewport.style.cursor = 'grab';
        });

        // Touch events for mobile
        let lastTouchDistance = 0;
        
        viewport.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.lastX = e.touches[0].clientX;
                this.lastY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                lastTouchDistance = this.getDistance(e.touches[0], e.touches[1]);
            }
        });

        viewport.addEventListener('touchmove', (e) => {
            e.preventDefault();
            
            if (e.touches.length === 1 && this.isDragging) {
                const deltaX = e.touches[0].clientX - this.lastX;
                const deltaY = e.touches[0].clientY - this.lastY;
                
                this.translateX += deltaX;
                this.translateY += deltaY;
                this.updateTransform();
                
                this.lastX = e.touches[0].clientX;
                this.lastY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                const delta = (currentDistance - lastTouchDistance) * 0.01;
                
                // Get center point between the two touches for zoom origin
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const viewportRect = viewport.getBoundingClientRect();
                const centerX = ((touch1.clientX + touch2.clientX) / 2) - viewportRect.left;
                const centerY = ((touch1.clientY + touch2.clientY) / 2) - viewportRect.top;
                
                this.zoomAt(centerX, centerY, delta);
                lastTouchDistance = currentDistance;
            }
        });

        viewport.addEventListener('touchend', () => {
            this.isDragging = false;
        });
    }

    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    zoomAt(x, y, delta) {
        const oldScale = this.scale;
        const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale + delta));
        
        if (newScale !== oldScale) {
            // The key insight: we want the point under the mouse to remain stationary
            // 
            // Current mouse position in "SVG space" (before scaling):
            // svgPoint = (mousePos - translate) / scale
            //
            // After scaling, we want the same SVG point to be under the mouse:
            // mousePos = svgPoint * newScale + newTranslate
            // 
            // Therefore: newTranslate = mousePos - svgPoint * newScale
            
            // Calculate what point in SVG space is currently under the mouse
            const svgPointX = (x - this.translateX) / this.scale;
            const svgPointY = (y - this.translateY) / this.scale;
            
            // Update scale
            this.scale = newScale;
            
            // Calculate new translation to keep that same SVG point under the mouse
            this.translateX = x - svgPointX * this.scale;
            this.translateY = y - svgPointY * this.scale;
            
            this.updateTransform();
            console.log(`[DiagramModal] 🔍 Zoomed to ${Math.round(this.scale * 100)}% at viewport (${Math.round(x)}, ${Math.round(y)}) - SVG point (${svgPointX.toFixed(1)}, ${svgPointY.toFixed(1)}) stays fixed`);
        }
    }
    
    screenToSvg(screenX, screenY) {
        // Convert screen coordinates to SVG coordinates
        return {
            x: (screenX - this.translateX) / this.scale,
            y: (screenY - this.translateY) / this.scale
        };
    }
    
    svgToScreen(svgX, svgY) {
        // Convert SVG coordinates to screen coordinates
        return {
            x: svgX * this.scale + this.translateX,
            y: svgY * this.scale + this.translateY
        };
    }

    zoomIn() {
        const rect = document.getElementById('diagram-viewport').getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        this.zoomAt(centerX, centerY, 0.2);
    }

    zoomOut() {
        const rect = document.getElementById('diagram-viewport').getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        this.zoomAt(centerX, centerY, -0.2);
    }

    resetZoom() {
        this.resetTransform();
        this.fitToScreen();
    }

    fitToScreen() {
        if (!this.currentSvg) return;
        
        const viewport = document.getElementById('diagram-viewport');
        if (!viewport) return;
        
        // Get the current viewport dimensions (this will change with screen size)
        const viewportRect = viewport.getBoundingClientRect();
        
        // Get the actual SVG dimensions
        const svgBBox = this.currentSvg.getBBox ? this.currentSvg.getBBox() : this.currentSvg.getBoundingClientRect();
        const svgWidth = svgBBox.width || this.currentSvg.clientWidth || 800;
        const svgHeight = svgBBox.height || this.currentSvg.clientHeight || 600;
        
        // Account for padding in viewport (leaving some breathing room)
        const padding = 40; // 20px on each side
        const availableWidth = viewportRect.width - padding;
        const availableHeight = viewportRect.height - padding;
        
        // Calculate scale to fit with some margin
        const scaleX = availableWidth / svgWidth;
        const scaleY = availableHeight / svgHeight;
        this.scale = Math.min(scaleX, scaleY, 1.2) * 0.9; // Max 120% scale, with 10% margin
        
        // Calculate the scaled dimensions
        const scaledWidth = svgWidth * this.scale;
        const scaledHeight = svgHeight * this.scale;
        
        // Center the SVG properly: put the center of the scaled SVG at the center of the viewport
        // Since transform-origin is 0,0 (top-left), we need to translate by half the difference
        this.translateX = (viewportRect.width - scaledWidth) / 2;
        this.translateY = (viewportRect.height - scaledHeight) / 2;
        
        this.updateTransform();
        
        console.log(`[DiagramModal] 📐 Fitted to screen: scale=${this.scale.toFixed(2)}, SVG=${svgWidth}x${svgHeight}, viewport=${Math.round(viewportRect.width)}x${Math.round(viewportRect.height)}, centered at (${Math.round(this.translateX)}, ${Math.round(this.translateY)})`);
    }

    resetTransform() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }

    updateTransform() {
        if (this.currentSvg) {
            // Set transform origin to top-left for consistent positioning
            this.currentSvg.style.transformOrigin = '0 0';
            this.currentSvg.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
            
            // Update zoom level display
            const zoomLevel = document.getElementById('zoom-level');
            if (zoomLevel) {
                zoomLevel.textContent = `Zoom: ${Math.round(this.scale * 100)}%`;
            }
        }
    }
    
    // Debug function to show center points (for testing centering)
    showCenterDebug() {
        const viewport = document.getElementById('diagram-viewport');
        if (!viewport || !this.currentSvg) return;
        
        // Remove any existing debug elements
        const existing = viewport.querySelectorAll('.debug-center');
        existing.forEach(el => el.remove());
        
        const viewportRect = viewport.getBoundingClientRect();
        const svgBBox = this.currentSvg.getBBox ? this.currentSvg.getBBox() : this.currentSvg.getBoundingClientRect();
        
        // Create viewport center marker
        const viewportCenter = document.createElement('div');
        viewportCenter.className = 'debug-center';
        viewportCenter.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: red;
            border: 2px solid white;
            border-radius: 50%;
            z-index: 1000;
            pointer-events: none;
            left: ${viewportRect.width / 2 - 10}px;
            top: ${viewportRect.height / 2 - 10}px;
        `;
        viewport.appendChild(viewportCenter);
        
        // Create SVG center marker (accounting for transform)
        const svgCenterX = this.translateX + (svgBBox.width * this.scale) / 2;
        const svgCenterY = this.translateY + (svgBBox.height * this.scale) / 2;
        
        const svgCenter = document.createElement('div');
        svgCenter.className = 'debug-center';
        svgCenter.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: blue;
            border: 2px solid white;
            border-radius: 50%;
            z-index: 1001;
            pointer-events: none;
            left: ${svgCenterX - 10}px;
            top: ${svgCenterY - 10}px;
        `;
        viewport.appendChild(svgCenter);
        
        console.log(`[DiagramModal] 🎯 Debug Centers: Viewport center (${viewportRect.width/2}, ${viewportRect.height/2}), SVG center (${svgCenterX}, ${svgCenterY})`);
        
        // Remove debug elements after 3 seconds
        setTimeout(() => {
            const debugElements = viewport.querySelectorAll('.debug-center');
            debugElements.forEach(el => el.remove());
        }, 3000);
    }
}

// Global functions for opening diagram modals (called from HTML)
function openDiagramModal(diagramId) {
    console.log(`[DiagramModal] 🚀 Opening modal for: ${diagramId}`);
    
    if (window.diagramModal) {
        window.diagramModal.openModal(diagramId);
    } else {
        console.error('[DiagramModal] ❌ DiagramModal not initialized yet');
        // Try to initialize and then open
        setTimeout(() => {
            if (window.diagramModal) {
                window.diagramModal.openModal(diagramId);
            } else {
                alert('Diagram viewer is still loading. Please try again in a moment.');
            }
        }, 1000);
    }
}

// Helper function to create diagram buttons with correct order-based IDs
// Call this function when creating buttons to ensure they get the right IDs
function createDiagramButton(buttonNumber, buttonText = "View Diagram", customClass = "") {
    // Buttons are numbered starting from 0 (diagram-0, diagram-1, diagram-2, etc.)
    const buttonId = `diagram-${buttonNumber}`;
    
    console.log(`[DiagramModal] Creating button #${buttonNumber} with ID: ${buttonId}`);
    
    // Add id attribute to the button element
    const buttonHtml = `<button id="${buttonId}" onclick="openDiagramModal('${buttonId}')" class="diagram-button ${customClass}">${buttonText}</button>`;
    
    return {
        id: buttonId,
        html: buttonHtml,
        onclick: `openDiagramModal('${buttonId}')`
    };
}

// Simplified button creation - automatically detects and replaces buttons
function initializeDiagramButtons() {
    console.log('[DiagramModal] 🎯 Initializing diagram buttons...');
    
    // Find all buttons with diagram-expand-btn class
    const expandButtons = document.querySelectorAll('.diagram-expand-btn');
    console.log(`[DiagramModal] Found ${expandButtons.length} diagram expand buttons`);
    
    expandButtons.forEach((button, index) => {
        const diagramId = `diagram-${index}`;
        
        // Update button attributes
        button.id = diagramId;
        button.setAttribute('onclick', `openDiagramModal('${diagramId}')`);
        
        console.log(`[DiagramModal] ✅ Button ${index + 1} -> ID: ${diagramId}`);
    });
}

// Debug function to show current SVG mapping
function debugSvgMapping() {
    console.log('[DiagramModal] 🐛 Current SVG Mapping:');
    console.log(`[DiagramModal] SVG Counter: ${window.svgOrderCounter}`);
    console.log(`[DiagramModal] Stored SVGs: ${window.mermaidRenderedSvgs.size}`);
    
    // Show diagram-X mappings
    for (let i = 0; i < window.svgOrderCounter; i++) {
        const diagramId = `diagram-${i}`;
        const svg = window.mermaidRenderedSvgs.get(diagramId);
        if (svg) {
            console.log(`[DiagramModal] ${diagramId} -> ${svg.id}`);
        } else {
            console.log(`[DiagramModal] ${diagramId} -> NOT FOUND`);
        }
    }
    
    // Show all stored keys
    console.log('[DiagramModal] All stored keys:', Array.from(window.mermaidRenderedSvgs.keys()));
}

// Make debug function globally accessible
window.debugSvgMapping = debugSvgMapping;
