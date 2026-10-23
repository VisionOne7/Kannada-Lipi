import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { KARNATAKA_SECTIONS } from '../data/karnatakaSections';
import './KarnatakaCard.css';

// Section bar on every Karnataka page, so the other pages are one tap away.
const KarnatakaNav = () => (
    <nav className="kn-bar" aria-label="ಕರ್ನಾಟಕ ವಿಭಾಗ">
        <div className="kn-bar-inner">
            <NavLink to="/karnataka" end className="kn-chip kn-chip-home">
                <Compass size={15} aria-hidden="true" /> ಕರ್ನಾಟಕ
            </NavLink>
            <span className="kn-sep" aria-hidden="true" />
            {KARNATAKA_SECTIONS.map(({ id, path, icon: Icon, title }) => (
                <NavLink key={id} to={path} className="kn-chip">
                    <Icon size={14} aria-hidden="true" /> {title}
                </NavLink>
            ))}
        </div>
    </nav>
);

export default KarnatakaNav;
