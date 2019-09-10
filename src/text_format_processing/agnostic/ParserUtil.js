const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * if your dump has a sequence of lines following same format, like list of passengers,
 * or list of segments, you can pass here the function that parses each line or returns
 * null on the first line where we should stop
 *
 * @template T
 *
 * @param {string[]} linesLeft
 * @param {function(string): T|null}
 * @return {[T, string[]]}
 */
exports.parseSequence = (linesLeft, parse) => {
	linesLeft = [...linesLeft];
	const parsedLines = [];
	let line;
	while ((line = linesLeft.shift()) !== undefined) {
		const parsedLine = parse(line);
		if (parsedLine) {
			parsedLines.push(parsedLine);
		} else {
			linesLeft.unshift(line);
			break;
		}
	}
	return [parsedLines, linesLeft];
};

// '15K', '2P', '1PC', '25', '50'
exports.parseBagAmountCode = (code) => {
	const match = code.match(/^(\d{0,2})([A-Z]{0,3})$/);
	if (match) {
		const [, amount, unitsCode] = match;
		const codeMap = {
			'P': 'pieces',
			'PC': 'pieces',
			'K': 'kilograms',
			'KG': 'kilograms',
			'L': 'pounds',
			'LB': 'pounds',
			'NIL': null,
			'': 'airlineDefaultUnits',
		};
		return {
			units: codeMap[unitsCode],
			amount: amount,
			unitsCode: unitsCode,
			raw: code,
		};
	} else {
		return null;
	}
};

/*
 * //          ' 2 UA 999S 19DEC EWRBRU HK1   635P  750A|*      SA/SU   E  1'
 * $pattern = 'NNAAAFFFFS_DDDDDCCCCRRRQQQQQTTTTTTTZZZZZ_KYYYYYYYYYYYLLLLUUUUUUU';
 * @param $str -- string we want to split
 * @param $pattern -- marker string to define split positions
 */
exports.splitByPosition = (str, pattern, names = null, trim = false) => {
	if (!names) {
		const symbols = php.str_split(pattern, 1);
		names = php.array_combine(symbols, symbols);
	}
	const letters = [];
	let position = 0;
	for (const markerChar of php.str_split(pattern)) {
		if (php.array_key_exists(markerChar, letters)) {
			letters[markerChar] += php.mb_substr(str, position, 1);
		} else {
			letters[markerChar] = php.mb_substr(str, position, 1);
		}
		++position;
	}
	const result = {};
	for (const [markerChar, name] of Object.entries(names)) {
		result[name] = trim ? php.trim(letters[markerChar]) : letters[markerChar];
	}
	return result;
};

exports.wrapLinesAt = (str, wrapAt) => {
	const lines = str.split('\n');
	const result = [];
	for (const line of lines) {
		if (php.mb_strlen(line) > wrapAt) {
			for (const subLine of php.str_split(line, wrapAt)) {
				result.push(subLine);
			}
		} else {
			result.push(line);
		}
	}
	return result.join('\n');
};

const monthIndex = {JAN: 1,FEB: 2,MAR: 3,APR: 4,MAY: 5,JUN: 6,JUL: 7,AUG: 8,SEP: 9,OCT: 10,NOV: 11,DEC: 12};

const gdsMonthToNumber = (str) => {
	if (php.array_key_exists(str, monthIndex)) {
		return monthIndex[str];
	} else {
		return null;
	}
};

/**
 * Accepts date in format '09FEB' of '9FEB'
 * and returns in format 'm-d'
 */
const parsePartialDate = (date) => {
	date = php.str_pad(date, 5, '0', php.STR_PAD_LEFT);
	let tokens = php.preg_match(/^(?<day>[0-9]{2})(?<month>[A-Z]{3})$/, date);
	if (tokens) {
		const day = tokens.day;
		const monthRes = gdsMonthToNumber(tokens.month);
		if (monthRes) {
			const month = gdsMonthToNumber(tokens.month);
			// Of course, it can be any year, but it's the easiest way to
			// validate date: 2016 is a leap year, so if date is valid, it
			// exists in 2016
			const fullDate =
				'2016-' + php.str_pad(php.strval(month), 2, '0', php.STR_PAD_LEFT) + '-' + php.str_pad(php.strval(day), 2, '0', php.STR_PAD_LEFT);
			if (fullDate === php.date('Y-m-d', php.strtotime(fullDate))) {
				return php.date('m-d', php.strtotime(fullDate));
			}
		}
	}
	return null;
};

/**
 * It doesn't try to guess anything, so as we have 2-digit year in the
 * original string, we still do have it in result: 'y-m-d'
 */
exports.parseFullDate = (str) => {
	const match = str.match(/^(?<dateDayAndMonth>\d{1,2}[A-Z]{3})(?<dateYear>\d{2})$/);
	if (match) {
		const parsedDayAndMonth = parsePartialDate(match.groups.dateDayAndMonth);
		if (parsedDayAndMonth){
			return match.groups.dateYear + '-' + parsedDayAndMonth;
		}
	}
	return null;
};

exports.gdsDayOfWeekToNumber = (str) => {
	const dayOfWeekIndex = {MO: 1,TU: 2,WE: 3,TH: 4,FR: 5,SA: 6,SU: 7};
	if (php.array_key_exists(str, dayOfWeekIndex)) {
		return dayOfWeekIndex[str];
	} else {
		return null;
	}
};

const convertApolloTo12hModifier = (timeOfDayStr) => {
	if (timeOfDayStr == 'P' || timeOfDayStr == 'N') {
		// PM or noon
		return 'PM';
	} else if (timeOfDayStr == 'A' || timeOfDayStr == 'M') {
		// AM or midnight
		return 'AM';
	} else {
		return null;
	}
};

const parseGds12hTime = ($timeStr) => {
	const $paddedTime = php.str_pad($timeStr.trim(), 5, '0', php.STR_PAD_LEFT);
	const $timeOfDayStr = php.substr($paddedTime, 4);
	let $hours = php.substr($paddedTime, 0, 2);
	$hours = $hours === '00' ? '12' : $hours;
	const $minutes = php.substr($paddedTime, 2, 2);
	const $hours12ModRes = convertApolloTo12hModifier($timeOfDayStr.trim());
	if (!$hours12ModRes) {
		return null;
	}
	const $hours12Mod = $hours12ModRes;
	const $hours12 = $hours + ':' + $minutes + ' ' + $hours12Mod;
	const $timestamp = php.strtotime($hours12);
	if ($timestamp) {
		return php.date('H:i', $timestamp);
	} else if ($hours > 12 && $hours12Mod === 'AM'){
		// '1740A', agent mistyped, but I guess there is no harm parsing it...
		return parseGds24hTime($hours + $minutes);
	} else {
		return null;
	}
};

const parseGds24hTime = ($timeStr) => {
	const $paddedTime = php.str_pad($timeStr.trim(), 4, '0', php.STR_PAD_LEFT);
	const $hours = php.substr($paddedTime, 0, 2);
	const $minutes = php.substr($paddedTime, 2, 2);
	return $hours + ':' + $minutes;
};

exports.decodeGdsTime = (timeStr) => {
	timeStr = timeStr.trim();
	if (php.preg_match(/^\d+[A-Z]$/, timeStr)) {
		return parseGds12hTime(timeStr);
	} else if (php.preg_match(/^\d+$/, timeStr)) {
		return parseGds24hTime(timeStr);
	} else {
		return null;
	}
};

exports.parsePartialDate = parsePartialDate;