const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');
const {mkReg} = require('enko-fundamentals/src/Utils/Misc.js');

/**
 * parses the output of the *T
 */
class SabreTicketListParser
{
	// "  1.TAW14SEP/"
	// "  1.TAW/22SEP"
	// "  1.TAW0EKH24FEB009/"
	// "  1.TAW6IIF11JUN077/0400A/"
	static parseTimeLimitLine(line)  {
		const tawRegex =
			'/^\\s*1\\.TAW\\\/?'+
			'(?<pcc>[A-Z0-9]{3,4})?\\\/?'+
			'(?<tauDate>\\d+[A-Z]{3})\\\/?'+
			'(?<mysteriousToken>\\d{3})?\\\/?'+
			'(?<tauTime>\\d{3,4}[A-Z]?)?\\\/?'+
			'(?<unparsed>.*?)'+
			'\\s*$/';
		let matches;
		if (php.preg_match(tawRegex, line, matches = [])) {
			return {
				type: 'timeLimit',
				pcc: matches.pcc || '' || null,
				tauDate: {
					raw: matches.tauDate,
					parsed: ParserUtil.parsePartialDate(matches.tauDate),
				},
				tauTime: !php.empty(matches.tauTime) ? {
					raw: matches.tauTime,
					parsed: ParserUtil.decodeGdsTime(matches.tauTime),
				} : null,
			};
		} else {
			return null;
		}
	}

	// "  1.T-22SEP-6IIF*AIE"
	// "  1.T-05SEP-XTM731T"
	static parseTicketedLine(line)  {
		const normalRegex =
			'/^'+
			'\\s*1\\.T-(?<ticketingDate>\\d+[A-Z]{3})'+
			'('+
				'-(?<pcc>[A-Z\\d]{3,4})'+
				'(\\*|\\d|R|\\-)'+
				'A(?<agentInitials>[A-Z\\d]{2})'+
				'|'+
				'-(?<otherMadeByIndicator>[^\\s]+)?'+
			')?\\s*'+
			'$/';
		let matches;
		if (php.preg_match(normalRegex, line, matches = [])) {
			matches = php.array_filter(matches);
			return {
				type: 'ticketed',
				ticketingDate: {
					raw: matches.ticketingDate,
					parsed: ParserUtil.parsePartialDate(matches.ticketingDate),
				},
				pcc: matches.pcc,
				agentInitials: matches.agentInitials,
				otherMadeByIndicator: matches.otherMadeByIndicator,
			};
		} else {
			return null;
		}
	}

	static parseTicketingLine(line)  {

		return this.parseTimeLimitLine(line) || this.parseTicketedLine(line) || {
			type: 'error',
			error: 'Failed to parse ticketing line',
			line: line,
		};
	}

	// "  2.TE 0167859140993/94-AT MACHA/S 6IIF*AIE 1441/22SEP*"
	static parseTicketLine(line)  {
		const regex = mkReg([
			/^\s*/,
			/((?<lineNumber>\d+)\.)?/,
			/(?<transactionIndicator>[A-Z]{2})\s+/,
			/(?<ticketNumber>\d{13})/,
			/([\/\-](?<ticketNumberExtension>\d+))?/,
			/(-(?<ticketStock>[A-Z0-9]{2}))?\s+/,
			'(',
			/(?<passengerName>[\w\s]+\/[A-Z])/,
			'|', /\*/,
			/(?<transaction>[A-Z]+)\*/,
			')', /\s+/, '(',
			/(?<pcc>[A-Z\d]{3,4})(\*|\d|R|-)A/,
			/(?<agentInitials>[A-Z\d]{2})/,
			'|',
			/(?<otherMadeByIndicator>[^\s]+)?/,
			')', /\s+/,
			/(?<issueTime>\d{4})\//,
			/(?<issueDate>\d{2}[A-Z]{3})\s?/,
			/(?<cashFopMark>\*)?/,
			/(?<remark>[^\s]+)?\s*/,
			/$/,
		]);

		const borderings = {
			I: 'international',
			D: 'domestic',
			F: 'foreign',
		};
		let match = line.match(regex);
		if (match) {
			let matches = match.groups;
			// to remove ambiguity between '' and null
			matches = php.array_filter(matches);
			return {
				lineNumber: matches.lineNumber,
				transactionIndicator: matches.transactionIndicator,
				ticketNumber: matches.ticketNumber,
				ticketNumberExtension: matches.ticketNumberExtension,
				ticketStock: matches.ticketStock,
				passengerName: matches.passengerName,
				transaction: matches.transaction,
				pcc: matches.pcc,
				agentInitials: matches.agentInitials,
				otherMadeByIndicator: matches.otherMadeByIndicator,
				issueTime: {
					raw: matches.issueTime,
					parsed: ParserUtil.decodeGdsTime(matches.issueTime),
				},
				issueDate: {
					raw: matches.issueDate,
					parsed: ParserUtil.parsePartialDate(matches.issueDate),
				},
				formOfPayment: php.isset(matches.cashFopMark) ? 'cash' : 'creditCard',
				bordering: php.isset(matches.remark) && matches.transactionIndicator === 'TR'
					? borderings[matches.remark]
					: null,
				remark: matches.remark,
			};
		} else {
			return {error: 'failed to parse ticket line ' + regex, line};
		}
	}

	//TKT/TIME LIMIT
	//  1.T-28JUL-37S2*APD
	//  2.TE 3289116626625-AT VANHO/D 37S2*APD 1504/28JUL*I
	//  3.TE 3289116626626-AT RESCE/L 37S2*APD 1504/28JUL*I
	static parse(dump)  {
		const lines = php.rtrim(dump).split('\n');
		const line = lines.shift();
		if (line.trim() !== 'TKT/TIME LIMIT') {
			return {error: 'unexpectedStartOfDump', line};
		}

		const ticketingLine = lines.shift();
		const ticketingInfo = ticketingLine
			? this.parseTicketingLine(ticketingLine)
			: null; // may be absent in truncated dump
		const tickets = lines.map(l => this.parseTicketLine(l));

		return {ticketingInfo, tickets};
	}
}
module.exports = SabreTicketListParser;
