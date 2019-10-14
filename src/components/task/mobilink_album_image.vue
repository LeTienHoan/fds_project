<template>
  <div class="album_img">
    <mbl-expand-panel
      :leftactions="[
        {
          icon: 'bookmark_border'
        }
      ]"
      :rightactions="rightactions"
      @callback2="showAlbumFileUploadDialog()"
      :ownExpanded='ownExpanded'
    >
      <template slot="title-name">
        <div class="layout flex">
          <span class=" label_align">Hình ảnh</span>
        </div>
      </template>
      <template slot="card-text-container">
        <div>
          <v-layout wrap v-if="file_attact_list_file.length == 0">
            <v-flex xs12 class="text-xs-center" style="color: #ccc">
              <v-icon style="font-size: 26px!important">collections</v-icon>
              <br>
              Không có hình ảnh nào
            </v-flex>
          </v-layout>
          <v-layout wrap>
              <v-carousel interval="30000" v-if="file_attact_list_file.length > 0">
                <v-carousel-item v-for="item in file_attact_list_file" v-bind:key="item.albumFileId" v-bind:src="item.src" ></v-carousel-item>
              </v-carousel>
            <v-alert outline color="error" icon="warning" :value="apistateupload === 333">
              {{fileMessageError}}
            </v-alert>
            <dia-log 
              :item = "[
                {
                  width: '900px',
                  model: albumFileUploadDialog,
                }]
              "
              :show_button=false
              @closeDialog="(val) => (albumFileUploadDialog = val)"
            >
              <template slot="header">
                Tải ảnh vào album
              </template>
              <template slot="content" slot-scope="props">
                <div class="imgClass">
                  <uploader-drop>
                    <uploader-btn :attrs="{'accept': MSystemConfiguration.configuration.albumfile.imageextensions}"> <v-icon>file_upload</v-icon> Tải lên</uploader-btn>
                    <p style="
                        position: absolute;
                        top: 15px;
                        width: 100%;
                        text-align: center;
                        color: #b3adad;"
                    >Bạn có thể kéo thả tài liệu vào đây để tải lên</p>
                  </uploader-drop>
                  <v-alert outline color="error" icon="warning" :value="apistateupload=== 2">
                    {{fileMessageError}}
                  </v-alert>
                  <v-alert outline color="success" icon="check_circle" :value="apistateupload === 1">
                    {{fileMessageSuccess}}
                  </v-alert>
                  <slot :file-list="fileList">
                      <ul v-if="fileList && fileList.length > 0">
                        <li v-for="(file, index) in fileList" :key="file.id">
                          <uploader-file :file="file" :list="true" :index="index"
                            v-on:handlechildcallfilelist='handlechildcallfilelist'
                          ></uploader-file>
                        </li>
                      </ul>
                  </slot>
                  <div v-for="(item, index) in file_attact_list_file" 
                    :key="index" class="layout wrap">
                    <div class="flex xs12 sm8 label_align">
                      <i class="fa fa-angle-double-right icon-left" aria-hidden="true"></i>
                      <a href="javascript:;" @click.prevent.stop="downloadReferenceFile(item)" style="word-break: break-all;" v-if="!item.download_loading" class="ml-2">{{item.fileName}}</a>
                      <v-progress-circular indeterminate color="primary" v-else></v-progress-circular>
                    </div>
                    <div class="flex xs12 sm4 text-xs-right">
                      <span>{{item.modifiedDate | datetime}}</span>
                      <v-btn flat icon color="red darken-3" 
                        v-on:click.native="fileAttactUploadRemove(item, index)"
                        class="ma-0"
                        title="Xóa"
                      >
                        <v-icon>clear</v-icon>
                      </v-btn>
                    </div>
                    <v-divider v-if="index + 1 < file_attact_list_file.length" 
                      :key="`divider-${index}`"></v-divider>
                  </div>
                </div>
              </template>
            </dia-log>
          </v-layout>
        </div>
      </template>
    </mbl-expand-panel>
  </div>

</template>

<script>
import UploaderFile from './file.vue'
const COMPONENT_NAME = 'jx-mobilink-album-image'

