/**
 * Learning progress, read from what the site already stores on this device.
 * Badges reward what a learner has mastered, not how often they log in, so a
 * missed day never takes anything away.
 */
import { LESSONS } from '../data/lessons.js';
import { TURTLE_LEVELS } from '../data/turtleLevels.js';
import { TOPICS } from '../data/topics.js';

const read = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch {
        return fallback;
    }
};

export function readProgress() {
    const lessons = (read('kannadalipi_learning', {}).completedLessons || []).filter((id) => LESSONS[id]);
    const kids = read('kl_kids_levels', []).filter((id) => TURTLE_LEVELS.some((l) => l.id === id));
    const programs = read('kl_programs', []);
    let challengeDays = 0;
    try {
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).startsWith('kl_challenge_done_')) challengeDays++;
        }
    } catch { /* storage blocked */ }
    const streak = Number(read('kl_challenge_streak', 0)) || 0;

    const topics = TOPICS.filter((t) => t.lessons.length).map((t) => ({
        ...t,
        done: t.lessons.filter((id) => lessons.includes(id)).length,
        total: t.lessons.length,
    }));

    return {
        lessons, lessonTotal: Object.keys(LESSONS).length,
        kids, kidsTotal: TURTLE_LEVELS.length,
        programs: Array.isArray(programs) ? programs.length : 0,
        challengeDays, streak, topics,
    };
}

// Each badge: id, Lucide icon name, Kannada + English title and how to earn it.
export const BADGES = [
    { id: 'first-lesson', icon: 'Footprints', kn: 'ಮೊದಲ ಹೆಜ್ಜೆ', en: 'First step', howKn: 'ಮೊದಲ ಪಾಠ ಮುಗಿಸಿ', howEn: 'Finish your first lesson', test: (p) => p.lessons.length >= 1 },
    { id: 'loop', icon: 'Repeat', kn: 'ಲೂಪ್ ಮಾಂತ್ರಿಕ', en: 'Loop wizard', howKn: 'ಆಮೆ ಸಾಹಸ ಹಂತ ೬ ಗೆಲ್ಲಿ', howEn: 'Win turtle level 6', test: (p) => p.kids.includes(6) },
    { id: 'half', icon: 'Mountain', kn: 'ಅರ್ಧ ದಾರಿ', en: 'Halfway', howKn: '೧೧ ಪಾಠ ಮುಗಿಸಿ', howEn: 'Finish 11 lessons', test: (p) => p.lessons.length >= 11 },
    { id: 'topic', icon: 'Target', kn: 'ವಿಷಯ ಪರಿಣತ', en: 'Topic master', howKn: 'ಒಂದು ವಿಷಯದ ಎಲ್ಲಾ ಪಾಠ ಮುಗಿಸಿ', howEn: 'Finish every lesson in one topic', test: (p) => p.topics.some((t) => t.done === t.total) },
    { id: 'course', icon: 'GraduationCap', kn: 'ಕೋರ್ಸ್ ವೀರ', en: 'Course hero', howKn: 'ಎಲ್ಲಾ ಪಾಠ ಮುಗಿಸಿ', howEn: 'Finish every lesson', test: (p) => p.lessons.length >= p.lessonTotal },
    { id: 'turtle-friend', icon: 'Turtle', kn: 'ಆಮೆ ಸ್ನೇಹಿ', en: 'Turtle friend', howKn: '೫ ಆಮೆ ಹಂತ ಗೆಲ್ಲಿ', howEn: 'Win 5 turtle levels', test: (p) => p.kids.length >= 5 },
    { id: 'turtle-master', icon: 'Crown', kn: 'ಆಮೆ ಮಾಸ್ಟರ್', en: 'Turtle master', howKn: 'ಎಲ್ಲಾ ಆಮೆ ಹಂತ ಗೆಲ್ಲಿ', howEn: 'Win every turtle level', test: (p) => p.kids.length >= p.kidsTotal },
    { id: 'challenger', icon: 'Flame', kn: 'ಸವಾಲುಗಾರ', en: 'Challenger', howKn: '೫ ದಿನದ ಸವಾಲು ಮುಗಿಸಿ', howEn: 'Solve 5 daily challenges', test: (p) => p.challengeDays >= 5 },
    { id: 'maker', icon: 'FolderHeart', kn: 'ರಚನೆಕಾರ', en: 'Maker', howKn: '೩ ಪ್ರೋಗ್ರಾಂ ಉಳಿಸಿ', howEn: 'Save 3 programs', test: (p) => p.programs >= 3 },
];

export const earnedBadges = (p) => BADGES.filter((b) => b.test(p));
