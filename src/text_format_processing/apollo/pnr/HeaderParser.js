const ParserUtil = require('../../agnostic/ParserUtil.js');
const ItineraryParser = require("./ItineraryParser.js");
const php = require('enko-fundamentals/src/Transpiled/php.js');
const GdsPassengerBlockParser = require("../../agnostic/GdsPassengerBlockParser.js");

class HeaderParser
{
	static parse(dump)  {
		const parsedData = {
			pnrIsCurrentlyInUse: false,
			reservationInfo: null,
			shopInfo: null,
			agentName: null,
		};
		const skippedLines = [];
		const lines = dump.split('\n');
		while (lines.length > 0) {
			const line = lines.shift();
			let result;
			if (this.isPnrIsCurrentlyInUseLine(line)) {
				parsedData.pnrIsCurrentlyInUse = true;
			} else if (result = this.parsePnrHeaderLine(line)) {
				parsedData.reservationInfo = result;
			} else if (result = this.parseAgentLine(line)) {
				parsedData.agentName = result.agentName;
			} else if (result = this.parsePccLine(line)) {
				parsedData.shopInfo = result;
			} else if (this.looksLikePassengerLine(line) || this.looksLikeSegmentLine(line)) {
				lines.unshift(line);
				break;
			} else {
				skippedLines.push(line);
			}
		}
		return {
			parsedData: parsedData,
			skippedLines: skippedLines,
			textLeft: lines.join('\n'),
		};
	}

	static isPnrIsCurrentlyInUseLine(line)  {
		return line.trim() == '** THIS PNR IS CURRENTLY IN USE **';
	}

	static parsePnrHeaderLine(line)  {
		const pattern1 =
			'/^'+
			'(?<recordLocator>[A-Z0-9]{6})'+
			'\/'+
			'(?<focalPointInitials>[A-Z0-9]{2})'+
			'\\s'+
			'(?<agencyId>[A-Z0-9]{5})'+ // this QSBSB token, which usually is different for other agency reservations, nobody knows what it actually is
			'(?<pnrCreatorToken>.{9,10})'+ // Nobody knows what this is as well, but some of our bookkeepers noticed that it starts with DYB for our reservations
			'AG\\s(?<arcNumber>[0-9]{8}|0)'+
			'\\s'+
			'(?<reservationDate>[0-9]{2}[A-Z]{3})'+
			'$/';
		const pattern2 =
			'/^'+
			'(?<recordLocator>[A-Z0-9]{6})'+
			'\/'+
			'(?<focalPointInitials>[A-Z0-9]{2})'+
			'\\s'+
			'(?<agencyId>[A-Z0-9]{3})'+ // Looks like an airport, but stands in place of this 'QSBSB' thing
			'.{3}'+
			'RM'+
			'\\s'+
			'(?<reservationDate>[0-9]{2}[A-Z]{3})'+
			'$/';
		const pattern3 =
			'/^'+
			'(?<recordLocator>[A-Z0-9]{6})'+
			'\/'+
			'(?<focalPointInitials>[A-Z0-9]{2})'+
			'\\s+'+
			'(?<agencyId>[A-Z0-9]{3,5})'+
			'\\s+'+
			'(?<pnrCreatorToken>([A-Z0-9]{3,4})?\\\/?[A-Z0-9]{2,3})'+
			'\\s+'+
			'(?<reservationDate>[0-9]{2}[A-Z]{3})'+
			'\\s*$/';

		let tokens;
		if (php.preg_match(pattern1, php.trim(line), tokens = [])) {
			const creatorToken = php.trim(tokens.pnrCreatorToken);
			let matches, agencyToken, agentToken;
			if (php.preg_match(/^([A-Z0-9]{3,4})\/([A-Z0-9]{2,3})$/, creatorToken, matches = [])) {
				// "2E8R/GWS"
				[, agencyToken, agentToken] = matches;
			} else {
				// "DYBVH", "DGKTJK"
				agencyToken = creatorToken.slice(0, 3);
				agentToken = creatorToken.slice(3);
			}
			return {
				recordLocator: tokens.recordLocator,
				focalPointInitials: tokens.focalPointInitials,
				agencyId: tokens.agencyId,
				pnrCreatorToken: creatorToken,
				agencyToken: agencyToken,
				agentToken: agentToken,
				arcNumber: tokens.arcNumber,
				reservationDate: {
					raw: tokens.reservationDate,
					parsed: ParserUtil.parsePartialDate(tokens.reservationDate),
				},
			};
		} else if (php.preg_match(pattern2, php.trim(line), tokens = [])) {
			return {
				recordLocator: tokens.recordLocator,
				focalPointInitials: tokens.focalPointInitials,
				agencyId: tokens.agencyId,
				pnrCreatorToken: '',
				arcNumber: null,
				reservationDate: {
					raw: tokens.reservationDate,
					parsed: ParserUtil.parsePartialDate(tokens.reservationDate),
				},
			};
		} else if (php.preg_match(pattern3, php.trim(line), tokens = [])) {
			return {
				recordLocator: tokens.recordLocator,
				focalPointInitials: tokens.focalPointInitials,
				agencyId: tokens.agencyId,
				pnrCreatorToken: tokens.pnrCreatorToken,
				arcNumber: null,
				reservationDate: {
					raw: tokens.reservationDate,
					parsed: ParserUtil.parsePartialDate(tokens.reservationDate),
				},
			};
		} else {
			return false;
		}
	}

	static parseAgentLine(line)  {
		let tokens;
		if (php.preg_match(/^(?<agentName>[A-Z]+)$/, php.trim(line), tokens = [])) {
			return {agentName: tokens.agentName};
		} else {
			return false;
		}
	}

	static parsePccLine(line)  {
		let tokens;
		if (php.preg_match(/^(?<pcc>[A-Z0-9]{4}) - (?<restText>.*)$/, php.trim(line), tokens = [])) {
			return {
				pcc: tokens.pcc,
				restText: tokens.restText,
			};
		} else {
			return false;
		}
	}

	static looksLikePassengerLine(line)  {
		return GdsPassengerBlockParser.parsePassengerLine(line).success
            || php.trim(line) === 'NO NAMES';
	}

	static looksLikeSegmentLine(line)  {
		const parsedSegment = ItineraryParser.parse(line);
		return parsedSegment.segments.length > 0;
	}
}
module.exports = HeaderParser;
