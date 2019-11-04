const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');
const FcParser = require('../../agnostic/fare_calculation/FcParser.js');

/**
 * parse output of >F*Q; which shows Fare Calculation-s of current pricing
 * output example:
 * 'FQ-1 G13MAR18      ADT'
 * '  KIV PS X/IEV PS RIX 603.79D1EP4 NUC603.79END ROE0.844659'
 * '  FARE EUR 510.00 EQU USD 628.00 TAX JQ 3.10 TAX MD 11.10 TAX'
 * '  WW 7.60 TAX UA 4.00 TAX YK 8.50 TAX YQ 18.00 TAX YR 28.40 TOT'
 * '  USD 708.70'
 * 'FQ-2 G13MAR18      C03'
 * '  KIV PS X/IEV PS RIX 452.84D1EP4/CH25 NUC452.84END ROE0.844659'
 * '  FARE EUR 383.00 EQU USD 471.00 TAX JQ 3.10 TAX MD 11.10 TAX'
 * '  WW 7.60 TAX UA 4.00 TAX YK 8.50 TAX YQ 18.00 TAX YR 28.40 TOT'
 * '  USD 551.70'
 * 'FQ-3-4 G13MAR18      ADT'
 * '  KIV PS X/IEV PS RIX 603.79D1EP4 NUC603.79END ROE0.844659'
 * '  FARE EUR 510.00 EQU USD 628.00 TOT USD 628.00'
 */
class LinearFareParser {
	/** @param query = '1-3' || '1.3' || '1-3.5-6.8' */
	static parsePaxNums(query) {
		return ParserUtil.parseRange(query, '.', '-');
	}

	// 'FQ-1.3 G13MAR18      ADT       '
	// 'FQ-3-4 G13MAR18      ADT'
	// 'FQ-2 G13MAR18      C03'
	static parseFqLine(line) {
		const regex =
			'\/^FQ-' +
			'(?<paxNums>\\d[-.0-9]*)\\s+' +
			'(?<fareTypeCode>[A-Z])' +
			'(?<addedDate>\\d{2}[A-Z]{3}\\d{2})\\s+' +
			'(?<ptc>[A-Z0-9]{3})' +
			'/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			return {
				passengerNumbers: this.parsePaxNums(matches.paxNums),
				fareTypeCode: matches.fareTypeCode,
				addedDate: ParserUtil.parse2kDate(matches.addedDate),
				ptc: matches.ptc,
			};
		} else {
			return null;
		}
	}

	// be careful, it may seem similar to Apollo's FARE line, but there is a difference - tax code goes _before_ amount
	// 'FARE EUR 383.00 EQU USD 471.00 TAX JQ 3.10 TAX MD 11.10 TAX WW 7.60 TAX UA 4.00 TAX YK 8.50 TAX YQ 18.00 TAX YR 28.40 TOT USD 551.70'
	// 'FARE EUR 510.00 EQU USD 628.00 TOT USD 628.00'
	static parseFareBreakdown(line) {
		const taxPattern = 'TAX\\s+([A-Z0-9]{2})\\s*(\\d*\\.\\d+|EXEMPT\\s+)\\s+';
		const regex =
			'/^(?<fcText>.*)\\s+FARE\\s+' +
			'(?<baseCurrency>[A-Z]{3})\\s+' +
			'(?<baseAmount>\\d*\\.?\\d+)\\s+' +
			'(EQU\\s+' +
			'(?<equivalentCurrency>[A-Z]{3})\\s+' +
			'(?<equivalentAmount>\\d*\\.?\\d+)\\s+' +
			')?' +
			'(?<taxList>(?:' + taxPattern + ')*)TOT\\s+' +
			'(?<totalCurrency>[A-Z]{3})\\s+' +
			'(?<totalAmount>\\d*\\.\\d+)' +
			'\\s*$/s';
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
				taxes: taxMatches.map((tuple) => {
					let [, taxCode, amount] = tuple;
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

	// 'FQ-3-4 G13MAR18      ADT'
	// '  KIV PS X/IEV PS RIX 603.79D1EP4 NUC603.79END ROE0.844659'
	// '  FARE EUR 510.00 EQU USD 628.00 TOT USD 628.00'
	static parsePtcBlock(lines) {
		lines = [...lines];
		const fqLine = lines.shift();
		if (!fqLine) { return null; }

		const fqData = this.parseFqLine(fqLine);
		if (!fqData) { return null; }

		const unindented = [];
		let line;
		while (line = php.array_shift(lines)) {
			let matches;
			if (php.preg_match(/^[ ]{1,2}(.*)$/, line, matches = [])) {
				unindented.push(matches[1]);
			} else {
				php.array_unshift(lines, line);
				break;
			}
		}
		const linearFareText = unindented.join('\n');

		const breakdown = this.parseFareBreakdown(linearFareText);
		if (!breakdown) {
			fqData.error = 'Failed to parse Fare Breakdown';
			return [fqData, lines];
		}
		const fc = FcParser.parse(breakdown.fcText);
		if (fc.error) {
			fqData.error = 'Failed to parse FC - ' + fc.error;
			return [fqData, lines];
		}
		const ptcBlock = {
			passengerNumbers: fqData.passengerNumbers,
			fareTypeCode: fqData.fareTypeCode,
			addedDate: fqData.addedDate,
			ptc: fqData.ptc,
			fareConstruction: fc.parsed,
			baseFare: breakdown.baseFare,
			fareEquivalent: breakdown.fareEquivalent,
			taxes: breakdown.taxes,
			netPrice: breakdown.netPrice,
		};
		return [ptcBlock, lines];
	}

	static parse(dump) {
		let linesLeft = dump.split('\n');
		const ptcBlocks = [];
		let tuple;
		while (tuple = this.parsePtcBlock(linesLeft)) {
			const [ptcBlock, left] = tuple;
			ptcBlocks.push(ptcBlock);
			linesLeft = left;
		}
		if (php.empty(ptcBlocks)) {
			return {error: 'Unexpected start of dump - ' + linesLeft[0]};
		}
		const getError = (block) => block.error;
		const errors = php.array_filter(ptcBlocks.map(getError));
		if (!php.empty(errors)) {
			const error = 'Failed to parse ' + Object.keys(errors).join(', ') +
				'-th F*Q block FC - ' + errors.join('; ');
			return {error};
		} else {
			return {ptcBlocks, linesLeft};
		}
	}
}

module.exports = LinearFareParser;
