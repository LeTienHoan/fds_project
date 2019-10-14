<template>
  <div class="mobilink-user-statistic fullwidth">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex">
          <v-icon>{{staticRouter.icon}}</v-icon>
          {{title}} <!--({{staticRouter.totalTreeResult}})-->
        </div>
      </template>
      <template slot="toolbar_right">
        <v-btn color="primary" class="btn--active btn-print-excel" outline
          @click="printExcelStatistic" icon
          :disabled="isprinting" :loading="isprinting"
        >
          <i class="fa fa-file-excel-o" aria-hidden="true"></i>
        </v-btn>
        <v-btn color="primary" class="btn--active" outline
          @click="printStatistic" icon
          :disabled="isprinting" :loading="isprinting"
        >
          <i class="fa fa-print" aria-hidden="true"></i>
        </v-btn>
      </template>
    </jx-mobilink-toolbar>
    <AdvancedSearch :active="showAdvanced" typeSelectMulti="user"
      @advancedSearchChange="advancedSearchChange"
      :initAdvancedSearch="advancedSearchQuery"
      ref="refAdvancedSearch"
    />
    <div class="text-xs-center fullwidth pt-3"
      v-if="isLoading"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
    <table v-else class="table table-default-override table-basic">
      <thead>
        <tr>
          <th rowspan="2">STT</th>
          <th rowspan="2">{{translate('ca_nhan')}}</th>
          <th rowspan="2">{{translate('tong_so')}}</th>
          <th rowspan="2">{{translate('tao_moi')}}</th>
          <th rowspan="2">{{translate('ton_truoc')}}</th>
          <th rowspan="2" class="tag-unfulfilled white--text">{{translate('chua_thuc_hien')}}</th>
          <th colspan="3" class="tag-underway white--text">{{translate('dang_thuc_hien')}}</th>
          <th colspan="5" class="tag-finished white--text">{{translate('da_hoan_thanh')}}</th>
        </tr>
        <tr>
          <th >{{translate('tong_so')}}</th>
          <th >{{translate('con_han')}}</th>
          <th >{{translate('tre_han')}}</th>
          <th >{{translate('tong_so')}}</th>
          <th >{{translate('dung_han')}}</th>
          <th >{{translate('qua_han')}}</th>
          <th>{{translate('diem_danh_gia_tb')}}</th>
          <th>{{translate('ty_le_qua_han')}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in statisticItems" :key="'user-statistic' + index"
        >
          <template v-if="index !== 0">
            <td class="text-xs-center">
              {{pagination.page * paginationSize - paginationSize + index}}
            </td>
            <td class="text-xs-left">
              {{item.userName}}
            </td>
            <td class="text-xs-right" :class="{'cursor_pointer': advancedSearchQuery.month}" @click="showDetail('tong_so', item, index)">
              {{item.tong_so}}
            </td>
            <td class="text-xs-right" :class="{'cursor_pointer': advancedSearchQuery.month}" @click="showDetail('tao_moi', item, index)">
              {{item.tao_moi}}
            </td>
            <td class="text-xs-right" :class="{'cursor_pointer': advancedSearchQuery.month}" @click="showDetail('ton_truoc', item, index)">
              {{item.ton_truoc}}
            </td>
            <td class="text-xs-right" :class="{'cursor_pointer': advancedSearchQuery.month}" @click="showDetail('chua_thuc_hien', item, index)">
              {{item.chua_thuc_hien}}
            </td>
            <td class="text-xs-right" :class="{'cursor_pointer': advancedSearchQuery.month}" @click="showDetail('dang_thuc_hien_tong_so', item, index)">
              {{item.dang_thuc_hien_tong_so}}
            </td>
            <td class="text-xs-right" :class="{'cursor_pointer': advancedSearchQuery.month}" @click="showDetail('dang_thuc_hien_con_han', item, index)">
              {{item.dang_thuc_hien_con_han}}
            </td>
            <td class="text-xs-right" :class="{'cursor_pointer': advancedSearchQuery.month}" @click="showDetail('dang_thuc_hien_tre_han', item, index)">
              {{item.dang_thuc_hien_tre_han}}
            </td>
            <td class="text-xs-right" :class="{'cursor_pointer': advancedSearchQuery.month}" @click="showDetail('da_hoan_thanh_tong_so', item, index)">
              {{item.da_hoan_thanh_tong_so}}
            </td>
            <td class="text-xs-right" :class="{'cursor_pointer': advancedSearchQuery.month}" @click="showDetail('da_hoan_thanh_dung_han', item, index)">
              {{item.da_hoan_thanh_dung_han}}
            </td>
            <td class="text-xs-right" :class="{'cursor_pointer': advancedSearchQuery.month}" @click="showDetail('da_hoan_thanh_qua_han', item, index)">
              {{item.da_hoan_thanh_qua_han}}
            </td>
            <td class="text-xs-right">
              {{item.da_hoan_thanh_diem_danh_gia_tb}}
            </td>
            <td class="text-xs-right grey--text">
              {{item.da_hoan_thanh_ty_le_qua_han}}
            </td>
          </template>
          <template v-else>
            <td colspan="2" class="text-xs-center text-font-bold">
              {{translate('tong_so')}}
            </td>
            <td class="text-xs-right text-font-bold">
              {{item.tong_so}}
            </td>
            <td class="text-xs-right text-font-bold">
              {{item.tao_moi}}
            </td>
            <td class="text-xs-right text-font-bold">
              {{item.ton_truoc}}
            </td>
            <td class="text-xs-right text-font-bold">
              {{item.chua_thuc_hien}}
            </td>
            <td class="text-xs-right text-font-bold">
              {{item.dang_thuc_hien_tong_so}}
            </td>
            <td class="text-xs-right text-font-bold">
              {{item.dang_thuc_hien_con_han}}
            </td>
            <td class="text-xs-right text-font-bold">
              {{item.dang_thuc_hien_tre_han}}
            </td>
            <td class="text-xs-right text-font-bold">
              {{item.da_hoan_thanh_tong_so}}
            </td>
            <td class="text-xs-right text-font-bold">
              {{item.da_hoan_thanh_dung_han}}
            </td>
            <td class="text-xs-right text-font-bold">
              {{item.da_hoan_thanh_qua_han}}
            </td>
            <td class="text-xs-right text-font-bold">
              {{item.da_hoan_thanh_diem_danh_gia_tb}}
            </td>
            <td class="text-xs-right text-font-bold grey--text">
              {{item.da_hoan_thanh_ty_le_qua_han}}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <div class="pt-2 layout center-all" v-show="pagination.length > 0"> <!-- -->
      
        <div class="select-page-size">
          <v-select
            :items="pageNumberItems"
            v-model="paginationSize"
            :width="55"
            :max-width="55"
            :min-width="55"
            no-data-text=""
            @input="pageSizeChange"
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
          model: detailDialog
        }]
      "
      :show_button="false"
      @closeDialog="(val) => (detailDialog = val)"
    >
      <template slot="header">
        {{statisticSelected.header}}
      </template>
      <template slot="content">
        <v-list class="pb-3">
          <v-list-tile class="grow">
          <v-avatar :size="35" class="pr-2">
            <img
              :src="statisticSelected.profileUrl"
              alt=""
            >
          </v-avatar>

          <v-list-tile-content>
            <v-list-tile-title v-html="statisticSelected.title"></v-list-tile-title>
          </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <UserStatisticDetail
          :userStatistic="statisticSelected"
        />
      </template>
    </dia-log>
  </div>
