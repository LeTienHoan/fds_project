<template>
  <div class="mobilink-holiday-component fullwidth">
    <v-layout wrap>

      <v-flex sm3 xs3 class="px-2">
        <v-btn block color="primary" @click="isDetail = false"
          depressed
        >
          {{holidayAddTitle}}
        </v-btn>
        <!-- <v-list two-line class="base-administration-list">-->
        <div class="base-administration-list scrollClass" v-scroll="onScroll">
          <v-list class="scrollChildClass">
            <template v-for="(item, index) in holidayItems"
            >
              <v-list-tile :key="'v-list-tile'+index" @click="detailHoliday(item)"
                :class="{'superadmin-active': item.holidayDate === holidaySelected.holidayDate, 'primary--text': item.holidayDate === holidaySelected.holidayDate}"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{item.description}}</v-list-tile-title>
                  <div class="list-action">
                    <v-btn icon
                      color="red darken-3"
                      flat
                      @click.stop="deleteHoliday(item)"
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
      <v-flex sm9 xs9 class="scrollClass setHeightClass mobilink-holiday-component-right">
        <HolidayDetail
          :isDetail="isDetail"
          :holiday="holidaySelected"
          @canceladdnew="val => (isDetail = true)"
          @addholidaysuccess="onEditHolidaySuccess"
          @editholidaysuccess="onEditHolidaySuccess"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import HolidayDetail from './HolidayDetail'
  const COMPONENT_NAME = 'mobilink-holiday'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {HolidayDetail},
    computed: {
      staticRouter () {
        return this.$store.getters.staticRouter
      },
      paginationLength () {
        let total = this.$store.getters['holiday/totalHolidayItems']
        return Math.ceil(Number(total || 0) / this.paginationSize)
      }
    },
    watch: {
      '$store.getters.keywords' (val) {
        this.keywords = val
        this.pagination = {
          page: 1
        }
        this.runDispatchHoliday()
      }
    },
    data () {
      return {
        holidayAddTitle: 'Thêm mới ngày nghỉ',
        isLoading: false,
        btnActionIsLoading: false,
        holidaySelected: {},
        isDetail: false,
        keywords: this.$store.getters.keywords || '',
        pagination: {
          page: 1,
          total: 1
        },
        paginationSize: 20,
        heightFull: 0,
        holidayItems: []
      }
    },
    created () {
      this.$nextTick(function () {
        this.runDispatchHoliday()
      })
    },
    methods: {
      onScroll () {
        var vm = this
        if (window.$('.base-administration-list').scrollTop() + window.$('.base-administration-list').height() === vm.heightFull) {
          if (window.$('.base-administration-list').scrollTop() !== 0) {
            vm.pagination.page = vm.pagination.page + 1
            if (vm.paginationLength >= vm.pagination.page) {
              vm.runDispatchHoliday(true)
            }
          }
        }
      },
      runDispatchHoliday (boolscroll) {
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
        this.$store.dispatch('holiday/getHolidayItems', {
          keywords: vm.keywords || '',
          start: start || 0,
          end: end || vm.paginationSize
        }).then(response => {
          vm.isLoading = false
          vm.pagination.total = response.total
          if (boolscroll === true) {
            vm.holidayItems = vm.holidayItems.concat(response.data)
          } else {
            vm.holidayItems = response.data
            if (response.data.length > 0) {
              vm.holidaySelected = response.data[0]
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
      detailHoliday (item) {
        this.isDetail = true
        window.$('.mobilink-holiday-component-right').animate({
          scrollTop: 0
        }, 600)
        this.holidaySelected = item
      },
      deleteHoliday (item) {
        let vm = this
        if (item.holidayDate) {
          this.$dialog.confirm('Bạn có chắc chắn xóa dữ liệu này không?', {
            html: true,
            loader: true,
            okText: 'Xác nhận',
            cancelText: 'Quay lại',
            animation: 'fade'
          })
            .then(function (dialog) {
              vm.btnActionIsLoading = true
              let holidayDate = window.moment(item.holidayDate).format('YYYYMMDD')
              vm.$store.dispatch('loading/setLoading', {
                loading: true,
                message: 'Xóa dữ liệu...'
              })
              vm.$store.dispatch('holiday/deleteHoliday', holidayDate).then(response => {
                vm.btnActionIsLoading = false
                if (vm.holidayItems.length === 0) {
                  vm.isDetail = false
                } else if (holidayDate === window.moment(vm.holidaySelected.holidayDate).format('YYYYMMDD')) {
                  vm.holidaySelected = vm.holidayItems[0]
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
      onEditHolidaySuccess (newHoliday) {
        this.holidaySelected = newHoliday
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
