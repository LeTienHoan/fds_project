<template>
  <div class="jx-mobilink-component-editable control_class">
    <v-layout wrap>
      <v-flex sm12>
        <div class="custome-editable-with-icon">    
          <div class="editable-text" v-if="editable_hidden" style="word-break: break-all;">{{ textToShow  }} <span v-if="show_day_left==true && textDay>0 && date_options.start_end != 3" class="pl-2 text-main-color"><i>(Còn {{ textDay }} ngày)</i></span></div>
            <v-select 
              v-if="!editable_hidden && type  === 'select' && select_options.comp_location != true" 
              v-bind:items="editableSelectItems" 
              v-model="modelInputComponent"
              single-line 
              bottom 
              autocomplete
              :item-text="select_options.key_text" 
              :item-value="select_options.key_value"
              auto autofocus
            >
              <template slot="item" slot-scope="data">
                <template>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="data.item[ select_options.key_text ]"></v-list-tile-title>
                    <v-list-tile-sub-title v-if="select_options.usetemp==true" v-html="data.item[ select_options.key_hint ]"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </template>
              </template>
            </v-select>
            <v-select 
              v-if="!editable_hidden && type  === 'select' && select_options.comp_location == true" 
              v-bind:items="editableSelectItems" 
              v-model="modelInputComponent"
              autocomplete
              :item-text="select_options.key_text" 
              :item-value="select_options.key_value"
              auto autofocus
              hide-selected
              clearable
              return-object
              tags
              @input="changeSelect($event)"
            >
              <template slot="item" slot-scope="data">
                <template>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="data.item[ select_options.key_text ]"></v-list-tile-title>
                    <v-list-tile-sub-title v-if="select_options.usetemp==true" v-html="data.item[ select_options.key_hint ]"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </template>
              </template>
            </v-select>
            <v-select 
              v-if="!editable_hidden && type  === 'multiselect' && multi_select_options.param_update_invi_right2 == true" 
              v-bind:items="editableSelectItems" 
              v-model="modelInputComponent"
              single-line 
              autocomplete
              :item-text="multi_select_options.key_text" 
              :item-value="multi_select_options.key_value"
              hide-selected
              @input="searchSelect($event)"
              return-object
              chips
            >
              <template slot="item" slot-scope="data">
                <template>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="data.item[ multi_select_options.key_text ]"></v-list-tile-title>
                    <v-list-tile-sub-title v-if="multi_select_options.usetemp==true" v-html="data.item[ multi_select_options.key_hint ]"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </template>
              </template>
            </v-select>
            <v-select 
              v-if="!editable_hidden && type  === 'multiselect' && multi_select_options.param_update_invi_right2 != true" 
              v-bind:items="editableSelectItems" 
              v-model="modelInputComponent"
              single-line 
              autocomplete
              :item-text="multi_select_options.key_text" 
              :item-value="multi_select_options.key_value"
              hide-selected
              @input="searchSelect($event)"
              return-object
              multiple
              tags
              chips
            >
              <template slot="selection" slot-scope="data">
              <v-chip
                class="chip--select-multi"
                @input="deleteChip(data)"
                :close="true"
              >
                {{ data.item[multi_select_options.key_text] }}
              </v-chip>
            </template>
              <template slot="item" slot-scope="data">
                <template>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="data.item[ multi_select_options.key_text ]"></v-list-tile-title>
                    <v-list-tile-sub-title v-if="multi_select_options.usetemp==true" v-html="data.item[ multi_select_options.key_hint ]"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </template>
              </template>
            </v-select>
          <v-text-field 
            v-if="!editable_hidden && type  === 'text' && text_options.multiline"
            v-model="modelInputComponent" autofocus
            :rows="text_options.rows"
            multi-line
          ></v-text-field>
          <v-text-field 
            v-model="modelInputComponent" autofocus
            v-if="!editable_hidden && type  === 'text' && !text_options.multiline"
          ></v-text-field>
            <custome-date-time
              v-if="!editable_hidden && type  === 'datetime'" 
              :id="1"
              :datetimevalue="modelInputComponent"
              :format="localeDateProperties.dateTimeMomentPattern"
              appendicon=''
              @syncxxx="(val) => (changeDatetime(val))"
            >
            </custome-date-time>
            <v-menu
              v-if="!editable_hidden && type  === 'datecustom'" 
              ref="menu"
              :close-on-content-click="false"
              v-model="menu"
              :nudge-width="100"
              :nudge-top="appNudgeTop"
              :nudge-left="appNudgeLeft"
              content-class="dateCustom"
            >
              <v-text-field
                slot="activator"
                v-model="modelInputComponent"
                persistent-hint
                label=""
                @blur="date = parseDate(modelInputComponent)"
              ></v-text-field>
              <v-date-picker :locale="language" v-model="date" @input="menu = false"></v-date-picker>
            </v-menu>
            <custome-date-time
              v-if="!editable_hidden && type  === 'date'" 
              :id="2"
              :datetimevalue="modelInputComponent"
              :format="localeDateProperties.dateMomentPattern" :onlydate="true"
              appendicon='' :autocomplate="true"
              @syncxxx="(val) => (changeDate(val))"
            >
            </custome-date-time>
          <v-btn flat icon color="grey darken-1" class="ma-0"
            v-if="editable_hidden && hasPermission"
            @click.stop.prevent="TempleData()" 
            :loading="editable_hidden_loading" 
            :disabled="editable_hidden_loading"
            title="Sửa">
            <v-icon>create</v-icon>
          </v-btn>
          <v-btn flat icon color="success" class="ma-0"
            v-if="!editable_hidden && hasPermission"
            @click.stop.prevent="UpdateEvent()" 
            :loading="editable_hidden_loading" 
            :disabled="editable_hidden_loading" title="Đồng ý ">
            <v-icon>done</v-icon>
          </v-btn>
          
          <v-btn flat icon color="red darken-3" class="ma-0"
            v-if="!editable_hidden && hasPermission"
            @click.stop.prevent="BackEvent()" 
            :loading="editable_hidden_loading" 
            :disabled="editable_hidden_loading" title="Hủy">
            <v-icon>clear</v-icon>
          </v-btn>
        </div>
        
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
  import moment from 'moment'
  let Subtract = require('array-subtract')
  const COMPONENT_NAME = 'custome-editable'
  export default {
    name: COMPONENT_NAME,
    props: {
      type: '',
      select_options: {
        items: [],
        usetemp: false,
        api_get: '',
        init_value: '',
        init_text: '',
        key_value: '',
        key_text: '',
        key_hint: '',
        comp_location: false,
        start_date: '',
        end_date: ''
      },
      multi_select_options: {
        items: [],
        usetemp: false,
        api_get: '',
        api_get_muti_select: '',
        init_value: [],
        init_text: '',
        key_value: '',
        key_text: '',
        key_hint: '',
        param_update_invi: '',
        class_pk: '',
        class_name: '',
        resource: '',
        item_workspace: '',
        param_update_hos: '',
        param_update_workingunit: '',
        param_update_work: '',
        mutiItems: []
      },
      text_options: {
        text: '',
        multiline: false,
        rows: 5
      },
      datetime_options: {
        init_text: '',
        init_value: '',
        end_date: '',
        start_date: '',
        location: ''
      },
      date_options: {
        init_value: '',
        start_end: '',
        start_date: '',
        end_date: ''
      },
      date_custom_options: {
        init_value: ''
      },
      api_update: '',
      key_update: '',
      permission: {
        default: 'none'
      },
      show_day_left: {
        default: false
      },
      post: ''
    },
    watch: {
      date (val) {
        this.modelInputComponent = this.formatDate(this.date)
      },
      api_update (val) {
        this.editable_hidden = true
      },
      permission (val) {
        let hasPermission = 'owner,leader'.indexOf(val || 'none') >= 0
        this.hasPermission = hasPermission
      },
      select_options (val) {
        this.getApi(val)
      }
    },
    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
      textDay () {
        if (!this.show_day_left) {
          return -1
        } else {
          let vm = this
          let endDate = vm.type === 'date' ? vm.date_options.init_value : vm.datetime_options.init_value
          let day = window.moment(new Date())
          let businessDays = 0
          while (day.isSameOrBefore(new Date(endDate), 'day')) {
            if (day.day() !== 0 && day.day() !== 6) businessDays = businessDays + 1
            day.add(1, 'd')
          }
          return businessDays - 1
        }
      },
      textToShow () {
        let vm = this
        let text = ''
        if (vm.type === 'select') {
          text = vm.select_options.init_text
        } else if (vm.type === 'text') {
          text = vm.text_options.text
        } else if (vm.type === 'datetime') {
          if (vm.datetime_options.init_value) {
            text = moment(vm.datetime_options.init_value).format(vm.localeDateProperties.dateTimeMomentPattern)
          } else {
            text = ''
          }
        } else if (vm.type === 'date') {
          if (vm.date_options.init_value) {
            text = moment(vm.date_options.init_value).format(vm.localeDateProperties.dateMomentPattern)
          }
        } else if (vm.type === 'datecustom') {
          if (vm.date_custom_options.init_value) {
            text = moment(vm.date_custom_options.init_value).format(vm.localeDateProperties.dateMomentPattern)
          }
        } else if (vm.type === 'multiselect') {
          text = vm.multi_select_options.resource
        }
        return text
      }
    },
    created () {
      let vm = this
      let hasPermission = 'owner,leader'.indexOf(vm.permission || 'none') >= 0
      vm.hasPermission = hasPermission
      vm.editableConfigApi = {
        headers: {
          'groupId': vm.group_id
        }
      }
      vm.$nextTick(function () {
        if (vm.type === 'select') {
          vm.getApi(vm.select_options)
        } else if (vm.type === 'multiselect') {
          vm.modelInputComponent = []
          vm.getApiMutiSelect(vm.multi_select_options)
        }
      })
    },
    data () {
      return {
        editableSelectItems: [],
        editable_hidden: true,
        editable_hidden_loading: false,
        tempData: '',
        modelInputComponent: '',
        hasPermission: false,
        currentSeclected: 0,
        departmentModel: '',
        date: '',
        menu: false
      }
    },
    methods: {
      formatDate (date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      parseDate (date) {
        if (!date) return null
        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      getApi: function (item) {
        let vm = this
        vm.editableSelectItems = []
        if (item.api_get) {
          window.axios.get(item.api_get, vm.editableConfigApi).then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              if (item.param_update_tag) {
                for (var key in serializable.data) {
                  if (vm.modelInputComponent.length > 0) {
                    let itemTag = true
                    for (var keys in vm.modelInputComponent) {
                      if (serializable.data[key].tag === vm.modelInputComponent[keys].tag) {
                        itemTag = false
                        break
                      }
                    }
                    if (itemTag) {
                      vm.editableSelectItems.push({
                        tag: serializable.data[key].tag,
                        resourceTagId: serializable.data[key].resourceTagId
                      })
                    }
                  } else {
                    vm.editableSelectItems.push({
                      tag: serializable.data[key].tag,
                      resourceTagId: serializable.data[key].resourceTagId
                    })
                  }
                }
              } else {
                vm.editableSelectItems = serializable.data.filter(function (item) {
                  return item.permission !== 'read'
                })
              }
            } else {
              vm.editableSelectItems = []
            }
          })
            .catch(function (error) {
              vm.editableSelectItems = []
              console.log(error)
            })
        } else {
          vm.editableSelectItems = item.items
        }
      },
      getText (data, item) {
        let vm = this
        vm.modelInputComponent = []
        let textshow = ''
        for (var key in data) {
          let list = {}
          let phay = ', '
          if (Number(key) === data.length - 1) {
            phay = ''
          }
          let count = data[key][item.init_text] + phay
          textshow = textshow + count
          list[item.key_value] = data[key][item.init_value]
          list[item.key_text] = data[key][item.init_text]
          vm.modelInputComponent.push(list)
        }
        vm.currentSeclected = vm.modelInputComponent.length
        vm.$emit('get-resource', textshow)
      },
      getApiMutiSelect (item) {
        let vm = this
        if (item.api_get_muti_select) {
          let getParams = {
          }
          if (vm.multi_select_options.param_update_workingunit) {
            getParams = {
              mainWorkingUnit: false
            }
          }
          let config = {
            params: getParams,
            headers: {
              'groupId': vm.group_id
            }
          }
          window.axios.get(item.api_get_muti_select, config).then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              vm.getText(serializable.data, item)
            } else {
              vm.modelInputComponent = []
            }
          })
            .catch(function (error) {
              vm.modelInputComponent = []
              console.log(error)
            })
        } else {
          if (item.item_workspace) {
            vm.getText(item.item_workspace, item)
          }
          if (item.param_update_invi_right2) {
            vm.getText(item.mutiItems, item)
          }
        }
        // vm.getApi(vm.multi_select_options)
      },
      TempleData: function (model) {
        let vm = this
        if (vm.multi_select_options) {
          vm.getApi(vm.multi_select_options)
        }
        if (vm.type === 'select') {
          if (vm.select_options.comp_location === true) {
            vm.modelInputComponent = [{
              location: vm.select_options.init_text,
              locationId: vm.select_options.init_value
            }]
          } else {
            vm.modelInputComponent = vm.select_options.init_value
          }
        } else if (vm.type === 'text') {
          vm.modelInputComponent = vm.text_options.text
        } else if (vm.type === 'datetime') {
          vm.modelInputComponent = vm.datetime_options.init_value
        } else if (vm.type === 'date') {
          vm.modelInputComponent = vm.date_options.init_value
        } else if (vm.type === 'datecustom') {
          if (vm.date_custom_options.init_value) {
            vm.modelInputComponent = window.moment(vm.date_custom_options.init_value).format('DD/MM/YYYY')
          }
        }
        this.editable_hidden = !this.editable_hidden
      },
      BackEvent: function () {
        this.editable_hidden = !this.editable_hidden
      },
      isEmpty (str) {
        return (!str || /^\s*$/.test(str))
      },
      UpdateEvent: function () {
        let vm = this
        vm.editable_hidden_loading = true
        if (vm.type === 'select') {
          if (vm.select_options.comp_location === true) {
            if (vm.isEmpty(vm.modelInputComponent[0])) {
              window.showMessageToastr('error', 'Bạn cần chọn địa điểm')
              vm.editable_hidden_loading = false
            } else {
              if (typeof (vm.modelInputComponent[0]) === 'object') {
                let dataToAPI1 = new URLSearchParams()
                dataToAPI1.append(vm.key_update, vm.modelInputComponent[0].locationId)
                window.axios.put(vm.api_update, dataToAPI1, vm.editableConfigApi).then(function (response) {
                  let serializable = response.data
                  vm.$emit('update-success', serializable)
                  vm.editable_hidden = !vm.editable_hidden
                  vm.editable_hidden_loading = false
                  window.showMessageToastr('success', 'Cập nhật thành công')
                })
                  .catch(function (error) {
                    console.log(error)
                    vm.editable_hidden_loading = false
                    window.showMessageByAPICode(error.response.status, error.response.data)
                  })
              } else {
                let configAddLocation = {
                  headers: {
                    'groupId': vm.group_id
                  }
                }
                let paramsAddLocation = new URLSearchParams()
                paramsAddLocation.append('location', vm.modelInputComponent[0])
                window.axios.post(vm.end_point + 'locations',
                  paramsAddLocation,
                  configAddLocation
                )
                  .then(function (response) {
                    let serializable = response.data
                    window.showMessageToastr('success', 'Thêm địa điểm thành công')
                    let dataToAPI1 = new URLSearchParams()
                    dataToAPI1.append(vm.key_update, serializable.locationId)
                    window.axios.put(vm.api_update, dataToAPI1, vm.editableConfigApi).then(function (response) {
                      let serializable = response.data
                      vm.$emit('update-success', serializable)
                      vm.editable_hidden = !vm.editable_hidden
                      vm.editable_hidden_loading = false
                      window.showMessageToastr('success', 'Cập nhật thành công')
                    })
                      .catch(function (error) {
                        console.log(error)
                        vm.editable_hidden_loading = false
                        window.showMessageByAPICode(error.response.status, error.response.data)
                      })
                  })
                  .catch(function (error) {
                    console.log(error.response)
                    window.showMessageByAPICode(error.response.status, error.response.data)
                  })
              }
            }
          } else {
            let dataToAPI2 = new URLSearchParams()
            dataToAPI2.append(vm.key_update, vm.modelInputComponent === 'undefined' || vm.modelInputComponent === undefined ? '' : vm.modelInputComponent)
            window.axios.put(vm.api_update, dataToAPI2, vm.editableConfigApi).then(function (response) {
              let serializable = response.data
              vm.$emit('update-success', serializable)
              vm.editable_hidden = !vm.editable_hidden
              vm.editable_hidden_loading = false
              window.showMessageToastr('success', 'Cập nhật thành công')
            })
              .catch(function (error) {
                console.log(error)
                vm.editable_hidden_loading = false
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
          }
        } else if (vm.type === 'multiselect') {
          if (vm.multi_select_options.param_update_invi) {
            let invitation = []
            for (var key in vm.modelInputComponent) {
              let invition = {
                'className': vm.multi_select_options.class_name,
                'classPK': vm.multi_select_options.class_pk,
                'invitationType': 2,
                'telNo': vm.modelInputComponent[key].contactTelNo,
                'fullName': vm.modelInputComponent[key].fullName,
                'toUserId': vm.modelInputComponent[key].userId,
                'right': 1
              }
              invitation.push(invition)
            }
            let paramsApi1 = new URLSearchParams()
            paramsApi1.append('invitations', JSON.stringify(invitation))
            paramsApi1.append('className', vm.multi_select_options.class_name)
            paramsApi1.append('classPK', vm.multi_select_options.class_pk)
            paramsApi1.append('invitationType', 2)
            window.axios.post(vm.api_update, paramsApi1, vm.editableConfigApi)
              .then(function (response) {
                let serializable = response.data
                vm.getText(serializable.data, vm.multi_select_options)
                vm.editable_hidden = !vm.editable_hidden
                vm.editable_hidden_loading = false
                vm.$emit('update-success', serializable)
                window.showMessageToastr('success', 'Cập nhật thành công')
              })
              .catch(function (error) {
                window.showMessageByAPICode(error.response.status, error.response.data)
                console.log(error)
              })
          } else if (vm.multi_select_options.param_update_invi_right2) {
            var invitationRight2 = []
            invitationRight2.push({
              'className': vm.multi_select_options.class_name,
              'classPK': vm.multi_select_options.class_pk,
              'invitationType': 6,
              'telNo': vm.modelInputComponent.contactTelNo,
              'fullName': vm.modelInputComponent.fullName,
              'toUserId': vm.modelInputComponent.userId,
              'right': 2
            })
            var paramsApi6 = new URLSearchParams()
            paramsApi6.append('invitations', JSON.stringify(invitationRight2))
            paramsApi6.append('className', vm.multi_select_options.class_name)
            paramsApi6.append('classPK', vm.multi_select_options.class_pk)
            paramsApi6.append('invitationType', 6)
            window.axios.post(vm.api_update, paramsApi6, vm.editableConfigApi)
              .then(function (response) {
                var serializable = response.data
                vm.getText(serializable.data, vm.multi_select_options)
                vm.editable_hidden = !vm.editable_hidden
                vm.editable_hidden_loading = false
                window.showMessageToastr('success', 'Cập nhật thành công')
              })
              .catch(function (error) {
                window.showMessageByAPICode(error.response.status, error.response.data)
                console.log(error)
              })
          } else if (vm.multi_select_options.param_update_work) {
            let workspacesss = []
            for (var key1 in vm.modelInputComponent) {
              let workspace = {
                'className': vm.multi_select_options.class_name,
                'classPK': vm.multi_select_options.class_pk,
                'workspaceId': vm.modelInputComponent[key1].workspaceId,
                'permanent': false
              }
              workspacesss.push(workspace)
            }
            let paramsApi2 = new URLSearchParams()
            paramsApi2.append('workspaces', JSON.stringify(workspacesss))
            paramsApi2.append('className', vm.multi_select_options.class_name)
            paramsApi2.append('classPK', vm.multi_select_options.class_pk)
            window.axios.post(vm.api_update, paramsApi2, vm.editableConfigApi)
              .then(function (response) {
                let serializable = response.data
                vm.getText(serializable.data, vm.multi_select_options)
                vm.editable_hidden = !vm.editable_hidden
                vm.editable_hidden_loading = false
                window.showMessageToastr('success', 'Cập nhật thành công')
              })
              .catch(function (error) {
                window.showMessageByAPICode(error.response.status, error.response.data)
                console.log(error)
              })
          } else if (vm.multi_select_options.param_update_tag) {
            let tagsss = []
            for (var key2 in vm.modelInputComponent) {
              let tag = {
                'className': vm.multi_select_options.class_name,
                'classPK': vm.multi_select_options.class_pk,
                'tag': vm.modelInputComponent[key2].tag
              }
              tagsss.push(tag)
            }
            let paramsApi3 = new URLSearchParams()
            paramsApi3.append('tags', JSON.stringify(tagsss))
            paramsApi3.append('className', vm.multi_select_options.class_name)
            paramsApi3.append('classPK', vm.multi_select_options.class_pk)
            window.axios.post(vm.api_update, paramsApi3, vm.editableConfigApi)
              .then(function (response) {
                let serializable = response.data
                vm.getText(serializable.data, vm.multi_select_options)
                vm.editable_hidden = !vm.editable_hidden
                vm.editable_hidden_loading = false
                window.showMessageToastr('success', 'Cập nhật thành công')
              })
              .catch(function (error) {
                window.showMessageByAPICode(error.response.status, error.response.data)
                console.log(error)
              })
          } else if (vm.multi_select_options.param_update_hos) {
            let workingunitsss = []
            for (var key3 in vm.modelInputComponent) {
              let workingunit = {
                'className': vm.multi_select_options.class_name,
                'classPK': vm.multi_select_options.class_pk,
                'invitationType': 0,
                'roleId': vm.modelInputComponent[key3].roleId,
                'fullName': vm.modelInputComponent[key3].name,
                'right': 3
              }
              workingunitsss.push(workingunit)
            }
            let paramsApi4 = new URLSearchParams()
            paramsApi4.append('invitations', JSON.stringify(workingunitsss))
            paramsApi4.append('className', vm.multi_select_options.class_name)
            paramsApi4.append('classPK', vm.multi_select_options.class_pk)
            paramsApi4.append('invitationType', 0)
            window.axios.post(vm.api_update, paramsApi4, vm.editableConfigApi)
              .then(function (response) {
                let serializable = response.data
                vm.getText(serializable.data, vm.multi_select_options)
                vm.editable_hidden = !vm.editable_hidden
                vm.editable_hidden_loading = false
                vm.$emit('update-success', serializable)
                window.showMessageToastr('success', 'Cập nhật thành công')
              })
              .catch(function (error) {
                window.showMessageByAPICode(error.response.status, error.response.data)
                console.log(error)
              })
          } else if (vm.multi_select_options.param_update_workingunit) {
            let workingunit1 = ''
            for (var key4 in vm.modelInputComponent) {
              let phay = ','
              if (Number(key4) === vm.modelInputComponent.length - 1) {
                phay = ''
              }
              workingunit1 = workingunit1 + vm.modelInputComponent[key4].workingUnitId + phay
            }
            let paramsApi5 = new URLSearchParams()
            paramsApi5.append('workingUnitId', workingunit1)
            window.axios.post(vm.api_update, paramsApi5, vm.editableConfigApi)
              .then(function (response) {
                let serializable = response.data
                vm.getText(serializable.data, vm.multi_select_options)
                vm.editable_hidden = !vm.editable_hidden
                vm.editable_hidden_loading = false
                window.showMessageToastr('success', 'Cập nhật thành công')
              })
              .catch(function (error) {
                window.showMessageByAPICode(error.response.status, error.response.data)
                console.log(error)
              })
          }
        } else {
          let config = {
            headers: {
              'Content-Type': 'text/plain',
              'Accept': 'text/plain'
            }
          }
          if (vm.post === 'post') {
            window.axios.post(vm.api_update, vm.modelInputComponent, config).then(function (response) {
              let serializable = response.data
              vm.$emit('update-success', serializable)
              vm.editable_hidden = !vm.editable_hidden
              vm.editable_hidden_loading = false
              window.showMessageToastr('success', 'Thêm mới thành công')
            })
              .catch(function (error) {
                console.log(error)
                vm.editable_hidden_loading = false
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
          } else if (vm.post === 'put') {
            window.axios.put(vm.api_update, vm.modelInputComponent, config).then(function (response) {
              let serializable = response.data
              vm.$emit('update-success', serializable)
              vm.editable_hidden = !vm.editable_hidden
              vm.editable_hidden_loading = false
              window.showMessageToastr('success', 'Cập nhật thành công')
            })
              .catch(function (error) {
                console.log(error)
                vm.editable_hidden_loading = false
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
          } else {
            let dataToAPI = new URLSearchParams()
            if (vm.type === 'datetime') {
              dataToAPI.append(vm.key_update, moment(vm.modelInputComponent).format('YYYYMMDDHHmm'))
            } else if (vm.type === 'date') {
              dataToAPI.append(vm.key_update, moment(vm.modelInputComponent).format('YYYYMMDD'))
            } else if (vm.type === 'datecustom') {
              let yearMonthDay = ''
              if (vm.modelInputComponent) {
                const [year, month, day] = vm.date.split('-')
                yearMonthDay = `${year}${month}${day}`
              }
              dataToAPI.append(vm.key_update, yearMonthDay)
            } else if (vm.type === 'text') {
              dataToAPI.append(vm.key_update, vm.modelInputComponent)
            }
            window.axios.put(vm.api_update, dataToAPI, vm.editableConfigApi).then(function (response) {
              let serializable = response.data
              vm.$emit('update-success', serializable)
              vm.editable_hidden = !vm.editable_hidden
              vm.editable_hidden_loading = false
              window.showMessageToastr('success', 'Cập nhật thành công')
            })
              .catch(function (error) {
                console.log(error)
                vm.editable_hidden_loading = false
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
          }
        }
      },
      MultiselectUpdate: function () {
        let vm = this
        let arrAdd = vm.sub2array(vm.modelInputComponent, vm.multi_select_options.key_value, vm.init_value, vm.multi_select_options.key_value)
        let arrRemove = vm.sub2array(vm.init_value, vm.multi_select_options.key_value, vm.modelInputComponent, vm.multi_select_options.key_value)
        vm.$emit('multiselect-remove', arrRemove)
        vm.$emit('multiselect-add', arrAdd)
      },
      sub2array (bigArray, keyB, smallArray, keyS) {
        let subtract = new Subtract((itemA, itemB) => { return itemA[keyB] === itemB[keyS] })
        return subtract.sub(bigArray, smallArray)
      },
      changeSelect (event) {
        let vm = this
        vm.modelInputComponent = []
        if (event.length !== 0) {
          vm.modelInputComponent = [event[event.length - 1]]
          // setTimeout(function () {
          //   window.$('.menu__content.menu__content--select').css('display', 'none')
          // }, 300)
        } else {
          vm.modelInputComponent = []
        }
        if (typeof (vm.modelInputComponent[0]) === 'object') {
          let paramsAddLocation = {
            location: vm.modelInputComponent[0].locationId,
            startDate: window.moment(vm.select_options.start_date).format('YYYYMMDD'),
            endDate: window.moment(vm.select_options.end_date).format('YYYYMMDD'),
            activityType: 'EVENT',
            editable: 1
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
                if (vm.select_options.init_value !== 0 && vm.select_options.init_value !== serializable.data[key].locationId) {
                  if ((Date.parse(window.moment(serializable.data[key].startDate).format('MM/DD/YYYY HH:mm')) >= Date.parse(window.moment(vm.select_options.start_date).format('MM/DD/YYYY HH:mm')) && Date.parse(window.moment(serializable.data[key].startDate).format('MM/DD/YYYY HH:mm')) < Date.parse(window.moment(vm.select_options.end_date).format('MM/DD/YYYY HH:mm'))) || (Date.parse(window.moment(serializable.data[key].endDate).format('MM/DD/YYYY HH:mm')) > Date.parse(window.moment(vm.select_options.start_date).format('MM/DD/YYYY HH:mm')) && Date.parse(window.moment(serializable.data[key].endDate).format('MM/DD/YYYY HH:mm')) < Date.parse(window.moment(vm.select_options.end_date).format('MM/DD/YYYY HH:mm')))) {
                    window.showMessageToastr('error', 'Địa điểm này đã được chọn')
                  }
                }
              }
            })
            .catch(function (error) {
              console.log(error.response)
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
        }
      },
      changeDatetime (val) {
        let vm = this
        vm.modelInputComponent = val
        if (vm.datetime_options.location) {
          let timeStart = ''
          let timeEnd = ''
          let paramsAddLocation = new URLSearchParams()
          paramsAddLocation.append('activityType', 'EVENT')
          paramsAddLocation.append('editable', 1)
          paramsAddLocation.append('location', vm.datetime_options.location)
          if (vm.datetime_options.end_date) {
            paramsAddLocation.append('startDate', window.moment(vm.modelInputComponent).format('YYYYMMDD'))
            paramsAddLocation.append('endDate', window.moment(vm.datetime_options.endDate).format('YYYYMMDD'))
            timeStart = vm.modelInputComponent
            timeEnd = vm.datetime_options.end_date
            if (Date.parse(window.moment(timeStart).format('MM/DD/YYYY HH:mm')) >= Date.parse(window.moment(timeEnd).format('MM/DD/YYYY HH:mm'))) {
              window.showMessageToastr('error', 'Chọn ngày kết thúc lớn hơn ngày bắt đầu')
            }
          }
          if (vm.datetime_options.start_date) {
            paramsAddLocation.append('endDate', window.moment(vm.modelInputComponent).format('YYYYMMDD'))
            paramsAddLocation.append('startDate', window.moment(vm.datetime_options.start_date).format('YYYYMMDD'))
            timeStart = vm.datetime_options.start_date
            timeEnd = vm.modelInputComponent
            if (Date.parse(window.moment(timeStart).format('MM/DD/YYYY HH:mm')) >= Date.parse(window.moment(timeEnd).format('MM/DD/YYYY HH:mm'))) {
              window.showMessageToastr('error', 'Chọn ngày kết thúc lớn hơn ngày bắt đầu')
            }
          }
          let configAddLocation = {
            headers: {
              'groupId': vm.group_id
            },
            params: paramsAddLocation
          }
          window.axios.get(vm.end_point + 'activities',
            configAddLocation
          )
            .then(function (response) {
              let serializable = response.data
              for (var key in serializable.data) {
                if (vm.datetime_options.location !== 0 && vm.datetime_options.location !== serializable.data[key].locationId) {
                  if ((Date.parse(window.moment(serializable.data[key].startDate).format('MM/DD/YYYY HH:mm')) >= Date.parse(window.moment(timeStart).format('MM/DD/YYYY HH:mm')) && Date.parse(window.moment(serializable.data[key].startDate).format('MM/DD/YYYY HH:mm')) < Date.parse(window.moment(timeEnd).format('MM/DD/YYYY HH:mm'))) || (Date.parse(window.moment(serializable.data[key].endDate).format('MM/DD/YYYY HH:mm')) > Date.parse(window.moment(timeStart).format('MM/DD/YYYY HH:mm')) && Date.parse(window.moment(serializable.data[key].endDate).format('MM/DD/YYYY HH:mm')) < Date.parse(window.moment(timeEnd).format('MM/DD/YYYY HH:mm')))) {
                    window.showMessageToastr('error', 'Địa điểm này đã được chọn')
                  }
                }
              }
            })
            .catch(function (error) {
              console.log(error.response)
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
        }
      },
      changeDate (val) {
        let vm = this
        vm.modelInputComponent = val
        if (vm.date_options.start_date) {
          if (Date.parse(window.moment(vm.date_options.start_date).format('MM/DD/YYYY')) > Date.parse(window.moment(vm.modelInputComponent).format('MM/DD/YYYY'))) {
            window.showMessageToastr('error', 'Chọn ngày kết thúc lớn hơn ngày bắt đầu')
          }
        }
        if (vm.date_options.end_date) {
          if (Date.parse(window.moment(vm.modelInputComponent).format('MM/DD/YYYY')) > Date.parse(window.moment(vm.date_options.end_date).format('MM/DD/YYYY'))) {
            window.showMessageToastr('error', 'Chọn ngày kết thúc lớn hơn ngày bắt đầu')
          }
        }
      },
      deleteChip (data) {
        let vm = this
        setTimeout(function () {
          data.parent.selectItem(data.item)
          vm.currentSeclected -= 1
        }, 200)
      },
      searchSelect (event) {
        let vm = this
        if (vm.multi_select_options.param_update_tag && event.length > vm.currentSeclected) {
          setTimeout(function () {
            let tagAdd = event[event.length - 1]
            if (typeof tagAdd === 'object') {
              tagAdd = tagAdd.tag
            } else {
              vm.modelInputComponent[vm.modelInputComponent.length - 1] = {'resourceTagId': 0, 'tag': tagAdd}
              vm.getApi(vm.multi_select_options)
            }
          }, 200)
        }
      }
    }
  }
</script>
<style type="text/css" scoped>

  .jx-mobilink-component-editable .editable__content__value {
    white-space: pre-line;
  }
  .custome-editable-with-icon .editable-text{
    min-height: 28px;
    display: flex;
    align-items: center;
  }
  .custome-editable-with-icon {
      display: -webkit-flex; /* Safari */
      -webkit-align-items: center; /* Safari 7.0+ */
      display: flex;
      align-items: center;
  }
  .custome-editable-with-icon div {
     -webkit-flex: 1; /* Safari 6.1+ */
     flex: 1;
  }
  .custome-editable-with-icon .input-group {
    padding: 0;
    display: block;
  }
  .custome-editable-with-icon .input-group__details {
    padding-top: 0;
  }
  .dateCustom{
    min-width:0px!important
  }
</style>
