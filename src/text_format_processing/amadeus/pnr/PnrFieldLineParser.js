const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');
const FopLineParser = require("./FopLineParser");

/**
 * parse PNR field line by code+ You may encounter these them
 * in RT (PNR dumps), TWD (ticket mask), TQT (stored pricing), and so on...
 * examples:
 * ' 22 FM *M*0',
 * ' 23 FP PAX CCAXXXXXXXXXXXX3008/0121/A162876/S2-3',
 * ' 24 FV PAX A3/S2-3',
 * ' 20 FB PAX 0000000001 TTM/M1,2/RT OK EMD ADVISE PSGR TO BRING',
 * 'FOID/PICT ID AT APT/E7',
 * ' 21 FE PAX VALID ON A3 FLIGHTS/ DATES SHOWN ONLY NON-REFUNDABLE',
 * '/S2-3',
 */
class PnrFieldLineParser
{
	static parseRange(query)  {
		if (!query) {
			return [];
		} else {
			return ParserUtil.parseRange(query, ',', '-');
		}
	}

	// 'PAX SOME TEXT SOME TEXT/S1-3/P4-5'
	// 'INF SOME TEXT SOME TEXT/P1,3-5'
	// 'PAX OK28FEB/SFO1S2195//ETLH/S3-4,6-8/P2',
	static parseSegPaxPostifx(content)  {
		let regex, matches;

		regex =
            '/^\\s*'+
            '((?<infMark>INF|PAX)\\s+|)'+
            '(?<content>.*?)\\s*'+
            '(\\\/S(?<segNums>\\d+[,\\-\\d]*)|)\\s*'+
            '(\\\/P(?<paxNums>\\d+[,\\-\\d]*)|)\\s*'+
            '$\/s';
		if (php.preg_match(regex, content, matches = [])) {
			return {
				infMark: matches.infMark || '',
				content: matches.content,
				segNums: this.parseRange(matches.segNums || ''),
				paxNums: this.parseRange(matches.paxNums || ''),
			};
		} else {
			return null;
		}
	}

	// 'NONEND FEE APLY FOR RBK OB OR REFUND/RERTE/REISSUE -BG CI'
	// 'BG G3'
	// 'NONENDS. REBKG CHRG APPLY-JPY15000. RISS CHRG APPLY-JPY15000. RFND PNTY APPLY-JPY30000. NO MILE UG. -BG KE'
	// 'BG:G3'
	// 'PAX NO REFUND FEES/FARE DIFF APPLY FEE APPLIES FOR NAME
	//  CHNG -BG:EI'
	static parseEndorsement(content)  {
		let matches, $_, text, airline;

		if (php.preg_match(/^(.*?)\s*-?BG[^A-Z]([A-Z0-9]{2})$/s, content, matches = [])) {
			[$_, text, airline] = matches;
		} else {
			text = content;
			airline = null;
		}
		return {text: text, airline: airline};
	}

	// '*M*16.50A', '*M*0', '*M*14'
	static parseCommission(content)  {
		let matches, $_, value, amountMark;

		if (php.preg_match(/^\s*\*M\*(\d*\.?\d+)(A|)$/, content, matches = [])) {
			[$_, value, amountMark] = matches;
			return {
				value: value,
				units: amountMark ? 'amount' : 'percent',
			};
		} else {
			return null;
		}
	}

	/** @param line = '235-5050366427SFO27JAN17/05578602/235-5050366427' */
	static parseOriginalIssue(line)  {
		let regex, matches;

		regex =
            '/^\\s*'+
            '(?<airlineNumber>\\d{3})-'+
            '(?<documentNumber>\\d{10})'+
            '(?<location>[A-Z]{3})'+
            '(?<date>\\d{1,2}[A-Z]{3}\\d{2,4})\/'+
            '(?<iata>\\d{8})\/'+
            '(?<exchangedForAirlineNumber>\\d{3})-'+
            '(?<exchangedForDocumentNumber>\\d{10})'+
            '\\s*$/';
		if (php.preg_match(regex, line, matches = [])) {
			return {
				airlineNumber: matches.airlineNumber,
				documentNumber: matches.documentNumber,
				location: matches.location,
				date: ParserUtil.parse2kDate(matches.date),
				iata: matches.iata,
				exchangedFor: {
					airlineNumber: matches.exchangedForAirlineNumber,
					documentNumber: matches.exchangedForDocumentNumber,
				},
			};
		} else {
			return null;
		}
	}

	/**
     * would be good probably to refactor FA, FP and rest so
     * that they were parsed through this function since they
     * are not RT-specific unlike itinerary and passengers
     * @param code = 'FE' ?: 'FM' ?: 'FP' ?: 'FV', etc...
     * @param content = 'NONEND/TK-UA/B6/AC/VX ONLY -BG:AC                                       '
     *                ?: '*M*5                                                                    '
     *                ?: 'CCAXXXXXXXXXXXX3937/0722/A100293                                        '
     *                ?: 'TK                                                                      '
     *                ?: 'PAX VALID ON A3 FLIGHTS/ DATES SHOWN ONLY NON-REFUNDABLE'.PHP_EOL.'/S2-3'
     */
	static parse(code, content)  {
		let paxSegData, type, data, pair, seq, inv;

		if (paxSegData = this.parseSegPaxPostifx(content)) {
			content = paxSegData.content;
		}
		if (code === 'FV') {
			type = 'validatingCarrier';
			data = content;
		} else if (code === 'FE') {
			type = 'endorsement';
			data = this.parseEndorsement(content);
		} else if (code === 'AP') {
			type = 'phone';
			data = null; // free-form
		} else if (code === 'TK') {
			type = 'ticketingTimeLimit';
			data = null; // not parsed for now
		} else if (code === 'FP') {
			type = 'formOfPayment';
			data = FopLineParser.parseDataStr(content) || null;
		} else if (code === 'FM') {
			type = 'commission';
			data = this.parseCommission(content);
		} else if (code === 'FT') {
			type = 'tourCode';
			data = {
				tourCode: php.ltrim(content, '*'),
				isStarred: content.startsWith('*'),
			};
		} else if (code === 'FI') {
			type = 'invoice';
			pair = content.split(/\s*INV\s*/);
			if (php.count(pair) === 2) {
				[seq, inv] = pair;
				data = {sequenceNumber: seq, invoiceNumber: inv};
			} else {
				data = null;
			}
		} else if (code === 'FO') {
			type = 'originalIssue';
			data = this.parseOriginalIssue(content);
		} else {
			// unsupported code
			type = null;
			data = null;
		}
		return {
			type: type,
			data: data,
			content: content,
			segNums: paxSegData.segNums || [],
			paxNums: paxSegData.paxNums || [],
			infMark: paxSegData.infMark || '',
		};
	}
}
module.exports = PnrFieldLineParser;
