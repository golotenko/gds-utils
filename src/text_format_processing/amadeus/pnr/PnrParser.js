const ParserUtil = require('../../agnostic/ParserUtil.js');
const FlightInfoParser = require('../FlightInfoParser.js');
const GenericRemarkParser = require('../../agnostic/GenericRemarkParser.js');

const php = require('enko-fundamentals/src/Transpiled/php.js');
const AmadeusReservationPassengerBlockParser = require('./AmadeusReservationPassengerBlockParser.js');
const PnrFieldLineParser = require('./PnrFieldLineParser.js');
const FopLineParser = require('./FopLineParser.js');
const SsrLineParser = require('./SsrLineParser.js');
const HotelLineParser = require('./HotelLineParser.js');
const CarLineParser = require('./CarLineParser.js');

class PnrParser
{
	static parse(dump)  {
		let success = false;
		// remove scrolling indicator if any
		dump = php.preg_replace(/^\/\$(.+)(\n\)\s*|)$/s, '$1', dump);
		let linesLeft = dump.split(/\r\n|\r|\n/);

		const result = {
			pnrInfo: {
				recordLocator: null,
			},
			passengers: [],
			itinerary: [],
			tickets: [],
			genericFields: [],
		};
		const unparsedLines = [];

		let itinerarySegmentFound = false;
		let line;
		while (!php.is_null(line = linesLeft.shift())) {
			let wasUnparsed = false;
			let wrappedParts;
			[wrappedParts, linesLeft] = this.takeLineWrappedParts(linesLeft, 7);
			line = php.implode(php.PHP_EOL, php.array_merge([line], wrappedParts));
			let res;
			if (res = this.parseSegmentLine(line)) {
				result.itinerary.push(res);
				itinerarySegmentFound = true;
			} else if (!php.empty(result.itinerary) && (res = this.parseOperatedByLine(line))) {
				const lastSegment = result.itinerary.pop();
				lastSegment.operatedBy = res.operator;
				lastSegment.raw += php.PHP_EOL+line;
				result.itinerary.push(lastSegment);
			} else if (res = this.parseMisSegmentLine(line)) {
				result.itinerary.push(res);
			} else if (res = this.parseFlwnSegmentLine(line)) {
				result.itinerary.push(res);
			} else if (res = this.parseHeaderLine1(line)) {
				result.pnrInfo = res;
			} else if (res = this.parseHeaderLine2(line)) {
				result.pnrCreationInfo = res;
			} else if (!itinerarySegmentFound && (res = this.parsePassengerLine(line))) {
				result.passengers = php.array_merge(result.passengers, res);
			} else if (res = this.parseTicket(line)) {
				result.tickets.push(res);
			} else if (res = this.parseRemark(line)) {
				result.remarks = result.remarks || [];
				result.remarks.push(res);
			} else if (res = this.parseDividedBookingLine(line)) {
				result.dividedBookings = result.dividedBookings || [];
				result.dividedBookings.push(res);
			} else if (res = this.parseMcoLine(line)) {
				let nestedLines;
				[nestedLines, linesLeft] = this.takeLineWrappedParts(linesLeft, 3);
				res.details = this.parseMcoNestedLines(nestedLines);
				result.mcoRecords = result.mcoRecords || [];
				result.mcoRecords.push(res);
			} else if (res = SsrLineParser.parse(line)) {
				result.ssrData = result.ssrData || [];
				result.ssrData.push(res);
			} else if (res = this.parseHotel(line, linesLeft)) {
				result.hotels = result.hotels || [];
				result.hotels.push(res.parsed);
				linesLeft = res.linesLeft;
			} else if (res = this.parseCar(line, linesLeft)) {
				result.cars = result.cars || [];
				result.cars.push(res.parsed);
				linesLeft = res.linesLeft;
			} else if (res = this.parsePnrFieldLine(line)) {
				wasUnparsed = !res.data;
				result.genericFields.push(res);
			} else {
				wasUnparsed = true;
				unparsedLines.push(line);
			}
			// success if at least one line was parsed
			success = success || !wasUnparsed;
		}
		result.formOfPayment = result.genericFields
			.filter(f => f.type === 'formOfPayment');

