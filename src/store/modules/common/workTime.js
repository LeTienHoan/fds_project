import workTimeApi from '@/api/common/workTime'

// initial state
const state = {
  workTimeItems: [],
  queries: {},
  totalWorkTimeItems: 0
}

// getters
const getters = {
  workTimeItems: (state) => {
    return state.workTimeItems
  },
  queries: (state) => {
    return state.queries
  },
  totalWorkTimeItems: (state) => {
    return state.totalWorkTimeItems
  }
}

// actions
const actions = {
  async getWorkTimeItems ({ dispatch, commit, getters }, queries) {
    await dispatch('setQueries', queries) // wait for `setQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (workTimes) => {
        commit('setTotalWorkTimeItems', workTimes.total)
        commit('setWorkTimeItems', workTimes.data)
        resolve(workTimes)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        // commit('setWorkTimeItems', [])
        // reject(error)
      }
      workTimeApi.getWorkTimes(getters.queries, cb, errorCb)
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
  async createWorkTime ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (workTime) => {
        const workTimeItems = getters.workTimeItems.concat([workTime])
        commit('setTotalWorkTimeItems', getters.totalWorkTimeItems + 1)
        commit('setWorkTimeItems', workTimeItems)
        resolve(workTime)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workTimeApi.createWorkTime(payload, cb, errorCb)
    })
  },
  async readWorkTime ({ commit }, day) {
    return new Promise((resolve, reject) => {
      let cb = (workTime) => {
        resolve(workTime)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workTimeApi.readWorkTime(day, cb, errorCb)
    })
  },
  async updateWorkTime ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (workTime) => {
        let workTimeItems = getters.workTimeItems
        let currentIndex = workTimeItems.findIndex(item => String(item.day) === String(workTime.day))
        if (currentIndex >= 0) {
          for (let key in workTime) {
            workTimeItems[currentIndex][key] = workTime[key]
          }
        } else {
          workTimeItems.push(workTime)
          commit('setTotalWorkTimeItems', getters.totalWorkTimeItems + 1)
        }
        commit('setWorkTimeItems', workTimeItems)
        resolve(workTime)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workTimeApi.updateWorkTime(payload, cb, errorCb)
    })
  },
  async deleteWorkTime ({ commit, getters }, day) {
    return new Promise((resolve, reject) => {
      let cb = (workTime) => {
        const workTimeItems = getters.workTimeItems.filter(item => String(item.day) !== String(day))
        commit('setTotalWorkTimeItems', getters.totalWorkTimeItems - 1)
        commit('setWorkTimeItems', workTimeItems)
        resolve(workTime)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workTimeApi.deleteWorkTime(day, cb, errorCb)
    })
  }

}

// mutations
const mutations = {
  setTotalWorkTimeItems (state, payload) {
    state.totalWorkTimeItems = payload
  },
  setWorkTimeItems (state, payload) {
    state.workTimeItems = payload
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
