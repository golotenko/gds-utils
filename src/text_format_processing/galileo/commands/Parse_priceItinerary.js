const php = require('klesun-node-tools/src/Transpiled/php.js');
const Parse_apollo_priceItinerary = require('../../apollo/commands/Parse_priceItinerary.js');

const parsePModPtcGroup = (ptcToken) => {
	let matches;
	if (php.preg_match(/^(\d+(?:-\d+|)|)(\*[A-Z0-9]{1,3}|)([A-Z0-9]*)/, ptcToken, matches = [])) {
		if (!matches[0]) {
			return null;
		}
		const [, range, ptc, ptcDesc] = matches;
		const [from, to] = php.array_pad(php.explode('-', range), 2, '');
		return {
			passengerNumbers: range ? php.range(from, to || from) : [],
			ptc: php.ltrim(ptc, '*'),
			ptcDescription: ptcDesc,
			raw: matches[0],
		};
	} else {
		return null;
	}
};

// 'P1-3*JCB.5.7*INF'
// 'P1*ITX.2*C03.3*INS'
// 'P1*SRC65LGB.2*SRC75LGB', '*CH'
const parsePassengerModifier = (rawMod) => {
	const ptcGroups = [];
	let raw = null, appliesToAll;
	if (rawMod.startsWith('*')) {
		const parsed = parsePModPtcGroup(rawMod);
		if (parsed) {
			appliesToAll = true;
			raw = parsed.raw;
			ptcGroups.push(parsed);
		} else {
			return null;
		}
	} else if (rawMod.startsWith('P')) {
		appliesToAll = false;
		const content = rawMod.slice(php.strlen('P'));
		const ptcTokens = content.split('.');
		for (const ptcToken of ptcTokens) {
			const parsed = parsePModPtcGroup(ptcToken);
			if (parsed && !php.empty(parsed.passengerNumbers)) {
				ptcGroups.push(parsed);
			} else {
				break;
			}
		}
		raw = 'P' + php.implode('.', php.array_column(ptcGroups, 'raw'));
	} else {
		return null;
	}
	const parsed = {appliesToAll, ptcGroups};
	return {type: 'passengers', raw, parsed};
};
// '@LHXAN', '.K', '-*711M.K', '-*711M'
const parseSegmentSubMods = (textLeft) => {
	const subMods = [];
	while (textLeft) {
		let match;
		if (match = textLeft.match(/^@([A-Z][A-Z0-9]*)/)) {
			subMods.push({type: 'fareBasis', data: match[1]});
		} else if (match = textLeft.match(/^\.([A-Z])(?![A-Z0-9])/)) {
			subMods.push({type: 'bookingClass', data: match[1]});
		} else if (match = textLeft.match(/^-\*([A-Z0-9]{3,4})(?![A-Z0-9])/)) {
			subMods.push({type: 'pcc', data: match[1]});
		} else {
			break;
		}
		textLeft = textLeft.slice(match[0].length);
	}
	return {subMods, textLeft};
};

const makeSegmentBundle = (segNums, subMods) => {
	return {
		segmentNumbers: segNums,
		bookingClass: subMods.filter(m => m.type === 'bookingClass').map(m => m.data)[0],
		fareBasis: subMods.filter(m => m.type === 'fareBasis').map(m => m.data)[0],
		pcc: subMods.filter(m => m.type === 'pcc').map(m => m.data)[0],
	};
};

// 'S1.3', 'S2-4.6-8', 'S1@LHXAN.2@LHWAN', 'S1.K.2.K', S1-*711M.K.2.K-*711M
// similar to Apollo, only with "." and "-" instead of "|" and "*"
const parseSegmentModifier = (textLeft) => {
	const startText = textLeft;
	const asGlobal = parseSegmentSubMods(textLeft);
	if (asGlobal.subMods.length > 0) {
		const bundle = makeSegmentBundle([], asGlobal.subMods);
		return {
			type: 'segments',
			raw: !asGlobal.textLeft ? startText :
				textLeft.slice(0, -asGlobal.textLeft.length),
			parsed: {bundles: [bundle]},
		};
	} else if (!textLeft.startsWith('S')) {
		return null;
	}
	const bundles = [];
	let match;
	while (match = textLeft.match(/^[S.](\d+)(-\d+|)/)) {
		const from = match[1];
		const to = !match[2] ? null : match[2].slice('-'.length);
		textLeft = textLeft.slice(match[0].length);
		const segNums = !to ? [from] : php.range(from, to);
		const subRec = parseSegmentSubMods(textLeft);
		textLeft = subRec.textLeft;
		const bundle = makeSegmentBundle(segNums, subRec.subMods);
		bundles.push(bundle);
	}
	if (bundles.length > 0) {
		return {
			raw: !textLeft ? startText :
				startText.slice(0, -textLeft.length),
			type: 'segments',
			parsed: {bundles},
		};
	} else {
		return null;
	}
};

const getCabinClassMapping = () => {
	return {
		ECON: 'economy',
		PREME: 'premiumEconomy',
		BUSNS: 'business',
		FIRST: 'first',
		AB: 'sameAsBooked',
	};
};

