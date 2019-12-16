const ParserUtil = require('../../agnostic/ParserUtil.js');

const Rej = require('enko-fundamentals/src/Rej.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

const zip = rows => {
	if (rows.length === 0) {
		return [];
	} else {
		return rows[0].map((_,c) => rows.map(row => row[c]));
	}
};

class MaskUtil
{
	/**
	 * @return {[int, int][]} - start/end tuples
	 * note that '..' in 'HHMCU..' should match, but '.' in 'TX1 USD   67.60 US' should not
	 */
	static getMaskTokenPositions(mask)  {
		let i, inMask, positions, ch, start, end;
		mask = mask+' ';
		i = 1;
		inMask = false;
		positions = [];
		while (i < php.mb_strlen(mask)) {
			const prev = mask[i - 1];
			ch = php.mb_substr(mask, i, 1, 'utf-8');
			const next = mask[i + 1] || null;
			if ((prev === ';' || next === '.') && ch === '.' && !inMask) {
				start = i;
				inMask = true;
			}
			if (ch !== '.' && inMask) {
				end = i - 1;
				positions.push([start, end]);
				inMask = false;
			}
			i++;
		}
		return positions;
	}

	static parseMask(mask, fields, dump)  {
		let positions, result, field, position;
		positions = this.getMaskTokenPositions(mask);
		result = {};
		for ([field, position] of Object.values(zip([fields, positions]))) {
			result[field] = php.trim(php.mb_substr(dump, position[0], position[1] - position[0] + 1, 'utf-8'), '.');
		}
		return result;
	}

	static checkDumpMatchesMask(dump, mask)  {
		let i, dumpCh, maskCh;
		for (i = 0; i < php.mb_strlen(mask); i++) {
			dumpCh = php.mb_substr(dump, i, 1);
			maskCh = php.mb_substr(mask, i, 1);
			if (dumpCh !== maskCh && maskCh !== '.') {
				return 'at: ' + i + '; found: ' + dumpCh + '; expected: ' + maskCh;
			}
		}
		return null;
	}

	/**
	 * @param {string} output - GDS output of commands like HB:FEX or HHMCO
	 * @return {string} - valid mask: each line is padded with trailing whitespace to 64
	 *                  characters, '>' on first line is removed, then line breaks are removed
	 */
	static normalizeMask(output) {
		output = output.replace(/\s*><$/, '');
		output = ParserUtil.wrapLinesAt(output, 64);
		return output.split('\n')
			.map(l => (l + ' '.repeat(64)).slice(0, 64))
			.join('')
			.replace(/^>/, '')
			.replace(/\s*$/, '');
	}

	//==================================
	// Following related to dump generation
	//==================================

	/**
	 * determines value positions from ;. or .., but not applicable
	 * in commands that do not have ; before each value (like HHPR)
	 * @return {[int, int][]} - start/length tuples
	 */
	static _getPositionsFromGenericMask(cmd)  {
		const positions = this.getMaskTokenPositions(cmd);
		const makeStartAndLength = (tuple) => {
			const [start, end] = tuple;
			return [start, end - start + 1];
		};
		return positions.map(makeStartAndLength);
	}

	/**
	 * get positions from a dump, with manually placed special character
	 * in places where text should be entered (normally filled with dots)
	 * you can use '_' as the special character for example
	 */
	static getPositionsBy(specialChar, mask) {
		const positions = [];
		let startPos = -1;
		// +1 to cover last '_' char if any
		for (let i = 0; i < mask.length + 1; ++i) {
			const ch = mask[i];
			if (ch === specialChar) {
				if (startPos === -1) {
					startPos = i;
				}
			} else {
				if (startPos > -1) {
					const length = i - startPos;
					positions.push([startPos, length]);
					startPos = -1;
				}
			}
		}
		return positions;
	}

	static overwriteStr(str, needle, position, length)  {
		needle = php.strval(needle);
		const prefix = str.slice(0, position);
		let infix = '';
		const postfix = str.slice(position + length);
		for (let i = 0; i < length; ++i) {
			if (i < needle.length) {
				infix += needle[i];
			} else {
				let ch = str[position + i];
				if (ch !== '.' && ch !== ' ') {
					ch = '.';
				}
				infix += ch;
			}
		}
		return prefix + infix + postfix;
	}

	static _getPositionValue(mask, start, length) {
		return mask.slice(start, start + length)
			.replace(/^[.\s]*/, '')
			.replace(/[.\s]*$/, '');
	}

	static makeCmd({positions, destinationMask, fields, values}) {
		const missingFields = php.array_keys(php.array_diff_key(php.array_flip(fields), values));
		if (!php.empty(missingFields)) {
			return Rej.BadRequest('Missing necessary params for the mask: ['+php.implode(', ', missingFields)+']');
		}
		let cmd = destinationMask;
		const tuples = zip([fields, positions]);
		for (const [field, [start, length]] of tuples) {
			let token = php.strval(values[field]);
			const initial = this._getPositionValue(cmd, start, length);
			if (php.mb_strlen(token) > length) {
				token = php.mb_substr(token, 0, length);
			}
			// the check to make sure read-only value formatting is unchanged
			if (token.trim() !== initial.trim()) {
				cmd = this.overwriteStr(cmd, token, start, length);
			}
		}
		return cmd;
	}

	/**
	 * @param {string} emptyMask - a mask without any values entered used to calculate positions. Supposedly hardcoded.
	 * @param {string} destinationMask - the mask to which values are added. Note that
	 * some masks include non-static data, so you can't always use the emptyMask as destination.
	 * @param {Object} values - value mapping with field names as keys
	 */
	static makeCmdFromEmptyMask({emptyMask, destinationMask, fields, values}) {
		const positions = this._getPositionsFromGenericMask(emptyMask);
		return this.makeCmd({positions, destinationMask, fields, values});
	}

	// async to return errors
	static async getPositionValues({mask, positions, fields}) {
		if (positions.length !== fields.length) {
			const error = 'Number of passed positions ' + positions.length +
				' does not match number of fields ' + fields.length;
			return Rej.InternalServerError(error);
		}
		mask = this.normalizeMask(mask);
		const tuples = zip([fields, positions]);
		const items = [];
		for (const [key, [start, length]] of tuples) {
			if (start >= mask.length) {
				const error = mask + ' - mask output is too short, field ' +
					key +' at ' + start + ' is outside bounds';
				return Rej.UnprocessableEntity(error);
			}
			const value = this._getPositionValue(mask, start, length);
			const enabled = mask[start - 1] === ';';
			items.push({key, value, size: length, enabled});
		}
		return Promise.resolve(items);
	}
}
module.exports = MaskUtil;
