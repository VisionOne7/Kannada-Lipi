import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ArrowRight, Smile, Flame, Gamepad2, Sun, Moon, Compass } from 'lucide-react';
import { KARNATAKA_SECTIONS, KARNATAKA_PATHS } from '../data/karnatakaSections';
import GitHubStar from './GitHubStar';
import InstallApp from './InstallApp';
import { useLang } from '../lib/i18n';
import './Header.css';

const Header = () => {
    const [theme, setTheme] = useState(localStorage.getItem('kannadalipi_theme') || 'light');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const { lang, setLang, t } = useLang();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('kannadalipi_theme', theme);
    }, [theme]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Daily challenge + games share one menu entry so the header stays compact.
    const playLinks = (
        <>
            <NavLink to="/challenge" className="nav-link" onClick={closeMenu}><Flame size={15} /> {t('ಇಂದಿನ ಸವಾಲು', 'Daily challenge')}</NavLink>
            <NavLink to="/games" className="nav-link" onClick={closeMenu}><Gamepad2 size={15} /> {t('ಆಟಗಳು', 'Games')}</NavLink>
        </>
    );
    const playActive = ['/challenge', '/games'].includes(location.pathname);
    const karnatakaActive = KARNATAKA_PATHS.includes(location.pathname);

    const linkHome = <NavLink to="/" className="nav-link" onClick={closeMenu}>{t('ಮುಖಪುಟ', 'Home')}</NavLink>;
    const linkLearn = <NavLink to="/learn" className="nav-link" onClick={closeMenu}>{t('ಕಲಿಯಿರಿ', 'Learn')}</NavLink>;
    const linkKids = <NavLink to="/kids" className="nav-link nav-link-kids" onClick={closeMenu}><Smile size={15} /> {t('ಮಕ್ಕಳು', 'Kids')}</NavLink>;

    // Mobile: flat list (the panel scrolls).
    const navLinksCoding = (
        <>
            {linkHome}{linkLearn}{linkKids}{playLinks}
        </>
    );

    // Desktop: challenge + games collapsed into a dropdown.
    const navLinksCodingDesktop = (
        <>
            {linkHome}{linkLearn}{linkKids}
            <div className="nav-dropdown">
                <button className={`nav-link nav-dropdown-trigger${playActive ? ' active' : ''}`}>
                    {t('ಆಟ & ಸವಾಲು', 'Play')} <ChevronDown size={14} className="nav-dropdown-caret" />
                </button>
                <div className="nav-dropdown-menu">
                    {playLinks}
                </div>
            </div>
        </>
    );

    // Mobile: the Karnataka hub, then each section as a flat list.
    const karnatakaLinks = (
        <>
            <NavLink to="/karnataka" end className="nav-link nav-link-special" onClick={closeMenu}><Compass size={15} /> {t('ಕರ್ನಾಟಕ ಮುಖಪುಟ', 'Karnataka home')}</NavLink>
            {KARNATAKA_SECTIONS.map(({ id, path, icon: Icon, title, titleEn }) => (
                <NavLink key={id} to={path} className="nav-link nav-link-special" onClick={closeMenu}><Icon size={15} /> {t(title, titleEn)}</NavLink>
            ))}
        </>
    );

    // Leave the hover menu closed after a pick (focus would keep it open).
    const pickFromMenu = (e) => { closeMenu(); e.currentTarget.blur(); };

    const navLinksGeneral = (
        <>
            {karnatakaLinks}
            <NavLink to="/about" className="nav-link" onClick={closeMenu}>{t('ನಮ್ಮ ಬಗ್ಗೆ', 'About')}</NavLink>
        </>
    );

    return (
        <header className="header">
            <div className="header-content">
                <NavLink to="/" className="logo" onClick={closeMenu}>
                    <img src="/images/logo.png" alt="ಕನ್ನಡ ಲಿಪಿ" className="logo-img" />
                    <span className="logo-text">ಕನ್ನಡ ಲಿಪಿ</span>
                </NavLink>

                {/* Desktop nav — rendered inline. Karnataka pages live in a
                    dropdown so the bar never overflows. */}
                <nav className="nav nav-desktop">
                    <div className="nav-group nav-group-coding">
                        {navLinksCodingDesktop}
                    </div>
                    <div className="nav-divider"></div>
                    <div className="nav-group nav-group-general">
                        <div className="nav-dropdown">
                            <NavLink
                                to="/karnataka"
                                className={() => `nav-link nav-dropdown-trigger${karnatakaActive ? ' active' : ''}`}
                                onClick={closeMenu}
                            >
                                {t('ಕರ್ನಾಟಕ', 'Karnataka')} <ChevronDown size={14} className="nav-dropdown-caret" />
                            </NavLink>
                            <div className="nav-dropdown-menu nav-mega">
                                <div className="nav-mega-grid">
                                    {KARNATAKA_SECTIONS.map(({ id, path, icon: Icon, title, titleEn, desc, descEn }) => (
                                        <NavLink key={id} to={path} className="nav-mega-item" onClick={pickFromMenu}>
                                            <span className="nav-mega-icon"><Icon size={18} aria-hidden="true" /></span>
                                            <span className="nav-mega-text">
                                                <span className="nav-mega-title">{t(title, titleEn)}</span>
                                                <span className="nav-mega-desc">{t(desc, descEn)}</span>
                                            </span>
                                        </NavLink>
                                    ))}
                                </div>
                                <NavLink to="/karnataka" end className="nav-mega-all" onClick={pickFromMenu}>
                                    {t('ಕರ್ನಾಟಕ ವಿಭಾಗದ ಎಲ್ಲವನ್ನೂ ನೋಡಿ', 'See everything in Karnataka')} <ArrowRight size={15} aria-hidden="true" />
                                </NavLink>
                            </div>
                        </div>
                        <NavLink to="/about" className="nav-link" onClick={closeMenu}>{t('ನಮ್ಮ ಬಗ್ಗೆ', 'About')}</NavLink>
                    </div>
                </nav>

                <div className="header-actions">
                    <GitHubStar className="gh-star-header" />
                    <InstallApp />
                    <button
                        className={`hamburger-btn ${isMenuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>

                    <button
                        className="theme-btn lang-btn"
                        onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
                        title={lang === 'en' ? 'ಕನ್ನಡ ಇಂಟರ್ಫೇಸ್' : 'English interface'}
                        aria-label={lang === 'en' ? 'ಇಂಟರ್ಫೇಸ್ ಅನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಿಸಿ' : 'Switch interface to English'}
                    >
                        {lang === 'en' ? 'ಕ' : 'EN'}
                    </button>

                    <button
                        className="theme-btn"
                        onClick={toggleTheme}
                        title={theme === 'dark' ? 'ಬೆಳಕಿನ ಥೀಮ್' : 'ಕತ್ತಲೆ ಥೀಮ್'}
                        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </div>

            {/* Mobile nav — portaled to document.body to escape all stacking contexts */}
            {createPortal(
                <>
                    <div className={`nav-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
                    <nav className={`nav nav-mobile ${isMenuOpen ? 'nav-open' : ''}`} aria-label="ಮುಖ್ಯ ಮೆನು">
                        <GitHubStar />
                        <div className="mobile-nav-section">
                            <h4 className="mobile-nav-heading">{t('ಕೋಡಿಂಗ್', 'Coding')}</h4>
                            {navLinksCoding}
                        </div>
                        <div className="mobile-nav-section">
                            <h4 className="mobile-nav-heading">{t('ಇತರೆ', 'General')}</h4>
                            {navLinksGeneral}
                        </div>
                    </nav>
                </>,
                document.body
            )}
        </header>
    );
};

export default Header;
