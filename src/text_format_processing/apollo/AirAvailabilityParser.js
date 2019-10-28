const ParserUtil = require('../agnostic/ParserUtil.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const {decodeDayOffset} = require('./Helpers.js');

/**
 * See https://eportal.travelport.com/sites/GSWS/SiteCollectionDocuments/SGC/Portal/Documents/TrainingDocs/CourseBooks/CBPart1G360.pdf for field description
 */
class AirAvailabilityParser {
	static preprocess(dump) {
		dump = ParserUtil.wrapLinesAt(dump, 64);
		dump = php.str_replace('\u00B7', ';', dump);
		dump = php.str_replace('|', '+', dump);
		return dump;
	}

	static parseFlightStatus(availability) {
		availability = php.trim(availability);
		if (availability === 'FLT CANCELLED') {
			return 'cancelled';
		} else if (availability === 'FLT DEPARTED') {
			return 'departed';
		} else {
			return 'operational';
		}
	}

	static parseFlightAvailability(availability) {
		let result, items, item, amount;
		availability = php.trim(availability);
		if (availability === 'FLT CANCELLED' || availability === 'FLT DEPARTED' ||
			availability === 'PAST SKED DEPARTURE'
		) {
			return [];
		} else {
			result = {};
			items = availability ? availability.split(/\s+/) : [];
			for (item of Object.values(items)) {
				amount = php.strlen(item) > 1 ? item[1] : '';
				result[item[0]] = php.is_numeric(amount) ? php.intval(amount) : amount;
			}
			return result;
		}
	}

	static parseBasicFlightLine(line) {
		const pattern = [
			'/^',
			'(?<lineNumber>\\d)',
			'(?<insideAvailabilityMarker>\\||\\+|\\*|\\:|\\#|\\@|\\s)',
			'\\s',
			'(?<airline>[A-Z0-9]{2})',
			'\\s*',
			'(?<flightNumber>\\d+)',
			'(?<availability>((\\s[A-Z][0-9R\\s])*)|(\\s+(FLT\\sCANCELLED|FLT\\sDEPARTED|PAST\\sSKED\\sDEPARTURE)\\s+))',
			'\\s*',
			'(?<moreClassesExist>\\s|\\+)',
			'(?<departureAirport>(\\s{3}|[A-Z]{3}))',
			'(?<destinationAirport>[A-Z]{3})',
			'\\s*',
			'(?<departureTime>\\d{3,4}(A|P|N|M))',
			'(?<nextDayMarker1>\\s|-|\\+|\\d)',
			'\\s*',
			'(?<destinationTime>\\d{3,4}(A|P|N|M))',
			'(?<nextDayMarker2>\\s|-|\\+|\\d)',
			'\\s*',
			'(?<aircraft>[A-Z0-9]{3})',
			'(?<marriageMarker>\\*|\\s)',
			'(?<flightDuration>\\d{1,2}:\\d{2})?',
			'\\s*',
			'(?<ontimeMarker>\\s|\\d|N)',
			'(?<hiddenStops>\\d)',
			'$/',
		].join('');
		let matches;
		if (php.preg_match(pattern, line, matches = [])) {
			return {
				success: true,
				data: {
					lineNumber: php.intval(matches.lineNumber),
					//'insideAvailabilityMarker' => matches.insideAvailabilityMarker,
					airline: matches.airline,
					flightNumber: php.trim(matches.flightNumber),
					flightStatus: this.parseFlightStatus(matches.availability),
					availability: this.parseFlightAvailability(matches.availability),
					moreClassesExist: matches.moreClassesExist === '+',
					departureAirport: php.trim(matches.departureAirport),
					destinationAirport: php.trim(matches.destinationAirport),
					departureTime: {
						raw: matches.departureTime,
						parsed: ParserUtil.decodeGdsTime(matches.departureTime),
					},
					departureDayOffset: decodeDayOffset(php.trim(matches.nextDayMarker1)),
					destinationTime: {
						raw: matches.destinationTime,
						parsed: ParserUtil.decodeGdsTime(matches.destinationTime),
					},
					destinationDayOffset: decodeDayOffset(php.trim(matches.nextDayMarker2)),
					aircraft: matches.aircraft,
					//'marriageMarker' => matches.marriageMarker,
					//'flightDuration' => matches.flightDuration,
					//'ontimeMarker' => matches.ontimeMarker,
					hiddenStops: php.intval(matches.hiddenStops),
				},
			};
		} else {
			return null;
		}
	}

	static parseMoreClassesLine(line) {
		const pattern = [
			'/^',
			' +',
			'(?<availability>(([A-Z]\\d)( [A-Z]\\d)+))',
			' *',
			'$/',
		].join('');
		let matches;
		if (php.preg_match(pattern, line, matches = [])) {
			return {
				success: true,
				data: {
					availability: this.parseFlightAvailability(matches.availability),
				},
			};
		} else {
			return null;
		}
	}

	// TODO: maybe move to another parser?
	// '2* KL 601        LAX  950A 1150A  --- M-- M-- 74E    NE        0'
	static parseMealScreenLine(line) {
		const pattern = php.implode('', [
			'/^',
			'(?<lineNumber>\\d)',
			'(?<insideAvailabilityMarker>\\+|\\*)',
			' ',
			'(?<airline>[A-Z0-9]{2})',
			' *',
			'(?<flightNumber>\\d+)',
			'(\\*(?<operatingAirline>[A-Z0-9]{2})|   )',
			'  ',
			'(?<departureAirport>(   |[A-Z]{3}))',
			'(?<destinationAirport>[A-Z]{3})',
			' {1,2}',
			'(?<departureTime>\\d{3,4}(A|P|N|M))',
			'(?<nextDayMarker1> |-|\\+)',
			' ?',
			'(?<destinationTime>\\d{3,4}(A|P|N|M))',
			'(?<nextDayMarker2> |-|\\+)',
			' ',
			'.{11}',
			' ',
			'(?<aircraft>[A-Z0-9]{3})',
			'/',
		]);
		let matches;
		if (php.preg_match(pattern, line, matches = [])) {
			return {
				success: true,
				data: {
					lineNumber: php.intval(matches.lineNumber),
					airline: matches.airline,
					flightNumber: php.trim(matches.flightNumber),
					operatingAirline: php.trim(matches.operatingAirline || ''),
					departureAirport: php.trim(matches.departureAirport),
					destinationAirport: php.trim(matches.destinationAirport),
				},
			};
		} else {
			return null;
		}
	}

	static mergeBookingClasses(flight, moreClasses) {
		Object.assign(flight.availability, moreClasses.availability);
		return flight;
	}

	static parseHeaderLine(line) {
		const pattern = 'AAAAAAAAAAAAAAAAAAAWW DDDDD PPPSSS-TTTTT __';
		const names = {
			'A': 'generalDescription',
			'W': 'dayOfWeek',
			'D': 'date',
			'P': 'departureCity',
			'S': 'destinationCity',
			'T': 'time',
			'-': 'nextDayMarker',
			' ': 'whitespace',
		};
		const parsed = ParserUtil.splitByPosition(line, pattern, names, true);
		return {
			date: {
				raw: parsed.date,
				parsed: ParserUtil.parsePartialDate(parsed.date),
			},
			departureCity: parsed.departureCity,
			destinationCity: parsed.destinationCity,
			time: {
				raw: parsed.time,
				parsed: php.str_pad(parsed.time, 5, '0', php.STR_PAD_LEFT),
			},
		};
	}

	// 'YX20424*CONTINENTALE*MODERN HOTEL*FLR*  >> 190 EUR       >AH*2; ',
	// '16233 CY DEN CHERRY CREEK*RENOVATED* >> 139 USD          >AH*1; ',
	static parseHotelOfferLine(line) {
		const regex =
			'/^' +
			'(?<message>.*?)\\s*' +
			'(>>\\s*' +
			'(?<amount>\\d*\\.?\\d+)\\s*' +
			'(?<currency>[A-Z]{3})\\s*' +
			')?' +
			'>(?<command>AH\\*\\d+);' +
			'\\s*$/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			return {
				message: matches.message,
				amount: matches.amount || '',
				currency: matches.currency || '',
				command: matches.command,
			};
		} else {
			return null;
		}
	}

	// 'MEALS>A*M;  CLASSES>A*C;..  ><',
	// 'MEALS>A*M;  CURRENT>A*C;',
	// 'MEALS>A*M;  ><',
	// 'MEALS>A*M;  CLASSES>A*C0;  MORE>A*;'
	// 'MEALS>A*M\u00B7  CURRENT>A*C\u00B7',
	static parseFooterLine(line) {
		const regex = /\s*\b(\S.*?)>(\S+);\s*/;
		let matches;
		if (php.preg_match_all(regex, line, matches = [], php.PREG_SET_ORDER)) {
			const records = [];
			for (const [, label, command] of Object.values(matches)) {
				records.push({label: label, command: command});
			}
			const labels = php.array_column(records, 'label');
			if (php.count(records) > 1 || php.in_array('MEALS', labels)) {
				return {commands: records};
			}
		}
		return null;
	}

	static parse(dump) {
		dump = this.preprocess(dump);
		const lines = dump.split('\n');
		let isFirstLine = true;
		let header = null;
		const flights = [];
		const hotelOffers = [];
		let navigationCommands = [];
		for (const line of Object.values(lines)) {
			let res;
			if (isFirstLine) {
				if (res = this.parseHeaderLine(line)) {
					header = res;
				}
				isFirstLine = false;
			} else if (res = this.parseBasicFlightLine(line)) {
				flights.push(res.data);
			} else if (res = this.parseMoreClassesLine(line)) {
				const lastFlight = flights.pop();
				if (lastFlight) {
					const flight = this.mergeBookingClasses(lastFlight, res.data);
					flights.push(flight);
				}
			} else if (res = this.parseHotelOfferLine(line)) {
				hotelOffers.push(res);
			} else if (res = this.parseFooterLine(line)) {
				navigationCommands = res.commands;
			} else {
				// Consider this unknown line and discard
			}
		}
		return {
			header,
			flights,
			hotelOffers,
			navigationCommands,
		};
	}
}

module.exports = AirAvailabilityParser;
