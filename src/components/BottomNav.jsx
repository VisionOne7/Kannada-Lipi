import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { House, BookOpen, Smile, Compass, Ellipsis } from 'lucide-react';
import { KARNATAKA_PATHS } from '../data/karnatakaSections';
import { UI_EVENTS, emit } from '../lib/ui';
import { useLang } from '../lib/i18n';
import './BottomNav.css';

// App-style tab bar for phones. "More" opens the full menu.
const BottomNav = () => {
    const { t } = useLang();
    const { pathname } = useLocation();
    const tabs = [
        { to: '/', Icon: House, label: t('ಮುಖಪುಟ', 'Home'), active: pathname === '/' },
        { to: '/learn', Icon: BookOpen, label: t('ಕಲಿಯಿರಿ', 'Learn'), active: pathname === '/learn' || pathname === '/progress' },
        { to: '/kids', Icon: Smile, label: t('ಮಕ್ಕಳು', 'Kids'), active: pathname === '/kids' },
        { to: '/karnataka', Icon: Compass, label: t('ಕರ್ನಾಟಕ', 'Karnataka'), active: KARNATAKA_PATHS.includes(pathname) },
    ];
    return (
        <nav className="bottom-nav" aria-label={t('ಮುಖ್ಯ ವಿಭಾಗಗಳು', 'Main sections')}>
            {tabs.map(({ to, Icon, label, active }) => (
                <NavLink key={to} to={to} className={`bn-tab${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined}>
                    <span className="bn-icon"><Icon size={22} aria-hidden="true" /></span>
                    <span className="bn-label">{label}</span>
                </NavLink>
            ))}
            <button type="button" className="bn-tab" onClick={() => emit(UI_EVENTS.openMenu)}>
                <span className="bn-icon"><Ellipsis size={22} aria-hidden="true" /></span>
                <span className="bn-label">{t('ಇನ್ನಷ್ಟು', 'More')}</span>
            </button>
        </nav>
    );
};

export default BottomNav;
