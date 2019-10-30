

const PnrHistoryParser = require('../../../src/text_format_processing/apollo/PnrHistoryParser.js');

let php = require('enko-fundamentals/src/Transpiled/php.js');

class PnrHistoryParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js') {
	provideDumps() {
		const list = [];
		list.push([
			php.implode(php.PHP_EOL, [
				'RCVD-WALDEN/DYBY7  ',
				'QSB AG Y7 1941Z/09DEC',
				'A$ NYC DL LIS 191.67VHXI75US/LN65 DL NYC 195.93VHWI75US/LN65 ',
				'A$ $B-1-2 A09DEC16 ',
				'A$ USD 1067.00/USD 106.80US/USD 767.58XT/USD 1941.38 - 9DEC VHXI75US.VHWI75US/VHXI75US.VHWI75US/*C11-VHXI75USC.VHWI75USC ',
				'A$ OK/$B-*2CV4/TA2CV4/CDL/NOGR/ET ',
				'RCVD-BOZEMAN/ZDYB6B  -CR- QSB/2CV4/1V AG 6B 09DEC1945Z',
				'HS DL 273 V05AUG LISJFK SS/HK3  1145A  226P *',
				'HS DL 473 V17JUL JFKLIS SS/HK3  1000P 1010A *',
				'AQP PROQ/1O3K*70',
				'ATA TAU/09DEC',
				'RCVD-WALDEN/ZDYBY7  -CR- QSB/1O3K/1V AG Y7 09DEC1941Z',
			]),
			{
				'header': null,
				'firstRcvdCopyHeader': {
					'signCityCode': 'QSB',
					'originType': 'agency',
					'teamInitials': 'Y7',
					'receivedDt': {
						'raw': '1941Z/09DEC',
						'date': '12-09',
						'time': '19:41',
						'timeZone': 'UTC',
					},
					'originData': {
						'receivedFrom': 'WALDEN',
						'agentSign': {
							'raw': 'DYBY7',
							'parsed': {
								'homePcc': 'DYB',
								'agentInitials': 'Y7',
							},
						},
					},
				},
				'rcvdList': [
					{
						'rcvd': {
							'signCityCode': 'QSB',
							'pcc': '1O3K',
							'airline': '1V',
							'originType': 'agency',
							'teamInitials': 'Y7',
							'receivedDt': {
								'raw': '09DEC1941Z',
								'date': '12-09',
								'time': '19:41',
								'timeZone': 'UTC',
							},
							'originData': {
								'receivedFrom': 'WALDEN',
								'agentSign': {
									'raw': 'DYBY7',
									'parsed': {
										'homePcc': 'DYB',
										'agentInitials': 'Y7',
									},
								},
							},
						},
						'actions': [
							{
								'code': {'raw': 'ATA', 'parsed': 'addedTicketArrangement'},
								'content': {'raw': 'TAU/09DEC', 'parsed': null},
							},
							{
								'code': {'raw': 'AQP', 'parsed': 'addedQueuePlace'},
								'content': {'raw': 'PROQ/1O3K*70', 'parsed': null},
							},
							{
								'code': {'raw': 'HS', 'parsed': 'originalHistoricalSegments'},
								'content': {
									'raw': 'DL 473 V17JUL JFKLIS SS/HK3  1000P 1010A *',
									'parsed': {
										'airline': 'DL',
										'flightNumber': '473',
										'bookingClass': 'V',
										'departureDate': {'raw': '17JUL', 'parsed': '07-17'},
										'departureAirport': 'JFK',
										'destinationAirport': 'LIS',
										'segmentStatusWas': 'SS',
										'segmentStatusBecame': 'HK',
										'departureTime': {'raw': '1000P', 'parsed': '22:00'},
										'destinationTime': {'raw': '1010A', 'parsed': '10:10'},
										'confirmedByAirline': '*',
										'marriage': null,
									},
								},
							},
							{
								'code': {'raw': 'HS', 'parsed': 'originalHistoricalSegments'},
								'content': {
									'raw': 'DL 273 V05AUG LISJFK SS/HK3  1145A  226P *',
									'parsed': {
										'airline': 'DL',
										'flightNumber': '273',
										'bookingClass': 'V',
										'departureDate': {'raw': '05AUG', 'parsed': '08-05'},
										'departureAirport': 'LIS',
										'destinationAirport': 'JFK',
										'segmentStatusWas': 'SS',
										'segmentStatusBecame': 'HK',
										'departureTime': {'raw': '1145A', 'parsed': '11:45'},
										'destinationTime': {'raw': '226P', 'parsed': '14:26'},
										'confirmedByAirline': '*',
										'marriage': null,
									},
								},
							},
						],
					},
					{
						'rcvd': {
							'signCityCode': 'QSB',
							'pcc': '2CV4',
							'airline': '1V',
							'originType': 'agency',
							'teamInitials': '6B',
							'receivedDt': {
								'raw': '09DEC1945Z',
								'date': '12-09',
								'time': '19:45',
								'timeZone': 'UTC',
							},
							'originData': {
								'receivedFrom': 'BOZEMAN',
								'agentSign': {
									'raw': 'DYB6B',
									'parsed': {
										'homePcc': 'DYB',
										'agentInitials': '6B',
									},
								},
							},
						},
						'actions': [
							{
								'code': {'raw': 'A$', 'parsed': 'addedPricing'},
								'content': {
									'raw': 'OK/$B-*2CV4/TA2CV4/CDL/NOGR/ET ',
									'parsed': {'atfqLineType': 'unknown'},
								},
							},
							{
								'code': {'raw': 'A$', 'parsed': 'addedPricing'},
								'content': {
									'raw': 'USD 1067.00/USD 106.80US/USD 767.58XT/USD 1941.38 - 9DEC VHXI75US.VHWI75US/VHXI75US.VHWI75US/*C11-VHXI75USC.VHWI75USC ',
									'parsed': {'atfqLineType': 'unknown'},
								},
							},
							{
								'code': {'raw': 'A$', 'parsed': 'addedPricing'},
								'content': {
									'raw': '$B-1-2 A09DEC16 ',
									'parsed': {
										'atfqLineType': 'paxBundle',
										'passengerNumbers': {'raw': '1-2'},
										'fareTypeCode': 'A',
										'date': {'raw': '09DEC16'},
									},
								},
							},
							{
								'code': {'raw': 'A$', 'parsed': 'addedPricing'},
								'content': {
									'raw': 'NYC DL LIS 191.67VHXI75US/LN65 DL NYC 195.93VHWI75US/LN65 ',
									'parsed': {'atfqLineType': 'unknown'},
								},
							},
						],
					},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'RCVD-CLYDE/DYBWP  ',
				'QSB AG WP 1606Z/21JUL',
				'XS CX 882 I17JAN HKGLAX HK/WK9   435P  115P *',
				'XS CX 197 I29DEC HKGAKL HK/WK9   900P  105P *',
				'XS CX 885 I28DEC LAXHKG HK/WK9  1125A  705P *',
				'AQP PROQ/1O3K*70',
				'A$ REPR/$B-*1O3K/TA1O3K/CCX/ET ',
				'X$ REPR/$B-*1O3K/TA1O3K/CCX/ET ',
				'ATA TAU/15DEC',
				'XT TAU/21JUL ',
				'SC CX 882 I17JAN HKGLAX TK/HK9   435P  105P *       2',
				'SC CX 197 I29DEC HKGAKL TK/HK9   930P  120P *       1',
				'SC CX 885 I28DEC LAXHKG TK/HK9  1110A  655P *       1',
				'RCVD-ALVIN/ZDYBVY  -CR- QSB/1O3K/1V AG VY 30NOV1205Z',
				'QR Q/1O3K/20 ',
				'RCVD-/ZDPBVWS -CR- QSB/1O3K/1V AG WS 30NOV0814Z',
				'QR Q/1O3K/20 ',
				'RCVD-/ZDPBVWS -CR- QSB/1O3K/1V AG WS 13SEP0947Z',
				'A$ REPR/$B-*1O3K/TA1O3K/CCX/ET ',
				'X$ REPR/$B-*1O3K/TA1O3K/CCX/ET ',
				'SC CX 197 I29DEC HKGAKL TK/TK9   930P  120P *       1',
				'RCVD-130942/ASC/1A27C864/ NO ID  -CR- MUC/1O3K/UA RM 1A 13SEP0942Z',
				'QR Q/1O3K/20 ',
				'RCVD-/ZDPBVWS -CR- QSB/1O3K/1V AG WS 19AUG0500Z',
				'A$ REPR/$B-*1O3K/TA1O3K/CCX/ET ',
				'X$ REPR/$B-*1O3K/TA1O3K/CCX/ET ',
				'AS CX 197 I29DEC HKGAKL HK/TK9   925P  115P *       1',
				'SC CX 197 I29DEC HKGAKL HK/WK9   900P  105P *',
				'RCVD-190456/ASC/19370D40/ NO ID  -CR- MUC/1O3K/UA RM 1A 19AUG0456Z',
				'QR Q/1O3K/20 ',
				'RCVD-/ZDPBVWS -CR- QSB/1O3K/1V AG WS 18AUG0952Z',
				'A$ REPR/$B-*1O3K/TA1O3K/CCX/ET ',
				'X$ REPR/$B-*1O3K/TA1O3K/CCX/ET ',
				'AS CX 885 I28DEC LAXHKG HK/TK9  1110A  655P *       1',
				'SC CX 885 I28DEC LAXHKG HK/WK9  1125A  705P *',
				'RCVD-180946/ASC/17A4B090/ NO ID  -CR- MUC/1O3K/UA RM 1A 18AUG0946Z',
				'A$ REPR/$B-*1O3K/TA1O3K/CCX/ET ',
				'X$ OK/$B-*1O3K/TA1O3K/CCX/ET ',
				'AS CX 882 I17JAN HKGLAX HK/TK9   435P  105P *       2',
				'SC CX 882 I17JAN HKGLAX HK/WK9   435P  115P *',
				'RCVD-180934/ASC/17A3C108/ NO ID  -CR- MUC/1O3K/UA RM 1A 18AUG0934Z',
				'AG ADTK1V/// CANCEL ',
				'AG ADTK1VADV TKT NBR TO CX/KA BY 23DEC 1900 GMT OR SUBJECT TO ',
				'RCVD-211608//1216D024/ NO ID  -CR- MUC/1O3K/UA RM 1A 21JUL1609Z',
				'AQP PROQ/1O3K*70',
				'A$ COMMISSION: NONE SPECIFIED IN RULE ',
				'A$ TOUR CODE: C5USA888FF500   ',
				'A$ 22.40WY TOT USD 4579.66 ',
				'A$ TAX 7.00XY TAX 5.50YC TAX 12.80F1 TAX 13.00KK TAX 41.30AU TAX ',
				'A$ FARE USD 4428.00 TAX 5.60AY TAX 35.60US TAX 3.96XA TAX 4.50XF ',
				'A$ SELECTED ---END ROE1.0 ',
				'A$ CX LAX Q5.79 2208.00IXSPCLRT/SPLT8 NUC4427.58 -DISCOUNTED FARES ',
				'A$ LAX CX X/HKG CX AKL Q5.79 2208.00IXSPCLRT/SPLT8 /-SYD CX X/HKG ',
				'A$ $B-1-9 P21JUL16 - CAT35 ',
				'A$ USD 39852.00/USD 320.40US/USD 1044.54XT/USD 41216.94 - 21JUL IXSPCLRT.IXSPCLRT.IXSPCLRT.IXSPCLRT/IXSPCLRT.IXSPCLRT.IXSPCLRT.IXSPCLRT/IXSPCLRT.IXSPCLRT.IXSPCLRT.IXSPCLRT/IXSPCLRT.IXSPCLRT.IXSPCLRT.IXSPCLRT/IXSPCLRT.IXSPCLRT.IXSPCLRT.IXSPCLRT/| ',
				'A$ OK/$B-*1O3K/TA1O3K/CCX/ET ',
				'RCVD-CLYDE/ZDYBWP  -CR- QSB/1O3K/1V AG WP 21JUL1606Z',
				'ARL 1A ZCU4PE   21JUL 1606',
				'RCVD-211606//121657A0/ NO ID  -CR- MUC/1O3K/UA RM 1A 21JUL1606Z',
				'HS CX 882 I17JAN HKGLAX SS/HK9   435P  115P *       2',
				'HS CX 110 I17JAN SYDHKG SS/HK9   840A  255P *       2',
				'HS CX 197 I29DEC HKGAKL SS/HK9   900P  105P *       1',
				'HS CX 885 I28DEC LAXHKG SS/HK9  1125A  705P *       1',
				'AQP PROQ/1O3K*70',
				'ATA TAU/21JUL',
				'RCVD-CLYDE/ZDYBWP  -CR- QSB/1O3K/1V AG WP 21JUL1606Z',
			]),
			{
				'firstRcvdCopyHeader': {
					'signCityCode': 'QSB',
					'originType': 'agency',
					'teamInitials': 'WP',
					'receivedDt': {
						'raw': '1606Z/21JUL',
						'date': '07-21',
						'time': '16:06',
						'timeZone': 'UTC',
					},
					'originData': {'receivedFrom': 'CLYDE', 'agentSign': {'raw': 'DYBWP'}},
				},
				'rcvdList': [
					// #0 - 'RCVD-CLYDE/ZDYBWP  -CR- QSB/1O3K/1V AG WP 21JUL1606Z'
					{
						'rcvd': {
							'originData': {
								'receivedFrom': 'CLYDE',
								'agentSign': {
									'raw': 'DYBWP',
									'parsed': {
										'homePcc': 'DYB',
										'agentInitials': 'WP',
									},
								},
							},
							'originType': 'agency',
							'pcc': '1O3K',
							'airline': '1V',
							'receivedDt': {
								'raw': '21JUL1606Z',
								'date': '07-21',
								'time': '16:06',
								'timeZone': 'UTC',
							},
						},
						'actions': [
							{'code': {'raw': 'ATA', 'parsed': 'addedTicketArrangement'}},
							{'code': {'raw': 'AQP', 'parsed': 'addedQueuePlace'}},
							{
								'code': {'raw': 'HS', 'parsed': 'originalHistoricalSegments'},
								'content': {
									'raw': 'CX 885 I28DEC LAXHKG SS/HK9  1125A  705P *       1',
									'parsed': {
										'airline': 'CX',
										'destinationAirport': 'HKG',
										'segmentStatusWas': 'SS',
										'segmentStatusBecame': 'HK',
										'marriage': '1',
									},
								},
							},
							{'content': {'parsed': {'departureDate': {'parsed': '12-29'}}}},
							{'content': {'parsed': {'departureDate': {'parsed': '01-17'}}}},
							{'content': {'parsed': {'departureDate': {'parsed': '01-17'}}}},
						],
					},
					[], // #1
					[], // #2
					[],
					[],
					[],
					[],
					[],
					[],
					// #9 - 'RCVD-130942/ASC/1A27C864/ NO ID  -CR- MUC/1O3K/UA RM 1A 13SEP0942Z'
					{
						'rcvd': {
							'originType': 'airline',
							'pcc': '1O3K',
							'airline': 'UA',
							'receivedDt': {
								'raw': '13SEP0942Z',
								'date': '09-13',
								'time': '09:42',
								'timeZone': 'UTC',
							},
						},
						'actions': [
							{
								'code': {'raw': 'SC', 'parsed': 'statusChange'},
								'content': {
									'raw': 'CX 197 I29DEC HKGAKL TK/TK9   930P  120P *       1',
									'parsed': {
										'destinationAirport': 'AKL',
										'segmentStatusWas': 'TK',
										'segmentStatusBecame': 'TK',
									},
								},
							},
							{'code': {'raw': 'X$', 'parsed': 'changedOrDeletedAtfq'}},
							{'code': {'raw': 'A$', 'parsed': 'addedPricing'}},
						],
					},
					// #10 - 'RCVD-/ZDPBVWS -CR- QSB/1O3K/1V AG WS 13SEP0947Z'
					{
						'rcvd': {
							'originData': {
								'receivedFrom': '',
								'agentSign': {
									'raw': 'DPBVWS',
									'parsed': {
										'homePcc': 'DPB',
										'agentInitials': 'VWS',
									},
								},
							},
							'originType': 'agency',
							'receivedDt': {
								'raw': '13SEP0947Z',
								'date': '09-13',
								'time': '09:47',
							},
						},
						'actions': [
							{'code': {'raw': 'QR', 'parsed': 'queueRemoved'}},
						],
					},
					[],
					[],
				],
			},
		]);
		list.push([
			'RCVD-N/ZBH5/NF  -CR- DTW/BH5/1V AG NF 25NOV2018Z',
			{
				'rcvdList': [
					{
						'rcvd': {
							'originData': {
								'receivedFrom': 'N',
								'agentSign': {
									'raw': 'BH5/NF',
									'parsed': {
										'homePcc': 'BH5',
										'agentInitials': 'NF',
									},
								},
							},
							'pcc': 'BH5',
							'airline': '1V',
							'originType': 'agency',
							'teamInitials': 'NF',
							'receivedDt': {
								'date': '11-25',
								'time': '20:18',
								'timeZone': 'UTC',
							},
						},
					},
				],
			},
		]);
		list.push([
			'RCVD-GS/ZDNPGS  -CR- QSB/2DJ2/1V AG GS 05DEC2018Z',
			{'rcvdList': [{'rcvd': {'originData': {'agentSign': {'raw': 'DNPGS'}}}}]},
		]);
		list.push([
			'RCVD-/Z15JE/RL  -CR- DTW/15JE/1V AG RL 07NOV1909Z',
			{
				'rcvdList': [
					{
						'rcvd': {
							'originData': {'agentSign': {'raw': '15JE/RL'}},
							'pcc': '15JE',
						},
					},
				],
			},
		]);
		list.push([
			'RCVD-/ZDPBVWS -CR- QSB/1O3K/1V AG WS 13SEP0947Z',
			{
				'rcvdList': [
					{
						'rcvd': {
							'originData': {'agentSign': {'raw': 'DPBVWS'}},
							'pcc': '1O3K',
						},
					},
				],
			},
		]);
		list.push([
			'RCVD-WESTWOOD/ZDYBAAR -CR- QSB/2CV4/1V AG LV 22NOV1453Z',
			{
				'rcvdList': [
					{
						'rcvd': {
							'originData': {'agentSign': {'raw': 'DYBAAR'}},
							'pcc': '2CV4',
						},
					},
				],
			},
		]);
		list.push([
			'RCVD-SUE/ZDYBSUE -CR- QSB/1O3K/1V AG PH 22NOV2039Z',
			{
				'rcvdList': [
					{
						'rcvd': {
							'originData': {'agentSign': {'raw': 'DYBSUE'}},
							'pcc': '1O3K',
						},
					},
				],
			},
		]);
		list.push([
			'RCVD-NOKEYSUPPLIEDATOM/ZDGKTJK -CR- QSB/ES0/1V AG JK 06DEC2318Z',
			{
				'rcvdList': [
					{
						'rcvd': {
							'originData': {'agentSign': {'raw': 'DGKTJK'}},
							'pcc': 'ES0',
						},
					},
				],
			},
		]);
		list.push([
			'RCVD-NOKEYSUPPLIEDMONDEE/Z2E8R/GWS -CR- SFO/2E8R/1V AG WS 24NOV1012Z',
			{
				'rcvdList': [
					{
						'rcvd': {
							'originData': {'agentSign': {'raw': '2E8R/GWS'}},
							'pcc': '2E8R',
						},
					},
				],
			},
		]);
		list.push([
			'RCVD- -CR- HDQ RM 9W 24NOV1018Z',
			{
				'rcvdList': [
					{
						'rcvd': {
							'signCityCode': 'HDQ',
							'originType': 'airline',
							'teamInitials': '9W',
						},
					},
				],
			},
		]);
		list.push([
			'RCVD-091911//1C838BBC/ NO ID  -CR- MUC/15JE/UA RM 1A 09NOV1911Z',
			{
				'rcvdList': [
					{
						'rcvd': {
							'airline': 'UA',
							'pcc': '15JE',
						},
					},
				],
			},
		]);
		list.push([
			'RCVD-121029/SNC/135F5340         -CR- MUC/   /   RM 1A 12APR1029Z',
			{
				'rcvdList': [
					{
						'rcvd': {
							'signCityCode': 'MUC',
							'originType': 'airline',
							'teamInitials': '1A',
							'receivedDt': {
								'date': '04-12',
								'time': '10:29',
								'timeZone': 'UTC',
							},
						},
					},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'     *****  AIR  HISTORY  *****',
				'XS AA1223 S05JAN JFKDFW NN/HK1   255P  606P *',
				'XS EY 103 M05JAN AUHJFK NN/HK1   335A  925A *',
				'XS EY 642 M04JAN NBOAUH NN/HK1   205P  815P *',
				'RCVD-CAMERON/ZDYB082 -CR- QSB/2F9B/1V AG 82 09DEC1415Z',
				'HS AA1223 S05JAN JFKDFW NN/HK1   255P  606P *',
				'HS EY 103 M05JAN AUHJFK NN/HK1   335A  925A *',
				'HS EY 642 M04JAN NBOAUH NN/HK1   205P  815P *',
				'RCVD-CAMERON/ZDYB082 -CR- QSB/2CV4/1V AG 82 09DEC1106Z',
			]),
			{
				'header': 'AIR  HISTORY',
				'rcvdList': [
					{
						'rcvd': {
							'originData': {'agentSign': {'raw': 'DYB082'}},
							'pcc': '2CV4',
						},
						'actions': [
							{
								'code': {'parsed': 'originalHistoricalSegments'},
								'content': {
									'parsed': {
										'destinationAirport': 'AUH',
										'segmentStatusWas': 'NN',
										'segmentStatusBecame': 'HK',
									},
								},
							},
							{
								'code': {'parsed': 'originalHistoricalSegments'},
								'content': {
									'parsed': {
										'destinationAirport': 'JFK',
										'segmentStatusWas': 'NN',
										'segmentStatusBecame': 'HK',
									},
								},
							},
							{
								'code': {'parsed': 'originalHistoricalSegments'},
								'content': {
									'parsed': {
										'destinationAirport': 'DFW',
										'segmentStatusWas': 'NN',
										'segmentStatusBecame': 'HK',
									},
								},
							},
						],
					},
					{
						'rcvd': {
							'originData': {'agentSign': {'raw': 'DYB082'}},
							'pcc': '2F9B',
						},
						'actions': [
							{
								'code': {'parsed': 'cancelledSegment'},
								'content': {
									'parsed': {
										'destinationAirport': 'AUH',
										'segmentStatusWas': 'NN',
										'segmentStatusBecame': 'HK',
									},
								},
							},
							{
								'code': {'parsed': 'cancelledSegment'},
								'content': {
									'parsed': {
										'destinationAirport': 'JFK',
										'segmentStatusWas': 'NN',
										'segmentStatusBecame': 'HK',
									},
								},
							},
							{
								'code': {'parsed': 'cancelledSegment'},
								'content': {
									'parsed': {
										'destinationAirport': 'DFW',
										'segmentStatusWas': 'NN',
										'segmentStatusBecame': 'HK',
									},
								},
							},
						],
					},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'     *****  ATFQ HISTORY  *****',
				'X$ USD 703.00/USD 17.80US/USD 86.06XT/USD 806.86 - 9DEC MLOWKE.MLOWKE.MLOWKE ',
				'X$ OK/$B-*2CV4/TA2CV4/CEY/ET ',
				'RCVD-CAMERON/ZDYB082 -CR- QSB/2F9B/1V AG 82 09DEC1415Z',
				// #7
				'A$ COMMISSION: NONE SPECIFIED IN RULE ',
				// #6
				'A$ TAX 7.00XY TAX 5.50YC TAX 50.00TU TAX 9.50F6 TOT USD 806.86 ',
				// #5,4
				'A$ FARE USD 703.00 TAX 5.60AY TAX 17.80US TAX 3.96XA TAX 4.50XF A$ NUC702.98 -INFORMATIONAL FARES SELEC TED.---END ROE1.0 ',
				// #3,2
				'A$ NBO EY X/AUH EY X/NYC AA DFW Q NBODFW2.50 700.48MLOWKE/VCN12 A$ $B-1 P09DEC16 - CAT35 ',
				// #1
				'A$ USD 703.00/USD 17.80US/USD 86.06XT/USD 806.86 - 9DEC MLOWKE.MLOWKE.MLOWKE ',
				// #0
				'A$ OK/$B-*2CV4/TA2CV4/CEY/ET ',
				'RCVD-CAMERON/ZDYB082 -CR- QSB/2CV4/1V AG 82 09DEC1106Z',
			]),
			{
				'header': 'ATFQ HISTORY',
				'rcvdList': [
					{
						'rcvd': {
							'pcc': '2CV4',
						},
						'actions': [
							{'code': {'parsed': 'addedPricing'}}, // #0
							{'code': {'parsed': 'addedPricing'}}, // #1
							// #2
							{
								'code': {'parsed': 'addedPricing'},
								'content': {
									'raw': '$B-1 P09DEC16 - CAT35 ',
									'parsed': {
										'atfqLineType': 'paxBundle',
										'passengerNumbers': {'raw': '1'},
										'fareTypeCode': 'P',
										'date': {'raw': '09DEC16'},
									},
								},
							},
							{'code': {'parsed': 'addedPricing'}}, // #3
							{'code': {'parsed': 'addedPricing'}}, // #4
							{'code': {'parsed': 'addedPricing'}}, // #5
							{'code': {'parsed': 'addedPricing'}}, // #6
							{'code': {'parsed': 'addedPricing'}}, // #7
						],
					},
					[],
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'QSBAGWS1640Z/09DEC',
				'NO HISTORY',
			]),
			{'rcvdList': []},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'RCVD-TYSON/DYBAK  ',
				'QSB AG AK 2332Z/17NOV',
				'PS ISSUED WITH SA DIRECTLY/ DO NOT CANCEL THE BOOKING ',
				'PS DO NOT ISSUE IT WILL ISSUE SA DIRECT ',
				'RCVD-/ZDYB2J  -CR- QSB/1O3K/1V AG 2J 22NOV1740Z',
				'PS DO NOT ISSUE IT WILL ISSUE SA DIRECT ',
				'PS AVRAM ',
				'RCVD-/ZDYBIV  -CR- QSB/1O3K/1V AG IV 19NOV0136Z',
				'AQP PROQ/1O3K*70',
				'RCVD-DALE/ZDYB2J  -CR- QSB/1O3K/1V AG 2J 19NOV0044Z',
				'AQP PROQ/1O3K*70',
				'RCVD-AVRAM/ZDYBIV  -CR- QSB/1O3K/1V AG IV 19NOV0044Z',
				'AQP PROQ/1O3K*70',
				'PS AVRAM ',
				'PS AVRAM ',
				'RCVD-AVRAM/ZDYBIV  -CR- QSB/1O3K/1V AG IV 19NOV0044Z',
				'AQP PROQ/1O3K*70',
				'PS AVRAM ',
				'RCVD-AVRAM/ZDYBIV  -CR- QSB/1O3K/1V AG IV 19NOV0044Z',
				'AG SSRDOCSSAHK1/////23APR86/F//ASARE/RHODLINE/K-1ASARE/RHODLINE K     ',
				'RCVD-/ZDPBVWS -CR- QSB/1O3K/1V AG WS 19NOV0034Z',
				'AQP PROQ/1O3K*70',
				'RCVD-ROBOT/ZDPBVWS -CR- QSB/1O3K/1V AG WS 19NOV0034Z',
				'AG SSROTHS1V DUPLICATED WITH 7XUATH- SET 2016 NOV 17 20 43 ',
				'RCVD-180344//16C93F94/ NO ID  -CR- MUC/1O3K/UA RM 1A 18NOV0344Z',
				'AG SSROTHS1V PLS ADV TKT NO BY 2000/01DEC2016 SFO OR SAA WILL CXL ',
				'RCVD-180248//16C0A548/ NO ID  -CR- MUC/1O3K/UA RM 1A 18NOV0248Z',
				'AQP PROQ/1O3K*70',
				'A$ COMMISSION: NONE SPECIFIED IN RULE ',
				'A$ TOUR CODE: 10PER           ',
				'A$ USD 912.16 ',
				'A$ TAX 7.00XY TAX 5.50YC TAX 20.00G5 TAX 100.00GH TAX 344.00YR TOT ',
				'A$ FARE USD 386.00 TAX 5.60AY TAX 35.60US TAX 3.96XA TAX 4.50XF A$ NUC386.10 ---DISCOUNTED FARES SELECT ED---END ROE1.0 ',
				'A$ WAS SA ACC 193.05GLSPLGH/SPLT10 SA WAS 193.05GLSPLGH/SPLT10 ',
				'A$ $B-1 P17NOV16 - CAT35 ',
				'A$ USD 386.00/USD 35.60US/USD 490.56XT/USD 912.16 - 17NOV GLSPLGH.GLSPLGH ',
				'A$ OK/$B-*1O3K/TA1O3K/CSA/ET ',
				'RCVD-TYSON/ZDYBAK  -CR- QSB/1O3K/1V AG AK 17NOV2332Z',
				'ARL 1A 7YG9E3   17NOV 2332',
				'RCVD-172332//168D9580/ NO ID  -CR- MUC/1O3K/UA RM 1A 17NOV2332Z',
				'HS SA 209 G05FEB ACCIAD SS/HK1  1155P  615A',
				'HS SA 210 G24JAN IADACC SS/HK1   540P  830A',
				'AQP PROQ/1O3K*70',
				'ATA TAU/17NOV',
				'RCVD-TYSON/ZDYBAK  -CR- QSB/1O3K/1V AG AK 17NOV2332Z',
			]),
			{
				'rcvdList': [
					[],
					{
						'actions': [
							{
								'code': {'raw': 'ARL'},
								'content': {'raw': '1A 7YG9E3   17NOV 2332'},
							},
						],
					},
					{
						'actions': [
							[],
							[],
							[],
							[],
							// un-glued
							{
								'code': {'raw': 'A$'},
								'content': {'raw': 'NUC386.10 ---DISCOUNTED FARES SELECT ED---END ROE1.0 '},
							},
							{
								'code': {'raw': 'A$'},
								'content': {'raw': 'FARE USD 386.00 TAX 5.60AY TAX 35.60US TAX 3.96XA TAX 4.50XF '},
							},
						],
					},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'RCVD-STYX/DYBEL  ',
				'QSB AG EL 2035Z/12DEC',
				'AQP PROQ/1O3K*70',
				'A$ COMMISSION: 0.00 PCT ',
				'A$ TOUR CODE: US5A78          ',
				'A$ TKT FARE:  BT ',
				'A$ 200.00YR TOT USD 715.46 ',
				'A$ TAX 7.00XY TAX 5.50YC TAX 26.20CN TAX 11.10LI TAX 16.00YQ TAX ',
				'A$ FARE USD 400.00 TAX 5.60AY TAX 35.60US TAX 3.96XA TAX 4.50XF A$ 170.00LPRU9/NB PC60.00 NUC400.00END ROE1.0 ',
				'A$ WAS CA X/BJS CA MNL 170.00LPRU9/NB CA X/BJS CA WAS ',
				'A$ $B-1 A12DEC16 ',
				'A$ USD 400.00/USD 35.60US/USD 279.86XT/USD 715.46 - 12DEC *JCB*IF60-LPRU9.LPRU9.LPRU9.LPRU9  ',
				'X$ USD 400.00/USD 35.60US/USD 279.86XT/USD 715.46 - 12DEC LPRU9.LPRU9.LPRU9.LPRU9 ',
				'A$ OK/$B*JCB*IF60/-*1O3K/:A/Z$60.00/ET/TA1O3K/CCA ',
				'X$ OK/$B/:N/Z05/TA2CV4/CCA/ET ',
				'RCVD-HANS/ZDYB064 -CR- QSB/1O3K/1V AG 64 13DEC0000Z',
				'AQP PROQ/1O3K*70',
				'RCVD-HANS/ZDYB064 -CR- QSB/1O3K/1V AG 64 12DEC2145Z',
				'AQP PROQ/1O3K*70',
				'PS HANS ',
				'PS VOLDEMORT ',
				'RCVD-HANS/ZDYB064 -CR- QSB/1O3K/1V AG 64 12DEC2144Z',
				'PS VOLDEMORT ',
				'CO PNR CONTROL ACCEPTED FROM 2CV4 TO 1O3K/51 ',
				'RCVD-HANS/ZDYB064 -CR- QSB/1O3K/1V AG 64 12DEC2144Z',
				'AG SSRDOCSCAHK1/////27OCT47/M//JENNINGS/GARETH/LYNN-1JENNINGS/GARETH     ',
				'RCVD-/ZDPBVWS -CR- QSB/2CV4/1V AG WS 12DEC2143Z',
				'CO PNR CONTROL RELEASED FROM 2CV4 TO 1O3K/51 ',
				'RCVD-/ZDPBVWS -CR- QSB/2CV4/1V AG WS 12DEC2040Z',
				'HS CA 817 L18FEB PEKIAD SS/HK1  1245P  135P *       4',
				'HS CA 180 L18FEB MNLPEK SS/HK1   640A 1120A *       4',
				'HS CA 179 L25JAN PEKMNL SS/HK1   800P 1255A *       1',
				'HS CA 818 L24JAN IADPEK SS/HK1   335P  635P *       1',
				'ATA TAU/12DEC',
				'RCVD-STYX/ZDYBEL  -CR- QSB/2CV4/1V AG EL 12DEC2035Z',
			]),
			{
				'rcvdList': [
					[],
					{
						'actions': [
							{
								'code': {'raw': 'CO'},
								'content': {'raw': 'PNR CONTROL RELEASED FROM 2CV4 TO 1O3K/51 '},
							},
						],
					},
					[],
					[],
					[],
					[],
					{
						'actions': [
							[],
							[],
							[],
							[],
							[],
							[],
							// unglued
							{
								'code': {'raw': 'A$'},
								'content': {'raw': '170.00LPRU9/NB PC60.00 NUC400.00END ROE1.0 '},
							},
							{
								'code': {'raw': 'A$'},
								'content': {'raw': 'FARE USD 400.00 TAX 5.60AY TAX 35.60US TAX 3.96XA TAX 4.50XF '},
							},
						],
					},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'RCVD-TABS/DYB/D0 ',
				'QSB AG D0 1722Z/14DEC',
				'ARL AA JADXMN   14DEC 1828',
				'AG ADTK1VKK1 PLS ISSUE TKT BY 2359 16DEC16 CST ',
				'AG SSROTHS1V OR AA WILL CANCEL FARE RULES STILL APPLY ',
				'RCVD-141828//14118868/ NO ID  -CR- HDQ/1O3K/UA RM AA 14DEC1828Z',
				'AQP PROQ/1O3K*70',
				'X$ USD 1485.00/USD 142.40US/USD 1536.84XT/USD 3164.24 - 13DEC *JCB-OLX1B8O1.OLX1B8O1.OLX1B8O1.OLX8B8O1.OLX8B8O1.OLX8B8O1.OLX8B8O1/*JCB-OLX1B8O1.OLX1B8O1.OLX1B8O1.OLX8B8O1.OLX8B8O1.OLX8B8O1.OLX8B8O1/*JCB-OLX1B8O1.OLX1B8O1.OLX1B8O1.OLX8B8O1.OLX8B8O1.| ',
				'X$ OK/$BN1*JCB|2*JCB|3*JCB|4*J02/-*2CV4/TA2CV4/CAA/ET ',
				'AO OSIYY RLOC QTS1VWW5WZI ',
				'RCVD-MARDI/ZDYBD0  -CR- QSB/1O3K/1V AG D0 14DEC1722Z',
			]),
			{
				'firstRcvdCopyHeader': {
					'originData': {
						'receivedFrom': 'TABS',
						'agentSign': {
							'raw': 'DYB/D0',
							'parsed': {
								'homePcc': 'DYB',
								'agentInitials': 'D0',
							},
						},
					},
					'signCityCode': 'QSB',
					'originType': 'agency',
					'teamInitials': 'D0',
					'receivedDt': {
						'raw': '1722Z/14DEC',
						'date': '12-14',
						'time': '17:22',
						'timeZone': 'UTC',
					},
				},
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'RCVD-ROSHAN/DYBQC  ',
				'QSB AG QC 2336Z/13DEC',
				'A$ ACC MS X/CAI MS YTO 480.00LRIGHO NUC480.00END ROE1.0 ',
				'A$ $B-1 C13DEC16 ',
				'A$  V/USD 480.00/CAD 13.20G5/CAD 131.80GH/CAD 297.90XT/CAD 1075.90 - 13DEC LRIGHO.LRIGHO ', // #5
				'X$ USD 480.00/CAD 13.20G5/CAD 131.80GH/CAD 297.90XT/CAD 1075.90 - 13DEC LRIGHO.LRIGHO ', // #4
				'A$ OK/$BN1/:N/ITYYTO02/Z5/ET/TA2BQ6/CMS ', // #3
				'X$ OK/$BN1/:N/ITYYTO02/Z5/ET/TA2BQ6/CMS ', // #2
				'AS TUR ZZ 13OCT BK/BK1   YYZ-***THANK YOU FOR YOUR SUPPORT***/CF-', // #1
				'ATR G*RC/52', // #0
				'RCVD-YOMI/ZDYB080 -CR- QSB/2BQ6/1V AG 80 14DEC0356Z',
				'HS MS 995 L20DEC CAIYYZ SS/HK1   200A  700A *',
				'HS MS 882 L19DEC ACCCAI SS/HK1  1220P  815P *',
				'ATA TAU/13DEC',
				'AG  SSRINFTMSNN01 CAIYYZ 0995L 20DEC-1OWUSU/PRISCILLA GYEMFA.OWUSU/MARVIN NANA ASARE 23FEB16        ',
				'AG  SSRINFTMSNN01 ACCCAI 0882L 19DEC-1OWUSU/PRISCILLA GYEMFA.OWUSU/MARVIN NANA ASARE 23FEB16        ',
				'RCVD-ROSHAN/ZDYBQC  -CR- QSB/2BQ6/1V AG QC 13DEC2336Z',
			]),
			{
				'rcvdList': [
					[],
					{
						'actions': [
							[],
							[],
							[],
							[],
							// #4
							{
								'code': {'raw': 'X$'},
								'content': {'raw': 'USD 480.00/CAD 13.20G5/CAD 131.80GH/CAD 297.90XT/CAD 1075.90 - 13DEC LRIGHO.LRIGHO '},
							},
							// #5
							{
								'code': {'raw': 'A$'},
								'content': {'raw': ' V/USD 480.00/CAD 13.20G5/CAD 131.80GH/CAD 297.90XT/CAD 1075.90 - 13DEC LRIGHO.LRIGHO '},
								// '90 - 13DEC LRIGHO.LRIGHO' moves to next line if wrapped by 64
							},
							// #6
							{
								'code': {'raw': 'A$'},
								'content': {'raw': '$B-1 C13DEC16 '},
							},
						],
					},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'RCVD-ALDEN/ZDYBZC  -CR- QSB/2G52/1V AG ZC 13DEC2231Z',
				'H9 KE 0085 I 19JAN ICN JFK                             ',
				'   9T  01. JIMENEZ  L     PN  09D  N     HK  09D  N    ',
				'RCVD-132132/BPR/130DBF6C/ NO ID  -CR- MUC/1O3K/UA RM 1A 13DEC2132Z',
				'HS KE  85 I19JAN ICNJFK SS/HK1   730P  730P *',
				'HS KE 622 I19JAN MNLICN SS/HK1  1230P  520P *',
				'HS KE 623 I13JAN ICNMNL SS/HK1   710P 1015P *',
				'HS KE  82 I12JAN JFKICN SS/HK1  1200N  425P *',
				'AQP PROQ/1O3K*70',
				'ATA TAU/13DEC',
				'RCVD-OSCAR/ZDYB6Y  -CR- QSB/1O3K/1V AG 6Y 13DEC2114Z',
			]),
			{
				'rcvdList': [
					[],
					{
						'actions': [
							{
								'code': {'raw': 'H9'},
								// now when i think about it, isn't 9T the actual code, and H9 line the continuation of it?
							},
						],
					},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'RCVD-TRAYTON/DYB6S  ',
				'QSB AG 6S 2048Z/14DEC',
				'AG SSRDOCSKLHK1/////27FEB06/M//INGOSI/BROLYN/DIVINE-1INGOSI/BROLYN DIVINE     ',
				'AG SSRDOCSDLHK1/////27FEB06/M//INGOSI/BROLYN/DIVINE-1INGOSI/BROLYN DIVINE     ',
				'AG SSRDOCSKLHK1/////31MAR70/F//CHISAINA/SARAH/-1CHISAINA/SARAH     ',
				'AG SSRDOCSDLHK1/////31MAR70/F//CHISAINA/SARAH/-1CHISAINA/SARAH     ',
				'RCVD-/ZDPBVWS -CR- QSB/1O3K/1V AG WS 14DEC2110Z',
				'HS DL1711 V24JAN ATLDFW SS/HK2  1030P 1159P *       3',
				'HS DL9374 V24JAN AMSATL SS/HK2   450P  820P *       3',
				'HS KL4140 V24JAN NBOAMS SS/HK2   805A  250P *',
				'HS KL 565 N26DEC AMSNBO SS/HK2  1145A  950P *       1',
				'HS KL 624 N25DEC ATLAMS SS/HK2   400P  600A *       1',
				'HS DL2155 T25DEC DFWATL SS/HK2   945A 1247P *',
				'AQP PROQ/1O3K*70',
				'ATA TAU/14DEC',
				'RCVD-TRAYTON/ZDYB6S  -CR- QSB/1O3K/1V AG 6S 14DEC2048Z',
			]),
			{
				'rcvdList': [
					[],
					{
						'actions': [
							[],
							[],
							{
								'code': {'raw': 'AG'},
								'content': {'raw': 'SSRDOCSDLHK1/////27FEB06/M//INGOSI/BROLYN/DIVINE-1INGOSI/BROLYN DIVINE     '},
							},
							{
								'code': {'raw': 'AG'},
								'content': {'raw': 'SSRDOCSKLHK1/////27FEB06/M//INGOSI/BROLYN/DIVINE-1INGOSI/BROLYN DIVINE     '},
							},
						],
					},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'     *****  AIR  HISTORY  *****',
				'SC QR 729 W23AUG DOHDFW HK/HX2   825A  350P *',
				'SC QR1342 W23AUG NBODOH HK/HX2  1255A  620A *',
				'SC QR1341 W09AUG DOHNBO HK/HX2   625P 1150P *',
				'SC QR 730 W08AUG DFWDOH HK/HX2   635P  510P *',
				'RCVD-150500//1CDE25E0/ NO ID  -CR- MUC/2G55/UA RM 1A 15JUN0500Z',
				'RCVD-ROBOT/ZDPBVWS -CR- QSB/2G55/1V AG WS 15JUN0022Z',
				'HS QR 729 W23AUG DOHDFW SS/HK2   825A  350P *       2',
				'HS QR1342 W23AUG NBODOH SS/HK2  1255A  620A *       2',
				'HS KQ 444 T22AUG BJMNBO NN/HK2   615P 1010P *',
				'HS KQ 448 T10AUG NBOBJM SS/HK2   720A  915A *',
				'HS QR1341 W09AUG DOHNBO SS/HK2   625P 1150P *       1',
				'HS QR 730 W08AUG DFWDOH SS/HK2   635P  510P *       1',
				'RCVD-DION/ZDPBVWS -CR- QSB/2G55/1V AG WS 13JUN2101Z',
			]),
			{
				'header': 'AIR  HISTORY',
				'rcvdList': [
					{
						'rcvd': {
							'originData': {'receivedFrom': 'DION'},
							'receivedDt': {'date': '06-13', 'time': '21:01'},
						},
						'actions': [
							{'code': {'raw': 'HS', 'parsed': 'originalHistoricalSegments'}},
							{'code': {'raw': 'HS', 'parsed': 'originalHistoricalSegments'}},
							{'code': {'raw': 'HS', 'parsed': 'originalHistoricalSegments'}},
							{'code': {'raw': 'HS', 'parsed': 'originalHistoricalSegments'}},
							{'code': {'raw': 'HS', 'parsed': 'originalHistoricalSegments'}},
							{'code': {'raw': 'HS', 'parsed': 'originalHistoricalSegments'}},
						],
					},
					{
						'rcvd': {
							'originData': {'receivedFrom': 'ROBOT'},
							'receivedDt': {'date': '06-15', 'time': '00:22'},
						},
						'actions': [],
					},
					{
						'rcvd': {
							'originType': 'airline',
							'airline': 'UA',
							'receivedDt': {'date': '06-15', 'time': '05:00'},
						},
						'actions': [
							{'code': {'raw': 'SC', 'parsed': 'statusChange'}},
							{'code': {'raw': 'SC', 'parsed': 'statusChange'}},
							{'code': {'raw': 'SC', 'parsed': 'statusChange'}},
							{'code': {'raw': 'SC', 'parsed': 'statusChange'}},
						],
					},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'AG - DUTY CODE NOT AUTH FOR CRT - APOLLO',
			]),
			{
				'rcvdList': [],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'     *****  AIR  HISTORY  *****',
				'SC AF3565 V13APR JFKVCE TK/TK1   856P 1115A *',
				'RCVD-101543/ASC/BF4AAA8D/ NO ID  -CR- MUC/2G56/UA RM 1A 10MAR1543Z',
				'AS DL1375 V13APR ATLJFK HX/HX1  ',
				'AS DL5292 V04MAY ATLSGF HK/HK1   430P  524P',
				'RCVD- -CR- HDQ/   /   RM DL 28FEB2236Z',
			]),
			{
				'rcvdList': [
					{
						'rcvd': {'signCityCode': 'HDQ', 'teamInitials': 'DL'},
						'actions': [
							{
								'code': {'raw': 'AS', 'parsed': 'addedSegment'},
								'content': {
									'raw': 'DL5292 V04MAY ATLSGF HK/HK1   430P  524P',
									'parsed': {'airline': 'DL', 'flightNumber': '5292'},
								},
							},
							{
								'code': {'raw': 'AS', 'parsed': 'addedSegment'},
								'content': {
									'raw': 'DL1375 V13APR ATLJFK HX/HX1  ',
									'parsed': {
										'airline': 'DL',
										'flightNumber': '1375',
										'bookingClass': 'V',
										'departureDate': {'raw': '13APR', 'parsed': '04-13'},
										'departureAirport': 'ATL',
										'destinationAirport': 'JFK',
										'segmentStatusWas': 'HX',
										'segmentStatusBecame': 'HX',
										'seatCount': '1',
										'departureTime': null,
										'destinationTime': null,
									},
								},
							},
						],
					},
					{
						'rcvd': {'signCityCode': 'MUC', 'pcc': '2G56', 'teamInitials': '1A'},
						'actions': [
							{
								'code': {'raw': 'SC', 'parsed': 'statusChange'},
								'content': {
									'raw': 'AF3565 V13APR JFKVCE TK/TK1   856P 1115A *',
									'parsed': {'airline': 'AF', 'flightNumber': '3565'},
								},
							},
						],
					},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'     *****  ATFQ HISTORY  *****',
				'A$ TAX 1.50XG TAX 212.80YQ TOT CAD 710.21 ',
				'A$ FARE CAD 390.00 TAX 25.91CA TAX 30.00SQ TAX 36.40CN TAX 13.60LI ',
				'A$ 153.26NUC306.51END ROE1.272363 ',
				'A$ YEA WS X/YVR MU X/SHA MU MNL 153.25MU X/SHA MU X/YVR WS YEA ',
				'A$ TKT 1-4 C14MAR18 ',
				'A$ CAD 1560.00/CAD 103.64CA/CAD 6.00XG/CAD 1171.20XT/CAD 2840.84 - 14MAR *ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/*ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/*ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/*ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.| ',
				'X$ CAD 1560.00/CAD 103.64CA/CAD 6.00XG/CAD 1171.20XT/CAD 2840.84 - 14MAR *ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/*ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/*ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/*ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.| ',
				'A$ TKTE/$BN1*ADT|2*ADT|3*ADT|4*ADT/:N/Z$27.30/F|*020023|OK/ET/CMU ',
				'X$ OK/$BN1*ADT|2*ADT|3*ADT|4*ADT/:N/Z$27.30/CMU/ET ',
				'RCVD-/Z23FH/GWS -CR- XDB/2ER7/1V AG    14MAR2326Z',
				'A$ TAX 1.50XG TAX 212.80YQ TOT CAD 710.21 ',
				'A$ FARE CAD 390.00 TAX 25.91CA TAX 30.00SQ TAX 36.40CN TAX 13.60LI ',
				'A$ YEA 153.26TPRCAC NUC306.51END ROE1.272363 ',
				'A$ YEA WS X/YVR MU X/SHA MU MNL 153.25TPRCAC MU X/SHA MU X/YVR WS ',
				'A$ $B-1-4 C14MAR18 ',
				'A$ CAD 1560.00/CAD 103.64CA/CAD 6.00XG/CAD 1171.20XT/CAD 2840.84 - 14MAR *ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/*ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/*ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/*ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.| ',
				'X$ CAD 1560.00/CAD 103.64CA/CAD 6.00XG/CAD 1171.20XT/CAD 2840.84 - 14MAR TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC ',
				'A$ OK/$BN1*ADT|2*ADT|3*ADT|4*ADT/:N/Z$27.30/CMU/ET ',
				'X$ OK/$B/:N/Z0/ET/TA2ER7/CMU ',
				'RCVD-ROBO/Z23FH/GWS -CR- YVR/23FH/1V AG WS 14MAR2326Z',
				'A$ TAX 1.50XG TAX 212.80YQ TOT CAD 710.21 ',
				'A$ FARE CAD 390.00 TAX 25.91CA TAX 30.00SQ TAX 36.40CN TAX 13.60LI ',
				'A$ YEA 153.26TPRCAC NUC306.51END ROE1.272363 ',
				'A$ YEA WS X/YVR MU X/SHA MU MNL 153.25TPRCAC MU X/SHA MU X/YVR WS ',
				'A$ $B-1-4 C14MAR18 ',
				'A$  V/CAD 1560.00/CAD 103.64CA/CAD 6.00XG/CAD 1171.20XT/CAD 2840.84 - 14MAR TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC ',
				'X$ CAD 1560.00/CAD 103.64CA/CAD 6.00XG/CAD 1171.20XT/CAD 2840.84 - 14MAR TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC ',
				'A$ OK/$B/:N/Z0/ET/TA2ER7/CMU ',
				'X$ OK/$B/:N/Z0/ET/TA2ER7/CMU ',
				'RCVD-JEY/ZDYBDX  -CR- QSB/2ER7/1V AG DX 14MAR2224Z',
				'A$ TAX 1.50XG TAX 212.80YQ TOT CAD 710.21 ',
				'A$ FARE CAD 390.00 TAX 25.91CA TAX 30.00SQ TAX 36.40CN TAX 13.60LI ',
				'A$ YEA 153.26TPRCAC NUC306.51END ROE1.272363 ',
				'A$ YEA WS X/YVR MU X/SHA MU MNL 153.25TPRCAC MU X/SHA MU X/YVR WS ',
				'A$ $B-1-4 C14MAR18 ',
				'A$ CAD 1560.00/CAD 103.64CA/CAD 6.00XG/CAD 1171.20XT/CAD 2840.84 - 14MAR TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC ',
				'X$ CAD 1560.00/CAD 103.64CA/CAD 6.00XG/CAD 1171.20XT/CAD 2840.84 - 13MAR TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC ',
				'A$ OK/$B/:N/Z0/ET/TA2ER7/CMU ',
				'X$ OK/$B/-*2BQ6/Z0/TA2BQ6/CMU/ET ',
				'RCVD-/ZDYBDX  -CR- QSB/2ER7/1V AG DX 14MAR2223Z',
				'A$ TAX 1.50XG TAX 212.80YQ TOT CAD 710.21 ',
				'A$ FARE CAD 390.00 TAX 25.91CA TAX 30.00SQ TAX 36.40CN TAX 13.60LI ',
				'A$ YEA 153.26TPRCAC NUC306.51END ROE1.272363 ',
				'A$ YEA WS X/YVR MU X/SHA MU MNL 153.25TPRCAC MU X/SHA MU X/YVR WS ',
				'A$ $B-1-4 C14MAR18 ',
				'A$ CAD 1560.00/CAD 103.64CA/CAD 6.00XG/CAD 1171.20XT/CAD 2840.84 - 13MAR TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC ',
				'A$ OK/$B/-*2BQ6/Z0/TA2BQ6/CMU/ET ',
				'RCVD-BENCH/ZDYBBCH -CR- QSB/2BQ6/1V AG PH 14MAR0559Z',
			]),
			{
				'rcvdList': [
					{'rcvd': {'pcc': '2BQ6', 'originData': {'agentSign': {'raw': 'DYBBCH'}, 'receivedFrom': 'BENCH'}}},
					{'rcvd': {'pcc': '2ER7', 'originData': {'agentSign': {'raw': 'DYBDX'}, 'receivedFrom': ''}}},
					{'rcvd': {'pcc': '2ER7', 'originData': {'agentSign': {'raw': 'DYBDX'}, 'receivedFrom': 'JEY'}}},
					{
						'rcvd': {
							'pcc': '23FH',
							'originData': {'agentSign': {'raw': '23FH/GWS'}, 'receivedFrom': 'ROBO'},
						},
					},
					{
						'rcvd': {
							'originData': {'receivedFrom': '', 'agentSign': {'raw': '23FH/GWS'}},
							'signCityCode': 'XDB',
							'pcc': '2ER7',
							'airline': '1V',
							'originType': 'agency',
							'teamInitials': null,
							'receivedDt': {
								'raw': '14MAR2326Z',
								'date': '03-14',
								'time': '23:26',
								'timeZone': 'UTC',
							},
						},
						'actions': [
							{
								'code': {'raw': 'X$'},
								'content': {'raw': 'OK/$BN1*ADT|2*ADT|3*ADT|4*ADT/:N/Z$27.30/CMU/ET '},
							},
							{
								'code': {'raw': 'A$'},
								'content': {'raw': 'TKTE/$BN1*ADT|2*ADT|3*ADT|4*ADT/:N/Z$27.30/F|*020023|OK/ET/CMU '},
							},
							{
								'code': {'raw': 'X$'},
								'content': {'raw': 'CAD 1560.00/CAD 103.64CA/CAD 6.00XG/CAD 1171.20XT/CAD 2840.84 - 14MAR *ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/*ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/*ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/*ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.| '},
							},
							{
								'code': {'raw': 'A$'},
								'content': {'raw': 'CAD 1560.00/CAD 103.64CA/CAD 6.00XG/CAD 1171.20XT/CAD 2840.84 - 14MAR *ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/*ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/*ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC.TPRCAC/*ADT-TPRCAC.TPRCAC.TPRCAC.TPRCAC.| '},
							},
							{
								'code': {'raw': 'A$', 'parsed': 'addedPricing'},
								'content': {
									'raw': 'TKT 1-4 C14MAR18 ',
									'parsed': {
										'atfqLineType': 'paxBundle',
										'status': 'TKT',
										'passengerNumbers': {'raw': '1-4'},
										'fareTypeCode': 'C',
										'date': {'raw': '14MAR18'},
									},
								},
							},
							{
								'code': {'raw': 'A$'},
								'content': {'raw': 'YEA WS X/YVR MU X/SHA MU MNL 153.25MU X/SHA MU X/YVR WS YEA '},
							},
							{'code': {'raw': 'A$'}, 'content': {'raw': '153.26NUC306.51END ROE1.272363 '}},
							{
								'code': {'raw': 'A$'},
								'content': {'raw': 'FARE CAD 390.00 TAX 25.91CA TAX 30.00SQ TAX 36.40CN TAX 13.60LI '},
							},
							{'code': {'raw': 'A$'}, 'content': {'raw': 'TAX 1.50XG TAX 212.80YQ TOT CAD 710.21 '}},
						],
					},
				],
			},
		]);
		list.push([
			php.implode(php.PHP_EOL, [
				'     *****  AIR  HISTORY  *****',
				'XS HX 538DN24MAY HKGSGN TK/UN2  1105P 1250A *',
				'XS HX 538 N24MAY HKGSGN HK/UN2  1105P 1250A *',
				'SC HX 538 N25MAY HKGSGN TK/HK2   110A  255A *',
				'RCVD-BRISTOL/ZDPBVWS -CR- QSB/2G8P/1V AG WS 23APR0140Z',
				'AS HX 538 N25MAY HKGSGN TK/TK2   110A  255A *',
				'SC HX 538DN24MAY HKGSGN TK/UN2  1105P 1250A *',
				'RCVD-130805/ASC/BF3EFB8E/ NO ID  -CR- PEK/2G8P/UA RM CA 13APR0806Z',
				'AS HX 538DN24MAY HKGSGN TK/TK2  1105P 1250A *',
				'SC HX 538 N24MAY HKGSGN HK/UN2  1105P 1250A *',
				'RCVD-130740/ASC/BF3E8735/ NO ID  -CR- PEK/2G8P/UA RM CA 13APR0741Z',
				'HS UA 838 K07JUN NRTSFO SS/HK2   500P 1045A *       1',
				'HS UA7904 K07JUN SGNNRT SS/HK2   700A  300P *       1',
				'HS HX 538 N24MAY HKGSGN SS/HK2  1105P 1250A *',
				'HS UA 869 K23MAY SFOHKG SS/HK2   130P  645P *',
				'RCVD-SHAIK/ZDPBVWS -CR- QSB/2G2H/1V AG WS 18FEB2303Z',
			]),
			{
				'header': 'AIR  HISTORY',
				'firstRcvdCopyHeader': null,
				'rcvdList': [
					{
						'rcvd': {
							'pcc': '2G2H',
							'receivedDt': {'raw': '18FEB2303Z'},
							'originData': {'receivedFrom': 'SHAIK'},
						},
						'actions': [
							{
								'content': {
									'parsed': {
										'flightNumber': '869',
										'destinationAirport': 'HKG',
										'segmentStatusBecame': 'HK',
									},
								},
							},
							{
								'content': {
									'parsed': {
										'flightNumber': '538',
										'destinationAirport': 'SGN',
										'segmentStatusBecame': 'HK',
									},
								},
							},
							{
								'content': {
									'parsed': {
										'flightNumber': '7904',
										'destinationAirport': 'NRT',
										'segmentStatusBecame': 'HK',
									},
								},
							},
							{
								'content': {
									'parsed': {
										'flightNumber': '838',
										'destinationAirport': 'SFO',
										'segmentStatusBecame': 'HK',
									},
								},
							},
						],
					},
					{
						'rcvd': {
							'pcc': '2G8P', 'airline': 'UA',
							'receivedDt': {'raw': '13APR0741Z'},
						},
						'actions': [
							{
								'content': {
									'parsed': {
										'flightNumber': '538',
										'destinationAirport': 'SGN',
										'segmentStatusBecame': 'UN',
									},
								},
							},
							{
								'content': {
									'parsed': {
										'flightNumber': '538',
										'destinationAirport': 'SGN',
										'segmentStatusBecame': 'TK',
									},
								},
							},
						],
					},
					{
						'rcvd': {
							'pcc': '2G8P', 'airline': 'UA',
							'receivedDt': {'raw': '13APR0806Z'},
						},
						'actions': [
							{
								'content': {
									'parsed': {
										'flightNumber': '538',
										'destinationAirport': 'SGN',
										'segmentStatusBecame': 'UN',
									},
								},
							},
							{
								'content': {
									'parsed': {
										'flightNumber': '538',
										'destinationAirport': 'SGN',
										'segmentStatusBecame': 'TK',
									},
								},
							},
						],
					},
					{
						'rcvd': {
							'pcc': '2G8P',
							'receivedDt': {'raw': '23APR0140Z'},
							'originData': {'receivedFrom': 'BRISTOL'},
						},
						'actions': [
							{
								'content': {
									'parsed': {
										'flightNumber': '538',
										'destinationAirport': 'SGN',
										'segmentStatusBecame': 'HK',
									},
								},
							},
							{
								'content': {
									'parsed': {
										'flightNumber': '538',
										'destinationAirport': 'SGN',
										'segmentStatusBecame': 'UN'
									},
								},
							},
							{
								'content': {
									'parsed': {
										'flightNumber': '538',
										'destinationAirport': 'SGN',
										'segmentStatusBecame': 'UN',
									},
								},
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
	 * @dataProvider provideDumps()
	 */
	testParser($dump, $expectedResult) {
		let $actualResult;
		$actualResult = PnrHistoryParser.parseCompleteDump($dump);
		try {
			this.assertArrayElementsSubset($expectedResult, $actualResult);
		} catch (exc) {
			throw exc;
		}
	}

	getTestMapping() {
		return [
			[this.provideDumps, this.testParser],
		];
	}
}

module.exports = PnrHistoryParserTest;
