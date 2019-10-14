<template>
<v-form ref="form" lazy-validation v-on:submit.prevent="preventDefaultDenine()">
  <div :id="'docfile_add_'+id" class="mobilink__docfile__add__component">
    <v-layout wrap>

      <v-flex xs12 sm2 v-if="!docFileOtherType">
        <v-subheader class="px-0 pl-2">{{translate('kieu_van_ban')}}</v-subheader>
      </v-flex>
      <v-flex xs12 sm4 v-if="!docFileOtherType">
        <v-select
          v-bind:items="registerItems"
          v-model="register"
          item-text="text"
          item-value="value"
          autocomplete
          hide-selected
          @input="registerChange($event)"
        ></v-select>
      </v-flex >
      <v-flex xs12 sm2 v-if="!is_template && !docFileOtherType">
        <v-subheader class="px-0 pl-2">{{translate('so_van_ban')}}</v-subheader>
      </v-flex>
      <v-flex xs12 sm4 v-if="!is_template && !docFileOtherType">
        <v-select
          v-bind:items="templateNoItems"
          v-model="templateNo"
          item-text="subject"
          item-value="templateNo"
          autocomplete
          hide-selected
          return-object
          @input="templateNoChange($event)"
        ></v-select>
      </v-flex>
      <v-flex xs12 sm2 v-if="is_template && !docFileOtherType">
        <v-subheader class="px-0 pl-2">Số hiệu sổ:</v-subheader>
      </v-flex>
      <v-flex xs12 sm4 v-if="is_template && !docFileOtherType">
          <v-text-field
          v-model="templateNoTemplate"
        ></v-text-field>
      </v-flex>

      <v-flex xs12 sm2>
        <v-subheader  class="px-0 pl-2 input-group--required">
          <label>{{translate(docFileOtherType ? 'ten_tai_lieu' : 'ten_van_ban')}}</label>
        </v-subheader>
      </v-flex>
      <v-flex xs12 sm10>
        <v-text-field
          :placeholder="translate(docFileOtherType ? 'ten_tai_lieu' : 'ten_van_ban')"
          v-model="subject"
          :rules="[v => !!v || translate('bat_buoc_phai_nhap') + ' ' + translate(docFileOtherType ? 'ten_tai_lieu' : 'ten_van_ban') ]"
          required
          
        ></v-text-field>
      </v-flex>

      <v-flex xs12 sm2 v-if="!is_template && register === 2 && !docFileOtherType">
        <v-subheader class="px-0 pl-2">{{translate('so_den')}}</v-subheader>
      </v-flex>
      <v-flex xs6 sm4 v-if="!is_template && register === 2 && !docFileOtherType">
        <v-text-field
          class="flex sm6"
          :placeholder="translate('so_den')"
          v-model="seqNum"
          :rules="[value => Number(value) >= 0 || translate('bat_buoc_phai_nhap') + ' ' + translate('so'), value => !!value || translate('bat_buoc_phai_nhap') + ' ' + translate('so')]"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm2 v-if="!is_template && register === 2 && !docFileOtherType">
        <v-subheader class="px-0 pl-2">{{translate('ngay_den')}}</v-subheader>
      </v-flex>
      <v-flex xs12 sm2 v-if="!is_template && register === 1 && !docFileOtherType">
        <v-subheader class="px-0 pl-2">{{translate('ngay_phat_hanh')}}</v-subheader>
      </v-flex>
      <v-flex xs6 sm4 v-if="!is_template && (register === 2 || register === 1) && !docFileOtherType">
        <custome-date-time
          :id="1"
          :datetimevalue="getADateByTimeStamp(registerDate)"
          autocomplate
          :format="localeDateProperties.dateMomentPattern"
          :onlydate="true"
          @syncxxx="(val) => (registerDate = new Date (val))"
        >
        </custome-date-time>
      </v-flex>

      <v-flex xs12 sm2 v-if="!is_template && !docFileOtherType">
        <v-subheader class="px-0 pl-2">{{translate('so_ky_hieu')}}</v-subheader>
      </v-flex>
      <v-flex xs6 sm4 v-if="!is_template && !docFileOtherType">
        <div class="layout format_italic_source">
          <v-text-field
            class="flex sm3"
            :placeholder="translate('so')"
            v-model="codeNo"
            append-icon="remove"
            :rules="[value => Number(value) >= 0 || translate('bat_buoc_phai_nhap') + ' ' + translate('so')]"
          ></v-text-field>
          <v-text-field
            class="flex"
            :placeholder="translate('ky_hieu')"
            v-model="codeNotation"
            
          ></v-text-field><!--:rules="[value => !!value || translate('bat_buoc_phai_nhap') + ' ' + translate('ky_hieu')]"-->
        </div>
      </v-flex>

      <v-flex xs12 sm2 v-if="!is_template && !docFileOtherType">
        <v-subheader class="px-0 pl-2">{{translate('ngay_ban_hanh')}}</v-subheader>
      </v-flex>
      
      <v-flex xs12 sm4 v-if="!is_template && !docFileOtherType">
        <custome-date-time
          :id="1"
          :datetimevalue="getADateByTimeStamp(promulgationDate)"
          autocomplate
          :format="localeDateProperties.dateMomentPattern"
          :onlydate="true"
          @syncxxx="(val) => (promulgationDate = new Date (val))"
        >
        </custome-date-time>
      </v-flex>

      <v-flex xs12 sm2 v-if="!docFileOtherType">
        <v-subheader class="px-0 pl-2">{{translate('loai_van_ban')}}</v-subheader>
      </v-flex>
      <v-flex xs12 sm4 v-if="!docFileOtherType">
        <v-select
          v-bind:items="documentCatItems"
          v-model="documentCat"
          item-text="text"
          item-value="value"
          autocomplete
          hide-selected
        ></v-select>
      </v-flex>

      <v-flex xs12 sm2 v-if="!is_template && !docFileOtherType">
        <v-subheader class="px-0 pl-2">{{translate('co_quan_ban_hanh')}}</v-subheader>
      </v-flex>
      <v-flex xs12 sm4 v-if="!is_template && !docFileOtherType">
        <v-select
          v-bind:items="issuerCodeItems"
          v-model="issuerCode"
          item-text="itemName"
          item-value="itemCode"
          autocomplete
          hide-selected
        ></v-select>
      </v-flex>

      <v-flex xs12 v-if="!is_template">
        <v-layout wrap>
          <v-flex xs12 sm2>
            <v-subheader class="px-0 pl-2 input-group--required">
              <!--<label>{{translate(docFileOtherType ? 'thu_muc_luu_tru' : 'ho_so_luu_tru')}}</label>-->
              <label>{{translate('thu_muc')}}</label>
            </v-subheader>
          </v-flex>
          <v-flex xs12 sm10>
            <v-select
              v-bind:items="workspaceAddItems"
              v-model="workspaceAdd"
              item-text="name"
              item-value="workspaceId"
              autocomplete
              hide-selected
              multiple
              chips
              deletable-chips
              return-object
              :rules="[v => v.length != 0 || translate('bat_buoc_phai_chon') + ' ' + translate('thu_muc')]"
              required
            >
              <!--:rules="[v => v.length != 0 || translate('bat_buoc_phai_chon') + ' ' + translate(docFileOtherType ? 'thu_muc_luu_tru' : 'ho_so_luu_tru')]"-->
              <template slot="selection" slot-scope="data">
                  <v-chip
                      close
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      class="chip--select-multi"
                      :key="JSON.stringify(data.item)"
                  >
                      {{ data.item.workspaceNamePath }}
                  </v-chip>
              </template>
              <template slot="item" slot-scope="data">
                {{ data.item.workspaceNamePath }}
              </template>
            </v-select>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12>
        <v-layout wrap>
          <v-flex xs12 sm2>
            <v-subheader class="px-0 pl-2">{{translate('mo_ta')}}</v-subheader>
          </v-flex>
          <v-flex xs12 sm10>
            <v-text-field
              rows="2"
              multi-line
              :placeholder="translate('mo_ta')"
              v-model="content"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
      
      <v-flex xs12 sm12
        v-if="!is_template"
      >
        <div class="attach-in-new-docfile" v-if="optionsForm.checkReadly">
          <div class="header-text primary--text">File đính kèm</div>
          <uploader :options="optionsForm">
              <uploader-unsupport></uploader-unsupport>
              <uploader-list 
                  :id="0 + '1'"
                  view-id='DOCS'
                  :class_name="docFileClassName"
                  :class_pk="0"
                  :file_attach_api="end_point + 'fileattachs'"
                  :resourceusers_get_api="end_point + 'resourceusers'"
                  extensions_upload="true"
                  permission="owner"
                  :appendix="true"
                  :edit_online_key="serviceEditorCode"
                  :mbl_attach="false"
              ></uploader-list>
          </uploader>
        </div>
      </v-flex>
    </v-layout>
  </div>
