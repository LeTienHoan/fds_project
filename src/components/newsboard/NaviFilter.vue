<template>
  <div class="newsboard-navifilter simplebar" data-simplebar>
    <v-navigation-drawer
        stateless
        v-model="drawer"
        :width="drawerWidth"
        :mini-variant.sync="mini" hide-overlay
    >
      <v-btn block color="primary" @click="openDiaglogAddNewsBoard"
        depressed
        v-if="!mini">
        {{title}}
      </v-btn>
      <v-list>
        <template
          v-for="(navigationItem, index) in menuFilterxx"
        >
          <v-list-group :key="index"
            :prepend-icon="navigationItem.icon" @click="parentSelectedM(navigationItem)"
            :value="navigationItem.name === $route.name" append-icon=""
            v-if="navigationItem.meta.position==='top'"
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>{{translate(navigationItem.name)}}
                (<span v-if="typeof(navigationItem.countUnread) !== 'undefined'">{{navigationItem.countUnread}}/</span>{{navigationItem.total}})
              </v-list-tile-title>
            </v-list-tile>
          </v-list-group>
        </template>
      </v-list>
      <FilterWorkspace 
        ref='FilterWorkspace'
        :initWorkSpaceActive="Number($route.params.workspaceId || 0)"
        workspaceScope="newsboard"
        @workspaceActive="workspaceSelectedM"
        :contextmenu="false"
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
          titleName: 'Các chủ đề khác',
          deleteMessageConfirm: 'Bạn có chắc chắn muốn xóa chủ đề này không?',
          deleteMessageSuccess: 'Xoá chủ đề thành công',
          renameMessageSuccess: 'Đổi tên thành công',
          dialogRenameHeader: 'Đổi tên chủ đề',
          dialogAddNewHeader: 'Thêm mới chủ đề',
          workspaceName: 'Tên chủ đề',
          workspaceDescription: 'Mô tả',
          workspaceParent: 'Chủ đề cấp trên',
          shareWorkspaceFor: 'Chia sẻ chủ đề cho',
          addNewMessageSuccess: 'Thêm mới chủ đề thành công',
          editMessageSuccess: 'Cập nhật chủ đề thành công',
          shareMessageSuccess: 'Chia sẻ chủ đề thành công'
        }"-->
      </FilterWorkspace>
      <v-list>
        <template
          v-for="(navigationItem, index) in menuFilterxx"
        >
          <v-list-group :key="index"
            :prepend-icon="navigationItem.icon" @click="parentSelectedM(navigationItem)"
            :value="navigationItem.name === $route.name" append-icon=""
            v-if="navigationItem.meta.position==='bottom'"
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>{{translate(navigationItem.name)}}
                <span v-if="typeof(navigationItem.total) !== 'undefined'">({{navigationItem.total}})</span>
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
          model: dialogAddNewNewsBoard,
          action: 'saveDialog1',
          edit: true,
          label: 'Lưu và thoát',
          icon: 'save'
        },
        {
          width: '900px',
          model: dialogAddNewNewsBoard,
          action: 'saveDialog2',
          edit: true,
          label: 'Lưu và thêm mới',
          icon: 'save'
        }
        ]
      "
      :show_button = true
      @closeDialog="(val) => (dialogAddNewNewsBoard = val)"
      @saveDialog1="submitSaveAndExit"
      @saveDialog2="submitSaveAndAddNew"
    >
      <template slot="header">
        {{translate('them_moi_ban_tin')}}
      </template>
      <template slot="content">
        <AddNewsBoard 
        ref='addNewsBoardRef'
        :active="dialogAddNewNewsBoard"
        :workspace_cur="workspaceItemSelected"
        :workspaceAddItems="workspaceAddItems"
        @call-back="onAddNewsBoardSuccess"
        >
          
        </AddNewsBoard>
      </template>
    </dia-log>
  </div>
</template>

