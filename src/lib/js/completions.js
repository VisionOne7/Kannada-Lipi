/**
 * Autocomplete for the code editor: every keyword, built-in function and
 * turtle command, plus the variables and functions the program itself defines.
 */
import KannadaLexer from './interpreter/lexer.js';
import { TURTLE_COMMAND_NAMES } from './interpreter/turtle.js';
import { FUNCTION_CATEGORIES, CONTROL_FLOW } from '../../data/functions.js';

const CONTROL = new Set(['IF', 'ELSE', 'WHILE', 'FOR', 'FROM', 'TO', 'FUNCTION', 'RETURN',
    'TRUE', 'FALSE', 'AND', 'OR', 'NOT', 'BREAK', 'CONTINUE']);
// Values, not calls: inserted without brackets
const VALUES = new Set(['ಪೈ', 'ಇ_ಸಂಖ್ಯೆ', 'ವರ್ಣಮಾಲೆ']);

const DOCS = new Map();
FUNCTION_CATEGORIES.forEach((c) => c.functions.forEach((f) => DOCS.set(f.name, f)));
[...CONTROL_FLOW.conditionals, ...CONTROL_FLOW.loops].forEach((f) => DOCS.set(f.name, f));

const lexer = new KannadaLexer();
const BUILT_IN = [];
for (const [word, type] of Object.entries(lexer.keywords)) {
    if (!/^[ಀ-೿_]+$/.test(word)) continue;
    const kind = CONTROL.has(type) ? 'kw' : VALUES.has(word) ? 'value' : 'fn';
    BUILT_IN.push({ name: word, kind, doc: DOCS.get(word) });
}
for (const name of TURTLE_COMMAND_NAMES) {
    if (!BUILT_IN.some((b) => b.name === name)) BUILT_IN.push({ name, kind: 'fn', doc: DOCS.get(name) });
}

const WORD_BEFORE = /[ಀ-೿_][ಀ-೿0-9_]*$/;

/** The Kannada word being typed just before the cursor ('' if none). */
export function wordBefore(text, caret) {
    const m = text.slice(0, caret).match(WORD_BEFORE);
    return m ? m[0] : '';
}

/** Names the program defines: variables (x = ...), function names and parameters. */
function programNames(code) {
    const names = new Map();
    for (const m of code.matchAll(/^[ \t]*([ಀ-೿_][ಀ-೿0-9_]*)\s*=(?!=)/gm)) names.set(m[1], 'var');
    for (const m of code.matchAll(/ಕಾರ್ಯ\s+([ಀ-೿_][ಀ-೿0-9_]*)\s*\(([^)]*)\)/g)) {
        names.set(m[1], 'fn');
        m[2].split(',').map((p) => p.trim()).filter(Boolean).forEach((p) => names.set(p, 'var'));
    }
    for (const m of code.matchAll(/ಪುನರಾವರ್ತನೆ\s+([ಀ-೿_][ಀ-೿0-9_]*)/g)) names.set(m[1], 'var');
    return names;
}

/**
 * Suggestions for the word before the cursor, best first.
 * Each: { name, kind: 'kw' | 'fn' | 'value' | 'var', insert, caretBack, doc }
 */
export function suggest(code, caret, limit = 6) {
    const prefix = wordBefore(code, caret);
    if (prefix.length < 1) return { prefix, items: [] };
    const own = programNames(code.slice(0, caret - prefix.length) + code.slice(caret));
    const pool = [
        ...[...own].map(([name, kind]) => ({ name, kind, own: true })),
        ...BUILT_IN.filter((b) => !own.has(b.name)),
    ];
    const items = pool
        .filter((c) => c.name.startsWith(prefix) && c.name !== prefix)
        .sort((a, b) => (b.own ? 1 : 0) - (a.own ? 1 : 0) || a.name.length - b.name.length)
        .slice(0, limit)
        .map((c) => ({
            ...c,
            insert: c.kind === 'fn' ? `${c.name}()` : c.kind === 'kw' ? `${c.name} ` : c.name,
            caretBack: c.kind === 'fn' ? 1 : 0,
        }));
    return { prefix, items };
}
