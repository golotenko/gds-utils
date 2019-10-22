const ParserUtil = require('../../agnostic/ParserUtil.js');
const Lexeme = require('../../../lexer/Lexeme.js');
const Lexer = require('../../../lexer/Lexer.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');

const getCabinClasses = () => {
	return {
		premium_first: 'PB',
		premium_business: 'JB',
		premium_economy: 'SB',
		first: 'FB',
		business: 'BB',
		economy: 'YB',
		upper: 'FBBB',
	};
};

const parseDate = (raw) => {
	return !raw ? null : {
		raw: raw,
		partial: ParserUtil.parsePartialDate(raw),
		full: ParserUtil.parse2kDate(raw).parsed,
	};
};

const parseMods = (modsPart) => {
	const getFirst = (matches) => matches[1];
	const parseDate = (matches) => parseDate(matches[1]);
	const end = '(?![A-Z0-9])';
	const lexer = new Lexer([
		(new Lexeme('returnDate', '/^¥R(\\d{1,2}[A-Z]{3}\\d{0,2})' + end + '/')).preprocessData(parseDate),
		(new Lexeme('currency', '/^\\\/([A-Z]{3})' + end + '/')).preprocessData(getFirst),
		(new Lexeme('tripType', '/^¥(RT|OW)' + end + '/')).preprocessData(getFirst),
		(new Lexeme('cabinClass', '/^(' + php.implode('|', php.array_values(getCabinClasses())) + ')' + end + '/')).preprocessData((matches) => {
			return (php.array_flip(getCabinClasses()) || {})[matches[1]];
		}),
		(new Lexeme('fareType', '/^¥(PV|PL)' + end + '/')).preprocessData((matches) => {
			return {
				PV: 'private', PL: 'public',
			}[matches[1]];
		}),
		(new Lexeme('accountCode', '/^¥RR\\*([A-Z0-9]+)' + end + '/')).preprocessData(getFirst),
		(new Lexeme('ptc', '/^¥P([A-Z][A-Z0-9]{2})' + end + '/')).preprocessData(getFirst),
		(new Lexeme('fareBasis', '/^¥Q([A-Z][A-Z0-9]*)' + end + '/')).preprocessData(getFirst),
		(new Lexeme('airlines', '/^(-[A-Z0-9]{2})+' + end + '/')).preprocessData((matches) => {
			return php.explode('-', php.ltrim(matches[0], '-'));
		}),
		(new Lexeme('bookingClass', /^¥B([A-Z])/)).preprocessData(getFirst),
	]);
	return lexer.lex(modsPart);
};

/**
 * parses Tariff Display command like
 * >FQ07JUN18MEMLAS10AUG18¥PADT-AA¥PL¥BG;
 * cmd type 'fareSearch'
 */
const Parse_fareSearch = (cmd) => {
	let matches, departureAirport, destinationAirport, departureDate, modsPart;
	let issueDate = null;
	if (php.preg_match(/^FQ([A-Z]{3})([A-Z]{3})(\d{1,2}[A-Z]{3}\d{0,2})(.*)$/, cmd, matches = [])) {
		[, departureAirport, destinationAirport, departureDate, modsPart] = matches;
	} else if (php.preg_match(/^FQ(\d{1,2}[A-Z]{3}\d{0,2})([A-Z]{3})([A-Z]{3})(\d{1,2}[A-Z]{3}\d{0,2})(.*)$/, cmd, matches = [])) {
		[, issueDate, departureAirport, destinationAirport, departureDate, modsPart] = matches;
	} else {
		return null;
	}
	const lexed = parseMods(modsPart);
	return {
		departureDate: parseDate(departureDate),
		ticketingDate: parseDate(issueDate),
		departureAirport: departureAirport,
		destinationAirport: destinationAirport,
		modifiers: lexed.lexemes.map((rec) => ({
			type: rec.lexeme,
			raw: rec.raw,
			parsed: rec.data,
		})),
		unparsed: lexed.text,
	};
};

Parse_fareSearch.getCabinClasses = getCabinClasses;

module.exports = Parse_fareSearch;
