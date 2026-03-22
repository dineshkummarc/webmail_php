import settings from '../../Dropbox/vue/settings'

export default {
  moduleName: 'Dropbox',

  requiredModules: [],

  init (appData) {
    settings.init(appData)
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'dropbox',
        tabTitle: 'DROPBOX.LABEL_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'dropbox', component: () => import('./components/DropboxAdminSettings') },
        ],
      },
    ]
  },
}
