<template>
  <login-layout>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column" style="width: 240px">
        <Logo class="logo"/>
        <q-input class="login-name login_screen" bg-color="white" standout="bg-yellow-2" outlined dense v-model="login"
                 :placeholder="$t('COREWEBCLIENT.LABEL_LOGIN')" @keyup.enter="proceedLogin">
          <template v-slot:prepend>
            <q-icon name="person"/>
          </template>
        </q-input>

        <q-input class="q-mt-none login-password login_screen"  bg-color="white" standout="bg-yellow-2" outlined dense v-model="password"
                 type="password" :placeholder="$t('COREWEBCLIENT.LABEL_PASSWORD')" @keyup.enter="proceedLogin">
          <template v-slot:prepend>
            <q-icon name="lock"/>
          </template>
        </q-input>

        <q-btn unelevated no-caps outline bg-color="primary" color="white" class="q-px-sm bg-primary" :ripple="false"
                :loading="loading" @click="proceedLogin">
          {{ $t('COREWEBCLIENT.ACTION_SIGN_IN') }}
          <template v-slot:loading>
            {{ $t('COREWEBCLIENT.ACTION_SIGN_IN_IN_PROGRESS') }}
          </template>
        </q-btn>
      </div>
    </div>
  </login-layout>
</template>

<script>
import _ from 'lodash'

import core from 'src/core'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import webApi from 'src/utils/web-api'

import Logo from 'assets/icons/Logo'
import LoginLayout from 'src/layouts/LoginLayout'

export default {
  name: 'Login',

  components: {
    Logo,
    LoginLayout
  },

  data() {
    return {
      loading: false,
      login: '',
      password: '',
    }
  },
  methods: {
    proceedLogin () {
      if (!this.loading) {
        this.loading = true
        webApi.sendRequest({
          moduleName: 'AdminAuth',
          methodName: 'LoginAsSuperadmin',
          parameters: {
            Login: this.login,
            Password: this.password,
          },
        }).then(result => {
          this.loading = false
          if (_.isObject(result) && !!result.AuthToken) {
            core.requestAppData()
          } else {
            notification.showError(this.$t('COREWEBCLIENT.ERROR_PASS_INCORRECT'))
          }
        }, response => {
          this.loading = false
          notification.showError(errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_PASS_INCORRECT')))
        })
      }
    },
  }
}
</script>

<style scoped>
.logo {
  margin: 0 auto;
}
</style>
