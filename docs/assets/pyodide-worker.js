/**
 * Pyodide Web Worker
 * Runs Python code in a separate thread to prevent UI blocking
 */

let pyodide = null;
let pyodideReady = false;

// Handle messages from main thread
self.onmessage = async function(e) {
    const { type, data } = e.data;

    try {
        switch (type) {
            case 'load':
                await loadPyodide();
                break;
            
            case 'execute':
                await executePython(data.code);
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

async def custom_input(prompt=''):
    """Custom input function that requests input from main thread"""
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
builtins.input = custom_input
        `);

        // Run the code (runPythonAsync supports top-level await)
        // Pre-process code to add 'await' before input() calls
        const processedCode = code.replace(/(\s*)([a-zA-Z_][a-zA-Z0-9_]*\s*=\s*)?input\(/g, '$1$2await input(');
        
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
