<template>
  <div class="popup-edit-workspace-wrap">
    <dia-log 
      :item = "[
        {
          width: '900px',
          model: dialog_add_workspace,
          action: 'saveDialog1',
          edit: true,
          label: 'Lưu và thoát',
          icon: 'save'
        },
        {
          width: '900px',
          model: dialog_add_workspace,
          action: 'saveDialog2',
          edit: true,
          label: 'Lưu và thêm mới',
          icon: 'save'
        }
      ]"
      :show_button = 'disabled'
      @closeDialog="(val) => (dialog_add_workspace = val)"
      @saveDialog1="submitSaveAndAddNew(false)"
      @saveDialog2="submitSaveAndAddNew(true)"
    >
      <template slot="header">
        <span>{{labels.dialogAddNewHeader}}</span>
      </template>
      <template slot="content">
        <v-form ref="form" lazy-validation>
            <v-layout wrap v-if="disabled">
              <v-flex xs2>
                <v-subheader class="px-0">{{labels.workspaceName}} *</v-subheader>
              </v-flex>
              <v-flex xs10>
                <v-text-field
                  placeholder=""
                  v-model="taskName"
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          <v-layout wrap>
            <v-flex xs12 sm2>
              <v-subheader class="px-0">{{labels.workspaceDescription}}</v-subheader>
            </v-flex>
            <v-flex xs10>
              <v-text-field
                placeholder=""
                v-model="contentModel"
                multi-line
                :disabled="disabled === false"
              ></v-text-field>
            </v-flex>
          </v-layout>
            <v-layout wrap v-if="workspaceScope !== 'EVENT'">
              <v-flex xs12 sm2>
                <v-subheader class="px-0">{{labels.workspaceParent}}</v-subheader>
              </v-flex>
              <v-flex xs10>
                <v-select
                v-bind:items="ownWorkspaceItems"
                v-model="workspaceModel"
                item-text="workspaceNamePath"
                item-value="workspaceId"
                autocomplete
                hide-selected
                clearable
                @input="changeWorkspace"
                :disabled="disabled === false"
                ></v-select>
              </v-flex>
            </v-layout>
          <v-layout wrap>
            <v-flex xs12>
              <v-subheader class="px-0">{{labels.shareWorkspaceFor}}: </v-subheader>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs2>
              <v-subheader class="px-0">Cá nhân </v-subheader>
            </v-flex>
            <v-flex xs10>
              <v-select
              return-object
              v-bind:items="resourceusers"
              v-model="resourceuser"
              item-text="fullName"
              item-value="userId"
              multiple
              chips
              hide-selected
              autocomplete
              :disabled="disabled === false"
              :filter="customFilterUser"
              >
                  <template slot="selection" slot-scope="data">
                      <v-chip
                          close
                          @input="data.parent.selectItem(data.item)"
                          :selected="data.selected"
                          class="chip--select-multi"
                          :key="JSON.stringify(data.item)"
                      >
                          <v-avatar @click.stop.prevent="changePermissionUserFunc(data.item)" class="cyan darken-1" style="color: white; cursor: pointer;" v-if="data.item.right === constantPermissionKey.owner"> O </v-avatar>
                          <v-avatar @click.stop.prevent="changePermissionUserFunc(data.item)" class="green darken-2" style="color: white; cursor: pointer;" v-if="data.item.right === constantPermissionKey.write"> W </v-avatar>
                          <v-avatar @click.stop.prevent="changePermissionUserFunc(data.item)" class="accent" style="cursor: pointer;" v-if="data.item.right === constantPermissionKey.read"> R </v-avatar>
                          {{ data.item.fullName }}
                      </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="data.item.fullName"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="data.item.email"></v-list-tile-sub-title>
                      </v-list-tile-content>
                    </template>
                  </template>
              </v-select>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs2>
              <v-subheader class="px-0">Đơn vị </v-subheader>
            </v-flex>
            <v-flex xs10>
              <v-select
              return-object
              v-bind:items="resourceroles"
              v-model="resourcerole"
              item-text="roleName"
              item-value="roleId"
              multiple
              chips
              hide-selected
              autocomplete
              :disabled="disabled === false"
              >
                <template slot="selection" slot-scope="data">
                  <v-chip
                    close
                    @input="data.parent.selectItem(data.item)"
                    :selected="data.selected"
                    class="chip--select-multi"
                    :key="JSON.stringify(data.item)"
                  >
                    <v-avatar @click.stop.prevent="changePermissionRoleFunc(data.item)" class="cyan darken-1" style="color: white; cursor: pointer;" v-if="data.item.right === constantPermissionKey.owner"> O </v-avatar>
                    <v-avatar @click.stop.prevent="changePermissionRoleFunc(data.item)" class="green darken-2" style="color: white; cursor: pointer;" v-if="data.item.right === constantPermissionKey.write"> W </v-avatar>
                    <v-avatar @click.stop.prevent="changePermissionRoleFunc(data.item)" class="accent" style="cursor: pointer;" v-if="data.item.right === constantPermissionKey.read"> R </v-avatar>
                    {{ data.item.roleName }}
                  </v-chip>
                </template>
              </v-select>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs2></v-flex>
            <v-flex xs10>
              <v-checkbox
                style="float: left;"
                class="py-0 my-0 pr-3"
                v-model="checkboxModel"
                label="Chia sẻ toàn cơ quan"
                :disabled="disabled === false"
              >
              </v-checkbox>
            </v-flex>
          </v-layout>
        </v-form>
      </template>
    </dia-log>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'activity-task-workspace'
  export default {
    name: COMPONENT_NAME,
    components: {
    },
    props: {
      edit: false,
      workspace: {
        parentId: 0
      },
      disabled: false,
      workspaceItems: {
        type: Array,
        default: () => []
      },
      workspaceScope: {
        type: String,
        default: 'TASK'
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
        dialog_add_workspace: false,
        taskName: '',
        contentModel: '',
        workspaceModel: '',
        resourceusers: [],
        resourceuser: '',
        resourcerole: '',
        resourceroles: [],
        workspaceClassName: 'org.mobilink.sharing.model.Workspace',
        share: false,
        checkboxModel: false
      }
    },
    created () {
      this.$nextTick(function () {
      })
    },
    destroyed () {
      // delete this.edit
      // delete this.workspace
      // delete this.workspaceItems
      // delete this.workspaceScope
      // delete this.labels
      // delete this.dialog_add_workspace
      // delete this.taskName
      // delete this.contentModel
      // delete this.workspaceModel
      // delete this.resourceusers
      // delete this.resourceuser
      // delete this.resourcerole
      // delete this.resourceroles
      // delete this.workspaceClassName
      // delete this.share
      // delete this.ownWorkspaceItems
      // delete this.getResourceUsers
      // delete this.changePermissionUserFunc
      // delete this.getResourceRoles
      // delete this.changePermissionRoleFunc
      // delete this.submitSaveAndAddNew
      // delete this.shareUser
      // delete this.shareRole
      // delete this.changeWorkspace
    },
    watch: {
      workspace (val) {
        this.taskName = val.name
        this.workspaceModel = val.parentId ? val.parentId : 0
        this.contentModel = val.description ? val.description : ''
        this.class_pk = val.workspaceId ? val.workspaceId : 0
        this.share = val.share
        // this.getResourceWorkspaces()
        this.getResourceUsers()
        this.getResourceRoles()
      }
    },
    computed: {
      ownWorkspaceItems () {
        return this.workspaceItems.filter(item => item.allowAddChild)
      }
    },
    methods: {
      getResourceUsers () {
        let vm = this
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        vm.resourceuser = []
        window.axios.get(vm.end_point + 'resourceusers/' + vm.workspaceClassName + '/' + vm.class_pk + '?full=employee&sort=fullName_String&start=-1&end=-1', config)
          .then(function (response) {
            let serializable = response.data
            vm.resourceusers = serializable.data
            for (var key in vm.resourceusers) {
              if (vm.resourceusers[key].hasOwnProperty('selected') && vm.resourceusers[key]['selected'] === true) {
                if (vm.share === true) {
                  vm.resourceusers[key].right = 0
                }
                vm.resourceuser.push(vm.resourceusers[key])
              }
            }
          })
          .catch(function (error) {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      changePermissionUserFunc: function (item) {
        console.log(item)
        if (item.right === this.constantPermissionKey.read) {
          item.right = this.constantPermissionKey.write
        } else if (item.right === this.constantPermissionKey.write) {
          item.right = this.constantPermissionKey.owner
        } else {
          item.right = this.constantPermissionKey.read
        }
      },
      getResourceRoles () {
        let vm = this
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        vm.resourcerole = []
        window.axios.get(vm.end_point + 'resourceroles/' + vm.workspaceClassName + '/' + vm.class_pk + '?sort=roleName_String&full=true&roleType=0&start=-1&end=-1', config)
          .then(function (response) {
            let serializable = response.data
            vm.resourceroles = serializable.data
            for (var key in vm.resourceroles) {
              if (vm.resourceroles[key].hasOwnProperty('selected') && vm.resourceroles[key]['selected'] === true) {
                if (vm.share === true) {
                  vm.resourceroles[key].right = 0
                }
                vm.resourcerole.push(vm.resourceroles[key])
              }
            }
          })
          .catch(function (error) {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      changePermissionRoleFunc (item) {
        if (item.right === this.constantPermissionKey.read) {
          item.right = this.constantPermissionKey.write
        } else if (item.right === this.constantPermissionKey.write) {
          item.right = this.constantPermissionKey.owner
        } else {
          item.right = this.constantPermissionKey.read
        }
      },
      /**
      submitSaveAndExit () {
        let vm = this
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        if (this.$refs.form.validate()) {
          if (vm.edit === false) {
            let paramsAddWorkspace = new URLSearchParams()
            paramsAddWorkspace.append('name', vm.taskName)
            paramsAddWorkspace.append('parentId', vm.workspaceModel)
            paramsAddWorkspace.append('description', vm.contentModel)
            window.axios.post(vm.end_point + 'workspaces/TASK', paramsAddWorkspace, config)
              .then(function (response) {
                if (vm.resourceuser.length !== 0) {
                  vm.shareUser(response.data.workspaceId)
                }
                if (vm.resourcerole.length !== 0) {
                  vm.shareRole(response.data.workspaceId)
                }
                vm.dialog_add_workspace = false
                vm.$emit('createSuccess', response.data)
              })
              .catch(function (error) {
                console.log(error)
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
          } else {
            let paramsAddWorkspace1 = new URLSearchParams()
            paramsAddWorkspace1.append('name', vm.taskName)
            paramsAddWorkspace1.append('parentId', vm.workspaceModel ? vm.workspaceModel : 0)
            paramsAddWorkspace1.append('description', vm.contentModel)
            window.axios.put(vm.end_point + 'workspaces/' + vm.class_pk, paramsAddWorkspace1, config)
              .then(function (response) {
                if (vm.resourceuser.length !== 0) {
                  vm.shareUser(response.data.workspaceId)
                }
                if (vm.resourcerole.length !== 0) {
                  vm.shareRole(response.data.workspaceId)
                }
                vm.dialog_add_workspace = false
                vm.$emit('editSuccess', response.data)
              })
              .catch(function (error) {
                console.log(error)
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
          }
        }
      }, */
      submitSaveAndAddNew (continueAdd) {
        let vm = this
        /**
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        } */
        let param
        if (this.$refs.form.validate()) {
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Thêm mới dữ liệu...'
          })
          if (vm.edit === false) {
            /**
            let paramsAddWorkspace = new URLSearchParams()
            paramsAddWorkspace.append('name', vm.taskName)
            paramsAddWorkspace.append('parentId', vm.workspaceModel)
            paramsAddWorkspace.append('description', vm.contentModel)
            window.axios.post(vm.end_point + 'workspaces/TASK', paramsAddWorkspace, config)
              .then(function (response) {
                if (continueAdd && vm.resourceuser.length !== 0) {
                  vm.shareUser(response.data.workspaceId)
                }
                if (continueAdd && vm.resourcerole.length !== 0) {
                  vm.shareRole(response.data.workspaceId)
                }
                vm.dialog_add_workspace = continueAdd
                vm.$refs.form.reset()
                vm.$emit('createSuccess', response.data)
              })
              .catch(function (error) {
                console.log(error)
                window.showMessageByAPICode(error.response.status, error.response.data)
              }) */
            if (vm.workspaceScope === 'EVENT') {
              param = {
                scope: vm.workspaceScope,
                name: vm.taskName,
                description: vm.contentModel
              }
            } else {
              param = {
                scope: vm.workspaceScope,
                name: vm.taskName,
                description: vm.contentModel,
                parentId: vm.workspaceModel ? vm.workspaceModel : 0
              }
            }
            vm.$store.dispatch('workspace/createWorkspace', param).then(response => {
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              if (vm.checkboxModel === true) {
                vm.putVisibilities(response.workspaceId, true)
              } else {
                vm.putVisibilities(response.workspaceId, false)
              }
              vm.shareUser(response.workspaceId)
              vm.shareRole(response.workspaceId)
              vm.dialog_add_workspace = continueAdd
              if (continueAdd) {
                vm.$refs.form.reset()
              }
              vm.$emit('createSuccess', response)
              window.showMessageToastr('success', vm.labels.addNewMessageSuccess)
            }, error => {
              console.log(error)
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
          } else {
            /**
            let paramsAddWorkspace1 = new URLSearchParams()
            paramsAddWorkspace1.append('name', vm.taskName)
            paramsAddWorkspace1.append('parentId', vm.workspaceModel)
            paramsAddWorkspace1.append('description', vm.contentModel)
            window.axios.put(vm.end_point + 'workspaces/' + vm.class_pk, paramsAddWorkspace1, config)
              .then(function (response) {
                if (continueAdd && vm.resourceuser.length !== 0) {
                  vm.shareUser(response.data.workspaceId)
                }
                if (continueAdd && vm.resourcerole.length !== 0) {
                  vm.shareRole(response.data.workspaceId)
                }
                vm.$refs.form.reset()
                vm.$emit('editSuccess', response.data)
              })
              .catch(function (error) {
                console.log(error)
                window.showMessageByAPICode(error.response.status, error.response.data)
              }) */
            if (vm.workspaceScope === 'EVENT') {
              param = {
                scope: vm.workspaceScope,
                name: vm.taskName,
                workspaceId: vm.workspace ? vm.workspace.workspaceId : 0,
                description: vm.contentModel
              }
            } else {
              param = {
                scope: vm.workspaceScope,
                name: vm.taskName,
                workspaceId: vm.workspace ? vm.workspace.workspaceId : 0,
                parentId: vm.workspaceModel ? vm.workspaceModel : 0,
                description: vm.contentModel
              }
            }
            vm.$store.dispatch('workspace/updateWorkspace', param).then(response => {
              if (vm.checkboxModel === true) {
                vm.putVisibilities(response.workspaceId, true)
              } else {
                vm.putVisibilities(response.workspaceId, false)
              }
              vm.shareUser(response.workspaceId)
              vm.shareRole(response.workspaceId)
              vm.dialog_add_workspace = continueAdd
              if (continueAdd) {
                vm.class_pk = 0
                vm.$refs.form.reset()
              }
              vm.$emit('editSuccess', response)
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageToastr('success', vm.labels.editMessageSuccess)
            }, error => {
              console.log(error)
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
          }
        }
      },
      putVisibilities (id, bool) {
        let vm = this
        let config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        let url = vm.end_point + 'visibilities/' + vm.workspaceClassName + '/' + id
        let paramsPutVisible = new URLSearchParams()
        if (bool === true) {
          paramsPutVisible.append('visible', 1)
        } else {
          paramsPutVisible.append('visible', 2)
        }
        window.axios.put(url, paramsPutVisible, config).then(function (response) {
        })
          .catch(function (error) {
            console.log(error)
          })
      },
      getVisibilities (id) {
        let vm = this
        let config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        let url = vm.end_point + 'visibilities/' + vm.workspaceClassName + '/' + id
        window.axios.get(url, config).then(function (response) {
          if (response.data.visible === 1) {
            vm.checkboxModel = true
          } else {
            vm.checkboxModel = false
          }
        })
          .catch(function (error) {
            console.log(error)
          })
      },
      shareUser (id) {
        let vm = this
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        let paramsApi4 = new URLSearchParams()
        paramsApi4.append('users', JSON.stringify(vm.resourceuser))
        paramsApi4.append('className', vm.workspaceClassName)
        paramsApi4.append('classPK', id)
        paramsApi4.append('userClass', 'employee')
        window.axios.post(vm.end_point + 'resourceusers/pack',
          paramsApi4,
          config)
          .then(function (response) {
            vm.getResourceUsers()
            // window.showMessageToastr('success', vm.labels.shareMessageSuccess)
          })
          .catch(function (error) {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      shareRole (id) {
        let vm = this
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        let paramsApi3 = new URLSearchParams()
        paramsApi3.append('roles', JSON.stringify(vm.resourcerole))
        paramsApi3.append('className', vm.workspaceClassName)
        paramsApi3.append('classPK', id)
        window.axios.post(vm.end_point + 'resourceroles/update',
          paramsApi3,
          config)
          .then(function (response) {
            vm.getResourceRoles()
            // window.showMessageToastr('success', vm.shareMessageSuccess)
          })
          .catch(function (error) {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      changeWorkspace () {
        let vm = this
        vm.class_pk = this.workspaceModel
        vm.share = true
        vm.getResourceUsers()
        vm.getResourceRoles()
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
