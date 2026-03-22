(self["webpackChunkafterlogic_aurora_platform"] = self["webpackChunkafterlogic_aurora_platform"] || []).push([[1],{

/***/ "/1gm":
/*!*******************************************************************!*\
  !*** ./modules/ContactsWebclient/js/views/VcardAttachmentView.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  ContactsCache = __webpack_require__(/*! modules/ContactsWebclient/js/Cache.js */ "sqgh"),
  CVcardModel = __webpack_require__(/*! modules/ContactsWebclient/js/models/VcardModel.js */ "ZQr9");
function CVcardAttachmentView() {
  this.vcard = ko.observable(null);
}
CVcardAttachmentView.prototype.ViewTemplate = 'ContactsWebclient_VcardAttachmentView';

/**
 * Receives properties of the message that is displaying in the message pane. 
 * It is called every time the message is changing in the message pane.
 * Receives null if there is no message in the pane.
 * 
 * @param {Object|null} oMessageProps Information about message in message pane.
 * @param {Object} oMessageProps.oVcard
 */
CVcardAttachmentView.prototype.doAfterPopulatingMessage = function (oMessageProps) {
  var aExtend = oMessageProps && Types.isNonEmptyArray(oMessageProps.aExtend) ? oMessageProps.aExtend : [],
    oFoundRawVcard = _.find(aExtend, function (oRawVcard) {
      return oRawVcard['@Object'] === 'Object/Aurora\\Modules\\Mail\\Classes\\Vcard';
    });
  if (oFoundRawVcard) {
    var oVcard = ContactsCache.getVcard(oFoundRawVcard.File);
    if (!oVcard) {
      oVcard = new CVcardModel();
      oVcard.parse(oFoundRawVcard);
    }
    this.vcard(oVcard);
  } else {
    this.vcard(null);
  }
};
module.exports = new CVcardAttachmentView();

/***/ }),

