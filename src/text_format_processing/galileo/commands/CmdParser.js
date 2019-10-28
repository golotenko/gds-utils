const Parse_fareSearch = require('./Parse_fareSearch.js');
const Parse_priceItinerary = require('./Parse_priceItinerary.js');
const ParserUtil = require('../../agnostic/ParserUtil.js');
const SimpleTypes = require('./SimpleTypes.js');
const Lexeme = require('../../../lexer/Lexeme.js');
const Lexer = require('../../../lexer/Lexer.js');

const php = require('enko-fundamentals/src/Transpiled/php.js');

// 'UA12345876490/BD/LH/AC', 'AA423188DLM', 'UA/TG/SK'
const parseMmAir = (airPart) => {
	let matches;
	if (php.preg_match(/^([A-Z0-9]{2})([A-Z0-9]*)((\/[A-Z0-9]{2})+|)$/, airPart, matches = [])) {
		const [, air, code, partnerPart] = matches;
		return {
			airline: air,
			code: code,
			partners: !partnerPart ? [] :
				php.explode('/', php.ltrim(partnerPart, '/')),
		};
	} else {
		return null;
	}
};

// 'M.P2/TW123456LRG-AA423188DLM', 'M.P1/UA12345876490/BD/LH/AC', 'M.P2*UA/TG/SK'
const parseAddFrequentFlyerNumber = (cmd) => {
	const regex =
		'/^M\\.' +
		'(P(?<majorPaxNum>\\d+)(?<crossAccrual>[\\\/\\*]))?' +
		'(?<airPart>.*)' +
		'$/';
	let matches;
	if (php.preg_match(regex, cmd, matches = [])) {
		const airParts = matches.airPart.split('-');
		const mmAirs = airParts.map(t => parseMmAir(t));
		if (mmAirs.some(rec => rec === null)) {
			return null;
		} else {
			return {
				majorPaxNum: matches.majorPaxNum || '',
				isCrossAccrual: (matches.crossAccrual || '') === '*',
				mileagePrograms: mmAirs,
			};
		}
	} else {
		return null;
	}
};

// 'P2*AA', 'P2', 'AA', 'P1*KL/UK/NW'
const parseMmChangePax = (paxPart) => {
	const regex =
		'/^' +
		'(P(?<majorPaxNum>\\d+)\\*?)?' +
		'(' +
		'(?<airline>[A-Z0-9]{2})' +
		'(?<partners>(\\\/[A-Z0-9]{2})+|\\\/ALL|)' +
		')?' +
		'$/';
	let matches;
	if (php.preg_match(regex, paxPart, matches = [])) {
		const partnersPart = matches.partners || '';
		return {
			majorPaxNum: matches.majorPaxNum || '',
			airline: matches.airline || '',
			withAllPartners: partnersPart === '/ALL',
			partners: php.in_array(partnersPart, ['', '/ALL']) ? [] :
				php.explode('/', php.ltrim(matches.partners, '/')),
		};
	} else {
		return null;
	}
};

// 'M.@', 'M.P2@', 'M.AA@', 'M.P1*DL@', 'M.P1*DL/P2*AA@', 'M.P1*KL/UK/NW@', 'M.P2*UA/ALL@'
const parseChangeFrequentFlyerNumber = (cmd) => {
	let matches;
	if (php.preg_match(/^M\.(.*)@$/, cmd, matches = [])) {
		const paxPart = matches[1];
		const paxParts = !paxPart ? [] : paxPart.split(/\/(?=P\d+\*)/);
		const paxes = paxParts.map(t => parseMmChangePax(t));
		if (paxes.some(p => p === null)) {
			return null;
		} else {
			return {passengers: paxes};
		}
	} else {
		return null;
	}
};

class CommandParser {
	static detectCommandType(cmd) {
		cmd = php.strtoupper(cmd);
		cmd = php.trim(cmd);

		for (const [pattern, type] of Object.entries(SimpleTypes.exact)) {
			if (cmd === pattern) {
				return type;
			}
		}

		for (const [pattern, name] of SimpleTypes.regex) {
			if (php.preg_match(pattern, cmd)) {
				return name;
			}
		}

		const starts = Object.keys(SimpleTypes.start)
			.sort((a,b) => b.length - a.length); // longest matched first

		for (const pattern of Object.values(starts)) {
			const type = SimpleTypes.start[pattern];
			if (cmd.startsWith(pattern)) {
				return type;
			}
		}

		return null;
	}

