<template>
  <v-form ref="form" lazy-validation class="form-edit-personal-event">
    <v-layout wrap>
      <v-flex xs12 sm2>
        <v-subheader class="px-0">Tên cuộc họp *</v-subheader>
      </v-flex>
      <v-flex xs12 sm10>
        <v-text-field
          placeholder=""
          v-model="eventName"
          :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
          required
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs12 sm2>
        <v-subheader class="px-0">Ngày bắt đầu </v-subheader>
      </v-flex>
      <v-flex xs12 sm4>
        <custome-date-time
          :id="1"
          :datetimevalue="timeStart"
          @syncxxx="(val) => (timeStart = val)"
        >
        </custome-date-time>
      </v-flex>
      <v-flex xs12 sm2>
        <v-subheader class="px-0 pull-right pr-2">Ngày kết thúc </v-subheader>
      </v-flex>
      <v-flex xs12 sm4>
        <custome-date-time
          :id="2"
          :datetimevalue="timeEnd"
          @syncxxx="(val) => (timeEnd = val)"
        >
        </custome-date-time>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs12 sm2>
        <v-subheader class="px-0">Địa điểm</v-subheader>
      </v-flex>
      <v-flex xs12 sm10>
        <v-select 
          v-bind:items="locationItems" 
          v-model="locationModel"
          return-object
          autocomplete
          item-text="location" 
          item-value="locationId"
          hide-selected
          clearable
          tags
          :rules="[value => typeof (value[0]) != 'undefined' || 'Trường dữ liệu bắt buộc']"
          @input="eventInput($event)"
        >
        </v-select>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs12 sm12>
        <v-radio-group v-model="modelConfirm" row>
          <v-radio v-for="(confirmItem, index) in personalEventConfirmItems"
            :key="'confirm'+index"
            :label="confirmItem.text" :value="confirmItem.value" ></v-radio>
        </v-radio-group>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs12>
        <v-subheader class="px-0">Chia sẻ lịch cá nhân cho: </v-subheader>
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
  </v-form>
</template>

