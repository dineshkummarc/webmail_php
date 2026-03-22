import _ from 'lodash'
import typesUtils from 'src/utils/types'

class PoppassdAdminSettings {
  constructor (appData) {
    const mailChangePasswordPoppassdPlugin = appData.MailChangePasswordPoppassdPlugin
    if (!_.isEmpty(mailChangePasswordPoppassdPlugin)) {
      this.host = typesUtils.pString(mailChangePasswordPoppassdPlugin.Host)
      this.port = typesUtils.pInt(mailChangePasswordPoppassdPlugin.Port)
      this.supportedServers = typesUtils.pString(mailChangePasswordPoppassdPlugin.SupportedServers)
    }
  }

  savePoppassdSettings ({ host, port, supportedServers }) {
    this.host = host
    this.port = port
    this.supportedServers = supportedServers
  }
}

let settings = null

export default {
  init (appData) {
    settings = new PoppassdAdminSettings(appData)
  },
  savePoppassdSettings (data) {
    settings.savePoppassdSettings(data)
  },
  getPoppassdSettings () {
    return {
      host: settings.host,
      port: settings.port,
      supportedServers: settings.supportedServers
    }
  },
}
