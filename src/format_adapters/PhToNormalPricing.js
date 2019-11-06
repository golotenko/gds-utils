

/** @param phParsed = require('PhPricingParser.js').parse() */
module.exports = (phParsed) => {
	// skipping ptcNumber and segments
	return {
		displayType: phParsed.displayType,
		dates: null,
		fares: phParsed.pqList.map(pq => ({
			totals: pq.totals,
			taxList: pq.taxList,
		})),
		faresSum: phParsed.faresSum,
		pqList: phParsed.pqList.map(pq => ({
			fareBasisInfo: pq.fareBasisInfo,
			fareConstruction: pq.fareConstruction,
			fareConstructionInfo: pq.fareConstructionInfo,
			baggageInfo: pq.baggageInfo,
			baggageInfoDump: pq.baggageInfoDump,
		})),
		dataExistsInfo: phParsed.dataExistsInfo,
		additionalInfo: phParsed.messages,
		wasPqRetained: false,
	};
};