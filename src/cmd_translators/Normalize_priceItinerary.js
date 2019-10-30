const php = require('enko-fundamentals/src/Transpiled/php.js');
const Rej = require('enko-fundamentals/src/Rej.js');

const dict = items => {
	const result = {};
	for (const item of items) {
		result[item.type] = item.parsed;
	}
	return result;
};

const normalizePaxes_apollo = (mods) => {
	// In Apollo you can't specify PTC without pax numbers even if there are no paxes in PNR
	//$paxNums = array_column($mods['passengers']['passengerProperties'] ?? [], 'passengerNumber');
	const paxNums = [];
	const ptcs = php.array_column((mods['passengers'] || {})['passengerProperties'] || [], 'ptc');
	if (php.empty(ptcs) && !php.empty(mods['accompaniedChild'])) {
		ptcs.push('C05');
	}
	return {paxNums, ptcs};
};

const normalizePaxes_galileo = (mods) => {
	const paxNums = [];
	const ptcs = [];
	for (const ptcGroup of Object.values((mods['passengers'] || {})['ptcGroups'] || [])) {
		if (!mods['passengers']['appliesToAll']) {
			for (const number of Object.values(ptcGroup['passengerNumbers'])) {
				ptcs.push(ptcGroup['ptc']);
			}
		} else {
			ptcs.push(ptcGroup['ptc']);
		}
	}
	if (php.empty(ptcs) && !php.empty(mods['accompaniedChild'])) {
		ptcs.push('C05');
	}
	return {paxNums, ptcs};
};

const normalizePaxes_sabre = (mods) => {
	const paxNums = php.array_column(mods['names'] || [], 'fieldNumber');
	const ptcs = [];
	for (const ptcRec of Object.values(mods['ptc'] || [])) {
		for (let i = 0; i < (ptcRec['quantity'] || 1); ++i) {
			ptcs.push(ptcRec['ptc']);
		}
	}
	return {paxNums, ptcs};
};

const normalizePaxes_amadeus = (mods) => {
	const normPtc = ($ptc) => ({'IN': 'INF', 'CH': 'CNN'} || {})[$ptc] || $ptc;
	const paxNums = mods['names'] || [];
	const ptcs = ((mods['generic'] || {})['ptcs'] || []).map(normPtc);
	return {paxNums, ptcs};
};

const normalizePaxes = (fromGds, mods) => ({
	apollo: normalizePaxes_apollo,
	sabre: normalizePaxes_sabre,
	galileo: normalizePaxes_galileo,
	amadeus: normalizePaxes_amadeus,
})[fromGds](mods);

const baseCmdMapping = {
	apollo: {
		'$B': 'price',
		'$BB': 'lowestFare',
		'$BBA': 'lowestFareIgnoringAvailability',
		'$BB0': 'lowestFareAndRebook',
		'$BBQ01': 'confirmLowestFareRebook',
	},
	/** sabre is the only GDS that allows to specify actions as a separate modifier... */
	sabre: {
		'WP': 'price',
		'WPRQ': 'storePricing',
		'WPNC': 'lowestFare',
		'WPNCS': 'lowestFareIgnoringAvailability',
		'WPNCB': 'lowestFareAndRebook',
	},
	galileo: {
		'FQ': 'price',
		'FQBB': 'lowestFare',
		'FQBA': 'lowestFareIgnoringAvailability',
		'FQBBK': 'confirmLowestFareRebook',
	},
	amadeus: {
		'FXX': 'price',
		'FXP': 'storePricing',
		'FXA': 'lowestFare',
		'FXL': 'lowestFareIgnoringAvailability',
		'FXR': 'lowestFareAndRebook',
	},
};

/** @param parsed = require('CommandParser.js').parse() */
const inApollo = (parsed) => {
	const mods = parsed.data.pricingModifiers;
	const action = parsed.type === 'storePricing' ? 'storePricing' :
		baseCmdMapping.apollo[parsed.data.baseCmd];
	if (!action) {
		throw Rej.NotImplemented.makeExc('Unsupported base cmd - ' + parsed.data.baseCmd);
	}
	const normMods = [];
	for (const mod of mods) {
		if (mod.type === 'passengers') {
			normMods.push({type: 'namePosition'});
		} else {
			normMods.push(mod);
		}
	}
	return {
		action: action,
		...normalizePaxes_apollo(dict(mods)),
		pricingModifiers: normMods,
	};
};

