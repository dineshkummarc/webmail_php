'use strict';

var
	_ = require('underscore'),

	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js')
;

module.exports = {
	CurrentIP: '',

	/**
	 * Initializes settings from AppData object sections.
	 *
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = _.extend({}, oAppData[this.ServerModuleName] || {}, oAppData['%ModuleName%'] || {});
		if (!_.isEmpty(oAppDataSection))
		{
			this.CurrentIP = Types.pString(oAppDataSection.CurrentIP, this.CurrentIP);
		}
	}
};
