import React from 'react';
import CodeEditor from '../components/CodeEditor';
import './Embed.css';

/**
 * Embed view — a stripped-down editor with no header/footer, meant to be
 * dropped into other sites via an <iframe>. The route is excluded from the
 * normal app chrome in App.jsx.
 */
const Embed = () => {
    return (
        <div className="embed-page">
            <CodeEditor />
            <a
                className="embed-credit"
                href={window.location.origin}
                target="_blank"
                rel="noopener noreferrer"
            >
                ಕನ್ನಡ ಲಿಪಿ — K-Lipi
            </a>
        </div>
    );
};

export default Embed;