</v-form>
</template>

<script>
import { EventBus } from '@/eventbus'
const COMPONENT_NAME = 'jx-mobilink-docfile-add'

export default {
  name: COMPONENT_NAME,
  props: {
    id: {
      default: 1
    },
    is_template: {
      type: Boolean,
      default: false
    },
    workspaceAddItems: {
      default: () => []
    },
    workspace_cur: {}
  },
  watch: {
    workspace_cur (val) {
      if (val && val.workspaceId) {
        this.workspaceAdd = [val]
      } else {
        this.workspaceAdd = []
      }
    }
  },
  computed: {
    registerItems () {
      return this.$store.getters.staticRouters.filter(item => item.meta.registerDoc).map(item => {
        return {
          text: this.translate(item.name),
          value: (item.meta.query || {}).register
        }
      })
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      EventBus.$on('on_attach_change' + 0 + '1', function (val) {
        vm.docfileformupload = val.length
      })
      // vm.initGetData()
      vm.optionsForm = {
        target: this.end_point + 'fileattachs/upload/' + this.docFileClassName + '/0/' + this.group_id,
        chunkSize: 500 * 1024 * 1024,
        fileMaxSize: Number(this.MSystemConfiguration.configuration.fileattach.maxfilesize || 1024),
        fileType: this.MSystemConfiguration.configuration.fileattach.fileextensions || 'NONE',
        headers: {
          'groupId': this.group_id,
          'appendix': true
        },
        allowDuplicateUploads: true,
        checkReadly: true
      }
    })
  },
  destroyed () {
    EventBus.$off('on_attach_change' + 0 + '1')
    /** delete this.id
    delete this.is_template
    delete this.workspaceAddItems
    delete this.workspace_cur
    delete this.registerItems
    delete this.subjectRules
    delete this.optionsForm
    delete this.register
    delete this.templateNoItems
    delete this.templateNo
    delete this.templateNoTemplate
    delete this.documentCatItems
    delete this.documentCat
    delete this.seqNum
    delete this.registerDate
    delete this.codeNo
    delete this.codeNotation
    delete this.subject
    delete this.issuerCodeItems
    delete this.issuerCode
    delete this.promulgationDate
    delete this.content
    delete this.workspaceAdd
    delete this.initGetData
    delete this.preventDefaultDenine
    delete this.saveAndExit
    delete this.saveAndAddNew
    delete this.createDocFileSubmit
    delete this.postResourceWorkspace
    delete this.clearDataForm
    delete this.templateNoChange
    delete this.registerChange
    delete this.getADateByTimeStamp */
  },
  data () {
    return {
      subjectRules: [
        (v) => !!v || 'Trích yếu bắt buộc phải nhập!'
      ],
      optionsForm: {},
      register: 0,
      templateNoItems: [],
      templateNo: '',
      templateNoTemplate: '',
      documentCatItems: [],
      documentCat: '',
      seqNum: '',
      registerDate: window.moment().toDate().getTime(),
      codeNo: '',
      codeNotation: '',
      subject: '',
      issuerCodeItems: [],
      issuerCode: '',
      promulgationDate: window.moment().toDate().getTime(),
      content: '',
      workspaceAdd: []
    }
  },
  methods: {
    initGetData () {
      let vm = this
      if (!vm.is_template) {
        window.axios.get(this.end_point + 'docfiles?template=1&start=-1&end=-1', vm.apiConfigHeader)
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              vm.templateNoItems = serializable.data
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
      window.axios.get(this.end_point + 'dictcollections/DOCUMENT_TYPE/dictitems?sort=treeIndexNumber_Number&&order=false&start=-1&end=-1', vm.apiConfigHeader)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            for (var key in serializable.data) {
              if (serializable.data[key].level === 0) {
                vm.documentCatItems.push({
                  header: serializable.data[key].itemName
                })
              } else {
                vm.documentCatItems.push({
                  text: serializable.data[key].itemName,
                  value: serializable.data[key].itemCode
                })
              }
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      window.axios.get(this.end_point + 'dictcollections/GOVERMENT_AGENCY/dictitems' + '?level=0&start=-1&end=-1', vm.apiConfigHeader)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.issuerCodeItems = serializable.data
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    preventDefaultDenine () {
      console.log('Submit form add docfile')
    },
    saveAndExit () {
      this.createDocFileSubmit()
    },
    saveAndAddNew () {
      this.createDocFileSubmit(true)
    },
    createDocFileSubmit: function () {
      let vm = this
      console.log(vm.docfileformupload)
      if (this.$refs.form.validate()) {
        let params = {}
        params.documentCat = vm.documentCat || ''
        if (vm.is_template) {
          params.templateNo = vm.templateNoTemplate || ''
        } else {
          params.templateNo = vm.templateNo ? (vm.templateNo.templateNo || '') : ''
        }
        params.register = vm.register || 0
        params.seqNum = vm.seqNum || 0
        params.codeNo = vm.codeNo || ''
        params.codeNotation = vm.codeNotation || ''
        params.subject = vm.subject
        params.issuerCode = vm.issuerCode || ''
        params.registerDate = vm.registerDate ? window.moment(vm.registerDate).format('YYYYMMDD') : ''
        params.promulgationDate = vm.promulgationDate ? window.moment(vm.promulgationDate).format('YYYYMMDD') : ''
        params.content = vm.content || ''
        params.isTemplate = vm.is_template ? 1 : 0
        if (vm.is_template || vm.docfileformupload) {
          vm.$store.dispatch('docFile/createDocFile', params
          ).then(response => {
            vm.postResourceWorkspace(response)
            vm.$emit('call-back', response)
          }, error => {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
        } else {
          this.$dialog.alert('Bạn chưa đính kèm file lên tài liệu', {
            okText: 'Đóng lại'
          })
            .then(function (dialog) {
              console.log('Closed')
            })
        }
      }
    },
    postResourceWorkspace (item) {
      let vm = this
      let urlUpdate = vm.end_point + 'resourceworkspaces'
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      if (vm.workspaceAdd !== 0) {
        for (vm.key in vm.workspaceAdd) {
          let paramsApiP = new URLSearchParams()
          paramsApiP.append('className', vm.docFileClassName)
          paramsApiP.append('classPK', item.docFileId)
          paramsApiP.append('workspaceId', vm.workspaceAdd[vm.key]['workspaceId'])
          paramsApiP.append('permanent', true)
          window.axios.post(urlUpdate, paramsApiP, config)
            .then(function (response) {
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      }
    },
    clearDataForm: function () {
      this.$refs.form.reset()
      this.registerDate = window.moment().toDate().getTime()
      this.promulgationDate = window.moment().toDate().getTime()
      this.workspaceAdd = this.workspace_cur ? [this.workspace_cur] : []
    },
    templateNoChange: function (item) {
      if (item) {
        let vm = this
        vm.documentCat = item.documentCat
        vm.seqNum = item.seqNum
        vm.codeNo = item.codeNo
        vm.codeNotation = item.codeNotation
        vm.subject = item.subject
        vm.issuerCode = item.issuerCode
        vm.promulgationDate = item.promulgationDate
        vm.registerDate = item.registerDate
        vm.content = item.content
      }
    },
    registerChange: function (item) {
      if (Number(item) >= 0) {
        let vm = this
        vm.templateNoItems = []
        window.axios.get(this.end_point + 'docfiles?template=1&register=' + item + '&sort=subject&start=-1&end=-1', vm.apiConfigHeader)
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              vm.templateNoItems = serializable.data.filter(item => 'owner,leader,hoster,manager,writer'.indexOf(item['permission'] || 'none') >= 0)
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    getADateByTimeStamp (timeStamp) {
      if (Number(timeStamp)) {
        return new Date(Number(timeStamp))
      } else if (timeStamp) {
        return new Date(timeStamp)
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss">

  .format_italic_source {
    .material-icons{
      transform: rotate(110deg);
    }
  }

  .mobilink__docfile__add__component {
    .attach-in-new-docfile {
      border: 1px solid #e6e7e8;
      margin-top: 15px;
      position: relative;
      .header-text {
        position: absolute;
        top: 10px;
        left: 15px;
        pointer-events: none;
        font-weight: bold;
        /* color: #039be5; */
        z-index: 1;
      }
      .uploader-drop {
        background-color: #f0f1f1;
        padding: 5px;
        border: 0;
        border-bottom: 1px solid #e6e7e8;
        p {
          display: none;
        }
        .uploader-btn {
          border: 0;
          &:hover, &:fucus {
            outline: 0;
            background-color: transparent;
          }
        }
      }
      .c-action-btn {
        padding: 0;
      }
      table td:last-child {
        padding: 0;
      }
    }
  }

  .subheader--required {
    &:after {
      content: '*';
      margin-left: 3px;
      color: #ec6464;
    }
  }
  .menu__content.menu__content--select {
    .subheader {
      &:before {
        content: '\1F530';
        color:#999;
      }
    }
  }
</style>