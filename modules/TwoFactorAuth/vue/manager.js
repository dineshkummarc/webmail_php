import TwoFactorAuthAdminSettingsPerUser from './components/TwoFactorAuthAdminSettingsPerUser'

export default {
  moduleName: 'TwoFactorAuth',

  requiredModules: [],

  getAdminUserTabs () {
    return [
      {
        tabName: 'two-factor-auth',
        tabTitle: 'TWOFACTORAUTH.LABEL_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'id/:id/two-factor-auth', component: TwoFactorAuthAdminSettingsPerUser },
          { path: 'search/:search/id/:id/two-factor-auth', component: TwoFactorAuthAdminSettingsPerUser },
          { path: 'page/:page/id/:id/two-factor-auth', component: TwoFactorAuthAdminSettingsPerUser },
          { path: 'search/:search/page/:page/id/:id/two-factor-auth', component: TwoFactorAuthAdminSettingsPerUser },
        ],
      },
    ]
  },
}
