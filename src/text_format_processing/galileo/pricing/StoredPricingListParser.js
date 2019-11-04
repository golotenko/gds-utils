const ParserUtil = require('../../agnostic/ParserUtil.js');
const Parse_priceItinerary = require('../commands/Parse_priceItinerary.js');

const php = require('enko-fundamentals/src/Transpiled/php.js');
const StoredPtcPricingBlockParser = require('./StoredPtcPricingBlockParser.js');

/**
 * parses output of >*FFALL; - stored pricing
 * output example (*FF, list display):
 * 'FQ1  - S1-2                                       13MAR18 WS/AG'
 * '>FQP1*ITX.2*C03.3*INS                                          '
 * ' P1  LIBERMANE/MARINA          ITX   G  14MAR18 *  USD  892.70 '
 * ' P2  LIBERMANE/ZIMICH          C03   G  14MAR18 *  USD  689.70 '
 * ' P3  LIBERMANE/LEPIN           INS   G  14MAR18 *  USD  689.70 '
 * '                                                               '
 * 'FQ2  - S1-2                                       13MAR18 WS/AG'
 * '>FQP4*MIS                                                      '
 * ' P4  LIBERMANE/STAS            MIS   G  14MAR18 *  USD  892.70 '
 *
 * output example (*FFALL, full display):
 * 'FQ1  - S1-2                                       13MAR18 WS/AG'
 * '>FQP4*MIS                                                      '
 * ' P4  LIBERMANE/STAS            MIS   X             USD  892.70 '
 * ' KIV PS X/IEV PS RIX 781.38 NUC781.38END ROE0.844659           '
 * ' FARE EUR660.00 EQU USD812.00 TAX 3.10JQ TAX 11.10MD           '
 * ' TAX 7.60WW TAX 4.00UA TAX 8.50YK TAX 18.00YQ TAX 28.40YR      '
 * ' TOT USD892.70                                                 '
 * '              ***ADDITIONAL FEES MAY APPLY*SEE>FO1;            '
 * ' S1   FB-C1EP4                                                 '
 * '      BG-2PC                                                   '
 * ' S2   FB-C1EP4                                                 '
 * '      BG-2PC                                                   '
 * ' NONEND/RES RSTR/RBK FOC                                       '
 * ' LAST DATE TO PURCHASE TICKET: 10MAY18                         '
 * ' T P4/S1-2/CPS/ET/TA711M                                       '
 * '                                                               '
 * 'FQ2  - S1-2                                       14MAR18 WS/AG'
 * '>FQP1*ITX.2*C03.3*INS                                          '
... and so on ...
 */
class StoredPricingListParser {
	/** @param query = '1-2.4' */
	static parseRange(query) {
		const parseRange = (text) => {
			const pair = text.split('-');
			return php.range(pair[0], pair[1] || pair[0]);
		};
		return query.trim().split('.').flatMap(parseRange);
	}

