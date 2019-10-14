<template>
  <div class="mobilink-dictGroup-component fullwidth">
    <v-layout wrap>

      <v-flex sm3 xs3 class="px-2">
        <v-btn block color="primary" @click="isDetail = false"
          depressed
        >
          {{dictGroupAddTitle}}
        </v-btn>
        <v-select
          :items="dictCollectionItems"
          item-text="collectionName"
          item-value="collectionCode"
          v-model="dictCollectionModel"
          placeholder="Chưa tạo từ điển"
          autocomplete
          no-data-text=""
        ></v-select>
        <!--<v-list two-line class="base-administration-list">-->
        <div class="base-administration-list scrollClass" v-scroll="onScroll">
          <v-list class="scrollChildClass">
            <template v-for="(item, index) in dictGroupItems"
            >
              <v-list-tile :key="'v-list-tile'+index" @click="detailDictGroup(item)"
                :class="{'superadmin-active': String(item.groupCode) === String(dictGroupSelected.groupCode), 
                  'primary--text': String(item.groupCode) === String(dictGroupSelected.groupCode)}"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{item.groupName}}</v-list-tile-title>
                  <div class="list-action">
                    <v-btn icon
                      color="red darken-3"
                      flat
                      @click.stop="deleteDictGroup(item)"
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
      <v-flex sm9 xs9 class="scrollClass setHeightClass mobilink-dictGroup-component-right">
        <DictGroupDetail
          :isDetail="isDetail"
          :dictGroup="dictGroupSelected"
          :collectionCode="dictCollectionModel"
          @canceladdnew="val => (isDetail = true)"
          @addDictGroupsuccess="onEditDictGroupSuccess"
          @editDictGroupsuccess="onEditDictGroupSuccess"
        />

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import DictGroupDetail from './DictGroupDetail'
  const COMPONENT_NAME = 'mobilink-dictGroup'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {DictGroupDetail},
    computed: {
      staticRouter () {
        return this.$store.getters.staticRouter
      },
      dictCollectionItems () {
        let collections = this.$store.getters['allDictCollectionItems']
        if (collections.length > 0 && this.dictCollectionModel === '') {
          this.dictCollectionModel = collections[0]['collectionCode']
        }
        return collections
      },
      paginationLength () {
        let total = this.$store.getters['dictGroup/totalDictGroupItems']
        return Math.ceil(Number(total || 0) / this.paginationSize)
      }
    },
    watch: {
      '$store.getters.keywords' (val) {
        this.keywords = val
        this.pagination = {
          page: 1
        }
        this.runDispatchDictGroup()
      },
      dictCollectionModel (val) {
        this.pagination = {
          page: 1
        }
        this.runDispatchDictGroup()
      }
    },
    data () {
      return {
        dictGroupAddTitle: 'Thêm mới nhóm danh mục',
        isLoading: false,
        btnActionIsLoading: false,
        dictGroupSelected: {},
        isDetail: false,
        keywords: this.$store.getters.keywords || '',
        pagination: {
          page: 1,
          total: 1
        },
        dictCollectionModel: '',
        paginationSize: 20,
        heightFull: 0,
        dictGroupItems: []
      }
    },
    created () {
      this.$nextTick(function () {
        this.dispatchAllDictCollection()
      })
    },
    methods: {
      onScroll () {
        var vm = this
        if (window.$('.base-administration-list').scrollTop() + window.$('.base-administration-list').height() === vm.heightFull) {
          if (window.$('.base-administration-list').scrollTop() !== 0) {
            vm.pagination.page = vm.pagination.page + 1
            if (vm.paginationLength >= vm.pagination.page) {
              vm.runDispatchDictGroup(true)
            }
          }
        }
      },
      runDispatchDictGroup (boolscroll) {
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
        this.$store.dispatch('dictGroup/getDictGroupItems', {
          keywords: vm.keywords || '',
          collectionCode: vm.dictCollectionModel || '',
          start: start || 0,
          end: end || vm.paginationSize
        }).then(response => {
          vm.isLoading = false
          vm.pagination.total = response.total
          if (boolscroll === true) {
            vm.dictGroupItems = vm.dictGroupItems.concat(response.data)
          } else {
            vm.dictGroupItems = response.data
            if (response.data.length > 0) {
              vm.detailDictGroup(response.data[0])
            } else {
              vm.isDetail = false
            }
          }
        }, error => {
          console.log(error)
          vm.isLoading = false
        })
      },
      dispatchAllDictCollection () {
        let vm = this
        vm.$store.dispatch('getAllDictCollectionItems').then(response => {
          if (response.data.length > 0) {
            this.dictCollectionModel = response.data[0]['collectionCode']
          }
        }, error => {
          console.log(error)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
      },
      detailDictGroup (item) {
        this.isDetail = true
        window.$('.mobilink-dictGroup-component-right').animate({
          scrollTop: 0
        }, 600)
        let result = {}
        Object.assign(result, item)
        this.dictGroupSelected = result
      },
      deleteDictGroup (item) {
        let vm = this
        if (item.groupCode) {
          this.$dialog.confirm('Bạn có chắc chắn xóa dữ liệu này không?', {
            html: true,
            loader: true,
            okText: 'Xác nhận',
            cancelText: 'Quay lại',
            animation: 'fade'
          })
            .then(function (dialog) {
              vm.btnActionIsLoading = true
              let payload = {
                collectionCode: vm.dictCollectionModel,
                groupCode: item.groupCode
              }
              vm.$store.dispatch('loading/setLoading', {
                loading: true,
                message: 'Xóa dữ liệu...'
              })
              vm.$store.dispatch('dictGroup/deleteDictGroup', payload).then(response => {
                vm.btnActionIsLoading = false
                if (String(item.groupCode) === String(vm.dictGroupSelected.groupCode)) {
                  vm.detailDictGroup(vm.dictGroupItems[0])
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
      onEditDictGroupSuccess (newDictGroup) {
        this.detailDictGroup(newDictGroup)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .base-administration-list {
    height: calc(100vh - 260px);
    overflow: auto;
  }
</style>
