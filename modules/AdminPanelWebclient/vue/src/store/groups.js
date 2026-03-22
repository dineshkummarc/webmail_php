import { i18n } from 'src/boot/i18n'
import _ from 'lodash'
import store from 'src/store'
import cache from 'src/cache'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import types from 'src/utils/types'
import webApi from 'src/utils/web-api'

import GroupModel from 'src/classes/group'

export default {
  namespaced: true,

  state: {
    groups: {},
  },

  mutations: {
    setGroups (state, { tenantId, groups }) {
      state.groups[tenantId] = groups
    },

    updateGroup (state, { tenantId, id, data }) {
      const tenantGroups = types.pArray(state.groups[tenantId])
      const groupIndex = tenantGroups.findIndex(group => group.id === id)
      if (groupIndex !== -1) {
        const group = new GroupModel()
        group.copy(tenantGroups[groupIndex])
        group.update(data.Name, data.SiteName, data)
        state.groups[tenantId][groupIndex] = group
      }
    },
  },

  actions: {
    parseGroups ({ commit }, { tenantId, groupsData }) {
      const groups = _.map(groupsData, function (serverData) {
        return new GroupModel(serverData)
      })
      commit('setGroups', { tenantId, groups })
    },

    requestGroups ({ dispatch }, { tenantId }) {
      if (store.getters['user/isUserSuperAdminOrTenantAdmin']) {
        webApi.sendRequest({
          moduleName: 'Core',
          methodName: 'GetGroups',
          parameters: {
            TenantId: tenantId
          },
        }).then(result => {
          if (_.isArray(result?.Items)) {
            dispatch('parseGroups', { tenantId, groupsData: result.Items })
          } else {
            dispatch('parseGroups', { tenantId, groupsData: [] })
          }
        }, response => {
          dispatch('parseGroups', { tenantId, groupsData: [] })
          notification.showError(errors.getTextFromResponse(response))
        })
      }
    },

    addUsersToGroup ({ state, dispatch }, { tenantId, groupId, usersIds }) {
      if (store.getters['user/isUserSuperAdminOrTenantAdmin']) {
        webApi.sendRequest({
          moduleName: 'Core',
          methodName: 'AddUsersToGroup',
          parameters: {
            GroupId: groupId,
            UserIds: usersIds
          },
        }).then(result => {
          if (result) {
            const tenantGroups = types.pArray(state.groups[tenantId])
            const group = tenantGroups.find(group => group.id === groupId)
            if (group) {
              cache.addUsersToGroup(group, usersIds)
            }
            notification.showReport(i18n.global.tc('ADMINPANELWEBCLIENT.REPORT_ADD_TO_GROUP_PLURAL', usersIds.length))
          } else {
            notification.showError(i18n.global.tc('ADMINPANELWEBCLIENT.ERROR_ADD_TO_GROUP_PLURAL', usersIds.length))
          }
        }, response => {
          notification.showError(errors.getTextFromResponse(response, i18n.global.tc('ADMINPANELWEBCLIENT.ERROR_ADD_TO_GROUP_PLURAL', usersIds.length)))
        })
      }
    },

    removeUsersFromGroup ({ state, dispatch }, { tenantId, groupId, usersIds, callback }) {
      if (store.getters['user/isUserSuperAdminOrTenantAdmin']) {
        webApi.sendRequest({
          moduleName: 'Core',
          methodName: 'RemoveUsersFromGroup',
          parameters: {
            GroupId: groupId,
            UserIds: usersIds
          },
        }).then(result => {
          if (result) {
            const tenantGroups = types.pArray(state.groups[tenantId])
            const group = tenantGroups.find(group => group.id === groupId)
            if (group) {
              cache.removeUsersFromGroup(group, usersIds)
              callback()
            }
            notification.showReport(i18n.global.tc('ADMINPANELWEBCLIENT.REPORT_REMOVE_FROM_GROUP_PLURAL', usersIds.length))
          } else {
            notification.showError(i18n.global.tc('ADMINPANELWEBCLIENT.ERROR_REMOVE_FROM_GROUP_PLURAL', usersIds.length))
          }
        }, response => {
          notification.showError(errors.getTextFromResponse(response, i18n.global.tc('ADMINPANELWEBCLIENT.ERROR_REMOVE_FROM_GROUP_PLURAL', usersIds.length)))
        })
      }
    },
  },

  getters: {
    getGroups (state) {
      return types.pObject(state.groups)
    },

    getGroup (state) {
      return (tenantId, id) => {
        const tenantGroups = types.pArray(state.groups[tenantId])
        return tenantGroups.find(group => group.id === id)
      }
    },
  },
}
