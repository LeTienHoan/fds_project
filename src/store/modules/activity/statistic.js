import activityStatisticApi from '@/api/activity/statistics'

// initial state
const state = {
  activityStatisticItems: [],
  queries: {},
  totalItems: 0,
  workingUnitActivityStatisticItems: [],
  workingUnitQueries: {},
  workingUnitTotalItems: 0,
  userActivityStatisticItems: [],
  userQueries: {},
  userTotalItems: 0,
  activityStatisticsLogsItems: [],
  activityStatisticsLogsQueries: {},
  activityStatisticsLogsTotalItems: 0
}

// getters
const getters = {
  activityStatisticItems: (state) => {
    return state.activityStatisticItems
  },
  queries: (state, getters, rootState) => {
    return state.queries
  },
  totalItems: (state) => {
    return state.totalItems
  },
  workingUnitActivityStatisticItems: (state) => {
    return state.workingUnitActivityStatisticItems
  },
  workingUnitQueries: (state) => {
    return state.workingUnitQueries
  },
  workingUnitTotalItems: (state) => {
    return state.workingUnitTotalItems
  },
  userActivityStatisticItems: (state) => {
    return state.userActivityStatisticItems
  },
  userQueries: (state) => {
    return state.userQueries
  },
  userTotalItems: (state) => {
    return state.userTotalItems
  },
  activityStatisticsLogsItems: (state) => {
    return state.activityStatisticsLogsItems
  },
  activityStatisticsLogsQueries: (state) => {
    return state.activityStatisticsLogsQueries
  },
  activityStatisticsLogsTotalItems: (state) => {
    return state.activityStatisticsLogsTotalItems
  }
}

// actions
const actions = {
  async getActivityStatisticItems ({ dispatch, commit, getters }, queries) {
    if (!queries.notSaveToStore) {
      await dispatch('setQueries', queries) // wait for `setQueries` to finish
    }

    return new Promise((resolve, reject) => {
      let cb = (activityStatistics) => {
        if (!queries.notSaveToStore) {
          commit('setTotalItems', activityStatistics.total)
          commit('setActivityStatisticItems', activityStatistics.data)
        }
        resolve(activityStatistics)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        if (!queries.notSaveToStore) {
          commit('setTotalItems', 0)
          commit('setActivityStatisticItems', [])
        }
        reject(error)
      }
      activityStatisticApi.getActivityStatistics(queries, cb, errorCb, queries ? queries.keyName : '')
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
  async getWorkingUnitActivityStatisticItems ({ dispatch, commit, getters }, queries) {
    await dispatch('setWorkingUnitQueries', queries) // wait for `setQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (workingUnitActivityStatistics) => {
        commit('setWorkingUnitTotalItems', workingUnitActivityStatistics.total)
        commit('setWorkingUnitActivityStatisticItems', workingUnitActivityStatistics.data)
        resolve(workingUnitActivityStatistics)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        commit('setWorkingUnitActivityStatisticItems', [])
        reject(error)
      }
      activityStatisticApi.getActivityStatisticsWorkingUnits(getters['workingUnitQueries'], cb, errorCb)
    })
  },
  async setWorkingUnitQueries ({ commit }, payload) {
    for (let key in payload) {
      if (payload[key] === '' || payload[key] === undefined ||
        payload[key] === 'undefined' || payload[key] === null) {
        delete payload[key]
      }
    }
    commit('setWorkingUnitQueries', payload)
  },
  async getUserActivityStatisticItems ({ dispatch, commit, getters }, queries) {
    await dispatch('setUserQueries', queries) // wait for `setUserQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (userActivityStatistics) => {
        commit('setUserTotalItems', userActivityStatistics.total)
        commit('setUserActivityStatisticItems', userActivityStatistics.data)
        resolve(userActivityStatistics)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        commit('setUserActivityStatisticItems', [])
        reject(error)
      }
      activityStatisticApi.getActivityStatisticsUsers(getters['userQueries'], cb, errorCb)
    })
  },
  async setUserQueries ({ commit }, payload) {
    for (let key in payload) {
      if (payload[key] === '' || payload[key] === undefined ||
        payload[key] === 'undefined' || payload[key] === null) {
        delete payload[key]
      }
    }
    commit('setUserQueries', payload)
  },
  async getActivityStatisticsLogs ({ dispatch, commit, getters }, queries) {
    await dispatch('setActivityStatisticsLogsQueries', queries) // wait for `setQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (activityStatisticsLogs) => {
        commit('setActivityStatisticsLogsTotalItems', activityStatisticsLogs.total)
        commit('setActivityStatisticsLogsItems', activityStatisticsLogs.data)
        resolve(activityStatisticsLogs)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        commit('setActivityStatisticsLogsItems', [])
        reject(error)
      }
      activityStatisticApi.getActivityStatisticsLogs(getters['activityStatisticsLogsQueries'], cb, errorCb)
    })
  },
  async setActivityStatisticsLogsQueries ({ commit }, payload) {
    for (let key in payload) {
      if (payload[key] === '' || payload[key] === undefined ||
        payload[key] === 'undefined' || payload[key] === null) {
        delete payload[key]
      }
    }
    commit('setActivityStatisticsLogsQueries', payload)
  }

}

// mutations
const mutations = {
  setTotalItems (state, payload) {
    state['totalItems'] = payload
  },
  setActivityStatisticItems (state, payload) {
    state['activityStatisticItems'] = payload
  },
  setQueries (state, payload) {
    state['queries'] = payload
  },
  setWorkingUnitTotalItems (state, payload) {
    state['workingUnitTotalItems'] = payload
  },
  setWorkingUnitActivityStatisticItems (state, payload) {
    state['workingUnitActivityStatisticItems'] = payload
  },
  setWorkingUnitQueries (state, payload) {
    state['workingUnitQueries'] = payload
  },
  setUserTotalItems (state, payload) {
    state['userTotalItems'] = payload
  },
  setUserActivityStatisticItems (state, payload) {
    state['userActivityStatisticItems'] = payload
  },
  setUserQueries (state, payload) {
    state['userQueries'] = payload
  },
  setActivityStatisticsLogsTotalItems (state, payload) {
    state['activityStatisticsLogsTotalItems'] = payload
  },
  setActivityStatisticsLogsItems (state, payload) {
    state['activityStatisticsLogsItems'] = payload
  },
  setActivityStatisticsLogsQueries (state, payload) {
    state['activityStatisticsLogsQueries'] = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
