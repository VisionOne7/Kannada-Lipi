import React, { useState, useEffect, useMemo, useRef } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
    BookOpen, Code, Library, Search, X, Play, CheckCircle, RotateCcw, Award, Check,
    Copy, ExternalLink, Lightbulb, Target, ClipboardList, Terminal, PartyPopper,
    ChevronLeft, ChevronRight, ArrowRight, Layers, Rocket, Calculator, GitBranch,
    Type, List, RefreshCw, Clock, PenTool, Hand, Package, Hash, BarChart3, Zap,
    FileText, Triangle, Circle, Ruler, Link as LinkIcon, Microscope, Repeat, Plus,
    Trophy, Calendar, Scissors, Sprout, Brain, Landmark, Square, Star, Upload,
    Scale, Smile } from 'lucide-react';
import { kannadaLipi } from '../lib/js/interpreter/index.js';
import { highlight } from '../lib/js/highlight.js';
import OutputText from '../components/OutputText';
import HighlightedTextarea from '../components/HighlightedTextarea';
import TurtleCanvas from '../components/TurtleCanvas';
import PageHeader from '../components/PageHeader';
import { useLang } from '../lib/i18n';
import { LESSONS } from '../data/lessons.js';
import { EXAMPLES } from '../data/examples.js';
import { FUNCTION_CATEGORIES, OPERATORS, CONTROL_FLOW } from '../data/functions.js';
import { TOPICS, TOPIC_BY_ID, TOPIC_OF_LESSON } from '../data/topics.js';
import '../components/HighlightedTextarea.css';
import './Learn.css';

// Icons named in the data files (lessons, examples, topics, function categories)
const ICONS = {
    Rocket, Calculator, GitBranch, Type, List, RefreshCw, Clock, PenTool, Hand, Package,
    Hash, BarChart3, Zap, FileText, Triangle, Circle, Ruler, Link: LinkIcon, Microscope,
    Repeat, Plus, Search, Trophy, Calendar, Scissors, Sprout, Brain, Landmark, Square,
    Star, Upload, ClipboardList, BookOpen, Code,
};
const Ico = ({ name, size = 16, className = 'lh-ico' }) => {
    const Icon = ICONS[name];
    return Icon ? <Icon size={size} className={className} aria-hidden="true" /> : null;
};

const TABS = [
    { id: 'lessons', label: 'ಪಾಠಗಳು', en: 'Lessons', icon: BookOpen },
    { id: 'examples', label: 'ಉದಾಹರಣೆಗಳು', en: 'Examples', icon: Code },
    { id: 'reference', label: 'ಉಲ್ಲೇಖ', en: 'Reference', icon: Library },
];

const PROGRESS_KEY = 'kannadalipi_learning';
const KN_DIGITS = ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'];
const kn = (num) => String(num).replace(/[0-9]/g, (d) => KN_DIGITS[d]);

const CATEGORY_BY_ID = Object.fromEntries(FUNCTION_CATEGORIES.map((c) => [c.id, c]));
const EXAMPLE_BY_ID = Object.fromEntries(EXAMPLES.map((e) => [e.id, e]));
const ALL_FUNCTIONS = FUNCTION_CATEGORIES.flatMap((c) => c.functions);

// Operator tables and control-flow cards, keyed by the ids used in topics.js
const EXTRAS = {
    arithmetic: { kind: 'table', title: 'ಗಣಿತ ಆಪರೇಟರ್‌ಗಳು', en: 'Arithmetic', icon: Hash, rows: OPERATORS.arithmetic },
    comparison: { kind: 'table', title: 'ಹೋಲಿಕೆ ಆಪರೇಟರ್‌ಗಳು', en: 'Comparison', icon: Scale, rows: OPERATORS.comparison },
    logical: { kind: 'table', title: 'ತಾರ್ಕಿಕ ಆಪರೇಟರ್‌ಗಳು', en: 'Logical', icon: LinkIcon, rows: OPERATORS.logical },
    conditionals: { kind: 'cards', title: 'ಷರತ್ತುಬದ್ಧ ಹೇಳಿಕೆಗಳು', en: 'Conditionals', icon: GitBranch, rows: CONTROL_FLOW.conditionals },
    loops: { kind: 'cards', title: 'ಲೂಪ್‌ಗಳು', en: 'Loops', icon: Repeat, rows: CONTROL_FLOW.loops },
};

