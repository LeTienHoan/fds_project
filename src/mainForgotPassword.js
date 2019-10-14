// Import ES6 Promise
import 'es6-promise/auto'
import 'babel-polyfill'
import 'url-search-params-polyfill'

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import VueSilentbox from 'vue-silentbox'
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
import ForgotPassword from './ForgotPassword'
import router from './router/forgotPassword'
import { storeForgotPassword } from './store/forgotPassword'
import mixinApp from './mixin/mobilinkConstants'

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
import AddEmployees from './components/employees/addEmployees'
import EmployeesHeader from './components/employees/employeesHeader'
import birthdate from './components/employees/birthdate'
import DiaLog from './components/DiaLog'
import JxMobilinkActivityEditable from './components/task/editable.vue'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.min.css'

Vue.component('vue-ctk-date-time-picker', VueCtkDateTimePicker)

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
Vue.component(AddEmployees.name, AddEmployees)
Vue.component(EmployeesHeader.name, EmployeesHeader)
Vue.component(birthdate.name, birthdate)
Vue.component(DiaLog.name, DiaLog)
Vue.component(LoadingPage.name, LoadingPage)
Vue.use(VueContentPlaceholders)
Vue.use(VueSilentbox)
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

sync(storeForgotPassword, router)

router.beforeEach((to, from, next) => {
  if (
    to.matched.some(record => record.meta.checkPermission)
  ) {
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
      get defaultUserImg () {
        return window.ACTIVITY_CONST ? window.ACTIVITY_CONST.defaultUserImg : 'http://qa.mobilink.vn/o/frontend-web-usermgt/images/user_02.png'
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

window.axios.get('/o/v2/mobilink/systemconfigs?type=config')
  .then(function (response) {
    let serializable = response.data
    Vue.mixin({
      data () {
        return {
          get MSystemConfiguration () {
            return serializable
          }
        }
      }
    })
    window._sitekey = serializable.configuration.captcha.sitekey || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
    includeJS({
      src: 'https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit&hl=vi',
      id: 'dropboxjs',
      'data-app-key': '',
      type: 'text/javascript'
    }, (grecaptcha) => { window.grecaptcha = grecaptcha })
    /* eslint-disable no-new */
    new Vue({
      el: '#ForgotPassword',
      router: router,
      store: storeForgotPassword,
      components: { ForgotPassword },
      template: '<ForgotPassword/>'
    })
  })
  .catch(function (error) {
    console.log(error)
    window._sitekey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
    includeJS({
      src: 'https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit&hl=vi',
      id: 'dropboxjs',
      'data-app-key': '',
      type: 'text/javascript'
    }, (grecaptcha) => { window.grecaptcha = grecaptcha })
    /* eslint-disable no-new */
    new Vue({
      el: '#ForgotPassword',
      router: router,
      store: storeForgotPassword,
      components: { ForgotPassword },
      template: '<ForgotPassword/>'
    })
  })

includeJS({
  src: 'https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit&hl=vi',
  id: 'dropboxjs',
  'data-app-key': '',
  type: 'text/javascript'
}, (grecaptcha) => { window.grecaptcha = grecaptcha })
window.recaptchaCallback = function () {
  console.log('recaptcha is ready')
  router.app.$store.commit('updateRecaptcha', false)
  window.grecaptcha.render('recaptcha', {
    sitekey: window._sitekey,
    callback: function () {
      router.app.$store.commit('updateRecaptcha', true)
      console.log('recaptcha callback')
    }
  })
}
function includeJS (attrs, callback) {
  let elementScript = document.createElement('script')
  for (let k in attrs) {
    elementScript.setAttribute(k, attrs[k])
  }
  elementScript.onreadystatechange = callback
  elementScript.onload = callback
  document.getElementsByTagName('head')[0].appendChild(elementScript)
}
