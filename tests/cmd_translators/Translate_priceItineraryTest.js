const Translate_priceItinerary = require('../../src/cmd_translators/Translate_priceItinerary.js');

const CmdParser = require('../../src/text_format_processing/agnostic/commands/CmdParser.js');

/** $BBCUA -> $BB/CUA */
const normCmd = (gds, cmd) => {
	if (!cmd) {
		return cmd;
	}
	if (['galileo', 'apollo'.includes(gds)]) {
		cmd = cmd.replace(/\+/g, '|');
		cmd = cmd.replace(/¤/g, '@');
	}
	if (gds === 'apollo') {
		let match = cmd.match(/^((?:T:)?\$B(?:BQ\d+|B[AC0]?)?)(.*)$/);
		if (match) {
			let [_, baseCmd, modsPart] = match;
			if (modsPart && !modsPart.startsWith('/')) {
				cmd = baseCmd + '/' + modsPart;
			}
		}
	} else if (gds === 'galileo') {
		let match = cmd.match(/^(FQ(?:A|BB(?:K|)|BA|))(.*)$/);
		if (match) {
			let [_, baseCmd, modsPart] = match;
			if (modsPart && !modsPart.startsWith('/')) {
				cmd = baseCmd + '/' + modsPart;
			}
		}
	}
	return cmd;
};

