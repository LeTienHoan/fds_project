<template>
    <div v-if="componentActive">
      <v-navigation-drawer
          stateless
          v-model="drawer"
          :width="drawerWidth"
          :mini-variant.sync="mini" hide-overlay
      >
        <v-btn block color="primary" @click="openDiaglogAddActivity"
          depressed
          v-if="!mini">
          {{title}}
        </v-btn>
        <dia-log 
          :item = "[
            {
              width: '900px',
              model: add_new_task,
              action: 'saveDialog1',
              edit: true,
              label: 'Lưu và thoát',
              icon: 'save'
            },
            {
              width: '900px',
              model: add_new_task,
              action: 'saveDialog2',
              edit: true,
              label: 'Lưu và thêm mới',
              icon: 'save'
            }
            ]
          "
          :show_button = true
          @closeDialog="(val) => (add_new_task = val)"
          @saveDialog1="submitSaveAndExit"
          @saveDialog2="submitSaveAndAddNew"
        >
          <template slot="header">
            Thêm mới công việc
          </template>
          <template slot="content">
            <activityAddTask 
            ref='activityAddRef'
            @call-back-add="onAddActivitySuccess"
            :workspace="workspaceItem"
            >
              
            </activityAddTask>
          </template>
        </dia-log>
        <v-list>
          <template v-for="(navigationItem, index) in menuFilterxx">
              <v-list-group :key="index"
                :prepend-icon="navigationItem.icon" @click="parentSelectedM(navigationItem)"
                :value="advancedSearchNewQueriesCPValues.filter(x => navigationItem.meta.mapFilters.indexOf(x)>=0).length === navigationItem.meta.mapFilters.length"
                :class="{'list-group-custome-actived': advancedSearchNewQueriesCPValues.filter(x => navigationItem.meta.mapFilters.indexOf(x)>=0).length === navigationItem.meta.mapFilters.length}"
                append-icon=""
                v-if="navigationItem.meta.filterStyle &&
                  navigationItem.meta.filterStyle.possition === 'top'"
              >
                <v-list-tile slot="activator">
                  <v-list-tile-title>{{translate(navigationItem.name)}} ({{navigationItem.total}})
                  </v-list-tile-title>
                </v-list-tile>
              </v-list-group>
          </template>
        </v-list>
        <FilterWorkspace 
          ref='FilterWorkspace'
          :initWorkSpaceActive="Number($route.params.workspaceId || 0)"
          workspaceScope="TASK"
          @workspaceActive="workspaceChange"
          @workspaceActiveDelay="workspaceActiveDelay"
          :labels="{
            titleName: 'Thư mục',
            deleteMessageConfirm: 'Bạn muốn xóa thư mục không?',
            deleteMessageSuccess: 'Xoá thư mục thành công',
            renameMessageSuccess: 'Đổi tên thành công',
            dialogRenameHeader: 'Đổi tên thư mục',
            dialogAddNewHeader: 'Thêm mới thư mục công việc',
            workspaceName: 'Tên thư mục',
            workspaceDescription: 'Mô tả',
            workspaceParent: 'Thư mục cấp trên',
            shareWorkspaceFor: 'Chia sẻ thư mục cho',
            addNewMessageSuccess: 'Thêm mới thư mục thành công',
            editMessageSuccess: 'Cập nhật thư mục thành công',
            shareMessageSuccess: 'Chia sẻ thư mục thành công'
          }"
          >
        </FilterWorkspace>
        <v-list>
          <template v-for="(navigationItem, index) in menuFilterxx">
              <v-list-group :key="index"
                :prepend-icon="navigationItem.icon" @click="parentSelectedM(navigationItem)"
                :value="advancedSearchNewQueriesCPValues.filter(x => navigationItem.meta.mapFilters.indexOf(x)>=0).length === navigationItem.meta.mapFilters.length"
                :class="{'list-group-custome-actived': advancedSearchNewQueriesCPValues.filter(x => navigationItem.meta.mapFilters.indexOf(x)>=0).length === navigationItem.meta.mapFilters.length}"
                append-icon=""
                v-if="navigationItem.meta.filterStyle &&
                    navigationItem.meta.filterStyle.possition === 'bottom'"
              >
                <v-list-tile slot="activator">
                  <v-list-tile-title>{{translate(navigationItem.name)}} ({{navigationItem.total}})
                  </v-list-tile-title>
                </v-list-tile>
              </v-list-group>
          </template>
        </v-list>

      </v-navigation-drawer>
    </div>
