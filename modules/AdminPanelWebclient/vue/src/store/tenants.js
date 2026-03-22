import _ from 'lodash'
import store from 'src/store'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import types from 'src/utils/types'
import webApi from 'src/utils/web-api'

import TenantModel from 'src/classes/tenant'

export default {
  namespaced: true,

  state: {
    tenants: [],
    currentTenantId: null,
  },

  mutations: {
    setTenants (state, { tenants }) {
      state.tenants = tenants
      if (tenants.length === 0) {
        state.currentTenantId = null
      } else if (!tenants.find(tenant => tenant.id === state.currentTenantId)) {
        state.currentTenantId = tenants[0].id
      }
    },

    setCurrentTenantId (state, tenantId) {
      state.currentTenantId = tenantId
    },

    setTenantCompleteData (state, { id, data }) {
      const tenantIndex = state.tenants.findIndex(tenant => tenant.id === id)
      if (tenantIndex !== -1) {
        const tenant = new TenantModel()
        tenant.copy(state.tenants[tenantIndex])
        tenant.setCompleteData(data)
        state.tenants[tenantIndex] = tenant
      }
    },

    updateTenant (state, { id, data }) {
      const tenantIndex = state.tenants.findIndex(tenant => tenant.id === id)
      if (tenantIndex !== -1) {
        const tenant = new TenantModel()
        tenant.copy(state.tenants[tenantIndex])
        tenant.update(data.Name, data.SiteName, data)
        state.tenants[tenantIndex] = tenant
      }
    },
  },

  actions: {
    parseTenants ({ commit }, tenantsServerData) {
      const tenants = _.map(tenantsServerData, function (serverData) {
        return new TenantModel(serverData)
      })
      commit('setTenants', { tenants })
    },

    requestTenants ({ dispatch }) {
      if (store.getters['user/isUserSuperAdmin']) {
        webApi.sendRequest({
          moduleName: 'Core',
          methodName: 'GetTenants',
          parameters: {},
        }).then(result => {
          if (_.isArray(result?.Items)) {
            dispatch('parseTenants', result.Items)
          } else {
            dispatch('parseTenants', [])
          }
        }, response => {
          dispatch('parseTenants', [])
          // Do not show error because tenants are requested after saving database settings and tables could be not created yet
          // notification.showError(errors.getTextFromResponse(response))
        })
      }
    },

    completeTenantData ({ state, commit }, id) {
      const tenant = state.tenants.find(tenant => {
        return tenant.id === id
      })
      if (tenant && tenant.completeData.Description === undefined) {
        webApi.sendRequest({
          moduleName: 'Core',
          methodName: 'GetTenant',
          parameters: {
            Type: 'Tenant',
            Id: id,
          },
        }).then(result => {
          if (_.isObject(result)) {
            if (tenant) {
              commit('setTenantCompleteData', { id, data: result })
            }
          }
        }, response => {
          notification.showError(errors.getTextFromResponse(response))
        })
      }
    }
  },

  getters: {
    getTenants (state) {
      return types.pArray(state.tenants)
    },

    getCurrentTenantId (state) {
      return state.currentTenantId
    },

    getTenant (state) {
      return (id) => {
        return state.tenants.find(tenant => tenant.id === id)
      }
    },

    getTenantName (state) {
      return (id) => {
        const tenant = state.tenants.find(tenant => tenant.id === id)
        return types.pString(tenant?.name)
      }
    },
  },
}
