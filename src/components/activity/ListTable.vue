<template>
  <div class="calendar-list-wrapper fullwidth">
    <jx-mobilink-toolbar :extension="true">
        <template slot="toolbar_title">
          <v-menu :nudge-width="100"
            :nudge-top="appNudgeTop"
            :nudge-left="appNudgeLeft"
          >
            <div slot="activator">
              <v-btn icon>
                <v-icon dark>{{$router.currentRoute.meta.icon}}</v-icon>
              </v-btn> {{ title }} <v-icon>expand_more</v-icon>
            </div>
            <v-list>
              <v-list-tile v-for="(item, index) in staticRouters" :key="index"
                @click="goToLink(item.path)"
                :class="{primary: item.meta.icon === $router.currentRoute.meta.icon}"
              >
                <v-list-tile-title :class="{'white--text': item.meta.icon === $router.currentRoute.meta.icon}">
                  <v-icon :class="{'white--text': item.meta.icon === $router.currentRoute.meta.icon}">{{item.meta.icon}}</v-icon>
                  {{translate(item.name)}}
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </template>
        <template slot="forfilter">
          <v-layout class="align-center">
            <span  @click="clickToday" class="pointer">{{ dayName }}<span class="hideToday">, ngày {{ today | date }}</span></span>
            <v-btn icon @click.stop="goPrev">
              <v-icon class="goPrevClass">fast_rewind</v-icon>
            </v-btn>
            <v-flex sm3>
              <v-select
                :items="monthItems"
                item-text="text"
                item-value="value"
                v-model="month"
                label="month"
                auto
                solo  flat light
                @input="changeMonth"
              ></v-select>
            </v-flex>
            <v-btn  icon @click.stop="goNext">
              <v-icon class="goNextClass">fast_forward</v-icon>
            </v-btn>
            <v-flex sm3>
              <v-select
                :items="yearItems"
                item-text="text"
                item-value="value"
                v-model="year"
                label="year"
                auto
                solo  flat light
                @input="changeMonth"
              ></v-select>
            </v-flex>
          </v-layout>
        </template>
        <template slot="advanced_search">
          <v-btn icon @click="advanced_search = !advanced_search">
            <v-icon>view_module</v-icon>
          </v-btn>
        </template>
      </jx-mobilink-toolbar>
      <AdvancedSearch v-show="advanced_search" 
        @active="(val) => ( advanced_search = val )"
      ></AdvancedSearch>
      <div>
        <div class="tableEventList__class">
          <v-data-table
          id = "table_search"
          no-data-text = "Không có dữ liệu"
          :headers = "tableEventListheaders"
          :items = "tableEventListItems"
          class = "elevation-1"
          hide-actions
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-center">
                    <span :class="textBoldVisited(props.item.visited)">{{ props.index + 1 }}</span>
                </td>
                <td class="text-xs-center">
                    <span v-bind:title="props.item.startDate|datetime" :class="textBoldVisited(props.item.visited)">{{props.item.startDate|datetime}}</span>
                </td>
                <td class="text-xs-center">
                    <span v-bind:title="props.item.endDate|datetime" :class="textBoldVisited(props.item.visited)">{{props.item.endDate|datetime}}</span>
                </td>
                <td  class="">
                    <a href="javascript:;" v-on:click="goToDetail(props.item.activityId)">
                      <span v-bind:title="props.item.subject" :class="textBoldVisited(props.item.visited)">{{props.item.subject}}</span>
                    </a>
                </td>
                <td class="">
                    <span v-bind:title="props.item.leaderName" :class="textBoldVisited(props.item.visited)">{{props.item.leaderName}}</span>
                </td>
                <td class="">
                    <span v-bind:title="props.item.location" :class="textBoldVisited(props.item.visited)">{{props.item.location}}</span>
                </td>
                <td class="text-xs-center">
                    <v-icon @click="toRemoveEvent(props.item)" class="cursor-pointer"
                      v-if="props.item.permission=='owner'||
                        props.item.permission=='leader'||
                        props.item.permission=='hoster'||
                        props.item.permission=='manager'" 
                      icon color="red darken-3" title="Xóa">clear</v-icon>
                </td>
              </tr>
            </template>

            <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Không có kết quả phù hợp!
            </v-alert>
          </v-data-table>
          <div class="pt-2 text-xs-center layout center-all" v-if="tableEventListItems.length > 0">
            <div class="select-page-size align-center d-flex">
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
            <v-pagination v-model="paginationPage" :length="pagination"></v-pagination>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import AdvancedSearch from './AdvancedSearch'