/***/ "/u0n":
/*!*************************************************************!*\
  !*** ./modules/ContactsWebclient/js/views/CContactsView.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  FileSaver = __webpack_require__(/*! modules/CoreWebclient/js/vendors/FileSaver.js */ "VhVF"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  CoreAjax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  CJua = __webpack_require__(/*! modules/CoreWebclient/js/CJua.js */ "hr1f"),
  CSelector = __webpack_require__(/*! modules/CoreWebclient/js/CSelector.js */ "DSoz"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "ioSH"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CAbstractScreenView = __webpack_require__(/*! modules/CoreWebclient/js/views/CAbstractScreenView.js */ "db2p"),
  CPageSwitcherView = __webpack_require__(/*! modules/CoreWebclient/js/views/CPageSwitcherView.js */ "FZR+"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "MYiO"),
  LinksUtils = __webpack_require__(/*! modules/ContactsWebclient/js/utils/Links.js */ "HV+X"),
  Ajax = __webpack_require__(/*! modules/ContactsWebclient/js/Ajax.js */ "ZbnD"),
  ContactsCache = __webpack_require__(/*! modules/ContactsWebclient/js/Cache.js */ "sqgh"),
  Settings = __webpack_require__(/*! modules/ContactsWebclient/js/Settings.js */ "pY6S"),
  CContactListItemModel = __webpack_require__(/*! modules/ContactsWebclient/js/models/CContactListItemModel.js */ "Nul0"),
  CContactModel = __webpack_require__(/*! modules/ContactsWebclient/js/models/CContactModel.js */ "tPG8"),
  CGroupModel = __webpack_require__(/*! modules/ContactsWebclient/js/models/CGroupModel.js */ "rIhA"),
  CImportView = __webpack_require__(/*! modules/ContactsWebclient/js/views/CImportView.js */ "B2PQ"),
  Enums = window.Enums;

/**
 * @constructor
 */
function CContactsView() {
  var _this2 = this;
  CAbstractScreenView.call(this, 'ContactsWebclient');
  this.shareAddressbookControlView = ModulesManager.run('SharedContacts', 'getShareAddressbookControlView'), this.browserTitle = ko.observable(TextUtils.i18n('CONTACTSWEBCLIENT/HEADING_BROWSER_TAB'));
  this.contactCount = ko.observable(0);
  this.uploaderArea = ko.observable(null);
  this.dragActive = ko.observable(false);
  this.bDragActiveComp = ko.computed(function () {
    return this.dragActive();
  }, this);
  this.sImportContactsLink = Settings.ImportContactsLink;
  this.loadingList = ko.observable(false);
  this.preLoadingList = ko.observable(false);
  this.loadingList.subscribe(function (bLoading) {
    this.preLoadingList(bLoading);
  }, this);
  this.loadingViewPane = ko.observable(false);
  this.showPersonalContacts = ko.observable(false);
  this.showTeamContacts = ko.observable(false);
  this.showSharedToAllContacts = ko.observable(false);
  this.showAllContacts = ko.computed(function () {
    return 1 < [this.showPersonalContacts() ? '1' : '', this.showTeamContacts() ? '1' : '', this.showSharedToAllContacts() ? '1' : ''].join('').length;
  }, this);
  this.recivedAnimPersonal = ko.observable(false).extend({
    'autoResetToFalse': 500
  });
  this.recivedAnimShared = ko.observable(false).extend({
    'autoResetToFalse': 500
  });
  this.recivedAnimTeam = ko.observable(false).extend({
    'autoResetToFalse': 500
  });
  this.isAddressBookSelected = ko.observable(false);
  this.isSelectedAddressbookSharedForReading = ko.observable(false);
  this.isTeamStorageSelected = ko.observable(false);
  this.isCustomAddressBookSelected = ko.observable(false);
  this.disableDropToPersonal = ko.observable(false);
  this.disableDropToSharedWithAll = ko.observable(false);
  this.disableDropToCustomAddressBook = ko.observable(false);
  this.selectedStorageValue = ko.observable('');
  this.selectedStorage = ko.computed({
    'read': function read() {
      return this.selectedStorageValue();
    },
    'write': function write(sValue) {
      var _this = this;
      if (sValue !== '') {
        this.selectedStorageValue(LinksUtils.checkStorageExists(sValue) ? sValue : Settings.DefaultStorage);
        if (this.selectedStorageValue() !== 'group') {
          this.selectedGroupInList(null);
          this.selectedItem(null);
          this.selector.listCheckedOrSelected(false);
          this.currentGroupUUID('');
        }
        var selectedAddressbook = this.addressBooks().find(function (addressbook) {
          return addressbook.Id === _this.selectedStorageValue();
        });
        this.isAddressBookSelected(!!selectedAddressbook);
        this.isSelectedAddressbookSharedForReading(selectedAddressbook && selectedAddressbook.Shared && selectedAddressbook.Access === Enums.SharedAddressbookAccess.Read);
        var addressBookParts = this.selectedStorageValue().split('-');
        this.isCustomAddressBookSelected(addressBookParts.length > 0 && addressBookParts[0] === 'addressbook');
        this.isTeamStorageSelected(this.selectedStorageValue() === 'team');
        this.disableDropToPersonal(this.selectedStorageValue() === 'team');
        this.disableDropToSharedWithAll(this.selectedStorageValue() === 'team');
        this.disableDropToCustomAddressBook(this.selectedStorageValue() === 'team');
      }
    },
    'owner': this
  });
  this.addressBooks = ko.observable(Settings.AddressBooks);
  App.subscribeEvent('ReceiveAjaxResponse::after', function (oParams) {
    if (oParams.Request.Module === 'Contacts' && oParams.Request.Method === 'GetStorages' && _.isArray(oParams.Response && oParams.Response.Result)) {
      this.addressBooks(oParams.Response.Result);
      var aBaseStorages = _.filter(Settings.Storages, function (oStorage) {
        return oStorage.Display === undefined;
      });
      Settings.Storages = aBaseStorages.concat(this.addressBooks());
    }
  }.bind(this));
  this.manageAddressBooksHash = ko.computed(function () {
    if (ModulesManager.isModuleEnabled('SettingsWebclient') && Settings.AllowAddressBooksManagement) {
      return Routing.buildHashFromArray(['settings', 'manage-addressbooks']);
    }
    return '#';
  }, this);
  this.selectedGroupInList = ko.observable(null);
  this.selectedGroupInList.subscribe(function () {
    var oPrev = this.selectedGroupInList();
    if (oPrev) {
      oPrev.selected(false);
    }
  }, this, 'beforeChange');
  this.selectedGroupInList.subscribe(function (oGroup) {
    if (oGroup && this.showPersonalContacts()) {
      oGroup.selected(true);
      this.selectedStorage('group');
      this.requestContactList();
    }
  }, this);
  this.selectedGroup = ko.observable(null);
  this.selectedContact = ko.observable(null);
  this.selectedGroupEmails = ko.observableArray([]);
  this.currentGroupUUID = ko.observable('');
  this.oContactModel = new CContactModel();
  this.oGroupModel = new CGroupModel();
  this.oImportView = new CImportView(this);
  this.selectedOldItem = ko.observable(null);
  this.selectedItem = ko.computed({
    'read': function read() {
      return this.selectedContact() || this.selectedGroup() || null;
    },
    'write': function write(oItem) {
      if (oItem instanceof CContactModel) {
        this.selectedGroup(null);
        this.selectedContact(oItem);
      } else if (oItem instanceof CGroupModel) {
        this.selectedContact(null);
        this.selectedGroup(oItem);
        this.currentGroupUUID(oItem.uuid());
      } else {
        this.selectedGroup(null);
        this.selectedContact(null);
      }
      this.loadingViewPane(false);
    },
    'owner': this
  });
  this.collection = ko.observableArray([]);
  this.contactUidForRequest = ko.observable('');
  this.collection.subscribe(function () {
    if (this.collection().length > 0 && this.contactUidForRequest() !== '') {
      this.requestContact(this.contactUidForRequest());
      this.contactUidForRequest('');
    }
  }, this);
  this.bSortEnabled = Settings.ContactsSortBy && Settings.ContactsSortBy.Allow && Settings.ContactsSortBy.DisplayOptions && Settings.ContactsSortBy.DisplayOptions.length > 0;
  this.sortBy = ko.observable(Settings.ContactsSortBy.DefaultSortBy);
  this.sortOrder = ko.observable(Settings.ContactsSortBy.DefaultSortOrder);
  this.aSortList = [];
  if (this.bSortEnabled) {
    _.each(Enums.ContactSortField, function (iValue, sName) {
      if (Settings.ContactsSortBy.DisplayOptions.indexOf(sName) >= 0) {
        this.aSortList.push({
          sText: TextUtils.i18n('CONTACTSWEBCLIENT/SORT_OPTION_' + sName.toUpperCase()),
          sSortBy: iValue
        });
      }
    }.bind(this));
  }
  this.isSearchFocused = ko.observable(false);
  this.searchInput = ko.observable('');
  this.search = ko.observable('');
  this.groupUidForRequest = ko.observable('');
  this.groupFullCollection = ko.observableArray([]);
  this.groupFullCollection.subscribe(function () {
    if (this.groupUidForRequest()) {
      this.onViewGroupClick(this.groupUidForRequest());
    }
  }, this);
  this.selectedContact.subscribe(function (oContact) {
    if (oContact) {
      var aGroupUUIDs = oContact.groups();
      _.each(this.groupFullCollection(), function (oItem) {
        oItem.checked(oItem && 0 <= $.inArray(oItem.UUID(), aGroupUUIDs));
      });
    }
  }, this);
  this.pageSwitcherLocked = ko.observable(false);
  this.oPageSwitcher = new CPageSwitcherView(0, Settings.ContactsPerPage);
  this.oPageSwitcher.currentPage.subscribe(function () {
    if (!this.pageSwitcherLocked()) {
      this.changeRouting();
    }
  }, this);
  this.currentPage = ko.observable(1);
  this.search.subscribe(function (sValue) {
    this.searchInput(sValue);
  }, this);
  this.searchSubmitCommand = Utils.createCommand(this, function () {
    this.changeRouting({
      Search: this.searchInput()
    });
  });
  this.searchMessagesInInbox = ModulesManager.run('MailWebclient', 'getSearchMessagesInInbox');
  this.bAllowSearchMessagesInInbox = _.isFunction(this.searchMessagesInInbox);
  this.composeMessageToAddresses = ModulesManager.run('MailWebclient', 'getComposeMessageToAddresses');
  this.bAllowComposeMessageToAddresses = _.isFunction(this.composeMessageToAddresses);
  this.selector = new CSelector(this.collection, _.bind(this.viewContact, this), _.bind(this.deleteContact, this), this.bAllowComposeMessageToAddresses ? _.bind(this.composeMessageToContact, this) : null);
  this.checkAll = this.selector.koCheckAll();
  this.checkAllIncomplite = this.selector.koCheckAllIncomplete();
  this.isCheckedOrSelected = ko.computed(function () {
    return 0 < this.selector.listCheckedOrSelected().length;
  }, this);
  this.isEnableAddContacts = this.isCheckedOrSelected;
  this.isEnableRemoveContactsFromGroup = this.isCheckedOrSelected;
  this.isEnableDeleting = this.isCheckedOrSelected;
  this.isDeleteVisible = ko.computed(function () {
    return !this.isTeamStorageSelected() && (this.showPersonalContacts() && this.selectedStorage() === 'personal' || this.showSharedToAllContacts() && this.selectedStorage() === 'shared' || this.isAddressBookSelected() && !this.isSelectedAddressbookSharedForReading());
  }, this);
  this.isEnableSharing = this.isCheckedOrSelected;
  this.visibleShareCommand = ko.computed(function () {
    return this.showPersonalContacts() && this.showSharedToAllContacts() && this.selectedStorage() === 'personal';
  }, this);
  this.visibleUnshareCommand = ko.computed(function () {
    return this.showPersonalContacts() && this.showSharedToAllContacts() && this.selectedStorage() === 'shared';
  }, this);
  this.isExactlyOneContactSelected = ko.computed(function () {
    return 1 === this.selector.listCheckedOrSelected().length;
  }, this);
  this.isSaving = ko.observable(false);
  this.isEnableCreateContact = ko.computed(function () {
    return !this.isTeamStorageSelected() && !this.isSelectedAddressbookSharedForReading();
  }, this);
  this.newContactCommand = Utils.createCommand(this, this.executeNewContact, this.isEnableCreateContact);
  this.newGroupCommand = Utils.createCommand(this, this.executeNewGroup);
  this.addContactsCommand = Utils.createCommand(this, function () {}, this.isEnableAddContacts);
  this.deleteCommand = Utils.createCommand(this, this.deleteContact, this.isEnableDeleting);
  this.selectedCount = ko.computed(function () {
    var aChecked = _.filter(this.selector.listCheckedOrSelected(), function (oItem) {
      return !oItem.ReadOnly();
    });
    return aChecked.length;
  }, this);
  this.shareCommand = Utils.createCommand(this, this.executeShare, this.isEnableSharing);
  this.removeFromGroupCommand = Utils.createCommand(this, this.executeRemoveFromGroup, this.isEnableRemoveContactsFromGroup);
  this.isImportAllowed = ko.computed(function () {
    return !this.isTeamStorageSelected() && !this.isSelectedAddressbookSharedForReading();
  }, this);
  this.importCommand = Utils.createCommand(this, this.executeImport);
  this.saveCommand = Utils.createCommand(this, this.executeSave);
  this.saveEncryptSignFlagsCommand = Utils.createCommand(this, this.executeSaveEncryptSignFlags, function () {
    return !_this2.isSaving();
  });
  this.updateSharedToAllCommand = Utils.createCommand(this, this.executeUpdateSharedToAll, this.isExactlyOneContactSelected);
  this.composeMessageCommand = Utils.createCommand(this, this.composeMessage, this.isCheckedOrSelected);
  this.selector.listCheckedOrSelected.subscribe(function (aList) {
    this.oGroupModel.newContactsInGroupCount(aList.length);
  }, this);
  this.isSearch = ko.computed(function () {
    return this.search() !== '';
  }, this);
  this.isEmptyList = ko.computed(function () {
    return 0 === this.collection().length;
  }, this);
  this.searchText = ko.computed(function () {
    return TextUtils.i18n('CONTACTSWEBCLIENT/INFO_SEARCH_RESULT', {
      'SEARCH': this.search()
    });
  }, this);
  this.visibleDragNDropToGroupText = ko.computed(function () {
    return !App.isMobile() && this.selectedStorage() === 'group';
  }, this);
  this.selectedPanel = ko.observable(Enums.MobilePanel.Items);
  this.enableExport = ko.computed(function () {
    return this.contactCount() > 0;
  }, this);
  this.aExportData = [];
  _.each(Settings.ImportExportFormats, function (sFormat) {
    if (Types.isNonEmptyString(sFormat)) {
      this.aExportData.push({
        'css': sFormat.toLowerCase(),
        'text': TextUtils.i18n('CONTACTSWEBCLIENT/ACTION_EXPORT_AS', {
          'FORMAT': sFormat.toUpperCase()
        }),
        'command': Utils.createCommand(this, function () {
          this.executeExport(sFormat);
        }, this.enableExport)
      });
    }
  }, this);
  this.visibleCreateOrImportText = ko.computed(function () {
    return this.selectedStorage() !== 'all' && this.selectedStorage() !== 'shared' && this.selectedStorage() !== 'team' && this.selectedStorage() !== 'group';
  }, this);
  this.visibleImportExport = ko.computed(function () {
    return this.aExportData.length > 0;
  }, this);
  this.infoCreateOrImport = this.getCreateOrImportInfo();
  this.listChanged = ko.computed(function () {
    return [this.selectedStorage(), this.currentGroupUUID(), this.search(), this.oPageSwitcher.currentPage(), this.oPageSwitcher.perPage()];
  }, this);
  this.bRefreshContactList = false;
  var afterRemoveContactPgpKeyHandler = function afterRemoveContactPgpKeyHandler() {
    if (_this2.selectedContact() && _this2.selectedContact().edited()) {
      _this2.selectedContact().publicPgpKey('');
      var selectedContactListItem = _this2.collection().find(function (item) {
        return item.UUID() === _this2.selectedContact().uuid();
      });
      if (selectedContactListItem) {
        selectedContactListItem.HasPgpPublicKey(false);
      }
    } else {
      _this2.onUpdateContactResponse({
        Result: true
      });
    }
  };
  this.oPgpKeyControlsView = ModulesManager.run('OpenPgpWebclient', 'getPgpKeyControlsView', [afterRemoveContactPgpKeyHandler]);
  App.broadcastEvent('ContactsWebclient::ConstructView::after', {
    'Name': this.ViewConstructorName,
    'View': this
  });
}
_.extendOwn(CContactsView.prototype, CAbstractScreenView.prototype);
CContactsView.prototype.ViewTemplate = 'ContactsWebclient_ContactsScreenView';
CContactsView.prototype.ViewConstructorName = 'CContactsView';
CContactsView.prototype.executeSort = function (sValue) {
  var sCurrentSort = this.sortBy();
  this.sortBy(sValue);
  if (sCurrentSort === sValue) {
    this.sortOrder(this.sortOrder() === Enums.SortOrder.Asc ? Enums.SortOrder.Desc : Enums.SortOrder.Asc); // Asc: 0, Desc: 1
  } else {
    this.sortOrder(Settings.ContactsSortBy.DefaultSortOrder);
  }
  this.requestContactList();
};
CContactsView.prototype.getFormatDependentText = function (sLangConstantName) {
  switch (Settings.ImportExportFormats.length) {
    case 0:
      return '';
    case 1:
      return TextUtils.i18n('CONTACTSWEBCLIENT/' + sLangConstantName + '_SINGLE_EXT', {
        'EXTENSION': Settings.ImportExportFormats[0].toUpperCase()
      });
    default:
      return TextUtils.i18n('CONTACTSWEBCLIENT/' + sLangConstantName + '_PLURAL_EXT', {
        'EXTENSIONS': _.initial(Settings.ImportExportFormats).join(', ').toUpperCase(),
        'LASTEXTENSION': _.last(Settings.ImportExportFormats).toUpperCase()
      });
  }
};
CContactsView.prototype.getCreateOrImportInfo = function () {
  var sOrImportInfo = this.getFormatDependentText('INFO_OR_IMPORT');
  return TextUtils.i18n('CONTACTSWEBCLIENT/INFO_CREATE') + (sOrImportInfo === '' ? '' : ' ' + sOrImportInfo) + '.';
};
CContactsView.prototype.executeSaveEncryptSignFlags = function (contact) {
  var _this3 = this;
  if (contact instanceof CContactModel) {
    var parameters = {
      UUID: contact.uuid(),
      PgpEncryptMessages: contact.pgpEncryptMessages(),
      PgpSignMessages: contact.pgpSignMessages()
    };
    this.isSaving(true);
    CoreAjax.send('OpenPgpWebclient', 'UpdateContactPublicKeyFlags', parameters, function (response, request) {
      _this3.isSaving(false);
      if (response && response.Result) {
        Screens.showReport(TextUtils.i18n('CONTACTSWEBCLIENT/REPORT_PGP_SETTINGS_SAVED'));
      } else {
        Api.showErrorByCode(response, TextUtils.i18n('CONTACTSWEBCLIENT/ERROR_SAVE_PGP_SETTINGS'));
      }
    });
  }
};

/**
 * @param {Object} oData
 */
CContactsView.prototype.executeSave = function (oData) {
  var oContact = {},
    aList = [],
    oGroup;
  if (oData === this.selectedItem() && this.selectedItem().canBeSave()) {
    if (oData instanceof CContactModel && !oData.readOnly()) {
      _.each(this.groupFullCollection(), function (oItem) {
        if (oItem && oItem.checked()) {
          aList.push(oItem.UUID());
        }
      });
      oData.groups(aList);
      if (this.selectedItem()) {
        ContactsCache.clearInfoAboutEmail(this.selectedItem().email());
      }
      oContact = oData.toObject();
      if (this.selectedStorage() !== 'personal' && oContact.Storage === 'personal') {
        this.recivedAnimPersonal(true);
      }
      if (this.selectedStorage() !== 'team' && oContact.Storage === 'team') {
        this.recivedAnimTeam(true);
      }
      if (oData.isNew()) {
        if (this.selectedStorage() === 'all' || this.selectedStorage() === 'group') {
          // there are no real storages with name 'all' or 'group' on server side
          oContact.Storage = 'personal';
        } else {
          // server subscribers need to know if contact should be in 'personal' or 'shared' storage
          oContact.Storage = this.selectedStorage();
        }
        this.isSaving(true);
        oContact.ViewEmail = oData.email();
        var oParams = {
          Contact: oContact,
          Callback: function (result) {
            if (result.Error) {
              Screens.showError(result.ErrorMessage);
              this.isSaving(false);
            } else {
              Ajax.send('CreateContact', {
                Contact: oContact
              }, this.onCreateContactResponse, this);
            }
          }.bind(this)
        };
        if (!App.broadcastEvent('ContactsWebclient::beforeCreateContactRequest', oParams)) {
          Ajax.send('CreateContact', {
            Contact: oContact
          }, this.onCreateContactResponse, this);
        }
      } else {
        this.isSaving(true);
        oContact.ViewEmail = oData.email();
        var oParams = {
          Contact: oContact,
          Callback: function (result) {
            if (result.Error) {
              Screens.showError(result.ErrorMessage);
              this.isSaving(false);
            } else {
              Ajax.send('UpdateContact', {
                Contact: oContact
              }, this.onUpdateContactResponse, this);
            }
          }.bind(this)
        };
        if (!App.broadcastEvent('ContactsWebclient::beforeUpdateContactRequest', oParams)) {
          Ajax.send('UpdateContact', {
            Contact: oContact
          }, this.onUpdateContactResponse, this);
        }
      }
    } else if (oData instanceof CGroupModel && !oData.readOnly()) {
      var aContactUUIDs = _.map(this.selector.listCheckedOrSelected(), function (oItem) {
        return oItem.UUID();
      });
      this.isSaving(true);
      oGroup = oData.toObject(aContactUUIDs);
      if (!oData.isNew()) {
        oGroup.Contacts = null;
      }
      Ajax.send(oData.isNew() ? 'CreateGroup' : 'UpdateGroup', {
        'Group': oGroup
      }, this.onCreateGroupResponse, this);
    }
  } else {
    Screens.showError(TextUtils.i18n('CONTACTSWEBCLIENT/ERROR_EMAIL_OR_NAME_BLANK'));
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CContactsView.prototype.onCreateContactResponse = function (oResponse, oRequest) {
  this.isSaving(false);
  if (oResponse.Result) {
    this.requestContactList();
    this.viewContact(oResponse.Result.UUID);
    Screens.showReport(TextUtils.i18n('CONTACTSWEBCLIENT/REPORT_CONTACT_SUCCESSFULLY_ADDED'));
    App.broadcastEvent('ContactsWebclient::createContactResponse', [oResponse.Result]);
  } else {
    Api.showErrorByCode(oResponse, TextUtils.i18n('CONTACTSWEBCLIENT/ERROR_CREATE_CONTACT'));
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CContactsView.prototype.onUpdateContactResponse = function (oResponse, oRequest) {
  this.isSaving(false);
  if (oResponse.Result) {
    if (this.selectedContact() && this.selectedContact().edited()) {
      this.selectedContact().edited(false);
    }
    this.requestContactList();
    Screens.showReport(TextUtils.i18n('CONTACTSWEBCLIENT/REPORT_CONTACT_SUCCESSFULLY_UPDATED'));
    App.broadcastEvent('ContactsWebclient::updateContactResponse', [oResponse.Result]);
  } else {
    Api.showErrorByCode(oResponse, TextUtils.i18n('CONTACTSWEBCLIENT/ERROR_UPDATE_CONTACT'));
  }
};
CContactsView.prototype.changeRouting = function (oParams, bReplace) {
  oParams = oParams || {};
  var sStorage = oParams.Storage === undefined ? this.selectedStorage() : oParams.Storage,
    sGroupUUID = oParams.GroupUUID === undefined ? this.currentGroupUUID() : oParams.GroupUUID,
    sSearch = oParams.Search === undefined ? this.search() : oParams.Search,
    iPage = oParams.Page === undefined ? this.oPageSwitcher.currentPage() : oParams.Page,
    sContactUUID = oParams.ContactUUID === undefined ? '' : oParams.ContactUUID,
    sAction = oParams.Action === undefined ? '' : oParams.Action;
  if (bReplace) {
    Routing.replaceHash(LinksUtils.getContacts(sStorage, sGroupUUID, sSearch, iPage, sContactUUID, sAction));
  } else {
    Routing.setHash(LinksUtils.getContacts(sStorage, sGroupUUID, sSearch, iPage, sContactUUID, sAction));
  }
};
CContactsView.prototype.executeNewContact = function () {
  if (this.showPersonalContacts()) {
    var sGroupUUID = this.selectedStorage() === 'group' ? this.currentGroupUUID() : '';
    var sStorage = this.selectedStorage() ? this.selectedStorage() : 'personal';
    this.changeRouting({
      GroupUUID: sGroupUUID,
      Storage: sStorage,
      Action: 'create-contact'
    });
  }
};
CContactsView.prototype.executeNewGroup = function () {
  var sGroupUUID = this.selectedStorage() === 'group' ? this.currentGroupUUID() : '';
  if (this.selector.itemSelected() instanceof CContactListItemModel) {
    this.selector.itemSelected().checked(true);
  }
  this.changeRouting({
    GroupUUID: sGroupUUID,
    Action: 'create-group'
  });
};
CContactsView.prototype.deleteContact = function () {
  var sStorage = this.selectedStorage();
  if (sStorage === 'personal' || sStorage === 'shared' || this.isAddressBookSelected()) {
    var aChecked = _.filter(this.selector.listCheckedOrSelected(), function (oItem) {
        return !oItem.ReadOnly();
      }),
      iCount = aChecked.length,
      sConfirmText = TextUtils.i18n('CONTACTSWEBCLIENT/CONFIRM_DELETE_CONTACTS_PLURAL', {}, null, iCount),
      fDeleteContacts = _.bind(function (bResult) {
        if (bResult) {
          this.deleteContacts(aChecked);
        }
      }, this);
    Popups.showPopup(ConfirmPopup, [sConfirmText, fDeleteContacts, '', TextUtils.i18n('COREWEBCLIENT/ACTION_DELETE')]);
  } else if (sStorage === 'group') {
    this.removeFromGroupCommand();
  }
};
CContactsView.prototype.deleteContacts = function (aChecked) {
  var self = this,
    oMainContact = this.selectedContact(),
    aContactUUIDs = _.map(aChecked, function (oItem) {
      return oItem.UUID();
    });
  if (0 < aContactUUIDs.length) {
    this.preLoadingList(true);
    _.each(aChecked, function (oContact) {
      if (oContact) {
        ContactsCache.clearInfoAboutEmail(oContact.Email());
        if (oMainContact && !oContact.IsGroup() && !oContact.ReadOnly() && !oMainContact.readOnly() && oMainContact.uuid() === oContact.UUID()) {
          oMainContact = null;
          this.selectedContact(null);
        }
      }
    }, this);
    _.each(this.collection(), function (oContact) {
      if (-1 < $.inArray(oContact, aChecked)) {
        oContact.deleted(true);
      }
    });
    _.delay(function () {
      self.collection.remove(function (oItem) {
        return oItem.deleted();
      });
    }, 500);
    Ajax.send('DeleteContacts', {
      'Storage': this.selectedStorage(),
      'UUIDs': aContactUUIDs
    }, function (oResponse) {
      if (!oResponse.Result) {
        Api.showErrorByCode(oResponse, TextUtils.i18n('CONTACTSWEBCLIENT/ERROR_DELETE_CONTACTS'));
      }
      App.broadcastEvent('ContactsWebclient::deleteContactsResponse', [oResponse.Result]);
      this.requestContactList();
    }, this);
    ContactsCache.markVcardsNonexistentByUid(aContactUUIDs);
  }
};
CContactsView.prototype.executeRemoveFromGroup = function () {
  var self = this,
    oGroup = this.selectedGroupInList(),
    aChecked = this.selector.listCheckedOrSelected(),
    aContactUUIDs = _.map(aChecked, function (oItem) {
      return oItem.UUID();
    });
  aContactUUIDs = _.compact(aContactUUIDs);
  if (oGroup && 0 < aContactUUIDs.length) {
    this.preLoadingList(true);
    _.each(this.collection(), function (oContact) {
      if (-1 < $.inArray(oContact, aChecked)) {
        oContact.deleted(true);
      }
    });
    _.delay(function () {
      self.collection.remove(function (oItem) {
        return oItem.deleted();
      });
    }, 500);
    Ajax.send('RemoveContactsFromGroup', {
      'GroupUUID': oGroup.UUID(),
      'ContactUUIDs': aContactUUIDs
    }, function (oResponse) {
      if (!oResponse.Result) {
        Api.showErrorByCode(oResponse);
      }
      this.requestContactList();
    }, this);
  }
};
CContactsView.prototype.executeImport = function () {
  if (this.isAddressBookSelected()) {
    this.changeRouting({
      Storage: this.selectedStorage(),
      GroupUUID: '',
      Search: '',
      Page: 1,
      Action: 'import'
    });
  } else {
    this.changeRouting({
      Storage: 'personal',
      GroupUUID: '',
      Search: '',
      Page: 1,
      Action: 'import'
    });
  }
};
CContactsView.prototype.executeExport = function (sFormat) {
  var aContactUUIDs = _.map(this.selector.listChecked(), function (oContact) {
      return oContact.sUUID;
    }),
    sStorage = this.selectedStorage(),
    sGroupUUID = this.currentGroupUUID(),
    filename = 'export';
  if (sStorage === 'group') {
    sStorage = 'all';
  }
  Ajax.send('Export', {
    'Format': sFormat,
    'Storage': sStorage,
    'GroupUUID': this.currentGroupUUID(),
    'ContactUUIDs': aContactUUIDs
  }, function (oResponse) {
    filename = this.getStorageDisplayName(sStorage);
    if (sGroupUUID) {
      var oGroup = _.find(this.groupFullCollection(), function (oItem) {
        return oItem && oItem.UUID() === sGroupUUID;
      });
      if (oGroup) {
        filename = oGroup.Name();
      }
    }
    var oBlob = new Blob([oResponse.ResponseText], {
      'type': 'text/plain;charset=utf-8'
    });
    FileSaver.saveAs(oBlob, filename + '.' + sFormat, true);
  }, this, {
    Format: 'Raw'
  });
};
CContactsView.prototype.getStorageDisplayName = function (sStorageName) {
  var result = 'contacts';
  var oAddessbook = _.find(Settings.Storages, function (oStorage) {
    return oStorage.Id === sStorageName;
  });
  if (oAddessbook !== null && oAddessbook !== void 0 && oAddessbook.DisplayName) {
    result = oAddessbook.DisplayName;
  }
  return result;
};
CContactsView.prototype.executeCancel = function () {
  var oData = this.selectedItem();
  if (oData) {
    if (oData instanceof CContactModel && !oData.readOnly()) {
      if (oData.isNew()) {
        Routing.setPreviousHash();
      } else if (oData.edited()) {
        oData.edited(false);
        this.requestContact(oData.uuid());
      } else {
        this.changeRouting();
      }
    } else if (oData instanceof CGroupModel && !oData.readOnly()) {
      if (oData.isNew()) {
        Routing.setPreviousHash();
      } else if (oData.edited()) {
        this.selectedItem(this.selectedOldItem());
        oData.edited(false);
      } else {
        this.changeRouting();
      }
    } else if (this.oImportView.visibility()) {
      Routing.setPreviousHash();
    }
  }
};

/**
 * @param {Object} oGroup
 * @param {Array} aContactUUIDs
 */
CContactsView.prototype.executeAddContactsToGroup = function (oGroup, aContactUUIDs) {
  if (oGroup && _.isArray(aContactUUIDs) && 0 < aContactUUIDs.length) {
    oGroup.recivedAnim(true);
    this.executeAddContactsToGroupUUID(oGroup.UUID(), aContactUUIDs);
  }
};

/**
 * @param {string} sGroupUUID
 * @param {Array} aContactUUIDs
 */
CContactsView.prototype.executeAddContactsToGroupUUID = function (sGroupUUID, aContactUUIDs) {
  if (sGroupUUID && _.isArray(aContactUUIDs) && 0 < aContactUUIDs.length) {
    Ajax.send('AddContactsToGroup', {
      'GroupUUID': sGroupUUID,
      'ContactUUIDs': aContactUUIDs
    }, this.onAddContactsToGroupResponse, this);
  }
};
CContactsView.prototype.onAddContactsToGroupResponse = function (oResponse) {
  if (!oResponse.Result) {
    Api.showErrorByCode(oResponse);
  }
  this.requestContactList();
  if (this.selector.itemSelected()) {
    this.requestContact(this.selector.itemSelected().UUID());
  }
};

/**
 * @param {Object} oGroup
 */
CContactsView.prototype.executeAddSelectedContactsToGroup = function (oGroup) {
  var aList = this.selector.listCheckedOrSelected(),
    aContactUUIDs = [];
  if (oGroup && _.isArray(aList) && 0 < aList.length) {
    _.each(aList, function (oItem) {
      if (oItem && !oItem.IsGroup()) {
        aContactUUIDs.push(oItem.UUID());
      }
    }, this);
  }
  this.executeAddContactsToGroup(oGroup, aContactUUIDs);
};

/**
 * @param {Object} oContact
 */
CContactsView.prototype.groupsInContactView = function (oContact) {
  var aResult = [],
    aGroupUUIDs = [];
  if (oContact && !oContact.groupsIsEmpty()) {
    aGroupUUIDs = oContact.groups();
    aResult = _.filter(this.groupFullCollection(), function (oItem) {
      return 0 <= $.inArray(oItem.UUID(), aGroupUUIDs);
    });
  }
  return aResult;
};
CContactsView.prototype.onShow = function () {
  this.selector.useKeyboardKeys(true);
  this.oPageSwitcher.show();
  if (this.oJua) {
    this.oJua.setDragAndDropEnabledStatus(true);
  }
  this.bRefreshContactList = true;
};
CContactsView.prototype.onHide = function () {
  this.selector.listCheckedOrSelected(false);
  this.selector.useKeyboardKeys(false);
  this.selectedItem(null);
  this.oPageSwitcher.hide();
  if (this.oJua) {
    this.oJua.setDragAndDropEnabledStatus(false);
  }
};
CContactsView.prototype.onBind = function () {
  this.selector.initOnApplyBindings('.contact_sub_list .item', '.contact_sub_list .selected.item', '.contact_sub_list .item .custom_checkbox', $('.contact_list', this.$viewDom), $('.contact_list_scroll.scroll-inner', this.$viewDom));
  var self = this;
  this.$viewDom.on('click', '.content .item.add_to .dropdown_helper .item', function () {
    if ($(this).hasClass('new-group')) {
      self.executeNewGroup();
    } else {
      self.executeAddSelectedContactsToGroup(ko.dataFor(this));
    }
  });
  this.showPersonalContacts(LinksUtils.checkStorageExists('personal'));
  this.showTeamContacts(LinksUtils.checkStorageExists('team'));
  this.showSharedToAllContacts(LinksUtils.checkStorageExists('shared'));
  this.selectedStorage(this.selectedStorage());
  this.oImportView.onBind();
  this.requestGroupFullList();
  if (!App.isMobile()) {
    this.hotKeysBind();
  }
  this.initUploader();
};
CContactsView.prototype.hotKeysBind = function () {
  var bFirstContactFlag = false;
  $(document).on('keydown', _.bind(function (ev) {
    var nKey = ev.keyCode,
      oFirstContact = this.collection()[0],
      bListIsFocused = this.isSearchFocused(),
      bFirstContactSelected = false;
    if (this.shown() && !Utils.isTextFieldFocused() && !bListIsFocused && ev && nKey === Enums.Key.s) {
      ev.preventDefault();
      this.searchFocus();
    } else if (oFirstContact) {
      bFirstContactSelected = oFirstContact.selected();
      if (oFirstContact && bListIsFocused && ev && nKey === Enums.Key.Down) {
        this.isSearchFocused(false);
        this.selector.itemSelected(oFirstContact);
        bFirstContactFlag = true;
      } else if (!bListIsFocused && bFirstContactFlag && bFirstContactSelected && ev && nKey === Enums.Key.Up) {
        this.isSearchFocused(true);
        this.selector.itemSelected(false);
        bFirstContactFlag = false;
      } else if (bFirstContactSelected) {
        bFirstContactFlag = true;
      } else if (!bFirstContactSelected) {
        bFirstContactFlag = false;
      }
    }
  }, this));
};
CContactsView.prototype.refreshContactsAndGroups = function () {
  this.requestContactList();
  this.requestGroupFullList();
  // The result is handled in subscription above
  // Ajax.send('GetAddressBooks');
};
CContactsView.prototype.requestContactList = function () {
  var sGroupUUID = this.selectedStorage() === 'group' && this.selectedGroupInList() ? this.selectedGroupInList().UUID() : '',
    sStorage = sGroupUUID !== '' ? 'all' : this.selectedStorage();
  this.loadingList(true);
  Ajax.send('GetContacts', {
    'Offset': (this.currentPage() - 1) * Settings.ContactsPerPage,
    'Limit': Settings.ContactsPerPage,
    'SortField': this.sortBy(),
    'SortOrder': this.sortOrder(),
    'Search': this.search(),
    'GroupUUID': sGroupUUID,
    'Storage': sStorage
  }, this.onGetContactsResponse, this);
};
CContactsView.prototype.requestGroupFullList = function () {
  Ajax.send('GetGroups', null, this.onGetGroupsResponse, this);
};

/**
 * @param {string} sContactUUID
 */
CContactsView.prototype.requestContact = function (sContactUUID) {
  this.loadingViewPane(true);
  var oItem = _.find(this.collection(), function (oItm) {
    return oItm.UUID() === sContactUUID;
  });
  if (oItem) {
    this.selector.itemSelected(oItem);
    Ajax.send('GetContact', {
      'UUID': oItem.UUID()
    }, this.onGetContactResponse, this);
  } else {
    this.contactUidForRequest(sContactUUID);
    this.selector.itemSelected(null);
    this.selectedItem(null);
  }
};

/**
 * @param {Object} oData
 */
CContactsView.prototype.editGroup = function (oData) {
  var oGroup = new CGroupModel();
  oGroup.populate(oData);
  this.selectedOldItem(oGroup);
  oData.edited(true);
};

/**
 * @param {string} sStorage
 */
CContactsView.prototype.changeGroupType = function (sStorage) {
  this.search('');
  this.searchInput('');
  this.changeRouting({
    Storage: sStorage,
    GroupUUID: ''
  });
};

/**
 * @param {Object} mData
 */
CContactsView.prototype.onViewGroupClick = function (mData) {
  this.search('');
  this.searchInput('');
  var sUUID = typeof mData === 'string' ? mData : mData.UUID();
  this.changeRouting({
    Storage: 'group',
    GroupUUID: sUUID
  });
};

/**
 * @param {Array} aParams
 */
CContactsView.prototype.onRoute = function (aParams) {
  var oParams = LinksUtils.parseContacts(aParams),
    bGroupOrSearchChanged = this.selectedStorage() !== oParams.Storage || this.currentGroupUUID() !== oParams.GroupUUID || this.search() !== oParams.Search,
    bGroupFound = true,
    bRequestContacts = this.bRefreshContactList;
  this.bRefreshContactList = false;
  this.pageSwitcherLocked(true);
  if (this.oPageSwitcher.perPage() !== Settings.ContactsPerPage) {
    bRequestContacts = true;
  }
  if (bGroupOrSearchChanged) {
    this.oPageSwitcher.clear();
    this.oPageSwitcher.perPage(Settings.ContactsPerPage);
  } else {
    this.oPageSwitcher.setPage(oParams.Page, Settings.ContactsPerPage);
  }
  this.pageSwitcherLocked(false);
  if (oParams.Page !== this.oPageSwitcher.currentPage()) {
    Routing.replaceHash(LinksUtils.getContacts(oParams.Storage, oParams.GroupUUID, oParams.Search, this.oPageSwitcher.currentPage()));
  }
  if (this.currentPage() !== oParams.Page) {
    this.currentPage(oParams.Page);
    bRequestContacts = true;
  }
  if (this.selectedStorage() !== oParams.Storage && LinksUtils.checkStorageExists(oParams.Storage) && oParams.Storage !== 'group') {
    this.selectedStorage(oParams.Storage);
    bRequestContacts = true;
  } else if (oParams.Storage === 'group' && oParams.Action !== 'create-group' && (this.currentGroupUUID() !== oParams.GroupUUID || oParams.ContactUUID === '')) {
    bGroupFound = this.viewGroup(oParams.GroupUUID);
    if (bGroupFound) {
      bRequestContacts = false;
    } else {
      Routing.replaceHash(LinksUtils.getContacts());
    }
  }
  if (this.search() !== oParams.Search) {
    this.search(oParams.Search);
    bRequestContacts = true;
  }
  this.contactUidForRequest('');
  if (oParams.ContactUUID) {
    if (this.collection().length === 0) {
      this.contactUidForRequest(oParams.ContactUUID);
    } else {
      this.requestContact(oParams.ContactUUID);
    }
  } else if (this.selectedItem() instanceof CContactModel) {
    this.selector.itemSelected(null);
    this.selectedItem(null);
  }
  switch (oParams.Action) {
    case 'create-contact':
      var oGr = this.selectedGroupInList(),
        oNewContactParams = ContactsCache.getNewContactParams();
      this.oContactModel.switchToNew();
      this.oContactModel.groups(oGr ? [oGr.UUID()] : []);
      if (oNewContactParams) {
        _.each(oNewContactParams, function (sValue, sKey) {
          if (_.isFunction(this.oContactModel[sKey])) {
            this.oContactModel[sKey](sValue);
          }
        }, this);
        this.oContactModel.extented(true);
      }
      this.selectedItem(this.oContactModel);
      this.selector.itemSelected(null);
      this.oImportView.visibility(false);
      break;
    case 'create-group':
      this.oGroupModel.switchToNew();
      this.selectedItem(this.oGroupModel);
      this.selector.itemSelected(null);
      this.oImportView.visibility(false);
      break;
    case 'import':
      this.selectedItem(null);
      this.oImportView.visibility(true);
      this.selector.itemSelected(null);
      break;
    default:
      if (!oParams.ContactUUID && !oParams.GroupUUID) {
        this.selectedItem(null);
        this.selector.itemSelected(null);
      }
      this.oImportView.visibility(false);
      break;
  }
  if (bRequestContacts) {
    if (bGroupOrSearchChanged) {
      this.collection([]);
      this.contactCount(0);
    }
    this.requestContactList();
  }
  this.isSaving(false);
};

/**
 * @param {string} sGroupUUID
 */
CContactsView.prototype.viewGroup = function (sGroupUUID) {
  var oGroup = _.find(this.groupFullCollection(), function (oItem) {
    return oItem && oItem.UUID() === sGroupUUID;
  });
  if (oGroup) {
    this.groupUidForRequest('');
    this.oGroupModel.clear();
    this.oGroupModel.uuid(oGroup.UUID()).name(oGroup.Name());
    if (oGroup.IsOrganization()) {
      this.requestGroup(oGroup);
    }
    this.selectedGroupInList(oGroup);
    this.selectedItem(this.oGroupModel);
    this.selector.itemSelected(null);
    this.selector.listCheckedOrSelected(false);
  } else {
    this.groupUidForRequest(sGroupUUID);
  }
  return !!oGroup;
};

/**
 * @param {string} sGroupUUID
 */
CContactsView.prototype.deleteGroup = function (sGroupUUID) {
  if (sGroupUUID) {
    this.groupFullCollection.remove(function (oItem) {
      return oItem && oItem.UUID() === sGroupUUID;
    });
    Ajax.send('DeleteGroup', {
      'UUID': sGroupUUID
    }, function (oResponse) {
      if (!oResponse.Result) {
        Api.showErrorByCode(oResponse);
      }
      this.requestGroupFullList();
    }, this);
    this.changeGroupType(Settings.DefaultStorage);
  }
};

/**
 * @param {Object} oGroup
 */
CContactsView.prototype.mailGroup = function (oGroup) {
  if (this.bAllowComposeMessageToAddresses && oGroup) {
    Ajax.send('GetContacts', {
      'Storage': 'all',
      'Offset': 0,
      'Limit': 200,
      'SortField': Enums.ContactSortField.Name,
      'GroupUUID': oGroup.uuid()
    }, function (oResponse) {
      var aList = oResponse && oResponse.Result && oResponse.Result.List,
        aEmails = Types.isNonEmptyArray(aList) ? _.compact(_.map(aList, function (oRawContactItem) {
          var oContactItem = new CContactListItemModel();
          oContactItem.parse(oRawContactItem);
          return oContactItem.Email() !== '' ? oContactItem.getFullEmail() : '';
        })) : [],
        sEmails = aEmails.join(', ');
      if (sEmails !== '') {
        this.composeMessageToAddresses(sEmails);
      }
    }, this);
  }
};

/**
 * @param {Object} oContact
 */
CContactsView.prototype.dragAndDropHelper = function (oContact) {
  if (oContact) {
    oContact.checked(true);
  }
  var oSelected = this.selector.itemSelected(),
    oHelper = Utils.draggableItems(),
    nCount = this.selector.listCheckedOrSelected().length,
    aUids = 0 < nCount ? _.map(this.selector.listCheckedOrSelected(), function (oItem) {
      return oItem.UUID();
    }) : [];
  if (oSelected && !oSelected.checked()) {
    oSelected.checked(true);
  }
  oHelper.data('drag-contatcs-storage', this.selectedStorage());
  oHelper.data('drag-contatcs-uids', aUids);
  $('.count-text', oHelper).text(TextUtils.i18n('CONTACTSWEBCLIENT/LABEL_DRAG_CONTACTS_PLURAL', {
    'COUNT': nCount
  }, null, nCount));
  return oHelper;
};

/**
 * @param {Object} oToGroup
 * @param {Object} oEvent
 * @param {Object} oUi
 */
CContactsView.prototype.contactsDrop = function (oToGroup, oEvent, oUi) {
  if (oToGroup) {
    var oHelper = oUi && oUi.helper ? oUi.helper : null,
      aUids = oHelper ? oHelper.data('drag-contatcs-uids') : null;
    if (null !== aUids) {
      Utils.uiDropHelperAnim(oEvent, oUi);
      this.executeAddContactsToGroup(oToGroup, aUids);
    }
  }
};
CContactsView.prototype.contactsDropToGroupType = function (sDropStorage, oEvent, oUi) {
  var oHelper = oUi && oUi.helper,
    sDragStorage = oHelper && oHelper.data('drag-contatcs-storage') || null,
    aUids = oHelper && oHelper.data('drag-contatcs-uids') || null;
  if (null !== aUids && null !== sDragStorage && sDropStorage !== sDragStorage) {
    Utils.uiDropHelperAnim(oEvent, oUi);
    this.executeShare();
  }
};
CContactsView.prototype.contactsDropToAddressbook = function (sDropStorage, oEvent, oUi) {
  var oHelper = oUi && oUi.helper,
    sDragStorage = oHelper && oHelper.data('drag-contatcs-storage') || null,
    aUids = oHelper && oHelper.data('drag-contatcs-uids') || null;
  if (null !== aUids && null !== sDragStorage && sDropStorage !== sDragStorage) {
    Utils.uiDropHelperAnim(oEvent, oUi);
    Ajax.send('MoveContactsToStorage', {
      'FromStorage': sDragStorage,
      'ToStorage': sDropStorage,
      'UUIDs': aUids
    }, function () {
      this.selector.listCheckedOrSelected(false);
      this.requestContactList();
    }, this);
  }
};
CContactsView.prototype.searchFocus = function () {
  if (this.selector.useKeyboardKeys() && !Utils.isTextFieldFocused()) {
    this.isSearchFocused(true);
  }
};

/**
 * @param {mixed} mContact
 */
CContactsView.prototype.viewContact = function (mContact) {
  if (mContact) {
    var sGroupUUID = this.selectedStorage() === 'group' ? this.currentGroupUUID() : '',
      sContactUUID = typeof mContact === 'string' ? mContact : mContact.UUID();
    this.changeRouting({
      GroupUUID: sGroupUUID,
      ContactUUID: sContactUUID
    });
  }
};

/**
 * @param {Object} oContact
 */
CContactsView.prototype.composeMessageToContact = function (oContact) {
  var sEmail = oContact ? oContact.getFullEmail() : '';
  if (sEmail !== '') {
    this.composeMessageToAddresses(sEmail);
  }
};
CContactsView.prototype.composeMessage = function () {
  var aList = this.selector.listCheckedOrSelected(),
    aEmails = Types.isNonEmptyArray(aList) ? _.compact(_.map(aList, function (oItem) {
      return oItem.Email() !== '' ? oItem.getFullEmail() : '';
    })) : [],
    sEmails = aEmails.join(', ');
  if (sEmails !== '') {
    this.composeMessageToAddresses(sEmails);
  }
};
CContactsView.prototype.onClearSearchClick = function () {
  // initiation empty search
  this.searchInput('');
  this.searchSubmitCommand();
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CContactsView.prototype.onGetContactResponse = function (oResponse, oRequest) {
  var oResult = oResponse.Result;
  if (oResult) {
    var oObject = new CContactModel(),
      oSelected = this.selector.itemSelected();
    oObject.parse(oResult);
    if (oSelected && oSelected.UUID() === oObject.uuid()) {
      if (this.selectedContact() instanceof CContactModel && oObject instanceof CContactModel && this.selectedContact().uuid() === oObject.uuid()) {
        oObject.edited(this.selectedContact().edited());
      }
      this.selectedItem(oObject);
    }
  } else {
    Api.showErrorByCode(oResponse);
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CContactsView.prototype.onGetContactsResponse = function (oResponse, oRequest) {
  var oResult = oResponse.Result;
  if (oResult) {
    var iContactCount = Types.pInt(oResult.ContactCount),
      aNewCollection = Types.isNonEmptyArray(oResult.List) ? _.compact(_.map(oResult.List, function (oRawContactItem) {
        var oContactItem = new CContactListItemModel();
        oContactItem.parse(oRawContactItem);
        return oContactItem;
      })) : [],
      oSelected = this.selector.itemSelected(),
      oNewSelected = oSelected ? _.find(aNewCollection, function (oContactItem) {
        return oSelected.UUID() === oContactItem.UUID();
      }) : null,
      aChecked = this.selector.listChecked(),
      aCheckedIds = aChecked && 0 < aChecked.length ? _.map(aChecked, function (oItem) {
        return oItem.UUID();
      }) : [];
    if (Types.isNonEmptyArray(aCheckedIds)) {
      _.each(aNewCollection, function (oContactItem) {
        oContactItem.checked(-1 < $.inArray(oContactItem.UUID(), aCheckedIds));
      });
    }
    this.collection(aNewCollection);
    this.oPageSwitcher.setCount(iContactCount);
    this.contactCount(iContactCount);
    if (oNewSelected) {
      this.selector.itemSelected(oNewSelected);
      this.requestContact(oNewSelected.UUID());
    } else if (oSelected) {
      this.changeRouting({}, true);
    }
    this.selectedGroupEmails(this.selectedGroup() ? _.uniq(_.flatten(_.map(this.collection(), function (oContactItem) {
      return oContactItem.aEmails;
    }))) : []);
  } else {
    Api.showErrorByCode(oResponse);
  }
  this.loadingList(false);
};
CContactsView.prototype.viewAllMails = function () {
  if (this.selectedGroupEmails().length > 0) {
    this.searchMessagesInInbox('email:' + this.selectedGroupEmails().join(','));
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CContactsView.prototype.onGetGroupsResponse = function (oResponse, oRequest) {
  var oResult = oResponse.Result;
  if (oResult) {
    var iIndex = 0,
      iLen = 0,
      aList = [],
      oSelected = _.find(this.groupFullCollection(), function (oItem) {
        return oItem.selected();
      }) || null,
      oNewSelected = null;
    this.groupFullCollection(aList);
    for (iLen = oResult.length; iIndex < iLen; iIndex++) {
      if (oResult[iIndex]) {
        oResult[iIndex].IsGroup = true;
        var oObject = new CContactListItemModel();
        oObject.parse(oResult[iIndex]);
        if (oObject.IsGroup()) {
          if (oSelected && oSelected.UUID() === oObject.UUID()) {
            oNewSelected = oObject;
          }
          aList.push(oObject);
        }
      }
    }
    this.selectedGroupInList(oNewSelected);
    if (oSelected !== null && oNewSelected === null) {
      Routing.replaceHash(LinksUtils.getContacts());
    }
    this.groupFullCollection(aList);
  } else {
    Api.showErrorByCode(oResponse);
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CContactsView.prototype.onCreateGroupResponse = function (oResponse, oRequest) {
  this.isSaving(false);
  if (oResponse.Result) {
    if (typeof oResponse.Result === 'string' && oResponse.Result !== '') {
      this.onViewGroupClick(oResponse.Result);
    } else {
      if (this.selectedGroup() && this.selectedGroup().edited()) {
        this.selectedGroup().edited(false);
      }
    }
    Screens.showReport(TextUtils.i18n('CONTACTSWEBCLIENT/REPORT_GROUP_SUCCESSFULLY_ADDED'));
    this.requestGroupFullList();
  } else {
    Api.showErrorByCode(oResponse, TextUtils.i18n('CONTACTSWEBCLIENT/ERROR_SAVE_GROUP'));
  }
};
CContactsView.prototype.executeShare = function () {
  var bSelectedStorageAll = this.selectedStorage() === 'all',
    aChecked = _.filter(this.selector.listCheckedOrSelected(), function (oItem) {
      return oItem.sStorage !== 'team';
    }),
    aCheckedUUIDs = _.map(aChecked, function (oItem) {
      return oItem.UUID();
    });
  aCheckedUUIDs = _.compact(aCheckedUUIDs);
  if (0 < aCheckedUUIDs.length) {
    _.each(aChecked, function (oContact) {
      if (oContact) {
        ContactsCache.clearInfoAboutEmail(oContact.Email());
      }
    }, this);
    if (!bSelectedStorageAll) {
      if (-1 < $.inArray(this.selectedContact(), aChecked)) {
        this.selectedContact(null);
      }
      _.each(this.collection(), function (oContact) {
        if (-1 < $.inArray(oContact, aChecked)) {
          oContact.deleted(true);
        }
      });
      _.delay(function () {
        this.collection.remove(function (oItem) {
          return oItem.deleted();
        });
      }.bind(this), 500);
    }
    if ('shared' === this.selectedStorage()) {
      this.recivedAnimPersonal(true);
    } else {
      this.recivedAnimShared(true);
    }
    Ajax.send('UpdateSharedContacts', {
      'UUIDs': aCheckedUUIDs
    }, function () {
      if (bSelectedStorageAll) {
        this.selector.listCheckedOrSelected(false);
        this.requestContactList();
      }
    }, this);
  }
};

/**
 * @param {Object} oItem
 */
CContactsView.prototype.requestGroup = function (oItem) {
  this.loadingViewPane(true);
  if (oItem) {
    Ajax.send('GetGroup', {
      'UUID': oItem.UUID()
    }, this.onGetGroupResponse, this);
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CContactsView.prototype.onGetGroupResponse = function (oResponse, oRequest) {
  if (oResponse.Result) {
    var oGroup = oResponse.Result;
    this.oGroupModel.uuid(Types.pString(oGroup.UUID)).name(oGroup.Name).isOrganization(oGroup.IsOrganization).company(oGroup.Company).country(oGroup.Country).state(oGroup.State).city(oGroup.City).street(oGroup.Street).zip(oGroup.Zip).phone(oGroup.Phone).fax(oGroup.Fax).email(oGroup.Email).web(oGroup.Web);
  } else {
    Api.showErrorByCode(oResponse);
  }
};
CContactsView.prototype.initUploader = function () {
  if (this.uploaderArea()) {
    this.oJua = new CJua({
      'action': '?/Api/',
      'name': 'jua-uploader',
      'queueSize': 2,
      'dragAndDropElement': this.uploaderArea(),
      'disableAjaxUpload': false,
      'disableFolderDragAndDrop': false,
      'disableDragAndDrop': false,
      'hidden': _.extendOwn({
        'Module': Settings.ServerModuleName,
        'Method': 'Import',
        'Parameters': _.bind(function () {
          return JSON.stringify({
            'GroupUUID': this.currentGroupUUID(),
            'Storage': this.selectedStorage()
          });
        }, this)
      }, App.getCommonRequestParameters())
    });
    this.oJua.on('onSelect', _.bind(this.onImportSelect, this)).on('onComplete', _.bind(this.onImportComplete, this)).on('onBodyDragEnter', _.bind(this.dragActive, this, true)).on('onBodyDragLeave', _.bind(this.dragActive, this, false));
  }
};
CContactsView.prototype.onImportSelect = function (sFileUid, oFileData) {
  var bAllowImport = this.isImportAllowed(),
    bAllowFormat = false;
  if (bAllowImport) {
    _.each(Settings.ImportExportFormats, function (sFormat) {
      if (sFormat.toLowerCase() === oFileData.FileName.substr(oFileData.FileName.length - sFormat.length).toLowerCase()) {
        bAllowFormat = true;
      }
    });
    if (!bAllowFormat) {
      Screens.showError(this.getFormatDependentText('ERROR_FILE_EXTENSION'));
      bAllowImport = false;
    }
  }
  return bAllowImport;
};
CContactsView.prototype.onImportComplete = function (sFileUid, bResponseReceived, oResponse) {
  var bError = !bResponseReceived || !oResponse || !oResponse.Result || false,
    iImportedCount = 0;
  if (!bError) {
    iImportedCount = Types.pInt(oResponse.Result.ImportedCount);
    if (0 < iImportedCount) {
      Screens.showReport(TextUtils.i18n('CONTACTSWEBCLIENT/REPORT_CONTACTS_IMPORTED_PLURAL', {
        'NUM': iImportedCount
      }, null, iImportedCount));
    } else {
      Screens.showError(TextUtils.i18n('CONTACTSWEBCLIENT/ERROR_IMPORT_NO_CONTACT'));
    }
  } else {
    if (oResponse && oResponse.ErrorCode === Enums.Errors.IncorrectFileExtension) {
      Screens.showError(this.getFormatDependentText('ERROR_FILE_EXTENSION'));
    } else {
      Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_UPLOAD_FILE'));
    }
  }
  this.requestGroupFullList();
  this.requestContactList();
};
CContactsView.prototype.addPublicPgpKey = function () {
  var _this4 = this;
  var ImportKeyPopup = __webpack_require__(/*! modules/OpenPgpWebclient/js/popups/ImportKeyPopup.js */ "RqIR");
  var onSuccessCallback = function onSuccessCallback(armor) {
    if (_this4.selectedContact() && _this4.selectedContact().edited()) {
      _this4.selectedContact().publicPgpKey(armor);
      var selectedContactListItem = _this4.collection().find(function (item) {
        return item.UUID() === _this4.selectedContact().uuid();
      });
      if (selectedContactListItem) {
        selectedContactListItem.HasPgpPublicKey(true);
      }
    } else {
      _this4.onUpdateContactResponse({
        Result: true
      });
    }
  };
  Popups.showPopup(ImportKeyPopup, [{
    shouldAddToPersonalContact: true,
    contactEmail: this.selectedItem().email(),
    contactUUID: this.selectedItem().uuid(),
    onSuccessCallback: onSuccessCallback
  }]);
};
CContactsView.prototype.getInitials = function (Ccontact) {
  var initials = '';
  if (typeof Ccontact.sName === 'string' && Ccontact.sName.trim() !== '') {
    var words = Ccontact.sName.trim().split(/\s+/); // split string into an array of words based on spaces.

    if (words.length === 1) {
      initials = words[0].slice(0, 2);
    } else if (words.length > 1) {
      initials = words[0][0] + words[1][0];
    }
  } else if (typeof Ccontact.sEmail === 'string' && Ccontact.sEmail.trim() !== '') {
    initials = Ccontact.sEmail.trim().slice(0, 2);
  }
  return initials;
};
module.exports = CContactsView;

/***/ }),

/***/ "395q":
/*!*************************************************!*\
  !*** ./modules/ContactsWebclient/js/manager.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
module.exports = function (oAppData) {
  var _ = __webpack_require__(/*! underscore */ "C3HO"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
    App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
    ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
    Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "ioSH"),
    ContactsCache = __webpack_require__(/*! modules/ContactsWebclient/js/Cache.js */ "sqgh"),
    EnumsDeclarator = __webpack_require__(/*! modules/ContactsWebclient/js/enums.js */ "YOnQ"),
    Settings = __webpack_require__(/*! modules/ContactsWebclient/js/Settings.js */ "pY6S"),
    Utils = __webpack_require__(/*! modules/ContactsWebclient/js/utils/Links.js */ "HV+X"),
    SuggestionsAutocomplete = __webpack_require__(/*! modules/ContactsWebclient/js/SuggestionsAutocomplete.js */ "lKNB"),
    SuggestionsMethods = {
      getSuggestionsAutocompleteCallback: function getSuggestionsAutocompleteCallback(suggestParameters) {
        var fSuggestionsAutocompleteCallback = function fSuggestionsAutocompleteCallback(oRequest, fResponse) {
            SuggestionsAutocomplete.callback(oRequest, fResponse, suggestParameters);
          },
          //TODO: Remove this wrapper after adding PGP-keys to team storage
          fSuggestionsAutocompleteFilteredCallback = ModulesManager.run('OpenPgpWebclient', 'getSuggestionsAutocompleteFilteredCallback', [fSuggestionsAutocompleteCallback]);
        return fSuggestionsAutocompleteFilteredCallback ? fSuggestionsAutocompleteFilteredCallback : fSuggestionsAutocompleteCallback;
      },
      getSuggestionsAutocompleteDeleteHandler: function getSuggestionsAutocompleteDeleteHandler() {
        return SuggestionsAutocomplete.deleteHandler;
      },
      getContactsByEmails: function getContactsByEmails(aEmails, fCallBack) {
        ContactsCache.getContactsByEmails(aEmails, fCallBack);
      }
    },
    fRegisterMessagePaneControllerOnStart = function fRegisterMessagePaneControllerOnStart() {
      App.subscribeEvent('MailWebclient::RegisterMessagePaneController', function (fRegisterMessagePaneController) {
        fRegisterMessagePaneController(__webpack_require__(/*! modules/ContactsWebclient/js/views/VcardAttachmentView.js */ "/1gm"), 'BeforeMessageBody');
      });
    },
    ContactsCardsMethods = {
      applyContactsCards: function applyContactsCards($Addresses) {
        var ContactCard = __webpack_require__(/*! modules/ContactsWebclient/js/ContactCard.js */ "IRK9");
        ContactCard.applyTo($Addresses);
      }
    };
  var contactsViewInstance = null;
  var getContactsViewInstance = function getContactsViewInstance() {
    if (!contactsViewInstance) {
      var CContactsView = __webpack_require__(/*! modules/ContactsWebclient/js/views/CContactsView.js */ "/u0n");
      contactsViewInstance = new CContactsView();
    }
    return contactsViewInstance;
  };
  EnumsDeclarator.init(oAppData, Settings.ServerModuleName);
  Settings.init(oAppData);
  if (!ModulesManager.isModuleAvailable(Settings.ServerModuleName)) {
    return null;
  }
  if (App.isUserNormalOrTenant()) {
    if (App.isMobile()) {
      return _.extend({
        start: fRegisterMessagePaneControllerOnStart,
        getSettings: function getSettings() {
          return Settings;
        },
        getHeaderItemView: function getHeaderItemView() {
          return __webpack_require__(/*! modules/ContactsWebclient/js/views/HeaderItemView.js */ "NvvQ");
        }
      }, SuggestionsMethods);
    } else if (App.isNewTab()) {
      return _.extend({
        start: fRegisterMessagePaneControllerOnStart
      }, SuggestionsMethods, ContactsCardsMethods);
    } else {
      __webpack_require__(/*! modules/ContactsWebclient/js/MainTabExtMethods.js */ "ty8j");
      return _.extend({
        start: function start(ModulesManager) {
          ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [function () {
            return __webpack_require__(/*! modules/ContactsWebclient/js/views/ContactsSettingsFormView.js */ "iVjt");
          }, Settings.HashModuleName, TextUtils.i18n('CONTACTSWEBCLIENT/LABEL_SETTINGS_TAB')]);
          if (Settings.AllowAddressBooksManagement) {
            ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [function () {
              return __webpack_require__(/*! modules/ContactsWebclient/js/views/AddressBooksSettingsFormView.js */ "FxYj");
            }, 'manage-addressbooks', TextUtils.i18n('CONTACTSWEBCLIENT/LABEL_MANAGE_ADDRESSBOOK_SETTINGS_TAB')]);
          }
          fRegisterMessagePaneControllerOnStart();
          App.broadcastEvent('RegisterNewItemElement', {
            'title': TextUtils.i18n('CONTACTSWEBCLIENT/ACTION_NEW_CONTACT'),
            'handler': function handler() {
              var contactsViewInstance = getContactsViewInstance();
              var command = contactsViewInstance.newContactCommand;

              // check if we are on contacts screen or not
              if (!window.location.hash.startsWith('#' + Settings.HashModuleName)) {
                // if team book was selected before we need to redirect to personal contacts
                if (contactsViewInstance.selectedStorage() === 'team') {
                  Routing.setHash(Utils.getContacts('personal', '', '', 1, '', 'create-contact'));
                } else {
                  window.location.hash = Settings.HashModuleName;
                }
              }
              if (contactsViewInstance.showPersonalContacts()) {
                if (command.canExecute()) {
                  command();
                }
              } else {
                var loadingListSubscription = contactsViewInstance.showPersonalContacts.subscribe(function (v) {
                  if (v) {
                    var _command = contactsViewInstance.newContactCommand;
                    if (_command.canExecute()) {
                      _command();
                    }
                    loadingListSubscription.dispose();
                  }
                });
              }
            },
            'className': 'item_contacts',
            'order': 3,
            'column': 1
          });
        },
        getScreens: function getScreens() {
          return _defineProperty({}, Settings.HashModuleName, getContactsViewInstance);
        },
        getHeaderItem: function getHeaderItem() {
          return {
            item: __webpack_require__(/*! modules/ContactsWebclient/js/views/HeaderItemView.js */ "NvvQ"),
            name: Settings.HashModuleName
          };
        },
        isTeamContactsAllowed: function isTeamContactsAllowed() {
          return Utils.checkStorageExists('team');
        },
        getMobileSyncSettingsView: function getMobileSyncSettingsView() {
          return __webpack_require__(/*! modules/ContactsWebclient/js/views/MobileSyncSettingsView.js */ "BuaG");
        }
      }, SuggestionsMethods, ContactsCardsMethods);
    }
  }
  return null;
};

/***/ }),

/***/ "5Btj":
/*!*********************************************************************!*\
  !*** ./modules/ContactsWebclient/js/popups/EditAddressBookPopup.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh");

/**
 * @constructor
 */
function CEditAddressBookPopup() {
  CAbstractPopup.call(this);
  this.createMode = ko.observable(false);
  this.saving = ko.observable(false);
  this.addressBookName = ko.observable('');
  this.addressBookNameFocus = ko.observable(false);
  this.fCallback = null;
}
_.extendOwn(CEditAddressBookPopup.prototype, CAbstractPopup.prototype);
CEditAddressBookPopup.prototype.PopupTemplate = 'ContactsWebclient_EditAddressBookPopup';

/**
 * @param {Function} fCallback
 */
CEditAddressBookPopup.prototype.onOpen = function (fCallback, iEntityId, sDisplayName) {
  this.fCallback = fCallback;
  this.iEntityId = iEntityId;
  this.createMode(!this.iEntityId);
  this.addressBookName(sDisplayName || '');
  this.addressBookNameFocus(true);
};
CEditAddressBookPopup.prototype.save = function () {
  if (_.isEmpty(this.addressBookName())) {
    Screens.showError(TextUtils.i18n('CONTACTSWEBCLIENT/ERROR_ADDRESSBOOK_NAME_EMPTY'));
    this.addressBookNameFocus(true);
    return;
  }
  var sMethod = this.createMode() ? 'CreateAddressBook' : 'UpdateAddressBook',
    oParameters = {
      'AddressBookName': this.addressBookName()
    };
  if (!this.createMode()) {
    oParameters.EntityId = this.iEntityId;
  }
  this.addressBookNameFocus(false);
  this.saving(true);
  Ajax.send('Contacts', sMethod, oParameters, this.onSaveAddressBookResponse, this);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CEditAddressBookPopup.prototype.onSaveAddressBookResponse = function (oResponse, oRequest) {
  this.saving(false);
  if (!oResponse || !oResponse.Result) {
    var sError = this.createMode() ? TextUtils.i18n('CONTACTSWEBCLIENT/ERROR_CREATE_ADDRESSBOOK') : TextUtils.i18n('CONTACTSWEBCLIENT/ERROR_UPDATE_ADDRESSBOOK');
    Api.showErrorByCode(oResponse, sError);
  } else {
    var sReport = this.createMode() ? TextUtils.i18n('CONTACTSWEBCLIENT/REPORT_CREATE_ADDRESSBOOK') : TextUtils.i18n('CONTACTSWEBCLIENT/REPORT_UPDATE_ADDRESSBOOK');
    Screens.showReport(sReport);
    if (_.isFunction(this.fCallback)) {
      this.fCallback();
    }
    this.closePopup();
  }
};
CEditAddressBookPopup.prototype.cancelPopup = function () {
  if (!this.saving()) {
    this.closePopup();
  }
};
module.exports = new CEditAddressBookPopup();

/***/ }),

/***/ "B2PQ":
/*!***********************************************************!*\
  !*** ./modules/ContactsWebclient/js/views/CImportView.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  CJua = __webpack_require__(/*! modules/CoreWebclient/js/CJua.js */ "hr1f"),
  UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "KIwC"),
  Settings = __webpack_require__(/*! modules/ContactsWebclient/js/Settings.js */ "pY6S");

/**
 * @param {CContactsViewModel} oParent
 * @constructor
 */
function CImportView(oParent) {
  this.oJua = null;
  this.oParent = oParent;
  this.visibility = ko.observable(false);
  this.importing = ko.observable(false);
  this.importButtonDom = ko.observable(null);
  this.bVisibleCloseButton = App.isMobile();
  this.extensionInfo = oParent.getFormatDependentText('INFO_IMPORT_CONTACTS');
}
CImportView.prototype.ViewTemplate = 'ContactsWebclient_ImportView';
CImportView.prototype.onBind = function () {
  var aFormats = _.map(Settings.ImportExportFormats, function (sFormat) {
    return '.' + sFormat;
  });
  this.oJua = new CJua({
    'action': '?/Api/',
    'name': 'jua-uploader',
    'queueSize': 1,
    'clickElement': this.importButtonDom(),
    'hiddenElementsPosition': UserSettings.IsRTL ? 'right' : 'left',
    'disableAjaxUpload': false,
    'disableDragAndDrop': true,
    'disableMultiple': true,
    'hidden': _.extendOwn({
      'Module': Settings.ServerModuleName,
      'Method': 'Import',
      'Parameters': _.bind(function () {
        return JSON.stringify({
          'GroupUUID': this.oParent.currentGroupUUID(),
          'Storage': this.oParent.isAddressBookSelected() ? this.oParent.selectedStorage() : 'personal'
        });
      }, this)
    }, App.getCommonRequestParameters()),
    accept: aFormats.join(',')
  });
  this.oJua.on('onSelect', _.bind(this.oParent.onImportSelect, this.oParent)).on('onStart', _.bind(this.onFileUploadStart, this)).on('onComplete', _.bind(this.onFileUploadComplete, this));
};
CImportView.prototype.onFileUploadStart = function () {
  this.importing(true);
};

/**
 * @param {string} sFileUid
 * @param {boolean} bResponseReceived
 * @param {Object} oResponse
 */
CImportView.prototype.onFileUploadComplete = function (sFileUid, bResponseReceived, oResponse) {
  this.importing(false);
  this.oParent.onImportComplete(sFileUid, bResponseReceived, oResponse);
};
module.exports = CImportView;

/***/ }),

/***/ "BuaG":
/*!**********************************************************************!*\
  !*** ./modules/ContactsWebclient/js/views/MobileSyncSettingsView.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var ko = __webpack_require__(/*! knockout */ "p09A"),
  Settings = __webpack_require__(/*! modules/ContactsWebclient/js/Settings.js */ "pY6S");

