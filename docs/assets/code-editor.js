/**
 * Multi-Language Code Editor IDE
 * 
 * A full-featured IDE with:
 * - Python: Full execution with Pyodide
 * - Web: HTML/CSS/JS with live preview
 * - Terminal: Command reference (read-only)
 * - File management with localStorage persistence
 * - Monaco Editor integration
 * - Context menus and keyboard shortcuts
 */

(function() {
    'use strict';

    // State Management
    const state = {
        files: {},
        currentFile: null,
        pyodide: null,
        pyodideLoading: false,
        pyodideWorker: null, // Web Worker for Python execution
        editor: null,
        consoleCollapsed: false,
        sidebarCollapsed: (() => {
            // Restore collapsed state from localStorage, or default based on screen size
            const saved = localStorage.getItem('ide-sidebar-collapsed');
            if (saved !== null) {
                return saved === 'true';
            }
            return window.innerWidth <= 1024;
        })(),
        modified: new Set(),
        tabs: [],
        currentMode: localStorage.getItem('ide-current-mode') || 'python', // Restore last mode
        webFiles: { html: '', css: '', js: '', current: 'html' },
        executing: false, // Track if code is currently executing
        shouldStop: false, // Flag to stop execution
        isLoadingContent: false // Flag to prevent false modified detection when loading files
    };

    // Constants
    const STORAGE_KEY = 'python_ide_files';
    const WEB_STORAGE_KEY = 'web_ide_files';
    const WEB_ENVIRONMENTS_KEY = 'web_ide_environments';
    const CURRENT_ENV_KEY = 'web_ide_current_env';
    
    const DEFAULT_FILES = {
        python: {
            name: 'main.py',
            content: '# Welcome to the Python Editor!\n# Write your code here and click Run to execute it.\n# You can use print() for output and input() for user input.\n\nprint("Hello, World!")\n\n# Try using input():\n# name = input("What is your name? ")\n# print(f"Nice to meet you, {name}!")\n',
            type: 'exec'
        },
        html: {
            name: 'index.html',
            content: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Web Page</title>\n</head>\n<body>\n    <h1>Welcome to the Web Editor!</h1>\n    <p>Edit HTML, CSS, and JavaScript to see live preview.</p>\n    <button onclick="greet()">Click Me</button>\n    \n</body>\n</html>\n'
        },
        css: {
            name: 'styles.css',
            content: '/* CSS Styles */\nbody {\n    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n    max-width: 800px;\n    margin: 0 auto;\n    padding: 2rem;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n}\n\nh1 {\n    font-size: 2.5rem;\n    margin-bottom: 1rem;\n}\n\nbutton {\n    background: white;\n    color: #667eea;\n    border: none;\n    padding: 0.75rem 1.5rem;\n    font-size: 1rem;\n    border-radius: 0.5rem;\n    cursor: pointer;\n    transition: transform 0.2s;\n}\n\nbutton:hover {\n    transform: translateY(-2px);\n}\n'
        },
        js: {
            name: 'script.js',
            content: '// JavaScript Code\nfunction greet() {\n    const name = prompt("What\'s your name?");\n    if (name) {\n        alert(`Hello, ${name}! Welcome to the Web Editor!`);\n    }\n}\n\nconsole.log("Web Editor loaded successfully!");\n'
        }
    };

    /**
     * Initialize the IDE
     */
    async function initIDE() {
        console.log('[IDE] Initializing...');
        
        // Load files from localStorage
        loadFiles();
        
        // Build the IDE UI
        buildIDE();
        
        // Initialize Monaco Editor
        await initMonaco();
        
        // Initialize mode-specific content after editor is ready
        initializeMode();
        
        // Set up keyboard shortcuts
        setupKeyboardShortcuts();
        
        // Set up window resize listener for responsive behavior
        setupWindowResizeListener();
        
        console.log('[IDE] Initialized successfully');
    }

    // SVG Icons (Feather icons style - no color, stroke only)
    const icons = {
        play: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
        stop: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',
        refresh: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>',
        plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
        save: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,
        file: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>',
        trash: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
        code: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-code"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
        terminal: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-terminal"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>',
        globe: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-globe"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
        chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>',
        chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>',
        x: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
    };

    /**
     * Unified Sidebar System
     * Works for both Python (files) and Web (environments) modes
     */
    const Sidebar = {
        /**
         * Create sidebar HTML structure
         */
        create(mode) {
            const isMobile = window.innerWidth <= 768;
            const isCollapsed = state.sidebarCollapsed;
            
            const config = mode === 'python' ? {
                id: 'ide-sidebar',
                title: 'Files',
                icon: icons.file,
                toggleId: 'sidebar-toggle',
                mobileToggleId: 'mobile-sidebar-toggle',
                contentId: 'sidebar-content'
            } : {
                id: 'ide-sidebar',
                title: 'Environments',
                icon: icons.globe,
                toggleId: 'sidebar-toggle',
                mobileToggleId: 'mobile-sidebar-toggle',
                contentId: 'sidebar-content'
            };

            return `
                <aside class="ide-sidebar ${isCollapsed ? 'collapsed' : ''}" id="${config.id}">
                    <div class="sidebar-header">
                        <span class="sidebar-icon">${config.icon}</span>
                        <span class="sidebar-title">${config.title}</span>
                        <button class="sidebar-toggle-btn" id="${config.toggleId}" title="${isCollapsed ? 'Expand' : 'Collapse'}">
                            ${isCollapsed ? icons.chevronRight : icons.chevronLeft}
                        </button>
                    </div>
                    <div class="sidebar-content" id="${config.contentId}">
                        ${mode === 'python' ? this.pythonContent() : this.webContent()}
                    </div>
                </aside>
            `;
        },

        /**
         * Python mode sidebar content (file list)
         */
        pythonContent() {
            return `
                <div class="file-list" id="file-list"></div>
                <div class="new-file-form">
                    <input type="text" class="new-file-input" id="new-file-input" 
                           placeholder="new_file.py" 
                           style="display: none;">
                </div>
            `;
        },

        /**
         * Web mode sidebar content (environment list)
         */
        webContent() {
            return `
                <div class="web-env-actions">
                    <input type="text" class="env-name-input" id="env-name-input" placeholder="Environment name">
                    <button class="ide-btn ide-btn-small" id="save-env">
                        ${icons.save}<span>Save</span>
                    </button>
                </div>
                <div class="environment-list" id="environment-list"></div>
            `;
        },

        /**
         * Toggle sidebar collapsed/expanded state
         */
        toggle() {
            const sidebar = document.getElementById('ide-sidebar');
            const toggleBtn = document.getElementById('sidebar-toggle');
            const mobileBtn = document.getElementById('mobile-sidebar-toggle');
            const isMobile = window.innerWidth <= 768;
            
            state.sidebarCollapsed = !state.sidebarCollapsed;
            
            // Save collapsed state to localStorage
            localStorage.setItem('ide-sidebar-collapsed', state.sidebarCollapsed);
            
            if (state.sidebarCollapsed) {
                sidebar.classList.add('collapsed');
                sidebar.style.width = ''; // Clear inline width
                if (toggleBtn) {
                    toggleBtn.innerHTML = icons.chevronRight;
                    toggleBtn.title = 'Expand';
                }
                // Mobile button stays the same - it's always the open button
            } else {
                sidebar.classList.remove('collapsed');
                // Restore saved width when expanding (shared across modes)
                const savedWidth = localStorage.getItem('ide-sidebar-width');
                if (savedWidth) {
                    // Apply with slight delay to ensure DOM is ready
                    setTimeout(() => {
                        sidebar.style.width = savedWidth;
                    }, 10);
                }
                if (toggleBtn) {
                    toggleBtn.innerHTML = icons.chevronLeft;
                    toggleBtn.title = 'Collapse';
                }
                // Mobile button stays the same - close button is separate
            }
            
            // Restore terminal height after layout change
            setTimeout(() => {
                const consoleEl = document.getElementById('console');
                const savedHeight = localStorage.getItem('ide-terminal-height');
                if (consoleEl && savedHeight) {
                    consoleEl.style.height = savedHeight;
                }
            }, 10);
        },

        /**
         * Mobile-specific toggle - always expands on mobile
         */
        toggleMobile() {
            const sidebar = document.getElementById('ide-sidebar');
            const isMobile = window.innerWidth <= 768;
            
            if (!isMobile) {
                // On larger screens, use normal toggle
                this.toggle();
                return;
            }
            
            // On mobile, only expand (close button is separate)
            if (state.sidebarCollapsed) {
                state.sidebarCollapsed = false;
                sidebar.classList.remove('collapsed');
                
                // Restore terminal height after layout change
                setTimeout(() => {
                    const consoleEl = document.getElementById('console');
                    const savedHeight = localStorage.getItem('ide-terminal-height');
                    if (consoleEl && savedHeight) {
                        consoleEl.style.height = savedHeight;
                    }
                }, 10);
            }
        },

        /**
         * Setup sidebar event listeners
         */
        setupListeners() {
            const toggleBtn = document.getElementById('sidebar-toggle');
            const mobileBtn = document.getElementById('mobile-sidebar-toggle');
            
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => this.toggle());
            }
            
            if (mobileBtn) {
                mobileBtn.addEventListener('click', () => {
                    // On mobile, open the overlay modal instead
                    if (window.innerWidth <= 768) {
                        openMobileOverlay();
                    } else {
                        this.toggleMobile();
                    }
                });
            }
        },

        /**
         * Setup resize handle
         */
        setupResize() {
            const sidebar = document.getElementById('ide-sidebar');
            if (!sidebar || sidebar.querySelector('.sidebar-resize-handle')) return;
            
            // Restore saved width from localStorage (shared across modes)
            const savedWidth = localStorage.getItem('ide-sidebar-width');
            if (savedWidth && !state.sidebarCollapsed) {
                // Apply with slight delay to ensure DOM is ready
                setTimeout(() => {
                    sidebar.style.width = savedWidth;
                }, 10);
            }
            
            const handle = document.createElement('div');
            handle.className = 'sidebar-resize-handle';
            sidebar.appendChild(handle);
            
            let isResizing = false;
            let startX = 0;
            let startWidth = 0;
            
            handle.addEventListener('mousedown', (e) => {
                isResizing = true;
                startX = e.clientX;
                startWidth = sidebar.offsetWidth;
                handle.classList.add('resizing');
                document.body.style.cursor = 'col-resize';
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isResizing) return;
                
                const deltaX = e.clientX - startX;
                const newWidth = startWidth + deltaX;
                const minWidth = 150;
                const maxWidth = 400;
                
                // Clamp and apply directly (smooth like terminal resize)
                const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
                sidebar.style.width = `${clampedWidth}px`;
            });
            
            document.addEventListener('mouseup', () => {
                if (isResizing) {
                    isResizing = false;
                    handle.classList.remove('resizing');
                    document.body.style.cursor = '';
                    
                    // Save width to localStorage (shared across modes)
                    localStorage.setItem('ide-sidebar-width', sidebar.style.width);
                }
            });
        },

        /**
         * Handle responsive behavior
         */
        handleResize() {
            const width = window.innerWidth;
            const sidebar = document.getElementById('ide-sidebar');
            const toggleBtn = document.getElementById('sidebar-toggle');
            const mobileBtn = document.getElementById('mobile-sidebar-toggle');
            
            if (!sidebar) return;
            
            const isMobile = width <= 768;
            
            // Respect user's saved collapsed state - don't auto-collapse/expand anymore
            // Update UI to match current state
            if (state.sidebarCollapsed) {
                sidebar.classList.add('collapsed');
                if (toggleBtn) {
                    toggleBtn.innerHTML = icons.chevronRight;
                    toggleBtn.title = 'Expand';
                }
            } else {
                sidebar.classList.remove('collapsed');
                if (toggleBtn) {
                    toggleBtn.innerHTML = icons.chevronLeft;
                    toggleBtn.title = 'Collapse';
                }
            }
            
            // Update button visibility for mobile/desktop transitions
            if (mobileBtn) {
                mobileBtn.style.display = isMobile ? 'inline-flex' : 'none';
            }
            if (toggleBtn) {
                toggleBtn.style.display = isMobile ? 'none' : 'flex';
            }
            
            // Restore terminal height after layout change
            setTimeout(() => {
                const consoleEl = document.getElementById('console');
                const savedHeight = localStorage.getItem('ide-terminal-height');
                if (consoleEl && savedHeight) {
                    consoleEl.style.height = savedHeight;
                }
            }, 10);
        }
    };

    /**
     * Build the IDE HTML structure
     */
    /**
     * Build the IDE HTML structure with unified sidebar
     */
    function buildIDE() {
        const app = document.getElementById('code-editor-app');
        
        const modeTitle = {
            python: 'Python Editor',
            web: 'Web Editor'
        }[state.currentMode] || 'Code Editor';
        
        const actionButtons = state.currentMode === 'python' 
            ? `<button class="ide-btn ide-btn-run primary" id="run-code">
                   ${icons.play}<span>Run</span>
               </button>
               <button class="ide-btn ide-btn-stop" id="stop-code" style="display: none;">
                   ${icons.stop}<span>Stop</span>
               </button>`
            : `<button class="ide-btn ide-btn-run primary" id="refresh-preview">
                   ${icons.refresh}<span>Refresh</span>
               </button>`;
        
        const sidebarIcon = state.currentMode === 'python' ? icons.file : icons.globe;
        const sidebarTitle = state.currentMode === 'python' ? 'Files' : 'Environments';
        
        app.innerHTML = `
            <div class="ide-toolbar md-header--shadow">
                <div class="ide-toolbar-left">
                    <button class="mobile-sidebar-btn" id="mobile-sidebar-toggle" title="Toggle ${sidebarTitle}">
                        ${sidebarIcon}
                    </button>
                    <div class="ide-mode-switcher">
                        <button class="mode-btn ${state.currentMode === 'python' ? 'active' : ''}" data-mode="python">
                            Python
                        </button>
                        <button class="mode-btn ${state.currentMode === 'web' ? 'active' : ''}" data-mode="web">
                            Web
                        </button>
                    </div>
                    <div class="ide-title">${modeTitle}</div>
                </div>
                <div class="ide-toolbar-actions">
                    ${actionButtons}
                    ${state.currentMode === 'python' ? `
                    <button class="ide-btn ide-btn-new" id="new-file">
                        ${icons.plus}<span>New</span>
                    </button>
                    ` : ''}
                    <button class="ide-btn ide-btn-save" id="save-all">
                        ${icons.save}<span>Save</span>
                    </button>
                </div>
            </div>
            
            <div class="ide-workspace ${state.currentMode === 'python' ? 'python-mode' : 'web-mode'}">
                ${Sidebar.create(state.currentMode)}
                
                <div class="ide-editor-area">
                    ${state.currentMode === 'web' ? `
                    <div class="web-layout">
                        <div class="web-editors">
                            <div class="web-editor-tabs">
                                <button class="web-tab ${state.webFiles.current === 'html' ? 'active' : ''}" data-web-file="html">
                                    HTML
                                </button>
                                <button class="web-tab ${state.webFiles.current === 'css' ? 'active' : ''}" data-web-file="css">
                                    CSS
                                </button>
                                <button class="web-tab ${state.webFiles.current === 'js' ? 'active' : ''}" data-web-file="js">
                                    JavaScript
                                </button>
                            </div>
                            <div id="monaco-editor" class="web-monaco"></div>
                            <div class="web-editors-resize-handle"></div>
                        </div>
                        <div class="web-preview">
                            <div class="preview-header">Live Preview</div>
                            <iframe id="preview-iframe" sandbox="allow-scripts allow-modals"></iframe>
                        </div>
                    </div>
                    ` : `
                    <div class="editor-tabs" id="editor-tabs"></div>
                    <div class="editor-container">
                        <div id="monaco-editor"></div>
                        <div class="editor-empty-state" id="empty-state">
                            <div class="editor-empty-state-icon">${icons.file}</div>
                            <div class="editor-empty-state-text">No file selected</div>
                            <div class="editor-empty-state-hint">Create a new file or select one from the sidebar</div>
                        </div>
                    </div>
                    `}
                    ${state.currentMode === 'python' ? `
                    <div class="resize-handle" id="resize-handle"></div>
                    <div class="ide-console" id="console">
                        <div class="console-header" id="console-header">
                            <div class="console-title">Terminal</div>
                            <div class="console-actions">
                                <button class="console-btn" id="clear-console">Clear</button>
                            </div>
                        </div>
                        <div class="console-output" id="console-output"></div>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="keyboard-hint" id="keyboard-hint"></div>
            
            <!-- Mobile Overlay Modal -->
            <div class="mobile-overlay" id="mobile-overlay">
                <div class="mobile-overlay-header">
                    <div class="mobile-overlay-title" id="mobile-overlay-title">
                        ${state.currentMode === 'python' ? icons.file : icons.globe}
                        <span>${state.currentMode === 'python' ? 'Files' : 'Environments'}</span>
                    </div>
                    <button class="mobile-overlay-close" id="mobile-overlay-close">
                        ${icons.x}
                    </button>
                </div>
                <div class="mobile-overlay-content" id="mobile-overlay-content">
                    <!-- Content will be populated dynamically -->
                </div>
            </div>
        `;

        // Set up mode switcher
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => switchMode(btn.dataset.mode));
        });

        // Universal save button
        document.getElementById('save-all').addEventListener('click', () => {
            if (state.currentMode === 'python') {
                saveAllFiles();
            } else if (state.currentMode === 'web') {
                promptSaveEnvironment();
                updateWebPreview();
            }
        });

        // Setup unified sidebar
        Sidebar.setupListeners();
        Sidebar.setupResize();
        
        // Ensure sidebar state is properly applied after rebuild
        Sidebar.handleResize();

        // Set up event listeners based on current mode
        if (state.currentMode === 'python') {
            document.getElementById('run-code').addEventListener('click', runCode);
            document.getElementById('stop-code').addEventListener('click', stopCode);
            const newFileBtn = document.getElementById('new-file');
            if (newFileBtn) {
                newFileBtn.addEventListener('click', showNewFileInput);
            }
            document.getElementById('console-header').addEventListener('click', toggleConsole);
            document.getElementById('clear-console').addEventListener('click', clearConsole);
            const newFileInput = document.getElementById('new-file-input');
            if (newFileInput) {
                newFileInput.addEventListener('keydown', handleNewFileInput);
            }
            
        } else if (state.currentMode === 'web') {
            document.getElementById('refresh-preview').addEventListener('click', () => {
                // Save environment before refreshing
                saveWebFiles();
                updateWebPreview();
            });
            
            // Web tab switcher
            document.querySelectorAll('.web-tab').forEach(tab => {
                tab.addEventListener('click', () => switchWebFile(tab.dataset.webFile));
            });
            
            // Environment management
            const saveEnvBtn = document.getElementById('save-env');
            const envNameInput = document.getElementById('env-name-input');
            
            if (saveEnvBtn && envNameInput) {
                saveEnvBtn.addEventListener('click', () => {
                    const name = envNameInput.value.trim();
                    if (name) {
                        saveEnvironment(name);
                        envNameInput.value = '';
                    }
                });
                
                // Allow Enter key to save environment
                envNameInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const name = e.target.value.trim();
                        if (name) {
                            saveEnvironment(name);
                            e.target.value = '';
                        }
                    }
                });
            }
            
            // Load environment list
            updateEnvironmentList();
            
            // Setup web editors resize handle for Web mode
            setupWebEditorsResize();
        }
        
        // Render file list for Python mode
        if (state.currentMode === 'python') {
            renderFileList();
            
            // Setup console resize handle for Python mode
            setupResizeHandle();
        }
        
        // Setup mobile overlay
        setupMobileOverlay();
    }

    /**
     * Initialize Monaco Editor
     */
    async function initMonaco() {
        return new Promise((resolve, reject) => {
            // Wait for DOM to be ready
            const editorElement = document.getElementById('monaco-editor');
            if (!editorElement) {
                console.error('[IDE] monaco-editor element not found');
                reject(new Error('monaco-editor element not found'));
                return;
            }

            // Wait for Monaco's AMD loader to be ready
            const waitForRequire = () => {
                if (typeof require === 'undefined') {
                    setTimeout(waitForRequire, 50);
                    return;
                }
                
                require.config({ 
                    paths: { 
                        'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' 
                    } 
                });

                require(['vs/editor/editor.main'], function() {
                    // Determine theme based on Material theme
                    const isDark = document.querySelector('[data-md-color-scheme="slate"]') !== null;
                    const theme = isDark ? 'vs-dark' : 'vs';

                    // Dispose existing editor if it exists
                    if (state.editor) {
                        state.editor.dispose();
                    }

                    state.editor = monaco.editor.create(editorElement, {
                        value: '',
                        language: 'python',
                        theme: theme,
                        fontSize: 13,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        minimap: { enabled: true },
                        scrollbar: {
                            useShadows: false,
                            verticalScrollbarSize: 10,
                            horizontalScrollbarSize: 10
                        },
                        padding: { top: 4, bottom: 4 }
                    });

                    // Listen for content changes
                    state.editor.onDidChangeModelContent(() => {
                        // Only mark as modified if we're not programmatically loading content
                        if (state.currentFile && !state.isLoadingContent) {
                            markAsModified(state.currentFile);
                        }
                    });

                    // Listen for theme changes
                    const observer = new MutationObserver(() => {
                        const isDark = document.querySelector('[data-md-color-scheme="slate"]') !== null;
                        monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs');
                    });
                    
                    observer.observe(document.documentElement, {
                        attributes: true,
                        attributeFilter: ['data-md-color-scheme']
                    });

                    console.log('[IDE] Monaco Editor initialized');
                    resolve();
                });
            };
            
            // Start waiting for require
            waitForRequire();
        });
    }

    /**
     * Mode Management
     */
    function switchMode(newMode) {
        if (state.currentMode === newMode) return;
        
        // Save current state
        if (state.currentMode === 'python') {
            saveFiles();
        } else if (state.currentMode === 'web') {
            saveWebFiles();
        }
        
        state.currentMode = newMode;
        
        // Save mode to localStorage
        localStorage.setItem('ide-current-mode', newMode);
        
        // Rebuild IDE with new mode
        buildIDE();
        
        // Reinitialize Monaco if needed
        if (state.editor) {
            state.editor.dispose();
            state.editor = null;
        }
        initMonaco().then(() => {
            // Initialize mode-specific content after editor is ready
            initializeMode();
        });
    }

    function initializeMode() {
        // Check for imported code FIRST before loading any files
        checkImportedCode();
        
        if (state.currentMode === 'python') {
            // Load Python files
            if (Object.keys(state.files).length === 0) {
                createFile(DEFAULT_FILES.python.name, DEFAULT_FILES.python.content, DEFAULT_FILES.python.type);
            }
            
            // Open first file
            const firstFile = Object.keys(state.files)[0];
            if (firstFile && state.editor) {
                openFile(firstFile);
            }
        } else if (state.currentMode === 'web') {
            // Load web files FIRST
            loadWebFiles();
            
            // Initialize web editor with HTML
            if (state.editor) {
                const currentFile = state.webFiles.current || 'html';
                const languageMap = {
                    html: 'html',
                    css: 'css',
                    js: 'javascript'
                };
                
                // Ensure we have content to display
                const content = state.webFiles[currentFile];
                if (!content) {
                    console.warn('[IDE] No content for', currentFile, 'using default');
                    state.webFiles[currentFile] = DEFAULT_FILES[currentFile].content;
                }
                
                monaco.editor.setModelLanguage(state.editor.getModel(), languageMap[currentFile]);
                state.isLoadingContent = true;
                state.editor.setValue(state.webFiles[currentFile]);
                state.isLoadingContent = false;
                state.editor.updateOptions({ readOnly: false });
                
                // Update preview on every change
                state.editor.onDidChangeModelContent(() => {
                    state.webFiles[state.webFiles.current] = state.editor.getValue();
                    updateWebPreview();
                });
                
                console.log('[IDE] Web editor initialized with', currentFile, 'length:', state.webFiles[currentFile].length);
            }
            
            updateWebPreview();
        }
    }

    /**
     * Web IDE Functions
     */
    function loadWebFiles() {
        try {
            const stored = localStorage.getItem(WEB_STORAGE_KEY);
            if (stored) {
                const savedFiles = JSON.parse(stored);
                // Use saved values only if they have content, otherwise use defaults
                state.webFiles.html = (savedFiles.html && savedFiles.html.trim()) ? savedFiles.html : DEFAULT_FILES.html.content;
                state.webFiles.css = (savedFiles.css && savedFiles.css.trim()) ? savedFiles.css : DEFAULT_FILES.css.content;
                state.webFiles.js = (savedFiles.js && savedFiles.js.trim()) ? savedFiles.js : DEFAULT_FILES.js.content;
                state.webFiles.current = 'html';
            } else {
                // Use defaults - always ensure we have content
                state.webFiles.html = DEFAULT_FILES.html.content;
                state.webFiles.css = DEFAULT_FILES.css.content;
                state.webFiles.js = DEFAULT_FILES.js.content;
                state.webFiles.current = 'html';
            }
            
            console.log('[IDE] Loaded web files');
        } catch (e) {
            console.error('[IDE] Failed to load web files:', e);
            // Fallback to defaults on error
            state.webFiles.html = DEFAULT_FILES.html.content;
            state.webFiles.css = DEFAULT_FILES.css.content;
            state.webFiles.js = DEFAULT_FILES.js.content;
            state.webFiles.current = 'html';
        }
    }

    function saveWebFiles() {
        try {
            // Save current editor content
            if (state.webFiles.current && state.editor) {
                state.webFiles[state.webFiles.current] = state.editor.getValue();
            }
            
            const toSave = {
                html: state.webFiles.html,
                css: state.webFiles.css,
                js: state.webFiles.js
            };
            
            localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(toSave));
            console.log('[IDE] Saved web files');
            showHint('Web files saved ✓');
        } catch (e) {
            console.error('[IDE] Failed to save web files:', e);
        }
    }

    /**
     * Web Environment Management
     */
    function getEnvironments() {
        try {
            const stored = localStorage.getItem(WEB_ENVIRONMENTS_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('[IDE] Failed to load environments:', e);
            return {};
        }
    }

    function saveEnvironment(name) {
        if (!name || !name.trim()) {
            showHint('Environment name required', true);
            return;
        }

        try {
            // Save current editor content first
            if (state.webFiles.current && state.editor) {
                state.webFiles[state.webFiles.current] = state.editor.getValue();
            }

            const environments = getEnvironments();
            environments[name] = {
                html: state.webFiles.html || '',
                css: state.webFiles.css || '',
                js: state.webFiles.js || '',
                timestamp: Date.now()
            };

            localStorage.setItem(WEB_ENVIRONMENTS_KEY, JSON.stringify(environments));
            localStorage.setItem(CURRENT_ENV_KEY, name);
            
            console.log('[IDE] Saved environment:', name);
            showHint(`Environment "${name}" saved ✓`);
            
            // Refresh environment list if visible
            updateEnvironmentList();
        } catch (e) {
            console.error('[IDE] Failed to save environment:', e);
            showHint('Failed to save environment', true);
        }
    }

    function loadEnvironment(name) {
        try {
            const environments = getEnvironments();
            const env = environments[name];

            if (!env) {
                showHint('Environment not found', true);
                return;
            }

            state.webFiles.html = env.html || '';
            state.webFiles.css = env.css || '';
            state.webFiles.js = env.js || '';

            // Update editor with current file
            if (state.editor && state.webFiles.current) {
                state.isLoadingContent = true;
                state.editor.setValue(state.webFiles[state.webFiles.current] || '');
                state.isLoadingContent = false;
            }

            // Save as current files
            saveWebFiles();
            
            // Update preview
            updateWebPreview();
            
            localStorage.setItem(CURRENT_ENV_KEY, name);
            console.log('[IDE] Loaded environment:', name);
            showHint(`Environment "${name}" loaded ✓`);
            
            // Refresh environment list
            updateEnvironmentList();
        } catch (e) {
            console.error('[IDE] Failed to load environment:', e);
            showHint('Failed to load environment', true);
        }
    }

    function deleteEnvironment(name) {
        if (!confirm(`Delete environment "${name}"?`)) {
            return;
        }

        try {
            const environments = getEnvironments();
            delete environments[name];

            localStorage.setItem(WEB_ENVIRONMENTS_KEY, JSON.stringify(environments));
            
            // Clear current environment if it was deleted
            const currentEnv = localStorage.getItem(CURRENT_ENV_KEY);
            if (currentEnv === name) {
                localStorage.removeItem(CURRENT_ENV_KEY);
            }

            console.log('[IDE] Deleted environment:', name);
            showHint(`Environment "${name}" deleted`);
            
            // Refresh environment list
            updateEnvironmentList();
        } catch (e) {
            console.error('[IDE] Failed to delete environment:', e);
            showHint('Failed to delete environment', true);
        }
    }

    function updateEnvironmentList() {
        const container = document.getElementById('environment-list');
        if (!container) return;

        const environments = getEnvironments();
        const currentEnv = localStorage.getItem(CURRENT_ENV_KEY);
        
        const envNames = Object.keys(environments).sort();
        
        if (envNames.length === 0) {
            container.innerHTML = '<div class="env-empty">No saved environments</div>';
            return;
        }

        container.innerHTML = envNames.map(name => {
            const env = environments[name];
            const isCurrent = name === currentEnv;
            const date = new Date(env.timestamp).toLocaleDateString();
            
            return `
                <div class="env-item ${isCurrent ? 'current' : ''}" data-env="${name}">
                    <div class="env-info">
                        <div class="env-name">${name}</div>
                        <div class="env-date">${date}</div>
                    </div>
                    <div class="env-actions">
                        <button class="env-btn env-load" data-env="${name}" title="Load">
                            ${icons.refresh}
                        </button>
                        <button class="env-btn env-delete" data-env="${name}" title="Delete">
                            ${icons.trash}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners
        container.querySelectorAll('.env-load').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                loadEnvironment(btn.dataset.env);
            });
        });

        container.querySelectorAll('.env-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteEnvironment(btn.dataset.env);
            });
        });
    }

    function switchWebFile(fileType) {
        if (!state.editor) return;
        
        // Save current file content
        state.webFiles[state.webFiles.current] = state.editor.getValue();
        
        // Switch to new file
        state.webFiles.current = fileType;
        
        const languageMap = {
            html: 'html',
            css: 'css',
            js: 'javascript'
        };
        
        // Ensure file has content (use empty string if undefined)
        const content = state.webFiles[fileType] || '';
        
        monaco.editor.setModelLanguage(state.editor.getModel(), languageMap[fileType]);
        state.isLoadingContent = true;
        state.editor.setValue(content);
        state.isLoadingContent = false;
        
        // Update active tab
        document.querySelectorAll('.web-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.webFile === fileType);
        });
    }

    function updateWebPreview() {
        const iframe = document.getElementById('preview-iframe');
        if (!iframe) return;
        
        // Combine HTML, CSS, and JS
        const html = state.webFiles.html || '';
        const css = state.webFiles.css || '';
        const js = state.webFiles.js || '';
        
        // Create complete HTML document
        const fullHTML = html.replace('</head>', `<style>${css}</style></head>`)
                             .replace('</body>', `<script>${js}</script></body>`);
        
        // Update iframe
        const blob = new Blob([fullHTML], { type: 'text/html' });
        iframe.src = URL.createObjectURL(blob);
    }

    /**
     * File Management
     */
    function loadFiles() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                state.files = JSON.parse(stored);
                console.log(`[IDE] Loaded ${Object.keys(state.files).length} files from storage`);
            }
        } catch (e) {
            console.error('[IDE] Failed to load files:', e);
        }
    }

    function saveFiles() {
        try {
            // Save current editor content before persisting
            if (state.currentFile && state.editor) {
                state.files[state.currentFile].content = state.editor.getValue();
            }
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.files));
            console.log('[IDE] Saved files to storage');
            
            // Clear modified flags
            state.modified.clear();
            renderTabs();
            
            showHint('All files saved ✓');
        } catch (e) {
            console.error('[IDE] Failed to save files:', e);
            showHint('Failed to save files', true);
        }
    }

    function createFile(name, content = '', type = 'exec') {
        // Ensure .py extension
        if (!name.endsWith('.py')) {
            name += '.py';
        }

        // Check if file already exists
        if (state.files[name]) {
            showHint('File already exists', true);
            return;
        }

        state.files[name] = {
            content: content || `# ${name}\n\n`,
            type: type,
            created: Date.now()
        };

        renderFileList();
        openFile(name);
        saveFiles();
        
        console.log(`[IDE] Created file: ${name}`);
    }

    function deleteFile(name) {
        if (!confirm(`Delete ${name}?`)) {
            return;
        }

        delete state.files[name];
        state.modified.delete(name);
        
        // Close tab if open
        const tabIndex = state.tabs.indexOf(name);
        if (tabIndex !== -1) {
            state.tabs.splice(tabIndex, 1);
        }
        
        // Switch to another file if this was current
        if (state.currentFile === name) {
            state.currentFile = null;
            if (state.tabs.length > 0) {
                openFile(state.tabs[0]);
            } else {
                state.editor.setValue('');
                updateEmptyState();
            }
        }

        renderFileList();
        renderTabs();
        saveFiles();
        
        console.log(`[IDE] Deleted file: ${name}`);
    }

    function renameFile(oldName, newName) {
        if (!newName.endsWith('.py')) {
            newName += '.py';
        }

        if (state.files[newName]) {
            showHint('File already exists', true);
            return;
        }

        state.files[newName] = state.files[oldName];
        delete state.files[oldName];
        
        // Update tabs
        const tabIndex = state.tabs.indexOf(oldName);
        if (tabIndex !== -1) {
            state.tabs[tabIndex] = newName;
        }
        
        // Update current file
        if (state.currentFile === oldName) {
            state.currentFile = newName;
        }
        
        // Update modified state
        if (state.modified.has(oldName)) {
            state.modified.delete(oldName);
            state.modified.add(newName);
        }

        renderFileList();
        renderTabs();
        saveFiles();
        
        console.log(`[IDE] Renamed file: ${oldName} -> ${newName}`);
    }

    function duplicateFile(name) {
        const baseName = name.replace('.py', '');
        let newName = `${baseName}_copy.py`;
        let counter = 2;
        
        while (state.files[newName]) {
            newName = `${baseName}_copy${counter}.py`;
            counter++;
        }

        state.files[newName] = {
            content: state.files[name].content,
            type: state.files[name].type,
            created: Date.now()
        };

        renderFileList();
        openFile(newName);
        saveFiles();
        
        console.log(`[IDE] Duplicated file: ${name} -> ${newName}`);
    }

    function openFile(name) {
        if (!state.files[name]) {
            return;
        }

        // Save current file content before switching
        if (state.currentFile && state.editor) {
            state.files[state.currentFile].content = state.editor.getValue();
        }

        state.currentFile = name;
        
        // Add to tabs if not already there
        if (!state.tabs.includes(name)) {
            state.tabs.push(name);
        }

        // Load content into editor
        const file = state.files[name];
        state.isLoadingContent = true;
        state.editor.setValue(file.content);
        state.isLoadingContent = false;
        
        // Show template warning if needed
        showTemplateWarning(file.type);
        
        // Update UI
        updateEmptyState();
        renderFileList();
        renderTabs();
        
        console.log(`[IDE] Opened file: ${name}`);
    }

    function closeTab(name) {
        const tabIndex = state.tabs.indexOf(name);
        if (tabIndex === -1) return;

        // Check if modified
        if (state.modified.has(name)) {
            if (!confirm(`${name} has unsaved changes. Close anyway?`)) {
                return;
            }
        }

        state.tabs.splice(tabIndex, 1);
        state.modified.delete(name);

        // If closing current file, switch to another
        if (state.currentFile === name) {
            if (state.tabs.length > 0) {
                // Open the previous tab, or the next one
                const newIndex = Math.max(0, tabIndex - 1);
                openFile(state.tabs[newIndex]);
            } else {
                state.currentFile = null;
                state.isLoadingContent = true;
                state.editor.setValue('');
                state.isLoadingContent = false;
                updateEmptyState();
            }
        }

        renderTabs();
    }

    function markAsModified(name) {
        state.modified.add(name);
        renderTabs();
    }

    /**
     * UI Rendering
     */
    function renderFileList() {
        const fileList = document.getElementById('file-list');
        if (!fileList) return; // Only render if in Python mode
        
        fileList.innerHTML = '';

        const fileNames = Object.keys(state.files).sort();
        
        fileNames.forEach(name => {
            const file = state.files[name];
            const item = document.createElement('div');
            item.className = 'file-item';
            if (name === state.currentFile) {
                item.classList.add('active');
            }
            if (file.type === 'template' || file.type === 'error') {
                item.classList.add('template');
            }

            item.innerHTML = `
                <span class="file-icon"></span>
                <span class="file-name">${name}</span>
                <button class="file-delete" data-file="${name}"></button>
            `;

            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('file-delete')) {
                    openFile(name);
                }
            });

            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                showContextMenu(e, name);
            });

            const deleteBtn = item.querySelector('.file-delete');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteFile(name);
            });

            fileList.appendChild(item);
        });
    }

    function renderTabs() {
        // Only render tabs in Python mode (Web mode has different tab system)
        if (state.currentMode !== 'python') {
            return;
        }
        
        const tabsContainer = document.getElementById('editor-tabs');
        if (!tabsContainer) {
            return;
        }
        
        tabsContainer.innerHTML = '';

        state.tabs.forEach(name => {
            const tab = document.createElement('div');
            tab.className = 'editor-tab';
            if (name === state.currentFile) {
                tab.classList.add('active');
            }
            if (state.modified.has(name)) {
                tab.classList.add('modified');
            }

            tab.innerHTML = `
                <span class="editor-tab-name">${name}</span>
                <button class="editor-tab-close" data-tab="${name}"></button>
            `;

            tab.addEventListener('click', (e) => {
                if (!e.target.classList.contains('editor-tab-close')) {
                    openFile(name);
                }
            });

            const closeBtn = tab.querySelector('.editor-tab-close');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeTab(name);
            });

            tabsContainer.appendChild(tab);
        });
    }

    function updateEmptyState() {
        const emptyState = document.getElementById('empty-state');
        const editorElement = document.getElementById('monaco-editor');
        
        if (state.currentFile) {
            emptyState.style.display = 'none';
            editorElement.style.display = 'block';
        } else {
            emptyState.style.display = 'flex';
            editorElement.style.display = 'none';
        }
    }

    function showTemplateWarning(type) {
        // Remove existing warning
        const existing = document.querySelector('.template-warning');
        if (existing) {
            existing.remove();
        }

        if (type === 'template' || type === 'error') {
            const warning = document.createElement('div');
            warning.className = 'template-warning';
            warning.textContent = type === 'template' 
                ? 'This is template code and may not run as-is'
                : 'This is an error example for educational purposes';
            
            const editorContainer = document.querySelector('.editor-container');
            editorContainer.insertBefore(warning, editorContainer.firstChild);
        }
    }

    /**
     * Context Menu
     */
    function showContextMenu(event, fileName) {
        // Remove existing menu
        const existing = document.querySelector('.context-menu');
        if (existing) {
            existing.remove();
        }

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.left = event.pageX + 'px';
        menu.style.top = event.pageY + 'px';

        menu.innerHTML = `
            <div class="context-menu-item rename">Rename</div>
            <div class="context-menu-item duplicate">Duplicate</div>
            <div class="context-menu-item delete">Delete</div>
        `;

        menu.querySelector('.rename').addEventListener('click', () => {
            const newName = prompt('Enter new name:', fileName);
            if (newName && newName !== fileName) {
                renameFile(fileName, newName);
            }
            menu.remove();
        });

        menu.querySelector('.duplicate').addEventListener('click', () => {
            duplicateFile(fileName);
            menu.remove();
        });

        menu.querySelector('.delete').addEventListener('click', () => {
            deleteFile(fileName);
            menu.remove();
        });

        document.body.appendChild(menu);

        // Close on click outside
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 0);
    }

    /**
     * Code Execution (using Web Worker)
     */
    async function runCode() {
        if (!state.currentFile) {
            showHint('No file selected', true);
            return;
        }

        if (state.executing) {
            return; // Already running
        }

        const code = state.editor.getValue();
        const runBtn = document.getElementById('run-code');
        const stopBtn = document.getElementById('stop-code');
        
        // Expand console if collapsed
        if (state.consoleCollapsed) {
            toggleConsole();
        }

        // Show executing state
        state.executing = true;
        state.shouldStop = false;
        runBtn.style.display = 'none';
        stopBtn.style.display = 'inline-flex';
        
        clearConsole();
        appendConsole('Running code...', 'info');

        try {
            // Initialize worker if needed
            if (!state.pyodideWorker) {
                appendConsole('Loading Python environment (this may take a moment)...', 'info');
                await initPyodideWorker();
            }

            // Write all Python files to Pyodide filesystem before execution
            // This allows files to import each other
            if (Object.keys(state.files).length > 0) {
                // Extract just the content strings from file objects
                const fileContents = {};
                for (const [filename, fileObj] of Object.entries(state.files)) {
                    fileContents[filename] = fileObj.content || '';
                }
                
                state.pyodideWorker.postMessage({
                    type: 'write_files',
                    data: { files: fileContents }
                });
            }

            // Execute code in worker
            state.pyodideWorker.postMessage({
                type: 'execute',
                data: { code }
            });

        } catch (error) {
            appendConsole(`Execution failed: ${error.message}`, 'error');
            state.executing = false;
            runBtn.style.display = 'inline-flex';
            stopBtn.style.display = 'none';
        }
    }

    /**
     * Initialize Pyodide Web Worker
     */
    function initPyodideWorker() {
        return new Promise((resolve, reject) => {
            try {
                // Create worker - determine path based on current page location
                const currentPath = window.location.pathname;
                const assetsPath = currentPath.includes('/code-editor/') 
                    ? '../assets/pyodide-worker.js'  // From code-editor page
                    : 'assets/pyodide-worker.js';     // From root
                
                console.log('[IDE] Loading worker from:', assetsPath);
                state.pyodideWorker = new Worker(assetsPath);
                
                // Handle worker messages
                state.pyodideWorker.onmessage = function(e) {
                    const { type, data } = e.data;
                    
                    switch (type) {
                        case 'ready':
                            appendConsole('Python environment ready!', 'success');
                            resolve();
                            break;
                        
                        case 'progress':
                            appendConsole(data.message, 'info');
                            break;
                        
                        case 'output':
                            appendConsole(data.text, data.stream);
                            break;
                        
                        case 'input_request':
                            handleInputRequest(data.prompt);
                            break;
                        
                        case 'complete':
                            handleExecutionComplete(data);
                            break;
                        
                        case 'error':
                            appendConsole(`Error: ${data.message}`, 'error');
                            if (!state.executing) {
                                reject(new Error(data.message));
                            }
                            break;
                        
                        case 'info':
                            appendConsole(data.message, 'info');
                            break;
                        
                        case 'files_written':
                            // Files successfully written to Pyodide filesystem
                            console.log(`[IDE] ${data.count} file(s) written to Pyodide FS`);
                            break;
                    }
                };
                
                state.pyodideWorker.onerror = function(error) {
                    appendConsole(`Worker error: ${error.message}`, 'error');
                    reject(error);
                };
                
                // Start loading
                state.pyodideWorker.postMessage({ type: 'load' });
                
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Handle input request from worker
     */
    function handleInputRequest(prompt) {
        const consoleOutput = document.getElementById('console-output');
        
        // Only show prompt line if a prompt was provided
        if (prompt) {
            const promptLine = document.createElement('div');
            promptLine.className = 'console-line info';
            promptLine.textContent = prompt;
            consoleOutput.appendChild(promptLine);
        }
        
        // Create input line with text field
        const inputLine = document.createElement('div');
        inputLine.className = 'console-input-line';
        inputLine.innerHTML = `
            <span class="console-input-prompt">></span>
            <input type="text" class="console-input-field" id="console-input-field" autocomplete="off">
        `;
        consoleOutput.appendChild(inputLine);
        
        // Focus the input field
        const inputField = inputLine.querySelector('.console-input-field');
        inputField.focus();
        
        // Scroll to bottom
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
        
        // Handle input submission
        inputField.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const value = inputField.value;
                
                // Remove the input field
                inputLine.remove();
                
                // Show what was entered
                const echoLine = document.createElement('div');
                echoLine.className = 'console-line stdout';
                echoLine.textContent = value;
                consoleOutput.appendChild(echoLine);
                
                // Scroll to bottom
                consoleOutput.scrollTop = consoleOutput.scrollHeight;
                
                // Send value to worker
                if (state.pyodideWorker) {
                    state.pyodideWorker.postMessage({
                        type: 'input_response',
                        data: { value: value }
                    });
                }
            } else if (e.key === 'Escape') {
                // Cancel input
                inputLine.remove();
                
                appendConsole('Input cancelled', 'error');
                
                // Send cancellation to worker
                if (state.pyodideWorker) {
                    state.pyodideWorker.postMessage({
                        type: 'input_response',
                        data: { value: null }
                    });
                }
            }
        });
    }

    /**
     * Handle execution completion
     */
    function handleExecutionComplete(output) {
        const runBtn = document.getElementById('run-code');
        const stopBtn = document.getElementById('stop-code');
        
        // Note: stdout/stderr are already streamed during execution
        // Only add result and error messages here
        
        if (output.result !== null && output.result !== undefined && String(output.result) !== 'undefined') {
            appendConsole(`→ ${output.result}`, 'success');
        }
        
        if (output.error) {
            appendConsole(`Error: ${output.error}`, 'error');
        }
        
        // Check if there was any output
        const hasOutput = output.stdout.length > 0 || output.stderr.length > 0 || 
                        output.error || (output.result !== null && output.result !== undefined);
        
        if (!hasOutput) {
            appendConsole('Code executed successfully (no output)', 'info');
        }
        
        // Reset state
        state.executing = false;
        state.shouldStop = false;
        runBtn.style.display = 'inline-flex';
        stopBtn.style.display = 'none';
    }

    /**
     * Stop code execution
     */
    function stopCode() {
        if (state.executing) {
            state.shouldStop = true;
            appendConsole('Stopping execution...', 'info');
            
            if (state.pyodideWorker) {
                // Send interrupt to worker
                state.pyodideWorker.postMessage({ type: 'interrupt' });
                
                // Force terminate after 2 seconds if still running
                setTimeout(() => {
                    if (state.executing) {
                        appendConsole('Force stopping worker...', 'info');
                        state.pyodideWorker.terminate();
                        state.pyodideWorker = null;
                        
                        // Reset UI
                        const runBtn = document.getElementById('run-code');
                        const stopBtn = document.getElementById('stop-code');
                        state.executing = false;
                        runBtn.style.display = 'inline-flex';
                        stopBtn.style.display = 'none';
                        
                        appendConsole('Execution forcefully stopped', 'error');
                    }
                }, 2000);
            }
        }
    }

    /**
     * Console Management
     */
    function appendConsole(text, type = 'stdout') {
        const consoleOutput = document.getElementById('console-output');
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.textContent = text;
        consoleOutput.appendChild(line);
        
        // Auto-scroll to bottom
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
    
    // Expose appendConsole and prompt globally for Pyodide access
    window.appendConsole = appendConsole;
    window.prompt = window.prompt || function(message) {
        // Fallback prompt implementation if not available
        return window.confirm(message + '\n\n(Click OK to continue)') ? '' : null;
    };

    function clearConsole() {
        const consoleOutput = document.getElementById('console-output');
        consoleOutput.innerHTML = '';
    }

    function toggleConsole() {
        const consoleEl = document.getElementById('console');
        state.consoleCollapsed = !state.consoleCollapsed;
        
        if (state.consoleCollapsed) {
            consoleEl.classList.add('collapsed');
            consoleEl.style.height = '';
        } else {
            consoleEl.classList.remove('collapsed');
        }
    }

    /**
     * UI Controls - Unified Sidebar System
     */
    function toggleSidebar() {
        Sidebar.toggle();
    }

    function promptSaveEnvironment() {
        const currentEnv = localStorage.getItem(CURRENT_ENV_KEY);
        let name = currentEnv;
        
        // If no current environment, prompt for name
        if (!name) {
            name = prompt('Enter environment name:');
        }
        
        if (name && name.trim()) {
            saveEnvironment(name.trim());
        }
    }

    function saveEnvironmentSilently() {
        const currentEnv = localStorage.getItem(CURRENT_ENV_KEY);
        let name = currentEnv;
        
        // If no current environment, use a default name
        if (!name) {
            name = 'Untitled';
        }
        
        saveEnvironment(name);
    }

    function showNewFileInput() {
        const input = document.getElementById('new-file-input');
        input.style.display = 'block';
        input.focus();
        input.value = '';
    }

    function handleNewFileInput(e) {
        const input = e.target;
        
        if (e.key === 'Enter') {
            const name = input.value.trim();
            if (name) {
                createFile(name);
            }
            input.style.display = 'none';
            input.value = '';
        } else if (e.key === 'Escape') {
            input.style.display = 'none';
            input.value = '';
        }
    }

    function saveAllFiles() {
        if (state.currentMode === 'python') {
            saveFiles();
        } else if (state.currentMode === 'web') {
            saveEnvironmentSilently();
            // Update preview after saving in Web mode
            updateWebPreview();
        }
    }

    function showHint(text, isError = false) {
        const hint = document.getElementById('keyboard-hint');
        hint.textContent = text;
        hint.classList.add('show');
        if (isError) {
            hint.style.background = 'var(--md-error-fg-color, #ef5350)';
        } else {
            hint.style.background = 'var(--md-default-fg-color)';
        }
        
        setTimeout(() => {
            hint.classList.remove('show');
        }, 3000);
    }

    /**
     * Resize Handle
     */
    function setupResizeHandle() {
        const handle = document.getElementById('resize-handle');
        const consoleEl = document.getElementById('console');
        
        if (!handle || !consoleEl) return;
        
        // Restore saved height from localStorage with a slight delay to ensure CSS is applied
        setTimeout(() => {
            const savedHeight = localStorage.getItem('ide-terminal-height');
            if (savedHeight) {
                consoleEl.style.height = savedHeight;
            }
        }, 10);
        
        let isResizing = false;
        let startY = 0;
        let startHeight = 0;

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startY = e.pageY;
            startHeight = consoleEl.offsetHeight;
            handle.classList.add('resizing');
            document.body.style.cursor = 'ns-resize';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const delta = startY - e.pageY;
            const newHeight = Math.max(100, Math.min(600, startHeight + delta));
            consoleEl.style.height = newHeight + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                handle.classList.remove('resizing');
                document.body.style.cursor = '';
                
                // Save height to localStorage (just the numeric value)
                const heightValue = consoleEl.style.height;
                localStorage.setItem('ide-terminal-height', heightValue);
            }
        });
    }

    /**
     * Setup Web Editors Resize Handle
     */
    function setupWebEditorsResize() {
        const handle = document.querySelector('.web-editors-resize-handle');
        const layout = document.querySelector('.web-layout');
        const editors = document.querySelector('.web-editors');
        const preview = document.querySelector('.web-preview');
        
        if (!handle || !layout || !editors || !preview) return;
        
        // Restore saved width from localStorage
        const savedWidth = localStorage.getItem('ide-web-editors-width');
        if (savedWidth) {
            layout.style.gridTemplateColumns = `${savedWidth} 1fr`;
        }
        
        let isResizing = false;
        let startX = 0;
        let startEditorsWidth = 0;
        let startPreviewWidth = 0;

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startEditorsWidth = editors.offsetWidth;
            startPreviewWidth = preview.offsetWidth;
            handle.classList.add('resizing');
            document.body.style.cursor = 'col-resize';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const delta = e.clientX - startX;
            const newEditorsWidth = startEditorsWidth + delta;
            
            // Enforce minimum widths (editor min 300px, preview min 300px)
            const layoutWidth = layout.offsetWidth;
            const minEditorsWidth = 300;
            const maxEditorsWidth = layoutWidth - 300; // Leave 300px for preview
            
            // Clamp and apply (smooth like terminal resize)
            const clampedWidth = Math.max(minEditorsWidth, Math.min(maxEditorsWidth, newEditorsWidth));
            
            // Set editors to fixed width, let preview flex to fill remaining space
            layout.style.gridTemplateColumns = `${clampedWidth}px 1fr`;
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                handle.classList.remove('resizing');
                document.body.style.cursor = '';
                
                // Save width to localStorage
                const currentColumns = layout.style.gridTemplateColumns;
                const width = currentColumns.split(' ')[0]; // Extract first column width
                localStorage.setItem('ide-web-editors-width', width);
            }
        });
    }

    /**
     * Keyboard Shortcuts
     */
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S: Save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                saveAllFiles();
            }
            
            // Ctrl/Cmd + Enter: Run
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                runCode();
            }
            
            // Ctrl/Cmd + N: New File
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                showNewFileInput();
            }
            
            // Ctrl/Cmd + W: Close Tab
            if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
                e.preventDefault();
                if (state.currentFile) {
                    closeTab(state.currentFile);
                }
            }
        });

        console.log('[IDE] Keyboard shortcuts enabled');
        console.log('  Ctrl+S: Save All');
        console.log('  Ctrl+Enter: Run Code');
        console.log('  Ctrl+N: New File');
        console.log('  Ctrl+W: Close Tab');
    }

    /**
     * Check for imported code from textbook
     */
    function checkImportedCode() {
        try {
            const importData = sessionStorage.getItem('code_editor_import');
            if (importData) {
                const data = JSON.parse(importData);
                
                // Determine which mode to use based on language
                const isWebLanguage = ['html', 'css', 'javascript', 'js'].includes(data.language.toLowerCase());
                const isPythonLanguage = data.language.toLowerCase() === 'python';
                
                if (isWebLanguage) {
                    // Switch to Web mode if not already there
                    if (state.currentMode !== 'web') {
                        state.currentMode = 'web';
                        buildIDE();
                        if (state.editor) {
                            state.editor.dispose();
                            state.editor = null;
                        }
                        initMonaco().then(() => {
                            initializeMode();
                        });
                    }
                    
                    // Import into the appropriate web file
                    const langMap = {
                        'html': 'html',
                        'css': 'css',
                        'javascript': 'js',
                        'js': 'js'
                    };
                    
                    const webFileType = langMap[data.language.toLowerCase()] || 'html';
                    state.webFiles[webFileType] = data.code;
                    state.webFiles.current = webFileType;
                    
                    // Update editor if it exists
                    if (state.editor) {
                        const monacoLangMap = {
                            'html': 'html',
                            'css': 'css',
                            'js': 'javascript'
                        };
                        monaco.editor.setModelLanguage(state.editor.getModel(), monacoLangMap[webFileType]);
                        state.isLoadingContent = true;
                        state.editor.setValue(data.code);
                        state.isLoadingContent = false;
                        
                        // Update active tab
                        document.querySelectorAll('.web-tab').forEach(tab => {
                            tab.classList.toggle('active', tab.dataset.webFile === webFileType);
                        });
                        
                        // Update preview
                        updateWebPreview();
                    }
                    
                    saveWebFiles();
                    showHint(`${data.language.toUpperCase()} code imported from textbook`);
                    
                } else if (isPythonLanguage) {
                    // Switch to Python mode if not already there
                    if (state.currentMode !== 'python') {
                        state.currentMode = 'python';
                        buildIDE();
                        if (state.editor) {
                            state.editor.dispose();
                            state.editor = null;
                        }
                        initMonaco().then(() => {
                            initializeMode();
                        });
                    }
                    
                    // Create a new Python file with imported code
                    const fileName = `imported_${Date.now()}.py`;
                    createFile(fileName, data.code, data.type || 'exec');
                    showHint('Python code imported from textbook');
                    
                } else {
                    // For other languages (bash, shell, etc.), default to Python mode as reference
                    if (state.currentMode !== 'python') {
                        state.currentMode = 'python';
                        buildIDE();
                        if (state.editor) {
                            state.editor.dispose();
                            state.editor = null;
                        }
                        initMonaco().then(() => {
                            initializeMode();
                        });
                    }
                    
                    const ext = data.language.toLowerCase() === 'bash' || data.language.toLowerCase() === 'shell' ? 'sh' : 'txt';
                    const fileName = `imported_${Date.now()}.${ext}`;
                    createFile(fileName, data.code, 'template');
                    showHint(`${data.language} code imported as reference`);
                }
                
                // Clear the import
                sessionStorage.removeItem('code_editor_import');
                
                console.log('[IDE] Imported code from textbook:', data.language);
            }
        } catch (e) {
            console.error('[IDE] Failed to import code:', e);
        }
    }

    /**
     * Handle responsive sidebar collapsing based on window width
     * Delegates to unified Sidebar system
     */
    function handleResponsiveCollapse() {
        Sidebar.handleResize();
    }

    /**
     * Reset mobile button to default icon when sidebar closes
     */
    function resetMobileButton(buttonId) {
        // No longer needed - handled by Sidebar system
    }

    /**
     * Setup window resize listener for responsive behavior
     */
    function setupWindowResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            // Debounce resize events
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResponsiveCollapse, 250);
        });
    }

    /**
     * Mobile Overlay Functions
     */
    function setupMobileOverlay() {
        const closeBtn = document.getElementById('mobile-overlay-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeMobileOverlay);
        }
    }

    function openMobileOverlay() {
        const overlay = document.getElementById('mobile-overlay');
        const content = document.getElementById('mobile-overlay-content');
        
        if (!overlay || !content) return;
        
        // Populate content based on mode
        if (state.currentMode === 'python') {
            content.innerHTML = createMobilePythonContent();
            // Setup event listeners for file items
            setupMobileFileListeners();
        } else if (state.currentMode === 'web') {
            content.innerHTML = createMobileWebContent();
            // Setup event listeners for environments
            setupMobileEnvironmentListeners();
        }
        
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileOverlay() {
        const overlay = document.getElementById('mobile-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function createMobilePythonContent() {
        const fileNames = Object.keys(state.files).sort();
        
        let html = '<div style="margin-bottom: 1rem;">';
        html += '<button class="ide-btn primary" id="mobile-new-file" style="width: 100%; justify-content: center;">';
        html += `${icons.plus}<span>New File</span>`;
        html += '</button></div>';
        
        html += '<div class="file-list">';
        
        fileNames.forEach(name => {
            const file = state.files[name];
            const isActive = name === state.currentFile;
            const isTemplate = file.type === 'template' || file.type === 'error';
            
            html += `
                <div class="file-item ${isActive ? 'active' : ''} ${isTemplate ? 'template' : ''}" data-file="${name}">
                    <span class="file-icon"></span>
                    <span class="file-name">${name}</span>
                    <button class="file-delete" data-file="${name}"></button>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    function createMobileWebContent() {
        const envList = JSON.parse(localStorage.getItem('web-environments') || '{}');
        const envNames = Object.keys(envList).sort();
        
        let html = '<div class="web-env-actions">';
        html += '<input type="text" class="env-name-input" id="mobile-env-name-input" placeholder="Environment name">';
        html += `<button class="ide-btn ide-btn-small primary" id="mobile-save-env" style="width: 100%; justify-content: center;">${icons.save}<span>Save Environment</span></button>`;
        html += '</div>';
        
        html += '<div class="environment-list">';
        
        if (envNames.length === 0) {
            html += '<div class="env-empty">No saved environments yet</div>';
        } else {
            envNames.forEach(name => {
                const env = envList[name];
                const isCurrent = name === state.currentEnvironment;
                
                html += `
                    <div class="env-item ${isCurrent ? 'current' : ''}" data-env="${name}">
                        <div class="env-info">
                            <div class="env-name">${name}</div>
                            <div class="env-date">${new Date(env.timestamp).toLocaleDateString()}</div>
                        </div>
                        <div class="env-actions">
                            <button class="env-btn env-load" data-env="${name}">
                                ${icons.play}
                            </button>
                            <button class="env-btn env-delete" data-env="${name}">
                                ${icons.trash}
                            </button>
                        </div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        return html;
    }

    function setupMobileFileListeners() {
        // New file button
        const newFileBtn = document.getElementById('mobile-new-file');
        if (newFileBtn) {
            newFileBtn.addEventListener('click', () => {
                const name = prompt('Enter file name (e.g., script.py)');
                if (name && name.trim()) {
                    createFile(name.trim());
                    closeMobileOverlay();
                }
            });
        }
        
        // File items
        document.querySelectorAll('.mobile-overlay .file-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('file-delete')) {
                    openFile(item.dataset.file);
                    closeMobileOverlay();
                }
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.mobile-overlay .file-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteFile(btn.dataset.file);
                // Refresh overlay content
                const content = document.getElementById('mobile-overlay-content');
                if (content) {
                    content.innerHTML = createMobilePythonContent();
                    setupMobileFileListeners();
                }
            });
        });
    }

    function setupMobileEnvironmentListeners() {
        // Save environment button
        const saveBtn = document.getElementById('mobile-save-env');
        const nameInput = document.getElementById('mobile-env-name-input');
        
        if (saveBtn && nameInput) {
            saveBtn.addEventListener('click', () => {
                const name = nameInput.value.trim();
                if (name) {
                    saveEnvironment(name);
                    nameInput.value = '';
                    // Refresh overlay content
                    const content = document.getElementById('mobile-overlay-content');
                    if (content) {
                        content.innerHTML = createMobileWebContent();
                        setupMobileEnvironmentListeners();
                    }
                }
            });
            
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const name = e.target.value.trim();
                    if (name) {
                        saveEnvironment(name);
                        e.target.value = '';
                        // Refresh overlay content
                        const content = document.getElementById('mobile-overlay-content');
                        if (content) {
                            content.innerHTML = createMobileWebContent();
                            setupMobileEnvironmentListeners();
                        }
                    }
                }
            });
        }
        
        // Load environment buttons
        document.querySelectorAll('.mobile-overlay .env-load').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                loadEnvironment(btn.dataset.env);
                closeMobileOverlay();
            });
        });
        
        // Delete environment buttons
        document.querySelectorAll('.mobile-overlay .env-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Delete environment "${btn.dataset.env}"?`)) {
                    deleteEnvironment(btn.dataset.env);
                    // Refresh overlay content
                    const content = document.getElementById('mobile-overlay-content');
                    if (content) {
                        content.innerHTML = createMobileWebContent();
                        setupMobileEnvironmentListeners();
                    }
                }
            });
        });
    }

    /**
     * Setup window resize listener for responsive behavior
     */
    function setupWindowResizeListener_OLD() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            // Debounce resize events
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResponsiveCollapse, 250);
        });
    }

    /**
     * Initialize when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initIDE);
    } else {
        initIDE();
    }

})();
