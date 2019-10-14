
<template>
    <v-card class="fullwidth">
      <jx-mobilink-toolbar >
          <template slot="toolbar_title">
            <v-menu :nudge-width="100"
              :nudge-top="appNudgeTop"
              :nudge-left="appNudgeLeft"
            >
              <div slot="activator">
                <v-icon dark>{{$router.currentRoute.meta.icon}}</v-icon> {{ title }} <v-icon>expand_more</v-icon>
              </div>
              <v-list>
                <template v-for="(item, index) in staticRouters">
                  <v-list-tile :key="index"
                    @click="goToLink(item.path)"
                    :class="{primary: item.meta.icon === $router.currentRoute.meta.icon}"
                    v-if="index !== staticRouters.length - 1"
                  >
                    <v-list-tile-title :class="{'white--text': item.meta.icon === $router.currentRoute.meta.icon}">
                      <v-icon :class="{'white--text': item.meta.icon === $router.currentRoute.meta.icon}">{{item.meta.icon}}</v-icon>
                      {{translate(item.name)}}
                    </v-list-tile-title>
                  </v-list-tile>
                </template>
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
        <div class="m-personal-event-week">
          <div :id="dpEl"></div>
        </div>
        <dia-log 
          :item = "[
            {
              width: '900px',
              model: add_personal_calendar,
              action: 'saveDialog1',
              edit: true,
              label: 'Lưu và thoát',
              icon: 'save'
            },
            {
              width: '900px',
              model: add_personal_calendar,
              action: 'saveDialog2',
              edit: true,
              label: 'Lưu và thêm mới',
              icon: 'save'
            },
            {
              width: '900px',
              model: add_personal_calendar,
              action: 'deleteAction',
              edit: clearOpen,
              label: 'Xóa',
              icon: 'clear'
            }
            ]
          "
          :show_button = editPersonalEvent
          @closeDialog="(val) => (add_personal_calendar = val)"
          @saveDialog1="saveDialog1"
          @saveDialog2="saveDialog2"
          @deleteAction="deleteEvent"
        >
          <template slot="header">
            <span>cập nhật lịch cá nhân</span>
          </template>
          <template slot="content">
            <JxMobilinkActivityAddPersonalCalendar ref="addcalendar"
              @add-personal-change="addPersonalChange"
              @close-dialog="(val) => (add_personal_calendar = val)"
            >
            </JxMobilinkActivityAddPersonalCalendar>
          </template>
        </dia-log>
        <v-menu
          v-model="eventMouseenterEvent.show"
          :position-x="eventMouseenterEvent.x - 40"
          :position-y="eventMouseenterEvent.y - appNudgeLeft + 20"
          content-class="detail-event-menu"
          :nudge-top="appNudgeTop"
          :nudge-left="appNudgeLeft"
          absolute
          offset-y
          top
        >
          <div class="event-content" v-show="eventMouseenterEvent.show">
            <div>
              <v-icon size="18" class="pr-1" color="primary">today</v-icon>{{ eventMouseenterEvent.subject }}
            </div>
            <div>
              <v-icon size="18" color="primary">place</v-icon> {{ eventMouseenterEvent.location }}
            </div>
          </div>
        </v-menu>
    </v-card>

</template>

<script>
import JxMobilinkActivityAddPersonalCalendar from './activity_add_personal_calendar.vue'
import AdvancedSearch from './AdvancedSearch'

