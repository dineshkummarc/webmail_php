'use strict'

// UserSettings use koExtendings
require('%PathToCoreWebclientModule%/js/koExtendings.js')

var _ = require('underscore'),
  $ = require('jquery'),
  ko = require('knockout'),
  modernizr = require('%PathToCoreWebclientModule%/js/vendors/modernizr.js'),
  TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
  Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
  UrlUtils = require('%PathToCoreWebclientModule%/js/utils/Url.js'),
  Utils = require('%PathToCoreWebclientModule%/js/utils/Common.js'),
  Browser = require('%PathToCoreWebclientModule%/js/Browser.js'),
  ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
  Routing = require('%PathToCoreWebclientModule%/js/Routing.js'),
  Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),
  UserSettings = require('%PathToCoreWebclientModule%/js/Settings.js'),
  WindowOpener = require('%PathToCoreWebclientModule%/js/WindowOpener.js'),
  Popups = require('%PathToCoreWebclientModule%/js/Popups.js'),
  ConfirmPopup = require('%PathToCoreWebclientModule%/js/popups/ConfirmPopup.js')
require('%PathToCoreWebclientModule%/js/enums.js')

require('%PathToCoreWebclientModule%/js/koBindings.js')
require('%PathToCoreWebclientModule%/js/koOtherBindings.js')

require('%PathToCoreWebclientModule%/js/vendors/inputosaurus.js')

function InitNotMobileRequires() {
  require('%PathToCoreWebclientModule%/js/CustomTooltip.js')
  require('%PathToCoreWebclientModule%/js/koBindingsNotMobile.js')
}

/**
 * Modernizr build:
 * Method - addTest
 * CSS classes - cssanimations, csstransitions
 */
function InitModernizr() {
  if (modernizr && navigator) {
    modernizr.addTest('newtab', function () {
      return App.isNewTab()
    })

    modernizr.addTest('mobile', function () {
      return App.isMobile()
    })

    if (navigator) {
      modernizr.addTest('native-android-browser', function () {
        var ua = navigator.userAgent
        return (
          ua.indexOf('Mozilla/5.0') > -1 &&
          ua.indexOf('Android ') > -1 &&
          ua.indexOf('534') > -1 &&
          ua.indexOf('AppleWebKit') > -1
        )
      })
    }
  }
}

function CApp() {
  this.iUserRole = window.auroraAppData.User ? Types.pInt(window.auroraAppData.User.Role) : Enums.UserRole.Anonymous
  this.iTenantId = window.auroraAppData.User ? Types.pInt(window.auroraAppData.User.TenantId) : 0
  this.sUserName = window.auroraAppData.User ? Types.pString(window.auroraAppData.User.Name) : ''
  this.sUserPublicId = window.auroraAppData.User ? Types.pString(window.auroraAppData.User.PublicId) : ''
  this.iUserId = window.auroraAppData.User ? Types.pInt(window.auroraAppData.User.Id) : 0
  this.bPublic = false
  this.bNewTab = false

  this.userAuthAccountsCountsArray = ko.observableArray([])
  this.userAccountsCount = ko.computed(function () {
    var iCount = _.reduce(
      this.userAuthAccountsCountsArray(),
      function (iSum, koUserAccountsCount) {
        return iSum + koUserAccountsCount()
      },
      0
    )
    return iCount
  }, this)

  this.userAccountsWithPass = ko.observableArray([])
  this.firstAccountWithPassLogin = ko.computed(function () {
    var sLogin = ''
    _.each(this.userAccountsWithPass(), function (koAccountsWithPass) {
      var aAccountsLogins = koAccountsWithPass()
      if (!Types.isNonEmptyString(sLogin) && aAccountsLogins.length > 0 && Types.isNonEmptyString(aAccountsLogins[0])) {
        sLogin = aAccountsLogins[0]
      }
    })
    return sLogin
  }, this)
  this.mobileCredentialsHintText = ko.computed(function () {
    var sLogin = this.firstAccountWithPassLogin() || this.getUserPublicId()
    return TextUtils.i18n('COREWEBCLIENT/INFO_MOBILE_CREDENTIALS', { LOGIN: sLogin })
  }, this)
}


