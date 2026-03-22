<template>
  <q-layout view="hHh LpR lfr">
    <q-header>
      <q-tabs class="q-py-sm" v-bind:class="getTabsBarClass()" no-caps align="left" indicator-color="transparent">
        <template v-for="route in routes">
          <q-route-tab
            :key="route.name"
            :to="route.path"
            :ripple="false"
            class="q-px-none"
            v-if="route.name !== 'tenants'"
          >
            <div class="q-px-md tab-label">{{ $t(route.pageTitle) }}</div>
          </q-route-tab>
          <q-route-tab
            :key="route.name"
            to="/tenants"
            :ripple="false"
            class="q-px-none"
            v-if="route.name === 'tenants'"
          >
            <div class="q-px-md tab-label">
              <span v-t="'ADMINPANELWEBCLIENT.HEADING_TENANTS_SETTINGS_TABNAME'"></span>
              <span v-if="tenantOptions.length > 1">:</span>
            </div>
          </q-route-tab>
          <q-btn-dropdown
            :key="route.name + '_btn'"
            no-icon-animation
            cover
            auto-close
            stretch
            flat
            dense
            :ripple="false"
            @click.stop
            v-if="route.name === 'tenants' && tenantOptions.length > 1"
            :label="selectedTenantName"
            class="q-px-none text-weight-regular no-hover tenants-dropdown"
          >
            <q-list class="non-selectable" v-for="tenant in tenantOptions" :key="tenant.id">
              <q-item clickable @click="changeTenant(tenant.id)">
                <q-item-section>{{ tenant.name }}</q-item-section>
                <q-item-section avatar v-show="tenant.id === selectedTenantId">
                  <q-icon name="arrow_drop_up" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </template>
        <q-space />
        <q-tab :ripple="false" class="q-px-none q-tab--logout" @click="logout" v-if="!isIframe">
          <div class="q-px-md tab-label" v-t="'COREWEBCLIENT.ACTION_LOGOUT'"></div>
        </q-tab>
      </q-tabs>
    </q-header>
    <q-page-container style="height: 100vh">
      <q-page class="flex full-height flex-stretch">
        <slot />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import core from 'src/core'
import modulesManager from 'src/modules-manager'

export default {
  name: 'MainLayout',

  components: {},

  data() {
    return {
      routes: [],

      selectedTenantId: null,

      isIframe: window.frameElement,
    }
  },

  computed: {
    currentTenantId() {
      return this.$store.getters['tenants/getCurrentTenantId']
    },

    tenantOptions() {
      const tenants = this.$store.getters['tenants/getTenants']
      const options = []
      tenants.forEach((tenant) => {
        const option = {
          id: tenant.id,
          name: tenant.name,
        }
        if (tenant.id === this.currentTenantId) {
          options.unshift(option)
        } else {
          options.push(option)
        }
      })
      return options
    },

    selectedTenantName() {
      const currentTenant = this.tenantOptions.find((tenant) => tenant.id === this.selectedTenantId)
      return currentTenant ? currentTenant.name : ''
    },

    isUserSuperAdmin() {
      return this.$store.getters['user/isUserSuperAdmin']
    },
  },

  watch: {
    currentTenantId() {
      this.selectedTenantId = this.currentTenantId
    },
  },

  mounted() {
    this.selectedTenantId = this.currentTenantId
    this.$store.dispatch('tenants/requestTenants')

    const userRole = this.$store.getters['user/getUserRole']
    this.routes = modulesManager.getRoutesForUserRole(userRole)
  },

  methods: {
    changeTenant(id) {
      this.$store.commit('tenants/setCurrentTenantId', id)
    },

    logout() {
      core.logout(() => {
        this.$router.push('/')
      })
    },

    getTabsBarClass() {
      return {
        tabsbar: window.frameElement,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.tenants-dropdown {
  margin-left: -6px;
  margin-bottom: -1px;
}

.tabsbar {
  border-top: solid 1px #d4d4d4;
}
</style>
