const TicketListParser = require('../../../../src/text_format_processing/sabre/pnr/TicketListParser.js');

const php = require('enko-fundamentals/src/Transpiled/php.js');
class TicketListParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js')
{
	provideDumps()  {
		const list = [];

		// YKWKSM - with void
		list.push([
			php.implode(php.PHP_EOL, [
				'TKT/TIME LIMIT',
				'  1.T-23SEP-6IIF*ABE',
				'  2.TE 4597864937770-AT FAKHR/F 6IIF*ABE 1828/23SEP*',
				'    TV 4597864937770-AT  *VOID* 6IIF*AAC 0840/24SEP*E',
			]),
			{
				'ticketingInfo': {
					'ticketingDate': {'parsed': '09-23'},
					'pcc': '6IIF',
					'agentInitials': 'BE',
				},
				'tickets': [
					{
						'lineNumber': '2',
						'transactionIndicator': 'TE',
						'ticketNumber': '4597864937770',
						'ticketStock': 'AT',
						'passengerName': 'FAKHR/F',
						'pcc': '6IIF',
						'agentInitials': 'BE',
						'issueTime': {'parsed': '18:28'},
						'issueDate': {'parsed': '09-23'},
						'formOfPayment': 'cash',
					},
					{
						'lineNumber': null,
						'transactionIndicator': 'TV',
						'ticketNumber': '4597864937770',
						'ticketStock': 'AT',
						'passengerName': null,
						'transaction': 'VOID',
						'pcc': '6IIF',
						'agentInitials': 'AC',
						'issueTime': {'parsed': '08:40'},
						'issueDate': {'parsed': '09-24'},
						'formOfPayment': 'cash',
					},
				],
			},
		]);

		// QWFEVR - with lot of voids
		list.push([
			php.implode(php.PHP_EOL, [
				'TKT/TIME LIMIT',
				'  1.T-24SEP-6IIF*ACH',
				'  2.TE 0067864937758/59-AT MOTIW/H 6IIF*AIE 1736/23SEP*',
				'  3.TE 0067864937760/61-AT MOTIW/N 6IIF*AIE 1736/23SEP*',
				'  4.TE 0067864937762/63-AT MOTIW/B 6IIF*AIE 1736/23SEP*',
				'  5.TE 0067864937764/65-AT MOTIW/S 6IIF*AIE 1736/23SEP*',
				'  6.TE 0067864937766/67-AT MOTIW/Y 6IIF*AIE 1736/23SEP*',
				'    TV 0067864937758/59-AT  *VOID* 6IIF*ACH 0404/24SEP*E',
				'    TV 0067864937760/61-AT  *VOID* 6IIF*ACH 0405/24SEP*E',
				'    TV 0067864937762/63-AT  *VOID* 6IIF*ACH 0405/24SEP*E',
				'    TV 0067864937764/65-AT  *VOID* 6IIF*ACH 0405/24SEP*E',
				'    TV 0067864937766/67-AT  *VOID* 6IIF*ACH 0405/24SEP*E',
				'  7.TE 0067864937775/76-AT MOTIW/H 6IIF*ACH 0405/24SEP ',
				'  8.TE 0067864937777/78-AT MOTIW/N 6IIF*ACH 0405/24SEP ',
				'  9.TE 0067864937779/80-AT MOTIW/B 6IIF*ACH 0405/24SEP ',
				' 10.TE 0067864937781/82-AT MOTIW/S 6IIF*ACH 0405/24SEP ',
				' 11.TE 0067864937783/84-AT MOTIW/Y 6IIF*ACH 0405/24SEP ',
				'    TV 0067864937775/76-AT  *VOID* 6IIF*ACT 1421/24SEP E',
				'    TV 0067864937777/78-AT  *VOID* 6IIF*ACT 1421/24SEP E',
				'    TV 0067864937779/80-AT  *VOID* 6IIF*ACT 1421/24SEP E',
				'    TV 0067864937781/82-AT  *VOID* 6IIF*ACT 1421/24SEP E',
				'    TV 0067864937783/84-AT  *VOID* 6IIF*ACT 1423/24SEP E',
			]),
			{
				'ticketingInfo': {
					'ticketingDate': {'parsed': '09-24'},
					'pcc': '6IIF',
					'agentInitials': 'CH',
				},
				'tickets': {
					[4]: {
						'lineNumber': '6',
						'transactionIndicator': 'TE',
						'ticketNumber': '0067864937766',
						'ticketNumberExtension': '67',
						'formOfPayment': 'cash',
					},
					[5]: {
						'transactionIndicator': 'TV',
						'ticketNumber': '0067864937758',
						'ticketNumberExtension': '59',
						'transaction': 'VOID',
						'formOfPayment': 'cash',
						'remark': 'E',
					},
					[10]: {
						'lineNumber': '7',
						'transactionIndicator': 'TE',
						'ticketNumber': '0067864937775',
						'ticketNumberExtension': '76',
						'formOfPayment': 'creditCard',
					},
					[15]: {
						'transactionIndicator': 'TV',
						'ticketNumber': '0067864937775',
						'ticketNumberExtension': '76',
						'transaction': 'VOID',
						'formOfPayment': 'creditCard',
						'remark': 'E',
					},

				},
			},
		]);

		// AJBDVR - with TR
		list.push([
			php.implode(php.PHP_EOL, [
				'TKT/TIME LIMIT',
				'  1.T-19SEP-YR8A*AT4',
				'  2.TE 5557863286517-AT WEINS/A YR8A*AT4 0722/19SEP*',
				'  3.TR 5557863286517-AB WEINS/A YR8A*AT4 0715/22SEP*I',
			]),
			{
				'tickets': [
					[],
					{
						'transactionIndicator': 'TR',
						'ticketNumber': '5557863286517',
						'bordering': 'international',
					},
				],
			},
		]);

		// YBEGWN - with appendix to the ticket number
		list.push([
			php.implode(php.PHP_EOL, [
				'TKT/TIME LIMIT',
				'  1.T-22SEP-6IIF*AIE',
				'  2.TE 0167859140993/94-AT MACHA/S 6IIF*AIE 1441/22SEP*',
			]),
			{
				'tickets': [
					{
						'ticketNumber': '0167859140993',
						'ticketNumberExtension': '94',
						'ticketStock': 'AT',
					},
				],
			},
		]);

		// JTFEOS - with 9 instead of * pcc to agent separator
		list.push([
			php.implode(php.PHP_EOL, [
				'TKT/TIME LIMIT',
				'  1.T-26SEP-37S29AAY',
				'  2.TE 9321074094179-AT AGGAR/R 37S29AAY 1448/26SEP*I',
			]),
			{
				'ticketingInfo': {
					'pcc': '37S2',
					'agentInitials': 'AY',
				},
				'tickets': [
					{
						'pcc': '37S2',
						'agentInitials': 'AY',
					},
				],
			},
		]);

		// FFJBUR - not -AT in the last line. and first line fails
		list.push([
			php.implode(php.PHP_EOL, [
				'TKT/TIME LIMIT',
				'  1.T-24JUN',
				'  2.TE 0757841215570/71-AT NASSE/R YR8A*AMY 1822/23JUN*',
				'    TV 0757841215570/71-AT  *VOID* YR8A*ADX 1257/24JUN*E',
				'  3.TE 0757821962577-78 NASSE/R SYSSYS  1527/24JUN',
			]),
			{
				'ticketingInfo': {
					'ticketingDate': {'parsed': '06-24'},
					'pcc': null,
					'agentInitials': null,
				},
				'tickets': [
					[],
					[],
					{
						'lineNumber': '3',
						'transactionIndicator': 'TE',
						'ticketNumber': '0757821962577',
						'ticketNumberExtension': '78',
						'ticketStock': null,
						'passengerName': 'NASSE/R',
						'pcc': null,
						'agentInitials': null,
						'otherMadeByIndicator': 'SYSSYS',
						'issueTime': {'parsed': '15:27'},
						'issueDate': {'parsed': '06-24'},
					},
				],
			},
		]);

		// EIELZM - "ME" transaction indicator
		list.push([
			php.implode(php.PHP_EOL, [
				'TKT/TIME LIMIT',
				'  1.T-25AUG-37S2*ARA',
				'  2.TE 0069116779823-AT ADEJU/T 37S29ANN 1604/11AUG*I',
				'  3.TE 0069116779824-AT ADEJU/R 37S29ANN 1604/11AUG*I',
				'  4.TE 0069116779825-AT ADEJU/C 37S29ANN 1604/11AUG*I',
				'  5.TE 0069116779826-AT ADEJU/B 37S29ANN 1604/11AUG*I',
				'  6.TE 0069116880158-AT ADEJU/R 37S2*APD 0821/21AUG*I',
				'  7.ME 0062812612494-AT ADEJU/R 37S2*AAN 1057/21AUG*S',
				'  8.TE 0069116924102-AT ADEJU/R 37S2*ARA 1141/25AUG*I',
				'  9.ME 0062812612497-AT ADEJU/R 37S2*ARA 1150/25AUG*S',
			]),
			{
				'tickets': [
					[],
					[],
					[],
					[],
					[],
					{
						'lineNumber': '7',
						'transactionIndicator': 'ME',
						'ticketNumber': '0062812612494',
					},
				],
			},
		]);

		// *TPQBTJ - with XTM731T instead of pcc and agent initials
		list.push([
			php.implode(php.PHP_EOL, [
				'TKT/TIME LIMIT',
				'  1.T-05SEP-XTM731T',
				'  2.TE 0017843319915/16-AT MARTI/A YR8A*ACT 1652/06JUL ',
				'  3.TE 0017845754158/59-AT MARTI/A YR8A*AST 1630/14JUL*',
				'  4.TE 0012390555252-53 MARTI/A XTM731T 1426/05SEP 1B*77E701',
			]),
			{
				'ticketingInfo': {
					'type': 'ticketed',
					'ticketingDate': {'parsed': '09-05'},
					'otherMadeByIndicator': 'XTM731T',
				},
				'tickets': [
					[],
					[],
					{
						'lineNumber': '4',
						'transactionIndicator': 'TE',
						'ticketNumber': '0012390555252',
						'ticketNumberExtension': '53',
						'otherMadeByIndicator': 'XTM731T',
					},
				],
			},
		]);

		// KOWJZU - with TAW instead of T-
		list.push([
			php.implode(php.PHP_EOL, [
				'TKT/TIME LIMIT',
				'  1.TAW/22SEP',
				'  2.TE 6967859140995-AT BABBI/W 6IIF*AIE 1636/22SEP*',
				'  3.TE 6967859140996-AT BABBI/E 6IIF*AIE 1636/22SEP*',
			]),
			{
				'ticketingInfo': {
					'type': 'timeLimit',
					'tauDate': {'parsed': '09-22'},
				},
			},
		]);

		// >*WAISCS; TAW with PCC, time and 077
		list.push([
			php.implode(php.PHP_EOL, [
				'TKT/TIME LIMIT                                                  ',
				'  1.TAW6IIF11JUN077/0400A/                                      ',
			]),
			{
				'ticketingInfo': {
					'type': 'timeLimit',
					'tauDate': {'parsed': '06-11'},
					'pcc': '6IIF',
					'tauTime': {'parsed': '04:00'},
				},
			},
		]);

		// >*EYUFXU; with trailing slash
		list.push([
			php.implode(php.PHP_EOL, [
				'TKT/TIME LIMIT                                                  ',
				'  1.TAW14SEP/                                                   ',
			]),
			{
				'ticketingInfo': {
					'type': 'timeLimit',
					'tauDate': {'parsed': '09-14'},
				},
			},
		]);

		// >*MTSBAN; with other pcc and 009
		list.push([
			php.implode(php.PHP_EOL, [
				'TKT/TIME LIMIT                                                  ',
				'  1.TAW0EKH24FEB009/                                            ',
			]),
			{
				'ticketingInfo': {
					'type': 'timeLimit',
					'tauDate': {'parsed': '02-24'},
					'pcc': '0EKH',
				},

			},
		]);

		// numbers in ticket stock code
		list.push([
			php.implode(php.PHP_EOL, [
				'TKT/TIME LIMIT',
				'  1.T-01OCT-C5VD*AAD',
				'  2.TE 0792322927170-1Y GONZA/A C5VD*AAD 0814/01OCT*D',
			]),
			{
				'tickets': [
					{
						'lineNumber': '2',
						'transactionIndicator': 'TE',
						'ticketNumber': '0792322927170',
					},
				],
			},
		]);

		return list;
	}

	/**
	 * @test
	 * @dataProvider provideDumps
	 */
	testParser(dump, expectedResult)  {
		let actualResult = TicketListParser.parse(dump);
		this.assertArrayElementsSubset(expectedResult, actualResult);
	}

	getTestMapping() {
		return [
			[this.provideDumps, this.testParser],
		];
	}
}

module.exports = TicketListParserTest;
