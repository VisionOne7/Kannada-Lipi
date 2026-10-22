import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CalendarDays, Play, Lightbulb, CheckCircle2, Flame, Trophy, RefreshCw } from 'lucide-react';
import { kannadaLipi } from '../lib/js/interpreter/index.js';
import OutputText from '../components/OutputText';
import { getDailyChallenge, dayKey, CHALLENGES } from '../data/challenges';
import './DailyChallenge.css';
import HighlightedTextarea from '../components/HighlightedTextarea';

const STREAK_KEY = 'kl_challenge_streak';
const LAST_KEY = 'kl_challenge_last';
const DONE_PREFIX = 'kl_challenge_done_';

const LEVEL_LABEL = { 1: 'ಸುಲಭ', 2: 'ಮಧ್ಯಮ', 3: 'ಕಠಿಣ' };

// Read the current streak, resetting it if the user missed more than a day.
const readStreak = () => {
    const streak = Number(localStorage.getItem(STREAK_KEY) || 0);
    const last = localStorage.getItem(LAST_KEY);
    if (!last) return 0;
    const lastDate = new Date(last);
    const today = new Date();
    const diffDays = Math.floor((today - new Date(dayKey(today))) / 86400000); // 0
    void diffDays;
    const gap = Math.floor((new Date(dayKey(today)) - new Date(dayKey(lastDate))) / 86400000);
    // If last completion was before yesterday, the streak is broken.
    return gap > 1 ? 0 : streak;
};

const DailyChallenge = () => {
    const challenge = useMemo(() => getDailyChallenge(), []);
    const todayKey = dayKey();
    const alreadyDone = localStorage.getItem(DONE_PREFIX + todayKey) === '1';

    const [code, setCode] = useState(challenge.starter);
    const [output, setOutput] = useState('');
    const [solved, setSolved] = useState(alreadyDone);
    const [showHint, setShowHint] = useState(false);
    const [streak, setStreak] = useState(0);
    const [justSolved, setJustSolved] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        setStreak(readStreak());
    }, []);

    const markSolvedToday = () => {
        if (localStorage.getItem(DONE_PREFIX + todayKey) === '1') return; // no double count
        localStorage.setItem(DONE_PREFIX + todayKey, '1');

        const last = localStorage.getItem(LAST_KEY);
        let newStreak = 1;
        if (last) {
            const gap = Math.floor((new Date(todayKey) - new Date(dayKey(new Date(last)))) / 86400000);
            if (gap === 1) newStreak = Number(localStorage.getItem(STREAK_KEY) || 0) + 1;
            else if (gap === 0) newStreak = Number(localStorage.getItem(STREAK_KEY) || 1);
        }
        localStorage.setItem(STREAK_KEY, String(newStreak));
        localStorage.setItem(LAST_KEY, todayKey);
        setStreak(newStreak);
    };

    const runCode = () => {
        const result = kannadaLipi.execute(code);
        setOutput(result.output);
        const got = (result.output || '').trim();
        if (got === challenge.expectedOutput.trim()) {
            if (!solved) {
                setJustSolved(true);
                markSolvedToday();
                setTimeout(() => setJustSolved(false), 2500);
            }
            setSolved(true);
        }
    };

    const insertAtCursor = (text) => {
        const ta = textareaRef.current;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        setCode(code.slice(0, start) + text + code.slice(end));
        setTimeout(() => { ta.focus(); ta.setSelectionRange(start + text.length, start + text.length); }, 0);
    };

    const dateLabel = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });

    return (
        <div className="challenge-page animate-in">
            <header className="page-header">
                <h1 className="page-header-title">
                    <span className="page-header-icon"><CalendarDays size={28} /></span>
                    ಇಂದಿನ ಸವಾಲು
                </h1>
                <p className="page-header-subtitle">ಪ್ರತಿದಿನ ಒಂದು ಹೊಸ ಸವಾಲು — ಬಗೆಹರಿಸಿ, ಸ್ಟ್ರೀಕ್ ಬೆಳೆಸಿ!</p>
            </header>

            <div className="challenge-content">
                {/* Streak + date strip */}
                <div className="challenge-topbar">
                    <div className="streak-badge">
                        <Flame size={18} className="streak-flame" />
                        <span className="streak-num">{streak}</span>
                        <span className="streak-label">ದಿನ ಸ್ಟ್ರೀಕ್</span>
                    </div>
                    <div className="challenge-date">{dateLabel}</div>
                </div>

                {/* Challenge card */}
                <div className="challenge-card panel">
                    <div className="challenge-card-head">
                        <span className={`level-chip level-${challenge.level}`}>{LEVEL_LABEL[challenge.level]}</span>
                        <h2 className="challenge-title">{challenge.title}</h2>
                        {solved && <span className="solved-chip"><CheckCircle2 size={15} /> ಪೂರ್ಣಗೊಂಡಿದೆ</span>}
                    </div>
                    <p className="challenge-prompt">{challenge.prompt}</p>

                    {/* Editor */}
                    <div className="challenge-editor-wrap">
                        <HighlightedTextarea
                            ref={textareaRef}
                            wrapperClassName="challenge-editor-hl"
                            className="challenge-editor"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Tab') { e.preventDefault(); insertAtCursor('  '); }
                            }}
                            spellCheck="false"
                            placeholder="ಇಲ್ಲಿ ನಿಮ್ಮ ಕೋಡ್ ಬರೆಯಿರಿ..."
                        />
                    </div>

                    <div className="challenge-actions">
                        <button className="btn btn-primary" onClick={runCode}>
                            <Play size={15} style={{ marginRight: 5, verticalAlign: 'middle' }} /> ರನ್ ಮಾಡಿ
                        </button>
                        <button className="btn btn-secondary" onClick={() => setShowHint((s) => !s)}>
                            <Lightbulb size={15} style={{ marginRight: 5, verticalAlign: 'middle' }} /> {showHint ? 'ಸುಳಿವು ಮರೆಮಾಡಿ' : 'ಸುಳಿವು'}
                        </button>
                    </div>

                    {showHint && <div className="challenge-hint"><Lightbulb size={15} style={{ verticalAlign: "-2px" }} /> {challenge.hint}</div>}

                    {/* Output */}
                    <div className="challenge-output-label">ಔಟ್‌ಪುಟ್</div>
                    <div className={`challenge-output ${solved ? 'ok' : ''}`}>
                        <OutputText text={output} placeholder="ಕೋಡ್ ರನ್ ಮಾಡಿ ಫಲಿತಾಂಶ ನೋಡಿ..." />
                    </div>

                    {solved && (
                        <div className="challenge-success">
                            <Trophy size={20} /> ಶಭಾಷ್! ಸವಾಲನ್ನು ಗೆದ್ದಿರಿ. ನಾಳೆ ಮತ್ತೊಂದು ಸವಾಲಿಗೆ ಬನ್ನಿ!
                        </div>
                    )}
                </div>

                <p className="challenge-foot">
                    <RefreshCw size={13} style={{ verticalAlign: 'middle' }} /> ಪ್ರತಿದಿನ ಮಧ್ಯರಾತ್ರಿ ಹೊಸ ಸವಾಲು. ಒಟ್ಟು {CHALLENGES.length} ಸವಾಲುಗಳು.
                </p>
            </div>

            {/* Celebration overlay */}
            {justSolved && (
                <div className="challenge-celebrate">
                    <div className="celebrate-emoji"><Trophy size={56} strokeWidth={1.6} /></div>
                    <div className="celebrate-text">ಸ್ಟ್ರೀಕ್ +೧!</div>
                </div>
            )}
        </div>
    );
};

export default DailyChallenge;
