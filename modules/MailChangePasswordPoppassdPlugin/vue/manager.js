import settings from '../../MailChangePasswordPoppassdPlugin/vue/settings';

export default {
  moduleName: 'MailChangePasswordPoppassdPlugin',

  requiredModules: ['MailWebclient'],

  init (appData) {
    settings.init(appData)
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'poppassd',
        tabTitle: 'MAILCHANGEPASSWORDPOPPASSDPLUGIN.LABEL_POPPASSD_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'poppassd', component: () => import('./components/PoppassdAdminSettings') },
        ],
      },
    ]
  },
}
