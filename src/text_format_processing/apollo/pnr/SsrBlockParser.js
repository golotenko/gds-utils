const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * SSR block is *R GFAX- line and several lines after that
 */
class SsrBlockParser {
	// 07AUG55 = 1955-08-07
	// 15AUG2016 = 2016-08-15
	static parseDateOfBirth(raw) {
		let century, matches, $_, d, m, year, parsedDob;
		century = null;
		if (php.preg_match(/^(\d{1,2})([A-Z]{3})(\d{2})(\d{2})$/, raw, matches = [])) {
			// 4 digits in year
			[$_, d, m, century, year] = matches;
			raw = d + m + year;
		}
		if (parsedDob = ParserUtil.parseFullDate(raw)) {
			year = php.substr(parsedDob, 0, 2);
			century = century || (year > php.date('y') ? '19' : '20');
			parsedDob = century + parsedDob;
		}
		return parsedDob;
	}

	/**
	 * Known SSR types:
	 * ABAG ACKI ADMD ADPI ADTK ASVC AVML BBAG BBML BLML
	 * BSCT CBAG CHML CKIN CTCE CTCM DBML DOCA DOCO DOCS
	 * FQTV GFML HNML INFT INML KSML LCML LFML LSML MAAS
	 * MOML NSSA NSSB NSST NSSW OTHS PCTC PETC RQST RVML
	 * SFML SPML TKNE TKNM VGML VLML VOML WCBD WCHC WCHR
	 * WCHS WCOB OSI
	 */
	static getLineNumber(line) {
		const num = php.substr(line, 0, 5);
		return num === 'GFAX-' ? 1 : php.intval(php.trim(num));
	}

	static getSsrCode(line) {
		const ssrToken = php.substr(line, 5, 3);
		if (ssrToken === 'SSR') {
			return php.substr(line, 8, 4);
		} else if (ssrToken === 'OSI') {
			return 'OSI';
		} else {
			return '__';
		}
	}

	static isMealSsrCode(code) {
		const list = [
			'AVML', 'BBML', 'BLML', 'CHML', 'CNML',
			'DBML', 'FPML', 'FSML', 'GFML', 'GRML',
			'GVML', 'HNML', 'JPML', 'KCML', 'KSML',
			'LCML', 'LFML', 'LSML', 'MOML', 'NLML',
			'RFML', 'RGML', 'RVML', 'SFML', 'SKML',
			'SPML', 'VGML', 'VJML', 'VLML', 'VOML',
		];
		return list.includes(code);
	}

	static isSeatSsrCode(code) {
		const list = ['NSST', 'SMSA', 'SMSW', 'NSSA', 'NSSW', 'RQST'];
		return list.includes(code);
	}

	static isWheelchairSsrCode(code) {
		const list = ['WCHR', 'WCHS', 'WCHC', 'WCBD', 'WCBW', 'WCMP', 'WCOB'];
		return list.includes(code);
	}

	static isDocSsrCode(code) {
		return ['DOCS', 'DOCA', 'DOCO'].includes(code);
	}

	static isDisabilitySsrCode(code) {
		return this.isWheelchairSsrCode(code) || ['BLND', 'DEAF'].includes(code);
	}

	// '  44 SSRADMD1VKK1 TO LH BY 06FEB 1333 OTHERWISE WILL BE CANCELLED
	// '   6 SSRADMD1VKK1 TO SA BY 12MAR 1344 OTHERWISE WILL BE CANCELLED
	static parseSsrAdmdLine(line) {
		const pattern = '     _______     ___ AA___ DDDDD TTTT____________________________';
		const names = {
			_: 'template',
			A: 'airline',
			D: 'date',
			T: 'time',
		};
		const result = ParserUtil.splitByPosition(line, pattern, names, true);
		if (result.template === 'SSRADMD TO BY OTHERWISE WILL BE CANCELLED') {
			return {
				airline: result.airline,
				date: {
					raw: result.date,
					parsed: ParserUtil.parsePartialDate(result.date),
				},
				time: {
					raw: result.time,
					parsed: ParserUtil.decodeGdsTime(result.time),
				},
			};
		} else {
			return null;
		}
	}

