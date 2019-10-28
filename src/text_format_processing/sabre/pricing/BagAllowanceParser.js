const ParserUtil = require('../../agnostic/ParserUtil.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * parses the section in *PQ
 */
class BagAllowanceParser {
	/**
	 * @param string dump - the part of *PQ starting with "BAG ALLOWANCE"
	 */
	static parse(lines) {
		const sections = this.splitToSections(lines);

		return {
			baggageAllowanceBlock: this.parseBagAllowance(sections.baggageAllowanceBlock),
			carryOnAllowanceBlock: php.array_map(b => this.parseCarryOnAllowanceBundle(b),
				this.splitBundleSections(sections.carryOnAllowanceBlock)),
			carryOnChargesBlock: sections.carryOnChargesBlock ? php.array_map(b => this.parseCarryOnChargesBundle(b),
				this.splitBundleSections(sections.carryOnChargesBlock)) : null,
			disclaimer: sections.disclaimer,
			additionalInfo: !php.empty(sections.additionalInfo)
				? this.parseAdditionalInfo(sections.additionalInfo)
				: null,
		};
	}

	static parseAmountCode(code) {
		return ParserUtil.parseBagAmountCode(code);
	}

	static splitToSections(lines) {
		const result = {
			baggageAllowanceBlock: [],
			carryOnAllowanceBlock: [],
			carryOnChargesBlock: [],
			disclaimer: [],
			additionalInfo: [],
		};

		let section = null;
		for (const line of lines) {
			section = this.detectSectionFromHeader(line) || section;
			result[section].push(line);
			if (section === 'disclaimer' && line.trim() === 'CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./' ||
				section === 'disclaimer' && line.trim() === 'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY' // without continuation
			) {
				section = 'additionalInfo';
			}
		}

		return result;
	}

	static detectSectionFromHeader(line) {

		if (line.startsWith('BAG ALLOWANCE')) {
			return 'baggageAllowanceBlock';
		} else if (php.preg_match(/^CARRY ON ALLOWANCE *$/, line)) {
			return 'carryOnAllowanceBlock';
		} else if (php.preg_match(/^CARRY ON CHARGES *$/, line)) {
			return 'carryOnChargesBlock';
		} else if (php.preg_match(/^ADDITIONAL ALLOWANCES AND\/OR DISCOUNTS MAY APPLY.*$/, line)) {
			return 'disclaimer';
		} else {
			return null;
		}
	}

	static parseBagAllowance(lines) {
		const remarks = [];
		for (const [idx, line] of Object.entries(lines)) {
			if (line.startsWith('**')) {
				remarks.push(line);
				delete lines[idx];
			}
		}
		const blockTokens = php.preg_split(
			/^(BAG ALLOWANCE)/m, lines.join('\n'), -1,
			php.PREG_SPLIT_DELIM_CAPTURE | php.PREG_SPLIT_NO_EMPTY
		);
		return {
			segments: php.array_map(l => this.parseBagAllowanceSegment(l),
				php.array_chunk(blockTokens, 2).map(c => c.join(''))),
			generalRemarks: remarks,
		};
	}

	// 'BAG ALLOWANCE     -SGFNBO-02P/UA/EACH PIECE UP TO 50 POUNDS/23 ',
	// 'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS    ',
	//
	// 'BAG ALLOWANCE     -JFKPHC-02P/W3                               ',
	//
	// 'BAG ALLOWANCE     -INDMUC-01P/DL/EACH PIECE UP TO 50 POUNDS/23 ',
	// 'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS    ',
	// '2NDCHECKED BAG FEE-INDMUC-USD100.00/DL/UP TO 50 POUNDS/23 KILOG',
	// 'RAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS         ',
	//
	// 'BAG ALLOWANCE     -FATGCM-NIL/AA                               ',
	// '1STCHECKED BAG FEE-FATGCM-USD25.00/AA/UP TO 50 POUNDS/23 KILOGR',
	// 'AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS**        ',
	// '2NDCHECKED BAG FEE-FATGCM-USD40.00/AA/UP TO 50 POUNDS/23 KILOGR',
	// 'AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS**        ',
	//
	// 'BAG ALLOWANCE     -SWFDUB-*/D8                                 ',
	// '*BAGGAGE ALLOWANCES/FEES UNKNOWN - CONTACT D8                  ',
	// '1STCHECKED BAG FEE-SWFDUB-*/D8                                 ',
	// '*BAGGAGE ALLOWANCES/FEES UNKNOWN - CONTACT D8                  ',
	static parseBagAllowanceSegment(segmentDump) {
		const lines = segmentDump.split('\n');

		const textFees = php.preg_split(
			/^(\d+[A-Z]{2}CHECKED BAG FEE)/m, lines.join('\n'), -1,
			php.PREG_SPLIT_DELIM_CAPTURE
		);

		const startsWithStar = (line) => line.startsWith('*');

		let freeBagLines = textFees.shift().split('\n');
		const freeBagRemarks = freeBagLines.filter(startsWithStar);
		freeBagLines = freeBagLines.filter(this.not(startsWithStar));
		let freeBagData = this.parseMainLine(freeBagLines.join(''));
		freeBagData = this.addRemarks(freeBagData, freeBagRemarks);

		return {
			free: freeBagData,
			fees: php.array_chunk(textFees, 2).map((tuple) => {
				const [delim, content] = tuple;
				let feeBagLines = (delim + content).split('\n');
				const feeBagRemarks = feeBagLines.filter(startsWithStar);
				feeBagLines = feeBagLines.filter(this.not(startsWithStar));
				let feeBagData = this.parseBagFeeLine(feeBagLines.join(''));
				feeBagData = this.addRemarks(feeBagData, feeBagRemarks);

				return feeBagData;
			}),
		};
	}

	/**
	 * @param bagData = static::parseMainLine()
	 *                || static::parseBagFeeLine()
	 */
	static addRemarks(bagData, remarks) {
		remarks = remarks.map(r => php.rtrim(r));
		if ((bagData.noPriceDueTo) === '*' && php.count(remarks) === 1) {
			bagData.noPriceDueTo = remarks[0];
		} else {
			bagData.remarks = remarks;
		}
		return bagData;
	}

	static not(predicate) {
		return (arg) => {
			return !predicate(arg);
		};
	}

	// 'BAG ALLOWANCE     -INDMUC-01P/DL/EACH PIECE UP TO 50 POUNDS/23 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS    ',
	static parseMainLine(line) {
		const regex =
			'/^' +
			'BAG ALLOWANCE     -' +
			'(?<departureStopover>[A-Z]{3})' +
			'(?<destinationStopover>[A-Z]{3})-' +
			'(' +
			'(?<allowanceCode>[A-Z\\d]+)' +
			'|' +
			'(?<noPriceDueTo>\\*|[A-Z ]+)' +
			')\/' +
			'(?<airline>[A-Z\\d]{2})' +
			'(\\\/(?<sizeInfo>.+))? *' +
			'$/';
		let matches = [];
		if (php.preg_match(regex, line, matches = [])) {
			let sizeInfo = null;
			if (php.isset(matches.sizeInfo) && matches.sizeInfo) {
				sizeInfo = this.parseSizeInfoText(matches.sizeInfo) || {
					error: 'failed to parse',
					raw: matches.sizeInfo.trim(),
				};
			}
			const code = matches.allowanceCode;
			const amount = !code ? null :
				ParserUtil.parseBagAmountCode(code);
			return {
				departureStopover: matches.departureStopover,
				destinationStopover: matches.destinationStopover,
				amount: amount,
				noPriceDueTo: matches.noPriceDueTo,
				airline: matches.airline,
				sizeInfoRaw: matches.sizeInfo,
				sizeInfo: sizeInfo,
			};
		} else {
			return {error: 'failed to parse', raw: line};
		}
	}

	// '1STCHECKED BAG FEE-FATGCM-USD25.00/AA/UP TO 50 POUNDS/23 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS**        ',
	static parseBagFeeLine(line) {
		let matches, regex, sizeInfo;

		matches = [];
		regex =
			'/^' +
			'(?<feeNumber>\\d+)' +
			'(ST|ND|RD|TH)CHECKED BAG FEE-' +
			'(?<departureStopover>[A-Z]{3})' +
			'(?<destinationStopover>[A-Z]{3})-' +
			'(' +
			'(?<currency>[A-Z]{3})' +
			'(?<amount>\\d+(\\.\\d*)?)' +
			'|' +
			'(?<noPriceDueTo>\\*|[A-Z ]+)' +
			')\/' +
			'(?<airline>[A-Z\\d]{2})' +
			'(\/' +
			'(?<sizeInfo>[^\\*]+)' +
			'(?<generalRemarkIndicator>\\*\\*)?' +
			')? *' +
			'$/';

		if (php.preg_match(regex, line, matches = [])) {
			if (php.isset(matches.sizeInfo)) {
				sizeInfo = this.parseSizeInfoText(matches.sizeInfo) || {
					error: 'failed to parse',
					raw: php.trim(matches.sizeInfo)
				};
			}

			return {
				feeNumber: matches.feeNumber,
				departureStopover: matches.departureStopover,
				destinationStopover: matches.destinationStopover,
				currency: matches.currency || null,
				amount: matches.amount || null,
				airline: matches.airline,
				sizeInfoRaw: matches.sizeInfo,
				sizeInfo: sizeInfo || [],
				noPriceDueTo: (matches.noPriceDueTo || '') || null,
				isGeneralRemarkReferenced: php.isset(matches.generalRemarkIndicator) ? true : false,
			};
		} else {
			return {error: 'failed to parse', raw: line};
		}
	}

	// 'JFKCDG CDGBRE BRECDG CDGNAP NAPCDG ABJCDG CDGJFK-01P/AF        ',
	// '01/UP TO 26 POUNDS/12 KILOGRAMS AND UP TO 45 LINEAR INCHES/115 ',
	// 'LINEAR CENTIMETERS                                             ',
	// 'ORYABJ-01P/SS                                                  ',
	// '01/UP TO 26 POUNDS/12 KILOGRAMS AND UP TO 45 LINEAR INCHES/115 ',
	// 'LINEAR CENTIMETERS                                             ',
	//
	// 'STLMSP MSPJFK JFKDKR AMSMSP MSPSTL STLSLC SLCLAX-DL-CARRY ON FE',
	// 'ES UNKNOWN-CONTACT CARRIER                                     ',
	static parseCarryOnAllowanceBundle(dump) {
		const split = php.preg_split(/^(0\d\/)/m, dump, -1, php.PREG_SPLIT_DELIM_CAPTURE);
		const bundleLine = php.str_replace('\n', '', split.shift());

		const pieces = [];
		for (let [delim, content] of php.array_chunk(split, 2)) {
			const pieceQuantity = php.intval(php.substr(delim, 0, 2));
			for (let i = 0; i < pieceQuantity; ++i) {
				content = php.str_replace('\n', '', content);
				const sizeInfo = this.parseSizeInfoText(content);
				let data, pieceType;
				if (sizeInfo) {
					data = sizeInfo;
					pieceType = 'sizeInfo';
				} else {
					data = null;
					pieceType = 'description';
				}
				pieces.push({
					data: data,
					pieceType: pieceType || 'unknown',
					text: php.rtrim(content),
				});
			}
		}

		return {
			bundle: this.parseCarryOnBundleLine(bundleLine),
			pieces: pieces,
		};
	}

	static parseCarryOnChargesBundle(dump) {
		const maybeNaLine = php.str_replace('\n', '', dump);
		if (php.rtrim(maybeNaLine).endsWith('-CARRY ON FEES UNKNOWN-CONTACT CARRIER')) {
			return {
				bundle: this.parseCarryOnBundleLine(maybeNaLine),
			};
		} else {
			const lines = dump.split('\n');
			// hoping sabre won't put 8+ city pairs in
			// same bundle when they do not fit into the line
			const bundleLine = lines.shift();
			return {
				bundle: this.parseCarryOnBundleLine(bundleLine),
				rawInfoLines: lines,
			};
		}
	}

	// 'EACH PIECE UP TO 11 POUNDS/5 KILOGRAMS'
	// 'EACH PIECE UP TO 15 POUNDS/7 KILOGRAMS AND UP TO 41 LINEAR INCHES/105 LINEAR CENTIMETERS'
	// 'UP TO 50 POUNDS/23 KILOGRAMS AND UP TO 81 LINEAR INCHES/208 LINEAR CENTIMETERS'
	// 'UP TO 50 POUNDS/23 KILOGRAMS AND UP TO 50 POUNDS/127 LINEAR CENTIMETERS'
	static parseSizeInfoText(text) {
		let matches;
		if (php.preg_match(/^EACH PIECE (\S.*)/, text, matches = [])) {
			text = matches[1];
		}

		const result = {};

		for (const and of php.explode(' AND ', text)) {
			if (php.preg_match(/^\s*UP TO\s*(.*)$/, and, matches = [])) {
				const slashed = matches[1];
				for (const limit of slashed.split('/')) {
					if (php.preg_match(/^\s*(\d+) POUNDS\s*$/, limit, matches = [])) {
						result.weightInLb = matches[1];
					} else if (php.preg_match(/^\s*(\d+) KILOGRAMS\s*/, limit, matches = [])) {
						result.weightInKg = matches[1];
					} else if (php.preg_match(/^\s*(\d+) (LINEAR )?INCHES\s*/, limit, matches = [])) {
						result.sizeInInches = matches[1];
					} else if (php.preg_match(/^\s*(\d+) (LINEAR )?CENTIMETERS\s*/, limit, matches = [])) {
						result.sizeInCm = matches[1];
					} else {
						result.unparsed.push(limit);
					}
				}
			} else {
				result.unparsed = result.unparsed || [];
				result.unparsed.push(and);
			}
		}

		if (result && php.empty(result.unparsed)) {
			return {
				weightInLb: result.weightInLb,
				weightInKg: result.weightInKg,
				sizeInInches: result.sizeInInches,
				sizeInCm: result.sizeInCm,
			};
		} else {
			return null;
		}
	}

	static splitBundleSections(lines) {
		let header, bundleSections, currentLines, line;

		header = php.array_shift(lines); // "CARRY ON ALLOWANCE"

		bundleSections = [];
		currentLines = [];
		while (line = php.array_shift(lines)) {
			if (!php.empty(currentLines) &&
				this.parseCarryOnBundleLine(line) ||
				php.preg_match(/^[A-Z]{6}( [A-Z]{6}){7}.*/, line) // 8 airport pairs - for case when full list does not fit into a line
			) {
				bundleSections.push(currentLines.join('\n'));
				currentLines = [];
			}
			currentLines.push(line);
		}
		bundleSections.push(currentLines.join('\n'));

		return bundleSections;
	}

	static parseCarryOnBundleLine(line) {
		const regex =
			'/^' +
			'(?<cityPairs>[A-Z]{6}( [A-Z]{6})*)-' +
			'((?<bagAllowanceCode>[A-Z\\d]{3})\\\/)?' +
			'((?<weightInKg>\\d+)KG\\\/)?' +
			'(?<airline>[A-Z\\d]{2})' +
			'(-(?<error>.*))?' +
			'\\s*$/';

		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			const cityPairs = matches.cityPairs.split(' ').map((p) => {
				const [dprt, dst] = php.str_split(p, 3);
				return {
					departureAirport: dprt,
					destinationAirport: dst,
				};
			});

			return {
				cityPairs: cityPairs,
				amount: matches.bagAllowanceCode
					? ParserUtil.parseBagAmountCode(matches.bagAllowanceCode)
					: (matches.weightInKg
						? {
							units: 'kilograms',
							amount: matches.weightInKg,
							unitsCode: 'KG',
						}
						: null),
				airline: matches.airline,
				error: php.isset(matches.error) ? php.rtrim(matches.error) : null,
				isAvailable: !php.isset(matches.error),
			};
		} else {
			return null;
		}
	}

	// 'EMBARGOES-APPLY TO EACH PASSENGER                              ',
	// 'PSPSLC SLCPSP-DL                                               ',
	// 'PET IN HOLD NOT PERMITTED                                      ',
	// 'SPORTING EQUIPMENT/CANOE/KAYAK NOT PERMITTED                   ',
	// 'SLCLHR LHRSLC-DL                                               ',
	// 'PET IN HOLD NOT PERMITTED                                      ',
	// 'PET IN CABIN NOT PERMITTED                                     ',
	// 'OVER 70 POUNDS/32 KILOGRAMS NOT PERMITTED                      ',
	// 'SPORTING EQUIPMENT/CANOE/KAYAK NOT PERMITTED                   ',
	static parseAdditionalInfo(lines) {
		return lines;
	}
}

module.exports = BagAllowanceParser;
