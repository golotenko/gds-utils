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
const parsePricingQualifier = (token) => {
	let matches;
	let [name, data] = [null, null];
	if (token === 'RQ') {
		[name, data] = ['createPriceQuote', true];
	} else if (token === 'ETR') {
		[name, data] = ['areElectronicTickets', true];
	} else if (token === 'FXD') {
		[name, data] = ['forceProperEconomy', true];
	} else if (php.preg_match(/^MPC-(?<mpc>[A-Z0-9]+)$/, token, matches = [])) {
		[name, data] = ['maxPenaltyForChange', {
			value: matches['mpc'],
		}];
	} else if (php.in_array(token, ['PL', 'PV'])) {
		[name, data] = ['fareType', token === 'PL' ? 'public' : 'private'];
	} else if (data = parseNameQualifier(token)) {
		name = 'names';
	} else if (data = parsePtcQualifier(token)) {
		name = 'ptc';
	} else if (data = parseSegmentQualifier(token)) {
		name = 'segments';
	} else if (php.preg_match(/^PU\*(\d*\.?\d+)(\/[A-Z0-9]+|)$/, token, matches = [])) {
		[name, data] = ['markup', matches[1]];
	} else if (php.preg_match(/^K(P|)([A-Z]*)(\d*\.?\d+)$/, token, matches = [])) {
		const [, percentMarker, region, amount] = matches;
		[name, data] = ['commission', {
			units: percentMarker ? 'percent' : 'amount',
			region: region || null,
			value: amount,
		}];
	} else if (php.preg_match(/^A([A-Z0-9]{2})$/, token, matches = [])) {
		[name, data] = ['validatingCarrier', matches[1]];
	} else if (php.preg_match(/^C-([A-Z0-9]{2})$/, token, matches = [])) {
		[name, data] = ['overrideCarrier', matches[1]];
	} else if (php.preg_match(/^M([A-Z]{3})$/, token, matches = [])) {
		[name, data] = ['currency', matches[1]];
	} else if (php.preg_match(/^AC\*([A-Z0-9]+)$/, token, matches = [])) {
		[name, data] = ['accountCode', matches[1]];
	} else if (php.preg_match(/^ST(\d+[\d\/\-]*)$/, token, matches = [])) {
		[name, data] = ['sideTrip', parseRanges(matches[1])];
	} else if (php.preg_match(/^W(TKT)$/, token, matches = [])) {
		[name, data] = ['exchange', matches[1]];
	} else if (php.preg_match(/^NC$/, token, matches = [])) {
		[name, data] = ['lowestFare', true];
	} else if (php.preg_match(/^NCS$/, token, matches = [])) {
		[name, data] = ['lowestFareIgnoringAvailability', true];
	} else if (php.preg_match(/^NCB$/, token, matches = [])) {
		[name, data] = ['lowestFareAndRebook', true];
	} else if (php.preg_match(/^Q([A-Z][A-Z0-9]*)$/, token, matches = [])) {
		[name, data] = ['fareBasis', matches[1]];
	} else if (php.preg_match(/^B(\d{1,2}[A-Z]{3}\d*)$/, token, matches = [])) {
		[name, data] = ['ticketingDate', {raw: matches[1]}];
	} else if (php.preg_match(/^TC-([A-Z]{2})$/, token, matches = [])) {
		const raw = matches[1];
		const parsed = cabinClassMapping[raw];
		[name, data] = ['cabinClass', {raw, parsed}];
	}
	return {
		raw: token,
		type: name,
		parsed: data,
	};
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
