<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg" style="min-width: 811px">
      <div class="row q-mb-md">
        <div class="col text-h5" v-t="'LOGSVIEWERWEBCLIENT.HEADING_SETTINGS_TAB'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md">
            <q-checkbox dense v-model="enableLogging">
              <span v-t="'LOGSVIEWERWEBCLIENT.LABEL_LOGGING_ENABLE'" />
            </q-checkbox>
          </div>
          <div class="row q-mb-md">
            <div class="col-1 q-my-sm" v-t="'LOGSVIEWERWEBCLIENT.LABEL_LOGGING_VERBOSITY'" />
            <div class="col-2 q-ml-xl">
              <q-select flat outlined dense bg-color="white" v-model="verbosity" :options="verbosityList" />
            </div>
          </div>
          <div class="row q-mb-md">
            <div>
              <q-btn
                unelevated
                no-caps
                dense
                class="q-px-sm"
                :ripple="false"
                color="primary"
                :label="$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_DOWNLOAD', { SIZE: viewLogSizeBytes })"
                @click="getLogFile(logFileName, LogType.default)"
              />
            </div>
            <div class="q-ml-md">
              <q-btn
                unelevated
                no-caps
                dense
                class="q-px-sm"
                :ripple="false"
                color="primary"
                :label="viewLogText"
                @click="getLog(LogType.default)"
              />
            </div>
            <div class="q-ml-md">
              <q-btn
                unelevated
                no-caps
                dense
                class="q-px-sm"
                :ripple="false"
                color="primary"
                :label="$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_CLEAR')"
                @click="clearLog(LogType.default)"
              />
            </div>
          </div>
          <div class="col-1 q-my-sm" v-t="'LOGSVIEWERWEBCLIENT.LABEL_LOGGING_ERROR_LOG'" />
          <div class="row q-mb-md">
            <div>
              <q-btn
                unelevated
                no-caps
                dense
                class="q-px-sm"
                :ripple="false"
                color="primary"
                :label="$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_DOWNLOAD_ERRORS', { SIZE: viewErrorLogSizeBytes })"
                @click="getLogFile(errorLogFileName, LogType.error)"
              />
            </div>
            <div class="q-ml-md">
              <q-btn
                unelevated
                no-caps
                dense
                class="q-px-sm"
                :ripple="false"
                color="primary"
                :label="viewErrorsLogText"
                @click="getLog(LogType.error)"
              />
            </div>
            <div class="q-ml-md">
              <q-btn
                unelevated
                no-caps
                dense
                class="q-px-sm"
                :ripple="false"
                color="primary"
                :label="$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_CLEAR')"
                @click="clearLog(LogType.error)"
              />
            </div>
          </div>
          <div class="row q-mb-md">
            <q-checkbox dense v-model="enableEventLogging">
              <q-item-label v-t="'LOGSVIEWERWEBCLIENT.LABEL_LOGGING_ENABLE_EVENTS'" />
            </q-checkbox>
          </div>
          <div class="row">
            <div>
              <q-btn
                unelevated
                no-caps
                dense
                class="q-px-sm"
                :ripple="false"
                color="primary"
                :label="$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_DOWNLOAD_EVENTS', { SIZE: viewEventLogSizeBytes })"
                @click="getLogFile(eventLogFileName, LogType.event)"
              />
            </div>
            <div class="q-ml-md">
              <q-btn
                unelevated
                no-caps
                dense
                class="q-px-sm"
                :ripple="false"
                color="primary"
                :label="viewEventsLogText"
                @click="getLog(LogType.event)"
              />
            </div>
            <div class="q-ml-md">
              <q-btn
                unelevated
                no-caps
                dense
                class="q-px-sm"
                :ripple="false"
                color="primary"
                :label="$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_CLEAR')"
                @click="clearLog(LogType.event)"
              />
            </div>
          </div>
          <div class="row q-mt-md q-mb-sm" v-if="users.length">
            <div class="col-10">
              <div>
                {{ $t('LOGSVIEWERWEBCLIENT.LABEL_LOGGING_USERS_WITH_SEPARATE_LOG') }}
                <li class="q-ml-sm" style="list-style-type: none" v-for="user in users" :key="user">
                  <span class="logging-user__link" @click="getLogFile(logFileName, false, user)">
                    {{ user }}
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                      {{ $t('LOGSVIEWERWEBCLIENT.INFO_LOGGING_CLICK_TO_DOWNLOAD') }}
                    </q-tooltip>
                  </span>
                </li>
              </div>
            </div>
          </div>
          <div class="row" v-if="users.length">
            <div>
              <q-btn
                unelevated
                no-caps
                dense
                class="q-px-sm"
                :ripple="false"
                color="primary"
                :label="$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_TURN_OFF_SEPARATE_LOGS')"
                @click="turnOffSeparateLogs"
              />
            </div>
            <div class="q-ml-md">
              <q-btn
                unelevated
                no-caps
                dense
                class="q-px-sm"
                :ripple="false"
                color="primary"
                :label="$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_CLEAR_SEPARATE_LOGS')"
                @click="clearSeparateLogs"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pt-md text-right">
        <q-btn
          unelevated
          no-caps
          dense
          class="q-px-sm"
          :ripple="false"
          color="primary"
          @click="save"
          :label="$t('COREWEBCLIENT.ACTION_SAVE')"
        />
      </div>
    </div>
    <q-inner-loading style="justify-content: flex-start" :showing="saving">
      <q-linear-progress query />
    </q-inner-loading>
  </q-scroll-area>
