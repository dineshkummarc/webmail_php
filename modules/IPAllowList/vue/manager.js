import IpAllowListAdminSettingsPerUser from './components/IpAllowListAdminSettingsPerUser'

import store from 'src/store'

export default {
  moduleName: 'IPAllowList',

  requiredModules: [],

  getAdminUserTabs() {
    const isUserSuperAdmin = store.getters['user/isUserSuperAdmin']
    if (isUserSuperAdmin) {
      return [
        {
          tabName: 'ip-allowlist',
          tabTitle: 'IPALLOWLIST.LABEL_SETTINGS_TAB',
          tabRouteChildren: [
            { path: 'id/:id/ip-allowlist', component: IpAllowListAdminSettingsPerUser },
            { path: 'search/:search/id/:id/ip-allowlist', component: IpAllowListAdminSettingsPerUser },
            { path: 'page/:page/id/:id/ip-allowlist', component: IpAllowListAdminSettingsPerUser },
            { path: 'search/:search/page/:page/id/:id/ip-allowlist', component: IpAllowListAdminSettingsPerUser },
          ],
        },
      ]
    }
    return []
  },
}
