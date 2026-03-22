'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	Popups = require('%PathToCoreWebclientModule%/js/Popups.js'),

	CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
	
	SetRecoveryEmailPopup = require('modules/%ModuleName%/js/popups/SetRecoveryEmailPopup.js'),
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
 * @constructor
 */
function CResetPasswordSettingsFormView()
{
	CAbstractSettingsFormView.call(this, '%ModuleName%');
	
	this.recoveryEmail = ko.observable(Settings.RecoveryEmail);
	this.recoveryEmailConfirmed = ko.observable(Settings.RecoveryEmailConfirmed);
	this.recoveryAccount = ko.observable(Settings.RecoveryAccount);
	this.recoveryEmailInfo = ko.computed(function () {
		let sText = ''

		if (this.recoveryEmail() !== '') {
			const sLangName = this.recoveryEmailConfirmed() ? 'INFO_YOU_HAVE_RECOVERY_EMAIL' : 'INFO_YOU_HAVE_NOT_CONFIRMED_RECOVERY_EMAIL'
			sText = TextUtils.i18n('%MODULENAME%/' + sLangName, {
				'EMAIL': this.recoveryEmail()
			})

			if (this.recoveryAccount()) {
				sText += "<br><br>" + TextUtils.i18n('%MODULENAME%/INFO_CURRENT_RECOVERY_ACCOUNT', {
					'ACCOUNT': this.recoveryAccount()
				})
			}
		} else {
			sText = TextUtils.i18n('%MODULENAME%/INFO_NOT_SET_RECOVERY_EMAIL')
		}

		
		return sText
	}, this);
}

_.extendOwn(CResetPasswordSettingsFormView.prototype, CAbstractSettingsFormView.prototype);

CResetPasswordSettingsFormView.prototype.ViewTemplate = '%ModuleName%_ResetPasswordSettingsFormView';

CResetPasswordSettingsFormView.prototype.setRecoveryEmail = function ()
{
	Popups.showPopup(SetRecoveryEmailPopup, [function (aData) {
		const sRecoveryEmail = aData?.RecoveryEmail;
		const sRecoveryAccount = aData?.RecoveryAccount;
		this.updateSettings(sRecoveryEmail, sRecoveryAccount);
	}.bind(this)]);
};

CResetPasswordSettingsFormView.prototype.updateSettings = function (sRecoveryEmail, sRecoveryAccount)
{
	Settings.update(sRecoveryEmail, sRecoveryAccount);
	this.recoveryEmail(Settings.RecoveryEmail);
	this.recoveryEmailConfirmed(Settings.RecoveryEmailConfirmed);
	this.recoveryAccount(Settings.RecoveryAccount);
};

module.exports = new CResetPasswordSettingsFormView();
