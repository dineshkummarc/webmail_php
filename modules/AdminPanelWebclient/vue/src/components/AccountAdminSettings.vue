<template>
  <div class="full-height full-width">
    <q-scroll-area class="full-height full-width">
      <div class="q-pa-lg ">
        <div class="row q-mb-md">
          <div class="col text-h5" v-t="'ADMINPANELWEBCLIENT.HEADING_SECURITY_SETTINGS'"></div>
        </div>
        <q-card flat bordered class="card-edit-settings">
          <q-card-section>
            <div class="row q-mb-md">
              <div class="col-2 q-my-sm" v-t="'ADMINPANELWEBCLIENT.LABEL_SECURITY_LOGIN'"></div>
              <div class="col-5">
                <q-input outlined dense bg-color="white" v-model="login" @keyup.enter="save" />
              </div>
            </div>
            <div class="row q-mb-md">
              <div class="col-2 q-my-sm" v-t="'ADMINPANELWEBCLIENT.LABEL_SECURITY_PASS'"></div>
              <div class="col-5">
                <q-input outlined dense bg-color="white" type="password" autocomplete="new-password"
                         v-model="oldPassword" ref="oldPassword" @keyup.enter="save" />
              </div>
            </div>
            <div class="row q-mb-md">
              <div class="col-2 q-my-sm" v-t="'ADMINPANELWEBCLIENT.LABEL_SECURITY_NEW_PASS'"></div>
              <div class="col-5">
                <q-input outlined dense bg-color="white" type="password" autocomplete="new-password"
                         v-model="newPassword" ref="newPassword" @keyup.enter="save" />
              </div>
            </div>
            <div class="row q-mb-md">
              <div class="col-2 q-my-sm" v-t="'ADMINPANELWEBCLIENT.LABEL_SECURITY_CONFIRM_PASS'"></div>
              <div class="col-5">
                <q-input outlined dense bg-color="white" type="password" autocomplete="new-password"
                         v-model="confirmNewPassword" @keyup.enter="save" />
              </div>
            </div>
            <div class="row">
              <div class="col-2 q-my-sm" v-t="'COREWEBCLIENT.LABEL_LANGUAGE'"></div>
              <div class="col-5">
                <q-select outlined dense bg-color="white" v-model="language"
                          emit-value map-options :options="languageOptions" option-label="name" />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <div class="q-pt-md text-right">
          <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary" @click="save"
                 :label="$t('COREWEBCLIENT.ACTION_SAVE')">
          </q-btn>
        </div>
      </div>
    </q-scroll-area>
    <q-inner-loading style="justify-content: flex-start;" :showing="saving">
      <q-linear-progress query />
    </q-inner-loading>
  </div>
</template>

<script>
import _ from 'lodash'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import webApi from 'src/utils/web-api'

import settings from 'src/settings'

export default {
  name: 'AdminAccount',

  data() {
    return {
      login: '',
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      language: '',
      languageOptions: [],
      saving: false,
      adminHasPassword: false,
    }
  },

  beforeRouteLeave (to, from, next) {
    this.$root.doBeforeRouteLeave(to, from, next)
  },

  mounted () {
    this.languageOptions = settings.getLanguageList()
    this.saving = false
    this.populate()
  },

  methods: {
    populate () {
      const data = settings.getAdminAccountData()
      this.login = data.adminLogin
      this.oldPassword = ''
      this.newPassword = ''
      this.confirmNewPassword = ''
      this.language = data.adminLanguage
      this.adminHasPassword = data.adminHasPassword
    },

    /**
     * Method is used in doBeforeRouteLeave mixin
     */
    hasChanges () {
      const data = settings.getAdminAccountData()
      return this.login !== data.adminLogin || this.oldPassword !== '' || this.newPassword !== '' ||
        this.confirmNewPassword !== '' || this.language !== data.adminLanguage
    },

    /**
     * Method is used in doBeforeRouteLeave mixin,
     * do not use async methods - just simple and plain reverting of values
     * !! hasChanges method must return true after executing revertChanges method
     */
    revertChanges () {
      this.populate()
    },

    isDataValid () {
      const oldPassword = _.trim(this.oldPassword)
      const newPassword = _.trim(this.newPassword)
      const confirmNewPassword = _.trim(this.confirmNewPassword)

      if (oldPassword === '' && newPassword === '' && confirmNewPassword === '') {
        return true
      } else {
        if (this.adminHasPassword && oldPassword === '') {
          notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_CURRENT_PASSWORD_EMPTY'))
          this.$refs.oldPassword.$el.focus()
          return false
        }
        if (!this.adminHasPassword && oldPassword !== '') {
          notification.showError(this.$t('COREWEBCLIENT.ERROR_CURRENT_PASSWORD_NOT_CORRECT'))
          this.$refs.oldPassword.$el.focus()
          return false
        }
        if (newPassword === '') {
          notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_NEW_PASSWORD_EMPTY'))
          this.$refs.newPassword.$el.focus()
          return false
        }
        if (newPassword !== confirmNewPassword) {
          notification.showError(this.$t('COREWEBCLIENT.ERROR_PASSWORDS_DO_NOT_MATCH'))
          this.$refs.newPassword.$el.focus()
          return false
        }
      }
      return true
    },

    save () {
      if (!this.saving && this.isDataValid()) {
        this.saving = true
        const parameters = {
          AdminLogin: this.login,
          AdminLanguage: this.language
        }
        if (!_.isEmpty(this.newPassword)) {
          parameters.Password = this.oldPassword
          parameters.NewPassword = this.newPassword
        }
        webApi.sendRequest({
          moduleName: 'Core',
          methodName: 'UpdateSettings',
          parameters,
        }).then(result => {
          this.saving = false
          if (result === true) {
            settings.saveAdminAccountData({
              login: parameters.AdminLogin,
              hasPassword: !_.isEmpty(parameters.NewPassword) || this.adminHasPassword,
              language: parameters.AdminLanguage,
            })
            this.populate()
            notification.showReport(this.$t('COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS'))
          } else {
            notification.showError(this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
          }
        }, response => {
          this.saving = false
          notification.showError(errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED')))
        })
      }
    },
  },
}
</script>

<style scoped>

</style>
