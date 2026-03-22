<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg ">
      <div class="row q-mb-md">
        <div class="col text-h5" v-t="'COREWEBCLIENT.HEADING_COMMON_SETTINGS'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-2 q-my-sm" v-t="'COREWEBCLIENT.LABEL_SITENAME'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" v-model="siteName" @keyup.enter="save"/>
            </div>
          </div>
          <div v-if="themeList.length > 1" class="row q-mb-md">
            <div class="col-2 q-my-sm" v-t="'COREWEBCLIENT.LABEL_THEME'"></div>
            <div class="col-5">
              <q-select outlined dense bg-color="white" v-model="theme"
                        emit-value map-options :options="themeList" option-label="name"/>
            </div>
          </div>
          <div v-if="mobileThemeList.length > 1" class="row q-mb-md">
            <div class="col-2 q-my-sm" v-t="'COREWEBCLIENT.LABEL_MOBILE_THEME'"></div>
            <div class="col-5">
              <q-select outlined dense bg-color="white" v-model="mobileTheme"
                        emit-value map-options :options="mobileThemeList" option-label="name"/>
            </div>
          </div>
          <div v-if="languageOptions.length > 1" class="row q-mb-md">
            <div class="col-2 q-my-sm" v-t="'COREWEBCLIENT.LABEL_LANGUAGE'"></div>
            <div class="col-5">
              <q-select outlined dense bg-color="white" v-model="language"
                        emit-value map-options :options="languageOptions" option-label="name"/>
            </div>
          </div>
          <div class="row">
            <div class="col-2 q-my-sm" v-t="'COREWEBCLIENT.LABEL_TIME_FORMAT'"></div>
            <div class="col-5 ">
              <div class="  q-my-sm">
                <q-radio dense v-model="timeFormat" val="1" :label="$t('COREWEBCLIENT.LABEL_TIME_FORMAT_12')"/>
                <q-radio class="q-ml-md" dense v-model="timeFormat" val="0"
                         :label="$t('COREWEBCLIENT.LABEL_TIME_FORMAT_24')"/>
              </div>
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
    <q-inner-loading style="justify-content: flex-start;" :showing="saving">
      <q-linear-progress query />
    </q-inner-loading>
  </q-scroll-area>
</template>

<script>
import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import webApi from 'src/utils/web-api'
import _ from 'lodash'
import adminSettings from 'src/settings'

export default {
  name: 'CommonAdminSetting',

  data () {
    return {
      language: '',
      savedLanguage: '',
      theme: '',
      mobileTheme: '',
      siteName: '',
      timeFormat: 0,
      saving: false,
      languageOptions: [],
      themeList: [],
      mobileThemeList: [],
      commonSettings: {},
      autodetectLanguage: false
    }
  },

  mounted () {
    this.populate()
    this.languageOptions = _.cloneDeep(adminSettings.getLanguageList())
    this.languageOptions.unshift({
      name: 'Autodetect',
      value: 'AutodetectLanguage'
    })
    this.themeList = adminSettings.getThemeList()
    this.mobileThemeList = adminSettings.getMobileThemeList()
  },

  beforeRouteLeave (to, from, next) {
    this.$root.doBeforeRouteLeave(to, from, next)
  },

  methods: {
    populate () {
      const commonSettings = adminSettings.getCommonSettingData()
      this.autodetectLanguage = commonSettings.autodetectLanguage
      this.language = this.autodetectLanguage ? 'AutodetectLanguage' : commonSettings.language
      this.savedLanguage = this.autodetectLanguage ? 'AutodetectLanguage' : commonSettings.language
      this.theme = commonSettings.theme
      this.mobileTheme = commonSettings.mobileTheme
      this.siteName = commonSettings.siteName
      this.timeFormat = commonSettings.timeFormat
    },

    /**
     * Method is used in doBeforeRouteLeave mixin
     */
    hasChanges () {
      const commonSettings = adminSettings.getCommonSettingData()
      return this.language !== this.savedLanguage || this.theme !== commonSettings.theme || this.mobileTheme !== commonSettings.mobileTheme ||
          this.siteName !== commonSettings.siteName || this.timeFormat !== commonSettings.timeFormat
    },

    /**
     * Method is used in doBeforeRouteLeave mixin,
     * do not use async methods - just simple and plain reverting of values
     * !! hasChanges method must return true after executing revertChanges method
     */
    revertChanges () {
      this.populate()
    },

    save () {
      if (!this.saving) {
        this.saving = true
        const parameters = {
          Theme: this.theme,
          MobileTheme: this.mobileTheme,
          TimeFormat: this.timeFormat,
          SiteName: this.siteName,
        }
        if (this.language === 'AutodetectLanguage') {
          parameters.AutodetectLanguage = true
        } else {
          parameters.AutodetectLanguage = false
          parameters.Language = this.language
        }
        webApi.sendRequest({
          moduleName: 'Core',
          methodName: 'UpdateSettings',
          parameters,
        }).then(result => {
          this.saving = false
          if (result === true) {
            adminSettings.saveCommonSettingData({
              siteName: this.siteName,
              theme: this.theme,
              mobileTheme: this.mobileTheme,
              language: this.language,
              timeFormat: this.timeFormat,
              autodetectLanguage: this.language === 'AutodetectLanguage'
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
    }
  }
}
</script>

<style scoped>

</style>
