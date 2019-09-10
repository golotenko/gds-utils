const ParserUtil = require('../../agnostic/ParserUtil.js');
const {mkReg} = require('enko-fundamentals/src/Utils/Misc.js');

const regex_airAvailability = mkReg([
	/^A/,
	/(?:\/(?<sameCabin>\*)?(?<bookingClass>[A-Z])(?<seatCount>\d+)?\/)?/,
	/(?<departureDate>\d{1,2}[A-Z]{3})/,
	/(?<departureAirport>[A-Z]{3})/,
	/(?<destinationAirport>[A-Z]{3})/,
	/(?<unparsed>.*)/,
]);

const Parse_airAvailability = (cmd) => {
	const match = cmd.match(regex_airAvailability);
	if (match) {
		const groups = match.groups;
		return {
			similarClass: groups.sameCabin === '*',
			bookingClass: groups.bookingClass,
			seatCount: groups.seatCount,
			departureDate: {
				raw: groups.departureDate,
				parsed: ParserUtil.parsePartialDate(groups.departureDate),
			},
			departureAirport: groups.departureAirport,
			destinationAirport: groups.destinationAirport,
			unparsed: groups.unparsed,
		};
	} else {
		return null;
	}
};

/**
 * putting it here to not trash namespace too much, parses 'A*'
 * command, which officially is of type 'moreAirAvailability'
 */
Parse_airAvailability.more = (cmd) => {
	let match;
	if (!cmd.startsWith('A*')) {
		return null;
	}
	let modsPart = cmd.slice('A*'.length);
	if (modsPart === '') {
		return {action: 'nextPage'};
	} else if (match = modsPart.match(/^C(\d+)$/)) {
		return {action: 'showAllClasses', lineNumber: match[1]};
	} else {
		const data = {action: 'changeInput'};
		if (match = modsPart.match(/^(.*?)\|((?:[A-Z]{2}|[A-Z][0-9]|[0-9][A-Z])(?:\.[A-Z0-9]{2})*)$/)) {
			modsPart = match[1];
			data.airlines = match[2].split('.');
		}
		if (modsPart === 'J') {
			data.displayType = 'J';
		} else if (match = modsPart.match(/^(\d{1,2}[A-Z]{3}|)(\d{1,2}[APMN]|)$/)) {
			const [, date, time] = match;
			data.departureDate = !date ? undefined : {raw: date};
			data.departureTime = !time ? undefined : {raw: time};
		} else if (match = modsPart.match(/^O(\d{1,2}[A-Z]{3}|)(\d{1,2}[APMN]|)$/)) {
			const [, date, time] = match;
			data.returnDate = !date ? undefined : {raw: date};
			data.returnTime = !time ? undefined : {raw: time};
		} else if (match = modsPart.match(/^B([A-Z]{3})$/)) {
			data.departureAirport = match[1];
		} else if (match = modsPart.match(/^D([A-Z]{3})$/)) {
			data.destinationAirport = match[1];
		} else if (match = modsPart.match(/^X((?:[A-Z]{3})+)$/)) {
			data.connection = {raw: match[1]};
		} else if (match = modsPart.match(/^\|(-?\d+)$/)) {
			data.dayOffset = +match[1];
		} else if (modsPart !== '') {
			// unsupported modifier
			return null;
		}
		return data;
	}
};

module.exports = Parse_airAvailability;