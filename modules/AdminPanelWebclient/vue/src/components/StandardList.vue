<template>
  <div class="flex column">
    <q-list class="col-auto bg-grey-3">
      <q-item v-if="!hideControls">
        <q-item-section side>
          <q-checkbox dense v-model="hasCheckedItems" />
        </q-item-section>
        <q-item-section>
          <q-input rounded outlined dense v-model="enteredSearch" @keyup.enter="startSearch" autocomplete="off">
            <template v-slot:append>
              <q-icon flat :ripple="false" dense class="q-btn-search search" name="search" @click="startSearch" />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
      <q-separator />
    </q-list>
    <q-scroll-area class="col-grow relative-position">
      <q-inner-loading style="justify-content: flex-start" :showing="loading">
        <q-linear-progress query />
      </q-inner-loading>
      <div v-if="search" class="text-right">
        <q-btn
          dense
          flat
          no-caps
          color="primary"
          class="no-hover q-mr-sm"
          :label="$t('COREWEBCLIENT.ACTION_CLEAR_SEARCH')"
          @click.stop="clearSearch"
        />
      </div>
      <div v-if="search" class="text-center text-h6 text-grey-5 text-weight-regular">
        {{ $t('ADMINPANELWEBCLIENT.INFO_SEARCH_RESULT', { SEARCH: search }) }}
      </div>
      <div
        v-if="!loading && items.length === 0 && !search"
        class="q-ma-md text-center text-h6 text-grey-5 text-weight-regular"
      >
        {{ $t(noItemsText) }}
      </div>
      <div
        v-if="!loading && items.length === 0 && search"
        class="q-ma-md text-center text-h6 text-grey-5 text-weight-regular"
      >
        {{ $t(noItemsFoundText) }}
      </div>
      <q-list>
        <div v-for="item in items" :key="item.id">
          <q-item clickable @click="selectItem(item.id)" :class="getCssClass(item.id, item.checked)">
            <q-item-section side v-if="!hideControls">
              <q-checkbox dense v-model="item.checked" :disable="item.disableCheck" />
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">{{ item.title }}</q-item-label>
            </q-item-section>
            <q-item-section side v-if="item.rightText !== undefined">
              <q-item-label lines="1">{{ item.rightText }}</q-item-label>
            </q-item-section>
            <template v-for="label in item.labels" :key="label.title">
              <q-item-section side :color="selectedItem === item.id ? 'white' : 'black'">
                <span class="label" :class="label.cssClass">{{ label.title }}</span>
              </q-item-section>
            </template>
          </q-item>
          <q-separator />
        </div>
      </q-list>
    </q-scroll-area>
    <q-list class="col-auto" v-if="totalCountText || pagesCount > 1">
      <q-separator />
      <q-item>
        <q-item-section>
          <span>{{ totalCountText }}</span>
        </q-item-section>
        <q-item-section side v-if="pagesCount > 1">
          <q-pagination
            flat
            :boundary-links="pagesCount > 5"
            :max-pages="5"
            :boundary-numbers="false"
            active-color="primary"
            color="grey-6"
            v-model="selectedPage"
            :max="pagesCount"
          />
        </q-item-section>
      </q-item>
      <q-separator />
    </q-list>
  </div>
</template>

<script>
export default {
  name: 'StandardList',

  props: {
    items: Array,
    selectedItem: Number,
    loading: Boolean,
    totalCountText: String,

    search: String,
    page: Number,
    pagesCount: Number,

    noItemsText: String,
    noItemsFoundText: String,

    hideControls: {
      default: false,
      type: Boolean,
    },
  },

  data() {
    return {
      hasCheckedItems: false,
      enteredSearch: '',
      selectedPage: 1,
    }
  },

  computed: {
    checkedIds() {
      const checked = this.items.filter((item) => {
        return item.checked
      })
      return checked.map((item) => {
        return item.id
      })
    },
  },

  watch: {
    search() {
      this.enteredSearch = this.search
    },

    selectedPage() {
      this.$emit('route')
    },

    page() {
      this.selectedPage = this.page
    },

    checkedIds() {
      this.hasCheckedItems = this.checkedIds.length > 0
      this.$emit('check', this.checkedIds)
    },

    hasCheckedItems() {
      if (this.hasCheckedItems === false && this.checkedIds.length > 0) {
        this.items.forEach((item) => {
          item.checked = false
        })
      }
      if (this.hasCheckedItems === true && this.checkedIds.length === 0) {
        this.items.forEach((item) => {
          if (!item.disableCheck) {
            item.checked = true
          }
        })
      }
    },
  },

  methods: {
    startSearch() {
      this.selectedPage = 1
      this.$emit('route')
    },

    clearSearch() {
      this.enteredSearch = ''
      this.startSearch()
    },

    selectItem(id) {
      this.$emit('route', id)
    },

    getCssClass(id, checked) {
      if (this.selectedItem === id) {
        return 'bg-selected-item'
      }
      if (checked) {
        return 'bg-checked-item'
      }
      return ''
    },

    decreasePage() {
      this.selectedPage -= 1
    },
  },
}
</script>

<style scoped>
.search {
  cursor: pointer;
}
</style>
