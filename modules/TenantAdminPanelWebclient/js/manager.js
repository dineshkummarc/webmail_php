'use strict';

module.exports = function (oAppData) {
	var
		App = require('%PathToCoreWebclientModule%/js/App.js'),
		
		TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),

		Settings = require('modules/%ModuleName%/js/Settings.js'),
		
		HeaderItemView = null
	;
	
	Settings.init(oAppData);
	
	var sAppHash = Settings.HashModuleName; 
	
	if (App.getUserRole() === Enums.UserRole.TenantAdmin)
	{
		return {
			/**
			 * Returns list of functions that are return module screens.
			 * 
			 * @returns {Object}
			 */
			getScreens: function ()
			{
				var oScreens = {};
				
				oScreens[sAppHash] = function () {
					return require('modules/%ModuleName%/js/views/MainView.js');
				};
				
				return oScreens;
			},

			/**
			 * Returns object of header item view of the module.
			 * 
			 * @returns {Object}
			 */
			getHeaderItem: function ()
			{
				var 
					CHeaderItemView = require('%PathToCoreWebclientModule%/js/views/CHeaderItemView.js'),
					oHeaderEntry = 	{};
				;

				if (HeaderItemView === null) {
					HeaderItemView = new CHeaderItemView(TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB'));
				}
				oHeaderEntry = {
					item: HeaderItemView,
					name: sAppHash
				};
				
				return oHeaderEntry;
			}
		};
	}
	
	return null;
};