<script>
  const COMPONENT_NAME = 'activity-add-personal-calendar'
  export default {
    name: COMPONENT_NAME,
    props: {
      eventlink: null,
      class_pk: null,
      activity: null
    },
    data () {
      return {
        timeStart: '',
        timeEnd: '',
        eventName: '',
        isFormAdd: true,
        personalEventId: 0,
        locationModel: '',
        modelConfirm: 0,
        resourceusers: [],
        resourceuser: '',
        resourcerole: '',
        resourceroles: []
      }
    },
    computed: {
      locationItems () {
        return this.$store.getters.locationsItems
      }
    },
    created () {
      this.$nextTick(function () {
      })
    },
    methods: {
      eventInput (event) {
        let vm = this
        vm.locationModel = []
        if (event.length !== 0) {
          vm.locationModel = [event[event.length - 1]]
        } else {
          vm.locationModel = []
        }
        if (typeof (vm.locationModel[0]) === 'object') {
          // vm.changeLocation()
        }
      },
      saveAndExit () {
        if (this.$refs.form.validate()) {
          let vm = this
          if (Date.parse(window.moment(vm.timeStart).format('MM/DD/YYYY HH:mm')) >= Date.parse(window.moment(vm.timeEnd).format('MM/DD/YYYY HH:mm'))) {
            window.showMessageToastr('error', 'Chọn lại ngày bắt đầu, ngày kết thúc')
            return 0
          }
          if (typeof (vm.locationModel[0]) === 'object') {
            vm.saveExit()
          } else {
            vm.addLocation(false)
          }
        }
      },
      saveExit () {
        let vm = this
        let params = new URLSearchParams()
        params.append('subject', vm.eventName ? vm.eventName : '')
        params.append('startDate', new Date(vm.timeStart).getTime())
        params.append('endDate', new Date(vm.timeEnd).getTime())
        params.append('location', vm.locationModel[0].locationId ? vm.locationModel[0].locationId : 0)
        params.append('confirm', vm.modelConfirm >= 0 ? vm.modelConfirm : '')
        console.log(params)
        let paramxxx = {
          subject: vm.eventName ? vm.eventName : '',
          startDate: new Date(vm.timeStart).getTime(),
          endDate: new Date(vm.timeEnd).getTime(),
          locationId: vm.locationModel[0].locationId ? vm.locationModel[0].locationId : 0,
          location: vm.locationModel[0].location ? vm.locationModel[0].location : '',
          geolocation: vm.locationModel[0].geolocation ? vm.locationModel[0].geolocation : '',
          confirm: vm.modelConfirm >= 0 ? vm.modelConfirm : ''
        }
        if (vm.isFormAdd) {
          vm.$store.dispatch('personalEvent/createPersonalEvent', paramxxx).then(response => {
            vm.shareUser(response.personalEventId)
            vm.shareRole(response.personalEventId)
            vm.$emit('add-personal-change', response)
            vm.$emit('close-dialog', false)
            window.showMessageToastr('success', 'Thêm mới thành công')
          }, error => {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
        } else {
          paramxxx['personalEventId'] = vm.personalEventId
          vm.$store.dispatch('personalEvent/updatePersonalEvent', paramxxx
          ).then(response => {
            vm.shareUser(response.personalEventId)
            vm.shareRole(response.personalEventId)
            vm.$emit('add-personal-change', response)
            vm.$emit('close-dialog', false)
            window.showMessageToastr('success', 'Cập nhật thành công')
          }, error => {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
        }
      },
      saveAndAddNew () {
        let vm = this
        if (this.$refs.form.validate()) {
          if (Date.parse(window.moment(vm.timeStart).format('MM/DD/YYYY HH:mm')) >= Date.parse(window.moment(vm.timeEnd).format('MM/DD/YYYY HH:mm'))) {
            window.showMessageToastr('error', 'Chọn lại ngày bắt đầu, ngày kết thúc')
            return 0
          }
          if (typeof (vm.locationModel[0]) === 'object') {
            vm.saveNew()
          } else {
            vm.addLocation(true)
          }
        }
      },
      saveNew () {
        let vm = this
        let params = new URLSearchParams()
        params.append('subject', vm.eventName ? vm.eventName : '')
        params.append('startDate', new Date(vm.timeStart).getTime())
        params.append('endDate', new Date(vm.timeEnd).getTime())
        params.append('location', vm.locationModel[0].locationId ? vm.locationModel[0].locationId : 0)
        params.append('confirm', vm.modelConfirm >= 0 ? vm.modelConfirm : '')
        console.log(params)
        let paramxxx = {
          subject: vm.eventName ? vm.eventName : '',
          startDate: new Date(vm.timeStart).getTime(),
          endDate: new Date(vm.timeEnd).getTime(),
          locationId: vm.locationModel[0].locationId ? vm.locationModel[0].locationId : 0,
          location: vm.locationModel[0].location ? vm.locationModel[0].location : '',
          geolocation: vm.locationModel[0].geolocation ? vm.locationModel[0].geolocation : '',
          confirm: vm.modelConfirm >= 0 ? vm.modelConfirm : ''
        }
        if (vm.isFormAdd) {
          vm.$store.dispatch('personalEvent/createPersonalEvent', paramxxx).then(response => {
            vm.$emit('add-personal-change', response)
            vm.shareUser(response.personalEventId)
            vm.shareRole(response.personalEventId)
            vm.$refs.form.reset()
            vm.isFormAdd = true
            window.showMessageToastr('success', 'Thêm mới thành công')
          }, error => {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
        } else {
          paramxxx['personalEventId'] = vm.personalEventId
          vm.$store.dispatch('personalEvent/updatePersonalEvent', paramxxx
          ).then(response => {
            vm.$emit('add-personal-change', response)
            vm.shareUser(response.personalEventId)
            vm.shareRole(response.personalEventId)
            vm.$refs.form.reset()
            window.showMessageToastr('success', 'Cập nhật thành công')
          }, error => {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
        }
      },
      addLocation (item) {
        let vm = this
        if (vm.locationModel[0]) {
          let config = {
            headers: {
              'groupId': this.group_id
            }
          }
          let params = new URLSearchParams()
          params.append('location', vm.locationModel[0])
          window.axios.post(vm.end_point + 'locations',
            params,
            config
          )
            .then(function (response) {
              let serializable = response.data
              let location = [{
                location: serializable.location,
                locationId: serializable.locationId,
                geolocation: serializable.geolocation
              }]
              vm.locationItems.push(location)
              vm.locationModel = location
              // window.showMessageToastr('success', 'Thêm địa điểm thành công')
              if (item === true) {
                vm.saveNew()
              } else {
                vm.saveExit()
              }
            })
            .catch(function (error) {
              console.log(error.response)
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
        } else {
          if (item === true) {
            vm.saveNew()
          } else {
            vm.saveExit()
          }
        }
      },
      deleteEvent () {
        let vm = this
        if (vm.personalEventId !== 0) {
          vm.$dialog.confirm('Bạn muốn xóa sự kiện', {
            html: true,
            loader: true,
            okText: 'Xác nhận',
            cancelText: 'Quay lại',
            animation: 'fade'
          })
            .then(function (dialog) {
              vm.$store.dispatch('loading/setLoading', {
                loading: true,
                message: 'xóa sự kiện...'
              })
              vm.$store.dispatch('personalEvent/deletePersonalEvent', vm.personalEventId
              ).then(response => {
                vm.$emit('add-personal-change', response)
                vm.$emit('close-dialog', false)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageToastr('success', 'Xóa thành công')
              }, error => {
                console.log(error)
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
      initData (startdate, enddate, subject, id, loactionId, confirm) {
        /** HOANLT HERE */
        let vm = this
        if (!id) {
          vm.eventName = ''
          vm.timeStart = startdate
          vm.timeEnd = enddate
          vm.personalEventId = 0
          vm.isFormAdd = true
          vm.locationModel = []
          vm.locationModel[0] = ''
          vm.modelConfirm = 0
        } else {
          vm.locationModel = []
          vm.eventName = subject
          vm.timeStart = startdate
          vm.timeEnd = enddate
          vm.personalEventId = id
          vm.isFormAdd = false
          const locationIndex = vm.locationItems.findIndex(item => item.locationId === loactionId)
          vm.locationModel[0] = locationIndex >= 0 ? vm.locationItems[locationIndex] : ''
          vm.modelConfirm = confirm
        }
        vm.getResourceUsers()
        vm.getResourceRoles()
      },
      getResourceUsers () {
        let vm = this
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        vm.resourceuser = []
        window.axios.get(vm.end_point + 'resourceusers/' + vm.personalEventClassName + '/' + vm.personalEventId + '?full=employee&sort=fullName&start=-1&end=-1', config)
          .then(function (response) {
            let serializable = response.data
            vm.resourceusers = serializable.data
            for (var key in vm.resourceusers) {
              if (vm.resourceusers[key].hasOwnProperty('selected') && vm.resourceusers[key]['selected'] === true) {
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
        window.axios.get(vm.end_point + 'resourceroles/' + vm.personalEventClassName + '/' + vm.personalEventId + '?sort=roleName&full=true&roleType=0&start=-1&end=-1', config)
          .then(function (response) {
            let serializable = response.data
            vm.resourceroles = serializable.data
            for (var key in vm.resourceroles) {
              if (vm.resourceroles[key].hasOwnProperty('selected') && vm.resourceroles[key]['selected'] === true) {
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
      shareUser (id) {
        let vm = this
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        let paramsApi4 = new URLSearchParams()
        paramsApi4.append('users', JSON.stringify(vm.resourceuser))
        paramsApi4.append('className', vm.personalEventClassName)
        paramsApi4.append('classPK', id)
        paramsApi4.append('userClass', 'employee')
        window.axios.post(vm.end_point + 'resourceusers/pack',
          paramsApi4,
          config)
          .then(function (response) {
            vm.getResourceUsers()
            // window.showMessageToastr('success', 'Chia sẻ vùng làm việc thành công')
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
        paramsApi3.append('className', vm.personalEventClassName)
        paramsApi3.append('classPK', id)
        window.axios.post(vm.end_point + 'resourceroles/update',
          paramsApi3,
          config)
          .then(function (response) {
            vm.getResourceRoles()
            // window.showMessageToastr('success', 'Chia sẻ vùng làm việc thành công')
          })
          .catch(function (error) {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$store.dispatch('setLocationsItems')
      })
    }
  }
</script>

<style lang="scss" scoped>

.card__title {
  padding: 0px 16px;
}

</style>

<style lang="scss">

.form-edit-personal-event .radio-group {
  .input-group__input {
    min-height: 25px;
    .radio {
      margin: 0;
    }
  }
  .input-group__details {
    min-height: 0;
  }
}

</style>
