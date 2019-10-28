const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

class TktgParser
{
	static parse(dump)  {
		const ticketedRegex =
            '/^TKTG-T/'+
            '(?<agencyCode>[A-Z]{3})'+
            '\\s+'+
            '(?<ticketingDate>\\d{1,2}[A-Z]{3})'+
            '(?<ticketingTime>\\d{3,4})'+
            '(?<timezone>[A-Z]?)'+
            '\\s+'+
            '(?<fpInitials>[A-Z\\d]{2})'+
            '\\s+'+
            'AG'+
            '/';
		let tokens;
		if (php.preg_match(ticketedRegex, dump, tokens = [])) {
			return {
				agencyCode: tokens.agencyCode,
				ticketingDate: {
					raw: tokens.ticketingDate,
					parsed: ParserUtil.parsePartialDate(tokens.ticketingDate),
				},
				ticketingTime: {
					raw: tokens.ticketingTime,
					parsed: ParserUtil.decodeGdsTime(tokens.ticketingTime),
				},
				timezone: {
					raw: tokens.timezone,
					parsed: tokens.timezone === 'Z' ? 'UTC' : null,
				},
				fpInitials: tokens.fpInitials,
			};
		} else if (php.preg_match(/^TKTG-TAU\/(\d{1,2}[A-Z]{3})$/, dump, tokens = [])) {
			const [, tauDate] = tokens;
			return {
				tauDate: {
					raw: tauDate,
					parsed: ParserUtil.parsePartialDate(tauDate),
				},
			};
		} else {
			return null;
		}
	}
}
module.exports = TktgParser;
