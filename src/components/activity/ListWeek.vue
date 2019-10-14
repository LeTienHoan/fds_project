
<template>
    <v-card class="calendar-list-wrapper fullwidth">
        <jx-mobilink-toolbar >
          <template slot="toolbar_title">
            <v-menu :nudge-width="100"
              :nudge-top="appNudgeTop"
              :nudge-left="appNudgeLeft"
            >
              <div slot="activator">
                <v-btn icon><v-icon dark>{{$router.currentRoute.meta.icon}}</v-icon></v-btn> {{ title }} <v-icon>expand_more</v-icon>
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
              <v-btn icon @click="printWeek" class="btn-print">
                <v-icon medium>print</v-icon>
              </v-btn>
              <v-btn icon @click.stop="goPrevWeek">
                <v-icon class="goPrevClass">fast_rewind</v-icon>
              </v-btn>
              <v-flex sm3>
                <v-select
                  :items="weekItems"
                  item-text="text"
                  item-value="value"
                  v-model="week"
                  label="week"
                  auto
                  solo  flat light
                  @input="changeWeekYear"
                ></v-select>
              </v-flex>
              <v-btn  icon @click.stop="goNextWeek">
                <v-icon class="goNextClass">fast_forward</v-icon>
              </v-btn>
              <v-btn icon @click.stop="goPrevMonth">
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
              <v-btn  icon @click.stop="goNextMonth">
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
                  @input="changeWeekYear"
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

        <v-expansion-panel expand>
          <v-expansion-panel-content v-for="(item, index) in formatEventsWeek" :key="index"
            v-bind:value="item.obj.length>0 && item.openDate == true" :class="todayClass(item)" class="block_first_week"
          >
              <div slot="header">
                <div>
                  {{ item.day }}&nbsp;&nbsp;&nbsp;
                  <span>{{ item.date }}</span>
                </div>
              </div>
              <v-card v-if="item.obj.length>0" >
                  <v-layout text-center wrap class="weekClass">
                      <v-flex xs1 class="week1Class px-2 py-2 text-bold" >
                          Buổi
                      </v-flex>
                      <v-flex xs11>
                          <v-layout wrap>
                              <v-flex xs1 class="week1Class px-2 py-2 text-bold">
                                  Bắt đầu
                              </v-flex>
                              <v-flex xs1 class="week1Class px-2 py-2 text-bold">
                                  Kết thúc
                              </v-flex>
                              <v-flex xs3 class="week1Class px-2 py-2 text-bold">
                                  Tên cuộc họp
                              </v-flex>
                              <v-flex xs2 class="week1Class px-2 py-2 text-bold">
                                  Chủ trì
                              </v-flex>
                              <v-flex xs3 class="week1Class px-2 py-2 text-bold">
                                  Thành phần
                              </v-flex>
                              <v-flex xs2 class="px-2 py-2 text-bold">
                                  Địa điểm
                              </v-flex>
                          </v-layout>
                      </v-flex>
                  </v-layout>
                  <v-layout wrap class="">
                      <v-flex xs1 class="week1Class text-xs-center center-all">
                          <div class="testWeek">
                              <div v-for="(items,indexs) in item.obj"
                                v-if="items.activityId && (compareDateMoment(items.startDate,items.endDate,item.dateMm._d) == 0 || compareDateMoment(items.startDate,items.endDate,item.dateMm._d) == 12)"
                                :key="indexs"
                              >
                                  Sáng
                              </div>
                          </div>
                      </v-flex>
                      <v-flex xs11>
                          <div v-for="(items,indexs) in item.obj"
                            :key="indexs" v-if="items.activityId"
                          >
                              <v-layout wrap class="weekClass" v-if="(compareDateMoment(items.startDate,items.endDate,item.dateMm._d) == 0 || compareDateMoment(items.startDate,items.endDate,item.dateMm._d) == 12)">
                                  <v-flex xs1 class="week1Class text-xs-center center-all">
                                    <div class="py-2"  v-if="compareDateStart(item.dateMm._d,items.startDate) == 0">
                                      {{ items.startDate|time }}
                                    </div>
                                    <div class="py-2"  v-if="compareDateStart(item.dateMm._d,items.startDate) == 1">
                                      08:30
                                    </div>
                                  </v-flex>
                                  <v-flex xs1 class="week1Class text-xs-center center-all">
                                      <div class="py-2" v-if="compareDateEnd(item.dateMm._d,items.endDate) == 0">
                                        {{ items.endDate|time }}
                                      </div>
                                      <div class="py-2" v-if="compareDateEnd(item.dateMm._d,items.endDate) == 1">
                                        12:00
                                      </div>
                                  </v-flex>
                                  <v-flex xs3 class="week1Class label_class align-center d-flex">
                                      <div class="px-2 py-2 hoverWeek">
                                          <a href="javascript:;" @click.stop.prevent="goToDetail(items.activityId)">
                                              <span>{{ items.subject }}</span>
                                          </a>
                                      </div>
                                  </v-flex>
                                  <v-flex xs2 class="week1Class label_class align-center d-flex">
                                      <div class="px-2 py-2">{{ items.leaderName }}</div>
                                  </v-flex>
                                  <v-flex xs3 class="week1Class label_class align-center d-flex">
                                      <div class="px-2 py-2">{{ items.invitation }}</div>
                                  </v-flex>
                                  <v-flex xs2 class="label_class align-center d-flex">
                                      <div class="px-2 py-2 hoverLocation">
                                          <a :href='"http://maps.google.com/?q=" +items.location' target="_blank" class="location_week">
                                              <v-icon v-if="items.location!=''" class="primary--text">place</v-icon> 
                                              <span>
                                              {{ items.location }}</span>
                                          </a>
                                      </div>
                                  </v-flex>
                              </v-layout>

                          </div>
                      </v-flex>
                  </v-layout>
                  <v-layout wrap class="weekClass_hidden_1" >
                  </v-layout>
                  <v-layout wrap>
                      
                      <v-flex xs1 class="week1Class text-xs-center center-all">
                          <div class="testWeek">
                                <div v-for="(items,indexs) in item.obj"
                                  :key="indexs"
                                  v-if="items.activityId && (compareDateMoment(items.startDate,items.endDate,item.dateMm._d) == 1 || compareDateMoment(items.startDate,items.endDate,item.dateMm._d) == 12)" >
                                  Chiều
                                </div>
                          </div>
                      </v-flex>
                      <v-flex xs11>
                          <div v-for="(items,indexs) in item.obj"
                            v-if="items.activityId" :key="indexs"
                          >
                              <v-layout wrap class=" weekClass" v-if="(compareDateMoment(items.startDate,items.endDate,item.dateMm._d) == 1 || compareDateMoment(items.startDate,items.endDate,item.dateMm._d) == 12)">
                                  <v-flex xs1 class="week1Class text-xs-center center-all">
                                      <div class="py-2" v-if="compareDateEnd(item.dateMm._d,items.startDate) == 0">
                                        13:30
                                      </div>
                                      <div class="py-2" v-if="compareDateEnd(item.dateMm._d,items.startDate) == 1">
                                         {{ items.startDate|time }}
                                      </div>
                                  </v-flex>
                                  <v-flex xs1 class="week1Class text-xs-center center-all">
                                      <div class="py-2" v-if="compareDateXX(item.dateMm._d,items.endDate) == 0">
                                        18:00
                                      </div>
                                      <div class="py-2" v-if="compareDateXX(item.dateMm._d,items.endDate) == 1">
                                        {{ items.endDate|time }}
                                      </div>
                                  </v-flex>
                                  <v-flex xs3 class="week1Class label_class align-center d-flex">
                                      <div class="px-2 py-2 hoverWeek">
                                          <a href="javascript:;" @click.stop.prevent="goToDetail(items.activityId)">
                                              <span>{{ items.subject  }}</span>
                                          </a>
                                      </div>
                                  </v-flex>
                                  <v-flex xs2 class="week1Class label_class align-center d-flex">
                                      <div class="px-2 py-2">{{ items.leaderName }}</div>
                                  </v-flex>
                                  <v-flex xs3 class="week1Class label_class align-center d-flex">
                                      <div class="px-2 py-2">{{ items.invitation }}</div>
                                  </v-flex>
                                  <v-flex xs2 class="label_class align-center d-flex">
                                      <div class="px-2 py-2 hoverLocation">
                                          <a :href='"http://maps.google.com/?q=" +items.location' target="_blank" class="location_week">
                                              <v-icon v-if="items.location!=''" class="primary--text">place</v-icon>
                                              <span> 
                                              {{ items.location }}</span>
                                          </a>
                                      </div>
                                  </v-flex>
                              </v-layout>
                              <v-layout wrap class="weekClass_hidden" v-if="indexs+1==item.obj.length">
                              </v-layout>
                          </div>
                      </v-flex>
                  </v-layout>
              </v-card>

          </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card>

