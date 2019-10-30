

const AirAvailabilityParser = require('../../../src/text_format_processing/apollo/AirAvailabilityParser.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

class AirAvailabilityParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js')
{
	provideDumps()  {
		let list = [];
		list.push([
			php.implode(php.PHP_EOL, [
				'NEUTRAL DISPLAY*   SA 10MAR NYCLON+ 5:00 HR                     ',
				'1+ AA6143 F7 A7 J7 R7 D7 I7 W7 P7 Y7 H7+JFKLHR 805A  750P 744* 0',
				'2+ AY5478 F9 A3 J9 C9 D9 I9 W9 E9 T2 Y9+JFKLHR 805A  750P 744* 0',
				'3* EI8878 J9 C9 I9 D9 Y9 B9 H9 G9 K9 M9+JFKLHR 805A  750P 744* 0',
				'4* IB4618 F9 J9 C9 D9 R9 I9 W9 E9 T9 Y9+JFKLHR 805A  750P 744* 0',
				'5+ BA 178  FLT CANCELLED                JFKLHR 805A  750P 744  0',
				'6+ SQ2526 Z9 C9 J9 U9 D9 S0 T0 P0 Y9 B9+JFKLHR 815A  810P 346* 0',
				'7+ 9W5809 C7 J7 Z7 I7 P7 Y7 M7 T7 U7 N7+JFKLHR 815A  810P 346* 0',
				'8+ DL4371 J9 C9 D9 I9 Z9 P9 A6 G0 Y9 B9+JFKLHR 815A  810P 346* 0',
				'MEALS>A*M\u00B7  CLASSES>A*C\u00B7..',
			]),
			{
				'header': {
					'date': {'raw': '10MAR', 'parsed': '03-10'},
					'departureCity': 'NYC',
					'destinationCity': 'LON',
					'time': {'raw': '5:00', 'parsed': '05:00'},
				},
				'flights': {
					[0]: {
						'lineNumber': 1,
						'airline': 'AA',
						'flightNumber': '6143',
						'aircraft': '744',
						'hiddenStops': 0,
						'departureAirport': 'JFK',
						'destinationAirport': 'LHR',
						'availability': {
							'F': 7, 'A': 7, 'J': 7, 'R': 7, 'D': 7,
							'I': 7, 'W': 7, 'P': 7, 'Y': 7, 'H': 7,
						},
						'flightStatus': 'operational',
						'moreClassesExist': true,
						'departureTime': {'raw': '805A', 'parsed': '08:05'},
						'departureDayOffset': 0,
						'destinationTime': {'raw': '750P', 'parsed': '19:50'},
						'destinationDayOffset': 0,
					},
					[1]: {
						'lineNumber': 2,
						'airline': 'AY',
						'flightNumber': '5478',
						'aircraft': '744',
						'hiddenStops': 0,
						'departureAirport': 'JFK',
						'destinationAirport': 'LHR',
						'availability': {
							'F': 9, 'A': 3, 'J': 9, 'C': 9, 'D': 9,
							'I': 9, 'W': 9, 'E': 9, 'T': 2, 'Y': 9,
						},
						'flightStatus': 'operational',
						'moreClassesExist': true,
					},
					[4]: {
						'lineNumber': 5,
						'airline': 'BA',
						'flightNumber': '178',
						'aircraft': '744',
						'hiddenStops': 0,
						'departureAirport': 'JFK',
						'destinationAirport': 'LHR',
						'availability': [],
						'flightStatus': 'cancelled',
						'moreClassesExist': false,
					},
				},
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'NEUTRAL DISPLAY*   SA 10MAR RIXLAX-10:00 HR                     ',
				'3* BT 617 C4 D4 J4 Y4 S4 M4 B4 H4 O4 Q4 RIXAMS 735A  900A CS3  0',
				'          V0 E4 A4 W4 Z4 U2 P0 K0 L0 F0 T0 G0                   ',
				'4* KL 601 J9 C9 D5 I0 Z0 Y9 B9 M9 U9 K9    LAX 950A 1150A 74E  0',
				'          H9 L9 Q9 T9 E0 N9 R9 V0                               ',
				'MEALS>A*M\u00B7  CURRENT>A*C\u00B7',
			]),
			{
				'flights': [
					{
						'lineNumber': 3,
						'airline': 'BT',
						'flightNumber': '617',
						'aircraft': 'CS3',
						'hiddenStops': 0,
						'departureAirport': 'RIX',
						'destinationAirport': 'AMS',
						'availability': {
							'C': 4, 'D': 4, 'J': 4, 'Y': 4, 'S': 4,
							'M': 4, 'B': 4, 'H': 4, 'O': 4, 'Q': 4,
							'V': 0, 'E': 4, 'A': 4, 'W': 4, 'Z': 4,
							'U': 2, 'P': 0, 'K': 0, 'L': 0, 'F': 0,
							'T': 0, 'G': 0,
						},
						'flightStatus': 'operational',
						'moreClassesExist': false,
					},
					{
						'lineNumber': 4,
						'airline': 'KL',
						'flightNumber': '601',
						'aircraft': '74E',
						'hiddenStops': 0,
						'departureAirport': '',
						'destinationAirport': 'LAX',
						'availability': {
							'J': 9, 'C': 9, 'D': 5, 'I': 0, 'Z': 0,
							'Y': 9, 'B': 9, 'M': 9, 'U': 9, 'K': 9,
							'H': 9, 'L': 9, 'Q': 9, 'T': 9, 'E': 0,
							'N': 9, 'R': 9, 'V': 0,
						},
						'flightStatus': 'operational',
						'moreClassesExist': false,
					},
				],
				'navigationCommands': [
					{'label': 'MEALS', 'command': 'A*M'},
					{'label': 'CURRENT', 'command': 'A*C'},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'|ET       DISPLAY* FR 01DEC LOSNYC- 6:00 HR                     ',
				'1| ET1045 C7 J7 D7 P7 Y7 G7 S7 B7 M7 K7|LOSLFW1125A 1115A 737* 0',
				'2| ET 508 C7 J7 D7 P3 R0 Y7 G7 S7 B7 M7|   EWR1230P  615P 788  0',
				'NO MORE LATER FLIGHTS 01DEC',
				'HILTON GARDEN INN * NEW YORK RTS FROM 159 US             >AH*1; ',
				'74627 HYATT REGENCY MORRISTOWN*WI-FI* >> 139 USD         >AH*2; ',
				'MEALS>A*M;  CLASSES>A*C;..  ><',
			]),
			{
				'flights': [
					{
						'lineNumber': 1,
						'airline': 'ET',
						'flightNumber': '1045',
						'flightStatus': 'operational',
						'availability': {
							'C': 7, 'J': 7, 'D': 7, 'P': 7, 'Y': 7,
							'G': 7, 'S': 7, 'B': 7, 'M': 7, 'K': 7,
						},
						'moreClassesExist': true,
						'departureAirport': 'LOS',
						'destinationAirport': 'LFW',
						'aircraft': '737',
						'hiddenStops': 0,
					},
					{
						'lineNumber': 2,
						'airline': 'ET',
						'flightNumber': '508',
						'flightStatus': 'operational',
						'availability': {
							'C': 7, 'J': 7, 'D': 7, 'P': 3, 'R': 0,
							'Y': 7, 'G': 7, 'S': 7, 'B': 7, 'M': 7,
						},
						'moreClassesExist': true,
						'departureAirport': '',
						'destinationAirport': 'EWR',
						'aircraft': '788',
						'hiddenStops': 0,
					},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'|DL       DISPLAY* SU 17DEC CLEJNB| 7:00 HR                     ',
				'1| DL2528 F9 P0 A0 G0 W9 Y9 B9 M9|CLEATL  255P  453P M90 18:3560',
				'2| DL 200 J9 C9 D4 I0 Z0 W0 Y9 B9|   JNB  619P  430P|77L       0',
				'3| DL1474 F9 P5 A5 G5 W9 Y9 B9 M9|CLEATL 1230P  232P M90 21:0080',
				'4| DL 200 J9 C9 D6 I1 Z0 W0 Y9 B9|   JNB  619P  430P|77L       0',
				'5| DL2232 F9 P0 A0 G0 W9 Y9 B9 M9|CLEATL 1050A 1251P M90 22:4080',
				'6| DL 200 J9 C9 D6 I1 Z0 W0 Y9 B9|   JNB  619P  430P|77L       0',
				'7| DL1743 F9 P3 A3 G3 W9 Y9 B9 M9|CLEATL  845A 1051A M90 24:4580',
				'8| DL 200 J9 C9 D6 I1 Z0 W0 Y9 B9|   JNB  619P  430P|77L       0',
				'MEALS>A*M;  CLASSES>A*C;..  ><',
			]),
			{
				'flights': [
					{
						'lineNumber': 1,
						'airline': 'DL',
						'flightNumber': '2528',
						'flightStatus': 'operational',
						'availability': {'F': 9, 'P': 0, 'A': 0, 'G': 0, 'W': 9, 'Y': 9, 'B': 9, 'M': 9},
						'moreClassesExist': true,
						'departureAirport': 'CLE',
						'destinationAirport': 'ATL',
						'aircraft': 'M90',
						'hiddenStops': 0,
					},
					{
						'lineNumber': 2,
						'airline': 'DL',
						'flightNumber': '200',
						'flightStatus': 'operational',
						'availability': {'J': 9, 'C': 9, 'D': 4, 'I': 0, 'Z': 0, 'W': 0, 'Y': 9, 'B': 9},
						'moreClassesExist': true,
						'departureAirport': '',
						'destinationAirport': 'JNB',
						'departureTime': {'raw': '619P', 'parsed': '18:19'},
						'departureDayOffset': 0,
						'destinationTime': {'raw': '430P', 'parsed': '16:30'},
						'destinationDayOffset': 1,
						'aircraft': '77L',
						'hiddenStops': 0,
					},
					// ...
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'NEUTRAL DISPLAY*   TH 13SEP CHISEL|14:00 HR                     ',
				'1| DL7862 F4 J9 C9 D9 I9 Z9 Y9 B9 M9 H9|ORDICN1235P  425P|77W* 0',
				'2| KE  38 R7 A2 J9 C9 D9 I9 Z9 Y9 B9 M9|ORDICN1235P  425P|77W  0',
				'3| UA7315 J4 C4 D4 Z4 Y7 B7 M7 E7 U7 H7|ORDICN1155P  400A277L* 0',
				'4* OZ 235 J9 C9 D9 Z9 U9 Y9 B9 M9 H9 E9|ORDICN1155P  400A277L  0',
				'5| DL 714 F9 P9 A9 G9 W9 Y9 B9 M9 H9 Q9|ORDDTW1055A  115P 717 90',
				'6| DL 159 J9 C9 D9 I9 Z9 F9 P9 A9 G9 Y9|   ICN 154P  430P|359  0',
				'7| AC8039 J9 C9 D9 Z9 P9 R9 Y9 B9 M9 U9|ORDYVR 730A 1000A CR9* 0',
				'8| AC  63 J9 C9 D9 Z9 P9 R3 O9 E9 N9 Y9|   ICN1100A  155P|789  0',
				'MEALS>A*M;  CLASSES>A*C;..  ><',
			]),
			{
				'flights': [
					{'lineNumber': 1, 'airline': 'DL', 'flightNumber': '7862'},
					{'lineNumber': 2, 'airline': 'KE', 'flightNumber': '38'},
					{'lineNumber': 3, 'airline': 'UA', 'flightNumber': '7315',
						'departureTime': {'raw': '1155P', 'parsed': '23:55'},
						'departureDayOffset': 0,
						'destinationTime': {'raw': '400A', 'parsed': '04:00'},
						'destinationDayOffset': 2,
						'aircraft': '77L',
					},
					{'lineNumber': 4, 'airline': 'OZ', 'flightNumber': '235'},
					{'lineNumber': 5, 'airline': 'DL', 'flightNumber': '714'},
					{'lineNumber': 6, 'airline': 'DL', 'flightNumber': '159'},
					{'lineNumber': 7, 'airline': 'AC', 'flightNumber': '8039'},
					{'lineNumber': 8, 'airline': 'AC', 'flightNumber': '63'},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'NEUTRAL DISPLAY*   TH 08FEB LONDFW- 6:00 HR                     ',
				'1| AY5493 F8 A8 J9 C4 D1 I0 W9 E5 T0 Y9|LHRDFW1030A  245P 744* 0',
				'2| BA1520  FLT CANCELLED                LHRDFW 210P  635P 77W* 0',
				'3* IB4205 J7 C1 D1 R0 I0 Y7 B7 H7 K7 M7|LHRDFW 210P  635P 77W* 0',
				'4| AY5779 F0 A0 J9 C0 D0 I0 Y9 B9 H9 K9|LHRDFW 210P  635P 77W* 0',
				'5* GF4387 J4 CR DR IR Y4 H4 M4 L4 B4 K4|LHRDFW 210P  635P 77W* 0',
				'6| AA  79 F0 A0 J7 R1 D0 I0 Y7 B0 H7 K7|LHRDFW 210P  635P 77W  0',
				'7| DL  31 J5 C5 D1 I1 Z0 W5 Y9 B9 M9 H9|LHRDFW1230P  853P CHG 91',
				'NO MORE LATER FLIGHTS 08FEB',
				'MEALS>A*M;  CLASSES>A*C;..  ><',
			]),
			{
				'flights': [
					{'lineNumber': 1, 'airline': 'AY', 'flightNumber': '5493'},
					{'lineNumber': 2, 'airline': 'BA', 'flightNumber': '1520'},
					{'lineNumber': 3, 'airline': 'IB', 'flightNumber': '4205'},
					{'lineNumber': 4, 'airline': 'AY', 'flightNumber': '5779'},
					{'lineNumber': 5, 'airline': 'GF', 'flightNumber': '4387',
						'flightStatus': 'operational',
						'availability': {
							'J': 4, 'C': 'R', 'D': 'R', 'I': 'R', 'Y': 4,
							'H': 4, 'M': 4, 'L': 4, 'B': 4, 'K': 4,
						},
						'moreClassesExist': true,
						'departureAirport': 'LHR',
						'destinationAirport': 'DFW',
						'aircraft': '77W',
						'hiddenStops': 0,
					},
					{'lineNumber': 6, 'airline': 'AA', 'flightNumber': '79'},
					{'lineNumber': 7, 'airline': 'DL', 'flightNumber': '31'},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'NEUTRAL DISPLAY*   MO 17SEP KMGCRK| 0:00 HR                     ',
				'1| MU2003 U0 F0 P0 J0 C0 D0 Q0 I0 W0 Y0|KMGICN1030A  315P 738  0',
				'2* OZ 707 C9 D9 Z6 U4 Y9 B9 M9 H9 E9 Q9|   CRK 930P 1225A|321  0',
				'3* 8L 841 Y0 B0 K0 M0 Q0 H0 X0 L0 U0 E0|KMGMNL1215A  340A 737  0',
				'4# DG6041 W  E  R  I  O  P  A  S  D  F |   USU 615A  730A AT7  0',
				'5| PR2685 Y7 S7 L7 M7 H7 Q7 V7 B7 X7 K7|   CRK 920A 1020A DH4* 0',
				'6* 8L 801 Y9 B9 K9 M9 Q9 H9 X9 L9 U9 E9|KMGBKK 625P  745P 320  0',
				'7| SQ 981 Z9 C9 J9 U9 D8 Y9 B9 E9 M9 H9|   SIN 900P 1225A|333  0',
				'8: 3K 777 Y4 B4 V4 T4 S4 R4 Q4 P4 O4 N4|   CRK 220A| 600A|320  0',
				'MEALS>A*M;  CLASSES>A*C;..  ><',
			]),
			{
				'flights': [
					{'lineNumber': 1},
					{'lineNumber': 2},
					{'lineNumber': 3},
					{'lineNumber': 4},
					{'lineNumber': 5},
					{'lineNumber': 6},
					{'lineNumber': 7},
					{'lineNumber': 8},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'NEUTRAL DISPLAY*   FR 14SEP SELCRK- 1:00 HR                     ',
				'1| KE5763 Y9 B9 M9 S9 H9 E9 K9 L9 U9 Q9|ICNCRK 925P 1225A|738* 0',
				'2* OZ 707 C9 D9 Z6 U4 Y9 B9 M9 H9 E9 Q9|ICNCRK 930P 1225A|321  0',
				'3# Z2  37 S  X                          ICNKLO 655A 1010A 320  0',
				'4# Z2 100 S  X                             CRK1200N  110P 320  0',
				'5* OZ9291 Y0 B4 M4 H4 E4 Q4 K4 S4 V4    ICNHKG1135P  205A|320* 0',
				'6| KA 375 Y9 B9 H9 K9 M9 L9 V9 S9 N9 Q9|   CRK 800A|1000A|321  0',
				'7* OZ9291 Y0 B4 M4 H4 E4 Q4 K4 S4 V4    ICNHKG1135P  205A|320* 0',
				'8| CX5375 Y9 B9 H9 K9 M9 L9 V9 S9 N9 Q9|   CRK 800A|1000A|321* 0',
				'MEALS>A*M;  CLASSES>A*C;..  ><',
			]),
			{
				'flights': [
					{'lineNumber': 1},
					{'lineNumber': 2},
					{'lineNumber': 3},
					{'lineNumber': 4},
					{'lineNumber': 5},
					{'lineNumber': 6},
					{'lineNumber': 7},
					{'lineNumber': 8},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'NEUTRAL DISPLAY*   SA 16JUN JNBDUR| 0:00 HR                     ',
				'1| BA6215 J9 C9 D9 R9 I9 Y9 B9 H9 K9 M9|JNBDUR1035A 1140A 734* 0',
				'2  JE 251 Y4 Z4 A4 U4 S4 B4 M9 P4 D4 I4|JNBDUR1130A 1240P 738  0',
				'3| SA2039 Y4 B4 M4 K4 H4 Q0 V0 L0 W0 G0 JNBDUR1130A 1240P 738* 0',
				'4| SA2045 Y4 B4 M4 K4 H4 Q4 V0 L0 W0 G0 JNBDUR 130P  240P 738* 0',
				'5  JE 253 Y4 Z4 A4 U4 S4 B4 M9 P4 D4 I4|JNBDUR 130P  240P 738  0',
				'6@ MN 615 Y4 B4 H4 K4 V4 S4 Q4 O4 I4 E4|JNBDUR 135P  240P 738* 0',
				'7  JE 257 Y4 Z4 A4 U4 S4 B4 M9 P4 D4 I4|JNBDUR 255P  405P 738  0',
				'8| SA2055 Y4 B4 M4 K4 H4 Q4 V0 L0 W0 G0 JNBDUR 255P  405P 738* 0',
				'MEALS>A*M;  CLASSES>A*C;..  ><',
			]),
			{
				'flights': [
					{'lineNumber': 1},
					{'lineNumber': 2},
					{'lineNumber': 3},
					{'lineNumber': 4},
					{'lineNumber': 5},
					{'lineNumber': 6},
					{'lineNumber': 7},
					{'lineNumber': 8},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'NEUTRAL DISPLAY*   MO 12FEB LPLORL- 5:00 HR                     ',
				'1: 9B 212 S4                            LXCMAN1045A 1145A BUS* 0',
				'2* FI 441 C0 D0 J0 Z0 Y1 A0 E0 M0 B0 K0|   KEF1225P  300P 75T  0',
				'3* FI 689 C9 D9 J0 Z0 Y9 A6 E6 M9 B6 K6|   MCO 515P  810P 75W  0',
				'4: 9B 212 S4                            LXCMAN1045A 1145A BUS* 0',
				'5* FI 441 C0 D0 J0 Z0 Y1 A0 E0 M0 B0 K0|   KEF1225P  300P 75T  0',
				'6* B65689 J7 D7 I0 Y7 E7 K7 H7 Q7 B7 V7|   MCO 515P  810P 75W* 0',
				'MEALS>A*M;  CLASSES>A*C;..  ><',
			]),
			{
				'flights': [
					{'lineNumber': 1},
					{'lineNumber': 2},
					{'lineNumber': 3},
					{'lineNumber': 4},
					{'lineNumber': 5},
					{'lineNumber': 6},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'FIRAV              MO 12MAR SAVFLR| 5:00 HR                     ',
				'1| UA2407 F9 C9 A9 D9 Z9 P9 Y9 B9 M9 E9 SAVEWR 610A  826A 73G 90',
				'          U9 H9 Q9 V9 W9 S9 T9 L9 K9 G0 N9                      ',
				'2| LH 413 F6 A6 J9 C9 D9 Z9 P9 G9 E7 N6    MUC 945P 1030A|346  0',
				'          Y9 B9 M9 U9 H9 Q9 V9 W9 S9 T9 L9 K9                   ',
				'3| LH9438 J9 C9 D9 Z9 P9 Y9 B9 M9 U9 H9    FLR1145A| 100P|E95* 0',
				'          Q9 V9 W9 S9 T9 L9 K9                                  ',
				'2 SPECIAL PROMO *SMART DEAL* AND *UNDER THE TUSCAN SUN*  >AH*1; ',
				'YX20424*CONTINENTALE*MODERN HOTEL*FLR*  >> 190 EUR       >AH*2; ',
				'MEALS>A*M;  ><',
			]),
			{
				'flights': [
					{'lineNumber': 1},
					{'lineNumber': 2},
					{'lineNumber': 3},
				],
				'navigationCommands': [
					{'label': 'MEALS', 'command': 'A*M'},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'NEUTRAL DISPLAY*   WE 31JAN MEXDEN- 1:00 HR                     ',
				'1| AC1983  PAST SKED DEPARTURE          MEXYYZ1220A  545A 319* 0',
				'2| AC1037  PAST SKED DEPARTURE             DEN 810A  949A E90  0',
				'3| AC1983  PAST SKED DEPARTURE          MEXYYZ1220A  545A 319* 0',
				'4| AC4902 J0 C0 D0 Z0 P0 Y4 B0 M0 U0 H0|   DEN 755A 1000A CR7* 0',
				'5| AA1066  FLT DEPARTED                 MEXDFW 600A  850A 738  0',
				'6| AA2215  FLT DEPARTED                    DEN1045A 1157A 32B 80',
				'7| UA1085  FLT DEPARTED                 MEXIAH 630A  849A 738  0',
				'8| UA1874  FLT DEPARTED                    DEN1155A  130P 320 90',
				'16233 CY DEN CHERRY CREEK*RENOVATED* >> 139 USD          >AH*1; ',
				'74327 DT DEN WESTMINSTER*NEWLY RENOV* >> 124 USD         >AH*2; ',
				'MEALS>A*M;  CLASSES>A*C;..  ><',
			]),
			{
				'flights': [
					{'lineNumber': 1},
					{'lineNumber': 2},
					{'lineNumber': 3},
					{'lineNumber': 4},
					{'lineNumber': 5},
					{'lineNumber': 6},
					{'lineNumber': 7},
					{'lineNumber': 8},
				],
				'hotelOffers': [
					{
						'message': '16233 CY DEN CHERRY CREEK*RENOVATED*',
						'amount': '139',
						'currency': 'USD',
						'command': 'AH*1',
					},
					{
						'message': '74327 DT DEN WESTMINSTER*NEWLY RENOV*',
						'amount': '124',
						'currency': 'USD',
						'command': 'AH*2',
					},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'NEUTRAL DISPLAY*   WE 07FEB BJSCKG| 0:00 HR                     ',
				'1| CA4144 F8 A0 Y9 B0 M0 U0 H0 Q0 V0 W0|PEKCKG 700P  955P 73G  0',
				'2* ZH4144                               PEKCKG 700P  955P 73G* 0',
				'3* ZH4142                               PEKCKG 600P  910P 738* 0',
				'4| CA4142 F7 A0 Y9 B0 M0 U0 H0 Q0 V0 W0|PEKCKG 600P  910P 738  0',
				'5| CA 986 F8 A0 J9 C4 D0 Z0 R0 Y9 B0 M0|PEKCKG 830P 1130P 773  0',
				'6| CA1156 F8 O1 Y9 B9 M0 U0 H0 Q0 V0 W0|PEKCKG 925P 1225A|738* 0',
				'7* SC1156 F4 AR Y4 B4 MR HR KR LR PR QR|PEKCKG 925P 1225A|738  0',
				'8* 3U8834 F4 I2 J2 P4 Y4 T4 H4 G0 S0 L0|PEKCKG1000P  100A|321  0',
				'MEALS>A*M;  CLASSES>A*C;..  ><',
			]),
			{
				'flights': [
					{'lineNumber': 1},
					{'lineNumber': 2},
					{'lineNumber': 3},
					{'lineNumber': 4},
					{'lineNumber': 5},
					{'lineNumber': 6},
					{'lineNumber': 7},
					{'lineNumber': 8},
				],
				'navigationCommands': [
					{'label': 'MEALS', 'command': 'A*M'},
					{'label': 'CLASSES', 'command': 'A*C'},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'NO MORE LATER FLIGHTS 18OCT',
				'><',
			]),
			{'flights': []},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				' NO DISPLAYABLE FLIGHTS',
				'><',
			]),
			{'flights': []},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'NO FIRAV \/ T CLS FROM THIS CARRIER',
				'>A\/ T1 \/17OCTCRKCHI|;',
				'><',
			]),
			{'flights': []},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'CK DTE ',
				'><',
			]),
			{'flights': []},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'CK FRMT',
				'><',
			]),
			{'flights': []},
		]);
		return list;
	}

	/**
     * @test
     * @dataProvider provideDumps
     */
	testParser($dump, $expected)  {
		let $actual, $exc;
		$actual = AirAvailabilityParser.parse($dump);
		try {
			this.assertArrayElementsSubset($expected, $actual);
		} catch ($exc) {
			throw $exc;
		}
	}

	getTestMapping() {
		return [
			[this.provideDumps, this.testParser],
		];
	}
}
module.exports = AirAvailabilityParserTest;
