import { i18n } from 'boot/i18n'

import _ from 'lodash'

import store from 'src/store'
import enums from 'src/enums'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import webApi from 'src/utils/web-api'

import modulesManager from 'src/modules-manager'

const core = {
  appData: null,

  parseTenantsFromAppData() {
    const adminPanelWebclientData = typesUtils.pObject(this.appData?.AdminPanelWebclient)
    const tenantsData = typesUtils.pArray(adminPanelWebclientData?.Tenants?.Items)
    if (tenantsData.length > 0) {
      store.dispatch('tenants/parseTenants', tenantsData)
    } else {
      store.dispatch('tenants/requestTenants')
    }
  },

  setAppData(appData) {
    return new Promise((resolve, reject) => {
      this.appData = appData
      enums.init(appData)
      errors.init(appData)
      modulesManager.getModules(appData).then(() => {
        store.dispatch('user/parseAppData', appData).then(() => {
          modulesManager.initModules(appData)
          resolve()
        }, reject)
      }, reject)
    })
  },

  resetAppData() {
    this.appData = null
    store.dispatch('user/resetAppData')
  },

  requestAppData() {
    return new Promise((resolve, reject) => {
      webApi
        .sendRequest({
          moduleName: 'Core',
          methodName: 'GetAppData',
          parameters: {},
        })
        .then(
          (result) => {
            if (_.isObject(result)) {
              this.setAppData(result).then(() => {
                if (store.getters['user/isUserSuperAdminOrTenantAdmin']) {
                  this.parseTenantsFromAppData()
                }
                resolve()
              }, reject)
            } else {
              notification.showError(i18n.global.tc('COREWEBCLIENT.ERROR_UNKNOWN'))
              reject(i18n.global.tc('COREWEBCLIENT.ERROR_UNKNOWN'))
            }
          },
          (response) => {
            notification.showError(errors.getTextFromResponse(response, i18n.global.tc('COREWEBCLIENT.ERROR_UNKNOWN')))
            reject(errors.getTextFromResponse(response, i18n.global.tc('COREWEBCLIENT.ERROR_UNKNOWN')))
          }
        )
    })
  },
}

export default {
  init() {
    return new Promise((resolve, reject) => {
      if (core.appData === null) {
        core.requestAppData().then(resolve, reject)
      } else {
        resolve()
      }
    })
  },

  logout(afterLogoutCallback = () => {}) {
    webApi
      .sendRequest({
        moduleName: 'Core',
        methodName: 'Logout',
        parameters: {},
      })
      .then(
        () => {
          core.resetAppData()
          afterLogoutCallback()
        },
        () => {
          core.resetAppData()
          afterLogoutCallback()
        }
      )
  },

  requestAppData: core.requestAppData.bind(core),
  resetAppData: core.resetAppData.bind(core),

  getAppData() {
    return core.appData
  },
}