/**
 * @constructor
 */
function CMobileSyncSettingsView() {
  this.AddressBooks = ko.observableArray([]);
}
CMobileSyncSettingsView.prototype.ViewTemplate = 'ContactsWebclient_MobileSyncSettingsView';

/**
 * @param {Object} oDav
 */
CMobileSyncSettingsView.prototype.populate = function (oDav) {
  if (Array.isArray(oDav.Contacts)) {
    var aAddressBooks = oDav.Contacts.map(function (oItem) {
      return {
        'DisplayName': oItem.Name,
        'DavUrl': oItem.Url
      };
    });
    this.AddressBooks(aAddressBooks);
  }
};
module.exports = new CMobileSyncSettingsView();

/***/ }),

/***/ "FxYj":
/*!****************************************************************************!*\
  !*** ./modules/ContactsWebclient/js/views/AddressBooksSettingsFormView.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "MYiO"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  EditAddressBookPopup = __webpack_require__(/*! modules/ContactsWebclient/js/popups/EditAddressBookPopup.js */ "5Btj");

/**
 * @constructor
 */
function CAddressBooksSettingsFormView() {
  CAbstractSettingsFormView.call(this);
  this.addressBooks = ko.observableArray([]);
  this.loading = ko.observable(false);
}
_.extendOwn(CAddressBooksSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CAddressBooksSettingsFormView.prototype.ViewTemplate = 'ContactsWebclient_AddressBooksSettingsFormView';
CAddressBooksSettingsFormView.prototype.onShow = function () {
  this.populate();
};
CAddressBooksSettingsFormView.prototype.populate = function () {
  this.loading(true);
  Ajax.send('Contacts', 'GetStorages', {}, function (oResponse) {
    this.loading(false);
    if (_.isArray(oResponse && oResponse.Result)) {
      var userPublicId = App.getUserPublicId();
      this.addressBooks(oResponse.Result.filter(function (addressbook) {
        return (addressbook === null || addressbook === void 0 ? void 0 : addressbook.Display) && (addressbook === null || addressbook === void 0 ? void 0 : addressbook.Owner) === userPublicId && addressbook.Id !== 'personal';
      }));
    } else {
      Api.showErrorByCode(oResponse);
    }
  }, this);
};
CAddressBooksSettingsFormView.prototype.addAddressBook = function () {
  Popups.showPopup(EditAddressBookPopup, [this.populate.bind(this)]);
};
CAddressBooksSettingsFormView.prototype.editAddressBook = function (iEntityId, sDisplayName) {
  Popups.showPopup(EditAddressBookPopup, [this.populate.bind(this), iEntityId, sDisplayName]);
};
CAddressBooksSettingsFormView.prototype.deleteAddressBook = function (iEntityId, sDisplayName) {
  var sConfirm = TextUtils.i18n('CONTACTSWEBCLIENT/CONFIRM_DELETE_ADDRESSBOOK', {
      'NAME': sDisplayName
    }),
    fOnConfirm = _.bind(function (bOk) {
      if (bOk) {
        Ajax.send('Contacts', 'DeleteAddressBook', {
          'EntityId': iEntityId
        }, function (oResponse) {
          if (!oResponse || !oResponse.Result) {
            Api.showErrorByCode(oResponse);
          }
          this.populate();
        }, this);
      }
    }, this);
  Popups.showPopup(ConfirmPopup, [sConfirm, fOnConfirm]);
};
module.exports = new CAddressBooksSettingsFormView();

/***/ }),

