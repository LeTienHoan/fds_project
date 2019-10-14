import jobposApi from '@/api/common/jobpos'

// initial state
const state = {
  jobposItems: [],
  queries: {},
  totalJobposItems: 0
}

// getters
const getters = {
  jobposItems: (state) => {
    return state.jobposItems
  },
  queries: (state) => {
    return state.queries
  },
  totalJobposItems: (state) => {
    return state.totalJobposItems
  }
}

// actions
const actions = {
  async getJobposItems ({ dispatch, commit, getters }, queries) {
    await dispatch('setQueries', queries) // wait for `setQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (jobposs) => {
        commit('setTotalJobposItems', jobposs.total)
        commit('setJobposItems', jobposs.data)
        resolve(jobposs)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        // commit('setJobposItems', [])
        // reject(error)
      }
      jobposApi.getJobposs(getters.queries, cb, errorCb)
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
  async createJobpos ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (jobpos) => {
        const jobposItems = getters.jobposItems.concat([jobpos])
        commit('setTotalJobposItems', getters.totalJobposItems + 1)
        commit('setJobposItems', jobposItems)
        resolve(jobpos)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      jobposApi.createJobpos(payload, cb, errorCb)
    })
  },
  async readJobpos ({ commit }, jobPosId) {
    return new Promise((resolve, reject) => {
      let cb = (jobpos) => {
        resolve(jobpos)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      jobposApi.readJobpos(jobPosId, cb, errorCb)
    })
  },
  async updateJobpos ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (jobpos) => {
        let jobposItems = getters.jobposItems
        let currentIndex = jobposItems.findIndex(item => item.jobPosId === jobpos.jobPosId)
        if (currentIndex >= 0) {
          for (let key in jobpos) {
            jobposItems[currentIndex][key] = jobpos[key]
          }
        } else {
          jobposItems.push(jobpos)
          commit('setTotalJobposItems', getters.totalJobposItems + 1)
        }
        commit('setJobposItems', jobposItems)
        resolve(jobpos)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      jobposApi.updateJobpos(payload, cb, errorCb)
    })
  },
  async deleteJobpos ({ commit, getters }, jobPosId) {
    return new Promise((resolve, reject) => {
      let cb = (jobpos) => {
        const jobposItems = getters.jobposItems.filter(item => item.jobPosId !== jobPosId)
        commit('setTotalJobposItems', getters.totalJobposItems - 1)
        commit('setJobposItems', jobposItems)
        resolve(jobpos)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      jobposApi.deleteJobpos(jobPosId, cb, errorCb)
    })
  },
  async putJobposLogo ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (jobpos) => {
        resolve(jobpos)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      jobposApi.putJobposLogo(payload, cb, errorCb)
    })
  },
  async getJobposLogo ({ commit, getters }, jobPosId) {
    return new Promise((resolve, reject) => {
      let cb = (jobpos) => {
        resolve(jobpos)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      jobposApi.getJobposLogo(jobPosId, cb, errorCb)
    })
  }
}

// mutations
const mutations = {
  setTotalJobposItems (state, payload) {
    state.totalJobposItems = payload
  },
  setJobposItems (state, payload) {
    state.jobposItems = payload
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
