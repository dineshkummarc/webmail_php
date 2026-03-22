import enums from 'src/enums'
import routesManager from 'src/router/routes-manager'
import settings from 'src/settings'
import store from 'src/store'
import { convertLocalstorageData } from 'src/convert-localstorage-data'

import Empty from 'components/Empty'
import EditTenant from 'components/EditTenant'
import EditGroup from 'components/EditGroup'
import GroupFilterForUsers from 'src/components/GroupFilterForUsers'

const UserRoles = enums.getUserRoles()

export default {
  moduleName: 'AdminPanelWebclient',

  requiredModules: [],

  init (appData) {
    convertLocalstorageData()
    settings.init(appData)
    const siteName = settings?.getCommonSettingData()?.siteName
    if (siteName) {
      document.title = siteName
    }
  },

  getRoutes () {
    const routes = [
      {
        name: 'login',
        path: '/',
        component: () => import('pages/Login.vue'),
        pageUserRoles: [UserRoles.Anonymous],
      },
      {
        name: 'system',
        path: '/system',
        component: () => import('pages/System.vue'),
        children: routesManager.getRouteChildren('System'),
        // the rest of the properties are custom
        pageUserRoles: [UserRoles.SuperAdmin],
        pageTitle: 'ADMINPANELWEBCLIENT.HEADING_SYSTEM_SETTINGS_TABNAME',
      },
    ]
    if (settings.getAllowGroups()) {
      routes.push({
        name: 'groups',
        path: '/groups',
        component: () => import('pages/Groups.vue'),
        children: [
          { path: 'id/:id', component: EditGroup },
          { path: 'create', component: EditGroup },
          { path: 'search/:search', component: Empty },
          { path: 'search/:search/id/:id', component: EditGroup },
          { path: 'page/:page', component: Empty },
          { path: 'page/:page/id/:id', component: EditGroup },
          { path: 'search/:search/page/:page', component: Empty },
          { path: 'search/:search/page/:page/id/:id', component: EditGroup },
        ],
        // the rest of the properties are custom
        pageUserRoles: [UserRoles.SuperAdmin],
        pageTitle: 'ADMINPANELWEBCLIENT.HEADING_GROUPS_SETTINGS_TABNAME',
      })
    }

    return routes
  },

  getUserRoutes () {
    return {
      name: 'users',
      path: '/users',
      component: () => import('pages/Users.vue'),
      children: routesManager.getAllUserRoutes(),
      // the rest of the properties are custom
      pageUserRoles: [UserRoles.SuperAdmin, UserRoles.TenantAdmin],
      pageTitle: 'ADMINPANELWEBCLIENT.HEADING_USERS_SETTINGS_TABNAME',
    }
  },

  getTenantRoutes () {
    return {
      name: 'tenants',
      path: '/tenants',
      component: () => import('pages/Tenants.vue'),
      children: [
        { path: 'id/:id', component: EditTenant },
        { path: 'create', component: EditTenant },
        { path: 'search/:search', component: Empty },
        { path: 'search/:search/id/:id', component: EditTenant },
        { path: 'page/:page', component: Empty },
        { path: 'page/:page/id/:id', component: EditTenant },
        { path: 'search/:search/page/:page', component: Empty },
        { path: 'search/:search/page/:page/id/:id', component: EditTenant },
      ].concat(routesManager.getRouteChildren('Tenant')),
      // the rest of the properties are custom
      pageUserRoles: [UserRoles.SuperAdmin, UserRoles.TenantAdmin],
      pageTitle: 'ADMINPANELWEBCLIENT.HEADING_TENANTS_SETTINGS_TABNAME',
    }
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'admin-security',
        tabTitle: 'ADMINPANELWEBCLIENT.LABEL_SECURITY_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'admin-security', component: () => import('./components/AccountAdminSettings') },
        ],
      },
      {
        tabName: 'admin-db',
        tabTitle: 'ADMINPANELWEBCLIENT.HEADING_DB_SETTINGS',
        tabRouteChildren: [
          { path: 'admin-db', component: () => import('./components/DbAdminSettingsView') },
        ],
      },
      {
        tabName: 'about',
        tabTitle: 'ADMINPANELWEBCLIENT.LABEL_ABOUT_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'about', component: () => import('./components/AboutAdminSettings') },
        ],
      }
    ]
  },

  getFiltersForUsers () {
    const isUserSuperAdmin = store.getters['user/isUserSuperAdmin']
    if (isUserSuperAdmin) {
      return [
        GroupFilterForUsers
      ]
    }
    return []
  },
}
