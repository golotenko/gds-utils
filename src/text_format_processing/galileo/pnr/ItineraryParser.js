const TpFormats = require('../../travelport/pnr/TpFormats.js');
const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

class ItineraryParser {
	static decodeDaysOfWeek($str) {
		return $str
			.split('/')
			.map(x => ParserUtil.gdsDayOfWeekToNumber(x))
			.join('/');
	}

	static decodeDayOffset(token) {

		if (php.trim(token) == '') {
			return 0;
		} else if (token == '#') {
			return 1;
		} else if (token == '-') {
			return -1;
		} else if (token == '*') {
			return +2;
		} else if (php.intval(token)) {
			return php.intval(token);
		} else {
			throw new Error('Unknown day offset [' + token + ']');
		}
	}

	// ' 2. ET  921 M  22MAR ADDACC HK1   840A  1120A O*         TH  1',
	static parseSegmentLine($line) {
		const regex =
			'^' +
			'(?<segmentNumber>[\\s\\d]{1,2})\\.' +
			'\\s+' +
			'(?<airline>[A-Z\\d]{2})' +
			'\\s*' +
			'(?<flightNumber>\\d+)' +
			'\\s*' +
			'(?<bookingClass>[A-Z]{1})?' +
			'\\s*' +
			'(?<departureDay>\\d{1,2})' +
			'(?<departureMonth>[A-Z]{3})' +
			'\\s+' +
			'(?<departureAirport>[A-Z]{3})' +
			'(?<destinationAirport>[A-Z]{3})' +
			'\\s+' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<seatCount>\\d{0,2})' +
			'(' +
			'\\s+' +
			'(?<departureTime>\\d+[A-Z]?)' +
			'\\s+' +
			'(?<dayOffset>[\\d#\\*\\s-])?' + // not sure that it can be a number
			'\\s*' +
			'(?<destinationTime>[\\d\\s]{3}\\d[A-Z]?)' +
			')?' +
			'\\s*' +
			'(?<unparsedToken1>O?)' + // can't guess what it is
			'(?<confirmedByAirline>\\*)?' +
			'\\s*' +
			'(?<days>[A-Z]{2}(\\\/[A-Z]{2})*)?' +
			'(?<eticket>\\s+E)?' +
			'(?<marriage>\\s+[0-9]+)?' +
			'(?<unexpectedText>.*)?' +
			'$';

