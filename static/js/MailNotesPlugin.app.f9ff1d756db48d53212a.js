(self["webpackChunkafterlogic_aurora_platform"] = self["webpackChunkafterlogic_aurora_platform"] || []).push([[8],{

/***/ "MNQE":
/*!**************************************************************!*\
  !*** ./modules/MailNotesPlugin/js/views/CMessagePaneView.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  MailCache = null;

/**
 * @constructor
 * @param {object} oMailCache
 * @param {function} fRouteMessageView
 */
function CMessagePaneView(oMailCache, fRouteMessageView) {
  MailCache = oMailCache;
  this.fRouteMessageView = fRouteMessageView;
  this.currentMessage = MailCache.currentMessage;
  this.messageText = ko.observable('');
  this.messageText.focused = ko.observable(false);
  ko.computed(function () {
    this.messageText();
    this.messageText.focused(true);
  }, this).extend({
    throttle: 5
  });
  ;
  this.sMessageUid = '';
  this.sMessageText = '';
  this.isLoading = ko.observable(false);
  this.isSaving = ko.observable(false);
  this.createMode = ko.observable(false);
  this.saveButtonText = ko.computed(function () {
    return this.isSaving() ? TextUtils.i18n('COREWEBCLIENT/ACTION_SAVE_IN_PROGRESS') : TextUtils.i18n('COREWEBCLIENT/ACTION_SAVE');
  }, this);
  this.bBinded = false;
}
CMessagePaneView.prototype.ViewTemplate = 'MailNotesPlugin_MessagePaneView';
CMessagePaneView.prototype.ViewConstructorName = 'CMessagePaneView';
CMessagePaneView.prototype.onShow = function () {
  this.currentMessageSubscription = this.currentMessage.subscribe(this.onCurrentMessageSubscribe, this);
  this.bShown = true;
};
CMessagePaneView.prototype.onHide = function () {
  var _this$currentMessageS;
  (_this$currentMessageS = this.currentMessageSubscription) === null || _this$currentMessageS === void 0 || _this$currentMessageS.dispose();
  this.bShown = false;
};

/**
 * Checks if there are changes in message pane.
 * @returns {Boolean}
 */
CMessagePaneView.prototype.hasUnsavedChanges = function () {
  var oMessage = this.currentMessage();
  return (!oMessage || this.sMessageUid === oMessage.uid()) && this.sMessageText !== this.messageText();
};

/**
 * Discards changes in message pane.
 */
CMessagePaneView.prototype.discardChanges = function () {
  if (!this.currentMessage()) {
    this.sMessageUid = '';
    this.sMessageText = '';
    this.messageText('');
  }
};
CMessagePaneView.prototype.getSubjectFromText = function (sText) {
  var aText = sText.split(/\r\n|\n/i),
    sSubject = _.find(aText, function (sTextPart) {
      return $.trim(sTextPart) !== '';
    });
  sSubject = $.trim(sSubject);
  if (sSubject.length > 50) {
    sSubject = sSubject.substring(0, 50);
  }
  return sSubject;
};
CMessagePaneView.prototype.onCurrentMessageSubscribe = function () {
  var oMessage = this.currentMessage();
  if (oMessage) {
    if (oMessage.isPlain()) {
      this.messageText(oMessage.text());
    } else {
      this.messageText(TextUtils.htmlToPlain(oMessage.text()));
    }
    this.sMessageUid = oMessage.uid();
    this.sMessageText = this.messageText();
    this.isLoading(oMessage.uid() !== '' && !oMessage.completelyFilled());
    if (!oMessage.completelyFilled()) {
      var sbscr = oMessage.completelyFilled.subscribe(function () {
        this.onCurrentMessageSubscribe();
        sbscr.dispose();
      }, this);
    }
    this.isSaving(false);
  } else {
    this.sMessageUid = '';
    this.sMessageText = '';
    this.messageText('');
  }
};

/**
 * @param {Object} $MailViewDom
 */
CMessagePaneView.prototype.onBind = function ($MailViewDom) {
  if (!this.bBinded) {
    ModulesManager.run('SessionTimeoutWeblient', 'registerFunction', [_.bind(function () {
      this.saveNote();
    }, this)]);
    $(document).on('keydown', $.proxy(function (ev) {
      if (ev.ctrlKey && ev.keyCode === Enums.Key.s) {
        ev.preventDefault();
        this.saveNote();
      }
    }, this));
    this.bBinded = true;
  }
};
CMessagePaneView.prototype.onRoute = function (aParams, oParams) {
  var oIdentifiers = MailCache.getMessageActualIdentifiers(MailCache.currentAccountId(), oParams.Folder, oParams.Uid);
  MailCache.setCurrentMessage(oIdentifiers.iAccountId, oIdentifiers.sFolder, oIdentifiers.sUid);
  if (oParams.Custom === 'create-note') {
    this.messageText('');
    this.createMode(true);
  } else {
    this.createMode(false);
  }
  this.isSaving(false);
};
CMessagePaneView.prototype.saveNote = function () {
  if (this.createMode()) {
    this.saveNewNote();
  } else {
    this.saveEditedNote();
  }
};
CMessagePaneView.prototype.saveNewNote = function () {
  var oFolder = MailCache.getCurrentFolder(),
    oParameters = {
      'AccountID': MailCache.currentAccountId(),
      'FolderFullName': oFolder.fullName(),
      'Text': TextUtils.encodeHtml(this.messageText()).replace(/\n/g, '<br />').replace(/\r\n/g, '<br />'),
      'Subject': this.getSubjectFromText(this.messageText())
    };
  this.isSaving(true);
  this.sMessageText = this.messageText();
  Ajax.send('MailNotesPlugin', 'SaveNote', oParameters, function (oResponse) {
    this.isSaving(false);
    if (oResponse.Result) {
      if (this.bShown) {
        var sbscr = MailCache.messagesLoading.subscribe(function () {
          if (this.bShown && !MailCache.messagesLoading() && !this.currentMessage()) {
            this.fRouteMessageView(oParameters.FolderFullName, oResponse.Result);
            sbscr.dispose();
          }
        }, this);
      }
    } else {
      Api.showErrorByCode(oResponse, TextUtils.i18n('MAILNOTESPLUGIN/ERROR_NOTE_SAVING'));
    }
    MailCache.executeCheckMail(true);
  }, this);
};
CMessagePaneView.prototype.saveEditedNote = function (oMessage) {
  if (!oMessage) {
    oMessage = this.currentMessage();
  }
  if (oMessage) {
    var oParameters = {
        'AccountID': MailCache.currentAccountId(),
        'FolderFullName': oMessage.folder(),
        'MessageUid': oMessage.uid(),
        'Text': TextUtils.encodeHtml(this.messageText()).replace(/\n/g, '<br />').replace(/\r\n/g, '<br />'),
        'Subject': this.getSubjectFromText(this.messageText())
      },
      oFolder = MailCache.getFolderByFullName(MailCache.currentAccountId(), oMessage.folder());
    oFolder.markDeletedByUids([oMessage.uid()]);
    MailCache.excludeDeletedMessages();
    this.isSaving(true);
    this.sMessageText = this.messageText();
    Ajax.send('MailNotesPlugin', 'SaveNote', oParameters, function (oResponse) {
      this.isSaving(false);
      if (oResponse.Result) {
        if (this.bShown) {
          var sbscr = MailCache.messagesLoading.subscribe(function () {
            if (this.bShown && !MailCache.messagesLoading() && !this.currentMessage()) {
              this.fRouteMessageView(oParameters.FolderFullName, oResponse.Result);
              sbscr.dispose();
            }
          }, this);
        }
      } else {
        Api.showErrorByCode(oResponse, TextUtils.i18n('MAILNOTESPLUGIN/ERROR_NOTE_SAVING'));
      }
      MailCache.executeCheckMail(true);
    }, this);
  }
};
CMessagePaneView.prototype.cancel = function () {
  this.sMessageText = this.messageText();
  ModulesManager.run('MailWebclient', 'setCustomRouting', ['Notes', 1, '', '', '', '']);
};
module.exports = CMessagePaneView;

/***/ }),

/***/ "cR1d":
/*!***********************************************************!*\
  !*** ./modules/CoreWebclient/js/views/CHeaderItemView.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ko = __webpack_require__(/*! knockout */ "p09A"),
  Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "ioSH");
