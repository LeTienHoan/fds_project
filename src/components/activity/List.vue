<template>
  <!-- Main content -->
  <v-app id="inspire">
    <div class="listcontainer calendar-wrap">
      <div class="task-category" v-if="drawer">
          <NaviFilter/>
      </div>
      <div class="calendar-content-wrap layout wrap">
        <main class="flex xs12">
          <section class="content">
            <router-view></router-view>
          </section>
        </main>
      </div>
    </div>
  </v-app>
  <!-- /.content -->

</template>

<script>

import NaviFilter from './NaviFilter'

export default {
  data () {
    return {
      titleName: 'Hoat dong',
      drawer: true,
      drawerWidth: '300'
    }
  },
  components: {
    NaviFilter
  },
  computed: {
    title () {
      return this.titleName
    }
  },
  mounted () {
    this.$nextTick(() => {
    })
  }
}
</script>
<style lang="scss">

.listcontainer {
  display: flex;
}

div.inlineaaaa {
  float:left;
}

</style>