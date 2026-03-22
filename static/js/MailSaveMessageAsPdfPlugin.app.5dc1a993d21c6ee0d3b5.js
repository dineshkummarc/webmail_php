"use strict";
(self["webpackChunkafterlogic_aurora_platform"] = self["webpackChunkafterlogic_aurora_platform"] || []).push([[9],{

/***/ "lurs":
/*!**********************************************************!*\
  !*** ./modules/MailSaveMessageAsPdfPlugin/js/manager.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = function (oAppData) {
  var $ = __webpack_require__(/*! jquery */ "M4cL"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
    UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "3cxN"),
    Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
    Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
    App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o");
  if (App.isUserNormalOrTenant()) {
    return {
      start: function start(ModulesManager) {
        App.subscribeEvent('MailWebclient::AddMoreSectionCommand', function (fAddMoreSectionCommand) {
          fAddMoreSectionCommand({
            'Text': TextUtils.i18n('MAILSAVEMESSAGEASPDFPLUGIN/ACTION_DOWNLOAD_PDF'),
            'CssClass': 'pdf',
            'Handler': function Handler() {
              if (this.currentMessage()) {
                var oBody = this.currentMessage().getDomText(),
                  fReplaceWithBase64 = function fReplaceWithBase64(oImg) {
                    try {
                      var oCanvas = document.createElement('canvas'),
                        oCtx = null;
                      oCanvas.width = oImg.width;
                      oCanvas.height = oImg.height;
                      oCtx = oCanvas.getContext('2d');
                      oCtx.drawImage(oImg, 0, 0);
                      oImg.src = oCanvas.toDataURL('image/png');
                    } catch (e) {}
                  };
                $('img[data-x-src-cid]', oBody).each(function () {
                  fReplaceWithBase64(this);
                });
                Ajax.send('MailSaveMessageAsPdfPlugin', 'GeneratePdfFile', {
                  'FileName': this.subject(),
                  'Html': oBody.html()
                }, function (oResponse) {
                  if (oResponse.Result && oResponse.Result.Actions && oResponse.Result.Actions.download) {
                    UrlUtils.downloadByUrl(oResponse.Result.Actions.download.url);
                  } else {
                    Api.showErrorByCode(oResponse, TextUtils.i18n('MAILSAVEMESSAGEASPDFPLUGIN/ERROR_CREATING_PDF'));
                  }
                }, this);
              }
            }
          });
        });
      }
    };
  }
  return null;
};

/***/ })

}]);