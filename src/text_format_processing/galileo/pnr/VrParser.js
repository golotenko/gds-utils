const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * parse output of >*VR; - airline SSR-s like OTHS and ADTK
 * example:
 * 'VENDOR REMARKS',
 * 'VRMK-VI/AAF *ADTK1GTOAF BY 22MAR 1000 OTHERWISE WILL BE XLD 1314Z 08MAR',
 * '  2+ VI/AAF *ADTK1GTOAF BY 22MAR 1000 OTHERWISE WILL BE XLD 1352Z 08MAR',
 * '  3+ VI/AUA *ADTK1GKK3 +TKT UA SEGS BY 17SEP18 TO AVOID AUTO CXL /EARLIER 1329Z 08MAR',
 * '  4+ VI/AUA *ADTK1GKK3 +TICKETING MAY BE REQUIRED BY FARE RULE 1329Z 08MAR',
 * '  5+ VI/AUA *ADTK1GKK1 +TKT UA SEGS BY 17SEP18 TO AVOID AUTO CXL /EARLIER 1407Z 08MAR',
 * '  6+ VI/AUA *ADTK1GKK1 +TICKETING MAY BE REQUIRED BY FARE RULE 1407Z 08MAR',
 * '><',
 */
class VrParser
{
	static parseSequence(linesLeft, parse)  {
		const parsedLines = [];
		let line;
		while (!php.is_null(line = linesLeft.shift())) {
			const parsedLine = parse(line);
			if (parsedLine) {
				parsedLines.push(parsedLine);
			} else {
				linesLeft.unshift(line);
				break;
			}
		}
		return [parsedLines, linesLeft];
	}

	static parseSsrData(line)  {
		const regex =
            '/^\\s*'+
            '(?<ssrCode>[A-Z]{4})1G'+
            '('+
                'TO(?<toAirline>[A-Z0-9]{2})'+
                '|'+
                '(?<status>[A-Z]{2})'+
                '(?<statusNumber>\\d*)'+
            ')\\s+'+
            '(?<content>.*?)'+
            '\\s*$/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			return matches;
		} else {
			return null;
		}
	}

	// 'VRMK-VI/APS *NOREC 1716Z 15MAR',
	// 'VRMK-VI/AAF *ADTK1GTOAF BY 22MAR 1000 OTHERWISE WILL BE XLD 1314Z 08MAR',
	// '  6. VI/AUA *ADTK1GKK1 .TICKETING MAY BE REQUIRED BY FARE RULE 1407Z 08MAR',
	// 'VRMK-VI/APS *ADTK1GTOPS BY 25MAR 1600 OTHERWISE WILL BE XLD 1928Z 15MAR',
	// 'VRMK-VI/AET *PLS ADTK BY 09MAR18 1331 GMT OR SEATS WILL BE XLD 1333Z 08MAR',
	static parseSsrLine(line)  {
		const regex =
            '/^'+
            '(VRMK-|\\s*(?<lineNumber>\\d+)\\.\\s*)VI\\\/A'+
            '(?<airline>[A-Z0-9]{2})\\s+\\*'+
            '(?<content>.*?)\\s*'+
            '(?<time>\\d{4})Z\\s+'+
            '(?<date>\\d{1,2}[A-Z]{3}\\d{0,4})'+
            '/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			let content = matches.content;
			let ssrData = this.parseSsrData(content);
			if (ssrData) {
				content = ssrData.content;
			} else {
				ssrData = {};
			}
			return {
				lineNumber: matches.lineNumber || '' || '1',
				airline: matches.airline,
				ssrCode: ssrData.ssrCode || '',
				status: ssrData.status || '',
				statusNumber: ssrData.statusNumber || '',
				toAirline: ssrData.toAirline || '',
				content: content,
				time: {
					raw: matches.time,
					parsed: ParserUtil.decodeGdsTime(matches.time),
				},
				date: {
					raw: matches.date,
					parsed: ParserUtil.parsePartialDate(matches.date),
				},
			};
		} else {
			return null;
		}
	}

	static parse(dump)  {
		let lines = php.rtrim(dump).split('\n');
		const headerLine = lines.shift();
		if (headerLine.trim() === 'NO VENDOR REMARK DATA EXISTS') {
			return {records: [], linesLeft: lines};
		} else if (headerLine.trim() !== 'VENDOR REMARKS') {
			return {error: 'Unexpected start of dump - ' + headerLine.trim()};
		}
		let ssrs;
		[ssrs, lines] = this.parseSequence(lines, l => this.parseSsrLine(l));
		return {records: ssrs, linesLeft: lines};
	}
}
module.exports = VrParser;
