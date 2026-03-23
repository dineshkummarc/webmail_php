'use strict';

module.exports = function (oAppData) {
	const
		_ = require('underscore'),
		ko = require('knockout'),
		
		TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
		App = require('%PathToCoreWebclientModule%/js/App.js'),
		ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
		Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),
		Routing = require('%PathToCoreWebclientModule%/js/Routing.js'),

		Settings = require('modules/%ModuleName%/js/Settings.js'),

		sNotesFolderName = 'Notes',

		CHeaderItemView = require('%PathToCoreWebclientModule%/js/views/CHeaderItemView.js'),
		headerItem = new CHeaderItemView(TextUtils.i18n('%MODULENAME%/LABEL_FOLDER_NOTES')),

		notesFullHash = ko.observable(null),
		mailFullHash = ko.observable(null),
		headerItemData = {
			item: headerItem,
			name: Settings.HashModuleName,
		}
	;

	let	sNotesFullName = sNotesFolderName

	Settings.init(oAppData)
	
	function getHeaderItemHashes() {
		try {
			const { HashModuleName } = ModulesManager.run('MailWebclient', 'getSettings')
			const accountList = ModulesManager.run('MailWebclient', 'getAccountList')
			const accountHash = accountList.getDefault().email() ? accountList.getDefault().hash() : accountList.collection()[0]?.hash()
			return {
				'mail': `#${HashModuleName || 'mail'}/${accountHash}/INBOX`,
				'notes': `#${HashModuleName || 'mail'}/${accountHash}/${sNotesFullName}`
			}
		} catch (error) {
			return null
		}
	}

	function setNotesFolder(koFolderList) {
		const sNameSpace = koFolderList().sNamespaceFolder
		const sDelimiter = koFolderList().sDelimiter
	
		if (sNameSpace !== '') {
			sNotesFullName = sNameSpace + sDelimiter + sNotesFolderName
		} else {
			sNotesFullName = sNotesFolderName
		}
		const oNotesFolder = koFolderList().getFolderByFullName(sNotesFullName)
		if (oNotesFolder) {
			oNotesFolder.displayName = ko.observable(TextUtils.i18n('%MODULENAME%/LABEL_FOLDER_NOTES'))
			oNotesFolder.usedAs = ko.observable(TextUtils.i18n('%MODULENAME%/LABEL_USED_AS_NOTES'))
		}
	}

	if (App.isUserNormalOrTenant()) {
		const oModule = {
			start: function (oModulesManager) {
				$('html').addClass('MailNotesPlugin')

				// If separate Notes button is enabled, then getting the Notes folder full hash for tabsbar
				if (Settings.DisplayNotesButton) {
					const mailCache = ModulesManager.run('MailWebclient', 'getMailCache')
					setNotesFolder(mailCache.folderList)

					// TODO: uncomment when module supports opening create form by direct link
					// notesFullHash(getHeaderItemHashes());
					mailCache.folderList.subscribe(() => {
						const fullHashes = getHeaderItemHashes()
						if (fullHashes?.notes) {
							headerItem.hash(fullHashes.notes)
							notesFullHash(fullHashes.notes)
							mailFullHash(fullHashes.mail)
						}
					})
				}

				// attempt to register a Create Note button
				App.broadcastEvent('RegisterNewItemElement', {
                    'title': TextUtils.i18n('%MODULENAME%/ACTION_NEW_NOTE'),
                    'handler': () => {
                        window.location.hash = '#mail'
                        if (notesFullHash()) {
                            window.location.hash = notesFullHash() + '/custom%3Acreate-note'
                        } else {
                            const notesFullPathSubscribtion = notesFullHash.subscribe(function () {
                                window.location.hash = notesFullHash() + '/custom%3Acreate-note'
                                notesFullPathSubscribtion.dispose()
                            })
                        }
                    },
					'className': 'item_notes',
					'order': 2,
					'column': 1
				})

				App.subscribeEvent('MailWebclient::ConstructView::before', function (oParams) {
					if (oParams.Name === 'CMailView')
					{
						const
							koFolderList = oParams.MailCache.folderList,
							koCurrentFolder = ko.computed(function () {
								return koFolderList().currentFolder()
							}),
							CMessagePaneView = require('modules/%ModuleName%/js/views/CMessagePaneView.js'),
							oMessagePane = new CMessagePaneView(oParams.MailCache, _.bind(oParams.View.routeMessageView, oParams.View), oParams.View)
						;
						setNotesFolder(koFolderList)
						

						Screens.screens.subscribe(function (oScreens) {
							_.each(oScreens, function (oScreen) {
								if (oScreen.sModuleName === 'MailWebclient' && 
									oScreen.ViewConstructorName === 'CMailView' && 
									oScreen.$viewDom && 
									Settings.DisplayNotesButton) {
									oScreen.$viewDom.addClass('NotesLayoutSeparated')
								}
							})
						})
						
						koFolderList.subscribe(function () {
							setNotesFolder(koFolderList)
						});
						koCurrentFolder.subscribe(function () {
							const sFullName = koCurrentFolder() ? koCurrentFolder().fullName() : ''
							const screen = oParams.View.$viewDom
							if (sFullName === sNotesFullName) {
								screen.addClass('NotesLayout')
								
								oParams.View.setCustomPreviewPane('%ModuleName%', oMessagePane)
								oParams.View.setCustomBigButton('%ModuleName%', function () {
									oModulesManager.run('MailWebclient', 'setCustomRouting', [sFullName, 1, '', '', '', 'create-note'])
								}, TextUtils.i18n('%MODULENAME%/ACTION_NEW_NOTE'))
								oParams.View.resetDisabledTools('%ModuleName%', ['spam', 'move', 'mark'])
								
								var aParams = Routing.getCurrentHashArray();
								aParams.shift(); // remove 'mail' part
								oMessagePane.onRoute(aParams);
							} else {
								screen.removeClass('NotesLayout')
								
								oParams.View.removeCustomPreviewPane('%ModuleName%')
								oParams.View.removeCustomBigButton('%ModuleName%')
								oParams.View.resetDisabledTools('%ModuleName%', [])
							}
						})
					}
				})

				App.subscribeEvent('MailWebclient::ConstructView::after', function (oParams) {
					if (oParams.Name === 'CMessageListView' && oParams.MailCache) {
						const koCurrentFolder = ko.computed(function () {
							return oParams.MailCache.folderList().currentFolder();
						})

						koCurrentFolder.subscribe(function () {
							const sFullName = koCurrentFolder() ? koCurrentFolder().fullName() : ''
							if (sFullName === sNotesFullName) {
								oParams.View.customMessageItemViewTemplate('%ModuleName%_MessageItemView')
							} else {
								oParams.View.customMessageItemViewTemplate('')
							}
						})
					}
				})

				App.subscribeEvent('MailWebclient::MessageDblClick::before', _.bind(function (oParams) {
					const MailSettings = ModulesManager.run('MailWebclient', 'getSettings');
					const separatedMailMode = !!(MailSettings && MailSettings.layoutMode && MailSettings.layoutMode() === window.Enums.LayoutMode.Separated);
					if (oParams.Message && oParams.Message.folder() === sNotesFullName && !separatedMailMode) {
						oParams.Cancel = true
					}
				}, this))
			},
		}

		// Adding Notes button to tabsbar if it's needed
		if (Settings.DisplayNotesButton) {
			oModule.getHeaderItem = function () {
				try {
					const fullHashes = getHeaderItemHashes()
					headerItem.baseHash(fullHashes?.notes)
					return headerItemData
				} catch (error) {
					return null
				}
			}

			// getting MailWebclient's HeaderItemView and overriding excludedHashes and mainHref properties
			App.subscribeEvent('MailWebclient::GetHeaderItemView', function (params) {
				const mailHeaderItem = require('modules/MailWebclient/js/views/HeaderItemView.js')

				mailHeaderItem.excludedHashes = function () {
					return notesFullHash() ? [notesFullHash()] : []
				}
				
				mailHeaderItem.mainHref = ko.computed(function () {
					return mailHeaderItem.isCurrent() ? 'javascript: void(0);' : mailFullHash()
				}, this)

				params.HeaderItemView = mailHeaderItem
			})
		}
		return oModule
	}
	
	return null
}
