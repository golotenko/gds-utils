
class Lexer {

	/** @param Lexeme[] $lexemes */
	constructor(lexemes) {
		this.context = undefined;
		this.lexemes = lexemes;
	}

	matchLexeme(text) {
		for (const lexeme of this.lexemes) {
			const result = lexeme.match(text, this.context);
			if (result) {
				return result;
			}
		}
		return null;
	}

	/** @return {{
	 *     text: string,
	 *     lexemes: {
	 *         lexeme: string,
	 *         data: any,
	 *         raw: string,
	 *     }[],
	 * }} */
	lex(text) {
		this.context = {text, lexemes: []};
		while (true) {
			const lexeme = this.matchLexeme(this.context.text);
			if (lexeme) {
				this.context.text = lexeme.textLeft;
				this.context.lexemes.push(lexeme);
			} else {
				break;
			}
		}
		const removeTextLeft = (data) => {
			delete data.textLeft;
			return data;
		};
		this.context.lexemes = this.context.lexemes.map(removeTextLeft);
		return this.context;
	}
}

module.exports = Lexer;
