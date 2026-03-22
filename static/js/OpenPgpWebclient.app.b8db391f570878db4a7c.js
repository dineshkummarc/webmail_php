"use strict";
(self["webpackChunkafterlogic_aurora_platform"] = self["webpackChunkafterlogic_aurora_platform"] || []).push([[16],{

/***/ "22M0":
/*!****************************************************************!*\
  !*** ./modules/OpenPgpWebclient/js/popups/GenerateKeyPopup.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  $ = __webpack_require__(/*! jquery */ "M4cL"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  AddressUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Address.js */ "rBrp"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  ErrorsUtils = __webpack_require__(/*! modules/OpenPgpWebclient/js/utils/Errors.js */ "RIpb"),
  Enums = __webpack_require__(/*! modules/OpenPgpWebclient/js/Enums.js */ "vfpp"),
  OpenPgp = __webpack_require__(/*! modules/OpenPgpWebclient/js/OpenPgp.js */ "E7cO");

/**
 * @constructor
 */
function CGenerateKeyPopup() {
  CAbstractPopup.call(this);
  this.emails = ko.observableArray([]);
  this.selectedEmail = ko.observable('');
  this.password = ko.observable('');
  this.keyLengthOptions = [2048, 4096];
  this.selectedKeyLength = ko.observable(2048);
  this.process = ko.observable(false);
  this.keysExistText = ko.observable('');
}
_.extendOwn(CGenerateKeyPopup.prototype, CAbstractPopup.prototype);
CGenerateKeyPopup.prototype.PopupTemplate = 'OpenPgpWebclient_GenerateKeyPopup';
CGenerateKeyPopup.prototype.onOpen = function () {
  var aDefaultEmails = App.getUserPublicId ? [App.getUserPublicId()] : [],
    aEmails = ModulesManager.run('MailWebclient', 'getAllAccountsFullEmails') || aDefaultEmails,
    aKeys = OpenPgp.getKeys(),
    aKeysEmails = _.map(aKeys, function (oKey) {
      var oEmailParts = AddressUtils.getEmailParts(oKey.user);
      return oEmailParts.email;
    }),
    aEmailsToUse = [];
  _.each(aEmails, function (sEmail) {
    var oEmailParts = AddressUtils.getEmailParts(sEmail);
    if (_.indexOf(aKeysEmails, oEmailParts.email) === -1) {
      aEmailsToUse.push(sEmail);
    }
  });
  if (aEmailsToUse.length === 0) {
    this.keysExistText(TextUtils.i18n('OPENPGPWEBCLIENT/INFO_KEYS_EXIST_PLURAL', {}, null, aEmails.length));
  }
  this.emails(aEmailsToUse);
  this.selectedEmail('');
  this.password('');
  this.selectedKeyLength(2048);
  this.process(false);
};
CGenerateKeyPopup.prototype.generate = function () {
  if (this.emails().length === 0) {
    return;
  }
  var fKeysGenerated = _.bind(function () {
      Screens.showReport(TextUtils.i18n('OPENPGPWEBCLIENT/REPORT_KEY_SUCCESSFULLY_GENERATED'));
      this.process(false);
      this.closePopup();
    }, this),
    fKeysGenerateError = _.bind(function () {
      ErrorsUtils.showPgpErrorByCode({}, Enums.PgpAction.Generate);
      this.process(false);
      this.closePopup();
    }, this);
  this.process(true);
  _.delay(_.bind(function () {
    OpenPgp.generateKey(this.selectedEmail(), $.trim(this.password()), this.selectedKeyLength(), fKeysGenerated, fKeysGenerateError);
  }, this));
};
module.exports = new CGenerateKeyPopup();

/***/ }),

/***/ "5MYD":
/*!**********************************************************************!*\
  !*** ./modules/OpenPgpWebclient/js/views/OpenPgpSettingsFormView.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
  ErrorsUtils = __webpack_require__(/*! modules/OpenPgpWebclient/js/utils/Errors.js */ "RIpb"),
  GenerateKeyPopup = __webpack_require__(/*! modules/OpenPgpWebclient/js/popups/GenerateKeyPopup.js */ "22M0"),
  ImportKeyPopup = __webpack_require__(/*! modules/OpenPgpWebclient/js/popups/ImportKeyPopup.js */ "RqIR"),
  OpenPgp = __webpack_require__(/*! modules/OpenPgpWebclient/js/OpenPgp.js */ "E7cO"),
  Settings = __webpack_require__(/*! modules/OpenPgpWebclient/js/Settings.js */ "a9Z8"),
  ShowPublicKeysArmorPopup = __webpack_require__(/*! modules/OpenPgpWebclient/js/popups/ShowPublicKeysArmorPopup.js */ "Eq1/"),
  VerifyPasswordPopup = __webpack_require__(/*! modules/OpenPgpWebclient/js/popups/VerifyPasswordPopup.js */ "7EIX"),
  isTeamContactsAvailable = ModulesManager.isModuleAvailable('TeamContacts');

/**
 * @constructor
 */
