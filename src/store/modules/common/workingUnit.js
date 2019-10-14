import workingUnitApi from '@/api/common/workingUnit'

// initial state
const state = {
  workingUnitItems: [],
  queries: {},
  totalWorkingUnitItems: 0
}

// getters
const getters = {
  workingUnitItems: (state) => {
    return state.workingUnitItems
  },
  queries: (state) => {
    return state.queries
  },
  totalWorkingUnitItems: (state) => {
    return state.totalWorkingUnitItems
  }
}

// actions
const actions = {
  async getWorkingUnitItems ({ dispatch, commit, getters }, queries) {
    await dispatch('setQueries', queries) // wait for `setQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (workingUnits) => {
        commit('setTotalWorkingUnitItems', workingUnits.total)
        commit('setWorkingUnitItems', workingUnits.data)
        resolve(workingUnits)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        // commit('setWorkingUnitItems', [])
        // reject(error)
      }
      workingUnitApi.getWorkingUnits(getters.queries, cb, errorCb)
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
  async createWorkingUnit ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (workingUnit) => {
        const workingUnitItems = getters.workingUnitItems.concat([workingUnit])
        commit('setTotalWorkingUnitItems', getters.totalWorkingUnitItems + 1)
        commit('setWorkingUnitItems', workingUnitItems)
        resolve(workingUnit)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workingUnitApi.createWorkingUnit(payload, cb, errorCb)
    })
  },
  async readWorkingUnit ({ commit }, workingUnitId) {
    return new Promise((resolve, reject) => {
      let cb = (workingUnit) => {
        resolve(workingUnit)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workingUnitApi.readWorkingUnit(workingUnitId, cb, errorCb)
    })
  },
  async updateWorkingUnit ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (workingUnit) => {
        let workingUnitItems = getters.workingUnitItems
        let currentIndex = workingUnitItems.findIndex(item => item.workingUnitId === workingUnit.workingUnitId)
        if (currentIndex >= 0) {
          for (let key in workingUnit) {
            workingUnitItems[currentIndex][key] = workingUnit[key]
          }
        } else {
          workingUnitItems.push(workingUnit)
          commit('setTotalWorkingUnitItems', getters.totalWorkingUnitItems + 1)
        }
        commit('setWorkingUnitItems', workingUnitItems)
        resolve(workingUnit)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workingUnitApi.updateWorkingUnit(payload, cb, errorCb)
    })
  },
  async deleteWorkingUnit ({ commit, getters }, workingUnitId) {
    return new Promise((resolve, reject) => {
      let cb = (workingUnit) => {
        const workingUnitItems = getters.workingUnitItems.filter(item => item.workingUnitId !== workingUnitId)
        commit('setTotalWorkingUnitItems', getters.totalWorkingUnitItems - 1)
        commit('setWorkingUnitItems', workingUnitItems)
        resolve(workingUnit)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workingUnitApi.deleteWorkingUnit(workingUnitId, cb, errorCb)
    })
  },
  async putWorkingUnitLogo ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (workingUnit) => {
        resolve(workingUnit)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workingUnitApi.putWorkingUnitLogo(payload, cb, errorCb)
    })
  },
  async getWorkingUnitLogo ({ commit, getters }, workingUnitId) {
    return new Promise((resolve, reject) => {
      let cb = (workingUnit) => {
        resolve(workingUnit)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workingUnitApi.getWorkingUnitLogo(workingUnitId, cb, errorCb)
    })
  }
}

// mutations
const mutations = {
  setTotalWorkingUnitItems (state, payload) {
    state.totalWorkingUnitItems = payload
  },
  setWorkingUnitItems (state, payload) {
    state.workingUnitItems = payload
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
