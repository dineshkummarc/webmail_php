import _ from 'lodash'

import typesUtils from 'src/utils/types'

class FacebookSettings {
  constructor (appData) {
    const facebookWebclientData = typesUtils.pObject(appData.Facebook)
    if (!_.isEmpty(facebookWebclientData)) {
      this.displayName = typesUtils.pString(facebookWebclientData.DisplayName)
      this.enableModule = typesUtils.pBool(facebookWebclientData.EnableModule)
      this.id = typesUtils.pString(facebookWebclientData.Id)
      this.name = typesUtils.pString(facebookWebclientData.Name)
      this.scopes = typesUtils.pArray(facebookWebclientData.Scopes)
      this.secret = typesUtils.pString(facebookWebclientData.Secret)
    }
  }

  saveFacebookSettings ({ EnableModule, Id, Scopes, Secret }) {
    this.enableModule = EnableModule
    this.id = Id
    this.scopes = Scopes
    this.secret = Secret
  }
}

let settings = null

export default {
  init (appData) {
    settings = new FacebookSettings(appData)
  },
  saveFacebookSettings (data) {
    settings.saveFacebookSettings(data)
  },
  getFacebookSettings () {
    return {
      displayName: settings.displayName,
      enableModule: settings.enableModule,
      id: settings.id,
      name: settings.name,
      scopes: settings.scopes,
      secret: settings.secret
    }
  },
}