/***/ "HV+X":
/*!*****************************************************!*\
  !*** ./modules/ContactsWebclient/js/utils/Links.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Settings = __webpack_require__(/*! modules/ContactsWebclient/js/Settings.js */ "pY6S"),
  LinksUtils = {};

/**
 * @param {string} sTemp
 * 
 * @return {boolean}
 */
function IsPageParam(sTemp) {
  return 'p' === sTemp.substr(0, 1) && /^[1-9][\d]*$/.test(sTemp.substr(1));
}
;

/**
 * @param {string} sTemp
 * 
 * @return {boolean}
 */
function IsContactParam(sTemp) {
  return 'cnt' === sTemp.substr(0, 3);
}
;

/**
 * @param {string} sStorageId
 * 
 * @return {boolean}
 */
LinksUtils.checkStorageExists = function (sStorageId) {
  return !!Settings.Storages.find(function (oStorage) {
    return oStorage.Id === sStorageId;
  });
};

/**
 * @param {number=} sStorage
 * @param {string=} sGroupUUID
 * @param {string=} sSearch
 * @param {number=} iPage
 * @param {string=} sContactUUID
 * @param {string=} sAction
 * @returns {Array}
 */
LinksUtils.getContacts = function (sStorage, sGroupUUID, sSearch, iPage, sContactUUID, sAction) {
  var aParams = [Settings.HashModuleName];
  if (sStorage && sStorage !== '') {
    aParams.push(sStorage);
  }
  if (sGroupUUID && sGroupUUID !== '') {
    aParams.push(sGroupUUID);
  }
  if (sSearch && sSearch !== '') {
    aParams.push(sSearch);
  }
  if (Types.isNumber(iPage)) {
    aParams.push('p' + iPage);
  }
  if (sContactUUID && sContactUUID !== '') {
    aParams.push('cnt' + sContactUUID);
  }
  if (sAction && sAction !== '') {
    aParams.push(sAction);
  }
  return aParams;
};

