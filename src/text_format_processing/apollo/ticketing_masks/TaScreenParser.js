
/**
 * parses output of >$TA{ptcNumber}/{storeNumber}
 * it is tax breakdown of a manual pricing
 */
const php = require('enko-fundamentals/src/Transpiled/php.js');

class TaScreenParser {
	// 'T1 ;   11.20;AY T2 ;   36.00;US T3 ;    3.96;XA T4 ;   13.50;XF',
	// 'T13;........;.. T14;........;.. T15;........;.. T16;........;..',
	static parseTaxLine(line) {
		const taxList = [];
		const taxPattern = 'T\\d+\\s*;\\s*(\\d*\\.?\\d+|\\.+);([A-Z0-9]{2}|\\.{2})\\s*';
		let matches;
		if (php.preg_match('/\\s*((?:' + taxPattern + ')+)\\s*$/', line, matches = [])) {
			let taxTokens;
			php.preg_match_all('/' + taxPattern + '/', matches[1], taxTokens = [], php.PREG_SET_ORDER);
			for (const [, amount, taxCode] of Object.values(taxTokens)) {
				if (taxCode !== '..') {
					taxList.push({taxCode, amount});
				}
			}
		} else {
			return null;
		}

		return taxList;
	}

	// ' FARE  USD  302.00 TTL USD ;  645.16          ROE ;............',
	// ' EQUIV CAD  150.00 TTL CAD ;........          ROE ;............',
	static parseSummaryLine(line) {
		let matches;

		const regex =
			'\/^\\s*' +
			'(FARE\\s+' +
			'(?<baseFareCurrency>[A-Z]{3})\\s*' +
			'(?<baseFareAmount>\\d*\\.?\\d+)\\s*' +
			'|EQUIV\\s+' +
			'(?<fareEquivalentCurrency>[A-Z]{3})\\s*' +
			'(?<fareEquivalentAmount>\\d*\\.?\\d+)\\s*' +
			')' +
			'TTL\\s+' +
			'(?<netPriceCurrency>[A-Z]{3})\\s*;?\\s*' +
			'(?<netPriceAmount>\\d*\\.?\\d+|\\.+)\\s*' +
			'\/';

		if (php.preg_match(regex, line, matches = [])) {
			return {
				fareEquivalent: !matches.fareEquivalentCurrency ? null : {
					currency: matches.fareEquivalentCurrency,
					amount: matches.fareEquivalentAmount,
				},
				baseFare: !matches.baseFareCurrency ? null : {
					currency: matches.baseFareCurrency,
					amount: matches.baseFareAmount,
				},
				netPrice: {
					currency: matches.netPriceCurrency,
					amount: matches.netPriceAmount
						.replace(/^\.+/, '')
						.replace(/\.$/, ''),
				},
			};
		} else {
			return {regex, line};
			//return null;
		}
	}

	static parse(dump) {
		const lines = dump.split('\n');
		const header = lines.shift();
		if (!header.includes('TAX BREAKDOWN SCREEN')) {
			return {error: 'Unexpected start of dump - ' + php.trim(header)};
		}

		const summaryLine = lines.shift();
		const result = this.parseSummaryLine(summaryLine);
		if (!result) {
			return {error: 'Failed to parse summary line - ' + summaryLine.trim()};
		}

		const taxList = [];
		let line;
		while (line = lines.shift()) {
			const taxChunk = this.parseTaxLine(line);
			if (taxChunk) {
				taxList.push(...taxChunk);
			} else if (taxChunk !== []) {
				lines.unshift(line);
				break;
			}
		}
		result.taxList = taxList;
		result.unparsedLines = lines;

		// could also parse facility charges if we ever need them

		return result;
	}
}

module.exports = TaScreenParser;
