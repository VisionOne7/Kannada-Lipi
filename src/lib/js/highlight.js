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

export function highlight(code) {
    let out = '';
    let m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(code)) !== null) {
        const [text, comment, str, num, word, op] = m;
        const safe = escapeHtml(text);
        if (comment) out += `<span class="hl-comment">${safe}</span>`;
        else if (str) out += `<span class="hl-str">${safe}</span>`;
        else if (num) out += `<span class="hl-num">${safe}</span>`;
        else if (word) {
            const kind = KEYWORDS.get(word);
            out += kind ? `<span class="hl-${kind}">${safe}</span>` : safe;
        } else if (op) out += `<span class="hl-op">${safe}</span>`;
        else out += safe;
    }
    // A trailing newline needs a visible character so the layer keeps the same height.
    return out + (code.endsWith('\n') ? ' ' : '');
}
