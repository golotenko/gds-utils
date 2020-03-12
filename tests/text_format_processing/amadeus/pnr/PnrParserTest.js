

const php = require('enko-fundamentals/src/Transpiled/php.js');
const PnrParser = require('../../../../src/text_format_processing/amadeus/pnr/PnrParser.js');

class PnrParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js') {
	provideParserData() {
		const list = [];

		// with MCO FA and simple FA - MCO FA should not be
		// in 'tickets' since it is charge document, not ticket
		list.push([
			php.implode(php.PHP_EOL, [
				'--- TST TSM RLR SFP ---',
				'RP/SJC1S212D/SJC1S212D            AA/GS   9SEP17/0358Z   QDDWB6',
				'SJC1S212D/9998WS/9SEP17',
				'  1.CASTRO/ADELFAMONTANO MRS(ADT/01FEB46)',
				'  2  PR 103 U 04NOV 6 LAXMNL HK1  1130P 610A 06NOV  E  PR/GXUQEG',
				'  3  PR2985 U 06NOV 1 MNLTAC HK1   120P 235P 06NOV  E  PR/GXUQEG',
				'  4 MCO PR *** 09SEP/USD 34.00/*SPLIT PAYMENT',
				'     1 FA 079-5051261424/PTPR/USD34.00/08SEP17/SFO1S2195/0557860',
				'       2',
				'     2 FB PAX 0000000000 TTM/M1/RT OK PROCESSED',
				'     3 FM *C*0',
				'     4 FP CASH',
				'  5 APA TRAVIX SUPPLY HUB',
				'  6 TK OK08SEP/SFO1S2195//ETPR',
				'  7 SSR DOCS PR HK1 ////01FEB46/F//CASTRO/ADELFAMONTANO',
				'  8 SSR FQTV PR HK1 PR203833593',
				' 33 SSR FQTV PR HK/ PS1005775190/3',
				'  9 SSR CTCE PR HK1 FROICONAD46//YAHOO.COM',
				' 10 SSR CTCM PR HK1 16197985412',
				' 11 SSR ADTK 1A ADV TKT BY 09SEP17 2033 SJC OR SEG WILL BE CXLD',
				' 12 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
				'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
				'       GGAMAUSHAZ/S2',
				' 13 RM *IRF-VUS-2804417',
				' 14 RM TRANSACTION_ID:912000B6-1F3F-4EEE-A22B-CFAB0823C7A3',
				' 15 RM CREATED BY SUPPLY_HUB',
				' 16 RM *F* FARE : PUBLISHED FRC PR IT FARE NO',
				' 17 RM ISSUE TICKET TO INTUSA-A PLEASE',
				' 18 RM *U*NOTE NON MOR PSE DO NOT CHANGE FOP',
				' 19 RM NO MATCHING RULES FOUND',
				' 20 RM *CUSTID-VYUS',
				' 21 RM *Y* TTS2 09SEP-0538 QDDWB6 DISPATCHED FROM AMSAA31AT TO',
				'       INTUSA-M = SJC1S212D Q79C 0',
				' 22 RM PICCCADT- 538.02',
				' 23 RM *Y* TTS2 09SEP-0554 QDDWB6 DISPATCHED FROM AMSAA31AT TO',
				'       INTUSA-A = SFO1S2195 Q81C 0',
				' 24 FA PAX 079-8693111874/ETPR/USD572.02/08SEP17/SFO1S2195/05578',
				'       602/S2-3',
				' 25 FB PAX 0000000000 TTP/ET/RT/EXCH OK ETICKET - USD572.02/S2-3',
				' 26 FE PAX BUDGET/NONEND/PRTLNONREF 50PCT MILES/PNLTIES APPLY',
				'       -BG:PR/S2-3',
				' 27 FK AMSAA3102',
				' 28 FM *M*5',
				' 29 FO PAX 079-5051261424SFO08SEP17/05578602/079-50512614246C1*B',
				'       34.00/S2-3',
				' 30 FP PAX O/CASH+/CCVI4111111111111111/0119/USD538.02/A05857A',
				'       /S2-3',
				' 31 FT *US17GPRD2',
				' 32 FV PAX PR/S2-3',
				' ',
			]), {
				'parsed': {
					'pnrInfo': {
						'responsibleOfficeId': 'SJC1S212D',
						'queueingOfficeId': 'SJC1S212D',
						'agentInitials': 'AA',
						'dutyCode': 'GS',
						'recordLocator': 'QDDWB6',
						'date': {
							'raw': '9SEP17',
							'parsed': '2017-09-09',
						},
						'time': {
							'raw': '0358',
							'parsed': '03:58',
						},
					},
					'passengers': [
						{
							'firstName': 'ADELFAMONTANO MRS',
							'lastName': 'CASTRO',
							'dob': {'raw': '01FEB46', 'parsed': '1946-02-01'},
							'ptc': 'ADT',
							'nameNumber': {'fieldNumber': '1', 'isInfant': false, 'absolute': 1},
						},
					],
					'ssrData': [
						{
							'lineNumber': '7',
							'ssrCode': 'DOCS',
							'airline': 'PR',
							'status': 'HK',
							'statusNumber': '1',
							'content': '////01FEB46/F//CASTRO/ADELFAMONTANO',
							'data': {
								'travelDocType': '',
								'issuingCountry': '',
								'travelDocNumber': '',
								'nationality': '',
								'dob': {
									'raw': '01FEB46',
									'parsed': '1946-02-01',
								},
								'gender': 'F',
								'paxIsInfant': false,
								'expirationDate': {
									'raw': '',
									'parsed': null,
								},
								'lastName': 'CASTRO',
								'firstName': 'ADELFAMONTANO',
							},
						},
						{
							'lineNumber': '8',
							'ssrCode': 'FQTV',
							'airline': 'PR',
							'status': 'HK',
							'statusNumber': '1',
							'content': 'PR203833593',
							'data': {
								'airline': 'PR',
								'flyerNumber': '203833593',
							},
						},
						{
							'lineNumber': '33',
							'ssrCode': 'FQTV',
							'airline': 'PR',
							'status': 'HK',
							'statusNumber': '',
							'content': '/ PS1005775190/3',
							'data': {
								'airline': 'PS',
								'flyerNumber': '1005775190',
							},
						},
						{lineNumber:  9, ssrCode: 'CTCE', airline: 'PR'},
						{lineNumber: 10, ssrCode: 'CTCM', airline: 'PR'},
						{lineNumber: 11, ssrCode: 'ADTK', airline: '1A'},
					],
					'mcoRecords': [
						{
							'lineNumber': '4',
							'airline': 'PR',
							'date': {'raw': '9SEP', 'parsed': '09-09'},
							'currency': 'USD',
							'amount': '34.00',
							'service': 'SPLIT PAYMENT',
							'paxNum': null,
							'details': {
								'document': {
									'lineNumber': '1',
									'airlineNumber': '079',
									'documentNumber': '5051261424',
									'ticketType': 'P',
									'status': 'T',
									'airline': 'PR',
									'currency': 'USD',
									'amount': '34.00',
									'transactionDt': {'raw': '08SEP17', 'parsed': '2017-09-08'},
									'officeId': 'SFO1S2195',
									'arcNumber': '05578602',
									'unparsedTokens': [],
								},
								'unparsedLines': [
									'  2 FB PAX 0000000000 TTM/M1/RT OK PROCESSED',
									'  3 FM *C*0',
								],
								'formOfPayment': {
									'lineNumber': '4',
									'data': [
										{
											'isOld': false,
											'isForInf': false,
											'formOfPayment': 'cash',
										},
									],
								},
							},
						},
					],
					'tickets': [
						// MCO FA should not be here
						{
							'lineNumber': '24',
							'airlineNumber': '079',
							'documentNumber': '8693111874',
							'ticketType': 'E',
							'status': 'T',
							'airline': 'PR',
							'currency': 'USD',
							'amount': '572.02',
							'transactionDt': {'raw': '08SEP17', 'parsed': '2017-09-08'},
							'officeId': 'SFO1S2195',
							'arcNumber': '05578602',
							'segmentStart': '2',
							'segmentEnd': '3',
							'unparsedTokens': [],
						},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'RP/SFO1S2195/SFO1S2195            NI/GS  18AUG16/1833Z   2RFU8B',
				'SFO1S2195/2005SI/17AUG16',
				'  1.SAJERY/CECELIA',
				'  2  W3 303 L 28AUG 7 ROBLOS HK1  1140A 425P 28AUG  E  W3/CXPNQ6',
				'  3  W3 107 L 28AUG 7 LOSJFK HK1  1130P 550A 29AUG  E  W3/CXPNQ6',
				'  4 AP SFO 415 123-4567-A',
				'  5 TK OK18AUG/SFO1S2195//ETW3',
				'  6 SSR OTHS 1A 1W30107L28AUGLOSJFK.SECURE FLT BKD PLS ADV SSR',
				'  7 SSR OTHS 1A DOCS OR TKT RESTRICTD',
				'  8 SSR OTHS 1A SECURE FLTS BKD PLS ADV SSR DOCS ELSE TKTG',
				'       RESTRICTED',
				'  9 SSR OTHS 1A PL ADV TKNO FOR ALL SEGMENTS AND PSGRS BY',
				' 10 SSR OTHS 1A 1900Z/20AUG ELSE WILL AUTO XXL PNR',
				' 11 SSR DOCS W3 HK1 ////28JUL84/F//SAJERY/CECELIA',
				' 12 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
				'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
				'       GGAMAUSHAZ/S3',
				' 13 FA PAX 725-7892926310/ETW3/18AUG16/SFO1S2195/05578602/S2-3',
				' 14 FB PAX 1800002566 TTP/ET/EXCH OK ETICKET/S2-3',
				' 15 FE *M*W3ARR0816DC415/VALID ON W3/5K HIFLY ONLY',
				'       XLE/CHG/NOSHOW FEE APPLIES-BG W3',
				' 16 FM *M*55.00A',
				'',
				' 17 FO 725-7797289737SFO04MAR16/05578602/725-77972897373E3*B668.',
				'       00/X627.16/C450.00',
				' 18 FP O/CCCA5111111111111111+/CHECK',
			]),
			{
				'parsed': {
					'pnrInfo': {
						'responsibleOfficeId': 'SFO1S2195',
						'queueingOfficeId': 'SFO1S2195',
						'agentInitials': 'NI',
						'dutyCode': 'GS',
						'recordLocator': '2RFU8B',
					},
					'pnrCreationInfo': {
						'officeId': 'SFO1S2195',
						'agentNumber': '2005',
						'agentInitials': 'SI',
						'date': {'parsed': '2016-08-17'},
					},
					'itinerary': [
						{
							'lineNumber': '2',
							'airline': 'W3',
							'flightNumber': '303',
							'bookingClass': 'L',
							'departureDate': {
								'raw': '28AUG',
								'parsed': '08-28',
							},
							'dayOfWeek': '7',
							'departureAirport': 'ROB',
							'destinationAirport': 'LOS',
							'segmentStatus': 'HK',
							'seatCount': '1',
							'departureTime': {
								'raw': '1140A',
								'parsed': '11:40',
							},
							'destinationTime': {
								'raw': '425P',
								'parsed': '16:25',
							},
							'destinationDate': {
								'raw': '28AUG',
								'parsed': '08-28',
							},
							'confirmationAirline': 'W3',
							'confirmationNumber': 'CXPNQ6',
							'raw': '  2  W3 303 L 28AUG 7 ROBLOS HK1  1140A 425P 28AUG  E  W3/CXPNQ6',
						},
						{
							'lineNumber': '3',
							'airline': 'W3',
							'flightNumber': '107',
							'bookingClass': 'L',
							'departureDate': {
								'raw': '28AUG',
								'parsed': '08-28',
							},
							'dayOfWeek': '7',
							'departureAirport': 'LOS',
							'destinationAirport': 'JFK',
							'segmentStatus': 'HK',
							'seatCount': '1',
							'departureTime': {
								'raw': '1130P',
								'parsed': '23:30',
							},
							'destinationTime': {
								'raw': '550A',
								'parsed': '05:50',
							},
							'destinationDate': {
								'raw': '29AUG',
								'parsed': '08-29',
							},
							'confirmationAirline': 'W3',
							'confirmationNumber': 'CXPNQ6',
							'raw': '  3  W3 107 L 28AUG 7 LOSJFK HK1  1130P 550A 29AUG  E  W3/CXPNQ6',
						},
					],
					'passengers': [
						{
							'success': true,
							'nameNumber': {'raw': '1.', 'absolute': 1},
							'firstName': 'CECELIA',
							'lastName': 'SAJERY',
						},
					],
					'formOfPayment': [
						{
							'lineNumber': '18',
							'data': [
								{
									'isOld': true,
									'ccType': 'CA',
									'ccNumber': '5111111111111111',
									'formOfPayment': 'creditCard',
								},
								{
									'isOld': false,
									'formOfPayment': 'cash',
								},
							],
						},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'RP/SFO1S2195/SFO1S2195            NI/GS  10JUL16/0007Z   YL5C2V',
				'SFO1S2195/0041AA/8JUL16',
				'  1.IHEUKWUMERE/CHIDIEBERE',
				'  2  W3 108 M 13AUG 6 JFKLOS         FLWN',
				'  3  W3 107 O 04SEP 7 LOSJFK HK1  1130P 550A 05SEP  E  W3/ISZYF2',
				'  4 AP SFO 888 585-2727 - ITN CORP. - A',
				'  5 TK OK09JUL/SFO1S2195//ETW3',
				'  6 SSR OTHS 1A 1W30107O04SEPLOSJFK.SECURE FLT BKD PLS ADV SSR',
				'  7 SSR OTHS 1A DOCS OR TKT RESTRICTD',
				'  8 SSR OTHS 1A SECURE FLTS BKD PLS ADV SSR DOCS ELSE TKTG',
				'       RESTRICTED',
				'  9 SSR OTHS 1A PL ADV TKNO FOR ALL SEGMENTS AND PSGRS BY',
				' 10 SSR OTHS 1A 2100Z/22JUL ELSE WILL AUTO XXL PNR',
				' 11 SSR DOCS W3 HK1 ////13NOV75/M//IHEUKWUMERE/CHIDIEBERE',
				' 12 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
				'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
				'       GGAMAUSHAZ/S2-3',
				' 13 FA PAX 725-7892926298/ETW3/09JUL16/SFO1S2195/05578602/S2-3',
				' 14 FB PAX 0900002542 TTP/ET/RT OK ETICKET/S2-3',
				' 15 FE PAX VALID ON W3/5K HIFLY ONLY XLE/CHG/NOSHOW FEE',
				'       APPLIES-BG:W3/S2-3',
				' 16 FM *M*81.50A',
				' 17 FP PAX CCVI4111111111111111/1018/A070720/S2-3',
				'',
				' 18 FV PAX W3/S2-3',
			]),
			{
				'parsed': {
					'pnrInfo': {
						'agentInitials': 'NI',
						'recordLocator': 'YL5C2V',
					},
					'itinerary': [
						{
							'lineNumber': '2',
							'segmentType': 'FLWN',
							'airline': 'W3',
							'flightNumber': '108',
							'bookingClass': 'M',
							'departureDate': {
								'raw': '13AUG',
								'parsed': '08-13',
							},
							'dayOfWeek': '6',
							'departureAirport': 'JFK',
							'destinationAirport': 'LOS',
							'raw': '  2  W3 108 M 13AUG 6 JFKLOS         FLWN',
						},
						{
							'lineNumber': '3',
							'segmentType': 'AIR',
							'airline': 'W3',
							'flightNumber': '107',
							'bookingClass': 'O',
							'departureDate': {
								'raw': '04SEP',
								'parsed': '09-04',
							},
							'dayOfWeek': '7',
							'departureAirport': 'LOS',
							'destinationAirport': 'JFK',
							'segmentStatus': 'HK',
							'seatCount': '1',
							'departureTime': {
								'raw': '1130P',
								'parsed': '23:30',
							},
							'destinationTime': {
								'raw': '550A',
								'parsed': '05:50',
							},
							'destinationDate': {
								'raw': '05SEP',
								'parsed': '09-05',
							},
							'confirmationAirline': 'W3',
							'confirmationNumber': 'ISZYF2',
							'raw': '  3  W3 107 O 04SEP 7 LOSJFK HK1  1130P 550A 05SEP  E  W3/ISZYF2',
						},
					],
					'passengers': [
						{
							'success': true,
							'nameNumber': {'raw': '1.', 'absolute': 1},
							'firstName': 'CHIDIEBERE',
							'lastName': 'IHEUKWUMERE',
						},
					],
					'formOfPayment': [
						{
							'lineNumber': '17',
							'data': [
								{
									'ccType': 'VI',
									'ccNumber': '4111111111111111',
									'expirationDate': {'parsed': '2018-10', 'raw': '1018'},
									'formOfPayment': 'creditCard',
								},
							],
						},
					],
				},
			},
		]);

		// FA with -44 after ticket number
		list.push([
			php.implode(php.PHP_EOL, [
				'--- TST RLR SFP ---',
				'RP/SJC1S212D/SJC1S212D            ZM/SU   1MAR18/0839Z   PM2IK9',
				'SJC1S212D/9998WS/23DEC17',
				'  1.THOMPSON/DAVIDMICHAEL MR(ADT/01MAY88)',
				'  2.THOMPSON/KYLIEDANIELLE MRS(ADT/12SEP89)',
				'  3  UA4825 S 25JUN 1 XNAORD HK2  1120A 115P 25JUN  E  UA.D52JST',
				'  4  LH7767 S 25JUN 1 ORDFCO HK2   350P 825A 26JUN  E  LH/PM2IK9',
				'  5  ARNK',
				'  6  LH1753 S 09JUL 1 ATHMUC HK2   720P 850P 09JUL  E  LH/PM2IK9',
				'  7  LH 436 S 10JUL 2 MUCORD HK2   900A1210P 10JUL  E  LH/PM2IK9',
				'  8  UA3963 S 10JUL 2 ORDXNA HK2   335P 520P 10JUL  E  UA.D52JST',
				'  9 MIS 1A HK2 SFO 28DEC-PRESERVEPNR',
				' 10 AP =26FEB/KB/ PLS REISSUE FOC DUE TO AIRLINE SCHEDULE CHANGE',
				' 11 APA TRAVIX SUPPLY HUB',
				' 12 TK PAX OK28FEB/SFO1S2195//ETLH/S3-4,6-8/P2',
				' 13 TK OK28FEB/SFO1S2195//ETLH',
				' 14 SSR DOCS LH HK1 ////01MAY88/M//THOMPSON/DAVIDMICHAEL/P1',
				' 15 SSR DOCS LH HK1 ////12SEP89/F//THOMPSON/KYLIEDANIELLE/P2',
				' 16 SSR CTCE LH HK2 DAVID..7896//YAHOO.COM',
				' 17 SSR CTCM LH HK2 18706883067',
				' 18 SSR OTHS 1A UA SEGS XLD - CANCEL AND REMOVE HX SEGMENTS',
				' 19 SSR DOCS LH HK1 ////01MAY88/M//THOMPSON/DAVIDMICHAEL/P1',
				' 20 SSR DOCS LH HK1 ////12SEP89/F//THOMPSON/KYLIEDANIELLE/P2',
				' 21 SSR DOCS UA HK1 ////12SEP89/F//THOMPSON/KYLIEDANIELLE/P2',
				' 22 SSR DOCS UA HK1 ////01MAY88/M//THOMPSON/DAVIDMICHAEL/P1',
				' 23 RM *IRF-VUS-3777776',
				' 24 RM TRANSACTION_ID:3D3C6E66-EC19-454A-BC97-B71AEE095A00',
				' 25 RM CREATED BY SUPPLY_HUB',
				' 26 RM *F* FARE : PUBLISHED FRC LH IT FARE NO',
				' 27 RM ISSUE TICKET TO INTUSA-A PLEASE',
				' 28 RM *U*NOTE NON MOR PSE DO NOT CHANGE FOP',
				' 29 RM *CUSTID-VYUS',
				' 30 RM *Y* TTS2 23DEC-2219 PM2IK9 DISPATCHED FROM AMSAA31AT TO',
				'       INTUSA-M = SJC1S212D Q79C 0',
				' 31 RM PICCCADT-1467.92',
				' 32 RM *Y* TTS2 23DEC-2230 PM2IK9 DISPATCHED FROM AMSAA31AT TO',
				'       INTUSA-A = SFO1S2195 Q81C 0',
				' 33 RM SEVERE: DEPARTURE AIRPORT CODE MISMATCH ON SEGMENT INDEX',
				'       0 - XNA != ORD!',
				' 34 RM SEVERE: NUMBER OF SEGMENTS DID NOT MATCH!',
				' 35 RM SEVERE: NUMBER OF SEGMENTS DID NOT MATCH!',
				' 36 RM PLS DO REBOOK FOR UA SEGMENTS/CHECK E-MAIL',
				' 37 RM FOR ADDITIONAL INFORMATION',
				' 38 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
				'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
				'       GGAMAUSHAZ/S3-4,7-8',
				' 39 RM MINOR: CLASS OF SERVICE MISMATCH ON SEGMENT INDEX 0 - V',
				'       != S!',
				' 40 RM E WAS REISSUED',
				' 41 RM *S*/BLR/26FEB/PAVITHRA/REBOOKED FLT CLOSE TO ORIGINAL',
				'       TIME OPERATED FLT/REISSUE REQ',
				' 42 RM *T*26FEB/SENT TO CONSOLIDATOR FOR REISSUE',
				' 43 RM *A*/01MAR/EXC/ REISSUE DONE',
				' 44 FA PAX 220-7082974443-44/ETLH/28FEB18/SFO1S2195/05578602',
				'       /S3-4,6-8/P2',
				' 45 FA PAX 220-7082974445-46/ETLH/28FEB18/SFO1S2195/05578602',
				'       /S3-4,6-8/P1',
				' 46 FB PAX 0000000000 TTP/ET/EXCH/T3/RT OK ETICKET/S3-4,6-8/P2',
				' 47 FB PAX 0000000000 TTP/ET/EXCH/T4/RT OK ETICKET/S3-4,6-8/P1',
				' 48 FE PAX *M*55564216 REFTHRUAG/NONEND/NONRERTE/LH/UA/AC/OS/SN/',
				'       LX ONLY/S3-4,6-8/P1-2',
				' 49 FG PAX 0000000000 AMSAA3102/S3-4,6-8/P2',
				' 50 FG PAX 0000000000 AMSAA3102/S3-4,6-8/P1',
				' 51 FK AMSAA3102',
				' 52 FM *M*56.00A',
				' 53 FO 220-7073877876SFO28FEB18/05578602/220-70738778763E1*B1011',
				'       .00/X456.92/C00.00/P1',
				' 54 FO 220-7073877878SFO28FEB18/05578602/220-70738778785E1*B1011',
				'       .00/X456.92/C00.00/P2',
				' 55 FP O/CCVI4111111111111111/1122',
				' 56 FT *BT294UA',
				' 57 FV LH',
				' ',
			]),
			{
				'parsed': {
					'pnrInfo': {'recordLocator': 'PM2IK9'},
					'itinerary': [
						{'departureAirport': 'XNA', 'destinationAirport': 'ORD'},
						{'departureAirport': 'ORD', 'destinationAirport': 'FCO'},
						{'departureAirport': 'ATH', 'destinationAirport': 'MUC'},
						{'departureAirport': 'MUC', 'destinationAirport': 'ORD'},
						{'departureAirport': 'ORD', 'destinationAirport': 'XNA'},
						{'lineNumber': '9', 'segmentType': 'OTH'},
					],
					'passengers': [
						{'firstName': 'DAVIDMICHAEL MR', 'lastName': 'THOMPSON'},
						{'firstName': 'KYLIEDANIELLE MRS', 'lastName': 'THOMPSON'},
					],
					'tickets': [
						{
							'lineNumber': '44',
							'airlineNumber': '220',
							'documentNumber': '7082974443',
							'ticketType': 'E',
							'airline': 'LH',
							'transactionDt': {'raw': '28FEB18', 'parsed': '2018-02-28'},
							'officeId': 'SFO1S2195',
							'arcNumber': '05578602',
							'unparsedTokens': ['S3-4,6-8', 'P2'],
						},
						{
							'lineNumber': '45',
							'airlineNumber': '220',
							'documentNumber': '7082974445',
							'ticketType': 'E',
							'airline': 'LH',
							'transactionDt': {'raw': '28FEB18', 'parsed': '2018-02-28'},
							'officeId': 'SFO1S2195',
							'arcNumber': '05578602',
							'unparsedTokens': ['S3-4,6-8', 'P1'],
						},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'RP/SFO1S2195/SFO1S2195                             AA/GS 1JUL16/1804Z           X7PXMD',
				'',
				'SFO1S2195/2005SI/1JUL16',
				'  1.OCLOO/ROSEMOND VERAARYEETEY',
				'  2  W3 108 U 17SEP 6 JFKLOS HK1  1225P 355A 18SEP  E  W3/JXWCL2',
				'  3  W3 302 T 18SEP 7 LOSACC HK1   720A 720A 18SEP  E  W3/JXWCL2',
				'  4 AP SFO 415 123-4567-A',
				'  5 TK OK01JUL/SFO1S2195//ETW3',
				'  6 SSR OTHS 1A SECURE FLTS BKD PLS ADV SSR DOCS ELSE TKTG',
				'       RESTRICTED',
				'  7 SSR OTHS 1A PL ADV TKNO FOR ALL SEGMENTS AND PSGRS BY',
				'  8 SSR OTHS 1A 0030Z/22JUL ELSE WILL AUTO XXL PNR',
				'  9 SSR DOCS W3 HK1 ////15AUG67/F//OCLOO/ROSEMOND/VERAARYEETEY',
				' 10 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
				'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
				'       GGAMAUSHAZ/S2',
				' 11 FA PAX 725-7892926294/ETW3/USD479.90/01JUL16/SFO1S2195/05578',
				'       602/S2-3',
				' 12 FB PAX 0100002538 TTP/ET/RT OK ETICKET/S2-3',
				' 13 FE PAX VLD W3/5K ONLY/NONREF CHG/NOSHOW FEE APPLIES -BG:W3',
				'       /S2-3',
				' 14 FM *M*8',
				' 15 FP PAX CCCA5111111111111111/0717/A00146Z/S2-3',
				' 16 FV PAX W3/S2-3',
			]),
			{
				'parsed': {
					'pnrInfo': {
						'responsibleOfficeId': 'SFO1S2195',
						'queueingOfficeId': 'SFO1S2195',
						'agentInitials': 'AA',
						'dutyCode': 'GS',
						'recordLocator': 'X7PXMD',
					},
					'pnrCreationInfo': {
						'officeId': 'SFO1S2195',
						'agentNumber': '2005',
						'agentInitials': 'SI',
						'date': {'parsed': '2016-07-01'},
					},
					'itinerary': [
						{
							'lineNumber': '2',
							'segmentType': 'AIR',
							'airline': 'W3',
							'flightNumber': '108',
							'bookingClass': 'U',
							'departureDate': {
								'raw': '17SEP',
								'parsed': '09-17',
							},
							'dayOfWeek': '6',
							'departureAirport': 'JFK',
							'destinationAirport': 'LOS',
							'segmentStatus': 'HK',
							'seatCount': '1',
							'departureTime': {
								'raw': '1225P',
								'parsed': '12:25',
							},
							'destinationTime': {
								'raw': '355A',
								'parsed': '03:55',
							},
							'destinationDate': {
								'raw': '18SEP',
								'parsed': '09-18',
							},
							'confirmationAirline': 'W3',
							'confirmationNumber': 'JXWCL2',
							'raw': '  2  W3 108 U 17SEP 6 JFKLOS HK1  1225P 355A 18SEP  E  W3/JXWCL2',
						},
						{
							'lineNumber': '3',
							'segmentType': 'AIR',
							'airline': 'W3',
							'flightNumber': '302',
							'bookingClass': 'T',
							'departureDate': {
								'raw': '18SEP',
								'parsed': '09-18',
							},
							'dayOfWeek': '7',
							'departureAirport': 'LOS',
							'destinationAirport': 'ACC',
							'segmentStatus': 'HK',
							'seatCount': '1',
							'departureTime': {
								'raw': '720A',
								'parsed': '07:20',
							},
							'destinationTime': {
								'raw': '720A',
								'parsed': '07:20',
							},
							'destinationDate': {
								'raw': '18SEP',
								'parsed': '09-18',
							},
							'confirmationAirline': 'W3',
							'confirmationNumber': 'JXWCL2',
							'raw': '  3  W3 302 T 18SEP 7 LOSACC HK1   720A 720A 18SEP  E  W3/JXWCL2',
						},
					],
					'passengers': [
						{
							'success': true,
							'nameNumber': {'raw': '1.', 'absolute': 1},
							'firstName': 'ROSEMOND VERAARYEETEY',
							'lastName': 'OCLOO',
						},
					],
					'tickets': [
						{
							'airlineNumber': '725',
							'documentNumber': '7892926294',
							'ticketType': 'E',
							'status': 'T',
							'airline': 'W3',
							'currency': 'USD',
							'amount': '479.90',
							'transactionDt': {
								'raw': '01JUL16',
								'parsed': '2016-07-01',
							},
							'officeId': 'SFO1S2195',
							'arcNumber': '05578602',
							'segmentStart': '2',
							'segmentEnd': '3',
						},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'RP/SFO1S2195/SFO1S2195            W3/RM  14JUN16/1325Z   6VRX73',
				'SFO1S2195/5000JI/23MAY16',
				'  1.IKWUEGBU/RICHARD C',
				'  2  W3 108 M 13JUN 1 JFKLOS         FLWN',
				'  3  W3 107 O 10JUL 7 LOSJFK         FLWN',
				'  4 MIS 1A HK1 SFO 30JAN-EXCHANGE OF 3AURA2',
				'  5 AP SFO 415 123-4567-A',
				'  6 TK OK24MAY/SFO1S2195//ETW3',
				'  7 SSR DOCS W3 HK1 ////14JUN52/M//IKWUEGBU/RICHARD C',
				'  8 SSR OTHS 1A 1W30107X10JULLOSJFK.SECURE FLT BKD PLS ADV SSR',
				'  9 SSR OTHS 1A DOCS OR TKT RESTRICTD',
				' 10 SSR OTHS 1A SECURE FLTS BKD PLS ADV SSR DOCS ELSE TKTG',
				'       RESTRICTED',
				' 11 SSR OTHS 1A PL ADV TKNO FOR ALL SEGMENTS AND PSGRS BY',
				' 12 SSR OTHS 1A 2000Z/30MAY ELSE WILL AUTO XXL PNR',
				' 13 SSR OTHS 1A 1W30107O10JULLOSJFK.SECURE FLT BKD PLS ADV SSR',
				' 14 SSR OTHS 1A 2130Z/31MAY ELSE WILL AUTO XXL PNR',
				' 15 SSR OTHS 1A ADV ADC/REVAL TKT NBR FOR SEG AND PSGR',
				' 16 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
				'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
				'       GGAMAUSHAZ/S2-3',
				' 17 FA PAX 725-7797289957/ETW3/24MAY16/SFO1S2195/05578602/S2-3',
				' 18 FB PAX 2400002453 TTP/ET/EXCH/T1/RT OK ETICKET/S2-3',
				'',
				' 19 FE PAX VALID ON W3/5K HIFLY ONLY XLE/CHG/NOSHOW FEE',
				'       APPLIES-BG:W3/S2-3',
				' 20 FM *M*81.00A',
				' 21 FO 725-7797289787SFO16MAR16/05578602/725-77972897875E1*B236.',
				'       00/X582.16/C250.00',
				' 22 FP O/CHECK+/CHECK',
				' 23 FV PAX W3/S2-3',
			]),
			{
				'parsed': {
					'pnrInfo': {
						'agentInitials': 'W3',
						'recordLocator': '6VRX73',
					},
					'itinerary': [
						{
							'lineNumber': '2',
							'segmentType': 'FLWN',
							'airline': 'W3',
							'flightNumber': '108',
							'bookingClass': 'M',
							'departureDate': {
								'raw': '13JUN',
								'parsed': '06-13',
							},
							'dayOfWeek': '1',
							'departureAirport': 'JFK',
							'destinationAirport': 'LOS',
							'raw': '  2  W3 108 M 13JUN 1 JFKLOS         FLWN',
						},
						{
							'lineNumber': '3',
							'segmentType': 'FLWN',
							'airline': 'W3',
							'flightNumber': '107',
							'bookingClass': 'O',
							'departureDate': {
								'raw': '10JUL',
								'parsed': '07-10',
							},
							'dayOfWeek': '7',
							'departureAirport': 'LOS',
							'destinationAirport': 'JFK',
							'raw': '  3  W3 107 O 10JUL 7 LOSJFK         FLWN',
						},
					],
					'passengers': [
						{
							'success': true,
							'nameNumber': {'raw': '1.', 'absolute': 1},
							'firstName': 'RICHARD C',
							'lastName': 'IKWUEGBU',
						},
					],
					'formOfPayment': [
						{
							'lineNumber': '22',
							'data': [
								{'isOld': true, 'formOfPayment': 'cash'},
								{'isOld': false, 'formOfPayment': 'cash'},
							],
						},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'RP/SFO1S2195/SFO1S2195            AA/GS  20AUG16/1635Z   43DJ9D',
				'SFO1S2195/4000NI/19APR16',
				'  1.HABTEMARIAM/BINYAM',
				'  2  QR 708 O 19AUG 5 IADDOH         FLWN',
				'  3  QR1427 O 20AUG 6 DOHADD         FLWN',
				'  4  QR1428 O 04SEP 7*ADDDOH HK1   140A 535A 04SEP  E  QR/43DJ9D',
				'  5  QR 707 O 04SEP 7*DOHIAD HK1   815A 320P 04SEP  E  QR/43DJ9D',
				'  6 AP SFO 888 585-2727 - ITN CORP. - A',
				'  7 TK OK19APR/SFO1S2195//ETQR',
				'  8 SSR DOCS QR HK1 ////23MAY76/M//HABTEMARIAM/BINYAM',
				'  9 SSR DOCS QR HK1 P/USA/498670229/USA/23MAY76/M/07AUG22/HABTEM',
				'       ARIAM/BINYAM MEKONNEN',
				' 10 SSR DOCS QR HK1 P/USA/498670229/USA/23MAY76/M/07AUG22/HABTEM',
				'       ARIAM/BINYAM MEKONNEN/S2',
				' 11 SSR DOCS QR HK1 P/USA/498670229/USA/23MAY76/M/07AUG22/HABTEM',
				'       ARIAM/BINYAM MEKONNEN/S3',
				' 12 /SSR XBGS QR HK1/S2',
				' 13 /SSR XBGS QR HK1/S3',
				' 14 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
				'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
				'       GGAMAUSHAZ/S2,5',
				' 15 FA PAX 157-7797289907/ETQR/19APR16/SFO1S2195/05578602/S2-5',
				' 16 FA PAX 157-8201820530/DTQR/USD250.00/19AUG16/IADQR0001/09828',
				'',
				' 17 FB PAX 1900002390 TTP/ET/EXCH OK ETICKET/S2-5',
				' 18 FB PAX 1900066229 TTM/RT OK EMD/E12-13',
				' 19 FE PAX /C1-4 NON END/NONREF CHANGE FEE APPLIESVALID ON QR',
				'       ONLY -BG:QR/S2-5',
				' 20 FM *M*36.00A',
				' 21 FO 157-7729995970SFO25FEB16/05578602/157-77299959705E1*B183.',
				'       00/X567.16/C100.00',
				' 22 FP PAX O/CCCA5111111111111111+/CCCA5111111111111111/0319/A07',
				'       4722/S2-5',
				' 23 FV PAX QR/S2-5',
			]),
			{
				'parsed': {
					'pnrInfo': {
						'agentInitials': 'AA',
						'recordLocator': '43DJ9D',
					},
					'itinerary': [
						{
							'lineNumber': '2',
							'segmentType': 'FLWN',
							'airline': 'QR',
							'flightNumber': '708',
							'bookingClass': 'O',
							'departureDate': {
								'raw': '19AUG',
								'parsed': '08-19',
							},
							'dayOfWeek': '5',
							'departureAirport': 'IAD',
							'destinationAirport': 'DOH',
							'raw': '  2  QR 708 O 19AUG 5 IADDOH         FLWN',
						},
						{
							'lineNumber': '3',
							'segmentType': 'FLWN',
							'airline': 'QR',
							'flightNumber': '1427',
							'bookingClass': 'O',
							'departureDate': {
								'raw': '20AUG',
								'parsed': '08-20',
							},
							'dayOfWeek': '6',
							'departureAirport': 'DOH',
							'destinationAirport': 'ADD',
							'raw': '  3  QR1427 O 20AUG 6 DOHADD         FLWN',
						},
						{
							'lineNumber': '4',
							'segmentType': 'AIR',
							'airline': 'QR',
							'flightNumber': '1428',
							'bookingClass': 'O',
							'departureDate': {
								'raw': '04SEP',
								'parsed': '09-04',
							},
							'dayOfWeek': '7',
							'isMarried': true,
							'departureAirport': 'ADD',
							'destinationAirport': 'DOH',
							'segmentStatus': 'HK',
							'seatCount': '1',
							'departureTime': {
								'raw': '140A',
								'parsed': '01:40',
							},
							'destinationTime': {
								'raw': '535A',
								'parsed': '05:35',
							},
							'destinationDate': {
								'raw': '04SEP',
								'parsed': '09-04',
							},
							'confirmationAirline': 'QR',
							'confirmationNumber': '43DJ9D',
							'raw': '  4  QR1428 O 04SEP 7*ADDDOH HK1   140A 535A 04SEP  E  QR/43DJ9D',
						},
						{
							'lineNumber': '5',
							'segmentType': 'AIR',
							'airline': 'QR',
							'flightNumber': '707',
							'bookingClass': 'O',
							'departureDate': {
								'raw': '04SEP',
								'parsed': '09-04',
							},
							'dayOfWeek': '7',
							'isMarried': true,
							'departureAirport': 'DOH',
							'destinationAirport': 'IAD',
							'segmentStatus': 'HK',
							'seatCount': '1',
							'departureTime': {
								'raw': '815A',
								'parsed': '08:15',
							},
							'destinationTime': {
								'raw': '320P',
								'parsed': '15:20',
							},
							'destinationDate': {
								'raw': '04SEP',
								'parsed': '09-04',
							},
							'confirmationAirline': 'QR',
							'confirmationNumber': '43DJ9D',
							'raw': '  5  QR 707 O 04SEP 7*DOHIAD HK1   815A 320P 04SEP  E  QR/43DJ9D',
						},
					],
					'passengers': [
						{
							'success': true,
							'nameNumber': {'raw': '1.', 'absolute': 1},
							'firstName': 'BINYAM',
							'lastName': 'HABTEMARIAM',
						},
					],
					'ssrData': [
						{
							'lineNumber': '8',
							'ssrCode': 'DOCS',
							'airline': 'QR',
							'status': 'HK',
							'statusNumber': '1',
							'data': {
								'travelDocType': '',
								'issuingCountry': '',
								'travelDocNumber': '',
								'nationality': '',
								'dob': {
									'raw': '23MAY76',
									'parsed': '1976-05-23',
								},
								'gender': 'M',
								'paxIsInfant': false,
								'expirationDate': {
									'raw': '',
									'parsed': null,
								},
								'lastName': 'HABTEMARIAM',
								'firstName': 'BINYAM',
							},
						},
						{
							'lineNumber': '9',
							'ssrCode': 'DOCS',
							'airline': 'QR',
							'status': 'HK',
							'statusNumber': '1',
							'data': {
								'travelDocType': 'P',
								'issuingCountry': 'USA',
								'travelDocNumber': '498670229',
								'nationality': 'USA',
								'dob': {
									'raw': '23MAY76',
									'parsed': '1976-05-23',
								},
								'gender': 'M',
								'paxIsInfant': false,
								'expirationDate': {
									'raw': '07AUG22',
									'parsed': '2022-08-07',
								},
								'lastName': 'HABTEMARIAM',
								'firstName': 'BINYAM MEKONNEN',
							},
						},
						{
							'lineNumber': '10',
							'ssrCode': 'DOCS',
							'airline': 'QR',
							'status': 'HK',
							'statusNumber': '1',
							'data': {
								'travelDocType': 'P',
								'issuingCountry': 'USA',
								'travelDocNumber': '498670229',
								'nationality': 'USA',
								'dob': {
									'raw': '23MAY76',
									'parsed': '1976-05-23',
								},
								'gender': 'M',
								'paxIsInfant': false,
								'expirationDate': {
									'raw': '07AUG22',
									'parsed': '2022-08-07',
								},
								'lastName': 'HABTEMARIAM',
								'firstName': 'BINYAM MEKONNEN',
							},
							'segNums': ['2'],
						},
						{
							'lineNumber': '11',
							'ssrCode': 'DOCS',
							'airline': 'QR',
							'status': 'HK',
							'statusNumber': '1',
							'data': {
								'travelDocType': 'P',
								'issuingCountry': 'USA',
								'travelDocNumber': '498670229',
								'nationality': 'USA',
								'dob': {
									'raw': '23MAY76',
									'parsed': '1976-05-23',
								},
								'gender': 'M',
								'paxIsInfant': false,
								'expirationDate': {
									'raw': '07AUG22',
									'parsed': '2022-08-07',
								},
								'lastName': 'HABTEMARIAM',
								'firstName': 'BINYAM MEKONNEN',
							},
							'segNums': ['3'],
						},
					],
					'formOfPayment': [
						{
							'lineNumber': '22',
							'data': [
								{
									'isOld': true,
									'ccType': 'CA',
									'ccNumber': '5111111111111111',
									'formOfPayment': 'creditCard',
								},
								{
									'isOld': false,
									'ccType': 'CA',
									'ccNumber': '5111111111111111',
									'expirationDate': {'parsed': '2019-03', 'raw': '0319'},
									'approvalCode': 'A074722',
									'formOfPayment': 'creditCard',
								},
							],
						},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'--- TST RLR SFP ---',
				'RP/SFO1S2195/SWI1GCFZKRE/5RB/45520300    24SEP16/2215Z   3R593V',
				'SFO1S2195/4003MM/5SEP16',
				' 1.BEAINI/HADI',
				' 2  LH1309 T 24SEP 6 BEYFRA         FLWN',
				' 3  UA9066 T 24SEP 6 FRATPA         FLWN',
				' 4  LH 483 L 25OCT 2 TPAFRA HK1   801P1100A 26OCT  E  LH/3R593V',
				' 5  ME 218 L 26OCT 3 FRABEY HK1  1200P 450P 26OCT  E  ME/3R593V',
				'  6 AP SFO 888 585-2727 - ITN CORP. - A',
				' 7 AP TPA 17276782167-PASSENGER',
				' 8 TK OK05SEP/SFO1S2195//ETUA',
				' 9 SSR RQST LH HK1 TPAFRA/12AN,P1/S4   SEE RTSTR',
				'10 SSR RQST ME HK1 FRABEY/21FN,P1/S5   SEE RTSTR',
				'11 SSR DOCS LH HK1 ////19JAN64/M//BEAINI/HADI',
				'12 SSR DOCS UA HK1 ////19JAN64/M//BEAINI/HADI',
				'13 SSR WCHR LH HK1/S2',
				'14 SSR WCHR LH HK1/S4',
				'15 SSR OTHS YY KINDLY NOTE THAT WHEELCHAIR CANNOT BE CONFIRMED',
				'      UNLESS ADVISING THE NATURE OF DISABILITY',
				'16 SSR DOCS ME HK1 ////19JAN64/M//BEAINI/HADI',
				'17 SSR DOCS LH HK1 P/LBN/2390602/LBN/19JAN64/M/05NOV17/BEAINI/H',
				'      ADI',
				'18 SSR DOCS LH HK1 P/LBN/2390602/LBN/19JAN64/M/05NOV17/BEAINI/H',
				'      ADI/S2',
				'19 SSR DOCO LH HK1 /V/H0380256/USA//USA/S2',
				'20 SSR DOCA LH HK1 D/USA/6960 AVENUE PETE STR/DEARBORN/FL/33710',
				'      /S3',
				'21 SSR DOCS LH HK1 P/LBN/2390602/LBN/19JAN64/M/05NOV17/BEAINI/H',
				'      ADI/S3',
				'22 SSR DOCO LH HK1 /V/H0380256/USA//USA/S3',
				'23 SSR WCHS LH HK1/S3',
				'24 OSI LH CTCP SFO888 585-2727 ITN CORP. - A',
				'25 OSI LH CTCT SFO888 585-2727 ITN CORP.',
				'26 OSI LH CTCP TPA172 76782167 PASSENGER',
				'27 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
				'      FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
				'      GGAMAUSHAZ/S3-4',
				'28 RM PNR MODIFIED BY THE END USER (THURSDAY-SEPTEMBER-22-2016)',
				'29 RM PNR MODIFIED BY END USER IP_ADDRESS 193.238.212.171',
				'30 FA PAX 016-7892926345/ETUA/USD1127.06/05SEP16/SFO1S2195/0557',
				'      8602/S2-5',
				'31 FB PAX 0500002609 TTP/ET/RT OK ETICKET/S2-5',
				'32 FE PAX FL/CNX/CHG RESTRICTED CHECK FARE NOTE -BG:LH/S2-5',
				'33 FM *M*0',
				'34 FP PAX CCCA5111111111111111/1018/A04528B/S2-5',
				'35 FV PAX UA/S2-5',
			]),
			{
				'parsed': {
					'pnrInfo': {
						'agentInitials': '',
						'recordLocator': '3R593V',
					},
					'itinerary': [
						{
							'lineNumber': '2',
							'segmentType': 'FLWN',
							'airline': 'LH',
							'flightNumber': '1309',
							'bookingClass': 'T',
							'departureDate': {
								'raw': '24SEP',
								'parsed': '09-24',
							},
							'dayOfWeek': '6',
							'departureAirport': 'BEY',
							'destinationAirport': 'FRA',
							'raw': ' 2  LH1309 T 24SEP 6 BEYFRA         FLWN',
						},
						{
							'lineNumber': '3',
							'segmentType': 'FLWN',
							'airline': 'UA',
							'flightNumber': '9066',
							'bookingClass': 'T',
							'departureDate': {
								'raw': '24SEP',
								'parsed': '09-24',
							},
							'dayOfWeek': '6',
							'departureAirport': 'FRA',
							'destinationAirport': 'TPA',
							'raw': ' 3  UA9066 T 24SEP 6 FRATPA         FLWN',
						},
						{
							'lineNumber': '4',
							'segmentType': 'AIR',
							'airline': 'LH',
							'flightNumber': '483',
							'bookingClass': 'L',
							'departureDate': {
								'raw': '25OCT',
								'parsed': '10-25',
							},
							'dayOfWeek': '2',
							'departureAirport': 'TPA',
							'destinationAirport': 'FRA',
							'segmentStatus': 'HK',
							'seatCount': '1',
							'departureTime': {
								'raw': '801P',
								'parsed': '20:01',
							},
							'destinationTime': {
								'raw': '1100A',
								'parsed': '11:00',
							},
							'destinationDate': {
								'raw': '26OCT',
								'parsed': '10-26',
							},
							'confirmationAirline': 'LH',
							'confirmationNumber': '3R593V',
							'raw': ' 4  LH 483 L 25OCT 2 TPAFRA HK1   801P1100A 26OCT  E  LH/3R593V',
						},
						{
							'lineNumber': '5',
							'segmentType': 'AIR',
							'airline': 'ME',
							'flightNumber': '218',
							'bookingClass': 'L',
							'departureDate': {
								'raw': '26OCT',
								'parsed': '10-26',
							},
							'dayOfWeek': '3',
							'departureAirport': 'FRA',
							'destinationAirport': 'BEY',
							'segmentStatus': 'HK',
							'seatCount': '1',
							'departureTime': {
								'raw': '1200P',
								'parsed': '12:00',
							},
							'destinationTime': {
								'raw': '450P',
								'parsed': '16:50',
							},
							'destinationDate': {
								'raw': '26OCT',
								'parsed': '10-26',
							},
							'confirmationAirline': 'ME',
							'confirmationNumber': '3R593V',
							'raw': ' 5  ME 218 L 26OCT 3 FRABEY HK1  1200P 450P 26OCT  E  ME/3R593V',
						},
					],
					'passengers': [
						{
							'success': true,
							'nameNumber': {'raw': '1.', 'absolute': 1},
							'firstName': 'HADI',
							'lastName': 'BEAINI',
						},
					],
					'formOfPayment': [
						{
							'lineNumber': '34',
							'data': [
								{
									'isOld': false,
									'ccType': 'CA',
									'ccNumber': '5111111111111111',
									'expirationDate': {'parsed': '2018-10', 'raw': '1018'},
									'approvalCode': 'A04528B',
									'formOfPayment': 'creditCard',
								},
							],
						},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'--- RLR SFP ---',
				'RP/SFO1S2195/SFO1S2195            TS/GS  19OCT16/1517Z   6A4TB2',
				'SFO1S2195/4002TS/19OCT16',
				'  1.DOE/JOHN(INFDOE/JANE/03JAN16)',
				'  2  UA7226 S 12NOV 6 JFKJNB HK1  1040A 815A 13NOV  E  UA/',
				'  3  UA7227 S 13NOV 7 JNBACC HK1   655P1055P 13NOV  E  UA/',
				'  4 AP 8000000000',
				'  5 TK TL20OCT/SFO1S2195',
				'  6 SSR INFT UA HN1 DOE/JANE 03JAN16/S2',
				'  7 SSR INFT UA HN1 DOE/JANE 03JAN16/S3',
				'  8 SSR DOCS UA HK1 ////05MAR90/F//DOE/JOHN',
				'  9 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
				'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
				'       GGAMAUSHAZ/S2',
			]),
			{
				'parsed': {
					'passengers': [
						{
							'success': true,
							'nameNumber': {'raw': '1.', 'absolute': 1},
							'firstName': 'JOHN',
							'lastName': 'DOE',
							'age': null,
							'dob': null,
							'ptc': null,
						},
						{
							'success': true,
							'firstName': 'JANE',
							'lastName': 'DOE',
							'ptc': 'INF',
							'age': null,
							'dob': {
								'raw': '03JAN16',
								'parsed': '2016-01-03',
							},
						},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'--- RLR SFP ---',
				'RP/SFO1S2195/SFO1S2195            TS/GS  19OCT16/1547Z   6A4YZ8',
				'SFO1S2195/4002TS/19OCT16',
				'  1.BROWN/JANE(INS)   2.DOE/JOHN(INFDOE/JANE/03JAN16)',
				'  3.SMITH/JUNIOR(CHD/04APR10)',
				'  4  ET 501 E 13NOV 7 IADADD HK3  1030A 740A 14NOV  E  ET/',
				'  5 AP SFO 888 585-2727 - ITN CORP. - A',
				'  6 TK TL20OCT/SFO1S2195',
				'  7 SSR CHLD ET HK1 04APR10/P3',
				'  8 SSR INFT ET HN1 DOE/JANE 03JAN16/S4/P2',
				'  9 SSR DOCS ET HK1 ////05MAR16/F//BROWN/JANE/P1',
				' 10 SSR DOCS ET HK1 ////05MAR06/M//SMITH/JUNIOR/P3',
				' 11 SSR DOCS ET HK1 ////05MAR96/M//DOE/JOHN/P2',
				' 12 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
				'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
				'       GGAMAUSHAZ/S4',
			]),
			{
				'parsed': {
					'passengers': [
						{
							'success': true,
							'nameNumber': {'raw': '1.', 'absolute': 1},
							'firstName': 'JANE',
							'lastName': 'BROWN',
							'age': null,
							'dob': null,
							'ptc': 'INS',
						},
						{
							'success': true,
							'nameNumber': {'raw': '2.', 'absolute': 2},
							'firstName': 'JOHN',
							'lastName': 'DOE',
							'age': null,
							'dob': null,
							'ptc': null,
						},
						{
							'success': true,
							'nameNumber': {'raw': null, 'absolute': 3},
							'firstName': 'JANE',
							'lastName': 'DOE',
							'ptc': 'INF',
							'age': null,
							'dob': {
								'raw': '03JAN16',
								'parsed': '2016-01-03',
							},
						},
						{
							'success': true,
							'nameNumber': {'raw': '3.', 'absolute': 4},
							'firstName': 'JUNIOR',
							'lastName': 'SMITH',
							'age': null,
							'dob': {
								'raw': '04APR10',
								'parsed': '2010-04-04',
							},
							'ptc': 'CHD',
						},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'--- RLR SFP ---',
				'RP/SFO1S2195/SFO1S2195            TS/GS  19OCT16/1547Z   6A4YZ8',
				'SFO1S2195/4002TS/19OCT16',
				'  1.DOE/FRANK(INFJONES/JANE/01APR16)   2.DOE/JOHN',
				'  4  ET 501 E 13NOV 7 IADADD HK3  1030A 740A 14NOV  E  ET/',
				'  5 AP SFO 888 585-2727 - ITN CORP. - A',
				'  6 TK TL20OCT/SFO1S2195',
			]),
			{
				'parsed': {
					'passengers': [
						{
							'success': true,
							'nameNumber': {'raw': '1.', 'absolute': 1},
							'firstName': 'FRANK',
							'lastName': 'DOE',
							'age': null,
							'dob': null,
							'ptc': null,
						},
						{
							'success': true,
							'nameNumber': {'raw': null, 'absolute': 2},
							'firstName': 'JANE',
							'lastName': 'JONES',
							'ptc': 'INF',
							'age': null,
							'dob': {
								'raw': '01APR16',
								'parsed': '2016-04-01',
							},
						},
						{
							'success': true,
							'nameNumber': {'raw': '2.', 'absolute': 3},
							'firstName': 'JOHN',
							'lastName': 'DOE',
							'age': null,
							'dob': null,
							'ptc': null,
						},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'--- TST TSM RLR MSC SFP ---',
				'RP/SJC1S212D/SJC1S212D            WS/SU  21FEB17/0717Z   32UE3M',
				'SJC1S212D/9998WS/14FEB17',
				'  1.CYPERT/RUSHANIYA(ADT)(INF/AIDASOFIA/05JAN17)',
				'  2  TK 034 U 26FEB 7*IAHIST HK1   900P 545P 27FEB  E  TK/S7J37U',
				'  3  TK 427 U 27FEB 1*ISTKZN HK1   930P 130A 28FEB  E  TK/S7J37U',
				'  4  TK 428 U 24MAR 5 KZNIST HK1   235A 650A 24MAR  E  TK/S7J37U',
				'  5  TK 033 U 24MAR 5 ISTIAH HK1   245P 820P 24MAR  E  TK/S7J37U',
				'  6  TK 033 U 25MAR 6 ISTIAH HK1   245P 820P 25MAR  E  TK/S7J37U',
				'  7 MCO TK *** 14FEB/USD 34.00/*SPLIT PAYMENT',
				'     1 FA 235-5050440440/PTTK/USD34.00/14FEB17/SFO1S2195/0557860',
				'       2',
				'     2 FB 1400015004 TTM OK PROCESSED MCO-ENTER IR, ADD FM THEN',
				'       TTP/EXCH',
				'     3 FG 1406620358 AMSAA3102',
				'     4 FM *M*0',
				'     5 FP CASH',
				'  8 APA TRAVIX SUPPLY HUB',
				'  9 TK OK14FEB/SFO1S2195//ETTK',
				' 10 TK PAX OK14FEB/SFO1S2195//ETTK/S2-5',
				' 11 SSR RQST TK KK1 IAHIST/11DN,P1/DEFAULT ZONE CODE/S2   SEE',
				'                /// RTSTR',
				' 12 SSR RQST TK UN1 ISTIAH/11A,P1/DEFAULT ZONE CODE/S5   SEE',
				'                /// RTSTR',
			]),
			{
				'parsed': {
					'pnrInfo': {
						'agentInitials': 'WS',
						'recordLocator': '32UE3M',
						'date': {'raw': '21FEB17', 'parsed': '2017-02-21'},
						'time': {'raw': '0717', 'parsed': '07:17'},
					},
					'passengers': [
						{
							'success': true,
							'nameNumber': {'raw': '1.', 'absolute': 1},
							'firstName': 'RUSHANIYA',
							'lastName': 'CYPERT',
							'age': null,
							'dob': null,
							'ptc': 'ADT',
						},
						{
							'success': true,
							'firstName': 'AIDASOFIA',
							'lastName': 'CYPERT',
							'ptc': 'INF',
							'age': null,
							'dob': {
								'raw': '05JAN17',
								'parsed': '2017-01-05',
							},
						},
					],
					'mcoRecords': [
						{
							'amount': '34.00',
							'details': {
								'document': {
									'airlineNumber': '235',
									'documentNumber': '5050440440',
								},
								'formOfPayment': {
									'lineNumber': '5',
									'data': [
										{'isOld': false, 'formOfPayment': 'cash'},
									],
								},
							},
						},
					],
					'tickets': [],
				},
			},
		]);

		// infant last name implicitly same as parent
		list.push([
			php.implode(php.PHP_EOL, [
				'--- TST TSM RLR MSC SFP ---',
				'RP/SJC1S212D/SJC1S212D            AA/GS  17MAR17/1911Z   54P77J',
				'SJC1S212D/9998WS/17MAR17',
				'  1.LO/ELYNN(ADT/07DEC76)',
				'  2.MULABEGOVIC/SENAD(ADT)(INF/GEMMA/22SEP16)',
				'  3  TK 080 V 24AUG 4*SFOIST HK2   610P 515P 25AUG  E  TK/SKKZTG',
				'  4  TK1055 V 25AUG 5*ISTZAG HK2   605P 715P 25AUG  E  TK/SKKZTG',
				'  5  TK1056 V 10SEP 7*ZAGIST HK2   810P1120P 10SEP  E  TK/SKKZTG',
				'  6  TK 079 V 11SEP 1*ISTSFO HK2   105P 430P 11SEP  E  TK/SKKZTG',
				'  7 MCO TK *** 17MAR/USD 84.00/*SPLIT PAYMENT/P2',
			]),
			{
				'parsed': {
					'passengers': [
						{
							'nameNumber': {'raw': '1.', 'absolute': 1},
							'lastName': 'LO',
							'firstName': 'ELYNN',
							'ptc': 'ADT',
							'dob': {'parsed': '1976-12-07'},
						},
						{
							'nameNumber': {'raw': '2.', 'absolute': 2},
							'lastName': 'MULABEGOVIC',
							'firstName': 'SENAD',
						},
						{
							'ptc': 'INF',
							'lastName': 'MULABEGOVIC',
							'firstName': 'GEMMA',
							'dob': {'parsed': '2016-09-22'},
						},
					],
				},
			},
		]);

		// not saved yet PNR - text between segments
		list.push([
			php.implode(php.PHP_EOL, [
				'/$--- MSC SFP ---',
				'RP/SFO1S2195/',
				'  1  DL 462 Y 23OCT 1*JFKDTW DK1   910A1130A 23OCT  E  0 717 N',
				'     SEE RTSVC',
				'  2  DL 275 Y 23OCT 1*DTWMNL DK1  1210P 855P 24OCT  E  1 EQV D',
				'     ADVISE PSGRS OF CHNG OF EQUIP IN NRT FROM 744 TO 76W',
				'     DELTA ONE SVC THIS FLT',
				'     SEE RTSVC',
				'  3 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
				'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
				'       GGAMAUSHAZ/S1-2',
				' ',
			]),
			{
				'parsed': {
					'itinerary': [
						{'flightNumber': '462', 'destinationAirport': 'DTW'},
						{'flightNumber': '275', 'destinationAirport': 'MNL'},
					],
				},
			},
		]);

		// example of itinerary segment with OPERATED BY
		list.push([
			php.implode(php.PHP_EOL, [
				'RP/SFO1S2195/',
				'  1  KQ1566 H 28JUL 5 NBOAMS DK1  1155P 710A 29JUL  E  0 EQV',
				'     KQ NOW FLIES TO BANGUI 2X WK FR 1ST NOV',
				'     DIRECT FLTS 2 HAN 3X WK GO 2 GGAIRKQNEWS 4 VISA',
				'     DIRECT FLTS TO FNA N ROB NOW OPEN FOR SALE',
				'     OPERATED BY KLM ROYAL DUTCH AIRLINES',
				'     SEE RTSVC',
				'',
			]),
			{
				'parsed': {
					'itinerary': [
						{
							'flightNumber': '1566', 'destinationAirport': 'AMS', 'raw': php.implode(php.PHP_EOL, [
								'  1  KQ1566 H 28JUL 5 NBOAMS DK1  1155P 710A 29JUL  E  0 EQV',
								'     OPERATED BY KLM ROYAL DUTCH AIRLINES',
							]),
						},
					],
				},
			},
		]);

		// this is how remarks are wrapped in Amadeus - result of commands:
		// RMAPPLE JUICE APPLE JUICE APPLE JUICE APPLE JUICE APPLE JUICE APPLE JUICE
		// RMAPPLE JUICE APPLE JUICE APPLE JUICE APPLE JUICE APPLEJUICE APPLE JUICE
		// RMA B A B A B A B A B A B A B A B A B A B A B A B A B A B A B A B A B A B
		// RMDeoxyriboETHANBUTANPROPANFORTRANPENTANSAKURATANNucleic ACID
		// RMACID DeoxyriboETHANBUTANPROPANFORTRANPENTANSAKURATANNucleic
		// RMSTANISLAW/ID2838/CREATED FOR STANISLAW/ID2838/REQ. ID-1
		list.push([
			php.implode(php.PHP_EOL, [
				'/$RP/SFO1S2195/',
				'  1 RM APPLE JUICE APPLE JUICE APPLE JUICE APPLE JUICE APPLE',
				'       JUICE APPLE JUICE',
				'  2 RM APPLE JUICE APPLE JUICE APPLE JUICE APPLE JUICE',
				'       APPLEJUICE APPLE JUICE',
				'  3 RM A B A B A B A B A B A B A B A B A B A B A B A B A B A B A',
				'       B A B A B A B',
				'  4 RM DEOXYRIBOETHANBUTANPROPANFORTRANPENTANSAKURATANNUCLEIC',
				'       ACID',
				'  5 RM ACID DEOXYRIBOETHANBUTANPROPANFORTRANPENTANSAKURATANNUCLE',
				'       IC',
				'  6 RM STANISLAW/ID2838/CREATED FOR STANISLAW/ID2838/REQ. ID-1',
			]),
			{
				'parsed': {
					'remarks': [
						{
							content: php.implode(php.PHP_EOL, [
								'APPLE JUICE APPLE JUICE APPLE JUICE APPLE JUICE APPLE',
								'JUICE APPLE JUICE',
							]),
						},
						{
							content: php.implode(php.PHP_EOL, [
								'APPLE JUICE APPLE JUICE APPLE JUICE APPLE JUICE',
								'APPLEJUICE APPLE JUICE',
							]),
						},
						{
							content: php.implode(php.PHP_EOL, [
								'A B A B A B A B A B A B A B A B A B A B A B A B A B A B A',
								'B A B A B A B',
							]),
						},
						{
							content: php.implode(php.PHP_EOL, [
								'DEOXYRIBOETHANBUTANPROPANFORTRANPENTANSAKURATANNUCLEIC',
								'ACID',
							]),
						},
						{
							content: php.implode(php.PHP_EOL, [
								'ACID DEOXYRIBOETHANBUTANPROPANFORTRANPENTANSAKURATANNUCLE',
								'IC',
							]),
						},
						{
							'lineNumber': '6',
							content: 'STANISLAW/ID2838/CREATED FOR STANISLAW/ID2838/REQ. ID-1',
						},
					],
				},
			},
		]);

		// dump starting with a blank line should be parsed correctly
		list.push([
			php.implode(php.PHP_EOL, [
				'',
				'--- TST TSM RLR SFP ---',
				'RP/SJC1S212D/SJC1S212D            WS/RC  22FEB17/1601Z   4J68TM',
				'SJC1S212D/9998WS/22FEB17',
				'  1.PAPAPOSTOLOU/ANTIGONI(ADT/20FEB97)',
				'  2  TP 218 T 29MAY 1 BOSLIS HK1   620P 550A 30MAY  E  TP/4J68TM',
				'  3  TP 336 T 30MAY 2 LISLGW HK1   705A 945A 30MAY  E  TP/4J68TM',
				'  4 MCO TP *** 22FEB/USD 6.00/*SPLIT PAYMENT',
				'     1 FA 047-5050475746/PTTP/USD6.00/22FEB17/SFO1S2195/05578602',
				'     2 FB 2200018817 TTM OK PROCESSED MCO-ENTER IR, ADD FM THEN',
			]),
			{
				'parsed': {
					'pnrInfo': {
						'responsibleOfficeId': 'SJC1S212D',
						'queueingOfficeId': 'SJC1S212D',
						'agentInitials': 'WS',
						'dutyCode': 'RC',
						'recordLocator': '4J68TM',
						'date': {'raw': '22FEB17', 'parsed': '2017-02-22'},
						'time': {'raw': '1601', 'parsed': '16:01'},
					},
					'pnrCreationInfo': {
						'officeId': 'SJC1S212D',
						'agentNumber': '9998',
						'agentInitials': 'WS',
						'date': {'raw': '22FEB17', 'parsed': '2017-02-22'},
					},
					'passengers': [
						{
							'nameNumber': {'raw': '1.', 'absolute': 1},
							'firstName': 'ANTIGONI',
							'lastName': 'PAPAPOSTOLOU',
						},
					],
					'itinerary': [
						{'flightNumber': '218', 'destinationAirport': 'LIS', 'confirmationNumber': '4J68TM'},
						{'flightNumber': '336', 'destinationAirport': 'LGW', 'confirmationNumber': '4J68TM'},
					],
					'tickets': [],
				},
			},
		]);

		// infant without date of birth and last name same as parent (INF/KATJA)
		list.push([
			php.implode(php.PHP_EOL, [
				'RP/SFO1S2195/',
				'  1.LIBERMANE/LEPIN   2.LIBERMANE/MARINA(INF/KATJA)',
				'  3.LIBERMANE/ZIMICH(CHD)',
				'  4  PS 898 Y 20SEP 3 KIVKBP DK3   720A 825A 20SEP  E  0 738 F',
				'     SEE RTSVC',
				'  5  PS 185 Y 20SEP 3 KBPRIX DK3   920A1055A 20SEP  E  0 E90 F',
				'     SEE RTSVC',
				'  6 SSR INFT PS HK1 LIBERMANE/KATJA 20JUL17/S4/P2',
				'  7 SSR INFT PS HK1 LIBERMANE/KATJA 20JUL17/S5/P2',
				'  8 SSR CHLD PS HK1/P3',
			]),
			{
				'parsed': {
					'passengers': [
						{'lastName': 'LIBERMANE', 'firstName': 'LEPIN'},
						{'lastName': 'LIBERMANE', 'firstName': 'MARINA'},
						{'lastName': 'LIBERMANE', 'firstName': 'KATJA'},
						{'lastName': 'LIBERMANE', 'firstName': 'ZIMICH'},
					],
					'itinerary': [
						{'departureAirport': 'KIV', 'destinationAirport': 'KBP'},
						{'departureAirport': 'KBP', 'destinationAirport': 'RIX'},
					],
				},
			},
		]);

		// PCC configuration: extended itinerary display format with day offset
		// due to 7 spaces, first line gets unwrapped as part of segment line - should not affect the parsing
		list.push([
			[
				"/$--- SFP ---",
				"RP/YTOC421D7/",
				"  1  AT 209 Y 18JUN 4 YULCMN HK6   935P    1035P1005A+1 788 E0 D",
				"         PLEASE USE FFAAT OR FFNAT TO",
				"     COLLECT SAFAR FLYER NUMBER",
				"         THINK TO INVITE NEW MEMBERS TO",
				"     JOIN SAFAR FLYER LOYALTY PROGRAM",
				"     SEE RTSVC",
			].join("\n"),
			{
				parsed: {
					"pnrInfo": {
						"responsibleOfficeId": "YTOC421D7",
					},
					itinerary: [
						{
							lineNumber: '1',
							airline: 'AT',
							flightNumber: '209',
							bookingClass: 'Y',
							departureDate: {raw: '18JUN'},
							dayOfWeek: '4',
							departureAirport: 'YUL',
							destinationAirport: 'CMN',
							terminalTime: {raw: '935P'},
							departureTime: {raw: '1035P'},
							destinationTime: {raw: '1005A'},
							dayOffset: 1,
							aircraft: '788',
							meals: {raw: 'D', parsed: ['DINNER']},
						},
					],
				},
			},
		]);

		// how itinerary looks in NYC1S2186 PCC - day offset instead of destination date
		list.push([
			php.implode(php.PHP_EOL, [
				'  1  AY1074 Y 10APR 2 RIXHEL HK1   135P     220P 330P   AT7 E0 G',
				'     OPERATED BY NORDIC REGIONAL AIRLINES',
				'     OPERATED BY UNDEFINED',
				'     SEE RTSVC',
				'  2  AY 099 Y 10APR 2 HELHKG HK1  1050P 2  1150P 230P+1 359 E0 H',
				'     SEE RTSVC',
			]),
			{
				'parsed': {
					'itinerary': [
						{'destinationAirport': 'HEL', 'dayOffset': 0},
						{'destinationAirport': 'HKG', 'dayOffset': 1},
					],
				},
			},
		]);

		// and another one
		list.push([
			php.implode(php.PHP_EOL, [
				'--- MSC ---',
				'RP/NYC1S2186/',
				'  1  SU1845 Y 10DEC 7 KIVSVO HK1            140A 535A   32A E0 S',
				'     SEE RTSVC',
				'  2  SU2682 Y 10DEC 7 SVORIX HK1        D   925A1005A   320 E0 S',
				'     SEE RTSVC',
			]),
			{
				'parsed': {
					'itinerary': [
						{'destinationAirport': 'SVO', 'dayOffset': 0},
						{'destinationAirport': 'RIX', 'dayOffset': 0},
					],
				},
			},
		]);

		// and another one
		list.push([
			php.implode(php.PHP_EOL, [
				'  3  SQ5731 Y 10MAY 4 HNLICN HK1        M  1150A 510P+1 77L E0 L',
				'     OPERATED BY ASIANA AIRLINES',
				'     SEE RTSVC - TRAFFIC RESTRICTION EXISTS',
				'  4  CI 001 Y 10MAY 4 HNLTPE HK1        M   115A 600A+1 333 E0 M',
				'     SEE RTSVC',
			]),
			{
				'parsed': {
					'itinerary': [
						{'destinationAirport': 'ICN', 'dayOffset': 1},
						{'destinationAirport': 'TPE', 'dayOffset': 1},
					],
				},
			},
		]);

		// negative day offset
		list.push([
			php.implode(php.PHP_EOL, [
				'  1  UA 200 Y 15OCT 7 GUMHNL HK1            635A 600P-1 777 E0 F',
				'     ADV PAX FLT ARRIVES TERMINAL-M',
				'      BUSINESSFIRST OFFERED THIS FLIGHT',
				'     SEE RTSVC',
			]),
			{
				'parsed': {
					'itinerary': [
						{'destinationAirport': 'HNL', 'dayOffset': -1, 'aircraft': '777'},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'/$                        ***  NHP  ***',
				'RP/NYC1S2186/',
				'  1  PS 898 N 20NOV 1 KIVKBP HK2            710A 820A   738 E0 F',
				'     BOARDING PASS AT CHECKIN IS CHARGEABLE',
				'     FULL PASSPORT DATA IS MANDATORY',
				'     SEE RTSVC',
				'  2  PS 185 N 20NOV 1 KBPRIX HK2            920A1100A   E90 E0 F',
				'     BOARDING PASS AT CHECKIN IS CHARGEABLE',
				'     FULL PASSPORT DATA IS MANDATORY',
				'     SEE RTSVC',
				'  3  PS 898 N 20NOV 1 KIVKBP GK1            710A 820A   A',
				'     SEE RTSVC',
				'  4  CX 907 Y 15DEC 5 HKGMNL GK1        1   750A 955A   A',
				'     SEE RTSVC',
				'  5  VA 142 I 11FEB 7 SYDAKL GK1        1  1030A 335P   A',
				'     OPERATED BY SUBSIDIARY/FRANCHISE',
				'     SEE RTSVC',
				'  6  VA 165 I 22FEB 4 AKLMEL GK1        I   630A 840A   A',
				'     OPERATED BY SUBSIDIARY/FRANCHISE',
				'     SEE RTSVC',
			]),
			{
				'parsed': {
					'pnrInfo': {
						responsibleOfficeId: 'NYC1S2186',
					},
					'itinerary': [
						{
							'lineNumber': '1',
							'segmentType': 'AIR',
							'displayFormat': 'DAY_OFFSET',
							'airline': 'PS',
							'flightNumber': '898',
							'bookingClass': 'N',
							'departureDate': {'raw': '20NOV', 'parsed': '11-20'},
							'dayOfWeek': '1',
							'departureAirport': 'KIV',
							'destinationAirport': 'KBP',
							'segmentStatus': 'HK',
							'seatCount': '2',
							'departureTime': {'raw': '710A', 'parsed': '07:10'},
							'destinationTime': {'raw': '820A', 'parsed': '08:20'},
							'dayOffset': 0,
							'aircraft': '738',
							'eticket': true,
							'meals': {'raw': 'F'},
						},
						{'departureAirport': 'KBP', 'destinationAirport': 'RIX', 'segmentStatus': 'HK'},
						{'departureAirport': 'KIV', 'destinationAirport': 'KBP', 'segmentStatus': 'GK'},
						{'departureAirport': 'HKG', 'destinationAirport': 'MNL', 'segmentStatus': 'GK'},
						{'departureAirport': 'SYD', 'destinationAirport': 'AKL', 'segmentStatus': 'GK'},
						{
							'lineNumber': '6',
							'segmentType': 'AIR',
							'displayFormat': 'DAY_OFFSET',
							'airline': 'VA',
							'flightNumber': '165',
							'bookingClass': 'I',
							'departureDate': {'raw': '22FEB', 'parsed': '02-22'},
							'dayOfWeek': '4',
							'departureAirport': 'AKL',
							'destinationAirport': 'MEL',
							'segmentStatus': 'GK',
							'seatCount': '1',
							'departureTime': {'raw': '630A', 'parsed': '06:30'},
							'destinationTime': {'raw': '840A', 'parsed': '08:40'},
							'dayOffset': 0,
							'raw': php.implode(php.PHP_EOL, [
								'  6  VA 165 I 22FEB 4 AKLMEL GK1        I   630A 840A   A',
								'     OPERATED BY SUBSIDIARY/FRANCHISE',
							]),
							'operatedBy': 'SUBSIDIARY/FRANCHISE',
						},
					],
				},
			},
		]);

		// day offset format segments in a stored PNR
		list.push([
			php.implode(php.PHP_EOL, [
				'/$--- RLR MSC ---',
				'RP/NYC1S2186/NYC1S2186            WS/SU  12OCT17/1500Z   NWDBDX',
				'  1.LIBERMANE/LEPIN(C05)   2.LIBERMANE/MARINA',
				'  3  SU1845 Y 10DEC 7 KIVSVO HK2            140A 540A   *1A/E*',
				'  4  SU2682 Y 10DEC 7 SVORIX HK2        D   925A1005A   *1A/E*',
				'  5 AP 15123-4567-B',
				'  6 APE JOHN@GMAIL.COM',
				'  7 TK TL01NOV/NYC1S2186',
				'  8 RM AKLESUNS/ID6206/CREATED FOR STANISLAW/ID2838/REQ. ID-1 IN',
				'       NYC1S2186',
			]),
			{
				'parsed': {
					'pnrInfo': {'recordLocator': 'NWDBDX'},
					'itinerary': [
						{'airline': 'SU', 'flightNumber': '1845', 'bookingClass': 'Y'},
						{
							'airline': 'SU', 'flightNumber': '2682', 'bookingClass': 'Y',
							'terminal': 'D',
							'eticket': true,
						},
					],
					'passengers': [
						{'firstName': 'LEPIN', 'lastName': 'LIBERMANE'},
						{'firstName': 'MARINA', 'lastName': 'LIBERMANE'},
					],
					'remarks': [
						{
							content: 'AKLESUNS/ID6206/CREATED FOR STANISLAW/ID2838/REQ. ID-1 IN\nNYC1S2186',
						},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'/$RP/SFO1S2195/',
				'  1  AY 099 Y 10APR 2 HELHKG DK1  1150P 230P 11APR  E  0 359 HH',
				'     SEE RTSVC',
			]),
			{
				'parsed': {
					'itinerary': [
						{
							'lineNumber': '1',
							'segmentType': 'AIR',
							'displayFormat': 'EXTENDED',
							'airline': 'AY',
							'flightNumber': '099',
							'bookingClass': 'Y',
							'departureDate': {'raw': '10APR', 'parsed': '04-10'},
							'dayOfWeek': '2',
							'departureAirport': 'HEL',
							'destinationAirport': 'HKG',
							'segmentStatus': 'DK',
							'seatCount': '1',
							'eticket': true,
							'departureTime': {'raw': '1150P', 'parsed': '23:50'},
							'destinationTime': {'raw': '230P', 'parsed': '14:30'},
							'destinationDate': {'raw': '11APR', 'parsed': '04-11'},
						},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'/$RP/SFO1S2195/SFO1S2195            WS/SU  25SEP17/1933Z   VYYWJK',
				'------- PRIORITY',
				'M  CREATED IN GDS DIRECT BY ELDAR',
				'-------',
				'SFO1S2195/9998WS/25SEP17',
				'  1.RZAEV/ELDAR',
				'  2 HHL HS HK1 RIX IN20MAR OUT21MAR 1ROHRAC EUR49.00 DLY ABS',
				'    WELLTON ELEFANT/BC-GLJTTCR/BS-05578602/CF-103809885',
				'    /G-CCMCXXXXXXXXXXXX1996EXP1018 *HS+',
				'    SEE RTSVCH',
				'  3 AP SFO 888 585-2727 - ITN CORP. - A',
				'  4 TK TL25SEP/SFO1S2195',
				'  5 RM ELDAR/ID20744/CREATED FOR ELDAR/ID20744/REQ. ID-4633250',
				'       IN SFO1S2195',
				'  6 CCR SX HK1 FRA 13MAY 16MAY ECMN/BS-00000000/ARR-1200',
				'    /RC-SD-XEU/RG-EUR 38.00- .00 UNL DY/RT-0900/CF-',
				'    **SEE RTSVCC**',
				'  7 AP VNO +370 5 2726869 - AMADEUS LITHUANIA - A',
				'  8 CCR TS SS1 FRA 15SEP 30SEP ECMN/BS-00000000/ARR-1000',
				'    /RC-SW-DEEX1/RG-EUR 160.00- .00 UNL WY 23.00- UNL XD',
				'    /RT-0700/CF-',
				'    **SEE RTSVCC**',
				'  9 TK TL10MAY/VNOLJ2902',
			]),
			{
				'parsed': {
					'pnrInfo': {
						'responsibleOfficeId': 'SFO1S2195',
						'queueingOfficeId': 'SFO1S2195',
						'agentInitials': 'WS',
						'dutyCode': 'SU',
						'recordLocator': 'VYYWJK',
						'date': {'raw': '25SEP17', 'parsed': '2017-09-25'},
						'time': {'raw': '1933', 'parsed': '19:33'},
					},
					'itinerary': [],
					'passengers': [
						{
							'success': true,
							'firstName': 'ELDAR',
							'lastName': 'RZAEV',
							'age': null,
							'dob': null,
							'ptc': null,
							'nameNumber': {
								'fieldNumber': '1',
								'isInfant': false,
								'raw': '1.',
								'absolute': 1,
								'firstNameNumber': 1,
							},
						},
					],
					'tickets': [],
					'pnrCreationInfo': {
						'officeId': 'SFO1S2195',
						'agentNumber': '9998',
						'agentInitials': 'WS',
						'date': {'raw': '25SEP17', 'parsed': '2017-09-25'},
					},
					'hotels': [
						{
							'lineNumber': '2',
							'type': 'HHL',
							'vendorCode': 'HS',
							'segmentStatus': 'HK',
							'roomCount': '1',
							'city': 'RIX',
							'startDate': {'raw': '20MAR', 'parsed': '03-20'},
							'endDate': {'raw': '21MAR', 'parsed': '03-21'},
							'occupancy': '1ROHRAC',
							'currency': 'EUR',
							'amount': '49.00',
							'rateType': 'DLY',
							'hotelName': 'ABS WELLTON ELEFANT',
							'unparsedCodes': ['BC-GLJTTCR', 'BS-05578602', 'CF-103809885', 'G-CCMCXXXXXXXXXXXX1996EXP1018'],
							'vendorMarker': '*HS+',
							'seeInfo': 'SEE RTSVCH',
						},
					],
					'remarks': [
						{
							'lineNumber': '5',
							content: 'ELDAR/ID20744/CREATED FOR ELDAR/ID20744/REQ. ID-4633250\nIN SFO1S2195',
						},
					],
					'cars': [
						{
							'lineNumber': '6',
							'type': 'CCR',
							'vendorCode': 'SX',
							'segmentStatus': 'HK',
							'statusNumber': '1',
							'city': 'FRA',
							'startDate': {'raw': '13MAY', 'parsed': '05-13'},
							'endDate': {'raw': '16MAY', 'parsed': '05-16'},
							'carTypeCode': 'ECMN',
							'unparsedCodes': ['BS-00000000', 'ARR-1200', 'RC-SD-XEU', 'RT-0900'],
							'parsedCodes': {
								'rates': {
									'dataType': 'RG',
									'currency': 'EUR',
									'amount': '38.00',
									'unparsedData': '- .00 UNL DY',
								},
							},
							'seeInfo': '**SEE RTSVCC**',
						},
						{
							'lineNumber': '8',
							'type': 'CCR',
							'vendorCode': 'TS',
							'segmentStatus': 'SS',
							'statusNumber': '1',
							'city': 'FRA',
							'startDate': {'raw': '15SEP', 'parsed': '09-15'},
							'endDate': {'raw': '30SEP', 'parsed': '09-30'},
							'carTypeCode': 'ECMN',
							'unparsedCodes': ['BS-00000000', 'ARR-1000', 'RC-SW-DEEX1', 'RT-0700'],
							'parsedCodes': {
								'rates': {
									'dataType': 'RG',
									'currency': 'EUR',
									'amount': '160.00',
									'unparsedData': '- .00 UNL WY 23.00- UNL XD',
								},
							},
							'seeInfo': '**SEE RTSVCC**',
						},
					],
				},
			},
		]);

		// with "SEE RTSTR" after pax/segment numbers in SSR NSST
		// in case we ever want to parse numbers generally for any SSR code
		list.push([
			php.implode(php.PHP_EOL, [
				'--- TST RLR MSC SFP ---',
				'RP/SJC1S212D/SJC1S212D            WS/SU  22MAR17/1137Z   6C4T4T',
				'SJC1S212D/9998WS/22MAR17',
				'  1.MANGALAGIRI/HIMABINDU(ADT/22JUN90)',
				'  2  EK 232 T 27MAR 1 IADDXB HK1  1055A 805A 28MAR  E  EK/IUIHMF',
				'  3  EK 528 T 28MAR 2 DXBHYD HK1   305P 815P 28MAR  E  EK/IUIHMF',
				'  4  EK 529 T 14JUN 3*HYDDXB HK1   950P1210A 15JUN  E  EK/IUIHMF',
				'  5  EK 231 T 15JUN 4*DXBIAD HK1   220A 840A 15JUN  E  EK/IUIHMF',
				'  6 APA TRAVIX SUPPLY HUB',
				'  7 TK OK21MAR/SFO1S2195//ETEK',
				'  8 SSR NSST EK KK1 IADDXB/43B,P1/S2   SEE RTSTR',
				'  9 SSR NSST EK KK1 DXBHYD/23D,P1/S3   SEE RTSTR',
				' 10 SSR NSST EK KK1 HYDDXB/23G,P1/S4   SEE RTSTR',
				' 11 SSR NSST EK KK1 DXBIAD/52J,P1/S5   SEE RTSTR',
				' 12 SSR DOCS EK HK1 ////22JUN90/F//MANGALAGIRI/HIMABINDU',
				' 13 SSR CTCE EK HK1 KARANAM.ARJUN//GMAIL.COM',
				' 14 SSR CTCM EK HK1 18044268654',
				' 15 SSR OTHS 1A SECURE FLTS BKD PLS ADV SSR DOCS ELSE TKTG',
				'       RESTRICTED',
				' 16 SSR ADTK 1A RITK/IMMEDIATE TICKETING REQD.',
				' 17 SSR BBML EK KK1/S2',
				' 18 SSR BBML EK KK1/S3',
				' 19 SSR BBML EK KK1/S4',
				' 20 SSR BBML EK KK1/S5',
			]),
			{
				'parsed': {
					'pnrInfo': {'agentInitials': 'WS', 'recordLocator': '6C4T4T'},
					'ssrData': [
						{
							'lineNumber': '8',
							'ssrCode': 'NSST',
							'airline': 'EK',
							'status': 'KK',
							'statusNumber': '1',
							'content': 'IADDXB/43B,P1/S2   SEE RTSTR',
						},
						{
							'lineNumber': '9',
							'ssrCode': 'NSST',
							'airline': 'EK',
							'status': 'KK',
							'statusNumber': '1',
							'content': 'DXBHYD/23D,P1/S3   SEE RTSTR',
						},
						{
							'lineNumber': '10',
							'ssrCode': 'NSST',
							'airline': 'EK',
							'status': 'KK',
							'statusNumber': '1',
							'content': 'HYDDXB/23G,P1/S4   SEE RTSTR',
						},
						{
							'lineNumber': '11',
							'ssrCode': 'NSST',
							'airline': 'EK',
							'status': 'KK',
							'statusNumber': '1',
							'content': 'DXBIAD/52J,P1/S5   SEE RTSTR',
						},
						{
							'lineNumber': '12',
							'ssrCode': 'DOCS',
							'airline': 'EK',
							'status': 'HK',
							'statusNumber': '1',
							'content': '////22JUN90/F//MANGALAGIRI/HIMABINDU',
							'data': {
								'dob': {'raw': '22JUN90', 'parsed': '1990-06-22'},
								'gender': 'F',
								'paxIsInfant': false,
								'expirationDate': {'raw': '', 'parsed': null},
								'lastName': 'MANGALAGIRI',
								'firstName': 'HIMABINDU',
							},
						},
					],
				},
			},
		]);

		// child with age - C07
		list.push([
			php.implode(php.PHP_EOL, [
				'                        ***  NHP  ***',
				'RP/SFO1S2195/',
				'  1.IVANOV/ANDREY   2.IVANOVA/MARINA(C07)',
				'  3  9U 173 G 20SEP 4 KIVDME DK4   700A 850A 20SEP  E  0 320 B',
				'     CHECK API DATA REQUIRED',
				'     SEE RTSVC',
				' ',
			]),
			{
				'parsed': {
					'passengers': [
						{
							'firstName': 'ANDREY',
							'lastName': 'IVANOV',
							'age': null,
							'ptc': null,
							'nameNumber': {'fieldNumber': '1'},
						},
						{
							'firstName': 'MARINA',
							'lastName': 'IVANOVA',
							'age': '07',
							'ptc': 'C07',
							'nameNumber': {'fieldNumber': '2'},
						},
					],
					'itinerary': [
						{'departureAirport': 'KIV', 'destinationAirport': 'DME'},
					],
				},
			},
		]);

		// with divided booking lines - '  * SP ...',
		list.push([
			php.implode(php.PHP_EOL, [
				'--- AXR ---',
				'RP/SFO1S2195/SFO1S2195            WS/SU   6MAR18/1513Z   NXNP5Q',
				'------- PRIORITY',
				'M  CREATED IN GDS DIRECT BY PRINCE',
				'-------',
				'SFO1S2195/9998WS/6MAR18',
				'  1.LIBERMANE/LEPIN(C05)',
				'  2  SU1845 Y 10MAY 4 KIVSVO GK1  1250A 345A 10MAY     A',
				'  3  SU2682 Y 10MAY 4 SVORIX GK1   915A1050A 10MAY     A',
				'  4 AP 15123-4567-B',
				'  5 APE JOHN@GMAIL.COM',
				'  6 TK TL01APR/SFO1S2195',
				'  7 RM GD-PRINCE/1588/FOR STANISLAW/2838/LEAD-1 IN SFO1S2195',
				'  8 RM DEV TESTING PLS IGNORE',
				'  * SP 06MAR/WSSU/SFO1S2195-NXNBHM',
				'  * SP 06MAR/WSSU/SFO1S2195-NXNP6L',
				' ',
			]),
			{
				'parsed': {
					'dividedBookings': [
						{
							'date': {'raw': '06MAR', 'parsed': '03-06'},
							'agentInitials': 'WS',
							'dutyCode': 'SU',
							'pcc': 'SFO1S2195',
							'recordLocator': 'NXNBHM',
						},
						{
							'date': {'raw': '06MAR', 'parsed': '03-06'},
							'agentInitials': 'WS',
							'dutyCode': 'SU',
							'pcc': 'SFO1S2195',
							'recordLocator': 'NXNP6L',
						},
					],
				},
			},
		]);

		// example with "FA ... /EV..." - voided ticket
		list.push([
			php.implode(php.PHP_EOL, [
				'--- TST TSM RLR MSC ---',
				'RP/SFO1S2195/ATHA308AA            AA/GS  20FEB18/2312Z   SOKDS8',
				'------- PRIORITY',
				'M  CREATED IN GDS DIRECT BY HARPER',
				'-------',
				'SFO1S2195/9998WS/19FEB18',
				'  1.SUNEBY/PER AKE',
				'  2  A3 883 P 06MAR 2*VIEATH HK1   620P 930P 06MAR  E  A3/SOKDS8',
				'  3  A3 928 P 06MAR 2*ATHTLV HK1  1050P1250A 07MAR  E  A3/SOKDS8',
				'  4 MIS 1A HK1 SFO 19DEC-PRESERVEPNR',
				'  5 AP SFO 888 585-2727 - ITN CORP. - A',
				'  6 TK OK19FEB/SFO1S2195//ETA3',
				'  7 /SSR RQST A3 HK1 VIEATH/08CN,P1/S2   SEE RTSTR',
				'  8 /SSR RQST A3 HK1 ATHTLV/08CN,P1/S3   SEE RTSTR',
				'  9 SSR OTHS 1A A3/OA AUTO XX IF ELECTRONIC TKT NR NOT RCVD BY',
				'       20FEB18 1331 SFO LT',
				' 10 SSR DOCS A3 HK1 ////27AUG50/M//SUNEBY/PER/AKE',
				' 11 SSR DOCS A3 HK1 ////27AUG50/M//SUNEBY/PER AKE',
				' 12 RM GD-HARPER/4535/FOR FRANKLIN/21760/LEAD-7394577 IN',
				'       SFO1S2195',
				' 13 RM 3DSECURE AUTHENTICATION PERFORMED',
				' 14 RM PNR MODIFIED BY THE END USER (TUESDAY-FEBRUARY-20-2018)',
				' 15 FA PAX 390-4558875097/DTA3/EUR12.00/20FEB18/ATHA308AA/274928',
				'       61/E8',
				' 16 FA PAX 390-4558875098/DTA3/EUR12.00/20FEB18/ATHA308AA/274928',
				'       61/E7',
				' 17 FA PAX 390-7081473447/EVA3/USD101.86/19FEB18/SFO1S2195/05578',
				'       602/S2-3',
				' 18 FB PAX 0000000000 TTP/ET/RT OK ETICKET - USD101.86/S2-3',
				' 19 FB PAX 0000000000 TTM/M1,2/RT OK EMD ADVISE PSGR TO BRING',
				'       FOID/PICT ID AT APT/E8',
				' 20 FB PAX 0000000001 TTM/M1,2/RT OK EMD ADVISE PSGR TO BRING',
				'       FOID/PICT ID AT APT/E7',
				' 21 FE PAX VALID ON A3 FLIGHTS/ DATES SHOWN ONLY NON-REFUNDABLE',
				'       /S2-3',
				' 22 FM *M*0',
				' 23 FP PAX CCAXXXXXXXXXXXX3008/0121/A162876/S2-3',
				' 24 FV PAX A3/S2-3',
				' ',
			]),
			{
				'parsed': {
					'tickets': [
						{
							'lineNumber': '15',
							'airlineNumber': '390',
							'documentNumber': '4558875097',
							'isInfant': false,
							'ticketType': 'D',
							'status': 'T',
							'airline': 'A3',
							'currency': 'EUR',
							'amount': '12.00',
							'transactionDt': {'raw': '20FEB18', 'parsed': '2018-02-20'},
							'officeId': 'ATHA308AA',
							'arcNumber': '27492861',
						},
						{
							'lineNumber': '16',
							'airlineNumber': '390',
							'documentNumber': '4558875098',
							'isInfant': false,
							'ticketType': 'D',
							'status': 'T',
							'airline': 'A3',
							'currency': 'EUR',
							'amount': '12.00',
							'transactionDt': {'raw': '20FEB18', 'parsed': '2018-02-20'},
							'officeId': 'ATHA308AA',
							'arcNumber': '27492861',
						},
						{
							'lineNumber': '17',
							'airlineNumber': '390',
							'documentNumber': '7081473447',
							'isInfant': false,
							'ticketType': 'E',
							'status': 'V',
							'airline': 'A3',
							'currency': 'USD',
							'amount': '101.86',
							'transactionDt': {'raw': '19FEB18', 'parsed': '2018-02-19'},
							'officeId': 'SFO1S2195',
							'arcNumber': '05578602',
							'segmentStart': '2',
							'segmentEnd': '3',
						},
					],
					'genericFields': [
						{'lineNumber': '5', 'code': 'AP'},
						{'lineNumber': '6', 'code': 'TK'},
						{
							'lineNumber': '18', 'code': 'FB', 'infMark': 'PAX',
							'content': '0000000000 TTP/ET/RT OK ETICKET - USD101.86',
							'segNums': [2, 3],
						},
						{
							'lineNumber': '19', 'code': 'FB', 'infMark': 'PAX',
							'content': php.implode(php.PHP_EOL, [
								'0000000000 TTM/M1,2/RT OK EMD ADVISE PSGR TO BRING',
								'FOID/PICT ID AT APT/E8',
							]),
						},
						{'lineNumber': '20', 'code': 'FB'},
						{
							'lineNumber': '21',
							'type': 'endorsement',
							'data': {
								'text': 'VALID ON A3 FLIGHTS/ DATES SHOWN ONLY NON-REFUNDABLE',
								'airline': null,
							},
							'segNums': [2, 3],
						},
						{'lineNumber': '22', 'type': 'commission'},
						{'lineNumber': '23', 'type': 'formOfPayment'},
						{
							'lineNumber': '24',
							'type': 'validatingCarrier',
							'data': 'A3',
							'segNums': [2, 3],
						},
					],
				},
			},
		]);

		// example with "FI" element - invoice number
		list.push([
			php.implode(php.PHP_EOL, [
				'--- TST RLR SFP ---',
				'RP/LAXGO3106/LAXGO3106            DV/SU   7APR18/0226Z   J7KGNS',
				'LAXGO3106/0018AA/6APR18',
				'  1.OLIVER/BRANDY MARIE   2.SOTOJR/DANIEL',
				'  3  EI 114 O 03JUN 7 PHLDUB         FLWN',
				'  4  EI 650 W 04JUN 1 DUBFRA HK2   700A1010A 04JUN  E  EI/2T4PAF',
				'  5 AP LAX 310 410-3995 - GLOBAL NETWORK N GOWAY TRAVEL - A',
				'  6 APE ELIAS.G@ITNCORP.COM',
				'  7 TK OK07APR/LAXGO3100//ETEI',
				'  8 SSR DOCS EI HK1 ////13FEB96/F//OLIVER/BRANDY/MARIE/P1',
				'  9 SSR DOCS EI HK1 ////04OCT95/M//SOTOJR/DANIEL/P2',
				' 10 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
				'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
				'       GGAMAUSHAZ/S3',
				' 11 RM *CN/ITN',
				' 12 RM *BB/G22201',
				' 13 RM * 5H-FQ-USD642.46/10.00/0.00',
				' 14 RM *CN/ITN',
				' 15 RM *BA/OTP',
				' 16 RM *BR/4',
				' 17 RM *TA/041',
				' 18 RM *SF/259.00',
				' 19 FA PAX 053-7107928608/ETEI/06APR18/LAXGO3100/05669893',
				'       /S3-4/P1',
				' 20 FA PAX 053-7107928609/ETEI/06APR18/LAXGO3100/05669893',
				'       /S3-4/P2',
				' 21 FB PAX 0000000000 TTP/INV/ET/RT OK ETICKET/S3-4/P1-2',
				' 22 FE PAX NO REFUND FEES/FARE DIFF APPLY FEE APPLIES FOR NAME',
				'       CHNG -BG:EI/S3-4/P1-2',
				' 23 FI PAX 0000000000 INV 0810379775/S3-4/P1',
				' 24 FI PAX 0000000000 INV 0810379776/S3-4/P2',
				' 25 FM *M*0',
				' 26 FP PAX CCVI4111111111111111/0222/A006157/S3-4/P1-2',
				' 27 FS 42',
				' 28 FT *ROC614',
				' 29 FV PAX EI/S3-4/P1-2',
			]),
			{
				'parsed': {
					'genericFields': [
						{'lineNumber': '5', 'code': 'AP'},
						{'lineNumber': '7', 'code': 'TK'},
						{'lineNumber': '21', 'code': 'FB'},
						{
							'lineNumber': '22', 'code': 'FE',
							'type': 'endorsement',
							'data': {
								'text': php.implode(php.PHP_EOL, [
									'NO REFUND FEES/FARE DIFF APPLY FEE APPLIES FOR NAME',
									'CHNG',
								]),
								'airline': 'EI',
							},
							'segNums': [3, 4],
							'paxNums': [1, 2],
						},
						{
							'lineNumber': '23',
							'code': 'FI',
							'type': 'invoice',
							'data': {
								'sequenceNumber': '0000000000',
								'invoiceNumber': '0810379775',
							},
							'segNums': [3, 4],
							'paxNums': [1],
						},
						{
							'lineNumber': '24',
							'code': 'FI',
							'type': 'invoice',
							'data': {
								'sequenceNumber': '0000000000',
								'invoiceNumber': '0810379776',
							},
							'segNums': [3, 4],
							'paxNums': [2],
						},
					],
				},
			},
		]);

		// PTC specified for infant's parent
		list.push([
			php.implode(php.PHP_EOL, [
				'RP/SFO1S2195/',
				'  1.LIBERMANE/MARINA(ADT)(INF/LEPIN/25JAN18)',
				'  2.WELCHTHORSON/CAMERONE ANN',
				'  3  KL 602 Z 23SEP 1 LAXAMS DK2   150P 910A 24SEP  E  0 772 M',
				'     SEE RTSVC',
				'  4  KL1641 Z 02OCT 3 AMSFLR DK2   935A1130A 02OCT  E  0 E90 M',
				'     OPERATED BY KLM CITYHOPPER',
				'     OPERATED BY SUBSIDIARY/FRANCHISE',
				'     SEE RTSVC',
				'  5  AF1367 Z 15OCT 2*FLRCDG DK2  1225P 215P 15OCT  E  0 318 M',
				'     SEE RTSVC',
				'  6  AF 066 Z 16OCT 3*CDGLAX DK2  1000A1230P 16OCT  E  0 388 MS',
				'     APIS DEST PAX DATA REQUIRED SSR DOCS',
				'     SEE RTSVC',
			]),
			{
				'parsed': {
					"passengers": [
						{"firstName": "MARINA", "lastName": "LIBERMANE", "ptc": "ADT", "nameNumber": {"fieldNumber": "1", "isInfant": false, "absolute": 1}},
						{"firstName": "LEPIN", "lastName": "LIBERMANE", "dob": {"raw":"25JAN18","parsed":"2018-01-25"}, "ptc": "INF", "nameNumber": {"fieldNumber": "1", "isInfant": true, "absolute": 2}},
						{"firstName": "CAMERONE ANN", "lastName": "WELCHTHORSON", "ptc": null, "nameNumber": {"fieldNumber": "2", "isInfant": false, "absolute": 3}},
					],
				},
			},
		]);

		// Philipines consolidator PCC - day offset instead of arrival date
		list.push([
			php.implode(php.PHP_EOL, [
				"/$--- MSC SFP ---",
				"RP/MNLPH28FP/",
				"  1  BR 031 C 10DEC 2 JFKTPE HK1       1  0020 0540+1 77W E 0 M",
				"     SEE RTSVC",
				"  2  BR 271 C 11DEC 3 TPEMNL HK1       2  0910 1145   77W E 0 M",
				"     SEE RTSVC",
				"  3 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:",
				"       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -",
				"       GGAMAUSHAZ/S1",
				" ",
			]),
			{
				parsed: {
					itinerary: [
						{departureAirport: 'JFK', destinationAirport: 'TPE', destinationTime: {parsed: '05:40'}, dayOffset: 1},
						{departureAirport: 'TPE', destinationAirport: 'MNL', destinationTime: {parsed: '11:45'}},
					],
				},
			},
		]);

		// 'RTN,AM,C,H,T,X,Z,M,P' output - full PNR with marriages
		list.push([
			php.implode(php.PHP_EOL, [
				'RP/SJC1S212D/SJC1S212D            WS/SU  26AUG19/2304Z   TGC8UJ',
				'SJC1S212D/9998WS/13MAY19',
				'RTN,AM,C,H,T,X,Z,M,P',
				'  1.GARIBON/GARI MR(ADT/24JAN51)',
				'  2  AS1959 K 29MAY 3 SANSFO         FLWN',
				'  3  TK 080 L 29MAY 3 SFOIST         FLWN',
				'  4  TK 467 L 30MAY 4 ISTODS         FLWN',
				'  5  TK 466 M 29AUG 4 ODSIST HK1           1020A1155A   *1A/E*',
				'                                                      A01',
				'  6  TK 079 M 29AUG 4 ISTSFO HK1            105P 430P   *1A/E*',
				'                                                      A01',
				'  7  AS1962 Z 29AUG 4 SFOSAN HK1        2   645P 820P   *1A/E*',
				'NO ELEMENT FOUND',
				'NO ELEMENT FOUND',
				'NO ELEMENT FOUND',
				'  8 MIS 1A HK1 SFO 13MAR-PRESERVEPNR',
				'  9 MIS 1A HK1 SFO 26JUN-PRESERVEPNR',
				'NO ELEMENT FOUND',
				'NO ELEMENT FOUND',
				' 10 AP =============================',
				' 11 AP =27AUG/SE/ PLS REISSUE FOC DUE TO AIRLINE SCHEDULE CHANGE',
				' 12 AP ==============================',
				' 13 APA OK',
				' 14 APN E+KGARIBOVA@YAHOO.COM',
				' 15 APN M+16193709336',
				' 16 TK OK12MAY/SFO1S2195//ETTK',
				' 17 TK PAX OK26AUG/SFO1S2195//ETTK/S5-7',
				' 18 SSR DOCS AS HK1 ////24JAN51/M//GARIBON/GARI',
				' 19 SSR DOCS TK HK1 ////24JAN51/M//GARIBON/GARI',
				' 20 SSR CTCE AS HK1 KGARIBOVA//YAHOO.COM',
				' 21 SSR CTCE TK HK1 KGARIBOVA//YAHOO.COM',
				' 22 SSR CTCM AS HK1 016193709336',
				' 23 SSR CTCM TK HK1 016193709336',
				' 24 SSR ADTK 1A TO TK BY 15MAY 1939 IRC-2/ADV OTO TKT',
				' 25 SSR OTHS 1A PLS ADV FQTV NUMBER IF AVAILABLE WITH SSR FORMAT',
				' 26 OSI 1A SFID 10000070547133R105',
				' 27 OSI 1A CTCT SJC 650 428-0700 TRAVIX INTERNATIONAL INC',
				' 28 OSI 1A TKNO TOD',
				' 29 RM *IRF-KUSW-7016805',
				' 30 RM TRANSACTION_ID:FD6A9F22-2857-413F-A20B-030D794392EF',
				' 31 RM CREATED BY SUPPLY_HUB',
				' 32 RM *F* FARE : PUBLISHED FRC TK IT FARE NO',
				' 33 RM ISSUE TICKET TO ITNUS-A PLEASE',
				' 34 RM NO MATCHING RULES FOUND!',
				' 35 RM *CUSTID-KUSW',
				' 36 RM *Y* TTS2 13MEI-0444 TGC8UJ DISPATCHED FROM AMSAA31AT TO',
				'       ITNUS-A = SFO1S2195 Q81C 0',
				' 37 RM SEVEREPLUS: DEPARTURE AIRPORT CODE MISMATCH ON SEGMENT',
				'       INDEX 3 - ODS != IST! | 7D TRAVEL: UPGRADED TO SEV',
				' 38 RM NO MATCHING RULES FOUND!',
				' 39 RM SEVEREPLUS: DEPARTURE AIRPORT CODE MISMATCH ON SEGMENT',
				'       INDEX 3 - IST != SFO! | 7D TRAVEL: UPGRADED TO SEV',
				' 40 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
				'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
				'       GGAMAUSHAZ/S2-3,6-7',
				' 41 RM *T*27AUG/SENT TO CONSOLIDATOR FOR REISSUE',
				' 42 FA PAX 235-7321258791-92/ETTK/USD1316.53/12MAY19/SFO1S2195/0',
				'       5578602/S2-4',
				' 43 FA PAX 235-7336552759/ETTK/USD1316.53/26AUG19/SFO1S2195/0557',
				'       8602/S5-7',
				' 44 FB PAX 0000000000 TTP/ET/RT OK ETICKET - USD1316.53/S2-4',
				' 45 FB PAX 0000000000 TTP/ET/EXCH/T3/RT OK ETICKET - USD1316.53',
				'       /S5-7',
				' 46 FE *M*INVOL EXCH DUE TO SC NONEND/TK-UA/B6/AC/VX ONLY -BG TK',
				' 47 FG PAX 0000000000 AMSAA3102/S2-4',
				' 48 FG PAX 0000000000 AMSAA3102/S5-7',
				' 49 FK AMSAA3102',
				' 50 FM *M*5',
				' 51 FO 235-7321258791SFO12MAY19/05578602/235-73212587910E4*B759.',
				'       00/X557.53/C0.00',
				' 52 FP O/CASH',
				' 53 FV TK',
			]),
			{
				parsed: {
					"pnrInfo": {
						"responsibleOfficeId": "SJC1S212D",
						"queueingOfficeId": "SJC1S212D",
						"agentInitials": "WS",
						"dutyCode": "SU",
						"recordLocator": "TGC8UJ",
						"date": {"raw": "26AUG19", "parsed": "2019-08-26"},
						"time": {"raw": "2304", "parsed": "23:04"},
					},
					passengers: [{
						"success": true,
						"firstName": "GARI MR",
						"lastName": "GARIBON",
						"age": null,
						"dob": {"raw":"24JAN51","parsed":"1951-01-24"},
						"ptc": "ADT",
						"nameNumber": {"fieldNumber":"1","isInfant":false,"raw":"1.","absolute":1,"firstNameNumber":1},
						"ageGroup": null,
					}],
					itinerary: [
						{"lineNumber":"2","segmentType":"FLWN","airline":"AS","flightNumber":"1959","bookingClass":"K","departureDate":{"raw":"29MAY","parsed":"05-29"},"dayOfWeek":"3","departureAirport":"SAN","destinationAirport":"SFO","raw":"  2  AS1959 K 29MAY 3 SANSFO         FLWN"},
						{"lineNumber":"3","segmentType":"FLWN","airline":"TK","flightNumber":"080","bookingClass":"L","departureDate":{"raw":"29MAY","parsed":"05-29"},"dayOfWeek":"3","departureAirport":"SFO","destinationAirport":"IST","raw":"  3  TK 080 L 29MAY 3 SFOIST         FLWN"},
						{"lineNumber":"4","segmentType":"FLWN","airline":"TK","flightNumber":"467","bookingClass":"L","departureDate":{"raw":"30MAY","parsed":"05-30"},"dayOfWeek":"4","departureAirport":"IST","destinationAirport":"ODS","raw":"  4  TK 467 L 30MAY 4 ISTODS         FLWN"},
						{"lineNumber":"5", marriage: '01', "segmentType":'AIR',"displayFormat":"DAY_OFFSET","airline":"TK","flightNumber":"466","bookingClass":"M","departureDate":{"raw":"29AUG","parsed":"08-29"},"dayOfWeek":"4","departureAirport":"ODS","destinationAirport":"IST","segmentStatus":"HK","seatCount":"1","terminalTime":null,"terminal":"","departureTime":{"raw":"1020A","parsed":"10:20"},"destinationTime":{"raw":"1155A","parsed":"11:55"},"dayOffset":0,"eticket":true,"confirmationAirline":null,"confirmationNumber":null,"textLeft":"","gds":"1A"},
						{"lineNumber":"6", marriage: '01', "segmentType":'AIR',"displayFormat":"DAY_OFFSET","airline":"TK","flightNumber":"079","bookingClass":"M","departureDate":{"raw":"29AUG","parsed":"08-29"},"dayOfWeek":"4","departureAirport":"IST","destinationAirport":"SFO","segmentStatus":"HK","seatCount":"1","terminalTime":null,"terminal":"","departureTime":{"raw":"105P","parsed":"13:05"},"destinationTime":{"raw":"430P","parsed":"16:30"},"dayOffset":0,"eticket":true,"confirmationAirline":null,"confirmationNumber":null,"textLeft":"","gds":"1A"},
						{"lineNumber":"7","segmentType":'AIR',"displayFormat":"DAY_OFFSET","airline":"AS","flightNumber":"1962","bookingClass":"Z","departureDate":{"raw":"29AUG","parsed":"08-29"},"dayOfWeek":"4","departureAirport":"SFO","destinationAirport":"SAN","segmentStatus":"HK","seatCount":"1","terminalTime":null,"terminal":"2","departureTime":{"raw":"645P","parsed":"18:45"},"destinationTime":{"raw":"820P","parsed":"20:20"},"dayOffset":0,"eticket":true,"confirmationAirline":null,"confirmationNumber":null,"textLeft":"","gds":"1A"},
						{"lineNumber":"8","segmentType":"OTH","text":"  8 MIS 1A HK1 SFO 13MAR-PRESERVEPNR"},
						{"lineNumber":"9","segmentType":"OTH","text":"  9 MIS 1A HK1 SFO 26JUN-PRESERVEPNR"},
					],
				},
			},
		]);

		return list;
	}

	/**
	 * @dataProvider provideParserData
	 */
	testParser(dump, expectedResult) {
		let actualResult = PnrParser.parse(dump);
		try {
			this.assertArrayElementsSubset(expectedResult, actualResult);
		} catch (exc) {
			throw exc;
		}
	}

	getTestMapping() {
		return [
			[this.provideParserData, this.testParser],
		];
	}
}

module.exports = PnrParserTest;
