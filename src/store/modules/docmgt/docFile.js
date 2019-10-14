import docFileApi from '@/api/docmgt/docfiles'

// initial state
const state = {
  docFileItems: [],
  queries: {},
  totalItems: 0,
  docFileCount: {}
}

// getters
const getters = {
  docFileItems: (state) => {
    return state.docFileItems
  },
  queries: (state) => {
    return state.queries
  },
  totalItems: (state) => {
    return state.totalItems
  },
  docFileCount: (state) => {
    return state.docFileCount
  }
}

// actions
const actions = {
  async getDocFileItems ({ dispatch, commit, getters }, queries) {
    await dispatch('setQueries', queries) // wait for `setQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (docFiles) => {
        commit('setTotalItems', docFiles.total)
        commit('setDocFileItems', docFiles.data)
        resolve(docFiles)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        commit('setDocFileItems', [])
        reject(error)
      }
      docFileApi.getDocFiles(getters.queries, cb, errorCb)
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
  async createDocFile ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (docFile) => {
        const docFileItems = getters.docFileItems.concat([docFile])
        commit('setTotalItems', getters.totalItems + 1)
        commit('setDocFileItems', docFileItems)
        resolve(docFile)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      docFileApi.createDocFile(payload, cb, errorCb)
    })
  },
  async readDocFile ({ commit }, docFileId) {
    return new Promise((resolve, reject) => {
      let cb = (docFile) => {
        resolve(docFile)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      docFileApi.readDocFile(docFileId, cb, errorCb)
    })
  },
  async downloadDocFile ({ commit }, docFileId) {
    return new Promise((resolve, reject) => {
      let cb = (fileZiped) => {
        resolve(fileZiped)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      docFileApi.readDocFile(docFileId, cb, errorCb)
    })
  },
  async updateDocFile ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (docFile) => {
        let docFileItems = getters.docFileItems
        let currentIndex = docFileItems.findIndex(item => item.docFileId === docFile.docFileId)
        if (currentIndex >= 0) {
          for (let key in docFile) {
            docFileItems[currentIndex][key] = docFile[key]
          }
        } else {
          docFileItems.push(docFile)
          commit('setTotalItems', getters.totalItems + 1)
        }
        commit('setDocFileItems', docFileItems)
        resolve(docFile)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      docFileApi.updateDocFile(payload, cb, errorCb)
    })
  },
  async deleteDocFile ({ commit, getters }, docFileId) {
    return new Promise((resolve, reject) => {
      let cb = (docFile) => {
        const docFileItems = getters.docFileItems.filter(item => item.docFileId !== docFileId)
        commit('setTotalItems', getters.totalItems - 1)
        commit('setDocFileItems', docFileItems)
        resolve(docFile)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      docFileApi.deleteDocFile(docFileId, cb, errorCb)
    })
  },
  async copyDocFile ({ commit, getters }, fromUserId) {
    return new Promise((resolve, reject) => {
      let cb = (docFile) => {
        resolve(docFile)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      docFileApi.copyDocFile({userId: fromUserId}, cb, errorCb)
    })
  },
  async count ({ dispatch, commit, getters }, queries) {
    return new Promise((resolve, reject) => {
      let cb = (count) => {
        commit('count', count)
        resolve(count)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        commit('count', {})
        reject(error)
      }
      docFileApi.count(queries, cb, errorCb)
    })
  }

}

// mutations
const mutations = {
  setTotalItems (state, payload) {
    state.totalItems = payload
  },
  setDocFileItems (state, payload) {
    state.docFileItems = payload
  },
  setQueries (state, payload) {
    state.queries = payload
  },
  count (state, payload) {
    state.docFileCount = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
