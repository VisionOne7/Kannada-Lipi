import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowLeft, ArrowRight, Delete, CornerDownLeft } from 'lucide-react';
import './VirtualKeyboard.css';

/**
 * On-screen Kannada keyboard for the code editor.
 *
 *  - Letters: tapping a consonant shows its ಗುಣಿತಾಕ್ಷರ (ಕ ಕಾ ಕಿ ಕೀ …) so a child
 *    can pick the vowel sign in one tap. ಕ್ (with ್) starts an ಒತ್ತಕ್ಷರ.
 *  - Functions insert "name()" with the cursor between the brackets.
 *  - Desktop: docked under the editor. Phones: a bottom sheet over the page.
 *
 * Callbacks: onInsert(text, caretBack), onReplaceBefore(count, text),
 * onBackspace(), onMove(delta), onClose().
 */

const SWARAS = ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ಔ', 'ಅಂ', 'ಅಃ'];
const VYANJANAS = [
    ['ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ'], ['ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ'], ['ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ'],
    ['ತ', 'ಥ', 'ದ', 'ಧ', 'ನ'], ['ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ'], ['ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ', 'ಷ', 'ಸ', 'ಹ', 'ಳ'],
];
const CONSONANTS = new Set(VYANJANAS.flat());
const MATRAS = ['', 'ಾ', 'ಿ', 'ೀ', 'ು', 'ೂ', 'ೃ', 'ೆ', 'ೇ', 'ೈ', 'ೊ', 'ೋ', 'ೌ', 'ಂ', 'ಃ', '್'];

// Words that are values, not calls: inserted without brackets.
const VALUES = new Set(['ಪೈ', 'ಇ_ಸಂಖ್ಯೆ', 'ವರ್ಣಮಾಲೆ']);

const TABS = [
    { key: 'letters', label: 'ಅಕ್ಷರ' },
    { key: 'numbers', label: '೧೨೩ + ಚಿಹ್ನೆ' },
    { key: 'functions', label: 'ಕಾರ್ಯಗಳು' },
    { key: 'turtle', label: 'ಆಮೆ' },
    { key: 'control', label: 'ನಿಯಂತ್ರಣ' },
];

const NUMBERS = [
    { label: 'ಕನ್ನಡ ಅಂಕಿ', keys: ['೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯', '೦'] },
    { label: 'ಅಂಕಿಗಳು', keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] },
    { label: 'ಗಣಿತ ಮತ್ತು ಹೋಲಿಕೆ', keys: ['+', '-', '*', '/', '%', '=', '==', '!=', '<', '>', '<=', '>='] },
    { label: 'ಚಿಹ್ನೆಗಳು', keys: ['( )', '[ ]', '{ }', '" "', ',', ':', '#', '.'] },
];

const FUNCTIONS = [
    { label: 'ಮೂಲ', keys: ['ಮುದ್ರಿಸು', 'ಕೊಡು', 'ಒಟ್ಟು', 'ಎಣಿಕೆ', 'ಪ್ರಕಾರ'] },
    { label: 'ಗಣಿತ', keys: ['ಗರಿಷ್ಠ', 'ಕನಿಷ್ಠ', 'ವರ್ಗಮೂಲ', 'ಘಾತ', 'ಯಾದೃಚ್ಛಿಕ', 'ನಿರಪೇಕ್ಷ', 'ಪೂರ್ಣಾಂಕ', 'ಸುತ್ತು', 'ಸರಾಸರಿ', 'ಮೊತ್ತ', 'ಅಂಶ', 'ಲಾಗ್', 'ಮಸಾಅ', 'ಲಸಾಅ', 'ಅವಿಭಾಜ್ಯವೇ', 'ಫಿಬೊನಾಚಿ', 'ಪೈ', 'ಇ_ಸಂಖ್ಯೆ'] },
    { label: 'ಪರಿವರ್ತನೆ', keys: ['ಸಂಖ್ಯೆಗೆ', 'ಪಠ್ಯಕ್ಕೆ', 'ಸಂಖ್ಯೆಯೇ', 'ಅಂಕಿಗಳು', 'ವರ್ಣಮಾಲೆ'] },
    { label: 'ಪಟ್ಟಿ', keys: ['ಏರಿಕೆ', 'ಇಳಿಕೆ', 'ಸಂಗ್ರಹಿಸು', 'ಹುಡುಕು', 'ಸೇರಿಸು', 'ತೆಗೆ', 'ವಿಲೀನ', 'ಪಟ್ಟಿಯ_ಉದ್ದ', 'ಶ್ರೇಣಿ', 'ವಿಶಿಷ್ಟ', 'ತಿರುಗಿಸು', 'ನಕ್ಷೆ', 'ಶೋಧಕ', 'ಕಡಿತ'] },
    { label: 'ನಿಘಂಟು', keys: ['ಕೀಗಳು', 'ಮೌಲ್ಯಗಳು', 'ಕೀ_ಇದೆಯೇ'] },
    { label: 'ಪಠ್ಯ', keys: ['ಜೋಡಿಸು', 'ಉದ್ದ', 'ಪ್ರತಿಬಿಂಬ', 'ಕತ್ತರಿಸು', 'ವಿಭಜಿಸು', 'ಬದಲಿಸು', 'ಒಳಗೊಂಡಿದೆ', 'ಟ್ರಿಮ್', 'ಪುನರಾವರ್ತಿಸು', 'ಪ್ಯಾಡ್', 'ಆರಂಭಿಸು', 'ಕೊನೆಗೊಳ್ಳು', 'ಸ್ಥಾನ', 'ಗಣನೆ', 'ಪದಗಳು', 'ದೊಡ್ಡಕ್ಷರ', 'ಸಣ್ಣಕ್ಷರ'] },
    { label: 'ದಿನಾಂಕ ಮತ್ತು ತ್ರಿಕೋನಮಿತಿ', keys: ['ಇಂದು', 'ಸಮಯ', 'ವರ್ಷ', 'ತಿಂಗಳು', 'ದಿನ', 'ಸೈನ್', 'ಕೊಸೈನ್', 'ಟ್ಯಾನ್'] },
];

