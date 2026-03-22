'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),

	AddressUtils = require('%PathToCoreWebclientModule%/js/utils/Address.js'),
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),

	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	CAbstractPopup = require('%PathToCoreWebclientModule%/js/popups/CAbstractPopup.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),

	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
 * @constructor
 */
function CSetRecoveryEmailPopup()
{
	CAbstractPopup.call(this);

	this.recoveryEmail = ko.observable('');
	this.recoveryEmailFocus = ko.observable(false);
	this.password = ko.observable('');
	this.passwordFocus = ko.observable(false);
	this.updateMode = ko.observable(false);
	this.loading = ko.observable(false);
	
	this.recoveryEmailInfo = ko.observable('');
}

_.extendOwn(CSetRecoveryEmailPopup.prototype, CAbstractPopup.prototype);

CSetRecoveryEmailPopup.prototype.PopupTemplate = '%ModuleName%_SetRecoveryEmailPopup';

CSetRecoveryEmailPopup.prototype.onOpen = function (fCallback)
{
	this.loading(false);
	this.fillRecoveryEmailInfo();
	this.updateMode(Types.isNonEmptyString(Settings.RecoveryEmail));
	this.fCallback = fCallback;
	this.recoveryEmailFocus(true);
};

CSetRecoveryEmailPopup.prototype.onClose = function ()
{
	this.recoveryEmail('');
	this.password('');
};

CSetRecoveryEmailPopup.prototype.fillRecoveryEmailInfo = function ()
{
	if (Settings.RecoveryEmail !== '')
	{
		this.recoveryEmailInfo(TextUtils.i18n('%MODULENAME%/INFO_YOUR_CURRENT_RECOVERY_EMAIL', {
			'EMAIL': Settings.RecoveryEmail
		}));
	}
	else
	{
		this.recoveryEmailInfo('');
	}
};

CSetRecoveryEmailPopup.prototype.save = function ()
{
	var sEmail = $.trim(this.recoveryEmail());
	if (sEmail !== '' && !AddressUtils.isCorrectEmail(sEmail))
	{
		Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_INCORRECT_EMAIL'));
		this.recoveryEmailFocus(true);
		return;
	}
	if ($.trim(this.password()) === '')
	{
		Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_EMPTY_PASSWORD'));
		this.passwordFocus(true);
		return;
	}
	this.loading(true);
	Ajax.send('%ModuleName%', 'UpdateSettings',
		{
			'RecoveryEmail': this.recoveryEmail(),
			'Password': this.password()
		},
		this.onUpdateSettingsResponse,
		this
	);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CSetRecoveryEmailPopup.prototype.onUpdateSettingsResponse = function (oResponse, oRequest)
{
	this.loading(false);
	if (oResponse.Result)
	{
		if (_.isFunction(this.fCallback))
		{
			this.fCallback(oResponse.Result);
		}
		this.closePopup();
	}
	else
	{
		Api.showErrorByCode(oResponse, TextUtils.i18n('%MODULENAME%/ERROR_SET_RECOVERY_EMAIL'));
	}
};

module.exports = new CSetRecoveryEmailPopup();
