<template>
<v-form ref="form" lazy-validation v-on:submit.prevent="preventDefaultDenine()">
  <div :id="'newsboard_add_'+id" class="mobilink__newsboard__add__component">
    <v-layout class="pb-3">
     <!--  <v-flex>
        <PictureUpload
          ref="pictureUpload"
          @fileUploaded="fileUploaded"
          @fileSelected="fileSelected"
          :attachFile="newsBoardModel.newsType==='BLOG'"
          :srcImg="newsBoardModel.fileSelect"
        />
      </v-flex> -->
      <v-flex>
        <v-layout wrap>
          <v-flex xs12 sm12>
            <v-radio-group v-model="typeModel" class="radioNewsBoard">
              <v-radio
                v-for="(item,index) in typeItems"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></v-radio>
            </v-radio-group>
          </v-flex>
          <v-flex xs12 sm2>
            <v-subheader  class="px-0 pl-2=">
              <label>Tên thông báo *</label>
            </v-subheader>
          </v-flex>
          <v-flex xs12 sm10>
            <v-text-field
              :placeholder="translate('ten_ban_tin')"
              v-model="newsBoardModel.title"
              :rules="[v => !!v || translate('bat_buoc_phai_nhap') + ' ' + translate('ten_ban_tin') ]"
              required
              
            ></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-layout wrap>
              <v-flex xs12 sm2>
                <v-subheader class="px-0 pl-2=">
                  <label>{{translate('thu_muc')}}</label>
                </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
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
                  required
                >
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
              <v-flex xs12 sm6 class="px-0 pl-3" style="display: flex;">
                <v-checkbox v-model="newsBoardModel.ontop" label="Lên đầu trang"></v-checkbox>
                <v-checkbox v-model="newsBoardModel.priority" label="Khẩn"></v-checkbox>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs12>
        <vue-editor
          id="addNewsBoard"
          v-model="newsBoardModel.content"
        >
        </vue-editor>
      </v-flex>
      
      <v-flex xs12 sm12
      >
        <div class="attach-in-new-newsboard" v-if="optionsForm.checkReadly && active">
          <div class="header-text primary--text">File đính kèm</div>
          <uploader :options="optionsForm">
              <uploader-unsupport></uploader-unsupport>
              <uploader-list 
                  :id="0 + '1'"
                  view-id='DOCS'
                  :class_name="newsBoardClassName"
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
import PictureUpload from './PictureUpload'
const COMPONENT_NAME = 'jx-mobilink-newsboard-add'