CApp.prototype.registerUserAccountsCount = function (koUserAccountsCount) {
  this.userAuthAccountsCountsArray.push(koUserAccountsCount)
}

CApp.prototype.registerAccountsWithPass = function (koAccountsWithPass) {
  this.userAccountsWithPass.push(koAccountsWithPass)
}

CApp.prototype.isAccountDeletingAvailable = function () {
  if (this.userAccountsCount() <= 1) {
    Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_ACCOUNT_DELETING_DISABLE'), true)
    return false
  }
  return true
}

CApp.prototype.getUserRole = function () {
  return this.iUserRole
}

CApp.prototype.isUserNormalOrTenant = function () {
  return this.iUserRole === Enums.UserRole.NormalUser || this.iUserRole === Enums.UserRole.TenantAdmin
}

CApp.prototype.getTenantId = function () {
  return this.iTenantId
}

CApp.prototype.getUserName = function () {
  return this.sUserName
}

CApp.prototype.getUserPublicId = function () {
  return this.sUserPublicId
}

CApp.prototype.getUserId = function () {
  return this.iUserId
}

CApp.prototype.setPublic = function () {
  this.bPublic = true
}

CApp.prototype.isPublic = function () {
  return this.bPublic
}

CApp.prototype.setNewTab = function () {
  this.bNewTab = true
}

CApp.prototype.isNewTab = function () {
  return this.bNewTab
}

CApp.prototype.isMobile = function () {
  return UserSettings.IsMobile === 1
}

function saveDeviceId(deviceId) {
  $.cookie('DeviceId', deviceId, { expires: 365 })
}

function refreshOrGenerateAndSaveDeviceId() {
  const deviceId = $.cookie('DeviceId') || Utils.generateUUID()
  saveDeviceId(deviceId)
}

CApp.prototype.getCurrentDeviceId = function () {
  let deviceId = $.cookie('DeviceId')
  if (!deviceId) {
    deviceId = Utils.generateUUID()
    saveDeviceId(deviceId)
  }
  return deviceId
}

CApp.prototype.init = function () {
  InitModernizr()

  ModulesManager.run('StandardLoginFormWebclient', 'beforeAppRunning', [this.iUserRole !== Enums.UserRole.Anonymous])

  if (App.isUserNormalOrTenant() && UserSettings.AllowChangeSettings) {
    ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [
      function () {
        return require('%PathToCoreWebclientModule%/js/views/CommonSettingsFormView.js')
      },
      'common',
      TextUtils.i18n('%MODULENAME%/LABEL_COMMON_SETTINGS_TABNAME'),
    ])
  }

  ModulesManager.run('Ios', 'routeToIos')

  let AccountList
  if (this.iUserRole !== Enums.UserRole.Anonymous) {
    var MainTab = App.isNewTab() && window.opener && window.opener.MainTabMailMethods
    AccountList = MainTab ? MainTab.getAccountList() : ModulesManager.run('MailWebclient', 'getAccountList')
    if (AccountList) {
      this.currentAccountId = AccountList.currentId
      this.hasAccountWithId = _.bind(AccountList.hasAccountWithId, AccountList)

      this.currentAccountEmail = ko.computed(function () {
        var oAccount = AccountList.getAccount(this.currentAccountId())
        return oAccount ? oAccount.email() : ''
      }, this)

      this.getAttendee = function (aAttendees) {
        return AccountList.getAttendee(
          _.map(
            aAttendees,
            function (mAttendee) {
              return Types.isString(mAttendee) ? mAttendee : mAttendee.email
            },
            this
          )
        )
      }
    } else {
      this.currentAccountEmail = _.bind(function () {
        return this.sUserName
      }, this)
    }
  }

  if (!this.isMobile()) {
    InitNotMobileRequires()
  }

  Screens.init(this.iUserRole === Enums.UserRole.Anonymous)

  require('%PathToCoreWebclientModule%/js/AppTab.js')
  if (!this.bNewTab) {
    require('%PathToCoreWebclientModule%/js/Prefetcher.js')
  }

  this.useGoogleAnalytics()

  if (!this.isMobile()) {
    $(window).on('unload', function () {
      WindowOpener.closeAll()
    })
  }

  window.onbeforeunload = _.bind(function () {
    if (Screens.hasUnsavedChanges() || Popups.hasUnsavedChanges()) {
      return ''
    }
    WindowOpener.getOpenedWindows() // prepare open windows by removing those that already have a different origin
  }, this)

  if (Browser.ie8AndBelow) {
    $('body').css('overflow', 'hidden')
  }

  ModulesManager.start()
  Screens.start()

  this.checkCookies()

  this.showLastErrorOnLogin()

  if (UserSettings.IsSystemConfigured === false) {
    Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_SYSTEM_NOT_CONFIGURED'), true)
  }

  Routing.init()

  const Storage = require('%PathToCoreWebclientModule%/js/Storage.js')
  Storage.convertStorageData(this.iUserId, AccountList)
}

