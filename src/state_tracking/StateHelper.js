
/** @module - the common functionality for al GDS-es to be used in state processor implementations */

exports.mrCmdTypes = [
	'moveRest', 'moveDown', 'moveUp', 'moveTop', 'moveBottom', 'moveDownShort',
];
// "not affecting" means they do not change current PNR or pricing
exports.nonAffectingTypes = [
	...exports.mrCmdTypes,
	'redisplayPnr', 'itinerary', 'storedPricing', 'storedPricingNameData',
	'ticketList', 'ticketMask', 'passengerData', 'names', 'ticketing',
	'flightServiceInfo', 'frequentFlyerData', 'verifyConnectionTimes',
	'airItinerary', 'history', 'showTime', 'workAreas', 'fareList', 'fareRules', 'flightRoutingAndTimes',
	'moveDownByAlias', 'moveUpByAlias', 'moveTopByAlias', 'moveBottomByAlias', 'redisplayByAlias',
	'ptcPricingBlock', 'moveDownShort', 'pricingLinearFare', 'redisplayPriceItinerary',
];
exports.dropPnrContextCommands = [
	'ignore', 'ignoreAndCopyPnr','storePnr', 'storeAndCopyPnr',
	'priceItineraryManually', 'ignoreMoveToQueue','movePnrToQueue', 'movePnrToPccQueue',
];

exports.createPqSafeTypes = [
	...exports.nonAffectingTypes,
	// needed in Galileo to price multiple PTC-s without real names
	'addName', 'changeName',
];