export default {
  components: {
    AdvancedSearch
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.tableEventListheaders = [{
        text: '#',
        align: 'left',
        sortable: false,
        value: 'activityId'
      },
      {
        text: 'Ngày bắt đầu',
        align: 'left',
        sortable: false,
        value: 'startDate'
      },
      {
        text: 'Ngày kết thúc',
        align: 'left',
        sortable: false,
        value: 'endDate'
      },
      {
        text: 'Tên cuộc họp',
        align: 'left',
        sortable: false,
        value: 'subject'
      },
      {
        text: 'Người chủ trì',
        align: 'left',
        sortable: false,
        value: 'leader'
      },
      {
        text: 'Địa điểm',
        align: 'left',
        sortable: false,
        value: 'location'
      },
      {
        text: '',
        align: 'left',
        sortable: false,
        value: 'clear'
      }
      ]
    })
  },
  watch: {
    'paginationPage': {
      handler () {
        this.$store.dispatch('setPaginationPage', {
          pagination: this.paginationPage
        })
      }
    }
  },
  data () {
    return {
      tableEventListCout: 0,
      tableEventListheaders: [],
      paginationPage: 1,
      routerIcon: 'reorder',
      monthItems: [],
      yearItems: [],
      advanced_search: false,
      month: this.$store.getters.monthFilter,
      year: this.$store.getters.yearFilter,
      titleName: 'Danh sách lịch',
      today: new Date(),
      paginationSize: 5
    }
  },
  mounted () {
    this.$nextTick(() => {
      let arrTemp = []
      for (let i = 0; i <= 11; i++) {
        arrTemp.push({
          text: this.translate('thang') + ' ' + (i + 1),
          value: i
        })
      }
      this.monthItems = arrTemp
      arrTemp = []
      let curYear = window.moment().year()
      let max = this.year > curYear ? this.year : curYear
      let min = this.year < max - 10 ? this.year : max - 10
      for (let i = curYear; i >= min; i--) {
        arrTemp.push({
          text: this.translate('nam') + ' ' + i,
          value: i
        })
      }
      this.yearItems = arrTemp
      if (this.$router.currentRoute.meta.type === 'personal') {
        this.$store.dispatch('loadPersonalEvents')
      } else if (this.$router.currentRoute.meta.type === 'workspace') {
        this.$store.dispatch('loadActivities')
      }
      this.$store.dispatch('setDay')
    })
  },
  computed: {
    title () {
      // let keywords = this.$store.getters.keywords
      // keywords = keywords.length > 0 ? ' ,Tu khoa: ' + keywords : ''
      // let advancedSearch = this.$store.getters.advancedSearch
      // let advancedSearchStr = ''
      // for (let key in advancedSearch) {
      //   advancedSearchStr += ', ' + advancedSearch[key]['text'] +
      //     ': ' + advancedSearch[key]['text']
      // }
      return this.titleName
    },
    tableEventListItems () {
      let activities = this.$store.getters.loadedActivities.data
      return activities
    },
    pagination () {
      let vm = this
      return Math.ceil(vm.$store.getters.loadedActivities.total / vm.paginationSize)
    },
    staticRouters () {
      return this.$store.getters.staticRouters
    },
    dayName () {
      return this.$store.getters.dayName
    }
  },
  methods: {
    goToLink (path, icon) {
      this.$router.push(path)
    },
    goToDetail (id) {
      // this.$router.push('/detail/' + id)
      window.location = this.MSystemConfiguration.configuration.systemurl.eventurl + 'detail/' + id
    },
    clickToday () {
      let vm = this
      vm.month = window.moment().month() + 1
      vm.year = window.moment().year()
      vm.changeMonth()
    },
    changeMonth (item) {
      let vm = this
      if (vm.month !== vm.$store.getters.monthFilter || vm.year !== vm.$store.getters.yearFilter) {
        vm.$store.dispatch('setWeekMonthYear', {
          month: vm.month,
          year: vm.year
        })
      }
    },
    goPrev () {
      let vm = this
      vm.month = vm.month - 1
      if (vm.month === 0 && vm.year !== window.moment().year() - 10) {
        vm.month = 12
        vm.year = vm.year - 1
      } else if (vm.month === 0 && vm.year === window.moment().year() - 10) {
        vm.month = 12
        vm.year = window.moment().year()
      }
      vm.changeMonth()
    },
    goNext () {
      let vm = this
      vm.month = vm.month + 1
      if (vm.month > 12 && vm.year === window.moment().year()) {
        vm.month = 1
        vm.year = window.moment().year() - 10
      } else if (vm.month > 12 && vm.year !== window.moment().year()) {
        vm.month = 1
        vm.year = vm.year + 1
      }
      vm.changeMonth()
    },
    toRemoveEvent (item) {
      let vm = this
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
          vm.$store.dispatch('deleteActivity', item).then(response => {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          }, error => {
            console.log(error)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          })
          dialog.close()
          return false
        })
        .catch(function (e) {
          console.log(e)
        })
    },
    paginationSizeChange () {
      this.paginationPage = 1
      this.$store.dispatch('setPaginationSize', this.paginationSize)
    }
  }
}
</script>

<style>
  .tableEventList__class table th:nth-child(1),.tableEventList__class table td:nth-child(1) {
    width: 5%!important;
  }
  .tableEventList__class table th:nth-child(2),.tableEventList__class table td:nth-child(2) {
    width: 15%!important;
  }
  .tableEventList__class table th:nth-child(3),.tableEventList__class table td:nth-child(3) {
    width: 15%!important;
  }
  .tableEventList__class table th:nth-child(4),.tableEventList__class table td:nth-child(4) {
    width: 25%!important;
  }
  .tableEventList__class table th:nth-child(5),.tableEventList__class table td:nth-child(5) {
    width: 17%!important;
  }
  .tableEventList__class table th:nth-child(6),.tableEventList__class table td:nth-child(6) {
    width: 20%!important;
  }
  .tableEventList__class table th:nth-child(7),.tableEventList__class table td:nth-child(7) {
    width: 3%!important;
  }



  .tableEventList__class .column {
    float: none !important;
  }
  .tableEventList__class tr {
    height: auto !important;
  }
  .tableEventList__class th, .tableEventList__class td {
    vertical-align: middle !important;
  }
</style>