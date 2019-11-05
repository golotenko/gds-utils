const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

class CarLineParser {
	static isCarLine(line) {
		const filter = '/^' +
			'\\s{0,2}' +
			'(?<lineNumber>\\d{1,2})\\s' +
			'[\\\/\\*]?(?<type>CCR)\\s+' +
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
		const parsedData = {};
		const data = context.split('/');
		const carTypeCode = data.shift();

		for (const [key, value] of Object.entries(data)) {
			if (value.startsWith('RG-')) {
				parsedData.rates = this.parseRates(value);
				delete data[key];
			} else if (value.startsWith('CF-')) {
				parsedData.confirmationNumber = php.rtrim(value.slice('CF-'.length), ' *');
				delete data[key];
			}
		}

		return {
			carTypeCode: carTypeCode,
			unparsedCodes: php.array_values(data),
			parsedCodes: parsedData,
		};
	}

	// 'RG-EUR 38.00- .00 UNL DY
	// 'RG-*EP*EUR152.17-0.00 UNL DY
	// 'RG-*HA*DKK500.00-100F 2.50 K DY
	// 'RG-EUR 160.00- .00 UNL WY 23.00- UNL XD'
	static parseRates(rawRates) {
		const filter = '/' +
			'(?<dataType>RG)-' +
			'(\\*(?<vendorMarker>[A-Z\\d]{2})\\*)?' +
			'(?<currency>[A-Z]{3})\\s*' +
			'(?<amount>[\\d\\.]+)' +
			'(?<unparsedData>.+)' +
			'$/s';

		const result = {};
		let matches;
		if (php.preg_match(filter, rawRates, matches = [])) {
			for (const [key, value] of Object.entries(matches)) {
				if (!php.is_numeric(key)) {
					result[key] = value;
				}
			}
		}
		return result;
	}

	//   6 CCR SX HK1 FRA 13MAY 16MAY ECMN/BS-00000000/ARR-1200/RC-SD-XEU/RG-EUR 38.00- .00 UNL DY/RT-0900/CF- **SEE RTSVCC**
	static parse(line) {
		line = line.trim().replace(/ {4}/g, ' ');
		line = php.preg_replace('/\\s?\/\\s?/', '/', line);
		const filter = '/^' +
			'(?<lineNumber>\\d{1,2})\\s*' +
			'[\\\/\\*]?(?<type>CCR)\\s+' +
			'(?<vendorCode>[A-Z\\d]{2})?\\s*' +
			'(?:(?<segmentStatus>[A-Z]{2})(?<statusNumber>\\d{0,2}))?\\s*' +
			'(?<city>[A-Z]{3})\\s+' +
			'(?<startDate>\\d{1,2}[A-Z]{3})\\s+' +
			'(?<endDate>\\d{1,2}[A-Z]{3})\\s+' +
			'(?<context>.+?)\\s*' +
			'(?<marker>\\*[A-Z]{2}\\+)?\\s*' +
			'(?<seeInfo>\\s*\\**SEE\\s[A-Z\\d]+.+)?' +
			'$/s';

		let result = {};
		let matches;
		if (php.preg_match(filter, line, matches = [])) {
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
			const error = 'ERROR: Failed to parse car line - ' + line;
			return {error};
		}
		return result;
	}
}

module.exports = CarLineParser;
