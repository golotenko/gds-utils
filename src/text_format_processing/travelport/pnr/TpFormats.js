
const php = require('enko-fundamentals/src/Transpiled/php.js');

/**
 * Modifier descriptions here: https://ask.travelport.com/index?page=content&id=AN8342&actp=search&viewlocale=en_US&searchid=1493740479525&rnToken=bbae32011f4cca5a6e508147b6e169#Optional%20Fields%20for%20Segment%20Sell
 * and here: http://testws.galileo.com/GWSSample/Help/GWSHelp/mergedprojects/TransactionHelp/1Notes/Car_Optional_Field_Data.html
 */
exports.parseCarSegmentModifiers = (txt) => {
	const $getModifierCodeAndData = function ($txt) {
		const $tokens = $txt.split('-');
		const $code = php.trim(php.array_shift($tokens));
		const $data = php.trim(php.implode('-', $tokens));
		return [$code, $data];
	};
	const $result = {
		confirmationNumber: null,
		bookingSource: null,
		pickUpPoint: null,
		arrivalTime: null,
		rateCode: null,
		departureTime: null,
		name: null,
	};
	const $modifiers = php.array_map($getModifierCodeAndData, php.array_map('trim', php.explode('/', txt)));
	for (const [$code, $data] of $modifiers) {
		if ($code === 'CF') {
			$result['confirmationNumber'] = php.rtrim($data, ' *');
		} else if ($code === 'BS') {
			$result['bookingSource'] = $data;
		} else if ($code === 'PUP') {
			$result['pickUpPoint'] = $data;
		} else if ($code === 'ARR') {
			$result['arrivalTime'] = $data;
		} else if ($code === 'RC') {
			$result['rateCode'] = $data;
		} else if ($code === 'DT') {
			$result['departureTime'] = $data;
		} else if ($code === 'NM') {
			$result['name'] = $data;
		} else if ($code === 'RG') {
			// 'USD109.00DY-UNL FM'
			let $match;
			if ($match = php.preg_match(/^(?<currency>[A-Z]{3})(?<amount>\d*\.\d{2})/, $data, $match)) {
				$result['rateGuarantee'] = {currency: $match['currency'], amount: $match['amount']};
			}
		} else if ($code === 'APPROXIMATE TOTAL RATE') {
			// 'APPROXIMATE TOTAL RATE-USD237.00-UNL FM 03DY 00HR .00MC'
			let $match;
			if ($match = php.preg_match(/^(?<currency>[A-Z]{3})(?<amount>\d*\.\d{2})/, $data, $match)) {
				$result['approxTotal'] = {currency: $match['currency'], amount: $match['amount']};
			}
		} else if ($code === 'AT') { // TODO: Unknown
		}
	}
	return $result;
}