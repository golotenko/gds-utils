const ParserUtil = require('../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * parses output of *HT
 */
class TicketHistoryParser {
	// "06APR0219Z"
	// "26FEB0342Z"
	static parseDt(raw) {
		let parsed = null;
		let tz = null;
		let matches;
		if (php.preg_match(/(\d{1,2}[A-Z]{3})(\d{1,4}[A-Z]??)(.*)/, raw, matches = [])) {
			let [, date, time, tz] = matches;
			date = ParserUtil.parsePartialDate(date);
			time = ParserUtil.decodeGdsTime(time);
			if (date && time) {
				parsed = date + ' ' + time;
			}
			tz = tz === 'Z' ? 'UTC' : null;
		}
		return {raw, parsed, tz};
	}

	// "TI-BULATAO/JOSEPH-00010899/0017917255225/-USD/606.86/TE/26FEB0346Z"
	// "MONTERA/MELANI-46365057/1317919822843/000009614-USD/774.06/TE/11APR1841Z"
	// "CAMPBELL/ELICI-00000000-01/0827919643735/-USD/571.60/TE/10APR1353Z"
	// "XK MEASOM/SUZANNE-00000000-01/1767919641947-948/000045128-USD/1139.36/TE/06APR0219Z"
	// "XK BULATAO/JOSEPH-/8900691881009/-USD/1820.58/26FEB0342Z"
	// "HITOSISVALENCI-00000000-01/1808605906345-346/-USD/999.36/TE/06MAY1832Z"
	static parseTicketLine(line) {
		const regex =
			'/^\\s*' +
			'(TI-)?' +
			'((?<historyActionCode>[A-Z]{2})\\s+)?' +
			'(?<lastName>[^\\\/-]+)\\\/?' +
			'(?<firstName>[^-]*)-' +
			'(?<stockNumber>\\d*(-\\d+)?)\/' +
			'(?<ticketNumber>\\d{13})' +
			'(-(?<ticketExtension>\\d+))?\/' +
			'(?<invoiceNumber>[A-Z0-9]*)-' +
			'(?<currency>[A-Z]{3})\/' +
			'(?<amount>\\d*\\.?\\d+)\/' +
			'((?<transactionIndicator>[A-Z]{2})\\\/)?' +
			'(?<transactionDt>.*?)' +
			'\\s*$/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			return {
				historyActionCode: matches.historyActionCode,
				lastName: matches.lastName,
				firstName: matches.firstName,
				stockNumber: matches.stockNumber,
				ticketNumber: matches.ticketNumber,
				ticketExtension: matches.ticketExtension,
				invoiceNumber: matches.invoiceNumber,
				currency: matches.currency,
				amount: matches.amount,
				transactionIndicator: matches.transactionIndicator,
				transactionDt: this.parseDt(matches.transactionDt),
			};
		} else {
			return null;
		}
	}

	static parse(dump) {
		const currentTickets = [];
		const deletedTickets = [];
		for (const line of dump.split('\n')) {
			const ticket = this.parseTicketLine(line);
			if (ticket) {
				if (ticket.historyActionCode) {
					deletedTickets.push(ticket);
				} else {
					currentTickets.push(ticket);
				}
			}
		}
		return {currentTickets, deletedTickets};
	}
}

module.exports = TicketHistoryParser;
