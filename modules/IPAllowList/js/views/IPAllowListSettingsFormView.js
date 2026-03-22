'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),

	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),

	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	ConfirmPopup = require('%PathToCoreWebclientModule%/js/popups/ConfirmPopup.js'),
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	Popups = require('%PathToCoreWebclientModule%/js/Popups.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),

	CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),

	AddIpToAllowlistPopup = require('modules/%ModuleName%/js/popups/AddIpToAllowlistPopup.js'),
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
 * @constructor
 */
function CIPAllowListSettingsFormView()
{
	CAbstractSettingsFormView.call(this);
	
	this.ipAllowlist = ko.observableArray([]);
	this.sCurrentIp = Settings.CurrentIP;
}

_.extendOwn(CIPAllowListSettingsFormView.prototype, CAbstractSettingsFormView.prototype);

CIPAllowListSettingsFormView.prototype.ViewTemplate = '%ModuleName%_IPAllowListSettingsFormView';

CIPAllowListSettingsFormView.prototype.onShow = function ()
{
	this.clearAll();
};

CIPAllowListSettingsFormView.prototype.clearAll = function ()
{
	this.populateIpAllowlist();
};

CIPAllowListSettingsFormView.prototype.populateIpAllowlist = function ()
{
	Ajax.send('%ModuleName%', 'GetIpAllowlist', null, function (oResponse) {
		if (_.isObject(oResponse && oResponse.Result))
		{
			this.ipAllowlist(_.map(oResponse.Result, function (oData, sKey) {
				return {
					IP: sKey,
					Comment: oData.Comment
				};
			}));
		}
		else
		{
			Api.showErrorByCode(oResponse, TextUtils.i18n('%MODULENAME%/ERROR_CANNOT_GET_IP_ALLOWLIST'));
		}
	}, this);
};

CIPAllowListSettingsFormView.prototype.addIpToAllowlist = function ()
{
	var aAllowedIpAddresses = _.map(this.ipAllowlist(), function (oIpData) {
		return oIpData.IP;
	});
	Popups.showPopup(AddIpToAllowlistPopup, [aAllowedIpAddresses, this.populateIpAllowlist.bind(this)]);
};

CIPAllowListSettingsFormView.prototype.askRemoveIp = function (sIp)
{
	var
		sConfirm = (sIp === this.sCurrentIp && this.ipAllowlist().length > 1)
			? TextUtils.i18n('%MODULENAME%/CONFIRM_REMOVE_CURRENT_IP')
			: TextUtils.i18n('%MODULENAME%/CONFIRM_REMOVE_IP'),
		sHeading = TextUtils.i18n('%MODULENAME%/CONFIRM_HEADING_REMOVE_IP', {
			'IP': sIp
		})
	;
	Popups.showPopup(ConfirmPopup, [sConfirm, _.bind(function (bRemove) {
		if (bRemove)
		{
			this.removeIp(sIp);
		}
	}, this), sHeading, TextUtils.i18n('%MODULENAME%/ACTION_PROCEED')]);
};

CIPAllowListSettingsFormView.prototype.removeIp = function (sIp)
{
	var oParameters = {
		'IP': sIp
	};
	Ajax.send('%ModuleName%', 'RemoveIpFromAllowlist', oParameters, function (oResponse) {
		this.populateIpAllowlist();
		if (oResponse && oResponse.Result)
		{
			Screens.showReport(TextUtils.i18n('%MODULENAME%/REPORT_REMOVE_IP'));
		}
		else
		{
			Api.showErrorByCode(oResponse, TextUtils.i18n('%MODULENAME%/ERROR_REMOVE_IP'));
		}
	}, this);
};

module.exports = new CIPAllowListSettingsFormView();
