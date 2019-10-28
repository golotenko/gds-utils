const ParserUtil = require('../../agnostic/ParserUtil.js');
const AtfqParser = require('./AtfqParser.js');
const GenericRemarkParser = require('../../agnostic/GenericRemarkParser.js');
const ItineraryParser = require("./ItineraryParser.js");
const HeaderParser = require("./HeaderParser");
const GdsPassengerBlockParser = require("../../agnostic/GdsPassengerBlockParser.js");
const FopParser = require("./FopParser");
const TktgParser = require("./TktgParser");
const SsrBlockParser = require("./SsrBlockParser");
const php = require('enko-fundamentals/src/Transpiled/php.js');
const TicketHistoryParser = require("../TicketHistoryParser.js");

class PnrParser {
	static detectSectionHeader(line) {
		const sectionHeaders = [
			'ACKN', 'ADRS', 'ATFQ', 'DLVR', 'FONE',
			'FOP:', 'GFAX', 'QMDR', 'RMKS', 'TKTG',
			'TRMK', 'TI',
		];
		let matches;
		if (php.preg_match('/^(?<sectionName>' + sectionHeaders.join('|') + ')-/', line, matches = []) ||
			php.preg_match(/^\d\/(?<sectionName>ATFQ)-/, line, matches = [])
		) {
			return matches.sectionName;
		} else {
			return null;
		}
	}

	static splitToSections(dump) {
		const sections = {
			'HEAD': [],
			'FONE': [],
			'ADRS': [],
			'DLVR': [],
			'FOP:': [],
			'TKTG': [],
			'ATFQ': [],
			'TI': [],
			'GFAX': [],
			'QMDR': [],
			'RMKS': [],
			'TRMK': [],
			'ACKN': [],
			'dataExistsLines': [],
		};
		let currentSectionName = 'HEAD';
		for (const line of dump.split('\n')) {
			const sectionName = this.detectSectionHeader(line);
			if (sectionName) {
				currentSectionName = sectionName;
				sections[currentSectionName].push(line);
			} else if (
				line.startsWith('*** ') ||
				line.trim() == 'PRICING RECORDS EXISTS - SUBSCRIBER - $NME'
			) {
				sections.dataExistsLines.push(line);
			} else {
				sections[currentSectionName].push(line);
			}
		}
		for (const [sectionName, sectionLines] of Object.entries(sections)) {
			if (sectionName != 'dataExistsLines') {
				sections[sectionName] = sectionLines.join('\n');
			}
		}
		return sections;
	}

	static getApolloFormatMarker(str) {
		const markerStart = php.strpos(str, '>');
		if (markerStart !== false) {
			return php.rtrim(php.rtrim(str.slice(markerStart + 1)), ';\u00B7');
		} else {
			return null;
		}
	}

	static parseDataExistsLines(lines, tktgLine) {
		const markers = lines.map((line) => {
			if (line.startsWith('***') && line.includes('EXIST')) {
				return PnrParser.getApolloFormatMarker(line);
			} else {
				return null;
			}
		});
		return {
			dividedBookingExists: markers.includes('*DV'),
			frequentFlyerDataExists: markers.includes('*MP'),
			globalInformationExists: markers.includes('*GI'),
			itineraryRemarksExist: markers.includes('RM*'),
			linearFareDataExists: markers.includes('*LF'),
			miscDocumentDataExists: markers.includes('*MPD'),
			profileAssociationsExist: markers.includes('*PA'),
			seatDataExists: markers.includes('9D'),
			tinRemarksExist: markers.includes('*T'),
			nmePricingRecordsExist: lines.map((line) => line.trim()).includes('PRICING RECORDS EXISTS - SUBSCRIBER - $NME'),
			eTicketDataExists: tktgLine && tktgLine.includes('**ELECTRONIC DATA EXISTS** >*HTE'),
		};
	}

