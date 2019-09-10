const ParserUtil = require('../../agnostic/ParserUtil.js');

const php = require("enko-fundamentals/src/Transpiled/php.js");
const {mkReg} = require('enko-fundamentals/src/Utils/Misc.js');

const parsePaxRanges = (expr) => {
	return expr.split('|').map((num) => {
		const lNum = num.split('-')[0];
		const fNum = num.split('-')[1] || null;
		return {
			from: lNum, fromMinor: fNum,
			to: lNum, toMinor: fNum,
		};
	});
};

const regex_seatChange = mkReg([
	'^',
	/(?<baseCmd>9S|9X)/,
	/(\/N(?<paxNums>\d+[-|\d]*))?/,
	/(\/S(?<segNums>\d+[*|\d]*))?/,
	/(\/(?<aisleMark>A))?/,
	/(\/(?<seatCodes>(\d+[A-Z]+)+))?/,
	'$',
]);

// '9S/S2/17A18C', '9S/N1/S2/A', '9S/S2/17AB'
const Parse_changeSeats = (cmd) => {
	const match = cmd.match(regex_seatChange);
	if (match) {
		const groups = match.groups;
		const seatCodesStr = groups.seatCodes || '';
		let seatMatches;
		php.preg_match_all(/(\d+)([A-Z]+)/, seatCodesStr, seatMatches = [], php.PREG_SET_ORDER);
		const seatCodes = [];
		for (const [, $rowNumber, $letters] of seatMatches) {
			for (const letter of php.str_split($letters, 1)) {
				seatCodes.push($rowNumber + letter);
			}
		}
		return {
			type: {
				'9S': 'requestSeats',
				'9X': 'cancelSeats',
			}[groups['baseCmd']] || null,
			data: {
				paxRanges: php.empty(groups.paxNums) ? [] :
					parsePaxRanges(groups.paxNums),
				segNums: php.empty(groups.segNums) ? [] :
					ParserUtil.parseRange(groups.segNums, '|', '*'),
				location: php.empty(groups.aisleMark) ? null :
					{raw: groups.aisleMark, parsed: 'aisle'},
				zone: null,
				seatCodes: seatCodes,
			},
		};
	} else {
		return null;
	}
};

module.exports = Parse_changeSeats;