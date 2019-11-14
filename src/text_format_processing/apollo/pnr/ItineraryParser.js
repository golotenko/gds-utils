const GdsConstants = require('../../agnostic/GdsConstants.js');
const ParserUtil = require('../../agnostic/ParserUtil.js');
const {decodeDayOffset} = require('../Helpers.js');

const php = require('enko-fundamentals/src/Transpiled/php.js');
const {mkReg} = require('enko-fundamentals/src/Utils/Misc.js');

const {
	array_filter, array_key_exists,
	array_map,
	array_shift,
	array_values, implode,
	intval,
	isset,
	preg_match, rtrim,
	explode, in_array,
	trim,
} = php;

const joinIndentedLines = (lines) => {
	const blocks = [];
	for (const line of lines) {
		if (!php.empty(blocks) && line.startsWith('    ')) {
			blocks[php.count(blocks) - 1] += php.PHP_EOL + line;
		} else if (!line.trim()) {
			// skip empty lines, they may appear when you copy dump from Focal Point
		} else {
			blocks.push(line);
		}
	}
	return blocks;
};

const decodeDaysOfWeek = (str) => {
	return str
		.split('/')
		.map((x) => ParserUtil.gdsDayOfWeekToNumber(x))
		.join('/');
};

const parseSegmentLine = (line) => {
	const regex = mkReg([
		/^/,
		/(?<segmentNumber>[\s\d]{1,2})/,
		/\s+(?<airline>[A-Z\d]{2})/,
		/\s*(?<flightNumber>\d{1,4})/,
		/\s*(?<bookingClass>[A-Z]{1})/,
		/\s*(?<departureDay>\d{1,2})/,
		/(?<departureMonth>[A-Z]{3})/,
		/\s+(?<departureAirport>[A-Z]{3})/,
		/(?<destinationAirport>[A-Z]{3})/,
		/\s+(?<segmentStatus>[A-Z]{2})/,
		/(?<seatCount>\d{0,2})/,
		/\s*(?<confirmedByAirline1>\*)?/,
		/\s+(?<departureTime>\d+[A-Z]?)/,
		/\s+(?<destinationTime>\d+[A-Z]?)/,
		/\s*(?<confirmedByAirline2>\*)?/,
		/\s*(?<dayOffset>[\d|+\s-]|¥\d*)?/,
		/\s*(?<confirmedByAirline3>\*)?/,
		/\s*(?<days>[A-Z]{2}(\/[A-Z]{2})*)?/,
		/(?<eticket>\s+E)?/,
		/(?<marriage>\s+[0-9]{1,2}(\s+|$))?/,
		/(?<unexpectedText>.*)?/,
		/$/,
	]);
	const match = line.match(regex);
	if (match) {
		const matches = match.groups;
		const eticket = array_key_exists('eticket', matches) ? trim(matches.eticket) : false;
		const marriage = array_key_exists('marriage', matches) ? intval(trim(matches.marriage)) : false;
		const confirmedByAirline = in_array('*', [matches.confirmedByAirline1, matches.confirmedByAirline2, matches.confirmedByAirline3]);
		return {
			segmentNumber: intval(trim(matches.segmentNumber)),
			segmentType: GdsConstants.SEG_AIR,
			airline: trim(matches.airline),
			flightNumber: trim(matches.flightNumber),
			bookingClass: trim(matches.bookingClass || ''),
			departureDate: {
				raw: matches.departureDay + matches.departureMonth,
				parsed: ParserUtil.parsePartialDate(matches.departureDay + matches.departureMonth),
			},
			departureAirport: trim(matches.departureAirport),
			destinationAirport: trim(matches.destinationAirport),
			segmentStatus: trim(matches.segmentStatus),
			seatCount: intval(trim(matches.seatCount)),
			departureTime: {
				raw: trim(matches.departureTime),
				parsed: ParserUtil.decodeGdsTime(trim(matches.departureTime)),
			},
			destinationTime: {
				raw: trim(matches.destinationTime),
				parsed: ParserUtil.decodeGdsTime(trim(matches.destinationTime)),
			},
			dayOffset: decodeDayOffset(trim(matches.dayOffset)),
			confirmedByAirline: confirmedByAirline,
			daysOfWeek: {
				raw: isset(matches.days) && matches.days ? trim(matches.days) : '',
				parsed: isset(matches.days) && matches.days ? decodeDaysOfWeek(trim(matches.days)) : null,
			},
			eticket: eticket,
			marriage: marriage,
			unexpectedText: matches.unexpectedText || '',
			raw: line,
		};
	} else {
		return false;
	}
};

