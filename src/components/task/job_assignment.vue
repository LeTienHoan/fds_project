<template>
  <div>
    <mbl-expand-panel
      :leftactions="[
        {
          icon: 'bookmark_border'
        }
      ]"
      :rightactions="rightactions"
      :ownExpanded= "ownExpanded"
      @callback2="callback2"
      @callback3="callback3"
    >
      <template slot="title-name">
        <span v-if="activity.activityType == 'TASK'">Công việc liên quan</span>
        <span v-if="activity.activityType == 'EVENT'">Công việc kết luận - liên quan</span>
        <span v-if="activity.activityType == 'DOCUMENT' || activity.docFileId">Công việc liên quan</span>
      </template>
      <template slot="card-text-container">
        <div>
            <v-form ref="form" lazy-validation v-if="hasClassPermission && showAdd == false">
              <v-layout wrap class="mx-0 mb-2">
                <v-flex xs12 sm2>
                  <v-subheader class="px-0" v-if="activity.activityType == 'TASK'">Tên công việc *</v-subheader>
                  <v-subheader class="px-0" v-if="activity.activityType == 'EVENT'">Tên kết luận *</v-subheader>
                  <span v-if="activity.activityType == 'DOCUMENT' || activity.docFileId">Công việc liên quan</span>
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
              <v-layout wrap class="mb-2">
                <v-flex xs12 sm2>
                  <v-subheader class="px-0">Thư mục</v-subheader>
                </v-flex>
                <v-flex xs12 sm10>
                  <v-select
                    v-bind:items="workspaceItems"
                    v-model="workspaceModel"
                    clearable
                    placeholder="Chọn thư mục"
                    item-text="workspaceNamePath"
                    item-value="workspaceId"
                    autocomplete
                    multiple
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
                  <v-subheader class="px-0">Người giao việc *</v-subheader>
                </v-flex>
                <v-flex xs12 sm10>
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
              </v-layout>
              <v-layout wrap class="mb-2">
                <v-flex xs2>
                  <v-subheader class="px-0">Giao cho *</v-subheader>
                </v-flex>
                <v-flex xs2 pr-2>
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
                <v-flex xs8>
                    <v-layout wrap v-if="selectModel == 1">
                      <v-flex xs6 pr-2>
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
                      <v-flex xs6>
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
                          :filter="customFilterUser"
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
                    <v-flex xs6 pr-2>
                        <v-select 
                          v-bind:items="hostingItems"
                          v-model="hostingModel"
                          clearable
                          :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                          placeholder="Chọn đơn vị phụ trách"
                          item-text="name"
                          item-value="workingUnitId"
                          autocomplete
                          hide-selected
                          v-if="selectModel == 2"
                          @input="selectClick111"
                        >
                        </v-select>
                    </v-flex>
                    <v-flex xs6>
                        <v-select
                          v-if="selectModel == 2"
                          v-bind:items="hostingCombinationItems"
                          v-model="hostingCombinationModel"
                          clearable
                          placeholder="Chọn tên đơn vị phối họp"
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
                    <v-flex xs6 pr-2>
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
                    <v-flex xs6>
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
              <v-layout wrap class="mb-2">
                <v-flex xs12 sm2>
                  <v-subheader class="px-0">Thời gian bắt đầu </v-subheader>
                </v-flex>
                <v-flex xs12 sm4>
                  <custome-date-time
                    :id="1"
                    :datetimevalue="timeStart"
                    :format="localeDateProperties.dateMomentPattern" :onlydate="true"
                    @syncxxx="(val) => (changeDateStart(val))"
                  >
                  </custome-date-time>
                </v-flex>
                <v-flex xs12 sm2>
                  <v-subheader class="px-0 pull-right pr-2">Hạn hoàn thành </v-subheader>
                </v-flex>
                <v-flex xs12 sm4>
                  <custome-date-time
                    :id="1"
                    :datetimevalue="timeEnd"
                    :format="localeDateProperties.dateMomentPattern" :onlydate="true"
                    @syncxxx="(val) => (changeDateEnd(val))"
                  >
                  </custome-date-time>
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
                    v-if="activity.activityType == 'TASK'"
                  >
                  </v-checkbox>
                  <v-checkbox
                    style="float: left;"
                    class="py-0 my-0"
                    v-model="addDescribe"
                    label="Thêm mô tả"
                  >
                  </v-checkbox>
                </v-flex>
              </v-layout>
                <v-layout wrap v-if="addDescribe == true">
                  <v-flex xs12 sm2>
                    <v-subheader class="px-0">Mô tả </v-subheader>
                  </v-flex>
                  <v-flex xs12 sm10>
                    <v-text-field
                      placeholder="Nhập nội dung"
                      v-model="describeModel"
                      multi-line
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              <v-layout wrap>
                <v-flex xs12 sm2>
                </v-flex>
                <v-flex xs12 sm4 class="layout">
                  <v-btn class="primary mx-0" @click="saveAndExit" small style="min-width: 0px">
                    Lưu
                  </v-btn>
                  <v-btn class="primary" @click="saveAndAddNew" small>
                    Lưu và thêm mới
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          <v-layout wrap v-if="(activityItems.length - countSourceActivity) == 0 && showAdd == true">
            <v-flex xs12 class="text-xs-center" style="color: #ccc">
              <v-icon style="font-size: 26px!important">work_outline</v-icon>
              <br>
              Không có công việc liên quan nào
            </v-flex>
          </v-layout>
            <div class="table-wrapper table-job-assignment" v-if="(activityItems.length - countSourceActivity) > 0">
              <table class="table table-bs">
                <thead>
                  <tr>
                    <th class="col-xs-5">
                      Tên công việc
                    </th>
                    <th class="col-xs-1">
                      Người phụ trách
                    </th>
                    <th class="col-xs-2">
                      Người phối hợp
                    </th>
                    <th class="col-xs-1">
                      Ngày bắt đầu
                    </th>
                    <th class="col-xs-1">
                      Hạn hoàn thành
                    </th>
                    <th class="col-xs-1">
                      Trạng thái
                    </th>
                    <th class="col-xs-1">
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="index" v-for="(item, index) in activityItems" v-if="item.editable == 1">
                    <td class="col-xs-5">
                      <div class="layout">
                        <v-icon v-if="item.links">link</v-icon>
                        <v-icon v-if="(item.assignType==1 || item.assignType==4) && !item.links">person_outline</v-icon>
                        <v-icon v-if="item.assignType !== 1 && item.assignType !==4 && !item.links">people_outline</v-icon>
                        <a @click="clickDetail(item)">{{ item.subject }}</a>
                      </div>
                    </td>
                    <td class="col-xs-1">
                      <span v-if="item.assignType==1 || item.assignType==4">{{ item.managerName }}</span>
                      <span v-if="item.assignType==2">{{ item.hosting }}</span>
                      <span v-if="item.assignType==3">{{ item.jobPosTitle }}</span>
                    </td>
                    <td class="col-xs-2">
                      <span>{{ item.invitation }}</span>
                    </td>
                    <td class="col-xs-1">
                      <span>{{ item.startDate | date }}</span>
                    </td>
                    <td class="col-xs-1">
                      <span>{{ item.endDate | date }}</span>
                    </td>
                    <td class="col-xs-1" >
                      <span :style="'color:' + getStatusTextColor(item.state) + ';'">{{ item.stateName }}</span>
                    </td>
                    <td class="col-xs-1">
                      <v-btn icon class="ma-0 pull-right" @click.stop="removeActivity(item,index)" v-if="hasClassPermission" title="Xóa">
                        <v-icon class="red--text text--darken-3">clear</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
      </template>
    </mbl-expand-panel>
    <dia-log 
      :item = "[
        {
          width: '900px',
          model: add_new_task,
          action: 'saveDialog1',
          edit: true,
          label: 'Lưu và thoát',
          icon: 'save'
        },
        ]
      "
      :show_button = false
      @closeDialog="(val) => (add_new_task = val)"
    >
      <template slot="header">
        cập nhật công việc liên quan
      </template>
      <template slot="content">
        <v-layout wrap>
          <AdvancedSearchWrap :active="true"
            :apiKey="{
              preferenceKey: 'FILTERTASK',
              advancedsearchDictKey: 'dictionarytask',
              advancedsearchDefaultFilterKey: 'filtertask'
            }"
            :allowAddNew="false"
          />
          <div class="flex xs12">
            <table class="table table-bs">
              <tr :key="index" v-for="(item, index) in itemActivityTask">
                <td class="col-xs-7">
                  <v-layout>
                    <v-icon class="pr-2">insert_drive_file</v-icon> 
                    <span :title="item.subject">{{item.subject}}</span>
                  </v-layout>
                </td>
                <td class="col-xs-2 text-xs-center">
                  <span title="Ngày bắt đầu">{{ item.startDate | date }}</span>
                </td>
                <td class="col-xs-2 text-xs-center">
                  <span :style="'color:' + getStatusTextColor(item.state) + ';'">{{ item.stateName }}</span>
                </td>
                <td class="col-xs-1">
                  <v-btn small class="px-0 mx-0"
                    @click.stop="selectTaskLink(item, index)"
                    style="position: static;"
                  >
                    Chọn
                  </v-btn>
                </td>
              </tr>
            </table>
          </div>
          <div class="text-xs-right pt-2 flex xs12" v-if="itemActivityTask.length != 0">
            <v-pagination v-model="pagination.page" :length="pagination.pages"></v-pagination>
          </div>
          <div class="text-xs-center flex xs12">
            <i v-if="itemActivityTask.length === 0" class="mt-5">Không có công việc nào được tìm thấy</i>
          </div>
        </v-layout>
      </template>
    </dia-log>
  </div>
  
