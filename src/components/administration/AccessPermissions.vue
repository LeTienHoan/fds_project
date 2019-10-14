<template>
  <div class="mobilink-accessPermission-component fullwidth">
    <v-layout wrap>

      <v-flex sm3 xs3 class="px-2">
        <div class="base-administration-list scrollClass" v-scroll="onScroll">
          <v-list class="scrollChildClass">
            <template v-for="(item, index) in accessPermissionItems"
            >
              <!-- {{item}} -->
              <v-list-tile :key="'v-list-tile'+index" @click="detailPermission(item, index)"
                :class="{'superadmin-active': item.layoutId === permissionSelected.layoutId, 
                  'primary--text': item.layoutId === permissionSelected.layoutId}"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </div>
      </v-flex>
      <v-flex sm9 xs9 class="scrollClass setHeightClass mobilink-accessPermission-component-right">
        <AccessPermissionsDetail
          :isDetail="isDetail"
          ref='accessPermissionDetail'
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import AccessPermissionsDetail from './AccessPermissionsDetail'
  const COMPONENT_NAME = 'mobilink-jobpos'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {AccessPermissionsDetail},
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
        this.runDispatchPermisson()
      }
    },
    data () {
      return {
        isLoading: false,
        btnActionIsLoading: false,
        permissionSelected: '',
        isDetail: false,
        keywords: this.$store.getters.keywords || '',
        pagination: {
          page: 1,
          total: 1
        },
        paginationSize: 20,
        heightFull: 0,
        accessPermissionItems: [],
        paginationLength: 0
      }
    },
    created () {
      this.$nextTick(function () {
        this.runDispatchPermisson()
      })
    },
    methods: {
      onScroll () {
        var vm = this
        if (window.$('.base-administration-list').scrollTop() + window.$('.base-administration-list').height() === vm.heightFull) {
          if (window.$('.base-administration-list').scrollTop() !== 0) {
            vm.pagination.page = vm.pagination.page + 1
            if (vm.paginationLength >= vm.pagination.page) {
              vm.runDispatchPermisson(true)
            }
          }
        }
      },
      runDispatchPermisson (boolscroll) {
        let vm = this
        if (boolscroll === true) {
          window.$('.base-administration-list').animate({
            scrollTop: vm.heightFull - 40
          }, 600)
        }
        setTimeout(function () {
          vm.heightFull = window.$('.base-administration-list .scrollChildClass').height() + 16
        }, 499)
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
        window.axios.get(vm.end_point + 'layoutconfigs',
          config
        )
          .then(function (response) {
            let serializable = response.data
            if (boolscroll === true) {
              vm.accessPermissionItems = vm.accessPermissionItems.concat(response.data)
            } else {
              vm.accessPermissionItems = serializable.data
              if (serializable.data.length > 0) {
                vm.detailPermission(vm.accessPermissionItems[0])
              } else {
                vm.isDetail = false
              }
            }
            vm.paginationLength = Math.ceil(serializable.total / vm.paginationSize)
            vm.detailPermission(vm.accessPermissionItems[0])
          })
          .catch(function (error) {
            console.log(error.response)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      detailPermission (item, index) {
        this.isDetail = true
        window.$('.mobilink-accessPermission-component-right').animate({
          scrollTop: 0
        }, 600)
        this.$refs.accessPermissionDetail.initGetData(item)
        this.permissionSelected = item
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