/**
 * @param {Array} aParam
 * 
 * @return {Object}
 */
LinksUtils.parseContacts = function (aParam) {
  var iIndex = 0,
    sStorage = Settings.DefaultStorage,
    sGroupUUID = '',
    sSearch = '',
    iPage = 1,
    sContactUUID = '',
    sAction = '';
  if (Types.isNonEmptyArray(aParam)) {
    sStorage = Types.pString(aParam[iIndex]);
    iIndex++;
    if (!Settings.Storages.find(function (oStorage) {
      return oStorage.Id === sStorage;
    })) {
      sStorage = Settings.DefaultStorage;
    }
    if (sStorage === 'group') {
      if (aParam.length > iIndex) {
        sGroupUUID = Types.pString(aParam[iIndex]);
        iIndex++;
      } else {
        sStorage = Settings.DefaultStorage;
      }
    }
    if (aParam.length > iIndex && !IsPageParam(aParam[iIndex]) && !IsContactParam(aParam[iIndex])) {
      sSearch = Types.pString(aParam[iIndex]);
      iIndex++;
    }
    if (aParam.length > iIndex && IsPageParam(aParam[iIndex])) {
      iPage = Types.pInt(aParam[iIndex].substr(1));
      iIndex++;
      if (iPage <= 0) {
        iPage = 1;
      }
    }
    if (aParam.length > iIndex) {
      if (IsContactParam(aParam[iIndex])) {
        sContactUUID = Types.pString(aParam[iIndex].substr(3));
      } else {
        sAction = Types.pString(aParam[iIndex]);
      }
      iIndex++;
    }
  }
  return {
    'Storage': sStorage,
    'GroupUUID': sGroupUUID,
    'Search': sSearch,
    'Page': iPage,
    'ContactUUID': sContactUUID,
    'Action': sAction
  };
};
module.exports = LinksUtils;

/***/ }),

/***/ "IRK9":
/*!*****************************************************!*\
  !*** ./modules/ContactsWebclient/js/ContactCard.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  CustomTooltip = __webpack_require__(/*! modules/CoreWebclient/js/CustomTooltip.js */ "OU/P"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  ComposeMessageToAddressesFunc = ModulesManager.run('MailWebclient', 'getComposeMessageToAddresses'),
  SearchMessagesInCurrentFolderFunc = ModulesManager.run('MailWebclient', 'getSearchMessagesInCurrentFolder'),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  CreateContactPopup = __webpack_require__(/*! modules/ContactsWebclient/js/popups/CreateContactPopup.js */ "cxhL"),
  ContactsCache = __webpack_require__(/*! modules/ContactsWebclient/js/Cache.js */ "sqgh"),
  oContactCardsView = {
    contacts: ko.observableArray([]),
    ViewTemplate: 'ContactsWebclient_ContactCardsView',
    bAllowComposeMessageToAddresses: _.isFunction(ComposeMessageToAddressesFunc),
    searchMessagesInCurrentFolder: SearchMessagesInCurrentFolderFunc || function () {},
    bAllowSearchMessagesInCurrentFolder: _.isFunction(SearchMessagesInCurrentFolderFunc),
    add: function add(aContacts) {
      var aDiffContacts = _.filter(this.contacts(), function (oContact) {
        return -1 === $.inArray(oContact.email(), _.keys(aContacts));
      });
      this.contacts(aDiffContacts.concat(_.compact(_.values(aContacts))));
    }
  };
Screens.showAnyView(oContactCardsView);

/**
 * @param {Object} $Element
 * @param {String} sAddress
 */
function BindContactCard($Element, sAddress) {
  var $Popup = $('div.item_viewer[data-email=\'' + sAddress + '\']'),
    bPopupOpened = false,
    iCloseTimeoutId = 0,
    fOpenPopup = function fOpenPopup() {
      if ($Popup && $Element) {
        bPopupOpened = true;
        clearTimeout(iCloseTimeoutId);
        setTimeout(function () {
          var oOffset = $Element.offset(),
            iLeft,
            iTop,
            iFitToScreenOffset;
          if (bPopupOpened && oOffset.left + oOffset.top !== 0) {
            iLeft = oOffset.left + 10;
            iTop = oOffset.top + $Element.height() + 6;
            iFitToScreenOffset = $(window).width() - (iLeft + 396); //396 - popup outer width

            if (iFitToScreenOffset > 0) {
              iFitToScreenOffset = 0;
            }
            $Popup.addClass('expand').offset({
              'top': iTop,
              'left': iLeft + iFitToScreenOffset
            });
          }
        }, 180);
      }
    },
    fClosePopup = function fClosePopup() {
      if (bPopupOpened && $Popup && $Element) {
        bPopupOpened = false;
        iCloseTimeoutId = setTimeout(function () {
          if (!bPopupOpened) {
            $Popup.removeClass('expand');
          }
        }, 200);
      }
    };
  if ($Popup.length > 0) {
    $Element.off().on('mouseover', function () {
      $Popup.off().on('mouseenter', fOpenPopup).on('mouseleave', fClosePopup).find('.link, .button').off('.links').on('click.links', function () {
        bPopupOpened = false;
        $Popup.removeClass('expand');
      });
      setTimeout(function () {
        $Popup.find('.link, .button').off('click.links').on('click.links', function () {
          bPopupOpened = false;
          $Popup.removeClass('expand');
        });
      }.bind(this), 100);
      fOpenPopup();
    }).on('mouseout', fClosePopup);
    bPopupOpened = false;
    $Popup.removeClass('expand');
  } else {
    $Element.off();
  }
}
function ClearElement($Element) {
  if ($Element.next().hasClass('add_contact')) {
    $Element.next().remove();
  }
  $Element.removeClass('found');
  $Element.parent().removeClass('found_contact');
  $Element.off();
}

/**
 * @param {Array} aElements
 * @param {Array} aContacts
 */
function OnContactResponse(aElements, aContacts) {
  _.each(aElements, function ($Element) {
    var sEmail = $Element.attr('data-email'),
      // $Element.data('email') returns wrong values if data-email was changed by knockoutjs
      oContact = aContacts[sEmail];
    if (oContact !== undefined) {
      ClearElement($Element);
      if (oContact === null) {
        var $add = $('<span class="add_contact"></span>');
        $Element.after($add);
        CustomTooltip.init($add, 'CONTACTSWEBCLIENT/ACTION_ADD_TO_CONTACTS');
        $add.on('click', function () {
          Popups.showPopup(CreateContactPopup, [$Element.attr('data-name'), sEmail, function (aContacts) {
            _.each(aElements, function ($El) {
              if ($El.attr('data-email') === sEmail) {
                ClearElement($El);
                $El.addClass('found');
                $El.parent().addClass('found_contact');
                oContactCardsView.add(aContacts);
                BindContactCard($El, sEmail);
              }
            });
          }]);
        });
      } else {
        $Element.addClass('found');
        $Element.parent().addClass('found_contact');
        oContactCardsView.add(aContacts);
        BindContactCard($Element, sEmail);
      }
    }
  });
}
module.exports = {
  applyTo: function applyTo($Addresses) {
    var aElements = _.map($Addresses, function (oElement) {
        return $(oElement);
      }),
      iMaxEmailCount = 100,
      // interface freezes if message in preview pane has too many highlighted recipients
      aEmails = _.uniq(_.map(aElements, function ($Element) {
        return $Element && $Element.attr('data-email');
      })).slice(0, iMaxEmailCount);
    ContactsCache.getContactsByEmails(aEmails, _.bind(OnContactResponse, {}, aElements));
  }
};

/***/ }),

/***/ "Nul0":
/*!**********************************************************************!*\
  !*** ./modules/ContactsWebclient/js/models/CContactListItemModel.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var ko = __webpack_require__(/*! knockout */ "p09A"),
  AddressUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Address.js */ "rBrp"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Settings = __webpack_require__(/*! modules/ContactsWebclient/js/Settings.js */ "pY6S"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l");

/**
 * @constructor
 */
function CContactListItemModel() {
  this.bIsGroup = false;
  this.bIsOrganization = false;
  this.bReadOnly = false;
  this.bItsMe = false;
  this.bTeam = false;
  this.sUUID = '';
  this.sName = '';
  this.sEmail = '';
  this.bSharedToAll = false;
  this.aEmails = [];
  this.deleted = ko.observable(false);
  this.checked = ko.observable(false);
  this.selected = ko.observable(false);
  this.recivedAnim = ko.observable(false).extend({
    'autoResetToFalse': 500
  });
  this.sStorage = Settings.DefaultStorage;
  this.isOpenPgpEnabled = ModulesManager.isModuleIncluded('OpenPgpWebclient');
  this.HasPgpPublicKey = ko.observable(false);
}

/**
 *
 * @param {Object} oData
 */
CContactListItemModel.prototype.parse = function (oData) {
  this.sUUID = Types.pString(oData.UUID);
  this.sName = Types.pString(oData.FullName || oData.Name);
  this.sEmail = Types.pString(oData.ViewEmail);
  if (Types.isNonEmptyArray(oData.Emails)) {
    this.aEmails = oData.Emails;
  }
  this.bIsGroup = !!oData.IsGroup;
  this.bIsOrganization = !!oData.IsOrganization;
  this.bReadOnly = !!oData.ReadOnly;
  this.bItsMe = !!oData.ItsMe;
  this.bTeam = !!oData.IsTeam;
  this.bSharedToAll = oData.Storage === 'shared';
  this.sStorage = oData.Storage;
  this.HasPgpPublicKey(!!oData.HasPgpPublicKey);
};

/**
 * @return {boolean}
 */
CContactListItemModel.prototype.IsGroup = function () {
  return this.bIsGroup;
};

/**
 * @return {boolean}
 */
CContactListItemModel.prototype.Team = function () {
  return this.bTeam;
};

/**
 * @return {boolean}
 */
CContactListItemModel.prototype.ReadOnly = function () {
  return this.bReadOnly;
};

/**
 * @return {boolean}
 */
CContactListItemModel.prototype.ItsMe = function () {
  return this.bItsMe;
};

/**
 * @return {string}
 */
CContactListItemModel.prototype.UUID = function () {
  return this.sUUID;
};

/**
 * @return {string}
 */
CContactListItemModel.prototype.Name = function () {
  return this.sName;
};

/**
 * @return {string}
 */
CContactListItemModel.prototype.Email = function () {
  return this.sEmail;
};

/**
 * @return {string}
 */
CContactListItemModel.prototype.getFullEmail = function () {
  return AddressUtils.getFullEmail(this.sName, this.sEmail);
};

/**
 * @return {boolean}
 */
CContactListItemModel.prototype.IsSharedToAll = function () {
  return this.bSharedToAll;
};

/**
 * @return {boolean}
 */
CContactListItemModel.prototype.IsOrganization = function () {
  return this.bIsOrganization;
};
module.exports = CContactListItemModel;

/***/ }),

/***/ "NvvQ":
/*!**************************************************************!*\
  !*** ./modules/ContactsWebclient/js/views/HeaderItemView.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  CHeaderItemView = __webpack_require__(/*! modules/CoreWebclient/js/views/CHeaderItemView.js */ "cR1d");
module.exports = new CHeaderItemView(TextUtils.i18n('CONTACTSWEBCLIENT/ACTION_SHOW_CONTACTS'));

/***/ }),

