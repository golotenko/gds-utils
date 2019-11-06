const ParserUtil = require('../../agnostic/ParserUtil.js');
const BagAllowanceParser = require('./BagAllowanceParser.js');
const PhToNormalPricing = require('../../../format_adapters/PhToNormalPricing.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');
const PricingCommonHelper = require('./PricingCommonHelper.js');
const PhPricingParser = require('./PhPricingParser.js');

/**
 * parses >WP; - Sabre pricing output
 */
const parseRebookSegmentsStr = segListStr => {
	return segListStr.split(' ').map(token => {
		const segmentNumber = token.slice(0, -1);
		const bookingClass = token.slice(-1);
		return {segmentNumber, bookingClass};
	});
};

const popRebookLine = lines => {
	const footerInfoLine = lines.pop();
	const match = footerInfoLine.match(/^CHANGE BOOKING CLASS -\s*(.*?)\s*$/);
	if (match) {
		return parseRebookSegmentsStr(match[1]);
	} else {
		lines.push(footerInfoLine);
		return [];
	}
};

class WpPricingParser {
	static detectErrorResponse(dump) {
		const nameByPattern = {
			'NO COMBINABLE FARES FOR CLASS USED.*': 'noData',
			'NO FARE FOR CLASS USED.*': 'noData',
			'NO PUBLIC FARES VALID FOR PASSENGER TYPE\\/CLASS OF SERVICE\\s*\\.\\s*': 'noData',
			'.*CHK DATE\\/TIME CONTINUITY OF FLTS.*': 'checkTimeContinuityOfFlights',
			'UNABLE PAST DATE SEGMENT USE SEGMENT SELECT': 'segmentDateIsInPast',
			'.*SEG STATUS NOT ALLOWED.*': 'badSegmentStatus',
			'FORMAT, CHECK SEGMENT NUMBER.*': 'badSegmentNumber',
		};

		for (const [pattern, errorName] of Object.entries(nameByPattern)) {
			if (php.preg_match('/^' + pattern + '$/s', php.trim(dump))) {
				return errorName;
			}
		}
		if (!php.preg_match(/\n.*\n/, dump.trim())) {
			// output is less than three lines
			return 'customGdsError';
		}

		return null;
	}

	static splitLinesByPattern(lines, pattern, includeDelimiter) {
		const idxs = lines.flatMap((line, i) => {
			return !php.preg_match('/' + pattern + '/', line) ? [] : [i];
		});

		const result = [];
		for (const i of idxs.reverse()) {
			const portion = php.array_splice(lines, i);
			if (!includeDelimiter) {
				portion.shift();
			}
			result.push(portion);
		}
		if (php.count(lines) > 0) {
			result.push(lines);
		}

		return result.reverse();
	}

	static parseFareConstruction(lines) {
		const fcLines = [];
		let line;
		while (line = php.array_shift(lines)) {
			if (line.startsWith(' ')) {
				fcLines.push(php.substr(line, php.mb_strlen(' ')));
			} else {
				php.array_unshift(lines, line);
				break;
			}
		}

		let parsed = PricingCommonHelper.parseFareConstructionLines(fcLines);
		if (php.isset(parsed.error) || parsed.textLeft) {
			// sometimes Sabre implies lines are split by spaces, not empty spaces
			const fullLine = php.implode(' ', fcLines);
			parsed = PricingCommonHelper.parseFareConstructionLines([fullLine]);
		}

		return [parsed, lines];
	}

	static parsePtcBlock(lines) {
		let baggageInfo = null;
		let fbLine = php.array_shift(lines);
		if (!fbLine) {
			return null;
		}
		const nextLine = php.count(lines) > 0 ? lines[0] : '';

		// For cases when fare basis summary "line" spans multiple lines due to wrapping
		// ADT-01  TLXZ90M7F/DIF4 SQW8C1B4 SQX8C1B4 TLXZ90M7F/DIF4
		//        OLWZ90B7
		if (nextLine.startsWith('      ')) {
			fbLine += ' ' + nextLine;
			lines.shift();
		}
		const fareBasisInfo = PricingCommonHelper.parseFareBasisSummary(fbLine);
		if (!fareBasisInfo) {
			lines.unshift(fbLine);
			return null;
		}

		let fareConstruction;
		[fareConstruction, lines] = this.parseFareConstruction(lines);
		const fareConstructionInfoLines = [];
		let rebookSegments = [];
		let baggageInfoDumpLines = [];
		let line;
		while (line = lines.shift()) {
			if (!line.startsWith('BAG ALLOWANCE')) {
				fareConstructionInfoLines.push(line);
			} else {
				lines.unshift(line);
				rebookSegments = popRebookLine(lines);
				baggageInfoDumpLines = lines;
				baggageInfo = BagAllowanceParser.parse(lines);
				break;
			}
		}

		return {
			fareBasisInfo,
			fareConstruction,
			fareConstructionInfo: PricingCommonHelper.parseFareConstructionInfo(fareConstructionInfoLines, true),
			baggageInfo,
			baggageInfoDump: !baggageInfoDumpLines ? null :
				baggageInfoDumpLines.join('\n'),
			rebookSegments,
		};
	}

