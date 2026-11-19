/**
 * Small per-device preferences (text size, editor look, first-visit flag).
 * Stored in localStorage; every change is broadcast so all components using
 * the same preference update together.
 */
import { useEffect, useState } from 'react';

const EVENT = 'kl-pref';

export const PREFS = {
    textSize: { key: 'kl_text_size', fallback: '100' },        // 100 | 112 | 125 (%)
    editorFont: { key: 'kl_editor_font', fallback: 'auto' },   // 'auto' or px
    editorTheme: { key: 'kl_editor_theme', fallback: 'auto' }, // auto | dark
    welcomed: { key: 'kl_welcomed', fallback: '' },            // '1' after the welcome
};

export function readPref(name) {
    const p = PREFS[name];
    try { return localStorage.getItem(p.key) ?? p.fallback; } catch { return p.fallback; }
}

export function writePref(name, value) {
    try { localStorage.setItem(PREFS[name].key, String(value)); } catch { /* storage blocked */ }
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { name, value: String(value) } }));
}

export function usePref(name) {
    const [value, setValue] = useState(() => readPref(name));
    useEffect(() => {
        const onChange = (e) => { if (e.detail.name === name) setValue(e.detail.value); };
        window.addEventListener(EVENT, onChange);
        return () => window.removeEventListener(EVENT, onChange);
    }, [name]);
    return [value, (v) => writePref(name, v)];
}

/** Applies the text-size preference to the whole page (rem-based layout scales with it). */
export function applyTextSize(size) {
    document.documentElement.style.fontSize = size === '100' ? '' : `${size}%`;
}