CApp.prototype.showLastErrorOnLogin = function () {
  if (this.iUserRole === Enums.UserRole.Anonymous) {
    var iError = Types.pInt(UrlUtils.getRequestParam('error')),
      sErrorModule = Types.pString(UrlUtils.getRequestParam('module'))
    if (iError !== 0) {
      var Api = require('%PathToCoreWebclientModule%/js/Api.js')
      Api.showErrorByCode({ ErrorCode: iError, Module: sErrorModule }, '', true)
    }

    if (UserSettings.LastErrorCode === Enums.Errors.AuthError) {
      Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_AUTH_PROBLEM'), true)
    }
  }
}

/**
 * Makes user logout if there are no changes in current screen or popup or user chose to discard them.
 */
CApp.prototype.logout = function () {
  const continueLogout = () => {
    const eventParams = {
      logoutPromises: [],
    }
    App.broadcastEvent('Logout', eventParams)
    if (Array.isArray(eventParams.logoutPromises)) {
      Promise.all(eventParams.logoutPromises).then(
        () => {
          this.logoutAndGotoLogin()
        },
        () => {
          // logout was rejected by some module
        }
      )
    } else {
      this.logoutAndGotoLogin()
    }
  }
  if (Screens.hasUnsavedChanges() || Popups.hasUnsavedChanges()) {
    this.askDiscardChanges(continueLogout, null, Screens.getCurrentScreen())
  } else {
    continueLogout()
  }
}

/**
 * Makes user logout and relocate to login screen after that.
 */
CApp.prototype.logoutAndGotoLogin = function () {
  function gotoLoginPage() {
    if (Types.isNonEmptyString(UserSettings.CustomLogoutUrl)) {
      window.location.href = UserSettings.CustomLogoutUrl
    } else {
      UrlUtils.clearAndReloadLocation(Browser.ie8AndBelow, true)
    }
  }
  var Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js')

  Ajax.send(
    'Core',
    'Logout',
    {},
    function () {
      Routing.finalize()

      this.iUserRole = Enums.UserRole.Anonymous
      this.sUserName = ''
      this.sUserPublicId = ''
      this.iUserId = 0

      gotoLoginPage()
    },
    this
  )

  var oExcept = {
    Module: 'Core',
    Method: 'Logout',
  }
  Ajax.abortAndStopSendRequests(oExcept)
}

/**
 * Asks user if he prefer discard changes or stay on current screen/popup.
 * @param {function} fOnDiscard Function to execute if user prefer to discard changes.
 * @param {function} fOnNotDiscard Function to execute if user prefer to stay on current screen/popup.
 * @param {object} oCurrentScreen Current screen object.
 */
