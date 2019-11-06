// namespace Gds\Parsers\Apollo\ApolloReservationParser;

const SsrBlockParser = require('../../../../src/text_format_processing/apollo/pnr/SsrBlockParser.js');
const php = require('enko-fundamentals/src/Transpiled/php.js');

class SsrBlockParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js') {
	provideTreeTestDumpList() {
		let list = [];

		list.push([
			php.implode(php.PHP_EOL, [
				'GFAX-SSRADTK1VTOKL BY 26JUL/0000Z OTHERWISE WILL BE XXLD',
				'   2 SSROTHS1V NN1. PLS ISSUE TKT BY 2359/25JUL OR PNR WILL AUTO XXL',
				'   3 SSROTHS1V NN1. PLS NOTE FARE RULES MAY REQUIRE AN EARLIER TKT DTE',
				'   4 SSROTHS1V NN1. FAILURE TO TKT BY EARLIER DTE MAY RESULT IN ',
				'   5 SSROTHS1V ///DEBITMEMO',
				'   6 SSRDOCSDLHK1/////01OCT45/M//PANTOJA PEREZ/JOSE ALCIDES-1PANTOJAPEREZ/JOSE ALCIDES',
				'   7 SSRDOCSKLHK1/////01OCT45/M//PANTOJA PEREZ/JOSE ALCIDES-1PANTOJAPEREZ/JOSE ALCIDES',
				'   8 SSRTKNEDLHK01 MIAJFK 2577T 26JUL-1PANTOJAPEREZ/.0067409313882C1/882-883',
				'   9 SSRTKNEDLHK01 JFKACC 0478T 26JUL-1PANTOJAPEREZ/.0067409313882C2/882-883',
				'  10 SSRTKNEDLHK01 MIAJFK 2577T 26JUL-1PANTOJAPEREZ/.0067409313884C1/884-885',
				'  11 SSRTKNEDLHK01 JFKACC 0478T 26JUL-1PANTOJAPEREZ/.0067409313884C2/884-885',
				'  12 SSRTKNEKLHK01 ACCAMS 0590N 04AUG-1PANTOJAPEREZ/.0067409313884C3/884-885',
				'  13 SSRTKNEKLHK01 AMSDTW 6051N 05AUG-1PANTOJAPEREZ/.0067409313884C4/884-885',
				'  14 SSRTKNEKLHK01 DTWFLL 5520N 05AUG-1PANTOJAPEREZ/.0067409313885C1/884-885',
			]),
			{
				'6': {'ssrCode': 'DOCS', 'airline': 'DL', 'data': {'dob': {'parsed': '1945-10-01'}}},
			},
		]);

		// That's how seats are confirmed on SN: 9D will show 'pending' forever
		list.push([
			'GFAX-SSROTHS1V  NOSHOW WILL RESULT IN ADM IF UNTKTD/BRUSN 04AUG' + php.PHP_EOL +
			'   2 SSRNSSWSNKK1JFKBRU0502Y10SEP.33K' + php.PHP_EOL,
			[
				{
					'lineNumber': 1,
					'airline': '1V',
					'ssrCode': 'OTHS',
					'data': null,
					'line': 'GFAX-SSROTHS1V  NOSHOW WILL RESULT IN ADM IF UNTKTD/BRUSN 04AUG',
				},
				{
					'lineNumber': 2,
					'airline': 'SN',
					'ssrCode': 'NSSW',
					'data': null,
					'line': '   2 SSRNSSWSNKK1JFKBRU0502Y10SEP.33K',
				},
			],
		]);

		list.push([
			'GFAX-SSROTHS1V  NOSHOW WILL RESULT IN ADM IF UNTKTD/BRUSN 04AUG' + php.PHP_EOL +
			'   2 SSRNSSTSNKK1JFKBRU0502Y20SEP.20E',
			[
				{
					'lineNumber': 1,
					'airline': '1V',
					'ssrCode': 'OTHS',
					'data': null,
					'line': 'GFAX-SSROTHS1V  NOSHOW WILL RESULT IN ADM IF UNTKTD/BRUSN 04AUG',
				},
				{
					'lineNumber': 2,
					'airline': 'SN',
					'ssrCode': 'NSST',
					'data': null,
					'line': '   2 SSRNSSTSNKK1JFKBRU0502Y20SEP.20E',
				},
			],
		]);

		// S42RHW
		list.push([
			php.implode(php.PHP_EOL, [
				'GFAX-SSROTHS1V  NOSHOW WILL RESULT IN ADM IF UNTKTD/BRUSN 04AUG',
				'   2 SSROTHS1V  MND SN DOES NOT OFFER SMOKING SEAT',
				'   3 SSRSMSASNNO1JFKBRU0502Y20SEP-1LIBERMANE/MARINA',
				'   4 SSRNSSTSNKK1JFKBRU0502Y20SEP-1LIBERMANE/MARINA.021A',
			]),
			[
				{
					'lineNumber': 1,
					'airline': '1V',
					'ssrCode': 'OTHS',
					'data': null,
					'line': 'GFAX-SSROTHS1V  NOSHOW WILL RESULT IN ADM IF UNTKTD/BRUSN 04AUG',
				},
				{
					'lineNumber': 2,
					'airline': '1V',
					'ssrCode': 'OTHS',
					'data': null,
					'line': '   2 SSROTHS1V  MND SN DOES NOT OFFER SMOKING SEAT',
				},
				{
					'lineNumber': 3,
					'airline': 'SN',
					'ssrCode': 'SMSA',
					'data': null,
					'line': '   3 SSRSMSASNNO1JFKBRU0502Y20SEP-1LIBERMANE/MARINA',
				},
				{
					'lineNumber': 4,
					'airline': 'SN',
					'ssrCode': 'NSST',
					'data': null,
					'line': '   4 SSRNSSTSNKK1JFKBRU0502Y20SEP-1LIBERMANE/MARINA.021A',
				},
			],
		]);

		// PK7J9M
		list.push([
			php.implode(php.PHP_EOL, [
				'GFAX-SSRFQTVBANO/BA0056322-BONAN/CHARLES.INVLD ACCT NUMBER',
				'   2 SSRDOCSBAHK1/////09SEP51/M//BONAN/CHARLES-1BONAN/CHARLES',
				'   3 SSRTKNEBAHK01 BLQLHR 0541J 11JUL-1BONAN/CHARLES.1257408947052C1',
				'   4 SSRTKNEBAHK01 LHRLAX 0269I 11JUL-1BONAN/CHARLES.1257408947052C2',
				'   5 SSRTKNEBAHK01 LAXLHR 1509I 20NOV-1BONAN/CHARLES.1257408947052C3',
				'   6 SSRTKNEBAHK01 LHRBLQ 0542J 21NOV-1BONAN/CHARLES.1257408947052C4',
				'   7 SSRRQSTBAHK1BLQLHR0541J11JUL.03DN',
				'   8 SSRRQSTBAHK1BLQLHR0541J11JUL.03DN',
				'   9 SSRNSSTBAKK1LAXLHR1509I20NOV.03J',
			]),
			[
				{
					'lineNumber': 1,
					'airline': 'BA',
					'ssrCode': 'FQTV',
					'data': null,
					'line': 'GFAX-SSRFQTVBANO/BA0056322-BONAN/CHARLES.INVLD ACCT NUMBER',
				},
				{
					'lineNumber': 2,
					'airline': 'BA',
					'ssrCode': 'DOCS',
					'data': {
						'dob': {'raw': '09SEP51', 'parsed': '1951-09-09'},
						'gender': 'M',
						'lastName': 'BONAN',
						'firstName': 'CHARLES',
						'paxNum': '1',
						'paxIsInfant': false,
					},
					'pnrPaxName': 'BONAN/CHARLES',
					'line': '   2 SSRDOCSBAHK1/////09SEP51/M//BONAN/CHARLES-1BONAN/CHARLES',
				},
				{
					'lineNumber': 3,
					'airline': 'BA',
					'ssrCode': 'TKNE',
					'data': null,
					'line': '   3 SSRTKNEBAHK01 BLQLHR 0541J 11JUL-1BONAN/CHARLES.1257408947052C1',
				},
				{
					'lineNumber': 4,
					'airline': 'BA',
					'ssrCode': 'TKNE',
					'data': null,
					'line': '   4 SSRTKNEBAHK01 LHRLAX 0269I 11JUL-1BONAN/CHARLES.1257408947052C2',
				},
				{
					'lineNumber': 5,
					'airline': 'BA',
					'ssrCode': 'TKNE',
					'data': null,
					'line': '   5 SSRTKNEBAHK01 LAXLHR 1509I 20NOV-1BONAN/CHARLES.1257408947052C3',
				},
				{
					'lineNumber': 6,
					'airline': 'BA',
					'ssrCode': 'TKNE',
					'data': null,
					'line': '   6 SSRTKNEBAHK01 LHRBLQ 0542J 21NOV-1BONAN/CHARLES.1257408947052C4',
				},
				{
					'lineNumber': 7,
					'airline': 'BA',
					'ssrCode': 'RQST',
					'data': null,
					'line': '   7 SSRRQSTBAHK1BLQLHR0541J11JUL.03DN',
				},
				{
					'lineNumber': 8,
					'airline': 'BA',
					'ssrCode': 'RQST',
					'data': null,
					'line': '   8 SSRRQSTBAHK1BLQLHR0541J11JUL.03DN',
				},
				{
					'lineNumber': 9,
					'airline': 'BA',
					'ssrCode': 'NSST',
					'data': null,
					'line': '   9 SSRNSSTBAKK1LAXLHR1509I20NOV.03J',
				},
			],
		]);

		// JRBNHM
		list.push([
			php.implode(php.PHP_EOL, [
				'GFAX-SSRKSMLLHNN01 FRAFLR 0314J 11SEP  ',
				'   2 SSRWCHRLHNN01 FRAFLR 0314J 11SEP',
			]),
			[
				{
					'lineNumber': 1,
					'airline': 'LH',
					'ssrCode': 'KSML',
					'data': {
						'airline': 'LH',
						'status': 'NN',
						'statusNumber': '01',
						'departureAirport': 'FRA',
						'destinationAirport': 'FLR',
						'flightNumber': '0314',
						'bookingClass': 'J',
						'departureDate': {'raw': '11SEP', 'parsed': '09-11'},
						'paxIsInfant': false,
						'comment': '',
					},
					'pnrPaxName': null,
					'line': 'GFAX-SSRKSMLLHNN01 FRAFLR 0314J 11SEP  ',
				},
				{
					'lineNumber': 2,
					'airline': 'LH',
					'ssrCode': 'WCHR',
					'data': {
						'airline': 'LH',
						'status': 'NN',
						'statusNumber': '01',
						'departureAirport': 'FRA',
						'destinationAirport': 'FLR',
						'flightNumber': '0314',
						'bookingClass': 'J',
						'departureDate': {'raw': '11SEP', 'parsed': '09-11'},
						'paxIsInfant': false,
						'comment': null,
					},
					'line': '   2 SSRWCHRLHNN01 FRAFLR 0314J 11SEP',
				},
			],
		]);

		// JV1NVA
		list.push([
			php.implode(php.PHP_EOL, [
				'GFAX-SSRWCHRCXNN01 LHRHKG 0252Y 10SEP-1LIBERMANE/MARINA ',
				'   2 SSRWCHRPRNN01 HKGMNL 0313J 11SEP-1LIBERMANE/MARINA ',
				'   3 SSRKSMLCXKK01 LHRHKG 0252Y 10SEP-1LIBERMANE/MARINA ',
				'   4 SSRBBMLPRNN01 HKGMNL 0313J 11SEP-1ZIMICH/ALEXANDER ',
				'   5 SSRDEAFCXNN01 LHRHKG 0252Y 10SEP-1ZIMICH/ALEXANDER ',
				'   6 SSRDEAFPRNN01 HKGMNL 0313J 11SEP-1ZIMICH/ALEXANDER',
			]),
			[
				{
					'lineNumber': 1,
					'airline': 'CX',
					'ssrCode': 'WCHR',
					'data': {
						'airline': 'CX',
						'status': 'NN',
						'statusNumber': '01',
						'departureAirport': 'LHR',
						'destinationAirport': 'HKG',
						'flightNumber': '0252',
						'bookingClass': 'Y',
						'departureDate': {'raw': '10SEP', 'parsed': '09-10'},
						'paxIsInfant': false,
						'comment': null,
					},
					'pnrPaxName': 'LIBERMANE/MARINA',
					'line': 'GFAX-SSRWCHRCXNN01 LHRHKG 0252Y 10SEP-1LIBERMANE/MARINA ',
				},
				{
					'lineNumber': 2,
					'airline': 'PR',
					'ssrCode': 'WCHR',
					'data': {
						'airline': 'PR',
						'status': 'NN',
						'statusNumber': '01',
						'departureAirport': 'HKG',
						'destinationAirport': 'MNL',
						'flightNumber': '0313',
						'bookingClass': 'J',
						'departureDate': {'raw': '11SEP', 'parsed': '09-11'},
						'paxIsInfant': false,
						'comment': null,
					},
					'pnrPaxName': 'LIBERMANE/MARINA',
					'line': '   2 SSRWCHRPRNN01 HKGMNL 0313J 11SEP-1LIBERMANE/MARINA ',
				},
				{
					'lineNumber': 3,
					'airline': 'CX',
					'ssrCode': 'KSML',
					'data': {
						'airline': 'CX',
						'status': 'KK',
						'statusNumber': '01',
						'departureAirport': 'LHR',
						'destinationAirport': 'HKG',
						'flightNumber': '0252',
						'bookingClass': 'Y',
						'departureDate': {'raw': '10SEP', 'parsed': '09-10'},
						'paxIsInfant': false,
						'comment': null,
					},
					'pnrPaxName': 'LIBERMANE/MARINA',
					'line': '   3 SSRKSMLCXKK01 LHRHKG 0252Y 10SEP-1LIBERMANE/MARINA ',
				},
				{
					'lineNumber': 4,
					'airline': 'PR',
					'ssrCode': 'BBML',
					'data': {
						'airline': 'PR',
						'status': 'NN',
						'statusNumber': '01',
						'departureAirport': 'HKG',
						'destinationAirport': 'MNL',
						'flightNumber': '0313',
						'bookingClass': 'J',
						'departureDate': {'raw': '11SEP', 'parsed': '09-11'},
						'paxIsInfant': false,
						'comment': null,
					},
					'pnrPaxName': 'ZIMICH/ALEXANDER',
					'line': '   4 SSRBBMLPRNN01 HKGMNL 0313J 11SEP-1ZIMICH/ALEXANDER ',
				},
				{
					'lineNumber': 5,
					'airline': 'CX',
					'ssrCode': 'DEAF',
					'data': {
						'airline': 'CX',
						'status': 'NN',
						'statusNumber': '01',
						'departureAirport': 'LHR',
						'destinationAirport': 'HKG',
						'flightNumber': '0252',
						'bookingClass': 'Y',
						'departureDate': {'raw': '10SEP', 'parsed': '09-10'},
						'paxIsInfant': false,
						'comment': null,
					},
					'pnrPaxName': 'ZIMICH/ALEXANDER',
					'line': '   5 SSRDEAFCXNN01 LHRHKG 0252Y 10SEP-1ZIMICH/ALEXANDER ',
				},
				{
					'lineNumber': 6,
					'airline': 'PR',
					'ssrCode': 'DEAF',
					'data': {
						'airline': 'PR',
						'status': 'NN',
						'statusNumber': '01',
						'departureAirport': 'HKG',
						'destinationAirport': 'MNL',
						'flightNumber': '0313',
						'bookingClass': 'J',
						'departureDate': {'raw': '11SEP', 'parsed': '09-11'},
						'paxIsInfant': false,
						'comment': null,
					},
					'pnrPaxName': 'ZIMICH/ALEXANDER',
					'line': '   6 SSRDEAFPRNN01 HKGMNL 0313J 11SEP-1ZIMICH/ALEXANDER',
				},
			],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'GFAX-SSRKSMLUSKK01 LHRLAX 7129Y 10SEP-1LIBERMANE/MARINA ',
				'   2 SSRBBMLUSNO01 LHRLAX 7129Y 10SEP-1LIBERMANE/ZIMICH ',
				'   3 SSRDEAFUSKK01 LHRLAX 7129Y 10SEP-1LIBERMANE/ZIMICH ',
				'   4 SSRBBMLUSNO1 LHRLAX7129Y10SEP-1LIBERMANE/ZIMICH.MEAL TYPE NOT AVAILABLEFORTHISFLIGHT',
			]),
			[],
		]);

		list.push([
			'   6 SSRDOCSKLHK1/P/AFG/S1232138768762/USA/07APR83/F/24SEP20/LIBERMANE/ZIMICH/JUAN-1LIBERMANE/ZIMICH' + php.PHP_EOL,
			[],
		]);

		list = [];
		list.push([
			php.implode(php.PHP_EOL, [
				'   5 SSRDOCOCAHK1/PARIS FR/V/12345123/LONDON GBR/14MAR11/US-1LIBERMANE/MARINA',
				'   6 SSRDOCACAHK1/R/US/1800 SMITH STREET/HOUSTON/TX/12345-1LIBERMANE/MARINA',
			]),
			[],
		]);

		// with 'ADMD' ssr code
		list.push([
			php.implode(php.PHP_EOL, [
				'  14 SSRRQSTLHKK1FRALAX0456T15JAN.65AN',
				'  15 SSRADMD1VKK1 TO LH BY 17OCT 2016 OTHERWISE WILL BE CANCELLED',
				'  16 SSRNSSTLHKK1PHXORD9395T14DEC.23A',
			]),
			[
				{'ssrCode': 'RQST', 'airline': 'LH'},
				{'ssrCode': 'ADMD', 'airline': '1V'},
			],
		]);

		// with 'WCHS' ssr code
		list.push([
			php.implode(php.PHP_EOL, [
				'  16 SSRTKNEUAHK01 NRTORD 7926K 07MAR-1ARCE/MARIAPAZ.0167827230576C1/575-576',
				'  17 SSRWCHSNHKK01 NRTMNL 0819K 24JAN-1ACLO/DEODORO C.PAX CANT WALK ON HIS OWN ESPECIALLY IN LONG DISTANCES',
				'  19 SSRWCHSNHKK01 MNLNRT 0820K 07MAR-1ACLO/DEODORO C.PAX CANT WALK ON HIS OWN ESPECIALLY IN LONG DISTANCES',
				'  21 SSRWCHSUAKK01 NRTORD 7926K 07MAR-1ACLO/DEODORO C.PAX CANT WALK ON HIS OWN ESPECIALLY IN LONG DISTANCES/PAX CANT WALK ON HISOWNESPECIAL',
			]),
			[
				{
					'lineNumber': 16, 'ssrCode': 'TKNE', 'data': {
						'ticketNumber': '0167827230576',
						'couponNumber': '1',
						'unparsed': '/575-576',
					},
					'pnrPaxName': 'ARCE/MARIAPAZ',
				},
				{'lineNumber': 17, 'ssrCode': 'WCHS'},
				{
					'ssrCode': 'WCHS',
					'airline': 'NH',
					'data': {
						'departureDate': {'parsed': '03-07'},
						'comment': 'PAX CANT WALK ON HIS OWN ESPECIALLY IN LONG DISTANCES',
					},
				},
			],
		]);

		// >*P9CG6G - with 'DOCS' and expiration date
		list.push([
			php.implode(php.PHP_EOL, [
				'GFAX-SSRADTK1VTOTK BY 04OCT 1352 IRC-2/ADV OTO TKT ',
				'   2 SSROTHS1V   PLEASE ADVISE FQTV NUMBER IF AVAILABLE',
				'   3 SSROTHS1V   PLS ADV PSGR MOBILE AND/OR EMAIL AS SSR CTCM/CT',
				'CE',
				'   4 SSRADPI1VHK2  ADV SECURE FLT PSGR DATA FOR ALL PSGRS',
				'   5 SSRDOCSTKHK1/P/USA/471878161/USA/07AUG55/F/23JUN20/PILRAM/A',
				'LICE/JO-1PILRAM/ALICE JO',
				'   6 SSRDOCSTKHK1/P/USA/471880337/USA/24JUN53/M/23JUN20/PILRAM/A',
				'TAOLLAH/-1PILRAM/ATAOLLAH',
				'   7 SSRTKNETKHK01 SFOIST 0080U 16NOV-1PILRAM/ALICE .23578293482',
				'55C1',
			]),
			{
				'5': {
					'ssrCode': 'DOCS',
					'airline': 'TK',
					'data': {'dob': {'parsed': '1955-08-07'}, 'expirationDate': {'parsed': '2020-06-23'}},
				},
			},
		]);

		// with OSI
		list.push([
			php.implode(php.PHP_EOL, [
				'GFAX-SSRADPI1VKK1 CA0988 REQ SEC FLT PSGR DATA 72 HBD FOR ALL PSGRS',
				'   2 SSRADPI1VHK1 CA0987 REQ SEC FLT PSGR DATA 72 HBD FOR ALL PSGRS',
				'   3 SSRADTK1VBYSFO14SEP16/1630 OR CXL CA ALL SEGS',
				'   4 OSIYY RLOC QTS1VMVXRB9',
				'   5 SSRWCHSCAKK01 LAXPEK 0988L 27NOV-1GROSS/SUSAN K ',
				'   6 SSRWCHSCAKK01 PEKMNL 0179L 28NOV-1GROSS/SUSAN K ',
				'   7 SSRWCHSCAKK01 MNLPEK 0180L 20DEC-1GROSS/SUSAN K ',
				'   8 SSRWCHSCAKK01 PEKLAX 0987L 20DEC-1GROSS/SUSAN K ',
				'   9 SSRDOCSCAHK1/////25DEC51/F//GROSS/SUSAN/K-1GROSS/SUSAN K',
				'  10 SSRTKNECAHK01 LAXPEK 0988L 27NOV-1GROSS/SUSAN K.9997828202884C1',
				'  11 SSRTKNECAHK01 PEKMNL 0179L 28NOV-1GROSS/SUSAN K.9997828202884C2',
				'  12 SSRTKNECAHK01 MNLPEK 0180L 20DEC-1GROSS/SUSAN K.9997828202884C3',
				'  13 SSRTKNECAHK01 PEKLAX 0987L 20DEC-1GROSS/SUSAN K.9997828202884C4',
			]),
			{[3]: {'ssrCode': 'OSI', 'airline': 'YY'}},
		]);

		// DOCS without -1{lastName/firstName} because it was added by airline
		list.push([
			php.implode(php.PHP_EOL, [
				'GFAX-SSROTHS1V.PLS REMOVE S7 HX SEGS 24 HOURS BEFORE DEPARTURE TO AVOID',
				'   4 SSRDOCSAAHK1/////26APR52/F//BROOKS/KAREN/SAUNDERS-1BROOKS/KAREN SAUNDERS',
				'   5 SSRDOCSS7HK1/////26APR52/F//BROOKS/KAREN/SAUNDERS-1BROOKS/KAREN SAUNDERS',
				// ...
				'  16 SSRDOCSBAHK1/P/USA/505759432/USA/26APR52/F/14SEP24/BROOKS/KAREN/SAUNDERS',
			]),
			{
				[3]: {
					'lineNumber': 16,
					'data': {'lastName': 'BROOKS', 'firstName': 'KAREN', 'middleName': 'SAUNDERS'},
				},
			},
		]);

		// >*ZBGXPO; example of wheelchair and meal SSR-s without passenger name/number - LSML/
		// agent may not include name if there is just one passenger in PNR like this:
		// >@:3LSMLS1-4; >@:3WCHR/S1-4;
		list.push([
			php.implode(php.PHP_EOL, [
				'GFAX-SSROTHS1V AUTO XX IF SSR TKNA/E/M/C NOT RCVD BY KP BY',
				'   2 SSROTHS1V /// 1753/09DEC/LFW LT',
				'   3 SSROTHS1V PLS ADTK BY 13DEC17 1753 GMT OR SEATS WILL BE XLD',
				'   4 SSRDOCSETHK1/////25DEC48/M//MARFO/JOHN/K-1MARFO/JOHN K',
				'   5 SSRCTCEETHK1/GYAASEHENE//AOL.COM-1MARFO/JOHN K',
				'   6 SSRCTCMETHK1/19082301765-1MARFO/JOHN K',
				'   7 SSRWCHRETKK01 EWRLFW 0509G 19DEC-1MARFO/JOHN K ',
				'   8 SSRWCHRETKK01 LFWACC 1005G 20DEC-1MARFO/JOHN K ',
				'   9 SSRWCHRETKK01 ACCLFW 1006L 28JAN-1MARFO/JOHN K ',
				'  10 SSRWCHRETKK01 LFWEWR 0508L 28JAN-1MARFO/JOHN K ',
				'  11 SSRNLMLETKK01 EWRLFW 0509G 19DEC-1MARFO/JOHN K ',
				'  12 SSRNLMLETUN01 LFWACC 1005G 20DEC-1MARFO/JOHN K ',
				'  13 SSRNLMLETUN01 ACCLFW 1006L 28JAN-1MARFO/JOHN K ',
				'  14 SSRNLMLETKK01 LFWEWR 0508L 28JAN-1MARFO/JOHN K ',
				'  15 SSRTKNEETHK01 EWRLFW 0509G 19DEC-1MARFO/JOHN K.0717008671110C1',
				'  16 SSRTKNEETHK01 LFWACC 1005G 20DEC-1MARFO/JOHN K.0717008671110C2',
				'  17 SSRTKNEETHK01 ACCLFW 1006L 28JAN-1MARFO/JOHN K.0717008671110C3',
				'  18 SSRTKNEETHK01 LFWEWR 0508L 28JAN-1MARFO/JOHN K.0717008671110C4',
				'  19 SSRCTCEETHK1/GYAASEHENE//AOL.COM-1MARFO/JOHN K',
				'  20 SSRCTCMETHK1/19082301765-1MARFO/JOHN K',
				'  21 SSRLSMLETKK01 EWRLFW 0509G 19DEC  ',
				'  22 SSRLSMLETUN01 LFWACC 1005G 20DEC  ',
				'  23 SSRLSMLETUN01 ACCLFW 1006L 28JAN  ',
				'  24 SSRLSMLETKK01 LFWEWR 0508L 28JAN  ',
				'  25 SSRWCHRETNN01 EWRLFW 0509G 19DEC  ',
				'  26 SSRWCHRETNN01 LFWACC 1005G 20DEC  ',
				'  27 SSRWCHRETNN01 ACCLFW 1006L 28JAN  ',
				'  28 SSRWCHRETNN01 LFWEWR 0508L 28JAN  ',
			]),
			[
				{'lineNumber': 1, 'airline': '1V', 'ssrCode': 'OTHS'},
				{'lineNumber': 2, 'airline': '1V', 'ssrCode': 'OTHS'},
				{'lineNumber': 3, 'airline': '1V', 'ssrCode': 'OTHS'},
				{
					'lineNumber': 4, 'airline': 'ET', 'ssrCode': 'DOCS',
					'data': {}, 'pnrPaxName': 'MARFO/JOHN K',
				},
				{'lineNumber': 5, 'airline': 'ET', 'ssrCode': 'CTCE'},
				{'lineNumber': 6, 'airline': 'ET', 'ssrCode': 'CTCM'},
				{
					'lineNumber': 7, 'airline': 'ET', 'ssrCode': 'WCHR',
					'pnrPaxName': 'MARFO/JOHN K',
				},
				{
					'lineNumber': 8, 'airline': 'ET', 'ssrCode': 'WCHR',
					'pnrPaxName': 'MARFO/JOHN K',
				},
				{
					'lineNumber': 9, 'airline': 'ET', 'ssrCode': 'WCHR',
					'pnrPaxName': 'MARFO/JOHN K',
				},
				{
					'lineNumber': 10, 'airline': 'ET', 'ssrCode': 'WCHR',
					'pnrPaxName': 'MARFO/JOHN K',
				},
				{
					'lineNumber': 11, 'airline': 'ET', 'ssrCode': 'NLML',
					'pnrPaxName': 'MARFO/JOHN K',
				},
				{
					'lineNumber': 12, 'airline': 'ET', 'ssrCode': 'NLML',
					'pnrPaxName': 'MARFO/JOHN K',
				},
				{
					'lineNumber': 13, 'airline': 'ET', 'ssrCode': 'NLML',
					'pnrPaxName': 'MARFO/JOHN K',
				},
				{
					'lineNumber': 14, 'airline': 'ET', 'ssrCode': 'NLML',
					'data': {
						'status': 'KK',
						'statusNumber': '01',
						'departureAirport': 'LFW',
						'destinationAirport': 'EWR',
						'flightNumber': '0508',
						'bookingClass': 'L',
						'departureDate': {'raw': '28JAN', 'parsed': '01-28'},
						'paxIsInfant': false,
						'pnrPaxName': 'MARFO/JOHN K',
					},
				},
				{'lineNumber': 15, 'airline': 'ET', 'ssrCode': 'TKNE'},
				{'lineNumber': 16, 'airline': 'ET', 'ssrCode': 'TKNE'},
				{'lineNumber': 17, 'airline': 'ET', 'ssrCode': 'TKNE'},
				{'lineNumber': 18, 'airline': 'ET', 'ssrCode': 'TKNE'},
				{'lineNumber': 19, 'airline': 'ET', 'ssrCode': 'CTCE'},
				{'lineNumber': 20, 'airline': 'ET', 'ssrCode': 'CTCM'},
				{
					'lineNumber': 21, 'airline': 'ET', 'ssrCode': 'LSML',
					'data': {'departureAirport': 'EWR', 'destinationAirport': 'LFW'},
				},
				{
					'lineNumber': 22, 'airline': 'ET', 'ssrCode': 'LSML',
					'data': {'departureAirport': 'LFW', 'destinationAirport': 'ACC'},
				},
				{
					'lineNumber': 23, 'airline': 'ET', 'ssrCode': 'LSML',
					'data': {'departureAirport': 'ACC', 'destinationAirport': 'LFW'},
				},
				{
					'lineNumber': 24, 'airline': 'ET', 'ssrCode': 'LSML',
					'data': {'departureAirport': 'LFW', 'destinationAirport': 'EWR'},
				},
				{
					'lineNumber': 25, 'airline': 'ET', 'ssrCode': 'WCHR',
					'data': {'departureAirport': 'EWR', 'destinationAirport': 'LFW'},
				},
				{
					'lineNumber': 26, 'airline': 'ET', 'ssrCode': 'WCHR',
					'data': {'departureAirport': 'LFW', 'destinationAirport': 'ACC'},
				},
				{
					'lineNumber': 27, 'airline': 'ET', 'ssrCode': 'WCHR',
					'data': {'departureAirport': 'ACC', 'destinationAirport': 'LFW'},
				},
				{
					'lineNumber': 28, 'airline': 'ET', 'ssrCode': 'WCHR',
					'data': {
						'status': 'NN',
						'statusNumber': '01',
						'departureAirport': 'LFW',
						'destinationAirport': 'EWR',
						'flightNumber': '0508',
						'bookingClass': 'L',
						'departureDate': {'raw': '28JAN', 'parsed': '01-28'},
						'paxIsInfant': false,
						'comment': null,
					},
				},
			],
		]);

		// 'content' example, TO{airline} instead of status example
		list.push([
			php.implode(php.PHP_EOL, [
				'GFAX-SSRDOCSDLHK1/////13MAY79/M//KUHNELL/MICHAEL/ANDREW-1KUHNELL/MICHAEL ANDREW',
				'   2 SSRDOCSDLHK1/////01JAN13/F//KUHNELL/MERET/ELISABETH-1KUHNELL/MERET ELISABETH',
				'   3 SSRADTK1VTODL BY 03JUN 2359 SFO OTHERWISE MAY BE XLD',
				'   4 SSRADTK1VTODL BY 03JUN FARE MAY NEED EARLIER TKT DTE',
				'   5 SSRTKNEDLHK01 CMHDTW 6198V 21JUN-1KUHNELL/MICHA.0067190857125C1',
				'   6 SSRTKNEDLHK01 CMHDTW 6198V 21JUN-1KUHNELL/MERET.0067190857126C1',
				'   7 SSRTKNEDLHK01 DTWMUC 0022V 21JUN-1KUHNELL/MICHA.0067190857125C2',
				'   8 SSRTKNEDLHK01 DTWMUC 0022V 21JUN-1KUHNELL/MERET.0067190857126C2',
				'   9 SSRTKNEDLHK01 MUCDTW 0023V 06JUL-1KUHNELL/MICHA.0067190857125C3',
				'  10 SSRTKNEDLHK01 MUCDTW 0023V 06JUL-1KUHNELL/MERET.0067190857126C3',
				'  11 SSRTKNEDLHK01 DTWCMH 6184V 06JUL-1KUHNELL/MICHA.0067190857125C4',
				'  12 SSRTKNEDLHK01 DTWCMH 6184V 06JUL-1KUHNELL/MERET.0067190857126C4',
				'  13 SSRCTCEDLHK1/MIAMISCHU//GMAIL.COM-1KUHNELL/MICHAEL ANDREW',
				'  14 SSRCTCMDLHK1/14153749770-1KUHNELL/MICHAEL ANDREW',
				'  15 SSRCTCMDLHK1/3109226446-1KUHNELL/MERET ELISABETH',
			]),
			[
				{
					'lineNumber': 1,
					'airline': 'DL',
					'ssrCode': 'DOCS',
					'content': '/////13MAY79/M//KUHNELL/MICHAEL/ANDREW',
					'data': {
						'dob': {'raw': '13MAY79', 'parsed': '1979-05-13'},
						'gender': 'M',
						'lastName': 'KUHNELL',
						'firstName': 'MICHAEL',
						'middleName': 'ANDREW',
					},
					'pnrPaxName': 'KUHNELL/MICHAEL ANDREW',
				},
				{
					'lineNumber': 2,
					'airline': 'DL',
					'ssrCode': 'DOCS',
					'content': '/////01JAN13/F//KUHNELL/MERET/ELISABETH',
					'data': {
						'dob': {'raw': '01JAN13', 'parsed': '2013-01-01'},
						'gender': 'F',
						'lastName': 'KUHNELL',
						'firstName': 'MERET',
						'middleName': 'ELISABETH',
					},
					'pnrPaxName': 'KUHNELL/MERET ELISABETH',
				},
				{
					'lineNumber': 3,
					'airline': '1V',
					'ssrCode': 'ADTK',
					'content': 'BY 03JUN 2359 SFO OTHERWISE MAY BE XLD',
				},
				{
					'lineNumber': 4,
					'airline': '1V',
					'ssrCode': 'ADTK',
					'content': 'BY 03JUN FARE MAY NEED EARLIER TKT DTE',
				},
				{'lineNumber': 5, 'airline': 'DL', 'ssrCode': 'TKNE', 'content': ' CMHDTW 6198V 21JUN'},
				{'lineNumber': 6, 'airline': 'DL', 'ssrCode': 'TKNE', 'content': ' CMHDTW 6198V 21JUN'},
				{'lineNumber': 7, 'airline': 'DL', 'ssrCode': 'TKNE', 'content': ' DTWMUC 0022V 21JUN'},
				{'lineNumber': 8, 'airline': 'DL', 'ssrCode': 'TKNE', 'content': ' DTWMUC 0022V 21JUN'},
				{'lineNumber': 9, 'airline': 'DL', 'ssrCode': 'TKNE', 'content': ' MUCDTW 0023V 06JUL'},
				{'lineNumber': 10, 'airline': 'DL', 'ssrCode': 'TKNE', 'content': ' MUCDTW 0023V 06JUL'},
				{'lineNumber': 11, 'airline': 'DL', 'ssrCode': 'TKNE', 'content': ' DTWCMH 6184V 06JUL'},
				{'lineNumber': 12, 'airline': 'DL', 'ssrCode': 'TKNE', 'content': ' DTWCMH 6184V 06JUL'},
				{'lineNumber': 13, 'airline': 'DL', 'ssrCode': 'CTCE', 'content': '/MIAMISCHU//GMAIL.COM'},
				{'lineNumber': 14, 'airline': 'DL', 'ssrCode': 'CTCM', 'content': '/14153749770'},
				{'lineNumber': 15, 'airline': 'DL', 'ssrCode': 'CTCM', 'content': '/3109226446'},
			],
		]);

		// TKNE SSR example
		list.push([
			php.implode(php.PHP_EOL, [
				'GFAX-SSRADTK1VTOCI BY 16SEP 1638 PHX TIME ZONE OTHERWISE WILL BE XLD',
				'   2 SSRCTCECIHK1/SENVILLE2002//YAHOO.COM-1VILLANUEVAJR/SENEN LAGMAY',
				'   3 SSRCTCMCIHK1/13104047363-1VILLANUEVAJR/SENEN LAGMAY',
				'   4 SSRCTCMCIHK1/18182812173-1PASCUAL/AMELIA VILLANUEVA',
				'   5 SSRDOCSCIHK1/////20JUN70/M//VILLANUEVAJR/SENEN/LAGMAY-1VILLANUEVAJR/SENEN LAGMAY',
				'   6 SSRDOCSCIHK1/////03JUL63/F//PASCUAL/AMELIA/VILLANUEVA-1PASCUAL/AMELIA VILLANUEVA',
				'   7 SSRTKNECIHK01 LAXTPE 0007L 18SEP-1VILLANUEVAJR/.2977192902769C1',
				'   8 SSRTKNECIHK01 LAXTPE 0007L 18SEP-1PASCUAL/AMELI.2977192902770C1',
				'   9 SSRTKNECIHK01 TPEMNL 0701L 19SEP-1VILLANUEVAJR/.2977192902769C2',
				'  10 SSRTKNECIHK01 TPEMNL 0701L 19SEP-1PASCUAL/AMELI.2977192902770C2',
				'  11 SSRTKNECIHK01 MNLTPE 0704L 25SEP-1VILLANUEVAJR/.2977192902769C3',
				'  12 SSRTKNECIHK01 MNLTPE 0704L 25SEP-1PASCUAL/AMELI.2977192902770C3',
				'  13 SSRTKNECIHK01 TPELAX 0008L 25SEP-1VILLANUEVAJR/.2977192902769C4',
				'  14 SSRTKNECIHK01 TPELAX 0008L 25SEP-1PASCUAL/AMELI.2977192902770C4',
			]),
			[
				{
					'lineNumber': 1,
					'airline': '1V',
					'ssrCode': 'ADTK',
					'content': 'BY 16SEP 1638 PHX TIME ZONE OTHERWISE WILL BE XLD',
				},
				{'lineNumber': 2, 'airline': 'CI', 'ssrCode': 'CTCE', 'content': '/SENVILLE2002//YAHOO.COM'},
				{'lineNumber': 3, 'airline': 'CI', 'ssrCode': 'CTCM', 'content': '/13104047363'},
				{'lineNumber': 4, 'airline': 'CI', 'ssrCode': 'CTCM', 'content': '/18182812173'},
				{
					'lineNumber': 5,
					'airline': 'CI',
					'ssrCode': 'DOCS',
					'content': '/////20JUN70/M//VILLANUEVAJR/SENEN/LAGMAY',
				},
				{
					'lineNumber': 6,
					'airline': 'CI',
					'ssrCode': 'DOCS',
					'content': '/////03JUL63/F//PASCUAL/AMELIA/VILLANUEVA',
				},
				{
					'lineNumber': 7, 'airline': 'CI', 'ssrCode': 'TKNE', 'content': ' LAXTPE 0007L 18SEP', 'data': {
						'departureAirport': 'LAX',
						'destinationAirport': 'TPE',
						'flightNumber': '0007',
						'bookingClass': 'L',
						'departureDate': {'raw': '18SEP'},
						'ticketNumber': '2977192902769',
						'couponNumber': '1',
					},
					'pnrPaxName': 'VILLANUEVAJR/',
				},
				{
					'lineNumber': 8, 'airline': 'CI', 'ssrCode': 'TKNE', 'data': {
						'departureAirport': 'LAX',
						'destinationAirport': 'TPE',
						'flightNumber': '0007',
						'bookingClass': 'L',
						'departureDate': {'raw': '18SEP'},
						'ticketNumber': '2977192902770',
						'couponNumber': '1',
					},
					'pnrPaxName': 'PASCUAL/AMELI',
				},
				{
					'lineNumber': 9, 'airline': 'CI', 'ssrCode': 'TKNE', 'data': {
						'departureAirport': 'TPE',
						'destinationAirport': 'MNL',
						'flightNumber': '0701',
						'bookingClass': 'L',
						'departureDate': {'raw': '19SEP'},
						'ticketNumber': '2977192902769',
						'couponNumber': '2',
					},
					'pnrPaxName': 'VILLANUEVAJR/',
				},
				{
					'lineNumber': 10, 'airline': 'CI', 'ssrCode': 'TKNE', 'data': {
						'departureAirport': 'TPE',
						'destinationAirport': 'MNL',
						'flightNumber': '0701',
						'bookingClass': 'L',
						'departureDate': {'raw': '19SEP'},
						'ticketNumber': '2977192902770',
						'couponNumber': '2',
					},
					'pnrPaxName': 'PASCUAL/AMELI',
				},
				{
					'lineNumber': 11, 'airline': 'CI', 'ssrCode': 'TKNE', 'data': {
						'departureAirport': 'MNL',
						'destinationAirport': 'TPE',
						'flightNumber': '0704',
						'bookingClass': 'L',
						'departureDate': {'raw': '25SEP'},
						'ticketNumber': '2977192902769',
						'couponNumber': '3',
					},
					'pnrPaxName': 'VILLANUEVAJR/',
				},
				{
					'lineNumber': 12, 'airline': 'CI', 'ssrCode': 'TKNE', 'data': {
						'departureAirport': 'MNL',
						'destinationAirport': 'TPE',
						'flightNumber': '0704',
						'bookingClass': 'L',
						'departureDate': {'raw': '25SEP'},
						'ticketNumber': '2977192902770',
						'couponNumber': '3',
					},
					'pnrPaxName': 'PASCUAL/AMELI',
				},
				{
					'lineNumber': 13, 'airline': 'CI', 'ssrCode': 'TKNE', 'data': {
						'departureAirport': 'TPE',
						'destinationAirport': 'LAX',
						'flightNumber': '0008',
						'bookingClass': 'L',
						'departureDate': {'raw': '25SEP'},
						'ticketNumber': '2977192902769',
						'couponNumber': '4',
					},
					'pnrPaxName': 'VILLANUEVAJR/',
				},
				{
					'lineNumber': 14, 'airline': 'CI', 'ssrCode': 'TKNE', 'data': {
						'departureAirport': 'TPE',
						'destinationAirport': 'LAX',
						'flightNumber': '0008',
						'bookingClass': 'L',
						'departureDate': {'raw': '25SEP'},
						'ticketNumber': '2977192902770',
						'couponNumber': '4',
					},
					'pnrPaxName': 'PASCUAL/AMELI',
				},
			],
		]);

		return list;
	}

	/**
	 * @test
	 * @dataProvider provideTreeTestDumpList
	 */
	testParser(ssrBlockDump, expected) {
		const actual = SsrBlockParser.parse(ssrBlockDump);
		this.assertArrayElementsSubset(expected, actual);
	}

	getTestMapping() {
		return [
			[this.provideTreeTestDumpList, this.testParser],
		];
	}
}

module.exports = SsrBlockParserTest;