function COpenPgpSettingsFormView() {
  CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
  this.bTeamContactsAvailable = isTeamContactsAvailable;
  this.enableOpenPgpInMail = ko.observable(Settings.enableOpenPgpInMail());
  this.rememberPassphrase = Settings.rememberPassphrase;
  this.isMailAvailable = ModulesManager.isModuleAvailable('Mail');
  this.keys = ko.observableArray(OpenPgp.getKeys());
  OpenPgp.getKeysObservable().subscribe(function () {
    this.keys(OpenPgp.getKeys());
  }, this);
  this.noOwnKeyInTeamContacts = ko.computed(function () {
    return OpenPgp.ownKeyFromTeamContacts() === false;
  });
  this.publicKeysFromThisDevice = ko.computed(function () {
    return this.keys().filter(function (key) {
      return !key.isFromContacts && key.isPublic();
    }).map(function (key) {
      var isOwn = isTeamContactsAvailable && key.getEmail() === App.getUserPublicId(),
        ownKeyFromTeamContacts = OpenPgp.ownKeyFromTeamContacts(),
        isSameKeyFromTeamContacts = isOwn && ownKeyFromTeamContacts && key.getId() === ownKeyFromTeamContacts.getId();
      return {
        key: key,
        user: key.getUser(),
        isOwn: isOwn,
        hasOwnKeyFromTeamContacts: !!ownKeyFromTeamContacts,
        isSameKeyFromTeamContacts: isSameKeyFromTeamContacts
      };
    });
  }, this);
  this.privateKeysFromThisDevice = ko.computed(function () {
    return this.keys().filter(function (key) {
      return !key.isFromContacts && key.isPrivate();
    }).map(function (key) {
      return {
        key: key,
        user: key.getUser()
      };
    });
  }, this);
  this.keysFromPersonalContacts = ko.computed(function () {
    return this.keys().filter(function (key) {
      return key.isFromContacts;
    }).map(function (key) {
      return {
        key: key,
        user: key.getUser()
      };
    });
  }, this);
  this.oPgpKeyControlsView = ModulesManager.run('OpenPgpWebclient', 'getPgpKeyControlsView');
}
_.extendOwn(COpenPgpSettingsFormView.prototype, CAbstractSettingsFormView.prototype);
COpenPgpSettingsFormView.prototype.ViewTemplate = 'OpenPgpWebclient_OpenPgpSettingsFormView';
COpenPgpSettingsFormView.prototype.saveOwnKeyToTeamContact = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(key) {
    var armor, res;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          armor = key.getArmor();
          _context.n = 1;
          return OpenPgp.addKeyToContact(armor, '', true);
        case 1:
          res = _context.v;
          if (res && res.result) {
            Screens.showReport(TextUtils.i18n('OPENPGPWEBCLIENT/REPORT_KEY_SUCCESSFULLY_IMPORTED_PLURAL', {}, null, 1));
          } else {
            ErrorsUtils.showPgpErrorByCode(res, Enums.PgpAction.Import, TextUtils.i18n('OPENPGPWEBCLIENT/ERROR_IMPORT_KEY'));
          }
        case 2:
          return _context.a(2);
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();
COpenPgpSettingsFormView.prototype.exportAllPublicKeys = function () {
  var armors = _.map(_.union(this.publicKeysFromThisDevice(), this.keysFromPersonalContacts()), function (keyData) {
    return keyData.key.getArmor();
  });
  if (armors.length > 0) {
    Popups.showPopup(ShowPublicKeysArmorPopup, [armors.join('\n')]);
  }
};
COpenPgpSettingsFormView.prototype.importKey = function () {
  Popups.showPopup(ImportKeyPopup, [{}]);
};
COpenPgpSettingsFormView.prototype.generateNewKey = function () {
  Popups.showPopup(GenerateKeyPopup);
};
COpenPgpSettingsFormView.prototype.removeKeyFromContacts = function (key) {
  this.oPgpKeyControlsView.removeKeyFromContacts(key);
};

/**
 * @param {Object} key
 */
COpenPgpSettingsFormView.prototype.removeKeyFromThisDevice = function (key) {
  this.oPgpKeyControlsView.removeKeyFromThisDevice(key);
};

/**
 * @param {Object} key
 */
COpenPgpSettingsFormView.prototype.showArmor = function (key) {
  var _this = this;
  if (key.isPublic()) {
    this.oPgpKeyControlsView.showArmor(key);
  } else {
    Popups.showPopup(VerifyPasswordPopup, [key, function () {
      _this.oPgpKeyControlsView.showArmor(key);
    }]);
  }
};
COpenPgpSettingsFormView.prototype.getCurrentValues = function () {
  return [this.enableOpenPgpInMail(), this.rememberPassphrase()];
};
COpenPgpSettingsFormView.prototype.revertGlobalValues = function () {
  this.enableOpenPgpInMail(Settings.enableOpenPgpInMail());
  this.rememberPassphrase(Settings.rememberPassphrase());
};
COpenPgpSettingsFormView.prototype.getParametersForSave = function () {
  return {
    'EnableModule': this.enableOpenPgpInMail(),
    'RememberPassphrase': this.rememberPassphrase()
  };
};
COpenPgpSettingsFormView.prototype.applySavedValues = function (oParameters) {
  Settings.update(oParameters.EnableModule);
};
module.exports = new COpenPgpSettingsFormView();

/***/ }),

/***/ "7EIX":
/*!*******************************************************************!*\
  !*** ./modules/OpenPgpWebclient/js/popups/VerifyPasswordPopup.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  ErrorsUtils = __webpack_require__(/*! modules/OpenPgpWebclient/js/utils/Errors.js */ "RIpb"),
  OpenPgp = __webpack_require__(/*! modules/OpenPgpWebclient/js/OpenPgp.js */ "E7cO");

/**
 * @constructor
 */
function CVerifyPasswordPopup() {
  CAbstractPopup.call(this);
  this.password = ko.observable('');
  this.oKey = null;
  this.fOkCallback = null;
}
_.extendOwn(CVerifyPasswordPopup.prototype, CAbstractPopup.prototype);
CVerifyPasswordPopup.prototype.PopupTemplate = 'OpenPgpWebclient_VerifyPasswordPopup';

/**
 * @param {object} oKey
 * @param {Function} fOkCallback
 */
CVerifyPasswordPopup.prototype.onOpen = function (oKey, fOkCallback) {
  this.password('');
  this.oKey = oKey;
  this.fOkCallback = fOkCallback;
};
CVerifyPasswordPopup.prototype.confirmPasswordAndView = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
  var oResult;
  return _regenerator().w(function (_context) {
    while (1) switch (_context.n) {
      case 0:
        _context.n = 1;
        return OpenPgp.verifyKeyPassword(this.oKey, this.password());
      case 1:
        oResult = _context.v;
        if (oResult.errors) {
          ErrorsUtils.showPgpErrorByCode(oResult);
        } else {
          if (_.isFunction(this.fOkCallback)) {
            this.fOkCallback();
            this.closePopup();
          }
        }
      case 2:
        return _context.a(2);
    }
  }, _callee, this);
}));
module.exports = new CVerifyPasswordPopup();

/***/ }),

/***/ "Eq1/":
/*!************************************************************************!*\
  !*** ./modules/OpenPgpWebclient/js/popups/ShowPublicKeysArmorPopup.js ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  ComposeMessageWithAttachments = ModulesManager.run('MailWebclient', 'getComposeMessageWithAttachments'),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av");

/**
 * @constructor
 */
function CShowKeyArmorPopup() {
  CAbstractPopup.call(this);
  this.bAllowSendEmails = _.isFunction(ComposeMessageWithAttachments);
  this.armors = ko.observable('');
  this.htmlArmor = ko.computed(function () {
    return TextUtils.encodeHtml(this.armors().replace(/\r/g, ''));
  }, this);
  this.popupHeading = ko.computed(function () {
    return TextUtils.i18n('OPENPGPWEBCLIENT/HEADING_VIEW_ALL_PUBLIC_KEYS');
  }, this);
  this.downloadLinkHref = ko.computed(function () {
    var sHref = '#',
      oBlob = null;
    if (Blob && window.URL && _.isFunction(window.URL.createObjectURL)) {
      oBlob = new Blob([this.armors()], {
        type: 'text/plain'
      });
      sHref = window.URL.createObjectURL(oBlob);
    }
    return sHref;
  }, this);
  this.downloadLinkFilename = ko.computed(function () {
    return TextUtils.i18n('OPENPGPWEBCLIENT/TEXT_ALL_PUBLIC_KEYS_FILENAME') + '.asc';
  }, this);
  this.domKey = ko.observable(null);
}
_.extendOwn(CShowKeyArmorPopup.prototype, CAbstractPopup.prototype);
CShowKeyArmorPopup.prototype.PopupTemplate = 'OpenPgpWebclient_ShowKeyArmorPopup';

/**
 * @param {string} sArmors
 */
CShowKeyArmorPopup.prototype.onOpen = function (sArmors) {
  this.armors(sArmors);
};
CShowKeyArmorPopup.prototype.send = function () {
  if (this.bAllowSendEmails && this.armors() !== '' && this.downloadLinkFilename() !== '') {
    Ajax.send('OpenPgpWebclient', 'SaveKeyAsTempFile', {
      'Content': this.armors(),
      'FileName': this.downloadLinkFilename()
    }, function (oResponse) {
      if (oResponse.Result) {
        ComposeMessageWithAttachments([oResponse.Result]);
        this.closePopup();
      }
    }, this);
  }
};
CShowKeyArmorPopup.prototype.select = function () {
  var oDomKey = this.domKey() && this.domKey().length === 1 ? this.domKey()[0] : null,
    oSel = null,
    oRange = null;
  if (oDomKey && window.getSelection && document.createRange) {
    oRange = document.createRange();
    oRange.setStart(oDomKey, 0);
    oRange.setEnd(oDomKey, 1);
    oSel = window.getSelection();
    oSel.removeAllRanges();
    oSel.addRange(oRange);
    if (document.queryCommandSupported('copy')) {
      document.execCommand('copy');
      Screens.showReport(TextUtils.i18n('OPENPGPWEBCLIENT/REPORT_KEY_IN_CLIPBOARD'));
    }
  }
};
module.exports = new CShowKeyArmorPopup();

