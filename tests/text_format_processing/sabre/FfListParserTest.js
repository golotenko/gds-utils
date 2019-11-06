
const FrequentFlyerParser = require('../../../src/text_format_processing/sabre/FfListParser.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

class FrequentFlyerParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js')
{
	provideDumps()  {
		const list = [];

		// #0 - several entries per passenger
		list.push([
			php.implode(php.PHP_EOL, [
				'FREQUENT TRAVELER',
				'  1.AD L2582443327          HK AD   1.1 CUEVAS/JESSE THOMAS',
				'  2.AD L9259135573          HK AD   2.1 NOEL/MARTHA WALKER',
				'  3.DL 2582443327           HK DL   1.1 CUEVAS/JESSE THOMAS',
				'  4.DL 9259135573           HK DL   2.1 NOEL/MARTHA WALKER',
			]),
			{
				'mileagePrograms': [
					{'operatingAirline': 'AD', 'code': 'L2582443327', 'passengerName': 'CUEVAS/JESSE THOMAS'},
					{'operatingAirline': 'AD', 'code': 'L9259135573', 'passengerName': 'NOEL/MARTHA WALKER'},
					{'operatingAirline': 'DL', 'code': '2582443327', 'passengerName': 'CUEVAS/JESSE THOMAS'},
					{'operatingAirline': 'DL', 'code': '9259135573', 'passengerName': 'NOEL/MARTHA WALKER'},
				],
			},
		]);

		// #1 - with "IVOR" remark and different codeAirline/statusAirline
		list.push([
			php.implode(php.PHP_EOL, [
				'FREQUENT TRAVELER',
				'  1.KL 2101788775           HK KQ   1.1 ACHIENG/JARED ONYANGO',
				'       IVOR',
			]),
			{
				'mileagePrograms': [
					{
						'airline': 'KL',
						'code': '2101788775',
						'status': 'HK',
						'operatingAirline': 'KQ',
						'passengerNumber': '1.1',
						'passengerName': 'ACHIENG/JARED ONYANGO',
						'remark': 'IVOR'
					},
				],
			},
		]);

		// #2 - with a number remark
		list.push([
			php.implode(php.PHP_EOL, [
				'FREQUENT TRAVELER',
				'  1.UA HQF23822             HK UA   1.1 CAROTHERS/PAUL ELLIS',
				'       1',
				'  2.UA HQF23848             HK UA   2.1 CAROTHERS/WENDY ROSS',
				'       1',
			]),
			{
				'mileagePrograms': [
					{'remark': '1', 'code': 'HQF23822', 'passengerNumber': '1.1', 'passengerName': 'CAROTHERS/PAUL ELLIS'},
					{'remark': '1', 'code': 'HQF23848', 'passengerNumber': '2.1', 'passengerName': 'CAROTHERS/WENDY ROSS'},
				],
			},
		]);

		// #3 - with remark containing a slash
		list.push([
			php.implode(php.PHP_EOL, [
				'FREQUENT TRAVELER',
				'  1.AA H387L58              HK AA   1.1 DARVISCHI/STEFAN D',
				'       * PLT/SPH *',
				'  2.AA H387L58              HK AY   1.1 DARVISCHI/STEFAN D',
				'       * PLT/SPH *',
			]),
			{
				'mileagePrograms': [
					{'remark': '* PLT/SPH *', 'code': 'H387L58', 'passengerName': 'DARVISCHI/STEFAN D'},
					{'remark': '* PLT/SPH *', 'code': 'H387L58', 'passengerName': 'DARVISCHI/STEFAN D'},
				],
			},
		]);

		// #4 - HPDGER - with different code airline and status airline
		list.push([
			php.implode(php.PHP_EOL, [
				'FREQUENT TRAVELER',
				'  1.AA 881MCF0              HK AA   1.1 BOYLE/KERRY J',
				'  2.AA 881MCF0              HK BA   1.1 BOYLE/KERRY J',
				'  3.AA 2C87T30              HK AA   2.1 BOYLE/TIMOTHY G',
				'  4.AA 2C87T30              HK BA   2.1 BOYLE/TIMOTHY G',
			]),
			{
				'mileagePrograms': [
					{'airline': 'AA', 'code': '881MCF0', 'operatingAirline': 'AA', 'passengerName': 'BOYLE/KERRY J'},
					{'airline': 'AA', 'code': '881MCF0', 'operatingAirline': 'BA', 'passengerName': 'BOYLE/KERRY J'},
					{'airline': 'AA', 'code': '2C87T30', 'operatingAirline': 'AA', 'passengerName': 'BOYLE/TIMOTHY G'},
					{'airline': 'AA', 'code': '2C87T30', 'operatingAirline': 'BA', 'passengerName': 'BOYLE/TIMOTHY G'},
				],
			},
		]);

		// #5 - EDPRDZ - with segment
		list.push([
			php.implode(php.PHP_EOL, [
				'FREQUENT TRAVELER',
				'  1.AA 5W31WW4              HK AA   1.1 HANCOCK/AMANDA ELIZABET',
				'       AA1185K 18AUG PHLORD',
				'       * PCC *',
				'  2.QF 2725875              HK QF   1.1 HANCOCK/AMANDA ELIZABET',
				'       * SPH *FFGD',
			]),
			{
				'mileagePrograms': [
					{
						'airline': 'AA',
						'code': '5W31WW4',
						'passengerName': 'HANCOCK/AMANDA ELIZABET',
						'segment': {
							'airline': 'AA',
							'flightNumber': '1185',
							'bookingClass': 'K',
							'departureDate': {
								'raw': '18AUG',
								'parsed': '08-18',
							},
							'departureAirport': 'PHL',
							'destinationAirport': 'ORD',
						},
						'remark': '* PCC *',
					},
					{
						'airline': 'QF',
						'code': '2725875',
						'passengerName': 'HANCOCK/AMANDA ELIZABET',
						'remark': '* SPH *FFGD',
					},
				],
			},
		]);

		return list;
	}

	/**
	 * @test
	 * @dataProvider provideDumps
	 */
	testParser(dump, expectedResult)  {
		let actualResult = FrequentFlyerParser.parse(dump);
		this.assertArrayElementsSubset(expectedResult, actualResult);
	}

	getTestMapping() {
		return [
			[this.provideDumps, this.testParser],
		];
	}
}

module.exports = FrequentFlyerParserTest;
