
const CmdParser = require('../../../../src/text_format_processing/amadeus/commands/CmdParser.js');

class CmdParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js') {
	provideCommands() {
		const list = [];

		// ' MS274 -  RECORD LOCATOR        '
		list.push(['RTW4RQL4                          ', {'type': 'openPnr'}]);
		list.push(['RT W4RQL4                         ', {'type': 'openPnr'}]);
		list.push(['RT', {'type': 'redisplayPnr'}]);

		list.push(['RT/SMITH/J                        ', {'type': 'searchPnr'}]); // ' MS274 -  NAME OR PARTIAL NAME  '
		list.push(['RT/21SEP-SMITH                    ', {'type': 'searchPnr'}]); // ' MS358 -  NAME AND DATE         '
		list.push(['RT/SMIT*A                         ', {'type': 'searchPnr'}]); // ' MS400 - ACTIVE SEGMT ONLY      '
		list.push(['RT/AKLEC2180-SMITH                ', {'type': 'searchPnr'}]); // ' MS421 - ANOTHER OFFICE         '
		list.push(['RT/***LH0***-TAYLOR/WILLIAM       ', {'type': 'searchPnr'}]); // ' MS421 -  -USING WILDCARDS      '
		list.push(['RT/4-SMITH/A MR                   ', {'type': 'searchPnr'}]); // ' GPRT2 -  DISPLAY LINE          '
		list.push(['RT/MCO-JOHNSON                    ', {'type': 'searchPnr'}]); // ' GPRT2 -  MCO ELEMENT           '
		list.push(['RT/XSB-ACCARDO                    ', {'type': 'searchPnr'}]); // ' GPRT2 -  XSB ELEMENT           '

		list.push(['RT-Q6RBB3-JOHNSON                 ', {'type': 'searchPnr'}]); // ' MS568 -  RECORD LOCATOR        '
		list.push(['RT-A1XB4Q-JOHNSON-057-1234567890  ', {'type': 'searchPnr'}]); // '       -  RECORD LOCATOR, NAME  '

		list.push(['RTTKT / 057 - 1234567890          ', {'type': 'searchPnr'}]);
		list.push(['RTTKT/016-1234567890              ', {'type': 'searchPnr'}]); // ' MS589 -  TICKET NUMBER         '
		list.push(['RTM/LH-386427991                  ', {'type': 'searchPnr'}]); // ' GPRT2 -  FREQUENT FLYER NUMBER '
		list.push(['RTM/IT-123456789                  ', {'type': 'searchPnr'}]); // ' GPRT2 -  CUSTOMER OR           '
		list.push(['RTD-BA1530/01JULLHRJFK-TUFNALL    ', {'type': 'searchPnr'}]); // ' GPRT2 -  DEPARTURE TIME        '
		list.push(['RTHHL-JOHNSON                     ', {'type': 'searchPnr'}]); // ' GPRT2 -  HOTEL/CAR/TOUR/       '
		list.push(['RTHHL-JOHNSON/A                   ', {'type': 'searchPnr'}]);
		list.push(['RTHHLHI/01APR-04APR-JOHNSON       ', {'type': 'searchPnr'}]); // ' GPRT2 -  HOTEL/TOUR/CRUISE     '
		list.push(['RTY/AN1234                        ', {'type': 'searchPnr'}]); // ' GPRT2 -  RM*ACC ELEMENT        '
		list.push(['RTU/QW23RE                        ', {'type': 'searchPnr'}]); // ' GPRT2 -  CUSTOMER PROFILE      '
		list.push(['RTOA/1G-APRNSZ                    ', {'type': 'searchPnr'}]); // ' GPRT2 -  OTHER SYSTEM/THIRD    '
		list.push(['RTOA/NW-NNN222                    ', {'type': 'searchPnr'}]); // ' GPRT2 -  MARKETING AIRLINE     '
		list.push(['RTU                               ', {'type': 'searchPnr'}]); // ' GPRT2 -  CUSTOMER PROFILE      '
		list.push(['RT*E                              ', {'type': 'searchPnr'}]); // ' GPRT2 -  E-TKT RECORD          '
		list.push(['RTW-A4323B                        ', {'type': 'searchPnr'}]); // ' GPRT2 - RETRIEVE GROUP PNR     '

		// search by airline and flight number
		list.push(['RTAF003/23DEC-GIBSON              ', {'type': 'searchPnr'}]);
		list.push(['RTET0509/13JUL-A                  ', {'type': 'searchPnr'}]); // airline ET, flight number 0509, name start with "A"
		list.push(['RT ET 509 / 13 JUL - A            ', {'type': 'searchPnr'}]);
		list.push(['RTKL153/12AUGAMSMAN-JOHNSON       ', {'type': 'searchPnr'}]); // '       -  FLIGHT DEPARTURE DATE '
		list.push(['RTBA1485/9MAY-MCINTOSH*P          ', {'type': 'searchPnr'}]); // ' MS736 -  FLIGHT (PRIME PNR)    '
		list.push(['RTBA1485/9MAY-MCINTOSH*C          ', {'type': 'searchPnr'}]); // ' MS757 -  FLIGHT (OPERATING PNR)'

		list.push(['RT2                               ', {'type': 'displayPnrFromList'}]);
		list.push(['RT0                               ', {'type': 'displayPnrFromList'}]);

		// command similar to a search, but with a typo
		list.push(['RT*', {'type': null}]);
		list.push(['*RT', {'type': null}]);
		list.push(['RT:', {'type': null}]);
		list.push(['RT/', {'type': null}]);
		list.push(['RTASD', {'type': null}]);

		list.push(['FXX', {'type': 'priceItinerary'}]);

		list.push(['FXX                  ', {'type': 'priceItinerary'}]); // 'MS148', ' BASIC ENTRY TO PRICE PNR ',
		list.push(['FXP                  ', {'type': 'priceItinerary'}]); // 'MS148', ' PRICE PNR AND STORE TST  ',
		list.push(['FXX/S3               ', {'type': 'priceItinerary'}]); // 'GPOPT', ' SEGMENT SELECT           ',
		list.push(['FXX/S3S              ', {'type': 'priceItinerary'}]); // 'MS358', ' STOPOVER OVERRIDE        ',
		list.push(['FXX/S4X              ', {'type': 'priceItinerary'}]); // 'MS358', ' TRANSFER                 ',
		list.push(['FXX/B3               ', {'type': 'priceItinerary'}]); // 'GPOPT', ' FARE BREAK POINT         ',
		list.push(['FXX/BT-3             ', {'type': 'priceItinerary'}]); // 'GPOPT', ' TURNAROUND POINT         ',
		list.push(['FXX/S5,TS            ', {'type': 'priceItinerary'}]); // 'GPOPT', ' GLOBAL INDICATOR         ',
		list.push(['FXX/R,BK-F           ', {'type': 'priceItinerary'}]); // 'GPOP4', ' BOOKING CODE OVERRIDE    ',
		list.push(['FXX/R,LON            ', {'type': 'priceItinerary'}]); // 'GPOP4', ' POINT OF SALE OVERRIDE   ',
		list.push(['FXX/R,.LON           ', {'type': 'priceItinerary'}]); // 'GPOP4', ' TICKETING CITY OVERRIDE  ',
		list.push(['FXX/R,VC-CO          ', {'type': 'priceItinerary'}]); // 'GPOPT', ' VALIDATING CARRIER       ',
		list.push(['FXX/R,*NPE           ', {'type': 'priceItinerary'}]); // 'GPOPT', ' EXPANDED PARAMETERS      ',
		list.push(['FXX/R,ET             ', {'type': 'priceItinerary'}]); // 'GPOP2', ' TAX EXEMPTION            ',
		list.push(['FXX/R,AC-FR          ', {'type': 'priceItinerary'}]); // 'GPOP2', ' ADD TAXES                ',
		list.push(['FXX/R,WC-DE          ', {'type': 'priceItinerary'}]); // 'GPOP2', ' WITHHOLD TAXES           ',
		list.push(['FXX/P1               ', {'type': 'priceItinerary'}]); // 'GPOPT', ' PASSENGER ASSOCIATE      ',
		list.push(['FXX/RMIL             ', {'type': 'priceItinerary'}]); // 'GPOPT', '   PASSENGER TYPE CODE    ',

		list.push(['FXB/R,UP', {'type': 'priceItinerary', 'data': {'baseCmd': 'FXB'}}]);
		list.push(['FXR/RJCB', {'type': 'priceItinerary', 'data': {'baseCmd': 'FXR'}}]);
		list.push(['FXP/R,U', {'type': 'priceItinerary', 'data': {'baseCmd': 'FXP'}}]);

		list.push(['FXD//ASU,S7', {'type': 'lowFareSearch'}]);
		list.push(['FXS2', {'type': 'lowFareSearchNavigation'}]);
		list.push(['FXK', {'type': 'ancillaryServiceList'}]);

		// 'GPOPT', '   MULTIPLE PTCS          ',
		list.push(['FXX/RMIL*DOD*MRE     ', {
			'type': 'priceItinerary',
			'data': {
				'pricingStores': [
					[
						{
							'type': 'generic',
							'parsed': {
								'ptcs': ['MIL', 'DOD', 'MRE'],
							},
						},
					],
				],
			},
		}]);

		// 'GPOPT', '   PASSENGER ASSOCIATE    ',
		list.push(['FXX/P1/RYTH//P2/RMIL ', {
			'type': 'priceItinerary',
			'data': {
				'pricingStores': [
					[
						{'raw': 'P1'},
						{
							'type': 'generic',
							'parsed': {'ptcs': ['YTH']},
						},
					],
					[
						{'raw': 'P2'},
						{
							'type': 'generic',
							'parsed': {'ptcs': ['MIL']},
						},
					],
				],
			},
		}]);
		list.push(['FXX/PAX/RYTH//INF    ', {'type': 'priceItinerary'}]); // 'GPOPT', '   DISCOUNT PASSENGER     ',
		list.push(['FXX/RMIL,*PTC        ', {'type': 'priceItinerary'}]); // 'GPOPT', '   PRICE ONLY PTC         ',
		list.push(['FXX/RCMX             ', {'type': 'priceItinerary'}]); // 'MS316', '   COMPANION PASSENGERS   ',
		list.push(['FXX/LO               ', {'type': 'priceItinerary'}]); // 'MS568', ' DISPLAY LOWEST FARE FOR  ',
		list.push(['FXX/LI               ', {'type': 'priceItinerary'}]); // 'MS568', ' DISPLAY LIST OF FARES FOR',
		list.push(['FXX/S3X/RMIL,LON.FRA ', {'type': 'priceItinerary'}]); // 'MS400', ' COMBINING PRICING OPTIONS',
		list.push(['FXX/ZO-50A           ', {'type': 'priceItinerary'}]); // 'GPOP2', ' ZAP-OFF                  ',
		list.push(['FXX/ZO-75P*AD75      ', {'type': 'priceItinerary'}]); // '    .', '                          ',
		list.push(['FXX/R,U*ZAPADD/ZO-50A', {'type': 'priceItinerary'}]); // 'GPOP2', ' ZAP ADD - AMOUNT         ',
		list.push(['FXX/R,U*ZAPADD/ZO-10P', {'type': 'priceItinerary'}]); // '    .', '         - PERCENTAGE     ',
		list.push(['FXX/R,FC-USD         ', {'type': 'priceItinerary'}]); // 'GPOP4', ' CURRENCY OF SALE OVERRIDE',
		list.push(['FXX//R,DEL,FS-INR    ', {'type': 'priceItinerary'}]); // 'GPOP4', '  SELECTION OVERRIDE      ',
		list.push(['FXX/L-YAP            ', {'type': 'priceItinerary'}]); // 'GPOP2', ' PRICING BY FARE BASIS    ',
		list.push(['FXX/A-JRT            ', {'type': 'priceItinerary'}]); // 'GPOP3', ' PRICING BY FARE BASIS    ',
		list.push(['FXX/R,*BD            ', {
			'type': 'priceItinerary',
			'data': {
				'baseCmd': 'FXX',
				'pricingStores': [
					[
						{
							'raw': 'R,*BD',
							'type': 'generic',
							'parsed': {
								'ptcs': [],
								'rSubModifiers': [{'raw': '*BD', 'type': 'forceProperEconomy'}],
							},
						},
					],
				],
			},
		}]);

		list.push(['TTP      ', {'type': 'issueTickets'}]); // 'MS211', 'BASIC ENTRY           '
		list.push(['TTPSA0203', {'type': 'issueTickets'}]); // 'MS421', 'PRINTER IDENTIFICATION'
		list.push(['TTP/RT   ', {'type': 'issueTickets'}]); // 'MS442', 'PNR RETRIEVAL         '
		list.push(['TTP/INF  ', {'type': 'issueTickets'}]); // 'MS442', 'INFANT/NON-INFANT     '
		list.push(['TTP/PAX  ', {'type': 'issueTickets'}]); // 'MS463', 'PASSENGER TYPE OPTION '
		list.push(['TTP/VAF  ', {'type': 'issueTickets'}]); // 'MS484', 'VALIDATING CARRIER    '

		// joined commands
		list.push([
			'SS2Y1;NM1LIBERMANE/MARINA;NM1LIBERMANE/LEPIN(C05);AP15123-4567-B;APE-JOHN@GMAIL.COM;TKTL1NOV;RFKLESUN;ET',
			{
				'cmd': 'SS2Y1',
				'type': 'sell',
				'followingCommands': [
					{'cmd': 'NM1LIBERMANE/MARINA', 'type': 'addName'},
					{'cmd': 'NM1LIBERMANE/LEPIN(C05)', 'type': 'addName'},
					{'cmd': 'AP15123-4567-B'},
					{'cmd': 'APE-JOHN@GMAIL.COM'},
					{'cmd': 'TKTL1NOV', 'type': 'addTicketingDateLimit'},
					{'cmd': 'RFKLESUN', 'type': 'addReceivedFrom'},
					{'cmd': 'ET', 'type': 'storePnr'},
				],
			},
		]);

		// multi-store pricing command
		list.push([
			'FXX/P1/PAX/RADT//P1/INF/RINF//P2/RC05',
			{
				'type': 'priceItinerary',
				'data': {
					'baseCmd': 'FXX',
					'pricingStores': [
						[
							{'raw': 'P1', 'type': 'names', 'parsed': [1]},
							{'raw': 'PAX', 'type': 'ownSeat', 'parsed': true},
							{'raw': 'RADT', 'parsed': {'ptcs': ['ADT'], 'rSubModifiers': []}},
						],
						[
							{'raw': 'P1', 'type': 'names', 'parsed': [1]},
							{'raw': 'INF', 'type': 'ownSeat', 'parsed': false},
							{'raw': 'RINF', 'parsed': {'ptcs': ['INF']}},
						],
						[
							{'raw': 'P2', 'type': 'names', 'parsed': [2]},
							{'raw': 'RC05', 'parsed': {'ptcs': ['C05']}},
						],
					],
				},
			},
		]);

		// multi-store pricing command with name thru select
		list.push([
			'FXX/P1-2,5-7/RADT//P3,4/RC05',
			{
				'type': 'priceItinerary',
				'data': {
					'baseCmd': 'FXX',
					'pricingStores': [
						[
							{'raw': 'P1-2,5-7', 'type': 'names', 'parsed': [1, 2, 5, 6, 7]},
							{'raw': 'RADT', 'parsed': {'ptcs': ['ADT'], 'rSubModifiers': []}},
						],
						[
							{'raw': 'P3,4', 'type': 'names', 'parsed': [3, 4]},
							{'raw': 'RC05', 'parsed': {'ptcs': ['C05']}},
						],
					],
				},
			},
		]);

		list.push([
			'FXX/RC05*ADT*C05*INF',
			{
				type: 'priceItinerary',
				data: {
					baseCmd: 'FXX',
					pricingStores: [
						[
							{
								raw: 'RC05*ADT*C05*INF',
								type: 'generic',
								parsed: {
									ptcs: ['C05', 'ADT', 'C05', 'INF'],
								},
							},
						],
					],
				},
			},
		]);

		list.push([
			'FRNDMENRT/D-15SEP17/A-S7/FB-JFLOWCS/TD-IN90/DD-10JAN18',
			{'type': 'statelessFareRules'},
		]);

		list.push([
			'FXX/S3-4',
			{
				'type': 'priceItinerary',
				'data': {
					'baseCmd': 'FXX',
					'pricingStores': [
						[
							{'raw': 'S3-4', 'type': 'segments', 'parsed': [3, 4]},
						],
					],
				},
			},
		]);

		list.push(['FFNUA-12345678910', {'type': 'addFrequentFlyerNumber'}]);
		list.push(['FFNUA-12345678910,UA,LH', {'type': 'addFrequentFlyerNumber'}]);
		list.push(['FFNUA-12345678910/P1', {'type': 'addFrequentFlyerNumber'}]);
		list.push(['FFNUA-123456778910,UA,LH/P1', {
			'type': 'addFrequentFlyerNumber', 'data': {
				'airline': 'UA', 'code': '123456778910',
				'partners': ['UA', 'LH'], 'majorPaxNum': '1',
			},
		}]);
		list.push(['DOLH123/29APR', {'type': 'flightServiceInfo'}]);

		list.push(['XE19-22', {
			'type': 'deletePnrField', 'data': {
				'lineNumbers': [
					{'major': '19'},
					{'major': '20'},
					{'major': '21'},
					{'major': '22'},
				],
			},
		}]);
		list.push(['XE3', {
			'type': 'deletePnrField', 'data': {
				'lineNumbers': [
					{'major': '3'},
				],
			},
		}]);
		list.push(['XE1,2,5', {
			'type': 'deletePnrField', 'data': {
				'lineNumbers': [
					{'major': '1'},
					{'major': '2'},
					{'major': '5'},
				],
			},
		}]);
		// CANCEL SUB-ELEMENT OF A MISCELLANEOUS DOCUMENT ELEMENT MS211
		list.push(['XE4.1', {
			'type': 'deletePnrField', 'data': {
				'lineNumbers': [
					{'major': '4', 'minor': '1'},
				],
			},
		}]);
		// delete group name
		list.push(['XE0.1', {
			'type': 'deletePnrField', 'data': {
				'lineNumbers': [
					{'major': '0', 'minor': '1'},
				],
			},
		}]);
		// TO CANCEL MULTIPLE ELEMENTS, ENTER, FOR EXAMPLE
		list.push(['XE3,4,6-8', {
			'type': 'deletePnrField', 'data': {
				'lineNumbers': [
					{'major': '3'},
					{'major': '4'},
					{'major': '6'},
					{'major': '7'},
					{'major': '8'},
				],
			},
		}]);
		// multiple sub-elements
		list.push(['XE7.1,7.3', {
			'type': 'deletePnrField', 'data': {
				'lineNumbers': [
					{'major': '7', 'minor': '1'},
					{'major': '7', 'minor': '3'},
				],
			},
		}]);

		// changes remark contents
		list.push(['8/ASDDASD', {
			'type': 'changePnrField', 'data': {
				'majorNum': '8',
				'content': 'ASDDASD',
			},
		}]);
		// changes MCO commission line
		list.push(['7.3/0', {
			'type': 'changePnrField', 'data': {
				'majorNum': '7',
				'minorNum': '3',
				'content': '0',
			},
		}]);

		list.push(['FQDMNLSFO/R,25APR18,P/29JUN18/AKE/CQ', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'MNL',
				'destinationAirport': 'SFO',
				'modifiers': [{'raw': 'R,25APR18,P'}, {'type': 'travelDates', 'raw': '29JUN18'}],
			},
		}]);
		list.push(['FQDMNLSFO/R,25APR18,P/29JUN18/AKE/CU', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'MNL',
				'destinationAirport': 'SFO',
				'modifiers': [{'raw': 'R,25APR18,P'}, {'type': 'travelDates', 'raw': '29JUN18'}],
			},
		}]);
		list.push(['FQDMIABAQ/05SEP*04OCT', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'MIA',
				'destinationAirport': 'BAQ',
				'modifiers': [{'type': 'travelDates', 'raw': '05SEP*04OCT'}],
			},
		}]);
		list.push(['FQDNYCPTY/20DEC*5JAN/AUA', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'NYC',
				'destinationAirport': 'PTY',
				'modifiers': [{'type': 'travelDates', 'raw': '20DEC*5JAN'}],
			},
		}]);
		list.push(['FQDNYCGYE/20DEC*5JAN/AUA', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'NYC',
				'destinationAirport': 'GYE',
				'modifiers': [{'type': 'travelDates', 'raw': '20DEC*5JAN'}],
			},
		}]);
		list.push(['FQDLAXGYE/18OCT*18FEB', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LAX',
				'destinationAirport': 'GYE',
				'modifiers': [{'type': 'travelDates', 'raw': '18OCT*18FEB'}],
			},
		}]);
		list.push(['FQDSFOSYD/28MAR*11APR/R,U/KC', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'SFO',
				'destinationAirport': 'SYD',
				'modifiers': [{'type': 'travelDates', 'raw': '28MAR*11APR'}],
			},
		}]);
		list.push(['FQDSFOSYD/28MAR*11APR/R,U/KC/AVA', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'SFO',
				'destinationAirport': 'SYD',
				'modifiers': [{'type': 'travelDates', 'raw': '28MAR*11APR'}],
			},
		}]);
		list.push(['FQDSFOSYD/26DEC*9JAN/KC/AVA', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'SFO',
				'destinationAirport': 'SYD',
				'modifiers': [{'type': 'travelDates', 'raw': '26DEC*9JAN'}],
			},
		}]);
		list.push(['FQDSFOSYD/26DEC*9JAN/R,U/KC/AVA', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'SFO',
				'destinationAirport': 'SYD',
				'modifiers': [{'type': 'travelDates', 'raw': '26DEC*9JAN'}],
			},
		}]);
		list.push(['FQDNYCEDI/3OCT*8OCT/AEI', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'NYC',
				'destinationAirport': 'EDI',
				'modifiers': [{'type': 'travelDates', 'raw': '3OCT*8OCT'}],
			},
		}]);
		list.push(['FQDGYENYC/8AUG*28AUG', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'GYE',
				'destinationAirport': 'NYC',
				'modifiers': [{'type': 'travelDates', 'raw': '8AUG*28AUG'}],
			},
		}]);
		list.push(['FQDLIMCMH/22AUG*26SEP', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LIM',
				'destinationAirport': 'CMH',
				'modifiers': [{'type': 'travelDates', 'raw': '22AUG*26SEP'}],
			},
		}]);
		list.push(['FQDSFOMNL/17JUN18/R,17OCT17/APR/IR/CE', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'SFO',
				'destinationAirport': 'MNL',
				'modifiers': [{'type': 'travelDates', 'raw': '17JUN18'}],
			},
		}]);
		list.push(['FQDLAXSGN/03DEC/R,01JUN18,P/AHX/IR/CW', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LAX',
				'destinationAirport': 'SGN',
				'modifiers': [{'type': 'travelDates', 'raw': '03DEC'}],
			},
		}]);
		list.push(['FQDIADMAN/18OCT/AEI', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'IAD',
				'destinationAirport': 'MAN',
				'modifiers': [{'type': 'travelDates', 'raw': '18OCT'}],
			},
		}]);
		list.push(['FQDBDLLON/20SEP/AEI/IO/CW', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'BDL',
				'destinationAirport': 'LON',
				'modifiers': [{'type': 'travelDates', 'raw': '20SEP'}],
			},
		}]);
		list.push(['FQDBDLLON/20SEP/AEI/IO', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'BDL',
				'destinationAirport': 'LON',
				'modifiers': [{'type': 'travelDates', 'raw': '20SEP'}],
			},
		}]);
		list.push(['FQDLAXACC/10SEP/R,-JCB/AET/IO', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LAX',
				'destinationAirport': 'ACC',
				'modifiers': [{'type': 'travelDates', 'raw': '10SEP'}],
			},
		}]);
		list.push(['FQDLAXACC/10SEP/AET/IO', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LAX',
				'destinationAirport': 'ACC',
				'modifiers': [{'type': 'travelDates', 'raw': '10SEP'}]
			},
		}]);
		list.push(['FQDLAXACC/10SEP/R,U/AET/IO', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LAX',
				'destinationAirport': 'ACC',
				'modifiers': [{'type': 'travelDates', 'raw': '10SEP'}],
			},
		}]);
		list.push(['FQDLAXACC/10SEP/R,U/AET', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LAX',
				'destinationAirport': 'ACC',
				'modifiers': [{'type': 'travelDates', 'raw': '10SEP'}],
			},
		}]);
		list.push(['FQDLAXACC/10SEP/AET', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LAX',
				'destinationAirport': 'ACC',
				'modifiers': [{'type': 'travelDates', 'raw': '10SEP'}],
			},
		}]);
		list.push(['FQDLOSLAX/1OCT/IO/R,UP', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LOS',
				'destinationAirport': 'LAX',
				'modifiers': [{'type': 'travelDates', 'raw': '1OCT'}],
			},
		}]);
		list.push(['FQDLOSLAX/20SEP/R,-JCB/AET', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LOS',
				'destinationAirport': 'LAX',
				'modifiers': [{'type': 'travelDates', 'raw': '20SEP'}],
			},
		}]);
		list.push(['FQDLOSLAX/20SEP/AET', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LOS',
				'destinationAirport': 'LAX',
				'modifiers': [{'type': 'travelDates', 'raw': '20SEP'}],
			},
		}]);
		list.push(['FQDLOSLAX/1OCT/IO/R+UO', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LOS',
				'destinationAirport': 'LAX',
				'modifiers': [{'type': 'travelDates', 'raw': '1OCT'}],
			},
		}]);
		list.push(['FQDLOSLAX/1OCT/IO', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LOS',
				'destinationAirport': 'LAX',
				'modifiers': [{'type': 'travelDates', 'raw': '1OCT'}],
			},
		}]);
		list.push(['FQDMCOSCL/15JUL18/R,06JUL18,P/ALA/IR/CL', {
			'type': 'fareSearch', 'data': {
				'departureAirport': 'MCO',
				'destinationAirport': 'SCL',
				'modifiers': [
					{
						'type': 'travelDates',
						'parsed': {
							'departureDate': {'raw': '15JUL18', 'full': '2018-07-15'},
						},
					},
					{
						'type': 'generic',
						'parsed': {
							'rSubModifiers': [
								{'type': 'ticketingDate', 'parsed': {'full': '2018-07-06'}},
								{'raw': 'P', 'type': 'fareType', 'parsed': 'public'},
							],
						},
					},
					{'raw': 'ALA', 'type': 'airlines', 'parsed': ['LA']},
					{'raw': 'IR', 'type': 'tripType', 'parsed': 'RT'},
					{'raw': 'CL', 'type': 'bookingClass', 'parsed': 'L'},
				],
			},
		}]);
		list.push(['FQDSFOMEL/19FEB/AVA/R,U', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'SFO',
				'destinationAirport': 'MEL',
				'modifiers': [{'type': 'travelDates', 'raw': '19FEB'}],
			},
		}]);
		list.push(['FQDSFOMEL/19FEB/ANZ/R,U', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'SFO',
				'destinationAirport': 'MEL',
				'modifiers': [{'type': 'travelDates', 'raw': '19FEB'}],
			},
		}]);
		list.push(['FQDWASMNL/10SEP/R,U', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'WAS',
				'destinationAirport': 'MNL',
				'modifiers': [{'type': 'travelDates', 'raw': '10SEP'}],
			},
		}]);
		list.push(['FQDWASCMN/10SEP/R,U', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'WAS',
				'destinationAirport': 'CMN',
				'modifiers': [{'type': 'travelDates', 'raw': '10SEP'}],
			},
		}]);
		list.push(['FQDLONWAS/10SEP/R,U', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LON',
				'destinationAirport': 'WAS',
				'modifiers': [{'type': 'travelDates', 'raw': '10SEP'}],
			},
		}]);
		list.push(['FQDSYDSJC/19AUG18/R,25JUL18,U/AVA/IR', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'SYD',
				'destinationAirport': 'SJC',
				'modifiers': [{'type': 'travelDates', 'raw': '19AUG18'}],
			},
		}]);
		list.push(['FQDSYDSJC/19AUG/AVA/R,U+-ITX', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'SYD',
				'destinationAirport': 'SJC',
				'modifiers': [{'type': 'travelDates', 'raw': '19AUG'}],
			},
		}]);
		list.push(['FQDLAXAKL/17SEP/AVA/R,P', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LAX',
				'destinationAirport': 'AKL',
				'modifiers': [{'type': 'travelDates', 'raw': '17SEP'}],
			},
		}]);
		list.push(['FQDLAXAKL/17SEP/AVA/R,U', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'LAX',
				'destinationAirport': 'AKL',
				'modifiers': [{'type': 'travelDates', 'raw': '17SEP'}],
			},
		}]);
		list.push(['FQDSYDSJC/19AUG/AVA/R,IT', {'type': 'fareSearch',
			'data': {
				'departureAirport': 'SYD',
				'destinationAirport': 'SJC',
				'modifiers': [{'type': 'travelDates', 'raw': '19AUG'}],
			},
		}]);
		list.push(['FQDKIVRIX/20SEP/APS,TK,LO/IR', {
			'type': 'fareSearch', 'data': {
				'departureAirport': 'KIV',
				'destinationAirport': 'RIX',
				'modifiers': [
					{'type': 'travelDates', 'raw': '20SEP'},
					{'type': 'airlines', 'parsed': ['PS', 'TK', 'LO']},
					{'type': 'tripType', 'parsed': 'RT'},
				],
			},
		}]);
		list.push(['FQDKIVRIX/20SEP/A9U,PS/KF', {
			'type': 'fareSearch', 'data': {
				'departureAirport': 'KIV',
				'destinationAirport': 'RIX',
				'modifiers': [
					{'type': 'travelDates', 'raw': '20SEP'},
					{'type': 'airlines', 'parsed': ['9U', 'PS']},
					{'type': 'cabinClass', 'raw': 'KF', 'parsed': 'first'},
				],
			},
		}]);
		list.push(['AD/2JULLASADD/AB6,QR/CN', {
			type: 'airAvailability', data: {
				modifiers: [
					{raw: '2JULLASADD', type: 'flightDetails', parsed: {
						departureDate: {raw: '2JUL'},
						departureAirport: 'LAS',
						destinationAirport: 'ADD',
					}},
					{raw: 'AB6,QR'/*, type: 'airlines'*/},
					{raw: 'CN'/*, type: 'bookingClass'*/},
				],
			},
		}]);
		list.push(['AD26SEPATLSYD/AVA', {
			type: 'airAvailability', data: {
				modifiers: [
					{raw: '26SEPATLSYD', type: 'flightDetails', parsed: {
						departureDate: {raw: '26SEP'},
						departureAirport: 'ATL',
						destinationAirport: 'SYD',
					}},
					{raw: 'AVA'/*, type: 'airlines'*/},
				],
			},
		}]);
		list.push(['AD21AUGACCJFK12A/XABJ/AHF', {
			type: 'airAvailability', data: {
				modifiers: [
					{raw: '21AUGACCJFK12A', type: 'flightDetails', parsed: {
						departureDate: {raw: '21AUG'},
						departureAirport: 'ACC',
						destinationAirport: 'JFK',
						departureTime: {raw: '12A'},
					}},
					{raw: 'XABJ'/*, type: 'connection'*/},
					{raw: 'AHF'/*, type: 'airlines'*/},
				],
			},
		}]);
		list.push(['DF1093*2', {type: 'calculator'}]);

		return list;
	}

	/**
	 * @test
	 * @dataProvider provideCommands
	 */
	testParser(dump, expected) {
		let actual = CmdParser.parse(dump);
		this.assertArrayElementsSubset(expected, actual);
	}

	getTestMapping() {
		return [
			[this.provideCommands, this.testParser],
		];
	}
}

module.exports = CmdParserTest;
