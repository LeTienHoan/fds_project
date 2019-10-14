import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading/loading'
import user from './modules/common/user'
import workspace from './modules/sharing/workspace'
import docFile from './modules/docmgt/docFile'

Vue.use(Vuex)

export const storeFolder = new Vuex.Store({
  modules: {
    loading,
    user,
    workspace,
    docFile
  },
  state: {
    loadedContacts: [],
    keywords: '',
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
    setKeywords (state, payload) {
      state.keywords = payload
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
    setKeywords ({ dispatch, commit }, payload) {
      commit('setKeywords', payload)
      dispatch('loadActivities')
    },
    setFileAttachComponentState ({ dispatch, commit }, payload) {
      commit('setFileAttachComponentState', payload)
    }
  },
  getters: {
    loadedContacts (state) {
      return state.loadedContacts
    },
    keywords (state) {
      return state.keywords
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