const provide_call = () => {
	const argTuples = [
		['apollo',  'sabre',   '$B@VKXT5U0',    'WPQVKXT5U0'],
		['apollo',  'amadeus', '$B@VKXT5U0',    'FXX/L-VKXT5U0'],
		['sabre',   'apollo',  'WPQVKXT5U0',    '$B@VKXT5U0'],
		['sabre',   'amadeus', 'WPQVKXT5U0',    'FXX/L-VKXT5U0'],
		['amadeus', 'apollo',  'FXX/L-VKXT5U0', '$B@VKXT5U0'],
		['amadeus', 'sabre',   'FXX/L-VKXT5U0', 'WPQVKXT5U0'],

		['apollo',  'sabre',   '$BB//@F',  'WPNC¥TC-FB'],
		['apollo',  'amadeus', '$BB//@F',  'FXA/KF'],
		['sabre',   'apollo',  'WPNC¥TC-FB',   '$BB//@F'],
		['sabre',   'amadeus', 'WPNC¥TC-FB',   'FXA/KF'],
		['amadeus', 'apollo',  'FXA/KF', '$BB//@F'],
		['amadeus', 'sabre',   'FXA/KF', 'WPNC¥TC-FB'],

		['apollo', 'sabre', '$BS1+2',                'WPS1/2'],
		['apollo', 'sabre', '$BS1*3+5*7',            'WPS1-3/5-7'],
		['apollo', 'sabre', '$BBS1+2',               'WPNC¥S1/2'],
		['apollo', 'sabre', '$B/ACC',                'WPPC05'],
		['apollo', 'sabre', '$BN1+2*C05',            'WPP1ADT/1C05'],
		['apollo', 'sabre', '$BN1+2*C05+3*INF',      'WPP1ADT/1C05/1INF'],
		['apollo', 'sabre', '$BN1+2+3*C05+4*INF',    'WPP2ADT/1C05/1INF'],
		['apollo', 'sabre', '$BN1*JCB+2*J05',        'WPP1JCB/1J05'],
		['apollo', 'sabre', '$BN1*JCB+2*JNS',        'WPP1JCB/1JNS'],
		['apollo', 'sabre', '$BN1*ITX+2*I06',        'WPP1ITX/1I06'],
		['apollo', 'sabre', '$BB*JCB',               'WPNC¥PJCB'],
		['apollo', 'sabre', '$BB*ITX',               'WPNC¥PITX'],
		['apollo', 'sabre', '$BB0*JCB',              'WPNCB¥PJCB'],
		['apollo', 'sabre', '$BB0*ITX',              'WPNCB¥PITX'],
		['apollo', 'sabre', '$BBN1*JCB+2*J05',       'WPNC¥P1JCB/1J05'],
		['apollo', 'sabre', '$BBN1*JCB+2*JNS',       'WPNC¥P1JCB/1JNS'],
		['apollo', 'sabre', '$BB0N1*JCB+2*J05',      'WPNCB¥P1JCB/1J05'],
		['apollo', 'sabre', '$BB0N1*JCB+2*JNS',      'WPNCB¥P1JCB/1JNS'],

		['apollo', 'sabre', '$BB0S1+4',              'WPNCB¥S1/4'],
		['apollo', 'sabre', '$BBAS1+4',              'WPNCS¥S1/4'],
		['apollo', 'sabre', '$BB0S1*2+3*4',          'WPNCB¥S1-4'],
		['apollo', 'sabre', '$BBAS1*2+3*4',          'WPNCS¥S1-4'],
		['apollo', 'sabre', '$BB/ACC',               'WPNC¥PC05'],
		['apollo', 'sabre', '$BB0/ACC',              'WPNCB¥PC05'],
		['apollo', 'sabre', '$BBA/ACC',              'WPNCS¥PC05'],

		['apollo', 'sabre', '$BBAN1+2*C05',          'WPNCS¥P1ADT/1C05'],
		['apollo', 'sabre', '$BBAN1+2*C05+3*INF',    'WPNCS¥P1ADT/1C05/1INF'],
		['apollo', 'sabre', '$BBAN1+2+3*C05+4*INF',  'WPNCS¥P2ADT/1C05/1INF'],
		['apollo', 'sabre', '$BBA*JCB',              'WPNCS¥PJCB'],
		['apollo', 'sabre', '$BBA*ITX',              'WPNCS¥PITX'],

		['sabre', 'apollo', 'WPP1ADT/1C05¥S1/2/5/6', '$BN1*ADT|2*C05/S1|2|5|6'],
		['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥S1/2/5/6', '$BN1*ADT|2*C05|3*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥S1/2/5/6', '$BN1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNC¥P1ADT/1C05¥S1/2/5/6', '$BBN1*ADT|2*C05/S1|2|5|6'],
		['sabre', 'apollo', 'WPNC¥P1ADT/1C05/1INF¥S1/2/5/6', '$BBN1*ADT|2*C05|3*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNC¥P2ADT/1C05/1INF¥S1/2/5/6', '$BBN1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCB¥P1ADT/1C05¥S1/2/5/6', '$BB0N1*ADT|2*C05/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCB¥P1ADT/1C05/1INF¥S1/2/5/6', '$BB0N1*ADT|2*C05|3*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCB¥P2ADT/1C05/1INF¥S1/2/5/6', '$BB0N1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCS¥P1ADT/1C05¥S1/2/5/6', '$BBAN1*ADT|2*C05/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCS¥P1ADT/1C05/1INF¥S1/2/5/6', '$BBAN1*ADT|2*C05|3*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCS¥P2ADT/1C05/1INF¥S1/2/5/6', '$BBAN1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPP1ADT/1C05¥S1/2/5/6', '$BN1*ADT|2*C05/S1|2|5|6'],
		['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥S1/2/5/6', '$BN1*ADT|2*C05|3*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥S1/2/5/6', '$BN1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNC¥P1ADT/1C05¥S1/2/5/6', '$BBN1*ADT|2*C05/S1|2|5|6'],
		['sabre', 'apollo', 'WPNC¥P1ADT/1C05/1INF¥S1/2/5/6', '$BBN1*ADT|2*C05|3*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNC¥P2ADT/1C05/1INF¥S1/2/5/6', '$BBN1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCB¥P1ADT/1C05¥S1/2/5/6', '$BB0N1*ADT|2*C05/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCB¥P1ADT/1C05/1INF¥S1/2/5/6', '$BB0N1*ADT|2*C05|3*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCB¥P2ADT/1C05/1INF¥S1/2/5/6', '$BB0N1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCS¥P1ADT/1C05¥S1/2/5/6', '$BBAN1*ADT|2*C05/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCS¥P1ADT/1C05/1INF¥S1/2/5/6', '$BBAN1*ADT|2*C05|3*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCS¥P2ADT/1C05/1INF¥S1/2/5/6', '$BBAN1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
		['sabre', 'apollo', 'WPP1JCB/1JNS¥S1/2/5/6', '$BN1*JCB|2*JNS/S1|2|5|6'],
		['sabre', 'apollo', 'WPP1JCB/1JNS/1JNF¥S1/2/5/6', '$BN1*JCB|2*JNS|3*JNF/S1|2|5|6'],
		['sabre', 'apollo', 'WPP2JCB/1JNS/1JNF¥S1/2/5/6', '$BN1*JCB|2*JCB|3*JNS|4*JNF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNC¥P1JCB/1JNS¥S1/2/5/6', '$BBN1*JCB|2*JNS/S1|2|5|6'],
		['sabre', 'apollo', 'WPNC¥P1JCB/1JNS/1JNF¥S1/2/5/6', '$BBN1*JCB|2*JNS|3*JNF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNC¥P2JCB/1JNS/1JNF¥S1/2/5/6', '$BBN1*JCB|2*JCB|3*JNS|4*JNF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCB¥P1JCB/1JNS¥S1/2/5/6', '$BB0N1*JCB|2*JNS/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCB¥P1JCB/1JNS/1JNF¥S1/2/5/6', '$BB0N1*JCB|2*JNS|3*JNF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCB¥P2JCB/1JNS/1JNF¥S1/2/5/6', '$BB0N1*JCB|2*JCB|3*JNS|4*JNF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCS¥P1JCB/1JNS¥S1/2/5/6', '$BBAN1*JCB|2*JNS/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCS¥P1JCB/1JNS/1JNF¥S1/2/5/6', '$BBAN1*JCB|2*JNS|3*JNF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCS¥P2JCB/1JNS/1JNF¥S1/2/5/6', '$BBAN1*JCB|2*JCB|3*JNS|4*JNF/S1|2|5|6'],
		['apollo', 'sabre', '$BS1*2+5*6/N1*JCB+2*JNS', 'WPS1/2/5/6¥P1JCB/1JNS'],
		['apollo', 'sabre', '$BS1*2+5*6/N1*JCB+2*JNS+3*JNF', 'WPS1/2/5/6¥P1JCB/1JNS/1JNF'],
		['apollo', 'sabre', '$BS1*2+5*6/N1*JCB+2*JCB+3*JNS+4*JNF', 'WPS1/2/5/6¥P2JCB/1JNS/1JNF'],
		['apollo', 'sabre', '$BBS1*2+5*6/N1*JCB+2*JNS', 'WPNC¥S1/2/5/6¥P1JCB/1JNS'],
		['apollo', 'sabre', '$BBS1*2+5*6/N1*JCB+2*JNS+3*JNF', 'WPNC¥S1/2/5/6¥P1JCB/1JNS/1JNF'],
		['apollo', 'sabre', '$BBS1*2+5*6/N1*JCB+2*JCB+3*JNS+4*JNF', 'WPNC¥S1/2/5/6¥P2JCB/1JNS/1JNF'],
		['apollo', 'sabre', '$BB0S1*2+5*6/N1*JCB+2*JNS', 'WPNCB¥S1/2/5/6¥P1JCB/1JNS'],
		['apollo', 'sabre', '$BB0S1*2+5*6/N1*JCB+2*JNS+3*JNF', 'WPNCB¥S1/2/5/6¥P1JCB/1JNS/1JNF'],
		['apollo', 'sabre', '$BB0S1*2+5*6/N1*JCB+2*JCB+3*JNS+4*JNF', 'WPNCB¥S1/2/5/6¥P2JCB/1JNS/1JNF'],
		['apollo', 'sabre', '$BBAS1*2+5*6/N1*JCB+2*JCB', 'WPNCS¥S1/2/5/6¥P2JCB'],
		['apollo', 'sabre', '$BBAS1*2+5*6/N1*JCB+2*JNS+3*JNF', 'WPNCS¥S1/2/5/6¥P1JCB/1JNS/1JNF'],
		['apollo', 'sabre', '$BBAS1*2+5*6/N1*JCB+2*JCB+3*JNS+4*JNF', 'WPNCS¥S1/2/5/6¥P2JCB/1JNS/1JNF'],
		['sabre', 'apollo', 'WPP1ITX/1INN¥S1/2/5/6', '$BN1*ITX|2*INN/S1|2|5|6'],
		['sabre', 'apollo', 'WPP1ITX/1INN/1ITF¥S1/2/5/6', '$BN1*ITX|2*INN|3*ITF/S1|2|5|6'],
		['sabre', 'apollo', 'WPP2ITX/1INN/1ITF¥S1/2/5/6', '$BN1*ITX|2*ITX|3*INN|4*ITF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNC¥P1ITX/1INN¥S1/2/5/6', '$BBN1*ITX|2*INN/S1|2|5|6'],
		['sabre', 'apollo', 'WPNC¥P1ITX/1INN/1ITF¥S1/2/5/6', '$BBN1*ITX|2*INN|3*ITF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNC¥P2ITX/1INN/1ITF¥S1/2/5/6', '$BBN1*ITX|2*ITX|3*INN|4*ITF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCB¥P1ITX/1INN¥S1/2/5/6', '$BB0N1*ITX|2*INN/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCB¥P1ITX/1INN/1ITF¥S1/2/5/6', '$BB0N1*ITX|2*INN|3*ITF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCB¥P2ITX/1INN/1ITF¥S1/2/5/6', '$BB0N1*ITX|2*ITX|3*INN|4*ITF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCS¥P1ITX/1INN¥S1/2/5/6', '$BBAN1*ITX|2*INN/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCS¥P1ITX/1INN/1ITF¥S1/2/5/6', '$BBAN1*ITX|2*INN|3*ITF/S1|2|5|6'],
		['sabre', 'apollo', 'WPNCS¥P2ITX/1INN/1ITF¥S1/2/5/6', '$BBAN1*ITX|2*ITX|3*INN|4*ITF/S1|2|5|6'],
		['apollo', 'sabre', '$BS1*2+5*6/N1*ITX+2*INN', 'WPS1/2/5/6¥P1ITX/1INN'],
		['apollo', 'sabre', '$BS1*2+5*6/N1*ITX+2*INN+3*ITF', 'WPS1/2/5/6¥P1ITX/1INN/1ITF'],
		['apollo', 'sabre', '$BS1*2+5*6/N1*ITX+2*ITX+3*INN+4*ITF', 'WPS1/2/5/6¥P2ITX/1INN/1ITF'],
		['apollo', 'sabre', '$BBS1*2+5*6/N1*ITX+2*INN', 'WPNC¥S1/2/5/6¥P1ITX/1INN'],
		['apollo', 'sabre', '$BBS1*2+5*6/N1*ITX+2*INN+3*ITF', 'WPNC¥S1/2/5/6¥P1ITX/1INN/1ITF'],
		['apollo', 'sabre', '$BBS1*2+5*6/N1*ITX+2*ITX+3*INN+4*ITF', 'WPNC¥S1/2/5/6¥P2ITX/1INN/1ITF'],
		['apollo', 'sabre', '$BB0S1*2+5*6/N1*ITX+2*INN', 'WPNCB¥S1/2/5/6¥P1ITX/1INN'],
		['apollo', 'sabre', '$BB0S1*2+5*6/N1*ITX+2*INN+3*ITF', 'WPNCB¥S1/2/5/6¥P1ITX/1INN/1ITF'],
		['apollo', 'sabre', '$BB0S1*2+5*6/N1*ITX+2*ITX+3*INN+4*ITF', 'WPNCB¥S1/2/5/6¥P2ITX/1INN/1ITF'],
		['apollo', 'sabre', '$BBAS1*2+5*6/N1*ITX+2*INN', 'WPNCS¥S1/2/5/6¥P1ITX/1INN'],
		['apollo', 'sabre', '$BBAS1*2+5*6/N1*ITX+2*INN+3*ITF', 'WPNCS¥S1/2/5/6¥P1ITX/1INN/1ITF'],
		['apollo', 'sabre', '$BBAS1*2+5*6/N1*ITX+2*ITX+3*INN+4*ITF', 'WPNCS¥S1/2/5/6¥P2ITX/1INN/1ITF'],

		['sabre', 'apollo', 'WPNC', '$BB'],
		['sabre', 'apollo', 'WPNCS', '$BBA'],
		['sabre', 'apollo', 'WPPCNN', '$B*CNN/ACC'],
		['sabre', 'apollo', 'WPPCNN¥NC', '$BB*CNN/ACC'],
		['sabre', 'apollo', 'WPPCNN¥NCB', '$BB0*CNN/ACC'],
		['sabre', 'apollo', 'WPPCNN¥NCS', '$BBA*CNN/ACC'],
		['sabre', 'apollo', 'WPP1JCB/1JNS/1JNF', '$BN1*JCB|2*JNS|3*JNF'],

		['sabre', 'apollo', 'WPPJCB¥RQ', 'T:$B*JCB'],
		['sabre', 'apollo', 'WPP1ADT/1CNN¥RQ', 'T:$BN1*ADT|2*CNN'],
		['sabre', 'apollo', 'WPP1ADT/1CNN/1INF¥RQ', 'T:$BN1*ADT|2*CNN|3*INF'],
		['sabre', 'apollo', 'WPPITX¥RQ', 'T:$B*ITX'],
		['sabre', 'apollo', 'WPP1ITX/1INN/1ITF¥RQ', 'T:$BN1*ITX|2*INN|3*ITF'],

		['apollo', 'sabre', '$BBA//@Y',                      'WPNCS¥TC-YB'],
		['apollo', 'sabre', '$BBN1|2*C05|3*INF//@Y',         'WPNC¥P1ADT/1C05/1INF¥TC-YB'],
		['apollo', 'sabre', '$BBN1*JCB|2*J05|3*JNF//@Y',     'WPNC¥P1JCB/1J05/1JNF¥TC-YB'],
		['apollo', 'sabre', '$BBN1*ITX|2*I05|3*ITF//@Y',     'WPNC¥P1ITX/1I05/1ITF¥TC-YB'],
		['apollo', 'sabre', '$BBA//@W',                      'WPNCS¥TC-SB'],
		['apollo', 'sabre', '$BBA//@C',                      'WPNCS¥TC-BB'],
		['apollo', 'sabre', '$BBA//@F',                      'WPNCS¥TC-FB'],
		['apollo', 'sabre', '$BBA//@AB',                     'WPNCS'],
		['apollo', 'sabre', '$B/ACC',                        'WPPC05'],
		['apollo', 'sabre', '$BB/ACC',                       'WPNC¥PC05'],
		['apollo', 'sabre', '$BBAS1|2|5|6',                  'WPNCS¥S1/2/5/6'],
		['apollo', 'sabre', '$BBAS1*3|5|6',                  'WPNCS¥S1-3/5/6'],
		['apollo', 'sabre', '$BBA*JCB',                      'WPNCS¥PJCB'],
		['apollo', 'sabre', '$BBA*ITX',                      'WPNCS¥PITX'],
		['apollo', 'sabre', '$BBAN1*ITX|2*I05',              'WPNCS¥P1ITX/1I05'],
		['apollo', 'sabre', '$BBAN1*ITX|2*I06|3*ITF',        'WPNCS¥P1ITX/1I06/1ITF'],

		['apollo', 'sabre', '$BBA//@Y',     'WPNCS¥TC-YB'],
		['apollo', 'sabre', '$BBA//@W',     'WPNCS¥TC-SB'],
		['apollo', 'sabre', '$BBA//@C',     'WPNCS¥TC-BB'],
		['apollo', 'sabre', '$BBA//@F',     'WPNCS¥TC-FB'],
		['apollo', 'sabre', '$BBA//@AB',    'WPNCS'],
		['apollo', 'sabre', '$BBN1|2*C05|3*INF//@Y',        'WPNC¥P1ADT/1C05/1INF¥TC-YB'],
		['apollo', 'sabre', '$BBN1|2*C05|3*INF//@Y',        'WPNC¥P1ADT/1C05/1INF¥TC-YB'],
		['apollo', 'sabre', '$BBN1*JCB|2*J05|3*JNF//@Y',    'WPNC¥P1JCB/1J05/1JNF¥TC-YB'],
		['apollo', 'sabre', '$B:N',                         'WPPL'],
		['apollo', 'sabre', '$B:A',                         'WPPV'],

		['sabre', 'apollo', 'WPRQ¥PL¥KP5', 'T:$B:N/Z5'],
		['sabre', 'apollo', 'WPPC05¥NC', '$BB*C05/ACC'],
		['apollo', 'sabre', '$BB0/ACC', 'WPNCB¥PC05'],
		['apollo', 'sabre', '$BBA/ACC', 'WPNCS¥PC05'],

		['apollo', 'sabre', '$BBS1', 'WPNC¥S1'],

		['apollo', 'sabre', '$B:CAD', 'WPMCAD'],
		['apollo', 'sabre', '$BB:CAD', 'WPNC¥MCAD'],
		['apollo', 'sabre', '$BBA:CAD', 'WPNCS¥MCAD'],
		['apollo', 'sabre', '$BB0:CAD', 'WPNCB¥MCAD'],
		['apollo', 'sabre', '$B/:CAD', 'WPMCAD'],
		['apollo', 'sabre', '$BB/:CAD', 'WPNC¥MCAD'],
		['apollo', 'sabre', '$BBA/:CAD', 'WPNCS¥MCAD'],
		['apollo', 'sabre', '$BB0/:CAD', 'WPNCB¥MCAD'],

		['apollo', 'sabre', '$BN1|2*C05|3*INF/:EUR', 'WPP1ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BBN1*JCB|2*J05/:EUR', 'WPNC¥P1JCB/1J05¥MEUR'],
		['apollo', 'sabre', '$BBAN1*ITX|2*I05/:EUR', 'WPNCS¥P1ITX/1I05¥MEUR'],
		['apollo', 'sabre', '$BB0N1|2*C05|3*INF/:EUR', 'WPNCB¥P1ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BN1|2*C05/:EUR', 'WPP1ADT/1C05¥MEUR'],
		['apollo', 'sabre', '$BN1|2*C05|3*INF/:EUR', 'WPP1ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BBN1|2*C05|3*INF/:EUR', 'WPNC¥P1ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BBN1|2*C05/:EUR', 'WPNC¥P1ADT/1C05¥MEUR'],
		['apollo', 'sabre', '$BBN1|2|3*C05|4*INF/:EUR', 'WPNC¥P2ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BB0N1|2*C05/:EUR', 'WPNCB¥P1ADT/1C05¥MEUR'],
		['apollo', 'sabre', '$BB0N1|2*C05|3*INF/:EUR', 'WPNCB¥P1ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BB0N1|2|3*C05|4*INF/:EUR', 'WPNCB¥P2ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BBAN1|2*C05/:EUR', 'WPNCS¥P1ADT/1C05¥MEUR'],
		['apollo', 'sabre', '$BBAN1|2*C05|3*INF/:EUR', 'WPNCS¥P1ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BBAN1|2|3*C05|4*INF/:EUR', 'WPNCS¥P2ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$B*JCB/:EUR', 'WPPJCB¥MEUR'],
		['apollo', 'sabre', '$BB*JCB/:EUR', 'WPNC¥PJCB¥MEUR'],
		['apollo', 'sabre', '$BB0*JCB/:EUR', 'WPNCB¥PJCB¥MEUR'],
		['apollo', 'sabre', '$BBA*JCB/:EUR', 'WPNCS¥PJCB¥MEUR'],
		['apollo', 'sabre', '$BN1*JCB|2*J05/:EUR', 'WPP1JCB/1J05¥MEUR'],
		['apollo', 'sabre', '$BBN1*JCB|2*J05/:EUR', 'WPNC¥P1JCB/1J05¥MEUR'],
		['apollo', 'sabre', '$BB0N1*JCB|2*J05/:EUR', 'WPNCB¥P1JCB/1J05¥MEUR'],
		['apollo', 'sabre', '$BN1*JCB|2*JNS|3*JNF/:EUR', 'WPP1JCB/1JNS/1JNF¥MEUR'],
		['apollo', 'sabre', '$B*ITX/:EUR', 'WPPITX¥MEUR'],
		['apollo', 'sabre', '$BB*ITX/:EUR', 'WPNC¥PITX¥MEUR'],
		['apollo', 'sabre', '$BB0*ITX/:EUR', 'WPNCB¥PITX¥MEUR'],
		['apollo', 'sabre', '$BBA*ITX/:EUR', 'WPNCS¥PITX¥MEUR'],
		['apollo', 'sabre', '$BN1*ITX|2*I06/:EUR', 'WPP1ITX/1I06¥MEUR'],
		['apollo', 'sabre', '$BN1*ITX|2*I06|3*ITF/:EUR', 'WPP1ITX/1I06/1ITF¥MEUR'],
		['apollo', 'sabre', '$BBN1*ITX|2*I05/:EUR', 'WPNC¥P1ITX/1I05¥MEUR'],
		['apollo', 'sabre', '$BBN1*ITX|2*I06|3*ITF/:EUR', 'WPNC¥P1ITX/1I06/1ITF¥MEUR'],
		['apollo', 'sabre', '$BB0N1*ITX|2*I05/:EUR', 'WPNCB¥P1ITX/1I05¥MEUR'],
		['apollo', 'sabre', '$BB0N1*ITX|2*I06|3*ITF/:EUR', 'WPNCB¥P1ITX/1I06/1ITF¥MEUR'],
		['apollo', 'sabre', '$BBAN1*ITX|2*I05/:EUR', 'WPNCS¥P1ITX/1I05¥MEUR'],
		['apollo', 'sabre', '$BBAN1*ITX|2*I06|3*ITF/:EUR', 'WPNCS¥P1ITX/1I06/1ITF¥MEUR'],
		['apollo', 'sabre', '$BS1|2/:EUR', 'WPS1/2¥MEUR'],
		['apollo', 'sabre', '$BS1*3|5|6/:EUR', 'WPS1-3/5/6¥MEUR'],
		['apollo', 'sabre', '$BBS1|2/:EUR', 'WPNC¥S1/2¥MEUR'],
		['apollo', 'sabre', '$BBS1*3|5|6/:EUR', 'WPNC¥S1-3/5/6¥MEUR'],
		['apollo', 'sabre', '$BBAS1|2|5|6/:EUR', 'WPNCS¥S1/2/5/6¥MEUR'],
		['apollo', 'sabre', '$BBAS1*3|5|6/:EUR', 'WPNCS¥S1-3/5/6¥MEUR'],
		['apollo', 'sabre', '$BS1|2|5|6/N1|2*C05/:EUR', 'WPS1/2/5/6¥P1ADT/1C05¥MEUR'],
		['apollo', 'sabre', '$BS1|2|5|6/N1|2*C05|3*INF/:EUR', 'WPS1/2/5/6¥P1ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BS1|2|5|6/N1|2|3*C05|4*INF/:EUR', 'WPS1/2/5/6¥P2ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BBS1|2|5|6/N1|2*C05/:EUR', 'WPNC¥S1/2/5/6¥P1ADT/1C05¥MEUR'],
		['apollo', 'sabre', '$BBS1|2|5|6/N1|2*C05|3*INF/:EUR', 'WPNC¥S1/2/5/6¥P1ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BBS1|2|5|6/N1|2|3*C05|4*INF/:EUR', 'WPNC¥S1/2/5/6¥P2ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BB0S1|2|5|6/N1|2*C05/:EUR', 'WPNCB¥S1/2/5/6¥P1ADT/1C05¥MEUR'],
		['apollo', 'sabre', '$BB0S1|2|5|6/N1|2*C05|3*INF/:EUR', 'WPNCB¥S1/2/5/6¥P1ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BB0S1|2|5|6/N1|2|3*C05|4*INF/:EUR', 'WPNCB¥S1/2/5/6¥P2ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BBAS1|2|5|6/N1|2*C05/:EUR', 'WPNCS¥S1/2/5/6¥P1ADT/1C05¥MEUR'],
		['apollo', 'sabre', '$BBAS1|2|5|6/N1|2*C05|3*INF/:EUR', 'WPNCS¥S1/2/5/6¥P1ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BBAS1|2|5|6/N1|2|3*C05|4*INF/:EUR', 'WPNCS¥S1/2/5/6¥P2ADT/1C05/1INF¥MEUR'],
		['apollo', 'sabre', '$BBS1|2|5|6/N1*JCB|2*JCB|3*JNS|4*JNF/:EUR', 'WPNC¥S1/2/5/6¥P2JCB/1JNS/1JNF¥MEUR'],
		['apollo', 'sabre', '$BBS1|2|5|6/N1*ITX|2*ITX|3*INN|4*ITF/:EUR', 'WPNC¥S1/2/5/6¥P2ITX/1INN/1ITF¥MEUR'],

		['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥MEUR', '$BN1*ADT|2*C05|3*INF/:EUR'],
		['sabre', 'apollo', 'WPP1JCB/1J05¥NC¥MEUR', '$BBN1*JCB|2*J05/:EUR'],
		['sabre', 'apollo', 'WPP1ITX/1I06¥NCS¥MEUR', '$BBAN1*ITX|2*I06/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥NCB¥MEUR', '$BB0N1*ADT|2*C05|3*INF/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05¥MEUR', '$BN1*ADT|2*C05/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥MEUR', '$BN1*ADT|2*C05|3*INF/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥NC¥MEUR', '$BBN1*ADT|2*C05|3*INF/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05¥NC¥MEUR', '$BBN1*ADT|2*C05/:EUR'],
		['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥NC¥MEUR', '$BBN1*ADT|2*ADT|3*C05|4*INF/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05¥NCB¥MEUR', '$BB0N1*ADT|2*C05/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥NCB¥MEUR', '$BB0N1*ADT|2*C05|3*INF/:EUR'],
		['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥NCB¥MEUR', '$BB0N1*ADT|2*ADT|3*C05|4*INF/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05¥NCS¥MEUR', '$BBAN1*ADT|2*C05/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥NCS¥MEUR', '$BBAN1*ADT|2*C05|3*INF/:EUR'],
		['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥NCS¥MEUR', '$BBAN1*ADT|2*ADT|3*C05|4*INF/:EUR'],
		['sabre', 'apollo', 'WPPJCB¥MEUR', '$B*JCB/:EUR'],
		['sabre', 'apollo', 'WPNC¥PJCB¥MEUR', '$BB*JCB/:EUR'],
		['sabre', 'apollo', 'WPNCB¥PJCB¥MEUR', '$BB0*JCB/:EUR'],
		['sabre', 'apollo', 'WPNCS¥PJCB¥MEUR', '$BBA*JCB/:EUR'],
		['sabre', 'apollo', 'WPP1JCB/1J05¥MEUR', '$BN1*JCB|2*J05/:EUR'],
		['sabre', 'apollo', 'WPP1JCB/1J05¥NC¥MEUR', '$BBN1*JCB|2*J05/:EUR'],
		['sabre', 'apollo', 'WPP1JCB/1J05¥NCB¥MEUR', '$BB0N1*JCB|2*J05/:EUR'],
		['sabre', 'apollo', 'WPP1JCB/1JNS/1JNF¥MEUR', '$BN1*JCB|2*JNS|3*JNF/:EUR'],
		['sabre', 'apollo', 'WPPITX¥MEUR', '$B*ITX/:EUR'],
		['sabre', 'apollo', 'WPNC¥PITX¥MEUR', '$BB*ITX/:EUR'],
		['sabre', 'apollo', 'WPNCB¥PITX¥MEUR', '$BB0*ITX/:EUR'],
		['sabre', 'apollo', 'WPNCS¥PITX¥MEUR', '$BBA*ITX/:EUR'],
		['sabre', 'apollo', 'WPP1ITX/1I06¥MEUR', '$BN1*ITX|2*I06/:EUR'],
		['sabre', 'apollo', 'WPP1ITX/1I06/1ITF¥MEUR', '$BN1*ITX|2*I06|3*ITF/:EUR'],
		['sabre', 'apollo', 'WPP1ITX/1I06¥NC¥MEUR', '$BBN1*ITX|2*I06/:EUR'],
		['sabre', 'apollo', 'WPP1ITX/1I06/1ITF¥NC¥MEUR', '$BBN1*ITX|2*I06|3*ITF/:EUR'],
		['sabre', 'apollo', 'WPP1ITX/1I06¥NCB¥MEUR', '$BB0N1*ITX|2*I06/:EUR'],
		['sabre', 'apollo', 'WPP1ITX/1I06/1ITF¥NCB¥MEUR', '$BB0N1*ITX|2*I06|3*ITF/:EUR'],
		['sabre', 'apollo', 'WPP1ITX/1I06¥NCS¥MEUR', '$BBAN1*ITX|2*I06/:EUR'],
		['sabre', 'apollo', 'WPP1ITX/1I06/1ITF¥NCS¥MEUR', '$BBAN1*ITX|2*I06|3*ITF/:EUR'],
		['sabre', 'apollo', 'WPS1/2¥MEUR', '$BS1|2/:EUR'],
		['sabre', 'apollo', 'WPS1-3/5/6¥MEUR', '$BS1*3|5|6/:EUR'],
		['sabre', 'apollo', 'WPS1/2¥NC¥MEUR', '$BBS1|2/:EUR'],
		['sabre', 'apollo', 'WPS1-3/5/6¥NC¥MEUR', '$BBS1*3|5|6/:EUR'],
		['sabre', 'apollo', 'WPS1/2/5/6¥NCS¥MEUR', '$BBAS1|2|5|6/:EUR'],
		['sabre', 'apollo', 'WPS1/2/5/6¥NCS¥MEUR', '$BBAS1|2|5|6/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05¥S1/2/5/6¥MEUR', '$BN1*ADT|2*C05/S1|2|5|6/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥S1/2/5/6¥MEUR', '$B/N1*ADT|2*C05|3*INF/S1|2|5|6/:EUR'],
		['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥S1/2/5/6¥MEUR', '$B/N1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05¥NC¥S1/2/5/6¥MEUR', '$BB/N1*ADT|2*C05/S1|2|5|6/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥NC¥S1/2/5/6¥MEUR', '$BB/N1*ADT|2*C05|3*INF/S1|2|5|6/:EUR'],
		['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥NC¥S1/2/5/6¥MEUR', '$BB/N1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05¥NCB¥S1/2/5/6¥MEUR', '$BB0/N1*ADT|2*C05/S1|2|5|6/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥NCB¥S1/2/5/6¥MEUR', '$BB0/N1*ADT|2*C05|3*INF/S1|2|5|6/:EUR'],
		['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥NCB¥S1/2/5/6¥MEUR', '$BB0/N1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05¥NCS¥S1/2/5/6¥MEUR', '$BBA/N1*ADT|2*C05/S1|2|5|6/:EUR'],
		['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥NCS¥S1/2/5/6¥MEUR', '$BBA/N1*ADT|2*C05|3*INF/S1|2|5|6/:EUR'],
		['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥NCS¥S1/2/5/6¥MEUR', '$BBA/N1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6/:EUR'],
		['sabre', 'apollo', 'WPP2JCB/1JNS/1JNF¥NC¥S1/2/5/6¥MEUR', '$BB/N1*JCB|2*JCB|3*JNS|4*JNF/S1|2|5|6/:EUR'],
		['sabre', 'apollo', 'WPP2ITX/1INN/1ITF¥NC¥S1/2/5/6¥MEUR', '$BB/N1*ITX|2*ITX|3*INN|4*ITF/S1|2|5|6/:EUR'],

		['apollo', 'amadeus', '$BB0', 'FXR'],
		['apollo', 'amadeus', '$BBA', 'FXL'],
		['apollo', 'amadeus', '$BBA//@Y', 'FXL/KM'],
		['apollo', 'amadeus', '$BBA//@W', 'FXL/KW'],
		['apollo', 'amadeus', '$BBA//@C', 'FXL/KC'],
		['apollo', 'amadeus', '$BBA//@F', 'FXL/KF'],
		['apollo', 'amadeus', '$BBA//@AB', 'FXL/K'],
		['apollo', 'amadeus', '$BB/:N', 'FXA/R,P'],
		['apollo', 'amadeus', '$BB/:A', 'FXA/R,U'],
		['apollo', 'amadeus', '$BB0/ACC', 'FXR/RC05'],
		['apollo', 'amadeus', '$BBA/ACC', 'FXL/RC05'],

		['sabre', 'amadeus', 'WPNCB', 'FXR'],
		['sabre', 'amadeus', 'WPNCS', 'FXL'],
		['sabre', 'amadeus', 'WPNCS¥TC-YB', 'FXL/KM'],
		['sabre', 'amadeus', 'WPNCS¥TC-SB', 'FXL/KW'],
		['sabre', 'amadeus', 'WPNCS¥TC-BB', 'FXL/KC'],
		['sabre', 'amadeus', 'WPNCS¥TC-FB', 'FXL/KF'],
		['sabre', 'amadeus', 'WPPC05¥NCB', 'FXR/RC05'],
		['sabre', 'amadeus', 'WPPC05¥NCS', 'FXL/RC05'],
		['apollo', 'sabre', '$B*ITX/@VKXT5U0', 'WPPITX¥QVKXT5U0'],
		['sabre', 'apollo', 'WPQVKXT5U0¥PITX', '$B/@VKXT5U0/*ITX'],

		['apollo', 'amadeus', '$B*ITX/@VKXT5U0', 'FXX/RIT,U/L-VKXT5U0'],
		['apollo', 'amadeus', '$BN1|2*C05', 'FXX/RADT*C05'],
		['apollo', 'amadeus', '$BN1|2*C05|3*INF', 'FXX/RADT*C05*INF'],

		['sabre', 'amadeus', 'WPPITX¥QVKXT5U0', 'FXX/RIT,U/L-VKXT5U0'],
		['sabre', 'amadeus', 'WPP1ADT/1C05', 'FXX/RADT*C05'],
		['sabre', 'amadeus', 'WPP1ADT/1C05/1INF', 'FXX/RADT*C05*INF'],
		['apollo', 'amadeus', '$BN1|2*C05', 'FXX/RADT*C05'],
		['apollo', 'amadeus', '$BN1|2*C05|3*INF', 'FXX/RADT*C05*INF'],
		['apollo', 'amadeus', '$B:CAD', 'FXX/R,FC-CAD'],
		['apollo', 'amadeus', '$BB:EUR', 'FXA/R,FC-EUR'],
		['apollo', 'amadeus', '$BBA:EUR', 'FXL/R,FC-EUR'],
		['apollo', 'amadeus', '$BB0:EUR', 'FXR/R,FC-EUR'],
		['apollo', 'amadeus', '$BN1|2*C05|3*INF/:EUR', 'FXX/RADT*C05*INF,FC-EUR'],
		['apollo', 'amadeus', '$B*JCB', 'FXX/RJCB'],
		['apollo', 'amadeus', '$B*ITX', 'FXX/RIT,U'],
		['apollo', 'amadeus', '$BS1|2', 'FXX/S1,2'],
		['apollo', 'amadeus', '$BS1*3|5|6', 'FXX/S1-3,5,6'],
		['apollo', 'amadeus', '$BBS1|2', 'FXA/S1,2'],
		['apollo', 'amadeus', '$BS1|2|5|6/N1|2*C05', 'FXX/S1,2,5,6/RADT*C05'],
		['apollo', 'amadeus', '$BS1|2|5|6/N1|2*C05|3*INF', 'FXX/S1,2,5,6/RADT*C05*INF'],

		['sabre', 'amadeus', 'WPP1ADT/1C05', 'FXX/RADT*C05'],
		['sabre', 'amadeus', 'WPP1ADT/1C05/1INF', 'FXX/RADT*C05*INF'],
		['sabre', 'amadeus', 'WPMCAD', 'FXX/R,FC-CAD'],
		['sabre', 'amadeus', 'WPNC¥MEUR', 'FXA/R,FC-EUR'],
		['sabre', 'amadeus', 'WPNCS¥MEUR', 'FXL/R,FC-EUR'],
		['sabre', 'amadeus', 'WPNCB¥MEUR', 'FXR/R,FC-EUR'],
		['sabre', 'amadeus', 'WPP1ADT/1C05/1INF¥MEUR', 'FXX/RADT*C05*INF,FC-EUR'],
		['sabre', 'amadeus', 'WPPJCB', 'FXX/RJCB'],
		['sabre', 'amadeus', 'WPPITX', 'FXX/RIT,U'],
		['sabre', 'amadeus', 'WPS1/2', 'FXX/S1,2'],
		['sabre', 'amadeus', 'WPS1-3/5/6', 'FXX/S1-3,5,6'],
		['sabre', 'amadeus', 'WPS1/2¥NC', 'FXA/S1,2'],
		['sabre', 'amadeus', 'WPP1ADT/1C05¥S1/2/5/6', 'FXX/RADT*C05/S1,2,5,6'],
		['sabre', 'amadeus', 'WPP1ADT/1C05/1INF¥S1/2/5/6', 'FXX/RADT*C05*INF/S1,2,5,6'],

		['apollo', 'sabre', '$BB//@AB/:N', 'WPNC¥PL'],
		['apollo', 'sabre', '$BB//@AB:N', 'WPNC¥PL'],
		['apollo', 'sabre', '$BB//@C/:N', 'WPNC¥TC-BB¥PL'],
		['apollo', 'sabre', '$BB//@C:N', 'WPNC¥TC-BB¥PL'],
		['apollo', 'sabre', '$BB//@W/:N', 'WPNC¥TC-SB¥PL'],
		['apollo', 'sabre', '$BB:A//@C', 'WPNC¥PV¥TC-BB'],
		['apollo', 'sabre', '$BB:EUR//@C', 'WPNC¥MEUR¥TC-BB'],
		['apollo', 'sabre', '$BB:N//@C', 'WPNC¥PL¥TC-BB'],

		['apollo', 'sabre', '$BBN1|2*C03/:N', 'WPNC¥P1ADT/1C03¥PL'],
		['apollo', 'sabre', '$BBN1|2*C08/:A', 'WPNC¥P1ADT/1C08¥PV'],
		['apollo', 'sabre', '$BBN1|2*C10/:N', 'WPNC¥P1ADT/1C10¥PL'],
		['apollo', 'sabre', '$BBS1|2|5|6/:N', 'WPNC¥S1/2/5/6¥PL'],
		['apollo', 'sabre', '$BBS1|2/:A', 'WPNC¥S1/2¥PV'],
		['apollo', 'sabre', '$BBS2|3|4|5/:A', 'WPNC¥S2-5¥PV'],
		['apollo', 'sabre', '$BBS3|4/:A', 'WPNC¥S3/4¥PV'],
		['apollo', 'sabre', '$BN1*JCB|2*J08/:A', 'WPP1JCB/1J08¥PV'],
		['apollo', 'sabre', '$BN1*JCB|2*JCB|3*J09/:A', 'WPP2JCB/1J09¥PV'],
		['apollo', 'sabre', '$BN1|2*C02/:N', 'WPP1ADT/1C02¥PL'],
		['apollo', 'sabre', '$BN1|2*C06/:N', 'WPP1ADT/1C06¥PL'],
		['apollo', 'sabre', '$BN1|2*C08|3*INF/:N', 'WPP1ADT/1C08/1INF¥PL'],
		['apollo', 'sabre', '$BN1|2*C09/:A', 'WPP1ADT/1C09¥PV'],
		['apollo', 'sabre', '$BN1|2*C10/:A', 'WPP1ADT/1C10¥PV'],
		['apollo', 'sabre', '$BN1|2*C05/:N', 'WPP1ADT/1C05¥PL'],
		['apollo', 'sabre', '$BN1|2*INF/:N', 'WPP1ADT/1INF¥PL'],
		['apollo', 'sabre', '$BS1|2/:A', 'WPS1/2¥PV'],

		['apollo', 'sabre', '$B*JCB/:A', 'WPPJCB¥PV'],
		['apollo', 'sabre', '$BB*JCB//@C', 'WPNC¥PJCB¥TC-BB'],
		['apollo', 'sabre', '$BB*JCB/:N', 'WPNC¥PJCB¥PL'],
		['apollo', 'sabre', '$BB/*JCB', 'WPNC¥PJCB'],
		['apollo', 'sabre', '$BBA*JCB//@C', 'WPNCS¥PJCB¥TC-BB'],
		['apollo', 'sabre', '$BBA/*JCB', 'WPNCS¥PJCB'],

		['apollo', 'sabre', '$BB*ITX', 'WPNC¥PITX'],
		['apollo', 'sabre', '$BBA//@C/*JCB', 'WPNCS¥TC-BB¥PJCB'],
		['apollo', 'sabre', '$BB//@C/*JCB', 'WPNC¥TC-BB¥PJCB'],

		['amadeus', 'apollo', 'FXX', '$B'],
		['amadeus', 'apollo', 'FXA', '$BB'],
		['amadeus', 'apollo', 'FXR', '$BB0'],
		['amadeus', 'apollo', 'FXL', '$BBA'],
		['amadeus', 'apollo', 'FXA/KM', '$BB//@Y'],
		['amadeus', 'apollo', 'FXL/KM', '$BBA//@Y'],
		['amadeus', 'apollo', 'FXA/KW', '$BB//@W'],
		['amadeus', 'apollo', 'FXL/KW', '$BBA//@W'],
		['amadeus', 'apollo', 'FXA/KC', '$BB//@C'],
		['amadeus', 'apollo', 'FXL/KC', '$BBA//@C'],
		['amadeus', 'apollo', 'FXA/KF', '$BB//@F'],
		['amadeus', 'apollo', 'FXL/KF', '$BBA//@F'],
		['amadeus', 'apollo', 'FXA/K', '$BB//@AB'],
		['amadeus', 'apollo', 'FXL/K', '$BBA//@AB'],
		['amadeus', 'apollo', 'FXA/R,P', '$BB:N'],
		['amadeus', 'apollo', 'FXA/R,P', '$BB:N'],
		['amadeus', 'apollo', 'FXA/R,U', '$BB:A'],
		['amadeus', 'apollo', 'FXA/R,U', '$BB:A'],
		['amadeus', 'apollo', 'FXX/R,P', '$B:N'],
		['amadeus', 'apollo', 'FXX/R,U', '$B:A'],
		['amadeus', 'apollo', 'FXX/RC05', '$B*C05/ACC'],
		['amadeus', 'apollo', 'FXA/RC05', '$BB*C05/ACC'],
		['amadeus', 'apollo', 'FXR/RC05', '$BB0*C05/ACC'],
		['amadeus', 'apollo', 'FXL/RC05', '$BBA*C05/ACC'],
		['amadeus', 'apollo', 'FXX/L-Q1LEP4', '$B@Q1LEP4'],
		//['amadeus', 'apollo', 'FXX/L-Q1LEP4/RJCB', '$B*JCB/@Q1LEP4'],
		//['amadeus', 'apollo', 'FXX/L-Q1LEP4/RITX', '$B*ITX/@Q1LEP4'],
		['amadeus', 'apollo', 'FXX/R,FC-CAD', '$B:CAD'],
		['amadeus', 'apollo', 'FXA/R,FC-CAD', '$BB:CAD'],
		['amadeus', 'apollo', 'FXL/R,FC-CAD', '$BBA:CAD'],
		['amadeus', 'apollo', 'FXR/R,FC-CAD', '$BB0:CAD'],
		['amadeus', 'apollo', 'FXX/RADT*CNN*IN,FC-EUR', '$BN1*ADT|2*CNN|3*INF/:EUR'],
		['amadeus', 'apollo', 'FXX/RADT*C05', '$BN1*ADT|2*C05'],
		['amadeus', 'apollo', 'FXX/RADT*C05*INF', '$BN1*ADT|2*C05|3*INF'],
		['amadeus', 'apollo', 'FXX/RJCB', '$B*JCB'],
		['amadeus', 'apollo', 'FXA/R,U', '$BB:A'],
		['amadeus', 'apollo', 'FXR/R,U', '$BB0:A'],
		['amadeus', 'apollo', 'FXL/R,U', '$BBA:A'],
		['amadeus', 'apollo', 'FXX/RJCB*J05', '$BN1*JCB|2*J05'],
		['amadeus', 'apollo', 'FXX/RITX', '$B*ITX'],
		['amadeus', 'apollo', 'FXA/R,U', '$BB:A'],
		['amadeus', 'apollo', 'FXR/R,U', '$BB0:A'],
		['amadeus', 'apollo', 'FXL/R,U', '$BBA:A'],
		['amadeus', 'apollo', 'FXX/S1,2', '$BS1|2'],
		['amadeus', 'apollo', 'FXX/S1-3,5,6', '$BS1*3|5|6'],
		['amadeus', 'apollo', 'FXA/S1,2', '$BBS1|2'],
		['amadeus', 'apollo', 'FXA/S1-3,5,6', '$BBS1*3|5|6'],
		['amadeus', 'apollo', 'FXL/S1,2', '$BBAS1|2'],
		['amadeus', 'apollo', 'FXL/S1-3,5,6', '$BBAS1*3|5|6'],
		['amadeus', 'apollo', 'FXX/RADT*CH/S1,2,5,6', '$BN1*ADT|2*CNN/S1|2|5|6'],
		['amadeus', 'apollo', 'FXX/RADT*CH*IN/S1,2,5,6', '$BN1*ADT|2*CNN|3*INF/S1|2|5|6'],

		['apollo', 'amadeus', '$BB/ACC', 'FXA/RC05'],
		['apollo', 'amadeus', '$BB0/ACC', 'FXR/RC05'],
		['apollo', 'amadeus', '$BBA/ACC', 'FXL/RC05'],
		['apollo', 'amadeus', '$B@VKXT5U0', 'FXX/L-VKXT5U0'],
		['apollo', 'amadeus', '$B*JCB/@VKXT5U0', 'FXX/RJCB/L-VKXT5U0'],
		['apollo', 'amadeus', '$B*ITX/@VKXT5U0', 'FXX/RIT,U/L-VKXT5U0'],
		['apollo', 'amadeus', '$B:CAD', 'FXX/R,FC-CAD'],
		['apollo', 'amadeus', '$BB:EUR', 'FXA/R,FC-EUR'],
		['apollo', 'amadeus', '$BBA:EUR', 'FXL/R,FC-EUR'],
		['apollo', 'amadeus', '$BB0:EUR', 'FXR/R,FC-EUR'],
		['apollo', 'amadeus', '$BN1|2*C05|3*INF/:EUR', 'FXX/RADT*C05*INF,FC-EUR'],
		['apollo', 'amadeus', '$BN1|2*C05', 'FXX/RADT*C05'],
		['apollo', 'amadeus', '$BN1|2*C05|3*INF', 'FXX/RADT*C05*INF'],
		['apollo', 'amadeus', '$BN1*JCB|2*J05', 'FXX/RJCB*J05'],
		['apollo', 'amadeus', '$BN1*JCB|2*J06|3*JNF', 'FXX/RJCB*J06*JNF'],
		['apollo', 'amadeus', '$B*ITX', 'FXX/RIT,U'],
		['apollo', 'amadeus', '$BS1|2', 'FXX/S1,2'],
		['apollo', 'amadeus', '$BS1*3|5|6', 'FXX/S1-3,5,6'],
		['apollo', 'amadeus', '$BBS1|2', 'FXA/S1,2'],
		['apollo', 'amadeus', '$BBS1*3|5|6', 'FXA/S1-3,5,6'],
		['apollo', 'amadeus', '$BBAS1|2|5|6', 'FXL/S1,2,5,6'],
		['apollo', 'amadeus', '$BBAS1*3|5|6', 'FXL/S1-3,5,6'],
		['apollo', 'amadeus', '$BS1|2|5|6/N1|2*C05', 'FXX/S1,2,5,6/RADT*C05'],
		['apollo', 'amadeus', '$BS1|2|5|6/N1|2*C05|3*INF', 'FXX/S1,2,5,6/RADT*C05*INF'],

		['apollo', 'sabre', '$BB/OCUA', 'WPNC¥C-UA'],
		['apollo', 'sabre', '$BCUA', 'WPAUA'],
		['apollo', 'sabre', '$B/CUA', 'WPAUA'],
		['apollo', 'sabre', '$BOCUA', 'WPC-UA'],
		['apollo', 'sabre', '$BOCUA', 'WPC-UA'],
		['apollo', 'sabre', '$BB/CUA', 'WPNC¥AUA'],
		['apollo', 'sabre', '$BB/CUA', 'WPNC¥AUA'],
		['apollo', 'sabre', '$BB/OCUA', 'WPNC¥C-UA'],
		['apollo', 'sabre', '$BB0/CUA', 'WPNCB¥AUA'],
		['apollo', 'sabre', '$BB0CUA', 'WPNCB¥AUA'],
		['apollo', 'sabre', '$BB0OCUA', 'WPNCB¥C-UA'],
		['apollo', 'sabre', '$BB/OCUA', 'WPNC¥C-UA'],
		['apollo', 'amadeus', '$BB/OCUA', 'FXA/R,OCC-UA'],
		['apollo', 'amadeus', '$BCUA', 'FXX/R,VC-UA'],
		['apollo', 'amadeus', '$B/CUA', 'FXX/R,VC-UA'],
		['apollo', 'amadeus', '$BOCUA', 'FXX/R,OCC-UA'],
		['apollo', 'amadeus', '$B/OCUA', 'FXX/R,OCC-UA'],
		['apollo', 'amadeus', '$BB/CUA', 'FXA/R,VC-UA'],
		['apollo', 'amadeus', '$BB/CUA', 'FXA/R,VC-UA'],
		['apollo', 'amadeus', '$BB/OCUA', 'FXA/R,OCC-UA'],
		['apollo', 'amadeus', '$BB0/CUA', 'FXR/R,VC-UA'],
		['apollo', 'amadeus', '$BB0CUA', 'FXR/R,VC-UA'],
		['apollo', 'amadeus', '$BB0OCUA', 'FXR/R,OCC-UA'],
		['apollo', 'amadeus', '$BB/OCUA', 'FXA/R,OCC-UA'],


		['apollo', 'sabre', '$BB/OCUA', 'WPNC¥C-UA'],

		['sabre', 'apollo', 'WPPJCB¥RQ', 'T:$B*JCB'],
		['sabre', 'apollo', 'WPAUA', '$B/CUA'],
		['sabre', 'apollo', 'WPC-UA', '$BOCUA'],
		['sabre', 'apollo', 'WPNC¥AUA', '$BB/CUA'],
		['sabre', 'apollo', 'WPNC¥C-UA', '$BBOCUA'],
		['sabre', 'apollo', 'WPNCB¥AUA', '$BB0/CUA'],

		['apollo', 'amadeus', '$BB/OCUA', 'FXA/R,OCC-UA'],
		['apollo', 'amadeus', '$B*ITX', 'FXX/RIT,U'],
		['apollo', 'amadeus', '$BB*ITX', 'FXA/RIT,U'],
		['apollo', 'amadeus', '$BB*I05', 'FXA/RI05,U'],
		['apollo', 'amadeus', '$BB*ITF', 'FXA/RITF,U'],

		['amadeus', 'apollo', 'FXX/RITX*I06', '$BN1*ITX|2*I06'],
		['amadeus', 'apollo', 'FXX/RITX*I06*ITF', '$BN1*ITX|2*I06|3*ITF'],
		['amadeus', 'apollo', 'FXX/RADT*CH/S1,2,5,6', '$BN1*ADT|2*CNN/S1|2|5|6'],
		['amadeus', 'apollo', 'FXP/RITX*I06', 'T:$BN1*ITX|2*I06'],
		['amadeus', 'apollo', 'FXP/RITX*I06*ITF', 'T:$BN1*ITX|2*I06|3*ITF'],

		['apollo', 'sabre', '$BB:15JUN17', 'WPNC¥B15JUN17'],
		['sabre', 'apollo', 'WPNC¥B15JUN17', '$BB:15JUN17'],
		['sabre', 'apollo', 'WPQWV3XPCIT¥PITX', '$B@WV3XPCIT/*ITX'],
		['sabre', 'apollo', 'WPQWV3XPCIT¥PJCB', '$B@WV3XPCIT/*JCB'],
		['sabre', 'apollo', 'WPPJCB¥QWV3XPCIT', '$B*JCB/@WV3XPCIT'],
		['sabre', 'apollo', 'WPPITX¥QWV3XPCIT', '$B*ITX/@WV3XPCIT'],

		['apollo', 'galileo', '$B', 'FQ'],
		['galileo', 'apollo', 'FQ', '$B'],

		['apollo', 'galileo', '$B', 'FQ', true],
		['apollo', 'galileo', '$BB', 'FQBB', true],
		['apollo', 'galileo', '$BBA', 'FQBA', true],
		// $BB:{futureDate} -> FQBB.T{futureDate}{year}
		['apollo', 'galileo', '$BB:26MAR18', 'FQBB.T26MAR18', true],
		// $BB:{pastDate} -> FQBB.B{pastDate}
		['apollo', 'galileo', '$BB//\u00A4Y', 'FQBB++-ECON', true],
		['apollo', 'galileo', '$BBA//\u00A4Y', 'FQBA++-ECON', true],
		['apollo', 'galileo', '$BB//\u00A4W', 'FQBB++-PREME', true],
		['apollo', 'galileo', '$BBA//\u00A4W', 'FQBA++-PREME', true],
		['apollo', 'galileo', '$BB//\u00A4C', 'FQBB++-BUSNS', true],
		['apollo', 'galileo', '$BBA//\u00A4C', 'FQBA++-BUSNS', true],
		['apollo', 'galileo', '$BB//\u00A4F', 'FQBB++-FIRST', true],
		['apollo', 'galileo', '$BBA//\u00A4F', 'FQBA++-FIRST', true],
		['apollo', 'galileo', '$BB//\u00A4AB', 'FQBB++-AB', true],
		['apollo', 'galileo', '$BBA//\u00A4AB', 'FQBA++-AB', true],
		['apollo', 'galileo', '$BB:N', 'FQBB:N', true],
		['apollo', 'galileo', '$BB/:N', 'FQBB:N'],
		['galileo', 'apollo', 'FQBB:N', '$BB:N'],
		['apollo', 'galileo', '$BB:A', 'FQBB:A', true],
		['apollo', 'galileo', '$BB/:A', 'FQBB:A'],
		['apollo', 'galileo', '$B:N', 'FQ:N', true],
		['apollo', 'galileo', '$B:A', 'FQ:A', true],
		// $BC{al} -> FQC{al}
		['apollo', 'galileo', '$BCUA', 'FQCUA'],
		// $B/C{al} -> FQ/C{al}
		['apollo', 'galileo', '$B/CUA', 'FQCUA'],
		// $BOC{al} -> FQOC{al}
		['apollo', 'galileo', '$BOCUA', 'FQOCUA', true],
		// $B/OC{al} -> FQ/OC{al}
		['apollo', 'galileo', '$B/OCUA', 'FQOCUA'],
		// $BB/C{al} -> FQBBC{al}
		['apollo', 'galileo', '$BB/CUA', 'FQBBCUA'],
		// $BBC{al} -> FQBB/C{al}
		['apollo', 'galileo', '$BB/CUA', 'FQBBCUA'],
		// $BB/OC{al} -> FQBBOC{al}
		['apollo', 'galileo', '$BB/OCUA', 'FQBBOCUA'],
		// $BB0/C{al} -> DOES NOT EXIST
		['apollo', 'galileo', '$BB0/CUA', null],
		// $BB0C{al} -> DOES NOT EXIST
		['apollo', 'galileo', '$BB0CUA', null],
		// $B*C{paxAge}/ACC -> FQ*C{paxAge}/ACC
		['apollo', 'galileo', '$B*C05/ACC', 'FQ*C05/ACC'],
		// $BB*C{paxAge}/ACC -> FQBB*C{paxAge}/ACC
		['apollo', 'galileo', '$BB*C05/ACC', 'FQBB*C05/ACC'],
		// $BB0*C{paxAge}/ACC -> DOES NOT EXIST
		['apollo', 'galileo', '$BB0*C05/ACC', null],
		// $BBA*C{paxAge}/ACC -> FQBA*C{paxAge}/ACC
		['apollo', 'galileo', '$BBA*C05/ACC', 'FQBA*C05/ACC'],
		// $B¤{fareBase} -> FQ@{fareBase}
		['apollo', 'galileo', '$B\u00A4VKXT5U0', 'FQ@VKXT5U0', true],
		// $B¤{fareBase}//*{PTC} -> FQ@{fareBase}*{PTC}
		['apollo', 'galileo', '$B\u00A4VKXT5U0/*JCB', 'FQ@VKXT5U0/*JCB'],
		// $BBN{paxOrder}+{paxOrder}*C{paxAge}+3*INF//¤Y -> FQBBP{paxOrder1}.{paxOrder2}*C{paxAge}.{paxOrder}*INF++-BUSNS
		['apollo', 'galileo', '$BBN1+2*C05+3*INF//\u00A4C', 'FQBBP1.2*C05.3*INF/++-BUSNS', true],
		// $BBN{paxOrder}*{PTC}+{paxOrder}*{PTC}+{paxOrder}*{PTC}//¤C -> FQBBP{paxOrder1}*{PTC}.{paxOrder}*{PTC}.{paxOrder}*{PTC}++-BUSNS
		['apollo', 'galileo', '$BBN1*JCB+2*J05+3*JNF//\u00A4C', 'FQBBP1*JCB.2*J05.3*JNF/++-BUSNS', true],
		// $B/:{currency} -> FQ:{currency}
		['apollo', 'galileo', '$B/:CAD', 'FQ:CAD'],
		// $BB/:{currency} -> FQBB:{currency}
		['apollo', 'galileo', '$BB/:EUR', 'FQBB:EUR'],
		// $BBA/:{currency} -> FQBA:{currency}
		['apollo', 'galileo', '$BBA/:EUR', 'FQBA:EUR'],
		// $BB0/:{currency} -> DOES NOT EXIST
		['apollo', 'galileo', '$BB0/:EUR', null],
		// $BN{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF/:{currency} -> FQP{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
		['apollo', 'galileo', '$BN1+2*C05+3*INF/:EUR', 'FQP1.2*C05.3*INF/:EUR', true],
		// $BBN{paxOrder}*JCB+{paxOrder}*J{paxAge}/:{currency} -> FQBBP{paxOrder}*JCB+{paxOrder}*J{paxAge}:{currency}
		['apollo', 'galileo', '$BBN1*JCB+2*J05/:EUR', 'FQBBP1*JCB.2*J05/:EUR', true],
		// $BBAN{paxOrder}*ITX+{paxOrder}*I{paxAge}/:{currency} -> FQBAP{paxOrder}*ITX+{paxOrder}*I{paxAge}:{currency}
		['apollo', 'galileo', '$BBAN1*ITX+2*I05/:EUR', 'FQBAP1*ITX.2*I05/:EUR', true],
		// $BB0N{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF/:{currency} -> DOES NOT EXIST
		['apollo', 'galileo', '$BB0N1+2*C05+3*INF/:EUR', null],
		// $BN{paxOrder}+{paxOrder}*C{paxAge} -> FQP{paxOrder}.{paxOrder}*C{paxAge}
		['apollo', 'galileo', '$BN1+2*C05', 'FQP1.2*C05', true],
		// $BN{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> FQP{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
		['apollo', 'galileo', '$BN1+2*C05+3*INF', 'FQP1.2*C05.3*INF', true],
		// $BN{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> FQP{paxOrder}.{paxOrder}.{paxOrder}*C{paxAge}*INF
		['apollo', 'galileo', '$BN1+2+3*C05+4*INF', 'FQP1.2.3*C05.4*INF', true],
		// $BBN{paxOrder}+{paxOrder}*C{paxAge} -> FQBBP{paxOrder}.{paxOrder}*C{paxAge}
		['apollo', 'galileo', '$BBN1+2*C05', 'FQBBP1.2*C05', true],
		// $BBN{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> FQBBP{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
		['apollo', 'galileo', '$BBN1+2*C05+3*INF', 'FQBBP1.2*C05.3*INF', true],
		// $BBN{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> FQBBP{paxOrder}.{paxOrder}.{paxOrder}*C{paxAge}*INF
		['apollo', 'galileo', '$BBN1+2+3*C05+4*INF', 'FQBBP1.2.3*C05.4*INF', true],
		// $BB0N{paxOrder}+{paxOrder}*C{paxAge} -> DOES NOT EXIST
		['apollo', 'galileo', '$BB0N1+2*C05', null],
		// $BB0N{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> DOES NOT EXIST
		['apollo', 'galileo', '$BB0N1+2*C05+3*INF', null],
		// $BB0N{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> DOES NOT EXIST
		['apollo', 'galileo', '$BB0N1+2+3*C05+4*INF', null],
		// $BBAN{paxOrder}+{paxOrder}*C{paxAge} -> FQBBAP{paxOrder}.{paxOrder}*C{paxAge}
		['apollo', 'galileo', '$BBAN1+2*C05', 'FQBAP1.2*C05', true],
		// $BBAN{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> FQBBAP{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
		['apollo', 'galileo', '$BBAN1+2*C05+3*INF', 'FQBAP1.2*C05.3*INF', true],
		// $BBAN{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> FQBBAP{paxOrder1}.{paxOrder2}.{3paxOrder}*C{paxAge}.{paxOrder4}*INF
		['apollo', 'galileo', '$BBAN1+2+3*C05+4*INF', 'FQBAP1.2.3*C05.4*INF', true],
		['apollo', 'galileo', '$B*JCB', 'FQ*JCB', true],
		['apollo', 'galileo', '$BB*JCB', 'FQBB*JCB', true],
		['apollo', 'galileo', '$BB0*JCB', null],
		['apollo', 'galileo', '$BBA*JCB', 'FQBA*JCB', true],
		// $BN{paxOrder}*JCB+{paxOrder}*J{paxAge} -> FQP{paxOrder}*JCB.2*J{paxAge}
		['apollo', 'galileo', '$BN1*JCB+2*J05', 'FQP1*JCB.2*J05', true],
		// $BBN{paxOrder}*JCB+{paxOrder}*J{paxAge} -> FQBBP{paxOrder}*JCB.{paxOrder}*J{paxAge}
		['apollo', 'galileo', '$BBN1*JCB+2*J05', 'FQBBP1*JCB.2*J05', true],
		// $BB0N{paxOrder}*JCB+{paxOrder}*J{paxAge} -> DOES NOT EXIST
		['apollo', 'galileo', '$BB0N1*JCB+2*J05', null],
		// $BN{paxOrder}+JCB+{paxOrder}*J{paxAge}+{paxOrder}*JNF -> FQP{paxOrder}*JCB.{paxOrder}*J{paxAge}.{paxOrder}*JNF
		['apollo', 'galileo', '$BN1*JCB+2*J06+3*JNF', 'FQP1*JCB.2*J06.3*JNF', true],
		['apollo', 'galileo', '$B*ITX', 'FQ*ITX', true],
		['apollo', 'galileo', '$BB*ITX', 'FQBB*ITX', true],
		['apollo', 'galileo', '$BB0*ITX', null],
		['apollo', 'galileo', '$BBA*ITX', 'FQBA*ITX', true],
		// $BN{paxOrder}*ITX+{paxOrder}*I{paxAge} -> FQP{paxOrder}*ITX.{paxOrder}*I{paxAge}
		['apollo', 'galileo', '$BN1*ITX+2*I06', 'FQP1*ITX.2*I06', true],
		// $BN{paxOrder}*ITX+{paxOrder}*I{paxAge}+{paxOrder}*ITF -> FQP{paxOrder}*ITX.{paxOrder}*I{paxAge}.{paxOrder}*ITF
		['apollo', 'galileo', '$BN1*ITX+2*I06+3*ITF', 'FQP1*ITX.2*I06.3*ITF', true],
		// $BBN{paxOrder}*ITX+{paxOrder}*I{paxAge} -> FQBBP{paxOrder}*ITX.{paxOrder}*I{paxOrder}
		['apollo', 'galileo', '$BBN1*ITX+2*I05', 'FQBBP1*ITX.2*I05', true],
		// $BBN{paxOrder}*ITX+{paxOrder}*I{paxAge}+{paxOrder}*ITF -> FQBBP{paxOrder}*ITX.{paxOrder}*I{paxOrder}.{paxOrder}*ITF
		['apollo', 'galileo', '$BBN1*ITX+2*I06+3*ITF', 'FQBBP1*ITX.2*I06.3*ITF', true],
		// $BB0N{paxOrder}*ITX+{paxOrder}*I{paxAge} -> DOES NOT EXIST
		['apollo', 'galileo', '$BB0N1*ITX+2*I05', null],
		// $BB0N{paxOrder}*ITX+{paxOrder}*I{paxAge}+{paxOrder}*ITF -> DOES NOT EXIST
		['apollo', 'galileo', '$BB0N1*ITX+2*I06+3*ITF', null],
		// $BBAN{paxOrder}*ITX+{paxOrder}*I{paxAge} -> FQBAP{paxOrder}*ITX.{paxOrder}*I{paxAge}
		['apollo', 'galileo', '$BBAN1*ITX+2*I05', 'FQBAP1*ITX.2*I05', true],
		// $BBAN{paxOrder}*ITX+{paxOrder}*I{paxAge}+{paxOrder}*ITF -> FQBAP{paxOrder}*ITX.{paxOrder}*I{paxAge}.{paxOrder}*I{paxAge}
		['apollo', 'galileo', '$BBAN1*ITX+2*I06+3*ITF', 'FQBAP1*ITX.2*I06.3*ITF', true],
		// $BS{segNum1}+{segNum2} -> FQS{segNum1}.{segNum2}
		['apollo', 'galileo', '$BS1+2', 'FQS1.2', true],
		// $BS{segNum1}*{segNum3}+{segNum5}*{segNum6} -> FQS{segNum1}-{segNum3}.{segNum5}-{segNum6}
		['apollo', 'galileo', '$BS1*3+5*6', 'FQS1-3.5.6', false],
		// $BBS{segNum1}+{segNum2} -> FQBBS{segNum1}.{segNum2}
		['apollo', 'galileo', '$BBS1+2', 'FQBBS1.2', true],
		// $BBS{segNum1}*{segNum3}+{segNum5}*{segNum6} -> FQBBS{segNum1}-{segNum3}.{segNum5}-{segNum6}
		['apollo', 'galileo', '$BBS1*3+5*6', 'FQBBS1-3.5.6', false],
		// $BBAS{segNum1}+{segNum2}+{segNum5}+{segNum6} -> FQBAS{segNum1}.{segNum2}.{segNum5}.{segNum6}
		['apollo', 'galileo', '$BBAS1+2+5+6', 'FQBAS1.2.5.6', true],
		// $BBAS{segNum1}*{segNum3}+{segNum5}*{segNum6} -> FQBAS{segNum1}-{segNum3}.{segNum5}-{segNum6}
		['apollo', 'galileo', '$BBAS1*3+5*6', 'FQBAS1-3.5.6', false],
		// $BS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxOrder}+{paxOrder}*C{paxAge} -> FQS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}*C{paxAge}
		['apollo', 'galileo', '$BS1+2+5+6/N1+2*C05', 'FQS1.2.5.6/P1.2*C05', true],
		// $BS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> FQS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
		['apollo', 'galileo', '$BS1+2+5+6/N1+2*C05+3*INF', 'FQS1.2.5.6/P1.2*C05.3*INF', true],
		// $BS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> FQS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
		['apollo', 'galileo', '$BS1+2+5+6/N1+2+3*C05+4*INF', 'FQS1.2.5.6/P1.2.3*C05.4*INF', true],
		// $BBS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxOrder}+{paxOrder}*C{paxAge} -> FQBBS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}*C{paxAge}
		['apollo', 'galileo', '$BBS1+2+5+6/N1+2*C05', 'FQBBS1.2.5.6/P1.2*C05', true],
		// $BBS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> FQBBS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
		['apollo', 'galileo', '$BBS1+2+5+6/N1+2*C05+3*INF', 'FQBBS1.2.5.6/P1.2*C05.3*INF', true],
		// $BBS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> FQBBS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
		['apollo', 'galileo', '$BBS1+2+5+6/N1+2+3*C05+4*INF', 'FQBBS1.2.5.6/P1.2.3*C05.4*INF', true],
		// $BB0S{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxOrder}+{paxOrder}*C{paxAge} -> DOES NOT EXIST
		['apollo', 'galileo', '$BB0S1+2+5+6/N1+2*C05', null],
		// $BB0S{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> DOES NOT EXIST
		['apollo', 'galileo', '$BB0S1+2+5+6/N1+2*C05+3*INF', null],
		// $BB0S{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> DOES NOT EXIST
		['apollo', 'galileo', '$BB0S1+2+5+6/N1+2+3*C05+4*INF', null],
		// $BBAS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxOrder}+{paxOrder}*C{paxAge} -> FQBAS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}*C{paxAge}
		['apollo', 'galileo', '$BBAS1+2+5+6/N1+2*C05', 'FQBAS1.2.5.6/P1.2*C05', true],
		// $BBAS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> FQBAS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
		['apollo', 'galileo', '$BBAS1+2+5+6/N1+2*C05+3*INF', 'FQBAS1.2.5.6/P1.2*C05.3*INF', true],
		// $BBAS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> FQBAS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
		['apollo', 'galileo', '$BBAS1+2+5+6/N1+2+3*C05+4*INF', 'FQBAS1.2.5.6/P1.2.3*C05.4*INF', true],
		// $BBS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder1}*JCB+{paxOrder2}*JCB+{paxOrder3}*J{paxAge}+{paxOrder}*JNF -> FQBBS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}*JCB.{paxOrder}*JCB.{paxOrder}*J{paxAge}.{paxOrder}*JNF
		['apollo', 'galileo', '$BBS1+2+5+6/N1*JCB+2*JCB+3*JNN+4*JNF', 'FQBBS1.2.5.6/P1*JCB.2*JCB.3*JNN.4*JNF', true],
		// $BBS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder1}*ITX+{paxOrder2}*ITX+{paxOrder3}*I{paxAge}+{paxOrder}*XTF -> FQBBS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}*ITX.{paxOrder}*ITX.{paxOrder}*I{paxAge}.{paxOrder}*ITF
		['apollo', 'galileo', '$BBS1+2+5+6/N1*ITX+2*ITX+3*INN+4*ITF', 'FQBBS1.2.5.6/P1*ITX.2*ITX.3*INN.4*ITF', true],
		['galileo', 'sabre', 'FQBB*C05/ACC', 'WPNC¥PC05'],

		['sabre', 'apollo', 'WP', '$B', true],
		['sabre', 'amadeus', 'WP', 'FXX', true],
		['sabre', 'galileo', 'WP', 'FQ', true],
		['amadeus', 'galileo', 'FXA/R,15JUN17', 'FQBB.T15JUN17', true],

		['galileo', 'amadeus', 'FQBB/:N', 'FXA/R,P'],
		['galileo', 'amadeus', 'FQBB/:A', 'FXA/R,U'],
		['galileo', 'amadeus', 'FQ/CUA', 'FXX/R,VC-UA'],
		['galileo', 'amadeus', 'FQ/OCUA', 'FXX/R,OCC-UA'],
		['galileo', 'amadeus', 'FQBB/CUA', 'FXA/R,VC-UA'],
		['galileo', 'amadeus', 'FQ*C05', 'FXX/RC05'],
		['galileo', 'amadeus', 'FQBB*C05', 'FXA/RC05'],
		['galileo', 'amadeus', 'FQBA*C05', 'FXL/RC05'],
		['galileo', 'amadeus', 'FQ@VKXT5U0', 'FXX/L-VKXT5U0'],
		['galileo', 'amadeus', 'FQ@VKXT5U0*JCB', 'FXX/L-VKXT5U0/RJCB'],
		['galileo', 'amadeus', 'FQP1.2*C05.3*INF/:EUR', 'FXX/RADT*C05*INF,FC-EUR'],
		['galileo', 'amadeus', 'FQP1*ADT.2*C05', 'FXX/RADT*C05'],
		['galileo', 'amadeus', 'FQP1.2*C05.3*INF', 'FXX/RADT*C05*INF'],
		['galileo', 'amadeus', 'FQ*JCB', 'FXX/RJCB'],
		['galileo', 'amadeus', 'FQBB*JCB', 'FXA/RJCB'],
		['galileo', 'amadeus', 'FQBA*JCB', 'FXL/RJCB'],
		['galileo', 'amadeus', 'FQP1*JCB.2*J05', 'FXX/RJCB*J05'],
		['galileo', 'amadeus', 'FQP1*JCB.2*J06.3*JNF', 'FXX/RJCB*J06*JNF'],
		['galileo', 'amadeus', 'FQ*ITX', 'FXX/RIT,U'],
		['galileo', 'amadeus', 'FQBB*ITX', 'FXA/RIT,U'],
		['galileo', 'amadeus', 'FQBA*ITX', 'FXL/RIT,U'],
		['galileo', 'amadeus', 'FQP1*ITX.2*I06', 'FXX/RIT*I06,U'],
		['galileo', 'amadeus', 'FQP1*ITX.2*I06.3*ITF', 'FXX/RIT*I06*ITF,U'],
		['galileo', 'amadeus', 'FQS1.2.5.6/P1.2*C05', 'FXX/S1,2,5,6/RADT*C05'],
		['galileo', 'amadeus', 'FQS1.2.5.6/P1.2*C05.3*INF', 'FXX/S1,2,5,6/RADT*C05*INF'],

		['galileo', 'sabre', 'FQBB/:N', 'WPNC¥PL'],
		['galileo', 'sabre', 'FQBB/:A', 'WPNC¥PV'],
		['galileo', 'sabre', 'FQ/CUA', 'WPAUA'],
		['galileo', 'sabre', 'FQ/OCUA', 'WPC-UA'],
		['galileo', 'sabre', 'FQBB/CUA', 'WPNC¥AUA'],
		['galileo', 'sabre', 'FQBBOCUA', 'WPNC¥C-UA'],
		['galileo', 'sabre', 'FQ@VKXT5U0', 'WPQVKXT5U0'],
		['galileo', 'sabre', 'FQ@VKXT5U0*JCB', 'WPQVKXT5U0¥PJCB'],
		['galileo', 'sabre', 'FQBBP1.2*C05.3*INF++-BUSNS', 'WPNC¥P1ADT/1C05/1INF¥TC-BB'],
		['galileo', 'sabre', 'FQBBP1*JCB.2*J05.3*JNF++-BUSNS', 'WPNC¥P1JCB/1J05/1JNF¥TC-BB'],
		['galileo', 'sabre', 'FQBBP1*JCB.2*J05:EUR', 'WPNC¥P1JCB/1J05¥MEUR'],
		['galileo', 'sabre', 'FQBAP1*ITX.2*I05:EUR', 'WPNCS¥P1ITX/1I05¥MEUR'],

		['galileo', 'apollo', 'FQBBK', '$BBQ01'],
		['galileo', 'apollo', 'FQBB/:N', '$BB:N'],
		['galileo', 'apollo', 'FQBB/:A', '$BB:A'],
		['galileo', 'apollo', 'FQ/CUA', '$B/CUA'],
		['galileo', 'apollo', 'FQ/OCUA', '$BOCUA'],
		// it's important that Apollo translation had slash before /CUA,
		// $BBCUA is invalid since there is a $BBC base cmd
		['galileo', 'apollo', 'FQBBCUA', '$BB/CUA'],
		['galileo', 'apollo', 'FQBB/CUA', '$BB/CUA'],
		['galileo', 'apollo', 'FQ*C05/ACC', '$B*C05/ACC'],
		['galileo', 'apollo', 'FQBB*C05/ACC', '$BB*C05/ACC'],
		['galileo', 'apollo', 'FQBA*C05/ACC', '$BBA*C05/ACC'],
		['galileo', 'apollo', 'FQ@VKXT5U0', '$B\u00A4VKXT5U0'],
		['galileo', 'apollo', 'FQ@VKXT5U0*JCB', '$B@VKXT5U0/*JCB'],
		['galileo', 'apollo', 'FQBBP1.2*C05.3*INF++-BUSNS', '$BBN1+2*C05+3*INF//\u00A4C'],
		['galileo', 'apollo', 'FQBBP1*JCB.2*J05.3*JNF++-BUSNS', '$BBN1*JCB+2*J05+3*JNF//\u00A4C'],

		['apollo', 'amadeus', '$BB:15JUN17', 'FXA/R,15JUN17'],
		// needs current date
		['apollo', 'amadeus', '$BB:15JUN', 'FXA/R,15JUN18'],

		// should not translate pricing commands with unknown modifiers to FQ
		['apollo', 'galileo', '$B/+2CV4', null],
		['apollo', 'amadeus', '$B:A', 'FXX/R,U'],
		['apollo', 'sabre', '$B/FXD', 'WPFXD'],
		['apollo', 'amadeus', '$B/FXD', 'FXX/R,*BD'],
		['apollo', 'galileo', '$B/FXD', 'FQ/FXD'],
		['sabre', 'apollo', 'WPFXD', '$B/FXD'],
		['apollo', 'amadeus', '$BBS2//@C', 'FXA/S2/KC'],
		// should translate *ITX to RIT,U, as Amadeus does not seem to allow "ITX" PTC
		['apollo', 'amadeus', '$BB*ITX', 'FXA/RIT,U'],
	];

	return argTuples;
};

/** for completion */
const provide_call_item = () => {
	return provide_call()[Math.random()];
};

class Translate_priceItineraryTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js')
{
	/** @param testCase = provide_call_item() */
	test_call(fromGds, toGds, cmd, output, bidirectional) {
		const subCases = [{fromGds, toGds, cmd, output}];
		if (bidirectional) {
			subCases.push({fromGds: toGds, toGds: fromGds, cmd: output, output: cmd});
		}
		const baseDate = '2018-06-12 08:09:08';
		for (const subCase of subCases) {
			const {fromGds, toGds, cmd, output} = subCase;
			const expected = normCmd(toGds, output || null);
			const parsed = CmdParser.parse(cmd, fromGds);
			let actual = null;
			try {
				actual = Translate_priceItinerary({parsed, fromGds, toGds, baseDate});
				actual = normCmd(fromGds, actual);
			} catch (exc) {
				if (expected) {
					throw exc;
				}
			}
			this.assertEquals(expected, actual, 'Input cmd >' + cmd + ';');
		}
	}

	getTestMapping() {
		return [
			[provide_call, this.test_call],
		];
	}
}

module.exports = Translate_priceItineraryTest;
