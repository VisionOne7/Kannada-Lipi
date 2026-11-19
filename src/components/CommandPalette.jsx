import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
    Search, CornerDownLeft, ArrowUp, ArrowDown, BookOpen, Code2, Moon, Languages, ALargeSmall, Hash, Layers,
} from 'lucide-react';
import { PAGES } from '../data/pages';
import { LESSONS } from '../data/lessons';
import { TOPICS } from '../data/topics';
import { FUNCTION_CATEGORIES } from '../data/functions';
import { useLang } from '../lib/i18n';
import { readPref, writePref } from '../lib/prefs';
import { UI_EVENTS, emit, toast } from '../lib/ui';
import './CommandPalette.css';

const SIZES = ['100', '112', '125'];

// Ctrl+K / ⌘K search across pages, lessons, topics, functions and quick actions.
const CommandPalette = ({ onClose }) => {
    const { t, lang, setLang } = useLang();
    const navigate = useNavigate();
    const [q, setQ] = useState('');
    const [active, setActive] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const all = useMemo(() => {
        const items = [];
        items.push(
            { group: t('ಕ್ರಿಯೆಗಳು', 'Actions'), Icon: Moon, label: t('ಬೆಳಕು / ಕತ್ತಲೆ ಥೀಮ್ ಬದಲಿಸಿ', 'Switch light / dark theme'), words: 'theme dark light ಥೀಮ್', run: () => emit(UI_EVENTS.toggleTheme) },
            { group: t('ಕ್ರಿಯೆಗಳು', 'Actions'), Icon: Languages, label: lang === 'en' ? 'ಕನ್ನಡ ಇಂಟರ್ಫೇಸ್' : 'English interface', words: 'language english kannada ಭಾಷೆ', run: () => { setLang(lang === 'en' ? 'kn' : 'en'); } },
            {
                group: t('ಕ್ರಿಯೆಗಳು', 'Actions'), Icon: ALargeSmall, label: t('ಅಕ್ಷರದ ಗಾತ್ರ ಬದಲಿಸಿ', 'Change text size'), words: 'text size font ಅಕ್ಷರ ಗಾತ್ರ',
                run: () => {
                    const next = SIZES[(SIZES.indexOf(readPref('textSize')) + 1) % SIZES.length];
                    writePref('textSize', next);
                    toast(t(`ಅಕ್ಷರದ ಗಾತ್ರ: ${next}%`, `Text size: ${next}%`));
                },
            },
        );
        PAGES.filter((p) => !p.hidden).forEach((p) => items.push({
            group: t('ಪುಟಗಳು', 'Pages'), Icon: p.icon, label: t(p.kn, p.en), sub: lang === 'en' ? '' : p.en, words: `${p.kn} ${p.en} ${p.path}`, run: () => navigate(p.path),
        }));
        TOPICS.forEach((tp) => items.push({
            group: t('ವಿಷಯಗಳು', 'Topics'), Icon: Layers, label: t(tp.title, tp.titleEn), sub: lang === 'en' ? '' : tp.titleEn, words: `${tp.title} ${tp.titleEn} ${tp.summary}`, run: () => navigate(`/learn?topic=${tp.id}`),
        }));
        Object.values(LESSONS).forEach((l) => items.push({
            group: t('ಪಾಠಗಳು', 'Lessons'), Icon: BookOpen, label: l.title, words: `${l.title} ${l.objectives.join(' ')}`, run: () => navigate(`/learn?lesson=${l.id}`),
        }));
        FUNCTION_CATEGORIES.forEach((c) => c.functions.forEach((f) => items.push({
            group: t('ಕಾರ್ಯಗಳು', 'Functions'), Icon: Code2, label: f.name, sub: f.nameEn, mono: true, words: `${f.name} ${f.nameEn} ${f.description} ${f.descriptionEn || ''}`,
            run: () => navigate(`/learn?tab=reference&q=${encodeURIComponent(f.name)}`),
        })));
        return items;
    }, [t, lang, setLang, navigate]);

    const results = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return all.filter((i) => i.group === t('ಕ್ರಿಯೆಗಳು', 'Actions') || i.group === t('ಪುಟಗಳು', 'Pages')).slice(0, 14);
        return all
            .map((i) => {
                const label = i.label.toLowerCase();
                const score = label.startsWith(s) ? 0 : label.includes(s) ? 1 : i.words.toLowerCase().includes(s) ? 2 : -1;
                return { i, score };
            })
            .filter((r) => r.score >= 0)
            .sort((a, b) => a.score - b.score)
            .slice(0, 40)
            .map((r) => r.i);
    }, [q, all, t]);

    useEffect(() => { setActive(0); }, [q]);
    useEffect(() => {
        inputRef.current?.focus();
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);
    useEffect(() => {
        listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
    }, [active]);

    const choose = (item) => { onClose(); item.run(); };
    const onKey = (e) => {
        if (e.key === 'Escape') { e.preventDefault(); onClose(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
        else if (e.key === 'Enter' && results[active]) { e.preventDefault(); choose(results[active]); }
    };

    let lastGroup = null;
    return createPortal(
        <div className="cp-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div className="cp" role="dialog" aria-modal="true" aria-label={t('ಹುಡುಕಿ', 'Search')} onKeyDown={onKey}>
                <div className="cp-search">
                    <Search size={20} aria-hidden="true" />
                    <input
                        ref={inputRef}
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder={t('ಪುಟ, ಪಾಠ, ಕಾರ್ಯ ಹುಡುಕಿ… (ಉದಾ: ಮುದ್ರಿಸು, ಜಿಲ್ಲೆ, theme)', 'Search pages, lessons, functions… (e.g. ಮುದ್ರಿಸು, districts, theme)')}
                        aria-label={t('ಹುಡುಕಿ', 'Search')}
                        aria-controls="cp-list"
                        aria-activedescendant={results[active] ? `cp-item-${active}` : undefined}
                    />
                    <kbd>Esc</kbd>
                </div>
                <ul className="cp-list" id="cp-list" role="listbox" ref={listRef}>
                    {results.length === 0 && <li className="cp-empty">{t('ಏನೂ ಸಿಗಲಿಲ್ಲ', 'Nothing found')}</li>}
                    {results.map((item, idx) => {
                        const header = item.group !== lastGroup ? item.group : null;
                        lastGroup = item.group;
                        const Icon = item.Icon || Hash;
                        return (
                            <React.Fragment key={`${item.group}-${item.label}-${idx}`}>
                                {header && <li className="cp-group" role="presentation">{header}</li>}
                                <li
                                    id={`cp-item-${idx}`}
                                    role="option"
                                    aria-selected={idx === active}
                                    className={`cp-item${idx === active ? ' active' : ''}`}
                                    onMouseMove={() => setActive(idx)}
                                    onClick={() => choose(item)}
                                >
                                    <span className="cp-icon"><Icon size={18} aria-hidden="true" /></span>
                                    <span className={`cp-label${item.mono ? ' mono' : ''}`}>{item.label}</span>
                                    {item.sub && <span className="cp-sub">{item.sub}</span>}
                                    {idx === active && <CornerDownLeft size={15} className="cp-enter" aria-hidden="true" />}
                                </li>
                            </React.Fragment>
                        );
                    })}
                </ul>
                <div className="cp-foot">
                    <span><ArrowUp size={13} /><ArrowDown size={13} /> {t('ಆಯ್ಕೆ', 'move')}</span>
                    <span><CornerDownLeft size={13} /> {t('ತೆರೆಯಿರಿ', 'open')}</span>
                    <span><kbd>Ctrl</kbd> <kbd>K</kbd> {t('ಎಲ್ಲಿಂದ ಬೇಕಾದರೂ', 'from anywhere')}</span>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CommandPalette;