/***/ "VhVF":
/*!*******************************************************!*\
  !*** ./modules/CoreWebclient/js/vendors/FileSaver.js ***!
  \*******************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || function (view) {
  "use strict";

  // IE <10 is explicitly unsupported
  if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
    return;
  }
  var doc = view.document
    // only get URL when necessary in case Blob.js hasn't overridden it yet
    ,
    get_URL = function get_URL() {
      return view.URL || view.webkitURL || view;
    },
    save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
    can_use_save_link = "download" in save_link,
    click = function click(node) {
      var event = new MouseEvent("click");
      node.dispatchEvent(event);
    },
    is_safari = /constructor/i.test(view.HTMLElement) || view.safari,
    is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent),
    throw_outside = function throw_outside(ex) {
      (view.setImmediate || view.setTimeout)(function () {
        throw ex;
      }, 0);
    },
    force_saveable_type = "application/octet-stream"
    // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
    ,
    arbitrary_revoke_timeout = 1000 * 40 // in ms
    ,
    revoke = function revoke(file) {
      var revoker = function revoker() {
        if (typeof file === "string") {
          // file is an object URL
          get_URL().revokeObjectURL(file);
        } else {
          // file is a File
          file.remove();
        }
      };
      setTimeout(revoker, arbitrary_revoke_timeout);
    },
    dispatch = function dispatch(filesaver, event_types, event) {
      event_types = [].concat(event_types);
      var i = event_types.length;
      while (i--) {
        var listener = filesaver["on" + event_types[i]];
        if (typeof listener === "function") {
          try {
            listener.call(filesaver, event || filesaver);
          } catch (ex) {
            throw_outside(ex);
          }
        }
      }
    },
    auto_bom = function auto_bom(blob) {
      // prepend BOM for UTF-8 XML and text/* types (including HTML)
      // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
      if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
        return new Blob([String.fromCharCode(0xFEFF), blob], {
          type: blob.type
        });
      }
      return blob;
    },
    FileSaver = function FileSaver(blob, name, no_auto_bom) {
      if (!no_auto_bom) {
        blob = auto_bom(blob);
      }
      // First try a.download, then web filesystem, then object URLs
      var filesaver = this,
        type = blob.type,
        force = type === force_saveable_type,
        object_url,
        dispatch_all = function dispatch_all() {
          dispatch(filesaver, "writestart progress write writeend".split(" "));
        }
        // on any filesys errors revert to saving with object URLs
        ,
        fs_error = function fs_error() {
          if ((is_chrome_ios || force && is_safari) && view.FileReader) {
            // Safari doesn't allow downloading of blob urls
            var reader = new FileReader();
            reader.onloadend = function () {
              var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
              var popup = view.open(url, '_blank');
              if (!popup) view.location.href = url;
              url = undefined; // release reference before dispatching
              filesaver.readyState = filesaver.DONE;
              dispatch_all();
            };
            reader.readAsDataURL(blob);
            filesaver.readyState = filesaver.INIT;
            return;
          }
          // don't create more object URLs than needed
          if (!object_url) {
            object_url = get_URL().createObjectURL(blob);
          }
          if (force) {
            view.location.href = object_url;
          } else {
            var opened = view.open(object_url, "_blank");
            if (!opened) {
              // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
              view.location.href = object_url;
            }
          }
          filesaver.readyState = filesaver.DONE;
          dispatch_all();
          revoke(object_url);
        };
      filesaver.readyState = filesaver.INIT;
      if (can_use_save_link) {
        object_url = get_URL().createObjectURL(blob);
        setTimeout(function () {
          save_link.href = object_url;
          save_link.download = name;
          click(save_link);
          dispatch_all();
          revoke(object_url);
          filesaver.readyState = filesaver.DONE;
        });
        return;
      }
      fs_error();
    },
    FS_proto = FileSaver.prototype,
    saveAs = function saveAs(blob, name, no_auto_bom) {
      return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
    };
  // IE 10+ (native saveAs)
  if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
    return function (blob, name, no_auto_bom) {
      name = name || blob.name || "download";
      if (!no_auto_bom) {
        blob = auto_bom(blob);
      }
      return navigator.msSaveOrOpenBlob(blob, name);
    };
  }
  FS_proto.abort = function () {};
  FS_proto.readyState = FS_proto.INIT = 0;
  FS_proto.WRITING = 1;
  FS_proto.DONE = 2;
  FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null;
  return saveAs;
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content);
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if ( true && module.exports) {
  module.exports.saveAs = saveAs;
} else if ( true && __webpack_require__.amdD !== null && __webpack_require__.amdO !== null) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
    return saveAs;
  }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

/***/ }),

/***/ "YOnQ":
/*!***********************************************!*\
  !*** ./modules/ContactsWebclient/js/enums.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Enums = {};

/**
 * @enum {number}
 */
Enums.SharedAddressbookAccess = {
  'NoAccess': 0,
  'Write': 1,
  'Read': 2
};
if (typeof window.Enums === 'undefined') {
  window.Enums = {};
}
_.extendOwn(window.Enums, Enums);
module.exports = {
  init: function init(appData, serverModuleName) {
    var appDataSection = appData[serverModuleName];
    window.Enums.ContactsPrimaryEmail = Types.pObject(appDataSection && appDataSection.PrimaryEmail);
    window.Enums.ContactsPrimaryPhone = Types.pObject(appDataSection && appDataSection.PrimaryPhone);
    window.Enums.ContactsPrimaryAddress = Types.pObject(appDataSection && appDataSection.PrimaryAddress);
    window.Enums.ContactSortField = Types.pObject(appDataSection && appDataSection.SortField);
  }
};

/***/ }),

/***/ "ZQr9":
/*!***********************************************************!*\
  !*** ./modules/ContactsWebclient/js/models/VcardModel.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  Ajax = __webpack_require__(/*! modules/ContactsWebclient/js/Ajax.js */ "ZbnD"),
  ContactsCache = __webpack_require__(/*! modules/ContactsWebclient/js/Cache.js */ "sqgh"),
  HeaderItemView = !App.isNewTab() ? __webpack_require__(/*! modules/ContactsWebclient/js/views/HeaderItemView.js */ "NvvQ") : null,
  MainTab = App.isNewTab() && window.opener ? window.opener.MainTabContactsMethods : null;

/**
 * @constructor
 */
function CVcardModel() {
  this.uid = ko.observable('');
  this.file = ko.observable('');
  this.name = ko.observable('');
  this.email = ko.observable('');
  this.exists = ko.observable(false);
  this.isJustSaved = ko.observable(false);
}

/**
 * @param {AjaxVCardResponse} oData
 */
CVcardModel.prototype.parse = function (oData) {
  if (oData && oData['@Object'] === 'Object/Aurora\\Modules\\Mail\\Classes\\Vcard') {
    this.uid(Types.pString(oData.Uid));
    this.file(Types.pString(oData.File));
    this.name(Types.pString(oData.Name));
    this.email(Types.pString(oData.Email));
    this.exists(!!oData.Exists);
    ContactsCache.addVcard(this);
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CVcardModel.prototype.onContactsSaveVcfResponse = function (oResponse, oRequest) {
  if (!oResponse.Result) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('CONTACTSWEBCLIENT/ERROR_CREATE_CONTACT'));
    this.exists(false);
  } else {
    if (_.isArray(oResponse.Result.ImportedUids) && oResponse.Result.ImportedUids.length === 1) {
      this.uid(oResponse.Result.ImportedUids[0]);
      if (MainTab) {
        MainTab.updateVcardUid(this.file(), this.uid());
      }
    }
  }
};
CVcardModel.prototype.addContact = function () {
  Ajax.send('AddContactsFromFile', {
    'File': this.file()
  }, this.onContactsSaveVcfResponse, this);
  this.isJustSaved(true);
  this.exists(true);
  setTimeout(_.bind(function () {
    this.isJustSaved(false);
  }, this), 20000);
  if (HeaderItemView) {
    HeaderItemView.recivedAnim(true);
  } else if (MainTab) {
    MainTab.markVcardsExistentByFile(this.file());
  }
};
module.exports = CVcardModel;

/***/ }),

/***/ "ZbnD":
/*!**********************************************!*\
  !*** ./modules/ContactsWebclient/js/Ajax.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Settings = __webpack_require__(/*! modules/ContactsWebclient/js/Settings.js */ "pY6S");
Ajax.registerAbortRequestHandler(Settings.ServerModuleName, function (oRequest, oOpenedRequest) {
  switch (oRequest.Method) {
    case 'GetContacts':
      return oOpenedRequest.Method === 'GetContacts';
    case 'GetContact':
      return oOpenedRequest.Method === 'GetContact';
  }
  return false;
});
module.exports = {
  send: function send(sMethod, oParameters, fResponseHandler, oContext, oMainParams) {
    Ajax.send(Settings.ServerModuleName, sMethod, oParameters, fResponseHandler, oContext, oMainParams);
  }
};

/***/ }),

/***/ "cxhL":
/*!*******************************************************************!*\
  !*** ./modules/ContactsWebclient/js/popups/CreateContactPopup.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "ioSH"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  LinksUtils = __webpack_require__(/*! modules/ContactsWebclient/js/utils/Links.js */ "HV+X"),
  Ajax = __webpack_require__(/*! modules/ContactsWebclient/js/Ajax.js */ "ZbnD"),
  ContactsCache = __webpack_require__(/*! modules/ContactsWebclient/js/Cache.js */ "sqgh"),
  HeaderItemView = __webpack_require__(/*! modules/ContactsWebclient/js/views/HeaderItemView.js */ "NvvQ");

/**
 * @constructor
 */
function CCreateContactPopup() {
  CAbstractPopup.call(this);
  this.displayName = ko.observable('');
  this.email = ko.observable('');
  this.phone = ko.observable('');
  this.address = ko.observable('');
  this.skype = ko.observable('');
  this.facebook = ko.observable('');
  this.focusDisplayName = ko.observable(false);
  this.loading = ko.observable(false);
  this.fCallback = function () {};
}
_.extendOwn(CCreateContactPopup.prototype, CAbstractPopup.prototype);
CCreateContactPopup.prototype.PopupTemplate = 'ContactsWebclient_CreateContactPopup';

/**
 * @param {string} sName
 * @param {string} sEmail
 * @param {Function} fCallback
 */
CCreateContactPopup.prototype.onOpen = function (sName, sEmail, fCallback) {
  if (this.displayName() !== sName || this.email() !== sEmail) {
    this.displayName(sName);
    this.email(sEmail);
    this.phone('');
    this.address('');
    this.skype('');
    this.facebook('');
  }
  this.fCallback = _.isFunction(fCallback) ? fCallback : function () {};
};
CCreateContactPopup.prototype.onSaveClick = function () {
  if (!this.canBeSave()) {
    Screens.showError(TextUtils.i18n('CONTACTSWEBCLIENT/ERROR_EMAIL_OR_NAME_BLANK'));
  } else if (!this.loading()) {
    var oParameters = {
      'PrimaryEmail': Enums.ContactsPrimaryEmail.Personal,
      'FullName': this.displayName(),
      'PersonalEmail': this.email(),
      'PersonalPhone': this.phone(),
      'PersonalAddress': this.address(),
      'Skype': this.skype(),
      'Facebook': this.facebook(),
      'Storage': 'personal'
    };
    this.loading(true);
    Ajax.send('CreateContact', {
      'Contact': oParameters
    }, this.onCreateContactResponse, this);
  }
};
CCreateContactPopup.prototype.cancelPopup = function () {
  this.loading(false);
  this.closePopup();
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CCreateContactPopup.prototype.onCreateContactResponse = function (oResponse, oRequest) {
  var oParameters = oRequest.Parameters;
  this.loading(false);
  if (!oResponse.Result) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('CONTACTSWEBCLIENT/ERROR_CREATE_CONTACT'));
  } else {
    Screens.showReport(TextUtils.i18n('CONTACTSWEBCLIENT/REPORT_CONTACT_SUCCESSFULLY_ADDED'));
    ContactsCache.clearInfoAboutEmail(oParameters.Contact.PersonalEmail);
    ContactsCache.getContactsByEmails([oParameters.Contact.PersonalEmail], this.fCallback);
    this.closePopup();
    if (!HeaderItemView.isCurrent()) {
      HeaderItemView.recivedAnim(true);
    }
  }
};
CCreateContactPopup.prototype.canBeSave = function () {
  return this.displayName() !== '' || this.email() !== '';
};
CCreateContactPopup.prototype.goToContacts = function () {
  ContactsCache.saveNewContactParams({
    displayName: this.displayName(),
    email: this.email(),
    phone: this.phone(),
    address: this.address(),
    skype: this.skype(),
    facebook: this.facebook()
  });
  this.closePopup();
  Routing.replaceHash(LinksUtils.getContacts('personal', '', '', 1, '', 'create-contact'));
};
module.exports = new CCreateContactPopup();

/***/ }),

/***/ "iVjt":
/*!************************************************************************!*\
  !*** ./modules/ContactsWebclient/js/views/ContactsSettingsFormView.js ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  Settings = __webpack_require__(/*! modules/ContactsWebclient/js/Settings.js */ "pY6S");

/**
 * @constructor
 */
function CContactsSettingsFormView() {
  CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
  this.contactsPerPageValues = ko.observableArray(Types.getAdaptedPerPageList(Settings.ContactsPerPage));
  this.contactsPerPage = ko.observable(Settings.ContactsPerPage);
}
_.extendOwn(CContactsSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CContactsSettingsFormView.prototype.ViewTemplate = 'ContactsWebclient_ContactsSettingsFormView';
CContactsSettingsFormView.prototype.getCurrentValues = function () {
  return [this.contactsPerPage()];
};
CContactsSettingsFormView.prototype.revertTeamValues = function () {
  this.contactsPerPage(Settings.ContactsPerPage);
};
CContactsSettingsFormView.prototype.getParametersForSave = function () {
  return {
    'ContactsPerPage': this.contactsPerPage()
  };
};
CContactsSettingsFormView.prototype.applySavedValues = function (oParameters) {
  Settings.update(oParameters.ContactsPerPage);
};
module.exports = new CContactsSettingsFormView();

/***/ }),

/***/ "lKNB":
/*!*****************************************************************!*\
  !*** ./modules/ContactsWebclient/js/SuggestionsAutocomplete.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  AddressUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Address.js */ "rBrp"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Ajax = __webpack_require__(/*! modules/ContactsWebclient/js/Ajax.js */ "ZbnD");

/**
 * 
 * @param {object} oRequest
 * @param {function} fResponse
 * @param {string} storage
 * @param {boolean} addContactGroups
 * @param {boolean} addUserGroups
 * @param {string} exceptEmail
 * @param {boolean} addEmailsToGroups
 * @returns {undefined}
 */
function Callback(oRequest, fResponse, _ref) {
  var _ref$storage = _ref.storage,
    storage = _ref$storage === void 0 ? 'all' : _ref$storage,
    _ref$addContactGroups = _ref.addContactGroups,
    addContactGroups = _ref$addContactGroups === void 0 ? false : _ref$addContactGroups,
    _ref$addUserGroups = _ref.addUserGroups,
    addUserGroups = _ref$addUserGroups === void 0 ? false : _ref$addUserGroups,
    _ref$exceptEmail = _ref.exceptEmail,
    exceptEmail = _ref$exceptEmail === void 0 ? '' : _ref$exceptEmail,
    _ref$addEmailsToGroup = _ref.addEmailsToGroups,
    addEmailsToGroups = _ref$addEmailsToGroup === void 0 ? false : _ref$addEmailsToGroup,
    _ref$useEmailAsValues = _ref.useEmailAsValues,
    useEmailAsValues = _ref$useEmailAsValues === void 0 ? false : _ref$useEmailAsValues,
    _ref$withoutEmptyEmai = _ref.withoutEmptyEmails,
    withoutEmptyEmails = _ref$withoutEmptyEmai === void 0 ? false : _ref$withoutEmptyEmai;
  var sTerm = oRequest.term,
    oParameters = {
      'Search': sTerm,
      'Storage': storage,
      'SortField': Enums.ContactSortField.Frequency,
      'SortOrder': 1,
      'WithGroups': addContactGroups,
      'WithUserGroups': addUserGroups,
      'WithoutTeamContactsDuplicates': true
    };
  Ajax.send('GetContactSuggestions', oParameters, function (oResponse) {
    var aList = [];
    if (oResponse && oResponse.Result && oResponse.Result.List) {
      aList = _.map(oResponse.Result.List, function (oItem) {
        if (oItem.IsGroup && oItem.Name) {
          if (!oItem.Emails && withoutEmptyEmails) {
            return null;
          }
          return {
            label: addEmailsToGroups ? "".concat(oItem.Name, " (").concat(oItem.Emails, ")") : oItem.Name,
            value: addEmailsToGroups ? oItem.Emails : oItem.Name,
            name: oItem.Name,
            email: addEmailsToGroups ? oItem.Emails : oItem.Name,
            groupId: oItem.Id,
            isUserGroup: true,
            isAllUsersGroup: oItem.IsAll
          };
        }
        var sValue = oItem.ViewEmail,
          sLabel = '';
        if (!useEmailAsValues && oItem.FullName && 0 < $.trim(oItem.FullName).length) {
          if (oItem.ForSharedToAll) {
            sValue = oItem.FullName;
          } else if (oItem.IsGroup) {
            sLabel = "".concat(oItem.FullName, " (").concat(oItem.ViewEmail, ")");
            sValue = oItem.ViewEmail;
          } else {
            sValue = '"' + oItem.FullName + '" <' + oItem.ViewEmail + '>';
          }
        }
        if (oItem && (oItem.ViewEmail && oItem.ViewEmail !== exceptEmail || !oItem.ViewEmail && !withoutEmptyEmails)) {
          return {
            label: sLabel ? sLabel : sValue,
            value: sValue,
            name: oItem.FullName,
            email: oItem.ViewEmail,
            frequency: oItem.Frequency,
            id: oItem.UUID,
            storage: oItem.Storage,
            uuid: oItem.UUID,
            team: oItem.Storage === 'team',
            sharedToAll: oItem.Storage === 'shared',
            hasKey: oItem.HasPgpPublicKey,
            encryptMessage: oItem.PgpEncryptMessages,
            signMessage: oItem.PgpSignMessages,
            isContactGroup: oItem.IsGroup
          };
        }
        return null;
      });
      aList = aList.filter(function (item) {
        return item;
      });
      aList = _.sortBy(_.compact(aList), function (oItem) {
        return -oItem.frequency;
      });
    }
    fResponse(aList);
  });
}

/**
 * @param {Object} oContact
 */
function DeleteHandler(oContact) {
  Ajax.send('UpdateContact', {
    'Contact': {
      'UUID': oContact.id,
      'Frequency': -1,
      'Storage': oContact.storage
    }
  });
}
module.exports = {
  callback: Callback,
  deleteHandler: DeleteHandler
};

/***/ }),

