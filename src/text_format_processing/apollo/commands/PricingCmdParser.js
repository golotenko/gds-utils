const ParserUtil = require('../../agnostic/ParserUtil.js');
const Lexeme = require('../../../lexer/Lexeme.js');
const Lexer = require('../../../lexer/Lexer.js');
const {mkReg} = require('klesun-node-tools/src/Utils/Misc.js');
const php = require("klesun-node-tools/src/Transpiled/php.js");

const fareTypes = {
	N: 'public',
	P: 'private',
	G: 'agencyPrivate',
	A: 'airlinePrivate',
	C: 'netAirlinePrivate',
};

const parseFopModifier = (rawMod) => {
	if (rawMod.startsWith('F') && rawMod !== 'FXD') {
		const content = php.substr(rawMod, php.strlen('F'));
		return {raw: content};
	} else {
		return null;
	}
};

/*
 * It could be something like this:
 * N1|2*C09|3*C04 - select passenger 1.1 as normal, 2.1 as 9 years old child and 3.1 as 4 years old child
 * N1*IF21|2*IF21 - select and increase fare of passenger 1.1 by 21.00 and of 2.1 by 21.00
 * N2             - select passenger 2.1
 * N1|2|3*C04     - select passengers: 1.1 as normal and 2.1 as normal and 3.1 as 4 years old child
 * N1*IF94        - select and increase fare of passenger 1.1 by 94.00
 * N1|2*INF       - select passengers: 1.1 as normal and 2.1 as infant
 * *IF91          - select and increase fare of every passenger by 91.00
 * N1-1           - select passenger 1.1
 * N1-2           - select passenger 1.2
 */
const parseNameModifier = (pricingToken) => {
	if (!php.preg_match(/^N(\d.*)$/, pricingToken) &&
		!pricingToken.startsWith('*')
	) {
		return null;
	}
	const passengerProperties = [];
	let passengerTokens = [];
	let passengersSpecified = null;
	if (pricingToken.startsWith('N')) {
		passengersSpecified = true;
		pricingToken = php.substr(pricingToken, 1);
		passengerTokens = php.explode('|', pricingToken);
	} else {
		passengersSpecified = false;
		passengerTokens = [pricingToken];
	}
	for (const passengerToken of php.array_filter(passengerTokens)) {
		let paxProp = {
			passengerNumber: null,
			firstNameNumber: null,
			ptc: null,
			markup: null,
		};
		for (const propertyToken of php.explode('*', passengerToken)) {
			paxProp = php.array_merge(paxProp, parsePicModifier(propertyToken));
		}
		passengerProperties.push(paxProp);
	}
	return {passengersSpecified, passengerProperties};
};

// HELP OVERVIEW-PIC MODIFIER
// "*INF" - passenger is infant
// "IF53" - increase fare by 53 units of pricing currency
const parsePicModifier = ($propertyToken) => {
	const passengerProperties = [];
	let matches;
	if (php.preg_match(/^(\d+)(-\d+|)$/, $propertyToken, matches = [])) {
		const [, fieldNumber, firstNameNumber] = matches;
		passengerProperties.passengerNumber = php.intval(fieldNumber);
		passengerProperties.firstNameNumber = firstNameNumber ? -firstNameNumber : null;
	} else if (php.preg_match(/^IF(\d*\.?\d+)$/, $propertyToken, matches = [])) {
		passengerProperties.markup = matches[1];
	} else if (php.preg_match(/^C\d+/, $propertyToken)) {
		passengerProperties.ptc = $propertyToken;
	} else if (php.preg_match(/^[A-Z0-9]{3}$/, $propertyToken)) {
		passengerProperties.ptc = $propertyToken;
	}
	return passengerProperties;
};

// '-*H0Q@YX2', '-*2G2H', '@CCLL', 'Y1N0C9M0-NYC09*2CV4'
const parseSegmentBundleMods = (modStr) => {
	const getTuple = ($matches) => php.array_slice($matches, 1);
	const getFirst = ($matches) => $matches[1];
	const lexer = new Lexer([
		(new Lexeme('fareBasis', /^@([A-Z][A-Z0-9]*)/)).preprocessData(getFirst),
		(new Lexeme('privateFare', /^-([0-9A-Z]*)(?:\*([A-Z0-9]{0,4})|)/)).preprocessData(getTuple),
		(new Lexeme('bookingClass', /^\.([A-Z])/)).preprocessData(getFirst),
	]);
	const lexed = lexer.lex(modStr);
	if (lexed.text) {
		return null;
	} else {
		const typeToData = php.array_combine(
			php.array_column(lexed.lexemes, 'lexeme'),
			php.array_column(lexed.lexemes, 'data'));
		return {
			segmentNumbers: [],
			fareBasis: typeToData.fareBasis || null,
			accountCode: (typeToData.privateFare || {})[0] || null,
			pcc: (typeToData.privateFare || {})[1] || null,
			bookingClass: typeToData.bookingClass || null,
		};
	}
};

