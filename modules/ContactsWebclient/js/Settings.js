'use strict';

var
	_ = require('underscore'),
	
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js')
;

module.exports = {
	ServerModuleName: 'Contacts',
	HashModuleName: 'contacts',
	
	ContactsPerPage: 20,
	ImportContactsLink: '',
	AddressBooks: [],
	Storages: [],
	DefaultStorage: 'personal',
	AllowAddressBooksManagement: false,
	ContactsSortBy: {},

	ImportExportFormats: [],
	SaveVcfServerModuleName: '',

	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData[this.ServerModuleName];
		
		if (!_.isEmpty(oAppDataSection))
		{
			this.ContactsPerPage = Types.pPositiveInt(oAppDataSection.ContactsPerPage, this.ContactsPerPage);
			this.ImportContactsLink = Types.pString(oAppDataSection.ImportContactsLink, this.ImportContactsLink);

			var aStorages = Types.pArray(oAppDataSection.Storages, this.Storages);
			this.AddressBooks = _.filter(aStorages, function (oStorage) {
				return oStorage.CTag !== undefined;
			});

			this.Storages = aStorages;
			if (this.Storages.length > 0)
			{
				this.Storages.push({'Id': 'all', 'DisplayName': TextUtils.i18n('%MODULENAME%/LABEL_STORAGE_ALL')});
				this.Storages.push({'Id': 'group'});
			}
			this.AllowAddressBooksManagement = Types.pBool(oAppDataSection.AllowAddressBooksManagement, this.AllowAddressBooksManagement);
			
			this.ImportExportFormats = Types.pArray(oAppDataSection.ImportExportFormats, this.ImportExportFormats);
			this.SaveVcfServerModuleName = Types.pString(oAppDataSection.SaveVcfServerModuleName, this.SaveVcfServerModuleName);

			this.ContactsSortBy = this.getSortConfig(Types.pObject(oAppDataSection.ContactsSortBy));
		}
	},
	
	/**
	 * Updates contacts per page after saving to server.
	 * 
	 * @param {number} iContactsPerPage
	 */
	update: function (iContactsPerPage)
	{
		this.ContactsPerPage = iContactsPerPage;
	},

	getSortConfig: function (config)
	{
		return {
			Allow: Types.pBool(config?.Allow),
			DisplayOptions: config?.DisplayOptions || [],
			DefaultSortBy: Types.pEnum(Enums.ContactSortField[config?.DefaultSortBy], Enums.ContactSortField, Enums.ContactSortField.Name),
			DefaultSortOrder: Types.pEnum(Enums.SortOrder[config?.DefaultSortOrder], Enums.SortOrder, Enums.SortOrder.Desc),
		}
	}
};
