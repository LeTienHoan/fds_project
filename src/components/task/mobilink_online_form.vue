<template>

    <v-layout row style="margin-left: 0;">
    
        <v-flex xs12>
            <v-card class="no-shadow" v-if="config_view === 0">
                <v-tabs :scrollable="false">
                  <v-tabs-bar class="grey-mobilink-panel mobilink__online__form" dark>
                    <v-tabs-item :href="'#tab-online_form-detail-1'">
                      Mã tạo giao diện nhập liệu
                    </v-tabs-item>
                    <v-tabs-item :href="'#tab-online_form-detail-2'">
                      Mã tạo giao diện báo cáo
                    </v-tabs-item>
                    <v-tabs-item :href="'#tab-online_form-detail-3'" @click.stop.prevent="previewAlpacaJsForm()">
                      Xem trước giao diện nhập liệu
                    </v-tabs-item>
                    <v-tabs-slider color="primary"></v-tabs-slider>
                  </v-tabs-bar>
                  
                  <v-tabs-items>
                    <v-tabs-content :id="'tab-online_form-detail-1'" reverse-transition="slide-y-transition" transition="slide-y-transition">
                      <v-alert outline color="success" icon="check_circle" :value="apistateok">
                        Yêu cầu của bạn được xử lý thành công!
                      </v-alert>
                      <v-alert outline color="error" icon="warning" :value="apistatefail">
                        Yêu cầu của bạn được xử lý thất bại!
                      </v-alert>
                      <vue-ace-editor 
                            v-model ="onlineFormAlpacaJS"
                            v-bind:options="editorjsonoptions">
                      </vue-ace-editor>
                      <v-btn color="primary" class="online--form-submit" v-on:click.native="submitFormOnlineScript()"
                        :loading="submitFormOnlineScript_hidden_loading" 
                        :disabled="submitFormOnlineScript_hidden_loading"
                        v-if="hasPermission"
                      >
                          <v-icon>done</v-icon>
                          &nbsp;&nbsp; Ghi lại
                      </v-btn>
                    </v-tabs-content>
                    <v-tabs-content :id="'tab-online_form-detail-2'" reverse-transition="slide-y-transition" transition="slide-y-transition">
                      <v-alert outline color="success" icon="check_circle" :value="apistateok">
                        Yêu cầu của bạn được xử lý thành công!
                      </v-alert>
                      <v-alert outline color="error" icon="warning" :value="apistatefail">
                        Yêu cầu của bạn được xử lý thất bại!
                      </v-alert>
                      <vue-ace-editor 
                            v-model ="onlineFormJasper"
                            v-bind:options="editorxmloptions">
                      </vue-ace-editor>
                      <v-btn color="primary" class="online--form-submit" v-on:click.native="submitFormOnlineJasper()"
                        :loading="submitFormOnlineJasper_hidden_loading" 
                        :disabled="submitFormOnlineJasper_hidden_loading"
                      >
                          <v-icon>done</v-icon>
                          &nbsp;&nbsp; Ghi lại
                      </v-btn>
                    </v-tabs-content>
                    <v-tabs-content :id="'tab-online_form-detail-3'" reverse-transition="slide-y-transition" transition="slide-y-transition">
                        <v-card class="no-shadow">
                          <v-card-title>
                            <div :id="'alpacajs_form_online_' + id"></div>
                          </v-card-title>
                        </v-card>
                    </v-tabs-content>
                  </v-tabs-items>
                </v-tabs>
            </v-card>
            <v-card v-else>
                <v-expansion-panel v-if="showFormAlpaca" expand class="mb-3">
                  <v-expansion-panel-content v-bind:value="expanded">
                    <div slot="header">Biểu mẫu điện tử</div>
                    <v-card class="alpacajs__form__container">
                      <v-card-text>
                        <v-alert outline color="success" icon="check_circle" :value="apistateok" :id="'success_online_form_' + id">
                          Yêu cầu của bạn được xử lý thành công!
                        </v-alert>
                        <v-alert outline color="error" icon="warning" :value="apistatefail" :id="'error_online_form_' + id">
                          Yêu cầu của bạn được xử lý thất bại!
                        </v-alert>
                        <div :id="'alpacajs_form_online_' + id"></div>
                        <v-card-actions>
                          <v-btn v-if="hasPermission" color="primary" v-on:click.native="_submitFormOnlineData()"
                            :loading="submitFormOnlineData_hidden_loading" 
                            :disabled="submitFormOnlineData_hidden_loading"
                          >
                              <v-icon>done</v-icon>
                              &nbsp;&nbsp; Ghi lại
                          </v-btn>
                          <v-btn outline color="primary" v-on:click.native="downloadFormOnlineData()"
                            :loading="downloadFormOnlineData_hidden_loading" 
                            :disabled="downloadFormOnlineData_hidden_loading"
                          >
                              <v-icon>file_download</v-icon>
                              &nbsp;&nbsp; Tải về PDF
                          </v-btn>
                        </v-card-actions>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
            </v-card>
      </v-flex>

  </v-layout>

</template>