function CHeaderItemView(sLinkText) {
  this.sName = '';
  this.visible = ko.observable(true);
  this.baseHash = ko.observable('');
  this.hash = ko.observable('');
  this.linkText = ko.observable(sLinkText);
  this.isCurrent = ko.observable(false);
  this.recivedAnim = ko.observable(false).extend({
    'autoResetToFalse': 500
  });
  this.unseenCount = ko.observable(0);
  this.allowChangeTitle = ko.observable(false); // allows to change favicon and browser title when browser is inactive
  this.inactiveTitle = ko.observable('');
  this.excludedHashes = ko.observableArray([]);
}
CHeaderItemView.prototype.ViewTemplate = 'CoreWebclient_HeaderItemView';
CHeaderItemView.prototype.setName = function (sName) {
  this.sName = sName.toLowerCase();
  if (this.baseHash() === '') {
    this.hash(Routing.buildHashFromArray([sName.toLowerCase()]));
    this.baseHash(this.hash());
  } else {
    this.hash(this.baseHash());
  }
};
module.exports = CHeaderItemView;

/***/ }),

/***/ "oq0M":
/*!**********************************************************!*\
  !*** ./modules/MailWebclient/js/views/HeaderItemView.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  CAbstractHeaderItemView = __webpack_require__(/*! modules/CoreWebclient/js/views/CHeaderItemView.js */ "cR1d"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Cache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8");
