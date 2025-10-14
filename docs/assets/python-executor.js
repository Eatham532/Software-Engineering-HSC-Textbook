/**
 * Shared Python Executor
 * 
 * Provides a unified Python execution engine using Web Workers
 * for both the code editor IDE and inline code runners.
 * 
 * Features:
 * - Non-blocking execution via Web Worker
 * - Live output streaming
 * - Input support (async with terminal UI)
 * - Force termination
 * - Shared Pyodide instance across all executions
 */

class PythonExecutor {
    constructor() {
        this.worker = null;
        this.workerReady = false;
        this.loadingPromise = null;
        this.messageHandlers = new Map();
        this.nextExecutionId = 1;
    }

    /**
     * Initialize the Python worker
     */
    async initialize() {
        if (this.workerReady) {
            return;
        }

        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = new Promise((resolve, reject) => {
            try {
                // Create worker
                this.worker = new Worker('/assets/pyodide-worker.js');

                // Handle worker messages
                this.worker.onmessage = (e) => {
                    const { type, data, executionId } = e.data;

                    // Handle global messages
                    if (type === 'ready') {
                        this.workerReady = true;
                        resolve();
                        return;
                    }

                    if (type === 'error' && !executionId) {
                        console.error('[PythonExecutor] Worker error:', data);
                        return;
                    }

                    // Route to execution-specific handler
                    const handler = this.messageHandlers.get(executionId);
                    if (handler) {
                        handler(type, data);
                    }
                };

                // Handle worker errors
                this.worker.onerror = (error) => {
                    console.error('[PythonExecutor] Worker error:', error);
                    reject(error);
                };

                // Load Pyodide
                this.worker.postMessage({ type: 'load' });

            } catch (error) {
                reject(error);
            }
        });

        return this.loadingPromise;
    }

    /**
     * Execute Python code
     * @param {string} code - Python code to execute
     * @param {Object} handlers - Event handlers for execution
     * @param {Function} handlers.onOutput - Called for each output line (text, stream)
     * @param {Function} handlers.onProgress - Called for progress updates (percent, message)
     * @param {Function} handlers.onInputRequest - Called when input is needed (prompt)
     * @param {Function} handlers.onComplete - Called when execution completes (output)
     * @param {Function} handlers.onError - Called on error (error)
     * @returns {Promise<number>} - Execution ID for this run
     */
    async execute(code, handlers = {}) {
        await this.initialize();

        const executionId = this.nextExecutionId++;

        // Store message handler for this execution
        this.messageHandlers.set(executionId, (type, data) => {
            switch (type) {
                case 'output':
                    if (handlers.onOutput) {
                        handlers.onOutput(data.text, data.stream);
                    }
                    break;

                case 'progress':
                    if (handlers.onProgress) {
                        handlers.onProgress(data.percent, data.message);
                    }
                    break;

                case 'input_request':
                    if (handlers.onInputRequest) {
                        handlers.onInputRequest(data.prompt);
                    }
                    break;

                case 'complete':
                    if (handlers.onComplete) {
                        handlers.onComplete(data);
                    }
                    this.messageHandlers.delete(executionId);
                    break;

                case 'error':
                    if (handlers.onError) {
                        handlers.onError(data.message);
                    }
                    this.messageHandlers.delete(executionId);
                    break;
            }
        });

        // Send execution request
        this.worker.postMessage({
            type: 'execute',
            executionId: executionId,
            data: { code }
        });

        return executionId;
    }

    /**
     * Send input response to Python code waiting for input
     * @param {number} executionId - The execution ID waiting for input
     * @param {string|null} value - The input value, or null to cancel
     */
    sendInput(executionId, value) {
        if (!this.worker) {
            console.error('[PythonExecutor] Worker not initialized');
            return;
        }

        this.worker.postMessage({
            type: 'input_response',
            executionId: executionId,
            data: { value }
        });
    }

    /**
     * Interrupt current execution
     */
    interrupt() {
        if (!this.worker) {
            return;
        }

        this.worker.postMessage({ type: 'interrupt' });
    }

    /**
     * Force terminate the worker and restart
     */
    forceTerminate() {
        if (!this.worker) {
            return;
        }

        this.worker.terminate();
        this.worker = null;
        this.workerReady = false;
        this.loadingPromise = null;
        this.messageHandlers.clear();
    }
}

// Create singleton instance
window.PythonExecutor = window.PythonExecutor || new PythonExecutor();
