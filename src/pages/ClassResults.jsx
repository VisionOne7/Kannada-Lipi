import React, { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ClipboardList, Download, Trash2, Users, CheckCircle, ClipboardPaste, Link2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { findCompletionCodes } from '../lib/js/classCodes.js';
import { useLang } from '../lib/i18n';
import { toast } from '../lib/ui';
import './ClassResults.css';

const KEY = 'kl_class_results';
const KN = ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'];

const load = () => {
    try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
};
const save = (rows) => { try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch { /* storage blocked */ } };

// Teachers paste students' "send to teacher" messages; every completion code is listed.
const ClassResults = () => {
    const { t, lang } = useLang();
    const n = (x) => (lang === 'en' ? String(x) : String(x).replace(/[0-9]/g, (d) => KN[d]));
    const [rows, setRows] = useState(load);
    const [text, setText] = useState('');

    const add = () => {
        const found = findCompletionCodes(text);
        const known = new Set(rows.map((r) => r.code));
        const fresh = found.filter((f) => !known.has(f.code));
        if (!found.length) { toast(t('ಯಾವುದೇ ಮಾನ್ಯ ಕೋಡ್ ಸಿಗಲಿಲ್ಲ', 'No valid codes found')); return; }
        const next = [...fresh, ...rows];
        setRows(next); save(next); setText('');
        toast(t(`${n(fresh.length)} ಹೊಸ ಫಲಿತಾಂಶ ಸೇರಿಸಲಾಗಿದೆ`, `${fresh.length} new result${fresh.length === 1 ? '' : 's'} added`));
    };

    const clear = () => {
        if (window.confirm(t('ಎಲ್ಲಾ ಫಲಿತಾಂಶ ಅಳಿಸಬೇಕೇ?', 'Delete all results?'))) { setRows([]); save([]); }
    };

    const byAssignment = useMemo(() => {
        const map = new Map();
        rows.forEach((r) => { if (!map.has(r.title)) map.set(r.title, []); map.get(r.title).push(r); });
        return [...map.entries()].map(([title, list]) => ({ title, list: list.sort((a, b) => a.name.localeCompare(b.name, 'kn')) }));
    }, [rows]);

    const when = (ms) => (ms ? new Date(ms).toLocaleString(lang === 'en' ? 'en-IN' : 'kn-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-');

    const exportCsv = () => {
        // Names and titles come from pasted messages: a cell starting with = + - @ would run as a
        // spreadsheet formula, so such cells are prefixed with ' to keep them plain text.
        const esc = (v) => {
            const text = String(v);
            const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
            return `"${safe.replace(/"/g, '""')}"`;
        };
        const lines = [['Assignment', 'Student', 'Completed at'].map(esc).join(',')]
            .concat(rows.map((r) => [r.title, r.name, r.time ? new Date(r.time).toISOString() : ''].map(esc).join(',')));
        const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'k-lipi-class-results.csv';
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="cr-page animate-in">
            <PageHeader
                icon={ClipboardList}
                title={t('ತರಗತಿ ಫಲಿತಾಂಶ', 'Class results')}
                subtitle={t('ವಿದ್ಯಾರ್ಥಿಗಳು ಕಳುಹಿಸಿದ ಸಂದೇಶಗಳನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ — ಯಾರು ಯಾವ ಕಾರ್ಯ ಮುಗಿಸಿದರು ಎಂದು ತಕ್ಷಣ ನೋಡಿ', 'Paste the messages your students sent and see who finished which assignment.')}
            />
            <div className="cr-body">
                <section className="cr-paste glass-card">
                    <h2><ClipboardPaste size={20} aria-hidden="true" /> {t('ಸಂದೇಶಗಳನ್ನು ಅಂಟಿಸಿ', 'Paste messages')}</h2>
                    <p className="cr-hint">
                        {t('WhatsApp ಅಥವಾ ಇಮೇಲ್‌ನಿಂದ ಹಲವು ಸಂದೇಶಗಳನ್ನು ಒಟ್ಟಿಗೆ ನಕಲಿಸಿ ಇಲ್ಲಿ ಅಂಟಿಸಬಹುದು. KL1 ಕೋಡ್‌ಗಳನ್ನು ಸೈಟ್ ತಾನೇ ಹುಡುಕುತ್ತದೆ.', 'Copy many messages at once from WhatsApp or email and paste them here. The site finds every KL1 code by itself.')}
                    </p>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={t('ಉದಾ: ಕನ್ನಡ ಲಿಪಿ ಕಾರ್ಯ ಪೂರ್ಣಗೊಂಡಿದೆ … ಕೋಡ್: KL1.…', 'e.g. ಕನ್ನಡ ಲಿಪಿ ಕಾರ್ಯ ಪೂರ್ಣಗೊಂಡಿದೆ … ಕೋಡ್: KL1.…')}
                        aria-label={t('ಸಂದೇಶಗಳು', 'Messages')}
                    />
                    <div className="cr-actions">
                        <button className="btn btn-primary" onClick={add} disabled={!text.trim()}><CheckCircle size={16} /> {t('ಫಲಿತಾಂಶ ಸೇರಿಸಿ', 'Add results')}</button>
                        <NavLink to="/teachers" className="btn btn-secondary"><Link2 size={16} /> {t('ಹೊಸ ಕಾರ್ಯ ಲಿಂಕ್ ರಚಿಸಿ', 'Make an assignment link')}</NavLink>
                    </div>
                </section>

                {rows.length === 0 ? (
                    <div className="cr-empty">
                        <Users size={42} aria-hidden="true" />
                        <h3>{t('ಇನ್ನೂ ಫಲಿತಾಂಶಗಳಿಲ್ಲ', 'No results yet')}</h3>
                        <p>{t('ಕಾರ್ಯ ಲಿಂಕ್ ಹಂಚಿ; ಮುಗಿಸಿದ ವಿದ್ಯಾರ್ಥಿಗಳ ಸಂದೇಶಗಳು ಇಲ್ಲಿ ಪಟ್ಟಿಯಾಗುತ್ತವೆ.', 'Share an assignment link; messages from students who finish will be listed here.')}</p>
                    </div>
                ) : (
                    <>
                        <div className="cr-toolbar">
                            <span className="cr-count">{t(`${n(rows.length)} ಫಲಿತಾಂಶ · ${n(byAssignment.length)} ಕಾರ್ಯ`, `${rows.length} results · ${byAssignment.length} assignments`)}</span>
                            <button className="btn btn-secondary btn-sm" onClick={exportCsv}><Download size={15} /> CSV</button>
                            <button className="btn btn-secondary btn-sm" onClick={clear}><Trash2 size={15} /> {t('ಅಳಿಸಿ', 'Clear')}</button>
                        </div>
                        {byAssignment.map((g) => (
                            <section key={g.title} className="cr-group glass-card">
                                <h3>{g.title} <span>{t(`${n(g.list.length)} ವಿದ್ಯಾರ್ಥಿಗಳು`, `${g.list.length} students`)}</span></h3>
                                <table className="cr-table">
                                    <thead><tr><th>{t('ವಿದ್ಯಾರ್ಥಿ', 'Student')}</th><th>{t('ಮುಗಿಸಿದ ಸಮಯ', 'Completed')}</th></tr></thead>
                                    <tbody>
                                        {g.list.map((r) => (
                                            <tr key={r.code}><td><CheckCircle size={15} aria-hidden="true" /> {r.name}</td><td>{when(r.time)}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                        ))}
                    </>
                )}
                <p className="cr-privacy">{t('ಫಲಿತಾಂಶಗಳು ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತ್ರ ಉಳಿಯುತ್ತವೆ. ಯಾವುದೂ ಸರ್ವರ್‌ಗೆ ಹೋಗುವುದಿಲ್ಲ.', 'Results stay in this browser only. Nothing is sent to a server.')}</p>
            </div>
        </div>
    );
};

export default ClassResults;
