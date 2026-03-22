"use strict";
(self["webpackChunkafterlogic_aurora_platform"] = self["webpackChunkafterlogic_aurora_platform"] || []).push([[0],{

/***/ "5RIG":
/*!******************************************************!*\
  !*** ./modules/CoreWebclient/js/utils/Validation.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  ValidationUtils = {};
ValidationUtils.checkIfFieldsEmpty = function (aRequiredFields, sErrorText) {
  var koFirstEmptyField = _.find(aRequiredFields, function (koField) {
    return koField() === '';
  });
  if (koFirstEmptyField) {
    if (sErrorText) {
      Screens.showError(sErrorText);
    }
    koFirstEmptyField.focused(true);
    return false;
  }
  return true;
};
ValidationUtils.checkPassword = function (sNewPass, sConfirmPassword) {
  var TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
    Settings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "KIwC"),
    bPasswordValid = false;
  if (sConfirmPassword !== sNewPass) {
    Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORDS_DO_NOT_MATCH'));
  } else if (Settings.PasswordMinLength > 0 && sNewPass.length < Settings.PasswordMinLength) {
    Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORD_TOO_SHORT').replace('%N%', Settings.PasswordMinLength));
  } else if (Settings.PasswordMustBeComplex && (!sNewPass.match(/([0-9])/) || !sNewPass.match(/([!,%,&,@,#,$,^,*,?,_,~])/))) {
    Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORD_TOO_SIMPLE'));
  } else {
    bPasswordValid = true;
  }
  return bPasswordValid;
};
module.exports = ValidationUtils;

/***/ }),

/***/ "LZLN":
/*!**************************************************************************!*\
  !*** ./modules/ChangePasswordWebclient/js/popups/ChangePasswordPopup.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "3cxN"),
  ValidationUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Validation.js */ "5RIG"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  AlertPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/AlertPopup.js */ "Rjyw"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  Settings = __webpack_require__(/*! modules/ChangePasswordWebclient/js/Settings.js */ "Qiav");

/**
 * @constructor
 */
function CChangePasswordPopup() {
  CAbstractPopup.call(this);
  this.currentPassword = ko.observable('');
  this.newPassword = ko.observable('');
  this.confirmPassword = ko.observable('');
  this.accountId = ko.observable('');
  this.hasOldPassword = ko.observable(false);
  this.oParams = null;
}
_.extendOwn(CChangePasswordPopup.prototype, CAbstractPopup.prototype);
CChangePasswordPopup.prototype.PopupTemplate = 'ChangePasswordWebclient_ChangePasswordPopup';

/**
 * @param {Object} oParams
 * @param {String} oParams.sModule
 * @param {boolean} oParams.bHasOldPassword
 * @param {Function} oParams.fAfterPasswordChanged
 */
CChangePasswordPopup.prototype.onOpen = function (oParams) {
  this.currentPassword('');
  this.newPassword('');
  this.confirmPassword('');
  this.accountId(oParams.iAccountId);
  this.hasOldPassword(oParams.bHasOldPassword);
  this.oParams = oParams;
};
CChangePasswordPopup.prototype.change = function () {
  var sNewPass = $.trim(this.newPassword()),
    sConfirmPassword = $.trim(this.confirmPassword());
  if (ValidationUtils.checkPassword(sNewPass, sConfirmPassword)) {
    this.sendChangeRequest();
  }
};
CChangePasswordPopup.prototype.sendChangeRequest = function () {
  var oParameters = {
      'AccountId': this.accountId(),
      'CurrentPassword': $.trim(this.currentPassword()),
      'NewPassword': $.trim(this.newPassword())
    },
    oExcept = {
      Module: this.oParams.sModule,
      Method: 'ChangePassword'
    };
  ;
  Ajax.send(this.oParams.sModule, 'ChangePassword', oParameters, this.onUpdatePasswordResponse, this);
  Ajax.abortAndStopSendRequests(oExcept);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CChangePasswordPopup.prototype.onUpdatePasswordResponse = function (oResponse, oRequest) {
  if (oResponse.Result === false) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('CHANGEPASSWORDWEBCLIENT/ERROR_PASSWORD_NOT_SAVED'));
    Ajax.startSendRequests();
  } else {
    if (oResponse.Result && oResponse.Result.RefreshToken) {
      Popups.showPopup(AlertPopup, [TextUtils.i18n('CHANGEPASSWORDWEBCLIENT/REPORT_PASSWORD_CHANGED') + ' ' + TextUtils.i18n('CHANGEPASSWORDWEBCLIENT/REPORT_REDIRECT_TO_LOGIN'), function () {
        App.logout();
      }]);
    } else {
      if (this.hasOldPassword()) {
        Screens.showReport(TextUtils.i18n('CHANGEPASSWORDWEBCLIENT/REPORT_PASSWORD_CHANGED'));
      } else {
        Screens.showReport(TextUtils.i18n('CHANGEPASSWORDWEBCLIENT/REPORT_PASSWORD_SET'));
      }
      this.closePopup();
      if (_.isFunction(this.oParams.fAfterPasswordChanged)) {
        this.oParams.fAfterPasswordChanged();
      }
    }
  }
};
module.exports = new CChangePasswordPopup();

/***/ }),

