import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Hand, Keyboard, Play, Compass, ArrowRight, X } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { readPref, writePref } from '../lib/prefs';
import { UI_EVENTS, emit } from '../lib/ui';
import './Welcome.css';

const FIRST_PROGRAM = 'ಹೆಸರು = "ಕನ್ನಡಿಗ"\nಮುದ್ರಿಸು("ನಮಸ್ಕಾರ," ಹೆಸರು "!")\nಮುದ್ರಿಸು("ಇದು ನನ್ನ ಮೊದಲ ಪ್ರೋಗ್ರಾಂ")';

// First visit only: four quick steps, then a ready-to-run first program.
const Welcome = () => {
    const { t, lang, setLang } = useLang();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);

    const close = () => { writePref('welcomed', '1'); setOpen(false); };

    useEffect(() => {
        const shared = new URLSearchParams(window.location.search).has('code');
        if (readPref('welcomed') !== '1' && !shared) {
            const timer = setTimeout(() => setOpen(true), 900);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, []);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') { writePref('welcomed', '1'); setOpen(false); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    const start = () => { close(); emit(UI_EVENTS.loadCode, { code: FIRST_PROGRAM, pulse: true }); };

    if (!open) return null;

    const steps = [
        {
            Icon: Hand, title: t('ನಮಸ್ಕಾರ! ಕನ್ನಡ ಲಿಪಿಗೆ ಸ್ವಾಗತ', 'Hello! Welcome to K-Lipi'),
            text: t('ಇದು ಕನ್ನಡದಲ್ಲೇ ಕೋಡ್ ಬರೆಯುವ ನಿಜವಾದ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ. ಉಚಿತ, ಲಾಗಿನ್ ಇಲ್ಲ.', 'A real programming language you write in Kannada. Free, no login.'),
            demo: <code>ಮುದ್ರಿಸು("ನಮಸ್ಕಾರ!")</code>,
        },
        {
            Icon: Keyboard, title: t('ಬರೆಯಿರಿ', 'Write'),
            text: t('ಕನ್ನಡ ಕೀಬೋರ್ಡ್ ಬಳಸಿ, ಅಥವಾ EN→ಕ ಆನ್ ಮಾಡಿ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ.', 'Use the Kannada keyboard, or switch on EN→ಕ and type in English.'),
            demo: <code>mudrisu <ArrowRight size={14} /> ಮುದ್ರಿಸು</code>,
        },
        {
            Icon: Play, title: t('ರನ್ ಮಾಡಿ', 'Run'),
            text: t('ರನ್ ಮಾಡಿ ಬಟನ್ ಒತ್ತಿ ಅಥವಾ Ctrl + Enter. ತಪ್ಪಿದ್ದರೆ ಕನ್ನಡದಲ್ಲೇ ಸಲಹೆ ಸಿಗುತ್ತದೆ.', 'Press Run or Ctrl + Enter. Mistakes come with hints in Kannada.'),
            demo: <span className="wl-run"><Play size={14} /> {t('ರನ್ ಮಾಡಿ', 'Run')}</span>,
        },
        {
            Icon: Compass, title: t('ಅನ್ವೇಷಿಸಿ', 'Explore'),
            text: t('ಪಾಠಗಳು, ಮಕ್ಕಳ ಆಮೆ ಆಟ ಮತ್ತು ಕರ್ನಾಟಕ ವಿಭಾಗ. Ctrl + K ಒತ್ತಿ ಏನನ್ನಾದರೂ ಹುಡುಕಿ.', 'Lessons, the kids\' turtle game and the Karnataka section. Press Ctrl + K to search anything.'),
            demo: <span className="wl-chips"><span>{t('ಕಲಿಯಿರಿ', 'Learn')}</span><span>{t('ಮಕ್ಕಳು', 'Kids')}</span><span>{t('ಕರ್ನಾಟಕ', 'Karnataka')}</span></span>,
        },
    ];
    const s = steps[step];
    const last = step === steps.length - 1;

    return createPortal(
        <div className="wl-overlay" onMouseDown={(e) => e.target === e.currentTarget && close()}>
            <div className="wl" role="dialog" aria-modal="true" aria-labelledby="wl-title">
                <button className="wl-close" onClick={close} aria-label={t('ಮುಚ್ಚಿ', 'Close')}><X size={18} /></button>
                <div className="wl-art" key={step}>
                    <span className="wl-icon"><s.Icon size={34} aria-hidden="true" /></span>
                    <div className="wl-demo">{s.demo}</div>
                </div>
                <h2 id="wl-title" className="wl-title">{s.title}</h2>
                <p className="wl-text">{s.text}</p>
                <div className="wl-dots" aria-hidden="true">
                    {steps.map((_, i) => <span key={i} className={i === step ? 'on' : ''} />)}
                </div>
                <div className="wl-actions">
                    {step === 0 ? (
                        <button className="wl-lang" onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}>
                            {lang === 'en' ? 'ಕನ್ನಡದಲ್ಲಿ ನೋಡಿ' : 'View in English'}
                        </button>
                    ) : (
                        <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>{t('ಹಿಂದೆ', 'Back')}</button>
                    )}
                    {last ? (
                        <button className="btn btn-primary" onClick={start}><Play size={16} /> {t('ನನ್ನ ಮೊದಲ ಪ್ರೋಗ್ರಾಂ', 'My first program')}</button>
                    ) : (
                        <button className="btn btn-primary" onClick={() => setStep(step + 1)}>{t('ಮುಂದೆ', 'Next')} <ArrowRight size={16} /></button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Welcome;
