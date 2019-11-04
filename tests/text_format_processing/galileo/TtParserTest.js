
const TtParser = require('../../../src/text_format_processing/galileo/TtParser.js');

const php = require('enko-fundamentals/src/Transpiled/php.js');
class TtParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js')
{
	provideTestCases()  {
		const list = [];

		// with a hidden stop
		list.push([
			php.implode(php.PHP_EOL, [
				' LH  594  SATURDAY     05 MAY 18',
				'---------------------------------------------------------------',
				' BRD TIME    T D/I  OFF TIME    T D/I   FLY/GROUND      EQP   E',
				' FRA 1110A   1  I   ABV  410P      I    6:00/  :45      333   E',
				' ABV  455P      D   PHC  600P      D    1:05            333   E',
				'---------------------------------------------------------------',
				'TOTAL FLYING TIME  FRA - PHC      7:05',
				'TOTAL GROUND TIME  FRA - PHC       :45',
				'TOTAL JOURNEY TIME FRA - PHC      7:50',
				'---------------------------------------------------------------',
				'CLASSES',
				'FRA-ABV J  C  D  Z  P  G  E  N  Y  B  M  U  H  Q  V  W  S  T  ',
				'ABV-PHC J  C  D  Z  P  G  E  N  Y  B  M  U  H  Q  V  W  S  T  ',
				'---------------------------------------------------------------',
				'TRC  TEXT',
				'A    ABVPHC NO BOARDING THIS CITY                               ',
			]),
			{
				'airline': 'LH',
				'flightNumber': '594',
				'dayOfWeek': {'raw': 'SATURDAY'},
				'departureDate': {'parsed': '2018-05-05'},
				'legs': [
					{
						'departureAirport': 'FRA',
						'departureTime': {'raw': '1110A', 'parsed': '11:10'},
						'departureTerminal': '1',
						// domestic/international?
						//'unparsedTokenDi1' => 'I',
						'destinationAirport': 'ABV',
						'destinationTime': {'raw': '410P', 'parsed': '16:10'},
						//'unparsedTokenDi2' => 'I',
						'flightDuration': '6:00',
						'groundDuration': ':45',
						'aircraft': '333',
						//'unparsedTokenE' => 'E',
					},
					{
						'departureAirport': 'ABV',
						'departureTime': {'raw': '455P', 'parsed': '16:55'},
						'departureTerminal': '',
						// domestic/international?
						//'unparsedTokenDi1' => 'D',
						'destinationAirport': 'PHC',
						'destinationTime': {'raw': '600P', 'parsed': '18:00'},
						//'unparsedTokenDi2' => 'D',
						'flightDuration': '1:05',
						'groundDuration': '',
						'aircraft': '333',
						//'unparsedTokenE' => 'E',
					},
				],
				'totals': {
					'totalFlightDuration': '7:05',
					'totalGroundDuration': ':45',
					'totalTravelDuration': '7:50',
				},
				'bookingClassLegs': [
					{
						'departureAirport': 'FRA',
						'destinationAirport': 'ABV',
						'bookingClasses': ['J', 'C', 'D', 'Z', 'P', 'G', 'E', 'N', 'Y', 'B', 'M', 'U', 'H', 'Q', 'V', 'W', 'S', 'T'],
					},
					{
						'departureAirport': 'ABV',
						'destinationAirport': 'PHC',
						'bookingClasses': ['J', 'C', 'D', 'Z', 'P', 'G', 'E', 'N', 'Y', 'B', 'M', 'U', 'H', 'Q', 'V', 'W', 'S', 'T'],
					},
				],
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				' PS  898  THURSDAY     10 MAY 18',
				'---------------------------------------------------------------',
				' BRD TIME    T D/I  OFF TIME    T D/I   FLY/GROUND      EQP   E',
				' KIV  720A      I   KBP  825A      I    1:05            738   E',
				'---------------------------------------------------------------',
				'TOTAL FLYING TIME  KIV - KBP      1:05',
				'---------------------------------------------------------------',
				'CLASSES',
				'KIV-KBP C  D  Z  F  S  E  K  H  L  V  M  Q  N  B  T  G  O     ',
			]),
			{
				'airline': 'PS',
				'flightNumber': '898',
				'legs': [
					{
						'departureAirport': 'KIV',
						'departureTime': {'raw': '720A', 'parsed': '07:20'},
						// domestic/international?
						//'unparsedTokenDi1' => 'I',
						'destinationAirport': 'KBP',
						'destinationTime': {'raw': '825A', 'parsed': '08:25'},
						//'unparsedTokenDi2' => 'I',
						'flightDuration': '1:05',
						'groundDuration': '',
						'aircraft': '738',
						//'unparsedTokenE' => 'E',
					},
				],
				'totals': {
					'totalFlightDuration': '1:05',
				},
				'bookingClassLegs': [
					{
						'departureAirport': 'KIV',
						'destinationAirport': 'KBP',
						'bookingClasses': ['C','D','Z','F','S','E','K','H','L','V','M','Q','N','B','T','G','O'],
					},
				],
			},
		]);

