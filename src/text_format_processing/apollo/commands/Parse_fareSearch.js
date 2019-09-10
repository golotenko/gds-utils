const Lexer = require('../../../lexer/Lexer.js');
const PricingCmdParser = require('./PricingCmdParser.js');
const Lexeme = require('../../../lexer/Lexeme.js');
const ParserUtil = require('../../agnostic/ParserUtil.js');
const {mkReg} = require('enko-fundamentals/src/Utils/Misc.js');
const php = require("enko-fundamentals/src/Transpiled/php.js");

/**
 * aka Tariff Display, aka $D
 */

/** note: different case from PricingCmdParser */
const getCabinClasses = () => {
	return {
		W: 'premium_economy',
		F: 'first',
		P: 'premium_first',
		C: 'business',
		Y: 'economy',
		U: 'upper',
	};
};

const parseDate = (raw) => {
	return !raw ? null : {
		raw: raw,
		partial: ParserUtil.parsePartialDate(raw),
		full: ParserUtil.parse2kDate(raw)['parsed'],
	};
};

const end = /(?![A-Z0-9])/;
const lexemes_fareSearch = [
	new Lexeme('airlines', mkReg([/^(\|[A-Z0-9]{2})+/, end]))
		.map((matches) => php.ltrim(matches[0], '|').split('|')),
	new Lexeme('currency', mkReg([/^:([A-Z]{3})/, end])).map((m) => m[1]),
	new Lexeme('tripType', mkReg([/^:(RT|OW)/, end])).map((m) => m[1]),
	new Lexeme('cabinClass', mkReg([/^(\/\/)?@(?<cabinClass>[A-Z])/, end]))
		.map((matches) => getCabinClasses()[matches.cabinClass] || null),
	new Lexeme('fareType', mkReg([/^:([A-Z])/, end]))
		.map((matches) => PricingCmdParser.decodeFareType(matches[1])),
	new Lexeme('ptc', mkReg([/^-([A-Z][A-Z0-9]{2})/, end])).map((m) => m[1]),
	new Lexeme('bookingClass', mkReg([/^-([A-Z])/, end])).map((m) => m[1]),
	new Lexeme('ticketingDate', mkReg([/^T(\d{1,2}[A-Z]{3}\d{2})/, end])).map((m) => parseDate(m[1])),
];

const parseTariffMods = ($modsPart) => {
	const lexer = new Lexer(lexemes_fareSearch);
	return lexer.lex($modsPart);
};

const Parse_fareSearch = (cmd) => {
	let returnDate, $matches, $_, departureAirport, destinationAirport, departureDate, $modsPart, $lexed;
	returnDate = null;
	// probably should parse token sequence with Lexer.js same as
	// modifiers, as we know that they may come in nearly any order...
	// the only rule I see here is that return date can only be specified with "V"-alidated indicator
	if (php.preg_match(/^\$D([A-Z]{3})([A-Z]{3})(\d{1,2}[A-Z]{3}\d{0,2})(.*)$/, cmd, $matches = [])) {
		// $DJFKMNL25MAY
		[$_, departureAirport, destinationAirport, departureDate, $modsPart] = $matches;
	} else if (php.preg_match(/^\$DV(\d{1,2}[A-Z]{3}\d{0,2})([A-Z]{3})([A-Z]{3})(\d{1,2}[A-Z]{3}\d{0,2})(.*)$/, cmd, $matches = [])) {
		// $DV25MAYJFKMNL28MAY
		[$_, departureDate, departureAirport, destinationAirport, returnDate, $modsPart] = $matches;
	} else if (php.preg_match(/^\$DV?(\d{1,2}[A-Z]{3}\d{0,2})([A-Z]{3})([A-Z]{3})(.*)$/, cmd, $matches = [])) {
		// $DV25MAYJFKMNL, $D25MAYJFKMNL
		[$_, departureDate, departureAirport, destinationAirport, $modsPart] = $matches;
	} else if (php.preg_match(/^\$D([A-Z]{3})([A-Z]{3})V(\d{1,2}[A-Z]{3})(\d{1,2}[A-Z]{3}){0,1}(.*)$/, cmd, $matches = [])) {
		// $DJFKMNLV25MAY27MAY, $DJFKMNLV25MAY
		[$_, departureAirport, destinationAirport, departureDate, returnDate, $modsPart] = $matches;
	} else {
		return null;
	}

	const lexed = parseTariffMods($modsPart);

	return {
		departureDate: parseDate(departureDate),
		returnDate: parseDate(returnDate),
		departureAirport: departureAirport,
		destinationAirport: destinationAirport,
		modifiers: lexed.lexemes.map((rec) => ({
			type: rec.lexeme, raw: rec.raw, parsed: rec.data,
		})),
		unparsed: lexed.text,
	};
};

Parse_fareSearch.getCabinClasses = getCabinClasses();

module.exports = Parse_fareSearch;