(self["webpackChunkafterlogic_aurora_platform"] = self["webpackChunkafterlogic_aurora_platform"] || []).push([[12],{

/***/ "1+/O":
/*!****************************************************!*\
  !*** ./modules/CoreWebclient/js/utils/Calendar.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  moment = __webpack_require__(/*! moment */ "sdEb"),
  CalendarUtils = {};

/**
 * Generates a list of time to display in calendar settings.
 * 
 * @param {string} sLabelFormat
 * @param {string} sValueFormat
 * @returns {Array}
 */
CalendarUtils.getTimeListStepHour = function (sLabelFormat, sValueFormat) {
  var aTimeList = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
    sLabelFormat = sLabelFormat || 'HH:mm';
  sValueFormat = sValueFormat || 'k';
  return _.map(aTimeList, function (sTime) {
    var oMoment = moment(sTime, 'HH:mm'),
      sText = oMoment.format(sLabelFormat),
      sValue = oMoment.format(sValueFormat);
    return {
      text: sText,
      value: sValue
    };
  });
};

/**
 * Generates a list of time to display in create/edit event popup.
 * 
 * @param {string} sTimeFormatMoment
 * @returns {Array}
 */
CalendarUtils.getTimeListStepHalfHour = function (sTimeFormatMoment) {
  var aTimeList = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
  return _.map(aTimeList, function (sTime) {
    var oMoment = moment(sTime, 'HH:mm'),
      sText = oMoment.format(sTimeFormatMoment);
    return {
      text: sText,
      value: sText
    };
  });
};

/**
 * @param {string} dateFormat
 * 
 * @return string
 */
CalendarUtils.getDateFormatForDatePicker = function (dateFormat) {
  //'MM/DD/YYYY' -> 'mm/dd/yy'
  //'DD/MM/YYYY' -> 'dd/mm/yy'
  //'DD Month YYYY' -> 'dd MM yy'
  return dateFormat.replace('MM', 'mm').replace('DD', 'dd').replace('YYYY', 'yy').replace('Month', 'MM');
};
module.exports = CalendarUtils;

/***/ }),

/***/ "2wN8":
/*!***************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/DefaultAccountHostsSettingsView.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var ko = __webpack_require__(/*! knockout */ "p09A"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "KIwC"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m");
;

/**
 * @constructor
 */
function CDefaultAccountHostsSettingsView() {
  this.defaultAccount = AccountList.getDefault();
  this.visible = ko.observable(!!this.defaultAccount && this.defaultAccount.oServer.bSetExternalAccessServers);
  this.externalAccessImapServer = ko.observable(this.visible() ? this.defaultAccount.oServer.sExternalAccessImapServer : '');
  this.externalAccessImapPort = ko.observable(this.visible() ? this.defaultAccount.oServer.iExternalAccessImapPort : 143);
  this.externalAccessImapAlterPort = ko.observable(this.visible() && this.defaultAccount.oServer.iExternalAccessImapAlterPort > 0 ? this.defaultAccount.oServer.iExternalAccessImapAlterPort : '');
  this.externalAccessImapUseSsl = ko.observable(this.visible() ? this.defaultAccount.oServer.bExternalAccessImapUseSsl : false);
  this.externalAccessPop3Server = ko.observable(this.visible() ? this.defaultAccount.oServer.sExternalAccessPop3Server : '');
  this.externalAccessPop3Port = ko.observable(this.visible() ? this.defaultAccount.oServer.iExternalAccessPop3Port : 110);
  this.externalAccessPop3AlterPort = ko.observable(this.visible() && this.defaultAccount.oServer.iExternalAccessPop3AlterPort > 0 ? this.defaultAccount.oServer.iExternalAccessPop3AlterPort : '');
  this.externalAccessPop3UseSsl = ko.observable(this.visible() ? this.defaultAccount.oServer.bExternalAccessImapUseSsl : false);
  this.externalAccessSmtpServer = ko.observable(this.visible() ? this.defaultAccount.oServer.sExternalAccessSmtpServer : '');
  this.externalAccessSmtpPort = ko.observable(this.visible() ? this.defaultAccount.oServer.iExternalAccessSmtpPort : 25);
  this.externalAccessSmtpAlterPort = ko.observable(this.visible() && this.defaultAccount.oServer.iExternalAccessSmtpAlterPort > 0 ? this.defaultAccount.oServer.iExternalAccessSmtpAlterPort : '');
  this.externalAccessSmtpUseSsl = ko.observable(this.visible() ? this.defaultAccount.oServer.bExternalAccessSmtpUseSsl : false);
  this.credentialsHintText = App.mobileCredentialsHintText;
  this.bDemo = UserSettings.IsDemo;
}
CDefaultAccountHostsSettingsView.prototype.ViewTemplate = 'MailWebclient_DefaultAccountHostsSettingsView';
module.exports = new CDefaultAccountHostsSettingsView();

/***/ }),

/***/ "5RIG":
/*!******************************************************!*\
  !*** ./modules/CoreWebclient/js/utils/Validation.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  ValidationUtils = {};
ValidationUtils.checkIfFieldsEmpty = function (aRequiredFields, sErrorText) {
  var koFirstEmptyField = _.find(aRequiredFields, function (koField) {
    return koField() === '';
  });
  if (koFirstEmptyField) {
    if (sErrorText) {
      Screens.showError(sErrorText);
    }
    koFirstEmptyField.focused(true);
    return false;
  }
  return true;
};
ValidationUtils.checkPassword = function (sNewPass, sConfirmPassword) {
  var TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
    Settings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "KIwC"),
    bPasswordValid = false;
  if (sConfirmPassword !== sNewPass) {
    Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORDS_DO_NOT_MATCH'));
  } else if (Settings.PasswordMinLength > 0 && sNewPass.length < Settings.PasswordMinLength) {
    Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORD_TOO_SHORT').replace('%N%', Settings.PasswordMinLength));
  } else if (Settings.PasswordMustBeComplex && (!sNewPass.match(/([0-9])/) || !sNewPass.match(/([!,%,&,@,#,$,^,*,?,_,~])/))) {
    Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORD_TOO_SIMPLE'));
  } else {
    bPasswordValid = true;
  }
  return bPasswordValid;
};
module.exports = ValidationUtils;

/***/ }),

/***/ "5qUT":
/*!*******************************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/settings/AccountAllowBlockListsSettingsFormView.js ***!
  \*******************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ");

/**
 * @constructor
 */
function CAccountAllowBlockListsSettingsFormView() {
  CAbstractSettingsFormView.call(this, 'MailWebclient');
  this.spamScore = ko.observable('');
  this.allowList = ko.observable('');
  this.blockList = ko.observable('');
}
_.extendOwn(CAccountAllowBlockListsSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CAccountAllowBlockListsSettingsFormView.prototype.ViewTemplate = 'MailWebclient_Settings_AccountAllowBlockListsSettingsFormView';
CAccountAllowBlockListsSettingsFormView.prototype.getCurrentValues = function () {
  return [this.spamScore(), this.allowList(), this.blockList()];
};
CAccountAllowBlockListsSettingsFormView.prototype.onShow = function () {
  this.populate();
};
CAccountAllowBlockListsSettingsFormView.prototype.getParametersForSave = function () {
  return {
    'AccountID': AccountList.editedId(),
    'SpamScore': Types.pInt(this.spamScore()),
    'AllowList': this.allowList() !== '' ? this.allowList().split('\n') : [],
    'BlockList': this.blockList() !== '' ? this.blockList().split('\n') : []
  };
};
CAccountAllowBlockListsSettingsFormView.prototype.save = function () {
  this.isSaving(true);
  this.updateSavedState();
  Ajax.send('SetAccountSpamSettings', this.getParametersForSave(), this.onResponse, this);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CAccountAllowBlockListsSettingsFormView.prototype.onResponse = function (oResponse, oRequest) {
  this.isSaving(false);
  if (oResponse.Result === false) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_SAVING_SETTINGS_FAILED'));
  } else {
    Screens.showReport(TextUtils.i18n('COREWEBCLIENT/REPORT_SETTINGS_UPDATE_SUCCESS'));
  }
};
CAccountAllowBlockListsSettingsFormView.prototype.populate = function () {
  var oAccount = AccountList.getEdited();
  if (oAccount) {
    Ajax.send('GetAccountSpamSettings', {
      'AccountID': oAccount.id()
    }, this.onGetAllowBlockListsResponse, this);
  }
  this.updateSavedState();
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CAccountAllowBlockListsSettingsFormView.prototype.onGetAllowBlockListsResponse = function (oResponse, oRequest) {
  var oResult = oResponse && oResponse.Result;
  if (oResult) {
    var iSpamScore = Types.pInt(oResult.SpamScore),
      aAllowList = Types.pArray(oResult.AllowList),
      aBlockList = Types.pArray(oResult.BlockList);
    this.spamScore(iSpamScore);
    this.allowList(aAllowList.join('\n'));
    this.blockList(aBlockList.join('\n'));
    this.updateSavedState();
  }
};
module.exports = new CAccountAllowBlockListsSettingsFormView();

/***/ }),

/***/ "6jKE":
/*!*****************************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/settings/AccountAutoresponderSettingsFormView.js ***!
  \*****************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "M4cL");


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  moment = __webpack_require__(/*! moment */ "sdEb"),
  DateUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Date.js */ "jFqX"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  CalendarUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Calendar.js */ "1+/O"),
  CommonUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "KIwC"),
  CAutoresponderModel = __webpack_require__(/*! modules/MailWebclient/js/models/CAutoresponderModel.js */ "MIfO");
__webpack_require__(/*! jquery-ui/ui/widgets/datepicker */ "okSt");

/**
 * @constructor
 */
function CAccountAutoresponderSettingsFormView() {
  CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
  this.enable = ko.observable(false);
  this.subject = ko.observable('');
  this.message = ko.observable('');
  this.scheduled = ko.observable(false);
  this.dateFormatMoment = ko.computed(function () {
    return CommonUtils.getDateFormatForMoment(UserSettings.dateFormat());
  }, this);
  this.startDateDom = ko.observable(null);
  this.startTimestamp = ko.observable(null);
  this.endDateDom = ko.observable(null);
  this.endTimestamp = ko.observable(null);
  this.startTimestamp.subscribe(function (v) {
    var momentStart = moment.unix(v);
    this.startDateDom().datepicker('setDate', momentStart.format(this.dateFormatMoment()));
    var momentEnd = this.endTimestamp() ? moment.unix(this.endTimestamp()) : moment();
    if (momentStart.diff(momentEnd, 'days') >= 0 && this.endDateDom()) {
      var newMomentEnd = momentStart.add(6, 'days');
      this.endTimestamp(newMomentEnd.unix());
    }
  }, this);
  this.endTimestamp.subscribe(function (v) {
    var momentEnd = moment.unix(v);
    this.endDateDom().datepicker('setDate', momentEnd.format(this.dateFormatMoment()));
    var momentStart = this.startTimestamp() ? moment.unix(this.startTimestamp()) : moment();
    if (momentStart.diff(momentEnd, 'days') >= 0 && this.startDateDom()) {
      var newMomentStart = momentEnd.subtract(6, 'days');
      this.startTimestamp(newMomentStart.unix());
    }
  }, this);
  AccountList.editedId.subscribe(function () {
    if (this.bShown) {
      this.populate();
    }
  }, this);
  this.startDateDom.subscribe(function (v) {
    if (!this.startTimestamp()) {
      this.startTimestamp(moment().unix());
    }
    this.createDatePickerObject(v, this.startTimestamp);
  }, this);
  this.endDateDom.subscribe(function (v) {
    if (!this.endTimestamp()) {
      this.endTimestamp(moment().add(6, 'days').unix());
    }
    this.createDatePickerObject(v, this.endTimestamp);
  }, this);
  this.allowScheduledAutoresponder = Settings.AllowScheduledAutoresponder;
}
_.extendOwn(CAccountAutoresponderSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CAccountAutoresponderSettingsFormView.prototype.ViewTemplate = 'MailWebclient_Settings_AccountAutoresponderSettingsFormView';
CAccountAutoresponderSettingsFormView.prototype.getCurrentValues = function () {
  return [this.enable(), this.subject(), this.message(), this.scheduled(), this.startTimestamp(), this.endTimestamp()];
};
CAccountAutoresponderSettingsFormView.prototype.onShow = function () {
  this.populate();
};
CAccountAutoresponderSettingsFormView.prototype.revert = function () {
  this.populate();
};
CAccountAutoresponderSettingsFormView.prototype.getParametersForSave = function () {
  var oParams = {
    'AccountID': AccountList.editedId(),
    'Enable': this.enable(),
    'Subject': this.subject(),
    'Message': this.message(),
    'Scheduled': this.scheduled()
  };
  if (this.scheduled()) {
    oParams['Start'] = this.startTimestamp();
    oParams['End'] = this.endTimestamp();
  }
  return oParams;
};
CAccountAutoresponderSettingsFormView.prototype.applySavedValues = function (oParameters) {
  var oAccount = AccountList.getEdited(),
    oAutoresponder = oAccount.autoresponder();
  if (oAutoresponder) {
    oAutoresponder.enable = oParameters.Enable;
    oAutoresponder.subject = oParameters.Subject;
    oAutoresponder.message = oParameters.Message;
    oAutoresponder.scheduled = oParameters.Scheduled;
    oAutoresponder.start = oParameters.Start;
    oAutoresponder.end = oParameters.End;
  }
};
CAccountAutoresponderSettingsFormView.prototype.save = function () {
  this.isSaving(true);
  this.updateSavedState();
  Ajax.send('UpdateAutoresponder', this.getParametersForSave(), this.onResponse, this);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CAccountAutoresponderSettingsFormView.prototype.onResponse = function (oResponse, oRequest) {
  this.isSaving(false);
  if (oResponse.Result === false) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_SAVING_SETTINGS_FAILED'));
  } else {
    var oParameters = oRequest.Parameters;
    this.applySavedValues(oParameters);
    Screens.showReport(TextUtils.i18n('MAILWEBCLIENT/REPORT_AUTORESPONDER_UPDATE_SUCCESS'));
  }
};
CAccountAutoresponderSettingsFormView.prototype.populate = function () {
  var oAccount = AccountList.getEdited();
  if (oAccount) {
    var oAutoresponder = oAccount.autoresponder();
    if (oAutoresponder !== null) {
      this.enable(oAutoresponder.enable);
      this.subject(oAutoresponder.subject);
      this.message(oAutoresponder.message);
      this.scheduled(oAutoresponder.scheduled);
      if (oAutoresponder.start !== null) {
        this.startTimestamp(oAutoresponder.start);
      }
      if (oAutoresponder.end !== null) {
        this.endTimestamp(oAutoresponder.end);
      }
    } else {
      Ajax.send('GetAutoresponder', {
        'AccountID': oAccount.id()
      }, this.onGetAutoresponderResponse, this);
    }
  }
  this.updateSavedState();
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CAccountAutoresponderSettingsFormView.prototype.onGetAutoresponderResponse = function (oResponse, oRequest) {
  if (oResponse && oResponse.Result) {
    var oParameters = oRequest.Parameters,
      iAccountId = Types.pInt(oParameters.AccountID),
      oAccount = AccountList.getAccount(iAccountId),
      oAutoresponder = new CAutoresponderModel();
    if (oAccount) {
      oAutoresponder.parse(iAccountId, oResponse.Result);
      oAccount.autoresponder(oAutoresponder);
      if (iAccountId === AccountList.editedId()) {
        this.populate();
      }
    }
  }
};
CAccountAutoresponderSettingsFormView.prototype.createDatePickerObject = function (oElement, value) {
  var _this = this;
  $(oElement).datepicker({
    showOtherMonths: true,
    selectOtherMonths: true,
    monthNames: DateUtils.getMonthNamesArray(),
    dayNamesMin: TextUtils.i18n('COREWEBCLIENT/LIST_DAY_NAMES_MIN').split(' '),
    nextText: '',
    prevText: '',
    firstDay: Types.pInt(ModulesManager.run('CalendarWebclient', 'getWeekStartsOn')),
    showOn: 'focus',
    dateFormat: CalendarUtils.getDateFormatForDatePicker(UserSettings.dateFormat()),
    onClose: function onClose(sValue) {
      if (ko.isObservable(value)) {
        value(moment(sValue, _this.dateFormatMoment()).unix());
      }
    }
  });
  $(oElement).datepicker('setDate', moment.unix(value()).format(this.dateFormatMoment()));
  $(oElement).on('mousedown', function () {
    $('#ui-datepicker-div').toggle();
  });
};
module.exports = new CAccountAutoresponderSettingsFormView();

/***/ }),

/***/ "8xco":
/*!*************************************************************!*\
  !*** ./modules/MailWebclient/js/popups/CreateAliasPopup.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  CoreAjax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh");

/**
 * @constructor
 */
function CreateAliasPopup() {
  CAbstractPopup.call(this);
  this.iAccountId = 0;
  this.aliasName = ko.observable('');
  this.loading = ko.observable(false);
  this.selectedDomain = ko.observable(null);
  this.domainList = ko.observableArray([]);
}
_.extendOwn(CreateAliasPopup.prototype, CAbstractPopup.prototype);
CreateAliasPopup.prototype.PopupTemplate = 'MailWebclient_Settings_CreateAliasPopup';

/**
 * @param {number} iAccountId
 */
CreateAliasPopup.prototype.onOpen = function (iAccountId) {
  this.iAccountId = iAccountId;
  this.getDomainList();
};
CreateAliasPopup.prototype.onClose = function () {
  this.aliasName('');
};
CreateAliasPopup.prototype.save = function () {
  if (this.aliasName() === '') {
    Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_REQUIRED_FIELDS_EMPTY'));
  } else {
    var oParameters = {
      'AliasName': this.aliasName(),
      'AliasDomain': this.selectedDomain()
    };
    this.loading(true);
    CoreAjax.send(Settings.AliasesServerModuleName, 'AddNewAlias', oParameters, this.onCreateAliasResponse, this);
  }
};
CreateAliasPopup.prototype.getDomainList = function () {
  var iServerId = AccountList.getCurrent().serverId(),
    iTenantId = _.isFunction(App.getTenantId) ? App.getTenantId() : 0;
  Ajax.send('GetServerDomains', {
    ServerId: iServerId,
    TenantId: iTenantId
  }, this.onGetDomainListResponse, this);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CreateAliasPopup.prototype.onGetDomainListResponse = function (oResponse, oRequest) {
  if (oResponse.Result) {
    this.domainList(oResponse.Result);
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CreateAliasPopup.prototype.onCreateAliasResponse = function (oResponse, oRequest) {
  this.loading(false);
  if (oResponse.Result) {
    AccountList.populateAliases(function () {
      var oCurrAccount = AccountList.getCurrent(),
        aCurrAliases = oCurrAccount.aliases(),
        oCreatedAlias = _.find(aCurrAliases, function (oAlias) {
          return oAlias.id() === oResponse.Result;
        });
      if (oCreatedAlias) {
        ModulesManager.run('SettingsWebclient', 'setAddHash', [['alias', oCreatedAlias.hash()]]);
      }
    });
    this.closePopup();
  } else {
    Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_UNKNOWN'));
  }
};
module.exports = new CreateAliasPopup();

/***/ }),

/***/ "9lZ8":
/*!*****************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/settings/AccountsSettingsPaneView.js ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "ioSH"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  CreateAccountShortFormPopup = __webpack_require__(/*! modules/MailWebclient/js/popups/CreateAccountShortFormPopup.js */ "qpcR"),
  CreateIdentityPopup = __webpack_require__(/*! modules/MailWebclient/js/popups/CreateIdentityPopup.js */ "ZYTm"),
  CreateFetcherPopup = __webpack_require__(/*! modules/MailWebclient/js/popups/CreateFetcherPopup.js */ "AY4M"),
  CreateAliasPopup = __webpack_require__(/*! modules/MailWebclient/js/popups/CreateAliasPopup.js */ "8xco"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  CServerModel = __webpack_require__(/*! modules/MailWebclient/js/models/CServerModel.js */ "UVn1"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  AccountAutoresponderSettingsFormView = __webpack_require__(/*! modules/MailWebclient/js/views/settings/AccountAutoresponderSettingsFormView.js */ "6jKE"),
  AccountAllowBlockListsSettingsFormView = __webpack_require__(/*! modules/MailWebclient/js/views/settings/AccountAllowBlockListsSettingsFormView.js */ "5qUT"),
  AccountFiltersSettingsFormView = __webpack_require__(/*! modules/MailWebclient/js/views/settings/AccountFiltersSettingsFormView.js */ "r79L"),
  AccountFoldersPaneView = __webpack_require__(/*! modules/MailWebclient/js/views/settings/AccountFoldersPaneView.js */ "ELk6"),
  AccountForwardSettingsFormView = __webpack_require__(/*! modules/MailWebclient/js/views/settings/AccountForwardSettingsFormView.js */ "Dq0Z"),
  AccountSettingsFormView = __webpack_require__(/*! modules/MailWebclient/js/views/settings/AccountSettingsFormView.js */ "NMTm"),
  AccountUnifiedMailboxFormView = __webpack_require__(/*! modules/MailWebclient/js/views/settings/AccountUnifiedMailboxFormView.js */ "F9TS"),
  CIdentitySettingsFormView = __webpack_require__(/*! modules/MailWebclient/js/views/settings/CIdentitySettingsFormView.js */ "l21M"),
  CFetcherIncomingSettingsFormView = __webpack_require__(/*! modules/MailWebclient/js/views/settings/CFetcherIncomingSettingsFormView.js */ "jSiL"),
  CAliasSettingsFormView = __webpack_require__(/*! modules/MailWebclient/js/views/settings/CAliasSettingsFormView.js */ "SRQT"),
  FetcherOutgoingSettingsFormView = __webpack_require__(/*! modules/MailWebclient/js/views/settings/FetcherOutgoingSettingsFormView.js */ "wvqg"),
  SignatureSettingsFormView = __webpack_require__(/*! modules/MailWebclient/js/views/settings/SignatureSettingsFormView.js */ "bOgC");

/**
 * @constructor
 */
function CAccountsSettingsPaneView() {
  this.bAllowAddAccounts = Settings.AllowAddAccounts;
  this.bAllowMultiAccounts = Settings.AllowMultiAccounts;
  this.bAllowIdentities = !!Settings.AllowIdentities;
  this.bAllowFetchers = !!Settings.AllowFetchers;
  this.bAllowAliases = !!Settings.AllowAliases;
  this.accounts = AccountList.collection;
  this.editedAccountId = AccountList.editedId;
  this.editedFetcher = ko.observable(null);
  this.editedFetcherId = ko.computed(function () {
    return this.editedFetcher() ? this.editedFetcher().id() : null;
  }, this);
  this.editedIdentity = ko.observable(null);
  this.editedIdentityHash = ko.computed(function () {
    return this.editedIdentity() ? this.editedIdentity().hash() : null;
  }, this);
  this.editedAlias = ko.observable(null);
  this.editedAliasId = ko.computed(function () {
    return this.editedAlias() ? this.editedAlias().id() : null;
  }, this);
  this.allowFolders = ko.observable(false);
  this.allowForward = ko.observable(false);
  this.allowAutoresponder = ko.observable(false);
  this.allowFilters = ko.observable(false);
  this.allowSignature = ko.observable(false);
  this.visibleAllowBlockLists = ko.observable(false);
  this.aAccountTabs = [{
    name: 'properties',
    title: TextUtils.i18n('MAILWEBCLIENT/LABEL_PROPERTIES_TAB'),
    view: AccountSettingsFormView,
    visible: AccountSettingsFormView.visibleTab
  }, {
    name: 'unified',
    title: TextUtils.i18n('MAILWEBCLIENT/LABEL_UNIFIED_MAILBOX_TAB'),
    view: AccountUnifiedMailboxFormView,
    visible: AccountUnifiedMailboxFormView.visibleTab
  }, {
    name: 'folders',
    title: TextUtils.i18n('MAILWEBCLIENT/LABEL_MANAGE_FOLDERS_TAB'),
    view: AccountFoldersPaneView,
    visible: this.allowFolders
  }, {
    name: 'forward',
    title: TextUtils.i18n('MAILWEBCLIENT/LABEL_FORWARD_TAB'),
    view: AccountForwardSettingsFormView,
    visible: this.allowForward
  }, {
    name: 'autoresponder',
    title: TextUtils.i18n('MAILWEBCLIENT/LABEL_AUTORESPONDER_TAB'),
    view: AccountAutoresponderSettingsFormView,
    visible: this.allowAutoresponder
  }, {
    name: 'filters',
    title: TextUtils.i18n('MAILWEBCLIENT/LABEL_FILTERS_TAB'),
    view: AccountFiltersSettingsFormView,
    visible: this.allowFilters
  }, {
    name: 'signature',
    title: TextUtils.i18n('MAILWEBCLIENT/LABEL_SIGNATURE_TAB'),
    view: SignatureSettingsFormView,
    visible: this.allowSignature
  }, {
    name: 'allow-block-lists',
    title: TextUtils.i18n('MAILWEBCLIENT/LABEL_ACCOUNT_SPAM_TAB'),
    view: AccountAllowBlockListsSettingsFormView,
    visible: this.visibleAllowBlockLists
  }];
  this.aIdentityTabs = [{
    name: 'properties',
    title: TextUtils.i18n('MAILWEBCLIENT/LABEL_PROPERTIES_TAB'),
    view: new CIdentitySettingsFormView(this),
    visible: ko.observable(true)
  }, {
    name: 'signature',
    title: TextUtils.i18n('MAILWEBCLIENT/LABEL_SIGNATURE_TAB'),
    view: SignatureSettingsFormView,
    visible: ko.observable(true)
  }];
  this.aFetcherTabs = [{
    name: 'incoming',
    title: TextUtils.i18n('MAILWEBCLIENT/LABEL_POP3_SETTINGS_TAB'),
    view: new CFetcherIncomingSettingsFormView(this),
    visible: ko.observable(true)
  }, {
    name: 'outgoing',
    title: TextUtils.i18n('MAILWEBCLIENT/LABEL_SMTP_SETTINGS_TAB'),
    view: FetcherOutgoingSettingsFormView,
    visible: ko.observable(true)
  }, {
    name: 'signature',
    title: TextUtils.i18n('MAILWEBCLIENT/LABEL_SIGNATURE_TAB'),
    view: SignatureSettingsFormView,
    visible: ko.observable(true)
  }];
  this.aAliasTabs = [{
    name: 'properties',
    title: TextUtils.i18n('MAILWEBCLIENT/LABEL_PROPERTIES_TAB'),
    view: new CAliasSettingsFormView(this, this.bAllowAliases),
    visible: ko.observable(true)
  }, {
    name: 'signature',
    title: TextUtils.i18n('MAILWEBCLIENT/LABEL_SIGNATURE_TAB'),
    view: SignatureSettingsFormView,
    visible: ko.observable(true)
  }];
  this.currentTab = ko.observable(null);
  this.tabs = ko.computed(function () {
    if (this.editedIdentity()) {
      return this.aIdentityTabs;
    }
    if (this.editedFetcher()) {
      return this.aFetcherTabs;
    }
    if (this.editedAlias()) {
      return this.aAliasTabs;
    }
    return this.aAccountTabs;
  }, this);
  AccountList.editedId.subscribe(function () {
    this.populate();
  }, this);
  App.broadcastEvent('MailWebclient::ConstructView::after', {
    Name: this.ViewConstructorName,
    View: this
  });
}
CAccountsSettingsPaneView.prototype.ViewTemplate = 'MailWebclient_Settings_AccountsSettingsPaneView';
CAccountsSettingsPaneView.prototype.ViewConstructorName = 'CAccountsSettingsPaneView';

/**
 * Checks if there are changes in accounts settings pane.
 * @returns {Boolean}
 */
CAccountsSettingsPaneView.prototype.hasUnsavedChanges = function () {
  var oCurrentTab = this.currentTab();
  return oCurrentTab && oCurrentTab.view && _.isFunction(oCurrentTab.view.hasUnsavedChanges) && oCurrentTab.view.hasUnsavedChanges();
};

/**
 * Reverts all changes in accounts settings pane.
 */
CAccountsSettingsPaneView.prototype.revert = function () {
  var oCurrentTab = this.currentTab();
  if (oCurrentTab && oCurrentTab.view && _.isFunction(oCurrentTab.view.revert)) {
    oCurrentTab.view.revert();
  }
};

/**
 * @param {Function} fAfterHideHandler
 * @param {Function} fRevertRouting
 */
CAccountsSettingsPaneView.prototype.hide = function (fAfterHideHandler, fRevertRouting) {
  if (this.currentTab() && _.isFunction(this.currentTab().view.hide)) {
    this.currentTab().view.hide(fAfterHideHandler, fRevertRouting);
  } else {
    fAfterHideHandler();
  }
};

/**
 * @param {Array} aParams
 */
CAccountsSettingsPaneView.prototype.showTab = function (aParams) {
  var sType = aParams.length > 0 ? aParams[0] : 'account',
    oEditedAccount = AccountList.getEdited(),
    sHash = aParams.length > 1 ? aParams[1] : oEditedAccount ? oEditedAccount.hash() : '',
    sTab = aParams.length > 2 ? aParams[2] : '';
  this.editedIdentity(sType === 'identity' ? AccountList.getIdentityByHash(sHash) || null : null);
  this.editedFetcher(sType === 'fetcher' ? AccountList.getFetcherByHash(sHash) || null : null);
  this.editedAlias(sType === 'alias' ? AccountList.getAliasByHash(sHash) || null : null);
  if (sType === 'account') {
    if (aParams[1] === 'create' && !AccountList.hasAccount()) {
      this.addAccount();
      Screens.showError(TextUtils.i18n('MAILWEBCLIENT/INFO_SPECIFY_CREDENTIALS'));
      Routing.replaceHashDirectly(['settings', 'mail-accounts']);
    } else if (sHash !== '') {
      if (oEditedAccount && oEditedAccount.hash() === sHash) {
        this.populate();
      } else {
        if (_.find(AccountList.collection(), function (oAccount) {
          return oAccount.hash() === sHash;
        })) {
          AccountList.changeEditedAccountByHash(sHash);
        } else {
          Routing.replaceHash(['settings', 'mail-accounts']);
        }
      }
    }
  }
  this.changeTab(sTab || this.getAutoselectedTab().name);
};
CAccountsSettingsPaneView.prototype.getAutoselectedTab = function () {
  var oCurrentTab = _.find(this.tabs(), function (oTab) {
    return oTab.visible();
  });
  if (!oCurrentTab) {
    oCurrentTab = this.tabs()[0];
  }
  return oCurrentTab;
};
CAccountsSettingsPaneView.prototype.addAccount = function () {
  var iTenantId = _.isFunction(App.getTenantId) ? App.getTenantId() : null;
  if (iTenantId !== null) {
    Ajax.send('GetServers', {
      'TenantId': iTenantId
    }, function (oResponse) {
      var aOAuthOptions = [];
      if (_.isArray(oResponse && oResponse.Result && oResponse.Result.Items)) {
        _.each(oResponse.Result.Items, function (oServerData) {
          var oServer = new CServerModel(oServerData);
          if (oServer.bOauthEnable) {
            aOAuthOptions.push({
              'Name': oServer.sOauthName,
              'Type': oServer.sOauthType,
              'IconUrl': oServer.sOauthIconUrl
            });
          }
        });
        if (aOAuthOptions.length > 0) {
          aOAuthOptions.push({
            'Name': 'Other',
            'Type': '',
            'IconUrl': 'static/styles/images/modules/MailWebclient/logo_other.png'
          });
        }
      }
      this.openCreateAccountShortFormPopup(aOAuthOptions);
    }, this);
  } else {
    this.openCreateAccountShortFormPopup([]);
  }
};
CAccountsSettingsPaneView.prototype.openCreateAccountShortFormPopup = function (aOAuthOptions) {
  Popups.showPopup(CreateAccountShortFormPopup, [aOAuthOptions, _.bind(function (iAccountId) {
    var oAccount = AccountList.getAccount(iAccountId);
    if (oAccount) {
      this.editAccount(oAccount.hash());
    }
  }, this)]);
};

/**
 * @param {string} sHash
 */
CAccountsSettingsPaneView.prototype.editAccount = function (sHash) {
  ModulesManager.run('SettingsWebclient', 'setAddHash', [['account', sHash]]);
};

/**
 * @param {number} iAccountId
 * @param {Object} oEv
 */
CAccountsSettingsPaneView.prototype.addIdentity = function (iAccountId, oEv) {
  oEv.stopPropagation();
  Popups.showPopup(CreateIdentityPopup, [iAccountId]);
};

/**
 * @param {string} sHash
 */
CAccountsSettingsPaneView.prototype.editIdentity = function (sHash) {
  ModulesManager.run('SettingsWebclient', 'setAddHash', [['identity', sHash]]);
};

/**
 * @param {number} iAccountId
 * @param {Object} oEv
 */
CAccountsSettingsPaneView.prototype.addFetcher = function (iAccountId, oEv) {
  oEv.stopPropagation();
  Popups.showPopup(CreateFetcherPopup, [iAccountId]);
};

/**
 * @param {string} sHash
 */
CAccountsSettingsPaneView.prototype.editFetcher = function (sHash) {
  ModulesManager.run('SettingsWebclient', 'setAddHash', [['fetcher', sHash]]);
};

/**
 * @param {number} iAccountId
 * @param {Object} oEv
 */
CAccountsSettingsPaneView.prototype.addAlias = function (iAccountId, oEv) {
  oEv.stopPropagation();
  Popups.showPopup(CreateAliasPopup, [iAccountId]);
};

/**
 * @param {string} sHash
 */
CAccountsSettingsPaneView.prototype.editAlias = function (sHash) {
  ModulesManager.run('SettingsWebclient', 'setAddHash', [['alias', sHash]]);
};

/**
 * @param {string} sTabName
 */
CAccountsSettingsPaneView.prototype.changeRoute = function (sTabName) {
  var oEditedAccount = AccountList.getEdited(),
    aAddHash = ['account', oEditedAccount ? oEditedAccount.hash() : '', sTabName];
  if (this.editedIdentity()) {
    aAddHash = ['identity', this.editedIdentity().hash(), sTabName];
  } else if (this.editedFetcher()) {
    aAddHash = ['fetcher', this.editedFetcher().hash(), sTabName];
  } else if (this.editedAlias()) {
    aAddHash = ['alias', this.editedAlias().hash(), sTabName];
  }
  ModulesManager.run('SettingsWebclient', 'setAddHash', [aAddHash]);
};

/**
 * @param {string} sName
 */
CAccountsSettingsPaneView.prototype.changeTab = function (sName) {
  var oCurrentTab = this.currentTab(),
    oNewTab = _.find(this.tabs(), function (oTab) {
      return oTab.visible() && oTab.name === sName;
    }),
    fShowNewTab = function () {
      if (oNewTab) {
        if (_.isFunction(oNewTab.view.showTab)) {
          oNewTab.view.showTab(this.editedIdentity() || this.editedFetcher() || this.editedAlias());
        }
        this.currentTab(oNewTab);
      }
    }.bind(this),
    bShow = true;
  if (oNewTab) {
    if (oCurrentTab && _.isFunction(oCurrentTab.view.hide)) {
      oCurrentTab.view.hide(fShowNewTab, _.bind(function () {
        if (_.isFunction(Routing.stopListening) && _.isFunction(Routing.startListening)) {
          Routing.stopListening();
        }
        this.changeRoute(oCurrentTab.name);
        if (_.isFunction(Routing.startListening)) {
          Routing.startListening();
        }
      }, this));
      bShow = false;
    }
  } else if (!oCurrentTab) {
    oNewTab = this.getAutoselectedTab();
  }
  if (!oCurrentTab) {
    _.delay(_.bind(function () {
      this.changeRoute(oNewTab.name);
    }, this));
  }
  if (bShow) {
    fShowNewTab();
  }
};
CAccountsSettingsPaneView.prototype.populate = function () {
  var oAccount = AccountList.getEdited();
  if (oAccount) {
    this.allowFolders(oAccount.allowManageFolders());
    this.allowForward(oAccount.allowForward());
    this.allowAutoresponder(oAccount.allowAutoresponder());
    this.allowFilters(oAccount.allowFilters());
    this.allowSignature(!Settings.AllowIdentities);
    this.visibleAllowBlockLists(oAccount.enableAllowBlockLists());
    if (!this.currentTab() || !this.currentTab().visible()) {
      this.currentTab(this.getAutoselectedTab());
    }
  }
};
CAccountsSettingsPaneView.prototype.onRemoveIdentity = function () {
  this.editedIdentity(null);
  this.changeTab(this.currentTab() ? this.currentTab().name : '');
};
CAccountsSettingsPaneView.prototype.onRemoveFetcher = function () {
  this.editedFetcher(null);
  this.changeRoute('');
};
CAccountsSettingsPaneView.prototype.onRemoveAlias = function () {
  this.editedAlias(null);
  this.changeRoute('');
};
module.exports = new CAccountsSettingsPaneView();

/***/ }),

/***/ "AY4M":
/*!***************************************************************!*\
  !*** ./modules/MailWebclient/js/popups/CreateFetcherPopup.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CoreAjax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  CreateFolderPopup = __webpack_require__(/*! modules/MailWebclient/js/popups/CreateFolderPopup.js */ "k0bD"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  MailCache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  CServerPropertiesView = __webpack_require__(/*! modules/MailWebclient/js/views/CServerPropertiesView.js */ "cVoG");

/**
 * @constructor
 */
