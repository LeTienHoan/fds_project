import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading/loading'
import user from './modules/common/user'
import dashboard from './dashboard1'

Vue.use(Vuex)

export const storeSotttttv = new Vuex.Store({
  state: {
    end_point_new: window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2.1/mbl/' : 'http://192.168.10.36:8081/api/',
    end_point: window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://192.168.10.36:8081/api/',
    group_id: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : 42942,
    apiConfigHeader: {
      headers: {
        groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : 42942
      }
    }
  },
  modules: {
    loading,
    user,
    dashboard
  }
})
