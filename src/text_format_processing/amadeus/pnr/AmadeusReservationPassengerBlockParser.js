const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

class AmadeusReservationPassengerBlockParser {
	static parseLine(line) {
		line = php.trim(line);
		if (php.preg_match(/^\d+\./, line)) {
			const passengerList = [];
			const tokens = line.split(/(?=\b\d+\.)/)
				.map(t => t.trim()).filter(t => t);
			for (const token of tokens) {
				let matches;
				if (php.preg_match(/^(?<adultToken>.+)\(INF(?<infantToken>.+)\)/, token, matches = [])) {
					const parent = this.parsePassengerToken(matches.adultToken);
					passengerList.push(parent);
					const child = this.parseInfantToken(matches.infantToken);
					child.lastName = child.lastName || parent.lastName;
					child.nameNumber = {
						fieldNumber: parent.nameNumber.fieldNumber,
						isInfant: true,
					};
					passengerList.push(child);
				} else {
					passengerList.push(this.parsePassengerToken(token));
				}
			}

			return {
				passengerList,
				success: true,
			};
		} else {
			return {success: false};
		}
	}

	static parseInfantToken(token) {
		const [lastName, firstName, dob] = token.split('/');
		return {
			success: true,
			rawNumber: null,
			firstName: firstName,
			lastName: lastName,
			// Enter "PTC" in focal point for reference
			ptc: 'INF',
			age: null,
			dob: dob ? {
				raw: dob,
				parsed: this.parseDateOfBirth(dob),
			} : null,
		};
	}

	// Few examples:
	// '1.DELATORRE/VMARTIN'
	static parsePassengerToken(token) {
		let matches;
		if (php.preg_match(/^(?<number>\d+\.)(?<name>[A-Z\s-]+\/[A-Z\s-]+)\((?<details>.+)\)/, token, matches = [])) {
			const name = this.parseName(matches.name);
			const details = this.parseDetails(matches.details);
			return {
				success: true,
				rawNumber: matches.number,
				firstName: name.firstName,
				lastName: name.lastName,
				age: details.age,
				dob: details.dob,
				ptc: details.ptc,
				nameNumber: {
					fieldNumber: php.explode('.', matches.number)[0],
					isInfant: details.ptc === 'INF',
				},
			};
		} else if (php.preg_match(/^(?<number>\d+\.)(?<name>.+\/.*)/, token, matches = [])) {
			const name = this.parseName(matches.name);
			return {
				success: true,
				rawNumber: matches.number,
				firstName: name.firstName,
				lastName: name.lastName,
				age: null,
				dob: null,
				ptc: null,
				nameNumber: {
					fieldNumber: php.explode('.', matches.number)[0],
					isInfant: false,
				},
			};
		} else {
			return {success: false};
		}
	}

	static parseName(token) {
		const [lastName, firstName] = token.split('/');
		return {
			firstName: firstName.trim(),
			lastName: lastName.trim(),
		};
	}

	static parseDetails(token) {
		const [ptc, dob] = php.array_pad(token.split('/'), 2, null);
		return {
			age: php.is_numeric(ptc.slice(1)) ? ptc.slice(1) : null,
			dob: dob ? {
				raw: dob,
				parsed: this.parseDateOfBirth(dob),
			} : null,
			ptc: ptc,
		};
	}

	static parseDateOfBirth(token) {
		return (ParserUtil.parsePastFullDate(token) || {}).parsed;
	}
}

AmadeusReservationPassengerBlockParser.PASSENGER_TYPE_INFANT = 'infant';
AmadeusReservationPassengerBlockParser.PASSENGER_TYPE_ADULT = 'adult';
AmadeusReservationPassengerBlockParser.PASSENGER_TYPE_CHILD = 'child';

module.exports = AmadeusReservationPassengerBlockParser;
