
const FcTokenizer = require('./FcTokenizer.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * parse Linear Fare Construction, aka Fare Calculation line
 * Example:
 * SFO MU SHA 194.00VPRNB/ITN3 MU DPS 221.88ZLAP60BO/ITN3 MU X/SHA MU SFO 305.55Q3MNBZ/ITN3 NUC721.43 -INFORMATIONAL FARES SELEC TED-END ROE1.0
 */
class FcParser {
	static addDecimal($a, $b) {
		return (+$a + +$b).toFixed(2);
	}

	// 'X/', 'E/X/', '', 'R/'
	static parseFlags(flagsText) {
		const letters = flagsText.split('/');
		letters.pop();
		const codes = {
			X: 'noStopover',
			E: 'extraMiles',
			L: 'reducesMpm', // maximum permitted mileage
			T: 'ticketed',

			// not sure they belong here
			R: 'commonCity',
			C: 'combined',
			B: 'equalizedMiles',
		};
		return letters.map((letter) => ({
			raw: letter,
			parsed: codes[letter] || null,
		}));
	}

	static collectEnding(tokens) {
		const data = php.array_combine(
			php.array_column(tokens, 'lexeme'),
			php.array_column(tokens, 'data')
		);
		const lexemeToPos = php.array_combine(
			php.array_column(tokens, 'lexeme'),
			php.array_keys(tokens)
		);
		if (php.count(data) < php.count(tokens)) {
			// got repeating ending tokens - something went wrong
			return null;
		}
		let [currency, totalAmount] = data.totalFare || [null, null];
		let markup = null;
		let fare = totalAmount;
		if (totalAmount) {
			let discount;
			if (markup = data.sabreMarkup || null) {
				// markup is included in `totalFare` only if it is before NUC
				if (lexemeToPos.sabreMarkup < (lexemeToPos.totalFare || -1)) {
					fare = this.addDecimal(totalAmount, '-' + markup);
				} else {
					totalAmount = this.addDecimal(totalAmount, markup);
				}
			} else if (markup = data.apolloMarkup || null) {
				fare = this.addDecimal(totalAmount, '-' + markup);
			} else if (discount = data.apolloDiscount || null) {
				fare = this.addDecimal(totalAmount, discount);
				markup = this.addDecimal('0.00', '-' + discount);
			}
		}
		const facilityCharges = [];
		if (data.facilityCharge) {
			const [xfTotal, airports] = data.facilityCharge;
			let matches;
			if (php.preg_match_all(/([A-Z]{3})([\.\d]+)/, airports, matches = [], php.PREG_SET_ORDER)) {
				for (const [, airport, amount] of matches) {
					facilityCharges.push({airport, amount});
				}
			}
		}
		return {
			markup: markup,
			currency: currency,
			fareAndMarkupInNuc: totalAmount,
			fare: fare,
			hasEndMark: php.isset(data.end),
			infoMessage: (data.end || {}).infoMessage || null,
			rateOfExchange: data.rateOfExchange || null,
			facilityCharges: facilityCharges,
		};
	}

	static collectSegment(tokens, lastCity) {
		const segment = {departure: lastCity};
		for (const token of tokens) {
			const lexeme = token.lexeme;
			const data = token.data;
			if (lexeme === 'segment') {
				segment.airline = data.airline;
				segment.flags = this.parseFlags(data.flags);
				segment.destination = data.destination;
				const oceanic = data.oceanicFlight;
				if (oceanic) {
					segment.oceanicFlight = oceanic;
				}
				const starMark = data.starMark || null;
				if (starMark) {
					segment.hasStarMark = true;
				}
			} else if (lexeme === 'fare') {
				if (data.mileagePrinciple) {
					segment.mileageSurcharge = data.mileagePrinciple;
				}
				if (data.from) {
					segment.fareCities = [data.from, data.to];
				}
				segment.fare = data.amount;
			} else if (lexeme === 'fuelSurcharge') {
				const [cities, amount] = data;
				segment.fuelSurcharge = this.addDecimal(segment.fuelSurcharge || '0', amount);
				segment.fuelSurchargeParts = segment.fuelSurchargeParts || [];
				segment.fuelSurchargeParts.push(amount);
			} else if (lexeme === 'stopoverFee') {
				const [excessMark, number, amount] = data;
				segment.stopoverFees = segment.stopoverFees || [];
				segment.stopoverFees.push({
					excessMark: excessMark || undefined,
					stopoverNumber: number,
					amount: amount,
				});
			} else if (lexeme === 'fareBasis') {
				segment.fareBasis = data[0];
				segment.ticketDesignator = data[1] || null;
			} else if (lexeme === 'nextDeparture') {
				const [faredMark, flags, city] = data;
				segment.nextDeparture = {
					fared: faredMark === '/',
					flags: this.parseFlags(flags),
					city: city,
				};
			} else if (lexeme === 'fareClassDifference') {
				const [from, to, mileageSurcharge, amount] = data;
				segment.fareClassDifferences = segment.fareClassDifferences || [];
				segment.fareClassDifferences.push({from, to, mileageSurcharge, amount});
			} else if (lexeme === 'requiredMinimum') {
				const [from, to, amount] = data;
				segment.requiredMinimum = {from, to, amount};
			} else if (php.in_array(lexeme, ['hiddenInclusiveTourFare', 'hiddenBulkTourFare'])) {
				segment.fare = data;
				segment.isFareHidden = true;
			} else {
				segment.misc = segment.misc || [];
				segment.misc.push(token);
			}
		}
		return segment;
	}

	static endsAllSegments($token) {
		return php.in_array($token['lexeme'], FcTokenizer.getItineraryEndLexemes());
	}

	static endsCurrentSegment(token) {
		return token.lexeme === 'segment' || this.endsAllSegments(token);
	}

	static isSameAmount($a, $b) {
		// some airlines put +- 1 cent/dollar in the NUC for rounding
		return php.abs($a - $b) <= 1.00;
	}

	static isValidEnding(ending, segments) {
		const segmentSum = php.array_sum(segments.map((segment) => {
			return php.array_sum([
				segment.fare || 0,
				segment.fuelSurcharge || 0,
				php.array_sum(php.array_column(segment.stopoverFees || [], 'amount')),
				php.array_sum(php.array_column(segment.fareClassDifferences || [], 'amount')),
				(segment.requiredMinimum || {})['amount'] || 0,
			]);
		}));
		if (ending.hasHiddenFares) {
			return php.count(segments) > 0 && ending.hasEndMark;
		} else {
			return ending.currency && ending.fare
				// usually not needed, but helps understand when error happens
				&& this.isSameAmount(ending.fare || '0.00', segmentSum);
		}
	}

	/**
	 * it best fits into current format when you think of
	 * side trip segments as a property of the preceding
	 * segment, that can be followed by more properties, like fare
	 *
	 * though actually this fare belongs not to the segment, but to whole FQN component
	 * (likewise to normal segments, where fare is specified only on the
	 * last segment even though it applies to all preceding segments as well)
	 */
	static collectSideTripSegments(tokens, parentSegment) {
		let lastCity = parentSegment.destination;
		let segmentStart = 0;
		const segments = [];
		for (let i = 0; i < tokens.length; ++i) {
			const next = tokens[i + 1];
			if (!next || this.endsCurrentSegment(next)) {
				const segment = this.collectSegment(tokens.slice(segmentStart, i + 1), lastCity);
				if (!segment) {
					return null;
				}
				segmentStart = i + 1;
				lastCity = (segment.nextDeparture || {}).city || segment.destination || null;
				segments.push(segment);
			}
		}
		return segments;
	}

	static collectStructure(tokens) {
		tokens = [...tokens];
		if (php.empty(tokens)) return null;
		const firstToken = php.array_shift(tokens);
		if (firstToken.lexeme !== 'firstDeparture') return null;
		let lastCity = firstToken.data;
		const segments = [];

		let segmentTokens = [tokens.shift()];
		let sideTripTokens = [];
		let token;
		while (token = tokens.shift()) {
			if (token.lexeme === 'sideTripStart') {
				let subToken;
				while (subToken = tokens.shift()) {
					sideTripTokens.push(subToken);
					if (subToken.lexeme === 'sideTripEnd') {
						break;
					}
				}
			}
			if (this.endsCurrentSegment(token)) {
				const segment = this.collectSegment(segmentTokens, lastCity);
				segments.push(segment);
				const sideTripSegments = this.collectSideTripSegments(sideTripTokens, segment);
				if (sideTripSegments === null) {
					return null;
				}
				sideTripTokens = [];
				segments.push(...sideTripSegments);
				segmentTokens = [token];
				const lastSeg = segments.slice(-1)[0];
				lastCity = (segment.nextDeparture || {}).city || lastSeg.destination || null;
				if (!lastCity) {
					return null;
				}
			}
			segmentTokens.push(token);
			if (this.endsAllSegments(token)) {
				const result = this.collectEnding([token, ...tokens]);
				if (result && sideTripTokens.length === 0) {
					const isFareHidden = ($seg) => $seg.isFareHidden || null;
					result.hasHiddenFares = segments.some(isFareHidden);
					if (this.isValidEnding(result, segments)) {
						return php.array_merge({segments}, result);
					}
				}
				break;
			}
		}
		return null;
	}

	static parse($dump) {
		const isNotWhitespace = (lexeme) => lexeme.lexeme !== 'whitespace';
		const combinationLimit = 10;
		let result = {
			parsed: null,
			tokens: [],
			textLeft: $dump,
		};
		let errorTokens = [];
		let errorTextLeft = $dump;
		let i = 0;
		const split = new FcTokenizer();
		for (const lexed of split.tryTokenCombinations($dump)) {
			const tokens = lexed.lexemes;
			const filtered = lexed.lexemes.filter(isNotWhitespace);
			const textLeft = lexed.text;
			const maybeParsed = this.collectStructure(filtered);
			if (maybeParsed && textLeft.length < result.textLeft.length) {
				result = {
					parsed: maybeParsed,
					tokens: tokens,
					textLeft: textLeft,
				};
			} else if (textLeft.length < errorTextLeft.length) {
				errorTokens = tokens;
				errorTextLeft = lexed.text;
			}
			if (++i > combinationLimit) break;
		}
		return result.parsed ? result : {
			error: i > combinationLimit
				? 'combination depth reached limitation - ' + combinationLimit + ' on ' + errorTextLeft.slice(0, 7)
				: 'failed to completely parse fare construction in ' + i + ' attempts on ' + errorTextLeft.slice(0, 7),
			tokens: errorTokens,
			textLeft: errorTextLeft,
		};
	}
}

module.exports = FcParser;
