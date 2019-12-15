const Lexer = require('../../../lexer/Lexer.js');
const PricingCmdParser = require('./Parse_priceItinerary.js');
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
		full: ParserUtil.parse2kDate(raw).parsed,
	};
};

const isPositional = (context) => {
	const prefixes = ['validated', 'travelDate', 'cityPair'];
	return context && (
		context.lexemes.length === 0 ||
		prefixes.includes(context.lexemes.slice(-1)[0].lexeme)
	);
};

const end = /(?![A-Z0-9])/;
const lexemes_fareSearch = [
	(new Lexeme('accountCodes', mkReg([/^-PRI((-[A-Z0-9]+)*)/, end])))
		.map((matches) => matches[1] ? php.ltrim(matches[1], '-').split('-') : []),
	new Lexeme('airlines', mkReg([/^(?:\/)*(\|[A-Z0-9]{2})+/, end]))
		.map((matches) => php.ltrim(matches[0], '|').split('|')),
	new Lexeme('currency', mkReg([/^(?:\/)*:([A-Z]{3})/, end])).map((m) => m[1]),
	new Lexeme('tripType', mkReg([/^(?:\/)*:(RT|OW)/, end])).map((m) => m[1]),
	new Lexeme('cabinClass', mkReg([/^(?:\/)*@(?<cabinClass>[A-Z])/, end]))
		.map((matches) => getCabinClasses()[matches.cabinClass] || null),
	new Lexeme('fareType', mkReg([/^(?:\/)*:([A-Z])/, end]))
		.map((matches) => PricingCmdParser.decodeFareType(matches[1])),
	new Lexeme('ptc', mkReg([/^(?:\/)*-([A-Z][A-Z0-9]{2})/, end])).map((m) => m[1]),
	new Lexeme('bookingClass', mkReg([/^(?:\/)*-([A-Z])/, end])).map((m) => m[1]),
	new Lexeme('fareBasis', mkReg([/^(?:\/)*@([A-Z][A-Z0-9]*)/, end])).map((m) => m[1]),
	new Lexeme('ticketingDate', mkReg([/^(?:\/)*T(\d{1,2}[A-Z]{3}\d{2})/, end])).map((m) => parseDate(m[1])),

	new Lexeme('validated', /^V(?![A-Z])/).map((m) => parseDate(m[1])).hasConstraint(isPositional),
	new Lexeme('travelDate', /^(\d{1,2}[A-Z]{3})/).map((m) => parseDate(m[1])).hasConstraint(isPositional),
	new Lexeme('cityPair', /^([A-Z]{3})([A-Z]{3})/).map((m) => ({
		departureAirport: m[1], destinationAirport: m[2],
	})).hasConstraint(isPositional),
	new Lexeme('travelDate', /^(\d{1,2}[A-Z]{3}\d{2})/).map((m) => parseDate(m[1])).hasConstraint(isPositional),
];

const parseTariffMods = (modsPart) => {
	const lexer = new Lexer(lexemes_fareSearch);
	const lexOptions = [];
	for (const lexed of lexer.lexCombinations(modsPart, [])) {
		if (!lexed.text.trim()) {
			return lexed;
		} else {
			lexOptions.push(lexed);
		}
	}
	return lexOptions.sort((a,b) => a.textLeft - b.textLeft)[0]
		|| {text: modsPart, lexemes: []};
};

const Parse_fareSearch = (cmd) => {
	if (!cmd.startsWith('$D')) {
		return null;
	}
	const modsPart = cmd.slice('$D'.length);
	const lexed = parseTariffMods(modsPart);

	const result = {};
	const modifiers = [];
	for (const lexeme of lexed.lexemes) {
		if (lexeme.lexeme === 'travelDate') {
			if (!result.departureDate) {
				result.departureDate = lexeme.data;
			} else if (!result.returnDate) {
				result.returnDate = lexeme.data;
			} else {
				// matches three dates, likely a typo
				return null;
			}
		} else if (lexeme.lexeme === 'validated') {
			if (!result.validated) {
				result.validated = true;
			} else {
				// 2 "V" modifiers, likely a typo
				return null;
			}
		} else if (lexeme.lexeme === 'cityPair') {
			if (!result.departureAirport) {
				result.departureAirport = lexeme.data.departureAirport;
				result.destinationAirport = lexeme.data.destinationAirport;
			} else {
				// 4 city codes matched, likely some wrong text matched
				return null;
			}
		} else {
			modifiers.push({
				type: lexeme.lexeme,
				raw: lexeme.raw,
				parsed: lexeme.data,
			});
		}
	}
	result.modifiers = modifiers;
	result.unparsed = lexed.text;

	return result;
};

Parse_fareSearch.getCabinClasses = getCabinClasses;

module.exports = Parse_fareSearch;
