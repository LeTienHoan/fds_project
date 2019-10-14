
<template>
  <div class="calendar-month-component">
    <div class="new-month-simple-calendar">
      <calendar-view
        ref="calendarView"
        :show-date="showDate"
        @show-date-change="setShowDate"
        @click-date="clickDate"
        @click-event="clickEvent"
        @eventMouseenter="eventMouseenter"
        @eventMouseleave="eventMouseleave"
        :locale="language"
        :startingDayOfWeek="firstDayOfMonthShow"
        :enableDragDrop="draggable"
        @drop-on-date="dropToDate"
        :events="draggable ? personalEventMapedEvents : activityMapedEvents"
        :class="'theme-default holiday-' + language + '-traditional holiday-' + language +'-official'"
        :weekends="mWeekendsNmHolidaysMapped.mWeekends || []"
        :holidays="mWeekendsNmHolidaysMapped.mHolidays || []"
      >
        <div slot="header"></div>
        <div slot="dayHeader" slot-scope="dataDayHeader"
          :class="'cv-header-day ' + dataDayHeader.index"
        >
          <div class="custome-header-day">
            {{customeDayHeader(dataDayHeader)}}
          </div>
        </div>
      </calendar-view>
    </div>
    <!-- event detail when hover event
      :nudge-top="appNudgeTop"
      :nudge-left="appNudgeLeft"
     -->
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
        <div v-if="draggable">
          <v-icon size="18" class="pr-1" color="primary">today</v-icon>{{ eventMouseenterEvent.title }}
        </div>
        <div v-else>
          <v-icon size="18" color="primary">person</v-icon>{{ eventMouseenterEvent.leaderName }}
        </div>
        <div>
          <v-icon size="18" color="primary">place</v-icon> {{ eventMouseenterEvent.location }}
        </div>
        <div>
          <v-icon size="18" color="primary">alarm_on</v-icon> {{ eventMouseenterEvent.startDate | datetime }} - {{ eventMouseenterEvent.endDate | datetime }}
        </div>
      </div>
    </v-menu>
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
      Thêm mới lịch cơ quan
    </template>
    <template slot="content">
      <activityAddEvent ref='activityAddRef'
        :workspace="workspaceId"
      >
      </activityAddEvent>
    </template>
  </dia-log>
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
        <JxMobilinkActivityAddPersonalCalendar 
          ref="addcalendar"
          @close-dialog="(val) => (add_personal_calendar = val)">
        </JxMobilinkActivityAddPersonalCalendar>
      </template>
    </dia-log>
  </div>
</template>