// ---- search ----
const norm = (s) => String(s || '').toLowerCase();
const matches = (q, ...fields) => !q || fields.some((f) => norm(f).includes(q));
const lessonMatches = (q, l) => matches(q, l.title, l.instructions, ...l.objectives);
const exampleMatches = (q, e) => matches(q, e.title, e.code);
const fnMatches = (q, f) => matches(q, f.name, f.nameEn, f.description, f.descriptionEn, f.syntax);
const rowMatches = (q, r) => matches(q, r.symbol, r.name, r.nameEn, r.syntax, r.description, r.example);

// ---- lesson checking ----
const usesAny = (code, words) => words.some((w) => code.includes(w));
const LESSON_CHECKS = {
    uses_assignment: (c) => c.includes('=') && !c.includes('=='),
    uses_math: (c) => /[+\-*/]/.test(c),
    uses_conditional: (c) => c.includes('ಆದರೆ'),
    uses_sorting: (c) => usesAny(c, ['ಏರಿಕೆ', 'ಇಳಿಕೆ']),
    uses_functions: (c) => usesAny(c, ['ಇಂದು', 'ಸಮಯ', 'ವರ್ಷ']),
    uses_string_functions: (c) => usesAny(c, ['ಜೋಡಿಸು', 'ಒಟ್ಟು', 'ದೊಡ್ಡಕ್ಷರ', 'ಸಣ್ಣಕ್ಷರ']),
    uses_trigonometry: (c) => usesAny(c, ['ಸೈನ್', 'ಕೊಸೈನ್', 'ಟ್ಯಾನ್']),
    uses_type_conversion: (c) => usesAny(c, ['ಸಂಖ್ಯೆಗೆ', 'ಪಠ್ಯಕ್ಕೆ', 'ಪ್ರಕಾರ']),
    uses_array_functions: (c) => usesAny(c, ['ಸಂಗ್ರಹಿಸು', 'ಸೇರಿಸು', 'ತೆಗೆ']),
    uses_math_constants: (c) => usesAny(c, ['ಪೈ', 'ಇ_ಸಂಖ್ಯೆ']),
    uses_range: (c) => usesAny(c, ['ಶ್ರೇಣಿ', 'ಪಟ್ಟಿಯ_ಉದ್ದ']),
    uses_higher_order: (c) => usesAny(c, ['ನಕ್ಷೆ', 'ಶೋಧಕ', 'ಕಡಿತ']),
    uses_factorial_log: (c) => usesAny(c, ['ಅಂಶ', 'ಲಾಗ್']),
    uses_average: (c) => c.includes('ಸರಾಸರಿ'),
    uses_repeat: (c) => c.includes('ಪುನರಾವರ್ತಿಸು'),
    uses_digits: (c) => c.includes('ಅಂಕಿಗಳು'),
    uses_sum: (c) => c.includes('ಮೊತ್ತ'),
    uses_is_number: (c) => c.includes('ಸಂಖ್ಯೆಯೇ'),
    uses_unique_reverse: (c) => usesAny(c, ['ವಿಶಿಷ್ಟ', 'ತಿರುಗಿಸು']),
    uses_pad: (c) => c.includes('ಪ್ಯಾಡ್'),
};
const lessonPassed = (lesson, code, result) => {
    if (!result.success) return false;
    if (lesson.validation.type === 'output_not_empty') return Boolean(result.output && result.output.trim());
    const check = LESSON_CHECKS[lesson.validation.type];
    return check ? check(code) : true;
};

const loadProgress = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY));
        if (saved && Array.isArray(saved.completedLessons)) return saved;
    } catch { /* fall through */ }
    return { completedLessons: [], currentLesson: 1 };
};

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

const CodeBlock = ({ code }) => (
    <pre className="lh-code hl-theme-auto" dangerouslySetInnerHTML={{ __html: highlight(code) }} />
);

