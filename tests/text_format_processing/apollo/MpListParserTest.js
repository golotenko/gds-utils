
const ApolloMileageProgramParser = require('../../../src/text_format_processing/apollo/MpListParser.js');

const php = require('enko-fundamentals/src/Transpiled/php.js');
class MpListParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js')
{
	provideTestDumpList()  {
		const list = [];

		list.push([
			' NO FREQ FLYER DATA',
			[
			],
		]);

		list.push([
			php.implode(php.PHP_EOL, [
				'FREQUENT FLYER DATA:',
				'',
				'01. KYI      K SQ     8793170086*                              ',
			]),
			[
				{
					'passengerNumber': '01','passengerName': 'KYI      K',
					'mileagePrograms': [{'airline': 'SQ','code': '8793170086'}],
				},
			],
		]);

		// ZR2CPU
		list.push([
			php.implode(php.PHP_EOL, [
				'FREQUENT FLYER DATA:',
				'',
				'01. KIANI    S UA       NS171261*                              ',
				'02. KHAN     M UA       NS171261*                              ',
				'03. KHAN     E UA       BY824242*                              ',
				'04. KHAN     Z UA       VL430402*                              ',
			]),
			[
				{
					'passengerNumber': '01','passengerName': 'KIANI    S',
					'mileagePrograms': [{'airline': 'UA','code': 'NS171261'}],
				},
				{
					'passengerNumber': '02','passengerName': 'KHAN     M',
					'mileagePrograms': [{'airline': 'UA','code': 'NS171261'}],
				},
				{
					'passengerNumber': '03','passengerName': 'KHAN     E',
					'mileagePrograms': [{'airline': 'UA','code': 'BY824242'}],
				},
				{
					'passengerNumber': '04','passengerName': 'KHAN     Z',
					'mileagePrograms': [{'airline': 'UA','code': 'VL430402'}],
				},
			],
		]);

		// NGJNT5
		list.push([
			php.implode(php.PHP_EOL, [
				'FREQUENT FLYER DATA:',
				'',
				'01. NEDZA    E DL     2380160040*                              ',
				'               KL     2105653453** -I 0                        ',
				'02. NEDZA    D DL     2380160248*                              ',
				'03. NEDZA    F DL     2380160370*                              ',
				'               KL     2109163205** -I 0                        ',
			]),
			[
				{
					'passengerNumber': '01','passengerName': 'NEDZA    E',
					'mileagePrograms': [
						{'airline': 'DL','code': '2380160040'},
						{'airline': 'KL','code': '2105653453'},
					],
				},
				{
					'passengerNumber': '02','passengerName': 'NEDZA    D',
					'mileagePrograms': [{'airline': 'DL','code': '2380160248'}],
				},
				{
					'passengerNumber': '03','passengerName': 'NEDZA    F',
					'mileagePrograms': [
						{'airline': 'DL','code': '2380160370'},
						{'airline': 'KL','code': '2109163205'},
					],
				},
			],
		]);

		// JG55SW
		list.push([
			php.implode(php.PHP_EOL, [
				'FREQUENT FLYER DATA:',
				'',
				'01. BUENAVEN|C CX     1062203188*                              ',
			]),
			[
				{
					'passengerNumber': '01','passengerName': 'BUENAVEN|C',
					'mileagePrograms': [{'airline': 'CX','code': '1062203188'}],
				},
			],
		]);

		// J39DMG
		list.push([
			php.implode(php.PHP_EOL, [
				'FREQUENT FLYER DATA:',
				'',
				'01. RAIGRODS|A UA       CW042158*                    USE FOR OA',
			]),
			[
				{
					'passengerNumber': '01','passengerName': 'RAIGRODS|A',
					'mileagePrograms': [{'airline': 'UA','code': 'CW042158'}],
				},
			],
		]);

		// SPMJGI
		list.push([
			php.implode(php.PHP_EOL, [
				'FREQUENT FLYER DATA:',
				'',
				'01. LEBARON  L AS       77639844*                              ',
				'02. CRADDOCK|R UA       JMV94139*                              ',
				'               DL     9363469447*                              ',
			]),
			[
				{
					'passengerNumber': '01','passengerName': 'LEBARON  L',
					'mileagePrograms': [{'airline': 'AS','code': '77639844'}],
				},
				{
					'passengerNumber': '02','passengerName': 'CRADDOCK|R',
					'mileagePrograms': [
						{'airline': 'UA','code': 'JMV94139'},
						{'airline': 'DL','code': '9363469447'},
					],
				},
			],
		]);

		// KBR4GG
		list.push([
			php.implode(php.PHP_EOL, [
				'FREQUENT FLYER DATA:',
				'',
				'01. OSMAN    D AF     8950097504** -P 4              USE FOR OA',
			]),
			[
				{
					'passengerNumber': '01','passengerName': 'OSMAN    D',
					'mileagePrograms': [{'airline': 'AF','code': '8950097504'}],
				},
			],
		]);

		// JQMLCA
		list.push([
			php.implode(php.PHP_EOL, [
				'FREQUENT FLYER DATA:',
				'',
				'01. DJITRINO|V AF     1383180550** -S 3                        ',
			]),
			[
				{
					'passengerNumber': '01','passengerName': 'DJITRINO|V',
					'mileagePrograms': [{'airline': 'AF','code': '1383180550'}],
				},
			],
		]);

		// L5QTT6
		list.push([
			php.implode(php.PHP_EOL, [
				'FREQUENT FLYER DATA:',
				'',
				'01. KOUASSIK|E LH    992225349814577** -S 2                    ',
			]),
			[
				{
					'passengerNumber': '01','passengerName': 'KOUASSIK|E',
					'mileagePrograms': [{'airline': 'LH','code': '992225349814577'}],
				},
			],
		]);

		return list;
	}

	/**
	 * @test
	 * @dataProvider provideTestDumpList
	 */
	testParserOutput(mpDump, expectedResult)  {
		const actualResult = ApolloMileageProgramParser.parse(mpDump).passengers;
		this.assertArrayElementsSubset(expectedResult, actualResult);
	}

	getTestMapping() {
		return [
			[this.provideTestDumpList, this.testParserOutput],
		];
	}
}

module.exports = MpListParserTest;
