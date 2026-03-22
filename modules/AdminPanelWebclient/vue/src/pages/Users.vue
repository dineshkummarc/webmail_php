<template>
  <main-layout>
    <q-splitter
      :after-class="!showTabs ? 'q-splitter__right-panel' : ''"
      class="full-height full-width"
      v-model="listSplitterWidth"
      :limits="[10, 30]"
    >
      <template v-slot:before>
        <div class="flex column full-height">
          <q-toolbar class="col-auto q-py-sm list-border">
            <div class="flex">
              <q-btn
                flat
                color="grey-8"
                size="mg"
                no-wrap
                :disable="checkedIds.length === 0"
                @click="askDeleteCheckedUsers"
              >
                <IconTrash />
                <span>{{ countLabel }}</span>
                <q-tooltip>
                  {{ $t('COREWEBCLIENT.ACTION_DELETE') }}
                </q-tooltip>
              </q-btn>
              <q-btn flat color="grey-8" size="mg" @click="routeCreateUser" v-if="allowCreateUser">
                <IconAdd />
                <q-tooltip>
                  {{ $t('ADMINPANELWEBCLIENT.ACTION_CREATE_ENTITY_USER') }}
                </q-tooltip>
              </q-btn>
              <span v-if="allTenantGroups.length > 0 && isUserSuperAdmin">
                <q-btn-dropdown
                  flat
                  color="grey-8"
                  size="mg"
                  :disable="checkedOrSelectedUsersIds.length === 0 || groups.length === 0"
                >
                  <template v-slot:label>
                    <IconAddToGroup />
                    <q-tooltip>
                      {{ $t('ADMINPANELWEBCLIENT.ACTION_ADD_USER_TO_GROUP') }}
                    </q-tooltip>
                  </template>
                  <q-list>
                    <q-item
                      clickable
                      v-close-popup
                      v-for="group in groups"
                      :key="group.id"
                      @click="addUsersToGroup(group.id)"
                    >
                      <q-item-section>
                        <q-item-label>{{ group.name }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
                <q-btn flat color="grey-8" size="mg" @click="removeFromGroup" :disable="disableRemoveFromGroup">
                  <IconRemoveFromGroup />
                  <q-tooltip>
                    {{ $t('ADMINPANELWEBCLIENT.ACTION_REMOVE_USER_FROM_GROUP') }}
                  </q-tooltip>
                </q-btn>
              </span>
              <component
                v-for="filter in filters"
                :key="filter.name"
                v-bind:is="filter"
                @filter-selected="routeFilter"
                @filter-filled-up="populateFiltersGetParameters"
                @allow-create-user="handleAllowCreateUser"
              />
            </div>
          </q-toolbar>

          <StandardList
            class="col-grow list-border"
            :items="userItems"
            :selectedItem="selectedUserId"
            :loading="loadingUsers"
            :search="search"
            :page="page"
            :pagesCount="pagesCount"
            :noItemsText="'ADMINPANELWEBCLIENT.INFO_NO_ENTITIES_USER'"
            :noItemsFoundText="'ADMINPANELWEBCLIENT.INFO_NO_ENTITIES_FOUND_USER'"
            ref="userList"
            @route="route"
            @check="afterCheck"
          />
        </div>
      </template>
      <template v-slot:after>
        <q-splitter
          after-class="q-splitter__right-panel"
          v-if="showTabs"
          class="full-height full-width"
          v-model="tabsSplitterWidth"
          :limits="[10, 30]"
        >
          <template v-slot:before>
            <q-list>
              <div>
                <q-item clickable @click="route(selectedUserId)" :class="selectedTab === '' ? 'bg-selected-item' : ''">
                  <q-item-section>
                    <q-item-label lines="1" v-t="'ADMINPANELWEBCLIENT.LABEL_COMMON_SETTINGS_TAB'"></q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
              </div>
              <div v-for="tab in tabs" :key="tab.tabName">
                <template v-if="tab.hideTabForSelectedUserRoles.indexOf(selectedUserRole) === -1">
                  <q-item
                    clickable
                    @click="route(selectedUserId, tab.tabName)"
                    :class="selectedTab === tab.tabName ? 'bg-selected-item' : ''"
                  >
                    <q-item-section>
                      <q-item-label lines="1">{{ $t(tab.tabTitle) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                </template>
              </div>
              <q-inner-loading style="justify-content: flex-start" :showing="deleting">
                <q-linear-progress query />
              </q-inner-loading>
            </q-list>
          </template>
          <template v-slot:after>
            <router-view
              @no-user-found="handleNoUserFound"
              @user-created="handleCreateUser"
              @user-updated="handleUpdateUser"
              @cancel-create="route"
              @delete-user="askDeleteUser"
              :deletingIds="deletingIds"
              :createMode="createMode"
            ></router-view>
          </template>
        </q-splitter>
        <router-view
          v-if="!showTabs"
          @no-user-found="handleNoUserFound"
          @user-created="handleCreateUser"
          @user-updated="handleUpdateUser"
          @cancel-create="route"
          @delete-user="askDeleteUser"
          :deletingIds="deletingIds"
          :createMode="createMode"
        ></router-view>
      </template>
      <ConfirmDialog ref="confirmDialog" />
    </q-splitter>
  </main-layout>
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

import MainLayout from 'src/layouts/MainLayout'
import ConfirmDialog from 'src/components/ConfirmDialog'
import StandardList from 'src/components/StandardList'

import IconAdd from 'src/assets/icons/Add'
import IconAddToGroup from 'src/assets/icons/AddToGroup'
import IconRemoveFromGroup from 'src/assets/icons/RemoveFromGroup'
import IconTrash from 'src/assets/icons/Trash'

import enums from 'src/enums'
let UserRoles = {}

export default {
  name: 'Domains',

  components: {
    MainLayout,
    ConfirmDialog,
    StandardList,
    IconAdd,
    IconAddToGroup,
    IconRemoveFromGroup,
    IconTrash,
  },

  data() {
    return {
      users: [],
      selectedUserId: 0,
      loadingUsers: false,
      totalCount: 0,

      search: '',
      page: 1,
      limit: settings.getEntitiesPerPage(),

      userItems: [],
      checkedIds: [],

      allowCreateUser: true,
      justCreatedId: 0,

      deletingIds: [],
      selectedGroupId: -1,

      tabs: [],
      selectedTab: '',

      listSplitterWidth: typesUtils.pInt(localStorage.getItem('aurora_admin_users_splitter-width'), 20),
      tabsSplitterWidth: typesUtils.pInt(localStorage.getItem('aurora_admin_users_tabs_splitter-width'), 20),

      filters: [],
      currentFiltersRoutes: {},
      filtersGetParameters: {},
    }
  },

  computed: {
    currentTenantId() {
      return this.$store.getters['tenants/getCurrentTenantId']
    },

    pagesCount() {
      return Math.ceil(this.totalCount / this.limit)
    },

    countLabel() {
      const count = this.checkedIds.length
      return count > 0 ? count : ''
    },

    showTabs() {
      return this.tabs.length > 0 && this.selectedUserId > 0
    },

    deleting() {
      return this.deletingIds.indexOf(this.selectedUserId) !== -1
    },

    createMode() {
      const createIndex = this.$route.path.indexOf('/create')
      return createIndex !== -1 && createIndex === this.$route.path.length - 7
    },

    allTenantGroups() {
      const groups = this.$store.getters['groups/getGroups']
      const allTenantGroups = typesUtils.pArray(groups[this.currentTenantId])
      return allTenantGroups.filter((group) => !group.isTeam)
    },

    groups() {
      const selectedGroupId = this.selectedGroupId
      return this.allTenantGroups.filter((group) => group.id !== selectedGroupId)
    },

    checkedOrSelectedUsersIds() {
      if (this.checkedIds.length > 0) {
        return this.checkedIds
      }
      if (this.selectedUserId !== 0) {
        return [this.selectedUserId]
      }
      return []
    },

    disableRemoveFromGroup() {
      const selectedGroup = this.allTenantGroups.find((group) => group.id === this.selectedGroupId)
      return !selectedGroup || this.checkedOrSelectedUsersIds.length <= 0
    },

    selectedUserRole() {
      const selectedUser = this.users.find((user) => user.id === this.selectedUserId),
        selectedUserRole = selectedUser && selectedUser.role
      return selectedUserRole || UserRoles.NormalUser
    },

    isUserSuperAdmin() {
      return this.$store.getters['user/isUserSuperAdmin']
    },

    userRole() {
      return this.$store.getters['user/getUserRole']
    },
  },

  watch: {
    currentTenantId() {
      if (this.$route.path !== '/users') {
        this.route()
      }
      this.populate()
    },

    $route(to, from) {
      this.parseRoute()
    },

    users() {
      const userPublicId = this.$store.getters['user/getUserPublicId']
      const UserRoles = enums.getUserRoles()

      this.userItems = this.users.map((user) => {
        const labels = []
        if (user.disabled) {
          labels.push({
            title: this.$t('ADMINPANELWEBCLIENT.LABEL_DISABLED'),
            cssClass: 'disabled',
          })
        }
        if (user.publicId === userPublicId) {
          labels.push({
            title: this.$t('ADMINPANELWEBCLIENT.LABEL_ITS_ME'),
            cssClass: 'me',
          })
        }
        if (user.role === UserRoles.TenantAdmin) {
          labels.push({
            title: this.$t('ADMINPANELWEBCLIENT.LABEL_ITS_ADMIN'),
            cssClass: 'admin',
          })
        }

        return {
          id: user.id,
          title: user.publicId,
          checked: false,
          labels,
        }
      })
    },

    allowCreateUser() {
      if (!this.allowCreateUser && this.createMode) {
        this.$router.push('/users')
      }
    },

    listSplitterWidth(listSplitterWidth) {
      localStorage.setItem('aurora_admin_users_splitter-width', listSplitterWidth)
    },

    tabsSplitterWidth(tabsSplitterWidth) {
      localStorage.setItem('aurora_admin_users_tabs_splitter-width', tabsSplitterWidth)
    },
  },

  mounted() {
    UserRoles = enums.getUserRoles()
    this.populateFilters()
    this.populateTabs()
    this.populate()
    this.parseRoute()
  },

  methods: {
    parseRoute() {
      if (this.createMode) {
        this.selectedUserId = 0
      } else {
        const search = typesUtils.pString(this.$route?.params?.search)
        const page = typesUtils.pPositiveInt(this.$route?.params?.page)
        if (this.search !== search || this.page !== page || this.justCreatedId !== 0) {
          this.search = search
          this.page = page
          this.populate()
        }

        const userId = typesUtils.pNonNegativeInt(this.$route?.params?.id)
        if (this.selectedUserId !== userId) {
          this.selectedUserId = userId
        }

        this.selectedGroupId = typesUtils.pInt(this.$route?.params?.group)

        const pathParts = this.$route.path.split('/')
        const lastPart = pathParts.length > 0 ? pathParts[pathParts.length - 1] : ''
        const tab = this.tabs.find((tab) => {
          return tab.tabName === lastPart
        })
        this.selectedTab = tab ? tab.tabName : ''
      }
    },

    handleAllowCreateUser(data) {
      if (data.tenantId === this.currentTenantId) {
        this.allowCreateUser = data.allowCreateUser
      }
    },

    populateFilters() {
      this.filters = modulesManager.getFiltersForUsers()
    },

    populateTabs() {
      this.tabs = modulesManager.getAdminEntityTabs('getAdminUserTabs').map((tab) => {
        return {
          tabName: tab.tabName,
          tabTitle: tab.tabTitle,
          hideTabForSelectedUserRoles:
            tab.hideTabForSelectedUserRoles !== undefined ? tab.hideTabForSelectedUserRoles : [],
        }
      })
    },

    populateFiltersGetParameters(filterGetParameter) {
      const newFiltersGetParameters = _.extend(_.clone(this.filtersGetParameters), filterGetParameter)
      if (!_.isEqual(newFiltersGetParameters, this.filtersGetParameters)) {
        this.filtersGetParameters = newFiltersGetParameters
        this.populate()
      }
    },

    populate() {
      this.loadingUsers = true
      cache
        .getUsers(this.currentTenantId, this.filtersGetParameters, this.search, this.page, this.limit)
        .then(({ users, totalCount, tenantId, filtersGetParameters = {}, page = 1, search = '' }) => {
          if (
            tenantId === this.currentTenantId &&
            _.isEqual(filtersGetParameters, this.filtersGetParameters) &&
            page === this.page &&
            search === this.search
          ) {
            this.users = users
            this.totalCount = totalCount
            this.loadingUsers = false
            if (this.justCreatedId && users.find(user => user.id === this.justCreatedId)) {
              this.route(this.justCreatedId)
              this.justCreatedId = 0
            }
          }
        })
    },

    getFiltersRoute() {
      const filterRoutes = _.map(this.currentFiltersRoutes, (routeValue, routeName) => {
        return routeValue !== undefined ? routeName + '/' + routeValue : ''
      })
      const filterRoutesValues = _.filter(filterRoutes, (routeValue) => {
        return routeValue !== ''
      })
      return filterRoutesValues.length > 0 ? '/' + filterRoutesValues.join('/') : ''
    },

    routeFilter(data) {
      if (this.currentFiltersRoutes[data.routeName] !== data.routeValue) {
        this.currentFiltersRoutes[data.routeName] = data.routeValue
        this.route()
      }
    },

    route(userId = 0, tabName = '') {
      const enteredSearch = this.$refs?.userList?.enteredSearch || ''
      const searchRoute = enteredSearch !== '' ? `/search/${enteredSearch}` : ''

      let selectedPage = this.$refs?.userList?.selectedPage || 1
      if (this.search !== enteredSearch) {
        selectedPage = 1
      }
      const pageRoute = selectedPage > 1 ? `/page/${selectedPage}` : ''

      const idRoute = userId > 0 ? `/id/${userId}` : ''
      const tabRoute = tabName !== '' ? `/${tabName}` : ''
      const path = '/users' + this.getFiltersRoute() + searchRoute + pageRoute + idRoute + tabRoute
      if (path !== this.$route.path) {
        this.$router.push(path)
      }
    },

    routeCreateUser() {
      this.$router.push('/users' + this.getFiltersRoute() + '/create')
    },

    handleCreateUser(id) {
      this.justCreatedId = id
      this.route()
      this.populate()
    },

    handleUpdateUser(id) {
      this.populate()
    },

    afterCheck(ids) {
      this.checkedIds = ids
    },

    handleNoUserFound() {
      notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_USER_NOT_FOUND'))
      this.route()
      this.populate()
    },

    askDeleteUser(id) {
      this.askDeleteUsers([id])
    },

    askDeleteCheckedUsers() {
      this.askDeleteUsers(this.checkedIds)
    },

    askDeleteUsers(ids) {
      if (_.isFunction(this?.$refs?.confirmDialog?.openDialog)) {
        const user =
          ids.length === 1
            ? this.users.find((user) => {
                return user.id === ids[0]
              })
            : null
        const title = user ? user.publicId : ''
        this.$refs.confirmDialog.openDialog({
          title,
          message: this.$tc('ADMINPANELWEBCLIENT.CONFIRM_DELETE_USER_PLURAL', ids.length),
          okHandler: this.deleteUsers.bind(this, ids),
        })
      }
    },

    deleteUsers(ids) {
      this.deletingIds = ids
      this.loadingUsers = true
      webApi
        .sendRequest({
          moduleName: 'Core',
          methodName: 'DeleteUsers',
          parameters: {
            IdList: ids,
          },
        })
        .then(
          (result) => {
            this.deletingIds = []
            this.loadingUsers = false
            if (result === true) {
              notification.showReport(this.$tc('ADMINPANELWEBCLIENT.REPORT_DELETE_ENTITIES_USER_PLURAL', ids.length))
              const isSelectedUserRemoved = ids.indexOf(this.selectedUserId) !== -1
              const selectedPage = this.$refs?.userList?.selectedPage || 1
              const shouldChangePage = this.users.length === ids.length && selectedPage > 1
              if (shouldChangePage && _.isFunction(this.$refs?.userList?.decreasePage)) {
                this.$refs.userList.decreasePage()
              } else if (isSelectedUserRemoved) {
                this.route()
                this.populate()
              } else {
                this.populate()
              }
            } else {
              notification.showError(this.$tc('ADMINPANELWEBCLIENT.ERROR_DELETE_ENTITIES_USER_PLURAL', ids.length))
            }
          },
          (error) => {
            this.deletingIds = []
            this.loadingUsers = false
            notification.showError(
              errors.getTextFromResponse(
                error,
                this.$tc('ADMINPANELWEBCLIENT.ERROR_DELETE_ENTITIES_USER_PLURAL', ids.length)
              )
            )
          }
        )
    },

    addUsersToGroup(groupId) {
      if (this.checkedOrSelectedUsersIds.length > 0) {
        this.$store.dispatch('groups/addUsersToGroup', {
          tenantId: this.currentTenantId,
          groupId,
          usersIds: this.checkedOrSelectedUsersIds,
        })
      }
    },

    async removeFromGroup() {
      if (this.checkedOrSelectedUsersIds.length > 0) {
        await this.$store.dispatch('groups/removeUsersFromGroup', {
          tenantId: this.currentTenantId,
          groupId: this.selectedGroupId,
          usersIds: this.checkedOrSelectedUsersIds,
          callback: this.populate.bind(this),
        })
      }
    },
  },
}
</script>

<style lang="scss">
.q-menu.q-position-engine {
  z-index: 10000;
}
</style>
