<template>
  <div :class="{'shared-component': true, 'd-inline-block': only_slot_btn}">
      <div v-if="only_slot_btn">
        <slot name="slot_btn" :xxx="sharedDialog">
          <v-btn icon class="ma-0"
            @click="sharedDialogFunc"
          >
            <v-icon>share</v-icon>
          </v-btn>
        </slot>
      </div>
      <mbl-expand-panel v-else
        :ownExpanded='ownExpanded'
        :showheader=false
      >
        <template slot="card-text-container">
          <v-layout class="align-center justify-space-between">
              
              <v-btn icon v-if="btn_icon && hasPermission"
                @click="sharedDialogFunc"
                class="primary px-0 ma-0 btn-icon-share-comp"
              >
                <v-icon>share</v-icon>
              </v-btn>
              <v-btn v-else-if="hasPermission" @click="sharedDialogFunc" small
              class="primary px-0 ma-0 btn-share-info">
                Chia sẻ thông tin 
              </v-btn>
              <div class="text-xs-right align-center d-flex" style="margin-left: auto;">
                <ul class="img-followers">
                    <li v-for="(item, index) in itemAll" v-bind:key="index" v-if="index < 4">
                      <v-tooltip left>
                        <img :src="'/image/user_male_portrait?img_id='+item.portraitId" slot="activator" />
                        <span v-if="item.fullName != ''">{{ item.fullName }}</span>
                        <span v-else>{{ item.email }}</span>
                        <span v-if="item.roleName != ''">{{ item.roleName }}</span>
                      </v-tooltip>
                    </li>
                      <li v-if="itemAll.length > 4">
                        <span class="text-main-color right ml-3 mt-1">
                          <span @click="click_open_lish_share" class="pointer">+{{itemAll.length - 4}}</span>
                        </span>
                      </li>
                </ul>
              </div>
            </v-layout>        
        </template>
      </mbl-expand-panel>
    <dia-log 
      :item = "[
        {
          width: '900px',
          model: sharedDialog,
          action: 'saveDialog',
          edit: true,
          label: 'Lưu và thoát',
          icon: 'share'
        }]
      "
      :show_button=true
      @closeDialog="(val) => (sharedDialog = val)"
      @saveDialog="sharedDialogSubmit"
    >
      <template slot="header">
        Chia sẻ thông tin
      </template>
      <template slot="content">
        <v-layout wrap>
          <v-flex xs12 layout class="align-center">
            <div class="voting-number">1</div>
            <span class="text-bold">Chia sẻ trong cơ quan</span>
            <v-checkbox
              class="ml-3 my-0"
              v-model="checkboxModel"
              label="Chia sẻ toàn cơ quan"
            >
            </v-checkbox>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs2>
            <v-subheader class="px-0">Chia sẻ cho đơn vị</v-subheader>
          </v-flex>
          <v-flex xs10>
              <v-select
              v-if="hasPermission || resourcerole.length > 0"
              return-object
              v-bind:items="resourceroles"
              v-model="resourcerole"
              item-text="roleName"
              item-value="roleId"
              placeholder="Chọn tên đơn vị"
              multiple
              chips
              hide-selected
              autocomplete
              @change="resourceroleChangeValue"
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
            <v-alert outline color="error" icon="warning" :value="apistate3 === 2">
                Lỗi cập nhật phân quyền chức vụ!
            </v-alert>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs2>
            <v-subheader class="px-0">Chia sẻ cho cá nhân</v-subheader>
          </v-flex>
          <v-flex xs10>
              <v-select
              v-if="hasPermission || resourceuser.length > 0"
              return-object
              placeholder="Chọn tên cá nhân"
              v-bind:items="resourceusers"
              v-model="resourceuser"
              item-text="fullName"
              item-value="userId"
              multiple
              chips
              hide-selected
              autocomplete
              @change="resourceuserChangeValue"
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
            <v-alert outline color="error" icon="warning" :value="apistate4 === 2">
                Lỗi cập nhật phân quyền người có tài khoản!
            </v-alert>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs12 layout mt-1>
            <div class="voting-number">2</div>
            <span class="text-bold mr-1">Chia sẻ cho người ngoài cơ quan</span> <i>(Hệ thống sẽ gửi link tới email người ngoài cơ quan)</i>
          </v-flex>
          <v-flex xs12>
            <v-select
              v-bind:items="followers"
              v-model="emailModel"
              chips
              tags
              item-text="email"
              item-value="email"
              return-object
              hide-selected
              @input="searchEmail($event)"
              placeholder="Nhập email người được chia sẻ"
              :disabled="!hasPermission"
            >
              <template slot="selection" slot-scope="data">
                <v-chip
                  @input="deleteEmail(data)"
                  class="chip--select-multi"
                  :selected="data.selected"
                  :disabled="data.disabled"
                  :key="JSON.stringify(data.item)"
                  :close=true
                >
                  {{ data.item.email?data.item.email:data.item}}
                </v-chip>
              </template>
            </v-select>
          </v-flex>
        </v-layout>
        <v-alert outline color="error" icon="warning" :value="apistate5 === 2">
            Lỗi cập nhật phân quyền người không có tài khoản!
        </v-alert>
        <v-alert outline color="success" icon="check_circle" :value="apistateok">
          Xác nhận phân quyền thành công!
        </v-alert>
      </template>
    </dia-log>
    <dia-log 
      :item = "[
        {
          width: '700px',
          model: dialog_list_share,
          action: 'saveDialog',
          edit: true,
          label: 'Ghi lại',
          icon: 'save'
        }]
      "
      :show_button='false'
      :show_dialog_header=true
      @closeDialog="(val) => (dialog_list_share = val)"
    >
      <template slot="header">
        Danh sách được chia sẻ
      </template>
      <template slot="content">
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs6 v-for="(item,index) in itemAll" :key="index">
              <span>{{ index + 1 }}</span>. 
              <span v-if="item.fullName != ''">{{ item.fullName }}</span>
              <span v-if="item.fullName == ''">{{ item.email }}</span>
              <span v-if="item.roleName != ''">{{ item.roleName }}</span>
            </v-flex>
          </v-layout>
        </v-container>
      </template>
    </dia-log>
  </div>
  
