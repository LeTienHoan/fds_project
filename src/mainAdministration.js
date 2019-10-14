// Import ES6 Promise
import 'es6-promise/auto'
import 'babel-polyfill'
import 'url-search-params-polyfill'

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import { sync } from 'vuex-router-sync'
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
  VAvatar,
  VBtnToggle
} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'

import { timeFilter, dateTimeFilter, dateFilter } from './filter'
import Administration from './Administration'
import router from './router/administration'
import { storeAdministration } from './store/administration'
import mixinApp from './mixin/mobilinkConstants'
import mixinAdministration from './mixin/administration'
import LoadingPage from './components/LoadingPage'

// move component
import Uploader from './components/task/uploader.vue'
import UploaderBtn from './components/task/btn.vue'
import UploaderDrop from './components/task/drop.vue'
import UploaderUnsupport from './components/task/unsupport.vue'
import UploaderList from './components/task/list.vue'
import UploaderFiles from './components/task/files.vue'
import UploaderFile from './components/task/file.vue'
import JxEditor from './components/task/editor.vue'
import MultiLanguage from './assets/js_common/vue-multilanguage'
import language from './lang/language'
import VueContentPlaceholders from 'vue-content-placeholders'
import CustomeDateTime from './components/CustomeDateTime'

import JxMobilinkActivityEditable from './components/task/editable.vue'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.min.css'

Vue.component('vue-ctk-date-time-picker', VueCtkDateTimePicker)

Vue.component(LoadingPage.name, LoadingPage)
Vue.component(Uploader.name, Uploader)
Vue.component(UploaderBtn.name, UploaderBtn)
Vue.component(UploaderDrop.name, UploaderDrop)
Vue.component(UploaderUnsupport.name, UploaderUnsupport)
Vue.component(UploaderList.name, UploaderList)
Vue.component(UploaderFiles.name, UploaderFiles)
Vue.component(UploaderFile.name, UploaderFile)
Vue.component(JxEditor.name, JxEditor)
Vue.component(JxMobilinkActivityEditable.name, JxMobilinkActivityEditable)
Vue.component(CustomeDateTime.name, CustomeDateTime)
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
    VAvatar,
    VBtnToggle
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

sync(storeAdministration, router)

router.beforeEach((to, from, next) => {
  if (
    to.matched.some(record => record.meta.checkPermission)
  ) {
    next()
  } else {
    next()
  }
})

Vue.mixin(mixinApp)
Vue.mixin(mixinAdministration)

Vue.filter('datetime', dateTimeFilter)
Vue.filter('time', timeFilter)
Vue.filter('date', dateFilter)

Vue.config.productionTip = false

window.axios.defaults.headers.common['groupId'] = window.themeDisplay ? window.themeDisplay.getScopeGroupId() : 42942
window.axios.defaults.params = {
  start: -1,
  end: -1
}
/* eslint-disable no-new */
new Vue({
  el: '#administration',
  router: router,
  store: storeAdministration,
  components: { Administration },
  template: '<Administration/>'
})
