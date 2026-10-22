import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Code2, Info, Users, AlertTriangle, Mail } from 'lucide-react';
import './Legal.css';
import PageHeader from '../components/PageHeader';

const UPDATED = '೪ ಅಕ್ಟೋಬರ್ ೨೦೨೬ (4 October 2026)';

const Terms = () => (
    <>
        <PageHeader icon={FileText} title="ಬಳಕೆಯ ನಿಯಮಗಳು" subtitle={`Terms of Use · ಕೊನೆಯ ನವೀಕರಣ: ${UPDATED}`} />
        <div className="legal-page animate-in">

        <section className="glass-card legal-section">
            <h2><Code2 size={20} /> ಉಚಿತ ಮತ್ತು ಮುಕ್ತ ಮೂಲ (Free and open source)</h2>
            <p>ಕನ್ನಡ ಲಿಪಿ ಎಲ್ಲರಿಗೂ ಉಚಿತ. ಇದರ ಮೂಲ ಕೋಡ್ MIT ಪರವಾನಗಿಯಡಿ GitHub ನಲ್ಲಿ ಲಭ್ಯವಿದೆ. ಶಾಲೆಗಳು, ಶಿಕ್ಷಕರು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳು ಇದನ್ನು ತರಗತಿಯಲ್ಲಿ ಮುಕ್ತವಾಗಿ ಬಳಸಬಹುದು.</p>
            <p className="legal-en">KannadaLipi is free for everyone. Its source code is available on GitHub under the MIT licence. Schools, teachers and students may use it freely in class.</p>
            <p>ನೀವು ಬರೆಯುವ ಕೋಡ್, ಚಿತ್ರಗಳು ಮತ್ತು ಪ್ರಮಾಣಪತ್ರಗಳು ನಿಮ್ಮವೇ.</p>
            <p className="legal-en">The code, drawings and certificates you create are yours.</p>
        </section>

        <section className="glass-card legal-section">
            <h2><Users size={20} /> ಸರಿಯಾದ ಬಳಕೆ (Acceptable use)</h2>
            <ul className="legal-list">
                <li>ಹಂಚಿಕೊಳ್ಳುವ ಕೋಡ್ ಲಿಂಕ್‌ಗಳಲ್ಲಿ ಇತರರನ್ನು ನೋಯಿಸುವ ಅಥವಾ ಅವಮಾನಿಸುವ ವಿಷಯ ಹಾಕಬೇಡಿ. <span>Don't put hurtful or abusive content in shared code links.</span></li>
                <li>ಸೈಟ್ ಅನ್ನು ಹಾಳುಮಾಡಲು ಅಥವಾ ಅತಿಯಾದ ಸ್ವಯಂಚಾಲಿತ ವಿನಂತಿಗಳನ್ನು ಕಳುಹಿಸಲು ಪ್ರಯತ್ನಿಸಬೇಡಿ. <span>Don't try to disrupt the site or flood it with automated requests.</span></li>
                <li>ಪ್ರಮಾಣಪತ್ರದಲ್ಲಿ ನಿಮ್ಮ ಸ್ವಂತ ಹೆಸರನ್ನೇ ಬಳಸಿ, ಮತ್ತು ಕೋರ್ಸ್ ಪೂರ್ಣಗೊಳಿಸಿದ ನಂತರವೇ ಪಡೆಯಿರಿ. <span>Use your own name on a certificate, and only after completing the course.</span></li>
            </ul>
        </section>

        <section className="glass-card legal-section">
            <h2><Info size={20} /> ಕರ್ನಾಟಕ ಮಾಹಿತಿ (Karnataka information)</h2>
            <p>ಜಿಲ್ಲೆಗಳು, ಯೋಜನೆಗಳು, ಆರ್ಥಿಕತೆ ಮತ್ತು ಸರ್ಕಾರದ ಬಗ್ಗೆ ಇರುವ ಮಾಹಿತಿ ಶೈಕ್ಷಣಿಕ ಉದ್ದೇಶಕ್ಕೆ ಮಾತ್ರ. ಇದು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಮೂಲವಲ್ಲ ಮತ್ತು ಹಳೆಯದಾಗಿರಬಹುದು. ಮುಖ್ಯ ನಿರ್ಧಾರಗಳಿಗೆ ಯಾವಾಗಲೂ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್‌ಗಳನ್ನು ನೋಡಿ.</p>
            <p className="legal-en">Information about districts, schemes, the economy and government is for learning only. It is not an official government source and may be out of date. Always check official government websites before making decisions.</p>
            <p>ಕನ್ನಡ ಲಿಪಿ ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಯೋಜನೆಯಲ್ಲ ಮತ್ತು ಸರ್ಕಾರದೊಂದಿಗೆ ಸಂಬಂಧ ಹೊಂದಿಲ್ಲ.</p>
            <p className="legal-en">KannadaLipi is an independent project. It is not run by, or affiliated with, the Government of Karnataka.</p>
        </section>

        <section className="glass-card legal-section">
            <h2><AlertTriangle size={20} /> ಖಾತರಿ ಇಲ್ಲ (No warranty)</h2>
            <p>ಸೇವೆಯನ್ನು "ಇದ್ದಂತೆಯೇ" ನೀಡಲಾಗಿದೆ. ಅದು ಯಾವಾಗಲೂ ದೋಷರಹಿತವಾಗಿ ಅಥವಾ ನಿರಂತರವಾಗಿ ಲಭ್ಯವಿರುತ್ತದೆ ಎಂದು ನಾವು ಭರವಸೆ ನೀಡುವುದಿಲ್ಲ. ನಿಮ್ಮ ಮುಖ್ಯ ಕೋಡ್ ಅನ್ನು "ಉಳಿಸಿ" ಬಟನ್ ಬಳಸಿ .kl ಫೈಲ್ ಆಗಿ ಇಟ್ಟುಕೊಳ್ಳಿ.</p>
            <p className="legal-en">The service is provided "as is". We don't promise it will always be error-free or available. Keep important programs as .kl files using the Save button.</p>
        </section>

        <section className="glass-card legal-section">
            <h2><Mail size={20} /> ಸಂಪರ್ಕ (Contact)</h2>
            <p>ಪ್ರಶ್ನೆಗಳು ಅಥವಾ ದೂರುಗಳಿಗೆ <a href="mailto:support@visionone7.in">support@visionone7.in</a> ಗೆ ಬರೆಯಿರಿ.</p>
            <p className="legal-en">For questions or complaints, write to <a href="mailto:support@visionone7.in">support@visionone7.in</a>.</p>
            <p className="legal-crosslink">ಗೌಪ್ಯತಾ ನೀತಿಯನ್ನೂ ಓದಿ: <NavLink to="/privacy">Privacy Policy</NavLink></p>
        </section>
    </div>
        </>
);

export default Terms;
