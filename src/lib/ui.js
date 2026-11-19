/**
 * Small app-wide UI signals, sent as window events so any component can ask
 * for them without prop drilling: open the search palette, open the menu,
 * flip the theme, load code into the main editor, or show a short toast.
 */
export const UI_EVENTS = {
    openPalette: 'kl-open-palette',
    openMenu: 'kl-open-menu',
    toggleTheme: 'kl-toggle-theme',
    loadCode: 'kl-load-code',
};

export const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

let toastTimer = null;
/** Shows a short message at the bottom of the screen. */
export function toast(message) {
    let el = document.querySelector('.kl-toast');
    if (el) el.remove();
    el = document.createElement('div');
    el.className = 'kl-toast';
    el.setAttribute('role', 'status');
    el.textContent = message;
    document.body.appendChild(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.remove(), 2200);
}
