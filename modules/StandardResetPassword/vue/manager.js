import settings from '../../StandardResetPassword/vue/settings'

export default {
  moduleName: 'StandardResetPassword',

  requiredModules: [],

  init(appData) {
    settings.init(appData)
  },

  getAdminSystemTabs() {
    return [
      {
        tabName: 'reset-password',
        tabTitle: 'STANDARDRESETPASSWORD.LABEL_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'reset-password', component: () => import('./components/PasswordResetSettings') },
        ],
      },
    ]
  },
}
