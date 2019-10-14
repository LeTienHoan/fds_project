<template>
  <div class="calendar-list-wrapper">
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

    <v-list class="box list-navifilter-calendar">
      <v-list-group v-for="(navigation, index) in navigationItems"
        :key="'parent' +index"
        :prepend-icon="navigation.meta.icon"
        @click="parentSelectedM(navigation)"
        :value="$store.getters.getNaviActiveState(navigation.meta.type, navigation.name)" append-icon=""
      >
        <v-list-tile slot="activator">
          <v-list-tile-title
            :title="translate(navigation.name)"
          >{{translate(navigation.name)}}</v-list-tile-title>
          <v-list-tile-action v-if="index < 2">
            <v-icon style="margin-left: auto;" @click="openList(navigation)" v-if="navigation.meta.type=='personal'" title="Chọn cá nhân theo dõi">add</v-icon>
            <v-icon style="margin-left: auto;" @click="openList(navigation)" v-else-if="navigation.meta.type=='workspace'" title="Thêm thư mục cuộc họp">add</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile 
          v-for="(item,indexs) in navigation.meta.childrens"
          :key="'children' +indexs"
          @click="childrenSelectedM(item)"
          class="custome-navi"
          :class="{'active': childrenSelected.indexOf(item.type + '/' + item.id) >= 0}"
        >
          <v-list-tile-content>
            <v-list-tile-title
              :title="item.name"
            >
              <v-icon :class="{'active primary--text': childrenSelected.indexOf(item.type + '/' + item.id) >= 0}" title="Xóa">{{item.icon}}</v-icon>
                {{item.name}}
            </v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action v-if="item.id > 0">
            <span>
              <!-- TODO: check permission -->
              <v-icon @click="viewWorkspace(item)" v-if="item.type=='workspace' && !item.allowAddChild" title="Xem">error_outline</v-icon>
              <v-icon @click="editWorkspace(item)" v-if="item.type=='workspace' && item.allowAddChild" title="Sửa">edit</v-icon>
              <v-icon @click="clearWorkspace(item)" v-if="item.type=='workspace' ? item.allowAddChild : true" title="Xóa">clear</v-icon>
            </span>
          </v-list-tile-action>
        </v-list-tile>
      </v-list-group>
    </v-list>
    <v-text-field
      class="box"
      placeholder="Nhập từ khóa"
      v-model="keywords"
      append-icon="search"
      @change="keywordschange"
      @keyup.enter="keywordschange"
      :append-icon-cb="() => (keywordschange)"
    >
    </v-text-field>
    <v-date-picker v-model="dateModel" :locale="language"></v-date-picker>
  </v-navigation-drawer>
  
  <dia-log 
    :item = "[
      {
        width: '900px',
        model: add_new_event,
        action: 'saveDialog1',
        edit: true,
        label: 'Lưu và thoát',
        icon: 'save'
      },
      {
        width: '900px',
        model: add_new_event,
        action: 'saveDialog2',
        edit: true,
        label: 'Lưu và thêm mới',
        icon: 'save'
      }
      ]
    "
    :show_button = true
    @closeDialog="(val) => (add_new_event = val)"
    @saveDialog1="submitSaveAndExit"
    @saveDialog2="submitSaveAndAddNew"
  >
    <template slot="header">
      Thêm mới lịch cơ quan
    </template>
    <template slot="content">
      <activityAddEvent ref='activityAddRef'
        @call-back-add="onAddActivitySuccess"
        :workspace="workspaceId"
      >
      </activityAddEvent>
    </template>
  </dia-log>
  <dia-log 
    :item = "[
      {
        width: '700px',
        model: add_personal_calendar,
        action: 'saveDialog1',
        edit: true,
        label: 'Lưu và thoát',
        icon: 'save'
      }
      ]
    "
    :show_button = 'false'
    @closeDialog="(val) => (add_personal_calendar = val)"
  >
    <template slot="header">
      Chọn cá nhân theo dõi
    </template>
    <template slot="content">
      <v-layout wrap>
         <v-flex xs12>
          <v-text-field
            placeholder="Tìm kiếm ..."
            v-model="searchModel"
            required
            v-on:keyup.enter="getEmployee"
            append-icon="search"
          ></v-text-field>
        </v-flex>
        <v-flex xs6 v-for="(item, index) in usersItems" :key="index">
          <v-btn color="primary" @click="clickAddPersonal(item,index)" class="btn--small" style="min-width: 1px;">
            Chọn
          </v-btn>
          {{ item.fullName }}
        </v-flex>
      </v-layout>
    </template>
  </dia-log>
  <EditWorkspace
    ref="Workspace"
    :workspaceScope="workspaceScope"
    :edit="editWorkspaceProps.edit"
    :workspace="editWorkspaceProps.workspace"
    :disabled="editWorkspaceProps.disabled"
    @editSuccess="onTreeEditSuccess"
    @createSuccess="onTreeCreateSuccess"
    :labels="labels"
  />
  </div>
