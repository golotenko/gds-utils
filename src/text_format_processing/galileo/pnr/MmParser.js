const ParserUtil = require('../../agnostic/ParserUtil.js');

/**
 * parse output of >*MM; - frequent flyer numbers
 * '** MILEAGE MEMBERSHIP DATA **',
 * ' ',
 * 'P  1+ LIBERMANE/MARINA  AA  123456789',
 * '                        PS  4334HKJHJK34H534',
 * 'P  2+ LIBERMANE/ZIMICH  DL  CVBC345345DFGDFG345',
 * 'P  4+ LIBERMANE/STAS    BA  123456',
 * '                        SN  1234',
 */
const php = require('enko-fundamentals/src/Transpiled/php.js');

class MmParser {
	static parseProgramLine(line) {
		//              '                        PS  4334HKJHJK34H534',
		const pattern = '                        YY__MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM';
		const split = ParserUtil.splitByPosition(line, pattern, null, true);
		const result = {
			airline: split['Y'],
			code: split['M'],
		};
		if (php.trim(split[' ']) === '' &&
			result.airline && result.code
		) {
			return result;
		} else {
			return null;
		}
	}

	static parsePaxLine(line) {
		//              'P  2. LIBERMANE/ZIMICH  DL  CVBC345345DFGDFG345',
		const pattern = 'P NN. FFFFFFFFFFFFFFFFFF';
		const whitespace = php.str_repeat(' ', pattern.length);
		const programPart = whitespace + line.slice(whitespace.length);
		const program = this.parseProgramLine(programPart);

		const split = ParserUtil.splitByPosition(line, pattern, null, true);

		const result = {
			passengerNumber: split['N'],
			passengerName: split['F'],
			mileagePrograms: [program],
		};
		if (split['P'] === 'P' && php.trim(split[' ']) === '' &&
			split['N'] && program && split['F']
		) {
			return result;
		} else {
			return null;
		}
	}

	static parse(dump) {
		const lines = dump.split('\n');
		const headerLine = lines.shift();
		if (headerLine.trim() !== '** MILEAGE MEMBERSHIP DATA **') {
			return {error: 'Unexpected start of dump - ' + headerLine.trim()};
		}
		const paxes = [];
		for (const line of lines) {
			const asPax = this.parsePaxLine(line);
			const asProg = this.parseProgramLine(line);
			if (asPax) {
				paxes.push(asPax);
			} else if (!php.empty(paxes) && asProg) {
				paxes[php.count(paxes) - 1].mileagePrograms.push(asProg);
			}
		}
		return {passengers: paxes};
	}
}

module.exports = MmParser;