function CHeaderItemView() {
  CAbstractHeaderItemView.call(this, TextUtils.i18n('MAILWEBCLIENT/ACTION_SHOW_MAIL'));
  this.unseenCount = Cache.newMessagesCount;
  this.inactiveTitle = ko.computed(function () {
    return TextUtils.i18n('MAILWEBCLIENT/HEADING_UNREAD_MESSAGES_BROWSER_TAB_PLURAL', {
      'COUNT': this.unseenCount()
    }, null, this.unseenCount()) + ' - ' + AccountList.getEmail();
  }, this);
  this.accounts = ko.computed(function () {
    return _.map(AccountList.collection(), function (oAccount) {
      return {
        bCurrent: oAccount.isCurrent(),
        sText: Settings.UserLoginPartInAccountDropdown ? oAccount.email().split('@')[0] : oAccount.email(),
        changeAccount: oAccount.changeAccount.bind(oAccount)
      };
    });
  }, this);
  if (Settings.ShowEmailAsTabName) {
    this.linkText = ko.computed(function () {
      var oCurrent = _.find(this.accounts(), function (oAccountData) {
        return oAccountData.bCurrent;
      });
      return oCurrent ? oCurrent.sText : TextUtils.i18n('MAILWEBCLIENT/HEADING_BROWSER_TAB');
    }, this);
  }
  this.mainHref = ko.computed(function () {
    if (this.isCurrent()) {
      return 'javascript: void(0);';
    }
    return this.hash();
  }, this);
}
_.extendOwn(CHeaderItemView.prototype, CAbstractHeaderItemView.prototype);
CHeaderItemView.prototype.ViewTemplate = 'MailWebclient_HeaderItemView';
var HeaderItemView = new CHeaderItemView();
HeaderItemView.allowChangeTitle(true);
module.exports = HeaderItemView;

/***/ }),

