/**
 * "My programs": programs saved in this browser only (localStorage).
 * Nothing leaves the device. Newest first, capped so storage never fills up.
 */
const KEY = 'kl_programs';
const MAX = 50;

export function listPrograms() {
    try {
        const list = JSON.parse(localStorage.getItem(KEY) || '[]');
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
}

function store(list) {
    try {
        localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
        return true;
    } catch {
        return false;
    }
}

/** Save (or overwrite by name) a program. Returns false if storage is blocked or full. */
export function saveProgram(name, code) {
    const clean = name.trim().slice(0, 60) || 'ಹೆಸರಿಲ್ಲದ ಪ್ರೋಗ್ರಾಂ';
    const rest = listPrograms().filter((p) => p.name !== clean);
    return store([{ id: Date.now(), name: clean, code, updated: new Date().toISOString() }, ...rest]);
}

export function deleteProgram(id) {
    return store(listPrograms().filter((p) => p.id !== id));
}