/***/ }),

/***/ "Jrnf":
/*!************************************************!*\
  !*** ./modules/OpenPgpWebclient/js/manager.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var _ = __webpack_require__(/*! underscore */ "C3HO");
function IsPgpSupported() {
  return !!(window.crypto && window.crypto.getRandomValues);
}
module.exports = function (oAppData) {
  if (!IsPgpSupported()) {
    return null;
  }
  var Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
    App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
    Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt");
  var ImportKeyPopup = null; // ImportKeyPopup requires the OpenPGP library, so it should be required after verifying PGP support only

  var oModule = {
    getKeyInfo: function getKeyInfo(sValue, fCallback) {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var openpgp, COpenPgpKey, oPublicKey, oResult;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              openpgp = __webpack_require__(/*! modules/CoreWebclient/js/vendors/openpgp.js */ "h/lg"), COpenPgpKey = __webpack_require__(/*! modules/OpenPgpWebclient/js/COpenPgpKey.js */ "/bge"), oPublicKey = null, oResult = null;
              _context.n = 1;
              return openpgp.key.readArmored(sValue);
            case 1:
              oPublicKey = _context.v;
              if (oPublicKey && !oPublicKey.err && oPublicKey.keys && oPublicKey.keys[0]) {
                oResult = new COpenPgpKey(oPublicKey.keys[0]);
              }
              if (_.isFunction(fCallback)) {
                fCallback(oResult);
              }
              return _context.a(2, oResult);
          }
        }, _callee);
      }))();
    },
    getOpenPgpEncryptor: function getOpenPgpEncryptor() {
      var OpenPgp = __webpack_require__(/*! modules/OpenPgpWebclient/js/OpenPgp.js */ "E7cO");
      return OpenPgp;
    },
    getPgpKeyControlsView: function getPgpKeyControlsView(afterRemoveContactKeyHandler) {
      var pgpKeyControlsView = __webpack_require__(/*! modules/OpenPgpWebclient/js/views/PgpKeyControlsView.js */ "drFo");
      pgpKeyControlsView.setAfterRemoveContactKeyHandler(afterRemoveContactKeyHandler);
      return pgpKeyControlsView;
    },
    getSuggestionsAutocompleteFilteredCallback: function getSuggestionsAutocompleteFilteredCallback(fSuggestionsAutocompleteCallback) {
      return function (oRequest, fResponse) {
        var fResponseWrapper = function fResponseWrapper(oItems) {
          /*---here we can filter or edit response items---*/
          var OpenPgp = __webpack_require__(/*! modules/OpenPgpWebclient/js/OpenPgp.js */ "E7cO");
          var aPublicKeysEmails = OpenPgp.getPublicKeys().map(function (oKey) {
            return oKey.getEmail();
          });
          oItems.forEach(function (oItem) {
            if (!oItem.hasKey) {
              oItem.hasKey = aPublicKeysEmails.includes(oItem.email);
            }
          });
          /*-----------------------------------------------*/
          fResponse(oItems);
        };
        fSuggestionsAutocompleteCallback(oRequest, fResponseWrapper);
      };
    },
    getPrivateKeyPassword: function getPrivateKeyPassword(sEmail, fCallback) {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var OpenPgp, sPrivateKeyPassword;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              OpenPgp = __webpack_require__(/*! modules/OpenPgpWebclient/js/OpenPgp.js */ "E7cO");
              _context2.n = 1;
              return OpenPgp.getPrivateKeyPassword(sEmail);
            case 1:
              sPrivateKeyPassword = _context2.v;
              fCallback(sPrivateKeyPassword);
            case 2:
              return _context2.a(2);
          }
        }, _callee2);
      }))();
    },
    encryptSign: function encryptSign(bEncrypt, bSign, sData, aPrincipalsEmail, contactsUUIDs, fOkCallback) {
      var sFromEmail = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '';
      var sPrivateKeyPassword = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
      var Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
        ErrorsUtils = __webpack_require__(/*! modules/OpenPgpWebclient/js/utils/Errors.js */ "RIpb"),
        Enums = __webpack_require__(/*! modules/OpenPgpWebclient/js/Enums.js */ "vfpp"),
        OpenPgp = __webpack_require__(/*! modules/OpenPgpWebclient/js/OpenPgp.js */ "E7cO");
      var sPrivateEmail = bSign ? sFromEmail : '',
        sOkReport = '',
        sPgpAction = '',
        fOkHandler = _.bind(function (oRes) {
          if (_.isFunction(fOkCallback)) {
            fOkCallback(oRes.result, bEncrypt);
          }
        }, this),
        fErrorHandler = function fErrorHandler(oRes) {
          ErrorsUtils.showPgpErrorByCode(oRes, sPgpAction);
        };
      if (bEncrypt) {
        if (aPrincipalsEmail.length === 0) {
          Screens.showError(TextUtils.i18n('OPENPGPWEBCLIENT/ERROR_TO_ENCRYPT_SPECIFY_RECIPIENTS'));
        } else {
          var aUserEmail = [sFromEmail],
            aEmailForEncrypt = OpenPgp.findKeysByEmails(aUserEmail, true).length > 0 ? _.union(aPrincipalsEmail, aUserEmail) : aPrincipalsEmail;
          if (bSign) {
            sPgpAction = Enums.PgpAction.EncryptSign;
            OpenPgp.signAndEncrypt(sData, sPrivateEmail, aEmailForEncrypt, sPrivateKeyPassword, fOkHandler, fErrorHandler, contactsUUIDs);
          } else {
            sPgpAction = Enums.PgpAction.Encrypt;
            OpenPgp.encrypt(sData, aEmailForEncrypt, fOkHandler, fErrorHandler, contactsUUIDs);
          }
        }
      } else if (bSign) {
        sPgpAction = Enums.PgpAction.Sign;
        OpenPgp.sign(sData, sPrivateEmail, fOkHandler, fErrorHandler, sPrivateKeyPassword);
      }
    }
  };
  if (App.isUserNormalOrTenant()) {
    var Settings = __webpack_require__(/*! modules/OpenPgpWebclient/js/Settings.js */ "a9Z8");
    Settings.init(oAppData);
    _.extendOwn(oModule, {
      start: function start(ModulesManager) {
        var _this = this;
        ImportKeyPopup = __webpack_require__(/*! modules/OpenPgpWebclient/js/popups/ImportKeyPopup.js */ "RqIR");
        App.subscribeEvent('MailWebclient::RegisterMessagePaneController', function (fRegisterMessagePaneController) {
          fRegisterMessagePaneController(__webpack_require__(/*! modules/OpenPgpWebclient/js/views/MessageControlsView.js */ "rPFn"), 'BeforeMessageHeaders');
        });
        if (App.isMobile()) {
          ModulesManager.run('MailMobileWebclient', 'registerComposeToolbarController', [__webpack_require__(/*! modules/OpenPgpWebclient/js/views/ComposeButtonsView.js */ "XQac")]);
        } else {
          ModulesManager.run('MailWebclient', 'registerComposeToolbarController', [__webpack_require__(/*! modules/OpenPgpWebclient/js/views/ComposeButtonsView.js */ "XQac")]);
        }
        ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [function () {
          return __webpack_require__(/*! modules/OpenPgpWebclient/js/views/OpenPgpSettingsFormView.js */ "5MYD");
        }, Settings.HashModuleName, TextUtils.i18n('OPENPGPWEBCLIENT/LABEL_SETTINGS_TAB')]);
        App.subscribeEvent('MailWebclient::ParseFile::after', function (oFile) {
          if (oFile && _.isFunction(oFile.addAction) && Utils.getFileExtension(oFile.fileName()) === 'asc' && oFile.content && oFile.content()) {
            var OpenPgp = __webpack_require__(/*! modules/OpenPgpWebclient/js/OpenPgp.js */ "E7cO"),
              SendKeyPopup = __webpack_require__(/*! modules/OpenPgpWebclient/js/popups/SendKeyPopup.js */ "xLBO"),
              fOnSuccessCallback = function fOnSuccessCallback() {
                if (oFile.folderName() && oFile.messageUid()) {
                  var sUserEmail = App.currentAccountEmail ? App.currentAccountEmail() : '';
                  var aKeys = OpenPgp.getPublicKeysIfExistsByEmail(sUserEmail);
                  if (aKeys && aKeys[0]) {
                    ModulesManager.run('MailWebclient', 'getMessage', [oFile.folderName(), oFile.messageUid(), function (oMessage) {
                      Popups.showPopup(SendKeyPopup, [oMessage, aKeys[0]]);
                    }]);
                  }
                }
              },
              oActionData = {
                'Text': TextUtils.i18n('OPENPGPWEBCLIENT/ACTION_FILE_IMPORT_KEY'),
                'Handler': function Handler() {
                  Popups.showPopup(ImportKeyPopup, [{
                    armor: oFile.content(),
                    onSuccessCallback: fOnSuccessCallback
                  }]);
                }
              };
            oFile.addAction('import', true, oActionData);
            oFile.removeAction('view');
          }
        });
        App.subscribeEvent('FilesWebclient::ParseFile::after', function (aParams) {
          var oFile = aParams[0];
          if (oFile && _.isFunction(oFile.addAction) && Utils.getFileExtension(oFile.fileName()) === 'asc' && oFile.content && oFile.content()) {
            var oActionData = {
              'Text': TextUtils.i18n('OPENPGPWEBCLIENT/ACTION_FILE_IMPORT_KEY'),
              'Handler': function Handler() {
                Popups.showPopup(ImportKeyPopup, [{
                  armor: oFile.content()
                }]);
              }
            };
            oFile.addAction('import', true, oActionData);
          }
        });
        var createOrUpdateContactResult = /*#__PURE__*/function () {
          var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(oParams) {
            var oContact, fCallback, oKey, oResult;
            return _regenerator().w(function (_context3) {
              while (1) switch (_context3.n) {
                case 0:
                  oContact = oParams.Contact, fCallback = oParams.Callback, oKey = null, oResult = {
                    Error: false,
                    ErrorMessage: ''
                  };
                  if (!(oContact.PublicPgpKey != '')) {
                    _context3.n = 2;
                    break;
                  }
                  _context3.n = 1;
                  return _this.getKeyInfo(oContact.PublicPgpKey);
                case 1:
                  oKey = _context3.v;
                  if (oKey) {
                    if (oKey.getEmail() !== oContact.ViewEmail) {
                      oResult.Error = true;
                      oResult.ErrorMessage = TextUtils.i18n('OPENPGPWEBCLIENT/ERROR_EMAILS_DO_NOT_MATCH');
                    } else if (oKey.isPrivate()) {
                      oResult.Error = true;
                      oResult.ErrorMessage = TextUtils.i18n('OPENPGPWEBCLIENT/ERROR_ADDED_KEY_NOT_PUBLIC');
                    }
                  } else {
                    oResult.Error = true;
                    oResult.ErrorMessage = TextUtils.i18n('OPENPGPWEBCLIENT/ERROR_IMPORT_NO_KEY_FOUND');
                  }
                case 2:
                  fCallback(oResult);
                case 3:
                  return _context3.a(2);
              }
            }, _callee3);
          }));
          return function createOrUpdateContactResult(_x) {
            return _ref.apply(this, arguments);
          };
        }();

        // if (Settings.enableOpenPgpInMail())
        // {
        App.subscribeEvent('ContactsWebclient::beforeCreateContactRequest', createOrUpdateContactResult);
        App.subscribeEvent('ContactsWebclient::beforeUpdateContactRequest', createOrUpdateContactResult);
        // }
      },
      getOpenPgpInMailEnabledObservable: function getOpenPgpInMailEnabledObservable() {
        return Settings.enableOpenPgpInMail;
      }
    });
  }
  return oModule;
};

