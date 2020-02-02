const Parse_fareSearch = require('../../../../src/text_format_processing/apollo/commands/Parse_fareSearch.js');
const CommandParser = require('../../../../src/text_format_processing/apollo/commands/CmdParser.js');

const provide_parse = () => {
	const testCases = [];

	testCases.push({
		title: 'rebook all to different class',
		input: 'XA/0B',
		output: {
			type: 'deletePnrField',
			data: {
				field: 'itinerary',
				applyToAllAir: true,
				sell: {
					sellType: 'rebookAll',
					bookingClasses: ['B'],
				},
			},
		},
	});
	testCases.push({
		title: 'Request to rebook to multiple classes. Has a tendency to cause bugs in Apollo',
		input: 'X3/0YN',
		output: {
			type: 'deletePnrField',
			data: {
				field: 'itinerary',
				segmentNumbers: [3],
				sell: {
					sellType: 'rebookAll',
					bookingClasses: ['Y', 'N'],
				},
			},
		},
	});
	testCases.push({
		title: 'rebook to different date',
		input: 'X3/025FEB',
		output: {
			type: 'deletePnrField',
			data: {
				field: 'itinerary',
				segmentNumbers: [3],
				sell: {
					sellType: 'rebookAll',
					departureDate: {raw: '25FEB'},
					bookingClasses: [],
				},
			},
		},
	});
	testCases.push({
		title: 'rebook to different date and class in one format',
		input: 'X1/025AUG/Q',
		output: {
			type: 'deletePnrField',
			data: {
				field: 'itinerary',
				segmentNumbers: [1],
				sell: {
					sellType: 'rebookAll',
					departureDate: {raw: '25AUG'},
					bookingClasses: ['Q'],
				},
			},
		},
	});

	return testCases.map(c => [c]);
};

