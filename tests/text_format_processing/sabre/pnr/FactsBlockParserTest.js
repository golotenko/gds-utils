const FactsBlockParser = require('../../../../src/text_format_processing/sabre/pnr/FactsBlockParser.js');

const php = require('enko-fundamentals/src/Transpiled/php.js');

class FactsBlockParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js')
{
	provideTestCases()  {
		const list = [];

		// #0
		list.push([
			php.implode(php.PHP_EOL, [
				'AA FACTS',
				'  1.SSR CTCE DL HK1/PAULKOENIGMN//GMAIL.COM',
				'  2.SSRSEATDLKK1AMSNCE9546V02MAR.05FN/RS',
			]),
			[
				{
					'lineNumber': 1,
					'ssrCode': 'CTCE',
					'airline': 'DL',
					'content': '/PAULKOENIGMN//GMAIL.COM',
				},
				{
					'lineNumber': 2,
					'ssrCode': 'SEAT',
					'airline': 'DL',
					'status': 'KK',
					'statusNumber': '1',
					'data': {
						'departureAirport': 'AMS',
						'destinationAirport': 'NCE',
						'flightNumber': '9546',
						'bookingClass': 'V',
						'departureDate': {'raw': '02MAR'},
					},
				},
			],
		]);

		// #1
		list.push([
			php.implode(php.PHP_EOL, [
				'AA FACTS',
				'  1.SSR ADTK 1S TO AF BY 20FEB 1600 OTHERWISE WILL BE XLD',
				'  2.SSR ADTK 1S TO KL BY 21FEB16/0300Z OTHERWISE WILL BE XXLD',
				'  3.SSR SEAT KL UN1 MADATL6029V16APR',
				'  4.SSR SEAT KL UN1 MADATL6029V16APR',
				'  5.SSR SEAT KL UN1 ATLDEN5778V16APR',
				'  6.SSR SEAT KL UN1 ATLDEN5778V16APR',
			]),
			[
				{
					'lineNumber': 1,
					'ssrCode': 'ADTK',
					'airline': '1S',
					'data': {
						'comment': 'TO AF BY 20FEB 1600 OTHERWISE WILL BE XLD',
					},
				},
				{
					'lineNumber': 2,
					'ssrCode': 'ADTK',
					'airline': '1S',
					'data': {
						'comment': 'TO KL BY 21FEB16/0300Z OTHERWISE WILL BE XXLD',
					},
				},
				{
					'lineNumber': 3,
					'ssrCode': 'SEAT',
					'airline': 'KL',
					'status': 'UN',
					'statusNumber': '1',
					'data': {
						'departureAirport': 'MAD',
						'destinationAirport': 'ATL',
						'flightNumber': '6029',
						'bookingClass': 'V',
						'departureDate': {'raw': '16APR'},
					},
				},
				[],
				[],
				[],
			],
		]);

		// #2
		list.push([
			php.implode(php.PHP_EOL, [
				'AA FACTS',
				' 16.SSR SEAT BA KK5 DFWLHR 1521O31MAR.36CN36DN36EN36FN36GN/RS',
			]),
			[
				{
					'lineNumber': 16,
					'ssrCode': 'SEAT',
					'airline': 'BA',
					'status': 'KK',
					'statusNumber': '5',
					'data': {
						'departureAirport': 'DFW',
						'destinationAirport': 'LHR',
						'flightNumber': '1521',
						'bookingClass': 'O',
						'departureDate': {'raw': '31MAR'},
					},
				},
			],
		]);

		// #3 >*IFRQOY - no space before airline
		list.push([
			php.implode(php.PHP_EOL, [
				'AA FACTS',
				'  1.SSR ADTK 1S KK7.TKT UASEGS BY 14AUG16 TO AVOID AUTO CXL /EA',
				'    RLIER',
				'  2.SSR ADTK 1S KK7.TICKETING MAY BE REQUIRED BY FARE RULE',
				'  3.SSR SEAT UA KK1 ORDLHR0931Y29AUG/28KC',
				'  4.SSR OTHS1S UA SEGS XLD - CANCEL AND REMOVE HX SEGMENTS',
				'  5.SSR ADTK 1S KK1.TKT UASEGS BY 02SEP16 TO AVOID AUTO CXL /EA',
				'    RLIER',
				'  6.SSR ADTK 1S KK1.TICKETING MAY BE REQUIRED BY FARE RULE',
				'  7.SSR OTHS 1S PASSIVE REJECTED DUE YOUR TVL AGENCY',
				'  8.SSR OTHS 1S ALREADY HOLDS A DUPLICATE ACTIVE BOOKING',
				'  9.SSR OTHS 1S PLEASE REMOVE ALL REJECTED PASSIVE SEGMENTS',
				' 10.SSR OTHS1S UA SEGS XLD - CANCEL AND REMOVE HX SEGMENTS',
				' 11.SSR ADTK 1S KK1.REMINDER UA SEGS SUBJ TO CXL ON 02SEP16',
				' 12.SSR ADTK 1S KK1.UNTICKETED UA SEGMENTS CANCELLED',
				' 13.SSR OTHS 1S UA SEGS XLD - CANCEL AND REMOVE HX SEGMENTS',
			]),
			[
				{
					'ssrCode': 'ADTK',
					'airline': '1S',
					'data': {
						'comment': 'KK7.TKT UASEGS BY 14AUG16 TO AVOID AUTO CXL /EARLIER',
					},
				},
				[],
				[],
				{
					'lineNumber': 4,
					'ssrCode': 'OTHS',
					'airline': '1S',
					'data': {
						'comment': 'UA SEGS XLD - CANCEL AND REMOVE HX SEGMENTS',
					},
				},
				[],
				[],
				[],
				[],
				[],
				{
					'lineNumber': 10,
					'ssrCode': 'OTHS',
					'airline': '1S',
				},
			],
		]);

		// #4 >*MQWBEN - without airline
		list.push([
			php.implode(php.PHP_EOL, [
				'AA FACTS',
				'  3.OSI AUTOMATED REQUEST FOR UPGRADE FAILED -',
				'  4.OSI ALL PAX NOT ELIGIBLE',
				' 11.SSR STBY NN2 ',
			]),
			[
				[],
				[],
				{
					'lineNumber': 11,
					'ssrCode': 'STBY',
				},
			],
		]);

		// #5 >*ZWXJCY - from >*P3D
		list.push([
			php.implode(php.PHP_EOL, [
				"GENERAL FACTS",
				"  1.SSR DOCS W3 HK1/DB/08AUG57/F/A  1.1 ANYANKAH/ANGELA ADAUGO",
				"    NYANKAH/ANGELA ADAUGO",
			]),
			[
				{
					'lineNumber': 1,
					'ssrCode': 'DOCS',
					'airline': 'W3',
					'data': {
						'dob': {'parsed': '1957-08-08'},
						'gender': 'F',
						'lastName': 'ANYANKAH',
						'firstName': 'ANGELA ADAUGO',
						'paxNum': '1.1',
						'paxIsInfant': false,
						'paxName': 'ANYANKAH/ANGELA ADAUGO',
					},
				},
			],
		]);

		// #6 >*more complex example of DOCS
		list.push([
			php.implode(php.PHP_EOL, [
				'GENERAL FACTS',
				'  1.SSR DOCS BT HK1/P/FR/123456789  1.1 LIBERMANE/ZIMICH',
				'    0/FR/15AUG2016/MI/30SEP2020/DE',
				'    LACROIX/LIBERMANE/ZIMICH',
				'  2.SSR DOCS BT HK1/P/FR/123456789  1.2 LIBERMANE/MARINA',
				'    1/FR/15AUG1980/MI/30SEP2020/LI',
				'    BERMANE/MARINA',
				'  3.SSR DOCS BT HK1/DB/12JUL66/M/L  2.1 LIBERMANE/BRUCE',
				'    IBERMANE/BRUCE',
			]),
			[
				{
					'lineNumber': 1,
					'data': {
						'travelDocType': 'P',
						'issuingCountry': 'FR',
						'travelDocNumber': '1234567890',
						'nationality': 'FR',
						'dob': {'parsed': '2016-08-15'},
						'gender': 'M',
						'paxIsInfant': true,
						'expirationDate': {'parsed': '2020-09-30'},
						'lastName': 'DELACROIX',
						'firstName': 'LIBERMANE',
						'middleName': 'ZIMICH',
						'paxNum': '1.1',
						'paxName': 'LIBERMANE/ZIMICH',
					},
				},
				{
					'lineNumber': 2,
					'data': {
						'travelDocType': 'P',
						'issuingCountry': 'FR',
						'travelDocNumber': '1234567891',
						'nationality': 'FR',
						'dob': {'parsed': '1980-08-15'},
						'gender': 'M',
						'paxIsInfant': true,
						'expirationDate': {'parsed': '2020-09-30'},
						'lastName': 'LIBERMANE',
						'firstName': 'MARINA',
						'paxNum': '1.2',
						'paxName': 'LIBERMANE/MARINA',
					},
				},
				{
					'lineNumber': 3,
					'data': {
						'dob': {'parsed': '1966-07-12'},
						'gender': 'M',
						'paxIsInfant': false,
						'lastName': 'LIBERMANE',
						'firstName': 'BRUCE',
						'paxNum': '2.1',
						'paxName': 'LIBERMANE/BRUCE',
					},
				},
			],
		]);

		// #7 not fitting name
		list.push([
			php.implode(php.PHP_EOL, [
				'GENERAL FACTS',
				'  1.SSR DOCS BT HK1/P/FR/123456789  2.1 VERYLONGLASTNAME/VERYLO',
				'    1/FR/15AUG1980/MI/30SEP2020/VE',
				'    RYLONGLASTNAME/VERYLONGFIRSTNA',
				'    ME',
			]),
			[
				{
					'lineNumber': 1,
					'data': {
						'lastName': 'VERYLONGLASTNAME',
						'firstName': 'VERYLONGFIRSTNAME',
						'paxNum': '2.1',
						'paxName': 'VERYLONGLASTNAME/VERYLO',
					},
				},
			],
		]);

		// #8 with primaryPassportHolderToken
		list.push([
			php.implode(php.PHP_EOL, [
				'GENERAL FACTS',
				'  1.SSR DOCS BT HK1/P/FR/123456789  2.1 VERYLONGLASTNAME/VERYLO',
				'    1/FR/15AUG1980/MI/30SEP2020/VE',
				'    RYLONGLASTNAME/VERYLONGFIRSTNA',
				'    ME/MIDDLENAME/H',
			]),
			[
				{
					'lineNumber': 1,
					'data': {
						'middleName': 'MIDDLENAME',
						'primaryPassportHolderToken': 'H',
					},
				},
			],
		]);

		// #9 with PCTC from *P3D
		list.push([
			php.implode(php.PHP_EOL, [
				'AA FACTS',
				'  1.SSR ADTK 1S KK2.TKT UASEGS BY 07FEB17 TO AVOID AUTO CXL /EA',
				'    RLIER',
				'  2.SSR ADTK 1S KK2.TICKETING MAY BE REQUIRED BY FARE RULE',
				'  3.SSR PCTC ET HK//                1.1 AKPAN/ELIJAH UDO',
				'  4.SSR PCTC ET HK//                2.1 AKPAN/DIMA ELIJAH',
			]),
			[
				[],
				[],
				{
					'lineNumber': 3,
					'ssrCode': 'PCTC',
					'airline': 'ET',
					'status': 'HK',
					'statusNumber': null,
					'data': {
						'tokens': ['', ''],
						'paxNum': '1.1',
						'paxName': 'AKPAN/ELIJAH UDO',
					},
				},
				{
					'lineNumber': 4,
					'ssrCode': 'PCTC',
					'airline': 'ET',
					'status': 'HK',
					'statusNumber': null,
					'data': {
						'tokens': ['', ''],
						'paxNum': '2.1',
						'paxName': 'AKPAN/DIMA ELIJAH',
					},
				},
			],
		]);

		// more DOCS formats
		list.push([
			php.implode(php.PHP_EOL, [
				'GENERAL FACTS',
				'  1.SSR DOCS ET HK1/DB/06MAR48/M/A  1.1 AKPAN/ELIJAH UDO',
				'    KPAN/ELIJAH UDO',
				'  2.SSR DOCS UA HK1/DB/06MAR48/M/A  1.1 AKPAN/ELIJAH UDO',
				'    KPAN/ELIJAH UDO',
				'  3.SSR DOCS KP HK1/DB/06MAR48/M/A  1.1 AKPAN/ELIJAH UDO',
				'    KPAN/ELIJAH UDO',
				'  4.SSR DOCS ET HK1/DB/04FEB58/F/A  2.1 AKPAN/DIMA ELIJAH',
				'    KPAN/DIMA ELIJAH',
				'  5.SSR DOCS UA HK1/DB/04FEB58/F/A  2.1 AKPAN/DIMA ELIJAH',
				'    KPAN/DIMA ELIJAH',
				'  6.SSR DOCS KP HK1/DB/04FEB58/F/A  2.1 AKPAN/DIMA ELIJAH',
				'    KPAN/DIMA ELIJAH',
				' 31.SSR DOCS ET HK1/P/NG/A07340115  1.1 AKPAN/ELIJAH UDO',
				'    /NG/06MAR48/M/10MAY21/AKPAN/EL',
				'    IJAHUDO',
				' 32.SSR DOCA ET HK1/R/US            1.1 AKPAN/ELIJAH UDO',
				' 33.SSR DOCA ET HK1/D/US/10919 FON  1.1 AKPAN/ELIJAH UDO',
				'    DREN ROAD/HOUSTON/TEXAS/77096',
				' 34.SSR DOCS ET HK1/P/NG/A06099982  2.1 AKPAN/DIMA ELIJAH',
				'    /NG/04FEB58/F/22SEP19/AKPAN/DI',
				'    MAELIJAH',
				' 35.SSR DOCA ET HK1/R/US            2.1 AKPAN/DIMA ELIJAH',
				' 36.SSR DOCA ET HK1/D/US/10919 FON  2.1 AKPAN/DIMA ELIJAH',
				'    DREN ROAD/HOUSTON/TEXAS/77096',
			]),
			[
				{
					'lineNumber': 1,
					'ssrCode': 'DOCS',
					'airline': 'ET',
					'status': 'HK',
					'statusNumber': '1',
					'data': {
						'dob': {'raw': '06MAR48', 'parsed': '1948-03-06'},
						'gender': 'M',
						'paxIsInfant': false,
						'lastName': 'AKPAN',
						'firstName': 'ELIJAH UDO',
						'paxNum': '1.1',
						'paxName': 'AKPAN/ELIJAH UDO',
					},
				},
				[],
				[],
				[],
				[],
				[],
				{
					'lineNumber': 31,
					'ssrCode': 'DOCS',
					'airline': 'ET',
					'status': 'HK',
					'statusNumber': '1',
					'data': {
						'travelDocType': 'P',
						'issuingCountry': 'NG',
						'travelDocNumber': 'A07340115',
						'nationality': 'NG',
						'dob': {'raw': '06MAR48', 'parsed': '1948-03-06'},
						'gender': 'M',
						'paxIsInfant': false,
						'expirationDate': {'raw': '10MAY21', 'parsed': '2021-05-10'},
						'lastName': 'AKPAN',
						'firstName': 'ELIJAHUDO',
						'middleName': null,
						'primaryPassportHolderToken': null,
						'paxNum': '1.1',
						'paxName': 'AKPAN/ELIJAH UDO',
					},
				},
				{
					'lineNumber': 32,
					'ssrCode': 'DOCA',
					'airline': 'ET',
					'status': 'HK',
					'statusNumber': '1',
					'data': {
						'tokens': ['R', 'US'],
						'paxNum': '1.1',
						'paxName': 'AKPAN/ELIJAH UDO',
					},
					'line': ' 32.SSR DOCA ET HK1/R/US',
				},
				{
					'lineNumber': 33,
					'ssrCode': 'DOCA',
					'airline': 'ET',
					'status': 'HK',
					'statusNumber': '1',
					'data': {
						'tokens': ['D', 'US', '10919 FONDREN ROAD', 'HOUSTON', 'TEXAS', '77096'],
						'paxNum': '1.1',
						'paxName': 'AKPAN/ELIJAH UDO',
					},
					'line': php.implode(php.PHP_EOL, [
						' 33.SSR DOCA ET HK1/D/US/10919 FONDREN ROAD/HOUSTON/TEXAS/77096',
					]),
				},
			],
		]);

		// short DOCS version with middle name
		list.push([
			php.implode(php.PHP_EOL, [
				'AA FACTS',
				'  1.SSR DOCS AA HK1/DB/10MAR58/M/B  1.1 BUENEMAN/JAMES HENRY',
				'    UENEMAN/JAMES/HENRY',
			]),
			[
				{
					'lineNumber': 1,
					'ssrCode': 'DOCS',
					'airline': 'AA',
					'status': 'HK',
					'statusNumber': '1',
					'data': {
						'paxNum': '1.1',
						'paxName': 'BUENEMAN/JAMES HENRY',
						'dob': {'parsed': '1958-03-10'},
						'gender': 'M',
						'paxIsInfant': false,
						'lastName': 'BUENEMAN',
						'firstName': 'JAMES',
						'middleName': 'HENRY',
					},
				},
			],
		]);

		// sabre>*ODTRUA; last name so long that "/" gets truncated
		list.push([
			php.implode(php.PHP_EOL, [
				'GENERAL FACTS',
				'  1.SSR DOCS LH HK1/DB/14JAN71/F/D  1.1 DENTESDECARVALHOSILVEIR',
				'    ENTESDECARVALHOSILVEIRA PINTO/',
				'    MICHELE',
				'  2.SSR DOCS UA HK1/DB/14JAN71/F/D  1.1 DENTESDECARVALHOSILVEIR',
				'    ENTESDECARVALHOSILVEIRA PINTO/',
				'    MICHELE',
			]),
			[
				{
					'lineNumber': 1,
					'ssrCode': 'DOCS',
					'airline': 'LH',
					'status': 'HK',
					'statusNumber': '1',
					'data': {
						'dob': {'parsed': '1971-01-14'},
						'gender': 'F',
						'paxIsInfant': false,
						'lastName': 'DENTESDECARVALHOSILVEIRA PINTO',
						'firstName': 'MICHELE',
						'paxNum': '1.1',
						'paxName': 'DENTESDECARVALHOSILVEIR',
					},
				},
			],
		]);

		// sabre>*OQGUZL; space between HK1 and tokens
		list.push([
			php.implode(php.PHP_EOL, [
				"GENERAL FACTS",
				" 11.SSR DOCO UA HK1 //K/984237551/  1.1 VANDINE/JANICE",
				"    //US",
				" 12.SSR DOCO UA HK1 //K/984237580/  2.1 VANDINE/ROBERT",
				"    //US",
			]),
			[
				{
					'lineNumber': 11,
					'ssrCode': 'DOCO',
					'airline': 'UA',
					'status': 'HK',
					'statusNumber': '1',
					'data': {
						'tokens': ['', 'K', '984237551', ''],
						'paxNum': '1.1',
						'paxName': 'VANDINE/JANICE',
					},
				},
				{
					'lineNumber': 12,
					'data': {
						'tokens': ['', 'K', '984237580', ''],
						'paxNum': '2.1',
						'paxName': 'VANDINE/ROBERT',
					},
				},
			],
		]);

		// >*DYEGHT; with wheelchair SSR-s
		list.push([
			php.implode(php.PHP_EOL, [
				'GENERAL FACTS',
				'  6.SSR WCHR DL KK1 LHRMSP0011I08MAY',
				'  7.SSR WCHR DL KK1 MSPSAT2409P08MAY',
				'  8.SSR WCHR DL KK1 SATLAX5720P09MAY',
				'  9.SSR WCHR DL KK1 LAXLHR4385I12MAY',
				' 10.SSR MAAS DL KK1 LHRMSP0011I08MAY/CONNECTIONS-',
				' 11.SSR MAAS DL KK1 MSPSAT2409P08MAY/CONNECTIONS-',
				' 12.SSR MAAS DL KK1 SATLAX5720P09MAY/CONNECTIONS-',
				' 13.SSR MAAS DL KK1 LAXLHR4385I12MAY/CONNECTIONS-',
			]),
			[
				{'lineNumber': 6, 'ssrCode': 'WCHR', 'airline': 'DL', 'status': 'KK', 'statusNumber': '1',
					'data': {
						'departureAirport': 'LHR',
						'destinationAirport': 'MSP',
						'flightNumber': '0011',
						'bookingClass': 'I',
						'departureDate': {'raw': '08MAY'},
						'comment': '',
					},
				},
				{'lineNumber': 7, 'ssrCode': 'WCHR', 'airline': 'DL', 'status': 'KK', 'statusNumber': '1',
					'data': {
						'departureAirport': 'MSP',
						'destinationAirport': 'SAT',
						'flightNumber': '2409',
						'bookingClass': 'P',
						'departureDate': {'raw': '08MAY'},
						'comment': '',
					},
				},
				{'lineNumber': 8, 'ssrCode': 'WCHR', 'airline': 'DL', 'status': 'KK', 'statusNumber': '1',
					'data': {
						'departureAirport': 'SAT',
						'destinationAirport': 'LAX',
						'flightNumber': '5720',
						'bookingClass': 'P',
						'departureDate': {'raw': '09MAY'},
						'comment': '',
					},
				},
				{'lineNumber': 9, 'ssrCode': 'WCHR', 'airline': 'DL', 'status': 'KK', 'statusNumber': '1',
					'data': {
						'departureAirport': 'LAX',
						'destinationAirport': 'LHR',
						'flightNumber': '4385',
						'bookingClass': 'I',
						'departureDate': {'raw': '12MAY'},
						'comment': '',
					},
				},
				{'lineNumber': 10, 'ssrCode': 'MAAS', 'airline': 'DL', 'status': 'KK', 'statusNumber': '1',
					'data': {
						'departureAirport': 'LHR',
						'destinationAirport': 'MSP',
						'flightNumber': '0011',
						'bookingClass': 'I',
						'departureDate': {'raw': '08MAY'},
						'comment': '/CONNECTIONS-',
					},
				},
				{'lineNumber': 11, 'ssrCode': 'MAAS', 'airline': 'DL', 'status': 'KK', 'statusNumber': '1',
					'data': {
						'departureAirport': 'MSP',
						'destinationAirport': 'SAT',
						'flightNumber': '2409',
						'bookingClass': 'P',
						'departureDate': {'raw': '08MAY'},
						'comment': '/CONNECTIONS-',
					},
				},
				{'lineNumber': 12, 'ssrCode': 'MAAS', 'airline': 'DL', 'status': 'KK', 'statusNumber': '1',
					'data': {
						'departureAirport': 'SAT',
						'destinationAirport': 'LAX',
						'flightNumber': '5720',
						'bookingClass': 'P',
						'departureDate': {'raw': '09MAY'},
						'comment': '/CONNECTIONS-',
					},
				},
				{'lineNumber': 13, 'ssrCode': 'MAAS', 'airline': 'DL', 'status': 'KK', 'statusNumber': '1',
					'data': {
						'departureAirport': 'LAX',
						'destinationAirport': 'LHR',
						'flightNumber': '4385',
						'bookingClass': 'I',
						'departureDate': {'raw': '12MAY'},
						'comment': '/CONNECTIONS-',
					},
				},
			],
		]);

		// >*GAMHCK; non-doc SSR-s displayed with passenger number/name using *P3*P4
		list.push([
			php.implode(php.PHP_EOL, [
				'AA FACTS',
				'  1.SSR CTCE  /NIGELCROSSLEY1904//  1.1 CROSSLEY/NIGEL PETER',
				'    COMCAST.NET NN1 ',
				'  2.SSR CTCM  /15614292277 NN1      1.1 CROSSLEY/NIGEL PETER',
				'  5.SSR PCTC AA HK/PSGR/DECLINED    1.1 CROSSLEY/NIGEL PETER',
				'  8.SSR PCTC AA HK/PSGR/DECLINED    2.1 CROSSLEY/ELAINE',
				'  9.SSR WCHR AA 630H2DEC/NN1        1.1 CROSSLEY/NIGEL PETER',
			]),
			[
				{'lineNumber': 1, 'ssrCode': 'CTCE','content': '/NIGELCROSSLEY1904//COMCAST.NET NN1',
					'data': {
						'paxNum': '1.1',
						'paxName': 'CROSSLEY/NIGEL PETER',
					},
				},
				{'lineNumber': 2, 'ssrCode': 'CTCM','content': '/15614292277 NN1',
					'data': {
						'paxNum': '1.1',
						'paxName': 'CROSSLEY/NIGEL PETER',
					},
				},
				{'lineNumber': 5, 'ssrCode': 'PCTC', 'airline': 'AA',
					'data': {
						'paxNum': '1.1',
						'paxName': 'CROSSLEY/NIGEL PETER',
					},
				},
				{'lineNumber': 8, 'ssrCode': 'PCTC', 'airline': 'AA',
					'data': {
						'paxNum': '2.1',
						'paxName': 'CROSSLEY/ELAINE',
					},
				},
				{'lineNumber': 9, 'ssrCode': 'WCHR', 'airline': 'AA',
					'data': {
						'flightNumber': '630',
						'bookingClass': 'H',
						'departureDate': {'raw': '2DEC'},
						'paxNum': '1.1',
						'paxName': 'CROSSLEY/NIGEL PETER',
					},
				},
			],
		]);

		// JOHBEW
		// very long OSI, wrapped on following line
		list.push([
			php.implode(php.PHP_EOL, [
				'GENERAL FACTS',
				'  1.OSI YY THE EDISON INN 1361 US HIGHWAY 1 EDISON NJ 08837 UNI',
				'    TED STATES OF AMERICA PHONE 1 732 6625494',
				'  2.OSI YY CONFIRMATION 7359504174890',
				'  3.OSI YY CHECK IN 14SEP CHECK OUT 17SEP',
				'  4.SSR CTCE UA HK1/IAN//BLUEZ.CO.  1.1 BLUES/IAN DOUGLAS',
				'    UK',
				'  5.SSR CTCE UA HK1/IAN//BLUEZ.CO.  1.1 BLUES/IAN DOUGLAS',
				'    UK',
				'  6.SSR CTCM UA HK1/441316661195    1.1 BLUES/IAN DOUGLAS',
				'  7.SSR CTCM UA HK1/441316661195    1.1 BLUES/IAN DOUGLAS',
				'  8.SSR CTCM UA HK1/447703645384    2.1 BLUES/GAIL ELIZABETH',
				'  9.SSR CTCM UA HK1/447703645384    2.1 BLUES/GAIL ELIZABETH',
				' 10.SSR DOCS UA HK1/DB/29APR58/M/B  1.1 BLUES/IAN DOUGLAS',
				'    LUES/IAN DOUGLAS',
				' 11.SSR DOCS UA HK1/DB/19APR57/F/B  2.1 BLUES/GAIL ELIZABETH',
				'    LUES/GAIL ELIZABETH',
			]),
			[
				{'lineNumber': 1, 'ssrCode': 'OSI'},
				{'lineNumber': 2, 'ssrCode': 'OSI'},
				{'lineNumber': 3, 'ssrCode': 'OSI'},
				{'lineNumber': 4, 'ssrCode': 'CTCE'},
				{'lineNumber': 5, 'ssrCode': 'CTCE'},
				{'lineNumber': 6, 'ssrCode': 'CTCM'},
				{'lineNumber': 7, 'ssrCode': 'CTCM'},
				{'lineNumber': 8, 'ssrCode': 'CTCM'},
				{'lineNumber': 9, 'ssrCode': 'CTCM'},
				{'lineNumber': 10, 'ssrCode': 'DOCS'},
				{'lineNumber': 11, 'ssrCode': 'DOCS'},
			],
		]);

		return list;
	}

	testParserOutput(factsSectionDump, expectation)  {
		const actualResult = FactsBlockParser.parse(factsSectionDump).ssrList;
		this.assertArrayElementsSubset(expectation, actualResult);
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testParserOutput],
		];
	}
}
FactsBlockParserTest.count = 0;
module.exports = FactsBlockParserTest;