const ExampleCard = ({ example }) => {
    const { t } = useLang();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);

    const run = () => setResult(kannadaLipi.execute(example.code));
    const openInEditor = () => {
        try { localStorage.setItem('kannadalipi_code', example.code); } catch { /* storage blocked */ }
        navigate('/');
    };
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(example.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch { /* clipboard blocked */ }
    };

    return (
        <article className="lh-example">
            <header className="lh-example-head">
                <span className="lh-example-icon"><Ico name={example.iconKey} size={16} className="" /></span>
                <h3>{example.title}</h3>
            </header>
            <CodeBlock code={example.code} />
            {result && (
                <div className="lh-example-out">
                    {result.turtle && result.turtle.commands && result.turtle.commands.length > 0 && (
                        <TurtleCanvas turtle={result.turtle} compact />
                    )}
                    {(result.output || !result.success) && (
                        <div className="output-text"><OutputText text={result.output || result.error} /></div>
                    )}
                </div>
            )}
            <footer className="lh-example-actions">
                <button className="btn btn-primary btn-sm" onClick={run}><Play size={14} /> {t('ರನ್', 'Run')}</button>
                <button className="btn btn-secondary btn-sm" onClick={openInEditor}><ExternalLink size={14} /> {t('ಎಡಿಟರ್‌ನಲ್ಲಿ', 'Open in editor')}</button>
                <button className="btn btn-secondary btn-sm" onClick={copy} aria-live="polite">
                    {copied ? <><CheckCircle size={14} /> {t('ನಕಲಾಯಿತು', 'Copied')}</> : <><Copy size={14} /> {t('ನಕಲಿಸಿ', 'Copy')}</>}
                </button>
            </footer>
        </article>
    );
};

const FunctionCard = ({ fn }) => {
    const { t } = useLang();
    return (
    <article className="lh-fn">
        <div className="lh-fn-head">
            <code className="lh-fn-name">{fn.name}</code>
            <span className="lh-fn-en">{fn.nameEn}</span>
        </div>
        <code className="lh-fn-syntax">{fn.syntax}</code>
        <p className="lh-fn-desc">{t(fn.description, fn.descriptionEn)}</p>
        <div className="lh-fn-example">
            <code>{fn.example}</code>
            {fn.result && <><ArrowRight size={13} aria-hidden="true" /><code className="lh-fn-result">{fn.result}</code></>}
        </div>
    </article>
    );
};

const ExtraBlock = ({ extra, q }) => {
    const rows = extra.rows.filter((r) => rowMatches(q, r));
    if (!rows.length) return null;
    const Icon = extra.icon;
    return (
        <div className="lh-ref-group">
            <h4 className="lh-ref-title"><Icon size={16} aria-hidden="true" /> {extra.title} <span>({extra.en})</span></h4>
            {extra.kind === 'table' ? (
                <div className="lh-table-wrap">
                    <table className="lh-table">
                        <thead><tr><th>ಆಪರೇಟರ್</th><th>ವಿವರಣೆ</th><th>ಉದಾಹರಣೆ</th></tr></thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.symbol}><td><code>{r.symbol}</code></td><td>{r.name} ({r.nameEn})</td><td>{r.example}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="lh-fn-grid">
                    {rows.map((r) => <FunctionCard key={r.name} fn={r} />)}
                </div>
            )}
        </div>
    );
};

const extraCount = (extra, q) => extra.rows.filter((r) => rowMatches(q, r)).length;

// ---------------------------------------------------------------------------
// Lesson view
// ---------------------------------------------------------------------------

