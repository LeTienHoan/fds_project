import Vue from 'vue'
import Vuex from 'vuex'
import workTime from './modules/common/workTime'
import holiday from './modules/common/holiday'
import notification from './modules/common/notification'
import loading from './modules/loading/loading'
import user from './modules/common/user'

import { menuFilters } from '@/router/administration'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
  staticRouters: menuFilters
}

const getters = {
  staticRouters: state => {
    return state.staticRouters
  },
  staticRouter (state) {
    return state.staticRouters.find(item => item.name === state.route['name'])
  }
}

export const storeAdministration = new Vuex.Store({
  state: state,
  getters: getters,
  modules: {
    loading,
    user,
    workTime,
    holiday,
    notification
  },
  strict: debug
})
