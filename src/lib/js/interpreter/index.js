/**
 * KannadaLipi Interpreter - Main Entry Point
 * Combines Lexer, Parser, and Runtime to execute Kannada code
 */
import KannadaLexer from './lexer.js';
import KannadaParser from './parser.js';
import KannadaRuntime from './runtime.js';
import { friendlyError } from './errors.js';
import { turtleResult, TURTLE_COMMAND_NAMES } from './turtle.js';

const TURTLE_NAMES = new Set(TURTLE_COMMAND_NAMES);

/**
 * Find a call to a function that does not exist, before anything runs.
 * Without this, a typo inside a branch that never runs (for example
 * `ಆದರೆ ಅ == ಆ : ಮುಮುದ್ರಿಸು(...)` when the condition is false) goes unnoticed.
 * Returns { name, line } for the first unknown call, or null.
 */
function findUnknownCall(ast) {
    const defined = new Set();
    const calls = [];
    const walk = (node, line) => {
        if (Array.isArray(node)) { node.forEach((n) => walk(n, line)); return; }
        if (!node || typeof node !== 'object') return;
        const here = node.line !== undefined ? node.line : line;
        if (node.type === 'FunctionDef') defined.add(node.name);
        // Keyword calls (ಮುದ್ರಿಸು, ಮೊತ್ತ, ...) are built in; only plain names can be unknown.
        if (node.type === 'Call' && node.callee === 'IDENTIFIER') calls.push({ name: node.name, line: here });
        for (const key of Object.keys(node)) {
            if (key !== 'line' && node[key] && typeof node[key] === 'object') walk(node[key], here);
        }
    };
    walk(ast, null);
    return calls.find((c) => !defined.has(c.name) && !TURTLE_NAMES.has(c.name) && c.name !== 'ಮುದ್ರಿಸು') || null;
}

class KannadaLipi {
    constructor() {
        this.lexer = new KannadaLexer();
        this.runtime = new KannadaRuntime();
    }

    /**
     * Execute Kannada source code
     * @param {string} source - The Kannada source code to execute
     * @returns {object} - Result containing output or error
     */
    execute(source) {
        // Clear state from any previous run so a parse error never shows old output.
        this.runtime.output = [];
        this.runtime.variables = {};
        this.runtime.functions = {};
        this.runtime.turtle = null;
        this.runtime.currentLine = null;
        try {
            // Tokenize
            const tokens = this.lexer.tokenize(source);

            // Parse
            const parser = new KannadaParser(tokens);
            const ast = parser.parse();

            // Catch misspelt function names anywhere in the program, even in code that never runs.
            const unknown = findUnknownCall(ast);
            if (unknown) {
                this.runtime.currentLine = unknown.line;
                throw new Error(`ಅಪರಿಚಿತ ಕಾರ್ಯ: ${unknown.name}`);
            }

            // Execute
            const output = this.runtime.run(ast);

            return {
                success: true,
                output: output,
                variables: { ...this.runtime.variables },
                turtle: turtleResult(this.runtime.turtle)
            };
        } catch (error) {
            const raw = error && error.message ? error.message : String(error);
            const names = [
                ...Object.keys(this.lexer.keywords),
                ...TURTLE_COMMAND_NAMES,
                ...Object.keys(this.runtime.variables || {}),
                ...Object.keys(this.runtime.functions || {}),
            ];
            const friendly = friendlyError(raw, { line: this.runtime.currentLine, names });
            // Keep whatever the program printed before failing, then the error.
            const printed = (this.runtime.output || []).join('\n');
            const errText = `ದೋಷ: ${friendly.message}` + (friendly.hint ? `\nಸಲಹೆ: ${friendly.hint}` : '');
            return {
                success: false,
                error: raw,
                friendly: friendly.message,
                hint: friendly.hint,
                line: friendly.line,
                output: printed ? `${printed}\n${errText}` : errText,
                variables: { ...(this.runtime.variables || {}) },
                turtle: turtleResult(this.runtime.turtle)
            };
        }
    }

    /**
     * Get current variables
     */
    getVariables() {
        return { ...this.runtime.variables };
    }

    /**
     * Reset the interpreter state
     */
    reset() {
        this.runtime.variables = {};
        this.runtime.functions = {};
        this.runtime.output = [];
    }

    /**
     * Convert number to Kannada
     */
    toKannada(num) {
        return this.lexer.toKannada(num);
    }

    /**
     * Get list of keywords
     */
    getKeywords() {
        return Object.keys(this.lexer.keywords);
    }
}

// Create global instance (for convenience but exporting default as well)
const instance = new KannadaLipi();
export { instance as kannadaLipi };
export default KannadaLipi;
