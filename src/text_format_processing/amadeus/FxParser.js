const ParserUtil = require('../agnostic/ParserUtil.js');

const FareConstructionParser = require('../../../../Gds/Parsers/Common/FareConstruction/FareConstructionParser.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');
const {parseSequence, parseBagAmountCode} = ParserUtil;

/**
 * parses output of FX{modifiers} command which contains pricing with fare
 * calculation if there is just one PTC or just a ptc list if there are many
 */
class FxParser {
	/**
	 * this wrapper does not require $names
	 * handy if you do postprocessing
	 */
	static splitByPositionLetters(line, pattern) {
		return ParserUtil.splitByPosition(line, pattern, null, true);
	}

	static isEmptyLine($line) {
		return php.trim($line) === '';
	}

	static parseSegmentLine(line) {
		let matches;

		const flightSegment = this.parseFlightSegment(line);
		if (flightSegment) {
			return flightSegment;
		} else if (php.preg_match(/^\s*([A-Z]{3})\s+S U R F A C E\s*$/, line, matches = [])) {
			// ' YAO      S U R F A C E',
			return {type: 'surface', destinationCity: matches[1], isStopover: true};
		} else {
			return null;
		}
	}

	static parseFlightSegment($line) {
		//              '     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
		//              'XDTT DL   462 B *  23OCT 0910  BNE0WRMD                   2P',
		//              ' ADD ET   501 H *  20NOV 1030  HLOWUS                     2P',
		//              ' RIX SU  2682 Y    10DEC 0925  YVO             10DEC10DEC 1P',
		//              "XTPE BR    31 C  C 10DEC 0020  COU             10DEC10DEC 2P",
		const pattern = 'XAAA CC  FFFF L *_ WWWWW TTTT  IIIIIIIIIIIIIIIIOOOOOEEEEEBBBBB';
		const split = this.splitByPositionLetters($line, pattern);

		const date = ParserUtil.parsePartialDate(split['W']);
		const time = ParserUtil.decodeGdsTime(split['T']);
		const nvbDate = ParserUtil.parsePartialDate(split['O']);
		const nvaDate = ParserUtil.parsePartialDate(split['E']);

		const isEmptyString = ($val) => $val === '';
		const [fareBasis, ticketDesignator] = php.array_pad(php.explode('/', split['I']), 2, null);
		const result = {
			type: 'flight',
			isStopover: split['X'] !== 'X',
			/** it can be both a city (WAS), and an airport (JFK) */
			destinationCity: split['A'],
			airline: split['C'],
			flightNumber: split['F'],
			bookingClass: split['L'],
			rebookRequired: split['*'] === '*',
			departureDate: {raw: split['W'], parsed: date},
			departureTime: {raw: split['T'], parsed: time},
			fareBasis: fareBasis,
			ticketDesignator: ticketDesignator,
			notValidBefore: nvbDate ? {raw: split['O'], parsed: nvbDate} : null,
			notValidAfter: nvaDate ? {raw: split['E'], parsed: nvaDate} : null,
			freeBaggageAmount: parseBagAmountCode(split['B']),
		};
		if (date && time && php.trim(split[' ']) === '' &&
			result.bookingClass && !Object.values(result).some(isEmptyString)
		) {
			return result;
		} else {
			return null;
		}
	}

	static splitValueAndFcLine($line) {
		//              'USD   633.00      20NOV17WAS ET ADD424.00HLOWUS ET NBO209.00',
		//              '                  UOWET NUC633.00END ROE1.000000',
		//              'USD     8.62YQ    XT USD 18.00US USD 5.60AY USD 4.50XF IAD',
		//              'USD   262.00YR    4.50',
		//              'USD   120.29-YQ   XT USD 10.61-MD USD 7.31-WW USD 6.72-RI',
		//              'USD    28.10XT',
		//              'USD   931.72',
		const pattern = 'CCCAAAAAAAAATTT   FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
		const symbols = php.str_split(pattern, 1);
		const names = php.array_combine(symbols, symbols);
		const split = ParserUtil.splitByPosition($line, pattern, names, false);
		if (php.trim(split[' ']) === '') {
			const fcLine = split['F'];
			if (php.trim(split['C'] + split['A'] + split['T']) === '') {
				return [null, fcLine];
			} else {
				const value = {
					currency: split['C'],
					amount: php.trim(split['A']),
					taxCode: php.trim(split['T'], ' -') || null,
				};
				if (php.preg_match(/^[A-Z]{3}$/, value['currency']) &&
					php.preg_match(/^\d*\.?\d+$/, value['amount'])
				) {
					return [value, fcLine];
				}
			}
		}
		return null;
	}

