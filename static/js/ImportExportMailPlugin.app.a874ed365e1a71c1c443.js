"use strict";
(self["webpackChunkafterlogic_aurora_platform"] = self["webpackChunkafterlogic_aurora_platform"] || []).push([[6],{

/***/ "BpZ7":
/*!*******************************************************!*\
  !*** ./modules/ImportExportMailPlugin/js/Settings.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9");
module.exports = {
  ModuleName: 'ImportExportMailPlugin',
  UploadSizeLimitMb: 0,
  /**
   * Initializes settings from AppData object sections.
   * 
   * @param {Object} oAppData Object contained modules settings.
   */
  init: function init(oAppData) {
    var oAppDataSection = oAppData[this.ModuleName] || {};
    if (!_.isEmpty(oAppDataSection)) {
      this.UploadSizeLimitMb = Types.pInt(oAppDataSection.UploadSizeLimitMb, this.UploadSizeLimitMb);
    }
  }
};

/***/ }),

/***/ "hIlX":
/*!***********************************************************************!*\
  !*** ./modules/ImportExportMailPlugin/js/popups/ImportExportPopup.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  CJua = __webpack_require__(/*! modules/CoreWebclient/js/CJua.js */ "hr1f"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  MailCache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8"),
  Settings = __webpack_require__(/*! modules/ImportExportMailPlugin/js/Settings.js */ "BpZ7");

/**
 * @constructor
 */
