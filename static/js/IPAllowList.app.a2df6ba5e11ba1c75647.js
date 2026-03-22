"use strict";
(self["webpackChunkafterlogic_aurora_platform"] = self["webpackChunkafterlogic_aurora_platform"] || []).push([[5],{

/***/ "B9Jc":
/*!********************************************!*\
  !*** ./modules/IPAllowList/js/Settings.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9");
module.exports = {
  CurrentIP: '',
  /**
   * Initializes settings from AppData object sections.
   *
   * @param {Object} oAppData Object contained modules settings.
   */
  init: function init(oAppData) {
    var oAppDataSection = _.extend({}, oAppData[this.ServerModuleName] || {}, oAppData['IPAllowList'] || {});
    if (!_.isEmpty(oAppDataSection)) {
      this.CurrentIP = Types.pString(oAppDataSection.CurrentIP, this.CurrentIP);
    }
  }
};

/***/ }),

/***/ "Kox+":
/*!*********************************************************************!*\
  !*** ./modules/IPAllowList/js/views/IPAllowListSettingsFormView.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "MYiO"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  AddIpToAllowlistPopup = __webpack_require__(/*! modules/IPAllowList/js/popups/AddIpToAllowlistPopup.js */ "X6JB"),
  Settings = __webpack_require__(/*! modules/IPAllowList/js/Settings.js */ "B9Jc");

/**
 * @constructor
 */
function CIPAllowListSettingsFormView() {
  CAbstractSettingsFormView.call(this);
  this.ipAllowlist = ko.observableArray([]);
  this.sCurrentIp = Settings.CurrentIP;
}
_.extendOwn(CIPAllowListSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CIPAllowListSettingsFormView.prototype.ViewTemplate = 'IPAllowList_IPAllowListSettingsFormView';
CIPAllowListSettingsFormView.prototype.onShow = function () {
  this.clearAll();
};
CIPAllowListSettingsFormView.prototype.clearAll = function () {
  this.populateIpAllowlist();
};
CIPAllowListSettingsFormView.prototype.populateIpAllowlist = function () {
  Ajax.send('IPAllowList', 'GetIpAllowlist', null, function (oResponse) {
    if (_.isObject(oResponse && oResponse.Result)) {
      this.ipAllowlist(_.map(oResponse.Result, function (oData, sKey) {
        return {
          IP: sKey,
          Comment: oData.Comment
        };
      }));
    } else {
      Api.showErrorByCode(oResponse, TextUtils.i18n('IPALLOWLIST/ERROR_CANNOT_GET_IP_ALLOWLIST'));
    }
  }, this);
};
CIPAllowListSettingsFormView.prototype.addIpToAllowlist = function () {
  var aAllowedIpAddresses = _.map(this.ipAllowlist(), function (oIpData) {
    return oIpData.IP;
  });
  Popups.showPopup(AddIpToAllowlistPopup, [aAllowedIpAddresses, this.populateIpAllowlist.bind(this)]);
};
CIPAllowListSettingsFormView.prototype.askRemoveIp = function (sIp) {
  var sConfirm = sIp === this.sCurrentIp && this.ipAllowlist().length > 1 ? TextUtils.i18n('IPALLOWLIST/CONFIRM_REMOVE_CURRENT_IP') : TextUtils.i18n('IPALLOWLIST/CONFIRM_REMOVE_IP'),
    sHeading = TextUtils.i18n('IPALLOWLIST/CONFIRM_HEADING_REMOVE_IP', {
      'IP': sIp
    });
  Popups.showPopup(ConfirmPopup, [sConfirm, _.bind(function (bRemove) {
    if (bRemove) {
      this.removeIp(sIp);
    }
  }, this), sHeading, TextUtils.i18n('IPALLOWLIST/ACTION_PROCEED')]);
};
CIPAllowListSettingsFormView.prototype.removeIp = function (sIp) {
  var oParameters = {
    'IP': sIp
  };
  Ajax.send('IPAllowList', 'RemoveIpFromAllowlist', oParameters, function (oResponse) {
    this.populateIpAllowlist();
    if (oResponse && oResponse.Result) {
      Screens.showReport(TextUtils.i18n('IPALLOWLIST/REPORT_REMOVE_IP'));
    } else {
      Api.showErrorByCode(oResponse, TextUtils.i18n('IPALLOWLIST/ERROR_REMOVE_IP'));
    }
  }, this);
};
module.exports = new CIPAllowListSettingsFormView();

/***/ }),

