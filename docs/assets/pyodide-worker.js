/**
 * Pyodide Web Worker
 * Runs Python code in a separate thread to prevent UI blocking
 */

let pyodide = null;
let pyodideReady = false;
let currentExecutionId = null;

/**
 * Robustly preprocess Python code to add 'await' before input() calls
 * Handles various edge cases: assignments, nested expressions, comments, strings
 *
 * NOTE: This is duplicated from ide-utils.js since web workers cannot share
 * functions with the main thread. Keep in sync with the shared utility.
 */
function preprocessInputCalls(code) {
    // Simple tokenizer to handle strings and comments
    const tokens = [];
    let i = 0;
    
    while (i < code.length) {
        const char = code[i];
        
        // Handle string literals
        if (char === '"' || char === "'") {
            const quote = char;
            let str = char;
            i++;
            while (i < code.length && (code[i] !== quote || code[i-1] === '\\')) {
                str += code[i];
                i++;
            }
            if (i < code.length) {
                str += code[i];
                i++;
            }
            tokens.push({ type: 'string', value: str });
            continue;
        }
        
        // Handle comments
        if (char === '#') {
            let comment = '';
            while (i < code.length && code[i] !== '\n') {
                comment += code[i];
                i++;
            }
            tokens.push({ type: 'comment', value: comment });
            continue;
        }
        
        // Handle regular code
        let codeSegment = '';
        while (i < code.length && char !== '"' && char !== "'" && char !== '#') {
            codeSegment += code[i];
            i++;
            if (code[i] === '\n') break; // Process line by line for simplicity
        }
        
        if (codeSegment.trim()) {
            tokens.push({ type: 'code', value: codeSegment });
        }
    }
    
    // Process code tokens to replace input() calls
    const processedTokens = tokens.map(token => {
        if (token.type !== 'code') {
            return token;
        }
        
        // Use regex to find ALL input( calls and add await
        // Match any context before input( - more aggressive to catch all cases
        const processed = token.value.replace(
            /(?<!await\s)(\b)input\s*\(/g,
            (match, boundary) => {
                // Check if 'await ' appears immediately before
                return boundary + 'await input(';
            }
        );
        
        return { ...token, value: processed };
    });
    
    // Reconstruct the code
    return processedTokens.map(token => token.value).join('');
}

// Handle messages from main thread
self.onmessage = async function(e) {
    const { type, data, executionId } = e.data;

    try {
        switch (type) {
            case 'load':
                await loadPyodide();
                break;
            
            case 'write_files':
                await writeFilesToFS(data.files);
                break;
            
            case 'execute':
                currentExecutionId = executionId;
                await executePython(data.code);
                currentExecutionId = null;
                break;
            
            case 'interrupt':
                interruptExecution();
                break;
            
            case 'input_response':
                // Provide input value to waiting Python code
                if (pyodide && pyodideReady) {
                    try {
                        // Use runPython to safely set the value in Python context
                        pyodide.runPython(`
import sys
sys._worker_input_value = ${JSON.stringify(data.value)}
`);
                    } catch (err) {
                        console.error('Error setting input value:', err);
                    }
                }
                break;
        }
    } catch (error) {
        self.postMessage({
            type: 'error',
            executionId: currentExecutionId,
            data: { message: error.message }
        });
    }
};

async function loadPyodide() {
    if (pyodideReady) {
        self.postMessage({ type: 'ready' });
        return;
    }

    try {
        // Import Pyodide
        importScripts('https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js');
        
        // Send progress updates
        self.postMessage({ 
            type: 'progress', 
            data: { percent: 10, message: 'Loading Python environment...' }
        });

        pyodide = await loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
        });

        // Set up interrupt buffer if available
        try {
            if (typeof SharedArrayBuffer !== 'undefined') {
                pyodide.setInterruptBuffer(new Int32Array(new SharedArrayBuffer(4)));
                self.postMessage({ 
                    type: 'info',
                    data: { message: 'Interrupt support enabled' }
                });
            }
        } catch (e) {
            console.warn('Could not set interrupt buffer:', e);
        }

        self.postMessage({ 
            type: 'progress', 
            data: { percent: 100, message: 'Python ready!' }
        });

        pyodideReady = true;
        self.postMessage({ type: 'ready' });

    } catch (error) {
        self.postMessage({
            type: 'error',
            data: { message: `Failed to load Python: ${error.message}` }
        });
    }
}

