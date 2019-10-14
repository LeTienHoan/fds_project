import dictCollectionApi from '@/api/common/dictCollections'

// initial state
const state = {
  dictItemItems: [],
  dictItemQueries: {},
  totalDictItemItems: 0
}

// getters
const getters = {
  dictItemItems: (state) => {
    return state.dictItemItems
  },
  dictItemQueries: (state) => {
    return state.dictItemQueries
  },
  totalDictItemItems: (state) => {
    return state.totalDictItemItems
  }
}

// actions
const actions = {
  async getDictItemItems ({ dispatch, commit, getters }, dictItemQueries) {
    await dispatch('setDictItemQueries', dictItemQueries) // wait for `setDictItemQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (dictItems) => {
        commit('setTotalDictItemItems', dictItems.total)
        commit('setDictItemItems', dictItems.data)
        resolve(dictItems)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        // commit('setDictItemItems', [])
        // reject(error)
      }
      dictCollectionApi.getDictItems(getters.dictItemQueries, cb, errorCb)
    })
  },
  async setDictItemQueries ({ commit }, payload) {
    for (let key in payload) {
      if (!payload[key] && payload[key] !== 0) {
        delete payload[key]
      }
    }
    commit('setDictItemQueries', payload)
  },
  async createDictItem ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (dictItem) => {
        const dictItemItems = getters.dictItemItems.concat([dictItem])
        commit('setTotalDictItemItems', getters.totalDictItemItems + 1)
        commit('setDictItemItems', dictItemItems)
        resolve(dictItem)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.createDictItem(payload, cb, errorCb)
    })
  },
  async readDictItem ({ commit }, payload) {
    // payload = {collectionCode, itemCode}
    return new Promise((resolve, reject) => {
      let cb = (dictItem) => {
        resolve(dictItem)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.readDictItem(payload, cb, errorCb)
    })
  },
  async updateDictItem ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (dictItem) => {
        let dictItemItems = getters.dictItemItems
        let currentIndex = dictItemItems.findIndex(item => String(item.itemCode) === String(dictItem.itemCode))
        if (currentIndex >= 0) {
          for (let key in dictItem) {
            dictItemItems[currentIndex][key] = dictItem[key]
          }
        } else {
          dictItemItems.push(dictItem)
          commit('setTotalDictItemItems', getters.totalDictItemItems + 1)
        }
        commit('setDictItemItems', dictItemItems)
        resolve(dictItem)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.updateDictItem(payload, cb, errorCb)
    })
  },
  async deleteDictItem ({ commit, getters }, payload) {
    // payload = {collectionCode, itemCode}
    return new Promise((resolve, reject) => {
      let cb = (dictItem) => {
        const dictItemItems = getters.dictItemItems.filter(item => String(item.itemCode) !== String(payload.itemCode))
        commit('setTotalDictItemItems', getters.totalDictItemItems - 1)
        commit('setDictItemItems', dictItemItems)
        resolve(dictItem)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.deleteDictItem(payload, cb, errorCb)
    })
  },
  async putDictItemLogo ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (dictItem) => {
        resolve(dictItem)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.putDictItemLogo(payload, cb, errorCb)
    })
  },
  async getDictItemLogo ({ commit, getters }, payload) {
    // payload = {collectionCode, itemCode}
    return new Promise((resolve, reject) => {
      let cb = (dictItem) => {
        resolve(dictItem)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.getDictItemLogo(payload, cb, errorCb)
    })
  }
}

// mutations
const mutations = {
  setTotalDictItemItems (state, payload) {
    state.totalDictItemItems = payload
  },
  setDictItemItems (state, payload) {
    state.dictItemItems = payload
  },
  setDictItemQueries (state, payload) {
    state.dictItemQueries = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