/***/ "Qiav":
/*!********************************************************!*\
  !*** ./modules/ChangePasswordWebclient/js/Settings.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9");
module.exports = {
  // If true show change password button in common settings, not in mail account properties screen.
  ShowSingleMailChangePasswordInCommonSettings: false,
  // If true show change password button in security settings, not in mail account properties screen or in common settings.
  ShowSingleMailChangePasswordInSecuritySettings: false,
  /**
   * Initializes settings from AppData object sections.
   * 
   * @param {Object} oAppData Object contained modules settings.
   */
  init: function init(oAppData) {
    var oAppDataSection = oAppData['ChangePasswordWebclient'];
    if (!_.isEmpty(oAppDataSection)) {
      this.ShowSingleMailChangePasswordInCommonSettings = Types.pBool(oAppDataSection.ShowSingleMailChangePasswordInCommonSettings, this.ShowSingleMailChangePasswordInCommonSettings);
      this.ShowSingleMailChangePasswordInSecuritySettings = Types.pBool(oAppDataSection.ShowSingleMailChangePasswordInSecuritySettings, this.ShowSingleMailChangePasswordInSecuritySettings);
    }
  }
};

/***/ }),

/***/ "h69C":
/*!*******************************************************!*\
  !*** ./modules/ChangePasswordWebclient/js/manager.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = function (oAppData) {
  var App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o");
  if (App.isUserNormalOrTenant()) {
    var Settings = __webpack_require__(/*! modules/ChangePasswordWebclient/js/Settings.js */ "Qiav");
    Settings.init(oAppData);
    return {
      start: function start(ModulesManager) {
        if (Settings.ShowSingleMailChangePasswordInSecuritySettings && ModulesManager.isModuleEnabled('SecuritySettingsWebclient')) {
          ModulesManager.run('SecuritySettingsWebclient', 'registerSecuritySettingsSection', [function () {
            return __webpack_require__(/*! modules/ChangePasswordWebclient/js/views/ChangeDefaultMailAccountPasswordView.js */ "i3kO");
          }, 'ChangePasswordWebclient']);
        } else if (Settings.ShowSingleMailChangePasswordInCommonSettings) {
          ModulesManager.run('SettingsWebclient', 'registerSettingsTabSection', [function () {
            return __webpack_require__(/*! modules/ChangePasswordWebclient/js/views/ChangeDefaultMailAccountPasswordView.js */ "i3kO");
          }, 'common']);
        }
      },
      getChangePasswordPopup: function getChangePasswordPopup() {
        return __webpack_require__(/*! modules/ChangePasswordWebclient/js/popups/ChangePasswordPopup.js */ "LZLN");
      },
      isChangePasswordButtonAllowed: function isChangePasswordButtonAllowed(iAccountCount, oAccount) {
        return !Settings.ShowSingleMailChangePasswordInCommonSettings && !Settings.ShowSingleMailChangePasswordInSecuritySettings && !!oAccount.aExtend.AllowChangePasswordOnMailServer;
      }
    };
  }
  return null;
};

/***/ }),

/***/ "i3kO":
/*!******************************************************************************************!*\
  !*** ./modules/ChangePasswordWebclient/js/views/ChangeDefaultMailAccountPasswordView.js ***!
  \******************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  ChangePasswordPopup = ModulesManager.run('ChangePasswordWebclient', 'getChangePasswordPopup'),
  Settings = __webpack_require__(/*! modules/ChangePasswordWebclient/js/Settings.js */ "Qiav");

/**
 * @constructor
 */
function CChangeDefaultMailAccountPasswordView() {
  this.oDefaultAccount = null;
  this.showChangePasswordButton = ko.observable(false);
  this.changePasswordHintText = ko.observable('');
  this.init();
}
CChangeDefaultMailAccountPasswordView.prototype.ViewTemplate = 'ChangePasswordWebclient_ChangeDefaultMailAccountPasswordView';
CChangeDefaultMailAccountPasswordView.prototype.init = function () {
  var oAccountList = ModulesManager.run('MailWebclient', 'getAccountList', []),
    fCheckAccountList = function () {
      var oDefaultAccount = oAccountList.getDefault();
      if (oDefaultAccount && oDefaultAccount.aExtend.AllowChangePasswordOnMailServer) {
        this.oDefaultAccount = oDefaultAccount;
        this.showChangePasswordButton(true);
        this.changePasswordHintText(TextUtils.i18n('CHANGEPASSWORDWEBCLIENT/HINT_CHANGE_PASSWORD', {
          'EMAIL': oDefaultAccount.email()
        }));
      } else {
        this.oDefaultAccount = null;
        this.showChangePasswordButton(false);
      }
    }.bind(this);
  if (oAccountList && _.isFunction(oAccountList.collection)) {
    fCheckAccountList();
    oAccountList.collection.subscribe(fCheckAccountList);
  }
};
CChangeDefaultMailAccountPasswordView.prototype.changePassword = function () {
  if (this.oDefaultAccount) {
    Popups.showPopup(ChangePasswordPopup, [{
      iAccountId: this.oDefaultAccount.id(),
      sModule: 'Mail',
      bHasOldPassword: true
    }]);
  }
};
module.exports = new CChangeDefaultMailAccountPasswordView();

/***/ })

}]);