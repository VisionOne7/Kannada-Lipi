import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, HardDrive, Globe, Baby, Trash2, Mail, CheckCircle2 } from 'lucide-react';
import './Legal.css';
import PageHeader from '../components/PageHeader';

const UPDATED = '೨೨ ಅಕ್ಟೋಬರ್ ೨೦೨೬ (22 October 2026)';

// Everything this site keeps in the browser. Used for the table and the
// "delete my data" button, so the two never drift apart.
export const LOCAL_KEYS = [
    { key: 'kannadalipi_learning', kn: 'ಪಾಠಗಳ ಪ್ರಗತಿ', en: 'Lesson progress' },
    { key: 'kl_kids_levels', kn: 'ಮಕ್ಕಳ ಆಮೆ ಹಂತಗಳ ಪ್ರಗತಿ', en: 'Kids turtle level progress' },
    { key: 'kl_kids_draw', kn: 'ಚಿತ್ರ ಮೈದಾನದ ಕೋಡ್', en: 'Drawing playground code' },
    { key: 'kl_blocks_ws', kn: 'ಬ್ಲಾಕ್ ಕೋಡಿಂಗ್ ಕಾರ್ಯಕ್ಷೇತ್ರ', en: 'Block coding workspace' },
    { key: 'kl_challenge_streak', kn: 'ಇಂದಿನ ಸವಾಲು ಸರಣಿ', en: 'Daily challenge streak' },
    { key: 'kl_challenge_last', kn: 'ಕೊನೆಯ ಸವಾಲಿನ ದಿನಾಂಕ', en: 'Last challenge date' },
    { key: 'kl_cert_name', kn: 'ಪ್ರಮಾಣಪತ್ರದ ಹೆಸರು', en: 'Name typed on the certificate' },
    { key: 'kannadalipi_theme', kn: 'ಬೆಳಕು / ಕತ್ತಲೆ ಥೀಮ್', en: 'Light or dark theme' },
    { key: 'kl_translit', kn: 'EN→ಕ ಟೈಪಿಂಗ್ ಆನ್/ಆಫ್', en: 'Transliteration on/off' },
    { key: 'kl_turtle_speed', kn: 'ಆಮೆ ವೇಗ', en: 'Turtle animation speed' },
    { key: 'kl_gh_stars', kn: 'GitHub ನಕ್ಷತ್ರಗಳ ಸಂಖ್ಯೆಯ ಪ್ರತಿ', en: 'Cached GitHub star count' },
    { key: 'kannadalipi_code', kn: 'ತಾತ್ಕಾಲಿಕ ಕೋಡ್', en: 'Temporary editor code' },
];
const SESSION_KEYS = ['kl_counted_session'];
// Left over from the old visitor counter; still cleared by "delete my data".
const LEGACY_KEYS = ['kl_visits_cached'];