/** @param parsed = require('CommandParser.js').parse() */
const inSabre = (parsed) => {
	const mods = parsed.data.pricingModifiers;
	const normMods = [];
	let action = 'price';
	let fareBasis = null;
	const segMod = {
		type: 'segments',
		parsed: {bundles: []},
	};
	let segBundlesPushed = false;
	const pushSegBundles = () => {
		if (!segBundlesPushed) {
			segBundlesPushed = true;
			normMods.push(segMod);
		}
	};
	for (const mod of mods) {
		const asAction = baseCmdMapping.sabre['WP' + mod.raw];
		if (asAction) {
			action = asAction;
		} else if (mod.type === 'fareBasis') {
			fareBasis = mod.parsed;
			pushSegBundles();
		} else if (mod.type === 'segments') {
			segMod.parsed.bundles.push(mod.parsed);
			pushSegBundles();
		} else if (['names', 'ptc'].includes(mod.type)) {
			normMods.push({type: 'namePosition'});
		} else {
			normMods.push(mod);
		}
	}
	if (fareBasis) {
		segMod.parsed.bundles = segMod.parsed.bundles.length > 0
			? segMod.parsed.bundles.map(b => ({...b, fareBasis}))
			: [{segmentNumbers: [], fareBasis}];
	}
	return {
		action: action,
		...normalizePaxes_sabre(dict(mods)),
		pricingModifiers: normMods,
	};
};

/** @param parsed = require('CommandParser.js').parse() */
const inGalileo = (parsed) => {
	const mods = parsed.data.pricingModifiers;
	const action = parsed.type === 'storePricing' ? 'storePricing' :
		baseCmdMapping.galileo[parsed.data.baseCmd];
	if (!action) {
		throw Rej.NotImplemented.makeExc('Unsupported base cmd - ' + parsed.data.baseCmd);
	}
	const normMods = [];
	for (const mod of mods) {
		if (mod.type === 'passengers') {
			normMods.push({type: 'namePosition'});
		} else {
			normMods.push(mod);
		}
	}
	return {
		action: action,
		...normalizePaxes_galileo(dict(mods)),
		pricingModifiers: normMods,
	};
};

/** @param parsed = require('CommandParser.js').parse() */
const inAmadeus = (parsed) => {
	const stores = parsed.data.pricingStores;
	if (stores.length > 1) {
		throw Rej.NotImplemented.makeExc('Multiple stores (' + stores.length + ') in one format is not supported');
	}
	const mods = stores[0] || [];
	const action = baseCmdMapping.amadeus[parsed.data.baseCmd];

	const normMods = [];
	let fareBasis = null;
	const segMod = {
		type: 'segments',
		parsed: {bundles: []},
	};
	let segBundlesPushed = false;
	const pushSegBundles = () => {
		if (!segBundlesPushed) {
			segBundlesPushed = true;
			normMods.push(segMod);
		}
	};
	for (const mod of mods) {
		if (mod.type === 'generic') {
			normMods.push({type: 'namePosition'});
			for (const subMod of mod.parsed.rSubModifiers) {
				normMods.push(subMod);
			}
		} else if (mod.type === 'fareBasis') {
			fareBasis = mod.parsed.fareBasis;
			pushSegBundles();
		} else if (mod.type === 'segments') {
			segMod.parsed.bundles.push({segmentNumbers: mod.parsed});
			pushSegBundles();
		} else if (!['names', 'ownSeat'].includes(mod.type)) {
			normMods.push({type: 'namePosition'});
			normMods.push(mod);
		}
	}
	if (fareBasis) {
		segMod.parsed.bundles = segMod.parsed.bundles.length > 0
			? segMod.parsed.bundles.map(b => ({...b, fareBasis}))
			: [{segmentNumbers: [], fareBasis}];
	}

	return {
		action: action,
		...normalizePaxes_amadeus(dict(mods)),
		pricingModifiers: normMods,
	};
};

const Normalize_priceItinerary = (parsed, gds) => {
	return {
		apollo: inApollo,
		galileo: inGalileo,
		sabre: inSabre,
		amadeus: inAmadeus,
	}[gds](parsed);
};

Normalize_priceItinerary.inApollo = inApollo;
Normalize_priceItinerary.normalizePaxes = normalizePaxes;
Normalize_priceItinerary.baseCmdMapping = baseCmdMapping;

module.exports = Normalize_priceItinerary;
