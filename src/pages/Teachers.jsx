import React from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, Printer, Footprints, Clock, WifiOff, Award, BookOpen, Blocks, Map as MapIcon, Flame } from 'lucide-react';
import InstallApp from '../components/InstallApp';
import './Legal.css';
import './Teachers.css';
import PageHeader from '../components/PageHeader';

const TRACKS = [
    {
        grade: 'ತರಗತಿ ೩ – ೫',
        age: 'ವಯಸ್ಸು ೮–೧೦',
        focus: 'ಆಜ್ಞೆ, ಕ್ರಮ, ಲೂಪ್ ಎಂಬ ಕಲ್ಪನೆ',
        items: [
            { to: '/kids?mode=blocks', Icon: Blocks, text: 'ಬ್ಲಾಕ್ ಕೋಡಿಂಗ್: ಟೈಪಿಂಗ್ ಇಲ್ಲದೆ ಆಕಾರ ಬಿಡಿಸುವುದು' },
            { to: '/kids', Icon: MapIcon, text: 'ಆಮೆ ಸಾಹಸ ಹಂತ ೧–೬' },
        ],
        outcome: 'ಮಗು ೪–೬ ಆಜ್ಞೆಗಳ ಕ್ರಮ ಯೋಜಿಸಿ, ಲೂಪ್ ಬಳಸಿ ಚೌಕ ಬಿಡಿಸುತ್ತದೆ.',
    },
    {
        grade: 'ತರಗತಿ ೬ – ೮',
        age: 'ವಯಸ್ಸು ೧೧–೧೩',
        focus: 'ಟೈಪ್ ಮಾಡಿ ಕೋಡ್, ಕೋನಗಳು, ವೇರಿಯಬಲ್, ಷರತ್ತು',
        items: [
            { to: '/kids', Icon: MapIcon, text: 'ಆಮೆ ಸಾಹಸ ಹಂತ ೭–೧೨ (ಗಣಿತದ ಕೋನಗಳ ಜೊತೆ)' },
            { to: '/learn', Icon: BookOpen, text: 'ಕಲಿಯಿರಿ ಪಾಠ ೧–೧೦' },
            { to: '/challenge', Icon: Flame, text: 'ಇಂದಿನ ಸವಾಲು: ದಿನಕ್ಕೆ ೫ ನಿಮಿಷ' },
        ],
        outcome: 'ಮಗು ವೇರಿಯಬಲ್, ಆದರೆ ಮತ್ತು ಕಾರ್ಯ ಬಳಸಿ ಸಣ್ಣ ಪ್ರೋಗ್ರಾಂ ಬರೆಯುತ್ತದೆ.',
    },
    {
        grade: 'ತರಗತಿ ೯ – ೧೦',
        age: 'ವಯಸ್ಸು ೧೪–೧೬',
        focus: 'ಪಟ್ಟಿ, ನಿಘಂಟು, ಕಾರ್ಯಗಳು, ಸಮಸ್ಯೆ ಪರಿಹಾರ',
        items: [
            { to: '/learn', Icon: BookOpen, text: 'ಕಲಿಯಿರಿ ಪಾಠ ೧೧–೨೧' },
            { to: '/certificate', Icon: Award, text: 'ಪ್ರಮಾಣಪತ್ರ: ಎಲ್ಲಾ ೨೧ ಪಾಠಗಳ ನಂತರ' },
        ],
        outcome: 'ವಿದ್ಯಾರ್ಥಿ ಪೂರ್ಣ ಕೋರ್ಸ್ ಮುಗಿಸಿ, ತನ್ನದೇ ಯೋಜನೆ ಬರೆದು, ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯುತ್ತಾನೆ/ಳೆ.',
    },
];

const PLAN = [
    { min: '೫', title: 'ಮಾತು', text: 'ಆಮೆಗೆ ದಾರಿ ಹೇಳುವುದು ಎಂದರೆ ಏನು? ಕಂಪ್ಯೂಟರ್ ನಾವು ಹೇಳಿದ್ದನ್ನು ಮಾತ್ರ ಮಾಡುತ್ತದೆ.' },
    { min: '೧೦', title: 'ಮಾನವ ಆಮೆ ಆಟ', text: 'ಕಂಪ್ಯೂಟರ್ ಇಲ್ಲದೆ: ಒಬ್ಬ ಮಗು "ಆಮೆ", ಇತರರು ಆಜ್ಞೆ ಕೊಡುತ್ತಾರೆ (ಕೆಳಗೆ ನೋಡಿ).' },
    { min: '೨೦', title: 'ಕಂಪ್ಯೂಟರ್ ಸಮಯ', text: 'ಇಬ್ಬರು ಒಂದು ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ: ಒಬ್ಬರು ಟೈಪ್, ಒಬ್ಬರು ಯೋಜನೆ. ಹಂತ ೧–೫. ಪ್ರತಿ ಹಂತಕ್ಕೆ ಪಾತ್ರ ಬದಲಿಸಿ.' },
    { min: '೫', title: 'ಹಂಚಿಕೆ', text: 'ಯಾರು ಚೌಕ ಬಿಡಿಸಿದರು? ಯಾವ ತಪ್ಪು ಆಯಿತು, ಹೇಗೆ ಸರಿಪಡಿಸಿದಿರಿ?' },
];

