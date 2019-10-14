<template>
  <div>
  <mbl-expand-panel
      :usecard="false"
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
        Cuộc họp liên quan
    </template>
    <template slot="card-text-container">
      <div class="card">
        <div class="card__text">
          <v-layout wrap v-if="(itemEventLink.length - countSource) == 0">
            <v-flex xs12 class="text-xs-center" style="color: #ccc">
              <v-icon style="font-size: 26px!important">event_available</v-icon>
              <br>
              Không có cuộc họp liên quan nào
            </v-flex>
          </v-layout>
            <div class="table-wrapper" v-if="(itemEventLink.length - countSource) > 0">
              <v-flex xs12 sm12>
                <div>
                  <v-expansion-panel class="list-table">
                      <v-expansion-panel-content 
                        v-for="(item, index) in itemEventLink" 
                        v-bind:key="item.eventItem.activityId"
                        v-model="item.isOpen"
                        @input="getListActivitySource(item.eventItem.activityId,index,item.isOpen)"
                        v-if="item.eventItem.editable == 1"
                      >
                        <div slot="header" >
                          <table class="table table-bs">
                            <tr>
                              <td class="col-xs-5">
                                <v-layout>
                                  <v-icon v-if="item.eventItem.links">link</v-icon>
                                  <v-icon v-else>person_outline</v-icon>
                                  <a  @click.stop="goToDetailEvent(item.eventItem.activityId)" :title="item.eventItem.subject" >
                                    {{item.eventItem.subject}}
                                  </a>
                                </v-layout>
                              </td>
                              <td class="col-xs-3">
                                <span :title="item.eventItem.leaderName">Chủ trì: {{item.eventItem.leaderName}}</span>
                              </td>
                              <td class="col-xs-2">
                                <span title="Ngày bắt đầu">{{ parseDateView(new Date(item.eventItem.startDate))}}</span>
                              </td>
                              <td class="col-xs-2">
                                <v-btn flat icon class="mx-0 my-0 pull-right" @click.stop="deleteEventLink(item.eventItem, index)" v-if="hasClassPermission" title="Xóa">
                                  <v-icon 
                                  color="red darken-3" 
                                  class="delete_icon"
                                  icon
                                  >clear</v-icon>
                                </v-btn>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <div slot="actions">
                        </div>
                          <v-data-table id="subTableActivity"
                            hide-headers
                            v-if="item.activitySourceItems.length != 0"
                            :items="item.activitySourceItems"
                            item-key="activityId"
                            hide-actions
                            class="table-bs"
                            >
                              <template slot="items" slot-scope="props">
                                
                                <tr v-bind:class="{'active': props.index%2==1}">
                                  <td class="col-xs-5">
                                    {{props.index + 1}}. 
                                    <a @click.stop="goToDetailEvent(props.item.activityId)" >
                                      <span>{{ props.item.subject }}</span>
                                    </a>
                                  </td>
                                  <td class="col-xs-3" :title="props.item.hosting">
                                    {{ props.item.hosting }}
                                  </td>
                                  <td class="col-xs-2">
                                    {{parseDateView(new Date(props.item.endDate))}}
                                  </td>
                                  <td class="col-xs-2">
                                    <span :style="'color:' + getStatusTextColor(props.item.state) + ';'">{{props.item.stateName}}</span>
                                  </td>
                                  <!-- <td class="py-3" style="width: 28%" :title="props.item.hosting ">{{ props.item.hosting }}</td>
                                  <td class="text-xs-center py-3" style="width: 15%"></td>
                                  <td class="text-xs-center" style="width: 17%" :class="getColor_list(props.item.state)">
                                    <v-chip style="display: inline-block;text-align: center;width:80%" label outline :color="getColor(props.item.state)">
                                      
                                    </v-chip>
                                    <span>{{props.item.stateName}}</span>
                                  </td> -->
                                </tr>
                                
                              </template>
                          </v-data-table>
                      </v-expansion-panel-content>
                  </v-expansion-panel>
                </div>
              </v-flex>
            </div>
        </div>
      </div>
    </template>
  </mbl-expand-panel>

    <!-- Phần dialog -->
    <dia-log 
      :item = "[
        {
          width: '900px',
          model: dialog_add_eventlink,
          action: 'saveDialog',
          edit: true
        }]
      "
      :show_button = false
      @closeDialog="(val) => (dialog_add_eventlink = val)"
    >
      <template slot="header">
        Cập nhật cuộc họp liên quan
      </template>
      <template slot="content">
        <div>
          <v-layout wrap>
            <v-flex xs2>
              <v-subheader class="px-0">Tên cuộc họp</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field class="pt-0" id="searchInput"
                placeholder="Nhập tên cuộc họp"
                single-line
                hide-details
                v-model="keySearch"
              ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-btn outline @click="showFilter = !showFilter" class="pull-right ma-0">
                Bộ lọc 
                <v-icon v-if="showFilter">keyboard_arrow_up</v-icon>
                <v-icon v-if="!showFilter">keyboard_arrow_down</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <div v-if="showFilter">
            <v-layout wrap>
              <v-flex xs2>
                <v-subheader class="px-0">Thời gian bắt đầu</v-subheader>
              </v-flex>
              <v-flex xs4>
                <custome-date-time
                  :id="1"
                  class="control_class"
                  :datetimevalue="timeStart"
                  :format="localeDateProperties.dateMomentPattern" :onlydate="true"
                  @syncxxx="timeStartChange"
                >
                </custome-date-time>
              </v-flex>
              <v-flex xs2>
                <v-subheader class="px-0 pull-right pr-2">Ngày kết thúc</v-subheader>
              </v-flex>
              <v-flex xs4>
                <custome-date-time
                  :id="1"
                  class="control_class"
                  :datetimevalue="timeEnd"
                  :format="localeDateProperties.dateMomentPattern" :onlydate="true"
                  @syncxxx="timeEndChange"
                >
                </custome-date-time>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <!-- <v-flex xs2>
                <v-subheader class="px-0">Tham mưu</v-subheader>
              </v-flex>
              <v-flex xs4>
                <v-select
                  v-bind:items="hostingItems"
                  v-model="hostingModel"
                  clearable
                  item-text="name"
                  item-value="workingUnitId"
                  autocomplete
                  hide-selected
                >
                </v-select>
              </v-flex> -->
              <v-flex xs2>
                <v-subheader class="px-0">Chủ trì</v-subheader>
              </v-flex>
              <v-flex xs10>
                <v-select
                  v-bind:items="userItems"
                  v-model="leaderModel"
                  clearable
                  item-text="fullName"
                  item-value="userId"
                  autocomplete
                  hide-selected
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
            <v-layout wrap>
              <v-flex xs2>
                <v-subheader class="px-0">Trạng thái</v-subheader>
              </v-flex>
              <v-flex xs4>
                <v-select
                  v-bind:items="visibilityItems"
                  v-model="visibilityModel"
                  clearable
                  item-text="stateName"
                  item-value="state"
                  autocomplete
                  hide-selected
                >
                </v-select>
              </v-flex>
              <v-flex xs2>
                <v-subheader class="px-0 pull-right pr-2">Lĩnh vực</v-subheader>
              </v-flex>
              <v-flex xs4>
                <v-select
                  v-bind:items="eventTypeItems"
                  v-model="eventTypeModel"
                  clearable
                  item-text="itemName"
                  item-value="itemCode"
                  autocomplete
                  hide-selected
                >
                </v-select>
              </v-flex>
            </v-layout>
          </div>
          <v-layout wrap>
              <v-flex xs12>
                <v-btn v-on:click.native="keywordSearch" class="px-0 mx-0 primary pull-right" style="height: 30px">
                  Tìm kiếm
                </v-btn>
            </v-flex>
          </v-layout>
        </div>
        <v-layout wrap >
            <!--  -->
          <v-flex xs12 sm12 class="listActivity mt-3">
            <div>
            <!-- <v-list class="py-0">
              <v-list-tile v-for="(item, index) in itemActivityEvent" v-bind:key="item.activityId" class="px-0">
                <v-list-tile-content>
                  <tr>
                    <td class="col-xs-7">
                      <v-layout>
                        <v-icon>insert_drive_file</v-icon> 
                        <span :title="item.subject">{{item.subject}}</span>
                      </v-layout>
                    </td>
                    <td class="col-xs-2">
                      <span title="Ngày bắt đầu">{{ parseDateView(new Date(item.startDate))}}</span>
                    </td>
                    <td class="col-xs-2">
                      <span :style="'color:' + getStatusTextColor(item.state) + ';'">{{ item.stateName }}</span>
                    </td>
                    <td class="col-xs-1">
                      <v-btn small class="px-0 mx-0"
                        @click.stop="selectEventLink(item, index)"
                      >
                        Chọn
                      </v-btn>
                    </td>
                  </tr>

                </v-list-tile-content>

              </v-list-tile>
            </v-list> -->
            <table class="table table-bs">
              <tr :key="index" v-for="(item, index) in itemActivityEvent">
                <td class="col-xs-7">
                  <v-layout>
                    <v-icon class="pr-2">insert_drive_file</v-icon> 
                    <span :title="item.subject">{{item.subject}}</span>
                  </v-layout>
                </td>
                <td class="col-xs-2 text-xs-center">
                  <span title="Ngày bắt đầu">{{ parseDateView(new Date(item.startDate))}}</span>
                </td>
                <td class="col-xs-2 text-xs-center">
                  <span :style="'color:' + getStatusTextColor(item.state) + ';'">{{ item.stateName }}</span>
                </td>
                <td class="col-xs-1">
                  <v-btn small class="px-0 mx-0"
                    @click.stop="selectEventLink(item, index)"
                  >
                    Chọn
                  </v-btn>
                </td>
              </tr>
            </table>
            <div class="text-xs-right pt-2" v-if="itemActivityEvent.length != 0">
              <v-pagination class="right" v-model="pagination.page" :length="pagination.pages"></v-pagination>
            </div>
            </div>
            <div class="text-xs-center">
              <i v-if="itemActivityEvent.length === 0" class="mt-5">Không có cuộc họp nào được tìm thấy</i>
            </div>
          </v-flex>

        </v-layout>
      </template>
    </dia-log>
    
    <dia-log 
      :item = "[
        {
          width: '900px',
          model: add_new_event,
          action: 'saveDialog1',
          edit: true,
          label: 'Lưu và thoát',
          icon: 'save'
        },
        {
          width: '900px',
          model: add_new_event,
          action: 'saveDialog2',
          edit: true,
          label: 'Lưu và thêm mới',
          icon: 'save'
        }
        ]
      "
      :show_button = true
      @closeDialog="(val) => (add_new_event = val)"
      @saveDialog1="submitSaveAndExit"
      @saveDialog2="submitSaveAndAddNew"
    >
      <template slot="header">
        Thêm mới cuộc họp - sự kiện
      </template>
      <template slot="content">
        <activityAddEvent ref='activityAddRef'
          :eventlink="true"
          :source_type="source_type"
          :class_pk="class_pk"
          :class_name="class_name"
        >
        </activityAddEvent>
      </template>
    </dia-log>
    <!-- end -->

  </div>
