<template>
  <main-layout>
    <q-splitter after-class="q-splitter__right-panel" class="full-height full-width"
                v-model="listSplitterWidth" :limits="[10,30]">
      <template v-slot:before>
        <div class="flex column full-height ">
          <q-toolbar class="col-auto q-py-sm list-border">
            <q-btn flat color="grey-8" size="mg" no-wrap :disable="checkedIds.length === 0"
                   @click="askDeleteCheckedGroups">
              <IconTrash />
              <span>{{ countLabel }}</span>
              <q-tooltip>
                {{ $t('COREWEBCLIENT.ACTION_DELETE') }}
              </q-tooltip>
            </q-btn>
            <q-btn flat color="grey-8" size="mg" @click="routeCreateGroup">
              <IconAdd />
              <q-tooltip>
                {{ $t('ADMINPANELWEBCLIENT.ACTION_CREATE_ENTITY_GROUP') }}
              </q-tooltip>
            </q-btn>
          </q-toolbar>
          <standard-list class="col-grow list-border" :items="groupItems" :selectedItem="selectedGroupId" :loading="loadingGroups"
                        :search="search" :page="page" :pagesCount="pagesCount"
                        :noItemsText="'ADMINPANELWEBCLIENT.INFO_NO_ENTITIES_GROUP'"
                        :noItemsFoundText="'ADMINPANELWEBCLIENT.INFO_NO_ENTITIES_FOUND_GROUP'"
                        ref="groupList" @route="route" @check="afterCheck"
          >
            <template v-slot:right-icon="scope">
              <q-item-section side>
                <IconTeamGroup :size="24" :color="scope.color" />
              </q-item-section>
            </template>
          </standard-list>
        </div>
      </template>
      <template v-slot:after>
        <router-view @group-created="handleCreateGroup"
                     @cancel-create="route" @delete-group="askDeleteGroup" :deletingIds="deletingIds"></router-view>
      </template>
      <ConfirmDialog ref="confirmDialog"/>
    </q-splitter>
  </main-layout>
</template>

<script>
import _ from 'lodash'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import webApi from 'src/utils/web-api'

import settings from 'src/settings'

import MainLayout from 'src/layouts/MainLayout'
import ConfirmDialog from 'components/ConfirmDialog'
import StandardList from 'components/StandardList'
import IconAdd from 'src/assets/icons/Add'
import IconTeamGroup from 'src/assets/icons/TeamGroup'
import IconTrash from 'src/assets/icons/Trash'

