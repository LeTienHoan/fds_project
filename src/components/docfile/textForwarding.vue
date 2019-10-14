<template>
  <div class="">
    <mbl-expand-panel
      :leftactions="[
        {
          icon: 'bookmark_border'
        }
      ]"
      :rightactions="rightactions"
      :ownExpanded = true
      @callback2="callback2"
    >
      <template slot="title-name">
        Chuyển tiếp văn bản
      </template>
      <template slot="card-text-container">
        <div>
          <v-layout wrap v-for="(item, index) in invitationItems" :key="index" v-if="invitationItems.length != 0">
            <v-btn icon 
              @click="changeChecklist(item, index)"
            >
              <v-icon color="primary" v-if="item.checkin === 1" >check_box
              </v-icon>
              <v-icon v-else>check_box_outline_blank
              </v-icon>
            </v-btn>
            <span class="align-center d-flex">
              Chuyển đến {{ item.fullName }} ngày {{ item.createDate | datetime }} bởi {{ item.userName }}
            </span>
            <v-icon @click="deleteInvi(item,index)" v-if="permission !== 'read'" style="margin-left: auto;">clear</v-icon>
          </v-layout>
          <v-layout wrap v-if="invitationItems.length == 0">
            <v-flex xs12 class="text-xs-center" style="color: #ccc">
              <v-icon style="font-size: 26px!important">text_rotation_none</v-icon>
              <br>
              Không có công việc liên quan nào
            </v-flex>
          </v-layout>
        </div>
      </template>
    </mbl-expand-panel>
    <dia-log 
      :item = "[
        {
          width: '700px',
          model: open_dialog,
          action: 'saveDialog1',
          edit: true,
          label: 'Lưu và thoát',
          icon: 'save'
        },
        ]
      "
      :show_button = true
      @closeDialog="(val) => (open_dialog = val)"
      @saveDialog1="sendInvitation"
    >
      <template slot="header">
        Chuyển tiếp văn bản
      </template>
      <template slot="content">
        <v-layout wrap>
          <v-flex xs3>
            <v-select
              v-bind:items="selectItems"
              v-model="selectModel"
              item-text="itemName"
              item-value="itemCode"
              autocomplete
              hide-selected
            >
            </v-select>
          </v-flex>
          <v-flex xs9 class="pl-3">
            <v-select
              v-if="selectModel==1"
              v-bind:items="contactItems"
              v-model="contactModel"
              chips
              tags
              item-text="fullName"
              item-value="contactId"
              return-object
              hide-selected
              placeholder="Chọn cá nhân"
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
              v-if="selectModel==2"
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
        </v-layout>
      </template>
    </dia-log>
  </div>
</template>

