<template>
  <div class="invitationClass">
    <mbl-expand-panel
      :leftactions="[
        {
          icon: 'bookmark_border'
        }
      ]"
      :ownExpanded = true
    >
      <template slot="title-name">
        Thành phần tham dự
        <v-btn slot="actions" icon class="ma-0 right ml-1" @click.stop="clickAddCircleUserNoAcc" title="Mời người ngoài cơ quan" v-if="hasPermission">
          <v-icon style="cursor: pointer;">screen_share</v-icon>
        </v-btn>
        <v-btn slot="actions" icon class="ma-0 right ml-1" @click.stop="clickAddCircle" v-if="showAdd === true && hasPermission" title="Mời trong cơ quan">
          <v-icon style="cursor: pointer;">contacts</v-icon>
        </v-btn>
        <v-btn slot="actions" icon class="ma-0 right ml-1" @click.stop="clickDoNotDisturbOn" v-if="showAdd === false && hasPermission" title="Mời trong cơ quan">
          <v-icon style="cursor: pointer;">contacts</v-icon>
        </v-btn>
        <v-btn slot="actions" icon class="ma-0 right" @click.stop="printListInvitation" title="Tải danh sách" v-if="stateCheckin() === false">
          <v-icon style="cursor: pointer;">print</v-icon>
        </v-btn>
      </template>
      <template slot="card-text-container">
          <v-layout wrap v-if="showAdd == false" class="mt-2">
            <v-flex xs12>
              <v-select
                v-bind:items="selectItems"
                v-model="selectModel"
                item-text="itemName"
                item-value="itemCode"
                autocomplete
                hide-selected
              >
              </v-select>
              <v-select
                v-show="selectModel==1"
                v-bind:items="contactItems"
                v-model="contactModel"
                chips
                tags
                item-text="fullName"
                item-value="userId"
                return-object
                hide-selected
                placeholder="Chọn cá nhân"
                :filter="customFilterUser"
              >
                <template slot="selection" slot-scope="data">
                  <v-chip
                    @input="deleteContact(data)"
                    class="chip--select-multi"
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    :close=true
                  >
                    
                    {{ data.item.fullName?data.item.fullName:data.item}}
                  </v-chip>
                </template>
              </v-select>
              <v-select
                v-show="selectModel==2"
                v-bind:items="hostingItems"
                v-model="hostingModel"
                chips
                tags
                item-text="roleName"
                item-value="roleId"
                return-object
                hide-selected
                placeholder="Chọn đơn vị nhóm"
              >
                <template slot="selection" slot-scope="data">
                  <v-chip
                    @input="deleteHosting(data)"
                    class="chip--select-multi"
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    :close=true
                  >
                    {{ data.item.roleName?data.item.roleName:data.item}}
                  </v-chip>
                </template>
              </v-select>
            </v-flex>
            <v-flex xs12>
              <v-btn class="primary mx-0" small @click="sendInvitation">Mời</v-btn>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-layout wrap v-if="show_invide_workingunit == true">
              <v-select
                class="flex xs12"
                v-bind:items="employeeItems"
                v-model="employeeModel"
                chips
                tags
                item-text="fullName"
                item-value="userId"
                return-object
                hide-selected
                placeholder="Chọn cá nhân trong đơn vị"
                :filter="customFilterUser"
              >
                <template slot="selection" slot-scope="data">
                  <v-chip
                    @input="deleteContact(data)"
                    class="chip--select-multi"
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    :close=true
                  >
                    
                    {{ data.item.fullName?data.item.fullName:data.item}}
                  </v-chip>
                </template>
              </v-select>
              <v-btn @click="postInvitation" class="primary mx-0" small>Mời trong đơn vị</v-btn>
            </v-layout>
          </v-layout>
        <v-layout wrap>
          <v-flex xs12>
            <b class="primary--text">Danh sách đã mời</b>
            <p class="ma-0">{{ countPerson }} cá nhân, {{ countUnit }} đơn vị</p>
          </v-flex>
          <v-flex xs12 class="ready_busy_class">
            <v-layout wrap>
              <v-flex xs6 style="display: flex;">
                <v-icon class="finished">how_to_reg</v-icon> 
                <span class="ml-1">
                  {{ countReady }} sẵn sàng 
                  <div>{{ countCheckin }} có mặt</div>
                </span>
              </v-flex>
              <v-flex xs6 style="display: flex;">
                <v-icon class="overdue">person_add_disabled</v-icon>
                <span class="ml-1">
                  {{ countBusy }} bận
                  <div>{{ countNoCheckin }} vắng mặt</div>
                </span>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-layout class="align-center py-1"
          v-for="(item,index) in invitationItems"
          :key="index"
          >
            <v-icon v-if="item.invitationType == 0" :class="changeColorWorking(item.roleId)" class="mr-1">supervised_user_circle</v-icon>
            <v-icon v-if="item.invitationType == 2 || item.invitationType == 3 || item.invitationType == 4" :class="changeColor(item.available, item.checkin)" class="mr-1">account_circle</v-icon> 
            <span>
              <i v-if="item.invitationType == 4" :title="nameWorkingUnit(item)">{{ item.fullName }}</i>
              <i v-if="item.invitationType == 3" :title="item.fullName">{{ item.fullName }}</i>
              <span v-if="item.invitationType == 0 || item.invitationType == 2" :title="item.fullName">{{ item.fullName }}</span>
            </span>
            <div style="margin-left: auto;" class="d-flex align-center">
              <v-icon v-if="((stateCheckin() == true && item.available == 2) || (stateCheckin() == false && item.checkin == 0)) && item.userNote.length > 0 && item.invitationType !== 0" @click="openComment(item)" class="mr-2 pointer" title="Xem ý kiến">comment</v-icon>
              <v-icon v-if="((stateCheckin() == true && item.available == 2) || (stateCheckin() == false && item.checkin == 0)) && item.userNote.length == 0 && (item.toUserId === Number(user_id) || hasPermission) && item.invitationType !== 0" @click="openComment(item)" class="mr-2 pointer" title="Thêm ý kiến">comment</v-icon>
                <v-select class="xs4 flex ma-0" v-if="item.invitationType != 0 && (item.toUserId === Number(user_id) || hasPermission) && stateCheckin() == true"
                  style="min-width: 95px"
                  v-bind:items="readyItems"
                  v-model="item.available"
                  item-text="ready"
                  item-value="id"
                  hide-selected
                  clearable
                  @input="changeReady(item)"
                >
                </v-select>
              <!-- v-if="item.invitationType != 0 && (item.toUserId === Number(user_id) || hasPermission) && stateCheckin(activity.startend) == false" -->
                <v-select class="xs4 flex ma-0" v-if="item.invitationType != 0 && (hasPermission) && stateCheckin() == false"
                  style="min-width: 95px"
                  v-bind:items="checkinItems"
                  v-model="item.checkin"
                  item-text="checkin"
                  item-value="id"
                  hide-selected
                  @input="changeCheckin(item)"
                >
                </v-select>
            </div>
          </v-layout>
        </v-layout>      
      </template>
    </mbl-expand-panel>
    <dia-log 
      :item = "[
        {
          width: '500px',
          model: dialog_comment,
          action: 'saveDialog',
          edit: true,
          label: 'Ghi lại',
          icon: 'save'
        }]
      "
      :show_button='show_button'
      :show_dialog_header=true
      @closeDialog="(val) => (dialog_comment = val)"
      @saveDialog="submitAddNote()"
    >
      <template slot="header">
        Thêm mới nội dung ý kiến
      </template>
      <template slot="content">
        <v-container grid-list-md>
          <v-layout wrap>
           <!--  <v-flex xs12 v-if="show_text_dialog === true">
              <v-subheader class="px-0">Nhập nội dung</v-subheader>
            </v-flex> -->
            <v-flex xs12>
              <v-text-field v-model="note_text" multi-line class="input-group--placeholder" v-if="show_text_dialog === true"
              ></v-text-field>
              <div v-if="show_text_dialog === false" v-html="note_text"></div>
            </v-flex>
          </v-layout>
        </v-container>
      </template>
    </dia-log>
    <dia-log 
      :item = "[
        {
          width: '700px',
          model: dia_log_user_no_acc,
          action: 'saveDialog1',
          edit: true,
          label: 'Lưu và thoát',
          icon: 'save'
        },
        {
          width: '700px',
          model: dia_log_user_no_acc,
          action: 'saveDialog2',
          edit: true,
          label: 'Lưu và thêm mới',
          icon: 'save'
        }
        ]
      "
      :show_button='true'
      :show_dialog_header=true
      @closeDialog="(val) => (dia_log_user_no_acc = val)"
      @saveDialog1="submitAddUserNoAccExit()"
      @saveDialog2="submitAddUserNoAcc()"
    >
      <template slot="header">
        Mời người ngoài cơ quan
      </template>
      <template slot="content">
        <v-layout wrap>
          <v-flex xs12 class="layout">
            <div class="voting-number">1</div>
            <span class="text-bold" v-if="nameTitle">Thêm người ngoài cơ quan</span>
            <span class="text-bold" v-if="!nameTitle">Sửa người ngoài cơ quan</span>
          </v-flex>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-layout wrap>
              <v-flex xs12 sm3>
                <v-subheader class="px-0">Tên cá nhân *</v-subheader>
              </v-flex>
              <v-flex xs12 sm9>
                <v-text-field
                  placeholder = ''
                  v-model="fullNameCot"
                  clearable
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm3>
                  <v-subheader class="px-0">Email *</v-subheader>
              </v-flex>
              <v-flex xs12 sm9>
                <v-text-field
                  placeholder = ''
                  v-model="emailCot"
                  clearable
                  :rules="[rules.required, rules.email]"
                  required
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm3>
                  <v-subheader class="px-0">Số điện thoại</v-subheader>
              </v-flex>
              <v-flex xs12 sm9>
                <v-text-field
                  placeholder = ''
                  v-model="telNoCot"
                  clearable
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm3>
                <v-subheader class="px-0">Cơ quan/ địa chỉ</v-subheader>
              </v-flex>
              <v-flex xs12 sm9>
                <v-text-field
                  placeholder = ''
                  v-model="companyName"
                  clearable
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
          <v-flex xs12 class="layout mt-1">
            <div class="voting-number">2</div>
            <span class="text-bold">Danh sách người ngoài cơ quan được mời</span>
          </v-flex>
          <v-layout wrap v-for="(item,index) in user_no_accItems" :key="index" class="mt-1">
            <v-icon :class="changeColor(item.available,item.checkin)" class="mr-1">account_circle</v-icon> 
            <span @click="clickUserNoAccc(item,index)" class="pointer">{{ item.fullName }} - {{ item.email }}</span>
            <v-icon style="margin-left: auto;display: flex;" class="pointer red--text text--darken-3" @click="deleteInvi(item,index)" title="Xóa">clear</v-icon>
          </v-layout>
        </v-layout>
      </template>
    </dia-log>
  </div>
  
