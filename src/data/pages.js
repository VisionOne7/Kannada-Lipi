/**
 * Every page on the site, for the search palette and the browser tab title.
 * Karnataka pages come from karnatakaSections.js so they stay in one place.
 */
import {
    House, BookOpen, Smile, Flame, Gamepad2, Trophy, GraduationCap, Info, Shield, FileText, Award,
    Compass, ClipboardCheck, ClipboardList,
} from 'lucide-react';
import { KARNATAKA_SECTIONS } from './karnatakaSections';

export const PAGES = [
    { path: '/', kn: 'ಮುಖಪುಟ', en: 'Home', icon: House },
    { path: '/learn', kn: 'ಕಲಿಯಿರಿ', en: 'Learn', icon: BookOpen },
    { path: '/progress', kn: 'ನನ್ನ ಕಲಿಕೆ', en: 'My learning', icon: Trophy },
    { path: '/kids', kn: 'ಮಕ್ಕಳ ಕೋಡ್ ಲೋಕ', en: 'Kids zone', icon: Smile },
    { path: '/challenge', kn: 'ಇಂದಿನ ಸವಾಲು', en: 'Daily challenge', icon: Flame },
    { path: '/games', kn: 'ಆಟಗಳು', en: 'Games', icon: Gamepad2 },
    { path: '/teachers', kn: 'ಶಿಕ್ಷಕರಿಗೆ', en: 'For teachers', icon: GraduationCap },
    { path: '/class', kn: 'ತರಗತಿ ಫಲಿತಾಂಶ', en: 'Class results', icon: ClipboardList },
    { path: '/certificate', kn: 'ಪ್ರಮಾಣಪತ್ರ', en: 'Certificate', icon: Award },
    { path: '/karnataka', kn: 'ಕರ್ನಾಟಕ', en: 'Karnataka', icon: Compass },
    ...KARNATAKA_SECTIONS.map((s) => ({ path: s.path, kn: s.title, en: s.titleEn, icon: s.icon })),
    { path: '/assignment', kn: 'ಕಾರ್ಯ', en: 'Assignment', icon: ClipboardCheck, hidden: true },
    { path: '/about', kn: 'ನಮ್ಮ ಬಗ್ಗೆ', en: 'About', icon: Info },
    { path: '/privacy', kn: 'ಗೌಪ್ಯತಾ ನೀತಿ', en: 'Privacy policy', icon: Shield },
    { path: '/terms', kn: 'ಬಳಕೆಯ ನಿಯಮಗಳು', en: 'Terms of use', icon: FileText },
];

export const pageFor = (path) => PAGES.find((p) => p.path === path);
