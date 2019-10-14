<template>

  <v-app style="overflow: hidden;" id="newsboard-main">
    <v-scale-transition>
      <MoveLayout id="newsboard-layout"
        :laylouts="{
          cssLeft_width: 50,
          cssLeft_min_width: 30,
          center_width: 60
        }"
        @resized="resized"
      >
        <template slot="left">
          <div class="mobilink-category">
            <NaviFilter :drawerWidth="drawerWidth"
              style="margin-right: -1px;"/>
          </div>
        </template>
        <template slot="center">
          <div class="mobilink-content">
            <ListNewsBoardType :width="centerWidth" :changeNewsboard="changeNewsboard"
            />
          </div>
        </template>
        <template slot="right">
          <div class="mobilink-content">
            <Detail :width="rightWidth"
              @change-detail-newsboard="(val) => (changeNewsboard = val)"
              :propnewsBoardId="propnewsBoardId"
            />
          </div>
        </template>
      </MoveLayout>
    </v-scale-transition>
  </v-app>

</template>

<script>
import MoveLayout from '@/components/task_comp/MoveLayout'
import NaviFilter from './NaviFilter'
import ListNewsBoardType from './ListNewsBoardType'
import Detail from './Detail'

const COMPONENT_NAME = 'mobilink-folder-mgt'
export default {
  name: COMPONENT_NAME,
  components: {
    MoveLayout,
    NaviFilter,
    ListNewsBoardType,
    Detail
  },
  props: {
    id: {
      default: 1
    }
  },
  data () {
    return {
      drawerWidth: 900,
      rightWidth: 0,
      centerWidth: 0,
      changeNewsboard: '',
      propnewsBoardId: 0
    }
  },
  created () {
  },
  methods: {
    resized (layoutSize) {
      this.drawerWidth = layoutSize.left
      this.rightWidth = layoutSize.right
      this.centerWidth = layoutSize.center
    }
  }
}
</script>
<style lang="scss">
#newsboard-main #m-move-m-layout-m-wrapernewsboard-layout #smallLeft {
  background: transparent;
}
</style>

