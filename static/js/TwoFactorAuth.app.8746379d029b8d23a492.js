(self["webpackChunkafterlogic_aurora_platform"] = self["webpackChunkafterlogic_aurora_platform"] || []).push([[24],{

/***/ "5m4f":
/*!*********************************************!*\
  !*** ./modules/TwoFactorAuth/js/manager.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO");
var TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o");
var Settings = __webpack_require__(/*! modules/TwoFactorAuth/js/Settings.js */ "JBu3"),
  TwoFactorApi = __webpack_require__(/*! modules/TwoFactorAuth/js/utils/Api.js */ "aGpU");
module.exports = function (oAppData) {
  Settings.init(oAppData);
  return {
    /**
     * Runs before application start. Subscribes to the event before post displaying.
     *
     * @param {Object} ModulesManager
     */
    start: function start(ModulesManager) {
      if (!App.isMobile()) {
        if (ModulesManager.isModuleEnabled('SecuritySettingsWebclient')) {
          ModulesManager.run('SecuritySettingsWebclient', 'registerSecuritySettingsSection', [function () {
            return __webpack_require__(/*! modules/TwoFactorAuth/js/views/TwoFactorAuthSettingsFormView.js */ "hnod");
          }, 'TwoFactorAuth']);
        } else {
          ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [function () {
            return __webpack_require__(/*! modules/TwoFactorAuth/js/views/TwoFactorAuthSettingsFormView.js */ "hnod");
          }, Settings.HashModuleName, TextUtils.i18n('TWOFACTORAUTH/LABEL_SETTINGS_TAB')]);
        }
      }
      if (App.getUserRole() === Enums.UserRole.Anonymous) {
        var onAfterlLoginFormConstructView = function (oParams) {
          var oLoginScreenView = oParams.View,
            Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
            VerifySecondFactorPopup = __webpack_require__(/*! modules/TwoFactorAuth/js/popups/VerifySecondFactorPopup.js */ "t0U+");
          if (oLoginScreenView) {
            // Do not completely replace previous onSystemLoginResponse, because it might be already changed by another plugin
            var fOldOnSystemLoginResponse = oLoginScreenView.onSystemLoginResponse.bind(oLoginScreenView);
            if (!_.isFunction(fOldOnSystemLoginResponse)) {
              fOldOnSystemLoginResponse = oLoginScreenView.onSystemLoginResponseBase.bind(oLoginScreenView);
            }
            if (!_.isFunction(fOldOnSystemLoginResponse)) {
              fOldOnSystemLoginResponse = function fOldOnSystemLoginResponse() {};
            }
            oLoginScreenView.onSystemLoginResponse = function (oResponse, oRequest) {
              if (oRequest.Parameters.Domain !== undefined) {
                oRequest.Parameters.Login = oRequest.Parameters.Login + '@' + oRequest.Parameters.Domain;
              }

              //if TwoFactorAuth enabled - trying to verify user token
              var oTwoFactorAuthData = oResponse.Result && oResponse.Result.TwoFactorAuth;
              if (oTwoFactorAuthData) {
                Popups.showPopup(VerifySecondFactorPopup, [fOldOnSystemLoginResponse, _.bind(function () {
                  this.loading(false);
                }, this), oTwoFactorAuthData, oRequest.Parameters.Login.split(" ").join(""), oRequest.Parameters.Password]);
              } else {
                var authToken = oResponse && oResponse.Result && oResponse.Result.AuthToken || '';
                TwoFactorApi.saveDevice(authToken, function () {
                  fOldOnSystemLoginResponse(oResponse, oRequest);
                });
              }
            };
          }
        }.bind(this);
        App.subscribeEvent('StandardLoginFormWebclient::ConstructView::after', onAfterlLoginFormConstructView);
        App.subscribeEvent('MailLoginFormWebclient::ConstructView::after', onAfterlLoginFormConstructView);
      }
    }
  };
};

/***/ }),

/***/ "BjEp":
/*!*****************************************************************!*\
  !*** ./modules/TwoFactorAuth/js/popups/ShowBackupCodesPopup.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "M4cL");


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  moment = __webpack_require__(/*! moment */ "sdEb"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "MYiO"),
  FileSaver = __webpack_require__(/*! modules/CoreWebclient/js/vendors/FileSaver.js */ "VhVF"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  WindowOpener = __webpack_require__(/*! modules/CoreWebclient/js/WindowOpener.js */ "zVyH"),
  Settings = __webpack_require__(/*! modules/TwoFactorAuth/js/Settings.js */ "JBu3");

/**
 * @constructor
 */
function CShowBackupCodesPopup() {
  CAbstractPopup.call(this);
  this.sEditVerificator = '';
  this.backupCodes = ko.observableArray([]);
  this.codesGeneratedDataInfo = ko.observable('');
  this.fCallBack = null;
  this.generatingBackupCodes = ko.observable(false);
  this.generateBackupCodesCommand = Utils.createCommand(this, this.confirmGenerateNewBackupCodes, function () {
    return !this.generatingBackupCodes();
  });
}
_.extendOwn(CShowBackupCodesPopup.prototype, CAbstractPopup.prototype);
CShowBackupCodesPopup.prototype.PopupTemplate = 'TwoFactorAuth_ShowBackupCodesPopup';
CShowBackupCodesPopup.prototype.onOpen = function (sEditVerificator, fCallBack) {
  this.sEditVerificator = sEditVerificator;
  this.fCallBack = fCallBack;
  if (Settings.BackupCodesCount > 0) {
    this.getBackupCodes();
  } else {
    this.backupCodes([]);
    this.codesGeneratedDataInfo('');
    this.generateBackupCodes();
  }
};
CShowBackupCodesPopup.prototype.onClose = function () {
  if (_.isFunction(this.fCallBack)) {
    this.fCallBack(_.without(this.backupCodes(), '').length);
  }
};
CShowBackupCodesPopup.prototype.getBackupCodes = function () {
  this.backupCodes([]);
  this.codesGeneratedDataInfo('');
  this.generatingBackupCodes(true);
  Ajax.send('TwoFactorAuth', 'GetBackupCodes', {
    'Password': this.sEditVerificator
  }, function (Response) {
    this.generatingBackupCodes(false);
    this.parseBackupCodes(Response);
  }, this);
};
CShowBackupCodesPopup.prototype.confirmGenerateNewBackupCodes = function () {
  Popups.showPopup(ConfirmPopup, [TextUtils.i18n('TWOFACTORAUTH/INFO_GET_NEW_CODES'), function (bOk) {
    if (bOk) {
      this.generateBackupCodes();
    }
  }.bind(this), TextUtils.i18n('TWOFACTORAUTH/CONFIRM_GET_NEW_CODES')]);
};
CShowBackupCodesPopup.prototype.generateBackupCodes = function () {
  this.generatingBackupCodes(true);
  Ajax.send('TwoFactorAuth', 'GenerateBackupCodes', {
    'Password': this.sEditVerificator
  }, function (Response) {
    this.generatingBackupCodes(false);
    this.parseBackupCodes(Response);
  }, this);
};
CShowBackupCodesPopup.prototype.parseBackupCodes = function (Response) {
  var oResult = Response && Response.Result,
    aCodes = oResult && oResult.Codes;
  if (Types.isNonEmptyArray(aCodes)) {
    var oMoment = moment.unix(oResult.Datetime);
    this.codesGeneratedDataInfo(TextUtils.i18n('TWOFACTORAUTH/INFO_CODES_GENERATED_DATA', {
      'DATA': oMoment.format('MMM D, YYYY')
    }));
    this.backupCodes(aCodes);
  }
};
CShowBackupCodesPopup.prototype.getBackupCodesFileText = function () {
  var sText = '';
  sText += TextUtils.i18n('TWOFACTORAUTH/HEADING_SAVE_CODES') + '\n';
  sText += TextUtils.i18n('TWOFACTORAUTH/INFO_KEEP_CODES_SAFE') + '\n';
  sText += '\n';
  _.each(this.backupCodes(), function (sCode, iIndex) {
    sText += iIndex + 1 + '. ' + sCode + '\n';
  });
  sText += '\n';
  sText += App.getUserPublicId() + '\n';
  sText += '\n';
  sText += TextUtils.i18n('TWOFACTORAUTH/INFO_USE_CODE_ONCE') + '\n';
  sText += this.codesGeneratedDataInfo() + '\n';
  return sText;
};
CShowBackupCodesPopup.prototype.print = function () {
  var sText = this.getBackupCodesFileText(),
    oWin = WindowOpener.open('', 'backup-codes-' + App.getUserPublicId() + '-print');
  if (oWin) {
    $(oWin.document.body).html('<pre>' + sText + '</pre>');
    oWin.print();
  }
};
CShowBackupCodesPopup.prototype.download = function () {
  var sText = this.getBackupCodesFileText();
  var oBlob = new Blob([sText], {
    'type': 'text/plain;charset=utf-8'
  });
  FileSaver.saveAs(oBlob, 'backup-codes-' + App.getUserPublicId() + '.txt', true);
};
module.exports = new CShowBackupCodesPopup();

/***/ }),

/***/ "D4nH":
/*!*********************************************************!*\
  !*** ./modules/TwoFactorAuth/js/models/CDeviceModel.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var moment = __webpack_require__(/*! moment */ "sdEb");
var TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o");
var Settings = __webpack_require__(/*! modules/TwoFactorAuth/js/Settings.js */ "JBu3");

/**
 * @constructor
 * @param {object} oData
 * @returns {CDeviceModel}
 */
function CDeviceModel(oData) {
  this.sDeviceId = '';
  this.bCurrentDevice = false;
  this.sDeviceName = '';
  this.sDeviceCustomName = '';
  this.bAuthenticated = false;
  this.sDeviceExpiresDate = '';
  this.sDeviceLastUsageDate = '';
  if (oData) {
    this.parse(oData);
  }
}

/**
 * @param {Object} oData
 */
CDeviceModel.prototype.parse = function (oData) {
  var oExpMoment = moment.unix(oData.TrustTillDateTime),
    oUsageMoment = moment.unix(oData.LastUsageDateTime);
  this.sDeviceId = Types.pString(oData.DeviceId);
  this.bCurrentDevice = this.sDeviceId === App.getCurrentDeviceId();
  this.bAuthenticated = Types.pBool(oData.Authenticated);
  this.sDeviceName = Types.pString(oData.DeviceName);
  this.sDeviceCustomName = Types.pString(oData.DeviceCustomName);
  if (Settings.AllowTrustedDevices && oExpMoment.diff(moment()) > 0) {
    this.sDeviceExpiresDate = TextUtils.i18n('TWOFACTORAUTH/LABEL_DEVICE_TRUST_TILL_DATE', {
      EXPDATE: oExpMoment.format('MMM D, YYYY')
    });
  }
  this.sDeviceLastUsageDate = TextUtils.i18n('TWOFACTORAUTH/LABEL_DEVICE_LAST_USAGE_DATE', {
    USAGEDATE: oUsageMoment.fromNow()
  });
};
module.exports = CDeviceModel;

/***/ }),

