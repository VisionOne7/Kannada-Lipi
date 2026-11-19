/**
 * Completion codes for teacher assignments, so results reach the teacher with
 * no server: the student's "send to teacher" message carries a short code,
 * and the teacher pastes messages into the class results page.
 * Format: KL1.<base64url JSON>.<checksum>. The checksum only catches typos and
 * copy errors; it is not a security measure.
 */
// UTF-8 bytes straight to URL-safe base64: Kannada stays compact (3 bytes a letter).
const toB64 = (obj) => {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let bin = '';
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fromB64 = (text) => {
    try {
        const bin = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
    } catch {
        return null;
    }
};

const checksum = (text) => {
    let h = 0;
    for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
    return h.toString(36).slice(-4).padStart(4, '0');
};

/** { title, name, time } -> "KL1.xxxx.cccc" */
export function makeCompletionCode({ title, name, time = Date.now() }) {
    const body = toB64({ a: title.slice(0, 120), n: name.slice(0, 40), t: Math.floor(time / 1000) });
    return `KL1.${body}.${checksum(body)}`;
}

/** Finds every valid code in pasted text: [{ code, title, name, time }] */
export function findCompletionCodes(text) {
    const found = [];
    const seen = new Set();
    for (const m of String(text || '').matchAll(/KL1\.([A-Za-z0-9_-]+)\.([a-z0-9]{4})/g)) {
        const [code, body, sum] = m;
        if (seen.has(code) || checksum(body) !== sum) continue;
        const data = fromB64(body);
        if (!data || typeof data.a !== 'string' || typeof data.n !== 'string') continue;
        seen.add(code);
        // Codes can be hand-made, so lengths are capped here too
        found.push({ code, title: data.a.slice(0, 120), name: data.n.trim().slice(0, 40) || '-', time: (Number(data.t) || 0) * 1000 });
    }
    return found;
}