function initDP (vm) {
  vm.dp = new window.DayPilot.Calendar(vm.dpEl)

  // view
  vm.dp.startDate = vm.startOfWeek.format('YYYY-MM-DD')
  vm.dp.viewType = 'Week'
  vm.dp.timeFormat = 'Clock12Hours'
  vm.dp.locale = vm.languageLong.toLowerCase()
  vm.dp.headerDateFormat = 'dddd'
  vm.dp.heightSpec = 'Full'

  vm.dp.settingCssCustome = function (inner, args) {
    if (args.start) {
      const start = new Date(args.start.ticks)
      // const today = new Date()
      // because start is UCT date
      const startStr = start.getUTCDate() + '-' + (start.getUTCMonth() + 1) + '-' + start.getUTCFullYear()
      // const todayStr = today.getUTCDate() + '-' + (today.getUTCMonth() + 1) + '-' + today.getUTCFullYear()
      inner.setAttribute('daycss', startStr)
      inner.setAttribute('uctdaycss', start.getUTCDay())
      /** let holiday = mHolidays.find(item => {
        const itemDate = new Date(item.holidayDate)
        const itemStr = itemDate.getDate() + '-' + (itemDate.getMonth() + 1) + '-' + itemDate.getFullYear()
        return startStr === itemStr
      })
      if (mWeekends.indexOf(start.getUTCDay()) >= 0) {
        inner.style.backgroundColor = '#eefff4'
      } else if (holiday) {
        inner.style.backgroundColor = '#ffeeee'
        inner.setAttribute('title', holiday.description)
      } else if (startStr === todayStr) {
        inner.style.backgroundColor = '#ffe'
      } */
    }
  }

  // event creating
  vm.dp.onTimeRangeSelected = function (args) {
    /** let name = prompt('New event name:', 'Event')
    if (!name) return
    vm.$store.dispatch('personalEvent/createPersonalEvent', {
      subject: name,
      startDate: IsoStringToTimeStamp(args.start),
      endDate: IsoStringToTimeStamp(args.end)
    }).then(response => {
      setDPStartDate(vm)
      // vm.dp.events.add(e)
    }, error => {
      console.log(error)
      window.showMessageByAPICode(error.response.status, error.response.data)
    }) */
    if (vm.isMyCalendar) {
      vm.add_personal_calendar = !vm.add_personal_calendar
      vm.editPersonalEvent = true
      vm.clearOpen = false
      vm.$refs.addcalendar.initData(new Date(IsoStringToTimeStamp(args.start)), new Date(IsoStringToTimeStamp(args.end)))
    }
    vm.dp.clearSelection()
  }

  vm.dp.onEventClick = function (args) {
    const personalEvent = args.e.data.personalEvent
    if (personalEvent.personalEventId) {
      const params = {
        startDate: new Date(IsoStringToTimeStamp(args.e.start())),
        endDate: new Date(IsoStringToTimeStamp(args.e.end())),
        title: personalEvent.subject,
        id: args.e.id(),
        locationId: personalEvent.locationId,
        confirm: personalEvent.confirm
      }
      vm.editPersonalEvent = 'owner, write'.indexOf(vm.getPermissionText(personalEvent.permission)) >= 0
      vm.editEvent(params)
    }
  }

  vm.dp.onEventMoved = function (args) {
    const personalEvent = args.e.data.personalEvent
    if (personalEvent.personalEventId && 'owner, write'.indexOf(vm.getPermissionText(personalEvent.permission)) >= 0) {
      vm.$store.dispatch('personalEvent/updatePersonalEvent', {
        personalEventId: args.e.id(),
        startDate: IsoStringToTimeStamp(args.e.start()),
        endDate: IsoStringToTimeStamp(args.e.end())
      }).then(response => {
        setDPStartDate(vm)
      }, error => {
        console.log(error)
        window.showMessageByAPICode(error.response.status, error.response.data)
      })
    } else {
      setDPStartDate(vm)
    }
  }

  vm.dp.onEventResized = function (args) {
    const personalEvent = args.e.data.personalEvent
    if (personalEvent.personalEventId && 'owner, write'.indexOf(vm.getPermissionText(personalEvent.permission)) >= 0) {
      vm.$store.dispatch('personalEvent/updatePersonalEvent', {
        personalEventId: args.e.id(),
        startDate: IsoStringToTimeStamp(args.e.start()),
        endDate: IsoStringToTimeStamp(args.e.end())
      }).then(response => {
        setDPStartDate(vm)
      }, error => {
        console.log(error)
        window.showMessageByAPICode(error.response.status, error.response.data)
      })
    } else {
      setDPStartDate(vm)
    }
  }

  // vm.dp.eventDeleteHandling = 'Update'
  vm.dp.onEventDelete = function (args) {
    args.preventDefault()
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
        vm.$store.dispatch('personalEvent/deletePersonalEvent', args.e.id()
        ).then(response => {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          setDPStartDate(vm)
        }, error => {
          console.log(error)
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
        dialog.close()
        return false
      })
      .catch(function (e) {
        // args.preventDefault()
        console.log(e)
      })
  }

  vm.dp.init()

  window.showSharedPersionalEvent = function (jsEvent) {
    jsEvent.preventDefault()
    jsEvent.stopPropagation()
  }

  window.onHoverPersionalEvent = function (jsEvent) {
    jsEvent.preventDefault()
    jsEvent.stopPropagation()
    let event = vm.computedPersonalEventItems.find(item => item.personalEventId === Number(jsEvent.target.id))
    vm.eventMouseenterEvent = event
    vm.eventMouseenterEvent.x = jsEvent.clientX
    vm.eventMouseenterEvent.y = jsEvent.clientY
    vm.eventMouseenterEvent.show = true
  }

  window.onLeaverPersionalEvent = function (jsEvent) {
    jsEvent.preventDefault()
    jsEvent.stopPropagation()
    vm.eventMouseenterEvent = {}
  }
  /** let dddddd = vm.dp.startDate
  let e = new window.DayPilot.Event({
    start: new window.DayPilot.Date(dddddd),
    end: new window.DayPilot.Date(dddddd).addHours(3),
    id: window.DayPilot.guid(),
    text: mapPersonalEventToDayPilotEvent('Special event'),
    'backColor': '#EA9999',
    'borderColor': '#fff'
  })
  vm.dp.events.add(e) */
  setDPStartDate(vm, true)
}
function IsoStringToTimeStamp (str) {
  let date = str.value.split('T')
  return window.moment(date[0] + ' ' + date[1], 'YYYY-MM-DD HH:mm:SS').toDate().getTime()
}
function timeStampToIsoString (time) {
  let date = window.moment(time)
  return date.format('YYYY-MM-DD') + 'T' + date.format('HH:mm') + ':00'
}
function mapPersonalEventToDayPilotEvent (e, color) {
  const result = {
    start: timeStampToIsoString(e.startDate),
    end: timeStampToIsoString(e.endDate),
    id: e.personalEventId,
    text: '<span class="white--text" onmouseover="onHoverPersionalEvent(event)" onmouseout="onLeaverPersionalEvent(event)" id="' + e.personalEventId + '">' +
      '  <i onclick="showSharedPersionalEvent(event)" style="font-size: 16px !important; color: white !important; vertical-align: bottom;" ' +
      '    id="' + e.personalEventId + '" aria-hidden="true" class="icon material-icons white--text">' + (e.personalEventId ? 'person' : 'event_available') + '</i>' +
      '  ' + e.subject +
      '</span>',
    personalEvent: e,
    backColor: '#8bc34a',
    borderColor: '#fff'
  }
  return result
}