function CCreateFetcherPopup() {
  CAbstractPopup.call(this);
  this.iAccountId = 0;
  this.loading = ko.observable(false);
  this.newFolderCreating = ko.observable(false);
  this.incomingLogin = ko.observable('');
  this.incomingPassword = ko.observable('');
  this.oIncoming = new CServerPropertiesView(110, 995, 'fectcher_add_incoming', TextUtils.i18n('MAILWEBCLIENT/LABEL_POP3_SERVER'));
  this.folder = ko.observable('');
  this.options = ko.observableArray([]);
  MailCache.folderList.subscribe(function () {
    this.populateOptions();
  }, this);
  this.addNewFolderCommand = Utils.createCommand(this, this.onAddNewFolderClick);
  this.leaveMessagesOnServer = ko.observable(false);
  this.loginIsSelected = ko.observable(false);
  this.passwordIsSelected = ko.observable(false);
  this.defaultOptionsAfterRender = Utils.defaultOptionsAfterRender;
}
_.extendOwn(CCreateFetcherPopup.prototype, CAbstractPopup.prototype);
CCreateFetcherPopup.prototype.PopupTemplate = 'MailWebclient_Settings_CreateFetcherPopup';
CCreateFetcherPopup.prototype.onOpen = function (iAccountId) {
  this.iAccountId = iAccountId;
  this.bShown = true;
  this.populateOptions();
  this.incomingLogin('');
  this.incomingPassword('');
  this.oIncoming.clear();
  this.folder('');
  this.leaveMessagesOnServer(true);
};
CCreateFetcherPopup.prototype.populateOptions = function () {
  if (this.bShown) {
    this.options(MailCache.folderList().getOptions('', true, false, false));
  }
};
CCreateFetcherPopup.prototype.onClose = function () {
  this.bShown = false;
};
CCreateFetcherPopup.prototype.save = function () {
  if (this.isEmptyRequiredFields()) {
    Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_REQUIRED_FIELDS_EMPTY'));
  } else {
    var oParameters = {
      'AccountId': this.iAccountId,
      'Folder': this.folder(),
      'IncomingServer': this.oIncoming.server(),
      'IncomingPort': this.oIncoming.getIntPort(),
      'IncomingUseSsl': this.oIncoming.ssl(),
      'IncomingLogin': $.trim(this.incomingLogin()),
      'IncomingPassword': $.trim(this.incomingPassword()),
      'LeaveMessagesOnServer': this.leaveMessagesOnServer()
    };
    this.loading(true);
    CoreAjax.send(Settings.FetchersServerModuleName, 'CreateFetcher', oParameters, this.onCreateFetcherResponse, this);
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CCreateFetcherPopup.prototype.onCreateFetcherResponse = function (oResponse, oRequest) {
  this.loading(false);
  if (!oResponse.Result) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_UNKNOWN'));
  } else {
    AccountList.populateFetchers();
    this.closePopup();
  }
};
CCreateFetcherPopup.prototype.cancelPopup = function () {
  if (!this.newFolderCreating()) {
    this.closePopup();
  }
};
CCreateFetcherPopup.prototype.isEmptyRequiredFields = function () {
  switch ('') {
    case this.oIncoming.server():
      this.oIncoming.server.focused(true);
      return true;
    case $.trim(this.incomingLogin()):
      this.loginIsSelected(true);
      return true;
    case $.trim(this.incomingPassword()):
      this.passwordIsSelected(true);
      return true;
    default:
      return false;
  }
};
CCreateFetcherPopup.prototype.onAddNewFolderClick = function () {
  this.newFolderCreating(true);
  Popups.showPopup(CreateFolderPopup, [_.bind(this.chooseFolderInList, this)]);
};

/**
 * @param {string} sFolderName
 * @param {string} sParentFullName
 */
CCreateFetcherPopup.prototype.chooseFolderInList = function (sFolderName, sParentFullName) {
  var sDelimiter = MailCache.folderList().sDelimiter,
    aFolder = [];
  if (sFolderName !== '' && sParentFullName !== '') {
    this.options(MailCache.folderList().getOptions('', true, false, false));
    _.each(this.options(), _.bind(function (oOption) {
      if (sFolderName === oOption.name) {
        aFolder = oOption.fullName.split(sDelimiter);
        aFolder.pop();
        if (sParentFullName === aFolder.join(sDelimiter)) {
          this.folder(oOption.fullName);
        }
      }
    }, this));
  }
  this.newFolderCreating(false);
};
module.exports = new CCreateFetcherPopup();

/***/ }),

/***/ "Dq0Z":
/*!***********************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/settings/AccountForwardSettingsFormView.js ***!
  \***********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  AddressUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Address.js */ "rBrp"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  AlertPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/AlertPopup.js */ "Rjyw"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  CForwardModel = __webpack_require__(/*! modules/MailWebclient/js/models/CForwardModel.js */ "p6Kc");

/**
 * @constructor
 */
function CAccountForwardSettingsFormView() {
  CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
  this.enable = ko.observable(false);
  this.keepcopy = ko.observable(true);
  this.email = ko.observable('');
  this.email.focused = ko.observable(false);
  AccountList.editedId.subscribe(function () {
    if (this.bShown) {
      this.populate();
    }
  }, this);
}
_.extendOwn(CAccountForwardSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CAccountForwardSettingsFormView.prototype.ViewTemplate = 'MailWebclient_Settings_AccountForwardSettingsFormView';
CAccountForwardSettingsFormView.prototype.getCurrentValues = function () {
  return [this.enable(), this.keepcopy(), this.email()];
};
CAccountForwardSettingsFormView.prototype.revert = function () {
  this.populate();
};
CAccountForwardSettingsFormView.prototype.getParametersForSave = function () {
  var oAccount = AccountList.getEdited();
  return {
    'AccountID': oAccount.id(),
    'Enable': this.enable(),
    'Email': TextUtils.trim(this.email()),
    'KeepMessageCopy': this.keepcopy()
  };
};
CAccountForwardSettingsFormView.prototype.applySavedValues = function (oParameters) {
  var oAccount = AccountList.getEdited(),
    oForward = oAccount.forward();
  if (oForward) {
    oForward.enable = oParameters.Enable;
    oForward.email = oParameters.Email;
    oForward.keepcopy = oParameters.KeepMessageCopy;
  }
};
CAccountForwardSettingsFormView.prototype.save = function () {
  var fSaveData = function () {
      this.isSaving(true);
      this.updateSavedState();
      Ajax.send('UpdateForward', this.getParametersForSave(), this.onResponse, this);
    }.bind(this),
    sEmail = TextUtils.trim(this.email());
  if (this.enable() && sEmail === '') {
    this.email.focused(true);
  } else if (this.enable() && sEmail !== '') {
    if (!AddressUtils.isCorrectEmail(sEmail)) {
      Popups.showPopup(AlertPopup, [TextUtils.i18n('MAILWEBCLIENT/ERROR_INPUT_CORRECT_EMAILS') + ' ' + sEmail]);
    } else {
      fSaveData();
    }
  } else {
    fSaveData();
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CAccountForwardSettingsFormView.prototype.onResponse = function (oResponse, oRequest) {
  this.isSaving(false);
  if (oResponse.Result === false) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_SAVING_SETTINGS_FAILED'));
  } else {
    var oParameters = oRequest.Parameters;
    this.applySavedValues(oParameters);
    Screens.showReport(TextUtils.i18n('MAILWEBCLIENT/REPORT_FORWARD_UPDATE_SUCCESS'));
  }
};
CAccountForwardSettingsFormView.prototype.populate = function () {
  var oAccount = AccountList.getEdited(),
    oForward = oAccount.forward() ? oAccount.forward() : null;
  if (oForward !== null) {
    this.enable(oForward.enable);
    this.keepcopy(oForward.keepcopy);
    this.email(oForward.email);
  } else {
    Ajax.send('GetForward', {
      'AccountID': oAccount.id()
    }, this.onGetForwardResponse, this);
  }
  this.updateSavedState();
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CAccountForwardSettingsFormView.prototype.onGetForwardResponse = function (oResponse, oRequest) {
  if (oResponse && oResponse.Result) {
    var oParameters = oRequest.Parameters,
      iAccountId = Types.pInt(oParameters.AccountID),
      oAccount = AccountList.getAccount(iAccountId),
      oForward = new CForwardModel();
    if (oAccount) {
      oForward.parse(iAccountId, oResponse.Result);
      oAccount.forward(oForward);
      if (iAccountId === AccountList.editedId()) {
        this.populate();
      }
    }
  }
};
module.exports = new CAccountForwardSettingsFormView();

/***/ }),

/***/ "ELk6":
/*!***************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/settings/AccountFoldersPaneView.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  CreateFolderPopup = __webpack_require__(/*! modules/MailWebclient/js/popups/CreateFolderPopup.js */ "k0bD"),
  SetSystemFoldersPopup = __webpack_require__(/*! modules/MailWebclient/js/popups/SetSystemFoldersPopup.js */ "guPB"),
  ImportExportPopup = ModulesManager.run('ImportExportMailPlugin', 'getImportExportPopup'),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  MailCache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z");
__webpack_require__(/*! modules/MailWebclient/js/vendors/knockout-sortable.js */ "YOkC");

/**
 * @constructor
 */
function CAccountFoldersPaneView() {
  this.bAllowTemplateFolders = Settings.AllowTemplateFolders;
  this.highlighted = ko.observable(false).extend({
    'autoResetToFalse': 500
  });
  this.collection = ko.observableArray(MailCache.editedFolderList().collection());
  this.oCollSubscription = MailCache.editedFolderList().collection.subscribe(function (koCollection) {
    this.collection(koCollection);
  }, this);
  this.totalMessageCount = ko.observable(0);
  this.enableButtons = ko.computed(function () {
    return MailCache.editedFolderList().initialized();
  }, this);
  MailCache.editedFolderList.subscribe(function (oFolderList) {
    this.collection(oFolderList.collection());
    this.setTotalMessageCount();
    this.oCollSubscription.dispose();
    this.oCollSubscription = oFolderList.collection.subscribe(function (koCollection) {
      this.collection(koCollection);
    }, this);
  }, this);
  this.addNewFolderCommand = Utils.createCommand(this, this.addNewFolder, this.enableButtons);
  this.setSystemFoldersCommand = Utils.createCommand(this, this.setSystemFolders, this.enableButtons);
  this.showMovedWithMouseItem = ko.computed(function () {
    return !App.isMobile();
  }, this);
  this.allowImportExport = ko.observable(ModulesManager.isModuleEnabled('ImportExportMailPlugin'));
  App.subscribeEvent('MailWebclient::AttemptDeleteNonemptyFolder', _.bind(function () {
    this.highlighted(true);
  }, this));
  this.manageFolderButtons = ko.observableArray([]);
  App.broadcastEvent('MailWebclient::RegisterManageFolderButton', function (buttonData) {
    this.manageFolderButtons.push(_.extend({
      tooltip: function tooltip(folder) {
        return '';
      },
      cssClasses: function cssClasses(folder) {
        return '';
      },
      handler: function handler(folder) {}
    }, buttonData));
  }.bind(this));
  App.broadcastEvent('MailWebclient::ConstructView::after', {
    'Name': this.ViewConstructorName,
    'View': this
  });
  this.afterMove = _.debounce(_.bind(this.folderListOrderUpdate, this), 3000);
}
CAccountFoldersPaneView.prototype.ViewTemplate = 'MailWebclient_Settings_AccountFoldersPaneView';
CAccountFoldersPaneView.prototype.ViewConstructorName = 'CAccountFoldersPaneView';
CAccountFoldersPaneView.prototype.folderListOrderUpdate = function () {
  var aLinedCollection = MailCache.editedFolderList().repopulateLinedCollection(),
    oParameters = {
      'AccountID': AccountList.editedId(),
      'FolderList': _.compact(_.map(aLinedCollection, function (oFolder) {
        if (!oFolder.bVirtual) {
          return oFolder.fullName();
        }
      }))
    };
  Ajax.send('UpdateFoldersOrder', oParameters, function (oResponse) {
    if (!oResponse.Result) {
      Api.showErrorByCode(oResponse, TextUtils.i18n('MAILWEBCLIENT/ERROR_CHANGE_FOLDERS_ORDER'));
      MailCache.getFolderList(AccountList.editedId());
    }
  }, this);
};
CAccountFoldersPaneView.prototype.hide = function (fAfterHideHandler) {
  var iAccountId = AccountList.editedId();
  _.delay(function () {
    MailCache.getFolderList(iAccountId);
  }, 3000);
  if (_.isFunction(fAfterHideHandler)) {
    fAfterHideHandler();
  }
};
CAccountFoldersPaneView.prototype.show = function () {
  this.setTotalMessageCount();
};
CAccountFoldersPaneView.prototype.setTotalMessageCount = function () {
  var oFolderList = MailCache.editedFolderList();
  if (oFolderList.iAccountId === 0) {
    this.totalMessageCount(0);
  } else {
    this.totalMessageCount(oFolderList.getTotalMessageCount());
    if (!oFolderList.countsCompletelyFilled()) {
      if (oFolderList.countsCompletelyFilledSubscribtion) {
        oFolderList.countsCompletelyFilledSubscribtion.dispose();
        oFolderList.countsCompletelyFilledSubscribtion = null;
      }
      oFolderList.countsCompletelyFilledSubscribtion = oFolderList.countsCompletelyFilled.subscribe(function () {
        if (oFolderList.countsCompletelyFilled()) {
          this.totalMessageCount(oFolderList.getTotalMessageCount());
          oFolderList.countsCompletelyFilledSubscribtion.dispose();
          oFolderList.countsCompletelyFilledSubscribtion = null;
        }
      }, this);
    }
  }
};
CAccountFoldersPaneView.prototype.addNewFolder = function () {
  Popups.showPopup(CreateFolderPopup);
};
CAccountFoldersPaneView.prototype.setSystemFolders = function () {
  Popups.showPopup(SetSystemFoldersPopup);
};
CAccountFoldersPaneView.prototype.importExport = function () {
  if (this.allowImportExport()) {
    Popups.showPopup(ImportExportPopup, [{}]);
  }
};
module.exports = new CAccountFoldersPaneView();

/***/ }),

/***/ "EhEn":
/*!****************************************************************!*\
  !*** ./modules/MailWebclient/js/koBindingSearchHighlighter.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A");
function getCaretOffset(oElement) {
  var oSel = null,
    oRange = {},
    oPreSelectionRange = {},
    iStart = 0;
  if (window.getSelection && document.createRange) {
    oSel = window.getSelection();
    if (oSel.rangeCount > 0) {
      oRange = oSel.getRangeAt(0);
      oPreSelectionRange = oRange.cloneRange();
      oPreSelectionRange.selectNodeContents(oElement);
      oPreSelectionRange.setEnd(oRange.startContainer, oRange.startOffset);
      iStart = oPreSelectionRange.toString().length;
      if ($(oElement).html().length < iStart) {
        iStart = 0;
      }
    }
  } else if (document.selection && document.body.createTextRange) {
    oRange = document.selection.createRange();
    oPreSelectionRange = document.body.createTextRange();
    oPreSelectionRange.moveToElementText(oElement);
    if (typeof oPreSelectionRange.setEndPoint === 'function') {
      oPreSelectionRange.setEndPoint('EndToStart', oRange);
    }
    iStart = oPreSelectionRange.text.length;
  }
  return iStart;
}
function setCursor(oElement, iCaretPos) {
  var range, selection, textRange;
  if (!oElement) {
    return false;
  } else if (document.createRange) {
    range = document.createRange();
    range.selectNodeContents(oElement);
    range.setStart(oElement, iCaretPos);
    range.setEnd(oElement, iCaretPos);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (oElement.createTextRange) {
    textRange = oElement.createTextRange();
    textRange.collapse(true);
    textRange.moveEnd(iCaretPos);
    textRange.moveStart(iCaretPos);
    textRange.select();
    return true;
  } else if (oElement.setSelectionRange) {
    oElement.setSelectionRange(iCaretPos, iCaretPos);
    return true;
  }
  return false;
}
ko.bindingHandlers.highlighter = {
  'init': function init(oElement, fValueAccessor, fAllBindingsAccessor, oViewModel, bindingContext) {
    var jqEl = $(oElement),
      oOptions = fValueAccessor(),
      oValueObserver = oOptions.valueObserver ? oOptions.valueObserver : null,
      oHighlighterValueObserver = oOptions.highlighterValueObserver ? oOptions.highlighterValueObserver : null,
      oHighlightTrigger = oOptions.highlightTrigger ? oOptions.highlightTrigger : null,
      aHighlightWords = ['from:', 'to:', 'subject:', 'text:', 'email:', 'has:', 'date:', 'text:', 'body:', 'folders:'],
      rPattern = function () {
        var sPatt = '';
        $.each(aHighlightWords, function (i, oEl) {
          sPatt = !i ? sPatt + '\\b' + oEl : sPatt + '|\\b' + oEl;
        });
        return new RegExp('(' + sPatt + ')', 'g');
      }(),
      fClear = function fClear(sStr) {
        return sStr.replace(/\xC2\xA0/g, ' ').replace(/\xA0/g, ' ').replace(/[\s]+/g, ' ');
      },
      iPrevKeyCode = -1,
      sUserLanguage = window.navigator.language || window.navigator.userLanguage,
      aTabooLang = ['zh', 'zh-TW', 'zh-CN', 'zh-HK', 'zh-SG', 'zh-MO', 'ja', 'ja-JP', 'ko', 'ko-KR', 'vi', 'vi-VN', 'th', 'th-TH'],
      // , 'ru', 'ru-RU'
      bHighlight = !_.include(aTabooLang, sUserLanguage);
    $(oElement).on('keydown', function (oEvent) {
      return oEvent.keyCode !== Enums.Key.Enter;
    }).on('keyup', function (oEvent) {
      var aMoveKeys = [Enums.Key.Left, Enums.Key.Right, Enums.Key.Home, Enums.Key.End],
        bMoveKeys = -1 !== $.inArray(oEvent.keyCode, aMoveKeys);
      if (!(oEvent.keyCode === Enums.Key.Shift || oEvent.keyCode === Enums.Key.Alt || oEvent.keyCode === Enums.Key.Ctrl ||
      // for international english -------------------------
      oEvent.keyCode === Enums.Key.Dash || oEvent.keyCode === Enums.Key.Apostrophe || oEvent.keyCode === Enums.Key.Six && oEvent.shiftKey ||
      // ---------------------------------------------------
      bMoveKeys || (oEvent.ctrlKey || iPrevKeyCode === Enums.Key.Ctrl) && oEvent.keyCode === Enums.Key.a)) {
        oValueObserver(fClear(jqEl.text()));
        highlight(false);
      }
      iPrevKeyCode = oEvent.keyCode;
      return true;
    }).on('paste', function (oEvent) {
      if (document.queryCommandSupported('insertText')) {
        // cancel paste
        oEvent.preventDefault();

        // get text representation of clipboard
        var sText = '';
        if (oEvent.clipboardData || oEvent.originalEvent.clipboardData) {
          sText = (oEvent.originalEvent || oEvent).clipboardData.getData('text/plain');
        } else if (window.clipboardData) {
          sText = window.clipboardData.getData('Text');
        }

        // insert text manually
        document.execCommand('insertText', false, sText);

        // insertText command doesn't work in IE
        // paste command causes looping in IE
        // so there is no clearing text in IE for now
      }
      setTimeout(function () {
        oValueObserver(fClear(jqEl.text()));
        highlight(false);
      }, 0);
    });

    // highlight on init
    setTimeout(function () {
      highlight(true);
    }, 0);
    function highlight(bNotRestoreSel) {
      if (bHighlight) {
        var iCaretPos = 0,
          sContent = jqEl.text(),
          aContent = sContent.split(rPattern),
          aDividedContent = [],
          sReplaceWith = '<span class="search_highlight"' + '>$&</span>';
        _.each(aContent, function (sEl) {
          var aEl = sEl.split('');
          if (_.any(aHighlightWords, function (oAnyEl) {
            return oAnyEl === sEl;
          })) {
            _.each(aEl, function (sElem) {
              aDividedContent.push($(sElem.replace(/(.)/, sReplaceWith)));
            });
          } else {
            _.each(aEl, function (sElem) {
              if (sElem === ' ') {
                // space fix for firefox
                aDividedContent.push(document.createTextNode("\xA0"));
              } else {
                aDividedContent.push(document.createTextNode(sElem));
              }
            });
          }
        });
        if (!jqEl.is(':focus')) {
          // Don't set focus if the field wasn't focused before.
          // It may affect on viewing messages in the list using the up and down buttons.
          jqEl.empty().append(aDividedContent);
        } else {
          iCaretPos = getCaretOffset(oElement);
          jqEl.empty().append(aDividedContent);
          setCursor(oElement, iCaretPos);
        }
      }
    }
    oHighlightTrigger.notifySubscribers();
    oHighlightTrigger.subscribe(function (bNotRestoreSel) {
      setTimeout(function () {
        highlight(!!bNotRestoreSel);
      }, 0);
    }, this);
    oHighlighterValueObserver.subscribe(function () {
      var sElemText = jqEl.text(),
        sValue = oValueObserver();
      if (sElemText.replace("\xA0", ' ') !== sValue.replace("\xA0", ' ')) {
        jqEl.text(sValue);
      }
    }, this);
  }
};

/***/ }),

/***/ "F9TS":
/*!**********************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/settings/AccountUnifiedMailboxFormView.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z");

/**
 * @constructor
 */
function CAccountUnifiedMailboxFormView() {
  CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
  this.visibleTab = ko.computed(function () {
    return Settings.AllowUnifiedInbox && (Settings.AllowMultiAccounts && Settings.AllowAddAccounts || AccountList.collection().length > 1);
  }, this);
  this.includeInUnifiedMailbox = ko.observable(false);
  this.showUnifiedMailboxLabel = ko.observable(false);
  this.showUnifiedMailboxLabel.subscribe(function () {
    if (this.showUnifiedMailboxLabel()) {
      if (this.unifiedMailboxLabelText() === '') {
        var oEditedAccount = AccountList.getEdited();
        this.unifiedMailboxLabelText(oEditedAccount.email());
      }
      if (this.unifiedMailboxLabelColor() === '') {
        this.unifiedMailboxLabelColor('#f09650');
      }
    }
  }, this);
  this.unifiedMailboxLabelText = ko.observable('');
  this.unifiedMailboxLabelColor = ko.observable('');
  AccountList.unifiedMailboxAccounts.subscribe(function () {
    var MailCache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8"),
      HeaderItemView = __webpack_require__(/*! modules/MailWebclient/js/views/HeaderItemView.js */ "oq0M");
    MailCache.oUnifiedInbox.hasChanges(true);
    MailCache.oUnifiedInbox.removeAllMessageListsFromCacheIfHasChanges();
    if (AccountList.unifiedMailboxAccounts().length > 1) {
      MailCache.executeCheckMail();
    } else {
      HeaderItemView.hash(HeaderItemView.baseHash());
    }
  });
  this.aColors = ['#f09650', '#f68987', '#6fd0ce', '#8fbce2', '#b9a4f5', '#f68dcf', '#d88adc', '#4afdb4', '#9da1ff', '#5cc9c9', '#77ca71', '#aec9c9'];
}
_.extendOwn(CAccountUnifiedMailboxFormView.prototype, CAbstractSettingsFormView.prototype);
CAccountUnifiedMailboxFormView.prototype.ViewTemplate = 'MailWebclient_Settings_AccountUnifiedMailboxFormView';
CAccountUnifiedMailboxFormView.prototype.getCurrentValues = function () {
  return [this.includeInUnifiedMailbox(), this.showUnifiedMailboxLabel(), this.unifiedMailboxLabelText(), this.unifiedMailboxLabelColor()];
};
CAccountUnifiedMailboxFormView.prototype.getParametersForSave = function () {
  return {
    'AccountID': AccountList.editedId(),
    'IncludeInUnifiedMailbox': this.includeInUnifiedMailbox(),
    'ShowUnifiedMailboxLabel': this.showUnifiedMailboxLabel(),
    'UnifiedMailboxLabelText': $.trim(this.unifiedMailboxLabelText()),
    'UnifiedMailboxLabelColor': $.trim(this.unifiedMailboxLabelColor())
  };
};
CAccountUnifiedMailboxFormView.prototype.revert = function () {
  this.populate();
};
CAccountUnifiedMailboxFormView.prototype.populate = function () {
  var oAccount = AccountList.getEdited();
  if (oAccount) {
    this.includeInUnifiedMailbox(oAccount.includeInUnifiedMailbox());
    this.showUnifiedMailboxLabel(oAccount.showUnifiedMailboxLabel());
    this.unifiedMailboxLabelText(oAccount.unifiedMailboxLabelText());
    this.unifiedMailboxLabelColor(oAccount.unifiedMailboxLabelColor());
  } else {
    this.includeInUnifiedMailbox(false);
    this.showUnifiedMailboxLabel(false);
    this.unifiedMailboxLabelText('');
    this.unifiedMailboxLabelColor('');
  }
  this.updateSavedState();
};
CAccountUnifiedMailboxFormView.prototype.save = function () {
  this.isSaving(true);
  this.updateSavedState();
  Ajax.send('UpdateAccountUnifiedMailbox', this.getParametersForSave(), this.onResponse, this);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CAccountUnifiedMailboxFormView.prototype.onResponse = function (oResponse, oRequest) {
  this.isSaving(false);
  if (!oResponse.Result) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_SAVING_SETTINGS_FAILED'));
  } else {
    var oParameters = oRequest.Parameters,
      iAccountId = Types.pInt(oParameters.AccountID),
      oAccount = AccountList.getAccount(iAccountId);
    if (oAccount) {
      oAccount.updateFromServer(oResponse.Result);
      this.populate();
      Screens.showReport(TextUtils.i18n('COREWEBCLIENT/REPORT_SETTINGS_UPDATE_SUCCESS'));
    }
  }
};
CAccountUnifiedMailboxFormView.prototype.setColor = function (sColor) {
  this.unifiedMailboxLabelColor(sColor);
};
module.exports = new CAccountUnifiedMailboxFormView();

/***/ }),

/***/ "HVVA":
/*!***********************************************************!*\
  !*** ./modules/MailWebclient/js/views/CFolderListView.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "ioSH"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "KIwC"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  CreateFolderPopup = __webpack_require__(/*! modules/MailWebclient/js/popups/CreateFolderPopup.js */ "k0bD"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  MailCache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z");

/**
 * @constructor
 */
function CFolderListView() {
  this.folderList = MailCache.folderList;
  this.folderFullName = ko.computed(function () {
    var oFolder = MailCache.getCurrentFolder();
    return oFolder ? oFolder.fullName() : '';
  }, this);
  this.unifiedInboxAllowed = AccountList.unifiedInboxAllowed;
  this.oUnifiedInbox = MailCache.oUnifiedInbox;
  this.manageFoldersHash = ko.computed(function () {
    if (ModulesManager.isModuleEnabled('SettingsWebclient')) {
      var oCurrentAccount = AccountList.getCurrent();
      if (oCurrentAccount && oCurrentAccount.allowManageFolders()) {
        return Routing.buildHashFromArray(['settings', 'mail-accounts', 'account', oCurrentAccount.hash(), 'folders']);
      }
    }
    return '#';
  }, this);
  this.quotaProc = ko.observable(-1);
  this.quotaDesc = ko.observable('');
  this.bShowQuotaBarTextAsTooltip = UserSettings.ShowQuotaBarTextAsTooltip;
  if (UserSettings.ShowQuotaBar) {
    ko.computed(function () {
      MailCache.quotaChangeTrigger();
      var oAccount = AccountList.getCurrent(),
        iQuota = oAccount ? oAccount.quota() : 0,
        iUsed = oAccount ? oAccount.usedSpace() : 0,
        iProc = 0 < iQuota ? Math.ceil(iUsed / iQuota * 100) : -1;
      iProc = 100 < iProc ? 100 : iProc;
      this.quotaProc(iProc);
      this.quotaDesc(-1 < iProc ? TextUtils.i18n('COREWEBCLIENT/INFO_QUOTA', {
        'PROC': iProc,
        'QUOTA': TextUtils.getFriendlySize(iQuota * 1024)
      }) : '');
      if (UserSettings.QuotaWarningPerc > 0 && iProc !== -1 && UserSettings.QuotaWarningPerc > 100 - iProc) {
        Screens.showError(TextUtils.i18n('COREWEBCLIENT/WARNING_QUOTA_ALMOST_REACHED'), true);
      }
      return true;
    }, this);
  }
  this.visibleNewFolderButton = ko.computed(function () {
    return Settings.AllowAddNewFolderOnMainScreen && this.folderList().collection().length > 0;
  }, this);
  this.underNewMessageButtonControllers = ko.observableArray([]);
  this.underInboxFolderControllers = ko.observableArray([]);
  this.folderListControllers = ko.computed(function () {
    return this.underNewMessageButtonControllers().concat(this.underInboxFolderControllers());
  }, this);
  App.broadcastEvent('MailWebclient::RegisterFolderListController', _.bind(function (controller, place) {
    this.registerController(controller, place);
  }, this));
}
CFolderListView.prototype.ViewTemplate = 'MailWebclient_FoldersView';
CFolderListView.prototype.onShow = function () {
  this.folderListControllers().forEach(function (controller) {
    if (_.isFunction(controller.onShow)) {
      controller.onShow();
    }
  });
};
CFolderListView.prototype.onRoute = function (aParams) {
  this.folderListControllers().forEach(function (controller) {
    if (_.isFunction(controller.onRoute)) {
      controller.onRoute(aParams);
    }
  });
};
CFolderListView.prototype.addNewFolder = function () {
  Popups.showPopup(CreateFolderPopup);
};

/**
 * @param {Object} controller
 * @param {string} place
 */
CFolderListView.prototype.registerController = function (controller, place) {
  switch (place) {
    case 'UnderNewMessageButton':
      this.underNewMessageButtonControllers.push(controller);
      break;
    case 'UnderInboxFolder':
      this.underInboxFolderControllers.push(controller);
      break;
  }
};
module.exports = CFolderListView;

/***/ }),

/***/ "MIfO":
/*!****************************************************************!*\
  !*** ./modules/MailWebclient/js/models/CAutoresponderModel.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  moment = __webpack_require__(/*! moment */ "sdEb");
;

/**
 * @constructor
 */
function CAutoresponderModel() {
  this.iAccountId = 0;
  this.enable = false;
  this.subject = '';
  this.message = '';
  this.scheduled = false;
  this.start = null;
  this.end = null;
}

/**
 * @param {number} iAccountId
 * @param {Object} oData
 */
CAutoresponderModel.prototype.parse = function (iAccountId, oData) {
  this.iAccountId = iAccountId;
  this.enable = !!oData.Enable;
  this.subject = Types.pString(oData.Subject);
  this.message = Types.pString(oData.Message);
  this.scheduled = !!oData.Scheduled;
  // this.start = moment.unix(oData.Start);
  // if (oData.End != null) {
  // 	this.end = moment.unix(oData.End);
  // }
  if (oData.Start) {
    this.start = Types.pInt(oData.Start);
  }
  if (oData.End) {
    this.end = Types.pInt(oData.End);
  }
};
module.exports = CAutoresponderModel;

/***/ }),

/***/ "NH30":
/*!*************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/settings/MailSettingsFormView.js ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Browser = __webpack_require__(/*! modules/CoreWebclient/js/Browser.js */ "/Odb"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "KIwC"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  MailUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Mail.js */ "Panx"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z");

/**
 * @constructor
 */
function CMailSettingsFormView() {
  CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
  this.bRtl = UserSettings.IsRTL;
  this.bAllowChangeStarredMessagesSource = Settings.AllowChangeStarredMessagesSource;
  this.bAllowMailto = Settings.AllowAppRegisterMailto && MailUtils.isAvailableRegisterMailto();
  this.bAllowShowMessagesCountInFolderList = Settings.AllowShowMessagesCountInFolderList;
  this.bAllowHorizontalLayout = Settings.AllowHorizontalLayout;
  this.mailsPerPageValues = ko.observableArray(Types.getAdaptedPerPageList(Settings.MailsPerPage));
  this.starredMessagesSourceValues = [{
    text: TextUtils.i18n('MAILWEBCLIENT/LABEL_STARRED_MESSAGES_SOURCE_INBOX'),
    value: Enums.StarredMessagesSource.InboxOnly
  }, {
    text: TextUtils.i18n('MAILWEBCLIENT/LABEL_STARRED_MESSAGES_SOURCE_ALL_FOLDERS'),
    value: Enums.StarredMessagesSource.AllFolders
  }];
  this.aLayoutValues = [{
    text: TextUtils.i18n('MAILWEBCLIENT/LABEL_VERT_SPLIT_LAYOUT'),
    value: false
  }, {
    text: TextUtils.i18n('MAILWEBCLIENT/LABEL_HORIZ_SPLIT_LAYOUT'),
    value: true
  }];
  this.mailsPerPage = ko.observable(Settings.MailsPerPage);
  this.starredMessagesSource = ko.observable(Settings.StarredMessagesSource);
  this.allowAutosaveInDrafts = ko.observable(Settings.AllowAutosaveInDrafts);
  this.allowChangeInputDirection = ko.observable(Settings.AllowChangeInputDirection);
  this.showMessagesCountInFolderList = ko.observable(Settings.showMessagesCountInFolderList());
  this.horizontalLayout = ko.observable(Settings.HorizontalLayout);
}
_.extendOwn(CMailSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CMailSettingsFormView.prototype.ViewTemplate = 'MailWebclient_Settings_MailSettingsFormView';
CMailSettingsFormView.prototype.registerMailto = function () {
  MailUtils.registerMailto();
};
CMailSettingsFormView.prototype.getCurrentValues = function () {
  return [this.mailsPerPage(), this.allowAutosaveInDrafts(), this.allowChangeInputDirection(), this.showMessagesCountInFolderList(), this.horizontalLayout()];
};
CMailSettingsFormView.prototype.revertGlobalValues = function () {
  this.mailsPerPage(Settings.MailsPerPage);
  this.starredMessagesSource(Settings.StarredMessagesSource);
  this.allowAutosaveInDrafts(Settings.AllowAutosaveInDrafts);
  this.allowChangeInputDirection(Settings.AllowChangeInputDirection);
  this.showMessagesCountInFolderList(Settings.showMessagesCountInFolderList());
  this.horizontalLayout(Settings.HorizontalLayout);
};
CMailSettingsFormView.prototype.getParametersForSave = function () {
  return {
    'MailsPerPage': this.mailsPerPage(),
    'StarredMessagesSource': this.starredMessagesSource(),
    'AllowAutosaveInDrafts': this.allowAutosaveInDrafts(),
    'AllowChangeInputDirection': this.allowChangeInputDirection(),
    'ShowMessagesCountInFolderList': this.showMessagesCountInFolderList(),
    'HorizontalLayout': this.horizontalLayout()
  };
};
CMailSettingsFormView.prototype.applySavedValues = function (parameters) {
  if (parameters.HorizontalLayout !== Settings.HorizontalLayout) {
    window.location.reload();
  }
  Settings.update(parameters);
};
CMailSettingsFormView.prototype.setAccessLevel = function (sEntityType, iEntityId) {
  this.visible(sEntityType === '');
};
module.exports = new CMailSettingsFormView();

/***/ }),

/***/ "NMTm":
/*!****************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/settings/AccountSettingsFormView.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  ChangePasswordPopup = ModulesManager.run('ChangePasswordWebclient', 'getChangePasswordPopup'),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  CServerPairPropertiesView = __webpack_require__(/*! modules/MailWebclient/js/views/settings/CServerPairPropertiesView.js */ "qN2P");

/**
 * @constructor
 */
