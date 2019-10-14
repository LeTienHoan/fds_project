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
import TaskStatistic from './TaskStatistic'
import router from './router/taskStatistic'
import { storeTaskStatistic } from './store/taskStatistic'
import mixinApp from './mixin/mobilinkConstants'

import auth2GooglePicker from './assets/js_common/auth2GooglePicker'

// move component

import MultiLanguage from './assets/js_common/vue-multilanguage'
import language from './lang/language'
import CustomeDateTime from './components/CustomeDateTime'
import DiaLog from './components/DiaLog'
import ToolBar from './components/ToolBar'
import LoadingPage from './components/LoadingPage'

import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.min.css'

Vue.component('vue-ctk-date-time-picker', VueCtkDateTimePicker)

Vue.component(CustomeDateTime.name, CustomeDateTime)
Vue.component(LoadingPage.name, LoadingPage)
Vue.component(DiaLog.name, DiaLog)
Vue.component(ToolBar.name, ToolBar)
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

sync(storeTaskStatistic, router)

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
Vue.mixin({
  methods: {
    printTaskStatistic: function (options, data) {
      let bodyRender = ''
      for (let key in data) {
        let stt = Number(key)
        let totalStyle = stt === 0 ? 'text-font-bold' : ''
        bodyRender += '' +
          '   <tr class="layout wrap" >                           ' +
          (!totalStyle ? '     <td class="text-align-center ' + totalStyle + '">' + stt + '</td> ' : '') +
          '     <td class="' + (totalStyle ? 'text-align-center' : 'text-align-left') + ' ' + totalStyle + '" colspan="' + (totalStyle ? '2' : '1') + '">' + (totalStyle ? 'Tổng số' : data[key].name) + '</td>                ' +
          '     <td class="text-align-right ' + totalStyle + '">' + data[key].tong_so + '</td>                ' +
          '     <td class="text-align-right ' + totalStyle + '">' + data[key].tao_moi + '</td>                ' +
          '     <td class="text-align-right ' + totalStyle + '">' + data[key].ton_truoc + '</td>              ' +
          '     <td class="text-align-right ' + totalStyle + '">' + data[key].chua_thuc_hien + '</td>         ' +
          '     <td class="text-align-right ' + totalStyle + '">' + data[key].dang_thuc_hien_tong_so + '</td> ' +
          '     <td class="text-align-right ' + totalStyle + '">' + data[key].dang_thuc_hien_con_han + '</td> ' +
          '     <td class="text-align-right ' + totalStyle + '">' + data[key].dang_thuc_hien_tre_han + '</td> ' +
          '     <td class="text-align-right ' + totalStyle + '">' + data[key].da_hoan_thanh_tong_so + '</td>  ' +
          '     <td class="text-align-right ' + totalStyle + '">' + data[key].da_hoan_thanh_dung_han + '</td> ' +
          '     <td class="text-align-right ' + totalStyle + '">' + data[key].da_hoan_thanh_qua_han + '</td>  ' +
          '     <td class="text-align-right ' + totalStyle + '">' + data[key].da_hoan_thanh_diem_danh_gia_tb +
          '     </td>                                                                   ' +
          '     <td class="text-align-right grey--text ' + totalStyle + '">' + data[key].da_hoan_thanh_ty_le_qua_han +
          '     </td>                                                                   ' +
          '  </tr>                                               '
      }
      let tableRender = '' +
        '<table>                                                   ' +
        '  <thead>                                                 ' +
        '    <tr>                                                  ' +
        '      <th rowspan="2">' + options.labels.stt + '</th>                            ' +
        '      <th rowspan="2">' + options.labels.name + '</th>                           ' +
        '      <th rowspan="2">' + options.labels.tong_so + '</th>                        ' +
        '      <th rowspan="2">' + options.labels.tao_moi + '</th>                        ' +
        '      <th rowspan="2">' + options.labels.ton_truoc + '</th>                      ' +
        '      <th class="color-chua-thuc-hien" rowspan="2"> ' + options.labels.chua_thuc_hien +
        '      </th>                                                                      ' +
        '      <th class="color-dang-thuc-hien" colspan="3"> ' + options.labels.dang_thuc_hien +
        '      </th>                                                                      ' +
        '      <th class="color-da-hoan-thanh" colspan="5"> ' + options.labels.da_hoan_thanh +
        '      </th>                                                                      ' +
        '    </tr>                                                 ' +
        '    <tr>                                                  ' +
        '      <th> ' + options.labels.dang_thuc_hien_tong_so + '</th>  ' +
        '      <th> ' + options.labels.dang_thuc_hien_con_han + '</th>  ' +
        '      <th> ' + options.labels.dang_thuc_hien_tre_han + '</th>  ' +
        '      <th> ' + options.labels.da_hoan_thanh_tong_so + '</th>  ' +
        '      <th> ' + options.labels.da_hoan_thanh_dung_han + '</th>  ' +
        '      <th> ' + options.labels.da_hoan_thanh_qua_han + '</th>  ' +
        '      <th> ' + options.labels.da_hoan_thanh_diem_danh_gia_tb + '</th>  ' +
        '      <th> ' + options.labels.da_hoan_thanh_ty_le_qua_han + '</th>  ' +
        '    </tr>  ' +
        '  </thead>                                                 ' +
        '  <tbody>                                                  ' +
        bodyRender +
        '  </tbody>                                                 ' +
        '</table>                                                   '
      let headerRender = '' +
        '<h3>' + options.labels.title + '</h3>' +
        '<div class="text-align-center">' + options.monthAndYear + '</div>'
      let footerRender = '' +
        '<div class="footTable">' +
        ' <i>--' + options.labels.end + '--</i>' +
        '</div>'
      let linkFont = ''
      let style = '' +
        '<style>' +
        ' @media print {' +
        ' table { font-family: "Roboto", sans-serif; }' +
        ' tr { font-family: "Roboto", sans-serif; }' +
        ' th { font-family: "Roboto", sans-serif; }' +
        ' td { font-family: "Roboto", sans-serif; }' +
        ' div { font-family: "Roboto", sans-serif; }' +
        ' h3 {text-align: center;}' +
        ' .footTable {text-align: center; color: grey; padding: 10px;}' +
        ' table {width:100%; border-collapse: collapse; border-spacing: 0; margin: 20px;}' +
        ' td {border: lightgrey 1px solid; padding: 0.5em 0.5em;}' +
        ' th {border: lightgrey 1px solid; padding: .1em 0.2em;}' +
        ' .text-align-center {text-align: center;}' +
        ' .text-align-left {text-align: left;}' +
        ' .text-align-right {text-align: right;}' +
        ' .color-chua-thuc-hien {color: #ffc107;}' +
        ' .color-dang-thuc-hien {color: #00bcd4;}' +
        ' .color-da-hoan-thanh {color: #8bc34a;}' +
        ' .grey--text {color: grey;}' +
        ' .text-font-bold { font-weight: bold!important; }' +
        '</style>'
      let printContents = linkFont + headerRender + tableRender + footerRender + style
      let w = window.open()
      w.document.write(printContents)
      w.print()
      w.close()
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
      el: '#task-statistic',
      router: router,
      store: storeTaskStatistic,
      components: { TaskStatistic },
      template: '<TaskStatistic/>'
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
      el: '#task-statistic',
      router: router,
      store: storeTaskStatistic,
      components: { TaskStatistic },
      template: '<TaskStatistic/>'
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
