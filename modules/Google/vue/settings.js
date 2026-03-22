import _ from 'lodash'

import typesUtils from 'src/utils/types'

class GoogleSettings {
  constructor (appData) {
    const googleWebclientData = typesUtils.pObject(appData.Google)
    if (!_.isEmpty(googleWebclientData)) {
      this.displayName = typesUtils.pString(googleWebclientData.DisplayName)
      this.enableModule = typesUtils.pBool(googleWebclientData.EnableModule)
      this.id = typesUtils.pString(googleWebclientData.Id)
      this.key = typesUtils.pString(googleWebclientData.Key)
      this.name = typesUtils.pString(googleWebclientData.Name)
      this.scopes = typesUtils.pArray(googleWebclientData.Scopes)
      this.secret = typesUtils.pString(googleWebclientData.Secret)
    }
  }

  saveGoogleSettings ({ EnableModule, Id, Key, Scopes, Secret }) {
    this.enableModule = EnableModule
    this.id = Id
    this.key = Key
    this.scopes = Scopes
    this.secret = Secret
  }
}

let settings = null

export default {
  init (appData) {
    settings = new GoogleSettings(appData)
  },
  saveGoogleSettings (data) {
    settings.saveGoogleSettings(data)
  },
  getGoogleSettings () {
    return {
      displayName: settings.displayName,
      enableModule: settings.enableModule,
      id: settings.id,
      key: settings.key,
      name: settings.name,
      scopes: settings.scopes,
      secret: settings.secret
    }
  },

}
