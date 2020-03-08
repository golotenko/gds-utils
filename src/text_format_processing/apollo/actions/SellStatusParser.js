const ItineraryParser = require('../pnr/ItineraryParser.js');

/**
 * parses output of a sell command, which is any command starting with "0"
 * examples: >02T4*; >0AC4063P10MAYZRHSFOSS1;
 *
 * "0 AVAIL/WL CLOSED * *",
 * "0 AVAIL/WL CLOSED * *",
 * " 4 KE 3483T  27FEB ORDDTW SS2  1114A  137P *                 E",
 * "VALID FOR INTL ONLINE STOP/CONNECTIONS ONLY - KE",
 * "OFFER CAR/HOTEL    >CAL;     >HOA;",
 * "OPERATED BY ENDEAVOR AIR DBA DELTA CONNECTION",
 * "DEPARTS ORD TERMINAL 2  - ARRIVES DTW TERMINAL EM",
 * "><"
 *
 * "   AA  912Q  14MAR SCLMIA SS1   850P  425A|*      1          E",
 * "503 4 15 18 20 *",
 * "   AA 1477Q  15MAR MIACLT SS1   610A  822A *      1          E",
 * "503 18 *",
 * "OFFER CAR/HOTEL    >CAL;     >HOA;",
 *
 *
 *  "   ET  552U  16JUL ADDYYZ SS5  1055P  825A|*      1          E",
 *  "010 KP 1105 *",
 *  "010 SA 7194 *",
 *  "OFFER CAR/HOTEL    >CAL;     >HOA;",
 *  "DEPARTS ADD TERMINAL 2  - ARRIVES YYZ TERMINAL 1 ",
 *  "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
 *  "PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
 *  "WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
 *  "FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
 *  "CANCEL REQUEST COMPLETED",
 *  "><",
 */
exports.parse = (output) => {
	const segments = [];
	const failedSegments = [];
	const skippedLines = [];
	for (const line of output.split('\n')) {
		const seg = ItineraryParser.parseSegmentBlock(line);
		if (seg) {
			segments.push(seg);
		} else if (line.startsWith('0 AVAIL/WL ')) {
			failedSegments.push({raw: line});
		} else {
		    skippedLines.push();
		}
	}

	return {
		segments,
		failedSegments,
		skippedLines,
	};
};