	/**
	 * @param string headersLine:
	 * "       BASE FARE                 TAXES/FEES/CHARGES    TOTAL"
	 * "       BASE FARE      EQUIV AMT  TAXES/FEES/CHARGES    TOTAL"
	 * @param string line:
	 * "          370.00                    582.16            952.16TTL"
	 * "           35.00          39.00                        39.00TTL"
	 */
	static parseTotalFareLine(line, headersLine) {
		const withEquiv = php.preg_match(/EQUIV AMT/, headersLine);
		const regex = '/^\\s*' +
			'(?<baseFare>\\d*\\.?\\d+)\\s*' +
			(withEquiv ? '(?<inDefaultCurrency>\\d*\\.?\\d+)\\s*' : '') +
			'((?<tax>\\d*\\.?\\d+)\\s+)?' +
			'(?<total>\\d*\\.?\\d+)TTL\\s*$' +
			'/';

		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			return {
				baseFare: matches.baseFare,
				inDefaultCurrency: matches.inDefaultCurrency,
				tax: matches.tax,
				total: matches.total,
			};
		} else {
			return null;
		}
	}

	static parseDatesLine(line) {
		const regex =
			'/^' +
			'(?<departureDate>\\d{2}[A-Z]{3})\\sDEPARTURE\\sDATE-+' +
			'LAST\\sDAY\\sTO\\sPURCHASE\\s(?<lastDateToPurchase>\\d{1,2}[A-Z]{3})/' +
			'(?<lastTimeToPurchase>\\d{1,4})' +
			'$/';

		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			return {
				departureDate: {
					raw: matches.departureDate,
					parsed: ParserUtil.parsePartialDate(matches.departureDate),
				},
				lastDateToPurchase: {
					raw: matches.lastDateToPurchase,
					parsed: ParserUtil.parsePartialDate(matches.lastDateToPurchase),
				},
				lastTimeToPurchase: {
					raw: matches.lastTimeToPurchase,
					parsed: ParserUtil.decodeGdsTime(matches.lastTimeToPurchase),
				},
			};
		} else {
			return null;
		}
	}

	static parseMainSection(lines) {
		lines = [...lines];

		let headersLine = lines.shift();
		const dates = this.parseDatesLine(headersLine);
		if (dates) {
			headersLine = lines.shift();
		}
		if (!php.preg_match(/BASE\s+FARE.*TAX.*TOTAL/, headersLine)) {
			return {error: 'Failed to parse pricing header - ' + headersLine};
		}

		const fares = [];
		let fareInfo;
		[fareInfo, lines] = PricingCommonHelper.parseFareInfo(lines);
		while (fareInfo !== null) {
			fares.push(fareInfo);
			[fareInfo, lines] = PricingCommonHelper.parseFareInfo(lines);
		}

		const totalsLine = php.array_shift(lines);
		if (!totalsLine) {
			return {error: 'Unexpected end of totals block'};
		}
		const faresSum = this.parseTotalFareLine(totalsLine, headersLine);
		const pqBlocks = this.splitLinesByPattern(lines, '^([A-Z0-9]{3})-(\\d{2})  (.*)$', true);
		const pqList = pqBlocks.map(b => this.parsePtcBlock(b));

		return {dates, fares, faresSum, pqList};
	}

	static parse(dump) {
		let error;
		const asPh = PhPricingParser.parse(dump);
		if (!asPh.error) {
			return PhToNormalPricing(asPh);
		}
		if (error = this.detectErrorResponse(dump)) {
			return {error, dump};
		}
		let lines = dump.split('\n');
		const endLine = lines.pop();
		if (endLine.trim() !== '.') {
			lines.push(endLine);
		}
		let dataExistsInfo;
		[lines, dataExistsInfo] = PricingCommonHelper.parseDataExists(lines); // note - parses from the end

		const sections = this.splitLinesByPattern(lines, '^\\s*$').filter(s => !php.empty(s));
		let firstSection = sections.shift();
		const wasPqRetained = firstSection.join('\n').trim() === 'PRICE QUOTE RECORD RETAINED';
		if (wasPqRetained) {
			firstSection = sections.shift();
		}

		// there may be unexpected empty lines that split main section
		let continuation = [];
		let mainSection;
		do {
			firstSection = [...firstSection, ...continuation];
			mainSection = this.parseMainSection(firstSection);
		} while (
			php.isset(mainSection.error) &&
			!php.empty(continuation = sections.shift())
		);

		if (error = mainSection.error) {
			return {error};
		} else {
			mainSection.additionalInfo = sections;
			mainSection.dataExistsInfo = dataExistsInfo;
			mainSection.wasPqRetained = wasPqRetained;
			mainSection.displayType = 'regularPricing';

			const lastRebookSegments = sections.flatMap(popRebookLine);
			mainSection.pqList.slice(-1).forEach(lastPq => lastPq
				.rebookSegments.push(...lastRebookSegments));

			return mainSection;
		}
	}
}

module.exports = WpPricingParser;
