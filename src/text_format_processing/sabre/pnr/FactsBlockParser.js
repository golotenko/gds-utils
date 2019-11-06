const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * this class transforms text of the "AA FACTS"
 * section of the PNR to an associative array data
 */
class FactsBlockParser
{
	/**
     * OSI stands for "Other Service Information"
     * it contains free format comment about passengers
     */
	static parseOsiLine(osiLine)  {
		let matches;
		if (php.preg_match(/^([ \d]{3})\.OSI ([A-Z]{2})? ?(.*)$/s, osiLine, matches = [])) {
			const [, lineNumber, airline, comment] = matches;
			return {
				lineNumber: php.intval(lineNumber),
				airline,
				comment,
				line: osiLine,
			};
		} else {
			return null;
		}
	}

	static parseSsrLineWithoutPax(gluedLine)  {
		return this.parseCommentSsrLine(gluedLine)
			|| this.parseDocsSsrText(gluedLine)
			|| this.parseTokenSsr(gluedLine, ['DOCA', 'DOCS', 'DOCO', 'PCTC'])
			|| this.parseCommonSegmentLine(gluedLine)
			|| this.parseAmericanAirlinesSegmentLine(gluedLine)
			|| this.parseUnknownSsrLine(gluedLine);
	}

	static parseSsrLine(ssrText)  {
		const split = this.splitSsrTextFromPax(ssrText);
		if (split) {
			const parsed = this.parseSsrLineWithoutPax(split.ssrPart);
			if (parsed) {
				parsed.paxNum = split.paxNum;
				parsed.paxName = split.paxName;
				parsed.line = split.ssrPart;
			}
			return parsed;
		} else {
			const gluedLine = ssrText.replace(/\n/g, '');
			const parsed = this.parseSsrLineWithoutPax(gluedLine);
			if (parsed) {
				parsed.line = gluedLine;
			}
			return parsed;
		}
	}

	// " 16.SSR SEAT BA KK5 DFWLHR 1521O31MAR.36CN36DN36EN36FN36GN/RS"
	static parseCommonSegmentLine(ssrLine)  {
		const regex =
            '/^'+
            '(?<lineNumber>[ \\d]{3})\\.SSR ?'+
            '(?<ssrCode>[A-Z]{4}) ?'+
            '(?<airline>[A-Z\\d]{2}) ?'+
            '(?<status>[A-Z\\d]{2})'+
            '(?<statusNumber>\\d{1,2}) ?'+
            '(?<departureAirport>[A-Z]{3})'+
            '(?<destinationAirport>[A-Z]{3}) ?'+
            '(?<flightNumber>\\d{1,4})'+
            '(?<bookingClass>[A-Z])'+
            '(?<departureDate>\\d+[A-Z]{3})'+
            '(?<comment>.*)?'+
            '$\/s';
		let matches;
		if (php.preg_match(regex, ssrLine, matches = [])) {
			return {
				lineNumber: php.intval(matches.lineNumber),
				ssrCode: matches.ssrCode,
				airline: matches.airline,
				status: matches.status,
				statusNumber: matches.statusNumber,
				departureAirport: matches.departureAirport,
				destinationAirport: matches.destinationAirport,
				flightNumber: matches.flightNumber,
				bookingClass: matches.bookingClass,
				departureDate: {
					raw: matches.departureDate,
					parsed: ParserUtil.parsePartialDate(matches.departureDate),
				},
				comment: matches.comment || '',
			};
		} else {
			return null;
		}
	}

	static parseAmericanAirlinesSegmentLine(ssrLine)  {
		const regex =
            '/^'+
            '(?<lineNumber>[ \\d]{3})\\.SSR ?'+
            '(?<ssrCode>[A-Z]{4}) ?'+
            '(?<airline>AA) '+
            '(?<flightNumber>\\d{1,4})'+
            '(?<bookingClass>[A-Z])?'+
            '(?<departureDate>\\d+[A-Z]{3})\/'+
            '(?<status>[A-Z]{2})'+
            '(?<statusNumber>\\d+).*'+
            '$\/s';
		let matches;
		if (php.preg_match(regex, ssrLine, matches = [])) {
			return {
				lineNumber: php.intval(matches.lineNumber),
				ssrCode: matches.ssrCode,
				airline: matches.airline,
				flightNumber: matches.flightNumber,
				bookingClass: matches.bookingClass,
				departureDate: php.isset(matches.departureDate) ? {
					raw: matches.departureDate,
					parsed: ParserUtil.parsePartialDate(matches.departureDate),
				} : null,
				status: matches.status,
				statusNumber: matches.statusNumber,
			};
		}

		return null;
	}

