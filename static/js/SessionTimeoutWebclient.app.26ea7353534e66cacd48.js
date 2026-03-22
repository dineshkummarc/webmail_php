"use strict";
(self["webpackChunkafterlogic_aurora_platform"] = self["webpackChunkafterlogic_aurora_platform"] || []).push([[19],{

/***/ "ZVgR":
/*!*******************************************************!*\
  !*** ./modules/SessionTimeoutWebclient/js/manager.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  aSessionTimeoutFunctions = [],
  iSessionTimeout = 0,
  iTimeoutMinutes = 0;
function LogoutBySessionTimeout() {
  _.each(aSessionTimeoutFunctions, function (oFunc) {
    oFunc();
  });
  _.delay(function () {
    App.logout();
  }, 500);
}
function SetSessionTimeout() {
  clearTimeout(iSessionTimeout);
  iSessionTimeout = setTimeout(LogoutBySessionTimeout, iTimeoutMinutes * 60 * 1000);
}
module.exports = function (oAppData) {
  var App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
    oSettings = oAppData['SessionTimeoutWebclient'] || {};
  if (App.getUserRole() !== Enums.UserRole.Anonymous && typeof oSettings.TimeoutMinutes === 'number' && oSettings.TimeoutMinutes > 0) {
    iTimeoutMinutes = oSettings.TimeoutMinutes;
    SetSessionTimeout();
    $('body').on('click', SetSessionTimeout).on('keydown', SetSessionTimeout);
  }
  if (App.isUserNormalOrTenant()) {
    return {
      registerFunction: function registerFunction(oSessionTimeoutFunction) {
        aSessionTimeoutFunctions.push(oSessionTimeoutFunction);
      }
    };
  }
  return null;
};

/***/ })

}]);