	static parseSegmentData(content) {
		const pattern =
			'/^\\s*' +
			'(?<departureAirport>[A-Z]{3})' +
			'(?<destinationAirport>[A-Z]{3})\\s*' +
			'(?<flightNumber>\\d+)' +
			'(?<bookingClass>[A-Z])\\s*' +
			'(?<departureDate>\\d{1,2}[A-Z]{3})' +
			'\\s*$/';
		let tokens;
		if (php.preg_match(pattern, content, tokens = [])) {
			return {
				departureAirport: tokens.departureAirport,
				destinationAirport: tokens.destinationAirport,
				flightNumber: tokens.flightNumber,
				bookingClass: tokens.bookingClass,
				departureDate: {
					raw: tokens.departureDate,
					parsed: ParserUtil.parsePartialDate(tokens.departureDate),
				},
			};
		} else {
			return null;
		}
	}

	/**
	 * Some examples:
	 * '  19 SSRWCHRTPKK1 MADLIS 1011U27MAR-1PANDIT/DARSHANA+PAX CANT WALK LONG DISTANCE+IF BRINGING OWN WHEELCHAIR PLS REQ WCBD/WCMP/WCBW',
	 * '  29 SSRWCHCUAKK01 LAXNRT 0032K 24APR-1QUILING/NERY ',
	 * '  30 SSRWCHCNHKK01 NRTMNL 0819K 25APR-1QUILING/NERY+SPECIFY ESCORTED OR NOT N RQ MEDA IF ',
	 * '  31 SSRWCHCNHKK1 NRTMNL 0819K25APR-1ESPIRITU/FRANCIS+SPECIFY ESCORTED OR NOT N RQ MEDA IF APPLICABLE',
	 * '  13 SSRWCHCNHKK01 HNDLAX 0106K 15APR-1HERNANDO/ADORACION PICACHE+SPECIFY ESCORTED OR NOT',
	 * '  14 SSRWCHCUANO01 LAXYYC 8688K 15APR-1HERNANDO/ADORACION PICACHE ',
	 * '  18 SSRWCHCNHKK01 HNDLAX 0106K 15APR-1HERNANDO/BUTCH+SPECIFY ESCORTED OR NOT N RQ MEDA I',
	 * '  19 SSRWCHCUANO01 LAXYYC 8688K 15APR-1I/HERNANDO/BUTCH ',
	 * '  21 SSRLSMLETKK01 EWRLFW 0509G 19DEC  ',
	 */
	static parseMealOrDisabilityLine(line) {
		const contentData = this.extractContent(line);
		if (!contentData) {
			return null;
		}
		const segmentData = this.parseSegmentData(contentData.content);
		if (!segmentData) {
			return null;
		} else {
			return {...contentData, ...segmentData};
		}
	}

	/**
	 * >HELP SSR-DOCS;
	 *
	 * Some examples:
	 * '   7 SSRDOCSBRHK1/////05JAN73/F//SYQUIA/RAQUEL/-1SYQUIA/RAQUEL',
	 * '   2 SSRDOCSKLHK1/////06DEC68/M//MORRISON/GEOFFREY/STEWART-1MORRISON/GEOFFREY STEWART',
	 * '  22 SSRDOCSDLHK1/////31MAR15/MI//CHUKWUMA/MAXWELL/IFECHUKWUKUNI-1I/CHUKWUMA/MAXWELL IFECHUKWUKUNI',
	 * 'GFAX-SSRDOCSETHK1/////31JAN66/M//HARUNA/AMADI/-1HARUNA/AMADI',
	 * '  16 SSRDOCSQRHK1/P/US/S123456778/US/12JUL66/M/23OCT12/SMITH/JOHN/RICHARD/H-1WAITHAKA/DAVID',
	 * '   8 SSRDOCSPRHK1/////02APR94/FI//STROBEL/AUDREY-1LIBERMANE/MARINA'
	 */
	static parseSsrDocsLine(line) {
		line = php.substr(line, php.mb_strlen('GFAX-SSRDOCS'));
		let paxNumTokens;
		php.preg_match(/-(?<paxNum>\d+)(?<paxInf>I\/)?/, line, paxNumTokens = []);
		const paxNum = php.array_key_exists('paxNum', paxNumTokens) ? paxNumTokens.paxNum : '';
		const paxInf = paxNumTokens.paxInf ? true : false;
		const [documentInfo, pnrPaxName] = php.array_pad(line.split(/-\d+(?:I\/)?/), 2, '');
		const [
			pre, travelDocType, issuingCountry, travelDocNumber, nationality,
			dob, gender, expirationDate, lastName, firstName, middleName, primaryPassportHolderToken,
		] = php.array_pad(php.explode('/', documentInfo), 12, '');

		const parsedExpirationDate = ParserUtil.parseFullDate(expirationDate);
		return {
			//'pre' => pre,
			travelDocType: travelDocType,
			issuingCountry: issuingCountry,
			travelDocNumber: travelDocNumber,
			nationality: nationality,
			dob: {
				raw: dob,
				parsed: this.parseDateOfBirth(dob),
			},
			gender: gender[0],
			expirationDate: {
				raw: expirationDate,
				parsed: parsedExpirationDate ? '20' + parsedExpirationDate : null,
			},
			lastName: lastName,
			firstName: firstName,  // May also contain middle name (separated by space)
			middleName: middleName,  // Optional
			primaryPassportHolderToken: primaryPassportHolderToken,  // Optional
			/**
			 * I may only guess that this is the order of
			 * passengers with both same last name and first name
			 */
			paxNum: paxNum,
			paxIsInfant: paxInf,
			pnrPaxName: pnrPaxName,
		};
	}

