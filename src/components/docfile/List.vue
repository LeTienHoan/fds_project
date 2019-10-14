<template>
  <!-- Main content -->
  <v-app id="inspire">
    <div class="listcontainer">
      <div class="fullwidth" >
        <LayoutResize
          :leftWidth="20"
          :leftMinWidth="17"
          :leftMaxWidth="50"
          @resized="val => (drawerWidth = val.left)"
        >
          <template slot="left">
            <div class="task-category" v-if="drawer">
              <NaviFilter :drawerWidth="drawerWidth" style="margin-right: -1px;"/>
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
    </div>
  </v-app>
  <!-- /.content -->

</template>

<script>

import NaviFilter from './NaviFilter'
import LayoutResize from '@/components/task/LayoutResize'

export default {
  data () {
    return {
      drawerWidth: 410,
      drawer: true
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
  }
}
</script>

<style lang="css">
.listcontainer {
  display: flex
}
.task-content {
  overflow: auto;
  width: 100%;
}
</style>