/**
 * HELP PRICING MODIFIERS-SEGMENT SELECT
 * @param string $token - like:
 * "-*1O3K"
 * "@D1EP4"
 * "S1-2-*H0Q@YX2"
 * "S1*2-*2CV4.N|3-*2CV4|4-*2CV4|5*6-*2CV4.N"
 * "S2-*2G2H|3-*2G2H"
 * "S2-2G2H|3-2G2H" (in $BBQ01)
 * "S1@DCLL|2@CCLL"
 * "S1@Y1N0C9M0-NYC09*2CV4|2-NYC09@Y1N0C9M0"
 */
const parseSegmentModifier = (token) => {
	let matches, bundles, bundle;
	if (php.preg_match(/^S(.+)$/, token, matches = [])) {
		token = matches[1];
		const rawBundles = token.split(/[\|\+]/);
		bundles = [];
		for (const bundleStr of rawBundles) {
			if (php.preg_match(/^(\d+)([\*\-]\d+|)(.*)$/, bundleStr, matches = [])) {
				let [, from, to, modStr] = matches;
				let bundle = parseSegmentBundleMods(modStr);
				if (!bundle) {
					// no "*" in $BBQ01 /S1-2G2H/ instead of /S1-*2G2H/
					bundle = parseSegmentBundleMods(to + modStr);
					if (!bundle) {
						return null;
					} else {
						to = '';
						bundle['pcc'] = bundle['accountCode'];
						bundle['accountCode'] = null;
					}
				}
				bundle['segmentNumbers'] = !to ? [from] :
					php.range(from, php.ltrim(to, '*-'));
				bundles.push(bundle);
			} else {
				return null;
			}
		}
	} else if (token && (bundle = parseSegmentBundleMods(token))) {
		bundles = [bundle];
	} else {
		return null;
	}
	const pccs = php.array_column(bundles, 'pcc');
	return {
		privateFaresPcc: php.count(php.array_unique(pccs)) === 1 ? pccs[0] : null,
		bundles: bundles,
	};
};

const getCabinClassMapping = () => {
	return {
		C: 'business',
		Y: 'economy',
		F: 'first',
		W: 'premiumEconomy',
		P: 'premiumFirst',
		U: 'upper',
		AB: 'sameAsBooked',
	};
};

const parseCabinClassModifier = (token) => {
	let matches;
	if (php.preg_match(/^\/@([A-Z]{1,2})$/, token, matches = [])) {
		const letter = matches[1];
		return {
			raw: letter,
			parsed: getCabinClassMapping()[letter] || null,
		};
	} else {
		return null;
	}
};

const parseGenericSubModifier = (raw) => {
	let parsed, type, matches;
	parsed = null;
	if (raw === 'B') {
		type = 'isBulk';
		parsed = true;
	} else if (php.preg_match(/^BG([A-Z0-9]+)$/, raw, matches = [])) {
		type = 'freeBaggageAmount';
		parsed = ParserUtil.parseBagAmountCode(matches[1]);
	} else if (php.preg_match(/^E(.+)$/, raw, matches = [])) {
		type = 'endorsementLine';
		parsed = {text: php.str_replace('@', ' ', matches[1])};
	} else if (php.preg_match(/^TD([A-Z0-9]+)$/, raw, matches = [])) {
		type = 'ticketDesignator';
		parsed = {code: matches[1]};
	} else {
		type = null;
	}
	return {raw, type, parsed};
};

// HELP TICKETING MODIFIERS-GENERIC
// "GB" - bulk fare
// "GBG1PC|B" - baggage: one piece | bulk fare
// "GTDUSA98" - ticket designator "USA98"
const parseGenericModifier = (token) => {
	let matches;
	if (php.preg_match(/^G(.+)$/, token, matches = [])) {
		const rawSubMods = matches[1].split(/[|+]/, );
		const subMods = php.array_map(a => parseGenericSubModifier(a), rawSubMods);
		const isBulk = php.in_array('isBulk', php.array_column(subMods, 'type'));
		return {subModifiers: subMods, isBulk: isBulk};
	} else {
		return null;
	}
};

const encodeFareType = (type) => {
	return php.array_flip(fareTypes)[type] || null;
};

const decodeFareType = ($code) => {
	return fareTypes[$code] || null;
};