/***/ "JBu3":
/*!**********************************************!*\
  !*** ./modules/TwoFactorAuth/js/Settings.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "M4cL");


var ko = __webpack_require__(/*! knockout */ "p09A"),
  _ = __webpack_require__(/*! underscore */ "C3HO"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh");
module.exports = {
  ServerModuleName: 'TwoFactorAuth',
  HashModuleName: 'two-factor-auth',
  AuthenticatorAppEnabled: false,
  ShowRecommendationToConfigure: true,
  AllowBackupCodes: false,
  BackupCodesCount: false,
  AllowSecurityKeys: false,
  AllowAuthenticatorApp: false,
  SecurityKeys: [],
  AllowUsedDevices: false,
  CurrentIP: '',
  TrustDevicesForDays: 0,
  AllowTrustedDevices: false,
  /**
   * Initializes settings from AppData object sections.
   *
   * @param {Object} oAppData Object contained modules settings.
   */
  init: function init(oAppData) {
    var oAppDataSection = _.extend({}, oAppData[this.ServerModuleName] || {}, oAppData['TwoFactorAuth'] || {});
    if (!_.isEmpty(oAppDataSection)) {
      this.ShowRecommendationToConfigure = Types.pBool(oAppDataSection.ShowRecommendationToConfigure, this.ShowRecommendationToConfigure);
      this.AllowBackupCodes = Types.pBool(oAppDataSection.AllowBackupCodes, this.AllowBackupCodes);
      this.BackupCodesCount = Types.pInt(oAppDataSection.BackupCodesCount, this.BackupCodesCount);
      this.AllowSecurityKeys = Types.pBool(oAppDataSection.AllowSecurityKeys, this.AllowSecurityKeys);
      this.AllowAuthenticatorApp = Types.pBool(oAppDataSection.AllowAuthenticatorApp, this.AllowAuthenticatorApp);
      this.AuthenticatorAppEnabled = this.AllowAuthenticatorApp && Types.pBool(oAppDataSection.AuthenticatorAppEnabled, this.AuthenticatorAppEnabled);
      this.AllowUsedDevices = Types.pBool(oAppDataSection.AllowUsedDevices, this.AllowUsedDevices);
      this.CurrentIP = Types.pString(oAppDataSection.CurrentIP, this.CurrentIP);
      this.TrustDevicesForDays = Types.pInt(oAppDataSection.TrustDevicesForDays, this.TrustDevicesForDays);
      this.AllowTrustedDevices = this.TrustDevicesForDays > 0;
      this.SecurityKeys = [];
      if (Types.isNonEmptyArray(oAppDataSection.WebAuthKeysInfo)) {
        _.each(oAppDataSection.WebAuthKeysInfo, function (aSecurityKeyData) {
          if (Types.isNonEmptyArray(aSecurityKeyData, 2)) {
            this.SecurityKeys.push({
              'Id': aSecurityKeyData[0],
              'keyName': ko.observable(aSecurityKeyData[1])
            });
          }
        }.bind(this));
      }
      this.checkIfEnabled();
    }
  },
  updateShowRecommendation: function updateShowRecommendation(bShowRecommendationToConfigure) {
    this.ShowRecommendationToConfigure = bShowRecommendationToConfigure;
  },
  updateBackupCodesCount: function updateBackupCodesCount(iBackupCodesCount) {
    this.BackupCodesCount = iBackupCodesCount;
  },
  updateAuthenticatorApp: function updateAuthenticatorApp(bAuthenticatorAppEnabled) {
    this.AuthenticatorAppEnabled = !!bAuthenticatorAppEnabled;
  },
  checkIfEnabled: function checkIfEnabled() {
    if (!App.isMobile() && App.isUserNormalOrTenant() && this.ShowRecommendationToConfigure) {
      var bTfaSettingsOpened = window.location.hash === 'settings/two-factor-auth' || window.location.hash === '#settings/two-factor-auth';
      var bSecuritySettingsOpened = window.location.hash === 'settings/security' || window.location.hash === '#settings/security';
      if (!this.AuthenticatorAppEnabled && !bTfaSettingsOpened && !bSecuritySettingsOpened) {
        setTimeout(function () {
          var sLink = ModulesManager.isModuleEnabled('SecuritySettingsWebclient') ? '#settings/security' : '#settings/two-factor-auth';
          Screens.showLoading(TextUtils.i18n('TWOFACTORAUTH/CONFIRM_MODULE_NOT_ENABLED', {
            'TWO_FACTOR_LINK': sLink
          }));
          $('.report_panel.loading a').on('click', function () {
            Screens.hideLoading();
          });
          setTimeout(function () {
            Screens.hideLoading();
          }, 10000);
        }, 100);
      }
    }
  }
};

/***/ }),

/***/ "MVsM":
/*!**************************************************!*\
  !*** ./modules/TwoFactorAuth/js/utils/Device.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var UAParser = __webpack_require__(/*! ua-parser-js */ "+147");
var TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9");
module.exports = {
  getName: function getName() {
    var userAgent = navigator.userAgent,
      uaData = UAParser(Types.pString(userAgent));
    return TextUtils.i18n('TWOFACTORAUTH/LABEL_DEVICE_NAME', {
      NAME: "".concat(uaData.browser.name, "/").concat(Types.pInt(uaData.browser.version)),
      PLATFORM: "".concat(uaData.os.name, " ").concat(uaData.os.version)
    });
  }
};

/***/ }),

/***/ "NN8Y":
/*!************************************************************!*\
  !*** ./modules/TwoFactorAuth/js/popups/EditDevicePopup.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A");
var Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av");

/**
 * @constructor
 */
function CEditDevicePopup() {
  CAbstractPopup.call(this);
  this.deviceId = ko.observable('');
  this.customUaName = ko.observable('');
  this.customName = ko.observable('');
  this.successCallback = function () {};
  this.inProgress = ko.observable(false);
}
_.extendOwn(CEditDevicePopup.prototype, CAbstractPopup.prototype);
CEditDevicePopup.prototype.PopupTemplate = 'TwoFactorAuth_EditDevicePopup';
CEditDevicePopup.prototype.onOpen = function (deviceId, deviceName, deviceCustomName, successCallback) {
  this.deviceId(deviceId);
  this.customUaName(deviceName);
  this.customName(deviceCustomName);
  this.successCallback = typeof successCallback === 'function' ? successCallback : function () {};
};
CEditDevicePopup.prototype.saveCustomName = function () {
  var parameters = {
    DeviceId: this.deviceId(),
    DeviceCustomName: this.customName()
  };
  this.inProgress(true);
  Ajax.send('TwoFactorAuth', 'SetDeviceCustomName', parameters, this.onSetDeviceCustomNameResponse, this);
};
CEditDevicePopup.prototype.onSetDeviceCustomNameResponse = function (response) {
  this.inProgress(false);
  if (response && response.Result) {
    this.successCallback();
    this.closePopup();
  } else {
    Api.showErrorByCode(response);
  }
};
module.exports = new CEditDevicePopup();

/***/ }),

/***/ "PW9/":
/*!***************************************************************************!*\
  !*** ./modules/TwoFactorAuth/js/popups/ConfigureAuthenticatorAppPopup.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  QRcode = __webpack_require__(/*! modules/TwoFactorAuth/js/vendors/qr.js */ "WVZ0");

/**
 * @constructor
 */
function CConfigureAuthenticatorAppPopup() {
  CAbstractPopup.call(this);
  this.sEditVerificator = null;
  this.fSuccessCallback = null;
  this.authenticatorQRCodeUrl = ko.observable('');
  this.authenticatorSecret = ko.observable('');
  this.authenticatorCode = ko.observable('');
  this.authenticatorCodeFocus = ko.observable(false);
  this.saveInProgress = ko.observable(false);
  this.qrCodeIsLoading = ko.observable(false);
  this.saveCommand = Utils.createCommand(this, this.save, function () {
    return Types.isNonEmptyString(this.authenticatorQRCodeUrl()) && Types.isNonEmptyString(this.authenticatorSecret()) && Types.isNonEmptyString(this.authenticatorCode());
  });
}
_.extendOwn(CConfigureAuthenticatorAppPopup.prototype, CAbstractPopup.prototype);
CConfigureAuthenticatorAppPopup.prototype.PopupTemplate = 'TwoFactorAuth_ConfigureAuthenticatorAppPopup';
CConfigureAuthenticatorAppPopup.prototype.onOpen = function (sEditVerificator, fSuccessCallback) {
  this.sEditVerificator = sEditVerificator;
  this.fSuccessCallback = fSuccessCallback;
  this.authenticatorQRCodeUrl('');
  this.authenticatorSecret('');
  this.authenticatorCode('');
  this.authenticatorCodeFocus(false);
  this.saveInProgress(false);
  this.qrCodeIsLoading(true);
  this.getAuthenticatorAppData();
};
CConfigureAuthenticatorAppPopup.prototype.getAuthenticatorAppData = function () {
  var oParameters = {
    'Password': this.sEditVerificator
  };
  Ajax.send('TwoFactorAuth', 'RegisterAuthenticatorAppBegin', oParameters, this.onRegisterAuthenticatorAppBeginResponse, this);
};
CConfigureAuthenticatorAppPopup.prototype.onRegisterAuthenticatorAppBeginResponse = function (oResponse) {
  var oResult = oResponse && oResponse.Result;
  if (oResult && oResult.Secret && oResult.QRCodeName) {
    var data = "otpauth://totp/".concat(oResult.QRCodeName, "?secret=").concat(oResult.Secret);
    this.authenticatorQRCodeUrl(QRcode.generatePNG(data, {
      margin: 0,
      modulesize: 6
    }));
    this.authenticatorSecret(oResult.Secret);
    this.authenticatorCodeFocus(true);
  } else {
    Api.showErrorByCode(oResponse, TextUtils.i18n('TWOFACTORAUTH/ERROR_SECRET_GENERATION_FAILED'));
  }
};
CConfigureAuthenticatorAppPopup.prototype.save = function () {
  if (Types.isNonEmptyString(this.authenticatorCode())) {
    var oParameters = {
      'Password': this.sEditVerificator,
      'Code': this.authenticatorCode(),
      'Secret': this.authenticatorSecret()
    };
    this.saveInProgress(true);
    Ajax.send('TwoFactorAuth', 'RegisterAuthenticatorAppFinish', oParameters, this.onRegisterAuthenticatorAppFinishResponse, this);
  }
};
CConfigureAuthenticatorAppPopup.prototype.onRegisterAuthenticatorAppFinishResponse = function (Response) {
  this.saveInProgress(false);
  if (Response && Response.Result) {
    if (_.isFunction(this.fSuccessCallback)) {
      this.fSuccessCallback();
    }
    this.closePopup();
  } else {
    Screens.showError(TextUtils.i18n('TWOFACTORAUTH/ERROR_WRONG_CODE'));
  }
};
module.exports = new CConfigureAuthenticatorAppPopup();

/***/ }),

/***/ "SW2n":
/*!*****************************************************************!*\
  !*** ./modules/TwoFactorAuth/js/popups/EditSecurityKeyPopup.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh");

/**
 * @constructor
 */
function CEditSecurityKeyPopup() {
  CAbstractPopup.call(this);
  this.sEditVerificator = '';
  this.sName = '';
  this.iId = 0;
  this.name = ko.observable('');
  this.nameFocus = ko.observable(true);
  this.inProgress = ko.observable(false);
  this.saveCommand = Utils.createCommand(this, this.save, function () {
    return Types.isNonEmptyString(this.name());
  });
}
_.extendOwn(CEditSecurityKeyPopup.prototype, CAbstractPopup.prototype);
CEditSecurityKeyPopup.prototype.PopupTemplate = 'TwoFactorAuth_EditSecurityKeyPopup';
CEditSecurityKeyPopup.prototype.onOpen = function (sEditVerificator, iId, sName, fCallback) {
  this.sEditVerificator = sEditVerificator;
  this.iId = iId;
  this.name(sName);
  this.nameFocus(true);
  this.fCallback = fCallback;
};
CEditSecurityKeyPopup.prototype.save = function () {
  if (Types.isNonEmptyString(this.name())) {
    var oParameters = {
      'Password': this.sEditVerificator,
      'KeyId': this.iId,
      'NewName': this.name()
    };
    this.inProgress(true);
    Ajax.send('TwoFactorAuth', 'UpdateSecurityKeyName', oParameters, this.onUpdateSecurityKeyNameResponse, this);
  }
};
CEditSecurityKeyPopup.prototype.onUpdateSecurityKeyNameResponse = function (oResponse) {
  this.inProgress(false);
  if (oResponse && oResponse.Result) {
    if (_.isFunction(this.fCallback)) {
      this.fCallback(this.iId, this.name());
    }
    this.closePopup();
  } else {
    Api.showErrorByCode(oResponse, TextUtils.i18n('TWOFACTORAUTH/ERROR_SETUP_SECRET_KEY_NAME'));
  }
};
module.exports = new CEditSecurityKeyPopup();

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