	// 'SEM/69KS/AG'
	static parseSem(cmd) {
		let matches;
		if (php.preg_match(/^SEM\/([A-Z0-9]{3,4})\/(\S.*?)\s*$/, cmd, matches = [])) {
			return {pcc: matches[1], dutyCode: matches[2]};
		} else {
			return null;
		}
	}

	// 'SC', 'SA'
	static parseChangeArea(cmd) {
		let matches;
		if (php.preg_match(/^S([A-Z])(\/.*)?$/, cmd, matches = [])) {
			return {area: matches[1]};
		} else {
			return null;
		}
	}

	static parseOpenPnr(cmd) {
		let matches;
		if (php.preg_match(/^\*([A-Z0-9]{6})$/, cmd, matches = [])) {
			return {recordLocator: matches[1]};
		} else {
			return null;
		}
	}

	static parseAirAvailability(cmd) {
		const regex =
			'/^A' +
			'(?<preFlags>[A-Z]{0,2})' +
			'(' +
			'(?<departureDate>\\d{1,2}[A-Z]{3}\\d{0,2})' +
			'(?<postFlags>[A-Z]{0,2})' +
			')?' +
			'(' +
			'(?<departureAirport>[A-Z]{3})?' +
			'(?<destinationAirport>[A-Z]{3})' +
			')?' +
			'(?<modsPart>[^A-Z0-9].*|)' +
			'$/';
		const getFirst = (matches) => ({raw: matches[0], parsed: matches[1]});
		const onlyRaw = (matches) => ({raw: matches[0], parsed: null});
		const lexer = new Lexer([
			(new Lexeme('connection', /^\.?\d{1,4}[APNM]?(\.[A-Z]{3}-?)?(\.[A-Z]{3}-?)?/)).preprocessData(onlyRaw),
			(new Lexeme('airlines', /^(\/[A-Z0-9]{2}[-\#]?)+/)).preprocessData(onlyRaw),
			(new Lexeme('numberOfStops', /^\.D(\d)/)).preprocessData(getFirst),
			(new Lexeme('directLink', /^\*([A-Z0-9]{2})/)).preprocessData(getFirst),
			(new Lexeme('bookingClass', /^@(\d*)([A-Z])/)).preprocessData((matches) => ({
				raw: matches[0], parsed: {
					seatCount: matches[1],
					bookingClass: matches[2],
				},
			})),
			(new Lexeme('allianceCode', /^\/\/\*([A-Z])/)).preprocessData(getFirst),
		]);
		let matches;
		if (php.preg_match(regex, cmd, matches = [])) {
			const flags = php.str_split(matches.preFlags + (matches.postFlags || '')).filter(a => a);
			const lexed = lexer.lex(matches.modsPart);
			return {
				isReturn: flags.includes('R'),
				orderBy: flags.filter((flag) => flag !== 'R').slice(-1)[0],
				departureDate: php.empty(matches.departureDate) ? null : {
					raw: matches.departureDate,
					parsed: ParserUtil.parsePartialDate(matches.departureDate),
				},
				departureAirport: matches.departureAirport || '',
				destinationAirport: matches.destinationAirport || '',
				modifiers: lexed.lexemes.map((rec) => ({
					type: rec.lexeme, raw: rec.data.raw, parsed: rec.data.parsed,
				})),
				unparsed: lexed.text,
			};
		} else {
			return null;
		}
	}

	static parsePriceItinerary(cmd) {
		return Parse_priceItinerary(cmd);
	}

	/** @param expr = '3' || '9-12' || '9.12' || '1-3.6-8.12'; */
	static parseRemarkRanges(expr) {
		const parseRange = (text) => {
			const pair = text.split('-');
			return {from: pair[0], to: pair[1] || pair[0]};
		};
		return php.trim(expr).split('.').map(parseRange);
	}

	static flattenRange(expr) {
		if (!expr) {
			return [];
		}
		const parseRange = (text) => {
			const pair = text.split('-');
			return php.range(pair[0], pair[1] || pair[0]);
		};
		return php.trim(expr).split('.').flatMap(parseRange);
	}

	static parseChangePnrRemarks(cmd) {
		let matches;
		if (php.preg_match(/^NP\.(\d+[\d-.]*|)@(.*)$/, cmd, matches = [])) {
			const [, rangesRaw, newText] = matches;
			return {
				ranges: this.parseRemarkRanges(rangesRaw),
				newText: newText,
			};
		} else {
			return null;
		}
	}

	// 'S.S2/17A/18C', 'S.P2S1@', 'S.P1-4S2@', 'S.P1S2/NW', 'S.S1.2/NA'
	static parseSeatChange(cmd) {
		const regex =
			'/^S\\.' +
			'(P(?<paxNums>\\d+[-.\\d]*))?' +
			'(S(?<segNums>\\d+[-.\\d]*))?' +
			'(\\\/?N(?<location>[AWB]))?' +
			'(?<seatCodes>(\\\/\\d+[A-Z](\\.[A-Z])*)*)' +
			'(?<changeMark>@|)' +
			'$/';
		let matches;
		if (php.preg_match(regex, cmd, matches = [])) {
			const seatCodesStr = php.ltrim(matches.seatCodes || '', '/');
			const seatCodeGroups = seatCodesStr ? php.explode('/', seatCodesStr) : [];
			const seatCodes = [];
			for (const group of Object.values(seatCodeGroups)) {
				let seatMatches;
				php.preg_match_all(/(\d+)([A-Z](\.[A-Z])*)/, group, seatMatches = [], php.PREG_SET_ORDER);
				for (const [, rowNumber, letters] of Object.values(seatMatches)) {
					for (const letter of Object.values(php.explode('.', letters))) {
						seatCodes.push(rowNumber + letter);
					}
				}
			}
			const paxNums = this.flattenRange(matches.paxNums || '');
			const segNums = this.flattenRange(matches.segNums || '');
			return {
				type: matches.changeMark === '@'
					? 'cancelSeats' : 'requestSeats',
				data: {
					paxRanges: paxNums.map((num) => ({
						from: num, fromMinor: null,
						to: num, toMinor: null,
					})),
					segNums: segNums,
					location: php.empty(matches.location) ? null : {
						raw: matches.location,
						parsed: ({A: 'aisle', W: 'window', B: 'bulkhead'} || {})[matches.location],
					},
					zone: null,
					seatCodes: seatCodes,
				},
			};
		} else {
			return null;
		}
	}

	static parseSingleCommand(cmd) {
		let data, type, parsed;

		if (data = this.parseSem(cmd)) {
			type = 'changePcc';
		} else if (data = this.parseChangeArea(cmd)) {
			type = 'changeArea';
		} else if (data = this.parseOpenPnr(cmd)) {
			type = 'openPnr';
		} else if (data = this.parseAirAvailability(cmd)) {
			type = 'airAvailability';
		} else if (data = Parse_fareSearch(cmd)) {
			type = 'fareSearch';
		} else if (data = this.parseChangePnrRemarks(cmd)) {
			type = 'changePnrRemarks';
		} else if (data = parseAddFrequentFlyerNumber(cmd)) {
			type = 'addFrequentFlyerNumber';
		} else if (data = parseChangeFrequentFlyerNumber(cmd)) {
			type = 'changeFrequentFlyerNumber';
		} else if (parsed = this.parseSeatChange(cmd)) {
			type = parsed.type;
			data = parsed.data;
		} else if (type = this.detectCommandType(cmd)) {
			data = null;
		} else if (data = this.parsePriceItinerary(cmd)) {
			// must be at the very bottom, since there are many
			// commands in Galileo that start with FQ: FQP, FQN, FQL...
			type = 'priceItinerary';
		} else {
			data = null;
			type = null;
		}
		return {cmd, type, data};
	}

	static parse(cmd) {
		// 'T.TAU/19APR|R.KINGSLEY|ER' -> ['T.TAU/19APR', 'R.KINGSLEY', 'ER']
		// 'FQBB||-AB' -> ['FQBB||-AB']
		const subCmds = cmd.split(/(?<!\|)\|(?!\|)/g);
		const flatCmds = subCmds.map(subCmd => this.parseSingleCommand(subCmd));
		const parsed = flatCmds.shift();
		parsed.followingCommands = flatCmds;
		return parsed;
	}
}

module.exports = CommandParser;
