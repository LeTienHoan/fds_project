import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading/loading'
import user from './modules/common/user'
import { menuFilters } from '@/router/contact'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'
export const storeContact = new Vuex.Store({
  state: {
    loadedActivities: {total: 0, data: []},
    loadedContacts: [],
    loadedContactsUpdate: [],
    staticRouters: menuFilters,
    pagination: 1,
    end_point: window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/',
    group_id: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : null,
    user_id: window.themeDisplay ? window.themeDisplay.getUserId() : null,
    textHeader: '',
    textSearch: '',
    sizePage: 5,
    keySearch: []
  },
  mutations: {
    addActivity (state, payload) {
      // alert('Commit activity')
      state.loadedActivities.push(payload)
    },
    setLoadedContacts (state, payload) {
      state.loadedContacts = payload
    },
    setLoadedContactsUpdate (state, payload) {
      state.loadedContactsUpdate = payload
    },
    setPagination (state, payload) {
      state.pagination = payload
    },
    setText (state, payload) {
      state.textHeader = payload
    },
    setSearchContact (state, payload) {
      state.keySearch = payload
    }
  },
  actions: {
    createActivity ({ commit, getters }, payload) {
      // alert('createActivity')
    },
    searchContact ({ dispatch, commit }, payload) {
      commit('setSearchContact', payload)
      this.dispatch('loadContacts')
    },
    setPaginationSize ({ dispatch, commit }, payload) {
      this.sizePage = payload
      this.dispatch('loadContacts')
    },
    loadContacts ({ commit }) {
      let vm = this
      let url = this.getters.end_point + 'contacts'
      let paramsContact = {}
      if (typeof vm.sizePage === 'undefined') {
        vm.sizePage = 20
      }
      paramsContact['start'] = this.getters.pagination * Number(this.sizePage) - Number(this.sizePage)
      paramsContact['end'] = this.getters.pagination * Number(this.sizePage)
      paramsContact['sort'] = 'fullName_EN_String'
      paramsContact['order'] = false
      paramsContact['contactNavigatorName'] = vm.state.route.name
      if (vm.state.keySearch.length > 0) {
        let contactType = 0
        for (var key in vm.state.keySearch) {
          if (vm.state.keySearch[key].fieldValue === 'keywords') {
            paramsContact['keywords'] = vm.state.keySearch[key].fieldName.slice(9)
          } else if (vm.state.keySearch[key].fieldValue === 'person') {
            contactType = contactType + 1
            paramsContact['contactType'] = 0
          } else if (vm.state.keySearch[key].fieldValue === 'organization') {
            contactType = contactType + 1
            paramsContact['contactType'] = 1
          }
          if (contactType > 1) {
            paramsContact['contactType'] = '0,1'
          }
        }
      }
      if (vm.state.route.path === '/all') {
        paramsContact['scope'] = 'all'
        commit('setText', 'Tất cả')
      } else if (vm.state.route.path === '/group') {
        paramsContact['scope'] = 'group'
        paramsContact['contactType'] = 2
        paramsContact['keywords'] = vm.state.keySearch
        commit('setText', 'Nhóm liên lạc')
      } else if (vm.state.route.path === '/mycontact') {
        paramsContact['scope'] = 'me'
        commit('setText', 'Liên lạc của tôi')
      } else if (vm.state.route.path === '/shared') {
        paramsContact['scope'] = 'share'
        commit('setText', 'Liên lạc được chia sẻ')
      } else {
        paramsContact['scope'] = 'me'
        commit('setText', 'Liên lạc của tôi')
      }
      let config = {
        params: paramsContact,
        headers: {
          'groupId': this.getters.group_id
        }
      }
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          commit('setLoadedContacts', {
            total: serializable.total,
            data: serializable.data
          })
        } else {
          commit('setLoadedContacts', {total: 0, data: []})
        }
        commit('setPagination', 1)
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    loadContactUpdate ({ commit }) {
      let url = this.getters.end_point + 'contacts'
      let paramsContact = {}
      paramsContact['sort'] = 'modified_Number'
      paramsContact['order'] = true
      paramsContact['start'] = this.getters.pagination * 5 - 5
      paramsContact['end'] = this.getters.pagination * 5
      paramsContact['scope'] = 'share'
      let config = {
        params: paramsContact,
        headers: {
          'groupId': this.getters.group_id
        }
      }
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          commit('setLoadedContactsUpdate', {
            total: serializable.total,
            data: serializable.data
          })
        } else {
          commit('setLoadedContactsUpdate', {total: 0, data: []})
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    deleteContact ({ dispatch, commit }, item) {
      let vm = this
      let config = {
        headers: {
          groupId: this.getters.group_id
        }
      }
      let url = this.getters.end_point + 'contacts/' + item.contactId
      window.axios.delete(url, config).then(function (response) {
        // let contactItems = this.getters.loadedContacts.filter(data => data.contactId !== item.contactId)
        // commit('setLoadedContacts', contactItems)
        setTimeout(function () {
          vm.dispatch('loadContacts')
          vm.dispatch('loadContactUpdate')
        }, 500)
        window.showMessageToastr('success', 'Xóa liên lạc thành công')
      })
        .catch(function (error) {
          window.showMessageByAPICode(error.response.status, error.response.data)
          console.log(error)
        })
    },
    updateContact ({ dispatch, commit }, item) {
      // let contactItems = this.getters.loadedContacts
      // for (let key in contactItems) {
      //   if (contactItems.contactId === item.contactId) {
      //     contactItems[key] = item
      //   }
      // }
      // commit('setLoadedContacts', contactItems)
      this.dispatch('loadContacts')
    },
    createContact ({ dispatch, commit }, item) {
      let contactItems = this.getters.loadedContacts
      contactItems.push(item)
      commit('setLoadedContacts', contactItems)
    },
    setPaginationPage ({ dispatch, commit }, payload) {
      commit('setPagination', payload['pagination'])
      this.dispatch('loadContacts')
    },
    setPaginationPageUpdate ({ dispatch, commit }, payload) {
      commit('setPagination', payload['pagination'])
      this.dispatch('loadContactUpdate')
    }
  },
  getters: {
    loadedContacts (state) {
      return state.loadedContacts
    },
    loadedContactsUpdate (state) {
      return state.loadedContactsUpdate
    },
    pagination (state) {
      return state.pagination
    },
    end_point (state) {
      return state.end_point
    },
    group_id (state) {
      return state.group_id
    },
    user_id (state) {
      return state.user_id
    },
    staticRouters (state) {
      return state.staticRouters
    },
    staticRouter (state) {
      return state.staticRouters.find(item => item.name === state.route['name'])
    },
    textHeader (state) {
      return state.textHeader
    }
  },
  modules: {
    loading,
    user
  },
  strict: process.env.NODE_ENV !== 'production'
})

// export const store = new Vuex.Store({
//   state: state,
//   getters: getters,
//   modules: {
//     workTime,
//     holiday,
//     notification
//   },
//   strict: debug
// })
