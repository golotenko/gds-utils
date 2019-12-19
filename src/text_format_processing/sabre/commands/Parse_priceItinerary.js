const ParserUtil = require('../../agnostic/ParserUtil.js');

const php = require('enko-fundamentals/src/Transpiled/php.js');
const {mkReg} = require('enko-fundamentals/src/Utils/Misc.js');

/** @param expr = '1/3/5-7/9' */
const parseRanges = (expr) => {
	return ParserUtil.parseRange(expr, '/', '-');
};

// 'N1.1/1.2/2.1'
// 'N1.1-2.1'
// 'N1.1-2.1/4.1-5.1/6.0'
// 'N1¥N2'
const parseNameQualifier = (token) => {
	if (!token.startsWith('N')) {
		return null;
	}
	const content = token.slice(1);
	const records = content.split('/').map((ptcToken) => {
		let matches;
		if (php.preg_match(/^(\d+(?:\.\d+|))(-\d+(?:\.\d+|)|)$/, ptcToken, matches = [])) {
			let [, from, to] = matches;
			to = php.substr(to, 1);
			return {
				fieldNumber: php.explode('.', from)[0],
				firstNameNumber: (php.explode('.', from) || {})[1] || '0',
				through: to ? {
					fieldNumber: php.explode('.', to)[0],
					firstNameNumber: (php.explode('.', to) || {})[1] || '0',
				} : null,
			};
		} else {
			return null;
		}
	});
	if (records.some(r => !r)) {
		return null;
	} else {
		return records;
	}
};

/**
 * @param token = 'S1/2-3*Q//DA25*PC05' || 'S1/3'
 */
const parseSegmentQualifier = (token) => {
	const regex = mkReg([
		/^S(?<segNums>\d+[\d\/\-]*)/,
		/(\*Q(?<fareBasis>[A-Z][A-Z0-9]*)|)/,
		/(?<unparsed>\s*.+|)/,
	]);
	let match;
	if (match = token.match(regex)) {
		return {
			segmentNumbers: parseRanges(match.groups['segNums']),
			fareBasis: match.groups['fareBasis'],
			unparsed: match.groups['unparsed'],
		};
	} else {
		return null;
	}
};

/**
 * @param token = 'TX0.10TX/1.00XX' || 'TX0.10YY'
 */
const parseTaxQualifier = (token) => {
	if (!token.startsWith('TX')) {
		return null;
	}
	const taxes = token
		.slice('TX'.length)
		.split('/')
		.map(part => {
			const match = part.match(/^(\d*\.?\d+)([A-Z0-9]{2})$/);
			if (match) {
				const [, amount, taxCode] = match;
				return {amount, taxCode};
			} else {
				return null;
			}
		});
	if (taxes.every(t => t != null)) {
		return {taxes};
	} else {
		return null;
	}
};

// 'PADT', 'PINF'
// 'PADT/CMP' // companion
// 'PJCB/2JNF' // 1 JCB (adult) and 2 JNF (infants)
// 'P1ADT/2C11/1ADT'
const parsePtcQualifier = (token) => {
	if (!token.startsWith('P')) {
		return null;
	}
	const content = php.substr(token, 1);
	const records = content.split('/').map((ptcToken) => {
		let matches;
		if (php.preg_match(/^(\d*)([A-Z0-9]{3})$/, ptcToken, matches = [])) {
			let [, cnt, ptc] = matches;
			cnt = cnt !== '' ? php.intval(cnt) : null;
			return {quantity: cnt, ptc: ptc};
		} else {
			return null;
		}
	});
	if (records.some(r => !r)) {
		return null;
	} else {
		return records;
	}
};

const cabinClassMapping = {
	YB: 'economy',
	SB: 'premiumEconomy',
	BB: 'business',
	JB: 'premiumBusiness',
	FB: 'first',
	PB: 'premiumFirst',
};

/**
 * @see https://formatfinder.sabre.com/Content/Pricing/PricingOptionalQualifiers.aspx?ItemID=7481cca11a7449a19455dc598d5e3ac9
 */
