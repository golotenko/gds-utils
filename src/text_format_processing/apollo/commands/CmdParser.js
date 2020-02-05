const Parse_changePnrRemarks = require('./Parse_changePnrRemarks.js');
const Parse_changeSeats = require('./Parse_changeSeats.js');
const ParserUtil = require('../../agnostic/ParserUtil.js');
const Parse_airAvailability = require('./Parse_airAvailability.js');
const Parse_fareSearch = require('./Parse_fareSearch.js');
const Parse_changeMp = require('./Parse_changeMp.js');
const Parse_sell = require('./Parse_sell.js');
const PricingCmdParser = require('./Parse_priceItinerary.js');

const php = require("enko-fundamentals/src/Transpiled/php.js");
const SimpleTypes = require('./SimpleTypes');

// 1to1 mapping type/functions follow

// 'XT', 'XT2', 'XT4*6|7-9'
const parse_deleteStoredPricing = (cmd) => {
	const match = cmd.match(/^XT(\d[\d\|\*]*|)/);
	if (match) {
		const [, rangeStr] = match;
		return {
			pricingNumbers: !rangeStr ? [] :
				ParserUtil.parseRange(rangeStr, '|', '*'),
		};
	} else {
		return null;
	}
};

// 'XI', 'XA', 'X5', 'X1|4', 'X1-3|5', 'X2/01B1', 'X4/0SK93F8NOVLAXCPHNN2'
const parse_deletePnrField = (cmd) => {
	if (!cmd.startsWith('X')) {
		return null;
	}
	const textLeft = php.substr(cmd, 1);
	let matches;
	if (php.preg_match(/^([AI]|\d[\-\|\d]*)(\/.*|)$/, textLeft, matches = [])) {
		const [, range, textLeft] = matches;
		let applyToAllAir, segmentNumbers;
		if (range === 'I' || range === 'A') {
			applyToAllAir = true;
			segmentNumbers = [];
		} else {
			applyToAllAir = false;
			segmentNumbers = ParserUtil.parseRange(range, '|', '-');
		}
		return {
			field: 'itinerary',
			applyToAllAir: applyToAllAir,
			segmentNumbers: segmentNumbers,
			sell: textLeft ? Parse_sell(php.ltrim(textLeft, '/')) : null,
		};
	} else {
		return {field: null, unparsed: textLeft};
	}
};

// '/2|Y', '/3|01Y3', '/4|0UA15Y3DECLAXSFONN1'
const parse_insertSegments = ($cmd) => {
	let $matches, $_, $segNum, $value;
	if (php.preg_match(/^\/(\d+)\|(\S.*)$/, $cmd, $matches = [])) {
		[$_, $segNum, $value] = $matches;
		return {
			insertAfter: $segNum,
			sell: Parse_sell($value),
		};
	} else {
		return null;
	}
};

const parse_changeArea = (cmd) => {
	const matches = cmd.match(/^S([A-E])$/);
	if (matches) {
		return matches[1];
	} else {
		return null;
	}
};

const parse_changePcc = (cmd) => {
	let matches;
	const filter = /^SEM\/([A-Z0-9]{3,4})\/AG$/;
	if (php.preg_match(filter, cmd, matches = [])) {
		return matches[1];
	} else {
		return null;
	}
};

const parse_priceItinerary = (cmd) => {
	if (cmd.match(/^\$B{1,2}/)) {
		return PricingCmdParser.parse(cmd);
	} else {
		return null;
	}
};

const parse_priceItineraryManually = (cmd) => {
	let matches;
	if (php.preg_match(/^(HH\$?PR)(.*?)\s*$/, cmd, matches = [])) {
		const [_, baseCmd, modsStr] = matches;
		const mods = PricingCmdParser.parsePricingModifiers(modsStr);
		return {
			baseCmd: baseCmd,
			pricingModifiers: mods,
		};
	} else {
		return null;
	}
};

const parse_storePricing = (cmd) => {
	if (cmd.startsWith('T:$B')) {
		const pricingCmd = php.substr(cmd, php.strlen('T:'));
		return parse_priceItinerary(pricingCmd);
	} else {
		return null;
	}
};


// bulk type functions follow

const parseChainableCmd = (cmd) => {
	const simplePatterns = [
		[/^@:5(.+?)(\||$)/, 'addRemark'],
		[/^PS-(.+?)(\||$)/, 'psRemark'],
		[/^I(\||$)/, 'ignore'],
		[/^P:(.*?)(\||$)/, 'addAgencyPhone'],
		[/^R:(.*?)(\||$)/, 'addReceivedFrom'],
		[/^N:(.*?)(\||$)/, 'addName'],
		[/^T:TAU\/(.*?)(\||$)/, 'addTicketingDateLimit'],
		[/^T-(.*?)(\||$)/, 'addAccountingLine'],
		[/^\*\s*([A-Z0-9]{6})(\||$)/, 'openPnr'],
		[/^C:(\d+)@:3(\||$)/, 'cancelSsr'],
		[/^\*(\d{1,3})(\||$)/, 'displayPnrFromList'],
		[/^\*\*([^|]*?-[A-Z][^|]*?)(\||$)/, 'searchPnr'],
	];
	for (const [pattern, name] of simplePatterns) {
		const matches = cmd.match(pattern);
		if (matches) {
			const [raw, data] = matches;
			return {
				cmd: php.rtrim(raw, '|'),
				type: name,
				data: data || null,
				textLeft: php.mb_substr(cmd, php.mb_strlen(raw)),
			};
		}
	}
	return Parse_changePnrRemarks(cmd)
		|| null;
};

