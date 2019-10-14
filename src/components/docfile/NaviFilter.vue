<template>
  <div>
    <v-navigation-drawer
        stateless
        v-model="drawer"
        :width="drawerWidth"
        :mini-variant.sync="mini" hide-overlay
    >
      <v-btn block color="primary" @click="openDiaglogAddDocFile"
        depressed
        v-if="!mini">
        {{title}}
      </v-btn>
      <v-list>
        <template  v-for="(navigationItem, index) in menuFilterxx">
          <v-list-group :key="index"
            :prepend-icon="navigationItem.icon" @click="parentSelectedM(navigationItem)"
            :value="advancedSearchNewQueriesCPValues.filter(x => navigationItem.meta.mapFilters.indexOf(x)>=0).length === navigationItem.meta.mapFilters.length"
            :class="{'list-group-custome-actived': advancedSearchNewQueriesCPValues.filter(x => navigationItem.meta.mapFilters.indexOf(x)>=0).length === navigationItem.meta.mapFilters.length}"
            append-icon=""
            v-if="index <= 2 && (docFileOtherType ? navigationItem.meta.docFileOtherType : true)"
          >
            <v-list-tile slot="activator">
              <v-list-tile-title v-if="navigationItem.meta.showTotal">
                {{translate(navigationItem.name)}} ({{navigationItem.meta.total}})
              </v-list-tile-title>
              <v-list-tile-title v-else>
                {{translate(navigationItem.name)}}
              </v-list-tile-title>
            </v-list-tile>
          </v-list-group>
        </template>
      </v-list>
      <FilterWorkspace 
        ref='FilterWorkspace'
        :initWorkSpaceActive="Number($route.params.workspaceId || 0)"
        workspaceScope="docfile"
        @workspaceActive="workspaceSelectedM"
        :contextmenu="docFileOtherType"
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
        <!--:labels="{
          titleName: docFileOtherType ? 'Thư mục lưu trữ' : 'Hồ sơ lưu trữ',
          deleteMessageConfirm: docFileOtherType ? 'Bạn có chắc chắn muốn xóa thư mục lưu trữ không?' : 'Bạn có chắc chắn muốn xóa hồ sơ lưu trữ không?',
          deleteMessageSuccess: docFileOtherType ? 'Xoá thư mục lưu trữ thành công' : 'Xoá hồ sơ lưu trữ thành công',
          renameMessageSuccess: docFileOtherType ? 'Đổi tên thành công' : 'Đổi tên thành công',
          dialogRenameHeader: docFileOtherType ? 'Đổi tên thư mục lưu trữ' : 'Đổi tên hồ sơ lưu trữ',
          dialogAddNewHeader: docFileOtherType ? 'Thêm mới thư mục lưu trữ' : 'Thêm mới hồ sơ lưu trữ',
          workspaceName: docFileOtherType ? 'Tên thư mục lưu trữ' : 'Tên hồ sơ lưu trữ',
          workspaceDescription: docFileOtherType ? 'Mô tả' : 'Mô tả',
          workspaceParent: docFileOtherType ? 'Thư mục lưu trữ cấp trên' : 'Hồ sơ lưu trữ cấp trên',
          shareWorkspaceFor: docFileOtherType ? 'Chia sẻ thư mục lưu trữ cho' : 'Chia sẻ hồ sơ lưu trữ cho',
          addNewMessageSuccess: docFileOtherType ? 'Thêm mới thư mục lưu trữ thành công' : 'Thêm mới hồ sơ lưu trữ thành công',
          editMessageSuccess: docFileOtherType ? 'Cập nhật thư mục lưu trữ thành công' : 'Cập nhật hồ sơ lưu trữ thành công',
          shareMessageSuccess: docFileOtherType ? 'Chia sẻ thư mục lưu trữ thành công' : 'Chia sẻ hồ sơ lưu trữ thành công'
        }"-->
      </FilterWorkspace>
      <v-list>
        <template  v-for="(navigationItem, index) in menuFilterxx">
          <v-list-group :key="index"
            :prepend-icon="navigationItem.icon" @click="parentSelectedM(navigationItem)"
            :value="advancedSearchNewQueriesCPValues.filter(x => navigationItem.meta.mapFilters.indexOf(x)>=0).length === navigationItem.meta.mapFilters.length"
            :class="{'list-group-custome-actived': advancedSearchNewQueriesCPValues.filter(x => navigationItem.meta.mapFilters.indexOf(x)>=0).length === navigationItem.meta.mapFilters.length}"
            append-icon=""
            v-if="index > 2 && index < menuFilterxx.length - 1  && (docFileOtherType ? navigationItem.meta.docFileOtherType : true)"
          >
            <v-list-tile slot="activator">
              <v-list-tile-title v-if="navigationItem.meta.showTotal">
                {{translate(navigationItem.name)}} ({{navigationItem.meta.total}})
              </v-list-tile-title>
              <v-list-tile-title v-else>
                {{translate(navigationItem.name)}}
              </v-list-tile-title>
            </v-list-tile>
          </v-list-group>
        </template>
      </v-list>

    </v-navigation-drawer>
    <dia-log 
      :item = "[
        {
          width: '900px',
          model: dialogAddNewDocFile,
          action: 'saveDialog1',
          edit: true,
          label: 'Lưu và thoát',
          icon: 'save'
        },
        {
          width: '900px',
          model: dialogAddNewDocFile,
          action: 'saveDialog2',
          edit: true,
          label: 'Lưu và thêm mới',
          icon: 'save'
        }
        ]
      "
      :show_button = true
      @closeDialog="(val) => (dialogAddNewDocFile = val)"
      @saveDialog1="submitSaveAndExit"
      @saveDialog2="submitSaveAndAddNew"
    >
      <template slot="header">
        {{translate('them_moi_tai_lieu')}}
      </template>
      <template slot="content">
        <AddDocFile 
        ref='addDocFileRef'
        :workspace_cur="workspaceItemSelected"
        :workspaceAddItems="workspaceAddItems"
        @call-back="onAddDocFileSuccess"
        >
          
        </AddDocFile>
      </template>
    </dia-log>
  </div>
