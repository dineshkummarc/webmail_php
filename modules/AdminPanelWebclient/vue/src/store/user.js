import _ from 'lodash'

import UserModel from 'src/classes/user'
import enums from 'src/enums'

export default {
  namespaced: true,

  state: {
    userRole: null,
    userPublicId: null,
  },

  mutations: {
    setUserData(state, userData) {
      const user = new UserModel(null, userData, userData)
      if (!_.isEmpty(user)) {
        state.userRole = user.role
        state.userPublicId = user.publicId
      }
    },
    resetUserData(state) {
      state.userRole = null
      state.userPublicId = null
    },
  },

  actions: {
    parseAppData({ commit }, appData) {
      commit('setUserData', appData.User)
    },
    resetAppData({ commit }) {
      commit('resetUserData')
    },
  },

  getters: {
    isUserSuperAdmin(state) {
      const UserRoles = enums.getUserRoles()
      return state.userRole === UserRoles.SuperAdmin
    },

    isUserAnonymous(state) {
      const UserRoles = enums.getUserRoles()
      return state.userRole === UserRoles.Anonymous
    },

    isUserTenantAdmin(state) {
      const UserRoles = enums.getUserRoles()
      return state.userRole === UserRoles.TenantAdmin
    },

    isUserSuperAdminOrTenantAdmin(state) {
      const UserRoles = enums.getUserRoles()
      return state.userRole === UserRoles.SuperAdmin || state.userRole === UserRoles.TenantAdmin
    },

    getUserRole(state) {
      return state.userRole
    },

    getUserPublicId(state) {
      return state.userPublicId
    },
  },
}