const Privacy = () => {
    const [cleared, setCleared] = useState(false);

    const clearAll = () => {
        if (!window.confirm('ಈ ಸಾಧನದಲ್ಲಿರುವ ನಿಮ್ಮ ಎಲ್ಲಾ ಕನ್ನಡ ಲಿಪಿ ಪ್ರಗತಿ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಅಳಿಸಬೇಕೇ? ಇದನ್ನು ಹಿಂಪಡೆಯಲು ಆಗುವುದಿಲ್ಲ.')) return;
        try {
            LOCAL_KEYS.forEach(({ key }) => localStorage.removeItem(key));
            LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
            SESSION_KEYS.forEach((key) => sessionStorage.removeItem(key));
        } catch { /* storage blocked: nothing stored anyway */ }
        setCleared(true);
    };

    return (
        <>
        <PageHeader icon={ShieldCheck} title="ಗೌಪ್ಯತಾ ನೀತಿ" subtitle={`Privacy Policy · ಕೊನೆಯ ನವೀಕರಣ: ${UPDATED}`} />
        <div className="legal-page animate-in">

            <section className="glass-card legal-summary">
                <h2>ಸಂಕ್ಷಿಪ್ತವಾಗಿ (In short)</h2>
                <ul className="legal-checks">
                    <li><CheckCircle2 size={18} /> ಖಾತೆ ಅಥವಾ ಲಾಗಿನ್ ಇಲ್ಲ. ನಾವು ನಿಮ್ಮ ಹೆಸರು, ಇಮೇಲ್ ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆ ಕೇಳುವುದಿಲ್ಲ. <span>No accounts. We never ask for your name, email or phone.</span></li>
                    <li><CheckCircle2 size={18} /> ನಿಮ್ಮ ಕೋಡ್ ಮತ್ತು ಪ್ರಗತಿ ನಿಮ್ಮ ಸಾಧನದ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಉಳಿಯುತ್ತದೆ. ನಮ್ಮ ಸರ್ವರ್‌ಗೆ ಹೋಗುವುದಿಲ್ಲ. <span>Your code and progress stay in your browser. They are not sent to our servers.</span></li>
                    <li><CheckCircle2 size={18} /> ಜಾಹೀರಾತು ಇಲ್ಲ, ಟ್ರ್ಯಾಕಿಂಗ್ ಕುಕೀಗಳಿಲ್ಲ, ಡೇಟಾ ಮಾರಾಟ ಇಲ್ಲ. <span>No ads, no tracking cookies, no selling of data.</span></li>
                    <li><CheckCircle2 size={18} /> ಮಕ್ಕಳು ಸುರಕ್ಷಿತವಾಗಿ ಬಳಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ. <span>Designed to be safe for children.</span></li>
                </ul>
            </section>

            <section className="glass-card legal-section">
                <h2><HardDrive size={20} /> ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಉಳಿಯುವ ಮಾಹಿತಿ</h2>
                <p>ಕನ್ನಡ ಲಿಪಿ ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನ localStorage ನಲ್ಲಿ ಕೆಳಗಿನವುಗಳನ್ನು ಮಾತ್ರ ಉಳಿಸುತ್ತದೆ, ಇದರಿಂದ ಮುಂದಿನ ಬಾರಿ ನೀವು ಬಿಟ್ಟಲ್ಲಿಂದ ಮುಂದುವರಿಸಬಹುದು. ಈ ಮಾಹಿತಿ ನಿಮ್ಮ ಸಾಧನವನ್ನು ಬಿಟ್ಟು ಹೋಗುವುದಿಲ್ಲ.</p>
                <p className="legal-en">We store only the items below in your browser's localStorage so you can continue where you left off. This data never leaves your device.</p>
                <div className="legal-table-wrap">
                    <table className="legal-table">
                        <thead><tr><th>ಏನು (What)</th><th>ಕೀ (Key)</th></tr></thead>
                        <tbody>
                            {LOCAL_KEYS.map((k) => (
                                <tr key={k.key}><td>{k.kn}<span className="legal-en-inline">{k.en}</span></td><td><code>{k.key}</code></td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p>ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ಆಮೆ ಚಿತ್ರಗಳು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ತಯಾರಾಗುತ್ತವೆ. ನೀವು ಹಂಚಿಕೊಳ್ಳುವವರೆಗೆ ಅವು ಎಲ್ಲಿಗೂ ಕಳುಹಿಸಲ್ಪಡುವುದಿಲ್ಲ.</p>
                <p className="legal-en">Certificates and turtle drawings are created inside your browser. They are not uploaded anywhere unless you choose to share them.</p>

                <div className="legal-delete">
                    {cleared ? (
                        <p className="legal-done"><CheckCircle2 size={18} /> ಅಳಿಸಲಾಗಿದೆ. ಈ ಸಾಧನದಲ್ಲಿ ಈಗ ಯಾವುದೇ ಕನ್ನಡ ಲಿಪಿ ಡೇಟಾ ಇಲ್ಲ. <span>Deleted.</span></p>
                    ) : (
                        <button type="button" className="btn btn-secondary" onClick={clearAll}>
                            <Trash2 size={16} /> ನನ್ನ ಡೇಟಾ ಅಳಿಸಿ (Delete my data)
                        </button>
                    )}
                </div>
            </section>

            <section className="glass-card legal-section">
                <h2><Globe size={20} /> ಇತರ ಸೇವೆಗಳು (Third-party services)</h2>
                <p>ಸೈಟ್ ಕೆಲಸ ಮಾಡಲು ಕೆಲವು ಹೊರಗಿನ ಸೇವೆಗಳನ್ನು ಬಳಸುತ್ತೇವೆ. ಇಂಟರ್ನೆಟ್‌ನ ಸಾಮಾನ್ಯ ನಿಯಮದಂತೆ, ಅವು ನಿಮ್ಮ IP ವಿಳಾಸ ಮತ್ತು ಬ್ರೌಸರ್ ಮಾಹಿತಿಯನ್ನು ನೋಡಬಹುದು.</p>
                <p className="legal-en">The site relies on a few outside services. As with any website, they can see your IP address and basic browser details.</p>
                <ul className="legal-list">
                    <li><strong>Vercel</strong> ವೆಬ್‌ಸೈಟ್ ಅನ್ನು ಹೋಸ್ಟ್ ಮಾಡುತ್ತದೆ ಮತ್ತು ಸುರಕ್ಷತೆಗಾಗಿ ಸಾಮಾನ್ಯ ಸರ್ವರ್ ಲಾಗ್‌ಗಳನ್ನು ಇಡಬಹುದು. <span>Hosts the website and may keep standard server logs for security.</span></li>
                    <li><strong>Google Fonts</strong> ಅಕ್ಷರಶೈಲಿಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ. <span>Serves the fonts.</span></li>
                    <li><strong>Google Input Tools</strong> ನೀವು "EN→ಕ" ಆನ್ ಮಾಡಿದಾಗ ಮಾತ್ರ ಬಳಕೆಯಾಗುತ್ತದೆ. ಆಗ ನೀವು ಟೈಪ್ ಮಾಡುವ ಇಂಗ್ಲಿಷ್ ಪದಗಳು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಗಲು Google ಗೆ ಹೋಗುತ್ತವೆ. ಅದು ಡೀಫಾಲ್ಟ್ ಆಗಿ ಆಫ್ ಇರುತ್ತದೆ. <span>Used only when you switch on "EN→ಕ". The English words you type are then sent to Google to be converted. It is off by default.</span></li>
                    <li><strong>GitHub</strong> ಹೆಡರ್‌ನಲ್ಲಿರುವ ನಕ್ಷತ್ರಗಳ (stars) ಸಂಖ್ಯೆಯನ್ನು ಒದಗಿಸುತ್ತದೆ. ಗಂಟೆಗೆ ಒಮ್ಮೆ ಮಾತ್ರ ಕೇಳಲಾಗುತ್ತದೆ, ನಿಮ್ಮ ಬಗ್ಗೆ ಯಾವುದೇ ಮಾಹಿತಿ ಕಳುಹಿಸುವುದಿಲ್ಲ. <span>Provides the star count shown in the header. It is fetched at most once an hour, and nothing about you is sent.</span></li>
                </ul>
                <p>ಕರ್ನಾಟಕ ಮಾಹಿತಿ ಪುಟಗಳಲ್ಲಿರುವ ಹೊರಗಿನ ಲಿಂಕ್‌ಗಳು ಬೇರೆ ಸೈಟ್‌ಗಳಿಗೆ ಕರೆದೊಯ್ಯುತ್ತವೆ. ಅವುಗಳ ಗೌಪ್ಯತಾ ನೀತಿಗಳು ಬೇರೆ.</p>
                <p className="legal-en">External links on the Karnataka pages take you to other websites, which have their own privacy policies.</p>
            </section>

            <section className="glass-card legal-section">
                <h2><Baby size={20} /> ಮಕ್ಕಳ ಗೌಪ್ಯತೆ (Children)</h2>
                <p>ಕನ್ನಡ ಲಿಪಿಯನ್ನು ಶಾಲಾ ಮಕ್ಕಳು ಬಳಸುತ್ತಾರೆ. ಆದ್ದರಿಂದ ನಾವು ಯಾರಿಂದಲೂ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ, ಮಕ್ಕಳ ವರ್ತನೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುವುದಿಲ್ಲ ಮತ್ತು ಅವರಿಗೆ ಜಾಹೀರಾತು ತೋರಿಸುವುದಿಲ್ಲ. ಇದು ಭಾರತದ ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಕಾಯ್ದೆ ೨೦೨೩ (DPDP Act) ರ ಮಕ್ಕಳ ರಕ್ಷಣೆಯ ಆಶಯಕ್ಕೆ ಅನುಗುಣವಾಗಿದೆ.</p>
                <p className="legal-en">KannadaLipi is used by school children. We collect no personal data from anyone, do not track children's behaviour and show them no ads, in line with the child-protection intent of India's Digital Personal Data Protection Act, 2023.</p>
                <p>ಪ್ರಮಾಣಪತ್ರದಲ್ಲಿ ಮಗು ಟೈಪ್ ಮಾಡುವ ಹೆಸರು ಅದೇ ಸಾಧನದಲ್ಲಿ ಉಳಿಯುತ್ತದೆ. ಪ್ರಮಾಣಪತ್ರವನ್ನು ಸಾಮಾಜಿಕ ಜಾಲತಾಣದಲ್ಲಿ ಹಂಚುವ ಮೊದಲು ಪೋಷಕರು ಅಥವಾ ಶಿಕ್ಷಕರ ಅನುಮತಿ ಪಡೆಯಲು ಸಲಹೆ ನೀಡುತ್ತೇವೆ.</p>
                <p className="legal-en">The name a child types on a certificate stays on that device. We recommend children ask a parent or teacher before sharing a certificate on social media.</p>
            </section>

            <section className="glass-card legal-section">
                <h2><Mail size={20} /> ಬದಲಾವಣೆಗಳು ಮತ್ತು ಸಂಪರ್ಕ</h2>
                <p>ಈ ನೀತಿ ಬದಲಾದರೆ, ಮೇಲಿನ ದಿನಾಂಕವನ್ನು ನವೀಕರಿಸುತ್ತೇವೆ. ಪ್ರಶ್ನೆಗಳಿದ್ದರೆ <a href="mailto:support@visionone7.in">support@visionone7.in</a> ಗೆ ಬರೆಯಿರಿ.</p>
                <p className="legal-en">If this policy changes, we will update the date above. Questions? Write to <a href="mailto:support@visionone7.in">support@visionone7.in</a>.</p>
                <p className="legal-crosslink">ಬಳಕೆಯ ನಿಯಮಗಳನ್ನೂ ಓದಿ: <NavLink to="/terms">Terms of Use</NavLink></p>
            </section>
        </div>
        </>
    );
};

export default Privacy;
