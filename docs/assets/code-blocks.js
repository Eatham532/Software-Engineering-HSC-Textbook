/**
 * Code Blocks - Execution and IDE Integration
 * 
 * Features:
 * - Adds Run and Open in Editor buttons to code blocks
 * - Handles Pyodide loading for in-browser Python execution
 * - Displays console output below code blocks
 * - Integrates with the full multi-language IDE
 * - Supports Python, HTML/CSS/JS, and Shell/Terminal blocks
 */

(function() {
    'use strict';

    // Pyodide state management
    let pyodideInstance = null;
    let pyodideLoading = false;
    let pyodideLoadPromise = null;

    // Language capabilities
    const LANGUAGE_CAPABILITIES = {
        python: {
            executable: true,
            ideTab: 'python',
            runnable: true
        },
        html: {
            executable: false,
            ideTab: 'web',
            runnable: false,
            preview: true
        },
        css: {
            executable: false,
            ideTab: 'web',
            runnable: false,
            preview: true
        },
        javascript: {
            executable: false,
            ideTab: 'web',
            runnable: false,
            preview: true
        },
        js: {
            executable: false,
            ideTab: 'web',
            runnable: false,
            preview: true
        }
    };

    /**
     * Load Pyodide (Python in WebAssembly)
     * Uses lazy loading - only loads when first needed
     */
    async function loadPyodide(outputElement = null) {
        if (pyodideInstance) {
            return pyodideInstance;
        }

        if (pyodideLoading) {
            // Wait for existing load to complete
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (pyodideInstance) {
                        clearInterval(interval);
                        resolve(pyodideInstance);
                    }
                }, 100);
            });
        }

        pyodideLoading = true;
        console.log('[CodeRunner] Loading Pyodide...');

        // Create progress indicator if output element provided
        let progressId = null;
        let progressInterval = null;
        
        if (outputElement) {
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
            outputElement.insertAdjacentHTML('beforeend', progressHTML);
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
            pyodideInstance = await window.loadPyodide({
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

            console.log('[CodeRunner] Pyodide loaded successfully');
            
            // Store in localStorage to indicate it's cached
            try {
                localStorage.setItem('pyodide_loaded', 'true');
            } catch (e) {
                console.warn('[CodeRunner] Could not access localStorage:', e);
            }

            pyodideLoading = false;
            return pyodideInstance;
        } catch (error) {
            console.error('[CodeRunner] Failed to load Pyodide:', error);
            pyodideLoading = false;
            pyodideLoadPromise = null;
            
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
        if (text) text.textContent = message;
        if (percentage) percentage.textContent = `${percent}%`;
    }


    async function executePythonCode(code, outputElement = null) {
        const pyodide = await loadPyodide(outputElement ? outputElement.querySelector('.code-output-content') : null);

        // Capture stdout and stderr
        let output = {
            stdout: [],
            stderr: [],
            error: null,
            result: null
        };

        try {
            // Setup stdout/stderr capture and async input support
            await pyodide.runPythonAsync(`
import sys
from io import StringIO
import builtins
import asyncio

_stdout = StringIO()
_stderr = StringIO()
_original_stdout = sys.stdout
_original_stderr = sys.stderr
_original_input = builtins.input

sys.stdout = _stdout
sys.stderr = _stderr

# Simple async input that prompts user
async def custom_input(prompt=''):
    """Custom input function for inline code blocks"""
    import js
    # Use browser prompt for simple inline examples
    value = js.window.prompt(prompt if prompt else 'Enter input:')
    if value is None:
        raise KeyboardInterrupt('Input cancelled')
    # Echo the input to output
    print(f'{value}')
    return str(value)

builtins.input = custom_input
            `);

            // Pre-process code to add 'await' before input() calls
            const processedCode = window.IDEUtils.preprocessInputCalls(code);

            // Run the user's code
            const result = await pyodide.runPythonAsync(processedCode);

            // Get captured output
            const stdout = await pyodide.runPythonAsync('_stdout.getvalue()');
            const stderr = await pyodide.runPythonAsync('_stderr.getvalue()');

            output.stdout = stdout ? stdout.split('\n').filter(line => line) : [];
            output.stderr = stderr ? stderr.split('\n').filter(line => line) : [];
            output.result = result;

            // Restore stdout/stderr/input
            await pyodide.runPythonAsync(`
sys.stdout = _original_stdout
sys.stderr = _original_stderr
builtins.input = _original_input
            `);

        } catch (error) {
            // Try to restore on error
            try {
                await pyodide.runPythonAsync(`
sys.stdout = _original_stdout
sys.stderr = _original_stderr
builtins.input = _original_input
                `);
            } catch (e) {
                // Ignore restoration errors
            }
            output.error = error.message;
        }

        return output;
    }

    /**
     * Create output display element
     */
    function createOutputDisplay(codeBlock) {
        const outputId = `output-${Math.random().toString(36).substr(2, 9)}`;
        const outputDiv = document.createElement('div');
        outputDiv.className = 'code-output';
        outputDiv.id = outputId;
        outputDiv.innerHTML = `
            <div class="code-output-header">
                <span class="code-output-title">Console Output</span>
                <button class="code-output-clear" title="Clear output">Clear</button>
            </div>
            <div class="code-output-content"></div>
        `;

        // Insert after the code block's parent
        const container = codeBlock.closest('.highlight');
        container.parentNode.insertBefore(outputDiv, container.nextSibling);

        // Clear button handler
        const clearBtn = outputDiv.querySelector('.code-output-clear');
        clearBtn.addEventListener('click', () => {
            const content = outputDiv.querySelector('.code-output-content');
            content.innerHTML = '';
        });

        return outputDiv;
    }

    /**
     * Display execution output
     */
    function displayOutput(outputElement, output) {
        const content = outputElement.querySelector('.code-output-content');
        content.innerHTML = '';

        // Display stdout
        if (output.stdout && output.stdout.length > 0) {
            output.stdout.forEach(line => {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'output-line output-stdout';
                lineDiv.textContent = line;
                content.appendChild(lineDiv);
            });
        }

        // Display stderr
        if (output.stderr && output.stderr.length > 0) {
            output.stderr.forEach(line => {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'output-line output-stderr';
                lineDiv.textContent = line;
                content.appendChild(lineDiv);
            });
        }

        // Display result if it's not None
        if (output.result !== null && output.result !== undefined && String(output.result) !== 'undefined') {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'output-line output-success';
            resultDiv.textContent = `→ ${output.result}`;
            content.appendChild(resultDiv);
        }

        // Display error
        if (output.error) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'output-line output-error';
            errorDiv.textContent = `Error: ${output.error}`;
            content.appendChild(errorDiv);
        }

        // Show info message if no output
        if (!output.stdout.length && !output.stderr.length && !output.error && !output.result) {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'output-line output-info';
            infoDiv.textContent = 'Code executed successfully (no output)';
            content.appendChild(infoDiv);
        }
    }

    /**
     * Handle Run button click
     */
    async function handleRunCode(button, codeBlock, code) {
        const outputElement = codeBlock.outputDisplay || createOutputDisplay(codeBlock);
        codeBlock.outputDisplay = outputElement;

        // Show loading state
        button.classList.add('loading');
        button.disabled = true;

        // Clear previous output
        const content = outputElement.querySelector('.code-output-content');
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'output-line output-info';
        loadingDiv.textContent = pyodideInstance ? 'Running...' : 'Loading Python environment...';
        content.innerHTML = '';
        content.appendChild(loadingDiv);

        try {
            const output = await executePythonCode(code, outputElement);
            displayOutput(outputElement, output);
        } catch (error) {
            content.innerHTML = '';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'output-line output-error';
            errorDiv.textContent = `Failed to execute: ${error.message}`;
            content.appendChild(errorDiv);
        } finally {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    /**
     * Get IDE tab name based on language
     */
    function getIDETab(language) {
        const webLangs = ['html', 'css', 'javascript', 'js'];
        
        if (webLangs.includes(language.toLowerCase())) {
            return 'web';
        }
        // Default to Python for all other languages (including terminal languages which we'll just show as reference)
        return 'python';
    }

    /**
     * Handle Open in Editor button click
     */
    function handleOpenInEditor(code, language, fenceType) {
        // Store code in sessionStorage to pass to editor page
        const editorData = {
            code: code,
            language: language,
            type: fenceType,
            ideTab: getIDETab(language),
            timestamp: Date.now()
        };
        
        try {
            sessionStorage.setItem('code_editor_import', JSON.stringify(editorData));
        } catch (e) {
            console.warn('[CodeRunner] Could not save to sessionStorage:', e);
        }

        // Open editor in new tab
        window.open('/Software-Engineering-HSC-Textbook/code-editor/', '_blank');
    }
    /**
     * Add action buttons to a code block
     * Adds buttons directly to the pre element (alongside copy button)
     */
    function addCodeButtons(codeBlock) {
        // codeBlock should be the <pre> element
        if (!codeBlock || codeBlock.tagName !== 'PRE') return;
        
        // Check if buttons already added
        if (codeBlock.querySelector('.code-action-btn')) return;
        
        const container = codeBlock.closest('.highlight');
        if (!container) return;

        const fenceType = container.dataset.fenceType;
        const language = container.dataset.language;
        
        if (!fenceType || !language) return; // Not a custom fence

        const codeElement = codeBlock.querySelector('code');
        if (!codeElement) return;

        const code = codeElement.textContent;

        // Determine capabilities
        const isExecutable = language === 'python';
        const isWebLang = ['html', 'css', 'javascript', 'js'].includes(language.toLowerCase());

        // Get reference element (insert before first child to appear at the front)
        const firstChild = codeBlock.firstChild;

        
        
        if (isExecutable || fenceType === 'template' || fenceType === 'error') {
            // Open in Editor button (for all types except Web languages which get Preview button)
            const editorBtn = document.createElement('button');
            editorBtn.className = 'code-action-btn code-editor-btn md-icon';
            editorBtn.title = isWebLang ? 'Open in Web Editor' : 'Open in Editor';

            editorBtn.addEventListener('click', () => handleOpenInEditor(code, language, fenceType));
            codeBlock.insertBefore(editorBtn, firstChild);
        }

        // Run/Preview button (only for exec type)
        if (fenceType === 'exec') {
            if (isExecutable) {
                // Python: Add Run button
                const runBtn = document.createElement('button');
                runBtn.className = 'code-action-btn code-run-btn md-icon';
                runBtn.title = 'Execute this Python code';
                runBtn.addEventListener('click', () => handleRunCode(runBtn, codeBlock, code));
                codeBlock.insertBefore(runBtn, firstChild);
            } else if (isWebLang) {
                // Web languages: Add Preview button
                const previewBtn = document.createElement('button');
                previewBtn.className = 'code-action-btn code-preview-btn md-icon';
                previewBtn.title = 'Preview in Web Editor';
                previewBtn.addEventListener('click', () => handleOpenInEditor(code, language, fenceType));
                codeBlock.insertBefore(previewBtn, firstChild);
            }
        }
        
        // Add tooltip for non-exec types
        if (fenceType === 'template') {
            container.setAttribute('data-tooltip', 'Template code - may not run as-is');
        } else if (fenceType === 'error') {
            container.setAttribute('data-tooltip', 'Error example - for educational purposes');
        }
    }

    /**
     * Initialize code blocks
     */
    function initCodeBlocks() {
        // Find all code blocks with custom fence types
        const codeBlocks = document.querySelectorAll('[data-fence-type] pre');
        
        codeBlocks.forEach(codeBlock => {
            addCodeButtons(codeBlock);
        });

        console.log(`[CodeRunner] Initialized ${codeBlocks.length} code blocks`);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCodeBlocks);
    } else {
        initCodeBlocks();
    }

    // Re-initialize on navigation (for MkDocs instant loading)
    document.addEventListener('DOMContentLoaded', () => {
        const observer = new MutationObserver(() => {
            initCodeBlocks();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

})();
