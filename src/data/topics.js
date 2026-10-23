/**
 * Learning hub topics.
 * Each topic groups the lessons, examples and reference entries that teach
 * the same idea, so the learner finds all three in one place.
 * Lesson and example ids refer to lessons.js and examples.js; `reference`
 * lists FUNCTION_CATEGORIES ids and `extras` lists operator/control tables.
 */

export const TOPICS = [
    {
        id: 'start',
        title: 'ಆರಂಭ',
        titleEn: 'Getting Started',
        iconKey: 'Rocket',
        summary: 'ಮುದ್ರಿಸು(), ವೇರಿಯಬಲ್‌ಗಳು ಮತ್ತು ನಿಮ್ಮ ಮೊದಲ ಪ್ರೋಗ್ರಾಂ',
        lessons: [1, 2],
        examples: [1, 6, 7],
        reference: ['output'],
        extras: [],
    },
    {
        id: 'math',
        title: 'ಗಣಿತ',
        titleEn: 'Math',
        iconKey: 'Calculator',
        summary: 'ಲೆಕ್ಕಾಚಾರ, ಸ್ಥಿರಾಂಕಗಳು, ತ್ರಿಕೋನಮಿತಿ ಮತ್ತು ಸುಧಾರಿತ ಗಣಿತ',
        lessons: [3, 8, 11, 14, 15, 18],
        examples: [2, 8, 9, 13, 19, 22, 23, 26],
        reference: ['math-basic', 'math-advanced', 'trigonometry'],
        extras: ['arithmetic'],
    },
    {
        id: 'logic',
        title: 'ಷರತ್ತು ಮತ್ತು ಲೂಪ್',
        titleEn: 'Conditions & Loops',
        iconKey: 'GitBranch',
        summary: 'ಆದರೆ / ಇಲ್ಲದಿದ್ದರೆ, ಹೋಲಿಕೆ ಮತ್ತು ಪುನರಾವರ್ತನೆ',
        lessons: [4],
        examples: [4, 11, 18],
        reference: [],
        extras: ['comparison', 'logical', 'conditionals', 'loops'],
    },
    {
        id: 'strings',
        title: 'ಪಠ್ಯ',
        titleEn: 'Text',
        iconKey: 'Type',
        summary: 'ಪಠ್ಯ ಜೋಡಿಸು, ಕತ್ತರಿಸು, ಹುಡುಕು ಮತ್ತು ರೂಪಿಸು',
        lessons: [7, 16, 21],
        examples: [3, 10, 14, 17, 24, 29],
        reference: ['string'],
        extras: [],
    },
    {
        id: 'lists',
        title: 'ಪಟ್ಟಿಗಳು',
        titleEn: 'Lists',
        iconKey: 'List',
        summary: 'ಪಟ್ಟಿ, ವಿಂಗಡಣೆ, ಶ್ರೇಣಿ, ನಿಘಂಟು ಮತ್ತು ನಕ್ಷೆ / ಶೋಧಕ',
        lessons: [5, 10, 12, 13, 20],
        examples: [5, 20, 21, 28],
        reference: ['sorting', 'array', 'higher-order', 'dictionary'],
        extras: [],
    },
    {
        id: 'types',
        title: 'ಪ್ರಕಾರಗಳು',
        titleEn: 'Types',
        iconKey: 'RefreshCw',
        summary: 'ಸಂಖ್ಯೆ ↔ ಪಠ್ಯ ಪರಿವರ್ತನೆ ಮತ್ತು ಪ್ರಕಾರ ಪರಿಶೀಲನೆ',
        lessons: [9, 17, 19],
        examples: [15, 16, 25, 27],
        reference: ['type-conversion'],
        extras: [],
    },
    {
        id: 'datetime',
        title: 'ದಿನಾಂಕ ಮತ್ತು ಸಮಯ',
        titleEn: 'Date & Time',
        iconKey: 'Clock',
        summary: 'ಇಂದಿನ ದಿನಾಂಕ, ಸಮಯ, ವರ್ಷ ಮತ್ತು ತಿಂಗಳು',
        lessons: [6],
        examples: [12],
        reference: ['datetime'],
        extras: [],
    },
    {
        id: 'turtle',
        title: 'ಆಮೆ ಚಿತ್ರ',
        titleEn: 'Turtle Drawing',
        iconKey: 'PenTool',
        summary: 'ಆಮೆಯನ್ನು ಚಲಿಸಿ ಆಕಾರಗಳನ್ನು ಬಿಡಿಸಿ',
        lessons: [],
        examples: [30, 31],
        reference: ['turtle'],
        extras: [],
    },
];

export const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

// Which topic a lesson belongs to (for the lesson view's related panel).
export const TOPIC_OF_LESSON = Object.fromEntries(
    TOPICS.flatMap((t) => t.lessons.map((id) => [id, t.id]))
);
