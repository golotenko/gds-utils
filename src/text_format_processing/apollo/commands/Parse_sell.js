
const {mkReg} = require('enko-fundamentals/src/Utils/Misc.js');
const php = require("enko-fundamentals/src/Transpiled/php.js");

const regex_availability_seg = /([A-Z])(\d{1,2})/;

const regex_availability = mkReg([
	'^0',
	/(?<seatCount>\d+)/,
	'(?<segments>(', regex_availability_seg, ')+)',
	/(?<includeConnections>\*?)/,
	/(?<segmentStatus>[A-Z]{2}|)/,
	'$',
]);

// '01Y1Y2', '02S3*BK', '01Y11Y22'
const parse_availability = (cmd) => {
	const match = cmd.match(regex_availability);
	if (match) {
		const groups = match.groups;
		const segments = [];
		let tuples;
		php.preg_match_all(regex_availability_seg, groups.segments, tuples = [], php.PREG_SET_ORDER);
		for (const [, bookingClass, lineNumber] of tuples) {
			segments.push({bookingClass, lineNumber});
		}
		return {
			sellType: 'availability',
			seatCount: groups.seatCount,
			segments: segments,
			includeConnections: groups.includeConnections === '*',
			segmentStatus: groups.segmentStatus,
		};
	} else {
		return null;
	}
};

// '0XXOPENYSLCCVGNO1'
const parse_openSegment = ($cmd) => {
	const regex = /^0XXOPEN(?<unparsed>.*?)\s*$/;
	const match = $cmd.match(regex);
	if (match) {
		return {
			sellType: 'openSegment',
			unparsed: match.groups.unparsed,
		};
	} else {
		return null;
	}
};

const regex_directSell = mkReg([
	'^0',
	/(?<airline>[A-Z0-9]{2})/,
	/(?<flightNumber>\d{1,4})/,
	/(?<bookingClass>[A-Z])/,
	/(?<departureDate>\d{1,2}[A-Z]{3})/,
	/(?<departureAirport>[A-Z]{3})/,
	/(?<destinationAirport>[A-Z]{3})/,
	/(?<segmentStatus>[A-Z]{2})/,
	/(?<seatCount>\d{0,2})/,
	/(?<unparsed>.*?)/,
	'\s*$',
]);

// '0SK93F8NOVLAXCPHNN2'
const parse_directSell = (cmd) => {
	const match = cmd.match(regex_directSell);
	if (match) {
		const groups = match.groups;
		return {
			sellType: 'directSell',
			airline: groups.airline,
			flightNumber: groups.flightNumber,
			bookingClass: groups.bookingClass,
			departureDate: {raw: groups.departureDate},
			departureAirport: groups.departureAirport,
			destinationAirport: groups.destinationAirport,
			segmentStatus: groups.segmentStatus,
			seatCount: php.intval(groups.seatCount),
			unparsed: groups.unparsed,
		};
	} else {
		return null;
	}
};

// '1M|2B', '01YN|2Y|3Q'
const parse_rebookSelective = (textLeft) => {
	const segments = [];
	for (const rawSeg of textLeft.split('|')) {
		let matches;
		if (php.preg_match(/^(\d{1,2})([A-Z]{1,2})$/, rawSeg, matches = [])) {
			const [, segmentNumber, clsStr] = matches;
			segments.push({segmentNumber, bookingClasses: clsStr.split('')});
		} else {
			return null;
		}
	}
	return {
		sellType: 'rebookSelective',
		segments: segments,
	};
};

// '25AUG/Q', 'B', '25FEB', 'YN'
const parse_rebookAll = (textLeft) => {
	const values = textLeft.split('/');
	let departureDate = null;
	let bookingClasses = [];
	for (const value of values) {
		let matches;
		if (php.preg_match(/^(\d{1,2}[A-Z]{3})$/, value, matches = [])) {
			departureDate = {raw: matches[1]};
		} else if (php.preg_match(/^([A-Z]{0,2})$/, value, matches = [])) {
			bookingClasses = value.split('');
		} else {
			return null;
		}
	}
	return {
		sellType: 'rebookAll',
		departureDate,
		bookingClasses,
	};
};

const Parse_sell = (cmd) => {
	if (cmd.startsWith('0') || cmd.startsWith('N')) {
		const textLeft = php.substr(cmd, 1);
		return parse_availability(cmd)
			|| parse_rebookSelective(textLeft)
			|| parse_rebookAll(textLeft)
			|| parse_directSell(cmd)
			|| parse_openSegment(cmd)
			|| {sellType: null, raw: cmd};
	} else if (php.trim(cmd) === 'Y') {
		return {
			sellType: 'arrivalUnknown',
			segments: [
				{type: 'ARNK'},
			],
		};
	} else {
		return null;
	}
};

module.exports = Parse_sell;
