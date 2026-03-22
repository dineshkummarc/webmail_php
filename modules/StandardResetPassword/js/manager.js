'use strict';


module.exports = function (oAppData) {
	var
		_ = require('underscore'),

		TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),

		App = require('%PathToCoreWebclientModule%/js/App.js'),
		
		Settings = require('modules/%ModuleName%/js/Settings.js'),
		
		bAnonymousUser = App.getUserRole() === Enums.UserRole.Anonymous
	;
	
	Settings.init(oAppData);
	
	if (!App.isPublic() && bAnonymousUser)
	{
		var fAddControllersToLoginScreen = function () {
			App.subscribeEvent('AnonymousUserForm::PopulateBeforeButtonsControllers', _.bind(function (oParams) {
				if (_.isFunction(oParams.RegisterBeforeButtonsController) && (oParams.ModuleName === 'StandardLoginFormWebclient' || oParams.ModuleName === 'MailLoginFormWebclient'))
				{
					oParams.RegisterBeforeButtonsController(require('modules/%ModuleName%/js/views/ForgotPasswordController.js'));
				}
			}, this));
		};
		
		if (App.isMobile())
		{
			return {
				start: function (ModulesManager)
				{
					fAddControllersToLoginScreen();
				},
				getScreens: function () {
					var
						oScreens = {},
						oLoginScreenView = require('modules/%ModuleName%/js/views/ResetPasswordFormView.js')
					;
					if (oLoginScreenView)
					{
						oLoginScreenView.ViewTemplate = '%ModuleName%_ResetPasswordMobileFormView';
						oScreens[Settings.HashModuleName] = function () {
							return oLoginScreenView;
						};
					}
					return oScreens;
				}
			};
		}
		else
		{
			return {
				start: function (ModulesManager)
				{
					fAddControllersToLoginScreen();
				},
				getScreens: function () {
					var oScreens = {};
					oScreens[Settings.HashModuleName] = function () {
						return require('modules/%ModuleName%/js/views/ResetPasswordFormView.js');
					};
					return oScreens;
				}
			};
		}
	}
	else if (App.isUserNormalOrTenant() && !App.isMobile())
	{
		return {
			start: function (ModulesManager) {
				if (ModulesManager.isModuleEnabled('SecuritySettingsWebclient'))
				{
					ModulesManager.run(
						'SecuritySettingsWebclient',
						'registerSecuritySettingsSection', 
						[
							function () {
								var oResetPasswordSettingsFormView = require('modules/%ModuleName%/js/views/ResetPasswordSettingsFormView.js');
								oResetPasswordSettingsFormView.ViewTemplate = '%ModuleName%_ResetPasswordSettingsSectionFormView';
								return oResetPasswordSettingsFormView;
							},
							'%ModuleName%'
						]
					);
				}
				else
				{
					ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [
						function () { return require('modules/%ModuleName%/js/views/ResetPasswordSettingsFormView.js'); },
						Settings.HashModuleName, 
						TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB')
					]);
				}
			}
		};
	}

	return null;
};