</template>

<script>
import EditWorkspace from '../task_comp/EditWorkspace'
import activityAddEvent from '@/components/activity/activity_add_event'
export default {
  components: {
    activityAddEvent,
    EditWorkspace
  },
  props: {
    workspaceScope: {
      type: String,
      default: 'EVENT'
    },
    drawerWidth: {
      default: 240
    }
  },
  data () {
    return {
      buttonName: 'them_moi_cuoc_hop',
      drawer: true,
      mini: false,
      childrenSelected: this.$router.currentRoute.path,
      navigationItems: this.$store.getters.menuFilters,
      dateModel: '',
      add_new_event: false,
      keywords: '',
      add_personal_calendar: false,
      add_calendar: false,
      nameWorkspace: '',
      contentWorspace: '',
      valid: '',
      parentId: 0,
      usersItems: [],
      editWorkspaceProps: {
        edit: false,
        workspace: {}
      },
      searchModel: '',
      workspaceId: '',
      labels: {
        titleName: 'Lịch cơ quan',
        deleteMessageConfirm: 'Bạn muốn xóa lịch cơ quan',
        deleteMessageSuccess: 'Xoá lịch cơ quan thành công',
        renameMessageSuccess: 'Đổi tên thành công',
        dialogRenameHeader: 'Đổi tên lịch cơ quan',
        dialogAddNewHeader: 'Thêm thư mục cuộc họp',
        workspaceName: 'Tên lịch cơ quan',
        workspaceDescription: 'Mô tả',
        workspaceParent: 'Lịch cơ quan cha',
        shareWorkspaceFor: 'Chia sẻ lịch cơ quan cho',
        addNewMessageSuccess: 'Thêm mới lịch cơ quan thành công',
        editMessageSuccess: 'Cập nhật lịch cơ quan thành công',
        shareMessageSuccess: 'Chia sẻ lịch cơ quan thành công'
      }
    }
  },
  computed: {
    title () {
      return 'Thêm mới lịch cơ quan'
    },
    workspacesMapedInStore () {
      let vm = this
      const data = this.$store.getters['workspace/EVENT_workspaceItems']
      return data.map(item => {
        return {
          id: item['workspaceId'],
          name: item['name'],
          description: item['description'],
          type: 'workspace',
          pathHidden: '/workspace/',
          query: {
            workspace: item['workspaceId']
          },
          icon: 'folder',
          allowAddChild: 'owner'.indexOf(vm.getPermissionText(item.permission)) >= 0,
          allowUpdateNDel: 'owner'.indexOf(vm.getPermissionText(item.permission)) >= 0
        }
      })
    }
  },
  watch: {
    workspacesMapedInStore (val) {
      this.navigationItems[1].meta.childrens = [].concat(val)
    }
  },
  methods: {
    onTreeEditSuccess (workspace) {
    },
    onTreeCreateSuccess (workspace) {
    },
    getPreferences () {
      let vm = this
      vm.navigationItems[0].meta.childrens = []
      let url = vm.end_point + 'users/' + vm.user_id + '/preferences/USER_EVENTS'
      let config = {
        headers: {
          'groupId': vm.group_id
        },
        params: {
          start: -1,
          end: -1,
          sort: 'fullName_String'
        }
      }
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        for (var key in serializable) {
          for (var key1 in serializable[key]) {
            vm.navigationItems[0].meta.childrens.push({
              id: serializable[key][key1].userId,
              name: serializable[key][key1].fullName,
              createDate: serializable[key][key1].createDate,
              pathHidden: '/personal/',
              type: 'personal',
              query: {
                personalId: serializable[key][key1].userId
              },
              icon: 'person'
            })
          }
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    clearWorkspace (item) {
      let vm = this
      if (item.type === 'personal') {
        vm.$dialog.confirm('Bạn có chắc chắn xóa lịch cá nhân "' + item.name + '" không?', {
          html: true,
          loader: true,
          okText: 'Xác nhận',
          cancelText: 'Quay lại',
          animation: 'fade'
        })
          .then(function (dialog) {
            for (var key in vm.navigationItems[0].meta.childrens) {
              if (vm.navigationItems[0].meta.childrens[key].id === item.id) {
                vm.navigationItems[0].meta.childrens.splice(key, 1)
              }
            }
            vm.clickAddPersonal()
            dialog.close()
            return false
          })
          .catch(function (e) {
            console.log(e)
          })
      } else {
        vm.$dialog.confirm('Bạn muốn xóa lịch cơ quan', {
          html: true,
          loader: true,
          okText: 'Xác nhận',
          cancelText: 'Quay lại',
          animation: 'fade'
        })
          .then(function (dialog) {
            vm.$store.dispatch('loading/setLoading', {
              loading: true,
              message: 'Xoá lịch cơ quan...'
            })
            vm.$store.dispatch('workspace/deleteWorkspace', {
              scope: 'EVENT',
              workspaceId: item.id
            }).then(response => {
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageToastr('success', 'Xoá lịch cơ quan thành công')
            }, error => {
              console.log(error)
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
            dialog.close()
            return false
          })
          .catch(function (e) {
            console.log(e)
          })
      }
    },
    editWorkspace (item) {
      this.labels.dialogAddNewHeader = item.name + ' - Tạo bởi: ' + item.userName + ' - ' + window.moment(item.createDate).format('MM/DD/YYYY')
      this.$refs.Workspace.dialog_add_workspace = true
      this.$refs.Workspace.getVisibilities(item.id)
      this.editWorkspaceProps = {
        edit: true,
        workspace: {
          workspaceId: item.id,
          description: item.description,
          name: item.name
        },
        disabled: true
      }
    },
    viewWorkspace (item) {
      this.labels.dialogAddNewHeader = item.name + ' - Tạo bởi: ' + item.userName + ' - ' + window.moment(item.createDate).format('MM/DD/YYYY')
      this.$refs.Workspace.dialog_add_workspace = true
      this.$refs.Workspace.getVisibilities(item.id)
      this.editWorkspaceProps = {
        edit: true,
        workspace: {
          workspaceId: item.id,
          description: item.description,
          name: item.name
        },
        disabled: false
      }
    },
    openList (item) {
      let vm = this
      if (item.meta.type === 'personal') {
        this.add_personal_calendar = !this.add_personal_calendar
        vm.getEmployee()
      } else if (item.meta.type === 'workspace') {
        this.$refs.Workspace.dialog_add_workspace = true
        this.editWorkspaceProps = {
          edit: false,
          workspace: {
            workspaceId: 0
          },
          disabled: true
        }
      }
    },
    getEmployee () {
      let vm = this
      let params = {
        class: 'employee',
        start: -1,
        end: -1
      }
      if (vm.searchModel) {
        Object.assign(params, {
          keywords: vm.searchModel
        })
      }
      let url = vm.end_point + 'users'
      let config = {
        params: params,
        headers: {
          'groupId': vm.group_id
        }
      }
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          let obj = []
          for (var key2 in serializable.data) {
            if (serializable.data[key2].userId !== Number(vm.user_id)) {
              obj.push(serializable.data[key2])
            }
          }
          serializable.data = obj
          vm.usersItems = obj
          for (var key in vm.navigationItems[0].meta.childrens) {
            for (var key1 in serializable.data) {
              if (serializable.data[key1].userId === vm.navigationItems[0].meta.childrens[key].id) {
                vm.usersItems.splice(key1, 1)
              }
            }
          }
        } else {
          vm.usersItems = []
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    clickAddPersonal (item, index) {
      let vm = this
      const config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      let json = []
      if (item) {
        json = [{
          [item.userId]: {
            'fullName': item.fullName,
            'userId': item.userId
          }
        }]
      }
      for (var key in vm.navigationItems[0].meta.childrens) {
        json.push({
          [vm.navigationItems[0].meta.childrens[key].id]: {
            'fullName': vm.navigationItems[0].meta.childrens[key].name,
            'userId': vm.navigationItems[0].meta.childrens[key].id
          }
        })
      }
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Thêm lịch cá nhân...'
      })
      let params = new URLSearchParams()
      params.append('value', JSON.stringify(json))
      window.axios.put(vm.end_point + 'users/' + vm.user_id + '/preferences/USER_EVENTS', params, config)
        .then(function (response) {
          vm.usersItems.splice(index, 1)
          let serializable = response.data
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          vm.navigationItems[0].meta.childrens = []
          for (var key in serializable.USER_EVENTS) {
            for (var key1 in serializable.USER_EVENTS[key]) {
              vm.navigationItems[0].meta.childrens.push({
                id: serializable.USER_EVENTS[key][key1].userId,
                name: serializable.USER_EVENTS[key][key1].fullName,
                pathHidden: '/personal/',
                type: 'personal',
                query: {
                  personalId: serializable.USER_EVENTS[key][key1].userId
                },
                icon: 'person'
              })
            }
          }
          vm.add_personal_calendar = false
        })
        .catch(function (error) {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          console.log(error)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    },
    keywordschange () {
      let vm = this
      if (this.keywords !== this.$store.getters.keywords) {
        vm.$store.dispatch('setKeywords', this.keywords)
      }
    },
    parentSelectedM (navigation) {
      if (this.$router.currentRoute.meta.type === 'personal' && navigation.meta.id === 0) {
        this.$store.dispatch('setNaviFilter', {query: {personalId: ''}})
      } else if (this.$router.currentRoute.meta.type === 'workspace' && navigation.meta.id === 0) {
        this.$store.dispatch('setNaviFilter', {query: {workspace: ''}})
      }
      if (navigation.meta.type === 'personal' || navigation.meta.type === 'workspace') {
        this.childrenSelected = navigation.meta.type + '/' + navigation.meta.id
        this.$router.push({path: navigation.pathHidden + navigation.meta.id + '/month'})
      } else {
        this.$router.push({path: navigation.path})
      }
    },
    submitSaveAndExit () {
      this.$refs.activityAddRef.saveAndExit()
    },
    submitSaveAndAddNew () {
      this.$refs.activityAddRef.saveAndAddNew()
    },
    childrenSelectedM (item) {
      if (item.type === 'workspace') {
        this.workspaceId = item.query.workspace
      }
      this.childrenSelected = item.type + '/' + item.id
      this.$store.dispatch('setNaviFilter', item)
      const path = this.$router.currentRoute.path
      const oldId = this.$route.params.id
      this.$router.push({path: path.replace(oldId, item.id)})
    },
    openDiaglogAddActivity () {
      this.add_new_event = true
      this.$refs.activityAddRef.initGetData(new Date(), window.moment(new Date()).add(30, 'm').toDate())
    },
    submitAddActivity () {
      this.$refs.activityAddRef.submitAdd()
    },
    onAddActivitySuccess (bool) {
      if (bool === false) {
        this.add_new_event = false
      }
    },
    getWorkspace () { // deprecated
      let url = this.end_point + 'workspaces/scope/EVENT'
      let config = {
        headers: {
          'groupId': this.group_id
        },
        params: {
          start: -1,
          end: -1,
          sort: 'name_String'
        }
      }
      let vm = this
      vm.navigationItems[1].meta.childrens = []
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          let arrTemp = []
          for (let key in serializable.data) {
            arrTemp.push({
              id: serializable.data[key]['workspaceId'],
              name: serializable.data[key]['name'],
              description: serializable.data[key]['description'],
              type: 'workspace',
              pathHidden: '/workspace/',
              query: {
                workspace: serializable.data[key]['workspaceId']
              },
              icon: 'folder'
            })
          }
          vm.navigationItems[1].meta.childrens = vm.navigationItems[1].meta.childrens.concat(arrTemp)
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.dispatch('workspace/getWorkspaceItems', {scope: 'EVENT', sort: 'name_String'})
      this.getPreferences()
    })
  }
}
</script>
<style>
.list-navifilter-calendar .custome-navi .list__tile__action {
  margin-left: auto;
  padding-right: 14px;
}
</style>