const parseFareTypeModifier = (token) => {
	let matches;
	if (php.preg_match(/^:([A-Z])$/, token, matches = [])) {
		const code = matches[1];
		return decodeFareType(code);
	} else {
		return null;
	}
};

// HELP TICKETING MODIFIERS-COMMISSION
// "Z$173.00" - airline pays us $173
// "Z5" - airline pays us 5%
const parseCommissionModifier = (token) => {
	let matches;
	if (php.preg_match(/^Z(.*?)(\d*\.?\d+)$/, token, matches = [])) {
		const [, currencySign, amount] = matches;
		return {
			units: currencySign ? 'amount' : 'percent',
			currencySign: currencySign || null,
			value: amount,
		};
	} else {
		return null;
	}
};

// HELP PRICING MODIFIERS
const getPricingModifierSchema = () => {
	return {
		generic: ($token) => parseGenericModifier($token),
		segments: ($token) => parseSegmentModifier($token),
		cabinClass: ($token) => parseCabinClassModifier($token),
		fareType: ($token) => parseFareTypeModifier($token),
		passengers: ($token) => parseNameModifier($token),
		commission: ($token) => parseCommissionModifier($token),
		validatingCarrier: ($token) => php.preg_match(/^C../, $token) ? php.substr($token, 1) : null,
		overrideCarrier: ($token) => php.preg_match(/^OC../, $token) ? php.substr($token, 2) : null,
		ticketingAgencyPcc: ($token) => php.preg_match(/^TA[A-Z0-9]{3,4}/, $token) ? php.substr($token, 2) : null,
		ticketingDate: ($token) => {
			const match = $token.match(/^:(\d{1,2}[A-Z]{3}\d{0,4})/);
			if (match) {
				return {raw: match[1]};
			} else {
				return null;
			}
		},
		currency: ($token) => php.preg_match(/^:[A-Z]{3}$/, $token) ? php.substr($token, 1) : null,
		tourCode: ($token) => {
			let $matches;
			if (php.preg_match(/^IT([A-Z0-9\*]+)$/, $token, $matches = [])) {
				return {tourCodes: php.explode('*', $matches[1])};
			} else {
				return null;
			}
		},
		areElectronicTickets: ($token) => $token == 'ET' ? true : null,
		noCreditCardAllowed: ($token) => $token == 'NOCCGR' ? true : null,
		formOfPayment: parseFopModifier,
		forceProperEconomy: ($token) => $token == 'FXD' ? true : null,
		accompaniedChild: ($token) => $token == 'ACC' ? true : null,
	};
};

const parsePricingModifier = ($token) => {
	let $type, $parsed, $f;
	[$type, $parsed] = [null, null];
	for ([$type, $f] of Object.entries(getPricingModifierSchema())) {
		if ($parsed = $f($token)) {
			break;
		}
	}
	return {
		raw: $token,
		type: $parsed ? $type : null,
		parsed: $parsed,
	};
};

/** @param modsPart = ':N/N1*INF/:USD' || '/@W/CUA/:A' */
const parsePricingModifiers = (modsPart) => {
	let tokens = !modsPart ? [] : ('/' + modsPart).split(/(?<!\/)(?:\/)/);
	tokens = tokens.flatMap(t => {
		// //@AB:N/ - bug in apollo, but it works, so should be prepared
		const match = t.match(/^(\/@[A-Z]+)([^A-Z].*)$/);
		if (match) {
			const [, cabin, next] = match;
			return [cabin, next];
		} else {
			return [t];
		}
	});
	php.array_shift(tokens);
	const pricingModifiers = [];
	for (const token of tokens) {
		let item = parsePricingModifier(token);
		if (!item.type && token.startsWith('/')) {
			// //*JCB/ seems to be a valid format
			item = parsePricingModifier(token.slice(1));
			item.raw = '/' + item.raw;
		}
		pricingModifiers.push(item);
	}
	return pricingModifiers;
};

exports.parse = (cmd) => {
	const regex = mkReg([
		/^/,
		/(?<baseCmd>\$B(BQ\d+|B[AC0]?)?|P|)/,
		/\/?/,
		/(?<pricingModifiers>.*)/,
		/$/,
	]);
	const match = cmd.match(regex);
	if (match) {
		const pricingModifiers = parsePricingModifiers(match.groups.pricingModifiers);
		return {
			baseCmd: match.groups.baseCmd,
			isManualPricingRecord: !match.groups.baseCmd.startsWith('$B'),
			pricingModifiers: pricingModifiers,
		};
	} else {
		return null;
	}
};

exports.encodeFareType = encodeFareType;
exports.decodeFareType = decodeFareType;
exports.getCabinClassMapping = getCabinClassMapping;
exports.parsePricingModifiers = parsePricingModifiers;