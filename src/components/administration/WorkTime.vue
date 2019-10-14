<template>
  <div class="mobilink-worktime-component layout">
    <v-layout wrap>

      <v-flex sm3 class="px-2">
        <v-btn block color="primary" @click="isDetail = false"
          depressed
        >
          {{workTimeAddTitle}}
        </v-btn>
        <!--<v-list two-line class="base-administration-list">-->
        <div class="base-administration-list scrollClass" v-scroll="onScroll">
          <v-list class="scrollChildClass">
            <template v-for="(item, index) in workTimeItems"
               v-if="item.day < daysOfWeek.length"
            >
              <v-list-tile :key="'v-list-tile'+index" @click="detailWorkTime(item)"
                :class="{'superadmin-active': item.day === worktimeSelected.day, 'primary--text': item.day === worktimeSelected.day}"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{daysOfWeek[Number(item.day)].text}}</v-list-tile-title>
                  <div class="list-action">
                    <v-btn icon
                      color="red darken-3"
                      flat
                      @click.stop="deleteWorkTime(item)"
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
      <v-flex sm9 class="scrollClass setHeightClass mobilink-worktime-component-right">
        <WorkTimeDetail
          :isDetail="isDetail"
          :workTime="worktimeSelected"
          :daysOfWeek="daysOfWeek"
          @canceladdnew="val => (isDetail = true)"
          @addworktimesuccess="onEditWorkTimeSuccess"
          @editworktimesuccess="onEditWorkTimeSuccess"
        />

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import WorkTimeDetail from './WorkTimeDetail'
  const COMPONENT_NAME = 'mobilink-worktime'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {WorkTimeDetail},
    computed: {
      staticRouter () {
        return this.$store.getters.staticRouter
      },
      paginationLength () {
        let total = this.$store.getters['workTime/totalWorkTimeItems']
        return Math.ceil(Number(total || 0) / this.paginationSize)
      }
    },
    watch: {
      '$store.getters.keywords' (val) {
        this.keywords = val
        this.pagination = {
          page: 1,
          length: 0
        }
        this.runDispatchWorkTime()
      }
    },
    data () {
      return {
        workTimeAddTitle: 'Thêm mới ngày làm việc',
        isLoading: false,
        btnActionIsLoading: false,
        worktimeSelected: {},
        isDetail: false,
        keywords: this.$store.getters.keywords || '',
        daysOfWeek: [
          { text: this.translate('chu_nhat'), value: 0 },
          { text: this.translate('thu_hai'), value: 1 },
          { text: this.translate('thu_ba'), value: 2 },
          { text: this.translate('thu_tu'), value: 3 },
          { text: this.translate('thu_nam'), value: 4 },
          { text: this.translate('thu_sau'), value: 5 },
          { text: this.translate('thu_bay'), value: 6 }
        ],
        rules: {
          required: value => !!value || 'Required.',
          counter: value => value.length <= 20 || 'Max 20 characters',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        },
        pagination: {
          page: 1
        },
        paginationSize: 20,
        heightFull: 0,
        workTimeItems: []
      }
    },
    created () {
      this.$nextTick(function () {
        this.runDispatchWorkTime()
      })
    },
    methods: {
      onScroll () {
        var vm = this
        if (window.$('.base-administration-list').scrollTop() + window.$('.base-administration-list').height() === vm.heightFull) {
          if (window.$('.base-administration-list').scrollTop() !== 0) {
            vm.pagination.page = vm.pagination.page + 1
            if (vm.paginationLength >= vm.pagination.page) {
              vm.runDispatchWorkTime(true)
            }
          }
        }
      },
      runDispatchWorkTime (boolscroll) {
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
        this.$store.dispatch('workTime/getWorkTimeItems', {
          keywords: vm.keywords || '',
          start: start || 0,
          end: end || vm.paginationSize
        }).then(response => {
          vm.isLoading = false
          if (boolscroll === true) {
            vm.workTimeItems = vm.workTimeItems.concat(response.data)
          } else {
            vm.workTimeItems = response.data
            if (response.data.length > 0) {
              vm.worktimeSelected = response.data[0]
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
      detailWorkTime (item) {
        this.worktimeSelected = item
        window.$('.mobilink-worktime-component-right').animate({
          scrollTop: 0
        }, 600)
        this.isDetail = true
      },
      deleteWorkTime (item) {
        let vm = this
        console.log(item.day)
        if (item.day >= 0) {
          this.$dialog.confirm('Bạn có chắc chắn xóa dữ liệu này không?', {
            html: true,
            loader: true,
            okText: 'Xác nhận',
            cancelText: 'Quay lại',
            animation: 'fade'
          })
            .then(function (dialog) {
              vm.btnActionIsLoading = true
              vm.$store.dispatch('loading/setLoading', {
                loading: true,
                message: 'Xóa dữ liệu...'
              })
              vm.$store.dispatch('workTime/deleteWorkTime', item.day).then(response => {
                vm.btnActionIsLoading = false
                if (vm.workTimeItems.length === 0) {
                  vm.isDetail = false
                } else if (item.day === vm.worktimeSelected.day) {
                  vm.worktimeSelected = vm.workTimeItems[0]
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
      onEditWorkTimeSuccess (newWorkTime) {
        this.worktimeSelected = newWorkTime
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
