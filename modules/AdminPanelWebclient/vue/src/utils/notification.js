import { Notify } from 'quasar'

import _ from 'lodash'

let dismissLoading = null

export default {
  showError(message, timeout) {
    if (!message) {
      return
    }
    if (!_.isInteger(timeout)) {
      timeout = 10000
    }
    return Notify.create({
      color: 'negative',
      textColor: 'white',
      icon: null,
      message,
      html: true,
      position: 'top-right',
      avatar: null,
      multiLine: false, // if multiLine=true then close button is displayed at the bottom
      timeout,
      actions: [{ icon: 'close', color: 'white' }],
    })
  },

  showReport(message) {
    Notify.create({
      color: 'info',
      textColor: 'white',
      icon: null,
      message,
      html: true,
      position: 'top-right',
      avatar: null,
      multiLine: false, // if multiLine=true then close button is displayed at the bottom
      timeout: 10000,
      actions: [{ icon: 'close', color: 'white' }],
    })
  },

  showLoading(message) {
    this.hideLoading()
    dismissLoading = Notify.create({
      color: 'warning',
      textColor: 'white',
      icon: null,
      message,
      html: true,
      position: 'top-right',
      avatar: null,
      multiLine: false,
      timeout: 0,
      actions: [],
    })
  },

  hideLoading() {
    if (_.isFunction(dismissLoading)) {
      dismissLoading()
      dismissLoading = null
    }
  },
}
