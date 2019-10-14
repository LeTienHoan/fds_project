<template>
  <div class="navifilter-view">
    <jx-mobilink-toolbar :keywords="false" :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex">
          <v-icon>{{staticRouter.icon}}</v-icon>
          {{title}}
        </div>
      </template>
      <template slot="toolbar_right">
        <AdvancedSearchWrap :active="showAdvanced"
          ref="advancedSearchWrap"
          @advancedSearchChange="advancedSearchChange"
          :initValue="initAdvancedSearchValue"
        />
      </template>
    </jx-mobilink-toolbar>
    <ListNewsBoardType></ListNewsBoardType>
  </div>
</template>

<script>
import AdvancedSearchWrap from './AdvancedSearchWrap'
import ListNewsBoardType from './ListNewsBoardType'

export default {
  props: {
    name: {
      type: String,
      default: 'list'
    }
  },
  data () {
    return {
      showAdvanced: false,
      initAdvancedSearchValue: {}
    }
  },
  components: {
    AdvancedSearchWrap,
    ListNewsBoardType
  },
  computed: {
    staticRouter () {
      if (this.$store.getters.staticRouter.name !== this.staticRouterName) {
        this.staticRouterName = this.$store.getters.staticRouter.name
        this.initAdvancedSearch()
      }
      return this.$store.getters.staticRouter
    },
    title () {
      return this.translate(this.staticRouter.name)
    }
  },
  watch: {
    '$store.getters.otherQuery.workspace' (val) {
      this.initAdvancedSearch()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initAdvancedSearch()
    })
  },
  methods: {
    advancedSearchChange (payload) {
      this.$store.dispatch('setOtherQuery', payload)
    },
    initAdvancedSearch () {
      const otherQuery = this.$store.getters.otherQuery
      let initAdvancedSearchValue = {}
      if (otherQuery.keywords) {
        initAdvancedSearchValue = {
          keywords: otherQuery.keywords
        }
      }
      const advancedSearchs = this.$store.getters.otherQuery.advancedSearch
      for (let key in advancedSearchs) {
        initAdvancedSearchValue[key] = advancedSearchs[key]
      }
      this.initAdvancedSearchValue = initAdvancedSearchValue
      this.showAdvanced = true
    }
  }
}
</script>

<style scoped>
.navifilter-view {
  width: 100%;
}
.navifilter-view > nav {
  position: relative;
  z-index: 1;
}
</style>