/***/ "WVZ0":
/*!************************************************!*\
  !*** ./modules/TwoFactorAuth/js/vendors/qr.js ***!
  \************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/* qr.js -- QR code generator in Javascript (revision 2011-01-19)
 * Written by Kang Seonghoon <public+qrjs@mearie.org>.
 *
 * This source code is in the public domain; if your jurisdiction does not
 * recognize the public domain the terms of Creative Commons CC0 license
 * apply. In the other words, you can always do what you want.
 */
(function (root, name, definition) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else // removed by dead control flow
{}
})(this, 'QRCode', function () {
  /* Quick overview: QR code composed of 2D array of modules (a rectangular
   * area that conveys one bit of information); some modules are fixed to help
   * the recognition of the code, and remaining data modules are further divided
   * into 8-bit code words which are augumented by Reed-Solomon error correcting
   * codes (ECC). There could be multiple ECCs, in the case the code is so large
   * that it is helpful to split the raw data into several chunks.
   *
   * The number of modules is determined by the code's "version", ranging from 1
   * (21x21) to 40 (177x177). How many ECC bits are used is determined by the
   * ECC level (L/M/Q/H). The number and size (and thus the order of generator
   * polynomial) of ECCs depend to the version and ECC level.
   */

  // per-version information (cf. JIS X 0510:2004 pp. 30--36, 71)
  //
  // [0]: the degree of generator polynomial by ECC levels
  // [1]: # of code blocks by ECC levels
  // [2]: left-top positions of alignment patterns
  //
  // the number in this table (in particular, [0]) does not exactly match with
  // the numbers in the specficiation. see augumenteccs below for the reason.
  var VERSIONS = [null, [[10, 7, 17, 13], [1, 1, 1, 1], []], [[16, 10, 28, 22], [1, 1, 1, 1], [4, 16]], [[26, 15, 22, 18], [1, 1, 2, 2], [4, 20]], [[18, 20, 16, 26], [2, 1, 4, 2], [4, 24]], [[24, 26, 22, 18], [2, 1, 4, 4], [4, 28]], [[16, 18, 28, 24], [4, 2, 4, 4], [4, 32]], [[18, 20, 26, 18], [4, 2, 5, 6], [4, 20, 36]], [[22, 24, 26, 22], [4, 2, 6, 6], [4, 22, 40]], [[22, 30, 24, 20], [5, 2, 8, 8], [4, 24, 44]], [[26, 18, 28, 24], [5, 4, 8, 8], [4, 26, 48]], [[30, 20, 24, 28], [5, 4, 11, 8], [4, 28, 52]], [[22, 24, 28, 26], [8, 4, 11, 10], [4, 30, 56]], [[22, 26, 22, 24], [9, 4, 16, 12], [4, 32, 60]], [[24, 30, 24, 20], [9, 4, 16, 16], [4, 24, 44, 64]], [[24, 22, 24, 30], [10, 6, 18, 12], [4, 24, 46, 68]], [[28, 24, 30, 24], [10, 6, 16, 17], [4, 24, 48, 72]], [[28, 28, 28, 28], [11, 6, 19, 16], [4, 28, 52, 76]], [[26, 30, 28, 28], [13, 6, 21, 18], [4, 28, 54, 80]], [[26, 28, 26, 26], [14, 7, 25, 21], [4, 28, 56, 84]], [[26, 28, 28, 30], [16, 8, 25, 20], [4, 32, 60, 88]], [[26, 28, 30, 28], [17, 8, 25, 23], [4, 26, 48, 70, 92]], [[28, 28, 24, 30], [17, 9, 34, 23], [4, 24, 48, 72, 96]], [[28, 30, 30, 30], [18, 9, 30, 25], [4, 28, 52, 76, 100]], [[28, 30, 30, 30], [20, 10, 32, 27], [4, 26, 52, 78, 104]], [[28, 26, 30, 30], [21, 12, 35, 29], [4, 30, 56, 82, 108]], [[28, 28, 30, 28], [23, 12, 37, 34], [4, 28, 56, 84, 112]], [[28, 30, 30, 30], [25, 12, 40, 34], [4, 32, 60, 88, 116]], [[28, 30, 30, 30], [26, 13, 42, 35], [4, 24, 48, 72, 96, 120]], [[28, 30, 30, 30], [28, 14, 45, 38], [4, 28, 52, 76, 100, 124]], [[28, 30, 30, 30], [29, 15, 48, 40], [4, 24, 50, 76, 102, 128]], [[28, 30, 30, 30], [31, 16, 51, 43], [4, 28, 54, 80, 106, 132]], [[28, 30, 30, 30], [33, 17, 54, 45], [4, 32, 58, 84, 110, 136]], [[28, 30, 30, 30], [35, 18, 57, 48], [4, 28, 56, 84, 112, 140]], [[28, 30, 30, 30], [37, 19, 60, 51], [4, 32, 60, 88, 116, 144]], [[28, 30, 30, 30], [38, 19, 63, 53], [4, 28, 52, 76, 100, 124, 148]], [[28, 30, 30, 30], [40, 20, 66, 56], [4, 22, 48, 74, 100, 126, 152]], [[28, 30, 30, 30], [43, 21, 70, 59], [4, 26, 52, 78, 104, 130, 156]], [[28, 30, 30, 30], [45, 22, 74, 62], [4, 30, 56, 82, 108, 134, 160]], [[28, 30, 30, 30], [47, 24, 77, 65], [4, 24, 52, 80, 108, 136, 164]], [[28, 30, 30, 30], [49, 25, 81, 68], [4, 28, 56, 84, 112, 140, 168]]];

  // mode constants (cf. Table 2 in JIS X 0510:2004 p. 16)
  var MODE_TERMINATOR = 0;
  var MODE_NUMERIC = 1,
    MODE_ALPHANUMERIC = 2,
    MODE_OCTET = 4,
    MODE_KANJI = 8;

  // validation regexps
  var NUMERIC_REGEXP = /^\d*$/;
  var ALPHANUMERIC_REGEXP = /^[A-Za-z0-9 $%*+\-./:]*$/;
  var ALPHANUMERIC_OUT_REGEXP = /^[A-Z0-9 $%*+\-./:]*$/;

  // ECC levels (cf. Table 22 in JIS X 0510:2004 p. 45)
  var ECCLEVEL_L = 1,
    ECCLEVEL_M = 0,
    ECCLEVEL_Q = 3,
    ECCLEVEL_H = 2;

  // GF(2^8)-to-integer mapping with a reducing polynomial x^8+x^4+x^3+x^2+1
  // invariant: GF256_MAP[GF256_INVMAP[i]] == i for all i in [1,256)
  var GF256_MAP = [],
    GF256_INVMAP = [-1];
  for (var i = 0, v = 1; i < 255; ++i) {
    GF256_MAP.push(v);
    GF256_INVMAP[v] = i;
    v = v * 2 ^ (v >= 128 ? 0x11d : 0);
  }

  // generator polynomials up to degree 30
  // (should match with polynomials in JIS X 0510:2004 Appendix A)
  //
  // generator polynomial of degree K is product of (x-\alpha^0), (x-\alpha^1),
  // ..., (x-\alpha^(K-1)). by convention, we omit the K-th coefficient (always 1)
  // from the result; also other coefficients are written in terms of the exponent
  // to \alpha to avoid the redundant calculation. (see also calculateecc below.)
  var GF256_GENPOLY = [[]];
  for (var i = 0; i < 30; ++i) {
    var prevpoly = GF256_GENPOLY[i],
      poly = [];
    for (var j = 0; j <= i; ++j) {
      var a = j < i ? GF256_MAP[prevpoly[j]] : 0;
      var b = GF256_MAP[(i + (prevpoly[j - 1] || 0)) % 255];
      poly.push(GF256_INVMAP[a ^ b]);
    }
    GF256_GENPOLY.push(poly);
  }

  // alphanumeric character mapping (cf. Table 5 in JIS X 0510:2004 p. 19)
  var ALPHANUMERIC_MAP = {};
  for (var i = 0; i < 45; ++i) {
    ALPHANUMERIC_MAP['0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'.charAt(i)] = i;
  }

  // mask functions in terms of row # and column #
  // (cf. Table 20 in JIS X 0510:2004 p. 42)
  var MASKFUNCS = [function (i, j) {
    return (i + j) % 2 == 0;
  }, function (i, j) {
    return i % 2 == 0;
  }, function (i, j) {
    return j % 3 == 0;
  }, function (i, j) {
    return (i + j) % 3 == 0;
  }, function (i, j) {
    return ((i / 2 | 0) + (j / 3 | 0)) % 2 == 0;
  }, function (i, j) {
    return i * j % 2 + i * j % 3 == 0;
  }, function (i, j) {
    return (i * j % 2 + i * j % 3) % 2 == 0;
  }, function (i, j) {
    return ((i + j) % 2 + i * j % 3) % 2 == 0;
  }];

  // returns true when the version information has to be embeded.
  var needsverinfo = function needsverinfo(ver) {
    return ver > 6;
  };

  // returns the size of entire QR code for given version.
  var getsizebyver = function getsizebyver(ver) {
    return 4 * ver + 17;
  };

  // returns the number of bits available for code words in this version.
  var nfullbits = function nfullbits(ver) {
    /*
     * |<--------------- n --------------->|
     * |        |<----- n-17 ---->|        |
     * +-------+                ///+-------+ ----
     * |       |                ///|       |    ^
     * |  9x9  |       @@@@@    ///|  9x8  |    |
     * |       | # # # @5x5@ # # # |       |    |
     * +-------+       @@@@@       +-------+    |
     *       #                               ---|
     *                                        ^ |
     *       #                                |
     *     @@@@@       @@@@@       @@@@@      | n
     *     @5x5@       @5x5@       @5x5@   n-17
     *     @@@@@       @@@@@       @@@@@      | |
     *       #                                | |
     * //////                                 v |
     * //////#                               ---|
     * +-------+       @@@@@       @@@@@        |
     * |       |       @5x5@       @5x5@        |
     * |  8x9  |       @@@@@       @@@@@        |
     * |       |                                v
     * +-------+                             ----
     *
     * when the entire code has n^2 modules and there are m^2-3 alignment
     * patterns, we have:
     * - 225 (= 9x9 + 9x8 + 8x9) modules for finder patterns and
     *   format information;
     * - 2n-34 (= 2(n-17)) modules for timing patterns;
     * - 36 (= 3x6 + 6x3) modules for version information, if any;
     * - 25m^2-75 (= (m^2-3)(5x5)) modules for alignment patterns
     *   if any, but 10m-20 (= 2(m-2)x5) of them overlaps with
     *   timing patterns.
     */
    var v = VERSIONS[ver];
    var nbits = 16 * ver * ver + 128 * ver + 64; // finder, timing and format info.
    if (needsverinfo(ver)) nbits -= 36; // version information
    if (v[2].length) {
      // alignment patterns
      nbits -= 25 * v[2].length * v[2].length - 10 * v[2].length - 55;
    }
    return nbits;
  };

  // returns the number of bits available for data portions (i.e. excludes ECC
  // bits but includes mode and length bits) in this version and ECC level.
  var ndatabits = function ndatabits(ver, ecclevel) {
    var nbits = nfullbits(ver) & ~7; // no sub-octet code words
    var v = VERSIONS[ver];
    nbits -= 8 * v[0][ecclevel] * v[1][ecclevel]; // ecc bits
    return nbits;
  };

  // returns the number of bits required for the length of data.
  // (cf. Table 3 in JIS X 0510:2004 p. 16)
  var ndatalenbits = function ndatalenbits(ver, mode) {
    switch (mode) {
      case MODE_NUMERIC:
        return ver < 10 ? 10 : ver < 27 ? 12 : 14;
      case MODE_ALPHANUMERIC:
        return ver < 10 ? 9 : ver < 27 ? 11 : 13;
      case MODE_OCTET:
        return ver < 10 ? 8 : 16;
      case MODE_KANJI:
        return ver < 10 ? 8 : ver < 27 ? 10 : 12;
    }
  };

  // returns the maximum length of data possible in given configuration.
  var getmaxdatalen = function getmaxdatalen(ver, mode, ecclevel) {
    var nbits = ndatabits(ver, ecclevel) - 4 - ndatalenbits(ver, mode); // 4 for mode bits
    switch (mode) {
      case MODE_NUMERIC:
        return (nbits / 10 | 0) * 3 + (nbits % 10 < 4 ? 0 : nbits % 10 < 7 ? 1 : 2);
      case MODE_ALPHANUMERIC:
        return (nbits / 11 | 0) * 2 + (nbits % 11 < 6 ? 0 : 1);
      case MODE_OCTET:
        return nbits / 8 | 0;
      case MODE_KANJI:
        return nbits / 13 | 0;
    }
  };

  // checks if the given data can be encoded in given mode, and returns
  // the converted data for the further processing if possible. otherwise
  // returns null.
  //
  // this function does not check the length of data; it is a duty of
  // encode function below (as it depends on the version and ECC level too).
  var validatedata = function validatedata(mode, data) {
    switch (mode) {
      case MODE_NUMERIC:
        if (!data.match(NUMERIC_REGEXP)) return null;
        return data;
      case MODE_ALPHANUMERIC:
        if (!data.match(ALPHANUMERIC_REGEXP)) return null;
        return data.toUpperCase();
      case MODE_OCTET:
        if (typeof data === 'string') {
          // encode as utf-8 string
          var newdata = [];
          for (var i = 0; i < data.length; ++i) {
            var ch = data.charCodeAt(i);
            if (ch < 0x80) {
              newdata.push(ch);
            } else if (ch < 0x800) {
              newdata.push(0xc0 | ch >> 6, 0x80 | ch & 0x3f);
            } else if (ch < 0x10000) {
              newdata.push(0xe0 | ch >> 12, 0x80 | ch >> 6 & 0x3f, 0x80 | ch & 0x3f);
            } else {
              newdata.push(0xf0 | ch >> 18, 0x80 | ch >> 12 & 0x3f, 0x80 | ch >> 6 & 0x3f, 0x80 | ch & 0x3f);
            }
          }
          return newdata;
        } else {
          return data;
        }
    }
  };

  // returns the code words (sans ECC bits) for given data and configurations.
  // requires data to be preprocessed by validatedata. no length check is
  // performed, and everything has to be checked before calling this function.
  var encode = function encode(ver, mode, data, maxbuflen) {
    var buf = [];
    var bits = 0,
      remaining = 8;
    var datalen = data.length;

    // this function is intentionally no-op when n=0.
    var pack = function pack(x, n) {
      if (n >= remaining) {
        buf.push(bits | x >> (n -= remaining));
        while (n >= 8) buf.push(x >> (n -= 8) & 255);
        bits = 0;
        remaining = 8;
      }
      if (n > 0) bits |= (x & (1 << n) - 1) << (remaining -= n);
    };
    var nlenbits = ndatalenbits(ver, mode);
    pack(mode, 4);
    pack(datalen, nlenbits);
    switch (mode) {
      case MODE_NUMERIC:
        for (var i = 2; i < datalen; i += 3) {
          pack(parseInt(data.substring(i - 2, i + 1), 10), 10);
        }
        pack(parseInt(data.substring(i - 2), 10), [0, 4, 7][datalen % 3]);
        break;
      case MODE_ALPHANUMERIC:
        for (var i = 1; i < datalen; i += 2) {
          pack(ALPHANUMERIC_MAP[data.charAt(i - 1)] * 45 + ALPHANUMERIC_MAP[data.charAt(i)], 11);
        }
        if (datalen % 2 == 1) {
          pack(ALPHANUMERIC_MAP[data.charAt(i - 1)], 6);
        }
        break;
      case MODE_OCTET:
        for (var i = 0; i < datalen; ++i) {
          pack(data[i], 8);
        }
        break;
    }
    ;

    // final bits. it is possible that adding terminator causes the buffer
    // to overflow, but then the buffer truncated to the maximum size will
    // be valid as the truncated terminator mode bits and padding is
    // identical in appearance (cf. JIS X 0510:2004 sec 8.4.8).
    pack(MODE_TERMINATOR, 4);
    if (remaining < 8) buf.push(bits);

    // the padding to fill up the remaining space. we should not add any
    // words when the overflow already occurred.
    while (buf.length + 1 < maxbuflen) buf.push(0xec, 0x11);
    if (buf.length < maxbuflen) buf.push(0xec);
    return buf;
  };

  // calculates ECC code words for given code words and generator polynomial.
  //
  // this is quite similar to CRC calculation as both Reed-Solomon and CRC use
  // the certain kind of cyclic codes, which is effectively the division of
  // zero-augumented polynomial by the generator polynomial. the only difference
  // is that Reed-Solomon uses GF(2^8), instead of CRC's GF(2), and Reed-Solomon
  // uses the different generator polynomial than CRC's.
  var calculateecc = function calculateecc(poly, genpoly) {
    var modulus = poly.slice(0);
    var polylen = poly.length,
      genpolylen = genpoly.length;
    for (var i = 0; i < genpolylen; ++i) modulus.push(0);
    for (var i = 0; i < polylen;) {
      var quotient = GF256_INVMAP[modulus[i++]];
      if (quotient >= 0) {
        for (var j = 0; j < genpolylen; ++j) {
          modulus[i + j] ^= GF256_MAP[(quotient + genpoly[j]) % 255];
        }
      }
    }
    return modulus.slice(polylen);
  };

  // auguments ECC code words to given code words. the resulting words are
  // ready to be encoded in the matrix.
  //
  // the much of actual augumenting procedure follows JIS X 0510:2004 sec 8.7.
  // the code is simplified using the fact that the size of each code & ECC
  // blocks is almost same; for example, when we have 4 blocks and 46 data words
  // the number of code words in those blocks are 11, 11, 12, 12 respectively.
  var augumenteccs = function augumenteccs(poly, nblocks, genpoly) {
    var subsizes = [];
    var subsize = poly.length / nblocks | 0,
      subsize0 = 0;
    var pivot = nblocks - poly.length % nblocks;
    for (var i = 0; i < pivot; ++i) {
      subsizes.push(subsize0);
      subsize0 += subsize;
    }
    for (var i = pivot; i < nblocks; ++i) {
      subsizes.push(subsize0);
      subsize0 += subsize + 1;
    }
    subsizes.push(subsize0);
    var eccs = [];
    for (var i = 0; i < nblocks; ++i) {
      eccs.push(calculateecc(poly.slice(subsizes[i], subsizes[i + 1]), genpoly));
    }
    var result = [];
    var nitemsperblock = poly.length / nblocks | 0;
    for (var i = 0; i < nitemsperblock; ++i) {
      for (var j = 0; j < nblocks; ++j) {
        result.push(poly[subsizes[j] + i]);
      }
    }
    for (var j = pivot; j < nblocks; ++j) {
      result.push(poly[subsizes[j + 1] - 1]);
    }
    for (var i = 0; i < genpoly.length; ++i) {
      for (var j = 0; j < nblocks; ++j) {
        result.push(eccs[j][i]);
      }
    }
    return result;
  };

  // auguments BCH(p+q,q) code to the polynomial over GF(2), given the proper
  // genpoly. the both input and output are in binary numbers, and unlike
  // calculateecc genpoly should include the 1 bit for the highest degree.
  //
  // actual polynomials used for this procedure are as follows:
  // - p=10, q=5, genpoly=x^10+x^8+x^5+x^4+x^2+x+1 (JIS X 0510:2004 Appendix C)
  // - p=18, q=6, genpoly=x^12+x^11+x^10+x^9+x^8+x^5+x^2+1 (ibid. Appendix D)
  var augumentbch = function augumentbch(poly, p, genpoly, q) {
    var modulus = poly << q;
    for (var i = p - 1; i >= 0; --i) {
      if (modulus >> q + i & 1) modulus ^= genpoly << i;
    }
    return poly << q | modulus;
  };

  // creates the base matrix for given version. it returns two matrices, one of
  // them is the actual one and the another represents the "reserved" portion
  // (e.g. finder and timing patterns) of the matrix.
  //
  // some entries in the matrix may be undefined, rather than 0 or 1. this is
  // intentional (no initialization needed!), and putdata below will fill
  // the remaining ones.
  var makebasematrix = function makebasematrix(ver) {
    var v = VERSIONS[ver],
      n = getsizebyver(ver);
    var matrix = [],
      reserved = [];
    for (var i = 0; i < n; ++i) {
      matrix.push([]);
      reserved.push([]);
    }
    var blit = function blit(y, x, h, w, bits) {
      for (var i = 0; i < h; ++i) {
        for (var j = 0; j < w; ++j) {
          matrix[y + i][x + j] = bits[i] >> j & 1;
          reserved[y + i][x + j] = 1;
        }
      }
    };

    // finder patterns and a part of timing patterns
    // will also mark the format information area (not yet written) as reserved.
    blit(0, 0, 9, 9, [0x7f, 0x41, 0x5d, 0x5d, 0x5d, 0x41, 0x17f, 0x00, 0x40]);
    blit(n - 8, 0, 8, 9, [0x100, 0x7f, 0x41, 0x5d, 0x5d, 0x5d, 0x41, 0x7f]);
    blit(0, n - 8, 9, 8, [0xfe, 0x82, 0xba, 0xba, 0xba, 0x82, 0xfe, 0x00, 0x00]);

    // the rest of timing patterns
    for (var i = 9; i < n - 8; ++i) {
      matrix[6][i] = matrix[i][6] = ~i & 1;
      reserved[6][i] = reserved[i][6] = 1;
    }

    // alignment patterns
    var aligns = v[2],
      m = aligns.length;
    for (var i = 0; i < m; ++i) {
      var minj = i == 0 || i == m - 1 ? 1 : 0,
        maxj = i == 0 ? m - 1 : m;
      for (var j = minj; j < maxj; ++j) {
        blit(aligns[i], aligns[j], 5, 5, [0x1f, 0x11, 0x15, 0x11, 0x1f]);
      }
    }

    // version information
    if (needsverinfo(ver)) {
      var code = augumentbch(ver, 6, 0x1f25, 12);
      var k = 0;
      for (var i = 0; i < 6; ++i) {
        for (var j = 0; j < 3; ++j) {
          matrix[i][n - 11 + j] = matrix[n - 11 + j][i] = code >> k++ & 1;
          reserved[i][n - 11 + j] = reserved[n - 11 + j][i] = 1;
        }
      }
    }
    return {
      matrix: matrix,
      reserved: reserved
    };
  };

  // fills the data portion (i.e. unmarked in reserved) of the matrix with given
  // code words. the size of code words should be no more than available bits,
  // and remaining bits are padded to 0 (cf. JIS X 0510:2004 sec 8.7.3).
  var putdata = function putdata(matrix, reserved, buf) {
    var n = matrix.length;
    var k = 0,
      dir = -1;
    for (var i = n - 1; i >= 0; i -= 2) {
      if (i == 6) --i; // skip the entire timing pattern column
      var jj = dir < 0 ? n - 1 : 0;
      for (var j = 0; j < n; ++j) {
        for (var ii = i; ii > i - 2; --ii) {
          if (!reserved[jj][ii]) {
            // may overflow, but (undefined >> x)
            // is 0 so it will auto-pad to zero.
            matrix[jj][ii] = buf[k >> 3] >> (~k & 7) & 1;
            ++k;
          }
        }
        jj += dir;
      }
      dir = -dir;
    }
    return matrix;
  };

  // XOR-masks the data portion of the matrix. repeating the call with the same
  // arguments will revert the prior call (convenient in the matrix evaluation).
  var maskdata = function maskdata(matrix, reserved, mask) {
    var maskf = MASKFUNCS[mask];
    var n = matrix.length;
    for (var i = 0; i < n; ++i) {
      for (var j = 0; j < n; ++j) {
        if (!reserved[i][j]) matrix[i][j] ^= maskf(i, j);
      }
    }
    return matrix;
  };

  // puts the format information.
  var putformatinfo = function putformatinfo(matrix, reserved, ecclevel, mask) {
    var n = matrix.length;
    var code = augumentbch(ecclevel << 3 | mask, 5, 0x537, 10) ^ 0x5412;
    for (var i = 0; i < 15; ++i) {
      var r = [0, 1, 2, 3, 4, 5, 7, 8, n - 7, n - 6, n - 5, n - 4, n - 3, n - 2, n - 1][i];
      var c = [n - 1, n - 2, n - 3, n - 4, n - 5, n - 6, n - 7, n - 8, 7, 5, 4, 3, 2, 1, 0][i];
      matrix[r][8] = matrix[8][c] = code >> i & 1;
      // we don't have to mark those bits reserved; always done
      // in makebasematrix above.
    }
    return matrix;
  };

  // evaluates the resulting matrix and returns the score (lower is better).
  // (cf. JIS X 0510:2004 sec 8.8.2)
  //
  // the evaluation procedure tries to avoid the problematic patterns naturally
  // occuring from the original matrix. for example, it penaltizes the patterns
  // which just look like the finder pattern which will confuse the decoder.
  // we choose the mask which results in the lowest score among 8 possible ones.
  //
  // note: zxing seems to use the same procedure and in many cases its choice
  // agrees to ours, but sometimes it does not. practically it doesn't matter.
  var evaluatematrix = function evaluatematrix(matrix) {
    // N1+(k-5) points for each consecutive row of k same-colored modules,
    // where k >= 5. no overlapping row counts.
    var PENALTY_CONSECUTIVE = 3;
    // N2 points for each 2x2 block of same-colored modules.
    // overlapping block does count.
    var PENALTY_TWOBYTWO = 3;
    // N3 points for each pattern with >4W:1B:1W:3B:1W:1B or
    // 1B:1W:3B:1W:1B:>4W, or their multiples (e.g. highly unlikely,
    // but 13W:3B:3W:9B:3W:3B counts).
    var PENALTY_FINDERLIKE = 40;
    // N4*k points for every (5*k)% deviation from 50% black density.
    // i.e. k=1 for 55~60% and 40~45%, k=2 for 60~65% and 35~40%, etc.
    var PENALTY_DENSITY = 10;
    var evaluategroup = function evaluategroup(groups) {
      // assumes [W,B,W,B,W,...,B,W]
      var score = 0;
      for (var i = 0; i < groups.length; ++i) {
        if (groups[i] >= 5) score += PENALTY_CONSECUTIVE + (groups[i] - 5);
      }
      for (var i = 5; i < groups.length; i += 2) {
        var p = groups[i];
        if (groups[i - 1] == p && groups[i - 2] == 3 * p && groups[i - 3] == p && groups[i - 4] == p && (groups[i - 5] >= 4 * p || groups[i + 1] >= 4 * p)) {
          // this part differs from zxing...
          score += PENALTY_FINDERLIKE;
        }
      }
      return score;
    };
    var n = matrix.length;
    var score = 0,
      nblacks = 0;
    for (var i = 0; i < n; ++i) {
      var row = matrix[i];
      var groups;

      // evaluate the current row
      groups = [0]; // the first empty group of white
      for (var j = 0; j < n;) {
        var k;
        for (k = 0; j < n && row[j]; ++k) ++j;
        groups.push(k);
        for (k = 0; j < n && !row[j]; ++k) ++j;
        groups.push(k);
      }
      score += evaluategroup(groups);

      // evaluate the current column
      groups = [0];
      for (var j = 0; j < n;) {
        var k;
        for (k = 0; j < n && matrix[j][i]; ++k) ++j;
        groups.push(k);
        for (k = 0; j < n && !matrix[j][i]; ++k) ++j;
        groups.push(k);
      }
      score += evaluategroup(groups);

      // check the 2x2 box and calculate the density
      var nextrow = matrix[i + 1] || [];
      nblacks += row[0];
      for (var j = 1; j < n; ++j) {
        var p = row[j];
        nblacks += p;
        // at least comparison with next row should be strict...
        if (row[j - 1] == p && nextrow[j] === p && nextrow[j - 1] === p) {
          score += PENALTY_TWOBYTWO;
        }
      }
    }
    score += PENALTY_DENSITY * (Math.abs(nblacks / n / n - 0.5) / 0.05 | 0);
    return score;
  };

  // returns the fully encoded QR code matrix which contains given data.
  // it also chooses the best mask automatically when mask is -1.
  var _generate = function generate(data, ver, mode, ecclevel, mask) {
    var v = VERSIONS[ver];
    var buf = encode(ver, mode, data, ndatabits(ver, ecclevel) >> 3);
    buf = augumenteccs(buf, v[1][ecclevel], GF256_GENPOLY[v[0][ecclevel]]);
    var result = makebasematrix(ver);
    var matrix = result.matrix,
      reserved = result.reserved;
    putdata(matrix, reserved, buf);
    if (mask < 0) {
      // find the best mask
      maskdata(matrix, reserved, 0);
      putformatinfo(matrix, reserved, ecclevel, 0);
      var bestmask = 0,
        bestscore = evaluatematrix(matrix);
      maskdata(matrix, reserved, 0);
      for (mask = 1; mask < 8; ++mask) {
        maskdata(matrix, reserved, mask);
        putformatinfo(matrix, reserved, ecclevel, mask);
        var score = evaluatematrix(matrix);
        if (bestscore > score) {
          bestscore = score;
          bestmask = mask;
        }
        maskdata(matrix, reserved, mask);
      }
      mask = bestmask;
    }
    maskdata(matrix, reserved, mask);
    putformatinfo(matrix, reserved, ecclevel, mask);
    return matrix;
  };

  // the public interface is trivial; the options available are as follows:
  //
  // - version: an integer in [1,40]. when omitted (or -1) the smallest possible
  //   version is chosen.
  // - mode: one of 'numeric', 'alphanumeric', 'octet'. when omitted the smallest
  //   possible mode is chosen.
  // - ecclevel: one of 'L', 'M', 'Q', 'H'. defaults to 'L'.
  // - mask: an integer in [0,7]. when omitted (or -1) the best mask is chosen.
  //
  // for generate{HTML,PNG}:
  //
  // - modulesize: a number. this is a size of each modules in pixels, and
  //   defaults to 5px.
  // - margin: a number. this is a size of margin in *modules*, and defaults to
  //   4 (white modules). the specficiation mandates the margin no less than 4
  //   modules, so it is better not to alter this value unless you know what
  //   you're doing.
  var QRCode = {
    'generate': function generate(data, options) {
      var MODES = {
        'numeric': MODE_NUMERIC,
        'alphanumeric': MODE_ALPHANUMERIC,
        'octet': MODE_OCTET
      };
      var ECCLEVELS = {
        'L': ECCLEVEL_L,
        'M': ECCLEVEL_M,
        'Q': ECCLEVEL_Q,
        'H': ECCLEVEL_H
      };
      options = options || {};
      var ver = options.version || -1;
      var ecclevel = ECCLEVELS[(options.ecclevel || 'L').toUpperCase()];
      var mode = options.mode ? MODES[options.mode.toLowerCase()] : -1;
      var mask = 'mask' in options ? options.mask : -1;
      if (mode < 0) {
        if (typeof data === 'string') {
          if (data.match(NUMERIC_REGEXP)) {
            mode = MODE_NUMERIC;
          } else if (data.match(ALPHANUMERIC_OUT_REGEXP)) {
            // while encode supports case-insensitive
            // encoding, we restrict the data to be
            // uppercased when auto-selecting the mode.
            mode = MODE_ALPHANUMERIC;
          } else {
            mode = MODE_OCTET;
          }
        } else {
          mode = MODE_OCTET;
        }
      } else if (!(mode == MODE_NUMERIC || mode == MODE_ALPHANUMERIC || mode == MODE_OCTET)) {
        throw 'invalid or unsupported mode';
      }
      data = validatedata(mode, data);
      if (data === null) throw 'invalid data format';
      if (ecclevel < 0 || ecclevel > 3) throw 'invalid ECC level';
      if (ver < 0) {
        for (ver = 1; ver <= 40; ++ver) {
          if (data.length <= getmaxdatalen(ver, mode, ecclevel)) break;
        }
        if (ver > 40) throw 'too large data';
      } else if (ver < 1 || ver > 40) {
        throw 'invalid version';
      }
      if (mask != -1 && (mask < 0 || mask > 8)) throw 'invalid mask';
      return _generate(data, ver, mode, ecclevel, mask);
    },
    'generateHTML': function generateHTML(data, options) {
      options = options || {};
      var matrix = QRCode['generate'](data, options);
      var modsize = Math.max(options.modulesize || 5, 0.5);
      var margin = Math.max(options.margin !== null ? options.margin : 4, 0.0);
      var e = document.createElement('div');
      var n = matrix.length;
      var html = ['<table border="0" cellspacing="0" cellpadding="0" style="border:' + modsize * margin + 'px solid #fff;background:#fff">'];
      for (var i = 0; i < n; ++i) {
        html.push('<tr>');
        for (var j = 0; j < n; ++j) {
          html.push('<td style="width:' + modsize + 'px;height:' + modsize + 'px' + (matrix[i][j] ? ';background:#000' : '') + '"></td>');
        }
        html.push('</tr>');
      }
      e.className = 'qrcode';
      e.innerHTML = html.join('') + '</table>';
      return e;
    },
    'generateSVG': function generateSVG(data, options) {
      options = options || {};
      var matrix = QRCode['generate'](data, options);
      var n = matrix.length;
      var modsize = Math.max(options.modulesize || 5, 0.5);
      var margin = Math.max(options.margin ? options.margin : 4, 0.0);
      var size = modsize * (n + 2 * margin);
      var common = ' class= "fg"' + ' width="' + modsize + '" height="' + modsize + '"/>';
      var e = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      e.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
      e.setAttribute('style', 'shape-rendering:crispEdges');
      var svg = ['<style scoped>.bg{fill:#FFF}.fg{fill:#000}</style>', '<rect class="bg" x="0" y="0"', 'width="' + size + '" height="' + size + '"/>'];
      var yo = margin * modsize;
      for (var y = 0; y < n; ++y) {
        var xo = margin * modsize;
        for (var x = 0; x < n; ++x) {
          if (matrix[y][x]) svg.push('<rect x="' + xo + '" y="' + yo + '"', common);
          xo += modsize;
        }
        yo += modsize;
      }
      e.innerHTML = svg.join('');
      return e;
    },
    'generatePNG': function generatePNG(data, options) {
      options = options || {};
      var matrix = QRCode['generate'](data, options);
      var modsize = Math.max(options.modulesize || 5, 0.5);
      var margin = Math.max(options.margin != null ? options.margin : 4, 0.0);
      var n = matrix.length;
      var size = modsize * (n + 2 * margin);
      var canvas = document.createElement('canvas'),
        context;
      canvas.width = canvas.height = size;
      context = canvas.getContext('2d');
      if (!context) throw 'canvas support is needed for PNG output';
      context.fillStyle = '#fff';
      context.fillRect(0, 0, size, size);
      context.fillStyle = '#000';
      for (var i = 0; i < n; ++i) {
        for (var j = 0; j < n; ++j) {
          if (matrix[i][j]) {
            context.fillRect(modsize * (margin + j), modsize * (margin + i), modsize, modsize);
          }
        }
      }
      //context.fillText('evaluation: ' + evaluatematrix(matrix), 10, 10);
      return canvas.toDataURL();
    }
  };
  return QRCode;
});