/***/ "pY6S":
/*!**************************************************!*\
  !*** ./modules/ContactsWebclient/js/Settings.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt");
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
  init: function init(oAppData) {
    var oAppDataSection = oAppData[this.ServerModuleName];
    if (!_.isEmpty(oAppDataSection)) {
      this.ContactsPerPage = Types.pPositiveInt(oAppDataSection.ContactsPerPage, this.ContactsPerPage);
      this.ImportContactsLink = Types.pString(oAppDataSection.ImportContactsLink, this.ImportContactsLink);
      var aStorages = Types.pArray(oAppDataSection.Storages, this.Storages);
      this.AddressBooks = _.filter(aStorages, function (oStorage) {
        return oStorage.CTag !== undefined;
      });
      this.Storages = aStorages;
      if (this.Storages.length > 0) {
        this.Storages.push({
          'Id': 'all',
          'DisplayName': TextUtils.i18n('CONTACTSWEBCLIENT/LABEL_STORAGE_ALL')
        });
        this.Storages.push({
          'Id': 'group'
        });
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
  update: function update(iContactsPerPage) {
    this.ContactsPerPage = iContactsPerPage;
  },
  getSortConfig: function getSortConfig(config) {
    return {
      Allow: Types.pBool(config === null || config === void 0 ? void 0 : config.Allow),
      DisplayOptions: (config === null || config === void 0 ? void 0 : config.DisplayOptions) || [],
      DefaultSortBy: Types.pEnum(Enums.ContactSortField[config === null || config === void 0 ? void 0 : config.DefaultSortBy], Enums.ContactSortField, Enums.ContactSortField.Name),
      DefaultSortOrder: Types.pEnum(Enums.SortOrder[config === null || config === void 0 ? void 0 : config.DefaultSortOrder], Enums.SortOrder, Enums.SortOrder.Desc)
    };
  }
};

/***/ }),

/***/ "rIhA":
/*!************************************************************!*\
  !*** ./modules/ContactsWebclient/js/models/CGroupModel.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var ko = __webpack_require__(/*! knockout */ "p09A"),
  AddressUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Address.js */ "rBrp"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o");

/**
 * @constructor
 */
function CGroupModel() {
  this.isNew = ko.observable(false);
  this.readOnly = ko.observable(false);
  this.uuid = ko.observable('');
  this.idUser = ko.observable(0);
  this.name = ko.observable('');
  this.isOrganization = ko.observable(false);
  this.email = ko.observable('');
  this.country = ko.observable('');
  this.city = ko.observable('');
  this.company = ko.observable('');
  this.fax = ko.observable('');
  this.phone = ko.observable('');
  this.state = ko.observable('');
  this.street = ko.observable('');
  this.web = ko.observable('');
  this.zip = ko.observable('');
  this.edited = ko.observable(false);
  this.nameFocused = ko.observable(false);
  this.canBeSave = ko.computed(function () {
    return '' !== this.name();
  }, this);
  this.newContactsInGroupCount = ko.observable(0);
  this.newContactsInGroupHint = ko.computed(function () {
    var iCount = this.newContactsInGroupCount();
    return this.isNew() && 0 < iCount ? TextUtils.i18n('CONTACTSWEBCLIENT/INFO_NEW_GROUP_CONTACTS_PLURAL', {
      'COUNT': iCount
    }, null, iCount) : '';
  }, this);
}
CGroupModel.prototype.getFullEmail = function () {
  return AddressUtils.getFullEmail(this.name(), this.email());
};
CGroupModel.prototype.clear = function () {
  this.isNew(false);
  this.uuid('');
  this.idUser(0);
  this.name('');
  this.nameFocused(false);
  this.edited(false);
  this.isOrganization(false);
  this.email('');
  this.country('');
  this.city('');
  this.company('');
  this.fax('');
  this.phone('');
  this.state('');
  this.street('');
  this.web('');
  this.zip('');
};
CGroupModel.prototype.populate = function (oGroup) {
  this.isNew(oGroup.isNew());
  this.uuid(oGroup.uuid());
  this.idUser(oGroup.idUser());
  this.name(oGroup.name());
  this.nameFocused(oGroup.nameFocused());
  this.edited(oGroup.edited());
  this.isOrganization(oGroup.isOrganization());
  this.email(oGroup.email());
  this.country(oGroup.country());
  this.city(oGroup.city());
  this.company(oGroup.company());
  this.fax(oGroup.fax());
  this.phone(oGroup.phone());
  this.state(oGroup.state());
  this.street(oGroup.street());
  this.web(oGroup.web());
  this.zip(oGroup.zip());
};
CGroupModel.prototype.switchToNew = function () {
  this.clear();
  this.edited(true);
  this.isNew(true);
  if (!App.isMobile()) {
    this.nameFocused(true);
  }
};
CGroupModel.prototype.switchToView = function () {
  this.edited(false);
};

/**
 * @param {array} aContactUUIDs
 * @return {Object}
 */
CGroupModel.prototype.toObject = function (aContactUUIDs) {
  return {
    'UUID': this.uuid(),
    'Name': this.name(),
    'IsOrganization': this.isOrganization() ? '1' : '0',
    'Email': this.email(),
    'Country': this.country(),
    'City': this.city(),
    'Company': this.company(),
    'Fax': this.fax(),
    'Phone': this.phone(),
    'State': this.state(),
    'Street': this.street(),
    'Web': this.web(),
    'Zip': this.zip(),
    'Contacts': aContactUUIDs
  };
};
module.exports = CGroupModel;

/***/ }),

/***/ "sqgh":
/*!***********************************************!*\
  !*** ./modules/ContactsWebclient/js/Cache.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  Ajax = __webpack_require__(/*! modules/ContactsWebclient/js/Ajax.js */ "ZbnD"),
  CContactModel = __webpack_require__(/*! modules/ContactsWebclient/js/models/CContactModel.js */ "tPG8");

/**
 * @constructor
 */
function CContactsCache() {
  this.oContacts = {};
  this.oResponseHandlers = {};
  this.aRequestedEmails = [];
  this.aVcardAttachments = [];
  this.oNewContactParams = null;
}

/**
 * @param {string} sEmail
 */
CContactsCache.prototype.clearInfoAboutEmail = function (sEmail) {
  this.oContacts[sEmail] = undefined;
};

/**
 * Looks for contacts in the cache and returns them by the specified handler.
 * If some of contacts are not found in the cache, requests them from the server by specified emails.
 * 
 * @param {Array} aEmails List of emails.
 * @param {Function} fResponseHandler Function to call when the server response.
 */
CContactsCache.prototype.getContactsByEmails = function (aEmails, fResponseHandler) {
  var aContacts = [],
    aEmailsForRequest = [],
    sHandlerId = Math.random().toString();
  _.each(aEmails, _.bind(function (sEmail) {
    var oContact = this.oContacts[sEmail];
    if (oContact !== undefined) {
      aContacts[sEmail] = oContact;
    } else if (_.indexOf(this.aRequestedEmails, sEmail) === -1) {
      aEmailsForRequest.push(sEmail);
    }
  }, this));
  if (_.isFunction(fResponseHandler)) {
    fResponseHandler(aContacts);
  }
  if (aEmailsForRequest.length > 0) {
    this.oResponseHandlers[sHandlerId] = fResponseHandler;
    this.aRequestedEmails = _.union(this.aRequestedEmails, aEmailsForRequest);
    Ajax.send('GetContactsByEmails', {
      'Storage': 'all',
      'Emails': aEmailsForRequest,
      'HandlerId': sHandlerId
    }, this.onGetContactsByEmailsResponse, this);
  }
};

/**
 * Receives data from the server, parses them and passes on.
 * 
 * @param {Object} oResponse Data obtained from the server.
 * @param {Object} oRequest Data has been transferred to the server.
 */
CContactsCache.prototype.onGetContactsByEmailsResponse = function (oResponse, oRequest) {
  var oParameters = oRequest.Parameters,
    fResponseHandler = this.oResponseHandlers[oParameters.HandlerId],
    oResult = oResponse.Result,
    aEmails = oParameters.Emails,
    oContacts = {};
  if (oResult) {
    _.each(oResult, _.bind(function (oRawContact) {
      var oContact = new CContactModel();
      if (oContact) {
        oContact.parse(oRawContact);
        if (!this.oContacts[oContact.email()]) {
          this.oContacts[oContact.email()] = oContact;
        } else if (!oContact.pgpSettingsEmpty()) {
          this.oContacts[oContact.email()] = oContact;
        }
      }
    }, this));
  }
  this.aRequestedEmails = _.difference(this.aRequestedEmails, aEmails);
  _.each(aEmails, _.bind(function (sEmail) {
    if (!this.oContacts[sEmail]) {
      this.oContacts[sEmail] = null;
    }
    oContacts[sEmail] = this.oContacts[sEmail];
  }, this));
  if (_.isFunction(fResponseHandler)) {
    fResponseHandler(oContacts);
  }
  delete this.oResponseHandlers[oParameters.HandlerId];
};

/**
 * @param {Object} oVcard
 */
CContactsCache.prototype.addVcard = function (oVcard) {
  this.aVcardAttachments.push(oVcard);
};

/**
 * @param {string} sFile
 */
CContactsCache.prototype.getVcard = function (sFile) {
  return _.find(this.aVcardAttachments, function (oVcard) {
    return oVcard.file() === sFile;
  });
};

/**
 * @param {string} sFile
 */
CContactsCache.prototype.markVcardsExistentByFile = function (sFile) {
  _.each(this.aVcardAttachments, function (oVcard) {
    if (oVcard.file() === sFile) {
      oVcard.exists(true);
    }
  });
};

/**
 * @param {string} sFile
 * @param {string} sUid
 */
CContactsCache.prototype.updateVcardUid = function (sFile, sUid) {
  var oVcard = _.find(this.aVcardAttachments, function (oVcard) {
    return oVcard.file() === sFile;
  });
  if (oVcard) {
    oVcard.uid(sUid);
  }
};

/**
 * @param {Array} aUids
 */
CContactsCache.prototype.markVcardsNonexistentByUid = function (aUids) {
  _.each(this.aVcardAttachments, function (oVcard) {
    if (-1 !== _.indexOf(aUids, oVcard.uid())) {
      oVcard.exists(false);
    }
  });
};

/**
 * @param {Object} oNewContactParams
 */
CContactsCache.prototype.saveNewContactParams = function (oNewContactParams) {
  this.oNewContactParams = oNewContactParams;
};

/**
 * @returns {Object}
 */
CContactsCache.prototype.getNewContactParams = function () {
  var oNewContactParams = this.oNewContactParams;
  this.oNewContactParams = null;
  return oNewContactParams;
};
module.exports = new CContactsCache();

/***/ }),

