/**
 * Offline English → Kannada phonetic typing (no network needed).
 *
 * Follows the common Baraha/ITRANS style used in Karnataka:
 *   mudrisu → ಮುದ್ರಿಸು   aadare → ಆದರೆ   namaskaara → ನಮಸ್ಕಾರ
 *   Capitals pick retroflex / long sounds: T ಟ, D ಡ, N ಣ, L ಳ, E ಏ, O ಓ.
 * Every K-Lipi keyword is spelled out in WORDS, so code words always come out
 * right even where the phonetic rules would be ambiguous.
 */

// Longest patterns first within each table.
const VOWELS = [
    ['aa', 'ಆ', 'ಾ'], ['A', 'ಆ', 'ಾ'], ['ii', 'ಈ', 'ೀ'], ['ee', 'ಈ', 'ೀ'], ['I', 'ಈ', 'ೀ'],
    ['uu', 'ಊ', 'ೂ'], ['oo', 'ಊ', 'ೂ'], ['U', 'ಊ', 'ೂ'], ['Ru', 'ಋ', 'ೃ'],
    ['ai', 'ಐ', 'ೈ'], ['au', 'ಔ', 'ೌ'], ['ou', 'ಔ', 'ೌ'], ['ae', 'ಏ', 'ೇ'], ['E', 'ಏ', 'ೇ'], ['O', 'ಓ', 'ೋ'],
    ['a', 'ಅ', ''], ['i', 'ಇ', 'ಿ'], ['u', 'ಉ', 'ು'], ['e', 'ಎ', 'ೆ'], ['o', 'ಒ', 'ೊ'],
];

const CONSONANTS = [
    ['ksh', 'ಕ್ಷ'], ['chh', 'ಛ'], ['jn', 'ಜ್ಞ'], ['gn', 'ಜ್ಞ'],
    ['kh', 'ಖ'], ['gh', 'ಘ'], ['ch', 'ಚ'], ['jh', 'ಝ'], ['Th', 'ಠ'], ['Dh', 'ಢ'],
    ['th', 'ಥ'], ['dh', 'ಧ'], ['ph', 'ಫ'], ['bh', 'ಭ'], ['sh', 'ಶ'], ['Sh', 'ಷ'],
    ['k', 'ಕ'], ['g', 'ಗ'], ['c', 'ಕ'], ['q', 'ಕ'], ['j', 'ಜ'], ['z', 'ಜ'], ['x', 'ಕ್ಷ'],
    ['T', 'ಟ'], ['D', 'ಡ'], ['N', 'ಣ'], ['t', 'ತ'], ['d', 'ದ'], ['n', 'ನ'],
    ['p', 'ಪ'], ['f', 'ಫ'], ['b', 'ಬ'], ['m', 'ಮ'], ['y', 'ಯ'], ['r', 'ರ'],
    ['l', 'ಲ'], ['L', 'ಳ'], ['v', 'ವ'], ['w', 'ವ'], ['s', 'ಸ'], ['S', 'ಶ'], ['h', 'ಹ'],
];

const SIGNS = [['M', 'ಂ'], ['H', 'ಃ']];

const VIRAMA = '್';

