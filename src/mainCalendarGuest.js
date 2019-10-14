// Import ES6 Promise
import 'es6-promise/auto'
import 'babel-polyfill'
import 'url-search-params-polyfill'

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import { sync } from 'vuex-router-sync'
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
import VuejsDialog from 'vuejs-dialog'
import VueContentPlaceholders from 'vue-content-placeholders'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.min.css'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'

import MultiLanguage from './assets/js_common/vue-multilanguage'
import language from './lang/language'

import DiaLog from './components/DiaLog'
import ToolBar from './components/ToolBar'
import MobilinkTree from './components/MobilinkTree'
import CustomeDateTime from './components/CustomeDateTime'
import MblExpandPanel from './components/ExpandPanel'
import LoadingPage from './components/LoadingPage'

import { timeFilter, dateTimeFilter, dateFilter } from './filter'
import mixinApp from './mixin/mobilinkConstants'

import auth2GooglePicker from './assets/js_common/auth2GooglePicker'

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
import ToggleButton from './components/task/mobilink_toggle_button.vue'

import JxMobilinkActivityEditable from './components/task/editable.vue'

import Calendar from './Calendar'
import router from './router/calendarguest'
import { storeCalendar } from './store/calendar'

Vue.use(VuejsDialog)
Vue.component('vue-ctk-date-time-picker', VueCtkDateTimePicker)
Vue.use(VueContentPlaceholders)
Vue.use(MultiLanguage, language)
Vue.component(MblExpandPanel.name, MblExpandPanel)
Vue.component(MobilinkTree.name, MobilinkTree)
Vue.component(DiaLog.name, DiaLog)
Vue.component(ToolBar.name, ToolBar)
Vue.component(LoadingPage.name, LoadingPage)

Vue.component(Uploader.name, Uploader)
Vue.component(UploaderBtn.name, UploaderBtn)
Vue.component(UploaderDrop.name, UploaderDrop)
Vue.component(UploaderUnsupport.name, UploaderUnsupport)
Vue.component(UploaderList.name, UploaderList)
Vue.component(UploaderFiles.name, UploaderFiles)
Vue.component(UploaderFile.name, UploaderFile)
Vue.component(JxEditor.name, JxEditor)
// Vue.component(JxMobilinkOnlineForm.name, JxMobilinkOnlineForm)MobilinkTree
Vue.component(ToggleButton.name, ToggleButton)
Vue.component(JxMobilinkActivityEditable.name, JxMobilinkActivityEditable)
Vue.component(CustomeDateTime.name, CustomeDateTime)

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

sync(storeCalendar, router)

