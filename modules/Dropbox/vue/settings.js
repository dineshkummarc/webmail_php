import _ from 'lodash'

import typesUtils from 'src/utils/types'

class DropboxSettings {
  constructor (appData) {
    const dropboxWebclientData = typesUtils.pObject(appData.Dropbox)
    if (!_.isEmpty(dropboxWebclientData)) {
      this.displayName = typesUtils.pString(dropboxWebclientData.DisplayName)
      this.enableModule = typesUtils.pBool(dropboxWebclientData.EnableModule)
      this.id = typesUtils.pString(dropboxWebclientData.Id)
      this.name = typesUtils.pString(dropboxWebclientData.Name)
      this.scopes = typesUtils.pArray(dropboxWebclientData.Scopes)
      this.secret = typesUtils.pString(dropboxWebclientData.Secret)
    }
  }

  saveDropboxSettings ({ EnableModule, Id, Scopes, Secret }) {
    this.enableModule = EnableModule
    this.id = Id
    this.scopes = Scopes
    this.secret = Secret
  }
}

let settings = null

export default {
  init (appData) {
    settings = new DropboxSettings(appData)
  },
  saveDropboxSettings (data) {
    settings.saveDropboxSettings(data)
  },
  getDropboxSettings () {
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
