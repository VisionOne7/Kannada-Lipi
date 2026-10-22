import React, { useState, useEffect, useRef } from 'react';
import { Award, Download, Share2, Lock } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { LESSONS } from '../data/lessons';
import './Certificate.css';

const TOTAL_LESSONS = Object.keys(LESSONS).length;

// Rounded-rectangle path helper for the canvas frame.
const roundRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
};

const Certificate = () => {
    const [done, setDone] = useState(0);
    const [name, setName] = useState(() => localStorage.getItem('kl_cert_name') || '');
    const [issued, setIssued] = useState(false);
    const canvasRef = useRef(null);
    const logoRef = useRef(null);

    useEffect(() => {
        try {
            const p = JSON.parse(localStorage.getItem('kannadalipi_learning') || '{}');
            setDone((p.completedLessons || []).length);
        } catch { setDone(0); }
        // Preload the real logo so it's ready when we draw.
        const img = new Image();
        img.src = '/images/logo.png';
        img.onload = () => { logoRef.current = img; };
    }, []);

    const eligible = done >= TOTAL_LESSONS;
    const pct = Math.round((done / TOTAL_LESSONS) * 100);
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // Draw the certificate onto a canvas → returns the canvas for download/share.
    const drawCertificate = () => {
        const c = canvasRef.current;
        const ctx = c.getContext('2d');
        const W = 1200, H = 850;
        c.width = W; c.height = H;

        // Background: warm cream + soft radial glow
        ctx.fillStyle = '#fffdf6'; ctx.fillRect(0, 0, W, H);
        const bg = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 700);
        bg.addColorStop(0, 'rgba(255,215,0,0.06)'); bg.addColorStop(1, 'rgba(255,215,0,0)');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        // Outer flag-gradient frame + inner line
        const fg = ctx.createLinearGradient(0, 0, W, H);
        fg.addColorStop(0, '#FFD700'); fg.addColorStop(0.5, '#ff8c00'); fg.addColorStop(1, '#D71920');
        ctx.strokeStyle = fg; ctx.lineWidth = 16; roundRect(ctx, 26, 26, W - 52, H - 52, 20); ctx.stroke();
        ctx.strokeStyle = 'rgba(215,25,32,0.35)'; ctx.lineWidth = 2; roundRect(ctx, 50, 50, W - 100, H - 100, 12); ctx.stroke();

        // Decorative corner flourishes
        ctx.strokeStyle = '#D71920'; ctx.lineWidth = 3;
        const cs = 42, off = 68;
        [[off, off, 1, 1], [W - off, off, -1, 1], [off, H - off, 1, -1], [W - off, H - off, -1, -1]].forEach(([x, y, sx, sy]) => {
            ctx.beginPath(); ctx.moveTo(x, y + sy * cs); ctx.lineTo(x, y); ctx.lineTo(x + sx * cs, y); ctx.stroke();
            ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill();
        });

        ctx.textAlign = 'center';

        // Real KannadaLipi logo — preserve aspect ratio (image isn't square).
        const logo = logoRef.current;
        if (logo && logo.complete && logo.naturalWidth) {
            const targetH = 96;
            const scale = targetH / logo.naturalHeight;
            const drawW = logo.naturalWidth * scale;
            ctx.drawImage(logo, W / 2 - drawW / 2, 92, drawW, targetH);
        }

        // Subtitle band
        ctx.fillStyle = '#6b6b6b'; ctx.font = '500 26px Georgia, serif';
        ctx.fillText('ಪೂರ್ಣಗೊಳಿಸಿದ ಪ್ರಮಾಣಪತ್ರ', W / 2, 250);
        ctx.font = 'italic 18px Georgia, serif'; ctx.fillStyle = '#999';
        ctx.fillText('CERTIFICATE  OF  COMPLETION', W / 2, 280);
        ctx.fillStyle = '#FFD700';
        [-30, 0, 30].forEach((dx) => { ctx.beginPath(); ctx.arc(W / 2 + dx, 308, 4, 0, 7); ctx.fill(); });

        // Name (reduced size) + fading gradient underline
        ctx.fillStyle = '#111'; ctx.font = 'bold 48px Georgia, serif';
        ctx.fillText(name || 'ಕಲಿಕಾರ್ಥಿ', W / 2, 420);
        const ng = ctx.createLinearGradient(W / 2 - 280, 0, W / 2 + 280, 0);
        ng.addColorStop(0, 'rgba(255,215,0,0)'); ng.addColorStop(0.5, '#D71920'); ng.addColorStop(1, 'rgba(255,215,0,0)');
        ctx.strokeStyle = ng; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(W / 2 - 280, 448); ctx.lineTo(W / 2 + 280, 448); ctx.stroke();

        // Achievement — clean two-line statement
        ctx.fillStyle = '#444'; ctx.font = '22px Georgia, serif';
        ctx.fillText('ಕನ್ನಡ ಲಿಪಿ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಕೋರ್ಸ್ ಅನ್ನು ಯಶಸ್ವಿಯಾಗಿ', W / 2, 520);
        ctx.fillText('ಪೂರ್ಣಗೊಳಿಸಿದ್ದಕ್ಕಾಗಿ ಇದನ್ನು ನೀಡಲಾಗಿದೆ.', W / 2, 552);

        // Gold seal / badge
        const sex = W / 2, sey = 670, R = 52;
        const sg = ctx.createLinearGradient(sex - R, sey - R, sex + R, sey + R);
        sg.addColorStop(0, '#FFE066'); sg.addColorStop(1, '#E0A800');
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sex, sey, R, 0, 7); ctx.fill();
        ctx.strokeStyle = '#D71920'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(sex, sey, R, 0, 7); ctx.stroke();
        ctx.fillStyle = '#D71920';
        for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; ctx.beginPath(); ctx.arc(sex + Math.cos(a) * (R + 6), sey + Math.sin(a) * (R + 6), 2.5, 0, 7); ctx.fill(); }
        ctx.fillStyle = '#7a1010'; ctx.font = 'bold 30px serif'; ctx.fillText('★', sex, sey - 2);
        ctx.font = 'bold 13px Georgia, serif'; ctx.fillText('KANNADA', sex, sey + 18); ctx.fillText('LIPI', sex, sey + 32);

        // Footer
        ctx.textAlign = 'left'; ctx.fillStyle = '#777'; ctx.font = '17px Georgia, serif';
        ctx.fillText('ದಿನಾಂಕ: ' + dateStr, 130, 770);
        ctx.textAlign = 'right'; ctx.fillText('k-lipi.in', W - 130, 770);
        ctx.textAlign = 'center'; ctx.fillStyle = '#aaa'; ctx.font = 'italic 15px Georgia, serif';
        ctx.fillText('ಕರ್ನಾಟಕದ ಮೊದಲ ಕನ್ನಡ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ', W / 2, 795);

        return c;
    };

    const issue = () => {
        if (!name.trim()) { alert('ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ'); return; }
        localStorage.setItem('kl_cert_name', name.trim());
        setIssued(true);
        setTimeout(drawCertificate, 50);
    };

    const downloadCert = () => {
        const c = drawCertificate();
        c.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'kannada-lipi-certificate.png';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    };

    const shareCert = async () => {
        const c = drawCertificate();
        c.toBlob(async (blob) => {
            const file = new File([blob], 'kannada-lipi-certificate.png', { type: 'image/png' });
            const text = `ನಾನು ಕನ್ನಡ ಲಿಪಿಯಲ್ಲಿ ಕೋಡಿಂಗ್ ಕಲಿತೆ! k-lipi.in`;
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try { await navigator.share({ files: [file], text, title: 'ಕನ್ನಡ ಲಿಪಿ' }); return; } catch { /* cancelled */ }
            }
            // Fallback: download + copy text
            downloadCert();
            try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
            alert('ಚಿತ್ರ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ — ಈಗ ಹಂಚಿಕೊಳ್ಳಿ!');
        });
    };

    return (
        <div className="cert-page animate-in">
            <header className="page-header">
                <h1 className="page-header-title">
                    <span className="page-header-icon"><Award size={28} /></span>
                    ಪ್ರಮಾಣಪತ್ರ
                </h1>
                <p className="page-header-subtitle">ಎಲ್ಲಾ ಪಾಠಗಳನ್ನು ಮುಗಿಸಿ, ನಿಮ್ಮ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ</p>
            </header>

            <div className="cert-content">
                {/* Progress */}
                <div className="cert-progress-card panel">
                    <div className="cert-progress-top">
                        <span>ಪ್ರಗತಿ</span>
                        <strong>{done} / {TOTAL_LESSONS} ಪಾಠಗಳು</strong>
                    </div>
                    <div className="cert-bar"><div className="cert-bar-fill" style={{ width: `${pct}%` }} /></div>
                </div>

                {!eligible ? (
                    <div className="cert-locked panel">
                        <Lock size={44} />
                        <h3>ಇನ್ನೂ {TOTAL_LESSONS - done} ಪಾಠಗಳು ಬಾಕಿ</h3>
                        <p>ಎಲ್ಲಾ {TOTAL_LESSONS} ಪಾಠಗಳನ್ನು ಮುಗಿಸಿದ ನಂತರ ಪ್ರಮಾಣಪತ್ರ ಲಭ್ಯ.</p>
                        <NavLink to="/learn" className="btn btn-primary">ಕಲಿಕೆ ಮುಂದುವರಿಸಿ</NavLink>
                    </div>
                ) : !issued ? (
                    <div className="cert-form panel">
                        <h3><Award size={22} style={{ verticalAlign: "-4px", color: "var(--k-red)" }} /> ಅಭಿನಂದನೆಗಳು! ನೀವು ಅರ್ಹರಾಗಿದ್ದೀರಿ</h3>
                        <p>ಪ್ರಮಾಣಪತ್ರದ ಮೇಲೆ ಬರಬೇಕಾದ ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ:</p>
                        <input
                            className="cert-name-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="ನಿಮ್ಮ ಹೆಸರು"
                            maxLength={40}
                        />
                        <button className="btn btn-primary" onClick={issue}>
                            <Award size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> ಪ್ರಮಾಣಪತ್ರ ರಚಿಸಿ
                        </button>
                    </div>
                ) : (
                    <div className="cert-result panel">
                        <canvas ref={canvasRef} className="cert-canvas" />
                        <div className="cert-actions">
                            <button className="btn btn-primary" onClick={downloadCert}>
                                <Download size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> ಡೌನ್‌ಲೋಡ್
                            </button>
                            <button className="btn btn-accent" onClick={shareCert}>
                                <Share2 size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> ಹಂಚಿಕೊಳ್ಳಿ
                            </button>
                            <button className="btn btn-secondary" onClick={() => setIssued(false)}>ಹೆಸರು ಬದಲಿಸಿ</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Certificate;
