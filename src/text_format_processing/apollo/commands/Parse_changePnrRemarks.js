
const php = require("enko-fundamentals/src/Transpiled/php.js");
const {mkReg} = require('enko-fundamentals/src/Utils/Misc.js');

/** @param expr = '2-4*7*9-13' || '' || '2-*'; */
const parseRemarkRanges = (expr) => {
	let rangeType, matches;
	const ranges = [];
	if (!expr) {
		rangeType = 'notSpecified';
		ranges.push({from: 1, to: 1});
	} else if (php.preg_match(/^(\d+)-\*$/, expr, matches = [])) {
		rangeType = 'everythingAfter';
		ranges.push({from: matches[1]});
	} else {
		rangeType = 'explicitEnds';
		for (const rawRange of php.explode('*', php.trim(expr))) {
			const pair = php.explode('-', rawRange);
			ranges.push({from: pair[0], to: pair[1] || pair[0]});
		}
	}
	return {rangeType, ranges};
};

const regex_changePnrRemarks = mkReg([
	'^',
	'(?<cmd>',
	/C:/,
	/(?<ranges>[0-9\-*]*)@:5/,
	/(?<newText>[^|]*)/,
	')',
	/(\|(?<textLeft>.*)|$)/,
]);

const Parse_changePnrRemarks = ($cmd) => {
	const match = $cmd.match(regex_changePnrRemarks);
	if (match) {
		const groups = match.groups;
		const rangesData = parseRemarkRanges(groups.ranges);
		return {
			cmd: groups['cmd'],
			type: 'changePnrRemarks',
			data: {
				rangeType: rangesData.rangeType,
				ranges: rangesData.ranges,
				newText: groups.newText,
			},
			textLeft: groups.textLeft || '',
		};
	} else {
		return null;
	}
};

module.exports = Parse_changePnrRemarks;