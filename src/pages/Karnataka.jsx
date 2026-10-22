import React, { useState, useEffect } from 'react';
import {
    BookOpen, Users, Scroll, Drama, UtensilsCrossed, Map, PartyPopper, Waves,
    TreePine, GraduationCap, IndianRupee, Languages, MapPin, HelpCircle,
    Landmark, BarChart3, Ruler, Thermometer, MessageSquare, PenTool,
    Trophy, Star, User, Calendar, Lightbulb, Menu, X, Crown, TriangleAlert } from 'lucide-react';
import data from '../data/karnataka.json';
import './Karnataka.css';
import DataIcon from '../components/DataIcon';
import PageHeader from '../components/PageHeader';

const { quotes: QUOTES, quiz: QUIZ, facts: FACTS } = data;

const I = ({ icon: Icon, size = 16 }) => <Icon size={size} style={{ verticalAlign: 'middle', marginRight: 4 }} />;

// Extracted nav so it can be reused in both desktop + mobile sidebars
const NavMenu = ({ activeSection, handleNavClick, placeKeys }) => (
    <nav className="docs-nav">
        <div className="docs-nav-title">ಪರಿವಿಡಿ (Contents)</div>

        {[
            ['about', BookOpen, 'ಪರಿಚಯ'],
            ['geography', Ruler, 'ಭೂಗೋಳ'],
            ['history', Scroll, 'ಇತಿಹಾಸ'],
            ['personalities', Users, 'ಪ್ರಸಿದ್ಧ ವ್ಯಕ್ತಿಗಳು'],
            ['stateSymbols', Star, 'ರಾಜ್ಯ ಲಾಂಛನಗಳು'],
            ['artForms', Drama, 'ಕಲೆ ಮತ್ತು ಸಂಸ್ಕೃತಿ'],
            ['cuisine', UtensilsCrossed, 'ಅಡುಗೆ'],
            ['districts', Map, 'ಜಿಲ್ಲೆಗಳು'],
            ['festivals', PartyPopper, 'ಹಬ್ಬಗಳು'],
            ['rivers', Waves, 'ನದಿಗಳು'],
            ['wildlife', TreePine, 'ವನ್ಯಜೀವಿ'],
            ['government', Landmark, 'ಸರ್ಕಾರ'],
            ['transport', BarChart3, 'ಸಾರಿಗೆ'],
            ['education', GraduationCap, 'ಶಿಕ್ಷಣ'],
            ['economy', IndianRupee, 'ಆರ್ಥಿಕತೆ'],
            ['languages', Languages, 'ಭಾಷೆಗಳು'],
        ].map(([key, Icon, label]) => (
            <button
                key={key}
                onClick={() => handleNavClick(key)}
                className={`docs-nav-link-btn ${activeSection === key ? 'active' : ''}`}
            >
                <I icon={Icon} /> {label}
            </button>
        ))}

        <div className="docs-nav-subgroup">
            <span className="docs-nav-subtitle">ಪ್ರಸಿದ್ಧ ಸ್ಥಳಗಳು</span>
            {placeKeys.map((key) => (
                <button
                    key={key}
                    onClick={() => handleNavClick(`places-${key}`)}
                    className={`docs-nav-link-btn ${activeSection === `places-${key}` ? 'active' : ''}`}
                >
                    <I icon={MapPin} /> {data.places[key].title.split(' (')[0]}
                </button>
            ))}
        </div>

        <button
            onClick={() => handleNavClick('quiz')}
            className={`docs-nav-link-btn ${activeSection === 'quiz' ? 'active' : ''}`}
        >
            <I icon={HelpCircle} /> ರಸಪ್ರಶ್ನೆ
        </button>
    </nav>
);

