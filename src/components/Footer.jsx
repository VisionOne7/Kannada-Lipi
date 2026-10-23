import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useLang } from '../lib/i18n';
import './Footer.css';

const Footer = () => {
    const { t } = useLang();
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <NavLink to="/" className="footer-logo">
                        <img src="/images/logo.png" alt="ಕನ್ನಡ ಲಿಪಿ" />
                        <span>ಕನ್ನಡ ಲಿಪಿ</span>
                    </NavLink>
                    <p className="text-secondary" style={{ maxWidth: '300px', fontSize: '0.85rem' }}>
                        {t('ಕನ್ನಡಿಗರಿಗಾಗಿ, ಕನ್ನಡಿಗರಿಂದಲೇ ನಿರ್ಮಿಸಲ್ಪಟ್ಟ ಆಧುನಿಕ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ.', 'A modern programming language in Kannada, built by Kannadigas for Kannadigas.')}
                    </p>
                </div>

                <div className="footer-links">
                    <div className="footer-column">
                        <h4>{t('ಪರಿಶೋಧಿಸಿ', 'Explore')}</h4>
                        <NavLink to="/learn" className="footer-link">{t('ಕಲಿಯಿರಿ', 'Learn')}</NavLink>
                        <NavLink to="/kids" className="footer-link">{t('ಮಕ್ಕಳ ಕೋಡ್ ಲೋಕ', 'Kids zone')}</NavLink>
                        <NavLink to="/learn?tab=examples" className="footer-link">{t('ಉದಾಹರಣೆಗಳು', 'Examples')}</NavLink>
                        <NavLink to="/karnataka" className="footer-link">{t('ಕರ್ನಾಟಕ', 'Karnataka')}</NavLink>
                        <NavLink to="/links" className="footer-link">{t('ಲಿಂಕ್‌ಗಳು', 'Links')}</NavLink>
                    </div>
                    <div className="footer-column">
                        <h4>{t('ಸಹಾಯ', 'Help')}</h4>
                        <NavLink to="/learn?tab=reference" className="footer-link">{t('ಕಾರ್ಯಗಳ ಉಲ್ಲೇಖ', 'Function reference')}</NavLink>
                        <NavLink to="/teachers" className="footer-link">{t('ಶಿಕ್ಷಕರಿಗೆ', 'For teachers')}</NavLink>
                        <NavLink to="/about" className="footer-link">{t('ನಮ್ಮ ಬಗ್ಗೆ', 'About')}</NavLink>
                    </div>
                    <div className="footer-column">
                        <h4>{t('ಕಾನೂನು', 'Legal')}</h4>
                        <NavLink to="/privacy" className="footer-link">{t('ಗೌಪ್ಯತಾ ನೀತಿ', 'Privacy policy')}</NavLink>
                        <NavLink to="/terms" className="footer-link">{t('ಬಳಕೆಯ ನಿಯಮಗಳು', 'Terms of use')}</NavLink>
                    </div>
                    <div className="footer-column">
                        <h4>{t('ಸಂಪರ್ಕಿಸಿ', 'Contact')}</h4>
                        <a href="mailto:support@visionone7.in" className="footer-link">support@visionone7.in</a>
                        <a href="https://www.visionone7.in" className="footer-link" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', opacity: 0.8 }}>A VisionOne7 project</a>
                        <a href="https://github.com/VisionOne7/Kannada-Lipi" className="footer-link" target="_blank" rel="noopener noreferrer">GitHub</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} {t('ಕನ್ನಡ ಲಿಪಿ - ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.', 'Kannada Lipi. All rights reserved.')}</p>
                <p style={{ marginTop: '8px', fontSize: '0.75rem', opacity: 0.6 }}>Made with <Heart size={14} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--error, #e53e3e)', fill: 'var(--error, #e53e3e)' }} /> for Karnataka</p>
            </div>
        </footer>
    );
};

export default Footer;
