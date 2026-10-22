import React, { useState } from 'react';
import {
    Landmark, ExternalLink, CheckCircle, UserCheck, LayoutGrid, BadgeCheck,
    Users, Wheat, GraduationCap, HeartHandshake, Search, TriangleAlert } from 'lucide-react';
import { SCHEMES, SCHEME_CATEGORIES } from '../data/schemes';
import './Schemes.css';

const ICON_MAP = {
    LayoutGrid, BadgeCheck, Users, Wheat, GraduationCap, HeartHandshake
};

const CatIcon = ({ iconKey, size = 14 }) => {
    const Icon = ICON_MAP[iconKey];
    return Icon ? <Icon size={size} style={{ verticalAlign: 'middle', marginRight: 4 }} /> : null;
};

const Schemes = () => {
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all'
        ? SCHEMES
        : SCHEMES.filter((s) => s.category === filter);

    return (
        <div className="schemes-page animate-in">
            <header className="page-header">
                <h1 className="page-header-title">
                    <span className="page-header-icon"><Landmark size={28} /></span>
                    ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು
                </h1>
                <p className="page-header-subtitle">ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪ್ರಮುಖ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳ ಮಾಹಿತಿ</p>
            </header>

            <div className="schemes-content">
                <div className="schemes-stats">
                    <span className="stat-text"><strong>{filtered.length}</strong> ಯೋಜನೆಗಳು</span>
                    <span className="stat-text"><strong>{SCHEME_CATEGORIES.length - 1}</strong> ವರ್ಗಗಳು</span>
                </div>

                <div className="filter-bar">
                    {SCHEME_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
                            onClick={() => setFilter(cat.id)}
                        >
                            <CatIcon iconKey={cat.iconKey} /> {cat.label}
                        </button>
                    ))}
                </div>

                <div className="schemes-grid">
                    {filtered.map((s) => (
                        <article key={s.id} className="scheme-card">
                            <div className="scheme-card-head">
                                <h3 className="scheme-title">{s.title}</h3>
                                <span className="scheme-title-en">{s.titleEn}</span>
                            </div>
                            <p className="scheme-desc">{s.desc}</p>

                            <div className="scheme-meta">
                                <div className="scheme-meta-row">
                                    <CheckCircle size={15} className="scheme-meta-icon benefit" />
                                    <span><strong>ಲಾಭ:</strong> {s.benefit}</span>
                                </div>
                                <div className="scheme-meta-row">
                                    <UserCheck size={15} className="scheme-meta-icon eligible" />
                                    <span><strong>ಅರ್ಹತೆ:</strong> {s.eligibility}</span>
                                </div>
                            </div>

                            <a
                                className="btn btn-primary scheme-link"
                                href={s.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ಅಧಿಕೃತ ಜಾಲತಾಣ <ExternalLink size={14} style={{ marginLeft: 4, verticalAlign: 'middle' }} />
                            </a>
                        </article>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="no-results">
                        <div className="no-results-icon"><Search size={48} /></div>
                        <h3>ಯಾವುದೇ ಯೋಜನೆಗಳಿಲ್ಲ</h3>
                        <p className="text-secondary">ಬೇರೆ ವರ್ಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ</p>
                    </div>
                )}

                <p className="schemes-disclaimer">
                    <TriangleAlert size={14} style={{ verticalAlign: "-2px" }} /> ಇಲ್ಲಿನ ಮಾಹಿತಿ ಸಾಮಾನ್ಯ ಉಲ್ಲೇಖಕ್ಕಾಗಿ ಮಾತ್ರ. ನಿಖರವಾದ ವಿವರಗಳಿಗೆ ಅಧಿಕೃತ ಜಾಲತಾಣವನ್ನು ಪರಿಶೀಲಿಸಿ.
                </p>
            </div>
        </div>
    );
};

export default Schemes;
