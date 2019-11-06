const ParserUtil = require('../../agnostic/ParserUtil.js');

const BagAllowanceParser = require('./BagAllowanceParser.js');
const {parseSequence, splitByPosition, parseBagAmountCode} = require('../../agnostic/ParserUtil.js');
const PricingCommonHelper = require('./PricingCommonHelper.js');
const FcParser = require('../../agnostic/fare_calculation/FcParser.js');

const parseFlightSegmentLine = (line) => {
	//              'XTPE BR  V   02SEP VLXU            02SEP 02SEP 02P',
	//              " BOM LH  G   11DEC G1                    10DEC 02P",
	const pattern = 'XAAA CC  L   WWWWW IIIIIIIIIIIIIIIIOOOOO EEEEEBBBBB';
	const split = splitByPosition(line, pattern, null, true);

	const date = ParserUtil.parsePartialDate(split['W']);
	const nvbDate = ParserUtil.parsePartialDate(split['O']);
	const nvaDate = ParserUtil.parsePartialDate(split['E']);

	const [fareBasis, ticketDesignator] = split['I'].split('/');
	const result = {
		type: 'flight',
		stopoverIndicator: split['X'] || null, // 'O' = stopover, 'X' = connection
		airport: split['A'],
		airline: split['C'],
		bookingClass: split['L'],
		departureDate: {raw: split['W'], parsed: date},
		fareBasis: fareBasis,
		ticketDesignator: ticketDesignator, // not sure it can happen
		notValidBefore: nvbDate ? {raw: split['O'], parsed: nvbDate} : null,
		notValidAfter: nvaDate ? {raw: split['E'], parsed: nvaDate} : null,
		bagAllowanceCode: parseBagAmountCode(split['B']),
	};
	if (date && split[' '].trim() === '' &&
		result['bookingClass'] &&
		!Object.values(result).some((v) => v === '')
	) {
		return result;
	} else {
		return null;
	}
};

const parseSegmentLine = (line) => {
	const voidMatch = line.trim().match(/^\s*([OX]|)([A-Z]{3})\s*(S U R F A C E|)\s*$/);
	if (voidMatch) {
		const [, stopoverIndicator, airport, surfaceLabel] = voidMatch;
		return {
			type: 'void',
			stopoverIndicator: stopoverIndicator || null,
			airport: airport,
		};
	} else {
		return parseFlightSegmentLine(line);
	}
};

// "FARE  USD   4570.00 EQUIV PHP    239331",
const parseFareLine = (line) => {
	const [, baseCurrency, baseAmount, eqStr] = line
		.match(/^FARE\s+([A-Z]{3})\s*(\d*\.?\d+)\s*(.*)/);
	let fareEquivalent = null;
	if (eqStr) {
		const [, currency, amount] = eqStr.match(/^EQUIV\s+([A-Z]{3})\s*(\d*\.?\d+)/);
		fareEquivalent = {currency, amount};
	}
	return {
		baseFare: {currency: baseCurrency, amount: baseAmount},
		inDefaultCurrency: fareEquivalent,
	};
};

// "TAX   PHP       974US PHP       294AY PHP     17094XT",
// should not match this: 'TOTAL PHP       993',
const parseMainTaxes = (linesLeft) => {
	const mainTaxLine = linesLeft.shift().replace(/^TAX/, '');
	const matches = ParserUtil.matchAll(/\s*([A-Z]{3})\s*(\d*\.?\d+)([A-Z0-9]{2})/, mainTaxLine);
	if (matches.length === 0 || matches[0].index > 0) {
		// no taxes line, possible for infant
		linesLeft.unshift(mainTaxLine);
	}
	const mainTaxes = matches
		.map(([, currency, amount, taxCode]) => ({taxCode, currency, amount}));
	return [mainTaxes, linesLeft];
};

// " LAX LH X/FRA LH BOM M4570.00NUC4570.00END ROE1.00",
const parseFc = (linesLeft) => {
	let fcLines;
	[fcLines, linesLeft] = parseSequence(linesLeft, (l) => {
		const match = l.match(/^ (.*)$/);
		return match ? match[1] : null;
	});
	const fcLine = fcLines.join('\n');
	const fcRecord = FcParser.parse(fcLine);
	const sabreFcRecord = {
		line: fcLine,
		error: fcRecord.error,
		data: fcRecord.parsed,
		textLeft: fcRecord.textLeft,
		tokens: fcRecord.tokens,
	};
	return [sabreFcRecord, linesLeft];
};