/***/ }),

/***/ "QGkc":
/*!************************************************************!*\
  !*** ./modules/OpenPgpWebclient/js/popups/EncryptPopup.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  ErrorsUtils = __webpack_require__(/*! modules/OpenPgpWebclient/js/utils/Errors.js */ "RIpb"),
  Enums = __webpack_require__(/*! modules/OpenPgpWebclient/js/Enums.js */ "vfpp"),
  OpenPgp = __webpack_require__(/*! modules/OpenPgpWebclient/js/OpenPgp.js */ "E7cO");

/**
 * @constructor
 */
function CEncryptPopup() {
  CAbstractPopup.call(this);
  this.data = ko.observable('');
  this.fromEmail = ko.observable('');
  this.emails = ko.observableArray([]);
  this.contactsUUIDs = [];
  this.successEncryptCallback = function () {};
  this.needToSign = ko.observable(true);
  this.needToEncrypt = ko.observable(true);
  this.signEncryptButtonText = ko.computed(function () {
    var text = TextUtils.i18n('OPENPGPWEBCLIENT/ACTION_SIGN_ENCRYPT');
    if (this.needToSign() && !this.needToEncrypt()) {
      text = TextUtils.i18n('OPENPGPWEBCLIENT/ACTION_SIGN');
    }
    if (!this.needToSign() && this.needToEncrypt()) {
      text = TextUtils.i18n('OPENPGPWEBCLIENT/ACTION_ENCRYPT');
    }
    return text;
  }, this);
  this.isEnableSignEncrypt = ko.computed(function () {
    return this.needToSign() || this.needToEncrypt();
  }, this);
  this.signEncryptCommand = Utils.createCommand(this, this.executeSignEncrypt, this.isEnableSignEncrypt);
}
_.extendOwn(CEncryptPopup.prototype, CAbstractPopup.prototype);
CEncryptPopup.prototype.PopupTemplate = 'OpenPgpWebclient_EncryptPopup';

/**
 * @param {string} dataToEncrypt
 * @param {string} fromEmail
 * @param {array} resipientsInfo
 * @param {function} successEncryptCallback
 */
