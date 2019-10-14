<template>
  <div class="mobilink-notificationTemplate-component fullwidth">
    <v-layout wrap>

      <v-flex sm3 xs3 class="px-2">
        <v-btn block color="primary" @click="isDetail = false"
          depressed
        >
          {{notificationTemplateAddTitle}}
        </v-btn>
        <!--<v-list two-line class="base-administration-list">-->
        <div class="base-administration-list scrollClass" v-scroll="onScroll">
          <v-list class="scrollChildClass">
            <template v-for="(item, index) in notificationTemplateItems"
            >
              <v-list-tile :key="'v-list-tile'+index" @click="detailNotificationTemplate(item)"
                :class="{'superadmin-active': String(item.notificationType) === String(notificationTemplateSelected.notificationType), 
                  'primary--text': String(item.notificationType) === String(notificationTemplateSelected.notificationType)}"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{item.notificationType}}</v-list-tile-title>
                  <div class="list-action">
                    <v-btn icon
                      color="red darken-3"
                      flat
                      @click.stop="deleteNotificationTemplate(item)"
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
      <v-flex sm9 xs9 class="scrollClass setHeightClass mobilink-notificationTemplate-component-right">
        <NotificationTemplateDetail
          :isDetail="isDetail"
          :notificationTemplate="notificationTemplateSelected"
          @canceladdnew="val => (isDetail = true)"
          @addNotificationTemplatesuccess="onEditNotificationTemplateSuccess"
          @editNotificationTemplatesuccess="onEditNotificationTemplateSuccess"
        />

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import NotificationTemplateDetail from './NotificationTemplateDetail'
  const COMPONENT_NAME = 'mobilink-notificationTemplate'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {NotificationTemplateDetail},
    computed: {
      staticRouter () {
        return this.$store.getters.staticRouter
      },
      paginationLength () {
        let total = this.$store.getters['notification/totalNotificationTemplateItems']
        return Math.ceil(Number(total || 0) / this.paginationSize)
      }
    },
    watch: {
      '$store.getters.keywords' (val) {
        this.keywords = val
        this.pagination = {
          page: 1
        }
        this.runDispatchNotificationTemplate()
      }
    },
    data () {
      return {
        notificationTemplateAddTitle: 'Thêm mới mẫu thông báo',
        isLoading: false,
        btnActionIsLoading: false,
        notificationTemplateSelected: {},
        isDetail: false,
        keywords: this.$store.getters.keywords || '',
        pagination: {
          page: 1,
          total: 1
        },
        paginationSize: 20,
        heightFull: 0,
        notificationTemplateItems: []
      }
    },
    created () {
      this.$nextTick(function () {
        this.runDispatchNotificationTemplate()
      })
    },
    methods: {
      onScroll () {
        var vm = this
        if (window.$('.base-administration-list').scrollTop() + window.$('.base-administration-list').height() === vm.heightFull) {
          if (window.$('.base-administration-list').scrollTop() !== 0) {
            vm.pagination.page = vm.pagination.page + 1
            if (vm.paginationLength >= vm.pagination.page) {
              vm.runDispatchNotificationTemplate(true)
            }
          }
        }
      },
      runDispatchNotificationTemplate (boolscroll) {
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
        this.$store.dispatch('notification/getNotificationTemplateItems', {
          keyword: vm.keywords || '',
          start: start || 0,
          end: end || vm.paginationSize
        }).then(response => {
          vm.isLoading = false
          vm.pagination.total = response.total
          if (boolscroll === true) {
            vm.notificationTemplateItems = vm.notificationTemplateItems.concat(response.data)
          } else {
            vm.notificationTemplateItems = response.data
            if (response.data.length > 0) {
              vm.detailNotificationTemplate(response.data[0])
            } else {
              vm.isDetail = false
            }
          }
        }, error => {
          console.log(error)
          vm.isLoading = false
        })
      },
      detailNotificationTemplate (item) {
        this.isDetail = true
        let result = {}
        window.$('.mobilink-notificationTemplate-component-right').animate({
          scrollTop: 0
        }, 600)
        Object.assign(result, item, {recipient: item.recipient ? item.recipient.split(',') : []})
        this.notificationTemplateSelected = result
      },
      deleteNotificationTemplate (item) {
        let vm = this
        if (item.notificationType) {
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
              vm.$store.dispatch('notification/deleteNotificationTemplate', item.notificationType).then(response => {
                vm.btnActionIsLoading = false
                if (String(item.notificationType) === String(vm.notificationTemplateSelected.notificationType)) {
                  vm.detailNotificationTemplate(vm.notificationTemplateItems[0])
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
      onEditNotificationTemplateSuccess (newNotificationTemplate) {
        this.detailNotificationTemplate(newNotificationTemplate)
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
