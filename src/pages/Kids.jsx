import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useSearchParams, NavLink } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Map as MapIcon, Blocks, Palette, Star, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, GraduationCap, Lightbulb } from 'lucide-react';
import { kannadaLipi } from '../lib/js/interpreter/index.js';
import { kn } from '../lib/js/interpreter/errors.js';
import { checkLevel } from '../lib/js/turtleCheck.js';
import { TURTLE_LEVELS, TURTLE_GALLERY } from '../data/turtleLevels.js';
import TurtleCanvas from '../components/TurtleCanvas';
import KidsCodePad from '../components/KidsCodePad';
import OutputText from '../components/OutputText';
import './Kids.css';

// Blockly is large, so it only loads when the blocks tab is opened.
const BlocklyEditor = lazy(() => import('../components/BlocklyEditor'));

const PROGRESS_KEY = 'kl_kids_levels';
const MODES = [
    { key: 'levels', label: 'ಆಮೆ ಸಾಹಸ', sub: '೧೨ ಹಂತಗಳು', Icon: MapIcon },
    { key: 'blocks', label: 'ಬ್ಲಾಕ್ ಕೋಡಿಂಗ್', sub: 'ಎಳೆದು ಜೋಡಿಸಿ', Icon: Blocks },
    { key: 'draw', label: 'ಚಿತ್ರ ಮೈದಾನ', sub: 'ನಿಮ್ಮ ಕಲೆ', Icon: Palette },
];

const loadDone = () => {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]'); } catch { return []; }
};

const FAIL_MSG = {
    error: 'ಕೋಡ್‌ನಲ್ಲಿ ತಪ್ಪಿದೆ. ಕೆಳಗಿನ ಸಲಹೆ ಓದಿ, ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    miss: 'ಅಯ್ಯೋ! ಆಮೆ ಮಾವಿನ ಹಣ್ಣಿಗೆ ತಲುಪಲಿಲ್ಲ. ಹೆಜ್ಜೆಗಳು ಅಥವಾ ತಿರುವು ಬದಲಿಸಿ ನೋಡಿ.',
    noMove: 'ಆಮೆ ಇನ್ನೂ ಚಲಿಸಿಲ್ಲ. ಮುಂದೆ() ಬಳಸಿ!',
    noDraw: 'ಏನೂ ಬಿಡಿಸಿಲ್ಲ. ಮಸುಕಾದ ಆಕಾರದ ಮೇಲೆ ಆಮೆಯನ್ನು ನಡೆಸಿ.',
    shape: 'ಹತ್ತಿರ ಬಂದಿದ್ದೀರಿ! ನಿಮ್ಮ ಚಿತ್ರ ಮಸುಕಾದ ಆಕಾರಕ್ಕೆ ಇನ್ನೂ ಹೊಂದುತ್ತಿಲ್ಲ.',
};

