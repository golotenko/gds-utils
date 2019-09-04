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
		const [$_, amount, unitsCode] = match;
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