
const ItineraryParser = require('../../../../src/text_format_processing/apollo/pnr/ItineraryParser.js');
const php  = require('enko-fundamentals/src/Transpiled/php.js');

class ItineraryParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js')
{
	provideTreeTestCases()  {
		const list = [];
		list.push([
			php.implode(php.PHP_EOL, [
				' 1 UA1704S 19DEC LASEWR HK1   605A  157P *         SA   E  1',
				' 2 UA 999S 19DEC EWRBRU HK1   635P  750A|*      SA/SU   E  1',
				' 3 SN2835V 20DEC BRUDME HK1  1015A  345P *         SU   E',
				' 4 UA9741S 07JAN DMEZRH HK1   905A 1050A *         TH   E  4',
				'         OPERATED BY SWISS',
				' 5 UA  53S 07JAN ZRHIAD HK1  1135A  320P *         TH   E  4',
				' 6 UA2030S 07JAN IADLAS HK1   656P  920P *         TH   E  4',
				' 7 OTH ZO BK1  XXX 27SEP-PRESERVEPNR',
				'*** PROFILE ASSOCIATIONS EXIST *** >*PA; ',
				'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
			]),
			{
				'segments': [
					{
						'segmentNumber': 1,
						'airline': 'UA',
						'flightNumber': '1704',
						'bookingClass': 'S',
						'departureDate': {'raw': '19DEC','parsed': '12-19'},
						'departureAirport': 'LAS',
						'destinationAirport': 'EWR',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'raw': '605A','parsed': '06:05'},
						'destinationTime': {'raw': '157P','parsed': '13:57'},
						'dayOffset': 0,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'SA','parsed': '6'},
						'eticket': 'E',
						'marriage': 1,
					},
					{
						'segmentNumber': 2,
						'airline': 'UA',
						'flightNumber': '999',
						'bookingClass': 'S',
						'departureDate': {'raw': '19DEC','parsed': '12-19'},
						'departureAirport': 'EWR',
						'destinationAirport': 'BRU',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'raw': '635P','parsed': '18:35'},
						'destinationTime': {'raw': '750A','parsed': '07:50'},
						'dayOffset': 1,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'SA/SU','parsed': '6/7'},
						'eticket': 'E',
						'marriage': 1,
					},
					{
						'segmentNumber': 3,
						'airline': 'SN',
						'flightNumber': '2835',
						'bookingClass': 'V',
						'departureDate': {'raw': '20DEC','parsed': '12-20'},
						'departureAirport': 'BRU',
						'destinationAirport': 'DME',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'raw': '1015A','parsed': '10:15'},
						'destinationTime': {'raw': '345P','parsed': '15:45'},
						'dayOffset': 0,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'SU','parsed': '7'},
						'eticket': 'E',
						'marriage': 0,
					},
					{
						'segmentNumber': 4,
						'airline': 'UA',
						'flightNumber': '9741',
						'bookingClass': 'S',
						'departureDate': {'raw': '07JAN','parsed': '01-07'},
						'departureAirport': 'DME',
						'destinationAirport': 'ZRH',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'raw': '905A','parsed': '09:05'},
						'destinationTime': {'raw': '1050A','parsed': '10:50'},
						'dayOffset': 0,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'TH','parsed': '4'},
						'eticket': 'E',
						'marriage': 4,
						'operatedBy': 'SWISS',
					},
					{
						'segmentNumber': 5,
						'airline': 'UA',
						'flightNumber': '53',
						'bookingClass': 'S',
						'departureDate': {'raw': '07JAN','parsed': '01-07'},
						'departureAirport': 'ZRH',
						'destinationAirport': 'IAD',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'raw': '1135A','parsed': '11:35'},
						'destinationTime': {'raw': '320P','parsed': '15:20'},
						'dayOffset': 0,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'TH','parsed': '4'},
						'eticket': 'E',
						'marriage': 4,
					},
					{
						'segmentNumber': 6,
						'airline': 'UA',
						'flightNumber': '2030',
						'bookingClass': 'S',
						'departureDate': {'raw': '07JAN','parsed': '01-07'},
						'departureAirport': 'IAD',
						'destinationAirport': 'LAS',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'raw': '656P','parsed': '18:56'},
						'destinationTime': {'raw': '920P','parsed': '21:20'},
						'dayOffset': 0,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'TH','parsed': '4'},
						'eticket': 'E',
						'marriage': 4,
					},
					{'segmentType': 'OTH','segmentNumber': '7','text': 'ZO BK1  XXX 27SEP-PRESERVEPNR'},
				],
				'textLeft': php.implode(php.PHP_EOL, ['*** PROFILE ASSOCIATIONS EXIST *** >*PA; ','FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT']),
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				' 1 UA1966S 19JAN AUSIAH HK1   530A  625A *         TU   E',
				' 2 UA1979S 19JAN IAHEWR HK1   902A  130P *         TU   E',
				' 3 UA 179S 19JAN EWRSGN HK1   345P  125A2*      TU/TH   E',
				' 4 NH 832K 27JAN SGNNRT HK1  1155P  725A|*      WE/TH   E 14',
			]),
			{
				'segments': [
					{
						'segmentNumber': 1,
						'airline': 'UA',
						'flightNumber': '1966',
						'bookingClass': 'S',
						'departureDate': {'parsed': '01-19'},
						'departureAirport': 'AUS',
						'destinationAirport': 'IAH',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'parsed': '05:30'},
						'destinationTime': {'parsed': '06:25'},
						'dayOffset': 0,
						'confirmedByAirline': true,
						'daysOfWeek': {'parsed': '2'},
						'eticket': 'E',
						'marriage': 0,
					},
					{
						'segmentNumber': 2,
						'airline': 'UA',
						'flightNumber': '1979',
						'bookingClass': 'S',
						'departureDate': {'parsed': '01-19'},
						'departureAirport': 'IAH',
						'destinationAirport': 'EWR',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'parsed': '09:02'},
						'destinationTime': {'parsed': '13:30'},
						'dayOffset': 0,
						'confirmedByAirline': true,
						'daysOfWeek': {'parsed': '2'},
						'eticket': 'E',
						'marriage': 0,
					},
					{
						'segmentNumber': 3,
						'airline': 'UA',
						'flightNumber': '179',
						'bookingClass': 'S',
						'departureDate': {'parsed': '01-19'},
						'departureAirport': 'EWR',
						'destinationAirport': 'SGN',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'parsed': '15:45'},
						'destinationTime': {'parsed': '01:25'},
						'dayOffset': 2,
						'confirmedByAirline': true,
						'daysOfWeek': {'parsed': '2/4'},
						'eticket': 'E',
						'marriage': 0,
					},
					{
						'segmentNumber': 4,
						'airline': 'NH',
						'flightNumber': '832',
						'bookingClass': 'K',
						'departureDate': {'parsed': '01-27'},
						'departureAirport': 'SGN',
						'destinationAirport': 'NRT',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'parsed': '23:55'},
						'destinationTime': {'parsed': '07:25'},
						'dayOffset': 1,
						'confirmedByAirline': true,
						'daysOfWeek': {'parsed': '3/4'},
						'eticket': 'E',
						'marriage': 14,
					},
				],
				'textLeft': '',
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'1 ET 915T 6DEC DLAADD SS1   225P  855P *         FR   E  2     4:30  788',
				'2 ET 500T 6DEC ADDIAD SS1  1050P  815A+*      FR/SA   E  2    17:25  77L',
				'3 UA5806K 7DEC IADOKC SS1   530P  726P *         SA   E        2:56  CR7',
				'        OPERATED BY SKYWEST DBA UNITED EXPRESS',
			]),
			{
				'segments': [
					{
						'segmentNumber': 1,
						'airline': 'ET',
						'departureDate': {'raw': '6DEC'},
						'segmentType': 'AIR',
					},
					{
						'segmentNumber': 2,
						'airline': 'ET',
						'departureDate': {'raw': '6DEC'},
						'segmentType': 'AIR',
					},
					{
						'segmentNumber': 3,
						'airline': 'UA',
						'departureDate': {'raw': '7DEC'},
						'segmentType': 'AIR',
						'operatedBy': 'SKYWEST DBA UNITED EXPRESS',
					},
				],
				'textLeft': '',
			},
		]);

		// Spaces around cabin class, no day of week
		list.push([
			php.implode(php.PHP_EOL, [
				' 1 BA  64 Q28JUN NBOLHR HK1  1120P  615A |*  ',
				' 2 BA 239 Q01JUL LHRBOS HK1   755P 1010P  *',
				' 3 BA 212 Q17MAY BOSLHR HK1   720P  650A |*  ',
				' 4 BA  65 Q18MAY LHRNBO HK1  1015A  855P  *',
			]),
			{
				'segments': [
					{
						'segmentNumber': 1,
						'airline': 'BA',
						'flightNumber': '64',
						'bookingClass': 'Q',
						'departureDate': {'raw': '28JUN','parsed': '06-28'},
						'departureAirport': 'NBO',
						'destinationAirport': 'LHR',
						'segmentType': 'AIR',
					},
					{
						'segmentNumber': 2,
						'airline': 'BA',
						'flightNumber': '239',
						'bookingClass': 'Q',
						'departureDate': {'raw': '01JUL','parsed': '07-01'},
						'departureAirport': 'LHR',
						'destinationAirport': 'BOS',
						'segmentType': 'AIR',
					},
					{
						'segmentNumber': 3,
						'airline': 'BA',
						'flightNumber': '212',
						'bookingClass': 'Q',
						'departureDate': {'raw': '17MAY','parsed': '05-17'},
						'departureAirport': 'BOS',
						'destinationAirport': 'LHR',
						'segmentType': 'AIR',
					},
					{
						'segmentNumber': 4,
						'airline': 'BA',
						'flightNumber': '65',
						'bookingClass': 'Q',
						'departureDate': {'raw': '18MAY','parsed': '05-18'},
						'departureAirport': 'LHR',
						'destinationAirport': 'NBO',
						'segmentType': 'AIR',
					},
				],
			},
		]);

		// *RTZ2TA - with 'ARNK' segment
		list.push([
			php.implode(php.PHP_EOL, [
				' 2 MU 211B 28OCT PVGMNL UN1  1230A  340A *         FR   E',
				' 3 MU 211B 28OCT PVGMNL HL1  1230A  340A           FR',
				' 4   ARNK',
				' 5 MU 212B 07FEB MNLPVG HK1   455A  755A *         TU   E',
				' 6 MU 583Q 07FEB PVGLAX HK1   100P  905A *         TU   E',
				' 7 OTH ZO BK1  XXX 03AUG-PRESERVEPNR',
			]),
			{
				'segments': {
					'0': {'segmentNumber': 2,'destinationAirport': 'MNL'},
					'2': {'segmentNumber': '4','segmentType': 'ARNK'},
					'3': {'segmentNumber': 5,'destinationAirport': 'PVG'},
				},
			},
		]);

		// with car segments
		list.push([
			php.implode(php.PHP_EOL, [
				' 1 CCR ZE KK1 QRL 23FEB-25FEB MCMR/RG-EUR39.42DY-UNL 39.42XH/BS-05578602/PUP-QRLC60/ARR-1337/RC-AEXXMC/DT-0800/NM-PUGACOVS GENADIJS/CF-H1282505939 OSI ',
				' 2 ET 501S 23FEB IADADD GK1  1030A  740A|       TH/FR',
				' 3 CCR ZE HK1 MOD 11JAN-13JAN CCAR/RG-USD31.00DY-UNL MI XH 10.54/BS-05578602/PUP-MODC02/ARR-1354/RC-OAUD1/DT-0800/NM-PUGACOVS GENADIJS/CF-H1280118360 *',
			]),
			{
				'segments': [
					{
						'segmentNumber': '1',
						'vendorCode': 'ZE',
						'segmentStatus': 'KK',
						'seatCount': 1,
						'airport': 'QRL',
						'arrivalDate': {'raw': '23FEB','parsed': '02-23'},
						'returnDate': {'raw': '25FEB','parsed': '02-25'},
						'acrissCode': 'MCMR',
						'segmentType': 'CAR',
					},
					{
						'segmentNumber': 2,
						'airline': 'ET',
						'flightNumber': '501',
						'bookingClass': 'S',
						'departureDate': {'raw': '23FEB','parsed': '02-23'},
						'departureAirport': 'IAD',
						'destinationAirport': 'ADD',
						'segmentStatus': 'GK',
						'seatCount': 1,
						'departureTime': {'raw': '1030A','parsed': '10:30'},
						'destinationTime': {'raw': '740A','parsed': '07:40'},
						'dayOffset': 1,
						'confirmedByAirline': false,
						'daysOfWeek': {'raw': 'TH/FR','parsed': '4/5'},
						'eticket': '',
						'marriage': 0,
						'unexpectedText': '',
						'segmentType': 'AIR',
					},
					{
						'segmentNumber': '3',
						'vendorCode': 'ZE',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'airport': 'MOD',
						'arrivalDate': {'raw': '11JAN','parsed': '01-11'},
						'returnDate': {'raw': '13JAN','parsed': '01-13'},
						'acrissCode': 'CCAR',
						'segmentType': 'CAR',
					},
				],
				'textLeft': '',
			},
		]);

		// segments without flight number
		list.push([
			php.implode(php.PHP_EOL, [
				' 1 DL1234Y 15DEC EWRLHR GK1                        TH',
				' 2 DL1234Y 16DEC LHRTYO GK1                        FR',
				' 3 DL1234Y 25DEC TYOLHR GK1                        SU',
				' 4 DL1234Y 26DEC LHREWR GK1                        MO',
			]),
			{
				'segments': [
					{
						'segmentType': 'FAKE',
						'segmentNumber': 1,
						'airline': 'DL',
						'flightNumber': '1234',
						'bookingClass': 'Y',
						'departureDate': {'parsed': '12-15'},
						'departureAirport': 'EWR',
						'destinationAirport': 'LHR',
						'segmentStatus': 'GK',
						'seatCount': 1,
						'daysOfWeek': {'parsed': '4'},
					},
					{
						'segmentType': 'FAKE',
						'segmentNumber': 2,
						'airline': 'DL',
						'flightNumber': '1234',
						'bookingClass': 'Y',
						'departureDate': {'parsed': '12-16'},
						'departureAirport': 'LHR',
						'destinationAirport': 'TYO',
						'segmentStatus': 'GK',
						'seatCount': 1,
						'daysOfWeek': {'parsed': '5'},
					},
					{
						'segmentType': 'FAKE',
						'segmentNumber': 3,
						'airline': 'DL',
						'flightNumber': '1234',
						'bookingClass': 'Y',
						'departureDate': {'parsed': '12-25'},
						'departureAirport': 'TYO',
						'destinationAirport': 'LHR',
						'segmentStatus': 'GK',
						'seatCount': 1,
						'daysOfWeek': {'parsed': '7'},
					},
					{
						'segmentType': 'FAKE',
						'segmentNumber': 4,
						'airline': 'DL',
						'flightNumber': '1234',
						'bookingClass': 'Y',
						'departureDate': {'parsed': '12-26'},
						'departureAirport': 'LHR',
						'destinationAirport': 'EWR',
						'segmentStatus': 'GK',
						'seatCount': 1,
						'daysOfWeek': {'parsed': '1'},
					},
				],
			},
		]);

		// >*WPDH1E; - with multiple OPERATED BY in one segment due to hidden stop
		list.push([
			php.implode(php.PHP_EOL, [
				' 1 DL4508X 10JAN BOISEA HK1  1038A 1120A *         TU   E  1',
				'         OPERATED BY SKYWEST DBA DELTA CONNECTION',
				' 2 DL 142X 10JAN SEAAMS HK1   125P  830A|*      TU/WE   E  1',
				' 3 DL9318X 11JAN AMSKGL HK1   955A  720P *         WE   E  1',
				'         OPERATED BY KLM ROYAL DUTCH AIRL',
				' 4 DL9318X 17FEB KGLAMS HK1   825P  600A|*      FR/SA   E  4',
				'         OPERATED BY KLM ROYAL DUTCH AIRL  KGL-EBB',
				'         OPERATED BY KLM ROYAL DUTCH AIRL  EBB-AMS',
				' 5 DL 143X 18FEB AMSSEA HK1  1000A 1124A *         SA   E  4',
				' 6 DL4599X 18FEB SEABOI HK1   310P  535P *         SA   E  4',
				'         OPERATED BY SKYWEST DBA DELTA CONNECTION',
				' 7 OTH ZO BK1  XXX 04SEP-PRESERVEPNR',
			]),
			{
				'segments': {
					'0': {'segmentNumber': 1,'operatedBy': 'SKYWEST DBA DELTA CONNECTION'},
					'3': {
						'segmentNumber': 4,
						'operatedBy': 'KLM ROYAL DUTCH AIRL',
						'raw': php.implode(php.PHP_EOL, [
							' 4 DL9318X 17FEB KGLAMS HK1   825P  600A|*      FR/SA   E  4',
							'         OPERATED BY KLM ROYAL DUTCH AIRL  KGL-EBB',
							'         OPERATED BY KLM ROYAL DUTCH AIRL  EBB-AMS',
						]),
					},
				},
			},
		]);

		// >*N0FT3X; directly from apollo, without wrapping
		list.push([
			php.implode(php.PHP_EOL, [
				' 1 UA1158K 29MAY LAXHNL HK4   845A 1140A *         MO   E',
				' 2 UA 201K 29MAY HNLGUM HK4   215P  555P|       MO/TU',
				' 3 UA 183K 30MAY GUMMNL HK4   700P  850P           TU',
				' 4 UA 192K 27JUN MNLGUM HK4   945P  540A|       TU/WE',
				'         OPERATED BY UNITED AIRLINES FOR AIR MICRONESIA  MNL-ROR         OPERATED BY UNITED AIRLINES FOR AIR MICRONESIA  ROR-GUM 5 UA 196K 28JUN GUMNRT HK4  1200N  255P *         WE   E  1',
				' 6 UA  33K 28JUN NRTLAX HK4   505P 1115A *         WE   E  1',
			]),
			{
				'segments': {
					'3': {
						'segmentNumber': 4,
						'departureAirport': 'MNL',
						'destinationAirport': 'GUM',
					},
					'4': {'segmentNumber': 5,'departureAirport': 'GUM','destinationAirport': 'NRT'},
					'5': {'segmentNumber': 6,'departureAirport': 'NRT','destinationAirport': 'LAX'},
				},
			},
		]);

		// >*MQ4FZG; with hotel segment
		list.push([
			php.implode(php.PHP_EOL, [
				' 1 DL2050V 31MAY PHXSLC HK1  1047A  125P *         WE   E  1',
				' 2 DL  56V 31MAY SLCAMS HK1   236P  840A|*      WE/TH   E  1',
				' 3 AF1807V 01JUN AMSMRS HK1   940A 1130A *         TH   E',
				' 4 HHL NN HK1 MRS 01JUN-04JUN  3NT 17560  CAMPANILE MARSEILLE   1C1DRAC -1/RG-EUR69.00/AGT10741570/G-DPSTAXXXXXXXXXXXX8476EXP0722/NM-FOX KARINE V/CF-2345678993 *',
				' 5 DL8643V 10JUN MRSCDG HK1   710A  840A *         SA   E  2',
				'         OPERATED BY AIR FRANCE',
				' 6 DL 141V 10JUN CDGMSP HK1  1030A 1225P *         SA   E  2',
				' 7 DL 899V 10JUN MSPPHX HK1   222P  341P *         SA   E  2',
			]),
			{
				'segments': {
					'3': {
						'segmentNumber': '4',
						'segmentType': 'HOTEL',
						'hotel': 'NN',
						'segmentStatus': 'HK',
						'roomCount': 1,
						'city': 'MRS',
						'startDate': {'parsed': '06-01'},
						'endDate': {'parsed': '06-04'},
						'fareBasis': 'C1DRAC',
					},
					'4': {'segmentNumber': 5,'segmentType': 'AIR'},
				},
			},
		]);

		// another hotel example
		list.push([
			php.implode(php.PHP_EOL, [
				' 1 PS9401Y 10JUN KBPRIX SS1   940A 1135A *         SA   E',
				'         OPERATED BY AIR BALTIC CORPORATION S',
				' 2 HHL LW SS1 RIX 10JUN-11JUN  1NT 28550  GRAND PALACE HOTEL    1L050ZZZ-1/RG-EUR240.00/AGT05578602/G-VI4111111111111111EXP0819/NM-LIBERMANE MARINA/CF-109485440 *',
			]),
			{
				'segments': [
					{'segmentNumber': 1},
					{
						'segmentNumber': '2',
						'segmentType': 'HOTEL',
						'hotel': 'LW',
						'segmentStatus': 'SS',
						'roomCount': 1,
						'city': 'RIX',
						'startDate': {'parsed': '06-10'},
						'endDate': {'parsed': '06-11'},
						'personCount': '1',
					},
				],
			},
		]);

		// Car segment example
		list.push([
			php.implode(php.PHP_EOL, [
				' 1 CCR ZD HK1 REK 18JUN-19JUN MDMN/RG-USD109.00DY-UNL FM/BS-05578602/PUP-REKC03/ARR-1200/RC-YEI/DT-1200/NM-NANAN JELENA/CF-06232332US1 *',
			]),
			{
				'segments': [
					{
						'segmentNumber': '1',
						'vendorCode': 'ZD',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'airport': 'REK',
						'arrivalDate': {'raw': '18JUN','parsed': '06-18'},
						'returnDate': {'raw': '19JUN','parsed': '06-19'},
						'acrissCode': 'MDMN',
						'confirmationNumber': '06232332US1',
						'rateGuarantee': {'currency': 'USD','amount': '109.00'},
						'segmentType': 'CAR',
					},
				],
				'textLeft': '',
			},
		]);

		// Car segment from *I (preprocessed); has approximate total
		list.push([
			php.implode(php.PHP_EOL, [
				' 1 CCR ZD SS1 REK 18JUN-21JUN MDMN/RG-USD79.00DY-UNL FM/BS-05578602/PUP-REKC03/ARR-1200/RC-YEI/DT-1200/NM-NANAN JELENA/CF-06239599US2 */APPROXIMATE TOTAL RATE-USD237.00-UNL FM 03DY 00HR .00MC',
			]),
			{
				'segments': [
					{
						'segmentNumber': '1',
						'vendorCode': 'ZD',
						'segmentStatus': 'SS',
						'seatCount': 1,
						'airport': 'REK',
						'arrivalDate': {'raw': '18JUN','parsed': '06-18'},
						'returnDate': {'raw': '21JUN','parsed': '06-21'},
						'acrissCode': 'MDMN',
						'confirmationNumber': '06239599US2',
						'rateGuarantee': {'currency': 'USD','amount': '79.00'},
						'approxTotal': {'currency': 'USD','amount': '237.00'},
						'segmentType': 'CAR',
					},
				],
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				' 1 QR5297Y 30OCT MSPLHR SS1   404P 1135A|*      MO/TU   E  3',
				'         OPERATED BY AMERICAN AIRLINES  MSP-ORD',
				'         OPERATED BY AMERICAN AIRLINES  ORD-LHR',
				'         OPERATED BY AMERICAN AIRLINES  MSP-ORD',
				'         OPERATED BY AMERICAN AIRLINES  ORD-LHR',
				'          PLANE CHANGE MSP-ORD M80                ',
				'                       ORD-LHR 788                 ',
				' 2 QR   4Y 31OCT LHRDOH SS1   215P 1159P *         TU   E  3',
				' 3 QR 970Y 01NOV DOHPNH SS1   220A  325P *         WE   E  3',
				' 4 QR 971L 24NOV PNHDOH SS1   455P 1150P *         FR   E  2',
				' 5 QR 725L 25NOV DOHORD SS1   820A  205P *         SA   E  2',
				' 6 QR5365L 25NOV ORDMSP SS1   505P  634P *         SA   E  2',
				'         OPERATED BY AMERICAN AIRLINES',
			]),
			{
				'segments': [
					{
						'segmentNumber': 1,
						'airline': 'QR',
						'flightNumber': '5297',
						'bookingClass': 'Y',
						'departureDate': {'raw': '30OCT','parsed': '10-30'},
						'departureAirport': 'MSP',
						'destinationAirport': 'LHR',
						'segmentStatus': 'SS',
						'seatCount': 1,
						'departureTime': {'raw': '404P','parsed': '16:04'},
						'destinationTime': {'raw': '1135A','parsed': '11:35'},
						'raw': php.implode(php.PHP_EOL, [
							' 1 QR5297Y 30OCT MSPLHR SS1   404P 1135A|*      MO/TU   E  3',
							'         OPERATED BY AMERICAN AIRLINES  MSP-ORD',
							'         OPERATED BY AMERICAN AIRLINES  ORD-LHR',
							'         OPERATED BY AMERICAN AIRLINES  MSP-ORD',
							'         OPERATED BY AMERICAN AIRLINES  ORD-LHR',
							'          PLANE CHANGE MSP-ORD M80                ',
							'                       ORD-LHR 788                 ',
						]),
					},
					{'segmentNumber': 2, 'departureAirport': 'LHR', 'destinationAirport': 'DOH'},
					{'segmentNumber': 3, 'departureAirport': 'DOH', 'destinationAirport': 'PNH'},
					{'segmentNumber': 4, 'departureAirport': 'PNH', 'destinationAirport': 'DOH'},
					{'segmentNumber': 5, 'departureAirport': 'DOH', 'destinationAirport': 'ORD'},
					{'segmentNumber': 6, 'departureAirport': 'ORD', 'destinationAirport': 'MSP'},
				],
				'textLeft': '',
			},
		]);

		// artificial dump that would cause infinite loop
		list.push([
			php.implode(php.PHP_EOL, [
				' 1 QR5297Y 30OCT MSPLHR SS1   404P 1135A|*      MO/TU   E  3',
				'         PLANE CHANGE CAN TAKE PLACE - ASK CARRIER ',
			]),
			{
				'segments': [
					{'departureAirport': 'MSP', 'destinationAirport': 'LHR'},
				],
			},
		]);

		// CMS flight duration artifacts should not get parsed as marriage number
		list.push([
			php.implode(php.PHP_EOL, [
				'1 UA1158K 09DEC LAXHNL SS1   830A 1223P *         MO   E  1      5:53  777       ',
				'2 UA 201K 09DEC HNLGUM SS1   315P  705P+*      MO/TU   E  1      7:50  777       ',
				'3 UA 183K 10DEC GUMMNL SS1   750P  940P *         TU   E  1      3:50  738       ',
				'4 NH 820K 03FEB MNLNRT SS1   945A  300P *         MO   E         4:15  788       ',
				'5 UA7928K 03FEB NRTLAX SS1   400P  840A *         MO   E         9:40  77W',
			]),
			{
				segments: [
					{destinationAirport: 'HNL', marriage: 1},
					{destinationAirport: 'GUM', marriage: 1},
					{destinationAirport: 'MNL', marriage: 1},
					{destinationAirport: 'NRT', marriage: 0},
					{destinationAirport: 'LAX', marriage: 0},
				],
			},
		]);

		// digits in place of booking class - should not get parsed
		list.push([
			[
				' 4 DL35424 30DEC ATLABY SS1   141P  235P *         MO   E  2',
				'         OPERATED BY SKYWEST DBA DELTA CONNECTION',
			].join('\n'),
			{
				segments: [],
				textLeft: [
					' 4 DL35424 30DEC ATLABY SS1   141P  235P *         MO   E  2',
					'         OPERATED BY SKYWEST DBA DELTA CONNECTION',
				].join('\n'),
			},
		]);

		// 5 digits in flight number - should not get parsed
		list.push([
			[
				'5 AC19175M 05JAN LISYYZ SS1  1255P  415P *         SU   E      ',
				'       OPERATED BY AIR CANADA ROUGE',
			].join('\n'),
			{
				segments: [],
				textLeft: [
					'5 AC19175M 05JAN LISYYZ SS1  1255P  415P *         SU   E      ',
					'       OPERATED BY AIR CANADA ROUGE',
				].join('\n'),
			},
		]);

		return list;
	}

	testParser($dump, $expected)  {
		let $actual;
		$actual = ItineraryParser.parse($dump);
		this.assertSubTree($expected, $actual);
	}

	getTestMapping() {
		return [
			[this.provideTreeTestCases, this.testParser],
		];
	}
}

module.exports = ItineraryParserTest;
