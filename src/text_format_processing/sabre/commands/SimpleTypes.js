const exact = {
	'PQ': 'storePricing',
	'*PQ': 'storedPricing',
	'*PQS': 'storedPricingNameData',
	'IR': 'ignoreKeepPnr',
	'I': 'ignore',
	'IA': 'ignore',
	'*B': 'requestedSeats',
	'*FF': 'frequentFlyerData',
	'*N': 'names',
	'*T': 'ticketing',
	'*P': 'passengerData',
	'*P3D': 'ssrDocGeneric',
	'*P4D': 'ssrDocNative',
	'*IA': 'airItinerary',
	'*IMSL': 'itineraryMarriage',
	'*A': 'allPnrFields',
	'VCT*': 'verifyConnectionTimes',
	'QXI': 'leaveQueue',
	'QR': 'removeFromQueue',
	'*HIA': 'airItineraryHistory',
	'VI*': 'flightServiceInfo', // meals/hidden stops/...
	'*FOP': 'formOfPayment',
	'*S*': 'workAreas',
	'JR': 'createLowFareSearchProfile',
	'JR*': 'redisplayLowFareSearchProfile',
	'JRP*': 'redisplayLowFareSearch',
	'JRC': 'cancelLowFareSearchProfile',
	'F': 'fileDividedBooking',
	'WPRDHELP': 'ruleDisplayHelp',
};
const start = {
	'FQHELP': 'tariffDisplayHelp',
	'*H': 'history',
	'QC/': 'queueCount',
	'SI': 'signIn', // eg. SI*1234
	'SO': 'signOut',
	'WV*': 'voidList',
	'WV': 'exchangeTicket',
	'W¥': 'issueTickets',
	'WETRR': 'refundTicket',
	'4G': 'seatMap',
	'QP': 'movePnrToQueue',
	'Q': 'openQueue',
	'X': 'deletePnrField',
	'W/TA': 'branchTo', // branch between pcc's set up
	'HB': 'createAgent',
	'H*CST': 'agentList', // full agent lists
	// >PE*6IIF
	'PE*': 'lniataList', // show all lniatas of pcc
	'PE¥': 'addEmail',
	'FQ': 'fareSearch',
	'WETR*': 'ticketMask', // show i-th ticket mask
	'WP*': 'redisplayPriceItinerary',
	'W/*': 'decodeOrEncode', // decode airline or city
	'W/-': 'decodeOrEncode', // encode airline or city
	'2': 'operationalInfo',
	'1*': 'moreAirAvailability',
	'1': 'airAvailability',
	'0': 'sell', // sell from availability
	'-': 'addName', // add passenger name
	'6': 'addReceivedFrom', // add RECEIVED FROM signature
	'7': 'addTicketingDateLimit', // add TAW
	'9': 'addAgencyPhone',
	'\u00A4': 'changeWorkArea',
	'T*QZX': 'showTime',
	'IC': 'ignoreAndCopyPnr',
	'JR.': 'lowFareSearch',
	'JR0': 'sellFromLowFareSearch',
	'RB': 'showBookingClassOfFare',
	'PQD': 'deleteStoredPricing',
	',': 'increaseSeatCount',
	'W-': 'addAddress',
	'OIATH': 'showSessionToken',
};
const regex = [
	[/^WP(.*¥)?NI/, 'lowFareSearchFromPnr'],
	[/^T[\[|¤].*/, 'calculator'],
	[/^\dDOCS.*/, 'addSsrDocs'],
	[/^\*R(\||$)/, 'redisplayPnr'],
	[/^\*I(\||$)/, 'itinerary'],
	[/^\*\d{1,3}(\||$)/, 'displayPnrFromList'],
	[/^(?:\/\d+){2}(?:[,-]\d+)*$/, 'reorderSegments'],
	[/^HR(12|24)$/, 'setTimeFormat'],
	[/^PE[\d,\-]*¤/, 'changeEmail'],
	[/^WC¥\d+.*$/, 'sellFromLowFareSearch'],
	[/^WC(A|\d+).*$/, 'changeBookingClass'],
	[/^3(\d+[-,\d]*)¤(.*)$/, 'changeSsr'],
	[/^4(\d+[-,\d]*)¤(.*)$/, 'changeSsrNative'],
	[/^RD(\d+).*$/, 'fareRulesFromList'], // get fare rules of i-th fare
	[/^\*PQ\d+$/, 'storedPricingByNumber'],
	[/^D\d+.*$/, 'divideBooking'],
];

exports.exact = exact;
exports.start = start;
exports.regex = regex;
