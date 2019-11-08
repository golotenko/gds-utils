
const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * Apollo : MPN1*@LH12345678910
 * Sabre  : FFAA987654321/CX,AS,EI,QF-2.2
 * Amadeus: FFNUA-123456778910,UA,LH/P1
 * Galileo: M+P1/UA12345876490/BD/LH/AC
 */
class Translate_addFrequentFlyerNumber {
	static normalizeData(parsedData, gds) {
		if (!parsedData) {
			return null;
		}
		if (gds === 'apollo') {
			return parsedData;
		} else if (gds === 'sabre') {
			return {
				passengers: [{
					majorPaxNum: parsedData.majorPaxNum,
					minorPaxNum: parsedData.minorPaxNum,
					mileagePrograms: [{
						airline: parsedData.airline,
						code: parsedData.code,
						partners: parsedData.partners,
					}],
				}],
			};
		} else if (gds === 'amadeus') {
			return {
				passengers: [{
					majorPaxNum: parsedData.majorPaxNum,
					minorPaxNum: null,
					mileagePrograms: [{
						airline: parsedData.airline,
						code: parsedData.code,
						partners: parsedData.partners
							.filter((partner) => partner !== parsedData.airline),
					}],
				}],
			};
		} else if (gds === 'galileo') {
			return {
				passengers: [{
					majorPaxNum: parsedData.majorPaxNum,
					minorPaxNum: null,
					mileagePrograms: parsedData.mileagePrograms,
				}],
			};
		} else {
			return null;
		}
	}

	static flattenMileagePrograms(norm) {
		const flatMps = [];
		for (const pax of Object.values(norm.passengers)) {
			for (const mp of Object.values(pax.mileagePrograms)) {
				flatMps.push({
					airline: mp.airline,
					code: mp.code,
					partners: mp.partners || [],
					majorPaxNum: pax.majorPaxNum,
					minorPaxNum: pax.majorPaxNum,
				});
			}
		}
		return flatMps;
	}

	static glueTranslatedData(norm, gds) {
		if (!norm) {
			return null;
		}
		const flatMps = this.flattenMileagePrograms(norm);
		if (gds === 'apollo') {
			return 'MP' + norm.passengers.map((pax) => {
				const paxNum = !pax.majorPaxNum ? '' :
					'N' + pax.majorPaxNum + (php.empty(pax.minorPaxNum) ? '' :
					'-' + pax.minorPaxNum);
				return paxNum + pax.mileagePrograms.map((mp) => {
					const withAt = mp.withAllPartners || (php.count(mp.partners) > 0);
					const air = (mp.partners || {})[0] || mp.airline;
					return '*' + (withAt ? '@' : '') + air + mp.code;
				}).join('');
			}).join('|');
		} else if (gds === 'sabre') {
			return flatMps.map((mp) => {
				const paxNum = !mp.majorPaxNum ? '' :
					'-' + mp.majorPaxNum + (php.empty(mp.minorPaxNum) ? '' :
					'.' + mp.minorPaxNum);
				const partnerPart = php.empty(mp.partners) ? '' : '/' + php.implode(',', mp.partners);
				return 'FF' + mp.airline + mp.code + partnerPart + paxNum;
			}).join('§');
		} else if (gds === 'amadeus') {
			return flatMps.map((mp) => {
				const paxNum = !mp.majorPaxNum ? '' : '/P' + mp.majorPaxNum;
				const partners = mp.partners || [];
				if (!php.empty(partners) && mp.airline && !php.in_array(mp.airline, partners)) {
					php.array_unshift(partners, mp.airline);
				}
				const addComa = (partner) => ',' + partner;
				const partnerPart = partners.map(addComa).join('');
				return 'FFN' + mp.airline + '-' + mp.code + partnerPart + paxNum;
			}).join(';');
		} else if (gds === 'galileo') {
			return flatMps.map((mp) => {
				const paxNum = !mp.majorPaxNum ? '' : 'P' + mp.majorPaxNum + '/';
				const addSlash = (partner) => '/' + partner;
				const partnerPart = mp.partners.map(addSlash).join('');
				return 'M.' + paxNum + mp.airline + mp.code + partnerPart;
			}).join('|');
		} else {
			return null;
		}
	}

	/** @param parsedData = require('CmdParser.js').parse().data */
	static translate(parsedData, fromGds, toGds) {
		const norm = this.normalizeData(parsedData, fromGds);
		return this.glueTranslatedData(norm, toGds);
	}
}

module.exports = ({data, fromGds, toGds}) => Translate_addFrequentFlyerNumber.translate(data, fromGds, toGds);