/***/ }),

/***/ "aGpU":
/*!***********************************************!*\
  !*** ./modules/TwoFactorAuth/js/utils/Api.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o");
var DeviceUtils = __webpack_require__(/*! modules/TwoFactorAuth/js/utils/Device.js */ "MVsM"),
  Settings = __webpack_require__(/*! modules/TwoFactorAuth/js/Settings.js */ "JBu3");
module.exports = {
  saveDevice: function saveDevice(authToken, callback) {
    if (!Settings.AllowUsedDevices) {
      callback();
      return;
    }
    var parameters = {
      DeviceId: App.getCurrentDeviceId(),
      DeviceName: DeviceUtils.getName()
    };
    Ajax.send('TwoFactorAuth', 'SetDeviceName', parameters, callback, this, null, authToken);
  }
};

/***/ }),

/***/ "b8T5":
/*!***************************************************!*\
  !*** ./modules/TwoFactorAuth/js/utils/Convert.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


var ConvertUtils = {};
ConvertUtils.base64ToArrayBuffer = function (sBase64) {
  var sBinary = window.atob(sBase64),
    iLen = sBinary.length,
    oBytes = new Uint8Array(iLen);
  for (var i = 0; i < iLen; i++) {
    oBytes[i] = sBinary.charCodeAt(i);
  }
  return oBytes.buffer;
};
ConvertUtils.arrayBufferToBase64 = function (buffer) {
  var sBinary = '',
    oBytes = new Uint8Array(buffer),
    iLen = oBytes.byteLength;
  for (var i = 0; i < iLen; i++) {
    sBinary += String.fromCharCode(oBytes[i]);
  }
  return window.btoa(sBinary);
};
module.exports = ConvertUtils;

/***/ }),

