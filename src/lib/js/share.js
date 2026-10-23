/**
 * Turn code (or any text) into a URL-safe string and back, for share links.
 * encodeURIComponent first, so Kannada (multi-byte) survives btoa.
 */
export const encodeText = (text) => {
    try {
        return btoa(encodeURIComponent(text)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch {
        return '';
    }
};

export const decodeText = (encoded) => {
    try {
        const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
        return decodeURIComponent(atob(b64));
    } catch {
        return null;
    }
};

export const encodeJSON = (obj) => encodeText(JSON.stringify(obj));

export const decodeJSON = (encoded) => {
    const text = decodeText(encoded || '');
    if (text === null) return null;
    try { return JSON.parse(text); } catch { return null; }
};
