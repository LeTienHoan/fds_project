<template>
  <Detail v-if="$route.query.id"></Detail>
  <div v-else class="navifilter-view">
    <jx-mobilink-toolbar :keywords="false" :dark="false" color="white" :sideicon="false" class="fullwidth">
      <!-- <template slot="toolbar_title">
        <div class="align-center d-flex">
          <v-icon>{{staticRouter.icon}}</v-icon>
          {{title}} ({{staticRouter.totalTreeResult}})
        </div>
      </template>-->
      <template slot="toolbar_right">
        <!--<AdvancedSearchWrap :active="showAdvanced"
          ref="advancedSearchWrap"
          @advancedSearchChange="advancedSearchChange"
          :initValue="initAdvancedSearchValue"
        />-->
        <AdvancedSearchWrap :active="showAdvanced"
          :apiKey="{
            preferenceKey: 'FILTERDOCFILE',
            advancedsearchDictKey: 'dictionarydocfile',
            advancedsearchDefaultFilterKey: 'filterdocfile'
          }"
        />
      </template>
    </jx-mobilink-toolbar>
    <ListDocFileOtherType
      :active="true"
      v-if="docFileOtherType"
    ></ListDocFileOtherType>
    <ListDocFile
      :active="true"
      v-else
    ></ListDocFile>
  </div>
</template>

<script>

import ListDocFile from './ListDocFile'
import Detail from './Detail'
import ListDocFileOtherType from './ListDocFileOtherType'
// import AdvancedSearchWrap from './AdvancedSearchWrap'
import AdvancedSearchWrap from '@/components/task_comp/AdvancedSearchWrap'

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
    ListDocFile, ListDocFileOtherType, AdvancedSearchWrap, Detail
  },
  mounted () {
    this.$nextTick(() => {
      this.showAdvanced = true
    })
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

