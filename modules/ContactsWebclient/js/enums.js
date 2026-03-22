'use strict';

var
	_ = require('underscore'),

	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),

	Enums = {}
;

/**
 * @enum {number}
 */
Enums.SharedAddressbookAccess = {
	'NoAccess': 0,
	'Write': 1,
	'Read': 2
};

if (typeof window.Enums === 'undefined')
{
	window.Enums = {};
}

_.extendOwn(window.Enums, Enums);

module.exports = {
	init(appData, serverModuleName) {
		const appDataSection = appData[serverModuleName];
		window.Enums.ContactsPrimaryEmail = Types.pObject(appDataSection && appDataSection.PrimaryEmail);
		window.Enums.ContactsPrimaryPhone = Types.pObject(appDataSection && appDataSection.PrimaryPhone);
		window.Enums.ContactsPrimaryAddress = Types.pObject(appDataSection && appDataSection.PrimaryAddress);
		window.Enums.ContactSortField = Types.pObject(appDataSection && appDataSection.SortField);
	}
};
