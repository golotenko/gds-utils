
const exact = {
	RT: 'redisplayPnr',
	RTI: 'itinerary',
	RTN: 'names',
	MT: 'moveTop',
	MU: 'moveUp',
	MDR: 'moveRest',
	M: 'moveDownShort',
	MD: 'moveDown',
	MB: 'moveBottom',
	IG: 'ignore',
	IR: 'ignoreKeepPnr',
	ETX: 'deletePnr',
	ET: 'storePnr',
	ER: 'storeKeepPnr',
	JD: 'workAreas',
	DMI: 'verifyConnectionTimes',
	RRI: 'cloneItinerary',
	VFFD: 'frequentFlyerData',
	EF: 'fileDividedBooking',
};

const start = {
	'AD': 'airAvailability',
	'AC': 'changeAirAvailability',
	'SS': 'sell',
	'NM': 'addName',
	'APE': 'addEmail',
	'AP': 'addPhone',
	'TKTL': 'addTicketingDateLimit',
	'RF': 'addReceivedFrom',
	'RM': 'addRemark',
	'QT': 'queueCount',
	'QV/': 'queueRecordLocators',
	'Q': 'queueOperation',
	'X': 'deletePnrField',
	'DL': 'deletePnrField',
	'SX': 'cancelSeatElements',
	'JM': 'changeArea',
	'JI': 'signIn',
	'TRDC': 'voidTicket',
	'TTP': 'issueTickets',
	'HE': 'help',
	'DD': 'showTime',
	'DF': 'calculator',
	'FQQ': 'ptcPricingBlock',
	'FQD': 'fareSearch',
	'TWD': 'ticketMask',
	'TQT': 'storedPricing',
	'TTE': 'deleteStoredPricing',
	'FRN': 'statelessFareRules',
	'SP': 'divideBooking',
};

const regex = [
	[/^DO *\S.*/, 'flightServiceInfo'],
	[/^FQN *\S.*/, 'fareList'],
	[/^MD *\S.*/, 'moveDownByAlias'],
	[/^MU *\S.*/, 'moveUpByAlias'],
	[/^MT *\S.*/, 'moveTopByAlias'],
	[/^MB *\S.*/, 'moveBottomByAlias'],
	[/^MP *\S.*/, 'redisplayByAlias'],
];

exports.exact = exact;
exports.start = start;
exports.regex = regex;
