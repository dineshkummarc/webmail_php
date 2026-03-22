import { i18n } from 'src/boot/i18n'

import _ from 'lodash'

import textUtils from 'src/utils/text'
import typesUtils from 'src/utils/types'

const errorsCodes = {
  InvalidToken: 101,
  AuthError: 102,
  InvalidInputParameter: 103,
  DataBaseError: 104,
  LicenseProblem: 105,
  DemoLimitations: 106,
  Captcha: 107,
  AccessDenied: 108,
  UserAlreadyExists: 111,
  SystemNotConfigured: 112,
  ModuleNotFound: 113,
  MethodNotFound: 114,
  LicenseLimit: 115,
  MethodAccessDenied: 116,

  CanNotChangePassword: 502,
  AccountOldPasswordNotCorrect: 1020,
  AccountAlreadyExists: 704,
  IncorrectFileExtension: 811,
  CanNotUploadFileQuota: 812,
  FileAlreadyExists: 813,
  FileNotFound: 814,
  CanNotUploadFileLimit: 815,
  DataTransferFailed: 1100,
  NotDisplayedError: 1155,
}

const errorsUtils = {
  modulesErrors: null,

  setModulesErrors(appData) {
    this.modulesErrors = typesUtils.pObject(appData?.module_errors)
  },

  getTextFromResponse(response, defaultText) {
    let errorText = ''

    if (_.isObject(response)) {
      const errorCode = response.ErrorCode

      errorText = this._getModuleErrorByCode(response.Module, errorCode)

      if (!typesUtils.isNonEmptyString(errorText)) {
        errorText = this._getCoreErrorByCode(errorCode, defaultText)
      }

      if (typesUtils.isNonEmptyString(errorText)) {
        const responseError = textUtils.encodeHtml(response.ErrorMessage || '')
        if (typesUtils.isNonEmptyString(responseError)) {
          errorText += ' (' + responseError + ')'
        }

        errorText = this._addSubscriptionsErrors(response, errorText)

        errorText = this._insertValuesIntoPlaceholders(response, errorText)
      }
    }

    return errorText
  },

  _getModuleErrorByCode(moduleName, errorCode) {
    const isErrorFound =
      _.isString(moduleName) &&
      _.isSafeInteger(errorCode) &&
      this.modulesErrors !== null &&
      _.isObject(this.modulesErrors[moduleName]) &&
      _.isString(this.modulesErrors[moduleName][errorCode])

    if (isErrorFound) {
      return this.modulesErrors[moduleName][errorCode]
    }

    return false
  },

  _getCoreErrorByCode(errorCode, defaultText) {
    switch (errorCode) {
      case errorsCodes.AuthError:
        return i18n.global.tc('COREWEBCLIENT.ERROR_PASS_INCORRECT')
      case errorsCodes.DataBaseError:
        return i18n.global.tc('COREWEBCLIENT.ERROR_DATABASE')
      case errorsCodes.LicenseProblem:
        return i18n.global.tc('COREWEBCLIENT.ERROR_INVALID_LICENSE')
      case errorsCodes.LicenseLimit:
        return i18n.global.tc('COREWEBCLIENT.ERROR_LICENSE_USERS_LIMIT')
      case errorsCodes.DemoLimitations:
        return i18n.global.tc('COREWEBCLIENT.INFO_DEMO_THIS_FEATURE_IS_DISABLED')
      case errorsCodes.Captcha:
        return i18n.global.tc('COREWEBCLIENT.ERROR_CAPTCHA_IS_INCORRECT')
      case errorsCodes.AccessDenied:
        // if (response.AuthenticatedUserId === 0 && App.getUserId() !== 0) {
        //   return i18n.global.tc('COREWEBCLIENT.ERROR_USER_DELETED')
        // } else {
        return i18n.global.tc('COREWEBCLIENT.ERROR_ACCESS_DENIED')
      // }
      case errorsCodes.UserAlreadyExists:
        return i18n.global.tc('COREWEBCLIENT.ERROR_USER_ALREADY_EXISTS')
      case errorsCodes.CanNotChangePassword:
        return i18n.global.tc('COREWEBCLIENT.ERROR_UNABLE_CHANGE_PASSWORD')
      case errorsCodes.AccountOldPasswordNotCorrect:
        return i18n.global.tc('COREWEBCLIENT.ERROR_CURRENT_PASSWORD_NOT_CORRECT')
      case errorsCodes.AccountAlreadyExists:
        return i18n.global.tc('COREWEBCLIENT.ERROR_ACCOUNT_ALREADY_EXISTS')
      case errorsCodes.DataTransferFailed:
        return i18n.global.tc('COREWEBCLIENT.ERROR_DATA_TRANSFER_FAILED')
      case errorsCodes.NotDisplayedError:
        return ''
      case errorsCodes.SystemNotConfigured:
        return i18n.global.tc('COREWEBCLIENT.ERROR_SYSTEM_NOT_CONFIGURED')
      default:
        return defaultText || i18n.global.tc('COREWEBCLIENT.ERROR_UNKNOWN')
    }
  },

  _addSubscriptionsErrors(response, errorText) {
    if (_.isArray(response.SubscriptionsResult)) {
      for (const subscriptionIndex in response.SubscriptionsResult) {
        const subscriptionResult = response.SubscriptionsResult[subscriptionIndex]
        const subscriptionText = this._getModuleErrorByCode(
          subscriptionResult?.Error?.ModuleName,
          subscriptionResult?.Code?.Error
        )

        if (subscriptionText) {
          if (subscriptionResult?.Error?.Override || !errorText) {
            errorText = subscriptionText
          } else {
            errorText += '<br />' + subscriptionText
          }
        }
      }
    }
    return errorText
  },

  _insertValuesIntoPlaceholders(response, errorText) {
    if (typesUtils.isNonEmptyString(errorText)) {
      const medResult = errorText.replace(/[^%]*%(\w+)%[^%]*/g, function (match, found, index, str) {
        if (typesUtils.isNonEmptyString(response[found])) {
          return match.replace('%' + found + '%', response[found])
        }
        return match
      })
      if (typesUtils.isNonEmptyString(medResult)) {
        errorText = medResult
      }
    }
    return errorText
  },
}

export default {
  init(appData) {
    errorsUtils.setModulesErrors(appData)
  },

  getSilentErrorCode() {
    return errorsCodes.NotDisplayedError
  },

  getTextFromResponse(response, defaultText) {
    return errorsUtils.getTextFromResponse(response, defaultText)
  },

  isAuthError(errorCode) {
    // return errorCode === errorsCodes.AuthError || errorCode === errorsCodes.AccessDenied
    return errorCode === errorsCodes.AuthError
  },

  isSystemError(errorCode) {
    return errorCode === errorsCodes.ModuleNotFound || errorCode === errorsCodes.MethodNotFound
  },
}
