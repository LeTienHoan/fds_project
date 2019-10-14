// Import ES6 Promise
import 'es6-promise/auto'
import 'babel-polyfill'
import 'url-search-params-polyfill'
// import axios from 'axios'

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
import Folder from './Folder'
import router from './router/folder'
import { storeFolder } from './store/folder'
import mixinApp from './mixin/mobilinkConstants'

// move component
import Uploader from './components/task/uploader.vue'
import UploaderBtn from './components/task/btn.vue'
import UploaderDrop from './components/task/drop.vue'
import UploaderUnsupport from './components/task/unsupport.vue'
import UploaderList from './components/task/list.vue'
import UploaderFiles from './components/task/files.vue'
import UploaderFile from './components/task/file.vue'
import JxEditor from './components/task/editor.vue'
// import JxMobilinkOnlineForm from './components/task/mobilink_online_form.vue'
import MobilinkTree from './components/MobilinkTree'
import JxMobilinkComment from './components/task/mobilink_comment.vue'
import JxMobilinkStatus from './components/task/mobilink_status.vue'

import ToggleButton from './components/task/mobilink_toggle_button.vue'
import JxMobilinkActivityInvitation from './components/task/mobilink_activity_invitation.vue'

import JxMobilinkActivityStar from './components/task/mobilink_activity_star.vue'
import MultiLanguage from './assets/js_common/vue-multilanguage'
import language from './lang/language'
import VueContentPlaceholders from 'vue-content-placeholders'
import CustomeDateTime from './components/CustomeDateTime'
import LoadingPage from './components/LoadingPage'

import JxMobilinkActivityEditable from './components/task/editable.vue'
import JxMobilinkActivityHeader from './components/task/mobilink_activity_header.vue'
import ShowHistory from './components/task_comp/show_history.vue'
import MblExpandPanel from './components/ExpandPanel'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.min.css'

Vue.component('vue-ctk-date-time-picker', VueCtkDateTimePicker)
Vue.component(MblExpandPanel.name, MblExpandPanel)
Vue.component(LoadingPage.name, LoadingPage)

Vue.component(Uploader.name, Uploader)
Vue.component(UploaderBtn.name, UploaderBtn)
Vue.component(UploaderDrop.name, UploaderDrop)
Vue.component(UploaderUnsupport.name, UploaderUnsupport)
Vue.component(UploaderList.name, UploaderList)
Vue.component(UploaderFiles.name, UploaderFiles)
Vue.component(UploaderFile.name, UploaderFile)
Vue.component(JxEditor.name, JxEditor)
// Vue.component(JxMobilinkOnlineForm.name, JxMobilinkOnlineForm)
Vue.component(MobilinkTree.name, MobilinkTree)
Vue.component(JxMobilinkComment.name, JxMobilinkComment)
Vue.component(JxMobilinkStatus.name, JxMobilinkStatus)
Vue.component(ToggleButton.name, ToggleButton)
Vue.component(JxMobilinkActivityInvitation.name, JxMobilinkActivityInvitation)
Vue.component(JxMobilinkActivityStar.name, JxMobilinkActivityStar)
Vue.component(JxMobilinkActivityEditable.name, JxMobilinkActivityEditable)
Vue.component(CustomeDateTime.name, CustomeDateTime)
Vue.component(JxMobilinkActivityHeader.name, JxMobilinkActivityHeader)
Vue.component(ShowHistory.name, ShowHistory)
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

sync(storeFolder, router)

router.beforeEach((to, from, next) => {
  if (
    to.matched.some(record => record.meta.checkPermission)
  ) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    let id = to.params.id
    console.log(id)
    next()
  } else {
    next()
  }
})

Vue.mixin(mixinApp)
Vue.mixin({
  data () {
    return {
      get calendarOthersPublicVariable () {
        return window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/'
      }
    }
  },
  methods: {
    calendarOthersPublicMethod (value) {
      if (value === false) {
        return 'text-bold'
      } else {
        return ''
      }
    }
  }
})

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
  el: '#folder-managerment',
  router: router,
  store: storeFolder,
  components: { Folder },
  template: '<Folder/>'
})
