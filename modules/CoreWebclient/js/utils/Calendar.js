'use strict';

var
	_ = require('underscore'),
	moment = require('moment'),

	CalendarUtils = {}
;

/**
 * Generates a list of time to display in calendar settings.
 * 
 * @param {string} sLabelFormat
 * @param {string} sValueFormat
 * @returns {Array}
 */
CalendarUtils.getTimeListStepHour = function (sLabelFormat, sValueFormat)
{
	var 
		aTimeList = [
			'00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00',
			'10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
			'20:00', '21:00', '22:00', '23:00'
		],
		sLabelFormat = sLabelFormat || 'HH:mm'
		sValueFormat = sValueFormat || 'k'
	;
	
	return _.map(aTimeList, function (sTime) {
		var
			oMoment = moment(sTime, 'HH:mm'),
			sText = oMoment.format(sLabelFormat),
			sValue = oMoment.format(sValueFormat)
		;
		return {text: sText, value: sValue};
	});
};

/**
 * Generates a list of time to display in create/edit event popup.
 * 
 * @param {string} sTimeFormatMoment
 * @returns {Array}
 */
CalendarUtils.getTimeListStepHalfHour = function (sTimeFormatMoment)
{
	var aTimeList = [
		'00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30',
		'05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
		'10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
		'15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
		'20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
	];
	
	return _.map(aTimeList, function (sTime) {
		var
			oMoment = moment(sTime, 'HH:mm'),
			sText = oMoment.format(sTimeFormatMoment)
		;
		return {text: sText, value: sText};
	});
};

/**
 * @param {string} dateFormat
 * 
 * @return string
 */
CalendarUtils.getDateFormatForDatePicker = function (dateFormat)
{
	//'MM/DD/YYYY' -> 'mm/dd/yy'
	//'DD/MM/YYYY' -> 'dd/mm/yy'
	//'DD Month YYYY' -> 'dd MM yy'
	return dateFormat.replace('MM', 'mm').replace('DD', 'dd').replace('YYYY', 'yy').replace('Month', 'MM');
};

module.exports = CalendarUtils;
