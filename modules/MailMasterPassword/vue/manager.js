export default {
  moduleName: 'MailMasterPassword',

  requiredModules: ['MailWebclient'],

  getAdminSystemTabs () {
    return [
      {
        tabName: 'master-password',
        tabTitle: 'MAILMASTERPASSWORD.LABEL_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'master-password', component: () => import('./components/MasterPasswordAdminSettings') },
        ],
      },
    ]
  },
}
