const ParserUtil = require('../../agnostic/ParserUtil.js');

/**
 * parses output of >$NME{ptcNumber}/{storeNumber}
 * it is summed fare and segment list with fare bases
 */
const php = require('enko-fundamentals/src/Transpiled/php.js');

class NmeScreenParser {
	static cleanMaskValue(value) {
		return value.trim()
			.replace(/^\.+/, '')
			.replace(/\.+$/, '') || null;
	}

	// '1/;LN19'
	// '4/;LN19'
	static parseTdToken(token) {
		let matches;
		if (php.preg_match(/(\d+)\/;([A-Z0-9]+)/, token, matches = [])) {
			const [, segNum, td] = matches;
			return {segmentNumber: segNum, ticketDesignator: td};
		} else {
			return null;
		}
	}

	static parseFooter(lines) {
		const result = {record: {}};

		//         '                                                   ;PSGR 01/01',
		//         '                                                   ;BOOK 01/02',
		//         ' TD 1/;LN19   2/;LN19   3/;LN19   4/;LN19    INT X  MREC 01/00',
		const pattern = ' TT.DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD.......LLLL CC.AA';

		for (const line of Object.values(lines)) {
			const split = ParserUtil.splitByPosition(line, pattern, null, true);
			if (split.T === 'TD') {
				result.tdRecords = php.preg_split(/\s+/, split.D)
					.map((token) => this.parseTdToken(token))
					.filter(a => a);
			}
			const label = split.L;
			const record = {
				current: php.intval(split.C),
				total: php.intval(split.A),
			};
			if (label === 'MREC') {
				result.record.storeNumber = record;
			} else if (label === 'PSGR') {
				result.record.storePtcNumber = record;
			} else if (label === 'BOOK') {
				result.record.page = record;
			} else {
				result.unparsedLines = result.unparsedLines || [];
				result.unparsedLines.push(line);
			}
		}

		return result;
	}

	static parseMiscFareLine(line) {
		//         '  EQUIV FARE;...;........             COMM;  0.00/ F CONST Y.',
		//         '  EQUIV FARE;...;........             COMM;$185.00 F CONST Y.',
		const pattern = '  LLLLL LLLL;CCC;AAAAAAAA             LLLL;MMMMMMMMMMMMMMMMMM';
		const split = ParserUtil.splitByPosition(line, pattern, null, true);
		if (split.L === 'EQUIVFARECOMM') {
			const equivalentCurrency = this.cleanMaskValue(split.C);
			const equivalentAmount = this.cleanMaskValue(split.A);
			const commValue = php.trim(split.M);
			let commission, unparsed, matches;
			if (php.preg_match(/^\s*(\$?\s*\d*\.?\d+)(.*?)\s*$/, split.M, matches = [])) {
				[, commission, unparsed] = matches;
			} else {
				commission = null;
				unparsed = commValue;
			}
			return {
				fareEquivalent: equivalentCurrency ? {
					currency: equivalentCurrency,
					amount: equivalentAmount,
				} : null,
				commission: commission,
				unparsed: php.trim(unparsed),
			};
		} else {
			return null;
		}
	}

	static parseLastCityLine(line) {
		//         ' X AMS  FARE;USD;  302.00  DO TAXES APPLY?;Y                  ',
		//         ' . ...  FARE;USD;  302.00  DO TAXES APPLY?;Y                  ',
		const pattern = ' S WWW  LLLL;CCC;AAAAAAAA  LL LLLLL LLLLLL;F                  ';
		const split = ParserUtil.splitByPosition(line, pattern, null, true);
		if (split.L === 'FAREDOTAXESAPPLY?') {
			return {
				lastCityIsStopover: split.S !== 'X',
				lastCity: this.cleanMaskValue(split.W),
				baseFare: {
					currency: this.cleanMaskValue(split.C),
					amount: this.cleanMaskValue(split.A),
				},
				doTaxesApply: split.F === 'Y',
			};
		} else {
			return null;
		}
	}

