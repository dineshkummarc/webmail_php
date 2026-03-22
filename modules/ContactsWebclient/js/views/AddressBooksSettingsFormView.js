'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	ConfirmPopup = require('%PathToCoreWebclientModule%/js/popups/ConfirmPopup.js'),
	Popups = require('%PathToCoreWebclientModule%/js/Popups.js'),
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),

	CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),

	EditAddressBookPopup = require('modules/%ModuleName%/js/popups/EditAddressBookPopup.js')
;

/**
 * @constructor
 */
function CAddressBooksSettingsFormView()
{
	CAbstractSettingsFormView.call(this);
	
	this.addressBooks = ko.observableArray([]);
	this.loading = ko.observable(false);
}

_.extendOwn(CAddressBooksSettingsFormView.prototype, CAbstractSettingsFormView.prototype);

CAddressBooksSettingsFormView.prototype.ViewTemplate = '%ModuleName%_AddressBooksSettingsFormView';

CAddressBooksSettingsFormView.prototype.onShow = function ()
{
	this.populate();
};

CAddressBooksSettingsFormView.prototype.populate = function ()
{
	this.loading(true);
	Ajax.send('Contacts', 'GetStorages', {}, function (oResponse) {
		this.loading(false);
		if (_.isArray(oResponse && oResponse.Result)) {
			const userPublicId = App.getUserPublicId();
			this.addressBooks(oResponse.Result.filter(addressbook => {
				return addressbook?.Display && addressbook?.Owner === userPublicId && addressbook.Id !== 'personal';
			}));
		} else {
			Api.showErrorByCode(oResponse);
		}
	}, this);
};

CAddressBooksSettingsFormView.prototype.addAddressBook = function ()
{
	Popups.showPopup(EditAddressBookPopup, [this.populate.bind(this)]);
};

CAddressBooksSettingsFormView.prototype.editAddressBook = function (iEntityId, sDisplayName)
{
	Popups.showPopup(EditAddressBookPopup, [this.populate.bind(this), iEntityId, sDisplayName]);
};

CAddressBooksSettingsFormView.prototype.deleteAddressBook = function (iEntityId, sDisplayName)
{
	var
		sConfirm = TextUtils.i18n('%MODULENAME%/CONFIRM_DELETE_ADDRESSBOOK', { 'NAME': sDisplayName }),
		fOnConfirm = _.bind(function (bOk) {
			if (bOk)
			{
				Ajax.send('Contacts', 'DeleteAddressBook', {'EntityId': iEntityId}, function (oResponse) {
					if (!oResponse || !oResponse.Result) {
						Api.showErrorByCode(oResponse);
					}
					this.populate();
				}, this);
			}
		}, this)
	;

	Popups.showPopup(ConfirmPopup, [sConfirm, fOnConfirm]);
};

module.exports = new CAddressBooksSettingsFormView();
