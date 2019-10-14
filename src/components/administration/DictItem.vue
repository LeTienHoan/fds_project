<template>
  <div class="mobilink-dictItem-component fullwidth">
    <v-layout wrap>

      <v-flex sm3 xs3 class="px-2">
        <v-btn block color="primary" @click="isDetail = false"
          depressed
        >
          {{dictItemAddTitle}}
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
            <template v-for="(item, index) in dictItemItems"
            >
              <v-list-tile :key="'v-list-tile'+index" @click="detailDictItem(item)"
                :class="{'superadmin-active': String(item.itemCode) === String(dictItemSelected.itemCode), 
                  'primary--text': String(item.itemCode) === String(dictItemSelected.itemCode)}"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{item.itemName}}</v-list-tile-title>
                  <div class="list-action">
                    <v-btn icon
                      color="red darken-3"
                      flat
                      @click.stop="deleteDictItem(item)"
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
      <v-flex sm9 xs9 class="scrollClass setHeightClass mobilink-dictItem-component-right">
        <DictItemDetail
          :isDetail="isDetail"
          :dictItem="dictItemSelected"
          :collectionCode="dictCollectionModel"
          @canceladdnew="val => (isDetail = true)"
          @addDictItemsuccess="onEditDictItemSuccess"
          @editDictItemsuccess="onEditDictItemSuccess"
        />

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import DictItemDetail from './DictItemDetail'
  const COMPONENT_NAME = 'mobilink-dictItem'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {DictItemDetail},
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
        let total = this.$store.getters['dictItem/totalDictItemItems']
        return Math.ceil(Number(total || 0) / this.paginationSize)
      }
    },
    watch: {
      '$store.getters.keywords' (val) {
        this.keywords = val
        this.pagination = {
          page: 1
        }
        this.runDispatchDictItem()
      },
      dictCollectionModel (val) {
        this.pagination = {
          page: 1
        }
        this.runDispatchDictItem()
      }
    },
    data () {
      return {
        dictItemAddTitle: 'Thêm mới danh mục',
        isLoading: false,
        btnActionIsLoading: false,
        dictItemSelected: {},
        isDetail: false,
        keywords: this.$store.getters.keywords || '',
        pagination: {
          page: 1,
          total: 1
        },
        paginationSize: 20,
        heightFull: 0,
        dictCollectionModel: '',
        dictItemItems: []
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
      runDispatchDictItem (boolscroll) {
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
        this.$store.dispatch('dictItem/getDictItemItems', {
          keywords: vm.keywords || '',
          collectionCode: vm.dictCollectionModel || '',
          start: start || 0,
          end: end || vm.paginationSize
        }).then(response => {
          vm.pagination.total = response.total
          vm.isLoading = false
          if (boolscroll === true) {
            vm.dictItemItems = vm.dictItemItems.concat(response.data)
          } else {
            vm.dictItemItems = response.data
            if (response.data.length > 0) {
              vm.detailDictItem(response.data[0])
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
      detailDictItem (item) {
        window.$('.mobilink-dictItem-component-right').animate({
          scrollTop: 0
        }, 600)
        this.isDetail = true
        let result = {}
        Object.assign(result, item)
        this.dictItemSelected = result
      },
      deleteDictItem (item) {
        let vm = this
        if (item.itemCode) {
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
                itemCode: item.itemCode
              }
              vm.$store.dispatch('loading/setLoading', {
                loading: true,
                message: 'Xóa dữ liệu...'
              })
              vm.$store.dispatch('dictItem/deleteDictItem', payload).then(response => {
                vm.btnActionIsLoading = false
                if (String(item.itemCode) === String(vm.dictItemSelected.itemCode)) {
                  vm.detailDictItem(vm.dictItemItems[0])
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
      onEditDictItemSuccess (newDictItem) {
        this.detailDictItem(newDictItem)
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
