import _ from 'lodash'

import typesUtils from 'src/utils/types'

import enums from './enums'

class StandardResetPassword {
  constructor(appData) {
    const standardResetPassword = typesUtils.pObject(appData.StandardResetPassword)
    if (!_.isEmpty(standardResetPassword)) {
      this.recoveryLinkLifetimeMinutes = typesUtils.pInt(standardResetPassword.RecoveryLinkLifetimeMinutes)
      this.notificationEmail = typesUtils.pString(standardResetPassword.NotificationEmail)
      this.notificationType = typesUtils.pString(standardResetPassword.NotificationType)
      this.notificationHost = typesUtils.pString(standardResetPassword.NotificationHost)
      this.notificationPort = typesUtils.pInt(standardResetPassword.NotificationPort)
      this.notificationSMTPSecure = typesUtils.pEnum(
        standardResetPassword.NotificationSMTPSecure,
        enums.SMTPSecure,
        enums.SMTPSecure.noSecure
      )
      this.notificationUseAuth = typesUtils.pBool(standardResetPassword.NotificationUseAuth)
      this.notificationLogin = typesUtils.pString(standardResetPassword.NotificationLogin)
      this.hasNotificationPassword = typesUtils.pBool(standardResetPassword.HasNotificationPassword)
    }
  }

  saveStandardResetPasswordSettings({
    notificationEmail,
    notificationType,
    notificationHost,
    notificationPort,
    notificationSMTPSecure,
    notificationUseAuth,
    notificationLogin,
    hasNotificationPassword,
    recoveryLinkLifetimeMinutes,
  }) {
    this.recoveryLinkLifetimeMinutes = recoveryLinkLifetimeMinutes
    this.notificationEmail = notificationEmail
    this.notificationType = notificationType

    if (notificationType === 'smtp') {
      this.notificationHost = notificationHost
      this.notificationPort = notificationPort
      this.notificationSMTPSecure = notificationSMTPSecure
      this.notificationUseAuth = notificationUseAuth
      this.notificationLogin = notificationLogin
      this.hasNotificationPassword = hasNotificationPassword
    }
  }
}

let settings = null

export default {
  init(appData) {
    settings = new StandardResetPassword(appData)
  },

  getStandardResetPasswordSettings() {
    return {
      notificationEmail: settings.notificationEmail,
      notificationType: settings.notificationType,
      notificationHost: settings.notificationHost,
      notificationPort: settings.notificationPort,
      notificationSMTPSecure: settings.notificationSMTPSecure,
      notificationUseAuth: settings.notificationUseAuth,
      notificationLogin: settings.notificationLogin,
      hasNotificationPassword: settings.hasNotificationPassword,
      recoveryLinkLifetimeMinutes: settings.recoveryLinkLifetimeMinutes,
    }
  },

  saveStandardResetPasswordSettings(appData) {
    settings.saveStandardResetPasswordSettings(appData)
  },
}
