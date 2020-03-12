
const php = require('enko-fundamentals/src/Transpiled/php.js');
const LinearFareParser = require('../../../../src/text_format_processing/galileo/pricing/LinearFareParser.js');

class LinearFareParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js') {
	provideTestCases() {
		const list = [];

		// first example
		list.push([
			php.implode(php.PHP_EOL, [
				'FQ-1 G13MAR18      ADT',
				'  KIV PS X/IEV PS RIX 603.79D1EP4 NUC603.79END ROE0.844659',
				'  FARE EUR 510.00 EQU USD 628.00 TAX JQ 3.10 TAX MD 11.10 TAX',
				'  WW 7.60 TAX UA 4.00 TAX YK 8.50 TAX YQ 18.00 TAX YR 28.40 TOT',
				'  USD 708.70',
				'FQ-2 G13MAR18      C03',
				'  KIV PS X/IEV PS RIX 452.84D1EP4/CH25 NUC452.84END ROE0.844659',
				'  FARE EUR 383.00 EQU USD 471.00 TAX JQ 3.10 TAX MD 11.10 TAX',
				'  WW 7.60 TAX UA 4.00 TAX YK 8.50 TAX YQ 18.00 TAX YR 28.40 TOT',
				'  USD 551.70',
				'FQ-3-4 G13MAR18      ADT',
				'  KIV PS X/IEV PS RIX 603.79D1EP4 NUC603.79END ROE0.844659',
				'  FARE EUR 510.00 EQU USD 628.00 TOT USD 628.00',
			]),
			{
				'ptcBlocks': [
					{
						'passengerNumbers': [1],
						'fareTypeCode': 'G',
						'addedDate': {'raw': '13MAR18', 'parsed': '2018-03-13'},
						'ptc': 'ADT',
						'fareConstruction': {
							'segments': [
								{'airline': 'PS', 'destination': 'IEV'},
								{'airline': 'PS', 'destination': 'RIX', 'fare': '603.79', 'fareBasis': 'D1EP4'},
							],
							'currency': 'NUC',
							'fare': '603.79',
							'rateOfExchange': '0.844659',
						},
						'baseFare': {'currency': 'EUR', 'amount': '510.00'},
						'fareEquivalent': {'currency': 'USD', 'amount': '628.00'},
						'taxes': [
							{'taxCode': 'JQ', 'amount': '3.10'},
							{'taxCode': 'MD', 'amount': '11.10'},
							{'taxCode': 'WW', 'amount': '7.60'},
							{'taxCode': 'UA', 'amount': '4.00'},
							{'taxCode': 'YK', 'amount': '8.50'},
							{'taxCode': 'YQ', 'amount': '18.00'},
							{'taxCode': 'YR', 'amount': '28.40'},
						],
						'netPrice': {'currency': 'USD', 'amount': '708.70'},
					},
					{
						'passengerNumbers': [2],
						'fareTypeCode': 'G',
						'addedDate': {'raw': '13MAR18', 'parsed': '2018-03-13'},
						'ptc': 'C03',
						'fareConstruction': {
							'segments': [
								{'airline': 'PS', 'destination': 'IEV'},
								{
									'airline': 'PS',
									'destination': 'RIX',
									'fare': '452.84',
									'fareBasis': 'D1EP4',
									'ticketDesignator': 'CH25',
								},
							],
							'currency': 'NUC',
							'fare': '452.84',
							'rateOfExchange': '0.844659',
						},
						'baseFare': {'currency': 'EUR', 'amount': '383.00'},
						'fareEquivalent': {'currency': 'USD', 'amount': '471.00'},
						'taxes': [
							{'taxCode': 'JQ', 'amount': '3.10'},
							{'taxCode': 'MD', 'amount': '11.10'},
							{'taxCode': 'WW', 'amount': '7.60'},
							{'taxCode': 'UA', 'amount': '4.00'},
							{'taxCode': 'YK', 'amount': '8.50'},
							{'taxCode': 'YQ', 'amount': '18.00'},
							{'taxCode': 'YR', 'amount': '28.40'},
						],
						'netPrice': {'currency': 'USD', 'amount': '551.70'},
					},
					{
						'passengerNumbers': [3, 4],
						'fareTypeCode': 'G',
						'addedDate': {'raw': '13MAR18', 'parsed': '2018-03-13'},
						'ptc': 'ADT',
						'fareConstruction': {
							'segments': [
								{'airline': 'PS', 'destination': 'IEV'},
								{'airline': 'PS', 'destination': 'RIX', 'fare': '603.79', 'fareBasis': 'D1EP4'},
							],
							'currency': 'NUC',
							'fare': '603.79',
							'rateOfExchange': '0.844659',
						},
						'baseFare': {'currency': 'EUR', 'amount': '510.00'},
						'fareEquivalent': {'currency': 'USD', 'amount': '628.00'},
						'taxes': [],
						'netPrice': {'currency': 'USD', 'amount': '628.00'},
					},
				],
			},
		]);

		// with non-sequential passenger numbers
		list.push([
			php.implode(php.PHP_EOL, [
				'FQ-1.4 G13MAR18      ADT       ',
				'  RDU DL X/DTT DL X/TYO DL MNL M2742.50MNERFFMU DL X/TYO DL',
				'  X/DTT DL RDU M2742.50MNERFFMU NUC5485.00END ROE1.0  XF',
				'  13.50RDU4.5DTW4.5DTW4.5',
				'  FARE USD 5485.00 TAX AY 11.20 TAX US 36.60 TAX XA 3.96 TAX XF',
				'  13.50 TAX XY 7.00 TAX YC 5.65 TAX OI 9.80 TAX SW 19.60 TAX LI',
				'  10.60 TAX YR 320.00 TOT USD 5922.91',
			]),
			{
				'ptcBlocks': [
					{
						'passengerNumbers': [1, 4],
						'fareTypeCode': 'G',
						'addedDate': {'raw': '13MAR18', 'parsed': '2018-03-13'},
						'ptc': 'ADT',
						'fareConstruction': {
							'segments': [
								{'destination': 'DTT'},
								{'destination': 'TYO'},
								{
									'destination': 'MNL',
									'mileageSurcharge': 'M',
									'fare': '2742.50',
									'fareBasis': 'MNERFFMU',
								},
								{'destination': 'TYO'},
								{'destination': 'DTT'},
								{
									'destination': 'RDU',
									'mileageSurcharge': 'M',
									'fare': '2742.50',
									'fareBasis': 'MNERFFMU',
								},
							],
							'currency': 'NUC',
							'fare': '5485.00',
							'rateOfExchange': '1.0',
						},
						'baseFare': {'currency': 'USD', 'amount': '5485.00'},
						'fareEquivalent': null,
						'taxes': [
							{'taxCode': 'AY', 'amount': '11.20'},
							{'taxCode': 'US', 'amount': '36.60'},
							{'taxCode': 'XA', 'amount': '3.96'},
							{'taxCode': 'XF', 'amount': '13.50'},
							{'taxCode': 'XY', 'amount': '7.00'},
							{'taxCode': 'YC', 'amount': '5.65'},
							{'taxCode': 'OI', 'amount': '9.80'},
							{'taxCode': 'SW', 'amount': '19.60'},
							{'taxCode': 'LI', 'amount': '10.60'},
							{'taxCode': 'YR', 'amount': '320.00'},
						],
						'netPrice': {'currency': 'USD', 'amount': '5922.91'},
					},
				],
			},
		]);

		// should wrap by 64 characters
		list.push([
			php.implode(php.PHP_EOL, [
				'FQ-1 Z28JUN18      ITX       ',
				'  EDI AA NYC 58.26OKN5F1M4U/GBT1 AA RDU AA X/E/LON BA EDI',
				'  5M61.17OKN5F1M4U/GBT1 NUC119.43END ROE0.738027  XF 3.40RDU4.5  FARE GBP 88.00 TAX GB 91.00 TAX UB 28.56 TAX AY 8.40 TAX US',
				'  27.60 TAX XA 3.00 TAX XF 3.40 TAX XY 5.30 TAX YC 4.30 TAX YR',
				'  158.00 TOT GBP 417.56',
			]),
			{
				'ptcBlocks': [
					{
						'passengerNumbers': [1],
						'fareTypeCode': 'Z',
						'addedDate': {'raw': '28JUN18', 'parsed': '2018-06-28'},
						'ptc': 'ITX',
						'fareConstruction': {
							'segments': [
								{
									'destination': 'NYC',
									'fare': '58.26',
									'fareBasis': 'OKN5F1M4U',
									'ticketDesignator': 'GBT1',
								},
								{'airline': 'AA', 'destination': 'RDU'},
								{'airline': 'AA', 'destination': 'LON'},
								{
									'airline': 'BA',
									'destination': 'EDI',
									'mileageSurcharge': '5M',
									'fare': '61.17',
									'fareBasis': 'OKN5F1M4U',
									'ticketDesignator': 'GBT1',
								},
							],
							'fare': '119.43',
							'rateOfExchange': '0.738027',
						},
						'baseFare': {'currency': 'GBP', 'amount': '88.00'},
						'taxes': [
							{'taxCode': 'GB', 'amount': '91.00'},
							{'taxCode': 'UB', 'amount': '28.56'},
							{'taxCode': 'AY', 'amount': '8.40'},
							{'taxCode': 'US', 'amount': '27.60'},
							{'taxCode': 'XA', 'amount': '3.00'},
							{'taxCode': 'XF', 'amount': '3.40'},
							{'taxCode': 'XY', 'amount': '5.30'},
							{'taxCode': 'YC', 'amount': '4.30'},
							{'taxCode': 'YR', 'amount': '158.00'},
						],
						'netPrice': {'currency': 'GBP', 'amount': '417.56'},
					},
				],
			},
		]);

		// failed to parse fare breakdown... because this dump should be wrapped by 63 chars?
		// session: 52084
		list.push([
			php.implode(php.PHP_EOL, [
				"FQ-1 G19APR19      ADT       ",
				"  TPA AA X/CLT AA LON M85.00OKW8I7B5 AY X/CLT AA TPA",
				"  M172.00QHX8Z7B5 NUC257.00END ROE1.0  XF 10.50TPA4.5CLT3CLT3  FARE USD 257.00 TAX AY 11.20 TAX US 37.20 TAX XA 3.96 TAX XF",
				"  10.50 TAX XY 7.00 TAX YC 5.77 TAX GB 101.80 TAX UB 60.80 TAX",
				"  YR 240.00 TOT USD 735.23",
			]),
			{
				'ptcBlocks': [
					{
						'passengerNumbers': [1],
						'fareTypeCode': 'G',
						'ptc': 'ADT',
						'fareConstruction': {
							'segments': [
								{'destination': 'CLT'},
								{'destination': 'LON'},
								{'destination': 'CLT'},
								{'destination': 'TPA'},
							],
							'fare': '257.00',
						},
						'baseFare': {'currency': 'USD', 'amount': '257.00'},
						'taxes': [
							{'taxCode': 'AY', 'amount': '11.20'},
							{'taxCode': 'US', 'amount': '37.20'},
							{'taxCode': 'XA'},
							{'taxCode': 'XF'},
							{'taxCode': 'XY'},
							{'taxCode': 'YC'},
							{'taxCode': 'GB'},
							{'taxCode': 'UB'},
							{'taxCode': 'YR'},
						],
						'netPrice': {'currency': 'USD', 'amount': '735.23'},
					},
				],
			},
		]);

		return list;
	}

	/**
	 * @test
	 * @dataProvider provideTestCases
	 */
	testAction(input, expected) {
		const actual = LinearFareParser.parse(input);
		this.assertSubTree(expected, actual);
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
		];
	}
}

LinearFareParserTest.count = 0;
module.exports = LinearFareParserTest;
