import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
    BookOpen, BarChart3, ClipboardList, Target, Terminal, Lightbulb,
    Play, CheckCircle, RotateCcw, PartyPopper, Hand, Package, Hash,
    GitBranch, Zap, FileText, Triangle, RefreshCw, Circle, Ruler,
    Link as LinkIcon, Microscope, Repeat, Plus, Search, Award, Check } from 'lucide-react';
import { kannadaLipi } from '../lib/js/interpreter/index.js';
import OutputText from '../components/OutputText';
import { LESSONS } from '../data/lessons.js';
import './Learn.css';
import PageHeader from '../components/PageHeader';

const LESSON_ICONS = {
    Hand, Package, Hash, GitBranch, BarChart3, Zap, FileText, Triangle,
    RefreshCw, ClipboardList, Circle, Ruler, Link: LinkIcon, Microscope,
    Repeat, Plus, Search
};

const LessonIcon = ({ iconKey, size = 16 }) => {
    const Icon = LESSON_ICONS[iconKey];
    return Icon ? <Icon size={size} style={{ verticalAlign: 'middle', marginRight: 4 }} /> : null;
};

const Learn = () => {
    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem('kannadalipi_learning');
        return saved ? JSON.parse(saved) : { completedLessons: [], currentLesson: 1 };
    });

    const [activeLesson, setActiveLesson] = useState(null);
    const [editorCode, setEditorCode] = useState('');
    const [output, setOutput] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        localStorage.setItem('kannadalipi_learning', JSON.stringify(progress));
    }, [progress]);

    const toKannadaNumeral = (num) => {
        const kannadaDigits = ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'];
        return String(num).split('').map(d => kannadaDigits[parseInt(d)] || d).join('');
    };

    const startLesson = (id) => {
        const lesson = LESSONS[id];
        setActiveLesson(lesson);
        setEditorCode(lesson.starterCode);
        setOutput('ಕೋಡ್ ರನ್ ಮಾಡಲು "ರನ್ ಮಾಡಿ" ಕ್ಲಿಕ್ ಮಾಡಿ...');
        setShowHint(false);
        setShowSuccess(false);
    };

    const runCode = () => {
        if (!editorCode.trim()) {
            setOutput('ದೋಷ: ಕೋಡ್ ಖಾಲಿ ಇದೆ!');
            return;
        }
        const result = kannadaLipi.execute(editorCode);
        setOutput(result.output || (result.success ? 'ಯಶಸ್ವಿ!' : result.error));
        return result;
    };

    const validateLesson = (result) => {
        if (!result.success) return false;
        const lesson = activeLesson;
        const code = editorCode;

        switch (lesson.validation.type) {
            case "output_not_empty":
                return result.output && result.output.trim().length > 0;
            case "uses_assignment":
                return code.includes('=') && !code.includes('==');
            case "uses_math":
                return code.includes('+') || code.includes('-') || code.includes('*') || code.includes('/');
            case "uses_conditional":
                return code.includes('ಆದರೆ');
            case "uses_sorting":
                return code.includes('ಏರಿಕೆ') || code.includes('ಇಳಿಕೆ');
            case "uses_functions":
                return code.includes('ಇಂದು') || code.includes('ಸಮಯ') || code.includes('ವರ್ಷ');
            case "uses_math_constants":
                return code.includes('ಪೈ') || code.includes('ಇ_ಸಂಖ್ಯೆ');
            case "uses_range":
                return code.includes('ಶ್ರೇಣಿ') || code.includes('ಪಟ್ಟಿಯ_ಉದ್ದ');
            case "uses_higher_order":
                return code.includes('ನಕ್ಷೆ') || code.includes('ಶೋಧಕ') || code.includes('ಕಡಿತ');
            case "uses_factorial_log":
                return code.includes('ಅಂಶ') || code.includes('ಲಾಗ್');
            case "uses_average":
                return code.includes('ಸರಾಸರಿ');
            case "uses_repeat":
                return code.includes('ಪುನರಾವರ್ತಿಸು');
            case "uses_digits":
                return code.includes('ಅಂಕಿಗಳು');
            case "uses_sum":
                return code.includes('ಮೊತ್ತ');
            case "uses_is_number":
                return code.includes('ಸಂಖ್ಯೆಯೇ');
            case "uses_unique_reverse":
                return code.includes('ವಿಶಿಷ್ಟ') || code.includes('ತಿರುಗಿಸು');
            case "uses_pad":
                return code.includes('ಪ್ಯಾಡ್');
            default:
                return true;
        }
    };

    const submitLesson = () => {
        const result = runCode();
        if (result && validateLesson(result)) {
            if (!progress.completedLessons.includes(activeLesson.id)) {
                setProgress(prev => ({
                    ...prev,
                    completedLessons: [...prev.completedLessons, activeLesson.id]
                }));
            }
            setShowSuccess(true);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#D71920', '#ffffff']
            });
        } else {
            alert('ಇನ್ನೂ ಸರಿಯಾಗಿಲ್ಲ. ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ!');
        }
    };

    const resetProgress = () => {
        if (window.confirm('ನಿಮ್ಮ ಎಲ್ಲಾ ಪ್ರಗತಿಯನ್ನು ಅಳಿಸಬೇಕೇ?')) {
            const initial = { completedLessons: [], currentLesson: 1 };
            setProgress(initial);
            localStorage.setItem('kannadalipi_learning', JSON.stringify(initial));
        }
    };

    const totalLessons = Object.keys(LESSONS).length;
    const completedCount = progress.completedLessons.length;
    const progressPercent = (completedCount / totalLessons) * 100;

    return (
        <div className="learn-page animate-in">
            {/* Learn Header */}
            <PageHeader icon={BookOpen} title="ಕಲಿಯಿರಿ" subtitle="ಹಂತ ಹಂತವಾಗಿ ಕನ್ನಡ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಕಲಿಯಿರಿ" />

            <div className="docs-container">
                {/* Sidebar with lesson navigation */}
                <aside className="docs-sidebar">
                    <nav className="docs-nav">
                        <div className="docs-nav-title">ಪಾಠಗಳು (Lessons)</div>

                        <div className="learn-sidebar-progress">
                            <div className="learn-sidebar-progress-text">
                                <span>ಪ್ರಗತಿ</span>
                                <span>{toKannadaNumeral(completedCount)}/{toKannadaNumeral(totalLessons)}</span>
                            </div>
                            <div className="progress-container progress-container-sm">
                                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                            </div>
                        </div>

                        {Object.values(LESSONS).map(lesson => {
                            const isCompleted = progress.completedLessons.includes(lesson.id);
                            const isActive = activeLesson && activeLesson.id === lesson.id;
                            return (
                                <button
                                    key={lesson.id}
                                    onClick={() => startLesson(lesson.id)}
                                    className={`learn-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                                >
                                    <span className="learn-nav-status">
                                        {isCompleted ? <Check size={14} strokeWidth={3} /> : toKannadaNumeral(lesson.id)}
                                    </span>
                                    <span className="learn-nav-label">
                                        <LessonIcon iconKey={lesson.iconKey} size={14} /> {lesson.title.split(' - ')[0]}
                                    </span>
                                </button>
                            );
                        })}

                        <NavLink
                            to="/certificate"
                            className={`btn btn-sm learn-cert-btn ${completedCount >= totalLessons ? 'btn-accent' : 'btn-secondary'}`}
                        >
                            <Award size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                            {completedCount >= totalLessons ? 'ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ' : 'ಪ್ರಮಾಣಪತ್ರ'}
                        </NavLink>

                        <button className="btn btn-secondary btn-sm learn-reset-btn" onClick={resetProgress}>
                            <RotateCcw size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ಪ್ರಗತಿ ರೀಸೆಟ್ ಮಾಡಿ
                        </button>
                    </nav>
                </aside>

                {/* Content area */}
                <main className="docs-content">
                    {/* Overview state - no lesson selected */}
                    {!activeLesson && (
                        <div className="learn-overview animate-in">
                            <div className="progress-panel">
                                <div className="progress-header">
                                    <h2><BarChart3 size={20} style={{ marginRight: 6, verticalAlign: 'middle' }} /> ನಿಮ್ಮ ಪ್ರಗತಿ</h2>
                                    <span className="text-secondary">
                                        ಪಾಠ {toKannadaNumeral(completedCount)}/{toKannadaNumeral(totalLessons)}
                                    </span>
                                </div>
                                <div className="progress-container">
                                    <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                                </div>
                            </div>

                            <div className="lessons-grid">
                                {Object.values(LESSONS).map(lesson => (
                                    <article
                                        key={lesson.id}
                                        className={`lesson-card ${progress.completedLessons.includes(lesson.id) ? 'completed' : ''}`}
                                        onClick={() => startLesson(lesson.id)}
                                    >
                                        <div className="lesson-card-header">
                                            <div className="lesson-number">{toKannadaNumeral(lesson.id)}</div>
                                            <div className="lesson-name"><LessonIcon iconKey={lesson.iconKey} /> {lesson.title}</div>
                                        </div>
                                        <div className="lesson-card-body">
                                            <p className="lesson-desc">
                                                {lesson.objectives[0]} ಮತ್ತು ಹೆಚ್ಚಿನವು.
                                            </p>
                                            <button className="btn btn-primary">
                                                {progress.completedLessons.includes(lesson.id) ? <><CheckCircle size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ಮುಗಿದಿದೆ</> : <><Play size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ಪ್ರಾರಂಭಿಸಿ</>}
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Lesson view - active lesson selected */}
                    {activeLesson && (
                        <div className="learn-lesson-view animate-in">
                            <div className="learn-lesson-header">
                                <button className="btn btn-secondary btn-sm" onClick={() => setActiveLesson(null)}>
                                    ← ಹಿಂದೆ
                                </button>
                                <h2 className="learn-lesson-title"><LessonIcon iconKey={activeLesson.iconKey} size={20} /> {activeLesson.title}</h2>
                            </div>

                            <div className="lesson-instructions">
                                <h4><ClipboardList size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ಸೂಚನೆಗಳು</h4>
                                <p>{activeLesson.instructions}</p>
                            </div>

                            <div className="lesson-objectives">
                                <h4><Target size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ಈ ಪಾಠದಲ್ಲಿ ನೀವು ಕಲಿಯುವಿರಿ:</h4>
                                <ul>
                                    {activeLesson.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                                </ul>
                            </div>

                            <div className="lesson-editor-container">
                                <div className="lesson-editor-header">ಕೋಡ್ ಎಡಿಟರ್</div>
                                <div className="editor-with-numbers">
                                    <div className="line-numbers">
                                        {editorCode.split('\n').map((_, i) => (
                                            <div key={i}>{i + 1}</div>
                                        ))}
                                    </div>
                                    <textarea
                                        id="lessonEditor"
                                        spellCheck="false"
                                        value={editorCode}
                                        onChange={(e) => setEditorCode(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="lesson-output">
                                <span className="lesson-output-label"><Terminal size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ಔಟ್‌ಪುಟ್:</span>
                                <div className="output-text"><OutputText text={output} /></div>
                            </div>

                            {showHint && (
                                <div className="lesson-hint">
                                    <strong><Lightbulb size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ಸುಳಿವು:</strong> {activeLesson.hint}
                                </div>
                            )}

                            {!showSuccess ? (
                                <div className="lesson-actions">
                                    <button className="btn btn-primary" onClick={runCode}><Play size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ರನ್ ಮಾಡಿ</button>
                                    <button className="btn btn-accent" onClick={submitLesson}><CheckCircle size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ಪರಿಶೀಲಿಸಿ</button>
                                    <button className="btn btn-secondary" onClick={() => setShowHint(!showHint)}><Lightbulb size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ಸುಳಿವು</button>
                                </div>
                            ) : (
                                <div className="lesson-success">
                                    <h3><PartyPopper size={20} style={{ marginRight: 6, verticalAlign: 'middle' }} /> ಅಭಿನಂದನೆಗಳು!</h3>
                                    <p>{activeLesson.successMessage}</p>
                                    <button className="btn btn-primary" onClick={() => {
                                        const nextId = activeLesson.id + 1;
                                        if (LESSONS[nextId]) startLesson(nextId);
                                        else setActiveLesson(null);
                                    }}>
                                        {LESSONS[activeLesson.id + 1] ? '→ ಮುಂದಿನ ಪಾಠ' : <><CheckCircle size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> ಮುಗಿಸಿ</>}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile bottom navigation strip */}
            <nav className="learn-mobile-nav" aria-label="Lesson navigation">
                {Object.values(LESSONS).map(lesson => {
                    const isCompleted = progress.completedLessons.includes(lesson.id);
                    const isActive = activeLesson && activeLesson.id === lesson.id;
                    return (
                        <button
                            key={lesson.id}
                            className={`learn-mobile-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                            onClick={() => startLesson(lesson.id)}
                            title={lesson.title}
                        >
                            {isCompleted ? <Check size={14} strokeWidth={3} /> : toKannadaNumeral(lesson.id)}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Learn;
