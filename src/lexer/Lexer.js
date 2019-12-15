
class Lexer {
	/** @param {Lexeme[]} lexemes */
	constructor(lexemes) {
		this.lexemes = lexemes;
	}

	* matchLexemes(text, context) {
		for (const lexeme of this.lexemes) {
			const result = lexeme.match(text, context);
			if (result) {
				yield result;
			}
		}
	}

	/**
	 * Lexes all possible combinations going from end to start,
	 * from top matching lexeme to last+ Supposed to
	 * be interrupted when result satisfies your needs
	 */
	* lexCombinations(text, prevLexemes = []) {
		const context = {
			text,
			lexemes: [...prevLexemes],
		};
		for (const lexeme of this.matchLexemes(text, context)) {
			const textLeft = lexeme.textLeft;
			delete lexeme.textLeft;
			const nextLexemes = [...prevLexemes, lexeme];
			let gotAny = false;
			for (const subContext of this.lexCombinations(textLeft, nextLexemes)) {
				gotAny = true;
				yield subContext;
			}
			if (!gotAny) yield {text: textLeft, lexemes: nextLexemes};
		}
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
		const item = this.lexCombinations(text, []).next();
		if (!item.done) {
			return item.value;
		} else {
			return {text, lexemes: []};
		}
	}
}

module.exports = Lexer;
