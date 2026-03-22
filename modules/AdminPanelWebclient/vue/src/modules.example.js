export default {
  async getModules () {
    return [
      await import('src/manager'),
      await import('src/../../../CoreWebclient/vue/manager'),
      await import('src/../../../CpanelIntegrator/vue/manager'),
      await import('src/../../../Dropbox/vue/manager'),
      await import('src/../../../Facebook/vue/manager'),
      await import('src/../../../Google/vue/manager'),
      await import('src/../../../LogsViewerWebclient/vue/manager'),
      await import('src/../../../MailChangePasswordPoppassdPlugin/vue/manager'),
      await import('src/../../../MailMasterPassword/vue/manager'),
      await import('src/../../../MailWebclient/vue/manager'),
      await import('src/../../../TwoFactorAuth/vue/manager'),
    ]
  },
}