CApp.prototype.askDiscardChanges = function (fOnDiscard, fOnNotDiscard, oCurrentScreen) {
  var sConfirm = TextUtils.i18n('COREWEBCLIENT/CONFIRM_DISCARD_CHANGES'),
    fOnConfirm = _.bind(function (bOk) {
      if (bOk && _.isFunction(fOnDiscard)) {
        if (oCurrentScreen && _.isFunction(oCurrentScreen.discardChanges)) {
          oCurrentScreen.discardChanges()
        }
        fOnDiscard()
      } else if (_.isFunction(fOnNotDiscard)) {
        fOnNotDiscard()
      }
    }, this)
  Popups.showPopup(ConfirmPopup, [sConfirm, fOnConfirm])
}

CApp.prototype.tokenProblem = function () {
  var sReloadFunc = 'window.location.reload(); return false;',
    sHtmlError = TextUtils.i18n('%MODULENAME%/ERROR_TOKEN_PROBLEM_HTML', { RELOAD_FUNC: sReloadFunc })
  Screens.showError(sHtmlError, true)
}

CApp.prototype.checkMobile = function () {
  /**
   * UserSettings.IsMobile:
   *	-1 - first time, mobile is not determined
   *	0 - mobile is switched off
   *	1 - mobile is switched on
   */

  if (UserSettings.AllowMobile && UserSettings.IsMobile === -1) {
    var Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
      bMobile = !window.matchMedia('all and (min-width: 768px)').matches
    Ajax.send(
      'Core',
      'SetMobile',
      { Mobile: bMobile },
      function (oResponse) {
        if (bMobile && oResponse.Result) {
          window.location.reload()
        }
      },
      this
    )

    return bMobile
  }

  return false
}

CApp.prototype.useGoogleAnalytics = function () {
  var oGoogleAnalytics = null,
    oFirstScript = null
  if (UserSettings.GoogleAnalyticsAccount && 0 < UserSettings.GoogleAnalyticsAccount.length) {
    window._gaq = window._gaq || []
    window._gaq.push(['_setAccount', UserSettings.GoogleAnalyticsAccount])
    window._gaq.push(['_trackPageview'])

    oGoogleAnalytics = document.createElement('script')
    oGoogleAnalytics.type = 'text/javascript'
    oGoogleAnalytics.async = true
    oGoogleAnalytics.src =
      ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'
    oFirstScript = document.getElementsByTagName('script')[0]
    oFirstScript.parentNode.insertBefore(oGoogleAnalytics, oFirstScript)
  }
}

/**
 * @returns {Boolean}
 */
CApp.prototype.checkCookies = function () {
  $.cookie('checkCookie', '1')
  var bCookieWorks = $.cookie('checkCookie') === '1'
  $.removeCookie('checkCookie')

  if (!bCookieWorks) {
    Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_COOKIES_DISABLED'), true)
  } else {
    refreshOrGenerateAndSaveDeviceId()
  }

  return bCookieWorks
}

CApp.prototype.getCommonRequestParameters = function () {
  var oParameters = {
    TenantName: UserSettings.TenantName,
  }

  return oParameters
}

CApp.prototype.broadcastEvent = function (sEventName, oArguments) {
  if (_.isArray(this.aEventsCallbacks) && _.isArray(this.aEventsCallbacks[sEventName])) {
    _.each(this.aEventsCallbacks[sEventName], function (fCallback) {
      fCallback(oArguments)
    })
    return true
  }
  return false
}

CApp.prototype.subscribeEvent = function (sEventName, fCallback) {
  if (!_.isArray(this.aEventsCallbacks)) {
    this.aEventsCallbacks = []
  }

  if (!_.isArray(this.aEventsCallbacks[sEventName])) {
    this.aEventsCallbacks[sEventName] = []
  }

  this.aEventsCallbacks[sEventName].push(fCallback)
}

var App = new CApp()

module.exports = App
