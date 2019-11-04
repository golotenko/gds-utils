const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * parses output of >*SD; - seat requests
 * output example:
 * '** SEAT DATA **',
 * ' 1+ ET 0509 M  20MAR EWRADD',
 * '     1+ VELIKOV/IGOR      HK  26C            NA            AIR',
 * ' 2+ ET 0921 M  22MAR ADDACC',
 * '     1+ VELIKOV/IGOR      HK  25A            NW            AIR',
 */
class SdParser
{
	static parseSegmentLine(line)  {
		//              '11. DL 0890 Y  20SEP RDUDTW',
		//              ' 7. TK 0012 Y  01JUN JFKIST',
		const pattern = 'SS. YY FFFF B  DDDDD PPPTTT';
		const split = ParserUtil.splitByPosition(line, pattern, null, true);
		const result = {
			segmentNumber: split['S'],
			airline: split['Y'],
			flightNumber: split['F'],
			bookingClass: split['B'],
			departureDate: {
				raw: split['D'],
				parsed: ParserUtil.parsePartialDate(split['D']),
			},
			departureAirport: split['P'],
			destinationAirport: split['T'],
			passengers: [],
		};
		if (split['.'] === '.' && php.trim(split[' ']) === '' &&
            result.departureDate.parsed
		) {
			return result;
		} else {
			return null;
		}
	}

	static parsePassengerLine(line)  {
		//        '     1. LIBERMANE/MARINA  NN                 SA            AIR',
		//        '     4. SMITH/MICHALE     HK  17E            N             AIR',
		const pattern = '    PP. FFFFFFFFFFFFFFFFF_SS CCCCC _________ NL_TTTTTTTTTTTTTT ';
		const split = ParserUtil.splitByPosition(line, pattern, null, true);
		const result = {
			passengerNumber: split['P'],
			passengerName: split['F'],
			requestStatus: split['S'],
			seatCode: split['C'],
			smoking: split['N'] !== 'N',
			location: !split['L'] ? null : {
				raw: split['L'],
				parsed: ({
					A: 'aisle',
					W: 'window',
				} || {})[split['L']],
			},
			segmentType: split['T'],
		};
		if (split['.'] === '.' && php.trim(split[' ']) === '' &&
            php.preg_match(/^\d+$/, result.passengerNumber) &&
            result.passengerName && result.requestStatus
		) {
			return result;
		} else {
			return null;
		}
	}

	static parse(dump)  {
		const lines = php.rtrim(dump).split('\n');
		const headerLine = lines.shift();
		if (headerLine.trim() === 'NO SEATING DATA EXISTS') {
			return {segments: []};
		} else if (headerLine.trim() !== '** SEAT DATA **') {
			return {error: 'Unexpected start of dump - ' + headerLine.trim()};
		}
		const segments = [];
		let line;
		while (line = lines.shift()) {
			const asSeg = this.parseSegmentLine(line);
			const asPax = this.parsePassengerLine(line);
			if (asSeg) {
				segments.push(asSeg);
			} else if (!php.empty(segments) && asPax) {
				segments[php.count(segments) - 1].passengers.push(asPax);
			} else {
				lines.unshift(line);
				break;
			}
		}
		return {
			segments: segments,
			linesLeft: lines,
		};
	}
}
module.exports = SdParser;
