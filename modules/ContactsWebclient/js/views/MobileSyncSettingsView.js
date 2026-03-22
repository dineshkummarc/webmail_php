'use strict';

var
	ko = require('knockout'),

	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
 * @constructor
 */
function CMobileSyncSettingsView()
{
	this.AddressBooks = ko.observableArray([]);
}

CMobileSyncSettingsView.prototype.ViewTemplate = '%ModuleName%_MobileSyncSettingsView';

/**
 * @param {Object} oDav
 */
CMobileSyncSettingsView.prototype.populate = function (oDav)
{
	if (Array.isArray(oDav.Contacts)) {
		const aAddressBooks = oDav.Contacts.map((oItem) => {
			return {
				'DisplayName': oItem.Name,
				'DavUrl': oItem.Url
			};
		})

		this.AddressBooks(aAddressBooks);
	}
};

module.exports = new CMobileSyncSettingsView();
