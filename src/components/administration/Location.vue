<template>
  <div class="mobilink-location-component fullwidth">
    <v-layout wrap>

      <v-flex sm3 xs3 class="px-2">
        <v-btn block color="primary" @click="isDetail = false"
          depressed
        >
          {{locationAddTitle}}
        </v-btn>
        <div class="base-administration-list scrollClass" v-scroll="onScroll">
          <v-list class="scrollChildClass">
            <template v-for="(item, index) in locationItems"
            >
              <v-list-tile :key="'v-list-tile'+index" @click="detailLocation(item)"
                :class="{'superadmin-active': item.locationId === locationSelected.locationId, 'primary--text': item.locationId === locationSelected.locationId}"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{item.location}}</v-list-tile-title>
                  <div class="list-action">
                    <v-btn icon
                      color="red darken-3"
                      flat
                      @click.stop="deleteLocation(item)"
                      :disabled="btnActionIsLoading"
                      :loading="btnActionIsLoading"
                    >
                      <v-icon>clear</v-icon>
                    </v-btn>
                  </div>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </div>
      </v-flex>
      <v-flex sm9 xs9 class="scrollClass setHeightClass mobilink-location-component-right">
        <LocationDetail
          :isDetail="isDetail"
          :location="locationSelected"
          @canceladdnew="val => (isDetail = true)"
          @addlocationsuccess="onEditLocationSuccess"
          @editlocationsuccess="onEditLocationSuccess"
        />

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import LocationDetail from './LocationDetail'
  const COMPONENT_NAME = 'mobilink-location'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {LocationDetail},
    computed: {
      staticRouter () {
        return this.$store.getters.staticRouter
      },
      paginationLength () {
        let total = this.$store.getters['location/totalLocationItems']
        return Math.ceil(Number(total || 0) / this.paginationSize)
      }
    },
    watch: {
      '$store.getters.keywords' (val) {
        this.keywords = val
        this.pagination = {
          page: 1
        }
        this.runDispatchLocation()
      }
    },
    data () {
      return {
        locationAddTitle: 'Thêm mới địa điểm',
        isLoading: false,
        btnActionIsLoading: false,
        locationSelected: {},
        isDetail: false,
        keywords: this.$store.getters.keywords || '',
        pagination: {
          page: 1,
          total: 1
        },
        paginationSize: 20,
        heightFull: 0,
        locationItems: []
      }
    },
    created () {
      this.$nextTick(function () {
        this.runDispatchLocation()
      })
    },
    methods: {
      onScroll () {
        var vm = this
        if (window.$('.base-administration-list').scrollTop() + window.$('.base-administration-list').height() === vm.heightFull) {
          if (window.$('.base-administration-list').scrollTop() !== 0) {
            vm.pagination.page = vm.pagination.page + 1
            if (vm.paginationLength >= vm.pagination.page) {
              vm.runDispatchLocation(true)
            }
          }
        }
      },
      runDispatchLocation (boolscroll) {
        let vm = this
        if (boolscroll === true) {
          window.$('.base-administration-list').animate({
            scrollTop: vm.heightFull - 40
          }, 600)
        }
        setTimeout(function () {
          vm.heightFull = window.$('.base-administration-list .scrollChildClass').height() + 16
        }, 499)
        const start = this.pagination.page * this.paginationSize - this.paginationSize
        const end = this.pagination.page * this.paginationSize
        this.$store.dispatch('location/getLocationItems', {
          keywords: vm.keywords || '',
          start: start || 0,
          end: end || vm.paginationSize
        }).then(response => {
          vm.isLoading = false
          vm.pagination.total = response.total
          if (boolscroll === true) {
            vm.locationItems = vm.locationItems.concat(response.data)
          } else {
            vm.locationItems = response.data
            if (response.data.length > 0) {
              vm.locationSelected = response.data[0]
              vm.isDetail = true
            } else {
              vm.isDetail = false
            }
          }
        }, error => {
          console.log(error)
          vm.isLoading = false
        })
      },
      detailLocation (item) {
        this.isDetail = true
        window.$('.mobilink-location-component-right').animate({
          scrollTop: 0
        }, 600)
        this.locationSelected = item
      },
      deleteLocation (item) {
        let vm = this
        if (item.locationId) {
          this.$dialog.confirm('Bạn có chắc chắn xóa dữ liệu này không?', {
            html: true,
            loader: true,
            okText: 'Xác nhận',
            cancelText: 'Quay lại',
            animation: 'fade'
          })
            .then(function (dialog) {
              vm.btnActionIsLoading = true
              let locationId = item.locationId
              vm.$store.dispatch('loading/setLoading', {
                loading: true,
                message: 'Xóa dữ liệu...'
              })
              vm.$store.dispatch('location/deleteLocation', locationId).then(response => {
                vm.btnActionIsLoading = false
                if (vm.locationItems.length === 0) {
                  vm.isDetail = false
                } else if (locationId === vm.locationSelected.locationId) {
                  vm.locationSelected = vm.locationItems[0]
                }
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageToastr('success', 'Xóa dữ liệu thành công')
              }, error => {
                console.log(error)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageByAPICode(error.response.status, error.response.data)
                vm.btnActionIsLoading = false
              })
              dialog.close()
              return false
            })
            .catch(function (e) {
              console.log(e)
            })
        }
      },
      onEditLocationSuccess (newLocation) {
        this.locationSelected = newLocation
        this.isDetail = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .base-administration-list {
    height: calc(100vh - 226px);
    overflow: auto;
  }
</style>
