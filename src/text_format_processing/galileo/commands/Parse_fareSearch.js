const Parse_apollo_priceItinerary = require('../../apollo/commands/Parse_priceItinerary.js');
const ParserUtil = require('../../agnostic/ParserUtil.js');
const Parse_apollo_fareSearch = require('../../apollo/commands/Parse_fareSearch.js');
const Lexeme = require('../../../lexer/Lexeme.js');
const Lexer = require('../../../lexer/Lexer.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');
const {mkReg} = require('enko-fundamentals/src/Utils/Misc.js');

const parseDate = (raw) => {
	return !raw ? null : {
		raw: raw,
		partial: ParserUtil.parsePartialDate(raw),
		full: ParserUtil.parse2kDate(raw).parsed,
	};
};

const getFirst = (matches) => matches[1];
const parseDateToken = (matches) => parseDate(matches[1]);
const endReg  = /(?![A-Z0-9])/;
const end  = endReg.source;

const lexer = new Lexer([
	(new Lexeme('accountCodes', mkReg([/^-PRI((-[A-Z0-9]+)*)/, endReg])))
		.map((matches) => matches[1] ? php.ltrim(matches[1], '-').split('-') : []),
	(new Lexeme('tripType', mkReg([/^-(RT|OW)/, endReg]))).map(getFirst),
	(new Lexeme('bookingClass', mkReg([/^-([A-Z])/, endReg]))).map(getFirst),
	(new Lexeme('cabinClass', '/^@([A-Z])'+ end +'/'))
		.map((matches) => (Parse_apollo_fareSearch.getCabinClasses() || {})[matches[1]]),
	(new Lexeme('fareBasis', '/^@([A-Z][A-Z0-9]*)'+ end +'/')).map(getFirst),
	(new Lexeme('airlines', '/^(\\\/[A-Z0-9]{2})+'+ end +'/'))
		.map((matches) => php.explode('/', php.ltrim(matches[0], '/'))),
	(new Lexeme('ticketingDate', '/^\\.T(\\d{1,2}[A-Z]{3}\\d*)'+ end +'/')).map(parseDateToken),
	(new Lexeme('allianceCode', '/^\\\/\\\/\\*([A-Z])'+ end +'/')).map(getFirst),
	(new Lexeme('currency', '/^:([A-Z]{3})'+ end +'/')).map(getFirst),
	(new Lexeme('fareType', '/^:([A-Z])'+ end +'/'))
		.map((matches) => Parse_apollo_priceItinerary.decodeFareType(matches[1])),
	(new Lexeme('ptc', '/^\\*([A-Z0-9]{3})'+ end +'/')).map(getFirst),
	// base mods follows (may preceed a letter)
	(new Lexeme('dates', '/^(\\d{1,2}[A-Z]{3}\\d{0,2})/')).map(matches => ({
		departureDate: parseDate(matches[1]),
	})),
	(new Lexeme('dates', '/^V(\\d{1,2}[A-Z]{3}\\d{0,2}?)(\\d{1,2}[A-Z]{3}\\d{0,2})/')).map(matches => ({
		departureDate: parseDate(matches[1]),
		returnDate: parseDate(matches[2]),
	})),
	(new Lexeme('airports', '/^([A-Z]{3}|)([A-Z]{3})/')).map(matches => ({
		departureAirport: matches[1],
		destinationAirport: matches[2],
	})),
]);

const Parse_fareSearch = (cmd) => {
	let matches;
	if (php.preg_match(/^FD(?<modsPart>.*)$/, cmd, matches = {})) {
		const lexed = lexer.lex(matches.modsPart);
		const modifiers = lexed.lexemes.map((rec) => ({
			type: rec.lexeme, raw: rec.raw, parsed: rec.data,
		}));

		// code expects them to be separate from rest modifiers
		const baseModNames = new Set(['dates', 'airports']);
		const baseData = {};
		modifiers.filter(m => baseModNames.has(m.type))
			.forEach(m => Object.assign(baseData, m.parsed));

		return {
			departureDate: baseData.departureDate || null,
			returnDate: baseData.returnDate || null,
			departureAirport: baseData.departureAirport || '',
			destinationAirport: baseData.destinationAirport || '',
			modifiers: modifiers.filter(m => !baseModNames.has(m.type)),
			unparsed: lexed.text,
		};
	} else {
		return null;
	}
};

module.exports = Parse_fareSearch;