const Karnataka = () => {
    const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);
    const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
    const [quizFeedback, setQuizFeedback] = useState({ text: '', color: '' });
    const [showNextQuiz, setShowNextQuiz] = useState(false);
    const [showFact, setShowFact] = useState(false);
    const [currentFact, setCurrentFact] = useState(FACTS[0]);
    const [activeSection, setActiveSection] = useState('about');
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        generateQuote();
        generateFact();
    }, []);

    // Lock body scroll when mobile nav is open
    useEffect(() => {
        document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileNavOpen]);

    const generateQuote = () => setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    const generateFact = () => setCurrentFact(FACTS[Math.floor(Math.random() * FACTS.length)]);

    const checkQuizAnswer = (idx) => {
        const correct = QUIZ[currentQuizIdx].a;
        if (idx === correct) {
            setQuizFeedback({ text: "ಸರಿಯಾದ ಉತ್ತರ! (Correct!)", color: "var(--success)" });
        } else {
            setQuizFeedback({ text: `ತಪ್ಪು ಉತ್ತರ. ಸರಿಯಾದ ಉತ್ತರ: ${QUIZ[currentQuizIdx].o[correct]} (Incorrect)`, color: "var(--error)" });
        }
        setShowNextQuiz(true);
    };

    const nextQuiz = () => {
        setCurrentQuizIdx((prev) => (prev + 1) % QUIZ.length);
        setQuizFeedback({ text: '', color: '' });
        setShowNextQuiz(false);
    };

    const toggleFact = () => {
        if (!showFact) generateFact();
        setShowFact(!showFact);
    };

    const handleNavClick = (section) => {
        setActiveSection(section);
        setMobileNavOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const placeKeys = Object.keys(data.places);

    const renderPlaceSection = (placeKey) => {
        const place = data.places[placeKey];
        if (!place) return null;
        return (
            <section className="docs-section panel animate-in">
                <h2 className="section-title">{place.title}</h2>
                <p className="wiki-p">{place.description}</p>

                {(place.area || place.population || place.headquarters) && (
                    <div className="fast-facts" style={{ marginBottom: 'var(--gap-lg)' }}>
                        <h3><I icon={BarChart3} /> ಜಿಲ್ಲಾ ಮಾಹಿತಿ (District Info)</h3>
                        <ul>
                            {place.area && <li><I icon={Ruler} /> <b>ವಿಸ್ತೀರ್ಣ:</b> {place.area}</li>}
                            {place.population && <li><I icon={Users} /> <b>ಜನಸಂಖ್ಯೆ:</b> {place.population}</li>}
                            {place.headquarters && <li><I icon={Landmark} /> <b>ಕೇಂದ್ರ:</b> {place.headquarters}</li>}
                            {place.climate && <li><I icon={Thermometer} /> <b>ಹವಾಮಾನ:</b> {place.climate}</li>}
                            {place.taluks && <li><I icon={Map} /> <b>ತಾಲೂಕುಗಳು:</b> {place.taluks.join(', ')}</li>}
                            {place.rivers && <li><I icon={Waves} /> <b>ನದಿಗಳು:</b> {place.rivers.join(', ')}</li>}
                            {place.languages && <li><I icon={Languages} /> <b>ಭಾಷೆಗಳು:</b> {place.languages.join(', ')}</li>}
                        </ul>
                    </div>
                )}

                {place.economy && (
                    <div className="fast-facts" style={{ marginBottom: 'var(--gap-lg)' }}>
                        <h3><I icon={IndianRupee} /> ಆರ್ಥಿಕತೆ (Economy)</h3>
                        <ul>{place.economy.map((e, i) => <li key={i}>• {e}</li>)}</ul>
                    </div>
                )}

                {place.notablePersons && (
                    <div className="fast-facts" style={{ marginBottom: 'var(--gap-lg)' }}>
                        <h3><I icon={User} /> ಪ್ರಸಿದ್ಧ ವ್ಯಕ್ತಿಗಳು (Notable Persons)</h3>
                        <ul>{place.notablePersons.map((p, i) => <li key={i}><I icon={Star} /> {p}</li>)}</ul>
                    </div>
                )}

                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--gap-md)', color: 'var(--text-primary)' }}>
                    <I icon={MapPin} /> ಪ್ರಮುಖ ಸ್ಥಳಗಳು (Key Places)
                </h3>
                <div className="sub-places-grid">
                    {place.subPlaces.map((sp, i) => (
                        <article key={i} className="sub-place">
                            <strong>{sp.name}</strong>
                            <p className="text-secondary">{sp.desc}</p>
                        </article>
                    ))}
                </div>
            </section>
        );
    };

    const renderContent = () => {
        if (activeSection.startsWith('places-')) {
            return renderPlaceSection(activeSection.replace('places-', ''));
        }

        switch (activeSection) {
            case 'about':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ಪರಿಚಯ (Introduction)</h2>

                        <aside className="wiki-infobox">
                            <div className="infobox-header">{data.infobox.title}</div>
                            <div className="infobox-image">
                                <div className="flag-image"></div>
                                <div className="infobox-caption">{data.infobox.flagCaption}</div>
                            </div>
                            <table className="infobox-table">
                                <tbody>
                                    {data.infobox.details.map((d, i) => (
                                        <tr key={i}><th>{d.label}</th><td>{d.value}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </aside>

                        <p className="wiki-p">
                            <b>ಕರ್ನಾಟಕ</b> ಭಾರತದ ದಕ್ಷಿಣ ಭಾಗದಲ್ಲಿರುವ ಒಂದು ರಾಜ್ಯ. ಇದು ವಿಸ್ತೀರ್ಣದಲ್ಲಿ ಆರನೇ ಅತಿದೊಡ್ಡ ಮತ್ತು
                            ಜನಸಂಖ್ಯೆಯಲ್ಲಿ ಎಂಟನೇ ಅತಿದೊಡ್ಡ ರಾಜ್ಯವಾಗಿದೆ. ಕರ್ನಾಟಕವು ಸಮೃದ್ಧ ನೈಸರ್ಗಿಕ ಸಂಪತ್ತು, ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಜೀವವೈವಿಧ್ಯ
                            ಮತ್ತು ಸಾವಿರಾರು ವರ್ಷಗಳ ಸಾಂಸ್ಕೃತಿಕ ಹಿನ್ನೆಲೆ ಹೊಂದಿದೆ.
                        </p>

                        <div className="fast-facts">
                            <h3><I icon={BarChart3} /> ತ್ವರಿತ ಸಂಗತಿಗಳು (Fast Facts)</h3>
                            <ul>
                                {data.fastFacts.map((f, i) => (
                                    <li key={i}><DataIcon value={f.icon} size={16} className="data-icon data-icon-inline" /> <b>{f.label}:</b> {f.value}</li>
                                ))}
                            </ul>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--gap-md)', color: 'var(--text-primary)' }}>
                            <I icon={Landmark} /> ರಾಜ್ಯ ಚಿಹ್ನೆಗಳು (State Symbols)
                        </h3>
                        <div className="symbols-grid">
                            {data.symbols.map((s, i) => (
                                <div key={i} className="symbol-card">
                                    <span className="symbol-icon"><DataIcon value={s.icon} size={30} /></span>
                                    <div className="symbol-name">{s.name}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'personalities':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ಪ್ರಸಿದ್ಧ ವ್ಯಕ್ತಿಗಳು (Notable Personalities)</h2>
                        <p className="wiki-p">
                            ಕರ್ನಾಟಕವು ಅನೇಕ ಪ್ರಸಿದ್ಧ ವ್ಯಕ್ತಿಗಳಿಗೆ ಜನ್ಮ ನೀಡಿದೆ. ಸಾಹಿತ್ಯ, ಕಲೆ, ವಿಜ್ಞಾನ, ರಾಜಕಾರಣ ಮತ್ತು ಕ್ರೀಡೆಯಲ್ಲಿ ಮಹತ್ವದ ಕೊಡುಗೆ ನೀಡಿದ ವ್ಯಕ್ತಿಗಳು.
                        </p>
                        <div className="persons-grid">
                            {data.personalities.map((p, i) => (
                                <article key={i} className="person-card">
                                    <div className="person-header">
                                        <div className="person-avatar">{p.avatar}</div>
                                    </div>
                                    <div className="person-body">
                                        <div className="person-name">{p.name}</div>
                                        <p className="text-secondary" style={{ fontSize: '0.8rem' }}>{p.desc}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                );

            case 'history':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ಇತಿಹಾಸ (History)</h2>
                        <p className="wiki-p">
                            ಕರ್ನಾಟಕದ ಇತಿಹಾಸವು ಸಾವಿರಾರು ವರ್ಷಗಳಷ್ಟು ಹಳೆಯದು. ೪ನೇ ಶತಮಾನದ ಕದಂಬರಿಂದ
                            ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ವೈಭವ ಮತ್ತು ಮೈಸೂರು ಸಂಸ್ಥಾನದವರೆಗೆ ಅನೇಕ ರಾಜವಂಶಗಳು ರಾಜ್ಯವನ್ನು ಆಳಿವೆ.
                        </p>
                        <div className="kn-timeline">
                            {data.historyTimeline.map((t, i) => (
                                <div key={i} className="kn-timeline-item">
                                    <div className="kn-timeline-dot" />
                                    <div className="kn-timeline-body">
                                        <span className="kn-timeline-period">{t.period}</span>
                                        <h3 className="kn-timeline-name">{t.name} <span className="kn-timeline-en">{t.english}</span></h3>
                                        <div className="kn-timeline-meta">
                                            {t.capital && <span className="kn-tl-tag"><Landmark size={13} style={{ verticalAlign: "-2px" }} /> {t.capital}</span>}
                                            {t.king && <span className="kn-tl-tag"><Crown size={13} style={{ verticalAlign: "-2px" }} /> {t.king}</span>}
                                        </div>
                                        {t.fact && <p className="kn-timeline-fact"><Lightbulb size={14} style={{ verticalAlign: "-2px" }} /> {t.fact}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'artForms':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ಕಲೆ ಮತ್ತು ಸಂಸ್ಕೃತಿ (Art & Culture)</h2>
                        <p className="wiki-p">
                            ಕರ್ನಾಟಕವು ವೈವಿಧ್ಯಮಯ ಕಲಾ ಪ್ರಕಾರಗಳು, ಜನಪದ ನೃತ್ಯಗಳು, ಸಂಗೀತ ಮತ್ತು ಕರಕುಶಲ ಕಲೆಗಳಿಗೆ ಹೆಸರುವಾಸಿ.
                        </p>
                        <div className="symbols-grid">
                            {data.artForms.map((art, i) => (
                                <article key={i} className="symbol-card">
                                    <span className="symbol-icon"><DataIcon value={art.icon} size={30} /></span>
                                    <div className="symbol-name">{art.name}</div>
                                    <p className="text-secondary" style={{ fontSize: '0.8rem', margin: 'var(--gap-xs) 0 0 0' }}>{art.desc}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                );

            case 'cuisine':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ಕರ್ನಾಟಕದ ಅಡುಗೆ (Cuisine)</h2>
                        <p className="wiki-p">
                            ಕರ್ನಾಟಕದ ಆಹಾರ ಸಂಸ್ಕೃತಿ ಪ್ರದೇಶದಿಂದ ಪ್ರದೇಶಕ್ಕೆ ಬದಲಾಗುತ್ತದೆ.
                        </p>
                        <div className="symbols-grid">
                            {data.cuisine.map((food, i) => (
                                <article key={i} className="symbol-card">
                                    <span className="symbol-icon"><DataIcon value={food.icon} size={30} /></span>
                                    <div className="symbol-name">{food.name}</div>
                                    <p className="text-secondary" style={{ fontSize: '0.8rem', margin: 'var(--gap-xs) 0 0 0' }}>{food.desc}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                );

            case 'districts':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ಜಿಲ್ಲೆಗಳು (31 Districts)</h2>
                        <p className="wiki-p">
                            ಕರ್ನಾಟಕವು ೩೧ ಜಿಲ್ಲೆಗಳನ್ನು ಹೊಂದಿದೆ. ಪ್ರತಿಯೊಂದು ಜಿಲ್ಲೆಯು ತನ್ನದೇ ಆದ ವಿಶೇಷತೆಗಳನ್ನು ಹೊಂದಿದೆ.
                        </p>
                        <div className="sub-places-grid">
                            {data.districts.map((d, i) => (
                                <article key={i} className="sub-place">
                                    <strong>{d.name}{d.english ? ` (${d.english})` : ''}</strong>
                                    {d.special && <p className="text-secondary" style={{ margin: 'var(--gap-xs) 0' }}>{d.special}</p>}
                                    {d.info && <p className="text-secondary" style={{ margin: 'var(--gap-xs) 0', fontSize: '0.85rem' }}>{d.info}</p>}
                                    {d.details && (
                                        <div style={{ marginTop: 'var(--gap-sm)', fontSize: '0.8rem' }}>
                                            {d.details.famous_for && <div><b>ಪ್ರಸಿದ್ಧ:</b> {d.details.famous_for.join(', ')}</div>}
                                            {d.details.rivers && <div><b>ನದಿಗಳು:</b> {d.details.rivers.join(', ')}</div>}
                                            {d.details.importance && <div style={{ marginTop: 'var(--gap-xs)', color: 'var(--text-muted)' }}>{d.details.importance}</div>}
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    </section>
                );

            case 'festivals':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ಹಬ್ಬಗಳು (Festivals)</h2>
                        <p className="wiki-p">
                            ಕರ್ನಾಟಕವು ವೈವಿಧ್ಯಮಯ ಹಬ್ಬಗಳನ್ನು ಆಚರಿಸುತ್ತದೆ.
                        </p>
                        <div className="sub-places-grid">
                            {data.festivals.map((f, i) => (
                                <article key={i} className="sub-place">
                                    <strong>{f.name}{f.english ? ` (${f.english})` : ''}</strong>
                                    {f.month && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--gap-xs)' }}><I icon={Calendar} /> {f.month}{f.region ? <> | <I icon={MapPin} /> {f.region}</> : ''}</div>}
                                    <p className="text-secondary">{f.desc}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                );

            case 'rivers':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ನದಿಗಳು (Rivers)</h2>
                        <p className="wiki-p">
                            ಕರ್ನಾಟಕವು ಅನೇಕ ಪ್ರಮುಖ ನದಿಗಳ ಉಗಮ ಮತ್ತು ಹರಿವಿನ ಪ್ರದೇಶ.
                        </p>
                        <div className="sub-places-grid">
                            {data.rivers.map((r, i) => (
                                <article key={i} className="sub-place">
                                    <strong><DataIcon value={r.icon} size={18} className="data-icon data-icon-inline" /> {r.name}{r.english ? ` (${r.english})` : ''}</strong>
                                    {r.length && <div style={{ fontSize: '0.8rem', marginTop: 'var(--gap-xs)' }}><b>ಉದ್ದ:</b> {r.length}</div>}
                                    {r.origin && <div style={{ fontSize: '0.8rem' }}><b>ಉಗಮ:</b> {r.origin}</div>}
                                    {r.districts && <div style={{ fontSize: '0.8rem' }}><b>ಜಿಲ್ಲೆಗಳು:</b> {r.districts.join(', ')}</div>}
                                    <p className="text-secondary">{r.desc}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                );

            case 'wildlife':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ವನ್ಯಜೀವಿ (Wildlife)</h2>
                        <p className="wiki-p">
                            ಕರ್ನಾಟಕವು ಭಾರತದಲ್ಲಿ ಅತಿ ಹೆಚ್ಚು ಆನೆ ಮತ್ತು ಹುಲಿಗಳನ್ನು ಹೊಂದಿರುವ ರಾಜ್ಯಗಳಲ್ಲಿ ಒಂದು.
                        </p>
                        <div className="sub-places-grid">
                            {data.wildlife.map((w, i) => (
                                <article key={i} className="sub-place">
                                    <strong><DataIcon value={w.icon} size={18} className="data-icon data-icon-inline" /> {w.name}{w.english ? ` (${w.english})` : ''}</strong>
                                    {w.location && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--gap-xs)' }}><I icon={MapPin} /> {w.location}</div>}
                                    {w.area && <div style={{ fontSize: '0.8rem' }}><b>ವಿಸ್ತೀರ್ಣ:</b> {w.area}</div>}
                                    {w.animals && <div style={{ fontSize: '0.8rem' }}><b>ಪ್ರಾಣಿಗಳು:</b> {w.animals.join(', ')}</div>}
                                    <p className="text-secondary">{w.desc}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                );

            case 'education':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ಶಿಕ್ಷಣ (Education)</h2>
                        <p className="wiki-p">
                            ಕರ್ನಾಟಕವು ಭಾರತದ ಪ್ರಮುಖ ಶಿಕ್ಷಣ ಕೇಂದ್ರಗಳಲ್ಲಿ ಒಂದು.
                        </p>
                        <div className="sub-places-grid">
                            {data.education.map((e, i) => (
                                <article key={i} className="sub-place">
                                    <strong><DataIcon value={e.icon} size={18} className="data-icon data-icon-inline" /> {e.name}{e.english ? ` (${e.english})` : ''}</strong>
                                    {e.location && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--gap-xs)' }}><I icon={MapPin} /> {e.location}</div>}
                                    {e.founded && <div style={{ fontSize: '0.8rem' }}><b>ಸ್ಥಾಪನೆ:</b> {e.founded}</div>}
                                    <p className="text-secondary">{e.desc}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                );

            case 'economy':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ಆರ್ಥಿಕತೆ (Economy)</h2>
                        <p className="wiki-p">
                            ಕರ್ನಾಟಕವು ಭಾರತದ ಆರ್ಥಿಕ ಶಕ್ತಿ ಕೇಂದ್ರಗಳಲ್ಲಿ ಒಂದು.
                        </p>
                        <div className="sub-places-grid">
                            {data.economy.map((ec, i) => (
                                <article key={i} className="sub-place">
                                    <strong><DataIcon value={ec.icon} size={18} className="data-icon data-icon-inline" /> {ec.name}{ec.english ? ` (${ec.english})` : ''}</strong>
                                    {ec.contribution && <div style={{ fontSize: '0.8rem', marginTop: 'var(--gap-xs)' }}><b>ಕೊಡುಗೆ:</b> {ec.contribution}</div>}
                                    {ec.hub && <div style={{ fontSize: '0.8rem' }}><b>ಕೇಂದ್ರ:</b> {ec.hub}</div>}
                                    {ec.companies && <div style={{ fontSize: '0.8rem' }}><b>ಪ್ರಮುಖ:</b> {ec.companies.join(', ')}</div>}
                                    <p className="text-secondary">{ec.desc}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                );

            case 'languages':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ಭಾಷೆಗಳು (Languages)</h2>
                        <p className="wiki-p">
                            ಕರ್ನಾಟಕವು ಬಹುಭಾಷಾ ರಾಜ್ಯ.
                        </p>
                        <div className="symbols-grid">
                            {data.languages.map((lang, i) => (
                                <article key={i} className="symbol-card">
                                    <span className="symbol-icon"><DataIcon value={lang.icon} size={30} /></span>
                                    <div className="symbol-name">{lang.name}{lang.english ? ` (${lang.english})` : ''}</div>
                                    {lang.speakers && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}><I icon={MessageSquare} /> {lang.speakers} ಮಾತನಾಡುವವರು</div>}
                                    {lang.script && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}><I icon={PenTool} /> {lang.script}</div>}
                                    {lang.jnanpith > 0 && <div style={{ fontSize: '0.75rem', color: 'var(--accent)' }}><I icon={Trophy} /> {lang.jnanpith} ಜ್ಞಾನಪೀಠ</div>}
                                    <p className="text-secondary" style={{ fontSize: '0.8rem', margin: 'var(--gap-xs) 0 0 0' }}>{lang.desc}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                );

            case 'geography':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ಭೂಗೋಳ (Geography)</h2>
                        <p className="wiki-p">{data.geography.intro}</p>
                        <div className="symbols-grid">
                            {data.geography.regions.map((r, i) => (
                                <article key={i} className="symbol-card">
                                    <span className="symbol-icon"><DataIcon value={r.icon} size={30} /></span>
                                    <div className="symbol-name">{r.name} ({r.english})</div>
                                    <p className="text-secondary" style={{ fontSize: '0.8rem', margin: 'var(--gap-xs) 0 0 0' }}>{r.desc}</p>
                                </article>
                            ))}
                        </div>
                        <table className="wiki-table" style={{ marginTop: 'var(--gap-lg)' }}>
                            <tbody>
                                {data.geography.facts.map((f, i) => (
                                    <tr key={i}><th style={{ width: '45%' }}>{f.label}</th><td>{f.value}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                );

            case 'stateSymbols':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ರಾಜ್ಯ ಲಾಂಛನಗಳು (State Symbols)</h2>
                        <p className="wiki-p">ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ರಾಜ್ಯ ಲಾಂಛನಗಳು.</p>
                        <div className="symbols-grid">
                            {data.stateSymbols.map((s, i) => (
                                <article key={i} className="symbol-card">
                                    <span className="symbol-icon"><DataIcon value={s.icon} size={30} /></span>
                                    <div className="symbol-name">{s.name}</div>
                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.english}</div>
                                </article>
                            ))}
                        </div>
                    </section>
                );

            case 'government':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ಸರ್ಕಾರ ಮತ್ತು ಆಡಳಿತ (Government)</h2>
                        <p className="wiki-p">{data.government.intro}</p>
                        <table className="wiki-table">
                            <tbody>
                                {data.government.facts.map((f, i) => (
                                    <tr key={i}><th style={{ width: '45%' }}>{f.label}</th><td>{f.value}</td></tr>
                                ))}
                            </tbody>
                        </table>

                        <h3 className="kn-subhead">ಸಚಿವ ಸಂಪುಟ <span className="kn-asof">({data.cabinet.asOf})</span></h3>
                        <div className="kn-cabinet">
                            {data.cabinet.members.map((m, i) => (
                                <article key={i} className={`kn-minister ${i < 2 ? 'kn-minister-lead' : ''}`}>
                                    <div className="kn-minister-role">{m.role}</div>
                                    <div className="kn-minister-name">{m.name}</div>
                                    <div className="kn-minister-dept">{m.dept}</div>
                                </article>
                            ))}
                        </div>
                        <p className="kn-cabinet-note">
                            <TriangleAlert size={14} style={{ verticalAlign: "-2px" }} /> {data.cabinet.note} <a href={data.cabinet.source} target="_blank" rel="noopener noreferrer">ಅಧಿಕೃತ ಪಟ್ಟಿ →</a>
                        </p>
                    </section>
                );

            case 'transport':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ಸಾರಿಗೆ (Transport)</h2>
                        <p className="wiki-p">{data.transport.intro}</p>
                        <div className="symbols-grid">
                            {data.transport.items.map((t, i) => (
                                <article key={i} className="symbol-card" style={{ textAlign: 'left' }}>
                                    <span className="symbol-icon"><DataIcon value={t.icon} size={30} /></span>
                                    <div className="symbol-name">{t.name}</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{t.value}</div>
                                    <p className="text-secondary" style={{ fontSize: '0.8rem', margin: 'var(--gap-xs) 0 0 0' }}>{t.desc}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                );

            case 'quiz':
                return (
                    <section className="docs-section panel animate-in">
                        <h2 className="section-title">ರಸಪ್ರಶ್ನೆ (Quiz)</h2>
                        <p className="wiki-p">ಕರ್ನಾಟಕದ ಬಗ್ಗೆ ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಪರೀಕ್ಷಿಸಿ!</p>
                        <div className="quiz-card">
                            <h3>{QUIZ[currentQuizIdx].q}</h3>
                            <div className="options">
                                {QUIZ[currentQuizIdx].o.map((opt, i) => (
                                    <button key={i} className="quiz-option" onClick={() => checkQuizAnswer(i)}>
                                        <span style={{ marginRight: 'var(--gap-sm)', opacity: 0.5 }}>({String.fromCharCode(65 + i)})</span>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                            {quizFeedback.text && (
                                <div className="quiz-feedback" style={{ color: quizFeedback.color }}>{quizFeedback.text}</div>
                            )}
                            {showNextQuiz && (
                                <button className="btn btn-primary" onClick={nextQuiz} style={{ marginTop: 'var(--gap-md)' }}>
                                    ಮುಂದಿನ ಪ್ರಶ್ನೆ →
                                </button>
                            )}
                        </div>
                    </section>
                );

            default:
                return null;
        }
    };

    return (
        <div className="karnataka-page">
            {/* Wiki Header */}
            <PageHeader icon={Landmark} title="ಕರ್ನಾಟಕ ವೈಭವ" subtitle="ನಾಡಿನ ಸಾಹಿತ್ಯ, ಸಂಸ್ಕೃತಿ ಮತ್ತು ಇತಿಹಾಸದ ಪರಿಚಯ" />

            {/* Mobile Overlay — rendered directly in the tree, no portal needed */}
            <div
                className={`karnataka-mobile-overlay ${mobileNavOpen ? 'active' : ''}`}
                onClick={() => setMobileNavOpen(false)}
            />

            {/* Mobile Sidebar — slides in from left */}
            <aside className={`karnataka-sidebar-portal ${mobileNavOpen ? 'mobile-open' : ''}`}>
                <NavMenu
                    activeSection={activeSection}
                    handleNavClick={handleNavClick}
                    placeKeys={placeKeys}
                />
            </aside>

            <div className="docs-container">
                {/* Desktop Sidebar */}
                <aside className="docs-sidebar docs-sidebar-desktop">
                    <NavMenu
                        activeSection={activeSection}
                        handleNavClick={handleNavClick}
                        placeKeys={placeKeys}
                    />
                </aside>

                {/* Main Content */}
                <main className="docs-content">
                    {renderContent()}

                    {/* Quote Section */}
                    <div className="wiki-section">
                        <h2 className="wiki-h2">ಸಾಹಿತ್ಯದ ಮಾತು</h2>
                        <blockquote className="wiki-quote">
                            <p>"{currentQuote.text}"</p>
                            <cite>— {currentQuote.author}</cite>
                        </blockquote>
                    </div>
                </main>
            </div>

            {/* Mobile Navigation Toggle */}
            <button
                className="mobile-nav-toggle"
                onClick={() => setMobileNavOpen(prev => !prev)}
                aria-label="Toggle navigation"
            >
                {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Floating Fact Explorer */}
            <button className="floating-fact" onClick={toggleFact} title="ನಿಮಗೆ ಗೊತ್ತೇ?" aria-label="Show random fact">
                <Lightbulb size={22} />
            </button>

            {showFact && (
                <div className="fact-bubble animate-in">
                    <h4><I icon={Lightbulb} /> ನಿಮಗೆ ಗೊತ್ತೇ?</h4>
                    <p>{currentFact}</p>
                    <button className="btn btn-primary btn-sm" onClick={toggleFact}>ಮುಚ್ಚಿ</button>
                </div>
            )}
        </div>
    );
};

export default Karnataka;
