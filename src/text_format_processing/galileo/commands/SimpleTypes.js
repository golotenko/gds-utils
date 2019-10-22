
const exact = {
	'OP/W*': 'workAreas',
	'MT': 'moveTop',
	'MB': 'moveBottom',
	'MR': 'moveRest',
	'P-*ALL': 'printPnr',
	'Y': 'sell', // an ARNK segment
	'I': 'ignore',
	'IR': 'ignoreKeepPnr',
	'E': 'storePnr',
	'ER': 'storeKeepPnr',
	'*R': 'redisplayPnr',
	'*I': 'itinerary',
	'*IA': 'airItinerary',
	'*MM': 'frequentFlyerData',
	'FQ*': 'redisplayPriceItinerary',
	'FQA*': 'redisplayPriceItinerary',
	'FQBB*': 'redisplayPriceItinerary',
	'FQBA*': 'redisplayPriceItinerary',
	'FQBBK*': 'redisplayPriceItinerary',
	'*HTE': 'ticketList',
};

const regex = [
	[/^\*\d+$/, 'displayPnrFromList'],
	[/^FN\d+$/, 'fareRulesMenu'],
	[/^FN\d+[\*\/].*/, 'fareRules'],
	[/^FQP[^0-9]/, 'fareQuotePlanner'],
	[/^FSK\d+$/, 'sellFromLowFareSearch'],
	[/^MORE\*\d+$/, 'lowFareSearchNavigation'],// AT THE SAME PRICE AS PRICING OPTION \d
	[/^FS\*\d+$/, 'lowFareSearchNavigation'],// VIEW FARE DETAILS FOR PRICING OPTION \d
	[/^FSMORE$/, 'lowFareSearchNavigation'],// VIEW MORE PRICING OPTIONS
	[/^\*FS$/, 'lowFareSearchNavigation'], // RETURN TO THE ORIGINAL PRICING OPTION SCREEN
	[/^FS-$/, 'lowFareSearchNavigation'], // RETURN TO THE PREVIOUS SCREEN
	[/^FS.*/, 'lowFareSearch'],
	[/^E[A-Z]*M.*/, 'storePnrSendEmail'],
	[/^P\.[^@]*$/, 'addAgencyPhone'],
	[/^R\.[^@]*$/, 'addReceivedFrom'],
	[/^N\.[^@]*$/, 'addName'],
	[/^T\.[^@]*$/, 'addTicketingDateLimit'],
	[/^W\.[^@]*$/, 'addAddress'],
	[/^NP\.[^@]*$/, 'addRemark'],
	[/^SI\.[^@]*$/, 'addSsr'],
	[/^F\.[^@]*$/, 'addFormOfPayment'],
	[/^P\..*@.*$/, 'changeAgencyPhone'],
	[/^R\..*@.*$/, 'changeReceivedFrom'],
	[/^N\..*@.*$/, 'changeName'],
	[/^T\..*@.*$/, 'changeTicketingDateLimit'],
	[/^W\..*@.*$/, 'changeAddress'],
	[/^SI\..*@.*$/, 'cancelSsr'],
	[/^F\..*@.*$/, 'changeFormOfPayment'],
];

const start = {
	'CAL': 'carAvailability',
	'CAU': 'updateCarAvailabilityParams',
	'CAI': 'carVendors',
	'CAD': 'carDescription',
	'CAM': 'modifyCarSegment',
	'CAV': 'carRules',
	'HOI': 'hotels',
	'HOC': 'hotelCompleteAvailability',
	'HOU': 'updateHotelAvailabilityParams',
	'HOV': 'hotelRules',
	'HOD': 'hotelDescription',
	'HOM': 'modifyHotelSegment',
	'FD*': 'fareRulesMenuFromTariff',
	'FN*': 'fareRulesFromMenu',
	'FDC*': 'showBookingClassOfFare',
	'FR*': 'routingFromTariff',
	'FQL': 'fareQuoteLadder',
	'FQN': 'fareList',
	'F*Q': 'pricingLinearFare',
	'FZ': 'convertCurrency',

	'C*': 'agencyProfile',
	'CM': 'moveAgencyProfile',
	'SON': 'signIn',
	'SAI': 'signIn',
	'SOF': 'signOut',
	'SAO': 'signOut',
	'SDA': 'agentList',
	'STD': 'createAgent',
	'H/': 'help',
	'HELP': 'help',
	'GG*': 'helpIndex',
	'.CE': 'encodeCity',
	'.CD': 'decodeCity',
	'.LE': 'encodeCountry',
	'.LD': 'decodeCountry',
	'.AE': 'encodeAirline',
	'.AD': 'decodeAirline',
	'.EE': 'encodeAircraft',
	'.ED': 'decodeAircraft',
	'GC*': 'encodeOrDecodeHotelOrCar',
	'MU': 'moveUp',
	'MD': 'moveDown',
	'XX': 'calculator',
	'X': 'deletePnrField',
	'TT': 'timeTable',
	'L@': 'operationalInfo',
	'TI-': 'visaAndHealthInfo',
	'FTAX': 'taxInfo',
	'DCT': 'minConnectionTimeTable',
	'HOR': 'referencePoints',
	'SM*': 'seatMap',

	'QC': 'queueCount',
	'QX': 'leaveQueue',
	'QR': 'removeFromQueue',
	'QEB': 'movePnrToQueue',
	'QPRINT': 'printAllPnrsOnQueue',
	'QEM/': 'sendToMessageQueue',
	'Q/': 'openQueue',
	'*-': 'searchPnr',
	'**': 'searchPnr',
	'*H': 'history',
	'*SVC': 'flightServiceInfo',
	'*SD': 'requestedSeats',
	'SA*S': 'seatMap',
	'*FF': 'storedPricing',
	'*TE': 'ticketMask',
	'RE': 'storeAndCopyPnr',

	'TKP': 'issueTickets',
	'TMU': 'changeTickets',
	'TRV': 'voidTicket',
	'TKV': 'voidTicket',
	'TRU': 'unvoidPaperTicket',
	'TRN': 'refundTicket',
	'TRA': 'refundTicket',
	'TKR': 'revalidateTicket',

	'FF': 'storePricing',
	'/': 'setNextFollowsSegment',
	'0': 'sell',
	'N': 'sell',
	'@': 'rebook', // change segment status, seat count, booking class
};

exports.exact = exact;
exports.start = start;
exports.regex = regex;
