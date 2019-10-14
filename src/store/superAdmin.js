import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading/loading'
import user from './modules/common/user'
import dictCollectionApi from '@/api/common/dictCollections'
import workingUnitApi from '@/api/common/workingUnit'
import jobposApi from '@/api/common/jobpos'

import { menuFilters } from '@/router/superAdmin'
import workingUnit from './modules/common/workingUnit'
import workTime from './modules/common/workTime'
import holiday from './modules/common/holiday'
import notification from './modules/common/notification'
import jobpos from './modules/common/jobpos'
import dictCollection from './modules/common/dictCollection'
import dictGroup from './modules/common/dictGroup'
import dictItem from './modules/common/dictItem'
import dashboard from './dashboard1'
import location from './modules/common/location'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const state = {
  staticRouters: menuFilters,
  keywords: '',
  end_point: window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/',
  group_id: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : null,
  user_id: window.themeDisplay ? window.themeDisplay.getUserId() : null,
  allDictItemItems: [],
  allDictGroupItems: [],
  allDictCollectionItems: [],
  allWorkingUnitItems: [],
  allJobposItems: [],
  widgetObj: '',
  stateObj: ''
}
const mutations = {
  commitKeywords (state, payload) {
    state.keywords = payload
  },
  commitAllDictItemItems (state, payload) {
    state.allDictItemItems = payload
  },
  commitAllDictGroupItems (state, payload) {
    state.allDictGroupItems = payload
  },
  commitAllDictCollectionItems (state, payload) {
    state.allDictCollectionItems = payload
  },
  commitAllWorkingUnitItems (state, payload) {
    state.allWorkingUnitItems = payload
  },
  commitAllJobposItems (state, payload) {
    state.allJobposItems = payload
  },
  widgetObj: function (state, widgetObj) { state.widgetObj = widgetObj },
  stateObj: function (state, stateObj) { state.stateObj = stateObj }
}
const actions = {
  setKeywords ({ dispatch, commit }, payload) {
    commit('commitKeywords', payload)
  },
  getAllDictItemItems ({ dispatch, commit }, dictItemQueries) {
    return new Promise((resolve, reject) => {
      let cb = (dictItems) => {
        commit('commitAllDictItemItems', dictItems.data)
        resolve(dictItems)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.getDictItems(dictItemQueries, cb, errorCb)
    })
  },
  getAllDictGroupItems ({ dispatch, commit }, dictGroupQueries) {
    return new Promise((resolve, reject) => {
      let cb = (dictGroups) => {
        commit('commitAllDictGroupItems', dictGroups.data)
        resolve(dictGroups)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.getDictGroups(dictGroupQueries, cb, errorCb)
    })
  },
  getAllDictCollectionItems ({ dispatch, commit }, dictCollectionQueries) {
    return new Promise((resolve, reject) => {
      let cb = (dictCollections) => {
        commit('commitAllDictCollectionItems', dictCollections.data)
        resolve(dictCollections)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      dictCollectionApi.getDictCollections(dictCollectionQueries, cb, errorCb)
    })
  },
  getAllWorkingUnitItems ({ dispatch, commit }, workingUnitQueries) {
    return new Promise((resolve, reject) => {
      let cb = (workingUnits) => {
        commit('commitAllWorkingUnitItems', workingUnits.data)
        resolve(workingUnits)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      workingUnitApi.getWorkingUnits(workingUnitQueries, cb, errorCb)
    })
  },
  getAllJobposItems ({ dispatch, commit }, jobposQueries) {
    return new Promise((resolve, reject) => {
      let cb = (jobpos) => {
        commit('commitAllJobposItems', jobpos.data)
        resolve(jobpos)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      jobposApi.getJobposs(jobposQueries, cb, errorCb)
    })
  }
}
const getters = {
  staticRouters (state) {
    return state.staticRouters
  },
  staticRouter (state) {
    return state.staticRouters.find(item => Number(item.id) === Number(state.route['params'].id || 0))
  },
  keywords (state) {
    return state.keywords || ''
  },
  allDictItemItems (state) {
    return state.allDictItemItems || []
  },
  allDictGroupItems (state) {
    return state.allDictGroupItems || []
  },
  allDictCollectionItems (state) {
    return state.allDictCollectionItems || []
  },
  allWorkingUnitItems (state) {
    return state.allWorkingUnitItems || []
  },
  allJobposItems (state) {
    return state.allJobposItems || []
  }
}
const modules = {
  loading,
  workingUnit,
  workTime,
  holiday,
  notification,
  jobpos,
  dictCollection,
  dictGroup,
  dictItem,
  user,
  dashboard,
  location
}

export const storeSuperAdmin = new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
  modules: modules,
  strict: debug
})