class CmdParserTest extends require('enko-fundamentals/src/Transpiled/Lib/TestCase.js') {
	provideTestDumpList() {
		const list = [];
		list.push([
			'*R',
			{type: 'redisplayPnr'},
		]);
		list.push([
			'*P|N|I',
			{
				type: 'showPnrFields',
				data: [
					{field: 'P'},
					{field: 'N'},
					{field: 'I'},
				],
			},
		]);
		list.push([
			'**02AUG-BRUCE|*T',
			{
				type: 'searchPnr',
				followingCommands: [
					{
						type: 'ticketing',
					},
				],
			},
		]);
		list.push([
			'A10JUNKIVRIX|LH',
			{type: 'airAvailability'},
		]);
		list.push([
			'@:3SSRFOIDACNN2/N1|2/CCAX370000000000028',
			{type: 'addSsr'},
		]);
		list.push([
			'$BN1|2*C11',
			{
				type: 'priceItinerary',
				data: {
					isManualPricingRecord: false,
					pricingModifiers: [
						{
							raw: 'N1|2*C11',
							type: 'passengers',
							parsed: {
								passengersSpecified: true,
								passengerProperties: [
									{
										passengerNumber: 1,
										firstNameNumber: null,
										ptc: null,
										markup: null,
									},
									{
										passengerNumber: 2,
										firstNameNumber: null,
										ptc: 'C11',
										markup: null,
									},
								],
							},
						},
					],
				},
			},
		]);
		list.push([
			'MVT/|*JEAN',
			{type: 'addAgencyInfo'},
		]);
		list.push([
			'X1-2|4',
			{type: 'deletePnrField'},
		]);
		list.push([
			'R:SUE|QEP/43|86|CA3/4',
			{
				type: 'addReceivedFrom',
				followingCommands: [
					{
						type: 'movePnrToQueue',
					},
				],
			},
		]);
		list.push([
			'Q/37|*N|IA/UA', //Ideal in future: parse also not only first
			{type: 'openQueue'},
		]);
		list.push([
			'P:ORDB/312 555-5555|R:P|QEP/44|45|B7M/6',
			{
				type: 'addAgencyPhone',
				followingCommands: [
					{
						type: 'addReceivedFrom',
					},
					{
						type: 'movePnrToQueue',
					},
				],
			},
		]);
		list.push([
			'@:3SSROTHSCCNN1FQTVCC123456-LI/SUE|@:3SSROTHSCCNN1FQTVCC123456-LI/SUE|*R', //Ideal in future: parse also not only first
			{type: 'addSsr'},
		]);
		list.push([
			'@:3OSI QOIFNQIFN|@:3OSI JKWNGJWNG', //Ideal in future: parse also not only first
			{type: 'addProgrammaticSsr'},
		]);
		list.push([
			'MVT/2CV4//|10/|N:SMITH/S MR', //Ideal in future: parse also not only first
			{type: 'addAgencyInfo'},
		]);
		list.push([
			'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU/24DEC|R:LOGIN|ER',
			{
				type: 'addAgencyPhone',
				followingCommands: [
					{
						type: 'addTicketingDateLimit',
					},
					{
						type: 'addReceivedFrom',
					},
					{
						type: 'storeKeepPnr',
					},
				],
			},
		]);
		list.push([
			'$BB/2G2H/SS',
			{
				type: 'priceItinerary',
				data: {
					pricingModifiers: [
						{raw: '2G2H', type: null},
						{raw: 'SS', type: null},
					],
				},
			},
		]);
		list.push([
			'@:5RAINBOW/ID3921/CREATED FOR HANSEL/ID21310/REQ. ID-4711984|P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU/01JUN|R:RAINBOW|ER',
			{
				type: 'addRemark',
				followingCommands: [
					{
						type: 'addAgencyPhone',
					},
					{
						type: 'addTicketingDateLimit',
					},
					{
						type: 'addReceivedFrom',
					},
					{
						type: 'storeKeepPnr',
					},
				],
			},
		]);
		list.push([
			'SEM/2CV4/AG',
			{type: 'changePcc', data: '2CV4'},
		]);
		list.push(['QEP/66', {type: 'movePnrToQueue'}]);
		list.push(['**R', {type: null}]);
		list.push(['**-HORSE SHOW', {type: 'searchPnr'}]);
		list.push(['**B-S*', {type: 'searchPnr'}]);
		list.push(['**2CV4-BRUCE', {type: 'searchPnr'}]);
		list.push(['HBRF1231234567890/RF/WC-123ABC', {type: 'refundTicket'}]);
		list.push(['HB:F|*00345', {type: 'issueTickets'}]);
		list.push(['HBOCSQ', {type: 'issueTickets'}]);
		list.push(['HB:CDL', {type: 'issueTickets'}]);
		list.push(['HBCDL', {type: 'issueTickets'}]);
		list.push(['HBOB4', {type: 'issueTickets'}]);
		list.push(['ERM', {type: 'storePnrSendEmail'}]);
		list.push(['ERMALL', {type: 'storePnrSendEmail'}]);
		list.push(['ER', {type: 'storeKeepPnr'}]);
		list.push(['EL', {type: 'storePnr'}]);
		list.push(['ELM5', {type: 'storePnrSendEmail'}]);
		list.push(['ELM3-5', {type: 'storePnrSendEmail'}]);
		list.push(['ECMALL', {type: 'storePnrSendEmail'}]);
		list.push(['EC', {type: 'storePnr'}]);
		list.push(['E', {type: 'storePnr'}]);
		list.push(['ET  OR  QEP/37', {type: 'storePnr'}]);
		list.push(['EM', {type: 'storePnrSendEmail'}]);
		list.push(['EMALL', {type: 'storePnrSendEmail'}]);
		list.push(['EM*REC', {type: 'storePnrSendEmail'}]);
		list.push(['EM*PDF', {type: 'storePnrSendEmail'}]);
		list.push(['EM*HTM', {type: 'storePnrSendEmail'}]);
		list.push(['EM*TXT', {type: 'storePnrSendEmail'}]);
		list.push(['EM*HTM*TXT', {type: 'storePnrSendEmail'}]);
		list.push(['EM', {type: 'storePnrSendEmail'}]);
		list.push(['EM2', {type: 'storePnrSendEmail'}]);
		list.push(['EM1.3.5', {type: 'storePnrSendEmail'}]);
		list.push(['EM3-5.8', {type: 'storePnrSendEmail'}]);
		list.push(['ER$', {type: 'storeKeepPnr'}]);
		list.push(['ECR', {type: 'storePnr'}]);
		list.push(['ETR', {type: 'storePnr'}]);
		list.push(['ERCM', {type: 'storeKeepPnr'}]);
		list.push(['ECRM', {type: 'storePnr'}]);
		list.push(['C:1@:5NEW DATA', {
			type: 'changePnrRemarks',
			data: {
				ranges: [
					{from: '1', to: '1'},
				],
				newText: 'NEW DATA',
			},
		}]);
		list.push(['C:1¤:5NEW DATA', {
			type: 'changePnrRemarks',
			data: {
				ranges: [
					{from: '1', to: '1'},
				],
				newText: 'NEW DATA',
			},
		}]);
		list.push(['C:@:5', {
			type: 'changePnrRemarks',
			data: {
				rangeType: 'notSpecified',
				ranges: [
					{from: 1, to: 1},
				],
			},
		}]);
		list.push(['C:2-4*7@:5', {
			type: 'changePnrRemarks',
			data: {
				ranges: [
					{from: '2', to: '4'},
					{from: '7', to: '7'},
				],
			},
		}]);
		list.push(['C:2-*@:5', {
			type: 'changePnrRemarks',
			data: {
				rangeType: 'everythingAfter',
				ranges: [
					{from: '2'},
				],
			},
		}]);
		list.push(['C:2-4*7*9-13@:5', {
			type: 'changePnrRemarks',
			data: {
				rangeType: 'explicitEnds',
				ranges: [
					{from: '2', to: '4'},
					{from: '7', to: '7'},
					{from: '9', to: '13'},
				],
			},
		}]);
		list.push(['N:LIBERMANE/MARINA|C:1@:5|*R', {
			type: 'addName',
			followingCommands: [
				{
					type: 'changePnrRemarks', data: {
						ranges: [
							{from: '1', to: '1'},
						],
					},
				},
				{type: 'redisplayPnr'},
			],
		}]);
		list.push(['0US63Y21AUGPITPHLNN1', {type: 'sell', data: {sellType: 'directSell'}}]);
		list.push(['0US804C21AUGSTLJFKNN2', {type: 'sell', data: {sellType: 'directSell'}}]);
		list.push(['0DL561F23FEBATLORDBK1', {type: 'sell', data: {sellType: 'directSell'}}]);
		list.push(['0UA456Q15MARIAHCLEHK3', {type: 'sell', data: {sellType: 'directSell'}}]);
		list.push(['0DL505Y22JUNMSPDTWHK1/1130A130P', {type: 'sell', data: {sellType: 'directSell'}}]);
		list.push(['0Y27MARORDIADNN2/8A', {type: 'sell'}]);
		list.push(['0ZZ123Y1DECORDSEAHN1', {type: 'sell', data: {sellType: 'directSell'}}]);
		list.push(['0XXOPENYSLCCVGNO1', {type: 'sell', data: {sellType: 'openSegment'}}]);
		list.push(['0XXOPENYJACSLCNO1', {type: 'sell', data: {sellType: 'openSegment'}}]);
		list.push(['0XXOPENYSLCCVGNO1/X', {type: 'sell', data: {sellType: 'openSegment'}}]);
		list.push(['0XXOPENC22DECNRTSFONO2', {type: 'sell', data: {sellType: 'openSegment'}}]);
		list.push(['0XXOPENC22DECSFOORDNO2/X', {type: 'sell', data: {sellType: 'openSegment'}}]);
		list.push(['01F2', {
			type: 'sell',
			data: {
				sellType: 'availability',
				seatCount: '1',
				segments: [
					{bookingClass: 'F', lineNumber: '2'},
				],
			},
		}]);
		list.push(['02Y2Y3', {
			type: 'sell',
			data: {
				sellType: 'availability',
				seatCount: '2',
				segments: [
					{bookingClass: 'Y', lineNumber: '2'},
					{bookingClass: 'Y', lineNumber: '3'},
				],
			},
		}]);
		list.push(['02Y2*', {
			type: 'sell',
			data: {
				sellType: 'availability',
				seatCount: '2',
				segments: [
					{bookingClass: 'Y', lineNumber: '2'},
				],
				includeConnections: true,
			},
		}]);
		list.push(['01Y1Q2', {
			type: 'sell',
			data: {
				sellType: 'availability',
				seatCount: '1',
				segments: [
					{bookingClass: 'Y', lineNumber: '1'},
					{bookingClass: 'Q', lineNumber: '2'},
				],
			},
		}]);
		list.push(['01Y2BK', {
			type: 'sell',
			data: {
				sellType: 'availability',
			},
		}]);
		list.push(['02K3K4BK', {
			type: 'sell',
			data: {
				sellType: 'availability',
			},
		}]);
		list.push(['02S3*BK', {
			type: 'sell',
			data: {
				sellType: 'availability',
			},
		}]);
		list.push(['01Y11', {
			type: 'sell',
			data: {
				sellType: 'availability',
			},
		}]);
		list.push(['01Y11Y22', {
			type: 'sell',
			data: {
				sellType: 'availability',
			},
		}]);
		list.push(['01Y11*', {
			type: 'sell',
			data: {
				sellType: 'availability',
			},
		}]);
		list.push(['Y', {type: 'sell', data: {sellType: 'arrivalUnknown'}}]);
		list.push(['XI', {
			type: 'deletePnrField',
			data: {
				field: 'itinerary',
				applyToAllAir: true,
			},
		}]);
		list.push(['XA', {
			type: 'deletePnrField',
			data: {
				field: 'itinerary',
				applyToAllAir: true,
			},
		}]);
		list.push(['X5', {
			type: 'deletePnrField',
			data: {
				field: 'itinerary',
				segmentNumbers: [5],
			},
		}]);
		list.push(['X1|4', {
			type: 'deletePnrField',
			data: {
				field: 'itinerary',
				segmentNumbers: [1, 4],
			},
		}]);
		list.push(['X1-3|5', {
			type: 'deletePnrField',
			data: {
				field: 'itinerary',
				segmentNumbers: [1, 2, 3, 5],
			},
		}]);
		list.push(['X2/01B1', {
			type: 'deletePnrField',
			data: {
				field: 'itinerary',
				segmentNumbers: [2],
				sell: {
					sellType: 'availability',
					seatCount: '1',
					segments: [
						{bookingClass: 'B', lineNumber: '1'},
					],
				},
			},
		}]);
		list.push(['X2-5/02F1', {
			type: 'deletePnrField',
			data: {
				field: 'itinerary',
				segmentNumbers: [2, 3, 4, 5],
				sell: {
					sellType: 'availability',
					seatCount: '2',
					segments: [
						{bookingClass: 'F', lineNumber: '1'},
					],
				},
			},
		}]);
		list.push(['X4/0SK93F8NOVLAXCPHNN2', {
			type: 'deletePnrField',
			data: {
				field: 'itinerary',
				segmentNumbers: [4],
				sell: {
					sellType: 'directSell',
				},
			},
		}]);
		list.push(['XI/02Y3Y4', {
			type: 'deletePnrField',
			data: {
				field: 'itinerary',
				applyToAllAir: true,
				sell: {
					sellType: 'availability',
					seatCount: '2',
					segments: [
						{bookingClass: 'Y', lineNumber: '3'},
						{bookingClass: 'Y', lineNumber: '4'},
					],
				},
			},
		}]);
		list.push(['XI/01Y3*', {
			type: 'deletePnrField',
			data: {
				field: 'itinerary',
				applyToAllAir: true,
				sell: {
					sellType: 'availability',
					seatCount: '1',
					segments: [
						{bookingClass: 'Y', lineNumber: '3'},
					],
					includeConnections: true,
				},
			},
		}]);
		list.push(['X1|2/01M|2B', {
			type: 'deletePnrField',
			data: {
				field: 'itinerary',
				segmentNumbers: [1, 2],
				sell: {
					sellType: 'rebookSelective',
					segments: [
						{segmentNumber: '1', bookingClass: 'M'},
						{segmentNumber: '2', bookingClass: 'B'},
					],
				},
			},
		}]);
		list.push(['/2|Y', {
			type: 'insertSegments',
			data: {
				insertAfter: '2',
				sell: {
					sellType: 'arrivalUnknown',
					segments: [
						{type: 'ARNK'},
					],
				},
			},
		}]);
		list.push(['/3|01Y3', {
			type: 'insertSegments',
			data: {
				insertAfter: '3',
				sell: {
					sellType: 'availability',
					seatCount: '1',
					segments: [
						{bookingClass: 'Y', lineNumber: '3'},
					],
				},
			},
		}]);
		list.push(['/4|0UA15Y3DECLAXSFONN1', {
			type: 'insertSegments',
			data: {
				insertAfter: '4',
				sell: {sellType: 'directSell'},
			},
		}]);
		list.push(['/2/8', {type: 'reorderSegments'}]);
		list.push(['/1/3-5', {type: 'reorderSegments'}]);
		list.push(['/3/7|9', {type: 'reorderSegments'}]);
		list.push(['/1/5|7-9', {type: 'reorderSegments'}]);
		list.push([
			'$BBAS3-*2G55|4-*2G55',
			{
				type: 'priceItinerary',
				data: {
					baseCmd: '$BBA',
					pricingModifiers: [
						{
							raw: 'S3-*2G55|4-*2G55',
							type: 'segments',
							parsed: {
								privateFaresPcc: '2G55',
								bundles: [
									{segmentNumbers: ['3']},
									{segmentNumbers: ['4']},
								],
							},
						},
					],
				},
			},
		]);
		list.push(['$B-NYC09', {
			type: 'priceItinerary', data: {
				pricingModifiers: [
					{
						raw: '-NYC09', type: 'segments', parsed: {
							bundles: [
								{segmentNumbers: [], accountCode: 'NYC09'},
							],
						},
					},
				],
			},
		}]);
		list.push(['$B/-NYC09*2CV4', {
			type: 'priceItinerary', data: {
				pricingModifiers: [
					{
						raw: '-NYC09*2CV4', type: 'segments', parsed: {
							bundles: [
								{segmentNumbers: [], accountCode: 'NYC09', pcc: '2CV4'},
							],
						},
					},
				],
			},
		}]);
		list.push(['$BS1@Y1N0C9M0-NYC09*2CV4|2-NYC09@Y1N0C9M0', {
			type: 'priceItinerary', data: {
				pricingModifiers: [
					{
						raw: 'S1@Y1N0C9M0-NYC09*2CV4|2-NYC09@Y1N0C9M0', type: 'segments', parsed: {
							bundles: [
								{
									segmentNumbers: ['1'],
									fareBasis: 'Y1N0C9M0',
									accountCode: 'NYC09',
									pcc: '2CV4',
								},
								{segmentNumbers: ['2'], fareBasis: 'Y1N0C9M0', accountCode: 'NYC09', pcc: null},
							],
						},
					},
				],
			},
		}]);
		list.push([
			'$BBCCUA',
			{
				type: 'priceItinerary',
				data: {
					baseCmd: '$BBC',
					pricingModifiers: [
						{raw: 'CUA', type: 'validatingCarrier', parsed: 'UA'},
					],
				},
			},
		]);
		list.push([
			'$BB0N1-1*SC66|1-2*MIL',
			{
				type: 'priceItinerary',
				data: {
					baseCmd: '$BB0',
					pricingModifiers: [
						{
							raw: 'N1-1*SC66|1-2*MIL',
							type: 'passengers',
							parsed: {
								passengerProperties: [
									{passengerNumber: 1, firstNameNumber: 1},
									{passengerNumber: 1, firstNameNumber: 2, ptc: 'MIL'},
								],
							},
						},
					],
				},
			},
		]);
		list.push(['$BB0', {type: 'priceItinerary', data: {baseCmd: '$BB0'}}]);
		list.push(['$BB0*C05', {type: 'priceItinerary', data: {baseCmd: '$BB0'}}]);
		list.push(['$BB0N1|2', {type: 'priceItinerary', data: {baseCmd: '$BB0'}}]);
		list.push(['$BB0CUA', {type: 'priceItinerary', data: {baseCmd: '$BB0'}}]);
		list.push(['$BB0/CUA', {type: 'priceItinerary', data: {baseCmd: '$BB0'}}]);
		list.push(['$BB0S1|2', {type: 'priceItinerary', data: {baseCmd: '$BB0'}}]);
		list.push(['$BB0/:EUR', {type: 'priceItinerary', data: {baseCmd: '$BB0'}}]);
		list.push(['$BBQ01', {
			type: 'priceItinerary',
			data: {baseCmd: '$BBQ01'},
		}]);
		list.push(['FSRIX10DECKIV', {type: 'lowFareSearch'}]);
		list.push(['FS03', {type: 'sellFromLowFareSearch'}]);
		list.push(['MORE*6', {type: 'lowFareSearchNavigation'}]);
		list.push(['FS*5', {type: 'lowFareSearchNavigation'}]);
		list.push(['FSMORE', {type: 'lowFareSearchNavigation'}]);
		list.push(['*FS', {type: 'lowFareSearchNavigation'}]);
		list.push(['FS-', {type: 'lowFareSearchNavigation'}]);

		list.push(['DN3', {type: 'divideBooking'}]);
		list.push(['DN1-2|2', {type: 'divideBooking'}]);
		list.push(['DN1-2', {type: 'divideBooking'}]);
		list.push(['*DV', {type: 'dividedBookings'}]);
		list.push(['F', {type: 'fileDividedBooking'}]);
		list.push(['/0', {type: 'setNextFollowsSegment'}]);
		list.push(['/3', {type: 'setNextFollowsSegment'}]);
		list.push(['/2', {type: 'setNextFollowsSegment'}]);
		list.push(['F:BA268/19DEC', {type: 'operationalInfo'}]);
		list.push(['F:AY5478', {type: 'operationalInfo'}]);
		list.push(['$LR1', {type: 'routingFromTariff'}]);
		list.push(['$LR5', {type: 'routingFromTariff'}]);
		list.push(['L@UA/A13MAYIADSTL9A', {type: 'availabilityThroughLink'}]);
		list.push(['L@MU/A* C3', {type: 'availabilityThroughLink'}]);
		list.push(['@LTPHX', {type: 'showTime'}]);
		list.push(['@LT NYC', {type: 'showTime'}]);
		list.push(['@LT/CHI', {type: 'showTime'}]);
		list.push(['$V1', {type: 'fareRulesMenuFromTariff'}]);
		list.push(['$V/6', {type: 'fareRulesFromMenu'}]);
		list.push(['$BB/CUA/*ADT//@C/:A/@ASDAS', {
			type: 'priceItinerary',
			data: {
				pricingModifiers: [
					{raw: 'CUA', type: 'validatingCarrier'},
					{raw: '*ADT', type: 'passengers'},
					{raw: '/@C', type: 'cabinClass'},
					{raw: ':A', type: 'fareType'},
					{raw: '@ASDAS', type: 'segments'},
				],
			},
		}]);
		list.push(['$BB//@C/CUA/*ADT/:A/@ASDAS', {
			type: 'priceItinerary',
			data: {
				pricingModifiers: [
					{raw: '/@C', type: 'cabinClass'},
					{raw: 'CUA', type: 'validatingCarrier'},
					{raw: '*ADT', type: 'passengers'},
					{raw: ':A', type: 'fareType'},
					{raw: '@ASDAS', type: 'segments'},
				],
			},
		}]);
		list.push(['MP*UA12345678910', {
			type: 'addFrequentFlyerNumber', data: {
				passengers: [{
					majorPaxNum: '', minorPaxNum: '',
					mileagePrograms: [
						{withAllPartners: false, airline: 'UA', code: '12345678910'},
					],
				}],
			},
		}]);
		list.push(['MP*\u00A4LH12345678910', {type: 'addFrequentFlyerNumber'}]);
		list.push(['MPN1*UA12345678910', {type: 'addFrequentFlyerNumber'}]);
		list.push(['MPN1*\u00A4LH12345678910', {
			type: 'addFrequentFlyerNumber', data: {
				passengers: [{
					majorPaxNum: '1', minorPaxNum: '',
					mileagePrograms: [
						{withAllPartners: true, airline: 'LH', code: '12345678910'},
					],
				}],
			},
		}]);
		list.push(['MPN1-1*@AA8853315554*@BA9742123848*@DL3158746568|N2-1*@AA4346366363*@BA2315488786*@DL7845453554', {
			type: 'addFrequentFlyerNumber', data: {
				passengers: [
					{
						majorPaxNum: '1', minorPaxNum: '1',
						mileagePrograms: [
							{withAllPartners: true, airline: 'AA', code: '8853315554'},
							{withAllPartners: true, airline: 'BA', code: '9742123848'},
							{withAllPartners: true, airline: 'DL', code: '3158746568'},
						],
					},
					{
						majorPaxNum: '2', minorPaxNum: '1',
						mileagePrograms: [
							{withAllPartners: true, airline: 'AA', code: '4346366363'},
							{withAllPartners: true, airline: 'BA', code: '2315488786'},
							{withAllPartners: true, airline: 'DL', code: '7845453554'},
						],
					},
				],
			},
		}]);
		list.push(['*MPD', {type: 'mcoList'}]);
		list.push(['*MP', {type: 'frequentFlyerData'}]);
		list.push(['MP/X/*ALL', {type: 'changeFrequentFlyerNumber', data: {passengers: []}}]);
		list.push(['MP/X/*AA', {
			type: 'changeFrequentFlyerNumber', data: {
				passengers: [{
					majorPaxNum: '', minorPaxNum: '',
					mileagePrograms: [{withAllPartners: false, airline: 'AA', code: ''}],
				}],
			},
		}]);
		list.push(['MP/X/N1*LH', {type: 'changeFrequentFlyerNumber'}]);
		list.push(['MP/X/N1*DL|2*AA', {
			type: 'changeFrequentFlyerNumber', data: {
				passengers: [
					{
						majorPaxNum: '1', minorPaxNum: '',
						mileagePrograms: [{withAllPartners: false, airline: 'DL', code: ''}],
					},
					{
						majorPaxNum: '2', minorPaxNum: '',
						mileagePrograms: [{withAllPartners: false, airline: 'AA', code: ''}],
					},
				],
			},
		}]);
		list.push(['F:LH123/29APR', {type: 'operationalInfo'}]);
		list.push(['$D19DECFSMMNL|DL', {
			type: 'fareSearch',
			data: {departureDate: {raw: '19DEC'}, departureAirport: 'FSM', destinationAirport: 'MNL'},
		}]);
		list.push(['$D16NOVSLCTYO|UA', {
			type: 'fareSearch',
			data: {departureDate: {raw: '16NOV'}, departureAirport: 'SLC', destinationAirport: 'TYO'},
		}]);
		list.push(['$D20DECYVRGYE|AC', {
			type: 'fareSearch',
			data: {departureDate: {raw: '20DEC'}, departureAirport: 'YVR', destinationAirport: 'GYE'},
		}]);
		list.push(['$D10SEPNYCCNF|AA-JCB-Q:L', {
			type: 'fareSearch',
			data: {departureDate: {raw: '10SEP'}, departureAirport: 'NYC', destinationAirport: 'CNF'},
		}]);
		list.push(['$DV6DECNYCLOS17DEC', {
			type: 'fareSearch',
			data: {departureDate: {raw: '6DEC'}, departureAirport: 'NYC', destinationAirport: 'LOS'},
		}]);
		list.push(['$DV5SEPDTTNSI14JAN', {
			type: 'fareSearch',
			data: {departureDate: {raw: '5SEP'}, departureAirport: 'DTT', destinationAirport: 'NSI'},
		}]);
		list.push(['$DV23OCTRDUMNL27NOV', {
			type: 'fareSearch',
			data: {departureDate: {raw: '23OCT'}, departureAirport: 'RDU', destinationAirport: 'MNL'},
		}]);
		list.push(['$DV15SEPLAXLOS:OW', {
			type: 'fareSearch',
			data: {departureDate: {raw: '15SEP'}, departureAirport: 'LAX', destinationAirport: 'LOS'},
		}]);
		list.push(['$DV18DECPDXLON28DEC', {
			type: 'fareSearch',
			data: {departureDate: {raw: '18DEC'}, departureAirport: 'PDX', destinationAirport: 'LON'},
		}]);
		list.push(['$DV12SEPYYZMNL10OCT|AC', {
			type: 'fareSearch',
			data: {departureDate: {raw: '12SEP'}, departureAirport: 'YYZ', destinationAirport: 'MNL'},
		}]);
		list.push(['$DV14AUGBOSLON24AUG', {
			type: 'fareSearch',
			data: {departureDate: {raw: '14AUG'}, departureAirport: 'BOS', destinationAirport: 'LON'},
		}]);
		list.push(['$DV20NOVWASJNB1DEC//@C', {
			type: 'fareSearch', data: {
				departureDate: {raw: '20NOV'},
				departureAirport: 'WAS',
				destinationAirport: 'JNB',
				modifiers: [
					{type: 'cabinClass', raw: '//@C', parsed: 'business'},
				],
			},
		}]);
		list.push(['$DV18AUGEWRMDE27AUG|AA', {
			type: 'fareSearch',
			data: {departureDate: {raw: '18AUG'}, departureAirport: 'EWR', destinationAirport: 'MDE'},
		}]);
		list.push(['$DV12NOVLAXMNL3DEC|CX', {
			type: 'fareSearch',
			data: {departureDate: {raw: '12NOV'}, departureAirport: 'LAX', destinationAirport: 'MNL'},
		}]);
		list.push(['$DV19AUGSEADKR15OCT|UA', {
			type: 'fareSearch',
			data: {departureDate: {raw: '19AUG'}, departureAirport: 'SEA', destinationAirport: 'DKR'},
		}]);
		list.push(['$DNYCMNL28NOV17T12MAR17:RT+DL-M', {
			type: 'fareSearch', data: {
				departureDate: {raw: '28NOV17'},
				departureAirport: 'NYC',
				destinationAirport: 'MNL',
				modifiers: [
					{type: 'ticketingDate', parsed: {full: '2017-03-12'}},
					{type: 'tripType', raw: ':RT', parsed: 'RT'},
					{type: 'airlines', raw: '|DL', parsed: ['DL']},
					{type: 'bookingClass', raw: '-M', parsed: 'M'},
				],
			},
		}]);
		list.push(['$D30SEPORLRUH\u00A4C+AF', {
			type: 'fareSearch', data: {
				departureDate: {raw: '30SEP'},
				departureAirport: 'ORL',
				destinationAirport: 'RUH',
				modifiers: [
					{type: 'cabinClass', raw: '@C', parsed: 'business'},
					{type: 'airlines', raw: '|AF', parsed: ['AF']},
				],
			},
		}]);
		list.push([
			'$B/FXD',
			{
				type: 'priceItinerary',
				data: {
					baseCmd: '$B',
					pricingModifiers: [
						{
							raw: 'FXD',
							type: 'forceProperEconomy',
						},
					],
				},
			},
		]);
		// caused "$seatMatches is not iterable" exception
		list.push(['9S/S1', {type: 'requestSeats'}]);
		list.push(['9S', {
			type: 'requestSeats', data: {
				seatCodes: [],
			},
		}]);
		list.push(['9X', {
			type: 'cancelSeats', data: {
				seatCodes: [],
			},
		}]);
		list.push([
			'PS-CREATED IN GDS DIRECT BY JAYDEN|@:5GD-JAYDEN/1092/FOR AGENT/1092/LEAD-11081962 IN 2G8P|T-CA-SFO@$0221686|P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU/27MAR|R:JAYDEN|ER',
			{
				type: 'psRemark',
				cmd: 'PS-CREATED IN GDS DIRECT BY JAYDEN',
				followingCommands: [
					{cmd: '@:5GD-JAYDEN/1092/FOR AGENT/1092/LEAD-11081962 IN 2G8P'},
					{cmd: 'T-CA-SFO@$0221686'},
					{cmd: 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT'},
					{cmd: 'T:TAU/27MAR'},
					{cmd: 'R:JAYDEN'},
					{cmd: 'ER', type: 'storeKeepPnr'},
				],
			},
		]);
		list.push(['HHMCO', {type: 'requestMcoMask'}]);
		list.push(["HHMCU1.         *** MISC CHARGE ORDER ***                       PASSENGER NAME;HERRERA/PEDRO PATAG.....................         TO;HX...................................... AT;HKG............  VALID FOR;SPLIT...............................................  TOUR CODE;............... RELATED TKT NBR;.............         FOP;VIXXXXXXXXXXXX9910/OK.....................................  EXP DATE;1222 APVL CODE;15014D COMM;0.00/... TAX;........-;..   AMOUNT;579.43..-;USD EQUIV ;........-;... BSR;..........        END BOX;......................................................  REMARK1;..............................................          REMARK2;......................................................  VALIDATING CARRIER;HX                  ISSUE NOW;Y", {
			type: 'submitMcoMask',
		}]);
		list.push(['HB:FEX', {type: 'issueTickets'}]); // request exchange mask
		list.push(['HB:FEX01234567890123', {type: 'issueTickets'}]); // exchange with pre-filled original ticket data
		list.push(['HB:FEX01234567890123/PT', {type: 'issueTickets'}]);
		list.push(['HB:', {type: 'issueTickets'}]); // issue tickets from all ATFQ-s
		list.push(['HB2:', {type: 'issueTickets'}]); // issue tickets from ATFQ #2
		list.push(['HB2|3:', {type: 'issueTickets'}]); // issue tickets from ATFQ #2 and #3
		list.push(['HB:F|*1234:', {type: 'issueTickets'}]); // with credit card approval code
		list.push(['HB:F|OK:', {type: 'issueTickets'}]);
		list.push(['HB:**-SMITH:', {type: 'issueTickets'}]); // by name
		list.push(['HB:FCA57100000000000|D1212:', {type: 'issueTickets'}]); // WITH CREDIT CARD FOP
		list.push(['*MPD', {type: 'mcoList'}]);
		list.push(['*MCO1', {type: 'storedMcoMask'}]);
		list.push(['*MCO2', {type: 'storedMcoMask'}]);
		list.push(["$EX NAME HERRERA/PEDRO PATAG                PSGR  1/ 1         FARE USD   386.00  TOTAL USD   594.43                           TX1 USD   37.20 US   TX2 USD  171.23 XT   TX3                                                                                   EXCHANGE TKTS ;..............-;...  CPN ALL                     TKT1;8515056203728. CPN;1... TKT2;.............. CPN;....       COMM;0.00/....  ORIG FOP;VIXXXXXXXXXXXX9910. EVEN;.                                                                             TTL VALUE OF EX TKTS USD;579.43.......  ORIG BRD/OFF;...;...    TX1 USD;37.20..;US   TX2 USD;171.23.;XT   TX3 USD;.......;..    ORIG ISS;SFO... ORIG DATE;08APR19 ORIG IATA NBR;.........       ORIG TKT;*.............-;...  ORIG INV NBR;.........            PENALTY USD;0.00........  COMM ON PENALTY;0.00/......", {
			type: 'exchangeTicketMask',
		}]);
		list.push(["$MR       TOTAL ADD COLLECT   USD    15.00                      /F;CK............................................", {
			type: 'confirmExchangeFareDifferenceMask',
		}]);
		list.push(['DC*TOL', {type: 'directConnectionList'}]);
		list.push(['$V2/16', {type: 'fareRulesFromTariff'}]);
		list.push(['.2HK', {type: 'changeSegmentStatus'}]);
		list.push(['$V1/', {type: 'fareRulesMenuFromTariff'}]);
		list.push(['* MNMGHS', {type: 'openPnr'}]);
		list.push(['M*MIAPBI', {type: 'determineMileage'}]);
		list.push(['C:PS-RICO', {type: 'changePsRemark'}]);
		list.push(['C:PS-RICO@VR CC', {type: 'changePsRemark'}]);
		list.push(['FD1/NET', {type: 'fareDetailsFromTariff'}]);
		list.push(['HH$PR', {
			type: 'priceItineraryManually',
			data: {
				baseCmd: 'HH$PR',
			},
		}]);
		list.push(['HHPRN1/Z0/ET/GBG0PC|EBNONREF-0VALUAFTDPT-CHGFE/', {
			type: 'priceItineraryManually',
			data: {
				baseCmd: 'HHPR',
				pricingModifiers: [
					{raw: 'N1', type: 'passengers'},
					{raw: 'Z0', type: 'commission'},
					{raw: 'ET', type: 'areElectronicTickets'},
					{
						raw: 'GBG0PC|EBNONREF-0VALUAFTDPT-CHGFE', type: 'generic', parsed: {
							subModifiers: [
								{raw: 'BG0PC', type: 'freeBaggageAmount'},
								{raw: 'EBNONREF-0VALUAFTDPT-CHGFE', type: 'endorsementLine'},
							],
						},
					},
					{raw: '', type: null},
				],
			},
		}]);
		list.push(['$B/S6|7', {
			type: 'priceItinerary',
			data: {
				pricingModifiers: [{
					type: 'segments',
					parsed: {
						bundles: [
							{segmentNumbers: ['6']},
							{segmentNumbers: ['7']},
						],
					},
				}],
			},
		}]);
		list.push(['$B/S1.K|2.K', {
			type: 'priceItinerary',
			data: {
				pricingModifiers: [{
					type: 'segments',
					parsed: {
						bundles: [
							{segmentNumbers: ['1'], bookingClass: 'K'},
							{segmentNumbers: ['2'], bookingClass: 'K'},
						],
					},
				}],
			},
		}]);

		// apparently you can omit slash after cabin class modifier...
		// but it looks more like a bug in apollo, since if you use mod
		// starting with a letter, it just ignores any text until next slash
		list.push(['$BB//@AB:N', {
			type: 'priceItinerary',
			data: {
				pricingModifiers: [
					{type: 'cabinClass', raw: '/@AB'},
					{type: 'fareType', raw: ':N'},
				],
			},
		}]);

		// most modifiers seem to be ok with an extra preceding slash...
		list.push(['$BB//*JCB', {
			type: 'priceItinerary',
			data: {
				pricingModifiers: [
					{type: 'passengers', raw: '/*JCB'},
				],
			},
		}]);

		list.push(['$BB*JCB//S1', {
			type: 'priceItinerary',
			data: {
				pricingModifiers: [
					{type: 'passengers', raw: '*JCB'},
					{type: 'segments', raw: '/S1'},
				],
			},
		}]);

		list.push(['A*|1', {type: 'moreAirAvailability'}]);
		list.push(['A*C2', {type: 'moreAirAvailability'}]);
		list.push(['A*28JUN', {type: 'moreAirAvailability'}]);

		list.push(['A22AUGDENPMO|LH', {
			type: 'airAvailability',
			data: {
				departureDate: {raw: '22AUG'},
				departureAirport: 'DEN',
				destinationAirport: 'PMO',
			},
		}]);
		list.push(['A/T/21NOVSEAMNL0ALAX|KE', {
			type: 'airAvailability',
			data: {
				bookingClass: 'T',
				departureDate: {raw: '21NOV'},
				departureAirport: 'SEA',
				destinationAirport: 'MNL',
				unparsed: '0ALAX|KE',
			},
		}]);
		list.push(['A/T4/1JANCUNATL/D|DL', {
			type: 'airAvailability',
			data: {
				bookingClass: 'T',
				seatCount: '4',
				departureDate: {raw: '1JAN'},
				departureAirport: 'CUN',
				destinationAirport: 'ATL',
				unparsed: '/D|DL',
			},
		}]);
		// not a valid format, but still gets recognized as RESALL - that's correct
		list.push(['RE/13NM+AG', {
			type: 'storeAndCopyPnr',
		}]);

		list.push(['A*', {
			type: 'moreAirAvailability',
			data: {action: 'nextPage'},
		}]);
		list.push(['A*C3', {
			type: 'moreAirAvailability',
			data: {action: 'showAllClasses', lineNumber: '3'},
		}]);
		list.push(['A*J', {
			type: 'moreAirAvailability',
			data: {action: 'changeInput', displayType: 'J'},
		}]);
		list.push(['A*14NOV', {
			type: 'moreAirAvailability',
			data: {action: 'changeInput', departureDate: {raw: '14NOV'}},
		}]);
		list.push(['A*9P', {
			type: 'moreAirAvailability',
			data: {action: 'changeInput', departureTime: {raw: '9P'}},
		}]);
		list.push(['A*25SEP5P', {
			type: 'moreAirAvailability',
			data: {action: 'changeInput', departureDate: {raw: '25SEP'}, departureTime: {raw: '5P'}},
		}]);
		list.push(['A*BIAH', {
			type: 'moreAirAvailability',
			data: {action: 'changeInput', departureAirport: 'IAH'},
		}]);
		list.push(['A*DORD', {
			type: 'moreAirAvailability',
			data: {action: 'changeInput', destinationAirport: 'ORD'},
		}]);
		list.push(['A*O29NOV', {
			type: 'moreAirAvailability',
			data: {action: 'changeInput', returnDate: {raw: '29NOV'}},
		}]);
		list.push(['A*|DL', {
			type: 'moreAirAvailability',
			data: {action: 'changeInput', airlines: ['DL']},
		}]);
		list.push(['A*XNRT', {
			type: 'moreAirAvailability',
			data: {action: 'changeInput', connection: {raw: 'NRT'}},
		}]);
		list.push(['A*|21', {
			type: 'moreAirAvailability',
			data: {action: 'changeInput', dayOffset: 21},
		}]);
		list.push(['A*|-5', {
			type: 'moreAirAvailability',
			data: {action: 'changeInput', dayOffset: -5},
		}]);
		list.push(['A*XORDLHR|UA.BA.AA', {
			type: 'moreAirAvailability',
			data: {action: 'changeInput', connection: {raw: 'ORDLHR'}, airlines: ['UA', 'BA', 'AA']},
		}]);

		return list;
	}

	provideParseFareSearch() {
		let list = [];

		list.push({
			title: 'parseFareSearch with validation',
			input: '$DJFKMNLV10SEP20SEP+AA            ',
			output: {
				departureDate: {
					raw: '10SEP',
					partial: '09-10',
				},
				returnDate: {
					raw: '20SEP',
					partial: '09-20',
				},
				departureAirport: 'JFK',
				destinationAirport: 'MNL',
				modifiers: [],
				unparsed: '+AA            ',
			},
		});

		list.push({
			title: 'Direct command',
			input: '$DV10SEPJFKLHR20SEP+AA',
			output: {
				departureDate: {
					raw: '10SEP',
					partial: '09-10',
				},
				returnDate: {
					raw: '20SEP',
					partial: '09-20',
				},
				departureAirport: 'JFK',
				destinationAirport: 'LHR',
				modifiers: [],
				unparsed: '+AA',
			},
		});

		list.push({
			title: 'Only departure date is set',
			input: '$DWASMNLV10SEP',
			output: {
				departureDate: {
					raw: '10SEP',
					partial: '09-10',
				},
				departureAirport: 'WAS',
				destinationAirport: 'MNL',
				modifiers: [],
				unparsed: '',
			},
		});

		list.push({
			title: 'Parse one directional fare',
			input: '$DV10SEPJFKLHR             ',
			output: {
				departureDate: {
					raw: '10SEP',
					partial: '09-10',
				},
				departureAirport: 'JFK',
				destinationAirport: 'LHR',
				modifiers: [],
				unparsed: '             ',
			},
		});

		list.push({
			title: 'Slash before booking class',
			input: '$D10NOVDFWAKL|AA/@C',
			output: {
				departureDate: {
					raw: '10NOV',
					partial: '11-10',
				},
				departureAirport: 'DFW',
				destinationAirport: 'AKL',
				modifiers: [
					{type: 'airlines'},
					{type: 'cabinClass'},
				],
			},
		});

		list.push({
			title: 'Apparently every modifier may have any amount of optional slashes before it (like, I believe, in Galileo pricing)',
			input: '$D12NOVSLCROM|DL-Z:RT-JWZ/:A',
			output: {
				departureDate: {
					raw: '12NOV',
					partial: '11-12',
				},
				departureAirport: 'SLC',
				destinationAirport: 'ROM',
				modifiers: [
					{type: 'airlines'},
					{type: 'bookingClass'},
					{type: 'tripType'},
					{type: 'ptc'},
					{type: 'fareType'},
				],
			},
		});

		list.push({
			title: 'with fare basis',
			input: '$D20MAYRIXLAX@LN3XPB',
			output: {
				departureAirport: 'RIX',
				destinationAirport: 'LAX',
				departureDate: {raw: '20MAY'},
				modifiers: [
					{type: 'fareBasis', raw: '@LN3XPB', parsed: 'LN3XPB'},
				],
			},
		});

		// TODO: parse!
		list.push({
			title: 'First dates, then airport codes',
			input: '$DV20DEC04JANNYCPTY',
			output: {
				departureDate: {
					raw: '20DEC',
					partial: '12-20',
				},
				returnDate: {
					raw: '04JAN',
					partial: '01-04',
				},
				departureAirport: 'NYC',
				destinationAirport: 'PTY',
				modifiers: [],
				unparsed: '',
			},
		});

		// one more:
		// $DV23DEC6JANPHXMIL+DL
		//
		list.push({
			title: 'First dates, then airport codes',
			input: '$DV20DEC4JANNYCPTY',
			output: {
				departureDate: {
					raw: '20DEC',
					partial: '12-20',
				},
				returnDate: {
					raw: '4JAN',
					partial: '01-04',
				},
				departureAirport: 'NYC',
				destinationAirport: 'PTY',
				modifiers: [],
				unparsed: '',
			},
		});

		list.push({
			title: 'And another one',
			input: '$DV23DEC6JANPHXMIL|DL',
			output: {
				validated: true,
				departureDate: {raw: '23DEC'},
				returnDate: {raw: '6JAN'},
				departureAirport: 'PHX',
				destinationAirport: 'MIL',
				modifiers: [
					{raw: '|DL', type: 'airlines'},
				],
				unparsed: '',
			},
		});

		list.push({
			title: 'Account code (I guess format is this)',
			input: '$D20MAYLONJFK-PRI-TPACK',
			output: {
				departureDate: {raw: '20MAY'},
				departureAirport: 'LON',
				destinationAirport: 'JFK',
				modifiers: [
					{raw: '-PRI-TPACK', type: 'accountCodes', parsed: ['TPACK']},
				],
				unparsed: '',
			},
		});

		return list.map(a => [a]);
	}

	/** @deprecated - use test_parse() instead, as it allows using `title` for comments */
	testParserOutputAgainstTree(dump, expected) {
		const actual = CommandParser.parse(dump);
		this.assertArrayElementsSubset(expected, actual, '>' + dump + ';\n');
	}

	test_parse({input, output}) {
		const actual = CommandParser.parse(input);
		this.assertArrayElementsSubset(output, actual, '>' + input + ';\n');
	}

	testParseParseFareSearch({input, output}) {
		const result = Parse_fareSearch(input);
		this.assertArrayElementsSubset(output, result);
	}

	getTestMapping() {
		return [
			[this.provideTestDumpList, this.testParserOutputAgainstTree],
			[provide_parse, this.test_parse],
			[this.provideParseFareSearch, this.testParseParseFareSearch],
		];
	}
}

module.exports = CmdParserTest;