// "XT PHP555DE PHP1246RA PHP917YR PHP14140YQ PHP236XFLAX4.5",
const parseXtTaxes = (linesLeft) => {
	let xtLines;
	[xtLines, linesLeft] = parseSequence(linesLeft, (l) => {
		const match = l.match(/^XT\s+(.*)$/);
		return match ? match[1] : null;
	});
	const xtTaxes = xtLines
		.flatMap(xtLine => {
			const matches = ParserUtil.matchAll(/\s*([A-Z]{3})(\d*\.?\d+)([A-Z0-9]{2})((?:[A-Z]{3}\d*\.?\d+)*)\s*/, xtLine);
			return matches.map(([, currency, amount, taxCode, facilityStr]) => {
				const record = {taxCode, currency, amount};
				if (facilityStr) {
					record.facilityCharges = ParserUtil.matchAll(/([A-Z]{3})(\d*\.?\d+)/, facilityStr)
						.map(([, airport, amount]) => ({airport, amount}));
				}
				return record;
			});
		});
	return [xtTaxes, linesLeft];
};

// "ENDOS*SEG1/2*REFUNDABLE",
// "RATE USED 1USD-52.37PHP",
// "ATTN*VALIDATING CARRIER - LH",
// "ATTN*BAG ALLOWANCE     -LAXBOM-02P/LH/EACH PIECE UP TO 50 POUND",
const parseAttn = (linesLeft) => {
	let attnBlockStarted = false;
	let bagBlockStarted = false;
	const infoLines = [];
	const bagLines = [];
	let line;
	while ((line = linesLeft.shift()) !== undefined) {
		if (!line.startsWith('ATTN*')) {
			if (attnBlockStarted) {
				linesLeft.unshift(line); // end of this PTC PQ block
				break;
			} else {
				infoLines.push(line);
			}
		} else {
			attnBlockStarted = true;
			const content = line.slice('ATTN*'.length);
			bagBlockStarted |= content.startsWith('BAG ALLOWANCE');
			if (!bagBlockStarted) {
				infoLines.push(content);
			} else {
				bagLines.push(content);
			}
		}
	}
	return [{
		fareConstructionInfo: PricingCommonHelper.parseFareConstructionInfo(infoLines, true),
		baggageInfo: bagLines.length === 0 ? null : BagAllowanceParser.parse(bagLines),
		baggageInfoDump: bagLines.join('\n'),
	}, linesLeft];
};

// "PSGR TYPE  ADT - 01",
// ...
const parseSingleBlock = (linesLeft) => {
	let line, match;

	line = linesLeft.shift() || '';
	match = line.match(/^PSGR TYPE\s+([A-Z0-9]{2,3})\s*-\s*(\d+)/);
	if (!match) {
		return null;
	}
	const [, ptc, ptcNumber] = match;
	linesLeft.shift(); // '     CXR RES DATE  FARE BASIS      NVB   NVA    BG'

	let segments;
	[segments, linesLeft] = parseSequence(linesLeft, parseSegmentLine);

	const {baseFare, inDefaultCurrency} = parseFareLine(linesLeft.shift());
	let mainTaxes;
	[mainTaxes, linesLeft] = parseMainTaxes(linesLeft);

	const totalLine = linesLeft.shift();
	const totalMatch = totalLine
		.match(/^TOTAL\s+([A-Z]{3})\s*(\d*\.?\d+)\s*(.*)/);
	if (!totalMatch) {
		return null;
	}
	const [, totalCurrency, totalAmount] = totalMatch;

	const fbLine = linesLeft.shift() || '';
	const fareBasisInfo = PricingCommonHelper.parseFareBasisSummary(fbLine);
	if (!fareBasisInfo) {
		return null;
	}
	let fareConstruction;
	[fareConstruction, linesLeft] = parseFc(linesLeft);
	let xtTaxes;
	[xtTaxes, linesLeft] = parseXtTaxes(linesLeft);
	let attnRec;
	[attnRec, linesLeft] = parseAttn(linesLeft);

	return [{
		ptcNumber: ptcNumber,
		totals: {
			baseFare: baseFare,
			inDefaultCurrency: inDefaultCurrency,
			tax: null,
			total: {
				currency: totalCurrency,
				amount: totalAmount,
				ptc: ptc,
			},
		},
		taxList: mainTaxes
			.filter(tax => tax.taxCode !== 'XT')
			.concat(xtTaxes),
		segments: segments,
		fareBasisInfo: fareBasisInfo,
		fareConstruction: fareConstruction,
		fareConstructionInfo: attnRec.fareConstructionInfo,
		baggageInfo: attnRec.baggageInfo,
		baggageInfoDump: attnRec.baggageInfoDump,
	}, linesLeft];
};

