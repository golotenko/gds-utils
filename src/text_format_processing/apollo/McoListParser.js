const ParserUtil = require('../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * parses output of >*MPD;
 * '*MPD             MISCELLANEOUS DOCUMENT LIST',
 * '          NAME         DOCUMENT NBR   ISSUED       AMOUNT',
 * '>*MCO1;   CALSADA/    9885053117301   28FEB18          713.00',
 * '>*MCO2;   CALSADA/    9885053117302   28FEB18          713.00',
 * '>*MCO1;   MONTENEG    1395056219091   21MAR19          610.28',
 * '>*MCO1·   BITCA/IU    0065056180983   03APR19          100.00',
 * 'END OF DISPLAY',
 */
class McoListParser
{
	static parseMcoRow(line)  {
		//              '>*MCO2;   CALSADA/    9885053117302   28FEB18          713.00',
		const pattern = 'MMMMMMMM NNNNNNNNNNNN DDDDDDDDDDDDD   IIIIIII AAAAAAAAAAAAAAAAAA';
		const split = ParserUtil.splitByPosition(line, pattern, null, true);
		let cmd, matches;
		if (php.preg_match(/^>(.+);$/, split['M'], matches = [])) {
			cmd = matches[1];
		} else {
			cmd = null;
		}
		const result = {
			command: cmd,
			passengerName: split['N'],
			documentNumber: split['D'],
			/** seems to be in PCC timezone */
			issueDate: ParserUtil.parse2kDate(split['I']),
			amount: split['A'],
		};
		if (result.passengerName && php.trim(split[' ']) === '' &&
            result.issueDate.parsed && result.command &&
            php.preg_match(/^\d{10,13}$/, result.documentNumber) &&
            php.preg_match(/^\d*\.?\d+$/, result.amount)
		) {
			return result;
		} else {
			return null;
		}
	}

	static parse(dump)  {
		dump = php.preg_replace(/\s*><$/, '', dump);
		const lines = php.rtrim(dump).split('\n');
		const title = lines.shift();
		if (!title.includes('MISCELLANEOUS DOCUMENT LIST')) {
			return {error: 'Invalid start of dump - ' + title.trim()};
		}
		const eodLine = lines.pop();
		if (php.trim(eodLine) !== 'END OF DISPLAY') {
			return {error: 'Invalid end of dump - ' + eodLine.trim()};
		}
		const headersLine = lines.shift();
		const mcoRows = lines.map(l => this.parseMcoRow(l));
		const unparsed = php.array_filter(mcoRows, 'is_null');
		if (!php.empty(unparsed)) {
			const lineNum = Object.keys(unparsed)[0];
			return {error: 'Failed to parse MCO line ' + lineNum + ' - ' + lines[lineNum]};
		}
		return {mcoRows: mcoRows};
	}
}
module.exports = McoListParser;
