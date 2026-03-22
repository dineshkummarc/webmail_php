import Vuex from 'vuex'

import user from './user'
import main from './main'
import tenants from './tenants'
import groups from './groups'
import mail from 'src/../../../MailWebclient/vue/store'

export default new Vuex.Store({
  modules: {
    main,
    user,
    tenants,
    groups,
    mail,
  },

  strict: process.env.DEV
})