const parseMod = (gluedModsPart) => {
	let matches, raw, type, parsed, mod;

	if (php.preg_match(/^C([A-Z0-9]{2})(?![A-Z0-9])/, gluedModsPart, matches = [])) {
		[raw, type, parsed] = [matches[0], 'validatingCarrier', matches[1]];
	} else if (php.preg_match(/^OC([A-Z0-9]{2})(?![A-Z0-9])/, gluedModsPart, matches = [])) {
		[raw, type, parsed] = [matches[0], 'overrideCarrier', matches[1]];
	} else if (php.preg_match(/^TA([A-Z0-9]{3,4})(?![A-Z0-9])/, gluedModsPart, matches = [])) {
		[raw, type, parsed] = [matches[0], 'ticketingAgencyPcc', matches[1]];
	} else if (php.preg_match(/^::?([A-Z]{3})(?![A-Z0-9])/, gluedModsPart, matches = [])) {
		[raw, type, parsed] = [matches[0], 'currency', matches[1]];
	} else if (php.preg_match(/^ET(?![A-Z0-9])/, gluedModsPart, matches = [])) {
		[raw, type, parsed] = [matches[0], 'areElectronicTickets', true];
	} else if (php.preg_match(/^ACC\d*(?![A-Z0-9])/, gluedModsPart, matches = [])) {
		[raw, type, parsed] = [matches[0], 'accompaniedChild', true];
	} else if (php.preg_match(/^\.T(\d{1,2}[A-Z]{3}\d*)(?![A-Z0-9])/, gluedModsPart, matches = [])) {
		// may be either full or partial
		[raw, type, parsed] = [matches[0], 'ticketingDate', {raw: matches[1]}];
	} else if (php.preg_match(/^:([A-Z])(?![A-Z0-9])/, gluedModsPart, matches = [])) {
		[raw, type, parsed] = [matches[0], 'fareType', Parse_apollo_priceItinerary.decodeFareType(matches[1])];
	} else if (php.preg_match(/^[|+][|+]-([A-Z]+)(?![A-Z0-9])/, gluedModsPart, matches = [])) {
		const letter = matches[1];
		const cabin = getCabinClassMapping()[letter];
		[raw, type, parsed] = [matches[0], 'cabinClass', {raw: letter, parsed: cabin}];
	} else if (php.preg_match(/^\.([A-Z])(?![A-Z0-9])/, gluedModsPart, matches = [])) {
		[raw, type, parsed] = [matches[0], 'bookingClass', matches[1]];
	} else if (php.preg_match(/^\.([A-Z]{3})([A-Z]{3})(?![A-Z0-9])/, gluedModsPart, matches = [])) {
		[raw, type, parsed] = [matches[0], 'pointOfSale', {
			sellingCity: matches[1],
			ticketingCity: matches[2],
		}];
	} else if (php.preg_match(/^:([A-Z]{2})(?![A-Z0-9])/, gluedModsPart, matches = [])) {
		[raw, type, parsed] = [matches[0], 'ignoreRule', {
			abbreviation: matches[1],
		}];
	} else if (php.preg_match(/^-([A-Z0-9]+)/, gluedModsPart, matches = [])) {
		[raw, type, parsed] = [matches[0], 'accountCode', {
			// there are more formats like -:BSAG and possibly -BSAG@@EUR8
			code: matches[1],
		}];
	} else if (mod = parsePassengerModifier(gluedModsPart)) {
		raw = mod.raw;
		type = mod.type;
		parsed = mod.parsed;
	} else if (mod = parseSegmentModifier(gluedModsPart)) {
		raw = mod.raw;
		type = mod.type;
		parsed = mod.parsed;
	} else if (gluedModsPart === 'FXD') {
		// Is used if w/o it basic economy is proposed by GDS
		[raw, type, parsed] = [gluedModsPart, 'forceProperEconomy', true];
	} else {
		[raw, type, parsed] = [gluedModsPart, null, null];
	}
	return {raw, type, parsed};
};

/**
 * parses Galileo pricing command like:
 * 'FQBBP1.2*C05.3*INF++-BUSNS'
 */
const Parse_priceItinerary = (cmd) => {
	// there are probably more 'baseCmd' variations,
	// but we don't currently have access to the HELP
	let matches;
	if (php.preg_match(/^(FQ(?:A|BB(?:K|)|BA|))\/?(.*)$/, cmd, matches = [])) {
		const [, baseCmd, modsPart] = matches;
		// some mods in Galileo starting with non-letters may have no slash before them
		const mods = [];
		for (let gluedModsPart of modsPart.split('/')) {
			while (gluedModsPart) {
				const mod = parseMod(gluedModsPart);
				if (mod.raw) {
					gluedModsPart = php.substr(gluedModsPart, php.strlen(mod.raw));
					mods.push(mod);
				} else {
					mods.push({raw: gluedModsPart, type: null, data: null});
					break;
				}
			}
		}
		return {baseCmd, pricingModifiers: mods};
	} else {
		return null;
	}

};

Parse_priceItinerary.getCabinClassMapping = getCabinClassMapping;

module.exports = Parse_priceItinerary;
