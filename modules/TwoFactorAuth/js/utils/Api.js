'use strict'

const Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
  App = require('%PathToCoreWebclientModule%/js/App.js')

const DeviceUtils = require('modules/%ModuleName%/js/utils/Device.js'),
  Settings = require('modules/%ModuleName%/js/Settings.js')

module.exports = {
  saveDevice(authToken, callback) {
    if (!Settings.AllowUsedDevices) {
      callback()
      return
    }

    const parameters = {
      DeviceId: App.getCurrentDeviceId(),
      DeviceName: DeviceUtils.getName(),
    }
    Ajax.send('%ModuleName%', 'SetDeviceName', parameters, callback, this, null, authToken)
  },
}
