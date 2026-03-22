'use strict'

const UAParser = require('ua-parser-js')

const TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
  Types = require('%PathToCoreWebclientModule%/js/utils/Types.js')

module.exports = {
  getName() {
    const userAgent = navigator.userAgent,
      uaData = UAParser(Types.pString(userAgent))

    return TextUtils.i18n('%MODULENAME%/LABEL_DEVICE_NAME', {
      NAME: `${uaData.browser.name}/${Types.pInt(uaData.browser.version)}`,
      PLATFORM: `${uaData.os.name} ${uaData.os.version}`,
    })
  },
}
