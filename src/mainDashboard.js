// Import ES6 Promise
import 'es6-promise/auto'
import 'babel-polyfill'
import 'url-search-params-polyfill'

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import VuejsDialog from 'vuejs-dialog'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions,
  VCard,
  VTextField,
  VSubheader,
  VDivider,
  VSelect,
  VMenu,
  VExpansionPanel,
  VDialog,
  VForm,
  VSnackbar,
  VCheckbox,
  VAlert,
  VDatePicker,
  VTimePicker,
  VDataTable,
  VPagination,
  VRadioGroup,
  VTabs,
  VTooltip,
  VChip,
  VProgressCircular,
  VProgressLinear,
  VCarousel,
  VAvatar
} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'

import Dashboard from './Dashboard'
import { timeFilter, dateTimeFilter } from './filter'
import { storeDashboard } from './store/dashboard'
import mixinApp from './mixin/mobilinkConstants'

import MultiLanguage from './assets/js_common/vue-multilanguage'
import language from './lang/language'
import VueContentPlaceholders from 'vue-content-placeholders'
import LoadingPage from './components/LoadingPage'

import MblExpandPanel from './components/ExpandPanel'
Vue.component(MblExpandPanel.name, MblExpandPanel)
Vue.component(LoadingPage.name, LoadingPage)
Vue.use(VueContentPlaceholders)
Vue.use(MultiLanguage, language)

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions,
    VCard,
    VTextField,
    VSubheader,
    VDivider,
    VSelect,
    VMenu,
    VExpansionPanel,
    VDialog,
    VForm,
    VSnackbar,
    VCheckbox,
    VAlert,
    VDatePicker,
    VTimePicker,
    VDataTable,
    VPagination,
    VRadioGroup,
    VTabs,
    VTooltip,
    VChip,
    VProgressCircular,
    VProgressLinear,
    VCarousel,
    VAvatar
  },
  theme: {
    primary: '#039BE5',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
})
Vue.use(VuejsDialog)

Vue.mixin(mixinApp)
Vue.mixin({
  data () {
    return {
      get isLiferayAdmin () {
        return window.DASHBOARD_CONST ? window.DASHBOARD_CONST.isLiferayAdmin : true
      }
    }
  }
})

Vue.filter('datetime', dateTimeFilter)
Vue.filter('time', timeFilter)

Vue.config.productionTip = false

window.axios.defaults.headers.common['groupId'] = window.themeDisplay ? window.themeDisplay.getScopeGroupId() : 42942
window.axios.defaults.params = {
  start: -1,
  end: -1
}
/* eslint-disable no-new */
new Vue({
  el: '#dashboard',
  store: storeDashboard,
  components: { Dashboard },
  template: '<Dashboard/>'
})
