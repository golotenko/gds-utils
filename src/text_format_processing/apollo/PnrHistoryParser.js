const ParserUtil = require('../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * parse >*H command and all it's derivatives: *HA, *H$, *HQ, ...
 */
class PnrHistoryParser {
	static postProcessGroupMatches(dict) {
		for (const k in dict) {
			if (php.is_numeric(k)) {
				delete (dict[k]);
			} else {
				dict[k] = php.strval(dict[k]).trim() || null;
			}
		}
		return dict;
	}

	static postProcessRcvdStandardPartMatches(matches) {
		const result = this.postProcessGroupMatches(matches);
		result.receivedDt = {
			raw: matches.receivedDtRaw,
			date: ParserUtil.parsePartialDate(matches.receivedDate),
			time: ParserUtil.decodeGdsTime(matches.receivedTime),
			timeZone: matches.receivedTimezone === 'Z' ? 'UTC' : null,
		};
		const originTypes = {
			AG: 'agency',
			RM: 'airline',
		};
		result.originType = originTypes[matches.originType] || null;
		delete result.receivedDate;
		delete result.receivedTime;
		delete result.receivedTimezone;
		delete result.receivedDtRaw;
		return result;
	}

	//CX 197 I29DEC HKGAKL TK/TK9   930P  120P *       1
	//CX 882 I17JAN HKGLAX HK/WK9   435P  115P *
	//CX 882 I17JAN HKGLAX SS/HK9   435P  115P *       2
	//CX 110 I17JAN SYDHKG SS/HK9   840A  255P *       2
	//DL1375 V13APR ATLJFK HX/HX1
	//HX 538DN24MAY HKGSGN TK/UN2  1105P 1250A *
	static parseSegmentAction(content) {
		let regex, matches, result;
		regex = '/^' +
			'(?<airline>[A-Z0-9]{2})\\s{0,3}' +
			'(?<flightNumber>\\d{1,4})' +
			'(?<unparsedToken1>.)' + // no idea what it is
			'(?<bookingClass>[A-Z])' +
			'(?<departureDate>\\d{2}[A-Z]{3})\\s+' +
			'(?<departureAirport>[A-Z]{3})' +
			'(?<destinationAirport>[A-Z]{3})\\s+' +
			'(?<segmentStatusWas>[A-Z]{2})\/' +
			'(?<segmentStatusBecame>[A-Z]{2})' +
			'(?<seatCount>\\d*)' +
			'.{2}\\s*' + // two spaces, i suspect something may appear here
			'(' +
			'(?<departureTime>\\d+[A-Z]?)\\s+' +
			'(?<destinationTime>\\d+[A-Z]?)' +
			')?' +
			'(\\s+(?<confirmedByAirline>\\*)|)' +
			'.{0,9}?' + // same here
			'(?<marriage>\\d+|)' +
			'$/';
		if (php.preg_match(regex, content, matches = {})) {
			result = this.postProcessGroupMatches(matches);
			result.departureDate = {
				raw: result.departureDate,
				parsed: ParserUtil.parsePartialDate(result.departureDate),
			};
			result.departureTime = php.empty(result.departureTime) ? null : {
				raw: result.departureTime,
				parsed: ParserUtil.decodeGdsTime(result.departureTime),
			};
			result.destinationTime = php.empty(result.destinationTime) ? null : {
				raw: result.destinationTime,
				parsed: ParserUtil.decodeGdsTime(result.destinationTime),
			};
			return result;
		} else {
			return null;
		}
	}

	static parseActionLine(line) {
		let matches, eventCode, content, pricingActions, eventType, segmentEventTypes, parsed, action;
		if (php.preg_match(/^([A-Z0-9\$]{2,3})\s{1}(\s*[^\s].*)$/, line, matches = [])) {
			[line, eventCode, content] = matches;

			if (pricingActions = this.parsePricingLine(line)) {
				// they are glued sometimes
				return pricingActions;
			} else {
				eventType = this.HISTORY_EVENT_CODES[eventCode] || null;
				segmentEventTypes = [
					'addedSegment', 'addedConfirmationNumber', 'originalHistoricalSegments',
					'linkConfirmed', 'statusChange', 'cancelledSegment', 'marriageLogicBroken',
				];
				if (php.in_array(eventType, segmentEventTypes)) {
					parsed = this.parseSegmentAction(content);
				} else {
					parsed = null;
				}

				action = {
					lineType: this.LINE_ACTION,
					code: {
						raw: eventCode,
						parsed: eventType,
					},
					content: {
						raw: content,
						parsed: parsed,
					},
				};
				return [action];
			}
		} else {
			return null;
		}
	}

	// "MUC/   /   RM 1A 12APR1029Z"
	// "HDQ/1O3K/UA RM AA 14DEC1828Z"
	//         "HDQ RM 9W 24NOV1018Z"
	// "MUC/1O3K/UA RM 1A 18AUG0946Z"
	// "QSB/2CV4/1V AG LV 22NOV1453Z"
	// "DTW/BH5/1V AG NF 25NOV2018Z"
	// "SFO/2E8R/1V AG WS 24NOV1012Z"
	// "XDB/2ER7/1V AG    14MAR2326Z"
	static parseRcvdStandardPart(text) {
		let regex, matches;
		regex = '/^' +
			'(' +
			'(?<signCityCode>[A-Z]{3})' +
			'(\\\/(?<pcc>[A-Z0-9]{3,4}|\\s*))?' +
			'(\\\/(?<airline>[A-Z0-9]{2}|\\s*))?' +
			')\\s+' +
			'(?<originType>AG|RM)\\s+' +
			'(?<teamInitials>[A-Z0-9]{2}|)\\s+' +
			'(?<receivedDtRaw>' +
			'(?<receivedDate>\\d{1,2}[A-Z]{3})' +
			'(?<receivedTime>\\d{3,4})' +
			'(?<receivedTimezone>.+)' +
			')' +
			'\\s*$/';
		if (php.preg_match(regex, text, matches = {})) {
			return this.postProcessRcvdStandardPartMatches(matches);
		} else {
			return null;
		}
	}

	// "130942/ASC/1A27C864/ NO ID"
	// "211606//121657A0/ NO ID"
	// "/ZDPBVWS"
	// "NOKEYSUPPLIEDATOM/ZDGKTJK"
	// "NOKEYSUPPLIEDMONDEE/Z2E8R/GWS"
	static parseRcvdOriginSpecificPart(text, originType) {
		let regex, matches;
		if (originType === 'agency') {
			regex = '/^' +
				'(?<receivedFrom>[A-Z]+|)' +
				'\\\/Z' +
				'(?<agencySignAndInitials>[A-Z0-9]{3,4}\\\/?[A-Z0-9]{2,3})' +
				'\\s*$/';

			if (php.preg_match(regex, text, matches = {})) {
				return {
					receivedFrom: matches.receivedFrom,
					agentSign: {
						raw: matches.agencySignAndInitials,
						parsed: this.parseAgentSign(matches.agencySignAndInitials),
					},
				};
			}
		} else if (originType === 'airline') {
			regex = '/^' +
				'(?<token1>\\d+)\/' +
				'(?<token2>[A-Z0-9]*)\/' +
				'(?<token3>[A-Z0-9]+)\/' +
				'(?<token4>.*?)' +
				'\\s*$/';

			if (php.preg_match(regex, text, matches = {})) {
				return this.postProcessGroupMatches(matches);
			}
		}
		return null;
	}

	static parseLines(lines) {
		let result, line, parsed;
		result = [];
		for (line of Object.values(lines)) {
			for (parsed of Object.values(this.wrapAndParseLine(line))) {
				result.push(parsed);
			}
		}
		return result;
	}

	static wrapAndParseLine(line) {
		let result, actions;
		if (result = this.parseHistoryHeaderLine(line)) {
			return [result];
		} else if (result = this.parseRcvdLine(line)) {
			return [result];
		} else if (actions = this.parseActionLine(line)) {
			return actions;
		}
		return [{
			lineType: this.LINE_UNKNOWN,
			text: line,
		}];
	}

	// '     *****  ITIN HISTORY  *****',
	// '     *****  ATFQ HISTORY  *****',
	// '     *****  AIR  HISTORY  *****',
	static parseHistoryHeaderLine(line) {
		let matches;
		if (php.preg_match(/^\s+\*{2,}\s*(.+?)\s*\*+\s*$/, line, matches = [])) {
			return {
				lineType: this.LINE_HEAD,
				header: matches[1],
			};
		} else {
			return null;
		}
	}

	// 2E8R/GWS
	// DGKTJK
	// DYBSUE
	// DYBAAR
	// ZDPBVWS
	// Z15JE/RL
	// ZDNPGS
	static parseAgentSign(agentSign) {
		let tokens, homePcc, agentInitials;
		tokens = php.explode('/', agentSign);
		if (php.count(tokens) === 2) {
			[homePcc, agentInitials] = tokens;
			return {
				homePcc: homePcc,
				agentInitials: agentInitials,
			};
		} else if (php.mb_strlen(agentSign) === 7) {
			return {
				homePcc: php.substr(agentSign, 0, 4),
				agentInitials: php.substr(agentSign, 0, 3),
			};
		} else {
			return {
				homePcc: php.substr(agentSign, 0, 3),
				agentInitials: php.substr(agentSign, 3),
			};
		}
	}

	/**
	 * Few examples:
	 * 'RCVD-ALEXEJ/ZDYB081 -CR- QSB/1O3K/1V AG 81 30JAN2238Z'
	 * 'RCVD-/ZDYB2J  -CR- XDB/1O3K/1V AG    30JAN2306Z'
	 * 'RCVD-/Z23FH/GWS -CR- XDB/2ER7/1V AG    14MAR2326Z',
	 * 'RCVD-311947//14D3A1E8/ NO ID  -CR- MUC/1O3K/UA RM 1A 31JAN1947Z'
	 * 'RCVD-042343/ASC/1D5229C0/ NO ID  -CR- HDQ/1O3K/UA RM VX 04FEB2343Z'
	 */
	static parseRcvdLine(line) {
		let matches, _, originSpecificText, standardFormatText, standardPart;
		if (line.startsWith('RCVD-')) {
			line = php.substr(line, php.mb_strlen('RCVD-'));

			if (php.preg_match(/^(.*?)\s*-CR-\s+(.+)$/, line, matches = [])) {
				[_, originSpecificText, standardFormatText] = matches;

				if (standardPart = this.parseRcvdStandardPart(standardFormatText)) {
					standardPart.originData = this.parseRcvdOriginSpecificPart(originSpecificText, standardPart.originType);
					standardPart.lineType = this.LINE_RCVD;
					return standardPart;
				}
			}

			return {
				lineType: this.LINE_RCVD,
				raw: line,
			};
		}
		return null;
	}

	/**
	 * Few examples:
	 * 'A$ USD 703.00/USD 17.80US/USD 86.06XT/USD 806.86 - 9DEC MLOWKE+MLOWKE+MLOWKE '
	 * 'A$ NBO EY X/AUH EY X/NYC AA DFW Q NBODFW2.50 700.48MLOWKE/VCN12 A$ B-1 P09DEC16 - CAT35 '
	 *                                                                  ^---- glued line!
	 * @return array|null
	 */
	static parsePricingLine(line) {
		const wrappedLines = ParserUtil.wrapLinesAt(line, 64).split('\n');
		if (php.count(wrappedLines) > 1) {
			const parsedLines = [];
			for (const wrappedLine of wrappedLines) {
				const parsed = (this.parsePricingLine(wrappedLine) || [])[0];
				if (parsed) {
					parsedLines.push(parsed);
				}
			}
			if (php.count(parsedLines) === php.count(wrappedLines)) {
				return parsedLines;
			}
		}
		let matches;
		if (php.preg_match(/^A\$\s(.+)$/, line, matches = [])) {
			const [, content] = matches;
			return [{
				lineType: this.LINE_ACTION,
				code: {
					raw: 'A$',
					parsed: this.HISTORY_EVENT_CODES['A$'],
				},
				content: {
					raw: content,
					parsed: this.parsePricingAction(content),
				},
			}];
		}
		return null;
	}

	// 'TKT 1-4 C14MAR18 '
	// 'B-1-2 A09DEC16 ',
	// 'B-1 P09DEC16 - CAT35 ',
	static parsePricingAction(content) {
		let tokens;
		const regex =
			'/^' +
			'(?<status>\\$B-|TKT\\s+|)' +
			'(?<passengerNumbers>\\d(-\\d+)*)\\s' +
			'(?<fareTypeCode>[A-Z]{1})' +
			'(?<date>\\d+[A-Z]{3}\\d{2})' +
			'/';
		if (php.preg_match(regex, content, tokens = [])) {
			return {
				atfqLineType: 'paxBundle',
				status: php.trim(tokens.status, ' -'),
				passengerNumbers: {
					raw: tokens.passengerNumbers,
				},
				fareTypeCode: tokens.fareTypeCode,
				date: {raw: tokens.date},
			};
		} else {
			return {
				atfqLineType: 'unknown',
			};
		}
	}

	//'RCVD-CLYDE/DYBWP  ',
	//'QSB AG WP 1606Z/21JUL',
	// appears instead of header in >*H;
	static parseFirstRcvdCopy(lines) {
		const source = [...lines];
		const standardLineRegex = '/^' +
			'(?<signCityCode>[A-Z]{3})\\s+' +
			'(?<originType>AG|RM)\\s+' +
			'(?<teamInitials>[A-Z0-9]{2})\\s+' +
			'(?<receivedDtRaw>' +
			'(?<receivedTime>\\d{3,4})' +
			'(?<receivedTimezone>[A-Z])' +
			'\/' +
			'(?<receivedDate>\\d{1,2}[A-Z]{3})' +
			')' +
			'\\s*$/';
		let line, matches;
		if (line = php.array_shift(lines)) {
			if (php.preg_match(/^RCVD-([A-Z]*)\/([A-Z0-9]{3,4}\/?[A-Z0-9]{2,3})\s*$/, line, matches = [])) {
				const [, agentName, agencySignAndInitials] = matches;
				if (line = php.array_shift(lines)) {
					if (php.preg_match(standardLineRegex, line, matches = {})) {
						const result = this.postProcessRcvdStandardPartMatches(matches);
						result.originData = {
							receivedFrom: agentName,
							agentSign: {
								raw: agencySignAndInitials,
								parsed: this.parseAgentSign(agencySignAndInitials),
							},
						};
						return [result, lines];
					}
				}
			}
		}
		return [null, source];
	}

	/**
	 * note, returned RCVD actions order is chronological,
	 * which differs from the visual order in source GDS dump
	 */
	static parseCompleteDump(dump) {
		let lines = dump.split('\n');
		if (lines.length < 4 && lines.slice(-1)[0].trim() === 'NO HISTORY') {
			return {rcvdList: []};
		}
		let firstRcvdCopy;
		[firstRcvdCopy, lines] = this.parseFirstRcvdCopy(lines);
		const headerLine = php.array_shift(lines);
		const header = this.parseHistoryHeaderLine(headerLine);
		if (!header && headerLine) {
			lines.unshift(headerLine);
		}
		const rcvdList = [];
		let rcvd = null;
		const unexpected = [];
		for (const parsedLine of this.parseLines(lines).reverse()) {
			const lineType = parsedLine.lineType;
			delete (parsedLine.lineType);
			if (lineType === this.LINE_RCVD) {
				rcvd && rcvdList.push(rcvd);
				rcvd = {rcvd: parsedLine, actions: []};
			} else if (lineType === this.LINE_ACTION) {
				rcvd = rcvd || {};
				rcvd.actions = rcvd.actions || [];
				rcvd.actions.push({
					code: parsedLine.code,
					content: parsedLine.content,
				});
			} else {
				unexpected.push(parsedLine);
			}
		}
		if (rcvd && php.isset(rcvd.rcvd)) {
			rcvdList.push(rcvd);
		}
		return {
			header: header ? header.header : null,
			firstRcvdCopyHeader: firstRcvdCopy,
			rcvdList: rcvdList,
			unexpected: unexpected,
		};
	}

	static parse(dump) {
		return this.parseCompleteDump(dump);
	}
}

PnrHistoryParser.LINE_HEAD = 'LINE_HEAD';
PnrHistoryParser.LINE_ACTION = 'LINE_ACTION';
PnrHistoryParser.LINE_RCVD = 'LINE_RCVD';
PnrHistoryParser.LINE_UNKNOWN = 'LINE_UNKNOWN';

/**
 * each record in *H is preceded by one of these codes
 * HELP PNR-HISTORY CODES
 */
PnrHistoryParser.HISTORY_EVENT_CODES = {
	// PNR SEGMENT HISTORY CODES
	'AS': 'addedSegment',
	'SC': 'statusChange',
	'XS': 'cancelledSegment',
	'HS': 'originalHistoricalSegments',

	'CF': 'addedConfirmationNumber',
	'LK': 'linkConfirmed', // UA flight sold by direct link from OA system
	'DX': 'marriageLogicBroken',

	// SEAT HISTORY CODES
	'9S': 'seatIsSavedOrRequested',
	'9X': 'seatCancelled',

	'9B': 'seatUpdatedToBoardingPass', // ..issued from saved
	'9C': 'changedSeat', // from/to
	'9T': 'responseFromOtherCarrier',
	'9U': 'checkedInSeat',

	// PTA PNR HISTORY CODES
	'AB': 'addedPurchaserField',
	'XB': 'changedPurchaserField',
	'AC': 'addedActionField',
	'XC': 'changedActionField',
	'AI': 'addedSpecialRemarks',
	'XI': 'changedOrDeletedSpecialRemarks',
	'AM': 'addedFareField',
	'XM': 'changedFareField',
	'AP': 'addedPtaNumber', // number is supressed
	'AR': 'addedRoutingField',
	'XR': 'changedRoutingField',

	// PNR PASSENGER DATA HISTORY CODES
	'AN': 'addedName',
	'XN': 'deletedName',
	'AV': 'frequentFlyerDataAdded',
	'XV': 'frequentFlyerDataDeleted',
	'ATA': 'addedTicketArrangement',
	'XT': 'changedTicketingArrangement',
	'AG': 'addedSsr',
	'XG': 'changedOrDeletedSsr',
	'AO': 'addedOsi',
	'XO': 'changedOrDeletedOsi',
	'AFP': 'addedFormOfPayment',
	'XFP': 'modifiedOrDeletedFormOfPayment',
	'XF': 'changedOrDeletedPhone',
	'AID': 'addedCorporateId',
	'XID': 'deletedCorporateId',
	'AW': 'addedAddress',
	'XW': 'changedOrDeletedAddress',
	'ATR': 'addedTicketRemark',
	'XTR': 'modifiedOrDeletedTicketRemark',

	'AD': 'addedDocument', // timatic
	'AE': 'addedArne', // auto. refunds and exchanges
	'AQ': 'addedQepSignature',
	'AQP': 'addedQueuePlace',
	'AT': 'addedTicketing',
	'A$': 'addedPricing',
	'MA': 'mcoCreatedAndSaved',
	'MX': 'mcoChanged',
	'N$': 'addedManualFareQuoteField',
	'O$': 'changedOrDeletedManualFqField',
	'XE': 'changedOrDeletedApolloQcRemark',
	'XK': 'replacedTinsRemark',
	'XL': 'replacedRecordLocator',
	'X$': 'changedOrDeletedAtfq',
	'PS': 'apolloPostscript',
	'XA': 'changedOrDeletedCustomerIdField',
	'QR': 'queueRemoved',

	'AQR': 'addedQualifiedRemark',
	'XQR': 'modifiedOrDeletedQualifiedRemark',
	'ADA': 'addedDeliveryAddress',
	'XDA': 'modifiedOrDeletedDeliveryAddress',

	// codes not present in documentation
	'ARL': 'undocumentedCodeArl', // 'ARL 1A 7YG9E3   17NOV 2332'
	'CO': 'undocumentedCodeCo', // 'CO PNR CONTROL RELEASED FROM 2CV4 TO 1O3K/51 '
	'H9': 'undocumentedCodeH9', // 'H9 KE 0085 I 19JAN ICN JFK                             ',
	// '   9T  01. JIMENEZ  L     PN  09D  N     HK  09D  N    ',
};


module.exports = PnrHistoryParser;
