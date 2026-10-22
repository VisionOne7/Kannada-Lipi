import React, { useState } from 'react';
import {
    GraduationCap, ExternalLink, UserCheck, LayoutGrid, Award, FileText, Globe, Search, TriangleAlert } from 'lucide-react';
import { STUDENT_RESOURCES, RESOURCE_CATEGORIES } from '../data/studentResources';
import './ResourceCards.css';

const ICONS = { LayoutGrid, Award, FileText, Globe };
const CatIcon = ({ iconKey, size = 14 }) => {
    const I = ICONS[iconKey];
    return I ? <I size={size} style={{ verticalAlign: 'middle', marginRight: 4 }} /> : null;
};

const StudentResources = () => {
    const [filter, setFilter] = useState('all');
    const items = filter === 'all' ? STUDENT_RESOURCES : STUDENT_RESOURCES.filter((r) => r.category === filter);

    return (
        <div className="rescards-page animate-in">
            <header className="page-header">
                <h1 className="page-header-title">
                    <span className="page-header-icon"><GraduationCap size={28} /></span>
                    ವಿದ್ಯಾರ್ಥಿ ಸಂಪನ್ಮೂಲಗಳು
                </h1>
                <p className="page-header-subtitle">ಕರ್ನಾಟಕದ ವಿದ್ಯಾರ್ಥಿವೇತನ, ಪರೀಕ್ಷೆ ಮತ್ತು ಶಿಕ್ಷಣ ಪೋರ್ಟಲ್‌ಗಳು</p>
            </header>

            <div className="rescards-content">
                <div className="filter-bar">
                    {RESOURCE_CATEGORIES.map((c) => (
                        <button key={c.id} className={`filter-btn ${filter === c.id ? 'active' : ''}`} onClick={() => setFilter(c.id)}>
                            <CatIcon iconKey={c.iconKey} /> {c.label}
                        </button>
                    ))}
                </div>

                <div className="rescards-grid">
                    {items.map((r) => (
                        <article key={r.id} className="rescard">
                            <div className="rescard-head">
                                <h3 className="rescard-title">{r.title}</h3>
                                <span className="rescard-title-en">{r.titleEn}</span>
                            </div>
                            <p className="rescard-desc">{r.desc}</p>
                            <div className="rescard-meta">
                                <UserCheck size={14} className="rescard-meta-icon" />
                                <span><strong>ಅರ್ಹತೆ:</strong> {r.eligibility}</span>
                            </div>
                            <a className="btn btn-primary rescard-link" href={r.link} target="_blank" rel="noopener noreferrer">
                                ಅಧಿಕೃತ ಜಾಲತಾಣ <ExternalLink size={14} style={{ marginLeft: 4, verticalAlign: 'middle' }} />
                            </a>
                        </article>
                    ))}
                </div>

                {items.length === 0 && (
                    <div className="no-results"><div className="no-results-icon"><Search size={48} /></div><h3>ಯಾವುದೂ ಸಿಗಲಿಲ್ಲ</h3></div>
                )}

                <p className="rescards-foot"><TriangleAlert size={14} style={{ verticalAlign: "-2px" }} /> ಸಾಮಾನ್ಯ ಉಲ್ಲೇಖಕ್ಕಾಗಿ ಮಾತ್ರ. ಅರ್ಹತೆ ಮತ್ತು ದಿನಾಂಕಗಳಿಗೆ ಅಧಿಕೃತ ಜಾಲತಾಣ ನೋಡಿ.</p>
            </div>
        </div>
    );
};

export default StudentResources;
