const ParserUtil = require('../agnostic/ParserUtil.js');
const GdsConstants = require('../agnostic/GdsConstants.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');
const FcParser = require('../agnostic/fare_calculation/FcParser.js');

/**
 * parses output of >WETR*2 (where 2 is an index of ticket in >*T output)
 */
class SabreTicketParser {
	static removeIndexKeys(dict) {
		const strKeys = Object.keys(dict).filter(php.is_string);
		return php.array_intersect_key(dict, php.array_flip(strKeys));
	}

	static detectErrorResponse(dump) {
		let errorType;
		if (php.preg_match(/^DISPLAY ENTRY MUST BE MADE BY PSEUDO CITY OF ORIGINAL.*$/, dump)) {
			errorType = 'no_agreement_exists';
		} else if (php.preg_match(/^TICKET\/DOCUMENT NOT FOUND IN AIRLINE DATABASE/, dump)) {
			errorType = 'ticket_not_found';
		} else if (!php.preg_match(/^\d+ELECTRONIC TICKET RECORD/, dump)) {
			errorType = null; // unexpected error response
		} else {
			return null;
		}
		const error = errorType
			? 'GDS returned error of type ' + errorType
			: 'Unexpected start of dump - ' + php.trim(dump);
		return {error, errorType};
	}

