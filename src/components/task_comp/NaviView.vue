<template>
<keep-alive>
  <div class="navifilter-view" v-if="componentActive">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div v-if="false" class="align-center d-flex">
          <v-icon>{{staticRouter.icon}}</v-icon>
          {{title}} <!--({{staticRouter.totalTreeResult}})-->
        </div>
      </template>
      <template slot="toolbar_right">
        <AdvancedSearchWrap :active="showAdvanced"
          :apiKey="{
            preferenceKey: 'FILTERTASK',
            advancedsearchDictKey: 'dictionarytask',
            advancedsearchDefaultFilterKey: 'filtertask'
          }"
        />
        <v-btn-toggle v-model="staticRouter.view" mandatory
          v-if="staticRouter.viewTypes && staticRouter.viewTypes.length > 1"
        >
          <v-btn v-for="(item, index) in staticRouter.viewTypes" :key="index"
            flat color="primary" :value="item.value"
          >
            <v-icon>{{item.icon}}</v-icon>
          </v-btn>
        </v-btn-toggle>
        <v-btn color="primary" class="btn--active" outline
          @click="publishSelection" v-if="staticRouter.selectionType === true"
        >
          <v-icon left class="primary--text">volume_up</v-icon>
          {{translate('cong_bo')}}
        </v-btn>
        <v-btn color="primary" class="btn--active" outline
          @click="deleteSelection" v-if="staticRouter.selectionType === true"
        >
          <v-icon left class="primary--text">cancel</v-icon>
          {{translate('xoa')}}
        </v-btn>
      </template>
    </jx-mobilink-toolbar>
    <keep-alive>
      <TreeGrid v-if="staticRouter.view === 'TreeGrid'"
        :active="staticRouter.view === 'TreeGrid'"
        :columnType="staticRouter.name"
      ></TreeGrid>
      <Kanban v-if="staticRouter.view === 'Kanban'"
        :active="staticRouter.view === 'Kanban'"
      ></Kanban>
    </keep-alive>
  </div>
</keep-alive>
</template>

<script>

import Kanban from './Kanban'
import TreeGrid from './TreeGrid'
import AdvancedSearchWrap from './AdvancedSearchWrap'
import { EventBus } from '@/eventbus'

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
      componentActive: false
    }
  },
  components: {
    Kanban, TreeGrid, AdvancedSearchWrap
  },
  computed: {
    staticRouter () {
      if (this.$store.getters.staticRouter.name !== this.staticRouterName) {
        this.staticRouterName = this.$store.getters.staticRouter.name
      }
      return this.$store.getters.staticRouter
    },
    title () {
      return this.translate(this.staticRouter.name)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.showAdvanced = true
      this.componentActive = true
    })
  },
  destroyed () {
    this.componentActive = false
    // delete this.name
    // delete this.showAdvanced
    // delete this.staticRouter
    // delete this.title
    // delete this.changeView
    // delete this.publishSelection
    // delete this.deleteSelection
  },
  methods: {
    // deprecated
    changeView (view) {
      let router = this.staticRouter
      this.$store.dispatch('setStaticRouter', router)
    },
    publishSelection () {
      let vm = this
      vm.$dialog.confirm('Bạn có chắc chắn muốn thực hiện hành động này không?', {
        html: true,
        loader: true,
        okText: 'Xác nhận',
        cancelText: 'Quay lại',
        animation: 'fade'
      })
        .then(function (dialog) {
          EventBus.$emit('publish_selection_activity', true)
          dialog.close()
          return false
        })
        .catch(function (e) {
          console.log(e)
        })
    },
    deleteSelection () {
      let vm = this
      vm.$dialog.confirm('Bạn có chắc chắn muốn thực hiện hành động này không?', {
        html: true,
        loader: true,
        okText: 'Xác nhận',
        cancelText: 'Quay lại',
        animation: 'fade'
      })
        .then(function (dialog) {
          EventBus.$emit('delete_selection_activity', true)
          dialog.close()
          return false
        })
        .catch(function (e) {
          console.log(e)
        })
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

