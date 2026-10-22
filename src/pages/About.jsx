import React from 'react';
import { Link } from 'react-router-dom';
import {
    Save, Link as LinkIcon, Lightbulb, Palette, Mic, Smartphone,
    Rocket, Eye, Gem, Github, ClipboardList, Star, GitFork, Code2
} from 'lucide-react';
import './About.css';

const CHANGELOG_DATA = [
    {
        version: "3.1.0",
        date: "ಅಕ್ಟೋಬರ್ ೨೦೨೬",
        author: "KannadaLipi Team",
        isLatest: true,
        sections: [
            {
                title: "ಹೊಸ ವೈಶಿಷ್ಟ್ಯಗಳು (New Features)",
                icon: "new",
                bulletType: "added",
                items: [
                    { tag: "NEW", text: "ಮಕ್ಕಳ ಕೋಡ್ ಲೋಕ - ತರಗತಿ ೩–೮ ಮಕ್ಕಳಿಗಾಗಿ ಪ್ರತ್ಯೇಕ ವಿಭಾಗ", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಆಮೆ ಚಿತ್ರ (Turtle graphics) - ಮುಂದೆ(), ಬಲಕ್ಕೆ(), ಬಣ್ಣ(), ವೃತ್ತ() ಸೇರಿ ೧೫ ಆಜ್ಞೆಗಳು; ಎಡಿಟರ್‌ನಲ್ಲೇ ಚಿತ್ರ", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಆಮೆ ಸಾಹಸ - ಮಾವಿನ ಹಣ್ಣು, ಚೌಕ, ನಕ್ಷತ್ರ, ಕನ್ನಡ ಬಾವುಟದಂತಹ ೧೨ ಆಟದ ಹಂತಗಳು", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಬ್ಲಾಕ್ ಕೋಡಿಂಗ್ - ಕನ್ನಡ ಬ್ಲಾಕ್‌ಗಳನ್ನು ಎಳೆದು ಜೋಡಿಸಿ; ಅದೇ ಕ್ಷಣ ಕನ್ನಡ ಲಿಪಿ ಕೋಡ್ ಕಾಣುತ್ತದೆ", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಸ್ನೇಹಿ ದೋಷ ಸಂದೇಶಗಳು - ಸಾಲು ಸಂಖ್ಯೆ, ಸರಳ ಕನ್ನಡ ವಿವರಣೆ, ಸಲಹೆ ಮತ್ತು \"ನೀವು ... ಎಂದು ಬರೆಯಲು ಬಯಸಿದ್ದಿರಾ?\"", tagClass: "tag-new" },
                    { tag: "NEW", text: "{ } ಬ್ಲಾಕ್‌ಗಳು - ಲೂಪ್, ಆದರೆ ಮತ್ತು ಕಾರ್ಯಗಳಲ್ಲಿ ಹಲವು ಸಾಲುಗಳು", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಸಹಜ ಕನ್ನಡ ಲೂಪ್ ಕ್ರಮ - ಪುನರಾವರ್ತನೆ ನ ೧ ರಿಂದ ೫ ವರೆಗೆ:", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಆಫ್‌ಲೈನ್ ಆ್ಯಪ್ - ಸ್ಥಾಪಿಸಿ, ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆಯೂ ಕೋಡ್ ಮಾಡಿ", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಶಿಕ್ಷಕರ ಮಾರ್ಗದರ್ಶಿ - ತರಗತಿವಾರು ಪಥ, ಪಾಠ ಯೋಜನೆ, ಮುದ್ರಿಸಬಹುದಾದ ವರ್ಕ್‌ಶೀಟ್", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಗೌಪ್ಯತಾ ನೀತಿ ಮತ್ತು ಬಳಕೆಯ ನಿಯಮಗಳು - \"ನನ್ನ ಡೇಟಾ ಅಳಿಸಿ\" ಬಟನ್ ಸಹಿತ", tagClass: "tag-new" }
                ]
            },
            {
                title: "ಸುಧಾರಣೆಗಳು (Improvements)",
                icon: "improved",
                bulletType: "changed",
                items: [
                    { tag: "UI", text: "ಚಿಕ್ಕ ಹೆಡರ್ - ಇಂದಿನ ಸವಾಲು ಮತ್ತು ಆಟಗಳು ಒಂದೇ \"ಆಟ & ಸವಾಲು\" ಮೆನುವಿನಲ್ಲಿ", tagClass: "tag-ui" },
                    { tag: "IMPROVED", text: "Ctrl + Enter ಒತ್ತಿ ಕೋಡ್ ರನ್ ಮಾಡಿ", tagClass: "tag-improved" },
                    { tag: "FIX", text: "ಅನಂತ ಪುನರಾವರ್ತನೆ ಮತ್ತು ಅತಿ ದೊಡ್ಡ ಲೂಪ್‌ಗಳು ಬ್ರೌಸರ್ ನಿಲ್ಲಿಸುವುದಿಲ್ಲ", tagClass: "tag-fixed" },
                    { tag: "FIX", text: "ಆವರ್ತನೆ ಲೂಪ್ ಈಗ ಅದೇ ಸಾಲಿನ ಆಜ್ಞೆಗಳನ್ನು ಮಾತ್ರ ಪುನರಾವರ್ತಿಸುತ್ತದೆ", tagClass: "tag-fixed" }
                ]
            }
        ]
    },
    {
        version: "3.0.0",
        date: "ಜುಲೈ ೨೦೨೬",
        author: "KannadaLipi Team",
        isLatest: false,
        sections: [
            {
                title: "ಹೊಸ ವೈಶಿಷ್ಟ್ಯಗಳು (New Features)",
                icon: "new",
                bulletType: "added",
                items: [
                    { tag: "NEW", text: "ನಿಘಂಟು (Dictionary) - ಕೀ-ಮೌಲ್ಯ ದತ್ತಾಂಶ ರಚನೆ; ಕೀಗಳು(), ಮೌಲ್ಯಗಳು(), ಕೀ_ಇದೆಯೇ()", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಪ್ರಮಾಣಪತ್ರ - ಎಲ್ಲಾ ಪಾಠ ಮುಗಿಸಿದವರಿಗೆ ಡೌನ್‌ಲೋಡ್/ಹಂಚಿಕೊಳ್ಳಬಹುದಾದ ಪ್ರಮಾಣಪತ್ರ", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಫೈಲ್ ಉಳಿಸಿ/ತೆರೆಯಿರಿ - ಕೋಡ್ ಅನ್ನು .kl ಫೈಲ್ ಆಗಿ ಉಳಿಸಿ, ಮತ್ತೆ ತೆರೆಯಿರಿ", tagClass: "tag-new" },
                    { tag: "NEW", text: "English → ಕನ್ನಡ ಟ್ರಾನ್ಸ್‌ಲಿಟರೇಶನ್ - namaskara → ನಮಸ್ಕಾರ (ಎಡಿಟರ್‌ನಲ್ಲಿ ಟಾಗಲ್)", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಇಂದಿನ ಸವಾಲು - ಪ್ರತಿದಿನ ಹೊಸ ಸವಾಲು + ಸ್ಟ್ರೀಕ್", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಕರ್ನಾಟಕ ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ + ಭೂಗೋಳ, ಸರ್ಕಾರ, ಸಾರಿಗೆ ಮಾಹಿತಿ", tagClass: "tag-new" },
                    { tag: "NEW", text: "೧೦ ಸುಧಾರಿತ ಕಾರ್ಯಗಳು - ಆರಂಭಿಸು, ಕೊನೆಗೊಳ್ಳು, ಸ್ಥಾನ, ಗಣನೆ, ಪದಗಳು, ಸುತ್ತು, ಮಸಾಅ, ಲಸಾಅ, ಅವಿಭಾಜ್ಯವೇ, ಫಿಬೊನಾಚಿ", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಸಂದರ್ಶಕ ಎಣಿಕೆ - ವೆಬ್‌ಸೈಟ್ ಭೇಟಿಗಳ ಲೈವ್ ಎಣಿಕೆ", tagClass: "tag-new" }
                ]
            },
            {
                title: "ಸುಧಾರಣೆಗಳು (Improvements)",
                icon: "improved",
                bulletType: "changed",
                items: [
                    { tag: "UI", text: "ಗ್ಲಾಸ್‌ಮಾರ್ಫಿಸಂ ವಿನ್ಯಾಸ - ಇಡೀ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಆಧುನಿಕ ನೋಟ", tagClass: "tag-ui" },
                    { tag: "UI", text: "ಮುಖಪುಟದಲ್ಲಿ ಎಡಿಟರ್ ಪ್ರಮುಖವಾಗಿ + ಸ್ವಯಂ-ಡೆಮೊ", tagClass: "tag-ui" },
                    { tag: "IMPROVED", text: "ಮೊಬೈಲ್ ಯುಐ ಸುಧಾರಣೆಗಳು (ಪ್ಯಾಡಿಂಗ್, ಓವರ್‌ಫ್ಲೋ)", tagClass: "tag-improved" }
                ]
            }
        ]
    },
    {
        version: "2.2.0",
        date: "ಫೆಬ್ರವರಿ ೨೦೨೬",
        author: "KannadaLipi Team",
        isLatest: false,
        sections: [
            {
                title: "ಹೊಸ ಕೋಡಿಂಗ್ ವೈಶಿಷ್ಟ್ಯಗಳು (New Coding Features)",
                icon: "new",
                bulletType: "added",
                items: [
                    { tag: "NEW", text: "ಲಾಗ್() - ಲಾಗರಿಥಮ್ ಕಾರ್ಯ (ನೈಸರ್ಗಿಕ ಲಾಗ್ ಮತ್ತು ಆಧಾರ ಲಾಗ್)", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಅಂಶ() - ಅಂಶಗಣಿತ (Factorial) ಕಾರ್ಯ (n! ಲೆಕ್ಕ)", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಸರಾಸರಿ() - ಸಂಖ್ಯೆಗಳ ಸರಾಸರಿ/ಮೀನ್ ಕಾರ್ಯ (ಪಟ್ಟಿ ಅಥವಾ ಬಿಡಿ ಸಂಖ್ಯೆಗಳು)", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಪುನರಾವರ್ತಿಸು() - ಪಠ್ಯ ಪುನರಾವರ್ತನೆ ಕಾರ್ಯ (N ಬಾರಿ ಪುನರಾವರ್ತನೆ)", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಅಂಕಿಗಳು() - ಸಂಖ್ಯೆಯ ಅಂಕಿಗಳನ್ನು ಪಟ್ಟಿಯಾಗಿ ಹೊರತೆಗೆಯುವ ಕಾರ್ಯ", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಮೊತ್ತ() - ಸಂಖ್ಯೆಗಳ ಅಥವಾ ಪಟ್ಟಿಯ ಮೊತ್ತ ಲೆಕ್ಕ (Sum)", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಸಂಖ್ಯೆಯೇ() - ಮೌಲ್ಯವು ಸಂಖ್ಯೆಯೇ ಎಂದು ಪರಿಶೀಲನೆ (Is Number)", tagClass: "tag-new" },
                    { tag: "NEW", text: "ವಿಶಿಷ್ಟ() - ಪಟ್ಟಿಯಿಂದ ನಕಲು ಅಂಶಗಳನ್ನು ತೆಗೆಯುವ ಕಾರ್ಯ (Unique)", tagClass: "tag-new" },
                    { tag: "NEW", text: "ತಿರುಗಿಸು() - ಪಟ್ಟಿ/ಪಠ್ಯ ಹಿಮ್ಮುಖಗೊಳಿಸುವ ಕಾರ್ಯ (Reverse Array)", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಪ್ಯಾಡ್() - ಪಠ್ಯ ಭರ್ತಿ ಕಾರ್ಯ (Pad - ಎಡ/ಬಲ ಪ್ಯಾಡಿಂಗ್)", tagClass: "tag-new" },
                    { tag: "NEW", text: "೮ ಹೊಸ ಪಾಠಗಳು (ಒಟ್ಟು ೨೧ ಪಾಠಗಳು)", tagClass: "tag-new" },
                    { tag: "NEW", text: "೮ ಹೊಸ ಕೋಡ್ ಉದಾಹರಣೆಗಳು (ಒಟ್ಟು ೨೯ ಉದಾಹರಣೆಗಳು)", tagClass: "tag-new" }
                ]
            },
            {
                title: "ಸುಧಾರಣೆಗಳು (Improvements)",
                icon: "improved",
                bulletType: "changed",
                items: [
                    { tag: "IMPROVED", text: "ವರ್ಚುವಲ್ ಕೀಬೋರ್ಡ್‌ನಲ್ಲಿ ೧೦ ಹೊಸ ಕಾರ್ಯಗಳು ಸೇರಿಸಲಾಗಿದೆ", tagClass: "tag-improved" },
                    { tag: "IMPROVED", text: "ಡಾಕ್ಯುಮೆಂಟೇಶನ್ ಪುಟದಲ್ಲಿ ಎಲ್ಲಾ ಹೊಸ ಕಾರ್ಯಗಳ ಮಾಹಿತಿ", tagClass: "tag-improved" },
                    { tag: "IMPROVED", text: "ಬಗ್ಗೆ ಪುಟದಲ್ಲಿ ನವೀಕರಿಸಿದ ಅಂಕಿಅಂಶಗಳು (೩೦+ ಕಾರ್ಯಗಳು, ೨೧ ಪಾಠಗಳು)", tagClass: "tag-improved" }
                ]
            }
        ]
    },
    {
        version: "2.1.0",
        date: "ಫೆಬ್ರವರಿ ೨೦೨೬",
        author: "KannadaLipi Team",
        isLatest: false,
        sections: [
            {
                title: "UI/UX ಸುಧಾರಣೆಗಳು (UI/UX Improvements)",
                icon: "improved",
                bulletType: "changed",
                items: [
                    { tag: "UI", text: "ಎಲ್ಲಾ ಪುಟಗಳಿಗೆ ಆಧುನಿಕ ವಿನ್ಯಾಸ - ಕರ್ನಾಟಕ, ಸಹಾಯ, ಉದಾಹರಣೆ, ಕಲಿಕೆ, ಬಗ್ಗೆ, ಚೇಂಜ್‌ಲಾಗ್", tagClass: "tag-ui" },
                    { tag: "UI", text: "ವಿಕಿ-ಶೈಲಿಯ ಕರ್ನಾಟಕ ಪುಟ - ಇನ್ಫೋಬಾಕ್ಸ್, ಫಾಸ್ಟ್ ಫ್ಯಾಕ್ಟ್ಸ್, ಟೈಮ್‌ಲೈನ್", tagClass: "tag-ui" },
                    { tag: "UI", text: "ಡಾಕ್ಯುಮೆಂಟೇಶನ್-ಶೈಲಿಯ ಸಹಾಯ ಪುಟ - ಕ್ವಿಕ್ ರೆಫರೆನ್ಸ್, ಫಂಕ್ಷನ್ ಕಾರ್ಡ್‌ಗಳು", tagClass: "tag-ui" },
                    { tag: "UI", text: "ಮೊಬೈಲ್-ಫಸ್ಟ್ ರೆಸ್ಪಾನ್ಸಿವ್ ವಿನ್ಯಾಸ - ಎಲ್ಲಾ ಪುಟಗಳಲ್ಲಿ", tagClass: "tag-ui" },
                    { tag: "IMPROVED", text: "ಸ್ಮೂತ್ ಆನಿಮೇಶನ್‌ಗಳು ಮತ್ತು ಟ್ರಾನ್ಸಿಶನ್‌ಗಳು", tagClass: "tag-improved" },
                    { tag: "IMPROVED", text: "ಪ್ರಿಂಟ್-ಫ್ರೆಂಡ್ಲಿ ಸ್ಟೈಲ್‌ಗಳು", tagClass: "tag-improved" }
                ]
            }
        ]
    },
    {
        version: "2.0.0",
        date: "ಫೆಬ್ರವರಿ ೨೦೨೬",
        author: "KannadaLipi Team",
        isLatest: false,
        sections: [
            {
                title: "ಹೊಸ ವೈಶಿಷ್ಟ್ಯಗಳು (New Features)",
                icon: "new",
                bulletType: "added",
                items: [
                    { tag: "NEW", text: "ಹೊಸ ಗಣಿತ ಕಾರ್ಯಗಳು: ವರ್ಗಮೂಲ(), ಘಾತ(), ಯಾದೃಚ್ಛಿಕ(), ನಿರಪೇಕ್ಷ()", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಪಠ್ಯ ಕಾರ್ಯಗಳು: ಜೋಡಿಸು(), ಉದ್ದ(), ಪ್ರತಿಬಿಂಬ(), ಕತ್ತರಿಸು()", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಪರಿವರ್ತನೆ ಕಾರ್ಯಗಳು: ಸಂಖ್ಯೆಗೆ(), ಪಠ್ಯಕ್ಕೆ()", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಪಟ್ಟಿ ಕಾರ್ಯಗಳು: ಸೇರಿಸು(), ತೆಗೆ(), ವಿಲೀನ()", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಕರ್ನಾಟಕ ಪುಟ - ನಮ್ಮ ರಾಜ್ಯದ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಬದಲಾವಣೆಗಳ ದಾಖಲೆ ಪುಟ (Changelog)", tagClass: "tag-new" }
                ]
            },
            {
                title: "ಸುಧಾರಣೆಗಳು (Improvements)",
                icon: "improved",
                bulletType: "changed",
                items: [
                    { tag: "UI", text: "ವರ್ಚುವಲ್ ಕೀಬೋರ್ಡ್ ಮರುವಿನ್ಯಾಸ - ಹೊಸ ಫ್ಲೋಟಿಂಗ್ ಡಿಸೈನ್", tagClass: "tag-ui" },
                    { tag: "IMPROVED", text: "ಕೀಬೋರ್ಡ್ ಟ್ಯಾಬ್‌ಗಳು 9 ರಿಂದ 4 ಕ್ಕೆ ಕಡಿಮೆ - ಸುಲಭ ನ್ಯಾವಿಗೇಶನ್", tagClass: "tag-improved" },
                    { tag: "IMPROVED", text: "ಸಹಾಯ ಪುಟದಲ್ಲಿ ಹೊಸ ಕಾರ್ಯಗಳ ಡಾಕ್ಯುಮೆಂಟೇಶನ್", tagClass: "tag-improved" },
                    { tag: "IMPROVED", text: "ಉದಾಹರಣೆಗಳ ಪುಟದಲ್ಲಿ ಹೊಸ ಕೋಡ್ ಉದಾಹರಣೆಗಳು", tagClass: "tag-improved" }
                ]
            },
            {
                title: "ದೋಷ ಸರಿಪಡಿಕೆಗಳು (Bug Fixes)",
                icon: "fixed",
                bulletType: "fixed",
                items: [
                    { tag: "FIXED", text: "ಎಡಿಟರ್ ಶೇಡಿಂಗ್ ಸಮಸ್ಯೆ ಸರಿಪಡಿಸಲಾಗಿದೆ", tagClass: "tag-fixed" },
                    { tag: "FIXED", text: "ಟೆಕ್ಸ್ಟ್ ಸೆಲೆಕ್ಷನ್ ದೃಶ್ಯತೆ ಸುಧಾರಿಸಲಾಗಿದೆ", tagClass: "tag-fixed" }
                ]
            }
        ]
    },
    {
        version: "1.0.0",
        date: "ಜನವರಿ ೨೦೨೬",
        author: "KannadaLipi Team",
        isLatest: false,
        sections: [
            {
                title: "ಮೊದಲ ಬಿಡುಗಡೆ (Initial Release)",
                icon: "new",
                bulletType: "added",
                items: [
                    { tag: "NEW", text: "ಕನ್ನಡ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ - ಮೊದಲಿನ ಬಿಡುಗಡೆ", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಮುದ್ರಿಸು(), ಆದರೆ, ಇಲ್ಲವಾದರೆ ಕೀವರ್ಡ್‌ಗಳು", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಪುನರಾವರ್ತನೆ (for) ಮತ್ತು ಆವರ್ತನೆ (while) ಲೂಪ್‌ಗಳು", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಕನ್ನಡ ಸಂಖ್ಯೆಗಳ ಬೆಂಬಲ (೦-೯)", tagClass: "tag-new" },
                    { tag: "NEW", text: "ಸಿಂಟ್ಯಾಕ್ಸ್ ಹೈಲೈಟಿಂಗ್ ಎಡಿಟರ್", tagClass: "tag-new" },
                    { tag: "NEW", text: "ವರ್ಚುವಲ್ ಕನ್ನಡ ಕೀಬೋರ್ಡ್", tagClass: "tag-new" }
                ]
            }
        ]
    }
];

const FUTURE_PLAN_ICONS = { Save, LinkIcon, Lightbulb, Palette, Mic, Smartphone };

const FUTURE_PLANS = [
    { iconKey: "Save", title: "ಫೈಲ್ ಉಳಿಸುವಿಕೆ", desc: "ಕೋಡ್ ಅನ್ನು .kl ಫೈಲ್ ಆಗಿ ಉಳಿಸಿ ಮತ್ತು ತೆರೆಯಿರಿ" },
    { iconKey: "LinkIcon", title: "ಕೋಡ್ ಹಂಚಿಕೆ", desc: "ನಿಮ್ಮ ಕೋಡ್ ಅನ್ನು ಲಿಂಕ್ ಮೂಲಕ ಹಂಚಿಕೊಳ್ಳಿ" },
    { iconKey: "Lightbulb", title: "ಆಟೋ-ಕಂಪ್ಲೀಷನ್", desc: "ಕೀವರ್ಡ್ ಸಲಹೆಗಳು ಟೈಪ್ ಮಾಡುವಾಗ" },
    { iconKey: "Palette", title: "ಗ್ರಾಫಿಕ್ಸ್ ಲೈಬ್ರರಿ", desc: "ಚಿತ್ರಗಳನ್ನು ಬಿಡಿಸುವ ಕಾರ್ಯಗಳು" },
    { iconKey: "Mic", title: "ಧ್ವನಿ ಬೆಂಬಲ", desc: "ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಕೋಡ್ ಬರೆಯಿರಿ" },
    { iconKey: "Smartphone", title: "ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್", desc: "Android ಮತ್ತು iOS ಅಪ್ಲಿಕೇಶನ್" }
];

const FEATURES_DATA = [
    {
        Icon: Rocket,
        title: "ಉದ್ದೇಶ (Mission)",
        description: "ಕನ್ನಡ ಭಾಷೆಯಲ್ಲಿ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಕಲಿಯಲು ಸುಲಭಗೊಳಿಸುವುದು. ಭಾಷಾ ತಡೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ, ಎಲ್ಲರಿಗೂ ಕೋಡಿಂಗ್ ಲಭ್ಯವಾಗುವಂತೆ ಮಾಡುವುದು."
    },
    {
        Icon: Eye,
        title: "ದೃಷ್ಟಿ (Vision)",
        description: "ಪ್ರತಿ ಕನ್ನಡಿಗನೂ ತಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಕೋಡಿಂಗ್ ಕಲಿಯಲು ಸಾಧ್ಯವಾಗುವಂತಹ ತಂತ್ರಜ್ಞಾನ ಕ್ರಾಂತಿ ನಿರ್ಮಿಸುವುದು."
    },
    {
        Icon: Gem,
        title: "ಮೌಲ್ಯಗಳು (Values)",
        description: "ಸರಳತೆ, ಸುಲಭತೆ, ಮತ್ತು ಸಮಾವೇಶತೆ. ನಾವು ತಾಂತ್ರಿಕ ಶಿಕ್ಷಣದ ಪ್ರಜಾಪ್ರಭುತ್ವೀಕರಣದಲ್ಲಿ ನಂಬಿಕೆ ಹೊಂದಿದ್ದೇವೆ."
    }
];

const About = () => {
    // Calculate stats
    const totalVersions = CHANGELOG_DATA.length;
    const totalFeatures = CHANGELOG_DATA.reduce((acc, ver) => {
        return acc + ver.sections.reduce((sAcc, sec) => sAcc + sec.items.length, 0);
    }, 0);
    const latestVersion = CHANGELOG_DATA[0]?.version || "1.0.0";

    return (
        <div className="about-page animate-in">
            {/* Hero Banner */}
            <header className="hero-banner">

                <h1 className="hero-title">ಕನ್ನಡ ಲಿಪಿ</h1>
                <p className="hero-subtitle">ಕರ್ನಾಟಕದ ಮೊದಲ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ</p>
            </header>

            <div className="about-content">
                {/* Mission/Vision Section */}
                <section className="mission-section">
                    <h2 className="section-title">ನಮ್ಮ ದೃಷ್ಟಿಕೋನ (Our Vision)</h2>
                    <div className="features-grid">
                        {FEATURES_DATA.map((feature, idx) => (
                            <article key={idx} className="feature-card">
                                <span className="feature-icon"><feature.Icon size={28} /></span>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p>{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <div className="section-divider"></div>

                {/* Open Source */}
                <section className="dev-section">
                    <h2 className="section-title">ಮುಕ್ತ ಮೂಲ (Open Source)</h2>
                    <article className="opensource-card">
                        <span className="opensource-glow" aria-hidden="true"></span>
                        <div className="opensource-icon"><Github size={30} /></div>
                        <h3 className="opensource-title">ಇದು ಎಲ್ಲರ ಯೋಜನೆ 🤝</h3>
                        <p className="opensource-desc">
                            ಕನ್ನಡ ಲಿಪಿ ಒಂದು ಮುಕ್ತ ಮೂಲ (open-source) ಯೋಜನೆ. ಡೆವಲಪರ್, ಶಿಕ್ಷಕ,
                            ಅಥವಾ ಕನ್ನಡ ಪ್ರೇಮಿ — ಯಾರೂ ಕೊಡುಗೆ ನೀಡಬಹುದು!
                        </p>
                        <div className="opensource-badges">
                            <span className="os-badge"><Code2 size={14} /> React + Vite</span>
                            <span className="os-badge"><Star size={14} /> MIT License</span>
                            <span className="os-badge"><GitFork size={14} /> PRs Welcome</span>
                        </div>
                        <div className="opensource-actions">
                            <a
                                href="https://github.com/VisionOne7/Kannada-Lipi"
                                className="btn btn-primary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Star size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> GitHub‌ನಲ್ಲಿ ⭐ ನೀಡಿ
                            </a>
                            <a
                                href="https://github.com/VisionOne7/Kannada-Lipi/blob/main/CONTRIBUTING.md"
                                className="btn btn-secondary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <GitFork size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> ಕೊಡುಗೆ ನೀಡಿ
                            </a>
                        </div>
                    </article>
                </section>

                <div className="section-divider"></div>

                {/* Changelog Section */}
                <section className="changelog-section" id="changelog">
                    <header className="changelog-header" style={{ background: 'none', border: 'none', paddingBottom: '0', boxShadow: 'none' }}>
                        <h2 className="section-title">
                            <span className="changelog-header-icon" style={{marginRight: '8px'}}><ClipboardList size={22} style={{ verticalAlign: 'middle' }} /></span>
                            ಬದಲಾವಣೆಗಳ ದಾಖಲೆ (Changelog)
                        </h2>
                        <p className="changelog-header-subtitle">ಕನ್ನಡ ಲಿಪಿಯ ಹೊಸ ವೈಶಿಷ್ಟ್ಯಗಳು ಮತ್ತು ನವೀಕರಣಗಳು</p>
                    </header>

                    <div className="changelog-container" style={{ padding: '0', marginTop: 'var(--gap-lg)', boxShadow: 'none' }}>
                        {/* Stats Section */}
                        <div className="changelog-stats">
                            <div className="stat-item">
                                <span className="stat-value">{totalVersions}</span>
                                <span className="stat-label">ಆವೃತ್ತಿಗಳು</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{totalFeatures}</span>
                                <span className="stat-label">ಬದಲಾವಣೆಗಳು</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">v{latestVersion}</span>
                                <span className="stat-label">ಇತ್ತೀಚಿನ</span>
                            </div>
                        </div>

                        {/* Version Cards */}
                        {CHANGELOG_DATA.map((ver, idx) => (
                            <article key={idx} className={`version-card ${ver.isLatest ? 'latest' : ''}`}>
                                <div className="version-header">
                                    <div className="version-avatar">ಕ</div>
                                    <div className="version-meta">
                                        <div className="version-author">{ver.author}</div>
                                        <div className="version-date">{ver.date}</div>
                                    </div>
                                    {ver.isLatest && <span className="version-badge">ಇತ್ತೀಚಿನ</span>}
                                </div>
                                
                                <h3 className="version-title" style={{ fontSize: '1.25rem' }}>
                                    ಆವೃತ್ತಿ <span className="version-number">{ver.version}</span>
                                </h3>
                                
                                <div className="version-body">
                                    {ver.sections.map((section, sIdx) => (
                                        <div key={sIdx} className="change-section">
                                            <h4 className="change-section-title" style={{ fontSize: '0.9rem' }}>
                                                <span className={`change-section-icon ${section.icon}`}>
                                                    {section.icon === 'new' ? '+' : section.icon === 'improved' ? '~' : '-'}
                                                </span>
                                                {section.title}
                                            </h4>
                                            <ul className="change-list">
                                                {section.items.map((item, iIdx) => (
                                                    <li key={iIdx} className="change-item">
                                                        <span className={`change-bullet ${section.bulletType}`}>
                                                            {section.bulletType === 'added' ? '+' : section.bulletType === 'changed' ? '~' : '-'}
                                                        </span>
                                                        <div className="change-text">
                                                            <span className={`change-tag ${item.tagClass}`}>{item.tag}</span>
                                                            {item.text}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}

                        {/* Future Plans Section */}
                        <section className="future-section">
                            <div className="future-header" style={{ marginBottom: 'var(--gap-lg)' }}>
                                <h3 className="future-title" style={{ fontSize: '1.25rem' }}>
                                    <span style={{marginRight: '8px'}}><Rocket size={18} style={{ verticalAlign: 'middle' }} /></span>
                                    ಭವಿಷ್ಯದ ಯೋಜನೆಗಳು
                                </h3>
                                <p className="future-subtitle">ಮುಂಬರುವ ಆವೃತ್ತಿಗಳಲ್ಲಿ ಸೇರಿಸಲಾಗುವ ವೈಶಿಷ್ಟ್ಯಗಳು</p>
                            </div>
                            <div className="future-grid">
                                {FUTURE_PLANS.map((plan, idx) => (
                                    <article key={idx} className="future-item">
                                        <h4 style={{ fontSize: '0.85rem' }}>
                                            <span style={{marginRight: '6px'}}>{React.createElement(FUTURE_PLAN_ICONS[plan.iconKey], { size: 16, style: { verticalAlign: 'middle' } })}</span>
                                            {plan.title}
                                        </h4>
                                        <p style={{ fontSize: '0.8rem' }}>{plan.desc}</p>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>
                </section>

                {/* Call to Action */}

                <aside className="inspire-banner">
                    <p className="inspire-quote">"ಕಲಿಯೋಕೆ ಕೋಟಿ ಭಾಷೆ, ಆಡೋಕೆ ಒಂದೇ ಭಾಷೆ"</p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link
                            to="/"
                            className="btn btn-primary btn-lg"
                            style={{ background: 'white', color: 'var(--k-red)' }}
                        >
                            <Rocket size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} /> ಇಂದೇ ಕೋಡಿಂಗ್ ಆರಂಭಿಸಿ
                        </Link>

                    </div>
                </aside>
            </div>
        </div>
    );
};

export default About;
