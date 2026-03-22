"use strict";
(self["webpackChunkafterlogic_aurora_platform"] = self["webpackChunkafterlogic_aurora_platform"] || []).push([[13],{

/***/ "Y7MU":
/*!******************************************************!*\
  !*** ./modules/MailZipWebclientPlugin/js/manager.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = function (appData) {
  var App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
    isZipAllowed = appData['MailZipWebclientPlugin'] ? !!appData['MailZipWebclientPlugin'].AllowZip : false;
  if (isZipAllowed && App.isUserNormalOrTenant()) {
    var AttachmentUtils = __webpack_require__(/*! modules/MailZipWebclientPlugin/js/utils/Attachment.js */ "pbQj");
    return {
      start: function start(ModulesManager) {
        App.subscribeEvent('MailWebclient::CopyFileProperties::after', function (params) {
          if (params) {
            AttachmentUtils.copyProperties(params);
          }
        });
        App.subscribeEvent('MailWebclient::ParseFile::after', function (file) {
          AttachmentUtils.parse(file);
        });
        App.subscribeEvent('MailWebclient::AddAllAttachmentsDownloadMethod', function (fAddAllAttachmentsDownloadMethod) {
          fAddAllAttachmentsDownloadMethod(AttachmentUtils.getAllAttachmentsDownloadMethod());
        });
      }
    };
  }
  return null;
};

/***/ }),

/***/ "pbQj":
/*!***************************************************************!*\
  !*** ./modules/MailZipWebclientPlugin/js/utils/Attachment.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "3cxN"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh");
function getActionData(file) {
  return {
    Text: ko.computed(function () {
      if (this.subFilesExpanded()) {
        return TextUtils.i18n('COREWEBCLIENT/ACTION_COLLAPSE_FILE');
      }
      if (this.mailzipSubFilesLoading()) {
        return TextUtils.i18n('COREWEBCLIENT/INFO_LOADING');
      }
      return TextUtils.i18n('COREWEBCLIENT/ACTION_EXPAND_FILE');
    }, file),
    Handler: function () {
      if (!this.mailzipSubFilesLoading()) {
        if (this.subFilesExpanded()) {
          this.subFilesExpanded(false);
        } else {
          this.mailzipExpandFile();
        }
      }
    }.bind(file)
  };
}
module.exports = {
  parse: function parse(file) {
    if (file && typeof file.addAction === 'function' && file.extension() === 'zip') {
      file.mailzipSubFilesLoaded = ko.observable(false);
      file.mailzipSubFilesLoading = ko.observable(false);
      file.mailzipExpandFile = function () {
        if (!this.mailzipSubFilesLoaded() && !this.mailzipSubFilesLoading()) {
          this.mailzipSubFilesLoading(true);
          Ajax.send('MailZipWebclientPlugin', 'ExpandFile', {
            'Hash': this.hash()
          }, function (response) {
            this.mailzipSubFilesLoading(false);
            var subFilesData = response.Result && Array.isArray(response.Result.Files) ? response.Result.Files : [];
            var subFiles = [];
            subFilesData.forEach(function (fileData) {
              var subFile = file.getNewInstance();
              subFile.parse(fileData);
              subFiles.push(subFile);
            });
            this.subFiles(subFiles);
            this.mailzipSubFilesLoaded(true);
            this.subFilesExpanded(true);
          }, this);
        } else {
          this.subFilesExpanded(true);
        }
      };
      file.removeAction('view');
      file.addAction('expand', true, getActionData(file));
    }
  },
  copyProperties: function copyProperties(_ref) {
    var file = _ref.file,
      source = _ref.source;
    if (file && typeof file.addAction === 'function' && file.extension() === 'zip') {
      file.mailzipSubFilesLoaded = ko.observable(source.mailzipSubFilesLoaded());
      file.mailzipSubFilesLoading = ko.observable(source.mailzipSubFilesLoading());
      file.mailzipExpandFile = source.mailzipExpandFile.bind(file);
      file.removeAction('expand');
      file.addAction('expand', true, getActionData(file));
    }
  },
  getAllAttachmentsDownloadMethod: function getAllAttachmentsDownloadMethod() {
    return {
      Text: TextUtils.i18n('MAILZIPWEBCLIENTPLUGIN/ACTION_DOWNLOAD_ATTACHMENTS_ZIP'),
      Handler: function Handler(accountId, hashes) {
        Screens.showLoading(TextUtils.i18n('COREWEBCLIENT/INFO_LOADING'));
        Ajax.send('MailZipWebclientPlugin', 'SaveAttachments', {
          AccountID: accountId,
          Attachments: hashes
        }, function (response) {
          Screens.hideLoading();
          if (response.Result && response.Result.Actions && response.Result.Actions.download) {
            var sDownloadLink = response.Result.Actions.download.url;
            UrlUtils.downloadByUrl(sDownloadLink);
          } else {
            Api.showErrorByCode(response);
          }
        });
      }
    };
  }
};

/***/ })

}]);