<script>
import activityAddEvent from '@/components/activity/activity_add_event'
import JxMobilinkActivityAddPersonalCalendar from './activity_add_personal_calendar.vue'
import CalendarView from '../month_view/CalendarView'
// The next two lines are processed by webpack. If you're using the component without webpack compilation,
// you should just create <link> elements for these as you would normally for CSS files. Both of these
// CSS files are optional, you can create your own theme if you prefer.
require('@/assets/css/default.css')
require('@/assets/css/holidays-us.css')
require('@/assets/css/holidays-vi.css')
export default {
  props: {
    id: '',
    activityItems: {
      type: Array,
      default: () => []
    },
    personalEventItems: {
      type: Array,
      default: () => []
    },
    draggable: { // dung de phan biet lich ca nhan (true) va lich co quan (false)
      type: Boolean,
      default: false
    }
  },
  components: {
    JxMobilinkActivityAddPersonalCalendar,
    CalendarView,
    activityAddEvent
  },
  data () {
    return {
      showDate: new Date(),
      eventFormat: {
        startDate: new Date(),
        endDate: new Date(),
        title: 'the title of event',
        id: 0,
        url: '',
        classes: 'event-id-0'
      },
      eventMouseenterEvent: {
        show: false
      },
      eventClick: {
        show: false
      },
      add_personal_calendar: false,
      start_date: '',
      add_new_event: false,
      clearOpen: true,
      workspaceId: '',
      editPersonalEvent: true
    }
  },
  computed: {
    activityMapedEvents () {
      var vm = this
      return this.activityItems.map(function (item, index) {
        item.id = item.activityId
        item.index = index
        item.title = item.subject
        item.startDate = new Date(item.startDate)
        item.endDate = new Date(item.endDate)
        item.url = ''
        // vm.leaderModel = Number(vm.user_id)
        // item.classes = 'event-id-' + item.id
        // console.log('>>>>>>>>>>item', item)
        if (item.leaderId === Number(vm.user_id)) {
          item.classes = 'event-id-' + item.id + ' eventGreenBgClass'
        } else {
          item.classes = 'event-id-' + item.id + ' eventOrangesBgClass'
        }
        return item
      })
    },
    personalEventMapedEvents () {
      return this.personalEventItems.map(function (item, index) {
        let rs = {
          id: item.personalEventId,
          index: index,
          title: item.subject,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
          url: '',
          classes: 'event-id-' + item.personalEventId + ' personBgClass'
        }
        for (let key in item) {
          rs[key] = item[key]
        }
        return rs
      })
    },
    firstDayOfMonthShow () {
      return this.localeDateProperties.weekStarts
    },
    mWeekendsNmHolidaysMapped () {
      return this.mWeekendsNmHolidays[String(this.showDate.getFullYear())] || {}
    }
  },
  methods: {
    eventMouseenter (event, jsEvent) {
      this.eventMouseenterEvent = event.originalEvent
      this.eventMouseenterEvent.x = jsEvent.clientX
      this.eventMouseenterEvent.y = jsEvent.clientY
      this.eventMouseenterEvent.show = true
      // let vm = this
      // if (!event.originalEvent.colorF) {
      //   event.originalEvent.colorF = this.draggable
      //     ? vm.personalEventColorByConfirmCode(event.originalEvent.confirm)
      //     : vm.getStatusTextColor(event.originalEvent.state)
      // } else {

      // }
      // window.$('.event-id-' + event.id).css({
      //   'background-color': event.originalEvent.colorF,
      //   'color': 'white',
      //   'cursor': 'pointer'
      // })
    },
    eventMouseleave (event, jsEvent) {
      this.eventMouseenterEvent = {}
      // window.$('.event-id-' + event.id).css({
      //   'background-color': '',
      //   'color': ''
      // })
    },
    goPrev () {
      this.showDate = this.$refs.calendarView.getIncrementedPeriod(-1)
    },
    goNext () {
      this.showDate = this.$refs.calendarView.getIncrementedPeriod(1)
    },
    customeDayHeader (scopeData) {
      let vm = this
      let rss = scopeData.index
      switch (rss) {
        case '0-dow':
          rss = vm.localeDateProperties['dayNames'][vm.firstDayOfMonthShow]
          break
        case '1-dow':
          rss = vm.localeDateProperties['dayNames'][1 + vm.firstDayOfMonthShow]
          break
        case '2-dow':
          rss = vm.localeDateProperties['dayNames'][2 + vm.firstDayOfMonthShow]
          break
        case '3-dow':
          rss = vm.localeDateProperties['dayNames'][3 + vm.firstDayOfMonthShow]
          break
        case '4-dow':
          rss = vm.localeDateProperties['dayNames'][4 + vm.firstDayOfMonthShow]
          break
        case '5-dow':
          rss = vm.localeDateProperties['dayNames'][5 + vm.firstDayOfMonthShow]
          break
        case '6-dow':
          rss = vm.firstDayOfMonthShow ? vm.localeDateProperties['dayNames'][0] : vm.localeDateProperties['dayNames'][6]
          break
        default:
          rss = scopeData.label
          break
      }
      return rss
    },
    setShowDate (d) {
      console.log(d)
      this.showDate = d
    },
    clickDate (date) {
      var vm = this
      if (this.draggable) {
        if (Number(this.$router.currentRoute.params.id) === 0) {
          let crHour = window.moment().format('HH')
          let crMinute = Math.ceil(Number(window.moment().format('mm')) / 10) * 10
          let start = window.moment(date).add(crHour, 'H').add(crMinute, 'm').toDate()
          let end = window.moment(start).clone().add(30, 'm').toDate()
          this.editPersonalEvent = true
          this.clearOpen = false
          this.add_personal_calendar = !this.add_personal_calendar
          this.$refs.addcalendar.initData(start, end)
        }
      } else {
        if (this.$router.currentRoute.meta.type === 'workspace') {
          if (Number(this.$router.currentRoute.params.id) === 0) {
            vm.workspaceId = ''
          } else {
            vm.workspaceId = Number(this.$router.currentRoute.params.id)
          }
          let crHour = window.moment().format('HH')
          let crMinute = Math.ceil(Number(window.moment().format('mm')) / 10) * 10
          let start = window.moment(date).add(crHour, 'H').add(crMinute, 'm').toDate()
          let end = window.moment(start).clone().add(30, 'm').toDate()
          vm.add_new_event = true
          this.$refs.activityAddRef.initGetData(start, end)
        }
      }
    },
    clickEvent (event, jsEvent) {
      if (this.draggable) {
        if (event.originalEvent.personalEventId) {
          this.editPersonalEvent = 'owner, write'.indexOf(this.getPermissionText(event.originalEvent.permission)) >= 0
          this.clearOpen = true
          this.eventClick.list = event.originalEvent
          this.eventClick.x = jsEvent.clientX
          this.eventClick.y = jsEvent.clientY
          this.add_personal_calendar = !this.add_personal_calendar
          this.$refs.addcalendar.initData(this.eventClick.list.startDate, this.eventClick.list.endDate, this.eventClick.list.title, this.eventClick.list.id, this.eventClick.list.locationId, this.eventClick.list.confirm)
        } else {
          event.originalEvent.activityId = event.originalEvent.classPK
          this.$emit('eventclick', event.originalEvent)
        }
      } else {
        this.$emit('eventclick', event.originalEvent)
      }
    },
    dropToDate (currentDragEvent, bubbleParam) {
      let vm = this
      let value = this.personalEventMapedEvents.find(item => item.id === currentDragEvent.id)
      if (value && value.id) {
        let newDateNumber = window.moment(bubbleParam).startOf('day').toDate().getTime()
        let duration = newDateNumber - window.moment(value.startDate).startOf('day').toDate().getTime()
        let end = window.moment(value.endDate).clone().add(duration, 'milliseconds')
        let start = window.moment(value.startDate).clone().add(duration, 'milliseconds')
        vm.$store.dispatch('personalEvent/updatePersonalEvent', {
          personalEventId: value.id,
          startDate: start.toDate().getTime(),
          endDate: end.toDate().getTime()
        }).then(response => {
          console.log(start.format('YYYY/MM/DD'), start.toDate().getTime() === window.personalEvent_startDate)
          console.log(end.format('YYYY/MM/DD'), end.toDate().getTime())
        }, error => {
          console.log(error)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
      }
    },
    saveDialog1 () {
      this.$refs.addcalendar.saveAndExit()
    },
    saveDialog2 () {
      this.$refs.addcalendar.saveAndAddNew()
    },
    submitSaveAndExit () {
      this.$refs.activityAddRef.saveAndExit()
    },
    submitSaveAndAddNew () {
      this.$refs.activityAddRef.saveAndAddNew()
    },
    deleteEvent () {
      this.$refs.addcalendar.deleteEvent()
    }
  }
}
</script>
<style>
  .new-month-simple-calendar {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .calendar-month-component {
    /** 
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
    height: 67vh;
    width: 90vw; */
    margin-left: auto;
    margin-right: auto;
  }
  .cv-weeks .outsideOfMonth .cv-day-number {
    opacity: 0.5;
  }
  .cv-week {
    min-height: 8em !important;
  }
  .detail-event-menu .event-content {
    background-color: white;
    padding: 10px;
    min-width: 50px;
    min-height: 30px;
  }

  .detail-event-menu {
    border-radius: 10px;
    max-width: 350px;
  }
  .personBgClass,.eventGreenBgClass {
    background: #8bc34a!important;
    color: #fff;
    cursor: pointer;
  }
  .eventOrangesBgClass {
    background: #ffc107!important;
    color: #fff;
    cursor: pointer;
  }
  @media only screen and (device-width: 768px) {
    .custome-header-day{
      display: block!important;
    }
    .cv-header-day
    {
      display: block!important;
    }
    .holiday-us-traditional
    {
      display: block!important;
    }
    .new-month-simple-calendar
    {
      display: block!important;
    }
    .calendar-month-component
    {
      display: block!important;
    }
  }
</style>
