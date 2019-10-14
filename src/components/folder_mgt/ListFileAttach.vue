<template>

  <div class="list-file-attach-component">
    <content-placeholders v-show="isLoading">
      <content-placeholders-text :lines="3" />
    </content-placeholders>
    <div class="list-file-attach" v-show="!isLoading">
      <div class="text-xs-right" v-if="!selectfile && fileAttachItems.length > 0">
        <v-btn icon flat color="indigo"
          class="ma-0" @click="sortAsc = !sortAsc">
          <v-icon v-if="sortAsc">chevron_right</v-icon>
          <v-icon v-else>expand_more</v-icon>
        </v-btn>
      </div>
      <div v-if="selectfile && fileAttachItems.length > 0" class="custome-list-file-attach-with-icon">
        <div></div>
        <v-icon color="primary"
          @click.stop="selectAll = !selectAll"
        >
          {{selectAll? 'check_box' : 'check_box_outline_blank'}}
        </v-icon>
      </div>
      <template v-if="viewType === 'list'">
        
        <div v-for="(fileAttach, index) in fileAttachItems" :key="index"
          class="custome-list-file-attach-with-icon"
        >
          <div @contextmenu.stop="fileAttachContextMenu($event, fileAttach, index)"
            :title="modifiedDateTitle(fileAttach)"
          >
            <v-avatar v-if="fileAttach.source === 'source' || fileAttach.source === ''"
              :size="22"
              color="primary"
              @click.prevent.stop="fileVersionView(fileAttach)"
            >
              <span class="white--text">{{fileAttach.version}}</span>
            </v-avatar>
            <i :class="'fa fa-' + getFileAttachIcon(fileAttach)"></i>
            <span class="pl-1 pr-1"
              v-if="fileAttach.download_loading"
            >
              {{ fileAttach.fileName }}
            </span>
            <span class="pl-1 pr-1"
            @click.stop="viewFile(fileAttach)"
              v-else
            >
              {{ fileAttach.fileName }}
            </span>
            <v-progress-circular
              indeterminate
              color="primary" v-if="fileAttach.download_loading"
              :size="16"
            ></v-progress-circular>
          </div>
          <v-icon color="primary"
            v-if="selectfile && fileAttach.fileSize"
            @click.stop="iconClick(index)"
          >
            {{fileAttach.selected? 'check_box' : 'check_box_outline_blank'}}
          </v-icon>
        </div>
      </template>
      <template v-else>
        <div v-for="(fileAttach, index) in fileAttachItems" :key="index"
          class="custome-list-file-attach-with-icon"
        >
          <div @contextmenu.stop="fileAttachContextMenu($event, fileAttach, index)"
            :title="modifiedDateTitle(fileAttach)"
          >
            <v-avatar v-if="fileAttach.source === 'source' || fileAttach.source === ''"
              :size="22"
              color="primary"
              @click.prevent.stop="fileVersionView(fileAttach)"
            >
              <span class="white--text">{{fileAttach.version || 0}}</span>
            </v-avatar>
            <template v-if="fileAttach.source == 'dropbox'">
              <img v-if="dropboxLinkThumb(fileAttach)"
                :style="'width: ' + thumbnailSize + 'px; height: '+ thumbnailSize + 'px;'"
                :alt="fileAttach.fileName"
                :src="fileAttach.sourceUrl"
              />
              <i v-else class="fa fa-dropbox primary--text" 
                :style="'font-size: ' + thumbnailSize + 'px;'"></i>
            </template>
            <v-icon :size="thumbnailSize" v-else-if="fileAttach.source == 'link'">file_copy</v-icon>
            <img v-else-if="fileAttach.source == 'google'"
              :style="'width: ' + thumbnailSize + 'px; height: '+ thumbnailSize + 'px;'"
              :src="'https://drive.google.com/thumbnail?authuser=0&sz=w' + thumbnailSize + '&id=' + getGoogleFileId(fileAttach)"
            />
            <img v-else-if="fileAttach.thumbnail"
              :style="'width: ' + thumbnailSize + 'px; height: '+ thumbnailSize + 'px;'"
              :alt="fileAttach.fileName"
              :src="fileAttach.thumbnail"
            />
            <v-icon :size="thumbnailSize" color="primary" v-else>file_copy</v-icon>
            <span>{{fileAttach.fileName}}</span>
          </div>
          <v-icon color="primary"
            v-if="selectfile && fileAttach.fileSize"
            @click.stop="iconClick(index)"
          >
            {{fileAttach.selected? 'check_box' : 'check_box_outline_blank'}}
          </v-icon>
        </div>
      </template>
    </div>
    <div @contextmenu.stop="fileAttachContextMenu" style="height: 50px; clear: both;"></div>
    <dia-log 
      :item = "[
        {
          width: '500px',
          model: showDialogRenameFileAttach,
          action: 'renameFileAttachSubmit',
          edit: true,
          label: 'Lưu',
          icon: 'save'
        }
        ]
      "
      :show_button = true
      @closeDialog="(val) => (showDialogRenameFileAttach = val)"
      @renameFileAttachSubmit="renameFileAttachSubmit"
    >
      <template slot="header">
        {{translate('doi_ten_file')}}
      </template>
      <template slot="content">
        <v-form v-model="validFileAttachForm" ref="fileAttachForm" lazy-validation >
          <v-layout wrap >
            <v-flex sm12>
              <v-text-field v-model="fileAttachName"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
              >
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </template>
    </dia-log>
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
          <li v-for="(item, index) in fileAttactListFileVersion" :key="index">
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
  </div>

