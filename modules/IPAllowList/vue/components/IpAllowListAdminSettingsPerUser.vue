<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg">
      <div class="row q-mb-md">
        <div class="col text-h5" v-t="'IPALLOWLIST.HEADING_IP_ALLOWLIST'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings q-mt-lg">
        <q-card-section>
          <div class="row">
            <div class="col-8">
              <q-item-label caption>
                <div v-html="inscriptionIpAllowlist"></div>
              </q-item-label>
            </div>
          </div>
          <div class="row q-mt-md" v-if="ipAllowlistEnabled">
            <div class="col-8">
              <q-btn
                unelevated
                no-caps
                no-wrap
                dense
                class="q-px-xs"
                :ripple="false"
                color="primary"
                :label="$t('IPALLOWLIST.ACTION_DISABLE_IP_ALLOWLIST')"
                @click="confirmIpAllowlist = true"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-dialog v-model="confirmIpAllowlist" persistent>
      <q-card style="min-width: 300px">
        <q-card-section>
          <span v-t="'COREWEBCLIENT.CONFIRM_DISCARD_CHANGES'"></span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            unelevated
            no-caps
            dense
            class="q-px-sm"
            :ripple="false"
            color="primary"
            @click="disableIpAllowlist"
            :label="$t('IPALLOWLIST.ACTION_DISABLE_IP_ALLOWLIST')"
          />
          <q-btn
            unelevated
            no-caps
            dense
            class="q-px-sm"
            :ripple="false"
            color="primary"
            :label="$t('COREWEBCLIENT.ACTION_CANCEL')"
            @click="confirmIpAllowlist = false"
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
import typesUtils from 'src/utils/types'
import _ from 'lodash'
import cache from 'src/cache'

import webApi from 'src/utils/web-api'
import notification from 'src/utils/notification'
import errors from 'src/utils/errors'

export default {
  name: 'IpAllowListAdminSettingsPerUser',

  data() {
    return {
      user: null,
      loading: false,
      saving: false,
      ipAllowlistEnabled: false,
      confirmIpAllowlist: false,
    }
  },

  computed: {
    inscriptionIpAllowlist() {
      if (this.ipAllowlistEnabled) {
        return this.$t('IPALLOWLIST.INFO_IP_ALLOWLIST_ENABLED_FOR_USER', { USER: this.user?.publicId })
      } else {
        return this.$t('IPALLOWLIST.INFO_IP_ALLOWLIST_DISABLED_FOR_USER', { USER: this.user?.publicId })
      }
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

    disableIpAllowlist() {
      const parameters = {
        UserId: this.user.id,
        TenantId: this.user.tenantId,
      }
      webApi
        .sendRequest({
          moduleName: 'IPAllowList',
          methodName: 'DisableUserIpAllowlist',
          parameters,
        })
        .then(
          (result) => {
            this.confirmIpAllowlist = false
            if (result) {
              this.populate()
              notification.showReport(
                this.$t('IPALLOWLIST.REPORT_DISABLE_USER_IP_ALLOWLIST', { USER: this.user.publicId })
              )
            } else {
              notification.showError(
                this.$t('IPALLOWLIST.ERROR_DISABLE_USER_IP_ALLOWLIST', { USER: this.user.publicId })
              )
            }
          },
          (response) => {
            this.confirmIpAllowlist = false
            notification.showError(
              errors.getTextFromResponse(
                response,
                this.$t('IPALLOWLIST.ERROR_DISABLE_USER_IP_ALLOWLIST', { USER: this.user.publicId })
              )
            )
          }
        )
    },

    getUserSettings() {
      this.loading = true
      const parameters = {
        UserId: this.user.id,
        TenantId: this.user.tenantId,
      }
      webApi
        .sendRequest({
          moduleName: 'IPAllowList',
          methodName: 'GetUserSettings',
          parameters,
        })
        .then(
          (result) => {
            this.loading = false
            if (result) {
              this.ipAllowlistEnabled = result?.IpAllowlistEnabled
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
