"use strict";
(self["webpackChunkafterlogic_aurora_platform"] = self["webpackChunkafterlogic_aurora_platform"] || []).push([[22],{

/***/ "3wVT":
/*!*************************************************************************!*\
  !*** ./modules/StandardResetPassword/js/views/ResetPasswordFormView.js ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  AddressUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Address.js */ "rBrp"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "ioSH"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "KIwC"),
  CAbstractScreenView = __webpack_require__(/*! modules/CoreWebclient/js/views/CAbstractScreenView.js */ "db2p"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Settings = __webpack_require__(/*! modules/StandardResetPassword/js/Settings.js */ "F7RJ"),
  $html = $('html');

/**
 * @constructor
 */
function CResetPasswordFormView() {
  CAbstractScreenView.call(this, 'StandardResetPassword');
  this.sResetPasswordHash = '#' + Settings.HashModuleName;
  this.sCustomLogoUrl = Settings.CustomLogoUrl;
  this.sBottomInfoHtmlText = Settings.BottomInfoHtmlText;
  this.email = ko.observable('');
  this.emailFocus = ko.observable(false);
  this.newPassword = ko.observable('');
  this.newPasswordFocus = ko.observable(false);
  this.confirmPassword = ko.observable('');
  this.confirmPasswordFocus = ko.observable(false);
  this.step = ko.observable(1);
  this.gettingUserPublicId = ko.observable(false);
  this.resetPasswordHashUserPublicId = ko.observable('');
  this.resetPasswordHashInfo = ko.computed(function () {
    if (this.resetPasswordHashUserPublicId()) {
      return TextUtils.i18n('STANDARDRESETPASSWORD/INFO_RESET_PASSWORD_HASH', {
        'USERNAME': this.resetPasswordHashUserPublicId(),
        'SITE_NAME': UserSettings.SiteName
      });
    }
    if (!this.gettingUserPublicId()) {
      return TextUtils.i18n('STANDARDRESETPASSWORD/ERROR_LINK_NOT_VALID');
    }
    return '';
  }, this);
  this.recoverThroughEmailText = ko.observable('');
  this.sendRecoveryEmailText = ko.observable('');
  this.gettingRecoveryEmail = ko.observable(false);
  this.continueCommand = Utils.createCommand(this, this["continue"], function () {
    return !this.gettingRecoveryEmail();
  });
  this.sendingRecoveryEmail = ko.observable(false);
  this.sendRecoveryEmailCommand = Utils.createCommand(this, this.sendRecoveryEmail, function () {
    return !this.sendingRecoveryEmail();
  });
  this.changingPassword = ko.observable(false);
  this.changePasswordCommand = Utils.createCommand(this, this.changePassword, function () {
    return !this.changingPassword();
  });
  this.passwordChanged = ko.observable(false);
  this.shake = ko.observable(false).extend({
    'autoResetToFalse': 800
  });
  App.broadcastEvent('StandardResetPassword::ConstructView::after', {
    'Name': this.ViewConstructorName,
    'View': this
  });
}
_.extendOwn(CResetPasswordFormView.prototype, CAbstractScreenView.prototype);
CResetPasswordFormView.prototype.ViewTemplate = 'StandardResetPassword_ResetPasswordFormView';
CResetPasswordFormView.prototype.ViewConstructorName = 'CResetPasswordFormView';
CResetPasswordFormView.prototype.onBind = function () {
  $html.addClass('non-adjustable-valign');
};
CResetPasswordFormView.prototype.getResetPasswordHash = function () {
  var aHashArray = Routing.getCurrentHashArray();
  if (aHashArray.length >= 2 && aHashArray[0] === Settings.HashModuleName) {
    return aHashArray[1];
  }
  return '';
}, CResetPasswordFormView.prototype.onRoute = function () {
  var sResetPasswordHash = this.getResetPasswordHash();
  this.resetPasswordHashUserPublicId('');
  if (Types.isNonEmptyString(sResetPasswordHash)) {
    this.step(0);
    this.gettingUserPublicId(true);
    Ajax.send('StandardResetPassword', 'GetUserPublicId', {
      'Hash': sResetPasswordHash
    }, function (oResponse) {
      this.gettingUserPublicId(false);
      if (Types.isNonEmptyString(oResponse.Result)) {
        this.resetPasswordHashUserPublicId(oResponse.Result);
      }
    }, this);
  } else {
    this.step(1);
    _.delay(_.bind(function () {
      if (this.email() === '') {
        this.emailFocus(true);
      }
    }, this), 1);
  }
};
CResetPasswordFormView.prototype["continue"] = function () {
  var sEmail = $.trim(this.email());
  if (sEmail === '') {
    this.emailFocus(true);
    this.shake(true);
  } else if (!AddressUtils.isCorrectEmail(sEmail)) {
    Screens.showError(TextUtils.i18n('STANDARDRESETPASSWORD/ERROR_INCORRECT_EMAIL'));
  } else {
    this.gettingRecoveryEmail(true);
    Ajax.send('StandardResetPassword', 'GetStarredRecoveryEmailAddress', {
      UserPublicId: this.email()
    }, function (oResponse, oRequest) {
      this.gettingRecoveryEmail(false);
      if (Types.isNonEmptyString(oResponse && oResponse.Result)) {
        this.step(2);
        this.recoverThroughEmailText(TextUtils.i18n('STANDARDRESETPASSWORD/INFO_EMAIL_RECOVER_SENT', {
          'USERNAME': this.email(),
          'EMAIL': oResponse && oResponse.Result,
          'SITE_NAME': UserSettings.SiteName
        }));
        this.sendRecoveryEmailText(TextUtils.i18n('STANDARDRESETPASSWORD/INFO_RECOVERY_LINK_SENT', {
          'USERNAME': this.email(),
          'EMAIL': oResponse && oResponse.Result,
          'SITE_NAME': UserSettings.SiteName
        }));
      } else {
        Api.showErrorByCode(oResponse, TextUtils.i18n('STANDARDRESETPASSWORD/ERROR_RECOVERY_EMAIL_NOT_FOUND'));
      }
    }, this);
  }
};
CResetPasswordFormView.prototype.backToStep1 = function () {
  this.recoverThroughEmailText('');
  this.sendRecoveryEmailText('');
  this.step(1);
  this.emailFocus(true);
};
CResetPasswordFormView.prototype.backToStepLogin = function () {
  Routing.setHash('');
};
CResetPasswordFormView.prototype.sendRecoveryEmail = function () {
  this.sendingRecoveryEmail(true);
  Ajax.send('StandardResetPassword', 'SendPasswordResetEmail', {
    UserPublicId: this.email()
  }, function (oResponse, oRequest) {
    this.sendingRecoveryEmail(false);
    if (oResponse && oResponse.Result) {
      this.step(3);
    } else {
      Api.showErrorByCode(oResponse, TextUtils.i18n('STANDARDRESETPASSWORD/ERROR_RECOVERY_EMAIL_NOT_SENT'));
    }
  }, this);
};
CResetPasswordFormView.prototype.changePassword = function () {
  if ($.trim(this.newPassword()) === '') {
    this.newPasswordFocus(true);
    this.shake(true);
  } else if ($.trim(this.confirmPassword()) === '') {
    this.confirmPasswordFocus(true);
    this.shake(true);
  } else if (this.newPassword() !== this.confirmPassword()) {
    Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORDS_DO_NOT_MATCH'));
  } else {
    this.changingPassword(true);
    this.passwordChanged(false);
    Ajax.send('StandardResetPassword', 'ChangePassword', {
      'Hash': this.getResetPasswordHash(),
      'NewPassword': this.newPassword()
    }, function (oResponse, oRequest) {
      this.changingPassword(false);
      if (oResponse && oResponse.Result === true) {
        this.passwordChanged(true);
      } else {
        Api.showErrorByCode(oResponse, TextUtils.i18n('STANDARDRESETPASSWORD/ERROR_PASSWORD_CHANGE'));
      }
    }, this);
  }
};
module.exports = new CResetPasswordFormView();

/***/ }),

/***/ "F7RJ":
/*!******************************************************!*\
  !*** ./modules/StandardResetPassword/js/Settings.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9");
module.exports = {
  HashModuleName: 'reset-password',
  BottomInfoHtmlText: '',
  CustomLogoUrl: '',
  RecoveryEmail: '',
  RecoveryEmailConfirmed: false,
  RecoveryAccount: '',
  /**
   * Initializes settings from AppData object sections.
   * 
   * @param {Object} oAppData Object contained modules settings.
   */
  init: function init(oAppData) {
    var oAppDataSection = oAppData['StandardResetPassword'];
    if (!_.isEmpty(oAppDataSection)) {
      this.HashModuleName = Types.pString(oAppDataSection.HashModuleName, this.HashModuleName);
      this.BottomInfoHtmlText = Types.pString(oAppDataSection.BottomInfoHtmlText, this.BottomInfoHtmlText);
      this.CustomLogoUrl = Types.pString(oAppDataSection.CustomLogoUrl, this.CustomLogoUrl);
      this.RecoveryEmail = Types.pString(oAppDataSection.RecoveryEmail, this.RecoveryEmail);
      this.RecoveryEmailConfirmed = Types.pBool(oAppDataSection.RecoveryEmailConfirmed, this.RecoveryEmailConfirmed);
      this.RecoveryAccount = Types.pString(oAppDataSection.RecoveryAccount, this.RecoveryAccount);
    }
  },
  update: function update(sRecoveryEmail, sRecoveryAccount) {
    this.RecoveryEmail = Types.pString(sRecoveryEmail, this.RecoveryEmail);
    this.RecoveryEmailConfirmed = this.RecoveryEmail === '';
    this.RecoveryAccount = Types.pString(sRecoveryAccount, this.RecoveryAccount);
  }
};

