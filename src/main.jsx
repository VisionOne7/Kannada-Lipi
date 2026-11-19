import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './polish.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Service worker: offline support in production only. In development it
// would serve stale modules, so any old registration is removed instead.
if ('serviceWorker' in navigator) {
    if (import.meta.env.PROD) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(() => navigator.serviceWorker.ready)
                .then((reg) => reg.active && reg.active.postMessage({ type: 'PRECACHE' }))
                .catch(() => {});
        });
    } else {
        navigator.serviceWorker.getRegistrations()
            .then((regs) => regs.forEach((r) => r.unregister()))
            .catch(() => {});
    }
}
