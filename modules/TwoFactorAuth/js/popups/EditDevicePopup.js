'use strict'

const _ = require('underscore'),
  ko = require('knockout')

const Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
  Api = require('%PathToCoreWebclientModule%/js/Api.js'),
  CAbstractPopup = require('%PathToCoreWebclientModule%/js/popups/CAbstractPopup.js')

/**
 * @constructor
 */
function CEditDevicePopup() {
  CAbstractPopup.call(this)

  this.deviceId = ko.observable('')
  this.customUaName = ko.observable('')
  this.customName = ko.observable('')
  this.successCallback = () => {}

  this.inProgress = ko.observable(false)
}

_.extendOwn(CEditDevicePopup.prototype, CAbstractPopup.prototype)

CEditDevicePopup.prototype.PopupTemplate = '%ModuleName%_EditDevicePopup'

CEditDevicePopup.prototype.onOpen = function (deviceId, deviceName, deviceCustomName, successCallback) {
  this.deviceId(deviceId)
  this.customUaName(deviceName)
  this.customName(deviceCustomName)
  this.successCallback = typeof successCallback === 'function' ? successCallback : () => {}
}

CEditDevicePopup.prototype.saveCustomName = function () {
  const parameters = {
    DeviceId: this.deviceId(),
    DeviceCustomName: this.customName(),
  }
  this.inProgress(true)
  Ajax.send('%ModuleName%', 'SetDeviceCustomName', parameters, this.onSetDeviceCustomNameResponse, this)
}

CEditDevicePopup.prototype.onSetDeviceCustomNameResponse = function (response) {
  this.inProgress(false)
  if (response && response.Result) {
    this.successCallback()
    this.closePopup()
  } else {
    Api.showErrorByCode(response)
  }
}

module.exports = new CEditDevicePopup()