const Teachers = () => (
    <>
    <PageHeader className="no-print" icon={GraduationCap} title="ಶಿಕ್ಷಕರಿಗೆ ಮಾರ್ಗದರ್ಶಿ" subtitle="Teachers' guide · ಶಾಲೆಯಲ್ಲಿ ಕನ್ನಡ ಲಿಪಿ ಬಳಸುವುದು ಹೇಗೆ" />
    <div className="legal-page teachers-page animate-in">

        <section className="glass-card legal-section no-print">
            <p>ಕನ್ನಡ ಲಿಪಿ ಉಚಿತ, ಲಾಗಿನ್ ಬೇಕಿಲ್ಲ, ಮತ್ತು ಮಕ್ಕಳ ಯಾವುದೇ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ. ರಾಷ್ಟ್ರೀಯ ಶಿಕ್ಷಣ ನೀತಿ ೨೦೨೦ ತರಗತಿ ೬ ರಿಂದ ಕೋಡಿಂಗ್ ಕಲಿಸಲು ಶಿಫಾರಸು ಮಾಡುತ್ತದೆ. ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಕಲಿತರೆ ಮಕ್ಕಳು ಭಾಷೆಯ ಬದಲು ತರ್ಕದ ಮೇಲೆ ಗಮನ ಕೊಡುತ್ತಾರೆ.</p>
            <p className="legal-en">Free, no login, and no personal data collected from children. NEP 2020 recommends coding from Class 6. Learning in the mother tongue lets children focus on logic instead of English.</p>
        </section>

        <section className="no-print">
            <h2 className="teachers-h2">ತರಗತಿವಾರು ಪಥ (Grade-wise tracks)</h2>
            <div className="track-grid">
                {TRACKS.map((t) => (
                    <article key={t.grade} className="glass-card track-card">
                        <div className="track-top">
                            <h3>{t.grade}</h3>
                            <span>{t.age}</span>
                        </div>
                        <p className="track-focus">{t.focus}</p>
                        <ul>
                            {t.items.map(({ to, Icon, text }) => (
                                <li key={text}><NavLink to={to}><Icon size={16} /> {text}</NavLink></li>
                            ))}
                        </ul>
                        <p className="track-outcome"><strong>ಕಲಿಕೆಯ ಫಲ:</strong> {t.outcome}</p>
                    </article>
                ))}
            </div>
        </section>

        <section className="glass-card legal-section no-print">
            <h2><Clock size={20} /> ಮಾದರಿ ೪೦ ನಿಮಿಷದ ಪಾಠ (Sample 40-minute period)</h2>
            <ol className="plan-list">
                {PLAN.map((p) => (
                    <li key={p.title}><span className="plan-min">{p.min} ನಿ.</span><div><strong>{p.title}</strong><p>{p.text}</p></div></li>
                ))}
            </ol>
        </section>

        <section className="glass-card legal-section">
            <div className="print-head">
                <h2><Footprints size={20} /> ಮಾನವ ಆಮೆ: ಕಂಪ್ಯೂಟರ್ ಇಲ್ಲದ ಚಟುವಟಿಕೆ</h2>
                <button type="button" className="btn btn-secondary no-print" onClick={() => window.print()}>
                    <Printer size={16} /> ವರ್ಕ್‌ಶೀಟ್ ಮುದ್ರಿಸಿ
                </button>
            </div>
            <p>ಕಂಪ್ಯೂಟರ್ ಇಲ್ಲದ ಶಾಲೆಗಳಿಗೂ ಇದು ಸೂಕ್ತ. ನೆಲದ ಮೇಲೆ ಸೀಮೆಸುಣ್ಣದಿಂದ ೫×೫ ಚೌಕಗಳ ಜಾಲ ಬರೆಯಿರಿ. ಒಂದು ಚೌಕದಲ್ಲಿ "ಮಾವು" ಇಡಿ.</p>
            <ol className="legal-list">
                <li>ಒಬ್ಬ ಮಗು <strong>ಆಮೆ</strong>. ಅದು ಕೇಳಿದ ಆಜ್ಞೆಯನ್ನು ಮಾತ್ರ ಮಾಡುತ್ತದೆ.</li>
                <li>ತಂಡ ಕಾಗದದ ಮೇಲೆ ಆಜ್ಞೆ ಬರೆಯುತ್ತದೆ: <code>ಮುಂದೆ(೧)</code>, <code>ಬಲಕ್ಕೆ(೯೦)</code>, <code>ಎಡಕ್ಕೆ(೯೦)</code>.</li>
                <li>ಒಬ್ಬರು ಆಜ್ಞೆ ಓದುತ್ತಾರೆ, ಆಮೆ ನಡೆಯುತ್ತದೆ. ಮಾವು ತಲುಪದಿದ್ದರೆ ತಂಡ "ಡಿಬಗ್" ಮಾಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸುತ್ತದೆ.</li>
                <li>ಸವಾಲು: ಒಂದೇ ಆಜ್ಞೆ ೪ ಬಾರಿ ಬಂದರೆ <code>ಪುನರಾವರ್ತನೆ</code> ಬಳಸಿ ಚಿಕ್ಕದಾಗಿ ಬರೆಯಿರಿ.</li>
            </ol>
            <div className="worksheet">
                <h3>ವರ್ಕ್‌ಶೀಟ್: ಆಮೆಯ ದಾರಿ</h3>
                <p>ಹೆಸರು: ____________________ &nbsp; ತರಗತಿ: ______ &nbsp; ದಿನಾಂಕ: __________</p>
                <div className="ws-grid" aria-hidden="true">
                    {Array.from({ length: 25 }, (_, i) => (
                        <div key={i} className="ws-cell">{i === 20 ? 'ಆಮೆ' : i === 4 ? 'ಮಾವು' : ''}</div>
                    ))}
                </div>
                <p>೧. ಆಮೆ ಮೇಲಕ್ಕೆ ಮುಖ ಮಾಡಿದೆ. ಮಾವಿಗೆ ತಲುಪಲು ಆಜ್ಞೆಗಳನ್ನು ಬರೆಯಿರಿ:</p>
                <div className="ws-lines">{Array.from({ length: 5 }, (_, i) => <div key={i} />)}</div>
                <p>೨. ಚೌಕ ಬಿಡಿಸಲು ಆಮೆ ಪ್ರತಿ ಮೂಲೆಯಲ್ಲಿ ಎಷ್ಟು ಡಿಗ್ರಿ ತಿರುಗಬೇಕು? ______</p>
                <p>೩. ತ್ರಿಕೋನಕ್ಕೆ? ______ &nbsp; ಸುಳಿವು: ೩೬೦ ÷ ಬದಿಗಳ ಸಂಖ್ಯೆ</p>
            </div>
        </section>

        <section className="glass-card legal-section no-print">
            <h2><WifiOff size={20} /> ಕಂಪ್ಯೂಟರ್ ಲ್ಯಾಬ್ ಸಿದ್ಧತೆ (Lab setup)</h2>
            <ol className="legal-list">
                <li>ಪ್ರತಿ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ Chrome ಅಥವಾ Edge ನಲ್ಲಿ k-lipi.in ತೆರೆಯಿರಿ.</li>
                <li>ಕೆಳಗಿನ "ಆ್ಯಪ್ ಸ್ಥಾಪಿಸಿ" ಬಟನ್ ಒತ್ತಿ (ಹೆಡರ್‌ನಲ್ಲಿರುವ ಕಂಪ್ಯೂಟರ್ ಚಿಹ್ನೆಯೂ ಅದೇ ಕೆಲಸ ಮಾಡುತ್ತದೆ). ನಂತರ ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆಯೂ ಕೋಡಿಂಗ್, ಪಾಠಗಳು ಮತ್ತು ಆಮೆ ಹಂತಗಳು ಕೆಲಸ ಮಾಡುತ್ತವೆ.</li>
                <li>ಮಕ್ಕಳ ಪ್ರಗತಿ ಆಯಾ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲೇ ಉಳಿಯುತ್ತದೆ. ಪ್ರತಿ ಬಾರಿ ಒಂದೇ ಮಗು ಒಂದೇ ಕಂಪ್ಯೂಟರ್ ಬಳಸಿದರೆ ಉತ್ತಮ.</li>
                <li>ವಿದ್ಯಾರ್ಥಿಗಳು ತಮ್ಮ ಕೋಡ್ ಅನ್ನು "ಉಳಿಸಿ" ಬಟನ್‌ನಿಂದ .kl ಫೈಲ್ ಆಗಿ ಪೆನ್‌ಡ್ರೈವ್‌ಗೆ ತೆಗೆದುಕೊಳ್ಳಬಹುದು.</li>
            </ol>
            <div className="install-row"><InstallApp variant="full" /></div>
            <p className="legal-en">Open k-lipi.in in Chrome or Edge and press "Install app". Coding, lessons and turtle levels then work offline. Progress stays on each computer.</p>
        </section>
    </div>
    </>
);

export default Teachers;