const parsePricingQualifier = (raw) => {
	let matches;
	let [type, parsed] = [null, null];
	if (raw === 'RQ') {
		[type, parsed] = ['createPriceQuote', true];
	} else if (raw === 'ETR') {
		[type, parsed] = ['areElectronicTickets', true];
	} else if (raw === 'FXD') {
		[type, parsed] = ['forceProperEconomy', true];
	} else if (php.preg_match(/^MPC-(?<mpc>[A-Z0-9]+)$/, raw, matches = [])) {
		[type, parsed] = ['maxPenaltyForChange', {
			value: matches['mpc'],
		}];
	} else if (php.in_array(raw, ['PL', 'PV'])) {
		[type, parsed] = ['fareType', raw === 'PL' ? 'public' : 'private'];
	} else if (parsed = parseNameQualifier(raw)) {
		type = 'names';
	} else if (parsed = parsePtcQualifier(raw)) {
		type = 'ptc';
	} else if (parsed = parseSegmentQualifier(raw)) {
		type = 'segments';
	} else if (parsed = parseTaxQualifier(raw)) {
		type = 'overrideTaxes';
	} else if (php.preg_match(/^PU\*(\d*\.?\d+)(\/[A-Z0-9]+|)$/, raw, matches = [])) {
		[type, parsed] = ['markup', matches[1]];
	} else if (php.preg_match(/^K(P|)([A-Z]*)(\d*\.?\d+)$/, raw, matches = [])) {
		const [, percentMarker, region, amount] = matches;
		[type, parsed] = ['commission', {
			units: percentMarker ? 'percent' : 'amount',
			region: region || null,
			value: amount,
		}];
	} else if (php.preg_match(/^A([A-Z0-9]{2})$/, raw, matches = [])) {
		[type, parsed] = ['validatingCarrier', matches[1]];
	} else if (php.preg_match(/^C-([A-Z0-9]{2})$/, raw, matches = [])) {
		[type, parsed] = ['overrideCarrier', matches[1]];
	} else if (php.preg_match(/^M([A-Z]{3})$/, raw, matches = [])) {
		[type, parsed] = ['currency', matches[1]];
	} else if (php.preg_match(/^AC\*([A-Z0-9]+)$/, raw, matches = [])) {
		[type, parsed] = ['accountCode', matches[1]];
	} else if (php.preg_match(/^ST(\d+[\d\/\-]*)$/, raw, matches = [])) {
		[type, parsed] = ['sideTrip', parseRanges(matches[1])];
	} else if (php.preg_match(/^W(TKT)$/, raw, matches = [])) {
		[type, parsed] = ['exchange', matches[1]];
	} else if (php.preg_match(/^NC$/, raw, matches = [])) {
		[type, parsed] = ['lowestFare', true];
	} else if (php.preg_match(/^NCS$/, raw, matches = [])) {
		[type, parsed] = ['lowestFareIgnoringAvailability', true];
	} else if (php.preg_match(/^NCB$/, raw, matches = [])) {
		[type, parsed] = ['lowestFareAndRebook', true];
	} else if (php.preg_match(/^Q([A-Z][A-Z0-9]*)$/, raw, matches = [])) {
		[type, parsed] = ['fareBasis', matches[1]];
	} else if (php.preg_match(/^B(\d{1,2}[A-Z]{3}\d*)$/, raw, matches = [])) {
		[type, parsed] = ['ticketingDate', {raw: matches[1]}];
	} else if (php.preg_match(/^TC-([A-Z]{2})$/, raw, matches = [])) {
		const code = matches[1];
		const meaning = cabinClassMapping[code];
		[type, parsed] = ['cabinClass', {raw: code, parsed: meaning}];
	} else if (php.preg_match(/^OC-B([A-Z])$/, raw, matches = [])) {
		[type, parsed] = ['bookingClass', matches[1]];
	}
	return {raw, type, parsed};
};

const parsePricingQualifiers = (modsStr) => {
	const parsedQualifiers = [];
	const rawMods = modsStr ? modsStr.split('¥') : [];
	for (const rawMod of rawMods) {
		const mod = parsePricingQualifier(rawMod);
		parsedQualifiers.push(mod);
	}
	return parsedQualifiers;
};

const Parse_priceItinerary = (cmd) => {
	const command = cmd.slice(0, 2);
	if (command === 'WP') {
		const data = parsePricingQualifiers(cmd.slice(2));
		return {
			baseCmd: command,
			pricingModifiers: data,
		};
	} else {
		return null;
	}
};

Parse_priceItinerary.cabinClassMapping = cabinClassMapping;
Parse_priceItinerary.parseModifier = (mod) => parsePricingQualifier(mod);

module.exports = Parse_priceItinerary;