<script>
import AddNewsBoard from './AddNewsBoard'
import FilterWorkspace from '@/components/task_comp/FilterWorkspace'
export default {
  props: {
    drawerWidth: {
      default: 900
    }
  },
  data () {
    return {
      buttonName: 'them_moi',
      drawer: true,
      mini: false,
      parentSelected: '',
      dialogAddNewNewsBoard: false,
      bool: false
    }
  },
  components: {AddNewsBoard, FilterWorkspace},
  computed: {
    title () {
      return this.translate(this.buttonName)
    },
    newsboard_workspaceItems () {
      return this.$store.getters['workspace/newsboard_workspaceItems']
    },
    workspaceItemSelected () {
      return this.newsboard_workspaceItems.find(item =>
        Number(item.workspaceId) === Number(this.$route.params.workspaceId || 0) ||
        Number(this.$store.getters.otherQuery ? (this.$store.getters.otherQuery.workspace || 0) : 0)
      ) || {}
    },
    workspaceAddItems () {
      return this.newsboard_workspaceItems.filter(item => 'owner,write'.indexOf(item.permission) >= 0)
    },
    menuFilterxx () {
      return this.$store.getters.staticRouters
    }
  },
  watch: {
    drawerWidth (val) {
      window.$('.newsboard-navifilter .simplebar-scroll-content').width(val + 20)
    },
    '$route.query.newsBoardId' (val) {
      this.getApi()
    }
  },
  methods: {
    parentSelectedM (navigation) {
      this.emitNewsBoardId(0)
      this.$router.replace({
        name: navigation.name
      })
    },
    getApi () {
      let vm = this
      const configNoti = {
        params: {
          newsType: 'ANNOUNCE',
          editable: 1
        }
      }
      const configFAQ = {
        params: {
          newsType: 'FAQ',
          editable: 1
        }
      }
      const configMine = {
        params: {
          editable: 1,
          permission: 'owner',
          me: true
        }
      }
      const configTrash = {
        params: {
          editable: 2,
          permission: 'owner'
        }
      }
      window.axios.all([
        window.axios.get(vm.end_point + 'newsboards', configNoti),
        window.axios.get(vm.end_point + 'newsboards', configFAQ),
        window.axios.get(vm.end_point + 'newsboards', configMine),
        window.axios.get(vm.end_point + 'newsboards', configTrash)
      ])
        .then(window.axios.spread(function (response1, response2, response3, response4) {
          let serializable1 = response1.data
          let serializable2 = response2.data
          let countUnread1 = serializable1.data.filter(i => i.visited === false).length
          let countUnread2 = serializable2.data.filter(i => i.visited === false).length
          vm.menuFilterxx[0].total = serializable1.total
          vm.menuFilterxx[0].countUnread = countUnread1
          vm.menuFilterxx[1].total = serializable2.total
          vm.menuFilterxx[1].countUnread = countUnread2
          vm.menuFilterxx[2].total = response3.data.total
          vm.menuFilterxx[4].total = response4.data.total
        }))
        .catch(function (error) {
          console.log('>>>>>>>>>>>error', error)
        })
    },
    openDiaglogAddNewsBoard () {
      this.dialogAddNewNewsBoard = true
      this.$refs.addNewsBoardRef.initGetData()
    },
    submitSaveAndExit () {
      this.bool = true
      this.$refs.addNewsBoardRef.saveAndExit()
    },
    submitSaveAndAddNew () {
      this.bool = false
      this.$refs.addNewsBoardRef.saveAndAddNew()
    },
    onAddNewsBoardSuccess (newsBoard) {
      this.$refs.addNewsBoardRef.clearDataForm()
      if (this.bool) {
        this.dialogAddNewNewsBoard = false
      }
      if (newsBoard.newsType === 'ANNOUNCE' && this.$route.path === '/notification') {
        this.$router.replace({
          name: 'thong_bao',
          params: this.$route.params,
          query: Object.assign({}, this.$route.query, {
            newsBoardId: newsBoard.newsBoardId
          })
        })
      } else if (newsBoard.newsType === 'FAQ' && this.$route.path === '/qna') {
        this.$router.replace({
          name: 'hoi_dap',
          params: this.$route.params,
          query: Object.assign({}, this.$route.query, {
            newsBoardId: newsBoard.newsBoardId
          })
        })
      } else {
        this.$router.replace({
          name: this.$route.name,
          params: this.$route.params,
          query: Object.assign({}, this.$route.query, {
            newsBoardId: newsBoard.newsBoardId
          })
        })
      }
      this.getApi()
      this.emitNewsBoardId(newsBoard.newsBoardId)
      window.showMessageToastr('success', 'Đã thêm bản tin "' + newsBoard.title + '" thành công')
    },
    workspaceSelectedM (workspace) {
      this.emitNewsBoardId(0)
      this.$router.replace({ name: 'thu_muc',
        params: {workspaceId: workspace.workspaceId}
      })
    },
    emitNewsBoardId (id) {
      this.$emit('changeNewsBoardId', id)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getApi()
    })
  }
}
</script>

<style lang="css">
.newsboard-navifilter {
  height: calc(100vh - 130px);
  margin-right: -5px!important;
}
.newsboard-navifilter .simplebar-track.vertical {
  right: -2px;
}
</style>
