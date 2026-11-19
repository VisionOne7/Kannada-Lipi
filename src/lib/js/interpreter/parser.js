/**
 * KannadaLipi Parser - AST Builder for Kannada Programming Language
 * Converts tokens into an Abstract Syntax Tree
 */

class KannadaParser {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
    }

    current() {
        return this.tokens[this.pos] || { type: 'EOF' };
    }

    peek(offset = 1) {
        return this.tokens[this.pos + offset] || { type: 'EOF' };
    }

    advance() {
        const token = this.current();
        this.pos++;
        return token;
    }

    expect(type) {
        const token = this.current();
        if (token.type !== type) {
            throw new Error(`ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${type}, ಆದರೆ ${token.type} ಸಿಕ್ಕಿದೆ ಸಾಲು ${token.line} ರಲ್ಲಿ`);
        }
        return this.advance();
    }

    match(...types) {
        return types.includes(this.current().type);
    }

    /**
     * Parse the entire program
     */
    parse() {
        const statements = [];
        while (!this.match('EOF')) {
            const stmt = this.parseStatement();
            if (stmt) {
                statements.push(stmt);
            }
        }
        return { type: 'Program', body: statements };
    }

    /**
     * Parse a single statement
     */
    parseStatement() {
        // Skip newlines
        while (this.match('NEWLINE')) {
            this.advance();
        }

        if (this.match('EOF')) return null;

        // Remember the source line so runtime errors can point to it.
        const line = this.current().line;
        const stmt = this.parseStatementInner();
        if (stmt && typeof stmt === 'object' && stmt.line === undefined) stmt.line = line;
        return stmt;
    }

    // Parse a multi-line block: { stmt \n stmt \n ... }
    // Lets loops, conditions and functions hold many lines.
    parseBlock() {
        this.expect('LBRACE');
        const body = [];
        while (true) {
            while (this.match('NEWLINE')) this.advance();
            if (this.match('RBRACE')) break;
            if (this.match('EOF')) {
                throw new Error(`ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ RBRACE, ಆದರೆ EOF ಸಿಕ್ಕಿದೆ ಸಾಲು ${this.current().line} ರಲ್ಲಿ`);
            }
            const stmt = this.parseStatement();
            if (stmt) body.push(stmt);
        }
        this.expect('RBRACE');
        return body;
    }

    // Body after a ':' — either a { block } or statements on the same line.
    parseInlineOrBlock() {
        if (this.match('LBRACE')) return this.parseBlock();
        // The lexer drops newlines, so "same line" is decided by line numbers.
        const colonLine = (this.tokens[this.pos - 1] || {}).line;
        const body = [];
        while (!this.match('EOF') && !this.match('RBRACE') && !this.match('ELSE')
            && (body.length === 0 || this.current().line === colonLine)) {
            body.push(this.parseStatement());
        }
        return body;
    }

    parseStatementInner() {

        // Variable assignment: name = expression
        // A "name" may be an IDENTIFIER or a Kannada keyword used as a variable
        // (e.g. ಮೊತ್ತ = ೧೦), so we key off the "= next" shape, not the token type.
        if (this.peek().type === 'EQUAL' && this.isAssignableName(this.current())) {
            return this.parseAssignment();
        }

        // Indexed assignment: name[ key ] = expression  (arrays & dicts)
        if (this.peek().type === 'LBRACKET' && this.isAssignableName(this.current())) {
            const save = this.pos;
            const name = this.advance().value;
            this.advance(); // consume [
            const index = this.parseExpression();
            this.expect('RBRACKET');
            if (this.match('EQUAL')) {
                this.advance();
                const value = this.parseExpression();
                return { type: 'IndexAssignment', name, index, value };
            }
            // Not an assignment — rewind and fall through to expression parsing.
            this.pos = save;
        }

        // If statement
        if (this.match('IF')) {
            return this.parseIfStatement();
        }

        // While loop
        if (this.match('WHILE')) {
            return this.parseWhileLoop();
        }

        // For loop
        if (this.match('FOR')) {
            return this.parseForLoop();
        }

        // Function definition
        if (this.match('FUNCTION')) {
            return this.parseFunctionDef();
        }

        // Return statement
        if (this.match('RETURN')) {
            return this.parseReturn();
        }

        // Break/Continue
        if (this.match('BREAK')) {
            this.advance();
            return { type: 'Break' };
        }
        if (this.match('CONTINUE')) {
            this.advance();
            return { type: 'Continue' };
        }

        // Expression statement (print, function call, etc.)
        return this.parseExpression();
    }

    // A token can name a variable if it's an IDENTIFIER, or a Kannada keyword
    // whose value is Kannada letters (so users can name a variable ಮೊತ್ತ, ದಿನ,
    // etc.). Structural keywords/operators are excluded so `ಆದರೆ =` never counts.
    isAssignableName(token) {
        if (!token || !token.value) return false;
        if (token.type === 'IDENTIFIER') return true;
        const structural = ['IF', 'ELSE', 'WHILE', 'FOR', 'FROM', 'TO', 'FUNCTION',
            'RETURN', 'BREAK', 'CONTINUE', 'AND', 'OR', 'NOT', 'TRUE', 'FALSE'];
        if (structural.includes(token.type)) return false;
        // Only Kannada-letter names (built-in function keywords) are assignable.
        return /^[ಀ-೿_]+$/.test(token.value);
    }

    // Consume a variable/function/param name — an IDENTIFIER or a Kannada
    // keyword used as a name (so ಮೊತ್ತ, ದಿನ, etc. work everywhere a name is expected).
    expectName() {
        const tok = this.current();
        if (this.isAssignableName(tok)) return this.advance().value;
        return this.expect('IDENTIFIER').value; // triggers the standard error
    }

    /**
     * Parse variable assignment
     */
    parseAssignment() {
        const name = this.advance().value;   // IDENTIFIER or keyword-as-variable
        this.expect('EQUAL');
        const value = this.parseExpression();
        return {
            type: 'Assignment',
            name,
            value
        };
    }

    /**
     * Parse if statement
     */
    parseIfStatement() {
        this.expect('IF');
        const condition = this.parseComparison();
        this.expect('COLON');
        const consequent = this.match('LBRACE')
            ? { type: 'Block', body: this.parseBlock() }
            : this.parseStatement();

        // Allow `ಇಲ್ಲವಾದರೆ` on the next line after a closing }
        let alternate = null;
        let look = this.pos;
        while (this.tokens[look] && this.tokens[look].type === 'NEWLINE') look++;
        if (consequent && consequent.type === 'Block' && this.tokens[look] && this.tokens[look].type === 'ELSE') {
            this.pos = look;
        }
        if (this.match('ELSE')) {
            this.advance();
            if (this.match('QUESTION') || this.match('COLON')) {
                this.advance();
            }
            alternate = this.match('LBRACE')
                ? { type: 'Block', body: this.parseBlock() }
                : this.parseStatement();
        }

        return {
            type: 'If',
            condition,
            consequent,
            alternate
        };
    }

    /**
     * Parse while loop
     */
    parseWhileLoop() {
        this.expect('WHILE');
        const condition = this.parseComparison();
        this.expect('COLON');

        const body = this.parseInlineOrBlock();

        return {
            type: 'While',
            condition,
            body
        };
    }

    /**
     * Parse for loop
     */
    parseForLoop() {
        this.expect('FOR');
        const variable = this.expectName();
        let start, end;
        if (this.match('FROM')) {
            // Classic order: ಪುನರಾವರ್ತನೆ ನ ರಿಂದ ೧ ವರೆಗೆ ೫:
            this.advance();
            start = this.parseExpression();
            this.expect('TO');
            end = this.parseExpression();
        } else {
            // Natural Kannada order: ಪುನರಾವರ್ತನೆ ನ ೧ ರಿಂದ ೫ ವರೆಗೆ:
            start = this.parseExpression();
            this.expect('FROM');
            end = this.parseExpression();
            this.expect('TO');
        }
        this.expect('COLON');

        // All statements on the same line (or a { block }) repeat each time.
        const body = this.parseInlineOrBlock();

        return {
            type: 'For',
            variable,
            start,
            end,
            body
        };
    }

    /**
     * Parse function definition
     */
    parseFunctionDef() {
        this.expect('FUNCTION');
        const name = this.expectName();
        this.expect('LPAREN');

        const params = [];
        while (!this.match('RPAREN')) {
            params.push(this.expectName());
            if (this.match('COMMA')) {
                this.advance();
            }
        }
        this.expect('RPAREN');
        this.expect('COLON');

        const body = this.match('LBRACE')
            ? { type: 'Block', body: this.parseBlock() }
            : this.parseStatement();

        return {
            type: 'FunctionDef',
            name,
            params,
            body
        };
    }

    /**
     * Parse return statement
     */
    parseReturn() {
        this.expect('RETURN');
        const value = this.parseComparison();
        return {
            type: 'Return',
            value
        };
    }

    /**
     * Parse comparison expression
     */
    parseComparison() {
        let left = this.parseExpression();

        while (this.match('GREATER_THAN', 'LESS_THAN', 'DOUBLE_EQUAL', 'NOT_EQUAL', 'GREATER_EQUAL', 'LESS_EQUAL')) {
            const operator = this.advance().type;
            const right = this.parseExpression();
            left = {
                type: 'BinaryOp',
                operator,
                left,
                right
            };
        }

        return left;
    }

    /**
     * Parse expression
     */
    parseExpression() {
        return this.parseLogical();
    }

    /**
     * Parse logical operators (AND, OR)
     */
    parseLogical() {
        let left = this.parseAdditive();

        while (this.match('AND', 'OR')) {
            const operator = this.advance().type;
            const right = this.parseAdditive();
            left = {
                type: 'BinaryOp',
                operator,
                left,
                right
            };
        }

        return left;
    }

    /**
     * Parse addition and subtraction
     */
    parseAdditive() {
        let left = this.parseMultiplicative();

        while (this.match('PLUS', 'MINUS')) {
            const operator = this.advance().type;
            const right = this.parseMultiplicative();
            left = {
                type: 'BinaryOp',
                operator,
                left,
                right
            };
        }

        return left;
    }

    /**
     * Parse multiplication, division, modulo
     */
    parseMultiplicative() {
        let left = this.parseUnary();

        while (this.match('TIMES', 'DIVIDE', 'MODULO')) {
            const operator = this.advance().type;
            const right = this.parseUnary();
            left = {
                type: 'BinaryOp',
                operator,
                left,
                right
            };
        }

        return left;
    }

    /**
     * Parse unary operators
     */
    parseUnary() {
        if (this.match('MINUS', 'NOT')) {
            const operator = this.advance().type;
            const operand = this.parseUnary();
            return {
                type: 'UnaryOp',
                operator,
                operand
            };
        }
        return this.parsePrimary();
    }

    /**
     * Parse primary expressions
     */
    parsePrimary() {
        const token = this.current();

        // Number literal
        if (this.match('NUMBER')) {
            this.advance();
            return { type: 'Number', value: token.value };
        }

        // String literal
        if (this.match('STRING')) {
            this.advance();
            return { type: 'String', value: token.value };
        }

        // Boolean literals
        if (this.match('TRUE')) {
            this.advance();
            return { type: 'Boolean', value: true };
        }
        if (this.match('FALSE')) {
            this.advance();
            return { type: 'Boolean', value: false };
        }

        // Grouped expression
        if (this.match('LPAREN')) {
            this.advance();
            const expr = this.parseExpression();
            this.expect('RPAREN');
            return expr;
        }

        // Array literal
        if (this.match('LBRACKET')) {
            return this.parseArrayLiteral();
        }

        // Dictionary literal: { "ಕೀ": ಮೌಲ್ಯ, ... }
        if (this.match('LBRACE')) {
            return this.parseDictLiteral();
        }

        // Built-in functions and identifiers
        if (this.match('PRINT', 'ROUND', 'LENGTH', 'MAX', 'MIN', 'SORT_ASC', 'SORT_DESC',
            'COLLECT', 'SEARCH', 'SWAP', 'COUNT', 'INPUT', 'ALPHABET',
            // Karnataka district data
            'DISTRICT_LIST', 'DISTRICT_POPULATION', 'DISTRICT_LITERACY', 'DISTRICT_AREA', 'BAR_CHART',
            // String functions
            'CONCAT', 'STR_LENGTH', 'REVERSE', 'SUBSTRING', 'UPPERCASE', 'LOWERCASE',
            // Math functions
            'SQRT', 'POWER', 'RANDOM', 'FLOOR', 'CEIL', 'ABS',
            // Type conversion
            'TO_NUMBER', 'TO_STRING',
            // Array functions
            'PUSH', 'POP', 'JOIN',
            // Date/Time functions
            'TODAY', 'TIME', 'YEAR', 'MONTH', 'DAY',
            // Trigonometry functions
            'SIN', 'COS', 'TAN',
            // Additional string functions
            'SPLIT', 'REPLACE', 'INCLUDES', 'TRIM',
            // Utility functions
            'TYPE',
            // Math constants
            'PI', 'EULER',
            // Higher-order array functions
            'MAP', 'FILTER', 'REDUCE',
            // Array utilities
            'ARRAY_LENGTH', 'RANGE',
            // New functions
            'LOG', 'FACTORIAL', 'AVERAGE', 'REPEAT', 'DIGITS',
            'SUM', 'IS_NUMBER', 'UNIQUE', 'REVERSE_ARRAY', 'PAD',
            // v2.4.0 advanced string + math functions
            'STARTS_WITH', 'ENDS_WITH', 'INDEX_OF', 'OCCURRENCES', 'WORDS',
            'ROUND_TO', 'GCD', 'LCM', 'IS_PRIME', 'FIBONACCI',
            // v2.5.0 dictionary helpers
            'DICT_KEYS', 'DICT_VALUES', 'DICT_HAS',
            'IDENTIFIER')) {
            return this.parseIdentifierOrCall();
        }

        throw new Error(`ಅನಿರೀಕ್ಷಿತ ಟೋಕನ್ ${token.type} ಸಾಲು ${token.line} ರಲ್ಲಿ`);
    }

    /**
     * Parse array literal
     */
    parseArrayLiteral() {
        this.expect('LBRACKET');
        const elements = [];

        while (!this.match('RBRACKET')) {
            elements.push(this.parseExpression());
            if (this.match('COMMA')) {
                this.advance();
            }
        }

        this.expect('RBRACKET');
        return { type: 'Array', elements };
    }

    // Parse a dictionary literal: { "ಕೀ": ಮೌಲ್ಯ, "ಕೀ೨": ಮೌಲ್ಯ೨ }
    parseDictLiteral() {
        this.expect('LBRACE');
        const pairs = [];
        while (!this.match('RBRACE')) {
            const key = this.parseExpression();      // key expression (usually a string)
            this.expect('COLON');
            const value = this.parseExpression();    // value expression
            pairs.push({ key, value });
            if (this.match('COMMA')) this.advance();
        }
        this.expect('RBRACE');
        return { type: 'Dict', pairs };
    }

    /**
     * Parse identifier or function call
     */
    parseIdentifierOrCall() {
        const token = this.advance();
        const name = token.value;
        const tokenType = token.type;

        // Check for function call
        if (this.match('LPAREN')) {
            const openLine = this.advance().line;
            const args = [];

            while (!this.match('RPAREN')) {
                // A call never spans lines: a missing ')' is the likely mistake.
                const cur = this.current();
                if (cur.type === 'EOF' || (cur.line !== undefined && cur.line !== openLine)) {
                    throw new Error(`ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ RPAREN, ಆದರೆ ${cur.type === 'EOF' ? 'EOF' : 'NEWLINE'} ಸಿಕ್ಕಿದೆ ಸಾಲು ${openLine} ರಲ್ಲಿ`);
                }
                args.push(this.parseExpression());
                if (this.match('COMMA')) {
                    this.advance();
                }
            }

            this.expect('RPAREN');

            return {
                type: 'Call',
                name,
                callee: tokenType,
                arguments: args
            };
        }

        // Check for array indexing
        if (this.match('LBRACKET')) {
            this.advance();
            const index = this.parseExpression();
            this.expect('RBRACKET');
            return {
                type: 'Index',
                array: { type: 'Identifier', name },
                index
            };
        }

        // Just an identifier
        return { type: 'Identifier', name };
    }
}

export default KannadaParser;
