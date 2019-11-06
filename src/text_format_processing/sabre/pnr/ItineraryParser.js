const GdsConstants = require('../../agnostic/GdsConstants.js');
const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

class ItineraryParser {
	static preprocessDump(dump) {
		const lines = dump.split('\n');
		const result = [];
		for (const line of lines) {
			if (line.trim()) {
				if (line.startsWith('    ') &&
					!line.trim().startsWith('OPERATED BY') ||
					line.match(/^\/[A-Z]{2}[A-Z0-9]{2}\*[A-Z0-9]+\s*\/E/)  // confirmation number token
				) {
					const lastLine = result.pop();
					result.push(php.rtrim(lastLine) + ' ' + line.trim());
				} else {
					result.push(line);
				}
			}
		}
		return result.join('\n');
	}

	static parsePartialDate(date) {
		if (date) {
			return ParserUtil.parsePartialDate(date);
		} else {
			return null;
		}
	}

	static parseTime(time) {
		time = time.trim();
		if (time) {
			return ParserUtil.decodeGdsTime(time);
		} else {
			return null;
		}
	}

	static parseDayOfWeek(token) {
		const dayOfWeekIndex = {
			M: 1,
			T: 2,
			W: 3,
			Q: 4,
			F: 5,
			J: 6,
			S: 7,
		};
		if (token && php.preg_match(/^\d$/, token)) {
			return token;
		} else if (token && token in dayOfWeekIndex) {
			return dayOfWeekIndex[token];
		} else {
			return null;
		}
	}

	static parseDate(raw) {
		return {
			raw: raw,
			parsed: ParserUtil.parsePartialDate(raw),
		};
	}

	// ' SPM HRS /DCAA*ENQFIM /E'
	// '  12APR W SPM HRS /DCAA*ENQFIM /E'
	static parseOptionalTokens(textLeft) {
		const result = [];
		while (textLeft = php.ltrim(textLeft)) {
			let matches, raw;
			if (php.preg_match(/^(\d{2}[A-Z]{3})(?:\s|\*)([A-Z0-9]{1})\b/, textLeft, matches = [])) {
				[raw, result.destinationDate, result.destinationDayOfWeek] = matches;
			} else if (php.preg_match(/^\/E\b/, textLeft, matches = [])) {
				[raw, result.isEticket] = [matches[0], true];
			} else if (php.preg_match(/^\/([A-Z]{2})?([A-Z0-9]{2})(?:\*([A-Z0-9]+))?\b/, textLeft, matches = [])) {
				[raw, result.directConnect, result.confirmationAirline, result.confirmationNumber] = matches;
			} else if (php.preg_match(/^(.+?)(?:\s|$)/, textLeft, matches = [])) {
				// witnessed tokens - "HRS", "SPM"
				// Quoting Eldar: "Индикатор HRS означает, что для данного сегмента на пассажиров забронированы места в салоне самолёта."
				// I'll leave it unused for now
				let miscText;
				[raw, miscText] = matches;
				raw = matches[0];
				result.unparsed = result.unparsed || [];
				result.unparsed.push(matches[1]);
			} else {
				raw = textLeft;
			}
			textLeft = textLeft.slice(raw.length);
		}
		return result;
	}

