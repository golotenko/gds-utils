const exact = {
	'IR': 'ignoreKeepPnr',
	'9D': 'requestedSeats',
	'*MP': 'frequentFlyerData',
	'*MPD': 'mcoList',
	'$V:/S': 'fareRuleSummary',
	'*HTE': 'ticketList',
	'@MT': 'verifyConnectionTimes',
	'T:R': 'restoreTicketedPricing',
	'QXI': 'leaveQueue',
	'QR': 'removeFromQueue',
	'.IHK': 'confirmScheduleChange',
	'MT': 'moveTop',
	'MB': 'moveBottom',
	'MR': 'moveRest',
	'TIPN': 'nextTiPage', // next page in "TI-*"
	'C:F-': 'removeFormOfPayment', // remove form of payment
	// HELP PNR-DISPLAY PNR FIELDS
	'*P': 'passengerData', // PASSENGER DATA
	'*N': 'names', // NAME -s of passengers
	'*T': 'ticketing', // TICKETING WITH ATFQ AND FOP
	'*IA': 'airItinerary', // AIR SEGMENT
	'*SVC': 'flightServiceInfo', // SERVICES FOR ALL SEGMENTS
	'*HA': 'airItineraryHistory', // AIR SEGMENT CHANGE
	'*H$': 'pricingHistory', // HISTORY - ATFQ (STORED PRICING FARE FIELD) CHANGE
	'*PA': 'profileAssociation',
	'*DV': 'dividedBookings',
	'OP/W*': 'workAreas',
	'F': 'fileDividedBooking',
	'HHMCO': 'requestMcoMask',
};

const start = {
	'@LT': 'showTime',
	'MU': 'moveUp',
	'MD': 'moveDown',
	'S*AIR/': 'decodeAirline',
	'M*': 'determineMileage',
	'HELP': 'help',
	'*H': 'history',
	'DC*': 'directConnectionList',
	'$V:': 'mostRestrictiveSegmentRules',
	'$V/CMB': 'ruleCombinations',
	'$EX NAME': 'exchangeTicketMask',
	'$MR       TOTAL ADD COLLECT': 'confirmExchangeFareDifferenceMask',
	'*TE': 'ticketMask',
	'*LF': 'storedPricing', // '*LF', '*LF1'
	'HHMCU': 'submitMcoMask',
	'*MCO': 'storedMcoMask', // '*MCO1', '*MCO2'
	'@:3SSR': 'addSsr',
	'@:3': 'addProgrammaticSsr',
	'B/': 'bridgeTo',
	'*$B': 'redisplayPriceItinerary',
	'0TURZOBK1XXX': 'addTurSegment',
	'COQ': 'movePnrToPccQueue',
	'JV': 'verifyCreditCard',
	'QEP': 'movePnrToQueue',
	'QC': 'queueCount',
	'QLD': 'queueRecordLocators',
	'QI': 'ignoreMoveToQueue',
	'SON': 'signIn',
	'SOF': 'signOut',
	'STD': 'createAgent',
	'RRVO': 'voidTicket',
	'RRVE': 'exchangeTicket',
	'HBRF': 'refundTicket',
	'HB': 'issueTickets',
	'QMDR': 'qmdr',
	'Q': 'openQueue',
	'XX': 'calculator',
	'F-': 'addFormOfPayment',
	'F:': 'operationalInfo',
	'9V': 'seatMap',
	'HMP': 'soldTicketsDailyReport',
	'TI-': 'visaAndHealthInfo',
	'T:$B': 'storePricing', // store Ticketing pricing
	'MV/': 'fillFromProfile',
	'MVT/': 'addAgencyInfo', // add agency info
	'$D': 'fareSearch', // HELP TARIFF DISPLAY-BASIC OR VALIDATED
	'FD': 'fareDetailsFromTariff',
	'$LR': 'routingFromTariff',
	'*$D': 'redisplayFareSearch',
	'S*': 'encodeOrDecode', // HELP ENCODE OR DECODE
	'A*': 'moreAirAvailability',
	'A-': 'lessAirAvailability',
	'A': 'airAvailability', // HELP AVAILABILITY-STANDARD
	'.': 'changeSegmentStatus', // HELP PNR-CHANGE SEGMENT STATUS
	'C:PS': 'changePsRemark',
	'CAL': 'carAvailability', // HELP CAR-AVAILABILITY
	'FZ': 'convertCurrency', // HELP FZS (currency conversion)
	'S': 'changeWorkArea',
	'$TA': 'manualStoreTaxes',
	'$NME': 'manualStoreItinerary',
	'$MD': 'manualStoreMoveDown',
	'$FC': 'manualStoreFareCalculation',
	// usually >RESALL;
	'RE': 'storeAndCopyPnr',
	'DN': 'divideBooking',
	'$LB': 'showBookingClassOfFare',
	'L@': 'availabilityThroughLink',
	'DCT': 'minConnectionTimeTable',
};

const regex = [
	[/^VIT[A-Z0-9]{2}\d+\/\d{1,2}[A-Z]{3}$/, 'flightRoutingAndTimes'], // flight routing and times
	[/^FQN\d*$/, 'fareList'], // Fare Components For i-th ptc group in pricing
	[/^FN\d+$/, 'fareRulesMenu'], // show available sections of i-th fare
	[/^\$V\d+\/?$/, 'fareRulesMenuFromTariff'], // show available sections of i-th fare
	[/^FN\d+\/S$/, 'fareRulesSummary'], // navigate through them with summary
	[/^FN\d+(\/\d+(\-\d+)?|\/[A-Z]{3})+/, 'fareRules'], // get k-th fare rule section of i-th fare
	[/^\$V(\/\d+(\-\d+)?|\/[A-Z]{3})+/, 'fareRulesFromMenu'],
	[/^\$V\d+(\/\d+(\-\d+)?|\/[A-Z]{3})+/, 'fareRulesFromTariff'],
	[/^T:V\d*$/, 'restorePricing'],
	[/^\*R(\||$)/, 'redisplayPnr'], // ENTIRE RECORD
	[/^\*I(\||$)/, 'itinerary'], // ITINERARY
	[/^(?:\/\d+){2}(?:[|+-]\d+)*$/, 'reorderSegments'],
	[/^(?:\/\d+)$/, 'setNextFollowsSegment'],
	[/^FS\d*[A-Z]{3}(\d+[A-Z]{3}[A-Z]{3})+.*$/, 'lowFareSearch'], // HELP FSU (Unbooked)
	[/^FS\d+$/, 'sellFromLowFareSearch'],
	[/^MORE\*\d+$/, 'lowFareSearchNavigation'],// AT THE SAME PRICE AS PRICING OPTION \d
	[/^FS\*\d+$/, 'lowFareSearchNavigation'],// VIEW FARE DETAILS FOR PRICING OPTION \d
	[/^FSMORE$/, 'lowFareSearchNavigation'],// VIEW MORE PRICING OPTIONS
	[/^\*FS$/, 'lowFareSearchNavigation'], // RETURN TO THE ORIGINAL PRICING OPTION SCREEN
	[/^FS-$/, 'lowFareSearchNavigation'], // RETURN TO THE PREVIOUS SCREEN
	[/^FS\/\/.*$/, 'lowFareSearchFromPnr'], // HELP FSA (Availabilities for current reservation)
	// there are also "HELP FSP and HELP FSC" for filters when working within a reservation,
	// but i believe we don't use them much, please, add the regex-es here if i am wrong
	[/^FS.*/, 'lowFareSearchUnclassified'],
];

exports.exact = exact;
exports.start = start;
exports.regex = regex;