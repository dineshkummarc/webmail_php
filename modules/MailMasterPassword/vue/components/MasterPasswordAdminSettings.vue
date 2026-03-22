<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg ">
      <div class="row q-mb-md">
        <div class="col text-h5" v-t="'MAILMASTERPASSWORD.HEADING_SETTINGS_TAB'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row">
            <div class="col-2 q-mt-sm" v-t="'MAILMASTERPASSWORD.LABEL_MASTER_PASSWORD'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" type="password" autocomplete="new-password" v-model="password" />
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pt-md text-right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
               :label="$t('COREWEBCLIENT.ACTION_SAVE')"
               @click="save"/>
      </div>
    </div>
    <q-inner-loading style="justify-content: flex-start;" :showing="saving">
      <q-linear-progress query />
    </q-inner-loading>
  </q-scroll-area>
</template>

<script>
import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import webApi from 'src/utils/web-api'

const FAKE_PASS = '     '

export default {
  name: 'MasterPasswordAdminSettings',

  data () {
    return {
      saving: false,
      password: FAKE_PASS,
      savingPass: FAKE_PASS
    }
  },

  beforeRouteLeave (to, from, next) {
    this.$root.doBeforeRouteLeave(to, from, next)
  },

  methods: {
    /**
     * Method is used in doBeforeRouteLeave mixin
     */
    hasChanges () {
      return this.password !== this.savingPass
    },

    /**
     * Method is used in doBeforeRouteLeave mixin,
     * do not use async methods - just simple and plain reverting of values
     * !! hasChanges method must return true after executing revertChanges method
     */
    revertChanges () {
      this.password = this.savingPass
    },

    save () {
      if (!this.saving) {
        this.saving = true
        const parameters = {
          MasterPassword: this.password,
        }
        webApi.sendRequest({
          moduleName: 'MailMasterPassword',
          methodName: 'UpdateSettings',
          parameters,
        }).then(result => {
          this.savingPass = this.password
          this.saving = false
          if (result === true) {
            notification.showReport(this.$t('COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS'))
          } else {
            notification.showError(this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
          }
        }, response => {
          this.saving = false
          notification.showError(errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED')))
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
