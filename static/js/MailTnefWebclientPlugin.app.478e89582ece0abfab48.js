"use strict";
(self["webpackChunkafterlogic_aurora_platform"] = self["webpackChunkafterlogic_aurora_platform"] || []).push([[11],{

/***/ "m+Hs":
/*!*******************************************************!*\
  !*** ./modules/MailTnefWebclientPlugin/js/manager.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = function (oAppData) {
  var App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o");
  if (App.isUserNormalOrTenant()) {
    var _ = __webpack_require__(/*! underscore */ "C3HO"),
      ko = __webpack_require__(/*! knockout */ "p09A"),
      TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
      Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
      Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh");
    return {
      start: function start(ModulesManager) {
        App.subscribeEvent('MailWebclient::ParseFile::after', function (oFile) {
          if (oFile && !oFile.inline() && _.isFunction(oFile.addAction) && oFile.extension() === 'dat') {
            oFile.mailtnefSubFilesLoaded = ko.observable(false);
            oFile.mailtnefSubFilesLoading = ko.observable(false);
            oFile.mailtnefExpandFile = function () {
              if (!this.mailtnefSubFilesLoaded() && !this.mailtnefSubFilesLoading()) {
                this.mailtnefSubFilesLoading(true);
                Ajax.send('MailTnefWebclientPlugin', 'ExpandFile', {
                  'Hash': this.hash()
                }, function (oResponse) {
                  this.mailtnefSubFilesLoading(false);
                  if (oResponse.Result) {
                    this.subFiles([]);
                    if (Types.isNonEmptyArray(oResponse.Result)) {
                      _.each(oResponse.Result, _.bind(function (oRawFile) {
                        var oSubFile = oFile.getNewInstance();
                        oSubFile.parse(oRawFile);
                        this.subFiles.push(oSubFile);
                      }, this));
                    }
                    this.mailtnefSubFilesLoaded(true);
                    this.subFilesExpanded(true);
                  }
                }, this);
              } else {
                this.subFilesExpanded(true);
              }
            };
            var oActionData = {
              'Text': ko.computed(function () {
                if (this.subFilesExpanded()) {
                  return TextUtils.i18n('COREWEBCLIENT/ACTION_COLLAPSE_FILE');
                }
                if (this.mailtnefSubFilesLoading()) {
                  return TextUtils.i18n('COREWEBCLIENT/INFO_LOADING');
                }
                return TextUtils.i18n('COREWEBCLIENT/ACTION_EXPAND_FILE');
              }, oFile),
              'Handler': _.bind(function () {
                if (!this.mailtnefSubFilesLoading()) {
                  if (this.subFilesExpanded()) {
                    this.subFilesExpanded(false);
                  } else {
                    this.mailtnefExpandFile();
                  }
                }
              }, oFile)
            };
            oFile.addAction('expand', true, oActionData);
            oFile.removeAction('view');
          }
        });
      }
    };
  }
  return null;
};

/***/ })

}]);