</template>

<script>
const COMPONENT_NAME = 'mobilink-folder-mgt-file-attachs'
export default {
  name: COMPONENT_NAME,
  components: {
  },
  props: {
    id: {
      default: 1
    },
    focusRef: {
      default: 'fileAttach'
    },
    docFileActived: {
      default: {}
    },
    listDocFileId: {
      default: () => {
        return []
      }
    },
    keywords: '',
    selectfile: {
      default: true
    },
    viewType: {
      default: 'list'
    }
  },
  data () {
    return {
      fileAttachItems: [],
      showDialogRenameFileAttach: false,
      validFileAttachForm: false,
      fileAttachName: '',
      selectAll: false,
      isLoading: false,
      thumbnailSize: 32,
      sortAsc: true,
      fileVersionDialog: false,
      fileAttactListFileVersion: []
    }
  },
  watch: {
    selectAll (val) {
      this.fileAttachItems = this.fileAttachItems.map(function (item) {
        item.selected = item.fileSize ? val : false
        return item
      })
    },
    docFileActived () {
      if (this.docFileActived.docFileId > 0) {
        this.getFileAttachList()
      }
    },
    listDocFileId (val) {
      this.getFileAttachListInFolder()
    },
    sortAsc (val) {
      this.fileAttachItems.reverse()
    },
    fileAttachItemsSelected (val) {
      this.$emit('fileAttactsSelectedToActivity', val)
    }
  },
  computed: {
    fileAttachItemsSelected (val) {
      return this.fileAttachItems.filter(function (item) {
        return item.selected
      })
    }
  },
  created () {
    this.fileAttachActions = [
      {name: this.translate('them_moi'), action: 'addNewDocFile', icon: 'file_copy', enable: false},
      {name: 'Copy', action: 'copyFileAttach', icon: 'file_copy', enable: true},
      {name: 'Paste', action: 'pasteFileAttach', icon: 'file_copy', enable: true},
      {name: this.translate('doi_ten'), action: 'renameFileAttach', icon: 'file_copy', enable: true},
      {name: this.translate('chia_se'), action: 'shareFileAttach', icon: 'file_copy', enable: true},
      {name: this.translate('xoa'), action: 'deleteFileAttach', icon: 'file_copy', enable: true}
    ]
  },
  destroyed () {
    // delete this.id
    // delete this.focusRef
    // delete this.docFileActived
    // delete this.listDocFileId
    // delete this.keywords
    // delete this.selectfile
    // delete this.viewType
    // delete this.fileAttachItems
    // delete this.showDialogRenameFileAttach
    // delete this.validFileAttachForm
    // delete this.fileAttachName
    // delete this.selectAll
    // delete this.isLoading
    // delete this.thumbnailSize
    // delete this.sortAsc
    // delete this.fileVersionDialog
    // delete this.fileAttactListFileVersion
    // delete this.fileAttachItemsSelected
    // delete this.fileAttachActions
    // delete this.keywordsChange
    // delete this.getFileAttachList
    // delete this.getFileAttachListInFolder
    // delete this.getFileAttachListInFolderI
    // delete this.resetCopy
    // delete this.copyFileAttach
    // delete this.pasteFileAttach
    // delete this.renameFileAttach
    // delete this.renameFileAttachSubmit
    // delete this.shareFileAttach
    // delete this.deleteFileAttach
    // delete this.fileAttachContextMenu
    // delete this.iconClick
    // delete this.modifiedDateTitle
    // delete this.getGoogleFileId
    // delete this.dropboxLinkThumb
    // delete this.getFileAttachIcon
    // delete this.viewFile
    // delete this.fileVersionView
    // delete this.downloadReferenceFileVersion
  },
  methods: {
    keywordsChange (keywordsModel, docFileActive, listDocFileId) {
      if (this.docFileActived.docFileId > 0) {
        this.getFileAttachList()
      } else {
        this.getFileAttachListInFolder()
      }
    },
    getFileAttachList () {
      this.fileAttachItems = []
      let url = this.end_point + 'fileattachs/' + this.docFileClassName + '/' + this.docFileActived.docFileId +
        '?order=true&sort=modified_Number&appendix=true&keywords=' + this.keywords
      let vm = this
      vm.isLoading = true
      vm.selectAll = false
      vm.config = {
        headers: {
          'groupId': vm.group_id,
          'Accept': 'application/json'
        }
      }
      window.axios.get(url, vm.config)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.fileAttachItems = serializable.data.map(function (item) {
              item.selected = false
              item.download_loading = false
              return item
            })
          }
          vm.isLoading = false
        })
        .catch(function (error) {
          console.log(error)
          vm.isLoading = false
        })
    },
    getFileAttachListInFolder () {
      this.fileAttachItems = []
      for (let k in this.listDocFileId) {
        let url = this.end_point + 'fileattachs/' + this.docFileClassName + '/' + this.listDocFileId[k] +
          '?order=true&sort=modified_Number&appendix=true&keywords=' + this.keywords
        this.getFileAttachListInFolderI(url, Number(k) === this.listDocFileId.length - 1)
      }
    },
    getFileAttachListInFolderI (url, isLast) {
      let vm = this
      vm.isLoading = true
      vm.config = {
        headers: {
          'groupId': vm.group_id,
          'Accept': 'application/json'
        }
      }
      window.axios.get(url, vm.config)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.fileAttachItems = vm.fileAttachItems.concat(
              serializable.data.map(function (item) {
                item.selected = false
                item.download_loading = false
                return item
              })
            )
          }
          vm.isLoading = false
        })
        .catch(function (error) {
          console.log(error)
          vm.isLoading = false
        })
    },
    resetCopy () {
      this.fileAttachCopy = undefined
    },
    copyFileAttach () {
      this.fileAttachCopy = this.fileAttachSelected
    },
    pasteFileAttach () {
      alert('paste fileattach ' + this.fileAttachCopy.fileName)
      this.fileAttachItems.push(this.fileAttachSelected)
    },
    renameFileAttach () {
      this.fileAttachName = this.fileAttachSelected.fileName
      this.showDialogRenameFileAttach = true
    },
    renameFileAttachSubmit () {
      if (this.validFileAttachForm) {
        let vm = this
        let params = new URLSearchParams()
        params.append('fileName', vm.docFileName)
        let url = vm.end_point + 'fileattachs/' + vm.fileAttachSelected.fileAttachId
        window.axios.put(url, params, vm.apiConfigHeader).then(function (response) {
          vm.showDialogRenameFileAttach = false
          vm.fileAttachItems[vm.fileAttachSelected.index].subject = vm.fileAttachName
          window.showMessageToastr('success', 'Cập nhật thành công')
        })
          .catch(function (error) {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      }
    },
    shareFileAttach () {
      alert('s ' + this.fileAttachSelected.fileName)
    },
    deleteFileAttach () {
      let vm = this
      vm.$dialog.confirm('Bạn chắc chắn xóa file này?', {
        html: true,
        loader: true,
        okText: 'Xác nhận',
        cancelText: 'Quay lại',
        animation: 'fade'
      })
        .then(function (dialog) {
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Xóa dữ liệu...'
          })
          window.axios.delete(vm.end_point + 'fileattachs/' + vm.fileAttachSelected.fileAttachId,
            vm.apiConfigHeader
          )
            .then(function (response) {
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageToastr('success', 'Xóa file thành công')
              vm.fileAttachItems.splice(vm.fileAttachSelected.index, 1)
            })
            .catch(function (error) {
              console.log(error)
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
          dialog.close()
          return false
        })
        .catch(function (e) {
          console.log(e)
        })
    },
    fileAttachContextMenu (jsEvent, fileAttach, index) {
      jsEvent.preventDefault()
      if (fileAttach) {
        this.fileAttachSelected = fileAttach
        this.fileAttachSelected.index = index
        this.fileAttachActions[1].enable = true
        this.fileAttachActions[2].enable = false
        this.fileAttachActions[3].enable = fileAttach.permission === 'owner' || true
        this.fileAttachActions[4].enable = fileAttach.permission === 'owner' || true
        this.fileAttachActions[5].enable = fileAttach.permission === 'owner' || true
      } else {
        this.fileAttachActions[1].enable = false
        this.fileAttachActions[2].enable = this.fileAttachCopy !== undefined && this.docFileActived.docFileId > 0
        this.fileAttachActions[3].enable = false
        this.fileAttachActions[4].enable = false
        this.fileAttachActions[5].enable = false
      }
      this.$nextTick(() => {
        this.$emit('openmenuaction', this.fileAttachActions, jsEvent, this.focusRef)
      })
    },
    iconClick (index) {
      this.fileAttachItems[index].selected = !this.fileAttachItems[index].selected
    },
    modifiedDateTitle (fileAttach) {
      let vm = this
      let rs = (window.moment(fileAttach.createDate).format(vm.localeDateProperties.dateTimeMomentPattern) ===
          window.moment(fileAttach.modifiedDate).format(vm.localeDateProperties.dateTimeMomentPattern) ? 'Ngày tạo ' : 'Ngày sửa '
      ) +
        (window.moment(fileAttach.modifiedDate).format(vm.localeDateProperties.dateTimeMomentPattern))
      return 'Tạo bởi: ' + (fileAttach.fullName || fileAttach.fullname || fileAttach.userName || '') + ', ' + rs
    },
    getGoogleFileId (fileAttach) {
      try {
        let srcSpl = fileAttach.sourceUrl.split('/d/')
        srcSpl = srcSpl[1].split('/')
        return srcSpl[0]
      } catch (error) {
        console.log(error)
        return ''
      }
    },
    dropboxLinkThumb (fileAttach) {
      let link = fileAttach.sourceUrl.toUpperCase()
      link = link.split('.')
      link = link[link.length - 1]
      let check = 'JPG, JPEG, TIF, PNG, GIF'
      if (check.indexOf(link) >= 0) {
        return true
      } else {
        return false
      }
    },
    getFileAttachIcon (fileAttach) {
      let fileExtend = fileAttach.sourceUrl.toUpperCase()
      fileExtend = fileExtend.split('.')
      fileExtend = fileExtend[fileExtend.length - 1]
      if ('JPG, JPEG, TIF, PNG, GIF'.indexOf(fileExtend) >= 0) {
        return 'file-image-o'
      } else if ('PPT, PPTX'.indexOf(fileExtend) >= 0) {
        return 'file-pdf-o'
      } else if ('PDF'.indexOf(fileExtend) >= 0) {
        return 'file-pdf-o'
      } else if ('PSD'.indexOf(fileExtend) >= 0) {
        return 'file'
      } else if ('DOC, DOCX'.indexOf(fileExtend) >= 0) {
        return 'file-word-o'
      } else if ('XLS, XLSX'.indexOf(fileExtend) >= 0) {
        return 'file-excel-o'
      } else if ('3GP, ASF, AVI, MOV, MP4, MPEDG, RM, VOB, WMV'.indexOf(fileExtend) >= 0) {
        return 'file-video-o'
      } else if ('PCM, FLAC, EAAC+, LOSSLESS, MP3'.indexOf(fileExtend) >= 0) {
        return 'file-audio-o'
      } else {
        return 'file-archive-o'
      }
    },
    viewFile: function (item) {
      let vm = this
      item['download_loading'] = true
      let onsuccess = function () {
        item['download_loading'] = false
      }
      let onerror = function (error) {
        item['download_loading'] = false
        console.log(error)
      }
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
    fileVersionView: function (item) {
      let vm = this
      vm.fileVersionDialog = !vm.fileVersionDialog
      const config = {
        headers: {
          'groupId': vm.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      vm.fileAttactListFileVersion = []
      vm.fileAttachIdTemp = 0
      window.axios.get(vm.end_point + 'fileattachs' + '/' + item.fileAttachId + '/versions', config)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.fileAttactListFileVersion = serializable.data
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
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Đang tải dữ liệu...'
      })
      window.axios.get(vm.end_point + 'fileattachs' + '/' + vm.fileAttachIdTemp + '/' + item.version + '.0', config).then(function (response) {
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
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
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          console.log(error)
        })
    }
  }
}
</script>
<style scoped>
  .custome-list-file-attach-with-icon {
      display: -webkit-flex; /* Safari */
      -webkit-align-items: center; /* Safari 7.0+ */
      display: flex;
      align-items: center;
      cursor: pointer;
      margin: 5px;
      padding: 5px;
  }
  .custome-list-file-attach-with-icon div {
     -webkit-flex: 1; /* Safari 6.1+ */
     flex: 1;
  }
  .list-file-attach-component .icon {
    cursor: pointer;
  }
</style>