function CAccountSettingsFormView() {
  CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
  this.sFakePass = 'xxxxxxxx'; // fake password uses to display something in password input while account editing

  this.bAllowIdentities = Settings.AllowIdentities;
  this.useToAuthorize = ko.observable(false);
  this.canBeUsedToAuthorize = ko.observable(false);
  this.isDefaultAccount = ko.observable(false);
  this.isServerOwner = ko.observable(false);
  this.friendlyName = ko.observable('');
  this.email = ko.observable('');
  this.incomingLogin = ko.observable('');
  this.incomingPassword = ko.observable('');
  this.allowSpecifyPassword = ko.observable(false);
  this.useThreading = ko.observable(false);
  this.saveRepliesToCurrFolder = ko.observable(false);
  this.oServerPairPropertiesView = new CServerPairPropertiesView('acc_edit');
  this.enableThreading = this.oServerPairPropertiesView.enableThreading;
  this.enableThreading.subscribe(function () {
    if (!this.enableThreading()) {
      this.useThreading(false);
    }
  }, this);
  this.allowChangePassword = ko.observable(false);
  this.incLoginFocused = ko.observable(false);
  this.incLoginFocused.subscribe(function () {
    if (this.incLoginFocused() && this.incomingLogin() === '') {
      this.incomingLogin(this.email());
    }
  }, this);
  AccountList.editedId.subscribe(function () {
    if (this.bShown) {
      this.populate();
    }
  }, this);
  this.updateSavedState();
  this.oServerPairPropertiesView.currentValues.subscribe(function () {
    this.updateSavedState();
  }, this);
  this.visibleTab = ko.observable(true);
  ko.computed(function () {
    var oAccount = AccountList.getEdited();
    if (oAccount) {
      this.allowChangePassword(ModulesManager.run('ChangePasswordWebclient', 'isChangePasswordButtonAllowed', [AccountList.collection().length, oAccount]));
      this.isDefaultAccount(oAccount.bDefault);
      this.isServerOwner(oAccount.oServer.sOwnerType === Enums.ServerOwnerType.Account);
    } else {
      this.allowChangePassword(false);
      this.isDefaultAccount(false);
    }
  }, this);
  this.isDisableAuthorize = ko.observable(App.userAccountsCount() <= 1);
  this.oDefaultAccountHostsSettingsView = __webpack_require__(/*! modules/MailWebclient/js/views/DefaultAccountHostsSettingsView.js */ "2wN8");
}
_.extendOwn(CAccountSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CAccountSettingsFormView.prototype.ViewTemplate = 'MailWebclient_Settings_AccountSettingsFormView';
CAccountSettingsFormView.prototype.onShow = function () {
  this.oServerPairPropertiesView.fullInit();
  this.populate();
};
CAccountSettingsFormView.prototype.getCurrentValues = function () {
  var aMain = [this.useToAuthorize(), this.friendlyName(), this.email(), this.incomingLogin(), this.incomingPassword(), this.useThreading(), this.saveRepliesToCurrFolder()],
    aServers = this.oServerPairPropertiesView.currentValues();
  return aMain.concat(aServers);
};
CAccountSettingsFormView.prototype.getParametersForSave = function () {
  var oAccount = AccountList.getEdited(),
    sIncomingPassword = $.trim(this.incomingPassword());
  return {
    'AccountID': oAccount.id(),
    'UseToAuthorize': this.useToAuthorize(),
    'FriendlyName': this.friendlyName(),
    'Email': $.trim(this.email()),
    'IncomingLogin': $.trim(this.incomingLogin()),
    'IncomingPassword': sIncomingPassword === this.sFakePass ? '' : sIncomingPassword,
    'Server': this.oServerPairPropertiesView.getParametersForSave(),
    'UseThreading': this.useThreading(),
    'SaveRepliesToCurrFolder': this.saveRepliesToCurrFolder()
  };
};
CAccountSettingsFormView.prototype.revert = function () {
  this.populate();
};
CAccountSettingsFormView.prototype.populate = function () {
  var oAccount = AccountList.getEdited();
  if (this.passwordMightBeIncorrectSubscribtion) {
    this.passwordMightBeIncorrectSubscribtion.dispose();
    this.passwordMightBeIncorrectSubscribtion = null;
  }
  if (oAccount) {
    this.friendlyName(oAccount.friendlyName());
    this.email(oAccount.email());
    this.incomingLogin(oAccount.incomingLogin());
    this.incomingPassword(this.sFakePass);
    this.allowSpecifyPassword(oAccount.passwordMightBeIncorrect());
    if (!oAccount.passwordMightBeIncorrect()) {
      this.passwordMightBeIncorrectSubscribtion = oAccount.passwordMightBeIncorrect.subscribe(function () {
        this.allowSpecifyPassword(oAccount.passwordMightBeIncorrect());
        this.passwordMightBeIncorrectSubscribtion.dispose();
        this.passwordMightBeIncorrectSubscribtion = null;
      }.bind(this));
    }
    this.oServerPairPropertiesView.setServer(oAccount.oServer);
    this.useToAuthorize(oAccount.useToAuthorize());
    this.canBeUsedToAuthorize(oAccount.canBeUsedToAuthorize());
    this.useThreading(oAccount.useThreading());
    this.saveRepliesToCurrFolder(oAccount.bSaveRepliesToCurrFolder);
    this.isDisableAuthorize(this.useToAuthorize() ? App.userAccountsCount() <= 1 : false);
  } else {
    this.friendlyName('');
    this.email('');
    this.incomingLogin('');
    this.incomingPassword('');
    this.allowSpecifyPassword(false);
    this.oServerPairPropertiesView.clear();
    this.useToAuthorize(true);
    this.canBeUsedToAuthorize(false);
    this.useThreading(false);
    this.isDisableAuthorize(true);
  }
  this.updateSavedState();
};
CAccountSettingsFormView.prototype.remove = function () {
  if (this.isDisableAuthorize()) {
    Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_ACCOUNT_DELETING_DISABLE'), true);
  } else {
    var oAccount = AccountList.getEdited();
    if (oAccount) {
      oAccount.remove();
    }
  }
};
CAccountSettingsFormView.prototype.save = function () {
  this.isSaving(true);
  this.updateSavedState();
  Ajax.send('UpdateAccount', this.getParametersForSave(), this.onResponse, this);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CAccountSettingsFormView.prototype.onResponse = function (oResponse, oRequest) {
  this.isSaving(false);
  if (!oResponse.Result) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_SAVING_SETTINGS_FAILED'));
  } else {
    var oParameters = oRequest.Parameters,
      iAccountId = Types.pInt(oParameters.AccountID),
      oAccount = AccountList.getAccount(iAccountId);
    if (oAccount) {
      if (Types.isNonEmptyString(oParameters.IncomingPassword) && oParameters.IncomingPassword !== this.sFakePass) {
        oAccount.passwordMightBeIncorrect(false);
      }
      oAccount.updateFromServer(oResponse.Result);
      this.populate();
      Screens.showReport(TextUtils.i18n('COREWEBCLIENT/REPORT_SETTINGS_UPDATE_SUCCESS'));
    }
  }
};
CAccountSettingsFormView.prototype.changePassword = function () {
  if (this.allowChangePassword()) {
    Popups.showPopup(ChangePasswordPopup, [{
      iAccountId: AccountList.editedId(),
      sModule: Settings.ServerModuleName,
      bHasOldPassword: true
    }]);
  }
};
module.exports = new CAccountSettingsFormView();

/***/ }),

/***/ "OQrU":
/*!*********************************************!*\
  !*** ./modules/MailWebclient/js/manager.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
module.exports = function (oAppData) {
  __webpack_require__(/*! modules/MailWebclient/js/enums.js */ "TQgg");
  var _ = __webpack_require__(/*! underscore */ "C3HO"),
    ko = __webpack_require__(/*! knockout */ "p09A"),
    App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
    ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
    Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
    AccountList = null,
    ComposeView = null,
    HeaderItemView = null;
  var mailViewInstance = null;
  var getMailViewInstance = function getMailViewInstance() {
    if (!mailViewInstance) {
      var CMailView = __webpack_require__(/*! modules/MailWebclient/js/views/CMailView.js */ "Qz84");
      mailViewInstance = new CMailView();
    }
    return mailViewInstance;
  };
  Settings.init(oAppData);
  if (!ModulesManager.isModuleAvailable(Settings.ServerModuleName)) {
    return null;
  }
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m");
  if (App.isUserNormalOrTenant()) {
    var Cache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8");
    Cache.init();
    if (App.isNewTab()) {
      var GetComposeView = function GetComposeView() {
        if (ComposeView === null) {
          var CComposeView = __webpack_require__(/*! modules/MailWebclient/js/views/CComposeView.js */ "Ssud");
          ComposeView = new CComposeView();
        }
        return ComposeView;
      };
      return {
        start: function start() {
          __webpack_require__(/*! modules/MailWebclient/js/koBindings.js */ "dBPG");
        },
        getScreens: function getScreens() {
          var oScreens = {};
          oScreens[Settings.HashModuleName + '-view'] = function () {
            return __webpack_require__(/*! modules/MailWebclient/js/views/MessagePaneView.js */ "nM5h");
          };
          oScreens[Settings.HashModuleName + '-compose'] = function () {
            return GetComposeView();
          };
          return oScreens;
        },
        registerComposeToolbarController: function registerComposeToolbarController(oController) {
          var ComposeView = GetComposeView();
          ComposeView.registerToolbarController(oController);
        },
        registerComposeMessageRowController: function registerComposeMessageRowController(oController) {
          var ComposeView = GetComposeView();
          ComposeView.registerMessageRowController(oController);
        },
        registerComposeUploadAttachmentsController: function registerComposeUploadAttachmentsController(controller) {
          var ComposeView = GetComposeView();
          ComposeView.registerUploadAttachmentsController(controller);
        },
        getComposeMessageWithData: function getComposeMessageWithData() {
          var bAllowSendMail = true,
            ComposeUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Compose.js */ "sXLm");
          return bAllowSendMail ? ComposeUtils.composeMessageWithData : false;
        },
        getComposeMessageToAddresses: function getComposeMessageToAddresses() {
          var bAllowSendMail = true,
            ComposeUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Compose.js */ "sXLm");
          return bAllowSendMail ? ComposeUtils.composeMessageToAddresses : false;
        },
        getComposeMessageWithAttachments: function getComposeMessageWithAttachments() {
          var bAllowSendMail = true,
            ComposeUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Compose.js */ "sXLm");
          return bAllowSendMail ? ComposeUtils.composeMessageWithAttachments : false;
        },
        getSearchMessagesInCurrentFolder: function getSearchMessagesInCurrentFolder() {
          var MainTab = window.opener && window.opener.MainTabMailMethods;
          return MainTab ? _.bind(MainTab.searchMessagesInCurrentFolder, MainTab) : false;
        },
        getCurrentMessage: function getCurrentMessage() {
          return Cache.currentMessage();
        },
        getCurrentFolderList: function getCurrentFolderList() {
          return Cache.folderList();
        },
        syncFolders: function syncFolders() {
          return Cache.getFolderList(Cache.currentAccountId());
        },
        removeMessageFromCurrentList: function removeMessageFromCurrentList(iAccountId, sFolder, sUid) {
          return Cache.removeMessageFromCurrentList(iAccountId, sFolder, sUid);
        }
      };
    } else {
      var oMethods = {
        enableModule: ko.observable(Settings.AllowAddAccounts || AccountList.hasAccount()),
        getComposeMessageToAddresses: function getComposeMessageToAddresses() {
          var bAllowSendMail = true,
            ComposeUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Compose.js */ "sXLm");
          return bAllowSendMail ? ComposeUtils.composeMessageToAddresses : false;
        },
        getComposeMessageWithData: function getComposeMessageWithData() {
          var bAllowSendMail = true,
            ComposeUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Compose.js */ "sXLm");
          return bAllowSendMail ? ComposeUtils.composeMessageWithData : false;
        },
        getComposeMessageWithAttachments: function getComposeMessageWithAttachments() {
          var bAllowSendMail = true,
            ComposeUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Compose.js */ "sXLm");
          return bAllowSendMail ? ComposeUtils.composeMessageWithAttachments : false;
        },
        getPrefetcher: function getPrefetcher() {
          return __webpack_require__(/*! modules/MailWebclient/js/Prefetcher.js */ "qG1F");
        },
        registerComposeToolbarController: function registerComposeToolbarController(oController) {
          var ComposePopup = __webpack_require__(/*! modules/MailWebclient/js/popups/ComposePopup.js */ "v4rC");
          ComposePopup.registerToolbarController(oController);
        },
        registerComposeMessageRowController: function registerComposeMessageRowController(oController) {
          var ComposePopup = __webpack_require__(/*! modules/MailWebclient/js/popups/ComposePopup.js */ "v4rC");
          ComposePopup.registerMessageRowController(oController);
        },
        registerComposeUploadAttachmentsController: function registerComposeUploadAttachmentsController(controller) {
          var ComposePopup = __webpack_require__(/*! modules/MailWebclient/js/popups/ComposePopup.js */ "v4rC");
          ComposePopup.registerUploadAttachmentsController(controller);
        },
        getSearchMessagesInInbox: function getSearchMessagesInInbox() {
          return _.bind(Cache.searchMessagesInInbox, Cache);
        },
        getFolderHash: function getFolderHash(sFolder) {
          return Cache.getFolderHash(sFolder);
        },
        getSearchMessagesInCurrentFolder: function getSearchMessagesInCurrentFolder() {
          return _.bind(Cache.searchMessagesInCurrentFolder, Cache);
        },
        getMessage: function getMessage(sFullName, sUid, fResponseHandler) {
          return Cache.getMessage(Cache.currentAccountId(), sFullName, sUid, fResponseHandler, Cache);
        },
        getCurrentMessage: function getCurrentMessage() {
          return Cache.currentMessage();
        },
        getCurrentFolderList: function getCurrentFolderList() {
          return Cache.folderList();
        },
        syncFolders: function syncFolders() {
          return Cache.getFolderList(Cache.currentAccountId());
        },
        removeMessageFromCurrentList: function removeMessageFromCurrentList(iAccountId, sFolder, sUid) {
          return Cache.removeMessageFromCurrentList(iAccountId, sFolder, sUid);
        },
        deleteMessages: function deleteMessages(iAccountId, sFolderFullName, aUids) {
          var oFolder = Cache.getFolderByFullName(iAccountId, sFolderFullName);
          Cache.deleteMessagesFromFolder(oFolder, aUids);
        },
        getAllAccountsFullEmails: function getAllAccountsFullEmails() {
          return AccountList.getAllFullEmails();
        },
        getAccountList: function getAccountList() {
          return AccountList;
        },
        getMailCache: function getMailCache() {
          return Cache;
        },
        getSettings: function getSettings() {
          return Settings;
        },
        setCustomRouting: function setCustomRouting(sFolder, iPage, sUid, sSearch, sFilters, sCustom) {
          var Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "ioSH"),
            LinksUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Links.js */ "dpSB");
          Routing.setHash(LinksUtils.getMailbox(sFolder, iPage, sUid, sSearch, sFilters, Settings.MessagesSortBy.DefaultSortBy, Settings.MessagesSortBy.DefaultSortOrder, sCustom));
        }
      };
      if (!App.isMobile()) {
        oMethods = _.extend(oMethods, {
          start: function start(ModulesManager) {
            var TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
              Browser = __webpack_require__(/*! modules/CoreWebclient/js/Browser.js */ "/Odb"),
              MailUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Mail.js */ "Panx");
            __webpack_require__(/*! modules/MailWebclient/js/koBindings.js */ "dBPG");
            __webpack_require__(/*! modules/MailWebclient/js/koBindingSearchHighlighter.js */ "EhEn");
            if (Settings.AllowAppRegisterMailto) {
              MailUtils.registerMailto(Browser.firefox);
            }
            if (Settings.AllowAddAccounts || AccountList.hasAccount()) {
              ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [function () {
                return __webpack_require__(/*! modules/MailWebclient/js/views/settings/MailSettingsFormView.js */ "NH30");
              }, Settings.HashModuleName, TextUtils.i18n('MAILWEBCLIENT/LABEL_SETTINGS_TAB')]);
              var sTabName = Settings.AllowMultiAccounts ? TextUtils.i18n('MAILWEBCLIENT/LABEL_ACCOUNTS_SETTINGS_TAB') : TextUtils.i18n('MAILWEBCLIENT/LABEL_ACCOUNT_SETTINGS_TAB');
              ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [function () {
                return __webpack_require__(/*! modules/MailWebclient/js/views/settings/AccountsSettingsPaneView.js */ "9lZ8");
              }, Settings.HashModuleName + '-accounts', sTabName]);
            }
            ko.computed(function () {
              var aAuthAcconts = _.filter(AccountList.collection(), function (oAccount) {
                  return oAccount.useToAuthorize();
                }),
                aAuthAccountsEmails = _.map(aAuthAcconts, function (oAccount) {
                  return oAccount.email();
                });
              Settings.userMailAccountsCount(aAuthAcconts.length);
              Settings.mailAccountsEmails(aAuthAccountsEmails);
            }, this);
            App.broadcastEvent('RegisterNewItemElement', {
              'title': TextUtils.i18n('MAILWEBCLIENT/ACTION_NEW_MESSAGE'),
              'handler': function handler() {
                window.location.hash = Settings.HashModuleName;
                var mailViewInstance = getMailViewInstance();
                mailViewInstance.executeCompose();
              },
              'className': 'item_mail',
              'order': 1,
              'column': 1
            });
          },
          getScreens: function getScreens() {
            return _defineProperty({}, Settings.HashModuleName, getMailViewInstance);
          },
          getHeaderItem: function getHeaderItem() {
            if (HeaderItemView === null && Settings.AllowOtherModulesToReplaceTabsbarHeader) {
              var params = {};
              App.broadcastEvent('MailWebclient::GetHeaderItemView', params);
              HeaderItemView = params.HeaderItemView || null;
            }
            if (HeaderItemView === null) {
              HeaderItemView = __webpack_require__(/*! modules/MailWebclient/js/views/HeaderItemView.js */ "oq0M");
            }
            return {
              item: HeaderItemView,
              name: Settings.HashModuleName
            };
          },
          getMobileSyncSettingsView: function getMobileSyncSettingsView() {
            return __webpack_require__(/*! modules/MailWebclient/js/views/DefaultAccountHostsSettingsView.js */ "2wN8");
          }
        });
      }
      return oMethods;
    }
  }
  return null;
};

/***/ }),

/***/ "Qz84":
/*!*****************************************************!*\
  !*** ./modules/MailWebclient/js/views/CMailView.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "ioSH"),
  WindowOpener = __webpack_require__(/*! modules/CoreWebclient/js/WindowOpener.js */ "zVyH"),
  CAbstractScreenView = __webpack_require__(/*! modules/CoreWebclient/js/views/CAbstractScreenView.js */ "db2p"),
  ComposeUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Compose.js */ "sXLm"),
  LinksUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Links.js */ "dpSB"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  MailCache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  CFolderListView = __webpack_require__(/*! modules/MailWebclient/js/views/CFolderListView.js */ "HVVA"),
  CMessageListView = __webpack_require__(/*! modules/MailWebclient/js/views/CMessageListView.js */ "sLMx"),
  MessagePaneView = __webpack_require__(/*! modules/MailWebclient/js/views/MessagePaneView.js */ "nM5h");

/**
 * @constructor
 */
function CMailView() {
  var _this = this;
  CAbstractScreenView.call(this, 'MailWebclient');
  App.broadcastEvent('MailWebclient::ConstructView::before', {
    'Name': this.ViewConstructorName,
    'View': this,
    'MailCache': MailCache
  });
  this.browserTitle = ko.computed(function () {
    return AccountList.getEmail() + ' - ' + TextUtils.i18n('MAILWEBCLIENT/HEADING_BROWSER_TAB');
  });
  this.folderList = MailCache.folderList;
  this.domFoldersMoveTo = ko.observable(null);
  this.openMessageInNewWindowBound = _.bind(this.openMessageInNewWindow, this);
  this.oFolderList = new CFolderListView();
  this.isUnifiedFolderCurrent = MailCache.oUnifiedInbox.selected;
  this.oBaseMessageList = new CMessageListView(this.openMessageInNewWindowBound);
  this.messageList = ko.observable(this.oBaseMessageList);
  this.isSearchMultiFolders = ko.computed(function () {
    return this.messageList().searchFoldersMode() === Enums.SearchFoldersMode.Sub || this.messageList().searchFoldersMode() === Enums.SearchFoldersMode.All;
  }, this);
  this.oBaseMessagePaneView = MessagePaneView;
  this.messagePane = ko.observable(this.oBaseMessagePaneView);
  this.messagePane().openMessageInNewWindowBound = this.openMessageInNewWindowBound;
  this.messagePane.subscribe(function () {
    this.bindMessagePane();
    this.messagePane().expandMessagePaneWidth = this.expandMessagePaneWidth;
  }, this);
  this.expandListPaneWidth = ko.observable(false);
  this.expandMessagePaneWidth = ko.observable(false);
  this.messagePane().expandMessagePaneWidth = this.expandMessagePaneWidth;
  MailCache.currentMessage.subscribe(function () {
    if (!MailCache.currentMessage()) {
      this.expandMessagePaneWidth(false);
    }
  }, this);
  this.isEnableGroupOperations = ko.computed(function () {
    return _this.messageList().isEnableGroupOperations();
  });
  this.sCustomBigButtonModule = '';
  this.fCustomBigButtonHandler = null;
  this.customBigButtonText = ko.observable('');
  this.bigButtonCommand = Utils.createCommand(this, function () {
    if (_.isFunction(this.fCustomBigButtonHandler)) {
      this.fCustomBigButtonHandler();
    } else {
      this.executeCompose();
    }
  });
  this.bigButtonText = ko.computed(function () {
    if (this.customBigButtonText() !== '') {
      return this.customBigButtonText();
    }
    return TextUtils.i18n('MAILWEBCLIENT/ACTION_NEW_MESSAGE');
  }, this);
  this.isTemplateFolder = ko.computed(function () {
    return MailCache.isTemplateFolder(MailCache.getCurrentFolderFullname());
  }, this);
  this.checkMailCommand = Utils.createCommand(this, this.executeCheckMail);
  this.checkMailIndicator = ko.observable(true).extend({
    throttle: 50
  });
  ko.computed(function () {
    this.checkMailIndicator(MailCache.checkMailStarted() || MailCache.messagesLoading());
  }, this);
  this.customModulesDisabledMark = ko.observableArray([]);
  this.visibleMarkTool = ko.computed(function () {
    return !this.isTemplateFolder() && !Types.isNonEmptyArray(this.customModulesDisabledMark());
  }, this);
  this.markAsReadCommand = Utils.createCommand(this.messageList(), function () {
    _this.messageList().executeMarkAsRead();
  }, this.isEnableGroupOperations);
  this.markAsUnreadCommand = Utils.createCommand(this.messageList(), function () {
    _this.messageList().executeMarkAsUnread();
  }, this.isEnableGroupOperations);
  this.markAllReadCommand = Utils.createCommand(this.messageList(), function () {
    _this.messageList().executeMarkAllRead();
  });
  this.customModulesDisabledMove = ko.observableArray([]);
  this.visibleMoveTool = ko.computed(function () {
    return !MailCache.oUnifiedInbox.selected() && !Types.isNonEmptyArray(this.customModulesDisabledMove());
  }, this);
  this.needToCopyDraggedItems = ko.observable(false);
  this.moveToFolderTemplate = 'MailWebclient_Messages_MoveButtonView'; // can be override by other modules
  this.moveToFolderCommand = Utils.createCommand(this, function () {}, this.isEnableGroupOperations);
  this.deleteCommand = Utils.createCommand(this.messageList(), function () {
    _this.messageList().executeDelete();
  }, this.isEnableGroupOperations);
  this.selectedCount = ko.computed(function () {
    return this.messageList().checkedUids().length;
  }, this);
  this.emptyTrashCommand = Utils.createCommand(MailCache, MailCache.executeEmptyTrash, function () {
    return _this.messageList().isNotEmptyList();
  });
  this.emptySpamCommand = Utils.createCommand(MailCache, MailCache.executeEmptySpam, function () {
    return _this.messageList().isNotEmptyList();
  });
  this.spamCommand = Utils.createCommand(this.messageList(), function () {
    _this.messageList().executeSpam();
  }, this.isEnableGroupOperations);
  this.notSpamCommand = Utils.createCommand(this.messageList(), function () {
    _this.messageList().executeNotSpam();
  }, this.isEnableGroupOperations);
  this.isSpamFolder = ko.computed(function () {
    return MailCache.getCurrentFolderType() === Enums.FolderTypes.Spam;
  }, this);
  this.customModulesDisabledSpam = ko.observableArray([]);
  this.allowedSpamAction = ko.computed(function () {
    return Settings.AllowSpamFolder && this.folderList().spamFolder() && !this.isSpamFolder() && !this.isTemplateFolder() && !Types.isNonEmptyArray(this.customModulesDisabledSpam());
  }, this);
  this.allowedNotSpamAction = ko.computed(function () {
    return Settings.AllowSpamFolder && this.isSpamFolder() && !this.isTemplateFolder();
  }, this);
  this.isTrashFolder = ko.computed(function () {
    return MailCache.getCurrentFolderType() === Enums.FolderTypes.Trash;
  }, this);
  if (Settings.HorizontalLayout) {
    $('html').addClass('layout-horiz-split');
  }
  App.subscribeEvent('CoreWebclient::GetDebugInfo', _.bind(function (oParams) {
    oParams.Info.push('checkMailStarted: ' + MailCache.checkMailStarted() + ', messagesLoading: ' + MailCache.messagesLoading());
  }, this));
  App.broadcastEvent('MailWebclient::ConstructView::after', {
    'Name': this.ViewConstructorName,
    'View': this
  });
}
_.extendOwn(CMailView.prototype, CAbstractScreenView.prototype);
CMailView.prototype.ViewTemplate = Settings.HorizontalLayout ? 'MailWebclient_MailHorizontalLayoutView' : 'MailWebclient_MailView';
CMailView.prototype.ViewConstructorName = 'CMailView';

/**
 * Checks if there are changes in Mail screen.
 * @returns {Boolean}
 */
CMailView.prototype.hasUnsavedChanges = function () {
  return this.messagePane() && _.isFunction(this.messagePane().hasUnsavedChanges) && this.messagePane().hasUnsavedChanges();
};

/**
 * Discards changes in Mail screen.
 */
CMailView.prototype.discardChanges = function () {
  if (this.messagePane() && _.isFunction(this.messagePane().discardChanges)) {
    this.messagePane().discardChanges();
  }
};
CMailView.prototype.setCustomPreviewPane = function (sModuleName, oPreviewPane) {
  if (this.messagePane().__customModuleName !== sModuleName) {
    if (_.isFunction(this.messagePane().onHide)) {
      this.messagePane().onHide();
    }
    oPreviewPane.__customModuleName = sModuleName;
    this.messagePane(oPreviewPane);
    if (_.isFunction(this.messagePane().onShow)) {
      this.messagePane().onShow();
    }
  }
};
CMailView.prototype.removeCustomPreviewPane = function (sModuleName) {
  if (this.messagePane().__customModuleName === sModuleName) {
    if (_.isFunction(this.messagePane().onHide)) {
      this.messagePane().onHide();
    }
    this.messagePane(this.oBaseMessagePaneView);
    if (_.isFunction(this.messagePane().onShow)) {
      this.messagePane().onShow();
    }
  }
};
CMailView.prototype.setCustomMessageList = function (customModuleName, customMessageList) {
  if (this.messageList().__customModuleName !== customModuleName) {
    customMessageList.__customModuleName = customModuleName;
    this.changeMessageList(customMessageList);
  }
};
CMailView.prototype.removeCustomMessageList = function (customModuleName) {
  if (this.messageList().__customModuleName === customModuleName) {
    this.changeMessageList(this.oBaseMessageList);
  }
};
CMailView.prototype.changeMessageList = function (newMessageList) {
  if (_.isFunction(this.messageList().onHide)) {
    this.messageList().onHide();
  }
  if (_.isFunction(this.messageList().unbind)) {
    this.messageList().unbind();
  }
  this.messageList(newMessageList);
  if (_.isFunction(this.messageList().onBind)) {
    this.messageList().onBind(this.$viewDom);
  }
  if (_.isFunction(this.messageList().onShow)) {
    this.messageList().onShow();
  }
};
CMailView.prototype.setCustomBigButton = function (sModuleName, fHandler, sText) {
  this.sCustomBigButtonModule = sModuleName;
  this.fCustomBigButtonHandler = fHandler;
  this.customBigButtonText(sText);
};
CMailView.prototype.removeCustomBigButton = function (sModuleName) {
  if (this.sCustomBigButtonModule === sModuleName) {
    this.sCustomBigButtonModule = '';
    this.fCustomBigButtonHandler = null;
    this.customBigButtonText('');
  }
};
CMailView.prototype.resetDisabledTools = function (sModuleName, aDisabledTools) {
  if ($.inArray('spam', aDisabledTools) !== -1) {
    this.customModulesDisabledSpam(_.union(this.customModulesDisabledSpam(), [sModuleName]));
  } else {
    this.customModulesDisabledSpam(_.without(this.customModulesDisabledSpam(), sModuleName));
  }
  if ($.inArray('move', aDisabledTools) !== -1) {
    this.customModulesDisabledMove(_.union(this.customModulesDisabledMove(), [sModuleName]));
  } else {
    this.customModulesDisabledMove(_.without(this.customModulesDisabledMove(), sModuleName));
  }
  if ($.inArray('mark', aDisabledTools) !== -1) {
    this.customModulesDisabledMark(_.union(this.customModulesDisabledMark(), [sModuleName]));
  } else {
    this.customModulesDisabledMark(_.without(this.customModulesDisabledMark(), sModuleName));
  }
};
CMailView.prototype.executeCompose = function () {
  ComposeUtils.composeMessage();
};
CMailView.prototype.executeCheckMail = function () {
  MailCache.checkMessageFlags();
  MailCache.executeCheckMail(true);
};

/**
 * @param {object} oMessage
 */
CMailView.prototype.openMessageInNewWindow = function (oMessage) {
  if (oMessage && oMessage.longUid) {
    var iAccountId = oMessage.accountId(),
      sFolder = oMessage.folder(),
      sUid = oMessage.longUid(),
      oFolder = this.folderList().getFolderByFullName(sFolder),
      bDraftFolder = (oFolder === null || oFolder === void 0 ? void 0 : oFolder.type()) === Enums.FolderTypes.Drafts,
      sHash = '';
    if (this.isUnifiedFolderCurrent()) {
      sFolder = MailCache.oUnifiedInbox.fullName();
      bDraftFolder = false;
    }
    if (bDraftFolder) {
      sHash = Routing.buildHashFromArray(LinksUtils.getComposeFromMessage('drafts', iAccountId, sFolder, sUid));
    } else {
      sHash = Routing.buildHashFromArray(LinksUtils.getViewMessage(iAccountId, sFolder, sUid));
      if (_.isFunction(this.messagePane().passReplyDataToNewTab)) {
        this.messagePane().passReplyDataToNewTab(oMessage.longUid());
      }
    }
    WindowOpener.openTab('?message-newtab' + sHash);
  }
};

/**
 * @param {Object} oData
 * @param {Object} oEvent
 */
CMailView.prototype.resizeDblClick = function (oData, oEvent) {
  Utils.calmEvent(oEvent);
  Utils.removeSelection();
  this.expandListPaneWidth(!this.expandListPaneWidth());
};

/**
 * @param {Array} aParams
 */
CMailView.prototype.onRoute = function (aParams) {
  if (!AccountList.hasAccount()) {
    Routing.replaceHash(['settings', 'mail-accounts', 'account', 'create']);
    return;
  }
  var oParams = LinksUtils.parseMailbox(aParams);
  AccountList.changeCurrentAccountByHash(oParams.AccountHash);
  if (_.isFunction(this.oFolderList.onRoute)) {
    this.oFolderList.onRoute(aParams);
  }
  this.messageList().onRoute(aParams);
  if (_.isFunction(this.messagePane().onRoute)) {
    this.messagePane().onRoute(aParams, oParams);
  }
  if (oParams.MailtoCompose) {
    if (App.isMobile()) {
      var aParams = LinksUtils.getComposeWithToField(aParams[2]);
      Routing.replaceHash(aParams);
      setTimeout(function () {
        Routing.clearPreviousHash();
      }, 0);
    } else {
      ComposeUtils.composeMessageToAddresses(aParams[2]);
      Routing.replaceHash(LinksUtils.getMailbox());
    }
  }
};
CMailView.prototype.onShow = function () {
  if (_.isFunction(this.oFolderList.onShow)) {
    this.oFolderList.onShow();
  }
  this.messageList().onShow();
  if (_.isFunction(this.messagePane().onShow)) {
    this.messagePane().onShow();
  }
};
CMailView.prototype.onHide = function () {
  this.messageList().onHide();
  if (_.isFunction(this.messagePane().onHide)) {
    this.messagePane().onHide();
  }
};
CMailView.prototype.bindMessagePane = function () {
  if (_.isFunction(this.messagePane().onBind)) {
    this.messagePane().onBind(this.$viewDom);
    this.messagePane().__bound = true;
  }
};
CMailView.prototype.onBind = function () {
  var oMessageList = this.messageList();
  oMessageList.onBind(this.$viewDom);
  this.bindMessagePane();
  $(this.domFoldersMoveTo()).on('click', 'span.folder', function (oEvent) {
    var sClickedFolder = $(this).data('folder');
    if (MailCache.getCurrentFolderFullname() !== sClickedFolder) {
      if (oEvent.ctrlKey) {
        oMessageList.executeCopyToFolder(sClickedFolder);
      } else {
        oMessageList.executeMoveToFolder(sClickedFolder);
      }
    }
  });
  if (!App.isMobile()) {
    this.hotKeysBind();
  }
};
CMailView.prototype.hotKeysBind = function () {
  $(document).on('keydown', $.proxy(function (ev) {
    var sKey = ev.keyCode,
      bComputed = ev && !ev.ctrlKey && !ev.altKey && !ev.shiftKey && !Utils.isTextFieldFocused() && this.shown(),
      oList = this.messageList(),
      oFirstMessage = oList.collection()[0],
      bGotoSearch = oFirstMessage && MailCache.currentMessage() && oFirstMessage.longUid() === MailCache.currentMessage().longUid();
    if (bComputed && sKey === Enums.Key.s || bComputed && bGotoSearch && sKey === Enums.Key.Up) {
      ev.preventDefault();
      this.searchFocus();
    } else if (oList.isFocused() && ev && sKey === Enums.Key.Down && oFirstMessage) {
      ev.preventDefault();
      oList.isFocused(false);
      oList.routeForMessage(oFirstMessage);
    } else if (bComputed && sKey === Enums.Key.n) {
      this.executeCompose();
      ev.preventDefault();
    }
  }, this));
};

/**
 * Method is used from Notes module
 * @param {string} sFolderName
 * @param {number} iUid
 */
CMailView.prototype.routeMessageView = function (sFolderName, iUid) {
  Routing.setHash(LinksUtils.getMailbox(sFolderName, this.messageList().oPageSwitcher.currentPage(), iUid));
};

/**
 * @param {Object} oMessage
 * @param {boolean} ctrlOrCmdUsed
 */
CMailView.prototype.dragAndDropHelper = function (oMessage, ctrlOrCmdUsed) {
  if (oMessage) {
    oMessage.checked(true);
  }
  var oHelper = Utils.draggableItems(),
    aUids = this.messageList().checkedOrSelectedUids(),
    iCount = aUids.length;
  oHelper.data('p7-message-list-folder', MailCache.getCurrentFolderFullname());
  oHelper.data('p7-message-list-uids', aUids);
  this.needToCopyDraggedItems(ctrlOrCmdUsed);
  $('.count-text', oHelper).text(TextUtils.i18n('MAILWEBCLIENT/LABEL_DRAG_MESSAGES_PLURAL', {
    'COUNT': ctrlOrCmdUsed ? '+ ' + iCount : iCount
  }, null, iCount));
  return oHelper;
};

/**
 * @param {Object} oToFolder
 * @param {Object} oEvent
 * @param {Object} oUi
 */
CMailView.prototype.messagesDrop = function (oToFolder, oEvent, oUi) {
  if (oToFolder) {
    var oHelper = oUi && oUi.helper ? oUi.helper : null,
      sFolder = oHelper ? oHelper.data('p7-message-list-folder') : '',
      aUids = oHelper ? oHelper.data('p7-message-list-uids') : null;
    if (sFolder && aUids) {
      Utils.uiDropHelperAnim(oEvent, oUi);
      if (this.needToCopyDraggedItems()) {
        this.messageList().executeCopyToFolder(oToFolder.fullName());
      } else {
        this.messageList().executeMoveToFolder(oToFolder.fullName());
      }
      this.uncheckMessages();
    }
  }
};
CMailView.prototype.searchFocus = function () {
  if (this.messageList().selector.useKeyboardKeys() && !Utils.isTextFieldFocused()) {
    this.messageList().isFocused(true);
  }
};
CMailView.prototype.onVolumerClick = function (oVm, oEv) {
  oEv.stopPropagation();
};
CMailView.prototype.uncheckMessages = function () {
  _.each(MailCache.messages(), function (oMessage) {
    oMessage.checked(false);
  });
};
module.exports = CMailView;

/***/ }),

/***/ "SRQT":
/*!***************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/settings/CAliasSettingsFormView.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  CoreAjax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "MYiO");

/**
 * @constructor
 * 
 * @param {Object} oParent
 * @param {boolean} bAllowAliases
 */
function CAliasSettingsFormView(oParent, bAllowAliases) {
  CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
  this.alias = ko.observable(null);
  this.oParent = oParent;
  this.disableRemoveAlias = ko.observable(!bAllowAliases);
  this.friendlyName = ko.observable('');
  this.friendlyNameHasFocus = ko.observable(false);
}
_.extendOwn(CAliasSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CAliasSettingsFormView.prototype.ViewTemplate = 'MailWebclient_Settings_AliasSettingsFormView';
CAliasSettingsFormView.prototype.ViewConstructorName = 'CAliasSettingsFormView';

/**
 * @param {Object} oAlias
 */
CAliasSettingsFormView.prototype.onShow = function (oAlias) {
  this.alias(oAlias && oAlias.ALIAS ? oAlias : null);
  this.populate();
};
CAliasSettingsFormView.prototype.getCurrentValues = function () {
  return [this.friendlyName()];
};
CAliasSettingsFormView.prototype.getParametersForSave = function () {
  if (this.alias()) {
    var oParameters = {
      'AccountID': this.alias().accountId(),
      'FriendlyName': this.friendlyName(),
      'EntityId': this.alias().id()
    };
    return oParameters;
  }
  return {};
};
CAliasSettingsFormView.prototype.save = function () {
  this.isSaving(true);
  this.updateSavedState();
  CoreAjax.send(Settings.AliasesServerModuleName, 'UpdateAlias', this.getParametersForSave(), this.onResponse, this);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CAliasSettingsFormView.prototype.onResponse = function (oResponse, oRequest) {
  this.isSaving(false);
  if (!oResponse.Result) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('MAILWEBCLIENT/ERROR_ALIAS_ADDING'));
  } else {
    AccountList.populateAliases(function () {
      var oCurrAccount = AccountList.getCurrent(),
        aCurrAliases = oCurrAccount.aliases(),
        oCreatedAlias = _.find(aCurrAliases, function (oAlias) {
          return oAlias.id() === oResponse.Result;
        });
      if (oCreatedAlias) {
        ModulesManager.run('SettingsWebclient', 'setAddHash', [['alias', oCreatedAlias.hash()]]);
      }
    });
    Screens.showReport(TextUtils.i18n('COREWEBCLIENT/REPORT_SETTINGS_UPDATE_SUCCESS'));
  }
};
CAliasSettingsFormView.prototype.populate = function () {
  var oAlias = this.alias();
  if (oAlias) {
    this.friendlyName(oAlias.friendlyName());
    setTimeout(function () {
      this.updateSavedState();
    }.bind(this), 1);
  }
};
CAliasSettingsFormView.prototype.remove = function () {
  if (this.alias()) {
    Popups.showPopup(ConfirmPopup, [TextUtils.i18n('MAILWEBCLIENT/CONFIRM_DELETE_ALIAS'), _.bind(function (bRemove) {
      if (bRemove) {
        var oParameters = {
          'AccountID': this.alias().accountId(),
          'Aliases': [this.alias().email()]
        };
        CoreAjax.send(Settings.AliasesServerModuleName, 'DeleteAliases', oParameters, this.onAccountAliasDeleteResponse, this);
        if (_.isFunction(this.oParent.onRemoveAlias)) {
          this.oParent.onRemoveAlias();
        }
      }
    }, this)]);
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CAliasSettingsFormView.prototype.onAccountAliasDeleteResponse = function (oResponse, oRequest) {
  if (!oResponse.Result) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('MAILWEBCLIENT/ERROR_ALIAS_DELETING'));
  }
  AccountList.populateAliases();
};
CAliasSettingsFormView.prototype.cancel = function () {
  if (_.isFunction(this.oParent.cancelPopup)) {
    this.oParent.cancelPopup();
  }
};
module.exports = CAliasSettingsFormView;

/***/ }),

