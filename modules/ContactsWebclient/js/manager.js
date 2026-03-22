'use strict';

module.exports = function (oAppData) {
	var
		_ = require('underscore'),
		
		TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
		
		App = require('%PathToCoreWebclientModule%/js/App.js'),
		ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
		Routing = require('%PathToCoreWebclientModule%/js/Routing.js'),
		
		ContactsCache = require('modules/%ModuleName%/js/Cache.js'),
		EnumsDeclarator = require('modules/%ModuleName%/js/enums.js'),
		Settings = require('modules/%ModuleName%/js/Settings.js'),
		Utils = require('modules/%ModuleName%/js/utils/Links.js'),
		
		SuggestionsAutocomplete = require('modules/%ModuleName%/js/SuggestionsAutocomplete.js'),
		SuggestionsMethods = {
			getSuggestionsAutocompleteCallback: function (suggestParameters) {
				var
					fSuggestionsAutocompleteCallback = function (oRequest, fResponse) {
						SuggestionsAutocomplete.callback(oRequest, fResponse, suggestParameters);
					},
					//TODO: Remove this wrapper after adding PGP-keys to team storage
					fSuggestionsAutocompleteFilteredCallback = ModulesManager.run(
						'OpenPgpWebclient',
						'getSuggestionsAutocompleteFilteredCallback',
						[fSuggestionsAutocompleteCallback]
					)
				;
				return fSuggestionsAutocompleteFilteredCallback ?
					fSuggestionsAutocompleteFilteredCallback
					:
					fSuggestionsAutocompleteCallback;
			},
			getSuggestionsAutocompleteDeleteHandler: function () {
				return SuggestionsAutocomplete.deleteHandler;
			},
			getContactsByEmails: function (aEmails, fCallBack) {
				ContactsCache.getContactsByEmails(aEmails, fCallBack);
			}
		},
				
		fRegisterMessagePaneControllerOnStart = function () {
			App.subscribeEvent('MailWebclient::RegisterMessagePaneController', function (fRegisterMessagePaneController) {
				fRegisterMessagePaneController(require('modules/%ModuleName%/js/views/VcardAttachmentView.js'), 'BeforeMessageBody');
			});
		},

		ContactsCardsMethods = {
			applyContactsCards: function ($Addresses) {
				var ContactCard = require('modules/%ModuleName%/js/ContactCard.js');
				ContactCard.applyTo($Addresses);
			}
		}
	;

	let contactsViewInstance = null;

	const getContactsViewInstance = () => {
		if(!contactsViewInstance) {
			const CContactsView = require('modules/%ModuleName%/js/views/CContactsView.js');
			contactsViewInstance = new CContactsView();
		}
		return contactsViewInstance;
	};

	EnumsDeclarator.init(oAppData, Settings.ServerModuleName);
	Settings.init(oAppData);

	if (!ModulesManager.isModuleAvailable(Settings.ServerModuleName))
	{
		return null;
	}

	if (App.isUserNormalOrTenant())
	{
		if (App.isMobile())
		{
			return _.extend({
				start: fRegisterMessagePaneControllerOnStart,
				getSettings: function () {
					return Settings;
				},
				getHeaderItemView: function () {
					return require('modules/%ModuleName%/js/views/HeaderItemView.js');
				}
			}, SuggestionsMethods);
		}
		else if (App.isNewTab())
		{
			return _.extend({
				start: fRegisterMessagePaneControllerOnStart
			}, SuggestionsMethods, ContactsCardsMethods);
		}
		else
		{
			require('modules/%ModuleName%/js/MainTabExtMethods.js');
			
			return _.extend({
				start: function (ModulesManager) {
					ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [
						function () { return require('modules/%ModuleName%/js/views/ContactsSettingsFormView.js'); }, 
						Settings.HashModuleName, 
						TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB')
					]);
					if (Settings.AllowAddressBooksManagement) {
						ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [
							function () { return require('modules/%ModuleName%/js/views/AddressBooksSettingsFormView.js'); }, 
							'manage-addressbooks', 
							TextUtils.i18n('%MODULENAME%/LABEL_MANAGE_ADDRESSBOOK_SETTINGS_TAB')
						]);
					}
					fRegisterMessagePaneControllerOnStart();

					App.broadcastEvent('RegisterNewItemElement', {
						'title': TextUtils.i18n('%MODULENAME%/ACTION_NEW_CONTACT'),
						'handler': () => {
							const contactsViewInstance = getContactsViewInstance();
							const command = contactsViewInstance.newContactCommand;

							// check if we are on contacts screen or not
							if (!window.location.hash.startsWith('#' + Settings.HashModuleName)) {
								// if team book was selected before we need to redirect to personal contacts
								if (contactsViewInstance.selectedStorage() === 'team') {
									Routing.setHash(Utils.getContacts('personal', '', '', 1, '', 'create-contact'));
								} else {
									window.location.hash = Settings.HashModuleName
								}
							}

							if (contactsViewInstance.showPersonalContacts()) {
								if (command.canExecute()) {
									command()
								}
							} else {
								const loadingListSubscription = contactsViewInstance.showPersonalContacts.subscribe((v) => {
									if(v) {
										const command = contactsViewInstance.newContactCommand
										if (command.canExecute()) {
											command()
										}
										loadingListSubscription.dispose()
									}
								})
							}
						},
						'className': 'item_contacts',
						'order': 3,
						'column': 1
					});
				},
				getScreens: function () {
					return { [Settings.HashModuleName]: getContactsViewInstance };
				},
				getHeaderItem: function () {
					return {
						item: require('modules/%ModuleName%/js/views/HeaderItemView.js'),
						name: Settings.HashModuleName
					};
				},
				isTeamContactsAllowed: function () {
					return Utils.checkStorageExists('team');
				},
				getMobileSyncSettingsView: function () {
					return require('modules/%ModuleName%/js/views/MobileSyncSettingsView.js');
				}
			}, SuggestionsMethods, ContactsCardsMethods);
		}
	}
	
	return null;
};
