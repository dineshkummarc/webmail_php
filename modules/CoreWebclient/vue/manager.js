export default {
  moduleName: 'CoreWebclient',

  requiredModules: [],

  getAdminSystemTabs () {
    return [
      {
        tabName: 'common',
        tabTitle: 'COREWEBCLIENT.LABEL_COMMON_SETTINGS_TABNAME',
        tabRouteChildren: [
          { path: 'common', component: () => import('./components/CommonAdminSettings') },
        ],
      },
    ]
  },
}
