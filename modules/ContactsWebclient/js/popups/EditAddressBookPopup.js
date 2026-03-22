'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	CAbstractPopup = require('%PathToCoreWebclientModule%/js/popups/CAbstractPopup.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js')	
;

/**
 * @constructor
 */
function CEditAddressBookPopup()
{
	CAbstractPopup.call(this);
	
	this.createMode = ko.observable(false);
	this.saving = ko.observable(false);

	this.addressBookName = ko.observable('');
	this.addressBookNameFocus = ko.observable(false);
	
	this.fCallback = null;
}

_.extendOwn(CEditAddressBookPopup.prototype, CAbstractPopup.prototype);

CEditAddressBookPopup.prototype.PopupTemplate = '%ModuleName%_EditAddressBookPopup';

/**
 * @param {Function} fCallback
 */
CEditAddressBookPopup.prototype.onOpen = function (fCallback, iEntityId, sDisplayName)
{
	this.fCallback = fCallback;
	this.iEntityId = iEntityId;
	this.createMode(!this.iEntityId);
	this.addressBookName(sDisplayName || '');
	this.addressBookNameFocus(true);
};

CEditAddressBookPopup.prototype.save = function ()
{
	if (_.isEmpty(this.addressBookName())) {
		Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_ADDRESSBOOK_NAME_EMPTY'));
		this.addressBookNameFocus(true);
		return;
	}

	var
		sMethod = this.createMode() ? 'CreateAddressBook' : 'UpdateAddressBook',
		oParameters = { 'AddressBookName': this.addressBookName() }
	;
	if (!this.createMode()) {
		oParameters.EntityId = this.iEntityId;
	}
	this.addressBookNameFocus(false);
	this.saving(true);
	Ajax.send('Contacts', sMethod, oParameters, this.onSaveAddressBookResponse, this);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CEditAddressBookPopup.prototype.onSaveAddressBookResponse = function (oResponse, oRequest)
{
	this.saving(false);
	if (!oResponse || !oResponse.Result)
	{
		var sError = this.createMode()
				? TextUtils.i18n('%MODULENAME%/ERROR_CREATE_ADDRESSBOOK')
				: TextUtils.i18n('%MODULENAME%/ERROR_UPDATE_ADDRESSBOOK');
		Api.showErrorByCode(oResponse, sError);
	}
	else
	{
		var sReport = this.createMode()
				? TextUtils.i18n('%MODULENAME%/REPORT_CREATE_ADDRESSBOOK')
				: TextUtils.i18n('%MODULENAME%/REPORT_UPDATE_ADDRESSBOOK');
		Screens.showReport(sReport);
		if (_.isFunction(this.fCallback)) {
			this.fCallback();
		}
		this.closePopup();
	}
};

CEditAddressBookPopup.prototype.cancelPopup = function ()
{
	if (!this.saving())
	{
		this.closePopup();
	}
};

module.exports = new CEditAddressBookPopup();