	/**
	 * @param segments = [FxParser::parseSegmentLine(), ...]
	 * Amadeus wraps FC line on a digit followed by a letter or vice versa
	 * it's ok with everything except fare basis, which is alphanumeric
	 * so we use the known fare basis list to unwrap line correctly
	 */
	static unwrapFcLine(lines, segments) {
		const fareBases = [];
		const airlines = [];
		for (const segment of segments) {
			const air = segment.airline;
			if (air) {
				airlines.push(air);
			}
			let fb = segment.fareBasis;
			if (fb) {
				const td = segment.ticketDesignator;
				if (td) {
					fb += '/' + td;
				}
				fareBases.push(fb);
			}
		}
		let fullLine = php.array_shift(lines);
		for (const line of lines) {
			const nextStartsWith = airline => line.startsWith(airline + ' ');
			const endsWith = fb => fullLine.endsWith(fb);
			const wrappedOnLetter = php.preg_match(/[A-Z]$/, fullLine) && php.preg_match(/^[A-Z]/, line);
			const wrappedOnDigit = php.preg_match(/\d$/, fullLine) && php.preg_match(/^\d/, line);
			if (fareBases.some(endsWith) || wrappedOnLetter || wrappedOnDigit ||
				airlines.some(endsWith) || airlines.some(nextStartsWith)
			) {
				fullLine += ' ' + line;
			} else {
				fullLine += line;
			}
		}
		return fullLine;
	}

	static parseFareConstruction($raw) {
		let matches;
		if (php.preg_match(/^(\d{1,2}[A-Z]{3}\d{2,4})(.+)$/s, $raw, matches = [])) {
			const [, dateRaw, fcRaw] = matches;
			const fcRecord = FareConstructionParser.parse(fcRaw);
			fcRecord.raw = $raw;
			if (fcRecord.parsed) {
				fcRecord.parsed.date = {
					raw: dateRaw,
					parsed: '20' + ParserUtil.parseFullDate(dateRaw),
				};
			}
			return fcRecord;
		} else {
			return {error: 'Failed to match FC start - ' + php.substr($raw, 0, 7)};
		}
	}

	// separates XT taxes part from fare calculation
	static parseTaxBreakdown(fcLine) {
		const xtTaxes = [];
		const facilityCharges = [];
		let matches;
		if (php.preg_match(/^(.+)XT\s+(.+?)(([A-Z]{3}\s*\d*\.?\d+\s*)*)$/, fcLine, matches = [])) {
			let xtTaxesRaw, facilityChargesRaw;
			[, fcLine, xtTaxesRaw, facilityChargesRaw] = matches;
			let tuples;
			if (php.preg_match_all(/([A-Z]{3})\s*(\d*\.?\d+)\s*/, facilityChargesRaw, tuples = [], php.PREG_SET_ORDER)) {
				for (const [, airport, amount] of tuples) {
					facilityCharges.push({airport, amount});
				}
			}
			const taxRegex = /([A-Z]{3})\s*(\d*\.?\d+)[\s\-]*([A-Z0-9]{2})/;
			if (php.preg_match_all(taxRegex, xtTaxesRaw, tuples = [], php.PREG_SET_ORDER)) {
				for (const [, currency, amount, taxCode] of tuples) {
					xtTaxes.push({currency, amount, taxCode});
				}
			}
		}
		const taxBreakdown = {xtTaxes, facilityCharges};

		return [fcLine, taxBreakdown];
	}

	static parseWholeMessages(lines, appliesTo) {
		const result = {appliesTo};
		for (const $line of lines) {
			let matches;
			if (php.trim($line) === 'REBOOK TO CHANGE BOOKING CLASS AS SPECIFIED') {
				result.rebookStatus = 'required';
			} else if (php.trim($line) === 'NO REBOOKING REQUIRED FOR LOWEST AVAILABLE FARE') {
				result.rebookStatus = 'notRequired';
			} else if (php.preg_match(/^LAST TKT DTE (\d{1,2}[A-Z]{3}\d{2})\s*(.*?)\s*$/, $line, matches = [])) {
				const [, dateRaw, unparsed] = matches;
				result.lastDateToPurchase = {
					raw: dateRaw,
					parsed: '20' + ParserUtil.parseFullDate(dateRaw),
					unparsed: unparsed,
				};
			} else {
				result.unparsed = result.unparsed || [];
				result.unparsed.push($line);
			}
		}
		return result;
	}

	// >HELP FCPI; >MS379;
	// same code as in TQT
	static parseTstIndicator(raw) {
		const parsed = ({
			I: 'IATA_AUTOPRICED_FARE',
			B: 'NEGOTIATED_FARE',
			A: 'ATAF_AUTOPRICED_FARE',
			F: 'NEGOTIATED_AUTOPRICED_FARE_UPDATED_BY_AN_AIRLINE',
			G: 'NEGOTIATED_FARE_UPDATED_BY_AN_AGENT_OR_CONSOLIDATOR',
			M: 'MANUAL_PRICED_FARE',
			T: 'AUTOPRICED_INCLUSIVE_TOUR_FARE',
			W: 'NO_FARE_CALC_CHECK_AGAINST_TST_ITINERARY',
			O: 'CABIN_CLASS_OVERRIDE_USED_IN_PRICING',
		} || {})[raw];

		return {raw, parsed};
	}

