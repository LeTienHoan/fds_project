<template>
  <div class="statistic-detail">
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
        <tr class="layout wrap">
          <th class="flex xs1">STT</th>
          <th class="flex xs3">{{translate('ten_cong_viec')}}</th>
          <th class="flex xs2">{{translate('ngay_bat_dau')}}</th>
          <th class="flex xs2">{{translate('han_hoan_thanh')}}</th>
          <th class="flex xs2">{{translate('nguoi_giao_viec')}}</th>
          <th class="flex xs2">{{translate('nguoi_phu_trach')}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in activityStatisticsLogsItems" :key="'user-statistic' + index"
          class="layout wrap cursor_pointer"
          @click="detailActivity(item)"
        >
          <td class="text-xs-center flex xs1">{{pagination.page * paginationSize - paginationSize + index + 1}}</td>
          <td class="text-xs-left flex xs3">{{item.subject}}</td>
          <td class="text-xs-right flex xs2">{{item.startDate | date}}</td>
          <td class="text-xs-right flex xs2">{{item.endDate | date}}</td>
          <td class="text-xs-left flex xs2">{{item.leaderName}}</td>
          <td class="text-xs-left flex xs2">{{item.managerName || item.hosting}}</td>
        </tr>
      </tbody>
    </table>
    <div class="pt-2 layout center-all" v-show="paginationLength > 0"> <!-- -->
      
      <div class="select-page-size">
        <v-select
          :items="pageNumberItems"
          v-model="paginationSize"
          :width="55"
          :max-width="55"
          :min-width="55"
          no-data-text=""
          @input="changePageSize"
        ></v-select>
      </div>
      <v-pagination v-if="!isLoading" 
        @input="runDispatchStatisticLogs"
        v-model="pagination.page" :length="paginationLength">
      </v-pagination>
      
    </div>
  </div>
</template>

<script>

export default {
  props: {
    userStatistic: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    activityStatisticsLogsItems () {
      return this.$store.getters['activityStatistic/activityStatisticsLogsItems']
    },
    paginationLength () {
      let total = this.$store.getters['activityStatistic/activityStatisticsLogsTotalItems']
      return Math.ceil(Number(total || 0) / this.paginationSize)
    }
  },
  data () {
    return {
      isLoading: false,
      pagination: {
        page: 1
      },
      paginationSize: 5
    }
  },
  watch: {
    userStatistic (val) {
      this.pagination = {
        page: 1
      }
      this.runDispatchStatisticLogs()
    }
  },
  methods: {
    changePageSize () {
      this.pagination = {
        page: 1
      }
      this.runDispatchStatisticLogs()
    },
    runDispatchStatisticLogs () {
      let vm = this
      vm.isLoading = true
      const start = this.pagination.page * this.paginationSize - this.paginationSize
      const end = this.pagination.page * this.paginationSize
      this.$store.dispatch('activityStatistic/getActivityStatisticsLogs',
        Object.assign({
          start: start || 0,
          end: end || vm.paginationSize
        }, vm.userStatistic.queries)
      ).then(response => {
        vm.isLoading = false
      }, error => {
        console.log(error)
        vm.isLoading = false
      })
    },
    detailActivity (item) {
      window.location = this.MSystemConfiguration.configuration.systemurl.taskurl + 'detail/' + item.activityId
    }
  }
}
</script>