CEncryptPopup.prototype.onOpen = function (dataToEncrypt, fromEmail, resipientsInfo, successEncryptCallback) {
  this.data(dataToEncrypt);
  this.fromEmail(fromEmail);
  this.emails(resipientsInfo.map(function (info) {
    return info.email;
  }));
  this.contactsUUIDs = resipientsInfo.map(function (info) {
    return info.uuid;
  });
  this.successEncryptCallback = _.isFunction(successEncryptCallback) ? successEncryptCallback : function () {};
  this.needToSign(true);
  this.needToEncrypt(true);
};
CEncryptPopup.prototype.executeSignEncrypt = function () {
  var _this = this;
  var dataToEncrypt = this.data(),
    privateEmail = this.needToSign() ? this.fromEmail() : '',
    successHandler = function successHandler(encryptResult) {
      Screens.showReport(okReport);
      _this.closePopup();
      _this.successEncryptCallback(encryptResult.result, _this.needToEncrypt());
    },
    errorHandler = function errorHandler(encryptResult) {
      if (!encryptResult || !encryptResult.userCanceled) {
        ErrorsUtils.showPgpErrorByCode(encryptResult, pgpAction);
      }
    };
  var okReport = '',
    pgpAction = '';
  if (this.needToEncrypt()) {
    if (this.emails().length === 0) {
      Screens.showError(TextUtils.i18n('OPENPGPWEBCLIENT/ERROR_TO_ENCRYPT_SPECIFY_RECIPIENTS'));
    } else {
      var userEmails = [this.fromEmail()],
        userPublicKeys = OpenPgp.findKeysByEmails(userEmails, true),
        principalsEmails = userPublicKeys.length > 0 ? _.union(this.emails(), userEmails) : this.emails();
      if (this.needToSign()) {
        pgpAction = Enums.PgpAction.EncryptSign;
        okReport = TextUtils.i18n('OPENPGPWEBCLIENT/REPORT_MESSAGE_SIGNED_ENCRYPTED_SUCCSESSFULLY');
        OpenPgp.signAndEncrypt(dataToEncrypt, privateEmail, principalsEmails, '', successHandler, errorHandler, this.contactsUUIDs);
      } else {
        pgpAction = Enums.PgpAction.Encrypt;
        okReport = TextUtils.i18n('OPENPGPWEBCLIENT/REPORT_MESSAGE_ENCRYPTED_SUCCSESSFULLY');
        OpenPgp.encrypt(dataToEncrypt, principalsEmails, successHandler, errorHandler, this.contactsUUIDs);
      }
    }
  } else if (this.needToSign()) {
    pgpAction = Enums.PgpAction.Sign;
    okReport = TextUtils.i18n('OPENPGPWEBCLIENT/REPORT_MESSAGE_SIGNED_SUCCSESSFULLY');
    OpenPgp.sign(dataToEncrypt, privateEmail, successHandler, errorHandler, '');
  }
};
CEncryptPopup.prototype.cancelPopup = function () {
  this.closePopup();
};
module.exports = new CEncryptPopup();

/***/ }),

/***/ "XQac":
/*!*****************************************************************!*\
  !*** ./modules/OpenPgpWebclient/js/views/ComposeButtonsView.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "uQaC"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "yU9o"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "MYiO"),
  EncryptPopup = __webpack_require__(/*! modules/OpenPgpWebclient/js/popups/EncryptPopup.js */ "QGkc"),
  Settings = __webpack_require__(/*! modules/OpenPgpWebclient/js/Settings.js */ "a9Z8");

/**
 * @constructor for object that display buttons "PGP Sign/Encrypt" and "Undo PGP"
 */
function CComposeButtonsView() {
  this.sId = 'OpenPgp';
  this.bAllowMobile = true;
  this.enableOpenPgpInMail = Settings.enableOpenPgpInMail;
  this.pgpSecured = ko.observable(false);
  this.pgpEncrypted = ko.observable(false);
  this.fromDrafts = ko.observable(false);
  this.disableHeadersEdit = this.pgpEncrypted;
  this.disableBodyEdit = this.pgpSecured;
  this.disableAutosave = this.pgpSecured;
  this.disableFromEdit = ko.computed(function () {
    return this.pgpEncrypted() || this.pgpSecured();
  }, this);
  this.visibleDoPgpButton = ko.computed(function () {
    return this.enableOpenPgpInMail() && (!this.pgpSecured() || this.pgpEncrypted() && this.fromDrafts());
  }, this);
  this.visibleUndoPgpButton = ko.computed(function () {
    return this.enableOpenPgpInMail() && this.pgpSecured() && (!this.pgpEncrypted() || !this.fromDrafts());
  }, this);
  this.isEnableOpenPgpCommand = ko.computed(function () {
    return this.enableOpenPgpInMail() && !this.pgpSecured();
  }, this);
  this.openPgpCommand = Utils.createCommand(this, this.confirmOpenPgp, this.isEnableOpenPgpCommand);
  this.bComposeModeChanged = false;
}
CComposeButtonsView.prototype.ViewTemplate = App.isMobile() ? 'OpenPgpWebclient_ComposeButtonsMobileView' : 'OpenPgpWebclient_ComposeButtonsView';

/**
 * Assigns compose external interface.
 * 
 * @param {Object} oCompose Compose external interface object.
 * @param {Function} oCompose.isHtml Returns **true** if html mode is switched on in html editor.
 * @param {Function} oCompose.hasAttachments Returns **true** if some files were attached to message.
 * @param {Function} oCompose.getPlainText Returns plain text from html editor. If html mode is switched on html text will be converted to plain and returned.
 * @param {Function} oCompose.getFromEmail Returns message sender email.
 * @param {Function} oCompose.getRecipientEmails Returns array of message recipients.
 * @param {Function} oCompose.getRecipientsInfo Returns array of message recipients info.
 * @param {Function} oCompose.saveSilently Saves message silently (without buttons disabling and any info messages).
 * @param {Function} oCompose.setPlainTextMode Sets plain text mode switched on.
 * @param {Function} oCompose.setPlainText Sets plain text to html editor.
 * @param {Function} oCompose.setHtmlTextMode Sets html text mode switched on.
 * @param {Function} oCompose.setHtmlText Sets html text to html editor.
 * @param {Function} oCompose.undoHtml Undo last changes in html editor.
 */
CComposeButtonsView.prototype.assignComposeExtInterface = function (oCompose) {
  this.oCompose = oCompose;
};

/**
 * @param {Object} oParameters
 */
CComposeButtonsView.prototype.doAfterApplyingMainTabParameters = function (oParameters) {
  if (oParameters.OpenPgp) {
    this.pgpSecured(oParameters.OpenPgp.Secured);
    this.pgpEncrypted(oParameters.OpenPgp.Encrypted);
    this.fromDrafts(oParameters.OpenPgp.FromDrafts);
    if (this.pgpSecured() || this.pgpEncrypted()) {
      this.fromDrafts(true);
    }
  }
};

/**
 * @param {Object} oParameters
 */
CComposeButtonsView.prototype.doAfterPreparingMainTabParameters = function (oParameters) {
  oParameters.OpenPgp = {
    Secured: this.pgpSecured(),
    Encrypted: this.pgpEncrypted(),
    FromDrafts: this.fromDrafts()
  };
};

/**
 * Receives message properties that are displayed when opening the compose popup.
 * 
 * @param {Object} oMessageProps Receiving message properties.
 * @param {Boolean} oMessageProps.bDraft **true** if message was opened from drafts folder.
 * @param {Boolean} oMessageProps.bPlain **true** if opened for compose message if plain.
 * @param {String} oMessageProps.sRawText Raw plain text of opened for compose message.
 */
