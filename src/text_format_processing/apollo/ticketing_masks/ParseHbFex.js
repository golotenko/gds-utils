
const MaskUtil = require("./MaskUtil.js");
const {mkReg} = require('enko-fundamentals/src/Utils/Misc.js');

const EMPTY_MASK_EXAMPLE = [
	"$EX NAME ARTURS/KLESUNS                     PSGR  1/ 1         ",
	"FARE USD   903.40  TOTAL USD   983.30                           ",
	"TX1 USD   69.60 US   TX2 USD   14.30 XT   TX3                   ",
	"                                                                ",
	"EXCHANGE TKTS ;..............-;...  CPN ALL                     ",
	"TKT1;.............. CPN;.... TKT2;.............. CPN;....       ",
	"COMM;.........  ORIG FOP;................... EVEN;.             ",
	"                                                                ",
	"TTL VALUE OF EX TKTS USD;.............  ORIG BRD/OFF;...;...    ",
	"TX1 USD;.......;..   TX2 USD;.......;..   TX3 USD;.......;..    ",
	"ORIG ISS;...... ORIG DATE;....... ORIG IATA NBR;.........       ",
	"ORIG TKT;..............-;...  ORIG INV NBR;.........            ",
	"PENALTY USD;............  COMM ON PENALTY;...........",
].join('');

const FIELDS = [
	'exchangedTicketNumber', 'exchangedTicketExtension',
	'ticketNumber1', 'couponNumber1', 'ticketNumber2', 'couponNumber2',
	'commission', 'originalFormOfPayment', 'evenIndicator',

	'exchangedTicketTotalValue', 'originalBoardPoint', 'originalOffPoint',
	'taxAmount1', 'taxCode1', 'taxAmount2', 'taxCode2', 'taxAmount3', 'taxCode3',
	'originalIssuePoint', 'originalIssueDate', 'originalAgencyIata',
	'originalTicketStar', 'originalTicketStarExtension', 'originalInvoiceNumber',
	'penaltyAmount', 'commOnPenaltyAmount',
];

/** @return {IExchangeApolloTicketParsedMask} */
const ParseHbFex = (output) => {
	//"$EX NAME ARTURS/KLESUNS                     PSGR  1/ 1         ",
	//"FARE USD   903.40  TOTAL USD   983.30                           ",
	//"TX1 USD   69.60 US   TX2 USD   14.30 XT   TX3                   ",
	const regex = mkReg([
		/^>\$EX NAME\s+/,
		/(?<lastName>[A-Z][^\/]*)\//,
		/(?<firstName>[A-Z].*?)\s+/,
		/PSGR\s*/,
		/(?<majorNumber>\d+)\/\s*/,
		/(?<minorNumber>\d+)\s*\n/,
		/FARE\s+/,
		/(?<baseFareCurrency>[A-Z]{3})\s*/,
		/(?<baseFareAmount>\d*\.?\d+)\s*/,
		/TOTAL\s+/,
		/(?<netPriceCurrency>[A-Z]{3})\s*/,
		/(?<netPriceAmount>\d*\.?\d+)\s*/,
		/(?<equivalentPart>.*?)\s*\n/,
		/TX1\s+/,
		'(', mkReg([
			/(?<taxCurrency1>[A-Z]{3})\s*/,
			/(?<taxAmount1>\d*\.?\d+)\s*/,
			/(?<taxCode1>[A-Z0-9]{2})/,
		]), ')?\\s+',
		/TX2\s+/,
		'(', mkReg([
			/(?<taxCurrency2>[A-Z]{3})\s*/,
			/(?<taxAmount2>\d*\.?\d+)\s*/,
			/(?<taxCode2>[A-Z0-9]{2})/,
		]), ')?\\s+',
		/TX3\s+/,
		'(', mkReg([
			/(?<taxCurrency3>[A-Z]{3})\s*/,
			/(?<taxAmount3>\d*\.?\d+)\s*/,
			/(?<taxCode3>[A-Z0-9]{2})/,
		]), ')?\\s*',
		/[\s\S]+/,
		/TTL VALUE OF EX TKTS\s+/,
		/(?<exchangedTicketCurrency>[A-Z]{3})/,
	]);
	const match = output.match(regex);
	if (!match) {
		return null;
	} else {
		const normalized = MaskUtil.normalizeMask(output);
		const parsed = MaskUtil.parseMask(
			EMPTY_MASK_EXAMPLE, FIELDS, normalized
		);
		return {
			headerData: match.groups,
			fields: Object.entries(parsed)
				.map(([key,value]) => ({key, value})),
		};
	}
};

ParseHbFex.EMPTY_MASK_EXAMPLE = EMPTY_MASK_EXAMPLE;
ParseHbFex.FIELDS = FIELDS;
module.exports = ParseHbFex;
