import settings from '../../Facebook/vue/settings'

export default {
  moduleName: 'Facebook',

  requiredModules: [],

  init (appData) {
    settings.init(appData)
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'facebook',
        tabTitle: 'FACEBOOK.LABEL_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'facebook', component: () => import('./components/FacebookAdminSettings') },
        ],
      },
    ]
  },
}
