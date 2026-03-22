import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'
import main from './main'
import tenants from './tenants'
import mail from 'src/../../../MailWebclient/vue/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    main,
    user,
    tenants,
    mail,
  },

  strict: process.env.DEV
})
