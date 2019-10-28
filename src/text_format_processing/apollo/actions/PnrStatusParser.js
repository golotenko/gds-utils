
const php = require('enko-fundamentals/src/Transpiled/php.js');

const STATUS_EXECUTED = 'EXECUTED';
const STATUS_SIMULTANEOUS_CHANGES = 'SIMULTANEOUS_CHANGES';
const STATUS_GDS_ERROR = 'GDS_ERROR';

const checkPnrDumpIsRestricted = (dump) => {
	dump = php.preg_replace(/\s*(><)?\s*$/, '', dump);
	return php.preg_match(/^RESTRICTED PNR-CALL HELP DESK$/, php.trim(dump))
		|| php.preg_match(/^RESTRICTED PNR$/, php.trim(dump))
		|| php.preg_match(/^AG - DUTY CODE NOT AUTH FOR CRT - APOLLO$/, php.trim(dump))
		|| php.preg_match(/^NO AGREEMENT EXISTS FOR PSEUDO CITY.*$/, php.trim(dump))
		|| php.preg_match(/^PROVIDER PSEUDO CITY DOES NOT HAVE AGREEMENT WITH.*$/, php.trim(dump));
};

const checkPnrDumpIsNotExisting = (dump) => {
	dump = php.preg_replace(/\s*(><)?\s*$/, '', dump);
	return php.preg_match(/^INVLD ADRS/, php.trim(dump))
		|| php.preg_match(/^INVALID RECORD LOCATOR$/, php.trim(dump))
		|| php.preg_match(/^UTR PNR \/ INVALID RECORD LOCATOR$/, php.trim(dump));
};

const detectOpenPnrStatus = (dump) => {
	if (checkPnrDumpIsNotExisting(dump)) {
		return 'notExisting';
	} else if (checkPnrDumpIsRestricted(dump)) {
		return 'isRestricted';
	} else if (php.preg_match(/^\s*FIN OR IGN\s*(><)?\s*$/, dump)) {
		return 'finishOrIgnore';
	} else if (php.preg_match(/^\s*\S[^\n]*\s*(><)?\s*$/, dump)) {
		// any single line is treated as error
		return 'customError';
	} else {
		// there are many ways for agent to open a PNR and tweak
		// output, so matching anything that is not an error is safer
		return 'available';
	}
};

// 'SIMULT CHGS TO PNR',
// '><',
const parseErrorType = ($dump) => {
	let $clean;
	$clean = php.preg_replace(/(\)?><)$/, '', $dump);
	if (php.trim($clean) === 'SIMULT CHGS TO PNR') {
		return STATUS_SIMULTANEOUS_CHANGES;
	} else {
		return null;
	}
};

const parseSavePnr = (dump) => {
	let matches = [];
	if (php.preg_match(/^OK - (?<recordLocator>[A-Z0-9]{6})-/, dump, matches = [])) {
		return {
			success: true,
			status: STATUS_EXECUTED,
			recordLocator: matches.recordLocator,
			raw: dump,
		};
	} else {
		return {
			success: false,
			status: parseErrorType(dump),
			recordLocator: null,
			raw: dump,
		};
	}
};

exports.parseSavePnr = parseSavePnr;
exports.detectOpenPnrStatus = detectOpenPnrStatus;

exports.STATUS_EXECUTED = STATUS_EXECUTED;
exports.STATUS_SIMULTANEOUS_CHANGES = STATUS_SIMULTANEOUS_CHANGES;
exports.STATUS_GDS_ERROR = STATUS_GDS_ERROR;