/***/ "pXCx":
/*!***********************************************!*\
  !*** ./modules/MailNotesPlugin/js/manager.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "M4cL");


module.exports = function (oAppData) {
  var _ = __webpack_require__(/*! underscore */ "C3HO"),
    ko = __webpack_require__(/*! knockout */ "p09A"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
    App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
    ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
    Settings = __webpack_require__(/*! modules/MailNotesPlugin/js/Settings.js */ "xZf/"),
    sNotesFolderName = 'Notes',
    CHeaderItemView = __webpack_require__(/*! modules/CoreWebclient/js/views/CHeaderItemView.js */ "cR1d"),
    headerItem = new CHeaderItemView(TextUtils.i18n('MAILNOTESPLUGIN/LABEL_FOLDER_NOTES')),
    notesFullHash = ko.observable(null),
    mailFullHash = ko.observable(null),
    headerItemData = {
      item: headerItem,
      name: Settings.HashModuleName
    };
  var sNotesFullName = sNotesFolderName;
  Settings.init(oAppData);
  function getHeaderItemHashes() {
    try {
      var _ModulesManager$run = ModulesManager.run('MailWebclient', 'getSettings'),
        HashModuleName = _ModulesManager$run.HashModuleName;
      var accountHash = ModulesManager.run('MailWebclient', 'getAccountList').getCurrent().hash();
      return {
        'mail': "#".concat(HashModuleName || 'mail', "/").concat(accountHash, "/INBOX"),
        'notes': "#".concat(HashModuleName || 'mail', "/").concat(accountHash, "/").concat(sNotesFullName)
      };
    } catch (error) {
      return null;
    }
  }
  function setNotesFolder(koFolderList) {
    var sNameSpace = koFolderList().sNamespaceFolder;
    var sDelimiter = koFolderList().sDelimiter;
    if (sNameSpace !== '') {
      sNotesFullName = sNameSpace + sDelimiter + sNotesFolderName;
    } else {
      sNotesFullName = sNotesFolderName;
    }
    var oNotesFolder = koFolderList().getFolderByFullName(sNotesFullName);
    if (oNotesFolder) {
      oNotesFolder.displayName = ko.observable(TextUtils.i18n('MAILNOTESPLUGIN/LABEL_FOLDER_NOTES'));
      oNotesFolder.usedAs = ko.observable(TextUtils.i18n('MAILNOTESPLUGIN/LABEL_USED_AS_NOTES'));
    }
  }
  if (App.isUserNormalOrTenant()) {
    var oModule = {
      start: function start(oModulesManager) {
        $('html').addClass('MailNotesPlugin');

        // If separate Notes button is enabled, then getting the Notes folder full hash for tabsbar
        if (Settings.DisplayNotesButton) {
          var mailCache = ModulesManager.run('MailWebclient', 'getMailCache');
          setNotesFolder(mailCache.folderList);

          // TODO: uncomment when module supports opening create form by direct link
          // notesFullHash(getHeaderItemHashes());
          mailCache.folderList.subscribe(function () {
            var fullHashes = getHeaderItemHashes();
            if (fullHashes !== null && fullHashes !== void 0 && fullHashes.notes) {
              headerItem.hash(fullHashes.notes);
              notesFullHash(fullHashes.notes);
              mailFullHash(fullHashes.mail);
            }
          });
        }

        // attempt to register a Create Note button
        App.broadcastEvent('RegisterNewItemElement', {
          'title': TextUtils.i18n('MAILNOTESPLUGIN/ACTION_NEW_NOTE'),
          'handler': function handler() {
            window.location.hash = '#mail';
            if (notesFullHash()) {
              window.location.hash = notesFullHash() + '/custom%3Acreate-note';
            } else {
              var notesFullPathSubscribtion = notesFullHash.subscribe(function () {
                window.location.hash = notesFullHash() + '/custom%3Acreate-note';
                notesFullPathSubscribtion.dispose();
              });
            }
          },
          'className': 'item_notes',
          'order': 2,
          'column': 1
        });
        App.subscribeEvent('MailWebclient::ConstructView::before', function (oParams) {
          if (oParams.Name === 'CMailView') {
            var koFolderList = oParams.MailCache.folderList,
              koCurrentFolder = ko.computed(function () {
                return oParams.MailCache.folderList().currentFolder();
              }),
              CMessagePaneView = __webpack_require__(/*! modules/MailNotesPlugin/js/views/CMessagePaneView.js */ "MNQE"),
              oMessagePane = new CMessagePaneView(oParams.MailCache, _.bind(oParams.View.routeMessageView, oParams.View));
            setNotesFolder(koFolderList);
            koFolderList.subscribe(function () {
              setNotesFolder(koFolderList);
            });
            koCurrentFolder.subscribe(function () {
              var sFullName = koCurrentFolder() ? koCurrentFolder().fullName() : '';
              if (sFullName === sNotesFullName) {
                oParams.View.setCustomPreviewPane('MailNotesPlugin', oMessagePane);
                oParams.View.setCustomBigButton('MailNotesPlugin', function () {
                  oModulesManager.run('MailWebclient', 'setCustomRouting', [sFullName, 1, '', '', '', 'create-note']);
                }, TextUtils.i18n('MAILNOTESPLUGIN/ACTION_NEW_NOTE'));
                oParams.View.resetDisabledTools('MailNotesPlugin', ['spam', 'move', 'mark']);
              } else {
                oParams.View.removeCustomPreviewPane('MailNotesPlugin');
                oParams.View.removeCustomBigButton('MailNotesPlugin');
                oParams.View.resetDisabledTools('MailNotesPlugin', []);
              }
            });
          }
        });
        App.subscribeEvent('MailWebclient::ConstructView::after', function (oParams) {
          if (oParams.Name === 'CMessageListView' && oParams.MailCache) {
            var koCurrentFolder = ko.computed(function () {
              return oParams.MailCache.folderList().currentFolder();
            });
            koCurrentFolder.subscribe(function () {
              var sFullName = koCurrentFolder() ? koCurrentFolder().fullName() : '';
              if (sFullName === sNotesFullName) {
                oParams.View.customMessageItemViewTemplate('MailNotesPlugin_MessageItemView');
              } else {
                oParams.View.customMessageItemViewTemplate('');
              }
            });
          }
        });
        App.subscribeEvent('MailWebclient::MessageDblClick::before', _.bind(function (oParams) {
          if (oParams.Message && oParams.Message.folder() === sNotesFullName) {
            oParams.Cancel = true;
          }
        }, this));
      }
    };

    // Adding Notes button to tabsbar if it's needed
    if (Settings.DisplayNotesButton) {
      oModule.getHeaderItem = function () {
        try {
          var fullHashes = getHeaderItemHashes();
          headerItem.baseHash(fullHashes === null || fullHashes === void 0 ? void 0 : fullHashes.notes);
          return headerItemData;
        } catch (error) {
          return null;
        }
      };

      // getting MailWebclient's HeaderItemView and overriding excludedHashes and mainHref properties
      App.subscribeEvent('MailWebclient::GetHeaderItemView', function (params) {
        var mailHeaderItem = __webpack_require__(/*! modules/MailWebclient/js/views/HeaderItemView.js */ "oq0M");
        mailHeaderItem.excludedHashes = function () {
          return notesFullHash() ? [notesFullHash()] : [];
        };
        mailHeaderItem.mainHref = ko.computed(function () {
          return mailHeaderItem.isCurrent() ? 'javascript: void(0);' : mailFullHash();
        }, this);
        params.HeaderItemView = mailHeaderItem;
      });
    }
    return oModule;
  }
  return null;
};

/***/ }),

/***/ "xZf/":
/*!************************************************!*\
  !*** ./modules/MailNotesPlugin/js/Settings.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9");
module.exports = {
  ServerModuleName: 'MailNotesPlugin',
  HashModuleName: 'notes',
  DisplayNotesButton: false,
  /**
   * Initializes settings from AppData object sections.
   * 
   * @param {Object} oAppData Object contained modules settings.
   */
  init: function init(oAppData) {
    var oSection = oAppData['MailNotesPlugin'];
    if (!_.isEmpty(oSection)) {
      this.DisplayNotesButton = Types.pBool(oSection.DisplayNotesButton, this.DisplayNotesButton);
    }
  },
  /**
   * Updates new settings values after saving on server.
   * 
   * @param {object} parameters 
   */
  update: function update(parameters) {
    this.DisplayNotesButton = Types.pBool(parameters.DisplayNotesButton, this.DisplayNotesButton);
  }
};

/***/ })

}]);