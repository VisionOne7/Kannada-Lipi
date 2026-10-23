import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../lib/i18n';
import './KarnatakaCard.css';

// One Karnataka section as a card (hub page and home page).
const KarnatakaCard = ({ section, stat, featured = false }) => {
    const { t, lang } = useLang();
    const { path, icon: Icon, title, titleEn, desc, descEn } = section;
    return (
        <NavLink to={path} className={`kc-card${featured ? ' kc-featured' : ''}`}>
            <span className="kc-icon"><Icon size={featured ? 26 : 22} aria-hidden="true" /></span>
            <span className="kc-title">{t(title, titleEn)}{lang !== 'en' && <span>{titleEn}</span>}</span>
            <span className="kc-desc">{t(desc, descEn)}</span>
            <span className="kc-foot">
                {stat ? <span className="kc-stat">{stat}</span> : <span />}
                <ArrowRight size={16} className="kc-arrow" aria-hidden="true" />
            </span>
        </NavLink>
    );
};

export default KarnatakaCard;
