const ParserUtil = require('../agnostic/ParserUtil.js');
const GdsConstants = require('../agnostic/GdsConstants.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * parses output of DO{fromSegNum}-{toSegNum}
 * hidden stops/meals/flight duration/etc...
 */
class FlightInfoParser {
	static parseSequence(linesLeft, parse) {
		let parsedLines, line, parsedLine;

		parsedLines = [];
		while (line = php.array_shift(linesLeft)) {
			if (parsedLine = parse(line)) {
				parsedLines.push(parsedLine);
			} else {
				php.array_unshift(linesLeft, line);
				break;
			}
		}
		return [parsedLines, linesLeft];
	}

	static isEmptyLine(line) {
		return php.trim(line) === '';
	}

	// '* OPERATIONAL FLIGHT INFO *            DL9578    0 WE 20DEC17   ',
	// '*1A PLANNED FLIGHT INFO*              DL 201   72 SA 09SEP17    ',
	static parseSegmentBlockHeader(line) {
		let regex, matches;

		regex =
			'/^\\*(?<label>.+?)\\*\\s+.*?' +
			'(?<airline>[A-Z0-9]{2})\\s*' +
			'(?<flightNumber>\\d{1,4})\\s+' +
			'(?<unparsedToken1>.*?)\\s+' +
			'(?<dayOfWeek>[A-Z]{2})\\s+' +
			'(?<departureDate>\\d{1,2}[A-Z]{3}\\d{2})' +
			'/';
		if (php.preg_match(regex, line, matches = [])) {
			return {
				label: matches.label,
				airline: matches.airline,
				flightNumber: matches.flightNumber,
				unparsedToken1: matches.unparsedToken1,
				dayOfWeek: {
					raw: matches.dayOfWeek,
					parsed: ParserUtil.gdsDayOfWeekToNumber(matches.dayOfWeek),
				},
				departureDate: {
					raw: matches.departureDate,
					parsed: '20' + ParserUtil.parseFullDate(matches.departureDate),
				},
			};
		} else {
			return null;
		}
	}

	// '* OPERATIONAL FLIGHT INFO *            DL9578    0 WE 20DEC17   ',
	static parseOperationalFlightLine(line) {
		let parsed;

		parsed = this.parseSegmentBlockHeader(line);
		if (parsed && php.trim(parsed.label) === 'OPERATIONAL FLIGHT INFO') {
			return parsed;
		} else {
			return null;
		}
	}

	// '*1A PLANNED FLIGHT INFO*              DL 201   72 SA 09SEP17    ',
	static parsePlannedFlightLine(line) {
		let parsed;

		parsed = this.parseSegmentBlockHeader(line);
		if (parsed && php.trim(parsed.label) === '1A PLANNED FLIGHT INFO') {
			return parsed;
		} else {
			return null;
		}
	}

	static decodeMeal(letter) {
		let mealCodes;

		// same codes as in Sabre
		mealCodes = {
			'M': GdsConstants.MEAL_MEAL,
			'L': GdsConstants.MEAL_LUNCH,
			'S': GdsConstants.MEAL_SNACK,
			'D': GdsConstants.MEAL_DINNER,
			'H': GdsConstants.MEAL_HOT_MEAL,
			'O': GdsConstants.MEAL_COLD_MEAL,
			'B': GdsConstants.MEAL_BREAKFAST,
			'N': GdsConstants.MEAL_NO_MEAL_SVC,
			'R': GdsConstants.MEAL_REFRESHMENTS,
			'V': GdsConstants.MEAL_REFRESH_AT_COST,
			'C': GdsConstants.MEAL_ALCOHOL_NO_COST,
			'F': GdsConstants.MEAL_FOOD_TO_PURCHASE,
			'P': GdsConstants.MEAL_ALCOHOL_PURCHASE,
			'K': GdsConstants.MEAL_CONTINENTAL_BREAKFAST,
			'G': GdsConstants.MEAL_FOOD_AND_ALCOHOL_AT_COST,

			'Y': GdsConstants.MEAL_DUTY_FREE_SALES_AVAILABLE,
			'-': GdsConstants.MEAL_NO_MEAL_IS_OFFERED,
		};

		return mealCodes[letter];
	}

	// 'JCDIZ/M', 'WY/D', 'JCDIZWYBMHQ/N'
	static parseMeal(text) {
		let matches, $_, classes, raw;

		if (php.preg_match(/^([A-Z]+)\/([A-Z\-]+)$/, text, matches = [])) {
			[$_, classes, raw] = matches;
			return {
				bookingClasses: php.str_split(classes, 1),
				raw: raw,
				parsed: php.array_map((...args) => this.decodeMeal(...args), php.str_split(raw, 1)),
			};
		} else {
			return null;
		}
	}

	static parseLocationLine(line) {
		//              'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
		//              'DTW          1210  SU JCDIZ/M  WY/D       744        13:05      ',
		//              '                      BMHQKLUTXVE/D                             ',
		//              'NRT 1415  MO 1650  MO JCDIZWYBMHQ/D       76W   2:35  5:05      ',
		//              '                      KLUTXVE/D                                 ',
		//              'MNL 2055  MO                                               20:45',
		//              'ROB          2035  SU JCDZPIYBMUH/DB      332         6:35      ',
		const pattern = 'AAA TTTTT WW ttttt ww MMMMMMMMMMMMMMMMMMM EEE GGGGGG FFFFF VVVVV';
		const split = ParserUtil.splitByPosition(line, pattern, null, true);
		const meals = php.preg_split(/\s+/, split['M']).map(t => this.parseMeal(t));
		const result = {
			departureAirport: split['A'],
			destinationTime: split['T'] ? {
				raw: split['T'],
				parsed: ParserUtil.decodeGdsTime(split['T']),
			} : null,
			destinationDayOfWeek: split['W'] ? {
				raw: split['W'],
				parsed: ParserUtil.gdsDayOfWeekToNumber(split['W']),
			} : null,
			departureTime: split.t ? {
				raw: split.t,
				parsed: ParserUtil.decodeGdsTime(split.t),
			} : null,
			departureDayOfWeek: split.w ? {
				raw: split.w,
				parsed: ParserUtil.gdsDayOfWeekToNumber(split.w),
			} : null,
			meals: meals,
			aircraft: split['E'],
			groundDuration: split['G'],
			flightDuration: split['F'],
			travelDuration: split['V'],
		};
		const hasMainPart = meals.every(m => m)
			|| php.preg_match(/^\d*:\d{2}$/, result.travelDuration);

		if (split[' '].trim() === '' && hasMainPart) {
			return result;
		} else {
			return null;
		}
	}

	static parseCommentLine(line) {
		//         ' 4.NRT MNL   - ARRIVES TERMINAL 3                               ',
		//         '15.ENTIRE FLT- SECURED FLIGHT                                   ',
		const pattern = 'DD.CCCCCCCCCC- TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT';
		const split = ParserUtil.splitByPosition(line, pattern);

		if (php.trim(split['D'] + split['.'] + split['C'] + split['-'] + split[' ']) === '' && php.trim(split['T']) !== '') {
			// continuation of the comment on previous line
			return {raw: php.rtrim(split['T'])};
		}

		const coverage = split['C'];
		let entireSegment, from, to, matches;
		if (coverage === 'ENTIRE FLT') {
			entireSegment = true;
			[from, to] = [null, null];
		} else if (php.preg_match(/^\s*([A-Z]{3})\s+([A-Z]{3})\s*$/, coverage, matches = [])) {
			entireSegment = false;
			[, from, to] = matches;
		} else {
			return null;
		}
		const result = {
			type: 'comment',
			lineNumber: php.intval(split['D']),
			from, to, entireSegment,
			raw: php.rtrim(split['T']),
		};
		if (split['.'] === '.' && result.lineNumber &&
			split['-'] === '-' && result.raw !== '' &&
			split[' '] === ' '
		) {
			return result;
		} else {
			return null;
		}
	}

	/** @param locations = [FlightInfoParser::parseLocationLine()] */
	static locationsToLegs(locations) {
		let legs, i, location;

		legs = [];
		i = 0;
		for (location of Object.values(locations)) {
			const keys = php.array_keys(php.array_filter(location));
			if (php.equals(keys, ['meals'])) {
				// line with only meals - continuation of last line
				legs[i - 1].meals = php.array_merge(legs[i - 1].meals, location.meals);
			}
			if (location.destinationTime) {
				legs[i - 1].destinationTime = location.destinationTime;
				legs[i - 1].destinationAirport = location.departureAirport;
				legs[i - 1].destinationDayOfWeek = location.destinationDayOfWeek;
			}
			if (location.departureTime) {
				location.aircraft = location.aircraft || legs[i - 1].aircraft;
				legs[i++] = location;
			}
		}
		return legs;
	}

	static isDepartureOperation(msg) {
		return php.in_array(msg, [
			'LEFT THE GATE', 'TOOK OFF', 'ESTIMATED TIME OF DEPARTURE',
		]);
	}

	/**
	 * @param operations = [FlightInfoParser::parseOperationLine()]
	 * Amadeus visually groups them by airport, but we don't
	 * @return array - legs:
	 * times of 'departureOperations' are in time zone of 'departureAirport'
	 * times of 'destinationOperations' are in time zone of 'destinationAirport'
	 */
	static operationsToLegs(operations) {
		let legs, departureStarted, currentLeg, currentTz, currentDeparture, operation, startsDeparture, tz,
			transformed;

		legs = [];
		departureStarted = true;
		const initLeg = () => ({
			departureOperations: [],
			destinationOperations: [],
		});
		currentLeg = initLeg();
		currentTz = null;
		currentDeparture = null;
		for (operation of Object.values(operations)) {
			startsDeparture = this.isDepartureOperation(operation.message);
			if (!departureStarted && startsDeparture) {
				departureStarted = startsDeparture;
				legs.push(currentLeg);
				currentLeg = initLeg();
			}
			tz = operation.departureAirport || operation.destinationAirport || currentTz;
			if (currentTz !== tz) {
				departureStarted = startsDeparture;
				currentTz = tz;
			}
			transformed = {message: operation.message, time: operation.time};
			if (departureStarted) {
				currentLeg.departureAirport = currentTz;
				currentLeg.departureOperations.push(transformed);
			} else {
				currentLeg.destinationOperations.push(transformed);
			}
			currentLeg.destinationAirport = currentTz;
		}
		if (currentLeg) {
			legs.push(currentLeg);
		}
		return legs;
	}

	static parseAdditionalInfo(lines) {
		let comments = [];
		let configurations = [];
		let line;
		while (!php.is_null(line = lines.shift())) {
			if (line.trim() === 'COMMENTS-') {
				[comments, lines] = this.parseSequence(lines, l => this.parseCommentLine(l));
			} else if (php.trim(line) === 'CONFIGURATION-') {
				[configurations, lines] = this.parseSequence(lines, l => this.parseCommentLine(l));
			} else if (line.startsWith(' (*)') && comments.length > 0) {
				comments[comments.length - 1].raw += php.PHP_EOL + php.rtrim(line);
			} else if (line.trim() === '') {
				// continue
			} else {
				lines.unshift(line);
				break;
			}
		}

		for (let i = comments.length - 1; i > 0; --i) {
			const keys = Object.keys(php.array_filter(comments[i]));
			if (php.equals(keys, ['raw'])) {
				// unwrap wrapped comment
				comments[i - 1].raw += php.PHP_EOL + comments[i].raw;
				php.array_splice(comments, i, 1);
			}
		}

		return {
			comments: comments,
			configurations: configurations,
			linesLeft: lines,
		};
	}

	/**
	 * @param string[] lines - starts with line like:
	 * '*1A PLANNED FLIGHT INFO*              DL 201   72 SA 09SEP17    ',
	 */
	static parsePlannedSegment(lines) {
		let headerLine, headerData, locations, emptyLines, additionalInfo;

		headerLine = php.array_shift(lines);
		if (!(headerData = this.parsePlannedFlightLine(headerLine))) {
			return null;
		}

		php.array_shift(lines); // column headers
		[locations, lines] = this.parseSequence(lines, l => this.parseLocationLine(l));
		[emptyLines, lines] = this.parseSequence(lines, l => this.isEmptyLine(l));

		additionalInfo = this.parseAdditionalInfo(lines);

		const legs = this.locationsToLegs(locations);
		return {
			type: 'planned',
			airline: headerData.airline,
			flightNumber: headerData.flightNumber,
			dayOfWeek: headerData.dayOfWeek,
			unparsedToken1: headerData.unparsedToken1,
			departureDate: headerData.departureDate,
			legs: legs,
			travelDuration: locations.slice(-1)[0].travelDuration,
			comments: additionalInfo.comments,
			configurations: additionalInfo.configurations,
			linesLeft: additionalInfo.linesLeft,
		};
	}

	static parseOperationLine(line) {
		//               CITY INFO                                       HOUR (LOCAL)
		//              'AMS  LEFT THE GATE                              0705            ',
		//              '     ESTIMATED TIME OF ARRIVAL                  0907     FCO    ',
		//              '     03                                                         ',
		const pattern = 'PPP  MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM TTTTTT NNNNNNNNN';
		const split = ParserUtil.splitByPosition(line, pattern, null, true);
		const time = ParserUtil.decodeGdsTime(split['T']);
		const result = {
			departureAirport: split['P'],
			message: split['M'],
			time: !php.is_null(time) ? {
				raw: split['T'],
				parsed: time,
			} : null,
			destinationAirport: split['N'],
		};

		if (result.message && php.trim(split[' ']) === '') {
			const justMsg = (split['T'] + split['N']).trim() === '';
			if (result.time || justMsg) {
				return result;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	/**
	 * @param string[] lines - starts with line like:
	 * '* OPERATIONAL FLIGHT INFO *            DL9578    0 WE 20DEC17   ',
	 */
	static parseOperationalSegment(lines) {
		const headerLine = lines.shift();
		const headerData = this.parseOperationalFlightLine(headerLine);
		if (!headerData) { return null; }

		lines.shift(); // column headers
		let operations;
		[operations, lines] = this.parseSequence(lines, l => this.parseOperationLine(l));
		[, lines] = this.parseSequence(lines, l => this.isEmptyLine(l));

		return {
			type: 'operational',
			airline: headerData.airline,
			flightNumber: headerData.flightNumber,
			dayOfWeek: headerData.dayOfWeek,
			unparsedToken1: headerData.unparsedToken1,
			departureDate: headerData.departureDate,
			legs: this.operationsToLegs(operations),
			linesLeft: lines,
		};
	}

	// 'DL 2243 04JUL2017 FLIGHT NOT OPERATIONAL                        '
	static parseNotOperationalSegment(lines) {
		const regex =
			'/\\s*' +
			'(?<airline>[A-Z0-9]{2})\\s+' +
			'(?<flightNumber>\\d{1,4})\\s+' +
			'(?<departureDate>\\d{1,2}[A-Z]{3}\\d{2,4})\\s+' +
			'FLIGHT NOT OPERATIONAL/';

		const line = lines.shift();
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			[, lines] = this.parseSequence(lines, l => this.isEmptyLine(l));
			return {
				type: 'notOperational',
				airline: matches.airline,
				flightNumber: matches.flightNumber,
				departureDate: ParserUtil.parse2kDate(matches.departureDate),
				linesLeft: lines,
			};
		} else {
			return null;
		}
	}

	// 'ET 509 27JUN2017 REQUEST IS OUTSIDE SYSTEM DATE RANGE          '
	static parseFlownSegment(lines) {
		const regex =
			'/\\s*' +
			'(?<airline>[A-Z0-9]{2})\\s+' +
			'(?<flightNumber>\\d{1,4})\\s+' +
			'(?<departureDate>\\d{1,2}[A-Z]{3}\\d{2,4})\\s+' +
			'REQUEST IS OUTSIDE SYSTEM DATE RANGE/';
		let matches;
		if (php.preg_match(regex, lines.shift(), matches = [])) {
			[, lines] = this.parseSequence(lines, l => this.isEmptyLine(l));
			return {
				type: 'flown',
				airline: matches.airline,
				flightNumber: matches.flightNumber,
				departureDate: ParserUtil.parse2kDate(matches.departureDate),
				linesLeft: lines,
			};
		} else {
			return null;
		}
	}

	static parse(dump) {
		dump = php.rtrim(dump);
		let linesLeft = dump.split(/\r\n|\r|\n/);
		const commandCopy = php.rtrim(linesLeft.shift());
		if (!php.preg_match(/^(\/\$)?DO/, commandCopy)) {
			return {error: 'Invalid start of dump - ' + commandCopy};
		}
		const firstLine = linesLeft.shift();
		let isAlternateDateDisplay;
		if (firstLine.trim() === 'FLIGHT NOT OPERATING ON DATE SPECIFIED / SEE ALTERNATE DISPLAY') {
			isAlternateDateDisplay = true;
		} else {
			isAlternateDateDisplay = false;
			linesLeft.unshift(firstLine);
		}

		const segments = [];
		while (!php.empty(linesLeft)) {
			const segment = this.parsePlannedSegment([...linesLeft])
					|| this.parseOperationalSegment([...linesLeft])
					|| this.parseNotOperationalSegment([...linesLeft])
					|| this.parseFlownSegment([...linesLeft]);
			if (segment) {
				linesLeft = php.array_splice(segment.linesLeft, 0);
				segments.push(segment);
			} else {
				return {error: 'Failed to parse ' + php.count(segments) + '-th segment on line - ' + php.trim(linesLeft[0])};
			}
		}

		return {commandCopy, isAlternateDateDisplay, segments};
	}
}

module.exports = FlightInfoParser;
