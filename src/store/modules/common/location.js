import locationApi from '@/api/common/locations'

// initial state
const state = {
  locationItems: [],
  queries: {},
  totalItems: 0
}

// getters
const getters = {
  locationItems: (state) => {
    return state.locationItems
  },
  queries: (state) => {
    return state.queries
  },
  totalItems: (state) => {
    return state.totalItems
  }
}

// actions
const actions = {
  async getLocationItems ({ dispatch, commit, getters }, queries) {
    await dispatch('setQueries', queries) // wait for `setQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (locations) => {
        commit('setTotalItems', locations.total)
        commit('setLocationItems', locations.data)
        resolve(locations)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        commit('setLocationItems', [])
        reject(error)
      }
      locationApi.getLocations(getters.queries, cb, errorCb)
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
  async createLocation ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (location) => {
        const locationItems = getters.locationItems.concat([location])
        commit('setTotalItems', getters.totalItems + 1)
        commit('setLocationItems', locationItems)
        resolve(location)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      locationApi.createLocation(payload, cb, errorCb)
    })
  },
  async readLocation ({ commit }, locationId) {
    return new Promise((resolve, reject) => {
      let cb = (location) => {
        resolve(location)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      locationApi.readLocation(locationId, cb, errorCb)
    })
  },
  async downloadLocation ({ commit }, locationId) {
    return new Promise((resolve, reject) => {
      let cb = (fileZiped) => {
        resolve(fileZiped)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      locationApi.readLocation(locationId, cb, errorCb)
    })
  },
  async updateLocation ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (location) => {
        let locationItems = getters.locationItems
        let currentIndex = locationItems.findIndex(item => item.locationId === location.locationId)
        if (currentIndex >= 0) {
          for (let key in location) {
            locationItems[currentIndex][key] = location[key]
          }
        } else {
          locationItems.push(location)
          commit('setTotalItems', getters.totalItems + 1)
        }
        commit('setLocationItems', locationItems)
        resolve(location)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      locationApi.updateLocation(payload, cb, errorCb)
    })
  },
  async deleteLocation ({ commit, getters }, locationId) {
    return new Promise((resolve, reject) => {
      let cb = (location) => {
        const locationItems = getters.locationItems.filter(item => item.locationId !== locationId)
        commit('setTotalItems', getters.totalItems - 1)
        commit('setLocationItems', locationItems)
        resolve(location)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      locationApi.deleteLocation(locationId, cb, errorCb)
    })
  },
  async copyLocation ({ commit, getters }, fromUserId) {
    return new Promise((resolve, reject) => {
      let cb = (location) => {
        resolve(location)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      locationApi.copyLocation({userId: fromUserId}, cb, errorCb)
    })
  }

}

// mutations
const mutations = {
  setTotalItems (state, payload) {
    state.totalItems = payload
  },
  setLocationItems (state, payload) {
    state.locationItems = payload
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