function setDPStartDate (vm, waitting) {
  /**
  let dateCrr = momentDate.format('YYYY-MM-DD')
  let dateCrr2 = momentDate.clone().weekday(0).format('YYYY-MM-DD')
  let dateCrr3 = momentDate.clone().weekday(1).format('YYYY-MM-DD')
  let dateCrr4 = momentDate.clone().weekday(2).format('YYYY-MM-DD')
  let dateCrr5 = momentDate.clone().weekday(3).format('YYYY-MM-DD')
  vm.dp.startDate = dateCrr
  vm.dp.events.list = [
    {
      'start': dateCrr + 'T10:00:00',
      'end': dateCrr + 'T13:00:00',
      'id': '23ef6fcd-e12d-b085-e38a-a4e23d0bb61d',
      'text': mapPersonalEventToDayPilotEvent('Event 1'),
      'backColor': '#FFC107',
      'borderColor': '#fff'
    },
    {
      'start': dateCrr2 + 'T11:00:00',
      'end': dateCrr2 + 'T14:00:00',
      'id': 'fb62e2dd-267e-ec91-886b-73574d24e25a',
      'text': mapPersonalEventToDayPilotEvent('Event 2'),
      'backColor': '#F44336',
      'borderColor': '#fff'
    },
    {
      'start': dateCrr3 + 'T10:00:00',
      'end': dateCrr3 + 'T13:00:00',
      'id': '29b7a553-d44f-8f2c-11e1-a7d5f62eb123',
      'text': mapPersonalEventToDayPilotEvent('Event 3'),
      'backColor': '#00BCD4',
      'borderColor': '#fff'
    },
    {
      'start': dateCrr4 + 'T14:00:00',
      'end': dateCrr5 + 'T17:00:00',
      'id': 'ff968cfb-eba1-8dc1-7396-7f0d4f465c8a',
      'text': mapPersonalEventToDayPilotEvent('Event 4'),
      'backColor': '#8BC34A',
      'borderColor': '#fff',
      'tags': {
        'type': 'important'
      }
    }
  ] */
  if (waitting) {
    setTimeout(() => {
      watingAFewMinute(vm)
    }, 500)
  } else {
    watingAFewMinute(vm)
  }
}

function watingAFewMinute (vm) {
  let data = vm.computedPersonalEventItems
  let rs = data.map(item => {
    // vm.getStatusTextColor(1)
    return mapPersonalEventToDayPilotEvent(item, vm.personalEventColorByConfirmCode(item.confirm))
  })
  vm.dp.startDate = vm.startOfWeek.format('YYYY-MM-DD')
  vm.dp.events.list = rs
  vm.dp.update()
}

