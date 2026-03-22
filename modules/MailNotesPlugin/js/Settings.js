'use strict';

const
	_ = require('underscore'),
	
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js')
;

module.exports = {
	ServerModuleName: 'MailNotesPlugin',
	HashModuleName: 'notes',
	
	DisplayNotesButton: false,
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		const oSection = oAppData['%ModuleName%'];

		if (!_.isEmpty(oSection))
		{
			this.DisplayNotesButton = Types.pBool(oSection.DisplayNotesButton, this.DisplayNotesButton);
		}
	},
	
	/**
	 * Updates new settings values after saving on server.
	 * 
	 * @param {object} parameters 
	 */
	update: function (parameters)
	{
		this.DisplayNotesButton = Types.pBool(parameters.DisplayNotesButton, this.DisplayNotesButton);
	},
};
