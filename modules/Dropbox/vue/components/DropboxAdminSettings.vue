<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg">
      <div class="row q-mb-md">
        <div class="col text-h5" v-t="'DROPBOX.HEADING_SETTINGS'"/>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md">
            <q-checkbox dense v-model="enableDropbox">
              <q-item-label v-t="'DROPBOX.ENABLE_MODULE'"/>
            </q-checkbox>
          </div>
          <div class="row q-mb-md">
            <div class="col-2 q-my-sm q-pl-sm required-field" v-t="'OAUTHINTEGRATORWEBCLIENT.LABEL_APP_ID'"></div>
            <div class="col-5">
              <q-input outlined dense  bg-color="white" v-model="appId"/>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-2 q-my-sm q-pl-sm required-field" v-t="'OAUTHINTEGRATORWEBCLIENT.LABEL_APP_SECRET'"></div>
            <div class="col-5">
              <q-input outlined dense  bg-color="white" v-model="appSecret"/>
            </div>
          </div>
          <div class="row">
            <q-item-label caption>
              <span v-t="'DROPBOX.INFO_SETTINGS'"/>
            </q-item-label>
          </div>
          <div class="row q-my-md">
            <q-checkbox dense v-model="auth">
              <q-item-label v-t="'DROPBOXAUTHWEBCLIENT.SCOPE_AUTH'"/>
            </q-checkbox>
          </div>
          <div class="row">
                <q-checkbox dense v-model="storage">
                  <q-item-label v-t="'DROPBOXFILESTORAGE.SCOPE_FILESTORAGE'"/>
                </q-checkbox>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pt-md text-right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary" @click="saveDropboxSettings"
               :label="$t('COREWEBCLIENT.ACTION_SAVE')">
        </q-btn>
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

import settings from '../../../Dropbox/vue/settings'

export default {
  name: 'DropboxAdminSettings',

  data () {
    return {
      saving: false,
      enableDropbox: false,
      appSecret: '',
      appId: '',
      auth: false,
      storage: false
    }
  },

  mounted () {
    this.populate()
  },

  beforeRouteLeave (to, from, next) {
    this.$root.doBeforeRouteLeave(to, from, next)
  },

  methods: {
    /**
     * Method is used in doBeforeRouteLeave mixin
     */
    hasChanges () {
      const data = settings.getDropboxSettings()
      let hasChangesScopes = false
      this.scopes.forEach((scope) => {
        if (!hasChangesScopes) {
          if (scope.Name === 'auth') {
            hasChangesScopes = this.auth !== scope.Value
          } else if (scope.Name === 'storage') {
            hasChangesScopes = this.storage !== scope.Value
          }
        }
      })
      return this.enableDropbox !== data.enableModule ||
          this.appId !== data.id ||
          hasChangesScopes ||
          this.appSecret !== data.secret
    },

    /**
     * Method is used in doBeforeRouteLeave mixin,
     * do not use async methods - just simple and plain reverting of values
     * !! hasChanges method must return true after executing revertChanges method
     */
    revertChanges () {
      this.populate()
    },

    saveDropboxSettings () {
      if ((this.appId && this.appSecret) || !this.enableDropbox) {
        this.save()
      } else {
        notification.showError(this.$t('COREWEBCLIENT.ERROR_REQUIRED_FIELDS_EMPTY'))
      }
    },
    populate () {
      const data = settings.getDropboxSettings()
      this.enableDropbox = data.enableModule
      this.appId = data.id
      this.scopes = data.scopes
      this.appSecret = data.secret
      this.scopes.forEach((scope) => {
        if (scope.Name === 'auth') {
          this.auth = scope.Value
        } else if (scope.Name === 'storage') {
          this.storage = scope.Value
        }
      })
    },
    save () {
      if (!this.saving) {
        this.saving = true
        this.scopes.forEach((scope) => {
          if (scope.Name === 'auth') {
            scope.Value = this.auth
          } else if (scope.Name === 'storage') {
            scope.Value = this.storage
          }
        })
        const parameters = {
          EnableModule: this.enableDropbox,
          Id: this.appId,
          Secret: this.appSecret,
          Scopes: this.scopes
        }
        webApi.sendRequest({
          moduleName: 'Dropbox',
          methodName: 'UpdateSettings',
          parameters,
        }).then(result => {
          this.saving = false
          if (result === true) {
            settings.saveDropboxSettings(parameters)
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
    }
  }
}
</script>

<style scoped>

</style>
