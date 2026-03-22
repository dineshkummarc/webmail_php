'use strict';

var
	_ = require('underscore'),
	$ = require('jquery'),
	ko = require('knockout'),
	
	AddressUtils = require('%PathToCoreWebclientModule%/js/utils/Address.js'),
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	Utils = require('%PathToCoreWebclientModule%/js/utils/Common.js'),
	
	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	Routing = require('%PathToCoreWebclientModule%/js/Routing.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),
	UserSettings = require('%PathToCoreWebclientModule%/js/Settings.js'),
	
	CAbstractScreenView = require('%PathToCoreWebclientModule%/js/views/CAbstractScreenView.js'),

	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	Settings = require('modules/%ModuleName%/js/Settings.js'),
	
	$html = $('html')
;

/**
 * @constructor
 */
function CResetPasswordFormView()
{
	CAbstractScreenView.call(this, '%ModuleName%');
	
	this.sResetPasswordHash = '#' + Settings.HashModuleName;
	
	this.sCustomLogoUrl = Settings.CustomLogoUrl;
	this.sBottomInfoHtmlText = Settings.BottomInfoHtmlText;
	
	this.email = ko.observable('');
	this.emailFocus = ko.observable(false);

	this.newPassword = ko.observable('');
	this.newPasswordFocus = ko.observable(false);

	this.confirmPassword = ko.observable('');
	this.confirmPasswordFocus = ko.observable(false);
	
	this.step = ko.observable(1);
	this.gettingUserPublicId = ko.observable(false);
	this.resetPasswordHashUserPublicId = ko.observable('');
	this.resetPasswordHashInfo = ko.computed(function () {
		if (this.resetPasswordHashUserPublicId())
		{
			return TextUtils.i18n('%MODULENAME%/INFO_RESET_PASSWORD_HASH', {
				'USERNAME': this.resetPasswordHashUserPublicId(),
				'SITE_NAME': UserSettings.SiteName
			});
		}
		if (!this.gettingUserPublicId())
		{
			return TextUtils.i18n('%MODULENAME%/ERROR_LINK_NOT_VALID');
		}
		return '';
	}, this);
	this.recoverThroughEmailText = ko.observable('');
	this.sendRecoveryEmailText = ko.observable('');

	this.gettingRecoveryEmail = ko.observable(false);
	this.continueCommand = Utils.createCommand(this, this.continue, function () { return !this.gettingRecoveryEmail(); });

	this.sendingRecoveryEmail = ko.observable(false);
	this.sendRecoveryEmailCommand = Utils.createCommand(this, this.sendRecoveryEmail, function () { return !this.sendingRecoveryEmail(); });
	
	this.changingPassword = ko.observable(false);
	this.changePasswordCommand = Utils.createCommand(this, this.changePassword, function () { return !this.changingPassword(); });
	this.passwordChanged = ko.observable(false);
	
	this.shake = ko.observable(false).extend({'autoResetToFalse': 800});
	
	App.broadcastEvent('%ModuleName%::ConstructView::after', {'Name': this.ViewConstructorName, 'View': this});
}

_.extendOwn(CResetPasswordFormView.prototype, CAbstractScreenView.prototype);

CResetPasswordFormView.prototype.ViewTemplate = '%ModuleName%_ResetPasswordFormView';
CResetPasswordFormView.prototype.ViewConstructorName = 'CResetPasswordFormView';

CResetPasswordFormView.prototype.onBind = function ()
{
	$html.addClass('non-adjustable-valign');
};

CResetPasswordFormView.prototype.getResetPasswordHash = function () {
	var aHashArray = Routing.getCurrentHashArray();
	if (aHashArray.length >= 2 && aHashArray[0] === Settings.HashModuleName)
	{
		return aHashArray[1];
	}
	return '';
},

CResetPasswordFormView.prototype.onRoute = function ()
{
	var sResetPasswordHash = this.getResetPasswordHash();
	this.resetPasswordHashUserPublicId('');
	if (Types.isNonEmptyString(sResetPasswordHash))
	{
		this.step(0);
		this.gettingUserPublicId(true);
		Ajax.send('%ModuleName%', 'GetUserPublicId', { 'Hash': sResetPasswordHash }, function (oResponse) {
			this.gettingUserPublicId(false);
			if (Types.isNonEmptyString(oResponse.Result))
			{
				this.resetPasswordHashUserPublicId(oResponse.Result);
			}
		}, this);
	}
	else
	{
		this.step(1);
		_.delay(_.bind(function(){
			if (this.email() === '')
			{
				this.emailFocus(true);
			}
		},this), 1);
	}
};

CResetPasswordFormView.prototype.continue = function ()
{
	var sEmail = $.trim(this.email());
	if (sEmail === '')
	{
		this.emailFocus(true);
		this.shake(true);
	}
	else if (!AddressUtils.isCorrectEmail(sEmail))
	{
		Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_INCORRECT_EMAIL'));
	}
	else
	{
		this.gettingRecoveryEmail(true);
		Ajax.send('%ModuleName%', 'GetStarredRecoveryEmailAddress', { UserPublicId: this.email() }, function (oResponse, oRequest) {
			this.gettingRecoveryEmail(false);
			if (Types.isNonEmptyString(oResponse && oResponse.Result))
			{
				this.step(2);
				this.recoverThroughEmailText(TextUtils.i18n('%MODULENAME%/INFO_EMAIL_RECOVER_SENT', {
					'USERNAME': this.email(),
					'EMAIL': oResponse && oResponse.Result,
					'SITE_NAME': UserSettings.SiteName
				}));
				this.sendRecoveryEmailText(TextUtils.i18n('%MODULENAME%/INFO_RECOVERY_LINK_SENT', {
					'USERNAME': this.email(),
					'EMAIL': oResponse && oResponse.Result,
					'SITE_NAME': UserSettings.SiteName
				}));
			}
			else
			{
				Api.showErrorByCode(oResponse, TextUtils.i18n('%MODULENAME%/ERROR_RECOVERY_EMAIL_NOT_FOUND'));
			}
		}, this);
	}
};

CResetPasswordFormView.prototype.backToStep1 = function ()
{
	this.recoverThroughEmailText('');
	this.sendRecoveryEmailText('');
	this.step(1);
	this.emailFocus(true);
};

CResetPasswordFormView.prototype.backToStepLogin = function ()
{
	Routing.setHash('');
};

CResetPasswordFormView.prototype.sendRecoveryEmail = function ()
{
	this.sendingRecoveryEmail(true);
	Ajax.send('%ModuleName%', 'SendPasswordResetEmail', { UserPublicId: this.email() }, function (oResponse, oRequest) {
		this.sendingRecoveryEmail(false);
		if (oResponse && oResponse.Result)
		{
			this.step(3);
		}
		else
		{
			Api.showErrorByCode(oResponse, TextUtils.i18n('%MODULENAME%/ERROR_RECOVERY_EMAIL_NOT_SENT'));
		}
	}, this);
};

CResetPasswordFormView.prototype.changePassword = function ()
{
	if ($.trim(this.newPassword()) === '')
	{
		this.newPasswordFocus(true);
		this.shake(true);
	}
	else if ($.trim(this.confirmPassword()) === '')
	{
		this.confirmPasswordFocus(true);
		this.shake(true);
	}
	else if (this.newPassword() !== this.confirmPassword())
	{
		Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORDS_DO_NOT_MATCH'));
	}
	else
	{
		this.changingPassword(true);
		this.passwordChanged(false);
		Ajax.send('%ModuleName%', 'ChangePassword', { 'Hash': this.getResetPasswordHash(), 'NewPassword': this.newPassword() }, function (oResponse, oRequest) {
			this.changingPassword(false);
			if (oResponse && oResponse.Result === true)
			{
				this.passwordChanged(true);
			}
			else
			{
				Api.showErrorByCode(oResponse, TextUtils.i18n('%MODULENAME%/ERROR_PASSWORD_CHANGE'));
			}
		}, this);
	}
};

module.exports = new CResetPasswordFormView();
