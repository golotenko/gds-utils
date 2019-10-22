const ParserUtil = require('../../agnostic/ParserUtil.js');
const Lexeme = require('../../../lexer/Lexeme.js');
const Lexer = require('../../../lexer/Lexer.js');

const {mkReg} = require('enko-fundamentals/src/Utils/Misc.js');

const connReg = mkReg([
	/\/?/,
	/(?<airport>[A-Z]{3})/, // airport
	/(?<minConnectionTimeRange>\d{0,4}(-\d{0,4}|))/,
]);

const baseRegex = mkReg([
	/^1/,
	/(?<scanMark>S?)/,
	/(?<departureDate>\d{1,2}[A-Z]{3})/,
	/(?<departureAirport>[A-Z]{3})/,
	/(?<destinationAirport>[A-Z]{3})/,
	'(',
	// dunno how leading slash affects the meaning, but it surely does...
	/(?<slashConnectionMark>\/?)/,
	/(?<departureTimeRange>(\d+[APMN]?)(-\d+[APMN]?|))/,
	'(?<connectionPart>(', connReg, ')*|)',
	'|)',
	/(?<modsPart>.*)/,
]);

const makeLexer = () => {
	const legRegex = /¥(?<excludeMark>\*?)(?<airlines>([A-Z0-9]{2})*)/;
	return new Lexer([
		new Lexeme('bookingClass', /^-([A-Z])(?![A-Z0-9])/)
			.map((matches) => ({bookingClass: matches[1]})),
		// TODO: add support for alliances, like "¥/*A"
		new Lexeme('legs', mkReg(['^(', legRegex, ')*']))
			.map((matches) => ParserUtil.matchAll(legRegex, matches[0])
				.map(m => ({
					exclude: m.groups.excludeMark === '*',
					airlines: !m.groups.airlines ? [] :
						m.groups.airlines.match(/.{2}/g),
				}))),
	]);
};

/** @param {String} cmd */
const Parse_airAvailability = (cmd) => {
	if (!cmd.startsWith('1') || cmd.startsWith('1*')) {
		return null;
	}

	// this implementation still does not parse a lot of stuff,
	// for example cabin classes - add them if you need them

	const match = cmd.match(baseRegex);
	if (!match) {
		return null;
	} else {
		const groups = match.groups;
		const connectionPart = groups.connectionPart || '';
		const lexed = makeLexer().lex(groups.modsPart);
		return {
			scan: match.groups.scanMark === 'S',
			departureDate: {
				raw: groups.departureDate,
				parsed: ParserUtil.parsePartialDate(groups.departureDate),
			},
			departureAirport: groups.departureAirport,
			destinationAirport: groups.destinationAirport,
			departureTimeRange: !groups.departureTimeRange ? null : {
				raw: groups.departureTimeRange,
			},
			connections: !connectionPart ? [] : connectionPart.split('/')
				.map(token => token.match(connReg).groups)
				.map(groups => ({
					airport: groups.airport,
					minConnectionTimeRange: !groups.minConnectionTimeRange
						? null : {raw: groups.minConnectionTimeRange},
				})),
			modifiers: lexed.lexemes.map(l => ({
				type: l.lexeme,
				raw: l.raw,
				parsed: l.data,
			})),
			unparsed: lexed.text,
		};
	}
};

module.exports = Parse_airAvailability;

