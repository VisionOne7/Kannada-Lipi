import React, { useState, useMemo } from 'react';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Trophy, Share2 } from 'lucide-react';
import data from '../data/karnataka.json';
import './Quiz.css';

const QUIZ = data.quiz;

// Shuffle a copy (Fisher–Yates) so question order varies each attempt.
const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

// A short Kannada verdict based on the final score ratio.
const verdict = (score, total) => {
    const pct = score / total;
    if (pct === 1) return 'ಪರಿಪೂರ್ಣ! ನೀವು ಕರ್ನಾಟಕ ತಜ್ಞರು!';
    if (pct >= 0.7) return 'ಅದ್ಭುತ! ನಿಮಗೆ ಕರ್ನಾಟಕದ ಬಗ್ಗೆ ಚೆನ್ನಾಗಿ ಗೊತ್ತಿದೆ.';
    if (pct >= 0.4) return 'ಚೆನ್ನಾಗಿದೆ! ಇನ್ನಷ್ಟು ಕಲಿಯಿರಿ.';
    return 'ಪರವಾಗಿಲ್ಲ! ಕರ್ನಾಟಕ ಪುಟ ಓದಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.';
};

const Quiz = () => {
    const [questions, setQuestions] = useState(() => shuffle(QUIZ));
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [picked, setPicked] = useState(null);
    const [finished, setFinished] = useState(false);

    const q = questions[current];
    const progress = useMemo(() => ((current) / questions.length) * 100, [current, questions.length]);

    const choose = (idx) => {
        if (picked !== null) return;
        setPicked(idx);
        if (idx === q.a) setScore((s) => s + 1);
    };

    const next = () => {
        if (current + 1 >= questions.length) {
            setFinished(true);
        } else {
            setCurrent((c) => c + 1);
            setPicked(null);
        }
    };

    const restart = () => {
        setQuestions(shuffle(QUIZ));
        setCurrent(0);
        setScore(0);
        setPicked(null);
        setFinished(false);
    };

    const shareResult = async () => {
        const text = `ನಾನು ಕನ್ನಡ ಲಿಪಿ ಕರ್ನಾಟಕ ರಸಪ್ರಶ್ನೆಯಲ್ಲಿ ${score}/${questions.length} ಅಂಕ ಗಳಿಸಿದೆ!`;
        const url = window.location.origin + '/quiz';
        if (navigator.share) {
            try { await navigator.share({ title: 'ಕರ್ನಾಟಕ ರಸಪ್ರಶ್ನೆ', text, url }); return; } catch { /* cancelled */ }
        }
        try { await navigator.clipboard.writeText(`${text} ${url}`); alert('ಫಲಿತಾಂಶ ನಕಲಿಸಲಾಗಿದೆ!'); } catch { /* ignore */ }
    };

    return (
        <div className="quiz-page animate-in">
            <header className="page-header">
                <h1 className="page-header-title">
                    <span className="page-header-icon"><HelpCircle size={28} /></span>
                    ಕರ್ನಾಟಕ ರಸಪ್ರಶ್ನೆ
                </h1>
                <p className="page-header-subtitle">ನಿಮಗೆ ಕರ್ನಾಟಕದ ಬಗ್ಗೆ ಎಷ್ಟು ಗೊತ್ತು? ಪರೀಕ್ಷಿಸಿಕೊಳ್ಳಿ!</p>
            </header>

            <div className="quiz-content">
                <div className="quiz-box panel">
                    {finished ? (
                        <div className="quiz-result">
                            <Trophy size={56} className="quiz-result-icon" />
                            <h2 className="quiz-result-score">{score} / {questions.length}</h2>
                            <p className="quiz-verdict">{verdict(score, questions.length)}</p>
                            <div className="quiz-result-actions">
                                <button className="btn btn-primary" onClick={restart}>
                                    <RotateCcw size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> ಮತ್ತೆ ಆಡಿ
                                </button>
                                <button className="btn btn-secondary" onClick={shareResult}>
                                    <Share2 size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> ಹಂಚಿಕೊಳ್ಳಿ
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="quiz-progress-bar">
                                <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
                            </div>
                            <div className="quiz-meta">
                                <span>ಪ್ರಶ್ನೆ {current + 1} / {questions.length}</span>
                                <span>ಅಂಕ: {score}</span>
                            </div>

                            <h2 className="quiz-question">{q.q}</h2>

                            <div className="quiz-options">
                                {q.o.map((opt, i) => {
                                    let cls = 'quiz-option';
                                    if (picked !== null) {
                                        if (i === q.a) cls += ' correct';
                                        else if (i === picked) cls += ' wrong';
                                    }
                                    return (
                                        <button key={i} className={cls} onClick={() => choose(i)} disabled={picked !== null}>
                                            <span>{opt}</span>
                                            {picked !== null && i === q.a && <CheckCircle size={18} />}
                                            {picked !== null && i === picked && i !== q.a && <XCircle size={18} />}
                                        </button>
                                    );
                                })}
                            </div>

                            {picked !== null && (
                                <button className="btn btn-primary quiz-next" onClick={next}>
                                    {current + 1 >= questions.length ? 'ಫಲಿತಾಂಶ ನೋಡಿ →' : 'ಮುಂದಿನ ಪ್ರಶ್ನೆ →'}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quiz;
