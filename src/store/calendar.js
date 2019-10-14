import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading/loading'
import user from './modules/common/user'
import personalEvent from './modules/workmgt/personalEvent'
import workspace from './modules/sharing/workspace'
import docFile from './modules/docmgt/docFile'
import { menuFilters, viewTypes } from '@/router/calendar'

Vue.use(Vuex)

export const storeCalendar = new Vuex.Store({
  state: {
    loadedActivities: {total: 0, data: []},
    loadedContacts: [],
    staticRouters: viewTypes,
    menuFilters: menuFilters,
    workingunitsItems: [],
    statusItems: [],
    activityCatItems: [],
    locationsItems: [],
    resourcetagsItems: [],
    naviFilter: {
      name: 'Lịch cá nhân',
      id: -1,
      query: {
        lichcoquan: ''
      }
    },
    keywords: '',
    advancedSearch: {},
    weekFilter: window.moment().weeks(),
    monthFilter: window.moment().month(),
    yearFilter: window.moment().year(),
    isToday: true,
    pagination: 1,
    end_point: window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/',
    group_id: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : null,
    user_id: window.themeDisplay ? window.themeDisplay.getUserId() : null,
    dayName: '',
    fileAttachComponentState: {
      id: null,
      action: null,
      countAction: null,
      fileAttach: {}
    },
    sizePage: 5
  },
  mutations: {
    addActivity (state, payload) {
      // alert('Commit activity')
      state.loadedActivities.push(payload)
    },
    deleteActivity (state, payload) {
      let arrTemp = this.getters.loadedActivities.data
      arrTemp = arrTemp.filter(function (_item) {
        return _item['activityId'] !== payload['activityId']
      })
      state.loadedActivities = arrTemp
    },
    setLoadedActivities (state, payload) {
      state.loadedActivities = payload
    },
    setLoadedContacts (state, payload) {
      state.loadedContacts = payload
    },
    setWorkingunitsItems (state, payload) {
      state.workingunitsItems = payload
    },
    setStatusItems (state, payload) {
      state.statusItems = payload
    },
    setActivityCatItems (state, payload) {
      state.activityCatItems = payload
    },
    setLocationsItems (state, payload) {
      state.locationsItems = payload
    },
    setResourcetagsItems (state, payload) {
      state.resourcetagsItems = payload
    },
    setNaviFilter (state, payload) {
      state.naviFilter = payload
    },
    setKeywords (state, payload) {
      state.keywords = payload
    },
    setAdvancedSearch (state, payload) {
      state.advancedSearch = payload
    },
    setMonthFilter (state, payload) {
      state.monthFilter = payload
    },
    setWeekFilter (state, payload) {
      state.weekFilter = payload
    },
    setYearFilter (state, payload) {
      state.yearFilter = payload
    },
    setPagination (state, payload) {
      state.pagination = payload
    },
    setDay (state, payload) {
      state.dayName = payload
    },
    setFileAttachComponentState (state, payload) {
      state.fileAttachComponentState = payload
    }
  },
  actions: {
    createActivity ({ commit, getters }, payload) {
      // alert('createActivity')
    },
    setPaginationSize ({ dispatch, commit }, payload) {
      this.sizePage = payload
      this.dispatch('loadActivities')
    },
    deleteActivity ({ dispatch, commit }, item) {
      let config = {
        headers: {
          groupId: this.getters.group_id
        }
      }
      let url = this.getters.end_point + 'activities/' + item.activityId
      window.axios.delete(url, config).then(function (response) {
        commit('deleteActivity', item)
        window.showMessageToastr('success', 'Xóa cuộc họp thành công')
        setTimeout(function () {
          dispatch('loadActivities')
        }, 1000)
      })
        .catch(function (error) {
          window.showMessageByAPICode(error.response.status, error.response.data)
          console.log(error)
        })
    },
    loadActivities ({ commit }) {
      let vm = this
      vm.end_point = this.getters.end_point
      let paramsActivityBuilder = {}
      let staticRouter = this.state.route.path
      if (typeof vm.sizePage === 'undefined') {
        vm.sizePage = 5
      }
      if (this.getters.naviFilter) {
        Object.assign(paramsActivityBuilder, this.getters.naviFilter['query'])
        delete paramsActivityBuilder['personalId']
        paramsActivityBuilder['template'] = false
        paramsActivityBuilder['sort'] = 'startDate_Number'
        paramsActivityBuilder['order'] = true
      }
      if (staticRouter.indexOf('/week') > 0) {
        paramsActivityBuilder['fromdate'] = window.moment().weekday(0).year(this.getters.yearFilter).week(this.getters.weekFilter).format('YYYYMMDD')
        paramsActivityBuilder['todate'] = window.moment().weekday(6).year(this.getters.yearFilter).week(this.getters.weekFilter).format('YYYYMMDD')
        paramsActivityBuilder['editable'] = null
        paramsActivityBuilder['start'] = null
        paramsActivityBuilder['end'] = null
      } else if (staticRouter.indexOf('/month') >= 0) {
        paramsActivityBuilder['fromdate'] = window.moment(new Date(this.getters.yearFilter, this.getters.monthFilter, 1)).format('YYYYMMDD')
        paramsActivityBuilder['todate'] = window.moment(new Date(this.getters.yearFilter, this.getters.monthFilter + 1, 0)).format('YYYYMMDD')
      } else if (staticRouter.indexOf('/list') >= 0) {
        paramsActivityBuilder['fromdate'] = window.moment(new Date(this.getters.yearFilter, this.getters.monthFilter, 1)).format('YYYYMMDD')
        paramsActivityBuilder['todate'] = window.moment(new Date(this.getters.yearFilter, this.getters.monthFilter + 1, 0)).format('YYYYMMDD')
        paramsActivityBuilder['start'] = this.getters.pagination * Number(this.sizePage) - Number(this.sizePage)
        paramsActivityBuilder['end'] = this.getters.pagination * Number(this.sizePage)
        paramsActivityBuilder['editable'] = 1
      } else if (staticRouter.indexOf('/trash') >= 0) {
        paramsActivityBuilder['start'] = this.getters.pagination * Number(this.sizePage) - Number(this.sizePage)
        paramsActivityBuilder['end'] = this.getters.pagination * Number(this.sizePage)
        paramsActivityBuilder['editable'] = 2
      } else if (staticRouter.indexOf('/npublish') >= 0) {
        paramsActivityBuilder['start'] = this.getters.pagination * Number(this.sizePage) - Number(this.sizePage)
        paramsActivityBuilder['end'] = this.getters.pagination * Number(this.sizePage)
        paramsActivityBuilder['editable'] = 0
      } else if (staticRouter.indexOf('/all') >= 0) {
        paramsActivityBuilder['start'] = this.getters.pagination * Number(this.sizePage) - Number(this.sizePage)
        paramsActivityBuilder['end'] = this.getters.pagination * Number(this.sizePage)
        paramsActivityBuilder['editable'] = '0,1'
      } else {
        paramsActivityBuilder['start'] = this.getters.pagination * Number(this.sizePage) - Number(this.sizePage)
        paramsActivityBuilder['end'] = this.getters.pagination * Number(this.sizePage)
        paramsActivityBuilder['editable'] = '0,1'
      }
      paramsActivityBuilder['keywords'] = this.getters.keywords
      if (this.getters.advancedSearch) {
        let _advancedSearch = this.getters.advancedSearch
        for (let key in _advancedSearch) {
          paramsActivityBuilder[_advancedSearch[key]['key']] = _advancedSearch[key]['value']
        }
      }
      let configGetActivity = {
        params: paramsActivityBuilder,
        headers: {
          groupId: this.getters.group_id
        }
      }
      if (window.print === true) {
        configGetActivity = {
          params: paramsActivityBuilder,
          headers: {
            groupId: this.getters.group_id
          },
          responseType: 'arraybuffer'
        }
      }
      let url = vm.end_point + 'activities?type=EVENT'
      window.axios.get(url, configGetActivity)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data') && Array.isArray(serializable.data)) {
            commit('setLoadedActivities', serializable)
            vm.pagination = Math.ceil(serializable.total / 10)
          } else if (typeof (serializable.data) === 'object') {
            commit('setLoadedActivities', {
              total: serializable.total,
              data: [serializable.data]
            })
          } else {
            commit('setLoadedActivities', {total: 0, data: []})
          }
          commit('setPagination', 1)
        })
        .catch(function (error) {
          console.log(error)
          commit('setLoadedActivities', {
            total: 0,
            data: []
          })
        })
    },
    loadPersonalEvents ({ dispatch, commit }) {
      let vm = this
      vm.end_point = this.getters.end_point
      let paramsActivityBuilder = {}
      let staticRouter = this.state.route.path
      if (this.getters.naviFilter) {
        Object.assign(paramsActivityBuilder, this.getters.naviFilter['query'])
        delete paramsActivityBuilder['fromdate']
        delete paramsActivityBuilder['todate']
        delete paramsActivityBuilder['workspace']
        paramsActivityBuilder['sort'] = 'startDate_Number'
        paramsActivityBuilder['order'] = true
      }
      let fromdate = ''
      let todate = ''
      if (staticRouter.indexOf('/week') > 0) {
        fromdate = window.moment().weekday(0).year(this.getters.yearFilter).week(this.getters.weekFilter).format('YYYYMMDD')
        todate = window.moment().weekday(6).year(this.getters.yearFilter).week(this.getters.weekFilter).format('YYYYMMDD')
      } else if (staticRouter.indexOf('/month') >= 0) {
        fromdate = window.moment(new Date(this.getters.yearFilter, this.getters.monthFilter, 1)).format('YYYYMMDD')
        todate = window.moment(new Date(this.getters.yearFilter, this.getters.monthFilter + 1, 0)).format('YYYYMMDD')
      } else if (staticRouter.indexOf('/list') >= 0) {
        fromdate = window.moment(new Date(this.getters.yearFilter, this.getters.monthFilter, 1)).format('YYYYMMDD')
        todate = window.moment(new Date(this.getters.yearFilter, this.getters.monthFilter + 1, 0)).format('YYYYMMDD')
        paramsActivityBuilder['start'] = this.getters.pagination * 10 - 10
        paramsActivityBuilder['end'] = this.getters.pagination * 10
      }
      paramsActivityBuilder['keywords'] = this.getters.keywords
      if (this.getters.advancedSearch) {
        let _advancedSearch = this.getters.advancedSearch
        for (let key in _advancedSearch) {
          paramsActivityBuilder[_advancedSearch[key]['key']] = _advancedSearch[key]['value']
        }
      }
      let configGetActivity = {
        params: paramsActivityBuilder,
        headers: {
          groupId: this.getters.group_id
        }
      }
      if (window.print === true) {
        configGetActivity = {
          params: paramsActivityBuilder,
          headers: {
            groupId: this.getters.group_id
          },
          responseType: 'arraybuffer'
        }
      }
      let payload = {
        queries: configGetActivity.params,
        urlParams: {
          userId: this.getters.user_id,
          fromdate: fromdate,
          todate: todate,
          responseType: window.print ? 'arraybuffer' : null
        }
      }
      dispatch('personalEvent/getPersonalEventItems', payload).then(response => {
        console.log(response)
      }, error => {
        console.log(error)
      })
      /** let url = vm.end_point + 'personalevents/user/' + this.getters.user_id + '/from/' + fromdate + '/to/' + todate
      window.axios.get(url, configGetActivity)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data') && Array.isArray(serializable.data)) {
            commit('setLoadedPersonalEvents', serializable)
            vm.pagination = Math.ceil(serializable.total / 10)
          } else if (typeof (serializable.data) === 'object') {
            commit('setLoadedPersonalEvents', {
              total: serializable.total,
              data: [serializable.data]
            })
          } else {
            commit('setLoadedPersonalEvents', { total: 0, data: [] })
          }
          commit('setPagination', 1)
        })
        .catch(function (error) {
          console.log(error)
          commit('setLoadedPersonalEvents', {
            total: 0,
            data: []
          })
        }) */
    },
    loadContacts ({ commit }) {
      if (!this.getters.loadedContacts || this.getters.loadedContacts.length === 0) {
        let url = this.getters.end_point + 'contacts'
        let config = {
          headers: {
            'groupId': this.getters.group_id
          },
          params: {
            start: -1,
            end: -1
          }
        }
        window.axios.get(url, config).then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            commit('setLoadedContacts', serializable.data)
          }
        })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    setWorkingunitsItems ({ commit }) {
      let url = this.getters.end_point + 'workingunits'
      let config = {
        headers: {
          'groupId': this.getters.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          commit('setWorkingunitsItems', serializable.data)
        } else {
          commit('setWorkingunitsItems', serializable.data)
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    setStatusItems ({ commit }) {
      let vm = this
      vm.statusItems = [
        {
          statusName: 'Mới',
          statusCode: 1
        },
        {
          statusName: 'Xin chỉ đạo',
          statusCode: 2
        },
        {
          statusName: 'Chờ thực hiện',
          statusCode: 3
        },
        {
          statusName: 'Đang thực hiện',
          statusCode: 4
        },
        {
          statusName: 'Chờ xác nhận',
          statusCode: 5
        },
        {
          statusName: 'Đang theo dõi',
          statusCode: 6
        },
        {
          statusName: 'Đã kết thúc',
          statusCode: 7
        },
        {
          statusName: 'Đã hủy',
          statusCode: 8
        },
        {
          statusName: 'Không xử lý',
          statusCode: 9
        }
      ]
      commit('setStatusItems', vm.statusItems)
    },
    setDay ({ commit }) {
      let vm = this
      let days = window.moment(new Date()).day()
      switch (days) {
        case 0:
          vm.dayName = 'Chủ nhật'
          break
        case 1:
          vm.dayName = 'Thứ hai'
          break
        case 2:
          vm.dayName = 'Thứ ba'
          break
        case 3:
          vm.dayName = 'Thứ tư'
          break
        case 4:
          vm.dayName = 'Thứ năm'
          break
        case 5:
          vm.dayName = 'Thứ sáu'
          break
        case 6:
          vm.dayName = 'Thứ bảy'
          break
      }
      commit('setDay', vm.dayName)
    },
    setActivityCatItems ({ commit }) {
      let config = {
        headers: {
          'groupId': this.getters.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      let url = this.getters.end_point + 'dictcollections/ACTIVITY_TYPE/dictitems?parent=EVENT'
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          commit('setActivityCatItems', serializable.data)
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    setLocationsItems ({ commit }) {
      let url = this.getters.end_point + 'locations'
      let config = {
        headers: {
          'groupId': this.getters.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          commit('setLocationsItems', serializable.data)
        } else {
          commit('setLocationsItems', [])
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    setResourcetagsItems ({ commit }) {
      let url = this.getters.end_point + 'resourcetags'
      let config = {
        headers: {
          'groupId': this.getters.group_id
        }
      }
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          commit('setResourcetagsItems', serializable.data)
        } else {
          commit('setResourcetagsItems', [])
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    setNaviFilter ({ dispatch, commit }, payload) {
      commit('setNaviFilter', payload)
      if (this.state.route.meta.type === 'personal') {
        dispatch('loadPersonalEvents')
      } else if (this.state.route.meta.type === 'workspace') {
        dispatch('loadActivities')
      }
    },
    setKeywords ({ dispatch, commit }, payload) {
      commit('setKeywords', payload)
      if (this.state.route.meta.type === 'personal') {
        dispatch('loadPersonalEvents')
      } else if (this.state.route.meta.type === 'workspace') {
        dispatch('loadActivities')
      } else {
        dispatch('loadActivities')
      }
    },
    setAdvancedSearch ({ dispatch, commit }, payload) {
      commit('setAdvancedSearch', payload)
      if (this.state.route.meta.type === 'personal') {
        dispatch('loadPersonalEvents')
      } else if (this.state.route.meta.type === 'workspace') {
        dispatch('loadActivities')
      } else {
        dispatch('loadActivities')
      }
    },
    setWeekMonthYear ({ dispatch, commit }, payload) {
      if (payload['week'] && payload['week'] !== this.getters.weekFilter) {
        commit('setWeekFilter', payload['week'])
      }
      if (payload['month'] && payload['month'] !== this.getters.monthFilter) {
        commit('setMonthFilter', payload['month'])
      }
      if (payload['year'] && payload['year'] !== this.getters.yearFilter) {
        commit('setYearFilter', payload['year'])
      }
      if (this.state.route.meta.type === 'personal') {
        dispatch('loadPersonalEvents')
      } else if (this.state.route.meta.type === 'workspace') {
        dispatch('loadActivities')
      } else {
        dispatch('loadActivities')
      }
    },
    setPaginationPage ({ dispatch, commit }, payload) {
      commit('setPagination', payload['pagination'])
      if (this.state.route.meta.type === 'personal') {
        dispatch('loadPersonalEvents')
      } else if (this.state.route.meta.type === 'workspace') {
        dispatch('loadActivities')
      } else {
        dispatch('loadActivities')
      }
    },
    setFileAttachComponentState ({ dispatch, commit }, payload) {
      commit('setFileAttachComponentState', payload)
    }
  },
  getters: {
    loadedActivities (state) {
      return state.loadedActivities
    },
    loadedContacts (state) {
      return state.loadedContacts
    },
    workingunitsItems (state) {
      return state.workingunitsItems
    },
    statusItems (state) {
      return state.statusItems
    },
    dayName (state) {
      return state.dayName
    },
    activityCatItems (state) {
      return state.activityCatItems
    },
    locationsItems (state) {
      return state.locationsItems
    },
    resourcetagsItems (state) {
      return state.resourcetagsItems
    },
    staticRouters (state) {
      return state.staticRouters
    },
    menuFilters (state) {
      return state.menuFilters
    },
    naviFilter (state) {
      return state.naviFilter
    },
    keywords (state) {
      return state.keywords
    },
    advancedSearch (state) {
      return state.advancedSearch
    },
    weekFilter (state) {
      return state.weekFilter
    },
    monthFilter (state) {
      return state.monthFilter
    },
    yearFilter (state) {
      return state.yearFilter
    },
    pagination (state) {
      return state.pagination
    },
    end_point (state) {
      return state.end_point
    },
    group_id (state) {
      return state.group_id
    },
    user_id (state) {
      return state.user_id
    },
    fileAttachComponentState (state) {
      return state.fileAttachComponentState
    },
    getNaviActiveState: (state) => (type, name) => {
      if (type) {
        return state.route.meta.type === type
      } else {
        return state.route.name === name
      }
    }
  },
  modules: {
    loading,
    user,
    personalEvent,
    workspace,
    docFile
  },
  strict: process.env.NODE_ENV !== 'production'
})