	/**
	 * >HELP SSR-DOCA;
	 *
	 * Some examples:
	 * '   6 SSRDOCACAHK1/R/US/1800 SMITH STREET/HOUSTON/TX/12345-1LIBERMANE/MARINA'
	 */
	static parseSsrDocaLine(line) {
		line = line.slice('GFAX-SSRDOCA'.length);
		let paxNumTokens;
		php.preg_match(/-(?<paxNum>\d+)(?<paxInf>I\/)?/, line, paxNumTokens = []);
		const paxNum = php.array_key_exists('paxNum', paxNumTokens) ? paxNumTokens.paxNum : '';
		const paxIsInfant = paxNumTokens.paxInf ? true : false;
		const [documentInfo, pnrPaxName] = php.array_pad(line.split(/-\d+(?:I\/)?/), 2, '');
		const [
			pre, addressType, country, addressDetails,
			city, province, postalCode,
		] = php.array_pad(documentInfo.split('/'), 7, '');
		return {
			addressType, country, addressDetails, city,
			province, postalCode, paxNum, paxIsInfant, pnrPaxName,
		};
	}

	/**
	 * >HELP SSR-DOCO;
	 *
	 * Some examples:
	 * '  12 SSRDOCOUAHK1 //K/987109365///US-1RANDAZZO/RALPHMICHAEL',
	 * '  10 SSRDOCOUAHK1 //K/986903940///US-1ALPERT/GEOFFREYMARSHALL',
	 * '  10 SSRDOCODLHK1//K/TT1133H33///US-1LABORDEIII/CLIFFE EDWARD',
	 * '  10 SSRDOCODLHK1//K/TT115T3VF///US-1HINES/LORI JO',
	 * '   8 SSRDOCOBAHK1//K/986183119///',
	 * '   5 SSRDOCOCAHK1/PARIS FR/V/12345123/LONDON GBR/14MAR11/US-1LIBERMANE/MARINA'
	 */
	static parseSsrDocoLine(line) {
		line = php.substr(line, php.mb_strlen('GFAX-SSRDOCO'));
		let paxNumTokens;
		php.preg_match(/-(?<paxNum>\d+)(?<paxInf>I\/)?/, line, paxNumTokens = []);
		const paxNum = php.array_key_exists('paxNum', paxNumTokens) ? paxNumTokens.paxNum : '';
		const paxIsInfant = paxNumTokens.paxInf ? true : false;
		const [documentInfo, pnrPaxName] = php.array_pad(line.split(/-\d+(?:I\/)?/), 2, '');
		const [pre, placeOfBirth, travelDocType, travelDocNumber, issuingCountry, dateOfBirth, countryWhereApplies] = php.array_pad(php.explode('/', documentInfo), 7, '');
		return {
			//'pre' => pre,
			placeOfBirth, travelDocType, travelDocNumber, issuingCountry,
			dateOfIssue: {
				raw: dateOfBirth,
				parsed: this.parseDateOfBirth(dateOfBirth),
			},
			countryWhereApplies, paxNum, paxIsInfant, pnrPaxName,
		};
	}