CComposeButtonsView.prototype.doAfterPopulatingMessage = function (oMessageProps) {
  this.bComposeModeChanged = false;
  this.fromDrafts(oMessageProps.bDraft);
  if (oMessageProps.bPlain) {
    var bPgpEncrypted = oMessageProps.sRawText.indexOf('-----BEGIN PGP MESSAGE-----') !== -1,
      bPgpSigned = oMessageProps.sRawText.indexOf('-----BEGIN PGP SIGNED MESSAGE-----') !== -1;
    this.pgpSecured(bPgpSigned || bPgpEncrypted);
    this.pgpEncrypted(bPgpEncrypted);
  } else {
    this.pgpSecured(false);
    this.pgpEncrypted(false);
  }
};

/**
 * Executes before message saving. May cancel the saving and continue it later if it's necessary.
 * @param {Function} fContinueSaving Handler for continue message saving if it's necessary.
 * @returns {Boolean} If **true** message saving will be canceled.
 */
CComposeButtonsView.prototype.doBeforeSave = function (fContinueSaving) {
  if (this.pgpSecured()) {
    Popups.showPopup(ConfirmPopup, [TextUtils.i18n('OPENPGPWEBCLIENT/CONFIRM_SAVE_ENCRYPTED_DRAFT'), fContinueSaving, '', TextUtils.i18n('COREWEBCLIENT/ACTION_SAVE')]);
    return true;
  }
  return false;
};
CComposeButtonsView.prototype.confirmOpenPgp = function () {
  if (this.oCompose) {
    if (this.oCompose.getRecipientEmails().length < 1) {
      Screens.showError(TextUtils.i18n('OPENPGPWEBCLIENT/ERROR_TO_ENCRYPT_SPECIFY_RECIPIENTS'));
    } else if (this.oCompose.isHtml()) {
      var sConfirm = TextUtils.i18n('OPENPGPWEBCLIENT/CONFIRM_HTML_TO_PLAIN_FORMATTING'),
        fEncryptPopup = _.bind(function (bRes) {
          if (bRes) {
            this.openPgpPopup();
          }
        }, this);
      if (this.oCompose.hasAttachments()) {
        sConfirm += '\r\n\r\n' + TextUtils.i18n('OPENPGPWEBCLIENT/CONFIRM_HTML_TO_PLAIN_ATTACHMENTS');
      }
      Popups.showPopup(ConfirmPopup, [sConfirm, fEncryptPopup]);
    } else {
      this.openPgpPopup();
    }
  }
};
CComposeButtonsView.prototype.openPgpPopup = function () {
  var _this = this;
  if (this.oCompose) {
    var successCallback = function successCallback(signedEncryptedText, isEncrypted) {
      if (_this.oCompose.isHtml()) {
        _this.oCompose.setPlainTextMode();
        _this.bComposeModeChanged = true;
      }
      _this.oCompose.setPlainText(signedEncryptedText);
      _this.pgpSecured(true);
      _this.pgpEncrypted(isEncrypted);
    };
    Popups.showPopup(EncryptPopup, [this.oCompose.getPlainText(), this.oCompose.getFromEmail(), this.oCompose.getRecipientsInfo(), successCallback]);
  }
};
CComposeButtonsView.prototype.undoPgp = function () {
  var sText = '',
    aText = [];
  if (this.oCompose && this.pgpSecured()) {
    if (this.bComposeModeChanged) {
      this.oCompose.setHtmlTextMode();
      this.bComposeModeChanged = false;
    }
    if (this.fromDrafts() && !this.pgpEncrypted()) {
      sText = this.oCompose.getPlainText();
      aText = sText.split('-----BEGIN PGP SIGNED MESSAGE-----');
      if (aText.length === 2) {
        sText = aText[1];
      }
      aText = sText.split('-----BEGIN PGP SIGNATURE-----');
      if (aText.length === 2) {
        sText = aText[0];
      }
      aText = sText.split('\r\n\r\n');
      if (aText.length > 0) {
        aText.shift();
        sText = aText.join('\r\n\r\n');
      }
      if (this.oCompose.isHtml()) {
        this.oCompose.setHtmlText('<div>' + sText.replace(/\r\n/gi, '<br />') + '</div>');
      } else {
        this.oCompose.setPlainText(sText);
      }
    } else {
      this.oCompose.undoHtml();
    }
    this.pgpSecured(false);
    this.pgpEncrypted(false);
  }
};
module.exports = new CComposeButtonsView();

/***/ }),

/***/ "drFo":
/*!*****************************************************************!*\
  !*** ./modules/OpenPgpWebclient/js/views/PgpKeyControlsView.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "MYiO"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  OpenPgp = __webpack_require__(/*! modules/OpenPgpWebclient/js/OpenPgp.js */ "E7cO"),
  ShowKeyArmorPopup = __webpack_require__(/*! modules/OpenPgpWebclient/js/popups/ShowKeyArmorPopup.js */ "rvaB");
function CPgpKeyControlsView() {}
CPgpKeyControlsView.prototype.ViewTemplate = 'OpenPgpWebclient_PgpKeyControlsView';
var prepareKey = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(key, email, uuid) {
    var keys;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!(typeof key === 'string')) {
            _context.n = 2;
            break;
          }
          _context.n = 1;
          return OpenPgp.getKeysFromArmors([{
            Email: email,
            PublicPgpKey: key,
            UUID: uuid
          }]);
        case 1:
          keys = _context.v;
          return _context.a(2, keys.length === 1 ? keys[0] : null);
        case 2:
          return _context.a(2, key);
      }
    }, _callee);
  }));
  return function prepareKey(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
CPgpKeyControlsView.prototype.showArmor = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(key, email, uuid) {
    var preparedKey;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.n = 1;
          return prepareKey(key, email, uuid);
        case 1:
          preparedKey = _context2.v;
          if (preparedKey) {
            Popups.showPopup(ShowKeyArmorPopup, [preparedKey]);
          }
        case 2:
          return _context2.a(2);
      }
    }, _callee2);
  }));
  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
CPgpKeyControlsView.prototype.setAfterRemoveContactKeyHandler = function (afterRemoveContactKeyHandler) {
  this.afterRemoveContactKeyHandler = typeof afterRemoveContactKeyHandler === 'function' ? afterRemoveContactKeyHandler : function () {};
};
CPgpKeyControlsView.prototype.removeKeyFromContacts = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(key, email, uuid) {
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          this.removeKey(key, email, uuid, 'removeKeyFromContacts');
        case 1:
          return _context3.a(2);
      }
    }, _callee3, this);
  }));
  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
