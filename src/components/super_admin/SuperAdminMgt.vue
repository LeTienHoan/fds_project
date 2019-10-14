<template>

<div class="super-admin-mgt-component">
  <v-fade-transition>
    <v-app>
      <jx-mobilink-toolbar
        :spacer="false"
        :dark="false" color="white" 
        :sideicon="false" class="fullwidth"
      >
        <template slot="toolbar_title">
          <div class="align-center d-flex">
            <v-btn href="trang-chu" icon><v-icon>home</v-icon></v-btn>
            <span :style="'width: ' + (drawerWidth - 50) +'px;'"
              v-text="'Quản trị dữ liệu'"
            >
            </span>
          </div>
        </template>
        <template slot="toolbar_right">
          <v-text-field
            v-model="keywordsModel"
            append-icon="search"
            :placeholder="translate('nhap_tu_khoa_tim_kiem')"
            :append-icon-cb="($event) => (keywordsChange($event))"
            v-on:keyup.enter="keywordsChange"
            @change="keywordsChange"
          ></v-text-field>
          <v-btn color="primary" class=""
            v-if="false"
            :disabled="false" :loading="false"
          >
            <v-icon>settings</v-icon>
            Cấu hình trang
          </v-btn>
        </template>
      </jx-mobilink-toolbar>
      <div class="fullwidth" >
        <LayoutResize
          :leftWidth="18"
          :leftMinWidth="15"
          :leftMaxWidth="50"
          @resized="val => (drawerWidth = val.left)"
        >
          <template slot="left">
            <div class="task-category scrollChildClass" v-if="drawerWidth">
              <NaviFilter :drawerWidth="drawerWidth"/>
            </div>
          </template>
          <template slot="right">
            <div class="task-content">
              <main>
                <section class="content">
                  <router-view></router-view>
                </section>
              </main>
            </div>
          </template>
        </LayoutResize>
      </div>
    </v-app>
  </v-fade-transition>
</div>

</template>

<script>
import LayoutResize from './LayoutResize'
import NaviFilter from './NaviFilter'

const COMPONENT_NAME = 'mobilink-admin-mgt'
export default {
  name: COMPONENT_NAME,
  components: {
    LayoutResize,
    NaviFilter
  },
  props: {
    id: {
      default: 1
    }
  },
  data () {
    return {
      drawerWidth: 260,
      keywordsModel: ''
    }
  },
  created () {
  },
  methods: {
    keywordsChange (jsEvent) {
      this.$store.dispatch('setKeywords', this.keywordsModel)
    }
  }
}
</script>
<style lang="scss">
  .base-administration-list {
    .list__tile__content {
      .list__tile__title {
        font-size: 13px;
      }
      .list-action {
        position: absolute;
        right: 0;
      }
    }
    .divider {
      margin: 0;
    }
  }
/*  body .task-category {
    margin: 0!important;
  }*/
</style>

