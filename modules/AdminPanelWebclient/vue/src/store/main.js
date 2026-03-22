export default {
  namespaced: true,

  state: {
    siteName: '',
  },

  mutations: {
    setSiteName (state, siteName) {
      state.siteName = siteName
    },
  },

  actions: { },

  getters: {
    getSiteName (state) {
      return state.siteName
    },
  },
}
