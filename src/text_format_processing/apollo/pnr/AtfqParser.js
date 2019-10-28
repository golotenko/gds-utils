const Parse_priceItinerary = require('../commands/Parse_priceItinerary.js');
const php = require("enko-fundamentals/src/Transpiled/php.js");
const FqLineParser = require("./FqLineParser.js");

const parseFqLine = (line) => {
	try {
		return FqLineParser.parseFqLine(line);
	} catch (exc) {
		return {raw: line, error: exc + ''};
	}
};

class AtfqParser {
	/** @param {String} dump */
	static parse(dump) {
		const result = [];
		const atfqBlocks = dump.trim() !== 'ATFQ-UNABLE'
			? this.splitToAtfqBlocks(dump)
			: [];
		for (const block of atfqBlocks) {
			const lines = block.split('\n');
			result.push(this.parseAtfqBlock(lines));
		}
		return result;
	}

	static splitToAtfqBlocks(dump) {
		const result = [];
		let currentAtfqBlockLines = [];
		for (const line of dump.split('\n')) {
			if (this.isAtfqBlockStart(line)) {
				if (currentAtfqBlockLines.length > 0) {
					result.push(currentAtfqBlockLines.join('\n'));
					currentAtfqBlockLines = [];
				}
			}
			currentAtfqBlockLines.push(line);
		}
		if (currentAtfqBlockLines.length > 0) {
			result.push(currentAtfqBlockLines.join('\n'));
		}
		return result;
	}

	static isAtfqBlockStart(line) {
		return php.preg_match(/^ATFQ-/, line)
			|| php.preg_match(/\d+\/ATFQ-/, line);
	}

	static parseAtfqBlock(lines) {
		let line = php.trim(lines[0]);
		const atfqInfo = this.parseAtfqLine(line);
		if (!atfqInfo) {
			const msg = 'First line expected to be ATFQ line, ' +
				'something else found - ' + line;
			throw new Error(msg);
		}

		if (line = php.trim(lines[1] || '')) {
			if (php.preg_match(/^FQ-/, line)) {
				atfqInfo.FQ = parseFqLine(line);
			} else if (php.preg_match(/^FM-/, line)) {
				atfqInfo.FQ = parseFqLine(line);
			} else {
				atfqInfo.FQ = null;
			}
		}
		return atfqInfo;
	}

	// "ATFQ-REPR/$B*IF53/-*115Q/:A/Z$53.00/GB/ET/TA115Q/CUA"
	// "1/ATFQ-OK/$BN1*IF91/-*1O3K/:P/Z$91.00/GB/TA1O3K/CET/ET"
	// "2/ATFQ-REPR/N2/ITNG13796/Z$29.00/GBG2PC|EBNONEND-TK@ONLY|TDFB14|B/FEX/ET/CTK"
	static parseAtfqLine(line) {
		const regex = '/^' +
			'((?<lineNumber>\\d+)\\\/|)' +
			'(?<atfqType>ATFQ-[A-Z]+)\/' +
			'(?<pricingCommand>.+?)' +
			'\\s*$/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			const parsedCommand = Parse_priceItinerary(matches.pricingCommand);
			if (parsedCommand) {
				return {
					lineNumber: matches.lineNumber || 1,
					atfqType: matches.atfqType,
					isManualPricingRecord: parsedCommand.isManualPricingRecord,
					baseCmd: parsedCommand.baseCmd,
					pricingModifiers: parsedCommand.pricingModifiers,
				};
			}
		}
		return null;
	}
}

module.exports = AtfqParser;
