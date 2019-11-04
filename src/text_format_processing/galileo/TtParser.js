const ParserUtil = require('../agnostic/ParserUtil.js');

/**
 * parse output of >TTLH594/5MAY; - hidden stop times
 * (like VIT in Apollo)
 *
 * example output:
 * ' LH  594  SATURDAY     05 MAY 18',
 * '---------------------------------------------------------------',
 * ' BRD TIME    T D/I  OFF TIME    T D/I   FLY/GROUND      EQP   E',
 * ' FRA 1110A   1  I   ABV  410P      I    6:00/  :45      333   E',
 * ' ABV  455P      D   PHC  600P      D    1:05            333   E',
 * '---------------------------------------------------------------',
 * 'TOTAL FLYING TIME  FRA - PHC      7:05',
 * 'TOTAL GROUND TIME  FRA - PHC       :45',
 * 'TOTAL JOURNEY TIME FRA - PHC      7:50',
 * '---------------------------------------------------------------',
 * 'CLASSES',
 * 'FRA-ABV J  C  D  Z  P  G  E  N  Y  B  M  U  H  Q  V  W  S  T  ',
 * 'ABV-PHC J  C  D  Z  P  G  E  N  Y  B  M  U  H  Q  V  W  S  T  ',
 * '---------------------------------------------------------------',
 * 'TRC  TEXT',
 * 'A    ABVPHC NO BOARDING THIS CITY                               ><',
 */
const php = require('enko-fundamentals/src/Transpiled/php.js');

class TtParser {
	static parseHeaderLine(line) {
		//              ' LH  594  SATURDAY     05 MAY 18'
		//              ' PS  898  FRIDAY       11 MAY 18',
		const pattern = ' YY FFFFF WWWWWWWWWWWW DDDDDDDDDDD';
		const split = ParserUtil.splitByPosition(line, pattern, null, true);
		const result = {
			airline: split['Y'],
			flightNumber: split['F'],
			dayOfWeek: {raw: split['W']},
			departureDate: ParserUtil.parse2kDate(php.str_replace(' ', '', split['D'])),
		};
		if (split[' '] === '' && result.departureDate.parsed) {
			return result;
		} else {
			return null;
		}
	}

