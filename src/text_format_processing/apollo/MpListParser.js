
const php = require('enko-fundamentals/src/Transpiled/php.js');

// '01. NEDZA    E DL     2380160040*                              '
// '01. KIANI    S UA       NS171261*                              '
const parseMileageProgramWithPassengerLine = (line) => {
	let matches;
	if (php.preg_match(/^(\d{2})\.\s([A-Z\s|]{10})\s([A-Z]{2})\s+([A-Z\d]+)(.*?)\s*$/, line, matches = [])) {
		return {
			passengerNumber: matches[1],
			passengerName: matches[2],
			mileagePrograms: [{
				airline: matches[3],
				code: matches[4],
				unparsed: matches[5],
			}],
		};
	} else {
		return false;
	}
};

// '               KL     2105653453** -I 0                        '
const parseMileageProgramWithoutPassengerLine = (line) => {
	let matches;
	if (php.preg_match(/^\s{15}([A-Z]{2})\s+([A-Z\d]+)(.*?)\s*$/, line, matches = [])) {
		return {
			airline: matches[1],
			code: matches[2],
			unparsed: matches[3],
		};
	} else {
		return false;
	}
};

exports.parse = (dump) => {
	dump = php.rtrim(dump.replace(/><$/, ''));
	const passengers = [];
	if (dump.trim() === 'NO FREQ FLYER DATA') {
		return {passengers};
	}
	const lines = dump.split(/\n/);
	const headerLine = lines.shift();
	if (headerLine.trim() !== 'FREQUENT FLYER DATA:') {
		return {error: 'Unexpected start of *MP output - ' + headerLine};
	}
	for (const line of lines) {
		const asPax = parseMileageProgramWithPassengerLine(line);
		const asMp = parseMileageProgramWithoutPassengerLine(line);
		if (asPax) {
			passengers.push(asPax);
		} else if (asMp && passengers.length > 0) {
			passengers[passengers.length - 1].mileagePrograms.push(asMp);
		} else if (line.trim()) {
			return {error: 'Unexpected *MP line - ' + line, passengers};
		}
	}
	return {passengers};
};
