<template>
  <q-dialog v-model="confirm" persistent>
    <q-card style="min-width: 300px">
      <q-card-section class="q-pb-none">
        <div class="text-h6" v-show="title">{{ title }}</div>
      </q-card-section>
      <q-card-section>
        <span>{{ message }}</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary" @click="proceed"
               :label="$t('COREWEBCLIENT.ACTION_OK')" />
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="secondary" @click="cancel"
               :label="$t('COREWEBCLIENT.ACTION_CANCEL')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import _ from 'lodash'

import typesUtils from 'src/utils/types'

export default {
  name: 'ConfirmDialog',

  data () {
    return {
      title: '',
      message: '',
      confirm: false,
      okHandler: null,
    }
  },

  methods: {
    openDialog: async function ({ title, message, okHandler }) {
      if (typesUtils.isNonEmptyString(message)) {
        this.title = title
        this.message = message
        this.confirm = true
        this.okHandler = okHandler
      }
    },

    proceed () {
      if (_.isFunction(this.okHandler)) {
        this.okHandler()
      }
      this.confirm = false
    },

    cancel () {
      this.confirm = false
    },
  },
}
</script>

<style scoped>

</style>
