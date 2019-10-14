<template>
<div class="activity_kanban-wrapper">
  <div class="activity_kanban">
    <div class="list-kanban">
      <div class="head box layout justify-space-between align-center">
        <div>
          <span>Chưa thực hiện ({{ kanban_list.length }})</span>
        </div>
        <!--
        <div class="amount-per-page">
          <v-select
            :items="selectItems"
            solo light
            v-model="paginationSize"
            :nudge-top="appNudgeTop"
            :nudge-left="appNudgeLeft"
            @change="paginationPageChange"
          ></v-select>
        </div>
        -->
      </div>
      <div class="body box">
        <ul>
          <template v-for="(item,index) in kanban_list">
              <li :key="index" v-if="index < paginationSize">
                <i class="fa fa-caret-right"></i>
                <div class="flex">
                  <div class="d-flex">
                    <a @click="clickDetail(item.activityId)"
                      :title="item.subject"
                      :class="{'text-medium truncated': true, 'grey--text': item.editable===0}" slot="activator">{{ item.subject }}</a>
                    <div class="kanban-action">
                      <v-avatar :color="getPermissionColor(getPermissionText(item.permission))"
                        
                        v-if="staticRouter.path==='/follow'"
                        :size="18"
                        style="cursor: pointer;"
                      >
                        <span class="white--text inner-avt-text">{{getPermissionText(item.permission).charAt(0).toUpperCase()}}</span>
                      </v-avatar>
                      <v-btn v-else-if="staticRouter.actions.indexOf('share')>=0"
                        icon @click.stop="shareActivity(item)"
                      >
                        <v-icon>share</v-icon>
                      </v-btn>
                      
                      <v-btn icon @click.stop="infoActivity(item)"
                        v-if="item.treePath && staticRouter.actions.indexOf('info')>=0"
                      >
                        <v-icon>error_outline</v-icon>
                      </v-btn>
                      <v-btn icon @click.stop="_publishActivity(item.activityId, true)"
                        v-if="staticRouter.actions.indexOf('republish')>=0 && getPermissionText(item.permission) === 'owner'"
                      >
                        <v-icon>cached</v-icon>
                      </v-btn>
                      <v-btn icon
                        v-if="staticRouter.actions.indexOf('delete')>=0 && getPermissionText(item.permission) === 'owner'"
                        @click.stop="deleteActivity(item)"
                      >
                        <v-icon>cancel</v-icon>
                      </v-btn>
                    </div>
                  </div>
                  <div class="justify-space-between layout my-1">
                    <span v-if="compareDate(item.endDate) == 1" class="overdue">Quá hạn: {{ item.endDate | date }}</span>
                    <span v-if="compareDate(item.endDate) == 0" class="sub-text">Hạn hoàn thành: {{ item.endDate | date }}</span>
                    <v-menu 
                      :nudge-top="appNudgeTop - 21"
                      :nudge-left="appNudgeLeft"
                      transition="slide-x-transition" full-width style="display: -webkit-inline-box;">
                      <div slot="activator" medium @click="showState(item,index)" class="tag tag-unfulfilled" v-if="item.state==3">{{ item.stateName }}</div>
                      <div slot="activator" medium @click="showState(item,index)" class="tag tag-pause" v-else>{{ item.stateName }}</div>
                      <v-list>    
                        <v-list-tile v-for="(items,indexs) in kanban__Visibilities" :key="indexs" @click="changeState(items,indexs)">
                            <v-list-tile-title v-if="items.actionName=='Không có quyền'" style="color: red!important">
                              {{ items.actionName }}
                            </v-list-tile-title>
                            <v-list-tile-title v-else>
                              {{ items.actionName }}
                            </v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </div>
                  <!--
                  <div class="truncated sub-text" v-if="item.source.subject">
                    Nguồn công việc: {{ item.source.subject }}
                  </div>
                  -->
                </div>
              </li>
          </template>
        </ul>
      </div>
      <div class="pt-2 pb-2 layout center-all" v-show="paginationModel.length > 0"> <!-- -->
      
        <div class="select-page-size">
          <v-select
            :items="pageNumberItems"
            v-model="paginationSize"
            :width="55"
            :max-width="55"
            :min-width="55"
            no-data-text=""
            @input="paginationSizeChange"
          ></v-select>
        </div>
        <v-pagination v-if="!isLoading" 
          @input="paginationPageChange"
          v-model="paginationModel.page" :length="paginationModel.length">
        </v-pagination>
      </div>

    </div>
    <div class="list-kanban">
      <div class="head box layout justify-space-between align-center">
        <div>
          <span>Đang thực hiện ({{ kanban_list1.length }})</span>
        </div>
        <!--
        <div class="amount-per-page">
          <v-select
            :items="selectItems"
            solo light
            v-model="paginationSize1"
            :nudge-top="appNudgeTop"
            :nudge-left="appNudgeLeft"
            @change="paginationPageChange"
          ></v-select>
        </div>
        -->
      </div>
      <div class="body box">
        <ul>
          <template v-for="(item,index) in kanban_list1">
              <li :key="index" v-if="index < paginationSize1">
                <i class="fa fa-caret-right"></i>
                <div class="flex">
                  <div class="d-flex">
                    <a @click="clickDetail(item.activityId)"
                      :title="item.subject"
                      class="text-medium truncated" slot="activator">{{ item.subject }}</a>
                    <div class="kanban-action">
                      <v-avatar :color="getPermissionColor(getPermissionText(item.permission))"
                        
                        v-if="staticRouter.path==='/follow'"
                        :size="18"
                        style="cursor: pointer;"
                      >
                        <span class="white--text inner-avt-text">{{getPermissionText(item.permission).charAt(0).toUpperCase()}}</span>
                      </v-avatar>
                      <v-btn v-else-if="staticRouter.actions.indexOf('share')>=0"
                        icon @click.stop="shareActivity(item)"
                      >
                        <v-icon>share</v-icon>
                      </v-btn>
                      
                      <v-btn icon @click.stop="infoActivity(item)"
                        v-if="item.treePath && staticRouter.actions.indexOf('info')>=0"
                      >
                        <v-icon>error_outline</v-icon>
                      </v-btn>
                      <v-btn icon @click.stop="_publishActivity(item.activityId, true)"
                        v-if="staticRouter.actions.indexOf('republish')>=0 && getPermissionText(item.permission) === 'owner'"
                      >
                        <v-icon>cached</v-icon>
                      </v-btn>
                      <v-btn icon
                        v-if="staticRouter.actions.indexOf('delete')>=0 && getPermissionText(item.permission) === 'owner'"
                        @click.stop="deleteActivity(item)"
                      >
                        <v-icon>cancel</v-icon>
                      </v-btn>
                    </div>
                  </div>
                  <div class="justify-space-between layout my-1">
                    <span v-if="compareDate(item.endDate) == 1" class="overdue">Quá hạn: {{ item.endDate | date }}</span>
                    <span v-if="compareDate(item.endDate) == 0" class="sub-text">Hạn hoàn thành: {{ item.endDate | date }}</span>
                    <v-menu
                      :nudge-top="appNudgeTop - 21"
                      :nudge-left="appNudgeLeft"
                      transition="slide-x-transition" full-width style="display: -webkit-inline-box;">
                      <div slot="activator" medium @click="showState(item,index)" class="tag tag-underway" v-if="item.startend==1">{{ item.stateName }}</div>
                      <div slot="activator" medium @click="showState(item,index)" class="tag tag-pending" v-if="item.startend==2">{{ item.stateName }}</div>
                      <v-list>    
                        <v-list-tile v-for="(items,indexs) in kanban__Visibilities" :key="indexs" @click="changeState(items,indexs)">
                            <v-list-tile-title v-if="items.actionName=='Không có quyền'" style="color: red!important">
                              {{ items.actionName }}
                            </v-list-tile-title>
                            <v-list-tile-title v-else>
                              {{ items.actionName }}
                            </v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </div>
                  <!--
                  <div class="truncated sub-text" v-if="item.source.subject">
                    Nguồn công việc: {{ item.source.subject }}
                  </div>
                  -->
                </div>
              </li>
          </template>
        </ul>
      </div>
      <div class="pt-2 pb-2 layout center-all" v-show="paginationModel1.length > 0"> <!-- -->
      
        <div class="select-page-size">
          <v-select
            :items="pageNumberItems"
            v-model="paginationSize1"
            :width="55"
            :max-width="55"
            :min-width="55"
            no-data-text=""
            @input="paginationSize1Change"
          ></v-select>
        </div>
        <v-pagination v-if="!isLoading" 
          @input="paginationPageChange"
          v-model="paginationModel1.page" :length="paginationModel1.length">
        </v-pagination>
      </div>
    </div>
    <div class="list-kanban">
      <div class="head box layout justify-space-between align-center">
        <div>
          <span>Hoàn thành ({{ kanban_list2.length }})</span>
        </div>
        <!--
        <div class="amount-per-page">
          <v-select
            :items="selectItems"
            solo light
            v-model="paginationSize2"
            :nudge-top="appNudgeTop"
            :nudge-left="appNudgeLeft"
            @change="paginationPageChange"
          ></v-select>
        </div>
        -->
      </div>
      <div class="body box">
        <ul>
          <template v-for="(item,index) in kanban_list2">
              <li :key="index" v-if="index < paginationSize2">
                <i class="fa fa-caret-right"></i>
                <div class="flex">
                  <div class="d-flex">
                    <a @click="clickDetail(item.activityId)"
                      :title="item.subject"
                      class="text-medium truncated" slot="activator">{{ item.subject }}</a>
                    <div class="kanban-action">
                      <v-avatar :color="getPermissionColor(getPermissionText(item.permission))"
                        
                        v-if="staticRouter.path==='/follow'"
                        :size="18"
                        style="cursor: pointer;"
                      >
                        <span class="white--text inner-avt-text">{{getPermissionText(item.permission).charAt(0).toUpperCase()}}</span>
                      </v-avatar>
                      <v-btn v-else-if="staticRouter.actions.indexOf('share')>=0"
                        icon @click.stop="shareActivity(item)"
                      >
                        <v-icon>share</v-icon>
                      </v-btn>
                      
                      <v-btn icon @click.stop="infoActivity(item)"
                        v-if="item.treePath && staticRouter.actions.indexOf('info')>=0"
                      >
                        <v-icon>error_outline</v-icon>
                      </v-btn>
                      <v-btn icon @click.stop="_publishActivity(item.activityId, true)"
                        v-if="staticRouter.actions.indexOf('republish')>=0 && getPermissionText(item.permission) === 'owner'"
                      >
                        <v-icon>cached</v-icon>
                      </v-btn>
                      <v-btn icon
                        v-if="staticRouter.actions.indexOf('delete')>=0 && getPermissionText(item.permission) === 'owner'"
                        @click.stop="deleteActivity(item)"
                      >
                        <v-icon>cancel</v-icon>
                      </v-btn>
                    </div>
                  </div>
                  <!-- <a :href="'#/detail/' + item.activityId" class="text-medium truncated">{{ item.subject }}</a> -->
                  <div class="justify-space-between layout my-1">
                    <span v-if="compareDateFinished(item.endDate,item.finishDate) == 1" class="overdue">Quá hạn: {{ item.endDate | date }}</span>
                    <span v-if="compareDateFinished(item.endDate,item.finishDate) == 0" class="sub-text">Hạn hoàn thành: {{ item.endDate | date }}</span>
                    <v-menu 
                      :nudge-top="appNudgeTop - 21"
                      :nudge-left="appNudgeLeft"
                      transition="slide-x-transition" full-width style="display: -webkit-inline-box;">
                      <div slot="activator" medium @click="showState(item,index)" class="tag tag-finished">{{ item.stateName }}</div>
                      <v-list>    
                        <v-list-tile v-for="(items,indexs) in kanban__Visibilities" :key="indexs" @click="changeState(items,indexs)">
                            <v-list-tile-title v-if="items.actionName=='Không có quyền'" style="color: red!important">
                              {{ items.actionName }}
                            </v-list-tile-title>
                            <v-list-tile-title v-else>
                              {{ items.actionName }}
                            </v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </div>
                  <!--
                  <div class="truncated sub-text" v-if="item.source.subject">
                    Nguồn công việc: {{ item.source.subject }}
                  </div>
                  -->
                </div>
              </li>
          </template>
        </ul>
      </div>
      <div class="pt-2 pb-2 layout center-all" v-show="paginationModel2.length > 0"> <!-- -->
      
        <div class="select-page-size">
          <v-select
            :items="pageNumberItems"
            v-model="paginationSize2"
            :width="55"
            :max-width="55"
            :min-width="55"
            no-data-text=""
            @input="paginationSize2Change"
          ></v-select>
        </div>
        <v-pagination v-if="!isLoading" 
          @input="paginationPageChange"
          v-model="paginationModel2.page" :length="paginationModel2.length">
        </v-pagination>
      </div>
    </div>

  </div>

  <dia-log 
    :item = "[
      {
        width: '900px',
        model: showTreePathDialog,
      }]
    "
    :show_button=false
    @closeDialog="(val) => (showTreePathDialog = val)"
  >
    <template slot="header">
      Nguồn công việc
    </template>
    <template slot="content">
      <v-list>
        <template v-for="(item, index) in treePathItems">
          <v-list-tile
            :key="index"
          >
            <v-list-tile-content>
              <v-list-tile-title :style="'padding-left:' + (index * 10) + 'px'">{{ item }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider
            v-if="index + 1 < treePathItems.length"
            :key="index"
          ></v-divider>
        </template>
      </v-list>
    </template>
  </dia-log>
    <JxMobilinkShared v-if="activitySelected.activityId && staticRouter && staticRouter.actions.indexOf('share')>=0"
      :visibilities_api="end_point + 'visibilities'"
      :resourceworkspace_get_api="end_point + 'resourceworkspaces'"
      :resourceroles_get_api="end_point + 'resourceroles'"
      :resourceusers_get_api="end_point + 'resourceusers'"
      :changelogs_get_api="end_point + 'changelogs'"
      :class_name="activityClassName"
      :class_pk="activitySelected.activityId"
      :permission="activitySelected.permission"
      :constant_permission_key="constantPermissionKey"
      :only_slot_btn="true"
      ref="mobilinkshare222"
    >
      <template slot="slot_btn">
        <!-- comment share action @click.stop="shareActivity(scope.row)" -->
        <div></div>
      </template>
    </JxMobilinkShared>
</div>
  
</template>

<script>
  import { EventBus } from '@/eventbus'
  import JxMobilinkShared from '@/components/task/mobilink_shared.vue'

  const COMPONENT_NAME = 'jx-mobilink-activity-kanban'
  export default {
    name: COMPONENT_NAME,
    props: {
      active: {
        type: Boolean,
        default: true
      }
    },
    components: {
      JxMobilinkShared
    },
    mounted () {
      let vm = this
      vm.$nextTick(function () {
        if (!(Object.keys(vm.advancedSearchNewQueriesCPQueries).length === 0 &&
          vm.advancedSearchNewQueriesCPQueries.constructor === Object)) {
          vm.getKanban()
        }
      })
    },
    destroyed () {
      // delete this.active
      // delete this.staticRouter
      // delete this.kanban_list
      // delete this.kanban_list1
      // delete this.kanban_list2
      // delete this.kanban__Visibilities
      // delete this.class_pk
      // delete this.selectItems
      // delete this.paginationSize
      // delete this.paginationSize1
      // delete this.paginationSize2
      // delete this.paginationModel
      // delete this.paginationModel1
      // delete this.paginationModel2
      // delete this.isLoading
      // delete this.getApi
      // delete this.showTreePathDialog
      // delete this.treePathItems
      // delete this.activitySelected
      // delete this.staticRouter
      // delete this.clickDetail
      // delete this.compareDate
      // delete this.compareDateFinished
      // delete this.paginationSizeChange
      // delete this.paginationSize1Change
      // delete this.paginationSize2Change
      // delete this.paginationPageChange
      // delete this.getKanban
      // delete this.showState
      // delete this.initVisibilities
      // delete this.changeState
      // delete this.deleteActivity
      // delete this.shareActivity
      // delete this.infoActivity
      // delete this._publishActivity
    },
    watch: {
      active (val) {
        this.getKanban()
      },
      staticRouter (val) {
        this.getKanban()
      },
      advancedSearchNewQueriesCPQueries (val) {
        if (this.getApi) {
          this.getKanban()
        } else {
          this.getApi = true
        }
      }
    },
    data () {
      return {
        kanban_list: [],
        kanban_list1: [],
        kanban_list2: [],
        kanban__Visibilities: [],
        class_pk: '',
        selectItems: [5, 10, 15, 20],
        paginationSize: 10,
        paginationSize1: 10,
        paginationSize2: 10,
        paginationModel: {
          page: 1,
          length: 0
        },
        paginationModel1: {
          page: 1,
          length: 0
        },
        paginationModel2: {
          page: 1,
          length: 0
        },
        isLoading: false,
        getApi: true,
        showTreePathDialog: false,
        treePathItems: [],
        activitySelected: {}
      }
    },
    computed: {
      staticRouter () {
        return this.$store.getters.staticRouter
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
      clickDetail (id) {
        window.location = this.MSystemConfiguration.configuration.systemurl.taskurl + 'detail/' + id
      },
      compareDate (end) {
        if (Date.parse(window.moment(end).format('MM/DD/YYYY')) >= Date.parse(window.moment(new Date()).format('MM/DD/YYYY'))) {
          return 0
        } else {
          return 1
        }
      },
      compareDateFinished (end, finish) {
        if (Date.parse(window.moment(end).format('MM/DD/YYYY')) >= Date.parse(window.moment(finish).format('MM/DD/YYYY'))) {
          return 0
        } else {
          return 1
        }
      },
      paginationSizeChange () {
        this.paginationModel = {
          page: 1,
          length: 0
        }
        this.paginationPageChange()
      },
      paginationSize1Change () {
        this.paginationModel1 = {
          page: 1,
          length: 0
        }
        this.paginationPageChange()
      },
      paginationSize2Change () {
        this.paginationModel2 = {
          page: 1,
          length: 0
        }
        this.paginationPageChange()
      },
      paginationPageChange () {
        this.$store.dispatch('advancedSearch/updateAdvancedSearchNewQueries', {
          kanbanPageSize: this.paginationSize,
          kanbanPageNumber: this.paginationModel.page,
          kanbanPageSize1: this.paginationSize1,
          kanbanPageNumber1: this.paginationModel1.page,
          kanbanPageSize2: this.paginationSize2,
          kanbanPageNumber2: this.paginationModel2.page
        })
      },
      getKanban: function () {
        let vm = this
        if (!this.active) {
          return
        }
        vm.isLoading = true
        vm.paginationSize = this.$store.getters['advancedSearch/advancedSearchNewQueries'].kanbanPageSize || 10
        vm.paginationSize1 = this.$store.getters['advancedSearch/advancedSearchNewQueries'].kanbanPageSize1 || 10
        vm.paginationSize2 = this.$store.getters['advancedSearch/advancedSearchNewQueries'].kanbanPageSize2 || 10
        vm.paginationModel.page = this.$store.getters['advancedSearch/advancedSearchNewQueries'].kanbanPageNumber || 1
        vm.paginationModel1.page = this.$store.getters['advancedSearch/advancedSearchNewQueries'].kanbanPageNumber1 || 1
        vm.paginationModel2.page = this.$store.getters['advancedSearch/advancedSearchNewQueries'].kanbanPageNumber2 || 1
        let apiConfigHeader = {
          headers: {
            groupId: vm.group_id
          },
          params: {
            start: this.paginationModel.page * this.paginationSize - this.paginationSize,
            end: this.paginationModel.page * this.paginationSize,
            type: 'TASK'
          }
        }
        let apiConfigHeader1 = {
          headers: {
            groupId: vm.group_id
          },
          params: {
            start: this.paginationModel1.page * this.paginationSize1 - this.paginationSize1,
            end: this.paginationModel1.page * this.paginationSize1,
            type: 'TASK'
          }
        }
        let apiConfigHeader2 = {
          headers: {
            groupId: vm.group_id
          },
          params: {
            start: this.paginationModel2.page * this.paginationSize2 - this.paginationSize2,
            end: this.paginationModel2.page * this.paginationSize2,
            type: 'TASK'
          }
        }
        Object.assign(apiConfigHeader.params,
          vm.advancedSearchNewQueriesCPQueries,
          {sort: 'modified_Number', order: true})
        Object.assign(apiConfigHeader1.params,
          vm.advancedSearchNewQueriesCPQueries,
          {sort: 'modified_Number', order: true})
        Object.assign(apiConfigHeader2.params,
          vm.advancedSearchNewQueriesCPQueries,
          {sort: 'modified_Number', order: true})
        window.axios.all([
          window.axios.get(vm.end_point + 'activities?startend=0', apiConfigHeader),
          window.axios.get(vm.end_point + 'activities?startend=1,2&editable=1', apiConfigHeader1),
          window.axios.get(vm.end_point + 'activities?startend=3&editable=1', apiConfigHeader2)
        ])
          .then(window.axios.spread(function (response, response1, response2, response3) {
            let serializable = response.data
            let serializable1 = response1.data
            let serializable2 = response2.data
            vm.paginationModel.length = Math.ceil(Number(serializable.total) / vm.paginationSize)
            vm.paginationModel1.length = Math.ceil(Number(serializable1.total) / vm.paginationSize1)
            vm.paginationModel2.length = Math.ceil(Number(serializable2.total) / vm.paginationSize2)
            if (serializable.hasOwnProperty('data')) {
              vm.kanban_list = serializable.data
            } else {
              vm.kanban_list = []
            }
            if (serializable1.hasOwnProperty('data')) {
              vm.kanban_list1 = serializable1.data
            } else {
              vm.kanban_list1 = []
            }
            if (serializable2.hasOwnProperty('data')) {
              vm.kanban_list2 = serializable2.data
            } else {
              vm.kanban_list2 = []
            }
            vm.isLoading = false
          }))
          .catch(function (error) {
            console.log(error)
            vm.kanban_list = []
            vm.kanban_list1 = []
            vm.kanban_list2 = []
            vm.isLoading = false
          })
      },
      showState (item, index) {
        let vm = this
        vm.class_pk = item.activityId
        vm.initVisibilities()
      },
      initVisibilities (item, index) {
        let vm = this
        let config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        vm.kanban__Visibilities = []
        let url = vm.end_point + 'visibilities/' + vm.activityClassName + '/' + vm.class_pk + '/actions'
        window.axios.get(url, config).then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.kanban__Visibilities = serializable.data
          } else {
            vm.kanban__Visibilities = []
          }
          if (vm.kanban__Visibilities.length === 0) {
            vm.kanban__Visibilities = [{'actionName': 'Không có quyền'}]
          }
        })
          .catch(function (error) {
            console.log(error)
            vm.kanban__Visibilities = []
          })
      },
      changeState: function (items, indexs) {
        if (items.actionName !== 'Không có quyền') {
          let vm = this
          let config = {
            headers: {
              'groupId': vm.group_id
            }
          }
          let dataToAPI = new URLSearchParams()
          dataToAPI.append('state', items.state)
          let url = vm.end_point + 'visibilities/' + vm.activityClassName + '/' + vm.class_pk
          window.axios.put(url, dataToAPI, config).then(function (response) {
            setTimeout(function () {
              vm.getKanban()
            }, 1000)
          })
            .catch(function (error) {
              console.log(error)
            })
        }
      },
      deleteActivity (activity) {
        let vm = this
        vm.$dialog.confirm('Bạn có chắc chắn muốn thực hiện hành động này không?', {
          html: true,
          loader: true,
          okText: 'Xác nhận',
          cancelText: 'Quay lại',
          animation: 'fade'
        })
          .then(function (dialog) {
            vm.$store.dispatch('loading/setLoading', {
              loading: true,
              message: 'Xóa dữ liệu...'
            })
            let url = vm.end_point + 'activities/' + activity.activityId
            window.axios.delete(url, vm.apiConfigHeader)
              .then(function (response) {
                setTimeout(function () {
                  vm.getKanban()
                  EventBus.$emit('count_filter', true)
                }, 1000)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageToastr('success', 'Xóa công việc thành công')
              })
              .catch(function (error) {
                console.log(error)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
            dialog.close()
            return false
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      shareActivity (activity) {
        this.activitySelected = activity
        setTimeout(() => {
          this.$refs['mobilinkshare222'].sharedDialogFunc()
        }, 100)
      },
      infoActivity (activity) {
        this.treePathItems = activity.treePath.split('>')
        this.showTreePathDialog = true
      },
      _publishActivity (activityId, isLast) {
        let vm = this
        let url = vm.end_point + 'visibilities/' + this.activityClassName + '/' + activityId
        let paramsApiP = new URLSearchParams()
        paramsApiP.append('editable', 1)
        window.axios.put(url, paramsApiP, vm.apiConfigHeader)
          .then(function (response) {
            if (isLast) {
              setTimeout(function () {
                vm.getKanban()
              }, 1000)
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  }
</script>
<style type="text/css" scoped>
  .truncated {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .select-page-size {
    width: 55px;
    align-items: center;
    display: inline-flex;
  }
  .select-page-size .input-group {
    padding-top: 0px;
  }
  .select-page-size .input-group__details {
    min-height: 0px !important;
  }
  body .kanban-action {
    margin-left: auto;
    -webkit-flex-grow: 0 !important;
    flex-grow: 0 !important;
    -webkit-flex-shrink: 0 !important;
    flex-shrink: 0 !important;
    padding-left: 10px;
  }
  .kanban-action button {
    width: auto;
    height: auto;
    margin: 0;
  }
  .kanban-action button .icon {
    font-size: 18px !important;
  }
</style>