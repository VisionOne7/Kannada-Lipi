import React, { useState } from 'react';
import { Sparkles, Trophy, Landmark, Mountain, MapPin, Star, Search } from 'lucide-react';
import { WONDERS, WONDER_CATEGORIES } from '../data/wonders';
import './Wonders.css';
import DataIcon from '../components/DataIcon';

const ICON_MAP = { Sparkles, Trophy, Landmark, Mountain };

const CatIcon = ({ iconKey, size = 14 }) => {
    const Icon = ICON_MAP[iconKey];
    return Icon ? <Icon size={size} style={{ verticalAlign: 'middle', marginRight: 4 }} /> : null;
};

// Small coloured chip so users can see a wonder's type at a glance.
const CATEGORY_LABEL = {
    record: { label: 'ದಾಖಲೆ', cls: 'tag-record' },
    heritage: { label: 'ಪಾರಂಪರಿಕ', cls: 'tag-heritage' },
    nature: { label: 'ಪ್ರಕೃತಿ', cls: 'tag-nature' }
};

const Wonders = () => {
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all'
        ? WONDERS
        : WONDERS.filter((w) => w.category === filter);

    return (
        <div className="wonders-page animate-in">
            <header className="page-header">
                <h1 className="page-header-title">
                    <span className="page-header-icon"><Sparkles size={28} /></span>
                    ಕರ್ನಾಟಕದ ಅದ್ಭುತಗಳು
                </h1>
                <p className="page-header-subtitle">ದಾಖಲೆಗಳು, ಪಾರಂಪರಿಕ ತಾಣಗಳು ಮತ್ತು ಪ್ರಕೃತಿಯ ಅಚ್ಚರಿಗಳು</p>
            </header>

            <div className="wonders-content">
                <div className="filter-bar">
                    {WONDER_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
                            onClick={() => setFilter(cat.id)}
                        >
                            <CatIcon iconKey={cat.iconKey} /> {cat.label}
                        </button>
                    ))}
                </div>

                <div className="wonders-grid">
                    {filtered.map((w) => {
                        const tag = CATEGORY_LABEL[w.category];
                        return (
                            <article key={w.id} className="wonder-card">
                                <div className="wonder-emoji"><DataIcon value={w.emoji} size={40} /></div>
                                <div className="wonder-body">
                                    <div className="wonder-head">
                                        <h3 className="wonder-title">{w.title}</h3>
                                        {tag && <span className={`wonder-tag ${tag.cls}`}>{tag.label}</span>}
                                    </div>
                                    <span className="wonder-title-en">{w.titleEn}</span>
                                    <div className="wonder-location"><MapPin size={13} /> {w.location}</div>
                                    <div className="wonder-wow"><Star size={14} /> {w.wow}</div>
                                    <p className="wonder-desc">{w.desc}</p>
                                    <div className="wonder-highlight"><Sparkles size={14} style={{ verticalAlign: "-2px" }} /> {w.highlight}</div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {filtered.length === 0 && (
                    <div className="no-results">
                        <div className="no-results-icon"><Search size={48} /></div>
                        <h3>ಯಾವುದೇ ಅದ್ಭುತಗಳಿಲ್ಲ</h3>
                        <p className="text-secondary">ಬೇರೆ ವರ್ಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wonders;
