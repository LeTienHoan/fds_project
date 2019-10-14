<template>
  <div class="mobilink-jobpos-component fullwidth">
    <v-layout wrap>

      <v-flex sm3 xs3 class="px-2">
        <v-btn block color="primary" @click="isDetail = false"
          depressed
        >
          {{jobposAddTitle}}
        </v-btn>
        <div class="base-administration-list scrollClass" v-scroll="onScroll">
          <v-list class="scrollChildClass">
            <template v-for="(item, index) in jobposItems"
            >
              <v-list-tile :key="'v-list-tile'+index" @click="detailJobpos(item)"
                :class="{'superadmin-active': String(item.jobPosId) === String(jobposSelected.jobPosId), 
                  'primary--text': String(item.jobPosId) === String(jobposSelected.jobPosId)}"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{item.title}}</v-list-tile-title>
                  <div class="list-action">
                    <v-btn icon
                      color="red darken-3"
                      flat
                      @click.stop="deleteJobpos(item)"
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
      <v-flex sm9 xs9 class="scrollClass setHeightClass mobilink-jobpos-component-right">
        <JobposDetail
          :isDetail="isDetail"
          :jobpos="jobposSelected"
          @canceladdnew="val => (isDetail = true)"
          @addJobpossuccess="onEditJobposSuccess"
          @editJobpossuccess="onEditJobposSuccess"
        />

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import JobposDetail from './JobposDetail'
  const COMPONENT_NAME = 'mobilink-jobpos'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {JobposDetail},
    computed: {
      staticRouter () {
        return this.$store.getters.staticRouter
      },
      paginationLength () {
        let total = this.$store.getters['jobpos/totalJobposItems']
        return Math.ceil(Number(total || 0) / this.paginationSize)
      }
    },
    watch: {
      '$store.getters.keywords' (val) {
        this.keywords = val
        this.pagination = {
          page: 1
        }
        this.runDispatchJobpos()
      }
    },
    data () {
      return {
        jobposAddTitle: 'Thêm mới nhóm chức năng',
        isLoading: false,
        btnActionIsLoading: false,
        jobposSelected: {},
        isDetail: false,
        keywords: this.$store.getters.keywords || '',
        pagination: {
          page: 1,
          total: 1
        },
        paginationSize: 20,
        heightFull: 0,
        jobposItems: []
      }
    },
    created () {
      this.$nextTick(function () {
        this.runDispatchJobpos()
      })
    },
    methods: {
      onScroll () {
        var vm = this
        if (window.$('.base-administration-list').scrollTop() + window.$('.base-administration-list').height() === vm.heightFull) {
          if (window.$('.base-administration-list').scrollTop() !== 0) {
            vm.pagination.page = vm.pagination.page + 1
            if (vm.paginationLength >= vm.pagination.page) {
              vm.runDispatchJobpos(true)
            }
          }
        }
      },
      runDispatchJobpos (boolscroll) {
        let vm = this
        vm.isLoading = true
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
        this.$store.dispatch('jobpos/getJobposItems', {
          keywords: vm.keywords || '',
          start: start || 0,
          end: end || vm.paginationSize
        }).then(response => {
          vm.isLoading = false
          vm.pagination.total = response.total
          if (boolscroll === true) {
            vm.jobposItems = vm.jobposItems.concat(response.data)
          } else {
            vm.jobposItems = response.data
            if (response.data.length > 0) {
              vm.detailJobpos(response.data[0])
            } else {
              vm.isDetail = false
            }
          }
        }, error => {
          console.log(error)
          vm.isLoading = false
        })
      },
      detailJobpos (item) {
        this.isDetail = true
        let result = {}
        window.$('.mobilink-jobpos-component-right').animate({
          scrollTop: 0
        }, 600)
        Object.assign(result, item)
        this.jobposSelected = result
      },
      deleteJobpos (item) {
        let vm = this
        if (item.jobPosId) {
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
              vm.$store.dispatch('jobpos/deleteJobpos', item.jobPosId).then(response => {
                vm.btnActionIsLoading = false
                if (String(item.jobPosId) === String(vm.jobposSelected.jobPosId)) {
                  vm.detailJobpos(vm.jobposItems[0])
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
      onEditJobposSuccess (newJobpos) {
        this.detailJobpos(newJobpos)
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