CPgpKeyControlsView.prototype.removeKeyFromThisDevice = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(key, email, uuid) {
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          this.removeKey(key, email, uuid, 'removeKeyFromThisDevice');
        case 1:
          return _context4.a(2);
      }
    }, _callee4, this);
  }));
  return function (_x0, _x1, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
CPgpKeyControlsView.prototype.removeKey = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(key, email, uuid, removeMethodName) {
    var _this = this;
    var preparedKey, removeHandler, confirmText;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          _context6.n = 1;
          return prepareKey(key, email, uuid);
        case 1:
          preparedKey = _context6.v;
          removeHandler = /*#__PURE__*/function () {
            var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(isRemoveConfirmed) {
              var removeKeyResult;
              return _regenerator().w(function (_context5) {
                while (1) switch (_context5.n) {
                  case 0:
                    if (!isRemoveConfirmed) {
                      _context5.n = 2;
                      break;
                    }
                    _context5.n = 1;
                    return OpenPgp[removeMethodName](preparedKey);
                  case 1:
                    removeKeyResult = _context5.v;
                    if (!removeKeyResult.result) {
                      Screens.showError(TextUtils.i18n('OPENPGPWEBCLIENT/ERROR_DELETE_KEY'));
                    } else {
                      _this.afterRemoveContactKeyHandler();
                    }
                  case 2:
                    return _context5.a(2);
                }
              }, _callee5);
            }));
            return function removeHandler(_x15) {
              return _ref6.apply(this, arguments);
            };
          }();
          confirmText = TextUtils.i18n('OPENPGPWEBCLIENT/CONFIRM_DELETE_KEY', {
            'KEYEMAIL': preparedKey.getEmail()
          });
          Popups.showPopup(ConfirmPopup, [confirmText, removeHandler]);
        case 2:
          return _context6.a(2);
      }
    }, _callee6);
  }));
  return function (_x11, _x12, _x13, _x14) {
    return _ref5.apply(this, arguments);
  };
}();
module.exports = new CPgpKeyControlsView();

/***/ }),

/***/ "rPFn":
/*!******************************************************************!*\
  !*** ./modules/OpenPgpWebclient/js/views/MessageControlsView.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  ErrorsUtils = __webpack_require__(/*! modules/OpenPgpWebclient/js/utils/Errors.js */ "RIpb"),
  Enums = __webpack_require__(/*! modules/OpenPgpWebclient/js/Enums.js */ "vfpp"),
  OpenPgp = __webpack_require__(/*! modules/OpenPgpWebclient/js/OpenPgp.js */ "E7cO"),
  Settings = __webpack_require__(/*! modules/OpenPgpWebclient/js/Settings.js */ "a9Z8");
function CMessageControlsView() {
  this.sText = '';
  this.sAccountEmail = '';
  this.sFromEmail = '';
  this.oEncryptionKey = null;
  this.isEncryptedMessage = ko.observable(false);
  this.visibleDecryptControl = ko.observable(false);
  this.visibleVerifyControl = ko.observable(false);
}
CMessageControlsView.prototype.ViewTemplate = 'OpenPgpWebclient_MessageControlsView';
CMessageControlsView.prototype.reset = function () {
  this.sText = '';
  this.sAccountEmail = '';
  this.sFromEmail = '';
  this.isEncryptedMessage(false);
  this.visibleDecryptControl(false);
  this.visibleVerifyControl(false);
};

/**
 * Assigns message pane external interface.
 * 
 * @param {Object} oMessagePane Message pane external interface.
 * @param {Function} oMessagePane.changeText(sText) Function changes displaying text in message pane and in message too so exactly this text will be shown next time.
 */
CMessageControlsView.prototype.assignMessagePaneExtInterface = function (oMessagePane) {
  this.oMessagePane = oMessagePane;
};

/**
 * Receives properties of the message that is displaying in the message pane. 
 * It is called every time the message is changing in the message pane.
 * Receives null if there is no message in the pane.
 * 
 * @param {Object|null} oMessageProps Information about message in message pane.
 * @param {Boolean} oMessageProps.bPlain **true**, if displaying message is plain.
 * @param {String} oMessageProps.sRawText Raw plain text of message.
 * @param {String} oMessageProps.sText Prepared for displaying plain text of message.
 * @param {String} oMessageProps.sAccountEmail Email of account that received message.
 * @param {String} oMessageProps.sFromEmail Message sender email.
 */
CMessageControlsView.prototype.doAfterPopulatingMessage = function (oMessageProps) {
  var _this = this;
  if (oMessageProps && oMessageProps.bPlain) {
    this.sText = oMessageProps.sRawText;
    this.sAccountEmail = oMessageProps.sAccountEmail;
    this.sFromEmail = oMessageProps.sFromEmail;
    if (Settings.enableOpenPgpInMail()) {
      this.isEncryptedMessage(oMessageProps.sText.indexOf('-----BEGIN PGP MESSAGE-----') !== -1);
      this.visibleVerifyControl(oMessageProps.sText.indexOf('-----BEGIN PGP SIGNED MESSAGE-----') !== -1);
      if (this.isEncryptedMessage()) {
        OpenPgp.getEncryptionKeyFromArmoredMessage(this.sText).then(function (oEncryptionKey) {
          if (oEncryptionKey) {
            _this.visibleDecryptControl(true);
            _this.oEncryptionKey = oEncryptionKey;
          } else {
            _this.visibleDecryptControl(false);
          }
        });
      }
      this.visibleDecryptControl(this.isEncryptedMessage());
    } else {
      this.visibleDecryptControl(false);
    }
    if ((this.visibleVerifyControl() || this.visibleDecryptControl()) && this.oMessagePane) {
      this.oMessagePane.changeText('<pre>' + TextUtils.encodeHtml(this.sText) + '</pre>');
    }
  } else {
    this.reset();
  }
};
CMessageControlsView.prototype.decryptMessage = function () {
  var fOkHandler = _.bind(function (oRes) {
      if (oRes && oRes.result && !oRes.errors && this.oMessagePane) {
        this.oMessagePane.changeText('<pre>' + TextUtils.plainToHtml(oRes.result, true) + '</pre>');
        this.isEncryptedMessage(false);
        this.visibleDecryptControl(false);
        if (!oRes.notices) {
          Screens.showReport(TextUtils.i18n('OPENPGPWEBCLIENT/REPORT_MESSAGE_SUCCESSFULLY_DECRYPTED_AND_VERIFIED'));
        } else {
          Screens.showError(TextUtils.i18n('OPENPGPWEBCLIENT/ERROR_MESSAGE_SUCCESSFULLY_DECRYPTED_BUT_NOT_VERIFIED'));
        }
      }
    }, this),
    fErrorHandler = function fErrorHandler(oRes) {
      if (oRes && (oRes.errors || oRes.notices)) {
        var bNoSignDataNotice = ErrorsUtils.showPgpErrorByCode(oRes, Enums.PgpAction.DecryptVerify);
        if (bNoSignDataNotice) {
          Screens.showReport(TextUtils.i18n('OPENPGPWEBCLIENT/REPORT_MESSAGE_SUCCESSFULLY_DECRYPTED_AND_NOT_SIGNED'));
        }
      }
    };
  OpenPgp.decryptAndVerify(this.sText, this.oEncryptionKey, this.sFromEmail, '', fOkHandler, fErrorHandler);
};
CMessageControlsView.prototype.verifyMessage = function () {
  var fOkHandler = _.bind(function (oRes) {
      if (oRes && oRes.result && !(oRes.errors || oRes.notices) && this.oMessagePane) {
        this.oMessagePane.changeText('<pre>' + TextUtils.encodeHtml(oRes.result) + '</pre>');
        this.visibleVerifyControl(false);
        Screens.showReport(TextUtils.i18n('OPENPGPWEBCLIENT/REPORT_MESSAGE_SUCCESSFULLY_VERIFIED'));
      }
    }, this),
    fErrorHandler = function fErrorHandler(oRes) {
      if (oRes && (oRes.errors || oRes.notices)) {
        ErrorsUtils.showPgpErrorByCode(oRes, Enums.PgpAction.Verify);
      }
    };
  OpenPgp.verify(this.sText, this.sFromEmail, fOkHandler, fErrorHandler);
};
module.exports = new CMessageControlsView();

