import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    BookOpen, Smile, GraduationCap, WifiOff, Flame, Gamepad2, ArrowRight, Award, Blocks,
    ShieldCheck, Code2, Languages, Compass,
} from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import GitHubStar, { REPO_URL, GitHubMark } from '../components/GitHubStar';
import KarnatakaCard from '../components/KarnatakaCard';
import { KARNATAKA_SECTIONS } from '../data/karnatakaSections';
import KannadaLexer from '../lib/js/interpreter/lexer.js';
import { TURTLE_COMMAND_NAMES } from '../lib/js/interpreter/turtle.js';
import { LESSONS } from '../data/lessons.js';
import { EXAMPLES } from '../data/examples.js';
import { TURTLE_LEVELS } from '../data/turtleLevels.js';
import { useLang } from '../lib/i18n';
import './Home.css';

const HOME_KARNATAKA = ['culture', 'districts', 'wonders', 'quiz'].map((id) => KARNATAKA_SECTIONS.find((s) => s.id === id));

const lexer = new KannadaLexer();
const kn = (n) => lexer.toKannada(n);

// Counted from the real data, so the numbers never go stale.
const CONTROL = new Set(['IF', 'ELSE', 'WHILE', 'FOR', 'FROM', 'TO', 'FUNCTION', 'RETURN',
    'TRUE', 'FALSE', 'AND', 'OR', 'NOT', 'BREAK', 'CONTINUE']);
const FUNCTION_COUNT = new Set(Object.values(lexer.keywords).filter((t) => !CONTROL.has(t))).size + TURTLE_COMMAND_NAMES.length;

const STATS = [
    { n: Object.keys(LESSONS).length, label: 'ಪಾಠಗಳು', sub: 'Lessons' },
    { n: FUNCTION_COUNT, label: 'ಕಾರ್ಯಗಳು', sub: 'Built-in functions' },
    { n: TURTLE_LEVELS.length, label: 'ಮಕ್ಕಳ ಹಂತಗಳು', sub: 'Kids levels' },
    { n: EXAMPLES.length, label: 'ಉದಾಹರಣೆಗಳು', sub: 'Examples' },
];

const FEATURES = [
    {
        to: '/learn', Icon: BookOpen, title: 'ಹಂತ ಹಂತವಾಗಿ ಕಲಿಯಿರಿ', en: 'Learn',
        text: 'ಪಾಠಗಳು, ಉದಾಹರಣೆಗಳು ಮತ್ತು ಕಾರ್ಯಗಳ ಉಲ್ಲೇಖ ಒಂದೇ ಕಡೆ. ಎಲ್ಲಾ ಪಾಠ ಮುಗಿಸಿದಾಗ ಪ್ರಮಾಣಪತ್ರ.',
        textEn: 'Lessons, examples and the function reference in one place. A certificate when you finish.',
        tags: [{ Icon: Award, t: 'ಪ್ರಮಾಣಪತ್ರ', en: 'Certificate' }],
    },
    {
        to: '/kids', Icon: Smile, title: 'ಮಕ್ಕಳ ಕೋಡ್ ಲೋಕ', en: 'Kids zone',
        text: `ಆಮೆ ಚಿತ್ರ, ಕನ್ನಡ ಬ್ಲಾಕ್ ಕೋಡಿಂಗ್ ಮತ್ತು ${kn(TURTLE_LEVELS.length)} ಆಟದ ಹಂತಗಳು. ತರಗತಿ ೩ ರಿಂದ ೮.`,
        textEn: `Turtle drawing, Kannada block coding and ${TURTLE_LEVELS.length} game levels. Classes 3 to 8.`,
        tags: [{ Icon: Blocks, t: 'ಬ್ಲಾಕ್‌ಗಳು', en: 'Blocks' }],
    },
    {
        to: '/teachers', Icon: GraduationCap, title: 'ಶಿಕ್ಷಕರಿಗೆ', en: 'Teachers',
        text: 'ತರಗತಿವಾರು ಪಥ, ಪಾಠ ಯೋಜನೆ, ವರ್ಕ್‌ಶೀಟ್ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಕಳುಹಿಸುವ ಕಾರ್ಯ ಲಿಂಕ್‌ಗಳು.',
        textEn: 'Class-wise paths, lesson plans, worksheets and assignment links to send to students.',
        tags: [{ Icon: Languages, t: 'NEP 2020', en: 'NEP 2020' }],
    },
    {
        to: '/privacy', Icon: WifiOff, title: 'ಆಫ್‌ಲೈನ್ ಮತ್ತು ಸುರಕ್ಷಿತ', en: 'Offline & private',
        text: 'ಆ್ಯಪ್ ಸ್ಥಾಪಿಸಿ, ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ ಕೋಡ್ ಮಾಡಿ. ಲಾಗಿನ್ ಇಲ್ಲ, ಜಾಹೀರಾತು ಇಲ್ಲ.',
        textEn: 'Install the app and code without internet. No login, no ads.',
        tags: [{ Icon: ShieldCheck, t: 'ಲಾಗಿನ್ ಇಲ್ಲ', en: 'No login' }],
    },
];