/***/ "TQgg":
/*!*******************************************!*\
  !*** ./modules/MailWebclient/js/enums.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  Enums = {};

/**
 * @enum {string}
 */
Enums.FolderFilter = {
  'Flagged': 'flagged',
  'Unseen': 'unseen'
};

/**
 * @enum {number}
 */
Enums.FolderTypes = {
  'Inbox': 1,
  'Sent': 2,
  'Drafts': 3,
  'Spam': 4,
  'Trash': 5,
  'Virus': 6,
  'Starred': 7,
  'Template': 8,
  'System': 9,
  'User': 10,
  'AllInboxes': 11
};
Enums.SearchFoldersMode = {
  Current: '',
  Sub: 'sub',
  All: 'all'
};

/**
 * @enum {number}
 */
Enums.Importance = {
  'Low': 5,
  'Normal': 3,
  'High': 1
};

/**
 * @enum {number}
 */
Enums.Sensitivity = {
  'Nothing': 0,
  'Confidential': 1,
  'Private': 2,
  'Personal': 3
};

/**
 * @enum {string}
 */
Enums.AnotherMessageComposedAnswer = {
  'Discard': 'Discard',
  'SaveAsDraft': 'SaveAsDraft',
  'Cancel': 'Cancel'
};

/**
 * @enum {string}
 */
Enums.ReplyType = {
  'Reply': 'reply',
  'ReplyAll': 'reply-all',
  'Resend': 'resend',
  'Forward': 'forward',
  'ForwardAsAttach': 'eml'
};
Enums.UseSignature = {
  'Off': '0',
  'On': '1'
};
Enums.MailErrors = {
  'CannotMoveMessageQuota': 4008
};

/**
 * @enum {string}
 */
Enums.ServerOwnerType = {
  'Account': 'account',
  'Tenant': 'tenant',
  'SuperAdmin': 'superadmin'
};

/**
 * @enum {string}
 */
Enums.StarredMessagesSource = {
  InboxOnly: 'inbox_only',
  AllFolders: 'all_folders'
};
if (typeof window.Enums === 'undefined') {
  window.Enums = {};
}
_.extendOwn(window.Enums, Enums);

/***/ }),

/***/ "W8zK":
/*!******************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/message-pane/UnsubscribeButtonView.js ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "MYiO"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  LinksUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Links.js */ "dpSB"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  MailCache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8");

/**
 * @constructor
 */
function CUnsubscribeButtonView() {
  this.unsubscribeOneClick = ko.observable(false);
  this.unsubscribeUrl = ko.observable('');
  this.unsubscribeEmail = ko.observable('');
  this.allowUnsubscribe = ko.observable(false);
  ko.computed(function () {
    var message = MailCache.currentMessage();
    if (message && message.completelyFilled()) {
      this.unsubscribeOneClick(Types.pBool(message.unsubscribe.OneClick));
      this.unsubscribeUrl(Types.pString(message.unsubscribe.Url));
      this.unsubscribeEmail(Types.pString(message.unsubscribe.Email));
      this.allowUnsubscribe(this.unsubscribeOneClick() || this.unsubscribeUrl() !== '' || this.unsubscribeEmail() !== '');
    }
  }, this).extend({
    rateLimit: 100
  });
}
CUnsubscribeButtonView.prototype.ViewTemplate = 'MailWebclient_Message_UnsubscribeButtonView';
CUnsubscribeButtonView.prototype.unsubscribe = function () {
  var currentMessage = MailCache.currentMessage();
  if (currentMessage) {
    if (this.unsubscribeOneClick()) {
      var parameters = {
        'AccountID': currentMessage.accountId(),
        'Folder': currentMessage.folder(),
        'Uid': currentMessage.uid()
      };
      Ajax.send('Unsubscribe', parameters, this.onUnsubscribeResponse, this);
    } else if (this.unsubscribeEmail()) {
      this.unsubscribeWithEmail();
    } else if (this.unsubscribeUrl()) {
      window.open(this.unsubscribeUrl(), '_blank');
    }
  }
};
CUnsubscribeButtonView.prototype.onUnsubscribeResponse = function (response, request) {
  if (response && response.Result) {
    Screens.showReport(TextUtils.i18n('MAILWEBCLIENT/REPORT_UNSUBSCRIBE_MESSAGE_SUCCESS'));
  } else {
    Api.showErrorByCode(response, TextUtils.i18n('MAILWEBCLIENT/ERROR_UNSUBSCRIBE_MESSAGE_FAIL'));
  }
};
CUnsubscribeButtonView.prototype.unsubscribeWithEmail = function () {
  var _this = this;
  var parts = LinksUtils.parseToAddr(this.unsubscribeEmail()),
    recipients = _.compact([parts.to, parts.cc, parts.bcc]),
    confirmParams = {
      RECIPIENT: recipients.join(', '),
      SUBJECT: parts.subject
    },
    confirmText = parts.subject ? TextUtils.i18n('MAILWEBCLIENT/CONFIRM_UNSUBSCRIBE_WITH_EMAIL_AND_SUBJECT', confirmParams) : TextUtils.i18n('MAILWEBCLIENT/CONFIRM_UNSUBSCRIBE_WITH_EMAIL', confirmParams),
    sendButtonText = TextUtils.i18n('MAILWEBCLIENT/ACTION_SEND'),
    confirmCallback = function confirmCallback(isConfirmed) {
      if (isConfirmed) {
        _this.sendUnsubscribeEmail(parts);
      }
    };
  Popups.showPopup(ConfirmPopup, [confirmText, confirmCallback, '', sendButtonText]);
};
CUnsubscribeButtonView.prototype.sendUnsubscribeEmail = function (parts) {
  var parameters = {
    'To': parts.to,
    'Cc': parts.cc,
    'Bcc': parts.bcc,
    'Subject': parts.subject,
    'Text': parts.body
  };
  Ajax.send('SendMessage', parameters, this.onUnsubscribeResponse, this);
};
module.exports = new CUnsubscribeButtonView();

/***/ }),

/***/ "YOkC":
/*!***************************************************************!*\
  !*** ./modules/MailWebclient/js/vendors/knockout-sortable.js ***!
  \***************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
// Attention: draggable and droppable are commented out because they conflict with our draggable and droppable
// knockout-sortable 1.2.0 | (c) 2019 Ryan Niemeyer |  http://www.opensource.org/licenses/mit-license
;
(function (factory) {
  if (true) {
    // AMD anonymous module
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! knockout */ "p09A"), __webpack_require__(/*! jquery */ "M4cL"), __webpack_require__(/*! jquery-ui/ui/widgets/sortable */ "Hg/X"), __webpack_require__(/*! jquery-ui/ui/widgets/draggable */ "6gxe"), __webpack_require__(/*! jquery-ui/ui/widgets/droppable */ "O/kJ")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else // removed by dead control flow
{ var ko, jQuery; }
})(function (ko, $) {
  var ITEMKEY = "ko_sortItem",
    INDEXKEY = "ko_sourceIndex",
    LISTKEY = "ko_sortList",
    PARENTKEY = "ko_parentList",
    DRAGKEY = "ko_dragItem",
    unwrap = ko.utils.unwrapObservable,
    dataGet = ko.utils.domData.get,
    dataSet = ko.utils.domData.set,
    version = $.ui && $.ui.version,
    //1.8.24 included a fix for how events were triggered in nested sortables. indexOf checks will fail if version starts with that value (0 vs. -1)
    hasNestedSortableFix = version && version.indexOf("1.6.") && version.indexOf("1.7.") && (version.indexOf("1.8.") || version === "1.8.24");

  //internal afterRender that adds meta-data to children
  var addMetaDataAfterRender = function addMetaDataAfterRender(elements, data) {
    ko.utils.arrayForEach(elements, function (element) {
      if (element.nodeType === 1) {
        dataSet(element, ITEMKEY, data);
        dataSet(element, PARENTKEY, dataGet(element.parentNode, LISTKEY));
      }
    });
  };

  //prepare the proper options for the template binding
  var prepareTemplateOptions = function prepareTemplateOptions(valueAccessor, dataName) {
    var result = {},
      options = {},
      actualAfterRender;

    //build our options to pass to the template engine
    if (ko.utils.peekObservable(valueAccessor()).data) {
      options = unwrap(valueAccessor() || {});
      result[dataName] = options.data;
      if (options.hasOwnProperty("template")) {
        result.name = options.template;
      }
    } else {
      result[dataName] = valueAccessor();
    }
    ko.utils.arrayForEach(["afterAdd", "afterRender", "as", "beforeRemove", "includeDestroyed", "templateEngine", "templateOptions", "nodes"], function (option) {
      if (options.hasOwnProperty(option)) {
        result[option] = options[option];
      } else if (ko.bindingHandlers.sortable.hasOwnProperty(option)) {
        result[option] = ko.bindingHandlers.sortable[option];
      }
    });

    //use an afterRender function to add meta-data
    if (dataName === "foreach") {
      if (result.afterRender) {
        //wrap the existing function, if it was passed
        actualAfterRender = result.afterRender;
        result.afterRender = function (element, data) {
          addMetaDataAfterRender.call(data, element, data);
          actualAfterRender.call(data, element, data);
        };
      } else {
        result.afterRender = addMetaDataAfterRender;
      }
    }

    //return options to pass to the template binding
    return result;
  };
  var updateIndexFromDestroyedItems = function updateIndexFromDestroyedItems(index, items) {
    var unwrapped = unwrap(items);
    if (unwrapped) {
      for (var i = 0; i <= index; i++) {
        //add one for every destroyed item we find before the targetIndex in the target array
        if (unwrapped[i] && unwrap(unwrapped[i]._destroy)) {
          index++;
        }
      }
    }
    return index;
  };

  //remove problematic leading/trailing whitespace from templates
  var stripTemplateWhitespace = function stripTemplateWhitespace(element, name) {
    var templateSource, templateElement;

    //process named templates
    if (name) {
      templateElement = document.getElementById(name);
      if (templateElement) {
        templateSource = new ko.templateSources.domElement(templateElement);
        templateSource.text($.trim(templateSource.text()));
      }
    } else {
      //remove leading/trailing non-elements from anonymous templates
      $(element).contents().each(function () {
        if (this && this.nodeType !== 1) {
          element.removeChild(this);
        }
      });
    }
  };

  //connect items with observableArrays
  ko.bindingHandlers.sortable = {
    init: function init(element, valueAccessor, allBindingsAccessor, data, context) {
      var $element = $(element),
        value = unwrap(valueAccessor()) || {},
        templateOptions = prepareTemplateOptions(valueAccessor, "foreach"),
        sortable = {},
        startActual,
        updateActual;
      stripTemplateWhitespace(element, templateOptions.name);

      //build a new object that has the global options with overrides from the binding
      $.extend(true, sortable, ko.bindingHandlers.sortable);
      if (value.options && sortable.options) {
        ko.utils.extend(sortable.options, value.options);
        delete value.options;
      }
      ko.utils.extend(sortable, value);

      //if allowDrop is an observable or a function, then execute it in a computed observable
      if (sortable.connectClass && (ko.isObservable(sortable.allowDrop) || typeof sortable.allowDrop == "function")) {
        ko.computed({
          read: function read() {
            var value = unwrap(sortable.allowDrop),
              shouldAdd = typeof value == "function" ? value.call(this, templateOptions.foreach) : value;
            ko.utils.toggleDomNodeCssClass(element, sortable.connectClass, shouldAdd);
          },
          disposeWhenNodeIsRemoved: element
        }, this);
      } else {
        ko.utils.toggleDomNodeCssClass(element, sortable.connectClass, sortable.allowDrop);
      }

      //wrap the template binding
      ko.bindingHandlers.template.init(element, function () {
        return templateOptions;
      }, allBindingsAccessor, data, context);

      //keep a reference to start/update functions that might have been passed in
      startActual = sortable.options.start;
      updateActual = sortable.options.update;

      //ensure draggable table row cells maintain their width while dragging (unless a helper is provided)
      if (!sortable.options.helper) {
        sortable.options.helper = function (e, ui) {
          if (ui.is("tr")) {
            ui.children().each(function () {
              $(this).width($(this).width());
            });
          }
          return ui;
        };
      }

      //initialize sortable binding after template binding has rendered in update function
      var createTimeout = setTimeout(function () {
        var dragItem;
        var originalReceive = sortable.options.receive;
        $element.sortable(ko.utils.extend(sortable.options, {
          start: function start(event, ui) {
            //track original index
            var el = ui.item[0];
            dataSet(el, INDEXKEY, ko.utils.arrayIndexOf(ui.item.parent().children(), el));

            //make sure that fields have a chance to update model
            ui.item.find("input:focus").change();
            if (startActual) {
              startActual.apply(this, arguments);
            }
          },
          receive: function receive(event, ui) {
            //optionally apply an existing receive handler
            if (typeof originalReceive === "function") {
              originalReceive.call(this, event, ui);
            }
            dragItem = dataGet(ui.item[0], DRAGKEY);
            if (dragItem) {
              //copy the model item, if a clone option is provided
              if (dragItem.clone) {
                dragItem = dragItem.clone();
              }

              //configure a handler to potentially manipulate item before drop
              if (sortable.dragged) {
                dragItem = sortable.dragged.call(this, dragItem, event, ui) || dragItem;
              }
            }
          },
          update: function update(event, ui) {
            var sourceParent,
              targetParent,
              sourceIndex,
              targetIndex,
              arg,
              el = ui.item[0],
              parentEl = ui.item.parent()[0],
              item = dataGet(el, ITEMKEY) || dragItem;
            if (!item) {
              $(el).remove();
            }
            dragItem = null;

            //make sure that moves only run once, as update fires on multiple containers
            if (item && this === parentEl || !hasNestedSortableFix && $.contains(this, parentEl)) {
              //identify parents
              sourceParent = dataGet(el, PARENTKEY);
              sourceIndex = dataGet(el, INDEXKEY);
              targetParent = dataGet(el.parentNode, LISTKEY);
              targetIndex = ko.utils.arrayIndexOf(ui.item.parent().children(), el);

              //take destroyed items into consideration
              if (!templateOptions.includeDestroyed) {
                sourceIndex = updateIndexFromDestroyedItems(sourceIndex, sourceParent);
                targetIndex = updateIndexFromDestroyedItems(targetIndex, targetParent);
              }

              //build up args for the callbacks
              if (sortable.beforeMove || sortable.afterMove) {
                arg = {
                  item: item,
                  sourceParent: sourceParent,
                  sourceParentNode: sourceParent && ui.sender || el.parentNode,
                  sourceIndex: sourceIndex,
                  targetParent: targetParent,
                  targetIndex: targetIndex,
                  cancelDrop: false
                };

                //execute the configured callback prior to actually moving items
                if (sortable.beforeMove) {
                  sortable.beforeMove.call(this, arg, event, ui);
                }
              }

              //call cancel on the correct list, so KO can take care of DOM manipulation
              if (sourceParent) {
                $(sourceParent === targetParent ? this : ui.sender || this).sortable("cancel");
              }
              //for a draggable item just remove the element
              else {
                $(el).remove();
              }

              //if beforeMove told us to cancel, then we are done
              if (arg && arg.cancelDrop) {
                return;
              }

              //if the strategy option is unset or false, employ the order strategy involving removal and insertion of items
              if (!sortable.hasOwnProperty("strategyMove") || sortable.strategyMove === false) {
                //do the actual move
                if (targetIndex >= 0) {
                  if (sourceParent) {
                    sourceParent.splice(sourceIndex, 1);

                    //if using deferred updates plugin, force updates
                    if (ko.processAllDeferredBindingUpdates) {
                      ko.processAllDeferredBindingUpdates();
                    }

                    //if using deferred updates on knockout 3.4, force updates
                    if (ko.options && ko.options.deferUpdates) {
                      ko.tasks.runEarly();
                    }
                  }
                  targetParent.splice(targetIndex, 0, item);
                }

                //rendering is handled by manipulating the observableArray; ignore dropped element
                dataSet(el, ITEMKEY, null);
              } else {
                //employ the strategy of moving items
                if (targetIndex >= 0) {
                  if (sourceParent) {
                    if (sourceParent !== targetParent) {
                      // moving from one list to another

                      sourceParent.splice(sourceIndex, 1);
                      targetParent.splice(targetIndex, 0, item);

                      //rendering is handled by manipulating the observableArray; ignore dropped element
                      dataSet(el, ITEMKEY, null);
                      ui.item.remove();
                    } else {
                      // moving within same list
                      var underlyingList = unwrap(sourceParent);

                      // notify 'beforeChange' subscribers
                      if (sourceParent.valueWillMutate) {
                        sourceParent.valueWillMutate();
                      }

                      // move from source index ...
                      underlyingList.splice(sourceIndex, 1);
                      // ... to target index
                      underlyingList.splice(targetIndex, 0, item);

                      // notify subscribers
                      if (sourceParent.valueHasMutated) {
                        sourceParent.valueHasMutated();
                      }
                    }
                  } else {
                    // drop new element from outside
                    targetParent.splice(targetIndex, 0, item);

                    //rendering is handled by manipulating the observableArray; ignore dropped element
                    dataSet(el, ITEMKEY, null);
                    ui.item.remove();
                  }
                }
              }

              //if using deferred updates plugin, force updates
              if (ko.processAllDeferredBindingUpdates) {
                ko.processAllDeferredBindingUpdates();
              }

              //allow binding to accept a function to execute after moving the item
              if (sortable.afterMove) {
                sortable.afterMove.call(this, arg, event, ui);
              }
            }
            if (updateActual) {
              updateActual.apply(this, arguments);
            }
          },
          connectWith: sortable.connectClass ? "." + sortable.connectClass : false
        }));

        //handle enabling/disabling sorting
        if (sortable.isEnabled !== undefined) {
          ko.computed({
            read: function read() {
              $element.sortable(unwrap(sortable.isEnabled) ? "enable" : "disable");
            },
            disposeWhenNodeIsRemoved: element
          });
        }
      }, 0);

      //handle disposal
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        //only call destroy if sortable has been created
        if ($element.data("ui-sortable") || $element.data("sortable")) {
          $element.sortable("destroy");
        }
        ko.utils.toggleDomNodeCssClass(element, sortable.connectClass, false);

        //do not create the sortable if the element has been removed from DOM
        clearTimeout(createTimeout);
      });
      return {
        'controlsDescendantBindings': true
      };
    },
    update: function update(element, valueAccessor, allBindingsAccessor, data, context) {
      var templateOptions = prepareTemplateOptions(valueAccessor, "foreach");

      //attach meta-data
      dataSet(element, LISTKEY, templateOptions.foreach);

      //call template binding's update with correct options
      ko.bindingHandlers.template.update(element, function () {
        return templateOptions;
      }, allBindingsAccessor, data, context);
    },
    connectClass: 'ko_container',
    allowDrop: true,
    afterMove: null,
    beforeMove: null,
    options: {}
  };

  //create a draggable that is appropriate for dropping into a sortable
  // ko.bindingHandlers.draggable = {
  //     init: function(element, valueAccessor, allBindingsAccessor, data, context) {
  //         var value = unwrap(valueAccessor()) || {},
  //             options = value.options || {},
  //             draggableOptions = ko.utils.extend({}, ko.bindingHandlers.draggable.options),
  //             templateOptions = prepareTemplateOptions(valueAccessor, "data"),
  //             connectClass = value.connectClass || ko.bindingHandlers.draggable.connectClass,
  //             isEnabled = value.isEnabled !== undefined ? value.isEnabled : ko.bindingHandlers.draggable.isEnabled;

  //         value = "data" in value ? value.data : value;

  //         //set meta-data
  //         dataSet(element, DRAGKEY, value);

  //         //override global options with override options passed in
  //         ko.utils.extend(draggableOptions, options);

  //         //setup connection to a sortable
  //         draggableOptions.connectToSortable = connectClass ? "." + connectClass : false;

  //         //initialize draggable
  //         $(element).draggable(draggableOptions);

  //         //handle enabling/disabling sorting
  //         if (isEnabled !== undefined) {
  //             ko.computed({
  //                 read: function() {
  //                     $(element).draggable(unwrap(isEnabled) ? "enable" : "disable");
  //                 },
  //                 disposeWhenNodeIsRemoved: element
  //             });
  //         }

  //         //handle disposal
  //         ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
  //             $(element).draggable("destroy");
  //         });

  //         return ko.bindingHandlers.template.init(element, function() { return templateOptions; }, allBindingsAccessor, data, context);
  //     },
  //     update: function(element, valueAccessor, allBindingsAccessor, data, context) {
  //         var templateOptions = prepareTemplateOptions(valueAccessor, "data");

  //         return ko.bindingHandlers.template.update(element, function() { return templateOptions; }, allBindingsAccessor, data, context);
  //     },
  //     connectClass: ko.bindingHandlers.sortable.connectClass,
  //     options: {
  //         helper: "clone"
  //     }
  // };

  // // Simple Droppable Implementation
  // // binding that updates (function or observable)
  // ko.bindingHandlers.droppable = {
  //     init: function(element, valueAccessor, allBindingsAccessor, data, context) {
  //         var value = unwrap(valueAccessor()) || {},
  //             options = value.options || {},
  //             droppableOptions = ko.utils.extend({}, ko.bindingHandlers.droppable.options),
  //             isEnabled = value.isEnabled !== undefined ? value.isEnabled : ko.bindingHandlers.droppable.isEnabled;

  //         //override global options with override options passed in
  //         ko.utils.extend(droppableOptions, options);

  //         //get reference to drop method
  //         value = "data" in value ? value.data : valueAccessor();

  //         //set drop method
  //         droppableOptions.drop = function(event, ui) {
  //             var droppedItem = dataGet(ui.draggable[0], DRAGKEY) || dataGet(ui.draggable[0], ITEMKEY);
  //             value(droppedItem);
  //         };

  //         //initialize droppable
  //         $(element).droppable(droppableOptions);

  //         //handle enabling/disabling droppable
  //         if (isEnabled !== undefined) {
  //             ko.computed({
  //                 read: function() {
  //                     $(element).droppable(unwrap(isEnabled) ? "enable": "disable");
  //                 },
  //                 disposeWhenNodeIsRemoved: element
  //             });
  //         }

  //         //handle disposal
  //         ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
  //             $(element).droppable("destroy");
  //         });
  //     },
  //     options: {
  //         accept: "*"
  //     }
  // };
});

/***/ }),

/***/ "ZYTm":
/*!****************************************************************!*\
  !*** ./modules/MailWebclient/js/popups/CreateIdentityPopup.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  CIdentityModel = __webpack_require__(/*! modules/MailWebclient/js/models/CIdentityModel.js */ "JI31"),
  CIdentitySettingsFormView = __webpack_require__(/*! modules/MailWebclient/js/views/settings/CIdentitySettingsFormView.js */ "l21M");

/**
 * @constructor
 */
function CCreateIdentityPopup() {
  CAbstractPopup.call(this);
  this.oIdentitySettingsFormView = new CIdentitySettingsFormView(this, true);
}
_.extendOwn(CCreateIdentityPopup.prototype, CAbstractPopup.prototype);
CCreateIdentityPopup.prototype.PopupTemplate = 'MailWebclient_Settings_CreateIdentityPopup';

/**
 * @param {number} iAccountId
 */
CCreateIdentityPopup.prototype.onOpen = function (iAccountId) {
  var oAccount = AccountList.getAccount(iAccountId),
    oIdentity = new CIdentityModel();
  oIdentity.accountId(iAccountId);
  oIdentity.email(oAccount.email());
  this.oIdentitySettingsFormView.onShow(oIdentity);
  this.oIdentitySettingsFormView.populate();
  this.oIdentitySettingsFormView.friendlyNameHasFocus(true);
};
module.exports = new CCreateIdentityPopup();

/***/ }),

/***/ "bOgC":
/*!******************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/settings/SignatureSettingsFormView.js ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  Browser = __webpack_require__(/*! modules/CoreWebclient/js/Browser.js */ "/Odb"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CoreAjax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  EditorUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Editor.js */ "PV2F"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  CHtmlEditorView = EditorUtils.getCHtmlEditorView();

/**
 * @constructor
 */
function CSignatureSettingsFormView() {
  CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
  this.fetcherOrIdentity = ko.observable(null);
  this.useSignatureRadio = ko.observable(Enums.UseSignature.Off);
  this.signature = ko.observable('');
  this.oHtmlEditor = new CHtmlEditorView(true, false);
  this.oHtmlEditor.textFocused.subscribe(function () {
    if (this.oHtmlEditor.textFocused()) {
      this.useSignatureRadio(Enums.UseSignature.On);
    }
  }, this);
  this.enableImageDragNDrop = ko.observable(false);
  this.allowEditSignature = ko.observable(true);
  ko.computed(function () {
    this.oHtmlEditor.setInactive(!this.allowEditSignature() || this.useSignatureRadio() === Enums.UseSignature.Off);
  }, this);
  this.saveCommand = Utils.createCommand(this, this.save, this.allowEditSignature);
}
_.extendOwn(CSignatureSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CSignatureSettingsFormView.prototype.ViewTemplate = 'MailWebclient_Settings_SignatureSettingsFormView';
CSignatureSettingsFormView.prototype.ViewConstructorName = 'CSignatureSettingsFormView';

/**
 * @param {Object} oFetcherOrIdentity
 */
CSignatureSettingsFormView.prototype.onShow = function (oFetcherOrIdentity) {
  this.fetcherOrIdentity(oFetcherOrIdentity || null);
  this.populate();
  _.defer(_.bind(this.init, this));
};
CSignatureSettingsFormView.prototype.init = function () {
  this.oHtmlEditor.setDisableEdit(false);
  this.oHtmlEditor.init(this.signature(), false, '', TextUtils.i18n('MAILWEBCLIENT/LABEL_ENTER_SIGNATURE_HERE'));
  this.enableImageDragNDrop(this.oHtmlEditor.isDragAndDropSupported() && !Browser.ie10AndAbove);
  this.oHtmlEditor.setDisableEdit(!this.allowEditSignature());
  this.updateSavedState();
};
CSignatureSettingsFormView.prototype.getCurrentValues = function () {
  if (this.oHtmlEditor.isInitialized()) {
    this.signature(this.oHtmlEditor.getText());
  }
  return [this.useSignatureRadio(), this.signature()];
};
CSignatureSettingsFormView.prototype.revert = function () {
  this.populate();
};
CSignatureSettingsFormView.prototype.getParametersForSave = function () {
  this.signature(this.oHtmlEditor.getText());
  var oEditAccount = AccountList.getEdited(),
    iAccountId = this.fetcherOrIdentity() ? this.fetcherOrIdentity().accountId() : oEditAccount ? oEditAccount.id() : 0,
    oParameters = {
      'AccountID': iAccountId,
      'UseSignature': this.useSignatureRadio() === Enums.UseSignature.On,
      'Signature': this.signature()
    };
  if (this.fetcherOrIdentity()) {
    if (this.fetcherOrIdentity().FETCHER) {
      _.extendOwn(oParameters, {
        'FetcherId': this.fetcherOrIdentity().id()
      });
    } else if (this.fetcherOrIdentity().ALIAS) {
      _.extendOwn(oParameters, {
        'AliasId': this.fetcherOrIdentity().id()
      });
    } else if (!this.fetcherOrIdentity().bAccountPart) {
      _.extendOwn(oParameters, {
        'IdentityId': this.fetcherOrIdentity().id()
      });
    }
  }
  return oParameters;
};

/**
 * @param {Object} oParameters
 */
CSignatureSettingsFormView.prototype.applySavedValues = function (oParameters) {
  if (oParameters.FetcherId) {
    AccountList.populateFetchers();
  } else if (oParameters.AliasId) {
    AccountList.populateAliases();
  } else if (oParameters.IdentityId) {
    AccountList.populateIdentities();
  } else if (oParameters.AccountID) {
    this.populateAccountSignature(oParameters.AccountID);
  }
};

/**
 * @param {int} AccountId
 */
CSignatureSettingsFormView.prototype.populateAccountSignature = function (AccountId) {
  Ajax.send('GetAccount', {
    'AccountId': AccountId
  }, function (oResponse) {
    if (oResponse.Result) {
      var oAccount = AccountList.getAccount(AccountId);
      if (oAccount) {
        oAccount.useSignature(!!oResponse.Result.UseSignature);
        oAccount.signature(oResponse.Result.Signature);
      }
    }
  });
};
CSignatureSettingsFormView.prototype.populate = function () {
  var accountId = this.fetcherOrIdentity() ? this.fetcherOrIdentity().accountId() : AccountList.editedId(),
    identityIsAccountPart = this.fetcherOrIdentity() ? this.fetcherOrIdentity().bAccountPart : false,
    account = AccountList.getAccount(accountId),
    objWithSignature = this.fetcherOrIdentity() || account;
  if (objWithSignature) {
    this.useSignatureRadio(objWithSignature.useSignature() ? Enums.UseSignature.On : Enums.UseSignature.Off);
    this.signature(objWithSignature.signature());
    this.oHtmlEditor.setDisableEdit(false);
    this.oHtmlEditor.setText(this.signature());
    this.allowEditSignature(account && account.bAllowEditSignature || !identityIsAccountPart);
    this.oHtmlEditor.setDisableEdit(!this.allowEditSignature());
  }
  this.updateSavedState();
};
CSignatureSettingsFormView.prototype.save = function () {
  this.isSaving(true);
  this.updateSavedState();
  if (this.fetcherOrIdentity() && this.fetcherOrIdentity().FETCHER) {
    CoreAjax.send(Settings.FetchersServerModuleName, 'UpdateSignature', this.getParametersForSave(), this.onResponse, this);
  } else if (this.fetcherOrIdentity() && this.fetcherOrIdentity().ALIAS) {
    CoreAjax.send(Settings.AliasesServerModuleName, 'UpdateSignature', this.getParametersForSave(), this.onResponse, this);
  } else {
    Ajax.send('UpdateSignature', this.getParametersForSave(), this.onResponse, this);
  }
};

/**
 * Parses the response from the server. If the settings are normally stored, then updates them. 
 * Otherwise an error message.
 * 
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CSignatureSettingsFormView.prototype.onResponse = function (oResponse, oRequest) {
  this.isSaving(false);
  if (oResponse.Result) {
    this.applySavedValues(oRequest.Parameters);
    Screens.showReport(TextUtils.i18n('COREWEBCLIENT/REPORT_SETTINGS_UPDATE_SUCCESS'));
  } else {
    Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_SAVING_SETTINGS_FAILED'));
  }
};
module.exports = new CSignatureSettingsFormView();

/***/ }),

/***/ "cVoG":
/*!*****************************************************************!*\
  !*** ./modules/MailWebclient/js/views/CServerPropertiesView.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9");

/**
 * @constructor
 * 
 * @param {number} iDefaultPort
 * @param {number} iDefaultSslPort
 * @param {string} sId
 * @param {string} sLabel
 * @param {function} koDefaultServerValue
 */
function CServerPropertiesView(iDefaultPort, iDefaultSslPort, sId, sLabel, koDefaultServerValue) {
  this.server = ko.observable('');
  this.server.focused = ko.observable(false);
  this.label = sLabel;
  this.defaultPort = ko.observable(iDefaultPort);
  this.defaultSslPort = ko.observable(iDefaultSslPort);
  this.port = ko.observable(iDefaultPort);
  this.port.focused = ko.observable(false);
  this.ssl = ko.observable(false);
  this.isEnabled = ko.observable(true);
  this.id = sId;
  if (_.isFunction(koDefaultServerValue)) {
    koDefaultServerValue.focused.subscribe(function () {
      if (!koDefaultServerValue.focused() && this.server() === '') {
        this.server(koDefaultServerValue());
      }
    }, this);
  }
  this.ssl.subscribe(function () {
    var iPort = Types.pInt(this.port());
    if (this.ssl()) {
      if (iPort === this.defaultPort()) {
        this.port(this.defaultSslPort());
      }
    } else {
      if (iPort === this.defaultSslPort()) {
        this.port(this.defaultPort());
      }
    }
  }, this);
}

/**
 * @param {string} sServer
 * @param {number} iPort
 * @param {boolean} bSsl
 */
CServerPropertiesView.prototype.set = function (sServer, iPort, bSsl) {
  this.server(sServer);
  this.ssl(bSsl);
  this.port(iPort);
};
CServerPropertiesView.prototype.clear = function () {
  this.server('');
  this.ssl(false);
  this.port(this.defaultPort());
};
CServerPropertiesView.prototype.getIntPort = function () {
  return Types.pInt(this.port());
};
CServerPropertiesView.prototype.parentSave = function (koCurrentField, aParents) {
  if (koCurrentField.focused) {
    koCurrentField.focused(false);
  }
  var oParent = _.find(aParents, function (oTmpParent) {
    return _.isFunction(oTmpParent.save);
  });
  if (oParent) {
    oParent.save();
  }
};
module.exports = CServerPropertiesView;

/***/ }),

/***/ "dBPG":
/*!************************************************!*\
  !*** ./modules/MailWebclient/js/koBindings.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  ComposeMessageToAddressesFunc = ModulesManager.run('MailWebclient', 'getComposeMessageToAddresses');
if (_.isFunction(ComposeMessageToAddressesFunc)) {
  ko.bindingHandlers.makeLinkComposeMailTo = {
    'update': function update(oElement, fValueAccessor, fAllBindingsAccessor, oViewModel, bindingContext) {
      var $Element = $(oElement),
        sFullEmail = fValueAccessor();
      $Element.show();
      if (!$Element.hasClass('button')) {
        $Element.addClass('link');
      }
      $Element.click(function () {
        ComposeMessageToAddressesFunc(sFullEmail);
      });
    }
  };
}
ko.bindingHandlers.moveToFolderFilter = {
  'init': function init(oElement, fValueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    var jqElement = $(oElement),
      oCommand = fValueAccessor(),
      jqContainer = $(oElement).find(oCommand['container']),
      aOptions = _.isArray(oCommand['options']) ? oCommand['options'] : oCommand['options'](),
      sFolderName = oCommand['value'] ? oCommand['value']() : '',
      oFolderOption = _.find(aOptions, function (oOption) {
        return oOption[oCommand['optionsValue']] === sFolderName;
      });
    if (!oFolderOption) {
      sFolderName = '';
      oCommand['value']('');
    }
    jqElement.removeClass('expand');
    jqContainer.empty();
    _.each(aOptions, function (oOption) {
      var jqOption = $('<span class="item"></span>').text(oOption[oCommand['optionsText']]).data('value', oOption[oCommand['optionsValue']]);
      if (sFolderName === oOption[oCommand['optionsValue']]) {
        jqOption.addClass('selected');
      }
      oOption['jq'] = jqOption;
      jqContainer.append(jqOption);
    });
    jqContainer.on('click', '.item', function () {
      var sFolderName = $(this).data('value');
      oCommand['value'](sFolderName);
    });
    jqElement.click(function () {
      jqElement.toggleClass('expand');
      if (jqElement.hasClass('expand')) {
        _.defer(function () {
          $(document).one('click', function () {
            jqElement.removeClass('expand');
          });
        });
      }
    });
  },
  'update': function update(oElement, fValueAccessor) {
    var jqElement = $(oElement),
      oCommand = fValueAccessor(),
      aOptions = _.isArray(oCommand['options']) ? oCommand['options'] : oCommand['options'](),
      sFolderName = oCommand['value'] ? oCommand['value']() : '',
      oFolderOption = _.find(aOptions, function (oOption) {
        return oOption[oCommand['optionsValue']] === sFolderName;
      }),
      jqText = jqElement.find('.link');
    _.each(aOptions, function (oOption) {
      if (oOption['jq']) {
        oOption['jq'].toggleClass('selected', sFolderName === oOption[oCommand['optionsValue']]);
      }
    });
    if (oFolderOption) {
      jqText.text($.trim(oFolderOption[oCommand['optionsText']]));
    }
  }
};

/***/ }),

/***/ "guPB":
/*!******************************************************************!*\
  !*** ./modules/MailWebclient/js/popups/SetSystemFoldersPopup.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  MailCache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z");

/**
 * @constructor
 */
function CSetSystemFoldersPopup() {
  CAbstractPopup.call(this);
  this.folders = MailCache.editedFolderList;
  this.sentFolderFullName = ko.observable('');
  this.draftsFolderFullName = ko.observable('');
  this.spamFolderFullName = ko.observable('');
  this.trashFolderFullName = ko.observable('');
  this.options = ko.observableArray([]);
  this.defaultOptionsAfterRender = Utils.defaultOptionsAfterRender;
  this.bAllowSpamFolderEditing = Settings.AllowSpamFolder;
}
_.extendOwn(CSetSystemFoldersPopup.prototype, CAbstractPopup.prototype);
CSetSystemFoldersPopup.prototype.PopupTemplate = 'MailWebclient_Settings_SetSystemFoldersPopup';
CSetSystemFoldersPopup.prototype.onOpen = function () {
  var oFolderList = MailCache.editedFolderList();
  this.options(oFolderList.getOptions(TextUtils.i18n('MAILWEBCLIENT/LABEL_NO_FOLDER_USAGE_ASSIGNED'), false, false, false));
  this.sentFolderFullName(oFolderList.sentFolderFullName());
  this.draftsFolderFullName(oFolderList.draftsFolderFullName());
  if (Settings.AllowSpamFolder) {
    this.spamFolderFullName(oFolderList.spamFolderFullName());
  }
  this.trashFolderFullName(oFolderList.trashFolderFullName());
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CSetSystemFoldersPopup.prototype.onResponseFoldersSetupSystem = function (oResponse, oRequest) {
  if (oResponse.Result === false) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('MAILWEBCLIENT/ERROR_SETUP_SPECIAL_FOLDERS'));
    MailCache.getFolderList(AccountList.editedId());
  }
};
CSetSystemFoldersPopup.prototype.apply = function () {
  var oFolderList = MailCache.editedFolderList(),
    bHasChanges = false,
    oParameters = null;
  if (this.sentFolderFullName() !== oFolderList.sentFolderFullName()) {
    oFolderList.sentFolderFullName(this.sentFolderFullName());
    bHasChanges = true;
  }
  if (this.draftsFolderFullName() !== oFolderList.draftsFolderFullName()) {
    oFolderList.draftsFolderFullName(this.draftsFolderFullName());
    bHasChanges = true;
  }
  if (Settings.AllowSpamFolder && this.spamFolderFullName() !== oFolderList.spamFolderFullName()) {
    oFolderList.spamFolderFullName(this.spamFolderFullName());
    bHasChanges = true;
  }
  if (this.trashFolderFullName() !== oFolderList.trashFolderFullName()) {
    oFolderList.trashFolderFullName(this.trashFolderFullName());
    bHasChanges = true;
  }
  if (bHasChanges) {
    oParameters = {
      'AccountID': AccountList.editedId(),
      'Sent': oFolderList.sentFolderFullName(),
      'Drafts': oFolderList.draftsFolderFullName(),
      'Trash': oFolderList.trashFolderFullName(),
      'Spam': oFolderList.spamFolderFullName()
    };
    Ajax.send('SetupSystemFolders', oParameters, this.onResponseFoldersSetupSystem, this);
  }
  this.closePopup();
};
module.exports = new CSetSystemFoldersPopup();