/***/ }),

/***/ "rvaB":
/*!*****************************************************************!*\
  !*** ./modules/OpenPgpWebclient/js/popups/ShowKeyArmorPopup.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "D2Gh"),
  Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "PMEU"),
  ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "MYiO"),
  ComposeMessageWithAttachments = ModulesManager.run('MailWebclient', 'getComposeMessageWithAttachments'),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av");

/**
 * @constructor
 */
function CShowKeyArmorPopup() {
  CAbstractPopup.call(this);
  this.bAllowSendEmails = _.isFunction(ComposeMessageWithAttachments);
  this.armor = ko.observable('');
  this.htmlArmor = ko.computed(function () {
    return TextUtils.encodeHtml(this.armor().replace(/\r/g, ''));
  }, this);
  this.user = ko.observable('');
  this["private"] = ko.observable(false);
  this.popupHeading = ko.computed(function () {
    return this["private"]() ? TextUtils.i18n('OPENPGPWEBCLIENT/HEADING_VIEW_PRIVATE_KEY', {
      'USER': this.user()
    }) : TextUtils.i18n('OPENPGPWEBCLIENT/HEADING_VIEW_PUBLIC_KEY', {
      'USER': this.user()
    });
  }, this);
  this.downloadLinkHref = ko.computed(function () {
    var sHref = '#',
      oBlob = null;
    if (Blob && window.URL && _.isFunction(window.URL.createObjectURL)) {
      oBlob = new Blob([this.armor()], {
        type: 'text/plain'
      });
      sHref = window.URL.createObjectURL(oBlob);
    }
    return sHref;
  }, this);
  this.downloadLinkFilename = ko.computed(function () {
    var sConvertedUser = this.user().replace(/</g, '').replace(/>/g, ''),
      sLangKey = this["private"]() ? 'OPENPGPWEBCLIENT/TEXT_PRIVATE_KEY_FILENAME' : 'OPENPGPWEBCLIENT/TEXT_PUBLIC_KEY_FILENAME';
    return TextUtils.i18n(sLangKey, {
      'USER': sConvertedUser
    }) + '.asc';
  }, this);
  this.domKey = ko.observable(null);
}
_.extendOwn(CShowKeyArmorPopup.prototype, CAbstractPopup.prototype);
CShowKeyArmorPopup.prototype.PopupTemplate = 'OpenPgpWebclient_ShowKeyArmorPopup';

/**
 * @param {Object} oKey
 */
CShowKeyArmorPopup.prototype.onOpen = function (oKey) {
  this.armor(oKey.getArmor());
  this.user(oKey.getUser());
  this["private"](oKey.isPrivate());
};
CShowKeyArmorPopup.prototype.send = function () {
  var _this = this;
  var fSend = function fSend() {
    if (_this.bAllowSendEmails && _this.armor() !== '' && _this.downloadLinkFilename() !== '') {
      Ajax.send('OpenPgpWebclient', 'SaveKeyAsTempFile', {
        'Content': _this.armor(),
        'FileName': _this.downloadLinkFilename()
      }, function (oResponse) {
        if (oResponse.Result) {
          ComposeMessageWithAttachments([oResponse.Result]);
          this.closePopup();
        }
      }, _this);
    }
  };
  if (this["private"]()) {
    var sConfirm = TextUtils.i18n('OPENPGPWEBCLIENT/CONFIRM_SEND_PRIVATE_KEY');
    Popups.showPopup(ConfirmPopup, [sConfirm, function (bSend) {
      if (bSend) {
        fSend();
      }
    }]);
  } else {
    fSend();
  }
};
CShowKeyArmorPopup.prototype.select = function () {
  var oDomKey = this.domKey() && this.domKey().length === 1 ? this.domKey()[0] : null,
    oSel = null,
    oRange = null;
  if (oDomKey && window.getSelection && document.createRange) {
    oRange = document.createRange();
    oRange.setStart(oDomKey, 0);
    oRange.setEnd(oDomKey, 1);
    oSel = window.getSelection();
    oSel.removeAllRanges();
    oSel.addRange(oRange);
    if (document.queryCommandSupported('copy')) {
      document.execCommand('copy');
      Screens.showReport(TextUtils.i18n('OPENPGPWEBCLIENT/REPORT_KEY_IN_CLIPBOARD'));
    }
  }
};
module.exports = new CShowKeyArmorPopup();

/***/ }),

/***/ "xLBO":
/*!************************************************************!*\
  !*** ./modules/OpenPgpWebclient/js/popups/SendKeyPopup.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var _ = __webpack_require__(/*! underscore */ "C3HO"),
  ko = __webpack_require__(/*! knockout */ "p09A"),
  Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "8QQh"),
  ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "5D2l"),
  ComposeMessageWithData = ModulesManager.run('MailWebclient', 'getComposeMessageWithData'),
  CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "69av"),
  TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "LKDt");

/**
 * @constructor
 */
function SendKeyPopup() {
  CAbstractPopup.call(this);
  this.bAllowSendEmails = _.isFunction(ComposeMessageWithData);
  this.sEmail = ko.observable('');
  this.oMessage = ko.observable(null);
  this.sSendKeyText = ko.observable('');
  this.oPublicKey = null;
  this.downloadLinkFilename = ko.observable('');
}
_.extendOwn(SendKeyPopup.prototype, CAbstractPopup.prototype);
SendKeyPopup.prototype.PopupTemplate = 'OpenPgpWebclient_SendKeyPopup';

/**
 * @param {string} oMessage
 * @param {object} oPublicKey
 */
SendKeyPopup.prototype.onOpen = function (oMessage, oPublicKey) {
  this.oMessage(oMessage);
  this.sEmail(oMessage.oFrom.getFirstEmail());
  this.sSendKeyText(TextUtils.i18n('OPENPGPWEBCLIENT/INFO_SEND_KEY', {
    'EMAIL': this.sEmail()
  }));
  this.oPublicKey = oPublicKey;
  var sConvertedUser = this.oPublicKey.getUser().replace(/</g, '').replace(/>/g, '');
  this.downloadLinkFilename(TextUtils.i18n('OPENPGPWEBCLIENT/TEXT_PUBLIC_KEY_FILENAME', {
    'USER': sConvertedUser
  }) + '.asc');
};
SendKeyPopup.prototype.sendKey = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
  var _this = this;
  return _regenerator().w(function (_context) {
    while (1) switch (_context.n) {
      case 0:
        if (this.bAllowSendEmails && this.oPublicKey.getArmor() !== '' && this.downloadLinkFilename() !== '') {
          Ajax.send('OpenPgpWebclient', 'SaveKeyAsTempFile', {
            'Content': this.oPublicKey.getArmor(),
            'FileName': this.downloadLinkFilename()
          }, function (oResponse) {
            if (oResponse.Result) {
              ComposeMessageWithData({
                attachments: [oResponse.Result],
                replyToMessage: _this.oMessage()
              });
              _this.closePopup();
            }
          }, this);
        }
      case 1:
        return _context.a(2);
    }
  }, _callee, this);
}));
module.exports = new SendKeyPopup();

/***/ })

}]);