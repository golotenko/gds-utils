

const php = require("enko-fundamentals/src/Transpiled/php.js");
const {mkReg} = require('enko-fundamentals/src/Utils/Misc.js');

// '@AA4346366363', 'UA12345678910'
const parseMpAir = (airPart) => {
	let matches;
	if (php.preg_match(/^(@|)([A-Z0-9]{2})([A-Z0-9]*)$/, airPart, matches = [])) {
		const [, at, airline, code] = matches;
		return {
			withAllPartners: at ? true : false,
			airline: airline,
			code: code,
		};
	} else {
		return null;
	}
};

const regex_pax = mkReg([
	/^/,
	/(N?(?<majorPaxNum>\d+)(-(?<minorPaxNum>\d+))?)?/,
	/\*(?<airPart>.*)/,
	/$/,
]);

// '*UA12345678910', 'N1*@LH12345678910',
// 'N2-1*@AA4346366363*@BA2315488786*@DL7845453554'
const parse_pax = (paxPart) => {
	const match = paxPart.match(regex_pax);
	if (match) {
		const groups = match.groups;
		const airParts = groups.airPart.split('*');
		const mpAirs = airParts.map(a => parseMpAir(a));
		if (mpAirs.some(a => !a)) {
			return null;
		} else {
			return {
				majorPaxNum: groups.majorPaxNum || '',
				minorPaxNum: groups.minorPaxNum || '',
				mileagePrograms: mpAirs,
			};
		}
	} else {
		return null;
	}
};

// 'MP*UA12345678910', 'MPN1*@LH12345678910', 'MP/X/N1*DL|2*AA'
// 'MPN1-1*@AA8853315554*@BA9742123848*@DL3158746568|N2-1*@AA4346366363*@BA2315488786*@DL7845453554'
const Parse_changeMp = (cmd) => {
	let matches;
	if (php.preg_match(/^MP(\/X\/|)(.*)$/, cmd, matches = [])) {
		const [, xMark, paxPart] = matches;
		let mpPaxes;
		if (paxPart === '*ALL') {
			mpPaxes = [];
		} else {
			const paxParts = paxPart.split('|');
			mpPaxes = php.array_map(a => parse_pax(a), paxParts);
		}
		if (mpPaxes.some(mpPax => !mpPax)) {
			return null;
		} else {
			return {
				type: xMark ? 'changeFrequentFlyerNumber' : 'addFrequentFlyerNumber',
				data: {passengers: mpPaxes},
			};
		}
	} else {
		return null;
	}
};

module.exports = Parse_changeMp;