	// '  16 SSRTKNEUAHK01 NRTORD 7926K 07MAR-1ARCE/MARIAPAZ.0167827230576C1/575-576'
	// '   6 SSRTKNEBAHK01 LHRBLQ 0542J 21NOV-1BONAN/CHARLES.1257408947052C4',
	static parseSsrTkneData(contentData) {
		const content = contentData.content;
		const comment = contentData.comment;
		const segment = this.parseSegmentData(content);
		let matches;
		if (!segment) {
			return null;
		} else if (php.preg_match(/^(\d{13})C(\d+)(.*)$/, comment, matches = [])) {
			const [, ticketNumber, couponNumber, unparsed] = matches;
			segment.ticketNumber = ticketNumber;
			segment.couponNumber = couponNumber;
			if (unparsed) {
				segment.unparsed = unparsed;
			}
			return segment;
		} else {
			return null;
		}
	}

	static getAirline(line) {
		const filter = /^.{5}(?:SSR[A-Z]{4}|OSI)([0-9A-Z]{2})/;
		let matches = [];
		if (php.preg_match(filter, line, matches = [])) {
			return matches[1];
		} else {
			return null;
		}
	}

	// '  16 SSRDOCSQRHK1/P/US/S123456778/US/12JUL66/M/23OCT12/SMITH/JOHN/RICHARD/H-1WAITHAKA/DAVID',
	//                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
	static extractContent(line) {
		const regex =
			'/^\\s*' +
			'(?<lineNumber>GFAX|\\d+)[\\s\\-]*SSR\\s*' +
			'(?<ssrCode>[A-Z]{4})\\s*' +
			'(?<airline>[A-Z0-9]{2}|)\\s*' +
			'(' +
			'TO(?<toAirline>[A-Z0-9]{2})\\s*' +
			'|' +
			'(?<status>[A-Z]{2})' +
			'(?<statusNumber>\\d*)' +
			')?' +
			'(?<content>.*?)' +
			'(-1' +
			'(?<paxInf>I\\\/)?' +
			'(?<pnrPaxName>[A-Z][^\\\/\\.]*\\\/?([A-Z][^\\\/\\.]*?)?)\\s*' +
			'(\\.(?<comment>.*))?' +
			')?' +
			'$/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			return {
				lineNumber: matches.lineNumber === 'GFAX' ? 1 : matches.lineNumber,
				ssrCode: matches.ssrCode,
				airline: matches.airline,
				toAirline: matches.toAirline || null,
				status: matches.status || null,
				statusNumber: matches.statusNumber || null,
				content: matches.content,
				paxIsInfant: !php.empty(matches.paxInf),
				pnrPaxName: matches.pnrPaxName || null,
				comment: matches.comment || null,
			};
		} else {
			return null;
		}
	}

	static parse(dump) {
		const ssrs = [];
		for (const line of dump.split('\n')) {
			const lineNumber = this.getLineNumber(line);
			const ssrCode = this.getSsrCode(line);
			const airline = this.getAirline(line);
			const extracted = this.extractContent(line);
			let lineData;
			if (ssrCode === 'DOCS') {
				lineData = this.parseSsrDocsLine(line);
			} else if (ssrCode === 'DOCA') {
				lineData = this.parseSsrDocaLine(line);
			} else if (ssrCode === 'DOCO') {
				lineData = this.parseSsrDocoLine(line);
			} else if (extracted && extracted.ssrCode === 'TKNE') {
				lineData = this.parseSsrTkneData(extracted);
			} else if (this.isMealSsrCode(ssrCode)) {
				lineData = this.parseMealOrDisabilityLine(line);
			} else if (this.isDisabilitySsrCode(ssrCode)) {
				lineData = this.parseMealOrDisabilityLine(line);
				// TODO: there's also ADMD support, which is currently unused,
				// because there's no real need in that
			} else {
				lineData = null
				//?? static::parseSsrAdmdLine(line)
				;
			}
			if (lineData && extracted && extracted.pnrPaxName) {
				lineData.pnrPaxName = extracted.pnrPaxName;
			}
			ssrs.push({
				lineNumber: lineNumber,
				airline: airline,
				ssrCode: ssrCode,
				content: extracted ? extracted.content : null,
				data: lineData,
				line: line,
			});
		}
		return ssrs;
	}
}

module.exports = SsrBlockParser;
