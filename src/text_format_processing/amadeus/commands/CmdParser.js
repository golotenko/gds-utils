const Parse_priceItinerary = require('./Parse_priceItinerary.js');
const Parse_fareSearch = require('./Parse_fareSearch.js');
const ParserUtil = require('../../agnostic/ParserUtil.js');
const SimpleTypes = require('./SimpleTypes.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

class CommandParser {
	static parseChangePcc(cmd) {
		let matches;

		if (php.preg_match(/^JU[IM]\/-([A-Z0-9]+)$/, cmd, matches = [])) {
			return matches[1];
		} else {
			return null;
		}
	}

	static parseChangeArea(cmd) {
		let matches;

		if (php.preg_match(/^JM([A-Z])$/, cmd, matches = [])) {
			return matches[1];
		} else {
			return null;
		}
	}

	static parseOpenPnr(cmd) {
		let matches;

		if (php.preg_match(/^RT\s*([A-Z0-9]{6})$/, cmd, matches = [])) {
			return matches[1];
		} else {
			return null;
		}
	}

	static parseSearchPnr(cmd) {
		let matches, searchTokens;

		if (php.preg_match(/^RT\s*(.*\S+.*)$/, cmd, matches = [])) {
			searchTokens = matches[1].split('-').map(t => t.trim());
			if (php.count(searchTokens) > 1 ||
				php.in_array(searchTokens[0], ['U', '*E']) ||
				php.preg_match(/\/\s*\S/, searchTokens[0])
			) {
				return {searchTokens: searchTokens};
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	static parseDisplayPnrFromList(cmd) {
		let matches;

		if (php.preg_match(/^RT\s*(\d+)$/, cmd, matches = [])) {
			return matches[1];
		} else {
			return null;
		}
	}

	/** @param expr = '1-2,5-7' */
	static parseRange(expr) {
		return ParserUtil.parseRange(expr, ',', '-');
	}

	// 'FFNPS-1005775190', 'FFNUA-123456778910,UA,LH/P1',
	// 'FFNQR-525433075/P1', 'FFNUA-12345678910,UA,LH'
	static parseAddFrequentFlyerNumber(cmd) {
		let regex, matches;

		regex =
			'/^FFN' +
			'(?<airline>[A-Z0-9]{2})-' +
			'(?<code>[A-Z0-9]+)' +
			'(?<partners>(,[A-Z0-9]{2})*)' +
			'(\\\/P(?<majorPaxNum>\\d+))?' +
			'$/';
		if (php.preg_match(regex, cmd, matches = [])) {
			return {
				airline: matches.airline,
				code: matches.code,
				partners: php.empty(matches.partners) ? [] :
					php.explode(',', php.ltrim(matches.partners, ',')),
				majorPaxNum: matches.majorPaxNum || '',
			};
		} else {
			return null;
		}
	}

	static parseDeletePnrField(cmd) {
		let matches, ranges, lineNumbers, range, bounds, from, to, num, pair;

		if (php.preg_match(/^XE(\d*\.?\d+[\d\.,-]*)$/, cmd, matches = [])) {
			ranges = php.explode(',', matches[1]);
			lineNumbers = [];
			for (range of Object.values(ranges)) {
				bounds = php.explode('-', range);
				from = bounds[0];
				to = bounds[1] || from;
				for (num of Object.values(php.range(from, to))) {
					pair = php.explode('.', num);
					lineNumbers.push({
						major: pair[0],
						minor: pair[1],
					});
				}
			}
			return {lineNumbers: lineNumbers};
		} else {
			return null;
		}
	}

	static parseChangePnrField(cmd) {
		let matches, $_, major, minor, content;

		if (php.preg_match(/^\s*(\d+)(\.\d+|)\/(.+)$/, cmd, matches = [])) {
			[$_, major, minor, content] = matches;
			return {
				majorNum: major,
				minorNum: php.ltrim(minor, '.'),
				content: content,
			};
		} else {
			return null;
		}
	}

	static parseRequestSeats(cmd) {
		let regex, matches, seatCodesStr, seatCodeGroups, seatCodes, group, seatMatches, $_, rowNumber, letters, letter,
			paxNums;

		regex =
			'/^ST' +
			'(\\\/(?<location>[AWB]))?' +
			'(?<seatCodes>(\\\/\\d+[A-Z]+)*)' +
			'(\\\/P(?<paxNums>\\d+[-,\\d]*))?' +
			'(\\\/S(?<segNums>\\d+[-,\\d]*))?' +
			'$/';
		if (php.preg_match(regex, cmd, matches = [])) {
			seatCodesStr = php.ltrim(matches.seatCodes || '', '/');
			seatCodeGroups = seatCodesStr ? php.explode('/', seatCodesStr) : [];
			seatCodes = [];
			for (group of Object.values(seatCodeGroups)) {
				php.preg_match_all(/(\d+)([A-Z]+)/, group, seatMatches = [], php.PREG_SET_ORDER);
				for ([$_, rowNumber, letters] of Object.values(seatMatches)) {
					for (letter of Object.values(php.str_split(letters, 1))) {
						seatCodes.push(rowNumber + letter);
					}
				}
			}

			paxNums = php.empty(matches.paxNums) ? [] :
				this.parseRange(matches.paxNums);
			return {
				paxRanges: paxNums.map((num) => ({
					from: num, fromMinor: null,
					to: num, toMinor: null,
				})),
				segNums: php.empty(matches.segNums) ? [] :
					this.parseRange(matches.segNums),
				location: php.empty(matches.location) ? null : {
					raw: matches.location,
					parsed: ({A: 'aisle', W: 'window', B: 'bulkhead'} || {})[matches.location],
				},
				zone: null,
				seatCodes: seatCodes,
			};
		} else {
			return null;
		}
	}

	static parseCancelSeats(cmd) {
		let regex, matches, paxNums;

		regex =
			'/^SX' +
			'(\\\/P(?<paxNums>\\d+[-,\\d]*))?' +
			'(\\\/S(?<segNums>\\d+[-,\\d]*))?' +
			'$/';
		if (php.preg_match(regex, cmd, matches = [])) {
			paxNums = php.empty(matches.paxNums) ? [] :
				this.parseRange(matches.paxNums);
			return {
				paxRanges: paxNums.map((num) => ({
					from: num, fromMinor: null,
					to: num, toMinor: null,
				})),
				segNums: php.empty(matches.segNums) ? [] :
					this.parseRange(matches.segNums),
				location: null,
				zone: null,
				seatCodes: [],
			};
		} else {
			return null;
		}
	}

	// 'FXX/P1/RYTH//P2/RMIL'
	static parsePriceItinerary(cmd) {
		return Parse_priceItinerary(cmd);
	}

	static parse_airAvailability(cmd) {
		const match = cmd.match(/^AD\/?(.*)/);
		if (match) {
			const rawMods = match[1] ? match[1].split('/') : [];
			return {
				modifiers: rawMods.map(raw => {
					let match, type = null, parsed = null;
					if (match = raw.match(/^(\d{1,2}[A-Z]{3})([A-Z]{3})([A-Z]{3})(\d{1,4}[APNM]|)$/)) {
						const [, date, from, to, time] = match;
						type = 'flightDetails';
						parsed = {
							departureDate: {
								raw: date,
								parsed: ParserUtil.parsePartialDate(date),
							},
							departureAirport: from,
							destinationAirport: to,
							departureTime: !time ? null : {raw: time},
						};
					}
					return {raw, type, parsed};
				}),
			};
		} else {
			return null;
		}
	}

	static parse_changeAirAvailability(cmd) {
		let match = cmd.match(/^AC(.+)/);
		if (!match) {
			return null;
		}
		const modsPart = match[1];
		const data = null;
		if (match = modsPart.match(/^(\d{1,2}[A-Z]{3}|)(\d{4}|)$/)) {
			const [, date, time] = match;
			return {
				departureDate: !date ? undefined : {raw: date},
				departureTime: !time ? undefined : {raw: time},
			};
		} else if (match = modsPart.match(/^R(\d{1,2}[A-Z]{3}|)(\d{4}|)$/)) {
			const [, date, time] = match;
			return {
				returnDate: !date ? undefined : {raw: date},
				returnTime: !time ? undefined : {raw: time},
			};
		} else {
			// some unsupported modifier
			return null;
		}
	}

	static detectCommandType(cmd) {
		cmd = cmd.trim();
		for (const [pattern, type] of Object.entries(SimpleTypes.exact)) {
			if (cmd === pattern) {
				return type;
			}
		}
		const startTuples = Object.entries(SimpleTypes.start)
			// put longest start patterns first
			.sort((a,b) => b[0].length - a[0].length);
		for (const [pattern, type] of startTuples) {
			if (cmd.startsWith(pattern)) {
				return type;
			}
		}
		for (const [pattern, name] of SimpleTypes.regex) {
			if (php.preg_match(pattern, cmd)) {
				return name;
			}
		}

		return null;
	}

	static parseSingleCommand(cmd) {
		let data, type;

		cmd = php.trim(php.strtoupper(cmd));

		if (data = this.parseChangePcc(cmd)) {
			type = 'changePcc';
		} else if (data = this.parseChangeArea(cmd)) {
			type = 'changeArea';
		} else if (data = this.parseOpenPnr(cmd)) {
			type = 'openPnr';
		} else if (data = this.parseSearchPnr(cmd)) {
			type = 'searchPnr';
		} else if (!php.is_null(data = this.parseDisplayPnrFromList(cmd))) {
			type = 'displayPnrFromList';
		} else if (!php.is_null(data = this.parseRequestSeats(cmd))) {
			type = 'requestSeats';
		} else if (!php.is_null(data = this.parseCancelSeats(cmd))) {
			type = 'cancelSeats';
		} else if (!php.is_null(data = this.parseAddFrequentFlyerNumber(cmd))) {
			type = 'addFrequentFlyerNumber';
		} else if (!php.is_null(data = this.parseDeletePnrField(cmd))) {
			type = 'deletePnrField';
		} else if (!php.is_null(data = this.parseChangePnrField(cmd))) {
			type = 'changePnrField';
		} else if (!php.is_null(data = Parse_fareSearch(cmd))) {
			type = 'fareSearch';
		} else if (!php.is_null(data = this.parse_airAvailability(cmd))) {
			type = 'airAvailability';
		} else if (!php.is_null(data = this.parse_changeAirAvailability(cmd))) {
			type = 'changeAirAvailability';
		} else if (php.preg_match(/^\s*FXD(.*)$/, cmd)) {
			type = 'lowFareSearch';
		} else if (php.preg_match(/^\s*FXS(.*)$/, cmd)) {
			type = 'lowFareSearchNavigation';
		} else if (php.preg_match(/^\s*FXZ(.*)$/, cmd)) {
			type = 'sellFromLowFareSearch';
		} else if (php.preg_match(/^\s*FXK(.*)$/, cmd)) {
			type = 'ancillaryServiceList';
		} else if (data = this.parsePriceItinerary(cmd)) {
			// Amadeus's pricing command starts with FX, but since there are a lot of
			// other Amadeus commands that start with FX, like FXD, we should
			// match command as "priceItinerary" only if none of the other matched
			type = 'priceItinerary';
		} else if (type = this.detectCommandType(cmd)) {
			data = null;
		} else {
			type = null;
		}

		return {
			type: type,
			data: data,
			cmd: cmd,
		};
	}

	static parse(cmd) {
		const flatCmds = cmd.split(';')
			.map(c => this.parseSingleCommand(c));
		const result = flatCmds.shift();
		result.followingCommands = flatCmds;
		return result;
	}
}

module.exports = CommandParser;