async function writeFilesToFS(files) {
    if (!pyodideReady) {
        throw new Error('Python environment not loaded');
    }

    try {
        // Write each file to Pyodide's virtual filesystem
        // For Python files, preprocess to add 'await' to input() and make functions async
        for (const [filename, content] of Object.entries(files)) {
            let processedContent = content;
            
            if (filename.endsWith('.py')) {
                // First, add 'await' before input() calls
                processedContent = preprocessInputCalls(content);
                
                // Then, make all function definitions async
                processedContent = processedContent.replace(
                    /^(\s*)def\s+(\w+)\s*\(/gm,
                    '$1async def $2('
                );
            }
            
            await pyodide.runPythonAsync(`
with open(${JSON.stringify(filename)}, 'w', encoding='utf-8') as f:
    f.write(${JSON.stringify(processedContent)})
`);
        }
        
        self.postMessage({
            type: 'files_written',
            data: { count: Object.keys(files).length }
        });
    } catch (error) {
        self.postMessage({
            type: 'error',
            data: { message: `Failed to write files: ${error.message}` }
        });
    }
}

async function executePython(code) {
    if (!pyodideReady) {
        throw new Error('Python environment not loaded');
    }

    let output = {
        stdout: [],
        stderr: [],
        error: null,
        result: null
    };

    try {
        // Setup output capture with streaming to main thread
        await pyodide.runPythonAsync(`
import sys
from io import StringIO
import builtins

class StreamToMain:
    """Stream output to main thread immediately"""
    def __init__(self, stream_type='stdout'):
        self.stream_type = stream_type
        self.buffer = []
        
    def write(self, text):
        if text and text != '\\n':
            text_stripped = text.rstrip()
            if text_stripped:
                # Send to main thread - create plain JS object
                import js
                js.self.postMessage(js.Object.fromEntries([
                    ['type', 'output'],
                    ['data', js.Object.fromEntries([
                        ['text', text_stripped],
                        ['stream', self.stream_type]
                    ])]
                ]))
                self.buffer.append(text)
        return len(text)
    
    def flush(self):
        pass
    
    def getvalue(self):
        return ''.join(self.buffer)

async def _async_custom_input(prompt=''):
    """Async input function that requests input from main thread"""
    import js
    import asyncio
    
    # Request input from main thread (send prompt for display)
    js.self.postMessage(js.Object.fromEntries([
        ['type', 'input_request'],
        ['data', js.Object.fromEntries([
            ['prompt', prompt]
        ])]
    ]))
    
    # Wait for response from main thread (will be set via input_response message)
    # Use asyncio.sleep to allow event loop to process incoming messages
    while not hasattr(sys, '_worker_input_value'):
        await asyncio.sleep(0.01)
    
    value = sys._worker_input_value
    delattr(sys, '_worker_input_value')
    
    if value is None:
        raise KeyboardInterrupt('Input cancelled')
    
    # Main thread handles echoing the input
    return str(value)

# Save originals
_original_stdout = sys.stdout
_original_stderr = sys.stderr
_original_input = builtins.input

# Create streaming writers
_stdout_stream = StreamToMain('stdout')
_stderr_stream = StreamToMain('stderr')

# Redirect
sys.stdout = _stdout_stream
sys.stderr = _stderr_stream
builtins.input = _async_custom_input
        `);

        // Run the code (runPythonAsync supports top-level await)
        // Preprocess to add 'await' before input() calls
        let processedCode = preprocessInputCalls(code);
        
        // Also need to await function calls in imported modules
        // Add 'await' before function calls that might be async
        processedCode = processedCode.replace(
            /^(\s*)(\w+)\s*\(/gm,
            (match, indent, funcName) => {
                // Don't await built-in functions or already awaited calls
                const builtins = ['print', 'len', 'range', 'str', 'int', 'float', 'bool', 'list', 'dict', 'set', 'tuple', 'type', 'isinstance', 'hasattr', 'getattr', 'setattr'];
                if (builtins.includes(funcName) || match.includes('await ')) {
                    return match;
                }
                return `${indent}await ${funcName}(`;
            }
        );
        
        try {
            const result = await pyodide.runPythonAsync(processedCode);
            output.result = result;
        } catch (err) {
            if (err.message && err.message.includes('KeyboardInterrupt')) {
                output.error = 'Execution interrupted';
            } else {
                output.error = err.message;
            }
        }

        // Get buffered output
        const stdout = await pyodide.runPythonAsync('_stdout_stream.getvalue()');
        const stderr = await pyodide.runPythonAsync('_stderr_stream.getvalue()');

        output.stdout = stdout ? stdout.split('\n').filter(line => line.trim()) : [];
        output.stderr = stderr ? stderr.split('\n').filter(line => line.trim()) : [];

        // Restore
        await pyodide.runPythonAsync(`
sys.stdout = _original_stdout
sys.stderr = _original_stderr
builtins.input = _original_input
        `);

        // Send completion
        self.postMessage({
            type: 'complete',
            executionId: currentExecutionId,
            data: output
        });

    } catch (error) {
        // Try to restore
        try {
            await pyodide.runPythonAsync(`
sys.stdout = _original_stdout
sys.stderr = _original_stderr
builtins.input = _original_input
            `);
        } catch (e) {
            // Ignore
        }

        self.postMessage({
            type: 'complete',
            executionId: currentExecutionId,
            data: {
                stdout: output.stdout,
                stderr: output.stderr,
                error: error.message,
                result: null
            }
        });
    }
}

function interruptExecution() {
    if (pyodide && pyodide.interruptBuffer) {
        pyodide.interruptBuffer[0] = 2;
        self.postMessage({
            type: 'info',
            data: { message: 'Interrupt signal sent' }
        });
    }
}
