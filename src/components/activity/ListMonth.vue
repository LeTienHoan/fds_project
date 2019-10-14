
<template>
    <v-card class="calendar-list-wrapper fullwidth">
        <jx-mobilink-toolbar :extension="true" :dark="false" color="">
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
                  v-if="! ($router.currentRoute.meta.type === 'personal' && (index == staticRouters.length - 1))"
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
                  solo flat light
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

       <!--  <AdvancedSearch v-show="advanced_search"
          @active="(val) => ( advanced_search = val )"
        ></AdvancedSearch> -->
        <ListMonth2 ref="ListMonth2xxx"
          :activityItems="activityItems"
          :personalEventItems="personalEventItems"
          @eventclick="goToDetail"
          :draggable="$router.currentRoute.meta.type === 'personal'"
        >
      </ListMonth2>
    </v-card>

</template>

<script>
import AdvancedSearch from './AdvancedSearch'
import ListMonth2 from './ListMonth2'
export default {

  data () {
    return {
      titleName: this.translate('lich_thang'),
      month: this.$store.getters.monthFilter,
      year: this.$store.getters.yearFilter,
      routerIcon: 'date_range',
      advanced_search: false,
      monthItems: [],
      yearItems: [],
      toDayText: this.translate('hom_nay'),
      today: new Date()
    }
  },
  components: {
    AdvancedSearch,
    ListMonth2
  },
  computed: {
    title () {
      // let keywords = this.$store.getters.keywords
      // keywords = keywords.length > 0 ? ' ,từ khóa: ' + keywords : ''
      // let advancedSearch = this.$store.getters.advancedSearch
      // let advancedSearchStr = ''
      // for (let key in advancedSearch) {
      //   advancedSearchStr += ', ' + advancedSearch[key]['keytext'] +
      //     ': ' + advancedSearch[key]['text']
      // }
      return this.titleName
    },
    activityItems () {
      // if (this.$router.currentRoute.meta.type === 'personal') {
      //   return this.$store.getters.loadPersonalEvents.data
      // } else if (this.$router.currentRoute.meta.type === 'workspace') {
      //   return this.$store.getters.loadedActivities.data
      // }
      return this.$store.getters.loadedActivities.data
    },
    personalEventItems () {
      return this.$store.getters['personalEvent/personalEventItems']
    },
    personalEventTime () {
      const dt = this.$store.getters['personalEvent/personalEventItems']
      let rs = ''
      for (let d in dt) {
        rs += '---startDate=' + window.moment(dt[d].startDate).format('YYYY-MM-DD')
      }
      return rs
    },
    staticRouters () {
      return this.$store.getters.staticRouters
    },
    dayName () {
      return this.$store.getters.dayName
    }
  },
  methods: {
    goToLink (path) {
      this.$router.push(path)
    },
    goToDetail (event, jsEvent, pos) {
      // this.$router.push('/detail/' + event.activityId)
      window.location = this.MSystemConfiguration.configuration.systemurl.eventurl + 'detail/' + event.activityId
    },
    setMonthCalendar () {
      let month = this.month + 1
      month = month.toString().padStart(2, 0)
      let firstOfMonth = new Date(window.moment('01' + month + this.year, 'DDMMYYYY'))
      this.$refs.ListMonth2xxx.setShowDate(firstOfMonth)
    },
    changeMonth () {
      this.setMonthCalendar()
      this.$store.dispatch('setWeekMonthYear', {
        month: this.month,
        year: this.year
      })
    },
    goPrev () {
      if (this.month === 0) {
        this.month = 11
        if (this.year < this.yearItems[this.yearItems.length - 1]['value']) {
          this.yearItems.push({
            text: this.translate('nam') + ' ' + this.year,
            value: this.year
          })
        }
      } else {
        this.month = this.month - 1
      }
      this.changeMonth()
    },
    goNext () {
      this.$refs.ListMonth2xxx.goNext()
      if (this.month === 11) {
        this.month = 1
        this.year = this.year + 1
        if (this.year > this.yearItems[0]['value']) {
          this.yearItems.unshift({
            text: this.translate('nam') + ' ' + this.year,
            value: this.year
          })
        }
      } else {
        this.month = this.month + 1
      }
      this.changeMonth()
    },
    clickToday () {
      let vm = this
      vm.month = window.moment().month()
      vm.year = window.moment().year()
      vm.changeMonth()
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
      this.setMonthCalendar()
      if (this.$router.currentRoute.meta.type === 'personal') {
        this.$store.dispatch('setNaviFilter', {query: {personalId: Number(this.$route.params.id) || ''}})
      } else if (this.$router.currentRoute.meta.type === 'workspace') {
        this.$store.dispatch('setNaviFilter', {query: {workspace: Number(this.$route.params.id) || ''}})
      }
      this.$store.dispatch('setDay')
    })
  }
}
</script>
<style scoped>

</style>
