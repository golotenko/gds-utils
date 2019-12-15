
const CommandParser = require('../../../../src/text_format_processing/sabre/commands/CmdParser.js');

class CmdParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js') {
	provideTestDumpList() {
		let $list;

		$list = [];

		$list.push([
			'*R',
			{'type': 'redisplayPnr'},
		]);

		$list.push([
			'9800-750-2238-A\u00A77TAW\/24DEC\u00A76LOGIN\u00A7ER',
			{
				'type': 'addAgencyPhone',
				'followingCommands': [
					{
						'type': 'addTicketingDateLimit',
					},
					{
						'type': 'addReceivedFrom',
					},
					{
						'type': 'storeKeepPnr',
					},
				],
			},
		]);

		$list.push([
			'5EDISON\/ID7218\/CREATED FOR EMMET\/ID21320\/REQ. ID-4730436\u00A79800-750-2238-A\u00A77TAW\/31MAY\u00A76EDISON\u00A7ER',
			{
				'type': 'addRemark',
				'followingCommands': [
					{
						'type': 'addAgencyPhone',
					},
					{
						'type': 'addTicketingDateLimit',
					},
					{
						'type': 'addReceivedFrom',
					},
					{
						'type': 'storeKeepPnr',
					},
				],
			},
		]);

		$list.push([
			'AAAASD',
			{
				'type': 'changePcc',
				'data': 'ASD',
			},
		]);

		// artifacts in a changePcc command - would fail in GDS, so type null
		$list.push([
			'AAADK7H.',
			{'type': null},
		]);

		$list.push([
			'*LQKTWT',
			{'type': 'openPnr', 'data': 'LQKTWT'},
		]);

		$list.push([
			'WPNC',
			{'type': 'priceItinerary', 'data': {'pricingModifiers': [{'raw': 'NC'}]}},
		]);

		$list.push(['WPNCB¥AUA', {
			'type': 'priceItinerary', 'data': {
				'pricingModifiers': [
					{'raw': 'NCB', 'type': 'lowestFareAndRebook'},
				],
			},
		}]);

		$list.push(['WPNCB¥MEUR', {
			'type': 'priceItinerary', 'data': {
				'pricingModifiers': [
					{'raw': 'NCB', 'type': 'lowestFareAndRebook'},
				],
			},
		}]);

		$list.push(['WPNCB¥PJCB', {
			'type': 'priceItinerary', 'data': {
				'pricingModifiers': [
					{'raw': 'NCB', 'type': 'lowestFareAndRebook'},
				],
			},
		}]);

		$list.push(['WPNCB¥P1ITX\/1I06\/1ITF', {
			'type': 'priceItinerary', 'data': {
				'pricingModifiers': [
					{'raw': 'NCB', 'type': 'lowestFareAndRebook'},
				],
			},
		}]);

		$list.push(['WPPC05¥NCB', {
			'type': 'priceItinerary', 'data': {
				'pricingModifiers': [
					{'raw': 'PC05', 'type': 'ptc'},
					{'raw': 'NCB', 'type': 'lowestFareAndRebook'},
				],
			},
		}]);

		$list.push(['WPP1JCB\/1J05¥NCB', {
			'type': 'priceItinerary', 'data': {
				'pricingModifiers': [
					{'raw': 'P1JCB\/1J05', 'type': 'ptc'},
					{'raw': 'NCB', 'type': 'lowestFareAndRebook'},
				],
			},
		}]);

		$list.push(['WPP1ADT\/1C05¥NCB¥S1\/2\/5\/6', {
			'type': 'priceItinerary', 'data': {
				'pricingModifiers': [
					{'raw': 'P1ADT\/1C05', 'type': 'ptc'},
					{'raw': 'NCB', 'type': 'lowestFareAndRebook'},
					{'raw': 'S1\/2\/5\/6', 'type': 'segments'},
				],
			},
		}]);

		$list.push(['WPRQ¥P3ADT\/1JCB', {
			'type': 'priceItinerary', 'data': {
				'pricingModifiers': [
					{'raw': 'RQ', 'type': 'createPriceQuote'},
					{'raw': 'P3ADT\/1JCB', 'type': 'ptc'},
				],
			},
		}]);

		$list.push(['WPPJCB¥RQ', {
			'type': 'priceItinerary', 'data': {
				'pricingModifiers': [
					{'raw': 'PJCB', 'type': 'ptc'},
					{'raw': 'RQ', 'type': 'createPriceQuote'},
				],
			},
		}]);

		$list.push([
			'WPRD*S1',
			{'type': 'fareList'},
		]);

		$list.push([
			'WPPADT', {
				'type': 'priceItinerary',
				'data': {
					'pricingModifiers': [
						{'type': 'ptc', 'parsed': [{'ptc': 'ADT'}]},
					],
				},
			},
		]);

		$list.push([
			'WPP1ADT\/2INF', {
				'type': 'priceItinerary',
				'data': {
					'pricingModifiers': [
						{
							'type': 'ptc', 'parsed': [
								{'quantity': 1, 'ptc': 'ADT'},
								{'quantity': 2, 'ptc': 'INF'},
							],
						},
					],
				},
			},
		]);

		$list.push([
			'WPPADT\/INF\/CNN', {
				'type': 'priceItinerary',
				'data': {
					'pricingModifiers': [
						{
							'type': 'ptc', 'parsed': [
								{'ptc': 'ADT'},
								{'ptc': 'INF'},
								{'ptc': 'CNN'},
							],
						},
					],
				},
			},
		]);

		// name select and ptc select
		$list.push([
			'WPN1.1\/1.2\/2.1¥P2ADT\/INF', {
				'type': 'priceItinerary',
				'data': {
					'pricingModifiers': [
						{
							'type': 'names', 'parsed': [
								{'fieldNumber': '1', 'firstNameNumber': '1'},
								{'fieldNumber': '1', 'firstNameNumber': '2'},
								{'fieldNumber': '2', 'firstNameNumber': '1'},
							],
						},
						{
							'type': 'ptc', 'parsed': [
								{'quantity': 2, 'ptc': 'ADT'},
								{'ptc': 'INF'},
							],
						},
					],
				},
			},
		]);

		// through name select
		$list.push([
			'WPN1.1-2.1¥PADT\/1C06\/INF', {
				'type': 'priceItinerary',
				'data': {
					'pricingModifiers': [
						{
							'type': 'names', 'parsed': [
								{
									'fieldNumber': '1',
									'firstNameNumber': '1',
									'through': {'fieldNumber': '2', 'firstNameNumber': '1'},
								},
							],
						},
						{
							'type': 'ptc', 'parsed': [
								{'quantity': null, 'ptc': 'ADT'},
								{'quantity': 1, 'ptc': 'C06'},
								{'quantity': null, 'ptc': 'INF'},
							],
						},
					],
				},
			},
		]);

		// multiple through ("1.1-2.1","4.1-5.1") and whole family ("6.0") name select
		$list.push([
			'WPN1.1-2.1\/4.1-5.1\/6.0¥P2ADT\/INF\/3CNN', {
				'type': 'priceItinerary',
				'data': {
					'pricingModifiers': [
						{
							'type': 'names', 'parsed': [
								{
									'fieldNumber': '1',
									'firstNameNumber': '1',
									'through': {'fieldNumber': '2', 'firstNameNumber': '1'},
								},
								{
									'fieldNumber': '4',
									'firstNameNumber': '1',
									'through': {'fieldNumber': '5', 'firstNameNumber': '1'},
								},
								{
									'fieldNumber': '6',
									'firstNameNumber': '0',
									'through': null,
								},
							],
						},
						{
							'type': 'ptc', 'parsed': [
								{'quantity': 2, 'ptc': 'ADT'},
								{'ptc': 'INF'},
								{'quantity': 3, 'ptc': 'CNN'},
							],
						},
					],
				},
			},
		]);

		$list.push(['QP\/66\/7', {'type': 'movePnrToQueue'}]);

		$list.push([
			'5ELDAR\/ID20744\/CREATED FOR VANCE\/ID8122\/REQ. ID-4777760', {
				'type': 'addRemark',
				'data': 'ELDAR\/ID20744\/CREATED FOR VANCE\/ID8122\/REQ. ID-4777760',
			},
		]);

		$list.push([
			'5RAINBOW\/ID3921\/CREATED FOR TORRES\/ID20488\/REQ. ID-4767812\u00A79800-750-2238-A\u00A77TAW\/10JUN\u00A76RAINBOW\u00A7ER', {
				'type': 'addRemark',
				'data': 'RAINBOW\/ID3921\/CREATED FOR TORRES\/ID20488\/REQ. ID-4767812',
				'followingCommands': [
					{'type': 'addAgencyPhone'},
					{'type': 'addTicketingDateLimit'},
					{'type': 'addReceivedFrom'},
					{'type': 'storeKeepPnr'},
				],
			},
		]);

		$list.push(['WPNI', {'type': 'lowFareSearchFromPnr'}]);
		$list.push(['WPNI\/ADLKLAF¥PJCB', {'type': 'lowFareSearchFromPnr'}]);
		// session 3494332
		$list.push(['WPPITX¥RR*BSAG¥NI', {'type': 'lowFareSearchFromPnr'}]);

		// this is invalid command caused by agent's typo
		$list.push(['**R', {'type': null}]);

		$list.push(['DKD415840020', {'type': 'addDkNumber', 'data': 'D415840020'}]);

		$list.push(['W¥PQ1', {'type': 'issueTickets'}]); // Ticket the specified PQ record
		$list.push(['W¥PQ1¥AUA¥FCHEQUE¥KP9', {'type': 'issueTickets'}]); // Ticket with PQ record and other optional ticketing qualifiers
		$list.push(['W¥PQ1N1.1-3.2\/5.1', {'type': 'issueTickets'}]); // Ticket a single PQ record with name selection
		$list.push(['W¥PQ2\/4\/7\/9', {'type': 'issueTickets'}]); // Ticket multiple PQ records
		$list.push(['W¥PQ5N1.3-1.5¥PQ6N2.1\/3.1', {'type': 'issueTickets'}]); // Ticket multiple PQ records with name selection
		$list.push(['W¥PQ1¥ER', {'type': 'issueTickets'}]); // Issue ticket with PQ record, end transaction and retrieve PNR

		// https://formatfinder.sabre.com/Quick-Look.aspx
		$list.push(['E', {'type': 'storePnr'}]); // End PNR transaction
		$list.push(['E*', {'type': 'storePnr'}]); // End and print a hardcopy of the PNR
		$list.push(['E¥Q7', {'type': 'storePnr'}]); // E¥Q(queue number where you want to place the message)

		$list.push(['EC', {'type': 'storeAndCopyPnr'}]); // 'copy', Clone a PNR and end transaction
		$list.push(['EC-7', {'type': 'storeAndCopyPnr'}]); // 'copy', EC-(number of days); End and clone itinerary for an ea
		$list.push(['EC¥7', {'type': 'storeAndCopyPnr'}]); // 'copy', EC¥(number of days); End and clone itinerary for an la
		$list.push(['EC*GIVE TO JUAN', {'type': 'storeAndCopyPnr'}]); // 'copy', End and clone itinerary and print a hardcopy of the or
		$list.push(['EC¥22NOV', {'type': 'storeAndCopyPnr'}]); // 'copy', EC¥(date as DDMMM); End and clone itinerary for a spec
		$list.push(['ECAPD,B3,XH,¥4,*', {'type': 'storeAndCopyPnr'}]); // 'copy', ECA(Passenger Data Field Code),B(new date entry),X(seg
		$list.push(['ECAPD', {'type': 'storeAndCopyPnr'}]); // 'copy', End and clone itinerary and all passenger data fields
		$list.push(['ECB2,QP\/50\/11', {'type': 'storeAndCopyPnr'}]); // 'copy', ECB(new number in party),QP/(queue number)/(prefatory
		$list.push(['ECB4', {'type': 'storeAndCopyPnr'}]); // 'copy', End and clone itinerary with new number of passengers
		$list.push(['ECQP\/B4T050\/11', {'type': 'storeAndCopyPnr'}]); // 'copy', End and clone PNR and queue place
		$list.push(['ECR', {'type': 'storeAndCopyPnr'}]); // 'copy', End PNR, clone and  note the record locator of the ori
		$list.push(['ECR,B2,¥2', {'type': 'storeAndCopyPnr'}]); // 'copy', End and clone PNR and add OSI, for different number in
		$list.push(['ECX1-3\/6', {'type': 'storeAndCopyPnr'}]); // 'copy', End and clone itinerary segments with exceptions of se

		$list.push(['EFPT1N1.1', {'type': 'storePnr'}]); // End PNR and simultaneously modify future proc. line
		$list.push(['EL', {'type': 'storePnr'}]); // End current PNR while working on queue and leave that

		$list.push(['EM', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send e-mail using the address in the PE fi
		$list.push(['EM¥N2.1¥RR¥PH', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send e-mail with optional requests
		$list.push(['EM¥A2', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send e-mail to specified e-mail address
		$list.push(['EMI', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End Passenger Name Record (PNR) and send e-invoice adv
		$list.push(['EMT', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send electronic ticket notification to all
		$list.push(['EMT¥A2-5', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send electronic ticket notification to a r
		$list.push(['EMT¥A2', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send electronic ticket notification to add
		$list.push(['EMT¥A2\/4\/5', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send electronic ticket notification to mul
		$list.push(['EMT¥N0.0', {'type': 'storePnrSendEmail'}]); // 'sendEmail', Send an e-mail for all addresses in a PNR
		$list.push(['EMT¥N1.1', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send electronic ticket notification for na
		$list.push(['EMT¥N1.3', {'type': 'storePnrSendEmail'}]); // 'sendEmail', Send  the eTicket e-mail for passenger 1.3
		$list.push(['EMT¥N5.0', {'type': 'storePnrSendEmail'}]); // 'sendEmail', Send an e-mail for all passengers in a name field
		$list.push(['EMT¥PH', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send electronic ticket notification with h
		$list.push(['EMT¥RR', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send e-mail with request for return receip
		$list.push(['EMTP¥N2.0', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send a confirmation message with a PDF tic
		$list.push(['EMTP¥N2.1', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send a confirmation message with a PDF tic
		$list.push(['EMX', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send an e-mail with a text copy of the iti
		$list.push(['EMX¥S1\/4', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send e-mail with a text copy of the itiner
		$list.push(['EMX¥S1', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send e-mail with a text copy of the itiner
		$list.push(['EMXP', {'type': 'storePnrSendEmail'}]); // 'sendEmail', End PNR and send a confirmation message with a PDF ver
		$list.push(['EMXP¥A2', {'type': 'storePnrSendEmail'}]); // 'sendEmail', EMXP¥A(item number in PE field
		$list.push(['EMIR', {'type': 'storePnrSendEmail'}]); // End Passenger Name Record (PNR) and send e-invoice
		$list.push(['EMIR¥N1.2¥A1-3', {'type': 'storePnrSendEmail'}]); // End Passenger Name Record (PNR) and send e-invoice

		$list.push(['EP', {'type': 'storePnr'}]); // End transaction and place a PNR at the front of the PO)
		$list.push(['EW', {'type': 'storePnr'}]); // End PNR and update schedule changes
		$list.push(['EW', {'type': 'storePnr'}]); // End, update schedule changes and remove the PNR from q
		$list.push(['EW¥', {'type': 'storePnr'}]); // End and issue the ticket
		$list.push(['EW¥CP*SYHENG', {'type': 'storePnr'}]); // End the transaction and clone the Phase IV ticket reco
		$list.push(['EWL', {'type': 'storePnr'}]); // End, update schedule changes and leave the PNR on queu

		$list.push(['EMTR¥N1.1', {'type': 'storePnrSendEmail'}]); // End PNR and send electronic ticket notification to nam
		$list.push(['EMR', {'type': 'storePnrSendEmail'}]); // End PNR and send e-mail and redisplay the PNR
		$list.push(['EMTR', {'type': 'storePnrSendEmail'}]); // End PNR and send electronic ticket notification an
		$list.push(['EMTR¥N1.2¥A1-3', {'type': 'storePnrSendEmail'}]); // End, send e-mail notification for name 1.2 at PE a
		$list.push(['EMXPR', {'type': 'storePnrSendEmail'}]); // End PNR and send a confirmation message with a PDF
		$list.push(['EMXR', {'type': 'storePnrSendEmail'}]); // End PNR and send e-mail with a text copy of the it
		$list.push(['EWR', {'type': 'storeKeepPnr'}]); // End, update schedule changes and redisplay the PNR
		$list.push(['ER', {'type': 'storeKeepPnr'}]); // End PNR transaction and redisplay the PNR
		$list.push(['ER*IB', {'type': 'storeKeepPnr'}]); // End and redisplay selected itinerary segments (exa
		$list.push(['ER*P9', {'type': 'storeKeepPnr'}]); // End and redisplay with select passenger data field
		$list.push(['ER*N*T*FF', {'type': 'storeKeepPnr'}]); // End and redisplay selected PNR fields
		$list.push(['ER*I', {'type': 'storeKeepPnr'}]); // End and redisplay all itinerary segments

		$list.push(['ECAP91-3,AP57,AN,XI', {'type': 'storeAndCopyPnr'}]); // End and clone the phone fields one throug
		$list.push(['ECQP\/50\/11¥B4T09\/7¥A0B0100\/11', {'type': 'storeAndCopyPnr'}]); // End PNR, clone and queue place to multipl
		$list.push(['E*(THIS IS YOUR COPY)', {'type': 'storePnr'}]); // End and print a hardcopy of the PNR with
		$list.push(['E*THIS IS YOUR COPY', {'type': 'storePnr'}]); // End transaction and print hardcopy of rec
		$list.push(['EMX¥S1\/4¥N1.2¥RR¥PH', {'type': 'storePnrSendEmail'}]); // End PNR and send e-mail with a text copy
		$list.push(['EMX¥S1-3\/5¥N1.1¥A2', {'type': 'storePnrSendEmail'}]); // End PNR and send e-mail with a text copy
		$list.push(['ER*P9*3*P6*P5*2,5*IA', {'type': 'storeKeepPnr'}]); // ER*(passenger data code)*(Itinerary s
		$list.push(['ER*P9*3*P6*P5*2,5*P7', {'type': 'storeKeepPnr'}]); // ER*(passenger data code)*(passenger d

		// following were checked manually
		$list.push(['ELR', {'type': 'storePnr'}]); // "R" after "L" is simply ignored
		$list.push(['ERL', {'type': 'storeKeepPnr'}]); // "L" after "R" is simply ignored
		$list.push(['EX', {'type': 'storePnr'}]); // "E" allows any amount of random characters after it

		$list.push(['IA', {'type': 'ignore'}]);

		// change remark text
		$list.push(['59\u00A4YOU MUST BRING YOUR PHOTO ID', {
			'type': 'changePnrRemarks',
			'data': {
				'ranges': [
					{'from': '9', 'to': '9'},
				],
				'newText': 'YOU MUST BRING YOUR PHOTO ID',
			},
		}]);

		// delete remarks
		$list.push(['53\u00A4', {
			'type': 'changePnrRemarks',
			'data': {
				'ranges': [
					{'from': '3', 'to': '3'},
				],
			},
		}]);

		// delete remarks - thru-selection
		$list.push(['59-12\u00A4', {
			'type': 'changePnrRemarks',
			'data': {
				'ranges': [
					{'from': '9', 'to': '12'},
				],
			},
		}]);

		// delete remarks - specific lines
		$list.push(['59,12\u00A4', {
			'type': 'changePnrRemarks',
			'data': {
				'ranges': [
					{'from': '9', 'to': '9'},
					{'from': '12', 'to': '12'},
				],
			},
		}]);

		// delete remark in a bulk command
		$list.push(['-LIBERMANE\/MARINA\u00A751-3\u00A4\u00A7*R', {
			'type': 'addName',
			'followingCommands': [
				{
					'type': 'changePnrRemarks', 'data': {
						'ranges': [
							{'from': '1', 'to': '3'},
						],
					},
				},
				{'type': 'redisplayPnr'},
			],
		}]);

		$list.push(['PE*6IIF', {'type': 'lniataList'}]);
		$list.push(['PE¥E.RZAEV@ITNCORP.COM', {'type': 'addEmail'}]);
		$list.push(['PE\u00A4¥JOHN SMITH@IBM.COM¥', {'type': 'changeEmail'}]);
		$list.push(['PE1,3,4\u00A4', {'type': 'changeEmail'}]);

		// with $25 discount
		$list.push(['WPPC05¥Q\/\/DA25', {
			'type': 'priceItinerary',
			'data': {
				'pricingModifiers': [
					{'raw': 'PC05'},
					{'raw': 'Q\/\/DA25'},
				],
			},
		}]);

		// segment select and $25 discount with "*"
		$list.push(['WPS1\/2-3*Q\/\/DA25', {
			'type': 'priceItinerary',
			'data': {
				'pricingModifiers': [
					{
						'raw': 'S1\/2-3*Q\/\/DA25',
						'type': 'segments',
						'parsed': {'segmentNumbers': [1, 2, 3]},
					},
				],
			},
		}]);

		// with segment select
		$list.push(['WPS1\/2\/5\/6¥NC¥PJCB', {
			'type': 'priceItinerary',
			'data': {
				'pricingModifiers': [
					{
						'raw': 'S1\/2\/5\/6',
						'type': 'segments',
						'parsed': {'segmentNumbers': [1, 2, 5, 6]},
					},
					{'raw': 'NC', 'type': 'lowestFare'},
					{'raw': 'PJCB', 'type': 'ptc', 'parsed': [{'ptc': 'JCB'}]},
				],
			},
		}]);

		// two segment modifiers, this is a valid pricing command
		$list.push(['WPS1*Q\/\/DA25¥S2*Q\/\/DA50', {
			'type': 'priceItinerary',
			'data': {
				'pricingModifiers': [
					{
						'raw': 'S1*Q\/\/DA25', 'type': 'segments',
						'parsed': {'segmentNumbers': [1]},
					},
					{
						'raw': 'S2*Q\/\/DA50', 'type': 'segments',
						'parsed': {'segmentNumbers': [2]},
					},
				],
			},
		}]);

		// mark segments as side trip - this is not segment select
		$list.push(['WPST3-4¥NC', {
			'type': 'priceItinerary',
			'data': {
				'pricingModifiers': [
					{'raw': 'ST3-4', 'type': 'sideTrip'},
					{'raw': 'NC', 'type': 'lowestFare'},
				],
			},
		}]);

		// multiple segments with discount
		$list.push(['WPS1\/2-3*Q\/\/DA25', {
			'type': 'priceItinerary',
			'data': {
				'pricingModifiers': [
					{
						'raw': 'S1\/2-3*Q\/\/DA25',
						'type': 'segments',
						'parsed': {'segmentNumbers': [1, 2, 3]},
					},
				],
			},
		}]);

		$list.push(['WC¥1', {'type': 'sellFromLowFareSearch'}]);
		$list.push(['WC¥1X', {'type': 'sellFromLowFareSearch'}]);

		$list.push(['WC1F', {'type': 'changeBookingClass', data: {
			segments: [{segmentNumber: 1, bookingClass: 'F'}],
		}}]);
		$list.push(['WCAF', {'type': 'changeBookingClass'}]);
		$list.push(['WC1-3B', {'type': 'changeBookingClass', data: {
			segments: [
				{segmentNumber: 1, bookingClass: 'B'},
				{segmentNumber: 2, bookingClass: 'B'},
				{segmentNumber: 3, bookingClass: 'B'},
			],
		}}]);
		$list.push(['WC2B\/3N', {'type': 'changeBookingClass', data: {
			segments: [
				{segmentNumber: 2, bookingClass: 'B'},
				{segmentNumber: 3, bookingClass: 'N'},
			],
		}}]);
		$list.push(['WC1Y/3-4Y', {'type': 'changeBookingClass', data: {
			segments: [
				{segmentNumber: 1, bookingClass: 'Y'},
				{segmentNumber: 3, bookingClass: 'Y'},
				{segmentNumber: 4, bookingClass: 'Y'},
			],
		}}]);
		// not a 'changeBookingClass' actually, but oh well...
		$list.push(['WC¥1', {'data': null}]);

		// session id: 2000908
		$list.push(['317\u00A4', {'type': 'changeSsr'}]);
		$list.push(['3DOCS\/DB\/19APR16\/F\/DHANJU\/AMREEN KAUR-1.1', {'type': 'addSsrDocs'}]);

		// session id: 1407440
		$list.push(['41\u00A4', {'type': 'changeSsrNative'}]);
		$list.push(['4DOCSA\/DB\/29SEP76\/M\/AGUERORODRIGUEZ\/PABEL-1.1', {'type': 'addSsrDocs'}]);

		$list.push(['44,7\u00A4', {'type': 'changeSsrNative'}]);
		$list.push(['RD4*16', {'type': 'fareRulesFromList'}]);
		$list.push(['JR.DAY\/S-OYCEB12JUL\/S-OYDAY22AUG', {'type': 'lowFareSearch'}]);
		$list.push(['JR.LAX\/S-OYBUH27JUN\/S-OYLAX14JUL', {'type': 'lowFareSearch'}]);

		$list.push(['JR', {'type': 'createLowFareSearchProfile'}]);
		$list.push(['JR*', {'type': 'redisplayLowFareSearchProfile'}]);
		$list.push(['JRP*', {'type': 'redisplayLowFareSearch'}]);
		$list.push(['JRC', {'type': 'cancelLowFareSearchProfile'}]);
		$list.push(['*PQ4', {'type': 'storedPricingByNumber'}]);
		$list.push(['D1', {'type': 'divideBooking'}]);
		$list.push(['F', {'type': 'fileDividedBooking'}]);
		$list.push(['RB1KP', {'type': 'showBookingClassOfFare'}]);

		$list.push(['JR01', {'type': 'sellFromLowFareSearch'}]);
		$list.push(['JR03', {'type': 'sellFromLowFareSearch'}]);

		$list.push(['WPPL¥QVK4S9EU', {
			'type': 'priceItinerary',
			'data': {
				'pricingModifiers': [
					{'raw': 'PL', 'type': 'fareType', 'parsed': 'public'},
					{'raw': 'QVK4S9EU', 'type': 'fareBasis', 'parsed': 'VK4S9EU'},
				],
			},
		}]);

		$list.push(['FFUA12345678910-1.1', {
			'type': 'addFrequentFlyerNumber', 'data': {
				'airline': 'UA', 'code': '12345678910',
				'majorPaxNum': '1', 'minorPaxNum': '1',
			},
		}]);
		$list.push(['FFUA12345678910\/LH', {'type': 'addFrequentFlyerNumber'}]);
		$list.push(['FFUA12345678910-1.1', {'type': 'addFrequentFlyerNumber'}]);
		$list.push(['FFUA12345678910\/LH-1.1', {'type': 'addFrequentFlyerNumber'}]);
		$list.push(['FFAA987654321\/CX-HOFFMAN\/REICHE', {
			'type': 'addFrequentFlyerNumber', 'data': {
				'airline': 'AA', 'code': '987654321',
				'paxName': 'HOFFMAN\/REICHE',
			},
		}]);
		$list.push(['FFAA987654321\/CX,AS,EI,QF-2.2', {
			'type': 'addFrequentFlyerNumber', 'data': {
				'airline': 'AA', 'code': '987654321',
				'partners': ['CX', 'AS', 'EI', 'QF'],
				'majorPaxNum': '2', 'minorPaxNum': '2',
			},
		}]);
		$list.push(['FFAA987654321\/1,2-2.3', {
			'type': 'addFrequentFlyerNumber', 'data': {
				'airline': 'AA', 'code': '987654321', 'segNums': [1, 2],
				'majorPaxNum': '2', 'minorPaxNum': '3',
			},
		}]);
		$list.push(['*FF', {'type': 'frequentFlyerData'}]);
		$list.push(['FF\u00A4ALL', {'type': 'changeFrequentFlyerNumber'}]);
		$list.push(['FF1\u00A4', {'type': 'changeFrequentFlyerNumber'}]);
		$list.push(['2LH123\/29APR', {'type': 'operationalInfo'}]);

		//$list[] = ['FQ*DLON'                              , ['type' => 'fareSearch', 'data' => ['departureAirport' => 'LON']]];
		$list.push(['FQLONORL6AUG¥RT¥PL', {
			'type': 'fareSearch',
			'data': {'departureAirport': 'LON', 'destinationAirport': 'ORL', 'departureDate': {'raw': '6AUG'}},
		}]);
		$list.push(['FQLOSLBA4AUG¥RR*BSAG', {
			'type': 'fareSearch',
			'data': {'departureAirport': 'LOS', 'destinationAirport': 'LBA', 'departureDate': {'raw': '4AUG'}},
		}]);
		$list.push(['FQSTNIST6AUG', {
			'type': 'fareSearch',
			'data': {'departureAirport': 'STN', 'destinationAirport': 'IST', 'departureDate': {'raw': '6AUG'}},
		}]);
		$list.push(['FQLGWSAN7OCT', {
			'type': 'fareSearch',
			'data': {'departureAirport': 'LGW', 'destinationAirport': 'SAN', 'departureDate': {'raw': '7OCT'}},
		}]);
		$list.push(['FQLONCLT29AUG¥RT¥PITX¥RR*BSAG', {
			'type': 'fareSearch', 'data': {
				'departureAirport': 'LON',
				'destinationAirport': 'CLT',
				'departureDate': {'raw': '29AUG'},
				'modifiers': [
					{'type': 'tripType', 'raw': '¥RT', 'parsed': 'RT'},
					{'type': 'ptc', 'raw': '¥PITX', 'parsed': 'ITX'},
					{'type': 'accountCode', 'raw': '¥RR*BSAG', 'parsed': 'BSAG'},
				],
			},
		}]);
		$list.push(['FQLONDFW10OCT¥RR*BSAG¥PITX', {
			'type': 'fareSearch',
			'data': {'departureAirport': 'LON', 'destinationAirport': 'DFW', 'departureDate': {'raw': '10OCT'}},
		}]);
		$list.push(['FQATLDFW18NOV-AA', {
			'type': 'fareSearch',
			'data': {'departureAirport': 'ATL', 'destinationAirport': 'DFW', 'departureDate': {'raw': '18NOV'}},
		}]);
		$list.push(['FQDXBNYC04NOV-DI¥OW', {
			'type': 'fareSearch',
			'data': {'departureAirport': 'DXB', 'destinationAirport': 'NYC', 'departureDate': {'raw': '04NOV'}},
		}]);
		$list.push(['FQMANHOU27MAR', {
			'type': 'fareSearch',
			'data': {'departureAirport': 'MAN', 'destinationAirport': 'HOU', 'departureDate': {'raw': '27MAR'}},
		}]);
		$list.push(['FQEDILEX11AUGBB¥RT', {
			'type': 'fareSearch', 'data': {
				'departureAirport': 'EDI',
				'destinationAirport': 'LEX',
				'departureDate': {'raw': '11AUG'},
				'modifiers': [
					{'type': 'cabinClass', 'raw': 'BB', 'parsed': 'business'},
					{'type': 'tripType', 'raw': '¥RT', 'parsed': 'RT'},
				],
			},
		}]);
		$list.push(['FQLONORL11AUG-VS', {
			'type': 'fareSearch',
			'data': {'departureAirport': 'LON', 'destinationAirport': 'ORL', 'departureDate': {'raw': '11AUG'}},
		}]);
		$list.push(['FQATHNYC26AUGBB-DY¥OW', {
			'type': 'fareSearch',
			'data': {'departureAirport': 'ATH', 'destinationAirport': 'NYC', 'departureDate': {'raw': '26AUG'}},
		}]);
		$list.push(['FQTLVCHI06NOV-DY', {
			'type': 'fareSearch',
			'data': {'departureAirport': 'TLV', 'destinationAirport': 'CHI', 'departureDate': {'raw': '06NOV'}},
		}]);
		$list.push(['FQ27APR18NBOJFK02MAY18-BA¥PL¥RT¥BQ', {
			'type': 'fareSearch',
			'data': {
				'ticketingDate': {'raw': '27APR18'},
				'departureAirport': 'NBO',
				'destinationAirport': 'JFK',
				'departureDate': {'raw': '02MAY18'},
			},
		}]);
		$list.push(['FQ07JUN18MEMLAS10AUG18¥PADT-AA¥PL¥BG', {
			'type': 'fareSearch', 'data': {
				'ticketingDate': {'raw': '07JUN18'},
				'departureAirport': 'MEM',
				'destinationAirport': 'LAS',
				'departureDate': {'raw': '10AUG18'},
				'modifiers': [
					{'type': 'ptc', 'raw': '¥PADT', 'parsed': 'ADT'},
					{'type': 'airlines', 'raw': '-AA', 'parsed': ['AA']},
					{'type': 'fareType', 'raw': '¥PL', 'parsed': 'public'},
					{'type': 'bookingClass', 'raw': '¥BG', 'parsed': 'G'},
				],
			},
		}]);
		$list.push(['FQ26JUL18ATLDFW02SEP18-AA', {
			'type': 'fareSearch',
			'data': {
				'ticketingDate': {'raw': '26JUL18'},
				'departureAirport': 'ATL',
				'destinationAirport': 'DFW',
				'departureDate': {'raw': '02SEP18'},
			},
		}]);
		$list.push(['FQ07JUN18LONMEM06AUG18¥PADT-UA¥PL¥BV', {
			'type': 'fareSearch',
			'data': {
				'ticketingDate': {'raw': '07JUN18'},
				'departureAirport': 'LON',
				'destinationAirport': 'MEM',
				'departureDate': {'raw': '06AUG18'},
			},
		}]);
		$list.push(['FQ27APR18NBONYC05AUG18-BA¥BK', {
			'type': 'fareSearch',
			'data': {
				'ticketingDate': {'raw': '27APR18'},
				'departureAirport': 'NBO',
				'destinationAirport': 'NYC',
				'departureDate': {'raw': '05AUG18'},
			},
		}]);
		$list.push(['FQ11JUL18EWRACC23AUG18CB¥BH-ET', {
			'type': 'fareSearch',
			'data': {
				'ticketingDate': {'raw': '11JUL18'},
				'departureAirport': 'EWR',
				'destinationAirport': 'ACC',
				'departureDate': {'raw': '23AUG18'},
			},
		}]);
		// from multi-pcc tariff test case
		$list.push(['FQABZMSP18MAR¥RR*BSAG¥PITX', {
			'type': 'fareSearch',
			'data': {
				'departureAirport': 'ABZ',
				'destinationAirport': 'MSP',
				'departureDate': {'raw': '18MAR'},
				'modifiers': [
					{'raw': '¥RR*BSAG'},
					{'raw': '¥PITX'},
				],
			},
		}]);
		// with fare basis
		$list.push(['FQRIXLAX20MAY¥QLN3XPB', {
			'type': 'fareSearch',
			'data': {
				'departureAirport': 'RIX',
				'destinationAirport': 'LAX',
				'departureDate': {'raw': '20MAY'},
				'modifiers': [
					{raw: '¥QLN3XPB', type: 'fareBasis', parsed: 'LN3XPB'},
				],
			},
		}]);
		// with return date
		$list.push(['FQORDDEL15DEC¥R05JANBB', {
			'type': 'fareSearch',
			'data': {
				'departureAirport': 'ORD',
				'destinationAirport': 'DEL',
				'departureDate': {'raw': '15DEC'},
				'modifiers': [
					{raw: '¥R05JAN', type: 'returnDate'},
					{raw: 'BB', type: 'cabinClass'},
				],
			},
		}]);
		$list.push(['FQSFOBGI24NOV¥R29NOV', {
			'type': 'fareSearch',
			'data': {
				'departureAirport': 'SFO',
				'destinationAirport': 'BGI',
				'departureDate': {'raw': '24NOV'},
				'modifiers': [
					{raw: '¥R29NOV', type: 'returnDate'},
				],
			},
		}]);
		$list.push(['FQSFOBGI24NOV¥R29NOV¥RR*BSAG', {
			'type': 'fareSearch',
			'data': {
				'departureAirport': 'SFO',
				'destinationAirport': 'BGI',
				'departureDate': {'raw': '24NOV'},
				'modifiers': [
					{raw: '¥R29NOV', type: 'returnDate'},
					{raw: '¥RR*BSAG', type: 'accountCode'},
				],
			},
		}]);
		// invalid tariff cmd - departure date can't be before airports in Sabre
		$list.push(['FQ10MAYJFKMNL', {
			'type': 'fareSearch',
			'data': null,
		}]);

		// valid format - there may be more than one ¥N*.1¥ modifier
		$list.push(['WPN1¥N2¥PADT\/C05\/C04¥N3', {
			'type': 'priceItinerary', 'data': {
				'baseCmd': 'WP',
				'pricingModifiers': [
					{'raw': 'N1', 'type': 'names', 'parsed': [{'fieldNumber': '1', 'firstNameNumber': '0'}]},
					{'raw': 'N2', 'type': 'names', 'parsed': [{'fieldNumber': '2', 'firstNameNumber': '0'}]},
					{
						'raw': 'PADT\/C05\/C04',
						'type': 'ptc',
						'parsed': [
							{'ptc': 'ADT'},
							{'ptc': 'C05'},
							{'ptc': 'C04'},
						],
					},
					{'raw': 'N3', 'type': 'names', 'parsed': [{'fieldNumber': '3', 'firstNameNumber': '0'}]},
				],
			},
		}]);

		$list.push(['WPNC¥FXD', {
			'type': 'priceItinerary', 'data': {
				'baseCmd': 'WP',
				'pricingModifiers': [
					{'raw': 'NC', 'type': 'lowestFare'},
					{'raw': 'FXD', 'type': 'forceProperEconomy'},
				],
			},
		}]);

		$list.push(['WPNC¥MPC-ANY', {
			'type': 'priceItinerary', 'data': {
				'baseCmd': 'WP',
				'pricingModifiers': [
					{'raw': 'NC', 'type': 'lowestFare'},
					{
						'raw': 'MPC-ANY', 'type': 'maxPenaltyForChange', 'parsed': {
							'value': 'ANY',
						},
					},
				],
			},
		}]);

		$list.push(['WPP0ADT/0C05/0INF', {
			'type': 'priceItinerary', 'data': {
				'baseCmd': 'WP',
				'pricingModifiers': [
					{'raw': 'P0ADT/0C05/0INF', 'type': 'ptc'},
				],
			},
		}]);

		// pricing command with 2 segment selects and fare bases
		$list.push(['WPS1/2*QVE7N¥S3/4*QY26', {
			type: 'priceItinerary',
			data: {
				pricingModifiers: [
					{type: 'segments', parsed: {
						segmentNumbers: [1,2],
						fareBasis: 'VE7N',
					}},
					{type: 'segments', parsed: {
						segmentNumbers: [3,4],
						fareBasis: 'Y26',
					}},
				],
			},
		}]);

		$list.push(['¤E§OIATH', {
			'type': 'changeArea',
			'data': 'E',
			'followingCommands': [
				{'cmd': 'OIATH'},
			],
		}]);

		$list.push(['SO', {
			'type': 'signOut',
		}]);
		$list.push(['1*C', {type: 'moreAirAvailability'}]);
		$list.push(['110AUGCDGORD12JFK¥AYAA¥*UA¥', {
			type: 'airAvailability',
			data: {
				departureDate: {raw: '10AUG'},
				departureAirport: 'CDG',
				destinationAirport: 'ORD',
				departureTimeRange: {raw: '12'},
				connections: [
					{airport: 'JFK'},
				],
				modifiers: [
					{type: 'legs', parsed: [
						{exclude: false, airlines: ['AY', 'AA']},
						{exclude: true, airlines: ['UA']},
						{},
					]},
				],
			},
		}]);

		$list.push(['112NOVHNLLON8ALAX/JFK', {
			type: 'airAvailability',
			data: {
				departureDate: {raw: '12NOV'},
				departureAirport: 'HNL',
				destinationAirport: 'LON',
				departureTimeRange: {raw: '8A'},
				connections: [
					{airport: 'LAX'},
					{airport: 'JFK'},
				],
			},
		}]);

		$list.push(['121APRLAXLHR1201A-1159PDFW000-960/NYC000-960', {
			type: 'airAvailability',
			data: {
				departureDate: {raw: '21APR'},
				departureAirport: 'LAX',
				destinationAirport: 'LHR',
				departureTimeRange: {raw: '1201A-1159P'},
				connections: [
					{
						airport: 'DFW',
						minConnectionTimeRange: {raw: '000-960'},
					},
					{
						airport: 'NYC',
						minConnectionTimeRange: {raw: '000-960'},
					},
				],
			},
		}]);

		$list.push(['1S22JULJFKLGW¥DI-P', {
			type: 'airAvailability',
			data: {
				scan: true,
				departureDate: {raw: '22JUL'},
				departureAirport: 'JFK',
				destinationAirport: 'LGW',
				modifiers: [
					{type: 'legs', parsed: [{airlines: ['DI']}]},
					{type: 'bookingClass', parsed: {bookingClass: 'P'}},
				],
			},
		}]);

		return $list;
	}

	/**
	 * @test
	 * @dataProvider provideTestDumpList
	 */
	testParserOutputAgainstTree(dump, expected) {
		const actual = CommandParser.parse(dump);
		this.assertArrayElementsSubset(expected, actual);
	}

	getTestMapping() {
		return [
			[this.provideTestDumpList, this.testParserOutputAgainstTree],
		];
	}
}

module.exports = CmdParserTest;
