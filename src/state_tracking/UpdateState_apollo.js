const SellStatusParser = require('../text_format_processing/apollo/actions/SellStatusParser.js');
const StateHelper = require('./StateHelper.js');
const PnrStatusParser = require('../text_format_processing/apollo/actions/PnrStatusParser.js');
const PnrParser = require('../text_format_processing/apollo/pnr/PnrParser.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');
const CmdParser = require('../text_format_processing/apollo/commands/CmdParser.js');

const isValidPricingOutput = (output) => {
	const tooShortToBeValid = !output.match(/\n.*\n.*\n/);
	return !tooShortToBeValid;
};

const isValidPricing = (cmd, output) => {
	const type = CmdParser.parse(cmd).type;
	return ['priceItinerary', 'storePricing'].includes(type)
		&& isValidPricingOutput(output);
};

const detectPartialResallSuccessError = (dump) => {
	let matches;
	if (php.preg_match(/^\s*RE SUCCESSFUL THRU SEGMENT\s+(\d+)\s*$/, dump, matches = [])) {
		const [, $repeatedSegmentCount] = matches;
		return {repeatedSegmentCount: $repeatedSegmentCount};
	} else {
		return null;
	}
};

const handleApolloCopyPnr = (sessionData, output) => {
	output = output.replace(/\)?><$/, '');
	const parsed = PnrParser.parse(output);
	const sections = PnrParser.splitToSections(output);
	delete sections.HEAD;
	const isEmpty = (val) => php.empty(val);
	const isValidPnrOutput = !php.empty(parsed.itineraryData)
		|| !php.empty(parsed.passengers.passengerList)
		|| !Object.values(sections).every(isEmpty, sections);
	if (isValidPnrOutput || detectPartialResallSuccessError(output)) {
		// PNR data data was copied
		sessionData.recordLocator = '';
		sessionData.isPnrStored = false;
		sessionData.hasPnr = true;
		sessionData.itinerary = parsed.itineraryData || [];
	} else if (output.match(/^\s*MODIFY\s*(><)?$/)) {
		// nothing happened
	} else {
		// everything else probably is error (typo, etc...)
	}
	return sessionData;
};

const isPnrListOutput = (output) => {
	output = output.replace(/\)?><$/, '');
	const regex = /^([A-Z0-9]{3,4})-(.+?)\s*(\d{1,3} NAMES ON LIST)/;
	return output.match(regex)
		|| output.trim() === 'NO NAMES';
};

const wasSinglePnrOpenedFromSearch = (output) => {
	output = output.replace(/><$/, '');
	return !isPnrListOutput(output)
		&& output.trim() !== 'FIN OR IGN'
		&& output.trim() !== 'AG - DUTY CODE NOT AUTH FOR CRT - APOLLO'
	;
};

const wasPnrOpenedFromList = (output) => {
	output = output.replace(/><$/, '');
	return output.trim() !== 'FIN OR IGN'
		&& output.trim() !== 'AG - DUTY CODE NOT AUTH FOR CRT - APOLLO'
		&& output.trim() !== 'INVLD';
};

const wasIgnoredOk = (output) => output.match(/^\s*IGND\s*(><)?\s*$/);
const wasPccChangedOk = dump => dump.includes('PROCEED');
const wasAreaChangedOk = dump => php.preg_match(/[A-E]-IN-AG/, dump)
	|| php.preg_match(/[A-E]-OUT\s[A-E]-IN\sAG/, dump)
	|| php.preg_match(/CURRENTLY\sUSING\s[A-E]{3}/, dump);

const assertCancelledOk = clean => {
	return clean.match(/^\s*SEGMENTS CANCELLED - NEXT REPLACES\s*(\d+)\s*(?:><)?$/)
		|| clean.match(/^[\s\S]*\s*CNLD FROM\s*(\d+)\s*(?:><)?$/)
		|| clean.match(/^\s*NEXT REPLACES\s*(\d+)\s*(?:><)?$/)
		|| clean.match(/^\s*CANCEL REQUEST COMPLETED\s*(?:><)?$/);
};

