import personalEventApi from '@/api/workmgt/personalevents'

// initial state
const state = {
  personalEventItems: [],
  queries: {},
  totalItems: 0
}

// getters
const getters = {
  personalEventItems: (state) => {
    return state.personalEventItems
  },
  queries: (state) => {
    return state.queries
  }
}

// actions
const actions = {
  async getPersonalEventItems ({ dispatch, commit, getters }, payload) {
    await dispatch('setQueries', payload.queries) // wait for `setQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (personalEvents) => {
        commit('setTotalItems', personalEvents.total)
        commit('setPersonalEventItems', personalEvents.data)
        resolve(personalEvents)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        // commit('setPersonalEventItems', [])
        // reject(error)
      }
      personalEventApi.getPersonalEvents(payload.urlParams, getters.queries, cb, errorCb)
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
  async createPersonalEvent ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (personalEvent) => {
        const personalEventItems = getters.personalEventItems.concat([personalEvent])
        commit('setTotalItems', getters.totalItems + 1)
        commit('setPersonalEventItems', personalEventItems)
        resolve(personalEvent)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      personalEventApi.createPersonalEvent(payload, cb, errorCb)
    })
  },
  async readPersonalEvent ({ commit }, personalEventId) {
    return new Promise((resolve, reject) => {
      let cb = (personalEvent) => {
        resolve(personalEvent)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      personalEventApi.readPersonalEvent(personalEventId, cb, errorCb)
    })
  },
  async updatePersonalEvent ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (personalEvent) => {
        let personalEventItems = getters.personalEventItems
        let currentIndex = personalEventItems.findIndex(item => item.personalEventId === personalEvent.personalEventId)
        if (currentIndex >= 0) {
          for (let key in personalEvent) {
            personalEventItems[currentIndex][key] = personalEvent[key]
          }
        } else {
          personalEventItems.push(personalEvent)
          commit('setTotalItems', getters.totalItems + 1)
        }
        commit('setPersonalEventItems', personalEventItems)
        resolve(personalEvent)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      personalEventApi.updatePersonalEvent(payload, cb, errorCb)
    })
  },
  async deletePersonalEvent ({ commit, getters }, personalEventId) {
    return new Promise((resolve, reject) => {
      let cb = (personalEvent) => {
        const personalEventItems = getters.personalEventItems.filter(item => item.personalEventId !== personalEventId)
        commit('setTotalItems', getters.totalItems - 1)
        commit('setPersonalEventItems', personalEventItems)
        resolve(personalEvent)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      personalEventApi.deletePersonalEvent(personalEventId, cb, errorCb)
    })
  },
  async copyPersonalEvent ({ commit, getters }, fromUserId) {
    return new Promise((resolve, reject) => {
      let cb = (personalEvent) => {
        resolve(personalEvent)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      personalEventApi.copyPersonalEvent({userId: fromUserId}, cb, errorCb)
    })
  }

}

// mutations
const mutations = {
  setTotalItems (state, payload) {
    state.totalItems = payload
  },
  setPersonalEventItems (state, payload) {
    state.personalEventItems = payload
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
