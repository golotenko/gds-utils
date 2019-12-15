const ParserUtil = require('../text_format_processing/agnostic/ParserUtil.js');
const Parse_apollo_fareSearch = require('../text_format_processing/apollo/commands/Parse_fareSearch.js');
const Parse_sabre_fareSearch = require('../text_format_processing/sabre/commands/Parse_priceItinerary.js');
const Parse_amadeus_fareSearch = require('../text_format_processing/amadeus/commands/Parse_fareSearch.js');
const Parse_galileo_fareSearch = require('../text_format_processing/galileo/commands/Parse_fareSearch');

const php = require('enko-fundamentals/src/Transpiled/php.js');

const inApollo = (cmdData) => {
	if (!cmdData) {
		return null;
	}
	cmdData.typeToData = php.array_combine(
		php.array_column(cmdData.modifiers || [], 'type'),
		php.array_column(cmdData.modifiers || [], 'parsed')
	);
	if (!php.empty(cmdData.typeToData.accountCodes)) {
		cmdData.typeToData.accountCode = php.array_shift(cmdData.typeToData.accountCodes);
		delete cmdData.typeToData.accountCodes;
	}
	return cmdData;
};

const inGalileo = (cmdData) => {
	if (!cmdData) {
		return null;
	}
	cmdData.typeToData = php.array_combine(
		php.array_column(cmdData.modifiers || [], 'type'),
		php.array_column(cmdData.modifiers || [], 'parsed')
	);
	if (!php.empty(cmdData.typeToData.accountCodes)) {
		cmdData.typeToData.accountCode = php.array_shift(cmdData.typeToData.accountCodes);
		delete cmdData.typeToData.accountCodes;
	}
	return cmdData;
};

const inAmadeus = (cmdData) => {
	let typeToData;
	if (!cmdData) {
		return null;
	}
	typeToData = php.array_combine(
		php.array_column(cmdData.modifiers, 'type'),
		php.array_column(cmdData.modifiers, 'parsed')
	);
	const subMods = (typeToData.generic || {}).rSubModifiers || [];
	typeToData = php.array_merge(typeToData, php.array_combine(
		php.array_column(subMods, 'type'),
		php.array_column(subMods, 'parsed')
	));
	const accountCode = subMods
		.filter(subMod => subMod.type === 'fareType')
		.map(ftMod => (ftMod.extraData || {}).accountCode)[0];
	if (accountCode) {
		typeToData.accountCode = accountCode;
	}
	if (php.array_key_exists(null, typeToData)) {
		return null; // failed to parse some modifiers
	}
	cmdData.departureDate = typeToData.travelDates.departureDate || null;
	cmdData.returnDate = typeToData.travelDates.returnDate || null;
	delete typeToData.travelDates;
	delete typeToData.generic;
	cmdData.typeToData = typeToData;
	cmdData.unparsed = cmdData.modifiers
		.filter(m => !m.type)
		.map(m => m.raw).join('/');
	return cmdData;
};

const inSabre = (cmdData) => {
	let typeToData, ticketingDate;
	if (!cmdData) {
		return null;
	}
	typeToData = php.array_combine(
		php.array_column(cmdData.modifiers || [], 'type'),
		php.array_column(cmdData.modifiers || [], 'parsed')
	);
	if (ticketingDate = cmdData.ticketingDate || null) {
		typeToData.ticketingDate = ticketingDate;
	}
	cmdData.returnDate = typeToData.returnDate || null;
	delete(typeToData.returnDate);
	cmdData.typeToData = typeToData;
	return cmdData;
};

/**
 * takes gds and tariff cmd like D10DECKIVRIX and
 * parses it into a structure common to all GDS-es
 */
const Normalize_fareSearch = ({cmd, gds, baseDate = null}) => {
	const normalizeDate = (dateRecord) => {
		if (!(dateRecord || {}).full) {
			if ((dateRecord || {}).partial) {
				dateRecord.full = ParserUtil.addYear(
					dateRecord.partial, baseDate
				);
			} else {
				// date not specified or invalid
				return null;
			}
		}
		return dateRecord;
	};

	/**
	 * parse and apply some normalization if needed
	 * @return {Object|null} - null if input is not recognized as tariff command
	 */
	const execute = () => {
		let cmdData;
		if (gds === 'apollo') {
			cmdData = Parse_apollo_fareSearch(cmd);
			cmdData = inApollo(cmdData);
		} else if (gds === 'sabre') {
			cmdData = Parse_sabre_fareSearch(cmd);
			cmdData = inSabre(cmdData);
		} else if (gds === 'amadeus') {
			cmdData = Parse_amadeus_fareSearch(cmd);
			cmdData = inAmadeus(cmdData);
		} else if (gds === 'galileo') {
			cmdData = Parse_galileo_fareSearch(cmd);
			cmdData = inGalileo(cmdData);
		} else {
			return null;
		}
		if (!cmdData) {
			return null;
		}
		cmdData.departureDate = normalizeDate(cmdData.departureDate || null);
		cmdData.returnDate = normalizeDate(cmdData.returnDate || null);
		return cmdData;
	};

	return execute();
};

module.exports = Normalize_fareSearch;
