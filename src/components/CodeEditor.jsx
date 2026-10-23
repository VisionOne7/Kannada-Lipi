import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import {
    Play, Keyboard, Copy, Trash2, Share2, Languages, Download, Upload, Lightbulb, FolderOpen,
    Image as ImageIcon, Variable, ChevronDown } from 'lucide-react';
import { kannadaLipi } from '../lib/js/interpreter/index.js';
import { transliterate } from '../lib/js/translit.js';
import { suggest } from '../lib/js/completions.js';
import { encodeText, decodeText } from '../lib/js/share.js';
import { codeToImage } from '../lib/js/codeImage.js';
import { useLang } from '../lib/i18n';
import TurtleCanvas from './TurtleCanvas';
import OutputText from './OutputText';
import VirtualKeyboard from './VirtualKeyboard';
import ProgramsPanel from './ProgramsPanel';
import HighlightedTextarea from './HighlightedTextarea';
import './CodeEditor.css';

// The welcome demo that auto-types on the homepage editor.
const DEMO_CODE = 'ಮುದ್ರಿಸು("ನಮಸ್ಕಾರ, ಕರ್ನಾಟಕ!")\n\nಅ = ೧೦\nಆ = ೨೦\nಮುದ್ರಿಸು("ಮೊತ್ತ: " ಅ + ಆ)';

const KN_DIGITS = ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'];
const kn = (n) => String(n).replace(/[0-9]/g, (d) => KN_DIGITS[d]);

// How a variable's value reads in the variables panel
const typeOf = (v) => (Array.isArray(v) ? ['ಪಟ್ಟಿ', 'List'] : v && typeof v === 'object' ? ['ನಿಘಂಟು', 'Dictionary']
    : typeof v === 'number' || /^-?[0-9೦-೯.]+$/.test(String(v)) ? ['ಸಂಖ್ಯೆ', 'Number']
        : typeof v === 'boolean' ? ['ತಾರ್ಕಿಕ', 'Boolean'] : ['ಪಠ್ಯ', 'Text']);
const show = (v) => {
    if (Array.isArray(v)) return `[${v.map(show).join(', ')}]`;
    if (v && typeof v === 'object') return `{${Object.entries(v).map(([k, x]) => `${k}: ${show(x)}`).join(', ')}}`;
    if (typeof v === 'boolean') return v ? 'ಸತ್ಯ' : 'ಸುಳ್ಳು';
    if (typeof v === 'number') return kn(v);
    return String(v);
};