const LessonView = ({ lesson, completed, onComplete, onOpen, onBack, onShowTopic }) => {
    const { t } = useLang();
    const [code, setCode] = useState(lesson.starterCode);
    const [output, setOutput] = useState('ಕೋಡ್ ರನ್ ಮಾಡಲು "ರನ್ ಮಾಡಿ" ಕ್ಲಿಕ್ ಮಾಡಿ...');
    const [showHint, setShowHint] = useState(false);
    const [status, setStatus] = useState(null); // null | 'pass' | 'fail'
    const numbersRef = useRef(null);

    const topic = TOPIC_BY_ID[TOPIC_OF_LESSON[lesson.id]];
    const prev = LESSONS[lesson.id - 1];
    const next = LESSONS[lesson.id + 1];

    // Functions this lesson's starter code uses, shown under the editor.
    const usedFunctions = useMemo(() => {
        const seen = new Set();
        return ALL_FUNCTIONS.filter((f) => {
            if (seen.has(f.name) || !lesson.starterCode.includes(f.name)) return false;
            seen.add(f.name);
            return true;
        }).slice(0, 6);
    }, [lesson]);

    const run = () => {
        if (!code.trim()) {
            setOutput('ದೋಷ: ಕೋಡ್ ಖಾಲಿ ಇದೆ!');
            return null;
        }
        const result = kannadaLipi.execute(code);
        setOutput(result.output || (result.success ? 'ಯಶಸ್ವಿ!' : result.error));
        return result;
    };

    const check = () => {
        const result = run();
        if (result && lessonPassed(lesson, code, result)) {
            setStatus('pass');
            onComplete(lesson.id);
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFD700', '#D71920', '#ffffff'] });
        } else {
            setStatus('fail');
        }
    };

    const reset = () => {
        setCode(lesson.starterCode);
        setStatus(null);
    };

    const syncNumbers = (e) => {
        if (numbersRef.current) numbersRef.current.scrollTop = e.target.scrollTop;
    };

    return (
        <div className="learn-lesson-view animate-in">
            <div className="learn-lesson-header">
                <button className="btn btn-secondary btn-sm" onClick={onBack}><ChevronLeft size={16} /> {t('ಹಿಂದೆ', 'Back')}</button>
                <div className="learn-lesson-heading">
                    {topic && <button className="lh-crumb" onClick={() => onShowTopic(topic.id)}>{t(topic.title, topic.titleEn)}</button>}
                    <h2 className="learn-lesson-title">
                        <span className="lh-lesson-no">{kn(lesson.id)}</span>
                        {lesson.title}
                        {completed && <span className="lh-done-badge"><Check size={13} strokeWidth={3} /> {t('ಮುಗಿದಿದೆ', 'Done')}</span>}
                    </h2>
                </div>
            </div>

            <div className="lesson-instructions">
                <h4><ClipboardList size={16} /> {t('ಸೂಚನೆಗಳು', 'Instructions')}</h4>
                <p>{lesson.instructions}</p>
            </div>

            <div className="lesson-objectives">
                <h4><Target size={16} /> {t('ಈ ಪಾಠದಲ್ಲಿ ನೀವು ಕಲಿಯುವಿರಿ:', 'In this lesson you will learn:')}</h4>
                <ul>{lesson.objectives.map((obj, i) => <li key={i}>{obj}</li>)}</ul>
            </div>

            <div className="lesson-editor-container">
                <div className="lesson-editor-header">
                    <span>{t('ಕೋಡ್ ಎಡಿಟರ್', 'Code editor')}</span>
                    <button className="lh-link-btn" onClick={reset}><RotateCcw size={13} /> {t('ಮೊದಲಿನ ಕೋಡ್', 'Starting code')}</button>
                </div>
                <div className="editor-with-numbers">
                    <div className="lesson-line-numbers" ref={numbersRef} aria-hidden="true">
                        {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                    </div>
                    <HighlightedTextarea
                        id="lessonEditor"
                        spellCheck="false"
                        value={code}
                        onChange={(e) => { setCode(e.target.value); setStatus(null); }}
                        onScroll={syncNumbers}
                        aria-label="ಪಾಠದ ಕೋಡ್ ಎಡಿಟರ್"
                    />
                </div>
            </div>

            <div className="lesson-output">
                <span className="lesson-output-label"><Terminal size={14} /> {t('ಔಟ್‌ಪುಟ್', 'Output')}</span>
                <div className="output-text"><OutputText text={output} /></div>
            </div>

            {showHint && (
                <div className="lesson-hint"><strong><Lightbulb size={14} /> {t('ಸುಳಿವು:', 'Hint:')}</strong> {lesson.hint}</div>
            )}
            {status === 'fail' && (
                <div className="lesson-retry" role="status">{t('ಇನ್ನೂ ಸರಿಯಾಗಿಲ್ಲ. ಸೂಚನೆಗಳನ್ನು ಓದಿ ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ, ಅಥವಾ ಸುಳಿವು ನೋಡಿ.', 'Not quite yet. Read the instructions and try again, or look at the hint.')}</div>
            )}

            {status !== 'pass' ? (
                <div className="lesson-actions">
                    <button className="btn btn-primary" onClick={run}><Play size={14} /> {t('ರನ್ ಮಾಡಿ', 'Run')}</button>
                    <button className="btn btn-accent" onClick={check}><CheckCircle size={14} /> {t('ಪರಿಶೀಲಿಸಿ', 'Check')}</button>
                    <button className="btn btn-secondary" onClick={() => setShowHint(!showHint)}><Lightbulb size={14} /> {t('ಸುಳಿವು', 'Hint')}</button>
                </div>
            ) : (
                <div className="lesson-success">
                    <h3><PartyPopper size={20} /> {t('ಅಭಿನಂದನೆಗಳು!', 'Well done!')}</h3>
                    <p>{lesson.successMessage}</p>
                    <button className="btn btn-primary" onClick={() => (next ? onOpen(next.id) : onBack())}>
                        {next ? <>{t('ಮುಂದಿನ ಪಾಠ', 'Next lesson')} <ChevronRight size={16} /></> : <><CheckCircle size={14} /> {t('ಮುಗಿಸಿ', 'Finish')}</>}
                    </button>
                </div>
            )}

            {usedFunctions.length > 0 && (
                <section className="lh-related">
                    <h3><Library size={18} /> {t('ಈ ಪಾಠದಲ್ಲಿ ಬಳಸಿದ ಕಾರ್ಯಗಳು', 'Functions used in this lesson')}</h3>
                    <div className="lh-fn-grid">
                        {usedFunctions.map((f) => <FunctionCard key={f.name} fn={f} />)}
                    </div>
                </section>
            )}
            {topic && topic.examples.length > 0 && (
                <button className="lh-related-link" onClick={() => onShowTopic(topic.id, 'examples')}>
                    <Code size={16} /> {t(topic.title, topic.titleEn)}: {t('ಇನ್ನಷ್ಟು ಉದಾಹರಣೆಗಳು', 'more examples')} ({kn(topic.examples.length)}) <ArrowRight size={16} />
                </button>
            )}

            <nav className="lh-pager" aria-label="ಪಾಠಗಳು">
                {prev ? <button className="btn btn-secondary btn-sm" onClick={() => onOpen(prev.id)}><ChevronLeft size={15} /> {prev.title.split(' - ')[0]}</button> : <span />}
                {next && <button className="btn btn-secondary btn-sm" onClick={() => onOpen(next.id)}>{next.title.split(' - ')[0]} <ChevronRight size={15} /></button>}
            </nav>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Hub page
// ---------------------------------------------------------------------------

const Learn = () => {
    const [params, setParams] = useSearchParams();
    const { t } = useLang();
    const topicId = TOPIC_BY_ID[params.get('topic')] ? params.get('topic') : 'all';
    const tab = TABS.some((tb) => tb.id === params.get('tab')) ? params.get('tab') : 'lessons';
    const lessonId = Number(params.get('lesson'));
    const activeLesson = LESSONS[lessonId] || null;
    const [query, setQuery] = useState(params.get('q') || '');
    const q = norm(query.trim());

    const [progress, setProgress] = useState(loadProgress);
    const searchRef = useRef(null);

    useEffect(() => {
        try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch { /* storage blocked */ }
    }, [progress]);

    // "/" or Ctrl+K jumps to search
    useEffect(() => {
        const onKey = (e) => {
            const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
            if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => { window.scrollTo({ top: 0 }); }, [lessonId]);

    // Build on the latest URL, so quick successive changes never drop one another.
    const update = (changes, replace = false) => {
        // window.location is updated at once; the router's params only on the next render.
        const next = new URLSearchParams(window.location.search);
        Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
        setParams(next, { replace });
    };
    const showTopic = (id, nextTab) => update({ topic: id === 'all' ? null : id, lesson: null, ...(nextTab ? { tab: nextTab } : {}) });
    const showTab = (id) => update({ tab: id === 'lessons' ? null : id });
    const openLesson = (id) => update({ lesson: String(id), topic: TOPIC_OF_LESSON[id] });
    const onSearch = (value) => {
        setQuery(value);
        update({ q: value.trim() || null }, true);
    };

    const completed = progress.completedLessons;
    const completeLesson = (id) => {
        if (!completed.includes(id)) setProgress((p) => ({ ...p, completedLessons: [...p.completedLessons, id] }));
    };
    const resetProgress = () => {
        if (window.confirm(t('ನಿಮ್ಮ ಎಲ್ಲಾ ಪ್ರಗತಿಯನ್ನು ಅಳಿಸಬೇಕೇ?', 'Erase all your progress?'))) setProgress({ completedLessons: [], currentLesson: 1 });
    };

    const totalLessons = Object.keys(LESSONS).length;
    const percent = Math.round((completed.length / totalLessons) * 100);
    const nextLesson = Object.values(LESSONS).find((l) => !completed.includes(l.id));

    // Everything the current topic + search shows, grouped by topic
    const visibleTopics = topicId === 'all' ? TOPICS : [TOPIC_BY_ID[topicId]];
    const groups = useMemo(() => visibleTopics.map((tp) => {
        const lessons = tp.lessons.map((id) => LESSONS[id]).filter((l) => lessonMatches(q, l));
        const examples = tp.examples.map((id) => EXAMPLE_BY_ID[id]).filter((e) => e && exampleMatches(q, e));
        const categories = tp.reference
            .map((id) => ({ ...CATEGORY_BY_ID[id], functions: CATEGORY_BY_ID[id].functions.filter((f) => fnMatches(q, f)) }))
            .filter((c) => c.functions.length);
        const extras = tp.extras.filter((id) => extraCount(EXTRAS[id], q) > 0);
        const refCount = categories.reduce((n, c) => n + c.functions.length, 0)
            + extras.reduce((n, id) => n + extraCount(EXTRAS[id], q), 0);
        return { topic: tp, lessons, examples, categories, extras, refCount };
    }), [topicId, q]); // eslint-disable-line react-hooks/exhaustive-deps

    const counts = {
        lessons: groups.reduce((n, g) => n + g.lessons.length, 0),
        examples: groups.reduce((n, g) => n + g.examples.length, 0),
        reference: groups.reduce((n, g) => n + g.refCount, 0),
    };
    const groupHasTab = (g) => (tab === 'lessons' ? g.lessons.length : tab === 'examples' ? g.examples.length : g.refCount);
    const shownGroups = groups.filter(groupHasTab);
    const showGroupTitles = topicId === 'all';
    const currentTopic = TOPIC_BY_ID[topicId];

    const topicDone = (tp) => tp.lessons.filter((id) => completed.includes(id)).length;

    const topicNav = (
        <>
            <button className={`lh-topic ${topicId === 'all' ? 'active' : ''}`} onClick={() => showTopic('all')}>
                <Layers size={16} className="lh-ico" aria-hidden="true" />
                <span className="lh-topic-label">{t('ಎಲ್ಲಾ ವಿಷಯಗಳು', 'All topics')}</span>
            </button>
            {TOPICS.map((tp) => (
                <button key={tp.id} className={`lh-topic ${topicId === tp.id ? 'active' : ''}`} onClick={() => showTopic(tp.id)}>
                    <Ico name={tp.iconKey} />
                    <span className="lh-topic-label">{t(tp.title, tp.titleEn)}</span>
                    {tp.lessons.length > 0 && (
                        <span className={`lh-topic-count ${topicDone(tp) === tp.lessons.length ? 'done' : ''}`}>
                            {kn(topicDone(tp))}/{kn(tp.lessons.length)}
                        </span>
                    )}
                </button>
            ))}
        </>
    );

    return (
        <div className="learn-page animate-in">
            <PageHeader icon={BookOpen} title={t('ಕಲಿಯಿರಿ', 'Learn')} subtitle={t('ಪಾಠಗಳು, ಉದಾಹರಣೆಗಳು ಮತ್ತು ಕಾರ್ಯಗಳ ಉಲ್ಲೇಖ — ಎಲ್ಲವೂ ಒಂದೇ ಕಡೆ', 'Lessons, examples and the function reference, all in one place')} />

            <div className="lh-layout">
                <aside className="lh-sidebar" aria-label="ವಿಷಯಗಳು">
                    <div className="lh-progress">
                        <div className="lh-progress-row">
                            <span>{t('ನಿಮ್ಮ ಪ್ರಗತಿ', 'Your progress')}</span>
                            <strong>{kn(completed.length)}/{kn(totalLessons)}</strong>
                        </div>
                        <div className="lh-bar"><div className="lh-bar-fill" style={{ width: `${percent}%` }} /></div>
                        {nextLesson && !activeLesson && (
                            <button className="btn btn-accent btn-sm lh-continue" onClick={() => openLesson(nextLesson.id)}>
                                <Play size={14} /> {completed.length ? t('ಮುಂದುವರಿಸಿ', 'Continue') : t('ಪ್ರಾರಂಭಿಸಿ', 'Start')}: {nextLesson.title.split(' - ')[0]}
                            </button>
                        )}
                    </div>
                    <nav className="lh-topics">{topicNav}</nav>
                    <div className="lh-sidebar-foot">
                        <NavLink to="/certificate" className={`btn btn-sm ${completed.length >= totalLessons ? 'btn-accent' : 'btn-secondary'}`}>
                            <Award size={14} /> {completed.length >= totalLessons ? t('ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ', 'Get certificate') : t('ಪ್ರಮಾಣಪತ್ರ', 'Certificate')}
                        </NavLink>
                        <button className="btn btn-secondary btn-sm" onClick={resetProgress}><RotateCcw size={14} /> {t('ಪ್ರಗತಿ ರೀಸೆಟ್', 'Reset progress')}</button>
                    </div>
                </aside>

                <div className="lh-main">
                    {activeLesson ? (
                        <LessonView
                            key={activeLesson.id}
                            lesson={activeLesson}
                            completed={completed.includes(activeLesson.id)}
                            onComplete={completeLesson}
                            onOpen={openLesson}
                            onBack={() => update({ lesson: null })}
                            onShowTopic={showTopic}
                        />
                    ) : (
                        <>
                            <div className="lh-search">
                                <Search size={18} className="lh-search-icon" aria-hidden="true" />
                                <input
                                    ref={searchRef}
                                    type="search"
                                    value={query}
                                    onChange={(e) => onSearch(e.target.value)}
                                    placeholder={t('ಪಾಠ, ಉದಾಹರಣೆ ಅಥವಾ ಕಾರ್ಯ ಹುಡುಕಿ… (ಉದಾ: ಮುದ್ರಿಸು, loop, sort)', 'Search lessons, examples or functions… (e.g. ಮುದ್ರಿಸು, loop, sort)')}
                                    aria-label="ಹುಡುಕಿ"
                                />
                                {query ? (
                                    <button className="lh-search-clear" onClick={() => onSearch('')} aria-label="ಹುಡುಕಾಟ ಅಳಿಸಿ"><X size={16} /></button>
                                ) : (
                                    <kbd className="lh-kbd">/</kbd>
                                )}
                            </div>

                            <nav className="lh-chips" aria-label="ವಿಷಯಗಳು">{topicNav}</nav>

                            {currentTopic && (
                                <div className="lh-topic-intro">
                                    <span className="lh-topic-intro-icon"><Ico name={currentTopic.iconKey} size={22} className="" /></span>
                                    <div>
                                        <h2>{t(currentTopic.title, currentTopic.titleEn)} <span>{t(currentTopic.titleEn, '')}</span></h2>
                                        <p>{currentTopic.summary}</p>
                                    </div>
                                </div>
                            )}

                            <div className="lh-tabs" role="tablist">
                                {TABS.map((tb) => {
                                    const Icon = tb.icon;
                                    return (
                                        <button
                                            key={tb.id}
                                            role="tab"
                                            aria-selected={tab === tb.id}
                                            className={`lh-tab ${tab === tb.id ? 'active' : ''}`}
                                            onClick={() => showTab(tb.id)}
                                        >
                                            <Icon size={16} aria-hidden="true" />
                                            <span>{t(tb.label, tb.en)}</span>
                                            <span className="lh-tab-count">{kn(counts[tb.id])}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="lh-panel" role="tabpanel">
                                {shownGroups.length === 0 && (
                                    <div className="lh-empty">
                                        {tab === 'lessons' && currentTopic && !currentTopic.lessons.length && !q ? (
                                            <>
                                                <Smile size={40} aria-hidden="true" />
                                                <h3>{t('ಆಮೆ ಚಿತ್ರವನ್ನು ಮಕ್ಕಳ ವಲಯದಲ್ಲಿ ಹಂತ ಹಂತವಾಗಿ ಕಲಿಯಿರಿ', 'Learn turtle drawing step by step in the kids zone')}</h3>
                                                <NavLink to="/kids" className="btn btn-primary">{t('ಮಕ್ಕಳ ವಲಯಕ್ಕೆ ಹೋಗಿ', 'Go to the kids zone')} <ArrowRight size={16} /></NavLink>
                                            </>
                                        ) : (
                                            <>
                                                <Search size={40} aria-hidden="true" />
                                                <h3>{t('ಇಲ್ಲಿ ಏನೂ ಸಿಗಲಿಲ್ಲ', 'Nothing found here')}</h3>
                                                <p>{q ? t('ಬೇರೆ ಪದ ಹುಡುಕಿ, ಅಥವಾ ಮೇಲಿನ ಇತರ ಟ್ಯಾಬ್‌ಗಳನ್ನು ನೋಡಿ.', 'Try another word, or check the other tabs above.') : t('ಈ ವಿಷಯಕ್ಕೆ ಇನ್ನೂ ಏನೂ ಇಲ್ಲ.', 'Nothing here for this topic yet.')}</p>
                                            </>
                                        )}
                                    </div>
                                )}

                                {shownGroups.map((g) => (
                                    <section key={g.topic.id} className="lh-group">
                                        {showGroupTitles && (
                                            <button className="lh-group-title" onClick={() => showTopic(g.topic.id)}>
                                                <Ico name={g.topic.iconKey} size={18} /> {t(g.topic.title, g.topic.titleEn)}
                                                <span>{t(g.topic.titleEn, '')}</span>
                                                <ChevronRight size={16} className="lh-group-caret" aria-hidden="true" />
                                            </button>
                                        )}

                                        {tab === 'lessons' && (
                                            <div className="lh-lessons">
                                                {g.lessons.map((l) => {
                                                    const done = completed.includes(l.id);
                                                    return (
                                                        <button key={l.id} className={`lh-lesson ${done ? 'done' : ''}`} onClick={() => openLesson(l.id)}>
                                                            <span className="lh-lesson-num">{done ? <Check size={16} strokeWidth={3} /> : kn(l.id)}</span>
                                                            <span className="lh-lesson-body">
                                                                <span className="lh-lesson-title"><Ico name={l.iconKey} size={15} /> {l.title}</span>
                                                                <span className="lh-lesson-desc">{l.objectives[0]}</span>
                                                            </span>
                                                            <ChevronRight size={18} className="lh-lesson-go" aria-hidden="true" />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {tab === 'examples' && (
                                            <div className="lh-examples">
                                                {g.examples.map((e) => <ExampleCard key={e.id} example={e} />)}
                                            </div>
                                        )}

                                        {tab === 'reference' && (
                                            <>
                                                {g.categories.map((c) => (
                                                    <div key={c.id} className="lh-ref-group">
                                                        <h4 className="lh-ref-title"><Ico name={c.iconKey} /> {c.name} <span>({c.nameEn})</span></h4>
                                                        <div className="lh-fn-grid">
                                                            {c.functions.map((f) => <FunctionCard key={f.name} fn={f} />)}
                                                        </div>
                                                    </div>
                                                ))}
                                                {g.extras.map((id) => <ExtraBlock key={id} extra={EXTRAS[id]} q={q} />)}
                                            </>
                                        )}
                                    </section>
                                ))}

                                {tab === 'reference' && !q && topicId === 'all' && (
                                    <div className="lh-tip">
                                        <Lightbulb size={16} aria-hidden="true" />
                                        <span>{t('ಕನ್ನಡ ಅಂಕಿಗಳನ್ನು (೦-೯) ಅಥವಾ ಇಂಗ್ಲಿಷ್ ಅಂಕಿಗಳನ್ನು (0-9) ಎರಡನ್ನೂ ಬಳಸಬಹುದು.', 'You can use Kannada digits (೦-೯) or English digits (0-9).')}</span>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Learn;