	/** @param line = '0557931853228   06JAN17FLL' */
	static parseOriginalIssue(line) {
		const regex =
			'/^\\s*' +
			'(?<airlineNumber>\\d{3})\\s*' +
			'(?<documentNumber>\\d{10})\\s*' +
			'(?<date>\\d{2}[A-Z]{3}\\d{2})' +
			'(?<location>[A-Z]{3})' +
			'\\s*$/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			return {
				airlineNumber: matches.airlineNumber,
				documentNumber: matches.documentNumber,
				date: ParserUtil.parse2kDate(matches.date),
				location: matches.location,
			};
		} else {
			return null;
		}
	}

	/** @param line = '0557931853228-29 134/1' */
	static parseExchangedFor(line) {
		let matches;
		if (php.preg_match(/^\s*(\d{3})(\d{10})/, line, matches = [])) {
			const [, airlineNumber, documentNumber] = matches;
			return {airlineNumber, documentNumber};
		} else {
			return null;
		}
	}

	// 'ORIGINAL ISSUE: 0557931853228   06JAN17FLL                     ',
	// 'ORIGINAL FOP:  CHECK                                           ',
	// 'EXCHANGE TKT: 0557931853228-29 134/1                           ',
	static parseExtraFields(lines) {
		const labelToValue = [];
		let line;
		while (line = lines.shift(lines)) {
			let matches;
			if (php.preg_match(/^\s*([A-Z0-9 ]+?)\s*:\s*(.*?)\s*$/, line, matches = [])) {
				const [, label, value] = matches;
				labelToValue[label] = value;
			} else {
				lines.unshift(line);
				break;
			}
		}
		const extraFields = {
			originalIssue: this.parseOriginalIssue(labelToValue['ORIGINAL ISSUE'] || ''),
			originalFop: !php.isset(labelToValue['ORIGINAL FOP']) ? null :
				{raw: labelToValue['ORIGINAL FOP']},
			exchangedFor: this.parseExchangedFor(labelToValue['EXCHANGE TKT'] || ''),
		};
		return [extraFields, lines];
	}

	static parseFareConstruction(lines) {
		const fcLines = [];
		let line;
		while (line = lines.shift()) {
			if (line.trim() === '') {
				break;
			} else {
				fcLines.push(line);
			}
		}
		const fullLine = fcLines.join('');
		const fcRecord = FcParser.parse(fullLine);
		const result = php.empty(fcRecord.error)
			? fcRecord.parsed : {
				warning: 'failed to parse fare construction',
				line: fullLine,
			};
		return [result, lines];
	}

	static parseFareAndTaxes(lines) {
		const result = [];
		const taxPattern = 'TAX\\s+(\\d+\\.?\\d*)([A-Z0-9]{2})\\s*';
		const regex =
			'/^' +
			'(FARE\\s+' +
				'(?<currency>[A-Z]{3})?' +
				'((?<amount>\\d+\\.?\\d*)|(?<amountIndicator>[A-Z]{2}))' +
			')?\\s*' +
			'(?<taxesPart>(' + taxPattern + ')*)\\s*' +
			'$/';
		let line;
		while (line = lines.shift()) {
			let matches;
			if (php.preg_match(regex, line, matches = [])) {
				matches = php.array_filter(matches); // to remove ambiguity between '' and null

				result.currency = result.currency || matches.currency;
				result.amount = result.amount || matches.amount;
				result.amountIndicator = result.amountIndicator || matches.amountIndicator;
				let allTaxesMatches;
				php.preg_match_all('/' + taxPattern + '/', matches.taxesPart, allTaxesMatches = [], php.PREG_SET_ORDER);

				for (const taxMatches of Object.values(allTaxesMatches)) {
					const [, amount, taxCode] = taxMatches;
					result.taxes = result.taxes || {};
					result.taxes[taxCode] = amount;
				}
			} else {
				php.array_unshift(lines, line);
				break;
			}
		}

		return [result, lines];
	}

	// "FARE   EUR547.00 TAX   82.60YQ  TAX    3.80LV  TAX    7.20XM"
	// "                 TAX   17.60RI  TAX    7.66UH                "
	// "TOTAL   USD728.86               EQUIV FARE PD   USD610.00"
	//
	// Sometimes data is absent:
	// 'TOTAL       USDBT               EQUIV FARE PD          BT      ',
	static parsePriceInfo(lines) {
		let fare;
		[fare, lines] = this.parseFareAndTaxes(lines);

		const totalLineRegex =
			'/^' +
			'TOTAL\\s+' +
			'(?<totalCurrency>[A-Z]{3})?' +
			'((?<totalAmount>\\d+\\.?\\d*)|(?<totalAmountIndicator>[A-Z]{2}))\\s*' +
			'(EQUIV\\s+FARE\\s+PD\\s+' +
			'(?<equivFareCurrency>[A-Z]{3})?' +
			'((?<equivFareAmount>\\d+\\.?\\d*)|(?<equivFareAmountIndicator>[A-Z]{2}))' +
			')?\\s*' +
			'$/';

		const line = lines.shift();
		let matches;
		if (php.preg_match(totalLineRegex, line, matches = [])) {
			matches = php.array_filter(matches);
			return [{
				fare,
				total: php.array_filter({
					currency: matches.totalCurrency,
					amount: matches.totalAmount,
					amountIndicator: matches.totalAmountIndicator,
				}),
				equivalentFarePaid: php.array_filter({
					currency: matches.equivFareCurrency,
					amount: matches.equivFareAmount,
					amountIndicator: matches.equivFareAmountIndicator,
				}),
			}, lines];
		} else {
			return [{
				error: 'line does not match pattern: ' + totalLineRegex,
				line,
			}, lines];
		}
	}

	// "2    DY   7107  P  28NOV  LGWLAS 1210P  OK PSRGB           OPEN"
	static parseSegmentLine(line) {
		const regex =
			'/^' +
			'(?<couponNumber>\\d+)\\s+' +
			'(?<airline>[A-Z\\d]{2})\\s+' +
			'(?<flightNumber>\\d{1,4})\\s+' +
			'(?<bookingClass>[A-Z])\\s+' +
			'(?<departureDate>\\d{2}[A-Z]{3})\\s+' +
			'(?<departureAirport>[A-Z]{3})' +
			'(?<destinationAirport>[A-Z]{3})\\s+' +
			'(?<departureTime>\\d{2,4}[A-Z]?)\\s+' +
			'(?<bookingStatus>OK|RQ|NS)\\s+' +
			'(?<fareBasis>[^\\s\\\/]+)' +
			'(\\\/(?<ticketDesignator>[^\\s]+))?\\s+' +
			'(?<couponStatus>[A-Z\\d]{2,4})\\s*' +
			'$/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			return {
				couponNumber: matches.couponNumber,
				airline: matches.airline,
				flightNumber: matches.flightNumber,
				bookingClass: matches.bookingClass,
				departureDate: {
					raw: matches.departureDate,
					parsed: ParserUtil.parsePartialDate(matches.departureDate),
				},
				departureAirport: matches.departureAirport,
				destinationAirport: matches.destinationAirport,
				departureTime: {
					raw: matches.departureTime,
					parsed: ParserUtil.decodeGdsTime(matches.departureTime),
				},
				bookingStatus: matches.bookingStatus,
				fareBasis: matches.fareBasis,
				ticketDesignator: matches.ticketDesignator,
				couponStatus: matches.couponStatus,
				segmentType: GdsConstants.SEG_AIR,
			};
		} else if (php.preg_match(/^(\d+)\s+ARUNK\s*$/, line, matches = [])) {
			const [_, couponNumber] = matches;
			return {couponNumber, segmentType: GdsConstants.SEG_ARNK};
		} else {
			return null;
		}
	}

	static parseSegments(lines) {
		lines.shift(); // column headers
		const segments = [];
		let line;
		while (line = lines.shift()) {
			const segment = this.parseSegmentLine(line);
			if (segment) {
				segments.push(segment);
			} else {
				lines.unshift(line);
				break;
			}
		}

		return [segments, lines];
	}

	// "FOP: VI4123456789012345*0104 /012345 M"
	static parseCreditCardLine(line) {
		const approvalSources = {
			L: 'link',
			S: 'sabre',
			M: 'manualForAgencies',
			Z: 'manual',
			C: 'reused',
		};

		const pattern = /^FOP:\s+([A-Z]{2})([\dX]{15,16})\*([\dX]{4})\s+\/([\dA-Z]+)\s+([LSMZC]|)\s*$/;
		let matches;
		if (php.preg_match(pattern, line, matches = [])) {
			const [, paymentNetwork, creditCardNumber, expirationDate, approvalCode, approvalSource] = matches;
			return {
				paymentNetwork,
				creditCardNumber,
				expirationDate: {
					raw: expirationDate,
					parsed: '20' + expirationDate.slice(0, 2) + '-' + expirationDate.slice(2),
				},
				approvalCode,
				approvalSource: approvalSource ? approvalSources[approvalSource] : null,
			};
		} else {
			return null;
		}
	}

	// "1ELECTRONIC TICKET RECORD"
	// "INV:                  CUST:8007502041                PNR:LOZYSM"
	// "TKT:0167851991461     ISSUED:23AUG16   PCC:DK8H   IATA:10741570"
	// "NAME:GILLESPIE/WILLIAMCOLE"
	// "NAME REF:                              TOUR ID:267BR"
	static getHeaderLinesPattern() {
		return [
			[false, '^' +
				'INV:(?<invoiceNumber>[A-Z0-9]+)?\\s+' +
				'CUST:(?<customerNumber>[A-Z0-9]+)?\\s+' +
				'PNR:(?<recordLocator>[A-Z0-9]{6})\\s*' +
			'$'],
			[false, '^' +
				'TKT:(?<ticketNumber>\\d{13})' +
				'([\\\/\\-](?<ticketNumberExtension>\\d+))?\\s+' +
				'ISSUED:(?<issueDate>\\d{2}[A-Z]{3}\\d{2})\\s+' +
				'PCC:(?<pcc>[A-Z0-9]{3,4})\\s+' +
				'IATA:(?<pccIataCode>\\d+)\\s*' +
			'$'],
			[false, '^' +
				'NAME:(?<passengerName>[\\w\\s]+\\\/[\\w\\s]+[\\w])' +
				'(\\s+FF:' +
					'(?<frequentFlierAirline>[A-Z0-9]{2})' +
					'(?<frequentFlierCode>[\\dA-Z]+)' +
				')?\\s*' +
			'$'],
			[true, '^' +
				'NAME REF:(?<nameReference>[\\dA-Z\\-]*)\\s+' +
				'(TOUR\\sID:(?<tourId>[^\\s]*))?\\s*' +
			'$'],
		];
	}

	static parseHeader(lines) {
		const result = {};
		const linePatterns = this.getHeaderLinesPattern();
		for (const tuple of Object.values(linePatterns)) {
			const [isOptional, pattern] = tuple;
			const line = lines.shift();
			let matches;
			if (php.preg_match('/' + pattern + '/', line, matches = [])) {
				Object.assign(result, php.array_filter(this.removeIndexKeys(matches)));
			} else {
				if (isOptional) {
					lines.unshift(line);
				} else {
					Object.assign(result, {
						error: 'line does not match pattern: /' + pattern + '/',
						line,
					});
					return [result, lines];
				}
			}
		}

		const issueDateParsed = ParserUtil.parseFullDate(result.issueDate);
		result.issueDate = {
			raw: result.issueDate,
			parsed: issueDateParsed ? '20' + issueDateParsed : null,
		};

		const fopLine = lines.shift();
		const asCc = this.parseCreditCardLine(fopLine);
		let matches;
		if (php.preg_match(/^FOP: CHECK\s*$/, fopLine)) {
			result.formOfPayment = 'check';
		} else if (asCc) {
			result.formOfPayment = 'creditCard';
			result.creditCardInfo = asCc;
		} else if (php.preg_match(/^FOP:\s*(.*)$/, fopLine, matches = [])) {
			const raw = matches[1];
			if (!raw) {
				result.formOfPayment = 'none';
			} else {
				result.formOfPayment = 'unparsed';
				result.formOfPaymentRaw = raw;
			}
		} else {
			return [result + {
				error: 'failed to parse FOP line',
				line: fopLine,
			}, lines];
		}

		return [result, lines];
	}

	static getProcessScheme() {
		const parseEmptyLine = (lines) => {
			const line = lines.shift();
			const result = line.trim() === '' ? [] :
				{error: 'unexpected non-empty line', line};
			return [result, lines];
		};
		return [
			[null, (lines) => {
				const line = lines.shift();
				const result = php.preg_match(/ELECTRONIC TICKET RECORD/, line) ? [] :
					{error: 'unexpectedStartOfDump', line};
				return [result, lines];
			}],
			['header', (...args) => this.parseHeader(...args)],
			['segments', (...args) => this.parseSegments(...args)],
			[null, parseEmptyLine],
			['priceInfo', (...args) => this.parsePriceInfo(...args)],
			[null, parseEmptyLine],
			['fareConstruction', (...args) => this.parseFareConstruction(...args)],
			['extraFields', (...args) => this.parseExtraFields(...args)],
		];
	}

	static parse(dump) {
		const errorData = this.detectErrorResponse(dump);
		if (errorData) { return errorData; }

		let lines = dump.split('\n');
		const result = {};
		for (const tuple of this.getProcessScheme()) {
			const [sectionName, func] = tuple;
			let funcResult;
			[funcResult, lines] = func(lines);
			if (sectionName !== null) {
				result[sectionName] = funcResult;
			}
			if (funcResult.error) {
				if (sectionName !== null) {
					result.error = 'failed to parse `' + sectionName + '` - ' + funcResult.error;
				} else {
					Object.assign(result, funcResult);
				}
				break;
			}
		}

		for (let i = 0; i < lines.length; ++i) {
			if (php.preg_match(/^ENDORSEMENT\/RESTRICTION:\s*$/, lines[i])) {
				const endorsementLines = php.array_splice(lines, i);
				endorsementLines.shift(); // ENDORSEMENT/RESTRICTION:
				result.endorsementLines = php.array_filter(endorsementLines.map(l => php.rtrim(l)));
			}
		}
		result.unparsedLines = lines;

		return result;
	}
}

module.exports = SabreTicketParser;
