import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, HelpCircle, Code2, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import KarnatakaCard from '../components/KarnatakaCard';
import { KARNATAKA_SECTIONS } from '../data/karnatakaSections';
import { DISTRICTS } from '../data/districtStats';
import { WONDERS } from '../data/wonders';
import { SCHEMES } from '../data/schemes';
import { ESERVICES } from '../data/eServices';
import { STUDENT_RESOURCES } from '../data/studentResources';
import { useLang } from '../lib/i18n';
import './KarnatakaHub.css';

const KN_DIGITS = ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'];
const kn = (num) => String(num).replace(/[0-9]/g, (d) => KN_DIGITS[d]);

const FACTS = [
    { label: 'ರಾಜಧಾನಿ', en: 'Capital', value: 'ಬೆಂಗಳೂರು', valueEn: 'Bengaluru' },
    { label: 'ರಚನೆ', en: 'Formed', value: '೧ ನವೆಂಬರ್ ೧೯೫೬', valueEn: '1 November 1956' },
    { label: 'ಜಿಲ್ಲೆಗಳು', en: 'Districts', value: '೩೧', valueEn: '31' },
    { label: 'ವಿಸ್ತೀರ್ಣ', en: 'Area', value: '೧,೯೧,೭೯೧ ಚ.ಕಿ.ಮೀ', valueEn: '1,91,791 sq km' },
    { label: 'ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿಗಳು', en: 'Jnanpith awards', value: '೮', valueEn: '8' },
];

// Counted from the data each page shows
const STATS = {
    culture: (n) => [`${n(16)} ವಿಷಯಗಳು`, `${n(16)} topics`],
    districts: (n) => [`${n(DISTRICTS.length)} ಜಿಲ್ಲೆಗಳ ಅಂಕಿಅಂಶ`, `${n(DISTRICTS.length)} district profiles`],
    wonders: (n) => [`${n(WONDERS.length)} ಅದ್ಭುತಗಳು`, `${n(WONDERS.length)} wonders`],
    schemes: (n) => [`${n(SCHEMES.length)} ಯೋಜನೆಗಳು`, `${n(SCHEMES.length)} schemes`],
    services: (n) => [`${n(ESERVICES.length)} ಸೇವೆಗಳು`, `${n(ESERVICES.length)} services`],
    students: (n) => [`${n(STUDENT_RESOURCES.length)} ಪೋರ್ಟಲ್‌ಗಳು`, `${n(STUDENT_RESOURCES.length)} portals`],
};

const explore = KARNATAKA_SECTIONS.filter((s) => s.group === 'explore');
const services = KARNATAKA_SECTIONS.filter((s) => s.group === 'services');

const KarnatakaHub = () => {
    const { t, lang } = useLang();
    const stat = (id) => {
        if (!STATS[id]) return undefined;
        const [knText, enText] = STATS[id](lang === 'en' ? String : kn);
        return t(knText, enText);
    };

    return (
        <div className="kh-page animate-in">
            <PageHeader
                icon={Compass}
                title={t('ಕರ್ನಾಟಕ', 'Karnataka')}
                subtitle={t('ನಮ್ಮ ನಾಡಿನ ಇತಿಹಾಸ, ಸಂಸ್ಕೃತಿ, ಅಂಕಿಅಂಶಗಳು ಮತ್ತು ಸರ್ಕಾರಿ ಸೇವೆಗಳು — ಎಲ್ಲವೂ ಒಂದೇ ಕಡೆ', 'History, culture, statistics and government services of the state, all in one place')}
            />

            <div className="kh-body">
                <dl className="kh-facts">
                    {FACTS.map((f) => (
                        <div key={f.en} className="kh-fact">
                            <dt>{t(f.label, f.en)}</dt>
                            <dd>{t(f.value, f.valueEn)}</dd>
                        </div>
                    ))}
                </dl>

                <section className="kh-section">
                    <h2 className="kh-h2">{t('ಅನ್ವೇಷಿಸಿ', 'Explore')}{lang !== 'en' && <span>Explore</span>}</h2>
                    <div className="kc-grid">
                        {explore.map((s, i) => <KarnatakaCard key={s.id} section={s} stat={stat(s.id)} featured={i === 0} />)}
                    </div>
                </section>

                <section className="kh-section">
                    <h2 className="kh-h2">{t('ಸೇವೆಗಳು ಮತ್ತು ಮಾಹಿತಿ', 'Services & information')}{lang !== 'en' && <span>Services & information</span>}</h2>
                    <div className="kc-grid">
                        {services.map((s) => <KarnatakaCard key={s.id} section={s} stat={stat(s.id)} />)}
                    </div>
                </section>

                <section className="kh-cta">
                    <div className="kh-cta-item">
                        <span className="kh-cta-icon"><HelpCircle size={22} aria-hidden="true" /></span>
                        <div>
                            <h3>{t('ನಿಮಗೆ ಕರ್ನಾಟಕ ಎಷ್ಟು ಗೊತ್ತು?', 'How well do you know Karnataka?')}</h3>
                            <p>{t('ರಸಪ್ರಶ್ನೆಯಲ್ಲಿ ನಿಮ್ಮ ಜ್ಞಾನ ಪರೀಕ್ಷಿಸಿ, ಅಂಕವನ್ನು ಸ್ನೇಹಿತರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ.', 'Test yourself in the quiz and share your score with friends.')}</p>
                        </div>
                        <NavLink to="/quiz" className="btn btn-primary">{t('ರಸಪ್ರಶ್ನೆ ಆಡಿ', 'Play the quiz')} <ArrowRight size={16} /></NavLink>
                    </div>
                    <div className="kh-cta-item">
                        <span className="kh-cta-icon"><Code2 size={22} aria-hidden="true" /></span>
                        <div>
                            <h3>{t('ಕನ್ನಡದಲ್ಲೇ ಕೋಡ್ ಮಾಡಿ', 'Code in Kannada')}</h3>
                            <p>{t('ಕನ್ನಡ ಲಿಪಿಯಲ್ಲಿ ನಿಮ್ಮ ಮೊದಲ ಪ್ರೋಗ್ರಾಂ ಬರೆಯಿರಿ — ಪಾಠಗಳು ಹಂತ ಹಂತವಾಗಿ ಕಲಿಸುತ್ತವೆ.', 'Write your first K-Lipi program. The lessons take you step by step.')}</p>
                        </div>
                        <NavLink to="/learn" className="btn btn-secondary">{t('ಕಲಿಯಿರಿ', 'Learn')} <ArrowRight size={16} /></NavLink>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default KarnatakaHub;
