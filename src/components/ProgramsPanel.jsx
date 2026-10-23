import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FolderOpen, Save, Trash2, X, FileCode } from 'lucide-react';
import { listPrograms, saveProgram, deleteProgram } from '../lib/js/programs.js';
import { useLang } from '../lib/i18n';
import './ProgramsPanel.css';

const KN_DIGITS = ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'];

// "My programs": save the current code under a name, reopen or delete saved ones.
const ProgramsPanel = ({ code, onOpen, onClose }) => {
    const { t, lang } = useLang();
    const [programs, setPrograms] = useState(listPrograms);
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
        const onKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const save = (e) => {
        e.preventDefault();
        if (!code.trim()) { setMsg(t('ಉಳಿಸಲು ಕೋಡ್ ಇಲ್ಲ.', 'There is no code to save.')); return; }
        if (saveProgram(name, code)) {
            setPrograms(listPrograms());
            setName('');
            setMsg(t('ಉಳಿಸಲಾಗಿದೆ.', 'Saved.'));
        } else {
            setMsg(t('ಉಳಿಸಲು ಆಗಲಿಲ್ಲ: ಬ್ರೌಸರ್ ಸಂಗ್ರಹ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ.', 'Could not save: browser storage is blocked.'));
        }
    };

    const remove = (p) => {
        if (window.confirm(t(`"${p.name}" ಅಳಿಸಬೇಕೇ?`, `Delete "${p.name}"?`))) {
            deleteProgram(p.id);
            setPrograms(listPrograms());
        }
    };

    const when = (iso) => {
        const d = new Date(iso);
        const s = d.toLocaleDateString(lang === 'en' ? 'en-IN' : 'kn-IN', { day: 'numeric', month: 'short' })
            + ' ' + d.toLocaleTimeString(lang === 'en' ? 'en-IN' : 'kn-IN', { hour: '2-digit', minute: '2-digit' });
        return lang === 'en' ? s : s.replace(/[0-9]/g, (x) => KN_DIGITS[x]);
    };

    return createPortal(
        <div className="pp-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div className="pp-dialog" role="dialog" aria-modal="true" aria-labelledby="pp-title">
                <header className="pp-head">
                    <h2 id="pp-title"><FolderOpen size={20} aria-hidden="true" /> {t('ನನ್ನ ಪ್ರೋಗ್ರಾಂಗಳು', 'My programs')}</h2>
                    <button className="pp-close" onClick={onClose} aria-label={t('ಮುಚ್ಚಿ', 'Close')}><X size={18} /></button>
                </header>

                <form className="pp-save" onSubmit={save}>
                    <input
                        ref={inputRef}
                        value={name}
                        onChange={(e) => { setName(e.target.value); setMsg(''); }}
                        placeholder={t('ಈ ಕೋಡ್‌ಗೆ ಹೆಸರು ಕೊಡಿ (ಉದಾ: ನನ್ನ ಚೌಕ)', 'Name this code (e.g. My square)')}
                        maxLength={60}
                        aria-label={t('ಪ್ರೋಗ್ರಾಂ ಹೆಸರು', 'Program name')}
                    />
                    <button type="submit" className="btn btn-primary"><Save size={15} /> {t('ಉಳಿಸಿ', 'Save')}</button>
                </form>
                {msg && <p className="pp-msg" role="status">{msg}</p>}

                {programs.length === 0 ? (
                    <div className="pp-empty">
                        <FileCode size={36} aria-hidden="true" />
                        <p>{t('ಇನ್ನೂ ಏನೂ ಉಳಿಸಿಲ್ಲ. ನಿಮ್ಮ ಕೋಡ್‌ಗೆ ಹೆಸರು ಕೊಟ್ಟು ಉಳಿಸಿ.', 'Nothing saved yet. Name your code and save it.')}</p>
                    </div>
                ) : (
                    <ul className="pp-list">
                        {programs.map((p) => (
                            <li key={p.id} className="pp-item">
                                <button className="pp-open" onClick={() => { onOpen(p.code); onClose(); }}>
                                    <span className="pp-name">{p.name}</span>
                                    <span className="pp-meta">{when(p.updated)} · {p.code.split('\n').length} {t('ಸಾಲು', 'lines')}</span>
                                </button>
                                <button className="pp-del" onClick={() => remove(p)} aria-label={t(`${p.name} ಅಳಿಸಿ`, `Delete ${p.name}`)}><Trash2 size={16} /></button>
                            </li>
                        ))}
                    </ul>
                )}
                <p className="pp-note">{t('ಪ್ರೋಗ್ರಾಂಗಳು ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತ್ರ ಉಳಿಯುತ್ತವೆ. ಯಾವುದೂ ಸರ್ವರ್‌ಗೆ ಹೋಗುವುದಿಲ್ಲ.', 'Programs stay in this browser only. Nothing is sent to a server.')}</p>
            </div>
        </div>,
        document.body
    );
};

export default ProgramsPanel;
