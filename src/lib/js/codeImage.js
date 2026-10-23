/**
 * Draw a program (and its output) as a shareable PNG card.
 * Uses the same colours as the dark editor, with K-Lipi branding.
 */
import { tokenize } from './highlight.js';

const COLORS = {
    kw: '#ff7ab8', fn: '#7cc4ff', turtle: '#5eead4', str: '#fbbf24',
    num: '#c4b5fd', op: '#94a3b8', comment: '#8b949e', null: '#e6edf3',
};
const MAX_LINES = 40;
const FONT = "'Noto Sans Kannada', 'Fira Code', monospace";

/** Returns a Promise<Blob> of the PNG. */
export async function codeToImage(code, output = '') {
    if (document.fonts && document.fonts.load) {
        try { await document.fonts.load(`20px ${FONT}`, 'ಕನ್ನಡ'); } catch { /* draw with fallback */ }
    }
    const allLines = code.replace(/\s+$/, '').split('\n');
    const lines = allLines.slice(0, MAX_LINES);
    if (allLines.length > MAX_LINES) lines.push('…');
    const outLines = output ? output.replace(/\s+$/, '').split('\n').slice(0, 8) : [];

    const SCALE = 2;
    const PAD = 48;
    const LINE = 34;
    const fontSize = 20;
    const measure = document.createElement('canvas').getContext('2d');
    measure.font = `${fontSize}px ${FONT}`;
    const widest = Math.max(...lines.map((l) => measure.measureText(l).width), ...outLines.map((l) => measure.measureText(l).width), 360);
    const W = Math.min(1600, Math.max(900, Math.ceil(widest + PAD * 2 + 60)));
    const codeH = lines.length * LINE;
    const outH = outLines.length ? 56 + outLines.length * LINE : 0;
    const H = 96 + codeH + outH + 88;

    const c = document.createElement('canvas');
    c.width = W * SCALE;
    c.height = H * SCALE;
    const ctx = c.getContext('2d');
    ctx.scale(SCALE, SCALE);

    // Card
    ctx.fillStyle = '#0f1420';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(0, 0, W / 2, 6);
    ctx.fillStyle = '#D71920';
    ctx.fillRect(W / 2, 0, W / 2, 6);

    // Header
    ctx.textBaseline = 'middle';
    ctx.font = `700 22px ${FONT}`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('ಕನ್ನಡ ಲಿಪಿ', PAD, 52);
    ctx.font = `16px ${FONT}`;
    ctx.fillStyle = '#8b949e';
    ctx.textAlign = 'right';
    ctx.fillText('ಕನ್ನಡದಲ್ಲಿ ಕೋಡ್', W - PAD, 52);
    ctx.textAlign = 'left';

    // Code
    const gutter = 44;
    let y = 96 + LINE / 2;
    ctx.font = `${fontSize}px ${FONT}`;
    const tokensByLine = [[]];
    tokenize(lines.join('\n')).forEach((t) => {
        const parts = t.text.split('\n');
        parts.forEach((part, i) => {
            if (i > 0) tokensByLine.push([]);
            if (part) tokensByLine[tokensByLine.length - 1].push({ type: t.type, text: part });
        });
    });
    tokensByLine.forEach((toks, i) => {
        ctx.fillStyle = '#4b5563';
        ctx.textAlign = 'right';
        ctx.fillText(String(i + 1), PAD + gutter - 16, y);
        ctx.textAlign = 'left';
        let x = PAD + gutter;
        toks.forEach(({ type, text }) => {
            ctx.fillStyle = COLORS[type] || COLORS.null;
            ctx.fillText(text, x, y);
            x += ctx.measureText(text).width;
        });
        y += LINE;
    });

    // Output
    if (outLines.length) {
        y += 12;
        ctx.fillStyle = '#161d2b';
        ctx.fillRect(PAD, y - LINE / 2 + 4, W - PAD * 2, outLines.length * LINE + 40);
        ctx.font = `600 14px ${FONT}`;
        ctx.fillStyle = '#8b949e';
        ctx.fillText('ಔಟ್‌ಪುಟ್', PAD + 16, y + 10);
        y += 40;
        ctx.font = `${fontSize}px ${FONT}`;
        outLines.forEach((l) => {
            ctx.fillStyle = l.startsWith('ದೋಷ') ? '#ff7b72' : '#4ade80';
            ctx.fillText(l, PAD + 16, y);
            y += LINE;
        });
    }

    // Footer
    ctx.font = `600 16px ${FONT}`;
    ctx.fillStyle = '#FFD700';
    ctx.fillText('k-lipi.in', PAD, H - 40);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#8b949e';
    ctx.font = `15px ${FONT}`;
    ctx.fillText('ನೀವೂ ಪ್ರಯತ್ನಿಸಿ — ಉಚಿತ, ಲಾಗಿನ್ ಇಲ್ಲ', W - PAD, H - 40);

    return new Promise((resolve) => c.toBlob(resolve, 'image/png'));
}