</template>

<script>
import { EventBus } from '@/eventbus'
import activityAddTask from '@/components/task_comp/activity_add_task'
import FilterWorkspace from '@/components/task_comp/FilterWorkspace'
export default {
  props: {
    drawerWidth: {
      default: 240
    }
  },
  data () {
    return {
      buttonName: 'them_moi_cong_viec',
      drawer: true,
      mini: false,
      add_new_task: false,
      workspace: {},
      workspaceItem: '',
      componentActive: false
    }
  },
  components: {activityAddTask, FilterWorkspace},
  computed: {
    title () {
      return this.translate(this.buttonName)
    },
    menuFilterxx () {
      return this.$store.getters.staticRouters
    },
    menuFilter () {
      return this.$store.getters.staticRouter
    },
    advancedSearchNewQueriesCP () {
      return this.$store.getters['advancedSearch/advancedSearchNewQueries'].advansearchListAmazings
    },
    advancedSearchNewQueriesCPValues () {
      return this.advancedSearchNewQueriesCP.map(item => item.value)
    }
  },
  watch: {
    '$route' (val) {
      // this.setAdvancedSearch()
    }
  },
  methods: {
    setAdvancedSearch () {
      if (!this.$route.params.workspaceId &&
        this.menuFilterxx.map(item => item.name).indexOf(this.$route.name) >= 0) {
        this.parentSelectedM(this.menuFilter)
      }
    },
    parentSelectedM (navigation) {
      this.$store.dispatch('setBackToListUrl', navigation.path)
      this.$router.push(navigation.path)
      this.$store.dispatch('advancedSearch/setAdvancedSearchNewQueries', {
        advansearchListAmazings: this.getMappedQuery(navigation.meta.mapFilters)
      })
    },
    getMappedQuery (mapFilters) {
      const filtertaskConfig = window.getEval(this.MSystemConfiguration.configuration.advancedsearch.filtertask)
      return filtertaskConfig
        .filter(item =>
          (mapFilters || []).indexOf(item.advancedSearchZUUID) >= 0
        ).map(item2 => {
          return {
            text: item2.name,
            advancedSearchZUUID: item2.advancedSearchZUUID,
            value: item2.advancedSearchZUUID,
            bgClass: 'bg-mcl primary--text',
            query: this.mapQuery(item2.geoadvancedSearch)
          }
        })
    },
    mapQuery (geoadvancedSearch) {
      let queriesAdvanced = {}
      for (let i in geoadvancedSearch) {
        if (geoadvancedSearch[i].type === 'date-range') {
          queriesAdvanced[geoadvancedSearch[i].queryKeys[0]] = geoadvancedSearch[i].fromDate
            ? window.moment(geoadvancedSearch[i].fromDate).format('YYYYMMDD') : ''
          queriesAdvanced[geoadvancedSearch[i].queryKeys[1]] = geoadvancedSearch[i].toDate
            ? window.moment(geoadvancedSearch[i].toDate).format('YYYYMMDD') : ''
        } else if (geoadvancedSearch[i].type === 'date-time-range') {
          queriesAdvanced[geoadvancedSearch[i].queryKeys[0]] = geoadvancedSearch[i].fromDate
            ? window.moment(geoadvancedSearch[i].fromDate).format('YYYYMMDDHHmm') : ''
          queriesAdvanced[geoadvancedSearch[i].queryKeys[1]] = geoadvancedSearch[i].toDate
            ? window.moment(geoadvancedSearch[i].toDate).format('YYYYMMDDHHmm') : ''
        } else if (geoadvancedSearch[i].type === 'multi-select') {
          queriesAdvanced[geoadvancedSearch[i].queryKeys[0]] = (geoadvancedSearch[i].value || []).map(item => item[geoadvancedSearch[i].item_value]).join()
        } else if (geoadvancedSearch[i].type === 'select-field') {
          queriesAdvanced[geoadvancedSearch[i].queryKeys[0]] = (geoadvancedSearch[i].value || {})[geoadvancedSearch[i].item_value] || ''
        } else {
          queriesAdvanced[geoadvancedSearch[i].queryKeys[0]] = geoadvancedSearch[i].value || ''
        }
      }
      return queriesAdvanced
    },
    openDiaglogAddActivity () {
      this.add_new_task = true
      this.$refs.activityAddRef.initGetData()
    },
    submitSaveAndExit () {
      var vm = this
      vm.$refs.activityAddRef.saveAndExit()
      // setTimeout(function () {
      //   vm.getCountTotal()
      // }, 1000)
    },
    submitSaveAndAddNew () {
      var vm = this
      vm.$refs.activityAddRef.saveAndAddNew()
      // setTimeout(function () {
      //   vm.getCountTotal()
      // }, 1000)
    },
    onAddActivitySuccess (bool) {
      if (bool === false) {
        this.add_new_task = false
      }
      this.getCountTotal()
    },
    workspaceChange (workspace) {
      this.workspaceItem = workspace
      this.$store.dispatch('setBackToListUrl', '/workspace/' + workspace.workspaceId)
      this.$router.push('/workspace/' + workspace.workspaceId)
    },
    workspaceActiveDelay (workspace) {
      let advansearchListAmazings = []
      if (this.advancedSearchNewQueriesCPValues.indexOf('workspace') >= 0) {
        advansearchListAmazings = this.advancedSearchNewQueriesCP.filter(item => item.value !== 'workspace')
      }
      this.$store.dispatch('advancedSearch/setAdvancedSearchNewQueries', {
        advansearchListAmazings: [{
          text: 'Thư mục ' + workspace.name,
          advancedSearchZUUID: 'workspace',
          value: 'workspace',
          bgClass: 'amber accent-1 primary--text',
          query: {workspace: workspace.workspaceId}
        }].concat(advansearchListAmazings)
      })
    },
    getCountTotal () {
      let staticRouters = this.menuFilterxx
      for (let k in staticRouters) {
        this.saveCount(k)
      }
    },
    saveCount (index) {
      let staticRouter = this.menuFilterxx[index]
      let url = this.end_point + 'activities/count'
      let vm = this
      const getMappedQuery = this.getMappedQuery(staticRouter.meta.mapFilters)
      let query = {
        start: -1,
        end: -1,
        type: 'TASK'
      }
      for (const i in getMappedQuery) {
        Object.assign(query, getMappedQuery[i].query)
      }
      let apiConfigHeader = {
        headers: {
          groupId: vm.group_id
        },
        params: query
      }
      window.axios.get(url, apiConfigHeader)
        .then(function (response) {
          vm.menuFilterxx[index].total = response.data
        })
        .catch(function (error) {
          console.log(error)
          vm.menuFilterxx[index].total = 0
        })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.componentActive = true
      this.setAdvancedSearch()
      this.getCountTotal()
      let vm = this
      EventBus.$on('count_filter', function (val) {
        if (val) {
          vm.getCountTotal()
        }
      })
    })
  },
  destroyed () {
    EventBus.$off('count_filter')
    // this.componentActive = false
    // delete this.setAdvancedSearch
    // delete this.parentSelectedM
    // delete this.openDiaglogAddActivity
    // delete this.submitSaveAndExit
    // delete this.submitSaveAndAddNew
    // delete this.onAddActivitySuccess
    // delete this.workspaceChange
    // delete this.workspaceActiveDelay
    // delete this.getCountTotal
    // delete this.saveCount
    // delete this.buttonName
    // delete this.drawer
    // delete this.mini
    // delete this.add_new_task
    // delete this.workspace
    // delete this.workspaceItem
    // delete this.title
    // delete this.menuFilterxx
  }
}
</script>