</template>

<script>

import AdvancedSearch from './AdvancedSearch'
import UserStatisticDetail from './UserStatisticDetail'
const COMPONENT_NAME = 'mobilink-user-statistic'
export default {
  name: COMPONENT_NAME,
  props: {
    name: {
      type: String,
      default: 'list'
    }
  },
  data () {
    return {
      isLoading: true,
      isprinting: false,
      showAdvanced: false,
      advancedSearchQuery: {
        year: Number(window.moment().format('YYYY')),
        month: Number(window.moment().format('MM')),
        statistic: 'all',
        statisticType: 1,
        workingUnit: ''
      },
      paginationSize: 40,
      pagination: {
        page: 1,
        length: 1
      },
      detailDialog: false,
      statisticSelected: {}
    }
  },
  components: {
    AdvancedSearch, UserStatisticDetail
  },
  computed: {
    staticRouter () {
      return this.$store.getters.staticRouter
    },
    title () {
      return this.translate('thong_ke').toUpperCase() + ' ' + this.translate(this.staticRouter.name).toUpperCase()
    },
    statisticItems () {
      return this.$store.getters['activityStatistic/userActivityStatisticItems']
    },
    monthAndYear () {
      let vm = this
      return (vm.advancedSearchQuery.month ? vm.translate('thang') + ' ' + vm.advancedSearchQuery.month + ', ' : '') +
        vm.translate('nam') + ' ' + vm.advancedSearchQuery.year
    },
    statisticName () {
      let vm = this
      const statisticName = vm.$refs.refAdvancedSearch.statisticItems.find(item => item.value === vm.advancedSearchQuery.statistic)
      return statisticName ? statisticName.text.toUpperCase() : ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.showAdvanced = true
      this.getListStatisticUser()
      console.log('ACTIVE USER STATISTC')
    })
  },
  methods: {
    pageSizeChange () {
      this.getListStatisticUser()
    },
    paginationPageChange () {
      this.getListStatisticUser(true)
    },
    advancedSearchChange (advancedSearchQuery) {
      this.advancedSearchQuery = advancedSearchQuery
      this.getListStatisticUser()
    },
    getListStatisticUser (changePage) {
      let vm = this
      vm.isLoading = true
      let queries = {}
      if (!changePage) {
        this.pagination = { page: 1, length: 0 }
      }
      queries.start = this.pagination.page * this.paginationSize - this.paginationSize
      queries.end = this.pagination.page * this.paginationSize
      Object.assign(queries, vm.advancedSearchQuery ? vm.advancedSearchQuery : {})
      this.$store.dispatch('activityStatistic/getUserActivityStatisticItems', queries).then(response => {
        vm.pagination.length = Math.ceil(Number(response.total) / vm.paginationSize)
        vm.isLoading = false
      }, error => {
        console.log(error)
        vm.isLoading = false
      })
    },
    printExcelStatistic () {
      let vm = this
      vm.isprinting = true
      let queries = {
        notSaveToStore: true,
        start: -1,
        end: -1,
        activityType: 'TASK',
        keyName: 'userName'
      }
      for (let key in vm.advancedSearchQuery) {
        if (vm.advancedSearchQuery[key] !== null && vm.advancedSearchQuery[key] !== '') {
          queries[key] = vm.advancedSearchQuery[key]
        }
      }
      let title = vm.translate('bao_cao').toUpperCase() + ' ' +
        vm.translate('thong_ke').toUpperCase() + ' ' + vm.statisticName
      let url = vm.end_point + '/activities/statistics/export'
      let comma = '?'
      for (let key in queries) {
        url += comma + key + '=' + queries[key]
        comma = '&'
      }
      let onsuccess = function () {
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        vm.isprinting = false
      }
      let onerror = function (error) {
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        vm.isprinting = false
        console.log(error)
      }
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Đang tải dữ liệu...'
      })
      window.downloadFile2({
        url: url,
        groupId: vm.group_id,
        fileName: title + '-' + vm.monthAndYear,
        extendName: true
      }, onsuccess, onerror)
    },
    printStatistic () {
      let vm = this
      vm.isprinting = true
      let queries = {
        notSaveToStore: true,
        start: -1,
        end: -1,
        activityType: 'TASK',
        keyName: 'userName'
      }
      for (let key in vm.advancedSearchQuery) {
        const value = vm.advancedSearchQuery[key]
        if (value !== null &&
          value !== '' &&
          value !== undefined
        ) {
          queries[key] = value
        }
      }
      this.$store.dispatch('activityStatistic/getActivityStatisticItems', queries).then(response => {
        vm.isprinting = false
        let title = vm.translate('bao_cao').toUpperCase() + ' ' +
          vm.translate('thong_ke').toUpperCase() + ' ' + vm.statisticName
        vm.printTaskStatistic(
          {
            labels: {
              title: title,
              end: vm.translate('het'),
              stt: 'STT',
              name: vm.translate('ca_nhan'),
              tong_so: vm.translate('tong_so'),
              tao_moi: vm.translate('tao_moi'),
              ton_truoc: vm.translate('ton_truoc'),
              chua_thuc_hien: vm.translate('chua_thuc_hien'),
              dang_thuc_hien: vm.translate('dang_thuc_hien'),
              da_hoan_thanh: vm.translate('da_hoan_thanh'),
              dang_thuc_hien_tong_so: vm.translate('tong_so'),
              dang_thuc_hien_con_han: vm.translate('con_han'),
              dang_thuc_hien_tre_han: vm.translate('tre_han'),
              da_hoan_thanh_tong_so: vm.translate('tong_so'),
              da_hoan_thanh_dung_han: vm.translate('dung_han'),
              da_hoan_thanh_qua_han: vm.translate('qua_han'),
              da_hoan_thanh_diem_danh_gia_tb: vm.translate('diem_danh_gia_tb'),
              da_hoan_thanh_ty_le_qua_han: vm.translate('ty_le_qua_han')
            },
            monthAndYear: vm.monthAndYear
          },
          response.data
        )
      }, error => {
        console.log(error)
        vm.isprinting = false
      })
    },
    showDetail (type, item, index) {
      // TODO: call API
      let vm = this
      if (!vm.advancedSearchQuery.month) {
        return
      }
      this.statisticSelected = {
        index: index,
        userName: item.userName,
        profileUrl: item.profileUrl || '/image/user_male_portrait',
        header: 'Danh sách công việc trong ' + vm.monthAndYear,
        queries: Object.assign(vm.advancedSearchQuery, {
          objectId: Number(item.managerId) || Number(item.leaderId) ||
            Number(item.hosterId) || Number(item.hostingId) ||
            Number(item.invitationId) || 0
        })
      }
      if (type === 'tong_so') {
        this.statisticSelected.queries.statisticColumnName = 'newCount,remainingCount'
        this.statisticSelected.title = `
          Danh sách tổng số công việc của <b>${item.userName}</b> (${vm.statisticName.toLowerCase()})
        `
      }
      if (type === 'tao_moi') {
        this.statisticSelected.queries.statisticColumnName = 'newCount'
        this.statisticSelected.title = `
          Danh sách công việc đã tạo mới của <b>${item.userName}</b> (${vm.statisticName.toLowerCase()})
        `
      }
      if (type === 'ton_truoc') {
        this.statisticSelected.queries.statisticColumnName = 'remainingCount'
        this.statisticSelected.title = `
          Danh sách công việc tồn trước của <b>${item.userName}</b> (${vm.statisticName.toLowerCase()})
        `
      }
      if (type === 'chua_thuc_hien') {
        this.statisticSelected.queries.statisticColumnName = 'unfulfilledOvertimeCount,unfulfilledOntimeCount'
        this.statisticSelected.title = `
          Danh sách công việc chưa thực hiện của <b>${item.userName}</b> (${vm.statisticName.toLowerCase()})
        `
      }
      if (type === 'dang_thuc_hien_tong_so') {
        this.statisticSelected.queries.statisticColumnName = 'processingOntimeCount,processingOvertimeCount'
        this.statisticSelected.title = `
          Danh sách tổng số công việc đang thực hiện của <b>${item.userName}</b> (${vm.statisticName.toLowerCase()})
        `
      }
      if (type === 'dang_thuc_hien_con_han') {
        this.statisticSelected.queries.statisticColumnName = 'processingOntimeCount'
        this.statisticSelected.title = `
          Danh sách công việc đang thực hiện còn hạn của <b>${item.userName}</b> (${vm.statisticName.toLowerCase()})
        `
      }
      if (type === 'dang_thuc_hien_tre_han') {
        this.statisticSelected.queries.statisticColumnName = 'processingOvertimeCount'
        this.statisticSelected.title = `
          Danh sách công việc đang thực hiện trễ hạn của <b>${item.userName}</b> (${vm.statisticName.toLowerCase()})
        `
      }
      if (type === 'da_hoan_thanh_tong_so') {
        this.statisticSelected.queries.statisticColumnName = 'finishOntimeCount,finishOvertimeCount'
        this.statisticSelected.title = `
          Danh sách tổng số công việc đã hoàn thành của <b>${item.userName}</b> (${vm.statisticName.toLowerCase()})
        `
      }
      if (type === 'da_hoan_thanh_dung_han') {
        this.statisticSelected.queries.statisticColumnName = 'finishOntimeCount'
        this.statisticSelected.title = `
          Danh sách công việc đã hoàn thành đúng hạn của <b>${item.userName}</b> (${vm.statisticName.toLowerCase()})
        `
      }
      if (type === 'da_hoan_thanh_qua_han') {
        this.statisticSelected.queries.statisticColumnName = 'finishOvertimeCount'
        this.statisticSelected.title = `
          Danh sách công việc đã hoàn thành quá hạn của <b>${item.userName}</b> (${vm.statisticName.toLowerCase()})
        `
      }
      this.detailDialog = true
    }
  }
}
</script>

<style lang="scss">
  .cursor_pointer {
    cursor: pointer;
  }
  .cursor_pointer:hover { 
    background-color: #e1e1e1;
  }
  .text-font-bold {
    font-weight: bold !important;
  }
</style>
