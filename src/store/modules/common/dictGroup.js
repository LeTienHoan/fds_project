import dictCollectionApi from '@/api/common/dictCollections'

// initial state
const state = {
  dictGroupItems: [],
  dictGroupQueries: {},
  totalDictGroupItems: 0
}

// getters
const getters = {
  dictGroupItems: (state) => {
    return state.dictGroupItems
  },
  dictGroupQueries: (state) => {
    return state.dictGroupQueries
  },
  totalDictGroupItems: (state) => {
    return state.totalDictGroupItems
  }
}

// actions
const actions = {
  async getDictGroupItems ({ dispatch, commit, getters }, dictGroupQueries) {
    await dispatch('setDictGroupQueries', dictGroupQueries) // wait for `setDictGroupQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (dictGroups) => {
        commit('setTotalDictGroupItems', dictGroups.total)
        commit('setDictGroupItems', dictGroups.data)
        resolve(dictGroups)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        // commit('setDictGroupItems', [])
        // reject(error)
      }
      dictCollectionApi.getDictGroups(getters.dictGroupQueries, cb, errorCb)
    })
  },
  async setDictGroupQueries ({ commit }, payload) {
    for (let key in payload) {
      if (payload[key] === '' || payload[key] === undefined ||
        payload[key] === 'undefined' || payload[key] === null) {
        delete payload[key]
      }
    }
    commit('setDictGroupQueries', payload)
  },
  async createDictGroup ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (dictGroup) => {
        const dictGroupItems = getters.dictGroupItems.concat([dictGroup])
        commit('setTotalDictGroupItems', getters.totalDictGroupItems + 1)
        commit('setDictGroupItems', dictGroupItems)
        resolve(dictGroup)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.createDictGroup(payload, cb, errorCb)
    })
  },
  async readDictGroup ({ commit }, payload) {
    // payload = {collectionCode, groupCode}
    return new Promise((resolve, reject) => {
      let cb = (dictGroup) => {
        resolve(dictGroup)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.readDictGroup(payload, cb, errorCb)
    })
  },
  async updateDictGroup ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (dictGroup) => {
        let dictGroupItems = getters.dictGroupItems
        let currentIndex = dictGroupItems.findIndex(item => String(item.groupCode) === String(dictGroup.groupCode))
        if (currentIndex >= 0) {
          for (let key in dictGroup) {
            dictGroupItems[currentIndex][key] = dictGroup[key]
          }
        } else {
          dictGroupItems.push(dictGroup)
          commit('setTotalDictGroupItems', getters.totalDictGroupItems + 1)
        }
        commit('setDictGroupItems', dictGroupItems)
        resolve(dictGroup)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.updateDictGroup(payload, cb, errorCb)
    })
  },
  async deleteDictGroup ({ commit, getters }, payload) {
    // payload = {collectionCode, groupCode}
    return new Promise((resolve, reject) => {
      let cb = (dictGroup) => {
        const dictGroupItems = getters.dictGroupItems.filter(item => String(item.groupCode) !== String(payload.groupCode))
        commit('setTotalDictGroupItems', getters.totalDictGroupItems - 1)
        commit('setDictGroupItems', dictGroupItems)
        resolve(dictGroup)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.deleteDictGroup(payload, cb, errorCb)
    })
  },
  async getDictItemInDictGroups ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (dictItems) => {
        resolve(dictItems)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.getDictItemInDictGroups(payload, cb, errorCb)
    })
  },
  async createDictItemInDictGroup ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (dictGroup) => {
        resolve(dictGroup)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.createDictItemInDictGroup(payload, cb, errorCb)
    })
  },
  async deleteDictItemInDictGroup ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (dictGroup) => {
        resolve(dictGroup)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.deleteDictItemInDictGroup(payload, cb, errorCb)
    })
  }
}

// mutations
const mutations = {
  setTotalDictGroupItems (state, payload) {
    state.totalDictGroupItems = payload
  },
  setDictGroupItems (state, payload) {
    state.dictGroupItems = payload
  },
  setDictGroupQueries (state, payload) {
    state.dictGroupQueries = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