</template>

<script>
import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import textUtil from 'src/utils/text'
import webApi from 'src/utils/web-api'

import settings from 'src/settings'
import enums from '../enums'

export default {
  name: 'LoggingAdminSettings',

  data() {
    return {
      verbosity: '',
      logFileData: {},
      logSizeBytes: 0,
      eventLogSizeBytes: 0,
      errorLogSizeBytes: 0,
      viewLastLogSize: 0,
      viewLogSizeBytes: 0,
      viewEventLogSizeBytes: 0,
      viewErrorLogSizeBytes: 0,
      logFileName: '',
      eventLogFileName: '',
      errorLogFileName: '',
      enableLogging: false,
      enableEventLogging: false,
      loggingLevel: 100,
      users: [],
      timeOut: false,
      saving: false,
      downloadingLogs: false,
      cleaningLogs: false,
      viewLogs: false,
      turningOffSeparateLogs: false,
      LogType: enums.LogType
    }
  },

  mounted() {
    this.populate()
    this.getLogFilesData()
    this.getUsersWithSeparateLog()
  },

  beforeRouteLeave(to, from, next) {
    this.$root.doBeforeRouteLeave(to, from, next)
  },

  computed: {
    verbosityList() {
      return [
        { value: 100, label: this.$t('LOGSVIEWERWEBCLIENT.LABEL_LOGGING_DEBUG') },
        { value: 50, label: this.$t('LOGSVIEWERWEBCLIENT.LABEL_LOGGING_WARNINGS') },
        { value: 20, label: this.$t('LOGSVIEWERWEBCLIENT.LABEL_LOGGING_ERRORS') },
      ]
    },
    viewLogText() {
      if (this.logSizeBytes < this.viewLastLogSize) {
        return this.$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_VIEW')
      } else {
        return this.$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_VIEW_LAST', {
          SIZE: textUtil.getFriendlySize(this.viewLastLogSize),
        })
      }
    },
    viewEventsLogText() {
      if (this.eventLogSizeBytes < this.viewLastLogSize) {
        return this.$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_VIEW')
      } else {
        return this.$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_VIEW_LAST', {
          SIZE: textUtil.getFriendlySize(this.viewLastLogSize),
        })
      }
    },
    viewErrorsLogText() {
      if (this.errorLogSizeBytes < this.viewLastLogSize) {
        return this.$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_VIEW')
      } else {
        return this.$t('LOGSVIEWERWEBCLIENT.BUTTON_LOGGING_VIEW_LAST', {
          SIZE: textUtil.getFriendlySize(this.viewLastLogSize),
        })
      }
    },
  },

  beforeDestroy() {
    clearTimeout(this.timeOut)
  },

  methods: {
    /**
     * Method is used in doBeforeRouteLeave mixin
     */
    hasChanges() {
      const data = settings.getLoggingData()
      return (
        this.enableLogging !== data.enableLogging ||
        this.enableEventLogging !== data.enableEventLogging ||
        this.verbosity.value !== data.loggingLevel
      )
    },

    /**
     * Method is used in doBeforeRouteLeave mixin,
     * do not use async methods - just simple and plain reverting of values
     * !! hasChanges method must return true after executing revertChanges method
     */
    revertChanges() {
      this.populate()
    },

    populate() {
      const data = settings.getLoggingData()
      this.enableLogging = data.enableLogging
      this.enableEventLogging = data.enableEventLogging
      this.viewLastLogSize = data.viewLastLogSize
      this.verbosityList.forEach((elem) => {
        if (elem.value === data.loggingLevel) {
          this.verbosity = elem
        }
      })
    },
    save() {
      if (!this.saving) {
        this.saving = true
        const parameters = {
          EnableLogging: this.enableLogging,
          EnableEventLogging: this.enableEventLogging,
          LoggingLevel: this.verbosity.value,
        }
        webApi
          .sendRequest({
            moduleName: 'Core',
            methodName: 'UpdateSettings',
            parameters: parameters,
          })
          .then(
            (result) => {
              this.saving = false
              if (result) {
                settings.saveLoggingData({
                  enableLogging: this.enableLogging,
                  enableEventLogging: this.enableEventLogging,
                  loggingLevel: this.verbosity.value,
                })
                notification.showReport(this.$t('COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS'))
              } else {
                notification.showError(this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
              }
            },
            (response) => {
              this.saving = false
              notification.showError(
                errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
              )
            }
          )
      }
    },
    getLogFilesData() {
      webApi
        .sendRequest({
          moduleName: 'LogsViewerWebclient',
          methodName: 'GetLogFilesData',
        })
        .then((result) => {
          if (result) {
            this.logSizeBytes = result.LogSizeBytes
            this.eventLogSizeBytes = result.EventLogSizeBytes
            this.errorLogSizeBytes = result.ErrorLogSizeBytes
            this.viewLogSizeBytes = textUtil.getFriendlySize(result.LogSizeBytes)
            this.viewEventLogSizeBytes = textUtil.getFriendlySize(result.EventLogSizeBytes)
            this.viewErrorLogSizeBytes = textUtil.getFriendlySize(result.ErrorLogSizeBytes)
            this.logFileName = result.LogFileName
            this.eventLogFileName = result.EventLogFileName
            this.errorLogFileName = result.ErrorLogFileName
          }
          this.setUpdateStatusTimer()
        })
    },
    setUpdateStatusTimer() {
      clearTimeout(this.timeOut)
      if (!this._isDestroyed) {
        this.timeOut = setTimeout(this.getLogFilesData, 5000)
      }
    },
    getUsersWithSeparateLog() {
      const parameters = {}
      webApi
        .sendRequest({
          moduleName: 'LogsViewerWebclient',
          methodName: 'GetUsersWithSeparateLog',
          parameters: parameters,
        })
        .then(
          (result) => {
            if (result) {
              this.users = result
            }
          },
          (response) => {
            notification.showError(errors.getTextFromResponse(response))
          }
        )
    },
    getLog(FilePrefix) {
      if (!this.viewLogs) {
        this.viewLogs = true
        const parameters = {
          FilePrefix: FilePrefix,
        }
        webApi
          .sendRequest({
            moduleName: 'LogsViewerWebclient',
            methodName: 'GetLog',
            parameters: parameters,
          })
          .then(
            (result) => {
              this.viewLogs = false
              if (result) {
                const oWin = window.open('', 'view-log', 'scrollbars=1')
                oWin.document.write('<pre>' + result + '</pre>')
              }
            },
            (response) => {
              this.viewLogs = false
              notification.showError(errors.getTextFromResponse(response))
            }
          )
      }
    },
    getLogFile(fileName, FilePrefix, publicId = '') {
      if (!this.downloadingLogs) {
        this.downloadingLogs = true
        const parameters = {
          FilePrefix: FilePrefix,
          PublicId: publicId,
        }
        if (publicId) {
          fileName = publicId + '-' + fileName
        }
        webApi
          .downloadExportFile({
            moduleName: 'LogsViewerWebclient',
            methodName: 'GetLogFile',
            parameters: parameters,
            fileName: fileName,
            format: 'Raw',
          })
          .then(() => {
            this.downloadingLogs = false
          })
      }
    },
    clearLog(FilePrefix) {
      if (!this.cleaningLogs) {
        this.cleaningLogs = true
        const parameters = {
          FilePrefix: FilePrefix
        }
        webApi
          .sendRequest({
            moduleName: 'LogsViewerWebclient',
            methodName: 'ClearLog',
            parameters,
          })
          .then(
            () => {
              this.cleaningLogs = false
            },
            (response) => {
              this.cleaningLogs = false
              notification.showError(errors.getTextFromResponse(response))
            }
          )
      }
    },
    turnOffSeparateLogs() {
      if (!this.turningOffSeparateLogs) {
        this.turningOffSeparateLogs = true
        webApi
          .sendRequest({
            moduleName: 'LogsViewerWebclient',
            methodName: 'TurnOffSeparateLogs',
          })
          .then(
            (result) => {
              if (result === true) {
                this.getUsersWithSeparateLog()
              }
              this.turningOffSeparateLogs = false
            },
            () => {
              this.turningOffSeparateLogs = false
            }
          )
      }
    },
    clearSeparateLogs() {
      if (!this.cleaningLogs) {
        this.cleaningLogs = true
        webApi
          .sendRequest({
            moduleName: 'LogsViewerWebclient',
            methodName: 'ClearSeparateLogs',
          })
          .then(
            (result) => {
              this.cleaningLogs = false
              if (result === true) {
                notification.showReport(this.$t('COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS'))
              } else {
                notification.showError(this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
              }
            },
            (response) => {
              this.cleaningLogs = false
              notification.showError(
                errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
              )
            }
          )
      }
    },
  },
}
</script>

<style scoped>
.logging-user__link {
  color: #1c868e;
  cursor: pointer;
}

.logging-user__link:hover {
  text-decoration: underline;
}
</style>