const TURTLE = [
    { label: 'ಚಲನೆ', keys: ['ಮುಂದೆ', 'ಹಿಂದೆ', 'ಬಲಕ್ಕೆ', 'ಎಡಕ್ಕೆ', 'ಹೋಗು', 'ದಿಕ್ಕು', 'ಮನೆಗೆ'] },
    { label: 'ಪೆನ್ ಮತ್ತು ಬಣ್ಣ', keys: ['ಬಣ್ಣ', 'ದಪ್ಪ', 'ಪೆನ್_ಮೇಲೆ', 'ಪೆನ್_ಕೆಳಗೆ', 'ವೃತ್ತ', 'ಚುಕ್ಕೆ', 'ಹಿನ್ನೆಲೆ', 'ಆಮೆ_ಮರೆಮಾಡು'] },
    { label: 'ಬಣ್ಣಗಳು', keys: ['"ಕೆಂಪು"', '"ಹಳದಿ"', '"ಹಸಿರು"', '"ನೀಲಿ"', '"ಕಪ್ಪು"', '"ಬಿಳಿ"', '"ಕಿತ್ತಳೆ"', '"ನೇರಳೆ"', '"ಗುಲಾಬಿ"'], literal: true },
];

const CONTROL = [
    { label: 'ಷರತ್ತು', keys: ['ಆದರೆ', 'ಇಲ್ಲವಾದರೆ', 'ಸತ್ಯ', 'ಅಸತ್ಯ'] },
    { label: 'ಲೂಪ್', keys: ['ಪುನರಾವರ್ತನೆ', 'ರಿಂದ', 'ವರೆಗೆ', 'ಆವರ್ತನೆ', 'ನಿಲ್ಲಿಸು', 'ಮುಂದುವರಿಸು'] },
    { label: 'ಕಾರ್ಯ', keys: ['ಕಾರ್ಯ', 'ಹಿಂತಿರುಗಿಸು'] },
    { label: 'ತರ್ಕ', keys: ['ಮತ್ತು', 'ಅಥವಾ', 'ಅಲ್ಲ'] },
    { label: 'ಮಾದರಿಗಳು', keys: ['ಪುನರಾವರ್ತನೆ ನ ೧ ರಿಂದ ೫ ವರೆಗೆ: ', 'ಆದರೆ  : ', ': {\n    \n}'], template: true },
];

const useIsPhone = () => {
    const query = '(max-width: 768px)';
    const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
    useEffect(() => {
        const mq = window.matchMedia(query);
        const on = () => setPhone(mq.matches);
        mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener(on);
        return () => (mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on));
    }, []);
    return phone;
};

// Keep focus (and the cursor) in the editor when a key is pressed.
const keepFocus = (e) => e.preventDefault();

