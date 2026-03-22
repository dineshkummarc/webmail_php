<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg">
      <div class="row q-mb-md">
        <div class="col text-h5">{{ $t('ADMINPANELWEBCLIENT.HEADING_ABOUT_SETTINGS') }}</div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-2" v-t="'ADMINPANELWEBCLIENT.LABEL_PRODUCT_NAME'"></div>
            <div class="col-5"><b>{{ productName }}</b></div>
          </div>
          <div class="row">
            <div class="col-2" v-t="'ADMINPANELWEBCLIENT.LABEL_PRODUCT_VERSION'"></div>
            <div class="col-5"><b>{{ version }}</b></div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-scroll-area>
</template>

<script>
import settings from 'src/settings'

export default {
  name: 'AboutAdminSettings',
  data() {
    return {
      version: '',
      productName: ''
    }
  },
  mounted () {
    this.populate()
  },
  methods: {
    populate () {
      const data = settings.getAboutSettings()
      this.version = data.version
      this.productName = data.productName
    }
  }
}
</script>
