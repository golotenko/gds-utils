const ParserUtil = require('../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * parses output of >*FF; a list of Mileage Program numbers per passenger
 */
class FfListParser
{
	static parseSegmentLine(line)  {
		const regex =
			'/^\\s{7}'+
			'(?<airline>[A-Z0-9]{2})\\s{0,3}'+
			'(?<flightNumber>\\d{1,4})'+
			'(?<bookingClass>[A-Z])\\s'+
			'(?<departureDate>\\d{1,2}[A-Z]{3})\\s'+
			'(?<departureAirport>[A-Z]{3})'+
			'(?<destinationAirport>[A-Z]{3})'+
			'\\s*$/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			matches.departureDate = {
				raw: matches.departureDate,
				parsed: ParserUtil.parsePartialDate(matches.departureDate),
			};
			return {
				airline: matches.airline,
				flightNumber: matches.flightNumber,
				bookingClass: matches.bookingClass,
				departureDate: matches.departureDate,
				departureAirport: matches.departureAirport,
				destinationAirport: matches.destinationAirport,
			};
		} else {
			return null;
		}
	}

	// "  2.AA H387L58              HK AY   1.1 DARVISCHI/STEFAN D
	static parseEntryMainLine(line)  {
		const regex =
			'/^\\s*'+
			'(?<lineNumber>\\d+)\\.'+
			'(?<airline>[A-Z0-9]{2})\\s+'+
			'(?<code>[A-Z0-9]+)\\s+'+
			'(?<status>[A-Z]{2})\\s+'+
			'(?<operatingAirline>[A-Z0-9]{2})\\s+'+
			'(?<passengerNumber>\\d+\\.\\d+)\\s+'+
			'(?<passengerName>[\\w|\\s]+\\\/[\\w|\\s]+)\\s*'+
			'$/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			return {
				lineNumber: matches.lineNumber,
				airline: matches.airline,
				code: matches.code,
				status: matches.status,
				operatingAirline: matches.operatingAirline,
				passengerNumber: matches.passengerNumber,
				passengerName: matches.passengerName,
			};
		} else {
			return null;
		}
	}

	// "  2.AA H387L58              HK AY   1.1 DARVISCHI/STEFAN D
	// "       * PLT/SPH *
	static parseEntry(lines)  {
		let entry = null;
		const line = lines.shift();
		if (line) {
			entry = this.parseEntryMainLine(line);
			if (entry) {
				let extraLine = lines.shift();
				if (extraLine) {
					const segment = this.parseSegmentLine(extraLine);
					if (segment) {
						entry.segment = segment;
						extraLine = lines.shift();
					}
					let matches;
					if (php.preg_match(/^\s{7}(.+)/, extraLine, matches = [])) {
						entry.remark = matches[1];
					} else {
						lines.unshift(extraLine);
					}
				}
			} else {
				lines.unshift(line);
			}
		}

		return [entry, lines];
	}

	// "FREQUENT TRAVELER
	// "  1.AA H387L58              HK AA   1.1 DARVISCHI/STEFAN D
	// "       * PLT/SPH *
	// "  2.AA H387L58              HK AY   1.1 DARVISCHI/STEFAN D
	// "       * PLT/SPH *
	static parse(dump)  {
		const mileagePrograms = [];
		let lines = dump.split(/\n/);
		const line = lines.shift();
		if (line.trim() !== 'FREQUENT TRAVELER') {
			return {error: 'Unexpected start of *FF dump - ' + line};
		}
		let entry;
		[entry, lines] = this.parseEntry(lines);
		while (entry !== null) {
			mileagePrograms.push(entry);
			[entry, lines] = this.parseEntry(lines);
		}
		const unexpectedLine = lines.shift();
		if (unexpectedLine) {
			return {error: 'Unexpected *FF line - ' + unexpectedLine};
		}
		return {mileagePrograms};
	}
}
module.exports = FfListParser;