/** see also SabrePricingParser.parseTotalFareLine */
const parseTotalsLine = (totalsLine) => {
	//            "           10232         196.00      52.80            248.80TTL",
	const pattern = 'BBBBBBBBBBBBBBBB EEEEEEEEEEEEEE TTTTTTTTTT NNNNNNNNNNNNNNNNNLLL';
	const split = splitByPosition(totalsLine, pattern, null, true);
	if (split['L'] === 'TTL') {
		return {
			baseFare: split['B'],
			inDefaultCurrency: split['E'],
			tax: split['T'],
			total: split['N'],
		};
	} else {
		return null;
	}
};

const parseFooter = (linesLeft) => {
	linesLeft = [...linesLeft];

	const totalsLine = linesLeft.shift() || '';
	if (totalsLine.startsWith('PSGR TYPE')) {
		return null;
	}
	const faresSum = parseTotalsLine(totalsLine);
	if (!faresSum) {
		// present only in multi-PTC pricing
		linesLeft.unshift(totalsLine);
	}
	[, linesLeft] = parseSequence(linesLeft, l => l.trim() === '');

	let attnLines = [];
	const unparsedLines = [];
	for (const line of linesLeft) {
		const attnMatch = line.match(/^ATTN\*(.*)$/);
		if (attnMatch) {
			attnLines.push(attnMatch[1]);
		} else if (!['', '.'].includes(line)) {
			unparsedLines.push(line);
		}
	}

	let dataExistsInfo;
	[attnLines, dataExistsInfo] = PricingCommonHelper.parseDataExists(attnLines);

	return {
		faresSum: faresSum,
		dataExistsInfo: dataExistsInfo,
		additionalInfo: unparsedLines.concat(attnLines),
	};
};

/**
 * this function parses output of WP ('priceItinerary') command
 * in Sabre with custom display format PCC configuration (C5VD)
 * this format differs from normal WP output considerably...
 *
 * @param {string} output = [
 *     'PSGR TYPE  ADT - 01',
 *     '     CXR RES DATE  FARE BASIS      NVB   NVA    BG',
 *     ' MNL',
 *     ' SIN PR  E   16DEC EOTSG           16DEC 16DEC 25K',
 *     'FARE  USD    180.00 EQUIV PHP      9414',
 *     'TAX   PHP      1620PH PHP       550LI PHP       367XT',
 *     'TOTAL PHP     11951',
 *     'ADT-01  EOTSG',
 *     ' MNL PR SIN180.00NUC180.00END ROE1.00',
 *     'XT PHP53YR PHP314YQ',
 *     'ENDOS*SEG1*ECONOMY SAVER/FARE RULES APPLY',
 *     'RATE USED 1USD-52.3PHP',
 *     'ATTN*VALIDATING CARRIER - PR',
 *     'ATTN*CHANGE BOOKING CLASS -   1E',
 *     '                                                               ',
 *     'ATTN*AIR EXTRAS AVAILABLE - SEE WP*AE',
 *     'ATTN*BAGGAGE INFO AVAILABLE - SEE WP*BAG',
 *     '.',
 * ].join("\n")
 */
exports.parse = (output) => {
	let linesLeft = output.split('\n');
	const pqList = [];
	let footer = null;
	do {
		let ptcBlock;
		const tuple = parseSingleBlock(linesLeft);
		if (!tuple) {
			return {error: 'Failed to parse PTC block - ' + linesLeft[0]};
		}
		[ptcBlock, linesLeft] = tuple;
		pqList.push(ptcBlock);
		[, linesLeft] = parseSequence(linesLeft, l => l.trim() === '');
		footer = parseFooter(linesLeft);
	} while (!footer);
	return {
		displayType: 'philippinesPricing',
		pqList: pqList,
		...footer,
	};
};