	// ' . STL DL 1210 V  28APR  319P OK;VKWT8IU0;   0.00;28APR;28APR ',
	// ';O ATH KL 1572 L  07MAY  600A OK;VKWT8IU0;   0.00;07MAY;07MAY ',
	// ' . YUL WS 3539 D  05DEC  800P OK;SXCAD6M ;   0.00;.....;..... '
	static parseFlightSegment(line) {
		const regex =
			'/^.' +
			'(?<stopoverMark>[\\.OX])\\s+' +
			'(?<departureCity>[A-Z]{3})\\s+' +
			'(?<airline>[A-Z0-9]{2})\\s+' +
			'(?<flightNumber>\\d{1,4})\\s+' +
			'(?<bookingClass>[A-Z])\\s+' +
			'(?<departureDate>\\d{1,2}[A-Z]{3})\\s+' +
			'(?<departureTime>\\d{1,4}[A-Z]?)\\s+' +
			'(?<status>[A-Z]+)\\s*;\\s*' +
			'(?<fareBasis>[A-Z0-9]+|)[\\s\\.]*;\\s*' +
			'(?<fare>\\d*\\.?\\d*|)[\\s\\.]*;' +
			'(?<notValidBefore>\\d{1,2}[A-Z]{3}|[\\s\\.]*);' +
			'(?<notValidAfter>\\d{1,2}[A-Z]{3}|[\\s\\.]*)' +
			'\\s*$/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			const nva = ParserUtil.parsePartialDate(matches.notValidBefore);
			const nvb = ParserUtil.parsePartialDate(matches.notValidAfter);
			return {
				type: 'flight',
				isStopover: matches.stopoverMark !== 'X',
				departureCity: matches.departureCity,
				airline: matches.airline,
				flightNumber: matches.flightNumber,
				bookingClass: matches.bookingClass,
				departureDate: {
					raw: matches.departureDate,
					parsed: ParserUtil.parsePartialDate(matches.departureDate),
				},
				departureTime: {
					raw: matches.departureTime,
					parsed: ParserUtil.decodeGdsTime(matches.departureTime),
				},
				status: matches.status,
				fareBasis: matches.fareBasis,
				fare: matches.fare,
				notValidBefore: nva ? {
					raw: matches.notValidBefore,
					parsed: nva,
				} : null,
				notValidAfter: nvb ? {
					raw: matches.notValidAfter,
					parsed: nvb,
				} : null,
			};
		} else {
			return null;
		}
	}


	// ' . STL .. .... ..  VOID ..... .. ........ ....... ..... ..... ',
	// ' . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ',
	// ";O LHR .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
	static parseSegmentLine(line) {
		let matches;
		const parsed = this.parseFlightSegment(line);
		if (parsed) {
			return parsed;
		} else if (php.preg_match(/^\s*;?([.OX])\s+([A-Z]{3})(?:\s|\.)+VOID(?:\s|\.)+$/, line, matches = [])) {
			return {type: 'void', departureCity: matches[2], isStopover: matches[1] !== 'X'};
		} else if (php.preg_match(/(?:\s|\.)+VOID(?:\s|\.)+$/, line)) {
			return {type: 'void', departureCity: null, isStopover: true};
		} else {
			return null;
		}
	}

	static parse(dump) {
		const lines = dump.split('\n');
		const nameLine = lines.shift();

		let nameMatches;
		if (!php.preg_match(/>\$NME\s+(.+)\/(.+?)\s*\.*\s*$/, nameLine, nameMatches = [])) {
			return {error: 'Unexpected start of dump - ' + nameLine};
		}
		const [, lastName, firstName] = nameMatches;
		const labelsLine = lines.shift();

		const segments = [];
		let line;
		while (line = lines.shift()) {
			const segment = this.parseSegmentLine(line);
			if (segment) {
				if (php.isset(segment.departureCity)) {
					segments.push(segment);
				}
			} else {
				lines.unshift(line);
				break;
			}
		}
		line = php.array_shift(lines);
		const lastCityLineData = this.parseLastCityLine(line);
		if (!lastCityLineData) {
			return {error: 'Failed to parse last city line - ' + line};
		}
		const miscFareLineData = this.parseMiscFareLine(php.array_shift(lines));
		if (!miscFareLineData) {
			return {error: 'Failed to parse misc fare info line'};
		}

		if (lastCityLineData.lastCity) {
			segments.push({
				isStopover: lastCityLineData.lastCityIsStopover,
				departureCity: lastCityLineData.lastCity,
				type: 'void',
			});
		}

		const footer = this.parseFooter(lines);
		for (const tdRecord of footer.tdRecords || []) {
			const i = tdRecord.segmentNumber - 1;
			segments[i].ticketDesignator = tdRecord.ticketDesignator;
		}

		return {
			lastName: lastName,
			firstName: firstName,
			// does not include flown segments
			segments: segments,
			baseFare: lastCityLineData.baseFare,
			doTaxesApply: lastCityLineData.doTaxesApply,
			fareEquivalent: miscFareLineData.fareEquivalent,
			commission: miscFareLineData.commission,
			record: footer.record,
		};
	}
}

module.exports = NmeScreenParser;
