import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading/loading'
import user from './modules/common/user'
import { menuFilters } from '@/router/employees'
import workingUnit from './modules/common/workingUnit'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'
export const storeForgotPassword = new Vuex.Store({
  state: {
    staticRouters: menuFilters,
    end_point: window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/',
    group_id: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : null,
    user_id: window.themeDisplay ? window.themeDisplay.getUserId() : null,
    recaptcha: false
  },
  mutations: {
    updateRecaptcha: function (state, recaptcha) { state.recaptcha = recaptcha }
  },
  actions: {
  },
  getters: {
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
