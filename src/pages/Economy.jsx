import React, { useMemo } from 'react';
import { IndianRupee, MapPin, Building2, TrendingUp } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, Cell
} from 'recharts';
import data from '../data/karnataka.json';
import './Economy.css';
import DataIcon from '../components/DataIcon';

const ECONOMY = data.economy;

// Some sectors describe a national share like "~38%" or "~70%" in their
// `contribution` text. Pull that number out (when present) to drive a chart of
// "Karnataka's share of India" for those sectors.
const extractPercent = (text) => {
    const m = text && text.match(/(\d{1,3})\s*%/);
    return m ? Number(m[1]) : null;
};

// Headline stat cards — the strongest "wow" numbers from the data.
const HIGHLIGHTS = [
    { value: '~೭೦%', label: 'ದೇಶದ ರೇಷ್ಮೆ ಉತ್ಪಾದನೆ' },
    { value: '~೭೦%', label: 'ದೇಶದ ಕಾಫಿ ಉತ್ಪಾದನೆ' },
    { value: '~೩೮%', label: 'ದೇಶದ ಐಟಿ ರಫ್ತು' },
    { value: '~೨೦%', label: 'ದೇಶದ ಕಬ್ಬಿಣ' }
];

const BAR_COLORS = ['#D71920', '#f0a800', '#34d399', '#8b5cf6', '#3b82f6', '#ec4899', '#14b8a6'];

const Economy = () => {
    // Build chart data from sectors that expose a clear national-share %.
    const chartData = useMemo(() => {
        return ECONOMY
            .map((s) => ({ name: s.name.split(' (')[0], pct: extractPercent(s.contribution) }))
            .filter((s) => s.pct !== null)
            .sort((a, b) => b.pct - a.pct);
    }, []);

    return (
        <div className="economy-page animate-in">
            <header className="page-header">
                <h1 className="page-header-title">
                    <span className="page-header-icon"><IndianRupee size={28} /></span>
                    ಕರ್ನಾಟಕದ ಆರ್ಥಿಕತೆ
                </h1>
                <p className="page-header-subtitle">ಐಟಿ, ಕೃಷಿ, ರೇಷ್ಮೆ, ಕಾಫಿ — ರಾಜ್ಯದ ಆರ್ಥಿಕ ಶಕ್ತಿಯ ನೋಟ</p>
            </header>

            <div className="economy-content">
                {/* Headline numbers */}
                <div className="econ-highlights">
                    {HIGHLIGHTS.map((h, i) => (
                        <div key={i} className="econ-highlight">
                            <span className="econ-highlight-value">{h.value}</span>
                            <span className="econ-highlight-label">{h.label}</span>
                        </div>
                    ))}
                </div>

                {/* National-share chart */}
                {chartData.length > 0 && (
                    <div className="econ-chart-panel panel">
                        <h3 className="econ-chart-title">
                            <TrendingUp size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                            ಭಾರತದಲ್ಲಿ ಕರ್ನಾಟಕದ ಪಾಲು (%)
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                                <XAxis dataKey="name" stroke="#888" fontSize={11} angle={-25} textAnchor="end" interval={0} />
                                <YAxis stroke="#888" fontSize={11} unit="%" />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-glass-color)', borderRadius: '8px' }}
                                    formatter={(v) => [`${v}%`, 'ಪಾಲು']}
                                />
                                <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                                    {chartData.map((_, i) => (
                                        <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Sector cards */}
                <h2 className="econ-section-heading">ಪ್ರಮುಖ ಆರ್ಥಿಕ ವಲಯಗಳು</h2>
                <div className="econ-grid">
                    {ECONOMY.map((s, i) => (
                        <article key={i} className="econ-card">
                            <div className="econ-card-head">
                                <span className="econ-card-icon"><DataIcon value={s.icon} size={24} /></span>
                                <h3 className="econ-card-name">{s.name}</h3>
                            </div>

                            <div className="econ-contribution">{s.contribution}</div>
                            <p className="econ-desc">{s.desc}</p>

                            <div className="econ-meta">
                                <div className="econ-meta-row">
                                    <MapPin size={14} className="econ-meta-icon" />
                                    <span><strong>ಕೇಂದ್ರ:</strong> {s.hub}</span>
                                </div>
                                <div className="econ-meta-row">
                                    <Building2 size={14} className="econ-meta-icon" />
                                    <div className="econ-chips">
                                        {s.companies.map((c, ci) => (
                                            <span key={ci} className="econ-chip">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Economy;
