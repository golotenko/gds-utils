const ParserUtil = require('../../agnostic/ParserUtil.js');

/**
 * parses output of >*VL; analog of Apollo's ACKN- section
 * example:
 * 'VENDOR LOCATOR',
 * 'VLOC-UA*PLDDF9/08MAR 1352',
 * '  2+ 1A*SV2AMX/08MAR 1352',
 * '><',
 */
const php = require('enko-fundamentals/src/Transpiled/php.js');
class VlParser
{
	static parseCodeToken(str)  {
		//        '  2. 1A*SV2AMX',
		const pattern = 'NNNN-YY*RRRRRR';
		const split = ParserUtil.splitByPosition(str, pattern, null, true);
		const result = {
			lineNumber: split['N'] === 'VLOC' ? '1' : php.trim(split['N'], ' .'),
			airline: split['Y'],
			recordLocator: split['R'],
		};
		if (result['recordLocator']) {
			return result;
		} else {
			return null;
		}
	}

	static parseDtToken(str)  {
		//         '08MAR 1352',
		const pattern = 'DDDDD TTTTT';
		const split = ParserUtil.splitByPosition(str, pattern, null, true);
		const result = {
			date: {
				raw: split['D'],
				parsed: ParserUtil.parsePartialDate(split['D']),
			},
			time: {
				raw: split['T'],
				parsed: ParserUtil.decodeGdsTime(split['T']),
			},
		};
		if (result.date.parsed && result.time.parsed) {
			return result;
		} else {
			return null;
		}
	}

	static parseVlocLine(line)  {
		let parts, dt, codeData;

		//         'VLOC-DL*JORYVY///SWI/DL/A/GB/12JUL 1437',
		//         '  2. 1A*SV2AMX/08MAR 1352',
		parts = php.explode('/', line);
		if (php.count(parts) < 2) {
			return null;
		} else {
			dt = this.parseDtToken(php.array_pop(parts));
			codeData = this.parseCodeToken(parts.shift());

			if (dt && codeData) {
				codeData.date = dt.date;
				codeData.time = dt.time;
				return codeData;
			} else {
				return null;
			}
		}
	}

	static parse(dump)  {
		const lines = php.rtrim(dump).split('\n');
		const headerLine = lines.shift();
		if (headerLine.trim() === 'NO VENDOR LOCATOR DATA EXISTS') {
			return {records: []};
		} else if (headerLine.trim() !== 'VENDOR LOCATOR') {
			return {error: 'Unexpected start of dump - ' + headerLine.trim()};
		}
		const records = lines.map((line) => this.parseVlocLine(line));
		return {records};
	}
}
module.exports = VlParser;
