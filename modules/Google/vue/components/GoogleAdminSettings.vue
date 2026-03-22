<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg">
      <div class="row q-mb-md">
        <div class="col text-h5" v-t="'GOOGLE.HEADING_SETTINGS'" />
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md">
            <q-checkbox dense v-model="enableGoogle">
              <q-item-label v-t="'GOOGLE.ENABLE_MODULE'"></q-item-label>
            </q-checkbox>
          </div>
          <div class="row q-mb-md">
            <div class="col-2 q-my-sm q-pl-sm required-field" v-t="'OAUTHINTEGRATORWEBCLIENT.LABEL_APP_ID'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" v-model="appId"/>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-2 q-my-sm q-pl-sm required-field" v-t="'OAUTHINTEGRATORWEBCLIENT.LABEL_APP_SECRET'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" v-model="appSecret"/>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-2 q-my-sm q-pl-sm required-field" v-t="'GOOGLE.LABEL_API_KEY'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" v-model="apiKey"/>
            </div>
          </div>
          <div class="row">
            <q-item-label caption>
              <span v-t="'GOOGLE.INFO_SETTINGS'" />
            </q-item-label>
          </div>
          <div class="row q-my-md" v-if="scopes.length === 0">
            <q-item-label caption>
              <span v-t="'GOOGLE.INFO_NO_SCOPES_AVAILABLE'" />
            </q-item-label>
          </div>
          <div class="row q-my-md" v-for="scope in scopes" :key="scope.name">
            <q-checkbox dense v-model="scope.value">
              <q-item-label>{{ scope.label }}</q-item-label>
            </q-checkbox>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pt-md text-right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary" @click="saveGoogleSettings"
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

import settings from '../../../Google/vue/settings'

export default {
  name: 'GoogleAdminSettings',

  data() {
    return {
      enableGoogle: false,
      appId: '',
      appSecret: '',
      apiKey: '',

      scopes: [],

      saving: false,
    }
  },

  mounted() {
    this.populate()
  },

  beforeRouteLeave(to, from, next) {
    this.$root.doBeforeRouteLeave(to, from, next)
  },

  methods: {
    /**
     * Method is used in doBeforeRouteLeave mixin
     */
    hasChanges() {
      const data = settings.getGoogleSettings()
      const hasChangesInScopes = this.scopes.some(scope => {
        const scopeData = data.scopes.find(scopeData => scopeData.Name === scope.name)
        return scopeData.Value !== scope.value
      })
      return this.enableGoogle !== data.enableModule ||
          this.appId !== data.id ||
          this.apiKey !== data.key || hasChangesInScopes ||
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

    populate() {
      const data = settings.getGoogleSettings()

      this.enableGoogle = data.enableModule
      this.appId = data.id
      this.appSecret = data.secret
      this.apiKey = data.key

      this.scopes = data.scopes.map(scopeData => {
        return {
          name: scopeData.Name,
          value: scopeData.Value,
          label: scopeData.Description,
        }
      })
    },

    saveGoogleSettings() {
      if ((this.appId && this.apiKey && this.appSecret) || !this.enableGoogle) {
        this.save()
      } else {
        notification.showError(this.$t('COREWEBCLIENT.ERROR_REQUIRED_FIELDS_EMPTY'))
      }
    },

    save() {
      if (!this.saving) {
        this.saving = true
        const parameters = {
          EnableModule: this.enableGoogle,
          Id: this.appId,
          Secret: this.appSecret,
          Key: this.apiKey,
          Scopes: this.scopes.map(scope => {
            return {
              Name: scope.name,
              Value: scope.value,
              Description: scope.label,
            }
          })
        }
        webApi.sendRequest({
          moduleName: 'Google',
          methodName: 'UpdateSettings',
          parameters,
        }).then(result => {
          this.saving = false
          if (result === true) {
            settings.saveGoogleSettings(parameters)
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