const CodeEditor = ({ autoDemo = false }) => {
    const { t } = useLang();

    // If a ?code= link or saved code exists, that wins and we skip the demo.
    const sharedOrSaved = (() => {
        const params = new URLSearchParams(window.location.search);
        const shared = params.get('code');
        if (shared) { const d = decodeText(shared); if (d !== null) return d; }
        try { return localStorage.getItem('kannadalipi_code'); } catch { return null; }
    })();

    const shouldDemo = autoDemo && !sharedOrSaved;

    const [code, setCode] = useState(shouldDemo ? '' : (sharedOrSaved || DEMO_CODE));
    const [output, setOutput] = useState('');
    const [turtle, setTurtle] = useState(null);
    const [variables, setVariables] = useState(null);
    const [showVars, setShowVars] = useState(false);
    const [errorLine, setErrorLine] = useState(null);
    const [shareMsg, setShareMsg] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [showPrograms, setShowPrograms] = useState(false);
    const [demoTyping, setDemoTyping] = useState(shouldDemo);
    const [translit, setTranslit] = useState(() => { try { return localStorage.getItem('kl_translit') === '1'; } catch { return false; } });
    const [caret, setCaret] = useState(0);
    const [hideSuggest, setHideSuggest] = useState(false);
    const textareaRef = useRef(null);
    const pendingCaret = useRef(null);
    const demoTimers = useRef([]);
    const lineNumbersRef = useRef(null);
    const fileInputRef = useRef(null);

    const flash = (msg) => {
        setShareMsg(msg);
        setTimeout(() => setShareMsg(''), 4000);
    };

    const toggleTranslit = () => {
        setTranslit((prev) => {
            const next = !prev;
            try { localStorage.setItem('kl_translit', next ? '1' : '0'); } catch { /* storage blocked */ }
            return next;
        });
        setTimeout(() => textareaRef.current?.focus(), 0);
    };

    // Edits are applied to the live textarea value, so fast typing never drops text.
    const editAtCursor = (fn) => {
        const ta = textareaRef.current;
        if (!ta) return;
        cancelDemo();
        const { text, caret: pos } = fn(ta.value, ta.selectionStart, ta.selectionEnd);
        setCaret(pos);
        if (text === ta.value) {
            ta.focus({ preventScroll: true });
            ta.setSelectionRange(pos, pos);
            return;
        }
        // Placed right after React writes the new text (see the layout effect),
        // so a fast next keystroke never lands in the wrong spot.
        pendingCaret.current = pos;
        changeCode(text);
    };

    useLayoutEffect(() => {
        const ta = textareaRef.current;
        if (ta && pendingCaret.current !== null) {
            ta.focus({ preventScroll: true });
            ta.setSelectionRange(pendingCaret.current, pendingCaret.current);
            pendingCaret.current = null;
        }
    }, [code]);

    // Any edit clears the old error underline and re-opens suggestions.
    const changeCode = (text) => {
        setCode(text);
        setErrorLine(null);
        setHideSuggest(false);
    };

    // With English typing on, a delimiter (space, newline, or a code symbol)
    // turns the latin word just typed into Kannada, keeping the exact delimiter:
    // mudrisu( → ಮುದ್ರಿಸು(   It runs offline, in the browser.
    const handleTranslitKey = (e) => {
        if (!translit) return false;
        const isDelim = e.key === ' ' || e.key === 'Enter' || /^[()[\]{}"',:;+\-*/%=<>#]$/.test(e.key);
        if (!isDelim) return false;
        const ta = textareaRef.current;
        const pos = ta.selectionStart;
        if (pos !== ta.selectionEnd) return false;
        const match = ta.value.slice(0, pos).match(/([a-zA-Z]+)$/);
        if (!match) return false;
        e.preventDefault();
        const word = match[1];
        const delim = e.key === 'Enter' ? '\n' : e.key;
        const converted = transliterate(word);
        editAtCursor((v, s0) => {
            const head = v.slice(0, s0 - word.length) + converted + delim;
            return { text: head + v.slice(s0), caret: head.length };
        });
        return true;
    };

    useEffect(() => {
        try { localStorage.removeItem('kannadalipi_code'); } catch { /* storage blocked */ }
    }, []);

    // Auto-type the demo (homepage only), then auto-run it. Any user keypress/
    // click cancels the demo instantly and hands control over.
    useEffect(() => {
        if (!shouldDemo) return undefined;
        let i = 0;
        const step = () => {
            if (i <= DEMO_CODE.length) {
                setCode(DEMO_CODE.slice(0, i));
                i += 1;
                demoTimers.current.push(setTimeout(step, 55));
            } else {
                setDemoTyping(false);
                applyResult(kannadaLipi.execute(DEMO_CODE));
            }
        };
        demoTimers.current.push(setTimeout(step, 500));
        return () => { demoTimers.current.forEach(clearTimeout); demoTimers.current = []; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cancelDemo = () => {
        if (!demoTyping) return;
        demoTimers.current.forEach(clearTimeout);
        demoTimers.current = [];
        setDemoTyping(false);
    };

    const applyResult = (result) => {
        setOutput(result.output);
        setTurtle(result.turtle || null);
        setVariables(result.variables || null);
        setErrorLine(result.success ? null : result.line || null);
    };

    const runCode = () => applyResult(kannadaLipi.execute(code));

    const clearCode = () => {
        if (window.confirm(t('ಕೋಡ್ ಅಳಿಸಬೇಕೇ?', 'Clear the code?'))) {
            changeCode('');
            setOutput('');
            setTurtle(null);
            setVariables(null);
        }
    };

    const loadCode = (text) => {
        cancelDemo();
        changeCode(text);
        setOutput('');
        setTurtle(null);
        setVariables(null);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            flash(t('ಕೋಡ್ ನಕಲಿಸಲಾಗಿದೆ.', 'Code copied.'));
        } catch {
            flash(t('ನಕಲಿಸಲು ಆಗಲಿಲ್ಲ.', 'Could not copy.'));
        }
    };

    const download = (blob, name) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Save the current program as a .kl file (download, no backend).
    const saveFile = () => download(new Blob([code], { type: 'text/plain;charset=utf-8' }), 'kannada-lipi.kl');

    // Open a .kl (or .txt) file back into the editor.
    const openFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => loadCode(String(ev.target.result || ''));
        reader.readAsText(file);
        e.target.value = ''; // allow re-opening the same file
    };

    const shareCode = async () => {
        const url = `${window.location.origin}/?code=${encodeText(code)}`;
        // Use the native share sheet on mobile; fall back to clipboard on desktop.
        if (navigator.share) {
            try {
                await navigator.share({ title: 'ಕನ್ನಡ ಲಿಪಿ', text: t('ನನ್ನ ಕನ್ನಡ ಕೋಡ್ ನೋಡಿ!', 'See my Kannada code!'), url });
                return;
            } catch { /* cancelled: fall through to clipboard */ }
        }
        try {
            await navigator.clipboard.writeText(url);
            flash(t('ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ. ಈಗ ಹಂಚಿಕೊಳ್ಳಿ.', 'Link copied. Share it now.'));
        } catch {
            flash(t('ಲಿಂಕ್: ', 'Link: ') + url);
        }
    };

    // Share the code (and its output) as a picture
    const shareImage = async () => {
        if (!code.trim()) { flash(t('ಚಿತ್ರ ಮಾಡಲು ಕೋಡ್ ಇಲ್ಲ.', 'There is no code to turn into a picture.')); return; }
        const blob = await codeToImage(code, output);
        if (!blob) return;
        const file = new File([blob], 'kannada-lipi-code.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try { await navigator.share({ files: [file], title: 'ಕನ್ನಡ ಲಿಪಿ', text: 'k-lipi.in' }); return; } catch { /* cancelled */ }
        }
        download(blob, 'kannada-lipi-code.png');
        flash(t('ಚಿತ್ರ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ.', 'Picture downloaded.'));
    };

    // caretBack: how many characters to step back, e.g. 1 puts the cursor inside "()".
    const insertText = (insert, caretBack = 0) => editAtCursor((v, s0, e0) => ({
        text: v.slice(0, s0) + insert + v.slice(e0),
        caret: s0 + insert.length - caretBack,
    }));

    // Replace the `count` characters before the cursor (used for ಕ → ಕಿ).
    const replaceBefore = (count, insert, caretBack = 0) => editAtCursor((v, s0, e0) => {
        const from = Math.max(0, s0 - count);
        return { text: v.slice(0, from) + insert + v.slice(e0), caret: from + insert.length - caretBack };
    });

    const handleBackspace = () => editAtCursor((v, s0, e0) => {
        if (s0 !== e0) return { text: v.slice(0, s0) + v.slice(e0), caret: s0 };
        if (s0 === 0) return { text: v, caret: 0 };
        return { text: v.slice(0, s0 - 1) + v.slice(e0), caret: s0 - 1 };
    });

    // Move by whole letters (grapheme clusters) so ಕಿ is never split in two.
    const moveCaret = (delta) => editAtCursor((v, s0) => {
        let pos = s0;
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
            const bounds = [0];
            for (const seg of new Intl.Segmenter('kn', { granularity: 'grapheme' }).segment(v)) bounds.push(seg.index + seg.segment.length);
            if (delta < 0) pos = [...bounds].reverse().find((b0) => b0 < s0) ?? 0;
            else pos = bounds.find((b0) => b0 > s0) ?? v.length;
        } else {
            pos = Math.min(v.length, Math.max(0, s0 + delta));
        }
        return { text: v, caret: pos };
    });

    // Autocomplete for the Kannada word before the cursor
    const { prefix, items: suggestions } = useMemo(
        () => (demoTyping || hideSuggest ? { prefix: '', items: [] } : suggest(code, caret)),
        [code, caret, demoTyping, hideSuggest]
    );
    const accept = (s) => replaceBefore(prefix.length, s.insert, s.caretBack);
    const trackCaret = (e) => setCaret(e.target.selectionStart);

    const handleKeyDown = (e) => {
        cancelDemo();
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runCode();
            return;
        }
        if (suggestions.length && e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            accept(suggestions[0]);
            return;
        }
        if (suggestions.length && e.key === 'Escape') {
            setHideSuggest(true);
            return;
        }
        handleTranslitKey(e);
    };

    const handleScroll = (e) => {
        if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = e.target.scrollTop;
    };

    const varEntries = variables ? Object.entries(variables) : [];
    const firstDoc = suggestions[0]?.doc;

    const iconBtn = (Icon, label, onClick, extra = {}) => (
        <button className="btn btn-secondary btn-icon" onClick={onClick} title={label} aria-label={label} {...extra}>
            <Icon size={16} aria-hidden="true" />
        </button>
    );

    return (
        <div className="code-editor-section panel">
            <div className="main-editor-area">
                <div className="editor-column">
                    <div className="editor-controls">
                        <div className="btn-group">
                            <button className="btn btn-primary run-btn" onClick={runCode} title={t('ರನ್ ಮಾಡಿ (Ctrl + Enter)', 'Run (Ctrl + Enter)')}>
                                <Play size={14} /> {t('ರನ್ ಮಾಡಿ', 'Run')}
                            </button>
                            <button
                                className={`btn ${translit ? 'btn-accent' : 'btn-secondary'} translit-toggle`}
                                onClick={toggleTranslit}
                                aria-pressed={translit}
                                title={t('English ಟೈಪ್ ಮಾಡಿ, ಕನ್ನಡ ಬರುತ್ತದೆ (mudrisu → ಮುದ್ರಿಸು)', 'Type English, get Kannada (mudrisu → ಮುದ್ರಿಸು)')}
                            >
                                <Languages size={14} /> {translit ? t('ಕನ್ನಡ ಆನ್', 'Kannada on') : 'EN→ಕ'}
                            </button>
                            <button className={`btn ${isKeyboardVisible ? 'btn-accent' : 'btn-secondary'}`} onClick={() => setKeyboardVisible(!isKeyboardVisible)} aria-pressed={isKeyboardVisible}>
                                <Keyboard size={14} /> {t('ಕೀಬೋರ್ಡ್', 'Keyboard')}
                            </button>
                            <button className="btn btn-secondary" onClick={() => setShowPrograms(true)}>
                                <FolderOpen size={14} /> {t('ನನ್ನ ಪ್ರೋಗ್ರಾಂಗಳು', 'My programs')}
                            </button>
                            <span className="btn-group-icons">
                                {iconBtn(Copy, t('ನಕಲಿಸಿ', 'Copy'), copyToClipboard)}
                                {iconBtn(Share2, t('ಲಿಂಕ್ ಹಂಚಿಕೊಳ್ಳಿ', 'Share link'), shareCode)}
                                {iconBtn(ImageIcon, t('ಚಿತ್ರವಾಗಿ ಹಂಚಿಕೊಳ್ಳಿ', 'Share as picture'), shareImage)}
                                {iconBtn(Download, t('.kl ಫೈಲ್ ಆಗಿ ಉಳಿಸಿ', 'Download as .kl file'), saveFile)}
                                {iconBtn(Upload, t('.kl ಫೈಲ್ ತೆರೆಯಿರಿ', 'Open a .kl file'), () => fileInputRef.current?.click())}
                                {iconBtn(Trash2, t('ಅಳಿಸಿ', 'Clear'), clearCode)}
                            </span>
                            <input ref={fileInputRef} type="file" accept=".kl,.txt,text/plain" onChange={openFile} hidden />
                        </div>
                        {shareMsg && <div className="share-msg" role="status">{shareMsg}</div>}
                        {translit && (
                            <div className="translit-hint">
                                <Lightbulb size={14} aria-hidden="true" />
                                <span>{t('English ಟೈಪ್ ಮಾಡಿ, space ಒತ್ತಿ — ಕನ್ನಡ ಬರುತ್ತದೆ', 'Type English and press space to get Kannada')} (<b>mudrisu</b> → ಮುದ್ರಿಸು, <b>aadare</b> → ಆದರೆ). {t('ಇಂಟರ್ನೆಟ್ ಬೇಕಿಲ್ಲ.', 'Works offline.')}</span>
                            </div>
                        )}
                    </div>

                    <div className="editor-with-keyboard">
                        <div className={`editor-container${isKeyboardVisible ? ' keyboard-open' : ''}`}>
                            <div className="line-numbers" ref={lineNumbersRef} aria-hidden="true">
                                {code.split('\n').map((_, i) => (
                                    <div key={i} className={errorLine === i + 1 ? 'err' : undefined}>{i + 1}</div>
                                ))}
                            </div>
                            <HighlightedTextarea
                                ref={textareaRef}
                                className={`editor-textarea${demoTyping ? ' demo-typing' : ''}`}
                                value={code}
                                errorLine={errorLine}
                                onChange={(e) => { cancelDemo(); changeCode(e.target.value); setCaret(e.target.selectionStart); }}
                                onScroll={handleScroll}
                                onMouseDown={cancelDemo}
                                onKeyDown={handleKeyDown}
                                onKeyUp={trackCaret}
                                onClick={trackCaret}
                                onSelect={trackCaret}
                                aria-label={t('ಕನ್ನಡ ಲಿಪಿ ಕೋಡ್ ಎಡಿಟರ್', 'K-Lipi code editor')}
                                aria-autocomplete="list"
                                inputMode={isKeyboardVisible ? 'none' : undefined}
                                readOnly={demoTyping}
                                spellCheck="false"
                                placeholder={t('ಇಲ್ಲಿ ನಿಮ್ಮ ಕೋಡ್ ಬರೆಯಿರಿ...', 'Write your code here...')}
                            />
                        </div>

                        {suggestions.length > 0 && (
                            <div className="suggest-bar" role="listbox" aria-label={t('ಸಲಹೆಗಳು', 'Suggestions')}>
                                {suggestions.map((s, i) => (
                                    <button
                                        key={s.name}
                                        role="option"
                                        aria-selected={i === 0}
                                        className={`suggest-item suggest-${s.kind}${i === 0 ? ' first' : ''}`}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => accept(s)}
                                        title={s.doc ? s.doc.description : undefined}
                                    >
                                        {s.name}{s.kind === 'fn' ? '()' : ''}
                                        {i === 0 && <kbd>Tab</kbd>}
                                    </button>
                                ))}
                                {firstDoc && <span className="suggest-doc">{firstDoc.syntax}</span>}
                            </div>
                        )}

                        {isKeyboardVisible && (
                            <VirtualKeyboard
                                onInsert={insertText}
                                onReplaceBefore={replaceBefore}
                                onBackspace={handleBackspace}
                                onMove={moveCaret}
                                onClose={() => setKeyboardVisible(false)}
                            />
                        )}
                    </div>
                </div>

                <div className="output-panel">
                    <div className="output-head">
                        <h4 className="output-label">{t('ಔಟ್‌ಪುಟ್', 'Output')}</h4>
                        {varEntries.length > 0 && (
                            <button className={`vars-toggle${showVars ? ' open' : ''}`} onClick={() => setShowVars((s) => !s)} aria-expanded={showVars}>
                                <Variable size={14} aria-hidden="true" /> {t('ವೇರಿಯಬಲ್‌ಗಳು', 'Variables')} ({kn(varEntries.length)})
                                <ChevronDown size={14} className="vars-caret" aria-hidden="true" />
                            </button>
                        )}
                    </div>
                    <div className={`output-screen${turtle ? ' has-turtle' : ''}`} aria-live="polite">
                        {turtle && (
                            <div className="output-turtle">
                                <TurtleCanvas turtle={turtle} compact />
                            </div>
                        )}
                        <OutputText
                            text={output}
                            placeholder={turtle ? '' : t('ಕೋಡ್ ರನ್ ಮಾಡಿದಾಗ ಇಲ್ಲಿ ಫಲಿತಾಂಶ ಕಾಣಿಸುತ್ತದೆ...', 'Run your code to see the result here...')}
                        />
                        {errorLine && (
                            <button className="err-jump" onClick={() => {
                                const ta = textareaRef.current;
                                if (!ta) return;
                                const lines = code.split('\n');
                                const pos = lines.slice(0, errorLine - 1).join('\n').length + (errorLine > 1 ? 1 : 0);
                                ta.focus();
                                ta.setSelectionRange(pos, pos + (lines[errorLine - 1] || '').length);
                            }}>
                                {t(`ಸಾಲು ${kn(errorLine)} ಕ್ಕೆ ಹೋಗಿ`, `Go to line ${errorLine}`)}
                            </button>
                        )}
                    </div>
                    {showVars && varEntries.length > 0 && (
                        <div className="vars-panel">
                            <table>
                                <thead>
                                    <tr><th>{t('ಹೆಸರು', 'Name')}</th><th>{t('ಮೌಲ್ಯ', 'Value')}</th><th>{t('ಪ್ರಕಾರ', 'Type')}</th></tr>
                                </thead>
                                <tbody>
                                    {varEntries.map(([name, value]) => {
                                        const [knType, enType] = typeOf(value);
                                        return (
                                            <tr key={name}>
                                                <td className="var-name">{name}</td>
                                                <td className="var-value">{show(value)}</td>
                                                <td className="var-type">{t(knType, enType)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            {showPrograms && <ProgramsPanel code={code} onOpen={loadCode} onClose={() => setShowPrograms(false)} />}
        </div>
    );
};

export default CodeEditor;
