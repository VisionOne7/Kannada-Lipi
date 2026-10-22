import React, { useState } from 'react';
import {
    Building2, ExternalLink, LayoutGrid, Landmark, Receipt, Car, Map, Search, TriangleAlert } from 'lucide-react';
import { ESERVICES, ESERVICE_CATEGORIES } from '../data/eServices';
import './ResourceCards.css';
import DataIcon from '../components/DataIcon';

const ICONS = { LayoutGrid, Landmark, Receipt, Car, Map };
const CatIcon = ({ iconKey, size = 14 }) => {
    const I = ICONS[iconKey];
    return I ? <I size={size} style={{ verticalAlign: 'middle', marginRight: 4 }} /> : null;
};

const EServices = () => {
    const [filter, setFilter] = useState('all');
    const items = filter === 'all' ? ESERVICES : ESERVICES.filter((r) => r.category === filter);

    return (
        <div className="rescards-page animate-in">
            <header className="page-header">
                <h1 className="page-header-title">
                    <span className="page-header-icon"><Building2 size={28} /></span>
                    ಸರ್ಕಾರಿ ಇ-ಸೇವೆಗಳು
                </h1>
                <p className="page-header-subtitle">ದಿನನಿತ್ಯ ಬೇಕಾಗುವ ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಆನ್‌ಲೈನ್ ಸೇವೆಗಳ ನೇರ ಲಿಂಕ್</p>
            </header>

            <div className="rescards-content">
                <div className="filter-bar">
                    {ESERVICE_CATEGORIES.map((c) => (
                        <button key={c.id} className={`filter-btn ${filter === c.id ? 'active' : ''}`} onClick={() => setFilter(c.id)}>
                            <CatIcon iconKey={c.iconKey} /> {c.label}
                        </button>
                    ))}
                </div>

                <div className="rescards-grid">
                    {items.map((r) => (
                        <article key={r.id} className="rescard">
                            <div className="rescard-head rescard-head-emoji">
                                <span className="rescard-emoji"><DataIcon value={r.emoji} size={26} /></span>
                                <div>
                                    <h3 className="rescard-title">{r.title}</h3>
                                    <span className="rescard-title-en">{r.titleEn}</span>
                                </div>
                            </div>
                            <p className="rescard-desc">{r.desc}</p>
                            <a className="btn btn-primary rescard-link" href={r.link} target="_blank" rel="noopener noreferrer">
                                ತೆರೆಯಿರಿ <ExternalLink size={14} style={{ marginLeft: 4, verticalAlign: 'middle' }} />
                            </a>
                        </article>
                    ))}
                </div>

                {items.length === 0 && (
                    <div className="no-results"><div className="no-results-icon"><Search size={48} /></div><h3>ಯಾವುದೂ ಸಿಗಲಿಲ್ಲ</h3></div>
                )}

                <p className="rescards-foot"><TriangleAlert size={14} style={{ verticalAlign: "-2px" }} /> ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಜಾಲತಾಣಗಳ ಲಿಂಕ್. ಪಾವತಿ ಮಾಡುವ ಮುನ್ನ URL ಪರಿಶೀಲಿಸಿ.</p>
            </div>
        </div>
    );
};

export default EServices;