</template>

<script>
import { EventBus } from '@/eventbus'
import AdvancedSearchWrap from '@/components/task_comp/AdvancedSearchWrap'
const COMPONENT_NAME = 'jobAssignment'
export default {
  name: COMPONENT_NAME,
  components: {
    AdvancedSearchWrap
  },
  props: {
    activity: {
      default: []
    },
    class_pk: null,
    class_name: null,
    permission: null
  },
  watch: {
    'pagination.page': {
      handler () {
        this.getActivityTask()
      }
    },
    advancedSearchNewQueriesCPQueries: function (val) {
      this.getActivityTask()
    }
  },
  data () {
    let vm = this
    return {
      config: {
        headers: {
          'groupId': vm.group_id
        }
      },
      showAdd: true,
      ownExpanded: true,
      taskName: '',
      selectItems: [
        {'itemCode': 1, 'itemName': 'Cá nhân'},
        {'itemCode': 2, 'itemName': 'Đơn vị'}
      ],
      usersCombinationModel: [],
      usersCombinationItems: [],
      jobposCombinationModel: [],
      jobposCombinationItems: [],
      jobposItems: [],
      jobposModel: '',
      timeStart: new Date(),
      timeEnd: new Date(),
      usersItems: [],
      managerModel: '',
      hostingItems: [],
      hostingModel: '',
      hostingCombinationModel: [],
      hostingCombinationItems: [],
      describeModel: '',
      selectModel: '',
      test: '',
      key: '',
      checkboxModel: true,
      addDescribe: false,
      activityItems: [],
      hostingItemsAll: [],
      countSourceActivity: 0,
      userAll: [],
      rightactions: [],
      add_new_task: false,
      pagination: {
        rowsPerPage: 10,
        pages: 0,
        page: 1
      },
      itemActivityTask: [],
      itemSource: [],
      itemLink: [],
      workspaceModel: '',
      workspaceItems: [],
      leaderModel: '',
      leaderUsersItems: []
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.selectModel = 1
      vm.getUsersItems()
      vm.getHostingItems()
      // vm.getJobposItems()
      vm.getActivitySource()
      vm.getActivityLink()
      vm.getWorkspace()
    })
  },
  computed: {
    hasClassPermission () {
      let vm = this
      let p = vm.getPermissionText(vm.permission)
      let hasClassPermission = 'owner, write'.indexOf(p) >= 0
      if (!hasClassPermission) {
        vm.rightactions = []
      } else {
        vm.leaderModel = Number(vm.user_id)
        if (vm.activity.activityType === 'TASK') {
          vm.rightactions = [
            {
              icon: vm.showAdd ? 'add' : 'remove',
              action: 'callback2',
              text: 'Thêm công việc'
            },
            {
              icon: 'link',
              action: 'callback3',
              text: 'Liên kết'
            }
          ]
        } else if (vm.activity.activityType === 'EVENT') {
          vm.rightactions = [
            {
              icon: this.showAdd ? 'add' : 'remove',
              action: 'callback2',
              text: 'Thêm công việc'
            }
          ]
        } else if (vm.activity.docFileId) {
          vm.rightactions = [
            {
              icon: this.showAdd ? 'add' : 'remove',
              action: 'callback2',
              text: 'Thêm công việc'
            }
          ]
        }
      }
      return hasClassPermission
    },
    advancedSearchNewQueriesCPQueries () {
      const queries = this.advancedSearchNewQueriesCP.advansearchListAmazings || []
      let query = {}
      for (let k in queries) {
        Object.assign(query, queries[k].query)
      }
      return query
    },
    advancedSearchNewQueriesCP () {
      return this.$store.getters['advancedSearch/advancedSearchNewQueries']
    }
  },
  methods: {
    changeDateStart (val) {
      let vm = this
      vm.timeStart = val
      if (Date.parse(window.moment(vm.timeStart).format('MM/DD/YYYY')) > Date.parse(window.moment(vm.timeEnd).format('MM/DD/YYYY'))) {
        vm.timeEnd = val
        // window.showMessageToastr('error', 'Chọn ngày kết thúc lớn hơn ngày bắt đầu')
      }
    },
    changeDateEnd (val) {
      let vm = this
      vm.timeEnd = val
      if (Date.parse(window.moment(vm.timeStart).format('MM/DD/YYYY')) > Date.parse(window.moment(vm.timeEnd).format('MM/DD/YYYY'))) {
        window.showMessageToastr('error', 'Chọn ngày kết thúc lớn hơn ngày bắt đầu')
      }
    },
    callback2 () {
      let vm = this
      vm.showAdd = !vm.showAdd
      vm.ownExpanded = true
    },
    callback3 () {
      this.add_new_task = true
      this.getActivityTask()
    },
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
    selectClick () {
      let vm = this
      let item = []
      let keys = ''
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
      } else if (vm.selectModel === 3) {
        for (vm.key in vm.jobposItems) {
          if (vm.jobposCombinationModel.length !== 0) {
            let itemInv2 = true
            for (keys in vm.jobposCombinationModel) {
              if (vm.jobposItems[vm.key].jobPosId === vm.jobposCombinationModel[keys].jobPosId) {
                itemInv2 = false
              }
            }
            if (itemInv2) {
              item.push(vm.jobposItems[vm.key])
            }
          } else {
            item.push(vm.jobposItems[vm.key])
          }
        }
        vm.jobposItems = item
      }
    },
    selectClick111 () {
      let vm = this
      let item = []
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
      } else if (vm.selectModel === 3) {
        for (vm.key in vm.jobposCombinationItems) {
          let itemInv2 = true
          if (vm.jobposCombinationItems[vm.key].jobPosId === vm.jobposModel) {
            itemInv2 = false
            vm.test = vm.jobposCombinationItems[vm.key]
          }
          if (itemInv2) {
            item.push(vm.jobposItems[vm.key])
          }
        }
        vm.jobposCombinationItems = item
      }
    },
    getUsersItems () {
      let vm = this
      let paramsEmployees = {
        'class': 'employee',
        'start': -1,
        'end': -1,
        'sort': 'fullName_String'
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
            vm.userAll = serializable.data
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
    saveAndExit () {
      let vm = this
      if (this.$refs.form.validate()) {
        if (Date.parse(window.moment(vm.timeStart).format('MM/DD/YYYY')) > Date.parse(window.moment(vm.timeEnd).format('MM/DD/YYYY'))) {
          window.showMessageToastr('error', 'Chọn ngày kết thúc lớn hơn ngày bắt đầu')
        } else {
          let config = {
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
          paramsAddTask.append('subject', vm.taskName ? vm.taskName : '')
          paramsAddTask.append('assignType', vm.selectModel)
          paramsAddTask.append('startDate', startDateTask)
          paramsAddTask.append('endDate', endDateTask)
          if (vm.addDescribe === true) {
            paramsAddTask.append('description', vm.describeModel ? vm.describeModel : '')
          }
          paramsAddTask.append('sourceClassName', vm.class_name)
          paramsAddTask.append('sourceClassPK', vm.class_pk)
          paramsAddTask.append('leaderId', vm.leaderModel ? vm.leaderModel : '')
          if (vm.checkboxModel === true) {
            paramsAddTask.append('editable', 1)
          }

          if (vm.selectModel === 1) {
            paramsAddTask.append('managerId', vm.managerModel ? vm.managerModel : '')
          } else if (vm.selectModel === 2) {
            paramsAddTask.append('hostingId', vm.hostingModel ? vm.hostingModel : '')
          } else if (vm.selectModel === 3) {
            paramsAddTask.append('jobPosId', vm.jobposModel ? vm.jobposModel : '')
          }
          if (vm.activity.activityType === 'EVENT') {
            paramsAddTask.append('sourceType', 2)
          } else if (vm.activity.activityType === 'TASK') {
            paramsAddTask.append('sourceType', 3)
          } else if (vm.activity.docFileId) {
            paramsAddTask.append('sourceType', vm.getSourceTypeValue('TASK_DOCUMENT'))
          }
          if (vm.selectModel === 1 || vm.selectModel === 2) {
            window.axios.post(vm.end_point + 'activities',
              paramsAddTask,
              config
            )
              .then(function (response) {
                vm.showAdd = true
                if (vm.activity.activityType === 'TASK') {
                  EventBus.$emit('count_filter', true)
                }
                vm.postResourceWorkspace(response.data)
                if (vm.usersCombinationModel.length !== 0 || vm.hostingCombinationModel.length !== 0) {
                  vm.postInvitation(response.data)
                }
                setTimeout(function () {
                  vm.getActivitySource()
                }, 1000)
                vm.taskName = ''
                vm.timeStart = new Date()
                vm.timeEnd = new Date()
                vm.managerModel = ''
                vm.hostingModel = ''
                vm.jobposModel = ''
                vm.checkboxModel = true
                vm.addDescribe = false
                vm.describeModel = ''
                vm.usersCombinationModel = []
                vm.hostingCombinationModel = []
                vm.jobposCombinationModel = []
                window.showMessageToastr('success', 'Cập nhật thành công')
                // vm.postActivitySource(response.data.activityId)
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
          } else if (vm.selectModel === 3) {
            window.axios.post(vm.end_point + 'activities/group',
              paramsAddTask,
              config
            )
              .then(function (response) {
                window.showMessageToastr('success', 'Cập nhật thành công')
                let serializable = response.data
                if (vm.jobposCombinationModel.length !== 0) {
                  for (vm.key in serializable.data) {
                    vm.postInvitation(serializable.data[vm.key])
                  }
                }
                setTimeout(function () {
                  vm.getActivitySource()
                }, 1000)
              })
              .catch(function (error) {
                console.log(error.response)
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
          }
          vm.hostingItems = vm.hostingItemsAll
          vm.hostingCombinationItems = vm.hostingItemsAll
          vm.usersItems = vm.userAll
          vm.usersCombinationItems = vm.userAll
        }
      }
    },
    saveAndAddNew () {
      let vm = this
      if (this.$refs.form.validate()) {
        if (Date.parse(window.moment(vm.timeStart).format('MM/DD/YYYY')) > Date.parse(window.moment(vm.timeEnd).format('MM/DD/YYYY'))) {
          window.showMessageToastr('error', 'Chọn ngày kết thúc lớn hơn ngày bắt đầu')
        } else {
          let config = {
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
          paramsAddTask.append('subject', vm.taskName ? vm.taskName : '')
          paramsAddTask.append('assignType', vm.selectModel)
          paramsAddTask.append('startDate', startDateTask)
          paramsAddTask.append('endDate', endDateTask)
          paramsAddTask.append('sourceClassName', vm.class_name)
          paramsAddTask.append('sourceClassPK', vm.class_pk)
          paramsAddTask.append('leaderId', vm.leaderModel ? vm.leaderModel : '')
          if (vm.checkboxModel === true) {
            paramsAddTask.append('editable', 1)
          }
          if (vm.addDescribe === true) {
            paramsAddTask.append('description', vm.describeModel ? vm.describeModel : '')
          }
          if (vm.selectModel === 1) {
            paramsAddTask.append('managerId', vm.managerModel ? vm.managerModel : '')
          } else if (vm.selectModel === 2) {
            paramsAddTask.append('hostingId', vm.hostingModel ? vm.hostingModel : '')
          } else if (vm.selectModel === 3) {
            paramsAddTask.append('jobPosId', vm.jobposModel ? vm.jobposModel : '')
          }
          if (vm.activity.activityType === 'EVENT') {
            paramsAddTask.append('sourceType', 2)
          } else if (vm.activity.activityType === 'TASK') {
            paramsAddTask.append('sourceType', 3)
          } else if (vm.activity.docFileId) {
            paramsAddTask.append('sourceType', vm.getSourceTypeValue('TASK_DOCUMENT'))
          }
          if (vm.selectModel === 1 || vm.selectModel === 2) {
            window.axios.post(vm.end_point + 'activities',
              paramsAddTask,
              config
            )
              .then(function (response) {
                if (vm.usersCombinationModel.length !== 0 || vm.hostingCombinationModel.length !== 0) {
                  vm.postInvitation(response.data)
                }
                if (vm.activity.activityType === 'TASK') {
                  EventBus.$emit('count_filter', true)
                }
                vm.postResourceWorkspace(response.data)
                setTimeout(function () {
                  vm.getActivitySource()
                }, 1000)
                // vm.postActivitySource(response.data.activityId)
                vm.taskName = ''
                vm.timeStart = new Date()
                vm.timeEnd = new Date()
                vm.managerModel = ''
                vm.hostingModel = ''
                vm.jobposModel = ''
                vm.addDescribe = false
                vm.describeModel = ''
                vm.usersCombinationModel = []
                vm.hostingCombinationModel = []
                vm.jobposCombinationModel = []
                // vm.$refs.form.reset()
                vm.checkboxModel = true
                vm.selectModel = 1
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageToastr('success', 'Cập nhật thành công')
              })
              .catch(function (error) {
                console.log(error.response)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
          } else if (vm.selectModel === 3) {
            window.axios.post(vm.end_point + 'activities/group',
              paramsAddTask,
              config
            )
              .then(function (response) {
                window.showMessageToastr('success', 'Cập nhật thành công')
                let serializable = response.data
                if (vm.jobposCombinationModel.length !== 0) {
                  for (vm.key in serializable.data) {
                    vm.postInvitation(serializable.data[vm.key])
                  }
                }
                setTimeout(function () {
                  vm.getActivitySource()
                }, 1000)
                vm.taskName = ''
                vm.timeStart = new Date()
                vm.timeEnd = new Date()
                vm.managerModel = ''
                vm.hostingModel = ''
                vm.jobposModel = ''
                vm.checkboxModel = true
                vm.addDescribe = false
                vm.describeModel = ''
                vm.usersCombinationModel = []
                vm.hostingCombinationModel = []
                vm.jobposCombinationModel = []
                vm.workspaceModel = ''
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
          }
          vm.hostingItems = vm.hostingItemsAll
          vm.hostingCombinationItems = vm.hostingItemsAll
          vm.usersItems = vm.userAll
          vm.usersCombinationItems = vm.userAll
        }
      }
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
    postInvitation (item) {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      let urlUpdate = vm.end_point + 'resourceinvitations'
      if (vm.selectModel === 1) {
        for (vm.key in vm.usersCombinationModel) {
          let paramsApiP = new URLSearchParams()
          paramsApiP.append('className', vm.activityClassName)
          paramsApiP.append('classPK', item.activityId)
          paramsApiP.append('invitationType', 2)
          paramsApiP.append('fullName', vm.usersCombinationModel[vm.key].fullName)
          paramsApiP.append('right', 0)
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
          paramsApiP.append('roleId', vm.hostingCombinationModel[vm.key].workingUnitId)
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
    postActivitySource (id) {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      let paramsApiP = new URLSearchParams()
      paramsApiP.append('className', vm.class_name)
      paramsApiP.append('classPK', vm.class_pk)
      window.axios.post(vm.end_point + '/activities/' + id + '/source',
        paramsApiP,
        config
      )
        .then(function (response) {
          console.log('Add to activity source success')
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    getActivitySource () {
      let vm = this
      let params = {}
      if (vm.activity.activityType === 'EVENT') {
        params = {
          'sourceType': 2,
          'start': -1,
          'end': -1
        }
      } else if (vm.activity.activityType === 'TASK') {
        params = {
          'sourceType': 3,
          'start': -1,
          'end': -1
        }
      } else if (vm.activity.activityType === 'DOCUMENT' || vm.activity.docFileId) {
        params = {
          'sourceType': vm.getSourceTypeValue('TASK_DOCUMENT'),
          'start': -1,
          'end': -1
        }
      }
      let config = {
        params: params,
        headers: {
          'groupId': vm.group_id
        }
      }
      vm.countSourceActivity = 0
      let urlactivity = vm.end_point + 'activities/source/' + vm.class_name + '/' + vm.class_pk
      window.axios.get(urlactivity, config)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.itemSource = serializable.data
            for (let key in serializable.data) {
              if (serializable.data[key].editable !== 1) {
                vm.countSourceActivity = vm.countSourceActivity + 1
              }
              vm.getresourceInvitation(serializable.data[key], key)
            }
          } else {
            vm.itemSource = []
          }
          vm.activityItems = vm.itemSource.concat(vm.itemLink)
        })
        .catch(function (error) {
          console.log(error)
          vm.activityItems = []
        })
    },
    getresourceInvitation (activity, index) {
      let vm = this
      let paramsEmployees = {}
      if (activity.assignType === 1 || activity.assignType === 4) {
        paramsEmployees = {
          'invitationType': 2,
          'right': 0,
          'start': -1,
          'end': -1
        }
      } else if (activity.assignType === 2) {
        paramsEmployees = {
          'invitationType': 0,
          'right': 3,
          'start': -1,
          'end': -1
        }
      } else if (activity.assignType === 3) {
        paramsEmployees = {
          'invitationType': 0,
          'right': 3,
          'start': -1,
          'end': -1
        }
      }
      let config = {
        params: paramsEmployees,
        headers: {
          'groupId': vm.group_id
        }
      }
      let urlactivity = vm.end_point + 'resourceinvitations/' + vm.activityClassName + '/' + activity.activityId
      window.axios.get(urlactivity, config)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            let resourceInvitation = ''
            let comma = ''
            for (var key in serializable.data) {
              resourceInvitation += comma + serializable.data[ key ].fullName
              comma = '; '
            }
            vm.activityItems[index]['invitation'] = resourceInvitation
          } else {
            vm.activityItems[index]['invitation'] = ''
          }
        })
        .catch(function (error) {
          console.log(error)
          vm.activityItems[index]['invitation'] = ''
        })
    },
    removeActivity (item, index) {
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
          if (item.links === true) {
            vm.$store.dispatch('loading/setLoading', {
              loading: true,
              message: 'Xóa dữ liệu...'
            })
            window.axios.delete(vm.end_point + 'activities/' + vm.class_pk + '/links/' + item.activityId, config)
              .then(function (response) {
                vm.getActivityLink()
                window.showMessageToastr('success', 'Xóa công việc liên quan thành công')
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
              })
              .catch(function (error) {
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageByAPICode(error.response.status, error.response.data)
                console.log(error.response.status)
              })
          } else {
            vm.$store.dispatch('loading/setLoading', {
              loading: true,
              message: 'Xóa dữ liệu...'
            })
            window.axios.delete(vm.end_point + 'activities/' + item.activityId, config)
              .then(function (response) {
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageToastr('success', 'Xóa công việc thành công')
                setTimeout(function () {
                  vm.getActivitySource()
                }, 1000)
              })
              .catch(function (error) {
                console.log(error)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
          }
          dialog.close()
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getActivityTask (payload) {
      let vm = this
      vm.paramsGetActivity = {
        sort: 'startDate_Number',
        type: 'TASK',
        start: vm.pagination.page * vm.pagination.rowsPerPage - vm.pagination.rowsPerPage,
        end: vm.pagination.page * vm.pagination.rowsPerPage,
        order: true
      }
      vm.itemActivityTask = []
      let config = {
        params: Object.assign(vm.paramsGetActivity, vm.advancedSearchNewQueriesCPQueries || {}),
        headers: {
          groupId: vm.group_id
        }
      }
      let url = vm.end_point + 'activities'
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          vm.itemActivityTask = serializable.data
          vm.pagination.pages = Math.ceil(serializable.total / vm.pagination.rowsPerPage)
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    getActivityLink: function () {
      let vm = this
      vm.itemLink = []
      let paramsGetActivityLink = {
        sort: 'startDate_Number'
      }
      vm.paramsGet = paramsGetActivityLink
      let configGetActivityLink = {
        params: vm.paramsGet,
        headers: {
          groupId: vm.group_id
        }
      }
      let url = vm.end_point + 'activities/' + vm.class_pk + '/links'
      window.axios.get(url, configGetActivityLink).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          for (var key in serializable.data) {
            if (serializable.data[key].activityType === 'TASK') {
              Object.assign(serializable.data[key], {'links': true})
              vm.itemLink.push(serializable.data[key])
            }
          }
        } else {
          vm.itemLink = []
        }
        vm.activityItems = vm.itemSource.concat(vm.itemLink)
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    selectTaskLink: function (item, index) {
      let vm = this
      let params = new URLSearchParams()
      params.append('targetId', item.activityId)
      let config = {
        headers: {
          groupId: vm.group_id
        }
      }
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Thêm công việc liên quan...'
      })
      let url = vm.end_point + 'activities/' + vm.class_pk + '/links'
      window.axios.post(url, params, config)
        .then(function (response) {
          vm.itemActivityTask.splice(index, 1)
          vm.ownExpanded = true
          vm.getActivityLink()
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          window.showMessageToastr('success', 'Cập nhật thành công')
        })
        .catch(function (error) {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          window.showMessageByAPICode(error.response.status, error.response.data)
          console.log(error.response)
        })
    },
    getWorkspace () {
      let vm = this
      vm.workspaceItems = []
      vm.workspaceModel = []
      let config = {
        headers: {
          groupId: vm.group_id
        }
      }
      let url = vm.end_point + 'workspaces/scope/TASK?start=-1&end=-1&sort=name_String'
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          vm.workspaceItems = serializable.data.filter(function (item) {
            return item.permission !== 'read'
          })
          for (var key in vm.workspaceItems) {
            for (var key1 in vm.activity.workspaces) {
              if (vm.activity.workspaces[key1].workspaceId === vm.workspaceItems[key].workspaceId) {
                vm.workspaceModel.push(vm.workspaceItems[key].workspaceId)
              }
            }
          }
        } else {
          vm.workspaceItems = []
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    clickDetail (item) {
      window.location = this.MSystemConfiguration.configuration.systemurl.taskurl + 'detail/' + item.activityId
    }
  }
}
</script>

<style scoped>
  .dialog__content__active .dialog--active {
    min-height: 250px;
    background-color: white
  }
  .table-job-assignment .table-bs thead th{
    padding: 5px 10px!important;
    border: 1px solid #e6e7e8;
    border-left: 0;
    vertical-align: middle;
    font-weight: bold;
  }
  .table-job-assignment .table-bs thead th[class*="col-"]:last-child {
     border-right: 0
  }
</style>