function Levels() {
    const [done, setDone] = useState(loadDone);
    const firstOpen = useMemo(() => {
        const d = loadDone();
        const next = TURTLE_LEVELS.find((l) => !d.includes(l.id));
        return next ? next.id : 1;
    }, []);
    const [levelId, setLevelId] = useState(firstOpen);
    const level = TURTLE_LEVELS.find((l) => l.id === levelId) || TURTLE_LEVELS[0];
    const [code, setCode] = useState(level.starter);
    const [result, setResult] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [showHint, setShowHint] = useState(false);

    // Target drawing (ghost) and goal marker for this level.
    const target = useMemo(() => kannadaLipi.execute(level.solution).turtle, [level]);
    const goals = useMemo(() => (level.goal.type === 'reach' ? [{ x: level.goal.x, y: level.goal.y, kind: 'mango' }] : []), [level]);
    const ghost = level.goal.type === 'draw' ? target : null;

    useEffect(() => {
        setCode(level.starter);
        setResult(null);
        setFeedback(null);
        setShowHint(false);
    }, [level]);

    const run = () => {
        const r = kannadaLipi.execute(code);
        setResult(r);
        const verdict = checkLevel(level, code, r, target);
        if (verdict.ok) {
            setFeedback({ ok: true });
            if (!done.includes(level.id)) {
                const next = [...done, level.id];
                setDone(next);
                try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
            }
            const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!reduce) confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ['#FFD700', '#D71920', '#FF8C00'] });
        } else {
            const msg = verdict.reason === 'mustUse'
                ? `ಈ ಹಂತದಲ್ಲಿ "${verdict.word}" ಬಳಸಬೇಕು. ಅದನ್ನು ಬಳಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.`
                : FAIL_MSG[verdict.reason] || FAIL_MSG.shape;
            setFeedback({ ok: false, msg });
        }
    };

    const idx = TURTLE_LEVELS.findIndex((l) => l.id === level.id);
    const goNext = () => idx < TURTLE_LEVELS.length - 1 && setLevelId(TURTLE_LEVELS[idx + 1].id);
    const goPrev = () => idx > 0 && setLevelId(TURTLE_LEVELS[idx - 1].id);
    const allDone = done.length >= TURTLE_LEVELS.length;

    return (
        <div className="levels-wrap">
            <nav className="level-map" aria-label="ಹಂತಗಳು">
                {TURTLE_LEVELS.map((l) => (
                    <button
                        type="button"
                        key={l.id}
                        className={`level-dot${l.id === level.id ? ' active' : ''}${done.includes(l.id) ? ' done' : ''}`}
                        onClick={() => setLevelId(l.id)}
                        title={l.title}
                        aria-label={`ಹಂತ ${kn(l.id)}: ${l.title}${done.includes(l.id) ? ' (ಮುಗಿದಿದೆ)' : ''}`}
                        aria-current={l.id === level.id ? 'step' : undefined}
                    >
                        {done.includes(l.id) ? <Star size={14} fill="currentColor" /> : kn(l.id)}
                    </button>
                ))}
                <span className="level-count">{kn(done.length)} / {kn(TURTLE_LEVELS.length)} <Star size={13} fill="currentColor" /></span>
            </nav>

            <div className="levels-grid">
                <section className="glass-card level-panel">
                    <div className="level-head">
                        <span className="level-tag">ಹಂತ {kn(level.id)} · {level.concept}</span>
                        <h2>{level.title}</h2>
                        <p className="level-story">{level.story}</p>
                    </div>
                    <KidsCodePad
                        code={code}
                        setCode={setCode}
                        palette={level.palette}
                        onRun={run}
                        onReset={() => { setCode(level.starter); setResult(null); setFeedback(null); }}
                        onHint={() => setShowHint((s) => !s)}
                    />
                    {showHint && <div className="kids-hint"><Lightbulb size={16} style={{ verticalAlign: "-2px" }} /> {level.hint}</div>}
                </section>

                <section className="glass-card level-stage">
                    <TurtleCanvas turtle={result?.turtle || null} goals={goals} ghost={ghost} />
                    {feedback && (
                        feedback.ok ? (
                            <div className="level-win" role="status">
                                <CheckCircle2 size={22} />
                                <div>
                                    <strong>ಶಭಾಷ್! ಹಂತ {kn(level.id)} ಗೆದ್ದಿರಿ!</strong>
                                    {allDone && <span> ಎಲ್ಲಾ ಹಂತಗಳು ಮುಗಿದಿವೆ. ನೀವು ನಿಜವಾದ ಕೋಡರ್!</span>}
                                </div>
                                {idx < TURTLE_LEVELS.length - 1 && (
                                    <button type="button" className="btn btn-accent" onClick={goNext}>
                                        ಮುಂದಿನ ಹಂತ <ChevronRight size={16} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="level-try" role="status">{feedback.msg}</div>
                        )
                    )}
                    {result && result.output && <div className="kids-output"><OutputText text={result.output} /></div>}
                    <div className="level-nav">
                        <button type="button" className="btn btn-secondary" onClick={goPrev} disabled={idx === 0}><ChevronLeft size={16} /> ಹಿಂದಿನ</button>
                        <button type="button" className="btn btn-secondary" onClick={goNext} disabled={idx === TURTLE_LEVELS.length - 1}>ಮುಂದಿನ <ChevronRight size={16} /></button>
                    </div>
                </section>
            </div>
        </div>
    );
}

const PLAY_KEY = 'kl_kids_draw';
const DRAW_PALETTE = ['ಮುಂದೆ(೫೦)', 'ಹಿಂದೆ(೫೦)', 'ಬಲಕ್ಕೆ(೯೦)', 'ಎಡಕ್ಕೆ(೯೦)', 'ಬಣ್ಣ("ಕೆಂಪು")', 'ಬಣ್ಣ("ಹಳದಿ")', 'ದಪ್ಪ(೫)', 'ವೃತ್ತ(೪೦)', 'ಚುಕ್ಕೆ(೧೦)', 'ಪೆನ್_ಮೇಲೆ()', 'ಪೆನ್_ಕೆಳಗೆ()', 'ಪುನರಾವರ್ತನೆ ನ ೧ ರಿಂದ ೪ ವರೆಗೆ: '];

function Playground() {
    const [code, setCode] = useState(() => {
        try { return localStorage.getItem(PLAY_KEY) || TURTLE_GALLERY[0].code; } catch { return TURTLE_GALLERY[0].code; }
    });
    const [result, setResult] = useState(() => kannadaLipi.execute(code));

    useEffect(() => {
        try { localStorage.setItem(PLAY_KEY, code); } catch { /* ignore */ }
    }, [code]);

    const run = (c = code) => setResult(kannadaLipi.execute(c));
    const pick = (g) => { setCode(g.code); run(g.code); };

    return (
        <div className="levels-grid">
            <section className="glass-card level-panel">
                <div className="level-head">
                    <span className="level-tag">ಮುಕ್ತ ಕಲೆ</span>
                    <h2>ನಿಮ್ಮದೇ ಚಿತ್ರ ಬಿಡಿಸಿ</h2>
                    <p className="level-story">ಕೆಳಗಿನ ಮಾದರಿಗಳಲ್ಲಿ ಒಂದನ್ನು ತೆರೆದು ಸಂಖ್ಯೆಗಳು, ಬಣ್ಣಗಳನ್ನು ಬದಲಿಸಿ ನೋಡಿ. ಚಿತ್ರವನ್ನು PNG ಆಗಿ ಉಳಿಸಬಹುದು.</p>
                </div>
                <div className="gallery-row" role="list">
                    {TURTLE_GALLERY.map((g) => (
                        <button type="button" role="listitem" key={g.id} className="gallery-chip" onClick={() => pick(g)}>
                            <Sparkles size={14} /> {g.title}
                        </button>
                    ))}
                </div>
                <KidsCodePad code={code} setCode={setCode} palette={DRAW_PALETTE} onRun={() => run()} />
            </section>
            <section className="glass-card level-stage">
                <TurtleCanvas turtle={result?.turtle || null} />
                {result && result.output && <div className="kids-output"><OutputText text={result.output} /></div>}
            </section>
        </div>
    );
}

const Kids = () => {
    const [params, setParams] = useSearchParams();
    const mode = MODES.some((m) => m.key === params.get('mode')) ? params.get('mode') : 'levels';
    const setMode = (key) => setParams(key === 'levels' ? {} : { mode: key }, { replace: true });

    return (
        <div className="kids-page animate-in">
            <header className="kids-hero">
                <div className="kids-hero-text">
                    <span className="hero-badge">ತರಗತಿ ೩ ರಿಂದ ೮ ರ ಮಕ್ಕಳಿಗೆ</span>
                    <h1>ಮಕ್ಕಳ ಕೋಡ್ ಲೋಕ</h1>
                    <p>ಆಮೆಗೆ ದಾರಿ ತೋರಿಸಿ, ಚಿತ್ರ ಬಿಡಿಸಿ, ಆಟವಾಡುತ್ತಾ ಕನ್ನಡದಲ್ಲೇ ಕೋಡಿಂಗ್ ಕಲಿಯಿರಿ. ಲಾಗಿನ್ ಬೇಕಿಲ್ಲ, ನಿಮ್ಮ ಪ್ರಗತಿ ಈ ಸಾಧನದಲ್ಲೇ ಉಳಿಯುತ್ತದೆ.</p>
                </div>
                <NavLink to="/teachers" className="kids-teacher-link">
                    <GraduationCap size={18} /> ಶಿಕ್ಷಕರಿಗೆ ಮಾರ್ಗದರ್ಶಿ
                </NavLink>
            </header>

            <div className="kids-modes" role="tablist" aria-label="ವಿಧಾನ ಆಯ್ಕೆ">
                {MODES.map(({ key, label, sub, Icon }) => (
                    <button
                        type="button"
                        key={key}
                        role="tab"
                        aria-selected={mode === key}
                        className={`kids-mode${mode === key ? ' active' : ''}`}
                        onClick={() => setMode(key)}
                    >
                        <Icon size={22} />
                        <span className="kids-mode-label">{label}</span>
                        <span className="kids-mode-sub">{sub}</span>
                    </button>
                ))}
            </div>

            <div role="tabpanel">
                {mode === 'levels' && <Levels />}
                {mode === 'blocks' && (
                    <Suspense fallback={<div className="glass-card kids-loading">ಬ್ಲಾಕ್‌ಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...</div>}>
                        <BlocklyEditor />
                    </Suspense>
                )}
                {mode === 'draw' && <Playground />}
            </div>
        </div>
    );
};

export default Kids;
