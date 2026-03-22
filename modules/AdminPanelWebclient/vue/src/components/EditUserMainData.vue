<template>
  <div class="row q-mb-md">
    <div class="col-2 q-my-sm" v-t="'COREWEBCLIENT.LABEL_EMAIL'"></div>
    <div class="col-5">
      <q-input outlined dense bg-color="white" v-model="publicId" ref="publicId" :disable="!createMode"
               @keyup.enter="save" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'

export default {
  name: 'EditUserMainData',

  props: {
    user: Object,
    createMode: Boolean,
  },

  data () {
    return {
      publicId: '',
    }
  },

  watch: {
    user () {
      this.populate()
    },
  },

  mounted () {
    this.populate()
  },

  methods: {
    getSaveParameters () {
      return {
        PublicId: this.createMode ? this.publicId : this.user?.publicId
      }
    },

    /**
     * Method is used in parent component
     */
    hasChanges () {
      return this.publicId !== this.user?.publicId
    },

    /**
     * Method is used in parent component,
     * do not use async methods - just simple and plain reverting of values
     * !! hasChanges method must return true after executing revertChanges method
     */
    revertChanges () {
      this.populate()
    },

    populate () {
      this.publicId = typesUtils.pString(this.user?.publicId)
    },

    isDataValid () {
      const publicId = _.trim(this.publicId)
      if (publicId === '') {
        notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_USER_NAME_EMPTY'))
        this.$refs.publicId.$el.focus()
        return false
      }
      return true
    },

    save () {
      this.$emit('save')
    },
  },
}
</script>

<style scoped>

</style>
