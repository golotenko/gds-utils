
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