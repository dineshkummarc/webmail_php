<template>
  <div v-if="filterOptions.length > 0">
    <q-select outlined dense class="bg-white" v-model="currentFilter" :options="filterOptions">
      <template v-slot:selected>
        <div class="ellipsis" style="max-width: 250px;">{{ currentFilter.label }}</div>
      </template>
      <template v-slot:option="scope">
        <q-item v-close-popup v-bind="scope.itemProps" v-on="scope.itemEvents">
          <q-item-section class="non-selectable">
            <q-item-label>
              <span>{{ scope.opt.label }}</span>
              <IconTeamGroup class="on-right vertical-bottom" :size="18" v-if="scope.opt.isTeam" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
import typesUtils from 'src/utils/types'
import settings from 'src/settings'

import IconTeamGroup from 'assets/icons/TeamGroup'

export default {
  name: 'GroupFilterForUsers',

  filterRoute: 'group/:group',

  data () {
    return {
      allowGroups: settings.getAllowGroups(),
      filterOptions: [],
      filterValue: null,
      currentFilter: null,
    }
  },

  components: {
    IconTeamGroup,
  },

  computed: {
    currentTenantId () {
      return this.$store.getters['tenants/getCurrentTenantId']
    },

    visible () {
      return this.filterOptions.length > 0
    },

    allGroupLists () {
      return this.$store.getters['groups/getGroups']
    },

    groups () {
      return typesUtils.pArray(this.allGroupLists[this.currentTenantId])
    }
  },

  watch: {
    $route (to, from) {
      this.fillUpFilterValue()
      this.currentFilter = this.findCurrentFilter()
    },

    filterOptions () {
      this.fillUpFilterValue()
      this.currentFilter = this.findCurrentFilter()
    },

    currentTenantId () {
      this.requestGroups()
    },

    currentFilter (option) {
      this.selectFilter(option.value)
    },

    groups () {
      this.fillUpFilterOptions()
    }
  },

  mounted () {
    this.fillUpFilterOptions()
    this.requestGroups()
  },

  methods: {
    requestGroups () {
      if (this.allowGroups) {
        this.$store.dispatch('groups/requestGroups', {
          tenantId: this.currentTenantId
        })
      }
    },

    fillUpFilterOptions () {
      const options = this.groups.map(group => {
        return {
          label: group.name,
          value: group.id,
          isTeam: group.isTeam,
        }
      })
      if (options.length > 0) {
        options.unshift({
          label: this.$t('ADMINPANELWEBCLIENT.LABEL_ALL_GROUPS'),
          value: -1,
          isTeam: false,
        })
        options.push({
          label: this.$t('ADMINPANELWEBCLIENT.LABEL_NOT_IN_ANY_GROUP'),
          value: 0,
          isTeam: false,
        })
      }
      this.filterOptions = options
      this.currentFilter = this.findCurrentFilter()
    },

    findCurrentFilter () {
      if (this.filterOptions.length) {
        const option = this.filterOptions.find(filter => filter.value === this.filterValue)
        return option || this.filterOptions[0]
      }
      return ''
    },

    fillUpFilterValue () {
      this.filterValue = typesUtils.pInt(this.$route?.params?.group, -1)
      this.$emit('filter-filled-up', {
        GroupId: this.filterValue
      })
    },

    selectFilter (value) {
      if (value === -1) {
        this.$emit('filter-selected', {
          routeName: 'group',
        })
      } else {
        this.$emit('filter-selected', {
          routeName: 'group',
          routeValue: value,
        })
      }
    },
  },
}
</script>

<style scoped>
</style>