/***/ }),

/***/ "Mhjb":
/*!****************************************************************************!*\
  !*** ./modules/StandardResetPassword/js/views/ForgotPasswordController.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Settings = __webpack_require__(/*! modules/StandardResetPassword/js/Settings.js */ "F7RJ");

/**
 * @constructor
 */
function CForgotPasswordController() {
  this.sResetPasswordHash = '#' + Settings.HashModuleName;
}
CForgotPasswordController.prototype.ViewTemplate = 'StandardResetPassword_ForgotPasswordController';
module.exports = new CForgotPasswordController();

/***/ }),

/***/ "uJ2e":
/*!*****************************************************!*\
  !*** ./modules/StandardResetPassword/js/manager.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = function (oAppData) {
  var _ = __webpack_require__(/*! underscore */ "C3HO"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
    App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
    Settings = __webpack_require__(/*! modules/StandardResetPassword/js/Settings.js */ "F7RJ"),
    bAnonymousUser = App.getUserRole() === Enums.UserRole.Anonymous;
  Settings.init(oAppData);
  if (!App.isPublic() && bAnonymousUser) {
    var fAddControllersToLoginScreen = function fAddControllersToLoginScreen() {
      App.subscribeEvent('AnonymousUserForm::PopulateBeforeButtonsControllers', _.bind(function (oParams) {
        if (_.isFunction(oParams.RegisterBeforeButtonsController) && (oParams.ModuleName === 'StandardLoginFormWebclient' || oParams.ModuleName === 'MailLoginFormWebclient')) {
          oParams.RegisterBeforeButtonsController(__webpack_require__(/*! modules/StandardResetPassword/js/views/ForgotPasswordController.js */ "Mhjb"));
        }
      }, this));
    };
    if (App.isMobile()) {
      return {
        start: function start(ModulesManager) {
          fAddControllersToLoginScreen();
        },
        getScreens: function getScreens() {
          var oScreens = {},
            oLoginScreenView = __webpack_require__(/*! modules/StandardResetPassword/js/views/ResetPasswordFormView.js */ "3wVT");
          if (oLoginScreenView) {
            oLoginScreenView.ViewTemplate = 'StandardResetPassword_ResetPasswordMobileFormView';
            oScreens[Settings.HashModuleName] = function () {
              return oLoginScreenView;
            };
          }
          return oScreens;
        }
      };
    } else {
      return {
        start: function start(ModulesManager) {
          fAddControllersToLoginScreen();
        },
        getScreens: function getScreens() {
          var oScreens = {};
          oScreens[Settings.HashModuleName] = function () {
            return __webpack_require__(/*! modules/StandardResetPassword/js/views/ResetPasswordFormView.js */ "3wVT");
          };
          return oScreens;
        }
      };
    }
  } else if (App.isUserNormalOrTenant() && !App.isMobile()) {
    return {
      start: function start(ModulesManager) {
        if (ModulesManager.isModuleEnabled('SecuritySettingsWebclient')) {
          ModulesManager.run('SecuritySettingsWebclient', 'registerSecuritySettingsSection', [function () {
            var oResetPasswordSettingsFormView = __webpack_require__(/*! modules/StandardResetPassword/js/views/ResetPasswordSettingsFormView.js */ "zN7p");
            oResetPasswordSettingsFormView.ViewTemplate = 'StandardResetPassword_ResetPasswordSettingsSectionFormView';
            return oResetPasswordSettingsFormView;
          }, 'StandardResetPassword']);
        } else {
          ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [function () {
            return __webpack_require__(/*! modules/StandardResetPassword/js/views/ResetPasswordSettingsFormView.js */ "zN7p");
          }, Settings.HashModuleName, TextUtils.i18n('STANDARDRESETPASSWORD/LABEL_SETTINGS_TAB')]);
        }
      }
    };
  }
  return null;
};