// Code words in K-Lipi, and their usual English spellings.
const WORDS = {
    mudrisu: 'ಮುದ್ರಿಸು', mudrsu: 'ಮುದ್ರಿಸು', aadare: 'ಆದರೆ', adare: 'ಆದರೆ',
    illavaadare: 'ಇಲ್ಲವಾದರೆ', illavadare: 'ಇಲ್ಲವಾದರೆ', illadiddare: 'ಇಲ್ಲದಿದ್ದರೆ',
    punaraavartane: 'ಪುನರಾವರ್ತನೆ', punaravartane: 'ಪುನರಾವರ್ತನೆ', aavartane: 'ಆವರ್ತನೆ', avartane: 'ಆವರ್ತನೆ',
    rinda: 'ರಿಂದ', varege: 'ವರೆಗೆ', kaarya: 'ಕಾರ್ಯ', karya: 'ಕಾರ್ಯ',
    hintirugisu: 'ಹಿಂತಿರುಗಿಸು', mattu: 'ಮತ್ತು', athavaa: 'ಅಥವಾ', athava: 'ಅಥವಾ',
    satya: 'ಸತ್ಯ', sullu: 'ಸುಳ್ಳು', mundhe: 'ಮುಂದೆ', munde: 'ಮುಂದೆ', hinde: 'ಹಿಂದೆ',
    balakke: 'ಬಲಕ್ಕೆ', edakke: 'ಎಡಕ್ಕೆ', banna: 'ಬಣ್ಣ', dappa: 'ದಪ್ಪ', vrutta: 'ವೃತ್ತ', vritta: 'ವೃತ್ತ',
    chukke: 'ಚುಕ್ಕೆ', hogu: 'ಹೋಗು', dikku: 'ದಿಕ್ಕು', manege: 'ಮನೆಗೆ', hinnele: 'ಹಿನ್ನೆಲೆ',
    kodu: 'ಕೊಡು', ottu: 'ಒಟ್ಟು', jodisu: 'ಜೋಡಿಸು', mottu: 'ಮೊತ್ತ', motta: 'ಮೊತ್ತ',
    sarasari: 'ಸರಾಸರಿ', garishTha: 'ಗರಿಷ್ಠ', garishta: 'ಗರಿಷ್ಠ', kanishTha: 'ಕನಿಷ್ಠ', kanishta: 'ಕನಿಷ್ಠ',
    pai: 'ಪೈ', erike: 'ಏರಿಕೆ', ilike: 'ಇಳಿಕೆ', shreni: 'ಶ್ರೇಣಿ', sangrahisu: 'ಸಂಗ್ರಹಿಸು',
    serisu: 'ಸೇರಿಸು', tege: 'ತೆಗೆ', nakshe: 'ನಕ್ಷೆ', shodhaka: 'ಶೋಧಕ', kadita: 'ಕಡಿತ',
    indu: 'ಇಂದು', samaya: 'ಸಮಯ', varsha: 'ವರ್ಷ', tingalu: 'ತಿಂಗಳು', dina: 'ದಿನ',
    namaskaara: 'ನಮಸ್ಕಾರ', namaskara: 'ನಮಸ್ಕಾರ', kannada: 'ಕನ್ನಡ', karnaataka: 'ಕರ್ನಾಟಕ', karnataka: 'ಕರ್ನಾಟಕ',
};

function matchAt(str, i, table) {
    for (const row of table) {
        if (str.startsWith(row[0], i)) return row;
    }
    return null;
}

/** Convert one latin word to Kannada using the phonetic rules. */
export function transliterate(word) {
    if (!word) return word;
    const known = WORDS[word] || WORDS[word.toLowerCase()];
    if (known) return known;
    // ALL-CAPS input means caps lock, not retroflex letters.
    if (word.length > 1 && word === word.toUpperCase()) word = word.toLowerCase();

    let out = '';
    let i = 0;
    let afterConsonant = false;
    while (i < word.length) {
        const vowel = matchAt(word, i, VOWELS);
        if (vowel) {
            out += afterConsonant ? vowel[2] : vowel[1];
            afterConsonant = false;
            i += vowel[0].length;
            continue;
        }
        // ಂ / ಃ follow a syllable: "kaM" → ಕಂ, and a bare "kM" also reads as ಕಂ.
        const sign = matchAt(word, i, SIGNS);
        if (sign) {
            out += sign[1];
            afterConsonant = false;
            i += sign[0].length;
            continue;
        }
        // Lower-case fallback so "Ka" or "MUDRISU" still type something sensible.
        // n / m before a consonant of the same group is written as ಂ: ಒಂದು, ಸಂಗೀತ, ಕಂಪನಿ
        if (afterConsonant === false && out && /[nm]/.test(word[i])) {
            const next = word.slice(i + 1);
            if ((word[i] === 'n' && /^[kgcjtdTD]/.test(next)) || (word[i] === 'm' && /^[pb]/.test(next))) {
                out += 'ಂ';
                i += 1;
                continue;
            }
        }
        const cons = matchAt(word, i, CONSONANTS) || matchAt(word.toLowerCase(), i, CONSONANTS);
        if (cons) {
            if (afterConsonant) out += VIRAMA;
            out += cons[1];
            afterConsonant = true;
            i += cons[0].length;
            continue;
        }
        if (afterConsonant) out += VIRAMA;
        afterConsonant = false;
        out += word[i];
        i += 1;
    }
    if (afterConsonant) out += VIRAMA;
    return out;
}
