const ParserUtil = require('../../agnostic/ParserUtil.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');

const parseDate = (raw) => {
	const partial = ParserUtil.parsePartialDate(raw);
	const full = ParserUtil.parse2kDate(raw).parsed;
	if (partial || full) {
		return {raw: raw, partial: partial, full: full};
	} else {
		return null;
	}
};

const parseTravelDatesMod = (rawMod) => {
	const dates = rawMod.split('*').map(t => parseDate(t));
	if (php.count(dates) > 2 || dates.some(d => !d)) {
		return null;
	} else {
		return {
			departureDate: dates[0],
			returnDate: dates[1],
		};
	}
};

const parseRSubModifier = (rSubMod) => {
	let type, parsed, matches;

	if (rSubMod === 'P') {
		type = 'fareType';
		parsed = 'public';
	} else if (rSubMod === 'U') {
		type = 'fareType';
		parsed = 'private';
	} else if (parsed = parseDate(rSubMod)) {
		type = 'ticketingDate';
	} else if (php.preg_match(/^-([A-Z0-9]{3})$/, rSubMod, matches = [])) {
		type = 'ptc';
		parsed = matches[1];
	} else {
		type = null;
		parsed = null;
	}
	return {
		raw: rSubMod, type: type, parsed: parsed,
	};
};

const parseMods = (rawMod) => {
	let parsed, type, matches, rMods;

	if (parsed = parseTravelDatesMod(rawMod)) {
		type = 'travelDates';
	} else if (php.preg_match(/^R,(.+)$/, rawMod, matches = [])) {
		type = 'generic';
		rMods = php.array_map(s => parseRSubModifier(s),
			php.explode(',', matches[1]));
		parsed = {rSubModifiers: rMods};
	} else if (php.preg_match(/^A([A-Z0-9]{2}(,[A-Z0-9]{2})*)$/, rawMod, matches = [])) {
		type = 'airlines';
		parsed = php.explode(',', matches[1]);
	} else if (php.preg_match(/^I([OR])$/, rawMod, matches = [])) {
		type = 'tripType';
		parsed = {O: 'OW', R: 'RT'}[matches[1]];
	} else if (php.preg_match(/^C([A-Z])$/, rawMod, matches = [])) {
		type = 'bookingClass';
		parsed = matches[1];
	} else if (php.preg_match(/^K(W|F|C|M)$/, rawMod, matches = [])) {
		type = 'cabinClass';
		parsed = ({
			W: 'premium_economy',
			F: 'first',
			C: 'business',
			M: 'economy',
		} || {})[matches[1]];
	} else {
		type = null;
		parsed = null;
	}
	return {raw: rawMod, type: type, parsed: parsed};
};

/**
 * parses Tariff Display command like
 * >FQDMCOSCL/15JUL18/R,06JUL18,P/ALA/IR/CL;
 * cmd type 'fareSearch'
 */
const Parse_fareSearch = (cmd) => {
	let rawMods, mainPart, matches, $_, departureAirport, destinationAirport;

	rawMods = php.explode('/', cmd);
	mainPart = php.array_shift(rawMods);
	if (php.preg_match(/^FQD([A-Z]{3})([A-Z]{3})$/, mainPart, matches = [])) {
		[$_, departureAirport, destinationAirport] = matches;
	} else {
		return null;
	}
	return {
		departureAirport: departureAirport,
		destinationAirport: destinationAirport,
		modifiers: php.array_map(m => parseMods(m), rawMods),
	};
};

module.exports = Parse_fareSearch;
