'use strict'

const _ = require('underscore')

const TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
  App = require('%PathToCoreWebclientModule%/js/App.js')

const Settings = require('modules/%ModuleName%/js/Settings.js'),
  TwoFactorApi = require('modules/%ModuleName%/js/utils/Api.js')

module.exports = function (oAppData) {
  Settings.init(oAppData)

  return {
    /**
     * Runs before application start. Subscribes to the event before post displaying.
     *
     * @param {Object} ModulesManager
     */
    start: function (ModulesManager) {
      if (!App.isMobile()) {
        if (ModulesManager.isModuleEnabled('SecuritySettingsWebclient')) {
          ModulesManager.run('SecuritySettingsWebclient', 'registerSecuritySettingsSection', [
            function () {
              return require('modules/%ModuleName%/js/views/TwoFactorAuthSettingsFormView.js')
            },
            '%ModuleName%',
          ])
        } else {
          ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [
            function () {
              return require('modules/%ModuleName%/js/views/TwoFactorAuthSettingsFormView.js')
            },
            Settings.HashModuleName,
            TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB'),
          ])
        }
      }

      if (App.getUserRole() === Enums.UserRole.Anonymous) {
        var onAfterlLoginFormConstructView = function (oParams) {
          var oLoginScreenView = oParams.View,
            Popups = require('%PathToCoreWebclientModule%/js/Popups.js'),
            VerifySecondFactorPopup = require('modules/%ModuleName%/js/popups/VerifySecondFactorPopup.js')
          if (oLoginScreenView) {
            // Do not completely replace previous onSystemLoginResponse, because it might be already changed by another plugin
            var fOldOnSystemLoginResponse = oLoginScreenView.onSystemLoginResponse.bind(oLoginScreenView)
            if (!_.isFunction(fOldOnSystemLoginResponse)) {
              fOldOnSystemLoginResponse = oLoginScreenView.onSystemLoginResponseBase.bind(oLoginScreenView)
            }
            if (!_.isFunction(fOldOnSystemLoginResponse)) {
              fOldOnSystemLoginResponse = function () {}
            }
            oLoginScreenView.onSystemLoginResponse = function (oResponse, oRequest) {
              if (oRequest.Parameters.Domain !== undefined) {
                oRequest.Parameters.Login = oRequest.Parameters.Login + '@' + oRequest.Parameters.Domain
              }

              //if TwoFactorAuth enabled - trying to verify user token
              var oTwoFactorAuthData = oResponse.Result && oResponse.Result.TwoFactorAuth
              if (oTwoFactorAuthData) {
                Popups.showPopup(VerifySecondFactorPopup, [
                  fOldOnSystemLoginResponse,
                  _.bind(function () {
                    this.loading(false)
                  }, this),
                  oTwoFactorAuthData,
                  oRequest.Parameters.Login.split(" ").join(""),
                  oRequest.Parameters.Password,
                ])
              } else {
                const authToken = (oResponse && oResponse.Result && oResponse.Result.AuthToken) || ''
                TwoFactorApi.saveDevice(authToken, () => {
                  fOldOnSystemLoginResponse(oResponse, oRequest)
                })
              }
            }
          }
        }.bind(this)
        App.subscribeEvent('StandardLoginFormWebclient::ConstructView::after', onAfterlLoginFormConstructView)
        App.subscribeEvent('MailLoginFormWebclient::ConstructView::after', onAfterlLoginFormConstructView)
      }
    },
  }
}