	static parseSegmentLine(line) {
		const regex =
			'/^' +
			'\\s*' +
			'(?<segmentNumber>\\d+)' +
			'\\s*' +
			'(?<airline>[0-9A-Z]{2})' +
			'\\s*' +
			'(?<flightNumber>\\d+|OPEN)' +
			'\\s*' +
			'(?<bookingClass>[A-Z]{1})?' +
			'\\s*' +
			'(?<departureDate>\\d{1,2}[A-Z]{3})' +
			'(\\s|\\*)' +
			'(?<departureDayOfWeek>[A-Z0-9]{1})' +
			'(?<marriageBeforeDeparture>\\*)?' +
			'\\s*' +
			'(?<departureAirport>[A-Z]{3})' +
			'(?<destinationAirport>[A-Z]{3})' +
			'(?<marriageAfterDestination>\\*)?' +
			'\\s*' +
			'(?:(?<marriage>\\d{1,})\\\/(?<marriageOrder>\\d{1,})|)' +
			// Row added to use itinerary parser to parse IMSL dump segments, these keys will be empty for usual dump
			'\\s*' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<seatCount>\\d+)' +
			'\\s+' +
			'(?<departureTime>\\d{2,4}([A-Z]|\\s+))' +
			'\\s*' +
			'(?<destinationTime>\\d{2,4}[A-Z]?)' +
			'(?<textLeft>.{0,})' +
			'/';
		let tokens;
		if (php.preg_match(regex, line, tokens = [])) {
			const optional = this.parseOptionalTokens(tokens.textLeft);
			return {
				segmentNumber: php.intval(tokens.segmentNumber),
				airline: tokens.airline,
				flightNumber: tokens.flightNumber,
				bookingClass: tokens.bookingClass || '',
				departureDate: {
					raw: tokens.departureDate,
					parsed: this.parsePartialDate(tokens.departureDate || null),
				},
				departureDayOfWeek: {
					raw: tokens.departureDayOfWeek || null,
					parsed: this.parseDayOfWeek(tokens.departureDayOfWeek || null),
				},
				departureAirport: tokens.departureAirport,
				destinationAirport: tokens.destinationAirport,
				marriageBeforeDeparture: php.trim(tokens.marriageBeforeDeparture) === '*',
				marriageAfterDestination: php.trim(tokens.marriageAfterDestination) === '*',
				marriage: tokens.marriage || null,
				marriageOrder: tokens.marriageOrder || null,
				segmentStatus: tokens.segmentStatus,
				seatCount: tokens.seatCount,
				departureTime: {
					raw: tokens.departureTime || null,
					parsed: this.parseTime(tokens.departureTime || null),
				},
				destinationTime: {
					raw: tokens.destinationTime || null,
					parsed: this.parseTime(tokens.destinationTime || null),
				},
				destinationDate: {
					raw: optional.destinationDate || null,
					parsed: this.parsePartialDate(optional.destinationDate || null),
				},
				destinationDayOfWeek: {
					raw: optional.destinationDayOfWeek || null,
					parsed: this.parseDayOfWeek(optional.destinationDayOfWeek || null),
				},
				confirmationAirline: optional.confirmationAirline || null,
				confirmationNumber: optional.confirmationNumber || null || null,
				unparsed: optional.unparsed || [],
				eticket: optional.isEticket || false,
				operatedBy: '',
				segmentType: GdsConstants.SEG_AIR,
				raw: line,
			};
		} else {
			return null;
		}
	}

	static parseOperatedByLine(line) {
		let tokens;
		if (php.preg_match(/^OPERATED BY (?<operator>.*)$/, line, tokens = [])) {
			return {
				operator: tokens.operator.trim(),
			};
		} else {
			return null;
		}
	}

	static parseOthSegmentLine(line) {
		let tokens;
		if (php.preg_match(/^\s*(?<segmentNumber>\d+)\s+OTH\s+(?<text>.*)$/, line, tokens = [])) {
			return {
				segmentNumber: php.intval(tokens.segmentNumber),
				segmentType: GdsConstants.SEG_OTH,
				text: tokens.text,
				raw: line,
			};
		} else {
			return null;
		}
	}

	/** @param parsedLine = ItineraryParser::parseHotelSegmentMainPart() */
	static parseHotelWrappedPart(parsedLine, wrappedLine) {
		parsedLine.wrappedText += wrappedLine;
		const tokens = parsedLine.wrappedText.split('/');
		if (tokens.length >= 5) {
			parsedLine.city = tokens.shift();
			const outToken = tokens.shift();
			let matches;
			if (php.preg_match(/^OUT(\d{1,2}[A-Z]{3})$/, outToken, matches = [])) {
				parsedLine.endDate = this.parseDate(matches[1]);
				parsedLine.hotelName = tokens.shift();
				parsedLine.roomType = {raw: tokens.shift()};
				parsedLine.rateCode = tokens.shift();
				const taToken = tokens.shift();
				if (php.preg_match(/^TA(\d{8})$/, taToken, matches = [])) {
					parsedLine.agencyIataCode = matches[1];
				} else {
					tokens.unshift(taToken);
				}
			} else {
				tokens.unshift(outToken);
			}
			parsedLine.unparsedTokens = tokens;
		}
		return parsedLine;
	}

	/**
	 * @param line = ' 3  HTL AS 03DEC S NN1  ANC/OUT5DEC/KING DRAKE/DBLB/MODR/TA05578602/CF-'
	 * parses this part ^^^^^^^^^^^^^^^^^^^^^ and returns rest unparsed (because wrapping)
	 */
	static parseHotelSegmentMainPart(line) {
		const regex =
			'/^\\s*' +
			'(?<segmentNumber>\\d+)\\s+' +
			'(?<hotelType>HTL)\\s+' +
			'(?<hotel>[A-Z0-9]{2})\\s+' +
			'(?<startDate>\\d{1,2}[A-Z]{3})\\s+' +
			'(?<dayOfWeek>[A-Z])\\s+' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<roomCount>\\d+)\\s+' +
			'(?<wrappedText>\\S.*)' +
			'$/';
		let tokens;
		if (php.preg_match(regex, line, tokens = [])) {
			return {
				segmentNumber: tokens.segmentNumber,
				hotelType: tokens.hotelType,
				hotel: tokens.hotel,
				startDate: this.parseDate(tokens.startDate),
				dayOfWeek: tokens.dayOfWeek,
				segmentStatus: tokens.segmentStatus,
				roomCount: tokens.roomCount,
				wrappedText: tokens.wrappedText,
			};
		} else {
			return null;
		}
	}

	// Means 'arrival unknown'. Say you fly A -> B, and return C -> A. Between
	// B & C will be ARNK.
	static parseArnkSegmentLine(line) {
		let tokens;
		if (php.preg_match(/^\s*(?<segmentNumber>\d+)\s+ARNK\s*$/, line, tokens = [])) {
			return {
				segmentNumber: php.intval(tokens.segmentNumber),
				segmentType: GdsConstants.SEG_ARNK,
				raw: line,
			};
		} else {
			return null;
		}
	}

	static parse(dump) {
		dump = this.preprocessDump(dump);
		const lines = dump.split('\n');
		const result = [];
		let currentType = null;
		for (const line of lines) {
			let res;
			if (res = this.parseArnkSegmentLine(line)) {
				result.push(res);
			} else if (res = this.parseOthSegmentLine(line)) {
				result.push(res);
			} else if (res = this.parseHotelSegmentMainPart(line)) {
				res.segmentType = GdsConstants.SEG_HOTEL;
				result.push(res);
			} else if (res = this.parseSegmentLine(line)) {
				result.push(res);
			} else if (result.length > 0 && (res = this.parseOperatedByLine(line))) {
				const lastSegment = result.pop();
				lastSegment.operatedBy = res.operator;
				lastSegment.raw += '\n' + line;
				result.push(lastSegment);
			} else if (currentType === GdsConstants.SEG_HOTEL) {
				const k = result.length - 1;
				result[k] = this.parseHotelWrappedPart(result[k], line);
			} else {
				// Skip: segment comments
			}
			currentType = (result[php.count(result) - 1] || {}).segmentType;
		}
		return result;
	}
}

module.exports = ItineraryParser;
