<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg ">
      <div class="row q-mb-md">
        <div class="col text-h5" v-t="'MAILCHANGEPASSWORDPOPPASSDPLUGIN.HEADING_SETTINGS_TAB'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-2 q-mt-sm" v-t="'MAILCHANGEPASSWORDPOPPASSDPLUGIN.LABEL_MAIL_SERVERS'"></div>
            <div class="col-5 textarea">
              <q-input outlined dense bg-color="white" type="textarea" v-model="supportedServers"/>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-2"></div>
            <div class="col-8">
              <q-item-label caption>
                {{ $t('MAILCHANGEPASSWORDPOPPASSDPLUGIN.LABEL_HINT_MAIL_SERVERS') }}
              </q-item-label>
            </div>
          </div>
          <div class="row">
            <div class="col-2 q-mt-sm" v-t="'MAILCHANGEPASSWORDPOPPASSDPLUGIN.LABEL_HOST'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" v-model="host"/>
            </div>
            <div class="col-1 q-mt-sm q-pl-md" v-t="'MAILCHANGEPASSWORDPOPPASSDPLUGIN.LABEL_PORT'"></div>
            <div class="col-1">
              <q-input outlined dense bg-color="white" v-model="port"/>
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

import settings from '../../../MailChangePasswordPoppassdPlugin/vue/settings'

export default {
  name: 'PoppassdAdminSettings',

  mounted () {
    this.populate()
  },

  data() {
    return {
      host: '',
      port: '',
      supportedServers: '',
      saving: false
    }
  },

  beforeRouteLeave(to, from, next) {
    this.$root.doBeforeRouteLeave(to, from, next)
  },

  methods: {
    /**
     * Method is used in doBeforeRouteLeave mixin
     */
    hasChanges() {
      const data = settings.getPoppassdSettings()
      return this.supportedServers !== data.supportedServers ||
      this.host !== data.host ||
      this.port !== data.port
    },

    /**
     * Method is used in doBeforeRouteLeave mixin,
     * do not use async methods - just simple and plain reverting of values
     * !! hasChanges method must return true after executing revertChanges method
     */
    revertChanges () {
      this.populate()
    },

    populate () {
      const data = settings.getPoppassdSettings()
      this.supportedServers = data.supportedServers
      this.host = data.host
      this.port = data.port
    },
    save () {
      if (!this.saving) {
        this.saving = true
        const parameters = {
          SupportedServers: this.supportedServers,
          Host: this.host,
          Port: this.port
        }
        webApi.sendRequest({
          moduleName: 'MailChangePasswordPoppassdPlugin',
          methodName: 'UpdateSettings',
          parameters,
        }).then(result => {
          this.saving = false
          if (result === true) {
            settings.savePoppassdSettings({
              supportedServers: this.supportedServers,
              host: this.host,
              port: this.port
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
  }
}
</script>

<style scoped>

</style>
