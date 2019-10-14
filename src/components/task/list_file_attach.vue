<template>
  <div :class="'uploader-list' + id + ' component-uploader-list'">
    <div class="table-wrapper" v-show="desserts.length > 0">
      <table class="table table-bs">
        <tr :key="index" v-for="(item, index) in desserts">
          <td class="col-xs-7" style="word-break: break-all;">
            <v-layout>
              <v-icon color="primary" v-if="item.source === 'upload' || item.source === ''">file_upload</v-icon>
              <i class="fa fa-dropbox primary--text" v-else-if="item.source === 'dropbox'"></i>
              <img class="img-icon" v-else-if="item.source === 'google'" src="/o/mobilink-theme/images/icon-1.png">
              <v-icon color="primary" v-else-if="item.source === 'link'">insert_drive_file</v-icon>
              <span class="pl-1 pr-1" @click.prevent.stop="viewFile(item)">
                {{ item.fileName }}
              </span>
              <v-icon :color="fileSecureCheck[item.secucheck]['color']"
                :title="fileSecureCheck[item.secucheck]['title']"
                v-if="item.source === 'upload' || item.source === ''"
              >
                security
              </v-icon>
            </v-layout>
          </td>
          <td class="text-xs-right col-xs-0">
              <v-avatar v-if="item.source === 'upload' || item.source === ''"
                :size="22"
                color="primary"
                @click.prevent.stop="fileVersionView(item)"
              >
                <span class="white--text">{{item.version}}</span>
              </v-avatar>
          </td>
          <td class="text-xs-right col-xs-2">
            <span>{{item.modifiedDate | datetime}}</span>
          </td>
          <td class="text-xs-right col-xs-2 c-action-btn">
            <v-btn icon class="ma-0" title="Lưu vào thư viện số"
              v-if="mbl_attach && (permission == 'owner' || user_id == item.userId) && (item.source === 'upload' || item.source === '')"
              v-on:click.native="fileAttactSaveToDocFile(item, index)"
            >
              <v-icon>save</v-icon>
            </v-btn>
            <v-btn icon class="ma-0" title="Tải lên"
              v-if="(permission == 'owner' || user_id == item.userId) && (item.source === 'upload' ||item.source === '')"
              v-on:click.native="singleFileUpload(item, index)"
            >
              <v-icon >file_upload</v-icon>
              <input type="file" :id="'inputfile_'+item.fileAttachId" style="display:none" v-on:change="singleFileUploadInput($event, item, index)"/>
            </v-btn>
            <v-btn icon class="ma-0" title="Tải xuống"
              v-on:click.native.prevent="downloadReferenceFile(item)"
            >
              <v-icon >file_download</v-icon>
            </v-btn>
            <v-btn icon class="ma-0" title="Xóa"
              v-if="(permission == 'owner' || user_id == item.userId) && (item.source === 'upload' || item.source === '')"
              v-on:click.native="fileAttactUploadRemove(item, index)"
            >
              <v-icon>clear</v-icon>
            </v-btn>
            <v-btn icon class="ma-0" title="Xóa"
              v-if="(permission == 'owner' || user_id == item.userId)  && !(item.source === 'upload' || item.source === '')"
              v-on:click.native="fileAttactRemove(item, index)"
            >
              <v-icon >clear</v-icon>
            </v-btn>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import { EventBus } from '@/eventbus'
  export default {
    name: 'list-file-attach',
    props: {
      id: null,
      permission: '',
      mbl_attach: {
        default: false
      }
    },
    created () {
      this.$nextTick(function () {
        let vm = this
        EventBus.$on('on_attach_change' + vm.id, function (items) {
          if (!items) {
            return
          }
          vm.desserts = items
        })
      })
    },
    destroyed () {
      let vm = this
      EventBus.$off('on_attach_change' + vm.id)
      // delete this.id
      // delete this.permission
      // delete this.mbl_attach
      // delete this.desserts
      // delete this.countAction
      // delete this.dispatchEvent
      // delete this.viewFile
      // delete this.fileAttactRemove
      // delete this.fileAttactUploadRemove
      // delete this.downloadReferenceFile
      // delete this.singleFileUpload
      // delete this.singleFileUploadInput
      // delete this.fileVersionView
      // delete this.fileAttactSaveToDocFile
    },
    data () {
      return {
        desserts: [],
        countAction: 0
      }
    },
    methods: {
      dispatchEvent (action, fileAttach) {
        // payload.fileAttach = payload
        let payload = {}
        payload.id = this.id
        payload.action = action
        this.countAction = this.countAction + 1
        payload.countAction = this.countAction
        payload.fileAttach = fileAttach
        this.$store.dispatch('setFileAttachComponentState', payload)
      },
      viewFile (item) {
        if (item.sourceUrl) {
          window.open(item.sourceUrl)
        } else {
          this.dispatchEvent('viewFile', item)
        }
      },
      fileAttactRemove (item, index) {
        item.index = index
        this.dispatchEvent('fileAttactRemove', item)
      },
      fileAttactUploadRemove (item, index) {
        item.index = index
        this.dispatchEvent('fileAttactUploadRemove', item)
      },
      downloadReferenceFile (item) {
        if (item.sourceUrl) {
          window.open(item.sourceUrl)
        } else {
          this.dispatchEvent('downloadReferenceFile', item)
        }
      },
      singleFileUpload (item) {
        document.getElementById('inputfile_' + item.fileAttachId).click()
      },
      singleFileUploadInput ($event, item, index) {
        item.index = index
        item.$event = $event
        this.dispatchEvent('singleFileUploadInput', item)
      },
      fileVersionView (item) {
        this.dispatchEvent('fileVersionView', item)
      },
      fileAttactSaveToDocFile (item, index) {
        item.index = index
        this.dispatchEvent('fileAttactSaveToDocFile', item)
      }
    }
  }
</script>

<style scoped>
  .component-uploader-list .table.table-bs .icon {
    cursor: pointer;
  }
  .component-uploader-list .table.table-bs span {
    cursor: pointer;
  }
  .component-uploader-list .img-icon {
    width: 15px;
    height: 15px;
  }

</style>

