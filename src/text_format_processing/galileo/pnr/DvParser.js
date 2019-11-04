const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * parse output of >*DV; - list of related divided bookings
 * output example:
 * '** DIVIDED BOOKING DATA **',
 * '** DIVIDED BOOKINGS     **',
 * 'PROKOPCHUK/ALENA   >*7M35TI;',
 * 'LIBERMANE/ZIMICH   >*7NCNS6;',
 * 'LIBERMANE/LEPIN    >*7NDC84;',
 * '><',
 */
class DvParser
{
	static parseBookingLine(line)  {
		//         'STEPANOV/IGOR      >*W5SK20;',
		//         'LIBERMANE/ZIMICH   >*7NCNS6;',
		const pattern = 'FFFFFFFFFFFFFFFFFFF>*RRRRRR;';
		const split = ParserUtil.splitByPosition(line, pattern, null, true);
		if (split['>'] === '>' && split['*'] === '*' && split[';'] === ';') {
			return {
				passengerName: split['F'],
				recordLocator: split['R'],
			};
		} else {
			return null;
		}
	}

	static parse(dump)  {
		const lines = php.rtrim(dump).split('\n');
		const headerLine = php.array_shift(lines);

		if (headerLine.trim() === 'NO DIVIDED BOOKINGS EXIST') {
			return {records: []};
		} else if (headerLine.trim() !== '** DIVIDED BOOKING DATA **') {
			return {error: 'Unexpected start of dump - ' + headerLine.trim()};
		}
		const typeLine = php.trim(lines.shift());
		const recordType = ({
			'** ORIGINAL BOOKING     **': 'ORIGINAL_BOOKING',
			'** DIVIDED BOOKINGS     **': 'DIVIDED_BOOKING',
		} || {})[typeLine];

		const records = lines.map(l => this.parseBookingLine(l));

		return {recordType, records};
	}
}
module.exports = DvParser;
