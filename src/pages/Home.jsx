import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    BookOpen, Smile, GraduationCap, WifiOff, Flame, Gamepad2, ArrowRight, Award, Blocks,
    ShieldCheck, Code2, Languages,
} from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import GitHubStar, { REPO_URL, GitHubMark } from '../components/GitHubStar';
import KannadaLexer from '../lib/js/interpreter/lexer.js';
import { TURTLE_COMMAND_NAMES } from '../lib/js/interpreter/turtle.js';
import { LESSONS } from '../data/lessons.js';
import { EXAMPLES } from '../data/examples.js';
import { TURTLE_LEVELS } from '../data/turtleLevels.js';
import './Home.css';

const lexer = new KannadaLexer();
const kn = (n) => lexer.toKannada(n);

// Counted from the real data, so the numbers never go stale.
const CONTROL = new Set(['IF', 'ELSE', 'WHILE', 'FOR', 'FROM', 'TO', 'FUNCTION', 'RETURN',
    'TRUE', 'FALSE', 'AND', 'OR', 'NOT', 'BREAK', 'CONTINUE']);
const FUNCTION_COUNT = new Set(Object.values(lexer.keywords).filter((t) => !CONTROL.has(t))).size + TURTLE_COMMAND_NAMES.length;

const STATS = [
    { value: kn(Object.keys(LESSONS).length), label: 'ಪಾಠಗಳು', sub: 'Lessons' },
    { value: kn(FUNCTION_COUNT), label: 'ಕಾರ್ಯಗಳು', sub: 'Built-in functions' },
    { value: kn(TURTLE_LEVELS.length), label: 'ಮಕ್ಕಳ ಹಂತಗಳು', sub: 'Kids levels' },
    { value: kn(EXAMPLES.length), label: 'ಉದಾಹರಣೆಗಳು', sub: 'Examples' },
];

const FEATURES = [
    {
        to: '/learn', Icon: BookOpen, title: 'ಹಂತ ಹಂತವಾಗಿ ಕಲಿಯಿರಿ', en: 'Learn',
        text: 'ಮುದ್ರಣದಿಂದ ನಿಘಂಟುವರೆಗೆ ೨೧ ಸಂವಾದಾತ್ಮಕ ಪಾಠಗಳು. ಮುಗಿಸಿದಾಗ ಪ್ರಮಾಣಪತ್ರ.',
        tags: [{ Icon: Award, t: 'ಪ್ರಮಾಣಪತ್ರ' }],
    },
    {
        to: '/kids', Icon: Smile, title: 'ಮಕ್ಕಳ ಕೋಡ್ ಲೋಕ', en: 'Kids zone',
        text: 'ಆಮೆ ಚಿತ್ರ, ಕನ್ನಡ ಬ್ಲಾಕ್ ಕೋಡಿಂಗ್ ಮತ್ತು ಆಟದ ಹಂತಗಳು. ತರಗತಿ ೩ ರಿಂದ ೮.',
        tags: [{ Icon: Blocks, t: 'ಬ್ಲಾಕ್‌ಗಳು' }],
    },
    {
        to: '/teachers', Icon: GraduationCap, title: 'ಶಿಕ್ಷಕರಿಗೆ', en: 'Teachers',
        text: 'ತರಗತಿವಾರು ಪಥ, ೪೦ ನಿಮಿಷದ ಪಾಠ ಯೋಜನೆ ಮತ್ತು ಮುದ್ರಿಸಬಹುದಾದ ವರ್ಕ್‌ಶೀಟ್.',
        tags: [{ Icon: Languages, t: 'NEP 2020' }],
    },
    {
        to: '/privacy', Icon: WifiOff, title: 'ಆಫ್‌ಲೈನ್ ಮತ್ತು ಸುರಕ್ಷಿತ', en: 'Offline & private',
        text: 'ಆ್ಯಪ್ ಸ್ಥಾಪಿಸಿ, ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ ಕೋಡ್ ಮಾಡಿ. ಲಾಗಿನ್ ಇಲ್ಲ, ಜಾಹೀರಾತು ಇಲ್ಲ.',
        tags: [{ Icon: ShieldCheck, t: 'ಲಾಗಿನ್ ಇಲ್ಲ' }],
    },
];

