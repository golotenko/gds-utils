const Parse_priceItinerary = require('../../../../src/text_format_processing/sabre/commands/Parse_priceItinerary.js');

const provide_call = () => {
	const testCases = [];

	testCases.push({
		title: 'tax override modifier example',
		input: 'WPTX0.00YY',
		output: {
			pricingModifiers: [
				{type: 'overrideTaxes', parsed: {
					taxes: [
						{amount: '0.00', taxCode: 'YY'},
					],
				}},
			],
		},
	});

	testCases.push({
		title: 'tax override multiple taxes',
		input: 'WPTX0.10TX/1.00XX',
		output: {
			pricingModifiers: [
				{type: 'overrideTaxes', parsed: {
					taxes: [
						{amount: '0.10', taxCode: 'TX'},
						{amount: '1.00', taxCode: 'XX'},
					],
				}},
			],
		},
	});

	testCases.push({
		title: 'booking class override example',
		input: 'WPOC-BK',
		output: {
			pricingModifiers: [
				{type: 'bookingClass', parsed: 'K'},
			],
		},
	});

	testCases.push({
		title: 'cabin class modifier example',
		input: 'WPNC¥TC-BB',
		output: {
			pricingModifiers: [
				{raw: 'NC'},
				{type: 'cabinClass', parsed: {raw: 'BB', parsed: 'business'}},
			],
		},
	});

	return testCases.map(c => [c]);
};

class Parse_priceItineraryTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js') {
	test_call(testCase) {
		const actual = Parse_priceItinerary(testCase.input);
		this.assertArrayElementsSubset(testCase.output, actual);
	}

	getTestMapping() {
		return [
			[provide_call, this.test_call],
		];
	}
}

module.exports = Parse_priceItineraryTest;
