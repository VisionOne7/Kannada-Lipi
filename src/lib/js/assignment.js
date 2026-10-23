/**
 * Teacher assignment links. Everything lives in the link itself (?a=...),
 * so there is no server, no login and nothing stored about students.
 * { v: 1, title, task, starter, expected } where `expected` is the output
 * of the teacher's model answer ('' = any program that runs and prints).
 */
import { encodeJSON, decodeJSON } from './share.js';

const DIGITS = { '೦': '0', '೧': '1', '೨': '2', '೩': '3', '೪': '4', '೫': '5', '೬': '6', '೭': '7', '೮': '8', '೯': '9' };

// Compare outputs loosely: Kannada/English digits and extra spaces don't matter.
export const normalizeOutput = (text) => String(text || '')
    .replace(/[೦-೯]/g, (d) => DIGITS[d])
    .split('\n')
    .map((l) => l.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .join('\n');

export const assignmentLink = (data) => `${window.location.origin}/assignment?a=${encodeJSON({ v: 1, ...data })}`;

export const readAssignment = (param) => {
    const data = decodeJSON(param);
    if (!data || data.v !== 1 || typeof data.title !== 'string') return null;
    return {
        title: data.title.slice(0, 120),
        task: String(data.task || '').slice(0, 2000),
        starter: String(data.starter || '').slice(0, 5000),
        expected: String(data.expected || '').slice(0, 5000),
    };
};

/** { ok, reason } for a student's run result. */
export const checkAssignment = (assignment, result) => {
    if (!result.success) return { ok: false, reason: 'error' };
    if (!assignment.expected) return { ok: Boolean(normalizeOutput(result.output)), reason: 'empty' };
    return normalizeOutput(result.output) === normalizeOutput(assignment.expected)
        ? { ok: true }
        : { ok: false, reason: 'different' };
};