		// with destination day offset
		list.push([
			php.implode(php.PHP_EOL, [
				' LH  595  THURSDAY     17 MAY 18',
				'---------------------------------------------------------------',
				' BRD TIME    T D/I  OFF TIME    T D/I   FLY/GROUND      EQP   E',
				' PHC  755P      D   ABV  905P      D    1:10/ 1:10      333   E',
				' ABV 1015P      I   FRA  525A#  1  I    6:10            333   E',
				'---------------------------------------------------------------',
				'TOTAL FLYING TIME  PHC - FRA      7:20',
				'TOTAL GROUND TIME  PHC - FRA      1:10',
				'TOTAL JOURNEY TIME PHC - FRA      8:30',
				'---------------------------------------------------------------',
				'CLASSES',
				'PHC-ABV J  C  D  Z  P  G  E  N  Y  B  M  U  H  Q  V  W  S  T  ',
				'ABV-FRA J  C  D  Z  P  G  E  N  Y  B  M  U  H  Q  V  W  S  T  ',
				'PHC-FRA J  C  D  Z  P  G  E  N  Y  B  M  U  H  Q  V  W  S  T  ',
				'---------------------------------------------------------------',
				'TRC  TEXT',
				'A    PHCABV NO BOARDING THIS CITY                               ',
			]),
			{
				'airline': 'LH',
				'flightNumber': '595',
				'departureDate': {'raw': '17MAY18','parsed': '2018-05-17'},
				'legs': [
					{
						'departureAirport': 'PHC',
						'departureTime': {'raw': '755P','parsed': '19:55'},
						'departureDayOffset': 0,
						'destinationAirport': 'ABV',
						'destinationTime': {'raw': '905P','parsed': '21:05'},
						'destinationDayOffset': 0,
						'flightDuration': '1:10',
						'groundDuration': '1:10',
						'aircraft': '333',
					},
					{
						'departureAirport': 'ABV',
						'departureTime': {'raw': '1015P','parsed': '22:15'},
						'departureDayOffset': 0,
						'destinationAirport': 'FRA',
						'destinationTime': {'raw': '525A','parsed': '05:25'},
						'destinationDayOffset': 1,
						'flightDuration': '6:10',
						'groundDuration': '',
						'aircraft': '333',
					},
				],
				'totals': {
					'totalFlightDuration': '7:20',
					'totalGroundDuration': '1:10',
					'totalTravelDuration': '8:30',
				},
			},
		]);

		// two legs, two date changes
		// I checked in Sabre, dates are:
		// 27MAR  950P JFK ->
		// 28MAR 1250A -> YVR
		// 28MAR  235A YVR ->
		// 29MAR  720A -> HKG
		// so "*" means "2 days since the first departure"
		list.push([
			php.implode(php.PHP_EOL, [
				' CX  889  TUESDAY      27 MAR 18',
				'---------------------------------------------------------------',
				' BRD TIME    T D/I  OFF TIME    T D/I   FLY/GROUND      EQP   E',
				' JFK  950P   8  I   YVR 1250A#  M  I    6:00/ 1:45      77W   E',
				' YVR  235A#  M  I   HKG  720A*  1  I   13:45            77W   E',
				'---------------------------------------------------------------',
				'TOTAL FLYING TIME  JFK - HKG     19:45',
				'TOTAL GROUND TIME  JFK - HKG      1:45',
				'TOTAL JOURNEY TIME JFK - HKG     21:30',
				'---------------------------------------------------------------',
				'CLASSES',
				'JFK-YVR F  A  J  C  D  I  W  R  E  Y  B  H  K  M  L  V  S  N  ',
				'YVR-HKG F  A  J  C  D  I  W  R  E  Y  B  H  K  M  L  V  S  N  ',
			]),
			{
				'airline': 'CX',
				'flightNumber': '889',
				'departureDate': {'raw': '27MAR18','parsed': '2018-03-27'},
				'legs': [
					{
						'departureAirport': 'JFK',
						'departureTime': {'raw': '950P','parsed': '21:50'},
						'departureDayOffset': 0,
						'destinationAirport': 'YVR',
						'destinationTime': {'raw': '1250A','parsed': '00:50'},
						'destinationDayOffset': 1,
						'flightDuration': '6:00',
						'groundDuration': '1:45',
					},
					{
						'departureAirport': 'YVR',
						'departureTime': {'raw': '235A','parsed': '02:35'},
						'departureDayOffset': 1,
						'destinationAirport': 'HKG',
						'destinationTime': {'raw': '720A','parsed': '07:20'},
						'destinationDayOffset': 2,
						'flightDuration': '13:45',
						'groundDuration': '',
					},
				],
				'totals': {
					'totalFlightDuration': '19:45',
					'totalGroundDuration': '1:45',
					'totalTravelDuration': '21:30',
					'unparsed': [],
				},
			},
		]);

