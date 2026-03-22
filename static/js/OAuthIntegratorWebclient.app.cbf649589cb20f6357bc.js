"use strict";
(self["webpackChunkafterlogic_aurora_platform"] = self["webpackChunkafterlogic_aurora_platform"] || []).push([[14],{

/***/ "FL66":
/*!******************************************************************************!*\
  !*** ./modules/OAuthIntegratorWebclient/js/views/CreateLoginPasswordView.js ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  Settings = __webpack_require__(/*! modules/OAuthIntegratorWebclient/js/Settings.js */ "OnkQ");

/**
 * @constructor
 */
function CCreateLoginPasswordView() {
  this.visible = ko.computed(function () {
    return Settings.OnlyPasswordForAccountCreate && !Types.isNonEmptyString(App.firstAccountWithPassLogin());
  });
  this.password = ko.observable('');
  this.passwordFocus = ko.observable(false);
  this.confirmPassword = ko.observable('');
  this.confirmPasswordFocus = ko.observable(false);
  this.login = ko.computed(function () {
    return App.getUserPublicId();
  }, this);
}
CCreateLoginPasswordView.prototype.ViewTemplate = 'OAuthIntegratorWebclient_CreateLoginPasswordView';

/**
 * Broadcasts event to auth module to create auth account.
 */
CCreateLoginPasswordView.prototype.setPassword = function () {
  var sLogin = $.trim(this.login()),
    sPassword = $.trim(this.password()),
    sConfirmPassword = $.trim(this.confirmPassword());
  if (sPassword === '') {
    this.passwordFocus(true);
    return;
  }
  if (sPassword !== sConfirmPassword) {
    Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORDS_DO_NOT_MATCH'));
    this.confirmPasswordFocus(true);
    return;
  }
  App.broadcastEvent(Settings.AuthModuleName + '::CreateUserAuthAccount', {
    'Login': sLogin,
    'Password': sPassword
  });
};
module.exports = new CCreateLoginPasswordView();

/***/ }),

/***/ "OnkQ":
/*!*********************************************************!*\
  !*** ./modules/OAuthIntegratorWebclient/js/Settings.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o");
module.exports = {
  ServerModuleName: 'OAuthIntegratorWebclient',
  HashModuleName: 'oauth-integrator',
  AuthModuleName: 'StandardAuth',
  OnlyPasswordForAccountCreate: true,
  userAccountsCount: ko.observable(0),
  Services: [],
  /**
   * Initializes settings from AppData object sections.
   * 
   * @param {Object} oAppData Object contained modules settings.
   */
  init: function init(oAppData) {
    var oAppDataSection = oAppData['OAuthIntegratorWebclient'];
    if (!_.isEmpty(oAppDataSection)) {
      this.AuthModuleName = Types.pString(oAppDataSection.AuthModuleName, this.AuthModuleName);
      this.OnlyPasswordForAccountCreate = Types.pBool(oAppDataSection.OnlyPasswordForAccountCreate, this.OnlyPasswordForAccountCreate);
      this.Services = Types.pArray(oAppDataSection.Services, this.Services);
    }
    App.registerUserAccountsCount(this.userAccountsCount);
  },
  /**
   * Updates settings that is edited by administrator.
   * 
   * @param {object} oServices Object with services settings.
   */
  updateAdmin: function updateAdmin(oServices) {
    _.each(this.Services, function (oService) {
      var oNewService = oServices[oService.Name];
      if (oNewService) {
        oService.EnableModule = oNewService.EnableModule;
        oService.Id = oNewService.Id;
        oService.Secret = oNewService.Secret;
      }
    });
  }
};

/***/ }),

/***/ "eSMb":
/*!********************************************************!*\
  !*** ./modules/OAuthIntegratorWebclient/js/manager.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = function (oAppData) {
  var _ = __webpack_require__(/*! underscore */ "C3HO"),
    $ = __webpack_require__(/*! jquery */ "M4cL"),
    ko = __webpack_require__(/*! knockout */ "p09A"),
    Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "ioSH"),
    Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
    App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
    Settings = __webpack_require__(/*! modules/OAuthIntegratorWebclient/js/Settings.js */ "OnkQ"),
    bAnonymUser = App.getUserRole() === Enums.UserRole.Anonymous;
  Settings.init(oAppData);
  if (bAnonymUser) {
    return {
      start: function start(ModulesManager) {
        Settings.oauthServices = ko.observableArray([]);
        var fGetInvitationLinkHash = function fGetInvitationLinkHash() {
          var aHashArray = Routing.getCurrentHashArray();
          if (aHashArray.length >= 2 && aHashArray[0] === Settings.RegisterModuleHash) {
            return aHashArray[1];
          }
          return '';
        };
        var fInitialize = function fInitialize(oParams) {
          if ('CLoginView' === oParams.Name || 'CRegisterView' === oParams.Name) {
            var sInvitationLinkHash = fGetInvitationLinkHash();
            oParams.View.externalAuthClick = function (sSocialName) {
              $.cookie('oauth-redirect', 'CLoginView' === oParams.Name ? 'login' : 'register');
              $.cookie('oauth-scopes', 'auth');
              window.location.href = '?oauth=' + sSocialName;
            };
            oParams.View.oauthServices = Settings.oauthServices;
          }
        };
        Ajax.send(Settings.ServerModuleName, 'GetServices', null, function (oResponse) {
          Settings.oauthServices(oResponse.Result);
        }, this);
        App.subscribeEvent('StandardLoginFormWebclient::ConstructView::after', fInitialize);
        App.subscribeEvent('StandardRegisterFormWebclient::ConstructView::after', fInitialize);
      }
    };
  }
  if (App.isUserNormalOrTenant()) {
    return {
      start: function start(ModulesManager) {
        var fGetAccounts = function fGetAccounts() {
          Ajax.send(Settings.ServerModuleName, 'GetAccounts', null, function (oResponse) {
            var iAuthAccountCount = 0;
            if (_.isArray(oResponse.Result)) {
              _.each(oResponse.Result, function (oAccount) {
                if (oAccount.Scopes.indexOf('auth') !== -1) {
                  iAuthAccountCount++;
                }
              });
            }
            Settings.userAccountsCount(iAuthAccountCount);
          });
        };
        App.subscribeEvent('OAuthAccountChange::after', function () {
          fGetAccounts();
        });
        fGetAccounts();
      },
      getCreateLoginPasswordView: function getCreateLoginPasswordView() {
        return __webpack_require__(/*! modules/OAuthIntegratorWebclient/js/views/CreateLoginPasswordView.js */ "FL66");
      }
    };
  }
  return null;
};

/***/ })

}]);