/***/ "hnod":
/*!*************************************************************************!*\
  !*** ./modules/TwoFactorAuth/js/views/TwoFactorAuthSettingsFormView.js ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A");
var TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "MYiO"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh");
var CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass');
var CDeviceModel = __webpack_require__(/*! modules/TwoFactorAuth/js/models/CDeviceModel.js */ "D4nH"),
  ConfigureAuthenticatorAppPopup = __webpack_require__(/*! modules/TwoFactorAuth/js/popups/ConfigureAuthenticatorAppPopup.js */ "PW9/"),
  ConfirmPasswordPopup = __webpack_require__(/*! modules/TwoFactorAuth/js/popups/ConfirmPasswordPopup.js */ "qqvp"),
  CreateSecurityKeyPopup = __webpack_require__(/*! modules/TwoFactorAuth/js/popups/CreateSecurityKeyPopup.js */ "iU3V"),
  EditDevicePopup = __webpack_require__(/*! modules/TwoFactorAuth/js/popups/EditDevicePopup.js */ "NN8Y"),
  Settings = __webpack_require__(/*! modules/TwoFactorAuth/js/Settings.js */ "JBu3"),
  EditSecurityKeyPopup = __webpack_require__(/*! modules/TwoFactorAuth/js/popups/EditSecurityKeyPopup.js */ "SW2n"),
  ShowBackupCodesPopup = __webpack_require__(/*! modules/TwoFactorAuth/js/popups/ShowBackupCodesPopup.js */ "BjEp");

