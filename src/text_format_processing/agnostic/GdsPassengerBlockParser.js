const ParserUtil = require('./ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

class GdsPassengerBlockParser {
	static parse(dump) {
		const parsedData = {
			passengerList: [],
		};
		const lines = dump.split('\n');
		while (lines.length > 0) {
			const line = php.array_shift(lines);
			const result = this.parsePassengerLine(line);

			if (result.success) {
				parsedData.passengerList = php.array_merge(
					parsedData.passengerList,
					result.passengerList
				);
			} else {
				php.array_unshift(lines, line);
				break;
			}
		}
		parsedData.passengerList = this.flattenPassengers(parsedData.passengerList);
		return {
			parsedData: parsedData,
			textLeft: php.implode(php.PHP_EOL, lines),
		};
	}

	static parsePassengerLine(line) {
		let passengerList, tokens, token, matches, $_, recordNumber, carrierText;
		line = php.trim(line);
		if (php.preg_match(/^\d+\.(I|\d+)/, line)) {
			passengerList = [];

			tokens = line.split(/(?=\b\d+\.(?:I\/\d+|\d+))/)
				.map(t => t.trim()).filter(t => t);
			for (token of Object.values(tokens)) {
				passengerList.push(this.parsePassengerToken(token));
			}
			if (passengerList.every(p => p.success)) {
				return {
					passengerList: passengerList,
					success: true,
				};
			} else {
				return {success: false};
			}
		} else if (php.preg_match(/^(\d+)\.C\/([A-Z0-9]+.*?)\s*$/, line, matches = [])) {
			// ' 1.C/00PITDFWGRP ',
			// ' 1.C/01CREW ',
			[$_, recordNumber, carrierText] = matches;
			return {
				passengerList: [
					{
						success: false,
						nameNumber: {raw: recordNumber + '.C'},
						carrierText: carrierText,
					},
				],
				success: true,
			};
		} else if (php.trim(line) === 'NO NAMES') {
			return {
				passengerList: [],
				success: true,
			};
		} else {
			return {success: false};
		}
	}

	// Few examples:
	// '1.1GAUD/AMITKUMAR'
	// '3.1GAUD/AARIV*P-C05'
	// '4.I/1GAUD/IYANNA*16AUG14'
	// '1.1ONA-VU/KATHERINE LOUISE REYES'
	// '1.2LARIOZA/FLORIAN/EXST'
	static parsePassengerToken(token) {
		let regex, matches, age, dob, ptc, parsedChildToken;
		regex = '/^' +
			'(?<number>\\d+\\.(I\\\/\\d+|\\d+))' +
			'(?<lastName>(\\w|\\s|-)+)\/' +
			'(?<firstName>(\\w|\\s)+)' +
			'(?<joinedFirstNames>(\\\/(\\w|\\s)+)*)' +
			'(\\*(?<childToken>.+))?' +
			'/';
		matches = [];
		if (php.preg_match(regex, token, matches = [])) {
			age = null;
			dob = null;
			ptc = null;
			const remark = matches.childToken || null;
			if (remark) {
				parsedChildToken = this.parsePaxDetailsToken(remark);
				age = parsedChildToken.age;
				dob = parsedChildToken.dob;
				ptc = parsedChildToken.ptc;
			}

			return {
				success: true,
				rawNumber: matches.number,
				parsedNumber: this.parseNameNumber(matches.number),
				firstName: matches.firstName,
				lastName: matches.lastName,
				joinedFirstNames: php.array_values(php.array_filter(php.explode('/', matches.joinedFirstNames))),
				age: age,
				dob: dob,
				// Enter "PTC" in focal point for reference
				ptc: ptc,
				remark: remark,
			};
		} else {
			return {success: false};
		}
	}

	static parseNameNumber(rawNumber) {
		let matches, $_, fullNameNumber, infantMark, firstNameNumber;
		if (php.preg_match(/^(\d+)\.(I\/|)(\d+)$/, rawNumber, matches = [])) {
			[$_, fullNameNumber, infantMark, firstNameNumber] = matches;
			return {
				fieldNumber: fullNameNumber,
				quantity: firstNameNumber,
			};
		} else {
			return null;
		}
	}

	static parsePaxDetailsToken(token) {
		let result, matches, ptc, $_, dob;
		result = {
			age: null,
			dob: null,
			ptc: null,
		};
		token = php.trim(token);
		if (php.preg_match(/^P-C(?<age>\d+)$/, token, matches = []) && matches.age) {
			result.age = php.intval(matches.age);
			result.ptc = 'C' + matches.age;
		} else if (php.preg_match(/^C-(?<age>\d+)$/, token, matches = [])) {
			result.age = php.intval(matches.age);
		} else if (php.preg_match(/^C(?<age>\d+)$/, token, matches = [])) {
			result.age = php.intval(matches.age);
			result.ptc = 'C' + matches.age;
		} else if (php.preg_match(/^(?<dob>\d+[A-Z]{3}\d+)$/, token, matches = []) && matches.dob) {
			result.dob = {
				raw: matches.dob,
				parsed: this.parseDateOfBirth(matches.dob),
			};
		} else if (php.preg_match(/^P?-?C?([A-Z0-9]{3})$/, token, matches = [])) {
			ptc = matches[1];
			result.ptc = ptc;
			if (php.is_numeric(php.substr(ptc, 1))) {
				result.age = php.substr(ptc, 1);
			}
		} else if (php.preg_match(/^([A-Z0-9]{3})(\d+[A-Z]{3}\d+)$/, token, matches = [])) {
			[$_, ptc, dob] = matches;
			result.ptc = ptc;
			result.dob = {
				raw: dob,
				parsed: this.parseDateOfBirth(dob),
			};
			if (php.is_numeric(php.substr(ptc, 1))) {
				result.age = php.substr(ptc, 1);
			}
			// YTH12
		} else if (php.preg_match(/^(?<ptc>[A-Z]{3})(?<age>\d{2})$/, token, matches = [])) {
			result.age = php.intval(matches.age);
			result.ptc = matches.ptc;
		}
		return result;
	}

	static parseDateOfBirth(token) {
		return ParserUtil.parsePastFullDate(token).parsed || null;
	}

	/**
	 * transforms passengers into array where element
	 * count would exactly match passenger count
	 * i+e+ [1.3PUPKIN/VASYA/PASHA/KATYA] will transform to:
	 * [1.1PUPKIN/VASYA, 1.2PUPKIN/PASHA, 1.3PUPKIN/KATYA]
	 */
	static flattenPassengers(passengers) {
		let absolute, pax, i, flatPax;
		const result = [];
		absolute = 0;
		for (pax of passengers) {
			if (!pax.success) {
				// group passenger 20+ in single record
				result.push(pax);
				continue;
			}
			for (i = 0; i < pax.parsedNumber.quantity; ++i) {
				++absolute;
				flatPax = {
					...pax,
					nameNumber: {
						raw: pax.rawNumber,
						absolute: absolute,
						fieldNumber: pax.parsedNumber.fieldNumber,
						firstNameNumber: i + 1,
						isInfant: !(php.strpos(pax.rawNumber, 'I') === false),
					},
					lastName: pax.lastName,
					firstName: i > 0
						? pax.joinedFirstNames[i - 1] || null
						: pax.firstName,
					ageGroup: null, // depends on context
				};
				delete flatPax.joinedFirstNames;
				delete flatPax.rawNumber;
				delete flatPax.parsedNumber;
				result.push(flatPax);
			}
		}
		return result;
	}
}

GdsPassengerBlockParser.PASSENGER_TYPE_INFANT = 'infant';
GdsPassengerBlockParser.PASSENGER_TYPE_CHILD = 'child';
GdsPassengerBlockParser.PASSENGER_TYPE_ADULT = 'adult';

module.exports = GdsPassengerBlockParser;
