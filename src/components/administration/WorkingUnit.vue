<template>
  <div class="workingunit-component">
    <v-layout wrap>

      <v-flex sm3 xs3 class="px-2">
        <v-btn block color="primary" @click="isDetail = false"
          depressed
        >
          {{workingUnitAddTitle}}
        </v-btn>
        <div class="base-administration-list scrollClass">
          <mobilink-custome-tree-menu
            class="scrollChildClass"
            ref="workingUnitTree"
            v-show="!isLoading"
            id="workingunit1"
            :treeitems="workingUnitsMapedInStore"
            @treeactive="treeActive"
            @treeedit="detailWorkingUnit"
            @treedelete="deleteWorkingUnit"
            :activeId="workingUnitSelected.workingUnitId || 0"
            :treeShowAll="true"
            :treecontextmenu="false"
            heightStyle="autoScroll"
            maxHeight="100%"
            sortKey="asc_labelx"
          >
          </mobilink-custome-tree-menu>
        </div>
      </v-flex>
      <v-flex sm9 xs9 class="scrollClass setHeightClass">
        <WorkingUnitDetail
          :isDetail="isDetail"
          :workingUnit="workingUnitSelected"
          :workingUnitParentItems="workingUnitParentItems"
          @canceladdnew="val => (isDetail = true)"
          @addWorkingUnitsuccess="onEditWorkingUnitSuccess"
          @editWorkingUnitsuccess="onEditWorkingUnitSuccess"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import WorkingUnitDetail from './WorkingUnitDetail'
  const COMPONENT_NAME = 'working-unit'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {WorkingUnitDetail},
    computed: {
      staticRouter () {
        return this.$store.getters.staticRouter
      },
      workingUnitsMapedInStore () {
        let results = []
        const data = this.$store.getters['workingUnit/workingUnitItems']
        for (const key in data) {
          results.push(this.mapWorkingUnitToTreeData(data[key]))
        }
        return results
      },
      totalWorkingUnitItems () {
        return this.$store.getters['workingUnit/totalWorkingUnitItems']
      },
      workingUnitParentItems () {
        return this.isDetail
          ? this.$store.getters['allWorkingUnitItems'].filter(item => String(item.workingUnitId) !== String(this.workingUnitSelected.workingUnitId))
          : this.$store.getters['allWorkingUnitItems']
      }
    },
    watch: {
      workingUnitsMapedInStore (val) {
        if (val.length === 0) {
          this.isDetail = false
        }
      },
      '$store.getters.keywords' (val) {
        this.keywords = val
        this.runDispatchWorkingUnit()
      },
      totalWorkingUnitItems (val) {
        this.dispatchAllWorkingUnitItems()
      }
    },
    data () {
      return {
        workingUnitAddTitle: 'Thêm mới phòng ban',
        isLoading: false,
        btnActionIsLoading: false,
        workingUnitSelected: {},
        isDetail: false,
        keywords: this.$store.getters.keywords || ''
      }
    },
    created () {
      this.$nextTick(function () {
        this.runDispatchWorkingUnit()
      })
    },
    methods: {
      treeActive (workingUnit) {
        this.detailWorkingUnit(workingUnit)
        this.$emit('workingUnitActive', workingUnit)
      },
      changePageSize () {
        this.runDispatchWorkingUnit()
      },
      runDispatchWorkingUnit () {
        let vm = this
        vm.isLoading = true
        this.$store.dispatch('workingUnit/getWorkingUnitItems', {
          keywords: vm.keywords || '',
          start: -1,
          end: -1
        }).then(response => {
          vm.isLoading = false
          if (response.data.length > 0) {
            vm.detailWorkingUnit(response.data[0])
          }
        }, error => {
          console.log(error)
          vm.isLoading = false
        })
      },
      dispatchAllWorkingUnitItems () {
        this.$store.dispatch('getAllWorkingUnitItems')
      },
      detailWorkingUnit (item) {
        this.isDetail = true
        let result = {}
        Object.assign(result, item)
        this.workingUnitSelected = result
      },
      deleteWorkingUnit (item) {
        let vm = this
        if (item.workingUnitId) {
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
              vm.$store.dispatch('workingUnit/deleteWorkingUnit', item.workingUnitId).then(response => {
                vm.btnActionIsLoading = false
                if (item.workingUnitId === vm.workingUnitSelected.workingUnitId && vm.workingUnitsMapedInStore.length > 0) {
                  vm.detailWorkingUnit(vm.workingUnitsMapedInStore[0])
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
      onEditWorkingUnitSuccess (newWorkingUnit) {
        this.detailWorkingUnit(newWorkingUnit)
      },
      mapWorkingUnitToTreeData (workingUnit) {
        // let vm = this
        workingUnit.id = workingUnit.workingUnitId
        workingUnit.labelx = workingUnit.name
        workingUnit.icon = this.staticRouter.icon
        workingUnit.iconOpen = this.staticRouter.icon_active
        workingUnit.color = 'primary accent-2'
        workingUnit.parent = workingUnit.parentWorkingUnitId || 0
        // workingUnit.allowAddChild = 'owner, write'.indexOf(vm.getPermissionText(workingUnit.permission)) >= 0
        workingUnit.allowUpdateNDel = true
        return workingUnit
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
