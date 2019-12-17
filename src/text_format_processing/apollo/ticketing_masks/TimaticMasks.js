
const TimaticMasks = {
	records: [
		{
			cmd: 'TI-MV',
			pattern: [
				'TI-RV            TIMATIC VISA INFORMATION REQUEST              ',
				'* NATIONALITY    :NA;___                                        ',
				'1 DESTINATION    :DE;___/___/___/___/___/___/___/___/___/___    ',
				'0 TRANSIT CITIES :TR;___/___/___/___/___/___/___/___/___/___    ',
				'0 ALIEN RESIDENT :AR;___                                        ',
				'                                                                ',
				'   *--REQUIRED FIELD                                            ',
				'   1--MINIMUM OF ONE COUNTRY/CITY/AIRPORT CODE REQUIRED         ',
				'   0--OPTIONAL FIELD                                            ',
				'   USE 3 CHAR AIRPORT/CITY CODE OR 2 CHAR COUNTRY CODE          ',
			].join(''),
		},
		{
			cmd: 'TI-MA',
			pattern: [
				'TI-RA            TIMATIC VISA AND HEALTH INFORMATION REQUEST   ',
				'2 NATIONALITY     :NA;___                                       ',
				'2 EMBARKATION CITY:EM;___                                       ',
				'1 DESTINATION     :DE;___/___/___/___/___/___/___/___/___/___   ',
				'0 TRANSIT CITIES  :TR;___/___/___/___/___/___/___/___/___/___   ',
				'0 CITIES VISITED  :VT;___/___/___/___/___/___/___/___/___/___   ',
				'0 ALIEN RESIDENT  :AR;___                                       ',
				'   2--ENTER AT NA FOR VISA AND EM FOR HEALTH                    ',
				'   1--MINIMUM OF ONE COUNTRY/CITY/AIRPORT CODE REQUIRED         ',
				'   0--OPTIONAL FIELD                                            ',
				'   USE 3 CHAR AIRPORT/CITY CODE OR 2 CHAR COUNTRY CODE          ',
			].join(''),
		},
		{
			cmd: 'TI-MH',
			pattern: [
				'TI-RH            TIMATIC HEALTH INFORMATION REQUEST            ',
				'* EMBARKATION CITY:EM;___                                       ',
				'1 DESTINATION     :DE;___/___/___/___/___/___/___/___/___/___   ',
				'0 TRANSIT CITIES  :TR;___/___/___/___/___/___/___/___/___/___   ',
				'0 CITIES VISITED  :VT;___/___/___/___/___/___/___/___/___/___   ',
				'                                                                ',
				'   *--REQUIRED FIELD                                            ',
				'   1--MINIMUM OF ONE COUNTRY/CITY/AIRPORT CODE REQUIRED         ',
				'   0--OPTIONAL FIELD                                            ',
				'   USE 3 CHAR AIRPORT/CITY CODE OR 2 CHAR COUNTRY CODE          ',
			].join(''),
		},
		{
			cmd: 'TI-MF',
			pattern: [
				'TI-DFT           TIMATIC FULL TEXT INFORMATION REQUEST         ',
				'* COUNTRY         :/;___                                        ',
				'1 SECTION         :/;__                                         ',
				'0 SUB-SECTION     :/;________                                   ',
				'0 PAGE            :/;__                                         ',
				''                                                                ,
				'   *--REQUIRED FIELD                                            ',
				'   1--GE,PA,VI,HE,TX,CS,CY...ONE REQUIRED                       ',
				'   0--OPTIONAL FIELD                                            ',
				'   USE 3 CHAR AIRPORT/CITY CODE OR 2 CHAR COUNTRY CODE          ',
			].join(''),
		},
		{
			cmd: 'TI-ML',
			pattern: [
				'TI-LCC           TIMATIC COUNTRY INFORMATION/PARTIAL NAME KNOWN',
				'* COUNTRY NAME LETTERS   :/;____________________                ',
				'                                                                ',
				'   *--REQUIRED FIELD                                            ',
			].join(''),
		},
	],
};

module.exports = TimaticMasks;