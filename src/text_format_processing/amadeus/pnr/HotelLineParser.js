const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

class HotelLineParser {
	static isHhlLine(line) {
		const filter = '/^' +
			'\\s{0,2}' +
			'(?<lineNumber>\\d{1,2})\\s' +
			'[\\\/\\*]?(?<type>HHL)\\s+' +
			'(?<vendor>[A-Z\\d]{2})?\\s*' +
			'(?:(?<status>[A-Z]{2})(?<statusNumber>\\d{0,2}))?\\s*' +
			'(?<content>.+)' +
			'/s';
		if (php.preg_match(filter, line)) {
			return true;
		}
		return null;
	}

	static parseDate(date) {

		return {
			raw: date,
			parsed: ParserUtil.parsePartialDate(date),
		};
	}

	static parseContext(context) {
		const data = context.split('/');
		return {
			hotelName: data.shift(),
			unparsedCodes: data,
		};
	}

	static parse(line) {
		line = line.trim().replace(/ {4}/g, ' ');
		line = php.preg_replace('/\\s?\\\/\\s?/', '/', line);

		const filter = '/^' +
			'(?<lineNumber>\\d{1,2})\\s' +
			'[\\\/\\*]?(?<type>HHL)\\s+' +
			'(?<vendorCode>[A-Z\\d]{2})?\\s*' +
			'(?:(?<segmentStatus>[A-Z]{2})(?<roomCount>\\d{0,2}))?\\s*' +
			'(?<city>[A-Z]{3})\\s+' +
			'IN(?<startDate>\\d{1,2}[A-Z]{3})\\s+' +
			'OUT(?<endDate>\\d{1,2}[A-Z]{3})\\s+' +
			'(?<occupancy>[A-Z\\d]{7})\\s+' +
			'(?<currency>[A-Z]{3})' +
			'(?<amount>[\\d\\.]+)\\s+' +
			'(?<rateType>[A-Z]{3})\\s*' +
			'(?<context>.+?)\\s*' +
			'(?<vendorMarker>\\*[A-Z]{2}\\+)?\\s*' +
			'(?<seeInfo>\\s*\\**SEE\\s[A-Z\\d]+.+)?' +
			'$/s';
		let matches;
		let result = {};
		if (php.preg_match(filter, line, matches = {})) {
			for (const [key, value] of Object.entries(matches)) {
				if (!php.is_numeric(key)) {
					if (key === 'startDate' || key === 'endDate') {
						result[key] = this.parseDate(value);
					} else if (key === 'context') {
						result = {...result, ...this.parseContext(value)};
					} else {
						result[key] = value;
					}
				}
			}
		}
		if (php.empty(result)) {
			const error = 'ERROR: Failed to parse hotel line - ' + line;
			return {error};
		}
		return result;
	}
}

module.exports = HotelLineParser;
