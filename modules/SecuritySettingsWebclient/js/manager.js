'use strict';

module.exports = function (oAppData) {
	var
		App = require('%PathToCoreWebclientModule%/js/App.js'),

		TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
		
		Settings = require('modules/%ModuleName%/js/Settings.js')
	;

	Settings.init(oAppData);

	if (App.isUserNormalOrTenant())
	{
		return {
			start: function (ModulesManager) {
				ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [
					function () { return require('modules/%ModuleName%/js/views/SecuritySettingsFormView.js'); },
					'security',
					TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB')
				]);
			},
			registerSecuritySettingsSection: function (fGetTabView, sModuleName) {
				var SettingsView = require('modules/%ModuleName%/js/views/SecuritySettingsFormView.js');
				SettingsView.registerTabSection(fGetTabView, sModuleName);
			}
		};
	}
	
	return null;
};