	static decodeDayOffset(token) {
		let matches;

		if (!token) {
			return 0;
		} else if (token === '#') {
			return 1;
		} else if (token === '*') {
			return 2;
		} else if (token === '-') {
			return -1;
			// never saw following, just guessing
		} else if (php.preg_match(/^\s*#?([-+]?\d+)#?\s*$/, token, matches = [])) {
			return php.intval(matches[1]);
		} else {
			return null;
		}
	}

	static parseLegLine(line) {
		//              ' BRD TIME    T D/I  OFF TIME    T D/I   FLY/GROUND      EQP   E',
		//              ' FRA 1110A   1  I   ABV  410P      I    6:00/  :45      333   E',
		//              ' PHC  755P      D   ABV  905P      D    1:10/ 1:10      333   E',
		//              ' ABV 1015P      I   FRA  525A#  1  I    6:10            333   E',
		const pattern = ' AAA TTTTTOOMMM III aaa tttttoommm iii FFFFF/GGGGG ___ QQQQQQ E';
		const split = ParserUtil.splitByPosition(line, pattern, null, true);
		const result = {
			departureAirport: split['A'],
			departureTime: {
				raw: split['T'],
				parsed: ParserUtil.decodeGdsTime(split['T']),
			},
			// the offset seems to be from the first departure, not from the last time
			departureDayOffset: this.decodeDayOffset(split['O']),
			departureTerminal: split['M'],
			departureDi: split['I'], // is it domestic/international?
			destinationAirport: split.a,
			destinationTime: {
				raw: split.t,
				parsed: ParserUtil.decodeGdsTime(split.t),
			},
			destinationDayOffset: this.decodeDayOffset(split.o),
			destinationTerminal: split.m,
			destinationDi: split.i,
			flightDuration: split['F'],
			groundDuration: split['G'],
			aircraft: split['Q'],
			hasEMark: split['E'] === 'E',
		};
		if (split[' '] === '' && result.aircraft &&
			result.departureTime.parsed &&
			result.destinationTime.parsed
		) {
			return result;
		} else {
			return null;
		}
	}

	static parseLegSection(section) {
		const lines = section.split('\n');
		const headersLine = lines.shift();
		if (!php.preg_match(/BRD.*TIME.*OFF.*EQP/, headersLine)) {
			return {error: 'Unexpected start of legs section - ' + php.trim(headersLine)};
		}
		const legs = lines.map(l => this.parseLegLine(l));
		const unparsed = legs.flatMap((leg, i) => leg ? [] : [i]);
		if (unparsed.length > 0) {
			const error = 'Failed to parse ' + unparsed.join(',') + '-th leg';
			return {error};
		} else {
			return {legs};
		}
	}

	static parseTotalSections(section) {
		//              'TOTAL FLYING TIME  FRA - PHC      7:05',
		//              'TOTAL GROUND TIME  FRA - PHC       :45',
		//              'TOTAL JOURNEY TIME FRA - PHC      7:50',
		const pattern = 'LLLLLLLLLLLLLLLLLL PPP - TTT DDDDDDDDDDDDD';
		const labelToValue = [];
		const unparsed = [];
		for (const line of section.split('\n')) {
			const split = ParserUtil.splitByPosition(line, pattern, null, true);
			if (split[' '] === '' && split['D'] && split['-'] === '-') {
				labelToValue[split['L']] = split['D'];
			} else {
				unparsed.push(line);
			}
		}
		return {
			totalFlightDuration: labelToValue['TOTAL FLYING TIME'],
			totalGroundDuration: labelToValue['TOTAL GROUND TIME'],
			totalTravelDuration: labelToValue['TOTAL JOURNEY TIME'],
			unparsed: unparsed,
		};
	}

	static parseClassesLine(line) {
		//              'FRA-ABV J  C  D  Z  P  G  E  N  Y  B  M  U  H  Q  V  W  S  T  ',
		const pattern = 'PPP-TTT CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC';
		const split = ParserUtil.splitByPosition(line, pattern, null, true);
		if (split[' '] === '' && split['-'] === '-') {
			return {
				departureAirport: split['P'],
				destinationAirport: split['T'],
				bookingClasses: split['C'] ? php.preg_split(/\s+/, split['C']) : [],
			};
		} else {
			return null;
		}
	}

	static parseClassesSection(section) {
		const lines = section.split('\n');
		const headerLine = lines.shift();
		if (php.trim(headerLine) !== 'CLASSES') {
			return null;
		}
		const legs = lines.map(l => this.parseClassesLine(l));
		return {legs};
	}

	static parse(dump) {
		const sections = php.preg_split(/\n\s*\-+\s*\n/, dump);
		const headerLine = sections.shift();
		const legSection = sections.shift();

		const segment = this.parseHeaderLine(headerLine);
		if (!segment) {
			return {error: 'Failed to parse header line - ' + headerLine.trim()};
		}
		const legData = this.parseLegSection(legSection);
		if (legData.error) {
			return {error: 'Failed to parse leg section - ' + legData.error};
		}
		const legs = legData.legs;
		const totalSection = sections.shift();
		const totals = this.parseTotalSections(totalSection);
		const classesSection = sections.shift();
		const classesSectionData = this.parseClassesSection(classesSection);
		if (!classesSectionData) {
			sections.unshift(classesSection);
		}
		segment.legs = legs;
		segment.totals = totals;
		segment.bookingClassLegs = classesSectionData.legs || [];
		segment.unparsedSections = sections;
		return segment;
	}
}

module.exports = TtParser;
