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
        editor: null,
        consoleCollapsed: false,
        sidebarCollapsed: window.innerWidth <= 768, // Start collapsed on mobile
        webSidebarCollapsed: window.innerWidth <= 768, // Web env sidebar
        modified: new Set(),
        tabs: [],
        currentMode: 'python', // 'python' or 'web'
        webFiles: { html: '', css: '', js: '', current: 'html' }
    };

    // Constants
    const STORAGE_KEY = 'python_ide_files';
    const WEB_STORAGE_KEY = 'web_ide_files';
    const WEB_ENVIRONMENTS_KEY = 'web_ide_environments';
    const CURRENT_ENV_KEY = 'web_ide_current_env';
    
    const DEFAULT_FILES = {
        python: {
            name: 'main.py',
            content: '# Welcome to the Python IDE!\n# Write your code here and click Run to execute it.\n\nprint("Hello, World!")\n',
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
        
        console.log('[IDE] Initialized successfully');
    }

    // SVG Icons (Feather icons style - no color, stroke only)
    const icons = {
        play: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
        refresh: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>',
        plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
        save: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,
        file: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>',
        trash: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
        code: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-code"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
        terminal: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-terminal"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>',
        globe: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-globe"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
        chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>',
        chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>'
    };

    /**
     * Build the IDE HTML structure
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
               </button>`
            : `<button class="ide-btn ide-btn-run primary" id="refresh-preview">
                   ${icons.refresh}<span>Refresh</span>
               </button>`;
        
        app.innerHTML = `
            <div class="ide-toolbar">
                <div class="ide-toolbar-left">
                    ${state.currentMode === 'python' ? `
                    <button class="mobile-files-toggle" id="mobile-files-toggle" title="Toggle Files">
                        ${icons.file}
                    </button>
                    ` : state.currentMode === 'web' ? `
                    <button class="mobile-files-toggle" id="mobile-env-toggle" title="Toggle Environments">
                        ${icons.globe}
                    </button>
                    ` : ''}
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
            
            <div class="ide-workspace ${state.currentMode === 'python' ? 'python-mode' : state.currentMode === 'web' ? 'web-mode' : ''}">
                ${state.currentMode === 'python' ? `
                <aside class="ide-sidebar" id="sidebar">
                    <div class="sidebar-header">
                        <span class="sidebar-title">Files</span>
                        <button class="sidebar-toggle" id="toggle-sidebar">◀</button>
                    </div>
                    <div class="file-list" id="file-list"></div>
                    <div class="new-file-form">
                        <input type="text" class="new-file-input" id="new-file-input" 
                               placeholder="new_file.py" 
                               style="display: none;">
                    </div>
                </aside>
                ` : ''}
                
                <div class="ide-editor-area">
                    ${state.currentMode === 'web' ? `
                    <div class="web-layout">
                        <div class="web-sidebar ${state.webSidebarCollapsed ? 'collapsed' : ''}" id="web-sidebar">
                            <div class="web-sidebar-header">
                                <span class="web-sidebar-title">Environments</span>
                                <button class="sidebar-toggle" id="toggle-web-sidebar">◀</button>
                            </div>
                            <div class="web-env-actions">
                                <input type="text" class="env-name-input" id="env-name-input" placeholder="Environment name">
                                <button class="ide-btn ide-btn-small" id="save-env">
                                    ${icons.save}<span>Save</span>
                                </button>
                            </div>
                            <div class="environment-list" id="environment-list"></div>
                        </div>
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
        `;

        // Set up mode switcher
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => switchMode(btn.dataset.mode));
        });

        // Universal save button - saves files in Python mode, environment in Web mode
        document.getElementById('save-all').addEventListener('click', () => {
            if (state.currentMode === 'python') {
                saveAllFiles();
            } else if (state.currentMode === 'web') {
                promptSaveEnvironment();
                // Update preview after saving in Web mode
                updateWebPreview();
            }
        });

        // Set up event listeners based on current mode
        if (state.currentMode === 'python') {
            document.getElementById('run-code').addEventListener('click', runCode);
            document.getElementById('new-file').addEventListener('click', showNewFileInput);
            document.getElementById('toggle-sidebar').addEventListener('click', toggleSidebar);
            document.getElementById('mobile-files-toggle').addEventListener('click', toggleSidebar);
            document.getElementById('console-header').addEventListener('click', toggleConsole);
            document.getElementById('clear-console').addEventListener('click', clearConsole);
            document.getElementById('new-file-input').addEventListener('keydown', handleNewFileInput);
            setupResizeHandle();
            
            // Close sidebar when clicking backdrop on mobile
            const workspace = document.querySelector('.ide-workspace');
            workspace.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && 
                    !state.sidebarCollapsed && 
                    e.target === workspace) {
                    toggleSidebar();
                }
            });
        } else if (state.currentMode === 'web') {
            document.getElementById('refresh-preview').addEventListener('click', () => {
                // Save environment before refreshing
                saveWebFiles();
                updateWebPreview();
            });
            document.getElementById('toggle-web-sidebar').addEventListener('click', toggleWebSidebar);
            document.getElementById('mobile-env-toggle').addEventListener('click', toggleWebSidebar);
            
            // Web tab switcher
            document.querySelectorAll('.web-tab').forEach(tab => {
                tab.addEventListener('click', () => switchWebFile(tab.dataset.webFile));
            });
            
            // Environment management
            document.getElementById('save-env').addEventListener('click', () => {
                const nameInput = document.getElementById('env-name-input');
                const name = nameInput.value.trim();
                if (name) {
                    saveEnvironment(name);
                    nameInput.value = '';
                }
            });
            
            // Allow Enter key to save environment
            document.getElementById('env-name-input').addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const name = e.target.value.trim();
                    if (name) {
                        saveEnvironment(name);
                        e.target.value = '';
                    }
                }
            });
            
            // Load environment list
            updateEnvironmentList();
            
            // Close sidebar when clicking backdrop on mobile
            const workspace = document.querySelector('.ide-workspace');
            workspace.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && 
                    !state.webSidebarCollapsed && 
                    e.target === workspace) {
                    toggleWebSidebar();
                }
            });
        }
        
        // Render file list
        renderFileList();
        
        // Setup resize handlers
        setupResizeHandlers();
    }

    /**
     * Setup resize handlers for sidebars and console
     */
    function setupResizeHandlers() {
        // Python mode: sidebar resize
        const pythonSidebar = document.querySelector('.ide-sidebar');
        if (pythonSidebar && !pythonSidebar.querySelector('.sidebar-resize-handle')) {
            const handle = document.createElement('div');
            handle.className = 'sidebar-resize-handle';
            pythonSidebar.appendChild(handle);
            setupHorizontalResize(pythonSidebar, handle);
        }

        // Python mode: console resize
        const console = document.querySelector('.ide-console');
        if (console && !console.querySelector('.console-resize-handle')) {
            const handle = document.createElement('div');
            handle.className = 'console-resize-handle';
            console.appendChild(handle);
            setupVerticalResize(console, handle);
        }

        // Web mode: web sidebar resize
        const webSidebar = document.querySelector('.web-sidebar');
        if (webSidebar && !webSidebar.querySelector('.web-sidebar-resize-handle')) {
            const handle = document.createElement('div');
            handle.className = 'web-sidebar-resize-handle';
            webSidebar.appendChild(handle);
            setupHorizontalResize(webSidebar, handle);
        }

        // Web mode: web editors resize
        const webEditors = document.querySelector('.web-editors');
        if (webEditors && !webEditors.querySelector('.web-editors-resize-handle')) {
            const handle = document.createElement('div');
            handle.className = 'web-editors-resize-handle';
            webEditors.appendChild(handle);
            setupHorizontalResize(webEditors, handle);
        }
    }

    /**
     * Setup horizontal resize for an element (sidebar)
     */
    function setupHorizontalResize(element, handle) {
        let isResizing = false;
        let startX = 0;
        let startWidth = 0;

        const onMouseDown = (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = element.offsetWidth;
            handle.classList.add('resizing');
            document.body.style.cursor = 'col-resize';
            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!isResizing) return;
            
            const deltaX = e.clientX - startX;
            const newWidth = startWidth + deltaX;
            
            // Get constraints
            const minWidth = parseInt(getComputedStyle(element).minWidth) || 150;
            let maxWidth = parseInt(getComputedStyle(element).maxWidth) || 600;
            
            // For web-editors, calculate max based on container and preview min-width
            if (element.classList.contains('web-editors')) {
                const container = element.closest('.web-layout');
                const preview = container?.querySelector('.web-preview');
                const sidebar = container?.querySelector('.web-sidebar');
                
                if (container && preview) {
                    const containerWidth = container.offsetWidth;
                    const sidebarWidth = sidebar ? sidebar.offsetWidth : 0;
                    const previewMinWidth = parseInt(getComputedStyle(preview).minWidth) || 300;
                    
                    // Max width = container - sidebar - preview min width - gaps
                    const calculatedMax = containerWidth - sidebarWidth - previewMinWidth - 20;
                    maxWidth = Math.min(maxWidth, calculatedMax);
                }
            }
            
            if (newWidth >= minWidth && newWidth <= maxWidth) {
                element.style.width = `${newWidth}px`;
            }
        };

        const onMouseUp = () => {
            if (isResizing) {
                isResizing = false;
                handle.classList.remove('resizing');
                document.body.style.cursor = '';
            }
        };

        handle.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    /**
     * Setup vertical resize for console
     */
    function setupVerticalResize(element, handle) {
        let isResizing = false;
        let startY = 0;
        let startHeight = 0;

        const onMouseDown = (e) => {
            isResizing = true;
            startY = e.clientY;
            startHeight = element.offsetHeight;
            handle.classList.add('resizing');
            document.body.style.cursor = 'ns-resize';
            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!isResizing) return;
            
            const deltaY = startY - e.clientY; // Inverted because we're resizing from top
            const newHeight = startHeight + deltaY;
            const minHeight = parseInt(getComputedStyle(element).minHeight) || 100;
            const maxHeight = parseInt(getComputedStyle(element).maxHeight) || 600;
            
            if (newHeight >= minHeight && newHeight <= maxHeight) {
                element.style.height = `${newHeight}px`;
            }
        };

        const onMouseUp = () => {
            if (isResizing) {
                isResizing = false;
                handle.classList.remove('resizing');
                document.body.style.cursor = '';
            }
        };

        handle.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    /**
     * Initialize Monaco Editor
     */
    async function initMonaco() {
        return new Promise((resolve, reject) => {
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

                    state.editor = monaco.editor.create(document.getElementById('monaco-editor'), {
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
                        if (state.currentFile) {
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
                state.editor.setValue(state.webFiles[currentFile]);
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
                state.editor.setValue(state.webFiles[state.webFiles.current] || '');
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
        state.editor.setValue(content);
        
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
        state.editor.setValue(file.content);
        
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
                state.editor.setValue('');
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
     * Code Execution
     */
    async function runCode() {
        if (!state.currentFile) {
            showHint('No file selected', true);
            return;
        }

        const code = state.editor.getValue();
        const runBtn = document.getElementById('run-code');
        
        // Expand console if collapsed
        if (state.consoleCollapsed) {
            toggleConsole();
        }

        // Show loading state
        runBtn.disabled = true;
        runBtn.innerHTML = '<span>Running...</span>';
        
        // Ensure console is expanded for progress visibility
        const consoleEl = document.getElementById('console');
        if (consoleEl && state.consoleCollapsed) {
            state.consoleCollapsed = false;
            consoleEl.classList.remove('collapsed');
        }
        
        clearConsole();
        appendConsole('Running code...', 'info');

        try {
            // Load Pyodide if not already loaded
            if (!state.pyodide) {
                appendConsole('Loading Python environment (this may take a moment)...', 'info');
                state.pyodide = await loadPyodide();
            }

            const output = await executePython(code);
            
            // Display output
            if (output.stdout.length > 0) {
                output.stdout.forEach(line => appendConsole(line, 'stdout'));
            }
            
            if (output.stderr.length > 0) {
                output.stderr.forEach(line => appendConsole(line, 'stderr'));
            }
            
            if (output.result !== null && output.result !== undefined && String(output.result) !== 'undefined') {
                appendConsole(`→ ${output.result}`, 'success');
            }
            
            if (output.error) {
                appendConsole(`Error: ${output.error}`, 'error');
            }
            
            if (!output.stdout.length && !output.stderr.length && !output.error && !output.result) {
                appendConsole('Code executed successfully (no output)', 'info');
            }

        } catch (error) {
            appendConsole(`Execution failed: ${error.message}`, 'error');
        } finally {
            runBtn.disabled = false;
            runBtn.innerHTML = '<span>Run Code</span>';
        }
    }

    async function loadPyodide() {
        if (state.pyodide) {
            return state.pyodide;
        }

        if (state.pyodideLoading) {
            // Wait for existing load to complete
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (state.pyodide) {
                        clearInterval(interval);
                        resolve(state.pyodide);
                    }
                }, 100);
            });
        }

        state.pyodideLoading = true;

        // Create progress indicator in console
        let progressId = null;
        let progressInterval = null;
        
        if (state.currentMode === 'python') {
            progressId = `pyodide-progress-${Date.now()}`;
            const progressHTML = `
                <div class="pyodide-progress" id="${progressId}">
                    <div class="pyodide-progress-text">Loading Python environment...</div>
                    <div class="pyodide-progress-bar">
                        <div class="pyodide-progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="pyodide-progress-percentage">0%</div>
                </div>
            `;
            const consoleOutput = document.getElementById('console-output');
            if (consoleOutput) {
                consoleOutput.insertAdjacentHTML('beforeend', progressHTML);
            }
        }

        try {
            // Suppress stackframe and error-stack-parser 404 errors (harmless Monaco loader issues)
            const originalError = console.error;
            const originalWarn = console.warn;
            
            console.error = function(...args) {
                const msg = args.join(' ');
                if (msg.includes('stackframe') || msg.includes('error-stack-parser') || msg.includes('404')) {
                    return; // Suppress these specific errors
                }
                originalError.apply(console, args);
            };
            
            console.warn = function(...args) {
                const msg = args.join(' ');
                if (msg.includes('stackframe') || msg.includes('error-stack-parser')) {
                    return;
                }
                originalWarn.apply(console, args);
            };

            // Simulate progress during loading
            let currentProgress = 0;
            if (progressId) {
                progressInterval = setInterval(() => {
                    if (currentProgress < 90) {
                        // Gradually increase progress (slows down as it approaches 90%)
                        const increment = (90 - currentProgress) * 0.1;
                        currentProgress += Math.max(increment, 2);
                        currentProgress = Math.min(currentProgress, 90);
                        updateProgress(progressId, Math.floor(currentProgress), 'Loading Python packages...');
                    }
                }, 200);
            }

            // Load Pyodide script
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
            document.head.appendChild(script);

            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });

            // Update progress
            if (progressId) {
                updateProgress(progressId, 30, 'Initializing Python runtime...');
            }

            // Initialize Pyodide
            state.pyodide = await window.loadPyodide({
                indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
            });

            // Stop progress simulation
            if (progressInterval) {
                clearInterval(progressInterval);
            }

            // Update progress to 100%
            if (progressId) {
                updateProgress(progressId, 100, 'Python ready!');
                setTimeout(() => {
                    const progressEl = document.getElementById(progressId);
                    if (progressEl) {
                        progressEl.style.transition = 'opacity 0.3s ease';
                        progressEl.style.opacity = '0';
                        setTimeout(() => progressEl.remove(), 300);
                    }
                }, 1000);
            }

            // Restore console methods
            console.error = originalError;
            console.warn = originalWarn;

            console.log('[IDE] Pyodide loaded');
            state.pyodideLoading = false;
            return state.pyodide;
        } catch (error) {
            state.pyodideLoading = false;
            
            // Stop progress simulation
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            
            // Show error in progress bar
            if (progressId) {
                const progressEl = document.getElementById(progressId);
                if (progressEl) {
                    progressEl.innerHTML = `
                        <div class="pyodide-progress-text" style="color: var(--md-error-fg-color);">
                            Failed to load Python: ${error.message}
                        </div>
                    `;
                }
            }
            
            throw error;
        }
    }

    function updateProgress(progressId, percent, message) {
        const progressEl = document.getElementById(progressId);
        if (!progressEl) return;

        const fill = progressEl.querySelector('.pyodide-progress-fill');
        const text = progressEl.querySelector('.pyodide-progress-text');
        const percentage = progressEl.querySelector('.pyodide-progress-percentage');

        if (fill) fill.style.width = `${percent}%`;
        if (text && message) text.textContent = message;
        if (percentage) percentage.textContent = `${percent}%`;
    }

    async function executePython(code) {
        const pyodide = state.pyodide;
        
        let output = {
            stdout: [],
            stderr: [],
            error: null,
            result: null
        };

        try {
            // Redirect stdout/stderr
            await pyodide.runPythonAsync(`
import sys
from io import StringIO

_stdout = StringIO()
_stderr = StringIO()
sys.stdout = _stdout
sys.stderr = _stderr
            `);

            // Run the code
            const result = await pyodide.runPythonAsync(code);

            // Get captured output
            const stdout = await pyodide.runPythonAsync('_stdout.getvalue()');
            const stderr = await pyodide.runPythonAsync('_stderr.getvalue()');

            output.stdout = stdout ? stdout.split('\n').filter(line => line) : [];
            output.stderr = stderr ? stderr.split('\n').filter(line => line) : [];
            output.result = result;

            // Restore stdout/stderr
            await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
            `);

        } catch (error) {
            output.error = error.message;
        }

        return output;
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

    function clearConsole() {
        const consoleOutput = document.getElementById('console-output');
        consoleOutput.innerHTML = '';
    }

    function toggleConsole() {
        const consoleEl = document.getElementById('console');
        state.consoleCollapsed = !state.consoleCollapsed;
        
        if (state.consoleCollapsed) {
            consoleEl.classList.add('collapsed');
            // Clear inline height when collapsing
            consoleEl.style.height = '';
        } else {
            consoleEl.classList.remove('collapsed');
        }
    }

    /**
     * UI Controls
     */
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        state.sidebarCollapsed = !state.sidebarCollapsed;
        
        if (state.sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            // Clear inline width when collapsing
            sidebar.style.width = '';
        } else {
            sidebar.classList.remove('collapsed');
        }
    }

    function toggleWebSidebar() {
        const sidebar = document.getElementById('web-sidebar');
        state.webSidebarCollapsed = !state.webSidebarCollapsed;
        
        if (state.webSidebarCollapsed) {
            sidebar.classList.add('collapsed');
            // Clear inline width when collapsing
            sidebar.style.width = '';
        } else {
            sidebar.classList.remove('collapsed');
        }
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
            const newHeight = Math.max(45, Math.min(600, startHeight + delta));
            consoleEl.style.height = newHeight + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                handle.classList.remove('resizing');
                document.body.style.cursor = '';
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
                        state.editor.setValue(data.code);
                        
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
     * Initialize when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initIDE);
    } else {
        initIDE();
    }

})();
