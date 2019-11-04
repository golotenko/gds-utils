const ParserUtil = require('../../agnostic/ParserUtil.js');
const GdsPassengerBlockParser = require('../../agnostic/GdsPassengerBlockParser.js');
const ItineraryParser = require('./ItineraryParser.js');

/**
 * parse text before first explicit section in *R
 * includes PS- remark, passengers, record locator line, itinerary
 */
const php = require('enko-fundamentals/src/Transpiled/php.js');
class HeadParser
{
	static parsePnrHeaderLine(line)  {
		// example: 'LT6M8Q/KR QSBSB DYBKR   AG 05578602 09FEB'
		//          'PDTL3K/MV YSBOU 28JH/MV  AG 96334873 27OCT'.PHP_EOL.
		//          'WC6FVO/WS QSBIV VTL9WS  AG 99999992 08MAR',
		//          'J6GCWS/WS LAXOU 115Q/GWS AG 23854526 28SEP'.PHP_EOL,
		const regex =
            '/^'+
            '(?<recordLocator>[A-Z0-9]{6})'+
            '/'+
            '(?<focalPointInitials>[A-Z0-9]{2})'+
            '\\s'+
            '(?<agencyId>[A-Z0-9]{5})'+ // this QSBSB token, which usually is different for other agency reservations, nobody knows what it actually is
            '(?<pnrCreatorToken>.{9,10})'+ // Nobody knows what this is as well, but some of our bookkeepers noticed that it starts with DYB for our reservations
            'AG\\s(?<arcNumber>[0-9]{7,8})'+
            '\\s'+
            '(?<reservationDate>[0-9]{2}[A-Z]{3})'+
            '$/';

		let tokens;
		if (php.preg_match(regex, php.trim(line), tokens = [])) {
			const creatorToken = php.trim(tokens.pnrCreatorToken);
			return {
				recordLocator: tokens.recordLocator,
				focalPointInitials: tokens.focalPointInitials,
				agencyId: tokens.agencyId,
				pnrCreatorToken: creatorToken,
				arcNumber: tokens.arcNumber,
				reservationDate: {
					raw: tokens.reservationDate,
					parsed: ParserUtil.parsePartialDate(tokens.reservationDate),
				},
			};
		} else {
			return null;
		}
	}

	static parse(dump)  {
		const headerData = {};
		let nameRecords = [];
		let itinerary = [];

		dump = ParserUtil.wrapLinesAt(dump, 64);
		let lines = dump.split('\n');
		while (!php.empty(lines)) {
			const textLeft = php.implode(php.PHP_EOL, lines);
			const asPaxes = GdsPassengerBlockParser.parse(textLeft);
			const asItinerary = ItineraryParser.parse(textLeft);
			const line = lines.shift();
			const result = this.parsePnrHeaderLine(line);
			if (result) {
				headerData.reservationInfo = result;
			} else if (!php.empty(asPaxes.parsedData.passengerList)) {
				nameRecords = asPaxes.parsedData.passengerList;
				lines = asPaxes.textLeft ? asPaxes.textLeft.split('\n') : [];
			} else if (!php.empty(asItinerary.segments)) {
				itinerary = asItinerary.segments;
				lines = asItinerary.textLeft ? asItinerary.textLeft.split('\n') : [];
				headerData.skippedLines = php.array_merge(headerData.skippedLines || [], lines);
				break;
			} else {
				headerData.skippedLines = headerData.skippedLines || [];
				headerData.skippedLines.push(line);
			}
		}

		return {headerData, nameRecords, itinerary};
	}

}
module.exports = HeadParser;