router.beforeEach((to, from, next) => {
  if (
    to.matched.some(record => record.meta.checkPermission)
  ) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    let id = to.params.id
    let token = to.params.token
    console.log(token, id)
    let guestEmail = window.atob(token)
    guestEmail = guestEmail.split(':')
    window.axios.defaults.headers.common['Authorization'] = 'Guest ' + token
    storeCalendar.guestEmail = guestEmail[0]
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

window.axios.get('/o/v2/mobilink/systemconfigs?start=-1&end=-1&type=config')
  .then(function (response2) {
    let serializable2 = response2.data
    Vue.mixin({
      data () {
        return {
          get MSystemConfiguration () {
            return serializable2
          },
          get googleDeveloperKey () {
            return serializable2.configuration.google.apikey || 'AIzaSyCqirwRWuYRB4U1Ayb7kHhFM2AfUzqkHuk'
          },
          get googleClientId () {
            return serializable2.configuration.google.driverclientId || '695774120434-l58k4dfk0dvvucsni804gpji97tmsg4b.apps.googleusercontent.com'
          },
          get serviceEditorCode () {
            window.ACTIVITY_CONST.serviceEditorCode = serializable2.configuration.onlyoffice.host ? 'ACTIVE' : 'NONE'
            return window.ACTIVITY_CONST.serviceEditorCode
          }
        }
      }
    })
    includeJS({
      src: 'https://www.dropbox.com/static/api/2/dropins.js',
      id: 'dropboxjs',
      'data-app-key': serializable2.configuration.dropbox.apikey,
      type: 'text/javascript'
    }, () => { // console.log('INCLUDED DROPBOX')
    })
    window.dropboxKey = serializable2.configuration.dropbox.apikey
    window.onApiLoad = auth2GooglePicker.onApiLoad(Vue,
      serializable2.configuration.google.apikey || 'AIzaSyCqirwRWuYRB4U1Ayb7kHhFM2AfUzqkHuk',
      serializable2.configuration.google.driverclientId || '695774120434-l58k4dfk0dvvucsni804gpji97tmsg4b.apps.googleusercontent.com'
    )
    includeJS({
      src: 'https://apis.google.com/js/api.js?onload=onApiLoad',
      type: 'text/javascript'
    }, () => {
      // console.log('INCLUDE GOOGLE')
    })
    /* eslint-disable no-new */
    new Vue({
      el: '#activity-calendar-guest',
      router: router,
      store: storeCalendar,
      components: { Calendar },
      template: '<Calendar/>'
    })
  })
  .catch(function (error) {
    console.log(error)
    Vue.mixin({
      data () {
        return {
          get MSystemConfiguration () {
            return {
              'configuration': {
                'dropbox': {
                  'clientid': '',
                  'apikey': 'test1'
                },
                'userpreference': {
                  'schema': '',
                  'data': ''
                },
                'fileattach': {
                  'fileextensions': 'text/html',
                  'maxfilesize': 100000
                },
                'profile': {
                  'imageextensions': 'image/*',
                  'maximagesize': 100000
                },
                'google': {
                  'apikey': '',
                  'driverclientId': ''
                },
                'albumfile': {
                  'imageextensions': 'image/*',
                  'maximagesize': 100000
                },
                'systemurl': {
                  'eventurl': 'http://localhost:8080/#/detail/',
                  'docfileurl': '',
                  'profileurl': '',
                  'taskurl': 'http://localhost:8080/#/detail/',
                  'guesteventurl': '',
                  'guesttaskurl': '',
                  'guestdocfileurl': ''
                },
                'onlyoffice': {
                  'host': '',
                  'apipath': ''
                }
              }
            }
          },
          get googleDeveloperKey () {
            return 'AIzaSyCqirwRWuYRB4U1Ayb7kHhFM2AfUzqkHuk'
          },
          get googleClientId () {
            return '695774120434-l58k4dfk0dvvucsni804gpji97tmsg4b.apps.googleusercontent.com'
          },
          get serviceEditorCode () {
            return 'ACTIVE'
          }
        }
      }
    })
    includeJS({
      src: 'https://www.dropbox.com/static/api/2/dropins.js',
      id: 'dropboxjs',
      'data-app-key': '',
      type: 'text/javascript'
    }, () => { console.log('INCLUDE DROPBOX') })
    window.onApiLoad = auth2GooglePicker.onApiLoad(Vue, 'AIzaSyCqirwRWuYRB4U1Ayb7kHhFM2AfUzqkHuk', '695774120434-l58k4dfk0dvvucsni804gpji97tmsg4b.apps.googleusercontent.com')
    includeJS({
      src: 'https://apis.google.com/js/api.js?onload=onApiLoad',
      type: 'text/javascript'
    }, () => { // console.log('INCLUDE GOOGLE')
    })
    /* eslint-disable no-new */
    new Vue({
      el: '#activity-calendar-guest',
      router: router,
      store: storeCalendar,
      components: { Calendar },
      template: '<Calendar/>'
    })
  })

function includeJS (attrs, callback) {
  let elementScript = document.createElement('script')
  for (let k in attrs) {
    elementScript.setAttribute(k, attrs[k])
  }
  elementScript.onreadystatechange = callback
  elementScript.onload = callback
  document.getElementsByTagName('head')[0].appendChild(elementScript)
}