</template>

<script>
import AdvancedSearch from './AdvancedSearch'
export default {

  data () {
    return {
      titleName: 'Lịch tuần',
      week: this.$store.getters.weekFilter,
      month: this.$store.getters.monthFilter,
      year: this.$store.getters.yearFilter,
      advanced_search: false,
      weekItems: [],
      monthItems: [],
      yearItems: [],
      listDaysInWeek: [],
      today: new Date(),
      openDate: true,
      click: false
    }
  },
  components: {
    AdvancedSearch
  },
  // created () {
  //   this.$nextTick(function () {
  //     let a = [1, 2, 3, 4, 6]
  //     let b = [8, 2, 9, 8, 2]
  //     for (var key in a) {
  //       for (var keys in b) {
  //         if (a[key] === b[keys]) {
  //           alert(a[key])
  //         }
  //         break
  //       }
  //     }
  //   })
  // },
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
    formatEventsWeek () {
      let vm = this
      let activities = this.$store.getters.loadedActivities.data
      let _listDaysInWeek = this.listDaysInWeek
      let _formatEventsWeek = []
      for (var key in _listDaysInWeek) {
        let days = window.moment(_listDaysInWeek[key]._d).day()
        let day = ''
        switch (days) {
          case 0:
            day = 'Chủ nhật'
            break
          case 1:
            day = 'Thứ hai'
            break
          case 2:
            day = 'Thứ ba'
            break
          case 3:
            day = 'Thứ tư'
            break
          case 4:
            day = 'Thứ năm'
            break
          case 5:
            day = 'Thứ sáu'
            break
          case 6:
            day = 'Thứ bảy'
            break
        }
        vm.openDate = true
        if (vm.click === true) {
          if (Date.parse(window.moment(_listDaysInWeek[key]._d).format('MM/DD/YYYY')) === Date.parse(window.moment(new Date()).format('MM/DD/YYYY'))) {
            vm.openDate = true
          } else {
            vm.openDate = false
          }
        }
        _formatEventsWeek.push({
          openDate: this.openDate,
          day: day,
          dateMm: _listDaysInWeek[key],
          date: _listDaysInWeek[key].format(vm.localeDateProperties.dateMomentPattern),
          obj: activities.filter(function (item) {
            return (window.moment(item.startDate).format(vm.localeDateProperties.dateMomentPattern) === _listDaysInWeek[key].format(vm.localeDateProperties.dateMomentPattern) || window.moment(item.endDate).format(vm.localeDateProperties.dateMomentPattern) === _listDaysInWeek[key].format(vm.localeDateProperties.dateMomentPattern) || (window.moment(item.startDate).format(vm.localeDateProperties.dateMomentPattern) < _listDaysInWeek[key].format(vm.localeDateProperties.dateMomentPattern) && _listDaysInWeek[key].format(vm.localeDateProperties.dateMomentPattern) < window.moment(item.endDate).format(vm.localeDateProperties.dateMomentPattern)))
          })
        })
      }
      return _formatEventsWeek
    },
    staticRouters () {
      return this.$store.getters.staticRouters
    },
    dayName () {
      return this.$store.getters.dayName
    }
  },
  methods: {
    changeMonth () {
      let vm = this
      let dayStart = new Date(vm.year, vm.month, 1)
      vm.week = window.moment(dayStart).week()
      vm.changeWeek()
    },
    todayClass (item) {
      let vm = this
      if (item.date === window.moment(new Date()).format(vm.localeDateProperties.dateMomentPattern)) {
        return 'todayClass'
      } else if (item.obj.length > 0) {
        return 'openClass'
      }
    },
    goToLink (path, icon) {
      this.$router.push(path)
    },
    goToDetail (id) {
      // this.$router.push('/detail/' + id)
      window.location = this.MSystemConfiguration.configuration.systemurl.eventurl + 'detail/' + id
    },
    changeWeekYear () {
      let vm = this
      vm.click = false
      let monthStart = window.moment().weekday(0).year(vm.year).week(vm.week)
      vm.month = monthStart.month()
      vm.changeWeek()
    },
    changeWeek (item) {
      let vm = this
      let w = vm.week
      let y = vm.year
      if (item < 54) {
        w = item
      } else if (item > 54) {
        y = item
      }
      let monthStart = window.moment().weekday(0).year(y).week(w)
      let months = monthStart.month()
      if (vm.month === months) {
        vm.month = months
      }
      let _listDaysInWeek = []
      for (var iii = 0; iii <= 6; iii++) {
        _listDaysInWeek.push(
          window.moment().weekday(iii).year(y).week(w)
        )
      }
      _listDaysInWeek = _listDaysInWeek.sort(function (a, b) { return a > b })
      vm.listDaysInWeek = _listDaysInWeek
      if (vm.week !== vm.$store.getters.weekFilter || vm.year !== vm.$store.getters.yearFilter) {
        vm.$store.dispatch('setWeekMonthYear', {
          week: vm.week,
          year: vm.year
        })
      }
    },
    compareDateMoment: function (date1, date2, day) {
      let start = window.moment(date1).format('MM/DD/YYYY HH:mm')
      let end = window.moment(date2).format('MM/DD/YYYY HH:mm')
      if (Date.parse(start) < Date.parse(window.moment(day).format('MM/DD/YYYY 12:00')) && Date.parse(end) > Date.parse(window.moment(day).format('MM/DD/YYYY 12:00'))) {
        return 12
      } else if (Date.parse(start) > Date.parse(window.moment(day).format('MM/DD/YYYY 12:00')) && Date.parse(end) < Date.parse(window.moment(day).format('MM/DD/YYYY 12:00'))) {
        return 12
      } else if (Date.parse(start) < Date.parse(window.moment(day).format('MM/DD/YYYY 12:00')) && Date.parse(end) < Date.parse(window.moment(day).format('MM/DD/YYYY 12:00'))) {
        return 0
      } else if (Date.parse(start) > Date.parse(window.moment(day).format('MM/DD/YYYY 12:00')) && Date.parse(end) > Date.parse(window.moment(day).format('MM/DD/YYYY 12:00'))) {
        return 1
      }
    },
    compareDateEnd: function (date1, date2) {
      let end = window.moment(date2).format('MM/DD/YYYY HH:mm')
      let day = window.moment(date1).format('MM/DD/YYYY 12:00')
      if (Date.parse(end) < Date.parse(day)) {
        return 0
      } else {
        return 1
      }
    },
    compareDateStart: function (date1, date2) {
      let start = window.moment(date2).format('MM/DD/YYYY HH:mm')
      let day = window.moment(date1).format('MM/DD/YYYY 08:30')
      if (Date.parse(start) > Date.parse(day)) {
        return 0
      } else {
        return 1
      }
    },
    compareDateXX: function (date1, date2) {
      let end = window.moment(date2).format('MM/DD/YYYY HH:mm')
      let day = window.moment(date1).format('MM/DD/YYYY 18:00')
      if (Date.parse(end) > Date.parse(day)) {
        return 0
      } else {
        return 1
      }
    },
    goPrevWeek () {
      let vm = this
      vm.week = vm.week - 1
      if (vm.week === 0 && vm.year !== window.moment().year() - 10) {
        vm.week = 53
        vm.year = vm.year - 1
      } else if (vm.week === 0 && vm.year === window.moment().year() - 10) {
        vm.week = 53
        vm.year = window.moment().year()
      }
      vm.click = false
      let monthStart = window.moment().weekday(0).year(vm.year).week(vm.week)
      vm.month = monthStart.month()
      vm.changeWeek()
    },
    goNextWeek () {
      let vm = this
      vm.week = vm.week + 1
      if (vm.week > 53 && vm.year === window.moment().year()) {
        vm.week = 1
        vm.year = window.moment().year() - 10
      } else if (vm.week > 53 && vm.year !== window.moment().year()) {
        vm.week = 1
        vm.year = vm.year + 1
      }
      vm.click = false
      let monthStart = window.moment().weekday(0).year(vm.year).week(vm.week)
      vm.month = monthStart.month()
      vm.changeWeek()
    },
    goPrevMonth () {
      let vm = this
      vm.month = vm.month - 1
      if (vm.month === -1) {
        vm.month = 11
      }
      vm.changeMonth()
    },
    goNextMonth () {
      let vm = this
      vm.month = vm.month + 1
      if (vm.month === 12) {
        vm.month = 0
      }
      vm.changeMonth()
    },
    clickToday () {
      let vm = this
      vm.week = window.moment().weeks()
      vm.month = window.moment().month()
      vm.year = window.moment().year()
      vm.click = true
      vm.changeWeek()
    },
    printWeek () {
      let vm = this
      let config = {
        headers: {
          'groupId': 20142,
          'accept': 'application/octet-stream'
        },
        responseType: 'blob'
      }
      let fromdate = window.moment().weekday(0).year(vm.year).week(vm.week).format('YYYYMMDD')
      let todate = window.moment().weekday(6).year(vm.year).week(vm.week).format('YYYYMMDD')
      let url = vm.end_point + 'activities/weekevents?sort=startDate_Number&order=true&fromdate=' +
        fromdate + '&todate=' + todate + '&template=false&type=EVENT&start=-1&end=-1'
      window.axios.get(url, config).then(function (response) {
        let blob = new Blob([response.data], { type: 'application/pdf' })
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob)
        } else {
          let fileURL = URL.createObjectURL(blob)
          let newWin = window.open(fileURL)
          newWin.focus()
          // newWin.reload()
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  mounted () {
    this.$nextTick(() => {
      let arrTemp = []
      for (let i = 1; i < 54; i++) {
        arrTemp.push({
          text: 'Tuần ' + i,
          value: i
        })
      }
      this.weekItems = arrTemp
      arrTemp = []
      for (let i = 0; i <= 11; i++) {
        arrTemp.push({
          text: this.translate('thang') + ' ' + (i + 1),
          value: i
        })
      }
      this.monthItems = arrTemp
      arrTemp = []
      let curYear = window.moment().year()
      for (let i = curYear; i >= curYear - 10; i--) {
        arrTemp.push({
          text: 'Năm ' + i,
          value: i
        })
      }
      this.yearItems = arrTemp
      this.changeWeek(this.week)
      this.$store.dispatch('loadActivities')
      this.$store.dispatch('setDay')
    })
  }
}
</script>
<style>
  .week1Class{
    border-right: 1px solid #ddd;

  }
  .weekClass{
    border-bottom: 1px solid #ddd;
    line-height: 18px;


  }
  .weekClass_hidden{
    border-bottom: 1px solid #fff;
    margin-top: -1px;

  }
  .weekClass_hidden_1{
    border-bottom: 1px solid #fff;
    margin-top: -1px;
    border-bottom: 1px solid #ddd;
  }
  .testWeek div:not(:first-child) {
    display: none;
  }
  .center-all {
    display: -webkit-box;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-align-items: center;
    align-items: center
  }
  .location_week{
    align-items: flex-start;
    display: flex;
  }
  a{
    text-decoration: none
  }
  @media only screen and (device-width: 768px) {
    .hideToday{
      display: none;
    }
    .block_first_week:not(:nth-child(-n+7)){
      display: none;
    }
  }
</style>