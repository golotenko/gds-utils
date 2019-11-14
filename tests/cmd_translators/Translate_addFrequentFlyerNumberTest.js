const Translate_addFrequentFlyerNumber = require('../../src/cmd_translators/Translate_addFrequentFlyerNumber.js');
const CmdParser = require('../../src/text_format_processing/agnostic/commands/CmdParser.js');

const provide_call = () => {
	const testCases = [];

	testCases.push({input: {fromGds: 'apollo'  , toGds: 'galileo' , cmd: 'MP*UA12345678910'          }, output: 'M.UA12345678910'            , bidirectional: true, title: 'MP*{al}{ffNumber} -> M.{al}{ffNumber}'});
	testCases.push({input: {fromGds: 'galileo' , toGds: 'apollo'  , cmd: 'M.UA12345678910/LH'        }, output: 'MP*@LH12345678910'          , bidirectional: false, title: '// MP*¤{alFF}{ffNumber} -> M.{al}{ffNumber}/{alFF}'});
	testCases.push({input: {fromGds: 'apollo'  , toGds: 'galileo' , cmd: 'MPN1*UA12345678910'        }, output: 'M.P1/UA12345678910'         , bidirectional: true, title: 'MPN{paxNum}*{al}{ffNumber} -> M.P{paxNum}/{al}{ffNumber}'});
	testCases.push({input: {fromGds: 'galileo' , toGds: 'apollo'  , cmd: 'M.P1/UA12345678910/LH'     }, output: 'MPN1*@LH12345678910'        , bidirectional: false, title: 'MPN{paxNum}*¤{alFF}{ffNumber} -> M.P{paxNum}/{al}{ffNumber}/{alFF}'});
	testCases.push({input: {fromGds: 'sabre'   , toGds: 'amadeus' , cmd: 'FFUA12345678910-1.1'       }, output: 'FFNUA-12345678910/P1'       , bidirectional: false});
	testCases.push({input: {fromGds: 'sabre'   , toGds: 'amadeus' , cmd: 'FFUA12345678910/LH'        }, output: 'FFNUA-12345678910,UA,LH'    , bidirectional: false});
	testCases.push({input: {fromGds: 'sabre'   , toGds: 'amadeus' , cmd: 'FFUA12345678910-1.1'       }, output: 'FFNUA-12345678910/P1'       , bidirectional: false});
	testCases.push({input: {fromGds: 'sabre'   , toGds: 'amadeus' , cmd: 'FFUA12345678910/LH-1.1'    }, output: 'FFNUA-12345678910,UA,LH/P1' , bidirectional: false});
	testCases.push({input: {fromGds: 'apollo'  , toGds: 'amadeus' , cmd: 'MP*UA12345678910'          }, output: 'FFNUA-12345678910'          , bidirectional: false});
	testCases.push({input: {fromGds: 'apollo'  , toGds: 'amadeus' , cmd: 'MP*\u00A4LH12345678910'    }, output: 'FFNLH-12345678910'          , bidirectional: false});
	testCases.push({input: {fromGds: 'apollo'  , toGds: 'amadeus' , cmd: 'MPN1*UA12345678910'        }, output: 'FFNUA-12345678910/P1'       , bidirectional: false});
	testCases.push({input: {fromGds: 'apollo'  , toGds: 'amadeus' , cmd: 'MPN1*\u00A4LH12345678910'  }, output: 'FFNLH-12345678910/P1'       , bidirectional: false});
	testCases.push({input: {fromGds: 'sabre'   , toGds: 'galileo' , cmd: 'FFUA12345678910'           }, output: 'M.UA12345678910'            , bidirectional: true, title: 'FF{al}{ffNumber} -> M.{al}{ffNumber}'});
	testCases.push({input: {fromGds: 'sabre'   , toGds: 'galileo' , cmd: 'FFUA12345678910/LH'        }, output: 'M.UA12345678910/LH'         , bidirectional: true, title: 'FF{al}{ffNumber}/{alFF} -> M.{al}{ffNumber}/{alFF}'});
	testCases.push({input: {fromGds: 'sabre'   , toGds: 'galileo' , cmd: 'FFUA12345678910-1.1'       }, output: 'M.P1/UA12345678910'         , bidirectional: true, title: 'FF{al}{ffNumber}-{paxNum} -> M.P{paxNum}/{al}{ffNumber}'});
	testCases.push({input: {fromGds: 'sabre'   , toGds: 'galileo' , cmd: 'FFUA12345678910/LH-1.1'    }, output: 'M.P1/UA12345678910/LH'      , bidirectional: true, title: 'FF{al}{ffNumber}/{alFF}-{paxNum} -> M.P{paxNum}/{al}{ffNumber}/{alFF}'});
	testCases.push({input: {fromGds: 'amadeus' , toGds: 'galileo' , cmd: 'FFNUA-12345678910'         }, output: 'M.UA12345678910'            , bidirectional: true, title: 'FFN{al}-{ffNumber} -> M.{al}{ffNumber}'});
	testCases.push({input: {fromGds: 'amadeus' , toGds: 'galileo' , cmd: 'FFNUA-12345678910,UA,LH'   }, output: 'M.UA12345678910/LH'         , bidirectional: true, title: 'FFN{al}-{ffNumber},{al},{alFF} -> M.{al}{ffNumber}/{alFF}'});
	testCases.push({input: {fromGds: 'amadeus' , toGds: 'galileo' , cmd: 'FFNUA-12345678910/P1'      }, output: 'M.P1/UA12345678910'         , bidirectional: true, title: 'FFN{al}-{ffNumber}/P{paxNum} -> M.P{paxNum}/{al}{ffNumber}'});
	testCases.push({input: {fromGds: 'amadeus' , toGds: 'galileo' , cmd: 'FFNUA-12345678910,UA,LH/P1'}, output: 'M.P1/UA12345678910/LH'      , bidirectional: true, title: 'FFN{alff}-{ffNumber},{al}/P{paxNum} -> M.P{paxNum}/{al}{ffNumber}/{alFF}'});

	return testCases.map(t => [t]);
};

/** for completion */
const provide_call_item = () => {
	return provide_call()[Math.random()];
};

class Translate_addFrequentFlyerNumberTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js')
{
	/** @param testCase = provide_call_item() */
	test_call(testCase) {
		const {input, output, bidirectional} = testCase;
		const {fromGds, toGds, cmd} = input;
		const subCases = [{input, output}];
		if (bidirectional) {
			subCases.push({input: {fromGds: toGds, toGds: fromGds, cmd: output}, output: cmd});
		}
		for (const subCase of subCases) {
			const {input, output} = subCase;
			const {fromGds, toGds, cmd} = input;
			const parsed = CmdParser.parse(cmd, fromGds);
			const {data, type} = parsed;
			if (!data || type !== 'addFrequentFlyerNumber') {
				throw new Error('Failed to parse addFrequentFlyerNumber cmd >' + cmd + '; - ' + type);
			}
			const actual = Translate_addFrequentFlyerNumber({data, fromGds, toGds});
			this.assertEquals(output, actual, 'Input cmd >' + cmd + ';');
		}
	}

	getTestMapping() {
		return [
			[provide_call, this.test_call],
		];
	}
}

module.exports = Translate_addFrequentFlyerNumberTest;
