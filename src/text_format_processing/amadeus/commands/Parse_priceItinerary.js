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

/** @param expr = '1-2,5-7' */
const parseRange = (expr) => {
	const parseRange = (text) => {
		const pair = php.explode('-', text);
		return php.range(pair[0], pair[1] || pair[0]);
	};
	return expr.trim().split(',').flatMap(parseRange);
};

const parseRSubModifier = (rSubMod) => {
	let type, parsed, matches;

	if (rSubMod === 'P') {
		type = 'fareType';
		parsed = 'public';
	} else if (rSubMod === 'U') {
		type = 'fareType';
		parsed = 'private';
	} else if (rSubMod === 'UP') {
		type = 'fareType';
		parsed = 'privateOrPublic';
	} else if (rSubMod === '*BD') {
		type = 'forceProperEconomy';
		parsed = true;
	} else if (parsed = parseDate(rSubMod)) {
		type = 'ticketingDate';
	} else if (matches = rSubMod.match(/^FC-([A-Z]{3})$/)) {
		type = 'currency';
		parsed = matches[1];
	} else if (php.preg_match(/^-([A-Z0-9]{3})$/, rSubMod, matches = [])) {
		// relevant only in tariff display I believe...
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

const getCabinClassMapping = () => {
	return {
		'M': 'economy',
		'W': 'premiumEconomy',
		'C': 'business',
		'F': 'first',
		'': 'sameAsBooked',
	};
};

const parsePricingModifier = (raw) => {
	let parsed, ownSeatTypes, matches, $_, override, fareBasis, type, content, rMods, ptcs;

	parsed = null;
	ownSeatTypes = {PAX: true, INF: false};
	if (php.preg_match(/^([AL]) *- *(\S+)$/, raw, matches = [])) {
		[$_, override, fareBasis] = matches;
		parsed = {fareBasis: fareBasis, override: override === 'L'};
		type = 'fareBasis';
	} else if (raw.startsWith('R')) {
		content = php.substr(raw, 1);
		// 'R,VC-SU,FC-USD'
		// 'RADT*IN,VC-SU,FC-USD'
		rMods = php.explode(',', content);
		ptcs = php.array_filter(php.explode('*', php.array_shift(rMods)));
		parsed = {
			ptcs: ptcs,
			rSubModifiers: php.array_map((...args) => parseRSubModifier(...args), rMods),
		};
		type = 'generic';
	} else if (php.preg_match(/^P(\d[-,\d]*)$/, raw, matches = [])) {
		parsed = parseRange(matches[1]);
		type = 'names';
	} else if (php.preg_match(/^S(\d[-,\d]*)$/, raw, matches = [])) {
		parsed = parseRange(matches[1]);
		type = 'segments';
	} else if (matches = raw.match(/^K([A-Z]?)$/)) {
		const letter = matches[1];
		const cabin = getCabinClassMapping()[letter] || null;
		parsed = {raw: letter, parsed: cabin};
		type = 'cabinClass';
	} else if (php.array_key_exists(raw, ownSeatTypes)) {
		parsed = ownSeatTypes[raw];
		type = 'ownSeat';
	} else {
		type = null;
	}

	return {
		raw: raw,
		type: type,
		parsed: parsed,
	};
};

/**
 * parses Pricing command like
 * >FXX/P1/PAX/RADT//P1/INF/RINF//P2/RC05;
 * cmd type 'priceItinerary'
 */
const Parse_priceItinerary = (cmd) => {
	let matches, $_, baseCmd, modsPart, pricingStores, rawModPack;

	if (php.preg_match(/^(FX[A-Z])(\/.+|)/, cmd, matches = [])) {
		[$_, baseCmd, modsPart] = matches;
		pricingStores = [];
		if (modsPart) {
			// you can price multiple pricing stores in single
			// command by separating them through "//"
			for (rawModPack of Object.values(php.explode('//', modsPart))) {
				pricingStores.push(php.array_map((...args) => parsePricingModifier(...args),
					php.array_values(php.array_filter(php.explode('/', rawModPack)))));}
		}
		return {
			baseCmd: baseCmd,
			pricingStores: pricingStores,
		};
	} else {
		return null;
	}
};

Parse_priceItinerary.getCabinClassMapping = getCabinClassMapping;

module.exports = Parse_priceItinerary;