const parseOperatedByLines = (line) => {
	const wrappedLines = ParserUtil.wrapLinesAt(line, 64)
		.split('\n').filter(l => l.trim());
	const records = [];
	while (line = wrappedLines.shift()) {
		let matches = [];
		if (matches = preg_match(/^OPERATED BY(?<operator>.*?)( [A-Z]{3}-[A-Z]{3})?$/, line.trim(), matches)) {
			records.push({operator: trim(matches.operator), line});
		} else {
			wrappedLines.unshift(line);
			break;
		}
	}
	return {
		records: records,
		linesLeft: wrappedLines,
	};
};

// '          PLANE CHANGE MSP-ORD M80                ',
const parsePlaneChangeLine = (line) => {
	let matches;
	if (matches = preg_match(/^\s*PLANE CHANGE\s+([A-Z]{3})-([A-Z]{3})\s+([A-Z0-9]{3})\s*$/, line)) {
		const [$_, from, to, aircraft] = matches;
		return {from: from, to: to, aircraft: aircraft};
	} else {
		return null;
	}
};

const parsePlaneChangeBlock = linesLeft => {
	linesLeft = [...linesLeft];
	const planeChangeLine = linesLeft.shift();
	let raw = null;
	let planeChange = [];
	if (planeChangeLine) {
		const parsed = parsePlaneChangeLine(planeChangeLine);
		if (parsed) {
			raw += planeChangeLine;
			planeChange = [parsed];
			const filter =
				'/^\\s+' +
				'(?<from>[A-Z]{3})-' +
				'(?<to>[A-Z]{3})\\s+' +
				'(?<aircraft>[A-Z\\d]{2,3})\\s*' +
				'$/';
			let line;
			while (line = linesLeft.shift()) {
				let matches;
				if (matches = preg_match(filter, line)) {
					raw += '\n' + line;
					planeChange.push({
						aircraft: matches.aircraft,
						from: matches.from,
						to: matches.to,
					});
				} else {
					linesLeft.unshift(line);
					break;
				}
			}
		} else {
			linesLeft.unshift(planeChangeLine);
		}
	}
	return {raw, planeChange, linesLeft};
};

const parseAirSegmentBlock = (block) => {
	let linesLeft = block.split('\n');
	const result = parseSegmentLine(linesLeft.shift());
	if (result) {
		if (linesLeft.length > 0) {
			const operatedByData = parseOperatedByLines(linesLeft.join('\n'));
			if (operatedByData.records.length > 0) {
				result.operatedBy = operatedByData.records[0].operator;
				result.raw = [result.raw, ...operatedByData.records.map(r => r.line)].join('\n');
			}
			linesLeft = operatedByData.linesLeft;
		}
		const planeRecord = parsePlaneChangeBlock(linesLeft);
		if (planeRecord.planeChange.length > 0) {
			result.planeChange = planeRecord.planeChange;
			result.raw += planeRecord.raw;
		}
		linesLeft = planeRecord.linesLeft;
		if (linesLeft.length > 0) {
			result.linesLeft = linesLeft;
		}
		return result;
	} else {
		return null;
	}
};

class ItineraryParser {
	// ' 1 UA1704S 19DEC LASEWR HK1   605A  157P *         SA   E  1'
	// '1 ET 915T 6DEC DLAADD SS1   225P  855P *         FR   E  2     4:30  788',
	parseSegmentLine(line) {
		return parseSegmentLine(line);
	}