export default {
  name: 'Groups',

  components: {
    MainLayout,
    ConfirmDialog,
    StandardList,
    IconAdd,
    IconTeamGroup,
    IconTrash,
  },

  data() {
    return {
      groups: [],
      selectedGroupId: 0,
      loadingGroups: false,
      totalCount: 0,

      search: '',
      page: 1,
      limit: settings.getEntitiesPerPage(),

      groupItems: [],
      checkedIds: [],

      justCreatedId: 0,

      deletingIds: [],

      listSplitterWidth: typesUtils.pInt(localStorage.getItem('aurora_admin_groups_splitter-width'), 20),
    }
  },

  computed: {
    currentTenantId () {
      return this.$store.getters['tenants/getCurrentTenantId']
    },

    allGroups () {
      const groups = this.$store.getters['groups/getGroups']
      return typesUtils.pArray(groups[this.currentTenantId])
    },

    pagesCount () {
      return Math.ceil(this.totalCount / this.limit)
    },

    countLabel () {
      const count = this.checkedIds.length
      return count > 0 ? count : ''
    },
  },

  watch: {
    $route (to, from) {
      this.parseRoute()
    },

    currentTenantId () {
      if (this.$route.path !== '/groups') {
        this.$router.push('/groups')
      }
      this.requestGroups()
    },

    allGroups () {
      this.populate()
      if (this.justCreatedId && this.allGroups.find(group => {
        return group.id === this.justCreatedId
      })) {
        if (this.groups.find(group => {
          return group.id === this.justCreatedId
        })) {
          this.route(this.justCreatedId)
        }
        this.justCreatedId = 0
      }
    },

    groups () {
      if (this.groups) {
        this.groupItems = this.groups.map(group => {
          return {
            id: group.id,
            title: group.name,
            checked: false,
            disableCheck: group.isTeam,
            showRightIcon: group.isTeam,
          }
        })
      } else {
        this.groupItems = []
      }
    },

    listSplitterWidth () {
      localStorage.setItem('aurora_admin_groups_splitter-width', this.listSplitterWidth)
    },
  },

  mounted () {
    this.requestGroups()
    this.parseRoute()
    this.populate()
  },

  methods: {
    requestGroups () {
      this.$store.dispatch('groups/requestGroups', {
        tenantId: this.currentTenantId
      })
    },

    parseRoute () {
      if (this.$route.path === '/groups/create') {
        this.selectedGroupId = 0
      } else {
        const search = typesUtils.pString(this.$route?.params?.search)
        const page = typesUtils.pPositiveInt(this.$route?.params?.page)
        if (this.search !== search || this.page !== page || this.justCreatedId !== 0) {
          this.search = search
          this.page = page
          this.populate()
        }

        const groupId = typesUtils.pNonNegativeInt(this.$route?.params?.id)
        if (this.selectedGroupId !== groupId) {
          this.selectedGroupId = groupId
        }
      }
    },

    populate () {
      const search = this.search.toLowerCase()
      const groups = search === ''
        ? this.allGroups
        : this.allGroups.filter(group => group.name.toLowerCase().indexOf(search) !== -1)
      this.totalCount = groups.length
      const offset = this.limit * (this.page - 1)
      this.groups = groups.slice(offset, offset + this.limit)
    },

    route (groupId = 0) {
      const enteredSearch = this.$refs?.groupList?.enteredSearch || ''
      const searchRoute = enteredSearch !== '' ? `/search/${enteredSearch}` : ''

      let selectedPage = this.$refs?.groupList?.selectedPage || 1
      if (this.search !== enteredSearch) {
        selectedPage = 1
      }
      const pageRoute = selectedPage > 1 ? `/page/${selectedPage}` : ''

      const idRoute = groupId > 0 ? `/id/${groupId}` : ''
      const path = '/groups' + searchRoute + pageRoute + idRoute
      if (path !== this.$route.path) {
        this.$router.push(path)
      }
    },

    routeCreateGroup () {
      this.$router.push('/groups/create')
    },

    handleCreateGroup (id) {
      this.justCreatedId = id
      this.route()
      this.requestGroups()
    },

    afterCheck (ids) {
      this.checkedIds = ids
    },

    askDeleteGroup (id) {
      this.askDeleteGroups([id])
    },

    askDeleteCheckedGroups () {
      this.askDeleteGroups(this.checkedIds)
    },

    askDeleteGroups (ids) {
      if (_.isFunction(this?.$refs?.confirmDialog?.openDialog)) {
        const group = ids.length === 1
          ? this.groups.find(group => {
            return group.id === ids[0]
          })
          : null
        const title = group ? group.name : ''
        this.$refs.confirmDialog.openDialog({
          title,
          message: this.$tc('ADMINPANELWEBCLIENT.CONFIRM_DELETE_GROUP_PLURAL', ids.length),
          okHandler: this.deleteGroups.bind(this, ids)
        })
      }
    },

    deleteGroups (ids) {
      this.deletingIds = ids
      this.loadingGroups = true
      webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'DeleteGroups',
        parameters: {
          IdList: ids,
          Type: 'Group',
        },
      }).then(result => {
        this.deletingIds = []
        this.loadingGroups = false
        if (result === true) {
          notification.showReport(this.$tc('ADMINPANELWEBCLIENT.REPORT_DELETE_ENTITIES_GROUP_PLURAL', ids.length))
          const isSelectedGroupRemoved = ids.indexOf(this.selectedGroupId) !== -1
          const selectedPage = this.$refs?.groupList?.selectedPage || 1
          const shouldChangePage = this.groups.length === ids.length && selectedPage > 1
          if (shouldChangePage && _.isFunction(this.$refs?.groupList?.decreasePage)) {
            this.$refs.groupList.decreasePage()
          } else if (isSelectedGroupRemoved) {
            this.route()
            this.populate()
          } else {
            this.populate()
          }
        } else {
          notification.showError(this.$tc('ADMINPANELWEBCLIENT.ERROR_DELETE_ENTITIES_GROUP_PLURAL', ids.length))
        }
        this.requestGroups()
      }, error => {
        this.deletingIds = []
        this.loadingGroups = false
        notification.showError(errors.getTextFromResponse(error, this.$tc('ADMINPANELWEBCLIENT.ERROR_DELETE_ENTITIES_GROUP_PLURAL', ids.length)))
        this.requestGroups()
      })
    },
  },
}
</script>
