

const MaskUtil = require('./MaskUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

const padLines = (dump, length, padding, direction) => {
	const lines = dump.split('\n');
	const padLine = (str) => {
		if (php.mb_strlen(str) > length) {
			return php.mb_substr(str, 0, length);
		} else if (php.mb_strlen(str) < length) {
			return php.str_pad(str, length, padding, direction);
		} else {
			return str;
		}
	};
	return lines.map(padLine).join('\n');
};

/**
 * parses output of >*MCO{lineNumber};
 * it is screen with detailed information on each MCO listed in >*MPD;
 *
 * it looks something like this:
 * '>HHMCU1           *** MISC CHARGE ORDER ***',
 * ' PASSENGER NAME;ARYA/PRASHANT...........................',
 * ' TO;SU.....................................+ AT;SVO............',
 * ' VALID FOR;SPLIT...............................................',
 * ' TOUR CODE;..............+ RELATED TKT NBR;.............',
 * ' FOP;VI4111111111111111/OK.....................................',
 * ' EXP DATE;0718 APVL CODE;755001 COMM;0.00/..+ TAX;........-;..',
 * ' AMOUNT;1106.26.-;USD EQUIV ;........-;..+ BSR;..........',
 * ' END BOX;......................................................',
 * ' REMARK1;..............................................',
 * ' REMARK2;......................................................',
 * ' VALIDATING CARRIER;SU                  ISSUE NOW;.',
 * '><',
 */
class McoMaskParser
{
	static transformResult(fields)  {
		return {
			passengerName: fields.passengerName,
			to: fields.to,
			at: fields.at,
			validFor: fields.validFor,
			tourCode: fields.tourCode,
			ticketNumber: fields.ticketNumber,
			formOfPayment: {raw: fields.formOfPayment},
			expirationMonth: (fields.expirationDate || null) ? php.mb_substr(fields.expirationDate, 0, 2) : null,
			expirationYear: (fields.expirationDate || null) ? php.mb_substr(fields.expirationDate, 2, 2) : null,
			approvalCode: fields.approvalCode,
			commission: fields.commission,
			taxAmount: fields.taxAmount,
			taxCode: fields.taxCode,
			baseFare: {
				currency: fields.amountCurrency,
				amount: fields.amount,
			},
			fareEquivalent: (fields.equivCurrency || fields.equivAmount) ? {
				currency: fields.equivCurrency,
				amount: fields.equivAmount,
			} : null,
			rateOfExchange: fields.bsr,
			endorsementBox: fields.endorsementBox,
			remark1: fields.remark1,
			remark2: fields.remark2,
			validatingCarrier: fields.validatingCarrier,
			issueNow: fields.issueNow === 'Y',
		};
	}

	static parse(dump)  {
		const mask = padLines([
			'>HHMCU..          *** MISC CHARGE ORDER ***                    ',
			' PASSENGER NAME;........................................       ',
			' TO;........................................ AT;...............',
			' VALID FOR;....................................................',
			' TOUR CODE;............... RELATED TKT NBR;.............       ',
			' FOP;..........................................................',
			' EXP DATE;.... APVL CODE;...... COMM;........ TAX;........-;.. ',
			' AMOUNT;........-;... EQUIV ;........-;... BSR;..........      ',
			' END BOX;......................................................',
			' REMARK1;..............................................        ',
			' REMARK2;......................................................',
			' VALIDATING CARRIER;..                  ISSUE NOW;.            ',
		].join('\n'), 63, ' ');

		const fields = [
			'mcoNumber',
			'passengerName',
			'to', 'at',
			'validFor',
			'tourCode', 'ticketNumber',
			'formOfPayment',
			'expirationDate', 'approvalCode', 'commission', 'taxAmount', 'taxCode',
			'amount', 'amountCurrency', 'equivAmount', 'equivCurrency', 'bsr',
			'endorsementBox',
			'remark1',
			'remark2',
			'validatingCarrier', 'issueNow',
		];
		dump = padLines(dump, 63, ' ');
		const error = MaskUtil.checkDumpMatchesMask(dump, mask);
		if (error) {
			return {error: 'Bad MCO mask output: ' + error + php.PHP_EOL + dump+php.PHP_EOL};
		}
		return this.transformResult(MaskUtil.parseMask(mask, fields, dump));
	}
}
module.exports = McoMaskParser;
