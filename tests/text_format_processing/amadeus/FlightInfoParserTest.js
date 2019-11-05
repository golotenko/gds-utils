
const php = require('enko-fundamentals/src/Transpiled/php.js');
const FlightInfoParser = require('../../../src/text_format_processing/amadeus/FlightInfoParser.js');

class FlightInfoParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js') {
	// "DO1-2" to get hidden stop info for segments "1" through "2"
	provideDumps() {
		let $list;

		$list = [];

		// hidden stops in segment
		// '  2  DL 275 Y 10SEP 7*DTWMNL DK1  1210P 855P 11SEP  E  1 EQV D',
		// '     ADVISE PSGRS OF CHNG OF EQUIP IN NRT FROM 744 TO 76W',
		// '     DELTA ONE SVC THIS FLT',
		// '     SEE RTSVC',
		// >AD10SEPATLMNL/XDTW/ADL; >SS1Y1; >DO1-3; for all segments in the PNR
		$list.push([
			php.implode(php.PHP_EOL, [
				'DO1-3',
				'*1A PLANNED FLIGHT INFO*              DL 201   72 SA 09SEP17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'ATL          0745  SU JCDIZWYBMHQ/N       73H         1:59      ',
				'                      KLUTXVE/N                                 ',
				'DTW 0944  SU                                                1:59',
				'',
				'COMMENTS-',
				' 1.ATL DTW   - DEPARTS TERMINAL S                               ',
				' 2.ATL DTW   - ARRIVES TERMINAL EM                              ',
				' 3.ATL DTW   - MCT FLIGHT TRACKING D/D                          ',
				' 4.ATL DTW   - ON-TIME PERF 9DEC16                              ',
				' 5.ATL DTW   -   3/ ENTERTAINMENT ON DEMAND                     ',
				' 6.ATL DTW   -   5/ LIVE TV                                     ',
				' 7.ATL DTW   -  12/ IN-SEAT POWER SOURCE                        ',
				' 8.ATL DTW   -  15/ IN-SEAT VIDEO PLAYER/LIBRARY                ',
				' 9.ATL DTW   -  18/ WI-FI                                       ',
				'10.ATL DTW   -  99/ AMENITIES SUBJECT TO CHANGE                 ',
				'11.ATL DTW   - SECURED FLIGHT                                   ',
				'12.ATL DTW   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
				'13.ATL DTW   -  CO2/PAX* 101.25 KG ECO, 101.25 KG PRE           ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               73H  NO CONFIGURATION SET                        ',
				'*1A PLANNED FLIGHT INFO*              DL 275   73 SU 10SEP17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'DTW          1210  SU JCDIZ/M  WY/D       744        13:05      ',
				'                      BMHQKLUTXVE/D                             ',
				'NRT 1415  MO 1650  MO JCDIZWYBMHQ/D       76W   2:35  5:05      ',
				'                      KLUTXVE/D                                 ',
				'MNL 2055  MO                                               20:45',
				'',
				'COMMENTS-',
				' 1.DTW NRT   - DEPARTS TERMINAL EM                              ',
				' 2.NRT MNL   - DEPARTS TERMINAL 1                               ',
				' 3.DTW NRT   - ARRIVES TERMINAL 1                               ',
				' 4.NRT MNL   - ARRIVES TERMINAL 3                               ',
				' 5.DTW NRT   - MCT FLIGHT TRACKING I/I                          ',
				' 6.DTW MNL   - MCT FLIGHT TRACKING I/I                          ',
				' 7.NRT MNL   - MCT FLIGHT TRACKING I/I                          ',
				' 8.DTW NRT   -   1/ MOVIE                                       ',
				' 9.DTW NRT   -   3/ ENTERTAINMENT ON DEMAND                     ',
				'10.DTW NRT   -  12/ IN-SEAT POWER SOURCE                        ',
				'11.DTW NRT   -  15/ IN-SEAT VIDEO PLAYER/LIBRARY                ',
				'12.DTW NRT   -  18/ WI-FI                                       ',
				'13.ENTIRE FLT-  20/ LIE-FLAT SEAT BUSINESS                      ',
				'14.ENTIRE FLT-  99/ AMENITIES SUBJECT TO CHANGE                 ',
				'15.ENTIRE FLT- SECURED FLIGHT                                   ',
				'16.ENTIRE FLT-  ET/ ELECTRONIC TKT CANDIDATE                    ',
				'17.DTW MNL   -  CO2/PAX* 757.09 KG ECO, 1,514.17 KG PRE         ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               744  NO CONFIGURATION SET                        ',
			]),
			{
				'segments': [
					{
						'airline': 'DL',
						'flightNumber': '201',
						'unparsedToken1': '72',
						'dayOfWeek': {'raw': 'SA'},
						'departureDate': {'parsed': '2017-09-09'},
						'legs': [
							{
								'departureAirport': 'ATL',
								'departureTime': {'parsed': '07:45'},
								'departureDayOfWeek': {'raw': 'SU'},
								'meals': [
									{
										'bookingClasses': ['J', 'C', 'D', 'I', 'Z', 'W', 'Y', 'B', 'M', 'H', 'Q'],
										'raw': 'N',
										'parsed': ['NO_MEAL_SVC'],
									},
									{
										'bookingClasses': ['K', 'L', 'U', 'T', 'X', 'V', 'E'],
										'raw': 'N',
										'parsed': ['NO_MEAL_SVC'],
									},
								],
								'aircraft': '73H',
								'flightDuration': '1:59',
								'destinationAirport': 'DTW',
								'destinationTime': {'parsed': '09:44'},
								'destinationDayOfWeek': {'raw': 'SU'},
							},
						],
						'travelDuration': '1:59',
						'comments': [
							{'from': 'ATL', 'to': 'DTW', 'raw': 'DEPARTS TERMINAL S'},
							{'from': 'ATL', 'to': 'DTW', 'raw': 'ARRIVES TERMINAL EM'},
							{'from': 'ATL', 'to': 'DTW', 'raw': 'MCT FLIGHT TRACKING D/D'},
							{'from': 'ATL', 'to': 'DTW', 'raw': 'ON-TIME PERF 9DEC16'},
							{'from': 'ATL', 'to': 'DTW', 'raw': '  3/ ENTERTAINMENT ON DEMAND'},
							{'from': 'ATL', 'to': 'DTW', 'raw': '  5/ LIVE TV'},
							{'from': 'ATL', 'to': 'DTW', 'raw': ' 12/ IN-SEAT POWER SOURCE'},
							{'from': 'ATL', 'to': 'DTW', 'raw': ' 15/ IN-SEAT VIDEO PLAYER/LIBRARY'},
							{'from': 'ATL', 'to': 'DTW', 'raw': ' 18/ WI-FI'},
							{'from': 'ATL', 'to': 'DTW', 'raw': ' 99/ AMENITIES SUBJECT TO CHANGE'},
							{'from': 'ATL', 'to': 'DTW', 'raw': 'SECURED FLIGHT'},
							{'from': 'ATL', 'to': 'DTW', 'raw': ' ET/ ELECTRONIC TKT CANDIDATE'},
							{
								'from': 'ATL', 'to': 'DTW', 'raw': php.implode(php.PHP_EOL, [
									' CO2/PAX* 101.25 KG ECO, 101.25 KG PRE',
									' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR',
								])
							},
						],
						'configurations': [
							{'raw': '73H  NO CONFIGURATION SET'},
						],
					},
					{
						'airline': 'DL',
						'flightNumber': '275',
						'unparsedToken1': '73',
						'dayOfWeek': {'raw': 'SU'},
						'departureDate': {'parsed': '2017-09-10'},
						'legs': [
							{
								'departureAirport': 'DTW',
								'departureTime': {'parsed': '12:10'},
								'departureDayOfWeek': {'raw': 'SU'},
								'meals': [
									{
										'bookingClasses': ['J', 'C', 'D', 'I', 'Z'],
										'raw': 'M',
										'parsed': ['MEAL'],
									},
									{
										'bookingClasses': ['W', 'Y'],
										'raw': 'D',
										'parsed': ['DINNER'],
									},
									{
										'bookingClasses': ['B', 'M', 'H', 'Q', 'K', 'L', 'U', 'T', 'X', 'V', 'E'],
										'raw': 'D',
										'parsed': ['DINNER'],
									},
								],
								'aircraft': '744',
								'flightDuration': '13:05',
								'destinationAirport': 'NRT',
								'destinationTime': {'parsed': '14:15'},
								'destinationDayOfWeek': {'raw': 'MO'},
							},
							{
								'departureAirport': 'NRT',
								'departureTime': {'parsed': '16:50'},
								'departureDayOfWeek': {'raw': 'MO'},
								'meals': [
									{
										'bookingClasses': ['J', 'C', 'D', 'I', 'Z', 'W', 'Y', 'B', 'M', 'H', 'Q'],
										'raw': 'D',
										'parsed': ['DINNER'],
									},
									{
										'bookingClasses': ['K', 'L', 'U', 'T', 'X', 'V', 'E'],
										'raw': 'D',
										'parsed': ['DINNER'],
									},
								],
								'aircraft': '76W',
								'groundDuration': '2:35',
								'flightDuration': '5:05',
								'destinationAirport': 'MNL',
								'destinationTime': {'parsed': '20:55'},
								'destinationDayOfWeek': {'raw': 'MO'},
							},
						],
						'travelDuration': '20:45',
						'comments': [
							{'from': 'DTW', 'to': 'NRT', 'raw': 'DEPARTS TERMINAL EM'},
							{'from': 'NRT', 'to': 'MNL', 'raw': 'DEPARTS TERMINAL 1'},
							{'from': 'DTW', 'to': 'NRT', 'raw': 'ARRIVES TERMINAL 1'},
							{'from': 'NRT', 'to': 'MNL', 'raw': 'ARRIVES TERMINAL 3'},
							{'from': 'DTW', 'to': 'NRT', 'raw': 'MCT FLIGHT TRACKING I/I'},
							{'from': 'DTW', 'to': 'MNL', 'raw': 'MCT FLIGHT TRACKING I/I'},
							{'from': 'NRT', 'to': 'MNL', 'raw': 'MCT FLIGHT TRACKING I/I'},
							{'from': 'DTW', 'to': 'NRT', 'raw': '  1/ MOVIE'},
							{'from': 'DTW', 'to': 'NRT', 'raw': '  3/ ENTERTAINMENT ON DEMAND'},
							{'from': 'DTW', 'to': 'NRT', 'raw': ' 12/ IN-SEAT POWER SOURCE'},
							{'from': 'DTW', 'to': 'NRT', 'raw': ' 15/ IN-SEAT VIDEO PLAYER/LIBRARY'},
							{'from': 'DTW', 'to': 'NRT', 'raw': ' 18/ WI-FI'},
							{'entireSegment': true, 'raw': ' 20/ LIE-FLAT SEAT BUSINESS'},
							{'entireSegment': true, 'raw': ' 99/ AMENITIES SUBJECT TO CHANGE'},
							{'entireSegment': true, 'raw': 'SECURED FLIGHT'},
							{'entireSegment': true, 'raw': ' ET/ ELECTRONIC TKT CANDIDATE'},
							{
								'from': 'DTW', 'to': 'MNL', 'raw': php.implode(php.PHP_EOL, [
									' CO2/PAX* 757.09 KG ECO, 1,514.17 KG PRE',
									' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR',
								])
							},
						],
						'configurations': [
							{'raw': '744  NO CONFIGURATION SET'},
						],
					},

				],
			},
		]);

		// apollo>*PVK4WC; - with "-" instead of meal code. Apollo has empty string
		// in place of meal there, so it is either "no info from airline" or "no meal"
		$list.push([
			php.implode(php.PHP_EOL, [
				'DO1-3',
				'*1A PLANNED FLIGHT INFO*              PW 722    4 TU 04JUL17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'NBO          0800  TU YBMUKHLQTEN/-       ATR         1:00      ',
				'                      RVGSXW/-                                  ',
				'JRO 0900  TU 0940  TU YBMUKHLQTEN/-             0:40  1:30      ',
				'                      RVGSXW/-                                  ',
				'MWZ 1110  TU                                                3:10',
				'',
				'COMMENTS-',
				' 1.NBO MWZ   - CLASSES SHOWN YBMUKHLQTENRVGSXW                  ',
				' 2.ENTIRE FLT-  ET/ ELECTRONIC TKT CANDIDATE                    ',
				' 3.ENTIRE FLT- Y70                                              ',
				' 4.NBO MWZ   -  CO2/PAX* 83.76 KG ECO, 83.76 KG PRE             ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               ATR  Y  70                                       ',
				'*1A PLANNED FLIGHT INFO*              PW 727   10 MO 10JUL17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'MWZ          1215  MO YBMUKHLQTEN/-       ATR         1:30      ',
				'                      RVGSXW/-                                  ',
				'JRO 1345  MO 1415  MO YBMUKHLQTEN/-             0:30  1:00      ',
				'                      RVGSXW/-                                  ',
				'NBO 1515  MO                                                3:00',
				'',
				'COMMENTS-',
				' 1.MWZ NBO   - CLASSES SHOWN YBMUKHLQTENRVGSXW                  ',
				' 2.ENTIRE FLT-  ET/ ELECTRONIC TKT CANDIDATE                    ',
				' 3.ENTIRE FLT- Z999                                             ',
				' 4.MWZ NBO   -  CO2/PAX* 78.20 KG ECO, 78.20 KG PRE             ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               ATR  NO CONFIGURATION SET                        ',
				'*1A PLANNED FLIGHT INFO*              KQ 764   10 MO 10JUL17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'NBO          2050  MO JCDIZOYBMUK/M       738         4:15      ',
				'                      HLQTENRVWGX/M                             ',
				'JNB 0005  TU                                                4:15',
				'',
				'COMMENTS-',
				' 1.NBO JNB   - MEMBER OF SKYTEAM                                ',
				' 2.NBO JNB   - DEPARTS TERMINAL 1A                              ',
				' 3.NBO JNB   - ARRIVES TERMINAL A                               ',
				' 4.NBO JNB   -   7/ DUTY FREE SALES                             ',
				' 5.NBO JNB   -   9/ NON-SMOKING                                 ',
				' 6.NBO JNB   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
				' 7.NBO JNB   -  CO2/PAX* 244.42 KG ECO, 244.42 KG PRE           ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               738  J  16   M 129                               ',
				'',
			]),
			{
				'commandCopy': 'DO1-3',
				'segments': [
					{
						'airline': 'PW',
						'flightNumber': '722',
						'departureDate': {'raw': '04JUL17', 'parsed': '2017-07-04'},
						'legs': [
							{
								'departureAirport': 'NBO',
								'departureTime': {'raw': '0800', 'parsed': '08:00'},
								'meals': [
									{
										'bookingClasses': ['Y', 'B', 'M', 'U', 'K', 'H', 'L', 'Q', 'T', 'E', 'N'],
										'raw': '-',
										'parsed': ['NO_MEAL_IS_OFFERED'],
									},
									{
										'bookingClasses': ['R', 'V', 'G', 'S', 'X', 'W'],
										'raw': '-',
										'parsed': ['NO_MEAL_IS_OFFERED'],
									},
								],
								'aircraft': 'ATR',
								'flightDuration': '1:00',
								'destinationAirport': 'JRO',
								'destinationTime': {'raw': '0900', 'parsed': '09:00'},
							},
							{
								'departureAirport': 'JRO',
								'departureTime': {'raw': '0940', 'parsed': '09:40'},
								'meals': [
									{'raw': '-', 'parsed': ['NO_MEAL_IS_OFFERED']},
									{'raw': '-', 'parsed': ['NO_MEAL_IS_OFFERED']},
								],
								'aircraft': 'ATR',
								'groundDuration': '0:40',
								'flightDuration': '1:30',
								'destinationAirport': 'MWZ',
								'destinationTime': {'raw': '1110', 'parsed': '11:10'},
							},
						],
						'travelDuration': '3:10',
					},
					{
						'airline': 'PW',
						'flightNumber': '727',
						'departureDate': {'raw': '10JUL17', 'parsed': '2017-07-10'},
						'legs': [
							{
								'departureAirport': 'MWZ',
								'meals': [
									{'raw': '-', 'parsed': ['NO_MEAL_IS_OFFERED']},
									{'raw': '-', 'parsed': ['NO_MEAL_IS_OFFERED']},
								],
								'aircraft': 'ATR',
								'flightDuration': '1:30',
								'destinationAirport': 'JRO',
							},
							{
								'departureAirport': 'JRO',
								'destinationAirport': 'NBO',
								'departureTime': {'raw': '1415', 'parsed': '14:15'},
								'destinationTime': {'raw': '1515', 'parsed': '15:15'},
								'meals': [
									{'raw': '-', 'parsed': ['NO_MEAL_IS_OFFERED']},
									{'raw': '-', 'parsed': ['NO_MEAL_IS_OFFERED']},
								],
								'groundDuration': '0:30',
								'flightDuration': '1:00',
							},
						],
						'travelDuration': '3:00',
					},
					{
						'airline': 'KQ',
						'flightNumber': '764',
						'departureDate': {'raw': '10JUL17', 'parsed': '2017-07-10'},
						'legs': [
							{
								'departureAirport': 'NBO',
								'destinationAirport': 'JNB',
								'departureTime': {'raw': '2050', 'parsed': '20:50'},
								'destinationTime': {'raw': '0005', 'parsed': '00:05'},
								'departureDayOfWeek': {'raw': 'MO'},
								'destinationDayOfWeek': {'raw': 'TU'},
								'meals': [
									{'raw': 'M', 'parsed': ['MEAL']},
									{'raw': 'M', 'parsed': ['MEAL']},
								],
								'aircraft': '738',
								'flightDuration': '4:15',
							},
						],
						'travelDuration': '4:15',
					},
				],
			},
		]);

		// apollo>*V1WWKC; with a multi-line comment and a configuration
		$list.push([
			php.implode(php.PHP_EOL, [
				'DO1-6',
				'*1A PLANNED FLIGHT INFO*              VS4657   30 SU 30JUL17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'JFK          0700  SU JCDIZWSHKYB/S       717         1:18      ',
				'                      RLUMEQXVNO/S                              ',
				'BOS 0818  SU                                                1:18',
				'',
				'COMMENTS-',
				' 1.JFK BOS   - COMMERCIAL DUPLICATE - OPERATED BY              ',
				'               DELTA AIR LINES',
				' 2.JFK BOS   - AIRCRAFT OWNER DELTA AIR LINES                   ',
				' 3.ENTIRE FLT- Q/ INTL ONLINE CONNECTING OR STOPOVR TRAFFIC ONL ',
				' 4.JFK BOS   - OPERATIONAL LEG DL 2500                          ',
				' 5.JFK BOS   - DEPARTS TERMINAL 2                               ',
				' 6.JFK BOS   - ARRIVES TERMINAL A                               ',
				' 7.JFK BOS   - MCT FLIGHT TRACKING D/D                          ',
				' 8.JFK BOS   -   9/ NON-SMOKING                                 ',
				' 9.JFK BOS   - SECURED FLIGHT                                   ',
				'10.JFK BOS   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
				'11.JFK BOS   - F12Y98                                           ',
				'12.JFK BOS   -  CO2/PAX* 61.76 KG ECO, 61.76 KG PRE             ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               717  F  12   Y  98                               ',
				// rest segments truncated
			]),
			{
				'segments': [
					{
						'airline': 'VS',
						'flightNumber': '4657',
						'departureDate': {'raw': '30JUL17', 'parsed': '2017-07-30'},
						'legs': [
							{
								'departureAirport': 'JFK',
								'destinationAirport': 'BOS',
								'departureTime': {'raw': '0700', 'parsed': '07:00'},
								'destinationTime': {'raw': '0818', 'parsed': '08:18'},
								'meals': [
									{'raw': 'S', 'parsed': ['SNACK']},
									{'raw': 'S', 'parsed': ['SNACK']},
								],
								'aircraft': '717',
								'flightDuration': '1:18',
							},
						],
						'comments': [
							{
								'from': 'JFK', 'to': 'BOS', 'raw': php.implode(php.PHP_EOL, [
									'COMMERCIAL DUPLICATE - OPERATED BY',
									'DELTA AIR LINES',
								])
							},
							{'from': 'JFK', 'to': 'BOS', 'raw': 'AIRCRAFT OWNER DELTA AIR LINES'},
							{'entireSegment': true, 'raw': 'Q/ INTL ONLINE CONNECTING OR STOPOVR TRAFFIC ONL'},
							{'from': 'JFK', 'to': 'BOS', 'raw': 'OPERATIONAL LEG DL 2500'},
							{'from': 'JFK', 'to': 'BOS', 'raw': 'DEPARTS TERMINAL 2'},
							{'from': 'JFK', 'to': 'BOS', 'raw': 'ARRIVES TERMINAL A'},
							{'from': 'JFK', 'to': 'BOS', 'raw': 'MCT FLIGHT TRACKING D/D'},
							{'from': 'JFK', 'to': 'BOS', 'raw': '  9/ NON-SMOKING'},
							{'from': 'JFK', 'to': 'BOS', 'raw': 'SECURED FLIGHT'},
							{'from': 'JFK', 'to': 'BOS', 'raw': ' ET/ ELECTRONIC TKT CANDIDATE'},
							{'from': 'JFK', 'to': 'BOS', 'raw': 'F12Y98'},
							{
								'from': 'JFK', 'to': 'BOS', 'raw': php.implode(php.PHP_EOL, [
									' CO2/PAX* 61.76 KG ECO, 61.76 KG PRE',
									' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR',
								])
							},
						],
						'configurations': [
							{'raw': '717  F  12   Y  98'},
						],
					},
				],
			},
		]);

		// apollo>*V1BWT8; multiple meal codes for same classes
		$list.push([
			php.implode(php.PHP_EOL, [
				'DO1-6',
				'*1A PLANNED FLIGHT INFO*              SN 241    2 SU 02JUL17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'ROB          2035  SU JCDZPIYBMUH/DB      332         6:35      ',
				'                      QVWSTELKGX/DB                             ',
				'BRU 0510  MO                                                6:35',
				'',
				'COMMENTS-',
				' 1.ROB BRU   - COCKPIT CREW BRUSSELS AIRLINES                   ',
				' 2.ROB BRU   - CABIN CREW BRUSSELS AIRLINES                     ',
				' 3.ROB BRU   -   1/ MOVIE                                       ',
				' 4.ROB BRU   -   4/ AUDIO PROGRAMMING                           ',
				' 5.ROB BRU   -   7/ DUTY FREE SALES                             ',
				' 6.ROB BRU   -   9/ NON-SMOKING                                 ',
				' 7.ROB BRU   -  12/ IN-SEAT POWER SOURCE                        ',
				' 8.ROB BRU   -  15/ IN-SEAT VIDEO PLAYER/LIBRARY                ',
				' 9.ROB BRU   -  20/ LIE-FLAT SEAT BUSINESS                      ',
				'10.ROB BRU   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
				'11.ROB BRU   -  CO2/PAX* 313.96 KG ECO, 627.92 KG PRE           ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               332  NO CONFIGURATION SET                        ',
				// rest segments truncated
			]),
			{
				'segments': [
					{
						'airline': 'SN',
						'flightNumber': '241',
						'legs': [
							{
								'departureAirport': 'ROB',
								'destinationAirport': 'BRU',
								'meals': [
									{
										'bookingClasses': ['J', 'C', 'D', 'Z', 'P', 'I', 'Y', 'B', 'M', 'U', 'H'],
										'raw': 'DB',
										'parsed': ['DINNER', 'BREAKFAST'],
									},
									{
										'bookingClasses': ['Q', 'V', 'W', 'S', 'T', 'E', 'L', 'K', 'G', 'X'],
										'raw': 'DB',
										'parsed': ['DINNER', 'BREAKFAST'],
									},
								],
								'aircraft': '332',
								'flightDuration': '6:35',
							},
						],
						'travelDuration': '6:35',
					},
				],
			},
		]);

		// apollo>*P8T520; with FLIGHT NOT OPERATIONAL segment
		$list.push([
			php.implode(php.PHP_EOL, [
				'DO1-5',
				'DL 2243 04JUL2017 FLIGHT NOT OPERATIONAL                        ',
				'                                                                ',
				'*1A PLANNED FLIGHT INFO*              PR 428   60 TU 29AUG17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'MNL          0700  TU JCDIZYSLMHQ/B       321         4:15      ',
				'                      VBXKETUO/B                                ',
				'NRT 1215  TU                                                4:15',
				'',
				'COMMENTS-',
				' 1.MNL NRT   - DEPARTS TERMINAL 2                               ',
				' 2.MNL NRT   - ARRIVES TERMINAL 2                               ',
				' 3.MNL NRT   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
				' 4.MNL NRT   - Z999                                             ',
				' 5.MNL NRT   -  CO2/PAX* 207.94 KG ECO, 415.88 KG PRE           ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               321  NO CONFIGURATION SET                        ',
				'*1A PLANNED FLIGHT INFO*              DL 276   60 TU 29AUG17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'NRT          1555  TU JCDIZ/M  WY/D       744        11:44      ',
				'                      BMHQKLUTXVE/D                             ',
				'DTW 1439  TU                                               11:44',
				'',
				'COMMENTS-',
				' 1.NRT DTW   - DEPARTS TERMINAL 1                               ',
				' 2.NRT DTW   - ARRIVES TERMINAL EM                              ',
				' 3.NRT DTW   - MCT FLIGHT TRACKING I/I                          ',
				' 4.NRT DTW   -   1/ MOVIE                                       ',
				' 5.NRT DTW   -   3/ ENTERTAINMENT ON DEMAND                     ',
				' 6.NRT DTW   -  12/ IN-SEAT POWER SOURCE                        ',
				' 7.NRT DTW   -  15/ IN-SEAT VIDEO PLAYER/LIBRARY                ',
				' 8.NRT DTW   -  18/ WI-FI                                       ',
				' 9.NRT DTW   -  20/ LIE-FLAT SEAT BUSINESS                      ',
				'10.NRT DTW   -  99/ AMENITIES SUBJECT TO CHANGE                 ',
				'11.NRT DTW   - SECURED FLIGHT                                   ',
				'12.NRT DTW   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
				'13.NRT DTW   -  CO2/PAX* 549.18 KG ECO, 1,098.36 KG PRE         ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               744  NO CONFIGURATION SET                        ',
				'DL 867 29AUG2017 FLIGHT NOT OPERATIONAL                         ',
				'',
			]),
			{
				'segments': [
					{
						'airline': 'DL',
						'flightNumber': '2243',
						'departureDate': {'parsed': '2017-07-04'},
						'type': 'notOperational',
					},
					{
						'airline': 'PR',
						'flightNumber': '428',
						'departureDate': {'parsed': '2017-08-29'},
						'type': 'planned',
						'legs': [
							{'departureAirport': 'MNL', 'destinationAirport': 'NRT'},
						],
					},
					{
						'airline': 'DL',
						'flightNumber': '276',
						'type': 'planned',
						'legs': [
							{'departureAirport': 'NRT', 'destinationAirport': 'DTW'},
						],
					},
					{
						'airline': 'DL',
						'flightNumber': '867',
						'departureDate': {'parsed': '2017-08-29'},
						'type': 'notOperational',
					},
				],
			},
		]);

		// apollo>*JG6RK2; aircraft change in hidden stop and multiple configuration lines
		$list.push([
			php.implode(php.PHP_EOL, [
				'DO1-7',
				'*1A PLANNED FLIGHT INFO*              UA 282   29 SA 29JUL17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'EWR          0759  SA FCADZP/B  Y/F       752         4:33      ',
				'                      BMEUHQVWSTL/F                             ',
				'                      KGN/F                                     ',
				'DEN 1032  SA 1115  SA FCADZP/L  Y/G       738   0:43  2:33      ',
				'                      BMEUHQVWSTL/G                             ',
				'                      KGN/G                                     ',
				'SMF 1248  SA                                                7:49',
				'',
				'COMMENTS-',
				' 1.EWR DEN   - DEPARTS TERMINAL C                               ',
				' 2.DEN SMF   - ARRIVES TERMINAL A                               ',
				' 3.EWR DEN   - MCT FLIGHT TRACKING D/D                          ',
				' 4.DEN SMF   - MCT FLIGHT TRACKING D/D                          ',
				' 5.EWR DEN   - ON-TIME PERF 8FEB17                              ',
				' 6.ENTIRE FLT- SECURED FLIGHT                                   ',
				' 7.ENTIRE FLT-  ET/ ELECTRONIC TKT CANDIDATE                    ',
				' 8.EWR DEN   - F16Y153                                          ',
				' 9.DEN SMF   - F8Y150                                           ',
				'10.EWR SMF   -  CO2/PAX* 342.09 KG ECO, 342.09 KG PRE           ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               752  F  16   Y 153                               ',
				'               738  F   8   Y 150                               ',
				// rest segments truncated
			]),
			{
				'commandCopy': 'DO1-7',
				'segments': [
					{
						'type': 'planned',
						'airline': 'UA',
						'flightNumber': '282',
						'dayOfWeek': {'raw': 'SA'},
						'unparsedToken1': '29',
						'departureDate': {'raw': '29JUL17', 'parsed': '2017-07-29'},
						'legs': [
							{
								'departureAirport': 'EWR',
								'destinationAirport': 'DEN',
								'departureTime': {'raw': '0759', 'parsed': '07:59'},
								'destinationTime': {'raw': '1032', 'parsed': '10:32'},
								'meals': [{'raw': 'B'}, {'raw': 'F'}, {'raw': 'F'}, {'raw': 'F'}],
								'aircraft': '752',
								'flightDuration': '4:33',
							},
							{
								'departureAirport': 'DEN',
								'destinationAirport': 'SMF',
								'departureTime': {'raw': '1115', 'parsed': '11:15'},
								'destinationTime': {'raw': '1248', 'parsed': '12:48'},
								'meals': [
									{'raw': 'L', 'parsed': ['LUNCH']},
									{'raw': 'G', 'parsed': ['FOOD_AND_ALCOHOL_AT_COST']},
									{'raw': 'G', 'parsed': ['FOOD_AND_ALCOHOL_AT_COST']},
									{'raw': 'G', 'parsed': ['FOOD_AND_ALCOHOL_AT_COST']},
								],
								'aircraft': '738',
								'groundDuration': '0:43',
								'flightDuration': '2:33',
							},
						],
						'travelDuration': '7:49',
						'configurations': [
							{'raw': '752  F  16   Y 153'},
							{'raw': '738  F   8   Y 150'},
						],
						'linesLeft': [],
					},
				],
			},
		]);

		// >RT62E5I8; with flown segments
		$list.push([
			php.implode(php.PHP_EOL, [
				'DO4-7',
				'ET 509 27JUN2017 REQUEST IS OUTSIDE SYSTEM DATE RANGE           ',
				'                                                                ',
				'KP 16 28JUN2017 REQUEST IS OUTSIDE SYSTEM DATE RANGE            ',
				'                                                                ',
				'*1A PLANNED FLIGHT INFO*              KP  17   13 TU 05SEP17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'BKO          0850  TU CJDR/B  YGS/K       DH4         2:35      ',
				'                      BMKLVHUQTWE/K                             ',
				'                      ON/K                                      ',
				'LFW 1125  TU                                                2:35',
				'',
				'COMMENTS-',
				' 1.BKO LFW   -   9/ NON-SMOKING                                 ',
				' 2.BKO LFW   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
				' 3.BKO LFW   - PERMANENT REQUEST / REQUEST ALL RESV R/G/N       ',
				' 4.BKO LFW   - C7Y60                                            ',
				' 5.BKO LFW   -  CO2/PAX* 147.86 KG ECO, 147.86 KG PRE           ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               DH4  C   7   Y  60                               ',
				'*1A PLANNED FLIGHT INFO*              ET 508   13 TU 05SEP17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'LFW          1250  TU CJDPZIYGSXB/S       788        10:45      ',
				'                      MKLVHUQTWEO/S                             ',
				'EWR 1935  TU                                               10:45',
				'',
				'COMMENTS-',
				' 1.LFW EWR   - SECURED FLIGHT                                   ',
				' 2.LFW EWR   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
				' 3.LFW EWR   -  CO2/PAX* 495.27 KG ECO, 990.55 KG PRE           ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               788  NO CONFIGURATION SET                        ',
				'',
			]),
			{
				'segments': [
					{
						'airline': 'ET',
						'flightNumber': '509',
						'departureDate': {'parsed': '2017-06-27'},
						'type': 'flown',
					},
					{
						'airline': 'KP',
						'flightNumber': '16',
						'departureDate': {'parsed': '2017-06-28'},
						'type': 'flown',
					},
					{
						'airline': 'KP',
						'flightNumber': '17',
						'type': 'planned',
						'legs': [
							{'departureAirport': 'BKO', 'destinationAirport': 'LFW'},
						],
					},
					{
						'airline': 'ET',
						'flightNumber': '508',
						'type': 'planned',
						'legs': [
							{'departureAirport': 'LFW', 'destinationAirport': 'EWR'},
						],
					},
				],
			},
		]);

		// with * OPERATIONAL FLIGHT INFO *
		$list.push([
			php.implode(php.PHP_EOL, [
				'DODL9578/20DEC',
				'* OPERATIONAL FLIGHT INFO *            DL9578    0 WE 20DEC17   ',
				'CITY INFO                                       HOUR (LOCAL)    ',
				'AMS  LEFT THE GATE                              0705            ',
				'     TOOK OFF                                   0716            ',
				'     PLANE IS LATE (IN HOURS MINUTES)           0015            ',
				'     03                                                         ',
				'     ESTIMATED TIME OF ARRIVAL                  0907     FCO    ',
				'FCO  AIRCRAFT LANDED                            0903            ',
				'     AIRCRAFT EXPECTED AT GATE                  0916            ',
				'     ARRIVED                                    0911            ',
				'',
				'*1A PLANNED FLIGHT INFO*              DL9578    0 WE 20DEC17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'AMS          0650  WE JCDIZ/B  YB/S       73H         2:20      ',
				'                      MHQKLUTXV/S                               ',
				'FCO 0910  WE                                                2:20',
				'',
				'COMMENTS-',
				' 1.AMS FCO   - COMMERCIAL DUPLICATE - OPERATED BY              ',
				'               KLM ROYAL DUTCH AIRLINES',
				' 2.AMS FCO   - AIRCRAFT OWNER KLM ROYAL DUTCH AIRLINES          ',
				' 3.ENTIRE FLT- G/ QUALIFIED ONLINE CONNECTING TRAFFIC ONLY      ',
				' 4.AMS FCO   - OPERATIONAL LEG KL 1597                          ',
				' 5.AMS FCO   - ARRIVES TERMINAL 1                               ',
				' 6.AMS FCO   - MCT FLIGHT TRACKING I/I                          ',
				' 7.AMS FCO   -   9/ NON-SMOKING                                 ',
				' 8.AMS FCO   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
				' 9.AMS FCO   -  CO2/PAX* 126.86 KG ECO, 126.86 KG PRE           ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               73H  NO CONFIGURATION SET                        ',
				' ',
			]),
			{
				'segments': [
					{
						'type': 'operational',
						'airline': 'DL',
						'flightNumber': '9578',
						'departureDate': {'parsed': '2017-12-20'},
						'legs': [
							{
								'departureAirport': 'AMS',
								'destinationAirport': 'FCO',
								'departureOperations': [
									{'message': 'LEFT THE GATE', 'time': {'parsed': '07:05'}},
									{'message': 'TOOK OFF', 'time': {'parsed': '07:16'}},
									{'message': 'PLANE IS LATE (IN HOURS MINUTES)', 'time': {'parsed': '00:15'}},
									{'message': '03', 'time': null},
								],
								'destinationOperations': [
									{'message': 'ESTIMATED TIME OF ARRIVAL', 'time': {'parsed': '09:07'}},
									{'message': 'AIRCRAFT LANDED', 'time': {'parsed': '09:03'}},
									{'message': 'AIRCRAFT EXPECTED AT GATE', 'time': {'parsed': '09:16'}},
									{'message': 'ARRIVED', 'time': {'parsed': '09:11'}},
								],
							},
						],
					},
					{
						'type': 'planned',
						'airline': 'DL',
						'flightNumber': '9578',
						'dayOfWeek': {'raw': 'WE', 'parsed': 3},
						'departureDate': {'raw': '20DEC17', 'parsed': '2017-12-20'},
						'legs': [
							{
								'departureAirport': 'AMS',
								'destinationTime': {'raw': '0910', 'parsed': '09:10'},
								'destinationDayOfWeek': {'raw': 'WE', 'parsed': 3},
								'departureTime': {'raw': '0650', 'parsed': '06:50'},
								'departureDayOfWeek': {'raw': 'WE', 'parsed': 3},
								'meals': [
									{'bookingClasses': ['J', 'C', 'D', 'I', 'Z'], 'raw': 'B', 'parsed': ['BREAKFAST']},
									{'bookingClasses': ['Y', 'B'], 'raw': 'S', 'parsed': ['SNACK']},
									{
										'bookingClasses': ['M', 'H', 'Q', 'K', 'L', 'U', 'T', 'X', 'V'],
										'raw': 'S',
										'parsed': ['SNACK']
									},
								],
								'aircraft': '73H',
								'flightDuration': '2:20',
								'destinationAirport': 'FCO',
							},
						],
						'travelDuration': '2:20',
						'comments': [
							{
								'raw': php.implode(php.PHP_EOL, [
									'COMMERCIAL DUPLICATE - OPERATED BY',
									'KLM ROYAL DUTCH AIRLINES',
								])
							},
							{'raw': 'AIRCRAFT OWNER KLM ROYAL DUTCH AIRLINES'},
							{'raw': 'G/ QUALIFIED ONLINE CONNECTING TRAFFIC ONLY'},
							{'raw': 'OPERATIONAL LEG KL 1597'},
							{'raw': 'ARRIVES TERMINAL 1'},
							{'raw': 'MCT FLIGHT TRACKING I/I'},
							{'raw': '  9/ NON-SMOKING'},
							{'raw': ' ET/ ELECTRONIC TKT CANDIDATE'},
							{
								'raw': php.implode(php.PHP_EOL, [
									' CO2/PAX* 126.86 KG ECO, 126.86 KG PRE',
									' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR',
								])
							},
						],
						'configurations': [{'raw': '73H  NO CONFIGURATION SET'}],
						'linesLeft': [],
					},
				],
			},
		]);

		// terminal_command_log id #103564180, with hidden stop and operational flight info
		$list.push([
			php.implode(php.PHP_EOL, [
				'DODL392/28NOV',
				'* OPERATIONAL FLIGHT INFO *            DL 392   -1 TU 28NOV17   ',
				'CITY INFO                                       HOUR (LOCAL)    ',
				'PTY  ESTIMATED TIME OF DEPARTURE                0905            ',
				'     LEFT THE GATE                              0905            ',
				'     TOOK OFF                                   0916            ',
				'     ESTIMATED TIME OF ARRIVAL                  1250     ATL    ',
				'ATL  AIRCRAFT LANDED                            1250            ',
				'     ARRIVED                                    1258            ',
				'     LEFT THE GATE                              1546            ',
				'     TOOK OFF                                   1557            ',
				'     ESTIMATED TIME OF ARRIVAL                  1623     ORD    ',
				'ORD  AIRCRAFT LANDED                            1629            ',
				'     ARRIVED                                    1635            ',
				'',
				'*1A PLANNED FLIGHT INFO*              DL 392   -1 TU 28NOV17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'PTY          0915  TU JCDIZ/B  WY/S       738         4:14      ',
				'                      BMHQKLUTXVE/S                             ',
				'ATL 1329  TU 1544  TU JCDIZ/R  WY/N       M88   2:15  2:11      ',
				'                      BMHQKLUTXVE/N                             ',
				'ORD 1655  TU                                                8:40',
				'',
				'COMMENTS-',
				' 1.ATL ORD   - DEPARTS TERMINAL S                               ',
				' 2.PTY ATL   - ARRIVES TERMINAL I                               ',
				// ... truncated ...
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               738  NO CONFIGURATION SET                        ',
				'',
			]),
			{
				'segments': [
					{
						'type': 'operational',
						'airline': 'DL',
						'flightNumber': '392',
						'departureDate': {'raw': '28NOV17'},
						'legs': [
							{
								'departureAirport': 'PTY',
								'destinationAirport': 'ATL',
								'departureOperations': [
									{'message': 'ESTIMATED TIME OF DEPARTURE', 'time': {'raw': '0905'}},
									{'message': 'LEFT THE GATE', 'time': {'raw': '0905'}},
									{'message': 'TOOK OFF', 'time': {'raw': '0916'}},
								],
								'destinationOperations': [
									{'message': 'ESTIMATED TIME OF ARRIVAL', 'time': {'raw': '1250'}},
									{'message': 'AIRCRAFT LANDED', 'time': {'raw': '1250'}},
									{'message': 'ARRIVED', 'time': {'raw': '1258'}},
								],
							},
							{
								'departureAirport': 'ATL',
								'destinationAirport': 'ORD',
								'departureOperations': [
									{'message': 'LEFT THE GATE', 'time': {'raw': '1546'}},
									{'message': 'TOOK OFF', 'time': {'raw': '1557'}},
								],
								'destinationOperations': [
									{'message': 'ESTIMATED TIME OF ARRIVAL', 'time': {'raw': '1623'}},
									{'message': 'AIRCRAFT LANDED', 'time': {'raw': '1629'}},
									{'message': 'ARRIVED', 'time': {'raw': '1635'}},
								],
							},
						],
					},
					{
						'type': 'planned',
						'airline': 'DL',
						'flightNumber': '392',
						'departureDate': {'raw': '28NOV17'},
					},
				],
			},
		]);

		// terminal_command_log id #124832696, operational flight info with only estimations
		$list.push([
			php.implode(php.PHP_EOL, [
				'DOBA0268/20DEC',
				'* OPERATIONAL FLIGHT INFO *            BA 268    0 WE 20DEC17   ',
				'CITY INFO                                       HOUR (LOCAL)    ',
				'LAX  ESTIMATED TIME OF DEPARTURE                2132            ',
				'     ESTIMATED TIME OF ARRIVAL                  1552     LHR    ',
				'',
				'*1A PLANNED FLIGHT INFO*              BA 268    0 WE 20DEC17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'LAX          2105  WE FAJCDRIWETY/M       388        10:20      ',
				'                      BHKMLVSNQOG/M                             ',
				'LHR 1525  TH                                               10:20',
				'',
				'COMMENTS-',
				' 1.LAX LHR   - MEMBER OF ONEWORLD                               ',
				// ... truncated ...
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               388  F  14   J  97   W  55   M 303               ',
				'',
			]),
			{
				'segments': [
					{
						'type': 'operational',
						'airline': 'BA',
						'flightNumber': '268',
						'departureDate': {'raw': '20DEC17'},
						'legs': [
							{
								'departureAirport': 'LAX',
								'destinationAirport': 'LHR',
								'departureOperations': [
									{'message': 'ESTIMATED TIME OF DEPARTURE', 'time': {'raw': '2132'}},
								],
								'destinationOperations': [
									{'message': 'ESTIMATED TIME OF ARRIVAL', 'time': {'raw': '1552'}},
								],
							},
						],
					},
					{
						'type': 'planned',
						'airline': 'BA',
						'flightNumber': '268',
						'departureDate': {'raw': '20DEC17'},
					},
				],
			},
		]);

		// terminal_command_log id #124985642, with free-form messages without time
		// this example also shows that ESTIMATED TIME OF ARRIVAL is in time zone of LHR
		$list.push([
			php.implode(php.PHP_EOL, [
				'DOBA268/19DEC',
				'* OPERATIONAL FLIGHT INFO *            BA 268   -1 TU 19DEC17   ',
				'CITY INFO                                       HOUR (LOCAL)    ',
				'LAX  ESTIMATED TIME OF DEPARTURE                2105            ',
				'     LEFT THE GATE                              2115            ',
				'     TOOK OFF                                   2145            ',
				'     DELAY ZY                                                   ',
				'     DELAY ZA                                                   ',
				'     ESTIMATED TIME OF ARRIVAL                  1523     LHR    ',
				'LHR  AIRCRAFT LANDED                            1536            ',
				'     ARRIVED                                    1542            ',
				'',
				'*1A PLANNED FLIGHT INFO*              BA 268   -1 TU 19DEC17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'LAX          2105  TU FAJCDRIWETY/M       388        10:20      ',
				'                      BHKMLVSNQOG/M                             ',
				'                      X/M                                       ',
				'LHR 1525  WE                                               10:20',
				'',
				'COMMENTS-',
				' 1.LAX LHR   - MEMBER OF ONEWORLD                               ',
				' 2.LAX LHR   - DEPARTS TERMINAL B                               ',
				' 3.LAX LHR   - ARRIVES TERMINAL 5                               ',
				' 4.LAX LHR   -   9/ NON-SMOKING                                 ',
				' 5.LAX LHR   - SECURED FLIGHT                                   ',
				' 6.LAX LHR   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
				' 7.LAX LHR   -  CO2/PAX* 458.48 KG ECO, 916.96 KG PRE           ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'',
			]),
			{
				'segments': [
					{
						'type': 'operational',
						'airline': 'BA',
						'flightNumber': '268',
						'departureDate': {'raw': '19DEC17'},
						'legs': [
							{
								'departureAirport': 'LAX',
								'destinationAirport': 'LHR',
								'departureOperations': [
									{'message': 'ESTIMATED TIME OF DEPARTURE', 'time': {'parsed': '21:05'}},
									{'message': 'LEFT THE GATE', 'time': {'parsed': '21:15'}},
									{'message': 'TOOK OFF', 'time': {'parsed': '21:45'}},
									{'message': 'DELAY ZY', 'time': null},
									{'message': 'DELAY ZA', 'time': null},
								],
								'destinationOperations': [
									{'message': 'ESTIMATED TIME OF ARRIVAL', 'time': {'parsed': '15:23'}},
									{'message': 'AIRCRAFT LANDED', 'time': {'parsed': '15:36'}},
									{'message': 'ARRIVED', 'time': {'parsed': '15:42'}},
								],
							},
						],
					},
					{
						'type': 'planned',
						'airline': 'BA',
						'flightNumber': '268',
						'departureDate': {'raw': '19DEC17'},
					},
				],
			},
		]);

		// with "FLIGHT NOT OPERATING ON DATE SPECIFIED / SEE ALTERNATE DISPLAY" warning
		$list.push([
			php.implode(php.PHP_EOL, [
				'DOUA7228/01JAN',
				'FLIGHT NOT OPERATING ON DATE SPECIFIED / SEE ALTERNATE DISPLAY  ',
				'* OPERATIONAL FLIGHT INFO *            UA7228   -1 TU 02JAN18   ',
				'CITY INFO                                       HOUR (LOCAL)    ',
				'IAD  ESTIMATED TIME OF DEPARTURE                1740            ',
				'     LEFT THE GATE                              1739            ',
				'     ESTIMATED TIME OF ARRIVAL                  0812     ACC    ',
				'ACC  AIRCRAFT LANDED                            0811            ',
				'     AIRCRAFT EXPECTED AT GATE                  0812            ',
				'     ARRIVED                                    0817            ',
				'     LEFT THE GATE                              0916            ',
				'     TOOK OFF                                   0930            ',
				'     ESTIMATED TIME OF ARRIVAL                  1708     JNB    ',
				'JNB  AIRCRAFT LANDED                            1712            ',
				'     AIRCRAFT EXPECTED AT GATE                  1718            ',
				'     ARRIVED                                    1721            ',
				'',
				'*1A PLANNED FLIGHT INFO*              UA7228   -1 TU 02JAN18    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'IAD          1740  TU JCDZYBMEUHQ/D       333         9:45      ',
				'                      VWSTLKG/D                                 ',
				'ACC 0825  WE 0925  WE JCDZYBMEUHQ/L             1:00  5:55      ',
				'                      VWSTLKG/L                                 ',
				'JNB 1720  WE                                               16:40',
				'',
				'COMMENTS-',
				' 1.IAD ACC   - COMMERCIAL DUPLICATE - OPERATED BY              ',
				'               SOUTH AFRICAN AIRWAYS',
				// ... truncated ...
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               333  NO CONFIGURATION SET                        ',
				'',
			]),
			{
				'isAlternateDateDisplay': true,
				'segments': [
					{
						'type': 'operational',
						'airline': 'UA',
						'flightNumber': '7228',
						'departureDate': {'raw': '02JAN18', 'parsed': '2018-01-02'},
						'legs': [
							{
								'departureAirport': 'IAD',
								'destinationAirport': 'ACC',
								'departureOperations': [
									{'message': 'ESTIMATED TIME OF DEPARTURE', 'time': {'parsed': '17:40'}},
									{'message': 'LEFT THE GATE', 'time': {'parsed': '17:39'}},
								],
								'destinationOperations': [
									{'message': 'ESTIMATED TIME OF ARRIVAL', 'time': {'parsed': '08:12'}},
									{'message': 'AIRCRAFT LANDED', 'time': {'parsed': '08:11'}},
									{'message': 'AIRCRAFT EXPECTED AT GATE', 'time': {'parsed': '08:12'}},
									{'message': 'ARRIVED', 'time': {'parsed': '08:17'}},
								],
							},
							{
								'departureAirport': 'ACC',
								'destinationAirport': 'JNB',
								'departureOperations': [
									{'message': 'LEFT THE GATE', 'time': {'parsed': '09:16'}},
									{'message': 'TOOK OFF', 'time': {'parsed': '09:30'}},
								],
								'destinationOperations': [
									{'message': 'ESTIMATED TIME OF ARRIVAL', 'time': {'parsed': '17:08'}},
									{'message': 'AIRCRAFT LANDED', 'time': {'parsed': '17:12'}},
									{'message': 'AIRCRAFT EXPECTED AT GATE', 'time': {'parsed': '17:18'}},
									{'message': 'ARRIVED', 'time': {'parsed': '17:21'}},
								],
							},
						],
					},
					{
						'type': 'planned',
						'airline': 'UA',
						'flightNumber': '7228',
						'departureDate': {'raw': '02JAN18', 'parsed': '2018-01-02'},
						'legs': [
							{
								'departureAirport': 'IAD',
								'destinationAirport': 'ACC',
								'aircraft': '333',
								'flightDuration': '9:45',
							},
							{
								'departureAirport': 'ACC',
								'destinationAirport': 'JNB',
								'aircraft': '333',
								'groundDuration': '1:00',
								'flightDuration': '5:55',
							},
						],
						'travelDuration': '16:40',
						'configurations': [{'raw': '333  NO CONFIGURATION SET'}],
					},
				],
			},
		]);

		// with "FLIGHT NOT OPERATING ON DATE SPECIFIED / SEE ALTERNATE DISPLAY" warning
		$list.push([
			php.implode(php.PHP_EOL, [
				'DOBA1542/17JAN',
				'* OPERATIONAL FLIGHT INFO *            BA1542   -1 WE 17JAN18   ',
				'CITY INFO                                       HOUR (LOCAL)    ',
				'LHR  LEFT THE GATE                              0837            ',
				'     TOOK OFF                                   0855            ',
				'     ESTIMATED TIME OF ARRIVAL                  1122     ORD    ',
				'ORD  AIRCRAFT LANDED                                            ',
				'     ARRIVED                                    1110            ',
				'',
				'*1A PLANNED FLIGHT INFO*              BA1542   -1 WE 17JAN18    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'LHR          0840  WE JCDRIYBHKML/BS      787         8:45      ',
				'                      VNSOQG/BS                                 ',
				'ORD 1125  WE                                                8:45',
				'',
				'COMMENTS-',
				' 1.LHR ORD   - COMMERCIAL DUPLICATE - OPERATED BY              ',
				'               AMERICAN AIRLINES',
				' 2.LHR ORD   - AIRCRAFT OWNER AMERICAN AIRLINES                 ',
				' 3.LHR ORD   - OPERATIONAL LEG AA 0087                          ',
				' 4.LHR ORD   - DEPARTS TERMINAL 3                               ',
				' 5.LHR ORD   - ARRIVES TERMINAL 5                               ',
				' 6.LHR ORD   -   9/ NON-SMOKING                                 ',
				' 7.LHR ORD   - SECURED FLIGHT                                   ',
				' 8.LHR ORD   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
				' 9.LHR ORD   -  CO2/PAX* 361.73 KG ECO, 723.46 KG PRE           ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               787  J 999   M 999                               ',
				' ',
			]),
			{
				'commandCopy': 'DOBA1542/17JAN',
				'segments': [
					{
						'type': 'operational',
						'airline': 'BA',
						'flightNumber': '1542',
						'dayOfWeek': {
							'raw': 'WE',
							'parsed': 3,
						},
						'unparsedToken1': '-1',
						'departureDate': {
							'raw': '17JAN18',
							'parsed': '2018-01-17',
						},
						'legs': [
							{
								// ...
								'destinationAirport': 'ORD',
								'destinationOperations': [
									{
										'message': 'ESTIMATED TIME OF ARRIVAL',
										'time': {
											'raw': '1122',
											'parsed': '11:22',
										},
									},
									{
										'message': 'AIRCRAFT LANDED',
										'time': null,
									},
								],
								// ...
							},
						],
					},
				],
			},
		]);

		return $list;
	}

	/**
	 * @test
	 * @dataProvider provideDumps
	 */
	testParser($dump, $expected) {
		let $actual = FlightInfoParser.parse($dump);
		this.assertArrayElementsSubset($expected, $actual);
	}

	getTestMapping() {
		return [
			[this.provideDumps, this.testParser],
		];
	}
}

module.exports = FlightInfoParserTest;