const Home = () => (
    <div className="home-page animate-in">
        {/* Editor leads: auto-types a demo, then hands over to the user */}
        <section className="home-editor-lead">
            <div className="home-editor-intro">
                <span className="hero-badge">ಕರ್ನಾಟಕದ ಮೊದಲ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ</span>
            </div>
            <CodeEditor autoDemo={true} />
        </section>

        {/* Quick actions */}
        <section className="home-secondary text-center">
            <div className="cta-group">
                <NavLink to="/learn" className="btn btn-primary"><BookOpen size={16} /> ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ</NavLink>
                <NavLink to="/kids" className="btn btn-secondary"><Smile size={16} /> ಮಕ್ಕಳ ಕೋಡ್ ಲೋಕ</NavLink>
                <NavLink to="/challenge" className="btn btn-secondary"><Flame size={16} /> ಇಂದಿನ ಸವಾಲು</NavLink>
                <NavLink to="/games" className="btn btn-secondary"><Gamepad2 size={16} /> ಆಟ ಆಡಿ</NavLink>
            </div>
        </section>

        {/* What K-Lipi is */}
        <section className="home-section home-intro">
            <span className="home-eyebrow"><Code2 size={14} /> ಕನ್ನಡ ಲಿಪಿ ಎಂದರೇನು?</span>
            <h2 className="home-h2">ಮಾತೃಭಾಷೆಯಲ್ಲೇ ಕೋಡಿಂಗ್ ಕಲಿಯಿರಿ</h2>
            <p className="home-lead">
                ಕನ್ನಡ ಲಿಪಿ ಪೂರ್ಣವಾಗಿ ಕನ್ನಡ ಅಕ್ಷರ, ಅಂಕಿ ಮತ್ತು ಪದಗಳಲ್ಲಿ ಬರೆಯುವ ನಿಜವಾದ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ.
                ಮಕ್ಕಳು ಇಂಗ್ಲಿಷ್ ಮತ್ತು ತರ್ಕವನ್ನು ಒಟ್ಟಿಗೆ ಕಲಿಯುವ ಬದಲು, ತರ್ಕದ ಮೇಲೆ ಗಮನ ಕೊಡುತ್ತಾರೆ.
            </p>
            <p className="home-lead-en">A real programming language written entirely in Kannada, so children learn logic first, not English.</p>

            <dl className="home-stats">
                {STATS.map((s) => (
                    <div key={s.sub} className="home-stat">
                        <dt className="home-stat-value">{s.value}</dt>
                        <dd className="home-stat-label">{s.label}<span>{s.sub}</span></dd>
                    </div>
                ))}
            </dl>
        </section>

        {/* Feature cards */}
        <section className="home-section">
            <div className="home-features">
                {FEATURES.map(({ to, Icon, title, en, text, tags }) => (
                    <NavLink key={to} to={to} className="home-feature">
                        <span className="home-feature-icon"><Icon size={22} /></span>
                        <h3>{title}<span>{en}</span></h3>
                        <p>{text}</p>
                        <div className="home-feature-foot">
                            {tags.map(({ Icon: T, t }) => <span key={t} className="home-tag"><T size={13} /> {t}</span>)}
                            <ArrowRight size={16} className="home-feature-arrow" />
                        </div>
                    </NavLink>
                ))}
            </div>
        </section>

        {/* Open source */}
        <section className="home-section">
            <div className="home-oss">
                <div className="home-oss-text">
                    <span className="home-eyebrow"><GitHubMark size={14} /> ಮುಕ್ತ ಮೂಲ · Open source</span>
                    <h2 className="home-h2">ಉಚಿತ, ಮುಕ್ತ ಮೂಲ, ಕರ್ನಾಟಕದ ಶಾಲೆಗಳಿಗಾಗಿ</h2>
                    <p>
                        ಕನ್ನಡ ಲಿಪಿಯ ಸಂಪೂರ್ಣ ಕೋಡ್ GitHub ನಲ್ಲಿ MIT ಪರವಾನಗಿಯಡಿ ಲಭ್ಯ. ಡೆವಲಪರ್‌ಗಳು, ಶಿಕ್ಷಕರು ಮತ್ತು
                        ಕನ್ನಡ ಪ್ರೇಮಿಗಳು ಪಾಠ, ಉದಾಹರಣೆ ಅಥವಾ ಕೋಡ್ ಮೂಲಕ ಕೊಡುಗೆ ನೀಡಬಹುದು.
                    </p>
                    <p className="home-oss-by">
                        <a href="https://www.visionone7.in" target="_blank" rel="noopener noreferrer">VisionOne7</a> ಯೋಜನೆ
                    </p>
                </div>
                <div className="home-oss-actions">
                    <GitHubStar />
                    <a className="btn btn-secondary" href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer">
                        ಕೊಡುಗೆ ನೀಡಿ <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    </div>
);

export default Home;
