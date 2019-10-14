import holidayApi from '@/api/common/holiday'

// initial state
const state = {
  holidayItems: [],
  queries: {},
  totalHolidayItems: 0
}

// getters
const getters = {
  holidayItems: (state) => {
    return state.holidayItems
  },
  queries: (state) => {
    return state.queries
  },
  totalHolidayItems: (state) => {
    return state.totalHolidayItems
  }
}

// actions
const actions = {
  async getHolidayItems ({ dispatch, commit, getters }, queries) {
    await dispatch('setQueries', queries) // wait for `setQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (holidays) => {
        commit('setHotalHolidayItems', holidays.total)
        commit('setHolidayItems', holidays.data)
        resolve(holidays)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        // commit('setHolidayItems', [])
        // reject(error)
      }
      holidayApi.getHolidays(getters.queries, cb, errorCb)
    })
  },
  async setQueries ({ commit }, payload) {
    for (let key in payload) {
      if (payload[key] === '' || payload[key] === undefined ||
        payload[key] === 'undefined' || payload[key] === null) {
        delete payload[key]
      }
    }
    commit('setQueries', payload)
  },
  async createHoliday ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (holiday) => {
        const holidayItems = getters.holidayItems.concat([holiday])
        commit('setHotalHolidayItems', getters.totalHolidayItems + 1)
        commit('setHolidayItems', holidayItems)
        resolve(holiday)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      holidayApi.createHoliday(payload, cb, errorCb)
    })
  },
  async readHoliday ({ commit }, holidayDate) {
    return new Promise((resolve, reject) => {
      let cb = (holiday) => {
        resolve(holiday)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      holidayApi.readHoliday(holidayDate, cb, errorCb)
    })
  },
  async updateHoliday ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (holiday) => {
        let holidayItems = getters.holidayItems
        let currentIndex = holidayItems.findIndex(item => String(item.holidayDate) === String(holiday.holidayDate))
        if (currentIndex >= 0) {
          for (let key in holiday) {
            holidayItems[currentIndex][key] = holiday[key]
          }
        } else {
          holidayItems.push(holiday)
          commit('setHotalHolidayItems', getters.totalHolidayItems + 1)
        }
        commit('setHolidayItems', holidayItems)
        resolve(holiday)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      holidayApi.updateHoliday(payload, cb, errorCb)
    })
  },
  async deleteHoliday ({ commit, getters }, holidayDate) {
    return new Promise((resolve, reject) => {
      let cb = (holiday) => {
        const holidayItems = getters.holidayItems.filter(item => window.moment(item.holidayDate).format('YYYYMMDD') !== holidayDate)
        commit('setHotalHolidayItems', getters.totalHolidayItems - 1)
        commit('setHolidayItems', holidayItems)
        resolve(holiday)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      holidayApi.deleteHoliday(holidayDate, cb, errorCb)
    })
  }

}

// mutations
const mutations = {
  setHotalHolidayItems (state, payload) {
    state.totalHolidayItems = payload
  },
  setHolidayItems (state, payload) {
    state.holidayItems = payload
  },
  setQueries (state, payload) {
    state.queries = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
