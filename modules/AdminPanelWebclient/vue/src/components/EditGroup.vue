<template>
  <q-scroll-area class="full-height full-width relative-position">
    <div class="q-pa-lg">
      <div class="row q-mb-md">
        <div class="col text-h5" v-if="!createMode" v-t="'COREWEBCLIENT.HEADING_COMMON_SETTINGS'"></div>
        <div class="col text-h5" v-if="createMode" v-t="'ADMINPANELWEBCLIENT.HEADING_CREATE_GROUP'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md" v-if="isTeamGroup">
            <div class="col-7 q-mt-sm">
              <q-item-label caption v-t="'ADMINPANELWEBCLIENT.INFO_TEAM_GROUP_IN_TENANT'" v-if="enableMultiTenant"></q-item-label>
              <q-item-label caption v-t="'ADMINPANELWEBCLIENT.INFO_TEAM_GROUP_IN_SYSTEM'" v-else></q-item-label>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-2 q-mt-sm" v-t="'ADMINPANELWEBCLIENT.LABEL_GROUP_NAME'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" v-model="groupName" :disable="isTeamGroup" @keyup.enter="save"/>
            </div>
          </div>
          <div class="row q-mb-md" v-if="!createMode">
            <div class="col-2 q-mt-sm"></div>
            <div class="col-5">
              <a href="javascript:void(0)" v-t="'ADMINPANELWEBCLIENT.ACTION_SHOW_GROUP_USERS'"
                 @click="showGroupUsers"
              ></a>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-py-md text-right">
       <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="negative" @click="deleteGroup"
               :label="$t('ADMINPANELWEBCLIENT.ACTION_DELETE_GROUP')" v-if="!createMode && !isTeamGroup">
        </q-btn>
        <q-btn unelevated no-caps dense class="q-px-sm q-ml-sm" :ripple="false" color="primary" @click="save"
               :label="$t('COREWEBCLIENT.ACTION_SAVE')" v-if="!createMode && !isTeamGroup">
        </q-btn>
        <q-btn unelevated no-caps dense class="q-px-sm q-ml-sm" :ripple="false" color="primary" @click="save"
               :label="$t('COREWEBCLIENT.ACTION_CREATE')" v-if="createMode">
        </q-btn>
        <q-btn unelevated no-caps dense class="q-px-sm q-ml-sm" :ripple="false" color="secondary" @click="cancel"
               :label="$t('COREWEBCLIENT.ACTION_CANCEL')" v-if="createMode" >
        </q-btn>
      </div>
    </div>
    <q-inner-loading style="justify-content: flex-start;" :showing="loading || deleting || saving">
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

import settings from 'src/settings'

import GroupModel from 'src/classes/group'

export default {
  name: 'EditGroup',

  props: {
    deletingIds: Array,
  },

  data () {
    return {
      enableMultiTenant: settings.getEnableMultiTenant(),

      group: null,
      groupId: 0,
      groupName: '',
      isTeamGroup: false,
      saving: false,
      loading: false
    }
  },

  computed: {
    currentTenantId () {
      return this.$store.getters['tenants/getCurrentTenantId']
    },

    allGroups () {
      return this.$store.getters['groups/getGroups']
    },

    createMode () {
      return this.group?.id === 0
    },

    deleting () {
      return this.deletingIds.indexOf(this.group?.id) !== -1
    },
  },

  beforeRouteLeave (to, from, next) {
    this.$root.doBeforeRouteLeave(to, from, next)
  },

  beforeRouteUpdate (to, from, next) {
    this.$root.doBeforeRouteLeave(to, from, next)
  },

  async mounted () {
    this.loading = false
    this.saving = false
    this.parseRoute()
  },

  watch: {
    $route() {
      this.parseRoute()
    },

    allGroups () {
      this.populate()
    },
  },

  methods: {
    parseRoute () {
      if (this.$route.path === '/groups/create') {
        const group = new GroupModel({
          TenantId: this.currentTenantId
        })
        this.fillUp(group)
      } else {
        const groupId = typesUtils.pPositiveInt(this.$route?.params?.id)
        if (this.group?.id !== groupId) {
          this.group = {
            id: groupId,
          }
          this.populate()
        }
      }
    },

    populate () {
      const group = this.$store.getters['groups/getGroup'](this.currentTenantId, this.group.id)
      if (group) {
        this.fillUp(group)
      }
    },

    fillUp (group) {
      this.group = group
      this.groupId = group.id
      this.groupName = group.name
      this.isTeamGroup = group.isTeam
    },

    cancel () {
      this.revertChanges()
      this.$emit('cancel-create')
    },

    /**
     * Method is used in doBeforeRouteLeave mixin
     */
    hasChanges () {
      if (this.loading) {
        return false
      }
      return this.group?.name !== this.groupName
    },

    /**
     * Method is used in doBeforeRouteLeave mixin,
     * do not use async methods - just simple and plain reverting of values
     * !! hasChanges method must return true after executing revertChanges method
     */
    revertChanges () {
      this.groupName = this.group?.name
    },

    isValid () {
      if (_.trim(this.groupName) === '') {
        notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_GROUP_NAME_EMPTY'))
        return false
      }
      return true
    },

    getSaveParameters () {
      const parameters = {
        Name: this.groupName,
        TenantId: this.group.tenantId
      }
      if (!this.createMode) {
        parameters.GroupId = this.group.id
      }
      return parameters
    },

    save () {
      if (this.isTeamGroup || this.saving || !this.isValid()) {
        return
      }
      this.saving = true
      const createMode = this.createMode
      const parameters = this.getSaveParameters()
      webApi.sendRequest({
        moduleName: 'Core',
        methodName: createMode ? 'CreateGroup' : 'UpdateGroup',
        parameters,
      }).then(result => {
        this.saving = false
        if (createMode) {
          this.handleCreateResult(result, parameters)
        } else {
          this.handleUpdateResult(result, parameters)
        }
      }, response => {
        this.saving = false
        const errorConst = createMode ? 'ERROR_CREATE_ENTITY_GROUP' : 'ERROR_UPDATE_ENTITY_GROUP'
        notification.showError(errors.getTextFromResponse(response, this.$t('ADMINPANELWEBCLIENT.' + errorConst)))
      })
    },

    handleCreateResult (result) {
      if (_.isSafeInteger(result)) {
        notification.showReport(this.$t('ADMINPANELWEBCLIENT.REPORT_CREATE_ENTITY_GROUP'))
        this.loading = false
        this.revertChanges()
        this.$emit('group-created', result)
      } else {
        notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_CREATE_ENTITY_GROUP'))
      }
    },

    handleUpdateResult (result, data) {
      if (result === true) {
        this.$store.commit('groups/updateGroup', { tenantId: this.currentTenantId, id: this.groupId, data })
        this.populate()
        notification.showReport(this.$t('ADMINPANELWEBCLIENT.REPORT_UPDATE_ENTITY_GROUP'))
      } else {
        notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_UPDATE_ENTITY_GROUP'))
      }
    },

    deleteGroup () {
      this.$emit('delete-group', this.group.id)
    },

    showGroupUsers () {
      this.$router.push(`/users/group/${this.group.id}`)
    },
  }
}
</script>
