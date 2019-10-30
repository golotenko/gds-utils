
const php = require('enko-fundamentals/src/Transpiled/php.js');
const TicketHistoryParser = require('../../../src/text_format_processing/apollo/TicketHistoryParser.js');

class TicketHistoryParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js') {
	provideDumps() {
		let list = [];

		list.push([
			php.implode(php.PHP_EOL, [
				'** CURRENT TIN DATA **',
				'PUPKIN/JOSEPH-00010899/0017917255225/-USD/606.86/TE/26FEB0346Z',
				'PUPKAN/LEANNH-00010900/0017917255226/-USD/606.86/TE/26FEB0346Z',
				'PUPKAN/LEAHMA-00010901/0017917255227/-USD/606.86/TE/26FEB0346Z',
				'** HISTORY TIN DATA **',
				'XK PUPKIN/JOSEPH-/8900691881010/-USD/129.00/26FEB0345Z',
				'XK PUPKIN/JOSEPH-/8900691881009/-USD/1820.58/26FEB0342Z',
				'',
			]),
			{
				'currentTickets': [
					{
						'lastName': 'PUPKIN',
						'firstName': 'JOSEPH',
						'stockNumber': '00010899',
						'ticketNumber': '0017917255225',
						'invoiceNumber': '',
						'currency': 'USD',
						'amount': '606.86',
						'transactionIndicator': 'TE',
						'transactionDt': {
							'raw': '26FEB0346Z',
							'parsed': '02-26 03:46',
							'tz': 'UTC',
						},
					},
					{'ticketNumber': '0017917255226'},
					{'ticketNumber': '0017917255227'},
				],
				'deletedTickets': [
					{
						'historyActionCode': 'XK',
						'lastName': 'PUPKIN',
						'firstName': 'JOSEPH',
						'ticketNumber': '8900691881010',
						'invoiceNumber': '',
						'currency': 'USD',
						'amount': '129.00',
						'transactionDt': {
							'raw': '26FEB0345Z',
							'parsed': '02-26 03:45',
							'tz': 'UTC',
						},
					},
					{'ticketNumber': '8900691881009'},
				],
			},
		]);

		// >*QS5T06; with invoice number
		list.push([
			php.implode(php.PHP_EOL, [
				'** CURRENT TIN DATA **',
				'PUPKIN/IRVINC-00000000-01/0067918378830-831/000434810-USD/730.66/TE/21MAR0337Z',
				'',
			]),
			{
				'currentTickets': [
					{
						'lastName': 'PUPKIN',
						'firstName': 'IRVINC',
						'stockNumber': '00000000-01',
						'ticketNumber': '0067918378830',
						'ticketExtension': '831',
						'invoiceNumber': '000434810',
						'currency': 'USD',
						'amount': '730.66',
						'transactionIndicator': 'TE',
						'transactionDt': {'parsed': '03-21 03:37'},
					},
				],
			},
		]);

		// >*TK402M; with MCO - no /TE/ transaction indicator, no stock number
		list.push([
			php.implode(php.PHP_EOL, [
				'** CURRENT TIN DATA **',
				'PUPKIN/RODOLFO-/8900692925111/-USD/210.00/28APR0050Z',
				'** HISTORY TIN DATA **',
				'XK PUPKIN/RODOLFO-00000000-01/9887920901811-812/-USD/1178.56/TE/28APR0049Z',
				'',
			]),
			{
				'currentTickets': [
					{
						'lastName': 'PUPKIN',
						'firstName': 'RODOLFO',
						'stockNumber': '',
						'ticketNumber': '8900692925111',
						'invoiceNumber': '',
						'currency': 'USD',
						'amount': '210.00',
						'transactionDt': {'parsed': '04-28 00:50'},
					},
				],
				'deletedTickets': [
					{'ticketNumber': '9887920901811'},
				],

			},
		]);

		// >*Q2KM7U; last name so long that "/" is truncated
		list.push([
			php.implode(php.PHP_EOL, [
				'** CURRENT TIN DATA **',
				'PUPKINPUPKINPU-00000000-01/1808605906345-346/-USD/999.36/TE/06MAY1832Z',
				'PUPKAN/NATHA-00000000-01/1808605906347-348/-USD/795.36/TE/06MAY1832Z',
			]),
			{
				'currentTickets': [
					{
						'lastName': 'PUPKINPUPKINPU',
						'firstName': '',
						'stockNumber': '00000000-01',
						'ticketNumber': '1808605906345',
						'invoiceNumber': '',
						'currency': 'USD',
						'amount': '999.36',
						'transactionDt': {'parsed': '05-06 18:32'},
					},
					{
						'lastName': 'PUPKAN',
						'firstName': 'NATHA',
						'stockNumber': '00000000-01',
						'ticketNumber': '1808605906347',
						'invoiceNumber': '',
						'currency': 'USD',
						'amount': '795.36',
						'transactionDt': {'parsed': '05-06 18:32'},
					},
				],
			},
		]);

		// invoice number with letters (thanks, Bill)
		// >*PBS98E; session #402632
		list.push([
			php.implode(php.PHP_EOL, [
				"** CURRENT TIN DATA **",
				"PUPKIN/SOLOMON-00000000-01/0067401158461-462/EZ0002371-USD/1401.33/TE/24MAY0531Z",
				"** HISTORY TIN DATA **",
				"XK PUPKIN/SOLOMON-00011736-37/0065056248761/EZ0002367-USD/1385.30/24MAY0445Z",
			]),
			{
				currentTickets: [
					{
						lastName: 'PUPKIN',
						firstName: 'SOLOMON',
						stockNumber: '00000000-01',
						ticketNumber: '0067401158461',
						invoiceNumber: 'EZ0002371',
						currency: 'USD',
						amount: '1401.33',
						transactionDt: {'parsed': '05-24 05:31'},
					},
				],
				deletedTickets: [
					{
						lastName: 'PUPKIN',
						firstName: 'SOLOMON',
						stockNumber: '00011736-37',
						ticketNumber: '0065056248761',
						invoiceNumber: 'EZ0002367',
						currency: 'USD',
						amount: '1385.30',
						transactionDt: {'parsed': '05-24 04:45'},
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
	testParser(dump, expected) {
		let actual = TicketHistoryParser.parse(dump);
		this.assertArrayElementsSubset(expected, actual);
	}

	getTestMapping() {
		return [
			[this.provideDumps, this.testParser],
		];
	}
}

module.exports = TicketHistoryParserTest;