</template>


<script>
const COMPONENT_NAME = 'jx-mobilink-activity-invitation'
export default {
  name: COMPONENT_NAME,
  components: {
  },
  props: {
    class_pk: null,
    class_name: null,
    permission: null,
    activity: null
  },
  watch: {
    id (val) {
    }
  },
  computed: {
  },
  data () {
    return {
      valid: '',
      ownExpanded: true,
      showAdd: true,
      selectItems: [
        {'itemCode': 1, 'itemName': 'Cá nhân'},
        {'itemCode': 2, 'itemName': 'Đơn vị'}
      ],
      selectModel: 1,
      hostingItems: [],
      hostingModel: '',
      invitationItems: [],
      readyItems: [
        {'id': 1, 'ready': 'Sẵn sàng'},
        {'id': 2, 'ready': 'Bận'}
      ],
      checkinItems: [
        {'id': 1, 'checkin': 'Có mặt'},
        {'id': 0, 'checkin': 'Vắng mặt'}
      ],
      dialog_comment: false,
      note_text: '',
      resourceId: '',
      contactModel: '',
      contactItems: [],
      countReady: 0,
      countBusy: 0,
      countCheckin: 0,
      countNoCheckin: 0,
      countCheckinTg: 0,
      countNoCheckinTg: 0,
      countPerson: 0,
      countUnit: 0,
      userLogin: {},
      employeeItems: [],
      employeeModel: '',
      show_invide_workingunit: false,
      show_telNo: '',
      show_roleId: '',
      show_button: true,
      show_text_dialog: true,
      dia_log_user_no_acc: false,
      fullNameCot: '',
      emailCot: '',
      telNoCot: '',
      companyName: '',
      rules: {
        required: value => !!value || 'Bắt buộc nhập email.',
        counter: value => value.length <= 20 || 'Tối đa 20 ký tự',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Bắt buộc nhập email'
        }
      },
      user_no_accItems: [],
      nameTitle: true,
      repair: false,
      resourceInvitationId: '',
      hasPermission: false
    }
  },
  created () {
    let vm = this
    this.$nextTick(function () {
      vm.hasPermission = 'owner,leader'.indexOf(vm.permission || 'none') >= 0
      vm.getInvitation()
    })
  },
  methods: {
    getUserContact: function () {
      let vm = this
      vm.contactItems = []
      let paramsGetUserContact = {
        'class': 'employee',
        'start': -1,
        'end': -1
      }
      const configGetUserContact = {
        params: paramsGetUserContact,
        headers: {
          'groupId': vm.group_id
        }
      }
      // vm.countPerson = 0
      vm.contactModel = []
      window.axios.get(vm.end_point + 'users', configGetUserContact)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            for (let key in serializable.data) {
              if (vm.invitationItems.length !== 0) {
                let itemInv = true
                for (let keys in vm.invitationItems) {
                  if (serializable.data[key].userId === vm.invitationItems[keys].toUserId && serializable.data[key].fullName === vm.invitationItems[keys].fullName && vm.invitationItems[keys].invitationType === 2 && vm.invitationItems[keys].right === 1) {
                    // vm.countPerson = vm.countPerson + 1
                    vm.contactModel.push(serializable.data[key])
                    itemInv = false
                    break
                  }
                }
                if (itemInv) {
                  vm.contactItems.push(serializable.data[key])
                }
              } else {
                vm.contactItems.push(serializable.data[key])
              }
            }
          } else {
            vm.contactItems = []
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    stateCheckin () {
      let vm = this
      // if (vm.activity.startend === 0) {
      //   return true
      // } else {
      //   return false
      // }
      let date = new Date()
      if (Date.parse(window.moment(vm.activity.startDate).format('MM/DD/YYYY HH:mm')) >= Date.parse(window.moment(date).format('MM/DD/YYYY HH:mm'))) {
        vm.countCheckin = 0
        vm.countNoCheckin = 0
        return true
      } else {
        vm.countCheckin = vm.countCheckinTg
        vm.countNoCheckin = vm.countNoCheckinTg
        return false
      }
    },
    deleteInvi (item, index) {
      let vm = this
      let url = vm.end_point + 'resourceinvitations/' + item.resourceInvitationId
      const config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Xóa dữ liệu...'
      })
      window.axios.delete(url, config)
        .then(function (response) {
          setTimeout(function () {
            vm.getInvitation()
            vm.$refs.form.reset()
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageToastr('success', 'Xóa giấy mời thành công')
          }, 1000)
        })
        .catch(function (error) {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          window.showMessageByAPICode(error.response.status, error.response.data)
          console.log(error.response)
        })
    },
    clickUserNoAccc (item, index) {
      let vm = this
      vm.fullNameCot = item.fullName
      vm.telNoCot = item.telNo
      vm.emailCot = item.email
      vm.companyName = item.companyName
      vm.nameTitle = false
      vm.resourceInvitationId = item.resourceInvitationId
      vm.repair = true
    },
    submitAddUserNoAccExit () {
      let vm = this
      let dataPostInvitation = new URLSearchParams()
      dataPostInvitation.append('invitationType', 2)
      dataPostInvitation.append('className', vm.class_name)
      dataPostInvitation.append('classPK', vm.class_pk)
      dataPostInvitation.append('fullName', vm.fullNameCot)
      dataPostInvitation.append('telNo', vm.telNoCot)
      dataPostInvitation.append('email', vm.emailCot)
      dataPostInvitation.append('right', 0)
      const configPostInvitation = {
        headers: {
          'groupId': vm.group_id
        }
      }
      if (vm.repair === true) {
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Cập nhật dữ liệu...'
        })
        let urlUpdate1 = vm.end_point + 'resourceinvitations/' + vm.resourceInvitationId
        window.axios.put(urlUpdate1, dataPostInvitation, configPostInvitation)
          .then(function (response) {
            setTimeout(function () {
              vm.getInvitation()
              vm.$refs.form.reset()
              vm.dia_log_user_no_acc = false
              window.showMessageToastr('success', 'Cập nhật giấy mời thành công')
            }, 1000)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          })
          .catch(function (error) {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageByAPICode(error.response.status, error.response.data)
            console.log(error.response)
          })
      } else {
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Thêm mới dữ liệu...'
        })
        let urlUpdate = vm.end_point + 'resourceinvitations'
        window.axios.post(urlUpdate, dataPostInvitation, configPostInvitation)
          .then(function (response) {
            setTimeout(function () {
              vm.getInvitation()
              vm.$refs.form.reset()
              vm.dia_log_user_no_acc = false
              window.showMessageToastr('success', 'Thêm giấy mời thành công')
            }, 1000)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          })
          .catch(function (error) {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageByAPICode(error.response.status, error.response.data)
            console.log(error.response)
          })
      }
    },
    submitAddUserNoAcc () {
      let vm = this
      let dataPostInvitation = new URLSearchParams()
      dataPostInvitation.append('invitationType', 2)
      dataPostInvitation.append('className', vm.class_name)
      dataPostInvitation.append('classPK', vm.class_pk)
      dataPostInvitation.append('fullName', vm.fullNameCot)
      dataPostInvitation.append('telNo', vm.telNoCot)
      dataPostInvitation.append('email', vm.emailCot)
      dataPostInvitation.append('right', 0)
      const configPostInvitation = {
        headers: {
          'groupId': vm.group_id
        }
      }
      if (vm.repair === true) {
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Cập nhật dữ liệu...'
        })
        let urlUpdate1 = vm.end_point + 'resourceinvitations/' + vm.resourceInvitationId
        window.axios.put(urlUpdate1, dataPostInvitation, configPostInvitation)
          .then(function (response) {
            setTimeout(function () {
              vm.getInvitation()
              vm.$refs.form.reset()
              window.showMessageToastr('success', 'Cập nhật giấy mời thành công')
            }, 1000)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          })
          .catch(function (error) {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageByAPICode(error.response.status, error.response.data)
            console.log(error.response)
          })
      } else {
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Thêm mới dữ liệu...'
        })
        let urlUpdate = vm.end_point + 'resourceinvitations'
        window.axios.post(urlUpdate, dataPostInvitation, configPostInvitation)
          .then(function (response) {
            setTimeout(function () {
              vm.getInvitation()
              vm.$refs.form.reset()
              window.showMessageToastr('success', 'Thêm giấy mời thành công')
            }, 1000)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          })
          .catch(function (error) {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageByAPICode(error.response.status, error.response.data)
            console.log(error.response)
          })
      }
    },
    clickAddCircleUserNoAcc () {
      let vm = this
      vm.dia_log_user_no_acc = true
      vm.nameTitle = true
      vm.repair = false
      vm.$refs.form.reset()
    },
    nameWorkingUnit (item) {
      let vm = this
      for (var key in vm.invitationItems) {
        if (vm.invitationItems[key].roleId === item.roleId && item.roleId !== 0 && vm.invitationItems[key].invitationType === 0) {
          return vm.invitationItems[key].fullName
        }
      }
    },
    changeColorWorking (roleId) {
      let vm = this
      let ss = 0
      let b = 0
      for (var key in vm.invitationItems) {
        if (vm.stateCheckin() === true) {
          if (vm.invitationItems[key].roleId === roleId && roleId !== 0 && vm.invitationItems[key].available === 1) {
            ss = ss + 1
          } else if (vm.invitationItems[key].roleId === roleId && roleId !== 0 && vm.invitationItems[key].available === 2) {
            b = b + 1
          }
        } else {
          if (vm.invitationItems[key].roleId === roleId && roleId !== 0 && vm.invitationItems[key].checkin === 1) {
            ss = ss + 1
          } else if (vm.invitationItems[key].roleId === roleId && roleId !== 0 && vm.invitationItems[key].checkin === 2) {
            b = b + 1
          }
        }
      }
      if (ss > 0) {
        return 'finished'
      } else if (ss === 0 && b > 0) {
        return 'overdue'
      }
    },
    changeColor (available, checkin) {
      let vm = this
      if (vm.stateCheckin() === true) {
        if (available === 1) {
          return 'finished'
        } else if (available === 2) {
          return 'overdue'
        }
      } else {
        if (checkin === 1) {
          return 'finished'
        } else if (checkin === 0) {
          return 'overdue'
        }
      }
    },
    sendInvitation () {
      let vm = this
      const config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      if (vm.selectModel === 1) {
        let invitation = []
        for (var key1 in vm.contactModel) {
          let invition = {
            'className': vm.class_name,
            'classPK': vm.class_pk,
            'invitationType': 2,
            'telNo': vm.contactModel[key1].contactTelNo,
            'fullName': vm.contactModel[key1].fullName,
            'right': 1
          }
          if (vm.contactModel[key1].userId !== 0) {
            Object.assign(invition, {'toUserId': vm.contactModel[key1].userId})
          } else {
            Object.assign(invition, {'email': vm.contactModel[key1].email})
          }
          invitation.push(invition)
        }
        let paramsApi1 = new URLSearchParams()
        paramsApi1.append('invitations', JSON.stringify(invitation))
        paramsApi1.append('className', vm.class_name)
        paramsApi1.append('classPK', vm.class_pk)
        paramsApi1.append('invitationType', 2)
        paramsApi1.append('right', 1)
        let url = vm.end_point + 'resourceinvitations/pack'
        window.axios.post(url, paramsApi1, config)
          .then(function (response) {
            window.showMessageToastr('success', 'Thêm giấy mời thành công')
          })
          .catch(function (error) {
            window.showMessageByAPICode(error.response.status, error.response.data)
            console.log(error)
          })
      }
      if (vm.selectModel === 2) {
        let invitation1 = []
        for (var key in vm.hostingModel) {
          let invition1 = {
            'className': vm.class_name,
            'classPK': vm.class_pk,
            'invitationType': 0,
            'roleId': vm.hostingModel[key].roleId,
            'fullName': vm.hostingModel[key].roleName,
            'right': 3
          }
          invitation1.push(invition1)
        }
        let paramsApi2 = new URLSearchParams()
        paramsApi2.append('invitations', JSON.stringify(invitation1))
        paramsApi2.append('className', vm.class_name)
        paramsApi2.append('classPK', vm.class_pk)
        paramsApi2.append('invitationType', 0)
        paramsApi2.append('right', 3)
        let url = vm.end_point + 'resourceinvitations/pack'
        window.axios.post(url, paramsApi2, config)
          .then(function (response) {
            window.showMessageToastr('success', 'Thêm giấy mời thành công')
          })
          .catch(function (error) {
            window.showMessageByAPICode(error.response.status, error.response.data)
            console.log(error)
          })
      }
      setTimeout(function () {
        vm.getInvitation()
      }, 1000)
    },
    postInvitation (item) {
      let vm = this
      const config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      let invitation = []
      for (var key in vm.employeeModel) {
        let invition = {
          'className': vm.class_name,
          'classPK': vm.class_pk,
          'invitationType': 3,
          'toUserId': vm.employeeModel[key].userId,
          'fullName': vm.employeeModel[key].fullName,
          'telNo': vm.show_telNo,
          'right': 1,
          'roleId': vm.show_roleId
        }
        invitation.push(invition)
      }
      let paramsApi = new URLSearchParams()
      paramsApi.append('invitations', JSON.stringify(invitation))
      paramsApi.append('className', vm.class_name)
      paramsApi.append('classPK', vm.class_pk)
      paramsApi.append('invitationType', 3)
      let url = vm.end_point + 'resourceinvitations/pack'
      window.axios.post(url, paramsApi, config)
        .then(function (response) {
          window.showMessageToastr('success', 'Mời cá nhân trong đơn vị thành công')
          setTimeout(function () {
            vm.getInvitation()
          }, 1000)
        })
        .catch(function (error) {
          window.showMessageByAPICode(error.response.status, error.response.data)
          console.log(error)
        })
    },
    submitAddNote () {
      let vm = this
      if (vm.note_text !== '') {
        let submitAddNote = new URLSearchParams()
        submitAddNote.append('userNote', vm.note_text)
        let url = vm.end_point + 'resourceinvitations/' + vm.resourceId
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        window.axios.put(url, submitAddNote, config)
          .then(function (response) {
            vm.dialog_comment = false
            window.showMessageToastr('success', 'Thêm nội dung thành công')
            setTimeout(function () {
              vm.getInvitation()
            }, 1000)
          })
          .catch(function (error) {
            window.showMessageByAPICode(error.response.status, error.response.data)
            console.log(error)
          })
      }
    },
    openComment (item) {
      let vm = this
      vm.note_text = item.userNote
      vm.resourceId = item.resourceInvitationId
      vm.dialog_comment = true
      if (item.toUserId === Number(vm.user_id) || vm.hasPermission) {
        vm.show_button = true
        vm.show_text_dialog = true
      } else {
        vm.show_button = false
        vm.show_text_dialog = false
      }
    },
    getInvitation () {
      let vm = this

      let paramsGetInvitation = {
      }
      const configGetInvitation = {
        params: paramsGetInvitation,
        headers: {
          'groupId': vm.group_id
        }
      }
      vm.countReady = 0
      vm.countBusy = 0
      vm.countCheckinTg = 0
      vm.countNoCheckinTg = 0
      vm.countPerson = 0
      vm.countUnit = 0
      // vm.itemInvGroup = []
      vm.user_no_accItems = []
      vm.show_invide_workingunit = false
      window.axios.get(vm.end_point + 'resourceinvitations/' + vm.class_name + '/' + vm.class_pk + '?right=0,1,3&start=-1&end=-1', configGetInvitation)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.invitationItems = serializable.data
            for (var key in serializable.data) {
              if (serializable.data[key].available === 1 && (serializable.data[key].invitationType === 2 || serializable.data[key].invitationType === 3 || serializable.data[key].invitationType === 4)) {
                vm.countReady = vm.countReady + 1
              } else if (serializable.data[key].available === 2 && (serializable.data[key].invitationType === 2 || serializable.data[key].invitationType === 3 || serializable.data[key].invitationType === 4)) {
                vm.countBusy = vm.countBusy + 1
              }
              if (serializable.data[key].checkin === 1 && (serializable.data[key].invitationType === 2 || serializable.data[key].invitationType === 3 || serializable.data[key].invitationType === 4)) {
                vm.countCheckinTg = vm.countCheckinTg + 1
              } else if (serializable.data[key].checkin === 0 && (serializable.data[key].invitationType === 2 || serializable.data[key].invitationType === 3 || serializable.data[key].invitationType === 4)) {
                vm.countNoCheckinTg = vm.countNoCheckinTg + 1
              }
              if (serializable.data[key].invitationType === 2 || serializable.data[key].invitationType === 3 || serializable.data[key].invitationType === 4) {
                vm.countPerson = vm.countPerson + 1
              } else if (serializable.data[key].invitationType === 0) {
                vm.countUnit = vm.countUnit + 1
              }
              if (serializable.data[key].invitationType === 2 && serializable.data[key].toUserId === 0 && serializable.data[key].right === 0) {
                vm.user_no_accItems.push(serializable.data[key])
              }
              // if (serializable.data[key].invitationType === 4) {
              //   vm.itemInvGroup.push(
              //     {
              //       'role': serializable.data[key],
              //       items: []
              //     }
              //   )
              // }
              if (serializable.data[key].invitationType === 4 && serializable.data[key].toUserId === Number(vm.user_id)) {
                vm.show_invide_workingunit = true
                vm.show_telNo = serializable.data[key].telNo
                vm.show_roleId = serializable.data[key].roleId
                vm.getEmployees1(serializable.data[key])
              }
            }
          } else {
            vm.invitationItems = []
          }
          vm.getWorkingUnit()
          vm.getUserContact()
        })
        .catch(function (error) {
          console.log(error.response)
        })
    },
    clickAddCircle () {
      let vm = this
      vm.showAdd = true
      vm.ownExpanded = true
      vm.showAdd = !vm.showAdd
    },
    clickDoNotDisturbOn () {
      let vm = this
      vm.showAdd = false
      vm.ownExpanded = false
      vm.showAdd = !vm.showAdd
    },
    getEmployees1 (item) {
      let vm = this
      let paramsGetEmployee = {
        'clazz': 'employee',
        'role': item.roleId,
        'start': -1,
        'end': -1,
        'sort': 'fullName_String'
      }
      const configGetEmployee = {
        params: paramsGetEmployee,
        headers: {
          'groupId': vm.group_id
        }
      }
      vm.employeeItems = []
      vm.employeeModel = []
      window.axios.get(vm.end_point + 'users', configGetEmployee)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            for (let key in serializable.data) {
              if (vm.invitationItems.length !== 0) {
                let itemInv = true
                for (let keys in vm.invitationItems) {
                  if (serializable.data[key].userId === vm.invitationItems[keys].toUserId && vm.invitationItems[keys].toUserId !== 0 && (vm.invitationItems[keys].invitationType === 3 || vm.invitationItems[keys].invitationType === 4)) {
                    itemInv = false
                    vm.employeeModel.push(serializable.data[key])
                    break
                  }
                }
                if (itemInv) {
                  vm.employeeItems.push(serializable.data[key])
                }
              } else {
                vm.employeeItems.push(
                  serializable.data[key]
                )
              }
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    getWorkingUnit: function () {
      /* console.log('getWorkingUnit') */
      let vm = this
      let paramsGetWorkingUnit = {
        roleType: 0,
        full: true,
        start: -1,
        end: -1,
        sort: 'roleName_String'
      }
      const configGetWorkingUnit = {
        params: paramsGetWorkingUnit,
        headers: {
          'groupId': vm.group_id
        }
      }
      // vm.countUnit = 0
      vm.hostingModel = []
      window.axios.get(vm.end_point + 'resourceroles/' + vm.class_name + '/' + vm.class_pk, configGetWorkingUnit)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            for (let key in serializable.data) {
              if (vm.invitationItems.length !== 0) {
                let itemInv = true
                for (let keys in vm.invitationItems) {
                  if (serializable.data[key].roleId === vm.invitationItems[keys].roleId && vm.invitationItems[keys].invitationType === 0) {
                    // vm.countUnit = vm.countUnit + 1
                    itemInv = false
                    vm.hostingModel.push(serializable.data[key])
                    break
                  }
                }
                if (itemInv) {
                  vm.hostingItems.push(serializable.data[key])
                }
              } else {
                vm.hostingItems.push(serializable.data[key])
              }
            }
          }
          /* console.log(vm) */
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    deleteHosting (data) {
      setTimeout(function () {
        data.parent.selectItem(data.item)
      }, 200)
    },
    deleteContact (data) {
      console.log('>>>>>>>>>.111111', data)
      setTimeout(function () {
        data.parent.selectItem(data.item)
      }, 200)
    },
    changeReady (item) {
      let vm = this
      let changeReady = new URLSearchParams()
      if (item.available === 1) {
        changeReady.append('available', 1)
      } else if (item.available === 2) {
        changeReady.append('available', 2)
        // vm.dialog_comment = true
        vm.openComment(item)
      } else {
        changeReady.append('available', 0)
      }
      let url = vm.end_point + 'resourceinvitations/' + item.resourceInvitationId
      const configPutInvitation = {
        headers: {
          'groupId': vm.group_id
        }
      }
      window.axios.put(url, changeReady, configPutInvitation)
        .then(function (response) {
          setTimeout(function () {
            vm.getInvitation()
          }, 1000)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    changeCheckin (item) {
      let vm = this
      let changeCheckin = new URLSearchParams()
      if (item.checkin === 1) {
        changeCheckin.append('checkin', true)
      } else {
        changeCheckin.append('checkin', false)
      }
      let url = vm.end_point + 'resourceinvitations/' + item.resourceInvitationId
      const configPutInvitation = {
        headers: {
          'groupId': vm.group_id
        }
      }
      window.axios.put(url, changeCheckin, configPutInvitation)
        .then(function (response) {
          setTimeout(function () {
            vm.getInvitation()
          }, 1000)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    printListInvitation () {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id,
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/octet-stream'
        },
        responseType: 'blob'
      }
      let url = vm.end_point + 'resourceinvitations/' + vm.activityClassName + '/' + vm.class_pk + '/export'
      window.axios.get(url, config).then(function (response) {
        let filename
        let disposition = response.headers['content-disposition'].slice(response.headers['content-disposition'].indexOf('filename='))
        let filenameRegex = /filename[^;=\n]*=(UTF-8(['"]*))?(.*)/
        let matches = filenameRegex.exec(disposition)
        filename = matches[3].replace(/['"]/g, '')
        // let a = document.createElement('a')
        // document.body.appendChild(a)
        // a.style = 'display: none'
        // let test = window.URL.createObjectURL(response.data)
        // a.href = test
        // a.download = filename
        // a.click()
        // window.URL.revokeObjectURL(test)
        let blob = new Blob([response.data], { type: response.headers['content-type'] })
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(blob, filename)
        } else {
          let URL = window.URL || window.webkitURL
          let downloadUrl = URL.createObjectURL(blob)
          if (filename) {
            let a = document.createElement('a')
            if (typeof a.download === 'undefined') {
              window.location = downloadUrl
            } else {
              a.href = downloadUrl
              a.download = filename
              document.body.appendChild(a)
              a.click()
            }
          } else {
            window.location = downloadUrl
          }
          setTimeout(function () { URL.revokeObjectURL(downloadUrl) }, 100)
        }
        // let blob = new Blob([response], { type: response.headers['content-type'] })
        // let URL = window.URL || window.webkitURL
        // let downloadUrl = URL.createObjectURL(blob)
        // let a = document.createElement('a')
        // document.body.appendChild(a)
        // a.style = 'display: none'
        // a.href = window
        // a.download = filename
        // a.click()
        // window.URL.revokeObjectURL(downloadUrl)
      })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<style >
  .ready_busy_class {
    padding: 10px 0px;
    border-top: 1px solid #939393;
    border-bottom: 1px solid #939393;
    margin: 10px 0px 5px 0px;
  }
  .ready_busy_class i{
    font-size: 30px!important;
  }
</style>