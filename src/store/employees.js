import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading/loading'
import user from './modules/common/user'
import { menuFilters } from '@/router/employees'
import workingUnit from './modules/common/workingUnit'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'
export const storeEmployee = new Vuex.Store({
  state: {
    loadedActivities: {total: 0, data: []},
    loadedEmployees: [],
    loadedEmployeesBirthday: [],
    loadedPosition: [],
    loadedJobpos: [],
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
    setLoadedEmployees (state, payload) {
      state.loadedEmployees = payload
    },
    setLoadedEmployeesBirthday (state, payload) {
      state.loadedEmployeesBirthday = payload
    },
    setLoadedPosition (state, payload) {
      state.loadedPosition = payload
    },
    setLoadedJobpos (state, payload) {
      state.loadedJobpos = payload
    },
    setPagination (state, payload) {
      state.pagination = payload
    },
    setText (state, payload) {
      state.textHeader = payload
    },
    setSearchEmployees (state, payload) {
      state.keySearch = payload
    }
  },
  actions: {
    createActivity ({ commit, getters }, payload) {
      // alert('createActivity')
    },
    searchEmployees ({ dispatch, commit }, payload) {
      commit('setSearchEmployees', payload)
      this.dispatch('loadEmployees')
    },
    setPaginationSize ({ dispatch, commit }, payload) {
      this.sizePage = payload
      this.dispatch('loadEmployees')
    },
    loadEmployees ({ commit }) {
      let vm = this
      let url = this.getters.end_point + 'employees'
      let params = {}
      if (typeof vm.sizePage === 'undefined') {
        vm.sizePage = 20
      }
      if (vm.state.keySearch.length > 0) {
        for (var key in vm.state.keySearch) {
          if (vm.state.keySearch[key].value === 'keywords') {
            params['keywords'] = vm.state.keySearch[key].text.slice(9)
          } else if (vm.state.keySearch[key].value === 'jobpos') {
            params['jobpos'] = vm.state.keySearch[key].id
            params['jobpos_text'] = vm.state.keySearch[key].text.slice(7)
          } else if (vm.state.keySearch[key].value === 'workingunit') {
            params['workingunit'] = vm.state.keySearch[key].id
          }
        }
      }
      // params['sort'] = 'employeeNo'
      params['start'] = this.getters.pagination * Number(this.sizePage) - Number(this.sizePage)
      params['end'] = this.getters.pagination * Number(this.sizePage)
      params['sort'] = 'fullName_String'
      params['panelBar_text'] = vm.state.route.name
      if (vm.state.route.path === '/all') {
        params['contactType'] = ''
        params['myContact'] = ''
        commit('setText', vm.state.route.name)
      } else if (vm.state.route.path === '/working') {
        params['status'] = 1
        params['status_text'] = vm.state.route.name
        commit('setText', vm.state.route.name)
      } else if (vm.state.route.path === '/hasRetired') {
        params['status'] = 0
        params['status_text'] = vm.state.route.name
        commit('setText', vm.state.route.name)
      } else {
        params['status'] = 1
        params['status_text'] = vm.state.route.name
        commit('setText', vm.state.route.name)
      }
      let config = {
        params: params,
        headers: {
          'groupId': this.getters.group_id
        }
      }
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          commit('setLoadedEmployees', {
            total: serializable.total,
            data: serializable.data
          })
        } else {
          commit('setLoadedEmployees', {total: 0, data: []})
        }
        commit('setPagination', 1)
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    loadEmployeesBirthday ({ commit }, payload) {
      let url = this.getters.end_point + 'employees'
      let params = {}
      params['sort'] = 'birthdate'
      params['start'] = this.getters.pagination * 5 - 5
      params['end'] = this.getters.pagination * 5
      params['month'] = payload
      let config = {
        params: params,
        headers: {
          'groupId': this.getters.group_id
        }
      }
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          commit('setLoadedEmployeesBirthday', {
            total: serializable.total,
            data: serializable.data
          })
        } else {
          commit('setLoadedEmployeesBirthday', {total: 0, data: []})
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    loadPosition ({ commit }, payload) {
      let vm = this
      let url = vm.getters.end_point + 'dictcollections/JOB_TITLE/dictitems'
      let params = {}
      params['sort'] = 'treeIndex'
      params['order'] = true
      params['start'] = -1
      params['end'] = -1
      let config = {
        params: params,
        headers: {
          'groupId': vm.getters.group_id
        }
      }
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          commit('setLoadedPosition', {
            total: serializable.total,
            data: serializable.data
          })
        } else {
          commit('setLoadedPosition', {total: 0, data: []})
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    loadJobpos ({ commit }, payload) {
      let vm = this
      let url = vm.getters.end_point + 'jobpos'
      let params = {}
      params['sorts'] = 'title'
      params['order'] = true
      let config = {
        params: params,
        headers: {
          'groupId': vm.getters.group_id
        }
      }
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          commit('setLoadedJobpos', {
            total: serializable.total,
            data: serializable.data
          })
        } else {
          commit('setLoadedJobpos', {total: 0, data: []})
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    deleteEmployees ({ dispatch, commit }, item) {
      let vm = this
      let config = {
        headers: {
          groupId: this.getters.group_id
        }
      }
      let url = this.getters.end_point + 'employees/' + item.employeeId
      window.axios.delete(url, config).then(function (response) {
        setTimeout(function () {
          vm.dispatch('loadEmployees')
        }, 500)
        window.showMessageToastr('success', 'Xóa nhân sự thành công')
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
      this.dispatch('loadEmployees')
    },
    setPaginationPageBirthday ({ dispatch, commit }, payload) {
      commit('setPagination', payload['pagination'])
      this.dispatch('loadEmployeesBirthday')
    }
  },
  getters: {
    loadedEmployees (state) {
      return state.loadedEmployees
    },
    loadedEmployeesBirthday (state) {
      return state.loadedEmployeesBirthday
    },
    loadedPosition (state) {
      return state.loadedPosition
    },
    loadedJobpos (state) {
      return state.loadedJobpos
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
    user,
    workingUnit
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
