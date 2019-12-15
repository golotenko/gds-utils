const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');


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
	return ParserUtil.parseRange(expr, ',', '-');
};

const parseRSubModifier = (raw) => {
	let type, parsed, matches, extraData = undefined;

	const asFareType = raw.match(/^(U|P|UP)\*(.+)$/)
					|| raw.match(/^(U|P|UP)(\d*)$/);
	if (asFareType) {
		const [, letter, accountCode] = asFareType;
		type = 'fareType';
		parsed = {
			'P': 'public',
			'U': 'private',
			'UP': 'privateOrPublic',
		}[letter];
		if (accountCode) {
			extraData = {accountCode};
		}
	} else if (raw === '*BD') {
		type = 'forceProperEconomy';
		parsed = true;
	} else if (parsed = parseDate(raw)) {
		type = 'ticketingDate';
	} else if (matches = raw.match(/^FC-([A-Z]{3})$/)) {
		type = 'currency';
		parsed = matches[1];
	} else if (php.preg_match(/^-([A-Z0-9]{3})$/, raw, matches = [])) {
		// relevant only in tariff display I believe...
		type = 'ptc';
		parsed = matches[1];
	} else {
		type = null;
		parsed = null;
	}
	return {raw, type, parsed, extraData};
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
					php.array_values(php.array_filter(php.explode('/', rawModPack)))));
			}
		}
		return {
			baseCmd: baseCmd,
			pricingStores: pricingStores,
		};
	} else {
		return null;
	}
};

Parse_priceItinerary.parseRSubModifier = parseRSubModifier;
Parse_priceItinerary.getCabinClassMapping = getCabinClassMapping;

module.exports = Parse_priceItinerary;
