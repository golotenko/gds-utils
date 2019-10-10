
const normReg = (pattern) => {
	if (typeof pattern === 'string') {
		const match = pattern.match(/^\/(.*)\/([a-z]*)$/) ||
					pattern.match(/^#(.*)#([a-z]*)$/);
		if (match) {
			const [_, content, flags] = match;
			// php takes content and flags in one string,
			// but js takes them as separate arguments
			pattern = new RegExp(content, flags);
		}
	}
	return pattern;
};

const normMatch = match => {
	if (match) {
		Object.assign(match, match.groups);
		delete match.groups;
		delete match.index;
		delete match.input;
	}
	return match;
};

const preg_match = (pattern, str, dest = []) => {
	pattern = normReg(pattern);
	const matches = normMatch(str.match(pattern));
	if (matches) {
		Object.assign(dest, matches);
	}
	delete dest.groups;
	return matches;
};

class Lexeme {

	constructor(name, regex) {
		this.constraints = [];
		/** @type {Function|null} */
		this.dataPreprocessor = null;
		this.preprocessDataReturnDefault();

		this.regex = regex;
		this.name = name;
	}

	passesConstraints(context) {
		const passesConstraint = constraint => constraint(context);
		return this.constraints.every(passesConstraint);
	}

	hasConstraint(constraint) {
		this.constraints.push(constraint);
		return this;
	}

	hasPreviousLexemeConstraint(lexemes) {
		const constraint = ($context) => {
			const previousLexeme = $context.lexemes.slice(-1)[0];
			return previousLexeme && lexemes.includes(previousLexeme.lexeme);
		};
		return this.hasConstraint(constraint);
	}

	// alias for hasPreviousLexemeConstraint
	after(lexemes) {
		return this.hasPreviousLexemeConstraint(lexemes);
	}

	preprocessData(dataPreprocessor) {
		this.dataPreprocessor = dataPreprocessor;
		return this;
	}

	// alias for preprocessData()
	map(dataPreprocessor) {
		return this.preprocessData(dataPreprocessor);
	}

	preprocessDataRemoveNumericKeys() {
		const dataPreprocessor = (data) => {
			const result = {};
			for (const [key, value] of Object.entries(data)) {
				if (isNaN(parseInt(key))) {
					result[key] = value;
				}
			}
			return result;
		};
		return this.preprocessData(dataPreprocessor);
	}

	preprocessDataReturnDefault() {
		const dataPreprocessor = ($data) => {
			const result = [];
			for (const [key, value] of Object.entries($data)) {
				if (isNaN(parseInt(key))) {
					result[key] = value;
				}
			}
			const keys = Object.keys(result);
			if (keys.length === 1) {
				return result[keys[0]];
			} else if (keys.length > 1) {
				return result;
			} else {
				return null;
			}
		};
		return this.preprocessData(dataPreprocessor);
	}

	match(text, $context) {
		let matches;
		if (preg_match(this.regex, text, matches = []) &&
			this.passesConstraints($context) && matches[0] !== ''
		) {
			return {
				lexeme: this.name,
				data: this.dataPreprocessor(matches),
				raw: matches[0],
				textLeft: text.slice(matches[0].length),
			};
		} else {
			return null;
		}
	}
}

module.exports = Lexeme;
