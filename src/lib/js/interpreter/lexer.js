/**
 * KannadaLipi Lexer - Tokenizer for Kannada Programming Language
 * Converts source code into tokens for parsing
 */

class KannadaLexer {
    constructor() {
        // Kannada digit mapping
        this.kannadaDigits = {
            '೦': '0', '೧': '1', '೨': '2', '೩': '3', '೪': '4',
            '೫': '5', '೬': '6', '೭': '7', '೮': '8', '೯': '9'
        };

        this.arabicToKannada = {
            '0': '೦', '1': '೧', '2': '೨', '3': '೩', '4': '೪',
            '5': '೫', '6': '೬', '7': '೭', '8': '೮', '9': '೯'
        };

        // Keywords in Kannada
        this.keywords = {
            'ಮುದ್ರಿಸು': 'PRINT',
            'ಪೂರ್ಣಾಂಕ': 'ROUND',
            'ಒಟ್ಟು': 'LENGTH',
            'ಗರಿಷ್ಠ': 'MAX',
            'ಕನಿಷ್ಠ': 'MIN',
            'ಏರಿಕೆ': 'SORT_ASC',
            'ಇಳಿಕೆ': 'SORT_DESC',
            'ಸಂಗ್ರಹಿಸು': 'COLLECT',
            'ಹುಡುಕು': 'SEARCH',
            'ಬದಲಾವಣೆ': 'SWAP',
            'ಆದರೆ': 'IF',
            'ಇಲ್ಲವಾದರೆ': 'ELSE',
            'ವರ್ಣಮಾಲೆ': 'ALPHABET',
            // Karnataka district data (Census 2011)
            'ಜಿಲ್ಲೆ_ಪಟ್ಟಿ': 'DISTRICT_LIST',
            'ಜಿಲ್ಲೆ_ಜನಸಂಖ್ಯೆ': 'DISTRICT_POPULATION',
            'ಜಿಲ್ಲೆ_ಸಾಕ್ಷರತೆ': 'DISTRICT_LITERACY',
            'ಜಿಲ್ಲೆ_ವಿಸ್ತೀರ್ಣ': 'DISTRICT_AREA',
            'ಬಾರ್_ಚಾರ್ಟ್': 'BAR_CHART',
            'ಎಣಿಕೆ': 'COUNT',
            'ಕೊಡು': 'INPUT',
            // New keywords for loops and functions
            'ಆವರ್ತನೆ': 'WHILE',
            'ಪುನರಾವರ್ತನೆ': 'FOR',
            'ರಿಂದ': 'FROM',
            'ವರೆಗೆ': 'TO',
            'ಕಾರ್ಯ': 'FUNCTION',
            'ಹಿಂತಿರುಗಿಸು': 'RETURN',
            'ಸತ್ಯ': 'TRUE',
            'ಅಸತ್ಯ': 'FALSE',
            'ಮತ್ತು': 'AND',
            'ಅಥವಾ': 'OR',
            'ಅಲ್ಲ': 'NOT',
            'ನಿಲ್ಲಿಸು': 'BREAK',
            'ಮುಂದುವರಿಸು': 'CONTINUE',
            // String functions
            'ಜೋಡಿಸು': 'CONCAT',
            'ಉದ್ದ': 'STR_LENGTH',
            'ಪ್ರತಿಬಿಂಬ': 'REVERSE',
            'ಕತ್ತರಿಸು': 'SUBSTRING',
            'ದೊಡ್ಡಕ್ಷರ': 'UPPERCASE',
            'ಸಣ್ಣಕ್ಷರ': 'LOWERCASE',
            // Math functions
            'ವರ್ಗಮೂಲ': 'SQRT',
            'ಘಾತ': 'POWER',
            'ಯಾದೃಚ್ಛಿಕ': 'RANDOM',
            'ಪೂರ್ಣ': 'FLOOR',
            'ಮೇಲ್ಮೈ': 'CEIL',
            'ನಿರಪೇಕ್ಷ': 'ABS',
            // Type conversion
            'ಸಂಖ್ಯೆಗೆ': 'TO_NUMBER',
            'ಪಠ್ಯಕ್ಕೆ': 'TO_STRING',
            // Array functions
            'ಸೇರಿಸು': 'PUSH',
            'ತೆಗೆ': 'POP',
            'ವಿಲೀನ': 'JOIN',
            // Date/Time functions
            'ಇಂದು': 'TODAY',
            'ಸಮಯ': 'TIME',
            'ವರ್ಷ': 'YEAR',
            'ತಿಂಗಳು': 'MONTH',
            'ದಿನ': 'DAY',
            // Trigonometry functions
            'ಸೈನ್': 'SIN',
            'ಕೊಸೈನ್': 'COS',
            'ಟ್ಯಾನ್': 'TAN',
            // Additional string functions
            'ವಿಭಜಿಸು': 'SPLIT',
            'ಬದಲಿಸು': 'REPLACE',
            'ಒಳಗೊಂಡಿದೆ': 'INCLUDES',
            'ಟ್ರಿಮ್': 'TRIM',
            // Utility functions
            'ಪ್ರಕಾರ': 'TYPE',
            // Math constants
            'ಪೈ': 'PI',
            'ಇ_ಸಂಖ್ಯೆ': 'EULER',
            // Higher-order array functions
            'ನಕ್ಷೆ': 'MAP',
            'ಶೋಧಕ': 'FILTER',
            'ಕಡಿತ': 'REDUCE',
            // Array utilities
            'ಪಟ್ಟಿಯ_ಉದ್ದ': 'ARRAY_LENGTH',
            'ಶ್ರೇಣಿ': 'RANGE',
            // New math functions
            'ಲಾಗ್': 'LOG',
            'ಅಂಶ': 'FACTORIAL',
            'ಸರಾಸರಿ': 'AVERAGE',
            // New string functions
            'ಪುನರಾವರ್ತಿಸು': 'REPEAT',
            // New utility functions
            'ಅಂಕಿಗಳು': 'DIGITS',
            // v2.3.0 functions
            'ಮೊತ್ತ': 'SUM',
            'ಸಂಖ್ಯೆಯೇ': 'IS_NUMBER',
            'ವಿಶಿಷ್ಟ': 'UNIQUE',
            'ತಿರುಗಿಸು': 'REVERSE_ARRAY',
            'ಪ್ಯಾಡ್': 'PAD',
            // v2.4.0 — Advanced string functions
            'ಆರಂಭಿಸು': 'STARTS_WITH',   // startsWith(text, prefix)
            'ಕೊನೆಗೊಳ್ಳು': 'ENDS_WITH',   // endsWith(text, suffix)
            'ಸ್ಥಾನ': 'INDEX_OF',        // indexOf(text, sub)
            'ಗಣನೆ': 'OCCURRENCES',      // count occurrences of sub in text
            'ಪದಗಳು': 'WORDS',           // split text into words list
            // v2.4.0 — Advanced math functions
            'ಸುತ್ತು': 'ROUND_TO',       // round(num, decimals)
            'ಮಸಾಅ': 'GCD',             // greatest common divisor
            'ಲಸಾಅ': 'LCM',             // least common multiple
            'ಅವಿಭಾಜ್ಯವೇ': 'IS_PRIME',   // isPrime(n) → ಸತ್ಯ/ಅಸತ್ಯ
            'ಫಿಬೊನಾಚಿ': 'FIBONACCI',     // nth fibonacci number
            // v2.5.0 — Dictionary (ನಿಘಂಟು) helper functions
            'ಕೀಗಳು': 'DICT_KEYS',        // keys(dict) → list of keys
            'ಮೌಲ್ಯಗಳು': 'DICT_VALUES',   // values(dict) → list of values
            'ಕೀ_ಇದೆಯೇ': 'DICT_HAS'        // hasKey(dict, key) → ಸತ್ಯ/ಅಸತ್ಯ
        };

        // Token patterns
        this.tokenPatterns = [
            { type: 'WHITESPACE', pattern: /^[ \t]+/ },
            { type: 'NEWLINE', pattern: /^\n/ },
            { type: 'COMMENT', pattern: /^#[^\n]*/ },
            { type: 'STRING', pattern: /^"([^"\\]|\\.)*"/ },
            { type: 'KANNADA_NUMBER', pattern: /^[೦-೯]+(\.[೦-೯]+)?/ },
            { type: 'NUMBER', pattern: /^\d+(\.\d+)?/ },
            { type: 'DOUBLE_EQUAL', pattern: /^==/ },
            { type: 'NOT_EQUAL', pattern: /^!=/ },
            { type: 'GREATER_EQUAL', pattern: /^>=/ },
            { type: 'LESS_EQUAL', pattern: /^<=/ },
            { type: 'PLUS', pattern: /^\+/ },
            { type: 'MINUS', pattern: /^-/ },
            { type: 'TIMES', pattern: /^\*/ },
            { type: 'DIVIDE', pattern: /^\// },
            { type: 'MODULO', pattern: /^%/ },
            { type: 'EQUAL', pattern: /^=/ },
            { type: 'GREATER_THAN', pattern: /^>/ },
            { type: 'LESS_THAN', pattern: /^</ },
            { type: 'LPAREN', pattern: /^\(/ },
            { type: 'RPAREN', pattern: /^\)/ },
            { type: 'LBRACKET', pattern: /^\[/ },
            { type: 'RBRACKET', pattern: /^\]/ },
            { type: 'LBRACE', pattern: /^\{/ },
            { type: 'RBRACE', pattern: /^\}/ },
            { type: 'COMMA', pattern: /^,/ },
            { type: 'COLON', pattern: /^:/ },
            { type: 'QUESTION', pattern: /^\?/ },
            { type: 'IDENTIFIER', pattern: /^[\u0C80-\u0CFFa-zA-Z_][\u0C80-\u0CFFa-zA-Z0-9_]*/ }
        ];
    }

    /**
     * Convert Kannada digits to Arabic numerals
     */
    kannadaToArabic(str) {
        return str.split('').map(c => this.kannadaDigits[c] || c).join('');
    }

    /**
     * Convert Arabic numerals to Kannada digits
     */
    toKannada(num) {
        return String(num).split('').map(c => this.arabicToKannada[c] || c).join('');
    }

    /**
     * Tokenize the input source code
     */
    tokenize(source) {
        const tokens = [];
        let pos = 0;
        let line = 1;
        let column = 1;

        while (pos < source.length) {
            let matched = false;

            for (const { type, pattern } of this.tokenPatterns) {
                const match = source.slice(pos).match(pattern);
                if (match) {
                    const value = match[0];

                    if (type === 'NEWLINE') {
                        line++;
                        column = 1;
                    } else if (type === 'WHITESPACE' || type === 'COMMENT') {
                        // Skip whitespace and comments
                    } else if (type === 'KANNADA_NUMBER') {
                        tokens.push({
                            type: 'NUMBER',
                            value: parseFloat(this.kannadaToArabic(value)),
                            raw: value,
                            line,
                            column
                        });
                    } else if (type === 'NUMBER') {
                        tokens.push({
                            type: 'NUMBER',
                            value: parseFloat(value),
                            raw: value,
                            line,
                            column
                        });
                    } else if (type === 'IDENTIFIER') {
                        // Check if it's a keyword
                        const keyword = this.keywords[value];
                        tokens.push({
                            type: keyword || 'IDENTIFIER',
                            value: value,
                            line,
                            column
                        });
                    } else if (type === 'STRING') {
                        tokens.push({
                            type: 'STRING',
                            value: value.slice(1, -1), // Remove quotes
                            raw: value,
                            line,
                            column
                        });
                    } else {
                        tokens.push({
                            type,
                            value,
                            line,
                            column
                        });
                    }

                    pos += value.length;
                    if (type !== 'NEWLINE') {
                        column += value.length;
                    }
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                throw new Error(`ಅಮಾನ್ಯ ಅಕ್ಷರ '${source[pos]}' ಸಾಲು ${line}, ಸ್ಥಾನ ${column} ರಲ್ಲಿ`);
            }
        }

        tokens.push({ type: 'EOF', value: null, line, column });
        return tokens;
    }
}

export default KannadaLexer;