</template>


<script>
import activityAddEvent from '@/components/activity/activity_add_event'
const COMPONENT_NAME = 'jx-mobilink-activity-eventlink'

export default {
  name: COMPONENT_NAME,
  components: {
    activityAddEvent
  },
  props: {
    class_pk: null,
    class_name: null,
    permission: null,
    startend_prop: null,
    source_type: null
  },
  watch: {
    'pagination.page': {
      handler () {
        this.getActivity()
      }
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.initEventLink()
      vm.getActivitySource()
      vm.getHostingItems()
      vm.getVisibility()
      vm.getEventTypeItems()
      if (vm.permission === 'read') {
        vm.rightactions = []
      } else if (vm.source_type === vm.getSourceTypeValue('EVENT_DOCUMENT')) {
        vm.rightactions = [
          {
            icon: 'add',
            action: 'callback3',
            text: 'Thêm cuộc họp'
          }
        ]
      } else {
        vm.rightactions = [
          {
            icon: 'add',
            action: 'callback3',
            text: 'Thêm cuộc họp'
          },
          {
            icon: 'link',
            action: 'callback2',
            text: 'Liên kết'
          }
        ]
      }
    })
  },
  destroyed () {
    // delete this.class_pk
    // delete this.class_name
    // delete this.permission
    // delete this.startend_prop
    // delete this.source_type
    // delete this.ownExpanded
    // delete this.itemActivityEvent
    // delete this.itemEventLink
    // delete this.keySearch
    // delete this.timeStart
    // delete this.timeEnd
    // delete this.timeStartMax
    // delete this.timeEndMin
    // delete this.paramsGet
    // delete this.paramsGetActivity
    // delete this.pagination
    // delete this.dialog_add_eventlink
    // delete this.showFilter
    // delete this.hostingItems
    // delete this.hostingModel
    // delete this.leaderModel
    // delete this.visibilityItems
    // delete this.visibilityModel
    // delete this.eventTypeItems
    // delete this.eventTypeModel
    // delete this.add_new_event
    // delete this.activitySource
    // delete this.rightactions
    // delete this.linkItems
    // delete this.sourceItems
    // delete this.countSource
    // delete this.hasClassPermission
    // delete this.userItems
    // delete this.submitSaveAndExit
    // delete this.submitSaveAndAddNew
    // delete this.goToDetailEvent
    // delete this.goToDetailTask
    // delete this.initEventLink
    // delete this.getVisibility
    // delete this.getVisibility
    // delete this.getEventTypeItems
    // delete this.callback2
    // delete this.callback3
    // delete this.selectEventLink
    // delete this.deleteEventLink
    // delete this.getActivity
    // delete this.timeStartChange
    // delete this.timeEndChange
    // delete this.getFilterLeader
    // delete this.keywordSearch
    // delete this.getActivityLink
    // delete this.getListActivitySource
    // delete this.managerPermision
    // delete this.parseDateView
    // delete this.parseDateFormat
    // delete this.getActivitySource
  },
  data () {
    return {
      ownExpanded: true,
      itemActivityEvent: [],
      itemEventLink: [],
      keySearch: '',
      timeStart: '',
      timeEnd: '',
      timeStartMax: '',
      timeEndMin: '',
      paramsGet: {},
      paramsGetActivity: {},
      pagination: {
        rowsPerPage: 10,
        pages: 0,
        page: 1
      },
      dialog_add_eventlink: false,
      showFilter: true,
      hostingItems: [],
      hostingModel: '',
      leaderModel: '',
      visibilityItems: [],
      visibilityModel: '',
      eventTypeItems: [],
      eventTypeModel: '',
      add_new_event: false,
      activitySource: [],
      rightactions: [],
      linkItems: [],
      sourceItems: [],
      countSource: 0
    }
  },
  computed: {
    hasClassPermission () {
      let p = this.getPermissionText(this.permission)
      let hasClassPermission = 'owner, write'.indexOf(p) >= 0
      return hasClassPermission
    },
    userItems () {
      return this.$store.getters['user/userItems']
    }
  },
  methods: {
    submitSaveAndExit () {
      let vm = this
      vm.$refs.activityAddRef.saveAndExit()
      setTimeout(function () {
        vm.add_new_event = false
        vm.getActivitySource()
      }, 1000)
    },
    submitSaveAndAddNew () {
      let vm = this
      vm.$refs.activityAddRef.saveAndAddNew()
      setTimeout(function () {
        vm.getActivitySource()
      }, 1000)
    },
    goToDetailEvent (id) {
      window.location = this.MSystemConfiguration.configuration.systemurl.eventurl + 'detail/' + id
    },
    goToDetailTask (id) {
      window.location = 'activity#/detail/' + id
    },
    initEventLink: function () {
      let vm = this
      vm.getActivityLink()
    },
    getVisibility () {
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
      window.axios.get(vm.end_point + 'visibilities/' + vm.class_name + '/EVENT/states', config)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.visibilityItems = serializable.data
          } else {
            vm.visibilityItems = []
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
          'start': -1,
          'end': -1
        }
      }
      window.axios.get(vm.end_point + 'workingunits', config)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.hostingItems = serializable.data
          } else {
            vm.hostingItems = []
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    getEventTypeItems () {
      let vm = this
      let paramsTypeEvent = {
        parent: 'EVENT',
        start: -1,
        end: -1
      }
      let configTypeEvent = {
        params: paramsTypeEvent,
        headers: {
          'groupId': vm.group_id
        }
      }
      window.axios.get(vm.end_point + 'dictcollections/ACTIVITY_TYPE/dictitems', configTypeEvent)
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
    callback2: function () {
      let vm = this
      vm.dialog_add_eventlink = true
      vm.timeStart = ''
      vm.timeEnd = ''
      vm.leaderModel = ''
      vm.visibilityModel = ''
      vm.hostingModel = ''
      vm.eventTypeModel = ''
      vm.keySearch = ''
      vm.getActivity()
    },
    callback3 () {
      let vm = this
      vm.$store.dispatch('workspace/getWorkspaceItems', {scope: 'EVENT', sort: 'name_String'})
      vm.add_new_event = !vm.add_new_event
      vm.$refs.activityAddRef.initGetData(new Date(), window.moment(new Date()).add(30, 'm').toDate())
    },
    selectEventLink: function (item, index) {
      let vm = this
      let paramsAddEventLink = new URLSearchParams()
      paramsAddEventLink.append('targetId', item.activityId)
      let configAddActivityLink = {
        headers: {
          groupId: vm.group_id
        }
      }
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Thêm cuộc họp liên quan...'
      })
      let url = vm.end_point + 'activities/' + vm.class_pk + '/links'
      window.axios.post(url, paramsAddEventLink, configAddActivityLink)
        .then(function (response) {
          vm.itemActivityEvent.splice(index, 1)
          vm.ownExpanded = true
          vm.getActivityLink()
          window.showMessageToastr('success', 'Cập nhật thành công')
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
    },
    /** delete event links */
    deleteEventLink: function (item, index) {
      let vm = this
      let paramUpdateLinks = {
      }
      const configUpdateLinks = {
        params: paramUpdateLinks,
        headers: {
          'groupId': vm.group_id
        }
      }
      if (item.links === true) {
        let urlUpdate = vm.end_point + 'activities/' + vm.class_pk + '/links/' + item.activityId
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
            window.axios.delete(urlUpdate, configUpdateLinks)
              .then(function (response) {
                vm.getActivityLink()
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageToastr('success', 'Xóa cuộc họp liên quan thành công')
              })
              .catch(function (error) {
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageByAPICode(error.response.status, error.response.data)
                console.log(error.response.status)
              })
            dialog.close()
          })
          .catch((e) => {
            console.log(e)
          })
      } else {
        let url = vm.end_point + 'activities/' + item.activityId
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
            window.axios.delete(url, configUpdateLinks)
              .then(function (response) {
                vm.getActivitySource()
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageToastr('success', 'Xóa cuộc họp liên quan thành công')
              })
              .catch(function (error) {
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageByAPICode(error.response.status, error.response.data)
                console.log(error.response.status)
              })
            dialog.close()
          })
          .catch((e) => {
            console.log(e)
          })
      }
    },
    /* Load data activity */
    getActivity: function () {
      /* console.log('run get getActivity') */
      let vm = this
      vm.paramsGetActivity = {
        sort: 'startDate_Number',
        type: 'EVENT',
        order: true,
        start: vm.pagination.page * vm.pagination.rowsPerPage - vm.pagination.rowsPerPage,
        end: vm.pagination.page * vm.pagination.rowsPerPage,
        fromdate: vm.timeStart ? vm.parseDateFormat(vm.timeStart) : null,
        todate: vm.timeEnd ? vm.parseDateFormat(vm.timeEnd) : null,
        leader: vm.leaderModel ? vm.leaderModel : null,
        state: vm.visibilityModel ? vm.visibilityModel : null,
        hostingId: vm.hostingModel ? vm.hostingModel : null,
        activityCat: vm.eventTypeModel ? vm.eventTypeModel : null,
        subject: vm.keySearch ? vm.keySearch : null
      }
      vm.itemActivityEvent = []
      let configGetActivity = {
        params: vm.paramsGetActivity,
        headers: {
          groupId: vm.group_id
        }
      }
      let url = vm.end_point + 'activities'
      window.axios.get(url, configGetActivity).then(function (response) {
        let serializable = response.data
        let duplicateCount = 0
        if (serializable.hasOwnProperty('data')) {
          for (var key in serializable.data) {
            if (vm.itemEventLink.length !== 0) {
              let itemInv = true
              for (var keys in vm.itemEventLink) {
                if (serializable.data[key].activityId === vm.itemEventLink[keys].eventItem.activityId ||
                  serializable.data[key].activityId === vm.class_pk
                ) {
                  itemInv = false
                  duplicateCount += 1
                  break
                }
              }
              if (itemInv) {
                vm.itemActivityEvent.push(serializable.data[key])
              }
            } else {
              if (serializable.data[key].activityId !== vm.class_pk) {
                vm.itemActivityEvent.push(serializable.data[key])
              } else {
                duplicateCount += 1
              }
            }
          }
          vm.pagination.pages = Math.ceil((serializable.total - duplicateCount) / vm.pagination.rowsPerPage)
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    //
    timeStartChange: function (val) {
      let vm = this
      // vm.keySearch = ''
      vm.pagination.page = 1
      vm.timeStart = val
      vm.timeEndMin = vm.timeStart ? new Date(vm.timeStart) : ''
      vm.timeStartMax = vm.timeEnd ? new Date(vm.timeEnd) : ''
      vm.getActivity()
    },
    timeEndChange: function (val) {
      let vm = this
      // vm.keySearch = ''
      vm.pagination.page = 1
      vm.timeEnd = val
      vm.timeEndMin = vm.timeStart ? new Date(vm.timeStart) : ''
      vm.timeStartMax = vm.timeEnd ? new Date(vm.timeEnd) : ''
      vm.getActivity()
    },
    /** Lọc theo leader */
    getFilterLeader: function () {
      let vm = this
      vm.keySearch = ''
      vm.pagination.page = 1
      setTimeout(function () {
        vm.getActivity()
      }, 200)
    },
    // todo
    keywordSearch: function () {
      let vm = this
      vm.pagination.page = 1
      vm.getActivity()
      // vm.timeStart = ''
      // vm.timeEnd = ''
      // vm.leaderModel = ''
      // vm.visibilityModel = ''
      // vm.hostingModel = ''
      // vm.eventTypeModel = ''
    },
    //
    getActivityLink: function () {
      /* console.log('run get getActivity') */
      let vm = this
      vm.itemEventLink = []
      vm.linkItems = []
      let paramsGetActivityLink = {
        sort: 'startDate_Number',
        start: -1,
        end: -1
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
            if (serializable.data[key].activityType === 'EVENT') {
              Object.assign(serializable.data[key], {'links': true})
              vm.linkItems.push({
                eventItem: serializable.data[key],
                activitySourceItems: []
              })
            }
          }
        } else {
          vm.linkItems = []
        }
        vm.itemEventLink = vm.sourceItems.concat(vm.linkItems)
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    /** get list source group */
    getListActivitySource: function (classPk, index, isOpen) {
      if (!isOpen) {
        return isOpen
      }
      let vm = this
      vm.ownExpanded = true
      let paramsGetSource = {
        start: -1,
        end: -1
      }
      const configGetSource = {
        params: paramsGetSource,
        headers: {
          'groupId': vm.group_id
        }
      }
      if (vm.itemEventLink[index].activitySourceItems.length === 0) {
        window.axios.get(vm.end_point + 'activities/source/' + vm.activityClassName + '/' + classPk, configGetSource)
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              for (var key in serializable.data) {
                vm.itemEventLink[index].activitySourceItems.push(
                  serializable.data[key]
                )
              }
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    /** Check permision */
    managerPermision: function (permision) {
      if ('owner,leader'.indexOf(permision) >= 0) {
        return true
      } else {
        return false
      }
    },
    /** parse date */
    parseDateView: function (fullDate) {
      let date
      if (fullDate) {
        date = fullDate.getDate().toString().padStart(2, '0') + '/' + (fullDate.getMonth() + 1).toString().padStart(2, '0') + '/' + fullDate.getFullYear()
      } else {
        date = ''
      }
      return date
    },
    parseDateFormat: function (fullDate) {
      let date
      if (fullDate) {
        date = window.moment(fullDate).format('YYYYMMDD')
      } else {
        date = ''
      }
      return date
    },
    getActivitySource () {
      let vm = this
      let params = {
        'sourceType': vm.source_type,
        'start': -1,
        'end': -1
      }
      let config = {
        params: params,
        headers: {
          'groupId': vm.group_id
        }
      }
      vm.itemEventLink = []
      vm.sourceItems = []
      vm.countSource = 0
      let urlactivity = vm.end_point + 'activities/source/' + vm.class_name + '/' + vm.class_pk
      window.axios.get(urlactivity, config)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            for (var key in serializable.data) {
              if (serializable.data[key].editable !== 1) {
                vm.countSource = vm.countSource + 1
              }
              vm.sourceItems.push({
                eventItem: serializable.data[key],
                activitySourceItems: []
              })
            }
            vm.itemEventLink = vm.sourceItems.concat(vm.linkItems)
          } else {
            vm.activitySource = []
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<style>
</style>
