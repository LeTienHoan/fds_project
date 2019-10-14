<template>
    <div class="filter-workspace-wrap" v-if="componentActive">
      <mbl-expand-panel
        :leftactions="[
          {
            icon: 'business_center'
          }
        ]"
        :rightactions="rightactions"
        :ownExpanded= 'ownExpanded'
        @callback2="addWorkspace"
      >
        <template slot="title-name">
          <span>{{labels.titleName}}</span>
        </template>
        <template slot="card-text-container">
          <v-layout row wrap class="mx-0">
            <v-flex sm12>
              <!--<content-placeholders v-show="isLoading">
                <content-placeholders-text :lines="3" />
              </content-placeholders>-->
              <mobilink-custome-tree-menu
                ref="workspaceTree"
                v-show="!isLoading"
                id="workspacezzz"
                :treeitems="workspacesMapedInStore"
                @treeactive="treeActive" 
                @treeactivetriggerfordelay="onDelayTreeActive"
                @treeedit="treeEdit"
                @treeview="treeView"
                @treedelete="treeDelete"
                @ontreecontextmenu="workspaceContextMenu"
                :activeId="initWorkSpaceActive || 0"
                :treeShowAll="false"
                :treecontextmenu="contextmenu"
              >
              </mobilink-custome-tree-menu>
            </v-flex>
          </v-layout>
        </template>
      </mbl-expand-panel>
      <EditWorkspace
        ref="EditWorkspace"
        :edit="editWorkspaceProps.edit"
        :workspace="editWorkspaceProps.workspace"
        :workspaceItems="workspacesMapedInStore"
        :workspaceScope="workspaceScope"
        :disabled="editWorkspaceProps.disabled"
        @editSuccess="onTreeEditSuccess"
        @createSuccess="onTreeCreateSuccess"
        :labels="labels"
      />
        <v-menu
          v-if="contextmenu"
          v-model="showMenucontextMenuActions"
          :position-x="showMenucontextMenuActionsx"
          :position-y="showMenucontextMenuActionsy - appNudgeLeft"
          content-class="tree-menu-actions-menu"
          :nudge-top="appNudgeTop"
          :nudge-left="appNudgeLeft"
          absolute
          offset-y
        >
          <v-list>
            <v-list-tile
              v-for="(action, index) in contextMenuActions" :key="index"
              @click.stop="actionClick(action)"
              :class="{'disable': !action.enable}">
              <v-list-tile-title>{{ action.name }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
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
          {{labels.dialogRenameHeader}}
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
    </div>
</template>

<script>
  import EditWorkspace from './EditWorkspace'
  const COMPONENT_NAME = 'activity-workspace'
  export default {
    name: COMPONENT_NAME,
    components: {
      EditWorkspace
    },
    props: {
      initWorkSpaceActive: {
        type: Number,
        default: 0
      },
      workspaceScope: {
        type: String,
        default: 'TASK'
      },
      contextmenu: {
        type: Boolean,
        default: false
      },
      labels: {
        type: Object,
        default: {
          titleName: 'Vùng làm việc',
          deleteMessageConfirm: 'Bạn muốn xóa vùng làm việc không?',
          deleteMessageSuccess: 'Xoá vùng làm việc thành công',
          renameMessageSuccess: 'Đổi tên thành công',
          dialogRenameHeader: 'Đổi tên vùng làm việc',
          dialogAddNewHeader: 'Thêm mới vùng làm việc',
          workspaceName: 'Tên vùng làm việc',
          workspaceDescription: 'Mô tả',
          workspaceParent: 'Vùng làm việc cấp trên',
          shareWorkspaceFor: 'Chia sẻ vùng làm việc cho',
          addNewMessageSuccess: 'Thêm mới vùng làm việc thành công',
          editMessageSuccess: 'Cập nhật vùng làm việc thành công',
          shareMessageSuccess: 'Chia sẻ vùng làm việc thành công'
        }
      }
    },
    data () {
      return {
        ownExpanded: true,
        rightactions: [
          {
            icon: 'add',
            action: 'callback2'
          }
        ],
        isLoading: false,
        editWorkspaceProps: {
          edit: false,
          workspace: {}
        },
        contextMenuActions: [],
        showMenucontextMenuActions: false,
        showMenucontextMenuActionsx: 0,
        showMenucontextMenuActionsy: 0,
        showDialogRenameWorkspace: false,
        workspaceName: '',
        validWorkspaceForm: false,
        componentActive: false
      }
    },
    created () {
      this.contextMenuActions = [
        {name: this.translate('them_moi'), action: 'addWorkspace', icon: 'file_copy', enable: true},
        {name: 'Copy', action: 'copyWorkspace', icon: 'file_copy', enable: true},
        {name: 'Paste', action: 'pasteWorkspace', icon: 'file_copy', enable: true},
        {name: this.translate('doi_ten'), action: 'renameWorkspace', icon: 'file_copy', enable: true},
        {name: this.translate('sua'), action: 'editWorkspacezzz', icon: 'file_copy', enable: true},
        {name: this.translate('xoa'), action: 'deleteWorkspace', icon: 'file_copy', enable: true}
      ]
      this.$nextTick(function () {
        this.workspaceActived = { workspaceId: this.initWorkSpaceActive }
        this.getWorkspacesList()
        this.componentActive = true
      })
    },
    destroyed () {
      this.componentActive = true
      // delete this.addWorkspace
      // delete this.treeActive
      // delete this.deleteWorkspace
      // delete this.editWorkspacezzz
      // delete this.renameWorkspaceSubmit
      // delete this.renameWorkspace
      // delete this.pasteWorkspace
      // delete this.copyWorkspace
      // delete this.resetCopy
      // delete this.onDelayTreeActive
      // delete this.treeDeActive
      // delete this.treeDelete
      // delete this.treeEdit
      // delete this.onTreeEditSuccess
      // delete this.onTreeCreateSuccess
      // delete this.getWorkspacesList
      // delete this.mapWorkspaceToTreeData
      // delete this.workspaceContextMenu
      // delete this.actionClick

      // delete this.ownExpanded
      // delete this.rightactions
      // delete this.isLoading
      // delete this.editWorkspaceProps
      // delete this.contextMenuActions
      // delete this.showMenucontextMenuActions
      // delete this.showMenucontextMenuActionsx
      // delete this.showMenucontextMenuActionsy
      // delete this.showDialogRenameWorkspace
      // delete this.workspaceName
      // delete this.validWorkspaceForm
      // delete this.workspacesMapedInStore
      // delete this.labels
      // delete this.contextmenu
      // delete this.initWorkSpaceActive
      // delete this.workspaceScope
    },
    computed: {
      workspacesMapedInStore () {
        let results = []
        const data = this.$store.getters['workspace/' + this.workspaceScope + '_workspaceItems']
        for (const key in data) {
          results.push(this.mapWorkspaceToTreeData(data[key]))
        }
        return results
      }
    },
    methods: {
      addWorkspace () {
        this.$refs.EditWorkspace.dialog_add_workspace = true
        let parentIdPlaceHolder = this.workspacePlaceHolder && this.workspacePlaceHolder.workspaceId &&
          this.workspacePlaceHolder.allowAddChild ? this.workspacePlaceHolder.workspaceId : 0
        let parentIdActive = this.workspaceActived && this.workspaceActived.workspaceId &&
          this.workspaceActived.allowAddChild ? this.workspaceActived.workspaceId : 0
        this.editWorkspaceProps = {
          edit: false,
          workspace: {
            parentId: parentIdPlaceHolder || parentIdActive,
            workspaceId: parentIdPlaceHolder || parentIdActive,
            share: true
          },
          disabled: true
        }
      },
      treeActive (workspace) {
        this.workspaceActived = workspace
        this.$emit('workspaceActive', workspace)
      },
      onDelayTreeActive (workspace) {
        this.$emit('workspaceActiveDelay', workspace)
      },
      treeDeActive () {
        this.workspaceActived = null
        // window.$('.label-wrapper').removeClass('active')
      },
      treeDelete (workspace) {
        let vm = this
        vm.$dialog.confirm(vm.labels.deleteMessageConfirm, {
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
              workspaceId: workspace.workspaceId
            }).then(response => {
              vm.$store.dispatch('workspace/getWorkspaceItems', {scope: vm.workspaceScope}).then(response => {
                vm.isLoading = false
                const parentLength = workspace.parentList.length
                if (parentLength > 0) {
                  const activeWorkspace = vm.workspacesMapedInStore.find(item => item.workspaceId === workspace.parentList[parentLength - 1].id)
                  if (activeWorkspace) {
                    vm.treeActive(activeWorkspace)
                  } else {
                    vm.treeDeActive()
                  }
                } else {
                  vm.treeDeActive()
                }
                if (vm.workspaceCopy && vm.workspaceCopy.workspaceId === workspace.workspaceId) {
                  vm.resetCopy()
                }
                if (vm.workspacePlaceHolder && vm.workspacePlaceHolder.workspaceId === workspace.workspaceId) {
                  vm.workspacePlaceHolder = null
                }
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
              }, error => {
                console.log(error)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                vm.isLoading = false
              })
              window.showMessageToastr('success', vm.labels.deleteMessageSuccess)
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
      treeEdit (workspace) {
        this.labels.dialogAddNewHeader = workspace.name + ' - Tạo bởi: ' + workspace.userName + ' - ' + window.moment(workspace.createDate).format('MM/DD/YYYY')
        this.$refs.EditWorkspace.getVisibilities(workspace.workspaceId)
        this.editWorkspaceProps = {
          edit: true,
          workspace: workspace,
          share: false,
          disabled: true
        }
        this.$refs.EditWorkspace.dialog_add_workspace = true
      },
      treeView (workspace) {
        this.labels.dialogAddNewHeader = workspace.name + ' - Tạo bởi: ' + workspace.userName + ' - ' + window.moment(workspace.createDate).format('MM/DD/YYYY')
        this.$refs.EditWorkspace.getVisibilities(workspace.workspaceId)
        this.editWorkspaceProps = {
          edit: false,
          workspace: workspace,
          share: false,
          disabled: false
        }
        this.$refs.EditWorkspace.dialog_add_workspace = true
      },
      onTreeEditSuccess (workspace) {
      },
      onTreeCreateSuccess (workspace) {
      },
      getWorkspacesList () {
        let vm = this
        if (this.$store.getters['workspace/' + this.workspaceScope + '_workspaceItems'].length > 0) {
        } else {
          this.$store.dispatch('workspace/getWorkspaceItems', {scope: vm.workspaceScope, sort: 'name_String'}).then(response => {
            vm.isLoading = false
          }, error => {
            console.log(error)
            vm.isLoading = false
          })
        }
      },
      mapWorkspaceToTreeData (workspace) {
        let vm = this
        workspace.id = workspace.workspaceId
        workspace.labelx = workspace.name
        workspace.icon = 'folder'
        workspace.iconOpen = 'folder_open'
        workspace.color = 'amber accent-2'
        workspace.parent = workspace.parentId
        workspace.active = false
        workspace.showChildren = false
        workspace.allowAddChild = 'owner, write'.indexOf(vm.getPermissionText(workspace.permission)) >= 0
        workspace.allowUpdateNDel = !vm.contextmenu && 'owner'.indexOf(vm.getPermissionText(workspace.permission)) >= 0
        workspace.allowUpdateNDelContext = vm.contextmenu && 'owner'.indexOf(vm.getPermissionText(workspace.permission)) >= 0
        return workspace
      },
      workspaceContextMenu (jsEvent, workspace) {
        jsEvent.preventDefault()
        this.showMenucontextMenuActions = false
        this.showMenucontextMenuActionsx = jsEvent.clientX
        this.showMenucontextMenuActionsy = jsEvent.clientY
        this.workspacePlaceHolder = workspace
        if (workspace) {
          this.contextMenuActions[1].enable = true
          this.contextMenuActions[2].enable = this.workspaceCopy !== undefined &&
          this.workspaceCopy !== this.workspacePlaceHolder
          this.contextMenuActions[3].enable = workspace.allowUpdateNDelContext
          this.contextMenuActions[4].enable = workspace.allowUpdateNDelContext
          this.contextMenuActions[5].enable = workspace.allowUpdateNDelContext
        } else {
          this.contextMenuActions[1].enable = false
          this.contextMenuActions[2].enable = this.workspaceCopy !== undefined
          this.contextMenuActions[3].enable = false
          this.contextMenuActions[4].enable = false
          this.contextMenuActions[5].enable = false
        }
        this.$nextTick(() => {
          this.showMenucontextMenuActions = true
        })
      },
      actionClick (action) {
        if (action.enable) {
          let vm = this
          vm[action.action]()
          this.showMenucontextMenuActions = false
        } else {
          this.showMenucontextMenuActions = true
        }
      },
      resetCopy () {
        this.workspaceCopy = undefined
      },
      copyWorkspace () {
        this.workspaceCopy = this.workspacePlaceHolder
      },
      pasteWorkspace () {
        let copyTo = 0
        let mess = ''
        if (this.workspacePlaceHolder) {
          mess = 'Copy ' + this.workspaceCopy.name + ' đến ' + this.workspacePlaceHolder.name
          copyTo = this.workspacePlaceHolder.workspaceId
        } else {
          mess = 'Copy ' + this.workspaceCopy.name + ' đến gốc'
        }
        console.log(mess)
        let vm = this
        let param = {
          scope: vm.workspaceScope,
          sourceId: vm.workspaceCopy.workspaceId,
          targetId: copyTo /** ,
          name: vm.workspaceName */
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
          console.log(error)
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
      },
      renameWorkspace () {
        this.workspaceName = this.workspacePlaceHolder.name
        this.showDialogRenameWorkspace = true
      },
      renameWorkspaceSubmit () {
        if (this.validWorkspaceForm) {
          let vm = this
          let param = {
            scope: vm.workspaceScope,
            workspaceId: vm.workspacePlaceHolder.workspaceId,
            name: vm.workspaceName,
            parentId: vm.workspacePlaceHolder.parentId
          }
          vm.$store.dispatch('workspace/updateWorkspace', param).then(response => {
            vm.$refs.workspaceForm.reset()
            vm.showDialogRenameWorkspace = false
            window.showMessageToastr('success', vm.labels.renameMessageSuccess)
          }, error => {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
        }
      },
      editWorkspacezzz () {
        this.treeEdit(this.workspacePlaceHolder)
      },
      deleteWorkspace () {
        let vm = this
        vm.treeDelete(vm.workspacePlaceHolder)
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
