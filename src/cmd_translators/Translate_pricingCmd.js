const Normalize_priceItinerary = require('../cmd_translators/Normalize_priceItinerary.js');
const ParserUtil = require('../text_format_processing/agnostic/ParserUtil.js');
const BuilderUtil = require('../text_format_processing/agnostic/BuilderUtil.js');
const SabPricingCmdParser = require('../text_format_processing/sabre/commands/Parse_priceItinerary');
const ApoPricingCmdParser = require('../text_format_processing/apollo/commands/Parse_priceItinerary');
const AmaPricingCmdParser = require('../text_format_processing/amadeus/commands/Parse_priceItinerary.js');
const GalPricingCmdParser = require('../text_format_processing/galileo/commands/Parse_priceItinerary.js');
const Rej = require('enko-fundamentals/src/Rej.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

const PRIVATE_FARE_TYPES = ['private', 'agencyPrivate', 'airlinePrivate', 'netAirlinePrivate'];

const shortenRangesRec = BuilderUtil.shortenRanges;

const makeRangeStr = (range, coma, thru) => {
	if (range.from == range.to) {
		return range.from;
	} else if (+range.from + 1 == range.to) {
		return range.from + coma + range.to;
	} else {
		return range.from + thru + range.to;
	}
};

// 1*2*3*4*7*8*9 -> 1-4*7-9
const shortenRanges = (numbers, coma, thru) => {
	const ranges = shortenRangesRec(numbers);
	const toStr = (range) => makeRangeStr(range, coma, thru);
	return ranges.map(toStr).join(coma);
};

const translatePaxes_apollo = ({ptcs, paxNums}) => {
	const cnt = php.max(php.count(paxNums), php.count(ptcs));
	if (php.count(ptcs) === 1 && php.empty(paxNums)) {
		const ptc = ptcs[0];
		return '*' + ptc + (php.in_array(ptc, ['CNN', 'C05']) ? '/ACC' : '');
	} else {
		const paxParts = php.range(0, cnt - 1).map((i) => {
			const paxNum = paxNums[i] || i + 1;
			const ptc = ptcs[i];
			return paxNum + (ptc ? '*' + ptc : '');
		});
		return 'N' + php.implode('|', paxParts);
	}
};

const translatePaxes_galileo = ({ptcs, paxNums}) => {
	const cnt = php.max(php.count(paxNums), php.count(ptcs));
	if (php.count(ptcs) === 1 && php.empty(paxNums)) {
		const ptc = ptcs[0];
		return php.in_array(ptc, ['CNN', 'C05']) ? '*' + ptc + '/ACC' : '*' + ptc;
	} else {
		const paxParts = php.range(0, cnt - 1).map((i) => {
			const paxNum = paxNums[i] || i + 1;
			const ptc = ptcs[i];
			return paxNum + (ptc ? '*' + ptc : '');
		});
		return 'P' + php.implode('.', paxParts);
	}
};

const translatePaxes_sabre = ({ptcs, paxNums}) => {
	const grouped = {};
	for (const ptc of ptcs) {
		grouped[ptc] = grouped[ptc] || [];
		grouped[ptc].push(ptc);
	}
	const addCnt = ($ptcs) => {
		const cnt = php.count($ptcs) > 1 || php.count(grouped) > 1 ? php.count($ptcs) : '';
		return cnt + ($ptcs[0] || 'ADT');
	};
	return php.implode('¥', php.array_filter([
		paxNums.length > 0 ? 'N' + paxNums.join('/') : '',
		ptcs.length > 0 ? 'P' + Object.values(grouped).map(addCnt).join('/') : '',
	]));
};

const subMod_amadeus = (mod) => {
	if (mod.type === 'currency') {
		return 'FC-' + mod.parsed;
	} else if (mod.type === 'fareType') {
		if (mod.parsed === 'public') {
			return 'P';
		} else if (PRIVATE_FARE_TYPES.includes(mod.parsed)) {
			return 'U';
		} else {
			throw Rej.NotImplemented.makeExc('Unsupported fare type ' + mod.parsed.parsed + ' - ' + mod.raw);
		}
	} else if (mod.type === 'validatingCarrier') {
		return 'VC-' + mod.parsed;
	} else if (mod.type === 'overrideCarrier') {
		return 'OCC-' + mod.parsed;
	} else if (mod.type === 'ticketingDate') {
		return mod.parsed.raw;
	} else if (mod.type === 'forceProperEconomy') {
		return '*BD';
	} else {
		return null;
	}
};

const translatePaxes_amadeus = ({ptcs, paxNums, pricingModifiers = []}) => {
	const normPtc = ($ptc) => $ptc || 'ADT';
	ptcs = php.array_values(php.array_unique(ptcs));
	const subMods = [];
	const superMods = [];
	let accountCodes = pricingModifiers
		.filter(m => m.type === 'segments')
		.flatMap(m => m.parsed.bundles)
		.map(b => b.accountCode)
		.filter(c => c);
	accountCodes = [...new Set(accountCodes)];
	for (const mod of pricingModifiers) {
		const subMod = subMod_amadeus(mod);
		if (subMod) {
			subMods.push(subMod);
		} else {
			superMods.push(mod);
		}
	}
	if (accountCodes.length > 0) {
		const msg = 'Account codes not supported in Amadeus: ' + accountCodes.join(',');
		throw Rej.NotImplemented.makeExc(msg, {ptcs, paxNums, pricingModifiers});
	}
	pricingModifiers.splice(0);
	pricingModifiers.push(...superMods);

	const paxMods = [];
	if (paxNums.length) {
		paxMods.push('P' + php.implode(',', paxNums));
	}
	if (ptcs.length > 0 || subMods.length > 0) {
		const rMod = 'R' + [ptcs.map(normPtc).join('*')]
			.concat(subMods).join(',');
		paxMods.push(rMod);
	}

	return paxMods.join('/');
};

const translateNormPaxes = (toGds, norm) => {
	const cnt = php.max(php.count(norm.paxNums), php.count(norm.ptcs));
	if (!cnt || !php.empty(norm.paxNums) && !php.empty(norm.ptcs)
		&& php.count(norm.paxNums) !== php.count(norm.ptcs)
	) {
		return null;
	}
	return {
		apollo: translatePaxes_apollo,
		galileo: translatePaxes_galileo,
		sabre: translatePaxes_sabre,
		amadeus: translatePaxes_amadeus,
	}[toGds](norm);
};

const translatePaxes = (fromGds, toGds, mods) => {
	let norm;
	if (!(norm = Normalize_priceItinerary.normalizePaxes(fromGds, mods))) {
		return null;
	}
	return translateNormPaxes(toGds, norm);
};

const init = (gds, norm) => {
	const baseCmdMapping = Normalize_priceItinerary.baseCmdMapping[gds];
	let effectiveBaseCmd = null;
	for (const [baseCmd, action] of Object.entries(baseCmdMapping)) {
		if (action === norm.action) {
			effectiveBaseCmd = baseCmd;
		}
	}
	const effectiveMods = [];
	const paxMod = translateNormPaxes(gds, norm);
	let paxModPushed = false;
	const pushPaxMod = () => {
		if (!paxModPushed && paxMod) {
			paxModPushed = true;
			effectiveMods.push(paxMod);
		}
	};
	return {effectiveBaseCmd, effectiveMods, pushPaxMod};
};

const processTravelportMod = (effectiveMods, mod, coma, thru) => {
	if (mod.type === 'currency') {
		effectiveMods.push(':' + mod.parsed);
	} else if (mod.type === 'validatingCarrier') {
		effectiveMods.push('C' + mod.parsed);
	} else if (mod.type === 'overrideCarrier') {
		effectiveMods.push('OC' + mod.parsed);
	} else if (mod.type === 'ticketingAgencyPcc') {
		effectiveMods.push('TA' + mod.parsed);
	} else if (mod.type === 'commission') {
		const {units, value} = mod.parsed;
		const apolloMod = 'Z' + (units === 'amount' ? '$' : '') + value;
		effectiveMods.push(apolloMod);
	} else if (mod.type === 'accompaniedChild') {
		// could have been added by `translatePaxes()`
		if (!effectiveMods.join('/').includes('/ACC')) {
			effectiveMods.push('ACC');
		}
	} else if (mod.type === 'segments') {
		const bundles = mod.parsed.bundles;
		const grouped = {};
		for (const bundle of bundles) {
			let modsPart = '';
			if (bundle.accountCode) {
				modsPart += '-' + bundle.accountCode;
			}
			if (bundle.bookingClass) {
				modsPart += '.' + bundle.bookingClass;
			}
			if (bundle.fareBasis) {
				modsPart += '@' + bundle.fareBasis;
			}
			grouped[modsPart] = grouped[modsPart] || [];
			grouped[modsPart].push(...bundle.segmentNumbers);
		}
		const entries = Object.entries(grouped);
		if (entries.length === 1 && entries[0][1].length === 0) {
			effectiveMods.push(entries[0][0]);
		} else {
			const bundleTokens = [];
			for (const [modsPart, segNums] of Object.entries(grouped)) {
				if (segNums.length > 0) {
					for (const range of shortenRangesRec(segNums)) {
						const bundleStr = makeRangeStr(range, coma, thru) + modsPart;
						bundleTokens.push(bundleStr);
					}
				} else if (modsPart) {
					bundleTokens.push(modsPart);
				}
			}
			effectiveMods.push('S' + bundleTokens.join(coma));
		}
	} else if (mod.raw === 'MIX') {
		// fake alias modifier
		effectiveMods.push('MIX');
	} else if (mod.type === 'forceProperEconomy') {
		effectiveMods.push('FXD');
	} else {
		return false;
	}
	return true;
};

const inApollo = (norm) => {
	let {effectiveBaseCmd, effectiveMods, pushPaxMod} = init('apollo', norm);
	if (!effectiveBaseCmd) {
		if (norm.action === 'storePricing') {
			effectiveBaseCmd = 'T:$B';
		} else {
			throw Rej.NotImplemented.makeExc('Unsupported action - ' + norm.action);
		}
	}
	for (const mod of norm.pricingModifiers) {
		if (processTravelportMod(effectiveMods, mod, '|', '*')) {
			// following is Apollo-specific
		} else if (mod.type === 'namePosition') {
			pushPaxMod();
		} else if (mod.type === 'fareType') {
			const letter = ApoPricingCmdParser.encodeFareType(mod.parsed);
			if (mod.parsed === 'private') {
				effectiveMods.push(':A'); // usually agents need this one, not :P
			} else if (letter) {
				effectiveMods.push(':' + letter);
			} else {
				throw Rej.NotImplemented.makeExc('Unsupported fare type ' + mod.parsed.parsed + ' - ' + mod.raw);
			}
		} else if (mod.type === 'ticketingDate') {
			effectiveMods.push(':' + mod.parsed.raw);
		} else if (mod.type === 'cabinClass') {
			const typeToLetter = php.array_flip(ApoPricingCmdParser.getCabinClassMapping());
			const letter = typeToLetter[mod.parsed.parsed];
			if (letter) {
				effectiveMods.push('/@' + letter);
			} else {
				throw Rej.NotImplemented.makeExc('Unsupported cabin class ' + mod.parsed.parsed + ' - ' + mod.raw);
			}
		} else {
			throw Rej.NotImplemented.makeExc('Unsupported modifier ' + mod.type + ' - ' + mod.raw);
		}
	}
	pushPaxMod();
	return [effectiveBaseCmd, ...effectiveMods].join('/');
};

/** note, signatures are different from Amadeus and Sabre - to not add /ACC/ modifier twice */
const mod_galileo = (effectiveMods, mod) => {
	if (processTravelportMod(effectiveMods, mod, '.', '-')) {
		// following is Galileo-specific
	} else if (mod.type === 'fareType') {
		const letter = ApoPricingCmdParser.encodeFareType(mod.parsed);
		if (letter) {
			effectiveMods.push(':' + letter);
		} else {
			throw Rej.NotImplemented.makeExc('Unsupported fare type ' + mod.parsed.parsed + ' - ' + mod.raw);
		}
	} else if (mod.type === 'ticketingDate') {
		effectiveMods.push('.T' + mod.parsed.raw);
	} else if (mod.type === 'cabinClass') {
		const typeToLetter = php.array_flip(GalPricingCmdParser.getCabinClassMapping());
		const letter = typeToLetter[mod.parsed.parsed];
		if (letter) {
			effectiveMods.push('++-' + letter);
		} else {
			throw Rej.NotImplemented('Unsupported cabin class ' + mod.parsed.parsed + ' - ' + mod.raw);
		}
	} else {
		return false;
	}
	return true;
};

const inGalileo = (norm) => {
	let {effectiveBaseCmd, effectiveMods, pushPaxMod} = init('galileo', norm);
	if (!effectiveBaseCmd) {
		if (norm.action === 'storePricing') {
			effectiveBaseCmd = 'FQ';
		} else {
			throw Rej.NotImplemented.makeExc('Unsupported action - ' + norm.action);
		}
	}
	for (const mod of norm.pricingModifiers) {
		if (mod_galileo(effectiveMods, mod)) {
			// handled
		} else if (mod.type === 'namePosition') {
			pushPaxMod();
		} else {
			throw Rej.NotImplemented.makeExc('Unsupported modifier ' + mod.type + ' - ' + mod.raw);
		}
	}
	pushPaxMod();
	return [effectiveBaseCmd, ...effectiveMods].join('/');
};

const mod_sabre = (mod) => {
	const effectiveMods = [];
	if (mod.type === 'currency') {
		effectiveMods.push('M' + mod.parsed);
	} else if (mod.type === 'validatingCarrier') {
		effectiveMods.push('A' + mod.parsed);
	} else if (mod.type === 'overrideCarrier') {
		effectiveMods.push('C-' + mod.parsed);
	} else if (mod.type === 'ticketingDate') {
		effectiveMods.push('B' + mod.parsed.raw);
	} else if (mod.type === 'cabinClass') {
		const typeToLetter = php.array_flip(SabPricingCmdParser.cabinClassMapping);
		const letter = typeToLetter[mod.parsed.parsed];
		if (letter) {
			effectiveMods.push('TC-' + letter);
		} else if (mod.parsed.parsed === 'sameAsBooked') {
			// Sabre does that by default
		} else {
			throw Rej.NotImplemented.makeExc('Unsupported cabin class ' + mod.parsed.parsed + ' - ' + mod.raw);
		}
	} else if (mod.type === 'segments') {
		const bundles = mod.parsed.bundles;
		let accountCodes = bundles.map(b => b.accountCode).filter(fb => fb);
		accountCodes = [...new Set(accountCodes)];
		if (accountCodes.length > 1) {
			throw Rej.NotImplemented.makeExc('Account code can not be specified per segment in Sabre');
		} else if (accountCodes.length === 1) {
			// agent usually use RR*, though there is also AC*
			// format, not sure which of them is the correct one...
			effectiveMods.push('RR*' + accountCodes[0]);
		}
		let fareBases = bundles.map(b => b.fareBasis).filter(fb => fb);
		fareBases = [...new Set(fareBases)];
		const singleFb = fareBases.length !== 1 ? null : fareBases[0];
		if (singleFb) {
			effectiveMods.push('Q' + singleFb);
		}
		const selects = bundles.filter(b => b.fareBasis && b.segmentNumbers.length > 0);
		const justNums = bundles.flatMap(b => b.fareBasis ? [] : b.segmentNumbers);
		if (justNums.length > 0) {
			// simplify: S1/2¥S5/6 -> S1/2/5/6
			selects.push({segmentNumbers: justNums});
		}
		for (const bundle of selects) {
			const segNums = bundle.segmentNumbers;
			let mod = 'S' + shortenRanges(segNums, '/', '-');
			if (!singleFb && bundle.fareBasis) {
				mod += '*' + bundle.fareBasis;
			}
			effectiveMods.push(mod);
		}
	} else if (mod.type === 'fareType') {
		if (mod.parsed === 'public') {
			effectiveMods.push('PL');
		} else if (PRIVATE_FARE_TYPES.includes(mod.parsed)) {
			effectiveMods.push('PV');
		} else {
			throw Rej.NotImplemented.makeExc('Unsupported fare type ' + mod.parsed.parsed + ' - ' + mod.raw);
		}
	} else if (mod.type === 'commission') {
		const {units, value} = mod.parsed;
		const sabreMod = 'K' + (units === 'percent' ? 'P' : '') + value;
		effectiveMods.push(sabreMod);
	} else {
		return null;
	}
	return effectiveMods;
};

const inSabre = (norm) => {
	const {effectiveBaseCmd, effectiveMods, pushPaxMod} = init('sabre', norm);
	if (!effectiveBaseCmd) {
		throw Rej.NotImplemented.makeExc('Unsupported action - ' + norm.action);
	}
	if (effectiveBaseCmd !== 'WP') {
		effectiveMods.unshift(effectiveBaseCmd.slice('WP'.length));
	}
	let postfix = '';
	for (const mod of norm.pricingModifiers) {
		let sabreMods;
		if (mod.type === 'namePosition') {
			pushPaxMod();
		} else if (sabreMods = mod_sabre(mod)) {
			effectiveMods.push(...sabreMods);
		} else if (mod.type === 'accompaniedChild') {
			// skip - Sabre does not require it if I remember right
		} else if (mod.type === 'forceProperEconomy') {
			effectiveMods.push('FXD');
		} else if (mod.raw === 'MIX') {
			// fake alias modifier
			postfix += '/MIX';
		} else {
			throw Rej.NotImplemented.makeExc('Unsupported modifier ' + mod.type + ' - ' + mod.raw);
		}
	}
	pushPaxMod();
	return 'WP' + effectiveMods.join('¥') + postfix;
};

/** @return {Array|null} */
const mod_amadeus = (mod) => {
	const effectiveMods = [];
	if (mod.type === 'cabinClass') {
		const typeToLetter = php.array_flip(AmaPricingCmdParser.getCabinClassMapping());
		const letter = typeToLetter[mod.parsed.parsed];
		if (letter || letter === '') {
			effectiveMods.push('K' + letter);
		} else {
			throw Rej.NotImplemented.makeExc('Unsupported cabin class ' + mod.parsed.parsed + ' - ' + mod.raw);
		}
		effectiveMods.push();
	} else if (mod.type === 'accompaniedChild') {
		// not needed in Amadeus I guess
	} else if (mod.type === 'segments') {
		const bundles = mod.parsed.bundles;
		let fareBases = bundles.map(b => b.fareBasis).filter(fb => fb);
		fareBases = [...new Set(fareBases)];
		if (fareBases.length > 1) {
			throw Rej.NotImplemented.makeExc('Multiple fare bases not supported in Amadeus');
		} else if (fareBases.length === 1) {
			effectiveMods.push('L-' + fareBases[0]);
		} else {
			const segNums = bundles.flatMap(b => b.segmentNumbers);
			if (segNums.length > 0) {
				effectiveMods.push('S' + shortenRanges(segNums, ',', '-'));
			}
		}
	} else {
		return null;
	}
	return effectiveMods;
};

const inAmadeus = (norm) => {
	const baseCmdMapping = Normalize_priceItinerary.baseCmdMapping.amadeus;
	let effectiveBaseCmd = null;
	for (const [baseCmd, action] of Object.entries(baseCmdMapping)) {
		if (action === norm.action) {
			effectiveBaseCmd = baseCmd;
		}
	}
	const effectiveMods = [];
	const paxMod = translatePaxes_amadeus(norm);
	let paxModPushed = false;
	const pushPaxMod = () => {
		if (!paxModPushed && paxMod) {
			paxModPushed = true;
			effectiveMods.push(paxMod);
		}
	};
	if (!effectiveBaseCmd) {
		throw Rej.NotImplemented.makeExc('Unsupported action - ' + norm.action);
	}
	for (const mod of norm.pricingModifiers) {
		let amadeusMods;
		if (mod.type === 'namePosition') {
			pushPaxMod();
		} else if (amadeusMods = mod_amadeus(mod)) {
			effectiveMods.push(...amadeusMods);
		} else if (mod.raw === 'MIX') {
			// fake alias modifier
			effectiveMods.push('MIX');
		} else {
			throw Rej.NotImplemented.makeExc('Unsupported modifier ' + mod.type + ' - ' + mod.raw);
		}
	}
	pushPaxMod();
	return [effectiveBaseCmd, ...effectiveMods].join('/');
};

const fromData = (toGds, normalized) => {
	return {
		apollo: inApollo,
		galileo: inGalileo,
		sabre: inSabre,
		amadeus: inAmadeus,
	}[toGds](normalized);
};

const Translate_pricingCmd = ({
	cmdRq, fromGds, toGds, parsed,
	baseDate = null,
}) => {
	const normalized = Normalize_priceItinerary(parsed, fromGds);
	if (!normalized) {
		throw Rej.NoContent.makeExc('Could not normalize pricing command');
	}
	normalized.pricingModifiers = normalized.pricingModifiers.map(mod => {
		if (mod.type === 'ticketingDate' && baseDate) {
			const partial = ParserUtil.parsePartialDate(mod.parsed.raw);
			if (partial) {
				// Amadeus only accepts full date
				const full = ParserUtil.addYear(partial, baseDate);
				const gdsDate = php.strtoupper(php.date('dMy', php.strtotime(full)));
				return {...mod, parsed: {raw: gdsDate}};
			}
		}
		return mod;
	});
	return fromData(toGds, normalized);
};

// ... probably should start splitting GDS-es to separate files...
Translate_pricingCmd.subMod_amadeus = subMod_amadeus;
Translate_pricingCmd.mod_amadeus = mod_amadeus;
Translate_pricingCmd.mod_sabre = mod_sabre;
Translate_pricingCmd.mod_galileo = mod_galileo;

Translate_pricingCmd.fromData = fromData;
Translate_pricingCmd.translatePaxes = translatePaxes;

module.exports = Translate_pricingCmd;
