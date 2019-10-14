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
  VAvatar,
  VBtnToggle
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

import JxMobilinkActivityEditable from './components/task/editable.vue'

import Task from './Task'
import router from './router/task'
import { storeTask } from './store/task'

import ToggleButton from './components/task/mobilink_toggle_button.vue'

Vue.use(VuejsDialog)
Vue.component('vue-ctk-date-time-picker', VueCtkDateTimePicker)
Vue.use(VueContentPlaceholders)
Vue.use(MultiLanguage, language)

Vue.component(DiaLog.name, DiaLog)
Vue.component(ToolBar.name, ToolBar)
Vue.component(MobilinkTree.name, MobilinkTree)
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
Vue.component(JxMobilinkActivityEditable.name, JxMobilinkActivityEditable)
Vue.component(CustomeDateTime.name, CustomeDateTime)

Vue.component(ToggleButton.name, ToggleButton)

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

sync(storeTask, router)

router.beforeEach((to, from, next) => {
  if (
    to.matched.some(record => record.meta.checkPermission)
  ) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    next()
  } else {
    next()
  }
})

Vue.mixin(mixinApp)

Vue.mixin({
  data () {
    return {
      get taskOthersVariablePublicSuchAs () {
        return window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/'
      }
    }
  },
  methods: {
    taskOthersMethodPublicSuchAs (value) {
      let priorityKey = ''
      for (let k in this.constantPriorityKey) {
        if (this.constantPriorityKey[k].value === value) {
          priorityKey = this.constantPriorityKey[k].text
          break
        }
      }
      return priorityKey
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
      el: '#activity-task',
      router: router,
      store: storeTask,
      components: { Task },
      template: '<Task/>'
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
                'advancedsearch': {
                  'dictionarydocfile': ``,
                  'dictionarytask': ``,
                  'filterdocfile': ``,
                  'filtertask': `
                    [
                      {
                        "advancedSearchZUUID": "m_menu_toi_tao",
                        "name": "Tôi tạo",
                        "allowDelete": false,
                        "allowView": true,
                        "geoadvancedSearch": [
                          {
                            "idd": 13,
                            "name": "Vai trò tham gia",
                            "type": "multi-select",
                            "value": [{ "text": "Tôi tạo", "value": "own" }],
                            "items": [
                              { "text": "Tất cả", "value": "all" },
                              { "text": "Tôi tạo", "value": "own" },
                              { "text": "Cá nhân", "value": "me" },
                              { "text": "Tôi thực hiện", "value": "do" },
                              { "text": "Tôi giao", "value": "leader" },
                              { "text": "Theo dõi", "value": "follow" },
                              { "text": "Hỗ trợ", "value": "support" }
                            ],
                            "item_text": "text",
                            "item_text_sub": "",
                            "item_value": "value",
                            "queryKeys": ["join"]
                          }
                        ]
                      },
                      {
                        "advancedSearchZUUID": "m_menu_ca_nhan",
                        "name": "Cá nhân",
                        "allowDelete": false,
                        "allowView": true,
                        "geoadvancedSearch": [
                          {
                            "idd": 13,
                            "name": "Vai trò tham gia",
                            "type": "multi-select",
                            "value": [{ "text": "Cá nhân", "value": "me" }],
                            "items": [
                              { "text": "Tất cả", "value": "all" },
                              { "text": "Tôi tạo", "value": "own" },
                              { "text": "Cá nhân", "value": "me" },
                              { "text": "Tôi thực hiện", "value": "do" },
                              { "text": "Tôi giao", "value": "leader" },
                              { "text": "Theo dõi", "value": "follow" },
                              { "text": "Hỗ trợ", "value": "support" }
                            ],
                            "item_text": "text",
                            "item_text_sub": "",
                            "item_value": "value",
                            "queryKeys": ["join"]
                          }
                        ]
                      },
                      {
                        "advancedSearchZUUID": "m_menu_toi_thuc_hien",
                        "name": "Tôi Thực hiện",
                        "allowDelete": false,
                        "allowView": true,
                        "geoadvancedSearch": [
                          {
                            "idd": 13,
                            "name": "Vai trò tham gia",
                            "type": "multi-select",
                            "value": [{ "text": "Tôi thực hiện", "value": "do" }],
                            "items": [
                              { "text": "Tất cả", "value": "all" },
                              { "text": "Tôi tạo", "value": "own" },
                              { "text": "Cá nhân", "value": "me" },
                              { "text": "Tôi thực hiện", "value": "do" },
                              { "text": "Tôi giao", "value": "leader" },
                              { "text": "Theo dõi", "value": "follow" },
                              { "text": "Hỗ trợ", "value": "support" }
                            ],
                            "item_text": "text",
                            "item_text_sub": "",
                            "item_value": "value",
                            "queryKeys": ["join"]
                          }
                        ]
                      },
                      {
                        "advancedSearchZUUID": "m_menu_toi_phoi_hop",
                        "name": "Tôi phối hợp",
                        "allowDelete": false,
                        "allowView": true,
                        "geoadvancedSearch": [
                          {
                            "idd": 13,
                            "name": "Vai trò tham gia",
                            "type": "multi-select",
                            "value": [{ "text": "Hỗ trợ", "value": "support" }],
                            "items": [
                              { "text": "Tất cả", "value": "all" },
                              { "text": "Tôi tạo", "value": "own" },
                              { "text": "Cá nhân", "value": "me" },
                              { "text": "Tôi thực hiện", "value": "do" },
                              { "text": "Tôi giao", "value": "leader" },
                              { "text": "Theo dõi", "value": "follow" },
                              { "text": "Hỗ trợ", "value": "support" }
                            ],
                            "item_text": "text",
                            "item_text_sub": "",
                            "item_value": "value",
                            "queryKeys": ["join"]
                          }
                        ]
                      },
                      {
                        "advancedSearchZUUID": "m_menu_toi_giao",
                        "name": "Tôi giao",
                        "allowDelete": false,
                        "allowView": true,
                        "geoadvancedSearch": [
                          {
                            "idd": 13,
                            "name": "Vai trò tham gia",
                            "type": "multi-select",
                            "value": [{ "text": "Tôi giao", "value": "leader" }],
                            "items": [
                              { "text": "Tất cả", "value": "all" },
                              { "text": "Tôi tạo", "value": "own" },
                              { "text": "Cá nhân", "value": "me" },
                              { "text": "Tôi thực hiện", "value": "do" },
                              { "text": "Tôi giao", "value": "leader" },
                              { "text": "Theo dõi", "value": "follow" },
                              { "text": "Hỗ trợ", "value": "support" }
                            ],
                            "item_text": "text",
                            "item_text_sub": "",
                            "item_value": "value",
                            "queryKeys": ["join"]
                          }
                        ]
                      },
                      {
                        "advancedSearchZUUID": "m_menu_toi_theo_doi",
                        "name": "Tôi theo dõi",
                        "allowDelete": false,
                        "allowView": true,
                        "geoadvancedSearch": [
                          {
                            "idd": 13,
                            "name": "Vai trò tham gia",
                            "type": "multi-select",
                            "value": [{ "text": "Theo dõi", "value": "follow" }],
                            "items": [
                              { "text": "Tất cả", "value": "all" },
                              { "text": "Tôi tạo", "value": "own" },
                              { "text": "Cá nhân", "value": "me" },
                              { "text": "Tôi thực hiện", "value": "do" },
                              { "text": "Tôi giao", "value": "leader" },
                              { "text": "Theo dõi", "value": "follow" },
                              { "text": "Hỗ trợ", "value": "support" }
                            ],
                            "item_text": "text",
                            "item_text_sub": "",
                            "item_value": "value",
                            "queryKeys": ["join"]
                          }
                        ]
                      },
                      {
                        "advancedSearchZUUID": "m_menu_tat_ca",
                        "name": "Tất cả",
                        "allowDelete": false,
                        "allowView": true,
                        "geoadvancedSearch": [
                          {
                            "idd": 13,
                            "name": "Vai trò tham gia",
                            "type": "multi-select",
                            "value": [{ "text": "Tất cả", "value": "all" }],
                            "items": [
                              { "text": "Tất cả", "value": "all" },
                              { "text": "Tôi tạo", "value": "own" },
                              { "text": "Cá nhân", "value": "me" },
                              { "text": "Tôi thực hiện", "value": "do" },
                              { "text": "Tôi giao", "value": "leader" },
                              { "text": "Theo dõi", "value": "follow" },
                              { "text": "Hỗ trợ", "value": "support" }
                            ],
                            "item_text": "text",
                            "item_text_sub": "",
                            "item_value": "value",
                            "queryKeys": ["join"]
                          }
                        ]
                      },
                      {
                        "advancedSearchZUUID": "m_menu_chua_hoan_thanh",
                        "name": "Chưa hòan thành",
                        "allowDelete": false,
                        "allowView": true,
                        "geoadvancedSearch": [
                          {
                            "idd": 12,
                            "name": "Trạng thái xử lý",
                            "type": "multi-select",
                            "value": [
                              { "text": "Chưa xử lý", "value": 0 },
                              { "text": "Đang xử lý", "value": 1 },
                              { "text": "Chờ duyệt", "value": 2 }
                            ],
                            "items": [
                              { "text": "Chưa xử lý", "value": 0 },
                              { "text": "Đang xử lý", "value": 1 },
                              { "text": "Chờ duyệt", "value": 2 },
                              { "text": "Đã hòan thành", "value": 3 }
                            ],
                            "item_text": "text",
                            "item_text_sub": "",
                            "item_value": "value",
                            "queryKeys": ["startend"]
                          }
                        ]
                      },
                      {
                        "advancedSearchZUUID": "m_menu_da_hoan_thanh",
                        "name": "Đã hòan thành",
                        "allowDelete": false,
                        "allowView": true,
                        "geoadvancedSearch": [
                          {
                            "idd": 12,
                            "name": "Trạng thái xử lý",
                            "type": "multi-select",
                            "value": [
                              { "text": "Đã hòan thành", "value": 3 }
                            ],
                            "items": [
                              { "text": "Chưa xử lý", "value": 0 },
                              { "text": "Đang xử lý", "value": 1 },
                              { "text": "Chờ duyệt", "value": 2 },
                              { "text": "Đã hòan thành", "value": 3 }
                            ],
                            "item_text": "text",
                            "item_text_sub": "",
                            "item_value": "value",
                            "queryKeys": ["startend"]
                          }
                        ]
                      },
                      {
                        "advancedSearchZUUID": "m_menu_luu_nhap",
                        "name": "Lưu nháp",
                        "allowDelete": false,
                        "allowView": true,
                        "geoadvancedSearch": [
                          {
                            "idd": 14,
                            "name": "Tình trạng",
                            "type": "multi-select",
                            "value": [{ "text": "Nháp", "value": 0 }],
                            "items": [
                              { "text": "Nháp", "value": 0 },
                              { "text": "Công bố", "value": 1 },
                              { "text": "Thùng rác", "value": 2 }
                            ],
                            "item_text": "text",
                            "item_text_sub": "",
                            "item_value": "value",
                            "queryKeys": ["editable"]
                          }
                        ]
                      },
                      {
                        "advancedSearchZUUID": "m_menu_thung_rac",
                        "name": "Thùng rác",
                        "allowDelete": false,
                        "allowView": true,
                        "geoadvancedSearch": [
                          {
                            "idd": 13,
                            "name": "Vai trò tham gia",
                            "type": "multi-select",
                            "value": [{ "text": "Tất cả", "value": "all" }],
                            "items": [
                              { "text": "Tất cả", "value": "all" },
                              { "text": "Tôi tạo", "value": "own" },
                              { "text": "Cá nhân", "value": "me" },
                              { "text": "Tôi thực hiện", "value": "do" },
                              { "text": "Tôi giao", "value": "leader" },
                              { "text": "Theo dõi", "value": "follow" },
                              { "text": "Hỗ trợ", "value": "support" }
                            ],
                            "item_text": "text",
                            "item_text_sub": "",
                            "item_value": "value",
                            "queryKeys": ["join"]
                          },
                          {
                            "idd": 14,
                            "name": "Tình trạng",
                            "type": "multi-select",
                            "value": [{ "text": "Thùng rác", "value": 2 }],
                            "items": [
                              { "text": "Nháp", "value": 0 },
                              { "text": "Công bố", "value": 1 },
                              { "text": "Thùng rác", "value": 2 }
                            ],
                            "item_text": "text",
                            "item_text_sub": "",
                            "item_value": "value",
                            "queryKeys": ["editable"]
                          }
                        ]
                      }
                    ]
                  `
                },
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
      el: '#activity-task',
      router: router,
      store: storeTask,
      components: { Task },
      template: '<Task/>'
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
