<template>
  <div class="mobilink-state-component fullwidth">
    <v-layout wrap>

      <v-flex sm3 xs3 class="px-2">
        <div class="base-administration-list scrollClass">
          <v-list class="scrollChildClass">
            <template v-for="(item, index) in stateTransitionItems"
            >
              <!-- {{item}} -->
              <v-list-tile :key="'v-list-tile'+index" @click="detailState(item, index)"
                :class="{'superadmin-active': item.stateTransitionId === stateSelected.stateTransitionId, 
                  'primary--text': item.stateTransitionId === stateSelected.stateTransitionId}"
              >
                <v-list-tile-content>
                  <v-list-tile-title><b>{{ item.className }}</b></v-list-tile-title>
                  <v-list-tile-title>{{ item.subclass }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </div>
      </v-flex>
      <v-flex sm9 xs9 class="scrollClass setHeightClass mobilink-state-component-right">
        <StateDetail
          :isDetail="isDetail"
          ref='stateDetail'
          @editConfig="onEditConfigSuccess"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import StateDetail from './StateDetail'
  const COMPONENT_NAME = 'mobilink-jobpos'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {StateDetail},
    computed: {
      staticRouter () {
        return this.$store.getters.staticRouter
      }
    },
    watch: {
      '$store.getters.keywords' (val) {
        this.keywords = val
        this.pagination = {
          page: 1
        }
        this.runDispatchState()
      }
    },
    data () {
      return {
        isLoading: false,
        btnActionIsLoading: false,
        stateSelected: '',
        isDetail: false,
        keywords: this.$store.getters.keywords || '',
        pagination: {
          page: 1
        },
        paginationSize: 5,
        stateTransitionItems: []
      }
    },
    created () {
      this.$nextTick(function () {
        this.runDispatchState()
      })
    },
    methods: {
      runDispatchState () {
        let vm = this
        let params = {
          start: -1,
          end: -1,
          keywords: vm.keywords ? vm.keywords : ''
        }
        const config = {
          params: params,
          headers: {
            'groupId': vm.group_id
          }
        }
        window.axios.get(vm.end_point + 'statetransitions/group',
          config
        )
          .then(function (response) {
            let serializable = response.data
            vm.stateTransitionItems = serializable.data
            vm.detailState(vm.stateTransitionItems[0])
          })
          .catch(function (error) {
            console.log(error.response)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      detailState (item, index) {
        this.isDetail = true
        this.$refs.stateDetail.initGetData(item)
        this.stateSelected = item
      },
      onEditConfigSuccess (val) {
        this.runDispatchState()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .base-administration-list {
    height: calc(100vh - 178px);
    overflow: auto;
  }
</style>
