<template>
  <q-scroll-area class="full-height full-width relative-position">
    <div class="q-pa-lg">
      <div class="row q-mb-md">
        <div class="col text-h5" v-if="!createMode" v-t="'COREWEBCLIENT.HEADING_COMMON_SETTINGS'"></div>
        <div class="col text-h5" v-if="createMode" v-t="'ADMINPANELWEBCLIENT.HEADING_CREATE_USER'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <component
            v-bind:is="mainDataComponent"
            ref="mainDataComponent"
            :currentTenantId="currentTenantId"
            :user="user"
            :createMode="createMode"
            @save="handleSave"
          />
          <div class="row q-mb-md">
            <div class="col-2" v-t="'ADMINPANELWEBCLIENT.LABEL_USER_NOTE'" />
            <div class="col-5 text-weight-medium">
              <q-input outlined dense bg-color="white" autogrow v-model="note" @keyup.enter.exact="save"/>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-2"></div>
            <div class="col-5">
              <q-checkbox dense v-model="isDisabled" :label="$t('ADMINPANELWEBCLIENT.ACTION_DEACTIVATE')" />
            </div>
          </div>
          <div class="row q-mb-md" v-if="userCreatedAtString">
            <div class="col-2" v-t="'ADMINPANELWEBCLIENT.LABEL_USER_CREATED'" />
            <div class="col-5 text-weight-medium">
              <span>{{ userCreatedAtString }}</span>
            </div>
          </div>
          <div class="row q-mb-md" v-if="!createMode">
            <div class="col-2" v-t="'ADMINPANELWEBCLIENT.LABEL_USER_LAST_LOGIN'" />
            <div class="col-5 text-weight-medium">
              <span v-if="userLastLoginAtString">{{ userLastLoginAtString }}</span>
              <span v-else v-t="'ADMINPANELWEBCLIENT.LABEL_USER_NEVER_LOGIN'"></span>
            </div>
          </div>
          <div class="row" v-if="allowMakeTenant">
            <div class="col-2"></div>
            <div class="col-5">
              <q-checkbox dense v-model="isTenantAdmin" :label="$t('ADMINPANELWEBCLIENT.LABEL_USER_IS_TENANT_ADMIN')" />
            </div>
          </div>
          <div class="row q-mt-md" v-if="!createMode && isUserSuperAdmin">
            <div class="col-2"></div>
            <div class="col-5">
              <q-checkbox
                dense
                v-model="writeSeparateLog"
                :label="$t('ADMINPANELWEBCLIENT.LABEL_LOGGING_SEPARATE_LOG_FOR_USER')"
              />
            </div>
          </div>
          <component
            v-for="component in otherDataComponents"
            :key="component.name"
            v-bind:is="component"
            ref="otherDataComponents"
            :currentTenantId="currentTenantId"
            :user="user"
            :createMode="createMode"
            @save="handleSave"
          />
          <div class="row q-mt-md" v-if="!createMode && allTenantGroups.length > 0 && isUserSuperAdmin">
            <div class="col-2 q-mt-sm" v-t="'ADMINPANELWEBCLIENT.LABEL_USER_GROUPS'"></div>
            <div class="col-10">
              <q-select
                dense
                outlined
                bg-color="white"
                use-input
                use-chips
                multiple
                v-model="selectedGroupOptions"
                :options="groupOptions"
                @filter="getGroupOptions"
              >
                <template v-slot:selected>
                  <span v-if="selectedGroupOptions" class="groups-container">
                    <q-chip
                      flat
                      v-for="option in selectedGroupOptions"
                      :key="option.value"
                      removable
                      @remove="removeFromSelectedGroups(option.value)"
                    >
                      <div class="ellipsis">
                        {{ option.label }}
                      </div>
                    </q-chip>
                  </span>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section
                      class="text-grey"
                      v-t="'ADMINPANELWEBCLIENT.LABEL_GROUPS_NO_OPTIONS'"
                    ></q-item-section>
                  </q-item>
                </template>
                <template v-slot:option="scope">
                  <q-item v-close-popup v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section class="non-selectable">
                      <q-item-label>
                        {{ scope.opt.label }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
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
          color="negative"
          @click="deleteUser"
          :label="$t('ADMINPANELWEBCLIENT.ACTION_DELETE_USER')"
          v-if="!createMode"
        >
        </q-btn>
        <q-btn
          unelevated
          no-caps
          dense
          class="q-px-sm q-ml-sm"
          :ripple="false"
          color="primary"
          @click="handleSave"
          :label="$t('COREWEBCLIENT.ACTION_SAVE')"
          v-if="!createMode"
        >
        </q-btn>
        <q-btn
          unelevated
          no-caps
          dense
          class="q-px-sm q-ml-sm"
          :ripple="false"
          color="primary"
          @click="handleSave"
          :label="$t('COREWEBCLIENT.ACTION_CREATE')"
          v-if="createMode"
        >
        </q-btn>
        <q-btn
          unelevated
          no-caps
          dense
          class="q-px-sm q-ml-sm"
          :ripple="false"
          color="secondary"
          @click="cancel"
          :label="$t('COREWEBCLIENT.ACTION_CANCEL')"
          v-if="createMode"
        >
        </q-btn>
      </div>
    </div>
    <q-inner-loading style="justify-content: flex-start" :showing="loading || deleting || saving">
      <q-linear-progress query />
    </q-inner-loading>
  </q-scroll-area>
</template>

<script>
import _ from 'lodash'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import webApi from 'src/utils/web-api'

import cache from 'src/cache'
import modulesManager from 'src/modules-manager'
import settings from 'src/settings'

import moment from 'moment'

import UserModel from 'src/classes/user'

import enums from 'src/enums'
let UserRoles = {}

export default {
  name: 'EditUser',

  props: {
    deletingIds: Array,
    createMode: Boolean,
  },

  data() {
    return {
      mainDataComponent: null,
      otherDataComponents: [],

      user: null,
      publicId: '',
      isDisabled: false,
      isTenantAdmin: false,
      writeSeparateLog: false,
      note: '',

      selectedGroupOptions: [],
      groupOptions: [],

      loading: false,
      saving: false,
    }
  },

  computed: {
    createModeForEditUser() {
      const createIndex = this.$route.path.indexOf('/create')
      return createIndex !== -1 && createIndex === this.$route.path.length - 7
    },
    userCreatedAtString() {
      return this.user?.completeData?.CreatedAt ? moment(this.user?.completeData?.CreatedAt).format('L HH:mm') : null
    },
    userLastLoginAtString() {
      return this.user?.completeData?.LastLogin ? moment(this.user?.completeData?.LastLogin).format('L HH:mm') : null
    },
    currentTenantId() {
      return this.$store.getters['tenants/getCurrentTenantId']
    },

    allTenantGroups() {
      const groups = this.$store.getters['groups/getGroups']
      const allTenantGroups = typesUtils.pArray(groups[this.currentTenantId])
      return allTenantGroups.filter((group) => !group.isTeam)
    },

    deleting() {
      return this.deletingIds.indexOf(this.user?.id) !== -1
    },

    isUserSuperAdmin() {
      const isUserSuperAdmin = this.$store.getters['user/isUserSuperAdmin']
      return isUserSuperAdmin
    },

    allowMakeTenant() {
      const isUserSuperAdmin = this.$store.getters['user/isUserSuperAdmin']
      return isUserSuperAdmin && (settings.getEnableMultiTenant() || true)
    },
  },

  watch: {
    $route() {
      this.parseRoute()
    },

    'user.groups'() {
      if (_.isArray(this.user.groups)) {
        this.selectedGroupOptions = this.user.groups.map((group) => {
          return {
            label: group.name,
            value: group.id,
          }
        })
      }
    },
  },

  beforeRouteLeave(to, from, next) {
    this.$root.doBeforeRouteLeave(to, from, next)
  },

  beforeRouteUpdate(to, from, next) {
    this.$root.doBeforeRouteLeave(to, from, next)
  },

  mounted() {
    UserRoles = enums.getUserRoles()
    this.getUserMainDataComponent()
    this.getUserOtherDataComponents()
    this.loading = false
    this.saving = false
    this.parseRoute()
  },

  methods: {
    async getUserMainDataComponent() {
      this.mainDataComponent = await modulesManager.getUserMainDataComponent()
    },
    async getUserOtherDataComponents() {
      this.otherDataComponents = await modulesManager.getUserOtherDataComponents()
    },
    parseRoute() {
      if (this.$route.path === '/users' || this.$route.path === '/users/') {
        return
      }
      // TODO
      if (this.createMode || this.createModeForEditUser) {
        const user = new UserModel(this.currentTenantId, {})
        this.fillUp(user)
      } else {
        const userId = typesUtils.pPositiveInt(this.$route?.params?.id)
        if (this.user?.id !== userId) {
          this.user = {
            id: userId,
          }
          this.populate()
          this.getUserMainDataComponent()
        }
      }
    },

    clear() {
      this.publicId = ''
      this.isDisabled = false
      this.isTenantAdmin = false
      this.writeSeparateLog = false
      this.note = ''
    },

    fillUp(user) {
      this.user = user
      this.publicId = user.publicId
      this.isDisabled = user.disabled
      this.isTenantAdmin = user.role === UserRoles.TenantAdmin
      this.writeSeparateLog = user.writeSeparateLog
      this.note = user.note
      this.selectedGroupOptions = user.groups.map((group) => {
        return {
          label: group.name,
          value: group.id,
        }
      })
    },

    populate() {
      this.clear()
      this.loading = true
      cache.getUser(this.currentTenantId, this.user.id).then(({ user, userId }) => {
        if (userId === this.user.id) {
          this.loading = false
          if (user) {
            this.fillUp(user)
          } else {
            this.$emit('no-user-found')
          }
        }
      })
    },

    getGroupOptions(search, update, abort) {
      const searchLowerCase = search.toLowerCase()
      const selectedGroupsIds = this.selectedGroupOptions.map((option) => option.value)
      let groups = this.allTenantGroups.filter((group) => selectedGroupsIds.indexOf(group.id) === -1)
      if (searchLowerCase !== '') {
        groups = groups.filter((group) => group.name.toLowerCase().indexOf(searchLowerCase) !== -1)
      }
      update(() => {
        this.groupOptions = groups
          .map((group) => {
            return {
              label: group.name,
              value: group.id,
            }
          })
          .slice(0, 100)
      })
    },

    removeFromSelectedGroups(value) {
      this.selectedGroupOptions = this.selectedGroupOptions.filter((option) => option.value !== value)
    },

    /**
     * Method is used in doBeforeRouteLeave mixin
     */
    hasChanges() {
      if (this.loading) {
        return false
      }

      const hasMainDataChanges = _.isFunction(this.$refs?.mainDataComponent?.hasChanges)
        ? this.$refs.mainDataComponent.hasChanges()
        : false

      const hasOtherDataChanges = () => {
        if (Array.isArray(this.$refs?.otherDataComponents)) {
          return this.$refs.otherDataComponents.some((component) => {
            return typeof component.hasChanges === 'function' ? component.hasChanges() : false
          })
        }
        return false
      }

      return (
        hasMainDataChanges ||
        hasOtherDataChanges() ||
        this.isDisabled !== this.user?.disabled ||
        this.isTenantAdmin !== (this.user?.role === UserRoles.TenantAdmin) ||
        this.writeSeparateLog !== this.user?.writeSeparateLog ||
        this.note !== this.user?.note ||
        this.hasGroupChanges()
      )
    },

    hasGroupChanges() {
      const selectedIds = this.selectedGroupOptions.map((option) => option.value).sort()
      const userIds = (this.user.groups || []).map((group) => group.id).sort()
      return !_.isEqual(selectedIds, userIds)
    },

    /**
     * Method is used in doBeforeRouteLeave mixin,
     * do not use async methods - just simple and plain reverting of values
     * !! hasChanges method must return true after executing revertChanges method
     */
    revertChanges() {
      if (_.isFunction(this.$refs?.mainDataComponent?.revertChanges)) {
        this.$refs.mainDataComponent.revertChanges()
      }
      if (_.isFunction(this.$refs?.otherDataComponents?.forEach)) {
        this.$refs.otherDataComponents.forEach((component) => {
          if (_.isFunction(component.revertChanges)) {
            component.revertChanges()
          }
        })
      }
      this.isDisabled = this.user?.disabled
      this.isTenantAdmin = this.user?.role === UserRoles.TenantAdmin
      this.writeSeparateLog = this.user?.writeSeparateLog
      this.note = this.user?.note
    },

    isDataValid() {
      const isMainDataValid = _.isFunction(this.$refs?.mainDataComponent?.isDataValid)
        ? this.$refs.mainDataComponent.isDataValid()
        : true

      const isOtherDataValid = () => {
        if (Array.isArray(this.$refs?.otherDataComponents)) {
          return this.$refs.otherDataComponents.every((component) => {
            return _.isFunction(component.isDataValid) ? component.isDataValid() : true
          })
        }
        return true
      }

      return isMainDataValid && isOtherDataValid()
    },

    isUserEmailValid() {
      const userData = this.$refs.mainDataComponent.getSaveParameters()
      const userEmail = userData.PublicId
      const userNamePart = userEmail.slice(0, userEmail.lastIndexOf('@'))
      const invalidCharactersRegex = /[@\s]/
      return !invalidCharactersRegex.test(userNamePart) && userNamePart.length
    },

    handleSave() {
      this.isUserEmailValid()
        ? this.save()
        : notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_INVALID_EMAIL_USERNAME_PART'))
    },

    save() {
      if (!this.saving && this.isDataValid()) {
        this.saving = true
        const mainDataParameters = _.isFunction(this.$refs?.mainDataComponent?.getSaveParameters)
          ? this.$refs.mainDataComponent.getSaveParameters()
          : {}
        const isUserSuperAdmin = this.$store.getters['user/isUserSuperAdmin']
        let parameters = _.extend(
          {
            UserId: this.user.id,
            TenantId: this.user.tenantId,
            Role: isUserSuperAdmin
              ? this.isTenantAdmin
                ? UserRoles.TenantAdmin
                : UserRoles.NormalUser
              : UserRoles.NormalUser,
            IsDisabled: this.isDisabled,
            WriteSeparateLog: this.writeSeparateLog,
            Note: this.note,
            Forced: true,
            GroupIds: isUserSuperAdmin ? this.selectedGroupOptions.map((option) => option.value) : null,
          },
          mainDataParameters
        )
        if (_.isFunction(this.$refs?.otherDataComponents?.forEach)) {
          this.$refs.otherDataComponents.forEach((component) => {
            const otherParameters = _.isFunction(component.getSaveParameters) ? component.getSaveParameters() : {}
            parameters = _.extend(parameters, otherParameters)
          })
        }

        webApi
          .sendRequest({
            moduleName: 'Core',
            methodName: this.createMode ? 'CreateUser' : 'UpdateUser',
            parameters,
          })
          .then(
            (result) => {
              this.saving = false
              if (this.createMode) {
                this.handleCreateResult(result, parameters)
              } else {
                this.handleUpdateResult(result, parameters)
              }
            },
            (response) => {
              this.saving = false
              const errorConst = this.createMode ? 'ERROR_CREATE_ENTITY_USER' : 'ERROR_UPDATE_ENTITY_USER'
              notification.showError(errors.getTextFromResponse(response, this.$t('ADMINPANELWEBCLIENT.' + errorConst)))
            }
          )
      }
    },

    handleCreateResult(result, parameters) {
      if (_.isSafeInteger(result)) {
        notification.showReport(this.$t('ADMINPANELWEBCLIENT.REPORT_CREATE_ENTITY_USER'))
        this.user.update(parameters)
        this.$emit('user-created', result)
      } else {
        notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_CREATE_ENTITY_USER'))
      }
    },

    handleUpdateResult(result, parameters) {
      if (result === true) {
        cache.getUser(parameters.TenantId, parameters.UserId).then(({ user }) => {
          user.update(parameters, this.allTenantGroups)
          this.populate()
          this.$emit('user-updated', user.Id)
        })
        notification.showReport(this.$t('ADMINPANELWEBCLIENT.REPORT_UPDATE_ENTITY_USER'))
      } else {
        notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_UPDATE_ENTITY_USER'))
      }
    },

    cancel() {
      this.revertChanges()
      this.$emit('cancel-create')
    },

    deleteUser() {
      this.$emit('delete-user', this.user.id)
    },
  },
}
</script>

<style scoped>
.groups-container {
  display: block;
  width: 100%;
}
</style>
