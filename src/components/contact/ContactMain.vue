<template>
  <v-app id="inspire" class="calendar-wrapper">
    <LayoutResize ref="refLayoutResize"
      :leftWidth="layoutResize.leftWidth"
      :leftMinWidth="layoutResize.leftMinWidth"
      :leftMaxWidth="layoutResize.leftMaxWidth"
      @resized="val => (drawerWidth = val.left)"
      class="fullwidth"
    >
      <template slot="left">
        <div class="mobilink-category">
          <NaviFilter :drawerWidth="drawerWidth" style="margin-right: -1px;"/>
        </div>
      </template>
      <template slot="right">
        <div class="mobilink-content">
          <main>
            <section class="content">
              <v-slide-y-transition>
                <router-view @toggleFilter="toggleFilter"></router-view>
              </v-slide-y-transition>
            </section>
          </main>
        </div>
      </template>
    </LayoutResize>
    <div class="filter-btn-ctrl">
      <v-btn @click="toggleFilter" icon flat outline color="primary">
        <v-icon>{{ showFilter ? 'chevron_left' : 'chevron_right' }}</v-icon>
      </v-btn>
    </div>
  </v-app>

</template>

<script>

import NaviFilter from './NaviFilter'
import LayoutResize from '@/components/task/LayoutResize'

export default {
  data () {
    return {
      drawerWidth: 410,
      showFilter: true,
      layoutResizeTemp: {
        leftWidth: 20,
        leftMinWidth: 17,
        leftMaxWidth: 50
      },
      layoutResize: {
        leftWidth: 20,
        leftMinWidth: 17,
        leftMaxWidth: 50
      }
    }
  },
  components: {
    NaviFilter, LayoutResize
  },
  computed: {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    toggleFilter () {
      this.layoutResize = this.showFilter
        ? {
          leftWidth: 0,
          leftMinWidth: 0,
          leftMaxWidth: 0
        }
        : this.layoutResizeTemp
      this.showFilter = !this.showFilter
    }
  }
}
</script>

<style lang="scss">
  .filter-btn-ctrl {
    position: fixed;
    bottom: 200px;
    right: 0px;
    margin-right: -23px;
    &:hover {
      margin-right: -8px;
    }
  }
</style>

