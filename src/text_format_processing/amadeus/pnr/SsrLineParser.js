const ParserUtil = require('../../agnostic/ParserUtil.js');
const SsrBlockParser = require('../../apollo/pnr/SsrBlockParser.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');
const {mkReg} = require('enko-fundamentals/src/Utils/Misc.js');

const extractContent = (line) => {
	const regex = mkReg([
		/^/,
		/\s{0,2}/,
		/(?<lineNumber>\d{1,2})\s/,
		/[\/*]?(?<type>SSR)\s+/,
		/(?<ssrCode>[A-Z]{4})\s/,
		/(?<airline>[A-Z0-9]{2})?\s*/,
		'(?:',
		/(?<status>[A-Z]{2})/,
		/(?<statusNumber>\d{0,2})\s*/,
		')?',
		/(?<content>.*?)/,
		/(\/S(?<segNum>\d+))?/,
		/(\/P(?<paxNum>\d+))?/,
		/\s*$/,
	]);
	const match = line.match(regex);
	if (match) {
		return {
			lineNumber: match.groups.lineNumber,
			ssrCode: match.groups.ssrCode,
			airline: match.groups.airline,
			status: match.groups.status,
			statusNumber: match.groups.statusNumber,
			content: match.groups.content,
			segNums: !match.groups.segNum ? [] : [match.groups.segNum],
			paxNums: !match.groups.paxNum ? [] : [match.groups.paxNum],
			infMark: null,
		};
	} else {
		return null;
	}
};

class SsrLineParser
{
	// Example: 'P/LBN/2390602/LBN/19JAN64/M/05NOV17/BEAINI/HADI/S2',
	static parseSsrDocsToken(ssrData)  {
		let tokenParts, travelDocType, issuingCountry, travelDocNumber, nationality, dob, genderAndI, expirationDate, lastName, firstName, segment, segmentMaches;

		tokenParts = php.explode('/', ssrData.content || '');
		if (php.count(tokenParts) >= 9) {
			[travelDocType, issuingCountry, travelDocNumber, nationality, dob, genderAndI, expirationDate, lastName, firstName, segment] = php.array_pad(tokenParts, 10, null);

			php.preg_match('#S(\\d)#', segment, segmentMaches = []);
			return {
				travelDocType: travelDocType,
				issuingCountry: issuingCountry,
				travelDocNumber: travelDocNumber,
				nationality: nationality,
				dob: {
					raw: dob,
					parsed: SsrBlockParser.parseDateOfBirth(dob),
				},
				gender: genderAndI[0],
				paxIsInfant: (genderAndI[1]) === 'I',
				expirationDate: ParserUtil.parse2kDate(expirationDate),
				lastName: lastName,
				firstName: firstName,
			};
		} else {
			return null;
		}
	}

	// Example: '/D/USA/6960 AVENUE PETE STR/DEARBORN/FL/33710',
	static parseSsrDocaToken(ssrData)  {
		let tokenParts, addressType, country, addressDetails, city, province, postalCode;

		tokenParts = php.explode('/', ssrData.content || '');
		if (php.count(tokenParts) >= 6) {
			[addressType, country, addressDetails, city, province, postalCode] = php.array_pad(tokenParts, 6, '');

			return {
				addressType: addressType,
				country: country,
				addressDetails: addressDetails,
				city: city,
				province: province,
				postalCode: postalCode,
			};
		} else {
			return null;
		}
	}

	// Example: '/V/H0380256/USA//USA/S3',
	static parseSsrDocoToken(ssrData)  {
		let tokenParts, pre, travelDocType, travelDocNumber, issuingCountry, dob, countryWhereApplies, segment, segmentMaches;

		tokenParts = php.explode('/', ssrData.content || '');
		if (php.count(tokenParts) >= 6) {
			[pre, travelDocType, travelDocNumber, issuingCountry, dob, countryWhereApplies, segment] = php.array_pad(tokenParts, 7, '');

			php.preg_match('#S(\\d)#', segment, segmentMaches = []);
			return {
				//'pre' => pre,
				travelDocType: travelDocType,
				travelDocNumber: travelDocNumber,
				issuingCountry: issuingCountry,
				dob: {
					raw: dob,
					parsed: SsrBlockParser.parseDateOfBirth(dob),
				},
				countryWhereApplies: countryWhereApplies,
				segmentNumber: segmentMaches[1] || '',
			};
		} else {
			return null;
		}
	}

	// Example:
	// '/ PS1005775190/3',
	// 'PR203833593',
	// 'DL9418144359/P2',
	static parseSsrFqtvToken(ssrData)  {
		let regex, matches;

		regex =
            '/'+
            '(?<airline>[A-Z0-9\\d]{2})'+
            '(?<flyerNumber>[A-Z0-9]{3,})'+
            '.*?'+
            '(\\\/P(?<paxNum>\\d+))?'+
            '\\s*$/';
		if (php.preg_match(regex, ssrData.content, matches = [])) {
			return {
				airline: matches.airline,
				flyerNumber: matches.flyerNumber,
				paxNum: matches.paxNum || '',
			};
		}
		return null;
	}

	// '/S3', '/S3', '/S8/P4'
	static parseSegmentNumberToken(ssrContent)  {
		let regex, matches;

		regex = '/^\\s*'+
            '\\\/S(?<segNum>\\d+)'+
            '(\\\/P(?<paxNum>\\d+))?'+
            '\\s*$/';
		if (php.preg_match(regex, ssrContent, matches = [])) {
			return {
				segNum: matches.segNum,
				paxNum: matches.paxNum || '',
			};
		} else {
			return null;
		}
	}

	static parseSsrLineData(ssrData)  {
		let code, content;

		code = ssrData.ssrCode;
		content = ssrData.content;
		if (code == 'DOCS') {
			return this.parseSsrDocsToken(ssrData);
		} else if (code == 'DOCA') {
			return this.parseSsrDocaToken(ssrData);
		} else if (code == 'DOCO') {
			return this.parseSsrDocoToken(ssrData);
		} else if (code == 'FQTV') {
			return this.parseSsrFqtvToken(ssrData);
		} else if (SsrBlockParser.isMealSsrCode(code)) {
			return this.parseSegmentNumberToken(content);
		} else if (SsrBlockParser.isDisabilitySsrCode(code)) {
			return this.parseSegmentNumberToken(content);
		}
		return null;
	}

	static parse(line)  {
		line = line.replace(/\r\n|\r|\n/g, '');
		const filterOsi = '#^'+
            '\\s{0,2}'+
            '(?<lineNumber>\\d{1,2})\\s'+
            '(?<ssrCode>OSI)\\s+'+
            '(?<airline>[A-Z\\d]{2})?\\s*'+
            '(?<content>.+)'+
            '#s';
		let matches;
		const asSsr = extractContent(line);
		if (asSsr) {
			return {...asSsr,
				data: this.parseSsrLineData(asSsr),
			};
		} else if (php.preg_match(filterOsi, line, matches = [])) {
			return {
				lineNumber: matches.lineNumber,
				ssrCode: matches.ssrCode,
				airline: matches.airline,
				content: matches.content,
			};
		} else {
			return null;
		}
	}
}
module.exports = SsrLineParser;