/***/ }),

/***/ "wg5a":
/*!**************************************************************************!*\
  !*** ./modules/StandardResetPassword/js/popups/SetRecoveryEmailPopup.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "M4cL");


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  AddressUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Address.js */ "rBrp"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  Settings = __webpack_require__(/*! modules/StandardResetPassword/js/Settings.js */ "F7RJ");

/**
 * @constructor
 */
function CSetRecoveryEmailPopup() {
  CAbstractPopup.call(this);
  this.recoveryEmail = ko.observable('');
  this.recoveryEmailFocus = ko.observable(false);
  this.password = ko.observable('');
  this.passwordFocus = ko.observable(false);
  this.updateMode = ko.observable(false);
  this.loading = ko.observable(false);
  this.recoveryEmailInfo = ko.observable('');
}
_.extendOwn(CSetRecoveryEmailPopup.prototype, CAbstractPopup.prototype);
CSetRecoveryEmailPopup.prototype.PopupTemplate = 'StandardResetPassword_SetRecoveryEmailPopup';
CSetRecoveryEmailPopup.prototype.onOpen = function (fCallback) {
  this.loading(false);
  this.fillRecoveryEmailInfo();
  this.updateMode(Types.isNonEmptyString(Settings.RecoveryEmail));
  this.fCallback = fCallback;
  this.recoveryEmailFocus(true);
};
CSetRecoveryEmailPopup.prototype.onClose = function () {
  this.recoveryEmail('');
  this.password('');
};
CSetRecoveryEmailPopup.prototype.fillRecoveryEmailInfo = function () {
  if (Settings.RecoveryEmail !== '') {
    this.recoveryEmailInfo(TextUtils.i18n('STANDARDRESETPASSWORD/INFO_YOUR_CURRENT_RECOVERY_EMAIL', {
      'EMAIL': Settings.RecoveryEmail
    }));
  } else {
    this.recoveryEmailInfo('');
  }
};
CSetRecoveryEmailPopup.prototype.save = function () {
  var sEmail = $.trim(this.recoveryEmail());
  if (sEmail !== '' && !AddressUtils.isCorrectEmail(sEmail)) {
    Screens.showError(TextUtils.i18n('STANDARDRESETPASSWORD/ERROR_INCORRECT_EMAIL'));
    this.recoveryEmailFocus(true);
    return;
  }
  if ($.trim(this.password()) === '') {
    Screens.showError(TextUtils.i18n('STANDARDRESETPASSWORD/ERROR_EMPTY_PASSWORD'));
    this.passwordFocus(true);
    return;
  }
  this.loading(true);
  Ajax.send('StandardResetPassword', 'UpdateSettings', {
    'RecoveryEmail': this.recoveryEmail(),
    'Password': this.password()
  }, this.onUpdateSettingsResponse, this);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CSetRecoveryEmailPopup.prototype.onUpdateSettingsResponse = function (oResponse, oRequest) {
  this.loading(false);
  if (oResponse.Result) {
    if (_.isFunction(this.fCallback)) {
      this.fCallback(oResponse.Result);
    }
    this.closePopup();
  } else {
    Api.showErrorByCode(oResponse, TextUtils.i18n('STANDARDRESETPASSWORD/ERROR_SET_RECOVERY_EMAIL'));
  }
};
module.exports = new CSetRecoveryEmailPopup();

/***/ }),

