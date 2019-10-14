<template>
  <!-- Main content -->
  <v-app id="inspire">
    <div class="listcontainer">
      <div class="task-category" v-if="drawer">
          <NaviFilter/>
      </div>
      <div class="task-content">
        <main>
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
      drawer: true
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

<style lang="css">
.listcontainer {
  display: flex
}
.task-content {
  overflow: auto;
  width: 100%;
}
</style>
<style lang="scss">
  .base-administration-list {
    .list__tile__content {
      .list__tile__title {
        font-size: 13px;
      }
      .list-action {
        position: absolute;
        right: 0;
        button {
          width: auto;
          height: auto;
          margin: 0;
        }
      }
    }
    .divider {
      margin: 0;
    }
  }
</style>
