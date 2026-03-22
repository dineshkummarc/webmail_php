<template>
  <main-layout>
    <q-splitter after-class="q-splitter__right-panel" class="full-height full-width" v-model="splitterWidth"
                :limits="[10,30]">
      <template v-slot:before>
        <q-scroll-area class="full-height full-width">
          <q-list>
            <div v-for="item in tabs" :key="item.tabName">
              <q-item clickable @click="changeTab(item.tabName)"
                      :class="currentTabName === item.tabName ? 'bg-selected-item text-white' : ''"
              >
                <q-item-section>
                  <q-item-label lines="1">{{ $t(item.tabTitle) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator/>
            </div>
          </q-list>
        </q-scroll-area>
      </template>
      <template v-slot:after>
        <router-view></router-view>
      </template>
    </q-splitter>
  </main-layout>
</template>

<script>
import _ from 'lodash'

import modulesManager from 'src/modules-manager'
import settings from 'src/settings'

import typesUtils from 'src/utils/types'

import MainLayout from 'src/layouts/MainLayout'

export default {
  name: 'System',

  components: {
    MainLayout,
  },

  data() {
    return {
      tabs: [],

      splitterWidth: typesUtils.pInt(localStorage.getItem('aurora_admin_system_splitter-width'), 20),

      currentTabName: '',
    }
  },

  watch: {
    $route(to, from) {
      this.setCurrentTabName()
    },

    tabs () {
      this.setCurrentTabName()
    },

    splitterWidth () {
      localStorage.setItem('aurora_admin_system_splitter-width', this.splitterWidth)
    }
  },

  mounted () {
    const tabsOrder = settings.getTabsOrder()
    let tabs = modulesManager.getAdminEntityTabs('getAdminSystemTabs').map(tab => {
      return {
        tabName: tab.tabName,
        tabTitle: tab.tabTitle,
      }
    })
    if (typesUtils.isNonEmptyArray(tabs)) {
      tabs = _.sortBy(tabs, (tab) => {
        const index = _.indexOf(tabsOrder, tab.tabName)
        return index !== -1 ? index : tabsOrder.length
      })
      this.tabs = tabs
    }
  },

  methods: {
    setCurrentTabName () {
      const fullPath = this.$route.fullPath
      const pathParts = fullPath.split('/')
      this.currentTabName = pathParts.length > 2 ? pathParts[2] : ''
      if (!this.currentTabName) {
        this.changeTab(this.tabs[0].tabName)
      }
      // Third element in the path represents current tab name. Paths examples:
      // /system/licensing
      // /system/mail-servers
      // /system/mail-servers/id/1
    },

    changeTab (tabName) {
      // const currentPath = this.$router.currentRoute. && this.$router.currentRoute.path ? this.$router.currentRoute.path : ''
      const currentPath = this.$route?.path || ''
      const newPath = '/system/' + tabName
      if (currentPath !== newPath) {
        this.$router.push(newPath)
      } else {
        this.setCurrentTabName()
      }
    },
  },
}
</script>

<style lang="scss">
</style>