		let matches;
		if (php.preg_match('/' + regex + '/', $line, matches = [])) {
			const eticket = php.array_key_exists('eticket', matches)
				? php.trim(matches.eticket) : false;
			const confirmedByAirline = matches.confirmedByAirline === '*';
			return {
				segmentType: php.empty(matches.departureTime)
					? this.SEGMENT_TYPE_FAKE
					: this.SEGMENT_TYPE_ITINERARY_SEGMENT,
				segmentNumber: php.intval(php.trim(matches.segmentNumber)),
				airline: php.trim(matches.airline),
				flightNumber: php.trim(matches.flightNumber),
				bookingClass: php.trim(matches.bookingClass || ''),
				departureDate: {
					raw: matches.departureDay + matches.departureMonth,
					parsed: ParserUtil.parsePartialDate(matches.departureDay + matches.departureMonth),
				},
				departureAirport: php.trim(matches.departureAirport),
				destinationAirport: php.trim(matches.destinationAirport),
				segmentStatus: php.trim(matches.segmentStatus),
				seatCount: php.intval(php.trim(matches.seatCount)),
				departureTime: php.empty(matches.departureTime) ? null : {
					raw: php.trim(matches.departureTime),
					parsed: ParserUtil.decodeGdsTime(php.trim(matches.departureTime)),
				},
				destinationTime: php.empty(matches.destinationTime) ? null : {
					raw: php.trim(matches.destinationTime),
					parsed: ParserUtil.decodeGdsTime(php.trim(matches.destinationTime)),
				},
				dayOffset: this.decodeDayOffset(php.trim(matches.dayOffset || '')),
				confirmedByAirline: confirmedByAirline,
				daysOfWeek: {
					raw: php.isset(matches.days) && matches.days
						? php.trim(matches.days) : '',
					parsed: php.isset(matches.days) && matches.days
						? this.decodeDaysOfWeek(php.trim(matches.days)) : null,
				},
				eticket: eticket,
				marriage: php.trim(matches.marriage || ''),
				unexpectedText: php.array_key_exists('unexpectedText', matches)
					? matches.unexpectedText : false,
				raw: $line,
			};
		} else {
			return false;
		}
	}

	// '         OPERATED BY SKYWEST DBA DELTA CONNECTION',
	// '         OPERATED BY UNITED AIRLINES FOR AIR MICRONESIA  MNL-ROR         OPERATED BY UNITED AIRLINES FOR AIR MICRONESIA  ROR-GUM 5 UA 196K 28JUN GUMNRT HK4  1200N  255P *         WE   E  1',
	static parseOperatedByLine($line) {
		let $wrappedLines, $matches;

		$wrappedLines = php.str_split($line, 64);
		$line = php.trim(php.array_shift($wrappedLines));
		$matches = [];
		if (php.preg_match(/^OPERATED BY(?<operator>.*?)( [A-Z]{3}-[A-Z]{3})?$/, php.trim($line), $matches = [])) {
			return {
				success: true,
				operator: php.trim($matches['operator']),
				followingLines: $wrappedLines,
			};
		} else {
			return false;
		}
	}

	static parseAirSegmentBlock(block) {
		const linesLeft = block.split('\n');
		const result = this.parseSegmentLine(php.array_shift(linesLeft));
		if (result) {
			const operatedByLine = php.array_shift(linesLeft);
			if (operatedByLine) {
				const operatedByData = this.parseOperatedByLine(operatedByLine);
				if (operatedByData) {
					result.operatedBy = operatedByData.operator;
				} else {
					php.array_unshift(linesLeft, operatedByLine);
				}
			}
			if (linesLeft) {
				result.linesLeft = linesLeft;
			}
			return result;
		} else {
			return null;
		}
	}

	static unwrapSegmentLine(block) {
		const lines = block.split('\n');
		let mainLine = php.str_pad(php.array_shift(lines), 64, ' ');
		for (const line of lines) {
			mainLine += php.substr(php.str_pad(line, 64, ' '), php.strlen('    '));
		}
		return mainLine;
	}

	static parseHotelLineHhl(block) {
		let fullLine, regex, matches;

		block = ParserUtil.wrapLinesAt(block, 64);
		fullLine = this.unwrapSegmentLine(block);
		regex =
			'/^' +
			'(?<segmentNumber>[\\s\\d]{1,2})\\.' +
			'\\s+' +
			'(?<hotelType>HHL)' +
			'\\s+' +
			'(?<hotel>[A-Z\\d]{2})' +
			'\\s+' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<roomCount>\\d{0,2})' +
			'\\s+' +
			'(?<city>[A-Z]{3})' +
			'\\s+' +
			'(?<from>\\d{1,2}[A-Z]{3})' +
			'-(OUT|)' +
			'(?<to>\\d{1,2}[A-Z]{3})' +
			'\\s+' +
			'(?<unparsed>.*)' +
			'/';

		if (php.preg_match(regex, fullLine, matches = [])) {
			return {
				segmentNumber: php.trim(matches.segmentNumber),
				segmentType: this.SEGMENT_TYPE_HOTEL,
				hotelType: matches.hotelType,
				hotel: php.trim(matches.hotel),
				segmentStatus: php.trim(matches.segmentStatus),
				roomCount: php.intval(php.trim(matches.roomCount)),
				city: php.trim(matches.city),
				startDate: {
					raw: matches.from,
					parsed: ParserUtil.parsePartialDate(matches.from),
				},
				endDate: {
					raw: matches.to,
					parsed: ParserUtil.parsePartialDate(matches.to),
				},
				unparsed: php.trim(matches.unparsed),
			};
		} else {
			return null;
		}
	}

	static parseHotelOptionalField($fieldStr) {
		let $matches, $_, $code, $content;

		if (php.preg_match(/^(.*?)-(.*)$/, $fieldStr, $matches = [])) {
			[$_, $code, $content] = $matches;
			return {code: $code, content: php.rtrim($content)};
		} else {
			return null;
		}
	}

	// ' 2. HTL ZZ MK1  ORD 19AUG-OUT21AUG /H-MOTEL 6 PROSPECT HEIGHTS/R-EAN/BC-I/W-540 N MILWAUKEE AVE*PROSPECT HEIGHTS*US*P-60070/RQ-GBP31.41/CF-150658393700'
	static parseHotelLineHtl(block) {
		let $fullLine, $regex, $matches, $fields;

		block = ParserUtil.wrapLinesAt(block, 64);
		$fullLine = this.unwrapSegmentLine(block);
		$regex =
			'/^' +
			'(?<segmentNumber>[\\s\\d]{1,2})\\.' +
			'\\s+' +
			'(?<hotelType>HTL)' +
			'\\s+' +
			'(?<hotel>[A-Z\\d]{2})' +
			'\\s+' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<roomCount>\\d{0,2})' +
			'\\s+' +
			'(?<city>[A-Z]{3})' +
			'\\s+' +
			'(?<from>\\d{1,2}[A-Z]{3})' +
			'-OUT' +
			'(?<to>\\d{1,2}[A-Z]{3})' +
			'\\s+' +
			'(?<fields>.*)' +
			'/';

		if (php.preg_match($regex, $fullLine, $matches = [])) {
			$fields = php.array_values(php.array_filter(php.array_map((...args) => this.parseHotelOptionalField(...args),
				php.explode('/', $matches['fields']))));
			return {
				segmentNumber: php.trim($matches['segmentNumber']),
				segmentType: this.SEGMENT_TYPE_HOTEL,
				hotelType: $matches['hotelType'],
				hotel: php.trim($matches['hotel']),
				segmentStatus: php.trim($matches['segmentStatus']),
				roomCount: php.intval(php.trim($matches['roomCount'])),
				city: php.trim($matches['city']),
				startDate: {
					raw: $matches['from'],
					parsed: ParserUtil.parsePartialDate($matches['from']),
				},
				endDate: {
					raw: $matches['to'],
					parsed: ParserUtil.parsePartialDate($matches['to']),
				},
				fields: $fields,
			};
		} else {
			return null;
		}
	}

	static parseCarSegmentBlock(block) {
		let $fullLine, $regex, $matches, $modifiers;

		block = ParserUtil.wrapLinesAt(block, 64);
		$fullLine = this.unwrapSegmentLine(block);
		$regex =
			'/^' +
			'(?<segmentNumber>[\\s\\d]{1,2})\\.' +
			'\\s+' +
			'CCR' + // Car computerized reservation
			'\\s+' +
			'(?<vendorCode>[A-Z\\d]{2})' +
			'\\s+' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<seatCount>\\d{0,2})' +
			'\\s+' +
			'(?<airport>[A-Z]{3})' +
			'\\s+' +
			'(?<arrivalDate>\\d{1,2}[A-Z]{3})' +
			'\\s*-\\s*' +
			'(?<returnDate>\\d{1,2}[A-Z]{3})' +
			'\\s+' +
			'(?<acrissCode>[A-Z]{4})' +
			'\\\/(?<modifiers>.*)$' +
			'/';

		if (php.preg_match($regex, $fullLine, $matches = [])) {
			// same format as in Apollo (and all other GDS-es as far as I can tell)
			$modifiers = TpFormats.parseCarSegmentModifiers($matches['modifiers']);
			return {
				success: true,
				segmentNumber: php.trim($matches['segmentNumber']),
				segmentType: this.SEGMENT_TYPE_CAR,
				vendorCode: php.trim($matches['vendorCode']),
				segmentStatus: php.trim($matches['segmentStatus']),
				seatCount: php.intval(php.trim($matches['seatCount'])),
				airport: php.trim($matches['airport']),
				arrivalDate: {
					raw: $matches['arrivalDate'],
					parsed: ParserUtil.parsePartialDate($matches['arrivalDate']),
				},
				returnDate: {
					raw: $matches['returnDate'],
					parsed: ParserUtil.parsePartialDate($matches['returnDate']),
				},
				acrissCode: php.trim($matches['acrissCode']),
				confirmationNumber: $modifiers['confirmationNumber'],
				rateGuarantee: $modifiers['rateGuarantee'],
				approxTotal: $modifiers['approxTotal'],
			};
		} else {
			return null;
		}
	}

	static joinIndentedLines(lines) {
		const blocks = [];
		for (const line of Object.values(lines)) {
			if (!php.empty(blocks) && line.startsWith('    ')) {
				blocks[php.count(blocks) - 1] += php.PHP_EOL + line;
			} else {
				blocks.push(line);
			}
		}
		return blocks;
	}

	static parse(dump) {
		const segments = [];
		const lines = dump.split('\n');
		const blocks = this.joinIndentedLines(lines);

		while (!php.empty(blocks)) {
			const block = php.array_shift(blocks);
			const segment = this.parseAirSegmentBlock(block)
					|| this.parseHotelLineHhl(block)
					|| this.parseHotelLineHtl(block)
					|| this.parseCarSegmentBlock(block)
			;
			if (segment) {
				segment.raw = block;
				segments.push(segment);
			} else {
				php.array_unshift(blocks, block);
				break;
			}
		}
		return {
			segments: segments,
			textLeft: php.implode(php.PHP_EOL, blocks),
		};
	}
}

ItineraryParser.SEGMENT_TYPE_CAR = 'CAR';
ItineraryParser.SEGMENT_TYPE_FAKE = 'FAKE'; // segment without times
ItineraryParser.SEGMENT_TYPE_ITINERARY_SEGMENT = 'SEGMENT_TYPE_ITINERARY_SEGMENT';
ItineraryParser.SEGMENT_TYPE_HOTEL = 'HOTEL';

module.exports = ItineraryParser;
