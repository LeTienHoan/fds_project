<template>
  <div class="uploader-list">
    <div :id="'tab-file_upload-detail-1'+id" reverse-transition="slide-y-transition" transition="slide-y-transition">
        <uploader-drop v-if="hasPermission">
          <button class="uploader-btn text-main-color" @click.prevent.stop="finderPicker()" v-if="mbl_attach && extensions_upload === 'true'">
            <span>
              <i class="primary--text fa fa-file-text"></i> Thư viện số
            </span>
          </button>
          <uploader-btn :attrs="{'accept': MSystemConfiguration.configuration.fileattach.fileextensions}"
            class="text-main-color"> <i class="primary--text fa fa-upload"></i> Từ máy tính</uploader-btn>
          <button class="uploader-btn button-upload-google text-main-color" @click.prevent.stop="googlePicker()" v-if="extensions_upload == 'true'"><img src="/o/mobilink-theme/images/icon-1.png"> GoogleDrive</button>
          <button class="uploader-btn button-upload-dropbox text-main-color" @click.prevent.stop="dropboxPicer()" v-if="extensions_upload === 'true'"><i class="fa fa-dropbox primary--text"></i> DropBox</button>
          <p v-if="false && showlist"
            style="
              position: absolute;
              top: 15px;
              color: #b3adad;
          ">Bạn có thể kéo thả tài liệu vào đây để tải lên</p>
        </uploader-drop>
      <slot :file-list="fileList">
          <ul v-if="fileList.length > 0">
            <li v-for="(file, index) in fileList" :key="file.id">
              <uploader-file :file="file" :list="true" :index="index"
                v-on:handlechildcallfilelist='handlechildcallfilelist'
              ></uploader-file>
            </li>
          </ul>
      </slot>
    </div>
      <list-file-attach
        v-if="showlist"
        :id="id"
        :permission="permission"
        :mbl_attach="mbl_attach"
      ></list-file-attach>
    <dia-log 
      :item = "[
        {
          width: '900px',
          model: fileVersionDialog,
          action: 'saveDialog',
          edit: false,
        }]
      "
      :show_button=false
      @closeDialog="(val) => (fileVersionDialog = val)"
    >
      <template slot="header">
        Thông tin file đính kèm
      </template>
      <template slot="content">
        <ul class="ul-with-border ul-with-right-icon ul-with-left-icon">
          <li v-for="(item, index) in file_attact_list_file_version" :key="index">
            <div class="layout wrap">
              <div class="flex xs12 sm6 label_align">
                <i class="fa fa-angle-double-right icon-left" aria-hidden="true"></i>
                <a :href="item.sourceUrl" class="pl-2" target="_blank" v-if="item.fileName && item.fileName.length > 0">{{item.fileName}}</a>
                <a :href="item.sourceUrl" class="pl-2" target="_blank" v-else>Chưa cập nhật tên tài liệu</a>
              </div>
              <div class="flex xs12 sm6 text-xs-right">
                <span>( V {{item.version}}.0 ) </span>
                <span>{{item.createDate | datetime}}</span> 
                <strong>{{item.userName}}</strong>
                <v-btn flat icon class="ma-0" color="primary" 
                  v-on:click.native="downloadReferenceFileVersion(item)"
                >
                  <v-icon class="primary--text">file_download</v-icon>
                </v-btn>
              </div>
            </div>
          </li>
        </ul>
      </template>
    </dia-log>
      <dia-log
        v-if="mbl_attach"
        :item = "[
          {
            width: '900px',
            model: finderDialog,
            action: 'saveDialog',
            edit: fileAttachIdToSave === '',
            label: 'Ghi lại',
            icon: 'save'
          }]
        "
        :show_button=true
        @closeDialog="(val) => (finderDialog = val)"
        @saveDialog="submitCopyFileAttachToRefClassName"
      >
        <template slot="header">
          {{fileAttachIdToSave === '' ? 'Tải file từ thư viện số' : 'Lưu file vào thư viện số'}}
        </template>
        <template slot="content">
          <v-fade-transition>
              <MobilinkAttachFromDocfile
                v-if="mbl_attach && finderDialog"
                :id="'list-file' + id"
                :selectfile="fileAttachIdToSave === ''"
                :selectdocfile="fileAttachIdToSave !== ''"
                @copyFileAttachToRefClassName="copyFileAttachToRefClassName"
                @copyFileAttachRefClassNameToDocFile="copyFileAttachRefClassNameToDocFile"
              >
              </MobilinkAttachFromDocfile>
          </v-fade-transition>
        </template>
      </dia-log>
  </div>