</template>

<script>
import { EventBus } from '@/eventbus'
import AddDocFile from './AddDocFile'
import FilterWorkspace from '@/components/task_comp/FilterWorkspace'
export default {
  props: {
    drawerWidth: {
      default: 240
    }
  },
  data () {
    return {
      buttonName: 'them_moi_tai_lieu',
      drawer: true,
      mini: false,
      dialogAddNewDocFile: false
    }
  },
  components: {AddDocFile, FilterWorkspace},
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
    docfile_workspaceItems () {
      return this.$store.getters['workspace/docfile_workspaceItems']
    },
    workspaceItemSelected () {
      return this.docfile_workspaceItems.find(item => Number(item.workspaceId) === Number(this.$route.params.workspaceId || 0)) || {}
    },
    workspaceAddItems () {
      return this.docfile_workspaceItems.filter(item => 'owner,write'.indexOf(item.permission) >= 0)
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
      const filtertaskConfig = window.getEval(this.MSystemConfiguration.configuration.advancedsearch.filterdocfile)
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
    openDiaglogAddDocFile () {
      this.dialogAddNewDocFile = true
      this.$refs.addDocFileRef.initGetData()
    },
    submitSaveAndExit () {
      this.saveAndExit = true
      this.$refs.addDocFileRef.saveAndExit()
    },
    submitSaveAndAddNew () {
      this.saveAndExit = false
      this.$refs.addDocFileRef.saveAndAddNew()
    },
    onAddDocFileSuccess (docFile) {
      this.$refs.addDocFileRef.clearDataForm()
      if (this.saveAndExit) {
        this.dialogAddNewDocFile = false
        this.$router.push('/detail/' + docFile.docFileId)
      }
      window.showMessageToastr('success', 'Đã thêm văn bản "' + docFile.subject + '" thành công')
    },
    workspaceSelectedM (workspace) {
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
      let vm = this
      this.$store.dispatch('docFile/count', {
      }).then(response => {
        for (let k in vm.menuFilterxx) {
          if (vm.menuFilterxx[k].meta.showTotal) {
            vm.menuFilterxx[k].meta.total = response[vm.menuFilterxx[k].meta.keyGetTotal] || 0
          }
        }
      }, error => {
        console.log(error)
        window.showMessageByAPICode(error.response.status, error.response.data)
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
  }
}
</script>