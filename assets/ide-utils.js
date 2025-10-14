/**
 * Shared utilities for the IDE
 */

/**
 * Robustly preprocess Python code to add 'await' before input() calls
 * Handles various edge cases: assignments, nested expressions, comments, strings
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

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { preprocessInputCalls };
} else if (typeof window !== 'undefined') {
    window.IDEUtils = { preprocessInputCalls };
}