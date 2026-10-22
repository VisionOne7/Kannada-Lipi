import React, { useState, useEffect, useRef } from 'react';
import { Play, Keyboard, Copy, Trash2, Share2, Languages, Download, Upload, Lightbulb } from 'lucide-react';
import { kannadaLipi } from '../lib/js/interpreter/index.js';
import TurtleCanvas from './TurtleCanvas';
import OutputText from './OutputText';
import VirtualKeyboard from './VirtualKeyboard';
import './CodeEditor.css';
import HighlightedTextarea from './HighlightedTextarea';

// Transliterate a plain English word → Kannada via Google Input Tools (free,
// no key). Returns the original word on any failure so typing never breaks.
const translitWord = async (word) => {
    if (!/^[a-zA-Z]+$/.test(word)) return word; // only pure latin words
    try {
        const url = `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=kn-t-i0-und&num=1`;
        const res = await fetch(url);
        const data = await res.json();
        if (data[0] === 'SUCCESS' && data[1]?.[0]?.[1]?.[0]) {
            return data[1][0][1][0];
        }
    } catch {
        /* offline or blocked → keep original */
    }
    return word;
};

// Encode/decode code to a URL-safe string. Uses encodeURIComponent so Kannada
// (multi-byte) survives btoa, then makes the base64 URL-safe.
const encodeCode = (text) => {
    try {
        return btoa(encodeURIComponent(text)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch {
        return '';
    }
};

const decodeCode = (encoded) => {
    try {
        const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
        return decodeURIComponent(atob(b64));
    } catch {
        return null;
    }
};

// The welcome demo that auto-types on the homepage editor.
const DEMO_CODE = 'ಮುದ್ರಿಸು("ನಮಸ್ಕಾರ, ಕರ್ನಾಟಕ!")\n\nಅ = ೧೦\nಆ = ೨೦\nಮುದ್ರಿಸು("ಮೊತ್ತ: " ಅ + ಆ)';

const CodeEditor = ({ autoDemo = false }) => {
    // If a ?code= link or saved code exists, that wins and we skip the demo.
    const sharedOrSaved = (() => {
        const params = new URLSearchParams(window.location.search);
        const shared = params.get('code');
        if (shared) { const d = decodeCode(shared); if (d !== null) return d; }
        return localStorage.getItem('kannadalipi_code');
    })();

    const shouldDemo = autoDemo && !sharedOrSaved;

    const [code, setCode] = useState(shouldDemo ? '' : (sharedOrSaved || DEMO_CODE));
    const [output, setOutput] = useState('');
    const [turtle, setTurtle] = useState(null);
    const [shareMsg, setShareMsg] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [demoTyping, setDemoTyping] = useState(shouldDemo);
    const [translit, setTranslit] = useState(() => localStorage.getItem('kl_translit') === '1');
    const textareaRef = useRef(null);
    const demoTimers = useRef([]);

    const toggleTranslit = () => {
        setTranslit((prev) => {
            const next = !prev;
            localStorage.setItem('kl_translit', next ? '1' : '0');
            return next;
        });
        setTimeout(() => textareaRef.current?.focus(), 0);
    };

    // When transliteration is ON, typing a delimiter (space, newline, or a code
    // symbol like ( ) " etc.) converts the English word just typed into Kannada,
    // and preserves the EXACT delimiter the user typed — so no unwanted spaces
    // sneak into code (e.g. mudrisu( → ಮುದ್ರಿಸು( , kannada" → ಕನ್ನಡ").
    const handleTranslitKey = async (e) => {
        if (!translit) return;
        // Trigger on space, enter, or common code delimiters — but not on letters.
        const isDelim = e.key === ' ' || e.key === 'Enter' || /^[()[\]{}"',:;+\-*/%=<>#]$/.test(e.key);
        if (!isDelim) return;
        const ta = textareaRef.current;
        const pos = ta.selectionStart;
        if (pos !== ta.selectionEnd) return;
        const before = ta.value.slice(0, pos);
        const match = before.match(/([a-zA-Z]+)$/);
        if (!match) return;                            // no latin word → type normally

        e.preventDefault();                            // we insert the delimiter ourselves
        const word = match[1];
        const delim = e.key === 'Enter' ? '\n' : e.key;
        const converted = await translitWord(word);

        const head = ta.value.slice(0, pos);
        if (!head.endsWith(word)) return;              // changed mid-fetch → bail safely
        const newBefore = head.slice(0, head.length - word.length) + converted + delim;
        const after = ta.value.slice(pos);
        const result = newBefore + after;
        const newPos = newBefore.length;
        setCode(result);
        setTimeout(() => { ta.focus(); ta.setSelectionRange(newPos, newPos); }, 0);
    };

    useEffect(() => {
        localStorage.removeItem('kannadalipi_code');
    }, []);

    // Auto-type the demo (homepage only), then auto-run it. Any user keypress/
    // click cancels the demo instantly and hands control over.
    useEffect(() => {
        if (!shouldDemo) return;
        let i = 0;
        const step = () => {
            if (i <= DEMO_CODE.length) {
                setCode(DEMO_CODE.slice(0, i));
                i += 1;
                demoTimers.current.push(setTimeout(step, 55));
            } else {
                setDemoTyping(false);
                const result = kannadaLipi.execute(DEMO_CODE);
                setOutput(result.output);
                setTurtle(result.turtle || null);
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

    const runCode = () => {
        const result = kannadaLipi.execute(code);
        setOutput(result.output);
        setTurtle(result.turtle || null);
    };

    // Ctrl/Cmd + Enter runs the program from the keyboard.
    const handleRunShortcut = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runCode();
            return true;
        }
        return false;
    };

    const clearCode = () => {
        if (window.confirm('ಕೋಡ್ ಅಳಿಸಬೇಕೇ?')) {
            setCode('');
            setOutput('');
            setTurtle(null);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        alert('ಕೋಡ್ ನಕಲಿಸಲಾಗಿದೆ!');
    };

    const fileInputRef = useRef(null);

    // Save the current program as a .kl file (download, no backend).
    const saveFile = () => {
        const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kannada-lipi.kl';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Open a .kl (or .txt) file back into the editor.
    const openFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            cancelDemo();
            setCode(String(ev.target.result || ''));
            setOutput('');
            setTurtle(null);
        };
        reader.readAsText(file);
        e.target.value = ''; // allow re-opening the same file
    };

    const shareCode = async () => {
        const url = `${window.location.origin}${window.location.pathname}?code=${encodeCode(code)}`;
        const shareData = { title: 'ಕನ್ನಡ ಲಿಪಿ', text: 'ನನ್ನ ಕನ್ನಡ ಕೋಡ್ ನೋಡಿ!', url };
        // Use the native share sheet on mobile; fall back to clipboard on desktop.
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch {
                // user cancelled or share failed — fall through to clipboard
            }
        }
        try {
            await navigator.clipboard.writeText(url);
            setShareMsg('ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ. ಈಗ ಹಂಚಿಕೊಳ್ಳಿ.');
        } catch {
            setShareMsg('ಲಿಂಕ್: ' + url);
        }
        setTimeout(() => setShareMsg(''), 4000);
    };

    // Apply an edit at the cursor, reading the live textarea so fast taps never drop text.
    const editAtCursor = (fn) => {
        const ta = textareaRef.current;
        if (!ta) return;
        cancelDemo();
        const { text, caret } = fn(ta.value, ta.selectionStart, ta.selectionEnd);
        setCode(text);
        setTimeout(() => {
            ta.focus({ preventScroll: true });
            ta.setSelectionRange(caret, caret);
        }, 0);
    };

    // caretBack: how many characters to step back, e.g. 1 puts the cursor inside "()".
    const insertText = (insert, caretBack = 0) => editAtCursor((v, s0, e0) => ({
        text: v.slice(0, s0) + insert + v.slice(e0),
        caret: s0 + insert.length - caretBack,
    }));

    // Replace the `count` characters before the cursor (used for ಕ → ಕಿ).
    const replaceBefore = (count, insert) => editAtCursor((v, s0, e0) => {
        const from = Math.max(0, s0 - count);
        return { text: v.slice(0, from) + insert + v.slice(e0), caret: from + insert.length };
    });

    const handleBackspace = () => editAtCursor((v, s0, e0) => {
        if (s0 !== e0) return { text: v.slice(0, s0) + v.slice(e0), caret: s0 };
        if (s0 === 0) return { text: v, caret: 0 };
        return { text: v.slice(0, s0 - 1) + v.slice(e0), caret: s0 - 1 };
    });

    // Move by whole letters (grapheme clusters) so ಕಿ is never split in two.
    const moveCaret = (delta) => editAtCursor((v, s0) => {
        let caret = s0;
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
            const bounds = [0];
            for (const seg of new Intl.Segmenter('kn', { granularity: 'grapheme' }).segment(v)) bounds.push(seg.index + seg.segment.length);
            if (delta < 0) caret = [...bounds].reverse().find((b0) => b0 < s0) ?? 0;
            else caret = bounds.find((b0) => b0 > s0) ?? v.length;
        } else {
            caret = Math.min(v.length, Math.max(0, s0 + delta));
        }
        return { text: v, caret };
    });

    const lineNumbersRef = useRef(null);

    const handleScroll = (e) => {
        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = e.target.scrollTop;
        }
    };

    return (
        <div className="code-editor-section panel">
            <div className="main-editor-area">
                <div className="editor-column">
                    <div className="editor-controls">
                        <div className="btn-group">
                            <button className="btn btn-primary run-btn" onClick={runCode} title="ರನ್ ಮಾಡಿ (Ctrl + Enter)">
                                <Play size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ರನ್ ಮಾಡಿ
                            </button>
                            <button
                                className={`btn ${translit ? 'btn-accent' : 'btn-secondary'} translit-toggle`}
                                onClick={toggleTranslit}
                                title="English ಟೈಪ್ ಮಾಡಿ, ಕನ್ನಡ ಬರುತ್ತದೆ (namaskara → ನಮಸ್ಕಾರ)"
                            >
                                <Languages size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> {translit ? 'ಕನ್ನಡ ಆನ್' : 'EN→ಕ'}
                            </button>
                            <button className={`btn ${isKeyboardVisible ? 'btn-accent' : 'btn-secondary'}`} onClick={() => setKeyboardVisible(!isKeyboardVisible)} aria-pressed={isKeyboardVisible}>
                                <Keyboard size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ಕೀಬೋರ್ಡ್
                            </button>
                            <button className="btn btn-secondary" onClick={copyToClipboard}>
                                <Copy size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ನಕಲಿಸಿ
                            </button>
                            <button className="btn btn-secondary" onClick={shareCode}>
                                <Share2 size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ಹಂಚಿಕೊಳ್ಳಿ
                            </button>
                            <button className="btn btn-secondary" onClick={saveFile} title="ಕೋಡ್ ಅನ್ನು .kl ಫೈಲ್ ಆಗಿ ಉಳಿಸಿ">
                                <Download size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ಉಳಿಸಿ
                            </button>
                            <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()} title=".kl ಫೈಲ್ ತೆರೆಯಿರಿ">
                                <Upload size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ತೆರೆಯಿರಿ
                            </button>
                            <input ref={fileInputRef} type="file" accept=".kl,.txt,text/plain" onChange={openFile} style={{ display: 'none' }} />
                            <button className="btn btn-secondary" onClick={clearCode}>
                                <Trash2 size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ಅಳಿಸಿ
                            </button>
                        </div>
                        {shareMsg && <div className="share-msg">{shareMsg}</div>}
                        {translit && <div className="translit-hint"><Lightbulb size={14} style={{ verticalAlign: "-2px" }} /> English ಟೈಪ್ ಮಾಡಿ, space ಒತ್ತಿ — ಕನ್ನಡ ಬರುತ್ತದೆ (ಉದಾ: <b>namaskara</b> → ನಮಸ್ಕಾರ). ಇದಕ್ಕೆ ಇಂಟರ್ನೆಟ್ ಬೇಕು.</div>}
                    </div>

                    <div className="editor-with-keyboard">
                        <div className={`editor-container${isKeyboardVisible ? ' keyboard-open' : ''}`}>
                            <div className="line-numbers" ref={lineNumbersRef}>
                                {code.split('\n').map((_, i) => (
                                    <div key={i}>{i + 1}</div>
                                ))}
                            </div>
                            <HighlightedTextarea
                                ref={textareaRef}
                                className={`editor-textarea${demoTyping ? ' demo-typing' : ''}`}
                                value={code}
                                onChange={(e) => { cancelDemo(); setCode(e.target.value); }}
                                onScroll={handleScroll}
                                onMouseDown={cancelDemo}
                                onKeyDown={(e) => { cancelDemo(); if (!handleRunShortcut(e)) handleTranslitKey(e); }}
                                aria-label="ಕನ್ನಡ ಲಿಪಿ ಕೋಡ್ ಎಡಿಟರ್"
                                inputMode={isKeyboardVisible ? 'none' : undefined}
                                readOnly={demoTyping}
                                spellCheck="false"
                                placeholder="ಇಲ್ಲಿ ನಿಮ್ಮ ಕೋಡ್ ಬರೆಯಿರಿ..."
                            />
                        </div>

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
                    <h4 className="output-label">
                        ಔಟ್‌ಪುಟ್ (Output)
                    </h4>
                    <div className={`output-screen${turtle ? ' has-turtle' : ''}`} aria-live="polite">
                        {turtle && (
                            <div className="output-turtle">
                                <TurtleCanvas turtle={turtle} compact />
                            </div>
                        )}
                        <OutputText
                            text={output}
                            placeholder={turtle ? '' : 'ಕೋಡ್ ರನ್ ಮಾಡಿದಾಗ ಇಲ್ಲಿ ಫಲಿತಾಂಶ ಕಾಣಿಸುತ್ತದೆ...'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
