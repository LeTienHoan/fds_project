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
import router from './router/calendar'
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
    console.log(id)
    next()
  } else if (
    to.matched.some(record => record.meta.redirectPage)
  ) {
    next(to.meta.nextTo)
  } else if (to.path === '/' && router.app.$store &&
    from.name === 'Detail' && router.app.$store.state.naviFilter.id < -1) { // path / back
    next(router.app.$store.state.naviFilter.link)
  } else {
    next()
  }
})

Vue.mixin(mixinApp)

Vue.mixin({
  data () {
    return {
      get personalEventConfirmItems () {
        return [
          { value: 0, text: 'Có quan tâm' },
          { value: 1, text: 'Sẽ tham gia' },
          { value: 2, text: 'Bận không tham dự' }
        ]
      },
      get calendarOthersPublicVariable () {
        return window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/'
      }
    }
  },
  methods: {
    personalEventColorByConfirmCode (value) {
      let result = '#ffc107'
      switch (value) {
        case 0:
          result = '#ffc107'
          break
        case 1:
          result = '#8bc34a'
          break
        case 2:
          result = '#9c27b0'
          break
        default:
          result = '#ffc107'
          break
      }
      return result
    },
    calendarOthersMethodSuchAs (value) {
      if ('owner, leader'.indexOf(value) >= 0) {
        return 'owner'
      } else if ('hoster, manager, write'.indexOf(value) >= 0) {
        return 'write'
      } else if ('read'.indexOf(value) >= 0) {
        return 'read'
      } else {
        return 'none'
      }
    },
    textBoldVisited (value) {
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
window.axios.defaults.headers.common['Content-Type'] = 'application/json'
window.axios.defaults.headers.common['Accept'] = 'application/json'
window.axios.defaults.params = {
  start: -1,
  end: -1
}

window.axios.all([
  window.axios.get('/public/specials-date.json'),
  window.axios.get('/o/v2/mobilink/systemconfigs?start=-1&end=-1&type=config')
])
  .then(window.axios.spread(function (response, response2) {
    let serializable = response.data
    let serializable2 = response2.data
    // console.log(serializable, serializable2)
    Vue.mixin({
      data () {
        return {
          get mWeekendsNmHolidays () {
            return serializable
          },
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
      el: '#calendar',
      router: router,
      store: storeCalendar,
      components: { Calendar },
      template: '<Calendar/>'
    })
  }))
  .catch(function (error) {
    console.log(error)
    Vue.mixin({
      data () {
        return {
          get mWeekendsNmHolidays () {
            return {
              '2019': {
                'mWeekends': [0, 6],
                'mHolidays': [
                  { 'description': 'Lunar new year', 'holidayDate': '1546275600000' }
                ]
              },

              '2018': {
                'mWeekends': [0, 6],
                'mHolidays': [
                  { 'description': 'Ngay PNVN 1', 'holidayDate': '1539968400000' },
                  { 'description': 'hehehe', 'holidayDate': '1544547600000' }
                ]
              },
              '2020': {
                'mWeekends': [0, 6],
                'mHolidays': [
                  { 'description': 'Happy new year 2020', 'holidayDate': '1577811600000' }
                ]
              }
            }
          },
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
                  'eventurl': 'http://localhost:8080/#/',
                  'docfileurl': '',
                  'profileurl': '',
                  'taskurl': 'http://localhost:8080/#/',
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
      el: '#calendar',
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