/**
 * @constructor
 */
function CTwoFactorAuthSettingsFormView() {
  CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
  this.subPage = ko.observable(false);
  this.visibleHeading = ko.observable(true); // Can be changed by SecuritySettingsWebclient module

  this.showRecommendationToConfigure = ko.observable(Settings.ShowRecommendationToConfigure);
  this.bAllowSecurityKeys = Settings.AllowSecurityKeys;
  this.bAllowAuthenticatorApp = Settings.AllowAuthenticatorApp;
  this.securityKeys = ko.observableArray(Settings.SecurityKeys);
  this.hasBackupCodes = ko.observable(false);
  this.infoShowBackupCodes = ko.observable('');
  this.hasAuthenticatorApp = ko.observable(Settings.AuthenticatorAppEnabled);
  this.isEnabledTwoFactorAuth = ko.computed(function () {
    return this.hasAuthenticatorApp() || this.securityKeys().length > 0;
  }, this);
  this.isEnabledTwoFactorAuth.subscribe(function () {
    if (!this.isEnabledTwoFactorAuth()) {
      Settings.updateBackupCodesCount(0);
      this.populateSettings();
    }
  }, this);
  this.sEditVerificator = '';
  this.passwordVerified = ko.observable(false);
  this.passwordVerified.subscribe(function (v) {
    this.subPage(!!v);
  }, this);
  this.allowBackupCodes = ko.computed(function () {
    return Settings.AllowBackupCodes && (this.hasAuthenticatorApp() || this.securityKeys().length > 0) && this.passwordVerified();
  }, this);
  this.devices = ko.observableArray([]);
  this.allowUsedDevices = ko.computed(function () {
    return Settings.AllowUsedDevices && this.devices().length > 0;
  }, this);
  this.allowRevokeAll = ko.computed(function () {
    return Settings.AllowTrustedDevices && !!_.find(this.devices(), function (oDevice) {
      return Types.isNonEmptyString(oDevice.sDeviceExpiresDate);
    });
  }, this);
  this.populateSettings();
  this.revokeAllCommand = Utils.createCommand(this, this.askRevokeTrustFromAllDevices, function () {
    return this.allowRevokeAll();
  });
}
_.extendOwn(CTwoFactorAuthSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CTwoFactorAuthSettingsFormView.prototype.ViewTemplate = 'TwoFactorAuth_TwoFactorAuthSettingsFormView';
CTwoFactorAuthSettingsFormView.prototype.onShow = function () {
  this.clearAll();
};
CTwoFactorAuthSettingsFormView.prototype.clearAll = function () {
  this.sEditVerificator = '';
  this.passwordVerified(false);
  this.populateSettings();
  if (Settings.AllowUsedDevices) {
    this.getUsedDevices();
  }
};
CTwoFactorAuthSettingsFormView.prototype.populateSettings = function () {
  this.showRecommendationToConfigure(Settings.ShowRecommendationToConfigure);
  this.hasAuthenticatorApp(Settings.AuthenticatorAppEnabled);
  this.hasBackupCodes(Settings.BackupCodesCount > 0);
  this.infoShowBackupCodes(this.hasBackupCodes() ? TextUtils.i18n('TWOFACTORAUTH/INFO_SHOW_BACKUP_CODES', {
    COUNT: Settings.BackupCodesCount
  }) : '');
};
CTwoFactorAuthSettingsFormView.prototype.confirmPassword = function () {
  Popups.showPopup(ConfirmPasswordPopup, [function (sEditVerificator) {
    this.sEditVerificator = sEditVerificator;
    this.passwordVerified(true);
  }.bind(this)]);
};
CTwoFactorAuthSettingsFormView.prototype.setupAuthenticatorApp = function () {
  Popups.showPopup(ConfigureAuthenticatorAppPopup, [this.sEditVerificator, function () {
    Settings.updateAuthenticatorApp(true);
    this.populateSettings();
    this.disableShowRecommendation();
  }.bind(this)]);
};
CTwoFactorAuthSettingsFormView.prototype.disableShowRecommendation = function () {
  if (this.showRecommendationToConfigure()) {
    this.showRecommendationToConfigure(false);
    Ajax.send('TwoFactorAuth', 'UpdateSettings', {
      ShowRecommendationToConfigure: false
    }, function () {
      Settings.updateShowRecommendation(false);
      this.populateSettings();
    }.bind(this));
  }
};
CTwoFactorAuthSettingsFormView.prototype.askDisableAuthenticatorApp = function () {
  var sConfirm = TextUtils.i18n('TWOFACTORAUTH/CONFIRM_DISABLE_AUTHENTICATOR_APP');
  Popups.showPopup(ConfirmPopup, [sConfirm, _.bind(function (bDisableAuthenticatorApp) {
    if (bDisableAuthenticatorApp) {
      this.disableAuthenticatorApp();
    }
  }, this)]);
};
CTwoFactorAuthSettingsFormView.prototype.disableAuthenticatorApp = function () {
  var oParameters = {
    Password: this.sEditVerificator
  };
  Ajax.send('TwoFactorAuth', 'DisableAuthenticatorApp', oParameters);
  Settings.updateAuthenticatorApp(false);
  this.populateSettings();
};
CTwoFactorAuthSettingsFormView.prototype.showBackupCodes = function () {
  if (this.allowBackupCodes()) {
    Popups.showPopup(ShowBackupCodesPopup, [this.sEditVerificator, function (iBackupCodesCount) {
      Settings.updateBackupCodesCount(iBackupCodesCount);
      this.populateSettings();
    }.bind(this)]);
  }
};
CTwoFactorAuthSettingsFormView.prototype.addSecurityKey = function () {
  Popups.showPopup(CreateSecurityKeyPopup, [this.sEditVerificator, this.addCreatedSecurityKey.bind(this)]);
};
CTwoFactorAuthSettingsFormView.prototype.addCreatedSecurityKey = function (iId, sName) {
  this.securityKeys.push({
    Id: iId,
    keyName: ko.observable(sName)
  });
  this.disableShowRecommendation();
};
CTwoFactorAuthSettingsFormView.prototype.askNewSecurityKeyName = function (iId, sName) {
  Popups.showPopup(EditSecurityKeyPopup, [this.sEditVerificator, iId, sName, this.updateSecurityKeyName.bind(this)]);
};
CTwoFactorAuthSettingsFormView.prototype.updateSecurityKeyName = function (iId, sName) {
  _.each(this.securityKeys(), function (oSecurityKey) {
    if (oSecurityKey.Id === iId) {
      oSecurityKey.keyName(sName);
    }
  });
  this.securityKeys.valueHasMutated();
};
CTwoFactorAuthSettingsFormView.prototype.askRemoveSecurityKey = function (iId, sName) {
  var sConfirm = TextUtils.i18n('TWOFACTORAUTH/CONFIRM_REMOVE_SECURITY_KEY', {
    KEYNAME: sName
  });
  Popups.showPopup(ConfirmPopup, [sConfirm, _.bind(function (bRemoveKey) {
    if (bRemoveKey) {
      this.removeSecurityKey(iId);
    }
  }, this)]);
};
CTwoFactorAuthSettingsFormView.prototype.removeSecurityKey = function (iId) {
  Ajax.send('TwoFactorAuth', 'DeleteSecurityKey', {
    Password: this.sEditVerificator,
    KeyId: iId
  }, function (oResponse) {
    if (oResponse && oResponse.Result) {
      this.securityKeys(_.filter(this.securityKeys(), function (oSecurityKey) {
        return oSecurityKey.Id !== iId;
      }));
      Screens.showReport(TextUtils.i18n('TWOFACTORAUTH/REPORT_DELETE_SECURITY_KEY'));
    } else {
      Api.showErrorByCode(oResponse, TextUtils.i18n('TWOFACTORAUTH/ERROR_DELETE_SECURITY_KEY'));
    }
  }, this);
};
CTwoFactorAuthSettingsFormView.prototype.getUsedDevices = function () {
  Ajax.send('TwoFactorAuth', 'GetUsedDevices', {}, function (oResponse) {
    var aDevicesData = oResponse && oResponse.Result,
      aDevices = [];
    if (Types.isNonEmptyArray(aDevicesData)) {
      _.each(aDevicesData, function (oDeviceData) {
        var oDevice = new CDeviceModel(oDeviceData);
        aDevices.push(oDevice);
      });
    }
    this.devices(aDevices);
  }, this);
};
CTwoFactorAuthSettingsFormView.prototype.askRevokeTrustFromAllDevices = function () {
  var sConfirm = TextUtils.i18n('TWOFACTORAUTH/CONFIRM_REVOKE_ALL'),
    sHeading = TextUtils.i18n('TWOFACTORAUTH/CONFIRM_HEADING_REVOKE_ALL');
  Popups.showPopup(ConfirmPopup, [sConfirm, _.bind(function (bRevokeAll) {
    if (bRevokeAll) {
      this.revokeTrustFromAllDevices();
    }
  }, this), sHeading]);
};
CTwoFactorAuthSettingsFormView.prototype.revokeTrustFromAllDevices = function () {
  Ajax.send('TwoFactorAuth', 'RevokeTrustFromAllDevices', {}, function (oResponse) {
    this.getUsedDevices();
    if (!(oResponse && oResponse.Result)) {
      Api.showErrorByCode(oResponse, TextUtils.i18n('TWOFACTORAUTH/ERROR_REVOKE_TRUST'));
    }
  }, this);
};
CTwoFactorAuthSettingsFormView.prototype.askLogoutFromDevice = function (sDeviceId, sDeviceName) {
  var sConfirm = TextUtils.i18n('TWOFACTORAUTH/CONFIRM_LOGOUT_DEVICE'),
    sHeading = TextUtils.i18n('TWOFACTORAUTH/CONFIRM_HEADING_LOGOUT_DEVICE', {
      NAME: sDeviceName
    });
  Popups.showPopup(ConfirmPopup, [sConfirm, _.bind(function (bLogout) {
    if (bLogout) {
      this.logoutFromDevice(sDeviceId);
    }
  }, this), sHeading]);
};
CTwoFactorAuthSettingsFormView.prototype.logoutFromDevice = function (sDeviceId) {
  var oParameters = {
    DeviceId: sDeviceId
  };
  Ajax.send('TwoFactorAuth', 'LogoutFromDevice', oParameters, function (oResponse) {
    this.getUsedDevices();
    if (!oResponse || !oResponse.Result) {
      Api.showErrorByCode(oResponse, TextUtils.i18n('TWOFACTORAUTH/ERROR_LOGOUT_DEVICE'));
    }
  }, this);
};
CTwoFactorAuthSettingsFormView.prototype.askRemoveDevice = function (sDeviceId, sDeviceName) {
  var sConfirm = TextUtils.i18n('TWOFACTORAUTH/CONFIRM_LOGOUT_DEVICE'),
    sHeading = TextUtils.i18n('TWOFACTORAUTH/CONFIRM_HEADING_REMOVE_DEVICE', {
      NAME: sDeviceName
    });
  Popups.showPopup(ConfirmPopup, [sConfirm, _.bind(function (bLogout) {
    if (bLogout) {
      this.removeDevice(sDeviceId);
    }
  }, this), sHeading]);
};
CTwoFactorAuthSettingsFormView.prototype.removeDevice = function (sDeviceId) {
  var oParameters = {
    DeviceId: sDeviceId
  };
  Ajax.send('TwoFactorAuth', 'RemoveDevice', oParameters, function (oResponse) {
    this.getUsedDevices();
    if (!oResponse || !oResponse.Result) {
      Api.showErrorByCode(oResponse, TextUtils.i18n('TWOFACTORAUTH/ERROR_LOGOUT_DEVICE'));
    }
  }, this);
};
CTwoFactorAuthSettingsFormView.prototype.editDevice = function (deviceId, deviceName, deviceCustomName) {
  var _this = this;
  Popups.showPopup(EditDevicePopup, [deviceId, deviceName, deviceCustomName, function () {
    _this.getUsedDevices();
  }]);
};
module.exports = new CTwoFactorAuthSettingsFormView();

/***/ }),

