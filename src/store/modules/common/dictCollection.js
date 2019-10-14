import dictCollectionApi from '@/api/common/dictCollections'

// initial state
const state = {
  dictCollectionItems: [],
  dictCollectionQueries: {},
  totalDictCollectionItems: 0
}

// getters
const getters = {
  dictCollectionItems: (state) => {
    return state.dictCollectionItems
  },
  dictCollectionQueries: (state) => {
    return state.dictCollectionQueries
  },
  totalDictCollectionItems: (state) => {
    return state.totalDictCollectionItems
  }
}

// actions
const actions = {
  async getDictCollectionItems ({ dispatch, commit, getters }, dictCollectionQueries) {
    await dispatch('setDictCollectionQueries', dictCollectionQueries) // wait for `setDictCollectionQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (dictCollections) => {
        commit('setTotalDictCollectionItems', dictCollections.total)
        commit('setDictCollectionItems', dictCollections.data)
        resolve(dictCollections)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        // commit('setDictCollectionItems', [])
        // reject(error)
      }
      dictCollectionApi.getDictCollections(getters.dictCollectionQueries, cb, errorCb)
    })
  },
  async setDictCollectionQueries ({ commit }, payload) {
    for (let key in payload) {
      if (payload[key] === '' || payload[key] === undefined ||
        payload[key] === 'undefined' || payload[key] === null) {
        delete payload[key]
      }
    }
    commit('setDictCollectionQueries', payload)
  },
  async createDictCollection ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (dictCollection) => {
        const dictCollectionItems = getters.dictCollectionItems.concat([dictCollection])
        commit('setTotalDictCollectionItems', getters.totalDictCollectionItems + 1)
        commit('setDictCollectionItems', dictCollectionItems)
        resolve(dictCollection)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.createDictCollection(payload, cb, errorCb)
    })
  },
  async readDictCollection ({ commit }, collectionCode) {
    return new Promise((resolve, reject) => {
      let cb = (dictCollection) => {
        resolve(dictCollection)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.readDictCollection(collectionCode, cb, errorCb)
    })
  },
  async updateDictCollection ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (dictCollection) => {
        let dictCollectionItems = getters.dictCollectionItems
        let currentIndex = dictCollectionItems.findIndex(item => String(item.collectionCode) === String(dictCollection.collectionCode))
        if (currentIndex >= 0) {
          for (let key in dictCollection) {
            dictCollectionItems[currentIndex][key] = dictCollection[key]
          }
        } else {
          dictCollectionItems.push(dictCollection)
          commit('setTotalDictCollectionItems', getters.totalDictCollectionItems + 1)
        }
        commit('setDictCollectionItems', dictCollectionItems)
        resolve(dictCollection)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.updateDictCollection(payload, cb, errorCb)
    })
  },
  async deleteDictCollection ({ commit, getters }, collectionCode) {
    return new Promise((resolve, reject) => {
      let cb = (dictCollection) => {
        const dictCollectionItems = getters.dictCollectionItems.filter(item => String(item.collectionCode) !== String(collectionCode))
        commit('setTotalDictCollectionItems', getters.totalDictCollectionItems - 1)
        commit('setDictCollectionItems', dictCollectionItems)
        resolve(dictCollection)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.deleteDictCollection(collectionCode, cb, errorCb)
    })
  },
  async putDictCollectionLogo ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (dictCollection) => {
        resolve(dictCollection)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.putDictCollectionLogo(payload, cb, errorCb)
    })
  },
  async getDictCollectionLogo ({ commit, getters }, collectionCode) {
    return new Promise((resolve, reject) => {
      let cb = (dictCollection) => {
        resolve(dictCollection)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.getDictCollectionLogo(collectionCode, cb, errorCb)
    })
  }
}

// mutations
const mutations = {
  setTotalDictCollectionItems (state, payload) {
    state.totalDictCollectionItems = payload
  },
  setDictCollectionItems (state, payload) {
    state.dictCollectionItems = payload
  },
  setDictCollectionQueries (state, payload) {
    state.dictCollectionQueries = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