	static parseAddress(dump) {
		if (dump) {
			let adrs = dump.split('\n').join('').trim().slice(5);
			adrs = php.preg_replace(/¤/, '@', adrs);
			const addressTokens = adrs.split('@');

			let zipCode = null;
			let name, addressLine1, addressLine2, addressLine3;
			if (php.count(addressTokens) == 4) {
				[name, addressLine1, addressLine2, addressLine3] = addressTokens;
				let matches;
				if (php.preg_match(/Z\/(?<zipCode>.+)/, addressLine3, matches = [])) {
					zipCode = matches.zipCode;
				}
			} else if (php.count(addressTokens) == 3) {
				[name, addressLine1, addressLine2] = addressTokens;
				addressLine3 = '';
				let matches;
				if (php.preg_match(/Z\/(?<zipCode>.+)/, addressLine2, matches = [])) {
					zipCode = matches.zipCode;
				}
			} else {
				return null;
			}

			return {name, addressLine1, addressLine2, addressLine3, zipCode};
		} else {
			return null;
		}
	}

	static parseAcknSection(dump) {
		const lines = dump.split('\n');
		const result = [];
		const splitStr = 'NNNNNAA_CCCCCC___DDDDD_XXXX';
		const names = {
			N: 'number',
			A: 'airline',
			C: 'confirmationNumber',
			D: 'date',
		};
		for (const line of lines) {
			const parsedLine = ParserUtil.splitByPosition(line, splitStr, names, true);
			const matchesExpectations = true
				&& ('' + parsedLine.number).match(/^\s*(ACKN-|\d+)\s*$/)
				&& ('' + parsedLine.airline).match(/^[A-Z0-9]{2}$/)
				&& ('' + parsedLine.confirmationNumber).match(/^[A-Z0-9]+$/)
				&& ('' + parsedLine.date).match(/^[0-9]{2}[A-Z]{3}$/)
			;
			if (matchesExpectations) {
				const number = parsedLine.number == 'ACKN-' ? 1 : php.intval(parsedLine.number);
				result.push({
					number: number,
					airline: parsedLine.airline,
					confirmationNumber: parsedLine.confirmationNumber,
					date: {
						raw: parsedLine.date,
						parsed: ParserUtil.parsePartialDate(parsedLine.date),
					},
				});
			}
		}
		return result;
	}

	static parseRemarks(dump) {
		const result = [];
		for (let line of dump.split('\n')) {
			const remarkNumber = line.startsWith('RMKS-') ? 1 :
				php.intval(php.trim(php.substr(line, 0, 5)));
			line = line.slice(5);
			let tokens;
			if (php.preg_match(/MADE FOR (AGENT )?(?<name>[A-Z]+)\b/, line, tokens = [])) {
				result.push({
					lineNumber: remarkNumber,
					remarkType: 'MADE_FOR_REMARK',
					data: {
						name: tokens.name,
					},
				});
			} else {
				const record = GenericRemarkParser.parse(line);
				result.push({
					lineNumber: remarkNumber,
					remarkType: record.remarkType,
					data: record.data,
				});
			}
		}
		return result;
	}

	static parse(dump) {
		const sections = this.splitToSections(dump);
		const headResult = HeaderParser.parse(sections.HEAD);
		const paxResult = GdsPassengerBlockParser.parse(headResult.textLeft);
		const ticketLines = !php.empty(sections.TI) ? sections.TI.split('\n') : [];
		return {
			headerData: headResult.parsedData,
			passengers: paxResult.parsedData,
			itineraryData: ItineraryParser.parse(paxResult.textLeft).segments,
			/* not needed - not parsed ATM */
			foneData: null,
			adrsData: sections.ADRS ? this.parseAddress(sections.ADRS) : null,
			dlvrData: sections.DLVR ? this.parseAddress(sections.DLVR) : null,
			formOfPaymentData: FopParser.parse(sections['FOP:']),
			tktgData: TktgParser.parse(sections.TKTG),
			atfqData: sections.ATFQ ? AtfqParser.parse(sections.ATFQ) : null,
			ticketListData: ticketLines.map(a => TicketHistoryParser.parseTicketLine(a)),
			ssrData: sections.GFAX ? SsrBlockParser.parse(sections.GFAX) : null,
			remarks: sections.RMKS ? this.parseRemarks(sections.RMKS) : null,
			acknData: sections.ACKN ? this.parseAcknSection(sections.ACKN) : null,
			dataExistsInfo: this.parseDataExistsLines(sections.dataExistsLines, sections.TKTG),
		};
	}
}

module.exports = PnrParser;