/***/ "X6JB":
/*!****************************************************************!*\
  !*** ./modules/IPAllowList/js/popups/AddIpToAllowlistPopup.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "MYiO"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  Settings = __webpack_require__(/*! modules/IPAllowList/js/Settings.js */ "B9Jc"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh");

/**
 * @constructor
 */
function CAddIpToAllowlistPopup() {
  CAbstractPopup.call(this);
  this.aAllowedIpAddresses = [];
  this.fCallback = null;
  this.ip = ko.observable('');
  this.ipFocus = ko.observable(true);
  this.comment = ko.observable('');
  this.inProgress = ko.observable(false);
}
_.extendOwn(CAddIpToAllowlistPopup.prototype, CAbstractPopup.prototype);
CAddIpToAllowlistPopup.prototype.PopupTemplate = 'IPAllowList_AddIpToAllowlistPopup';
CAddIpToAllowlistPopup.prototype.onOpen = function (aAllowedIpAddresses, fCallback) {
  this.aAllowedIpAddresses = aAllowedIpAddresses;
  this.fCallback = fCallback;
  this.ip('');
  this.ipFocus(true);
  this.comment('');
};
CAddIpToAllowlistPopup.prototype.validateAndAddIp = function () {
  if (this.ip() === '') {
    Screens.showError(TextUtils.i18n('IPALLOWLIST/ERROR_IP_EMPTY'));
    this.ipFocus(true);
  } else {
    if (this.ip() !== Settings.CurrentIP && this.aAllowedIpAddresses.indexOf(Settings.CurrentIP) === -1) {
      var sConfirm = TextUtils.i18n('IPALLOWLIST/CONFIRM_NOT_CURRENT_IP', {
        'CURRENTIP': Settings.CurrentIP
      });
      Popups.showPopup(ConfirmPopup, [sConfirm, _.bind(function (bProceed) {
        if (bProceed) {
          this.addIp();
        }
      }, this), '', TextUtils.i18n('IPALLOWLIST/ACTION_PROCEED')]);
    } else {
      this.addIp();
    }
  }
};
CAddIpToAllowlistPopup.prototype.addIp = function () {
  var oParameters = {
    'IP': this.ip(),
    'Comment': this.comment()
  };
  this.inProgress(true);
  Ajax.send('IPAllowList', 'AddIpToAllowlist', oParameters, this.onAddIpToAllowlistResponse, this);
};
CAddIpToAllowlistPopup.prototype.onAddIpToAllowlistResponse = function (oResponse) {
  this.inProgress(false);
  if (oResponse && oResponse.Result) {
    Screens.showReport(TextUtils.i18n('IPALLOWLIST/REPORT_ADD_IP'));
    this.close(true);
  } else {
    Api.showErrorByCode(oResponse, TextUtils.i18n('IPALLOWLIST/ERROR_ADD_IP'));
  }
};
CAddIpToAllowlistPopup.prototype.close = function (bIpIsAdded) {
  if (_.isFunction(this.fCallback)) {
    this.fCallback(!!bIpIsAdded);
  }
  this.closePopup();
};
module.exports = new CAddIpToAllowlistPopup();

/***/ }),

/***/ "XySv":
/*!*******************************************!*\
  !*** ./modules/IPAllowList/js/manager.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  Settings = __webpack_require__(/*! modules/IPAllowList/js/Settings.js */ "B9Jc");
module.exports = function (oAppData) {
  Settings.init(oAppData);
  if (App.isUserNormalOrTenant() && !App.isMobile()) {
    return {
      /**
       * Runs before application start. Subscribes to the event before post displaying.
       * 
       * @param {Object} ModulesManager
       */
      start: function start(ModulesManager) {
        if (ModulesManager.isModuleEnabled('SecuritySettingsWebclient')) {
          ModulesManager.run('SecuritySettingsWebclient', 'registerSecuritySettingsSection', [function () {
            var oIPAllowListSettingsFormView = __webpack_require__(/*! modules/IPAllowList/js/views/IPAllowListSettingsFormView.js */ "Kox+");
            oIPAllowListSettingsFormView.ViewTemplate = 'IPAllowList_IPAllowListSettingsSectionFormView';
            return oIPAllowListSettingsFormView;
          }, 'IPAllowList']);
        } else {
          ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [function () {
            return __webpack_require__(/*! modules/IPAllowList/js/views/IPAllowListSettingsFormView.js */ "Kox+");
          }, 'ip-allow-list', TextUtils.i18n('IPALLOWLIST/LABEL_SETTINGS_TAB')]);
        }
      }
    };
  }
  return null;
};

/***/ })

}]);