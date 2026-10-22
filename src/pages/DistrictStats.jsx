import React, { useState, useMemo } from 'react';
import { BarChart3, Users, GraduationCap, Grid3x3, MapPin, IndianRupee, ChevronDown, Building2, Sparkles, Map as MapIcon } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer
} from 'recharts';
import { kannadaLipi } from '../lib/js/interpreter/index.js';
import { DISTRICTS, STATE_TOTALS } from '../data/districtStats';
import { DISTRICT_GDP } from '../data/districtGDP';
import { DISTRICT_INFO } from '../data/districtInfo';
import { DISTRICT_PATHS, MAP_VIEWBOX } from '../data/karnatakaMap';
import './DistrictStats.css';
import DataIcon from '../components/DataIcon';

// Convert a JS number to Kannada numerals via the interpreter helper, with
// thousands grouping for readability.
const kn = (num) => kannadaLipi.toKannada(Math.round(num).toLocaleString('en-IN'));

// Interactive Karnataka map — hover/tap a district to see its facts.
const MapSection = () => {
    const lookup = useMemo(() => {
        const m = {};
        for (const d of DISTRICTS) m[d.nameEn] = { ...d, ...(DISTRICT_INFO[d.nameEn] || { emoji: '📍', hq: d.name, knownFor: '' }) };
        return m;
    }, []);
    const [active, setActive] = useState(null);
    const info = active ? lookup[active] : null;

    return (
        <div className="dmap-section">
            <h2 className="dmap-heading"><MapPin size={20} style={{ marginRight: 6, verticalAlign: 'middle' }} /> ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ</h2>
            <p className="dmap-sub">ಜಿಲ್ಲೆಯ ಮೇಲೆ ಮೌಸ್ ಇರಿಸಿ / ಟ್ಯಾಪ್ ಮಾಡಿ</p>
            <div className="dmap-layout">
                <div className="dmap-wrap">
                    <svg viewBox={MAP_VIEWBOX} className="dmap-svg" role="img" aria-label="Karnataka districts map">
                        {DISTRICT_PATHS.map((dp) => (
                            <path
                                key={dp.name}
                                d={dp.d}
                                className={`dmap-district ${active === dp.name ? 'active' : ''}`}
                                onMouseEnter={() => setActive(dp.name)}
                                onClick={() => setActive(dp.name)}
                                tabIndex={0}
                                onFocus={() => setActive(dp.name)}
                            />
                        ))}
                    </svg>
                </div>
                <aside className="dmap-info panel">
                    {info ? (
                        <div className="dmap-info-body" key={info.nameEn}>
                            <div className="dmap-info-head">
                                <span className="dmap-info-emoji"><DataIcon value={info.emoji} size={28} /></span>
                                <div>
                                    <h3 className="dmap-info-name">{info.name}</h3>
                                    <span className="dmap-info-en">{info.nameEn}</span>
                                </div>
                            </div>
                            <div className="dmap-rows">
                                <div className="dmap-row"><Building2 size={14} /> <span><b>ಕೇಂದ್ರ:</b> {info.hq}</span></div>
                                <div className="dmap-row"><Users size={14} /> <span><b>ಜನಸಂಖ್ಯೆ:</b> {kn(info.population)}</span></div>
                                <div className="dmap-row"><GraduationCap size={14} /> <span><b>ಸಾಕ್ಷರತೆ:</b> {kn(info.literacy)}%</span></div>
                                <div className="dmap-row"><Grid3x3 size={14} /> <span><b>ವಿಸ್ತೀರ್ಣ:</b> {kn(info.area)} ಚ.ಕಿ.ಮೀ</span></div>
                            </div>
                            {info.knownFor && <div className="dmap-known"><Sparkles size={14} style={{ verticalAlign: "-2px" }} /> {info.knownFor}</div>}
                        </div>
                    ) : (
                        <div className="dmap-empty"><MapPin size={38} /><p>ಜಿಲ್ಲೆ ಆಯ್ಕೆ ಮಾಡಿ</p></div>
                    )}
                </aside>
            </div>
            <p className="dmap-credit">
                <MapIcon size={14} style={{ verticalAlign: "-2px" }} /> ನಕ್ಷೆ ದತ್ತಾಂಶ: <a href="https://github.com/udit-001/india-maps-data" target="_blank" rel="noopener noreferrer">india-maps-data</a> (Census of India boundaries)
            </p>
        </div>
    );
};

// GDDP comes in ₹ lakh; show as ₹ crore (÷100) which is far more readable.
const knCrore = (lakh) => kn(Math.round(lakh / 100));

