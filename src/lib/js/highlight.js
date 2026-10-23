/**
 * Syntax highlighting for K-Lipi code.
 *
 * Uses the interpreter's own keyword table, so colours always match the
 * language. Tokens are split only at whole-word boundaries, which keeps
 * Kannada conjuncts (ಒತ್ತಕ್ಷರ) shaped correctly.
 */
import KannadaLexer from './interpreter/lexer.js';
import { TURTLE_COMMAND_NAMES } from './interpreter/turtle.js';

const CONTROL = new Set(['IF', 'ELSE', 'WHILE', 'FOR', 'FROM', 'TO', 'FUNCTION', 'RETURN',
    'TRUE', 'FALSE', 'AND', 'OR', 'NOT', 'BREAK', 'CONTINUE']);

const lexer = new KannadaLexer();
const KEYWORDS = new Map();
for (const [word, type] of Object.entries(lexer.keywords)) {
    KEYWORDS.set(word, CONTROL.has(type) ? 'kw' : 'fn');
}
for (const name of TURTLE_COMMAND_NAMES) {
    if (!KEYWORDS.has(name)) KEYWORDS.set(name, 'turtle');
}

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// One pass over the source: comment | string | number | word | operator | other
const TOKEN = /(#[^\n]*)|("(?:[^"\\\n]|\\.)*"?)|([0-9೦-೯]+(?:\.[0-9೦-೯]+)?)|([ಀ-೿a-zA-Z_][ಀ-೿a-zA-Z0-9_]*)|(==|!=|>=|<=|[+\-*/%=<>])|([\s\S])/g;

/** Split code into coloured pieces: [{ type: 'kw' | 'fn' | 'turtle' | 'str' | 'num' | 'op' | 'comment' | null, text }] */
export function tokenize(code) {
    const tokens = [];
    let m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(code)) !== null) {
        const [text, comment, str, num, word, op] = m;
        let type = null;
        if (comment) type = 'comment';
        else if (str) type = 'str';
        else if (num) type = 'num';
        else if (word) type = KEYWORDS.get(word) || null;
        else if (op) type = 'op';
        tokens.push({ type, text });
    }
    return tokens;
}

export function highlight(code, errorLine = null) {
    let out = tokenize(code)
        .map(({ type, text }) => (type ? `<span class="hl-${type}">${escapeHtml(text)}</span>` : escapeHtml(text)))
        .join('');
    // Underline the line an error points to (tokens never cross lines, so splitting is safe).
    if (errorLine) {
        const lines = out.split('\n');
        const i = errorLine - 1;
        if (lines[i] !== undefined && lines[i] !== '') lines[i] = `<span class="hl-errline">${lines[i]}</span>`;
        out = lines.join('\n');
    }
    // A trailing newline needs a visible character so the layer keeps the same height.
    return out + (code.endsWith('\n') ? ' ' : '');
}