export default {
  name: COMPONENT_NAME,
  components: {
    PictureUpload
  },
  props: {
    id: {
      default: 1
    },
    active: {
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
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      EventBus.$on('on_attach_change' + 0 + '1', function (val) {
        vm.newsboardformupload = val.length
      })
      // vm.initGetData()
      vm.optionsForm = {
        target: this.end_point + 'fileattachs/upload/' + this.newsBoardClassName + '/0/' + this.group_id,
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
  },
  data () {
    return {
      optionsForm: {},
      newsTypeItems: [],
      workspaceAdd: [],
      // cccc
      newsBoardModel: {
        newsType: '',
        newsCat: '',
        title: '',
        content: '',
        publicationDate: window.moment().toDate().getTime(),
        expireDate: window.moment().toDate().getTime(),
        ontop: false,
        fileUpload: null,
        fileSelect: '/public/BLOG.jpg',
        priority: false
      },
      newsBoardTemp: {
        newsType: '',
        newsCat: '',
        title: '',
        content: '',
        publicationDate: window.moment().toDate().getTime(),
        expireDate: window.moment().toDate().getTime(),
        ontop: false,
        fileUpload: null,
        fileSelect: '/public/BLOG.jpg'
      },
      typeItems: [
        {
          id: 'ANNOUNCE',
          name: 'Thêm thông báo'
        },
        {
          id: 'FAQ',
          name: 'Thêm câu hỏi'
        }
      ],
      typeModel: 'ANNOUNCE'
    }
  },
  methods: {
    initGetData () {
      let vm = this
      vm.newsTypeItems = []
      window.axios.get(this.end_point + 'dictcollections/NEWSBOARD_TYPE/dictitems?sort=treeIndexNumber_Number&&order=false&start=-1&end=-1', vm.apiConfigHeader)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.newsTypeItems = serializable.data
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    preventDefaultDenine () {
      console.log('Submit form add newsboard')
    },
    saveAndExit () {
      this.createNewsBoardSubmit()
    },
    saveAndAddNew () {
      this.createNewsBoardSubmit(true)
    },
    createNewsBoardSubmit: function () {
      let vm = this
      if (this.$refs.form.validate()) {
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Thêm mới dữ liệu...'
        })
        let config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        // vm.$store.dispatch('newsBoard/createNewsBoard', params
        // ).then(response => {
        //   vm.postResourceWorkspace(response)
        //   vm.clearDataForm()
        //   vm.$emit('call-back', response)
        // }, error => {
        //   console.log(error)
        //   window.showMessageByAPICode(error.response.status, error.response.data)
        // })
        let params = new URLSearchParams()
        if (vm.newsBoardModel.fileUpload) {
          params.append('file', vm.newsBoardModel.fileUpload)
          params.append('fileName', vm.newsBoardModel.fileUpload.name)
          params.append('fileType', vm.newsBoardModel.fileUpload.type)
          params.append('fileSize', vm.newsBoardModel.fileUpload.size)
        }
        params.append('ontop', vm.newsBoardModel.ontop)
        params.append('title', vm.newsBoardModel.title)
        params.append('content', vm.newsBoardModel.content)
        params.append('newsCat', '')
        params.append('newsType', vm.typeModel)
        params.append('priority', vm.newsBoardModel.priority)
        window.axios.post(vm.end_point + 'newsboards',
          params,
          config
        )
          .then(function (response) {
            vm.postResourceWorkspace(response.data)
            vm.$emit('call-back', response.data)
            vm.clearDataForm()
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          })
          .catch(function (error) {
            console.log(error.response)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
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
          paramsApiP.append('className', vm.newsBoardClassName)
          paramsApiP.append('classPK', item.newsBoardId)
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
    handleFileUpload (classPK, fileUpload) {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      let dataPut = new FormData()
      dataPut.append('className', vm.newsBoardClassName)
      dataPut.append('classPK', classPK)
      dataPut.append('chunkNumber', 1)
      dataPut.append('chunkSize', fileUpload.size)
      dataPut.append('currentChunkSize', fileUpload.size)
      dataPut.append('totalSize', fileUpload.size)
      dataPut.append('identifier', String(fileUpload.size) + fileUpload.name)
      dataPut.append('fileName', fileUpload.name)
      dataPut.append('fileType', fileUpload.type)
      dataPut.append('relativePath', fileUpload.name)
      dataPut.append('totalChunks', 1)
      dataPut.append('file', fileUpload)
      window.axios.post(vm.end_point + 'albumfiles/upload/' + vm.newsBoardClassName + '/' + classPK + '/' + vm.group_id,
        dataPut,
        config
      )
        .then(function (response) {
          console.log('da tai anh')
        })
        .catch(function (error) {
          console.log(error.response)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    },
    clearDataForm: function () {
      this.$refs.form.reset()
      this.typeModel = 'ANNOUNCE'
      this.workspaceAdd = []
      Object.assign(this.newsBoardModel, this.newsBoardTemp)
    },
    getADateByTimeStamp (timeStamp) {
      if (Number(timeStamp)) {
        return new Date(Number(timeStamp))
      } else if (timeStamp) {
        return new Date(timeStamp)
      } else {
        return ''
      }
    },
    fileUploaded (val) {
      this.newsBoardModel.fileUpload = val
      this.newsBoardModel.fileSelect = null
    },
    fileSelected (val) {
      this.newsBoardModel.fileUpload = null
      this.newsBoardModel.fileSelect = val
    },
    newsTypeChange (val) {
      if (val === 'BLOG') {
        this.fileSelected('/public/BLOG.jpg')
      } else if (val === 'NOTIFICATION') {
        this.fileSelected('/public/NOTIFICATION.jpg')
      } else {
        this.fileSelected('/public/QNA.jpg')
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

  .mobilink__newsboard__add__component {
    .input-group.checkbox {
      margin-bottom: 0;
      margin-top: 5px;
    }
    .attach-in-new-newsboard {
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
    /*&:after {
      content: '*';
      margin-left: 3px;
      color: #ec6464;
    }*/
  }
  .menu__content.menu__content--select {
    .subheader {
      &:before {
        /*content: '\1F530';*/
        color:#999;
      }
    }
  }
  .radioNewsBoard .input-group__input{
    display: flex;
  }
  .radioNewsBoard .input-group__input .input-group--selection-controls {
    margin: 0;
  }
</style>