/***/ "zN7p":
/*!*********************************************************************************!*\
  !*** ./modules/StandardResetPassword/js/views/ResetPasswordSettingsFormView.js ***!
  \*********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  SetRecoveryEmailPopup = __webpack_require__(/*! modules/StandardResetPassword/js/popups/SetRecoveryEmailPopup.js */ "wg5a"),
  Settings = __webpack_require__(/*! modules/StandardResetPassword/js/Settings.js */ "F7RJ");

/**
 * @constructor
 */
function CResetPasswordSettingsFormView() {
  CAbstractSettingsFormView.call(this, 'StandardResetPassword');
  this.recoveryEmail = ko.observable(Settings.RecoveryEmail);
  this.recoveryEmailConfirmed = ko.observable(Settings.RecoveryEmailConfirmed);
  this.recoveryAccount = ko.observable(Settings.RecoveryAccount);
  this.recoveryEmailInfo = ko.computed(function () {
    var sText = '';
    if (this.recoveryEmail() !== '') {
      var sLangName = this.recoveryEmailConfirmed() ? 'INFO_YOU_HAVE_RECOVERY_EMAIL' : 'INFO_YOU_HAVE_NOT_CONFIRMED_RECOVERY_EMAIL';
      sText = TextUtils.i18n('STANDARDRESETPASSWORD/' + sLangName, {
        'EMAIL': this.recoveryEmail()
      });
      if (this.recoveryAccount()) {
        sText += "<br><br>" + TextUtils.i18n('STANDARDRESETPASSWORD/INFO_CURRENT_RECOVERY_ACCOUNT', {
          'ACCOUNT': this.recoveryAccount()
        });
      }
    } else {
      sText = TextUtils.i18n('STANDARDRESETPASSWORD/INFO_NOT_SET_RECOVERY_EMAIL');
    }
    return sText;
  }, this);
}
_.extendOwn(CResetPasswordSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CResetPasswordSettingsFormView.prototype.ViewTemplate = 'StandardResetPassword_ResetPasswordSettingsFormView';
CResetPasswordSettingsFormView.prototype.setRecoveryEmail = function () {
  Popups.showPopup(SetRecoveryEmailPopup, [function (aData) {
    var sRecoveryEmail = aData === null || aData === void 0 ? void 0 : aData.RecoveryEmail;
    var sRecoveryAccount = aData === null || aData === void 0 ? void 0 : aData.RecoveryAccount;
    this.updateSettings(sRecoveryEmail, sRecoveryAccount);
  }.bind(this)]);
};
CResetPasswordSettingsFormView.prototype.updateSettings = function (sRecoveryEmail, sRecoveryAccount) {
  Settings.update(sRecoveryEmail, sRecoveryAccount);
  this.recoveryEmail(Settings.RecoveryEmail);
  this.recoveryEmailConfirmed(Settings.RecoveryEmailConfirmed);
  this.recoveryAccount(Settings.RecoveryAccount);
};
module.exports = new CResetPasswordSettingsFormView();

/***/ })

}]);