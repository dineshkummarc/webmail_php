'use strict';

module.exports = function (oAppData) {
	var
		_ = require('underscore'),
				
		TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
				
		App = require('%PathToCoreWebclientModule%/js/App.js'),
		
		Settings = require('modules/%ModuleName%/js/Settings.js')
	;

	Settings.init(oAppData);
	
	if (App.isUserNormalOrTenant() && Settings.EnableModule && _.isArray(Settings.Scopes) && Settings.Scopes.length > 0)
	{
		return {
			start: function (ModulesManager) {
				ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [
					function () { return require('modules/%ModuleName%/js/views/FacebookSettingsFormView.js'); },
					Settings.HashModuleName,
					TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB')
				]);
			}
		};
	}
	
	return null;
};