// Expandable economy section: GDDP + per-capita per district, drilling into taluks.
const EconomySection = () => {
    const [open, setOpen] = useState(null); // district name currently expanded

    return (
        <div className="econ-table-section">
            <h2 className="econ-table-heading">
                <IndianRupee size={20} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                ಜಿಲ್ಲೆವಾರು ಆರ್ಥಿಕ ಉತ್ಪನ್ನ (GDDP) — ೨೦೧೯-೨೦
            </h2>
            <p className="econ-table-sub">ಜಿಲ್ಲೆ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ — ತಾಲ್ಲೂಕು ವಿವರ ತೆರೆಯುತ್ತದೆ</p>

            <div className="gddp-list">
                {DISTRICT_GDP.map((d, i) => {
                    const isOpen = open === d.name;
                    return (
                        <div key={d.name} className={`gddp-item ${isOpen ? 'open' : ''}`}>
                            <button className="gddp-row" onClick={() => setOpen(isOpen ? null : d.name)}>
                                <span className="gddp-rank">{kn(i + 1)}</span>
                                <span className="gddp-name">{d.name}</span>
                                <span className="gddp-metrics">
                                    <span className="gddp-val">₹{knCrore(d.gddp)} ಕೋಟಿ</span>
                                </span>
                                <ChevronDown size={18} className="gddp-caret" />
                            </button>

                            {isOpen && (
                                <div className="taluk-panel">
                                    <table className="taluk-table">
                                        <thead>
                                            <tr>
                                                <th>ತಾಲ್ಲೂಕು</th>
                                                <th>GDDP (₹ ಕೋಟಿ)</th>
                                                <th>ತಲಾ ಆದಾಯ (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {d.taluks.map((t) => (
                                                <tr key={t.name}>
                                                    <td>{t.name}</td>
                                                    <td>{knCrore(t.gddp)}</td>
                                                    <td>{kn(t.pci)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const METRICS = [
    { key: 'population', label: 'ಜನಸಂಖ್ಯೆ', short: 'ಜನಸಂಖ್ಯೆ', Icon: Users, color: 'var(--k-red)', fmt: (v) => kn(v) },
    { key: 'literacy', label: 'ಸಾಕ್ಷರತೆ (%)', short: 'ಸಾಕ್ಷರತೆ', Icon: GraduationCap, color: 'var(--success)', fmt: (v) => kn(v) + '%' },
    { key: 'density', label: 'ಜನಸಾಂದ್ರತೆ (ಪ್ರತಿ ಚ.ಕಿ.ಮೀ)', short: 'ಸಾಂದ್ರತೆ', Icon: Grid3x3, color: 'var(--hl-func)', fmt: (v) => kn(v) }
];

const TABS = [
    { key: 'map', label: 'ನಕ್ಷೆ', Icon: MapPin },
    { key: 'stats', label: 'ಅಂಕಿಅಂಶ', Icon: BarChart3 },
    { key: 'economy', label: 'ಆರ್ಥಿಕತೆ', Icon: IndianRupee }
];

const DistrictStats = () => {
    const [tab, setTab] = useState('map');
    const [metricKey, setMetricKey] = useState('population');
    const metric = METRICS.find((m) => m.key === metricKey);

    // Districts sorted by the active metric (descending).
    const sorted = useMemo(
        () => [...DISTRICTS].sort((a, b) => b[metricKey] - a[metricKey]),
        [metricKey]
    );

    // Top 10 for the chart.
    const chartData = useMemo(
        () => sorted.slice(0, 10).map((d) => ({ name: d.nameEn, value: d[metricKey] })),
        [sorted, metricKey]
    );

    const topDistrict = sorted[0];

    return (
        <div className="district-page animate-in">
            <header className="page-header">
                <h1 className="page-header-title">
                    <span className="page-header-icon"><BarChart3 size={28} /></span>
                    ಜಿಲ್ಲೆಗಳು
                </h1>
                <p className="page-header-subtitle">ಕರ್ನಾಟಕ ನಕ್ಷೆ, ಜನಸಂಖ್ಯೆ, ಸಾಕ್ಷರತೆ ಮತ್ತು ಆರ್ಥಿಕ ಉತ್ಪನ್ನ (ಜನಗಣತಿ ೨೦೧೧)</p>
            </header>

            <div className="district-content">
                {/* Tab switcher */}
                <div className="dtabs">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            className={`dtab ${tab === t.key ? 'active' : ''}`}
                            onClick={() => setTab(t.key)}
                        >
                            <t.Icon size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab: Map ── */}
                {tab === 'map' && <div className="dtab-panel">
                <MapSection />

                {/* State summary cards */}
                <div className="state-summary">
                    <div className="summary-card">
                        <span className="summary-value">{kn(STATE_TOTALS.population)}</span>
                        <span className="summary-label">ಒಟ್ಟು ಜನಸಂಖ್ಯೆ</span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-value">{kn(STATE_TOTALS.literacy)}%</span>
                        <span className="summary-label">ರಾಜ್ಯ ಸಾಕ್ಷರತೆ</span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-value">{kn(STATE_TOTALS.area)}</span>
                        <span className="summary-label">ವಿಸ್ತೀರ್ಣ (ಚ.ಕಿ.ಮೀ)</span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-value">{kn(STATE_TOTALS.districts)}</span>
                        <span className="summary-label">ಜಿಲ್ಲೆಗಳು</span>
                    </div>
                </div>
                </div>}

                {/* ── Tab: Stats (metric + chart + table) ── */}
                {tab === 'stats' && <div className="dtab-panel">
                {/* Metric selector */}
                <div className="metric-bar">
                    {METRICS.map((m) => (
                        <button
                            key={m.key}
                            className={`metric-btn ${metricKey === m.key ? 'active' : ''}`}
                            onClick={() => setMetricKey(m.key)}
                        >
                            <m.Icon size={15} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                            {m.short}
                        </button>
                    ))}
                </div>

                {/* Top-10 chart */}
                <div className="chart-panel panel">
                    <h3 className="chart-title">
                        ಅಗ್ರ ೧೦ ಜಿಲ್ಲೆಗಳು — {metric.label}
                    </h3>
                    <div className="chart-wrap">
                        <ResponsiveContainer width="100%" height={360}>
                            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#888"
                                    fontSize={11}
                                    angle={-40}
                                    textAnchor="end"
                                    interval={0}
                                />
                                <YAxis stroke="#888" fontSize={11} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-glass-color)', borderRadius: '8px' }}
                                    formatter={(value) => [metric.fmt(value), metric.short]}
                                />
                                <Bar dataKey="value" name={metric.short} fill={metric.color} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="chart-note">
                        <MapPin size={13} style={{ verticalAlign: 'middle' }} /> ಅತಿ ಹೆಚ್ಚು {metric.short}: <strong>{topDistrict.name}</strong> ({metric.fmt(topDistrict[metricKey])})
                    </p>
                </div>

                {/* Full table */}
                <div className="table-wrap">
                    <table className="wiki-table district-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ಜಿಲ್ಲೆ</th>
                                <th>ಜನಸಂಖ್ಯೆ</th>
                                <th>ಸಾಕ್ಷರತೆ</th>
                                <th>ಸಾಂದ್ರತೆ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((d, i) => (
                                <tr key={d.nameEn}>
                                    <td>{kn(i + 1)}</td>
                                    <td>
                                        <strong>{d.name}</strong>
                                        <span className="td-en"> {d.nameEn}</span>
                                    </td>
                                    <td>{kn(d.population)}</td>
                                    <td>{kn(d.literacy)}%</td>
                                    <td>{kn(d.density)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="district-source">
                    <BarChart3 size={14} style={{ verticalAlign: "-2px" }} /> ಮೂಲ: ಭಾರತ ಜನಗಣತಿ ೨೦೧೧ (Census of India 2011). ನವೀಕೃತ ಅಂಕಿಅಂಶಗಳಿಗೆ ಅಧಿಕೃತ ಮೂಲಗಳನ್ನು ನೋಡಿ.
                </p>
                </div>}

                {/* ── Tab: Economy (GDDP) ── */}
                {tab === 'economy' && <div className="dtab-panel">
                <EconomySection />

                <p className="district-source">
                    <BarChart3 size={14} style={{ verticalAlign: "-2px" }} /> ಆರ್ಥಿಕ ಮೂಲ: data.gov.in — District Income &amp; Per Capita Income (೨೦೧೯-೨೦, ಪ್ರಸ್ತುತ ಬೆಲೆ). ತಾಲ್ಲೂಕು ಅಂಕಿಅಂಶಗಳನ್ನು ಜಿಲ್ಲೆಗಳಾಗಿ ಒಟ್ಟುಗೂಡಿಸಲಾಗಿದೆ.
                </p>
                </div>}
            </div>
        </div>
    );
};

export default DistrictStats;
