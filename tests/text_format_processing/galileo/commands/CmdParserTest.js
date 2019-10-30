
const CmdParser = require('../../../../src/text_format_processing/galileo/commands/CmdParser.js');

class CmdParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js')
{
	provideCommands()  {
		const list = [];

		list.push(['N.1LIBERMANE/MARINA'                             , {'type': 'addName'}]);
		list.push(['N.I/LIBERMANE/ZIMICH*15FEB18'                    , {'type': 'addName'}]);
		list.push(['N.1LIBERMANE/MARINA|N.I/LIBERMANE/ZIMICH*15FEB18', {'type': 'addName'}]);

		// tried in GDS
		list.push(['*R'                   , {'type': 'redisplayPnr'}]);
		list.push(['A10MAYKIVRIX'         , {'type': 'airAvailability'}]);
		list.push(['01Y1Y2BK'             , {'type': 'sell'}]);
		list.push(['N.P1@'                , {'type': 'changeName'}]);
		list.push(['N.P1-2@'              , {'type': 'changeName'}]);
		list.push(['R.KLESUN'             , {'type': 'addReceivedFrom'}]);
		list.push(['P.PIXR'               , {'type': 'addAgencyPhone'}]);
		list.push(['T.TAU/04APR'          , {'type': 'addTicketingDateLimit'}]);
		list.push(['ER'                   , {'type': 'storeKeepPnr'}]);
		list.push(['XI'                   , {'type': 'deletePnrField'}]);
		list.push(['*NJ9KSC'              , {'type': 'openPnr'}]);
		list.push(['HELP TICKET'          , {'type': 'help'}]);
		list.push(['GG*'                  , {'type': 'helpIndex'}]);
		list.push(['H/TICKET'             , {'type': 'help'}]);
		list.push(['.EE FOKKER'           , {'type': 'encodeAircraft'}]);
		list.push(['.ED 747'              , {'type': 'decodeAircraft'}]);
		list.push(['P-*ALL'               , {'type': 'printPnr'}]);
		list.push(['0AY631C11JULHELARNNN1', {'type': 'sell'}]);
		list.push(['01Y1Y2'               , {'type': 'sell'}]);
		list.push(['N1Y1Y2'               , {'type': 'sell'}]);
		list.push(['01D1D2'               , {'type': 'sell'}]);
		list.push(['@1HK'                 , {'type': 'rebook'}]);
		list.push(['@1/3'                 , {'type': 'rebook'}]);
		list.push(['XX5+5'                , {'type': 'calculator'}]);
		list.push(['TT23JANMOWBUH'        , {'type': 'timeTable'}]);
		list.push(['TI-'                  , {'type': 'visaAndHealthInfo'}]);
		list.push(['FQ'                   , {'type': 'priceItinerary'}]);
		list.push(['FQA'                  , {'type': 'priceItinerary'}]);
		list.push(['FF1'                  , {'type': 'storePricing'}]);
		list.push(['*FF'                  , {'type': 'storedPricing'}]);
		list.push(['H/FF'                 , {'type': 'help'}]);
		list.push(['*FF1'                 , {'type': 'storedPricing'}]);
		list.push(['*CPR0HI'              , {'type': 'openPnr'}]);

		// from docs
		list.push(['ASTOLON', {'type': 'airAvailability'}]);
		list.push(['*H', {'type': 'history'}]);
		list.push(['*-HARRIS', {'type': 'searchPnr'}]);
		list.push(['REALLSALL', {'type': 'storeAndCopyPnr'}]);

		list.push(['HOM2D/13FEB-15FEB', {'type': 'modifyHotelSegment'}]);
		list.push(['HOM4R/1A2Q-2', {'type': 'modifyHotelSegment'}]);
		list.push(['HOM2O/FT-AA1KK99993', {'type': 'modifyHotelSegment'}]);
		list.push(['HOM2X/SI', {'type': 'modifyHotelSegment'}]);
		list.push(['HODS2/BOOK', {'type': 'hotelDescription'}]);
		list.push(['HODSI/ROOM', {'type': 'hotelDescription'}]);
		list.push(['N1A1KRAC1/G-VI4111111111111111EXP1201', {'type': 'sell'}]); // sell hotel
		list.push(['HOVS2', {'type': 'hotelRules'}]);
		list.push(['HOVA1KRAC', {'type': 'hotelRules'}]);
		list.push(['HOV3', {'type': 'hotelRules'}]);
		list.push(['HOU/@GALINT', {'type': 'updateHotelAvailabilityParams'}]);
		list.push(['HOU/L-A', {'type': 'updateHotelAvailabilityParams'}]);
		list.push(['HOU/D-3S', {'type': 'updateHotelAvailabilityParams'}]);
		list.push(['HOU/HI+UI', {'type': 'updateHotelAvailabilityParams'}]);
		list.push(['HOU/F-HEA+RES', {'type': 'updateHotelAvailabilityParams'}]);
		list.push(['HOU/V-100', {'type': 'updateHotelAvailabilityParams'}]);
		list.push(['HOU/@', {'type': 'updateHotelAvailabilityParams'}]);
		list.push(['HOI6FEB-2NTSAO', {'type': 'hotels'}]);

		list.push(['CAVS2', {'type': 'carRules'}]);
		list.push(['CAM2D/2SEP-5SEP', {'type': 'modifyCarSegment'}]);
		list.push(['CAM4T/CCAR', {'type': 'modifyCarSegment'}]);
		list.push(['CAM3O/CD-123456777', {'type': 'modifyCarSegment'}]);
		list.push(['CADZEAMS/CARS', {'type': 'carDescription'}]);
		list.push(['CAIMUNICH', {'type': 'carVendors'}]);
		list.push(['HORRIO', {'type': 'referencePoints'}]);
		list.push(['CAL23AUG-25AUGDXB/ARR-9A/DT-11A', {'type': 'carAvailability'}]);

		list.push(['QCA', {'type': 'queueCount'}]);
		list.push(['QCB/97', {'type': 'queueCount'}]);
		list.push(['Q/97', {'type': 'openQueue'}]);
		list.push(['QXI', {'type': 'leaveQueue'}]);
		list.push(['QR', {'type': 'removeFromQueue'}]);
		list.push(['QEB/99', {'type': 'movePnrToQueue'}]);
		list.push(['QEM/GL2', {'type': 'sendToMessageQueue'}]);

		list.push(['FQPLONPARLON', {'type': 'fareQuotePlanner'}]);
		list.push(['FQP2', {'type': 'priceItinerary'}]);
		list.push(['FQBB', {'type': 'priceItinerary'}]);
		list.push(['FQ*CH', {'type': 'priceItinerary'}]);
		list.push(['FQO3', {'type': 'priceItinerary'}]);
		list.push(['FQ@BLXAP', {'type': 'priceItinerary'}]);
		list.push(['FQL2', {'type': 'fareQuoteLadder'}]);
		list.push(['FQN2', {'type': 'fareList'}]);
		list.push(['FN1/P2.5', {'type': 'fareRules'}]);
		list.push(['FN1*16', {'type': 'fareRules'}]);
		list.push(['FD11DECMADATH', {'type': 'fareSearch'}]);
		list.push(['FD11DECHELFRA/AY', {'type': 'fareSearch'}]);

		list.push(['SI.P2S5@', {'type': 'cancelSsr'}]);
		list.push(['SI.YY*VIP ROCK STAR', {'type': 'addSsr'}]);
		list.push(['SI.1@YY*VIP SCREEN STAR', {'type': 'cancelSsr'}]); // change SSR contents
		list.push(['SI.3@', {'type': 'cancelSsr'}]);

		list.push(['NP.FREE TEXT', {'type': 'addRemark'}]);
		list.push(['NP.1@', {'type': 'changePnrRemarks'}]);
		list.push(['T.T*', {'type': 'addTicketingDateLimit'}]);
		list.push(['T.TAU/20DEC', {'type': 'addTicketingDateLimit'}]);
		list.push(['T.@T*', {'type': 'changeTicketingDateLimit'}]);

		list.push(['.CE MILAN', {'type': 'encodeCity'}]);
		list.push(['.CD NYC', {'type': 'decodeCity'}]);
		list.push(['.LE FINLAND', {'type': 'encodeCountry'}]);
		list.push(['.LD AU', {'type': 'decodeCountry'}]);
		list.push(['GC*12/CAR/ALAMO', {'type': 'encodeOrDecodeHotelOrCar'}]);
		list.push(['GC*12/CAR/AL', {'type': 'encodeOrDecodeHotelOrCar'}]);
		list.push(['GC*11/HTL/OMNI', {'type': 'encodeOrDecodeHotelOrCar'}]);
		list.push(['GC*11/HTL/OM', {'type': 'encodeOrDecodeHotelOrCar'}]);
		list.push(['.AE IBERIA', {'type': 'encodeAirline'}]);
		list.push(['.AD EI', {'type': 'decodeAirline'}]);

		list.push(['SON/Z123', {'type': 'signIn'}]);
		list.push(['SOF', {'type': 'signOut'}]);
		list.push(['OP/W*', {'type': 'workAreas'}]);

		list.push(['N.1LIBERMANE/MARINA|N.I/PROKOPCHUK/SASHA*15FEB18|R.KLESUN|P.PIXR|T.TAU/04APR|ER', {
			'cmd': 'N.1LIBERMANE/MARINA',
			'type': 'addName',
			'followingCommands': [
				{'cmd': 'N.I/PROKOPCHUK/SASHA*15FEB18', 'type': 'addName'},
				{'cmd': 'R.KLESUN', 'type': 'addReceivedFrom'},
				{'cmd': 'P.PIXR', 'type': 'addAgencyPhone'},
				{'cmd': 'T.TAU/04APR', 'type': 'addTicketingDateLimit'},
				{'cmd': 'ER', 'type': 'storeKeepPnr'},
			],
		}]);

		list.push(['*-PROKOPCHUK', {'type': 'searchPnr'}]);
		list.push(['*2', {'type': 'displayPnrFromList'}]);

		list.push(['FS', {'type': 'lowFareSearch'}]);
		list.push(['FSLON10JUNNYC', {'type': 'lowFareSearch'}]);
		list.push(['FSK1', {'type': 'sellFromLowFareSearch'}]);
		list.push(['FSOF3', {'type': 'lowFareSearchNavigation'}]);
		list.push(['FSMORE', {'type': 'lowFareSearchNavigation'}]);
		list.push(['FS*2', {'type': 'lowFareSearchNavigation'}]);

		// best buy and segment select
		list.push(['FQBBS2', {
			'type': 'priceItinerary',
			'data': {
				'baseCmd': 'FQBB',
				'pricingModifiers': [
					{'raw': 'S2', 'type': 'segments'},
				],
			},
		}]);

		// segment select: second segment in DFLOWCS fare basis
		list.push(['FQS2@DFLOWCS', {
			'type': 'priceItinerary',
			'data': {
				'baseCmd': 'FQ',
				'pricingModifiers': [
					{'raw': 'S2@DFLOWCS', 'type': 'segments'},
				],
			},
		}]);

		// segment select and all segments (I think) in DFLOWCS fare basis
		list.push(['FQS2/@DFLOWCS', {
			'type': 'priceItinerary',
			'data': {
				'pricingModifiers': [
					{'raw': 'S2', 'type': 'segments'},
					{'raw': '@DFLOWCS', 'type': 'segments'},
				],
			},
		}]);
		// segment select: force K booking class in first segment
		list.push(['FQS1.K/S2', {
			type: 'priceItinerary',
			data: {
				baseCmd: 'FQ',
				pricingModifiers: [
					{raw: 'S1.K', type: 'segments', parsed: {
						bundles: [{
							segmentNumbers: ['1'],
							bookingClass: 'K',
						}],
					}},
					{raw: 'S2', type: 'segments'},
				],
			},
		}]);
		// yes, this is valid format too
		list.push(['FQS1.K.2.K', {
			type: 'priceItinerary',
			data: {
				baseCmd: 'FQ',
				pricingModifiers: [
					{raw: 'S1.K.2.K', type: 'segments', parsed: {
						bundles: [
							{segmentNumbers: ['1'], bookingClass: 'K'},
							{segmentNumbers: ['2'], bookingClass: 'K'},
						],
					}},
				],
			},
		}]);
		// and this
		list.push(['FQS1-*711M.K.2-*711M', {
			type: 'priceItinerary',
			data: {
				baseCmd: 'FQ',
				pricingModifiers: [
					{raw: 'S1-*711M.K.2-*711M', type: 'segments', parsed: {
						bundles: [
							{segmentNumbers: ['1'], bookingClass: 'K'},
							{segmentNumbers: ['2'], bookingClass: null},
						],
					}},
				],
			},
		}]);
		// and this
		list.push(['FQS1-*711M.K.2.K-*711M:USD', {
			type: 'priceItinerary',
			data: {
				baseCmd: 'FQ',
				pricingModifiers: [
					{raw: 'S1-*711M.K.2.K-*711M', type: 'segments', parsed: {
						bundles: [
							{segmentNumbers: ['1'], pcc: '711M', bookingClass: 'K'},
							{segmentNumbers: ['2'], bookingClass: 'K', pcc: '711M'},
						],
					}},
					{raw: ':USD', type: 'currency'},
				],
			},
		}]);

		// best buy regardless of availability
		list.push(['FQBA', {
			'type': 'priceItinerary',
			'data': {
				'baseCmd': 'FQBA',
				'pricingModifiers': [],
			},
		}]);

		// best buy and rebook segments
		list.push(['FQBBK', {
			'type': 'priceItinerary',
			'data': {
				'baseCmd': 'FQBBK',
				'pricingModifiers': [],
			},
		}]);

		list.push(['FQAS1', {
			'type': 'priceItinerary',
			'data': {
				'baseCmd': 'FQA',
				'pricingModifiers': [
					{'raw': 'S1', 'type': 'segments'},
				],
			},
		}]);

		// pricing with two-letter PTC
		list.push(['FQ*CH', {
			'type': 'priceItinerary',
			'data': {
				'baseCmd': 'FQ',
				'pricingModifiers': [
					{
						'raw': '*CH',
						'type': 'passengers',
						'parsed': {
							'appliesToAll': true,
							'ptcGroups': [
								{'passengerNumbers': [], 'ptc': 'CH'},
							],
						},
					},
				],
			},
		}]);

		// pricing with PTC "SRC" and PTC description: 65 years, location: Great Britain
		list.push(['FQP1*SRC65LGB.2*SRC75LGB', {
			'type': 'priceItinerary',
			'data': {
				'baseCmd': 'FQ',
				'pricingModifiers': [
					{
						'raw': 'P1*SRC65LGB.2*SRC75LGB',
						'type': 'passengers',
						'parsed': {
							'appliesToAll': false,
							'ptcGroups': [
								{'passengerNumbers': [1], 'ptc': 'SRC', 'ptcDescription': '65LGB'},
								{'passengerNumbers': [2], 'ptc': 'SRC', 'ptcDescription': '75LGB'},
							],
						},
					},
				],
			},
		}]);

		list.push(['FQP1*ITX.2*C03.3*INS', {
			'type': 'priceItinerary',
			'data': {
				'baseCmd': 'FQ',
				'pricingModifiers': [
					{
						'raw': 'P1*ITX.2*C03.3*INS',
						'type': 'passengers',
						'parsed': {
							'appliesToAll': false,
							'ptcGroups': [
								{'passengerNumbers': [1], 'ptc': 'ITX'},
								{'passengerNumbers': [2], 'ptc': 'C03'},
								{'passengerNumbers': [3], 'ptc': 'INS'},
							],
						},
					},
				],
			},
		}]);

		list.push(['FQP1*ADT/FXD', {
			'type': 'priceItinerary',
			'data': {
				'baseCmd': 'FQ',
				'pricingModifiers': [
					{
						'raw': 'P1*ADT',
						'type': 'passengers',
						'parsed': {
							'appliesToAll': false,
							'ptcGroups': [
								{'passengerNumbers': [1], 'ptc': 'ADT'},
							],
						},
					},
					{
						'raw': 'FXD',
						'type': 'forceProperEconomy',
					},
				],
			},
		}]);

		list.push(['EM', {'type': 'storePnrSendEmail'}]); // Send email to default address (First email address found)
		list.push(['EMALL', {'type': 'storePnrSendEmail'}]); // Send email to all email addresses
		list.push(['EM2', {'type': 'storePnrSendEmail'}]); // Send email to email address 2 only
		list.push(['EM1.3.5', {'type': 'storePnrSendEmail'}]); // Send email to email addresses 1 , 3 and 5
		list.push(['EM3-5.8', {'type': 'storePnrSendEmail'}]); // Send email to email addresses 3 to 5 and 8
		list.push(['ERM', {'type': 'storePnrSendEmail'}]); // Send email to default address and retrieve Booking File
		list.push(['ERMALL', {'type': 'storePnrSendEmail'}]); // Send email to all addresses and retrieve Booking File
		list.push(['ELM5', {'type': 'storePnrSendEmail'}]); // Send email to address 5 and redisplay Similar Names List
		list.push(['ECMALL', {'type': 'storePnrSendEmail'}]); // Send email to all addresses and end transact LeisureShopper Booking
		list.push(['EM* REC', {'type': 'storePnrSendEmail'}]); // Send email with expense receipt in HTML format
		list.push(['EM*PDF', {'type': 'storePnrSendEmail'}]); // Send email with expense receipt in PDF format

		list.push(['EM*HTM    ', {'type': 'storePnrSendEmail'}]);  // Send email in HTML format only
		list.push(['EM*TXT    ', {'type': 'storePnrSendEmail'}]);  // Send email in HTML format only
		list.push(['EM*HTM*TXT', {'type': 'storePnrSendEmail'}]);  // Send email in HTML and text format
		list.push(['EM*NL     ', {'type': 'storePnrSendEmail'}]);  // Send email with no link to ViewTrip

		list.push(['TKP**\u2013JONES', {'type': 'issueTickets'}]); // Print Ticket, Itinerary/Invoice and issue MIR by passenger name
		list.push(['TKP*12MAR\u2013JONES', {'type': 'issueTickets'}]); // Print Ticket, Itinerary/Invoice and issue MIR by departure date and passenger name
		list.push(['TKP**GL4\u2013JONES', {'type': 'issueTickets'}]); // Print Ticket, Itinerary/Invoice and issue MIR by branch location and passenger name
		list.push(['TKP*DG7AE5', {'type': 'issueTickets'}]); // Print Ticket, Itinerary/Invoice and issue MIR by record locator
		list.push(['TKP*4', {'type': 'issueTickets'}]); // Print Ticket, Itinerary/Invoice and issue MIR by name list number
		list.push(['TKP', {'type': 'issueTickets'}]); // Print Ticket, Itinerary/Invoice and issue MIR for all passengers on all segments
		list.push(['TKP1P2', {'type': 'issueTickets'}]); // Print Ticket, Itinerary/Invoice and issue MIR using filed fare number 1 for passenger number 2
		list.push(['TKP2P2\u20134.7.9', {'type': 'issueTickets'}]); // Print Ticket, Itinerary/Invoice and issue MIR using filed fare number 2 for passenger numbers 2 through 4, 7 and 9
		list.push(['TMU1EB@VALID ONLY ON BA', {'type': 'changeTickets'}]); // Change stored endorsement box text for filed fare 1
		list.push(['TMU2Z@9/EB@NON REF/F@S/C@BA', {'type': 'changeTickets'}]); // Change stored commission to 9%, endorsement text, FOP to cash, and validating carrier for filed fare 2
		list.push(['TMU1P3F@S', {'type': 'changeTickets'}]); // Change stored form of payment for passenger 3 only
		list.push(['TMU1EB@', {'type': 'changeTickets'}]); // Delete endorsement box text of filed fare 1
		list.push(['TMU4IT@/TC@', {'type': 'changeTickets'}]); // Delete IT modifier, and tour code of filed fare 4
		list.push(['TMU1P1\u20133F@', {'type': 'changeTickets'}]); // Delete form of payment stored individually for passengers 1 through 3
		list.push(['TMU1D@ID', {'type': 'changeTickets'}]); // Change print modifier to DID i.e. print Itinerary only
		list.push(['TMU1D@', {'type': 'changeTickets'}]); // Delete print modifier for filed fare 1
		list.push(['TKRETS1/TN1114440008888/C1', {'type': 'revalidateTicket'}]); // Revalidate segment 1 quoting ticket number to be revalidated and coupon 1 to be revalidated. Electronic Ticket record must be displayed first.
		list.push(['TKPFEX/CBA/Z9', {'type': 'issueTickets'}]); // Display exchange FIF for only filed fare for all passengers and segments
		list.push(['TMU2FEX/CTW/Z9', {'type': 'changeTickets'}]); // Display exchange FIF for filed fare 2 for all passengers and add the validating carrier and commission rates as modifiers
		list.push(['TKP2P1/FEX/CKL/Z9', {'type': 'issueTickets'}]); // Display exchange FIF for filed fare 2 for passenger 1 only
		list.push(['TMU3FEX/EBNON-REFUNDABLE/CAZ/Z9', {'type': 'changeTickets'}]); // Display exchange FIF for filed fare 3 for all passengers; add an endorsement, validating carrier and commission rate
		list.push(['TMU1FEX1114440008000/CBA/Z9/ET', {'type': 'changeTickets'}]); // Display exchange FIF for specified electronic ticket number, for only filed fare for all passengers and segments; exchange will be for the specified electronic ticket for a new electronic ticket
		list.push(['TKPFEX1114440008000/CBA/Z9/PT', {'type': 'issueTickets'}]); // Display exchange FIF for specified electronic ticket number; exchange specified electronic ticket for a new paper ticket (when the default ticket type for the carrier is electronic)
		list.push(['TRVE/12312345678906', {'type': 'voidTicket'}]); // Void an exchange on the same calendar day for participating carriers. Include the airline code and check digit.
		list.push(['TRVE/12312345678906 /PCC', {'type': 'voidTicket'}]); // Void an exchange on the same calendar day for participating carriers when the ticket was exchanged in another authorised location/branch office. Include the airline code and check digit.

		list.push(['TKRETS1/TN0171234567890/C1NVB21FEB/NVA11MAR',{'type': 'revalidateTicket'}]) ; //	Revalidation of segment 1, coupon 1, specifying Not Valid Before and Not Valid After dates.
		list.push(['TKP1P2/PT', {'type': 'issueTickets'}]) ; //	Print ticket for filed fare 1, passenger 2 using paper ticket
		list.push(['TKP',{'type': 'issueTickets'}]) ; //	Issue Electronic Ticket when the carrier default is set to Electronic Ticket
		list.push(['TKPET', {'type': 'issueTickets'}]) ; //	Issue Electronic Ticket when the carrier default is set to Paper Ticket
		list.push(['TRV/01612345678904',{'type': 'voidTicket'}]) ; //	Void an Electronic Ticket (include check digit)
		list.push(['TKPFEX0161234567890/ET', {'type': 'issueTickets'}]) ; //	Exchange Electronic Ticket
		list.push(['TRNE12512345678904',{'type': 'refundTicket'}]) ; //	Refund Electronic Ticket
		list.push(['TMU1GRC',{'type': 'changeTickets'}]) ; //	Override the "Print Now" command in HMET table when set to "N": Passenger receipt will be printed immediately.
		list.push(['TKP1MCOTOD', {'type': 'issueTickets'}]) ; //	Issue an MCO for TOD for filed fare 1
		list.push(['TKP2MCOPTA',{'type': 'issueTickets'}]) ; //	Issue an MCO for PTA for filed fare 2
		list.push(['TKP1MCOOTH', {'type': 'issueTickets'}]) ; //	Issue an MCO for other services for filed fare 1
		list.push(['TKP2MCOPTA/R-B',{'type': 'issueTickets'}]) ; //	Issue an MCO for PTA for filed fare 2 and override the Reason For Issuance Code (RFIC)

		list.push(['TKP1P3F@CK', {'type': 'issueTickets'}]);

		list.push(['SON/Z217', {'type': 'signIn'}]); // or
		list.push(['SON/ZHA', {'type': 'signIn'}]); // Sign on at own office SON/ followed by Z and a 1 to 3 character I.D.; the I.D. can be initials, a number or a combination of both
		list.push(['SON/ZGL4HA', {'type': 'signIn'}]); // Sign on at branch agency SON/ followed by Z, own pseudo city code and a 1 to 3 character I.D.
		list.push(['SON/Z7XX1/UMP', {'type': 'signIn'}]); // Sign on at 4 character PCC branch agency SON/ followed by Z, own pseudo city code, second delimiter and 1 to 3 character I.D.
		list.push(['SB', {'type': 'changeArea'}]); // Change to work area B
		list.push(['SA/TA', {'type': 'changeArea'}]); // Change to work area A; different duty code TA (Training)
		list.push(['SAI/ZHA', {'type': 'signIn'}]); // Sign back into all work areas at own office
		list.push(['SAI/ZGL4HA', {'type': 'signIn'}]); // Sign back into all work areas at branch agency; SAI/ followed by Z, own pseudo city code and a 1 to 3 character I.D.
		list.push(['SAO', {'type': 'signOut'}]); // Temporary sign out; incomplete Booking Files must be ignored or completed
		list.push(['SOF', {'type': 'signOut'}]); // Sign off; incomplete Booking Files must be ignored or completed
		list.push(['SOF/ZHA', {'type': 'signOut'}]); // Sign off override (at own office); incomplete transactions are not protected
		list.push(['SOF/ZGL4HA', {'type': 'signOut'}]); // Sign off override (at branch agency); incomplete transactions are not protected; SOF/ followed by Z, own pseudo city code and a 1 to 3 character I.D.

		// Change second notepad item
		list.push(['NP.2@NEW TEXT', {'type': 'changePnrRemarks','data': {
			'ranges': [
				{'from': '2','to': '2'},
			],
			'newText': 'NEW TEXT',
		}}]);
		// Change fourth notepad item with P qualifier
		list.push(['NP.4@P*NEW TEXT', {'type': 'changePnrRemarks','data': {
			'ranges': [
				{'from': '4','to': '4'},
			],
			'newText': 'P*NEW TEXT',
		}}]);
		// Delete second notepad item
		list.push(['NP.2@', {'type': 'changePnrRemarks','data': {
			'ranges': [
				{'from': '2','to': '2'},
			],
		}}]);
		// Delete notepad items 1, 2, 3 and 5
		list.push(['NP.1-3.5@', {'type': 'changePnrRemarks','data': {
			'ranges': [
				{'from': '1','to': '3'},
				{'from': '5','to': '5'},
			],
		}}]);
		// Insert a notepad item after second notepad item
		list.push(['NP./2TEXT', {'type': 'addRemark'}]);
		// Insert a notepad item with V qualifier after third notepad item
		list.push(['NP./3V*TEXT', {'type': 'addRemark'}]);

		list.push(['*SD', {'type': 'requestedSeats'}]);
		list.push(['SA*S1', {'type': 'seatMap'}]);
		list.push(['S.NW', {'type': 'requestSeats', 'data': {
			'location': {'raw': 'W','parsed': 'window'},
		}}]);
		list.push(['S.NA', {'type': 'requestSeats', 'data': []}]);
		list.push(['S.S1/NW', {'type': 'requestSeats', 'data': []}]);
		list.push(['S.S1.2/NA', {'type': 'requestSeats', 'data': {
			'segNums': [1,2], 'location': {'parsed': 'aisle'},
		}}]);
		list.push(['S.P3/NW', {'type': 'requestSeats', 'data': []}]);
		list.push(['S.P2/NA', {'type': 'requestSeats', 'data': []}]);
		list.push(['S.P1S2/NW', {'type': 'requestSeats', 'data': {
			'paxRanges': [{'from': 1,'to': 1}],
			'segNums': [2], 'location': {'parsed': 'window'},
		}}]);
		list.push(['S.P1S2/NA', {'type': 'requestSeats', 'data': []}]);
		list.push(['S.P1S2/17A', {'type': 'requestSeats', 'data': []}]);
		list.push(['S.S2/17A/18C', {'type': 'requestSeats', 'data': {
			'segNums': [2], 'seatCodes': ['17A','18C'],
		}}]);
		list.push(['S.S2/17A.B', {'type': 'requestSeats', 'data': {
			'segNums': [2], 'seatCodes': ['17A','17B'],
		}}]);
		list.push(['S.@', {'type': 'cancelSeats', 'data': []}]);
		list.push(['S.S3@', {'type': 'cancelSeats', 'data': []}]);
		list.push(['S.P2S1@', {'type': 'cancelSeats', 'data': []}]);

		list.push(['M.UA12345678910', {'type': 'addFrequentFlyerNumber', 'data': {
			'mileagePrograms': [{'airline': 'UA','code': '12345678910','partners': []}],
		}}]);
		list.push(['M.UA12345678910/LH', {'type': 'addFrequentFlyerNumber'}]);
		list.push(['M.P1/UA12345678910', {'type': 'addFrequentFlyerNumber'}]);
		list.push(['M.P1/UA12345678910/LH', {'type': 'addFrequentFlyerNumber', 'data': {
			'majorPaxNum': '1', 'mileagePrograms': [
				{'airline': 'UA', 'code': '12345678910', 'partners': ['LH']},
			],
		}}]);
		list.push(['M.P2/TW123456LRG-AA423188DLM', {'type': 'addFrequentFlyerNumber', 'data': {
			'majorPaxNum': '2', 'mileagePrograms': [
				{'airline': 'TW','code': '123456LRG'},
				{'airline': 'AA','code': '423188DLM'},
			],
		}}]);
		list.push(['M.P1/UA12345876490/BD/LH/AC', {'type': 'addFrequentFlyerNumber', 'data': {
			'majorPaxNum': '1', 'mileagePrograms': [
				{'airline': 'UA', 'code': '12345876490', 'partners': ['BD','LH','AC']},
			],
		}}]);
		list.push(['M.P2*UA/TG/SK', {'type': 'addFrequentFlyerNumber', 'data': {
			'majorPaxNum': '2', 'isCrossAccrual': true,
			'mileagePrograms': [{'airline': 'UA','partners': ['TG','SK']}],
		}}]);
		list.push(['*MM', {'type': 'frequentFlyerData'}]);
		list.push(['M.@', {'type': 'changeFrequentFlyerNumber'}]);
		list.push(['M.P1@', {'type': 'changeFrequentFlyerNumber'}]);
		list.push(['M.AA@', {'type': 'changeFrequentFlyerNumber'}]);
		list.push(['M.P1*DL@', {'type': 'changeFrequentFlyerNumber'}]);
		list.push(['M.P1*DL/P2*AA@', {'type': 'changeFrequentFlyerNumber', 'data': {
			'passengers': [
				{'majorPaxNum': '1', 'airline': 'DL'},
				{'majorPaxNum': '2', 'airline': 'AA'},
			],
		}}]);
		list.push(['M.P1*KL/UK/NW@', {'type': 'changeFrequentFlyerNumber', 'data': {
			'passengers': [
				{'majorPaxNum': '1', 'airline': 'KL', 'partners': ['UK','NW']},
			],
		}}]);
		list.push(['M.P2*UA/ALL@', {'type': 'changeFrequentFlyerNumber', 'data': {
			'passengers': [
				{'majorPaxNum': '2', 'airline': 'UA', 'withAllPartners': true},
			],
		}}]);
		list.push(['L@LH/LFLH123/29APR', {'type': 'operationalInfo'}]);

		// availability command examples
		list.push(['A28SEPNYCMNL.12A.RDU/DL#/UA#@V', {'type': 'airAvailability',  'data': {
			'departureDate': {'raw': '28SEP', 'parsed': '09-28'},
			'departureAirport': 'NYC',
			'destinationAirport': 'MNL',
			'modifiers': [
				{'type': 'connection','raw': '.12A.RDU','parsed': null},
				{'type': 'airlines','raw': '/DL#/UA#','parsed': null},
				{'type': 'bookingClass', 'raw': '@V', 'parsed': {
					'seatCount': '','bookingClass': 'V',
				}},
			],
		}}]);
		list.push(['AJ20SEPKIVRIX', {'type': 'airAvailability'}]);
		list.push(['AJ20SEPKIVRIX.6P', {'type': 'airAvailability', 'data': {
			'orderBy': 'J',
			'departureDate': {'raw': '20SEP','parsed': '09-20'},
			'departureAirport': 'KIV',
			'destinationAirport': 'RIX',
			'modifiers': [
				{'type': 'connection','raw': '.6P','parsed': null},
			],
		}}]);
		list.push(['AJ20SEPKIVRIX/9U#/BT#/SU#', {'type': 'airAvailability'}]);
		list.push(['AJ20SEPNYCSFO.12A.MSP/UA#/AA#/DL#', {'type': 'airAvailability'}]);
		list.push(['AJ20SEPNYCSFO.12A.MSP.CHI/UA#/AA#', {'type': 'airAvailability'}]);
		list.push(['AJ20SEPKIVRIX/BT#', {'type': 'airAvailability'}]);
		list.push(['AJ20SEPKIVMOW.D0/9U#/SU#', {'type': 'airAvailability'}]);
		list.push(['AJ15SEPKIVMOW*S7', {'type': 'airAvailability'}]);
		list.push(['AJ15SEPKIVMOW.12A*S7', {'type': 'airAvailability'}]);
		list.push(['AM*S7', {'type': 'airAvailability'}]); // move down on direct link availability screen
		list.push(['AJ20SEPKIVRIX/9U-/BT-/SU-', {'type': 'airAvailability', 'data': {
			'orderBy': 'J',
			'departureDate': {'raw': '20SEP','parsed': '09-20'},
			'departureAirport': 'KIV',
			'destinationAirport': 'RIX',
			'modifiers': [
				{'type': 'airlines','raw': '/9U-/BT-/SU-','parsed': null},
			],
		}}]);
		list.push(['AJ20SEPLAXMNL/DL#@T', {'type': 'airAvailability'}]);
		list.push(['AJ17JULSFOJNB/DL#@8U', {'type': 'airAvailability'}]);
		list.push(['AJ20SEPLAXMNL.12A.SFO/DL#@T', {'type': 'airAvailability'}]);
		list.push(['AJ20SEPLAXMNL.12A.SFO/DL#@8T', {'type': 'airAvailability'}]);
		list.push(['AJ20SEPLAXMNL.12A.DTW-.SEA-', {'type': 'airAvailability'}]);
		list.push(['AJ20NOVSFOACC//*A', {'type': 'airAvailability'}]);
		list.push(['AJ20SEPSFOACC.12A.NYC//*S', {'type': 'airAvailability'}]);
		list.push(['AJ20SEPSFOACC.12A.NYC.AMS//*S', {'type': 'airAvailability',  'data': {
			'orderBy': 'J',
			'departureDate': {'raw': '20SEP','parsed': '09-20'},
			'departureAirport': 'SFO',
			'destinationAirport': 'ACC',
			'modifiers': [
				{'type': 'connection', 'raw': '.12A.NYC.AMS', 'parsed': null},
				{'type': 'allianceCode', 'raw': '//*S', 'parsed': 'S'},
			],
		}}]);
		list.push(['AJ20SEPSFOACC.12A.NYC//*S@K', {'type': 'airAvailability'}]);
		list.push(['AJ20SEPSFOACC.12A.NYC.AMS//*S@K', {'type': 'airAvailability'}]);
		// change departure date
		list.push(['A10SEP', {'type': 'airAvailability'}, {'data': {
			'departureDate': {'raw': '10SEP','parsed': '09-10'},
		}}]);
		// new avail with default departure and destination LOS
		list.push(['A15SEPLOS', {'type': 'airAvailability'}, {'data': {
			'departureDate': {'raw': '15SEP','parsed': '09-15'},
			'destinationAirport': 'LOS',
		}}]);
		list.push(['ALAX', {'type': 'airAvailability', 'data': {
			'isReturn': false,
			'destinationAirport': 'LAX',
		}}]);
		// return availability
		list.push(['AR10OCT', {'type': 'airAvailability', 'data': {
			'isReturn': true,
			'departureDate': {'raw': '10OCT','parsed': '10-10'},
		}}]);
		// return order by D
		list.push(['ADR10OCT', {'type': 'airAvailability', 'data': {
			'orderBy': 'D',
			'isReturn': true,
			'departureDate': {'raw': '10OCT', 'parsed': '10-10'},
		}}]);
		// R before D
		list.push(['ARD11OCT', {'type': 'airAvailability', 'data': {
			'orderBy': 'D',
			'isReturn': true,
			'departureDate': {'raw': '11OCT', 'parsed': '10-11'},
		}}]);
		// R after date
		list.push(['A12OCTR', {'type': 'airAvailability', 'data': {
			'isReturn': true,
			'departureDate': {'raw': '12OCT', 'parsed': '10-12'},
		}}]);
		// R and J after date
		list.push(['A12OCTRJ', {'type': 'airAvailability', 'data': {
			'orderBy': 'J',
			'isReturn': true,
			'departureDate': {'raw': '12OCT', 'parsed': '10-12'},
		}}]);
		// return order by J
		list.push(['AJR5OCT', {'type': 'airAvailability', 'data': {
			'orderBy': 'J',
			'isReturn': true,
			'departureDate': {'raw': '5OCT', 'parsed': '10-05'},
		}}]);
		// departure airport JFK, starts with J should not be treated as "order by J"
		list.push(['AJFKLON', {'type': 'airAvailability', 'data': {
			'isReturn': false,
			'departureAirport': 'JFK',
			'destinationAirport': 'LON',
		}}]);
		// with "order by J"
		list.push(['AJJFKLON', {'type': 'airAvailability', 'data': {
			'isReturn': false,
			'orderBy': 'J',
			'departureAirport': 'JFK',
			'destinationAirport': 'LON',
		}}]);
		// return with J
		list.push(['ARJ', {'type': 'airAvailability', 'data': {
			'isReturn': true,
			'orderBy': 'J',
		}}]);
		list.push(['AJ28SEPNYCMNL', {'type': 'airAvailability', 'data': {
			isReturn: false,
			orderBy: 'J',
			departureDate: {raw: '28SEP'},
			departureAirport: 'NYC',
			destinationAirport: 'MNL',
		}}]);
		// J between date and cities
		list.push(['A28SEPJNYCMNL', {'type': 'airAvailability', 'data': {
			'isReturn': false,
			'orderBy': 'J',
		}}]);

		list.push(['FQBB/.T15JUN17', {'type': 'priceItinerary', 'data': {
			'baseCmd': 'FQBB',
			'pricingModifiers': [
				{'raw': '.T15JUN17', 'type': 'ticketingDate'},
			],
		}}]);
		list.push(['FQ@VKXT5U0*JCB', {'type': 'priceItinerary', 'data': {
			'baseCmd': 'FQ',
			'pricingModifiers': [
				{'raw': '@VKXT5U0', 'type': 'segments'},
				{'raw': '*JCB', 'type': 'passengers'},
			],
		}}]);
		list.push(['FQBBP1.2*C05.3*INF++-BUSNS', {'type': 'priceItinerary', 'data': {
			'baseCmd': 'FQBB',
			'pricingModifiers': [
				{'raw': 'P1.2*C05.3*INF', 'type': 'passengers'},
				{'raw': '++-BUSNS', 'type': 'cabinClass'},
			],
		}}]);
		list.push(['FQBBP1*JCB.2*J05:EUR', {'type': 'priceItinerary', 'data': {
			'baseCmd': 'FQBB',
			'pricingModifiers': [
				{'raw': 'P1*JCB.2*J05', 'type': 'passengers'},
				{'raw': ':EUR', 'type': 'currency'},
			],
		}}]);
		list.push(['FQ.Y', {'type': 'priceItinerary', 'data': {
			'baseCmd': 'FQ',
			'pricingModifiers': [
				{'raw': '.Y', 'type': 'bookingClass'},
			],
		}}]);
		list.push(['FQ.GVADUB', {'type': 'priceItinerary', 'data': {
			'baseCmd': 'FQ',
			'pricingModifiers': [
				{'raw': '.GVADUB', 'type': 'pointOfSale', 'parsed': {
					'sellingCity': 'GVA',
					'ticketingCity': 'DUB',
				}},
			],
		}}]);
		list.push(['FQ:USD', {'type': 'priceItinerary', 'data': {
			'baseCmd': 'FQ',
			'pricingModifiers': [
				{'raw': ':USD', 'type': 'currency'},
			],
		}}]);
		list.push(['FQ::USD', {'type': 'priceItinerary', 'data': {
			'baseCmd': 'FQ',
			'pricingModifiers': [
				{'raw': '::USD', 'type': 'currency'},
			],
		}}]);
		list.push(['FQS1@LHXAN.2@LHWAN/CBA', {'type': 'priceItinerary', 'data': {
			'baseCmd': 'FQ',
			'pricingModifiers': [
				{'raw': 'S1@LHXAN.2@LHWAN', 'type': 'segments'},
				{'raw': 'CBA', 'type': 'validatingCarrier'},
			],
		}}]);
		// TODO: parse
		//list[] = ['FQTE-US*-RA', ['type' => 'priceItinerary', 'data' => [
		//    'baseCmd' => 'FQ',
		//    'pricingModifiers' => [
		//        ['raw' => 'TE-US*-RA', 'type' => 'exemptTaxes'],
		//    ],
		//]]];
		list.push(['FQ:AP', {'type': 'priceItinerary', 'data': {
			'baseCmd': 'FQ',
			'pricingModifiers': [
				{'raw': ':AP', 'type': 'ignoreRule'},
			],
		}}]);
		list.push(['FQP1.2*C05.3*INF.D', {'type': 'priceItinerary', 'data': {
			'baseCmd': 'FQ',
			'pricingModifiers': [
				{'raw': 'P1.2*C05.3*INF', 'type': 'passengers'},
				{'raw': '.D', 'type': 'bookingClass'},
			],
		}}]);
		list.push(['FQ@VKXT5U0*JCB', {'type': 'priceItinerary', 'data': {
			'baseCmd': 'FQ',
			'pricingModifiers': [
				{'raw': '@VKXT5U0', 'type': 'segments'},
				{'raw': '*JCB', 'type': 'passengers'},
			],
		}}]);
		// typo in command - should appear somewhere
		list.push(['FQBBP1*JCB.2*J05.3*JNF*++-BUSNS', {'type': 'priceItinerary', 'data': {
			'baseCmd': 'FQBB',
			'pricingModifiers': [
				{'raw': 'P1*JCB.2*J05.3*JNF', 'type': 'passengers'},
				{'raw': '*++-BUSNS', 'type': null},
			],
		}}]);

		list.push(['FD28NOV17NYCMNL.T12MAR17-RT/DL-M', {'type': 'fareSearch', 'data': {
			'departureDate': {'raw': '28NOV17'},
			'departureAirport': 'NYC',
			'destinationAirport': 'MNL',
			'modifiers': [
				{'type': 'ticketingDate', 'raw': '.T12MAR17'},
				{'type': 'tripType', 'raw': '-RT'},
				{'type': 'airlines', 'raw': '/DL'},
				{'type': 'bookingClass', 'raw': '-M'},
			],
		}}]);
		list.push(['FDNYC', {'type': 'fareSearch', 'data': {
			'destinationAirport': 'NYC',
		}}]);
		list.push(['FDV10DEC10FEBSFONYC', {'type': 'fareSearch', 'data': {
			'departureDate': {'raw': '10DEC'},
			'returnDate': {'raw': '10FEB'},
			'departureAirport': 'SFO',
			'destinationAirport': 'NYC',
			'modifiers': [],
		}}]);
		list.push(['FDSFONYC10DEC', {'type': 'fareSearch', 'data': {
			'departureDate': {'raw': '10DEC'},
			'departureAirport': 'SFO',
			'destinationAirport': 'NYC',
			'modifiers': [],
		}}]);
		list.push(['FDSFONYCV10DEC10FEB', {'type': 'fareSearch', 'data': {
			'departureDate': {'raw': '10DEC'},
			'returnDate': {'raw': '10FEB'},
			'departureAirport': 'SFO',
			'destinationAirport': 'NYC',
			'modifiers': [],
		}}]);
		list.push(['FD10DEC', {'type': 'fareSearch', 'data': {
			'departureDate': {'raw': '10DEC'},
			'modifiers': [],
		}}]);
		list.push(['FD', {'type': 'fareSearch', 'data': {
			'modifiers': [],
		}}]);
		list.push(['FD28NOV17NYCMNL.T12MAR17-RT-M/DL', {'type': 'fareSearch', 'data': {
			'departureDate': {'raw': '28NOV17'},
			'departureAirport': 'NYC',
			'destinationAirport': 'MNL',
			'modifiers': [
				{'type': 'ticketingDate', 'raw': '.T12MAR17'},
				{'type': 'tripType','raw': '-RT','parsed': 'RT'},
				{'type': 'bookingClass','raw': '-M','parsed': 'M'},
				{'type': 'airlines','raw': '/DL'},
			],
		}}]);
		list.push(['FDKIVRIXV20SEP05JUL:CAD', {'type': 'fareSearch', 'data': {
			'departureDate': {'raw': '20SEP','partial': '09-20'},
			'returnDate': {'raw': '05JUL','partial': '07-05'},
			'departureAirport': 'KIV',
			'destinationAirport': 'RIX',
			'modifiers': [{'type': 'currency','raw': ':CAD','parsed': 'CAD'}],
		}}]);
		list.push(['FD10SEPPITMIL/PS/TK/LO*ITX', {'type': 'fareSearch', 'data': {
			'departureDate': {'raw': '10SEP','partial': '09-10'},
			'departureAirport': 'PIT',
			'destinationAirport': 'MIL',
			'modifiers': [
				{'type': 'airlines','raw': '/PS/TK/LO'},
				{'type': 'ptc','raw': '*ITX'},
			],
		}}]);
		list.push(['FD15JANNYCIST:N', {'type': 'fareSearch', 'data': {
			'modifiers': [
				{'raw': ':N', 'type': 'fareType'},
			],
		}}]);
		list.push(['FDLONDEL14AUG-PRI-ASIA4-CHASE-EURO', {'type': 'fareSearch', 'data': {
			'departureAirport': 'LON',
			'destinationAirport': 'DEL',
			'departureDate': {'raw': '14AUG'},
			'modifiers': [
				{'type': 'accountCodes', 'parsed': ['ASIA4', 'CHASE', 'EURO']},
			],
		}}]);
		list.push(['FDLONWAS10OCT-PRI-TPACK:P/UA', {'type': 'fareSearch', 'data': {
			'departureAirport': 'LON',
			'destinationAirport': 'WAS',
			'departureDate': {'raw': '10OCT'},
			'modifiers': [
				{'type': 'accountCodes', 'parsed': ['TPACK']},
				{'type': 'fareType', 'parsed': 'private'},
				{'type': 'airlines','raw': '/UA','parsed': ['UA']},
			],
		}}]);
		list.push(['FD20SEPKIVRIX-RT@W', {'type': 'fareSearch', 'data': {
			'departureAirport': 'KIV',
			'destinationAirport': 'RIX',
			'departureDate': {'raw': '20SEP'},
			'modifiers': [
				{'type': 'tripType','raw': '-RT','parsed': 'RT'},
				{'type': 'cabinClass', 'raw': '@W', 'parsed': 'premium_economy'},
			],
		}}]);
		list.push(['FD20MAYRIXLAX@LN3XPB', {type: 'fareSearch', 'data': {
			departureAirport: 'RIX',
			destinationAirport: 'LAX',
			departureDate: {raw: '20MAY'},
			modifiers: [
				{type: 'fareBasis', raw: '@LN3XPB', parsed: 'LN3XPB'},
			],
		}}]);

		// pricing command with cabin class modifier: "||" should not be parsed as command separator
		// I wonder if it is safe to split bulk commands in Galileo by _non-repeating_ "|",
		// similar to how we do not split slashes in //@C modifier in Apollo
		list.push(['FQBB||-AB', {'type': 'priceItinerary', 'data': {
			'baseCmd': 'FQBB',
			'pricingModifiers': [
				{'raw': '||-AB', 'type': 'cabinClass', 'parsed': {raw: 'AB', parsed: 'sameAsBooked'}},
			],
		}}]);

		return list;
	}

	/**
	 * @test
	 * @dataProvider provideCommands
	 */
	testParser(cmd, expected)  {
		let actual = CmdParser.parse(cmd);
		try {
			this.assertArrayElementsSubset(expected, actual);
		} catch (exc) {
			throw exc;
		}
	}

	getTestMapping() {
		return [
			[this.provideCommands, this.testParser],
		];
	}
}
CmdParserTest.count = 0;
module.exports = CmdParserTest;