/***/ }),

/***/ "jSiL":
/*!*************************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/settings/CFetcherIncomingSettingsFormView.js ***!
  \*************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CoreAjax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "MYiO"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  MailCache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  CServerPropertiesView = __webpack_require__(/*! modules/MailWebclient/js/views/CServerPropertiesView.js */ "cVoG");

/**
 * @constructor
 * @param {object} oParent
 */
function CFetcherIncomingSettingsFormView(oParent) {
  CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
  this.oParent = oParent;
  this.bShown = false;
  this.fetcher = ko.observable(null);
  this.idFetcher = ko.observable(null);
  this.isEnabled = ko.observable(true);
  this.incomingLogin = ko.observable('');
  this.sFakePass = '******';
  this.incomingPassword = ko.observable(this.sFakePass);
  this.oIncoming = new CServerPropertiesView(110, 995, 'fetcher_edit_incoming', TextUtils.i18n('MAILWEBCLIENT/LABEL_POP3_SERVER'));
  this.sFetcherFolder = '';
  this.folder = ko.observable('');
  this.options = ko.observableArray([]);
  MailCache.folderList.subscribe(function () {
    this.populateOptions();
  }, this);
  this.leaveMessagesOnServer = ko.observable(false);
  this.passwordIsSelected = ko.observable(false);
  this.defaultOptionsAfterRender = Utils.defaultOptionsAfterRender;
  this.fetcherIntervalHint = ko.computed(function () {
    var iCheckIntervalMinutes = this.fetcher() ? this.fetcher().iCheckIntervalMinutes : 0;
    if (iCheckIntervalMinutes !== 0) {
      return TextUtils.i18n('MAILWEBCLIENT/INFO_POP3_FETCHER_PLURAL', {
        'INTERVAL': iCheckIntervalMinutes
      }, null, iCheckIntervalMinutes);
    }
    return '';
  }, this);
}
_.extendOwn(CFetcherIncomingSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CFetcherIncomingSettingsFormView.prototype.ViewTemplate = 'MailWebclient_Settings_FetcherIncomingSettingsFormView';

/**
 * @param {Object} oFetcher
 */
CFetcherIncomingSettingsFormView.prototype.onShow = function (oFetcher) {
  this.fetcher(oFetcher && oFetcher.FETCHER ? oFetcher : null);
  this.populateOptions();
  this.populate();
};

/**
 * @param {Function} fShowNewTab
 */
CFetcherIncomingSettingsFormView.prototype.hide = function (fShowNewTab) {
  this.bShown = false;
  fShowNewTab();
};
CFetcherIncomingSettingsFormView.prototype.populateOptions = function () {
  if (this.bShown) {
    this.options(MailCache.folderList().getOptions('', true, false, false));
    if (this.sFetcherFolder !== this.folder()) {
      this.folder(this.sFetcherFolder);
      this.updateSavedState();
    }
  }
};
CFetcherIncomingSettingsFormView.prototype.getCurrentValues = function () {
  return [this.isEnabled(), this.oIncoming.server(), this.oIncoming.port(), this.oIncoming.ssl(), this.incomingPassword(), this.folder(), this.leaveMessagesOnServer()];
};
CFetcherIncomingSettingsFormView.prototype.getParametersForSave = function () {
  if (this.fetcher()) {
    var sIncomingPassword = $.trim(this.incomingPassword()),
      oParameters = {
        'FetcherId': this.idFetcher(),
        'IsEnabled': this.isEnabled(),
        'Folder': this.folder(),
        'IncomingServer': this.oIncoming.server(),
        'IncomingPort': this.oIncoming.getIntPort(),
        'IncomingUseSsl': this.oIncoming.ssl(),
        'LeaveMessagesOnServer': this.leaveMessagesOnServer()
      };
    if (sIncomingPassword !== '' && sIncomingPassword !== this.sFakePass) {
      oParameters['IncomingPassword'] = sIncomingPassword;
    }
    return oParameters;
  }
  return {};
};
CFetcherIncomingSettingsFormView.prototype.save = function () {
  if (this.isEmptyRequiredFields()) {
    Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_REQUIRED_FIELDS_EMPTY'));
  } else {
    this.isSaving(true);
    this.updateSavedState();
    CoreAjax.send(Settings.FetchersServerModuleName, 'UpdateFetcher', this.getParametersForSave(), this.onResponse, this);
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CFetcherIncomingSettingsFormView.prototype.onResponse = function (oResponse, oRequest) {
  this.isSaving(false);
  if (!oResponse.Result) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_UNKNOWN'));
  } else {
    AccountList.populateFetchers();
    Screens.showReport(TextUtils.i18n('MAILWEBCLIENT/REPORT_SUCCESSFULLY_SAVED'));
  }
};
CFetcherIncomingSettingsFormView.prototype.populate = function () {
  var oFetcher = this.fetcher();
  if (oFetcher) {
    this.sFetcherFolder = oFetcher.folder();
    this.idFetcher(oFetcher.id());
    this.isEnabled(oFetcher.isEnabled());
    this.folder(oFetcher.folder());
    this.oIncoming.set(oFetcher.incomingServer(), oFetcher.incomingPort(), oFetcher.incomingUseSsl());
    this.incomingLogin(oFetcher.incomingLogin());
    this.incomingPassword(this.sFakePass);
    this.leaveMessagesOnServer(oFetcher.leaveMessagesOnServer());
    this.updateSavedState();
  }
};
CFetcherIncomingSettingsFormView.prototype.isEmptyRequiredFields = function () {
  if (this.oIncoming.server() === '') {
    this.oIncoming.server.focused(true);
    return true;
  }
  if ($.trim(this.incomingPassword()) === '') {
    this.passwordIsSelected(true);
    return true;
  }
  return false;
};
CFetcherIncomingSettingsFormView.prototype.remove = function () {
  var oFetcher = this.fetcher(),
    fCallBack = function (bOkAnswer) {
      if (bOkAnswer) {
        var oParameters = {
          'FetcherId': oFetcher.id()
        };
        CoreAjax.send(Settings.FetchersServerModuleName, 'DeleteFetcher', oParameters, this.onAccountDeleteFetcherResponse, this);
        if (this.oParent && _.isFunction(this.oParent.onRemoveFetcher)) {
          this.oParent.onRemoveFetcher();
        }
      }
    }.bind(this);
  if (oFetcher) {
    Popups.showPopup(ConfirmPopup, [TextUtils.i18n('MAILWEBCLIENT/CONFIRM_REMOVE_FETCHER'), fCallBack, oFetcher.incomingLogin()]);
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CFetcherIncomingSettingsFormView.prototype.onAccountDeleteFetcherResponse = function (oResponse, oRequest) {
  if (!oResponse.Result) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('MAILWEBCLIENT/ERROR_FETCHER_DELETING'));
  }
  AccountList.populateFetchers();
};
module.exports = CFetcherIncomingSettingsFormView;

/***/ }),

/***/ "k0bD":
/*!**************************************************************!*\
  !*** ./modules/MailWebclient/js/popups/CreateFolderPopup.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  MailCache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8");

/**
 * @constructor
 */
function CCreateFolderPopup() {
  CAbstractPopup.call(this);
  this.isCreating = ko.observable(false);
  MailCache.folderListLoading.subscribe(function () {
    var bListLoading = MailCache.folderListLoading.indexOf(MailCache.editedFolderList().iAccountId) !== -1;
    if (!bListLoading && this.isCreating()) {
      if (_.isFunction(this.fCallback)) {
        this.fCallback(this.folderName(), this.parentFolder());
      }
      this.isCreating(false);
      this.closePopup();
    }
  }, this);
  this.options = ko.observableArray([]);
  this.parentFolder = ko.observable('');
  this.folderName = ko.observable('');
  this.folderNameFocus = ko.observable(false);
  this.fCallback = null;
  this.defaultOptionsAfterRender = Utils.defaultOptionsAfterRender;
}
_.extendOwn(CCreateFolderPopup.prototype, CAbstractPopup.prototype);
CCreateFolderPopup.prototype.PopupTemplate = 'MailWebclient_Settings_CreateFolderPopup';

/**
 * @param {Function} fCallback
 */
CCreateFolderPopup.prototype.onOpen = function (fCallback) {
  this.options(MailCache.editedFolderList().getOptions(TextUtils.i18n('MAILWEBCLIENT/LABEL_NO_PARENT_FOLDER'), true, false, true));
  this.fCallback = fCallback;
  this.folderName('');
  this.folderNameFocus(true);
};
CCreateFolderPopup.prototype.create = function () {
  var sParentFolder = this.parentFolder() === '' ? MailCache.editedFolderList().sNamespaceFolder : this.parentFolder(),
    oParameters = {
      'AccountID': AccountList.editedId(),
      'FolderNameInUtf8': this.folderName(),
      'FolderParentFullNameRaw': sParentFolder,
      'Delimiter': MailCache.editedFolderList().sDelimiter
    };
  this.folderNameFocus(false);
  this.isCreating(true);
  Ajax.send('CreateFolder', oParameters, this.onCreateFolderResponse, this);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CCreateFolderPopup.prototype.onCreateFolderResponse = function (oResponse, oRequest) {
  if (!oResponse.Result) {
    this.isCreating(false);
    Api.showErrorByCode(oResponse, TextUtils.i18n('MAILWEBCLIENT/ERROR_CREATE_FOLDER'));
  } else {
    MailCache.getFolderList(AccountList.editedId());
  }
};
CCreateFolderPopup.prototype.cancelPopup = function () {
  if (!this.isCreating()) {
    if (_.isFunction(this.fCallback)) {
      this.fCallback('', '');
    }
    this.closePopup();
  }
};
module.exports = new CCreateFolderPopup();

/***/ }),

/***/ "l21M":
/*!******************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/settings/CIdentitySettingsFormView.js ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z");

/**
 * @constructor
 * 
 * @param {Object} oParent
 * @param {boolean} bCreate
 */
function CIdentitySettingsFormView(oParent, bCreate) {
  CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
  this.identity = ko.observable(null);
  this.oParent = oParent;
  this.bCreate = bCreate;
  this.disableCheckbox = ko.observable(false);
  this.isDefault = ko.observable(false);
  this.email = ko.observable('');
  this.emailList = ko.observableArray([]);
  this.selectedEmail = ko.observable('');
  this.disableEditEmail = ko.observable(Settings.OnlyUserEmailsInIdentities);
  this.disableRemoveIdentity = ko.observable(bCreate);
  this.friendlyName = ko.observable('');
  this.friendlyNameHasFocus = ko.observable(false);
}
_.extendOwn(CIdentitySettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CIdentitySettingsFormView.prototype.ViewTemplate = 'MailWebclient_Settings_IdentitySettingsFormView';
CIdentitySettingsFormView.prototype.ViewConstructorName = 'CIdentitySettingsFormView';

/**
 * @param {Object} oIdentity
 */
CIdentitySettingsFormView.prototype.onShow = function (oIdentity) {
  this.identity(oIdentity && !oIdentity.FETCHER ? oIdentity : null);
  this.populate();
};
CIdentitySettingsFormView.prototype.getCurrentValues = function () {
  return [this.friendlyName(), this.email()];
};
CIdentitySettingsFormView.prototype.getParametersForSave = function () {
  if (this.identity()) {
    var oParameters = {
      'AccountID': this.identity().accountId(),
      'Default': this.isDefault(),
      'FriendlyName': this.friendlyName(),
      'AccountPart': this.identity().bAccountPart
    };
    if (!this.identity().bAccountPart) {
      _.extendOwn(oParameters, {
        'Email': this.emailList().length > 0 ? $.trim(this.selectedEmail()) : $.trim(this.email())
      });
      if (!this.bCreate) {
        oParameters.EntityId = this.identity().id();
      }
    }
    return oParameters;
  }
  return {};
};
CIdentitySettingsFormView.prototype.save = function () {
  if ($.trim(this.email()) === '') {
    Screens.showError(Utils.i18n('MAILWEBCLIENT/ERROR_IDENTITY_FIELDS_BLANK'));
  } else {
    this.isSaving(true);
    this.updateSavedState();
    Ajax.send(this.bCreate ? 'CreateIdentity' : 'UpdateIdentity', this.getParametersForSave(), this.onResponse, this);
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CIdentitySettingsFormView.prototype.onResponse = function (oResponse, oRequest) {
  this.isSaving(false);
  if (!oResponse.Result) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('MAILWEBCLIENT/ERROR_IDENTITY_ADDING'));
  } else {
    var oParameters = oRequest.Parameters,
      iAccountId = Types.pInt(oParameters.AccountID),
      oAccount = 0 < iAccountId ? AccountList.getAccount(iAccountId) : null;
    AccountList.populateIdentities(function () {
      var oCurrAccount = AccountList.getCurrent(),
        aCurrIdentities = oCurrAccount.identities(),
        oCreatedIdentity = _.find(aCurrIdentities, function (oIdentity) {
          return oIdentity.id() === oResponse.Result;
        });
      if (oCreatedIdentity) {
        ModulesManager.run('SettingsWebclient', 'setAddHash', [['identity', oCreatedIdentity.hash()]]);
      }
    });
    if (this.bCreate && _.isFunction(this.oParent.closePopup)) {
      this.oParent.closePopup();
    }
    if (oParameters.AccountPart && oAccount) {
      oAccount.updateFriendlyName(oParameters.FriendlyName);
    }
    this.disableCheckbox(this.isDefault());
    Screens.showReport(TextUtils.i18n('COREWEBCLIENT/REPORT_SETTINGS_UPDATE_SUCCESS'));
  }
};
CIdentitySettingsFormView.prototype.populate = function () {
  var oIdentity = this.identity();
  if (oIdentity) {
    this.isDefault(oIdentity.isDefault());
    this.email(oIdentity.email());
    this.disableEditEmail(Settings.OnlyUserEmailsInIdentities || oIdentity.bAccountPart);
    this.disableRemoveIdentity(this.bCreate || oIdentity.bAccountPart);
    this.emailList([]);
    if (Settings.OnlyUserEmailsInIdentities && !oIdentity.bAccountPart) {
      var aAliases = [];
      var oAccount = AccountList.getAccount(oIdentity.accountId());
      if (oAccount) {
        aAliases = oAccount.aExtend.Aliases;
      }
      if (Types.isNonEmptyArray(aAliases)) {
        this.emailList(_.clone(aAliases));
        this.emailList.unshift(oIdentity.email());
        this.selectedEmail(oIdentity.email());
      }
    }
    this.friendlyName(oIdentity.friendlyName());
    this.disableCheckbox(oIdentity.isDefault());
    setTimeout(function () {
      this.updateSavedState();
    }.bind(this), 1);
  }
};
CIdentitySettingsFormView.prototype.remove = function () {
  if (this.identity() && !this.identity().bAccountPart) {
    var oParameters = {
      'AccountID': this.identity().accountId(),
      'EntityId': this.identity().id()
    };
    Ajax.send('DeleteIdentity', oParameters, this.onAccountIdentityDeleteResponse, this);
    if (!this.bCreate && _.isFunction(this.oParent.onRemoveIdentity)) {
      this.oParent.onRemoveIdentity();
    }
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CIdentitySettingsFormView.prototype.onAccountIdentityDeleteResponse = function (oResponse, oRequest) {
  if (!oResponse.Result) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('MAILWEBCLIENT/ERROR_IDENTITY_DELETING'));
  }
  AccountList.populateIdentities();
};
CIdentitySettingsFormView.prototype.cancel = function () {
  if (_.isFunction(this.oParent.cancelPopup)) {
    this.oParent.cancelPopup();
  }
};
module.exports = CIdentitySettingsFormView;

/***/ }),

/***/ "lsKY":
/*!***************************************************************!*\
  !*** ./modules/MailWebclient/js/popups/CreateAccountPopup.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  ValidationUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Validation.js */ "5RIG"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  CAccountModel = __webpack_require__(/*! modules/MailWebclient/js/models/CAccountModel.js */ "YmTJ"),
  CServerPairPropertiesView = __webpack_require__(/*! modules/MailWebclient/js/views/settings/CServerPairPropertiesView.js */ "qN2P");

/**
 * @constructor
 */
function CCreateAccountPopup() {
  CAbstractPopup.call(this);
  this.loading = ko.observable(false);
  this.friendlyName = ko.observable('');
  this.email = ko.observable('');
  this.email.focused = ko.observable(false);
  this.incomingLogin = ko.observable('');
  this.incomingLogin.focused = ko.observable(false);
  this.incomingPassword = ko.observable('');
  this.incomingPassword.focused = ko.observable(false);
  this.oServerPairPropertiesView = new CServerPairPropertiesView('acc_create');
  this.email.focused.subscribe(function () {
    if (!this.email.focused() && $.trim(this.incomingLogin()) === '') {
      this.incomingLogin(this.email());
    }
  }, this);
  this.aRequiredFields = [this.email, this.incomingLogin, this.incomingPassword].concat(this.oServerPairPropertiesView.aRequiredFields);
}
_.extendOwn(CCreateAccountPopup.prototype, CAbstractPopup.prototype);
CCreateAccountPopup.prototype.PopupTemplate = 'MailWebclient_Settings_CreateAccountPopup';
CCreateAccountPopup.prototype.init = function () {
  this.friendlyName('');
  this.email('');
  this.incomingLogin('');
  this.incomingLogin.focused(false);
  this.incomingPassword('');
  this.oServerPairPropertiesView.fullInit();
};

/**
 * @param {Function=} fCallback
 */
CCreateAccountPopup.prototype.onOpen = function (fCallback, sFriendlyName, sEmail, sIncomingPassword) {
  this.fCallback = fCallback;
  this.init();
  this.friendlyName(sFriendlyName);
  this.email(sEmail);
  this.incomingLogin(sEmail);
  this.incomingPassword(sIncomingPassword);
  this.focusFieldToEdit();
};
CCreateAccountPopup.prototype.focusFieldToEdit = function () {
  var koFirstEmptyField = _.find(this.aRequiredFields, function (koField) {
    return koField() === '';
  });
  if (koFirstEmptyField) {
    koFirstEmptyField.focused(true);
  } else if (this.aRequiredFields.length > 0) {
    this.aRequiredFields[0].focused(true);
  }
};
CCreateAccountPopup.prototype.onClose = function () {
  this.init();
};
CCreateAccountPopup.prototype.save = function () {
  if (ValidationUtils.checkIfFieldsEmpty(this.aRequiredFields, TextUtils.i18n('COREWEBCLIENT/ERROR_REQUIRED_FIELDS_EMPTY'))) {
    var oParameters = {
      'FriendlyName': this.friendlyName(),
      'Email': $.trim(this.email()),
      'IncomingLogin': $.trim(this.incomingLogin()),
      'IncomingPassword': $.trim(this.incomingPassword()),
      'Server': this.oServerPairPropertiesView.getParametersForSave()
    };
    this.loading(true);
    Ajax.send('CreateAccount', oParameters, this.onAccountCreateResponse, this);
  } else {
    this.loading(false);
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CCreateAccountPopup.prototype.onAccountCreateResponse = function (oResponse, oRequest) {
  this.loading(false);
  if (!oResponse.Result) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('MAILWEBCLIENT/ERROR_CREATE_ACCOUNT'));
  } else {
    var iAccountId = Types.pInt(oResponse.Result.AccountID),
      oAccount = new CAccountModel(oResponse.Result);
    AccountList.addAccount(oAccount);
    AccountList.populateIdentities();
    AccountList.changeEditedAccount(iAccountId);
    if (AccountList.collection().length === 1) {
      AccountList.changeCurrentAccount(iAccountId);
    }
    if (this.fCallback) {
      this.fCallback(iAccountId);
    }
    this.closePopup();
  }
};
module.exports = new CCreateAccountPopup();

/***/ }),

/***/ "nM5h":
/*!***********************************************************!*\
  !*** ./modules/MailWebclient/js/views/MessagePaneView.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A");
var TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "3cxN"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Pulse = __webpack_require__(/*! modules/CoreWebclient/js/Pulse.js */ "jIlg"),
  Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "ioSH"),
  Storage = __webpack_require__(/*! modules/CoreWebclient/js/Storage.js */ "oJUS"),
  UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "KIwC"),
  WindowOpener = __webpack_require__(/*! modules/CoreWebclient/js/WindowOpener.js */ "zVyH"),
  CAbstractScreenView = __webpack_require__(/*! modules/CoreWebclient/js/views/CAbstractScreenView.js */ "db2p");
var ComposeUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Compose.js */ "sXLm"),
  LinksUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Links.js */ "dpSB"),
  MailUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Mail.js */ "Panx"),
  SendingUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Sending.js */ "yHWv"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  MailCache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8"),
  MainTabExtMethods = __webpack_require__(/*! modules/MailWebclient/js/MainTabExtMethods.js */ "fcI1"),
  MessagePaneSpamButtonsController = __webpack_require__(/*! modules/MailWebclient/js/views/message/SpamButtonsView.js */ "tnf/"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  CAttachmentModel = __webpack_require__(/*! modules/MailWebclient/js/models/CAttachmentModel.js */ "3boL");
var MainTab = App.isNewTab() && window.opener && window.opener.MainTabMailMethods;

/**
 * @constructor
 */
function CMessagePaneView() {
  CAbstractScreenView.call(this, 'MailWebclient');
  this.bNewTab = App.isNewTab();
  this.isLoading = ko.observable(false);
  this.bAllowSearchMessagesBySubject = Settings.AllowSearchMessagesBySubject;
  MailCache.folderList.subscribe(this.onFolderListSubscribe, this);
  this.messages = MailCache.messages;
  this.messages.subscribe(this.onMessagesSubscribe, this);
  this.currentMessage = MailCache.currentMessage;
  this.currentMessage.subscribe(this.onCurrentMessageSubscribe, this);
  UserSettings.timeFormat.subscribe(this.onCurrentMessageSubscribe, this);
  UserSettings.dateFormat.subscribe(this.onCurrentMessageSubscribe, this);
  this.displayedMessageUid = ko.observable('');
  this.browserTitle = ko.computed(function () {
    var oMessage = this.currentMessage(),
      sSubject = oMessage ? oMessage.subject() : '',
      sPrefix = sSubject ? sSubject + ' - ' : '';
    return sPrefix + AccountList.getEmail() + ' - ' + TextUtils.i18n('MAILWEBCLIENT/HEADING_MESSAGE_BROWSER_TAB');
  }, this);
  this.isCurrentMessage = ko.computed(function () {
    return !!this.currentMessage();
  }, this);
  this.isCurrentMessageLoaded = ko.computed(function () {
    return this.isCurrentMessage() && !this.isLoading();
  }, this);
  this.visibleNoMessageSelectedText = ko.computed(function () {
    return this.messages().length > 0 && !this.isCurrentMessage();
  }, this);
  this.prevMessageUid = MailCache.prevMessageUid;
  this.nextMessageUid = MailCache.nextMessageUid;
  this.isEnablePrevMessage = ko.computed(function () {
    return App.isNewTab() && Types.isNonEmptyString(this.prevMessageUid());
  }, this);
  this.isEnableNextMessage = ko.computed(function () {
    return App.isNewTab() && Types.isNonEmptyString(this.nextMessageUid());
  }, this);
  this.isEnableDelete = this.isCurrentMessage;
  this.isEnableReply = this.isCurrentMessageLoaded;
  this.isEnableReplyAll = this.isCurrentMessageLoaded;
  this.isEnableResend = this.isCurrentMessageLoaded;
  this.isEnableForward = this.isCurrentMessageLoaded;
  this.isEnablePrint = this.isCurrentMessageLoaded;
  this.isEnableSave = function () {
    return this.isCurrentMessage() && this.currentMessage().sDownloadAsEmlUrl !== '';
  };
  this.deleteCommand = Utils.createCommand(this, this.executeDeleteMessage, this.isEnableDelete);
  this.prevMessageCommand = Utils.createCommand(this, this.executePrevMessage, this.isEnablePrevMessage);
  this.nextMessageCommand = Utils.createCommand(this, this.executeNextMessage, this.isEnableNextMessage);
  this.replyCommand = Utils.createCommand(this, this.executeReply, this.isEnableReply);
  this.replyAllCommand = Utils.createCommand(this, this.executeReplyAll, this.isEnableReplyAll);
  this.resendCommand = Utils.createCommand(this, this.executeResend, this.isEnableResend);
  this.forwardCommand = Utils.createCommand(this, this.executeForward, this.isEnableForward);
  this.printCommand = Utils.createCommand(this, this.executePrint, this.isEnablePrint);
  this.saveCommand = Utils.createCommand(this, this.executeSave, this.isEnableSave);
  this.forwardAsAttachment = Utils.createCommand(this, this.executeForwardAsAttachment, this.isCurrentMessageLoaded);
  this.messageToolbarControllers = ko.observableArray([]);
  this.registerController(MessagePaneSpamButtonsController, 'OnMessageToolbar');
  this.moreCommand = Utils.createCommand(this, null, this.isCurrentMessageLoaded);
  this.moreSectionCommands = ko.observableArray([]);
  App.broadcastEvent('MailWebclient::AddMoreSectionCommand', _.bind(function (oCommand) {
    var oNewCommand = _.extend({
      Text: '',
      CssClass: '',
      Handler: function Handler() {},
      Visible: true
    }, oCommand);
    oNewCommand.Command = Utils.createCommand(this, oNewCommand.Handler, this.isCurrentMessageLoaded);
    this.moreSectionCommands.push(oNewCommand);
  }, this));
  this.oUnsubscribeButtonView = __webpack_require__(/*! modules/MailWebclient/js/views/message-pane/UnsubscribeButtonView.js */ "W8zK"), this.visiblePicturesControl = ko.observable(false);
  this.visibleShowPicturesLink = ko.observable(false);
  this.visibleConfirmationControl = ko.computed(function () {
    return this.currentMessage() && this.currentMessage().readingConfirmationAddressee() !== '' && this.currentMessage() && this.currentMessage().readingConfirmationAddressee() !== AccountList.getEmail();
  }, this);
  this.isCurrentNotDraftOrSent = ko.computed(function () {
    var oCurrFolder = MailCache.getCurrentFolder();
    return oCurrFolder && oCurrFolder.fullName().length > 0 && oCurrFolder.type() !== Enums.FolderTypes.Drafts && oCurrFolder.type() !== Enums.FolderTypes.Sent;
  }, this);
  this.isCurrentSentFolder = ko.computed(function () {
    var oCurrFolder = MailCache.getCurrentFolder();
    return !!oCurrFolder && oCurrFolder.fullName().length > 0 && oCurrFolder.type() === Enums.FolderTypes.Sent;
  }, this);
  this.isCurrentNotDraftFolder = ko.computed(function () {
    var oCurrFolder = MailCache.getCurrentFolder();
    return !!oCurrFolder && oCurrFolder.fullName().length > 0 && oCurrFolder.type() !== Enums.FolderTypes.Drafts;
  }, this);
  this.isCurrentTemplateFolder = ko.computed(function () {
    return MailCache.isTemplateFolder(MailCache.getCurrentFolderFullname());
  }, this);
  this.topControllers = ko.observableArray();
  this.bodyControllers = ko.observableArray();
  this.bottomControllers = ko.observableArray();
  this.controllers = ko.computed(function () {
    return _.union(this.topControllers(), this.bodyControllers(), this.bottomControllers(), this.messageToolbarControllers());
  }, this);
  this.disableAllSendTools = ko.computed(function () {
    var bDisable = false;
    _.each(this.controllers(), function (oController) {
      if (_.isFunction(oController.disableAllSendTools) && oController.disableAllSendTools()) {
        bDisable = true;
      }
    });
    return bDisable;
  }, this);
  this.isVisibleReplyTool = ko.computed(function () {
    return !this.disableAllSendTools() && this.isCurrentNotDraftOrSent() && !this.isCurrentTemplateFolder();
  }, this);
  this.isVisibleResendTool = ko.computed(function () {
    return !this.disableAllSendTools() && this.isCurrentSentFolder() && !this.isCurrentTemplateFolder();
  }, this);
  this.isVisibleForwardTool = ko.computed(function () {
    return !this.disableAllSendTools() && this.isCurrentNotDraftFolder() && !this.isCurrentTemplateFolder();
  }, this);
  this.accountId = ko.observable(0);
  this.folder = ko.observable('');
  this.uid = ko.observable('');
  this.subject = ko.observable('');
  this.emptySubject = ko.computed(function () {
    return $.trim(this.subject()) === '';
  }, this);
  this.subjectForDisplay = ko.computed(function () {
    return this.emptySubject() ? TextUtils.i18n('MAILWEBCLIENT/LABEL_NO_SUBJECT') : this.subject();
  }, this);
  this.importance = ko.observable(Enums.Importance.Normal);
  this.oFromAddr = ko.observable(null);
  this.from = ko.observable('');
  this.fromEmail = ko.observable('');
  this.fullFrom = ko.observable('');
  this.to = ko.observable('');
  this.aToAddr = ko.observableArray([]);
  this.cc = ko.observable('');
  this.aCcAddr = ko.observableArray([]);
  this.bcc = ko.observable('');
  this.aBccAddr = ko.observableArray([]);
  this.allRecipients = ko.observableArray([]);
  this.currentAccountEmail = ko.observable();
  this.sMeSender = Settings.UseMeRecipientForMessages ? TextUtils.i18n('MAILWEBCLIENT/LABEL_ME_SENDER') : null;
  this.sMeRecipient = Settings.UseMeRecipientForMessages ? TextUtils.i18n('MAILWEBCLIENT/LABEL_ME_RECIPIENT') : null;
  this.fullDate = ko.observable('');
  this.midDate = ko.observable('');
  this.textBody = ko.observable('');
  this.textBodyForNewWindow = ko.observable('');
  this.domTextBody = ko.observable(null);
  this.rtlMessage = ko.observable(false);
  this.contentHasFocus = ko.observable(false);
  App.broadcastEvent('MailWebclient::RegisterMessagePaneController', _.bind(function (oController, sPlace) {
    this.registerController(oController, sPlace);
  }, this));
  this.fakeHeader = ko.computed(function () {
    var topControllersVisible = !!_.find(this.topControllers(), function (oController) {
      return !!oController.visible && oController.visible();
    });
    return !(this.visiblePicturesControl() || this.visibleConfirmationControl() || topControllersVisible);
  }, this);
  this.sAttachmentsSwitcherViewTemplate = App.isMobile() ? 'MailWebclient_Message_AttachmentsSwitcherView' : '';
  this.sQuickReplyViewTemplate = App.isMobile() || !Settings.AllowQuickReply ? '' : 'MailWebclient_Message_QuickReplyView';
  this.attachments = ko.observableArray([]);
  this.notInlineAttachments = ko.computed(function () {
    return _.filter(this.attachments(), function (oAttach) {
      return !oAttach.linked();
    });
  }, this);
  this.notInlineAttachmentsInString = ko.computed(function () {
    return _.map(this.notInlineAttachments(), function (oAttachment) {
      return oAttachment.fileName();
    }, this).join(', ');
  }, this);
  this.allAttachmentsDownloadMethods = ko.observableArray([]);
  this.visibleDownloadAllAttachmentsSeparately = ko.computed(function () {
    return this.notInlineAttachments().length > 1;
  }, this);
  this.visibleExtendedDownload = ko.computed(function () {
    return this.visibleDownloadAllAttachmentsSeparately() || this.allAttachmentsDownloadMethods().length > 0;
  }, this);
  App.broadcastEvent('MailWebclient::AddAllAttachmentsDownloadMethod', _.bind(function (oMethod) {
    this.allAttachmentsDownloadMethods.push(oMethod);
  }, this));
  this.detailsVisible = ko.observable(Storage.getData('aurora_mail_is-message-details-visible'));
  this.detailsTooltip = ko.computed(function () {
    return this.detailsVisible() ? TextUtils.i18n('COREWEBCLIENT/ACTION_HIDE_DETAILS') : TextUtils.i18n('COREWEBCLIENT/ACTION_SHOW_DETAILS');
  }, this);
  this.hasNotInlineAttachments = ko.computed(function () {
    return this.notInlineAttachments().length > 0;
  }, this);
  this.hasBodyText = ko.computed(function () {
    return this.textBody().length > 0;
  }, this);
  this.visibleAddMenu = ko.observable(false);

  // Quick Reply Part

  this.replyText = ko.observable('');
  this.replyTextFocus = ko.observable(false);
  this.replyPaneVisible = ko.computed(function () {
    return this.currentMessage() && this.currentMessage().completelyFilled();
  }, this);
  this.replySendingStarted = ko.observable(false);
  this.replySavingStarted = ko.observable(false);
  this.replyAutoSavingStarted = ko.observable(false);
  this.requiresPostponedSending = ko.observable(false);
  this.replyAutoSavingStarted.subscribe(function () {
    if (!this.replyAutoSavingStarted() && this.requiresPostponedSending()) {
      SendingUtils.sendPostponedMail(this.replyDraftUid());
      this.requiresPostponedSending(false);
    }
  }, this);
  this.hasReplyAllCcAddrs = ko.observable(false);
  this.placeholderText = ko.computed(function () {
    return this.hasReplyAllCcAddrs() ? TextUtils.i18n('MAILWEBCLIENT/LABEL_QUICK_REPLY_ALL') : TextUtils.i18n('MAILWEBCLIENT/LABEL_QUICK_REPLY');
  }, this);
  this.sendButtonText = ko.computed(function () {
    return this.hasReplyAllCcAddrs() ? TextUtils.i18n('MAILWEBCLIENT/ACTION_SEND_ALL') : TextUtils.i18n('MAILWEBCLIENT/ACTION_SEND');
  }, this);
  ko.computed(function () {
    if (!this.replyTextFocus() || this.replyAutoSavingStarted() || this.replySavingStarted() || this.replySendingStarted()) {
      this.stopAutosaveTimer();
    }
    if (this.replyTextFocus() && !this.replyAutoSavingStarted() && !this.replySavingStarted() && !this.replySendingStarted()) {
      this.startAutosaveTimer();
    }
  }, this);
  this.saveButtonText = ko.computed(function () {
    return this.replyAutoSavingStarted() ? TextUtils.i18n('MAILWEBCLIENT/ACTION_SAVE_IN_PROGRESS') : TextUtils.i18n('MAILWEBCLIENT/ACTION_SAVE');
  }, this);
  this.replyDraftUid = ko.observable('');
  this.replyLoadingText = ko.computed(function () {
    if (this.replySendingStarted()) {
      return TextUtils.i18n('COREWEBCLIENT/INFO_SENDING');
    } else if (this.replySavingStarted()) {
      return TextUtils.i18n('MAILWEBCLIENT/INFO_SAVING');
    }
    return '';
  }, this);
  this.isEnableSendQuickReply = ko.computed(function () {
    return this.isCurrentMessageLoaded() && this.replyText() !== '' && !this.replySendingStarted();
  }, this);
  this.isEnableSaveQuickReply = ko.computed(function () {
    return this.isEnableSendQuickReply() && !this.replySavingStarted() && !this.replyAutoSavingStarted();
  }, this);
  this.saveQuickReplyCommand = Utils.createCommand(this, this.executeSaveQuickReply, this.isEnableSaveQuickReply);
  this.sendQuickReplyCommand = Utils.createCommand(this, this.executeSendQuickReply, this.isEnableSendQuickReply);
  this.domMessageHeader = ko.observable(null);
  this.domQuickReply = ko.observable(null);
  this.domMessageForPrint = ko.observable(null);

  // to have time to take action "Open full reply form" before the animation starts
  this.replyTextFocusThrottled = ko.observable(false).extend({
    throttle: 50
  });
  this.replyTextFocus.subscribe(function () {
    this.replyTextFocusThrottled(this.replyTextFocus());
  }, this);
  this.isQuickReplyActive = ko.computed(function () {
    return this.replyText().length > 0 || this.replyTextFocusThrottled();
  }, this);

  //*** Quick Reply Part

  this.visibleAttachments = ko.observable(false);
  this.showMessage = function () {
    this.visibleAttachments(false);
  };
  this.showAttachments = function () {
    this.visibleAttachments(true);
  };
  this.sDefaultFontName = Settings.DefaultFontName;
  Pulse.registerDayOfMonthFunction(_.bind(this.updateMomentDate, this));
  App.broadcastEvent('MailWebclient::ConstructView::after', {
    Name: 'CMessagePaneView',
    View: this
  });
}
_.extendOwn(CMessagePaneView.prototype, CAbstractScreenView.prototype);
CMessagePaneView.prototype.ViewTemplate = App.isNewTab() ? 'MailWebclient_MessagePaneScreenView' : 'MailWebclient_MessagePaneView';
CMessagePaneView.prototype.ViewConstructorName = 'CMessagePaneView';

/**
 * @param {object} oData
 * @param {object} oEvent
 */
CMessagePaneView.prototype.resizeDblClick = function (oData, oEvent) {
  if (oEvent.target.className !== '' && !!oEvent.target.className.search(/add_contact|icon|link|title|subject|link|date|from/)) {
    Utils.calmEvent(oEvent);
    Utils.removeSelection();
    if (this.expandMessagePaneWidth) {
      this.expandMessagePaneWidth(!this.expandMessagePaneWidth());
    }
  }
};
CMessagePaneView.prototype.notifySender = function () {
  if (this.currentMessage() && this.currentMessage().readingConfirmationAddressee() !== '') {
    var sText = TextUtils.i18n('MAILWEBCLIENT/LABEL_RETURN_RECEIPT_MAIL_TEXT', {
      EMAIL: AccountList.getEmail(),
      SUBJECT: this.subject()
    }).replace(/\\r\\n/g, '\n');
    Ajax.send('SendMessage', {
      To: this.currentMessage().readingConfirmationAddressee(),
      Subject: TextUtils.i18n('MAILWEBCLIENT/LABEL_RETURN_RECEIPT_MAIL_SUBJECT'),
      Text: sText,
      ConfirmFolder: this.currentMessage().folder(),
      ConfirmUid: this.currentMessage().longUid()
    });
    this.currentMessage().readingConfirmationAddressee('');
  }
};
CMessagePaneView.prototype.onFolderListSubscribe = function () {
  if (App.isNewTab()) {
    this.onMessagesSubscribe();
  }
};
CMessagePaneView.prototype.onMessagesSubscribe = function () {
  if (!this.currentMessage() && this.uid() && this.uid().length > 0) {
    MailCache.setCurrentMessage(this.accountId(), this.folder(), this.uid());
  }
};

/**
 * @param {string} sUid
 */
CMessagePaneView.prototype.passReplyDataToNewTab = function (sUid) {
  if (this.currentMessage() && this.currentMessage().longUid() === sUid && this.replyText() !== '') {
    MainTabExtMethods.passReplyData(sUid, {
      ReplyText: this.replyText(),
      ReplyDraftUid: this.replyDraftUid()
    });
    this.replyText('');
    this.replyDraftUid('');
  }
};
CMessagePaneView.prototype.onCurrentMessageSubscribe = function () {
  var oMessage = this.currentMessage(),
    oAccount = oMessage ? AccountList.getAccount(oMessage.accountId()) : null,
    oReplyData = null;
  if (MainTab && oMessage) {
    oReplyData = MainTab.getReplyData(oMessage.longUid());
    if (oReplyData) {
      this.replyText(oReplyData.ReplyText);
      this.replyDraftUid(oReplyData.ReplyDraftUid);
    }
  } else if (!oMessage || oMessage.longUid() !== this.displayedMessageUid()) {
    this.replyText('');
    this.replyDraftUid('');
  }
  if (oMessage && this.uid() === oMessage.uid()) {
    this.hasReplyAllCcAddrs(SendingUtils.hasReplyAllCcAddrs(oMessage));
    this.subject(oMessage.subject());
    this.importance(oMessage.importance());
    this.from(oMessage.oFrom.getDisplay());
    this.fromEmail(oMessage.oFrom.getFirstEmail());
    this.fullFrom(oMessage.oFrom.getFull());
    if (oMessage.oFrom.aCollection.length > 0) {
      this.oFromAddr(oMessage.oFrom.aCollection[0]);
    } else {
      this.oFromAddr(null);
    }
    this.to(oMessage.oTo.getFull());
    this.aToAddr(oMessage.oTo.aCollection);
    this.cc(oMessage.oCc.getFull());
    this.aCcAddr(oMessage.oCc.aCollection);
    this.bcc(oMessage.oBcc.getFull());
    this.aBccAddr(oMessage.oBcc.aCollection);
    this.currentAccountEmail(oAccount.email());
    this.allRecipients(_.uniq(_.union(this.aToAddr(), this.aCcAddr(), this.aBccAddr())));
    this.midDate(oMessage.oDateModel.getMidDate());
    this.fullDate(oMessage.oDateModel.getFullDate());
    this.isLoading(oMessage.longUid() !== '' && !oMessage.completelyFilled());
    this.setMessageBody();
    if (!Settings.DisableRtlRendering) {
      this.rtlMessage(oMessage.rtl());
    }
    if (App.isNewTab()) {
      /*jshint onevar: false*/
      var aAtachments = [];
      /*jshint onevar: true*/

      _.each(oMessage.attachments(), _.bind(function (oAttach) {
        var oCopy = new CAttachmentModel(oAttach.iAccountId);
        oCopy.copyProperties(oAttach);
        aAtachments.push(oCopy);
      }, this));
      this.attachments(aAtachments);
    } else {
      this.attachments(oMessage.attachments());
    }
    if (!oMessage.completelyFilled() || oMessage.truncated()) {
      /*jshint onevar: false*/
      var oSubscribedField = !oMessage.completelyFilled() ? oMessage.completelyFilled : oMessage.truncated;
      /*jshint onevar: true*/
      if (App.isNewTab()) {
        oMessage.completelyFilledNewTabSubscription = oSubscribedField.subscribe(this.onCurrentMessageSubscribe, this);
      } else {
        oMessage.completelyFilledSubscription = oSubscribedField.subscribe(this.onCurrentMessageSubscribe, this);
      }
    } else if (oMessage.completelyFilledSubscription) {
      oMessage.completelyFilledSubscription.dispose();
      oMessage.completelyFilledSubscription = undefined;
    } else if (oMessage.completelyFilledNewTabSubscription) {
      oMessage.completelyFilledNewTabSubscription.dispose();
      oMessage.completelyFilledNewTabSubscription = undefined;
    }
  } else {
    this.hasReplyAllCcAddrs(false);
    this.isLoading(false);
    $(this.domTextBody()).empty().data('displayed-message-uid', '');
    this.displayedMessageUid('');
    this.rtlMessage(false);

    // cannot use removeAll, because the attachments of messages are passed by reference
    // and the call to removeAll removes attachments from message in the cache too.
    this.attachments([]);
    this.visiblePicturesControl(false);
    this.visibleShowPicturesLink(false);
  }
  this.doAfterPopulatingMessage();
};
CMessagePaneView.prototype.updateMomentDate = function () {
  var oMessage = this.currentMessage();
  if (oMessage && oMessage.oDateModel) {
    this.midDate(oMessage.oDateModel.getMidDate());
    this.fullDate(oMessage.oDateModel.getFullDate());
  }
};
CMessagePaneView.prototype.setMessageBody = function () {
  if (this.currentMessage()) {
    var oMessage = this.currentMessage(),
      sText = oMessage.text(),
      $body = $(this.domTextBody()),
      oDom = null,
      sHtml = '',
      sLen = sText.length,
      sMaxLen = 5000000,
      aCollapsedStatuses = [];
    this.textBody(sText);
    if ($body.data('displayed-message-uid') === oMessage.longUid()) {
      aCollapsedStatuses = this.getBlockquotesStatus();
    }
    $body.empty();
    if (oMessage.isPlain() || sLen > sMaxLen) {
      $body.html(sText);
      this.visiblePicturesControl(false);
    } else {
      oDom = oMessage.getDomText();
      sHtml = oDom.length > 0 ? oDom.html() : '';
      $body.append(sHtml);
      this.visiblePicturesControl(oMessage.hasExternals() && !oMessage.isExternalsAlwaysShown());
      this.visibleShowPicturesLink(!oMessage.isExternalsShown());
      if (!TextUtils.htmlStartsWithBlockquote(sHtml)) {
        this.doHidingBlockquotes(aCollapsedStatuses);
      }
    }
    $body.data('displayed-message-uid', oMessage.longUid());
    this.displayedMessageUid(oMessage.longUid());
  }
};
CMessagePaneView.prototype.getBlockquotesStatus = function () {
  var aCollapsedStatuses = [];
  $($('blockquote', $(this.domTextBody())).get()).each(function () {
    var $blockquote = $(this);
    if ($blockquote.hasClass('blockquote_before_toggle')) {
      aCollapsedStatuses.push($blockquote.hasClass('collapsed'));
    }
  });
  return aCollapsedStatuses;
};

/**
 * @param {Array} aCollapsedStatuses
 */
CMessagePaneView.prototype.doHidingBlockquotes = function (aCollapsedStatuses) {
  var iMinHeightForHide = 120,
    iHiddenHeight = 80,
    iStatusIndex = 0;
  $($('blockquote', $(this.domTextBody())).get()).each(function () {
    var $blockquote = $(this),
      $parentBlockquotes = $blockquote.parents('blockquote'),
      $switchButton = $('<span class="blockquote_toggle"></span>').html(TextUtils.i18n('MAILWEBCLIENT/ACTION_SHOW_QUOTED_TEXT')),
      bHidden = true;
    if ($parentBlockquotes.length === 0) {
      if ($blockquote.height() > iMinHeightForHide) {
        $blockquote.addClass('blockquote_before_toggle').after($switchButton).wrapInner('<div class="blockquote_content"></div>');
        $switchButton.bind('click', function () {
          if (bHidden) {
            $blockquote.height('auto');
            $switchButton.html(TextUtils.i18n('MAILWEBCLIENT/ACTION_HIDE_QUOTED_TEXT'));
            bHidden = false;
          } else {
            $blockquote.height(iHiddenHeight);
            $switchButton.html(TextUtils.i18n('MAILWEBCLIENT/ACTION_SHOW_QUOTED_TEXT'));
            bHidden = true;
          }
          $blockquote.toggleClass('collapsed', bHidden);
        });
        if (iStatusIndex < aCollapsedStatuses.length) {
          bHidden = aCollapsedStatuses[iStatusIndex];
          iStatusIndex++;
        }
        $blockquote.height(bHidden ? iHiddenHeight : 'auto').toggleClass('collapsed', bHidden);
      }
    }
  });
};

/**
 * @param {Array} aParams
 */
CMessagePaneView.prototype.onRoute = function (aParams) {
  var oParams = LinksUtils.parseMailbox(aParams),
    sFolder = oParams.Folder,
    sUid = oParams.Uid,
    oIdentifiers = MailCache.getMessageActualIdentifiers(MailCache.currentAccountId(), sFolder, sUid);
  AccountList.changeCurrentAccountByHash(oParams.AccountHash);
  if (this.replyText() !== '' && this.uid() !== oIdentifiers.sUid) {
    this.saveReplyMessage(false);
  }
  this.accountId(oIdentifiers.iAccountId);
  this.uid(oIdentifiers.sUid);
  this.folder(oIdentifiers.sFolder);
  MailCache.setCurrentMessage(oIdentifiers.iAccountId, oIdentifiers.sFolder, oIdentifiers.sUid);
  if (App.isNewTab) {
    MailCache.setCurrentFolder(oParams.Folder, oParams.Filters);
  }
  this.contentHasFocus(true);
};
CMessagePaneView.prototype.showPictures = function () {
  MailCache.showExternalPictures(false);
  this.visibleShowPicturesLink(false);
  this.setMessageBody();
};
CMessagePaneView.prototype.alwaysShowPictures = function () {
  var sEmail = this.currentMessage() ? this.currentMessage().oFrom.getFirstEmail() : '';
  if (sEmail.length > 0) {
    Ajax.send('SetEmailSafety', {
      Email: sEmail
    });
  }
  MailCache.showExternalPictures(true);
  this.visiblePicturesControl(false);
  this.setMessageBody();
};
CMessagePaneView.prototype.openInNewWindow = function () {
  this.openMessageInNewWindowBound(this.currentMessage());
};
CMessagePaneView.prototype.getReplyHtmlText = function () {
  return '<div style="font-family: ' + this.sDefaultFontName + '; font-size: 16px">' + SendingUtils.getHtmlFromText(this.replyText()) + '</div>';
};

/**
 * @param {string} sReplyType
 */
CMessagePaneView.prototype.executeReplyOrForward = function (sReplyType) {
  if (this.currentMessage()) {
    SendingUtils.setReplyData(this.getReplyHtmlText(), this.replyDraftUid());
    this.replyText('');
    this.replyDraftUid('');
    ComposeUtils.composeMessageAsReplyOrForward(sReplyType, this.currentMessage().accountId(), this.currentMessage().folder(), this.currentMessage().longUid());
  }
};
CMessagePaneView.prototype.executeDeleteMessage = function () {
  if (this.currentMessage()) {
    if (MainTab) {
      MainTab.deleteMessage(this.currentMessage().longUid(), function () {
        window.close();
      });
    } else if (App.isMobile()) {
      MailUtils.deleteMessages([this.currentMessage().longUid()], App);
    }
  }
};
CMessagePaneView.prototype.executePrevMessage = function () {
  if (this.isEnablePrevMessage()) {
    Routing.setHash(LinksUtils.getViewMessage(MailCache.currentAccountId(), MailCache.getCurrentFolderFullname(), this.prevMessageUid()));
  }
};
CMessagePaneView.prototype.executeNextMessage = function () {
  if (this.isEnableNextMessage()) {
    Routing.setHash(LinksUtils.getViewMessage(MailCache.currentAccountId(), MailCache.getCurrentFolderFullname(), this.nextMessageUid()));
  }
};
CMessagePaneView.prototype.executeReply = function () {
  this.executeReplyOrForward(Enums.ReplyType.Reply);
};
CMessagePaneView.prototype.executeReplyAll = function () {
  this.executeReplyOrForward(Enums.ReplyType.ReplyAll);
};
CMessagePaneView.prototype.executeResend = function () {
  this.executeReplyOrForward(Enums.ReplyType.Resend);
};
CMessagePaneView.prototype.executeForward = function () {
  this.executeReplyOrForward(Enums.ReplyType.Forward);
};
CMessagePaneView.prototype.executePrint = function () {
  var oMessage = this.currentMessage(),
    oWin = oMessage ? WindowOpener.open('', this.subject() + '-print') : null,
    sHtml = '';
  if (oMessage && oWin) {
    this.textBodyForNewWindow(oMessage.getConvertedHtml(UrlUtils.getAppPath(), true));
    sHtml = $(this.domMessageForPrint()).html();
    oWin.document.title = this.subject();
    $(oWin.document.body).html(sHtml);
    oWin.print();
  }
};
CMessagePaneView.prototype.executeSave = function () {
  if (this.isEnableSave() && this.currentMessage()) {
    UrlUtils.downloadByUrl(this.currentMessage().sDownloadAsEmlUrl, true);
  }
};
CMessagePaneView.prototype.executeForwardAsAttachment = function () {
  if (this.currentMessage()) {
    ComposeUtils.composeMessageWithEml(this.currentMessage());
  }
};
CMessagePaneView.prototype.changeAddMenuVisibility = function () {
  var bVisibility = !this.visibleAddMenu();
  this.visibleAddMenu(bVisibility);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CMessagePaneView.prototype.onSendOrSaveMessageResponse = function (oResponse, oRequest) {
  var oResData = SendingUtils.onSendOrSaveMessageResponse(oResponse, oRequest, this.requiresPostponedSending());
  switch (oResData.Method) {
    case 'SendMessage':
      this.replySendingStarted(false);
      if (oResData.Result) {
        this.replyText('');
      }
      break;
    case 'SaveMessage':
      if (oResData.Result) {
        this.replyDraftUid(oResData.NewUid);
      }
      this.replySavingStarted(false);
      this.replyAutoSavingStarted(false);
      break;
  }
};
CMessagePaneView.prototype.executeSendQuickReply = function () {
  if (this.isEnableSendQuickReply()) {
    this.replySendingStarted(true);
    this.requiresPostponedSending(this.replyAutoSavingStarted());
    SendingUtils.sendReplyMessage('SendMessage', this.getReplyHtmlText(), this.replyDraftUid(), this.onSendOrSaveMessageResponse, this, this.requiresPostponedSending());
    this.replyTextFocus(false);
  }
};
CMessagePaneView.prototype.executeSaveQuickReply = function () {
  this.saveReplyMessage(false);
};

/**
 * @param {Boolean} bAutosave
 */
CMessagePaneView.prototype.saveReplyMessage = function (bAutosave) {
  if (this.isEnableSaveQuickReply()) {
    if (bAutosave) {
      this.replyAutoSavingStarted(true);
    } else {
      this.replySavingStarted(true);
    }
    SendingUtils.sendReplyMessage('SaveMessage', this.getReplyHtmlText(), this.replyDraftUid(), this.onSendOrSaveMessageResponse, this);
  }
};

/**
 * Stops autosave.
 */
CMessagePaneView.prototype.stopAutosaveTimer = function () {
  window.clearTimeout(this.autoSaveTimer);
};

/**
 * Starts autosave.
 */
CMessagePaneView.prototype.startAutosaveTimer = function () {
  if (this.isEnableSaveQuickReply()) {
    var fSave = _.bind(this.saveReplyMessage, this, true);
    this.stopAutosaveTimer();
    if (Settings.AllowAutosaveInDrafts) {
      this.autoSaveTimer = window.setTimeout(fSave, Settings.AutoSaveIntervalSeconds * 1000);
    }
  }
};
CMessagePaneView.prototype.executeAllAttachmentsDownloadMethod = function (fHandler) {
  var message = this.currentMessage();
  if (message) {
    var notInlineAttachments = message.notInlineAttachments(),
      hashes = notInlineAttachments.map(function (attach) {
        return attach.hash();
      });
    fHandler(message.accountId(), hashes, notInlineAttachments);
  }
};
CMessagePaneView.prototype.downloadAllAttachmentsSeparately = function () {
  if (this.currentMessage()) {
    this.currentMessage().downloadAllAttachmentsSeparately();
  }
};
CMessagePaneView.prototype.onShow = function () {
  this.bShown = true;
};
CMessagePaneView.prototype.onHide = function () {
  this.bShown = false;
  this.accountId(0);
  this.folder('');
  this.uid('');
  _.each(this.controllers(), _.bind(function (oController) {
    if (_.isFunction(oController.onHide)) {
      oController.onHide();
    }
  }, this));
};

/**
 * @param {Object} $MailViewDom
 */
CMessagePaneView.prototype.onBind = function ($MailViewDom) {
  ModulesManager.run('SessionTimeoutWeblient', 'registerFunction', [_.bind(function () {
    if (this.replyText() !== '') {
      this.saveReplyMessage(false);
    }
  }, this)]);
  this.$MailViewDom = _.isUndefined($MailViewDom) ? this.$viewDom : $MailViewDom;
  this.$MailViewDom.on('mousedown', 'a', function (oEvent) {
    if (oEvent && 3 !== oEvent['which']) {
      var sHref = $(this).attr('href');
      if (sHref && 'mailto:' === sHref.toString().toLowerCase().substr(0, 7)) {
        ComposeUtils.composeMessageToAddresses(sHref.toString());
        return false;
      }
    }
    return true;
  });
  if (!App.isMobile()) {
    this.hotKeysBind();
  }
};
CMessagePaneView.prototype.hotKeysBind = function () {
  $(document).on('keydown', $.proxy(function (ev) {
    var allowReply = this.bShown && ev && !(ev.ctrlKey || ev.metaKey) && !ev.shiftKey && !Utils.isTextFieldFocused() && this.isEnableReply();
    if (allowReply && ev.keyCode === Enums.Key.q) {
      ev.preventDefault();
      this.replyTextFocus(true);
    } else if (allowReply && ev.keyCode === Enums.Key.r) {
      ev.preventDefault();
      this.executeReply();
    }
  }, this));
};
CMessagePaneView.prototype.showSourceHeaders = function () {
  var oMessage = this.currentMessage(),
    oWin = oMessage && oMessage.completelyFilled() ? WindowOpener.open('', this.subject() + '-headers') : null;
  if (oWin) {
    $(oWin.document.body).html('<pre>' + TextUtils.encodeHtml(oMessage.sourceHeaders()) + '</pre>');
  }
};
CMessagePaneView.prototype.switchDetailsVisibility = function () {
  this.detailsVisible(!this.detailsVisible());
  Storage.setData('aurora_mail_is-message-details-visible', this.detailsVisible());
};

/**
 * @param {Object} oController
 * @param {string} sPlace
 */
CMessagePaneView.prototype.registerController = function (oController, sPlace) {
  switch (sPlace) {
    case 'OnMessageToolbar':
      this.messageToolbarControllers.push(oController);
      break;
    case 'BeforeMessageHeaders':
      this.topControllers.push(oController);
      break;
    case 'BeforeMessageBody':
      this.bodyControllers.push(oController);
      break;
    case 'AfterMessageBody':
      this.bottomControllers.push(oController);
      break;
  }
  if (_.isFunction(oController.assignMessagePaneExtInterface)) {
    oController.assignMessagePaneExtInterface(this.getExtInterface());
  }
};

/**
 * @returns {Object}
 */
CMessagePaneView.prototype.getExtInterface = function () {
  return {
    changeText: _.bind(function (sText) {
      var oMessage = this.currentMessage();
      if (oMessage && this.isCurrentMessageLoaded()) {
        oMessage.changeText(sText);
        this.setMessageBody();
      }
    }, this)
  };
};
CMessagePaneView.prototype.doAfterPopulatingMessage = function () {
  var oMessage = this.currentMessage(),
    bLoaded = oMessage && !this.isLoading(),
    oMessageProps = bLoaded ? {
      iAccountId: oMessage.accountId(),
      sFolderFullName: oMessage.folder(),
      sMessageUid: oMessage.uid(),
      aToEmails: oMessage.oTo.getEmails(),
      bPlain: oMessage.isPlain(),
      sRawText: oMessage.textRaw(),
      sText: oMessage.text(),
      sAccountEmail: AccountList.getEmail(oMessage.accountId()),
      sFromEmail: oMessage.oFrom.getFirstEmail(),
      iSensitivity: oMessage.sensitivity(),
      aExtend: oMessage.aExtend
    } : null;
  _.each(this.controllers(), _.bind(function (oController) {
    if (_.isFunction(oController.doAfterPopulatingMessage)) {
      oController.doAfterPopulatingMessage(oMessageProps);
    }
  }, this));
  ModulesManager.run('ContactsWebclient', 'applyContactsCards', [this.$MailViewDom.find('span.address')]);
};
CMessagePaneView.prototype.searchBySubject = function () {
  if (Settings.AllowSearchMessagesBySubject && this.currentMessage()) {
    var sFolder = this.currentMessage().folder(),
      iPage = 1,
      sUid = this.currentMessage().longUid(),
      sSearch = '',
      sFilters = '',
      sSubject = this.currentMessage().subject(),
      aSubject = sSubject.split(':'),
      aPrefixes = Settings.PrefixesToRemoveBeforeSearchMessagesBySubject,
      aSearch = [];
    if (aPrefixes.length === 0) {
      sSearch = aSubject;
    } else {
      _.each(aSubject, function (sSubjPart) {
        if (aSearch.length > 0) {
          aSearch.push(sSubjPart);
        } else {
          var hasPrefix = false;
          var sTrimSubjPart = $.trim(sSubjPart);
          _.each(aPrefixes, function (sPref) {
            var re = new RegExp('^' + sPref + '(\\[\\d*\\]){0,1}$', 'i');
            hasPrefix = hasPrefix || re.test(sTrimSubjPart);
          });
          if (!hasPrefix) {
            aSearch.push(sSubjPart);
          }
        }
      });
      sSearch = $.trim(aSearch.join(':'));
    }
    Routing.setHash(LinksUtils.getMailbox(sFolder, iPage, sUid, sSearch, sFilters));
  }
};
module.exports = new CMessagePaneView();

/***/ }),

/***/ "oq0M":
/*!**********************************************************!*\
  !*** ./modules/MailWebclient/js/views/HeaderItemView.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  CAbstractHeaderItemView = __webpack_require__(/*! modules/CoreWebclient/js/views/CHeaderItemView.js */ "cR1d"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Cache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8");
function CHeaderItemView() {
  CAbstractHeaderItemView.call(this, TextUtils.i18n('MAILWEBCLIENT/ACTION_SHOW_MAIL'));
  this.unseenCount = Cache.newMessagesCount;
  this.inactiveTitle = ko.computed(function () {
    return TextUtils.i18n('MAILWEBCLIENT/HEADING_UNREAD_MESSAGES_BROWSER_TAB_PLURAL', {
      'COUNT': this.unseenCount()
    }, null, this.unseenCount()) + ' - ' + AccountList.getEmail();
  }, this);
  this.accounts = ko.computed(function () {
    return _.map(AccountList.collection(), function (oAccount) {
      return {
        bCurrent: oAccount.isCurrent(),
        sText: Settings.UserLoginPartInAccountDropdown ? oAccount.email().split('@')[0] : oAccount.email(),
        changeAccount: oAccount.changeAccount.bind(oAccount)
      };
    });
  }, this);
  if (Settings.ShowEmailAsTabName) {
    this.linkText = ko.computed(function () {
      var oCurrent = _.find(this.accounts(), function (oAccountData) {
        return oAccountData.bCurrent;
      });
      return oCurrent ? oCurrent.sText : TextUtils.i18n('MAILWEBCLIENT/HEADING_BROWSER_TAB');
    }, this);
  }
  this.mainHref = ko.computed(function () {
    if (this.isCurrent()) {
      return 'javascript: void(0);';
    }
    return this.hash();
  }, this);
}
_.extendOwn(CHeaderItemView.prototype, CAbstractHeaderItemView.prototype);
CHeaderItemView.prototype.ViewTemplate = 'MailWebclient_HeaderItemView';
var HeaderItemView = new CHeaderItemView();
HeaderItemView.allowChangeTitle(true);
module.exports = HeaderItemView;

/***/ }),

/***/ "p6Kc":
/*!**********************************************************!*\
  !*** ./modules/MailWebclient/js/models/CForwardModel.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9");

/**
 * @constructor
 */
function CForwardModel() {
  this.iAccountId = 0;
  this.enable = false;
  this.keepcopy = false;
  this.email = '';
}

/**
 * @param {number} iAccountId
 * @param {Object} oData
 */
CForwardModel.prototype.parse = function (iAccountId, oData) {
  this.iAccountId = iAccountId;
  this.enable = !!oData.Enable;
  this.keepcopy = !!oData.KeepMessageCopy;
  this.email = Types.pString(oData.Email);
};
module.exports = CForwardModel;

/***/ }),

/***/ "qN2P":
/*!******************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/settings/CServerPairPropertiesView.js ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  ValidationUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Validation.js */ "5RIG"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  CServerModel = __webpack_require__(/*! modules/MailWebclient/js/models/CServerModel.js */ "UVn1"),
  CServerPropertiesView = __webpack_require__(/*! modules/MailWebclient/js/views/CServerPropertiesView.js */ "cVoG");

/**
 * @constructor
 * @param {string} sPairId
 * @param {boolean} bAdminEdit
 * @param {int} iServersPerPage
 */
function CServerPairPropertiesView(sPairId, bAdminEdit, iServersPerPage) {
  var oParams = {
    aOauthConnectorsData: []
  };
  App.broadcastEvent('MailWebclient::GetOauthConnectorsData', oParams);
  this.bVisibleOauthSettings = bAdminEdit && Types.isNonEmptyArray(oParams.aOauthConnectorsData);
  this.aOauthConnectorsData = Types.pArray(oParams.aOauthConnectorsData);
  this.oauthSelectedConnector = ko.observable('');
  this.iServersPerPage = Types.pInt(iServersPerPage, 0);
  this.totalServersCount = ko.observable(0);
  this.servers = ko.observableArray([]);
  this.serversRetrieved = ko.observable(false);
  this.serverOptions = ko.observableArray([{
    'Name': TextUtils.i18n('MAILWEBCLIENT/LABEL_CONFIGURE_SERVER_MANUALLY'),
    'Id': 0
  }]);
  this.selectedServerId = ko.observable(0);
  this.oLastEditableServer = new CServerModel();
  this.iEditedServerId = 0;
  this.selectedServerId.subscribe(function () {
    var iSelectedServerId = this.selectedServerId(),
      oSelectedServer = _.find(this.servers(), function (oServer) {
        return oServer.iId === iSelectedServerId;
      });
    if (oSelectedServer) {
      if (this.oIncoming.isEnabled()) {
        this.oLastEditableServer = new CServerModel(this.getParametersForSave());
      }
      this.setExternalAccessServers(oSelectedServer.bSetExternalAccessServers);
      this.externalAccessImapServer(oSelectedServer.sExternalAccessImapServer);
      this.externalAccessImapPort(oSelectedServer.iExternalAccessImapPort);
      this.externalAccessImapAlterPort(oSelectedServer.iExternalAccessImapAlterPort > 0 ? oSelectedServer.iExternalAccessImapAlterPort : '');
      this.externalAccessImapUseSsl(oSelectedServer.bExternalAccessImapUseSsl);
      this.externalAccessPop3Server(oSelectedServer.sExternalAccessPop3Server);
      this.externalAccessPop3Port(oSelectedServer.iExternalAccessPop3Port);
      this.externalAccessPop3AlterPort(oSelectedServer.iExternalAccessPop3AlterPort > 0 ? oSelectedServer.iExternalAccessPop3AlterPort : '');
      this.externalAccessPop3UseSsl(oSelectedServer.bExternalAccessPop3UseSsl);
      this.externalAccessSmtpServer(oSelectedServer.sExternalAccessSmtpServer);
      this.externalAccessSmtpPort(oSelectedServer.iExternalAccessSmtpPort);
      this.externalAccessSmtpAlterPort(oSelectedServer.iExternalAccessSmtpAlterPort > 0 ? oSelectedServer.iExternalAccessSmtpAlterPort : '');
      this.externalAccessSmtpUseSsl(oSelectedServer.bExternalAccessSmtpUseSsl);
      this.oauthSelectedConnector(oSelectedServer.bOauthEnable ? oSelectedServer.sOauthType : '');
      this.tenantId(oSelectedServer.iTenantId);
      this.name(oSelectedServer.sName);
      this.oIncoming.set(oSelectedServer.sIncomingServer, oSelectedServer.iIncomingPort, oSelectedServer.bIncomingUseSsl);
      this.oIncoming.isEnabled(this.bAdminEdit);
      this.oOutgoing.set(oSelectedServer.sOutgoingServer, oSelectedServer.iOutgoingPort, oSelectedServer.bOutgoingUseSsl);
      this.oOutgoing.isEnabled(this.bAdminEdit);
      this.outgoingUseAuth(oSelectedServer.sSmtpAuthType === window.Enums.SmtpAuthType.UseUserCredentials);
      this.outgoingUseAuth.enable(this.bAdminEdit);
      this.domains(oSelectedServer.sDomains);
      this.smtpAuthType(oSelectedServer.sSmtpAuthType);
      this.smtpLogin(oSelectedServer.sSmtpLogin);
      this.smtpPassword(oSelectedServer.sSmtpPassword);
      this.enableSieve(oSelectedServer.bEnableSieve);
      this.sievePort(oSelectedServer.iSievePort);
      this.enableThreading(oSelectedServer.bEnableThreading);
      this.useFullEmailAddressAsLogin(oSelectedServer.bUseFullEmailAddressAsLogin);
    } else {
      this.setExternalAccessServers(this.oLastEditableServer.bSetExternalAccessServers);
      this.externalAccessImapServer(this.oLastEditableServer.sExternalAccessImapServer);
      this.externalAccessImapPort(this.oLastEditableServer.iExternalAccessImapPort);
      this.externalAccessImapAlterPort(this.oLastEditableServer.iExternalAccessImapAlterPort > 0 ? this.oLastEditableServer.iExternalAccessImapAlterPort : '');
      this.externalAccessImapUseSsl(this.oLastEditableServer.bExternalAccessImapUseSsl);
      this.externalAccessPop3Server(this.oLastEditableServer.sExternalAccessPop3Server);
      this.externalAccessPop3Port(this.oLastEditableServer.iExternalAccessPop3Port);
      this.externalAccessPop3AlterPort(this.oLastEditableServer.iExternalAccessPop3AlterPort > 0 ? this.oLastEditableServer.iExternalAccessPop3AlterPort : '');
      this.externalAccessPop3UseSsl(this.oLastEditableServer.bExternalAccessPop3UseSsl);
      this.externalAccessSmtpServer(this.oLastEditableServer.sExternalAccessSmtpServer);
      this.externalAccessSmtpPort(this.oLastEditableServer.iExternalAccessSmtpPort);
      this.externalAccessSmtpAlterPort(this.oLastEditableServer.iExternalAccessSmtpAlterPort > 0 ? this.oLastEditableServer.iExternalAccessSmtpAlterPort : '');
      this.externalAccessSmtpUseSsl(this.oLastEditableServer.bExternalAccessSmtpUseSsl);
      this.oauthSelectedConnector(this.oLastEditableServer.bOauthEnable ? this.oLastEditableServer.sOauthType : '');
      this.tenantId(0);
      this.name(this.oLastEditableServer.sName);
      this.oIncoming.set(this.oLastEditableServer.sIncomingServer, this.oLastEditableServer.iIncomingPort, this.oLastEditableServer.bIncomingUseSsl);
      this.oIncoming.isEnabled(true);
      this.oOutgoing.set(this.oLastEditableServer.sOutgoingServer, this.oLastEditableServer.iOutgoingPort, this.oLastEditableServer.bOutgoingUseSsl);
      this.oOutgoing.isEnabled(true);
      this.outgoingUseAuth(this.oLastEditableServer.sSmtpAuthType === window.Enums.SmtpAuthType.UseUserCredentials);
      this.outgoingUseAuth.enable(true);
      this.domains('');
      this.smtpAuthType(window.Enums.SmtpAuthType.UseUserCredentials);
      this.smtpLogin('');
      this.smtpPassword('');
      this.enableSieve(false);
      this.sievePort(4190);
      this.enableThreading(true);
      this.useFullEmailAddressAsLogin(true);
    }
    this.setCurrentValues();
  }, this);
  this.tenantId = ko.observable(0);
  this.name = ko.observable('');
  this.name.focused = ko.observable(false);
  this.bAdminEdit = bAdminEdit;
  this.oIncoming = new CServerPropertiesView(143, 993, sPairId + '_incoming', TextUtils.i18n('MAILWEBCLIENT/LABEL_IMAP_SERVER'), null);
  this.oOutgoing = new CServerPropertiesView(25, 465, sPairId + '_outgoing', TextUtils.i18n('MAILWEBCLIENT/LABEL_SMTP_SERVER'), this.oIncoming.server);
  this.outgoingUseAuth = ko.observable(true);
  this.outgoingUseAuth.enable = ko.observable(true);
  this.domains = ko.observable('');
  this.bAllowEditDomains = Settings.AllowEditDomainsInServer;
  //	this.name.focused.subscribe(function () {
  //		if (this.bAllowEditDomains && !this.name.focused() && this.domains() === '')
  //		{
  //			this.domains(this.name());
  //		}
  //	}, this);
  this.smtpAuthType = ko.observable(window.Enums.SmtpAuthType.UseUserCredentials);
  this.smtpLogin = ko.observable('');
  this.smtpPassword = ko.observable('');
  this.enableSieve = ko.observable(false);
  this.sievePort = ko.observable(4190);
  this.enableThreading = ko.observable(true);
  this.useFullEmailAddressAsLogin = ko.observable(true);
  this.currentValues = ko.observable('');
  this.aRequiredFields = [this.oIncoming.server, this.oIncoming.port, this.oOutgoing.server, this.oOutgoing.port];
  if (bAdminEdit) {
    this.aRequiredFields.unshift(this.name);
  }
  this.setExternalAccessServers = ko.observable(false);
  this.externalAccessImapServer = ko.observable(this.oIncoming.server());
  this.externalAccessImapPort = ko.observable(this.oIncoming.port());
  this.externalAccessImapAlterPort = ko.observable('');
  this.externalAccessImapUseSsl = ko.observable(false);
  this.externalAccessPop3Server = ko.observable('');
  this.externalAccessPop3Port = ko.observable(110);
  this.externalAccessPop3AlterPort = ko.observable('');
  this.externalAccessPop3UseSsl = ko.observable(false);
  this.externalAccessSmtpServer = ko.observable(this.oOutgoing.server());
  this.externalAccessSmtpPort = ko.observable(this.oOutgoing.port());
  this.externalAccessSmtpAlterPort = ko.observable('');
  this.externalAccessSmtpUseSsl = ko.observable(false);
  ko.computed(function () {
    if (!this.setExternalAccessServers()) {
      this.externalAccessImapServer(this.oIncoming.server());
      this.externalAccessImapPort(this.oIncoming.port());
      this.externalAccessImapAlterPort('');
      this.externalAccessImapUseSsl(this.oIncoming.ssl());
      this.externalAccessPop3Server('');
      this.externalAccessPop3Port(110);
      this.externalAccessPop3AlterPort('');
      this.externalAccessPop3UseSsl(false);
      this.externalAccessSmtpServer(this.oOutgoing.server());
      this.externalAccessSmtpPort(this.oOutgoing.port());
      this.externalAccessSmtpAlterPort('');
      this.externalAccessSmtpUseSsl(this.oOutgoing.ssl());
    }
  }, this);
}
CServerPairPropertiesView.prototype.ViewTemplate = 'MailWebclient_Settings_ServerPairPropertiesView';
CServerPairPropertiesView.prototype.serverInit = function (bEmptyServerToEdit) {
  this.setServer(bEmptyServerToEdit ? new CServerModel() : this.oLastEditableServer);
};
CServerPairPropertiesView.prototype.fullInit = function () {
  this.setServer(this.oLastEditableServer);
  if (!this.serversRetrieved()) {
    this.requestServers();
  }
};
CServerPairPropertiesView.prototype.setServer = function (oServer) {
  this.oLastEditableServer = oServer;
  this.setServerId(oServer.iId);
};
CServerPairPropertiesView.prototype.setServerId = function (iServerId) {
  if (this.serversRetrieved() || iServerId === 0) {
    var bEmptyServerNow = this.selectedServerId() === 0;
    this.selectedServerId(0); // If server with identifier iServerId doesn't exist in the list selectedServerId will be reset to previous value that will be 0
    this.selectedServerId(iServerId);
    if (bEmptyServerNow && iServerId === 0) {
      this.selectedServerId.valueHasMutated();
    }
  } else {
    this.iEditedServerId = iServerId;
  }
};
CServerPairPropertiesView.prototype.requestServers = function (iOffset, sSearch) {
  var iTenantId = _.isFunction(App.getTenantId) ? App.getTenantId() : 0;
  this.serversRetrieved(false);
  Ajax.send('GetServers', {
    'TenantId': iTenantId,
    'Offset': Types.pInt(iOffset, 0),
    'Limit': this.iServersPerPage,
    'Search': Types.pString(sSearch, '')
  }, function (oResponse) {
    if (_.isArray(oResponse && oResponse.Result && oResponse.Result.Items)) {
      var aServerOptions = [{
        'Name': TextUtils.i18n('MAILWEBCLIENT/LABEL_CONFIGURE_SERVER_MANUALLY'),
        'Id': 0
      }];
      _.each(oResponse.Result.Items, function (oServer) {
        aServerOptions.push({
          'Name': oServer.Name,
          'Id': Types.pInt(oServer.EntityId)
        });
      });
      this.servers(_.map(oResponse.Result.Items, function (oServerData) {
        return new CServerModel(oServerData);
      }));
      this.totalServersCount(oResponse.Result.Count);
      this.serverOptions(aServerOptions);
      this.serversRetrieved(true);
      if (this.iEditedServerId) {
        this.setServerId(this.iEditedServerId);
        this.iEditedServerId = 0;
      }
    } else {
      Api.showErrorByCode(oResponse);
    }
  }, this);
};
CServerPairPropertiesView.prototype.clear = function () {
  this.oIncoming.clear();
  this.oOutgoing.clear();
  this.outgoingUseAuth(true);
};
CServerPairPropertiesView.prototype.setCurrentValues = function () {
  var aNamePart = this.bAdminEdit ? [this.selectedServerId(), this.name()] : [],
    aServerPart = [this.oIncoming.port(), this.oIncoming.server(), this.oIncoming.ssl(), this.oOutgoing.port(), this.oOutgoing.server(), this.oOutgoing.ssl(), this.outgoingUseAuth(), this.domains(), this.smtpAuthType(), this.smtpLogin(), this.smtpPassword(), this.enableSieve(), this.sievePort(), this.enableThreading(), this.useFullEmailAddressAsLogin(), this.setExternalAccessServers(), this.externalAccessImapServer(), this.externalAccessImapPort(), this.externalAccessImapAlterPort(), this.externalAccessImapUseSsl(), this.externalAccessPop3Server(), this.externalAccessPop3Port(), this.externalAccessPop3AlterPort(), this.externalAccessPop3UseSsl(), this.externalAccessSmtpServer(), this.externalAccessSmtpPort(), this.externalAccessSmtpAlterPort(), this.externalAccessSmtpUseSsl(), this.oauthSelectedConnector()];
  this.currentValues(aNamePart.concat(aServerPart).join(':'));
};
CServerPairPropertiesView.prototype.getCurrentValues = function () {
  this.setCurrentValues();
  return [this.currentValues()];
};
CServerPairPropertiesView.prototype.getSmtpAuthType = function () {
  if (this.bAdminEdit || this.smtpAuthType() === window.Enums.SmtpAuthType.UseSpecifiedCredentials) {
    return this.smtpAuthType();
  } else {
    return this.outgoingUseAuth() ? window.Enums.SmtpAuthType.UseUserCredentials : window.Enums.SmtpAuthType.NoAuthentication;
  }
};
CServerPairPropertiesView.prototype.getParametersForSave = function () {
  var iServerId = this.selectedServerId(),
    iLastEditableServerId = this.oLastEditableServer.iId,
    sSmtpAuthType = this.getSmtpAuthType(),
    oParameters = {};
  if (iServerId === 0 && !_.find(this.servers(), function (oServer) {
    return iLastEditableServerId === oServer.iId;
  })) {
    iServerId = iLastEditableServerId;
  }
  oParameters = {
    'ServerId': iServerId,
    'Name': this.bAdminEdit ? this.name() : this.oIncoming.server(),
    'IncomingServer': this.oIncoming.server(),
    'IncomingPort': this.oIncoming.getIntPort(),
    'IncomingUseSsl': this.oIncoming.ssl(),
    'OutgoingServer': this.oOutgoing.server(),
    'OutgoingPort': this.oOutgoing.getIntPort(),
    'OutgoingUseSsl': this.oOutgoing.ssl(),
    'Domains': this.domains(),
    'SmtpAuthType': sSmtpAuthType,
    'SmtpLogin': sSmtpAuthType === window.Enums.SmtpAuthType.UseSpecifiedCredentials ? $.trim(this.smtpLogin()) : '',
    'SmtpPassword': sSmtpAuthType === window.Enums.SmtpAuthType.UseSpecifiedCredentials ? $.trim(this.smtpPassword()) : '',
    'EnableSieve': this.enableSieve(),
    'SievePort': this.sievePort(),
    'EnableThreading': this.enableThreading(),
    'UseFullEmailAddressAsLogin': this.useFullEmailAddressAsLogin(),
    'SetExternalAccessServers': this.setExternalAccessServers()
  };
  if (this.setExternalAccessServers()) {
    oParameters['ExternalAccessImapServer'] = this.externalAccessImapServer();
    oParameters['ExternalAccessImapPort'] = this.externalAccessImapPort();
    oParameters['ExternalAccessImapAlterPort'] = Types.pInt(this.externalAccessImapAlterPort(), 0);
    oParameters['ExternalAccessImapUseSsl'] = this.externalAccessImapUseSsl();
    oParameters['ExternalAccessPop3Server'] = this.externalAccessPop3Server();
    oParameters['ExternalAccessPop3Port'] = this.externalAccessPop3Port();
    oParameters['ExternalAccessPop3AlterPort'] = Types.pInt(this.externalAccessPop3AlterPort(), 0);
    oParameters['ExternalAccessPop3UseSsl'] = this.externalAccessPop3UseSsl();
    oParameters['ExternalAccessSmtpServer'] = this.externalAccessSmtpServer();
    oParameters['ExternalAccessSmtpPort'] = this.externalAccessSmtpPort();
    oParameters['ExternalAccessSmtpAlterPort'] = Types.pInt(this.externalAccessSmtpAlterPort(), 0);
    oParameters['ExternalAccessSmtpUseSsl'] = this.externalAccessSmtpUseSsl();
  }
  var oOAuthConnector = _.find(this.aOauthConnectorsData, function (oConnectorData) {
    return oConnectorData.Type === this.oauthSelectedConnector();
  }, this);
  oParameters['OAuthEnable'] = !!oOAuthConnector;
  if (oOAuthConnector) {
    oParameters['OAuthName'] = oOAuthConnector.Name;
    oParameters['OAuthType'] = oOAuthConnector.Type;
    oParameters['OAuthIconUrl'] = oOAuthConnector.IconUrl;
  }
  return oParameters;
};

