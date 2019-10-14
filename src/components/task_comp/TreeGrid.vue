<template lang="html">
  <div class="tree-list-grid-component">
    <ul class="switch-list" v-if="false">
      <li class="switch-item" v-for="item in propList">
        <span>{{ item.name }}: </span>
        <toggle-button class="mx-1 mb-0"
          v-model="props[item.name]"
          title_checked = "chon"
          title_unchecked = "k chon"
          :labels="{checked: 'on', unchecked: 'off'}"
          :color="{checked: '#7DCE94', unchecked: '#82C7EB'}"
          :width="50"/>
      </li>
    </ul>
    <v-slide-y-transition>
      <keep-alive>
        <div class="text-xs-center fullwidth pt-3"
          v-if="isLoading"
        >
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <ZkTable v-else
          ref="table"
          sum-text="sum"
          index-text="#"
          :data="dataaaa"
          :columns="gridColumns[columnType] || gridColumns['cong_viec_toi_tao']"
          :stripe="props.stripe"
          :border="props.border"
          :show-header="props.showHeader"
          :show-summary="props.showSummary"
          :show-row-hover="props.showRowHover"
          :show-index="props.showIndex"
          :tree-type="props.treeType"
          :is-fold="props.isFold"
          :expand-type="props.expandType"
          :selection-type="staticRouter.selectionType===true"
          @row-click="goToDetail"
          :empty-text="'Không có kết quả phù hợp'"
          :row-key="saveDataByIndex"
          :row-class-name="rowBoldCss"
        >
          <template slot="prioritytemplate" slot-scope="scope">
            <span :class="getPriorityColor(scope.row.priority)+'--text'">
              {{ getPriorityName(scope.row.priority) }}
            </span>
          </template>
          <template slot="startdatetemplate" slot-scope="scope">
            <span :class="{'grey--text': scope.row.editable===0}">
              {{ scope.row.startDate | date }}
            </span>
          </template>
          <template slot="enddatetemplate" slot-scope="scope">
            <span :class="{'grey--text': scope.row.editable===0}">
              <img src="/o/mobilink-theme/images/overdue.gif" style="width: 20px;height: 20px" v-if="timerOff(scope.row.endDate,scope.row.startend) == 1"/>
              <!-- <v-icon  style="color: red!important">timer_off</v-icon> -->
              {{ scope.row.endDate | date }}
            </span>
          </template>
          <template slot="managertemplate" slot-scope="scope">
            <span :class="{'grey--text': scope.row.editable===0}">
              {{ getManagerNameByAssignType(scope.row) }}
            </span>
          </template>
          <template slot="statetemplate" slot-scope="scope">
            <span :style="'color:' + getStatusTextColor(scope.row.state) + ';'">
              {{ scope.row.stateName }}
            </span>
          </template>
          <template slot="actions" slot-scope="scope">
            <v-avatar :color="getPermissionColor(getPermissionText(scope.row.permission))"
              @click.stop=""
              v-if="staticRouter.path==='/follow'"
              :size="18"
              style="cursor: pointer;"
            >
              <span class="white--text inner-avt-text">{{getPermissionText(scope.row.permission).charAt(0).toUpperCase()}}</span>
            </v-avatar>
            <v-btn v-else-if="staticRouter.actions && staticRouter.actions.indexOf('share')>=0"
              icon @click.stop="shareActivity(scope.row)"
            >
              <v-icon>share</v-icon>
            </v-btn>
            
            <v-btn icon @click.stop="infoActivity(scope.row)"
              v-if="scope.row.treePath && staticRouter.actions && staticRouter.actions.indexOf('info')>=0"
            >
              <v-icon>error_outline</v-icon>
            </v-btn>
            <v-btn icon @click.stop="_publishActivity(scope.row.activityId, true)"
              v-if="staticRouter.actions && staticRouter.actions.indexOf('republish')>=0 && getPermissionText(scope.row.permission) === 'owner'"
            >
              <v-icon>cached</v-icon>
            </v-btn>
            <v-btn icon
              v-if="staticRouter.actions && staticRouter.actions.indexOf('delete')>=0 && getPermissionText(scope.row.permission) === 'owner'"
              @click.stop="deleteActivity(scope.row)"
            >
              <v-icon>cancel</v-icon>
            </v-btn>
          </template>
          
        </ZkTable>
      </keep-alive>
    </v-slide-y-transition>
    <div class="pt-2 layout center-all" v-show="pagination.length > 0"> <!-- -->
      
        <div class="select-page-size">
          <v-select
            :items="pageNumberItems"
            v-model="paginationSize"
            :width="55"
            :max-width="55"
            :min-width="55"
            no-data-text=""
          ></v-select>
        </div>
        <v-pagination v-if="!isLoading" 
          @input="paginationPageChange"
          v-model="pagination.page" :length="pagination.length">
        </v-pagination>
      
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
      <template slot="content" slot-scope="props">
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
    <JxMobilinkShared v-if="activitySelected.activityId && staticRouter && staticRouter.actions && staticRouter.actions.indexOf('share')>=0"
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
      ref="mobilinkshare"
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
  import ZkTable from 'vue-table-with-tree-grid'
  export default {
    subject: 'gridtree',
    components: {
      ZkTable
    },
    props: {
      active: {
        type: Boolean,
        default: false
      },
      columnType: {
        type: String,
        default: 'cong_viec_toi_tao'
      }
    },
    watch: {
      active (val) {
        // this.getData()
      },
      paginationSize (val) {
        this.$store.dispatch('advancedSearch/updateAdvancedSearchNewQueries', {
          grid_paginationSize: val,
          grid_paginationPage: 1
        })
      },
      advancedSearchNewQueriesCPQueries: function (val) {
        this.getData()
      }
    },
    data () {
      return {
        isLoading: false,
        pagination: {
          page: 0,
          length: 0
        },
        paginationSize: 20,
        dataByIndex: {},
        showTreePathDialog: false,
        treePathItems: [],
        activitySelected: {},

        props: {
          stripe: false,
          border: true,
          showHeader: true,
          showSummary: false,
          showRowHover: true,
          showIndex: false,
          treeType: true,
          isFold: false,
          expandType: false,
          selectionType: false
        },
        dataaaa: [ /** {
          'endDate': '1525453200000',
          'startend': 1,
          'hosting': 'Lãnh đạo HĐND',
          'subject': 'Nhiệm vụ cuối tháng 4',
          'hasChildren': true,
          'resultNote': '',
          'description': 'Nội dung nhiệm vụ cuối tháng 4',
          'source': {'classPK': '0', 'subject': null, 'className': null},
          'managerName': '',
          'categoryName': 'Giải quyết khiếu nại tố cáo',
          'leaderId': '32787',
          'activityId': '1601',
          'activityCat': 'GQKNTC',
          'overdue': 0,
          'leaderJobTitle': 'Trưởng Phòng',
          'okrArchive': 4.2,
          'stateName': 'Đang thực hiện lại',
          'locationId': '0',
          'managerJobTitle': null,
          'customerId': '0',
          'state': 4,
          'createDate': '1524824622000',
          'preStartend': 1,
          'invitation': '',
          'permission': 'owner',
          'managerId': '0',
          'priority': 0,
          'userName': 'Tăng Quang Huy',
          'userId': '32787',
          'customerName': null,
          'leaderName': 'Tăng Quang Huy',
          'modifiedDate': '1525654543000',
          'visited': false,
          'progress': 100,
          'finishDate': '',
          'location': '',
          'activityType': 'TASK',
          'hostingId': '502',
          'projectName': '',
          'projectId': '0',
          'startDate': '1525107600000',
          'treePath': '',
          'geolocation': ''
        } */ ],
        gridColumns: {
          cong_viec_toi_tao: [
            {
              label: this.translate('cong_viec'),
              prop: 'subject',
              minWidth: '301px',
              headerAlign: 'center',
              align: 'left'
            },
            {
              label: this.translate('ngay_bat_dau'),
              prop: 'startDate',
              width: '95px',
              headerAlign: 'center',
              type: 'template',
              template: 'startdatetemplate',
              align: 'right'
            },
            {
              label: this.translate('han_hoan_thanh'),
              prop: 'endDate',
              width: '106px',
              headerAlign: 'center',
              type: 'template',
              template: 'enddatetemplate',
              align: 'right'
            },
            {
              label: this.translate('nguoi_giao_viec'),
              prop: 'leaderName',
              minWidth: '126px',
              headerAlign: 'center'
            },
            {
              label: this.translate('nguoi_phu_trach'),
              prop: 'managerName',
              minWidth: '110px',
              type: 'template',
              template: 'managertemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('trang_thai'),
              prop: 'stateName',
              width: '115px',
              type: 'template',
              template: 'statetemplate',
              headerAlign: 'center'
            },
            /*
            {
              label: this.translate('muc_do'),
              prop: 'priority',
              width: '96px',
              type: 'template',
              template: 'prioritytemplate',
              headerAlign: 'center'
            },
            */
            {
              label: this.translate('actions'),
              prop: 'likes',
              width: '93px',
              type: 'template',
              template: 'actions',
              headerAlign: 'center'
            }
          ],
          cong_viec_ca_nhan: [
            {
              label: this.translate('cong_viec'),
              prop: 'subject',
              minWidth: '301px',
              headerAlign: 'center',
              align: 'left'
            },
            {
              label: this.translate('ngay_bat_dau'),
              prop: 'startDate',
              width: '95px',
              headerAlign: 'center',
              type: 'template',
              template: 'startdatetemplate',
              align: 'right'
            },
            {
              label: this.translate('han_hoan_thanh'),
              prop: 'endDate',
              width: '106px',
              headerAlign: 'center',
              type: 'template',
              template: 'enddatetemplate',
              align: 'right'
            },
            {
              label: this.translate('nguoi_giao_viec'),
              prop: 'leaderName',
              minWidth: '126px',
              headerAlign: 'center'
            },
            {
              label: this.translate('nguoi_phu_trach'),
              prop: 'managerName',
              minWidth: '110px',
              type: 'template',
              template: 'managertemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('trang_thai'),
              prop: 'stateName',
              width: '115px',
              type: 'template',
              template: 'statetemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('actions'),
              prop: 'likes',
              width: '93px',
              type: 'template',
              template: 'actions',
              headerAlign: 'center'
            }
          ],
          cong_viec_toi_thuc_hien: [
            {
              label: this.translate('cong_viec'),
              prop: 'subject',
              minWidth: '301px',
              headerAlign: 'center',
              align: 'left'
            },
            {
              label: this.translate('ngay_bat_dau'),
              prop: 'startDate',
              width: '95px',
              headerAlign: 'center',
              type: 'template',
              template: 'startdatetemplate',
              align: 'right'
            },
            {
              label: this.translate('han_hoan_thanh'),
              prop: 'endDate',
              width: '106px',
              headerAlign: 'center',
              type: 'template',
              template: 'enddatetemplate',
              align: 'right'
            },
            {
              label: this.translate('nguoi_giao_viec'),
              prop: 'leaderName',
              minWidth: '126px',
              headerAlign: 'center'
            },
            {
              label: this.translate('nguoi_phu_trach'),
              prop: 'managerName',
              minWidth: '110px',
              type: 'template',
              template: 'managertemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('trang_thai'),
              prop: 'stateName',
              width: '115px',
              type: 'template',
              template: 'statetemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('muc_do'),
              prop: 'priority',
              width: '96px',
              type: 'template',
              template: 'prioritytemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('actions'),
              prop: 'likes',
              width: '33px',
              type: 'template',
              template: 'actions',
              headerAlign: 'center'
            }
          ],
          cong_viec_toi_phoi_hop: [
            {
              label: this.translate('cong_viec'),
              prop: 'subject',
              minWidth: '301px',
              headerAlign: 'center',
              align: 'left'
            },
            {
              label: this.translate('ngay_bat_dau'),
              prop: 'startDate',
              width: '95px',
              headerAlign: 'center',
              type: 'template',
              template: 'startdatetemplate',
              align: 'right'
            },
            {
              label: this.translate('han_hoan_thanh'),
              prop: 'endDate',
              width: '106px',
              headerAlign: 'center',
              type: 'template',
              template: 'enddatetemplate',
              align: 'right'
            },
            {
              label: this.translate('nguoi_giao_viec'),
              prop: 'leaderName',
              minWidth: '126px',
              headerAlign: 'center'
            },
            {
              label: this.translate('nguoi_phu_trach'),
              prop: 'managerName',
              minWidth: '110px',
              type: 'template',
              template: 'managertemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('trang_thai'),
              prop: 'stateName',
              width: '115px',
              type: 'template',
              template: 'statetemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('muc_do'),
              prop: 'priority',
              width: '96px',
              type: 'template',
              template: 'prioritytemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('actions'),
              prop: 'likes',
              width: '33px',
              type: 'template',
              template: 'actions',
              headerAlign: 'center'
            }
          ],
          cong_viec_toi_giao: [
            {
              label: this.translate('cong_viec'),
              prop: 'subject',
              minWidth: '301px',
              headerAlign: 'center',
              align: 'left'
            },
            {
              label: this.translate('ngay_bat_dau'),
              prop: 'startDate',
              width: '95px',
              headerAlign: 'center',
              type: 'template',
              template: 'startdatetemplate',
              align: 'right'
            },
            {
              label: this.translate('han_hoan_thanh'),
              prop: 'endDate',
              width: '106px',
              headerAlign: 'center',
              type: 'template',
              template: 'enddatetemplate',
              align: 'right'
            },
            {
              label: this.translate('nguoi_giao_viec'),
              prop: 'leaderName',
              minWidth: '126px',
              headerAlign: 'center'
            },
            {
              label: this.translate('nguoi_phu_trach'),
              prop: 'managerName',
              minWidth: '110px',
              type: 'template',
              template: 'managertemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('trang_thai'),
              prop: 'stateName',
              width: '115px',
              type: 'template',
              template: 'statetemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('muc_do'),
              prop: 'priority',
              width: '96px',
              type: 'template',
              template: 'prioritytemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('actions'),
              prop: 'likes',
              width: '63px',
              type: 'template',
              template: 'actions',
              headerAlign: 'center'
            }
          ],
          cong_viec_toi_theo_doi: [
            {
              label: this.translate('cong_viec'),
              prop: 'subject',
              minWidth: '301px',
              headerAlign: 'center',
              align: 'left'
            },
            {
              label: this.translate('ngay_bat_dau'),
              prop: 'startDate',
              width: '95px',
              headerAlign: 'center',
              type: 'template',
              template: 'startdatetemplate',
              align: 'right'
            },
            {
              label: this.translate('han_hoan_thanh'),
              prop: 'endDate',
              width: '106px',
              headerAlign: 'center',
              type: 'template',
              template: 'enddatetemplate',
              align: 'right'
            },
            {
              label: this.translate('nguoi_giao_viec'),
              prop: 'leaderName',
              minWidth: '126px',
              headerAlign: 'center'
            },
            {
              label: this.translate('nguoi_phu_trach'),
              prop: 'managerName',
              minWidth: '110px',
              type: 'template',
              template: 'managertemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('trang_thai'),
              prop: 'stateName',
              width: '115px',
              type: 'template',
              template: 'statetemplate',
              headerAlign: 'center'
            },
            /**
            {
              label: this.translate('muc_do'),
              prop: 'priority',
              width: '96px',
              type: 'template',
              template: 'prioritytemplate',
              headerAlign: 'center'
            },
            */
            {
              label: this.translate('actions'),
              prop: 'likes',
              width: '63px',
              type: 'template',
              template: 'actions',
              headerAlign: 'center'
            }
          ],
          tat_ca_cong_viec: [
            {
              label: this.translate('cong_viec'),
              prop: 'subject',
              minWidth: '301px',
              headerAlign: 'center',
              align: 'left'
            },
            {
              label: this.translate('ngay_bat_dau'),
              prop: 'startDate',
              width: '95px',
              headerAlign: 'center',
              type: 'template',
              template: 'startdatetemplate',
              align: 'right'
            },
            {
              label: this.translate('han_hoan_thanh'),
              prop: 'endDate',
              width: '106px',
              headerAlign: 'center',
              type: 'template',
              template: 'enddatetemplate',
              align: 'right'
            },
            {
              label: this.translate('nguoi_giao_viec'),
              prop: 'leaderName',
              minWidth: '126px',
              headerAlign: 'center'
            },
            {
              label: this.translate('nguoi_phu_trach'),
              prop: 'managerName',
              minWidth: '110px',
              type: 'template',
              template: 'managertemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('trang_thai'),
              prop: 'stateName',
              width: '115px',
              type: 'template',
              template: 'statetemplate',
              headerAlign: 'center'
            },
            /*
            {
              label: this.translate('muc_do'),
              prop: 'priority',
              width: '96px',
              type: 'template',
              template: 'prioritytemplate',
              headerAlign: 'center'
            },
            */
            {
              label: this.translate('actions'),
              prop: 'likes',
              width: '33px',
              type: 'template',
              template: 'actions',
              headerAlign: 'center'
            }
          ],
          luu_nhap: [
            {
              label: this.translate('cong_viec'),
              prop: 'subject',
              minWidth: '301px',
              headerAlign: 'center',
              align: 'left'
            },
            {
              label: this.translate('ngay_bat_dau'),
              prop: 'startDate',
              width: '95px',
              headerAlign: 'center',
              type: 'template',
              template: 'startdatetemplate',
              align: 'right'
            },
            {
              label: this.translate('han_hoan_thanh'),
              prop: 'endDate',
              width: '106px',
              headerAlign: 'center',
              type: 'template',
              template: 'enddatetemplate',
              align: 'right'
            },
            {
              label: this.translate('nguoi_giao_viec'),
              prop: 'leaderName',
              minWidth: '126px',
              headerAlign: 'center'
            },
            {
              label: this.translate('nguoi_phu_trach'),
              prop: 'managerName',
              minWidth: '110px',
              type: 'template',
              template: 'managertemplate',
              headerAlign: 'center'
            }
          ],
          thung_rac: [
            {
              label: this.translate('cong_viec'),
              prop: 'subject',
              minWidth: '301px',
              headerAlign: 'center',
              align: 'left'
            },
            {
              label: this.translate('ngay_bat_dau'),
              prop: 'startDate',
              width: '95px',
              headerAlign: 'center',
              type: 'template',
              template: 'startdatetemplate',
              align: 'right'
            },
            {
              label: this.translate('han_hoan_thanh'),
              prop: 'endDate',
              width: '106px',
              headerAlign: 'center',
              type: 'template',
              template: 'enddatetemplate',
              align: 'right'
            },
            {
              label: this.translate('nguoi_giao_viec'),
              prop: 'leaderName',
              minWidth: '126px',
              headerAlign: 'center'
            },
            {
              label: this.translate('nguoi_phu_trach'),
              prop: 'managerName',
              minWidth: '110px',
              type: 'template',
              template: 'managertemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('trang_thai'),
              prop: 'stateName',
              width: '115px',
              type: 'template',
              template: 'statetemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('actions'),
              prop: 'likes',
              width: '93px',
              type: 'template',
              template: 'actions',
              headerAlign: 'center'
            }
          ],
          cong_viec_trong_thu_muc: [
            {
              label: this.translate('cong_viec'),
              prop: 'subject',
              minWidth: '301px',
              headerAlign: 'center',
              align: 'left'
            },
            {
              label: this.translate('ngay_bat_dau'),
              prop: 'startDate',
              width: '95px',
              headerAlign: 'center',
              type: 'template',
              template: 'startdatetemplate',
              align: 'right'
            },
            {
              label: this.translate('han_hoan_thanh'),
              prop: 'endDate',
              width: '106px',
              headerAlign: 'center',
              type: 'template',
              template: 'enddatetemplate',
              align: 'right'
            },
            {
              label: this.translate('nguoi_giao_viec'),
              prop: 'leaderName',
              minWidth: '126px',
              headerAlign: 'center'
            },
            {
              label: this.translate('nguoi_phu_trach'),
              prop: 'managerName',
              minWidth: '110px',
              type: 'template',
              template: 'managertemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('trang_thai'),
              prop: 'stateName',
              width: '115px',
              type: 'template',
              template: 'statetemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('muc_do'),
              prop: 'priority',
              width: '96px',
              type: 'template',
              template: 'prioritytemplate',
              headerAlign: 'center'
            },
            {
              label: this.translate('actions'),
              prop: 'likes',
              width: '33px',
              type: 'template',
              template: 'actions',
              headerAlign: 'center'
            }
          ]
        }
      }
    },
    computed: {
      propList () {
        return Object.keys(this.props).map(item => ({
          name: item
        }))
      },
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
    mounted () {
      let vm = this
      this.$nextTick(() => {
        EventBus.$on('publish_selection_activity', function (val) {
          if (val) {
            vm.publishSelectionActivity()
          }
        })
        EventBus.$on('delete_selection_activity', function (val) {
          if (val) {
            vm.deleteSelectionActivity()
          }
        })
        vm.readly = true
        if (!(Object.keys(vm.advancedSearchNewQueriesCPQueries).length === 0 &&
          vm.advancedSearchNewQueriesCPQueries.constructor === Object)) {
          vm.getData()
        }
      })
    },
    destroyed () {
      EventBus.$off('publish_selection_activity')
      EventBus.$off('delete_selection_activity')
      // delete this.active
      // delete this.columnType
      // delete this.paginationSize
      // delete this.isLoading
      // delete this.pagination
      // delete this.paginationSize
      // delete this.dataByIndex
      // delete this.showTreePathDialog
      // delete this.treePathItems
      // delete this.activitySelected
      // delete this.props
      // delete this.dataaaa
      // delete this.gridColumns
      // delete this.propList
      // delete this.staticRouter
      // delete this.timerOff
      // delete this.getData
      // delete this.goToDetail
      // delete this.deleteActivity
      // delete this.shareActivity
      // delete this.infoActivity
      // delete this.publishSelectionActivity
      // delete this._publishActivity
      // delete this.deleteSelectionActivity
      // delete this._deleteActivity
      // delete this.saveDataByIndex
      // delete this.getManagerNameByAssignType
      // delete this.paginationPageChange
      // delete this.rowBoldCss
    },
    methods: {
      timerOff (endDate, startend) {
        if (this.$store.getters.staticRouter.path !== '/npublish' && this.$store.getters.staticRouter.path !== '/trash' && startend !== 3 && startend !== 4) {
          if (Date.parse(window.moment(Number(endDate)).format('MM/DD/YYYY')) >= Date.parse(window.moment(new Date()).format('MM/DD/YYYY'))) {
            return 0
          } else {
            return 1
          }
        }
      },
      getData () {
        let vm = this
        if (!this.active || !vm.readly || vm.isLoading) {
          return
        }
        vm.isLoading = true
        let url = (String(vm.advancedSearchNewQueriesCPQueries.editable) === String(2))
          ? this.end_point + 'activities' : this.end_point + 'activities/tree'
        let apiConfigHeader = {
          headers: {
            groupId: vm.group_id
          }
        }
        vm.paginationSize = vm.advancedSearchNewQueriesCP.grid_paginationSize || 20
        vm.pagination.page = vm.advancedSearchNewQueriesCP.grid_paginationPage || 1
        let start = this.pagination.page * this.paginationSize - this.paginationSize
        let end = this.pagination.page * this.paginationSize
        apiConfigHeader.params = {
          start: start,
          end: end,
          type: 'TASK'
        }
        Object.assign(apiConfigHeader.params,
          // vm.$route.meta.query || {},
          vm.advancedSearchNewQueriesCPQueries
        )
        window.axios.get(url, apiConfigHeader)
          .then(function (response) {
            let serializable = response.data
            vm.staticRouter.totalTreeResult = serializable.total
            vm.pagination.length = Math.ceil(Number(serializable.total) / vm.paginationSize)
            if (serializable.hasOwnProperty('data')) {
              vm.dataaaa = serializable.data
            } else {
              vm.dataaaa = []
            }
            vm.isLoading = false
          })
          .catch(function (error) {
            console.log(error)
            vm.dataaaa = []
            vm.isLoading = false
          })
      },
      goToDetail (row, rowIndex, $event) {
        if (!row.permission) {
          return
        }
        if (window.$($event.target).attr('class') !== 'zk-checkbox__inner') {
          if ($event.target.tagName === 'SPAN') {
            // this.$router.push('/detail/' + row.activityId)
            window.location = this.MSystemConfiguration.configuration.systemurl.taskurl + 'detail/' + row.activityId
          }
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
                EventBus.$emit('count_filter', true)
                vm.getData()
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
          this.$refs['mobilinkshare'].sharedDialogFunc()
        }, 100)
      },
      infoActivity (activity) {
        this.treePathItems = activity.treePath.split('>')
        this.showTreePathDialog = true
      },
      publishSelectionActivity () {
        let listSelect = this.$refs.table.getCheckedProp()
        for (let k in listSelect) {
          let activity = this.dataByIndex[listSelect[k]]
          this._publishActivity(activity.activityId, Number(k) === listSelect.length - 1)
        }
      },
      _publishActivity (activityId, isLast) {
        let vm = this
        let url = vm.end_point + 'visibilities/' + this.activityClassName + '/' + activityId
        let paramsApiP = new URLSearchParams()
        paramsApiP.append('editable', 1)
        window.axios.put(url, paramsApiP, vm.apiConfigHeader)
          .then(function (response) {
            if (isLast) {
              vm.isLoading = true
              setTimeout(() => {
                vm.isLoading = true
                EventBus.$emit('count_filter', true)
                vm.getData()
              }, 1000)
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      deleteSelectionActivity () {
        let listSelect = this.$refs.table.getCheckedProp()
        for (let k in listSelect) {
          let activity = this.dataByIndex[listSelect[k]]
          this._deleteActivity(activity.activityId, Number(k) === listSelect.length - 1)
        }
      },
      _deleteActivity (activityId, isLast) {
        let vm = this
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Xóa dữ liệu...'
        })
        let url = vm.end_point + 'activities/' + activityId
        window.axios.delete(url, vm.apiConfigHeader)
          .then(function (response) {
            if (isLast) {
              EventBus.$emit('count_filter', true)
              vm.getData()
            }
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          })
          .catch(function (error) {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            console.log(error)
          })
      },
      saveDataByIndex (row, index) {
        this.dataByIndex[index] = row
        return index
      },
      getManagerNameByAssignType (activity) {
        if (activity.activityId) {
          let result = activity.managerName
          switch (activity.assignType) {
            case 1:
              result = activity.managerName
              break
            case 2:
              result = activity.hosting
              break
            case 3:
              result = activity.jobPosTitle
              break
            default:
              result = activity.managerName
              break
          }
          return result
        } else {
          return ''
        }
      },
      paginationPageChange (val) {
        this.$store.dispatch('advancedSearch/updateAdvancedSearchNewQueries', {
          grid_paginationPage: val
        })
      },
      rowBoldCss (row, rowIndex) {
        if (row.visited) {
          return 'zkkkk'
        } else {
          return 'zkkkk text-font-bold'
        }
      }
    }
  }
</script>

<style lang="css">
  .zk-table {
    font-size: 13px;
  }

.zk-table {
  overflow: auto;
}

.zk-table__header-wrapper,
.zk-table__footer-wrapper {
  overflow: auto;
}

.zk-table__body-wrapper {
  overflow: auto;
}

.zk-table__header-cell,
.zk-table__body-cell,
.zk-table__footer-cell {
  overflow: auto;
}
.zk-table__cell-inner {
  /**
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  */
  padding: 5px 5px !important;
  cursor: pointer;
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
.text-font-bold {
  font-weight: bold;
}
</style>
