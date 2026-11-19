import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, ArrowUp, ShieldCheck, WifiOff, Gift, Code2, Mail } from 'lucide-react';
import GitHubStar, { REPO_URL, GitHubMark } from './GitHubStar';
import { useLang } from '../lib/i18n';
import './Footer.css';

const Footer = () => {
    const { t } = useLang();

    const groups = [
        {
            title: t('ಕಲಿಕೆ', 'Learning'),
            links: [
                ['/learn', t('ಕಲಿಯಿರಿ', 'Learn')],
                ['/learn?tab=examples', t('ಉದಾಹರಣೆಗಳು', 'Examples')],
                ['/learn?tab=reference', t('ಕಾರ್ಯಗಳ ಉಲ್ಲೇಖ', 'Function reference')],
                ['/progress', t('ನನ್ನ ಕಲಿಕೆ', 'My learning')],
                ['/certificate', t('ಪ್ರಮಾಣಪತ್ರ', 'Certificate')],
            ],
        },
        {
            title: t('ಮಕ್ಕಳು ಮತ್ತು ಶಾಲೆ', 'Kids & schools'),
            links: [
                ['/kids', t('ಮಕ್ಕಳ ಕೋಡ್ ಲೋಕ', 'Kids zone')],
                ['/challenge', t('ಇಂದಿನ ಸವಾಲು', 'Daily challenge')],
                ['/games', t('ಆಟಗಳು', 'Games')],
                ['/teachers', t('ಶಿಕ್ಷಕರಿಗೆ', 'For teachers')],
                ['/class', t('ತರಗತಿ ಫಲಿತಾಂಶ', 'Class results')],
            ],
        },
        {
            title: t('ಕರ್ನಾಟಕ', 'Karnataka'),
            links: [
                ['/karnataka', t('ಕರ್ನಾಟಕ ಮುಖಪುಟ', 'Karnataka home')],
                ['/districts', t('ಜಿಲ್ಲೆಗಳು', 'Districts')],
                ['/wonders', t('ಅದ್ಭುತಗಳು', 'Wonders')],
                ['/schemes', t('ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', 'Government schemes')],
                ['/links', t('ಉಪಯುಕ್ತ ಲಿಂಕ್‌ಗಳು', 'Useful links')],
            ],
        },
        {
            title: t('ಯೋಜನೆ', 'Project'),
            links: [
                ['/about', t('ನಮ್ಮ ಬಗ್ಗೆ', 'About')],
                [`${REPO_URL}/blob/main/CONTRIBUTING.md`, t('ಕೊಡುಗೆ ನೀಡಿ', 'Contribute'), true],
                ['/privacy', t('ಗೌಪ್ಯತಾ ನೀತಿ', 'Privacy policy')],
                ['/terms', t('ಬಳಕೆಯ ನಿಯಮಗಳು', 'Terms of use')],
            ],
        },
    ];

    const trust = [
        [Gift, t('ಉಚಿತ', 'Free')],
        [ShieldCheck, t('ಲಾಗಿನ್ ಇಲ್ಲ', 'No login')],
        [WifiOff, t('ಆಫ್‌ಲೈನ್', 'Offline')],
        [Code2, t('ಮುಕ್ತ ಮೂಲ', 'Open source')],
    ];

    return (
        <footer className="footer">
            <div className="ft-main">
                <div className="ft-brand">
                    <NavLink to="/" className="ft-logo">
                        <img src="/images/logo.png" alt="" />
                        <span>ಕನ್ನಡ ಲಿಪಿ</span>
                    </NavLink>
                    <p>{t('ಕನ್ನಡಿಗರಿಗಾಗಿ, ಕನ್ನಡಿಗರಿಂದಲೇ ನಿರ್ಮಿಸಲ್ಪಟ್ಟ ಆಧುನಿಕ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ.', 'A modern programming language in Kannada, built by Kannadigas for Kannadigas.')}</p>
                    <ul className="ft-trust">
                        {trust.map(([Icon, label]) => <li key={label}><Icon size={14} aria-hidden="true" /> {label}</li>)}
                    </ul>
                    <div className="ft-social">
                        <GitHubStar />
                        <a className="ft-icon-link" href={REPO_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubMark size={18} /></a>
                        <a className="ft-icon-link" href="mailto:support@visionone7.in" aria-label={t('ಇಮೇಲ್', 'Email')}><Mail size={18} /></a>
                    </div>
                </div>

                <nav className="ft-links" aria-label={t('ಅಡಿಟಿಪ್ಪಣಿ ಲಿಂಕ್‌ಗಳು', 'Footer links')}>
                    {groups.map((g) => (
                        <div key={g.title} className="ft-col">
                            <h3>{g.title}</h3>
                            {g.links.map(([to, label, external]) => (external ? (
                                <a key={to} href={to} className="ft-link" target="_blank" rel="noopener noreferrer">{label}</a>
                            ) : (
                                <NavLink key={to} to={to} className="ft-link">{label}</NavLink>
                            )))}
                        </div>
                    ))}
                </nav>
            </div>

            <div className="ft-bottom">
                <p>&copy; {new Date().getFullYear()} {t('ಕನ್ನಡ ಲಿಪಿ', 'Kannada Lipi')} · <a href="https://www.visionone7.in" target="_blank" rel="noopener noreferrer">A VisionOne7 project</a></p>
                <p className="ft-love">Made with <Heart size={14} aria-label="love" /> for Karnataka · ಜೈ ಕರ್ನಾಟಕ</p>
                <button className="ft-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label={t('ಮೇಲಕ್ಕೆ ಹೋಗಿ', 'Back to top')}>
                    <ArrowUp size={18} />
                </button>
            </div>

            <div className="ft-watermark" aria-hidden="true">ಕನ್ನಡ ಲಿಪಿ</div>
        </footer>
    );
};

export default Footer;