/**
 * Validates if required fields are empty or not.
 * @returns {Boolean}
 */
CServerPairPropertiesView.prototype.validateBeforeSave = function () {
  return ValidationUtils.checkIfFieldsEmpty(this.aRequiredFields, TextUtils.i18n('COREWEBCLIENT/ERROR_REQUIRED_FIELDS_EMPTY'));
};
CServerPairPropertiesView.prototype.onDomainsClick = function () {
  if (!this.bAllowEditDomains) {
    $('.tabsbar .item.admin.domain').removeClass('recivedAnim');
    setTimeout(function () {
      $('.tabsbar .item.admin.domain').addClass('recivedAnim');
    });
  }
};
module.exports = CServerPairPropertiesView;

/***/ }),

/***/ "qpcR":
/*!************************************************************************!*\
  !*** ./modules/MailWebclient/js/popups/CreateAccountShortFormPopup.js ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  ValidationUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Validation.js */ "5RIG"),
  UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "3cxN"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  CoreAjax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  CreateAccountPopup = __webpack_require__(/*! modules/MailWebclient/js/popups/CreateAccountPopup.js */ "lsKY"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  WindowOpener = __webpack_require__(/*! modules/CoreWebclient/js/WindowOpener.js */ "zVyH"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  CAccountModel = __webpack_require__(/*! modules/MailWebclient/js/models/CAccountModel.js */ "YmTJ"),
  CServerModel = __webpack_require__(/*! modules/MailWebclient/js/models/CServerModel.js */ "UVn1");

/**
 * @constructor
 */
function CreateAccountShortFormPopup() {
  CAbstractPopup.call(this);
  this.oauthOptions = ko.observableArray([]);
  this.oauthOptionsVisible = ko.observable(false);
  this.bOAuthCallbackExecuted = false;
  this.loading = ko.observable(false);
  this.friendlyName = ko.observable('');
  this.email = ko.observable('');
  this.email.focused = ko.observable(false);
  this.password = ko.observable('');
  this.password.focused = ko.observable(false);
  this.aRequiredFields = [this.email, this.password];
}
_.extendOwn(CreateAccountShortFormPopup.prototype, CAbstractPopup.prototype);
CreateAccountShortFormPopup.prototype.PopupTemplate = 'MailWebclient_Settings_CreateAccountShortFormPopup';
CreateAccountShortFormPopup.prototype.init = function () {
  this.friendlyName('');
  this.email('');
  this.password('');
};

/**
 * @param {Function=} fCallback
 */
CreateAccountShortFormPopup.prototype.onOpen = function (aOAuthOptions, fCallback) {
  this.oauthOptions(aOAuthOptions);
  this.oauthOptionsVisible(this.oauthOptions().length > 0);
  this.fCallback = fCallback;
  this.init();
  this.focusFieldToEdit();
};
CreateAccountShortFormPopup.prototype.selectAuthOption = function (sType) {
  if (sType === '') {
    this.oauthOptionsVisible(false);
  } else {
    this.getOAuthData(sType);
  }
};
CreateAccountShortFormPopup.prototype.focusFieldToEdit = function () {
  var koFirstEmptyField = _.find(this.aRequiredFields, function (koField) {
    return koField() === '';
  });
  if (koFirstEmptyField) {
    koFirstEmptyField.focused(true);
  } else if (this.aRequiredFields.length > 0) {
    this.aRequiredFields[0].focused(true);
  }
};
CreateAccountShortFormPopup.prototype.onClose = function () {
  this.init();
};
CreateAccountShortFormPopup.prototype.getOAuthData = function (sType) {
  // var
  // 	sScopes = $.cookie('oauth-scopes'),
  // 	aScopes = !_.isUndefined(sScopes) ? sScopes.split('|') : []
  // ;
  // aScopes.push('mail');
  // aScopes = _.unique(aScopes);
  // $.removeCookie('oauth-scopes');
  $.cookie('oauth-scopes', 'mail');
  $.cookie('oauth-redirect', 'connect');
  this.bOAuthCallbackExecuted = false;
  window.gmailConnectCallback = function (oResult, sErrorCode, sModule) {
    this.bOAuthCallbackExecuted = true;
    if (!oResult) {
      Api.showErrorByCode({
        'ErrorCode': Types.pInt(sErrorCode),
        'Module': sModule
      }, '', true);
    } else {
      CoreAjax.send('OAuthIntegratorWebclient', 'CreateMailAccount', {
        'OAuthAccountData': oResult
      }, this.onAccountCreateResponse, this);
    }
  }.bind(this);
  var oWin = WindowOpener.open(UrlUtils.getAppPath() + '?oauth=' + sType + '-connect', 'OAuth'),
    iIntervalId = setInterval(function () {
      if (oWin.closed) {
        clearInterval(iIntervalId);
        if (!this.bOAuthCallbackExecuted) {
          window.location.reload();
        }
      }
    }.bind(this), 1000);
};
CreateAccountShortFormPopup.prototype.save = function () {
  if (ValidationUtils.checkIfFieldsEmpty(this.aRequiredFields, TextUtils.i18n('COREWEBCLIENT/ERROR_REQUIRED_FIELDS_EMPTY'))) {
    var oParameters = {
      'Domain': $.trim(this.email()).split('@')[1],
      'AllowWildcardDomain': true
    };
    this.loading(true);
    Ajax.send('GetMailServerByDomain', oParameters, this.onGetMailServerByDomain, this);
  } else {
    this.loading(false);
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CreateAccountShortFormPopup.prototype.onGetMailServerByDomain = function (oResponse, oRequest) {
  var oServer = null;
  if (oResponse.Result && typeof oResponse.Result.Server !== 'undefined' && typeof oResponse.Result.FoundWithWildcard !== 'undefined') {
    if (oResponse.Result.FoundWithWildcard) {
      var sNewAccountDomain = $.trim(this.email()).split('@')[1],
        sMainAccountEmail = AccountList.getDefault() ? AccountList.getDefault().email() : '',
        sMainAccountDomain = $.trim(sMainAccountEmail).split('@')[1],
        bDomainsMatches = sNewAccountDomain === sMainAccountDomain;
      if (bDomainsMatches) {
        oServer = new CServerModel(oResponse.Result.Server);
      }
    } else {
      oServer = new CServerModel(oResponse.Result.Server);
    }
  }
  if (oServer) {
    var oParameters = {
      'FriendlyName': this.friendlyName(),
      'Email': $.trim(this.email()),
      'IncomingLogin': $.trim(this.email()),
      'IncomingPassword': $.trim(this.password()),
      'Server': {
        'ServerId': oServer.iId
      }
    };
    Ajax.send('CreateAccount', oParameters, this.onAccountCreateResponse, this);
  } else {
    //second stage
    this.loading(false);
    Popups.showPopup(CreateAccountPopup, [_.bind(function (iAccountId) {
      var oAccount = AccountList.getAccount(iAccountId);
      if (oAccount) {
        this.editAccount(oAccount.hash());
      }
    }, this), this.friendlyName(), $.trim(this.email()), $.trim(this.password())]);
    this.closePopup();
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CreateAccountShortFormPopup.prototype.onAccountCreateResponse = function (oResponse, oRequest) {
  this.loading(false);
  if (!oResponse.Result) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('MAILWEBCLIENT/ERROR_CREATE_ACCOUNT'));
  } else {
    var iAccountId = Types.pInt(oResponse.Result.AccountID),
      oAccount = new CAccountModel(oResponse.Result);
    AccountList.addAccount(oAccount);
    AccountList.populateIdentities();
    AccountList.changeEditedAccount(iAccountId);
    if (AccountList.collection().length === 1) {
      AccountList.changeCurrentAccount(iAccountId);
    }
    if (this.fCallback) {
      this.fCallback(iAccountId);
    }
    this.closePopup();
  }
};

/**
 * @param {string} sHash
 */
CreateAccountShortFormPopup.prototype.editAccount = function (sHash) {
  ModulesManager.run('SettingsWebclient', 'setAddHash', [['account', sHash]]);
};
module.exports = new CreateAccountShortFormPopup();

/***/ }),

/***/ "r79L":
/*!***********************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/settings/AccountFiltersSettingsFormView.js ***!
  \***********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  MailCache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  CFilterModel = __webpack_require__(/*! modules/MailWebclient/js/models/CFilterModel.js */ "0HIo"),
  CFiltersModel = __webpack_require__(/*! modules/MailWebclient/js/models/CFiltersModel.js */ "sHZb");

/**
 * @constructor
 */
function CAccountFiltersSettingsFormView() {
  CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
  this.bShown = false;
  this.foldersOptions = ko.observableArray([]);
  MailCache.editedFolderList.subscribe(function () {
    if (this.bShown) {
      this.populate();
    }
  }, this);
  this.loading = ko.observable(true);
  this.collection = ko.observableArray([]);
  this.fieldOptions = [{
    'text': TextUtils.i18n('MAILWEBCLIENT/LABEL_FROM'),
    'value': 0
  }, {
    'text': TextUtils.i18n('MAILWEBCLIENT/LABEL_TO'),
    'value': 1
  }, {
    'text': TextUtils.i18n('MAILWEBCLIENT/LABEL_SUBJECT'),
    'value': 2
  }];
  this.conditionOptions = [{
    'text': TextUtils.i18n('MAILWEBCLIENT/LABEL_CONTAINING'),
    'value': 0
  }, {
    'text': TextUtils.i18n('MAILWEBCLIENT/LABEL_EQUAL_TO'),
    'value': 1
  }, {
    'text': TextUtils.i18n('MAILWEBCLIENT/LABEL_NOT_CONTAINING'),
    'value': 2
  }];
  this.actionOptions = [{
    'text': TextUtils.i18n('MAILWEBCLIENT/LABEL_MOVE_FILTER_ACTION'),
    'value': 3
  }, {
    'text': TextUtils.i18n('MAILWEBCLIENT/LABEL_REDIRECT_FILTER_ACTION'),
    'value': 7
  }, {
    'text': TextUtils.i18n('MAILWEBCLIENT/LABEL_DELETE_FILTER_ACTION'),
    'value': 1
  }];
  this.phaseArray = [''];
  _.each(TextUtils.i18n('MAILWEBCLIENT/INFO_FILTER').split(/,{0,1}\s/), function (sItem) {
    var iIndex = this.phaseArray.length - 1;
    if (sItem.substr(0, 1) === '%' || this.phaseArray[iIndex].substr(-1, 1) === '%') {
      this.phaseArray.push(sItem);
    } else {
      this.phaseArray[iIndex] += ' ' + sItem;
    }
  }, this);
  this.firstState = null;
}
_.extendOwn(CAccountFiltersSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CAccountFiltersSettingsFormView.prototype.ViewTemplate = 'MailWebclient_Settings_AccountFiltersSettingsFormView';
CAccountFiltersSettingsFormView.prototype.onShow = function () {
  this.populate();
};
CAccountFiltersSettingsFormView.prototype.onHide = function () {
  this.bShown = false;
};
CAccountFiltersSettingsFormView.prototype.populate = function () {
  var oFolderList = MailCache.editedFolderList(),
    aOptionList = [];
  if (oFolderList.iAccountId === AccountList.editedId()) {
    aOptionList = oFolderList.getOptions(TextUtils.i18n('MAILWEBCLIENT/LABEL_FOLDER_NOT_SELECTED'), true, true, false, true);
    this.foldersOptions(aOptionList);
    this.populateFilters();
  } else {
    this.loading(true);
    this.collection([]);
  }
};
CAccountFiltersSettingsFormView.prototype.revert = function () {
  var account = AccountList.getEdited();
  if (account && account.filters() !== null) {
    this.collection(_toConsumableArray(account.filters().collection()));
  } else {
    this.collection([]);
  }
  this.updateSavedState();
};
CAccountFiltersSettingsFormView.prototype.commit = function () {
  _.each(this.collection(), function (oFilter) {
    oFilter.commit();
  });
};
CAccountFiltersSettingsFormView.prototype.getCurrentValues = function () {
  return _.map(this.collection(), function (oFilter) {
    return oFilter.toString();
  }, this);
};
CAccountFiltersSettingsFormView.prototype.getParametersForSave = function () {
  var aFilters = _.map(this.collection(), function (oItem) {
    return {
      'Enable': oItem.enable() ? '1' : '0',
      'Field': oItem.field(),
      'Filter': oItem.filter(),
      'Condition': oItem.condition(),
      'Action': oItem.action(),
      'FolderFullName': oItem.folder(),
      'Email': oItem.email()
    };
  });
  return {
    'AccountID': AccountList.editedId(),
    'Filters': aFilters
  };
};
CAccountFiltersSettingsFormView.prototype.save = function () {
  var bCantSave = _.some(this.collection(), function (oFilter) {
    return oFilter.filter() === '' || Types.pString(oFilter.action()) === '3' /* Move */ && oFilter.folder() === '';
  });
  if (bCantSave) {
    Screens.showError(TextUtils.i18n('MAILWEBCLIENT/ERROR_FILTER_FIELDS_EMPTY'));
  } else {
    this.isSaving(true);
    this.commit();
    this.updateSavedState();
    Ajax.send('UpdateFilters', this.getParametersForSave(), this.onAccountSieveFiltersUpdateResponse, this);
  }
};
CAccountFiltersSettingsFormView.prototype.populateFilters = function () {
  var oAccount = AccountList.getEdited();
  if (oAccount) {
    if (oAccount.filters() !== null) {
      this.loading(false);
      this.collection(_toConsumableArray(oAccount.filters().collection()));
      this.updateSavedState();
    } else {
      this.loading(true);
      this.collection([]);
      Ajax.send('GetFilters', {
        'AccountID': oAccount.id()
      }, this.onGetFiltersResponse, this);
    }
  }
};

/**
 * @param {Object} oFilterToDelete
 */
CAccountFiltersSettingsFormView.prototype.deleteFilter = function (oFilterToDelete) {
  this.collection.remove(oFilterToDelete);
};
CAccountFiltersSettingsFormView.prototype.addFilter = function () {
  var oSieveFilter = new CFilterModel(AccountList.editedId());
  this.collection.push(oSieveFilter);
};

/**
 * @param {string} sPart
 * @param {string} sPrefix
 * 
 * @return {string}
 */
CAccountFiltersSettingsFormView.prototype.displayFilterPart = function (sPart, sPrefix) {
  var sTemplate = '';
  if (sPart === '%FIELD%') {
    sTemplate = 'Field';
  } else if (sPart === '%CONDITION%') {
    sTemplate = 'Condition';
  } else if (sPart === '%STRING%') {
    sTemplate = 'String';
  } else if (sPart === '%ACTION%') {
    sTemplate = 'Action';
  } else if (sPart === '%FOLDER%') {
    sTemplate = 'Folder';
  } else if (sPart === '%EMAIL%') {
    sTemplate = 'Email';
  } else if (sPart.substr(0, 9) === '%DEPENDED') {
    sTemplate = 'DependedText';
  } else {
    sTemplate = 'Text';
  }
  return sPrefix + sTemplate;
};

/**
 * @param {string} sText
 */
CAccountFiltersSettingsFormView.prototype.getDependedText = function (sText) {
  sText = Types.pString(sText);
  if (sText) {
    sText = sText.replace(/%/g, '').split('=')[1] || '';
  }
  return sText;
};

/**
 * @param {string} sText
 * @param {Object} oParent
 */
CAccountFiltersSettingsFormView.prototype.getDependedField = function (sText, oParent) {
  sText = Types.pString(sText);
  if (sText) {
    sText = sText.replace(/[=](.*)/g, '').split('-')[1] || '';
    sText = sText.toLowerCase();
  }
  return oParent[sText] ? oParent[sText]() : false;
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CAccountFiltersSettingsFormView.prototype.onGetFiltersResponse = function (oResponse, oRequest) {
  var oParameters = oRequest.Parameters,
    iAccountId = Types.pInt(oParameters.AccountID),
    oAccount = AccountList.getAccount(iAccountId),
    oSieveFilters = new CFiltersModel();
  this.loading(false);
  if (oResponse && oResponse.Result && oAccount) {
    oSieveFilters.parse(iAccountId, oResponse.Result);
    oAccount.filters(oSieveFilters);
    if (iAccountId === AccountList.editedId()) {
      this.populateFilters();
    }
  } else {
    Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_UNKNOWN'));
  }
};

/**
 * @param {Object} response
 * @param {Object} request
 */
CAccountFiltersSettingsFormView.prototype.onAccountSieveFiltersUpdateResponse = function (response, request) {
  this.isSaving(false);
  var account = AccountList.getEdited();
  if (response && response.Result) {
    Screens.showReport(TextUtils.i18n('MAILWEBCLIENT/REPORT_FILTERS_UPDATE_SUCCESS'));
    if (account) {
      account.filters().collection(_toConsumableArray(this.collection()));
    }
  } else {
    Api.showErrorByCode(response, TextUtils.i18n('COREWEBCLIENT/ERROR_SAVING_SETTINGS_FAILED'));
  }
};
module.exports = new CAccountFiltersSettingsFormView();

/***/ }),

/***/ "sLMx":
/*!************************************************************!*\
  !*** ./modules/MailWebclient/js/views/CMessageListView.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  moment = __webpack_require__(/*! moment */ "sdEb"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  CoreDateUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Date.js */ "jFqX"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "ERH9"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  Browser = __webpack_require__(/*! modules/CoreWebclient/js/Browser.js */ "/Odb"),
  CJua = __webpack_require__(/*! modules/CoreWebclient/js/CJua.js */ "hr1f"),
  CSelector = __webpack_require__(/*! modules/CoreWebclient/js/CSelector.js */ "DSoz"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "ioSH"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "KIwC"),
  CDateModel = __webpack_require__(/*! modules/CoreWebclient/js/models/CDateModel.js */ "ebd4"),
  CPageSwitcherView = __webpack_require__(/*! modules/CoreWebclient/js/views/CPageSwitcherView.js */ "FZR+"),
  ComposeUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Compose.js */ "sXLm"),
  LinksUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Links.js */ "dpSB"),
  MailUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Mail.js */ "Panx"),
  DateUtils = __webpack_require__(/*! modules/MailWebclient/js/utils/Date.js */ "t/bC"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  MailCache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  CalendarUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Calendar.js */ "1+/O");
__webpack_require__(/*! jquery-ui/ui/widgets/datepicker */ "okSt");

/**
 * @constructor
 * 
 * @param {Function} fOpenMessageInNewWindowBound
 */
function CMessageListView(fOpenMessageInNewWindowBound) {
  var _this = this;
  this.disableMoveMessages = ko.computed(function () {
    var oFolder = MailCache.getCurrentFolder();
    return oFolder ? oFolder.disableMoveFrom() : true;
  }, this);
  this.bVisibleSortByTool = Settings.MessagesSortBy.Allow && Settings.MessagesSortBy.List.length > 0;
  this.sSortBy = Settings.MessagesSortBy.DefaultSortBy;
  this.iSortOrder = Settings.MessagesSortBy.DefaultSortOrder;
  this.sortBy = ko.observable(Settings.MessagesSortBy.DefaultSortBy);
  this.sortOrder = ko.observable(Settings.MessagesSortBy.DefaultSortOrder);
  this.aSortList = [];
  _.each(Settings.MessagesSortBy.List, function (oItem) {
    this.aSortList.push({
      sText: TextUtils.i18n('MAILWEBCLIENT/' + oItem.LangConst),
      sSortBy: oItem.SortBy
    });
  }.bind(this));
  this.uploaderArea = ko.observable(null);
  this.bDragActive = ko.observable(false);
  this.bDragActiveComp = ko.computed(function () {
    return this.bDragActive();
  }, this);
  this.openMessageInNewWindowBound = fOpenMessageInNewWindowBound;
  this.isFocused = ko.observable(false);
  this.messagesContainer = ko.observable(null);
  this.currentMessage = MailCache.currentMessage;
  this.currentMessage.subscribe(function () {
    this.isFocused(false);
    this.selector.itemSelected(this.currentMessage());
  }, this);
  this.folderList = MailCache.folderList;
  this.folderList.subscribe(function () {
    setTimeout(this.onFolderListSubscribe.bind(this));
  }, this);
  this.folderFullName = ko.observable('');
  this.folderType = ko.observable(Enums.FolderTypes.User);
  this.filters = ko.observable('');
  this.isStarredFolder = ko.computed(function () {
    return _this.filters() === Enums.FolderFilter.Flagged;
  });
  this.isStarredInAllFolders = ko.computed(function () {
    return _this.isStarredFolder() && Settings.AllowChangeStarredMessagesSource && Settings.StarredMessagesSource === Enums.StarredMessagesSource.AllFolders;
  });
  this.isStarredFolder.subscribe(function () {
    if (_this.isStarredFolder()) {
      _this.selectedSearchFoldersMode(_this.isStarredInAllFolders() ? 'all' : '');
    }
  });
  this.allowAdvancedSearch = ko.computed(function () {
    return !ModulesManager.isModuleIncluded('MailNotesPlugin') || this.folderFullName() !== 'Notes';
  }, this);
  this.searchHighlightedInputFormatted = ko.observable('');
  this.searchHighlightedInput = ko.observable('');
  this.searchHighlightedInput.subscribe(function () {
    _this.searchHighlightedInputFormatted(DateUtils.formattedDateSearchHighlightedInput(_this.searchHighlightedInput()));
  });
  this.searchInput = ko.computed({
    read: function read() {
      if (_this.isStarredInAllFolders()) {
        return "".concat(_this.searchHighlightedInputFormatted(), " folders:all");
      }
      return _this.searchHighlightedInputFormatted();
    },
    write: function write(value) {
      if (_this.isStarredInAllFolders()) {
        _this.searchHighlightedInput(value.replace('folders:all', ''));
      } else {
        _this.searchHighlightedInput(value);
      }
    }
  });
  this.searchInputFrom = ko.observable('');
  this.searchInputTo = ko.observable('');
  this.searchInputSubject = ko.observable('');
  this.searchInputText = ko.observable('');
  this.searchSpan = ko.observable('');
  this.highlightTrigger = ko.observable('');
  this.selectedSearchFoldersMode = ko.observable('');
  this.selectedSearchFoldersModeText = ko.computed(function () {
    if (this.selectedSearchFoldersMode() === Enums.SearchFoldersMode.Sub) {
      return TextUtils.i18n('MAILWEBCLIENT/LABEL_SEARCH_CURRENT_FOLDER_AND_SUBFOLDERS');
    }
    if (this.selectedSearchFoldersMode() === Enums.SearchFoldersMode.All) {
      return TextUtils.i18n('MAILWEBCLIENT/LABEL_SEARCH_ALL_FOLDERS');
    }
    return TextUtils.i18n('MAILWEBCLIENT/LABEL_SEARCH_CURRENT_FOLDER');
  }, this);
  this.uidList = MailCache.uidList;
  this.uidList.subscribe(function () {
    if (this.uidList().searchCountSubscription) {
      this.uidList().searchCountSubscription.dispose();
      this.uidList().searchCountSubscription = undefined;
    }
    this.uidList().searchCountSubscription = this.uidList().resultCount.subscribe(function () {
      if (this.uidList().resultCount() >= 0) {
        this.oPageSwitcher.setCount(this.uidList().resultCount());
      }
    }, this);
    if (this.uidList().resultCount() >= 0) {
      this.oPageSwitcher.setCount(this.uidList().resultCount());
    }
  }, this);
  this.useThreading = ko.computed(function () {
    var oAccount = AccountList.getCurrent(),
      oFolder = MailCache.getCurrentFolder(),
      bFolderWithoutThreads = oFolder && oFolder.withoutThreads(),
      bNotSearchOrFilters = this.uidList().search() === '' && this.uidList().filters() === '';
    return oAccount && oAccount.threadingIsAvailable() && !bFolderWithoutThreads && bNotSearchOrFilters;
  }, this);
  this.collection = MailCache.messages;
  this._search = ko.observable('');
  this.search = ko.computed({
    'read': function read() {
      return $.trim(this._search());
    },
    'write': this._search,
    'owner': this
  });
  this.searchFoldersMode = ko.observable('');
  this.messageListParamsChanged = ko.observable(false).extend({
    'autoResetToFalse': 100
  });
  this.isEmptyList = ko.computed(function () {
    return this.collection().length === 0;
  }, this);
  this.isNotEmptyList = ko.computed(function () {
    return this.collection().length !== 0;
  }, this);
  this.isSearch = ko.computed(function () {
    return this.search().length > 0;
  }, this);
  this.isUnseenFilter = ko.computed(function () {
    return this.filters() === Enums.FolderFilter.Unseen;
  }, this);
  this.isLoading = MailCache.messagesLoading;
  this.isError = MailCache.messagesLoadingError;
  this.visibleInfoLoading = ko.computed(function () {
    return !this.isSearch() && this.isLoading();
  }, this);
  this.visibleInfoSearchLoading = ko.computed(function () {
    return this.isSearch() && this.isLoading();
  }, this);
  this.visibleInfoSearchList = ko.computed(function () {
    return this.isSearch() && !this.isUnseenFilter() && !this.isLoading() && !this.isEmptyList();
  }, this);
  this.visibleInfoMessageListEmpty = ko.computed(function () {
    return !this.isLoading() && !this.isSearch() && this.filters() === '' && this.isEmptyList() && !this.isError();
  }, this);
  this.visibleInfoStarredFolderEmpty = ko.computed(function () {
    return !this.isLoading() && !this.isSearch() && this.isStarredFolder() && this.isEmptyList() && !this.isError();
  }, this);
  this.visibleInfoSearchEmpty = ko.computed(function () {
    return this.isSearch() && !this.isUnseenFilter() && this.isEmptyList() && !this.isError() && !this.isLoading();
  }, this);
  this.visibleInfoMessageListError = ko.computed(function () {
    return !this.isSearch() && this.isError();
  }, this);
  this.visibleInfoSearchError = ko.computed(function () {
    return this.isSearch() && this.isError();
  }, this);
  this.visibleInfoUnseenFilterList = ko.computed(function () {
    return this.isUnseenFilter() && (this.isLoading() || !this.isEmptyList());
  }, this);
  this.visibleInfoUnseenFilterEmpty = ko.computed(function () {
    return this.isUnseenFilter() && this.isEmptyList() && !this.isError() && !this.isLoading();
  }, this);
  this.allowClearSearch = ko.observable(true);
  this.searchText = ko.computed(function () {
    var textOptions = {
      'SEARCH': this.calculateSearchStringForDescription(),
      'FOLDER': MailCache.getCurrentFolder() ? TextUtils.encodeHtml(MailCache.getCurrentFolder().displayName()) : ''
    };
    this.allowClearSearch(true);
    if (this.searchFoldersMode() === Enums.SearchFoldersMode.Sub) {
      if (MailCache.oUnifiedInbox.selected()) {
        return TextUtils.i18n('MAILWEBCLIENT/INFO_SEARCH_UNIFIED_SUBFOLDERS_RESULT', textOptions);
      }
      if ($.trim(this.search()) === 'folders:sub') {
        return TextUtils.i18n('MAILWEBCLIENT/INFO_MESSAGES_FROM_SUBFOLDERS', textOptions);
      }
      return TextUtils.i18n('MAILWEBCLIENT/INFO_SEARCH_SUBFOLDERS_RESULT', textOptions);
    }
    if (this.searchFoldersMode() === Enums.SearchFoldersMode.All) {
      if (MailCache.oUnifiedInbox.selected()) {
        return TextUtils.i18n('MAILWEBCLIENT/INFO_SEARCH_UNIFIED_ALL_FOLDERS_RESULT', textOptions);
      }
      if ($.trim(this.search()) === 'folders:all') {
        if (this.isStarredFolder()) {
          this.allowClearSearch(false);
        }
        return TextUtils.i18n('MAILWEBCLIENT/INFO_MESSAGES_FROM_ALL_FOLDERS', textOptions);
      }
      return TextUtils.i18n('MAILWEBCLIENT/INFO_SEARCH_ALL_FOLDERS_RESULT', textOptions);
    }
    return TextUtils.i18n('MAILWEBCLIENT/INFO_SEARCH_RESULT', textOptions);
  }, this);
  this.unseenFilterText = ko.computed(function () {
    if (this.search() === '') {
      return TextUtils.i18n('MAILWEBCLIENT/INFO_UNREAD_MESSAGES', {
        'FOLDER': MailCache.getCurrentFolder() ? TextUtils.encodeHtml(MailCache.getCurrentFolder().displayName()) : ''
      });
    } else {
      return TextUtils.i18n('MAILWEBCLIENT/INFO_UNREAD_MESSAGES_SEARCH_RESULT', {
        'SEARCH': this.calculateSearchStringForDescription(),
        'FOLDER': MailCache.getCurrentFolder() ? TextUtils.encodeHtml(MailCache.getCurrentFolder().displayName()) : ''
      });
    }
  }, this);
  this.unseenFilterEmptyText = ko.computed(function () {
    if (this.search() === '') {
      return TextUtils.i18n('MAILWEBCLIENT/INFO_NO_UNREAD_MESSAGES');
    } else {
      return TextUtils.i18n('MAILWEBCLIENT/INFO_NO_UNREAD_MESSAGES_FOUND');
    }
  }, this);
  this.isEnableGroupOperations = ko.observable(false).extend({
    'throttle': 250
  });
  this.selector = new CSelector(this.collection, _.bind(this.routeForMessage, this), _.bind(this.onDeletePress, this), _.bind(this.onMessageDblClick, this), _.bind(this.onEnterPress, this), null, false, false, false, false, false // don't select new item before routing executed
  );
  this.checkedUids = ko.computed(function () {
    var aChecked = this.selector.listChecked(),
      aCheckedUids = _.map(aChecked, function (oMessage) {
        return oMessage.longUid();
      }),
      oFolder = MailCache.getCurrentFolder(),
      aThreadCheckedUids = oFolder ? oFolder.getThreadCheckedUidsFromList(aChecked) : [],
      aUids = _.union(aCheckedUids, aThreadCheckedUids);
    return aUids;
  }, this);
  this.checkedOrSelectedUids = ko.computed(function () {
    var aChecked = this.checkedUids();
    if (aChecked.length === 0 && MailCache.currentMessage() && _.isFunction(MailCache.currentMessage().deleted) && !MailCache.currentMessage().deleted()) {
      aChecked = [MailCache.currentMessage().longUid()];
    }
    return aChecked;
  }, this);
  ko.computed(function () {
    this.isEnableGroupOperations(0 < this.selector.listCheckedOrSelected().length);
  }, this);
  this.checkAll = this.selector.koCheckAll();
  this.checkAllIncomplite = this.selector.koCheckAllIncomplete();
  this.pageSwitcherLocked = ko.observable(false);
  this.oPageSwitcher = new CPageSwitcherView(0, Settings.MailsPerPage);
  this.oPageSwitcher.currentPage.subscribe(function (iPage) {
    var sFolder = MailCache.getCurrentFolderFullname(),
      sUid = !App.isMobile() && this.currentMessage() ? this.currentMessage().longUid() : '',
      sSearch = this.search();
    if (!this.pageSwitcherLocked()) {
      this.changeRoutingForMessageList(sFolder, iPage, sUid, sSearch, this.filters(), this.sortBy(), this.sortOrder());
    }
  }, this);
  this.currentPage = ko.observable(0);

  // to the message list does not twitch
  if (Browser.firefox || Browser.ie) {
    this.listChangedThrottle = ko.observable(false).extend({
      'throttle': 10
    });
  } else {
    this.listChangedThrottle = ko.observable(false);
  }
  this.firstCompleteCollection = ko.observable(true);
  this.collection.subscribe(function () {
    if (this.collection().length > 0) {
      if (Types.isNonEmptyArray(this.aRouteParams)) {
        this.onRoute(this.aRouteParams);
        this.aRouteParams = [];
      } else {
        this.firstCompleteCollection(false);
      }
    }
  }, this);
  this.listChanged = ko.computed(function () {
    return [this.firstCompleteCollection(), MailCache.currentAccountId(), this.folderFullName(), this.filters(), this.search(), this.oPageSwitcher.currentPage()];
  }, this);
  this.listChanged.subscribe(function () {
    this.listChangedThrottle(!this.listChangedThrottle());
  }, this);
  this.bAdvancedSearch = ko.observable(false);
  this.searchAttachmentsCheckbox = ko.observable(false);
  this.searchAttachments = ko.observable('');
  this.searchAttachments.subscribe(function (sText) {
    this.searchAttachmentsCheckbox(!!sText);
  }, this);
  this.searchAttachmentsFocus = ko.observable(false);
  this.searchFromFocus = ko.observable(false);
  this.searchSubjectFocus = ko.observable(false);
  this.searchToFocus = ko.observable(false);
  this.searchTextFocus = ko.observable(false);
  this.searchTrigger = ko.observable(null);
  this.searchDateStartFocus = ko.observable(false);
  this.searchDateEndFocus = ko.observable(false);
  this.searchDateStartDom = ko.observable(null);
  this.searchDateStartTimestamp = ko.observable('');
  this.searchDateStart = ko.observable('');
  this.searchDateStart.subscribe(function (v) {
    if (v) {
      _this.searchDateStartTimestamp(moment(v, Utils.getDateFormatForMoment(UserSettings.dateFormat())).toDate().getTime() / 1000);
    }
  });
  this.searchDateEndDom = ko.observable(null);
  this.searchDateEndTimestamp = ko.observable('');
  this.searchDateEnd = ko.observable('');
  this.searchDateEnd.subscribe(function (v) {
    if (v) {
      _this.searchDateEndTimestamp(moment(v, Utils.getDateFormatForMoment(UserSettings.dateFormat())).toDate().getTime() / 1000);
    }
  });
  this.dateFormatDatePicker = ko.computed(function () {
    return CalendarUtils.getDateFormatForDatePicker(UserSettings.dateFormat());
  });
  UserSettings.dateFormat.subscribe(function () {
    var dateModelStart = new CDateModel();
    var dateModelEnd = new CDateModel();
    if (_this.searchDateStartTimestamp()) {
      dateModelStart.parse(_this.searchDateStartTimestamp());
      _this.searchDateStart(dateModelStart.getShortDate());
    }
    if (_this.searchDateEndTimestamp()) {
      dateModelEnd.parse(_this.searchDateEndTimestamp());
      _this.searchDateEnd(dateModelEnd.getShortDate());
    }
    _this.createDatePickerObject(_this.searchDateStartDom(), _this.searchDateStart);
    _this.createDatePickerObject(_this.searchDateEndDom(), _this.searchDateEnd);
    _this.searchHighlightedInputFormatted(DateUtils.formattedDateSearchHighlightedInput(_this.searchHighlightedInput()));
  });
  this.attachmentsPlaceholder = ko.computed(function () {
    return TextUtils.i18n('MAILWEBCLIENT/LABEL_HAS_ATTACHMENTS');
  }, this);
  this.customMessageItemViewTemplate = ko.observable('');
  ;
  App.broadcastEvent('MailWebclient::ConstructView::after', {
    'Name': this.ViewConstructorName,
    'View': this,
    'MailCache': MailCache
  });
}
CMessageListView.prototype.ViewTemplate = 'MailWebclient_MessagesView';
CMessageListView.prototype.ViewConstructorName = 'CMessageListView';
CMessageListView.prototype.addNewAccount = function () {
  App.Api.createMailAccount(AccountList.getEmail());
};
CMessageListView.prototype.createDatePickerObject = function (oElement, value) {
  $(oElement).datepicker("destroy");
  $(oElement).datepicker({
    showOtherMonths: true,
    selectOtherMonths: true,
    monthNames: CoreDateUtils.getMonthNamesArray(),
    dayNamesMin: TextUtils.i18n('COREWEBCLIENT/LIST_DAY_NAMES_MIN').split(' '),
    nextText: '',
    prevText: '',
    firstDay: Types.pInt(ModulesManager.run('CalendarWebclient', 'getWeekStartsOn')),
    showOn: 'focus',
    dateFormat: this.dateFormatDatePicker(),
    onClose: function onClose(sValue) {
      if (ko.isObservable(value)) {
        value(sValue);
      }
    }
  });
  $(oElement).mousedown(function () {
    $('#ui-datepicker-div').toggle();
  });
};