const parseBulkCommand = (cmd) => {
	const parsedCommands = [];
	let strCmd = cmd;
	while (!php.empty(strCmd)) {
		const parsedCmd = parseChainableCmd(strCmd);
		if (parsedCmd) {
			strCmd = parsedCmd.textLeft;
			delete parsedCmd.textLeft;
			parsedCommands.push(parsedCmd);
		} else {
			const parseTillEnd = parseSingleCommand(strCmd) || {
				cmd: strCmd,
				type: null,
				data: null,
			};
			parsedCommands.push(parseTillEnd);
			strCmd = '';
		}
	}
	const firstCmd = parsedCommands.shift()
		|| {cmd, type: null, data: null};
	firstCmd.followingCommands = parsedCommands;
	return firstCmd;
};

const parseStorePnr = (cmd) => {
	const result = {keepPnr: false, sendEmail: false};
	if (!cmd.startsWith('E')) {
		return null;
	}
	let textLeft = cmd.slice(1);
	if (textLeft.startsWith('R')) {
		result.keepPnr = true;
		textLeft = php.substr(textLeft, 1);
	} else if (textLeft.startsWith('C')) {
		// store "cruise" PNR, works with normal PNR-s too
		textLeft = textLeft.slice(1);
	} else if (textLeft.startsWith('L')) {
		// store and show similar name list
		textLeft = textLeft.slice(1);
	}
	if (textLeft.startsWith('M')) {
		result.sendEmail = true;
		textLeft = php.substr(textLeft, 1);
		// $result['actionData'] = ['raw' => $textLeft];
		textLeft = '';
	}
	if (textLeft) {
		result.unparsed = textLeft;
	}
	return result;
};

const parseShowPnrFieldsCmd = (cmd) => {
	if (cmd.startsWith('*')) {
		const availableCommands = [
			'IA', 'IX', 'I', 'IC', 'IH', 'I', 'IN', 'IT',
			'PW', 'PC', 'PD', 'R', 'N', 'PO', 'P', 'PP',
			'P1', 'QM', 'PR', 'PRH', 'PS', 'PT', 'T',
		];
		const items = [];
		const substr = cmd.slice(1).split('|');

		for (const subCommand of substr) {
			const modifiers = subCommand.split('/');
			if (modifiers.length > 0) {
				const field = modifiers.shift();
				if (availableCommands.includes(field)) {
					items.push({field, modifiers});
				} else {
					return null;
				}
			}
		}
		if (items.length > 0) {
			return {
				cmd: cmd,
				type: 'showPnrFields',
				data: items,
			};
		}
	}
	return null;
};

const detectCommandType = (cmd) => {
	cmd = cmd.toUpperCase();
	cmd = cmd.trim();
	const startTuples = Object.entries(SimpleTypes.start)
		// put longest start patterns first
		.sort((a,b) => b[0].length - a[0].length);
	for (const [pattern, type] of startTuples) {
		if (cmd.startsWith(pattern)) {
			return type;
		}
	}
	for (const [pattern, name] of SimpleTypes.regex) {
		if (cmd.match(pattern)) {
			return name;
		}
	}
	return null;
};

const parseSingleCommand = (cmd) => {
	let data, type, parsed;
	if (type = SimpleTypes.exact[cmd]) {
		data = null;
	} else if (data = parse_changeArea(cmd)) {
		type = 'changeArea';
	} else if (data = parse_changePcc(cmd)) {
		type = 'changePcc';
	} else if (data = parse_priceItinerary(cmd)) {
		type = 'priceItinerary';
	} else if (data = parse_priceItineraryManually(cmd)) {
		type = 'priceItineraryManually';
	} else if (data = parse_storePricing(cmd)) {
		type = 'storePricing';
	} else if (data = Parse_sell(cmd)) {
		type = 'sell';
	// make sure these two are before parse_deletePnrField(),
	// as they all start with "X", but the last one is generic
	} else if (cmd.startsWith('XX')) {
		type = 'calculator';
	} else if (data = parse_deleteStoredPricing(cmd)) {
		type = 'deleteStoredPricing';
	} else if (data = parse_deletePnrField(cmd)) {
		type = 'deletePnrField';
	} else if (data = parse_insertSegments(cmd)) {
		type = 'insertSegments';
	} else if (data = Parse_fareSearch(cmd)) {
		type = 'fareSearch';
	} else if (parsed = Parse_changeMp(cmd)) {
		type = parsed.type;
		data = parsed.data;
	} else if (parsed = Parse_changeSeats(cmd)) {
		type = parsed.type;
		data = parsed.data;
	} else if (data = parseStorePnr(cmd)) {
		type = php.array_keys(php.array_filter({
			storePnrSendEmail: data.sendEmail,
			storeKeepPnr: data.keepPnr,
		}))[0] || 'storePnr';
	} else if (data = Parse_airAvailability(cmd)) {
		type = 'airAvailability';
	} else if (data = Parse_airAvailability.more(cmd)) {
		type = 'moreAirAvailability';
	} else if (parsed = parseChainableCmd(cmd)) {
		return parsed;
	} else if (type = detectCommandType(cmd)) {
		data = null;
	} else if (parsed = parseShowPnrFieldsCmd(cmd)) {
		// for rest PNR fields we gave no explicit names to
		return parsed;
	} else {
		return null;
	}
	return {cmd, type, data};
};

/**
 * takes terminal command typed by a user and returns it's type
 * and probably some more info in future, like Sabre-version of
 * this command, maybe description what it does, link to HELP, etc...
 */
const CommandParser = {
	/** @deprecated - use Parse_fareSearch.js */
	getCabinClasses: Parse_fareSearch.getCabinClasses,

	parse: (cmd) => {
		cmd = cmd.replace(/\+/g, '|');
		cmd = cmd.replace(/¤/g, '@');
		return parseBulkCommand(cmd);
	},
};

module.exports = CommandParser;
