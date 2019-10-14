<template>
  <v-form ref="form" lazy-validation>
    <v-layout wrap>
      <v-flex xs12 sm2>
        <v-subheader class="px-0">Tên công việc *</v-subheader>
      </v-flex>
      <v-flex xs12 sm10>
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
        <v-subheader class="px-0">Thời gian bắt đầu </v-subheader>
      </v-flex>
      <v-flex xs12 sm4>
        <custome-date-time
          :id="1"
          :datetimevalue="timeStart"
          autocomplate
          :format="localeDateProperties.dateMomentPattern"
          :onlydate="true"
          @syncxxx="(val) => (changeStart(val))"
        >
        </custome-date-time>
      </v-flex>
      <v-flex xs12 sm2>
        <v-subheader class="px-0 pull-right pr-2">Hạn hoàn thành </v-subheader>
      </v-flex>
      <v-flex xs12 sm4>
        <custome-date-time
          :id="2"
          :datetimevalue="timeEnd"
          autocomplate
          :format="localeDateProperties.dateMomentPattern"
          :onlydate="true"
          @syncxxx="(val) => (changeEnd(val))"
        >
        </custome-date-time>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs12 sm2>
        <v-subheader class="px-0">Người giao việc *</v-subheader>
      </v-flex>
      <v-flex xs12 sm4>
        <v-select
          v-bind:items="leaderUsersItems"
          v-model="leaderModel"
          clearable
          placeholder="Chọn người giao việc"
          item-text="fullName"
          item-value="userId"
          autocomplete
          hide-selected
          :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
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
        <v-subheader class="px-0 pull-right pr-2">Nguồn giao việc </v-subheader>
      </v-flex>
      <v-flex xs12 sm4>
        <v-select
          v-bind:items="sourceItems"
          v-model="sourceModel"
          clearable
          item-text="itemName"
          item-value="itemCode"
          placeholder="Chọn nguồn giao việc"
          autocomplete
          hide-selected
        >
        </v-select>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs2>
        <v-subheader class="px-0">Giao cho *</v-subheader>
      </v-flex>
      <v-flex xs2 pr-2>
        <v-select
          v-bind:items="selectItems"
          v-model="selectModel"
          item-text="itemName"
          item-value="assign"
          autocomplete
          hide-selected
        >
        </v-select>
      </v-flex>
      <v-flex xs8>
        <v-layout wrap>
          <v-flex xs4 pr-2>
              <v-select
                v-bind:items="usersItems"
                v-model="managerModel"
                clearable
                placeholder="Chọn người phụ trách"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                item-text="fullName"
                item-value="userId"
                autocomplete
                hide-selected
                @input="selectClick111"
                v-if="selectModel == 1"
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
          <v-flex xs8>
              <v-select
                v-bind:items="usersCombinationItems"
                v-model="usersCombinationModel"
                placeholder="Chọn tên người phối hợp"
                item-text="fullName"
                item-value="userId"
                multiple
                chips
                autocomplete
                hide-selected
                return-object
                @input="selectClick"
                v-if="selectModel == 1"
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
          <v-flex xs4 pr-2>
              <v-select
                v-if="selectModel == 2"
                v-bind:items="hostingItems"
                v-model="hostingModel"
                clearable
                placeholder="Chọn đơn vị phụ trách"
                item-text="name"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                item-value="workingUnitId"
                autocomplete
                hide-selected
                @input="selectClick111"
              >
              </v-select>
          </v-flex>
          <v-flex xs8>
              <v-select
                v-if="selectModel == 2"
                v-bind:items="hostingCombinationItems"
                v-model="hostingCombinationModel"
                clearable
                placeholder="Chọn tên đơn vị phối hợp"
                item-text="name"
                item-value="workingUnitId"
                multiple
                chips
                autocomplete
                hide-selected
                return-object
                @input="selectClick"
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
                    {{ data.item.name }}
                  </v-chip>
                </template>
              </v-select>
          </v-flex>
        </v-layout>
        <!-- <v-layout wrap v-if="selectModel == 3">
          <v-flex xs4 pr-2>
            <v-select
              v-bind:items="jobposItems"
              v-model="jobposModel"
              clearable
              placeholder="Chọn nhóm phụ trách"
              item-text="title"
              item-value="jobPosId"
              autocomplete
              hide-selected
              @input="selectClick111"
            >
            </v-select>
          </v-flex>
          <v-flex xs8>
            <v-select
              v-bind:items="jobposCombinationItems"
              v-model="jobposCombinationModel"
              clearable
              placeholder="Chọn tên nhóm phối họp"
              item-text="title"
              item-value="jobPosId"
              multiple
              chips
              autocomplete
              hide-selected
              return-object
              @input="selectClick"
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
                  {{ data.item.title }}
                </v-chip>
              </template>
            </v-select>
          </v-flex>
        </v-layout> -->
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs12 sm2>
        <v-subheader class="px-0">Lĩnh vực </v-subheader>
      </v-flex>
      <v-flex xs12 sm4>
        <v-select
          v-bind:items="taskTypeItems"
          v-model="taskTypeModel"
          clearable
          item-text="itemName"
          item-value="itemCode"
          placeholder="Chọn lĩnh vực"
          autocomplete
          hide-selected
        >
        </v-select>
      </v-flex>
      <v-flex xs12 sm2>
        <v-subheader class="px-0 pull-right pr-2">Mức độ </v-subheader>
      </v-flex>
      <v-flex xs12 sm4>
        <v-select
          v-bind:items="priorityItems"
          v-model="priorityModel"
          item-text="itemName"
          item-value="itemCode"
          autocomplete
          placeholder="Chọn mức độ"
          hide-selected
          clearable
        ></v-select>
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
          placeholder="Chọn thư mục"
          hide-selected
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
            item-text="text"
            item-value="value"
          >
          </v-select>
          <v-text-field
            class="xs2 flex pr-2"
            :rules="[value => Number(value) > 0 || 'Bắt buộc nhập số', value => !!value || 'Trường dữ liệu bắt buộc']"
            v-model="numberModel"
          ></v-text-field>
          <v-select
            class="xs3 flex"
            v-bind:items="datetimeItems"
            v-model="datetimeModel"
            item-text="text"
            item-value="value"
          >
          </v-select>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
  const COMPONENT_NAME = 'activity-add-task'
  export default {
    name: COMPONENT_NAME,
    props: {
      workspace: null
    },
    data () {
      return {
        taskName: '',
        timeStart: new Date(),
        timeEnd: new Date(),
        usersItems: [],
        leaderModel: '',
        managerModel: '',
        hostingItems: [],
        hostingModel: '',
        hostingCombinationModel: [],
        hostingCombinationItems: [],
        sourceItems: [],
        sourceModel: '',
        taskTypeItems: [],
        taskTypeModel: '',
        priorityItems: [
          {'itemCode': 0, 'itemName': 'Thường'},
          {'itemCode': 1, 'itemName': 'Cao'},
          {'itemCode': 2, 'itemName': 'Khẩn'}
        ],
        priorityModel: '',
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
        selectModel: '',
        usersCombinationModel: [],
        usersCombinationItems: [],
        jobposItems: [],
        jobposModel: '',
        leaderUsersItems: [],
        test: '',
        key: '',
        hostingItemsAll: [],
        workspaceModel: ''
      }
    },
    created () {
      this.$nextTick(function () {
        // this.initGetData()
      })
    },
    destroyed () {
      // delete this.workspace
      // delete this.timeStart
      // delete this.timeEnd
      // delete this.usersItems
      // delete this.leaderModel
      // delete this.managerModel
      // delete this.hostingItems
      // delete this.hostingModel
      // delete this.hostingCombinationModel
      // delete this.hostingCombinationItems
      // delete this.taskTypeItems
      // delete this.taskTypeModel
      // delete this.priorityItems
      // delete this.priorityModel
      // delete this.contentModel
      // delete this.checkboxModel
      // delete this.calendarModel
      // delete this.datetimeItems
      // delete this.datetimeModel
      // delete this.remindModel
      // delete this.selectModel
      // delete this.usersCombinationModel
      // delete this.usersCombinationItems
      // delete this.jobposItems
      // delete this.jobposModel
      // delete this.leaderUsersItems
      // delete this.test
      // delete this.key
      // delete this.hostingItemsAll
      // delete this.workspaceModel
      // delete this.workspaceItems
      // delete this.deleteClear
      // delete this.initGetData
      // delete this.selectClick
      // delete this.selectClick111
      // delete this.getUsersItems
      // delete this.getHostingItems
      // delete this.getJobposItems
      // delete this.getTaskTypeItems
      // delete this.addReminderSubmit
      // delete this.saveAndExit
      // delete this.saveAndAddNew
      // delete this.postInvitation
      // delete this.postResourceWorkspace
      // delete this.changeStart
      // delete this.changeEnd
    },
    computed: {
      workspaceItems () {
        return this.$store.getters['workspace/TASK_workspaceItems'].filter(function (item) {
          return item.permission !== 'read'
        })
      }
    },
    methods: {
      deleteClear (data) {
        let vm = this
        setTimeout(function () {
          data.parent.selectItem(data.item)
          if (vm.selectModel === 1) {
            vm.usersItems.push(data.item)
          } else if (vm.selectModel === 2) {
            vm.hostingItems.push(data.item)
          } else if (vm.selectModel === 3) {
            vm.jobposItems.push(data.item)
          }
        }, 200)
      },
      initGetData () {
        let vm = this
        vm.workspaceModel = []
        if (vm.workspace !== '') {
          vm.workspaceModel.push(vm.workspace.workspaceId)
        }
        vm.$refs.form.reset()
        setTimeout(function () {
          vm.timeStart = new Date()
          vm.timeEnd = new Date()
        }, 100)
        // vm.taskName = ''
        // vm.managerModel = ''
        // vm.hostingModel = ''
        // vm.hostingCombinationModel = []
        // vm.taskTypeModel = ''
        // vm.priorityModel = ''
        // vm.contentModel = ''
        vm.calendarModel = false
        vm.datetimeModel = 1
        vm.remindModel = 1
        vm.numberModel = 60
        // vm.usersCombinationModel = []
        // vm.jobposModel = ''
        // vm.selectModel = ''
        vm.checkboxModel = true
        vm.getUsersItems()
        vm.getHostingItems()
        // vm.getJobposItems()
        vm.getTaskTypeItems()
        vm.getSourceItems()
        vm.selectModel = 1
        vm.leaderModel = Number(vm.user_id)
      },
      selectClick () {
        let vm = this
        let item = []
        let keys = ''
        vm.key = 0
        if (vm.selectModel === 1) {
          for (vm.key in vm.usersItems) {
            if (vm.usersCombinationModel.length !== 0) {
              let itemInv = true
              for (keys in vm.usersCombinationModel) {
                if (vm.usersItems[vm.key].userId === vm.usersCombinationModel[keys].userId) {
                  itemInv = false
                }
              }
              if (itemInv) {
                item.push(vm.usersItems[vm.key])
              }
            } else {
              item.push(vm.usersItems[vm.key])
            }
          }
          vm.usersItems = item
        } else if (vm.selectModel === 2) {
          for (vm.key in vm.hostingItems) {
            if (vm.hostingCombinationModel.length !== 0) {
              let itemInv1 = true
              for (keys in vm.hostingCombinationModel) {
                if (vm.hostingItems[vm.key].workingUnitId === vm.hostingCombinationModel[keys].workingUnitId) {
                  itemInv1 = false
                }
              }
              if (itemInv1) {
                item.push(vm.hostingItems[vm.key])
              }
            } else {
              item.push(vm.hostingItems[vm.key])
            }
          }
          vm.hostingItems = item
        }
        // for (vm.key in vm.jobposItems) {
        //   if (vm.jobposCombinationModel.length !== 0) {
        //     let itemInv2 = true
        //     for (keys in vm.jobposCombinationModel) {
        //       if (vm.jobposItems[vm.key].jobPosId === vm.jobposCombinationModel[keys].jobPosId) {
        //         itemInv2 = false
        //       }
        //     }
        //     if (itemInv2) {
        //       item.push(vm.jobposItems[vm.key])
        //     }
        //   } else {
        //     item.push(vm.jobposItems[vm.key])
        //   }
        // }
        // vm.jobposItems = item
        // }
      },
      selectClick111 () {
        let vm = this
        let item = []
        vm.key = 0
        if (vm.test !== '') {
          item.push(vm.test)
        }
        if (vm.selectModel === 1) {
          for (vm.key in vm.usersCombinationItems) {
            let itemInv = true
            if (vm.usersCombinationItems[vm.key].userId === vm.managerModel) {
              itemInv = false
              vm.test = vm.usersCombinationItems[vm.key]
            }
            if (itemInv) {
              item.push(vm.usersCombinationItems[vm.key])
            }
          }
          vm.usersCombinationItems = item
        } else if (vm.selectModel === 2) {
          for (vm.key in vm.hostingCombinationItems) {
            let itemInv1 = true
            if (vm.hostingCombinationItems[vm.key].workingUnitId === vm.hostingModel) {
              itemInv1 = false
              vm.test = vm.hostingCombinationItems[vm.key]
            }
            if (itemInv1) {
              item.push(vm.hostingCombinationItems[vm.key])
            }
          }
          vm.hostingCombinationItems = item
        }
        // for (vm.key in vm.jobposCombinationItems) {
        //   let itemInv2 = true
        //   if (vm.jobposCombinationItems[vm.key].jobPosId === vm.jobposModel) {
        //     itemInv2 = false
        //     vm.test = vm.jobposCombinationItems[vm.key]
        //   }
        //   if (itemInv2) {
        //     item.push(vm.jobposItems[vm.key])
        //   }
        // }
        // vm.jobposCombinationItems = item
        // }
      },
      getUsersItems () {
        let vm = this
        let paramsEmployees = {
          'class': 'employee',
          'start': -1,
          'end': -1
        }
        let configEmployees = {
          params: paramsEmployees,
          headers: {
            'groupId': vm.group_id
          }
        }
        vm.usersItems = []
        window.axios.get(vm.end_point + 'users', configEmployees)
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              vm.leaderUsersItems = serializable.data
              vm.usersItems = serializable.data
              vm.usersCombinationItems = serializable.data
            } else {
              vm.leaderUsersItems = []
              vm.usersItems = []
              vm.usersCombinationItems = []
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      getHostingItems () {
        let vm = this
        let config = {
          headers: {
            'groupId': vm.group_id
          },
          params: {
            start: -1,
            end: -1
          }
        }
        window.axios.get(vm.end_point + 'workingunits', config)
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              vm.hostingItems = serializable.data
              vm.hostingCombinationItems = serializable.data
              vm.hostingItemsAll = serializable.data
            } else {
              vm.hostingItems = []
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      getJobposItems () {
        let vm = this
        let config = {
          headers: {
            'groupId': vm.group_id
          },
          params: {
            start: -1,
            end: -1
          }
        }
        window.axios.get(vm.end_point + 'jobpos', config)
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              vm.jobposItems = serializable.data
              vm.jobposCombinationItems = serializable.data
            } else {
              vm.jobposItems = []
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      getTaskTypeItems () {
        let vm = this
        let paramsTypeTask = {
          parent: 'TASK'
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
              vm.taskTypeItems = serializable.data
            } else {
              vm.taskTypeItems = []
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      getSourceItems () {
        let vm = this
        window.axios.get(vm.end_point + 'dictcollections/SOURCE_FROM/dictitems')
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              vm.sourceItems = serializable.data
            } else {
              vm.sourceItems = []
            }
          })
          .catch(function (error) {
            console.log(error)
          })
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
      saveAndExit () {
        let vm = this
        if (this.$refs.form.validate()) {
          if (Date.parse(window.moment(vm.timeStart).format('MM/DD/YYYY')) > Date.parse(window.moment(vm.timeEnd).format('MM/DD/YYYY'))) {
            window.showMessageToastr('error', 'Chọn ngày kết thúc lớn hơn ngày bắt đầu')
          } else {
            const configPostAddTask = {
              headers: {
                'groupId': vm.group_id
              }
            }
            vm.$store.dispatch('loading/setLoading', {
              loading: true,
              message: 'Thêm mới dữ liệu...'
            })
            let startDateTask = window.moment(vm.timeStart).format('YYYYMMDD')
            let endDateTask = window.moment(vm.timeEnd).format('YYYYMMDD')
            let paramsAddTask = new URLSearchParams()
            paramsAddTask.append('isTemplate', false)
            paramsAddTask.append('activityType', 'TASK')
            paramsAddTask.append('activityCat', vm.taskTypeModel ? vm.taskTypeModel : '')
            paramsAddTask.append('sourceFrom', vm.sourceModel ? vm.sourceModel : '')
            paramsAddTask.append('priority', vm.priorityModel ? vm.priorityModel : '')
            paramsAddTask.append('subject', vm.taskName ? vm.taskName : '')
            paramsAddTask.append('assignType', vm.selectModel)
            if (vm.selectModel === 1) {
              paramsAddTask.append('managerId', vm.managerModel ? vm.managerModel : '')
            } else if (vm.selectModel === 2) {
              paramsAddTask.append('hostingId', vm.hostingModel ? vm.hostingModel : '')
            } else if (vm.selectModel === 3) {
              paramsAddTask.append('jobPosId', vm.jobposModel ? vm.jobposModel : '')
            }
            paramsAddTask.append('leaderId', vm.leaderModel ? vm.leaderModel : '')
            paramsAddTask.append('startDate', startDateTask)
            paramsAddTask.append('endDate', endDateTask)
            paramsAddTask.append('description', vm.contentModel ? vm.contentModel : '')
            window.axios.post(vm.end_point + 'activities',
              paramsAddTask,
              configPostAddTask
            )
              .then(function (response) {
                if (vm.calendarModel === true) {
                  vm.addReminderSubmit(response.data)
                }
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
                if (vm.usersCombinationModel.length !== 0 || vm.hostingCombinationModel.length !== 0) {
                  vm.postInvitation(response.data)
                }
                vm.postResourceWorkspace(response.data)
                // vm.$router.push('/detail/' + response.data.activityId)
                // window.location = 'activity#/detail/' + response.data.activityId
                vm.$emit('call-back-add', false)
                window.location = vm.MSystemConfiguration.configuration.systemurl.taskurl + 'detail/' + response.data.activityId
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
              })
              .catch(function (error) {
                console.log(error.response)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
            vm.hostingItems = vm.hostingItemsAll
            vm.hostingCombinationItems = vm.hostingItemsAll
            vm.usersItems = vm.leaderUsersItems
            vm.usersCombinationItems = vm.leaderUsersItems
          }
        }
      },
      saveAndAddNew () {
        let vm = this
        if (this.$refs.form.validate()) {
          if (Date.parse(window.moment(vm.timeStart).format('MM/DD/YYYY')) > Date.parse(window.moment(vm.timeEnd).format('MM/DD/YYYY'))) {
            window.showMessageToastr('error', 'Chọn ngày kết thúc lớn hơn ngày bắt đầu')
          } else {
            const configPostAddTask = {
              headers: {
                'groupId': vm.group_id
              }
            }
            vm.$store.dispatch('loading/setLoading', {
              loading: true,
              message: 'Thêm mới dữ liệu...'
            })
            let startDateTask = window.moment(vm.timeStart).format('YYYYMMDD')
            let endDateTask = window.moment(vm.timeEnd).format('YYYYMMDD')
            let paramsAddTask = new URLSearchParams()
            paramsAddTask.append('isTemplate', false)
            paramsAddTask.append('activityType', 'TASK')
            paramsAddTask.append('activityCat', vm.taskTypeModel ? vm.taskTypeModel : '')
            paramsAddTask.append('sourceFrom', vm.sourceModel ? vm.sourceModel : '')
            paramsAddTask.append('priority', vm.priorityModel ? vm.priorityModel : '')
            paramsAddTask.append('subject', vm.taskName ? vm.taskName : '')
            paramsAddTask.append('assignType', vm.selectModel)
            if (vm.selectModel === 1) {
              paramsAddTask.append('managerId', vm.managerModel ? vm.managerModel : '')
            } else if (vm.selectModel === 2) {
              paramsAddTask.append('hostingId', vm.hostingModel ? vm.hostingModel : '')
            } else if (vm.selectModel === 3) {
              paramsAddTask.append('jobPosId', vm.jobposModel ? vm.jobposModel : '')
            }
            paramsAddTask.append('leaderId', vm.leaderModel ? vm.leaderModel : '')
            paramsAddTask.append('startDate', startDateTask)
            paramsAddTask.append('endDate', endDateTask)
            paramsAddTask.append('description', vm.contentModel ? vm.contentModel : '')
            window.axios.post(vm.end_point + 'activities',
              paramsAddTask,
              configPostAddTask
            )
              .then(function (response) {
                vm.$emit('call-back-add', true)
                if (vm.calendarModel === true) {
                  vm.addReminderSubmit(response.data)
                }
                window.showMessageToastr('success', 'Cập nhật thành công')
                if (vm.checkboxModel === true) {
                  let config = {
                    headers: {
                      'groupId': vm.group_id
                    }
                  }
                  let url = vm.end_point + 'visibilities/' + vm.activityClassName + '/' + response.data.activityId
                  let paramsPutEditable = new URLSearchParams()
                  paramsPutEditable.append('editable', 1)
                  window.axios.put(url, paramsPutEditable, config).then(function (response) {
                  })
                    .catch(function (error) {
                      console.log(error)
                    })
                }
                if (vm.usersCombinationModel.length !== 0 || vm.hostingCombinationModel.length !== 0) {
                  vm.postInvitation(response.data)
                }
                vm.postResourceWorkspace(response.data)
                vm.getUsersItems()
                vm.getHostingItems()
                vm.getJobposItems()
                vm.$refs.form.reset()
                vm.checkboxModel = true
                vm.calendarModel = false
                vm.datetimeModel = 1
                vm.remindModel = 1
                vm.numberModel = 60
                vm.selectModel = 1
                setTimeout(function () {
                  vm.timeStart = new Date()
                  vm.timeEnd = new Date()
                }, 100)
                vm.leaderModel = Number(vm.user_id)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
              })
              .catch(function (error) {
                console.log(error.response)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
            vm.hostingItems = vm.hostingItemsAll
            vm.hostingCombinationItems = vm.hostingItemsAll
            vm.usersItems = vm.leaderUsersItems
            vm.usersCombinationItems = vm.leaderUsersItems
          }
        }
      },
      postInvitation (item) {
        let vm = this
        let urlUpdate = vm.end_point + 'resourceinvitations'
        let config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        if (vm.selectModel === 1) {
          for (vm.key in vm.usersCombinationModel) {
            let paramsApiP = new URLSearchParams()
            paramsApiP.append('className', vm.activityClassName)
            paramsApiP.append('classPK', item.activityId)
            paramsApiP.append('invitationType', 2)
            paramsApiP.append('fullName', vm.usersCombinationModel[vm.key].fullName)
            paramsApiP.append('right', 1)
            paramsApiP.append('toUserId', vm.usersCombinationModel[vm.key].userId)
            window.axios.post(urlUpdate, paramsApiP, config)
              .then(function (response) {
              })
              .catch(function (error) {
                console.log(error)
              })
          }
        }
        if (vm.selectModel === 2) {
          for (vm.key in vm.hostingCombinationModel) {
            let paramsApiP = new URLSearchParams()
            paramsApiP.append('className', vm.activityClassName)
            paramsApiP.append('classPK', item.activityId)
            paramsApiP.append('invitationType', 0)
            paramsApiP.append('roleId', vm.hostingCombinationModel[vm.key].roleId)
            paramsApiP.append('fullName', vm.hostingCombinationModel[vm.key].name)
            paramsApiP.append('right', 3)
            window.axios.post(urlUpdate, paramsApiP, config)
              .then(function (response) {
              })
              .catch(function (error) {
                console.log(error)
              })
          }
        }
        // if (vm.selectModel === 3) {
        //   for (vm.key in vm.jobposCombinationModel) {
        //     let paramsApiP = new URLSearchParams()
        //     paramsApiP.append('className', vm.activityClassName)
        //     paramsApiP.append('classPK', item.activityId)
        //     paramsApiP.append('invitationType', 0)
        //     paramsApiP.append('roleId', vm.jobposCombinationModel[vm.key].jobPosId)
        //     paramsApiP.append('fullName', vm.jobposCombinationModel[vm.key].title)
        //     paramsApiP.append('right', 3)
        //     window.axios.post(urlUpdate, paramsApiP, config)
        //       .then(function (response) {
        //       })
        //       .catch(function (error) {
        //         console.log(error)
        //       })
        //   }
        // }
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
      changeStart (val) {
        let vm = this
        vm.timeStart = val
        if (Date.parse(window.moment(vm.timeStart).format('MM/DD/YYYY')) > Date.parse(window.moment(vm.timeEnd).format('MM/DD/YYYY'))) {
          vm.timeEnd = vm.timeStart
        }
      },
      changeEnd (val) {
        let vm = this
        vm.timeEnd = val
        if (Date.parse(window.moment(vm.timeStart).format('MM/DD/YYYY')) > Date.parse(window.moment(vm.timeEnd).format('MM/DD/YYYY'))) {
          window.showMessageToastr('error', 'Chọn ngày kết thúc lớn hơn ngày bắt đầu')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

.card__title {
  padding: 0px 16px;
}

</style>