</template>


<script>
const COMPONENT_NAME = 'jx-mobilink-share'
export default {
  name: COMPONENT_NAME,
  components: {
  },
  props: {
    class_pk: null,
    class_name: null,
    visibilities_api: '',
    resourceworkspace_get_api: null,
    resourceroles_get_api: '',
    resourceusers_get_api: '',
    changelogs_get_api: '',
    permission: null,
    btn_icon: {
      type: Boolean,
      default: false
    },
    only_slot_btn: {
      default: false
    }
  },
  data () {
    return {
      apistateok: false,
      apistate1: 1,
      apistate2: 0,
      apistate3: 0,
      apistate4: 0,
      apistate5: 0,
      sharedDialog: false,
      historyDialog: false,
      sharedVisibility: '2',
      resourceworkspace: [],
      resourceworkspaces: [],
      resourcerole: [],
      resourceroles: [],
      resourceuser: [],
      resourceusers: [],
      resourceusersguest: [],
      resourceusersguests: [],
      changeLogs: [],
      changeLogsPage: 1,
      changeLogsTotal: 0,
      followers: [],
      sharedDialog_hidden_loading: false,
      hasPermission: false,
      emailModel: [],
      count: 0,
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      exampleItems: [],
      exampleModel: '',
      itemAll: [],
      ownExpanded: true,
      dialog_list_share: false,
      checkboxModel: false
    }
  },
  watch: {
    class_pk (val) {
      let vm = this
      vm.hasPermission = 'owner,leader,write,hoster,manager'.indexOf(vm.permission || 'none') >= 0
      const config = {
        headers: {
          'groupId': vm.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      if (vm.resourceusers_get_api != null) {
        vm._initInvitedUser()
      }
      if (vm.visibilities_api != null) {
        window.axios.get(vm.visibilities_api + '/' + vm.class_name + '/' + vm.class_pk, config)
          .then(function (response) {
            let serializable = response.data
            vm.sharedVisibility = serializable.visible + ''
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    'pagination.page': {
      handler () {
        this.getActivity()
      }
    }
  },
  created () {
    let vm = this
    vm.ownExpanded = true
    vm.hasPermission = 'owner,leader,write,hoster,manager'.indexOf(vm.permission || 'none') >= 0
    const config = {
      headers: {
        'groupId': vm.group_id
      }
    }
    vm.$nextTick(function () {
      if (vm.resourceusers_get_api != null) {
        vm._initInvitedUser()
        vm._initInvitedUser_1()
        vm.getVisibilities()
        vm.resourcerole = []
        window.axios.get(vm.resourceroles_get_api + '/' + vm.class_name + '/' + vm.class_pk + '?sort=roleName_String&full=true&roleType=0&start=-1&end=-1', config)
          .then(function (response) {
            let serializable = response.data
            vm.resourceroles = serializable.data
            for (var key in vm.resourceroles) {
              if (vm.resourceroles[key].hasOwnProperty('selected') && vm.resourceroles[key]['selected'] === true) {
                vm.resourcerole.push(vm.resourceroles[key])
              }
            }
            vm.allItems()
          })
          .catch(function (error) {
            console.log(error)
          })
      }
      if (vm.visibilities_api != null) {
        window.axios.get(vm.visibilities_api + '/' + vm.class_name + '/' + vm.class_pk, config)
          .then(function (response) {
            let serializable = response.data
            vm.sharedVisibility = serializable.visible + ''
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    })
  },
  destroyed () {
    // delete this.class_pk
    // delete this.class_name
    // delete this.visibilities_api
    // delete this.resourceworkspace_get_api
    // delete this.resourceroles_get_api
    // delete this.resourceusers_get_api
    // delete this.changelogs_get_api
    // delete this.permission
    // delete this.btn_icon
    // delete this.only_slot_btn
    // delete this.apistateok
    // delete this.apistate1
    // delete this.apistate2
    // delete this.apistate3
    // delete this.apistate4
    // delete this.apistate5
    // delete this.sharedDialog
    // delete this.historyDialog
    // delete this.sharedVisibility
    // delete this.resourceworkspace
    // delete this.resourceworkspaces
    // delete this.resourcerole
    // delete this.resourceroles
    // delete this.resourceuser
    // delete this.resourceusers
    // delete this.resourceusersguest
    // delete this.resourceusersguests
    // delete this.changeLogs
    // delete this.changeLogsPage
    // delete this.changeLogsTotal
    // delete this.followers
    // delete this.sharedDialog_hidden_loading
    // delete this.hasPermission
    // delete this.emailModel
    // delete this.count
    // delete this.rules
    // delete this.exampleItems
    // delete this.exampleModel
    // delete this.itemAll
    // delete this.ownExpanded
    // delete this.dialog_list_share
    // delete this.click_open_lish_share
    // delete this.test
    // delete this.allItems
    // delete this.deleteEmail
    // delete this.searchEmail
    // delete this.getContact
    // delete this._initInvitedUser
    // delete this._initInvitedUser_1
    // delete this.sharedVisibilityChangeValue
    // delete this.resourceworkspaceChangeValue
    // delete this.resourceroleChangeValue
    // delete this.resourceuserChangeValue
    // delete this.resourceusersguestChangeValue
    // delete this.sharedDialogFunc
    // delete this.changePermissionRoleFunc
    // delete this.changePermissionUserFunc
    // delete this.sharedDialogSubmit
  },
  methods: {
    click_open_lish_share () {
      this.dialog_list_share = true
    },
    test (value) {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(value) || false
    },
    allItems () {
      let vm = this
      vm.ownExpanded = true
      vm.itemAll = []
      vm.itemAll = vm.resourceuser.concat(vm.resourcerole)
      vm.itemAll = vm.itemAll.concat(vm.emailModel)
      if (vm.itemAll.length === 0 && !vm.hasPermission) {
        vm.ownExpanded = false
      }
    },
    deleteEmail (data) {
      setTimeout(function () {
        data.parent.selectItem(data.item)
      }, 200)
      this.count = this.count - 1
    },
    searchEmail (event) {
      let vm = this
      this.apistate5 = 1
      setTimeout(function () {
        if (event.length > vm.count) {
          let addEmail = event[event.length - 1]
          if (vm.test(addEmail) !== false) {
            let test = {
              'userId': 0,
              'email': addEmail,
              'fullName': '',
              'userClass': 'guest',
              'right': 0,
              'selected': true,
              'telNo': '',
              'portraitId': '0&img_id_token='
            }
            if (typeof addEmail === 'object') {
              addEmail = addEmail.email
            }
            vm.count = vm.count + 1
            vm.emailModel[event.length - 1] = test
          } else {
            if (typeof addEmail === 'object') {
              addEmail = addEmail.email
              let test1 = {
                'userId': 0,
                'email': addEmail,
                'fullName': '',
                'userClass': 'guest',
                'right': 0,
                'selected': true,
                'telNo': '',
                'portraitId': '0&img_id_token='
              }
              vm.emailModel[event.length - 1] = test1
            } else {
              vm.emailModel.splice(event.length - 1)
              window.showMessageToastr('error', 'Nhập email không đúng')
            }
          }
        }
        return false
      }, 200)
    },
    getContact () {
      let vm = this
      const config = {
        headers: {
          'groupId': vm.group_id
        },
        params: {
          start: -1,
          end: -1,
          sort: 'email_String'
        }
      }
      vm.emailModel = []
      window.axios.get(vm.end_point + 'contacts', config)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.followers = serializable.data
          } else {
            vm.followers = []
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    _initInvitedUser: function () {
      let vm = this
      const config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      vm.emailModel = []
      window.axios.get(vm.resourceusers_get_api + '/' + vm.class_name + '/' + vm.class_pk + '?userClass=guest&selected=true&sort=fullName_String&start=-1&end=-1', config)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            for (var key in serializable.data) {
              if (serializable.data[key].hasOwnProperty('selected') && serializable.data[key]['selected'] === true) {
                vm.emailModel.push(serializable.data[key])
              }
            }
            vm.count = vm.emailModel.length
          } else {
            vm.followers = []
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    _initInvitedUser_1: function () {
      let vm = this
      const config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      vm.resourceuser = []
      window.axios.get(vm.resourceusers_get_api + '/' + vm.class_name + '/' + vm.class_pk + '?full=employee&sort=fullName_String&start=-1&end=-1', config)
        .then(function (response) {
          let serializable = response.data
          vm.resourceusers = serializable.data
          for (var key in vm.resourceusers) {
            if (vm.resourceusers[key].hasOwnProperty('selected') && vm.resourceusers[key]['selected'] === true) {
              vm.resourceuser.push(vm.resourceusers[key])
            }
          }
          vm.$emit('resourceuser', vm.resourceuser, serializable.data)
          vm.allItems()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    sharedVisibilityChangeValue: function (data) {
      this.apistate1 = 1
    },
    resourceworkspaceChangeValue: function (data) {
      this.apistate2 = 1
      console.log(data)
    },
    resourceroleChangeValue: function (data) {
      this.apistate3 = 1
      console.log(data)
    },
    resourceuserChangeValue: function (data) {
      this.apistate4 = 1
      console.log(data)
    },
    resourceusersguestChangeValue: function (data) {
      this.apistate5 = 1
      console.log(data)
    },
    sharedDialogFunc: function () {
      let vm = this
      vm.getContact()
      vm.sharedDialog = true
      vm.apistateok = false
      vm.apistate1 = 1
      vm.apistate2 = 0
      vm.apistate3 = 0
      vm.apistate4 = 0
      vm.apistate5 = 0
      const config = {
        headers: {
          'groupId': vm.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      if (vm.visibilities_api != null) {
        window.axios.get(vm.visibilities_api + '/' + vm.class_name + '/' + vm.class_pk, config)
          .then(function (response) {
            let serializable = response.data
            vm.sharedVisibility = serializable.visible + ''
          })
          .catch(function (error) {
            console.log(error)
          })
      }
      if (vm.resourceworkspace_get_api != null) {
        vm.resourceworkspace = []
        window.axios.get(vm.resourceworkspace_get_api + '/' + vm.class_name + '/' + vm.class_pk + '?sort=workspaceName&full=true&permanent=false', config)
          .then(function (response) {
            let serializable = response.data
            vm.resourceworkspaces = serializable.data
            for (var key in vm.resourceworkspaces) {
              if (vm.resourceworkspaces[key].hasOwnProperty('selected') && vm.resourceworkspaces[key]['selected'] === true) {
                vm.resourceworkspace.push(vm.resourceworkspaces[key])
              }
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
      if (vm.resourceroles_get_api != null) {
        vm.resourcerole = []
        window.axios.get(vm.resourceroles_get_api + '/' + vm.class_name + '/' + vm.class_pk + '?sort=roleName_String&full=true&roleType=0', config)
          .then(function (response) {
            let serializable = response.data
            vm.resourceroles = serializable.data
            for (var key in vm.resourceroles) {
              if (vm.resourceroles[key].hasOwnProperty('selected') && vm.resourceroles[key]['selected'] === true) {
                vm.resourcerole.push(vm.resourceroles[key])
                vm.allItems()
              }
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
      if (vm.resourceusers_get_api != null) {
        vm.resourceuser = []
        vm.resourceusersguest = []
        vm._initInvitedUser_1()
        vm._initInvitedUser()
      }
      vm.allItems()
    },
    changePermissionRoleFunc: function (item) {
      console.log(item)
      if (item.right === this.constantPermissionKey.read) {
        item.right = this.constantPermissionKey.write
      } else {
        item.right = this.constantPermissionKey.read
      }
      this.apistate3 = 1
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
      this.apistate4 = 1
    },
    getVisibilities () {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      let url = vm.end_point + 'visibilities/' + vm.class_name + '/' + vm.class_pk
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
    sharedDialogSubmit: function (event) {
      let vm = this
      let submitAll = []
      setTimeout(function () {
        vm.sharedDialog_hidden_loading = true
        const config = {
          headers: {
            'groupId': vm.group_id,
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Accept': 'application/json'
          }
        }
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Chia sẻ dữ liệu...'
        })
        let params = new URLSearchParams()
        if (vm.checkboxModel === true) {
          params.append('visible', 1)
        } else {
          params.append('visible', 2)
        }
        // params.append('visible', vm.sharedVisibility)
        params.append('className', vm.class_name)
        params.append('classPK', vm.class_pk)
        submitAll.push(
          window.axios.put(vm.visibilities_api + '/' + vm.class_name + '/' + vm.class_pk,
            params,
            config)
            .then(function (response) {
              vm.apistate1 = 1
            })
            .catch(function (error) {
              console.log(error)
              vm.apistate1 = 2
            })
        )
        if (vm.apistate2 > 0) {
          let paramsApi2 = new URLSearchParams()
          paramsApi2.append('workspaces', JSON.stringify(vm.resourceworkspace))
          paramsApi2.append('className', vm.class_name)
          paramsApi2.append('classPK', vm.class_pk)
          submitAll.push(
            window.axios.post(vm.resourceworkspace_get_api + '/update',
              paramsApi2,
              config)
              .then(function (response) {
                vm.apistate2 = 0
              })
              .catch(function (error) {
                console.log(error)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                vm.apistate2 = 2
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
          )
        }
        if (vm.apistate3 > 0) {
          let paramsApi3 = new URLSearchParams()
          paramsApi3.append('roles', JSON.stringify(vm.resourcerole))
          paramsApi3.append('className', vm.class_name)
          paramsApi3.append('classPK', vm.class_pk)
          submitAll.push(
            window.axios.post(vm.resourceroles_get_api + '/update',
              paramsApi3,
              config)
              .then(function (response) {
                vm.apistate3 = 0
              })
              .catch(function (error) {
                console.log(error)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                vm.apistate3 = 2
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
          )
        }
        if (vm.apistate4 > 0) {
          let paramsApi4 = new URLSearchParams()
          paramsApi4.append('users', JSON.stringify(vm.resourceuser))
          paramsApi4.append('className', vm.class_name)
          paramsApi4.append('classPK', vm.class_pk)
          paramsApi4.append('userClass', 'employee')
          submitAll.push(
            window.axios.post(vm.resourceusers_get_api + '/pack',
              paramsApi4,
              config)
              .then(function (response) {
                vm.apistate4 = 0
                vm.apistate5 = 0
                // vm._initInvitedUser()
                vm._initInvitedUser_1()
              })
              .catch(function (error) {
                console.log(error)
                vm.apistate4 = 2
                vm.apistate5 = 2
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
          )
        }
        if (vm.apistate5 > 0) {
          let paramsApi5 = new URLSearchParams()
          paramsApi5.append('users', JSON.stringify(vm.emailModel))
          paramsApi5.append('className', vm.class_name)
          paramsApi5.append('classPK', vm.class_pk)
          // paramsApi5.append('selected', true)
          paramsApi5.append('userClass', 'guest')
          submitAll.push(
            window.axios.post(vm.resourceusers_get_api + '/pack',
              paramsApi5,
              config)
              .then(function (response) {
                vm.apistate5 = 0
                vm._initInvitedUser()
              })
              .catch(function (error) {
                console.log(error)
                vm.apistate5 = 2
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
          )
        }
        window.axios.all(submitAll)
          .then(window.axios.spread(function (apiRespones1, apiRespones2, apiRespones3, apiRespones4, apiRespones5) {
            if (vm.apistate1 === 1 && vm.apistate2 !== 2 && vm.apistate3 !== 2 && vm.apistate4 !== 2 && vm.apistate5 !== 2) {
              vm.apistateok = true
              setTimeout(
                function () {
                  vm.apistateok = false
                  vm.apistate1 = 1
                  vm.apistate2 = 0
                  vm.apistate3 = 0
                  vm.apistate4 = 0
                  vm.apistate5 = 0
                },
                3000)
            }
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageToastr('success', 'Chia sẻ công việc thành công')
            vm.sharedDialog_hidden_loading = false
            return window.Promise.reject()
          }))
          .catch(function (error) {
            console.log(error)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            vm.sharedDialog_hidden_loading = false
          })
        vm.allItems()
      }, 500)
      vm.sharedDialog = false
    }
  }
}
</script>

<style>
/*----- Row Images Followers -----*/
.img-followers {
  margin-left: -10px;
  display: inline-flex;
  display: -webkit-inline-flex;
  list-style: none;
}
.img-followers li img {
  float: left;
  border-radius: 50%;
  border: 2px solid white;
  width: 32px;
  height: 32px;
  margin-right: -10px;
}
.shared-w100 {
  width: 100%;
  text-align: center;
}
.shared_btn {
  border-right: 1px solid #e1e2e1;
  box-shadow: none !important;
  border-top: 1px solid #e1e2e1;
  text-transform: none;
}
.history_btn {
  box-shadow: none !important;
  border-top: 1px solid #e1e2e1;
  text-transform: none;
}
.card.no-shadow {
  box-shadow: none;
  border: 1px solid #e1e2e1;
}
.border-color-lightblue {
  border-color: #dae9f4;
}

.border-bottom {
  border-bottom: 1px solid #e3e3e3;
}

.PB10 {
  padding-bottom: 10px !important;
}

.MB10 {
  margin-bottom: 10px !important;
}

.PL20 {
  padding-left: 20px !important;
}

.PR15 {
  padding-right: 15px !important;
}

.center--pagging {
  display: -webkit-box;
  display: flex;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-justify-content: center;
  justify-content: center;
}
.mobilink-shared-root.editable-wrap.editable-wrap-before-select .input-group--chips label{
      display: block;
}
.mobilink-shared-root.editable-wrap.editable-wrap-before-select .input-group {
      padding-top: 20px;
}
</style>

<style scoped>
    .custome-panel-heading-with-icon {
        display: -webkit-flex; /* Safari */
        -webkit-align-items: center; /* Safari 7.0+ */
        display: flex;
        align-items: center;
    }
    .custome-panel-heading-with-icon div {
       -webkit-flex: 1; /* Safari 6.1+ */
       flex: 1;
    }
</style>