export default {
  name: COMPONENT_NAME,
  components: {
    UploaderFile
  },
  props: {
    id: null,
    class_pk: null,
    class_name: null,
    album_api: '',
    auto: false,
    permission: {
      default: 'owner'
    }
  },
  data () {
    return {
      albumFileUploadDialogState: 0,
      albumFileUploadDialog: false,
      apistateupload: 0,
      file_attact_list_file: [],
      fileMessageSuccess: 'Tải tài liệu thành công',
      fileMessageError: 'Tải tài liệu thất bại',
      fileAttachIdTemp: 0,
      hasPermission: false,
      ownExpanded: true,
      rightactions: [
        {
          icon: 'file_upload',
          action: 'callback2'
        }
      ]
    }
  },
  computed: {
    fileList () {
      return this.$parent.fileList
    }
  },
  watch: {
    class_pk (val) {
      this.initComp()
    }
  },
  created () {
    this.initComp()
  },
  destroyed () {
    // delete this.id
    // delete this.class_pk
    // delete this.class_name
    // delete this.album_api
    // delete this.auto
    // delete this.permission
    // delete this.albumFileUploadDialogState
    // delete this.albumFileUploadDialog
    // delete this.apistateupload
    // delete this.file_attact_list_file
    // delete this.fileMessageSuccess
    // delete this.fileMessageError
    // delete this.fileAttachIdTemp
    // delete this.hasPermission
    // delete this.ownExpanded
    // delete this.rightactions
    // delete this.fileList
    // delete this.initComp
    // delete this.showAlbumFileUploadDialog
    // delete this.downloadReferenceFile
    // delete this.fileAttactUploadRemove
    // delete this.handlechildcallfilelist
  },
  methods: {
    initComp: function () {
      let vm = this
      if (vm.permission === 'read') {
        vm.rightactions = []
      } else {
        vm.rightactions = [{
          icon: 'file_upload',
          action: 'callback2',
          title: 'Tải ảnh lên'
        }]
      }
      vm.hasPermission = 'owner,write,manager,hoster,leader'.indexOf(vm.permission || 'none') >= 0
      vm.$nextTick(function () {
        if (vm.auto) {
          vm.showAlbumFileUploadDialog()
        }
        if (vm.album_api != null) {
          vm.file_attact_list_file = []
          let config = {
            headers: {
              'groupId': vm.group_id
            },
            params: {
              start: -1,
              end: -1
            }
          }
          window.axios.get(vm.album_api + '/' + vm.class_name + '/' + vm.class_pk, config)
            .then(function (response) {
              let serializable = response.data
              if (serializable.hasOwnProperty('data')) {
                for (var key in serializable.data) {
                  serializable.data[key].src = serializable.data[key].src.replace(' ', '+')
                }
                vm.file_attact_list_file = serializable.data
                if (vm.file_attact_list_file.length > 0) {
                  vm.ownExpanded = true
                }
              } else {
                vm.file_attact_list_file = []
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      })
    },
    showAlbumFileUploadDialog: function () {
      let vm = this
      this.albumFileUploadDialog = true
      if (!vm.hasPermission) {
        vm.apistateupload = 333
        vm.fileMessageError = 'Không có quyền tải file lên album'
        setTimeout(
          function () {
            vm.apistateupload = 0
          },
          3000)
        return
      }
      this.albumFileUploadDialogState = this.id
      let prevewConfig = {
        className: this.class_name,
        classPK: this.class_pk,
        groupId: this.group_id
      }
      // console.log(this.albumFileUploadDialog)
      this.$emit('init-album-file-upload', prevewConfig)
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
        console.log(error)
        item['download_loading'] = false
      }
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Đang tải dữ liệu...'
      })
      window.downloadFile2({
        url: vm.album_api + '/' + item.albumFileId,
        groupId: vm.group_id,
        fileName: item.fileName,
        fileType: item.fileType,
        fileAttachId: item.albumFileId
      }, onsuccess, onerror)
    },
    fileAttactUploadRemove: function (item, index) {
      let vm = this
      vm.$dialog.confirm('Bạn có muốn xóa ảnh này', {
        html: true,
        loader: true,
        okText: 'Xác nhận',
        cancelText: 'Quay lại',
        animation: 'fade'
      })
        .then((dialog) => {
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Xóa dữ liệu...'
          })
          window.axios.delete(vm.album_api + '/' + item.albumFileId, vm.apiConfigHeader).then(function (response) {
            setTimeout(function () {
              vm.initComp()
            }, 1000)
            vm.apistateupload = 1
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            vm.fileMessageSuccess = 'Xoá ảnh thành công'
            setTimeout(function () {
              vm.apistateupload = 0
            }, 3000)
          })
            .catch(function (error) {
              console.log(error)
              vm.apistateupload = 2
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              vm.fileMessageError = 'Xoá ảnh thất bại'
              setTimeout(function () {
                vm.apistateupload = 0
              }, 3000)
            })
          dialog.close()
        })
        .catch((e) => {
          console.log(e)
        })
    },
    handlechildcallfilelist: function (index) {
      let vm = this
      if (this.fileList && this.fileList.length === index + 1) {
        setTimeout(function () {
          vm.initComp()
        }, 1000)
        vm.apistateupload = 1
        vm.fileMessageSuccess = 'Tải ảnh thành công'
        setTimeout(function () {
          vm.apistateupload = 0
        }, 3000)
      }
    }
  }
}
</script>

<style scoped>
  .imgClass ul{
    list-style: none!important;
    margin: 0!important;
    padding: 0!important
  }
  .album_img .jumbotron{
    padding: 0
  }
</style>