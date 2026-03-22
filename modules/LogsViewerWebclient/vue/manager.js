export default {
  moduleName: 'LogsViewerWebclient',

  requiredModules: [],

  getAdminSystemTabs () {
    return [
      {
        tabName: 'logs-viewer',
        tabTitle: 'LOGSVIEWERWEBCLIENT.LABEL_LOGGING_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'logs-viewer', component: () => import('./components/LoggingAdminSettings') },
        ],
      },
    ]
  },
}
