import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Trophy, BookOpen, Turtle, Flame, FolderHeart, ArrowRight, Lock, Award, Footprints, Repeat,
    Mountain, Target, GraduationCap, Crown, Rocket, Calculator, GitBranch, Type, List, RefreshCw, Clock,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { readProgress, BADGES } from '../lib/progress';
import { useLang } from '../lib/i18n';
import './Progress.css';

const ICONS = { Footprints, Repeat, Mountain, Target, GraduationCap, Turtle, Crown, Flame, FolderHeart, Rocket, Calculator, GitBranch, Type, List, RefreshCw, Clock };
const KN = ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'];

// A progress ring drawn with SVG: the stroke fills as the topic is completed.
const Ring = ({ value, total, children }) => {
    const r = 30, c = 2 * Math.PI * r, f = total ? value / total : 0;
    return (
        <div className="pg-ring">
            <svg viewBox="0 0 72 72" aria-hidden="true">
                <circle cx="36" cy="36" r={r} className="pg-ring-track" />
                <circle cx="36" cy="36" r={r} className="pg-ring-fill" style={{ strokeDasharray: c, strokeDashoffset: c * (1 - f) }} />
            </svg>
            <span className="pg-ring-inner">{children}</span>
        </div>
    );
};

const Progress = () => {
    const { t, lang } = useLang();
    const n = (x) => (lang === 'en' ? String(x) : String(x).replace(/[0-9]/g, (d) => KN[d]));
    const p = useMemo(readProgress, []);
    const earned = BADGES.filter((b) => b.test(p));
    const nextTopic = p.topics.find((tp) => tp.done < tp.total);

    const stats = [
        { Icon: BookOpen, value: `${n(p.lessons.length)}/${n(p.lessonTotal)}`, label: t('ಪಾಠಗಳು', 'Lessons'), to: '/learn' },
        { Icon: Turtle, value: `${n(p.kids.length)}/${n(p.kidsTotal)}`, label: t('ಆಮೆ ಹಂತಗಳು', 'Turtle levels'), to: '/kids' },
        { Icon: Flame, value: n(p.challengeDays), label: t('ಸವಾಲುಗಳು ಮುಗಿದಿವೆ', 'Challenges solved'), to: '/challenge' },
        { Icon: FolderHeart, value: n(p.programs), label: t('ಉಳಿಸಿದ ಪ್ರೋಗ್ರಾಂ', 'Saved programs'), to: '/' },
    ];

    return (
        <div className="pg-page animate-in">
            <PageHeader
                icon={Trophy}
                title={t('ನನ್ನ ಕಲಿಕೆ', 'My learning')}
                subtitle={t('ನೀವು ಕಲಿತದ್ದು, ಗಳಿಸಿದ ಬ್ಯಾಡ್ಜ್‌ಗಳು ಮತ್ತು ಮುಂದಿನ ಹೆಜ್ಜೆ — ಎಲ್ಲವೂ ಈ ಸಾಧನದಲ್ಲೇ ಉಳಿಯುತ್ತದೆ', 'What you have learned, badges you have earned and your next step. All of it stays on this device.')}
            />

            <div className="pg-body">
                <section className="pg-stats">
                    {stats.map(({ Icon, value, label, to }) => (
                        <NavLink key={label} to={to} className="pg-stat">
                            <span className="pg-stat-icon"><Icon size={22} aria-hidden="true" /></span>
                            <span className="pg-stat-value">{value}</span>
                            <span className="pg-stat-label">{label}</span>
                        </NavLink>
                    ))}
                </section>

                {nextTopic && (
                    <NavLink to={`/learn?topic=${nextTopic.id}`} className="pg-next">
                        <span className="pg-next-tag">{t('ಮುಂದಿನ ಹೆಜ್ಜೆ', 'Next step')}</span>
                        <span className="pg-next-title">{t(nextTopic.title, nextTopic.titleEn)}</span>
                        <span className="pg-next-sub">{t(`${n(nextTopic.total - nextTopic.done)} ಪಾಠ ಬಾಕಿ`, `${nextTopic.total - nextTopic.done} lessons to go`)}</span>
                        <ArrowRight size={22} className="pg-next-arrow" aria-hidden="true" />
                    </NavLink>
                )}

                <section className="pg-section">
                    <h2 className="pg-h2">{t('ಕಲಿಕೆಯ ಹಾದಿ', 'Learning path')}</h2>
                    <div className="pg-path">
                        {p.topics.map((tp, i) => {
                            const Icon = ICONS[tp.iconKey] || BookOpen;
                            const state = tp.done === tp.total ? 'done' : tp.done > 0 ? 'active' : 'todo';
                            return (
                                <NavLink key={tp.id} to={`/learn?topic=${tp.id}`} className={`pg-node pg-${state}`} style={{ '--i': i }}>
                                    <Ring value={tp.done} total={tp.total}><Icon size={22} aria-hidden="true" /></Ring>
                                    <span className="pg-node-title">{t(tp.title, tp.titleEn)}</span>
                                    <span className="pg-node-count">{n(tp.done)}/{n(tp.total)}</span>
                                </NavLink>
                            );
                        })}
                    </div>
                </section>

                <section className="pg-section">
                    <h2 className="pg-h2">
                        {t('ಬ್ಯಾಡ್ಜ್‌ಗಳು', 'Badges')}
                        <span className="pg-h2-count">{n(earned.length)}/{n(BADGES.length)}</span>
                    </h2>
                    <div className="pg-badges">
                        {BADGES.map((b) => {
                            const Icon = ICONS[b.icon] || Award;
                            const got = earned.includes(b);
                            return (
                                <div key={b.id} className={`pg-badge${got ? ' got' : ''}`}>
                                    <span className="pg-badge-medal">
                                        {got ? <Icon size={26} aria-hidden="true" /> : <Lock size={22} aria-hidden="true" />}
                                    </span>
                                    <span className="pg-badge-title">{t(b.kn, b.en)}</span>
                                    <span className="pg-badge-how">{got ? t('ಗಳಿಸಿದ್ದೀರಿ!', 'Earned!') : t(b.howKn, b.howEn)}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="pg-certs">
                    <NavLink to="/certificate" className={`pg-cert${p.lessons.length >= p.lessonTotal ? ' ready' : ''}`}>
                        <Award size={26} aria-hidden="true" />
                        <span>{t('ಕೋರ್ಸ್ ಪ್ರಮಾಣಪತ್ರ', 'Course certificate')}</span>
                        <small>{p.lessons.length >= p.lessonTotal ? t('ಸಿದ್ಧವಾಗಿದೆ', 'Ready') : t(`${n(p.lessonTotal - p.lessons.length)} ಪಾಠ ಬಾಕಿ`, `${p.lessonTotal - p.lessons.length} lessons to go`)}</small>
                    </NavLink>
                    <NavLink to="/certificate?type=kids" className={`pg-cert${p.kids.length >= p.kidsTotal ? ' ready' : ''}`}>
                        <Turtle size={26} aria-hidden="true" />
                        <span>{t('ಪುಟಾಣಿ ಕೋಡರ್ ಪ್ರಮಾಣಪತ್ರ', 'Little coder certificate')}</span>
                        <small>{p.kids.length >= p.kidsTotal ? t('ಸಿದ್ಧವಾಗಿದೆ', 'Ready') : t(`${n(p.kidsTotal - p.kids.length)} ಹಂತ ಬಾಕಿ`, `${p.kidsTotal - p.kids.length} levels to go`)}</small>
                    </NavLink>
                </section>
            </div>
        </div>
    );
};

export default Progress;
