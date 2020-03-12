
const ItineraryParser = require('../../../../src/text_format_processing/sabre/pnr/ItineraryParser.js');

let php = require('enko-fundamentals/src/Transpiled/php.js');

class ItineraryParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js')
{
	provideTestDumpList()  {
		const list = [];
		list.push([
			php.implode(php.PHP_EOL, [
				' 1 DL 856V 22SEP Q SANJFK*HK6  1139A 815P \/DCDL*GYJAFF \/E      ',
				' 2 DL 474V 22SEP Q JFKVCE*HK6   917P1135A  23SEP F             ',
				'                                               \/DCDL*GYJAFF \/E  ',
				' 3 DL 475X 07OCT F VCEJFK*HK6   120P 450P \/DCDL*GYJAFF \/E      ',
				' 4 DL1576X 07OCT F JFKSAN*HK6   730P1044P \/DCDL*GYJAFF \/E     ',
			]),
			[
				{
					'segmentNumber': 1,
					'airline': 'DL',
					'segmentType': 'AIR',
					'departureTime': {'parsed': '11:39'},
					'destinationTime': {'parsed': '20:15'},
				},
				{
					'segmentNumber': 2,
					'airline': 'DL',
					'segmentType': 'AIR',
					'departureTime': {'parsed': '21:17'},
					'destinationTime': {'parsed': '11:35'},
				},
				{
					'segmentNumber': 3,
					'airline': 'DL',
					'segmentType': 'AIR',
					'departureTime': {'parsed': '13:20'},
					'destinationTime': {'parsed': '16:50'},
				},
				{
					'segmentNumber': 4,
					'airline': 'DL',
					'segmentType': 'AIR',
					'departureTime': {'parsed': '19:30'},
					'destinationTime': {'parsed': '22:44'},
					'eticket': true,
				},
			],
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'1 EL 409L 8SEP 5 SVOCFU SS1  0420  0735          E',
				'2 EL 408L 14SEP 5 CFUDME SS1  0855  1210          E',
			]),
			[
				{
					'segmentNumber': 1,
					'airline': 'EL',
					'flightNumber': '409',
					'bookingClass': 'L',
					'departureDate': {'raw': '8SEP','parsed': '09-08'},
					'departureDayOfWeek': {'raw': '5','parsed': '5'},
					'departureAirport': 'SVO',
					'destinationAirport': 'CFU',
					'marriageBeforeDeparture': false,
					'marriageAfterDestination': false,
					'segmentStatus': 'SS',
					'seatCount': '1',
					'departureTime': {'parsed': '04:20'},
					'destinationTime': {'parsed': '07:35'},
					'operatedBy': '',
					'segmentType': 'AIR',
				},
				{
					'segmentNumber': 2,
					'airline': 'EL',
					'flightNumber': '408',
					'bookingClass': 'L',
					'departureDate': {'raw': '14SEP','parsed': '09-14'},
					'departureDayOfWeek': {'raw': '5','parsed': '5'},
					'departureAirport': 'CFU',
					'destinationAirport': 'DME',
					'marriageBeforeDeparture': false,
					'marriageAfterDestination': false,
					'segmentStatus': 'SS',
					'seatCount': '1',
					'departureTime': {'parsed': '08:55'},
					'destinationTime': {'parsed': '12:10'},
					'operatedBy': '',
					'segmentType': 'AIR',
				},
			],
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'1 UA 1769K 22DEC Q MCOEWR SS1  120P 400P   22DEC F',
				'2 ET 509O 22DEC Q EWRLFW SS1   815P 1130A  23DEC F E',
				'3 KP  24T 23DEC F LFWLOS SS1   130P  330P          E',
				'4 KP  51T 06JAN F LOSLFW SS1  1100A 1100A          E',
				'5 ET 508O 06JAN F LFWEWR SS1   100P  615P          E',
				'6 UA 1149W 6JAN F  EWRMCO SS1  900P  1148P',
			]),
			[
				{
					'segmentNumber': 1,
					'airline': 'UA',
					'flightNumber': '1769',
					'bookingClass': 'K',
					'departureDate': {'raw': '22DEC','parsed': '12-22'},
					'departureDayOfWeek': {'raw': 'Q','parsed': 4},
					'departureAirport': 'MCO',
					'destinationAirport': 'EWR',
					'segmentType': 'AIR',
				},
				{
					'segmentNumber': 2,
					'airline': 'ET',
					'flightNumber': '509',
					'bookingClass': 'O',
					'departureDate': {'raw': '22DEC','parsed': '12-22'},
					'departureDayOfWeek': {'raw': 'Q','parsed': 4},
					'departureAirport': 'EWR',
					'destinationAirport': 'LFW',
					'segmentType': 'AIR',
				},
				{
					'segmentNumber': 3,
					'airline': 'KP',
					'flightNumber': '24',
					'bookingClass': 'T',
					'departureDate': {'raw': '23DEC','parsed': '12-23'},
					'departureDayOfWeek': {'raw': 'F','parsed': 5},
					'departureAirport': 'LFW',
					'destinationAirport': 'LOS',
					'segmentType': 'AIR',
				},
				{
					'segmentNumber': 4,
					'airline': 'KP',
					'flightNumber': '51',
					'bookingClass': 'T',
					'departureDate': {'raw': '06JAN','parsed': '01-06'},
					'departureDayOfWeek': {'raw': 'F','parsed': 5},
					'departureAirport': 'LOS',
					'destinationAirport': 'LFW',
					'segmentType': 'AIR',
				},
				{
					'segmentNumber': 5,
					'airline': 'ET',
					'flightNumber': '508',
					'bookingClass': 'O',
					'departureDate': {'raw': '06JAN','parsed': '01-06'},
					'departureDayOfWeek': {'raw': 'F','parsed': 5},
					'departureAirport': 'LFW',
					'destinationAirport': 'EWR',
					'segmentType': 'AIR',
				},
				{
					'segmentNumber': 6,
					'airline': 'UA',
					'flightNumber': '1149',
					'bookingClass': 'W',
					'departureDate': {'raw': '6JAN','parsed': '01-06'},
					'departureDayOfWeek': {'raw': 'F','parsed': 5},
					'departureAirport': 'EWR',
					'destinationAirport': 'MCO',
					'segmentType': 'AIR',
				},
			],
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				' 1 UA 801K 01DEC Q STLORD HK1  1128A 1249P \/DCUA \/E            ',
				'ADV PAX FLT ARRIVES TERMINAL-1                                  ',
				'ADV PAX FLT DEPARTS TERMINAL-1                                  ',
				' 2 AC5954K 01DEC Q ORDAMS HK1   605P  920A  02DEC F \/DCAC \/E    ',
				'OPERATED BY UNITED AIRLINES                                    ',
				'OPERATED BY\/EXPLOITE PAR   UA                                  ',
				'ONLINE CONNECTING TRAFFIC                                      ',
				' 3 KQ 117H 02DEC F AMSNBO HK1   835P  640A  03DEC J \/DCKQ \/E                           ',
			]),
			{
				'1': {
					'operatedBy': 'UNITED AIRLINES',
					'raw': php.implode(php.PHP_EOL, [
						' 2 AC5954K 01DEC Q ORDAMS HK1   605P  920A  02DEC F \/DCAC \/E    ',
						'OPERATED BY UNITED AIRLINES                                    ',
					]),
				},
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				' 1 AF1169L 09MAY T MANCDG*  3\/1 HK2   745P 1010P \/DCAF*5JV97Q',
				'                                                            \/E',
				' 2 AF 990V 09MAY T CDGJNB*  3\/2 HK2  1125P  955A  10MAY W',
				'                                               \/DCAF*5JV97Q \/E',
				' 3 AF 995V 06JUN T JNBCDG*  4\/1 HK2   650P  540A  07JUN W',
				'                                               \/DCAF*5JV97Q \/E',
				' 4 AF1668L 07JUN W CDGMAN*  4\/2 HK2   720A  750A \/DCAF*5JV97Q',
			]),
			{'0': {'marriage': '3'},'2': {'marriage': '4'}},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				' 1 AA 125I 11APR T DFWHKG HK2  1040A  410P  12APR W SPM HRS',
				'                                               \/DCAA*ENQFIM \/E',
				' 2 AA 126I 17APR M HKGDFW HK2   230P  420P SPM HRS \/DCAA*ENQFIM',
				'                                                            \/E',
				' 3  OTH YY 22FEB Q GK1  LAX',
			]),
			[
				{'confirmationAirline': 'AA','confirmationNumber': 'ENQFIM','eticket': true},
				{'confirmationAirline': 'AA','confirmationNumber': 'ENQFIM'},
			],
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'NO NAMES',
				' 1 PS 898S 10DEC S KIVKBP SS1   710A  820A \/DCPS \/E',
				' 2 PS 185S 10DEC S KBPRIX SS1   920A 1100A \/DCPS \/E',
				' 3  HTL AS 03DEC S NN1  ANC\/OUT5DEC\/KING DRAKE\/DBLB\/MODR\/TA0557',
				'8602\/CF-',
				' 4 BT 303Y 10JAN W RIXHEL SS1  1220P  125P \/DCBT \/E',
				'L3II.L3II*AWS 1142\/11AUG17',
				'',
			]),
			[
				{'segmentNumber': 1,'destinationAirport': 'KBP'},
				{'segmentNumber': 2,'destinationAirport': 'RIX'},
				{
					'segmentNumber': '3',
					'segmentType': 'HOTEL',
					'hotel': 'AS',
					'startDate': {'parsed': '12-03'},
					'segmentStatus': 'NN',
					'roomCount': '1',
					'city': 'ANC',
					'endDate': {'parsed': '12-05'},
					'hotelName': 'KING DRAKE',
					'roomType': {'raw': 'DBLB'},
					'rateCode': 'MODR',
					'agencyIataCode': '05578602',
				},
				{'segmentNumber': 4,'destinationAirport': 'HEL'},
			],
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'1 D81843H 14DEC F SWFDUB SS1 1200N 1125P \/DCD8 \/E',
				'2 EI 680W 15DEC J DUBGVA SS1 630A 940A \/DCEI \/E',
				'3 VY6202J 10JAN Q GVABCN SS1 630P 800P \/DCVY \/E',
				'4 FR6394Y 10JAN Q BCNDUB GK1 915P 1100P',
				'5 D81842Q 11JAN F DUBSWF SS1 810A 1020A \/DCD8 \/E',
			]),
			[
				{'segmentNumber': 1},
				{'segmentNumber': 2},
				{'segmentNumber': 3},
				{'segmentNumber': 4, 'destinationTime': {'raw': '1100P', 'parsed': '23:00'}},
				{'segmentNumber': 5},
			],
		]);
		list.push([
			'OPERATED BY UNITED AIRLINES',
			[],
		]);
		return list;
	}


	/**
     * @test
     * @dataProvider provideTestDumpList
     */
	testParser($dump, $expected)  {
		let $actualResult;
		$actualResult = ItineraryParser.parse($dump);
		this.assertArrayElementsSubset($expected, $actualResult);
	}

	getTestMapping() {
		return [
			[this.provideTestDumpList, this.testParser],
		];
	}
}
module.exports = ItineraryParserTest;
