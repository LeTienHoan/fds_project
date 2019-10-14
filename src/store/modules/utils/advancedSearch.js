import advancedSearchApi from '@/api/utils/advancedSearchs'

// initial state
const state = {
  advancedSearchItems: [],
  dictFields: [],
  advancedSearchNewQueries: {
    advansearchListAmazings: []
  }
}

// getters
const getters = {
  advancedSearchItems: (state) => {
    return state.advancedSearchItems
  },
  dictFields: (state) => {
    return state.dictFields
  },
  advancedSearchNewQueries (state) {
    return state.advancedSearchNewQueries
  }
}

// actions
const actions = {
  async getAdvancedSearchItems ({ dispatch, commit, getters }, queries) {
    return new Promise((resolve, reject) => {
      let cb = (advancedSearchs) => {
        commit('setAdvancedSearchItems', advancedSearchs)
        resolve(advancedSearchs)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        commit('setAdvancedSearchItems', [])
        reject(error)
      }
      advancedSearchApi.getAdvancedSearchs(queries, cb, errorCb)
    })
  },
  async getDictFields ({ commit }, queries) {
    return new Promise((resolve, reject) => {
      let cb = (dictFields) => {
        commit('setDictFields', dictFields)
        resolve(dictFields)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        commit('setDictFields', [])
        reject(error)
      }
      advancedSearchApi.getDictFields(queries, cb, errorCb)
    })
  },
  async createAdvancedSearch ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (advancedSearch) => {
        commit('setAdvancedSearchItems', newAdItems.concat(
          getters.advancedSearchItems.filter(item => !item.allowDelete)
        ))
        resolve(newItem)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      const newItem = Object.assign({
        advancedSearchZUUID: new Date().getTime()
      }, payload.data)
      const newAdItems = getters.advancedSearchItems.filter(item => item.allowDelete).concat(newItem)
      advancedSearchApi.updateAdvancedSearch({
        preferenceKey: payload.preferenceKey,
        data: newAdItems
      }, cb, errorCb)
    })
  },
  async updateAdvancedSearch ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (advancedSearch) => {
        commit('setAdvancedSearchItems', newAdItems.concat(
          getters.advancedSearchItems.filter(item => !item.allowDelete)
        ))
        resolve(payload.data)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      const newAdItems = getters.advancedSearchItems.filter(item => item.allowDelete && (item.advancedSearchZUUID !== payload.data.advancedSearchZUUID))
        .concat(payload.data || [])
      advancedSearchApi.updateAdvancedSearch({
        preferenceKey: payload.preferenceKey,
        data: newAdItems
      }, cb, errorCb)
    })
  },
  async deleteAdvancedSearch ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (advancedSearch) => {
        commit('setAdvancedSearchItems', newAdItems.concat(
          getters.advancedSearchItems.filter(item => !item.allowDelete)
        ))
        resolve(advancedSearch)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      const newAdItems = getters.advancedSearchItems.filter(item => item.allowDelete && (item.advancedSearchZUUID !== payload.advancedSearchZUUID))
      advancedSearchApi.updateAdvancedSearch({
        preferenceKey: payload.preferenceKey,
        data: newAdItems
      }, cb, errorCb)
    })
  },
  setAdvancedSearchNewQueries ({ dispatch, commit, getters }, payload) {
    commit('setAdvancedSearchNewQueries', payload)
  },
  updateAdvancedSearchNewQueries ({ dispatch, commit, getters }, payload) {
    // TODO
    let advancedSearchNewQueries = {}
    Object.assign(advancedSearchNewQueries, getters.advancedSearchNewQueries, payload)
    commit('setAdvancedSearchNewQueries', advancedSearchNewQueries)
  }

}

// mutations
const mutations = {
  setDictFields (state, payload) {
    state.dictFields = payload
  },
  setAdvancedSearchItems (state, payload) {
    state.advancedSearchItems = payload
  },
  setAdvancedSearchNewQueries (state, payload) {
    state.advancedSearchNewQueries = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