	decodeDaysOfWeek(str) {
		return decodeDaysOfWeek(str);
	}

	decodeDayOffset(token) {
		token = token || '';
		// not a real format, but ¥ may appear when you paste
		// itinerary in Sabre and all "+"-s get normalized to "¥"-s
		token = token.replace('¥', '+');
		if (!token || token === '0') {
			return 0;
		} else if (token == '|' || token == '+') {
			return 1;
		} else if (token == '-') {
			return -1;
		} else if (intval(token)) {
			return intval(token);
		} else {
			throw Error('Unknown day offset [' + token + ']');
		}
	}

	parseOthSegmentLine(line) {
		const regex = /^(?<segmentNumber>[\s\d]{2}) OTH (?<text>.+)$/;
		let matches;
		if (matches = preg_match(regex, line, matches)) {
			return {
				segmentType: GdsConstants.SEG_OTH,
				segmentNumber: trim(matches.segmentNumber),
				text: trim(matches.text),
			};
		} else {
			return null;
		}
	}

	// ' 6 TUR ZZ BK1  YYZ 07DEC-***THANK YOU FOR YOUR SUPPORT*** ',
	// ' 7 TUR ZZ BK1  YYZ 01FEB-***THANK YOU FOR YOUR SUPPORT***',
	parseTurSegmentLine(line) {
		const regex =
			'/^\\s*' +
			'(?<segmentNumber>\\d+)\\s+' + 'TUR\\s+' +
			'(?<vendor>[A-Z0-9]{2})\\s+' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<seatCount>\\d+)\\s+' +
			'(?<location>[A-Z]{3})\\s+' +
			'(?<date>\\d{1,2}[A-Z]{3})-?\\s*' +
			'(?<remark>.*?)\\s*' +
			'$/';
		let matches;
		if (matches = preg_match(regex, line)) {
			return {
				segmentNumber: matches.segmentNumber,
				segmentType: GdsConstants.SEG_TUR,
				vendor: matches.vendor,
				segmentStatus: matches.segmentStatus,
				seatCount: matches.seatCount,
				location: matches.location,
				date: {
					raw: matches.date,
					parsed: ParserUtil.parsePartialDate(matches.date),
				},
				remark: matches.remark,
			};
		} else {
			return null;
		}
	}

	parseArnkSegmentLine(line) {
		const regex = /^(?<segmentNumber>[\s\d]{2})\s{3}ARNK\s*$/;
		let matches;
		if (matches = preg_match(regex, line, matches)) {
			return {
				segmentType: GdsConstants.SEG_ARNK,
				segmentNumber: trim(matches.segmentNumber),
			};
		} else {
			return null;
		}
	}

	// ' 1 CCR ZE KK1 QRL 23FEB-25FEB MCMR/RG-EUR39.42DY-UNL 39.42XH/BS-05578602/PUP-QRLC60/ARR-1337/RC-AEXXMC/DT-0800/NM-PUGACOVS GENADIJS/CF-H1282505939 OSI '
	// ' 1 CCR ET SS1 REK  10MAY - 20MAY  SDAR/BS-05578602/PUP-REKC61/ARR-1200/RC-ER8IS/DT-1200/NM-TEST TEST/RG-ISK169400.00WY-UNL FK XD24200.00-UNL FK/CF-1918832450COUNT/AT-ISK300080.00-UNL FM 10DY 0HR 58080.00MC *'
	parseCarSegmentLine(line) {
		const regex =
			'^' +
			'(?<segmentNumber>[\\s\\d]{1,2})' +
			'\\s+' + 'CCR' + '\\s+' +
			'(?<vendorCode>[A-Z\\d]{2})' + '\\s+' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<seatCount>\\d{0,2})' + '\\s+' +
			'(?<airport>[A-Z]{3})' + '\\s+' +
			'(?<arrivalDate>\\d{1,2}[A-Z]{3})' + '\\s*-\\s*' +
			'(?<returnDate>\\d{1,2}[A-Z]{3})' + '\\s+' +
			'(?<acrissCode>[A-Z]{4})' +
			'\\\/(?<modifiers>.*)$' +
			'';
		let matches;
		if (matches = preg_match('/' + regex + '/', line, matches)) {
			const modifiers = this.parseCarSegmentModifiers(matches.modifiers);
			return {
				segmentNumber: trim(matches.segmentNumber),
				segmentType: GdsConstants.SEG_CAR,
				vendorCode: trim(matches.vendorCode),
				segmentStatus: trim(matches.segmentStatus),
				seatCount: intval(trim(matches.seatCount)),
				airport: trim(matches.airport),
				arrivalDate: {
					raw: matches.arrivalDate,
					parsed: ParserUtil.parsePartialDate(matches.arrivalDate),
				},
				returnDate: {
					raw: matches.returnDate,
					parsed: ParserUtil.parsePartialDate(matches.returnDate),
				},
				acrissCode: trim(matches.acrissCode),
				confirmationNumber: modifiers.confirmationNumber,
				rateGuarantee: modifiers.rateGuarantee || null,
				approxTotal: modifiers.approxTotal || null,
			};
		} else {
			return null;
		}
	}

	/**
	 * Modifier descriptions here: https://ask.travelport.com/index?page=content&id=AN8342&actp=search&viewlocale=en_US&searchid=1493740479525&rnToken=bbae32011f4cca5a6e508147b6e169#Optional%20Fields%20for%20Segment%20Sell
	 * and here: http://testws.galileo.com/GWSSample/Help/GWSHelp/mergedprojects/TransactionHelp/1Notes/Car_Optional_Field_Data.html
	 */
	parseCarSegmentModifiers(txt) {
		const getModifierCodeAndData = function (txt) {
			const tokens = explode('-', txt);
			const code = trim(array_shift(tokens));
			const data = trim(implode('-', tokens));
			return [code, data];
		};
		const result = {
			confirmationNumber: null,
			bookingSource: null,
			pickUpPoint: null,
			arrivalTime: null,
			rateCode: null,
			departureTime: null,
			name: null,
		};
		const modifiers = array_map(getModifierCodeAndData, array_map('trim', explode('/', txt)));
		for (const [code, data] of modifiers) {
			if (code === 'CF') {
				result.confirmationNumber = rtrim(data, ' *');
			} else if (code === 'BS') {
				result.bookingSource = data;
			} else if (code === 'PUP') {
				result.pickUpPoint = data;
			} else if (code === 'ARR') {
				result.arrivalTime = data;
			} else if (code === 'RC') {
				result.rateCode = data;
			} else if (code === 'DT') {
				result.departureTime = data;
			} else if (code === 'NM') {
				result.name = data;
			} else if (code === 'RG') {
				// 'USD109.00DY-UNL FM'
				let match;
				if (match = preg_match(/^(?<currency>[A-Z]{3})(?<amount>\d*\.\d{2})/, data, match)) {
					result.rateGuarantee = {currency: match.currency, amount: match.amount};
				}
			} else if (code === 'APPROXIMATE TOTAL RATE') {
				// 'APPROXIMATE TOTAL RATE-USD237.00-UNL FM 03DY 00HR .00MC'
				let match;
				if (match = preg_match(/^(?<currency>[A-Z]{3})(?<amount>\d*\.\d{2})/, data, match)) {
					result.approxTotal = {currency: match.currency, amount: match.amount};
				}
			} else if (code === 'AT') { // TODO: Unknown
			}
		}
		return result;
	}

	parseHotelSegmentLine(line) {
		return this.parseHhlSegmentLine(line)
			|| this.parseHtlSegmentLine(line);
	}

	parseHotelOptionalField(fieldStr) {
		let matches;
		if (matches = preg_match(/^(.*?)-(.*)$/, fieldStr, matches)) {
			const [$_, code, content] = matches;
			return {code: code, content: content};
		} else {
			return null;
		}
	}

	// ' 4 HHL NN HK1 MRS 01JUN-04JUN  3NT 17560  CAMPANILE MARSEILLE   1C1DRAC -1/RG-EUR69.00/AGT10741570/G-DPSTAXXXXXXXXXXXX8476EXP0722/NM-FOX KARINE V/CF-2293663193 *'
	// ' 2 HHL LW SS1 RIX 10JUN-11JUN  1NT 28550  GRAND PALACE HOTEL    1L050ZZZ-1/RG-EUR240.00/AGT05578602/G-VI4111111111111111EXP0819/NM-LIBERMANE MARINA/CF-109485440 *'
	// ' 3 HHL SI SS1 NYC 10JUN-11JUN  1NT 15231  SHERATON LAGUARDIA    1D2DBZF -1/RG-USD409.00/AGT05578602/G-VI4111111111111111EXP0819/NM-LIBERMANE MARINA/CF-722060000 *'
	// ' 4 HHL RD HK3 RIX 10DEC-12DEC  2NT 69706  RADISSON BLU ELIZAB   3ZJXX101-2/RG-EUR105.00/AGT05578602/NM-LIBERMANE MARINA/CF-R2G4YFK *',
	parseHhlSegmentLine(line) {
		const regex =
			'/^' +
			'(?<segmentNumber>[\\s\\d]{1,2})' + '\\s+' +
			'(?<hotelType>HHL)' + '\\s+' +
			'(?<hotel>[A-Z\\d]{2})' + '\\s+' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<roomCount>\\d{0,2})' + '\\s+' +
			'(?<city>[A-Z]{3})' + '\\s+' +
			'(?<from>\\d{1,2}[A-Z]{3})' + '-(OUT|)' +
			'(?<to>\\d{1,2}[A-Z]{3})' + '\\s+' +
			'(?<stayNights>\\d+)NT\\s+' +
			'(?<propertyCode>[A-Z0-9]{1,5})\\s+' +
			'(?<hotelName>.*?)\\s*' +
			'(?<basisRoomCount>\\d+)' +
			'(?<fareBasis>[A-Z0-9]+)\\s*-' +
			'(?<personCount>\\d+)' +
			'(?<fields>.*)' +
			'$/';
		let matches;
		if (matches = preg_match(regex, line)) {
			const fields = array_values(array_filter(array_map(
				this.parseHotelOptionalField,
				explode('/', matches.fields)
			)));
			return {
				segmentNumber: trim(matches.segmentNumber),
				segmentType: GdsConstants.SEG_HOTEL,
				hotelType: matches.hotelType,
				hotel: trim(matches.hotel),
				segmentStatus: trim(matches.segmentStatus),
				roomCount: intval(trim(matches.roomCount)),
				city: trim(matches.city),
				startDate: {
					raw: matches.from,
					parsed: ParserUtil.parsePartialDate(matches.from),
				},
				endDate: {
					raw: matches.to,
					parsed: ParserUtil.parsePartialDate(matches.to),
				},
				stayNights: matches.stayNights,
				propertyCode: matches.propertyCode,
				hotelName: matches.hotelName,
				basisRoomCount: matches.basisRoomCount,
				fareBasis: matches.fareBasis,
				personCount: matches.personCount,
				fields: fields,
			};
		} else {
			return null;
		}
	}

	// ' 2 HTL ZZ MK1  IST 21AUG-OUT26AUG /H-DOUBLETREE BY HILTON IS/R-TRAM**/RQ-EUR794.90**/**/NM-SHOLAKH**/W-CAFERAGA MAH SOZDENER CAD NO 31 KADIK/BC-T/CF-1709987488',
	// looks similar to HHL, but formatted differently... is it due to Cash form of payment instead of Credit Card?
	parseHtlSegmentLine(line) {
		const regex =
			'/^' +
			'(?<segmentNumber>[\\s\\d]{1,2})' + '\\s+' +
			'(?<hotelType>HTL)' + '\\s+' +
			'(?<hotel>[A-Z\\d]{2})' + '\\s+' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<roomCount>\\d{0,2})' + '\\s+' +
			'(?<city>[A-Z]{3})' + '\\s+' +
			'(?<from>\\d{1,2}[A-Z]{3})' + '-OUT' +
			'(?<to>\\d{1,2}[A-Z]{3})' + '\\s+' +
			'(?<unparsed>.*)' +
			'/';
		let matches;
		if (matches = preg_match(regex, line)) {
			return {
				segmentNumber: trim(matches.segmentNumber),
				segmentType: GdsConstants.SEG_HOTEL,
				hotelType: matches.hotelType,
				hotel: trim(matches.hotel),
				segmentStatus: trim(matches.segmentStatus),
				roomCount: intval(trim(matches.roomCount)),
				city: trim(matches.city),
				startDate: {
					raw: matches.from,
					parsed: ParserUtil.parsePartialDate(matches.from),
				},
				endDate: {
					raw: matches.to,
					parsed: ParserUtil.parsePartialDate(matches.to),
				},
				unparsed: trim(matches.unparsed),
			};
		} else {
			return null;
		}
	}

	//' 1 DL1234Y 15DEC EWRLHR GK1                        TH',
	//' 2 DL1234Y 16DEC LHRTYO GK1                        FR',
	parseFakeSegmentLine(line) {
		const regex =
			'/^\\s*' +
			'(?<segmentNumber>\\d{1,2})\\s+' +
			'(?<airline>[A-Z0-9]{2})\\s{0,3}' +
			'(?<flightNumber>\\d{1,4})' +
			'(?<bookingClass>[A-Z])\\s+' +
			'(?<departureDate>\\d{1,2}[A-Z]{3})\\s+' +
			'(?<departureAirport>[A-Z]{3})' +
			'(?<destinationAirport>[A-Z]{3})\\s+' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<seatCount>\\d{0,2})\\s+' +
			'(?<daysOfWeek>[A-Z]{2}(\\\/[A-Z]{2})*)' +
			'$/';
		let matches;
		if (matches = preg_match(regex, line)) {
			return {
				segmentNumber: intval(trim(matches.segmentNumber)),
				segmentType: GdsConstants.SEG_FAKE,
				airline: trim(matches.airline),
				flightNumber: trim(matches.flightNumber),
				bookingClass: trim(matches.bookingClass || ''),
				departureDate: {
					raw: matches.departureDate,
					parsed: ParserUtil.parsePartialDate(matches.departureDate),
				},
				departureAirport: trim(matches.departureAirport),
				destinationAirport: trim(matches.destinationAirport),
				segmentStatus: trim(matches.segmentStatus),
				seatCount: intval(trim(matches.seatCount)),
				daysOfWeek: {
					raw: (isset(matches.daysOfWeek) && matches.daysOfWeek) ? trim(matches.daysOfWeek) : '',
					parsed: (isset(matches.daysOfWeek) && matches.daysOfWeek) ? this.decodeDaysOfWeek(trim(matches.daysOfWeek)) : null,
				},
			};
		} else {
			return null;
		}
	}

	parse(dump) {
		const segments = [];
		const lines = dump.split('\n');
		const blocks = joinIndentedLines(lines);

		while (!php.empty(blocks)) {
			const block = blocks.shift();
			const segment = parseAirSegmentBlock(block)
				|| this.parseOthSegmentLine(block)
				|| this.parseTurSegmentLine(block)
				|| this.parseArnkSegmentLine(block)
				|| this.parseCarSegmentLine(block)
				|| this.parseHotelSegmentLine(block)
				|| this.parseFakeSegmentLine(block)
			;
			if (segment) {
				const linesLeft = (segment.linesLeft || []).filter(l => l.trim());
				if (linesLeft.length > 0) {
					// sometimes 2 OPERATED BY lines get joined into
					// one together with following segment line
					blocks.unshift(linesLeft.join('\n'));
				} else {
					segment.raw = block;
				}
				segments.push(segment);
			} else {
				blocks.unshift(block);
				break;
			}
		}
		return {
			segments: segments,
			textLeft: blocks.join('\n'),
		};
	}
}

const parser = new ItineraryParser();

module.exports = parser;
