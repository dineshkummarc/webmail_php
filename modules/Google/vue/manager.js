import settings from '../../Google/vue/settings'

export default {
  moduleName: 'Google',

  requiredModules: [],

  init (appData) {
    settings.init(appData)
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'google',
        tabTitle: 'GOOGLE.LABEL_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'google', component: () => import('./components/GoogleAdminSettings') },
        ],
      },
    ]
  },
}
