import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedActivities: {total: 0, data: []},
    loadedContacts: [],
    staticRouters: [
      {
        name: 'Lịch tuần',
        link: '/week',
        icon: 'calendar_today'
      },
      {
        name: 'Lịch tháng',
        link: '/month',
        icon: 'date_range'
      },
      {
        name: 'Danh sách',
        link: '/list',
        icon: 'reorder'
      }
    ],
    workingunitsItems: [],
    statusItems: [],
    activityCatItems: [],
    locationsItems: [],
    resourcetagsItems: [],
    naviFilter: {
      name: 'Lịch cơ quan',
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
    end_point: window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://192.168.10.36:8081/api/',
    group_id: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : null
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
    }
  },
  actions: {
    createActivity ({ commit, getters }, payload) {
      // alert('createActivity')
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
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    loadActivities ({ commit }) {
      let vm = this
      window.moment.locale('vi')
      vm.end_point = this.getters.end_point
      let paramsActivityBuilder = {}
      let staticRouter = this.state.route.path
      if (this.getters.naviFilter) {
        paramsActivityBuilder = this.getters.naviFilter['query']
        paramsActivityBuilder['template'] = false
        paramsActivityBuilder['sort'] = 'startDate_Number'
        paramsActivityBuilder['order'] = true
      }
      if (staticRouter === '/week') {
        paramsActivityBuilder['fromdate'] = window.moment().weekday(0).year(this.getters.yearFilter).week(this.getters.weekFilter).format('YYYYMMDD')
        paramsActivityBuilder['todate'] = window.moment().weekday(6).year(this.getters.yearFilter).week(this.getters.weekFilter).format('YYYYMMDD')
        paramsActivityBuilder['editable'] = null
        paramsActivityBuilder['start'] = null
        paramsActivityBuilder['end'] = null
      } else if (staticRouter === '/month') {
        paramsActivityBuilder['fromdate'] = window.moment(new Date(this.getters.yearFilter, this.getters.monthFilter - 1, 1)).format('YYYYMMDD')
        paramsActivityBuilder['todate'] = window.moment(new Date(this.getters.yearFilter, this.getters.monthFilter, 0)).format('YYYYMMDD')
      } else if (staticRouter === '/list') {
        paramsActivityBuilder['fromdate'] = window.moment(new Date(this.getters.yearFilter, this.getters.monthFilter - 1, 1)).format('YYYYMMDD')
        paramsActivityBuilder['todate'] = window.moment(new Date(this.getters.yearFilter, this.getters.monthFilter, 0)).format('YYYYMMDD')
        paramsActivityBuilder['start'] = this.getters.pagination * 10 - 10
        paramsActivityBuilder['end'] = this.getters.pagination * 10
        paramsActivityBuilder['editable'] = 1
      } else if (staticRouter === '/trash') {
        paramsActivityBuilder['start'] = this.getters.pagination * 10 - 10
        paramsActivityBuilder['end'] = this.getters.pagination * 10
        paramsActivityBuilder['editable'] = 2
      } else if (staticRouter === '/npublish') {
        paramsActivityBuilder['start'] = this.getters.pagination * 10 - 10
        paramsActivityBuilder['end'] = this.getters.pagination * 10
        paramsActivityBuilder['editable'] = 0
      }
      if (this.getters.keywords) {
        paramsActivityBuilder['keywords'] = this.getters.keywords
      }
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
      if (payload.id >= -1) {
        dispatch('loadActivities')
      }
    },
    setKeywords ({ dispatch, commit }, payload) {
      commit('setKeywords', payload)
      dispatch('loadActivities')
    },
    setAdvancedSearch ({ dispatch, commit }, payload) {
      commit('setAdvancedSearch', payload)
      dispatch('loadActivities')
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
      dispatch('loadActivities')
    },
    setPaginationPage ({ dispatch, commit }, payload) {
      commit('setPagination', payload['pagination'])
      dispatch('loadActivities')
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
    }
  }
})