const Home = () => {
    const { t, lang } = useLang();
    const num = (n) => (lang === 'en' ? String(n) : kn(n));

    return (
        <div className="home-page animate-in">
            {/* Editor leads: auto-types a demo, then hands over to the user */}
            <section className="home-editor-lead">
                <div className="home-editor-intro">
                    <span className="hero-badge">{t('ಕರ್ನಾಟಕದ ಮೊದಲ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ', "Karnataka's first programming language")}</span>
                </div>
                <CodeEditor autoDemo={true} />
            </section>

            {/* Quick actions */}
            <section className="home-secondary text-center">
                <div className="cta-group">
                    <NavLink to="/learn" className="btn btn-primary"><BookOpen size={16} /> {t('ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ', 'Start learning')}</NavLink>
                    <NavLink to="/kids" className="btn btn-secondary"><Smile size={16} /> {t('ಮಕ್ಕಳ ಕೋಡ್ ಲೋಕ', 'Kids zone')}</NavLink>
                    <NavLink to="/challenge" className="btn btn-secondary"><Flame size={16} /> {t('ಇಂದಿನ ಸವಾಲು', 'Daily challenge')}</NavLink>
                    <NavLink to="/games" className="btn btn-secondary"><Gamepad2 size={16} /> {t('ಆಟ ಆಡಿ', 'Play games')}</NavLink>
                </div>
            </section>

            {/* What K-Lipi is */}
            <section className="home-section home-intro">
                <span className="home-eyebrow"><Code2 size={14} /> {t('ಕನ್ನಡ ಲಿಪಿ ಎಂದರೇನು?', 'What is K-Lipi?')}</span>
                <h2 className="home-h2">{t('ಮಾತೃಭಾಷೆಯಲ್ಲೇ ಕೋಡಿಂಗ್ ಕಲಿಯಿರಿ', 'Learn to code in your mother tongue')}</h2>
                {lang === 'en' ? (
                    <p className="home-lead">
                        K-Lipi is a real programming language written entirely in Kannada letters, numbers and words.
                        Instead of learning English and logic at the same time, children can focus on the logic.
                    </p>
                ) : (
                    <>
                        <p className="home-lead">
                            ಕನ್ನಡ ಲಿಪಿ ಪೂರ್ಣವಾಗಿ ಕನ್ನಡ ಅಕ್ಷರ, ಅಂಕಿ ಮತ್ತು ಪದಗಳಲ್ಲಿ ಬರೆಯುವ ನಿಜವಾದ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ.
                            ಮಕ್ಕಳು ಇಂಗ್ಲಿಷ್ ಮತ್ತು ತರ್ಕವನ್ನು ಒಟ್ಟಿಗೆ ಕಲಿಯುವ ಬದಲು, ತರ್ಕದ ಮೇಲೆ ಗಮನ ಕೊಡುತ್ತಾರೆ.
                        </p>
                        <p className="home-lead-en">A real programming language written entirely in Kannada, so children learn logic first, not English.</p>
                    </>
                )}

                <dl className="home-stats">
                    {STATS.map((s) => (
                        <div key={s.sub} className="home-stat">
                            <dt className="home-stat-value">{num(s.n)}</dt>
                            <dd className="home-stat-label">{t(s.label, s.sub)}{lang !== 'en' && <span>{s.sub}</span>}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            {/* Feature cards */}
            <section className="home-section">
                <div className="home-features">
                    {FEATURES.map(({ to, Icon, title, en, text, textEn, tags }) => (
                        <NavLink key={to} to={to} className="home-feature">
                            <span className="home-feature-icon"><Icon size={22} /></span>
                            <h3>{t(title, en)}{lang !== 'en' && <span>{en}</span>}</h3>
                            <p>{t(text, textEn)}</p>
                            <div className="home-feature-foot">
                                {tags.map(({ Icon: T, t: tag, en: tagEn }) => <span key={tag} className="home-tag"><T size={13} /> {t(tag, tagEn)}</span>)}
                                <ArrowRight size={16} className="home-feature-arrow" />
                            </div>
                        </NavLink>
                    ))}
                </div>
            </section>

            {/* Karnataka section, so visitors see what it holds */}
            <section className="home-section home-karnataka">
                <div className="home-karnataka-head">
                    <div>
                        <span className="home-eyebrow"><Compass size={14} /> {t('ನಮ್ಮ ಕರ್ನಾಟಕ', 'Our Karnataka')}</span>
                        <h2 className="home-h2">{t('ನಾಡಿನ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ', 'Get to know the state')}</h2>
                        <p className="home-karnataka-sub">{t('ಇತಿಹಾಸ, ಜಿಲ್ಲೆಗಳ ನಕ್ಷೆ, ಅದ್ಭುತಗಳು, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಇ-ಸೇವೆಗಳು.', 'History, a district map, wonders, government schemes and e-services.')}</p>
                    </div>
                    <NavLink to="/karnataka" className="btn btn-secondary">
                        {t(`ಎಲ್ಲಾ ${kn(KARNATAKA_SECTIONS.length)} ವಿಭಾಗಗಳು`, `All ${KARNATAKA_SECTIONS.length} sections`)} <ArrowRight size={16} />
                    </NavLink>
                </div>
                <div className="kc-grid home-karnataka-grid">
                    {HOME_KARNATAKA.map((s) => <KarnatakaCard key={s.id} section={s} />)}
                </div>
            </section>

            {/* Open source */}
            <section className="home-section">
                <div className="home-oss">
                    <div className="home-oss-text">
                        <span className="home-eyebrow"><GitHubMark size={14} /> {t('ಮುಕ್ತ ಮೂಲ · Open source', 'Open source')}</span>
                        <h2 className="home-h2">{t('ಉಚಿತ, ಮುಕ್ತ ಮೂಲ, ಕರ್ನಾಟಕದ ಶಾಲೆಗಳಿಗಾಗಿ', "Free and open source, for Karnataka's schools")}</h2>
                        <p>
                            {t('ಕನ್ನಡ ಲಿಪಿಯ ಸಂಪೂರ್ಣ ಕೋಡ್ GitHub ನಲ್ಲಿ MIT ಪರವಾನಗಿಯಡಿ ಲಭ್ಯ. ಡೆವಲಪರ್‌ಗಳು, ಶಿಕ್ಷಕರು ಮತ್ತು ಕನ್ನಡ ಪ್ರೇಮಿಗಳು ಪಾಠ, ಉದಾಹರಣೆ ಅಥವಾ ಕೋಡ್ ಮೂಲಕ ಕೊಡುಗೆ ನೀಡಬಹುದು.',
                                'All of K-Lipi\'s code is on GitHub under the MIT licence. Developers, teachers and Kannada lovers can contribute lessons, examples or code.')}
                        </p>
                        <p className="home-oss-by">
                            <a href="https://www.visionone7.in" target="_blank" rel="noopener noreferrer">VisionOne7</a> {t('ಯೋಜನೆ', 'project')}
                        </p>
                    </div>
                    <div className="home-oss-actions">
                        <GitHubStar />
                        <a className="btn btn-secondary" href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer">
                            {t('ಕೊಡುಗೆ ನೀಡಿ', 'Contribute')} <ArrowRight size={16} />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
