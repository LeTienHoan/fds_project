<template>

  <div class="list-workspace-component" v-if="componentReadly">
    <content-placeholders v-show="isLoading">
      <content-placeholders-text :lines="3" />
    </content-placeholders>
    <mobilink-custome-tree-menu
      v-show="!isLoading"
      :id="'listworkspace' + id"
      :treeitems="workspacesMaped"
      @treeactive="treeActive"
      @ontreecontextmenu="workspaceContextMenu"
      :toolTipShow="toolTipShow"
      :activeId="(workspaceActived ? workspaceActived.workspaceId : 0) || 0"
      :treeShowAll="false"
      :treecontextmenu="true"
    />
    <div @contextmenu.stop="workspaceContextMenu" style="height: 50px; clear: both;"></div>
    <dia-log 
      :item = "[
        {
          width: '500px',
          model: showDialogRenameWorkspace,
          action: 'renameWorkspaceSubmit',
          edit: true,
          label: 'Lưu',
          icon: 'save'
        }
        ]
      "
      :show_button = true
      @closeDialog="(val) => (showDialogRenameWorkspace = val)"
      @renameWorkspaceSubmit="renameWorkspaceSubmit"
    >
      <template slot="header">
        {{translate('doi_ten_thu_muc')}}
      </template>
      <template slot="content">
        <v-form v-model="validWorkspaceForm" ref="workspaceForm" lazy-validation >
          <v-layout wrap >
            <v-flex sm12>
              <v-text-field v-model="workspaceName"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
              >
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </template>
    </dia-log>
    <JxMobilinkShared v-if="workspaceSelected && workspaceSelected.workspaceId"
      :visibilities_api="end_point + 'visibilities'"
      :resourceworkspace_get_api="end_point + 'resourceworkspaces'"
      :resourceroles_get_api="end_point + 'resourceroles'"
      :resourceusers_get_api="end_point + 'resourceusers'"
      :changelogs_get_api="end_point + 'changelogs'"
      :class_name="workspaceClassName"
      :class_pk="workspaceSelected.workspaceId"
      :permission="getWorkspacePermission"
      :only_slot_btn="true"
      ref="mobilinkshare"
    >
      <template slot="slot_btn">
        <!-- comment share action @click.stop="shareActivity(scope.row)" -->
        <div></div>
      </template>
    </JxMobilinkShared>
    <dia-log 
      :item = "[
        {
          width: '900px',
          model: dialogAddWorkspace,
          action: 'addWorkspaceSubmit',
          edit: true,
          label: 'Lưu và thoát',
          icon: 'save'
        },
        {
          width: '900px',
          model: dialogAddWorkspace,
          action: 'addWorkspaceSubmit2',
          edit: true,
          label: 'Lưu và thêm mới',
          icon: 'save'
        }
        ]
      "
      :show_button = true
      @closeDialog="(val) => (dialogAddWorkspace = val)"
      @addWorkspaceSubmit="addWorkspaceSubmit(false)"
      @addWorkspaceSubmit2="addWorkspaceSubmit(true)"
    >
      <template slot="header">
        Thêm mới thư mục
      </template>
      <template slot="content">
        <v-form v-model="validAddWorkspaceForm" ref="addWorkspaceForm" lazy-validation >
          <v-layout wrap >
            <v-flex xs12 sm2>
              <v-subheader class="px-0 subheader--required">Tên thư mục</v-subheader>
            </v-flex>
            <v-flex xs12v sm10>
              <v-text-field v-model="workspaceAddModel.name"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm2>
              <v-subheader class="px-0">Thư mục cha</v-subheader>
            </v-flex>
            <v-flex xs12 sm10>
              <v-select
                v-model="workspaceAddModel.parentId"
                :items="parentWorkspaceItems"
                item-text="name"
                item-value="workspaceId"
                clearable
                autocomplete
                auto
              >
                <template slot="item" slot-scope="data">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="data.item['name']"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="data.item['workspaceNamePath']"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </template>
              </v-select>
            </v-flex>
          </v-layout>
        </v-form>
      </template>
    </dia-log>
  </div>