	static parseCommentSsrLine(ssrLine)  {
		const regex =
            '/^'+
            '(?<lineNumber>[ \\d]{3})'+
            '\\.SSR '+
            '(?<ssrCode>(OTHS|ADTK|ADPI))'+
            '\\s?'+
            '(?<airline>[A-Z\\d]{2})?'+
            '[ \\.]'+
            '(?<comment>.*)'+
            '$\/s';
		let matches;
		if (php.preg_match(regex, ssrLine, matches = [])) {
			return {
				lineNumber: php.intval(matches.lineNumber),
				ssrCode: matches.ssrCode,
				airline: matches.airline,
				comment: php.rtrim(matches.comment),
			};
		} else {
			return null;
		}
	}

	static splitSsrTextFromPax(ssrText)  {
		const lines = ssrText.split('\n');
		//'  1.SSR CTCE  /NIGELCROSSLEY1904//  1.1 CROSSLEY/NIGEL PETER',
		//'  1.SSR DOCS LH HK1/DB/14JAN71/F/D  1.1 DENTESDECARVALHOSILVEIR',
		const pattern = 'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS NNNN FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
		const firstLine = lines.shift();
		const split = ParserUtil.splitByPosition(firstLine, pattern);
		const result = {
			ssrPart: split['S'],
			paxNum: php.trim(split['N']),
			paxName: php.rtrim(split['F']),
		};
		const [lname, fname] = php.array_pad(result.paxName.split('/'), 2, '');
		const nameRegex = /^[A-Z](\s*[^\d\W]+)*$/; // \w except numbers
		const isValidName = php.preg_match(nameRegex, lname) &&
            (php.preg_match(nameRegex, fname) || !fname && php.mb_strlen(lname) > 20);

		if (split[' '].trim() === '' && isValidName &&
            php.preg_match(/^\d+\.\d+$/, result.paxNum)
		) {
			lines.unshift(result.ssrPart);
			result.ssrPart = php.rtrim(lines.join(''));
			return result;
		} else {
			return null;
		}
	}

	//' 34.SSR DOCS ET HK1/P/NG/A06099982/NG/04FEB58/F/22SEP19/AKPAN/DIMAELIJAH',
	//'  1.SSR DOCS LH HK1/DB/14JAN71/F/DENTESDECARVALHOSILVEIRA PINTO/MICHELE',
	//'  1.SSR CTCE  /NIGELCROSSLEY1904//COMCAST.NET NN1 ',
	static parseTokenSsr(gluedLine, allowedCodes)  {
		const firstLineRegex =
            '/^\\s*'+
            '(?<lineNumber>\\d+)\\.SSR\\s*'+
            '(?<ssrCode>('+php.implode('|', allowedCodes)+'))\\s?'+
            '(?<airline>[A-Z\\d]{2})?[\\s\\.]'+
            '('+
            '(?<status>[A-Z]{2}).??'+
            '(?<statusNumber>\\d{0,2})'+
            ')?\\s*'+
            '\\\/(?<tokensPart>.+?)'+
            '\\s*$\/s';
		let matches;
		if (php.preg_match(firstLineRegex, gluedLine, matches = [])) {
			matches = php.array_filter(matches);
			return {
				tokens: matches.tokensPart.split('/'),
				lineNumber: php.intval(matches.lineNumber),
				ssrCode: matches.ssrCode,
				airline: matches.airline,
				status: matches.status,
				statusNumber: matches.statusNumber,
			};
		}

		return null;
	}

