import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading/loading'
import user from './modules/common/user'
import { menuFilter } from '@/router/newsBoard'
import workspace from './modules/sharing/workspace'
import newsBoard from './modules/docmgt/newsBoard'
import docFile from './modules/docmgt/docFile'

Vue.use(Vuex)

export const storeNewsBoard = new Vuex.Store({
  modules: {
    loading,
    user,
    workspace,
    docFile,
    newsBoard
  },
  state: {
    loadedContacts: [],
    staticRouters: menuFilter,
    workingunitsItems: [],
    statusItems: [],
    activityCatItems: [],
    locationsItems: [],
    resourcetagsItems: [],
    otherQuery: {},
    end_point: window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://192.168.10.36:8081/api/',
    group_id: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : null,
    fileAttachComponentState: {
      id: null,
      action: null,
      countAction: null,
      fileAttach: {}
    }
  },
  mutations: {
    setLoadedContacts (state, payload) {
      state.loadedContacts = payload
    },
    setWorkingunitsItems (state, payload) {
      state.workingunitsItems = payload
    },
    setStatusItems (state, payload) {
      state.statusItems = payload
    },
    setActivityCatItems (state, payload) {
      state.activityCatItems = payload
    },
    setLocationsItems (state, payload) {
      state.locationsItems = payload
    },
    setResourcetagsItems (state, payload) {
      state.resourcetagsItems = payload
    },
    setOtherQuery (state, payload) {
      state.otherQuery = payload
    },
    setStaticRouters (state, payload) {
      state.staticRouters = payload
    },
    setFileAttachComponentState (state, payload) {
      state.fileAttachComponentState = payload
    }
  },
  actions: {
    loadContacts ({ commit }) {
      if (!this.getters.loadedContacts || this.getters.loadedContacts.length === 0) {
        let url = this.getters.end_point + 'contacts'
        let config = {
          headers: {
            'groupId': this.getters.group_id
          },
          params: {
            start: -1,
            end: -1
          }
        }
        window.axios.get(url, config).then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            commit('setLoadedContacts', serializable.data)
          }
        })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    setWorkingunitsItems ({ commit }) {
      let url = this.getters.end_point + 'workingunits'
      let config = {
        headers: {
          'groupId': this.getters.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          commit('setWorkingunitsItems', serializable.data)
        } else {
          commit('setWorkingunitsItems', serializable.data)
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    setStatusItems ({ commit }) {
      let className = window.ACTIVITY_CONST ? window.ACTIVITY_CONST.activityClassName : 'org.mobilink.activitymgt.model.Activity'
      let config = {
        headers: {
          'groupId': this.getters.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      let url = this.getters.end_point + 'visibilities/' + className + '/TASK/states'
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          commit('setStatusItems', serializable.data)
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    setActivityCatItems ({ commit }) {
      let config = {
        headers: {
          'groupId': this.getters.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      let url = this.getters.end_point + 'dictcollections/ACTIVITY_TYPE/dictitems?parent=TASK'
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          commit('setActivityCatItems', serializable.data)
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    setLocationsItems ({ commit }) {
      let url = this.getters.end_point + 'locations'
      let config = {
        headers: {
          'groupId': this.getters.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          commit('setLocationsItems', serializable.data)
        } else {
          commit('setLocationsItems', [])
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    setResourcetagsItems ({ commit }) {
      let url = this.getters.end_point + 'resourcetags'
      let config = {
        headers: {
          'groupId': this.getters.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          commit('setResourcetagsItems', serializable.data)
        } else {
          commit('setResourcetagsItems', [])
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    setOtherQuery ({ dispatch, commit, getters }, payload) {
      // TODO
      let otherQuery = {}
      if (payload.reset) {
        otherQuery = payload
      } else {
        Object.assign(otherQuery, getters.otherQuery, payload, {reset: false})
      }
      commit('setOtherQuery', otherQuery)
    },
    setStaticRouter ({ commit, getters }, payload) {
      let staticRouters = getters.staticRouters
      for (let k in staticRouters) {
        if (staticRouters[k]['name'] === payload['name']) {
          Object.assign(staticRouters[k], payload)
          break
        }
      }
      commit('setStaticRouters', staticRouters)
    },
    setFileAttachComponentState ({ dispatch, commit }, payload) {
      commit('setFileAttachComponentState', payload)
    }
  },
  getters: {
    loadedContacts (state) {
      return state.loadedContacts
    },
    workingunitsItems (state) {
      return state.workingunitsItems
    },
    statusItems (state) {
      return state.statusItems
    },
    activityCatItems (state) {
      return state.activityCatItems
    },
    locationsItems (state) {
      return state.locationsItems
    },
    resourcetagsItems (state) {
      return state.resourcetagsItems
    },
    staticRouters (state) {
      return state.staticRouters
    },
    staticRouter (state) {
      let staticRouters = state.staticRouters
      let staticRouter = {}
      for (let k in staticRouters) {
        if (staticRouters[k]['name'] === state.route['name']) {
          staticRouter = staticRouters[k]
          staticRouter.index = k
          break
        }
      }
      return staticRouter
    },
    otherQuery (state) {
      return state.otherQuery
    },
    end_point (state) {
      return state.end_point
    },
    group_id (state) {
      return state.group_id
    },
    fileAttachComponentState (state) {
      return state.fileAttachComponentState
    }
  }
})
