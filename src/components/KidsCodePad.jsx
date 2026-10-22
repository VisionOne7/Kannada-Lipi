import React, { useRef } from 'react';
import { Play, RotateCcw, Lightbulb } from 'lucide-react';
import HighlightedTextarea from './HighlightedTextarea';

/**
 * A big-text code box for children, with tap-to-insert command chips so a
 * child who can't yet type Kannada can still build a program.
 */
const KidsCodePad = ({ code, setCode, palette = [], onRun, onReset, onHint, runLabel = 'ರನ್ ಮಾಡಿ' }) => {
    const ref = useRef(null);

    const insert = (text) => {
        const ta = ref.current;
        if (!ta) { setCode(code + text); return; }
        const start = ta.selectionStart ?? code.length;
        const end = ta.selectionEnd ?? code.length;
        // Commands that end in ")" go on their own line unless the snippet says otherwise.
        let snippet = text;
        const before = code.slice(0, start);
        if (!/[\s:{]$/.test(before) && before.length && !snippet.startsWith('\n')) snippet = '\n' + snippet;
        const next = before + snippet + code.slice(end);
        setCode(next);
        const pos = start + snippet.length;
        setTimeout(() => { ta.focus(); ta.setSelectionRange(pos, pos); }, 0);
    };

    const onKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); onRun(); }
    };

    return (
        <div className="kids-pad">
            {palette.length > 0 && (
                <div className="kids-palette" aria-label="ಆಜ್ಞೆಗಳು - ಒತ್ತಿ ಸೇರಿಸಿ">
                    {palette.map((p, i) => (
                        <button type="button" key={i} className="kids-chip" onClick={() => insert(p)}>
                            {p.trim().replace(/:\s*$/, ':')}
                        </button>
                    ))}
                </div>
            )}
            <HighlightedTextarea
                ref={ref}
                theme="dark"
                wrapperClassName="kids-code-hl"
                className="kids-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck="false"
                aria-label="ನಿಮ್ಮ ಕೋಡ್"
                placeholder="ಮೇಲಿನ ಆಜ್ಞೆಗಳನ್ನು ಒತ್ತಿ, ಅಥವಾ ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
            />
            <div className="kids-actions">
                <button type="button" className="btn btn-primary kids-run" onClick={onRun}>
                    <Play size={18} /> {runLabel}
                </button>
                {onReset && (
                    <button type="button" className="btn btn-secondary" onClick={onReset}>
                        <RotateCcw size={16} /> ಮೊದಲಿನಿಂದ
                    </button>
                )}
                {onHint && (
                    <button type="button" className="btn btn-secondary" onClick={onHint}>
                        <Lightbulb size={16} /> ಸುಳಿವು
                    </button>
                )}
            </div>
        </div>
    );
};

export default KidsCodePad;