const VirtualKeyboard = ({ onInsert, onReplaceBefore, onBackspace, onMove, onClose }) => {
    const [tab, setTab] = useState('letters');
    const [base, setBase] = useState(null); // consonant waiting for a vowel sign
    const isPhone = useIsPhone();

    // Reserve space at the bottom of the page while the phone sheet is open.
    useEffect(() => {
        if (!isPhone) return undefined;
        document.body.classList.add('vk-sheet-open');
        return () => document.body.classList.remove('vk-sheet-open');
    }, [isPhone]);

    const press = (text, caretBack = 0) => { setBase(null); onInsert(text, caretBack); };

    const pressLetter = (ch) => {
        onInsert(ch, 0);
        setBase(CONSONANTS.has(ch) ? ch : null);
    };

    const pressMatra = (m) => {
        if (!base) return;
        if (m) onReplaceBefore(1, base + m);
        setBase(null);
    };

    const pressCall = (word) => (VALUES.has(word) ? press(word) : press(`${word}()`, 1));
    const pressPair = (k) => {
        // "( )" style keys insert both sides and put the cursor between them
        const pair = k.replace(/\s/g, '');
        if (pair.length === 2 && '([{"'.includes(pair[0])) press(pair, 1);
        else press(k);
    };

    const renderRows = (rows, handler) => rows.map((row) => (
        <div key={row.label} className="vk-row">
            <span className="vk-row-label">{row.label}</span>
            <div className="vk-keys">
                {row.keys.map((k) => (
                    <button
                        type="button"
                        key={k}
                        className={`vk-key${tab !== 'letters' && tab !== 'numbers' ? ' vk-key-word' : ''}`}
                        onMouseDown={keepFocus}
                        onClick={() => handler(k, row)}
                        title={k.trim()}
                    >
                        {k.replace(/\n/g, ' ').trim() || k}
                    </button>
                ))}
            </div>
        </div>
    ));

    const body = (
        <div className={`vk ${isPhone ? 'vk-sheet' : 'vk-docked'}`} role="dialog" aria-label="ಕನ್ನಡ ಕೀಬೋರ್ಡ್">
            <div className="vk-top">
                <div className="vk-tabs" role="tablist">
                    {TABS.map((t) => (
                        <button
                            type="button"
                            role="tab"
                            aria-selected={tab === t.key}
                            key={t.key}
                            className={`vk-tab${tab === t.key ? ' active' : ''}`}
                            onMouseDown={keepFocus}
                            onClick={() => { setTab(t.key); setBase(null); }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <button type="button" className="vk-close" onMouseDown={keepFocus} onClick={onClose} aria-label="ಕೀಬೋರ್ಡ್ ಮುಚ್ಚಿ">
                    <X size={18} />
                </button>
            </div>

            {tab === 'letters' && (
                <div className={`vk-gunita${base ? ' show' : ''}`} aria-live="polite">
                    {base ? (
                        <>
                            <span className="vk-row-label">{base} ಗುಣಿತಾಕ್ಷರ</span>
                            <div className="vk-keys">
                                {MATRAS.map((m) => (
                                    <button type="button" key={m || 'base'} className="vk-key vk-key-gunita" onMouseDown={keepFocus} onClick={() => pressMatra(m)}>
                                        {base + m}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <span className="vk-hint">ವ್ಯಂಜನ ಒತ್ತಿ, ನಂತರ ಇಲ್ಲಿ ಕಾಗುಣಿತ ಆಯ್ಕೆಮಾಡಿ (ಉದಾ: ಕ → ಕಿ). ಒತ್ತಕ್ಷರಕ್ಕೆ ಕ್ ಆರಿಸಿ.</span>
                    )}
                </div>
            )}

            <div className="vk-body">
                {tab === 'letters' && (
                    <>
                        <div className="vk-row">
                            <span className="vk-row-label">ಸ್ವರಗಳು</span>
                            <div className="vk-keys">
                                {SWARAS.map((k) => (
                                    <button type="button" key={k} className="vk-key" onMouseDown={keepFocus} onClick={() => press(k)}>{k}</button>
                                ))}
                            </div>
                        </div>
                        <div className="vk-row">
                            <span className="vk-row-label">ವ್ಯಂಜನಗಳು</span>
                            <div className="vk-vyanjana">
                                {VYANJANAS.map((group, gi) => (
                                    <div key={gi} className="vk-keys">
                                        {group.map((k) => (
                                            <button
                                                type="button"
                                                key={k}
                                                className={`vk-key${base === k ? ' active' : ''}`}
                                                onMouseDown={keepFocus}
                                                onClick={() => pressLetter(k)}
                                            >
                                                {k}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                {tab === 'numbers' && renderRows(NUMBERS, (k) => pressPair(k))}
                {tab === 'functions' && renderRows(FUNCTIONS, (k) => pressCall(k))}
                {tab === 'turtle' && renderRows(TURTLE, (k, row) => (row.literal ? press(k) : pressCall(k)))}
                {tab === 'control' && renderRows(CONTROL, (k, row) => {
                    if (!row.template) return press(`${k} `);
                    if (k.startsWith(': {')) return press(k, 2);
                    if (k.startsWith('ಆದರೆ')) return press(k, 3);
                    return press(k);
                })}
            </div>

            <div className="vk-actions">
                <button type="button" className="vk-action" onMouseDown={keepFocus} onClick={() => { setBase(null); onMove(-1); }} aria-label="ಎಡಕ್ಕೆ ಸರಿಸಿ">
                    <ArrowLeft size={18} />
                </button>
                <button type="button" className="vk-action" onMouseDown={keepFocus} onClick={() => { setBase(null); onMove(1); }} aria-label="ಬಲಕ್ಕೆ ಸರಿಸಿ">
                    <ArrowRight size={18} />
                </button>
                <button type="button" className="vk-action vk-action-wide" onMouseDown={keepFocus} onClick={() => press(' ')}>
                    Space
                </button>
                <button type="button" className="vk-action" onMouseDown={keepFocus} onClick={() => { setBase(null); onBackspace(); }} aria-label="ಅಳಿಸಿ (Backspace)">
                    <Delete size={18} />
                </button>
                <button type="button" className="vk-action" onMouseDown={keepFocus} onClick={() => press('\n')} aria-label="ಹೊಸ ಸಾಲು (Enter)">
                    <CornerDownLeft size={18} />
                </button>
            </div>
        </div>
    );

    return isPhone ? createPortal(body, document.body) : body;
};

export default VirtualKeyboard;