<script>
import Vue from 'vue'
const COMPONENT_NAME = 'jx-mobilink-online-form'
const VueAceEditor = {
  props: ['value', 'id', 'options'],
  template: `
      <div :id="id ? id: $options._componentTag + '-' + _uid" 
            :class="$options._componentTag">
          <slot></slot>
      </div>
  `,
  watch: {
    value () {
      this.$emit('input', this.value)
      if (this.oldValue !== this.value) {
        this.editor.setValue(this.value, 1)
      }
    }
  },
  mounted () {
    this.editor = window.ace.edit(this.$el.id)
    this.editor.$blockScrolling = Infinity
    const session = this.editor.getSession()
    session.on('changeAnnotation', () => {
      const a = session.getAnnotations()
      const b = a.slice(0).filter((item) => item.text.indexOf('DOC') === -1)
      if (a.length > b.length) session.setAnnotations(b)
    })
    this.options = this.options || {}
    this.options.maxLines = this.options.maxLines || Infinity
    this.options.printMargin = this.options.printMargin || false
    this.options.highlightActiveLine = this.options.highlightActiveLine || false
    if (this.options.cursor === 'none' || this.options.cursor === false) {
      this.editor.renderer.$cursorLayer.element.style.display = 'none'
      delete this.options.cursor
    }
    if (this.options.mode && this.options.mode.indexOf('ace/mode/') === -1) {
      this.options.mode = `ace/mode/${this.options.mode}`
    }
    if (this.options.theme && this.options.theme.indexOf('ace/theme/') === -1) {
      this.options.theme = `ace/theme/${this.options.theme}`
    }
    this.editor.setOptions(this.options)
    if (!this.value || this.value === '') {
      this.$emit('input', this.editor.getValue())
    } else {
      this.editor.setValue(this.value, -1)
    }
    this.editor.on('change', () => {
      this.value = this.oldValue = this.editor.getValue()
    })
  },
  methods: {
    editor () {
      return this.editor
    }
  }
}
Vue.mixin({
  methods: {
    alpacaSubmit: function (dataConfig, data) {
      let vm = this
      vm.submitFormOnlineData_hidden_loading = true
      const config = {
        headers: {
          'groupId': dataConfig.group_id,
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          'Accept': 'application/json'
        }
      }
      let params = new URLSearchParams()
      params.append('formData', data)
      window.axios.put(dataConfig.formdata_api,
        params,
        config
      )
        .then(function (response) {
          document.getElementById('success_online_form_' + dataConfig.id_component).style.display = '-webkit-box'
          vm.submitFormOnlineData_hidden_loading = false
          setTimeout(
            function () {
              document.getElementById('success_online_form_' + dataConfig.id_component).style.display = 'none'
            }, 3000)
        })
        .catch(function (error) {
          console.log(error)
          document.getElementById('error_online_form_' + dataConfig.id_component).style.display = '-webkit-box'
          vm.submitFormOnlineData_hidden_loading = false
          setTimeout(
            function () {
              document.getElementById('error_online_form_' + dataConfig.id_component).style.display = 'none'
            }, 3000)
        })
    }
  }
})
export default {
  name: COMPONENT_NAME,
  props: {
    id: null,
    class_pk: null,
    class_name: null,
    group_id: null,
    alpaca_api: '',
    jasper_api: '',
    sample_api: '',
    formdata_api: '',
    download_api: '',
    config_view: null,
    permission: 'read'
  },
  components: {
    'vue-ace-editor': VueAceEditor
  },
  created () {
    let vm = this
    vm.hasPermission = 'owner,leader,hoster,manager,writer'.indexOf(vm.permission || 'none')
    const config = {
      headers: {
        'groupId': vm.group_id
      },
      params: {
        start: -1,
        end: -1
      }
    }
    vm.$nextTick(function () {
      let getAllApi = []
      if (vm.jasper_api != null) {
        window.axios.get(vm.jasper_api, config)
          .then(function (response) {
            let serializable = response.data
            vm.onlineFormJasper = serializable
          })
          .catch(function (error) {
            console.log(error)
          })
      }
      if (vm.alpaca_api != null) {
        getAllApi.push(
          window.axios.get(vm.alpaca_api, config)
        )
      }
      if (vm.sample_api != null) {
        getAllApi.push(
          window.axios.get(vm.sample_api, config)
        )
      }
      window.axios.all(getAllApi)
        .then(window.axios.spread(function (apiRespones1, apiRespones2) {
          if (vm.alpaca_api != null) {
            vm.onlineFormAlpacaJS = JSON.stringify(apiRespones1.data, null, '\t')
          }
          if (vm.sample_api != null) {
            vm.onlineDataAlpacaJS = JSON.stringify(apiRespones2.data, null, '\t')
          }
          if (vm.config_view === 1) {
            vm.previewAlpacaJsForm()
          }
          console.log(vm.onlineFormAlpacaJS)
          console.log(vm.onlineDataAlpacaJS)
          return window.Promise.reject()
        }))
        .catch(function (error) {
          console.log(error)
        })
    })
  },
  data () {
    return {
      showFormAlpaca: false,
      expanded: true,
      submitFormOnlineScript_hidden_loading: false,
      submitFormOnlineJasper_hidden_loading: false,
      submitFormOnlineData_hidden_loading: false,
      downloadFormOnlineData_hidden_loading: false,
      apistateok: false,
      apistatefail: false,
      editorjsonoptions: {
        mode: 'json',
        theme: 'tomorrow',
        fontSize: 13,
        highlightActiveLine: true,
        highlightGutterLine: true
      },
      editorxmloptions: {
        mode: 'xml',
        theme: 'tomorrow',
        fontSize: 13,
        highlightActiveLine: true,
        highlightGutterLine: true
      },
      onlineFormAlpacaJS: `
      `,
      onlineFormJasper: `
      `,
      onlineDataAlpacaJS: {
      },
      hasPermission: false
    }
  },
  methods: {
    previewAlpacaJsForm: function () {
      let vm = this
      let alapcaJSStr = {}
      if (vm.onlineFormAlpacaJS.startsWith('{')) {
        alapcaJSStr = 'COMMENT_DEVELOPEMENT' // eval('(' + vm.onlineFormAlpacaJS + ')')
      }
      let alapcaJS = alapcaJSStr
      alapcaJS['data'] = vm.onlineDataAlpacaJS
      let prevewConfig = {
        id: '#alpacajs_form_online_' + vm.id,
        formscript: JSON.stringify(alapcaJS)
      }
      if (JSON.stringify(alapcaJS).length > 50) {
        vm.showFormAlpaca = true
      }
      vm.$emit('preview-alpacajs-form', prevewConfig)
    },
    submitFormOnlineScript: function () {
      let vm = this
      vm.submitFormOnlineScript_hidden_loading = true
      const config = {
        headers: {
          'groupId': vm.group_id,
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          'Accept': 'application/json'
        }
      }
      let params = new URLSearchParams()
      params.append('inputForm', vm.onlineFormAlpacaJS)
      window.axios.put(vm.alpaca_api,
        params,
        config
      )
        .then(function (response) {
          vm.apistateok = true
          vm.submitFormOnlineScript_hidden_loading = false
          setTimeout(
            function () {
              vm.apistateok = false
            },
            3000)
        })
        .catch(function (error) {
          console.log(error)
          vm.apistatefail = true
          vm.submitFormOnlineScript_hidden_loading = false
          setTimeout(
            function () {
              vm.apistatefail = false
            },
            3000)
        })
    },
    submitFormOnlineJasper: function () {
      let vm = this
      vm.submitFormOnlineJasper_hidden_loading = true
      const config = {
        headers: {
          'groupId': vm.group_id,
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          'Accept': 'application/json'
        }
      }
      let params = new URLSearchParams()
      if (vm.onlineFormJasper === null || vm.onlineFormJasper === '') {
        vm.onlineFormJasper = '{}'
      }
      params.append('reportForm', vm.onlineFormJasper)
      window.axios.put(vm.jasper_api,
        params,
        config
      )
        .then(function (response) {
          vm.apistateok = true
          vm.submitFormOnlineJasper_hidden_loading = false
          setTimeout(
            function () {
              vm.apistateok = false
            },
            3000)
        })
        .catch(function (error) {
          console.log(error)
          vm.apistatefail = true
          vm.submitFormOnlineJasper_hidden_loading = false
          setTimeout(
            function () {
              vm.apistatefail = false
            },
            3000)
        })
    },
    _submitFormOnlineData: function () {
      let vm = this
      let dataConfig = {
        id: '#alpacajs_form_online_' + vm.id,
        id_component: vm.id,
        group_id: vm.group_id,
        formdata_api: vm.formdata_api
      }
      vm.$emit('submit-alpacajs-form', dataConfig)
    },
    downloadFormOnlineData: function () {
      let vm = this
      vm.downloadFormOnlineData_hidden_loading = true
      const config = {
        headers: {
          'groupId': vm.group_id
        },
        responseType: 'blob'
      }
      window.axios.get(vm.download_api, config).then(function (response) {
        let url = window.URL.createObjectURL(response.data)
        window.open(url)
        vm.downloadFormOnlineData_hidden_loading = false
      })
        .catch(function (error) {
          console.log(error)
          vm.downloadFormOnlineData_hidden_loading = false
          vm.apistatefail = true
          setTimeout(
            function () {
              vm.apistatefail = false
            },
            3000)
        })
    }
  }
}
</script>

<style>
/*----- Row Images Followers -----*/
.grey-mobilink-panel {
  background-color: rgb(214, 233, 247);
}
.grey-mobilink-panel .tabs__li > a.tabs__item{
  color: rgba(0,0,0,.87) !important;
}
.grey-mobilink-panel.mobilink__online__form + .tabs__items > .tabs__content{
  max-height: 500px;
  overflow: scroll;
  min-height: 100px;
}
.online--form-submit {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
}
#tab-online_form-detail-3 .no-shadow{
  box-shadow: none;
}
body .ace_editor {
    position: inherit;
        min-height: 100px;
}
</style>
