<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg">
      <div class="row q-mb-md">
        <div class="col text-h5" v-t="'TWOFACTORAUTH.HEADING_SETTINGS_TAB'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row">
            <div class="col-8">
              <q-item-label caption>
                <div v-html="inscriptionTwoFactorAuthentication"></div>
              </q-item-label>
            </div>
          </div>
          <div class="row q-mt-md" v-if="twoFactorAuthEnabled">
            <div class="col-8">
              <q-btn
                unelevated
                no-caps
                no-wrap
                dense
                class="q-px-xs"
                :ripple="false"
                color="primary"
                :label="$t('TWOFACTORAUTH.ACTION_DISABLE_TFA')"
                @click="showTwoFactorAuthenticationDialogue"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-dialog v-model="confirmTwoFactorAuthentication" persistent>
      <q-card style="min-width: 300px">
        <q-card-section>
          <span v-html="confirmDisableTwoFactorAuthentication"></span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            unelevated
            no-caps
            dense
            class="q-px-sm"
            :ripple="false"
            color="primary"
            @click="disableTwoFactorAuthentication"
            :label="$t('TWOFACTORAUTH.ACTION_DISABLE_TFA')"
          />
          <q-btn
            unelevated
            no-caps
            dense
            class="q-px-sm"
            :ripple="false"
            color="primary"
            :label="$t('COREWEBCLIENT.ACTION_CANCEL')"
            @click="confirmTwoFactorAuthentication = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-inner-loading style="justify-content: flex-start" :showing="loading || saving">
      <q-linear-progress query />
    </q-inner-loading>
  </q-scroll-area>
</template>

<script>
import webApi from 'src/utils/web-api'
import notification from 'src/utils/notification'
import errors from 'src/utils/errors'

import typesUtils from 'src/utils/types'
import _ from 'lodash'

import cache from 'src/cache'

export default {
  name: 'TwoFactorAuthAdminSettingsPerUser',
  data() {
    return {
      user: null,
      loading: false,
      saving: false,
      twoFactorAuthEnabled: false,
      confirmTwoFactorAuthentication: false,
    }
  },
  computed: {
    inscriptionTwoFactorAuthentication() {
      if (this.twoFactorAuthEnabled) {
        return this.$t('TWOFACTORAUTH.INFO_TFA_ENABLED_FOR_USER', { USER: this.user?.publicId })
      } else {
        return this.$t('TWOFACTORAUTH.INFO_TFA_DISABLED_FOR_USER', { USER: this.user?.publicId })
      }
    },
    confirmDisableTwoFactorAuthentication() {
      return this.$t('TWOFACTORAUTH.CONFIRM_DISABLE_TFA', { USER: this.user?.publicId })
    },
  },
  watch: {
    $route(to, from) {
      this.parseRoute()
    },
  },
  mounted() {
    this.parseRoute()
  },
  methods: {
    disableTwoFactorAuthentication() {
      const parameters = {
        UserId: this.user.id,
        TenantId: this.user.tenantId,
      }
      webApi
        .sendRequest({
          moduleName: 'TwoFactorAuth',
          methodName: 'DisableUserTwoFactorAuth',
          parameters,
        })
        .then(
          (result) => {
            this.confirmTwoFactorAuthentication = false
            if (result) {
              this.populate()
              notification.showReport(this.$t('TWOFACTORAUTH.REPORT_DISABLE_USER_TFA', { USER: this.user.publicId }))
            } else {
              notification.showError(this.$t('TWOFACTORAUTH.ERROR_DISABLE_USER_TFA', { USER: this.user.publicId }))
            }
          },
          (response) => {
            this.confirmTwoFactorAuthentication = false
            notification.showError(
              errors.getTextFromResponse(
                response,
                this.$t('TWOFACTORAUTH.ERROR_DISABLE_USER_TFA', { USER: this.user.publicId })
              )
            )
          }
        )
    },
    showTwoFactorAuthenticationDialogue() {
      this.confirmTwoFactorAuthentication = true
    },
    parseRoute() {
      const userId = typesUtils.pPositiveInt(this.$route?.params?.id)
      if (this.user?.id !== userId) {
        this.user = {
          id: userId,
        }
        this.populate()
      }
    },
    populate() {
      this.loading = true
      const currentTenantId = this.$store.getters['tenants/getCurrentTenantId']
      cache.getUser(currentTenantId, this.user.id).then(({ user, userId }) => {
        if (userId === this.user.id) {
          this.loading = false
          if (user && _.isFunction(user?.getData)) {
            this.user = user
            this.getUserSettings()
          } else {
            this.$emit('no-user-found')
          }
        }
      })
    },
    getUserSettings() {
      this.loading = true
      const parameters = {
        UserId: this.user.id,
        TenantId: this.user.tenantId,
      }
      webApi
        .sendRequest({
          moduleName: 'TwoFactorAuth',
          methodName: 'GetUserSettings',
          parameters,
        })
        .then(
          (result) => {
            this.loading = false
            if (result) {
              this.twoFactorAuthEnabled = result?.TwoFactorAuthEnabled
            }
          },
          (response) => {
            this.loading = false
            notification.showError(errors.getTextFromResponse(response))
          }
        )
    },
  },
}
</script>

<style scoped></style>
