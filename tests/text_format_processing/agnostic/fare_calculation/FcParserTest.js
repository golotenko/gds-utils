
const php = require('enko-fundamentals/src/Transpiled/php.js');
const FareConstructionParser = require('../../../../src/text_format_processing/agnostic/fare_calculation/FcParser.js');

class FareConstructionParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js') {
	provideDumpsAndFullOutputs() {
		const list = [];

		list.push([
			php.implode(php.PHP_EOL, [
				'CEB PR MNL 15.00USD15.00END',
				'FARE USD 15.00 TAX 4.80LI TAX 37.00YQ TOT USD 56.80',
			]),
			{
				'parsed': {
					'fareAndMarkupInNuc': '15.00',
					'segments': [{'airline': 'PR', 'departure': 'CEB', 'destination': 'MNL', 'fare': '15.00'}],
				},
				'textLeft': 'FARE USD 15.00 TAX 4.80LI TAX 37.00YQ TOT USD 56.80',
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'CHI TK X/IST TK TLV 261.90TK X/IST TK CHI 261.90PC100.00',
				'NUC623.80END ROE1.0',
			]),
			{
				'parsed': {
					'markup': '100.00',
					'fareAndMarkupInNuc': '623.80',
					'segments': [{'airline': 'TK', 'departure': 'CHI', 'destination': 'IST'}],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'FAI UA X/CHI LH X/FRA LH X/JNB LH HRE 548.77/-JNB LX X/ZRH UA',
				'X/YTO UA X/CHI UA FAI 610.53NUC1159.30END ROE1.0 ZP FAI',
			]),
			[],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'WAS KL X/AMS KL AUH 402.00TLC2U0/LN614 /-CAI AF X/PAR AF WAS',
				'524.50THWC2U0/LN614 NUC926.50END ROE1.0',
			]),
			{
				'parsed': {
					'rateOfExchange': '1.0',
					'fareAndMarkupInNuc': '926.50',
					'segments': [
						{'airline': 'KL', 'departure': 'WAS', 'destination': 'AMS'},
						{
							'airline': 'KL',
							'departure': 'AMS',
							'destination': 'AUH',
							'fare': '402.00',
							'fareBasis': 'TLC2U0',
							'ticketDesignator': 'LN614',
						},
						{'airline': 'AF', 'departure': 'CAI', 'destination': 'PAR'},
						{
							'airline': 'AF',
							'departure': 'PAR',
							'destination': 'WAS',
							'fare': '524.50',
							'fareBasis': 'THWC2U0',
							'ticketDesignator': 'LN614',
						},
					],
				},
			},
		]);

		// #3
		list.push([
			php.implode(php.PHP_EOL, [
				'SFO EK X/DXB EK HYD Q350.00Q165.00 1656.50IEE30US1CH /-BLR EK',
				'X/DXB EK SFO Q350.00Q165.00 1656.50IEE30US1CH NUC4343.00END',
				'ROE1.0',
			]),
			{
				'parsed': {
					'segments': [
						{'airline': 'EK', 'departure': 'SFO', 'destination': 'DXB'},
						{
							'airline': 'EK',
							'departure': 'DXB',
							'destination': 'HYD',
							'fuelSurcharge': '515.00',
							'fuelSurchargeParts': ['350.00', '165.00'],
							'fare': '1656.50',
							'fareBasis': 'IEE30US1CH',
						},
						{'airline': 'EK', 'departure': 'BLR', 'destination': 'DXB'},
						{
							'airline': 'EK',
							'departure': 'DXB',
							'destination': 'SFO',
							'fuelSurcharge': '515.00',
							'fuelSurchargeParts': ['350.00', '165.00'],
							'fare': '1656.50',
							'fareBasis': 'IEE30US1CH',
						},
					],
				},
			},
		]);

		// #4
		list.push([
			php.implode(php.PHP_EOL, [
				'LIT AA X/CHI AA X/NYC AA E/MIL AA LON M LITMIL293.30AA X/DFW AA',
				'LIT M312.50NUC605.80END ROE1.0',
			]),
			{
				'parsed': {
					'segments': [
						{'airline': 'AA', 'departure': 'LIT', 'destination': 'CHI'},
						{'airline': 'AA', 'departure': 'CHI', 'destination': 'NYC'},
						{'airline': 'AA', 'departure': 'NYC', 'destination': 'MIL'},
						{'airline': 'AA', 'departure': 'MIL', 'destination': 'LON', 'fare': '293.30'},
						{'airline': 'AA', 'departure': 'LON', 'destination': 'DFW'},
						{'airline': 'AA', 'departure': 'DFW', 'destination': 'LIT', 'fare': '312.50'},
					],
				},
			},
		]);

		// #5 - with side trip
		list.push([
			php.implode(php.PHP_EOL, [
				'WAS LH LON 123.50LH BRU(LH BJL 195.54LH BRU 195.54)S100.00 LH',
				'WAS 184.00NUC798.58END ROE1.0',
			]),
			{
				'parsed': {
					'segments': [
						{'airline': 'LH', 'departure': 'WAS', 'destination': 'LON', 'fare': '123.50'},
						{'airline': 'LH', 'departure': 'LON', 'destination': 'BRU'},
						{'airline': 'LH', 'departure': 'BRU', 'destination': 'BJL', 'fare': '195.54'},
						{'airline': 'LH', 'departure': 'BJL', 'destination': 'BRU', 'fare': '195.54'},
						{'airline': 'LH', 'departure': 'BRU', 'destination': 'WAS', 'fare': '184.00'},
					],
				},
			},
		]);

		// #6
		list.push([
			php.implode(php.PHP_EOL, [
				'TYO NH OSA 21429JPY21429END',
			]),
			{
				'parsed': {
					'fareAndMarkupInNuc': '21429',
					'segments': [{'airline': 'NH', 'departure': 'TYO', 'destination': 'OSA', 'fare': '21429'}],
				},
			},
		]);

		// #7
		list.push([
			php.implode(php.PHP_EOL, [
				'MNL JL X/TYO AA X/LAX AA SEA E/XXX M432.50AA X/LAX AA X/TYO JL',
				'MNL E/XXX M432.50NUC865.00END ROE1.0',
			]),
			{
				'parsed': {
					'fareAndMarkupInNuc': '865.00',
					'rateOfExchange': '1.0',
					'segments': [
						{'airline': 'JL', 'departure': 'MNL', 'destination': 'TYO'},
						{'airline': 'AA', 'departure': 'TYO', 'destination': 'LAX'},
						{'airline': 'AA', 'departure': 'LAX', 'destination': 'SEA', 'fare': '432.50'},
						{'airline': 'AA', 'departure': 'SEA', 'destination': 'LAX'},
						{'airline': 'AA', 'departure': 'LAX', 'destination': 'TYO'},
						{'airline': 'JL', 'departure': 'TYO', 'destination': 'MNL', 'fare': '432.50'},
					],
				},
			},
		]);

		// #8
		list.push([
			php.implode(php.PHP_EOL, [
				'MKC UA X/WAS ET X/ADD ET NBO 359.55ET X/ADD ET X/WAS UA MKC',
				'359.55PC143.00 NUC862.10END ROE1.0 ZP MCI',
			]),
			[],
		]);

		// #9
		list.push([
			php.implode(php.PHP_EOL, [
				'FAI UA X/CHI LH X/FRA LH X/JNB LH HRE 731.70/-JNB LX X/ZRH UA',
				'X/YTO UA X/CHI UA FAI 814.05NUC1545.75END ROE1.0 ZP FAI',
			]),
			[],
		]);

		// #11
		list.push([
			php.implode(php.PHP_EOL, [
				'BNA AA NYC 265.12AA X/LON BA LUN M2369.50SA X/JNB BA X/LON AA',
				'NYC 10M2606.45AA BNA 265.12NUC5506.19END ROE1.0',
			]),
			{
				'parsed': {
					'segments': {
						'5': {
							'airline': 'AA',
							'departure': 'LON',
							'destination': 'NYC',
							'fare': '2606.45',
						},
					},
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'EWR DL X/DTT DL X/TYO DL MNL M292.50TRXSL59/LNE08 DL NYC',
				'M292.50TRXSL59/LNE08 NUC585.00END ROE1.0',
			]),
			{
				'parsed': {
					'fareAndMarkupInNuc': '585.00',
					'segments': {
						'0': {'airline': 'DL', 'departure': 'EWR', 'destination': 'DTT'},
						'2': {
							'airline': 'DL',
							'departure': 'TYO',
							'destination': 'MNL',
							'fare': '292.50',
							'fareBasis': 'TRXSL59',
							'ticketDesignator': 'LNE08',
						},
					},
				},
			},
		]);

		// total amount before XF
		list.push([
			'STL VS X/DTT VS X/LON VS LOS M178.19VS X/LON VS X/DTT DL STL M178.19NUC356.38 PLUS89.00END ROE1.00 13.50XFSTL4.50DTW4.5DTW4.5',
			{
				'parsed': {
					// ...
					'rateOfExchange': '1.00',
				},
			},
		]);

		// with both stopover fee and markup
		list.push([
			'CHI AA X/E/MAD IB DUS AA LON M76.80AA CHI76.80 1S100.00NUC253.60 PLUS63.00END ROE1.00 XFORD4.5',
			{
				'parsed': {
					// ...
					'segments': [
						{'destination': 'MAD'},
						{'destination': 'DUS'},
						{'destination': 'LON'},
						{
							'destination': 'CHI',
							'fare': '76.80',
							'stopoverFees': [
								{'stopoverNumber': '1', 'amount': '100.00'},
							],
						},
					],
					'currency': 'NUC',
					'fare': '253.60',
					'markup': '63.00',
					// ...
				},
			},
		]);

		// another with both stopover fee and markup
		list.push([
			'HOU AC AMS KQ NBO60.32KQ X/AMS AC HOU60.32 1S50.00NUC170.64 PLUS42.00END ROE1.00 XFIAH4.5',
			{
				'parsed': {
					'segments': [
						{'destination': 'AMS'},
						{'destination': 'NBO', 'fare': '60.32'},
						{'destination': 'AMS'},
						{
							'destination': 'HOU',
							'stopoverFees': [{'amount': '50.00'}],
						},
					],
				},
			},
		]);

		// space before END
		list.push([
			'NYC ET X/LFW KP LOS390.00KP X/LFW ET NYC150.00NUC540.00 END ROE1.00 XFEWR4.5',
			{
				'parsed': {
					'fareAndMarkupInNuc': '540.00',
					'rateOfExchange': '1.00',
				},
			},
		]);

		// with mileage surcharge "5M", "10M"
		list.push([
			'CLT VS X/DTT VS X/LON VS LOS5M139.74VS X/LON VS X/ATL VS CLT10M 146.39NUC286.13 PLUS71.00END ROE1.00 XFCLT3DTW4.5ATL4.5',
			{
				'parsed': {
					'segments': [
						[],
						[],
						{'fare': '139.74'},
						[],
						[],
						{'fare': '146.39'},
					],
				},
			},
		]);

		// fare before fuel surcharge
		list.push([
			php.implode(php.PHP_EOL, [
				'DLA ET X/ADD ET X/WAS ET ATL 317.10HLOWCM/HHPR Q',
				'DLAATL22.19NUC339.29 ---NET FARES SELECTED---END ROE613.508359',
			]),
			{
				'parsed': {
					'segments': [
						{'destination': 'ADD'},
						{'destination': 'WAS'},
						{
							'destination': 'ATL',
							'fare': '317.10',
							'fareBasis': 'HLOWCM',
							'ticketDesignator': 'HHPR',
						},
					],
					'fareAndMarkupInNuc': '339.29',
					'rateOfExchange': '613.508359',
				},
			},
		]);

		// fare before fuel surcharge
		list.push([
			php.implode(php.PHP_EOL, [
				'DLA ET X/ADD ET X/WAS ET ATL 352.34HLOWCM Q',
				'DLAATL24.66NUC377.00END ROE613.508359',
			]),
			{
				'parsed': {
					'segments': [
						{'destination': 'ADD'},
						{'destination': 'WAS'},
						{
							'destination': 'ATL',
							'fare': '352.34',
							'fareBasis': 'HLOWCM',
						},
					],
					'fareAndMarkupInNuc': '377.00',
					'rateOfExchange': '613.508359',
				},
			},
		]);

		// sabre>*VKTQKJ; fare before fuel surcharge
		list.push([
			'LON DL LAS128.07DL LON128.07Q LONLON37.89NUC294.03END ROE0.765204 XFLAS4.5',
			[],
		]);

		// sabre>*IZLZPA; fare before fuel surcharge
		list.push([
			'YYC AC X/YTO ET X/ADD ET LOS319.89ET X/ADD ET X/YTO AC YYC319.89Q YYCYYC15.65NUC655.43END ROE1.27771',
			[],
		]);

		// sabre>*PMKHVP; fare before fuel surcharge
		list.push([
			'LON VS LAS87.56VS LON87.56Q LONLON37.89NUC213.01END ROE0.765204 XFLAS4.5',
			[],
		]);

		// sabre>*ISAJMO; fare before fuel surcharge
		list.push([
			'YTO ET X/ADD ET NBO109.57ET X/ADD ET YTO109.57Q YTOYTO15.65NUC234.79END ROE1.27771',
			[],
		]);

		// apollo>*TLSSVA; with ZP tax code at end of fare calculation
		list.push([
			php.implode(php.PHP_EOL, [
				'BIL AS X/SEA AS EAT 166.03LSF300 AS X/SEA AS BIL 126.65KSF300',
				'USD292.68END ZP BILSEA0EAT0SEA',
			]),
			{
				'parsed': {
					'segments': [
						{'destination': 'SEA'},
						{'destination': 'EAT'},
						{'destination': 'SEA'},
						{'destination': 'BIL'},
					],
				},
			},
		]);

		// open jaw departure with flags
		list.push([
			php.implode(php.PHP_EOL, [
				'LAX BA LON 232.75NHX8S1T1W/J855 BA BUH//E/PAR Q25.00 BA X/NYC',
				'BA LAX 20M291.27NHN8D1Z1W/J855 NUC549.02END ROE1.0',
			]),
			{
				'parsed': {
					'segments': [
						{
							'destination': 'LON',
							'fare': '232.75',
							'fareBasis': 'NHX8S1T1W',
							'ticketDesignator': 'J855',
						},
						{
							'destination': 'BUH',
							'nextDeparture': {
								'fared': true,
								'flags': [{'raw': 'E'}],
								'city': 'PAR',
							},
							'fuelSurcharge': '25.00',
						},
						{
							'departure': 'PAR',
							'airline': 'BA',
							'destination': 'NYC',
						},
						{
							'destination': 'LAX',
							'mileageSurcharge': '20M',
							'fare': '291.27',
							'fareBasis': 'NHN8D1Z1W',
							'ticketDesignator': 'J855',
						},
					],
					'currency': 'NUC',
					'fare': '549.02',
					'rateOfExchange': '1.0',
				},
			},
		]);

		// apollo>FSNYC01JUNTIP/-*2CV4//@Y/|AA.AF.AT; fare basis "Y1" mistakenly treated as airline
		list.push([
			'NYC LH PAR 3278.00Y1 AF TUN 789.06YIF 8U TIP 93.85YOWLY1 NUC4160.91END ROE1.0',
			{
				'parsed': {
					'segments': [
						{'airline': 'LH', 'destination': 'PAR', 'fare': '3278.00', 'fareBasis': 'Y1'},
						{'airline': 'AF', 'destination': 'TUN'},
					],
				},
			},
		]);

		// apollo>*PZM46M; two letter fare basis - F0
		list.push([
			php.implode(php.PHP_EOL, [
				'LAX DL MIA 515.35HA0QA0FL DL LAX Q27.91 1178.60F0 USD1721.86END',
				'ZP LAXMIA',
			]),
			{
				'parsed': {
					'segments': [
						{
							'destination': 'MIA',
						},
						{
							'destination': 'LAX',
							'fareBasis': 'F0',
						},
					],
				},
			},
		]);

		// >*RBAYHL; airline glued to amount - 60.32KQ
		list.push([
			'HOU AC AMS KQ NBO60.32KQ X/AMS AC HOU60.32 1S50.00NUC170.64 PLUS42.00END ROE1.00 XFIAH4.5',
			{
				'parsed': {
					'segments': [
						{
							'destination': 'AMS',
						},
						{
							'destination': 'NBO',
							'fare': '60.32',
						},
						{
							'airline': 'KQ',
							'destination': 'AMS',
						},
					],
				},
			},
		]);

		// apollo>*TLSSVA; with ZP tax code at end of fare calculation
		list.push([
			php.implode(php.PHP_EOL, [
				'BIL AS X/SEA AS EAT 166.03LSF300 AS X/SEA AS BIL 126.65KSF300',
				'USD292.68END ZP BILSEA0EAT0SEA',
				'FARE USD SOME RANDOM TEXT',
			]),
			{
				'parsed': {
					'segments': [
						{'destination': 'SEA'},
						{'destination': 'EAT'},
						{'destination': 'SEA'},
						{'destination': 'BIL'},
					],
				},
				'textLeft': 'FARE USD SOME RANDOM TEXT',
			},
		]);

		list.push([
			'LOS KP X/LFW ET NYC150.00ET X/LFW KP LOS150.00NUC300.00 PLUS110.00 XFEWR4.50',
			{
				'parsed': {
					'segments': [
						{'destination': 'LFW'},
						{'destination': 'NYC'},
						{'destination': 'LFW'},
						{'destination': 'LOS', 'fare': '150.00'},
					],
					'currency': 'NUC',
					'fare': '300.00',
				},
			},
		]);

		// #31
		// with side trip
		list.push([
			'WAS LH LON 123.50LH BRU(LH BJL 195.54LH BRU 195.54)S100.00 LH WAS 184.00NUC798.58END ROE1.0',
			{
				'parsed': {
					'segments': [
						{'destination': 'LON'},
						{'destination': 'BRU', 'misc': [{'lexeme': 'sideTripStart'}], 'stopoverFees': [{'amount': '100.00'}]},
						{'destination': 'BJL', 'fare': '195.54'},
						{
							'destination': 'BRU',
							'fare': '195.54',
							'misc': [{'lexeme': 'sideTripEnd'}],
						},
						{'destination': 'WAS', 'fare': '184.00'},
					],
					'currency': 'NUC',
					'fare': '798.58',
				},
			},
		]);

		// with infoMessage
		list.push([
			'CHI LO WAW Q123.00 328.25T1JTAN/ITN5 NUC451.25 ---INFORMATIONAL FARES SEL ECTED---END ROE1.0',
			{
				'parsed': {
					'segments': [
						{
							'destination': 'WAW',
							'fareBasis': 'T1JTAN',
							'ticketDesignator': 'ITN5',
						},
					],
					'infoMessage': 'INFORMATIONAL FARES SEL ECTED',
				},
			},
		]);

		list.push([
			'LON WS YVR260.12//YYC WS X/E/YTO WS LON246.78NUC506.90END ROE0.749672',
			{
				'parsed': {
					'segments': [
						{
							'departure': 'LON',
							'airline': 'WS',
							'destination': 'YVR',
							'fare': '260.12',
							'nextDeparture': {'fared': true, 'city': 'YYC'},
						},
						{
							'airline': 'WS',
							'flags': [
								{'raw': 'X', 'parsed': 'noStopover'},
								{'raw': 'E', 'parsed': 'extraMiles'},
							],
							'destination': 'YTO',
						},
						{
							'airline': 'WS',
							'destination': 'LON',
							'fare': '246.78',
						},
					],
					'currency': 'NUC',
					'fareAndMarkupInNuc': '506.90',
					'fare': '506.90',
					'rateOfExchange': '0.749672',
				},
			},
		]);

		// without "END"
		list.push([
			'SAN AA X/LAX AA X/SAO G3 CGR Q SANCGR65.00M331.12JJ X/SAO AA X/LAX AA SAN Q CGRSAN65.00M424.87NUC885.99 XFSAN4.5LAX4.5LAX4.5',
			{
				'parsed': {
					'segments': [
						{'destination': 'LAX'},
						{'destination': 'SAO'},
						{
							'airline': 'G3',
							'destination': 'CGR',
							'fuelSurcharge': '65.00',
							'mileageSurcharge': 'M',
							'fare': '331.12',
						},
						{'destination': 'SAO'},
						{'destination': 'LAX'},
						{'destination': 'SAN'},
					],
					'currency': 'NUC',
					'fare': '885.99',
				},
			},
		]);

		// without "END"
		list.push([
			'LOS KP X/LFW ET NYC150.00ET X/LFW KP LOS150.00NUC300.00 PLUS110.00 XFEWR4.50',
			{
				'parsed': {
					'segments': [
						{'destination': 'LFW'},
						{'destination': 'NYC', 'fare': '150.00'},
						{'destination': 'LFW'},
						{'destination': 'LOS', 'fare': '150.00'},
					],
					'markup': '110.00',
					'currency': 'NUC',
					'fareAndMarkupInNuc': '410.00',
					'fare': '300.00',
				},
			},
		]);

		// #3 in currency without decimal part
		list.push([
			'TYO NH OSA 21429JPY21429END',
			{
				'parsed': {
					'segments': [
						{
							'departure': 'TYO',
							'airline': 'NH',
							'destination': 'OSA',
							'fare': '21429',
						},
					],
					'currency': 'JPY',
					'fare': '21429',
				},
			},
		]);

		// #4 with transatlantic flight
		list.push([
			'EWR DL X/DTT DL BJS M212.50/-SHA DL(PA) X/MSP DL CHI M446.25PC117.00 NUC775.75END ROE1.0',
			{
				'parsed': {
					'segments': [
						{'airline': 'DL', 'destination': 'DTT'},
						{'airline': 'DL', 'destination': 'BJS', 'nextDeparture': {'city': 'SHA'}},
						{'airline': 'DL', 'oceanicFlight': 'PA', 'destination': 'MSP'},
						{'airline': 'DL', 'destination': 'CHI'},
					],
				},
			},
		]);

		// #5 fare basis starting like fuel surcharge - 305.55Q3MNBZ/ITN3
		list.push([
			'SFO MU SHA 194.00VPRNB/ITN3 MU DPS 221.88ZLAP60BO/ITN3 MU X/SHA MU SFO 305.55Q3MNBZ/ITN3 NUC721.43 -INFORMATIONAL FARES SELEC TED-END ROE1.0',
			{
				'parsed': {
					'segments': [
						{'destination': 'SHA', 'fare': '194.00', 'fareBasis': 'VPRNB', 'ticketDesignator': 'ITN3'},
						{'destination': 'DPS', 'fare': '221.88', 'fareBasis': 'ZLAP60BO', 'ticketDesignator': 'ITN3'},
						{'destination': 'SHA'},
						{'destination': 'SFO', 'fare': '305.55', 'fareBasis': 'Q3MNBZ', 'ticketDesignator': 'ITN3'},
					],
					'currency': 'NUC',
					'fare': '721.43',
				},
			},
		]);

		// #6 >FSTYO10JUNOSA; more complex example of currency without decimal part
		list.push([
			'TYO NH FUK 20000HLRNDJ NH OSA 9259HLRNDJ JPY29259END',
			{
				'parsed': {
					'segments': [
						{'destination': 'FUK', 'fare': '20000', 'fareBasis': 'HLRNDJ'},
						{'destination': 'OSA', 'fare': '9259', 'fareBasis': 'HLRNDJ'},
					],
					'currency': 'JPY',
					'fare': '29259',
				},
			},
		]);

		// with differential - D FRALOS2084.92
		list.push([
			'PAR EW DUS 283.33MNCWGRFR LH X/FRA LH LOS M1950.74Y77RT D FRALOS2084.92 NUC4318.99END ROE0.935287',
			{
				'parsed': {
					'segments': [
						{
							'destination': 'DUS',
							'fare': '283.33',
							'fareBasis': 'MNCWGRFR',
						},
						{'destination': 'FRA'},
						{
							'destination': 'LOS',
							'mileageSurcharge': 'M',
							'fare': '1950.74',
							'fareBasis': 'Y77RT',
							'fareClassDifferences': [{'from': 'FRA', 'to': 'LOS', 'amount': '2084.92'}],
							'departure': 'FRA',
						},
					],
					'currency': 'NUC',
					'fare': '4318.99',
					'rateOfExchange': '0.935287',
				},
			},
		]);

		// S4 treated as stopover fee
		list.push([
			'BOS S4 PDL 172.66XS4/ITN3 S4 BOS 172.66XS4/ITN3 NUC345.32 -INFORMATIONAL FARES SELEC TED---END ROE1.0',
			{
				'parsed': {
					'segments': [
						{
							'airline': 'S4',
							'destination': 'PDL',
							'fare': '172.66',
							'fareBasis': 'XS4',
							'ticketDesignator': 'ITN3',
						},
						{
							'airline': 'S4',
							'destination': 'BOS',
							'fare': '172.66',
							'fareBasis': 'XS4',
							'ticketDesignator': 'ITN3',
						},
					],
					'currency': 'NUC',
					'fare': '345.32',
					'infoMessage': 'INFORMATIONAL FARES SELEC TED',
					'rateOfExchange': '1.0',
				},
			},
		]);

		// >*WFBPZ2; would fail in old parser due to Q25.00 after next departure
		list.push([
			'LAX BA LON 232.75NHX8S1T1W/J855 BA BUH//E/PAR Q25.00 BA X/NYC BA LAX 20M291.27NHN8D1Z1W/J855 PC29.00 NUC578.02END ROE1.0',
			{
				'parsed': {
					'segments': [
						{
							'destination': 'LON',
							'fare': '232.75',
							'fareBasis': 'NHX8S1T1W',
							'ticketDesignator': 'J855',
						},
						{
							'destination': 'BUH',
							'nextDeparture': {
								'fared': true,
								'flags': [{'raw': 'E', 'parsed': 'extraMiles'}],
								'city': 'PAR',
							},
							'fuelSurchargeParts': ['25.00'],
						},
						{
							'flags': [{'raw': 'X', 'parsed': 'noStopover'}],
							'destination': 'NYC',
						},
						{
							'destination': 'LAX',
							'mileageSurcharge': '20M',
							'fare': '291.27',
							'fareBasis': 'NHN8D1Z1W',
							'ticketDesignator': 'J855',
						},
					],
					'markup': '29.00',
					'currency': 'NUC',
					'fareAndMarkupInNuc': '578.02',
					'fare': '549.02',
					'rateOfExchange': '1.0',
				},
			},
		]);

		// >*W7TGC8; old parser fails on '//JNB(BA VFA'
		list.push([
			php.implode(php.PHP_EOL, [
				'SFO UA X/WAS Q25.00 ET X/ADD ET CPT 269.55VHPRUS //JNB(BA VFA',
				'56.22SAFR BA JNB 56.22SAFR)ET X/ADD ET X/NYC UA SFO Q',
				'CPTSFO50.00 269.55VHPRUS NUC726.54END ROE1.0',
			]),
			{
				'parsed': {
					'segments': [
						{'destination': 'WAS', 'fuelSurchargeParts': ['25.00']},
						{'destination': 'ADD'},
						{
							'destination': 'CPT',
							'fare': '269.55',
							'fareBasis': 'VHPRUS',
							'nextDeparture': {'fared': true, 'city': 'JNB'},
							'misc': [{'lexeme': 'sideTripStart'}],
						},
						{
							'airline': 'BA',
							'destination': 'VFA',
							'fare': '56.22',
							'fareBasis': 'SAFR',
						},
						{
							'airline': 'BA',
							'destination': 'JNB',
							'fare': '56.22',
							'fareBasis': 'SAFR',
							'misc': [{'lexeme': 'sideTripEnd'}],
						},
						{
							'airline': 'ET',
							'destination': 'ADD',
						},
						{'destination': 'NYC'},
						{
							'destination': 'SFO',
							'fuelSurchargeParts': ['50.00'],
							'fare': '269.55',
							'fareBasis': 'VHPRUS',
						},
					],
					'currency': 'NUC',
					'fare': '726.54',
					'rateOfExchange': '1.0',
				},
			},
		]);

		// #44
		// change of airports right after side trip in Fare Calculation followed by a fare - a broken fare
		// session #2915530
		//" 1 TK  32U 08OCT ATLIST SS1  1035P  440P|*      TU/WE   E  1",
		//" 2 TK1955V 09OCT ISTAMS SS1   645P  920P *         WE   E  1",
		//" 3 TK1958Q 12OCT AMSIST SS1   240P  700P *         SA   E",
		//" 4 TK 630U 18NOV ACCIST SS1   915P  700A|*      MO/TU   E  2",
		//" 5 TK  31U 19NOV ISTATL SS1   340P  810P *         TU   E  2",
		//>FQN
		//  QUOTE    1
		//  FARE  COMPONENT   BASIS
		//    1    IST-AMS    VT2PC6M        RULE/ROUTE APPLIES
		//    2    AMS-IST    QT2PX6M        RULE/ROUTE APPLIES
		//    3    ATL-ACC    UV3XPCFB       RULE/ROUTE APPLIES
		//    4    ACC-ATL    UV3XPCFB       RULE/ROUTE APPLIES
		list.push([
			php.implode(php.PHP_EOL, [
				"ATL TK IST Q6.00(TK AMS 45.00VT2PC6M TK IST Q5.00",
				"102.50QT2PX6M)//ACC 79.98UV3XPCFB TK X/IST TK ATL Q6.00",
				"79.98UV3XPCFB NUC324.46END ROE1.0",
			]),
			{
				parsed: {
					segments: [
						{departure: 'ATL', destination: 'IST', fuelSurchargeParts: ['6.00'], fare: '79.98', fareBasis: 'UV3XPCFB', misc: [{lexeme: 'sideTripStart'}]},
						{departure: 'IST', destination: 'AMS', fare: '45.00', fareBasis: 'VT2PC6M'},
						{departure: 'AMS', destination: 'IST', fuelSurchargeParts: ['5.00'], fare: '102.50', fareBasis: 'QT2PX6M', misc: [{lexeme: 'sideTripEnd'}]},
						{departure: 'ACC', destination: 'IST'},
						{departure: 'IST', destination: 'ATL', fuelSurchargeParts: ['6.00'], fare: '79.98', fareBasis: 'UV3XPCFB'},
					],
					'currency': 'NUC',
					'fare': '324.46',
					'rateOfExchange': '1.0',
				},
			},
		]);

		// >*T2W6PK; old parser would fail because it would treat Q0Q8FL as two fuel surcharges and airline
		list.push([
			php.implode(php.PHP_EOL, [
				'PDX AC YVR 238.00Q0Q8FL PR MNL Q11.32 369.22ULOXFCA/ITN5',
				'NUC618.54 -INFORMATIONAL FARES SELEC TED---END ROE1.0',
			]),
			{
				'parsed': {
					'segments': [
						{
							'destination': 'YVR',
							'fare': '238.00',
							'fareBasis': 'Q0Q8FL',
						},
						{
							'airline': 'PR',
							'destination': 'MNL',
							'fuelSurchargeParts': ['11.32'],
							'fare': '369.22',
							'fareBasis': 'ULOXFCA',
							'ticketDesignator': 'ITN5',
						},
					],
					'currency': 'NUC',
					'fare': '618.54',
					'infoMessage': 'INFORMATIONAL FARES SELEC TED',
					'rateOfExchange': '1.0',
				},
			},
		]);

		// >*V1VSDQ; with additional cities covered by fare - "WASADD304.50"
		list.push([
			php.implode(php.PHP_EOL, [
				'WAS ET ADD(ET EBB Q4.00 44.50TPRET ET ADD Q4.00 44.50TPRET)ET',
				'BLZ Q WASBLZ50.00WASADD304.50HLESUS ET X/ADD ET WAS',
				'279.50HLESUS NUC731.00END ROE1.0',
			]),
			{
				'parsed': {
					'segments': [
						{
							'departure': 'WAS',
							'destination': 'ADD',
							'misc': [{'lexeme': 'sideTripStart'}],
						},
						{
							'destination': 'EBB',
							'fuelSurcharge': '4.00',
							'fare': '44.50',
							'fareBasis': 'TPRET',
						},
						{
							'destination': 'ADD',
							'fuelSurcharge': '4.00',
							'fare': '44.50',
							'fareBasis': 'TPRET',
							'misc': [{'lexeme': 'sideTripEnd'}],
						},
						{
							'destination': 'BLZ',
							'fuelSurcharge': '50.00',
							'fareCities': ['WAS', 'ADD'],
							'fare': '304.50',
							'fareBasis': 'HLESUS',
						},
						{
							'flags': [{'raw': 'X', 'parsed': 'noStopover'}],
							'destination': 'ADD',
						},
						{
							'destination': 'WAS',
							'fare': '279.50',
							'fareBasis': 'HLESUS',
						},
					],
					'currency': 'NUC',
					'fare': '731.00',
					'rateOfExchange': '1.0',
				},
			},
		]);

		// >FSDFW03APRDEL12APRDFW/-*2CV4//@Y/|AA.AC.OS/;
		// "Q2LEM6" fare basis could be treated as fuel surcharge and total fare
		list.push([
			php.implode(php.PHP_EOL, [
				'DFW AC X/YTO 9W DEL 220.40O2LSTM2/SPLT5 9W X/YTO AC DFW 434.62Q2LEM6/SPLT5 NUC655.02 -DISCOUNTED FARES SELECTED --END ROE1.0',
			]),
			{
				'parsed': {
					'segments': [
						{'destination': 'YTO'},
						{
							'airline': '9W',
							'destination': 'DEL',
							'fare': '220.40',
							'fareBasis': 'O2LSTM2',
							'ticketDesignator': 'SPLT5',
						},
						{'destination': 'YTO'},
						{
							'destination': 'DFW',
							'fare': '434.62',
							'fareBasis': 'Q2LEM6',
							'ticketDesignator': 'SPLT5',
						},
					],
					'currency': 'NUC',
					'fare': '655.02',
					'infoMessage': 'DISCOUNTED FARES SELECTED',
					'rateOfExchange': '1.0',
				},
			},
		]);

		// >FSRIX24MARLON31MARRIX/-*2CV4//@Y/|AY.B2.LH/;
		// "Q70LGT1" fare basis could be treated as fuel surcharge and total fare
		list.push([
			'RIX LH X/FRA LH LON 40.62K25LGT5 LH X/FRA LH RIX 101.57Q70LGT1 NUC142.19END ROE0.935287',
			{
				'parsed': {
					'segments': [
						{'destination': 'FRA'},
						{
							'destination': 'LON',
							'fare': '40.62',
							'fareBasis': 'K25LGT5',
						},
						{'destination': 'FRA'},
						{
							'destination': 'RIX',
							'fare': '101.57',
							'fareBasis': 'Q70LGT1',
						},
					],
					'currency': 'NUC',
					'fare': '142.19',
					'rateOfExchange': '0.935287',
				},
			},
		]);

		// >*LW6NRG; fare after next departure - HRE//LVI M43.44NAFR
		list.push([
			php.implode(php.PHP_EOL, [
				'ICT BA X/CHI BA X/LON BA JNB M425.00NKNCNA BA HRE//LVI',
				'M43.44NAFR BA JNB 3.81OAFR BA X/LON BA X/DFW BA ICT',
				'M425.00NKNCNA NUC897.25END ROE1.0',
			]),
			{
				'parsed': {
					'segments': [
						{'destination': 'CHI'},
						{'destination': 'LON'},
						{
							'destination': 'JNB',
							'mileageSurcharge': 'M',
							'fare': '425.00',
							'fareBasis': 'NKNCNA',
						},
						{
							'destination': 'HRE',
							'nextDeparture': {'fared': true, 'flags': [], 'city': 'LVI'},
							'mileageSurcharge': 'M',
							'fare': '43.44',
							'fareBasis': 'NAFR',
						},
						{
							'destination': 'JNB',
							'fare': '3.81',
							'fareBasis': 'OAFR',
						},
						{'destination': 'LON'},
						{'destination': 'DFW'},
						{
							'destination': 'ICT',
							'mileageSurcharge': 'M',
							'fare': '425.00',
							'fareBasis': 'NKNCNA',
						},
					],
					'currency': 'NUC',
					'fare': '897.25',
					'rateOfExchange': '1.0',
				},
			},
		]);

		// with a 'P MIASAO380.00' - Required Minimum
		list.push([
			php.implode(php.PHP_EOL, [
				'MIA 4M BUE Q430.00 1020.00LA SAO JJ MIA Q BUEMIA430.00M',
				'MIASAO1400.00P MIASAO380.00 NUC3660.00END ROE1.0',
			]),
			{
				'parsed': {
					'segments': [
						{'destination': 'BUE', 'fuelSurcharge': '430.00', 'fare': '1020.00'},
						{'destination': 'SAO'},

						{
							'destination': 'MIA',
							'fuelSurcharge': '430.00',
							'fare': '1400.00',
							'requiredMinimum': {
								'from': 'MIA',
								'to': 'SAO',
								'amount': '380.00',
							},
						},
					],
					'currency': 'NUC',
					'fare': '3660.00',
					'rateOfExchange': '1.0',
				},

			},
		]);

		// sabre>*ZPBOLH; "ZPRDU" - ZP tax with just one airport and no amount
		list.push([
			'NYC AF X/E/PAR AF CKY KP ABJ M220.00AF X/E/PAR AF X/RDU DL NYC M64.50NUC284.50END ROE1.00 ZPRDU XFJFK4.5RDU4.5',
			{
				'parsed': {
					'segments': [
						{'airline': 'AF', 'destination': 'PAR'},
						{'airline': 'AF', 'destination': 'CKY'},
						{'airline': 'KP', 'destination': 'ABJ', 'fare': '220.00'},
						{'airline': 'AF', 'destination': 'PAR'},
						{'airline': 'AF', 'destination': 'RDU'},
						{'airline': 'DL', 'destination': 'NYC', 'fare': '64.50'},
					],
					'fare': '284.50',
					'facilityCharges': [
						{'airport': 'JFK', 'amount': '4.5'},
						{'airport': 'RDU', 'amount': '4.5'},
					],
				},
			},
		]);

		// >*M65PT0; with a discount - >HELP DF;
		list.push([
			'CHI BR X/TPE BR MNL 262.50BR X/TPE BR CHI 262.50LC110.00 NUC415.00END ROE1.0',
			{
				'parsed': {
					'segments': [
						{'airline': 'BR', 'destination': 'TPE'},
						{'airline': 'BR', 'destination': 'MNL', 'fare': '262.50'},
						{'airline': 'BR', 'destination': 'TPE'},
						{'airline': 'BR', 'destination': 'CHI', 'fare': '262.50'},
					],
					'markup': '-110.00',
					'fare': '525.00',
					'fareAndMarkupInNuc': '415.00',
				},
			},
		]);

		// >FSATL25SEPSDQ30SEPATL/-*2CV4//@C/|AA.AM.DL/;
		// two fare cass differences
		list.push([
			'ATL AA NYC 366.51L3AIZND1 AA X/MIA AA SDQ 746.00Y1NFFQN5 AA X/MIA AA CHI 1068.00Y1NFFQN5 AA ATL 264.19S7AHZNI1 D MIASDQ439.00 D MIASDQ439.00 NUC3322.70END ROE1.0',
			{
				'parsed': {
					'segments': [
						{'destination': 'NYC', 'fare': '366.51', 'fareBasis': 'L3AIZND1'},
						{'destination': 'MIA'},
						{'destination': 'SDQ', 'fare': '746.00', 'fareBasis': 'Y1NFFQN5'},
						{'destination': 'MIA'},
						{'destination': 'CHI', 'fare': '1068.00', 'fareBasis': 'Y1NFFQN5'},
						{
							'destination': 'ATL',
							'fare': '264.19',
							'fareBasis': 'S7AHZNI1',
							'fareClassDifferences': [
								{'from': 'MIA', 'to': 'SDQ', 'amount': '439.00'},
								{'from': 'MIA', 'to': 'SDQ', 'amount': '439.00'},
							],
						},
					],
					'currency': 'NUC',
					'fare': '3322.70',
				},
			},
		]);

		// M/BT hidden fares
		list.push([
			'LOS KP X/LFW ET EWR M/BT TLPRUS ET X/LFW KP LOS M/BT TLPRUS END  XF EWR4.5',
			{
				'parsed': {
					'hasHiddenFares': true,
					'segments': [
						{'airline': 'KP', 'destination': 'LFW'},
						{
							'airline': 'ET', 'destination': 'EWR',
							'fare': 'BT',
							'fareBasis': 'TLPRUS',
						},
						{'airline': 'ET', 'destination': 'LFW'},
						{
							'airline': 'KP', 'destination': 'LOS',
							'fare': 'BT',
							'fareBasis': 'TLPRUS',
						},
					],
					'facilityCharges': [{'airport': 'EWR', 'amount': '4.5'}],
				},
			},
		]);

		// M/IT hidden fares
		list.push([
			'MIA QR X/DOH QR CPT Q MIACPT350.00 M/IT IJUSNTRE QR X/DOH QR  MIA M/IT IJUSNTRE END XF MIA4.5',
			{
				'parsed': {
					'hasHiddenFares': true,
					'segments': [
						{'airline': 'QR', 'destination': 'DOH'},
						{
							'airline': 'QR', 'destination': 'CPT',
							'fuelSurchargeParts': ['350.00'],
							'fare': 'IT',
							'isFareHidden': true,
							'fareBasis': 'IJUSNTRE',
						},
						{'airline': 'QR', 'destination': 'DOH'},
						{
							'airline': 'QR', 'destination': 'MIA',
							'fare': 'IT',
							'isFareHidden': true,
							'fareBasis': 'IJUSNTRE',
						},
					],
					'currency': null,
					'fareAndMarkupInNuc': null,
					'fare': null,
					'hasEndMark': true,
					'facilityCharges': [{'airport': 'MIA', 'amount': '4.5'}],
				},
			},
		]);

		// M/IT hidden fares
		list.push([
			'LOS VS X/LON VS BOS M/IT OLAF03MN/AO12 VS X/LON VS LOS M/IT OLAF03MN/AO12 END XF BOS4.5',
			{
				'parsed': {
					'hasHiddenFares': true,
					'segments': [
						{'airline': 'VS', 'destination': 'LON'},
						{
							'airline': 'VS', 'destination': 'BOS',
							'fare': 'IT',
							'isFareHidden': true,
							'fareBasis': 'OLAF03MN',
							'ticketDesignator': 'AO12',
						},
						{'airline': 'VS', 'destination': 'LON'},
						{
							'airline': 'VS', 'destination': 'LOS',
							'fare': 'IT',
							'isFareHidden': true,
							'fareBasis': 'OLAF03MN',
							'ticketDesignator': 'AO12',
						},
					],
					'currency': null,
					'facilityCharges': [{'airport': 'BOS', 'amount': '4.5'}],
				},
			},
		]);

		// artificially made to point out that 2-letter fare basis in last
		// segment would make a valid segment with currency as city
		list.push([
			'HOU AC AMS KQ NBO60.32KQ AMS60.32 1S50.00NUC170.64 PLUS42.00END ROE1.00 XFIAH4.5',
			{
				'parsed': {
					'segments': [
						{'airline': 'AC', 'destination': 'AMS'},
						{'airline': 'KQ', 'destination': 'NBO', 'fare': '60.32'},
						{'airline': 'KQ', 'destination': 'AMS', 'fare': '60.32'},
					],
					'currency': 'NUC',
					'fare': '170.64',
					'markup': '42.00',
				},
			},
		]);

		// artificially constructed
		// fare basis that could start with "ZP" or "XF"
		list.push([
			'KIV PS RIX75.00ZPINF UA TYO75.00XFCHD5 NUC150.00 END ZPRIX XFRIX4.5',
			{
				'parsed': {
					'segments': [
						{
							'airline': 'PS',
							'destination': 'RIX',
							'fare': '75.00',
							'fareBasis': 'ZPINF',
						},
						{
							'airline': 'UA',
							'destination': 'TYO',
							'fare': '75.00',
							'fareBasis': 'XFCHD5',
						},
					],
					'fare': '150.00',
					'facilityCharges': [
						{'airport': 'RIX', 'amount': '4.5'},
					],
				},
			},
		]);

		// artificially constructed
		// QRBNXO, with B/SAO
		// 0AA1613H 30JUL SJUMIA HK1
		// 0AA 905P 30JUL MIAGIG HK1
		list.push([
			php.implode(php.PHP_EOL, [
				'SJU AA X/E/MIA AA RIO Q70.00B/SAO M773.50OHN2DSN1/F268 AA',
				'X/E/MIA Q70.00 AA SJU B/SAO M423.50OLN2DSN1/F268 NUC1337.00END',
				'ROE1.0',
			]),
			{
				'parsed': {
					'segments': [
						{'destination': 'MIA'},
						{
							'destination': 'RIO',
							'fuelSurcharge': '70.00',
							'misc': [{'lexeme': 'mileageEqualizationPoint', 'data': 'SAO'}],
							'fare': '773.50',
							'fareBasis': 'OHN2DSN1',
							'ticketDesignator': 'F268',
						},
						{'destination': 'MIA', 'fuelSurcharge': '70.00'},
						{
							'destination': 'SJU',
							'misc': [{'lexeme': 'mileageEqualizationPoint', 'data': 'SAO'}],
							'fare': '423.50',
							'fareBasis': 'OLN2DSN1',
							'ticketDesignator': 'F268',
						},
					],
					'fare': '1337.00',
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'MNL PR ILO 15.00PR MNL 15.00USD30.00END',
			]),
			[],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'MNL PR DVO 25.00PR MNL 50.00USD75.00END',
				'',
			]),
			[],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'NBO KQ MBA 56.00KQ X/NBO KQ KIS 52.00KQ NBO 30.00USD138.00END',
				'',
			]),
			[],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'YMQ KL X/YTO KL AMS(KL KUL 220.31AF AMS 162.95)AF PAR Q14.57',
				'150.61AF YMQ 150.61NUC699.05END ROE1.0291',
				'',
			]),
			[],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'MEM DL X/ATL DL X/DXB AI VTZ AI BOM M MEMVTZ388.38DL X/PAR DL',
				'X/HOU DL MEM M369.00 1S50.00PC71.00 NUC878.38END ROE1.0',
			]),
			[],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'ORF AF X/NYC AF E/PAR(AF CAN 189.03AF PAR 189.03)AF MLW',
				'M725.00AF X/E/PAR AF X/NYC AF ORF M725.00NUC1828.06END ROE1.0',
			]),
			[],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'MNL PR ZAM 25.00PR MNL 25.00PR ILO 15.00PR MNL 15.00USD80.00END',
			]),
			[],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'YTO DL X/AMS DL ACC Q14.57 10M445.88DL X/NYC DL YTO',
				'Q14.57M405.35PC41.78 NUC922.15END ROE1.0291',
			]),
			[],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'SLC KL X/HOU KL X/AMS KL HEL Q50.00 10M283.25KL X/AMS KL X/DFW',
				'KL SLC Q50.00 5M238.87NUC622.12END ROE1.0',
			]),
			[],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'LOS DL X/E/ATL DL EWR M249.50DL X/DTT DL LON',
				'5M110.25NUC359.75END ROE1.0',
			]),
			[],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'NYC 9W X/BOM 9W BLR M540.00 9W X/BOM 9W NYC M425.00NUC965.00END',
				'ROE1.0',
			]),
			{
				'parsed': {
					'fareAndMarkupInNuc': '965.00',
					'rateOfExchange': '1.0',
					'segments': [
						{'airline': '9W', 'departure': 'NYC', 'destination': 'BOM'},
						{'airline': '9W', 'departure': 'BOM', 'destination': 'BLR', 'fare': '540.00'},
						{'airline': '9W', 'departure': 'BLR', 'destination': 'BOM'},
						{'airline': '9W', 'departure': 'BOM', 'destination': 'NYC', 'fare': '425.00'},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'MIA AA X/NYC QR X/DOH QR LHE 452.00ELE6MUS QR DOH(QR DXB',
				'17.85ERRSUP1 QR DOH 17.85ERRSUP1)QR X/NYC AA MIA Q25.00',
				'452.00ELE6MUS NUC964.70END ROE1.0',
			]),
			{
				'parsed': {
					'segments': [
						{'airline': 'AA', 'departure': 'MIA', 'destination': 'NYC'},
						{'airline': 'QR', 'departure': 'NYC', 'destination': 'DOH'},
						{
							'airline': 'QR',
							'departure': 'DOH',
							'destination': 'LHE',
							'fare': '452.00',
							'fareBasis': 'ELE6MUS',
						},
						{'airline': 'QR', 'departure': 'LHE', 'destination': 'DOH'},
						{
							'airline': 'QR',
							'departure': 'DOH',
							'destination': 'DXB',
							'fare': '17.85',
							'fareBasis': 'ERRSUP1',
						},
						{
							'airline': 'QR',
							'departure': 'DXB',
							'destination': 'DOH',
							'fare': '17.85',
							'fareBasis': 'ERRSUP1',
						},
						{'airline': 'QR', 'departure': 'DOH', 'destination': 'NYC'},
						{'airline': 'AA', 'departure': 'NYC', 'destination': 'MIA', 'fuelSurcharge': '25.00'},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'FNA AF X/E/PAR DL X/ATL DL WAS 5M341.25DL X/E/PAR AF FNA',
				'M325.00NUC666.25END ROE1.0',
			]),
			[],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'JAX AA X/CHI AA YTO Q7.50 259.00GA07ERC1 AC YQG Q2.91Q8.75',
				'222.70W10Z2TPA NUC500.86END ROE1.',
			]),
			{
				'parsed': {'rateOfExchange': '1.'},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'EWR DL X/DTT DL BJS M212.50/-SHA DL(PA) X/MSP DL CHI',
				'M446.25PC117.00 NUC775.75END ROE1.0',
			]),
			[],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'PHX US X/CLT LH X/MUC//X/FRA A3 SKG 239.00KKXNC5S /-BUD LH',
				'X/FRA LH X/WAS UA X/DEN UA PHX 170.00KKXNC5S NUC409.00END',
				'ROE1.0',
			]),
			{
				'parsed': {
					'segments': [
						{'airline': 'US', 'departure': 'PHX', 'destination': 'CLT'},
						{'airline': 'LH', 'departure': 'CLT', 'destination': 'MUC'},
						{
							'airline': 'A3',
							'departure': 'FRA',
							'destination': 'SKG',
							'fare': '239.00',
							'fareBasis': 'KKXNC5S',
						},
						{'airline': 'LH', 'departure': 'BUD', 'destination': 'FRA'},
						{'airline': 'LH', 'departure': 'FRA', 'destination': 'WAS'},
						{'airline': 'UA', 'departure': 'WAS', 'destination': 'DEN'},
						{
							'airline': 'UA',
							'departure': 'DEN',
							'destination': 'PHX',
							'fare': '170.00',
							'fareBasis': 'KKXNC5S',
						},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'CHI FJ X/LAX FJ NAN//SYD 1776.00ZSPCLUR FJ NAN 891.94DBULAB FJ',
				'X/LAX FJ CHI 1877.50CBULART NUC4545.44END ROE1.0',
			]),
			{
				'parsed': {
					'segments': [
						{'airline': 'FJ', 'departure': 'CHI', 'destination': 'LAX'},
						{
							'airline': 'FJ',
							'departure': 'LAX',
							'destination': 'NAN',
							'fare': '1776.00',
							'fareBasis': 'ZSPCLUR',
						},
						{
							'airline': 'FJ',
							'departure': 'SYD',
							'destination': 'NAN',
							'fare': '891.94',
							'fareBasis': 'DBULAB',
						},
						{'airline': 'FJ', 'departure': 'NAN', 'destination': 'LAX'},
						{
							'airline': 'FJ',
							'departure': 'LAX',
							'destination': 'CHI',
							'fare': '1877.50',
							'fareBasis': 'CBULART',
						},
					],
				},
			},
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'WAS UA X/PAR SN X/BRU SN FNA 301.50LLNC5T/SPLT5 LH X/BRU LH WAS',
				'585.50HL2RCE/SPLT5 NUC887.00 -DISCOUNTED FARES SELECTED ---',
				'-DISCOUNTED FARES SELECTE D---END ROE1.0',
			]),
			[],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'SEA BR X/TPE BR MNL 289.00VLX3R/SPLT5USD30 BR X/TPE BR SEA',
				'312.75VLW3R/SPLT5USD30 NUC601.75 -DISCOUNTED FARES SELECTED',
				'---END ROE1.0',
			]),
			{
				'parsed': {
					'fareAndMarkupInNuc': '601.75',
					'rateOfExchange': '1.0',
					'segments': [
						{'airline': 'BR', 'departure': 'SEA', 'destination': 'TPE'},
						{
							'airline': 'BR',
							'departure': 'TPE',
							'destination': 'MNL',
							'fare': '289.00',
							'fareBasis': 'VLX3R',
							'ticketDesignator': 'SPLT5USD30',
						},
						{'airline': 'BR', 'departure': 'MNL', 'destination': 'TPE'},
						{
							'airline': 'BR',
							'departure': 'TPE',
							'destination': 'SEA',
							'fare': '312.75',
							'fareBasis': 'VLW3R',
							'ticketDesignator': 'SPLT5USD30',
						},
					],
				},
			},
		]);

		// with 10M (mileage)
		list.push([
			php.implode(php.PHP_EOL, [
				'RUH SV MED 112.78//JED SV DXB 10M JEDDXB139.30NUC252.08END',
				'ROE3.75058',
			]),
			{
				'parsed': {
					'segments': [
						{'destination': 'MED'},
						{
							'departure': 'JED',
							'destination': 'DXB',
							'mileageSurcharge': '10M',
							'fare': '139.30',
						},
					],
				},
			},
		]);

		// parser mistook 5M (mileage) for an airline
		list.push([
			php.implode(php.PHP_EOL, [
				'JNB DL X/ATL DL FLL DL X/NYC DL BOS 5M JNBFLL386.99ULPXAFW5 DL',
				'X/AMS DL JNB M254.09XLPXAFW5 1S100.00 NUC741.08END ROE13.69568',
				'ZP ATLFLLJFK',
			]),
			{
				'parsed': {
					'segments': [
						{'destination': 'ATL'},
						{'destination': 'FLL'},
						{'destination': 'NYC'},
						{
							'airline': 'DL',
							'destination': 'BOS',
							'mileageSurcharge': '5M',
							'fare': '386.99',
							'fareBasis': 'ULPXAFW5',
						},
					],
				},
			},
		]);

		// From Galileo: to verify that all tokens are parsed correctly, FareConstructionParser
		// compares the sum of prices of segments to total amount; here 71.50 + 34.96 + 15.89 = 122.35 != NUC122.34
		// Probably this shouldn't be considered correct pricing, but this isn't for parser to decide anyway, so this
		// should pass
		list.push([
			php.implode(php.PHP_EOL, [
				'LON UA HOU UA LAX S71.50 UA SFO 34.96 UA LON 15.89 NUC122.34END ROE0.786665   XF 3.40SFO 4.5 ',
			]),
			{
				'parsed': {'fareAndMarkupInNuc': '122.34'},
				'textLeft': 'XF 3.40SFO 4.5 ',
			},
		]);

		// With "E/" before stopover. Did not find explanation in ticketing cookbook, but word
		// "excess" figured much around the stopover token there, so it must be it I guess
		// session #558446
		list.push([
			php.implode(php.PHP_EOL, [
				'DFW DL X/ATL E/S10.00 DL ROM//VCE AF PAR Q',
				'DFWPAR2.15M254.00VH7B1RC2/LN19 DL X/ATL DL DFW',
				'M239.00XH7B1RM3/LN19 1S100.00 NUC605.15END ROE1.0',
			]),
			{
				parsed: {
					segments: [
						{airline: 'DL', destination: 'ATL', stopoverFees: [{amount: '10.00'}]},
						{airline: 'DL', destination: 'ROM'},
						{airline: 'AF', destination: 'PAR', fare: '254.00', fareBasis: 'VH7B1RC2', ticketDesignator: 'LN19'},
						{airline: 'DL', destination: 'ATL'},
						{airline: 'DL', destination: 'DFW', fare: '239.00', stopoverFees: [{stopoverNumber:'1',amount:'100.00'}]},
					],
					fare: '605.15',
				},
			},
		]);

		// another "E/" example, session #833810
		list.push([
			php.implode(php.PHP_EOL, [
				"MSY DL X/ATL E/S10.00 DL ROM DL AMS Q",
				"MSYAMS2.15M380.50XH7B1RC3/LN19 DL X/DTT S11.19 DL MSY",
				"M305.50VH7B1RC3/LN19 NUC709.34END ROE1.0",
			]),
			{
				parsed: {
					segments: [
						{airline: 'DL', destination: 'ATL', stopoverFees: [{amount: '10.00'}]},
						{airline: 'DL', destination: 'ROM'},
						{airline: 'DL', destination: 'AMS', fare: '380.50', fareBasis: 'XH7B1RC3', ticketDesignator: 'LN19'},
						{airline: 'DL', destination: 'DTT', stopoverFees: [{amount: '11.19'}]},
						{airline: 'DL', destination: 'MSY', fare: '305.50'},
					],
					fare: '709.34',
				},
			},
		]);

		// from Sabre pricing - segment split on "UA X/ CHI"
		list.push([
			php.implode(php.PHP_EOL, [
				"ICT UA X/CHI UA MUC Q ICTMUC100.00 789.75UA X/EWR//X/NYC UA X/",
				"CHI UA ICT Q MUCICT100.00 459.00NUC1448.75END ROE1.00 ZPLGAORD",
				"XFICT4.5ORD4.5LGA4.5ORD4.5",
			]),
			{
				parsed: {
					segments: [
						{destination: 'CHI'},
						{destination: 'MUC'},
						{destination: 'EWR'},
						{destination: 'CHI'},
						{destination: 'ICT'},
					],
					fare: '1448.75',
				},
			},
		]);

		// negative NUC due to LC100.00 discount being larger than
		list.push([
			[
				'NYC VS X/LON VS JNB M38.50OLRP7SMN/AO11 VS X/LON VS NYC',
				'M38.50OLRP7SMN/AO11 LC100.00 NUC-23.00END ROE1.0',
			].join('\n'),
			{
				parsed: {
					segments: [
						{destination: 'LON'},
						{destination: 'JNB', fare: '38.50', fareBasis: 'OLRP7SMN', ticketDesignator: 'AO11'},
						{destination: 'LON'},
						{destination: 'NYC', fare: '38.50', fareBasis: 'OLRP7SMN', ticketDesignator: 'AO11'},
					],
					fare: '77.00',
					fareAndMarkupInNuc: '-23.00',
				},
			},
		]);

		// ////================================================================
		// /// following are some sabre FC formats not supported by Parser yet
		// ////================================================================

		// // not sure about fixing them, they are most likely written by hand with typos

		// // >*GEQZCZ; starting with date and without NUC and total amount
		// $list[] = [
		//     '28OCT EWR ET LFW KP LOS390.00 END XFEWR4.50',
		//     [],
		// ];

		// // >*RXVQIT; "BT" instead of amounts and "IT" instead of currencies
		// $list[] = [
		//     'BOS UA X/WAS AC X/AMS KQ NBO BT KQ X/AMS AC X/EWR UA BOS BT IT BT PLUS BT END IT1.00 XFBOS4.5IAD4.5EWR4.5',
		//     [],
		// ];

		// // >*YFHDDQ; no airline in last segment
		// $list[] = [
		//     'LAX AC X/YTO AC X/AMS KQ NBO103.70LH X/FRA LH X/LON UA X/SFO X/LAX103.07NUC20614 PLUS122.00END ROE1.00 XFLAX4.50',
		//     [],
		// ];

		return list;
	}

	/**
	 * @test
	 * @dataProvider provideDumpsAndFullOutputs
	 */
	testDumpFullOutput($dump, $expected) {
		let $actual;

		$actual = FareConstructionParser.parse($dump);
		if (!php.isset($expected['error'])) {
			this.assertEquals(null, $actual['error']);
		}
		if (!php.isset($expected['textLeft'])) {
			$expected['textLeft'] = '';
		}
		this.assertArrayElementsSubset($expected, $actual);
	}

	getTestMapping() {
		return [
			[this.provideDumpsAndFullOutputs, this.testDumpFullOutput],
		];
	}
}

module.exports = FareConstructionParserTest;
