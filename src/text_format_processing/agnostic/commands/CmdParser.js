
const CmdParser_apollo = require('../../apollo/commands/CmdParser.js');
const CmdParser_sabre = require('../../sabre/commands/CmdParser.js');
const CmdParser_galileo = require('../../galileo/commands/CmdParser.js');
const CmdParser_amadeus = require('../../amadeus/commands/CmdParser.js');

exports.parse = (cmd, gds) => {
	return {
		apollo: CmdParser_apollo,
		sabre: CmdParser_sabre,
		galileo: CmdParser_galileo,
		amadeus: CmdParser_amadeus,
	}[gds].parse(cmd);
};
