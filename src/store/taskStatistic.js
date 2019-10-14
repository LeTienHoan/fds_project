import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading/loading'
import user from './modules/common/user'
import statistic from './modules/activity/statistic'
import workingUnit from './modules/common/workingUnit'

import { menuFilters } from '@/router/taskStatistic'

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

export const storeTaskStatistic = new Vuex.Store({
  state: state,
  getters: getters,
  modules: {
    'loading': loading,
    'user': user,
    'activityStatistic': statistic,
    'workingUnit': workingUnit
  },
  strict: debug
})
