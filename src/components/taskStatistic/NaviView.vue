<template>
  <div class="mobilink-statistic-list-component fullwidth">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex">
          <v-icon>{{staticRouter.icon}}</v-icon>
          {{title}} <!--({{staticRouter.totalTreeResult}})-->
        </div>
      </template>
      <template slot="toolbar_right">
        <v-btn color="primary" class="btn--active" outline
          @click="publishSelection"
        >
          <v-icon left class="primary--text">volume_up</v-icon>
          {{translate('cong_bo')}}
        </v-btn>
        <v-btn color="primary" class="btn--active" outline
          @click="deleteSelection"
        >
          <v-icon left class="primary--text">cancel</v-icon>
          {{translate('xoa')}}
        </v-btn>
        <v-btn color="primary" :class="{'btn--active' : showAdvanced}" outline
            @click="showAdvanced = !showAdvanced"
          >Bộ lọc
          <v-icon right>{{showAdvanced?'expand_more':'expand_less'}}</v-icon>
        </v-btn>
      </template>
    </jx-mobilink-toolbar>
    <AdvancedSearch :active="showAdvanced"/>
  </div>
</template>

<script>

import AdvancedSearch from './AdvancedSearch'
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
      showAdvanced: false
    }
  },
  components: {
    AdvancedSearch
  },
  computed: {
    staticRouter () {
      if (this.$store.getters.staticRouter.name !== this.staticRouterName) {
        this.staticRouterName = this.$store.getters.staticRouter.name
        this.showAdvanced = false
      }
      return this.$store.getters.staticRouter
    },
    title () {
      return this.translate('thong_ke').toUpperCase() + ' ' + this.translate(this.staticRouter.name).toUpperCase()
    }
  },
  mounted () {
    this.$nextTick(() => {
    })
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
</style>