		// transform passengers to match format in which we return them to user, preserves old keys for now
		result.passengers = this.transformPassengers(result.passengers || []);

		return {
			parsed: result,
			unparsed: unparsedLines,
			success: success,
		};
	}

	// ' 20 FB PAX 0000000001 TTM/M1,2/RT OK EMD ADVISE PSGR TO BRING',
	// 'FOID/PICT ID AT APT/E7',
	// ' 21 FE PAX VALID ON A3 FLIGHTS/ DATES SHOWN ONLY NON-REFUNDABLE',
	// '/S2-3',
	static parsePnrFieldLine(line)  {
		let matches;
		if (php.preg_match(/^\s*(\d+)\s([A-Z]{2})\s(\S.*)$/s, line, matches = [])) {
			const [, num, code, content] = matches;
			const parsed = PnrFieldLineParser.parse(code, content);
			return {
				lineNumber: num,
				code: code,
				type: parsed.type,
				data: parsed.data,
				content: parsed.content,
				infMark: parsed.infMark,
				segNums: parsed.segNums,
				paxNums: parsed.paxNums,
			};
		} else {
			return null;
		}
	}

	// '  2 HHL HS HK1 RIX IN20MAR OUT21MAR 1ROHRAC EUR49.00 DLY ABS'
	// '    WELLTON ELEFANT/BC-GLJTTCR/BS-05578602/CF-103809885'
	// '    /G-CCMCXXXXXXXXXXXX1996EXP1018 *HS+'
	// '    SEE RTSVCH'
	static parseHotel(line, linesLeft)  {
		let $HhlSegment, parsedData;

		if (HotelLineParser.isHhlLine(line)) {
			$HhlSegment = line;
			for (line of Object.values(linesLeft)) {
				if (php.preg_match('/^\\s{4}[^\\s]/', line)) {
					$HhlSegment += php.array_shift(linesLeft);
				} else {
					break;
				}}
			if (parsedData = HotelLineParser.parse($HhlSegment)) {
				return {
					parsed: parsedData,
					linesLeft: linesLeft,
				};
			}
		}
		return null;
	}


	// '  6 CCR SX HK1 FRA 13MAY 16MAY ECMN/BS-00000000/ARR-1200'
	// '    /RC-SD-XEU/RG-EUR 38.00- .00 UNL DY/RT-0900/CF-'
	// '    **SEE RTSVCC**'
	// '  8 CCR TS SS1 FRA 15SEP 30SEP ECMN/BS-00000000/ARR-1000'
	// '    /RC-SW-DEEX1/RG-EUR 160.00- .00 UNL WY 23.00- UNL XD'
	// '    /RT-0700/CF-'
	// '    **SEE RTSVCC**'
	static parseCar(line, linesLeft)  {
		let $HhlSegment, parsedData;

		if (CarLineParser.isCarLine(line)) {
			$HhlSegment = line;
			for (line of Object.values(linesLeft)) {
				if (php.preg_match('/^\\s{4}[^\\s]/', line)) {
					$HhlSegment += php.array_shift(linesLeft);
				} else {
					break;
				}}
			if (parsedData = CarLineParser.parse($HhlSegment)) {
				return {
					parsed: parsedData,
					linesLeft: linesLeft,
				};
			}
		}
		return null;
	}

	// '  6 RM STANISLAW/ID2838/CREATED FOR STANISLAW/ID2838/REQ. ID-1'
	// '  5 RM ACID DEOXYRIBOETHANBUTANPROPANFORTRANPENTANSAKURATANNUCLE'
	// '       IC'
	// '  4 RM DEOXYRIBOETHANBUTANPROPANFORTRANPENTANSAKURATANNUCLEIC
	// '       ACID
	static parseRemark(line)  {
		let matches, $_, lineNumber, msg, record;

		if (php.preg_match(/^\s*(\d+)\s+RM\s+(\S.*)$/s, line, matches = [])) {
			[$_, lineNumber, msg] = matches;
			// preserving line breaks in the message because we can't
			// say for sure when it was joined by '' and when by ' '

			record = GenericRemarkParser.parse(msg);
			return {
				lineNumber: lineNumber,
				remarkType: record.remarkType,
				data: record.data,
			};
		} else {
			return null;
		}
	}

	/** @param line = '  * SP 06MAR/WSSU/SFO1S2195-NXNBHM'
                    ?? '  * SP 06MAR/WSSU/SFO1S2195-NXNP6L' */
	static parseDividedBookingLine(line)  {
		const regex =
            '/^\\s{2}\\*\\sSP\\s+'+
            '(?<date>\\d{1,2}[A-Z]{3}\\d*)\/'+
            '(?<agentInitials>[A-Z0-9]{2})'+
            '(?<dutyCode>[A-Z0-9]{2})\/'+
            '(?<pcc>[A-Z0-9]{3,})-'+
            '(?<recordLocator>[A-Z0-9]{6})'+
            '/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			return {
				date: {
					raw: matches.date,
					parsed: ParserUtil.parsePartialDate(matches.date),
				},
				agentInitials: matches.agentInitials,
				dutyCode: matches.dutyCode,
				pcc: matches.pcc,
				recordLocator: matches.recordLocator,
			};
		} else {
			return null;
		}
	}

	// '  7 MCO TK *** 14FEB/USD 34.00/*SPLIT PAYMENT',
	// '  4 MCO TP *** 22FEB/USD 6.00/*SPLIT PAYMENT',
	// '  7 MCO TK *** 17MAR/USD 84.00/*SPLIT PAYMENT/P2',
	static parseMcoLine(line)  {
		let regex, matches;

		regex =
            '/^\\s{0,2}'+
            '(?<lineNumber>\\d+)\\s+MCO\\s+'+
            '(?<airline>[A-Z0-9]{2})'+
            '.*'+
            '(?<date>\\d{1,2}[A-Z]{3})\/'+
            '(?<currency>[A-Z]{3})\\s*'+
            '(?<amount>\\d*\\.?\\d+)'+
            '(\\\/\\*(?<service>.*?))?'+
            '(\\\/P(?<paxNum>\\d+))?'+
            '\\s*$/';
		if (php.preg_match(regex, line, matches = [])) {
			return {
				lineNumber: matches.lineNumber,
				airline: matches.airline,
				date: {
					raw: matches.date,
					parsed: ParserUtil.parsePartialDate(matches.date),
				},
				currency: matches.currency,
				amount: matches.amount,
				service: matches.service,
				paxNum: matches.paxNum,
			};
		} else {
			return null;
		}
	}

	// '  1 FA 235-5050440440/PTTK/USD34.00/14FEB17/SFO1S2195/0557860'
	// '    2'
	// '  2 FB 1400015004 TTM OK PROCESSED MCO-ENTER IR, ADD FM THEN'
	// '    TTP/EXCH'
	// '  3 FG 1406620358 AMSAA3102'
	// '  4 FM *M*0'
	// '  5 FP CASH'
	static parseMcoNestedLines(linesLeft)  {
		let mcoDetails, line, wrappedParts, ticket, fopLine;

		mcoDetails = [];
		while (!php.is_null(line = php.array_shift(linesLeft))) {
			[wrappedParts, linesLeft] = this.takeLineWrappedParts(linesLeft, 4);
			line = php.implode(php.PHP_EOL, php.array_merge([line], wrappedParts));
			if (ticket = this.parseTicket(line)) {
				mcoDetails.document = ticket;
			} else if (fopLine = FopLineParser.parse(line)) {
				mcoDetails.formOfPayment = fopLine;
			} else {
				mcoDetails.unparsedLines = mcoDetails.unparsedLines || [];
				mcoDetails.unparsedLines.push(line);
			}
		}
		return mcoDetails;
	}

	// ' 54 FA PAX 016-7266292190/ETUA/USD6002.27/21OCT18/SFO1S2195/0557'
	// '       8602/S2'

	// ' 16 FA PAX 157-8201820530/DTQR/USD250.00/19AUG16/IADQR0001/09828',

	// ' 13 FA PAX 725-7892926310/ETW3/18AUG16/SFO1S2195/05578602/S2-3'

	// ' 11 FA PAX 725-7892926294/ETW3/USD479.90/01JUL16/SFO1S2195/05578',
	// '602/S2-3',

	// should not match this, since it's not a ticket, it's MCO document:
	// '     1 FA 235-5050440440/PTTK/USD34.00/14FEB17/SFO1S2195/0557860',
	// '2',
	static parseTicket(line)  {
		let matches;
		if (php.preg_match(/^\s{0,2}(\d+)\s+FA\s+(.+)$/s, line, matches = [])) {
			let [, lineNumber, content] = matches;
			content = content.replace(/\r\n|\r|\n/g, '');
			const tokens = content.split('/');
			const result = {
				lineNumber: lineNumber,
			};
			const firstToken = tokens.shift();
			if (php.preg_match(/^(PAX\s+|INF\s+|)(\d{3})-(\d{10})(-\d+|)$/, firstToken, matches = [])) {
				let pax, ext;
				[, pax, result.airlineNumber, result.documentNumber, ext] = matches;
				result.isInfant = php.trim(pax) === 'INF';
				let date = tokens.shift();
				if (php.preg_match(/^([A-Z])([A-Z])([A-Z0-9]{2})$/, date, matches = [])) {
					[, result.ticketType, result.status, result.airline] = matches;
					date = php.array_shift(tokens);
				}
				if (php.preg_match(/^([A-Z]{3})(\d*\.?\d+)$/, date, matches = [])) {
					[, result.currency, result.amount] = matches;
					date = php.array_shift(tokens);
				}
				result.transactionDt = ParserUtil.parse2kDate(date);
				result.officeId = php.array_shift(tokens);
				result.arcNumber = php.array_shift(tokens);
				const segRaw = php.array_shift(tokens);
				if (segRaw) {
					if (php.preg_match(/^S(\d+)-(\d+)$/, segRaw, matches = [])) {
						[, result.segmentStart, result.segmentEnd] = matches;
					} else if (php.preg_match(/^S(\d+)$/, segRaw, matches = [])) {
						result.segmentStart = matches[1];
						result.segmentEnd = matches[1];
					} else {
						tokens.unshift(segRaw);
					}
				}
			} else {
				tokens.unshift(firstToken);
			}
			result.unparsedTokens = tokens;
			return result;
		} else {
			return null;
		}
	}

	/**
     * set of tokens that may have different formats
     * @param textLeft = '359 E0 H' || 'A' || '*1A/E*'
     */
	static parseDayOffsetSegmentEnding(textLeft)  {
		let matches, $_, aircraft, eticket, unparsed, meal, gkRemark, gds;

		if (php.preg_match(/^([A-Z0-9]{3})\s+(E)(\S)\s+([A-Z\-]+)(.*)/s, textLeft, matches = [])) {
			[$_, aircraft, eticket, unparsed, meal, textLeft] = matches;
			return {
				aircraft: aircraft,
				eticket: eticket === 'E',
				unparsedToken1: unparsed,
				meals: {
					raw: meal,
					parsed: php.str_split(meal, 1).map(m => FlightInfoParser.decodeMeal(m)),
				},
				textLeft: textLeft,
			};
		} else if (php.preg_match(/^(A)($|\s+)/s, textLeft, matches = [])) {
			[$_, gkRemark, textLeft] = matches;
			return {
				gkRemark: gkRemark,
				textLeft: textLeft,
			};
		} else if (php.preg_match(/^\*([A-Z0-9]{2})\/(E)\*(.*)/s, textLeft, matches = [])) {
			[$_, gds, eticket, textLeft] = matches;
			return {
				gds: gds,
				eticket: eticket === 'E',
				textLeft: textLeft,
			};
		} else {
			return {
				textLeft: textLeft,
			};
		}
	}

	static decodeMarriageLetter(letter)  {
		return ({
			M: 'AMADEUS_RULES',
			T: 'TRAFFIC_RESTRICTION',
			A: 'AIRLINE_TYPE_A',
			B: 'AIRLINE_TYPE_B',
			R: 'AIRLINE_SPACE_CONTROL',
			N: 'NEGOTIATED_SPACE',
		} || {})[letter];
	}

	static parseMarriageToken(token) {
		//      1  SU2119 Y 10DEC 7 RIXSVO HK1            225A 500A   *1A/E*
		//                                                          A01
		//      2  SU2580 Y 10DEC 7 SVOLHR HK1        D   815A 930A   *1A/E*
		//                                                          A01
		const regex =
            '/^'+
            '\\s*'+
            '(?<marriageType>[A-Z])'+
            '(?<marriage>\\d{2})'+
            '/';

		let tokens;
		if (php.preg_match(regex, token, tokens = [])) {
			return {
				marriageType: {
					raw: tokens.marriageType,
					parsed: this.decodeMarriageLetter(tokens.marriageType),
				},
				marriage: tokens.marriage,
			};
		} else {
			return null;
		}
	}

	// '  6  TK 079 M 29AUG 4 ISTSFO HK1            105P 430P   *1A/E*',
	// '                                                      A01',
	static parseDayOffsetSegmentLineByPattern(line, pattern) {
		const split = ParserUtil.splitByPosition(line, pattern, null, true);
		const textLeft = split['M'] + line.slice(pattern.length).trim();
		const result = {
			lineNumber: split['#'],
			segmentType: this.ITINERARY_SEGMENT,
			displayFormat: this.FORMAT_DAY_OFFSET,
			airline: split['A'],
			flightNumber: split['F'],
			bookingClass: split['B'],
			departureDate: this.parsePartialDate(split['D']),
			dayOfWeek: split['W'],
			departureAirport: split['R'],
			destinationAirport: split['N'],
			segmentStatus: split['S'],
			seatCount: split['Q'],
			terminalTime: this.parseTime(split['U']),
			terminal: split['G'],
			departureTime: this.parseTime(split.t),
			destinationTime: this.parseTime(split['T']),
			// may get '|' if pasted Amadeus itinerary in Apollo session
			dayOffset: php.intval((split['O'] || '0').replace('|', '+')),
			// should get some more dumps to parse following
			eticket: null,
			confirmationAirline: null,
			confirmationNumber: null,
			textLeft: textLeft,
			raw: line,
		};
		if (php.trim(split[' ']) === '' &&
            ((result.departureDate || {}).parsed) &&
            ((result.departureTime || {}).parsed) &&
            ((result.destinationTime || {}).parsed)
		) {
			const ending = this.parseDayOffsetSegmentEnding(result.textLeft);
			Object.assign(result, ending);
			const marriageData = !textLeft ? null : this.parseMarriageToken(result.textLeft);
			if (marriageData) {
				Object.assign(result, marriageData, {textLeft: ''});
			}
			return result;
		} else {
			return null;
		}
	}

	/**
     * this way segments look in PCC-s like NYC1S2186 where
     * "EAS EXTENDED AIR SEG DISP" flag is configured as "NO"
     */
	static parseDayOffsetSegmentLine(line)  {
		const patterns = [
			//  '  2  AY 099 Y 10APR 2 HELHKG HK1  1050P 2  1150P 230P+1 359 E0 H',
			//  '  1  AY1074 Y 10APR 2 RIXHEL HK1   135P     220P 330P   AT7 E0 G',
			//  '  1  SU1845 Y 10DEC 7 KIVSVO HK1            140A 535A   32A E0 S'
			//  '  6  VA 165 I 22FEB 4 AKLMEL GK1        I   630A 840A   A',
			//  '  4  SU2682 Y 10DEC 7 SVORIX HK2        D   925A1005A   *1A/E*',
			'#### AAFFFF B DDDDD W RRRNNN SSQQ UUUUU GG tttttTTTTTOO MMMMMMMMMMMMMMMM ', // NYC1S2186
			//  "  1  BR 031 C 10DEC 2 JFKTPE HK1       1  0020 0540+1 77W E 0 M",
			//  "  2  BR 271 C 11DEC 3 TPEMNL HK1       2  0910 1145   77W E 0 M",
			'#### AAFFFF B DDDDD W RRRNNN SSQQ UUUU GG tttt TTTTOO MMMMMMMMMMMMMMMM ', // MNLPH28FP
		];
		for (const pattern of patterns) {
			const parsed = this.parseDayOffsetSegmentLineByPattern(line, pattern);
			if (parsed) {
				return parsed;
			}
		}
		return null;
	}

	static parseExtendedDisplaySegmentLine(line)  {
		let regex, tokens;

		// '  1  AY 099 Y 10APR 2 HELHKG DK1  1150P 230P 11APR  E  0 359 HH'
		// '  2  W3 303 L 28AUG 7 ROBLOS HK1  1140A 425P 28AUG  E  W3/CXPNQ6'
		// '  1  AY 099 Y 10APR 2 HELHKG GK1  1150P 230P 11APR  A'
		regex =
            '/^'+
            '\\s{0,3}'+
            '(?<lineNumber>\\d{1,2})'+
            '\\s\\s'+
            '(?<airline>[A-Z\\d]{2})'+
            '\\s*'+
            '(?<flightNumber>\\d+)'+
            '\\s*'+
            '(?<bookingClass>[A-Z]{1})'+
            '\\s'+
            '(?<departureDate>\\d{1,2}[A-Z]{3})'+
            '\\s'+
            '(?<dayOfWeek>\\d{1})'+ // Not actually sure
            '(?<marriageMark>\\s|\\*)'+
            '(?<departureAirport>[A-Z]{3})'+
            '(?<destinationAirport>[A-Z]{3})'+
            '\\s'+
            '(?<segmentStatus>[A-Z]{2})'+
            '(?<seatCount>\\d+)'+
            '\\s+'+
            '(?<departureTime>\\d{3,4}[A-Z]?)'+
            '\\s?'+
            '(?<destinationTime>\\d{3,4}[A-Z]?)'+
            '\\s?'+
            '(?<destinationDate>\\d{1,2}[A-Z]{3})'+
            '\\s*'+
            '(?<eticket>E?)'+
            '\\s*'+
            '((?<confirmationAirline>[A-Z\\d]{2})\\\/(?<confirmationNumber>[A-Z\\d]{6}))?'+
            '\\s?'+
            '/';

		if (php.preg_match(regex, line, tokens = [])) {
			return {
				lineNumber: tokens.lineNumber,
				segmentType: this.ITINERARY_SEGMENT,
				displayFormat: this.FORMAT_EXTENDED,
				airline: tokens.airline,
				flightNumber: tokens.flightNumber,
				bookingClass: tokens.bookingClass,
				departureDate: this.parsePartialDate(tokens.departureDate),
				dayOfWeek: tokens.dayOfWeek,
				isMarried: tokens.marriageMark === '*',
				departureAirport: tokens.departureAirport,
				destinationAirport: tokens.destinationAirport,
				segmentStatus: tokens.segmentStatus,
				seatCount: tokens.seatCount,
				eticket: tokens.eticket ? true : false,
				departureTime: this.parseTime(tokens.departureTime),
				destinationTime: this.parseTime(tokens.destinationTime),
				destinationDate: this.parsePartialDate(tokens.destinationDate),
				confirmationAirline: tokens.confirmationAirline,
				confirmationNumber: tokens.confirmationNumber,
				raw: line,
			};
		} else {
			return null;
		}
	}

	static parseSegmentLine(line)  {

		return this.parseExtendedDisplaySegmentLine(line)
            || this.parseDayOffsetSegmentLine(line);
	}

	static parseMisSegmentLine(line)  {
		let regex, tokens;

		// '  4 MIS 1A HK1 SFO 21DEC-PRESERVEPNR'
		regex =
            '/^'+
            '\\s{0,3}'+
            '(?<lineNumber>\\d{1,2})'+
            '\\s'+
            'MIS'+
            '\\s'+
            '(?<airline>[A-Z\\d]{2})'+
            '\\s*'+
            '(?<text>.+)'+
            '$'+
            '/';

		if (php.preg_match(regex, line, tokens = [])) {
			return {
				lineNumber: tokens.lineNumber,
				segmentType: this.SEGMENT_TYPE_OTH,
				text: line,
			};
		} else {
			return null;
		}
	}

	static parseFlwnSegmentLine(line)  {
		let regex, tokens;

		// '  2  W3 108 M 13AUG 6 JFKLOS         FLWN'
		regex =
            '/^'+
            '\\s{0,3}'+
            '(?<lineNumber>\\d{1,2})'+
            '\\s\\s'+
            '(?<airline>[A-Z\\d]{2})'+
            '\\s*'+
            '(?<flightNumber>\\d+)'+
            '\\s*'+
            '(?<bookingClass>[A-Z]{1})'+
            '\\s'+
            '(?<departureDate>\\d{1,2}[A-Z]{3})'+
            '\\s'+
            '(?<dayOfWeek>\\d{1})'+ // Not actually sure
            '(\\s|\\*)'+
            '(?<departureAirport>[A-Z]{3})'+
            '(?<destinationAirport>[A-Z]{3})'+
            '\\s+'+
            'FLWN'+
            '\\s*'+
            '/';

		if (php.preg_match(regex, line, tokens = [])) {
			return {
				lineNumber: tokens.lineNumber,
				segmentType: this.FLWN_SEGMENT,
				airline: tokens.airline,
				flightNumber: tokens.flightNumber,
				bookingClass: tokens.bookingClass,
				departureDate: this.parsePartialDate(tokens.departureDate),
				dayOfWeek: tokens.dayOfWeek,
				departureAirport: tokens.departureAirport,
				destinationAirport: tokens.destinationAirport,
				raw: line,
			};
		} else {
			return null;
		}
	}

	// 'SFO1S2195/4000NI/19APR16',
	// 'MUC1A0701/1234BM/1OCT04',
	// 'SFO1S2195/9998WS/6JUL17'
	static parseHeaderLine2(line)  {
		let regex, matches;

		regex =
            '/^'+
            '(?<officeId>[A-Z0-9]{3,})\/'+
            '(?<agentNumber>\\d+)'+
            '(?<agentInitials>[A-Z0-9]{2,3})\/'+
            '(?<date>\\d{1,2}[A-Z]{3}\\d{2,4})'+
            '\\s*$/';

		if (php.preg_match(regex, line, matches = [])) {
			return {
				officeId: matches.officeId,
				agentNumber: matches.agentNumber,
				agentInitials: matches.agentInitials,
				date: ParserUtil.parse2kDate(matches.date),
			};
		} else {
			return null;
		}
	}

	// >HELP HEADER; >MS64;
	static parseHeaderLine1(line)  {
		let regex, tokens, parsedDate;

		// 'RP/SFO1S2195/SFO1S2195            NI/GS  18AUG16/1833Z   2RFU8B'
		// 'RP/SFO1S2195/SWI1GCFZKRE/5RB/45520300    24SEP16/2215Z   3R593V',
		regex =
            '/^'+
            '[A-Z\\d]{2}\/'+
            '(?<responsibleOfficeId>[A-Z0-9]+)\/'+
            '(?<queueingOfficeId>[A-Z0-9]+)'+
            '.+?'+
            '(\\s+'+
                '(?<agentInitials>[A-Z0-9]{2,3})\/'+
                '(?<dutyCode>[A-Z0-9]{2,3})'+
            ')?'+
            '\\s+'+
            '(?<date>\\d{1,2}[A-Z]{3}\\d{2})\/'+
            '(?<time>\\d{3,4})'+
            '(?<timezone>[A-Z]?)'+
            '\\s+'+
            '(?<recordLocator>[A-Z0-9]{6})'+
            '\\s*'+
            '$/';
		if (php.preg_match(regex, line, tokens = [])) {
			parsedDate = ParserUtil.parseFullDate(tokens.date);
			return {
				responsibleOfficeId: tokens.responsibleOfficeId,
				queueingOfficeId: tokens.queueingOfficeId,
				agentInitials: tokens.agentInitials || '',
				dutyCode: tokens.dutyCode,
				recordLocator: tokens.recordLocator,
				date: {
					raw: tokens.date,
					parsed: parsedDate ? '20' + parsedDate : null,
				},
				time: {
					raw: tokens.time,
					parsed: ParserUtil.decodeGdsTime(tokens.time),
				},
			};
		} else {
			return null;
		}
	}

	static parsePassengerLine(line)  {
		let res;

		res = AmadeusReservationPassengerBlockParser.parseLine(line);
		if (res.success) {
			return res.passengerList;
		} else {
			return null;
		}
	}

	/**
     * adds absolute numbers (needs all lines) and removes legacy keys
     * @param passengers = require('PnrParser.js').parsePassengerLine().passengerList
     */
	static transformPassengers(passengers)  {
		let result, i, passenger;

		result = [];
		for (i = 0; i < php.count(passengers); ++i) {
			passenger = passengers[i];
			if (!passenger.success) continue;

			passenger.ageGroup = null; // depends on context
			passenger.nameNumber.raw = passenger.rawNumber;
			passenger.nameNumber.absolute = i + 1;
			passenger.nameNumber.firstNameNumber = passenger.nameNumber.isInfant ? 2 : 1;
			delete(passenger.passengerType, passenger.rawNumber);
			result.push(passenger);
		}
		return result;
	}

	static takeLineWrappedParts(lines, indent)  {
		const wrappedParts = [];
		let line;
		while (line = lines.shift()) {
			if (line.startsWith(php.str_repeat(' ', indent))) {
				wrappedParts.push(line.slice(indent));
			} else {
				lines.unshift(line);
				break;
			}
		}
		return [wrappedParts, lines];
	}

	static parsePartialDate(token)  {
		const parsed = token
			? ParserUtil.parsePartialDate(token)
			: null;
		return parsed
			? {raw: token, parsed: parsed}
			: null;
	}

	static parseTime(token)  {
		const parsed = token
			? ParserUtil.decodeGdsTime(token)
			: null;
		return token.trim()
			? {raw: token, parsed}
			: null;
	}

	static parseOperatedByLine(line)  {
		line = line.trim();
		let matches;
		if (php.preg_match(/^OPERATED BY(?<operator>.*)$/, php.trim(line), matches = [])) {
			return {
				operator: php.trim(matches.operator),
			};
		} else {
			return null;
		}
	}
}
PnrParser.ITINERARY_SEGMENT = 'ITINERARY_SEGMENT';
PnrParser.FORMAT_DAY_OFFSET = 'DAY_OFFSET';
PnrParser.FLWN_SEGMENT = 'FLWN_SEGMENT';
PnrParser.FORMAT_EXTENDED = 'EXTENDED';
// It is called MIS in Amadeus, but since we have OTH segment in Apollo
// & Sabre w/ essentially the same meaning, lets call it OTH
PnrParser.SEGMENT_TYPE_OTH = 'OTH';

module.exports = PnrParser;
