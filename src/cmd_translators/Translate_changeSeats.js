
const php = require('enko-fundamentals/src/Transpiled/php.js');

class Translate_changeSeats {
	static flattenPaxNums(paxRanges) {
		let paxNums, range, isGrouped;

		paxNums = [];
		for (range of Object.values(paxRanges)) {
			isGrouped = (minor) => {
				return minor !== null && minor != '1';
			};
			if (isGrouped(range.fromMinor) ||
				isGrouped(range.toMinor)
			) {
				// 1.0, 2.2, ... - grouped pax names, unsupported
				return null;
			} else {
				paxNums = php.array_merge(paxNums, php.range(range.from, range.to));
			}
		}
		return paxNums;
	}

	static glueApolloCmd(data, cancel, paxNums) {
		let cmd, segNums, seatCodes;

		cmd = '9';
		if (cancel) {
			if (php.count(data.seatCodes) > 1) {
				return null; // DOES NOT EXIST
			}
			cmd += 'X';
		} else {
			cmd += 'S';
		}
		if (!php.empty(paxNums)) {
			cmd += '/N' + paxNums.join('|');
		}
		if (!php.empty(segNums = data.segNums || [])) {
			cmd += '/S' + segNums.join('|');
		}
		if (!php.empty(seatCodes = data.seatCodes || [])) {
			cmd += '/' + seatCodes.join('');
		}
		const locType = (data.location || {}).parsed;
		if (locType === 'aisle') {
			cmd += '/A';
		} else if (locType === 'bulkhead') {
			return null; // DOES NOT EXIST
		}
		return cmd;
	}

	static glueGalileoCmd(data, cancel, paxNums) {
		let cmd, segNums, seatCodes, location, hasParams, locLetter;

		cmd = 'S.';
		if (!php.empty(paxNums)) {
			cmd += 'P' + paxNums.join('.');
		}
		if (!php.empty(segNums = data.segNums || [])) {
			cmd += 'S' + segNums.join('.', );
		}
		if (!php.empty(seatCodes = data.seatCodes || [])) {
			cmd += '/' + seatCodes.join('/');
		}
		if (cancel) {
			if (!php.empty(data.seatCodes)) {
				return null; // DOES NOT EXIST
			}
			cmd += '@';
		} else {
			// can't specify location with seat codes obviously
			if (php.empty(data.seatCodes)) {
				location = (data.location || {}).parsed || 'window';
				hasParams = !php.empty(data.paxRanges) || !php.empty(data.segNums);
				locLetter = {window: 'W', aisle: 'A', bulkhead: 'B'}[location];
				cmd += (hasParams ? '/' : '') + 'N' + locLetter;
			}
		}
		return cmd;
	}

	static glueSabreCmd(data, cancel, paxNums) {
		let cmd = '4G' + (cancel ? 'X' : '');
		const segNums = data.segNums || [];
		if (!php.empty(segNums)) {
			cmd += segNums.join(',');
		} else {
			cmd += (cancel ? 'ALL' : 'A');
		}
		const seatCodes = data.seatCodes || [];
		if (!php.empty(seatCodes)) {
			cmd += '/' + seatCodes.join('');
		} else if (!cancel) {
			location = (data.location || {}).parsed || 'window';
			cmd += '/' + {aisle: 'A', window: 'W', bulkhead: 'X'}[location];
		}
		if (!php.empty(paxNums)) {
			const addMinor = (num) => num + '.1';
			cmd += '-' + paxNums.map(addMinor).join(',');
		}
		return cmd;
	}

	static glueAmadeusCmd(data, cancel, paxNums) {
		let cmd = 'S';
		if (cancel) {
			if (!php.empty(data.seatCodes) || !php.empty(paxNums)) {
				return null; // NON-TRANSLATABLE
			}
			cmd += 'X';
		} else {
			cmd += 'T';
		}
		const seatCodes = data.seatCodes || [];
		if (!php.empty(seatCodes)) {
			cmd += '/' + seatCodes.join('/');
		} else if (!cancel) {
			location = (data.location || {}).parsed || 'window';
			cmd += '/' + {aisle: 'A', window: 'W', bulkhead: 'B'}[location];
		}
		if (!php.empty(paxNums)) {
			cmd += '/P' + paxNums.join(',');
		}
		const segNums = data.segNums || [];
		if (!php.empty(segNums)) {
			cmd += '/S' + segNums.join(',');
		}
		return cmd;
	}

	static glueTranslatedData(toGds, parsed) {
		if (php.empty(parsed.data)) {
			return null;
		}
		const paxRanges = (parsed.data || {}).paxRanges || [];
		let paxNums = [];
		if (!php.empty(paxRanges)) {
			if (php.empty(paxNums = this.flattenPaxNums(paxRanges))) {
				return null;
			}
		}
		const data = parsed.data;
		const cancel = parsed.type === 'cancelSeats';
		if (toGds === 'apollo') {
			return this.glueApolloCmd(data, cancel, paxNums);
		} else if (toGds === 'galileo') {
			return this.glueGalileoCmd(data, cancel, paxNums);
		} else if (toGds === 'sabre') {
			return this.glueSabreCmd(data, cancel, paxNums);
		} else if (toGds === 'amadeus') {
			return this.glueAmadeusCmd(data, cancel, paxNums);
		} else {
			return null;
		}
	}

	/** @param parsed = require('CmdParser.js').parse() */
	static translate(parsed, fromGds, toGds) {
		return this.glueTranslatedData(toGds, parsed);
	}
}

module.exports = ({parsed, fromGds, toGds}) => Translate_changeSeats.translate(parsed, fromGds, toGds);