	static parsePtcPricingMessages(lines) {
		let matches;

		const result = {};
		for (const line of lines) {
			if (php.preg_match(/^BG CXR: (\d+\*|)([A-Z0-9]{2})/, line, matches = [])) {
				result.bgCarrier = matches[2];
			} else if (php.preg_match(/^PRICED WITH VALIDATING CARRIER ([A-Z0-9]{2})/, line, matches = [])) {
				result.validatingCarrier = matches[1];
			} else if (php.preg_match(/^PRICED VC ([A-Z0-9]{2}) - OTHER VC AVAILABLE ([A-Z0-9]{2})/, line, matches = [])) {
				result.validatingCarrier = matches[1];
				result.otherVcAvailable = matches[2];
			} else if (php.preg_match(/^ENDOS (.+?)$/, line, matches = [])) {
				result.endorsementLines = result['endorsementLines'] || [];
				result.endorsementLines.push(matches[1]);
			} else if (php.preg_match(/^\s*TICKET STOCK RESTRICTION\s*$/, line)) {
				result.hasTicketStockRestriction = true;
			} else if (php.preg_match(/^\s*(CAT35|.*)\s*(NEGOTIATED FARES|PRIVATE RATES USED)\s*\*?([A-Z]|)\*?\s*$/, line, matches = [])) {
				const [, cat, nego, $tstIndicator] = matches;
				result.negotiatedFareCategory = cat;
				result.hasNegotiatedFaresMessage = true;
				result.tstIndicator = null;
				result.tstIndicator = !$tstIndicator ? null :
					this.parseTstIndicator($tstIndicator);
			} else {
				result.unparsed = result.unparsed || [];
				result.unparsed.push(line);
			}
		}
		return result;
	}

	// first lines like:
	// ' NYC',
	// ' TAS HY   102 K *  06JUL 1500  KHE6M           06JUL06JUL 2P',
	static parsePtcPricing(lines) {
		let emptyLines;

		const departureCity = php.trim(php.array_shift(lines));
		let segments;
		[segments, lines] = parseSequence(lines, (...args) => this.parseSegmentLine(...args));
		if (segments.length === 0) {
			return {error: 'Failed to parse FX segment line - ' + lines[0]};
		}
		[emptyLines, lines] = parseSequence(lines, (...args) => this.isEmptyLine(...args));

		let fcSplit;
		[fcSplit, lines] = parseSequence(lines, (...args) => this.splitValueAndFcLine(...args));
		[emptyLines, lines] = parseSequence(lines, (...args) => this.isEmptyLine(...args)); // infant
		let fcSplit2;
		[fcSplit2, lines] = parseSequence(lines, (...args) => this.splitValueAndFcLine(...args));
		fcSplit = php.array_merge(fcSplit, fcSplit2);

		let values = php.array_column(fcSplit, 0);
		const fcLines = php.array_column(fcSplit, 1);

		const baseFare = php.array_shift(values);
		const fareEquivalent = php.array_shift(values);
		values = php.array_values(php.array_filter(values));
		const netPrice = php.array_pop(values);
		const mainTaxes = values;

		let fcLine = this.unwrapFcLine(fcLines, segments);
		let taxBreakdown;
		[fcLine, taxBreakdown] = this.parseTaxBreakdown(fcLine);
		const {xtTaxes, facilityCharges} = taxBreakdown;

		return {
			departureCity, segments, baseFare, fareEquivalent,
			fareConstruction: this.parseFareConstruction(fcLine),
			mainTaxes, xtTaxes, facilityCharges, netPrice,
			additionalInfo: this.parsePtcPricingMessages(lines),
		};
	}

	/** @param query = '1' || '' || '1,3-4' */
	static parseCmdPaxNums(query) {
		if (php.preg_match(/^\s*(\d[\d,-]*)\s*$/, query)) {
			const parseRange = (text) => {
				const pair = text.split('-');
				return php.range(pair[0], pair[1] || pair[0]);
			};
			return query.trim().split(',').flatMap(parseRange);
		} else {
			return null;
		}
	}

