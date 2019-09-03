
exports.shortenRanges = (numbers) => {
	numbers = numbers.map(n => +n);
	const ranges = [];
	let from = -1;
	let to = -1;
	for (const num of Object.values(numbers)) {
		if (from > -1 && num == +to + 1) {
			to = num;
		} else {
			if (from > -1) {
				ranges.push({from, to});
			}
			from = num;
			to = num;
		}
	}
	ranges.push({from, to});
	return ranges;
};