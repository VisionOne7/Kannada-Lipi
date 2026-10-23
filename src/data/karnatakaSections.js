/**
 * The Karnataka section of the site, in one list.
 * Used by the /karnataka hub page, the header menu and the home page, so a new
 * Karnataka page only needs adding here.
 */
import { Landmark, MapPin, Sparkles, IndianRupee, HelpCircle, HandHeart, Building2, GraduationCap, Link } from 'lucide-react';

export const KARNATAKA_SECTIONS = [
    {
        id: 'culture',
        path: '/karnataka/culture',
        icon: Landmark,
        title: 'ಕರ್ನಾಟಕ ವೈಭವ',
        titleEn: 'Culture & History',
        desc: 'ಇತಿಹಾಸ, ಭೂಗೋಳ, ಕಲೆ, ಹಬ್ಬಗಳು, ಅಡುಗೆ ಮತ್ತು ಪ್ರಸಿದ್ಧ ವ್ಯಕ್ತಿಗಳು',
        descEn: 'History, geography, art, festivals, food and famous people',
        group: 'explore',
    },
    {
        id: 'districts',
        path: '/districts',
        icon: MapPin,
        title: 'ಜಿಲ್ಲೆಗಳು',
        titleEn: 'Districts & Map',
        desc: 'ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ, ಜನಸಂಖ್ಯೆ, ಸಾಕ್ಷರತೆ ಮತ್ತು ಆರ್ಥಿಕ ಉತ್ಪನ್ನ',
        descEn: 'Interactive map, population, literacy and economic output',
        group: 'explore',
    },
    {
        id: 'wonders',
        path: '/wonders',
        icon: Sparkles,
        title: 'ಅದ್ಭುತಗಳು',
        titleEn: 'Wonders',
        desc: 'ದಾಖಲೆಗಳು, ಪಾರಂಪರಿಕ ತಾಣಗಳು ಮತ್ತು ಪ್ರಕೃತಿಯ ಅಚ್ಚರಿಗಳು',
        descEn: 'Records, heritage sites and natural wonders',
        group: 'explore',
    },
    {
        id: 'economy',
        path: '/economy',
        icon: IndianRupee,
        title: 'ಆರ್ಥಿಕತೆ',
        titleEn: 'Economy',
        desc: 'ಐಟಿ, ಕೃಷಿ, ರೇಷ್ಮೆ, ಕಾಫಿ — ರಾಜ್ಯದ ಆರ್ಥಿಕ ಶಕ್ತಿಯ ನೋಟ',
        descEn: 'IT, farming, silk, coffee: a look at the state economy',
        group: 'explore',
    },
    {
        id: 'quiz',
        path: '/quiz',
        icon: HelpCircle,
        title: 'ರಸಪ್ರಶ್ನೆ',
        titleEn: 'Quiz',
        desc: 'ನಿಮಗೆ ಕರ್ನಾಟಕದ ಬಗ್ಗೆ ಎಷ್ಟು ಗೊತ್ತು? ಪರೀಕ್ಷಿಸಿಕೊಳ್ಳಿ',
        descEn: 'How well do you know Karnataka? Test yourself',
        group: 'explore',
    },
    {
        id: 'schemes',
        path: '/schemes',
        icon: HandHeart,
        title: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
        titleEn: 'Government Schemes',
        desc: 'ಪ್ರಮುಖ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು, ಅರ್ಹತೆ ಮತ್ತು ಪ್ರಯೋಜನಗಳು',
        descEn: 'Major welfare schemes, eligibility and benefits',
        group: 'services',
    },
    {
        id: 'services',
        path: '/services',
        icon: Building2,
        title: 'ಇ-ಸೇವೆಗಳು',
        titleEn: 'e-Services',
        desc: 'ದಿನನಿತ್ಯ ಬೇಕಾಗುವ ಸರ್ಕಾರಿ ಆನ್‌ಲೈನ್ ಸೇವೆಗಳಿಗೆ ನೇರ ಲಿಂಕ್',
        descEn: 'Direct links to everyday government online services',
        group: 'services',
    },
    {
        id: 'students',
        path: '/student-resources',
        icon: GraduationCap,
        title: 'ವಿದ್ಯಾರ್ಥಿ ಸಂಪನ್ಮೂಲ',
        titleEn: 'Student Resources',
        desc: 'ವಿದ್ಯಾರ್ಥಿವೇತನ, ಪರೀಕ್ಷೆ ಮತ್ತು ಶಿಕ್ಷಣ ಪೋರ್ಟಲ್‌ಗಳು',
        descEn: 'Scholarships, exams and education portals',
        group: 'services',
    },
    {
        id: 'links',
        path: '/links',
        icon: Link,
        title: 'ಉಪಯುಕ್ತ ಲಿಂಕ್‌ಗಳು',
        titleEn: 'Useful Links',
        desc: 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಜಾಲತಾಣಗಳು ಒಂದೇ ಕಡೆ',
        descEn: 'Official government websites in one place',
        group: 'services',
    },
];

export const KARNATAKA_PATHS = ['/karnataka', ...KARNATAKA_SECTIONS.map((s) => s.path)];
