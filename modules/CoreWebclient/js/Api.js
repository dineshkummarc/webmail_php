'use strict';

var
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	ModuleErrors = require('%PathToCoreWebclientModule%/js/ModuleErrors.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),
	
	Api = {}
;

/**
 * @param {Object} response
 * @param {string=} defaultErrorText = ''
 */
Api.getErrorByCode = function (response, defaultErrorText = '')
{
	var
		errorCode = response.ErrorCode,
		responseErrorMessage = TextUtils.encodeHtml(response.ErrorMessage || ''),
		errorText = ModuleErrors.getErrorMessage(response) || ''
	;

	if (errorText === '') {
		switch (errorCode) {
			default:
				errorText = defaultErrorText || TextUtils.i18n('%MODULENAME%/ERROR_UNKNOWN');
				break;
			case Enums.Errors.AuthError:
				errorText = TextUtils.i18n('%MODULENAME%/ERROR_PASS_INCORRECT');
				break;
			case Enums.Errors.DataBaseError:
				errorText = TextUtils.i18n('%MODULENAME%/ERROR_DATABASE');
				break;
			case Enums.Errors.LicenseProblem:
				errorText = TextUtils.i18n('%MODULENAME%/ERROR_INVALID_LICENSE');
				break;
			case Enums.Errors.LicenseLimit:
				errorText = TextUtils.i18n('%MODULENAME%/ERROR_LICENSE_USERS_LIMIT');
				break;
			case Enums.Errors.DemoLimitations:
				errorText = TextUtils.i18n('%MODULENAME%/INFO_DEMO_THIS_FEATURE_IS_DISABLED');
				break;
			case Enums.Errors.Captcha:
				errorText = TextUtils.i18n('%MODULENAME%/ERROR_CAPTCHA_IS_INCORRECT');
				break;
			case Enums.Errors.AccessDenied:
				if (response.AuthenticatedUserId === 0 && App.getUserId() !== 0) {
					errorText = TextUtils.i18n('%MODULENAME%/ERROR_USER_DELETED');
				} else {
					errorText = TextUtils.i18n('%MODULENAME%/ERROR_ACCESS_DENIED');
				}
				break;
			case Enums.Errors.UserAlreadyExists:
				errorText = TextUtils.i18n('%MODULENAME%/ERROR_USER_ALREADY_EXISTS');
				break;
			case Enums.Errors.CanNotChangePassword:
				errorText = TextUtils.i18n('%MODULENAME%/ERROR_UNABLE_CHANGE_PASSWORD');
				break;
			case Enums.Errors.AccountOldPasswordNotCorrect:
				errorText = TextUtils.i18n('%MODULENAME%/ERROR_CURRENT_PASSWORD_NOT_CORRECT');
				break;
			case Enums.Errors.AccountAlreadyExists:
				errorText = TextUtils.i18n('%MODULENAME%/ERROR_ACCOUNT_ALREADY_EXISTS');
				break;
			case Enums.Errors.HelpdeskUserNotExists:
				errorText = TextUtils.i18n('%MODULENAME%/ERROR_FORGOT_NO_HELPDESK_ACCOUNT');
				break;
			case Enums.Errors.DataTransferFailed:
				errorText = TextUtils.i18n('%MODULENAME%/ERROR_DATA_TRANSFER_FAILED');
				break;
			case Enums.Errors.NotDisplayedError:
				errorText = '';
				break;
			case Enums.Errors.SystemNotConfigured:
				errorText = TextUtils.i18n('%MODULENAME%/ERROR_SYSTEM_NOT_CONFIGURED');
				break;
		}
	}

	if (errorText !== '') {
		if (responseErrorMessage !== '') {
			errorText += ' (' + responseErrorMessage + ')';
		}
	} else if (responseErrorMessage !== '') {
		errorText = responseErrorMessage;
	}

	return errorText;
};

/**
 * @param {Object} response
 * @param {string=} defaultErrorText
 * @param {boolean=} disableAutohide = false
 */
Api.showErrorByCode = function (response, defaultErrorText = '', disableAutohide = false)
{
	var errorText = this.getErrorByCode(response, defaultErrorText);
	if (errorText !== '') {
		Screens.showError(errorText, disableAutohide);
	}
};

module.exports = Api;