</template>

<script>
  import UploaderFile from './file.vue'
  import MobilinkAttachFromDocfile from '../FolderMgt'
  import { EventBus } from '@/eventbus'
  import ListFileAttach from './list_file_attach'
  const COMPONENT_NAME = 'uploader-list'

  export default {
    name: COMPONENT_NAME,
    props: {
      id: null,
      viewId: {
        type: String,
        default: 'DOCS'
      },
      class_pk: {
        type: Number,
        default: ''
      },
      class_name: {
        type: String,
        default: ''
      },
      file_attach_api: {
        type: String,
        default: ''
      },
      resourceusers_get_api: {
        type: String,
        default: 'o/mobilink/v2/resourceusers?start=-1&end=-1'
      },
      extensions_upload: {
        type: String,
        default: 'true'
      },
      permission: {
        type: String,
        default: 'read'
      },
      appendix: {
        type: Boolean,
        default: true
      },
      mbl_attach: {
        type: Boolean,
        default: true
      },
      edit_online_key: {
        type: String,
        default: ''
      },
      showlist: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        allFileAttachs: [],
        file_attact_list_file_version: [],
        pickerFileMessageSuccess: 'Tải tài liệu thành công',
        pickerFileMessageError: 'Tải tài liệu thất bại',
        fileMessageSuccess: 'Tải tài liệu thành công',
        fileMessageError: 'Tải tài liệu thất bại',
        fileVersionDialog: false,
        fileAttachIdTemp: 0,
        hasPermission: false,
        finderDialog: false,
        fileAttachIdToSave: ''
      }
    },
    components: {
      UploaderFile,
      MobilinkAttachFromDocfile,
      ListFileAttach
    },
    computed: {
      fileList () {
        return this.$parent.fileList
      }
    },
    watch: {
      class_pk () {
        this.initDataComponent()
      },
      '$store.getters.fileAttachComponentState': function (val) {
        if (val.id === this.id) {
          this[val.action](val.fileAttach, val.fileAttach.index, val.fileAttach.$event)
        }
      }
    },
    created () {
      this.$nextTick(function () {
        this.initDataComponent()
      })
    },
    methods: {
      initDataComponent () {
        let vm = this
        vm.initDataComponentLoading = true
        vm.hasPermission = 'owner,write,leader,manager,hoster'.indexOf(vm.permission || 'none') >= 0
        const config = {
          headers: {
            'groupId': vm.group_id,
            'Accept': 'application/json'
          }
        }
        vm.allFileAttachs = []
        window.axios.get(vm.file_attach_api + '/' + vm.class_name + '/' +
          vm.class_pk + '?start=-1&end=-1&order=true&sort=modified_Number&appendix=' + vm.appendix,
        config)
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              vm.allFileAttachs = serializable.data
            }
            EventBus.$emit('on_attach_change' + vm.id, vm.allFileAttachs)
            vm.initDataComponentLoading = false
          })
          .catch(function (error) {
            console.log(error)
            // let d = {'total': 5, 'data': [{'fileAttachId': 13701, 'userId': 42942, 'userName': 'Tăng Quang Huy', 'createDate': 1533784012000, 'modifiedDate': 1533784012000, 'fullname': '', 'email': '', 'fileName': 'ux.png', 'fileType': 'image.png', 'fileSize': 11836, 'version': 1, 'source': '', 'sourceUrl': '', 'docFileId': 0, 'editable': true, 'secucheck': 1, 'appendix': true, 'extension': 'png'}, {'fileAttachId': 13901, 'userId': 42942, 'userName': 'Tăng Quang Huy', 'createDate': 1533785839000, 'modifiedDate': 1533785839000, 'fullname': '', 'email': '', 'fileName': 'training_er.jpg', 'fileType': 'image.jpeg', 'fileSize': 9284, 'version': 1, 'source': '', 'sourceUrl': '', 'docFileId': 0, 'editable': true, 'secucheck': 1, 'appendix': true, 'extension': 'jpg'}, {'fileAttachId': 13801, 'userId': 42942, 'userName': 'Tăng Quang Huy', 'createDate': 1533784109000, 'modifiedDate': 1533784109000, 'fullname': '', 'email': '', 'fileName': 'tester.jpg', 'fileType': 'image.jpeg', 'fileSize': 128871, 'version': 1, 'source': '', 'sourceUrl': '', 'docFileId': 0, 'editable': true, 'secucheck': 1, 'appendix': true, 'extension': 'jpg'}, {'fileAttachId': 14001, 'userId': 42942, 'userName': 'Tăng Quang Huy', 'createDate': 1533789921000, 'modifiedDate': 1533789921000, 'fullname': '', 'email': '', 'fileName': 'tester.jpg', 'fileType': 'image.jpeg', 'fileSize': 128871, 'version': 1, 'source': '', 'sourceUrl': '', 'docFileId': 0, 'editable': true, 'secucheck': 1, 'appendix': true, 'extension': 'jpg'}, {'fileAttachId': 14002, 'userId': 42942, 'userName': 'Tăng Quang Huy', 'createDate': 1533798034000, 'modifiedDate': 1533798034000, 'fullname': '', 'email': '', 'fileName': 'ux.png', 'fileType': 'image.png', 'fileSize': 11836, 'version': 1, 'source': '', 'sourceUrl': '', 'docFileId': 0, 'editable': true, 'secucheck': 1, 'appendix': true, 'extension': 'png'}]}
            // vm.allFileAttachs = d.data
            EventBus.$emit('on_attach_change' + vm.id, vm.allFileAttachs)
            vm.initDataComponentLoading = false
          })
      },
      fileVersionView: function (item) {
        let vm = this
        vm.fileVersionDialog = !vm.fileVersionDialog
        const config = {
          headers: {
            'groupId': vm.group_id
          },
          params: {
            'start': -1,
            'end': -1
          }
        }
        vm.file_attact_list_file_version = []
        vm.fileAttachIdTemp = 0
        window.axios.get(vm.file_attach_api + '/' + item.fileAttachId + '/versions', config)
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              vm.file_attact_list_file_version = serializable.data
              vm.fileAttachIdTemp = item.fileAttachId
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      downloadReferenceFileVersion: function (item) {
        let vm = this
        const config = {
          headers: {
            'groupId': vm.group_id
          },
          responseType: 'blob'
        }
        window.axios.get(vm.file_attach_api + '/' + vm.fileAttachIdTemp + '/' + item.version + '.0', config).then(function (response) {
          let fileName = item.fileName
          let a = document.createElement('a')
          document.body.appendChild(a)
          a.style = 'display: none'
          let url = window.URL.createObjectURL(response.data)
          a.href = url
          a.download = fileName
          a.click()
          window.URL.revokeObjectURL(url)
        })
          .catch(function (error) {
            console.log(error)
          })
      },
      downloadReferenceFile: function (item) {
        let vm = this
        item['download_loading'] = true
        let onsuccess = function () {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          item['download_loading'] = false
        }
        let onerror = function (error) {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          item['download_loading'] = false
          console.log(error)
        }
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Đang tải dữ liệu...'
        })
        window.downloadFile2({
          url: vm.file_attach_api + '/' + item.fileAttachId,
          groupId: vm.group_id,
          fileName: item.fileName
        }, onsuccess, onerror)
      },
      viewFile: function (item) {
        let vm = this
        item['download_loading'] = true
        let onsuccess = function () {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          item['download_loading'] = false
        }
        let onerror = function (error) {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          item['download_loading'] = false
          console.log(error)
        }
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Đang tải dữ liệu...'
        })
        window.viewFileAttach2({
          url: vm.file_attach_api + '/' + item.fileAttachId,
          groupId: vm.group_id,
          fileName: item.fileName,
          fileType: item.fileType,
          fileAttachId: item.fileAttachId,
          extension: item.extension,
          edit_online_key: vm.edit_online_key
        }, onsuccess, onerror)
      },
      singleFileUpload: function (item) {
        document.getElementById('inputfile_' + item.fileAttachId).click()
      },
      singleFileUploadInput: function (item, index, e) {
        let files = e.target.files || e.dataTransfer.files
        let file = files[0]
        let vm = this
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        let params = new FormData()
        params.append('file', file)
        params.append('fileType', file.type)
        params.append('fileSize', file.size)
        params.append('fileName', file.name)
        params.append('className', vm.class_name)
        params.append('classPK', vm.class_pk)
        /** TODO: giao dien them o check file chinh hay file phu luc */
        params.append('appendix', vm.appendix)
        window.axios.put(vm.file_attach_api + '/' + item.fileAttachId,
          params,
          config
        )
          .then(function (response) {
            item.version = response.data.version
            item.fileName = response.data.fileName
            vm.fileMessageSuccess = 'Cập nhật liệu đính kèm thành công'
            window.showMessageToastr('success', vm.fileMessageSuccess)
            vm.allFileAttachs[index] = item
            EventBus.$emit('on_attach_change' + vm.id, vm.allFileAttachs)
          })
          .catch(function (error) {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      handlechildcallfilelist: function (index) {
        let vm = this
        setTimeout(function () {
          if (!vm.initDataComponentLoading) {
            vm.initDataComponent()
          }
        }, 1000)
      },
      fileAttactUploadRemove: function (item, index) {
        let vm = this
        vm.$dialog.confirm('Bạn có chắc chắn muốn xóa file đính kèm này không?', {
          html: true,
          loader: true,
          okText: 'Xác nhận',
          cancelText: 'Quay lại',
          animation: 'fade'
        })
          .then((dialog) => {
            const config = {
              headers: {
                'groupId': vm.group_id
              }
            }
            vm.$store.dispatch('loading/setLoading', {
              loading: true,
              message: 'Xóa dữ liệu...'
            })
            window.axios.delete(vm.file_attach_api + '/' + item.fileAttachId, config).then(function (response) {
              vm.allFileAttachs.splice(index, 1)
              EventBus.$emit('on_attach_change' + vm.id, vm.allFileAttachs)
              vm.fileMessageSuccess = 'Xoá tài liệu đính kèm thành công'
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageToastr('success', vm.fileMessageSuccess)
            })
              .catch(function (error) {
                console.log(error)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
            dialog.close()
          })
          .catch((e) => {
            console.log(e)
          })
      },
      fileAttactRemove: function (item, index) {
        let vm = this
        vm.$dialog.confirm('Bạn có chắc chắn muốn xóa file đính kèm này không?', {
          html: true,
          loader: true,
          okText: 'Xác nhận',
          cancelText: 'Quay lại',
          animation: 'fade'
        })
          .then((dialog) => {
            const config = {
              headers: {
                'groupId': vm.group_id
              }
            }
            window.axios.delete(vm.file_attach_api + '/' + item.fileAttachId, config).then(function (response) {
              vm.allFileAttachs.splice(index, 1)
              EventBus.$emit('on_attach_change' + vm.id, vm.allFileAttachs)
              vm.pickerFileMessageSuccess = 'Xoá tài liệu đính kèm thành công'
              window.showMessageToastr('success', vm.pickerFileMessageSuccess)
            })
              .catch(function (error) {
                console.log(error)
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
            dialog.close()
          })
          .catch((e) => {
            console.log(e)
          })
      },
      dropboxPicer: function () {
        let vm = this
        if (vm.hasPermission) {
          let options = {
            success: function (files) {
              for (const file of files) {
                const name = file.name
                const url = file.link
                const config = {
                  headers: {
                    'groupId': vm.group_id
                  }
                }
                let params = new URLSearchParams()
                params.append('className', vm.class_name)
                params.append('classPK', vm.class_pk)
                params.append('source', 'dropbox')
                params.append('sourceUrl', url)
                params.append('fileName', name)
                let fname = name.split('.')
                params.append('fileType', fname[fname.length - 1])
                params.append('appendix', vm.appendix)
                params.append('thumbnailLink', file.thumbnailLink)
                window.axios.post(vm.file_attach_api,
                  params,
                  config
                )
                  .then(function (response) {
                    vm.allFileAttachs.push(response.data)
                    EventBus.$emit('on_attach_change' + vm.id, vm.allFileAttachs)
                    vm.pickerFileMessageSuccess = 'Tải tài liệu thành công'
                    window.showMessageToastr('success', vm.pickerFileMessageSuccess)
                  })
                  .catch(function (error) {
                    console.log(error)
                    window.showMessageByAPICode(error.response.status, error.response.data)
                  })
              }
            },
            cancel: function () {
            },
            linkType: 'direct',
            multiselect: false,
            extensions: ['.pdf', '.doc', '.docx', '.html', '.png', '.jpg']
          }
          window.Dropbox.choose(options)
        }
      },
      googlePicker: function () {
        let vm = this
        if (vm.hasPermission) {
          window.onAuthApiLoadAndHandleAuthResultAndCreatePicker(vm.viewId, vm.pickerCallback)
        }
      },
      pickerCallback: function (data, oauthToken) {
        let url = 'nothing'
        let vm = this
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
          let doc = data[window.google.picker.Response.DOCUMENTS][0]
          url = doc[window.google.picker.Document.URL]
          let fileName = doc.name
          let params = new URLSearchParams()
          params.append('className', vm.class_name)
          params.append('classPK', vm.class_pk)
          params.append('source', 'google')
          params.append('sourceUrl', url)
          params.append('fileName', fileName)
          params.append('fileType', doc.mimeType)
          params.append('thumbnailLink', 'https://drive.google.com/thumbnail?authuser=0&sz=w32&id=' + doc.id)
          params.append('appendix', vm.appendix)
          window.axios.post(vm.file_attach_api,
            params,
            config
          )
            .then(function (response) {
              vm.allFileAttachs.push(response.data)
              EventBus.$emit('on_attach_change' + vm.id, vm.allFileAttachs)
              vm.pickerFileMessageSuccess = 'Tải tài liệu thành công'
              window.showMessageToastr('success', vm.pickerFileMessageSuccess)
            })
            .catch(function (error) {
              console.log(error)
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
        }

        window.axios.get(vm.resourceusers_get_api + '/' + vm.class_name + '/' + vm.class_pk + '?selected=true&sort=fullName&start=-1&end=-1', config)
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
                let doc = data[window.google.picker.Response.DOCUMENTS][0]
                url = doc[window.google.picker.Document.URL]
                let fileID = doc[window.google.picker.Document.ID]
                let role = 'reader'
                let type = 'user'
                vm.followers = serializable.data
                for (var key in vm.followers) {
                  let emailAddress = vm.followers[key].email
                  if (emailAddress.length > 0) {
                    let request1 = window.gapi.client.request({
                      'path': 'https://www.googleapis.com/drive/v3/files/' + fileID + '/permissions',
                      'method': 'POST',
                      'headers': { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + oauthToken },
                      'body': { 'role': role, 'type': type, 'emailAddress': emailAddress }
                    }); request1.execute(function (resp) { console.log(resp) })
                  }
                }
              }
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      finderPicker: function () {
        this.finderDialog = true
        this.fileAttachIdToSave = ''
      },
      copyFileAttachToRefClassName (fileAttachs) {
        this.fileAttachsToCopy = fileAttachs
      },
      submitCopyFileAttachToRefClassName () {
        let vm = this
        if (vm.fileAttachsToCopy && vm.fileAttachsToCopy.length) {
          const config = {
            headers: {
              'groupId': vm.group_id
            }
          }
          let listFileToCopy = vm.fileAttachsToCopy.map(item => item.fileAttachId).toString()
          let url = vm.end_point + 'fileattachs/' + vm.class_name + '/' + vm.class_pk +
            '/copy?appendix=' + vm.appendix + '&strFileAttachId=' + listFileToCopy
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Đang copy dữ liệu...'
          })
          window.axios.get(url, config)
            .then(function (response) {
              let serializable = response.data
              if (serializable.hasOwnProperty('data')) {
                vm.allFileAttachs = vm.allFileAttachs.concat(serializable.data)
              }
              EventBus.$emit('on_attach_change' + vm.id, vm.allFileAttachs)
              vm.finderDialog = false
              vm.fileMessageSuccess = 'Đã chọn ' + vm.fileAttachsToCopy.length + ' file từ thư viện điện tử '
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageToastr('success', vm.fileMessageSuccess)
            })
            .catch(function (error) {
              console.log(error)
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              vm.fileMessageSuccess = 'Chọn file từ thư viện điện tử thất bại'
              window.showMessageToastr('error', vm.fileMessageSuccess)
            })
        }
      },
      fileAttactSaveToDocFile: function (item, index) {
        this.fileAttachIdToSave = item.fileAttachId
        this.finderDialog = true
      },
      copyFileAttachRefClassNameToDocFile (docFile) {
        let vm = this
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        let url = vm.end_point + 'fileattachs/' + vm.docFileClassName + '/' + docFile.docFileId +
          '/copy?appendix=' + vm.appendix + '&strFileAttachId=' + vm.fileAttachIdToSave
        window.axios.get(url, config)
          .then(function (response) {
            vm.fileMessageSuccess = 'Đã lưu file vào ' + docFile.subject
            vm.fileAttachIdToSave = ''
            vm.finderDialog = false
            window.showMessageToastr('success', vm.fileMessageSuccess)
          })
          .catch(function (error) {
            console.log(error)
            vm.fileMessageSuccess = 'Lưu file vào ' + docFile.subject + ' thất bại'
            window.showMessageToastr('error', vm.fileMessageSuccess)
          })
      }
    }
  }
</script>

<style>
  .uploader-list {
    position: relative;
  }
  .uploader-list ul {
    list-style: none!important;
    margin: 0!important;
    padding: 0!important
  }
  .ul-with-border .btn--icon .btn__content {
    padding: 0;
  }
  .ul-with-border .btn--icon .btn__content i.material-icons {
    font-size: 17px;
  }
  .btn--version.btn--floating {
    border-radius: 50%;
    border-top-left-radius: 50%;
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    border-bottom-left-radius: 50%;
    min-width: 0;
    height: 20px;
    width: 20px;
    padding: 0;
    -webkit-box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
    box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
  }
  .btn--version.btn--floating .btn__content {
    padding: 0;
    font-size: 10px;
  }
  .uploader-list .tabs__li .badge {
    background: transparent;
    color: inherit;
  }
  ul.ul-with-border li {
    padding-right: 15px;
  }
  .uploader-btn i.material-icons.icon{
    font-size: 17px;
  }
  body .uploader-drop {
    border-left: 0;
    border-right: 0;
  }

  .badge__badge__custome__2 {
    line-height: 20px;
    color: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    font-size: 12px;
    top: -11px;
    right: -22px;
    border-radius: 50%;
    height: 22px;
    width: 22px;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    flex-shrink: 0;
    margin-right: 3px;
  }
</style>