		// with negative day offset
		list.push([
			php.implode(php.PHP_EOL, [
				' UA  200  MONDAY       13 AUG 18',
				'---------------------------------------------------------------',
				' BRD TIME    T D/I  OFF TIME    T D/I   FLY/GROUND      EQP   E',
				' GUM  640A      I   HNL  600P-  M  I    7:20            777   E',
				'---------------------------------------------------------------',
				'TOTAL FLYING TIME  GUM - HNL      7:20',
				'---------------------------------------------------------------',
				'CLASSES',
				'GUM-HNL J  C  D  Z  P  Y  B  M  E  U  H  Q  V  W  S  T  L  K  ',
			]),
			{
				'airline': 'UA',
				'flightNumber': '200',
				'departureDate': {'raw': '13AUG18','parsed': '2018-08-13'},
				'legs': [
					{
						'departureAirport': 'GUM',
						'departureTime': {'raw': '640A','parsed': '06:40'},
						'departureDayOffset': 0,
						'destinationAirport': 'HNL',
						'destinationTime': {'raw': '600P','parsed': '18:00'},
						'destinationDayOffset': -1,
						'flightDuration': '7:20',
						'aircraft': '777',
					},
				],
				'totals': {
					'totalFlightDuration': '7:20',
					'totalGroundDuration': null,
					'totalTravelDuration': null,
					'unparsed': [],
				},
			},
		]);

		// 2 days offset in one flight
		list.push([
			php.implode(php.PHP_EOL, [
				' UA 7315  THURSDAY     13 SEP 18',
				'---------------------------------------------------------------',
				' BRD TIME    T D/I  OFF TIME    T D/I   FLY/GROUND      EQP   E',
				' ORD 1155P   5  I   ICN  400A*  1  I   14:05            77L   E',
				'---------------------------------------------------------------',
				'TOTAL FLYING TIME  ORD - ICN     14:05',
				'---------------------------------------------------------------',
				'CLASSES',
				'ORD-ICN J  C  D  Z  Y  B  M  E  U  H  Q  V  W  S  T  L  K  G  ',
				'---------------------------------------------------------------',
				'@ OPERATED BY ASIANA AIRLINES INC                              ',
				'---------------------------------------------------------------',
				'ORD PASSENGER CHECK-IN WITH ASIANA                             ',
			]),
			{
				'airline': 'UA',
				'flightNumber': '7315',
				'departureDate': {'raw': '13SEP18','parsed': '2018-09-13'},
				'legs': [
					{
						'departureAirport': 'ORD',
						'departureTime': {'raw': '1155P','parsed': '23:55'},
						'departureDayOffset': 0,
						'destinationAirport': 'ICN',
						'destinationTime': {'raw': '400A','parsed': '04:00'},
						'destinationDayOffset': 2,
						'flightDuration': '14:05',
						'aircraft': '77L',
					},
				],
				'totals': {
					'totalFlightDuration': '14:05',
				},
			},
		]);

		return list;
	}

	/**
     * @test
     * @dataProvider provideTestCases
     */
	testParser($input, $expected)  {
		let $actual;

		$actual = TtParser.parse($input);
		this.assertArrayElementsSubset($expected, $actual);
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testParser],
		];
	}
}

module.exports = TtParserTest;