export default {

  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dpEl: 'dp' + this.id,
      titleName: 'Lịch tuần',
      week: this.$store.getters.weekFilter,
      month: this.$store.getters.monthFilter,
      year: this.$store.getters.yearFilter,
      advanced_search: false,
      weekItems: [],
      monthItems: [],
      yearItems: [],
      today: new Date(),
      // add component
      add_personal_calendar: false,
      editPersonalEvent: true,
      clearOpen: false,
      eventMouseenterEvent: {}
    }
  },
  components: {
    JxMobilinkActivityAddPersonalCalendar,
    AdvancedSearch
  },
  computed: {
    title () {
      return this.titleName
    },
    staticRouters () {
      return this.$store.getters.staticRouters
    },
    dayName () {
      return this.$store.getters.dayName
    },
    computedPersonalEventItems () {
      return this.$store.getters['personalEvent/personalEventItems']
    }
  },
  watch: {
    computedPersonalEventItems () {
      if (this.dp) {
        setDPStartDate(this)
      }
    },
    '$route.params.id' (val) {
      this.isMyCalendar = Number(val) === 0
    },
    year (val) {
      this.setCssBackgroundColor()
    }
  },
  methods: {
    addPersonalChange () {
      setDPStartDate(this)
    },
    saveDialog1 () {
      this.$refs.addcalendar.saveAndExit()
      this.add_personal_calendar = false
    },
    saveDialog2 () {
      this.$refs.addcalendar.saveAndAddNew()
    },
    editEvent (item) {
      this.add_personal_calendar = !this.add_personal_calendar
      this.clearOpen = true
      this.$refs.addcalendar.initData(item.startDate, item.endDate, item.title, item.id, item.locationId, item.confirm)
    },
    deleteEvent () {
      this.$refs.addcalendar.deleteEvent()
    },
    changeMonth () {
      let vm = this
      let dayStart = new Date(vm.year, vm.month, 1)
      vm.week = window.moment(dayStart).week()
      vm.changeWeek()
    },
    goToLink (link, icon) {
      this.$router.push(link)
    },
    goToDetail (id) {
      this.$router.push('/detail/' + id)
    },
    changeWeekYear () {
      let vm = this
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
      if (vm.week !== vm.$store.getters.weekFilter || vm.year !== vm.$store.getters.yearFilter) {
        vm.$store.dispatch('setWeekMonthYear', {
          week: vm.week,
          year: vm.year
        })
      }
      // start of week in day pilot have to sunday of week
      this.startOfWeek = window.moment().weekday(6).year(vm.year).week(vm.week)
      if (this.dp) {
        setDPStartDate(this, true)
      } else {
        initDP(this)
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
      vm.changeWeek()
    },
    printWeek () {
      let dpEl = this.dpEl
      let divToPrint = document.getElementById(dpEl)
      let newWin = window.open('')
      newWin.document.write(divToPrint.outerHTML)
      newWin.print()
      newWin.close()
    },
    setCssBackgroundColor () {
      let vm = this
      let css = ''
      const mWeekendsNmHolidays = this.mWeekendsNmHolidays[String(vm.year)] || {}
      const mWeekends = mWeekendsNmHolidays.mWeekends || []
      const mHolidays = mWeekendsNmHolidays.mHolidays || []
      for (let i in mWeekends) {
        css += '[uctdaycss="' + mWeekends[i] + '"] {background: #eefff4 !important;} '
      }
      for (let i in mHolidays) {
        const itemDate = new Date(Number(mHolidays[i].holidayDate))
        const itemStr = itemDate.getDate() + '-' + (itemDate.getMonth() + 1) + '-' + itemDate.getFullYear()
        css += '[daycss="' + itemStr + '"] {background: #ffeeee !important;} '
        css += '[daycss="' + itemStr + '"]:hover:after { content: "' + mHolidays[i].description.substring(0, 25) + '...' + '"; position: absolute; display: inline-block; left: 10px; padding: 3px 0px; max-width: calc(100% - 20px); } '
      }
      const todayStr = new Date().getUTCDate() + '-' + (new Date().getUTCMonth() + 1) + '-' + new Date().getUTCFullYear()
      css += '[daycss="' + todayStr + '"] {background: #ffe !important;} '
      let head = document.head || document.getElementsByTagName('head')[0]
      let style = document.createElement('style')
      style.type = 'text/css'
      if (style.styleSheet) {
        style.styleSheet.cssText = css
      } else {
        style.appendChild(document.createTextNode(css))
      }
      head.appendChild(style)
    }
  },
  created () {
    this.$nextTick(() => {
      this.$store.dispatch('loadPersonalEvents')
      this.setCssBackgroundColor()
    })
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
      if (this.$route.params.id > 0) {
        this.$store.dispatch('setNaviFilter', {query: {personalId: Number(this.$route.params.id) || ''}})
      } else {
        this.isMyCalendar = true
      }
      this.changeWeek(this.week)
      this.$store.dispatch('setDay')
    })
  }
}
</script>
<style scoped>

</style>