	static parsePassengerLine($line) {
		//              '   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
		//              '02 SMITH/JANNI*      ADT     1     980.00  623.50    1603.50',
		//              '04 LIBERMANE/ZIMICH  CNN     1     361.00   67.11     428.11',
		//              '02 LIBERMANE/LONGL*  CNN     1     359.00   66.77     425.77',
		//              '02 LONGLONGL*/LONGL* CNN     1     359.00   66.77     425.77',
		//              '01 1,3-4             ADT     3     742.00   82.73     824.73',
		//              '03 3 INF             INF     1      15.00    0.00      15.00',
		//              "03 WALTERS/PATRI*    IN      1       3086    8974      12060",
		//              '04 SOUFFRONT/SEBAS*  CH33*   1     509.00  118.03     627.03',
		//              '                   TOTALS    5    2239.00  268.44    2507.44','
		const pattern = 'NN FFFFFFFFFFFFFFFFF.PPPPPP QQ BBBBBBBBBB TTTTTTT CCCCCCCCCC';
		const split = this.splitByPositionLetters($line, pattern);

		const lname = php.explode('/', split['F'])[0];
		const fname = (php.explode('/', split['F']) || {})[1];
		const cmdPaxNumsRaw = php.explode(' ', split['F'])[0];
		const infMark = (php.explode(' ', split['F']) || {})[1];
		const ptcStr = split['P'];
		const ptcMatch =
			ptcStr.match(/^([A-Z]{2})(.{2,})$/) ||
			ptcStr.match(/^([A-Z0-9]{2,3})(.*)$/);
		if (!ptcMatch) {
			return null;
		}
		const [, ptc, ptcDescription] = ptcMatch;
		const result = {
			lineNumber: split['N'],
			ptc: ptc,
			ptcDescription: ptcDescription,
			quantity: split['Q'],
			baseFare: split['B'],
			taxAmount: split['T'] || null,
			netPrice: split['C'],
		};
		const cmdPaxNums = this.parseCmdPaxNums(cmdPaxNumsRaw);
		if (!php.empty(cmdPaxNums)) {
			result.hasName = false;
			result.cmdPaxNums = cmdPaxNums;
			result.isInfantCapture = infMark === 'INF';
		} else {
			result.hasName = true;
			result.lastName = php.rtrim(lname, '*');
			result.lastNameTruncated = php.rtrim(lname, '*') !== lname;
			result.firstName = php.rtrim(fname, '*');
			result.firstNameTruncated = php.rtrim(fname, '*') !== fname;
		}
		if (php.trim(split[' ']) === '' &&
			php.preg_match(/^[A-Z0-9]{2,3}$/, result['ptc']) &&
			php.preg_match(/^\d*\.?\d+$/, result['baseFare']) &&
			php.preg_match(/^\d*\.?\d+$/, result['netPrice'])
		) {
			return result;
		} else {
			return null;
		}
	}

	// first line like:
	// '01 LIBERMANE/LEPIN   CNN     1     361.00   67.11     428.11'
	static parsePtcList(lines) {
		let passengers, emptyLines;

		[passengers, lines] = parseSequence(lines, (...args) => this.parsePassengerLine(...args));
		[emptyLines, lines] = parseSequence(lines, (...args) => this.isEmptyLine(...args));
		const totals = this.parsePassengerLine(php.array_shift(lines));
		if (!totals) {
			throw new Error('Failed to parse FXX TOTALS line - ' + lines[0]);
		}
		[emptyLines, lines] = parseSequence(lines, (...args) => this.isEmptyLine(...args));
		return {
			passengers: passengers,
			totalPassengers: totals.quantity,
			totalBaseFare: totals.baseFare,
			totalTaxAmount: totals.taxAmount,
			totalNetPrice: totals.netPrice,
			additionalInfo: {
				unparsed: lines,
			},
		};
	}

	static parse($dump) {
		const lines = $dump.split('\n');
		const commandCopy = lines.shift().trim();
		const wholeMessages = [];
		let type = null;
		let data = null;
		for (let i = 0; i < php.count(lines); ++i) {
			const line = lines[i];
			if (php.trim(line) !== '') {
				let matches;
				if (php.preg_match(/^\s*-{3,}(.*?)-{3,}\s*$/, line, matches = [])) {
					type = 'ptcPricing';
					const pricingBlock = php.array_splice(lines, i + 2);
					data = this.parsePtcPricing(pricingBlock);
					data.privateFareHeader = matches[1];
				} else if (php.preg_match(/PASSENGER.*PTC.*NP.*FARE\s+([A-Z]{3})/, line, matches = [])) {
					type = 'ptcList';
					const ptcListBlock = php.array_splice(lines, i + 1);
					data = this.parsePtcList(ptcListBlock);
					data.currency = matches[1];
				} else {
					wholeMessages.push(php.trim(line));
				}
			}
		}

		if (type !== null) {
			return {
				commandCopy,
				wholeMessages: this.parseWholeMessages(wholeMessages),
				type,
				data,
				error: data.error || undefined,
			};
		} else {
			return {error: 'Failed to parse PTC list/pricing - ' + $dump.trim().slice(0, 100)};
		}
	}
}

module.exports = FxParser;