function ImportExportPopup() {
  CAbstractPopup.call(this);
  this.zipFile = ko.observable(null);
  this.status = ko.observable('');
  this.iAutoReloadTimer = -1;
  this.opened = ko.observable(false);
  this.options = ko.observableArray([]);
  this.selectedFolder = ko.observable('');
  this.uploaderButton = ko.observable(null);
  // file uploader
  this.oJua = null;
  this.defaultOptionsAfterRender = Utils.defaultOptionsAfterRender;
  this.exportButtonText = ko.observable(TextUtils.i18n('IMPORTEXPORTMAILPLUGIN/POPUP_ACTION_EXPORT'));
  this.importButtonText = ko.observable(TextUtils.i18n('IMPORTEXPORTMAILPLUGIN/POPUP_ACTION_IMPORT'));
  this.processing = ko.computed(function () {
    return this.status() !== 'ready' && this.status() !== 'error' && this.status() !== '';
  }, this);
  this.status.subscribe(function (bValue) {
    if (bValue === 'ready') {
      if (!this.opened()) {
        this.openPopup({});
      }
      this.exportButtonText(TextUtils.i18n('IMPORTEXPORTMAILPLUGIN/POPUP_ACTION_DOWNLOAD_ZIP'));
      clearTimeout(this.iAutoReloadTimer);
    } else if (bValue === 'error') {
      Screens.showError(TextUtils.i18n('IMPORTEXPORTMAILPLUGIN/POPUP_ERROR_GENERATE_ZIP'));
      this.exportButtonText(TextUtils.i18n('IMPORTEXPORTMAILPLUGIN/POPUP_ACTION_EXPORT'));
      clearTimeout(this.iAutoReloadTimer);
    }
  }, this);
}
_.extendOwn(ImportExportPopup.prototype, CAbstractPopup.prototype);
ImportExportPopup.prototype.PopupTemplate = 'ImportExportMailPlugin_ImportExportPopup';
ImportExportPopup.prototype.onOpen = function () {
  var oFolderList = MailCache.oFolderListItems[MailCache.editedAccountId()];
  this.options(oFolderList ? oFolderList.getOptions('', true, false, false) : []);
};
ImportExportPopup.prototype.onShow = function () {
  this.opened(true);
  this.initUploader();
};
ImportExportPopup.prototype.onCancelClick = function () {
  this.opened(false);
  this.closeCommand();
};
ImportExportPopup.prototype.exportMail = function () {
  if (this.status() === '') {
    this.status('prepare');
    Ajax.send(Settings.ModuleName, 'ExportMailPrepare', {}, this.onExportMailResponse, this);
    this.setAutoReloadTimer();
  } else if (this.status() === 'ready') {
    this.Download();
  }
};
ImportExportPopup.prototype.setAutoReloadTimer = function () {
  var self = this;
  clearTimeout(this.iAutoReloadTimer);
  this.iAutoReloadTimer = setTimeout(function () {
    self.Status();
  }, 10 * 1000);
};
ImportExportPopup.prototype.Status = function () {
  this.setAutoReloadTimer();
  if (this.status() !== '') {
    Ajax.send(Settings.ModuleName, 'ExportMailStatus', {
      'Zip': this.zipFile()
    }, this.onStatusResponse, this);
  }
};
ImportExportPopup.prototype.onExportMailResponse = function (oResponse) {
  var oResult = oResponse.Result;
  if (oResult && this.status() === 'prepare' && oResult.Zip) {
    this.zipFile(oResult.Zip);
    this.exportButtonText(TextUtils.i18n('IMPORTEXPORTMAILPLUGIN/POPUP_GENERATING_ZIP'));
    Ajax.send(Settings.ModuleName, 'ExportMailGenerate', {
      'AccountId': MailCache.editedAccountId(),
      'Folder': this.selectedFolder(),
      'Zip': this.zipFile()
    });
  }
};
ImportExportPopup.prototype.onStatusResponse = function (oResponse) {
  var oResult = oResponse.Result;
  if (oResult && oResult.Status) {
    this.status(oResult.Status);
  }
};
ImportExportPopup.prototype.Download = function () {
  if (this.status() === 'ready') {
    this.status('');
    this.exportButtonText(TextUtils.i18n('IMPORTEXPORTMAILPLUGIN/POPUP_ACTION_EXPORT'));
    window.location.href = '?transfer-mail/export/' + this.zipFile();
  }
};
ImportExportPopup.prototype.initUploader = function () {
  var self = this;
  if (this.uploaderButton()) {
    this.oJua = new CJua({
      'action': '?/Api/',
      'name': 'jua-uploader',
      'queueSize': 2,
      'clickElement': this.uploaderButton(),
      'disableAjaxUpload': false,
      'disableFolderDragAndDrop': true,
      'disableDragAndDrop': true,
      'hidden': _.extendOwn({
        'Module': Settings.ModuleName,
        'Method': 'ImportMail',
        'Parameters': function Parameters() {
          return JSON.stringify({
            'AccountId': MailCache.editedAccountId(),
            'Folder': self.selectedFolder()
          });
        }
      }, App.getCommonRequestParameters())
    });
    this.oJua.bEnableButton = true;
    this.oJua.on('onSelect', _.bind(this.onFileUploadSelect, this)).on('onStart', _.bind(this.onFileUploadStart, this)).on('onComplete', _.bind(this.onFileUploadComplete, this));
  }
};
ImportExportPopup.prototype.onFileUploadSelect = function (sFileUid, oFileData) {
  if (Settings.UploadSizeLimitMb > 0 && oFileData.Size / (1024 * 1024) > Settings.UploadSizeLimitMb) {
    Screens.showError(TextUtils.i18n('IMPORTEXPORTMAILPLUGIN/ERROR_SIZE_LIMIT', {
      'SIZE': Settings.UploadSizeLimitMb
    }));
    return false;
  }
};
ImportExportPopup.prototype.onFileUploadStart = function () {
  this.status('upload');
  this.importButtonText(TextUtils.i18n('IMPORTEXPORTMAILPLUGIN/POPUP_IMPORTING_ZIP'));
};
ImportExportPopup.prototype.onFileUploadComplete = function (sFileUid, bResponseReceived, oResponse) {
  var bError = !bResponseReceived || !oResponse || !oResponse.Result || false;
  this.status('');
  this.importButtonText(TextUtils.i18n('IMPORTEXPORTMAILPLUGIN/POPUP_ACTION_IMPORT'));
  if (!bError) {
    Screens.showReport(TextUtils.i18n('IMPORTEXPORTMAILPLUGIN/INFO_UPLOAD_COMPLETED'));
  } else {
    Api.showErrorByCode(oResponse, TextUtils.i18n('IMPORTEXPORTMAILPLUGIN/UNKNOWN_ERROR'));
  }
};
module.exports = new ImportExportPopup();

/***/ }),

/***/ "xOz5":
/*!******************************************************!*\
  !*** ./modules/ImportExportMailPlugin/js/manager.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Settings = __webpack_require__(/*! modules/ImportExportMailPlugin/js/Settings.js */ "BpZ7");
module.exports = function (oAppData) {
  Settings.init(oAppData);
  if (!ModulesManager.isModuleAvailable('Mail') || !ModulesManager.isModuleAvailable('MailWebclient')) {
    return null;
  }
  return {
    getImportExportPopup: function getImportExportPopup() {
      return __webpack_require__(/*! modules/ImportExportMailPlugin/js/popups/ImportExportPopup.js */ "hIlX");
    }
  };
};

/***/ })

}]);