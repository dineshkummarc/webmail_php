<template>
  <div id="q-app">
    <router-view />
    <UnsavedChangesDialog ref="unsavedChangesDialog" />
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import _ from 'lodash'

import types from 'src/utils/types'

import core from 'src/core'
import modulesManager from 'src/modules-manager'

import UnsavedChangesDialog from 'src/components/UnsavedChangesDialog'

const mixins = {
  methods: {
    _getParentComponent: function (sComponentName) {
      let oComponent = null
      let oParent = this.$parent
      while (oParent && !oComponent) {
        if (oParent.$options.name === sComponentName) {
          oComponent = oParent
        }
        oParent = oParent.$parent
      }
      return oComponent
    },
    doBeforeRouteLeave: function (to, from, next) {
      const oAppComponent = this._getParentComponent('App')
      const oUnsavedChangesDialog = oAppComponent ? oAppComponent.$refs.unsavedChangesDialog : null

      if (
        _.isFunction(this.hasChanges) &&
        this.hasChanges() &&
        _.isFunction(oUnsavedChangesDialog?.openConfirmDiscardChangesDialog)
      ) {
        oUnsavedChangesDialog.openConfirmDiscardChangesDialog(() => {
          if (this.revertChanges) {
            this.revertChanges()
          }
          next()
        })
      } else {
        next()
      }
    },
  },
}

export default defineComponent({
  mixins: [mixins],
  name: 'App',

  components: {
    UnsavedChangesDialog,
  },

  meta() {
    return {
      title: this.siteName,
    }
  },

  computed: {
    isUserSuperAdminOrTenantAdmin: function () {
      return this.$store.getters['user/isUserSuperAdminOrTenantAdmin']
    },
    siteName: function () {
      return this.$store.getters['main/getSiteName']
    },
  },

  watch: {
    isUserSuperAdminOrTenantAdmin: function () {
      const currentRoute = this.$router.currentRoute.value
      // const currentRoute = this.$route
      const currentPath = currentRoute?.path
      const matchedRoutes = types.pArray(currentRoute?.matched)
      const correctedPath = modulesManager.checkRouteExistsAndAllowed(matchedRoutes)
      if (matchedRoutes.length > 0 && currentPath !== correctedPath) {
        this.$router.push(correctedPath)
      }
    },
  },

  methods: {
    handleMessageEvent(event) {
      if (event && event.origin === window.location.origin && event.data && event.data.eventName === 'logout') {
        core.logout(() => {
          window.parent.postMessage({ eventName: 'after-logout' }, event.origin)
        })
      }
    },
  },

  mounted() {
    if (window.frameElement) {
      window.addEventListener('message', this.handleMessageEvent)
    } else {
      window.document.getElementsByTagName('body')[0].classList.add('body-background')
    }
  },

  beforeUnmount() {
    window.removeEventListener('message', this.handleMessageEvent)
  },
})
</script>

<style lang="scss">
html {
  height: 100%;
}
.body-background {
  background: #1998a4 no-repeat 0 0 / cover url('~assets/background.jpg');
  min-height: 100%;
}
</style>