<script>
const COMPONENT_NAME = 'jx-mobilink-text-forwarding'
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
  data () {
    return {
      checkboxModel: true,
      rightactions: [],
      selectItems: [
        {'itemCode': 1, 'itemName': 'Cá nhân'},
        {'itemCode': 2, 'itemName': 'Đơn vị'}
      ],
      selectModel: 1,
      contactModel: '',
      hostingItems: [],
      hostingModel: '',
      invitationItems: [],
      open_dialog: false
    }
  },
  computed: {
    contactItems () {
      const USERS = this.$store.getters['user/userItems']
      let vm = this
      let contactItems = []
      vm.contactModel = []
      for (let key in USERS) {
        if (vm.invitationItems.length !== 0) {
          let itemInv = true
          for (let keys in vm.invitationItems) {
            if (USERS[key].userId === vm.invitationItems[keys].toUserId &&
              USERS[key].fullName === vm.invitationItems[keys].fullName) {
              vm.contactModel.push(USERS[key])
              itemInv = false
              break
            }
          }
          if (itemInv) {
            contactItems.push(USERS[key])
          }
        } else {
          contactItems.push(USERS[key])
        }
      }
      return contactItems
    }
  },
  created () {
    let vm = this
    this.$nextTick(function () {
      this.getInvitation()
      if (vm.permission !== 'read') {
        vm.rightactions = [
          {
            icon: 'forward',
            action: 'callback2',
            text: 'Chuyển tiếp'
          }
        ]
      } else {
        vm.rightactions = []
      }
    })
  },
  methods: {
    deleteInvi (item, index) {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      vm.$dialog.confirm('Bạn có chắc chắn muốn thực hiện hành động này không?', {
        html: true,
        loader: true,
        okText: 'Xác nhận',
        cancelText: 'Quay lại',
        animation: 'fade'
      })
        .then((dialog) => {
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Xóa dữ liệu...'
          })
          let url = vm.end_point + 'resourceinvitations/' + item.resourceInvitationId
          window.axios.delete(url, config)
            .then(function (response) {
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              setTimeout(function () {
                vm.getInvitation()
                window.showMessageToastr('success', 'Xóa thành công')
              }, 1000)
            })
            .catch(function (error) {
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageByAPICode(error.response.status, error.response.data)
              console.log(error.response)
            })
          dialog.close()
        })
        .catch((e) => {
          console.log(e)
        })
    },
    changeChecklist (item, index) {
      if (this.permission !== 'read') {
        let vm = this
        let changeCheckin = new URLSearchParams()
        if (item.checkin === 1) {
          changeCheckin.append('checkin', 0)
          vm.invitationItems[index].checkin = 0
        } else {
          changeCheckin.append('checkin', 1)
          vm.invitationItems[index].checkin = 1
        }
        let url = vm.end_point + 'resourceinvitations/' + item.resourceInvitationId
        const configPutInvitation = {
          headers: {
            'groupId': vm.group_id
          }
        }
        window.axios.put(url, changeCheckin, configPutInvitation)
          .then(function (response) {
            window.showMessageToastr('success', 'Cập nhật thành công')
          })
          .catch(function (error) {
            window.showMessageByAPICode(error.response.status, error.response.data)
            console.log(error)
          })
      }
    },
    callback2 () {
      let vm = this
      vm.open_dialog = !vm.open_dialog
      vm.ownExpanded = true
    },
    getInvitation () {
      let vm = this

      let paramsGetInvitation = {
        sort: 'createDate_Number',
        start: -1,
        end: -1
      }
      const configGetInvitation = {
        params: paramsGetInvitation,
        headers: {
          'groupId': vm.group_id
        }
      }
      window.axios.get(vm.end_point + 'resourceinvitations/' + vm.class_name + '/' + vm.class_pk + '?right=0,1', configGetInvitation)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.invitationItems = serializable.data
          } else {
            vm.invitationItems = []
          }
          vm.getWorkingUnit()
        })
        .catch(function (error) {
          console.log(error.response)
        })
    },
    getWorkingUnit: function () {
      let vm = this
      let paramsGetWorkingUnit = {
        roleType: 0,
        full: true,
        start: -1,
        end: -1
      }
      const configGetWorkingUnit = {
        params: paramsGetWorkingUnit,
        headers: {
          'groupId': vm.group_id
        }
      }
      vm.hostingModel = []
      window.axios.get(vm.end_point + 'resourceroles/' + vm.class_name + '/' + vm.class_pk, configGetWorkingUnit)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            for (let key in serializable.data) {
              if (vm.invitationItems.length !== 0) {
                let itemInv = true
                for (let keys in vm.invitationItems) {
                  if (serializable.data[key].roleId === vm.invitationItems[keys].roleId) {
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
        })
        .catch(function (error) {
          console.log(error)
        })
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
        let url = vm.end_point + 'resourceinvitations/pack'
        window.axios.post(url, paramsApi1, config)
          .then(function (response) {
            vm.open_dialog = !vm.open_dialog
            window.showMessageToastr('success', 'Chuyển tiếp thành công')
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
            'fullName': vm.hostingModel[key].roleName
          }
          invitation1.push(invition1)
        }
        let paramsApi2 = new URLSearchParams()
        paramsApi2.append('invitations', JSON.stringify(invitation1))
        paramsApi2.append('className', vm.class_name)
        paramsApi2.append('classPK', vm.class_pk)
        paramsApi2.append('invitationType', 0)
        let url = vm.end_point + 'resourceinvitations/pack'
        window.axios.post(url, paramsApi2, config)
          .then(function (response) {
            vm.open_dialog = !vm.open_dialog
            window.showMessageToastr('success', 'Chuyển tiếp thành công')
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
    deleteHosting (data) {
      setTimeout(function () {
        data.parent.selectItem(data.item)
      }, 200)
    },
    deleteContact (data) {
      setTimeout(function () {
        data.parent.selectItem(data.item)
      }, 200)
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