	// 'FQ1  - S1-2                                       13MAR18 WS/AG'
	static parseFqLine(line) {
		const regex =
			'/^FQ' +
			'(?<pricingNumber>\\d+)\\s*-\\s*S' +
			'(?<segmentNumbers>\\d+[-.\\d]*)\\s+.*' +
			'(?<addedDate>\\d{1,2}[A-Z]{3}\\d{0,4})\\s+' +
			'(?<agentInitials>[A-Z0-9]{2})\/' +
			'(?<dutyCode>[A-Z0-9]{2})' +
			'/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			return {
				pricingNumber: matches.pricingNumber,
				segmentNumbers: this.parseRange(matches.segmentNumbers),
				addedDate: ParserUtil.parse2kDate(matches.addedDate),
				agentInitials: matches.agentInitials,
				dutyCode: matches.dutyCode,
			};
		} else {
			return null;
		}
	}

	static parsePassengerLine(line) {
		//              ' P2  LIBERMANE/ZIMICH          C03   G  14MAR18 *  USD  689.70 '
		//              ' P2  LIBERMANE/ZIMICH          INF   G  14MAR18 *  USD   81.00 '
		//              ' P4  LIBERMANE/STAS            MIS   X             USD  892.70  '
		//              '                               ITX   Z  19JUN18 *  GBP 1110.21 ',
		//              ' P1  WALTERS/PATRICKA          ADT37 A  13AUG19 *  USD 1018.83 '
		const pattern = ' _NN FFFFFFFFFFFFFFFFFFFFFFFFFFPPPQQ G  DDDDDDD *  CCCAAAAAAAAAAAA';
		const split = ParserUtil.splitByPosition(line, pattern, null, true);
		const result = {
			passengerNumber: split['N'],
			passengerName: split['F'],
			ptc: split['P'],
			guaranteeCode: split['G'],
			guaranteeDate: !split['D'] ? null :
				ParserUtil.parse2kDate(split['D']),
			starMark: split['*'],
			currency: split['C'],
			amount: split['A'],
		};
		const dateValid = !result.guaranteeDate
			|| result.guaranteeDate.parsed;

		const paxOrSpace =
			line.startsWith(' P') &&
			php.preg_match(/^\d+$/, result.passengerNumber) ||
			php.trim(split['_'] + split['N'] + split['F']) === '';

		if (paxOrSpace &&
			split[' '].trim() === '' && dateValid &&
			php.preg_match(/^[A-Z]{3}$/, result.currency) &&
			php.preg_match(/^\d*\.?\d+$/, result.amount)
		) {
			return result;
		} else {
			return null;
		}
	}

	static parseTicketedPassengerLine(line) {
		//              ' P1  THOMAS/HERMENAURINA       ITX   Z   E   0012667560437     '
		const pattern = ' _NN FFFFFFFFFFFFFFFFFFFFFFFFFFPPPQQ G   E   TTTTTTTTTTTTT';
		const split = ParserUtil.splitByPosition(line, pattern, null, true);
		const result = {
			passengerNumber: split['N'],
			passengerName: split['F'],
			ptc: split['P'],
			guaranteeCode: split['G'],
			isEticket: split['E'] === 'E',
			ticketNumber: split['T'],
		};

		const paxOrSpace =
			line.startsWith(' P') &&
			php.preg_match(/^\d+$/, result.passengerNumber) ||
			php.trim(split['_'] + split['N'] + split['F']) === '';

		if (paxOrSpace && php.trim(split[' ']) === '' &&
			php.preg_match(/^\d{13}$/, result.ticketNumber)
		) {
			return result;
		} else {
			return null;
		}
	}

	// ' P1  WIECKOWSKA/MARISAALICESTINECONNOR                         ',
	static parseLongNameLine(line) {
		let matches;
		if (php.preg_match(/^\s*P(\d+)\s+([A-Z][^\/\d]*\/[A-Z][^\/\d]*?)\s*$/, line, matches = [])) {
			const [, passengerNumber, passengerName] = matches;
			return {passengerNumber, passengerName};
		} else {
			return null;
		}
	}

	static parsePassenger(linesLeft) {
		linesLeft = [...linesLeft];
		const firstLine = linesLeft.shift();
		const parsed = this.parsePassengerLine(firstLine)
			|| this.parseTicketedPassengerLine(firstLine);
		const asLongNameData = this.parseLongNameLine(firstLine);
		if (parsed) {
			return [parsed, linesLeft];
		} else if (asLongNameData) {
			const secondLine = linesLeft.shift();
			const parsed = this.parsePassengerLine(secondLine);
			if (parsed) {
				parsed.passengerNumber = asLongNameData.passengerNumber;
				parsed.passengerName = asLongNameData.passengerName;
				return [parsed, linesLeft];
			}
		}
		return null;
	}

	// ' T P4/S1-2/CPS/ET/TA711M                                       '
	// ' T P1-3/S1-2/CPS/ET/TA711M                                     '
	// ' T S1/CAT/ET/TA711M                                            '
	static parseStoreFooter(line) {
		let matches;
		if (!php.preg_match(/^\sT\s+(\S+)/, line, matches = [])) {
			return null;
		}
		const rawMods = matches[1].split('/');
		const mods = rawMods.map(Parse_priceItinerary.parseModifier);
		const types = php.array_column(mods, 'type');
		if (php.in_array('segments', types)) {
			return {normalizedPricingModifiers: mods};
		} else {
			return null;
		}
	}

	static parsePtcBlockData(linesLeft) {
		const startsNextBlock = (line) => {
			return this.parsePassengerLine(line)
				|| this.parseLongNameLine(line)
				|| this.parseStoreFooter(line)
				|| !line.trim()
				|| !line.startsWith(' ');
		};
		let blockLines = [];
		let line;
		while (line = linesLeft.shift()) {
			if (!startsNextBlock(line)) {
				blockLines.push(line);
			} else {
				linesLeft.unshift(line);
				break;
			}
		}
		const removeIndent = (line) => line.slice(1);
		blockLines = blockLines.map(removeIndent);
		const blockText = blockLines.join('\n');
		const blockData = !blockText.trim() ? null :
			StoredPtcPricingBlockParser.parse(blockText);
		return [blockData, linesLeft];
	}

	// 'FQ1  - S1-2                                       13MAR18 WS/AG'
	// '>FQP1*ITX.2*C03.3*INS                                          '
	// ' P1  LIBERMANE/MARINA          ITX   G  14MAR18 *  USD  892.70 '
	// ' P2  LIBERMANE/ZIMICH          C03   G  14MAR18 *  USD  689.70 '
	// ' P3  LIBERMANE/LEPIN           INS   G  14MAR18 *  USD  689.70 '
	// ' P1  WIECKOWSKA/MARISAALICESTINECONNOR                         ',
	// '                               ITX   Z  19JUN18 *  GBP 1110.21 ',
	static parseStore(linesLeft) {
		// remove leading whitespace if any
		const text = php.ltrim(linesLeft.join('\n'));
		linesLeft = text.split('\n');

		const fqLine = linesLeft.shift();
		if (!(fqLine)) {
			return null;
		}

		const fqData = this.parseFqLine(fqLine);
		if (!fqData) {
			return null;
		}

		const cmdLine = linesLeft.shift();
		let matches, commandCopy;
		if (php.preg_match(/^>(\S.*?);?\s*$/, cmdLine, matches = [])) {
			commandCopy = matches[1];
		} else {
			// this line may be absent
			linesLeft.unshift(cmdLine);
			commandCopy = null;
		}

		let hasPrivateFaresSelectedMessage = false;
		const headerMessages = [];
		const passengers = [];
		while (!php.empty(linesLeft)) {
			const tuple = this.parsePassenger(linesLeft);
			if (tuple) {
				let passenger, blockData;
				[passenger, linesLeft] = tuple;
				[blockData, linesLeft] = this.parsePtcBlockData(linesLeft);
				passenger.blockData = blockData;
				passengers.push(passenger);
			} else if (php.empty(passengers)) {
				const message = linesLeft.shift(linesLeft);
				if (message.includes('NET TICKET DATA EXISTS')) {
					hasPrivateFaresSelectedMessage = true;
				} else {
					headerMessages.push(message);
				}
			} else {
				break;
			}
		}
		let footerData = null;
		const line = linesLeft.shift();
		if (line) {
			if (!(footerData = this.parseStoreFooter(line))) {
				linesLeft.unshift(line);
			}
		}
		const store = {
			pricingNumber: fqData.pricingNumber,
			segmentNumbers: fqData.segmentNumbers,
			addedDate: fqData.addedDate,
			agentInitials: fqData.agentInitials,
			dutyCode: fqData.dutyCode,
			commandCopy,
			hasPrivateFaresSelectedMessage,
			headerMessages,
			passengers,
			footerData,
		};
		return [store, linesLeft];
	}

	static parse(dump) {
		let linesLeft = dump.split('\n');
		const pricingList = [];
		let tuple;
		while (tuple = this.parseStore(linesLeft)) {
			const [store, left] = tuple;
			if (!store.passengers) {
				return {error: 'Failed to parse PTC rows of store #' + store.pricingNumber + ' - ' + (left[0] || '(no lines left)')};
			}
			pricingList.push(store);
			linesLeft = left;
		}
		if (!pricingList) {
			return {error: 'Unexpected start of dump - ' + linesLeft[0]};
		}
		for (const store of pricingList) {
			for (const pax of store.passengers) {
				const error = (pax.blockData || {}).error;
				if (error) {
					return {error: 'Failed to parse block of pax #' + pax.passengerNumber + ' - ' + error};
				}
			}
		}
		return {pricingList, linesLeft};
	}
}

module.exports = StoredPricingListParser;
