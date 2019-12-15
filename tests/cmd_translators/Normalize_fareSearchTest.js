const Normalize_fareSearch = require('../../src/cmd_translators/Normalize_fareSearch.js');

const provide_call = () => {
	const testCases = [];

	testCases.push({
		title: 'Normalize Amadeus account code',
		input: {
			cmd: 'FQDLAXAKL/17SEP/AVA/R,U12345',
			gds: 'amadeus',
			baseDate: '2019-12-16',
		},
		output: {
			departureAirport: 'LAX',
			destinationAirport: 'AKL',
			departureDate: {raw: '17SEP'},
			typeToData: {
				airlines: ['VA'],
				fareType: 'private',
				accountCode: '12345',
			},
		},
	});

	testCases.push({
		title: 'Normalize Galileo account code',
		input: {
			cmd: 'FD20MAYLONJFK-PRI-TPACK:P',
			gds: 'galileo',
			baseDate: '2019-12-16',
		},
		output: {
			departureAirport: 'LON',
			destinationAirport: 'JFK',
			departureDate: {raw: '20MAY'},
			typeToData: {
				fareType: 'private',
				accountCode: 'TPACK',
			},
		},
	});

	return testCases.map(t => [t]);
};

/** for completion */
const provide_call_item = () => {
	return provide_call()[Math.random()];
};

class Normalize_fareSearchTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js')
{
	/** @param testCase = provide_call_item() */
	test_call(testCase) {
		const {input, output} = testCase;
		const actual = Normalize_fareSearch(input);
		this.assertArrayElementsSubset(output, actual);
	}

	getTestMapping() {
		return [
			[provide_call, this.test_call],
		];
	}
}

module.exports = Normalize_fareSearchTest;
