<template>
  <q-dialog v-model="confirm" persistent>
    <q-card style="min-width: 300px">
      <q-card-section>
        <span v-t="'COREWEBCLIENT.CONFIRM_DISCARD_CHANGES'"></span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary" @click="discard"
               :label="$t('COREWEBCLIENT.ACTION_OK')" />
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="secondary" @click="cancel"
               :label="$t('COREWEBCLIENT.ACTION_CANCEL')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'UnsavedChangesDialog',

  data () {
    return {
      confirm: false,
      next: null,
    }
  },

  methods: {
    openConfirmDiscardChangesDialog: async function (next) {
      this.next = next
      this.confirm = true
    },

    discard () {
      // proceed with new screen, current changes will be lost
      if (_.isFunction(this.next)) {
        this.next()
      }
      this.confirm = false
    },

    cancel () {
      // stay put, changes need to be cared of
      this.confirm = false
    },
  },
}
</script>

<style scoped>

</style>
