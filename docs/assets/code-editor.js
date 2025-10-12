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
        sidebarCollapsed: false,
        modified: new Set(),
        tabs: [],
        currentMode: 'python', // 'python', 'web', or 'terminal'
        webFiles: { html: '', css: '', js: '' }
    };

    // Constants
    const STORAGE_KEY = 'python_ide_files';
    const WEB_STORAGE_KEY = 'web_ide_files';
    const TERMINAL_STORAGE_KEY = 'terminal_commands';
    
    const DEFAULT_FILES = {
        python: {
            name: 'main.py',
            content: '# Welcome to the Python IDE!\n# Write your code here and click Run to execute it.\n\nprint("Hello, World!")\n',
            type: 'exec'
        },
        html: {
            name: 'index.html',
            content: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Web Page</title>\n    <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n    <h1>Welcome to the Web IDE!</h1>\n    <p>Edit HTML, CSS, and JavaScript to see live preview.</p>\n    <button onclick="greet()">Click Me</button>\n    \n    <script src="script.js"></script>\n</body>\n</html>\n'
        },
        css: {
            name: 'styles.css',
            content: '/* CSS Styles */\nbody {\n    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n    max-width: 800px;\n    margin: 0 auto;\n    padding: 2rem;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n}\n\nh1 {\n    font-size: 2.5rem;\n    margin-bottom: 1rem;\n}\n\nbutton {\n    background: white;\n    color: #667eea;\n    border: none;\n    padding: 0.75rem 1.5rem;\n    font-size: 1rem;\n    border-radius: 0.5rem;\n    cursor: pointer;\n    transition: transform 0.2s;\n}\n\nbutton:hover {\n    transform: translateY(-2px);\n}\n'
        },
        js: {
            name: 'script.js',
            content: '// JavaScript Code\nfunction greet() {\n    const name = prompt("What\'s your name?");\n    if (name) {\n        alert(`Hello, ${name}! Welcome to the Web IDE!`);\n    }\n}\n\nconsole.log("Web IDE loaded successfully!");\n'
        },
        terminal: {
            name: 'commands.sh',
            content: '# Common Terminal Commands\n\n# Navigation\ncd ~/projects\nls -la\npwd\n\n# File Operations\nmkdir new_folder\ntouch new_file.txt\ncp source.txt destination.txt\nmv old_name.txt new_name.txt\nrm unwanted_file.txt\n\n# Python\npython3 --version\npip install requests\npython3 script.py\n\n# Git\ngit status\ngit add .\ngit commit -m "Update files"\ngit push origin main\n'
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
        
        // Check for imported code from textbook pages
        checkImportedCode();
        
        // Set up keyboard shortcuts
        setupKeyboardShortcuts();
        
        console.log('[IDE] Initialized successfully');
    }

    // SVG Icons (Feather icons style - no color, stroke only)
    const icons = {
        play: '<svg><polyline points="5 3 19 12 5 21 5 3"></polyline></svg>',
        refresh: '<svg><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>',
        plus: '<svg><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
        save: '<svg><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>',
        file: '<svg><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>',
        trash: '<svg><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
        code: '<svg><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
        terminal: '<svg><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>',
        globe: '<svg><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
        chevronLeft: '<svg><polyline points="15 18 9 12 15 6"></polyline></svg>',
        chevronRight: '<svg><polyline points="9 18 15 12 9 6"></polyline></svg>'
    };

    /**
     * Build the IDE HTML structure
     */
    function buildIDE() {
        const app = document.getElementById('code-editor-app');
        
        const modeTitle = {
            python: 'Python IDE',
            web: 'Web IDE',
            terminal: 'Terminal'
        }[state.currentMode] || 'Code Editor';
        
        const actionButtons = state.currentMode === 'python' 
            ? `<button class="ide-btn ide-btn-run primary" id="run-code">
                   ${icons.play}<span>Run</span>
               </button>`
            : state.currentMode === 'web'
            ? `<button class="ide-btn ide-btn-run primary" id="refresh-preview">
                   ${icons.refresh}<span>Refresh</span>
               </button>`
            : '';
        
        app.innerHTML = `
            <div class="ide-toolbar">
                <div class="ide-toolbar-left">
                    <div class="ide-mode-switcher">
                        <button class="mode-btn ${state.currentMode === 'python' ? 'active' : ''}" data-mode="python">
                            Python
                        </button>
                        <button class="mode-btn ${state.currentMode === 'web' ? 'active' : ''}" data-mode="web">
                            Web
                        </button>
                        <button class="mode-btn ${state.currentMode === 'terminal' ? 'active' : ''}" data-mode="terminal">
                            Terminal
                        </button>
                    </div>
                    <div class="ide-title">${modeTitle}</div>
                </div>
                <div class="ide-toolbar-actions">
                    ${actionButtons}
                    ${state.currentMode !== 'terminal' ? `
                    <button class="ide-btn ide-btn-new" id="new-file">
                        ${icons.plus}<span>New</span>
                    </button>
                    <button class="ide-btn ide-btn-save" id="save-all">
                        ${icons.save}<span>Save</span>
                    </button>` : ''}
                </div>
            </div>
            
            <div class="ide-workspace">
                <aside class="ide-sidebar" id="sidebar">
                    <div class="sidebar-header">
                        <span class="sidebar-title">Files</span>
                        <button class="sidebar-toggle" id="toggle-sidebar">◀</button>
                    </div>
                    <div class="file-list" id="file-list"></div>
                    ${state.currentMode !== 'terminal' ? `
                    <div class="new-file-form">
                        <input type="text" class="new-file-input" id="new-file-input" 
                               placeholder="${state.currentMode === 'python' ? 'new_file.py' : 'index.html'}" 
                               style="display: none;">
                    </div>` : ''}
                </aside>
                
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
                        </div>
                        <div class="web-preview">
                            <div class="preview-header">Live Preview</div>
                            <iframe id="preview-iframe" sandbox="allow-scripts"></iframe>
                        </div>
                    </div>
                    ` : `
                    <div class="editor-tabs" id="editor-tabs"></div>
                    <div class="editor-container">
                        <div id="monaco-editor"></div>
                        <div class="editor-empty-state" id="empty-state">
                            <div class="editor-empty-state-icon">${icons.file}</div>
                            <div class="editor-empty-state-text">No file selected</div>
                            <div class="editor-empty-state-hint">
                                ${state.currentMode === 'terminal' 
                                    ? 'View common terminal commands and syntax reference' 
                                    : 'Create a new file or select one from the sidebar'}
                            </div>
                        </div>
                    </div>
                    `}
                    ${state.currentMode === 'python' ? `
                    <div class="resize-handle" id="resize-handle"></div>
                    <div class="ide-console" id="console">
                        <div class="console-header" id="console-header">
                            <div class="console-title">Console Output</div>
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

        // Set up event listeners based on current mode
        if (state.currentMode === 'python') {
            document.getElementById('run-code').addEventListener('click', runCode);
            document.getElementById('new-file').addEventListener('click', showNewFileInput);
            document.getElementById('save-all').addEventListener('click', saveAllFiles);
            document.getElementById('toggle-sidebar').addEventListener('click', toggleSidebar);
            document.getElementById('console-header').addEventListener('click', toggleConsole);
            document.getElementById('clear-console').addEventListener('click', clearConsole);
            document.getElementById('new-file-input').addEventListener('keydown', handleNewFileInput);
            setupResizeHandle();
        } else if (state.currentMode === 'web') {
            document.getElementById('refresh-preview').addEventListener('click', updateWebPreview);
            document.getElementById('new-file').addEventListener('click', showNewFileInput);
            document.getElementById('save-all').addEventListener('click', saveAllFiles);
            document.getElementById('toggle-sidebar').addEventListener('click', toggleSidebar);
            document.getElementById('new-file-input').addEventListener('keydown', handleNewFileInput);
            
            // Web tab switcher
            document.querySelectorAll('.web-tab').forEach(tab => {
                tab.addEventListener('click', () => switchWebFile(tab.dataset.webFile));
            });
        } else if (state.currentMode === 'terminal') {
            document.getElementById('toggle-sidebar').addEventListener('click', toggleSidebar);
        }
        
        // Render file list
        renderFileList();
        
        // Initialize mode-specific content
        initializeMode();
    }

    /**
     * Initialize Monaco Editor
     */
    async function initMonaco() {
        return new Promise((resolve, reject) => {
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
                    fontSize: 14,
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
                    padding: { top: 16, bottom: 16 }
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
        initMonaco();
    }

    function initializeMode() {
        if (state.currentMode === 'python') {
            // Load Python files
            if (Object.keys(state.files).length === 0) {
                createFile(DEFAULT_FILES.python.name, DEFAULT_FILES.python.content, DEFAULT_FILES.python.type);
            }
            
            // Open first file
            const firstFile = Object.keys(state.files)[0];
            if (firstFile) {
                openFile(firstFile);
            }
        } else if (state.currentMode === 'web') {
            // Load web files
            loadWebFiles();
            
            // Initialize web editor with HTML
            state.webFiles.current = 'html';
            if (state.editor) {
                const language = 'html';
                monaco.editor.setModelLanguage(state.editor.getModel(), language);
                state.editor.setValue(state.webFiles.html);
                
                // Update preview on every change
                state.editor.onDidChangeModelContent(() => {
                    state.webFiles[state.webFiles.current] = state.editor.getValue();
                    updateWebPreview();
                });
            }
            
            updateWebPreview();
        } else if (state.currentMode === 'terminal') {
            // Load terminal commands as read-only
            if (state.editor) {
                monaco.editor.setModelLanguage(state.editor.getModel(), 'shell');
                state.editor.setValue(DEFAULT_FILES.terminal.content);
                state.editor.updateOptions({ readOnly: true });
            }
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
                state.webFiles = { ...state.webFiles, ...savedFiles, current: 'html' };
            } else {
                // Use defaults
                state.webFiles.html = DEFAULT_FILES.html.content;
                state.webFiles.css = DEFAULT_FILES.css.content;
                state.webFiles.js = DEFAULT_FILES.js.content;
                state.webFiles.current = 'html';
            }
        } catch (e) {
            console.error('[IDE] Failed to load web files:', e);
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
        
        monaco.editor.setModelLanguage(state.editor.getModel(), languageMap[fileType]);
        state.editor.setValue(state.webFiles[fileType]);
        
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
        const tabsContainer = document.getElementById('editor-tabs');
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

        try {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
            document.head.appendChild(script);

            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });

            state.pyodide = await loadPyodide({
                indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
            });

            console.log('[IDE] Pyodide loaded');
            return state.pyodide;
        } catch (error) {
            state.pyodideLoading = false;
            throw error;
        }
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
        } else {
            sidebar.classList.remove('collapsed');
        }
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
        saveFiles();
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
                
                // Create a new file with imported code
                const fileName = `imported_${Date.now()}.py`;
                createFile(fileName, data.code, data.type);
                
                // Clear the import
                sessionStorage.removeItem('code_editor_import');
                
                showHint('Code imported from textbook');
                console.log('[IDE] Imported code from textbook');
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
