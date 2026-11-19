import { NavLink } from 'react-router-dom';
import { Search, House, BookOpen, Smile, Compass } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { UI_EVENTS, emit } from '../lib/ui';
import './NotFound.css';

// The K-Lipi turtle has wandered off its path.
const LostTurtle = () => (
    <svg className="nf-art" viewBox="0 0 320 180" aria-hidden="true">
        <path className="nf-path" d="M20 150 C 70 150, 70 60, 120 70 S 190 150, 230 100 S 260 40, 290 50" />
        <text x="292" y="40" className="nf-q">?</text>
        <g transform="translate(230 100) rotate(-35)">
            <ellipse cx="0" cy="-17" rx="5" ry="6" fill="#3F8F3A" />
            <ellipse cx="-10" cy="-8" rx="4" ry="3" fill="#3F8F3A" /><ellipse cx="10" cy="-8" rx="4" ry="3" fill="#3F8F3A" />
            <ellipse cx="-10" cy="8" rx="4" ry="3" fill="#3F8F3A" /><ellipse cx="10" cy="8" rx="4" ry="3" fill="#3F8F3A" />
            <ellipse cx="0" cy="0" rx="10" ry="12.5" fill="#FFD700" stroke="#D71920" strokeWidth="2.4" />
            <path d="M0 -12.5 V12.5 M-10 0 H10" stroke="rgba(215,25,32,0.55)" strokeWidth="1.4" />
        </g>
    </svg>
);

const NotFound = () => {
    const { t } = useLang();
    const links = [
        ['/', House, t('ಮುಖಪುಟ', 'Home')],
        ['/learn', BookOpen, t('ಕಲಿಯಿರಿ', 'Learn')],
        ['/kids', Smile, t('ಮಕ್ಕಳು', 'Kids')],
        ['/karnataka', Compass, t('ಕರ್ನಾಟಕ', 'Karnataka')],
    ];
    return (
        <div className="notfound-page animate-in">
            <LostTurtle />
            <div className="notfound-code">404</div>
            <h1>{t('ಅಯ್ಯೋ! ಆಮೆ ದಾರಿ ತಪ್ಪಿದೆ', 'Oops! The turtle lost its way')}</h1>
            <p className="notfound-msg">
                {t('ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಟ ಇಲ್ಲಿ ಇಲ್ಲ. ಹುಡುಕಿ, ಅಥವಾ ಕೆಳಗಿನ ಯಾವುದಾದರೂ ಕಡೆ ಹೋಗಿ.', "The page you're looking for isn't here. Search, or pick a place below.")}
            </p>
            <button className="btn btn-primary nf-search" onClick={() => emit(UI_EVENTS.openPalette)}>
                <Search size={17} /> {t('ಹುಡುಕಿ', 'Search')} <kbd>Ctrl K</kbd>
            </button>
            <nav className="notfound-actions" aria-label={t('ಮುಖ್ಯ ಪುಟಗಳು', 'Main pages')}>
                {links.map(([to, Icon, label]) => (
                    <NavLink key={to} to={to} className="nf-link"><Icon size={18} /> {label}</NavLink>
                ))}
            </nav>
        </div>
    );
};

export default NotFound;
