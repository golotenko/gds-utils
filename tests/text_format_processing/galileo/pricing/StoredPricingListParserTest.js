const StoredPricingListParser = require('../../../../src/text_format_processing/galileo/pricing/StoredPricingListParser.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

class StoredPricingListParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js')
{
	provideTestCases()  {
		const list = [];

		// one PTC in one store
		list.push([
			php.implode(php.PHP_EOL, [
				'FQ1  - S1-2                                       13MAR18 WS/AG',
				'>FQP4*MIS                                                      ',
				' P4  LIBERMANE/STAS            MIS   G  14MAR18 *  USD  892.70 ',
			]),
			{
				'pricingList': [
					{
						'pricingNumber': '1',
						'segmentNumbers': [1,2],
						'addedDate': {'raw': '3MAR18','parsed': '2018-03-03'},
						'agentInitials': 'WS',
						'dutyCode': 'AG',
						'commandCopy': 'FQP4*MIS',
						'hasPrivateFaresSelectedMessage': false,
						'passengers': [
							{
								'passengerNumber': '4',
								'passengerName': 'LIBERMANE/STAS',
								'ptc': 'MIS',
								'guaranteeCode': 'G',
								'guaranteeDate': {'raw': '14MAR18','parsed': '2018-03-14'},
								'starMark': '*',
								'currency': 'USD',
								'amount': '892.70',
								'blockData': null,
							},
						],
					},
				],
			},
		]);

		// multiple PTC-s in multiple stores, also with "X" guarantee code (seems it means expired)
		list.push([
			php.implode(php.PHP_EOL, [
				'FQ1  - S1-2                                       13MAR18 WS/AG',
				'>FQP1*ITX.2*C03.3*INS                                          ',
				' P1  LIBERMANE/MARINA          ITX   X             USD  892.70 ',
				' P2  LIBERMANE/ZIMICH          C03   X             USD  689.70 ',
				' P3  LIBERMANE/LEPIN           INS   X             USD  689.70 ',
				'                                                               ',
				'FQ2  - S1-2                                       13MAR18 WS/AG',
				'>FQP4*MIS                                                      ',
				' P4  LIBERMANE/STAS            MIS   X             USD  892.70 ',
				'                                                               ',
				'FQ3  - S1-2                                       14MAR18 WS/AG',
				'>FQ                                                            ',
				' P1  LIBERMANE/MARINA          ADT   G  15MAR18 *  USD  893.70 ',
				' P4  LIBERMANE/STAS            ADT   G  15MAR18 *  USD  893.70 ',
				' P2  LIBERMANE/ZIMICH          INF   G  15MAR18 *  USD   81.00 ',
				' P3  LIBERMANE/LEPIN           INF   G  15MAR18 *  USD   81.00 ',
				'                                                               ',
				'FQ4  - S1-2                                       14MAR18 WS/AG',
				'>FQP1*ITX.2*C03.3*INS                                          ',
				' P1  LIBERMANE/MARINA          ITX   G  15MAR18 *  USD  893.70 ',
				' P2  LIBERMANE/ZIMICH          C03   G  15MAR18 *  USD  690.70 ',
				' P3  LIBERMANE/LEPIN           INS   G  15MAR18 *  USD  690.70 ',
			]),
			{
				'pricingList': [
					{
						'pricingNumber': '1',
						'segmentNumbers': [1,2],
						'addedDate': {'raw': '3MAR18','parsed': '2018-03-03'},
						'agentInitials': 'WS',
						'dutyCode': 'AG',
						'commandCopy': 'FQP1*ITX.2*C03.3*INS',
						'hasPrivateFaresSelectedMessage': false,
						'passengers': [
							{
								'passengerNumber': '1',
								'passengerName': 'LIBERMANE/MARINA',
								'ptc': 'ITX',
								'guaranteeCode': 'X',
								'guaranteeDate': null,
								'starMark': '',
								'currency': 'USD',
								'amount': '892.70',
								'blockData': null,
							},
							{
								'passengerNumber': '2',
								'passengerName': 'LIBERMANE/ZIMICH',
								'ptc': 'C03',
								'guaranteeCode': 'X',
								'guaranteeDate': null,
								'starMark': '',
								'currency': 'USD',
								'amount': '689.70',
								'blockData': null,
							},
							{
								'passengerNumber': '3',
								'passengerName': 'LIBERMANE/LEPIN',
								'ptc': 'INS',
								'guaranteeCode': 'X',
								'guaranteeDate': null,
								'starMark': '',
								'currency': 'USD',
								'amount': '689.70',
								'blockData': null,
							},
						],
					},
					{
						'pricingNumber': '2',
						'segmentNumbers': [1,2],
						'addedDate': {'raw': '3MAR18','parsed': '2018-03-03'},
						'agentInitials': 'WS',
						'dutyCode': 'AG',
						'commandCopy': 'FQP4*MIS',
						'passengers': [
							{
								'passengerNumber': '4',
								'passengerName': 'LIBERMANE/STAS',
								'ptc': 'MIS',
								'guaranteeCode': 'X',
								'guaranteeDate': null,
								'starMark': '',
								'currency': 'USD',
								'amount': '892.70',
								'blockData': null,
							},
						],
					},
					{
						'pricingNumber': '3',
						'segmentNumbers': [1,2],
						'addedDate': {'raw': '4MAR18','parsed': '2018-03-04'},
						'agentInitials': 'WS',
						'dutyCode': 'AG',
						'commandCopy': 'FQ',
						'passengers': [
							{
								'passengerNumber': '1',
								'passengerName': 'LIBERMANE/MARINA',
								'ptc': 'ADT',
								'guaranteeCode': 'G',
								'guaranteeDate': {'raw': '15MAR18','parsed': '2018-03-15'},
								'starMark': '*',
								'currency': 'USD',
								'amount': '893.70',
								'blockData': null,
							},
							{
								'passengerNumber': '4',
								'passengerName': 'LIBERMANE/STAS',
								'ptc': 'ADT',
								'guaranteeCode': 'G',
								'guaranteeDate': {'raw': '15MAR18','parsed': '2018-03-15'},
								'starMark': '*',
								'currency': 'USD',
								'amount': '893.70',
								'blockData': null,
							},
							{
								'passengerNumber': '2',
								'passengerName': 'LIBERMANE/ZIMICH',
								'ptc': 'INF',
								'guaranteeCode': 'G',
								'guaranteeDate': {'raw': '15MAR18','parsed': '2018-03-15'},
								'starMark': '*',
								'currency': 'USD',
								'amount': '81.00',
								'blockData': null,
							},
							{
								'passengerNumber': '3',
								'passengerName': 'LIBERMANE/LEPIN',
								'ptc': 'INF',
								'guaranteeCode': 'G',
								'guaranteeDate': {'raw': '15MAR18','parsed': '2018-03-15'},
								'starMark': '*',
								'currency': 'USD',
								'amount': '81.00',
								'blockData': null,
							},
						],
					},
					{
						'pricingNumber': '4',
						'segmentNumbers': [1,2],
						'addedDate': {'raw': '4MAR18','parsed': '2018-03-04'},
						'agentInitials': 'WS',
						'dutyCode': 'AG',
						'commandCopy': 'FQP1*ITX.2*C03.3*INS',
						'passengers': [
							{
								'passengerNumber': '1',
								'passengerName': 'LIBERMANE/MARINA',
								'ptc': 'ITX',
								'guaranteeCode': 'G',
								'guaranteeDate': {'raw': '15MAR18','parsed': '2018-03-15'},
								'starMark': '*',
								'currency': 'USD',
								'amount': '893.70',
								'blockData': null,
							},
							{
								'passengerNumber': '2',
								'passengerName': 'LIBERMANE/ZIMICH',
								'ptc': 'C03',
								'guaranteeCode': 'G',
								'guaranteeDate': {'raw': '15MAR18','parsed': '2018-03-15'},
								'starMark': '*',
								'currency': 'USD',
								'amount': '690.70',
								'blockData': null,
							},
							{
								'passengerNumber': '3',
								'passengerName': 'LIBERMANE/LEPIN',
								'ptc': 'INS',
								'guaranteeCode': 'G',
								'guaranteeDate': {'raw': '15MAR18','parsed': '2018-03-15'},
								'starMark': '*',
								'currency': 'USD',
								'amount': '690.70',
								'blockData': null,
							},
						],
					},
				],
			},
		]);

		// >*FFALL; output - with full data below each row
		list.push([
			php.implode(php.PHP_EOL, [
				'FQ1  - S1-2                                       13MAR18 WS/AG',
				'>FQP4*MIS                                                      ',
				' P4  LIBERMANE/STAS            MIS   X             USD  892.70 ',
				' KIV PS X/IEV PS RIX 781.38 NUC781.38END ROE0.844659           ',
				' FARE EUR660.00 EQU USD812.00 TAX 3.10JQ TAX 11.10MD           ',
				' TAX 7.60WW TAX 4.00UA TAX 8.50YK TAX 18.00YQ TAX 28.40YR      ',
				' TOT USD892.70                                                 ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO1;            ',
				' S1   FB-C1EP4                                                 ',
				'      BG-2PC                                                   ',
				' S2   FB-C1EP4                                                 ',
				'      BG-2PC                                                   ',
				' NONEND/RES RSTR/RBK FOC                                       ',
				' LAST DATE TO PURCHASE TICKET: 10MAY18                         ',
				' T P4/S1-2/CPS/ET/TA711M                                       ',
				'                                                               ',
				'FQ2  - S1-2                                       14MAR18 WS/AG',
				'>FQP1*ITX.2*C03.3*INS                                          ',
				' P1  LIBERMANE/MARINA          ITX   G  15MAR18 *  USD  893.70 ',
				' KIV PS X/IEV PS RIX 781.38 NUC781.38END ROE0.844659           ',
				' FARE EUR660.00 EQU USD813.00 TAX 3.10JQ TAX 11.10MD           ',
				' TAX 7.60WW TAX 4.00UA TAX 8.50YK TAX 18.00YQ TAX 28.40YR      ',
				' TOT USD893.70                                                 ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO2;            ',
				' S1   FB-C1EP4                                                 ',
				'      BG-2PC                                                   ',
				' S2   FB-C1EP4                                                 ',
				'      BG-2PC                                                   ',
				' NONEND/RES RSTR/RBK FOC                                       ',
				' LAST DATE TO PURCHASE TICKET: 10MAY18                         ',
				' P2  LIBERMANE/ZIMICH          C03   G  15MAR18 *  USD  690.70 ',
				' KIV PS X/IEV PS RIX 586.03 NUC586.03END ROE0.844659           ',
				' FARE EUR495.00 EQU USD610.00 TAX 3.10JQ TAX 11.10MD           ',
				' TAX 7.60WW TAX 4.00UA TAX 8.50YK TAX 18.00YQ TAX 28.40YR      ',
				' TOT USD690.70                                                 ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO2;            ',
				' S1   FB-C1EP4/CH25                                            ',
				'      BG-2PC                                                   ',
				' S2   FB-C1EP4/CH25                                            ',
				'      BG-2PC                                                   ',
				' NONEND/RES RSTR/RBK FOC                                       ',
				' LAST DATE TO PURCHASE TICKET: 10MAY18                         ',
				' P3  LIBERMANE/LEPIN           INS   G  15MAR18 *  USD  690.70 ',
				' KIV PS X/IEV PS RIX 586.03 NUC586.03END ROE0.844659           ',
				' FARE EUR495.00 EQU USD610.00 TAX 3.10JQ TAX 11.10MD           ',
				' TAX 7.60WW TAX 4.00UA TAX 8.50YK TAX 18.00YQ TAX 28.40YR      ',
				' TOT USD690.70                                                 ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO2;            ',
				' S1   FB-C1EP4/IN25                                            ',
				'      BG-2PC                                                   ',
				' S2   FB-C1EP4/IN25                                            ',
				'      BG-2PC                                                   ',
				' NONEND/RES RSTR/RBK FOC                                       ',
				' LAST DATE TO PURCHASE TICKET: 10MAY18                         ',
				' T P1-3/S1-2/CPS/ET/TA711M                                     ',
			]),
			{
				'pricingList': [
					{
						'pricingNumber': '1',
						'segmentNumbers': [1,2],
						'addedDate': {'raw': '3MAR18','parsed': '2018-03-03'},
						'agentInitials': 'WS',
						'dutyCode': 'AG',
						'commandCopy': 'FQP4*MIS',
						'hasPrivateFaresSelectedMessage': false,
						'passengers': [
							{
								'passengerNumber': '4',
								'passengerName': 'LIBERMANE/STAS',
								'ptc': 'MIS',
								'guaranteeCode': 'X',
								'guaranteeDate': null,
								'starMark': '',
								'currency': 'USD',
								'amount': '892.70',
								'blockData': {
									'fareConstruction': {
										'segments': [
											{'destination': 'IEV'},
											{'destination': 'RIX', 'fare': '781.38'},
										],
										'currency': 'NUC',
										'fare': '781.38',
									},
									'baseFare': {'currency': 'EUR','amount': '660.00'},
									'fareEquivalent': {'currency': 'USD','amount': '812.00'},
									'taxes': [
										{'taxCode': 'JQ','amount': '3.10'},
										{'taxCode': 'MD','amount': '11.10'},
										{'taxCode': 'WW','amount': '7.60'},
										{'taxCode': 'UA','amount': '4.00'},
										{'taxCode': 'YK','amount': '8.50'},
										{'taxCode': 'YQ','amount': '18.00'},
										{'taxCode': 'YR','amount': '28.40'},
									],
									'netPrice': {'currency': 'USD','amount': '892.70'},
									'segments': [
										{
											'segmentNumber': '1',
											'values': [
												{'code': 'FB','raw': 'C1EP4'},
												{'code': 'BG','raw': '2PC'},
											],
										},
										{
											'segmentNumber': '2',
											'values': [
												{'code': 'FB','raw': 'C1EP4'},
												{'code': 'BG','raw': '2PC'},
											],
										},
									],
									'endorsementBoxLines': [
										'NONEND/RES RSTR/RBK FOC                                       ',
									],
									'lastDateToPurchase': {'raw': '10MAY18','parsed': '2018-05-10'},
								},
							},
						],
						'footerData': {
							'normalizedPricingModifiers': [
								{'raw': 'P4', 'type': 'passengers'},
								{'raw': 'S1-2', 'type': 'segments'},
								{'raw': 'CPS', 'type': 'validatingCarrier'},
								{'raw': 'ET', 'type': 'areElectronicTickets'},
								{'raw': 'TA711M', 'type': 'ticketingAgencyPcc'},
							],
						},
					},
					{
						'pricingNumber': '2',
						'segmentNumbers': [1,2],
						'addedDate': {'raw': '4MAR18','parsed': '2018-03-04'},
						'agentInitials': 'WS',
						'dutyCode': 'AG',
						'commandCopy': 'FQP1*ITX.2*C03.3*INS',
						'passengers': [
							{
								'passengerNumber': '1',
								'passengerName': 'LIBERMANE/MARINA',
								'ptc': 'ITX',
								'guaranteeCode': 'G',
								'guaranteeDate': {'raw': '15MAR18','parsed': '2018-03-15'},
								'starMark': '*',
								'currency': 'USD',
								'amount': '893.70',
								'blockData': {
									'fareConstruction': {
										'segments': [
											{'destination': 'IEV'},
											{'destination': 'RIX', 'fare': '781.38'},
										],
									},
									'baseFare': {'currency': 'EUR','amount': '660.00'},
									'fareEquivalent': {'currency': 'USD','amount': '813.00'},
									'lastDateToPurchase': {'raw': '10MAY18','parsed': '2018-05-10'},
								},
							},
							{
								'passengerNumber': '2',
								'passengerName': 'LIBERMANE/ZIMICH',
								'ptc': 'C03',
								'guaranteeCode': 'G',
								'guaranteeDate': {'raw': '15MAR18','parsed': '2018-03-15'},
								'starMark': '*',
								'currency': 'USD',
								'amount': '690.70',
								'blockData': {
									'fareConstruction': {
										'segments': [
											{'destination': 'IEV'},
											{'destination': 'RIX', 'fare': '586.03'},
										],
										'fare': '586.03',
									},
									'baseFare': {'currency': 'EUR','amount': '495.00'},
									'fareEquivalent': {'currency': 'USD','amount': '610.00'},
									'netPrice': {'currency': 'USD','amount': '690.70'},
									'segments': [
										{
											'segmentNumber': '1',
											'values': [
												{'code': 'FB','raw': 'C1EP4/CH25'},
												{'code': 'BG','raw': '2PC'},
											],
										},
										{
											'segmentNumber': '2',
											'values': [
												{'code': 'FB','raw': 'C1EP4/CH25'},
												{'code': 'BG','raw': '2PC'},
											],
										},
									],
									'endorsementBoxLines': [
										'NONEND/RES RSTR/RBK FOC                                       ',
									],
									'lastDateToPurchase': {'raw': '10MAY18','parsed': '2018-05-10'},
								},
							},
							{
								'passengerNumber': '3',
								'passengerName': 'LIBERMANE/LEPIN',
								'ptc': 'INS',
								'guaranteeCode': 'G',
								'guaranteeDate': {'raw': '15MAR18','parsed': '2018-03-15'},
								'starMark': '*',
								'currency': 'USD',
								'amount': '690.70',
								'blockData': {
									'fareConstruction': {
										'segments': [
											{'destination': 'IEV'},
											{'destination': 'RIX', 'fare': '586.03'},
										],
									},
									'baseFare': {'currency': 'EUR','amount': '495.00'},
									'fareEquivalent': {'currency': 'USD','amount': '610.00'},
									'netPrice': {'currency': 'USD','amount': '690.70'},
									'lastDateToPurchase': {'raw': '10MAY18','parsed': '2018-05-10'},
								},
							},
						],
						'footerData': {
							'normalizedPricingModifiers': [
								{'raw': 'P1-3', 'type': 'passengers'},
								{'raw': 'S1-2', 'type': 'segments'},
								{'raw': 'CPS', 'type': 'validatingCarrier'},
								{'raw': 'ET', 'type': 'areElectronicTickets'},
								{'raw': 'TA711M', 'type': 'ticketingAgencyPcc'},
							],
						},
					},
				],
			},
		]);

		// >*FFALL; round-trip example, with 'NB-20SEP    NA-20SEP'
		// with two endorsement lines
		// paxes with same pricing (P1, P4) are grouped
		list.push([
			php.implode(php.PHP_EOL, [
				'FQ1  - S1-4                                       14MAR18 WS/AG',
				'>FQBB                                                          ',
				' P1  LIBERMANE/MARINA          ADT   G  15MAR18 *  USD 1558.00 ',
				' P4  LIBERMANE/STAS            ADT   G  15MAR18 *  USD 1558.00 ',
				' LON AF X/PAR AF TYO 732.94 AF X/PAR AF LON 350.01 NUC1082.95EN',
				' D ROE0.744255                                                 ',
				' FARE GBP806.00 EQU USD1119.00 TAX 108.30GB TAX 26.80UB        ',
				' TAX 20.00FR TAX 37.40QX TAX 4.90OI TAX 19.60SW TAX 222.00YR   ',
				' TOT USD1558.00                                                ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO1;            ',
				' S1   FB-ULSFGB                                                ',
				'      BG-1PC  NB-10SEP    NA-10SEP                             ',
				' S2   FB-ULSFGB                                                ',
				'      BG-1PC  NB-10SEP    NA-10SEP                             ',
				' S3   FB-TLSFGB                                                ',
				'      BG-1PC  NB-20SEP    NA-20SEP                             ',
				' S4   FB-TLSFGB                                                ',
				'      BG-1PC  NB-20SEP    NA-20SEP                             ',
				' NON ENDO/                                                     ',
				' FARE RSTR COULD APPLY                                         ',
				' LAST DATE TO PURCHASE TICKET: 10SEP18                         ',
				' P2  LIBERMANE/ZIMICH          INF   G  15MAR18 *  USD  138.80 ',
				' P3  LIBERMANE/LEPIN           INF   G  15MAR18 *  USD  138.80 ',
				' LON AF X/PAR AF TYO 73.29 AF X/PAR AF LON 35.00 NUC108.29END R',
				' OE0.744255                                                    ',
				' FARE GBP81.00 EQU USD112.00 TAX 26.80UB TOT USD138.80         ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO1;            ',
				' S1   FB-ULSFGB/IN90                                           ',
				'      BG-1PC  NB-10SEP    NA-10SEP                             ',
				' S2   FB-ULSFGB/IN90                                           ',
				'      BG-1PC  NB-10SEP    NA-10SEP                             ',
				' S3   FB-TLSFGB/IN90                                           ',
				'      BG-1PC  NB-20SEP    NA-20SEP                             ',
				' S4   FB-TLSFGB/IN90                                           ',
				'      BG-1PC  NB-20SEP    NA-20SEP                             ',
				' NON ENDO/                                                     ',
				' FARE RSTR COULD APPLY                                         ',
				' LAST DATE TO PURCHASE TICKET: 10SEP18                         ',
				' T P1-4/S1-4/CAF/ET/TA711M                                     ',
				'                                                               ',
				'FQ2  - S1-4                                       14MAR18 WS/AG',
				'>FQP4*C05                                                      ',
				' P4  LIBERMANE/STAS            C05   G  15MAR18 *  USD 1159.00 ',
				' LON AF X/PAR AF TYO 549.71 AF X/PAR AF LON 262.51 NUC812.22END',
				'  ROE0.744255                                                  ',
				' FARE GBP604.00 EQU USD838.00 TAX 26.80UB TAX 20.00FR          ',
				' TAX 37.40QX TAX 4.90OI TAX 9.90SW TAX 222.00YR                ',
				' TOT USD1159.00                                                ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO2;            ',
				' S1   FB-ULSFGB/CH25                                           ',
				'      BG-1PC  NB-10SEP    NA-10SEP                             ',
				' S2   FB-ULSFGB/CH25                                           ',
				'      BG-1PC  NB-10SEP    NA-10SEP                             ',
				' S3   FB-TLSFGB/CH25                                           ',
				'      BG-1PC  NB-20SEP    NA-20SEP                             ',
				' S4   FB-TLSFGB/CH25                                           ',
				'      BG-1PC  NB-20SEP    NA-20SEP                             ',
				' NON ENDO/                                                     ',
				' FARE RSTR COULD APPLY                                         ',
				' LAST DATE TO PURCHASE TICKET: 10SEP18                         ',
				' T P4/S1-4/CAF/ET/TA711M                                       ',
			]),
			{
				'pricingList': [
					{
						'pricingNumber': '1',
						'segmentNumbers': [1,2,3,4],
						'hasPrivateFaresSelectedMessage': false,
						'passengers': [
							{
								'passengerNumber': '1',
								'passengerName': 'LIBERMANE/MARINA',
								'ptc': 'ADT',
								'blockData': null,
							},
							{
								'passengerNumber': '4',
								'passengerName': 'LIBERMANE/STAS',
								'ptc': 'ADT',
								'blockData': {
									'fareConstruction': {
										'segments': [
											{'destination': 'PAR'},
											{'destination': 'TYO', 'fare': '732.94'},
											{'destination': 'PAR'},
											{'destination': 'LON', 'fare': '350.01'},
										],
									},
									'baseFare': {'currency': 'GBP','amount': '806.00'},
									'fareEquivalent': {'currency': 'USD','amount': '1119.00'},
									'netPrice': {'currency': 'USD','amount': '1558.00'},
									'segments': [
										{'segmentNumber': '1',
											'values': [
												{'code': 'FB','raw': 'ULSFGB'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '10SEP'},
												{'code': 'NA','raw': '10SEP'},
											],
										},
										{
											'segmentNumber': '2',
											'values': [
												{'code': 'FB','raw': 'ULSFGB'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '10SEP'},
												{'code': 'NA','raw': '10SEP'},
											],
										},
										{
											'segmentNumber': '3',
											'values': [
												{'code': 'FB','raw': 'TLSFGB'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '20SEP'},
												{'code': 'NA','raw': '20SEP'},
											],
										},
										{
											'segmentNumber': '4',
											'values': [
												{'code': 'FB','raw': 'TLSFGB'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '20SEP'},
												{'code': 'NA','raw': '20SEP'},
											],
										},
									],
									'endorsementBoxLines': [
										'NON ENDO/                                                     ',
										'FARE RSTR COULD APPLY                                         ',
									],
									'lastDateToPurchase': {'raw': '10SEP18','parsed': '2018-09-10'},
								},
							},
							{
								'passengerNumber': '2',
								'passengerName': 'LIBERMANE/ZIMICH',
								'ptc': 'INF',
								'blockData': null,
							},
							{
								'passengerNumber': '3',
								'passengerName': 'LIBERMANE/LEPIN',
								'ptc': 'INF',
								'blockData': {
									'fareConstruction': {
										'segments': [
											{'destination': 'PAR'},
											{'destination': 'TYO', 'fare': '73.29'},
											{'destination': 'PAR'},
											{'destination': 'LON', 'fare': '35.00'},
										],
									},
									'baseFare': {'currency': 'GBP','amount': '81.00'},
									'fareEquivalent': {'currency': 'USD','amount': '112.00'},
									'taxes': [{'taxCode': 'UB','amount': '26.80'}],
									'netPrice': {'currency': 'USD','amount': '138.80'},
									'segments': [
										{'segmentNumber': '1'},
										{'segmentNumber': '2'},
										{'segmentNumber': '3'},
										{'segmentNumber': '4'},
									],
									'endorsementBoxLines': [
										'NON ENDO/                                                     ',
										'FARE RSTR COULD APPLY                                         ',
									],
									'lastDateToPurchase': {'raw': '10SEP18','parsed': '2018-09-10'},
								},
							},
						],
						'footerData': {
							'normalizedPricingModifiers': [
								{'raw': 'P1-4', 'type': 'passengers'},
								{'raw': 'S1-4', 'type': 'segments'},
								{'raw': 'CAF', 'type': 'validatingCarrier'},
								{'raw': 'ET', 'type': 'areElectronicTickets'},
								{'raw': 'TA711M', 'type': 'ticketingAgencyPcc'},
							],
						},
					},
					{
						'pricingNumber': '2',
						'segmentNumbers': [1,2,3,4],
						'passengers': [
							{
								'passengerNumber': '4',
								'passengerName': 'LIBERMANE/STAS',
								'ptc': 'C05',
								'blockData': {
									'fareConstruction': {
										'segments': [
											{'destination': 'PAR'},
											{'destination': 'TYO', 'fare': '549.71'},
											{'destination': 'PAR'},
											{'destination': 'LON', 'fare': '262.51'},
										],
									},
									'baseFare': {'currency': 'GBP','amount': '604.00'},
									'fareEquivalent': {'currency': 'USD','amount': '838.00'},
									'netPrice': {'currency': 'USD','amount': '1159.00'},
									'segments': [
										{'segmentNumber': '1'},
										{'segmentNumber': '2'},
										{'segmentNumber': '3'},
										{'segmentNumber': '4'},
									],
									'endorsementBoxLines': [
										'NON ENDO/                                                     ',
										'FARE RSTR COULD APPLY                                         ',
									],
									'lastDateToPurchase': {'raw': '10SEP18','parsed': '2018-09-10'},
								},
							},
						],
						'footerData': {
							'normalizedPricingModifiers': [
								{'raw': 'P4', 'type': 'passengers'},
								{'raw': 'S1-4', 'type': 'segments'},
								{'raw': 'CAF', 'type': 'validatingCarrier'},
								{'raw': 'ET', 'type': 'areElectronicTickets'},
								{'raw': 'TA711M', 'type': 'ticketingAgencyPcc'},
							],
						},
					},
				],
			},
		]);

		// >*8PG6RQ;
		// private fare example
		list.push([
			php.implode(php.PHP_EOL, [
				'FQ1  - S1-4                                       05APR18 WS/AG',
				'>FQ                                                            ',
				' CAT35                                                         ',
				' *** NET TICKET DATA EXISTS ***  >*NTD1;                       ',
				' P1  LIBERMANE/MARINA          ADT   P             USD 3763.41 ',
				' NBO AT X/CAS AT NYC 1618.21 AT X/CAS AT NBO 1618.21 NUC3236.42',
				'  -----  MUST PRICE AS B/N - ----END ROE1.0   XF 4.50JFK 4.5   ',
				' FARE USD3236.00 TAX 5.60AY TAX 36.60US TAX 3.96XA TAX 4.50XF  ',
				' TAX 7.00XY TAX 5.65YC TAX 50.00TU TAX 46.10MA TAX 368.00YQ    ',
				' TOT USD3763.41                                                ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO1;            ',
				' S1   FB-DA0R0KEA/ITN06JW535                                   ',
				'      BG-3PC              NA-20MAR                             ',
				' S2   FB-DA0R0KEA/ITN06JW535                                   ',
				'      BG-3PC              NA-20MAR                             ',
				' S3   FB-DA0R0KEA/ITN06JW535                                   ',
				'      BG-3PC              NA-20MAR                             ',
				' S4   FB-DA0R0KEA/ITN06JW535                                   ',
				'      BG-3PC              NA-20MAR                             ',
				' NET PRICE MUST BE PUB                                         ',
				' PAYMENT/ CK VI CA AX                                          ',
				' TOUR CODE - N/A                                               ',
				' ITN06JW535 - ITN6                                             ',
				' LAST DATE TO PURCHASE TICKET: 20SEP18                         ',
				' T S1-4/CAT/ET/TA711M                                          ',
			]),
			{
				'pricingList': [
					{
						'segmentNumbers': [1,2,3,4],
						'hasPrivateFaresSelectedMessage': true,
						'passengers': [
							{
								'passengerName': 'LIBERMANE/MARINA',
								'blockData': {
									'fareConstruction': {
										'segments': [
											{'destination': 'CAS'},
											{'destination': 'NYC', 'fare': '1618.21'},
											{'destination': 'CAS'},
											{'destination': 'NBO', 'fare': '1618.21'},
										],
										'fare': '3236.42',
										'hasEndMark': true,
										'rateOfExchange': '1.0',
									},
									'segments': [
										{
											'segmentNumber': '1',
											'values': [
												{'code': 'FB', 'raw': 'DA0R0KEA/ITN06JW535'},
												{'code': 'BG', 'raw': '3PC'},
												{'code': 'NA', 'raw': '20MAR'},
											],
										},
										{
											'segmentNumber': '2',
											'values': [
												{'code': 'FB', 'raw': 'DA0R0KEA/ITN06JW535'},
												{'code': 'BG', 'raw': '3PC'},
												{'code': 'NA', 'raw': '20MAR'},
											],
										},
										{
											'segmentNumber': '3',
											'values': [
												{'code': 'FB', 'raw': 'DA0R0KEA/ITN06JW535'},
												{'code': 'BG', 'raw': '3PC'},
												{'code': 'NA', 'raw': '20MAR'},
											],
										},
										{
											'segmentNumber': '4',
											'values': [
												{'code': 'FB', 'raw': 'DA0R0KEA/ITN06JW535'},
												{'code': 'BG', 'raw': '3PC'},
												{'code': 'NA', 'raw': '20MAR'},
											],
										},
									],
									'lastDateToPurchase': {'parsed': '2018-09-20'},
								},
							},
						],
						'footerData': {
							'normalizedPricingModifiers': [
								{'raw': 'S1-4', 'type': 'segments'},
								{'raw': 'CAT', 'type': 'validatingCarrier'},
								{'raw': 'ET', 'type': 'areElectronicTickets'},
								{'raw': 'TA711M', 'type': 'ticketingAgencyPcc'},
							],
						},
					},
				],
			},
		]);

		// >*WTC638;
		// FC wrapped on 63-th character: 6 35.00 -> 635.00. I guess we should
		// remove line breaks to parse Galileo FC correctly
		list.push([
			php.implode(php.PHP_EOL, [
				'FQ1  - S1-6                                       18MAY18 WS/AG',
				'>FQP1*ADT.2*INF                                                ',
				' P1  WALTERS/JESSICA           ADT   G  19MAY18 *  USD 2099.61 ',
				' STL UA X/CHI LH X/FRA LH NBO 635.00 LX X/ZRH LX X/CHI UA STL 6',
				' 35.00 NUC1270.00END ROE1.0   XF 13.50STL 4.5ORD 4.5ORD 4.5    ',
				' FARE USD1270.00 TAX 11.20AY TAX 36.60US TAX 3.96XA            ',
				' TAX 13.50XF TAX 7.00XY TAX 5.65YC TAX 10.60DE TAX 25.10RA     ',
				' TAX 50.00TU TAX 16.00CH TAX 650.00YQ TOT USD2099.61           ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO1;            ',
				' S1   FB-SK06RCE                                               ',
				'      BG-2PC  NB-15SEP    NA-15SEP                             ',
				' S2   FB-SK06RCE                                               ',
				'      BG-2PC  NB-15SEP    NA-15SEP                             ',
				' S3   FB-SK06RCE                                               ',
				'      BG-2PC  NB-16SEP    NA-16SEP                             ',
				' S4   FB-SK06RCE                                               ',
				'      BG-2PC  NB-01OCT    NA-01OCT                             ',
				' S5   FB-SK06RCE                                               ',
				'      BG-2PC  NB-02OCT    NA-02OCT                             ',
				' S6   FB-SK06RCE                                               ',
				'      BG-2PC  NB-02OCT    NA-02OCT                             ',
				' -REFUNDABLE/CXLFEE/CHGFEE                                     ',
				' LAST DATE TO PURCHASE TICKET: 21MAY18                         ',
				' P2  WALTERS/PATRICK           INF   G  19MAY18 *  USD  191.41 ',
				' STL UA X/CHI LH X/FRA LH NBO 63.50 LX X/ZRH LX X/CHI UA STL 63',
				' .50 NUC127.00END ROE1.0                                       ',
				' FARE USD127.00 TAX 11.20AY TAX 36.60US TAX 3.96XA TAX 7.00XY  ',
				' TAX 5.65YC TOT USD191.41                                      ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO1;            ',
				' S1   FB-SK06RCE/IN90                                          ',
				'      BG-1PC  NB-15SEP    NA-15SEP                             ',
				' S2   FB-SK06RCE/IN90                                          ',
				'      BG-1PC  NB-15SEP    NA-15SEP                             ',
				' S3   FB-SK06RCE/IN90                                          ',
				'      BG-1PC  NB-16SEP    NA-16SEP                             ',
				' S4   FB-SK06RCE/IN90                                          ',
				'      BG-1PC  NB-01OCT    NA-01OCT                             ',
				' S5   FB-SK06RCE/IN90                                          ',
				'      BG-1PC  NB-02OCT    NA-02OCT                             ',
				' S6   FB-SK06RCE/IN90                                          ',
				'      BG-1PC  NB-02OCT    NA-02OCT                             ',
				' -REFUNDABLE/CXLFEE/CHGFEE                                     ',
				' LAST DATE TO PURCHASE TICKET: 21MAY18                         ',
				' T P1-2/S1-6/CUA/ET/TA711M                                     ',
				'',
			]),
			{
				'pricingList': [
					{
						'pricingNumber': '1',
						'segmentNumbers': [1,2,3,4,5,6],
						'commandCopy': 'FQP1*ADT.2*INF',
						'hasPrivateFaresSelectedMessage': false,
						'passengers': [
							{
								'passengerName': 'WALTERS/JESSICA',
								'ptc': 'ADT',
								'blockData': {
									'fareConstruction': {
										'segments': [
											{'airline': 'UA', 'destination': 'CHI'},
											{'airline': 'LH', 'destination': 'FRA'},
											{'airline': 'LH', 'destination': 'NBO', 'fare': '635.00'},
											{'airline': 'LX', 'destination': 'ZRH'},
											{'airline': 'LX', 'destination': 'CHI'},
											{'airline': 'UA', 'destination': 'STL', 'fare': '635.00'},
										],
										'currency': 'NUC',
										'fare': '1270.00',
										'hasEndMark': true,
										'rateOfExchange': '1.0',
									},
									'baseFare': {'currency': 'USD','amount': '1270.00'},
									'netPrice': {'currency': 'USD','amount': '2099.61'},
									'endorsementBoxLines': [
										'-REFUNDABLE/CXLFEE/CHGFEE                                     ',
									],
									'lastDateToPurchase': {'raw': '21MAY18','parsed': '2018-05-21'},
								},
							},
							{
								'passengerName': 'WALTERS/PATRICK',
								'ptc': 'INF',
								'blockData': {
									'fareConstruction': {
										'segments': [
											{'airline': 'UA', 'destination': 'CHI'},
											{'airline': 'LH', 'destination': 'FRA'},
											{'airline': 'LH', 'destination': 'NBO', 'fare': '63.50'},
											{'airline': 'LX', 'destination': 'ZRH'},
											{'airline': 'LX', 'destination': 'CHI'},
											{'airline': 'UA', 'destination': 'STL', 'fare': '63.50'},
										],
										'currency': 'NUC',
										'fare': '127.00',
										'hasEndMark': true,
										'rateOfExchange': '1.0',
									},
									'baseFare': {'currency': 'USD','amount': '127.00'},
									'netPrice': {'currency': 'USD','amount': '191.41'},
									'endorsementBoxLines': [
										'-REFUNDABLE/CXLFEE/CHGFEE                                     ',
									],
									'lastDateToPurchase': {'raw': '21MAY18','parsed': '2018-05-21'},
								},
							},
						],
						'footerData': {
							'normalizedPricingModifiers': [
								{'raw': 'P1-2', 'type': 'passengers'},
								{'raw': 'S1-6', 'type': 'segments'},
								{'raw': 'CUA','type': 'validatingCarrier'},
								{'raw': 'ET', 'type': 'areElectronicTickets'},
								{'raw': 'TA711M', 'type': 'ticketingAgencyPcc'},
							],
						},
					},
				],
			},
		]);

		// >*ZNV2XO;
		// pax is so wide that PTC does not fit on same line
		// also with ACCT-TPACK between segments
		list.push([
			php.implode(php.PHP_EOL, [
				'FQ1  - S1-6                                       18JUN18 WS/AG',
				'>FQ:P/P1-TPACK/TA0GF*ITX                                       ',
				' CAT35                                                         ',
				' *** NET TICKET DATA EXISTS ***  >*NTD1;                       ',
				' P1  WIECKOWSKA/MARISAALICESTINECONNOR                         ',
				'                               ITX   Z  19JUN18 *  GBP 1110.21 ',
				' LON AA E/NYC//ATL AA X/MIA AA SXM M544.01 AA X/E/MIA AA X/BOS ',
				' AA LON M378.71 NUC922.72END ROE0.738027   XF 3.40BOS 4.5      ',
				' FARE GBP681.00 TAX 78.00GB TAX 44.91UB TAX 8.40AY TAX 27.40US ',
				' TAX 6.00XA TAX 3.40XF TAX 10.40XY TAX 8.40YC TAX 8.20FG       ',
				' TAX 27.00FH TAX 4.10IW TAX 203.00YR TOT GBP1110.21            ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO1;            ',
				' S1   FB-LHN0MMN1U/GBT5                                        ',
				'      BG-1PC  NB-21JUL    NA-21JUL                             ',
				' ACCT-TPACK                                     ',
				' S2   FB-LHN0MMN1U/GBT5                                        ',
				'      BG-1PC  NB-31JUL    NA-31JUL                             ',
				' ACCT-TPACK                                     ',
				' S3   FB-LHN0MMN1U/GBT5                                        ',
				'      BG-1PC  NB-31JUL    NA-31JUL                             ',
				' ACCT-TPACK                                     ',
				' S4   FB-SHN0MMN1U/GBT5                                        ',
				'      BG-1PC  NB-21AUG    NA-21AUG                             ',
				' ACCT-TPACK                                     ',
				' S5   FB-SHN0MMN1U/GBT5                                        ',
				'      BG-1PC  NB-21AUG    NA-21AUG                             ',
				' ACCT-TPACK                                     ',
				' S6   FB-SHN0MMN1U/GBT5                                        ',
				'      BG-1PC  NB-22AUG    NA-22AUG                             ',
				' ACCT-TPACK                                     ',
				' VALIDAABAIBNONENDNONTRANS                                     ',
				' CHGFEEAPPLIES                                                 ',
				' LAST DATE TO PURCHASE TICKET: 23JUN18                         ',
				' T P1/S1-6/CAA/ET/NOCC/TA0GF                                   ',
				'                                                               ',
				'FQ2  - S1-6                                       18JUN18 WS/AG',
				'>FQ:P/P2-TPACK/TA0GF*ITX                                       ',
				' CAT35                                                         ',
				' *** NET TICKET DATA EXISTS ***  >*NTD2;                       ',
				' P2  LESLIE/AMARAITALIACONNOR  ITX   Z  19JUN18 *  GBP 1110.21 ',
				' LON AA E/NYC//ATL AA X/MIA AA SXM M544.01 AA X/E/MIA AA X/BOS ',
				' AA LON M378.71 NUC922.72END ROE0.738027   XF 3.40BOS 4.5      ',
				' FARE GBP681.00 TAX 78.00GB TAX 44.91UB TAX 8.40AY TAX 27.40US ',
				' TAX 6.00XA TAX 3.40XF TAX 10.40XY TAX 8.40YC TAX 8.20FG       ',
				' TAX 27.00FH TAX 4.10IW TAX 203.00YR TOT GBP1110.21            ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO2;            ',
				' S1   FB-LHN0MMN1U/GBT5                                        ',
				'      BG-1PC  NB-21JUL    NA-21JUL                             ',
				' ACCT-TPACK                                     ',
				' S2   FB-LHN0MMN1U/GBT5                                        ',
				'      BG-1PC  NB-31JUL    NA-31JUL                             ',
				' ACCT-TPACK                                     ',
				' S3   FB-LHN0MMN1U/GBT5                                        ',
				'      BG-1PC  NB-31JUL    NA-31JUL                             ',
				' ACCT-TPACK                                     ',
				' S4   FB-SHN0MMN1U/GBT5                                        ',
				'      BG-1PC  NB-21AUG    NA-21AUG                             ',
				' ACCT-TPACK                                     ',
				' S5   FB-SHN0MMN1U/GBT5                                        ',
				'      BG-1PC  NB-21AUG    NA-21AUG                             ',
				' ACCT-TPACK                                     ',
				' S6   FB-SHN0MMN1U/GBT5                                        ',
				'      BG-1PC  NB-22AUG    NA-22AUG                             ',
				' ACCT-TPACK                                     ',
				' VALIDAABAIBNONENDNONTRANS                                     ',
				' CHGFEEAPPLIES                                                 ',
				' LAST DATE TO PURCHASE TICKET: 23JUN18                         ',
				' T P2/S1-6/CAA/ET/NOCC/TA0GF                                   ',
			]),
			{
				'pricingList': [
					{
						'pricingNumber': '1',
						'segmentNumbers': [1,2,3,4,5,6],
						'addedDate': {'raw': '8JUN18','parsed': '2018-06-08'},
						'commandCopy': 'FQ:P/P1-TPACK/TA0GF*ITX',
						'hasPrivateFaresSelectedMessage': true,
						'passengers': [
							{
								'passengerNumber': '1',
								'passengerName': 'WIECKOWSKA/MARISAALICESTINECONNOR',
								'ptc': 'ITX',
								'guaranteeCode': 'Z',
								'guaranteeDate': {'raw': '19JUN18','parsed': '2018-06-19'},
								'starMark': '*',
								'currency': 'GBP',
								'amount': '1110.21',
								'blockData': {
									'fareConstruction': {
										'segments': [
											{'airline': 'AA', 'destination': 'NYC'},
											{'airline': 'AA', 'destination': 'MIA'},
											{'airline': 'AA', 'destination': 'SXM', 'fare': '544.01'},
											{'airline': 'AA', 'destination': 'MIA'},
											{'airline': 'AA', 'destination': 'BOS'},
											{'airline': 'AA', 'destination': 'LON', 'fare': '378.71'},
										],
										'fare': '922.72',
										'rateOfExchange': '0.738027',
									},
									'baseFare': {'currency': 'GBP','amount': '681.00'},
									'netPrice': {'currency': 'GBP','amount': '1110.21'},
									'segments': [
										{
											'segmentNumber': '1',
											'values': [
												{'code': 'FB','raw': 'LHN0MMN1U/GBT5'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '21JUL'},
												{'code': 'NA','raw': '21JUL'},
												{'code': 'ACCT', 'raw': 'TPACK'}, // account code
											],
										},
										{
											'segmentNumber': '2',
											'values': [
												{'code': 'FB','raw': 'LHN0MMN1U/GBT5'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '31JUL'},
												{'code': 'NA','raw': '31JUL'},
												{'code': 'ACCT', 'raw': 'TPACK'}, // account code
											],
										},
										{
											'segmentNumber': '3',
											'values': [
												{'code': 'FB','raw': 'LHN0MMN1U/GBT5'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '31JUL'},
												{'code': 'NA','raw': '31JUL'},
												{'code': 'ACCT', 'raw': 'TPACK'}, // account code
											],
										},
										{
											'segmentNumber': '4',
											'values': [
												{'code': 'FB','raw': 'SHN0MMN1U/GBT5'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '21AUG'},
												{'code': 'NA','raw': '21AUG'},
												{'code': 'ACCT', 'raw': 'TPACK'}, // account code
											],
										},
										{
											'segmentNumber': '5',
											'values': [
												{'code': 'FB','raw': 'SHN0MMN1U/GBT5'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '21AUG'},
												{'code': 'NA','raw': '21AUG'},
												{'code': 'ACCT', 'raw': 'TPACK'}, // account code
											],
										},
										{
											'segmentNumber': '6',
											'values': [
												{'code': 'FB','raw': 'SHN0MMN1U/GBT5'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '22AUG'},
												{'code': 'NA','raw': '22AUG'},
												{'code': 'ACCT', 'raw': 'TPACK'}, // account code
											],
										},
									],
									'endorsementBoxLines': [
										'VALIDAABAIBNONENDNONTRANS                                     ',
										'CHGFEEAPPLIES                                                 ',
									],
									'lastDateToPurchase': {'raw': '23JUN18','parsed': '2018-06-23'},
								},
							},
						],
						'footerData': {
							'normalizedPricingModifiers': [
								{'raw': 'P1', 'type': 'passengers'},
								{'raw': 'S1-6', 'type': 'segments'},
								{'raw': 'CAA','type': 'validatingCarrier','parsed': 'AA'},
								{'raw': 'ET', 'type': 'areElectronicTickets'},
								{'raw': 'NOCC','type': null,'parsed': null},
								{'raw': 'TA0GF', 'type': 'ticketingAgencyPcc'},
							],
						},
					},
					{
						'pricingNumber': '2',
						'segmentNumbers': [1,2,3,4,5,6],
						'addedDate': {'raw': '8JUN18','parsed': '2018-06-08'},
						'agentInitials': 'WS',
						'dutyCode': 'AG',
						'commandCopy': 'FQ:P/P2-TPACK/TA0GF*ITX',
						'passengers': [
							{
								'passengerNumber': '2',
								'passengerName': 'LESLIE/AMARAITALIACONNOR',
								'ptc': 'ITX',
								'guaranteeCode': 'Z',
								'guaranteeDate': {'raw': '19JUN18','parsed': '2018-06-19'},
								'starMark': '*',
								'currency': 'GBP',
								'amount': '1110.21',
								'blockData': {
									'fareConstruction': {
										'segments': [
											{'airline': 'AA', 'destination': 'NYC'},
											{'airline': 'AA', 'destination': 'MIA'},
											{'airline': 'AA', 'destination': 'SXM', 'fare': '544.01'},
											{'airline': 'AA', 'destination': 'MIA'},
											{'airline': 'AA', 'destination': 'BOS'},
											{'airline': 'AA', 'destination': 'LON', 'fare': '378.71'},
										],
										'currency': 'NUC',
										'fare': '922.72',
										'rateOfExchange': '0.738027',
									},
									'baseFare': {'currency': 'GBP','amount': '681.00'},
									'netPrice': {'currency': 'GBP','amount': '1110.21'},
									'segments': [
										{
											'segmentNumber': '1',
											'values': [
												{'code': 'FB','raw': 'LHN0MMN1U/GBT5'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '21JUL'},
												{'code': 'NA','raw': '21JUL'},
												{'code': 'ACCT', 'raw': 'TPACK'}, // account code
											],
										},
										{
											'segmentNumber': '2',
											'values': [
												{'code': 'FB','raw': 'LHN0MMN1U/GBT5'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '31JUL'},
												{'code': 'NA','raw': '31JUL'},
												{'code': 'ACCT', 'raw': 'TPACK'}, // account code
											],
										},
										{
											'segmentNumber': '3',
											'values': [
												{'code': 'FB','raw': 'LHN0MMN1U/GBT5'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '31JUL'},
												{'code': 'NA','raw': '31JUL'},
												{'code': 'ACCT', 'raw': 'TPACK'}, // account code
											],
										},
										{
											'segmentNumber': '4',
											'values': [
												{'code': 'FB','raw': 'SHN0MMN1U/GBT5'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '21AUG'},
												{'code': 'NA','raw': '21AUG'},
												{'code': 'ACCT', 'raw': 'TPACK'}, // account code
											],
										},
										{
											'segmentNumber': '5',
											'values': [
												{'code': 'FB','raw': 'SHN0MMN1U/GBT5'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '21AUG'},
												{'code': 'NA','raw': '21AUG'},
												{'code': 'ACCT', 'raw': 'TPACK'}, // account code
											],
										},
										{
											'segmentNumber': '6',
											'values': [
												{'code': 'FB','raw': 'SHN0MMN1U/GBT5'},
												{'code': 'BG','raw': '1PC'},
												{'code': 'NB','raw': '22AUG'},
												{'code': 'NA','raw': '22AUG'},
												{'code': 'ACCT', 'raw': 'TPACK'}, // account code
											],
										},
									],
									'endorsementBoxLines': [
										'VALIDAABAIBNONENDNONTRANS                                     ',
										'CHGFEEAPPLIES                                                 ',
									],
									'lastDateToPurchase': {'raw': '23JUN18','parsed': '2018-06-23'},
								},
							},
						],
						'footerData': {
							'normalizedPricingModifiers': [
								{'raw': 'P2', 'type': 'passengers'},
								{'raw': 'S1-6', 'type': 'segments'},
								{'raw': 'CAA','type': 'validatingCarrier','parsed': 'AA'},
								{'raw': 'ET', 'type': 'areElectronicTickets'},
								{'raw': 'NOCC','type': null,'parsed': null},
								{'raw': 'TA0GF', 'type': 'ticketingAgencyPcc'},
							],
						},
					},
				],
			},
		]);

		// ticketed PNR - ticket number instead of date and amount on passenger line
		list.push([
			php.implode(php.PHP_EOL, [
				'FQ1  - S1-4                                       09AUG18 WS/AG',
				'>FQ:P-TPACK/TA0GF*ITX                                          ',
				' CAT35                                                         ',
				' *** NET TICKET DATA EXISTS ***  >*NTD1;                       ',
				' P1  THOMAS/HERMENAURINA       ITX   Z   E   0012667560437     ',
				' LON AA X/TPA AA CLT AA FLL 10M42.22 AA LON 58.90 NUC101.12END ',
				' ROE0.755471   XF 3.50FLL 4.5                                  ',
				' FARE GBP76.00 TAX 78.00GB TAX 13.96UB TAX 8.60AY TAX 28.20US  ',
				' TAX 3.10XA TAX 3.50XF TAX 5.40XY TAX 4.40YC TAX 110.00YR      ',
				' TOT GBP331.16                                                 ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO1;            ',
				' S1   FB-OLN2Z8M4U/GBT1                                        ',
				'      BG-1PC  NB-27SEP    NA-27SEP                             ',
				' S2   FB-OLN2Z8M4U/GBT1                                        ',
				'      BG-1PC  NB-27SEP    NA-27SEP                             ',
				' S3   FB-OLN2Z8M4U/GBT1                                        ',
				'      BG-1PC  NB-20OCT    NA-20OCT                             ',
				' S4   FB-OLN2Z8M4U/GBT1                                        ',
				'      BG-1PC  NB-20OCT    NA-20OCT                             ',
				' NON END/NONREF/CHGFEE                                         ',
				' LAST DATE TO PURCHASE TICKET: 30AUG18                         ',
				' T S1-4/ET/FINV S86318/CAA/NOCC/TA0GF                          ',
			]),
			{
				'pricingList': [
					{
						'pricingNumber': '1',
						'segmentNumbers': [1,2,3,4],
						'commandCopy': 'FQ:P-TPACK/TA0GF*ITX',
						'hasPrivateFaresSelectedMessage': true,
						'passengers': [
							{
								'passengerNumber': '1',
								'passengerName': 'THOMAS/HERMENAURINA',
								'ptc': 'ITX',
								'guaranteeCode': 'Z',
								'isEticket': true,
								'ticketNumber': '0012667560437',
								'blockData': {
									'fareConstruction': {
										'segments': [
											{'destination': 'TPA'},
											{'destination': 'CLT'},
											{'destination': 'FLL', 'mileageSurcharge': '10M', 'fare': '42.22'},
											{'destination': 'LON','fare': '58.90'},
										],
										'fare': '101.12',
										'rateOfExchange': '0.755471',
									},
									'baseFare': {'currency': 'GBP','amount': '76.00'},
									'netPrice': {'currency': 'GBP','amount': '331.16'},
									'endorsementBoxLines': ['NON END/NONREF/CHGFEE                                         '],
									'lastDateToPurchase': {'raw': '30AUG18','parsed': '2018-08-30'},
								},
							},
						],
						'footerData': {
							'normalizedPricingModifiers': [
								{'raw': 'S1-4', 'type': 'segments'},
								{'raw': 'ET','type': 'areElectronicTickets'},
								{'raw': 'FINV','type': null},
							],
						},
					},
				],
			},
		]);

		// Fix for !trim(' 0') being equal to true (see dump)
		list.push([
			php.implode(php.PHP_EOL, [
				'FQ1  - S1-4                                       02APR19 WS/AG',
				'>FQP1*ADT                                                      ',
				' *** NET TICKET DATA EXISTS ***  >*NTD1\u00B7                       ',
				' P1  WALTERS/ALANJAMES         ADT   A  03APR19 *  USD  753.33 ',
				' HOU LH X/FRA LH DEL 74.70 LX X/ZRH LX CHI 0.45 NUC75.15END ROE',
				' 1.0   XF 4.50IAH 4.5                                          ',
				' FARE USD75.00 TAX 5.60AY TAX 37.20US TAX 3.96XA TAX 4.50XF    ',
				' TAX 7.00XY TAX 5.77YC TAX 10.70DE TAX 23.90RA TAX 6.10WO      ',
				' TAX 16.10CH TAX 540.00YQ TAX 17.50YR TOT USD753.33            ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO1\u00B7            ',
				' S1   FB-TKCAX02/YNAK                                          ',
				'      BG-2PC  NB-02SEP    NA-02SEP                             ',
				' S2   FB-TKCAX02/YNAK                                          ',
				'      BG-2PC  NB-03SEP    NA-03SEP                             ',
				' S3   FB-KKCAX02/YNAK                                          ',
				'      BG-2PC  NB-26SEP    NA-26SEP                             ',
				' S4   FB-KKCAX02/YNAK                                          ',
				'      BG-2PC  NB-26SEP    NA-26SEP                             ',
				' NONEND/REFRERTEINFOTHRUAGT                                    ',
				' VLD AC/LH/LX/OS/SN/UA ONLY                                    ',
				' LAST DATE TO PURCHASE TICKET: 05APR19                         ',
				' T P1/S1-4/CLH/ET/TA711M                                       ',
				'                                                               ',
				'FQ2  - S1-4                                       02APR19 WS/AG',
				'>FQP2*C06                                                      ',
				' *** NET TICKET DATA EXISTS ***  >*NTD2\u00B7                       ',
				' P2  WALTERS/ANNMARIA          C06   A  03APR19 *  USD  734.33 ',
				' HOU LH X/FRA LH DEL 56.02 LX X/ZRH LX CHI 0.34 NUC56.36END ROE',
				' 1.0   XF 4.50IAH 4.5                                          ',
				' FARE USD56.00 TAX 5.60AY TAX 37.20US TAX 3.96XA TAX 4.50XF    ',
				' TAX 7.00XY TAX 5.77YC TAX 10.70DE TAX 23.90RA TAX 6.10WO      ',
				' TAX 16.10CH TAX 540.00YQ TAX 17.50YR TOT USD734.33            ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO2\u00B7            ',
				' S1   FB-TKCAX02/CHUS                                          ',
				'      BG-2PC  NB-02SEP    NA-02SEP                             ',
				' S2   FB-TKCAX02/CHUS                                          ',
				'      BG-2PC  NB-03SEP    NA-03SEP                             ',
				' S3   FB-KKCAX02/CHUS                                          ',
				'      BG-2PC  NB-26SEP    NA-26SEP                             ',
				' S4   FB-KKCAX02/CHUS                                          ',
				'      BG-2PC  NB-26SEP    NA-26SEP                             ',
				' NONEND/REFRERTEINFOTHRUAGT                                    ',
				' VLD AC/LH/LX/OS/SN/UA ONLY                                    ',
				' LAST DATE TO PURCHASE TICKET: 05APR19                         ',
				' T P2/S1-4/CLH/ET/TA711M                                       ',
				'                                                               ',
				'FQ3  - S1-4                                       02APR19 WS/AG',
				'>FQP3*INF                                                      ',
				' *** NET TICKET DATA EXISTS ***  >*NTD3\u00B7                       ',
				' P3  WALTERS/PATRICKJR         INF   A  03APR19 *  USD   67.53 ',
				' HOU LH X/FRA LH DEL 7.47 LX X/ZRH LX CHI 0.04 NUC7.51END ROE1.',
				' 0                                                             ',
				' FARE USD8.00 TAX 5.60AY TAX 37.20US TAX 3.96XA TAX 7.00XY     ',
				' TAX 5.77YC TOT USD67.53                                       ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO3\u00B7            ',
				' S1   FB-TKCAX02/INUS                                          ',
				'      BG-1PC  NB-02SEP    NA-02SEP                             ',
				' S2   FB-TKCAX02/INUS                                          ',
				'      BG-1PC  NB-03SEP    NA-03SEP                             ',
				' S3   FB-KKCAX02/INUS                                          ',
				'      BG-1PC  NB-26SEP    NA-26SEP                             ',
				' S4   FB-KKCAX02/INUS                                          ',
				'      BG-1PC  NB-26SEP    NA-26SEP                             ',
				' NONEND/REFRERTEINFOTHRUAGT                                    ',
				' VLD AC/LH/LX/OS/SN/UA ONLY                                    ',
				' LAST DATE TO PURCHASE TICKET: 05APR19                         ',
				' T P3/S1-4/CLH/ET/TA711M',
			]),
			{
				'pricingList': [
					{
						'pricingNumber': '1',
						'segmentNumbers': [1,2,3,4],
					},
					{
						'pricingNumber': '2',
						'segmentNumbers': [1,2,3,4],
					},
					{
						'pricingNumber': '3',
						'segmentNumbers': [1,2,3,4],
					},
				],
			},
		]);

		// Despite priced with ADT37 PTC, we return ADT PTC as requested by Bruce
		list.push([
			php.implode(php.PHP_EOL, [
				'FQ1  - S1-2                                       12AUG19 WS/AG',
				'>FQP1*ADT37/-*711M/:C/:P                                       ',
				' *** NET TICKET DATA EXISTS ***  >*NTD1;                       ',
				' P1  WALTERS/PATRICKA          ADT37 A  13AUG19 *  USD 1018.83 ',
				' CHI TK IST 308.27 TK CHI Q40.00 308.28 NUC656.55END ROE1.0    ',
				' XF 4.50ORD 4.5                                                ',
				' FARE USD657.00 TAX 5.60AY TAX 37.20US TAX 3.96XA TAX 4.50XF   ',
				' TAX 7.00XY TAX 5.77YC TAX 3.40M6 TAX 22.40TR TAX 272.00YR     ',
				' TOT USD1018.83                                                ',
				'              ***ADDITIONAL FEES MAY APPLY*SEE>FO1;            ',
				' S1   FB-VLY4PC21/FB05                                         ',
				'      BG-2PC  NB-15SEP    NA-15SEP                             ',
				' S2   FB-VLY4PC21/FB05                                         ',
				'      BG-2PC  NB-22SEP    NA-22SEP                             ',
				' NONEND/TK ONLY                                                ',
				' LAST DATE TO PURCHASE TICKET: 14AUG19 SFO                     ',
				' T P01/S1-2/Z0/ET/CTK/TA711M                                   ',
			]),
			{
				'pricingList': [
					{
						'pricingNumber': '1',
						'segmentNumbers': [1, 2],
						'addedDate': {'raw': '2AUG19', 'parsed': '2019-08-02'},
						'agentInitials': 'WS',
						'dutyCode': 'AG',
						'commandCopy': 'FQP1*ADT37/-*711M/:C/:P',
						'hasPrivateFaresSelectedMessage': true,
						'headerMessages': [],
						'passengers': [
							{
								'passengerNumber': '1',
								'passengerName': 'WALTERS/PATRICKA',
								'ptc': 'ADT',
							},
						],
					},
				],
			},
		]);

		return list;
	}

	/**
	 * @test
	 * @dataProvider provideTestCases
	 */
	testAction(input, expected)  {
		const actual = StoredPricingListParser.parse(input);
		this.assertArrayElementsSubset(expected, actual);
		if (!php.isset(expected.error)) {
			this.assertEquals(actual.error, null);
		}
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
		];
	}
}
module.exports = StoredPricingListParserTest;