const isZero = seg => !seg.segmentNumber || seg.segmentNumber === '0';

/** @param {Object|null} agent = require('Agent.js')() */
const UpdateState_apollo = ({
	cmd, output, sessionState, getAreaData,
}) => {
	sessionState = {...sessionState};
	const getAreaDataUnsafe = getAreaData;
	getAreaData = (letter) => ({...getAreaDataUnsafe(letter)});
	const stepFlags = [];

	const consumeNewSegments = (segments) => {
		if (segments.length > 0) {
			sessionState.hasPnr = true;
			const itinerary = [...sessionState.itinerary || []];
			let nextAddSegmentNumber = sessionState.nextAddSegmentNumber || itinerary.length + 1;
			sessionState.nextAddSegmentNumber = null;
			for (const segment of segments) {
				const segNum = !isZero(segment)
					&& segment.segmentNumber <= itinerary.length + 1
					? segment.segmentNumber
					: nextAddSegmentNumber++;
				itinerary.splice(segNum - 1, 0, segment);
			}
			sessionState.itinerary = itinerary;
		}
	};

	const consumeFullItinerary = (clean, ignoreEmpty = false) => {
		const segments = PnrParser.parse(clean).itineraryData || [];
		if (segments.length > 0 || !ignoreEmpty) {
			sessionState.itinerary = segments;
			stepFlags.push('fullItineraryKnown');
		}
	};

	const handle_sell = (output) => {
		const parsed = SellStatusParser.parse(output);
		consumeNewSegments(parsed.segments);
	};

	const handle_deletePnrField = (data, clean) => {
		if (!data && data.field !== 'itinerary') {
			return;
		}

		const cancelSegNums = !data.applyToAllAir
			? (data.segmentNumbers || [])
			: (sessionState.itinerary || [])
				.map(s => s.segmentNumber);
		const rebookSegNumsLeft = [...cancelSegNums];
		const rebookedSegments = SellStatusParser.parse(clean).segments
			.map(s => ({...s,
				segmentNumber: !isZero(s)
					? s.segmentNumber
					: rebookSegNumsLeft.shift(),
			}));
		const asCancel = assertCancelledOk(clean);
		if (asCancel || rebookedSegments.length > 0) {
			sessionState.itinerary = (sessionState.itinerary || [])
				.filter((s, i) => !cancelSegNums.includes(+i + 1))
				.map((s, i) => ({...s, segmentNumber: +i + 1}));
			consumeNewSegments(rebookedSegments);
		}
		if (asCancel && asCancel[1]) {
			sessionState.nextAddSegmentNumber = asCancel[1];
		}
	};

	const updateState = (cmd, output) => {
		const clean = php.preg_replace(/\)?><$/, '', output);
		const commandTypeData = CmdParser.parse(cmd);
		const {type, data} = commandTypeData;
		if (isValidPricing(cmd, output)) {
			sessionState.pricingCmd = cmd !== '$BBQ01'
				? cmd : sessionState.pricingCmd;
		} else if (!php.in_array(type, StateHelper.createPqSafeTypes)) {
			sessionState.pricingCmd = null;
		}
		if (php.preg_match(/^\s*\*\s*(><)?\s*$/, output)) {
			// "*" output is returned by most Apollo writing commands
			// on success - this triggers PNR creation if context was empty
			sessionState.hasPnr = true;
		}
		let recordLocator = '';
		let openPnr = false;
		let dropPnr = false;

		if (type === 'storePnr') {
			dropPnr = PnrStatusParser.parseSavePnr(output).success;
		} else if (type === 'ignore') {
			dropPnr = wasIgnoredOk(output);
		} else if (type === 'ignoreKeepPnr') {
			dropPnr = php.preg_match(/^\s*NO TRANS AAA\s*(><)?\s*$/, output);
		} else if (type === 'storeAndCopyPnr') {
			sessionState = handleApolloCopyPnr(sessionState, output);
		} else if (php.in_array(type, StateHelper.dropPnrContextCommands)) {
			dropPnr = true;
			// Invalid command: returns INVLD ADDRS, breaks PNR state
		} else if (cmd === '*R*@*R*') {
			dropPnr = true;
			// Invalid command: '*ACOSTA/MONICA BAUTISTA' with output INVLD breaks PNR state
		} else if (php.preg_match(/^\*[A-Z0-9]+\//, cmd) && output.startsWith('INVLD')) {
			dropPnr = true;
		} else if (type === 'changePcc' && wasPccChangedOk(output, data)) {
			sessionState.pcc = data;
		} else if (type === 'sell') {
			handle_sell(output);
		} else if (type === 'deletePnrField') {
			handle_deletePnrField(data, clean);
		} else if (type === 'setNextFollowsSegment' && data) {
			sessionState.nextAddSegmentNumber = +data.segmentNumber + 1;
		} else if (type === 'openPnr') {
			const openPnrStatus = PnrStatusParser.detectOpenPnrStatus(output);
			if (php.in_array(openPnrStatus, ['notExisting', 'isRestricted'])) {
				dropPnr = true;
			} else if (openPnrStatus === 'available') {
				recordLocator = data;
				openPnr = true;
			}
		} else if (type === 'storeKeepPnr') {
			if (recordLocator = PnrStatusParser.parseSavePnr(output).recordLocator || null) {
				openPnr = true;
			}
		} else if (type === 'searchPnr') {
			if (wasSinglePnrOpenedFromSearch(output)) {
				recordLocator = (PnrParser.parse(output).headerData.reservationInfo || {}).recordLocator;
				openPnr = true;
			} else if (isPnrListOutput(output)) {
				dropPnr = true;
			}
		} else if (type === 'displayPnrFromList') {
			if (wasPnrOpenedFromList(output)) {
				recordLocator = (PnrParser.parse(output).headerData.reservationInfo || {}).recordLocator;
				openPnr = true;
			}
		} else if (type === 'changeArea' && wasAreaChangedOk(output)) {
			const areaData = getAreaData(data);
			areaData.area = data;
			sessionState = {...areaData};
			consumeFullItinerary(clean);
		} else if (type === 'reorderSegments') {
			consumeFullItinerary(clean, true);
		} else if (type === 'sellFromLowFareSearch') {
			if (php.preg_match(/^FS.*?\s+.*PRICING OPTION.*TOTAL AMOUNT\s*\d*\.?\d+[A-Z]{3}/s, output)) {
				sessionState.hasPnr = true;
			}
		} else if (type === 'redisplayPnr') {
			if (php.trim(clean) === 'INVLD') {
				dropPnr = true;
			} else {
				consumeFullItinerary(clean);
			}
		}
		if (openPnr) {
			stepFlags.push('pnrOpened');
			sessionState.itinerary = [];
			sessionState.recordLocator = recordLocator;
			sessionState.hasPnr = true;
			sessionState.isPnrStored = true;
		} else if (dropPnr) {
			stepFlags.push('pnrDropped');
			sessionState.itinerary = [];
			sessionState.recordLocator = '';
			sessionState.hasPnr = false;
			sessionState.isPnrStored = false;
		}
		return sessionState;
	};

	/** @param {IAreaState} sessionData
	 * @param {function(string): IAreaState} getAreaData */
	const execute = () => {
		const cmdParsed = CmdParser.parse(cmd);
		const flatCmds = php.array_merge([cmdParsed], cmdParsed.followingCommands || []);
		for (const cmdRec of flatCmds) {
			updateState(cmdRec.cmd, output);
		}
		sessionState.cmdType = cmdParsed ? cmdParsed.type : null;
		return sessionState;
	};

	execute();
	sessionState.stepFlags = stepFlags;

	return sessionState;
};

UpdateState_apollo.wasIgnoredOk = wasIgnoredOk;
UpdateState_apollo.wasPccChangedOk = wasPccChangedOk;

module.exports = UpdateState_apollo;
