import React, { useState } from 'react';
import { Link2, Copy, ExternalLink, Wand2 } from 'lucide-react';
import { kannadaLipi } from '../lib/js/interpreter/index.js';
import { assignmentLink } from '../lib/js/assignment.js';
import '../pages/Assignment.css';

// Teachers write a task, starting code and a model answer; the link carries it all.
const AssignmentBuilder = () => {
    const [title, setTitle] = useState('');
    const [task, setTask] = useState('');
    const [starter, setStarter] = useState('');
    const [solution, setSolution] = useState('');
    const [link, setLink] = useState('');
    const [msg, setMsg] = useState('');

    const build = () => {
        setMsg('');
        if (!title.trim()) { setMsg('ಕಾರ್ಯಕ್ಕೆ ಒಂದು ಶೀರ್ಷಿಕೆ ಕೊಡಿ.'); return; }
        let expected = '';
        if (solution.trim()) {
            const r = kannadaLipi.execute(solution);
            if (!r.success) { setMsg('ಮಾದರಿ ಉತ್ತರದಲ್ಲಿ ದೋಷವಿದೆ: ' + r.output.split('\n').slice(-2).join(' ')); return; }
            expected = r.output;
        }
        setLink(assignmentLink({ title: title.trim(), task: task.trim(), starter, expected }));
    };

    const copy = async () => {
        try { await navigator.clipboard.writeText(link); setMsg('ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ. ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಕಳುಹಿಸಿ.'); } catch { setMsg('ನಕಲಿಸಲು ಆಗಲಿಲ್ಲ. ಲಿಂಕ್ ಅನ್ನು ಕೈಯಾರೆ ಆಯ್ಕೆ ಮಾಡಿ.'); }
    };

    const example = () => {
        setTitle('೧ ರಿಂದ ೫ ರ ವರೆಗೆ ಎಣಿಸಿ');
        setTask('ಪುನರಾವರ್ತನೆ ಬಳಸಿ ೧ ರಿಂದ ೫ ರ ವರೆಗಿನ ಸಂಖ್ಯೆಗಳನ್ನು ಒಂದೊಂದು ಸಾಲಿನಲ್ಲಿ ಮುದ್ರಿಸಿ.');
        setStarter('# ಇಲ್ಲಿ ನಿಮ್ಮ ಕೋಡ್ ಬರೆಯಿರಿ\n');
        setSolution('ಪುನರಾವರ್ತನೆ ನ ೧ ರಿಂದ ೫ ವರೆಗೆ: ಮುದ್ರಿಸು(ನ)');
        setLink('');
    };

    return (
        <div className="asg-builder">
            <label>
                ಶೀರ್ಷಿಕೆ <span>Title</span>
                <input value={title} onChange={(e) => { setTitle(e.target.value); setLink(''); }} maxLength={120} placeholder="ಉದಾ: ಚೌಕದ ವಿಸ್ತೀರ್ಣ" />
            </label>
            <label>
                ಕಾರ್ಯ ವಿವರಣೆ <span>What should students do?</span>
                <textarea className="asg-task-input" value={task} onChange={(e) => { setTask(e.target.value); setLink(''); }} maxLength={2000} placeholder="ಉದಾ: ಉದ್ದ = ೫ ಎಂದಿಟ್ಟು, ಚೌಕದ ವಿಸ್ತೀರ್ಣ ಮುದ್ರಿಸಿ." />
            </label>
            <div className="asg-builder-row">
                <label>
                    ಆರಂಭದ ಕೋಡ್ <span>Starting code students see (optional)</span>
                    <textarea value={starter} onChange={(e) => { setStarter(e.target.value); setLink(''); }} spellCheck="false" />
                </label>
                <label>
                    ಮಾದರಿ ಉತ್ತರ <span>Model answer: students' output must match its output (optional)</span>
                    <textarea value={solution} onChange={(e) => { setSolution(e.target.value); setLink(''); }} spellCheck="false" />
                </label>
            </div>
            <div className="asg-builder-actions">
                <button className="btn btn-primary" onClick={build}><Link2 size={15} /> ಲಿಂಕ್ ರಚಿಸಿ</button>
                <button className="btn btn-secondary" onClick={example}><Wand2 size={15} /> ಉದಾಹರಣೆ ತುಂಬಿಸಿ</button>
            </div>
            {msg && <p className="asg-builder-note" role="status">{msg}</p>}
            {link && (
                <div className="asg-builder-out">
                    <code>{link}</code>
                    <div className="asg-builder-actions">
                        <button className="btn btn-accent" onClick={copy}><Copy size={15} /> ಲಿಂಕ್ ನಕಲಿಸಿ</button>
                        <a className="btn btn-secondary" href={link} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> ವಿದ್ಯಾರ್ಥಿಯಂತೆ ನೋಡಿ</a>
                    </div>
                </div>
            )}
            <p className="asg-builder-note">
                ಎಲ್ಲಾ ವಿವರಗಳು ಲಿಂಕ್‌ನಲ್ಲೇ ಇರುತ್ತವೆ: ಸರ್ವರ್ ಇಲ್ಲ, ಲಾಗಿನ್ ಇಲ್ಲ. ಕಾರ್ಯ ಮುಗಿಸಿದ ವಿದ್ಯಾರ್ಥಿಗಳು ಹೆಸರು ಮತ್ತು ಕೋಡ್ ಲಿಂಕ್ ಇರುವ ಸಂದೇಶವನ್ನು ನಿಮಗೆ ಕಳುಹಿಸುತ್ತಾರೆ.
                <br /><span className="legal-en">Everything lives in the link: no server, no login. Students who finish send you a message with their name and a link to their code.</span>
            </p>
        </div>
    );
};

export default AssignmentBuilder;
