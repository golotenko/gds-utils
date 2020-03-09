const UpdateState_apollo = require('../../src/state_tracking/UpdateState_apollo.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

const makeDefaultStateBase = () => {
	return {
		'gds': null,
		'pcc': null,
		'area': 'A',
		'recordLocator': '',
		'hasPnr': false,
		'isPnrStored': false,
	};
};

const makeDefaultApolloState = () => {
	return {
		...makeDefaultStateBase(),
		'gds': 'apollo', 'pcc': '2G55',
	};
};

const provide_call = () => {
	const sessionRecords = [];

	sessionRecords.push({
		title: 'Work Areas should be tracked properly',
		'initialState': makeDefaultApolloState(),
		'calledCommands': [
			{
				'cmd': 'A/L/28JUNPARCHI1AAMS|KL',
				'output': 'FIRAV              WE 28JUN PARCHI- 7:00 HR                     1* KL2006 J9 C9 D9 I9 Z5 Y9 B9 M9 P9 U9 CDGAMS 750A  910A 321* 0          F9 K9 W9 H9 S9 L9 A9 Q9 T9 E0 N0 R0 V0 X0 G0          2* KL 611 J9 C9 D9 I9 Z5 Y9 B9 M9 U9 K9    ORD1225P  155P 74E  0          H9 L9 Q9 T9 E0 N0 R0 V0 G0                            HILTON GARDEN INN * CHICAGO RTS FROM 109 US              >AH*1; WOW YOUR CLIENT * HILTON CHICAGO RTS FR 119 US           >AH*2; MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              WE 28JUN PARCHI- 7:00 HR                     1* KL2002 J8 C8 D8 I8 Z5 Y9 B9 M9 P9 U9 CDGAMS 720A  840A 321* 0          F9 K9 W9 H9 S9 L9 A9 Q9 T9 E0 N0 R0 V0 X0 G0          2* KL 611 J9 C9 D9 I9 Z5 Y9 B9 M9 U9 K9    ORD1225P  155P 74E  0          H9 L9 Q9 T9 E0 N0 R0 V0 G0                            HILTON GARDEN INN * CHICAGO RTS FROM 109 US              >AH*1; WOW YOUR CLIENT * HILTON CHICAGO RTS FR 119 US           >AH*2; MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              WE 28JUN PARCHI- 7:00 HR                     1* KL1230 J6 C6 D6 I6 Z5 Y9 B9 M9 P9 U9 CDGAMS1015A 1135A 73H  0          F9 K9 W9 H9 S9 L9 A9 Q9 T9 E0 N0 R0 V0 X0 G0          2* KL 611 J6 C6 D6 I6 Z5 Y9 B9 M9 U9 K9    ORD1225P  155P 74E  0          H9 L9 Q9 T9 E0 N0 R0 V0 G0                            HILTON GARDEN INN * CHICAGO RTS FROM 109 US              >AH*1; WOW YOUR CLIENT * HILTON CHICAGO RTS FR 119 US           >AH*2; MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              WE 28JUN PARCHI- 7:00 HR                     1* KL1224 J9 C9 D9 I9 Z5 Y9 B9 M9 P9 U9 CDGAMS 845A  955A 73H  0          F9 K9 W9 H9 S9 L9 A9 Q9 T9 E0 N0 R0 V0 X0 G0          2* KL 611 J9 C9 D9 I9 Z5 Y9 B9 M9 U9 K9    ORD1225P  155P 74E  0          H9 L9 Q9 T9 E0 N0 R0 V0 G0                            HILTON GARDEN INN * CHICAGO RTS FROM 109 US              >AH*1; WOW YOUR CLIENT * HILTON CHICAGO RTS FR 119 US           >AH*2; MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              WE 28JUN PARCHI- 7:00 HR                     1* KL1228 J9 C9 D9 I9 Z5 Y9 B9 M9 P9 U9 CDGAMS 935A 1100A 73W  0          F9 K9 W9 H9 S9 L9 A9 Q9 T8 E0 N0 R0 V0 X0 G0          2* KL 611 J9 C9 D9 I9 Z5 Y9 B9 M9 U9 K9    ORD1225P  155P 74E  0          H9 L9 Q9 T8 E0 N0 R0 V0 G0                            WOW YOUR CLIENT * HILTON CHICAGO RTS FR 119 US           >AH*1; HILTON GARDEN INN * CHICAGO RTS FROM 109 US              >AH*2; MEALS>A*M;  ><',
				'state': {'hasPnr': false},
			},
			{
				'cmd': '02L1T2',
				'output': php.implode(php.PHP_EOL, [
					' 1 KL 1228L  28JUN CDGAMS SS2   935A 1100A *      1          E',
					'DEPARTS CDG TERMINAL 2F',
					' 2 KL  611T  28JUN AMSORD SS2  1225P  155P *      1          E',
					'OFFER CAR/HOTEL    >CAL;     >HOA;',
					'                         ARRIVES ORD TERMINAL 5 ',
					'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS',
					'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
					'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
					'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
					'><',
				]),
				'state': {'hasPnr': true, 'isPnrStored': false},
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'NO NAMES',
					' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
					' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
					'><',
				]),
			},
			{
				'cmd': 'A/E/6JULCHILGA/D|DL',
				'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5960 F9 P9 A9 G8 W9 Y9 B9 M9 H9 Q9 ORDLGA 630A  940A E75*70          K9 L9 U9 T9 X7 V0 E9                                  MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5962 F9 P9 A9 G7 W9 Y9 B9 M9 H9 Q9 ORDLGA 730A 1044A E75*70          K9 L9 U9 T9 X5 V0 E9                                  MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5964 F9 P9 A9 G9 W9 Y9 B9 M9 H9 Q9 ORDLGA 830A 1141A E75*80          K9 L9 U9 T7 X2 V0 E9                                  MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5966 F9 P9 A9 G7 W9 Y9 B9 M9 H9 Q9 ORDLGA 930A 1245P E75*80          K9 L9 U8 T3 X2 V0 E9                                  MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5970 F9 P9 A9 G8 W9 Y9 B9 M9 H9 Q9 ORDLGA1130A  240P E75*60          K9 L9 U9 T9 X4 V0 E9                                  MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5972 F9 P9 A7 G4 W9 Y9 B9 M9 H9 Q9 ORDLGA1230P  345P E75*60          K9 L9 U9 T9 X6 V0 E9                                  MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5976 F9 P9 A9 G3 W9 Y9 B9 M9 H9 Q9 ORDLGA 230P  545P E75*60          K9 L9 U9 T9 X9 V9 E9                                  MEALS>A*M;  ><',
			},
			{
				'cmd': '02E1',
				'output': php.implode(php.PHP_EOL, [
					' 3 DL 5976E   6JUL ORDLGA SS2   230P  545P *                 E',
					'NOT VALID FOR INTERLINE CONNECTIONS - DL',
					'DELTA CONX/QUOTE AS REPUBLIC AIRLINE INC *',
					'LOCAL AND ONLINE CONNECTING TRAFFIC ONLY *',
					'DPTS/ARVS LGA FROM MARINE AIR TERMINAL *',
					'OFFER CAR/HOTEL    >CAL;     >HOA;',
					'OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL SHUTTLE',
					'DEPARTS ORD TERMINAL 2  - ARRIVES LGA TERMINAL A ',
					'><',
				]),
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'NO NAMES',
					' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
					' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
					' 3 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
					'         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
					'><',
				]),
			},
			{
				'cmd': 'A/E/10JULLGAMSP/D|DL',
				'output': 'FIRAV              MO 10JUL NYCMSP- 1:00 HR                     1| DL 121 J9 C9 D9 I1 Z0 W9 Y9 B9 M9 H9 LGAMSP 829A 1034A 320 90          Q9 K9 L9 U9 T9 X6 V0 E9                               MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              MO 10JUL NYCMSP- 1:00 HR                     1| DL1496 F7 P0 A0 G0 W6 Y9 B9 M9 H9 Q9 LGAMSP1000A 1215P 319 80          K9 L9 U9 T9 X9 V0 E9                                  MEALS>A*M;  ><',
			},
			{
				'cmd': '02E1',
				'output': php.implode(php.PHP_EOL, [
					' 4 DL 1496E  10JUL LGAMSP SS2  1000A 1215P *                 E',
					'OFFER CAR/HOTEL    >CAL;     >HOA;',
					'DEPARTS LGA TERMINAL D  - ARRIVES MSP TERMINAL 1 ',
					'><',
				]),
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'NO NAMES',
					' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
					' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
					' 3 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
					'         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
					' 4 DL1496E 10JUL LGAMSP SS2  1000A 1215P *         MO   E',
					'><',
				]),
			},
			{
				'cmd': 'A/T/17JULMSPPAR/D|DL',
				'output': 'FIRAV              MO 17JUL MSPPAR| 7:00 HR                     1| DL 140 J9 C9 D9 I4 Z3 W0 Y9 B9 M9 H9 MSPCDG 424P  730A|777  0          Q9 K9 L9 U9 T9 X9 V9 E9                               MEALS>A*M;  ><',
			},
			{
				'cmd': '02T1',
				'output': php.implode(php.PHP_EOL, [
					' 5 DL  140T  17JUL MSPCDG SS2   424P  730A|*                 E',
					'MOVIES *',
					'6**SKY PRIORITY IN C *',
					'DELTA ONE SVC THIS FLT *',
					'OFFER CAR/HOTEL    >CAL;     >HOA;',
					'DEPARTS MSP TERMINAL 1  - ARRIVES CDG TERMINAL 2E',
					'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS',
					'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
					'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
					'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
					'><',
				]),
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'NO NAMES',
					' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
					' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
					' 3 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
					'         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
					' 4 DL1496E 10JUL LGAMSP SS2  1000A 1215P *         MO   E',
					' 5 DL 140T 17JUL MSPCDG SS2   424P  730A|*      MO/TU   E',
					'><',
				]),
			},
			{
				'cmd': '$BBS1|2|5',
				'output': php.implode(php.PHP_EOL, [
					'>$BBS1-*2G55|2-*2G55|5-*2G55',
					'*FARE GUARANTEED AT TICKET ISSUANCE*',
					'',
					'*FARE HAS A PLATING CARRIER RESTRICTION*',
					'E-TKT REQUIRED',
					'NO REBOOK REQUIRED',
					'',
					'*PENALTY APPLIES*',
					'LAST DATE TO PURCHASE TICKET: 14JUN17',
					'$BB-1-2 C06JUN17     ',
					'PAR KL X/AMS KL CHI M319.05TKXRDFR /-MSP DL PAR 555.03THWSRFR',
					'NUC874.08END ROE0.944989',
					'FARE EUR 826.00 EQU USD 932.00 TAX 5.60AY TAX 36.00US TAX',
					')><',
				]),
				// /S/-egment modifier used
				'state': {'area': 'A', 'pcc': '2G55', 'pricingCmd': '$BBS1|2|5', 'hasPnr': true},
			},
			{
				'cmd': 'SB',
				'output': php.implode(php.PHP_EOL, [
					'A-OUT B-IN AG-NOT AUTH - APOLLO',
					'><',
				]),
				'state': {'area': 'B', 'pcc': '', 'hasPnr': false},
			},
			{
				'cmd': 'SEM/2G2H/AG',
				'output': php.implode(php.PHP_EOL, [
					'PROCEED/06JUN-SKYBIRD                  SFO - APOLLO',
					'><',
				]),
				'state': {'area': 'B', 'pcc': '2G2H'},
			},
			{
				'cmd': 'A/E/6JULCHILGA/D|DL',
				'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5960 F9 P9 A9 G8 W9 Y9 B9 M9 H9 Q9 ORDLGA 630A  940A E75*70          K9 L9 U9 T9 X7 V0 E9                                  MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5962 F9 P9 A9 G7 W9 Y9 B9 M9 H9 Q9 ORDLGA 730A 1044A E75*70          K9 L9 U9 T9 X5 V0 E9                                  MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5964 F9 P9 A9 G9 W9 Y9 B9 M9 H9 Q9 ORDLGA 830A 1141A E75*80          K9 L9 U9 T7 X2 V0 E9                                  MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5966 F9 P9 A9 G7 W9 Y9 B9 M9 H9 Q9 ORDLGA 930A 1245P E75*80          K9 L9 U8 T3 X2 V0 E9                                  MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5970 F9 P9 A9 G8 W9 Y9 B9 M9 H9 Q9 ORDLGA1130A  240P E75*60          K9 L9 U9 T9 X4 V0 E9                                  MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5972 F9 P9 A7 G4 W9 Y9 B9 M9 H9 Q9 ORDLGA1230P  345P E75*60          K9 L9 U9 T9 X6 V0 E9                                  MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5976 F9 P9 A9 G3 W9 Y9 B9 M9 H9 Q9 ORDLGA 230P  545P E75*60          K9 L9 U9 T9 X9 V9 E9                                  MEALS>A*M;  ><',
				'state': {'hasPnr': false},
			},
			{
				'cmd': '02E1',
				'output': php.implode(php.PHP_EOL, [
					' 1 DL 5976E   6JUL ORDLGA SS2   230P  545P *                 E',
					'NOT VALID FOR INTERLINE CONNECTIONS - DL',
					'DELTA CONX/QUOTE AS REPUBLIC AIRLINE INC *',
					'LOCAL AND ONLINE CONNECTING TRAFFIC ONLY *',
					'DPTS/ARVS LGA FROM MARINE AIR TERMINAL *',
					'OFFER CAR/HOTEL    >CAL;     >HOA;',
					'OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL SHUTTLE',
					'DEPARTS ORD TERMINAL 2  - ARRIVES LGA TERMINAL A ',
					'><',
				]),
				'state': {'hasPnr': true},
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'NO NAMES',
					' 1 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
					'         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
					'><',
				]),
			},
			{
				'cmd': 'A/E/10JULLGAMSP/D|DL',
				'output': 'FIRAV              MO 10JUL NYCMSP- 1:00 HR                     1| DL 121 J9 C9 D9 I1 Z0 W9 Y9 B9 M9 H9 LGAMSP 829A 1034A 320 90          Q9 K9 L9 U9 T9 X6 V0 E9                               MEALS>A*M;  ><',
			},
			{
				'cmd': 'A*',
				'output': 'FIRAV              MO 10JUL NYCMSP- 1:00 HR                     1| DL1496 F7 P0 A0 G0 W6 Y9 B9 M9 H9 Q9 LGAMSP1000A 1215P 319 80          K9 L9 U9 T9 X9 V0 E9                                  MEALS>A*M;  ><',
			},
			{
				'cmd': '02E1',
				'output': php.implode(php.PHP_EOL, [
					' 2 DL 1496E  10JUL LGAMSP SS2  1000A 1215P *                 E',
					'OFFER CAR/HOTEL    >CAL;     >HOA;',
					'DEPARTS LGA TERMINAL D  - ARRIVES MSP TERMINAL 1 ',
					'><',
				]),
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'NO NAMES',
					' 1 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
					'         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
					' 2 DL1496E 10JUL LGAMSP SS2  1000A 1215P *         MO   E',
					'><',
				]),
			},
			{
				'cmd': '$BB',
				'output': php.implode(php.PHP_EOL, [
					'>$BB-*2G2H',
					'*FARE GUARANTEED AT TICKET ISSUANCE*',
					'',
					'E-TKT REQUIRED',
					'NO REBOOK REQUIRED',
					'',
					'*PENALTY APPLIES*',
					'LAST DATE TO PURCHASE TICKET: 07JUN17',
					'$BB-1-2 C06JUN17     ',
					'CHI DL NYC 96.74XAVNA5BN DL MSP 172.09XFVUA0BX USD268.83END ZP',
					'ORDLGA',
					'FARE USD 268.83 TAX 11.20AY TAX 20.17US TAX 9.00XF TAX 8.20ZP',
					'TOT USD 317.40 ',
					'S1 NVB06JUL/NVA06JUL',
					'S2 NVB10JUL/NVA10JUL',
					'E NONREF/NOCHGS',
					'E NOPRE RSVDSEAT',
					'TICKETING AGENCY 2G2H',
					'DEFAULT PLATING CARRIER DL',
					'US PFC: XF ORD4.5 LGA4.5 ',
					'BAGGAGE ALLOWANCE',
					'ADT                                                         ',
					' DL CHINYC  0PC                                             ',
					'   BAG 1 -  25.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM',
					'   BAG 2 -  35.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM',
					'   MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
					'                                                                 DL NYCMSP  0PC                                             ',
					'   BAG 1 -  25.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM',
					'   BAG 2 -  35.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM',
					'   MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
					'                                                                CARRY ON ALLOWANCE',
					' DL CHINYC  1PC                                             ',
					'   BAG 1 -  NO FEE       PERSONAL ITEM                    ',
					' DL NYCMSP  1PC                                             ',
					'   BAG 1 -  NO FEE       PERSONAL ITEM                    ',
					'                                                                EMBARGO - FOR BAGGAGE LIMITATIONS SEE ',
					' DL CHINYC  MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG         ',
					' DL NYCMSP  MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG         ',
					'                                                                BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
					'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
					'',
				]),
				'state': {'area': 'B', 'pcc': '2G2H', 'pricingCmd': '$BB'},
			},
			{
				'cmd': 'SA',
				'output': php.implode(php.PHP_EOL, [
					'B-OUT A-IN AG-OK FIN OR IGN - APOLLO',
					'NO NAMES',
					' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
					' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
					' 3 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
					'         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
					' 4 DL1496E 10JUL LGAMSP SS2  1000A 1215P *         MO   E',
					' 5 DL 140T 17JUL MSPCDG SS2   424P  730A|*      MO/TU   E',
					'><',
				]),
				'state': {
					'area': 'A',
					'pcc': '2G55',
					'pricingCmd': '$BBS1|2|5',
					'hasPnr': true,
					'isPnrStored': false,
					itinerary: [
						{airline: 'KL', flightNumber:  '1228'},
						{airline: 'KL', flightNumber:  '611'},
						{airline: 'DL', flightNumber:  '5976'},
						{airline: 'DL', flightNumber:  '1496'},
						{airline: 'DL', flightNumber:  '140'},
					],
				},
			},
			{
				'cmd': 'X3|4',
				'output': php.implode(php.PHP_EOL, [
					'NEXT REPLACES  3',
					'><',
				]),
				state: {
					itinerary: [
						{airline: 'KL', flightNumber:  '1228'},
						{airline: 'KL', flightNumber:  '611'},
						{airline: 'DL', flightNumber:  '140'},
					],
					nextAddSegmentNumber: '3',
				},
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'NO NAMES',
					' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
					' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
					' 3 DL 140T 17JUL MSPCDG SS2   424P  730A|*      MO/TU   E',
					'><',
				]),
			},
			{
				'cmd': '$BB',
				'output': php.implode(php.PHP_EOL, [
					'>$BB-*2G55',
					'*FARE GUARANTEED AT TICKET ISSUANCE*',
					'',
					'*FARE HAS A PLATING CARRIER RESTRICTION*',
					'E-TKT REQUIRED',
					'NO REBOOK REQUIRED',
					'',
					'*PENALTY APPLIES*',
					'LAST DATE TO PURCHASE TICKET: 14JUN17',
					'$BB-1-2 C06JUN17     ',
					'PAR KL X/AMS KL CHI M319.05TKXRDFR /-MSP DL PAR 555.03THWSRFR',
					'NUC874.08END ROE0.944989',
					'FARE EUR 826.00 EQU USD 932.00 TAX 5.60AY TAX 36.00US TAX',
					'3.96XA TAX 4.50XF TAX 7.00XY TAX 5.50YC TAX 23.50FR TAX 5.10IZ',
					'TAX 13.10QX TAX 6.40CJ TAX 6.00RN TAX 285.60YR TOT USD 1334.26 ',
					' ',
					'S1 NVB28JUN/NVA28JUN',
					'S2 NVB28JUN/NVA28JUN',
					'S3 NVB17JUL/NVA17JUL',
					'E NONREF',
					'E NO CHGES PERMITTED',
					'E NONENDO',
					'E NONREF/PENALTY APPLIES',
					'TICKETING AGENCY 2G55',
					'DEFAULT PLATING CARRIER DL',
					'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.12855USD',
					'US PFC: XF MSP4.5 ',
					'BAGGAGE ALLOWANCE',
					'ADT                                                         ',
					' KL PARCHI  1PC                                             ',
					'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
					'   BAG 2 -  85.00 EUR    UPTO50LB/23KG AND UPTO62LI/158LCM',
					'   MYTRIPANDMORE.COM/BAGGAGEDETAILSKL.BAGG',
					'                                                                 KL MSPPAR  1PC                                             ',
					'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
					'   BAG 2 -  85.00 EUR    UPTO50LB/23KG AND UPTO62LI/158LCM',
					'   MYTRIPANDMORE.COM/BAGGAGEDETAILSKL.BAGG',
					'                                                                CARRY ON ALLOWANCE',
					' KL PARAMS  1PC                                             ',
					'   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO45LI/115LCM',
					' KL AMSCHI  1PC                                             ',
					'   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO45LI/115LCM',
					' DL MSPPAR  1PC                                             ',
					'   BAG 1 -  NO FEE       PERSONAL ITEM                    ',
					'                                                                EMBARGO - FOR BAGGAGE LIMITATIONS SEE ',
					' DL MSPPAR  MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG         ',
					'                                                                BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
					'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
					'',
				]),
				'state': {'area': 'A', 'pcc': '2G55', 'pricingCmd': '$BB'},
			},
			{
				'cmd': 'SB',
				'output': php.implode(php.PHP_EOL, [
					'A-OUT B-IN AG-OK FIN OR IGN - APOLLO',
					'NO NAMES',
					' 1 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
					'         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
					' 2 DL1496E 10JUL LGAMSP SS2  1000A 1215P *         MO   E',
					'><',
				]),
				'state': {'area': 'B', 'pcc': '2G2H'},
			},
			{
				'cmd': '$BB',
				'output': php.implode(php.PHP_EOL, [
					'>$BB-*2G2H',
					'*FARE GUARANTEED AT TICKET ISSUANCE*',
					'',
					'E-TKT REQUIRED',
					'NO REBOOK REQUIRED',
					'',
					'*PENALTY APPLIES*',
					'LAST DATE TO PURCHASE TICKET: 07JUN17',
					'$BB-1-2 C06JUN17     ',
					'CHI DL NYC 96.74XAVNA5BN DL MSP 172.09XFVUA0BX USD268.83END ZP',
					'ORDLGA',
					'FARE USD 268.83 TAX 11.20AY TAX 20.17US TAX 9.00XF TAX 8.20ZP',
					'TOT USD 317.40 ',
					'S1 NVB06JUL/NVA06JUL',
					'S2 NVB10JUL/NVA10JUL',
					'E NONREF/NOCHGS',
					'E NOPRE RSVDSEAT',
					'TICKETING AGENCY 2G2H',
					'DEFAULT PLATING CARRIER DL',
					'US PFC: XF ORD4.5 LGA4.5 ',
					'BAGGAGE ALLOWANCE',
					'ADT                                                         ',
					' DL CHINYC  0PC                                             ',
					'   BAG 1 -  25.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM',
					'   BAG 2 -  35.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM',
					'   MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
					'                                                                 DL NYCMSP  0PC                                             ',
					'   BAG 1 -  25.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM',
					'   BAG 2 -  35.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM',
					'   MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
					'                                                                CARRY ON ALLOWANCE',
					' DL CHINYC  1PC                                             ',
					'   BAG 1 -  NO FEE       PERSONAL ITEM                    ',
					' DL NYCMSP  1PC                                             ',
					'   BAG 1 -  NO FEE       PERSONAL ITEM                    ',
					'                                                                EMBARGO - FOR BAGGAGE LIMITATIONS SEE ',
					' DL CHINYC  MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG         ',
					' DL NYCMSP  MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG         ',
					'                                                                BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
					'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
					'',
				]),
				'state': {'area': 'B', 'pcc': '2G2H'},
			},
			{
				'cmd': 'SA',
				'output': php.implode(php.PHP_EOL, [
					'B-OUT A-IN AG-OK FIN OR IGN - APOLLO',
					'NO NAMES',
					' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
					' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
					' 3 DL 140T 17JUL MSPCDG SS2   424P  730A|*      MO/TU   E',
					'><',
				]),
				'state': {
					'area': 'A', 'pcc': '2G55',
					itinerary: [
						{airline: 'KL', flightNumber:  '1228'},
						{airline: 'KL', flightNumber:  '611'},
						{airline: 'DL', flightNumber:  '140'},
					],
				},
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'NO NAMES',
					' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
					' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
					' 3 DL 140T 17JUL MSPCDG SS2   424P  730A|*      MO/TU   E',
					'><',
				]),
			},
			{
				'cmd': 'N:BOMA/BARONDA',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': 'N:AGBOBLY/KOKO',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': 'T:TAU/6JUN',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': 'R:ROLO',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': '@:5ROLO/ID8084/CREATED FOR ROLO/ID8084/REQ. ID-4096798',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'',
				]),
			},
			{
				'cmd': 'ER',
				'output': php.implode(php.PHP_EOL, [
					'SEG CONT SEG 03',
					'><',
				]),
				'state': {'area': 'A', 'pcc': '2G55', 'isPnrStored': false},
			},
			{
				'cmd': 'ER',
				'output': php.implode(php.PHP_EOL, [
					'OK - VH5M50-INTERNATIONAL TVL NETWOR SFO',
					'><',
				]),
				'state': {'area': 'A', 'pcc': '2G55', 'isPnrStored': true, 'recordLocator': 'VH5M50'},
			},
			{
				'cmd': 'T:$B',
				'output': php.implode(php.PHP_EOL, [
					'>$B-*2G55',
					'*FARE GUARANTEED AT TICKET ISSUANCE*',
					'',
					'*FARE HAS A PLATING CARRIER RESTRICTION*',
					'E-TKT REQUIRED',
					'*PENALTY APPLIES*',
					'LAST DATE TO PURCHASE TICKET: 14JUN17',
					'$B-1-2 C06JUN17     ',
					'PAR KL X/AMS KL CHI M319.05TKXRDFR /-MSP DL PAR 555.03THWSRFR',
					'NUC874.08END ROE0.944989',
					'FARE EUR 826.00 EQU USD 932.00 TAX 5.60AY TAX 36.00US TAX',
					'3.96XA TAX 4.50XF TAX 7.00XY TAX 5.50YC TAX 23.50FR TAX 5.10IZ',
					'TAX 13.10QX TAX 6.40CJ TAX 6.00RN TAX 285.60YR TOT USD 1334.26 ',
					')><',
				]),
			},
			{
				'cmd': 'R:ROLO',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': 'ER',
				'output': php.implode(php.PHP_EOL, [
					'SEG CONT SEG 03',
					'><',
				]),
			},
			{
				'cmd': 'ER',
				'output': php.implode(php.PHP_EOL, [
					'OK - VH5M50-INTERNATIONAL TVL NETWOR SFO',
					'><',
				]),
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'VH5M50/WS QSBYC DPBVWS  AG 05578602 06JUN',
					' 1.1BOMA/BARONDA  2.1AGBOBLY/KOKO ',
					' 1 KL1228L 28JUN CDGAMS HK2   935A 1100A *         WE   E  1',
					' 2 KL 611T 28JUN AMSORD HK2  1225P  155P *         WE   E  1',
					' 3 DL 140T 17JUL MSPCDG HK2   424P  730A|*      MO/TU   E',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'TKTG-TAU/06JUN',
					'*** LINEAR FARE DATA EXISTS *** >*LF; ',
					'ATFQ-OK/$B-*2G55/TA2G55/CDL/ET',
					' FQ-EUR 1652.00/USD 72.00US/USD 732.52XT/USD 2668.52 - 6JUN TKXRDFR.TKXRDFR.THWSRFR/TKXRDFR.TKXRDFR.THWSRFR',
					'RMKS-ROLO/ID8084/CREATED FOR ROLO/ID8084/REQ. ID-4096798',
					'ACKN-DL HCOHXM   06JUN 2022',
					'   2 1A J8MCV8   06JUN 2022',
					'   3 1A J8MCV8   06JUN 2022',
					'',
				]),
				'state': {'area': 'A', 'pcc': '2G55', 'isPnrStored': true, 'recordLocator': 'VH5M50'},
			},
			{
				'cmd': 'SB',
				'output': php.implode(php.PHP_EOL, [
					'A-OUT B-IN AG-OK FIN OR IGN - APOLLO',
					'NO NAMES',
					' 1 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
					'         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
					' 2 DL1496E 10JUL LGAMSP SS2  1000A 1215P *         MO   E',
					'><',
				]),
				'state': {'area': 'B', 'pcc': '2G2H', 'isPnrStored': false},
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'NO NAMES',
					' 1 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
					'         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
					' 2 DL1496E 10JUL LGAMSP SS2  1000A 1215P *         MO   E',
					'><',
				]),
			},
			{
				'cmd': 'N:BOMA/BARONDA',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': 'N:AGBOBLY/KOKO',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': 'T:TAU/6JUN',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': 'R:ROLO',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
				'state': {'area': 'B', 'pcc': '2G2H', 'isPnrStored': false},
			},
			{
				'cmd': 'ER',
				'output': php.implode(php.PHP_EOL, [
					'OK - VH78R8-SKYBIRD                  SFO',
					'><',
				]),
				'state': {'area': 'B', 'pcc': '2G2H', 'isPnrStored': true, 'recordLocator': 'VH78R8'},
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'VH78R8/WS QSBYC DPBVWS  AG 23854526 06JUN',
					' 1.1BOMA/BARONDA  2.1AGBOBLY/KOKO ',
					' 1 DL5976E 06JUL ORDLGA HK2   230P  545P *         TH   E',
					'         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
					' 2 DL1496E 10JUL LGAMSP HK2  1000A 1215P *         MO   E',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'TKTG-TAU/06JUN',
					'ACKN-DL HGH25V   06JUN 2024',
					'',
				]),
			},
			{
				'cmd': 'T:$B',
				'output': php.implode(php.PHP_EOL, [
					'>$B-*2G2H',
					'*FARE GUARANTEED AT TICKET ISSUANCE*',
					'',
					'E-TKT REQUIRED',
					'*PENALTY APPLIES*',
					'LAST DATE TO PURCHASE TICKET: 07JUN17',
					'$B-1-2 C06JUN17     ',
					'CHI DL NYC 96.74XAVNA5BN DL MSP 172.09XFVUA0BX USD268.83END ZP',
					'ORDLGA',
					'FARE USD 268.83 TAX 11.20AY TAX 20.17US TAX 9.00XF TAX 8.20ZP',
					'TOT USD 317.40 ',
					'S1 NVB06JUL/NVA06JUL',
					'S2 NVB10JUL/NVA10JUL',
					')><',
				]),
			},
			{
				'cmd': 'R:ROLO',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': 'ER',
				'output': php.implode(php.PHP_EOL, [
					'OK - VH78R8-SKYBIRD                  SFO',
					'><',
				]),
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'VH78R8/WS QSBYC DPBVWS  AG 23854526 06JUN',
					' 1.1BOMA/BARONDA  2.1AGBOBLY/KOKO ',
					' 1 DL5976E 06JUL ORDLGA HK2   230P  545P *         TH   E',
					'         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
					' 2 DL1496E 10JUL LGAMSP HK2  1000A 1215P *         MO   E',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'TKTG-TAU/06JUN',
					'*** LINEAR FARE DATA EXISTS *** >*LF; ',
					'ATFQ-OK/$B-*2G2H/TA2G2H/CDL/ET',
					' FQ-USD 537.66/USD 40.34US/USD 56.80XT/USD 634.80 - 6JUN XAVNA5BN.XFVUA0BX/XAVNA5BN.XFVUA0BX',
					'ACKN-DL HGH25V   06JUN 2024',
					'',
				]),
				'state': {'hasPnr': true, 'isPnrStored': true},
			},
			{
				'cmd': 'SC',
				'output': php.implode(php.PHP_EOL, [
					'B-OUT C-IN AG-NOT AUTH - APOLLO',
					'><',
				]),
				'state': {'area': 'C', 'pcc': '', 'hasPnr': false, 'isPnrStored': false},
			},
			{
				'cmd': 'SA',
				'output': php.implode(php.PHP_EOL, [
					'C-OUT A-IN AG-OK FIN OR IGN - APOLLO',
					'** THIS PNR HAS BEEN CHANGED - IGNORE BEFORE PROCEEDING ** >IR;',
					'VH5M50/WS QSBYC DPBVWS  AG 05578602 06JUN',
					' 1.1BOMA/BARONDA  2.1AGBOBLY/KOKO ',
					' 1 KL1228L 28JUN CDGAMS HK2   935A 1100A *         WE   E  1',
					' 2 KL 611T 28JUN AMSORD HK2  1225P  155P *         WE   E  1',
					' 3 DL 140T 17JUL MSPCDG HK2   424P  730A|*      MO/TU   E',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'TKTG-TAU/06JUN',
					'*** LINEAR FARE DATA EXISTS *** >*LF; ',
					'ATFQ-OK/$B-*2G55/TA2G55/CDL/ET',
					' FQ-EUR 1652.00/USD 72.00US/USD 732.52XT/USD 2668.52 - 6JUN TKXRDFR.TKXRDFR.THWSRFR/TKXRDFR.TKXRDFR.THWSRFR',
					')><',
				]),
				'state': {
					'area': 'A',
					'pcc': '2G55',
					'hasPnr': true,
					'isPnrStored': true,
					'recordLocator': 'VH5M50',
				},
			},
			{
				'cmd': 'IR',
				'output': php.implode(php.PHP_EOL, [
					'VH5M50/WS QSBYC DPBVWS  AG 05578602 06JUN',
					' 1.1BOMA/BARONDA  2.1AGBOBLY/KOKO ',
					' 1 KL1228L 28JUN CDGAMS HK2   935A 1100A *         WE   E  1',
					' 2 KL 611T 28JUN AMSORD HK2  1225P  155P *         WE   E  1',
					' 3 DL 140T 17JUL MSPCDG HK2   424P  730A|*      MO/TU   E',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'TKTG-TAU/06JUN',
					'*** LINEAR FARE DATA EXISTS *** >*LF; ',
					'ATFQ-OK/$B-*2G55/TA2G55/CDL/ET',
					' FQ-EUR 1652.00/USD 72.00US/USD 732.52XT/USD 2668.52 - 6JUN TKXRDFR.TKXRDFR.THWSRFR/TKXRDFR.TKXRDFR.THWSRFR',
					'GFAX-SSRADTK1VTOKL BY 10JUN17/0100Z OTHERWISE WILL BE XXLD',
					'RMKS-ROLO/ID8084/CREATED FOR ROLO/ID8084/REQ. ID-4096798',
					')><',
				]),
				'state': {'area': 'A', 'pcc': '2G55', 'isPnrStored': true, 'recordLocator': 'VH5M50'},
			},
			{
				'cmd': 'SB',
				'output': php.implode(php.PHP_EOL, [
					'A-OUT B-IN AG-OK FIN OR IGN - APOLLO',
					'VH78R8/WS QSBYC DPBVWS  AG 23854526 06JUN',
					' 1.1BOMA/BARONDA  2.1AGBOBLY/KOKO ',
					' 1 DL5976E 06JUL ORDLGA HK2   230P  545P *         TH   E',
					'         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
					' 2 DL1496E 10JUL LGAMSP HK2  1000A 1215P *         MO   E',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'TKTG-TAU/06JUN',
					'*** LINEAR FARE DATA EXISTS *** >*LF; ',
					'ATFQ-OK/$B-*2G2H/TA2G2H/CDL/ET',
					' FQ-USD 537.66/USD 40.34US/USD 56.80XT/USD 634.80 - 6JUN XAVNA5BN.XFVUA0BX/XAVNA5BN.XFVUA0BX',
					'ACKN-DL HGH25V   06JUN 2024',
					'><',
				]),
				'state': {'area': 'B', 'pcc': '2G2H', 'isPnrStored': true, 'recordLocator': 'VH78R8'},
			},
		],
	});

	// CMS remark was not added because `isPnrStored` was mistakenly set to
	// true due to mistyped command '**R' being parsed as "searchPnr" command
	sessionRecords.push({
		'initialState': makeDefaultApolloState(),
		'calledCommands': [
			{
				'cmd': 'SEM/2G2H/AG',
				'output': php.implode(php.PHP_EOL, [
					'PROCEED/10JUN-SKYBIRD                  SFO - APOLLO',
					'><',
				]),
			},
			{
				'cmd': 'A17JUNFAICVG|UA',
				'output': '|UA       DISPLAY* SA 17JUN FAICVG| 4:00 HR                     1| UA1192 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N02| UA3519 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9|   CVG 735A| 954A|E7W* 03| UA1192 F7 C7 A6 D6 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N04| UA4579 F6 C6 A5 D5 Z5 P5 Y9 B9 M9 E9|   CVG1045A| 104P|CR7* 05| UA1192 F7 C7 A6 D6 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N06| UA4528 F4 C4 A4 D4 Z4 P4 Y9 B9 M9 E9|   CVG 157P| 426P|CR7* 07| UA1192 F7 C7 A6 D6 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N08| UA3549 F1 C1 A1 D1 Z1 P0 Y8 B8 M0 E0|   CVG 355P| 619P|E70* 0MEALS>A*M;  CLASSES>A*C;..  ><',
			},
			{
				'cmd': 'A*C1',
				'output': '|UA       DISPLAY* SA 17JUN FAICVG| 4:00 HR                     1| UA1192 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9 FAIORD 825P  519A|738 N0          U9 H9 Q9 V9 W9 S9 T9 L8 K8 G6 N9                      2| UA3519 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9    CVG 735A| 954A|E7W* 0          U9 H9 Q9 V9 W9 S9 T9 L8 K8 G6 N9                      MEALS>A*M;  CURRENT>A*C;  ><',
			},
			{
				'cmd': '01K1*',
				'output': php.implode(php.PHP_EOL, [
					' 1 UA 1192K  17JUN FAIORD SS1   825P  519A|*      1          E',
					'ADV PAX FLT ARRIVES TERMINAL-1 *',
					'                         ARRIVES ORD TERMINAL 1 ',
					' 2 UA 3519K  18JUN ORDCVG SS1   735A  954A *      1          E',
					'ADV PAX FLT ARRIVES TERMINAL-3 *',
					'ADV PAX FLT DEPARTS TERMINAL-2 *',
					'OPERATED BY-REPUBLIC AIRLINES DBA UNITED EXPRESS *',
					'OFFER CAR/HOTEL    >CAL;     >HOA;',
					'OPERATED BY REPUBLIC AIRLINES DBA UNITED EXPRESS',
					'DEPARTS ORD TERMINAL 2  - ARRIVES CVG TERMINAL 3 ',
					'><',
				]),
			},
			{
				'cmd': 'A*O19JUL',
				'output': '|UA       DISPLAY* WE 19JUL CVGFAI- 4:00 HR                     1| UA4513 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9|CVGORD 145P  211P CR7* 02| UA1854 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N03| UA5212 F9 C9 A9 D9 Z9 P9 Y9 B9 M9 E9|CVGORD 600A  624A E7W*N04| UA1854 F4 C4 A4 D4 Z0 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N05| UA1195 F8 C8 A7 D7 Z7 P7 Y9 B9 M9 E9|CVGORD 732A  755A 319 N06| UA1854 F4 C4 A4 D4 Z0 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N07| UA3685 F9 C9 A9 D9 Z9 P9 Y9 B9 M9 E9|CVGORD1109A 1130A E7W* 08| UA1854 F4 C4 A4 D4 Z0 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N0MEALS>A*M;  CLASSES>A*C;..  ><',
			},
			{
				'cmd': 'A*C1',
				'output': '|UA       DISPLAY* WE 19JUL CVGFAI- 4:00 HR                     1| UA4513 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9 CVGORD 145P  211P CR7* 0          U9 H9 Q9 V9 W9 S6 T1 L0 K0 G0 N9                      2| UA1854 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9    FAI 349P  722P 738 N0          U9 H9 Q9 V9 W9 S6 T1 L0 K0 G0 N9                      MEALS>A*M;  CURRENT>A*C;  ><',
			},
			{
				'cmd': '01T1*',
				'output': php.implode(php.PHP_EOL, [
					' 3 UA 4513T  19JUL CVGORD SS1   145P  211P *      2          E',
					'ADV PAX FLT ARRIVES TERMINAL-1 *',
					'ADV PAX FLT DEPARTS TERMINAL-3 *',
					'OPERATED BY-GOJET AIRLINES DBA UNITED EXPRESS *',
					'OPERATED BY GOJET AIRLINES DBA UNITED EXPRESS',
					'DEPARTS CVG TERMINAL 3  - ARRIVES ORD TERMINAL 1 ',
					' 4 UA 1854T  19JUL ORDFAI SS1   349P  722P *      2          E',
					'ADV PAX FLT DEPARTS TERMINAL-1 *',
					'OFFER CAR/HOTEL    >CAL;     >HOA;',
					'DEPARTS ORD TERMINAL 1 ',
					'><',
				]),
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'NO NAMES',
					' 1 UA1192K 17JUN FAIORD SS1   825P  519A|*      SA/SU   E  1',
					' 2 UA3519K 18JUN ORDCVG SS1   735A  954A *         SU   E  1',
					'         OPERATED BY REPUBLIC AIRLINES DBA UNITED EXPRE',
					' 3 UA4513T 19JUL CVGORD SS1   145P  211P *         WE   E  2',
					'         OPERATED BY GOJET AIRLINES DBA UNITED EXPRESS',
					' 4 UA1854T 19JUL ORDFAI SS1   349P  722P *         WE   E  2',
					'><',
				]),
			},
			{
				'cmd': '**R',
				'output': php.implode(php.PHP_EOL, [
					'INVLD FORMAT/DATA ',
					'><',
				]),
				// even though '**R' looks like a PNR search command, it is not
				'state': {'isPnrStored': false},
			},
			{
				'cmd': 'SC',
				'output': php.implode(php.PHP_EOL, [
					'B-OUT C-IN AG-NOT AUTH - APOLLO',
					'',
				]),
			},
			{
				'cmd': 'SEM/2G2H/AG',
				'output': php.implode(php.PHP_EOL, [
					'PROCEED/10JUN-SKYBIRD                  SFO - APOLLO',
					'><',
				]),
			},
			{
				'cmd': 'A17JUNFAICVG|UA',
				'output': '|UA       DISPLAY* SA 17JUN FAICVG| 4:00 HR                     1| UA1192 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N02| UA3519 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9|   CVG 735A| 954A|E7W* 03| UA1192 F7 C7 A6 D6 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N04| UA4579 F6 C6 A5 D5 Z5 P5 Y9 B9 M9 E9|   CVG1045A| 104P|CR7* 05| UA1192 F7 C7 A6 D6 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N06| UA4528 F4 C4 A4 D4 Z4 P4 Y9 B9 M9 E9|   CVG 157P| 426P|CR7* 07| UA1192 F7 C7 A6 D6 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N08| UA3549 F1 C1 A1 D1 Z1 P0 Y8 B8 M0 E0|   CVG 355P| 619P|E70* 0MEALS>A*M;  CLASSES>A*C;..  ><',
			},
			{
				'cmd': 'A*C1',
				'output': '|UA       DISPLAY* SA 17JUN FAICVG| 4:00 HR                     1| UA1192 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9 FAIORD 825P  519A|738 N0          U9 H9 Q9 V9 W9 S9 T9 L7 K7 G5 N9                      2| UA3519 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9    CVG 735A| 954A|E7W* 0          U9 H9 Q9 V9 W9 S9 T9 L7 K7 G5 N9                      MEALS>A*M;  CURRENT>A*C;  ><',
			},
			{
				'cmd': '01K1*',
				'output': php.implode(php.PHP_EOL, [
					' 1 UA 1192K  17JUN FAIORD SS1   825P  519A|*      1          E',
					'ADV PAX FLT ARRIVES TERMINAL-1 *',
					'                         ARRIVES ORD TERMINAL 1 ',
					' 2 UA 3519K  18JUN ORDCVG SS1   735A  954A *      1          E',
					'ADV PAX FLT ARRIVES TERMINAL-3 *',
					'ADV PAX FLT DEPARTS TERMINAL-2 *',
					'OPERATED BY-REPUBLIC AIRLINES DBA UNITED EXPRESS *',
					'OFFER CAR/HOTEL    >CAL;     >HOA;',
					'OPERATED BY REPUBLIC AIRLINES DBA UNITED EXPRESS',
					'DEPARTS ORD TERMINAL 2  - ARRIVES CVG TERMINAL 3 ',
					'><',
				]),
				state: {
					itinerary: [
						{airline: 'UA', flightNumber:  '1192'},
						{airline: 'UA', flightNumber:  '3519'},
					],
				},
			},
			{
				'cmd': 'A*O19JUL',
				'output': '|UA       DISPLAY* WE 19JUL CVGFAI- 4:00 HR                     1| UA4513 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9|CVGORD 145P  211P CR7* 02| UA1854 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N03| UA5212 F9 C9 A9 D9 Z9 P9 Y9 B9 M9 E9|CVGORD 600A  624A E7W*N04| UA1854 F4 C4 A4 D4 Z0 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N05| UA1195 F8 C8 A7 D7 Z7 P7 Y9 B9 M9 E9|CVGORD 732A  755A 319 N06| UA1854 F4 C4 A4 D4 Z0 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N07| UA3685 F9 C9 A9 D9 Z9 P9 Y9 B9 M9 E9|CVGORD1109A 1130A E7W* 08| UA1854 F4 C4 A4 D4 Z0 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N0MEALS>A*M;  CLASSES>A*C;..  ><',
			},
			{
				'cmd': 'A*C1',
				'output': '|UA       DISPLAY* WE 19JUL CVGFAI- 4:00 HR                     1| UA4513 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9 CVGORD 145P  211P CR7* 0          U9 H9 Q9 V9 W9 S5 T0 L0 K0 G0 N9                      2| UA1854 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9    FAI 349P  722P 738 N0          U9 H9 Q9 V9 W9 S5 T0 L0 K0 G0 N9                      MEALS>A*M;  CURRENT>A*C;  ><',
			},
			{
				'cmd': '01S1*',
				'output': php.implode(php.PHP_EOL, [
					' 3 UA 4513S  19JUL CVGORD SS1   145P  211P *      2          E',
					'ADV PAX FLT ARRIVES TERMINAL-1 *',
					'ADV PAX FLT DEPARTS TERMINAL-3 *',
					'OPERATED BY-GOJET AIRLINES DBA UNITED EXPRESS *',
					'OPERATED BY GOJET AIRLINES DBA UNITED EXPRESS',
					'DEPARTS CVG TERMINAL 3  - ARRIVES ORD TERMINAL 1 ',
					' 4 UA 1854S  19JUL ORDFAI SS1   349P  722P *      2          E',
					'ADV PAX FLT DEPARTS TERMINAL-1 *',
					'OFFER CAR/HOTEL    >CAL;     >HOA;',
					'DEPARTS ORD TERMINAL 1 ',
					'><',
				]),
				'state': {
					'area': 'C',
					itinerary: [
						{airline: 'UA', flightNumber:  '1192'},
						{airline: 'UA', flightNumber:  '3519'},
						{airline: 'UA', flightNumber:  '4513'},
						{airline: 'UA', flightNumber:  '1854'},
					],
				},
			},
			{
				'cmd': 'SA',
				'output': php.implode(php.PHP_EOL, [
					'B-OUT A-IN AG-OK FIN OR IGN - APOLLO',
					'NO NAMES',
					' 1 UA1192K 17JUN FAIORD SS1   825P  519A|*      SA/SU   E  1',
					' 2 UA3519K 18JUN ORDCVG SS1   735A  954A *         SU   E  1',
					'         OPERATED BY REPUBLIC AIRLINES DBA UNITED EXPRE',
					' 3 UA4513T 19JUL CVGORD SS1   145P  211P *         WE   E  2',
					'         OPERATED BY GOJET AIRLINES DBA UNITED EXPRESS',
					' 4 UA1854T 19JUL ORDFAI SS1   349P  722P *         WE   E  2',
					'><',
				]),
			},
			{
				'cmd': 'N:GUEYE/THIABA SEYE',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					' 1.1GUEYE/THIABA SEYE ',
					' 1 UA1192K 17JUN FAIORD SS1   825P  519A|*      SA/SU   E  1',
					' 2 UA3519K 18JUN ORDCVG SS1   735A  954A *         SU   E  1',
					'         OPERATED BY REPUBLIC AIRLINES DBA UNITED EXPRE',
					' 3 UA4513T 19JUL CVGORD SS1   145P  211P *         WE   E  2',
					'         OPERATED BY GOJET AIRLINES DBA UNITED EXPRESS',
					' 4 UA1854T 19JUL ORDFAI SS1   349P  722P *         WE   E  2',
					'',
				]),
				'state': {'isPnrStored': false, 'area': 'A'},
			},
			{
				'cmd': 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU/10JUN|R:ZARFI|ER',
				'output': php.implode(php.PHP_EOL, [
					'OK - T8TNC0-SKYBIRD                  SFO',
					'',
				]),
				'state': {'isPnrStored': true, 'recordLocator': 'T8TNC0'},
			},
		],
	});

	// opened PNR ignore example
	sessionRecords.push({
		'initialState': makeDefaultApolloState(),
		'calledCommands': [
			{
				'cmd': '*NJK4VN',
				'output': php.implode(php.PHP_EOL, [
					'2BQ6 - SKY BIRD TRAVEL AND TOUR YSB',
					'NJK4VN/WS QSBYC DPBVWS  AG 67505535 15JUN',
					' 1.1MUFUTA/CHERYL NTUMBA ',
					' 1 AC 445L 16JUL YOWYYZ HK1   900A 1003A *         SU   E',
					' 2 SN 552L 16JUL YYZBRU HK1   600P  720A|*      SU/MO   E  1',
					' 3 SN 357L 17JUL BRUFIH HK1  1115A  615P *         MO   E  1',
					' 4 SN 359W 06AUG FIHBRU HK1   940P  635A|*      SU/MO   E',
					' 5 UA 951T 07AUG BRUIAD HK1  1200N  220P *         MO   E  2',
					' 6 UA6308T 07AUG IADYOW HK1   515P  643P *         MO   E  2',
					'         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'TKTG-TAU/15JUN',
					'*** LINEAR FARE DATA EXISTS *** >*LF; ',
					')><',
				]),
				'state': {'hasPnr': true, 'isPnrStored': true, 'recordLocator': 'NJK4VN'},
			},
			{
				'cmd': 'I',
				'output': php.implode(php.PHP_EOL, [
					'IGND ',
					'><',
				]),
				'state': {
					'hasPnr': false,
					itinerary: [],
				},
			},
		],
	});

	// open PNR, unsuccessful rebook, show availability and ignore
	sessionRecords.push({
		'initialState': php.array_merge(makeDefaultApolloState(), {'pcc': '2BQ6'}),
		'calledCommands': [
			{
				'cmd': '*NJK4VN',
				'output': php.implode(php.PHP_EOL, [
					'NJK4VN/WS QSBYC DPBVWS  AG 67505535 15JUN',
					' 1.1MUFUTA/CHERYL NTUMBA ',
					' 1 AC 445L 16JUL YOWYYZ HK1   900A 1003A *         SU   E',
					' 2 SN 552L 16JUL YYZBRU HK1   600P  720A|*      SU/MO   E  1',
					' 3 SN 357L 17JUL BRUFIH HK1  1115A  615P *         MO   E  1',
					' 4 SN 359W 06AUG FIHBRU HK1   940P  635A|*      SU/MO   E',
					' 5 UA 951T 07AUG BRUIAD HK1  1200N  220P *         MO   E  2',
					' 6 UA6308T 07AUG IADYOW HK1   515P  643P *         MO   E  2',
					'         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'TKTG-TAU/15JUN',
					'*** LINEAR FARE DATA EXISTS *** >*LF; ',
					'ATFQ-OK/$B-*2BQ6/TA2BQ6/CSN/ET',
					')><',
				]),
			},
			{
				'cmd': 'X4-6/0L',
				'output': php.implode(php.PHP_EOL, [
					'0 AVAIL/WL CLOSED * SN359 FIHBRU *',
					'UNABLE TO CANCEL',
					'><',
				]),
			},
			{
				'cmd': 'A/L/7AUGBRUYOW|UA',
				'output': php.implode(php.PHP_EOL, [
					'FIRAV MO 07AUG BRU / YOW - 6:00 HR      ',
					'1| UA9930 J4 C4 D0 Z0 P0 Y4 B4 M4 U4 H4 BRULHR 445P  505P 319* 0          Q4 V4 W4 S4 T4 L2 K0                                  2| UA 123 J4 C4 D0 Z0 P0 Y4 B4 M4 E9 U4    IAD 730A|1050A|752  0          H4 Q4 V4 W4 S4 T4 L2 K0 G0 N0                         3| UA6014 F6 C4 A5 D0 Z0 P0 Y4 B4 M4 E9    YOW1234P| 204P|CR7* 0          U4 H4 Q4 V4 W4 S4 T4 L2 K0 G0 N0                      MEALS>A*M;  MORE>A*;  ',
					'><',
				]),
				'state': {'hasPnr': true},
			},
			{
				'cmd': 'I',
				'output': php.implode(php.PHP_EOL, [
					'IGND ',
					'><',
				]),
				'state': {'hasPnr': false},
			},
		],
	});

	// availability navigation and sell
	sessionRecords.push({
		'initialState': php.array_merge(makeDefaultApolloState(), {'pcc': '2BQ6'}),
		'calledCommands': [
			{
				'cmd': 'SEM/2BQ6/AG',
				'output': php.implode(php.PHP_EOL, [
					'PROCEED/16JUN-SKY BIRD TRAVEL AND TOUR YSB - APOLLO',
					'><',
				]),
			},
			{
				'cmd': 'A16JULYYZFIH|SN',
				'output': php.implode(php.PHP_EOL, [
					'SU 16JUL YTO / FIH | 5:00 HR      ',
					'1| SN 552 J9 C9 D9 Z9 P6 I0 R0 Y9 B9 M9|YYZBRU 600P  720A|333  02| SN 357 J9 C9 D9 Z9 P6 I0 R0 Y9 B9 M9|   FIH1115A| 615P|333  03| SN9624 J4 C4 D4 Z4 P0 Y4 B4 M4 U4 H4|YYZYUL 530P  643P 333* 04| SN9552 J4 C4 D4 Z4 P0 Y4 B4 M4 U4 H4|   BRU 745P  835A|333* 05| SN 357 J4 C4 D4 Z4 P0 I0 R0 Y4 B4 M4|   FIH1115A| 615P|333  06| SN9554 J4 C0 D0 Z0 P0 Y4 B4 M4 U4 H4|YYZYUL 500P  613P 320* 07| SN9552 J4 C0 D0 Z0 P0 Y4 B4 M4 U4 H4|   BRU 745P  835A|333* 08| SN 357 J4 C0 D0 Z0 P0 I0 R0 Y4 B4 M4|   FIH1115A| 615P|333  0MEALS>A*M;  CLASSES>A*C0;  MORE>A*;  ',
					'><',
				]),
			},
			{
				'cmd': 'A*C1',
				'output': php.implode(php.PHP_EOL, [
					'SU 16JUL YTO / FIH | 5:00 HR      ',
					'1| SN 552 J9 C9 D9 Z9 P6 I0 R0 Y9 B9 M9 YYZBRU 600P  720A|333  0          U9 H9 Q9 V9 W9 S9 T0 E0 L9 K0 G9 X0                   2| SN 357 J9 C9 D9 Z9 P6 I0 R0 Y9 B9 M9    FIH1115A| 615P|333  0          U9 H9 Q9 V9 W9 S9 T0 E0 L9 K0 G9 X0                   MEALS>A*M;  CURRENT>A*C;  MORE>A*;  ',
					'><',
				]),
				'state': {'hasPnr': false},
			},
			{
				'cmd': '01L1*',
				'output': php.implode(php.PHP_EOL, [
					' 1 SN  552L  16JUL YYZBRU SS1   600P  720A|*      1          E',
					'SECURE FLT FILL OUT SSR DOCS 72H BEF DEP *',
					'DEPARTS YYZ TERMINAL 1 ',
					' 2 SN  357L  17JUL BRUFIH SS1  1115A  615P *      1          E',
					'OFFER CAR/HOTEL    >CAL;     >HOA;',
					'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS',
					'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
					'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
					'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
					'><',
				]),
				'state': {'hasPnr': true},
			},
		],
	});

	// store PNR, then store pricing and ignore
	sessionRecords.push({
		'initialState': {
			'gds': 'apollo',
			'area': 'A',
			'pcc': '2BQ6',
			'recordLocator': '',
			'hasPnr': true,
			'isPnrStored': false,
		},
		'calledCommands': [
			{
				'cmd': 'N:MUFUTA/CHERYL NTUMBA',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': '@:5OBASH/ID20610/CREATED FOR OBASH/ID20610/REQ. ID-4833216|P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU/16JUN|R:OBASH|ER',
				'output': php.implode(php.PHP_EOL, [
					'OK - SFGDRG-SKY BIRD TRAVEL AND TOUR YSB',
					'',
				]),
				'state': {'hasPnr': true, 'isPnrStored': true, 'recordLocator': 'SFGDRG'},
			},
			{
				'cmd': 'IR',
				'output': php.implode(php.PHP_EOL, [
					'SFGDRG/WS QSBYC DPBVWS  AG 67505535 16JUN',
					' 1.1MUFUTA/CHERYL NTUMBA ',
					' 1 AC 447L 16JUL YOWYYZ HK1  1000A 1103A *         SU   E',
					' 2 SN 552L 16JUL YYZBRU HK1   600P  720A|*      SU/MO   E  1',
					' 3 SN 357L 17JUL BRUFIH HK1  1115A  615P *         MO   E  1',
					' 4 SN 359S 08AUG FIHBRU HK1   940P  635A|*      TU/WE   E',
					' 5 UA 951L 09AUG BRUIAD HK1  1200N  220P *         WE   E  2',
					' 6 UA6308L 09AUG IADYOW HK1   515P  643P *         WE   E  2',
					'         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'TKTG-TAU/16JUN',
					'GFAX-SSROTHS1V PLS ADV TKT NBR FOR ITIN BY 19JUN17/1412Z OR SN OPTG',
					')><',
				]),
			},
			{
				'cmd': 'T:$B',
				'output': php.implode(php.PHP_EOL, [
					'>$B-*2BQ6',
					'*FARE HAS A PLATING CARRIER RESTRICTION*',
					'E-TKT REQUIRED',
					'** PRIVATE FARES SELECTED **  ',
					'*PENALTY APPLIES*',
					'LAST DATE TO PURCHASE TICKET: 19JUN17',
					'$B-1 A16JUN17     ',
					'YOW AC X/YTO SN X/BRU SN FIH 166.48LHXRCT27/AF12 SN X/BRU UA',
					'X/WAS UA YOW 183.50LLXRCT73/AF12 NUC349.98END ROE1.34521',
					'FARE CAD 471.00 TAX 25.91CA TAX 27.00SQ TAX 53.80BE TAX 57.90CD',
					'TAX 4.00LW TAX 7.40AY TAX 5.20XA TAX 5.90XF TAX 9.30XY TAX',
					'7.30YC TAX 3.51RC TAX 482.00YQ TAX 23.00YR TOT CAD 1183.22  ',
					'S1 NVB16JUL/NVA16JUL',
					')><',
				]),
			},
			{
				'cmd': 'R:OBASH',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': 'ER',
				'output': php.implode(php.PHP_EOL, [
					'OK - SFGDRG-SKY BIRD TRAVEL AND TOUR YSB',
					'><',
				]),
			},
			{
				'cmd': 'I',
				'output': php.implode(php.PHP_EOL, [
					'IGND ',
					'><',
				]),
				'state': {'hasPnr': false},
			},
		],
	});

	// did not add remark because "**-BECK" was called in the middle
	// of PNR creation causing us to set "isPnrStored" flag to true
	// since the fix looks at output of "**-" command before setting the flag
	sessionRecords.push({
		'initialState': {
			'gds': 'apollo',
			'area': 'A',
			'pcc': '2BQ6',
			'recordLocator': '',
			'hasPnr': true,
			'isPnrStored': false,
		},
		'calledCommands': [
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'NO NAMES',
					' 1 AC 447L 16JUL YOWYYZ SS1  1000A 1103A *         SU   E',
					' 2 SN 552L 16JUL YYZBRU SS1   600P  720A|*      SU/MO   E  1',
					' 3 SN 357L 17JUL BRUFIH SS1  1115A  615P *         MO   E  1',
					' 4 SN 359S 08AUG FIHBRU SS1   940P  635A|*      TU/WE   E',
					' 5 UA 951L 09AUG BRUIAD SS1  1200N  220P *         WE   E  2',
					' 6 UA6308L 09AUG IADYOW SS1   515P  643P *         WE   E  2',
					'         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
					'><',
				]),
				'state': {
					'hasPnr': true, 'isPnrStored': false,
					itinerary: [
						{airline: 'AC', flightNumber:  '447'},
						{airline: 'SN', flightNumber:  '552'},
						{airline: 'SN', flightNumber:  '357'},
						{airline: 'SN', flightNumber:  '359'},
						{airline: 'UA', flightNumber:  '951'},
						{airline: 'UA', flightNumber: '6308'},
					],
				},
			},
			{
				'cmd': '**-BECK',
				'output': php.implode(php.PHP_EOL, [
					'FIN OR IGN ',
					'><',
				]),
				// should not set 'isPnrStored' flag since we see from
				// output that context was not changed to existing PNR
				'state': {'hasPnr': true, 'isPnrStored': false},
			},
			{
				'cmd': 'SA',
				'output': php.implode(php.PHP_EOL, [
					'CURRENTLY USING AAA REQUESTED',
					'NO NAMES',
					' 1 AC 447L 16JUL YOWYYZ SS1  1000A 1103A *         SU   E',
					' 2 SN 552L 16JUL YYZBRU SS1   600P  720A|*      SU/MO   E  1',
					' 3 SN 357L 17JUL BRUFIH SS1  1115A  615P *         MO   E  1',
					' 4 SN 359S 08AUG FIHBRU SS1   940P  635A|*      TU/WE   E',
					' 5 UA 951L 09AUG BRUIAD SS1  1200N  220P *         WE   E  2',
					' 6 UA6308L 09AUG IADYOW SS1   515P  643P *         WE   E  2',
					'         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
					'><',
				]),
				'state': {
					itinerary: [
						{airline: 'AC', flightNumber:  '447'},
						{airline: 'SN', flightNumber:  '552'},
						{airline: 'SN', flightNumber:  '357'},
						{airline: 'SN', flightNumber:  '359'},
						{airline: 'UA', flightNumber:  '951'},
						{airline: 'UA', flightNumber: '6308'},
					],
				},
			},
			{
				'cmd': 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': 'SEM/2BQ6/AG',
				'output': php.implode(php.PHP_EOL, [
					'ERR: FIN OR IGN - APOLLO',
					'><',
				]),
				'state': {'hasPnr': true},
			},
			{
				'cmd': 'SB',
				'output': php.implode(php.PHP_EOL, [
					'A-OUT B-IN AG-NOT AUTH - APOLLO',
					'><',
				]),
				'state': {
					'hasPnr': false,
					itinerary: [],
				},
			},
			{
				'cmd': 'SEM/2BQ6/AG',
				'output': php.implode(php.PHP_EOL, [
					'PROCEED/16JUN-SKY BIRD TRAVEL AND TOUR YSB - APOLLO',
					'><',
				]),
			},
			{
				'cmd': '*SFGDRG',
				'output': php.implode(php.PHP_EOL, [
					'SFGDRG/WS QSBYC DPBVWS  AG 67505535 16JUN',
					' 1.1MUFUTA/CHERYL NTUMBA ',
					' 1 AC 447L 16JUL YOWYYZ HK1  1000A 1103A *         SU   E',
					' 2 SN 552L 16JUL YYZBRU HK1   600P  720A|*      SU/MO   E  1',
					' 3 SN 357L 17JUL BRUFIH HK1  1115A  615P *         MO   E  1',
					' 4 SN 359S 08AUG FIHBRU HK1   940P  635A|*      TU/WE   E',
					' 5 UA 951L 09AUG BRUIAD HK1  1200N  220P *         WE   E  2',
					' 6 UA6308L 09AUG IADYOW HK1   515P  643P *         WE   E  2',
					'         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'TKTG-TAU/16JUN',
					'*** LINEAR FARE DATA EXISTS *** >*LF; ',
					'ATFQ-OK/$B-*2BQ6/TA2BQ6/CSN/ET',
					')><',
				]),
				'state': {'isPnrStored': true, 'area': 'B', 'recordLocator': 'SFGDRG'},
			},
			{
				'cmd': 'I',
				'output': php.implode(php.PHP_EOL, [
					'IGND ',
					'><',
				]),
				'state': {'hasPnr': false, 'isPnrStored': false},
			},
			{
				'cmd': '**-BECK',
				'output': php.implode(php.PHP_EOL, [
					'QM6HKQ/DC QSBSB DYBDC   AG 67505535 22MAY',
					' 1.1BECK/DAVID ',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'   2 SFOAS/DEXTER*1800 677-2943 EXT:25301',
					'GFAX-SSRADTK1VKK1.TKT UA SEGS BY 15JUN17 TO AVOID AUTO CXL /EARLIER',
					'   2 SSRADTK1VKK1.TICKETING MAY BE REQUIRED BY FARE RULE',
					'ACKN-UA C62MK9   22MAY 1731                       ',
					'><',
				]),
				'state': {'hasPnr': true, 'isPnrStored': true, 'area': 'B'},
			},
			{
				'cmd': '**-TENTE',
				'output': php.implode(php.PHP_EOL, [
					'2BQ6-TENTE                                    003 NAMES ON LIST 001   01 TENTE/ALPHONSINE BECK      X 07JUL',
					'002   01 TENTE/ALPHONSINE BECK        16JUL',
					'003   01 TENTE/ALPHONSINE BECK      X 16JUL',
					'><',
				]),
				'state': {'isPnrStored': false, 'area': 'B'},
			},
			{
				'cmd': 'I',
				'output': php.implode(php.PHP_EOL, [
					'IGND ',
					'><',
				]),
			},
			{
				'cmd': 'SA',
				'output': php.implode(php.PHP_EOL, [
					'B-OUT A-IN AG-OK FIN OR IGN - APOLLO',
					'NO NAMES',
					' 1 AC 447L 16JUL YOWYYZ SS1  1000A 1103A *         SU   E',
					' 2 SN 552L 16JUL YYZBRU SS1   600P  720A|*      SU/MO   E  1',
					' 3 SN 357L 17JUL BRUFIH SS1  1115A  615P *         MO   E  1',
					' 4 SN 359S 08AUG FIHBRU SS1   940P  635A|*      TU/WE   E',
					' 5 UA 951L 09AUG BRUIAD SS1  1200N  220P *         WE   E  2',
					' 6 UA6308L 09AUG IADYOW SS1   515P  643P *         WE   E  2',
					'         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'><',
				]),
				'state': {'isPnrStored': false, 'area': 'A'},
			},
			{
				'cmd': 'N:TENTE/ALPHONSINE BECK',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU/16JUN|R:OBASH|ER',
				'output': php.implode(php.PHP_EOL, [
					'OK - SH8JJE-SKY BIRD TRAVEL AND TOUR YSB',
					'',
				]),
				'state': {'isPnrStored': true, 'recordLocator': 'SH8JJE'},
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'SH8JJE/WS QSBYC DPBVWS  AG 67505535 16JUN',
					' 1.1TENTE/ALPHONSINE BECK ',
					' 1 AC 447L 16JUL YOWYYZ HK1  1000A 1103A *         SU   E',
					' 2 SN 552L 16JUL YYZBRU HK1   600P  720A|*      SU/MO   E  1',
					' 3 SN 357L 17JUL BRUFIH HK1  1115A  615P *         MO   E  1',
					' 4 SN 359S 08AUG FIHBRU HK1   940P  635A|*      TU/WE   E',
					' 5 UA 951L 09AUG BRUIAD HK1  1200N  220P *         WE   E  2',
					' 6 UA6308L 09AUG IADYOW HK1   515P  643P *         WE   E  2',
					'         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'   2 SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'TKTG-TAU/16JUN',
					'ACKN-AC AMC62V   16JUN 1420',
					'   2 UA NL45YC   16JUN 1420                       ',
					'',
				]),
			},
		],
	});

	// Apollo example of PNR search command that is currently handled incorrectly
	sessionRecords.push({
		'initialState': makeDefaultApolloState(),
		'calledCommands': [
			{
				'cmd': '**-BECK',
				'output': php.implode(php.PHP_EOL, [
					'2G55-BECK                                     003 NAMES ON LIST 001   01 BECK/KELLIE ANN              26DEC',
					'002   01 BECK/YISOCHER              X 02AUG',
					'003   01 BECK/YISOCHERN             X 23AUG',
					'><',
				]),
				// not opened PNR yet
				'state': {'isPnrStored': false},
			},
			{
				'cmd': 'N:LIBERMANE/MARINA',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': 'A10DECKIVRIX',
				'output': php.implode(php.PHP_EOL, [
					'NEUTRAL DISPLAY*   SU 10DEC KIVRIX+ 0:00 HR                     ',
					'1+ SU1845 J6 C5 D4 I3 Z2 O2 Y7 B7 M7 U7+KIVSVO 140A  535A 32A  0',
					'2+ SU2682 J7 C7 D7 I7 Z7 O2 Y7 B7 M7 U7+   RIX 925A 1005A SU9  0',
					'3+ PS 898 C1 D1 Z1 S9 Y9 P9 W9 E9 K9 L9+KIVKBP 710A  820A E90  0',
					'4+ PS 185 C1 D1 Z1 S9 Y9 P9 W9 E9 K9 L9+   RIX 920A 1100A E90  0',
					'5+ TK 270 C9 D9 Z9 K9 J9 I9 R9 Y9 B9 M9+KIVIST 945A 1225P 320  0',
					'6+ TK1775 C9 D9 Z9 K9 J9 I9 R9 Y9 B9 M9+   RIX 330P  540P 73J  0',
					'7+ SU1847 J6 C5 D4 I3 Z2 O2 Y7 B7 M7 U7+KIVSVO1145A  340P 32A  0',
					'8+ SU2102 J7 C7 D7 I7 Z7 O2 Y7 B7 M7 U7+   RIX 635P  715P 320  0',
					'MEALS>A*M\u00B7  CLASSES>A*C\u00B7..  ><',
				]),
			},
			{
				'cmd': '01Y1Y2',
				'output': php.implode(php.PHP_EOL, [
					' 1 SU 1845Y  10DEC KIVSVO SS1   140A  535A *      1          E',
					'                         ARRIVES SVO TERMINAL D ',
					' 2 SU 2682Y  10DEC SVORIX SS1   925A 1005A *      1          E',
					'OFFER CAR/HOTEL    >CAL\u00B7     >HOA\u00B7',
					'DEPARTS SVO TERMINAL D ',
					'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS',
					'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
					'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
					'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
					'><',
				]),
			},
			{
				'cmd': '**-BECK',
				'output': php.implode(php.PHP_EOL, [
					'FIN OR IGN ',
					'><',
				]),
				'state': {'isPnrStored': false},
			},
			{
				'cmd': 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU/19JUN|R:ALEX|ER',
				'output': 'OK - J3GCPI-INTERNATIONAL TVL NETWOR SFO',
				'state': {'isPnrStored': true, 'recordLocator': 'J3GCPI'},
			},
		],
	});

	// when >I; prompts for another >I;, PNR context should not be dropped
	sessionRecords.push({
		'initialState': makeDefaultApolloState(),
		'calledCommands': [
			{
				'cmd': 'A10DECKIVRIX',
				'output': php.implode(php.PHP_EOL, [
					'NEUTRAL DISPLAY*   SU 10DEC KIVRIX+ 0:00 HR                     ',
					'1+ SU1845 J6 C5 D4 I3 Z2 O2 Y7 B7 M7 U7+KIVSVO 140A  535A 32A  0',
					'2+ SU2682 J7 C7 D7 I7 Z7 O2 Y7 B7 M7 U7+   RIX 925A 1005A SU9  0',
					'3+ PS 898 C1 D1 Z1 S9 Y9 P9 W9 E9 K9 L9+KIVKBP 710A  820A E90  0',
					'4+ PS 185 C1 D1 Z1 S9 Y9 P9 W9 E9 K9 L9+   RIX 920A 1100A E90  0',
					'5+ TK 270 C9 D9 Z9 K9 J9 I9 R9 Y9 B9 M9+KIVIST 945A 1225P 320  0',
					'6+ TK1775 C9 D9 Z9 K9 J9 I9 R9 Y9 B9 M9+   RIX 330P  540P 73J  0',
					'7+ SU1847 J6 C5 D4 I3 Z2 O2 Y7 B7 M7 U7+KIVSVO1145A  340P 32A  0',
					'8+ SU2102 J7 C7 D7 I7 Z7 O2 Y7 B7 M7 U7+   RIX 635P  715P 320  0',
					'MEALS>A*M\u00B7  CLASSES>A*C\u00B7..  ><',
				]),
				'state': {'hasPnr': false},
			},
			{
				'cmd': '01Y1Y2',
				'output': php.implode(php.PHP_EOL, [
					' 1 SU 1845Y  10DEC KIVSVO SS1   140A  535A *      1          E',
					'                         ARRIVES SVO TERMINAL D ',
					' 2 SU 2682Y  10DEC SVORIX SS1   925A 1005A *      1          E',
					'OFFER CAR/HOTEL    >CAL\u00B7     >HOA\u00B7',
					'DEPARTS SVO TERMINAL D ',
					'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS',
					'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
					'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
					'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
					'><',
				]),
				'state': {
					'hasPnr': true,
					itinerary: [
						{airline: 'SU', flightNumber: '1845', bookingClass: 'Y', departureDate: {raw: '10DEC'}, departureAirport: 'KIV', destinationAirport: 'SVO', segmentStatus: 'SS', seatCount: 1},
						{airline: 'SU', flightNumber: '2682', bookingClass: 'Y', departureDate: {raw: '10DEC'}, departureAirport: 'SVO', destinationAirport: 'RIX', segmentStatus: 'SS', seatCount: 1},
					],
				},
			},
			{
				'cmd': 'N:LIBERMANE/MARINA',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': 'T:TAU/15AUG',
				'output': php.implode(php.PHP_EOL, [
					'*',
					'><',
				]),
			},
			{
				'cmd': '@:5ALEX/ID1/CREATED FOR ALEX/ID1/REQ. ID-1|P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU/19JUN|R:ALEX|ER',
				'output': 'SNGL ITEM FLD/NOT ENT/T:TAU/19JUN|R:ALEX|ER',
				'state': {'hasPnr': true},
			},
			{
				'cmd': 'I',
				'output': php.implode(php.PHP_EOL, [
					'THIS IS A NEW PNR-ALL DATA WILL BE IGNORED WITH NEXT I OR IR',
					'><',
				]),
				'state': {'hasPnr': true},
			},
			{
				'cmd': '@:5ALEX/ID1/CREATED FOR ALEX/ID1/REQ. ID-1|P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU/19JUN|R:ALEX|ER',
				'output': 'SNGL ITEM FLD/NOT ENT/T:TAU/19JUN|R:ALEX|ER',
				'state': {'hasPnr': true, 'isPnrStored': false},
			},
			{
				'cmd': 'I',
				'output': 'IGND',
				'state': {'hasPnr': false},
			},
		],
	});

	// Apollo - ignore incomplete PNR with IR
	sessionRecords.push({
		'initialState': makeDefaultApolloState(),
		'calledCommands': [
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'INVLD ',
					'><',
				]),
			},
			{
				'cmd': 'N:LIBERMANE/MARINA',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
				'state': {'hasPnr': true},
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					' 1.1LIBERMANE/MARINA ',
					'><',
				]),
			},
			{
				'cmd': 'IR',
				'output': php.implode(php.PHP_EOL, [
					'THIS IS A NEW PNR-ALL DATA WILL BE IGNORED WITH NEXT I OR IR',
					'><',
				]),
				'state': {'hasPnr': true},
			},
			{
				'cmd': 'IR',
				'output': php.implode(php.PHP_EOL, [
					'NO TRANS AAA',
					'><',
				]),
				'state': {'hasPnr': false},
			},
		],
	});

	sessionRecords.push({
		'initialState': makeDefaultApolloState(),
		'calledCommands': [
			{
				'cmd': '*SG599S',
				'output': php.implode(php.PHP_EOL, [
					'CREATED IN GDS DIRECT BY KRUZ',
					'SG599S/WS QSBYC DPBVWS  AG 05578602 17JUL',
					' 1.1EZRA/PETER MARWA ',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'GFAX-SSROTHS1V UPDATE SECURE FLT PASSENGER DATA 72HBD FOR US FLIGHTS',
					'   2 SSROTHS1V ADTK BY 19JUL17 0810 SFO LT OR EY SPACE WILL BE CXLD',
					'   3 SSROTHS1V APPLICABLE FARE RULE APPLIES IF IT DEMANDS EARLIER TKTG',
					'   4 SSROTHS1V /// EY',
					'   5 SSROTHS1V REMINDER TICKET DUE IN 48HRS',
					'RMKS-KRUZ/ID20782/CREATED FOR KRUZ/ID20782/REQ. ID-5085852',
					')><',
				]),
				'state': {'hasPnr': true, 'isPnrStored': true},
			},
			{
				'cmd': '*N70D5N',
				'output': php.implode(php.PHP_EOL, [
					'UTR PNR / INVALID RECORD LOCATOR',
					'><',
				]),
				'state': {'hasPnr': false, 'isPnrStored': false},
			},
		],
	});

	sessionRecords.push({
		'initialState': makeDefaultApolloState(),
		'calledCommands': [
			{
				'cmd': '*SG599S',
				'output': php.implode(php.PHP_EOL, [
					'CREATED IN GDS DIRECT BY KRUZ',
					'SG599S/WS QSBYC DPBVWS  AG 05578602 17JUL',
					' 1.1EZRA/PETER MARWA ',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'GFAX-SSROTHS1V UPDATE SECURE FLT PASSENGER DATA 72HBD FOR US FLIGHTS',
					'   2 SSROTHS1V ADTK BY 19JUL17 0810 SFO LT OR EY SPACE WILL BE CXLD',
					'   3 SSROTHS1V APPLICABLE FARE RULE APPLIES IF IT DEMANDS EARLIER TKTG',
					'   4 SSROTHS1V /// EY',
					'   5 SSROTHS1V REMINDER TICKET DUE IN 48HRS',
					'RMKS-KRUZ/ID20782/CREATED FOR KRUZ/ID20782/REQ. ID-5085852',
					')><',
				]),
				'state': {'hasPnr': true, 'isPnrStored': true},
			},
			{
				'cmd': '*XLGBCY',
				'output': php.implode(php.PHP_EOL, [
					'RESTRICTED PNR-CALL HELP DESK ',
					'><',
				]),
				'state': {'hasPnr': false, 'isPnrStored': false},
			},
		],
	});

	// if there are changes, PNR context won't be dropped
	sessionRecords.push({
		'initialState': makeDefaultApolloState(),
		'calledCommands': [
			{
				'cmd': '*ZVGGHO',
				'output': php.implode(php.PHP_EOL, [
					'** THIS PNR IS CURRENTLY IN USE **',
					'CREATED IN GDS DIRECT BY ALEX',
					'ZVGGHO/WS QSBYC DPBVWS  AG 05578602 16JUN',
					' 1.1LIBERMANE/MARINA ',
					' 1 BT 651Y 15SEP RIXLGW HK1   740A  840A *         FR',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'TKTG-TAU/16JUN',
					'RMKS-ALEX/ID1/CREATED FOR ALEX/ID1/REQ. ID-1',
					'ACKN-1A UBGSRZ   16JUN 1457',
					'   2 1A UBGSRZ   16JUN 1457',
					'><',
				]),
				'state': {'hasPnr': true, 'isPnrStored': true},
			},
			{
				'cmd': 'N:LIBERMANE/ZIMICH',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
			},
			{
				'cmd': '*QWERTY',
				'output': php.implode(php.PHP_EOL, [
					'FIN OR IGN ',
					'><',
				]),
				'state': {'hasPnr': true, 'isPnrStored': true, 'recordLocator': 'ZVGGHO'},
			},
		],
	});

	sessionRecords.push({
		'initialState': makeDefaultApolloState(),
		'calledCommands': [
			{
				'cmd': 'N:LIBERMANE/MARINA',
				'output': php.implode(php.PHP_EOL, [
					' *',
					'><',
				]),
				'state': {'hasPnr': true, 'isPnrStored': false},
			},
			{
				'cmd': '*N70D5N',
				'output': php.implode(php.PHP_EOL, [
					'FIN OR IGN ',
					'><',
				]),
				'state': {'hasPnr': true, 'isPnrStored': false},
			},
		],
	});

	// RESALL example
	sessionRecords.push({
		'initialState': {
			'gds': 'apollo',
			'area': 'C',
			'pcc': '1O3K',
			'recordLocator': 'LNVPLM',
			'hasPnr': true,
			'isPnrStored': true,
		},
		'calledCommands': [
			{
				'cmd': 'RESALL',
				'output': php.implode(php.PHP_EOL, [
					'NO NAMES',
					' 1 UA 758G 28AUG RDUIAD SS1   625A  731A *         MO   E',
					' 2 ET 501H 28AUG IADADD SS1  1100A  715A|*      MO/TU   E  1',
					' 3 ET 931H 29AUG ADDENU SS1   850A 1150A *         TU   E  1',
					' 4 ET 930H 05SEP ENUADD SS1  1250P  825P *         TU   E  2',
					' 5 ET 500H 05SEP ADDIAD SS1  1045P  840A|*      TU/WE   E  2',
					' 6 UA1415G 06SEP IADRDU SS1  1240P  144P *         WE   E',
					'><',
				]),
				'state': {
					'gds': 'apollo',
					'area': 'C',
					'pcc': '1O3K',
					'hasPnr': true,
					'isPnrStored': false,
				},
			},
		],
	});

	// more RESALL examples
	sessionRecords.push({
		'initialState': makeDefaultApolloState(),
		'calledCommands': [
			{
				'cmd': '*VLW9TK',
				'output': php.implode(php.PHP_EOL, [
					'1O3K - INTERNATIONAL TVL NETWOR SFO',
					'VLW9TK/WS QSBYC DPBVWS  AG 05578602 11AUG',
					' 1.1LIBERMANE/MARINA ',
					'FONE-RIXR/22226401',
					'   2 SFOAS/800 750-2238 ITN CUSTOMER SUPPORT-PAVEL',
					'GFAX-SSRADTK1VBYSFO18AUG17/0351 OR CXL MU590 T25MAR',
					'   2 SSRADPI1VKK1 MU0590 REQ SEC FLT PSGR DATA 72 HBD FOR ALL PSGRS',
					'ACKN-CA MLKC3H   11AUG 1051',
					'><',
				]),
				'state': {'recordLocator': 'VLW9TK', 'isPnrStored': true, 'hasPnr': true},
			},
			{
				'cmd': 'REALL',
				'output': php.implode(php.PHP_EOL, ['MODIFY ', '><']),
				'state': {'recordLocator': 'VLW9TK', 'isPnrStored': true, 'hasPnr': true},
			},
			{
				'cmd': 'R:KLESUN',
				'output': php.implode(php.PHP_EOL, [' *', '><']),
				'state': {'recordLocator': 'VLW9TK', 'isPnrStored': true, 'hasPnr': true},
			},
			{
				'cmd': 'REALL',
				'output': php.implode(php.PHP_EOL, [
					' 1.1LIBERMANE/MARINA ',
					'FONE-RIXR/22226401',
					'   2 SFOAS/800 750-2238 ITN CUSTOMER SUPPORT-PAVEL',
					'><',
				]),
				'state': {'isPnrStored': false, 'hasPnr': true},
			},
			{
				'cmd': 'I',
				'output': php.implode(php.PHP_EOL, ['THIS IS A NEW PNR-ALL DATA WILL BE IGNORED WITH NEXT I OR IR', '><']),
				'state': {'isPnrStored': false, 'hasPnr': true},
			},
			{
				'cmd': 'I',
				'output': php.implode(php.PHP_EOL, ['IGND ', '><']),
				'state': {'isPnrStored': false, 'hasPnr': false},
			},
			{
				'cmd': '*VLW9TK',
				'output': php.implode(php.PHP_EOL, [
					'1O3K - INTERNATIONAL TVL NETWOR SFO',
					'VLW9TK/WS QSBYC DPBVWS  AG 05578602 11AUG',
					' 1.1LIBERMANE/MARINA ',
					'FONE-RIXR/22226401',
					'   2 SFOAS/800 750-2238 ITN CUSTOMER SUPPORT-PAVEL',
					'GFAX-SSRADTK1VBYSFO18AUG17/0351 OR CXL MU590 T25MAR',
					'   2 SSRADPI1VKK1 MU0590 REQ SEC FLT PSGR DATA 72 HBD FOR ALL PSGRS',
					'ACKN-CA MLKC3H   11AUG 1051',
					'><',
				]),
				'state': {'recordLocator': 'VLW9TK', 'isPnrStored': true},
			},
			{
				'cmd': 'R:KLESUN',
				'output': php.implode(php.PHP_EOL, [' *', '><']),
			},
			{
				'cmd': 'RESALL',
				'output': php.implode(php.PHP_EOL, [' RE SUCCESSFUL THRU SEGMENT  0', '><']),
				'state': {'isPnrStored': false},
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, ['INVLD ', '><']),
			},
		],
	});

	// typo in RESALL
	sessionRecords.push({
		'initialState': makeDefaultApolloState(),
		'calledCommands': [
			{
				'cmd': '*VLW9TK',
				'output': php.implode(php.PHP_EOL, [
					'1O3K - INTERNATIONAL TVL NETWOR SFO',
					'VLW9TK/WS QSBYC DPBVWS  AG 05578602 11AUG',
					' 1.1LIBERMANE/MARINA ',
					'FONE-RIXR/22226401',
					'   2 SFOAS/800 750-2238 ITN CUSTOMER SUPPORT-PAVEL',
					'GFAX-SSRADTK1VBYSFO18AUG17/0351 OR CXL MU590 T25MAR',
					'   2 SSRADPI1VKK1 MU0590 REQ SEC FLT PSGR DATA 72 HBD FOR ALL PSGRS',
					'ACKN-CA MLKC3H   11AUG 1051',
					'><',
				]),
				'state': {'recordLocator': 'VLW9TK', 'isPnrStored': true},
			},
			{
				'cmd': 'RESALLL',
				'output': php.implode(php.PHP_EOL, [
					'INVLD FRMT/NOT ENT/REGIBBERISH',
					'><',
				]),
				'state': {'recordLocator': 'VLW9TK', 'isPnrStored': true},
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'1O3K - INTERNATIONAL TVL NETWOR SFO',
					'VLW9TK/WS QSBYC DPBVWS  AG 05578602 11AUG',
					' 1.1LIBERMANE/MARINA ',
					'FONE-RIXR/22226401',
					'   2 SFOAS/800 750-2238 ITN CUSTOMER SUPPORT-PAVEL',
					'GFAX-SSRADTK1VBYSFO18AUG17/0351 OR CXL MU590 T25MAR',
					'   2 SSRADPI1VKK1 MU0590 REQ SEC FLT PSGR DATA 72 HBD FOR ALL PSGRS',
					'ACKN-CA MLKC3H   11AUG 1051',
					'><',
				]),
			},
		],
	});

	// Apollo '*R*@*R*' -- invalid command that breaks PNR state
	sessionRecords.push({
		'initialState': makeDefaultApolloState(),
		'calledCommands': [
			{
				'cmd': '*XCGVZG',
				'output': php.implode(php.PHP_EOL, [
					'2G2H - SKYBIRD                  SFO',
					'XCGVZG/WS QSBYC DPBVWS  AG 23854526 15SEP',
					' 1.1ISMAILA/KOULAYOM ',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'GFAX-SSRADTK1VTOAF BY 16SEP 1600 OTHERWISE WILL BE XLD',
					'   2 SSRADTKYYPLS TICKET OR CANCEL BY 16SEP17 1538USCA',
					'ACKN-WS HYKAJS   15SEP 2238',
					'   2 1A Q5EDVH   15SEP 2238',
					'   3 1A Q5EDVH   15SEP 2238',
					'   4 WS HYKAJS   15SEP 2345',
				]),
				'state': {'isPnrStored': true, 'recordLocator': 'XCGVZG'},
			},
			{
				'cmd': '*R*@*R*',
				'output': 'INVLD ADRS ',
				'state': {'isPnrStored': false, 'hasPnr': false},
			},
		],
	});

	// Apollo PNR search drops current PNR when list is displayed
	sessionRecords.push({
		'initialState': makeDefaultApolloState(),
		'calledCommands': [
			{
				'cmd': '*XGL0K6',
				'output': php.implode(php.PHP_EOL, [
					'RICO',
					'2CV4 - TRAVEL SHOP              SFO',
					'XGL0K6/PH QSBSB DYBMAR  AG 23854526 12JAN',
					' 1.1ABELEDA/VIOLETA L ',
					' 5 OTH ZO BK1  XXX 12NOV-PRESERVEPNR',
					' 6 OTH ZO BK1  XXX 12NOV-PRESERVEPNR',
					' 7 OTH ZO BK1  XXX 06JAN-PRESERVEPNR',
					'*** SEAT DATA EXISTS *** >9D; ',
					'FONE-SFOAS/MARIBEL*1800 677-2943 EXT:22736',
					'FOP:-VIXXXXXXXXXXXX9943/D0520',
					'TKTG-T/QSB 12JAN1821Z IX AG **ELECTRONIC DATA EXISTS** >*HTE;',
					'*** TIN REMARKS EXIST *** >*T; ',
					'*** LINEAR FARE DATA EXISTS *** >*LF; ',
					')><',
				]),
				'state': {'recordLocator': 'XGL0K6', 'hasPnr': true, 'isPnrStored': true},
			},
			{
				'cmd': '**B-ABELEDA/SOLEDAD',
				'output': php.implode(php.PHP_EOL, [
					'2G55-ABELEDA/SOLEDAD                          008 NAMES ON LIST ',
					'001   01 ABELEDA/VIOLETA L            10MAR',
					'002   01 ABELEDA/ESTELITO CURRIMA     16APR',
					'003   01 ABELEDA/MARIATHERESA       X 18DEC',
					'004   01 ABELEDA/MARIATHERESA       X 19DEC',
					'005   01 ABELEDA/MARIATHERESA         19DEC',
					'006   01 ABELEDA/PURIFICACION         19DEC',
					'007   01 ABELEDA/MARIA LOURDES        21JAN',
					'008   01 ABELEDA/VIOLETA              25JAN',
					'><',
				]),
				'state': {'hasPnr': false, 'isPnrStored': false},
			},
		],
	});

	// Apollo PNR search drops current PNR when search found no PNR-s
	sessionRecords.push({
		'initialState': php.array_merge(makeDefaultApolloState(), {'pcc': '115Q'}),
		'calledCommands': [
			{
				'cmd': '*MZ5PGP',
				'output': php.implode(php.PHP_EOL, [
					'RUBEN',
					'MZ5PGP/RT QSBSB DYBRT   AG 05578602 08AUG',
					' 1.1ENRIQUEZ/GLORIA  2.1ENRIQUEZ/ANTONIO ',
					' 6 OTH ZO BK1  XXX 27SEP-PRESERVEPNR',
					'*** PROFILE ASSOCIATIONS EXIST *** >*PA; ',
					'FONE-SFOAS/REX*EXT:24076',
					'   2 DTWAS/888-759-2473-SKYBIRD TRAVEL-RUBEN',
					'   3 AGCY 415-840-0207-B',
					'   4 AGCY 415-840-0801-FAX',
					'ADRS-INTERNATIONAL TRAVEL NETWORK@100 PINE STREET@SUITE 1925@SAN FRANCISCO CA Z/94111',
					'FOP:-CAXXXXXXXXXXXX4370/D0820',
					'TKTG-T/QSB 10AUG0324Z B2 AG **ELECTRONIC DATA EXISTS** >*HTE;',
					')><',
				]),
				'state': {'hasPnr': true, 'recordLocator': 'MZ5PGP'},
			},
			{
				'cmd': '**-YHNUJMIK/QAZWSX',
				'output': php.implode(php.PHP_EOL, ['NO NAMES ', '><']),
				'state': {'hasPnr': false},
			},
			{'cmd': '*R', 'output': php.implode(php.PHP_EOL, ['INVLD ', '><'])},
		],
	});

	// Apollo segments sold from Low Fare Search
	sessionRecords.push({
		'initialState': php.array_merge(makeDefaultApolloState()),
		'calledCommands': [
			{
				'cmd': 'FSRIX10DECKIV',
				'output': php.implode('', [
					'>FSRIX10DECKIV/-*2G55/\u00B7                                         ',
					'                                                                ',
					'TTL OF 18   PRICING OPTIONS AND 24   ITINERARY OPTIONS RETURNED ',
					'                                                                ',
					'PRICING OPTION 1   *PRIVATE FARE USED* TOTAL AMOUNT    194.60USD',
					'ADT                                    TAX INCLUDED             ',
					'1  PS  186 M 10DEC  RIX KBP 1140A  110P   SU  E90  M1LEP4    E* ',
					'2  PS  897 M 10DEC  KBP KIV  740P  850P   SU  738  M1LEP4    E* ',
					'>FS01\u00B7           >FS*1\u00B7           >FQN1\u00B7                        ',
					'                                                                ',
					'PRICING OPTION 2                       TOTAL AMOUNT    216.10USD',
					'ADT                                    TAX INCLUDED             ',
					'1  TK 1776 E 10DEC  RIX IST  635P 1035P   SU  73H  EN2PXOW   E* ',
					')><',
				]),
				'state': {'hasPnr': false},
			},
			{
				'cmd': 'FS03',
				'output': php.implode('', [
					'FS03RIX10DECKIV/-*2G55/                                         ',
					'                                                                ',
					'PRICING OPTION 3                       TOTAL AMOUNT    239.60USD',
					'ADT                                    TAX INCLUDED             ',
					'1  LO 5784  V   10DEC    RIXWAW   620P  645P  DH4  V1STDOF0     ',
					'2  LO  513  V   11DEC    WAWKIV  1125A  210P  DH4  V1STDOF0     ',
					'                                                                ',
					'>$B-*2G55;                                                      ',
					'>T:$B-*2G55;',
					'><',
				]),
				'state': {'hasPnr': true},
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'NO NAMES',
					' 1 LO5784V 10DEC RIXWAW SS1   620P  645P *         SU   E',
					'         OPERATED BY AIR BALTIC CORPORATION S',
					' 2 LO 513V 11DEC WAWKIV SS1  1125A  210P *         MO   E',
					'><',
				]),
			},
		],
	});

	// failed sell from FS should not result in hasPnr
	sessionRecords.push({
		'initialState': php.array_merge(makeDefaultApolloState()),
		'calledCommands': [
			{
				'cmd': 'FSRIX10DECKIV',
				'output': php.implode('', [
					'>FSRIX10DECKIV/-*2G55/\u00B7                                         ',
					'                                                                ',
					'TTL OF 18   PRICING OPTIONS AND 24   ITINERARY OPTIONS RETURNED ',
					'                                                                ',
					'PRICING OPTION 1   *PRIVATE FARE USED* TOTAL AMOUNT    194.60USD',
					'ADT                                    TAX INCLUDED             ',
					'1  PS  186 M 10DEC  RIX KBP 1140A  110P   SU  E90  M1LEP4    E* ',
					'2  PS  897 M 10DEC  KBP KIV  740P  850P   SU  738  M1LEP4    E* ',
					'>FS01\u00B7           >FS*1\u00B7           >FQN1\u00B7                        ',
					'                                                                ',
					'PRICING OPTION 2                       TOTAL AMOUNT    216.10USD',
					'ADT                                    TAX INCLUDED             ',
					'1  TK 1776 E 10DEC  RIX IST  635P 1035P   SU  73H  EN2PXOW   E* ',
					')><',
				]),
				'state': {'hasPnr': false},
			},
			{
				'cmd': 'FS09',
				'output': php.implode(php.PHP_EOL, ['INFORMATION HAS NOT BEEN DISPLAYED', '><']),
				'state': {'hasPnr': false},
			},
		],
	});

	// failed sell from FS should not result in hasPnr
	sessionRecords.push({
		'initialState': php.array_merge(makeDefaultApolloState()),
		'calledCommands': [
			{
				'cmd': 'FS3',
				'output': php.implode(php.PHP_EOL, ['ERROR 47 - INVALID FORMAT/DATA FOR MODIFIER 3', 'FS3', '><']),
				'state': {'hasPnr': false},
			},
		],
	});

	// should reset recordLocator too, not just the isPnrStored
	sessionRecords.push({
		'initialState': php.array_merge(makeDefaultApolloState(), {
			'recordLocator': 'X7JDCC', 'isPnrStored': true, 'hasPnr': true,
		}),
		'calledCommands': [
			{
				'cmd': 'RESALL/2',
				'output': php.implode(php.PHP_EOL, [
					'NO NAMES',
					' 1 EK 232T 13NOV IADDXB SS2  1025A  810A|*      MO/TU   E',
					' 2 EK 231T 04DEC DXBIAD SS2   225A  810A *         MO   E',
					'><',
				]),
				'state': {
					'isPnrStored': false, 'recordLocator': '', 'hasPnr': true,
					itinerary: [
						{airline: 'EK', flightNumber: '232', bookingClass: 'T', departureDate: {raw: '13NOV'}, departureAirport: 'IAD', destinationAirport: 'DXB', segmentStatus: 'SS', seatCount: 2},
						{airline: 'EK', flightNumber: '231', bookingClass: 'T', departureDate: {raw: '04DEC'}, departureAirport: 'DXB', destinationAirport: 'IAD', segmentStatus: 'SS', seatCount: 2},
					],
				},
			},
		],
	});

	// One more INVLD command that breaks PNR state
	sessionRecords.push({
		'initialState': php.array_merge(makeDefaultApolloState(), {
			'recordLocator': 'X7JDCC', 'isPnrStored': true, 'hasPnr': true,
		}),
		'calledCommands': [
			{
				'cmd': '*ACOSTA/MONICA BAUTISTA',
				'output': php.implode(php.PHP_EOL, [
					'INVLD ',
					'><',
				]),
				'state': {'isPnrStored': false, 'recordLocator': '', 'hasPnr': false},
			},
		],
	});

	// Apollo open PNR from list ending with ATFQ line - should not cause parser exceptions
	sessionRecords.push({
		'initialState': makeDefaultApolloState(),
		'calledCommands': [
			{
				'cmd': '**-BRUCE',
				'output': php.implode(php.PHP_EOL, [
					'2G55-BRUCE                                    009 NAMES ON LIST 001   01 BRUCE/INGRID YVONNE          12JUL',
					'002   01 BRUCE/NII                    12AUG',
					'003   01 BRUCE/KESA VILAR             09JAN',
					'004   01 BRUCE/WAYNE                X 08FEB',
					'005   01 BRUCE/WAYNE                X 10FEB',
					'006   01 BRUCE/WAYNE                X 27FEB',
					'007   01 BRUCE/NATHANIEL F          X 22MAR',
					'008   01 BRUCE/WAYNE                X 04JUN',
					'009   01 BRUCE/WAYNE                X 25JUN',
					'><',
				]),
				'state': {'hasPnr': false, 'isPnrStored': false},
			},
			{
				'cmd': '*1',
				'output': php.implode(php.PHP_EOL, [
					'** THIS PNR IS CURRENTLY IN USE **',
					'KUNKKA',
					'MWF2JZ/3A QSBSB DYB3A   AG 05578602 05JUN',
					' 1.1BRUCE/INGRID YVONNE  2.1DEYOUNG/DONNA ROSE ',
					' 3.1RUIZ/CECILIA FRANCINE  4.1NETTLES/DELORES TAYLOR ',
					' 5 OTH ZO BK1  XXX 05APR-PRESERVEPNR',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'   2 SFOAS/PAYTON*1800 677-2943 EXT:22191',
					'FOP:-DSXXXXXXXXXXXX1939/D1117/*00524R',
					'TKTG-T/QSB 06JUN0036Z 42 AG **ELECTRONIC DATA EXISTS** >*HTE;',
					'*** TIN REMARKS EXIST *** >*T; ',
					'*** LINEAR FARE DATA EXISTS *** >*LF; ',
					'ATFQ-REPR/$B*IF80/-*1O3K/:A/Z$80.00/F|OK/ET/TA1O3K/CEK',
					')><',
				]),
				'state': {'hasPnr': true, 'isPnrStored': true},
			},
		],
	});

	// >*1; same deal with Apollo
	sessionRecords.push({
		'initialState': php.array_merge(makeDefaultApolloState(), []),
		'calledCommands': [
			{
				'cmd': '*MMJ6Q1',
				'output': php.implode(php.PHP_EOL, [
					'ANDREAS',
					'MMJ6Q1/PH QSBSB DYBSTY  AG 05578602 12SEP',
					' 1.1LABOR/CARMEN  2.1LABOR/ELIZARIO ',
					' 5 OTH ZO GK1  XXX 13JUL-PRESERVEPNR',
					'*** SEAT DATA EXISTS *** >9D; ',
					'FONE-SFOAS/STYX*1800 677-2943 EXT:22943',
					'FOP:-VIXXXXXXXXXXXX2318/D0622/*09349D',
					'TKTG-T/QSB 13SEP0542Z PL AG **ELECTRONIC DATA EXISTS** >*HTE;',
					'*** TIN REMARKS EXIST *** >*T; ',
					'*** LINEAR FARE DATA EXISTS *** >*LF; ',
					'ATFQ-REPR/$B/:N/Z8/F|OK/ET/TA1O3K/CBR',
					' FQ-USD 1190.00/USD 72.00US/USD 206.72XT/USD 1468.72 - 12SEP WKX6R.WKX6R.WKX6R.WKX6R/WKX6R.WKX6R.WKX6R.WKX6R',
					')><',
				]),
				'state': {'hasPnr': true, 'isPnrStored': true, 'recordLocator': 'MMJ6Q1'},
			},
			{
				'cmd': '*55',
				'output': php.implode(php.PHP_EOL, [
					'INVLD ',
					'><',
				]),
				'state': {'hasPnr': true, 'isPnrStored': true, 'recordLocator': 'MMJ6Q1'},
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'ANDREAS',
					'MMJ6Q1/PH QSBSB DYBSTY  AG 05578602 12SEP',
					' 1.1LABOR/CARMEN  2.1LABOR/ELIZARIO ',
					' 5 OTH ZO GK1  XXX 13JUL-PRESERVEPNR',
					'*** SEAT DATA EXISTS *** >9D; ',
					'FONE-SFOAS/STYX*1800 677-2943 EXT:22943',
					'FOP:-VIXXXXXXXXXXXX2318/D0622/*09349D',
					'TKTG-T/QSB 13SEP0542Z PL AG **ELECTRONIC DATA EXISTS** >*HTE;',
					'*** TIN REMARKS EXIST *** >*T; ',
					'*** LINEAR FARE DATA EXISTS *** >*LF; ',
					'ATFQ-REPR/$B/:N/Z8/F|OK/ET/TA1O3K/CBR',
					' FQ-USD 1190.00/USD 72.00US/USD 206.72XT/USD 1468.72 - 12SEP WKX6R.WKX6R.WKX6R.WKX6R/WKX6R.WKX6R.WKX6R.WKX6R',
					')><',
				]),
				'state': {'hasPnr': true, 'isPnrStored': true, 'recordLocator': 'MMJ6Q1'},
			},
		],
	});

	// but if there is an active >**-LIBER; in the session, then >*55; actually drops PNR
	sessionRecords.push({
		'initialState': php.array_merge(makeDefaultApolloState(), []),
		'calledCommands': [
			{
				'cmd': '**-LIBER',
				'output': php.implode(php.PHP_EOL, [
					'2G55-LIBER                                    023 NAMES ON LIST 001   01 LABOR/CARMEN                 05DEC',
					'002   01 LABOR/ELIZARIO               05DEC',
					'003   01 LABRE/SUSANFONTILLAS       X 29DEC',
					'004   01 LABRE/SUSANFONTILLAS         29DEC',
					'005   01 LIBOR/APOLINARIA ALFAR       07JAN',
					'006   01 LIBRE/ELSIEJANE ANTALAN      18JAN',
					'007   01 LIBERO/CHRISTIANKYLE RAQ   X 17FEB',
					'008   01 LOBER/NORA RUPPERT           07MAR',
					'009   01 LABRE/MARIAZENAIDA MEDIN     13MAR',
					'010   01 LABRE/RUBEN FONTILLAS        13MAR',
					'011   01 LOBERO/KERTH OMANDAM       X 03APR',
					'012   01 LOBERO/KERTH OMANDAM         15APR',
					')><',
				]),
				'state': {'hasPnr': false, 'isPnrStored': false, 'recordLocator': ''},
			},
			{
				'cmd': '*MMJ6Q1',
				'output': php.implode(php.PHP_EOL, [
					'ANDREAS',
					'MMJ6Q1/PH QSBSB DYBSTY  AG 05578602 12SEP',
					' 1.1LABOR/CARMEN  2.1LABOR/ELIZARIO ',
					' 5 OTH ZO GK1  XXX 13JUL-PRESERVEPNR',
					'*** SEAT DATA EXISTS *** >9D; ',
					'FONE-SFOAS/STYX*1800 677-2943 EXT:22943',
					'FOP:-VIXXXXXXXXXXXX2318/D0622/*09349D',
					'TKTG-T/QSB 13SEP0542Z PL AG **ELECTRONIC DATA EXISTS** >*HTE;',
					'*** TIN REMARKS EXIST *** >*T; ',
					'*** LINEAR FARE DATA EXISTS *** >*LF; ',
					'ATFQ-REPR/$B/:N/Z8/F|OK/ET/TA1O3K/CBR',
					' FQ-USD 1190.00/USD 72.00US/USD 206.72XT/USD 1468.72 - 12SEP WKX6R.WKX6R.WKX6R.WKX6R/WKX6R.WKX6R.WKX6R.WKX6R',
					')><',
				]),
				'state': {'hasPnr': true, 'isPnrStored': true, 'recordLocator': 'MMJ6Q1'},
			},
			{
				'cmd': '*55',
				'output': php.implode(php.PHP_EOL, [
					'INVLD ',
					'><',
				]),
				// we don't know for sure whether PNR was dropped or not - better think that not
				'state': {'hasPnr': true, 'isPnrStored': true, 'recordLocator': 'MMJ6Q1'},
			},
			{
				'cmd': '*R',
				'output': php.implode(php.PHP_EOL, [
					'INVLD ',
					'><',
				]),
				// another cheating
				'state': {'hasPnr': false, 'isPnrStored': false, 'recordLocator': ''},
			},
		],
	});

	sessionRecords.push({
		title: 'Apollo TUR segment successful sell example - should result in hasPnr = true',
		'initialState': php.array_merge(makeDefaultApolloState(), []),
		'calledCommands': [
			{
				'cmd': '0TURZZBK1YYZ08JUL-RETENTION LINE',
				'output': php.implode(php.PHP_EOL, [
					' 1 TUR ZZ BK1  YYZ 08JUL - RETENTION LINE',
					'><',
				]),
				'state': {'hasPnr': true},
			},
		],
	});

	sessionRecords.push({
		"initialState": {
			"gds": "apollo",
			"area": "B",
			"cmdType": "redisplayPnr",
			"scrolledCmd": "*R",
			"pricingCmd": null,
			"pcc": "2G8P",
			"hasPnr": true,
		},
		"calledCommands": [
			{
				"cmd": "PS-CREATED IN GDS DIRECT BY JAYDEN|@:5GD-JAYDEN/1092/FOR AGENT/1092/LEAD-11081962 IN 2G8P|T-CA-SFO@$0221686|P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU/27MAR|R:JAYDEN|ER",
				"output": "OK - VMML8E-DOWNTOWN TRAVEL          ATL\n><",
				"state": {
					"area": "B",
					"cmdType": "psRemark",
					"pricingCmd": null,
					"pcc": "2G8P",
					"hasPnr": true,
					"isPnrStored": true,
					"recordLocator": "VMML8E",
				},
			},
		],
	});

	sessionRecords.push({
		"title": "3-line error responses in Apollo should not result in active pricing cmd field being set",
		"initialState": {
			"gds": "apollo", "area": "D", "cmdType": "priceItinerary",
			"pricingCmd": "$BB/SOBAKALOPATA", "pcc": "2G2H", "hasPnr": true,
		},
		"calledCommands": [
			{
				"cmd": "$BB/SOBAKALOPATA",
				"output": [
					"ERROR 3844 - STOPOVER FORMAT ERROR",
					"$BB/SOBAKALOPATA",
					"><",
				].join("\n"),
				"type": "priceItinerary",
				"state": {
					"area": "D", "cmdType": "priceItinerary",
					"pricingCmd": null, "pcc": "2G2H", "hasPnr": true,
				},
			},
		],
	});

	sessionRecords.push({
		"title": "sell with N2Z1* instead of 02Z1* should still set the hasPnr=true flag",
		"initialState": {
			"gds": 'apollo',
			"area": "A", "pcc": "2F3K", "recordLocator": "",
			"cmdType": "moreAirAvailability", "hasPnr": false,
		},
		"calledCommands": [
			{
				"cmd": "N2Z1*",
				"output": [
					" 1 EY  407Z  30JAN BKKAUH SS2   155A  555A *      1          E",
					"010 AZ 3935  BT 5770  HM 5359  HX 1407  JU 7495  PG 4012  S7 *",
					"6 *",
					"010 UX 2704  VN 3279 *",
					"                         ARRIVES AUH TERMINAL 3 ",
					" 2 EY  151Z  30JAN AUHORD SS2   930A  245P *      1          E",
					"010 GF 5151  SV 6208  UL 2651 *",
					"OFFER CAR/HOTEL    >CAL;     >HOA;",
					"DEPARTS AUH TERMINAL 3  - ARRIVES ORD TERMINAL 5 ",
					"ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
					"PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
					"WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
					"FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
					"><",
				].join("\n"),
				"state": {
					"hasPnr": true, "cmdType": "sell",
					itinerary: [
						{airline: 'EY', flightNumber: '407', bookingClass: 'Z', departureDate: {raw: '30JAN'}, departureAirport: 'BKK', destinationAirport: 'AUH', segmentStatus: 'SS', seatCount: 2},
						{airline: 'EY', flightNumber: '151', bookingClass: 'Z', departureDate: {raw: '30JAN'}, departureAirport: 'AUH', destinationAirport: 'ORD', segmentStatus: 'SS', seatCount: 2},
					],
				},
			},
		],
	});

	sessionRecords.push({
		"title": "few interesting manipulations with the itinerary",
		"initialState": {
			"gds": 'apollo',
			"area": "A", "pcc": "3OL5", "recordLocator": "",
			"cmdType": "moreAirAvailability", "hasPnr": false,
		},
		"calledCommands": [
			{
				"cmd": "01E1Y2",
				"type": "sell",
				"output": [
					" 1 KQ    3E   2JUL JFKNBO SS1  1255P 1025A|*      1          E",
					"DEPARTS JFK TERMINAL 4  - ARRIVES NBO TERMINAL 1A",
					" 2 KQ  352Y   3JUL NBOJUB SS1   125P  310P *      1          E",
					"OFFER CAR/HOTEL    >CAL;     >HOA;",
					"DEPARTS NBO TERMINAL 1A",
					"ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
					"PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
					"WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
					"FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
					"><",
				].join("\n"),
				state: {
					itinerary: [
						{airline: 'KQ', flightNumber: '3', bookingClass: 'E'},
						{airline: 'KQ', flightNumber: '352', bookingClass: 'Y'},
					],
				},
			},
			{
				"cmd": "01M1*GK",
				"type": "sell",
				"output": [
					" 3 KQ    3M   2JUL JFKNBO GK1  1255P 1025A|                   ",
					"DEPARTS JFK TERMINAL 4  - ARRIVES NBO TERMINAL 1A",
					" 4 KQ  352M   3JUL NBOJUB GK1   125P  310P                    ",
					"OFFER CAR/HOTEL    >CAL;     >HOA;",
					"DEPARTS NBO TERMINAL 1A",
					"ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
					"PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
					"WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
					"FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
					"><",
				].join("\n"),
				state: {
					itinerary: [
						{airline: 'KQ', flightNumber: '3', bookingClass: 'E'},
						{airline: 'KQ', flightNumber: '352', bookingClass: 'Y'},
						{airline: 'KQ', flightNumber: '3', bookingClass: 'M'},
						{airline: 'KQ', flightNumber: '352', bookingClass: 'M'},
					],
				},
			},
			{
				"cmd": "SE",
				"type": "changeArea",
				"output": [
					"CURRENTLY USING AAA REQUESTED",
					"NO NAMES",
					" 1 KQ   3E 02JUL JFKNBO SS1  1255P 1025A|*      TH/FR   E  1",
					" 2 KQ 352Y 03JUL NBOJUB SS1   125P  310P *         FR   E  1",
					" 3 KQ   3M 02JUL JFKNBO GK1  1255P 1025A|       TH/FR",
					" 4 KQ 352M 03JUL NBOJUB GK1   125P  310P           FR",
					"><",
				].join("\n"),
			},
			{
				"cmd": "X3", "type": "deletePnrField",
				"output": ["NEXT REPLACES  3", "><"].join("\n"),
				state: {
					nextAddSegmentNumber: '3',
					itinerary: [
						{airline: 'KQ', flightNumber: '3', bookingClass: 'E'},
						{airline: 'KQ', flightNumber: '352', bookingClass: 'Y'},
						{airline: 'KQ', flightNumber: '352', bookingClass: 'M'},
					],
				},
			},
			{
				"cmd": "SE",
				"type": "changeArea",
				"output": [
					"CURRENTLY USING AAA REQUESTED",
					"NO NAMES",
					" 1 KQ   3E 02JUL JFKNBO SS1  1255P 1025A|*      TH/FR   E  1",
					" 2 KQ 352Y 03JUL NBOJUB SS1   125P  310P *         FR   E  1",
					" 3 KQ 352M 03JUL NBOJUB GK1   125P  310P           FR",
					"><",
				].join("\n"),
			},
			{
				"cmd": "/0/2-3",
				"type": "reorderSegments",
				"output": [
					" 1 KQ 352Y 03JUL NBOJUB SS1   125P  310P *         FR   E  1",
					" 2 KQ 352M 03JUL NBOJUB GK1   125P  310P           FR",
					" 3 KQ   3E 02JUL JFKNBO SS1  1255P 1025A|*      TH/FR   E  1",
					"><",
				].join("\n"),
				state: {
					itinerary: [
						{airline: 'KQ', flightNumber: '352', bookingClass: 'Y'},
						{airline: 'KQ', flightNumber: '352', bookingClass: 'M'},
						{airline: 'KQ', flightNumber: '3', bookingClass: 'E'},
					],
				},
			},
			{
				"cmd": "SE",
				"type": "changeArea",
				"output": [
					"CURRENTLY USING AAA REQUESTED",
					"NO NAMES",
					" 1 KQ 352Y 03JUL NBOJUB SS1   125P  310P *         FR   E  1",
					" 2 KQ 352M 03JUL NBOJUB GK1   125P  310P           FR",
					" 3 KQ   3E 02JUL JFKNBO SS1  1255P 1025A|*      TH/FR   E  1",
					"><",
				].join("\n"),
			},
			{
				"cmd": "X1-3/01YN|2Y|3E", "type": "deletePnrField",
				"output": ["DUPLICATE SEGMENT NOT PERMITTED", "UNABLE TO CANCEL", "><"].join("\n"),
				state: {
					itinerary: [
						{airline: 'KQ', flightNumber: '352', bookingClass: 'Y'},
						{airline: 'KQ', flightNumber: '352', bookingClass: 'M'},
						{airline: 'KQ', flightNumber: '3', bookingClass: 'E'},
					],
				},
			},
			{
				"cmd": "SE",
				"type": "changeArea",
				"output": [
					"CURRENTLY USING AAA REQUESTED",
					"NO NAMES",
					" 1 KQ 352M 03JUL NBOJUB GK1   125P  310P           FR",
					" 2 KQ 352Y 03JUL NBOJUB SS1   125P  310P *         FR   E",
					" 3 KQ   3E 02JUL JFKNBO SS1  1255P 1025A|*      TH/FR   E",
					"><",
				].join("\n"),
			},
			{
				"cmd": "X1-2", "type": "deletePnrField", "output": ["NEXT REPLACES  1", "><"].join("\n"),
				state: {
					nextAddSegmentNumber: '1',
					itinerary: [
						{airline: 'KQ', flightNumber: '3', bookingClass: 'E'},
					],
				},
			},
		],
	});

	sessionRecords.push({
		"title": "example where no segment number is available in the output",
		"initialState": {
			"gds": 'apollo',
			"area": "A", "pcc": "3OL5", "recordLocator": "",
			"cmdType": "moreAirAvailability", "hasPnr": false,
		},
		"calledCommands": [
			{
				"cmd": "*R",
				"output": [
					"NO NAMES",
					" 1 AC 128T 15JUN YVRYYZ SS5  1140P  711A|*      MO/TU   E",
					" 2 ET 553U 16JUN YYZADD SS5  1100A  700A|*      TU/WE   E",
					" 3 ET 900C 16JUL LOSADD SS5   140P  900P *         TH   E",
					" 4 ET 552M 16JUL ADDYYZ GK5  1055P  825A|       TH/FR",
					" 5 ET 552H 16JUL ADDYYZ GK5  1055P  825A|       TH/FR",
					"><",
				].join("\n"),
				state: {
					itinerary: [
						{airline: 'AC', flightNumber: '128', bookingClass: 'T'},
						{airline: 'ET', flightNumber: '553', bookingClass: 'U'},
						{airline: 'ET', flightNumber: '900', bookingClass: 'C'},
						{airline: 'ET', flightNumber: '552', bookingClass: 'M'},
						{airline: 'ET', flightNumber: '552', bookingClass: 'H'},
					],
				},
			},
			{
				"cmd": "X3-4/04U",
				"output": [
					"   ET  552U  16JUL ADDYYZ SS5  1055P  825A|*      1          E",
					"010 KP 1105 *",
					"010 SA 7194 *",
					"OFFER CAR/HOTEL    >CAL;     >HOA;",
					"DEPARTS ADD TERMINAL 2  - ARRIVES YYZ TERMINAL 1 ",
					"ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
					"PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
					"WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
					"FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
					"CANCEL REQUEST COMPLETED",
					"><",
				].join("\n"),
				state: {
					itinerary: [
						{airline: 'AC', flightNumber: '128', bookingClass: 'T'},
						{airline: 'ET', flightNumber: '553', bookingClass: 'U'},
						{airline: 'ET', flightNumber: '552', bookingClass: 'U'},
						{airline: 'ET', flightNumber: '552', bookingClass: 'H'},
					],
				},
			},
			{
				"cmd": "*R",
				"output": [
					"NO NAMES",
					" 1 AC 128T 15JUN YVRYYZ SS5  1140P  711A|*      MO/TU   E",
					" 2 ET 553U 16JUN YYZADD SS5  1100A  700A|*      TU/WE   E",
					" 3 ET 552U 16JUL ADDYYZ SS5  1055P  825A|*      TH/FR   E",
					" 4 ET 552H 16JUL ADDYYZ GK5  1055P  825A|       TH/FR",
					"><",
				].join("\n"),
			},
		],
	});

	sessionRecords.push({
		"title": "NEXT FOLLOWS and ARNK segment sell example",
		"initialState": {
			"gds": 'apollo',
			"area": "A", "pcc": "3OL5", "recordLocator": "",
			"cmdType": "moreAirAvailability", "hasPnr": false,
		},
		"calledCommands": [
			{
				cmd: '*R',
				output: [
					'NO NAMES',
					' 1 AA 359O 25FEB IADDFW GK1   223P  455P           TU',
					' 2 AA 945O 25FEB DFWSCL GK1   830P  845A|       TU/WE',
					' 3 AA 912Q 14MAR SCLMIA SS1   850P  425A|*      SA/SU   E  1',
					' 4 AA1477Q 15MAR MIACLT SS1   610A  822A *         SU   E  1',
					' 5 AA5320Q 15MAR CLTIAD GK1   945A 1121A           SU',
					'         OPERATED BY PSA AIRLINES AS AMERICAN EAGLE',
					'><',
				].join('\n'),
			},
			{"cmd": ".1LL", "type": "changeSegmentStatus", "output": ["SGMT   1 LL                                                    ", "><"].join("\n")},
			{
				cmd: ".2LL",
				type: "changeSegmentStatus",
				output: ["SGMT   2 LL                                                    ", "><"].join("\n"),
				state: {
					itinerary: [
						{airline: 'AA', flightNumber: '359', bookingClass: 'O', destinationAirport: 'DFW'},
						{airline: 'AA', flightNumber: '945', bookingClass: 'O', destinationAirport: 'SCL'},
						{airline: 'AA', flightNumber: '912', bookingClass: 'Q', destinationAirport: 'MIA'},
						{airline: 'AA', flightNumber: '1477', bookingClass: 'Q', destinationAirport: 'CLT'},
						{airline: 'AA', flightNumber: '5320', bookingClass: 'Q', destinationAirport: 'IAD'},
					],
				},
			},
			{
				cmd: "/2",
				type: "setNextFollowsSegment",
				output: ["NEXT FOLLOWS  2                                                ", "><"].join("\n"),
				state: {
					nextAddSegmentNumber: 3,
				},
			},
			{
				cmd: "Y",
				type: "sell",
				output: [
					"   ARNK",
					"OFFER CAR/HOTEL    >CAL;     >HOA;",
					"><",
				].join("\n"),
				state: {
					itinerary: [
						{airline: 'AA', flightNumber: '359', bookingClass: 'O', destinationAirport: 'DFW'},
						{airline: 'AA', flightNumber: '945', bookingClass: 'O', destinationAirport: 'SCL'},
						{segmentType: 'ARNK'},
						{airline: 'AA', flightNumber: '912', bookingClass: 'Q', destinationAirport: 'MIA'},
						{airline: 'AA', flightNumber: '1477', bookingClass: 'Q', destinationAirport: 'CLT'},
						{airline: 'AA', flightNumber: '5320', bookingClass: 'Q', destinationAirport: 'IAD'},
					],
				},
			},
			{"cmd": ".6LL", "type": "changeSegmentStatus", "output": ["SGMT   6 LL                                                    ", "><"].join("\n")},
		],
	});

	return sessionRecords.map(t => [t]);
};

class UpdateState_apolloTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js')
{
	/** @param sessionRecord = provide_call() */
	test_call(sessionRecord) {
		const gds = sessionRecord.initialState.gds;
		let sessionState = sessionRecord.initialState;
		const calledCommands = sessionRecord.calledCommands;
		const letterToArea = {'A': sessionState};
		const getAreaData = (letter) => {
			return letterToArea[letter] || {
				'pcc': '',
				'recordLocator': '',
				'hasPnr': false,
				'isPnrStored': false,
			};
		};
		for (const [i, cmdRecord] of Object.entries(calledCommands)) {
			const {cmd, output} = cmdRecord;
			sessionState = UpdateState_apollo({cmd, output, gds, sessionState, getAreaData});
			letterToArea[sessionState.area] = sessionState;
			const expected = cmdRecord.state || null;
			if (expected) {
				const allCmds = calledCommands.map(cmdRec => cmdRec.cmd);
				const msg = i + '-th command - ' + cmdRecord.cmd +
					' - \n' + allCmds.join(', ') + '\n';
				this.assertSubTree(expected, sessionState, msg);
			}
		}
	}

	getTestMapping() {
		return [
			[provide_call, this.test_call],
		];
	}
}

module.exports = UpdateState_apolloTest;
