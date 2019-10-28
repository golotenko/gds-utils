
exports.decodeDayOffset = (token) => {
	token = token || '';
	// not a real format, but ¥ may appear when you paste
	// itinerary in Sabre and all "+"-s get normalized to "¥"-s
	token = token.replace('¥', '+');
	if (!token || token === '0') {
		return 0;
	} else if (token == '|' || token == '+') {
		return 1;
	} else if (token == '-') {
		return -1;
	} else if (+token) {
		return +token;
	} else {
		throw Error('Unknown day offset [' + token + ']');
	}
};
