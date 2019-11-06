
const SabreTicketParser = require('../../../src/text_format_processing/sabre/TicketMaskParser.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

class TicketMaskParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js') {
	provideDumps() {
		const list = [];

		// with Frequent Flier code
		list.push([
			php.implode(php.PHP_EOL, [
				'1ELECTRONIC TICKET RECORD                                       ',
				'INV:                  CUST:8007502041                PNR:IMUQMU',
				'TKT:0067750182998     ISSUED:09FEB16   PCC:DK8H   IATA:10741570',
				'NAME:MCCRAW/SAMMY T                    FF:DL2262281757         ',
				'FOP: CHECK                                                     ',
				'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
				'1    DL   1771  V  07OCT  MEMATL 1044A  OK VKWT1U0/LN1U    OPEN',
				'2    DL   26    V  07OCT  ATLBCN  533P  OK VKWT1U0/LN1U    OPEN',
				'3    DL   115   V  21OCT  BCNATL 1025A  OK VKWT1U0/LN1U    OPEN',
				'4    DL   1778  V  21OCT  ATLMEM  430P  OK VKWT1U0/LN1U    OPEN',
				'                                                               ',
				'FARE       USDIT TAX  496.00YR  TAX   35.60US  TAX    5.50YC   ',
				'                 TAX    7.00XY  TAX    3.96XA  TAX   11.20AY   ',
				'                 TAX   20.40JD  TAX    4.10QV  TAX    0.70OG   ',
				'                 TAX    9.00XF                                 ',
				'TOTAL       USDIT                                              ',
				'                                                               ',
				'MEM DL X/ATL KL BCN M/IT      X/ATL DL MEM M/IT            END ',
				'XFATL4.5ATL4.5                                                 ',
				'                                                               ',
				'ENDORSEMENT/RESTRICTION:                                       ',
				'NONEND/NONREF/LN106/PROOF OFLAND PKG REQUIRED                  ',
			]),
			{
				'header': {
					'customerNumber': '8007502041',
					'ticketNumber': '0067750182998',
					'issueDate': {'parsed': '2016-02-09'},
					'pcc': 'DK8H',
					'passengerName': 'MCCRAW/SAMMY T',
					'frequentFlierAirline': 'DL',
					'frequentFlierCode': '2262281757',
					'formOfPayment': 'check',
				},
				'segments': [
					{'destinationAirport': 'ATL', 'fareBasis': 'VKWT1U0', 'ticketDesignator': 'LN1U'},
					{'destinationAirport': 'BCN', 'fareBasis': 'VKWT1U0', 'ticketDesignator': 'LN1U'},
					{'destinationAirport': 'ATL', 'fareBasis': 'VKWT1U0', 'ticketDesignator': 'LN1U'},
					{'destinationAirport': 'MEM', 'fareBasis': 'VKWT1U0', 'ticketDesignator': 'LN1U'},
				],
			},
		]);

		// without Frequent Flier code
		list.push([
			php.implode(php.PHP_EOL, [
				'1ELECTRONIC TICKET RECORD                                       ',
				'INV:                  CUST:8007502041                PNR:LEOTLD',
				'TKT:0067851991438     ISSUED:20AUG16   PCC:DK8H   IATA:10741570',
				'NAME:MANGAOANG/DANIEL M                                        ',
				'FOP: CHECK                                                     ',
				'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
				'1    DL   1641  V  24SEP  SATATL 1043A  OK VKWT8U0/LN1P    USED',
				'2    VS   104   V  24SEP  ATLLHR  545P  OK VKWT8U0/LN1P    USED',
				'3    DL   4356  V  29SEP  LHRATL 1135A  OK VKXT8U0/LN1P    OPEN',
				'4    DL   953   V  29SEP  ATLSAT  600P  OK VKXT8U0/LN1P    OPEN',
				'                                                               ',
				'FARE       USDIT TAX  518.00YR  TAX   35.60US  TAX    5.50YC   ',
				'                 TAX    7.00XY  TAX    3.96XA  TAX   11.20AY   ',
				'                 TAX   95.70GB  TAX   54.60UB  TAX   13.50XF   ',
				'TOTAL       USDIT                                              ',
				'                                                               ',
				'SAT DL X/ATL DL LON M/IT      X/ATL DL SAT M/IT           ENDXF',
				'SAT4.5ATL4.5ATL4.5                                             ',
				'                                                               ',
				'ENDORSEMENT/RESTRICTION:                                       ',
				'NONEND/NONREF/LN1P/PROOF OF LAND PKG REQUIRED                  ',
			]),
			{
				'header': {
					'customerNumber': '8007502041',
					'ticketNumber': '0067851991438',
					'issueDate': {'parsed': '2016-08-20'},
					'passengerName': 'MANGAOANG/DANIEL M',
					'formOfPayment': 'check',
				},
				'segments': [
					{'departureTime': {'parsed': '10:43'}, 'couponStatus': 'USED'},
					{'departureTime': {'parsed': '17:45'}, 'couponStatus': 'USED'},
					{'departureTime': {'parsed': '11:35'}, 'couponStatus': 'OPEN'},
					{'departureTime': {'parsed': '18:00'}, 'couponStatus': 'OPEN'},
				],
			},
		]);

		// with NAME REF/TOUR ID line
		list.push([
			php.implode(php.PHP_EOL, [
				'1ELECTRONIC TICKET RECORD                                       ',
				'INV:                  CUST:8007502041                PNR:DDKKYI',
				'TKT:2057851991433     ISSUED:19AUG16   PCC:DK8H   IATA:10741570',
				'NAME:TAKEBE/NAOKO                      FF:NH4208035931         ',
				'NAME REF:                              TOUR ID:254DB           ',
				'FOP: CHECK                                                     ',
				'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
				'1    NH   1     W  21DEC  IADNRT 1110A  OK WPXPK6/54DB     OPEN',
				'2    NH   2     W  04JAN  NRTIAD 1100A  OK WHXPK6/54DB     OPEN',
				'                                                               ',
				'FARE       USDIT TAX    4.00YQ  TAX   35.60US  TAX    5.50YC   ',
				'                 TAX    7.00XY  TAX    3.96XA  TAX    5.60AY   ',
				'                 TAX   20.80SW  TAX    5.20OI  TAX    4.50XF   ',
				'TOTAL       USDIT                                              ',
				'                                                               ',
				'WAS NH TYO/IT      WAS/IT             END         XFIAD4.5     ',
				'                                                               ',
				'ENDORSEMENT/RESTRICTION:                                       ',
				'NON-END/CHG N RFD/REF TO ISS OFC                               ',
			]),
			{
				'header': {
					'ticketNumber': '2057851991433',
					'issueDate': {'parsed': '2016-08-19'},
					'passengerName': 'TAKEBE/NAOKO',
					'tourId': '254DB',
				},
				'segments': [
					{'flightNumber': '1', 'airline': 'NH'},
					{'flightNumber': '2', 'airline': 'NH'},
				],
			},
		]);

		// with credit card
		list.push([
			php.implode(php.PHP_EOL, [
				'1ELECTRONIC TICKET RECORD                                       ',
				'INV:                  CUST:                          PNR:GBIDSA',
				'TKT:3287854303368     ISSUED:20AUG16   PCC:6IIF   IATA:05578602',
				'NAME:SUTTON/GREGORY ANTHONY                                    ',
				'FOP: VIXXXXXXXXXXXX1979*XXXX /112413 S                         ',
				'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
				'1    DY   7108  V  21NOV  LASLGW  500P  OK VSRGB           OPEN',
				'2    DY   7107  P  28NOV  LGWLAS 1210P  OK PSRGB           OPEN',
				'                                                               ',
				'FARE   USD470.00 TAX   35.60US  TAX    5.50YC  TAX    7.00XY   ',
				'                 TAX    3.96XA  TAX    5.60AY  TAX   95.70GB   ',
				'                 TAX   16.70UB  TAX    4.50XF                  ',
				'TOTAL   USD644.56                                              ',
				'                                                               ',
				'LAS DY LON Q42.88 275.00DY LAS Q42.88 109.00NUC469.76END ROE1.0',
				'0 XFLAS4.5                                                     ',
				'                                                               ',
				'ENDORSEMENT/RESTRICTION:                                       ',
				'VALID ON DY/D8 ONLY/NONREF                                     ',
			]),
			{
				'header': {
					'ticketNumber': '3287854303368',
					'issueDate': {'parsed': '2016-08-20'},
					'passengerName': 'SUTTON/GREGORY ANTHONY',
					'formOfPayment': 'creditCard',
					'creditCardInfo': {
						'paymentNetwork': 'VI',
						'creditCardNumber': 'XXXXXXXXXXXX1979',
						'expirationDate': {
							'raw': 'XXXX',
							'parsed': '20XX-XX',
						},
						'approvalCode': '112413',
						'approvalSource': 'sabre',
					},
				},
				'segments': [
					{'departureDate': {'parsed': '11-21'}, 'fareBasis': 'VSRGB'},
					{'departureDate': {'parsed': '11-28'}, 'fareBasis': 'PSRGB'},
				],
			},
		]);

		// with "IT" instead of numbers in fare and fare construction
		list.push([
			php.implode(php.PHP_EOL, [
				'1ELECTRONIC TICKET RECORD                                       ',
				'INV:                  CUST:8007502041                PNR:LOZYSM',
				'TKT:0167851991461     ISSUED:23AUG16   PCC:DK8H   IATA:10741570',
				'NAME:GILLESPIE/WILLIAMCOLE                                     ',
				'NAME REF:                              TOUR ID:267BR           ',
				'FOP: CHECK                                                     ',
				'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
				'1    LH   463   L  06JUN  MIAFRA  455P  OK LHXUAX25        OPEN',
				'2    LH   334   L  07JUN  FRANAP  945A  OK LHXUAX25        OPEN',
				'3    UA   9141  L  21JUN  NAPFRA  700A  OK LHXUAX25        OPEN',
				'4    UA   8849  L  21JUN  FRAMIA 1045A  OK LHXUAX25        OPEN',
				'                                                               ',
				'FARE       USDIT TAX  576.00YQ  TAX   35.60US  TAX    5.50YC   ',
				'                 TAX    7.00XY  TAX    3.96XA  TAX    5.60AY   ',
				'                 TAX   20.60DE  TAX   48.20RA  TAX    1.90EX   ',
				'                 TAX    9.50IT  TAX    4.00VT  TAX   10.20HB   ',
				'                 TAX    0.90MJ  TAX    4.50XF                  ',
				'TOTAL       USDIT                                              ',
				'                                                               ',
				'MIA LH X/FRA LH NAP/IT      X/FRA UA MIA/IT            END     ',
				'    XFMIA4.5                                                   ',
				'                                                               ',
				'ENDORSEMENT/RESTRICTION:                                       ',
				'NONEND/REFRERTEINFOTHRUAGT/VLD AC/LH/LX/OS/SN/UA ONLY          ',
			]),
			{
				'priceInfo': {
					'fare': {
						'currency': 'USD',
						'amountIndicator': 'IT',
						'taxes': {
							'YQ': '576.00',
							'RA': '48.20',
							'XF': '4.50',
						},
					},
					'total': {
						'currency': 'USD',
						'amountIndicator': 'IT',
					},
				},
			},
		]);

		// with EQUIV FARE PD
		list.push([
			php.implode(php.PHP_EOL, [
				'1ELECTRONIC TICKET RECORD                                       ',
				'INV:0167126           CUST:                          PNR:DJGALB',
				'TKT:6577864058425     ISSUED:23SEP16   PCC:YR8A   IATA:05922022',
				'NAME:WEINSTEIN/ALEX                    FF:BT4002795841         ',
				'FOP: CHECK                                                     ',
				'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
				'1    BT   422   D  23SEP  RIXSVO  620P  OK DRBIZ           USED',
				'2    BT   429   Z  05OCT  SVORIX  335P  OK ZR2PRM          OPEN',
				'                                                               ',
				'FARE   EUR547.00 TAX   82.60YQ  TAX    3.80LV  TAX    7.20XM   ',
				'                 TAX   17.60RI  TAX    7.66UH                  ',
				'TOTAL   USD728.86               EQUIV FARE PD   USD610.00      ',
				'                                                               ',
				'RIX BT MOW572.81BT RIX47.64NUC620.45END ROE0.881606            ',
				'                                                               ',
				'SETTLEMENT AUTHORIZATION:  657RTDZVU7AD5                       ',
				'                                                               ',
				'ENDORSEMENT/RESTRICTION:                                       ',
				'RESTRICTIONS APPLY/ PER FARE COMPONENT                         ',
				'NAME CHG EUR 50/REBOOKING EUR50/RFND PENLTY EUR100 PER TKT/BAGG',
				'AGE 1 BAG 20 KG FREE.                                          ',
			]),
			{
				'priceInfo': {
					'fare': {
						'currency': 'EUR',
						'amount': '547.00',
						'taxes': {
							'YQ': '82.60',
							'XM': '7.20',
							'UH': '7.66',
						},
					},
					'total': {
						'currency': 'USD',
						'amount': '728.86',
					},
					'equivalentFarePaid': {
						'currency': 'USD',
						'amount': '610.00',
					},
				},
				'fareConstruction': {
					'currency': 'NUC',
					'fareAndMarkupInNuc': '620.45',
					'rateOfExchange': '0.881606',
					'segments': [
						{'destination': 'MOW', 'fare': '572.81'},
						{'destination': 'RIX', 'fare': '47.64'},
					],
				},
			},
		]);

		// with "BT" instead of currency and amount
		list.push([
			php.implode(php.PHP_EOL, [
				'1ELECTRONIC TICKET RECORD                                       ',
				'INV:                  CUST:                          PNR:NXCEAX',
				'TKT:7257854303356     ISSUED:19AUG16   PCC:6IIF   IATA:05578602',
				'NAME:ADEMUWAGUN/COMFORT                                        ',
				'FOP: VIXXXXXXXXXXXX6861*XXXX /734042 S                         ',
				'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
				'1    W3   0108  M  05SEP  JFKLOS 1225P  OK MKRBUS          USED',
				'2    W3   0107  T  15JAN  LOSJFK 1130P  OK TKRBUS          OPEN',
				'                                                               ',
				'FARE          BT TAX  450.00YQ  TAX   35.60US  TAX    5.50YC   ',
				'                 TAX    7.00XY  TAX    3.96XA  TAX    5.60AY   ',
				'                 TAX   50.00QT  TAX   20.00TE  TAX    4.50XF   ',
				'                 TAX    5.50YC  TAX    7.00XY  TAX    3.96XA   ',
				'                 TAX    5.60AY  TAX   50.00QT  TAX   20.00TE   ',
				'                 TAX    4.50XF                                 ',
				'TOTAL          BT                                              ',
				'                                                               ',
				'NYC W /BT       W3 NYC /BT  BT      END  BT     XT5.50YC7.00XY3',
				'.96XA5.60AY50.00QT20.00TE 4.50XFJFK4.5                         ',
				'                                                               ',
				'ENDORSEMENT/RESTRICTION:                                       ',
				'XLE/CHG/NOSHOW FEE APPLIES/VALID ON W3 ONLY                    ',
			]),
			{
				'priceInfo': {
					'fare': {
						'amountIndicator': 'BT',
						'taxes': {
							'YQ': '450.00',
							'XY': '7.00',
							'TE': '20.00',
						},
					},
					'total': {
						'amountIndicator': 'BT',
					},
				},
			},
		]);

		// with NAME REF
		list.push([
			php.implode(php.PHP_EOL, [
				'1ELECTRONIC TICKET RECORD                                       ',
				'INV:                  CUST:                          PNR:AMGEQC',
				'TKT:0167854303300/01  ISSUED:16AUG16   PCC:6IIF   IATA:05578602',
				'NAME:BOTETI/YAZSIN                                             ',
				'NAME REF:C06                           TOUR ID:294UA           ',
				'FOP: VIXXXXXXXXXXXX7704*XXXX /155216 M                         ',
				'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
				'1    AC   8624  K  16DEC  ATLYYZ  525P  OK KHLNC5N/CHUS    OPEN',
				'2    AC   824   K  16DEC  YYZAMS  855P  OK KHLNC5N/CHUS    OPEN',
				'3    KQ   1565  Q  17DEC  AMSNBO 1145A  OK KHLNC5N/CHUS    OPEN',
				'4    KQ   1566  H  06JAN  NBOAMS 1159P  OK KHLNC5N/CHUS    OPEN',
				'5    AC   825   K  07JAN  AMSYYZ 1205P  OK KHLNC5N/CHUS    OPEN',
				'6    AC   8627  K  07JAN  YYZATL  450P  OK KHLNC5N/CHUS    OPEN',
				'7    UA   251   K  08JAN  ATLORD  645A  OK KHLNC5N/CHUS    OPEN',
				'                                                               ',
				'FARE       USDBT TAX  488.00YQ  TAX   35.60US  TAX    5.50YC   ',
				'                 TAX    7.00XY  TAX    3.96XA  TAX   11.20AY   ',
				'                 TAX    6.20SQ  TAX    0.80RC  TAX   13.20CJ   ',
				'                 TAX   13.00RN  TAX    1.20VV  TAX   50.00TU   ',
				'                 TAX    9.00XF                                 ',
				'TOTAL       USDBT                                              ',
				'                                                               ',
				'ATL AC X/YTO AC X/AMS KQ NBO BT  KQ X/AMS AC X/YTO AC X/ATL UA ',
				'CHI BT  IT BT   PLUS BT  END  IT1.00 XFATL4.5ATL4.5            ',
				'                                                               ',
				'ENDORSEMENT/RESTRICTION:                                       ',
				'REFTHRUAG/NONEND/NONRERTE/LH/UA/AC/OS/SN/LX                    ',
			]),
			{
				'header': {
					'passengerName': 'BOTETI/YAZSIN',
					'nameReference': 'C06',
					'tourId': '294UA',
					'formOfPayment': 'creditCard',
					'creditCardInfo': {
						'paymentNetwork': 'VI',
						'creditCardNumber': 'XXXXXXXXXXXX7704',
					},
				},
			},
		]);

		// with original issue
		list.push([
			php.implode(php.PHP_EOL, [
				'1ELECTRONIC TICKET RECORD                                       ',
				'INV:                  CUST:8007502041                PNR:TDCZJG',
				'TKT:0557953276050/51  ISSUED:07MAR17   PCC:DK8H   IATA:10741570',
				'NAME:HOGE/THOMAS                                               ',
				'NAME REF:                              TOUR ID:IARESO735D      ',
				'FOP:                                                           ',
				'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
				'1    AZ   621   O  24JUL  LAXFCO  415P  OK OHXI75US/LN15   OPEN',
				'2                         ARUNK                                ',
				'3    AF   1233  V  08AUG  ATHCDG 1150A  OK OHXI75US/LN15   OPEN',
				'4    AF   378   V  08AUG  CDGDTW  330P  OK VHXI75US/LN15   OPEN',
				'5    DL   1845  V  08AUG  DTWLAX  800P  OK VHXI75US/LN15   OPEN',
				'                                                               ',
				'FARE       USDBT TAX  200.00YR  TAX   36.00US  TAX    5.50YC   ',
				'                 TAX    7.00XY  TAX    3.96XA  TAX   11.20AY   ',
				'                 TAX   23.00GR  TAX    5.20WQ  TAX   13.40WP   ',
				'                 TAX    8.50FR  TAX   19.50QX  TAX    9.00XF   ',
				'TOTAL       USDBT                                              ',
				'                                                               ',
				'I-LAX AZ ROM//ATH AF PAR Q LAXPAR/IT X/DTT DL LAX M/IT END XFLA',
				'X4.5DTW4.5                                                     ',
				'                                                               ',
				'ORIGINAL ISSUE: 0557931853228   06JAN17FLL                     ',
				'ORIGINAL FOP:  CHECK                                           ',
				'EXCHANGE TKT: 0557931853228-29 134/1                           ',
				'                                                               ',
				'ENDORSEMENT/RESTRICTION:                                       ',
				'NONREF/NONEND/PEX NON-ENDORS/AZ ONLY                           ',
				'NONREF/NONEND/PEX/NON-ENDORS/INV REROUT/DL124                  '
			]),
			{
				'extraFields': {
					'originalIssue': {
						'airlineNumber': '055',
						'documentNumber': '7931853228',
						'date': {'raw': '06JAN17', 'parsed': '2017-01-06'},
						'location': 'FLL',
					},
					'exchangedFor': {
						'airlineNumber': '055',
						'documentNumber': '7931853228',
					},
				},
				'endorsementLines': [
					'NONREF/NONEND/PEX NON-ENDORS/AZ ONLY',
					'NONREF/NONEND/PEX/NON-ENDORS/INV REROUT/DL124'
				],
			},
		]);

		// another ORIGINAL ISSUE example
		list.push([
			php.implode(php.PHP_EOL, [
				'1ELECTRONIC TICKET RECORD                                       ',
				'INV:                  CUST:8007502041                PNR:VJYNCL',
				'TKT:0167043497084     ISSUED:31JAN18   PCC:DK8H   IATA:10741570',
				'NAME:KURTZ/JESSICAD                                            ',
				'NAME REF:                              TOUR ID:267BR           ',
				'FOP: CHECK                                                     ',
				'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
				'1    UA   998   T  01MAR  BRUEWR 1000A  OK TLXUAX          OPEN',
				'2    UA   3484  T  01MAR  EWRCLE  400P  OK TLXUAX          OPEN',
				'                                                               ',
				'FARE       USDIT TAX  250.00YQ  TAX   36.00US  TAX    5.50YC   ',
				'                 TAX    7.00XY  TAX    3.96XA  TAX   11.20AY   ',
				'                 TAX   32.90BE  TAX   13.50XF                  ',
				'TOTAL       USDIT                                              ',
				'                                                               ',
				'CLE UA X/WAS UA BRU/IT      X/EWR UA CLE/IT            END     ',
				'    XFCLE4.5IAD4.5EWR4.5                                       ',
				'                                                               ',
				'ORIGINAL ISSUE: 0167023200499   15NOV17FLL                     ',
				'ORIGINAL FOP:  CHECK                                           ',
				'EXCHANGE TKT: 0167023200499                                    ',
				'ADD COLLECT AMOUNT: 561.00                                     ',
				'                                                               ',
				'ENDORSEMENT/RESTRICTION:                                       ',
				'WR-4F245/NONREFUNDABLE/NONEND/REFRERTEINFOTHRUAGT/VLD AC/LH/ LX',
				'/OS/SN/                                                        ',
			]),
			{
				'extraFields': {
					'originalIssue': {
						'airlineNumber': '016',
						'documentNumber': '7023200499',
						'date': {'raw': '15NOV17', 'parsed': '2017-11-15'},
						'location': 'FLL',
					},
					'exchangedFor': {
						'airlineNumber': '016',
						'documentNumber': '7023200499',
					},
				},
			},
		]);

		// >*MILTLX; with unknown form of payment - INVIBE9099215BS5060
		list.push([
			php.implode(php.PHP_EOL, [
				'1ELECTRONIC TICKET RECORD                                       ',
				'INV:                  CUST:                          PNR:MILTLX',
				'TKT:0011225944821     ISSUED:03FEB17   PCC:0BWH   IATA:91265694',
				'NAME:KU/JAE YEE                                                ',
				'NAME REF:                              TOUR ID:GBAAIT          ',
				'FOP: INVIBE9099215BS5060                                       ',
				'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
				'1    AA   735   O  06MAY  MANPHL 1050A  OK OKN1S4T1/GBTJ   EXCH',
				'2    AA   4308  O  06MAY  PHLBWI  645P  OK OKN1S4T1/GBTJ   EXCH',
				'3    AA   4188  O  12MAY  BWIPHL  650P  OK OKN1S4T1/GBTJ   EXCH',
				'4    AA   734   O  12MAY  PHLMAN  850P  OK OKN1S4T1/GBTJ   EXCH',
				'                                                               ',
				'FARE       GBPBT TAX   75.00GB  TAX   16.32UB  TAX  203.00YR   ',
				'                 TAX   28.60US  TAX    4.40YC  TAX    5.60XY   ',
				'                 TAX    3.10XA  TAX    8.80AY  TAX    3.60XF   ',
				'TOTAL       GBPBT                                              ',
				'                                                               ',
				'MAN AA X/PHL AA BWI M/BT AA X/PHL AA MAN M/BT        END       ',
				'      XT203.00YR28.60US4.40YC5.60XY3.10XA8.80AY 3.60XFPHL4.5   ',
				'                                                               ',
				'SETTLEMENT AUTHORIZATION: C0010AUFGTEKI1                       ',
				'                                                               ',
				'ENDORSEMENT/RESTRICTION:                                       ',
				'NONREFUNDABLE/RESTRICTIONS APPLY                               ',
			]),
			{
				'header': {
					'recordLocator': 'MILTLX',
					'ticketNumber': '0011225944821',
					'issueDate': {'raw': '03FEB17', 'parsed': '2017-02-03'},
					'pcc': '0BWH',
					'pccIataCode': '91265694',
					'passengerName': 'KU/JAE YEE',
					'tourId': 'GBAAIT',
					'formOfPayment': 'unparsed',
					'formOfPaymentRaw': 'INVIBE9099215BS5060                                       ',
				},
				'segments': [
					{'destinationAirport': 'PHL'},
					{'destinationAirport': 'BWI'},
					{'destinationAirport': 'PHL'},
					{'destinationAirport': 'MAN'},
				],
				'priceInfo': {
					'fare': {
						'currency': 'GBP',
						'taxes': {
							'GB': '75.00', 'UB': '16.32', 'YR': '203.00',
							'US': '28.60', 'YC': '4.40', 'XY': '5.60',
							'XA': '3.10', 'AY': '8.80', 'XF': '3.60',
						},
					},
				},
				'endorsementLines': ['NONREFUNDABLE/RESTRICTIONS APPLY'],
			},
		]);

		// letters in customer code
		list.push([
			php.implode(php.PHP_EOL, [
				'1ELECTRONIC TICKET RECORD                                       ',
				'INV:                  CUST:D415840020                PNR:PRIXAT',
				'TKT:0168659320915/16  ISSUED:04OCT17   PCC:37AF   IATA:23790852',
				'NAME:TOWLE/KAIGHNP                                             ',
				'NAME REF:                              TOUR ID:267BR           ',
				'FOP: CHECK                                                     ',
				'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
				'1    UA   2387  L  28DEC  BZNDEN  515A  OK LLWUAX25        OPEN',
				'2    UA   533   L  28DEC  DENORD 1121A  OK LLWUAX25        OPEN',
				'3    UA   958   L  28DEC  ORDLHR  455P  OK LLWUAX25        OPEN',
				'4    UA   15    K  07JAN  LHREWR 1025A  OK KLWUAX25        OPEN',
				'5    UA   2147  K  07JAN  EWRORD  437P  OK KLWUAX25        OPEN',
				'6    UA   926   K  07JAN  ORDBZN  739P  OK KLWUAX25        OPEN',
				'                                                               ',
				'FARE       USDIT TAX  250.00YQ  TAX   36.00US  TAX    5.50YC   ',
				'                 TAX    7.00XY  TAX    3.96XA  TAX   11.20AY   ',
				'                 TAX   99.80GB  TAX   55.20UB  TAX   18.00XF   ',
				'TOTAL       USDIT                                              ',
				'                                                               ',
				'BZN UA X/DEN UA X/CHI UA LON /IT  UA X/EWR UA X/CHI UA BZN /IT ',
				' IT /IT  END  IT1.00 XFBZN4.5DEN4.5EWR4.5ORD4.5                ',
				'                                                               ',
				'ENDORSEMENT/RESTRICTION:                                       ',
				'NONEND/REFRERTEINFOTHRUAGT/VLD AC/LH/LX/OS/SN/UA ONLY          ',
			]),
			{
				'header': {
					'recordLocator': 'PRIXAT',
					'ticketNumber': '0168659320915',
					'issueDate': {'raw': '04OCT17'},
					'pcc': '37AF',
				},
				'segments': [
					{'destinationAirport': 'DEN'},
					{'destinationAirport': 'ORD'},
					{'destinationAirport': 'LHR'},
					{'destinationAirport': 'EWR'},
					{'destinationAirport': 'ORD'},
					{'destinationAirport': 'BZN'},
				],
				'priceInfo': {
					'fare': {'currency': 'USD'},
				},
				'endorsementLines': ['NONEND/REFRERTEINFOTHRUAGT/VLD AC/LH/LX/OS/SN/UA ONLY'],
			},
		]);

		// error response example
		list.push([
			'DISPLAY ENTRY MUST BE MADE BY PSEUDO CITY OF ORIGINAL ETR-0022',
			{
				'error': 'GDS returned error of type no_agreement_exists',
				'errorType': 'no_agreement_exists',
			},
		]);

		list.push([
			'TICKET/DOCUMENT NOT FOUND IN AIRLINE DATABASE-0022',
			{
				'error': 'GDS returned error of type ticket_not_found',
				'errorType': 'ticket_not_found',
			},
		]);

		// No equiv fare currency
		list.push([
			php.implode(php.PHP_EOL, [
				'1ELECTRONIC TICKET RECORD                                       ',
				'INV:                  CUST:                          PNR:NLDERP',
				'TKT:3287166935911     ISSUED:12AUG18   PCC:6IIF   IATA:05578602',
				'NAME:ENGELHARD/EDITH MARGARITA                                 ',
				'NAME REF:                              TOUR ID:BT15DY05        ',
				'FOP: VIXXXXXXXXXXXX2927*XXXX /00749D S                         ',
				'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
				'1    DY   7077  C  18MAY  FCOOAK  355P  OK CDYBTJL5        OPEN',
				'                                                               ',
				'FARE       USDBT TAX   18.30US  TAX    5.65YC  TAX    7.00XY   ',
				'                 TAX    3.96XA  TAX    2.90EX  TAX   32.60IT   ',
				'                 TAX    3.70VT  TAX    8.70HB  TAX    1.00MJ   ',
				'TOTAL       USDBT               EQUIV FARE PD          BT      ',
				'                                                               ',
				'ENDORSEMENT/RESTRICTION:                                       ',
				'VALID ON DY/D8 ONLY                                            ',
			]),
			{
				'priceInfo': {
					'fare': {
						'currency': 'USD',
						'amount': null,
						'amountIndicator': 'BT',
						'taxes': {
							'US': '18.30',
							'YC': '5.65',
							// ...
						},
					},
					'total': {'currency': 'USD', 'amountIndicator': 'BT'},
					'equivalentFarePaid': {'amountIndicator': 'BT'},
				},
			},
		]);

		return list;
	}

	/**
	 * @test
	 * @dataProvider provideDumps
	 */
	testParser(dump, expectedResult) {
		let actualResult = SabreTicketParser.parse(dump);
		this.assertArrayElementsSubset(expectedResult, actualResult);
	}

	getTestMapping() {
		return [
			[this.provideDumps, this.testParser],
		];
	}
}

TicketMaskParserTest.count = 0;
module.exports = TicketMaskParserTest;
