'use strict';

var
	_ = require('underscore'),
	
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js')
;

module.exports = {
	HashModuleName: 'reset-password',

	BottomInfoHtmlText: '',
	CustomLogoUrl: '',
	RecoveryEmail: '',
	RecoveryEmailConfirmed: false,
	RecoveryAccount: '',

	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData['%ModuleName%'];

		if (!_.isEmpty(oAppDataSection))
		{
			this.HashModuleName = Types.pString(oAppDataSection.HashModuleName, this.HashModuleName);

			this.BottomInfoHtmlText = Types.pString(oAppDataSection.BottomInfoHtmlText, this.BottomInfoHtmlText);
			this.CustomLogoUrl = Types.pString(oAppDataSection.CustomLogoUrl, this.CustomLogoUrl);
			this.RecoveryEmail = Types.pString(oAppDataSection.RecoveryEmail, this.RecoveryEmail);
			this.RecoveryEmailConfirmed = Types.pBool(oAppDataSection.RecoveryEmailConfirmed, this.RecoveryEmailConfirmed);
			this.RecoveryAccount = Types.pString(oAppDataSection.RecoveryAccount, this.RecoveryAccount);
		}
	},

	update: function (sRecoveryEmail, sRecoveryAccount)
	{
		this.RecoveryEmail = Types.pString(sRecoveryEmail, this.RecoveryEmail);
		this.RecoveryEmailConfirmed = this.RecoveryEmail === '';
		this.RecoveryAccount = Types.pString(sRecoveryAccount, this.RecoveryAccount);
	}
};
