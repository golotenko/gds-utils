const SellStatusParser = require('../../../../src/text_format_processing/apollo/actions/SellStatusParser.js');

const provide_parse = () => {
	const testCases = [];

	testCases.push({
		input: [
			"0 AVAIL/WL CLOSED * *",
			"0 AVAIL/WL CLOSED * *",
			" 4 KE 3483T  27FEB ORDDTW SS2  1114A  137P *                 E",
			"VALID FOR INTL ONLINE STOP/CONNECTIONS ONLY - KE",
			"OFFER CAR/HOTEL    >CAL;     >HOA;",
			"OPERATED BY ENDEAVOR AIR DBA DELTA CONNECTION",
			"DEPARTS ORD TERMINAL 2  - ARRIVES DTW TERMINAL EM",
			"><",
		].join('\n'),
		output: {
			failedSegments: [
				{raw: '0 AVAIL/WL CLOSED * *'},
				{raw: '0 AVAIL/WL CLOSED * *'},
			],
			segments: [
				{segmentNumber: 4, airline: 'KE', flightNumber: '3483'},
			],
		},
	});

	testCases.push({
		input: [
			"   ET  552U  16JUL ADDYYZ SS5  1055P  825A|*      1          E",
			"010 KP 1105 *",
			"010 SA 7194 *",
			"OFFER CAR/HOTEL    >CAL;     >HOA;",
			"DEPARTS ADD TERMINAL 2  - ARRIVES YYZ TERMINAL 1 ",
			"ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
			"PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
			"WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
			"FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
			"CANCEL REQUEST COMPLETED",
			"><",
		].join('\n'),
		output: {
			segments: [
				{airline: 'ET', flightNumber: '552'},
			],
		},
	});

	return testCases.map(tc => [tc]);
};

class SellStatusParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js') {

	test_parse({input, output}) {
		const actual = SellStatusParser.parse(input);
		this.assertSubTree(output, actual);
	}

	getTestMapping() {
		return [
			[provide_parse, this.test_parse],
		];
	}
}

module.exports = SellStatusParserTest;