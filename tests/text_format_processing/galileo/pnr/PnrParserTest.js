
const php = require('enko-fundamentals/src/Transpiled/php.js');
const PnrParser = require('../../../../src/text_format_processing/galileo/pnr/PnrParser.js');

class PnrParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js') {
	provideTestCases() {
		const list = [];

		// segments with various day offsets:
		// * -> +2
		// # -> +1
		// - -> -1
		list.push([
			php.implode(php.PHP_EOL, [
				' 1. UA 7315 E  13SEP ORDICN HS1  1155P * 400A O          TH',
				'         OPERATED BY ASIANA AIRLINES INC',
				' 2. LH  595 L  17MAY PHCFRA HS1   755P # 525A O          TH',
				' 3. CX  889 N  27MAR JFKHKG HS1   950P * 720A O          TU',
				' 4. UA  200 S  13AUG GUMHNL HS1   640A - 600P O          MO',
			]),
			{
				'itineraryData': [
					{
						'segmentNumber': 1,
						'departureAirport': 'ORD',
						'destinationAirport': 'ICN',
						'departureTime': {'raw': '1155P', 'parsed': '23:55'},
						'destinationTime': {'raw': '400A', 'parsed': '04:00'},
						'dayOffset': +2,
					},
					{
						'segmentNumber': 2,
						'departureAirport': 'PHC',
						'destinationAirport': 'FRA',
						'departureTime': {'raw': '755P', 'parsed': '19:55'},
						'destinationTime': {'raw': '525A', 'parsed': '05:25'},
						'dayOffset': +1,
					},
					{
						'segmentNumber': 3,
						'departureAirport': 'JFK',
						'destinationAirport': 'HKG',
						'departureTime': {'raw': '950P', 'parsed': '21:50'},
						'destinationTime': {'raw': '720A', 'parsed': '07:20'},
						'dayOffset': +2,
					},
					{
						'segmentNumber': 4,
						'departureAirport': 'GUM',
						'destinationAirport': 'HNL',
						'departureTime': {'raw': '640A', 'parsed': '06:40'},
						'destinationTime': {'raw': '600P', 'parsed': '18:00'},
						'dayOffset': -1,
					},
				],
			},
		]);

		// first example I found
		list.push([
			php.implode(php.PHP_EOL, [
				'WC6FVO/WS QSBIV VTL9WS  AG 99999992 08MAR',
				'  1.1VELIKOV/IGOR',
				' 1. ET  509 M  20MAR EWRADD HK1   915P # 935P O*         TU  1',
				' 2. ET  921 M  22MAR ADDACC HK1   840A  1120A O*         TH  1',
				' 3. SA  209 M  15APR ACCIAD HK1  1135P # 625A O*         SU',
				' 4. SA 7416 Y  16APR IADLAX HK1   833A  1112A O*         MO',
				'         OPERATED BY UNITED AIRLINES INC',
				'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
				'** SERVICE INFORMATION EXISTS **       >*SI;',
				'FONE-SFOR:8775586621',
				'TKTG-TAU/TU20MAR',
			]),
			{
				'headerData': {
					'reservationInfo': {
						'recordLocator': 'WC6FVO',
						'focalPointInitials': 'WS',
						'agencyId': 'QSBIV',
						'pnrCreatorToken': 'VTL9WS',
						'arcNumber': '99999992',
						'reservationDate': {'raw': '08MAR', 'parsed': '03-08'},
					},
				},
				'passengers': {
					'passengerList': [
						{
							'firstName': 'IGOR',
							'lastName': 'VELIKOV',
							'nameNumber': {
								'raw': '1.1',
								'absolute': 1,
								'fieldNumber': '1',
								'firstNameNumber': 1,
								'isInfant': false,
							},
						},
					],
				},
				'itineraryData': [
					{
						'segmentNumber': 1,
						'airline': 'ET',
						'flightNumber': '509',
						'bookingClass': 'M',
						'departureDate': {'raw': '20MAR', 'parsed': '03-20'},
						'departureAirport': 'EWR',
						'destinationAirport': 'ADD',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'raw': '915P', 'parsed': '21:15'},
						'destinationTime': {'raw': '935P', 'parsed': '21:35'},
						'dayOffset': 1,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'TU', 'parsed': '2'},
						'marriage': '1',
						'raw': ' 1. ET  509 M  20MAR EWRADD HK1   915P # 935P O*         TU  1',
						'segmentType': 'AIR',
					},
					{
						'segmentNumber': 2,
						'airline': 'ET',
						'flightNumber': '921',
						'bookingClass': 'M',
						'departureDate': {'raw': '22MAR', 'parsed': '03-22'},
						'departureAirport': 'ADD',
						'destinationAirport': 'ACC',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'raw': '840A', 'parsed': '08:40'},
						'destinationTime': {'raw': '1120A', 'parsed': '11:20'},
						'dayOffset': 0,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'TH', 'parsed': '4'},
						'marriage': '1',
						'raw': ' 2. ET  921 M  22MAR ADDACC HK1   840A  1120A O*         TH  1',
						'segmentType': 'AIR',
					},
					{
						'segmentNumber': 3,
						'airline': 'SA',
						'flightNumber': '209',
						'bookingClass': 'M',
						'departureDate': {'raw': '15APR', 'parsed': '04-15'},
						'departureAirport': 'ACC',
						'destinationAirport': 'IAD',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'raw': '1135P', 'parsed': '23:35'},
						'destinationTime': {'raw': '625A', 'parsed': '06:25'},
						'dayOffset': 1,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'SU', 'parsed': '7'},
						'marriage': '',
						'raw': ' 3. SA  209 M  15APR ACCIAD HK1  1135P # 625A O*         SU',
						'segmentType': 'AIR',
					},
					{
						'segmentNumber': 4,
						'airline': 'SA',
						'flightNumber': '7416',
						'bookingClass': 'Y',
						'departureDate': {'raw': '16APR', 'parsed': '04-16'},
						'departureAirport': 'IAD',
						'destinationAirport': 'LAX',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'raw': '833A', 'parsed': '08:33'},
						'destinationTime': {'raw': '1112A', 'parsed': '11:12'},
						'dayOffset': 0,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'MO', 'parsed': '1'},
						'marriage': '',
						'raw': php.implode(php.PHP_EOL, [
							' 4. SA 7416 Y  16APR IADLAX HK1   833A  1112A O*         MO',
							'         OPERATED BY UNITED AIRLINES INC',
						]),
						'segmentType': 'AIR',
						'operatedBy': 'UNITED AIRLINES INC',
					},
				],
				'tktgData': {
					'tauDayOfWeek': {'raw': 'TU', 'parsed': 2},
					'tauDate': {'raw': '20MAR', 'parsed': '03-20'},
				},
				'dataExistsInfo': {
					'vlocDataExists': true,
					'serviceInformationExists': true,
				},
			},
		]);

		// >*ALL; with 3 divided bookings
		list.push([
			php.implode(php.PHP_EOL, [
				'7LZL24/WS QSBIV VTL9WS  AG 99999992 19MAR',
				'  1.1LIBERMANE/MARINA',
				' 1. PS  898 D  10MAY KIVKBP HK1   720A   825A O*         TH  2',
				' 2. PS  185 D  10MAY KBPRIX HK1   920A  1055A O*         TH  2',
				'FONE-PIXR',
				'TKTG-TAU/WE04APR',
				'NOTE-',
				'  1. GD-PRINCE/1588/FOR STANISLAW/2838/LEAD-1 IN 711M WS 19MAR 1     242Z',
				'  2. DEV TESTING PLS IGNORE WS 19MAR 1242Z',
				'  3. -S*SPLIT PTY/19MAR/WSAG/QSB/7M35TI WS 19MAR 1245Z',
				'  4. -S*SPLIT PTY/19MAR/WSAG/QSB/7NCNS6 WS 19MAR 1249Z',
				'  5. -S*SPLIT PTY/19MAR/WSAG/QSB/7NDC84 WS 19MAR 1250Z',
				'VLOC-1A*SL3ZAO/19MAR 1243',
				'VENDOR REMARKS',
				'VRMK-VI/APS *ADTK1GTOPS BY 29MAR 0900 OTHERWISE WILL BE XLD 1243Z 19MAR',
				'  2. VI/APS *ADTK1GTOPS BY 29MAR 0900 OTHERWISE WILL BE XLD 1248Z 19MAR',
				'  3. VI/APS *ADTK1GTOPS BY 29MAR 0900 OTHERWISE WILL BE XLD 1249Z 19MAR',
				'  4. VI/APS *ADTK1GTOPS BY 29MAR 0900 OTHERWISE WILL BE XLD 1250Z 19MAR',
				'** DIVIDED BOOKING DATA **',
				'** DIVIDED BOOKINGS     **',
				'PROKOPCHUK/ALENA   >*7M35TI;',
				'LIBERMANE/ZIMICH   >*7NCNS6;',
				'LIBERMANE/LEPIN    >*7NDC84;',
			]),
			{
				'dividedBookingData': {
					'recordType': 'DIVIDED_BOOKING',
					'records': [
						{'passengerName': 'PROKOPCHUK/ALENA', 'recordLocator': '7M35TI'},
						{'passengerName': 'LIBERMANE/ZIMICH', 'recordLocator': '7NCNS6'},
						{'passengerName': 'LIBERMANE/LEPIN', 'recordLocator': '7NDC84'},
					],
				},
			},
		]);

		// with a child passenger
		// itinerary with a negative day offset "-"
		// with remarks
		list.push([
			php.implode(php.PHP_EOL, [
				'WJJ3R2/WS QSBIV VTL9WS  AG 99999992 08MAR',
				'  1.1STEPANOVA/LIUDMILAIVANOVA*C06',
				' 1. UA  200 M  24SEP GUMHNL HK1   640A - 610P O*         MO',
				' 2. DL 1212 M  23SEP HNLLAX HK1   945P # 612A O*         SU',
				' 3. DL 2522 M  10OCT SNASLC HK1   125P   411P O*         WE',
				' 4. AF 3607 M  10OCT SLCCDG HK1   457P #1115A O*         WE',
				'         OPERATED BY DELTA AIR LINES',
				'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
				'** VENDOR REMARKS DATA EXISTS **       >*VR;',
				'** DIVIDED BOOKINGS EXIST **           >*DV;',
				'FONE-SFOR:8775591134',
				'TKTG-TAU/SA10MAR',
				'NOTE-',
				'  1. -S*SPLIT PTY/08MAR/WSAG/QSB/W5SK20 WS 08MAR 1351Z',
			]),
			{
				'headerData': {
					'reservationInfo': {
						'recordLocator': 'WJJ3R2',
					},
				},
				'passengers': {
					'passengerList': [
						{'lastName': 'STEPANOVA', 'firstName': 'LIUDMILAIVANOVA', 'ptc': 'C06'},
					],
				},
				'itineraryData': [
					{'segmentNumber': 1, 'dayOffset': -1},
					{'segmentNumber': 2, 'dayOffset': 1},
					{'segmentNumber': 3, 'dayOffset': 0},
					{'segmentNumber': 4, 'dayOffset': 1},
				],
				'remarks': [
					{
						'lineNumber': '1',
						'remarkType': 'UNKNOWN',
						'data': '-S*SPLIT PTY/08MAR/WSAG/QSB/W5SK20 WS 08MAR 1351Z',
					},
				],
			},
		]);

		// >*W4W9FE|*ALL;
		list.push([
			php.implode(php.PHP_EOL, [
				'W4W9FE/WS QSBIV VTL9WS  AG 99999992 08MAR',
				'  1.1SMITH/MARGARETH   2.I/1SMITH/KATHY*23APR17',
				'  3.1SMITH/JOHN*P-C07   4.1SMITH/MICHALE*INS',
				' 1. DL  890 M  20SEP RDUDTW HK3   930A  1117A O*         TH  1',
				' 2. DL  275 M  20SEP DTWNRT HK3  1205P # 200P O*         TH  1',
				' 3. DL  181 M  21SEP NRTMNL HK3   400P   755P O*         FR  1',
				' 4. DL  180 M  28SEP MNLNRT HK3   810A   150P O*         FR  3',
				' 5. DL  276 M  28SEP NRTDTW HK3   340P   220P O*         FR  3',
				' 6. DL  916 M  28SEP DTWRDU HK3   330P   516P O*         FR  3',
				'FONE-SFOR:8775581123',
				'  2. SFOE*JOHN//SMITH.COM',
				'DLVR-JANE PASCOE*2 KNUTWICK CLOSE*HAVANT HANT*P/P014 8AD',
				'ADRS-JANE PASCOE*2 KNUTWICK CLOSE*HAVANT HANT*P/P014 8AD',
				'TKTG-TAU/FR09MAR',
				'NOTE-',
				'  1. FREE TEXT WS 08MAR 1344Z',
				'  2. *V*FREETEXTFORVQUALIFIED NOTEPAD WS 08MAR 1344Z',
				'  3. *H*FREE TEXT HISTORY NOTEPAD WS 08MAR 1344Z',
				'  4. *C*CONFIDENTIAL FREE TEXT WS 08MAR 1345Z',
				'VLOC-DL*GKUUZK/08MAR 1349',
				'** SPECIAL SERVICE REQUIREMENT **',
				'SEGMENT/PASSENGER RELATED',
				'S 1. DL  0890 M  20SEP RDUDTW',
				'    P 1. SMITH/MARGARETH  VGML PN 1',
				'    P 2. SMITH/MARGARETH  INFT KK 1  SMITH/KATHY 23APR17',
				'                          LANG PN 1  ONLY SPEAKS JAPANESE',
				'                          VGML PN 1',
				'    P 3. SMITH/JOHN       VGML PN 1',
				'    P 4. SMITH/MICHALE    VGML PN 1',
				'S 2. DL  0275 M  20SEP DTWNRT',
				'    P 1. SMITH/MARGARETH  VGML PN 1',
				'    P 2. SMITH/MARGARETH  INFT KK 1  SMITH/KATHY 23APR17',
				'                          LANG PN 1  ONLY SPEAKS JAPANESE',
				'                          VGML PN 1',
				'    P 3. SMITH/JOHN       VGML PN 1',
				'    P 4. SMITH/MICHALE    VGML PN 1',
				'S 3. DL  0181 M  21SEP NRTMNL',
				'    P 1. SMITH/MARGARETH  VGML PN 1',
				'    P 2. SMITH/MARGARETH  INFT KK 1  SMITH/KATHY 23APR17',
				'                          LANG PN 1  ONLY SPEAKS JAPANESE',
				'                          VGML PN 1',
				'    P 3. SMITH/JOHN       VGML PN 1',
				'    P 4. SMITH/MICHALE    VGML PN 1',
				'S 4. DL  0180 M  28SEP MNLNRT',
				'    P 1. SMITH/MARGARETH  VGML PN 1',
				'    P 2. SMITH/MARGARETH  INFT KK 1  SMITH/KATHY 23APR17',
				'                          LANG PN 1  ONLY SPEAKS JAPANESE',
				'                          VGML PN 1',
				'    P 3. SMITH/JOHN       VGML PN 1',
				'    P 4. SMITH/MICHALE    VGML PN 1',
				'S 5. DL  0276 M  28SEP NRTDTW',
				'    P 1. SMITH/MARGARETH  VGML PN 1',
				'    P 2. SMITH/MARGARETH  INFT KK 1  SMITH/KATHY 23APR17',
				'                          LANG PN 1  ONLY SPEAKS JAPANESE',
				'                          VGML PN 1',
				'    P 3. SMITH/JOHN       VGML PN 1',
				'    P 4. SMITH/MICHALE    VGML PN 1',
				'S 6. DL  0916 M  28SEP DTWRDU',
				'    P 1. SMITH/MARGARETH  VGML PN 1',
				'    P 2. SMITH/MARGARETH  INFT KK 1  SMITH/KATHY 23APR17',
				'                          LANG PN 1  ONLY SPEAKS JAPANESE',
				'                          VGML PN 1',
				'    P 3. SMITH/JOHN       VGML PN 1',
				'    P 4. SMITH/MICHALE    VGML PN 1',
				'** OTHER SUPPLEMENTARY INFORMATION **',
				'CARRIER RELATED',
				'  1. YY  1CHD SHIELDS/BMISS AGED 6YRS',
				'  2. SSRCHLDDL HK  1 /-1SMITH/JOHN',
				'  3. SSRCHLDDL NO  1 /-1SMITH/JOHN.INVLD FORMAT',
				'** SEAT DATA **',
				' 1. DL 0890 M  20SEP RDUDTW',
				'     1. SMITH/MARGARETH   HK  17C            SA            AIR',
				'     3. SMITH/JOHN        HK  17D            N             AIR',
				'     4. SMITH/MICHALE     HK  17E            N             AIR',
				'** MILEAGE MEMBERSHIP DATA **',
				' ',
				'P  3. SMITH/JOHN        AN  2534475',
				'',
			]),
			{
				'seatDataSegments': [
					{
						'segmentNumber': '1',
						'passengers': [
							{'passengerNumber': '1', 'seatCode': '17C'},
							{'passengerNumber': '3', 'seatCode': '17D'},
							{'passengerNumber': '4', 'seatCode': '17E'},
						],
					},
				],
				'headerData': {
					'reservationInfo': {'recordLocator': 'W4W9FE'},
				},
				'passengers': {
					'passengerList': [
						{'lastName': 'SMITH', 'firstName': 'MARGARETH'},
						{'lastName': 'SMITH', 'firstName': 'KATHY', 'dob': {'parsed': '2017-04-23'}},
						{'lastName': 'SMITH', 'firstName': 'JOHN', 'ptc': 'C07'},
						{'lastName': 'SMITH', 'firstName': 'MICHALE', 'ptc': 'INS'},
					],
				},
				'itineraryData': [
					{'segmentNumber': 1, 'flightNumber': '890', 'departureAirport': 'RDU', 'destinationAirport': 'DTW'},
					{'segmentNumber': 2, 'flightNumber': '275', 'departureAirport': 'DTW', 'destinationAirport': 'NRT'},
					{'segmentNumber': 3, 'flightNumber': '181', 'departureAirport': 'NRT', 'destinationAirport': 'MNL'},
					{'segmentNumber': 4, 'flightNumber': '180', 'departureAirport': 'MNL', 'destinationAirport': 'NRT'},
					{'segmentNumber': 5, 'flightNumber': '276', 'departureAirport': 'NRT', 'destinationAirport': 'DTW'},
					{'segmentNumber': 6, 'flightNumber': '916', 'departureAirport': 'DTW', 'destinationAirport': 'RDU'},
				],
				'adrsData': {
					'name': 'JANE PASCOE',
					'addressLine1': '2 KNUTWICK CLOSE',
					'addressLine2': 'HAVANT HANT',
					'addressLine3': 'P/P014 8AD',
					'postCode': 'P014 8AD',
				},
				'dlvrData': {
					'name': 'JANE PASCOE',
					'addressLine1': '2 KNUTWICK CLOSE',
					'addressLine2': 'HAVANT HANT',
					'addressLine3': 'P/P014 8AD',
					'postCode': 'P014 8AD',
				},
				'ssrSegments': [
					{
						'segmentNumber': '1',
						'passengers': [
							{'passengerNumber': '1', 'ssrs': [{'ssrCode': 'VGML'}]},
							{
								'passengerNumber': '2',
								'ssrs': [{'ssrCode': 'INFT'}, {'ssrCode': 'LANG'}, {'ssrCode': 'VGML'}]
							},
							{'passengerNumber': '3', 'ssrs': [{'ssrCode': 'VGML'}]},
							{'passengerNumber': '4', 'ssrs': [{'ssrCode': 'VGML'}]},
						],
					},
					{
						'segmentNumber': '2',
						'passengers': [
							{'passengerNumber': '1', 'ssrs': [{'ssrCode': 'VGML'}]},
							{
								'passengerNumber': '2',
								'ssrs': [{'ssrCode': 'INFT'}, {'ssrCode': 'LANG'}, {'ssrCode': 'VGML'}]
							},
							{'passengerNumber': '3', 'ssrs': [{'ssrCode': 'VGML'}]},
							{'passengerNumber': '4', 'ssrs': [{'ssrCode': 'VGML'}]},
						],
					},
					{
						'segmentNumber': '3',
						'passengers': [
							{'passengerNumber': '1', 'ssrs': [{'ssrCode': 'VGML'}]},
							{
								'passengerNumber': '2',
								'ssrs': [{'ssrCode': 'INFT'}, {'ssrCode': 'LANG'}, {'ssrCode': 'VGML'}]
							},
							{'passengerNumber': '3', 'ssrs': [{'ssrCode': 'VGML'}]},
							{'passengerNumber': '4', 'ssrs': [{'ssrCode': 'VGML'}]},
						],
					},
					{
						'segmentNumber': '4',
						'passengers': [
							{'passengerNumber': '1', 'ssrs': [{'ssrCode': 'VGML'}]},
							{
								'passengerNumber': '2',
								'ssrs': [{'ssrCode': 'INFT'}, {'ssrCode': 'LANG'}, {'ssrCode': 'VGML'}]
							},
							{'passengerNumber': '3', 'ssrs': [{'ssrCode': 'VGML'}]},
							{'passengerNumber': '4', 'ssrs': [{'ssrCode': 'VGML'}]},
						],
					},
					{
						'segmentNumber': '5',
						'passengers': [
							{'passengerNumber': '1', 'ssrs': [{'ssrCode': 'VGML'}]},
							{
								'passengerNumber': '2',
								'ssrs': [{'ssrCode': 'INFT'}, {'ssrCode': 'LANG'}, {'ssrCode': 'VGML'}]
							},
							{'passengerNumber': '3', 'ssrs': [{'ssrCode': 'VGML'}]},
							{'passengerNumber': '4', 'ssrs': [{'ssrCode': 'VGML'}]},
						],
					},
					{
						'segmentNumber': '6',
						'passengers': [
							{'passengerNumber': '1', 'ssrs': [{'ssrCode': 'VGML'}]},
							{
								'passengerNumber': '2',
								'ssrs': [{'ssrCode': 'INFT'}, {'ssrCode': 'LANG'}, {'ssrCode': 'VGML'}]
							},
							{'passengerNumber': '3', 'ssrs': [{'ssrCode': 'VGML'}]},
							{'passengerNumber': '4', 'ssrs': [{'ssrCode': 'VGML'}]},
						],
					},
				],
				'otherSsrs': [
					{'lineNumber': '1', 'ssrCode': 'OSI', 'airline': 'YY', 'content': '1CHD SHIELDS/BMISS AGED 6YRS'},
					{
						'lineNumber': '2',
						'ssrCode': 'CHLD',
						'airline': 'DL',
						'status': 'HK',
						'statusNumber': '1',
						'content': '/'
					},
					{
						'lineNumber': '3',
						'ssrCode': 'CHLD',
						'airline': 'DL',
						'status': 'NO',
						'statusNumber': '1',
						'content': '/'
					},
				],
				'mileageProgramData': {
					'passengers': [
						{
							'passengerNumber': '3',
							'passengerName': 'SMITH/JOHN',
							'mileagePrograms': [
								{'airline': 'AN', 'code': '2534475'},
							],
						},
					],
				},
			},
		]);

		// >*ALL; with multiple VLOC, VENDOR REMARKS and DIVIDED BOOKING DATA
		list.push([
			php.implode(php.PHP_EOL, [
				'WJJ3R2/WS QSBIV VTL9WS  AG 99999992 08MAR',
				'  1.1STEPANOVA/LIUDMILAIVANOVA*C06',
				' 1. UA  200 M  24SEP GUMHNL HK1   640A - 610P O*         MO',
				' 2. DL 1212 M  23SEP HNLLAX HK1   945P # 612A O*         SU',
				' 3. DL 2522 M  10OCT SNASLC HK1   125P   411P O*         WE',
				' 4. AF 3607 M  10OCT SLCCDG HK1   457P #1115A O*         WE',
				'         OPERATED BY DELTA AIR LINES',
				'FONE-SFOR:8775591134',
				'TKTG-TAU/SA10MAR',
				'NOTE-',
				'  1. -S*SPLIT PTY/08MAR/WSAG/QSB/W5SK20 WS 08MAR 1351Z',
				'VLOC-UA*PLDDF9/08MAR 1352',
				'  2. 1A*SV2AMX/08MAR 1352',
				'VENDOR REMARKS',
				'VRMK-VI/AAF *ADTK1GTOAF BY 22MAR 1000 OTHERWISE WILL BE XLD 1314Z 08MAR',
				'  2. VI/AAF *ADTK1GTOAF BY 22MAR 1000 OTHERWISE WILL BE XLD 1352Z 08MAR',
				'  3. VI/AUA *ADTK1GKK3 .TKT UA SEGS BY 17SEP18 TO AVOID AUTO CXL /EARLIER 1329Z 08MAR',
				'  4. VI/AUA *ADTK1GKK3 .TICKETING MAY BE REQUIRED BY FARE RULE 1329Z 08MAR',
				'  5. VI/AUA *ADTK1GKK1 .TKT UA SEGS BY 17SEP18 TO AVOID AUTO CXL /EARLIER 1407Z 08MAR',
				'  6. VI/AUA *ADTK1GKK1 .TICKETING MAY BE REQUIRED BY FARE RULE 1407Z 08MAR',
				'** DIVIDED BOOKING DATA **',
				'** ORIGINAL BOOKING     **',
				'STEPANOV/IGOR      >*W5SK20;',
				'',
			]),
			{
				'headerData': {
					'reservationInfo': {'recordLocator': 'WJJ3R2'},
				},
				'dividedBookingData': {
					'recordType': 'ORIGINAL_BOOKING',
					'records': [
						{'passengerName': 'STEPANOV/IGOR', 'recordLocator': 'W5SK20'},
					],
				},
				'passengers': {
					'passengerList': [
						{'lastName': 'STEPANOVA', 'firstName': 'LIUDMILAIVANOVA', 'ptc': 'C06'},
					],
				},
				'itineraryData': [
					{'segmentNumber': 1, 'airline': 'UA', 'destinationAirport': 'HNL'},
					{'segmentNumber': 2, 'airline': 'DL', 'destinationAirport': 'LAX'},
					{'segmentNumber': 3, 'airline': 'DL', 'destinationAirport': 'SLC'},
					{'segmentNumber': 4, 'airline': 'AF', 'destinationAirport': 'CDG'},
				],
				'vlocData': [
					{
						'lineNumber': '1',
						'airline': 'UA',
						'recordLocator': 'PLDDF9',
						'date': {'raw': '08MAR'},
						'time': {'raw': '1352'}
					},
					{
						'lineNumber': '2',
						'airline': '1A',
						'recordLocator': 'SV2AMX',
						'date': {'raw': '08MAR'},
						'time': {'raw': '1352'}
					},
				],
				'vendorSsrs': [
					{
						'lineNumber': '1', 'airline': 'AF', 'ssrCode': 'ADTK', 'toAirline': 'AF',
						'content': 'BY 22MAR 1000 OTHERWISE WILL BE XLD',
						'time': {'raw': '1314', 'parsed': '13:14'},
						'date': {'raw': '08MAR', 'parsed': '03-08'},
					},
					{
						'lineNumber': '2', 'airline': 'AF', 'ssrCode': 'ADTK', 'toAirline': 'AF',
						'content': 'BY 22MAR 1000 OTHERWISE WILL BE XLD',
						'time': {'raw': '1352', 'parsed': '13:52'},
						'date': {'raw': '08MAR', 'parsed': '03-08'},
					},
					{
						'lineNumber': '3', 'airline': 'UA', 'ssrCode': 'ADTK', 'status': 'KK', 'statusNumber': '3',
						'content': '.TKT UA SEGS BY 17SEP18 TO AVOID AUTO CXL /EARLIER',
						'time': {'raw': '1329', 'parsed': '13:29'},
						'date': {'raw': '08MAR', 'parsed': '03-08'},
					},
					{
						'lineNumber': '4', 'airline': 'UA', 'ssrCode': 'ADTK', 'status': 'KK', 'statusNumber': '3',
						'content': '.TICKETING MAY BE REQUIRED BY FARE RULE',
						'time': {'raw': '1329', 'parsed': '13:29'},
						'date': {'raw': '08MAR', 'parsed': '03-08'},
					},
					{
						'lineNumber': '5', 'airline': 'UA', 'ssrCode': 'ADTK', 'status': 'KK', 'statusNumber': '1',
						'content': '.TKT UA SEGS BY 17SEP18 TO AVOID AUTO CXL /EARLIER',
						'time': {'raw': '1407', 'parsed': '14:07'},
						'date': {'raw': '08MAR', 'parsed': '03-08'},
					},
					{
						'lineNumber': '6', 'airline': 'UA', 'ssrCode': 'ADTK', 'status': 'KK', 'statusNumber': '1',
						'content': '.TICKETING MAY BE REQUIRED BY FARE RULE',
						'time': {'raw': '1407', 'parsed': '14:07'},
						'date': {'raw': '08MAR', 'parsed': '03-08'},
					},
				],
			},
		]);

		// various FONE- free formats
		list.push([
			php.implode(php.PHP_EOL, [
				'CPR0HI/WS QSBIV VTL9WS  AG 99999992 07MAR',
				'  1.1LIBERMANE/MARINA',
				' 1. PS  898 D  10MAY KIVKBP HK1   720A   825A O*         TH  1',
				' 2. PS  185 D  10MAY KBPRIX HK1   920A  1055A O*         TH  1',
				'** FILED FARE DATA EXISTS **           >*FF;',
				'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
				'** VENDOR REMARKS DATA EXISTS **       >*VR;',
				'FONE-PIXR',
				'  2. SFOR:1234567',
				'  3. LAXR:4567899',
				'  4. NYCR',
				'  5. ASDR',
				'  6. ASDF',
				'  7. ASDFG',
				'  8. ASDF*123',
				'  9. ASDF/123',
				' 10. ASDF-1234',
				' 11. ASSS*123-4567',
				'TKTG-TAU/WE04APR',
			]),
			{
				'foneData': [
					{'lineNumber': '1', 'data': 'PIXR'},
					{'lineNumber': '2', 'data': 'SFOR:1234567'},
					{'lineNumber': '3', 'data': 'LAXR:4567899'},
					{'lineNumber': '4', 'data': 'NYCR'},
					{'lineNumber': '5', 'data': 'ASDR'},
					{'lineNumber': '6', 'data': 'ASDF'},
					{'lineNumber': '7', 'data': 'ASDFG'},
					{'lineNumber': '8', 'data': 'ASDF*123'},
					{'lineNumber': '9', 'data': 'ASDF/123'},
					{'lineNumber': '10', 'data': 'ASDF-1234'},
					{'lineNumber': '11', 'data': 'ASSS*123-4567'},
				],
				'dataExistsInfo': {
					'vlocDataExists': true,
					'vendorRemarksDataExists': true,
					'filedFareDataExists': true,
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'** THIS BF IS CURRENTLY IN USE **',
				'CPR0HI/WS QSBIV VTL9WS  AG 99999992 07MAR',
				'  1.1LIBERMANE/MARINA',
				' 1. PS  898 D  10MAY KIVKBP HK1   720A   825A O*         TH  1',
				' 2. PS  185 D  10MAY KBPRIX HK1   920A  1055A O*         TH  1',
				'FONE-PIXR',
				'TKTG-TAU/WE04APR',
				'VLOC-1A*QJJNNR/07MAR 1539',
				'VENDOR REMARKS',
				'VRMK-VI/APS *ADTK1GTOPS BY 17MAR 1200 OTHERWISE WILL BE XLD 1539Z 07MAR',
				'FQ1  - S1-2                                       07MAR18 WS/AG',
				' P1  LIBERMANE/MARINA          ADT   X             USD  708.70',
				' KIV PS X/IEV PS RIX 603.79 NUC603.79END ROE0.844659',
				' FARE EUR510.00 EQU USD628.00 TAX 3.10JQ TAX 11.10MD',
				' TAX 7.60WW TAX 4.00UA TAX 8.50YK TAX 18.00YQ TAX 28.40YR',
				' TOT USD708.70',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO1;',
				' S1   FB-D1EP4',
				'      BG-2PC',
				' S2   FB-D1EP4',
				'      BG-2PC',
				' NONEND/RES RSTR/RBK FOC',
				' LAST DATE TO PURCHASE TICKET: 03MAY18',
				' T S1-2/CPS/ET/TA711M',
			]),
			{
				'filedPricingList': [
					{
						'pricingNumber': '1',
						'segmentNumbers': [1, 2],
						'addedDate': {'raw': '7MAR18', 'parsed': '2018-03-07'},
						'agentInitials': 'WS',
						'passengers': [
							{
								'passengerNumber': '1',
								'passengerName': 'LIBERMANE/MARINA',
								'ptc': 'ADT',
								'currency': 'USD',
								'amount': '708.70',
								'blockData': {
									'fareConstruction': {
										'segments': [
											{'destination': 'IEV'},
											{'destination': 'RIX', 'fare': '603.79'},
										],
									},
									'baseFare': {'currency': 'EUR', 'amount': '510.00'},
									'fareEquivalent': {'currency': 'USD', 'amount': '628.00'},
									'netPrice': {'currency': 'USD', 'amount': '708.70'},
								},
							},
						],
						'footerData': {
							'normalizedPricingModifiers': [
								{'raw': 'S1-2', 'type': 'segments'},
								{'raw': 'CPS', 'type': 'validatingCarrier'},
								{'raw': 'ET', 'type': 'areElectronicTickets'},
								{'raw': 'TA711M', 'type': 'ticketingAgencyPcc'},
							],
						},
					},
				],
				'dataExistsInfo': {
					'vlocDataExists': true,
					'vendorRemarksDataExists': true,
					'filedFareDataExists': true,
				},
				'vendorSsrs': [
					{
						'lineNumber': '1',
						'airline': 'PS',
						'ssrCode': 'ADTK',
						'toAirline': 'PS',
						'content': 'BY 17MAR 1200 OTHERWISE WILL BE XLD',
						'time': {'raw': '1539', 'parsed': '15:39'},
						'date': {'raw': '07MAR', 'parsed': '03-07'},
					},
				],
			},
		]);

		// with ** OTHER SUPPLEMENTARY INFORMATION ** section
		list.push([
			php.implode(php.PHP_EOL, [
				' 1. PS  898 D  10MAY KIVKBP HS1   720A   825A O          TH  1',
				' 2. PS  185 D  10MAY KBPRIX HS1   920A  1055A O          TH  1',
				'** OTHER SUPPLEMENTARY INFORMATION **',
				'CARRIER RELATED',
				'  1. YY  1CHD SHIELDS/BMISS AGED 6YRS',
			]),
			{
				'itineraryData': [
					{'segmentNumber': 1},
					{'segmentNumber': 2},
				],
				'otherSsrs': [
					{'lineNumber': '1', 'airline': 'YY', 'content': '1CHD SHIELDS/BMISS AGED 6YRS'},
				],
			},
		]);

		// segment without times
		list.push([
			php.implode(php.PHP_EOL, [
				' 1. UA 5695 Y  05SEP SFOMCI BK1                          WE',
				' 2. CX  901 Y  26MAY HKGMNL BK1   900A  1125A            SA',
				' 3. KE 7246 L  30MAY TPAJFK BK1   735P  1020P            WE',
				'         OPERATED BY DELTA AIR LINES',
			]),
			{
				'itineraryData': [
					{
						'segmentNumber': 1,
						'segmentType': 'FAKE',
						'segmentStatus': 'BK',
						'seatCount': 1,
						'daysOfWeek': {'raw': 'WE'}
					},
					{'segmentNumber': 2, 'segmentType': 'AIR'},
					{'segmentNumber': 3, 'segmentType': 'AIR'},
				],
			},
		]);

		// >*ALL; with SSR DOCS
		list.push([
			php.implode(php.PHP_EOL, [
				'** THIS BF HAS BEEN CHANGED - IGNORE BEFORE PROCEEDING ** >IR;',
				'71XTRQ/WS QSBIV VTL9WS  AG 05578602 28MAR',
				'  1.1LIBERMANE/MARINA   2.I/1LIBERMANE/ZIMICH*25JAN18',
				'  3.1LIBERMANE/LEPIN   4.1LIBERMANE/STAS',
				' 1. PS  898 D  10MAY KIVKBP HK3   720A   825A O          TH  2',
				' 2. PS  185 D  10MAY KBPRIX HK3   920A  1055A O          TH  2',
				'FONE-PIXR',
				'RCVD-KLESUN',
				'TKTG-TAU/WE04APR',
				'NOTE-',
				'  1. GD-PRINCE/1588/FOR STANISLAW/2838/LEAD-1 IN 711M WS 28MAR 1',
				'     806Z',
				'  2. DEV TESTING PLS IGNORE WS 28MAR 1806Z',
				'** SPECIAL SERVICE REQUIREMENT **',
				'SEGMENT/PASSENGER RELATED',
				'S 1. PS  0898 D  10MAY KIVKBP',
				'    P 2. LIBERMANE/MARIN| INFT PN 1  LIBERMANE/ZIMICH 25JAN18',
				'S 2. PS  0185 D  10MAY KBPRIX',
				'    P 2. LIBERMANE/MARIN| INFT PN 1  LIBERMANE/ZIMICH 25JAN18',
				'NO OSI EXISTS',
				'** MANUAL SSR DATA **',
				'  1. SSRDOCSRJ HK  1 /P/JOR/XXXX4567/JOR/XXXXXXX/M/11MAR15/ALSH-',
				'                     EHRI/ALI/OMAR-1LIBERMANE/MARINA',
				'  2. SSRDOCSPS HK  1 /P/LV/XXX/LV/XXXXXXX/M/11MAR20/IVANOV/IVAN-',
				'                     /D/D-1LIBERMANE/MARINA',
				'  3. SSRDOCSPS HK  1 /P/LV/XXX/LV/XXXXXXX/M/11MAR21/IVANOV/VASY-',
				'                     A/D/D-1LIBERMANE/MARINA',
				'  4. SSRDOCSPS HK  1 /P/LV/X2345/LV/XXXXXXX/M/11MAR22/IVANOV/OL-',
				'                     EG/D/D-1LIBERMANE/ZIMICH',
				'  5. SSRDOCSPS HK  1 /P/LV/X2345/LV/XXXXXXX/MI/11MAR22/IVANOV/O-',
				'                     LEG/D/D-1LIBERMANE/ZIMICH',
			]),
			{
				'ssrSegments': [
					{'segmentNumber': '1'},
					{'segmentNumber': '2'},
				],
				'otherSsrs': [
					{
						'lineNumber': '1',
						'ssrCode': 'DOCS',
						'airline': 'RJ',
						'status': 'HK',
						'statusNumber': '1',
						'content': '/P/JOR/XXXX4567/JOR/XXXXXXX/M/11MAR15/ALSHEHRI/ALI/OMAR',
					},
					{'lineNumber': '2', 'ssrCode': 'DOCS', 'airline': 'PS'},
					{'lineNumber': '3', 'ssrCode': 'DOCS', 'airline': 'PS'},
					{
						'lineNumber': '4',
						'ssrCode': 'DOCS',
						'airline': 'PS',
						'status': 'HK',
						'statusNumber': '1',
						'content': '/P/LV/X2345/LV/XXXXXXX/M/11MAR22/IVANOV/OLEG/D/D',
					},
					{'lineNumber': '5', 'ssrCode': 'DOCS', 'airline': 'PS'},
				],
			},
		]);

		// with "FOP -CK"
		list.push([
			php.implode(php.PHP_EOL, [
				'8MQKQY/WS QSBIV VTL9WS  AG 99999992 26MAR',
				'  1.1SMITH/JOHNY',
				'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
				'** VENDOR REMARKS DATA EXISTS **       >*VR;',
				'FONE-SFOR*800-750-2238',
				'  2. SFOE*JOHN//SMITH.COM',
				'FOP -CK',
				'NOTE-',
				'  1. GD-KEITH/1251/FOR ELDAR/20744/LEAD-7735630 IN 711M WS 26MAR',
				'      1706Z',
			]),
			{
				'headerData': {
					'reservationInfo': {'recordLocator': '8MQKQY'},
				},
				'passengers': {
					'passengerList': [
						{'firstName': 'JOHNY', 'lastName': 'SMITH'},
					],
				},
				'itineraryData': [],
				'foneData': [
					{'lineNumber': '1', 'data': 'SFOR*800-750-2238'},
					{'lineNumber': '2', 'data': 'SFOE*JOHN//SMITH.COM'},
				],
				'formOfPaymentData': {'formOfPayment': 'cash'},
			},
		]);

		// with credit card FOP
		list.push([
			php.implode(php.PHP_EOL, [
				'** THIS BF IS CURRENTLY IN USE **',
				'8PG6RQ/WS QSBIV VTL9WS  AG 05578602 05APR',
				'  1.1LIBERMANE/MARINA',
				' 1. AT  262 D  20SEP NBOCMN HK1   650A   255P O*       E TH',
				' 2. AT  202 D  20SEP CMNJFK HK1  1040P # 130A O*       E TH',
				' 3. AT  201 D  29SEP JFKCMN HK1   900P # 850A O*       E SA',
				' 4. AT  263 D  30SEP CMNNBO HK1   410P # 415A O*       E SU',
				'** FILED FARE DATA EXISTS **           >*FF;',
				'** MEMBERSHIP DATA EXISTS **           >*MM;',
				'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
				'** VENDOR REMARKS DATA EXISTS **       >*VR;',
				'** SERVICE INFORMATION EXISTS **       >*SI;',
				'FONE-PIXR',
				'FOP -VIXXXXXXXXXXXX6661/D0801',
				'TKTG-TAU/FR04MAY',
				'NOTE-',
				'  1. GD-PRINCE/1588/FOR STANISLAW/2838/LEAD-1 IN 711M WS 05APR 1',
				'     247Z',
				'  2. DEV TESTING PLS IGNORE WS 05APR 1247Z',
				'  3. KLESUN RULEZ WS 05APR 1918Z',
				'  4. KLESUN RULEZ 2 WS 05APR 1919Z',
			]),
			{
				'headerData': {
					'reservationInfo': {'recordLocator': '8PG6RQ'},
				},
				'passengers': {
					'passengerList': [
						{'firstName': 'MARINA', 'lastName': 'LIBERMANE'},
					],
				},
				'itineraryData': [
					{'segmentNumber': 1, 'destinationAirport': 'CMN'},
					{'segmentNumber': 2, 'destinationAirport': 'JFK'},
					{'segmentNumber': 3, 'destinationAirport': 'CMN'},
					{'segmentNumber': 4, 'destinationAirport': 'NBO'},
				],
				'formOfPaymentData': {
					'formOfPayment': 'creditCard',
					'ccType': 'VI',
					'ccNumber': 'XXXXXXXXXXXX6661',
					'expirationDate': {'raw': '0801', 'parsed': '2001-08'},
					'approvalCode': null,
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'** THIS BF IS CURRENTLY IN USE **',
				'RLHFDY/WS QSBIV VTL9WS  AG 05578602 06APR',
				'  1.1SMITH/JOHN',
				' 1. DL 3962 Y  20SEP JFKIAD UN1   810A   931A O*       E TH',
				' 2. DL 5414 Y  20SEP JFKIAD TK1   810A   931A O*         TH',
				'         OPERATED BY ENDEAVOR AIR DBA DELTA',
				'** FILED FARE DATA EXISTS **           >*FF;',
				'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
				'** VENDOR REMARKS DATA EXISTS **       >*VR;',
				'** SERVICE INFORMATION EXISTS **       >*SI;',
				'** TINS REMARKS EXIST **               >*HTI;',
				'** ELECTRONIC DATA EXISTS **           >*HTE;',
				'FONE-SFOR*800-750-2238',
				'  2. SFOE*JOHN//SMITH.COM',
				'FOP -CK',
				'TKTG-T*QSB 06APR1610Z WS AG',
				'NOTE-',
				'  1. GD-KEITH/1251/FOR KEITH/1251/LEAD-2797112 IN 711M WS 06APR',
				'     1549Z',
			]),
			{
				'tktgData': {
					'agencyCode': 'QSB',
					'ticketingDate': {'raw': '06APR', 'parsed': '04-06'},
					'ticketingTime': {'raw': '1610', 'parsed': '16:10'},
					'timezone': {'raw': 'Z', 'parsed': 'UTC'},
					'fpInitials': 'WS',
				},
				'dataExistsInfo': {
					'filedFareDataExists': true,
					'dividedBookingExists': false,
					'vlocDataExists': true,
					'vendorRemarksDataExists': true,
					'serviceInformationExists': true,
					'membershipDataExists': false,
					'seatDataExists': false,
					'tinRemarksExist': true,
					'eTicketDataExists': true,
				},
			},
		]);

		// with car and hotel
		list.push([
			php.implode(php.PHP_EOL, [
				'Q5V0H0/WS QSBIV VTL9WS  AG 05578602 22MAY',
				'  1.1RZAEV/ELDAR',
				' 1. PS  898 N  20SEP KIVKBP HK1   720A   825A O*       E TH  1',
				' 2. PS  185 N  20SEP KBPRIX HK1   920A  1055A O*       E TH  1',
				' 3. HHL LW HK1  RIX 20SEP-21SEP  1NT 28550  GRAND PALACE HOTEL',
				'      1L051ZZZ-1/RG-EUR195.00/AGT05578602/G-VIXXXXXXXXXXXX2556EX',
				'    P0123/NM-RZAEV ELDAR/CF-123590363*',
				' 4. CCR AC HK1  RIX 20SEP-21SEP ICMR/RG-EUR30.00DY-UNL MI -FLYDR',
				'    V/BS-05578602/PUP-RIXO01/RC-FLYDRV-DS/DT-1200/NM-RZAEV ELDAR',
				'    /CF-GLF5578286*',
				'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
				'** VENDOR REMARKS DATA EXISTS **       >*VR;',
				'** SERVICE INFORMATION EXISTS **       >*SI;',
				'*** ADDITIONAL ITINERARY DATA EXISTS ***>*I;',
				'FONE-SFOR*800-750-2238 ASAP CUSTOMER SUPPORT',
				'TKTG-TAU/TU22MAY',
				'NOTE-',
				'  1. GD-ELDAR/20744/FOR MARGE CURRAN/21818/LEAD-8265234 IN 711M',
				'     WS 22MAY 1507Z',
			]),
			{
				'itineraryData': [
					{'segmentNumber': 1, 'segmentType': 'AIR'},
					{'segmentNumber': 2, 'segmentType': 'AIR'},
					{'segmentNumber': '3', 'segmentType': 'HOTEL'},
					{'segmentNumber': '4', 'segmentType': 'CAR'},
				],
			},
		]);

		// another car and hotel example, >*ALL;
		list.push([
			php.implode(php.PHP_EOL, [
				'29T4L0/WS QSBIV VTL9WS  AG 05578602 25MAY',
				'  1.1PROKOPCHUK/STAS   2.1WRIGHT/PHOENIX',
				'  3.I/1PROKOPCHUK/SASHA*15FEB18',
				' 1. LO  516 D  20DEC KIVWAW NO2   555P   645P            TH',
				' 2. LO 5783 D  20DEC WAWRIX NO2   755P  1020P            TH',
				'         OPERATED BY AIR BALTIC CORPORATION',
				' 3. CCR ZD HK1  RIX 20DEC-21DEC MBAR/RG-USD4.85DY-UNL FM XH 27.3    6 UNL FM/BS-05578602/PUP-RIXT01/RC-UCI/DT-1800/NM-PROKOPCHUK     STAS/CF-36080825US4*',
				' 4. HHL RD SS1  RIX 20DEC-21DEC  1NT 69618  RADISSON BLU LATVIJ',
				'      1ZJXX200-1/RG-EUR154.00/AGT05578602/G-CAXXXXXXXXXXXX7881EX    P0819/NM-PROKOPCHUK STAS/CF-QMV6NFD*',
				'FONE-PIXR',
				'TKTG-TAU/TU04SEP',
				'NOTE-',
				'  1. GD-PRINCE/1588/FOR STANISLAW/2838/LEAD-1 IN 711M WS 25MAY 0     954Z',
				'  2. DEV TESTING PLS IGNORE WS 25MAY 0954Z',
				'VENDOR REMARKS',
				'VRMK-VI/ALO *NOREC 0954Z 25MAY',
				'** SPECIAL SERVICE REQUIREMENT **',
				'SEGMENT/PASSENGER RELATED',
				'S 1. LO  0516 D  20DEC KIVWAW',
				'    P 3. PROKOPCHUK/STAS  INFT PN 1  PROKOPCHUK/SASHA 15FEB18',
				'S 2. LO  5783 D  20DEC WAWRIX',
				'    P 3. PROKOPCHUK/STAS  INFT PN 1  PROKOPCHUK/SASHA 15FEB18',
				'** OTHER SUPPLEMENTARY INFORMATION **',
				'CARRIER RELATED',
				'  1. 1G  RD69618ARR20DEC CXL:CXL BY 1800 DEC 20 2018 TO AVOID A-          154.00EUR C',
			]),
			{
				'itineraryData': [
					{'segmentNumber': 1, 'segmentType': 'AIR'},
					{'segmentNumber': 2, 'segmentType': 'AIR'},
					{'segmentNumber': '3', 'segmentType': 'CAR'},
					{'segmentNumber': '4', 'segmentType': 'HOTEL'},
				],
			},
		]);

		// First itinerary line joined with passenger line
		list.push([
			php.implode(php.PHP_EOL, [
				' K9P- TRAVELPACK MARKETING   L LON',
				'9FLVD6/WS QSBIV VTL9WS  AG 91291233 03JUL',
				'  1.1HAJARI/VIJAYKUMARTHAKORBHAI   2.1HAJARI/BHARTIBENVIJAYKUMAR 1. SN 2184 K  31DEC MANBRU HK2   610A   830A O*       E MO  1',
				' 2. SN  601 K  31DEC BRUBOM HK2  1015A  1125P O*       E MO  1',
				' 3. SN  602 K  09MAR BOMBRU HK2   135A   645A O*       E SA  2',
				' 4. SN 2173 K  09MAR BRUMAN HK2   955A  1020A O*       E SA  2',
				'         OPERATED BY CITYJET',
				'** FILED FARE DATA EXISTS **           >*FF;',
				'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
				'** VENDOR REMARKS DATA EXISTS **       >*VR;',
				'** SERVICE INFORMATION EXISTS **       >*SI;',
				'FONE-SFOR*800-750-2238 ASAP CUSTOMER SUPPORT',
				'TKTG-TAU/TU03JUL',
				'NOTE-',
				'  1. GD-WALDO GILES/20686/FOR NANCY LEWIS/24106/LEAD-8591550 IN',
				'     K9P WS 03JUL 1537Z',
			]),
			{
				'passengers': {
					'passengerList': [
						{'firstName': 'VIJAYKUMARTHAKORBHAI', 'lastName': 'HAJARI'},
						{'firstName': 'BHARTIBENVIJAYKUMAR', 'lastName': 'HAJARI'},
					],
				},
				'itineraryData': [
					{
						'segmentNumber': 1,
						'airline': 'SN',
						'flightNumber': '2184',
						'bookingClass': 'K',
						'departureAirport': 'MAN',
						'destinationAirport': 'BRU',
					},
					{
						'segmentNumber': 2,
						'airline': 'SN',
						'flightNumber': '601',
						'bookingClass': 'K',
						'departureAirport': 'BRU',
						'destinationAirport': 'BOM',
					},
					{
						'segmentNumber': 3,
						'airline': 'SN',
						'flightNumber': '602',
						'bookingClass': 'K',
						'departureAirport': 'BOM',
						'destinationAirport': 'BRU',
					},
					{
						'segmentNumber': 4,
						'airline': 'SN',
						'flightNumber': '2173',
						'bookingClass': 'K',
						'departureAirport': 'BRU',
						'destinationAirport': 'MAN',
					},
				],
			},
		]);

		// Long VLOC line
		list.push([
			php.implode(php.PHP_EOL, [
				'** THIS BF IS CURRENTLY IN USE **',
				' K9P- TRAVELPACK MARKETING   L LON',
				'SSGFMQ/WS QSBIV VTL9WS  AG 91291233 12JUL',
				'  1.1YATES/NIGEL',
				' 1. DL   51 U  14JUL LHRSLC HK1  1010A   139P O*       E SA  1',
				' 2. DL 1485 U  14JUL SLCSAT HK1   510P   851P O*       E SA  1',
				' 3. DL 5720 U  15JAN SATLAX HK1   412P   545P O*       E TU  2',
				'         OPERATED BY COMPASS DBA DELTA CONNE',
				' 4. DL 4405 V  15JAN LAXLHR HK1   840P # 250P O*       E TU  2',
				'         OPERATED BY VIRGIN ATLANTIC',
				'** FILED FARE DATA EXISTS **           >*FF;',
				'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
				'FONE-SFOR*800-750-2238 ASAP CUSTOMER SUPPORT',
				'TKTG-TAU/TH12JUL',
				'NOTE-',
				'  1. GD-EMILY/2485/FOR WILL GOLDMAN/21146/LEAD-8747890 IN K9P WS      12JUL 1437Z',
				'VLOC-DL*JORYVY///SWI/DL/A/GB/12JUL 1437',
			]),
			{
				'vlocData': [
					{
						'lineNumber': '1',
						'airline': 'DL',
						'recordLocator': 'JORYVY',
						'date': {'raw': '12JUL'},
						'time': {'raw': '1437'}
					},
				],
			},
		]);

		// >*1GFPGI; with HTL segment
		list.push([
			php.implode(php.PHP_EOL, [
				' 1. AA   55 L  19AUG MANORD HK2   110P   340P O*       E SU',
				' 2. HTL ZZ MK1  ORD 19AUG-OUT21AUG /H-MOTEL 6 PROSPECT HEIGHTS/R' +
				'    -EAN/BC-I/W-540 N MILWAUKEE AVE*PROSPECT HEIGHTS*US*P-60070/' +
				'    RQ-GBP31.41/CF-150658393700',
				' 3. AA   54 L  22AUG ORDMAN HK2   730P # 850A O*       E WE',
			]),
			{
				'itineraryData': [
					{'segmentType': 'AIR', 'segmentNumber': 1,},
					{
						'segmentNumber': '2',
						'segmentType': 'HOTEL',
						'hotelType': 'HTL',
						'hotel': 'ZZ',
						'segmentStatus': 'MK',
						'roomCount': 1,
						'city': 'ORD',
						'startDate': {'raw': '19AUG', 'parsed': '08-19'},
						'endDate': {'raw': '21AUG', 'parsed': '08-21'},
						'fields': [
							{'code': 'H', 'content': 'MOTEL 6 PROSPECT HEIGHTS'},
							{'code': 'R', 'content': 'EAN'},
							{'code': 'BC', 'content': 'I'},
							{'code': 'W', 'content': '540 N MILWAUKEE AVE*PROSPECT HEIGHTS*US*P-60070'},
							{'code': 'RQ', 'content': 'GBP31.41'},
							{'code': 'CF', 'content': '150658393700'},
						],
						'raw': php.implode(php.PHP_EOL, [
							' 2. HTL ZZ MK1  ORD 19AUG-OUT21AUG /H-MOTEL 6 PROSPECT HEIGHTS/R',
							'    -EAN/BC-I/W-540 N MILWAUKEE AVE*PROSPECT HEIGHTS*US*P-60070/',
							'    RQ-GBP31.41/CF-150658393700',
						]),
					},
					{'segmentType': 'AIR', 'segmentNumber': 3,},
				],
			},
		]);

		// "NO OSI EXISTS" line should not get parsed as an airline SSR
		list.push([
			php.implode(php.PHP_EOL, [
				'** THIS BF IS CURRENTLY IN USE **',
				' K9P- TRAVELPACK MARKETING   L LON',
				'29RG28/WS QSBIV VTL9WS  AG 91291233 23AUG',
				'  1.1PATRICK/SON   2.1GARY/CREED   3.1ROBINSON/VERNA',
				'  4.1SAM/BONNIE   5.1WEST/FRED   6.1DAVIDSON/PAUL',
				' 1. MF 8030 Y  24AUG SHETAO HK6   505P   645P O*       E FR',
				' 2. MF  857 K  24AUG TAOLAX HK6  1010P   700P O*       E FR',
				'FONE-SFOR*800-750-2238 ASAP CUSTOMER SUPPORT',
				'TKTG-TAU/TH23AUG',
				'NOTE-',
				'  1. GD-JORDAN LIGHTMAN/8216/FOR OWEN PARKER/101074/LEAD-9082298      IN K9P WS 23AUG 1658Z',
				'VLOC-CA*PXPJS7/23AUG 1658',
				'VENDOR REMARKS',
				'VRMK-VI/AMF *DOCS INFO IS REQUIRED FOR MF FLT 1658Z 23AUG',
				'  2. VI/AMF *ADTK1GBYLON23AUG18/1858 OR CXL MF 857 K24AUG 1658Z 23AUG',
				'NO OSI EXISTS',
				'** MANUAL SSR DATA **',
				'  1. SSRADPI1G KK  1 MF0857 REQ SEC FLT PSGR DATA 72 HBD FOR AL-                     L PSGRS',
			]),
			{
				'headerData': {
					'reservationInfo': {'recordLocator': '29RG28'},
				},
				'otherSsrs': [
					{
						'lineNumber': '1',
						'ssrCode': 'ADPI',
						'content': 'MF0857 REQ SEC FLT PSGR DATA 72 HBD FOR ALL PSGRS'
					},
				],
				'seatDataSegments': [],
				'vendorSsrs': [
					{'lineNumber': '1', 'airline': 'MF', 'content': 'DOCS INFO IS REQUIRED FOR MF FLT'},
					{'lineNumber': '2', 'airline': 'MF', 'content': 'ADTK1GBYLON23AUG18/1858 OR CXL MF 857 K24AUG'},
				],
			},
		]);

		// seems like no headerData in output for some reason
		list.push([
			php.implode(php.PHP_EOL, [
				'** THIS BF IS CURRENTLY IN USE **',
				'NSBF34/WS QSBIV VTL9WS  AG 05578602 28MAR',
				'  1.1IGLESIASDELRIO/MARCOANTONIO',
				' 1. DI 7044 P  10APR MIALGW HK1   500P # 620A O*         WE',
				' 2. D8 6051 M  11APR LGWMAD HK1  1005A   130P O*         TH',
				'** FILED FARE DATA EXISTS **           >*FF·',
				'** VENDOR LOCATOR DATA EXISTS **       >*VL·',
				'FONE-SFOR*800-750-2238 ASAP CUSTOMER SUPPORT',
				'TKTG-TAU/TH28MAR',
				'NOTE-',
				'  1. GD-AMARANTA/23964/FOR AGENT/102152/LEAD-10939640 IN 711M WS',
				'      28MAR 2259Z',
			]),
			{
				'headerData': {
					'reservationInfo': {'recordLocator': 'NSBF34'},
				},
			},
		]);

		// due to a bug in Galileo, *QWE123|*ALL ends with 'T*FFALL)><' if CONFIDENTIAL DATA EXISTS
		// should not treat it as SSR
		list.push([
			php.implode(php.PHP_EOL, [
				' G8T- TRAVELPACK MARKETING   L LON',
				'B9T31W/WS QSBIV VTL9WS  AG 91291233 28AUG',
				'  1.1TSIOPNI/PAULMICHAEL',
				' 1. UA  935 K  30AUG LHRLAX HK1   210P   510P O*       E TH',
				' 2. UA  923 K  22SEP LAXLHR HK1   550P #1220P O*       E SA',
				'FONE-SFOR*800-750-2238 ASAP CUSTOMER SUPPORT',
				'TKTG-TAU/TU28AUG',
				'NOTE-',
				'  1. GD-FRED DAVIS/100592/FOR FRED DAVIS/100592/LEAD-9085428 IN',
				'     G8T WS 28AUG 1302Z',
				'  2. CHML REF *********** CLIENT BOOKING NO: S92258 KE 28AUG 131     6Z',
				'VLOC-UA*GTNWMY/28AUG 1302',
				'VENDOR REMARKS',
				'VRMK-VI/AUA *ADTK1GKK1 .TKT UA SEGS BY 29AUG18 TO AVOID AUTO CXL /EARLIER 1317Z 28AUG',
				'  2. VI/AUA *ADTK1GKK1 .TICKETING MAY BE REQUIRED BY FARE RULE 1317Z 28AUG',
				'',
				'T*FFALL',
			]),
			{
				'vlocData': [
					{
						'lineNumber': '1',
						'airline': 'UA',
						'recordLocator': 'GTNWMY',
						'date': {'raw': '28AUG', 'parsed': '08-28'},
						'time': {'raw': '1302', 'parsed': '13:02'},
					},
				],
				'vendorSsrs': [
					{
						'lineNumber': '1',
						'airline': 'UA',
						'ssrCode': 'ADTK',
						'status': 'KK',
						'statusNumber': '1',
						'toAirline': '',
						'content': '.TKT UA SEGS BY 29AUG18 TO AVOID AUTO CXL /EARLIER',
						'time': {'raw': '1317', 'parsed': '13:17'},
						'date': {'raw': '28AUG', 'parsed': '08-28'},
					},
					{
						'lineNumber': '2',
						'airline': 'UA',
						'ssrCode': 'ADTK',
						'status': 'KK',
						'statusNumber': '1',
						'toAirline': '',
						'content': '.TICKETING MAY BE REQUIRED BY FARE RULE',
						'time': {'raw': '1317', 'parsed': '13:17'},
						'date': {'raw': '28AUG', 'parsed': '08-28'},
					},
				],
			},
		]);

		// wrapped remark, before wrapLinesAt
		list.push([
			php.implode(php.PHP_EOL, [
				'** THIS BF IS CURRENTLY IN USE **',
				' G8T- TRAVELPACK MARKETING   L LON',
				'J17BRP/WS QSBIV VTL9WS  AG 91291233 29AUG',
				'  1.1BOBMANUEL/IBINABONIMISOEREHUCHINSON',
				' 1. UA    4 K  17SEP LHRIAH HK1   140P   550P O*       E MO',
				' 2. UA    5 K  15OCT IAHLHR HK1   820P #1135A O*       E MO',
				'FONE-SFOR*800-750-2238 ASAP CUSTOMER SUPPORT',
				'TKTG-TAU/WE29AUG',
				'NOTE-',
				'  1. GD-ARCHIE FOULER/8388/FOR ARCHIE FOULER/8388/LEAD-9142354 I     N G8T WS 29AUG 1257Z',
				'VLOC-UA*IFHE3K/29AUG 1257',
			]),
			{
				'remarks': [
					{
						'lineNumber': '1',
						'remarkType': 'CMS_LEAD_REMARK',
						'data': {
							'agentLogin': 'ARCHIE FOULER',
							'agentId': '8388',
							'leadOwnerLogin': 'ARCHIE FOULER',
							'leadOwnerId': '8388',
							'leadId': '9142354',
							'pcc': 'G8T',
						},
					},
				],
			},
		]);

		// wrapped remark first line has no trailing whitespace, because
		// of that PCC gets glued to the "IN" after unwrapping
		// should pad wrapped line to 64 characters
		list.push([
			php.implode(php.PHP_EOL, [
				'80DJ- INTERNATIONAL TRAVEL NET LON',
				'R92TJ0/WS QSBIV VTL9WS  AG 99999992 30AUG',
				'  1.1HUNTERBLAIRRODRIGUEZ/NICOLEANDREA',
				'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
				'** VENDOR REMARKS DATA EXISTS **       >*VR;',
				'** SERVICE INFORMATION EXISTS **       >*SI;',
				'FONE-SFOR*800-750-2238 ASAP CUSTOMER SUPPORT',
				'NOTE-',
				'  1. GD-ELON CLARK/100691/FOR ELON CLARK/100691/LEAD-9151830 IN',
				'     80DJ WS 30AUG 1732Z',
			]),
			{
				'remarks': [
					{
						'lineNumber': '1',
						'remarkType': 'CMS_LEAD_REMARK',
						'data': {
							'agentLogin': 'ELON CLARK',
							'agentId': '100691',
							'leadOwnerLogin': 'ELON CLARK',
							'leadOwnerId': '100691',
							'leadId': '9151830',
							'pcc': '80DJ',
						},
					},
				],
			},
		]);

		// >*R.SI.VL; - "** SPECIAL SERVICE REQUIREMENT **" got glued to the NOTE text,
		// possibly because it is exactly 64 characters, should wrap by 64 when determining
		// section, but not wrap all text, since VENDOR REMARKS have no indentation
		list.push([
			php.implode(php.PHP_EOL, [
				"** THIS BF IS CURRENTLY IN USE **",
				"HBJZLE/WS QSBIV VTL9WS  AG 05578602 21MAY",
				"  1.1FROMMEYER/ALICIAMICHELLE",
				" 1. DY 7060 V  12JUN MCOCDG HK1   830P #1110A O*       E WE",
				" 2. TUR ZZ BK1  YYZ 22MAR-PRESERVEPNR",
				"** FILED FARE DATA EXISTS **           >*FF;",
				"** VENDOR LOCATOR DATA EXISTS **       >*VL;",
				"** SERVICE INFORMATION EXISTS **       >*SI;",
				"** TINS REMARKS EXIST **               >*HTI;",
				"** ELECTRONIC DATA EXISTS **           >*HTE;",
				"FONE-SFOT:800-750-2238 ASAP CUSTOMER SUPPORT",
				"FOP -CAXXXXXXXXXXXX0007/D0423",
				"TKTG-T*QSB 22MAY1108Z WS AG",
				"NOTE-",
				"  1. GD-MAX/426/FOR MAX/426/LEAD-11534008 IN 711M WS 21MAY 2009Z** SPECIAL SERVICE REQUIREMENT **",
				"SEGMENT/PASSENGER RELATED",
				"S 1. DY  7060 V  12JUN MCOCDG",
				"    P 1. FROMMEYER/ALICI| SPML KK 1  STANDARD",
				"                          TKNE HK 1  3287307939100C1",
				"NO OSI EXISTS",
				"** MANUAL SSR DATA **",
				"  1. SSRCTCEDY HK  1 /REBECCA.SIMPSON//KRATOSDEFENSE.COM-1FROMM-                     EYER/ALICIAMICHELLE",
				"  2. SSRCTCMDY HK  1 /14076818511-1FROMMEYER/ALICIAMICHELLE",
				"  3. SSRDOCSDY HK  1 /////06NOV81/M//FROMMEYER/ALICIA/MICHELLE--                     1FROMMEYER/ALICIAMICHELLE",
				"VLOC-1A*RWXN8E/21MAY 2009",
			]),
			{
				'remarks': [
					{
						'lineNumber': '1',
						'remarkType': 'CMS_LEAD_REMARK',
						'data': {
							'agentLogin': 'MAX',
							'agentId': '426',
							'leadOwnerLogin': 'MAX',
							'leadOwnerId': '426',
							'leadId': '11534008',
							'pcc': '711M',
						},
					},
				],
				'ssrSegments': [
					{segmentNumber: '1', airline: 'DY', flightNumber: '7060'},
				],
			},
		]);

		// >*R.VL.SI; - same, but this time it is VLOC section glued to the NOTE
		list.push([
			php.implode(php.PHP_EOL, [
				"** THIS BF IS CURRENTLY IN USE **",
				"HBJZLE/WS QSBIV VTL9WS  AG 05578602 21MAY",
				"  1.1FROMMEYER/ALICIAMICHELLE",
				" 1. DY 7060 V  12JUN MCOCDG HK1   830P #1110A O*       E WE",
				" 2. TUR ZZ BK1  YYZ 22MAR-PRESERVEPNR",
				"** FILED FARE DATA EXISTS **           >*FF;",
				"** VENDOR LOCATOR DATA EXISTS **       >*VL;",
				"** SERVICE INFORMATION EXISTS **       >*SI;",
				"** TINS REMARKS EXIST **               >*HTI;",
				"** ELECTRONIC DATA EXISTS **           >*HTE;",
				"FONE-SFOT:800-750-2238 ASAP CUSTOMER SUPPORT",
				"FOP -CAXXXXXXXXXXXX0007/D0423",
				"TKTG-T*QSB 22MAY1108Z WS AG",
				"NOTE-",
				"  1. GD-MAX/426/FOR MAX/426/LEAD-11534008 IN 711M WS 21MAY 2009ZVLOC-1A*RWXN8E/21MAY 2009",
				"** SPECIAL SERVICE REQUIREMENT **",
				"SEGMENT/PASSENGER RELATED",
				"S 1. DY  7060 V  12JUN MCOCDG",
				"    P 1. FROMMEYER/ALICI| SPML KK 1  STANDARD",
				"                          TKNE HK 1  3287307939100C1",
				"NO OSI EXISTS",
				"** MANUAL SSR DATA **",
				"  1. SSRCTCEDY HK  1 /REBECCA.SIMPSON//KRATOSDEFENSE.COM-1FROMM-                     EYER/ALICIAMICHELLE",
				"  2. SSRCTCMDY HK  1 /14076818511-1FROMMEYER/ALICIAMICHELLE",
				"  3. SSRDOCSDY HK  1 /////06NOV81/M//FROMMEYER/ALICIA/MICHELLE--                     1FROMMEYER/ALICIAMICHELLE",
			]),
			{
				'remarks': [
					{
						'lineNumber': '1',
						'remarkType': 'CMS_LEAD_REMARK',
						'data': {
							'agentLogin': 'MAX',
							'agentId': '426',
							'leadOwnerLogin': 'MAX',
							'leadOwnerId': '426',
							'leadId': '11534008',
							'pcc': '711M',
						},
					},
				],
				'vlocData': [
					{recordLocator: 'RWXN8E'},
				],
			},
		]);

		return list;
	}

	/**
	 * @test
	 * @dataProvider provideTestCases
	 */
	testParser(input, expected) {
		let actual = PnrParser.parse(input);
		try {
			this.assertArrayElementsSubset(expected, actual, '', true);
		} catch (exc) {
			let args = process.argv.slice(process.execArgv.length + 2);
			if (args.includes('debug')) {
				console.log('\n$actual\n', JSON.stringify({...actual}));
			}
			throw exc;
		}
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testParser],
		];
	}
}

PnrParserTest.count = 0;
module.exports = PnrParserTest;
