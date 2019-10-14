<template>
  <div class="mobilink-widget-component fullwidth">
    <v-layout wrap>

      <v-flex sm3 xs3 class="px-2">
        <v-btn block color="primary" @click="isDetail = false"
          depressed
        >
          Thêm Widget
        </v-btn>
        <div class="base-administration-list scrollClass" v-scroll="onScroll">
          <v-list class="scrollChildClass">
            <template v-for="(item, index) in widgetItems"
            >
              <v-list-tile :key="'v-list-tile'+index" @click="detailWidget(item)"
                :class="{'superadmin-active': item.widgetTypeId === widgetSelected.widgetTypeId, 
                  'primary--text': item.widgetTypeId === widgetSelected.widgetTypeId}"
              >
                <v-list-tile-content>
                  <v-list-tile-title><b>{{ item.widgetName }}</b></v-list-tile-title>
                  <v-list-tile-title>{{ item.widgetCode }}</v-list-tile-title>
                  <div class="list-action">
                    <v-btn icon
                      color="red darken-3"
                      flat
                      @click.stop="deleteWidget(item)"
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
      <v-flex sm9 xs9 class="scrollClass setHeightClass mobilink-widget-component-right">
        <WidgetDetail
          :isDetail="isDetail"
          :widget="widgetSelected"
          :end_point_widget="end_point_widget"
          @updateWidget="onEditWidgetSuccess"
          @addWidget="onAddWidgetSuccess"
          ref="widget"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import WidgetDetail from './WidgetDetail'
  const COMPONENT_NAME = 'mobilink-jobpos'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {WidgetDetail},
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
        this.runDispatchWidget()
      }
    },
    data () {
      return {
        isLoading: false,
        btnActionIsLoading: false,
        widgetSelected: {},
        isDetail: false,
        keywords: this.$store.getters.keywords || '',
        pagination: {
          page: 1,
          total: 1
        },
        paginationSize: 20,
        heightFull: 0,
        widgetItems: [],
        paginationLength: 0,
        end_point_widget: ''
      }
    },
    created () {
      this.$nextTick(function () {
        this.runDispatchWidget()
      })
    },
    methods: {
      onScroll () {
        var vm = this
        if (window.$('.base-administration-list').scrollTop() + window.$('.base-administration-list').height() === vm.heightFull) {
          if (window.$('.base-administration-list').scrollTop() !== 0) {
            vm.pagination.page = vm.pagination.page + 1
            if (vm.paginationLength >= vm.pagination.page) {
              vm.runDispatchWidget(true)
            }
          }
        }
      },
      runDispatchWidget (boolscroll) {
        let vm = this
        if (boolscroll === true) {
          window.$('.base-administration-list').animate({
            scrollTop: vm.heightFull - 40
          }, 600)
        }
        setTimeout(function () {
          vm.heightFull = window.$('.base-administration-list .scrollChildClass').height() + 16
        }, 499)
        vm.end_point_widget = window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2.1/mbl/' : 'http://localhost:8081/api/'
        let params = {
          start: this.pagination.page * this.paginationSize - this.paginationSize,
          end: this.pagination.page * this.paginationSize,
          keywords: vm.keywords ? vm.keywords : ''
        }
        const config = {
          params: params,
          headers: {
            'groupId': vm.group_id
          }
        }
        window.axios.get(vm.end_point_widget + 'widgettypes',
          config
        )
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              if (boolscroll === true) {
                vm.widgetItems = vm.widgetItems.concat(serializable.data)
              } else {
                vm.widgetItems = serializable.data
                if (serializable.data.length > 0) {
                  vm.detailWidget(serializable.data[0])
                } else {
                  vm.isDetail = false
                }
              }
              vm.paginationLength = Math.ceil(serializable.total / vm.paginationSize)
            } else {
              vm.widgetItems = []
              vm.isDetail = false
            }
          })
          .catch(function (error) {
            console.log(error.response)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      detailWidget (item) {
        this.isDetail = true
        let result = {}
        window.$('.mobilink-widget-component-right').animate({
          scrollTop: 0
        }, 600)
        Object.assign(result, item)
        this.widgetSelected = result
        this.$store.commit('widgetObj', item)
      },
      deleteWidget (item) {
        let vm = this
        this.$dialog.confirm('Bạn có chắc chắn xóa dữ liệu này không?', {
          html: true,
          loader: true,
          okText: 'Xác nhận',
          cancelText: 'Quay lại',
          animation: 'fade'
        })
          .then(function (dialog) {
            let url = vm.end_point_widget + 'widgettypes/' + item.widgetTypeId
            const config = {
              headers: {
                'groupId': vm.group_id
              }
            }
            window.axios.delete(url, config)
              .then(function (response) {
                setTimeout(function () {
                  vm.runDispatchWidget()
                }, 1000)
                window.showMessageToastr('success', 'Xóa dữ liệu thành công')
              })
              .catch(function (error) {
                window.showMessageByAPICode(error.response.status, error.response.data)
                console.log(error.response)
              })
            dialog.close()
            return false
          })
          .catch(function (e) {
            console.log(e)
          })
      },
      onEditWidgetSuccess (newWidget) {
        let vm = this
        this.detailWidget(newWidget)
        for (var key in vm.widgetItems) {
          if (vm.widgetItems[key].widgetTypeId === newWidget.widgetTypeId) {
            vm.widgetItems[key] = newWidget
          }
        }
      },
      onAddWidgetSuccess (newWidget) {
        this.widgetItems.push(newWidget)
        this.detailWidget(newWidget)
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
