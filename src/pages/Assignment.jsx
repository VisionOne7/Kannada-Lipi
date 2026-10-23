import React, { useMemo, useState } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { ClipboardCheck, Play, CheckCircle, RotateCcw, Send, Terminal, TriangleAlert, Eye } from 'lucide-react';
import { kannadaLipi } from '../lib/js/interpreter/index.js';
import { readAssignment, checkAssignment } from '../lib/js/assignment.js';
import { encodeText } from '../lib/js/share.js';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';
import HighlightedTextarea from '../components/HighlightedTextarea';
import OutputText from '../components/OutputText';
import TurtleCanvas from '../components/TurtleCanvas';
import './Assignment.css';

const NAME_KEY = 'kl_assignment_name';

// A student opens a teacher's assignment link, solves it, and sends a note back.
const Assignment = () => {
    const { t } = useLang();
    const [params] = useSearchParams();
    const assignment = useMemo(() => readAssignment(params.get('a')), [params]);
    const [code, setCode] = useState(assignment ? assignment.starter : '');
    const [result, setResult] = useState(null);
    const [status, setStatus] = useState(null);
    const [showExpected, setShowExpected] = useState(false);
    const [name, setName] = useState(() => { try { return localStorage.getItem(NAME_KEY) || ''; } catch { return ''; } });
    const [sent, setSent] = useState('');

    if (!assignment) {
        return (
            <>
                <PageHeader icon={ClipboardCheck} title={t('ಕಾರ್ಯ', 'Assignment')} />
                <div className="asg-page">
                    <div className="asg-empty glass-card">
                        <TriangleAlert size={40} aria-hidden="true" />
                        <h2>{t('ಈ ಕಾರ್ಯ ಲಿಂಕ್ ಸರಿಯಾಗಿಲ್ಲ', 'This assignment link is not valid')}</h2>
                        <p>{t('ಶಿಕ್ಷಕರಿಂದ ಪೂರ್ಣ ಲಿಂಕ್ ಮತ್ತೊಮ್ಮೆ ಕೇಳಿ. ಶಿಕ್ಷಕರು ಶಿಕ್ಷಕರ ಪುಟದಲ್ಲಿ ಹೊಸ ಲಿಂಕ್ ರಚಿಸಬಹುದು.', 'Ask your teacher for the full link again. Teachers can make a new link on the teachers page.')}</p>
                        <NavLink to="/teachers" className="btn btn-primary">{t('ಶಿಕ್ಷಕರ ಪುಟ', 'Teachers page')}</NavLink>
                    </div>
                </div>
            </>
        );
    }

    const run = () => {
        const r = kannadaLipi.execute(code);
        setResult(r);
        return r;
    };

    const check = () => {
        const r = run();
        const verdict = checkAssignment(assignment, r);
        setStatus(verdict);
        if (verdict.ok) confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ['#FFD700', '#D71920', '#ffffff'] });
    };

    const report = async () => {
        const student = name.trim();
        try { localStorage.setItem(NAME_KEY, student); } catch { /* storage blocked */ }
        const when = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
        const text = [
            `ಕನ್ನಡ ಲಿಪಿ ಕಾರ್ಯ ಪೂರ್ಣಗೊಂಡಿದೆ`,
            `ಕಾರ್ಯ: ${assignment.title}`,
            `ವಿದ್ಯಾರ್ಥಿ: ${student || '-'}`,
            `ಸಮಯ: ${when}`,
            `ಕೋಡ್: ${window.location.origin}/?code=${encodeText(code)}`,
        ].join('\n');
        if (navigator.share) {
            try { await navigator.share({ title: assignment.title, text }); setSent('shared'); return; } catch { /* cancelled */ }
        }
        try {
            await navigator.clipboard.writeText(text);
            setSent('copied');
        } catch {
            setSent('failed');
        }
    };

    const failMsg = {
        error: t('ಕೋಡ್‌ನಲ್ಲಿ ದೋಷವಿದೆ. ಔಟ್‌ಪುಟ್‌ನಲ್ಲಿರುವ ಸಲಹೆ ಓದಿ.', 'Your code has an error. Read the hint in the output.'),
        empty: t('ಪ್ರೋಗ್ರಾಂ ಏನನ್ನೂ ಮುದ್ರಿಸಲಿಲ್ಲ.', 'The program did not print anything.'),
        different: t('ಔಟ್‌ಪುಟ್ ನಿರೀಕ್ಷಿತ ಉತ್ತರಕ್ಕೆ ಹೊಂದುತ್ತಿಲ್ಲ. ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.', 'The output does not match the expected answer yet. Try again.'),
    };

    return (
        <>
            <PageHeader icon={ClipboardCheck} title={assignment.title} subtitle={t('ಶಿಕ್ಷಕರು ಕಳುಹಿಸಿದ ಕಾರ್ಯ', 'An assignment from your teacher')} />
            <div className="asg-page animate-in">
                {assignment.task && (
                    <section className="asg-task glass-card">
                        <h2>{t('ಕಾರ್ಯ', 'Task')}</h2>
                        <p>{assignment.task}</p>
                        {assignment.expected && (
                            <button className="asg-link-btn" onClick={() => setShowExpected((s) => !s)} aria-expanded={showExpected}>
                                <Eye size={14} aria-hidden="true" /> {showExpected ? t('ನಿರೀಕ್ಷಿತ ಔಟ್‌ಪುಟ್ ಮರೆಮಾಡಿ', 'Hide expected output') : t('ನಿರೀಕ್ಷಿತ ಔಟ್‌ಪುಟ್ ನೋಡಿ', 'Show expected output')}
                            </button>
                        )}
                        {showExpected && <pre className="asg-expected">{assignment.expected}</pre>}
                    </section>
                )}

                <div className="asg-grid">
                    <section className="asg-editor">
                        <div className="asg-editor-head">
                            <span>{t('ನಿಮ್ಮ ಕೋಡ್', 'Your code')}</span>
                            <button className="asg-link-btn" onClick={() => { setCode(assignment.starter); setStatus(null); }}>
                                <RotateCcw size={13} aria-hidden="true" /> {t('ಮೊದಲಿನ ಕೋಡ್', 'Starting code')}
                            </button>
                        </div>
                        <HighlightedTextarea
                            className="asg-textarea"
                            value={code}
                            errorLine={result && !result.success ? result.line : null}
                            onChange={(e) => { setCode(e.target.value); setStatus(null); setResult(null); }}
                            onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); } }}
                            spellCheck="false"
                            aria-label={t('ಕಾರ್ಯದ ಕೋಡ್ ಎಡಿಟರ್', 'Assignment code editor')}
                        />
                        <div className="asg-actions">
                            <button className="btn btn-secondary" onClick={run}><Play size={15} /> {t('ರನ್ ಮಾಡಿ', 'Run')}</button>
                            <button className="btn btn-primary" onClick={check}><CheckCircle size={15} /> {t('ಪರಿಶೀಲಿಸಿ', 'Check')}</button>
                        </div>
                    </section>

                    <section className="asg-output">
                        <span className="asg-output-label"><Terminal size={14} aria-hidden="true" /> {t('ಔಟ್‌ಪುಟ್', 'Output')}</span>
                        <div className="asg-screen">
                            {result?.turtle?.commands?.length > 0 && <TurtleCanvas turtle={result.turtle} compact />}
                            <OutputText text={result ? result.output : ''} placeholder={t('ರನ್ ಮಾಡಿ ಫಲಿತಾಂಶ ನೋಡಿ', 'Run to see the result')} />
                        </div>
                    </section>
                </div>

                {status && !status.ok && <div className="asg-retry" role="status">{failMsg[status.reason]}</div>}

                {status?.ok && (
                    <section className="asg-done glass-card" role="status">
                        <h2><CheckCircle size={22} aria-hidden="true" /> {t('ಶಭಾಷ್! ಕಾರ್ಯ ಪೂರ್ಣಗೊಂಡಿದೆ', 'Well done! Assignment complete')}</h2>
                        <p>{t('ನಿಮ್ಮ ಹೆಸರು ಬರೆದು ಶಿಕ್ಷಕರಿಗೆ ಕಳುಹಿಸಿ (WhatsApp, ಇಮೇಲ್ ಅಥವಾ ತರಗತಿ ಗುಂಪು).', 'Add your name and send it to your teacher (WhatsApp, email or the class group).')}</p>
                        <div className="asg-report">
                            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('ನಿಮ್ಮ ಹೆಸರು', 'Your name')} maxLength={40} aria-label={t('ನಿಮ್ಮ ಹೆಸರು', 'Your name')} />
                            <button className="btn btn-accent" onClick={report}><Send size={15} /> {t('ಶಿಕ್ಷಕರಿಗೆ ಕಳುಹಿಸಿ', 'Send to teacher')}</button>
                        </div>
                        {sent === 'copied' && <p className="asg-sent">{t('ಸಂದೇಶ ನಕಲಿಸಲಾಗಿದೆ. ಈಗ ಶಿಕ್ಷಕರಿಗೆ ಪೇಸ್ಟ್ ಮಾಡಿ ಕಳುಹಿಸಿ.', 'Message copied. Paste it to your teacher.')}</p>}
                        {sent === 'failed' && <p className="asg-sent">{t('ನಕಲಿಸಲು ಆಗಲಿಲ್ಲ. ಈ ಪುಟದ ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಕಳುಹಿಸಿ.', 'Could not copy. Send a screenshot of this page instead.')}</p>}
                    </section>
                )}
            </div>
        </>
    );
};

export default Assignment;
