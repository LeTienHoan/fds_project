<template>
  
  <v-form ref="form" lazy-validation>
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
          @syncxxx="(val) => (changeStart(val))"
        >
        </custome-date-time>
      </v-flex>
      <v-flex xs12 sm2>
        <v-subheader class="px-0 pull-right pr-2">Ngày kết thúc </v-subheader>
      </v-flex>
      <v-flex xs12 sm4>
        <custome-date-time
          :id="1"
          :datetimevalue="timeEnd"
          @syncxxx="(val) => (changeEnd(val))"
        >
        </custome-date-time>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs12 sm2>
        <v-subheader class="px-0">Địa điểm họp *</v-subheader>
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
          :rules="[value => !!value || 'Trường dữ liệu bắt buộc', value => typeof (value[0]) != 'undefined' || 'Trường dữ liệu bắt buộc']"
          @input="eventInput($event)"
        >
            <!-- <template slot="no-data">
              <v-spacer></v-spacer>
              <v-btn @click="addLocation" icon><v-icon>add_circle</v-icon></v-btn>
            </template> -->
        </v-select>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs12 sm2>
        <v-subheader class="px-0">Người chủ trì *</v-subheader>
      </v-flex>
      <v-flex xs12 sm4>
        <v-select
          v-bind:items="usersItems"
          v-model="leaderModel"
          clearable
          :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
          item-text="fullName"
          item-value="userId"
          hide-selected
          placeholder="Chọn người chủ trì"
          autocomplete
          :filter="customFilterUser"
        >
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
      <v-flex xs12 sm2>
        <v-subheader class="px-0 pull-right pr-2">Lĩnh vực </v-subheader>
      </v-flex>
      <v-flex xs12 sm4>
        <v-select
          v-bind:items="eventTypeItems"
          v-model="eventTypeModel"
          clearable
          item-text="itemName"
          item-value="itemCode"
          autocomplete
          hide-selected
          placeholder="Chọn lĩnh vực"
        >
        </v-select>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs12 sm2>
        <v-subheader class="px-0">Nội dung </v-subheader>
      </v-flex>
      <v-flex xs12 sm10>
        <v-text-field
          placeholder="Nhập nội dung"
          v-model="contentModel"
          multi-line
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs12 sm2>
        <v-subheader class="px-0">Thư mục </v-subheader>
      </v-flex>
      <v-flex xs12 sm10>
        <v-select
          v-bind:items="workspaceItems"
          v-model="workspaceModel"
          clearable
          item-text="workspaceNamePath"
          item-value="workspaceId"
          autocomplete
          multiple
          hide-selected
          placeholder="Chọn thư mục"
        >
          <template slot="selection" slot-scope="data">
            <v-chip
              :selected="data.selected"
              :disabled="data.disabled"
              :key="JSON.stringify(data.item)"
              close
              class="chip--select-multi"
              @input="deleteClear(data)"
            >
              {{ data.item.workspaceNamePath }}
            </v-chip>
          </template>
        </v-select>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs12 sm2>
      </v-flex>
      <v-flex xs12 sm4 class="d-flex">
        <v-checkbox
          style="float: left;"
          class="py-0 my-0 pr-3"
          v-model="checkboxModel"
          label="Không lưu nháp"
        >
        </v-checkbox>
        <v-checkbox
          style="float: left;"
          class="py-0 my-0"
          v-model="calendarModel"
          label="Nhắc lịch"
        >
        </v-checkbox>
      </v-flex>
      <v-flex xs12 sm6 v-if="calendarModel == true">
        <v-layout wrap>
          <v-select
            class="xs7 flex pr-2"
            v-bind:items="remindItems"
            v-model="remindModel"
          >
          </v-select>
          <v-text-field
            class="xs2 flex pr-2"
            :rules="[value => Number(value) > 0 || 'Bắt buộc nhập số', value => !!value || 'Bắt buộc nhập số']"
            v-model="numberModel"
          ></v-text-field>
          <v-select
            class="xs3 flex"
            v-bind:items="datetimeItems"
            v-model="datetimeModel"
          >
          </v-select>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
  const COMPONENT_NAME = 'activity-add-event'
  export default {
    name: COMPONENT_NAME,
    props: {
      eventlink: null,
      class_pk: null,
      class_name: null,
      source_type: null,
      workspace: null
    },
    data () {
      return {
        eventName: '',
        leaderModel: '',
        timeStart: new Date(),
        timeEnd: window.moment(new Date()).add(30, 'm').toDate(),
        locationItems: [],
        locationModel: '',
        eventTypeItems: [],
        eventTypeModel: '',
        contentModel: '',
        checkboxModel: true,
        calendarModel: false,
        datetimeItems: [
          {text: 'Phút', value: 1},
          {text: 'Giờ', value: 2},
          {text: 'Ngày', value: 3}
        ],
        datetimeModel: 1,
        remindItems: [
          {text: 'Nhắc truớc ngày thực hiện', value: 1},
          {text: 'Nhắc truớc ngày kết thúc', value: 2}
        ],
        remindModel: 1,
        numberModel: 60,
        selectItems: [
          {'assign': 1, 'itemName': 'Cá nhân'},
          {'assign': 2, 'itemName': 'Đơn vị'}
        ],
        workspaceModel: ''
      }
    },
    created () {
      this.$nextTick(function () {
        // this.initGetData()
      })
    },
    destroyed () {
      /** delete this.eventlink
      delete this.class_pk
      delete this.class_name
      delete this.source_type
      delete this.workspace
      delete this.eventName
      delete this.leaderModel
      delete this.timeStart
      delete this.timeEnd
      delete this.locationItems
      delete this.locationModel
      delete this.eventTypeItems
      delete this.eventTypeModel
      delete this.contentModel
      delete this.checkboxModel
      delete this.calendarModel
      delete this.datetimeItems
      delete this.datetimeModel
      delete this.remindItems
      delete this.remindModel
      delete this.numberModel
      delete this.selectItems
      delete this.workspaceModel
      delete this.workspaceItems
      delete this.usersItems
      delete this.initGetData
      delete this.getLocation
      delete this.getEventTypeItems
      delete this.isEmpty
      delete this.saveAndExit
      delete this.saveExit
      delete this.saveAndAddNew
      delete this.saveNew
      delete this.postResourceWorkspace
      delete this.addReminderSubmit
      delete this.addLocation
      delete this.changeStart
      delete this.changeEnd
      delete this.eventInput
      delete this.changeLocation
      delete this.deleteClear */
    },
    computed: {
      workspaceItems () {
        return this.$store.getters['workspace/EVENT_workspaceItems'].filter(function (item) {
          return item.permission !== 'read'
        })
      },
      usersItems () {
        return this.$store.getters['user/userItems']
      }
    },
    methods: {
      initGetData (start, end) {
        let vm = this
        vm.$refs.form.reset()
        vm.workspaceModel = []
        if (vm.workspace !== '') {
          vm.workspaceModel.push(vm.workspace)
        }
        console.log('>>>>>>>>>vm.timeStart', vm.timeStart)
        vm.getEventTypeItems()
        vm.getLocation()
        vm.leaderModel = Number(vm.user_id)
        // vm.eventName = ''
        // vm.locationModel = ''
        // vm.eventTypeModel = ''
        vm.calendarModel = false
        // vm.contentModel = ''
        vm.datetimeModel = 1
        vm.remindModel = 1
        vm.numberModel = 60
        vm.checkboxModel = true
        setTimeout(function () {
          vm.timeStart = start
          vm.timeEnd = end
        }, 100)
      },
      getLocation () {
        let vm = this
        let config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        let url = vm.end_point + 'locations?start=-1&end=-1&sort=location_String'
        window.axios.get(url, config).then(function (response) {
          let serializable = response.data
          vm.locationItems = serializable.data
        })
          .catch(function (error) {
            vm.locationItems = []
            console.log(error)
          })
      },
      getEventTypeItems () {
        let vm = this
        let paramsTypeTask = {
          parent: 'EVENT',
          start: -1,
          end: -1
        }
        let configTypeTask = {
          params: paramsTypeTask,
          headers: {
            'groupId': vm.group_id
          }
        }
        window.axios.get(vm.end_point + 'dictcollections/ACTIVITY_TYPE/dictitems', configTypeTask)
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              vm.eventTypeItems = serializable.data
            } else {
              vm.eventTypeItems = []
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      isEmpty (str) {
        return (!str || /^\s*$/.test(str))
      },
      saveAndExit () {
        if (this.isEmpty(this.locationModel[0])) {
          window.showMessageToastr('error', 'Bạn cần chọn địa điểm')
        } else {
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
        }
      },
      saveExit () {
        let vm = this
        const configPostAddTask = {
          headers: {
            'groupId': vm.group_id
          }
        }
        let startDateEvent = window.moment(vm.timeStart).format('YYYYMMDDHHmm')
        let endDateEvent = window.moment(vm.timeEnd).format('YYYYMMDDHHmm')
        let paramsAddEvent = new URLSearchParams()
        paramsAddEvent.append('isTemplate', false)
        paramsAddEvent.append('activityType', 'EVENT')
        paramsAddEvent.append('activityCat', vm.eventTypeModel ? vm.eventTypeModel : '')
        paramsAddEvent.append('subject', vm.eventName ? vm.eventName : '')
        paramsAddEvent.append('leaderId', vm.leaderModel ? vm.leaderModel : '')
        paramsAddEvent.append('startDate', startDateEvent)
        paramsAddEvent.append('endDate', endDateEvent)
        paramsAddEvent.append('description', vm.contentModel ? vm.contentModel : '')
        paramsAddEvent.append('locationId', vm.locationModel[0].locationId ? vm.locationModel[0].locationId : '')
        if (vm.eventlink === true) {
          paramsAddEvent.append('sourceClassName', vm.class_name)
          paramsAddEvent.append('sourceClassPK', vm.class_pk)
          paramsAddEvent.append('sourceType', vm.source_type)
        }
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Thêm mới dữ liệu...'
        })
        window.axios.post(vm.end_point + 'activities',
          paramsAddEvent,
          configPostAddTask
        )
          .then(function (response) {
            if (vm.calendarModel === true) {
              vm.addReminderSubmit(response.data)
            }
            vm.postResourceWorkspace(response.data)
            if (vm.checkboxModel === true) {
              let config = {
                headers: {
                  'groupId': vm.group_id
                }
              }
              window.showMessageToastr('success', 'Cập nhật thành công')
              let url = vm.end_point + 'visibilities/' + vm.activityClassName + '/' + response.data.activityId
              let paramsPutEditable = new URLSearchParams()
              paramsPutEditable.append('editable', 1)
              window.axios.put(url, paramsPutEditable, config).then(function (response) {
              })
                .catch(function (error) {
                  console.log(error)
                })
            }
            let activityId = response.data.activityId
            if (vm.eventlink !== true) {
              window.location = vm.MSystemConfiguration.configuration.systemurl.eventurl + 'detail/' + activityId
            }
            vm.$emit('call-back-add', false)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          })
          .catch(function (error) {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            console.log(error.response)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      saveAndAddNew () {
        let vm = this
        if (this.isEmpty(this.locationModel[0])) {
          window.showMessageToastr('error', 'Bạn cần chọn địa điểm')
        } else {
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
        }
      },
      saveNew () {
        let vm = this
        const configPostAddEvent = {
          headers: {
            'groupId': vm.group_id
          }
        }
        let startDateEvent = window.moment(vm.timeStart).format('YYYYMMDDHHmm')
        let endDateEvent = window.moment(vm.timeEnd).format('YYYYMMDDHHmm')
        let paramsAddEvent = new URLSearchParams()
        paramsAddEvent.append('isTemplate', false)
        paramsAddEvent.append('activityType', 'EVENT')
        paramsAddEvent.append('activityCat', vm.eventTypeModel ? vm.eventTypeModel : '')
        paramsAddEvent.append('subject', vm.eventName ? vm.eventName : '')
        paramsAddEvent.append('leaderId', vm.leaderModel ? vm.leaderModel : '')
        paramsAddEvent.append('startDate', startDateEvent)
        paramsAddEvent.append('endDate', endDateEvent)
        paramsAddEvent.append('description', vm.contentModel ? vm.contentModel : '')
        paramsAddEvent.append('locationId', vm.locationModel[0].locationId ? vm.locationModel[0].locationId : '')
        if (vm.eventlink === true) {
          paramsAddEvent.append('sourceClassName', vm.class_name)
          paramsAddEvent.append('sourceClassPK', vm.class_pk)
          paramsAddEvent.append('sourceType', vm.source_type)
        }
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Thêm mới dữ liệu...'
        })
        window.axios.post(vm.end_point + 'activities',
          paramsAddEvent,
          configPostAddEvent
        )
          .then(function (response) {
            if (vm.calendarModel === true) {
              vm.addReminderSubmit(response.data)
            }
            vm.postResourceWorkspace(response.data)
            // vm.eventName = ''
            // vm.timeStart = new Date()
            // vm.timeEnd = window.moment(new Date()).add(30, 'm').toDate()
            // vm.eventTypeModel = ''
            // vm.contentModel = ''
            // vm.calendarModel = false
            // vm.datetimeModel = 'Phút'
            // vm.remindModel = 'Nhắc trước ngày thực hiện'
            // vm.numberModel = 60
            // vm.locationModel = ''
            // vm.leaderModel = Number(vm.user_id)
            if (vm.checkboxModel === true) {
              let config = {
                headers: {
                  'groupId': vm.group_id
                }
              }
              window.showMessageToastr('success', 'Cập nhật thành công')
              let url = vm.end_point + 'visibilities/' + vm.activityClassName + '/' + response.data.activityId
              let paramsPutEditable = new URLSearchParams()
              paramsPutEditable.append('editable', 1)
              window.axios.put(url, paramsPutEditable, config).then(function (response) {
              })
                .catch(function (error) {
                  console.log(error)
                })
            }
            vm.checkboxModel = true
            vm.$refs.form.reset()
            setTimeout(function () {
              vm.timeStart = new Date()
              vm.timeEnd = window.moment(new Date()).add(30, 'm').toDate()
            }, 100)
            vm.calendarModel = false
            vm.datetimeModel = 'Phút'
            vm.remindModel = 'Nhắc trước ngày thực hiện'
            vm.numberModel = 60
            vm.leaderModel = Number(vm.user_id)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          })
          .catch(function (error) {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            console.log(error.response)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      postResourceWorkspace (item) {
        let vm = this
        let urlUpdate = vm.end_point + 'resourceworkspaces'
        let config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        if (vm.workspaceModel !== 0) {
          for (vm.key in vm.workspaceModel) {
            let paramsApiP = new URLSearchParams()
            paramsApiP.append('className', vm.activityClassName)
            paramsApiP.append('classPK', item.activityId)
            paramsApiP.append('workspaceId', vm.workspaceModel[vm.key])
            paramsApiP.append('permanent', false)
            window.axios.post(urlUpdate, paramsApiP, config)
              .then(function (response) {
              })
              .catch(function (error) {
                console.log(error)
              })
          }
        }
      },
      addReminderSubmit (item) {
        let vm = this
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        const params = {
          startend: vm.remindModel - 1,
          durationUnit: vm.numberModel,
          durationType: vm.datetimeModel - 1,
          className: vm.activityClassName,
          classPK: item.activityId
        }
        window.axios.post(vm.end_point + 'reminders',
          params, config
        )
          .then(function (response) {
          })
          .catch(function (error) {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      addLocation (item) {
        let vm = this
        let configAddLocation = {
          headers: {
            'groupId': vm.group_id
          }
        }
        let paramsAddLocation = new URLSearchParams()
        paramsAddLocation.append('location', vm.locationModel[0])
        window.axios.post(vm.end_point + 'locations',
          paramsAddLocation,
          configAddLocation
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
            window.showMessageToastr('success', 'Thêm địa điểm thành công')
            if (item === true) {
              vm.saveNew()
              vm.getLocation()
            } else {
              vm.saveExit()
            }
          })
          .catch(function (error) {
            console.log(error.response)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      changeStart (val) {
        let vm = this
        vm.timeStart = val
        if (typeof (vm.locationModel[0]) === 'object') {
          vm.changeLocation()
        }
        if (Date.parse(window.moment(vm.timeStart).format('MM/DD/YYYY HH:mm')) >= Date.parse(window.moment(vm.timeEnd).format('MM/DD/YYYY HH:mm'))) {
          vm.timeEnd = vm.timeStart
          // window.showMessageToastr('error', 'Chọn ngày kết thúc lớn hơn ngày bắt đầu')
        }
      },
      changeEnd (val) {
        let vm = this
        vm.timeEnd = val
        if (typeof (vm.locationModel[0]) === 'object') {
          vm.changeLocation()
        }
        if (Date.parse(window.moment(vm.timeStart).format('MM/DD/YYYY HH:mm')) >= Date.parse(window.moment(vm.timeEnd).format('MM/DD/YYYY HH:mm'))) {
          window.showMessageToastr('error', 'Chọn ngày kết thúc lớn hơn ngày bắt đầu')
        }
      },
      eventInput (event) {
        let vm = this
        if (event[event.length - 1] !== '') {
          vm.locationModel = []
          if (event.length !== 0) {
            vm.locationModel = [event[event.length - 1]]
            // setTimeout(function () {
            //   window.$('.menu__content.menu__content--select.menuable__content__active').css('display', 'none')
            // }, 300)
          } else {
            vm.locationModel = []
          }
          if (typeof (vm.locationModel[0]) === 'object') {
            vm.changeLocation()
          }
        }
      },
      changeLocation () {
        let vm = this
        let paramsAddLocation = {
          location: vm.locationModel[0].locationId,
          startDate: window.moment(vm.timeStart).format('YYYYMMDD'),
          endDate: window.moment(vm.timeEnd).format('YYYYMMDD'),
          activityType: 'EVENT',
          editable: 1,
          start: -1,
          end: -1
        }
        let configAddLocation = {
          params: paramsAddLocation,
          headers: {
            'groupId': vm.group_id
          }
        }
        window.axios.get(vm.end_point + 'activities',
          configAddLocation
        )
          .then(function (response) {
            let serializable = response.data
            for (var key in serializable.data) {
              if ((Date.parse(window.moment(serializable.data[key].startDate).format('MM/DD/YYYY HH:mm')) >= Date.parse(window.moment(vm.timeStart).format('MM/DD/YYYY HH:mm')) && Date.parse(window.moment(serializable.data[key].startDate).format('MM/DD/YYYY HH:mm')) < Date.parse(window.moment(vm.timeEnd).format('MM/DD/YYYY HH:mm'))) || (Date.parse(window.moment(serializable.data[key].endDate).format('MM/DD/YYYY HH:mm')) > Date.parse(window.moment(vm.timeStart).format('MM/DD/YYYY HH:mm')) && Date.parse(window.moment(serializable.data[key].endDate).format('MM/DD/YYYY HH:mm')) < Date.parse(window.moment(vm.timeEnd).format('MM/DD/YYYY HH:mm')))) {
                window.showMessageToastr('error', 'Địa điểm này đã được chọn')
              }
            }
          })
          .catch(function (error) {
            console.log(error.response)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      deleteClear (data) {
        data.parent.selectItem(data.item)
      }
    }
  }
</script>

<style lang="scss" scoped>

.card__title {
  padding: 0px 16px;
}

</style>
