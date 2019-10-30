
require('./polyfills');

const RunTests = require('enko-fundamentals/src/Transpiled/RunTests.js');
const {timeout} = require('enko-fundamentals/src/Lang.js');

const main = async () => {
	console.log('Starting gds-utils unit tests');

	return RunTests({
		rootPath: __dirname + '/../tests/',
	});
};

timeout(120, main()).finally(exc => {
	console.error('Tests script timed out', exc);
	process.exit(124);
});
