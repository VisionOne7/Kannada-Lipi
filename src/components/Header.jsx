import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { Link, Sparkles, Landmark, ChevronDown, HelpCircle, IndianRupee, MapPin, GraduationCap, Building2, Smile, Flame, Gamepad2, Sun, Moon, Map as MapIcon } from 'lucide-react';
import GitHubStar from './GitHubStar';
import InstallApp from './InstallApp';
import './Header.css';

const Header = () => {
    const [theme, setTheme] = useState(localStorage.getItem('kannadalipi_theme') || 'light');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

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
            <NavLink to="/challenge" className="nav-link" onClick={closeMenu}><Flame size={15} /> ಇಂದಿನ ಸವಾಲು</NavLink>
            <NavLink to="/games" className="nav-link" onClick={closeMenu}><Gamepad2 size={15} /> ಆಟಗಳು</NavLink>
        </>
    );
    const playActive = ['/challenge', '/games'].includes(location.pathname);
    const karnatakaActive = ['/karnataka', '/wonders', '/schemes', '/districts', '/economy', '/student-resources', '/services', '/quiz', '/links'].includes(location.pathname);

    const linkHome = <NavLink to="/" className="nav-link" onClick={closeMenu}>ಮುಖಪುಟ</NavLink>;
    const linkLearn = <NavLink to="/learn" className="nav-link" onClick={closeMenu}>ಕಲಿಯಿರಿ</NavLink>;
    const linkKids = <NavLink to="/kids" className="nav-link nav-link-kids" onClick={closeMenu}><Smile size={15} /> ಮಕ್ಕಳು</NavLink>;
    const linkExamples = <NavLink to="/examples" className="nav-link" onClick={closeMenu}>ಉದಾಹರಣೆಗಳು</NavLink>;
    const linkHelp = <NavLink to="/help" className="nav-link" onClick={closeMenu}>ಸಹಾಯ</NavLink>;

    // Mobile: flat list (the panel scrolls).
    const navLinksCoding = (
        <>
            {linkHome}{linkLearn}{linkKids}{playLinks}{linkExamples}{linkHelp}
        </>
    );

    // Desktop: challenge + games collapsed into a dropdown.
    const navLinksCodingDesktop = (
        <>
            {linkHome}{linkLearn}{linkKids}
            <div className="nav-dropdown">
                <button className={`nav-link nav-dropdown-trigger${playActive ? ' active' : ''}`}>
                    ಆಟ & ಸವಾಲು <ChevronDown size={14} className="nav-dropdown-caret" />
                </button>
                <div className="nav-dropdown-menu">
                    {playLinks}
                </div>
            </div>
            {linkExamples}{linkHelp}
        </>
    );

    // The 5 Karnataka-related pages — collapsed into a dropdown on desktop,
    // shown as a flat list on mobile (where the panel scrolls).
    const karnatakaLinks = (
        <>
            <NavLink to="/karnataka" className="nav-link nav-link-special" onClick={closeMenu}><MapIcon size={15} /> ಕರ್ನಾಟಕ ವೈಭವ</NavLink>
            <NavLink to="/wonders" className="nav-link nav-link-special" onClick={closeMenu}><Sparkles size={15} /> ಅದ್ಭುತಗಳು</NavLink>
            <NavLink to="/schemes" className="nav-link nav-link-special" onClick={closeMenu}><Landmark size={15} /> ಯೋಜನೆಗಳು</NavLink>
            <NavLink to="/districts" className="nav-link nav-link-special" onClick={closeMenu}><MapPin size={15} /> ಜಿಲ್ಲೆಗಳು</NavLink>
            <NavLink to="/economy" className="nav-link nav-link-special" onClick={closeMenu}><IndianRupee size={15} /> ಆರ್ಥಿಕತೆ</NavLink>
            <NavLink to="/student-resources" className="nav-link nav-link-special" onClick={closeMenu}><GraduationCap size={15} /> ವಿದ್ಯಾರ್ಥಿ</NavLink>
            <NavLink to="/services" className="nav-link nav-link-special" onClick={closeMenu}><Building2 size={15} /> ಇ-ಸೇವೆಗಳು</NavLink>
            <NavLink to="/quiz" className="nav-link nav-link-special" onClick={closeMenu}><HelpCircle size={15} /> ರಸಪ್ರಶ್ನೆ</NavLink>
            <NavLink to="/links" className="nav-link nav-link-special" onClick={closeMenu}><Link size={15} /> ಲಿಂಕ್‌ಗಳು</NavLink>
        </>
    );

    const navLinksGeneral = (
        <>
            {karnatakaLinks}
            <NavLink to="/about" className="nav-link" onClick={closeMenu}>ನಮ್ಮ ಬಗ್ಗೆ</NavLink>
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
                            <button className={`nav-link nav-dropdown-trigger${karnatakaActive ? ' active' : ''}`}>
                                ಕರ್ನಾಟಕ <ChevronDown size={14} className="nav-dropdown-caret" />
                            </button>
                            <div className="nav-dropdown-menu">
                                {karnatakaLinks}
                            </div>
                        </div>
                        <NavLink to="/about" className="nav-link" onClick={closeMenu}>ನಮ್ಮ ಬಗ್ಗೆ</NavLink>
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
                            <h4 className="mobile-nav-heading">ಕೋಡಿಂಗ್ (Coding)</h4>
                            {navLinksCoding}
                        </div>
                        <div className="mobile-nav-section">
                            <h4 className="mobile-nav-heading">ಇತರೆ (General)</h4>
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