</template>

<script>
import JxMobilinkShared from '@/components/task/mobilink_shared.vue'

function toolTipShow (workspace) {
  if (workspace && workspace.workspaceId) {
    let modified = (window.moment(workspace.createDate).format('DD/MM/YYYY HH:mm') ===
          window.moment(workspace.modifiedDate).format('DD/MM/YYYY HH:mm') ? 'Ngày tạo ' : 'Ngày sửa '
    ) +
      (window.moment(workspace.modifiedDate).format('DD/MM/YYYY HH:mm'))
    return 'Tạo bởi: ' + (workspace.createdBy || '') + ', ' + modified
  } else {
    return ''
  }
}
const COMPONENT_NAME = 'mobilink-list-workspace'
export default {
  name: COMPONENT_NAME,
  components: {
    JxMobilinkShared
  },
  props: {
    id: {
      default: 1
    },
    focusRef: {
      default: 'workspace'
    }
  },
  data () {
    return {
      workspaceScope: 'docfile',
      showDialogRenameWorkspace: false,
      dialogAddWorkspace: false,
      validWorkspaceForm: false,
      validAddWorkspaceForm: false,
      workspaceName: '',
      workspaceActived: {},
      workspaceSelected: {},
      isLoading: false,
      workspaceAddModel: {
        name: '',
        parentId: 0
      },
      toolTipShow: toolTipShow,
      componentReadly: false
    }
  },
  created () {
    this.workspaceActions = [
      {name: this.translate('them_moi'), action: 'addNewWorkspace', icon: 'file_copy', enable: true},
      {name: 'Copy', action: 'copyWorkspace', icon: 'file_copy', enable: true},
      {name: 'Paste', action: 'pasteWorkspace', icon: 'file_copy', enable: true},
      {name: this.translate('doi_ten'), action: 'renameWorkspace', icon: 'file_copy', enable: true},
      {name: this.translate('chia_se'), action: 'shareWorkspace', icon: 'file_copy', enable: true},
      {name: this.translate('xoa'), action: 'deleteWorkspace', icon: 'file_copy', enable: true}
    ]
    this.getWorkspacesList()
    this.componentReadly = true
  },
  destroyed () {
    // delete this.id
    // delete this.focusRef
    // delete this.workspaceScope
    // delete this.showDialogRenameWorkspace
    // delete this.dialogAddWorkspace
    // delete this.validWorkspaceForm
    // delete this.validAddWorkspaceForm
    // delete this.workspaceName
    // delete this.workspaceActived
    // delete this.workspaceSelected
    // delete this.isLoading
    // delete this.workspaceAddModel
    // delete this.toolTipShow
    // delete this.componentReadly
    // delete this.workspaceActions
    // delete this.getWorkspacePermission
    // delete this.parentWorkspaceItems
    // delete this.workspacesMaped
    // delete this.getWorkspacesList
    // delete this.mapWorkspaceToTreeData
    // delete this.addNewWorkspace
    // delete this.resetCopy
    // delete this.copyWorkspace
    // delete this.pasteWorkspace
    // delete this.renameWorkspace
    // delete this.renameWorkspaceSubmit
    // delete this.shareWorkspace
    // delete this.deleteWorkspace
    // delete this.treeActive
    // delete this.workspaceContextMenu
    // delete this.next
    // delete this.pre
    // delete this.addWorkspaceSubmit
    // delete this.workspaceIndexById
  },
  computed: {
    getWorkspacePermission () {
      return this.workspaceActived ? this.workspaceActived.permission : 'read'
    },
    parentWorkspaceItems () {
      return this.workspacesMaped.filter(item => item.permission !== 'read')
    },
    workspacesMaped () {
      let results = []
      const data = this.$store.getters['workspace/' + this.workspaceScope + '_workspaceItems']
      for (const key in data) {
        results.push(this.mapWorkspaceToTreeData(data[key]))
      }
      return results
    }
  },
  watch: {
    workspacesMaped () {
      this.$emit('workspacesMaped', this.workspacesMaped)
    },
    dialogAddWorkspace () {
      if (this.workspaceSelected && this.workspaceSelected.permission !== 'read') {
        this.workspaceAddModel.parentId = this.workspaceSelected.workspaceId
      } else {
        this.workspaceAddModel.parentId = 0
      }
      if (this.addEmit) {
        this.workspaceAddModel.parentId = 0
      }
    }
  },
  methods: {
    getWorkspacesList () {
      let vm = this
      if (this.$store.getters['workspace/' + this.workspaceScope + '_workspaceItems'].length > 0) {
      } else {
        vm.isLoading = true
        this.$store.dispatch('workspace/getWorkspaceItems', {scope: vm.workspaceScope}).then(response => {
          vm.isLoading = false
        }, error => {
          console.log(error)
          vm.isLoading = false
        })
      }
    },
    mapWorkspaceToTreeData (workspace) {
      // let vm = this
      workspace.id = workspace.workspaceId
      workspace.labelx = workspace.name
      workspace.icon = 'folder'
      workspace.iconOpen = 'folder_open'
      workspace.color = 'amber accent-2'
      workspace.parent = workspace.parentId
      workspace.active = false
      workspace.showChildren = false
      // workspace.allowAddChild = 'owner, write'.indexOf(vm.getPermissionText(workspace.permission)) >= 0
      // workspace.allowUpdateNDel = !vm.contextmenu && 'owner'.indexOf(vm.getPermissionText(workspace.permission)) >= 0
      // workspace.allowUpdateNDelContext = vm.contextmenu && 'owner'.indexOf(vm.getPermissionText(workspace.permission)) >= 0
      workspace.allowAddChild = false
      workspace.allowUpdateNDel = false
      workspace.allowUpdateNDelContext = false
      return workspace
    },
    addNewWorkspace (emit) {
      this.addEmit = emit === true ? emit : false
      this.dialogAddWorkspace = true
    },
    resetCopy () {
      this.workspaceCopy = undefined
    },
    copyWorkspace () {
      this.workspaceCopy = this.workspaceSelected
    },
    pasteWorkspace () {
      let copyTo = 0
      let mess = ''
      if (this.workspaceSelected) {
        mess = 'copy ' + this.workspaceCopy.name + ' den ' + this.workspaceSelected.name
        copyTo = this.workspaceSelected.workspaceId
      } else {
        mess = 'copy ' + this.workspaceCopy.name + ' den GOC'
      }
      let vm = this
      let param = {
        scope: vm.workspaceScope,
        sourceId: vm.workspaceCopy.workspaceId,
        targetId: copyTo,
        name: vm.workspaceName
      }
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Đang copy dữ liệu...'
      })
      vm.$store.dispatch('workspace/getWorkspacesCopy', param).then(response => {
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        window.showMessageToastr('success', mess + ' thành công')
      }, error => {
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        console.log(error)
        window.showMessageByAPICode(error.response.status, error.response.data)
      })
    },
    renameWorkspace () {
      this.workspaceName = this.workspaceSelected.labelx
      this.showDialogRenameWorkspace = true
    },
    renameWorkspaceSubmit () {
      if (this.validWorkspaceForm) {
        let vm = this
        let param = {
          scope: vm.workspaceScope,
          workspaceId: vm.workspaceSelected.workspaceId,
          name: vm.workspaceName,
          parentId: vm.workspaceSelected.parentId
        }
        vm.$store.dispatch('workspace/updateWorkspace', param).then(response => {
          vm.$refs.workspaceForm.reset()
          vm.showDialogRenameWorkspace = false
          window.showMessageToastr('success', 'Đổi tên thành công')
        }, error => {
          console.log(error)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
      }
    },
    shareWorkspace () {
      setTimeout(() => {
        this.$refs['mobilinkshare'].sharedDialogFunc()
      }, 100)
    },
    deleteWorkspace () {
      let vm = this
      vm.$dialog.confirm('Bạn chắc chắn xóa thư mục này?', {
        html: true,
        loader: true,
        okText: 'Xác nhận',
        cancelText: 'Quay lại',
        animation: 'fade'
      })
        .then(function (dialog) {
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Xóa dữ liệu...'
          })
          vm.$store.dispatch('workspace/deleteWorkspace', {
            scope: vm.workspaceScope,
            workspaceId: vm.workspaceSelected.workspaceId
          }).then(response => {
            vm.$store.dispatch('workspace/getWorkspaceItems', {scope: vm.workspaceScope}).then(response => {
              vm.isLoading = false
              if (vm.workspaceCopy && vm.workspaceCopy.workspaceId === vm.workspaceSelected.workspaceId) {
                vm.resetCopy()
              }
              const parentLength = vm.workspaceSelected.parentList.length
              if (parentLength > 0) {
                const activeWorkspace = vm.workspacesMapedInStore.find(item => item.workspaceId === vm.workspaceSelected.parentList[parentLength - 1].id)
                if (activeWorkspace) {
                  vm.treeActive(activeWorkspace)
                } else {
                  vm.workspaceSelected = {}
                }
              } else {
                vm.workspaceSelected = {}
              }
            }, error => {
              console.log(error)
              vm.isLoading = false
            })
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageToastr('success', 'Xóa thư mục thành công')
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
    },
    treeActive (workspace) {
      this.preWorkspace = this.workspaceActived
      this.workspaceActived = workspace
      this.$emit('workspaceActive', workspace)
    },
    workspaceContextMenu (jsEvent, workspace) {
      jsEvent.preventDefault()
      this.workspaceSelected = workspace
      if (workspace) {
        this.workspaceActions[1].enable = true
        this.workspaceActions[2].enable = this.workspaceCopy !== undefined &&
          this.workspaceCopy !== this.workspaceSelected
        this.workspaceActions[3].enable = workspace.permission !== 'read'
        this.workspaceActions[4].enable = workspace.permission !== 'read'
        this.workspaceActions[5].enable = workspace.permission !== 'read'
      } else {
        this.workspaceActions[1].enable = false
        this.workspaceActions[2].enable = this.workspaceCopy !== undefined
        this.workspaceActions[3].enable = false
        this.workspaceActions[4].enable = false
        this.workspaceActions[5].enable = false
      }
      this.$nextTick(() => {
        this.$emit('openmenuaction', this.workspaceActions, jsEvent, this.focusRef)
      })
    },
    next () {
      alert('active child')
    },
    pre () {
      alert('active parent')
    },
    addWorkspaceSubmit (addNew) {
      if (!this.$refs['addWorkspaceForm'].validate()) {
        window.showMessageToastr('error', 'Nhập các trường bắt buộc')
        return false
      } else {
        let vm = this
        vm.$store.dispatch('workspace/createWorkspace', {
          scope: vm.workspaceScope,
          parentId: vm.workspaceAddModel.parentId || 0,
          name: vm.workspaceAddModel.name
        }).then(response => {
          vm.$refs['addWorkspaceForm'].reset()
          vm.dialogAddWorkspace = addNew
          window.showMessageToastr('success', 'Thêm mới thư mục thành công')
        }, error => {
          console.log(error)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
      }
    },
    workspaceIndexById (workspace) {
      return this.workspacesMaped.findIndex(item => item.workspaceId === workspace.workspaceId)
    }
  }
}
</script>
<style lang="scss">
.tree-menu-actions-menu {
  .disable {
    color: #ccc;
    a {
      cursor: not-allowed;
    }
  }
  a {
    text-decoration: none;
  }
}
.subheader--required {
  &:after {
    content: '*';
    margin-left: 3px;
    color: #ec6464;
  }
}
</style>
