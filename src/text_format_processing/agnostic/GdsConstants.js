

/**
 * @module - provides constants that are common for all GDS-es:
 * meal types/ssr codes/segment types/history codes/etc/etc...
 */

exports.MEAL_MEAL_AT_COST = 'MEAL_AT_COST';
exports.MEAL_ALCOHOL_PURCHASE = 'ALCOHOL_PURCHASE';
exports.MEAL_COLD_MEAL = 'COLD_MEAL';
exports.MEAL_REFRESHMENTS = 'REFRESHMENTS';
exports.MEAL_HOT_MEAL = 'HOT_MEAL';
exports.MEAL_LUNCH = 'LUNCH';
exports.MEAL_ALCOHOL_NO_COST = 'ALCOHOL_NO_COST';
exports.MEAL_REFRESH_AT_COST = 'REFRESH_AT_COST';
exports.MEAL_NO_MEAL_IS_OFFERED = 'NO_MEAL_IS_OFFERED';
exports.MEAL_NO_MEAL_SVC = 'NO_MEAL_SVC';
exports.MEAL_FOOD_AND_ALCOHOL_AT_COST = 'FOOD_AND_ALCOHOL_AT_COST';
exports.MEAL_SNACK = 'SNACK';
exports.MEAL_MEAL = 'MEAL';
exports.MEAL_FOOD_TO_PURCHASE = 'FOOD_TO_PURCHASE';
exports.MEAL_DINNER = 'DINNER';
exports.MEAL_BREAKFAST = 'BREAKFAST'; // no in Apollo
exports.MEAL_CONTINENTAL_BREAKFAST = 'CONTINENTAL_BREAKFAST'; // only in Amadeus
exports.MEAL_DUTY_FREE_SALES_AVAILABLE = 'DUTY_FREE_SALES_AVAILABLE'; // only in Amadeus

exports.SAVE_PNR_EXECUTED = 'EXECUTED';
exports.SAVE_PNR_SIMULTANEOUS_CHANGES = 'SIMULTANEOUS_CHANGES';
exports.SAVE_PNR_GDS_ERROR = 'GDS_ERROR';

exports.SEG_AIR = 'AIR';
exports.SEG_OTH = 'OTH';
exports.SEG_TUR = 'TUR';
exports.SEG_ARNK = 'ARNK'; // stands for "Arrival Unknown"
exports.SEG_CAR = 'CAR';
exports.SEG_HOTEL = 'HOTEL';
exports.SEG_FAKE = 'FAKE'; // segment without times, not operable usually
exports.SEG_FLWN = 'FLWN'; // flown segment, usually displayed only in Amadeus
