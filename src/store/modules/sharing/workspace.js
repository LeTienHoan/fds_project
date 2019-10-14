import workspaceApi from '@/api/sharing/workspace'

// initial state
const state = {
  newsboard_workspaceItems: [],
  newsboard_queries: {},
  newsboard_totalItems: 0,
  docfile_workspaceItems: [],
  docfile_queries: {},
  docfile_totalItems: 0,
  TASK_workspaceItems: [],
  TASK_queries: {},
  TASK_totalItems: 0,
  EVENT_workspaceItems: [],
  EVENT_queries: {},
  EVENT_totalItems: 0
}

// getters
const getters = {
  newsboard_workspaceItems: (state) => {
    return state.newsboard_workspaceItems
  },
  newsboard_queries: (state) => {
    return state.newsboard_queries
  },
  newsboard_totalItems: (state) => {
    return state.newsboard_totalItems
  },
  docfile_workspaceItems: (state) => {
    return state.docfile_workspaceItems
  },
  docfile_queries: (state) => {
    return state.docfile_queries
  },
  docfile_totalItems: (state) => {
    return state.docfile_totalItems
  },
  TASK_workspaceItems: (state) => {
    return state.TASK_workspaceItems
  },
  TASK_queries: (state) => {
    return state.TASK_queries
  },
  TASK_totalItems: (state) => {
    return state.TASK_totalItems
  },
  EVENT_workspaceItems: (state) => {
    return state.EVENT_workspaceItems
  },
  EVENT_queries: (state) => {
    return state.EVENT_queries
  },
  EVENT_totalItems: (state) => {
    return state.EVENT_totalItems
  }
}

// actions
const actions = {
  async getWorkspaceItems ({ dispatch, commit, getters }, queries) {
    await dispatch('setQueries', queries) // wait for `setQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (workspaces) => {
        commit('setTotalItems', {
          scope: queries.scope,
          value: workspaces.total
        })
        commit('setWorkspaceItems', {
          scope: queries.scope,
          value: workspaces.data
        })
        resolve(workspaces)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        commit('setWorkspaceItems', {
          scope: queries.scope,
          value: []
        })
        reject(error)
      }
      workspaceApi.getWorkspaces(getters[queries.scope + '_queries'], cb, errorCb)
    })
  },
  async setQueries ({ commit }, payload) {
    for (let key in payload) {
      if (payload[key] === '' || payload[key] === undefined ||
        payload[key] === 'undefined' || payload[key] === null) {
        delete payload[key]
      }
    }
    commit('setQueries', {
      scope: payload.scope,
      value: payload
    })
  },
  async createWorkspace ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (workspace) => {
        const workspaceItems = getters[payload.scope + '_workspaceItems'].concat([workspace])
        commit('setTotalItems', {
          scope: payload.scope,
          value: getters[payload.scope + '_totalItems'] + 1
        })
        commit('setWorkspaceItems', {
          scope: payload.scope,
          value: workspaceItems
        })
        resolve(workspace)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workspaceApi.createWorkspace(payload, cb, errorCb)
    })
  },
  async readWorkspace ({ commit }, workspaceId) {
    return new Promise((resolve, reject) => {
      let cb = (workspace) => {
        resolve(workspace)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workspaceApi.readWorkspace(workspaceId, cb, errorCb)
    })
  },
  async updateWorkspace ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (workspace) => {
        let workspaceItems = getters[payload.scope + '_workspaceItems']
        let currentIndex = workspaceItems.findIndex(item => item.workspaceId === workspace.workspaceId)
        if (currentIndex >= 0) {
          for (let key in workspace) {
            workspaceItems[currentIndex][key] = workspace[key]
          }
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>UPDATE ÍN STORE>>>', workspaceItems[currentIndex])
        } else {
          workspaceItems.push(workspace)
          commit('setTotalItems', {
            scope: payload.scope,
            value: getters[payload.scope + '_totalItems'] + 1
          })
        }
        commit('setWorkspaceItems', {
          scope: payload.scope,
          value: workspaceItems
        })
        resolve(workspace)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workspaceApi.updateWorkspace(payload, cb, errorCb)
    })
  },
  async deleteWorkspace ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (workspace) => {
        const workspaceItems = getters[payload.scope + '_workspaceItems'].filter(item => item.workspaceId !== payload.workspaceId)
        commit('setTotalItems', {
          scope: payload.scope,
          value: getters[payload.scope + '_totalItems'] - 1
        })
        commit('setWorkspaceItems', {
          scope: payload.scope,
          value: workspaceItems
        })
        resolve(workspace)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workspaceApi.deleteWorkspace(payload.workspaceId, cb, errorCb)
    })
  },
  async getWorkspacesCopy ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (workspaces) => {
        let workspaceItems = getters[payload.scope + '_workspaceItems'] // .filter(item => Number(item.workspaceId) !== Number(payload.targetId))
        workspaceItems = workspaceItems.concat(workspaces.data)
        commit('setTotalItems', {
          scope: payload.scope,
          value: getters[payload.scope + '_totalItems'] + workspaces.total
        })
        commit('setWorkspaceItems', {
          scope: payload.scope,
          value: workspaceItems
        })
        resolve(workspaces)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workspaceApi.getWorkspacesCopy(payload.sourceId, payload.targetId, cb, errorCb)
    })
  }

}

// mutations
const mutations = {
  setTotalItems (state, payload) {
    state[payload.scope + '_totalItems'] = payload.value
  },
  setWorkspaceItems (state, payload) {
    state[payload.scope + '_workspaceItems'] = payload.value
  },
  setQueries (state, payload) {
    state[payload.scope + '_queries'] = payload.value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
