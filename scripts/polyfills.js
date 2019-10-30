// adds some must-have es6+ methods to prototypes, possibly should
// use some lib here if amount of these functions surpasses 1...

Array.prototype.flatMap = function(flatten) {
	const result = [];
	for (const el of this) {
		const chunk = flatten(el);
		result.push(...chunk);
	}
	return result;
};
