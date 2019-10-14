
// initial state
const state = {
  loading: {
    state: false,
    message: 'Loading...'
  }
}

// getters
const getters = {
  loading: (state) => {
    return state.loading
  }
}

// actions
const actions = {
  async setLoading ({ dispatch, commit, getters }, payload) {
    let time = 0
    if (!payload.loading) {
      time = 500
    }
    setTimeout(() => {
      commit('setLoading', {
        state: payload.loading || false,
        message: payload.message || 'Loading...'
      })
    }, time)
  }
}

// mutations
const mutations = {
  setLoading (state, payload) {
    state.loading = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
