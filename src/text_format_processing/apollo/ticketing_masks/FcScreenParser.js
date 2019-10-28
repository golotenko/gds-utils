
const FcParser = require('../../agnostic/fare_calculation/FcParser.js');

/**
 * parses output of >$FC{ptcNumber}/{storeNumber}
 * it is a fare construction of a manual pricing
 */
const php = require('enko-fundamentals/src/Transpiled/php.js');

class FcScreenParser {
	//'STL KL X/MSP KL X/AMS KL ATH M151.00KL. ',
	//'X/AMS KL X/ATL KL STL M151.00NUC302.00............. ',
	//'................................................... ',
	//'................................................... ',
	//'...........................END XFSTL4.5MSP4.5ATL4.5',
	static parseMaskFareConstruction(text) {
		const regex =
			'/^\\s*' +
			'(?<mainPart>(?:.|\\s)+?)' +
			'(?<space>[\\.\\s]+)' +
			'(?<endingPart>END.*?)' +
			'\\s*$/';
		let matches;
		if (php.preg_match(regex, text, matches = [])) {
			let raw = matches.mainPart + ' ' + matches.endingPart;
			raw = php.preg_replace(/\.+\s/, '  ', raw); // line may end like 'KL. '
			raw = php.preg_replace(/\s\n/, '', raw); // join into single line
			const fcRecord = FcParser.parse(raw);
			const result = {raw: raw};
			const error = fcRecord.error;
			if (error) {
				result.error = error;
			} else {
				result.parsed = fcRecord.parsed;
			}
			return result;
		} else {
			return {error: 'Failed to extract regex from mask'};
		}
	}

	// ' CA54XXXXXXXXXXXX44 EXP0517/ M 005230 '
	static parseCreditCard(text) {
		const regex =
			'/\\s*' +
			'(?<creditCardCompany>[A-Z]{2})' +
			'(?<creditCardNumber>[^\\s]{15,16})\\s+EXP' +
			'(?<expirationMonth>\\d{2})' +
			'(?<expirationYear>\\d{2})' +
			'(?<unparsed>(?:.|\\s)*?)' +
			'\\s*$/';
		let matches;
		if (php.preg_match(regex, text, matches = [])) {
			const indexes = Object.keys(matches).filter(i => php.is_numeric(i));
			return php.array_diff_key(matches, php.array_flip(indexes));
		} else {
			return null;
		}
	}

	// ' CHECK '
	static parseFopText(text) {
		let parsed, type;

		parsed = null;
		if (php.trim(text) === 'CHECK') {
			type = 'check';
		} else if (parsed = this.parseCreditCard(text)) {
			type = 'creditCard';
		} else {
			type = null;
		}
		return {
			raw: text.trim(),
			type: type,
			parsed: parsed,
		};
	}

	static parse(dump) {
		let lines = dump.split('\n');
		const header = lines.shift();
		if (!header.includes('FARE CONSTRUCTION')) {
			return {error: 'Unexpected start of dump - ' + header.trim()};
		}

		const removeSemicolon = (line) => line.slice(1);
		lines = lines.map(removeSemicolon);
		const textLeft = lines.join('\n');

		const regex =
			'/^\\s*' +
			'FP(?<fopText>(?:.|\\s)*?)\\s+' +
			'FC;(?<maskFcText>(?:.|\\s)*?);\\s*' +
			'(?<cleanFcText>(?:.|\\s)*?)' +
			'\\s*$/';

		let matches;
		if (php.preg_match(regex, textLeft, matches = [])) {
			const cleanFcRecord = FcParser.parse(matches.cleanFcText);
			const maskFcRecord = this.parseMaskFareConstruction(matches.maskFcText);
			return {
				formOfPayment: this.parseFopText(matches.fopText),
				hasFareConstruction: cleanFcRecord.parsed
					|| maskFcRecord.parsed
					|| null ? true : false,
				fareConstruction: {
					mask: maskFcRecord,
					clean: {
						raw: php.trim(matches.cleanFcText),
						parsed: cleanFcRecord.parsed,
						error: cleanFcRecord.error,
					},
				},
			};
		} else {
			return {error: 'Invalid dump structure:\n' + textLeft};
		}
	}
}

module.exports = FcScreenParser;
