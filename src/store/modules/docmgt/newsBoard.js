import newsBoardApi from '@/api/docmgt/newsboards'

// initial state
const state = {
  newsBoardItems: [],
  queries: {},
  totalItems: 0
}

// getters
const getters = {
  newsBoardItems: (state) => {
    return state.newsBoardItems
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
  async getNewsBoardItems ({ dispatch, commit, getters }, queries) {
    await dispatch('setQueries', queries) // wait for `setQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (newsBoards) => {
        commit('setTotalItems', newsBoards.total)
        commit('setNewsBoardItems', newsBoards.data)
        resolve(newsBoards)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        commit('setNewsBoardItems', [])
        reject(error)
      }
      newsBoardApi.getNewsBoards(getters.queries, cb, errorCb)
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
  async createNewsBoard ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (newsBoard) => {
        const newsBoardItems = getters.newsBoardItems.concat([newsBoard])
        commit('setTotalItems', getters.totalItems + 1)
        commit('setNewsBoardItems', newsBoardItems)
        resolve(newsBoard)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      newsBoardApi.createNewsBoard(payload, cb, errorCb)
    })
  },
  async readNewsBoard ({ commit }, newsBoardId) {
    return new Promise((resolve, reject) => {
      let cb = (newsBoard) => {
        resolve(newsBoard)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      newsBoardApi.readNewsBoard(newsBoardId, cb, errorCb)
    })
  },
  async downloadNewsBoard ({ commit }, newsBoardId) {
    return new Promise((resolve, reject) => {
      let cb = (fileZiped) => {
        resolve(fileZiped)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      newsBoardApi.readNewsBoard(newsBoardId, cb, errorCb)
    })
  },
  async updateNewsBoard ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (newsBoard) => {
        let newsBoardItems = getters.newsBoardItems
        let currentIndex = newsBoardItems.findIndex(item => item.newsBoardId === newsBoard.newsBoardId)
        if (currentIndex >= 0) {
          for (let key in newsBoard) {
            newsBoardItems[currentIndex][key] = newsBoard[key]
          }
        } else {
          newsBoardItems.push(newsBoard)
          commit('setTotalItems', getters.totalItems + 1)
        }
        commit('setNewsBoardItems', newsBoardItems)
        resolve(newsBoard)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      newsBoardApi.updateNewsBoard(payload, cb, errorCb)
    })
  },
  async deleteNewsBoard ({ commit, getters }, newsBoardId) {
    return new Promise((resolve, reject) => {
      let cb = (newsBoard) => {
        const newsBoardItems = getters.newsBoardItems.filter(item => item.newsBoardId !== newsBoardId)
        commit('setTotalItems', getters.totalItems - 1)
        commit('setNewsBoardItems', newsBoardItems)
        resolve(newsBoard)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      newsBoardApi.deleteNewsBoard(newsBoardId, cb, errorCb)
    })
  },
  async copyNewsBoard ({ commit, getters }, fromUserId) {
    return new Promise((resolve, reject) => {
      let cb = (newsBoard) => {
        resolve(newsBoard)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      newsBoardApi.copyNewsBoard({userId: fromUserId}, cb, errorCb)
    })
  }

}

// mutations
const mutations = {
  setTotalItems (state, payload) {
    state.totalItems = payload
  },
  setNewsBoardItems (state, payload) {
    state.newsBoardItems = payload
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