/**
 * @param {string} sFolder
 * @param {number} iPage
 * @param {string} sUid
 * @param {string} sSearch
 * @param {string} sFilters
 * @param {string} sSortBy
 * @param {number} iSortOrder
 */
CMessageListView.prototype.changeRoutingForMessageList = function (sFolder, iPage, sUid, sSearch, sFilters, sSortBy, iSortOrder) {
  var bSame = Routing.setHash(LinksUtils.getMailbox(sFolder, iPage, sUid, sSearch, sFilters, sSortBy, iSortOrder));
  if (bSame && sSearch.length > 0 && this.search() === sSearch) {
    this.listChangedThrottle(!this.listChangedThrottle());
  }
};

/**
 * @param {CMessageModel} oMessage
 */
CMessageListView.prototype.onEnterPress = function (oMessage) {
  if (oMessage.threadNextLoadingVisible()) {
    oMessage.loadNextMessages();
  } else {
    oMessage.openThread();
  }
};

/**
 * @param {CMessageModel} oMessage
 */
CMessageListView.prototype.onMessageDblClick = function (oMessage) {
  if (!this.isSavingDraft(oMessage)) {
    var oFolder = this.folderList().getFolderByFullName(oMessage.folder()),
      oParams = {
        Message: oMessage,
        Cancel: false
      };
    App.broadcastEvent('MailWebclient::MessageDblClick::before', oParams);
    if (!oParams.Cancel) {
      if (oFolder.type() === Enums.FolderTypes.Drafts || MailCache.isTemplateFolder(oMessage.folder())) {
        ComposeUtils.composeMessageFromDrafts(oMessage.accountId(), oMessage.folder(), oMessage.longUid());
      } else {
        this.openMessageInNewWindowBound(oMessage);
      }
    }
  }
};
CMessageListView.prototype.onFolderListSubscribe = function () {
  this.setCurrentFolder();
  this.requestMessageList();
};

/**
 * @param {Array} aParams
 */
CMessageListView.prototype.onShow = function (aParams) {
  this.selector.useKeyboardKeys(true);
  this.oPageSwitcher.show();
  if (this.oJua) {
    this.oJua.setDragAndDropEnabledStatus(true);
  }
};

/**
 * @param {Array} aParams
 */
CMessageListView.prototype.onHide = function (aParams) {
  this.selector.useKeyboardKeys(false);
  this.oPageSwitcher.hide();
  if (this.oJua) {
    this.oJua.setDragAndDropEnabledStatus(false);
  }
};
function correctSearchFromParams(filtersFromParams, searchFromParams) {
  if (filtersFromParams === Enums.FolderFilter.Flagged && Settings.AllowChangeStarredMessagesSource) {
    if (/(^|\s)folders:all(\s|$)/.test(searchFromParams)) {
      if (Settings.StarredMessagesSource === Enums.StarredMessagesSource.InboxOnly) {
        return searchFromParams.replace('folders:all', '');
      }
    } else {
      if (Settings.StarredMessagesSource === Enums.StarredMessagesSource.AllFolders) {
        return "".concat(searchFromParams, " folders:all");
      }
    }
  }
  return searchFromParams;
}
;

/**
 * @param {Array} aParams
 */
CMessageListView.prototype.onRoute = function (aParams) {
  var oParams = LinksUtils.parseMailbox(aParams),
    sCurrentFolder = this.folderFullName() || this.folderList().inboxFolderFullName(),
    searchFromParams = correctSearchFromParams(oParams.Filters, oParams.Search),
    bRouteChanged = this.currentPage() !== oParams.Page || sCurrentFolder !== oParams.Folder || this.filters() !== oParams.Filters || oParams.Filters === Enums.FolderFilter.Unseen && MailCache.waitForUnseenMessages() || this.search() !== searchFromParams || this.sSortBy !== oParams.SortBy || this.iSortOrder !== oParams.SortOrder,
    bMailsPerPageChanged = Settings.MailsPerPage !== this.oPageSwitcher.perPage();
  this.pageSwitcherLocked(true);
  if (sCurrentFolder !== oParams.Folder || this.search() !== searchFromParams || this.filters() !== oParams.Filters) {
    this.oPageSwitcher.clear();
  } else {
    this.oPageSwitcher.setPage(oParams.Page, Settings.MailsPerPage);
  }
  this.pageSwitcherLocked(false);
  if (searchFromParams !== oParams.Search) {
    Routing.replaceHash(LinksUtils.getMailbox(oParams.Folder, this.oPageSwitcher.currentPage(), oParams.Uid, searchFromParams, oParams.Filters));
  } else if (oParams.Page !== this.oPageSwitcher.currentPage()) {
    if (this.folderList().iAccountId === 0) {
      this.aRouteParams = aParams;
    } else {
      Routing.replaceHash(LinksUtils.getMailbox(oParams.Folder, this.oPageSwitcher.currentPage(), oParams.Uid, searchFromParams, oParams.Filters));
    }
  }
  this.currentPage(this.oPageSwitcher.currentPage());
  this.folderFullName(oParams.Folder);
  this.filters(oParams.Filters);
  this.search(searchFromParams);
  this.searchInput(this.search());
  this.setSearchFolderMode();
  this.searchSpan.notifySubscribers();
  this.sSortBy = oParams.SortBy;
  this.iSortOrder = oParams.SortOrder;
  this.sortBy(oParams.SortBy);
  this.sortOrder(oParams.SortOrder);
  this.setCurrentFolder();
  if (bRouteChanged || bMailsPerPageChanged || this.collection().length === 0) {
    if (oParams.Filters === Enums.FolderFilter.Unseen) {
      MailCache.waitForUnseenMessages(true);
    }
    this.requestMessageList();
    this.messageListParamsChanged(true);
  }
  this.highlightTrigger.notifySubscribers(true);
};
CMessageListView.prototype.setSearchFolderMode = function () {
  if (/(^|\s)folders:all(\s|$)/.test(this.search())) {
    this.searchFoldersMode(Enums.SearchFoldersMode.All);
  } else if (/(^|\s)folders:sub(\s|$)/.test(this.search())) {
    this.searchFoldersMode(Enums.SearchFoldersMode.Sub);
  } else {
    this.searchFoldersMode(Enums.SearchFoldersMode.Current);
  }
};
CMessageListView.prototype.setCurrentFolder = function () {
  MailCache.setCurrentFolder(this.folderFullName(), this.filters());
  this.folderType(MailCache.getCurrentFolderType());
};
CMessageListView.prototype.requestMessageList = function () {
  var sFullName = MailCache.getCurrentFolderFullname(),
    iPage = this.oPageSwitcher.currentPage();
  if (sFullName.length > 0) {
    MailCache.changeCurrentMessageList(sFullName, iPage, this.search(), this.filters(), this.sortBy(), this.sortOrder());
  } else {
    MailCache.checkCurrentFolderList();
  }
};
CMessageListView.prototype.calculateSearchStringFromAdvancedForm = function () {
  var sFrom = this.searchInputFrom(),
    sTo = this.searchInputTo(),
    sSubject = this.searchInputSubject(),
    sText = this.searchInputText(),
    bAttachmentsCheckbox = this.searchAttachmentsCheckbox(),
    _DateUtils$changeDate = DateUtils.changeDateStartAndDateEndformatForSend(this.searchDateStart(), this.searchDateEnd()),
    _DateUtils$changeDate2 = _slicedToArray(_DateUtils$changeDate, 2),
    dateStartServerFormat = _DateUtils$changeDate2[0],
    dateEndServerFormat = _DateUtils$changeDate2[1],
    aOutput = [],
    fEsc = function fEsc(sText) {
      sText = $.trim(sText).replace(/"/g, '\\"');
      if (-1 < sText.indexOf(' ') || -1 < sText.indexOf('"')) {
        sText = '"' + sText + '"';
      }
      return sText;
    };
  if (sFrom !== '') {
    aOutput.push('from:' + fEsc(sFrom));
  }
  if (sTo !== '') {
    aOutput.push('to:' + fEsc(sTo));
  }
  if (sSubject !== '') {
    aOutput.push('subject:' + fEsc(sSubject));
  }
  if (sText !== '') {
    aOutput.push('text:' + fEsc(sText));
  }
  if (bAttachmentsCheckbox) {
    aOutput.push('has:attachments');
  }
  if (dateStartServerFormat !== '' || dateEndServerFormat !== '') {
    aOutput.push('date:' + fEsc(dateStartServerFormat) + '/' + fEsc(dateEndServerFormat));
  }
  if (this.selectedSearchFoldersMode() === Enums.SearchFoldersMode.Sub || this.selectedSearchFoldersMode() === Enums.SearchFoldersMode.All) {
    aOutput.push('folders:' + this.selectedSearchFoldersMode());
  }
  return aOutput.join(' ');
};
CMessageListView.prototype.manualChangeSearchString = function (searchInput) {
  var searchKeywords = ['date:', 'subject:', 'text:', 'from:', 'to:', 'has:', 'folders:'];
  var regex = new RegExp('\\s(' + searchKeywords.join('|') + ')', 'g');
  var searchInputArr = (' ' + searchInput).split(regex);
  var newSearchInput = '';
  if (searchInputArr.length > 1) {
    //there are keywords in the search string
    for (var i = 1; i < searchInputArr.length; i = i + 2) {
      var keyword = searchInputArr[i];
      var value = searchInputArr[i + 1];
      if (keyword === searchKeywords[0]) {
        var _value$split = value.split(' - '),
          _value$split2 = _slicedToArray(_value$split, 2),
          dateStartClientFormat = _value$split2[0],
          dateEndClientFormat = _value$split2[1];
        var _DateUtils$changeDate3 = DateUtils.changeDateStartAndDateEndformatForSend(dateStartClientFormat, dateEndClientFormat),
          _DateUtils$changeDate4 = _slicedToArray(_DateUtils$changeDate3, 2),
          dateStartServerFormat = _DateUtils$changeDate4[0],
          dateEndServerFormat = _DateUtils$changeDate4[1];
        if (dateStartServerFormat || dateEndServerFormat) {
          newSearchInput += keyword + dateStartServerFormat + '/' + dateEndServerFormat + ' ';
        }
      } else {
        newSearchInput += keyword + value + ' ';
      }
    }
  } else {
    newSearchInput = searchInput; //search string is just a text an has no any keywords
  }
  return newSearchInput;
};
CMessageListView.prototype.onSearchClick = function () {
  var sFolder = MailCache.getCurrentFolderFullname(),
    iPage = 1,
    searchInput = this.searchInput();
  if (this.allowAdvancedSearch() && this.bAdvancedSearch()) {
    searchInput = this.calculateSearchStringFromAdvancedForm();
    this.bAdvancedSearch(false);
  } else {
    searchInput = this.manualChangeSearchString(searchInput);
  }
  this.changeRoutingForMessageList(sFolder, iPage, '', searchInput, this.filters());
};
CMessageListView.prototype.onRetryClick = function () {
  this.requestMessageList();
};
CMessageListView.prototype.onClearSearchClick = function () {
  var sFolder = MailCache.getCurrentFolderFullname(),
    sUid = this.currentMessage() ? this.currentMessage().longUid() : '',
    sSearch = '',
    iPage = 1;
  this.clearAdvancedSearch();
  this.changeRoutingForMessageList(sFolder, iPage, sUid, sSearch, this.filters(), this.sortBy(), this.sortOrder());
};
CMessageListView.prototype.onClearFilterClick = function () {
  var sFolder = MailCache.getCurrentFolderFullname(),
    sUid = this.currentMessage() ? this.currentMessage().longUid() : '',
    sSearch = '',
    iPage = 1,
    sFilters = '';
  this.clearAdvancedSearch();
  this.changeRoutingForMessageList(sFolder, iPage, sUid, sSearch, sFilters, this.sortBy(), this.sortOrder());
};
CMessageListView.prototype.onStopSearchClick = function () {
  this.onClearSearchClick();
};

/**
 * @param {Object} oMessage
 */
CMessageListView.prototype.isSavingDraft = function (oMessage) {
  var oFolder = MailCache.getCurrentFolder();
  return oFolder.type() === Enums.FolderTypes.Drafts && oMessage.longUid() === MailCache.savingDraftUid();
};

/**
 * @param {Object} oMessage
 */
CMessageListView.prototype.routeForMessage = function (oMessage) {
  if (oMessage && oMessage.longUid && !this.isSavingDraft(oMessage)) {
    var oFolder = MailCache.getCurrentFolder(),
      sFolder = MailCache.getCurrentFolderFullname(),
      iPage = this.oPageSwitcher.currentPage(),
      sUid = oMessage.longUid(),
      sCurrentUid = this.currentMessage() ? this.currentMessage().longUid() : '',
      sSearch = this.search();
    if (sUid !== '' && sUid !== sCurrentUid) {
      if (App.isMobile() && oFolder.type() === Enums.FolderTypes.Drafts) {
        Routing.setHash(LinksUtils.getComposeFromMessage('drafts', oMessage.accountId(), oMessage.folder(), oMessage.longUid()));
      } else {
        this.changeRoutingForMessageList(sFolder, iPage, sUid, sSearch, this.filters(), this.sortBy(), this.sortOrder());
        if (App.isMobile() && MailCache.currentMessage() && sUid === MailCache.currentMessage().longUid()) {
          MailCache.currentMessage.valueHasMutated();
        }
      }
    }
  }
};
CMessageListView.prototype.unbind = function () {
  this.selector.unbind();
};

/**
 * @param {Object} $viewDom
 */
CMessageListView.prototype.onBind = function ($viewDom) {
  var self = this,
    fStopPopagation = _.bind(function (oEvent) {
      if (oEvent && oEvent.stopPropagation) {
        oEvent.stopPropagation();
      }
    }, this);
  $('.message_list', $viewDom).on('click', function () {
    self.isFocused(false);
  }).on('click', '.message_sub_list .item .flag', function (oEvent) {
    self.onFlagClick(ko.dataFor(this));
    if (oEvent && oEvent.stopPropagation) {
      oEvent.stopPropagation();
    }
  }).on('dblclick', '.message_sub_list .item .flag', fStopPopagation).on('click', '.message_sub_list .item .thread-pin', fStopPopagation).on('dblclick', '.message_sub_list .item .thread-pin', fStopPopagation);
  this.selector.initOnApplyBindings('.message_sub_list .item', '.message_sub_list .item.selected', '.message_sub_list .item .custom_checkbox', $('.message_list', $viewDom), $('.message_list_scroll.scroll-inner', $viewDom));
  _.delay(_.bind(function () {
    this.createDatePickerObject(this.searchDateStartDom(), this.searchDateStart);
    this.createDatePickerObject(this.searchDateEndDom(), this.searchDateEnd);
  }, this), 1000);
  this.initUploader();
};

/**
 * Puts / removes the message flag by clicking on it.
 *
 * @param {Object} oMessage
 */
CMessageListView.prototype.onFlagClick = function (oMessage) {
  if (!this.isSavingDraft(oMessage)) {
    MailCache.executeGroupOperation('SetMessageFlagged', [oMessage.longUid()], 'flagged', !oMessage.flagged());
  }
};

/**
 * Marks the selected messages read.
 */
CMessageListView.prototype.executeMarkAsRead = function () {
  MailCache.executeGroupOperation('SetMessagesSeen', this.checkedOrSelectedUids(), 'seen', true);
};

/**
 * Marks the selected messages unread.
 */
CMessageListView.prototype.executeMarkAsUnread = function () {
  MailCache.executeGroupOperation('SetMessagesSeen', this.checkedOrSelectedUids(), 'seen', false);
};

/**
 * Marks Read all messages in a folder.
 */
CMessageListView.prototype.executeMarkAllRead = function () {
  MailCache.executeGroupOperation('SetAllMessagesSeen', [], 'seen', true);
};

/**
 * Moves the selected messages in the current folder in the specified.
 * 
 * @param {string} sToFolder
 */
CMessageListView.prototype.executeMoveToFolder = function (sToFolder) {
  var oToFolder = MailCache.getFolderByFullName(MailCache.currentAccountId(), sToFolder),
    aLongUids = this.checkedOrSelectedUids(),
    oUidsByFolders = MailCache.getUidsSeparatedByFolders(aLongUids);
  if (oToFolder) {
    _.each(oUidsByFolders, function (oData) {
      if (MailCache.currentAccountId() === oData.iAccountId) {
        var oFromFolder = MailCache.getFolderByFullName(MailCache.currentAccountId(), oData.sFolder);
        if (oFromFolder) {
          MailCache.moveMessagesToFolder(oFromFolder, oToFolder, oData.aUids);
        }
      }
    });
  }
};
CMessageListView.prototype.executeCopyToFolder = function (toFolderName) {
  var toFolder = MailCache.getFolderByFullName(MailCache.currentAccountId(), toFolderName),
    longUids = this.checkedOrSelectedUids(),
    uidsByFolders = MailCache.getUidsSeparatedByFolders(longUids);
  if (toFolder) {
    _.each(uidsByFolders, function (data) {
      if (MailCache.currentAccountId() === data.iAccountId) {
        var fromFolder = MailCache.getFolderByFullName(MailCache.currentAccountId(), data.sFolder);
        if (fromFolder) {
          MailCache.copyMessagesToFolder(fromFolder, toFolder, data.aUids);
        }
      }
    });
  }
};

/**
 * Calls for the selected messages delete operation. Called from the keyboard.
 * 
 * @param {Array} aMessages
 */
CMessageListView.prototype.onDeletePress = function (aMessages) {
  var aUids = _.map(aMessages, function (oMessage) {
    return oMessage.longUid();
  });
  if (aUids.length > 0) {
    this.deleteMessages(aUids);
  }
};

/**
 * Calls for the selected messages delete operation. Called by the mouse click on the delete button.
 */
CMessageListView.prototype.executeDelete = function () {
  this.deleteMessages(this.checkedOrSelectedUids());
};

/**
 * @param {Array} aUids
 */
CMessageListView.prototype.deleteMessages = function (aUids) {
  var sUidToOpenAfter = '',
    oMessageToOpenAfter = null;
  if (MailCache.uidList().filters() !== Enums.FolderFilter.Unseen && aUids.length === 1 && MailCache.currentMessage() && aUids[0] === MailCache.currentMessage().longUid()) {
    sUidToOpenAfter = MailCache.prevMessageUid();
    if (sUidToOpenAfter === '') {
      sUidToOpenAfter = MailCache.nextMessageUid();
    }
  }
  if (aUids.length > 0) {
    MailUtils.deleteMessages(aUids, function () {
      if (sUidToOpenAfter !== '') {
        oMessageToOpenAfter = _.find(this.collection(), function (oMessage) {
          return oMessage && _.isFunction(oMessage.longUid) && (oMessage.longUid() === sUidToOpenAfter || oMessage.uid() === sUidToOpenAfter);
        });
        if (oMessageToOpenAfter) {
          this.routeForMessage(oMessageToOpenAfter);
        }
      }
    }.bind(this));
  }
};

/**
 * Moves the selected messages from the current folder to the folder Spam.
 */
CMessageListView.prototype.executeSpam = function () {
  var aLongUids = this.checkedOrSelectedUids(),
    oUidsByFolders = MailCache.getUidsSeparatedByFolders(aLongUids);
  _.each(oUidsByFolders, function (oData) {
    var oFolderList = MailCache.oFolderListItems[oData.iAccountId],
      oAccSpam = oFolderList ? oFolderList.spamFolder() : null,
      oAccFolder = oFolderList ? oFolderList.getFolderByFullName(oData.sFolder) : null;
    ;
    if (oAccFolder && oAccSpam && oAccFolder.fullName() !== oAccSpam.fullName()) {
      MailCache.moveMessagesToFolder(oAccFolder, oAccSpam, oData.aUids);
    }
  });
};

/**
 * Moves the selected messages from the Spam folder to folder Inbox.
 */
CMessageListView.prototype.executeNotSpam = function () {
  var oCurrentFolder = MailCache.getCurrentFolder(),
    oInbox = this.folderList().inboxFolder(),
    aLongUids = this.checkedOrSelectedUids(),
    oUidsByFolders = MailCache.getUidsSeparatedByFolders(aLongUids);
  if (oInbox && oCurrentFolder && oCurrentFolder.fullName() !== oInbox.fullName()) {
    _.each(oUidsByFolders, function (oData) {
      if (oCurrentFolder.iAccountId === oData.iAccountId && oCurrentFolder.fullName() === oData.sFolder) {
        MailCache.moveMessagesToFolder(oCurrentFolder, oInbox, oData.aUids);
      }
    });
  }
};
CMessageListView.prototype.executeSort = function (sSortBy) {
  var sCurrentSort = this.sortBy();
  this.sortBy(sSortBy);
  if (sCurrentSort === sSortBy) {
    this.sortOrder(this.sortOrder() === Enums.SortOrder.Asc ? Enums.SortOrder.Desc : Enums.SortOrder.Asc); // Asc: 0, Desc: 1
  } else {
    this.sortOrder(Settings.MessagesSortBy.DefaultSortOrder);
  }
  var sFolder = MailCache.getCurrentFolderFullname(),
    iPage = this.oPageSwitcher.currentPage(),
    sUid = '';
  this.changeRoutingForMessageList(sFolder, iPage, sUid, this.search(), this.filters(), this.sortBy(), this.sortOrder());
};
CMessageListView.prototype.clearAdvancedSearch = function () {
  this.searchInputFrom('');
  this.searchInputTo('');
  this.searchInputSubject('');
  this.searchInputText('');
  this.bAdvancedSearch(false);
  this.searchAttachmentsCheckbox(false);
  this.searchAttachments('');
  this.searchDateStart('');
  this.searchDateEnd('');
  this.selectedSearchFoldersMode(this.isStarredInAllFolders() ? 'all' : '');
};
CMessageListView.prototype.onAdvancedSearchClick = function () {
  this.bAdvancedSearch(!this.bAdvancedSearch());
};
CMessageListView.prototype.calculateSearchStringForDescription = function () {
  return TextUtils.encodeHtml(this.searchHighlightedInputFormatted().replace(/(^|\s)folders:(all|sub)(\s|$)/, ''));
};
CMessageListView.prototype.initUploader = function () {
  var self = this;
  if (this.uploaderArea()) {
    this.oJua = new CJua({
      'action': '?/Api/',
      'name': 'jua-uploader',
      'queueSize': 2,
      'dragAndDropElement': this.uploaderArea(),
      'disableAjaxUpload': false,
      'disableFolderDragAndDrop': false,
      'disableDragAndDrop': false,
      'hidden': _.extendOwn({
        'Module': Settings.ServerModuleName,
        'Method': 'UploadMessage',
        'Parameters': function Parameters() {
          return JSON.stringify({
            'AccountID': MailCache.currentAccountId(),
            'Folder': self.folderFullName()
          });
        }
      }, App.getCommonRequestParameters())
    });
    this.oJua.on('onDrop', _.bind(this.onFileDrop, this)).on('onComplete', _.bind(this.onFileUploadComplete, this)).on('onBodyDragEnter', _.bind(this.bDragActive, this, true)).on('onBodyDragLeave', _.bind(this.bDragActive, this, false));
  }
};
CMessageListView.prototype.onFileDrop = function (oData) {
  if (!(oData && oData.File && oData.File.type && oData.File.type.indexOf('message/') === 0)) {
    Screens.showError(TextUtils.i18n('MAILWEBCLIENT/ERROR_FILE_NOT_EML'));
  }
};
CMessageListView.prototype.onFileUploadComplete = function (sFileUid, bResponseReceived, oResponse) {
  var bSuccess = bResponseReceived && oResponse && !oResponse.ErrorCode;
  if (bSuccess) {
    MailCache.executeCheckMail(true);
  } else {
    Api.showErrorByCode(oResponse || {}, TextUtils.i18n('COREWEBCLIENT/ERROR_UPLOAD_FILE'));
  }
};
CMessageListView.prototype.selectFolderSearch = function (sSearchFoldersMode) {
  this.selectedSearchFoldersMode(sSearchFoldersMode);
};
module.exports = CMessageListView;

/***/ }),

/***/ "t/bC":
/*!************************************************!*\
  !*** ./modules/MailWebclient/js/utils/Date.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "KIwC"),
  moment = __webpack_require__(/*! moment */ "sdEb"),
  DateUtils = {},
  dateFormatForBackEnd = 'YYYY.MM.DD';
DateUtils.formattedDateSearchHighlightedInput = function (inputString) {
  var userDateFormatMoment = Utils.getDateFormatForMoment(UserSettings.dateFormat());
  var dateRegex = /date:([^/]*)(\/([^/]*))?/;
  var match = inputString.match(dateRegex);
  var dateStart = '';
  var dateEnd = '';
  if (match) {
    var dateStartMoment = moment(match[1], dateFormatForBackEnd);
    dateStart = dateStartMoment.isValid() ? dateStartMoment.format(userDateFormatMoment) : match[1];
    var dateEndMoment = moment(match[3], dateFormatForBackEnd);
    dateEnd = dateEndMoment.isValid() ? dateEndMoment.format(userDateFormatMoment) : match[3];
  }
  if (!dateStart && !dateEnd) return inputString;
  var regex = /(\w+):(\S+)/g;
  var matches = inputString.match(regex);
  var inputStringSplit = [];
  if (matches) {
    matches.forEach(function (match) {
      var parts = match.split(':');
      var secondPart = parts[0] === 'date' ? dateStart + ' - ' + dateEnd : parts[1];
      inputStringSplit.push(parts[0] + ':' + secondPart);
    });
  }
  return inputStringSplit.join(' ');
};
DateUtils.changeDateStartAndDateEndformatForSend = function (dateStartClientFormat, dateEndClientFormat) {
  var dateStartMoment = moment(dateStartClientFormat === null || dateStartClientFormat === void 0 ? void 0 : dateStartClientFormat.trim(), Utils.getDateFormatForMoment(UserSettings.dateFormat()));
  var dateEndMoment = moment(dateEndClientFormat === null || dateEndClientFormat === void 0 ? void 0 : dateEndClientFormat.trim(), Utils.getDateFormatForMoment(UserSettings.dateFormat()));
  var dateStartServerFormat = dateStartMoment.isValid() && dateStartMoment.format(dateFormatForBackEnd) || '';
  var dateEndServerFormat = dateEndMoment.isValid() && dateEndMoment.format(dateFormatForBackEnd) || '';
  return [dateStartServerFormat, dateEndServerFormat];
};
module.exports = DateUtils;

/***/ }),

/***/ "tnf/":
/*!*******************************************************************!*\
  !*** ./modules/MailWebclient/js/views/message/SpamButtonsView.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Ajax = __webpack_require__(/*! modules/MailWebclient/js/Ajax.js */ "P7bQ"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  MailCache = __webpack_require__(/*! modules/MailWebclient/js/Cache.js */ "eGl8");

/**
 * @constructor
 */
function SpamButtonsView() {
  this.allowSpamButtons = ko.observable(false);
  this.isCurrentMessageLoaded = ko.observable(false);
  this.neverSpamCommand = Utils.createCommand(this, this.neverSpam, this.isCurrentMessageLoaded);
  this.alwaysSpamCommand = Utils.createCommand(this, this.alwaysSpam, this.isCurrentMessageLoaded);
}
SpamButtonsView.prototype.ViewTemplate = 'MailWebclient_Message_SpamButtonsView';

/**
 * @param {Object} parameters
 */
SpamButtonsView.prototype.doAfterPopulatingMessage = function (parameters) {
  var message = MailCache.currentMessage(),
    account = message ? AccountList.getAccount(message.accountId()) : AccountList.getCurrent(),
    enableAllowBlockLists = account ? account.enableAllowBlockLists() : false,
    isTemplateFolder = MailCache.isTemplateFolder(message && message.folder());
  ;
  this.allowSpamButtons(enableAllowBlockLists && !isTemplateFolder);
  this.isCurrentMessageLoaded(!!parameters);
};
SpamButtonsView.prototype.neverSpam = function () {
  var message = MailCache.currentMessage(),
    email = message.oFrom.getFirstEmail(),
    parameters = {
      'AccountID': AccountList.editedId(),
      'Email': email
    };
  Ajax.send('AddEmailToAllowList', parameters, function (response) {
    if (response && response.Result) {
      Screens.showReport(TextUtils.i18n('MAILWEBCLIENT/REPORT_ADD_EMAIL_TO_ALLOWLIST_SUCCESS', {
        'EMAIL': email
      }));
    } else {
      Api.showErrorByCode(response, TextUtils.i18n('MAILWEBCLIENT/ERROR_ADD_EMAIL_TO_ALLOWLIST', {
        'EMAIL': email
      }));
    }
  }, this);
};
SpamButtonsView.prototype.alwaysSpam = function () {
  var message = MailCache.currentMessage(),
    email = message.oFrom.getFirstEmail(),
    parameters = {
      'AccountID': AccountList.editedId(),
      'Email': email
    };
  Ajax.send('AddEmailToBlockList', parameters, function (response) {
    if (response && response.Result) {
      Screens.showReport(TextUtils.i18n('MAILWEBCLIENT/REPORT_ADD_EMAIL_TO_BLOCKLIST_SUCCESS', {
        'EMAIL': email
      }));
    } else {
      Api.showErrorByCode(response, TextUtils.i18n('MAILWEBCLIENT/ERROR_ADD_EMAIL_TO_BLOCKLIST', {
        'EMAIL': email
      }));
    }
  }, this);
};
module.exports = new SpamButtonsView();

/***/ }),

/***/ "wvqg":
/*!************************************************************************************!*\
  !*** ./modules/MailWebclient/js/views/settings/FetcherOutgoingSettingsFormView.js ***!
  \************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "Z9uT"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CoreAjax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  AccountList = __webpack_require__(/*! modules/MailWebclient/js/AccountList.js */ "Fj7m"),
  Settings = __webpack_require__(/*! modules/MailWebclient/js/Settings.js */ "Ua3z"),
  CServerPropertiesView = __webpack_require__(/*! modules/MailWebclient/js/views/CServerPropertiesView.js */ "cVoG");

/**
 * @constructor
 */
function CFetcherOutgoingSettingsFormView() {
  CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
  this.fetcher = ko.observable(null);
  this.idFetcher = ko.observable(null);
  this.isEnabled = ko.observable(true);
  this.email = ko.observable('');
  this.userName = ko.observable('');
  this.isOutgoingEnabled = ko.observable(false);
  this.focusEmail = ko.observable(false);
  this.oOutgoing = new CServerPropertiesView(25, 465, 'fetcher_edit_outgoing', TextUtils.i18n('MAILWEBCLIENT/LABEL_SMTP_SERVER'));
  this.outgoingUseAuth = ko.observable(false);
  this.isAllEnabled = ko.computed(function () {
    return this.isEnabled() && this.isOutgoingEnabled();
  }, this);
  this.isAllEnabled.subscribe(function () {
    this.oOutgoing.isEnabled(this.isAllEnabled());
  }, this);
  this.oOutgoing.isEnabled(this.isAllEnabled());
  this.firstState = null;
}
_.extendOwn(CFetcherOutgoingSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
CFetcherOutgoingSettingsFormView.prototype.ViewTemplate = 'MailWebclient_Settings_FetcherOutgoingSettingsFormView';

/**
 * @param {Object} oFetcher
 */
CFetcherOutgoingSettingsFormView.prototype.onShow = function (oFetcher) {
  this.fetcher(oFetcher && oFetcher.FETCHER ? oFetcher : null);
  this.populate();
};
CFetcherOutgoingSettingsFormView.prototype.getCurrentValues = function () {
  return [this.isOutgoingEnabled(), this.oOutgoing.server(), this.oOutgoing.port(), this.oOutgoing.ssl(), this.outgoingUseAuth(), this.userName(), this.email()];
};
CFetcherOutgoingSettingsFormView.prototype.getParametersForSave = function () {
  if (this.fetcher()) {
    return {
      'FetcherId': this.idFetcher(),
      'IsOutgoingEnabled': this.isOutgoingEnabled(),
      'Email': $.trim(this.email()),
      'Name': this.userName(),
      'OutgoingServer': this.oOutgoing.server(),
      'OutgoingPort': this.oOutgoing.getIntPort(),
      'OutgoingUseSsl': this.oOutgoing.ssl(),
      'OutgoingUseAuth': this.outgoingUseAuth()
    };
  }
  return {};
};
CFetcherOutgoingSettingsFormView.prototype.save = function () {
  if (this.isEnabled()) {
    if (this.isEmptyRequiredFields()) {
      Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_REQUIRED_FIELDS_EMPTY'));
    } else {
      this.isSaving(true);
      this.updateSavedState();
      CoreAjax.send(Settings.FetchersServerModuleName, 'UpdateFetcherSmtpSettings', this.getParametersForSave(), this.onResponse, this);
    }
  }
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CFetcherOutgoingSettingsFormView.prototype.onResponse = function (oResponse, oRequest) {
  this.isSaving(false);
  if (!oResponse.Result) {
    Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_UNKNOWN'));
  } else {
    AccountList.populateFetchers();
    Screens.showReport(TextUtils.i18n('MAILWEBCLIENT/REPORT_SUCCESSFULLY_SAVED'));
  }
};
CFetcherOutgoingSettingsFormView.prototype.populate = function () {
  var oFetcher = this.fetcher();
  if (oFetcher) {
    this.fetcher(oFetcher);
    this.idFetcher(oFetcher.id());
    this.isEnabled(oFetcher.isEnabled());
    this.email(oFetcher.email());
    this.userName(oFetcher.userName());
    this.isOutgoingEnabled(oFetcher.isOutgoingEnabled());
    this.oOutgoing.set(oFetcher.outgoingServer(), oFetcher.outgoingPort(), oFetcher.outgoingUseSsl());
    this.outgoingUseAuth(oFetcher.outgoingUseAuth());
    this.updateSavedState();
  }
};
CFetcherOutgoingSettingsFormView.prototype.isEmptyRequiredFields = function () {
  if (this.isOutgoingEnabled()) {
    if (this.outgoingUseAuth() && this.isOutgoingEnabled() && '' === this.oOutgoing.server()) {
      this.oOutgoing.server.focused(true);
      return true;
    }
    if (this.outgoingUseAuth() && '' === $.trim(this.email())) {
      this.focusEmail(true);
      return true;
    }
  }
  return false;
};
module.exports = new CFetcherOutgoingSettingsFormView();

/***/ })

}]);