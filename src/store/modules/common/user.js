import userApi from '@/api/common/user'

// initial state
const state = {
  userItems: [],
  queries: {},
  totalUserItems: 0
}

// getters
const getters = {
  userItems: (state) => {
    return state.userItems
  },
  queries: (state) => {
    return state.queries
  },
  totalUserItems: (state) => {
    return state.totalUserItems
  }
}

// actions
const actions = {
  async getUserItems ({ dispatch, commit, getters }, queries) {
    await dispatch('setQueries', queries) // wait for `setQueries` to finish
    return new Promise((resolve, reject) => {
      let cb = (users) => {
        commit('setTotalUserItems', users.total)
        commit('setUserItems', users.data)
        resolve(users)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        // commit('setUserItems', [])
        // reject(error)
      }
      userApi.getUsers(getters.queries, cb, errorCb)
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
  async createUser ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (user) => {
        const userItems = getters.userItems.concat([user])
        commit('setTotalUserItems', getters.totalUserItems + 1)
        commit('setUserItems', userItems)
        resolve(user)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      userApi.createUser(payload, cb, errorCb)
    })
  },
  async readUser ({ commit }, userId) {
    return new Promise((resolve, reject) => {
      let cb = (user) => {
        resolve(user)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      userApi.readUser(userId, cb, errorCb)
    })
  },
  async updateUser ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (user) => {
        let userItems = getters.userItems
        let currentIndex = userItems.findIndex(item => item.userId === user.userId)
        if (currentIndex >= 0) {
          for (let key in user) {
            userItems[currentIndex][key] = user[key]
          }
        } else {
          userItems.push(user)
          commit('setTotalUserItems', getters.totalUserItems + 1)
        }
        commit('setUserItems', userItems)
        resolve(user)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      userApi.updateUser(payload, cb, errorCb)
    })
  },
  async deleteUser ({ commit, getters }, userId) {
    return new Promise((resolve, reject) => {
      let cb = (user) => {
        const userItems = getters.userItems.filter(item => item.userId !== userId)
        commit('setTotalUserItems', getters.totalUserItems - 1)
        commit('setUserItems', userItems)
        resolve(user)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      userApi.deleteUser(userId, cb, errorCb)
    })
  },
  async putUserLogo ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (user) => {
        resolve(user)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      userApi.putUserLogo(payload, cb, errorCb)
    })
  },
  async getUserLogo ({ commit, getters }, userId) {
    return new Promise((resolve, reject) => {
      let cb = (user) => {
        resolve(user)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      userApi.getUserLogo(userId, cb, errorCb)
    })
  }
}

// mutations
const mutations = {
  setTotalUserItems (state, payload) {
    state.totalUserItems = payload
  },
  setUserItems (state, payload) {
    state.userItems = payload
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
