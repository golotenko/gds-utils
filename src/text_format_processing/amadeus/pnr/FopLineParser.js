const php = require('enko-fundamentals/src/Transpiled/php.js');

// '  30 FP PAX CCVI43*********32706/1219/A419872/S3-6/P1-2'
// '   9 FP PAX O/CA/S2
// '   9 FP O/CA/S2
// '   8 FP CA
// '  13 FP O/NR+/CA' // new - CASH, old - NONREF
// '   9 FP NONREF
// '   9 FP CASH
// '   9 FP CHECK
// '  22 FP PAX NR+CASH/INR2744/S3/P1
// '  23 FP PAX NR+CASH/INR2744/S3/P2
// If star in beginning then it is free text - *
// Old data marked with: O/
// New separated from Old with +/
// Two records separated with +
class FopLineParser {
	static getFormOfPayment(methodStr) {

		if (php.in_array(methodStr, ['NR', 'NONREF'])) {
			return this.TYPE_NO_REF;
		} else if (php.in_array(methodStr, ['CA', 'CASH', 'CK', 'CHECK'])) {
			return this.TYPE_CASH;
		} else if (methodStr.startsWith('CC')) {
			return this.TYPE_CC;
		} else {
			return this.TYPE_UNPARSED;
		}
	}

	//CCCAXXXXXXXXXXXX8406/0319/A01456Z
	//CCCA5111111111111111
	static parseCcData(ccLine) {
		let filter, matches, result;

		filter = new RegExp([
			/CC(?<ccType>[A-Z]{2})/,
			/(?<ccNumber>[\d*X]{15,16})/,
			/(\/(?<date>\d{4}))?/,
			/(\/(?<code>[A-Z\d]+))?/,
		].map(sr => sr.source).join(''));

		if (php.preg_match(filter, ccLine, matches = {})) {
			result = {
				ccType: matches.ccType,
				ccNumber: matches.ccNumber,
			};
			if (matches.date) {
				result.expirationDate = {
					parsed: this.decodeExpirationDate(matches.date),
					raw: matches.date,
				};
			}
			if (!php.empty(matches.code)) {
				result.approvalCode = matches.code;
			}
			return result;
		} else {
			return null;
		}
	}

	static decodeExpirationDate(str) {
		const month = str.slice(0, 2);
		const shortYear = str.slice(2);
		return '20' + shortYear + '-' + month;
	}

	static parseDataStr(lineDataStr, pax) {
		const records = [];
		lineDataStr = lineDataStr.replace(/\r\n|\r|\n/g, '');
		const tokens = lineDataStr.split('+/');
		for (let paymentStr of tokens) {
			let isOld = false;
			if (paymentStr.startsWith('O/')) {
				isOld = true;
				paymentStr = php.substr(paymentStr, 2);
			}
			for (const method of paymentStr.split('+')) {
				if (!php.empty(method.trim())) {
					const form = this.getFormOfPayment(method);
					let data = form == this.TYPE_CC
						? this.parseCcData(method)
						: null;

					data = data || {raw: method};
					data.isOld = isOld;
					data.isForInf = (pax == 'INF');
					data.formOfPayment = form;
					records.push(data);
				}
			}
		}
		return records;
	}

	// '  30 FP PAX CCVI43*********32706/1219/A419872/S3-6/P1-2'
	static parse(line) {
		line = line.replace(/\r\n|\r|\n/g, '');
		let matches;
		if (php.preg_match('/^\\s*(\\d+)\\sFP\\s+([A-Z]{3}\\s|)\\s*(.+?)$/s', line, matches = [])) {
			const [, lineNumber, pax, dataStr] = matches;
			return {
				lineNumber: lineNumber,
				data: this.parseDataStr(dataStr, pax),
			};
		} else {
			return null;
		}
	}

}

FopLineParser.TYPE_CASH = 'cash';
FopLineParser.TYPE_UNPARSED = 'unParsed';
FopLineParser.TYPE_NO_REF = 'noReference';
FopLineParser.TYPE_CC = 'creditCard';

module.exports = FopLineParser;
