<template>
  <div class="mobilink-config-component fullwidth">
    <v-layout wrap>

      <v-flex sm3 xs3 class="px-2">
        <div class="base-administration-list scrollClass">
          <v-list class="scrollChildClass">
            <template v-for="(item, index) in configItems.configuration"
            >
              <!-- {{item}} -->
              <v-list-tile :key="'v-list-tile'+index" @click="detailConfig(item, index)"
                :class="{'superadmin-active': index === configSelected, 
                  'primary--text': index === configSelected}"
              >
                <v-list-tile-content>
                  <v-list-tile-title style="text-transform: uppercase;">{{ index }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </div>
      </v-flex>
      <v-flex sm9 xs9 class="scrollClass setHeightClass mobilink-config-component-right">
        <ConfigurationDetail
          :isDetail="isDetail"
          ref='configDetail'
          @editConfig="onEditConfigSuccess"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import ConfigurationDetail from './ConfigurationDetail'
  const COMPONENT_NAME = 'mobilink-jobpos'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {ConfigurationDetail},
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
        this.runDispatchUser()
      }
    },
    data () {
      return {
        isLoading: false,
        btnActionIsLoading: false,
        configSelected: '',
        isDetail: false,
        keywords: this.$store.getters.keywords || '',
        pagination: {
          page: 1
        },
        paginationSize: 5,
        configItems: []
      }
    },
    created () {
      this.$nextTick(function () {
        this.runDispatchUser()
      })
    },
    methods: {
      changePageSize () {
        this.pagination = {
          page: 1
        }
        this.runDispatchUser()
      },
      runDispatchUser () {
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
        window.axios.get(vm.end_point + 'systemconfigs',
          config
        )
          .then(function (response) {
            vm.configItems = response.data
            vm.detailConfig(response.data.configuration[Object.keys(response.data.configuration)[0]], Object.keys(response.data.configuration)[0])
          })
          .catch(function (error) {
            console.log(error.response)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      detailConfig (item, index) {
        this.isDetail = true
        this.$refs.configDetail.initGetData(item, index)
        this.configSelected = index
      },
      onEditConfigSuccess (val, index) {
        this.detailConfig(val[index], index)
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