/***/ "iU3V":
/*!*******************************************************************!*\
  !*** ./modules/TwoFactorAuth/js/popups/CreateSecurityKeyPopup.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  ConvertUtils = __webpack_require__(/*! modules/TwoFactorAuth/js/utils/Convert.js */ "b8T5");

/**
 * @constructor
 */
function CCreateSecurityKeyPopup() {
  CAbstractPopup.call(this);
  this.bSecurityKeysNotSupportedError = !(navigator.credentials && navigator.credentials.create);
  this.bIsHttps = window.location.protocol === 'https:';
  this.sEditVerificator = '';
  this.sName = '';
  this.iId = 0;
  this.name = ko.observable('');
  this.nameFocus = ko.observable(true);
  this.saveNameInProgress = ko.observable(false);
  this.securityKeyInProgress = ko.observable(false);
  this.securityKeyError = ko.observable(false);
  this.securityKeyCanceled = ko.observable(false);
  this.saveCommand = Utils.createCommand(this, this.save, function () {
    return Types.isNonEmptyString(this.name());
  });
}
_.extendOwn(CCreateSecurityKeyPopup.prototype, CAbstractPopup.prototype);
CCreateSecurityKeyPopup.prototype.PopupTemplate = 'TwoFactorAuth_CreateSecurityKeyPopup';
CCreateSecurityKeyPopup.prototype.onOpen = function (sEditVerificator, fCallback) {
  this.sEditVerificator = sEditVerificator;
  this.fCallback = fCallback;
  this.registerSecurityKey();
};
CCreateSecurityKeyPopup.prototype.registerSecurityKey = function (oResponse) {
  if (!this.bSecurityKeysNotSupportedError) {
    this.iId = 0;
    this.name('');
    this.securityKeyInProgress(true);
    this.securityKeyError(false);
    this.securityKeyCanceled(false);
    Ajax.send('TwoFactorAuth', 'RegisterSecurityKeyBegin', {
      'Password': this.sEditVerificator
    }, this.onRegisterSecurityKeyBeginResponse, this);
  } else {
    this.securityKeyInProgress(false);
    this.securityKeyError(true);
  }
};
CCreateSecurityKeyPopup.prototype.onRegisterSecurityKeyBeginResponse = function (oResponse) {
  var _this = this;
  if (oResponse && oResponse.Result) {
    var oCreateArgs = oResponse.Result;
    oCreateArgs.publicKey.challenge = ConvertUtils.base64ToArrayBuffer(oCreateArgs.publicKey.challenge);
    oCreateArgs.publicKey.user.id = ConvertUtils.base64ToArrayBuffer(oCreateArgs.publicKey.user.id);
    navigator.credentials.create(oCreateArgs).then(function (cred) {
      var oParams = {
        'Password': _this.sEditVerificator,
        'Attestation': {
          'attestationObject': ConvertUtils.arrayBufferToBase64(cred.response.attestationObject),
          'clientDataJSON': ConvertUtils.arrayBufferToBase64(cred.response.clientDataJSON)
        }
      };
      Ajax.send('TwoFactorAuth', 'RegisterSecurityKeyFinish', oParams, _this.onRegisterSecurityKeyFinishResponse, _this);
    })["catch"](function (err) {
      _this.securityKeyInProgress(false);
      _this.securityKeyCanceled(true);
    });
  } else {
    this.securityKeyInProgress(false);
    this.closePopup();
    Api.showErrorByCode(oResponse, TextUtils.i18n('TWOFACTORAUTH/ERROR_ADD_SECURITY_KEY'));
  }
};
CCreateSecurityKeyPopup.prototype.onRegisterSecurityKeyFinishResponse = function (oResponse) {
  this.securityKeyInProgress(false);
  if (oResponse && oResponse.Result) {
    this.iId = oResponse.Result;
    this.nameFocus(true);
  } else {
    this.closePopup();
    Api.showErrorByCode(oResponse, TextUtils.i18n('TWOFACTORAUTH/ERROR_ADD_SECURITY_KEY'));
  }
};
CCreateSecurityKeyPopup.prototype.save = function () {
  if (Types.isNonEmptyString(this.name())) {
    var oParameters = {
      'Password': this.sEditVerificator,
      'KeyId': this.iId,
      'NewName': this.name()
    };
    this.saveNameInProgress(true);
    Ajax.send('TwoFactorAuth', 'UpdateSecurityKeyName', oParameters, this.onUpdateSecurityKeyNameResponse, this);
  }
};
CCreateSecurityKeyPopup.prototype.onUpdateSecurityKeyNameResponse = function (oResponse) {
  this.saveNameInProgress(false);
  if (oResponse && oResponse.Result) {
    if (_.isFunction(this.fCallback)) {
      this.fCallback(this.iId, this.name());
    }
    this.closePopup();
  } else {
    if (_.isFunction(this.fCallback)) {
      this.fCallback(this.iId, '');
    }
    this.closePopup();
    Api.showErrorByCode(oResponse, TextUtils.i18n('TWOFACTORAUTH/ERROR_SETUP_SECRET_KEY_NAME'));
  }
};
CCreateSecurityKeyPopup.prototype.cancelPopup = function () {
  // Do not close until name is specified
  // this.closePopup();
};
CCreateSecurityKeyPopup.prototype.onEscHandler = function (oEvent) {
  // Do not close until name is specified
  // this.cancelPopup();
};
module.exports = new CCreateSecurityKeyPopup();

/***/ }),

/***/ "qqvp":
/*!*****************************************************************!*\
  !*** ./modules/TwoFactorAuth/js/popups/ConfirmPasswordPopup.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av");

/**
 * @constructor
 */
function CConfirmPasswordPopup() {
  CAbstractPopup.call(this);
  this.fSuccessCallback = null;
  this.password = ko.observable('');
  this.passwordFocus = ko.observable(true);
  this.inProgress = ko.observable(false);
}
_.extendOwn(CConfirmPasswordPopup.prototype, CAbstractPopup.prototype);
CConfirmPasswordPopup.prototype.PopupTemplate = 'TwoFactorAuth_ConfirmPasswordPopup';
CConfirmPasswordPopup.prototype.onOpen = function (fSuccessCallback) {
  this.fSuccessCallback = fSuccessCallback;
  this.password('');
  this.passwordFocus(true);
};
CConfirmPasswordPopup.prototype.verifyPassword = function () {
  var oParameters = {
    'Password': this.password()
  };
  this.inProgress(true);
  Ajax.send('TwoFactorAuth', 'VerifyPassword', oParameters, this.onVerifyPasswordResponse, this);
};
CConfirmPasswordPopup.prototype.onVerifyPasswordResponse = function (oResponse) {
  this.inProgress(false);
  if (oResponse && oResponse.Result) {
    if (_.isFunction(this.fSuccessCallback)) {
      this.fSuccessCallback(this.password());
    }
    this.closePopup();
  } else {
    Api.showErrorByCode(oResponse, TextUtils.i18n('TWOFACTORAUTH/ERROR_WRONG_PASSWORD'));
  }
};
module.exports = new CConfirmPasswordPopup();

/***/ }),

