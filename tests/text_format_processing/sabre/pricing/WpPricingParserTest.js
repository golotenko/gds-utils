
const php = require('enko-fundamentals/src/Transpiled/php.js');
const WpPricingParser = require('../../../../src/text_format_processing/sabre/pricing/WpPricingParser.js');

class WpPricingParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js') {
	provideDumps() {
		const list = [];

		// #0 - with "EMBARGOES-APPLY TO EACH PASSENGER"
		list.push([
			php.implode(php.PHP_EOL, [
				'       BASE FARE                 TAXES/FEES/CHARGES    TOTAL',
				' 1-   USD1533.02                    129.08XT      USD1662.10ADT',
				'    XT    114.98US       4.00ZP       5.60AY       4.50XF ',
				'         1533.02                    129.08           1662.10TTL',
				'ADT-01  FA2AA',
				' LAS AA MIA Q27.91Q18.60 1486.51USD1533.02END ZPLAS XFLAS4.5',
				'VALIDATING CARRIER - AA',
				'BAG ALLOWANCE     -LASMIA-02P/AA/EACH PIECE UP TO 70 POUNDS/32 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'CARRY ON ALLOWANCE',
				'LASMIA-02P/AA',
				'01/SMALL PERSONAL ITEM',
				'01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'  ',
				'EMBARGOES-APPLY TO EACH PASSENGER',
				'LASMIA-AA',
				'OVER 100 POUNDS/45 KILOGRAMS NOT PERMITTED',
				'                                                               ',
				'AIR EXTRAS AVAILABLE - SEE WP*AE',
				'.',
			]),
			{
				'fares': [
					{
						'totals': {
							'quantity': '1',
							'baseFare': {'currency': 'USD', 'amount': '1533.02'},
							'tax': {'amount': '129.08', 'taxCode': 'XT'},
							'total': {'currency': 'USD', 'amount': '1662.10', 'ptc': 'ADT'},
						},
						'taxList': [
							{'taxCode': 'US', 'amount': '114.98'},
							{'taxCode': 'ZP', 'amount': '4.00'},
							{'taxCode': 'AY', 'amount': '5.60'},
							{'taxCode': 'XF', 'amount': '4.50'},
						],
					},
				],
				'faresSum': {
					'baseFare': '1533.02',
					'tax': '129.08',
					'total': '1662.10',
				},
				'pqList': [
					{
						'fareBasisInfo': {
							'ptc': 'ADT',
							'quantity': '01',
							'records': [{'fareBasis': 'FA2AA'}],
						},
						'fareConstruction': {
							'data': {
								'currency': 'USD',
								'fareAndMarkupInNuc': '1533.02',
								'segments': [[]],
							},
						},
						'fareConstructionInfo': {
							'validatingCarrier': 'AA',
						},
						'baggageInfo': {
							'baggageAllowanceBlock': {
								'segments': [
									{
										'free': {
											'departureStopover': 'LAS',
											'destinationStopover': 'MIA',
											'amount': {
												'units': 'pieces',
												'amount': '02',
												'unitsCode': 'P',
											},
											'airline': 'AA',
											'sizeInfo': {
												'weightInLb': '70',
												'weightInKg': '32',
												'sizeInInches': '62',
												'sizeInCm': '158',
											},
										},

									},
								],
							},
							'carryOnAllowanceBlock': [
								{
									'bundle': {
										'cityPairs': [
											{
												'departureAirport': 'LAS',
												'destinationAirport': 'MIA',
											},
										],
										'amount': {
											'units': 'pieces',
											'amount': '02',
											'unitsCode': 'P',
										},
										'airline': 'AA',
									},
									'pieces': [
										{
											'pieceType': 'description',
											'text': 'SMALL PERSONAL ITEM',
										},
										{
											'pieceType': 'sizeInfo',
											'data': {
												'sizeInInches': '45',
												'sizeInCm': '115',
											},
										},
									],
								},
							],
						},
					},
				],
				'dataExistsInfo': [
					{'name': 'AIR EXTRAS', 'command': 'WP*AE'},
				],
			},
		]);

		// #1 - two PQ fares merged together
		list.push([
			php.implode(php.PHP_EOL, [
				'19OCT DEPARTURE DATE-----LAST DAY TO PURCHASE 30SEP/2359',
				'       BASE FARE                 TAXES/FEES/CHARGES    TOTAL',
				' 1-    USD850.00                    125.76XT       USD975.76ADT',
				'    XT     35.60US       5.50YC       7.00XY       3.96XA ',
				'           11.20AY      19.00F6      30.00LK      13.50XF ',
				' 1-    USD153.00                     63.26XT       USD216.26INF',
				'    XT     35.60US       5.50YC       7.00XY       3.96XA ',
				'           11.20AY ',
				'         1003.00                    189.02           1192.02TTL',
				'ADT-01  TLBD6MUS/YB',
				' LAS AA X/LAX EY X/AUH EY CMB Q LASCMB210.00Q LASCMB1.50 213.50',
				' EY X/AUH EY X/NYC B6 LAS Q CMBLAS210.00Q CMBLAS1.50 213.50NUC',
				' 850.00END ROE1.00 XFLAS4.5LAX4.5JFK4.5',
				'PENALTY FEES APPLY/VALID ON EY ONLY/NON END',
				'VALIDATING CARRIER - EY',
				'BAG ALLOWANCE     -LASCMB-02P/AA/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'BAG ALLOWANCE     -CMBLAS-02P/AA/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'CARRY ON ALLOWANCE',
				'LASLAX-02P/AA',
				'01/SMALL PERSONAL ITEM',
				'01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS',
				'LAXAUH AUHCMB CMBAUH AUHJFK-EY-CARRY ON ALLOWANCE UNKNOWN-CONTA',
				'CT CARRIER',
				'JFKLAS-02P/B6',
				'01/SMALL PERSONAL ITEM',
				'01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS',
				'CARRY ON CHARGES',
				'LAXAUH AUHCMB CMBAUH AUHJFK-EY-CARRY ON FEES UNKNOWN-CONTACT CA',
				'RRIER',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'INF-01  TLBD6MUSIN10/YB',
				' LAS AA X/LAX EY X/AUH EY CMB Q LASCMB55.00 21.35EY X/AUH EY X/',
				' NYC B6 LAS Q CMBLAS55.00 21.35NUC152.70END ROE1.00',
				'PENALTY FEES APPLY/VALID ON EY ONLY/NON END',
				'EACH INF REQUIRES ACCOMPANYING ADT PASSENGER',
				'VALIDATING CARRIER - EY',
				'BAG ALLOWANCE     -LASCMB-01P/AA/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'2NDCHECKED BAG FEE-LASCMB-NOT PERMITTED/AA/UP TO 100 POUNDS/45 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'BAG ALLOWANCE     -CMBLAS-01P/AA/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'2NDCHECKED BAG FEE-CMBLAS-NOT PERMITTED/AA/UP TO 100 POUNDS/45 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'CARRY ON ALLOWANCE',
				'LASLAX-02P/AA',
				'01/SMALL PERSONAL ITEM',
				'01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS',
				'LAXAUH AUHCMB CMBAUH AUHJFK-EY-CARRY ON ALLOWANCE UNKNOWN-CONTA',
				'CT CARRIER',
				'JFKLAS-02P/B6',
				'01/SMALL PERSONAL ITEM',
				'01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS',
				'CARRY ON CHARGES',
				'LAXAUH AUHCMB CMBAUH AUHJFK-EY-CARRY ON FEES UNKNOWN-CONTACT CA',
				'RRIER',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'  ',
				'EMBARGOES-APPLY TO EACH PASSENGER',
				'LASLAX-AA',
				'OVER 100 POUNDS/45 KILOGRAMS NOT PERMITTED',
				'JFKLAS-B6',
				'PET IN HOLD NOT PERMITTED',
				'OVER 80 LINEAR INCHES/203 LINEAR CENTIMETERS NOT PERMITTED',
				'OVER 100 POUNDS/45 KILOGRAMS NOT PERMITTED',
				'OVER 100 POUNDS/45 KILOGRAMS AND OVER 80 LINEAR INCHES/203 LINE',
				'AR CENTIMETERS NOT PERMITTED',
				'                                                               ',
				'AIR EXTRAS AVAILABLE - SEE WP*AE',
				'.',
			]),
			{
				'fares': [
					{
						'totals': {
							'quantity': '1',
							'baseFare': {'currency': 'USD', 'amount': '850.00'},
							'tax': {'amount': '125.76', 'taxCode': 'XT'},
							'total': {'currency': 'USD', 'amount': '975.76', 'ptc': 'ADT'},
						},
						'taxList': [
							{'taxCode': 'US', 'amount': '35.60'},
							{'taxCode': 'YC', 'amount': '5.50'},
							{'taxCode': 'XY', 'amount': '7.00'},
							{'taxCode': 'XA', 'amount': '3.96'},
						],
					},
					{
						'totals': {
							'quantity': '1',
							'baseFare': {'currency': 'USD', 'amount': '153.00'},
							'tax': {'amount': '63.26', 'taxCode': 'XT'},
							'total': {'currency': 'USD', 'amount': '216.26', 'ptc': 'INF'},
						},
						'taxList': [
							{'taxCode': 'US', 'amount': '35.60'},
							{'taxCode': 'YC', 'amount': '5.50'},
							{'taxCode': 'XY', 'amount': '7.00'},
							{'taxCode': 'XA', 'amount': '3.96'},
						],
					},
				],
				'pqList': [
					{
						'fareBasisInfo': {
							'ptc': 'ADT',
							'quantity': '01',
							'records': [{'fareBasis': 'TLBD6MUS', 'ticketDesignator': 'YB'}],
						},
						'fareConstruction': {
							'data': {
								'currency': 'NUC',
								'fareAndMarkupInNuc': '850.00',
								'segments': [[], [], [], [], [], []],
							},
						},
						'fareConstructionInfo': {
							'validatingCarrier': 'EY',
						},
						'baggageInfo': {
							'baggageAllowanceBlock': {
								'segments': [
									[],
									{
										'free': {
											'departureStopover': 'CMB',
											'destinationStopover': 'LAS',
											'amount': {
												'units': 'pieces',
												'amount': '02',
												'unitsCode': 'P',
											},
											'airline': 'AA',
											'sizeInfo': {
												'weightInLb': '50',
												'weightInKg': '23',
												'sizeInInches': '62',
												'sizeInCm': '158',
											},
										},
									},
								],
							},
							'carryOnAllowanceBlock': [
								{
									'bundle': {
										'cityPairs': [
											{
												'departureAirport': 'LAS',
												'destinationAirport': 'LAX',
											},
										],
										'amount': {
											'units': 'pieces',
											'amount': '02',
											'unitsCode': 'P',
										},
										'airline': 'AA',
									},
									'pieces': [
										{
											'pieceType': 'description',
											'text': 'SMALL PERSONAL ITEM',
										},
										{
											'pieceType': 'sizeInfo',
											'data': {
												'sizeInInches': '45',
												'sizeInCm': '115',
											},
										},
									],
								},
							],
						},
					},
					{
						'fareBasisInfo': {
							'ptc': 'INF',
							'quantity': '01',
							'records': [{'fareBasis': 'TLBD6MUSIN10', 'ticketDesignator': 'YB'}],
						},
						'fareConstruction': {
							'data': {
								'currency': 'NUC',
								'fareAndMarkupInNuc': '152.70',
								'segments': [[], [], [], [], [], []],
							},
						},
						'fareConstructionInfo': {
							'validatingCarrier': 'EY',
						},
						'baggageInfo': {
							'baggageAllowanceBlock': {
								'segments': [
									{
										'free': {
											'departureStopover': 'LAS',
											'destinationStopover': 'CMB',
											'amount': {
												'units': 'pieces',
												'amount': '01',
												'unitsCode': 'P',
											},
											'airline': 'AA',
											'sizeInfo': {
												'weightInLb': '50',
												'weightInKg': '23',
												'sizeInInches': '62',
												'sizeInCm': '158',
											},
										},
									},
								],
							},
							'carryOnAllowanceBlock': [
								{
									'bundle': {
										'cityPairs': [
											{
												'departureAirport': 'LAS',
												'destinationAirport': 'LAX',
											},
										],
										'amount': {
											'units': 'pieces',
											'amount': '02',
											'unitsCode': 'P',
										},
										'airline': 'AA',
									},
									'pieces': [
										{
											'pieceType': 'description',
											'text': 'SMALL PERSONAL ITEM',
										},
										{
											'pieceType': 'sizeInfo',
											'data': {
												'sizeInInches': '45',
												'sizeInCm': '115',
											},
										},
									],
								},
							],
						},
					},
				],
			},
		]);

		// #2 - without BAG ALLOWANCE
		list.push([
			php.implode(php.PHP_EOL, [
				'08NOV DEPARTURE DATE-----LAST DAY TO PURCHASE 27SEP/2359',
				'       BASE FARE      EQUIV AMT  TAXES/FEES/CHARGES    TOTAL',
				' 1-    GBP107.00      USD139.00     435.30XT       USD574.30ADT',
				'    XT    207.60YR      94.70GB      38.70UB      18.40FR ',
				'           33.40QX      25.30ZA      13.90WC       1.50EV ',
				'            1.80UM ',
				'          107.00         139.00     435.30            574.30TTL',
				'ADT-01  V1PRGB',
				' LON AF X/PAR AF JNB69.91AF X/PAR AF LON69.91NUC139.82',
				' END ROE0.765204',
				'FARE RSTR COULD APPLY/NON ENDO/',
				'VALIDATING CARRIER - AF',
				'CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES',
				'                                                               ',
				'AIR EXTRAS AVAILABLE - SEE WP*AE',
				'BAGGAGE INFO AVAILABLE - SEE WP*BAG',
				'.',
			]),
			{
				'faresSum': {'baseFare': '107.00', 'inDefaultCurrency': '139.00', 'tax': '435.30', 'total': '574.30'},
				'pqList': [
					{
						'fareBasisInfo': {
							'ptc': 'ADT',
							'quantity': '01',
							'records': [{'fareBasis': 'V1PRGB'}],
						},
						'fareConstruction': {'data': {'currency': 'NUC', 'fareAndMarkupInNuc': '139.82'}},
						'fareConstructionInfo': {
							'validatingCarrier': 'AF',
						},
						'baggageInfo': null,
					},
				],
				'dataExistsInfo': [
					{'name': 'AIR EXTRAS', 'command': 'WP*AE'},
					{'name': 'BAGGAGE INFO', 'command': 'WP*BAG'},
				],
			},
		]);

		// #3 - without "AIR EXTRAS AVAILABLE" and line break separating it
		list.push([
			php.implode(php.PHP_EOL, [
				'       BASE FARE      EQUIV AMT  TAXES/FEES/CHARGES    TOTAL',
				' 2-    GBP670.00      USD869.00     181.70XT      USD1050.70ADT',
				'    XT     20.00YQ      94.70GB      54.00UB       1.60YX ',
				'           11.40LI ',
				'         1340.00        1738.00     363.40           2101.40TTL',
				'ADT-02  KHRTGB1 MHRTGB1',
				' LON KU X/KWI KU MNL454.12KU X/KWI KU LON421.45NUC875.57',
				' END ROE0.765204',
				'NON ENDORSABLE/VALID KU ONLY/',
				'VALIDATING CARRIER - KU',
				'CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES',
				'BAGGAGE INFO AVAILABLE - SEE WP*BAG',
				'.',
			]),
			{
				'fares': [{'totals': {'quantity': '2'}}],
				'faresSum': {
					'baseFare': '1340.00',
					'inDefaultCurrency': '1738.00',
					'tax': '363.40',
					'total': '2101.40',
				},
				'pqList': [
					{
						'fareBasisInfo': {
							'ptc': 'ADT',
							'quantity': '02',
							'records': [
								{'fareBasis': 'KHRTGB1'},
								{'fareBasis': 'MHRTGB1'},
							],
						},
						'fareConstruction': {'data': {'currency': 'NUC', 'fareAndMarkupInNuc': '875.57'}},
						'fareConstructionInfo': {
							'validatingCarrier': 'KU',
							'endorsementBoxLines': [
								'NON ENDORSABLE/VALID KU ONLY/',
							],
							'unparsedLines': [
								'CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES',
							],
						},
						'baggageInfo': null,
					},
				],
				'dataExistsInfo': [
					{'name': 'BAGGAGE INFO', 'command': 'WP*BAG'},
				],
			},
		]);

		// #4 - with "FORM OF PAYMENT FEES PER TICKET MAY APPLY"
		list.push([
			php.implode(php.PHP_EOL, [
				'       BASE FARE      EQUIV AMT  TAXES/FEES/CHARGES    TOTAL',
				' 2-    GBP144.00      USD187.00     447.76XT       USD634.76ADT',
				'    XT    207.40YQ      35.60US       5.50YC       7.00XY ',
				'            3.96XA       5.60AY      94.60GB      38.60UB ',
				'           16.20PT      28.80YP       4.50XF ',
				'          288.00         374.00     895.52           1269.52TTL',
				'ADT-02  TFLASHOW',
				' LON TP X/LIS TP MIA94.09TP X/LIS TP LON94.09NUC188.18',
				' END ROE0.765204 XFMIA4.5',
				'CHNG PEN/FARE RESTR APPLY',
				'VALIDATING CARRIER - TP',
				'BAG ALLOWANCE     -LHRMIA-01P/TP/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'2NDCHECKED BAG FEE-LHRMIA-*/TP',
				'*BAGGAGE ALLOWANCES/FEES UNKNOWN - CONTACT TP',
				'BAG ALLOWANCE     -MIALGW-01P/TP/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'2NDCHECKED BAG FEE-MIALGW-*/TP',
				'*BAGGAGE ALLOWANCES/FEES UNKNOWN - CONTACT TP',
				'CARRY ON ALLOWANCE',
				'LHRLIS LISMIA MIALIS LISLGW-01P/TP',
				'CARRY ON CHARGES',
				'LHRLIS LISMIA MIALIS LISLGW-TP-CARRY ON FEES UNKNOWN-CONTACT CA',
				'RRIER',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'                                                               ',
				'FORM OF PAYMENT FEES PER TICKET MAY APPLY',
				'ADT      DESCRIPTION                     FEE      TKT TOTAL',
				' OBFCA - CC NBR BEGINS WITH 122088      0.00         634.76',
				' OBFCA - CC NBR BEGINS WITH 192088      0.00         634.76',
				'                                                               ',
				'AIR EXTRAS AVAILABLE - SEE WP*AE',
				'.',
			]),
			{
				'fares': [{
					'totals': {
						'quantity': '2',
						'total': {'currency': 'USD', 'amount': '634.76', 'ptc': 'ADT'},
					},
				}],
				'pqList': [
					{
						'fareBasisInfo': {
							'ptc': 'ADT',
							'quantity': '02',
							'records': [{'fareBasis': 'TFLASHOW'}],
						},
						'fareConstruction': {
							'data': {
								'currency': 'NUC',
								'fareAndMarkupInNuc': '188.18',
								'rateOfExchange': '0.765204',
							},
						},
						'fareConstructionInfo': {
							'validatingCarrier': 'TP',
						},
						'baggageInfo': [],
					},
				],
				'additionalInfo': [
					[
						'FORM OF PAYMENT FEES PER TICKET MAY APPLY',
						'ADT      DESCRIPTION                     FEE      TKT TOTAL',
						' OBFCA - CC NBR BEGINS WITH 122088      0.00         634.76',
						' OBFCA - CC NBR BEGINS WITH 192088      0.00         634.76',
					],
				],
				'dataExistsInfo': [
					{'name': 'AIR EXTRAS', 'command': 'WP*AE'},
				],
			},
		]);

		// #5 - with alternate validating carriers
		list.push([
			php.implode(php.PHP_EOL, [
				'       BASE FARE                 TAXES/FEES/CHARGES    TOTAL',
				' 1-    USD489.00                    369.28XT       USD858.28ADT',
				'    XT     10.62YQ     215.00YR      17.80US       5.50YC ',
				'            7.00XY       3.96XA      24.10VX      36.10VY ',
				'           24.10VZ      16.70D7       8.40YH ',
				'          489.00                    369.28            858.28TTL',
				'ADT-01  QLOWUS1',
				' DLA KP X/LFW ET NYC489.00NUC489.00END ROE1.00',
				'VALIDATING CARRIER - ET',
				'ALTERNATE VALIDATING CARRIER/S - KP ',
				'CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES',
				'BAG ALLOWANCE     -DLAEWR-02P/ET/EACH PIECE UP TO 70 POUNDS/32 ',
				'KILOGRAMS',
				'CARRY ON ALLOWANCE',
				'DLALFW-07KG/KP',
				'LFWEWR-01P/ET',
				'CARRY ON CHARGES',
				'LFWEWR-ET-CARRY ON FEES UNKNOWN-CONTACT CARRIER',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'.',
			]),
			{
				'pqList': [
					{
						'fareConstructionInfo': {
							'validatingCarrier': 'ET',
							'alternateValidatingCarriers': ['KP'],
						},
					},
				],
			},
		]);

		// with text after validating carrier
		list.push([
			php.implode(php.PHP_EOL, [
				'08NOV DEPARTURE DATE-----LAST DAY TO PURCHASE 18OCT/2359',
				'       BASE FARE                 TAXES/FEES/CHARGES    TOTAL',
				' 1-    USD479.00                    667.96XT      USD1146.96ADT',
				'    XT    556.00YR      35.60US       5.50YC       7.00XY ',
				'            3.96XA      11.20AY      17.70JD       4.10QV ',
				'            0.60OG       6.50CJ       6.30RN      13.50XF ',
				'          479.00                    667.96           1146.96TTL',
				'ADT-01  VLXP72US',
				' CHI KL X/ATL KL MAD M229.50KL X/E/AMS KL X/DTT KL CHI ',
				' Q MADCHI20.00M229.50NUC479.00END ROE1.00 XFMDW4.5ATL4.5DTW4.5',
				'NONREF/NONEND/PEX',
				'VALIDATING CARRIER - DL PER GSA AGREEMENT WITH KL',
				'                                                               ',
				'AIR EXTRAS AVAILABLE - SEE WP*AE',
				'.',
			]),
			{
				'pqList': [
					{
						'fareConstructionInfo': {
							'validatingCarrier': 'DL',
						},
					},
				],
			},
		]);

		// #7 >*QJTCAA; - implying fare construction should be joined by space, not empty string
		list.push([
			php.implode(php.PHP_EOL, [
				'11MAY DEPARTURE DATE-----LAST DAY TO PURCHASE 31JAN/1723',
				'       BASE FARE                 TAXES/FEES/CHARGES    TOTAL',
				' 1-    USD923.00                    697.46XT      USD1620.46ADT',
				'    XT    557.00YR      36.00US       5.50YC       7.00XY ',
				'            3.96XA      11.20AY      29.50ZA       3.00EV ',
				'            3.40UM      20.50NA       6.90H1      13.50XF ',
				'          923.00                    697.46           1620.46TTL',
				'ADT-01  TKB67US YEEIF3M VK4PR1ME',
				' LAX DL X/ATL DL JNB M390.50SA WDH149.68SA JNB149.68DL X/ATL DL',
				' LAX M233.50NUC923.36END ROE1.00 XFLAX4.5ATL4.5ATL4.5',
				'REF WITH FEE/CHG FEE APPLIES',
				'NONREF/NONEND/PEX',
				'VALIDATING CARRIER - DL',
				'CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES',
				'BAG ALLOWANCE     -LAXWDH-02P/DL/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'BAG ALLOWANCE     -WDHLAX-02P/DL/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'CARRY ON ALLOWANCE',
				'LAXATL ATLJNB JNBATL ATLLAX-01P/DL',
				'01/CARRY ON HAND BAGGAGE',
				'01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS',
				'JNBWDH WDHJNB-01P/SA',
				'CARRY ON CHARGES',
				'LAXATL ATLJNB JNBATL ATLLAX-DL-CARRY ON FEES UNKNOWN-CONTACT CA',
				'RRIER',
				'JNBWDH WDHJNB-SA-CARRY ON FEES UNKNOWN-CONTACT CARRIER',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'  ',
				'EMBARGOES-APPLY TO EACH PASSENGER',
				'LAXATL-DL',
				'SPORTING EQUIPMENT/CANOE/KAYAK NOT PERMITTED',
				'ATLJNB JNBATL-DL',
				'PET IN HOLD NOT PERMITTED',
				'PET IN CABIN NOT PERMITTED',
				'OVER 70 POUNDS/32 KILOGRAMS NOT PERMITTED',
				'SPORTING EQUIPMENT/CANOE/KAYAK NOT PERMITTED',
				'ATLLAX-DL',
				'PET IN HOLD NOT PERMITTED',
				'SPORTING EQUIPMENT/CANOE/KAYAK NOT PERMITTED',
				'                                                               ',
				'AIR EXTRAS AVAILABLE - SEE WP*AE',
				'.',
			]),
			{
				'pqList': [
					{
						'fareConstruction': {
							'data': {
								'currency': 'NUC',
								'fareAndMarkupInNuc': '923.36',
								'segments': [
									{'departure': 'LAX'},
									{'departure': 'ATL', 'fare': '390.50'},
									{'departure': 'JNB', 'fare': '149.68'},
									{'departure': 'WDH', 'fare': '149.68'},
									{'departure': 'JNB'},
									{'departure': 'ATL', 'fare': '233.50'},
								],
							},
						},
					},
				],
			},
		]);

		// >WPPINF; infant ptc block has no taxes - parser should not fail on that
		list.push([
			php.implode(php.PHP_EOL, [
				'10JUN DEPARTURE DATE-----LAST DAY TO PURCHASE 03JUN/2359',
				'       BASE FARE      EQUIV AMT  TAXES/FEES/CHARGES    TOTAL',
				' 1-     EUR35.00       USD39.00                     USD39.00INF',
				'           35.00          39.00                        39.00TTL',
				'INF-01  Y1FEP4/IN90',
				' KIV PS X/IEV PS RIX36.61NUC36.61END ROE0.944989',
				'NONEND/RES RSTR/RBK FOC',
				'EACH INF REQUIRES ACCOMPANYING ADT PASSENGER',
				'VALIDATING CARRIER - PS',
				'                                                               ',
				'AIR EXTRAS AVAILABLE - SEE WP*AE',
				'BAGGAGE INFO AVAILABLE - SEE WP*BAG',
				'.',
			]),
			{
				'fares': [
					{
						'totals': {
							'quantity': '1',
							'baseFare': {'currency': 'EUR', 'amount': '35.00'},
							'inDefaultCurrency': {'currency': 'USD', 'amount': '39.00'},
							'total': {'currency': 'USD', 'amount': '39.00', 'ptc': 'INF'},
						},
						'taxList': [],
					},
				],
				'faresSum': {
					'baseFare': '35.00',
					'inDefaultCurrency': '39.00',
					'total': '39.00',
				},
			},
		]);

		// ptc with numbers
		list.push([
			php.implode(php.PHP_EOL, [
				'15AUG DEPARTURE DATE-----LAST DAY TO PURCHASE 04JUN/1431',
				'       BASE FARE                 TAXES/FEES/CHARGES    TOTAL',
				' 5-    USD435.00                    623.66XT      USD1058.66JCB',
				'    XT    516.00YQ      36.00US       5.50YC       7.00XY ',
				'            3.96XA       5.60AY      24.00RA      16.40JD ',
				'            4.00QV       0.70OG       4.50XF ',
				' 2-    USD348.00                    623.66XT       USD971.66J05',
				'    XT    516.00YQ      36.00US       5.50YC       7.00XY ',
				'            3.96XA       5.60AY      24.00RA      16.40JD ',
				'            4.00QV       0.70OG       4.50XF ',
				'         2871.00                   4365.62           7236.62TTL',
				'JCB-05  EKXNCRUS EKWNCRUS',
				' LAX AB X/DUS AB BCN213.35AB X/DUS AB LAX221.85NUC435.20',
				' END ROE1.00 XFLAX4.5',
				'NONREF/NONEND/VLD ON AB',
				'PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING',
				'PRIVATE ¤',
				'VALIDATING CARRIER - AB',
				'BAG ALLOWANCE     -LAXBCN-01P/AB/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS',
				'2NDCHECKED BAG FEE-LAXBCN-USD167.00/AB/UP TO 50 POUNDS/23 KILOG',
				'RAMS',
				'BAG ALLOWANCE     -BCNLAX-01P/AB/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS',
				'2NDCHECKED BAG FEE-BCNLAX-USD167.00/AB/UP TO 50 POUNDS/23 KILOG',
				'RAMS',
				'CARRY ON ALLOWANCE',
				'LAXDUS DUSBCN BCNDUS DUSLAX-01P/AB',
				'01/UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 45 LINEAR INCHES/115 L',
				'INEAR CENTIMETERS',
				'CARRY ON CHARGES',
				'LAXDUS DUSBCN BCNDUS DUSLAX-AB-CARRY ON FEES UNKNOWN-CONTACT CA',
				'RRIER',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'J05-02  EKXNCRUS/UNN EKWNCRUS/CHD',
				' LAX AB X/DUS AB BCN170.68AB X/DUS AB LAX177.48NUC348.16',
				' END ROE1.00 XFLAX4.5',
				'NONREF/NONEND/VLD ON AB',
				'SEG3,4 EACH J05 REQUIRES ACCOMPANYING SAME CABIN ADT',
				'PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING',
				'PRIVATE ¤',
				'VALIDATING CARRIER - AB',
				'BAG ALLOWANCE     -LAXBCN-01P/AB/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS',
				'2NDCHECKED BAG FEE-LAXBCN-USD167.00/AB/UP TO 50 POUNDS/23 KILOG',
				'RAMS',
				'BAG ALLOWANCE     -BCNLAX-01P/AB/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS',
				'2NDCHECKED BAG FEE-BCNLAX-USD167.00/AB/UP TO 50 POUNDS/23 KILOG',
				'RAMS',
				'CARRY ON ALLOWANCE',
				'LAXDUS DUSBCN BCNDUS DUSLAX-01P/AB',
				'01/UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 45 LINEAR INCHES/115 L',
				'INEAR CENTIMETERS',
				'CARRY ON CHARGES',
				'LAXDUS DUSBCN BCNDUS DUSLAX-AB-CARRY ON FEES UNKNOWN-CONTACT CA',
				'RRIER',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'                                                               ',
				'AIR EXTRAS AVAILABLE - SEE WP*AE',
				'.',
			]),
			{
				'fares': [
					{'totals': {'total': {'ptc': 'JCB'}}},
					{'totals': {'total': {'ptc': 'J05'}}},
				],
				'pqList': [
					{'fareBasisInfo': {'ptc': 'JCB'}},
					{'fareBasisInfo': {'ptc': 'J05'}},
				],
			},
		]);

		// FC parser failed - oceanic flight is marked with "*AT*" instead of "(AT)"
		list.push([
			php.implode(php.PHP_EOL, [
				'30SEP DEPARTURE DATE-----LAST DAY TO PURCHASE 12SEP/2359',
				'       BASE FARE                 TAXES/FEES/CHARGES    TOTAL',
				' 1-    USD147.00                    693.56XT       USD840.56ADT',
				'    XT    615.00YQ       2.20YR      36.00US       5.50YC ',
				'            7.00XY       3.96XA       5.60AY       6.10WO ',
				'            7.70IN       4.50XF ',
				'          147.00                    693.56            840.56TTL',
				'ADT-01  E2WSPC1',
				' CHI AI*AT*X/DEL AI AMD73.50AI X/DEL AI*AT*CHI73.50NUC147.00',
				' END ROE1.00 XFORD4.5',
				'CHANGE FEE/FARE DIFF APPLY/NONEND/CANCEL/NOSHOW',
				'VALIDATING CARRIER - AI',
				'CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES',
				'BAG ALLOWANCE     -ORDAMD-02P/AI',
				'BAG ALLOWANCE     -AMDORD-02P/AI',
				'CARRY ON ALLOWANCE',
				'ORDDEL DELAMD AMDDEL DELORD-01P/07KG/AI',
				'CARRY ON CHARGES',
				'ORDDEL DELAMD AMDDEL DELORD-AI-CARRY ON FEES UNKNOWN-CONTACT CA',
				'RRIER',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'APPLICABLE BOOKING CLASS -   1E 2V 3V 4E',
				'                                                               ',
				'AIR EXTRAS AVAILABLE - SEE WP*AE',
				'.',
			]),
			{
				'wasPqRetained': false,
				'pqList': [
					{
						'fareConstruction': {
							'data': {
								'segments': [
									{
										'airline': 'AI',
										'flags': [{'raw': 'X', 'parsed': 'noStopover'}],
										'destination': 'DEL',
										'oceanicFlight': 'AT',
									},
									{'airline': 'AI', 'destination': 'AMD', 'fare': '73.50'},
									{'airline': 'AI', 'destination': 'DEL'},
									{
										'airline': 'AI',
										'destination': 'CHI',
										'oceanicFlight': 'AT',
										'fare': '73.50',
									},
								],
								'fare': '147.00',
								'facilityCharges': [{'airport': 'ORD', 'amount': '4.5'}],
							},
						},
					},
				],
			},
		]);

		// starting with PRICE QUOTE RECORD RETAINED caused by RQ modifier
		// session 1992164, command >WPRQ¥PJCB¥MCAD;
		list.push([
			php.implode(php.PHP_EOL, [
				'PRICE QUOTE RECORD RETAINED',
				'  ',
				'05JAN DEPARTURE DATE-----LAST DAY TO PURCHASE 01DEC/1454',
				'       BASE FARE      EQUIV AMT  TAXES/FEES/CHARGES    TOTAL',
				' 1-    USD309.00      CAD395.00     123.85XT       CAD518.85JCB',
				'    XT     25.91CA      25.00SQ       3.25RC       8.57CJ ',
				'            8.15RN       4.86WO       7.19IN      12.39FR ',
				'           28.53QX ',
				'          309.00         395.00     123.85            518.85TTL',
				'JCB-01  VKC28U0/LN6G VK2C8U0/LN6G',
				' YTO AC X/AMS KL DEL Q YTODEL12.19M89.00KL BLR AF X/BOM AF X/',
				' PAR AC YTO M89.00 1S19.13 1S100.00NUC309.32END ROE1.00',
				'NONEND/NONREF/LN6G/9074',
				'PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING',
				'PRIVATE ¤',
				'VALIDATING CARRIER - DL PER GSA AGREEMENT WITH KL',
				'ALTERNATE VALIDATING CARRIER/S - AF ',
				'CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES',
				'BAG ALLOWANCE     -YYZBLR-02P/AC/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'BAG ALLOWANCE     -BLRYYZ-02P/AC/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'CARRY ON ALLOWANCE',
				'YYZAMS CDGYYZ-02P/AC',
				'02/EACH PIECE CARRY ON HAND BAGGAGE',
				'AMSDEL-01P/KL',
				'01/UP TO 26 POUNDS/12 KILOGRAMS AND UP TO 45 LINEAR INCHES/115 ',
				'LINEAR CENTIMETERS',
				'DELBLR BLRBOM-01P/9W',
				'01/UP TO 15 POUNDS/7 KILOGRAMS AND UP TO 45 LINEAR INCHES/115 L',
				'INEAR CENTIMETERS',
				'BOMCDG-01P/AF',
				'01/UP TO 26 POUNDS/12 KILOGRAMS AND UP TO 45 LINEAR INCHES/115 ',
				'LINEAR CENTIMETERS',
				'CARRY ON CHARGES',
				'AMSDEL-KL-CARRY ON FEES UNKNOWN-CONTACT CARRIER',
				'DELBLR BLRBOM-9W-CARRY ON FEES UNKNOWN-CONTACT CARRIER',
				'BOMCDG-AF-CARRY ON FEES UNKNOWN-CONTACT CARRIER',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'                                                               ',
				'AIR EXTRAS AVAILABLE - SEE WP*AE',
				'.',
			]),
			{
				'wasPqRetained': true,
				'dates': {
					'departureDate': {'raw': '05JAN', 'parsed': '01-05'},
					'lastDateToPurchase': {'raw': '01DEC', 'parsed': '12-01'},
					'lastTimeToPurchase': {'raw': '1454', 'parsed': '14:54'},
				},
				'fares': [
					{
						'totals': {
							'quantity': '1',
							'baseFare': {'currency': 'USD', 'amount': '309.00'},
							'inDefaultCurrency': {'currency': 'CAD', 'amount': '395.00'},
							'tax': {'amount': '123.85', 'taxCode': 'XT'},
							'total': {'currency': 'CAD', 'amount': '518.85', 'ptc': 'JCB'},
						},
					},
				],
				'pqList': [
					{
						'fareBasisInfo': {
							'ptc': 'JCB',
							'quantity': '01',
							'records': [
								{'fareBasis': 'VKC28U0', 'ticketDesignator': 'LN6G'},
								{'fareBasis': 'VK2C8U0', 'ticketDesignator': 'LN6G'},
							],
						},
						'fareConstruction': {
							'data': {
								'segments': [
									{'destination': 'AMS'},
									{'destination': 'DEL', 'fuelSurcharge': '12.19', 'fare': '89.00'},
									{'destination': 'BLR'},
									{'destination': 'BOM'},
									{'destination': 'PAR'},
									{
										'destination': 'YTO', 'fare': '89.00', 'stopoverFees': [
											{'stopoverNumber': '1', 'amount': '19.13'},
											{'stopoverNumber': '1', 'amount': '100.00'},
										],
									},
								],
							},
						},
					},
				],
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'SOME UNRELATED DUMP TEXT',
				'ACCIDENTALLY GOT PASSED TO PARSER',
				'AND HAS MANY LINES',
			]),
			{
				'error': 'Failed to parse pricing header - SOME UNRELATED DUMP TEXT',
			},
		]);

		// session #2629394, >WC¥1;
		// empty line between ADT price and TTL price
		list.push([
			php.implode(php.PHP_EOL, [
				'       BASE FARE                     TAXES             TOTAL',
				' 1-    GBP114.31                     75.00XT       GBP189.31ADT',
				' ',
				'          114.31                     75.00            189.31TTL',
				'ADT-01  Y',
				' LTN U2 TLV 52.61Y U2 LGW 61.70Y GBP114.31END',
				'ITX NOT APPLICABLE - ADT FARE USED',
				'VALIDATING CARRIER - U2',
				' ',
				'FORM OF PAYMENT FEES MAY APPLY',
				'ADT      DESCRIPTION                     FEE              TOTAL',
				' OBFCA - ANY CC                                           15.00',
				' ',
				'GRAND TOTAL                                          GBP 204.31',
				'                                                               ',
				'AIR EXTRAS AVAILABLE - SEE WP*AE',
				' 1 U22083Y 22JAN M LTNTLV NN1   715A  215P /RCRQ',
				' 2 U28818Y 28JAN S TLVLGW NN1   850P 1225A  29JAN M /RCRQ.',
			]),
			{
				'fares': [
					{
						'totals': {
							'quantity': '1',
							'baseFare': {'currency': 'GBP', 'amount': '114.31'},
							'inDefaultCurrency': null,
							'tax': {'amount': '75.00', 'taxCode': 'XT'},
							'total': {'currency': 'GBP', 'amount': '189.31', 'ptc': 'ADT'},
							'line': ' 1-    GBP114.31                     75.00XT       GBP189.31ADT',
						},
						'taxList': [],
					},
				],
				'faresSum': {
					'baseFare': '114.31',
					'inDefaultCurrency': null,
					'tax': '75.00',
					'total': '189.31',
				},
				'pqList': [
					{
						'fareBasisInfo': {
							'ptc': 'ADT',
							'quantity': '01',
							'records': [{'fareBasis': 'Y', 'ticketDesignator': null}],
						},
						'fareConstruction': {
							'data': {
								'segments': [
									{'airline': 'U2', 'destination': 'TLV', 'fare': '52.61', 'fareBasis': 'Y'},
									{'airline': 'U2', 'destination': 'LGW', 'fare': '61.70', 'fareBasis': 'Y'},
								],
								'currency': 'GBP',
								'fare': '114.31',
							},
						},
						'baggageInfo': null,
					},
				],
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'25JAN DEPARTURE DATE-----LAST DAY TO PURCHASE 20DEC/2359',
				'       BASE FARE                 TAXES/FEES/CHARGES    TOTAL',
				' 1-    GBP716.00                    408.04XT      GBP1124.04ADT',
				'    XT    155.00YQ      78.00GB      69.44UB      29.00US ',
				'            4.60YC       5.50XY       3.10XA       4.40AY ',
				'           39.60QT      15.80TE       3.60XF ',
				'          716.00                    408.04           1124.04TTL',
				'ADT-01  TLXZ90M7F/DIF4 SQW8C1B4 SQX8C1B4 TLXZ90M7F/DIF4 ',
				'       OLWZ90B7',
				' MAN BA LON*BA HOU Q11.75 244.17BA LON Q11.75 211.53*BA LOS ',
				' Q MANLOS11.75 299.01BA X/LON BA MAN Q LOSMAN11.75 133.84NUC',
				' 935.55END ROE0.765832 XFIAH4.5',
				'NON-REF/NON-END/701633',
				'RESTRICTIONS MAY APPLY',
				'CARRIER RESTRICTION APPLY/PENALTY APPLIES',
				'PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING',
				'PRIVATE ¤',
				'VALIDATING CARRIER - BA',
				'BAG ALLOWANCE     -MANIAH-02P/BA/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 81 LINEAR INCHES/208 LINEAR CENTIMETERS',
				'BAG ALLOWANCE     -IAHMAN-02P/BA/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 81 LINEAR INCHES/208 LINEAR CENTIMETERS',
				'CARRY ON ALLOWANCE',
				'MANLHR LHRIAH IAHLHR LHRLOS LOSLHR LHRMAN-01P/BA',
				'01/UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS',
				'01/UP TO 50 POUNDS/23 KILOGRAMS AND UP TO 50 POUNDS/127 LINEAR ',
				'CENTIMETERS',
				'CARRY ON CHARGES',
				'MANLHR LHRIAH IAHLHR LHRLOS LOSLHR LHRMAN-BA-CARRY ON FEES UNKN',
				'OWN-CONTACT CARRIER',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'  ',
				'EMBARGOES-APPLY TO EACH PASSENGER',
				'MANLHR LHRIAH IAHLHR LHRLOS LOSLHR LHRMAN-BA',
				'PET IN HOLD NOT PERMITTED',
				'PET IN CABIN NOT PERMITTED',
				'SPORTING EQUIPMENT/JAVELIN NOT PERMITTED',
				'SPORTING EQUIPMENT/POLE VAULT EQUIPMENT NOT PERMITTED',
				'SPORTING EQUIPMENT/CANOE/KAYAK NOT PERMITTED',
				'SPORTING EQUIPMENT/HANG GLIDING EQUIPMENT NOT PERMITTED',
				'SPORTING EQUIPMENT/WINDSURF EQUIPMENT NOT PERMITTED',
				'                                                               ',
				'FORM OF PAYMENT FEES PER TICKET MAY APPLY',
				'ADT      DESCRIPTION                     FEE      TKT TOTAL',
				' OBFCA - PAYMENTFEE                    11.20        1135.24',
				' OBFDA - ANY CC                         0.00        1124.04',
				'                                                               ',
				'AIR EXTRAS AVAILABLE - SEE WP*AE',
				'.',
				'            [rawInDisplayEncoding] => 25JAN DEPARTURE DATE-----LAST DAY TO PURCHASE 20DEC/2359',
				'       BASE FARE                 TAXES/FEES/CHARGES    TOTAL',
				' 1-    GBP716.00                    408.04XT      GBP1124.04ADT',
				'    XT    155.00YQ      78.00GB      69.44UB      29.00US ',
				'            4.60YC       5.50XY       3.10XA       4.40AY ',
				'           39.60QT      15.80TE       3.60XF ',
				'          716.00                    408.04           1124.04TTL',
				'ADT-01  TLXZ90M7F/DIF4 SQW8C1B4 SQX8C1B4 TLXZ90M7F/DIF4 ',
				'       OLWZ90B7',
				' MAN BA LON*BA HOU Q11.75 244.17BA LON Q11.75 211.53*BA LOS ',
				' Q MANLOS11.75 299.01BA X/LON BA MAN Q LOSMAN11.75 133.84NUC',
				' 935.55END ROE0.765832 XFIAH4.5',
				'NON-REF/NON-END/701633',
				'RESTRICTIONS MAY APPLY',
				'CARRIER RESTRICTION APPLY/PENALTY APPLIES',
				'PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING',
				'PRIVATE ¤',
				'VALIDATING CARRIER - BA',
				'BAG ALLOWANCE     -MANIAH-02P/BA/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 81 LINEAR INCHES/208 LINEAR CENTIMETERS',
				'BAG ALLOWANCE     -IAHMAN-02P/BA/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 81 LINEAR INCHES/208 LINEAR CENTIMETERS',
				'CARRY ON ALLOWANCE',
				'MANLHR LHRIAH IAHLHR LHRLOS LOSLHR LHRMAN-01P/BA',
				'01/UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS',
				'01/UP TO 50 POUNDS/23 KILOGRAMS AND UP TO 50 POUNDS/127 LINEAR ',
				'CENTIMETERS',
				'CARRY ON CHARGES',
				'MANLHR LHRIAH IAHLHR LHRLOS LOSLHR LHRMAN-BA-CARRY ON FEES UNKN',
				'OWN-CONTACT CARRIER',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'  ',
				'EMBARGOES-APPLY TO EACH PASSENGER',
				'MANLHR LHRIAH IAHLHR LHRLOS LOSLHR LHRMAN-BA',
				'PET IN HOLD NOT PERMITTED',
				'PET IN CABIN NOT PERMITTED',
				'SPORTING EQUIPMENT/JAVELIN NOT PERMITTED',
				'SPORTING EQUIPMENT/POLE VAULT EQUIPMENT NOT PERMITTED',
				'SPORTING EQUIPMENT/CANOE/KAYAK NOT PERMITTED',
				'SPORTING EQUIPMENT/HANG GLIDING EQUIPMENT NOT PERMITTED',
				'SPORTING EQUIPMENT/WINDSURF EQUIPMENT NOT PERMITTED',
				'                                                               ',
				'FORM OF PAYMENT FEES PER TICKET MAY APPLY',
				'ADT      DESCRIPTION                     FEE      TKT TOTAL',
				' OBFCA - PAYMENTFEE                    11.20        1135.24',
				' OBFDA - ANY CC                         0.00        1124.04',
				'                                                               ',
				'AIR EXTRAS AVAILABLE - SEE WP*AE',
			]),
			{
				'pqList': [
					{
						'fareBasisInfo': {
							'ptc': 'ADT',
							'quantity': '01',
							'records': [
								{'fareBasis': 'TLXZ90M7F', 'ticketDesignator': 'DIF4'},
								{'fareBasis': 'SQW8C1B4', 'ticketDesignator': null},
								{'fareBasis': 'SQX8C1B4', 'ticketDesignator': null},
								{'fareBasis': 'TLXZ90M7F', 'ticketDesignator': 'DIF4'},
								{'fareBasis': 'OLWZ90B7', 'ticketDesignator': null},
							],
						},
						'fareConstruction': {
							'line': 'MAN BA LON*BA HOU Q11.75 244.17BA LON Q11.75 211.53*BA LOS Q MANLOS11.75 299.01BA X/LON BA MAN Q LOSMAN11.75 133.84NUC935.55END ROE0.765832 XFIAH4.5',
							'error': null,
							'data': {
								'segments': [
									{
										'airline': 'BA',
										'flags': [],
										'destination': 'LON',
										'misc': [{'lexeme': 'sideTripStartOrEnd', 'data': null, 'raw': '*'}],
										'departure': 'MAN',
									},
									{
										'airline': 'BA',
										'flags': [],
										'destination': 'HOU',
										'fuelSurcharge': '11.75',
										'fuelSurchargeParts': ['11.75'],
										'fare': '244.17',
										'departure': 'LON',
									},
									{
										'airline': 'BA',
										'flags': [],
										'destination': 'LON',
										'fuelSurcharge': '11.75',
										'fuelSurchargeParts': ['11.75'],
										'fare': '211.53',
										'misc': [{'lexeme': 'sideTripStartOrEnd', 'data': null, 'raw': '*'}],
										'departure': 'HOU',
									},
									{
										'airline': 'BA',
										'flags': [],
										'destination': 'LOS',
										'fuelSurcharge': '11.75',
										'fuelSurchargeParts': ['11.75'],
										'fare': '299.01',
										'departure': 'LON',
									},
									{
										'airline': 'BA',
										'flags': [{'raw': 'X', 'parsed': 'noStopover'}],
										'destination': 'LON',
										'departure': 'LOS',
									},
									{
										'airline': 'BA',
										'flags': [],
										'destination': 'MAN',
										'fuelSurcharge': '11.75',
										'fuelSurchargeParts': ['11.75'],
										'fare': '133.84',
										'departure': 'LON',
									},
								],
								'markup': null,
								'currency': 'NUC',
								'fareAndMarkupInNuc': '935.55',
								'fare': '935.55',
								'hasEndMark': true,
								'infoMessage': null,
								'rateOfExchange': '0.765832',
								'facilityCharges': [{'airport': 'IAH', 'amount': '4.5'}],
								'hasHiddenFares': false,
							},
							'textLeft': '',
						},
						'fareConstructionInfo': {
							'unparsedLines': [],
							'endorsementBoxLines': [
								'NON-REF/NON-END/701633',
								'RESTRICTIONS MAY APPLY',
								'CARRIER RESTRICTION APPLY/PENALTY APPLIES',
								// not endorsement actually...
								'PRIVATE ¤',
							],
							'privateFareApplied': true,
							'validatingCarrier': 'BA',
						},
					},
				],
			},
		]);

		// PH PCC C5VD has unique pricing format
		list.push([
			php.implode(php.PHP_EOL, [
				'PSGR TYPE  ADT - 01',
				'     CXR RES DATE  FARE BASIS      NVB   NVA    BG',
				' NYC',
				' MNL PR  N   10DEC NKOXFNY               10DEC 02P',
				'FARE  USD   1378.00 EQUIV PHP     72166',
				'TAX   PHP       974US PHP       294AY PHP      3955XT',
				'TOTAL PHP     77389',
				'ADT-01  NKOXFNY',
				' NYC PR MNL1378.00NUC1378.00END ROE1.00',
				'XT PHP53YR PHP3666YQ PHP236XFJFK4.5',
				'ENDOS*SEG1*PREMIUM ECONOMY/FARE RULES APPLY',
				'RATE USED 1USD-52.37PHP',
				'ATTN*VALIDATING CARRIER - PR',
				'ATTN*BAG ALLOWANCE     -JFKMNL-02P/PR/EACH PIECE UP TO 55 POUND',
				'ATTN*S/25 KILOGRAMS',
				'ATTN*CARRY ON ALLOWANCE',
				'ATTN*JFKMNL-01P/07KG/PR',
				'ATTN*CARRY ON CHARGES',
				'ATTN*JFKMNL-PR-CARRY ON FEES UNKNOWN-CONTACT CARRIER',
				'ATTN*ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'  ',
				'PSGR TYPE  C05 - 02',
				'     CXR RES DATE  FARE BASIS      NVB   NVA    BG',
				' NYC',
				' MNL PR  N   10DEC NKOXFNY/CH25          10DEC 02P',
				'FARE  USD   1034.00 EQUIV PHP     54151',
				'TAX   PHP       974US PHP       294AY PHP      3955XT',
				'TOTAL PHP     59374',
				'C05-01  NKOXFNY/CH25',
				' NYC PR MNL1033.50NUC1033.50END ROE1.00',
				'XT PHP53YR PHP3666YQ PHP236XFJFK4.5',
				'ENDOS*SEG1*PREMIUM ECONOMY/FARE RULES APPLY',
				'RATE USED 1USD-52.37PHP',
				'ATTN*VALIDATING CARRIER - PR',
				'ATTN*BAG ALLOWANCE     -JFKMNL-02P/PR/EACH PIECE UP TO 55 POUND',
				'ATTN*S/25 KILOGRAMS',
				'ATTN*CARRY ON ALLOWANCE',
				'ATTN*JFKMNL-01P/07KG/PR',
				'ATTN*CARRY ON CHARGES',
				'ATTN*JFKMNL-PR-CARRY ON FEES UNKNOWN-CONTACT CARRIER',
				'ATTN*ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'         2412.00         126317      10446            136763TTL',
				'                                                               ',
				'ATTN*AIR EXTRAS AVAILABLE - SEE WP*AE',
				'.',
			]),
			{
			    "displayType": "philippinesPricing",
			    "dates": null,
			    "fares": [
			        {
			            "totals": {
			                "baseFare": {"currency":"USD","amount":"1378.00"},
			                "inDefaultCurrency": {"currency":"PHP","amount":"72166"},
			                "tax": null,
			                "total": {"currency":"PHP","amount":"77389","ptc":"ADT"},
			            },
			            "taxList": [
			                {"taxCode":"US","currency":"PHP","amount":"974"},
			                {"taxCode":"AY","currency":"PHP","amount":"294"},
			                {"taxCode":"YR","currency":"PHP","amount":"53"},
			                {"taxCode":"YQ","currency":"PHP","amount":"3666"},
			                {
			                    "taxCode": "XF",
			                    "currency": "PHP",
			                    "amount": "236",
			                    "facilityCharges": [{"airport":"JFK","amount":"4.5"}],
			                },
			            ],
			        },
			        {
			            "totals": {
			                "baseFare": {"currency":"USD","amount":"1034.00"},
			                "inDefaultCurrency": {"currency":"PHP","amount":"54151"},
			                "tax": null,
			                "total": {"currency":"PHP","amount":"59374","ptc":"C05"},
			            },
			            "taxList": [
			                {"taxCode":"US","currency":"PHP","amount":"974"},
			                {"taxCode":"AY","currency":"PHP","amount":"294"},
			                {"taxCode":"YR","currency":"PHP","amount":"53"},
			                {"taxCode":"YQ","currency":"PHP","amount":"3666"},
			                {
			                    "taxCode": "XF",
			                    "currency": "PHP",
			                    "amount": "236",
			                    "facilityCharges": [{"airport":"JFK","amount":"4.5"}],
			                },
			            ],
			        },
			    ],
			    "faresSum": {
			        "baseFare": "2412.00",
			        "inDefaultCurrency": "126317",
			        "tax": "10446",
			        "total": "136763",
			    },
			    "pqList": [
			        {
			            "fareBasisInfo": {
			                "ptc": "ADT",
			                "quantity": "01",
			                "records": [{"fareBasis":"NKOXFNY"}],
			            },
			            "fareConstruction": {
			                "data": {
			                    "segments": [
			                        {
			                            "airline": "PR",
			                            "flags": [],
			                            "destination": "MNL",
			                            "fare": "1378.00",
			                            "departure": "NYC",
			                        },
			                    ],
			                    "markup": null,
			                    "currency": "NUC",
			                    "fareAndMarkupInNuc": "1378.00",
			                    "fare": "1378.00",
			                    "hasEndMark": true,
			                    "infoMessage": null,
			                    "rateOfExchange": "1.00",
			                    "facilityCharges": [],
			                    "hasHiddenFares": false,
			                },
			                "textLeft": "",
			                "line": "NYC PR MNL1378.00NUC1378.00END ROE1.00",
			            },
			            "fareConstructionInfo": {
			                "unparsedLines": ["RATE USED 1USD-52.37PHP"],
			                "endorsementBoxLines": ["ENDOS*SEG1*PREMIUM ECONOMY/FARE RULES APPLY"],
			                "validatingCarrier": "PR",
			            },
			            "baggageInfo": {
			                "baggageAllowanceBlock": {
			                    "segments": [
			                        {
			                            "free": {
			                                "departureStopover": "JFK",
			                                "destinationStopover": "MNL",
			                                "amount": {"units":"pieces","amount":"02","unitsCode":"P","raw":"02P"},
			                                "airline": "PR",
			                                "sizeInfoRaw": "EACH PIECE UP TO 55 POUNDS/25 KILOGRAMS",
			                                "sizeInfo": {"weightInLb":"55","weightInKg":"25"},
			                                "remarks": [],
			                            },
			                            "fees": [],
			                        },
			                    ],
			                    "generalRemarks": [],
			                },
			                "carryOnAllowanceBlock": [
			                    {
			                        "bundle": {
			                            "cityPairs": [{"departureAirport":"JFK","destinationAirport":"MNL"}],
			                            "amount": {"units":"pieces","amount":"01","unitsCode":"P","raw":"01P"},
			                            "airline": "PR",
			                            "error": null,
			                            "isAvailable": true,
			                        },
			                        "pieces": [],
			                    },
			                ],
			                "carryOnChargesBlock": [
			                    {
			                        "bundle": {
			                            "cityPairs": [{"departureAirport":"JFK","destinationAirport":"MNL"}],
			                            "amount": null,
			                            "airline": "PR",
			                            "error": "CARRY ON FEES UNKNOWN-CONTACT CARRIER",
			                            "isAvailable": false,
			                        },
			                    },
			                ],
			                "disclaimer": ["ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY"],
			                "additionalInfo": null,
			            },
			            "baggageInfoDump": [
			                "BAG ALLOWANCE     -JFKMNL-02P/PR/EACH PIECE UP TO 55 POUND",
			                "S/25 KILOGRAMS",
			                "CARRY ON ALLOWANCE",
			                "JFKMNL-01P/07KG/PR",
			                "CARRY ON CHARGES",
			                "JFKMNL-PR-CARRY ON FEES UNKNOWN-CONTACT CARRIER",
			                "ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY",
			            ].join("\n"),
			        },
			        {
			            "fareBasisInfo": {
			                "ptc": "C05",
			                "quantity": "01",
			                "records": [{"fareBasis":"NKOXFNY","ticketDesignator":"CH25"}],
			            },
			            "fareConstruction": {
			                "data": {
			                    "segments": [
			                        {
			                            "airline": "PR",
			                            "flags": [],
			                            "destination": "MNL",
			                            "fare": "1033.50",
			                            "departure": "NYC",
			                        },
			                    ],
			                    "markup": null,
			                    "currency": "NUC",
			                    "fareAndMarkupInNuc": "1033.50",
			                    "fare": "1033.50",
			                    "hasEndMark": true,
			                    "infoMessage": null,
			                    "rateOfExchange": "1.00",
			                    "facilityCharges": [],
			                    "hasHiddenFares": false,
			                },
			                "textLeft": "",
			                "line": "NYC PR MNL1033.50NUC1033.50END ROE1.00",
			            },
			            "fareConstructionInfo": {
			                "unparsedLines": ["RATE USED 1USD-52.37PHP"],
			                "endorsementBoxLines": ["ENDOS*SEG1*PREMIUM ECONOMY/FARE RULES APPLY"],
			                "validatingCarrier": "PR",
			            },
			            "baggageInfo": {
			                "baggageAllowanceBlock": {
			                    "segments": [
			                        {
			                            "free": {
			                                "departureStopover": "JFK",
			                                "destinationStopover": "MNL",
			                                "amount": {"units":"pieces","amount":"02","unitsCode":"P","raw":"02P"},
			                                "airline": "PR",
			                                "sizeInfoRaw": "EACH PIECE UP TO 55 POUNDS/25 KILOGRAMS",
			                                "sizeInfo": {"weightInLb":"55","weightInKg":"25"},
			                                "remarks": [],
			                            },
			                            "fees": [],
			                        },
			                    ],
			                    "generalRemarks": [],
			                },
			                "carryOnAllowanceBlock": [
			                    {
			                        "bundle": {
			                            "cityPairs": [{"departureAirport":"JFK","destinationAirport":"MNL"}],
			                            "amount": {"units":"pieces","amount":"01","unitsCode":"P","raw":"01P"},
			                            "airline": "PR",
			                            "error": null,
			                            "isAvailable": true,
			                        },
			                        "pieces": [],
			                    },
			                ],
			                "carryOnChargesBlock": [
			                    {
			                        "bundle": {
			                            "cityPairs": [{"departureAirport":"JFK","destinationAirport":"MNL"}],
			                            "amount": null,
			                            "airline": "PR",
			                            "error": "CARRY ON FEES UNKNOWN-CONTACT CARRIER",
			                            "isAvailable": false,
			                        },
			                    },
			                ],
			                "disclaimer": ["ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY"],
			                "additionalInfo": null,
			            },
			            "baggageInfoDump": [
			                "BAG ALLOWANCE     -JFKMNL-02P/PR/EACH PIECE UP TO 55 POUND",
			                "S/25 KILOGRAMS",
			                "CARRY ON ALLOWANCE",
			                "JFKMNL-01P/07KG/PR",
			                "CARRY ON CHARGES",
			                "JFKMNL-PR-CARRY ON FEES UNKNOWN-CONTACT CARRIER",
			                "ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY",
			            ].join("\n"),
			        },
			    ],
				"dataExistsInfo": [{"name":"AIR EXTRAS","command":"WP*AE"}],
			    "additionalInfo": null,
			    "wasPqRetained": false,
			},
		]);

		// rebook line example
		list.push([
			php.implode(php.PHP_EOL, [
				'20MAY DEPARTURE DATE-----LAST DAY TO PURCHASE 31AUG/2359',
				'       BASE FARE                 TAXES/FEES/CHARGES    TOTAL',
				' 1-   USD4420.00                    245.53XT      USD4665.53ADT',
				'    XT    170.00YQ       1.00YR      37.20US       5.77YC ',
				'            7.00XY       3.96XA       5.60AY      10.50LI ',
				'            4.50XF ',
				' 1-   USD3315.00                    245.53XT      USD3560.53C05',
				'    XT    170.00YQ       1.00YR      37.20US       5.77YC ',
				'            7.00XY       3.96XA       5.60AY      10.50LI ',
				'            4.50XF ',
				'         7735.00                    491.06           8226.06TTL',
				'ADT-01  IXFNY',
				' NYC PR MNL2210.00PR NYC2210.00NUC4420.00END ROE1.00 XFJFK4.5',
				'FARE RULES APPLY/BUSINESS VALUE',
				'VALIDATING CARRIER - PR',
				'BAG ALLOWANCE     -JFKMNL-02P/PR/EACH PIECE UP TO 70 POUNDS/32 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'BAG ALLOWANCE     -MNLJFK-02P/PR/EACH PIECE UP TO 70 POUNDS/32 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'CARRY ON ALLOWANCE',
				'JFKMNL MNLJFK-01P/07KG/PR',
				'CARRY ON CHARGES',
				'JFKMNL MNLJFK-PR-CARRY ON FEES UNKNOWN-CONTACT CARRIER',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'CHANGE BOOKING CLASS -   1I 2I',
				'C05-01  IXFNY/CH25',
				' NYC PR MNL1657.50PR NYC1657.50NUC3315.00END ROE1.00 XFJFK4.5',
				'FARE RULES APPLY/BUSINESS VALUE',
				'VALIDATING CARRIER - PR',
				'BAG ALLOWANCE     -JFKMNL-02P/PR/EACH PIECE UP TO 70 POUNDS/32 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'BAG ALLOWANCE     -MNLJFK-02P/PR/EACH PIECE UP TO 70 POUNDS/32 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'CARRY ON ALLOWANCE',
				'JFKMNL MNLJFK-01P/07KG/PR',
				'CARRY ON CHARGES',
				'JFKMNL MNLJFK-PR-CARRY ON FEES UNKNOWN-CONTACT CARRIER',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'CHANGE BOOKING CLASS -   1I 2I',
				'.',
			]),
			{
				pqList: [{
					fareBasisInfo: {ptc: 'ADT'},
					rebookSegments: [
						{segmentNumber: '1', bookingClass: 'I'},
						{segmentNumber: '2', bookingClass: 'I'},
					],
				}, {
					fareBasisInfo: {ptc: 'C05'},
					rebookSegments: [
						{segmentNumber: '1', bookingClass: 'I'},
						{segmentNumber: '2', bookingClass: 'I'},
					],
				}],
			},
		]);

		// rebook line in embargo block example
		// pretty weird, but seems like embargo block applies for
		// everyone, but the rebook line applies to the last PTC only...
		list.push([
			php.implode(php.PHP_EOL, [
				'01OCT DEPARTURE DATE-----LAST DAY TO PURCHASE 01SEP/2359',
				'       BASE FARE      EQUIV AMT  TAXES/FEES/CHARGES    TOTAL',
				' 1-    GBP373.00      USD455.00     464.23XT       USD919.23JCB',
				'    XT    243.80YR      37.20US       5.77YC       7.00XY ',
				'            3.96XA       5.60AY      95.10GB      56.80UB ',
				'            9.00XF ',
				' 1-    GBP280.00      USD341.00     369.13XT       USD710.13J05',
				'    XT    243.80YR      37.20US       5.77YC       7.00XY ',
				'            3.96XA       5.60AY      56.80UB       9.00XF ',
				' 1-    GBP280.00      USD341.00     369.13XT       USD710.13J04',
				'    XT    243.80YR      37.20US       5.77YC       7.00XY ',
				'            3.96XA       5.60AY      56.80UB       9.00XF ',
				'          933.00        1137.00    1202.49           2339.49TTL',
				'JCB-01  SLX4C1M4/F179 SLW4C1M4/F179',
				' LON AA E/DFW AA CHI10M225.00AA LON242.16NUC467.16',
				' END ROE0.797802 XFDFW4.5ORD4.5',
				'CXL BY FLT TIME OR NOVALUE/CXL-CHG PEN APPLY/REF AGY ONLY/VALID',
				' AA/AJB PARTNERS ONLY',
				'PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING',
				'PRIVATE ¤',
				'VALIDATING CARRIER - AA',
				'BAG ALLOWANCE     -LHRDFW-01P/AA/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'2NDCHECKED BAG FEE-LHRDFW-USD79.00/AA/UP TO 50 POUNDS/23 KILOGR',
				'AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'BAG ALLOWANCE     -DFWLHR-01P/AA/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'2NDCHECKED BAG FEE-DFWLHR-USD79.00/AA/UP TO 50 POUNDS/23 KILOGR',
				'AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'CARRY ON ALLOWANCE',
				'LHRDFW DFWORD ORDLHR-02P/AA',
				'01/UP TO 40 LINEAR INCHES/101 LINEAR CENTIMETERS',
				'01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'CHANGE BOOKING CLASS -   1S 2S 3S',
				'J05-01  SLX4C1M4CH/F179 SLW4C1M4CH/F179',
				' LON AA E/DFW AA CHI10M168.75AA LON181.62NUC350.37',
				' END ROE0.797802 XFDFW4.5ORD4.5',
				'CXL BY FLT TIME OR NOVALUE/CXL-CHG PEN APPLY/REF AGY ONLY/VALID',
				' AA/AJB PARTNERS ONLY',
				'EACH J05 REQUIRES ACCOMPANYING SAME CABIN JCB',
				'PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING',
				'PRIVATE ¤',
				'VALIDATING CARRIER - AA',
				'BAG ALLOWANCE     -LHRDFW-01P/AA/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'2NDCHECKED BAG FEE-LHRDFW-USD79.00/AA/UP TO 50 POUNDS/23 KILOGR',
				'AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'BAG ALLOWANCE     -DFWLHR-01P/AA/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'2NDCHECKED BAG FEE-DFWLHR-USD79.00/AA/UP TO 50 POUNDS/23 KILOGR',
				'AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'CARRY ON ALLOWANCE',
				'LHRDFW DFWORD ORDLHR-02P/AA',
				'01/UP TO 40 LINEAR INCHES/101 LINEAR CENTIMETERS',
				'01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'CHANGE BOOKING CLASS -   1S 2S 3S',
				'J04-01  SLX4C1M4CH/F179 SLW4C1M4CH/F179',
				' LON AA E/DFW AA CHI10M168.75AA LON181.62NUC350.37',
				' END ROE0.797802 XFDFW4.5ORD4.5',
				'CXL BY FLT TIME OR NOVALUE/CXL-CHG PEN APPLY/REF AGY ONLY/VALID',
				' AA/AJB PARTNERS ONLY',
				'EACH J04 REQUIRES ACCOMPANYING SAME CABIN JCB',
				'PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING',
				'PRIVATE ¤',
				'VALIDATING CARRIER - AA',
				'BAG ALLOWANCE     -LHRDFW-01P/AA/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'2NDCHECKED BAG FEE-LHRDFW-USD79.00/AA/UP TO 50 POUNDS/23 KILOGR',
				'AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'BAG ALLOWANCE     -DFWLHR-01P/AA/EACH PIECE UP TO 50 POUNDS/23 ',
				'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'2NDCHECKED BAG FEE-DFWLHR-USD79.00/AA/UP TO 50 POUNDS/23 KILOGR',
				'AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
				'CARRY ON ALLOWANCE',
				'LHRDFW DFWORD ORDLHR-02P/AA',
				'01/UP TO 40 LINEAR INCHES/101 LINEAR CENTIMETERS',
				'01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS',
				'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
				'  ',
				'EMBARGOES-APPLY TO EACH PASSENGER',
				'LHRDFW ORDLHR-AA',
				'PET IN CABIN NOT PERMITTED',
				'OVER 100 POUNDS/45 KILOGRAMS NOT PERMITTED',
				'DFWORD-AA',
				'OVER 100 POUNDS/45 KILOGRAMS NOT PERMITTED',
				'CHANGE BOOKING CLASS -   1S 2S 3S',
				'                                                               ',
				'AIR EXTRAS AVAILABLE - SEE WP*AE',
				'.',
			]),
			{
				pqList: [{
					fareBasisInfo: {ptc: 'JCB'},
					rebookSegments: [
						{segmentNumber: '1', bookingClass: 'S'},
						{segmentNumber: '2', bookingClass: 'S'},
						{segmentNumber: '3', bookingClass: 'S'},
					],
				}, {
					fareBasisInfo: {ptc: 'J05'},
					rebookSegments: [
						{segmentNumber: '1', bookingClass: 'S'},
						{segmentNumber: '2', bookingClass: 'S'},
						{segmentNumber: '3', bookingClass: 'S'},
					],
				}, {
					fareBasisInfo: {ptc: 'J04'},
					rebookSegments: [
						{segmentNumber: '1', bookingClass: 'S'},
						{segmentNumber: '2', bookingClass: 'S'},
						{segmentNumber: '3', bookingClass: 'S'},
					],
				}],
			},
		]);

		// problems with fare calculation line, possibly because
		// surface segment is marked as connection - //X/NYC,
		// but likely because it is wrapped on X/ CHI
		list.push([
			php.implode(php.PHP_EOL, [
				"20DEC DEPARTURE DATE-----LAST DAY TO PURCHASE 23SEP/1838",
				"       BASE FARE                 TAXES/FEES/CHARGES    TOTAL",
				" 1-   USD1449.00                    531.71XT      USD1980.71JCB",
				"    XT    350.00YQ      10.28US       8.40ZP      37.20US ",
				"            5.77YC       7.00XY       3.96XA      11.20AY ",
				"            8.30DE      25.70RA      45.90OY      18.00XF ",
				"         1449.00                    531.71           1980.71TTL",
				"JCB-01  SH357NCE/CN10 SK357NCV/CN10",
				" ICT UA X/CHI UA MUC Q ICTMUC100.00 789.75UA X/EWR//X/NYC UA X/",
				" CHI UA ICT Q MUCICT100.00 459.00NUC1448.75END ROE1.00 ZPLGAORD",
				" XFICT4.5ORD4.5LGA4.5ORD4.5",
				"REFTHRUAG/NONEND/NONRERTE/LH/UA/AC/OS/SN/LX ONLY",
				"PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING",
				"PRIVATE ¤",
				"VALIDATING CARRIER - UA",
				"BAG ALLOWANCE     -ICTMUC-01P/UA/EACH PIECE UP TO 50 POUNDS/23 ",
				"KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS",
				"2NDCHECKED BAG FEE-ICTMUC-USD100.00/UA/UP TO 50 POUNDS/23 KILOG",
				"RAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS**",
				"BAG ALLOWANCE     -MUCICT-01P/UA/EACH PIECE UP TO 50 POUNDS/23 ",
				"KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS",
				"2NDCHECKED BAG FEE-MUCICT-USD100.00/UA/UP TO 50 POUNDS/23 KILOG",
				"RAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS**",
				"**BAG FEES APPLY AT EACH CHECK IN LOCATION",
				"CARRY ON ALLOWANCE",
				"ICTORD ORDMUC MUCEWR LGAORD ORDICT-01P/UA",
				"01/CARRY ON HAND BAGGAGE",
				"01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS",
				"CARRY ON CHARGES",
				"ICTORD ORDMUC MUCEWR LGAORD ORDICT-UA-CARRY ON FEES UNKNOWN-CON",
				"TACT CARRIER",
				"ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY",
				".",
			]),
			{
				pqList: [{
					fareBasisInfo: {ptc: 'JCB'},
					fareConstruction: {
						data: {
							segments: [
								{destination: 'CHI'},
								{destination: 'MUC'},
								{destination: 'EWR'},
								{destination: 'CHI'},
								{destination: 'ICT'},
							],
						},
					},
				}],
			},
		]);

		return list;
	}

	/**
	 * @test
	 * @dataProvider provideDumps
	 */
	testParser(dump, expectedResult) {
		let actualResult = WpPricingParser.parse(dump);
		this.assertArrayElementsSubset(expectedResult, actualResult);
	}

	getTestMapping() {
		return [
			[this.provideDumps, this.testParser],
		];
	}
}

module.exports = WpPricingParserTest;
