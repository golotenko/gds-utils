const ParserUtil = require('../../agnostic/ParserUtil.js');
const FcParser = require('../../agnostic/fare_calculation/FcParser.js');

const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * parses text block located below a PTC row in *FF1 or *FFALL output
 * example:
 * 'KIV PS X/IEV PS RIX 781.38 NUC781.38END ROE0.844659           '
 * 'FARE EUR660.00 EQU USD813.00 TAX 3.10JQ TAX 11.10MD           '
 * 'TAX 7.60WW TAX 4.00UA TAX 8.50YK TAX 18.00YQ TAX 28.40YR      '
 * 'TOT USD893.70                                                 '
 * '             ***ADDITIONAL FEES MAY APPLY*SEE>FO2;            '
 * 'S1   FB-C1EP4                                                 '
 * '     BG-2PC                                                   '
 * 'S2   FB-C1EP4                                                 '
 * '     BG-2PC                                                   '
 * 'NONEND/RES RSTR/RBK FOC                                       '
 * 'LAST DATE TO PURCHASE TICKET: 10MAY18                         '
 */
class StoredPtcPricingBlockParser {
	/** format is not same as in >F*Q; tax code and amount changed places */
	static parseFareBreakdown(line) {
		const taxPattern = 'TAX\\s+(\\d*\\.\\d+|EXEMPT\\s+)([A-Z0-9]{2})\\s+';
		const regex =
			'/^(?<fcText>.*)\\nFARE\\s+' +
			'(?<baseCurrency>[A-Z]{3})\\s*' +
			'(?<baseAmount>\\d*\\.?\\d+)\\s+' +
			'(EQU\\s+' +
			'(?<equivalentCurrency>[A-Z]{3})\\s*' +
			'(?<equivalentAmount>\\d*\\.?\\d+)\\s+' +
			')?' +
			'(?<taxList>(?:' + taxPattern + ')*)TOT\\s+' +
			'(?<totalCurrency>[A-Z]{3})\\s*' +
			'(?<totalAmount>\\d*\\.\\d+)\\s*\\n' +
			'(?<textLeft>.*)' +
			'/s';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			matches = php.array_filter(matches);
			let taxMatches;
			php.preg_match_all('/' + taxPattern + '/', matches.taxList || '', taxMatches = [], php.PREG_SET_ORDER);
			return {
				fcText: matches.fcText,
				baseFare: {
					currency: matches.baseCurrency,
					amount: matches.baseAmount,
				},
				fareEquivalent: php.isset(matches.equivalentCurrency) ? {
					currency: matches.equivalentCurrency,
					amount: matches.equivalentAmount,
				} : null,
				taxes: Object.values(taxMatches).map((tuple) => {
					let [, amount, taxCode] = tuple;
					if (php.trim(amount) === 'EXEMPT') {
						amount = '0.00';
					}
					return {taxCode, amount};
				}),
				netPrice: {
					currency: matches.totalCurrency,
					amount: matches.totalAmount,
				},
				textLeft: matches.textLeft || '',
			};
		} else {
			return null;
		}
	}

	// 'LAST DATE TO PURCHASE TICKET: 10MAY18                         '
	static parseLastDateToPurchase(line) {
		let rawDate;

		const label = 'LAST DATE TO PURCHASE TICKET: ';
		if (line.startsWith(label)) {
			rawDate = line.slice(label.length).trim();
			return ParserUtil.parse2kDate(rawDate);
		} else {
			return null;
		}
	}

	// 'BG-1PC  NB-20SEP    NA-20SEP                             '
	static parseSegmentValues(raw) {
		const values = [];
		for (const labeled of php.preg_split(/\s+/, raw)) {
			const pair = labeled.split('-');
			if (php.count(pair) !== 2) {
				return [];
			}
			const [code, value] = pair;
			values.push({code, raw: value});
		}
		return values;
	}

	static parseSegmentBlock(linesLeft) {
		//                 'S1   FB-C1EP4/IN25                                            '
		//                 'S2   FB-C1EP4                                                 '
		//                 '     BG-2PC                                                   '
		//                 '     BG-1PC  NB-20SEP    NA-20SEP                             ',
		//                 ' ACCT-TPACK                                     ',
		const segPattern = 'SNN  RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR';
		const segments = [];
		let line;
		while (line = linesLeft.shift()) {
			const split = ParserUtil.splitByPosition(line, segPattern, null, true);
			const segmentNumber = split['N'];
			const isSegmentStart = split['S'] === 'S'
				&& php.preg_match(/^\d+\s*$/, segmentNumber);
			const values = this.parseSegmentValues(split['R']);

			let matches;
			if (php.trim(split[' ']) === '' && values && isSegmentStart) {
				segments.push({segmentNumber, values});
			} else if (php.trim(split[' ']) === '' && values &&
				segments.length > 0 && segmentNumber === '' && split['S'] === ''
			) {
				segments[php.count(segments) - 1].values = php.array_merge(segments[php.count(segments) - 1].values, values);
			} else if (php.preg_match(/^\s*ACCT-(.*?)\s*$/, line, matches = [])) {
				segments[php.count(segments) - 1].values.push({
					code: 'ACCT', raw: matches[1],
				});
			} else {
				php.array_unshift(linesLeft, line);
				break;
			}
		}
		if (!segments) {
			return null;
		}
		const lastDateToPurchaseLine = linesLeft.pop();
		return {
			segments: segments,
			endorsementBoxLines: linesLeft,
			lastDateToPurchase: this.parseLastDateToPurchase(lastDateToPurchaseLine),
		};
	}

	static parseAdditionalInfo(text) {
		const lines = text.split('\n');
		let segmentBlock = null;
		const unparsed = [];
		for (let i = 0; i < lines.length; ++i) {
			const linesLeft = lines.slice(i);
			if (segmentBlock = this.parseSegmentBlock(linesLeft)) {
				break;
			} else {
				unparsed.push(lines[i]);
			}
		}
		return {
			unparsed: unparsed,
			segments: segmentBlock.segments,
			endorsementBoxLines: segmentBlock.endorsementBoxLines,
			lastDateToPurchase: segmentBlock.lastDateToPurchase,
		};
	}

	static unwrapFcText(fcText) {
		const lines = fcText.split('\n');
		// should preserve absence of space on 63-th character
		return lines.join('');
	}

	static parse(dump) {
		const breakdown = this.parseFareBreakdown(dump);
		if (!breakdown) {
			return {error: 'Failed to parse Fare Breakdown', raw: dump};
		}
		const fcText = this.unwrapFcText(breakdown.fcText);
		const fc = FcParser.parse(fcText);
		if (fc.error) {
			return {error: 'Failed to parse FC - ' + fc.error};
		}
		const additionalInfo = this.parseAdditionalInfo(breakdown.textLeft);
		return {
			fareConstruction: fc.parsed,
			baseFare: breakdown.baseFare,
			fareEquivalent: breakdown.fareEquivalent,
			taxes: breakdown.taxes,
			netPrice: breakdown.netPrice,
			additionalMessages: additionalInfo.unparsed,
			segments: additionalInfo.segments,
			endorsementBoxLines: additionalInfo.endorsementBoxLines,
			lastDateToPurchase: additionalInfo.lastDateToPurchase,
		};
	}
}

module.exports = StoredPtcPricingBlockParser;