/***/ "t0U+":
/*!********************************************************************!*\
  !*** ./modules/TwoFactorAuth/js/popups/VerifySecondFactorPopup.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A");
var TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh");
var ConvertUtils = __webpack_require__(/*! modules/TwoFactorAuth/js/utils/Convert.js */ "b8T5"),
  DeviceUtils = __webpack_require__(/*! modules/TwoFactorAuth/js/utils/Device.js */ "MVsM"),
  Settings = __webpack_require__(/*! modules/TwoFactorAuth/js/Settings.js */ "JBu3"),
  TwoFactorApi = __webpack_require__(/*! modules/TwoFactorAuth/js/utils/Api.js */ "aGpU");

/**
 * @constructor
 */
function CVerifySecondFactorPopup() {
  CAbstractPopup.call(this);
  this.isMobile = ko.observable(App.isMobile() || false);
  this.afterVerifyCallback = function () {};
  this.fOnCancel = null;
  this.login = ko.observable(null);
  this.sPassword = null;
  this.bAllowTrustedDevices = Settings.AllowTrustedDevices;
  this.verificationResponse = ko.observable(null);
  this.verificationPassed = ko.computed(function () {
    return this.verificationResponse() !== null;
  }, this);
  this.verificationResponse.subscribe(function () {
    if (this.verificationPassed() && !this.bAllowTrustedDevices) {
      this.afterVerify();
      this.closePopup();
    }
  }, this);
  this.trustThisBrowser = ko.observable(false);
  this.sTrustThisBrowserText = TextUtils.i18n('TWOFACTORAUTH/LABEL_TRUST_DEVICE_PLURAL', {
    COUNT: Settings.TrustDevicesForDays
  }, null, Settings.TrustDevicesForDays);
  this.allOptionsVisible = ko.observable(false);
  this.securityKeyVisible = ko.observable(false);
  this.authenticatorAppVisible = ko.observable(false);
  this.backupCodesVisible = ko.observable(false);
  this.hasSecurityKey = ko.observable(false);
  this.securityKeyInProgress = ko.observable(false);
  this.securityKeyError = ko.observable(false);
  this.bSecurityKeysNotSupportedError = !(navigator.credentials && navigator.credentials.get);
  this.bIsHttps = window.location.protocol === 'https:';
  this.hasAuthenticatorApp = ko.observable(false);
  this.authenticatorCode = ko.observable('');
  this.authenticatorCodeFocused = ko.observable(false);
  this.authenticatorCodeInProgress = ko.observable(false);
  this.hasBackupCodes = ko.observable(false);
  this.backupCode = ko.observable(false);
  this.backupCodeFocus = ko.observable(false);
  this.backupCodeInProgress = ko.observable(false);
  this.hasSeveralOptions = ko.computed(function () {
    var iOptionsCount = 0;
    if (this.hasSecurityKey()) {
      iOptionsCount++;
    }
    if (this.hasAuthenticatorApp()) {
      iOptionsCount++;
    }
    if (this.hasBackupCodes()) {
      iOptionsCount++;
    }
    return iOptionsCount > 1;
  }, this);
  this.continueInProgress = ko.observable(false);
  this.continueCommand = Utils.createCommand(this, this.afterVerify, function () {
    return !this.continueInProgress();
  });
}
_.extendOwn(CVerifySecondFactorPopup.prototype, CAbstractPopup.prototype);
CVerifySecondFactorPopup.prototype.PopupTemplate = 'TwoFactorAuth_VerifySecondFactorPopup';
CVerifySecondFactorPopup.prototype.onOpen = function (afterVerifyCallback, fOnCancel, oTwoFactorAuthData, sLogin, sPassword) {
  this.continueInProgress(false);
  this.afterVerifyCallback = typeof afterVerifyCallback === 'function' ? afterVerifyCallback : function () {};
  this.fOnCancel = fOnCancel;
  this.login(sLogin);
  this.sPassword = sPassword;
  this.hasSecurityKey(Settings.AllowSecurityKeys && oTwoFactorAuthData.HasSecurityKey);
  this.hasAuthenticatorApp(Settings.AllowAuthenticatorApp && oTwoFactorAuthData.HasAuthenticatorApp);
  this.hasBackupCodes(Settings.AllowBackupCodes && oTwoFactorAuthData.HasBackupCodes);
  this.verificationResponse(null);
  this.authenticatorCode('');
  this.authenticatorCodeInProgress(false);
  this.backupCode('');
  this.backupCodeInProgress(false);
  this.allOptionsVisible(false);
  this.securityKeyVisible(false);
  this.authenticatorAppVisible(false);
  this.backupCodesVisible(false);
  if (this.hasSecurityKey()) {
    this.useSecurityKey();
  } else if (this.hasAuthenticatorApp()) {
    this.useAuthenticatorApp();
  }
};
CVerifySecondFactorPopup.prototype.useOtherOption = function () {
  this.allOptionsVisible(true);
  this.securityKeyVisible(false);
  this.authenticatorAppVisible(false);
  this.backupCodesVisible(false);
};
CVerifySecondFactorPopup.prototype.useSecurityKey = function () {
  if (this.hasSecurityKey()) {
    this.allOptionsVisible(false);
    this.securityKeyVisible(true);
    this.authenticatorAppVisible(false);
    this.backupCodesVisible(false);
    this.verifySecurityKey();
  }
};
CVerifySecondFactorPopup.prototype.useAuthenticatorApp = function () {
  if (this.hasAuthenticatorApp()) {
    this.allOptionsVisible(false);
    this.securityKeyVisible(false);
    this.authenticatorAppVisible(true);
    this.backupCodesVisible(false);
    this.authenticatorCodeFocused(true);
  }
};
CVerifySecondFactorPopup.prototype.useBackupCodes = function () {
  if (this.hasBackupCodes()) {
    this.allOptionsVisible(false);
    this.securityKeyVisible(false);
    this.authenticatorAppVisible(false);
    this.backupCodesVisible(true);
    this.backupCodeFocus(true);
  }
};
CVerifySecondFactorPopup.prototype.verifySecurityKey = function () {
  if (!this.bSecurityKeysNotSupportedError) {
    var oParameters = {
      Login: this.login(),
      Password: this.sPassword
    };
    this.securityKeyInProgress(true);
    this.securityKeyError(false);
    Ajax.send('TwoFactorAuth', 'VerifySecurityKeyBegin', oParameters, this.onVerifySecurityKeyBegin, this);
  } else {
    this.securityKeyInProgress(false);
    this.securityKeyError(true);
  }
};
CVerifySecondFactorPopup.prototype.onVerifySecurityKeyBegin = function (oResponse) {
  var _this = this;
  var oGetArgs = oResponse && oResponse.Result;
  if (oGetArgs) {
    oGetArgs.publicKey.challenge = ConvertUtils.base64ToArrayBuffer(oGetArgs.publicKey.challenge);
    oGetArgs.publicKey.allowCredentials.forEach(function (element) {
      element.id = ConvertUtils.base64ToArrayBuffer(element.id);
    });
    navigator.credentials.get(oGetArgs).then(function (oCreds) {
      var oCredsResponse = oCreds && oCreds.response,
        oParameters = {
          Login: _this.login(),
          Password: _this.sPassword,
          Attestation: {
            id: oCreds && oCreds.rawId ? ConvertUtils.arrayBufferToBase64(oCreds.rawId) : null,
            clientDataJSON: oCredsResponse && oCredsResponse.clientDataJSON ? ConvertUtils.arrayBufferToBase64(oCredsResponse.clientDataJSON) : null,
            authenticatorData: oCredsResponse && oCredsResponse.authenticatorData ? ConvertUtils.arrayBufferToBase64(oCredsResponse.authenticatorData) : null,
            signature: oCredsResponse && oCredsResponse.signature ? ConvertUtils.arrayBufferToBase64(oCredsResponse.signature) : null
          }
        };
      Ajax.send('TwoFactorAuth', 'VerifySecurityKeyFinish', oParameters, _this.onVerifySecurityKeyFinish, _this);
    })["catch"](function (err) {
      _this.securityKeyInProgress(false);
      _this.securityKeyError(true);
    });
  } else {
    this.securityKeyInProgress(false);
    this.securityKeyError(true);
    Api.showErrorByCode(oResponse, TextUtils.i18n('TWOFACTORAUTH/ERROR_VERIFY_SECURITY_KEY'));
  }
};
CVerifySecondFactorPopup.prototype.onVerifySecurityKeyFinish = function (oResponse) {
  this.securityKeyInProgress(false);
  if (oResponse && oResponse.Result) {
    this.verificationResponse(oResponse);
  } else {
    this.securityKeyError(true);
    Api.showErrorByCode(oResponse, TextUtils.i18n('TWOFACTORAUTH/ERROR_VERIFY_SECURITY_KEY'));
  }
};
CVerifySecondFactorPopup.prototype.verifyAuthenticatorCode = function () {
  var oParameters = {
    Login: this.login(),
    Password: this.sPassword,
    Code: this.authenticatorCode()
  };
  this.authenticatorCodeInProgress(true);
  Ajax.send('TwoFactorAuth', 'VerifyAuthenticatorAppCode', oParameters, this.onVerifyAuthenticatorAppCodeResponse, this);
};
CVerifySecondFactorPopup.prototype.onVerifyAuthenticatorAppCodeResponse = function (oResponse) {
  var oResult = oResponse.Result;
  this.authenticatorCodeInProgress(false);
  this.authenticatorCode('');
  if (oResult) {
    this.verificationResponse(oResponse);
  } else {
    Screens.showError(TextUtils.i18n('TWOFACTORAUTH/ERROR_WRONG_CODE'));
  }
};
CVerifySecondFactorPopup.prototype.verifyBackupCode = function () {
  var oParameters = {
    Login: this.login(),
    Password: this.sPassword,
    BackupCode: this.backupCode()
  };
  this.backupCodeInProgress(true);
  Ajax.send('TwoFactorAuth', 'VerifyBackupCode', oParameters, this.onVerifyBackupCode, this);
};
CVerifySecondFactorPopup.prototype.onVerifyBackupCode = function (oResponse) {
  var oResult = oResponse.Result;
  this.backupCodeInProgress(false);
  this.backupCode('');
  if (oResult) {
    this.verificationResponse(oResponse);
  } else {
    Screens.showError(TextUtils.i18n('TWOFACTORAUTH/ERROR_WRONG_BACKUP_CODE'));
  }
};
CVerifySecondFactorPopup.prototype.cancelPopup = function () {
  if (_.isFunction(this.fOnCancel)) {
    this.fOnCancel(false);
  }
  this.closePopup();
};
CVerifySecondFactorPopup.prototype.afterVerify = function () {
  var _this2 = this;
  var authToken = this.verificationResponse() && this.verificationResponse().Result && this.verificationResponse().Result.AuthToken || '';
  TwoFactorApi.saveDevice(authToken, function () {
    _this2.trustDevice(authToken, function () {
      _this2.afterVerifyCallback(_this2.verificationResponse());
    });
  });
};
CVerifySecondFactorPopup.prototype.trustDevice = function (authToken, successCallback) {
  if (!Settings.AllowUsedDevices || !this.trustThisBrowser()) {
    successCallback();
    return;
  }
  var parameters = {
    DeviceId: App.getCurrentDeviceId(),
    DeviceName: DeviceUtils.getName(),
    Trust: this.trustThisBrowser()
  };
  this.continueInProgress(true);
  Ajax.send('TwoFactorAuth', 'TrustDevice', parameters, function (response) {
    if (response && response.Result) {
      successCallback();
    } else {
      Api.showErrorByCode(response);
    }
  }, this, null, authToken);
};
module.exports = new CVerifySecondFactorPopup();

/***/ })

}]);