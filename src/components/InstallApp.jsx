import React, { useEffect, useState } from 'react';
import { MonitorDown } from 'lucide-react';

/**
 * "ಆ್ಯಪ್ ಸ್ಥಾಪಿಸಿ" button. Shows only when the browser offers installation
 * (Chrome/Edge/Android), so schools can install KannadaLipi and use it offline.
 */
const InstallApp = ({ variant = 'icon' }) => {
    const [prompt, setPrompt] = useState(null);

    useEffect(() => {
        const onPrompt = (e) => { e.preventDefault(); setPrompt(e); };
        const onInstalled = () => setPrompt(null);
        window.addEventListener('beforeinstallprompt', onPrompt);
        window.addEventListener('appinstalled', onInstalled);
        return () => {
            window.removeEventListener('beforeinstallprompt', onPrompt);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    if (!prompt) {
        // On the teachers page, explain what to do when the browser offers no prompt
        // (already installed, Safari/Firefox, or not yet eligible).
        return variant === 'full'
            ? <p className="install-note">ಬ್ರೌಸರ್‌ನ ಮೆನುವಿನಲ್ಲಿ "Install app" ಅಥವಾ "Add to Home screen" ಆಯ್ಕೆ ಬಳಸಿ. ಈಗಾಗಲೇ ಸ್ಥಾಪಿಸಿದ್ದರೆ ಏನೂ ಮಾಡಬೇಕಿಲ್ಲ.</p>
            : null;
    }

    const install = async () => {
        prompt.prompt();
        try { await prompt.userChoice; } catch { /* dismissed */ }
        setPrompt(null);
    };

    return (
        <button
            type="button"
            className={variant === 'icon' ? 'install-btn header-icon-btn' : 'install-btn full'}
            onClick={install}
            title="ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆಯೂ ಬಳಸಲು ಆ್ಯಪ್ ಸ್ಥಾಪಿಸಿ"
            aria-label="ಆ್ಯಪ್ ಸ್ಥಾಪಿಸಿ"
        >
            <MonitorDown size={18} />
            {variant === 'full' && <span>ಆ್ಯಪ್ ಸ್ಥಾಪಿಸಿ (ಆಫ್‌ಲೈನ್ ಬಳಕೆಗೆ)</span>}
        </button>
    );
};

export default InstallApp;