/***/ "tPG8":
/*!**************************************************************!*\
  !*** ./modules/ContactsWebclient/js/models/CContactModel.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  moment = __webpack_require__(/*! moment */ "sdEb"),
  AddressUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Address.js */ "rBrp"),
  DateUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Date.js */ "jFqX"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Ajax = __webpack_require__(/*! modules/ContactsWebclient/js/Ajax.js */ "ZbnD"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  CDateModel = __webpack_require__(/*! modules/CoreWebclient/js/models/CDateModel.js */ "ebd4"),
  Settings = __webpack_require__(/*! modules/ContactsWebclient/js/Settings.js */ "pY6S"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l");

/**
 * @constructor
 */
function CContactModel() {
  // Important: if new fields are added they should be added to clear method as well. Otherwise create contact functionality might work incorrectly.

  this.sEmailDefaultType = Enums.ContactsPrimaryEmail.Personal;
  this.sPhoneDefaultType = Enums.ContactsPrimaryPhone.Mobile;
  this.sAddressDefaultType = Enums.ContactsPrimaryAddress.Personal;
  this.uuid = ko.observable('');
  this.idUser = ko.observable(0);
  this.team = ko.observable(false);
  this.itsMe = ko.observable(false);
  this.storage = ko.observable('personal');
  this.isNew = ko.observable(false);
  this.readOnly = ko.observable(false);
  this.edited = ko.observable(false);
  this.extented = ko.observable(false);
  this.personalCollapsed = ko.observable(false);
  this.businessCollapsed = ko.observable(false);
  this.otherCollapsed = ko.observable(false);
  this.pgpSettingsCollapsed = ko.observable(false);
  this.groupsCollapsed = ko.observable(false);
  this.displayName = ko.observable('');
  this.firstName = ko.observable('');
  this.lastName = ko.observable('');
  this.nickName = ko.observable('');
  this.skype = ko.observable('');
  this.facebook = ko.observable('');
  this.displayNameFocused = ko.observable(false);
  this.primaryEmail = ko.observable(this.sEmailDefaultType);
  this.primaryPhone = ko.observable(this.sPhoneDefaultType);
  this.primaryAddress = ko.observable(this.sAddressDefaultType);
  this.mainPrimaryEmail = ko.computed({
    'read': this.primaryEmail,
    'write': function write(mValue) {
      if (mValue && 0 <= $.inArray(mValue, [Enums.ContactsPrimaryEmail.Personal, Enums.ContactsPrimaryEmail.Business, Enums.ContactsPrimaryEmail.Other])) {
        this.primaryEmail(mValue);
      } else {
        this.primaryEmail(Enums.ContactsPrimaryEmail.Personal);
      }
    },
    'owner': this
  });
  this.mainPrimaryPhone = ko.computed({
    'read': this.primaryPhone,
    'write': function write(mValue) {
      if (mValue && 0 <= $.inArray(mValue, [Enums.ContactsPrimaryPhone.Mobile, Enums.ContactsPrimaryPhone.Personal, Enums.ContactsPrimaryPhone.Business])) {
        this.primaryPhone(mValue);
      } else {
        this.primaryPhone(Enums.ContactsPrimaryPhone.Mobile);
      }
    },
    'owner': this
  });
  this.mainPrimaryAddress = ko.computed({
    'read': this.primaryAddress,
    'write': function write(mValue) {
      if (mValue && 0 <= $.inArray(mValue, [Enums.ContactsPrimaryAddress.Personal, Enums.ContactsPrimaryAddress.Business])) {
        this.primaryAddress(mValue);
      } else {
        this.primaryAddress(Enums.ContactsPrimaryAddress.Personal);
      }
    },
    'owner': this
  });
  this.personalEmail = ko.observable('');
  this.personalStreetAddress = ko.observable('');
  this.personalCity = ko.observable('');
  this.personalState = ko.observable('');
  this.personalZipCode = ko.observable('');
  this.personalCountry = ko.observable('');
  this.personalWeb = ko.observable('');
  this.personalFax = ko.observable('');
  this.personalPhone = ko.observable('');
  this.personalMobile = ko.observable('');
  this.businessEmail = ko.observable('');
  this.businessCompany = ko.observable('');
  this.businessDepartment = ko.observable('');
  this.businessJob = ko.observable('');
  this.businessOffice = ko.observable('');
  this.businessStreetAddress = ko.observable('');
  this.businessCity = ko.observable('');
  this.businessState = ko.observable('');
  this.businessZipCode = ko.observable('');
  this.businessCountry = ko.observable('');
  this.businessWeb = ko.observable('');
  this.businessFax = ko.observable('');
  this.businessPhone = ko.observable('');
  this.otherEmail = ko.observable('');
  this.otherBirthMonth = ko.observable(0);
  this.otherBirthDay = ko.observable(0);
  this.otherBirthYear = ko.observable(0);
  this.otherNotes = ko.observable('');
  this.etag = ko.observable('');
  this.isOpenPgpEnabled = ModulesManager.isModuleIncluded('OpenPgpWebclient');
  this.isOpenPgpInMailEnabled = ModulesManager.run('OpenPgpWebclient', 'getOpenPgpInMailEnabledObservable') || ko.observable(false);
  this.publicPgpKeyView = ko.observable('');
  this.publicPgpKey = ko.observable('');
  this.pgpEncryptMessages = ko.observable(false);
  this.pgpSignMessages = ko.observable(false);
  this.publicPgpKey.subscribe(function (sValue) {
    if (sValue !== '') {
      ModulesManager.run('OpenPgpWebclient', 'getKeyInfo', [sValue, function (oKey) {
        if (oKey) {
          this.publicPgpKeyView(oKey.getUser() + ' (' + oKey.getBitSize() + '-bit)');
        } else {
          this.publicPgpKeyView('');
        }
      }.bind(this)]);
    } else {
      this.publicPgpKeyView('');
    }
  }, this);
  this.sharedToAll = ko.observable(false);
  this.birthdayIsEmpty = ko.computed(function () {
    var bMonthEmpty = 0 === this.otherBirthMonth(),
      bDayEmpty = 0 === this.otherBirthDay(),
      bYearEmpty = 0 === this.otherBirthYear();
    return bMonthEmpty || bDayEmpty || bYearEmpty;
  }, this);
  this.otherBirthday = ko.computed(function () {
    var sBirthday = '',
      iYear = this.otherBirthYear(),
      iMonth = this.otherBirthMonth(),
      iDay = this.otherBirthDay(),
      oDateModel = new CDateModel();
    if (!this.birthdayIsEmpty()) {
      var fullYears = moment().diff(moment(iYear + '/' + iMonth + '/' + iDay, "YYYY/MM/DD"), 'years'),
        text = TextUtils.i18n('CONTACTSWEBCLIENT/LABEL_YEARS_PLURAL', {
          'COUNT': fullYears
        }, null, fullYears);
      oDateModel.setDate(iYear, 0 < iMonth ? iMonth - 1 : 0, iDay);
      sBirthday = oDateModel.getShortDate() + ' (' + text + ')';
    }
    return sBirthday;
  }, this);
  this.groups = ko.observableArray([]);
  this.groupsIsEmpty = ko.computed(function () {
    return 0 === this.groups().length;
  }, this);
  this.email = ko.computed({
    'read': function read() {
      var sResult = '';
      switch (this.primaryEmail()) {
        case Enums.ContactsPrimaryEmail.Personal:
          sResult = this.personalEmail();
          break;
        case Enums.ContactsPrimaryEmail.Business:
          sResult = this.businessEmail();
          break;
        case Enums.ContactsPrimaryEmail.Other:
          sResult = this.otherEmail();
          break;
      }
      return sResult;
    },
    'write': function write(sEmail) {
      switch (this.primaryEmail()) {
        case Enums.ContactsPrimaryEmail.Personal:
          this.personalEmail(sEmail);
          break;
        case Enums.ContactsPrimaryEmail.Business:
          this.businessEmail(sEmail);
          break;
        case Enums.ContactsPrimaryEmail.Other:
          this.otherEmail(sEmail);
          break;
        default:
          this.primaryEmail(this.sEmailDefaultType);
          this.email(sEmail);
          break;
      }
    },
    'owner': this
  });
  this.showEncryptSignFlags = ko.computed(function () {
    return this.isOpenPgpInMailEnabled() && this.publicPgpKeyView();
  }, this);
  this.personalIsEmpty = ko.computed(function () {
    var sPersonalEmail = this.personalEmail() !== this.email() ? this.personalEmail() : '';
    return '' === '' + sPersonalEmail + this.personalStreetAddress() + this.personalCity() + this.personalState() + this.personalZipCode() + this.personalCountry() + this.personalWeb() + this.personalFax() + this.personalPhone() + this.personalMobile();
  }, this);
  this.businessIsEmpty = ko.computed(function () {
    var sBusinessEmail = this.businessEmail() !== this.email() ? this.businessEmail() : '';
    return '' === '' + sBusinessEmail + this.businessCompany() + this.businessDepartment() + this.businessJob() + this.businessOffice() + this.businessStreetAddress() + this.businessCity() + this.businessState() + this.businessZipCode() + this.businessCountry() + this.businessWeb() + this.businessFax() + this.businessPhone();
  }, this);
  this.otherIsEmpty = ko.computed(function () {
    var sOtherEmail = this.otherEmail() !== this.email() ? this.otherEmail() : '';
    return '' === '' + sOtherEmail + this.otherNotes() && this.birthdayIsEmpty();
  }, this);
  this.pgpSettingsEmpty = ko.computed(function () {
    return typeof this.publicPgpKey() !== 'string' || this.publicPgpKey() === '';
  }, this);
  this.phone = ko.computed({
    'read': function read() {
      var sResult = '';
      switch (this.primaryPhone()) {
        case Enums.ContactsPrimaryPhone.Mobile:
          sResult = this.personalMobile();
          break;
        case Enums.ContactsPrimaryPhone.Personal:
          sResult = this.personalPhone();
          break;
        case Enums.ContactsPrimaryPhone.Business:
          sResult = this.businessPhone();
          break;
      }
      return sResult;
    },
    'write': function write(sPhone) {
      switch (this.primaryPhone()) {
        case Enums.ContactsPrimaryPhone.Mobile:
          this.personalMobile(sPhone);
          break;
        case Enums.ContactsPrimaryPhone.Personal:
          this.personalPhone(sPhone);
          break;
        case Enums.ContactsPrimaryPhone.Business:
          this.businessPhone(sPhone);
          break;
        default:
          this.primaryPhone(this.sEmailDefaultType);
          this.phone(sPhone);
          break;
      }
    },
    'owner': this
  });
  this.address = ko.computed({
    'read': function read() {
      var sResult = '';
      switch (this.primaryAddress()) {
        case Enums.ContactsPrimaryAddress.Personal:
          sResult = this.personalStreetAddress();
          break;
        case Enums.ContactsPrimaryAddress.Business:
          sResult = this.businessStreetAddress();
          break;
      }
      return sResult;
    },
    'write': function write(sAddress) {
      switch (this.primaryAddress()) {
        case Enums.ContactsPrimaryAddress.Personal:
          this.personalStreetAddress(sAddress);
          break;
        case Enums.ContactsPrimaryAddress.Business:
          this.businessStreetAddress(sAddress);
          break;
        default:
          this.primaryAddress(this.sEmailDefaultType);
          this.address(sAddress);
          break;
      }
    },
    'owner': this
  });
  this.emails = ko.computed(function () {
    var aList = [];
    if ('' !== this.personalEmail()) {
      aList.push({
        'text': TextUtils.i18n('CONTACTSWEBCLIENT/LABEL_PERSONAL') + ': ' + this.personalEmail(),
        'value': Enums.ContactsPrimaryEmail.Personal
      });
    }
    if ('' !== this.businessEmail()) {
      aList.push({
        'text': TextUtils.i18n('CONTACTSWEBCLIENT/LABEL_BUSINESS') + ': ' + this.businessEmail(),
        'value': Enums.ContactsPrimaryEmail.Business
      });
    }
    if ('' !== this.otherEmail()) {
      aList.push({
        'text': TextUtils.i18n('CONTACTSWEBCLIENT/LABEL_OTHER') + ': ' + this.otherEmail(),
        'value': Enums.ContactsPrimaryEmail.Other
      });
    }
    return aList;
  }, this);
  this.phones = ko.computed(function () {
    var aList = [];
    if ('' !== this.personalMobile()) {
      aList.push({
        'text': TextUtils.i18n('CONTACTSWEBCLIENT/LABEL_MOBILE') + ': ' + this.personalMobile(),
        'value': Enums.ContactsPrimaryPhone.Mobile
      });
    }
    if ('' !== this.personalPhone()) {
      aList.push({
        'text': TextUtils.i18n('CONTACTSWEBCLIENT/LABEL_PERSONAL') + ': ' + this.personalPhone(),
        'value': Enums.ContactsPrimaryPhone.Personal
      });
    }
    if ('' !== this.businessPhone()) {
      aList.push({
        'text': TextUtils.i18n('CONTACTSWEBCLIENT/LABEL_BUSINESS') + ': ' + this.businessPhone(),
        'value': Enums.ContactsPrimaryPhone.Business
      });
    }
    return aList;
  }, this);
  this.addresses = ko.computed(function () {
    var aList = [];
    if ('' !== this.personalStreetAddress()) {
      aList.push({
        'text': TextUtils.i18n('CONTACTSWEBCLIENT/LABEL_PERSONAL') + ': ' + this.personalStreetAddress(),
        'value': Enums.ContactsPrimaryAddress.Personal
      });
    }
    if ('' !== this.businessStreetAddress()) {
      aList.push({
        'text': TextUtils.i18n('CONTACTSWEBCLIENT/LABEL_BUSINESS') + ': ' + this.businessStreetAddress(),
        'value': Enums.ContactsPrimaryAddress.Business
      });
    }
    return aList;
  }, this);
  this.hasEmails = ko.computed(function () {
    return 0 < this.emails().length;
  }, this);
  this.allowSendThisContact = ko.computed(function () {
    return Settings.SaveVcfServerModuleName !== '';
  }, this);
  this.extented.subscribe(function (bValue) {
    if (bValue) {
      this.personalCollapsed(!this.personalIsEmpty());
      this.businessCollapsed(!this.businessIsEmpty());
      this.otherCollapsed(!this.otherIsEmpty());
      this.pgpSettingsCollapsed(!this.pgpSettingsEmpty());
      this.groupsCollapsed(!this.groupsIsEmpty());
    }
  }, this);
  this.birthMonthSelect = CContactModel.birthMonthSelect;
  this.birthDaySelect = ko.computed(function () {
    var iIndex = 1,
      iDaysInMonth = DateUtils.daysInMonth(this.otherBirthMonth(), this.otherBirthYear()),
      aList = [{
        'text': TextUtils.i18n('COREWEBCLIENT/LABEL_DAY'),
        'value': 0
      }];
    for (; iIndex <= iDaysInMonth; iIndex++) {
      aList.push({
        'text': iIndex.toString(),
        'value': iIndex
      });
    }
    return aList;
  }, this);
  this.birthYearSelect = [{
    'text': TextUtils.i18n('CONTACTSWEBCLIENT/LABEL_YEAR'),
    'value': 0
  }];
  for (var iCurrYear = new Date().getFullYear(), iIndex = iCurrYear, iFirstYear = iCurrYear - 100; iIndex >= iFirstYear; iIndex--) {
    this.birthYearSelect.push({
      'text': iIndex.toString(),
      'value': iIndex
    });
  }
  this.canBeSave = ko.computed(function () {
    return this.displayName() !== '' || !!this.emails().length;
  }, this);
  this.customCommands = ko.observableArray([]);
  App.broadcastEvent('ContactsWebclient::AddCustomCommand', {
    'Callback': _.bind(function (oCommand) {
      var oNewCommand = _.extend({
        'Text': '',
        'CssClass': '',
        'Handler': function Handler() {},
        'Visible': true
      }, oCommand);
      oNewCommand.Command = Utils.createCommand(this, oNewCommand.Handler, true);
      this.customCommands.push(oNewCommand);
    }, this),
    'Contact': this
  });
}
CContactModel.aBirthdayMonths = DateUtils.getMonthNamesArray();
CContactModel.birthMonthSelect = [{
  'text': TextUtils.i18n('COREWEBCLIENT/LABEL_MONTH'),
  value: 0
}, {
  'text': CContactModel.aBirthdayMonths[0],
  value: 1
}, {
  'text': CContactModel.aBirthdayMonths[1],
  value: 2
}, {
  'text': CContactModel.aBirthdayMonths[2],
  value: 3
}, {
  'text': CContactModel.aBirthdayMonths[3],
  value: 4
}, {
  'text': CContactModel.aBirthdayMonths[4],
  value: 5
}, {
  'text': CContactModel.aBirthdayMonths[5],
  value: 6
}, {
  'text': CContactModel.aBirthdayMonths[6],
  value: 7
}, {
  'text': CContactModel.aBirthdayMonths[7],
  value: 8
}, {
  'text': CContactModel.aBirthdayMonths[8],
  value: 9
}, {
  'text': CContactModel.aBirthdayMonths[9],
  value: 10
}, {
  'text': CContactModel.aBirthdayMonths[10],
  value: 11
}, {
  'text': CContactModel.aBirthdayMonths[11],
  value: 12
}];
CContactModel.prototype.clear = function () {
  this.uuid('');
  this.idUser(0);
  this.team(false);
  this.itsMe(false);
  this.storage('');
  this.isNew(false);
  this.readOnly(false);
  this.edited(false);
  this.extented(false);
  this.personalCollapsed(false);
  this.businessCollapsed(false);
  this.otherCollapsed(false);
  this.pgpSettingsCollapsed(false);
  this.groupsCollapsed(false);
  this.displayName('');
  this.firstName('');
  this.lastName('');
  this.nickName('');
  this.skype('');
  this.facebook('');
  this.displayNameFocused(false);
  this.primaryEmail(this.sEmailDefaultType);
  this.primaryPhone(this.sPhoneDefaultType);
  this.primaryAddress(this.sAddressDefaultType);
  this.personalEmail('');
  this.personalStreetAddress('');
  this.personalCity('');
  this.personalState('');
  this.personalZipCode('');
  this.personalCountry('');
  this.personalWeb('');
  this.personalFax('');
  this.personalPhone('');
  this.personalMobile('');
  this.businessEmail('');
  this.businessCompany('');
  this.businessDepartment('');
  this.businessJob('');
  this.businessOffice('');
  this.businessStreetAddress('');
  this.businessCity('');
  this.businessState('');
  this.businessZipCode('');
  this.businessCountry('');
  this.businessWeb('');
  this.businessFax('');
  this.businessPhone('');
  this.otherEmail('');
  this.otherBirthMonth(0);
  this.otherBirthDay(0);
  this.otherBirthYear(0);
  this.otherNotes('');
  this.etag('');
  this.publicPgpKeyView('');
  this.publicPgpKey('');
  this.pgpEncryptMessages(false);
  this.pgpSignMessages(false);
  this.sharedToAll(false);
  this.groups([]);
};
CContactModel.prototype.switchToNew = function () {
  this.clear();
  this.edited(true);
  this.extented(false);
  this.isNew(true);
  if (!App.isMobile()) {
    this.displayNameFocused(true);
  }
};
CContactModel.prototype.switchToView = function () {
  this.edited(false);
  this.extented(false);
};

/**
 * @return {Object}
 */
CContactModel.prototype.toObject = function () {
  var oResult = {
    'UUID': this.uuid(),
    'PrimaryEmail': this.primaryEmail(),
    'PrimaryPhone': this.primaryPhone(),
    'PrimaryAddress': this.primaryAddress(),
    'FullName': this.displayName(),
    'FirstName': this.firstName(),
    'LastName': this.lastName(),
    'NickName': this.nickName(),
    'Storage': this.storage(),
    'Skype': this.skype(),
    'Facebook': this.facebook(),
    'PersonalEmail': this.personalEmail(),
    'PersonalAddress': this.personalStreetAddress(),
    'PersonalCity': this.personalCity(),
    'PersonalState': this.personalState(),
    'PersonalZip': this.personalZipCode(),
    'PersonalCountry': this.personalCountry(),
    'PersonalWeb': this.personalWeb(),
    'PersonalFax': this.personalFax(),
    'PersonalPhone': this.personalPhone(),
    'PersonalMobile': this.personalMobile(),
    'BusinessEmail': this.businessEmail(),
    'BusinessCompany': this.businessCompany(),
    'BusinessJobTitle': this.businessJob(),
    'BusinessDepartment': this.businessDepartment(),
    'BusinessOffice': this.businessOffice(),
    'BusinessAddress': this.businessStreetAddress(),
    'BusinessCity': this.businessCity(),
    'BusinessState': this.businessState(),
    'BusinessZip': this.businessZipCode(),
    'BusinessCountry': this.businessCountry(),
    'BusinessFax': this.businessFax(),
    'BusinessPhone': this.businessPhone(),
    'BusinessWeb': this.businessWeb(),
    'OtherEmail': this.otherEmail(),
    'Notes': this.otherNotes(),
    'ETag': this.etag(),
    'BirthDay': this.otherBirthDay(),
    'BirthMonth': this.otherBirthMonth(),
    'BirthYear': this.otherBirthYear(),
    'PublicPgpKey': this.publicPgpKey(),
    'PgpEncryptMessages': this.pgpEncryptMessages(),
    'PgpSignMessages': this.pgpSignMessages(),
    'GroupUUIDs': this.groups()
  };
  return oResult;
};
function getPgpFlagValue(data, flagName, isTeam) {
  var userId = App.getUserId();
  if (isTeam) {
    return !!data["".concat(flagName, "_").concat(userId)];
  }
  return !!data[flagName];
}

/**
 * @param {Object} oData
 */
CContactModel.prototype.parse = function (oData) {
  this.uuid(Types.pString(oData.UUID));
  this.idUser(Types.pInt(oData.IdUser));
  this.team(oData.Storage === 'team');
  this.storage(Types.pString(oData.Storage));
  this.itsMe(!!oData.ItsMe);
  this.readOnly(!!oData.ReadOnly);
  this.displayName(Types.pString(oData.FullName));
  this.firstName(Types.pString(oData.FirstName));
  this.lastName(Types.pString(oData.LastName));
  this.nickName(Types.pString(oData.NickName));
  this.skype(Types.pString(oData.Skype));
  this.facebook(Types.pString(oData.Facebook));
  this.primaryEmail(Types.pInt(oData.PrimaryEmail));
  this.primaryPhone(Types.pInt(oData.PrimaryPhone));
  this.primaryAddress(Types.pInt(oData.PrimaryAddress));
  this.personalEmail(Types.pString(oData.PersonalEmail));
  this.personalStreetAddress(Types.pString(oData.PersonalAddress));
  this.personalCity(Types.pString(oData.PersonalCity));
  this.personalState(Types.pString(oData.PersonalState));
  this.personalZipCode(Types.pString(oData.PersonalZip));
  this.personalCountry(Types.pString(oData.PersonalCountry));
  this.personalWeb(Types.pString(oData.PersonalWeb));
  this.personalFax(Types.pString(oData.PersonalFax));
  this.personalPhone(Types.pString(oData.PersonalPhone));
  this.personalMobile(Types.pString(oData.PersonalMobile));
  this.businessEmail(Types.pString(oData.BusinessEmail));
  this.businessCompany(Types.pString(oData.BusinessCompany));
  this.businessDepartment(Types.pString(oData.BusinessDepartment));
  this.businessJob(Types.pString(oData.BusinessJobTitle));
  this.businessOffice(Types.pString(oData.BusinessOffice));
  this.businessStreetAddress(Types.pString(oData.BusinessAddress));
  this.businessCity(Types.pString(oData.BusinessCity));
  this.businessState(Types.pString(oData.BusinessState));
  this.businessZipCode(Types.pString(oData.BusinessZip));
  this.businessCountry(Types.pString(oData.BusinessCountry));
  this.businessWeb(Types.pString(oData.BusinessWeb));
  this.businessFax(Types.pString(oData.BusinessFax));
  this.businessPhone(Types.pString(oData.BusinessPhone));
  this.otherEmail(Types.pString(oData.OtherEmail));
  this.otherBirthMonth(Types.pInt(oData.BirthMonth));
  this.otherBirthDay(Types.pInt(oData.BirthDay));
  this.otherBirthYear(Types.pInt(oData.BirthYear));
  this.otherNotes(Types.pString(oData.Notes));
  this.etag(Types.pString(oData.ETag));
  this.publicPgpKey(Types.pString(oData['OpenPgpWebclient::PgpKey']));
  this.pgpEncryptMessages(getPgpFlagValue(oData, 'OpenPgpWebclient::PgpEncryptMessages', this.team()));
  this.pgpSignMessages(getPgpFlagValue(oData, 'OpenPgpWebclient::PgpSignMessages', this.team()));
  this.sharedToAll(oData.Storage === 'shared');
  if (_.isArray(oData.GroupUUIDs)) {
    this.groups(oData.GroupUUIDs);
  }
};

/**
 * @param {string} sEmail
 * @return {string}
 */
CContactModel.prototype.getFullEmail = function (sEmail) {
  if (!Types.isNonEmptyString(sEmail)) {
    sEmail = this.email();
  }
  return AddressUtils.getFullEmail(this.displayName(), sEmail);
};
CContactModel.prototype.getEmailsString = function () {
  return _.uniq(_.without([this.email(), this.personalEmail(), this.businessEmail(), this.otherEmail()], '')).join(',');
};
CContactModel.prototype.sendThisContact = function () {
  var ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
    fComposeMessageWithAttachments = ModulesManager.run('MailWebclient', 'getComposeMessageWithAttachments'),
    oParameters = {
      'UUID': this.uuid(),
      'FileName': 'contact-' + this.getFullEmail().replace('"', '').replace('<', '').replace('>', '') + '.vcf'
    };
  Ajax.send('SaveContactAsTempFile', oParameters, function (oResponse) {
    if (oResponse.Result) {
      if (_.isFunction(fComposeMessageWithAttachments)) {
        fComposeMessageWithAttachments([oResponse.Result]);
      }
    } else {
      Api.showErrorByCode(oResponse, TextUtils.i18n('CONTACTSWEBCLIENT/ERROR_CONTACT_AS_TEMPFAILE'));
    }
  }, this);
};

/**
 * @param {?} mLink
 * @return {boolean}
 */
CContactModel.prototype.isStrLink = function (mLink) {
  return /^http/.test(mLink);
};
module.exports = CContactModel;

/***/ }),

/***/ "ty8j":
/*!***********************************************************!*\
  !*** ./modules/ContactsWebclient/js/MainTabExtMethods.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var ContactsCache = __webpack_require__(/*! modules/ContactsWebclient/js/Cache.js */ "sqgh"),
  MainTabContactsMethods = {
    markVcardsExistentByFile: function markVcardsExistentByFile(sFile) {
      ContactsCache.markVcardsExistentByFile(sFile);
    },
    updateVcardUid: function updateVcardUid(sFile, sUid) {
      ContactsCache.updateVcardUid(sFile, sUid);
    }
  };
window.MainTabContactsMethods = MainTabContactsMethods;
module.exports = {};

/***/ })

}]);