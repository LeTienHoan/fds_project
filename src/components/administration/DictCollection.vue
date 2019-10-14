<template>
  <div class="mobilink-dictCollection-component fullwidth">
    <v-layout wrap>

      <v-flex sm3 xs3 class="px-2">
        <v-btn block color="primary" @click="isDetail = false"
          depressed
        >
          {{dictCollectionAddTitle}}
        </v-btn>
        <!--<v-list two-line class="base-administration-list">-->
        <div class="base-administration-list scrollClass" v-scroll="onScroll">
          <v-list class="scrollChildClass">
            <template v-for="(item, index) in dictCollectionItems" class="scrollChildClass"
            >
              <v-list-tile :key="'v-list-tile'+index" @click="detailDictCollection(item)"
                :class="{'superadmin-active': String(item.collectionCode) === String(dictCollectionSelected.collectionCode), 
                  'primary--text': String(item.collectionCode) === String(dictCollectionSelected.collectionCode)}"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{item.collectionName}}</v-list-tile-title>
                  <div class="list-action">
                    <v-btn icon
                      color="red darken-3"
                      flat
                      @click.stop="deleteDictCollection(item)"
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
      <v-flex sm9 xs9 class="scrollClass setHeightClass mobilink-dictCollection-component-right">
        <DictCollectionDetail
          :isDetail="isDetail"
          :dictCollection="dictCollectionSelected"
          @canceladdnew="val => (isDetail = true)"
          @addDictCollectionsuccess="onEditDictCollectionSuccess"
          @editDictCollectionsuccess="onEditDictCollectionSuccess"
        />

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import DictCollectionDetail from './DictCollectionDetail'
  const COMPONENT_NAME = 'mobilink-dictCollection'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {DictCollectionDetail},
    computed: {
      staticRouter () {
        return this.$store.getters.staticRouter
      },
      paginationLength () {
        let vm = this
        return Math.ceil(Number(vm.$store.getters['dictCollection/totalDictCollectionItems'] || 0) / vm.paginationSize)
      }
    },
    watch: {
      '$store.getters.keywords' (val) {
        this.keywords = val
        this.pagination = {
          page: 1
        }
        this.runDispatchDictCollection()
      }
    },
    data () {
      return {
        dictCollectionAddTitle: 'Thêm mới từ điển',
        isLoading: false,
        btnActionIsLoading: false,
        dictCollectionSelected: {},
        isDetail: false,
        keywords: this.$store.getters.keywords || '',
        pagination: {
          page: 1,
          total: 1
        },
        paginationSize: 20,
        heightFull: 0,
        dictCollectionItems: []
      }
    },
    created () {
      this.$nextTick(function () {
        this.runDispatchDictCollection()
      })
    },
    methods: {
      onScroll () {
        var vm = this
        if (window.$('.base-administration-list').scrollTop() + window.$('.base-administration-list').height() === vm.heightFull) {
          if (window.$('.base-administration-list').scrollTop() !== 0) {
            vm.pagination.page = vm.pagination.page + 1
            if (vm.paginationLength >= vm.pagination.page) {
              vm.runDispatchDictCollection(true)
            }
          }
        }
      },
      runDispatchDictCollection (boolscroll) {
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
        this.$store.dispatch('dictCollection/getDictCollectionItems', {
          keywords: vm.keywords || '',
          start: start || 0,
          end: end || vm.paginationSize
        }).then(response => {
          vm.isLoading = false
          vm.pagination.total = response.total
          if (boolscroll === true) {
            vm.dictCollectionItems = vm.dictCollectionItems.concat(response.data)
          } else {
            vm.dictCollectionItems = response.data
            if (response.data.length > 0) {
              vm.detailDictCollection(response.data[0])
            } else {
              vm.isDetail = false
            }
          }
        }, error => {
          console.log(error)
          vm.isLoading = false
        })
      },
      detailDictCollection (item) {
        this.isDetail = true
        window.$('.mobilink-dictCollection-component-right').animate({
          scrollTop: 0
        }, 600)
        let result = {}
        Object.assign(result, item)
        this.dictCollectionSelected = result
      },
      deleteDictCollection (item) {
        let vm = this
        if (item.collectionCode) {
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
              vm.$store.dispatch('dictCollection/deleteDictCollection', item.collectionCode).then(response => {
                vm.btnActionIsLoading = false
                if (String(item.collectionCode) === String(vm.dictCollectionSelected.collectionCode)) {
                  vm.detailDictCollection(vm.dictCollectionItems[0])
                }
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageToastr('success', 'Xóa dữ liệu thành công')
              }, error => {
                window.showMessageByAPICode(error.response.status, error.response.data)
                console.log(error)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
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
      onEditDictCollectionSuccess (newDictCollection) {
        this.detailDictCollection(newDictCollection)
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