	// 'DB/08AUG57/F/ANYANKAH/ANGELA ADAUGO'
	// 'DB/12JUL66/M/LIBERMANE/BRUCE'
	static parseDocsSsrPartialTokens(tokens)  {
		if (php.count(tokens) >= 5) {
			const [dobMark, dob, genderAndI, lastName, firstName, middleName] = php.array_pad(tokens, 6, null);
			if (dobMark === 'DB') {
				return {
					dob: ParserUtil.parsePastFullDate(dob),
					gender: genderAndI[0],
					paxIsInfant: (genderAndI[1]) === 'I',
					lastName,
					firstName,
					middleName,
				};
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	// 'P/FR/1234567890/FR/15AUG2016/MI/30SEP2020/DELACROIX/LIBERMANE/ZIMICH'
	// 'P/FR/1234567891/FR/15AUG1980/MI/30SEP2020/VERYLONGLASTNAME/VERYLONGFIRSTNAME/MIDDLENAME/H'
	// 'P/NG/A07340115/NG/06MAR48/M/10MAY21/AKPAN/ELIJAHUDO'
	static parseDocsSsrCompleteTokens(tokens)  {
		if (tokens.length >= 9) {
			const [
				travelDocType, issuingCountry, travelDocNumber, nationality, dob,
				genderAndI, expirationDate, lastName, firstName, middleName, primaryPassportHolderToken,
			] = php.array_pad(tokens, 11, null);
			return {
				travelDocType,
				issuingCountry,
				travelDocNumber,
				nationality,
				dob: ParserUtil.parsePastFullDate(dob),
				gender: genderAndI[0],
				paxIsInfant: (genderAndI[1]) === 'I',
				expirationDate: ParserUtil.parse2kDate(expirationDate),
				lastName,
				firstName,
				middleName,
				primaryPassportHolderToken,
			};
		} else {
			return null;
		}
	}

	static parseDocsSsrText(gluedLine)  {
		const result = this.parseTokenSsr(gluedLine, ['DOCS']);
		if (result) {
			const tokens = result.tokens;
			delete result.tokens;
			const data = this.parseDocsSsrCompleteTokens(tokens) ||
				this.parseDocsSsrPartialTokens(tokens) ||
				{error: 'failed to parse', tokens: tokens};
			return {...result, ...data};
		}

		return null;
	}

	static parseUnknownSsrLine(ssrLine)  {
		const regex =
            '/^'+
            '(?<lineNumber>[\\s\\d]{3})'+
            '\\.SSR\\s+'+
            '(?<ssrCode>[A-Z]{4})'+
            '\\s?'+
            '(?<airline>[A-Z\\d]{2})?'+
            '[\\s\\.]'+
            '('+
            '(?<status>[A-Z]{2})'+
            '(.??(?<statusNumber>\\d{1,2}))?'+
            ')?'+
            '(?<content>.*)'+
            '$/s';
		let matches;
		if (php.preg_match(regex, ssrLine, matches = [])) {
			matches = php.array_filter(matches);
			return {
				lineNumber: php.intval(matches.lineNumber),
				ssrCode: matches.ssrCode,
				airline: matches.airline,
				status: matches.status,
				statusNumber: matches.statusNumber,
				content: matches.content || '',
			};
		} else {
			return null;
		}
	}

	static popKey(dict, key, def)  {
		const value = dict[key] || def;
		delete dict[key];
		return value;
	}

	static parse(dump)  {
		// extracting lineNumber/ssrCode/airline/status/statusNumber
		// _before_ passing line to SSR-specific functions would be better
		const ssrList = [];
		const lines = dump.split('\n');
		const headerLine = lines.shift(); // either 'AA FACTS' or 'GENERAL FACTS'
		let linesLeft = [];
		let unindentedText = null;
		for (let i = 0; i < lines.length; ++i) {
			unindentedText = unindentedText
				? unindentedText + '\n' + lines[i].slice('    '.length)
				: lines[i];

			const nextLine = lines[i + 1];
			const isNextLineContinuationOfCurrent = nextLine &&
				nextLine.startsWith('    '); // 4 spaces

			// note: there may be lines like "   PCTC DATA EXISTS - PLEASE USE *P4 TO VIEW" in the beginning
			// of the section, but we are relying on fact it was removed in SabreReservationParser::markLines()

			if (!isNextLineContinuationOfCurrent) {
				let lineData, ssrCode;
				if (lineData = this.parseSsrLine(unindentedText)) {
					ssrCode = this.popKey(lineData, 'ssrCode');
				} else if (lineData = this.parseOsiLine(unindentedText)) {
					ssrCode = 'OSI';
				} else {
					// mostly happens when agents mix pricing dump with *R dump
					linesLeft = php.array_slice(lines, i);
					break;
				}

				const cleanLine = this.popKey(lineData, 'line');
				ssrList.push({
					lineNumber: this.popKey(lineData, 'lineNumber', null),
					ssrCode: ssrCode,
					airline: this.popKey(lineData, 'airline', null),
					status: this.popKey(lineData, 'status', null),
					statusNumber: this.popKey(lineData, 'statusNumber', null),
					content: this.popKey(lineData, 'content', null),
					data: lineData,
					line: cleanLine,
				});
				unindentedText = '';
			}
		}
		return {ssrList, linesLeft};
	}
}
module.exports = FactsBlockParser;
