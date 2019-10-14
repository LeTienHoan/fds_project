<template>

  <div class="list-docfile-component">
    <content-placeholders v-show="isLoading">
      <content-placeholders-text :lines="3" />
    </content-placeholders>

    <div class="list-docFile" v-show="workspaceActived.id>0 && !isLoading">
      <div class="list-docfile-content" :class="'itemxx' + docFile.docFileId"
        v-for="(docFile, index) in docFileItems"
        :key="index"
        @contextmenu.stop="docFileContextMenu($event, docFile, index)"
         @click="docFileActive(docFile)"
        :title="modifiedDateTitle(docFile)"
      >
        <div class="">
          <v-icon>description</v-icon>
          <span>{{ docFile.subject }}</span>
          <v-icon
            v-if="selectdocfile"
            :title="'Lưu vào ' + docFile.subject"
            @click.stop="saveToDocFile(docFile)"
          >check</v-icon>
        </div>
      </div>
    </div>
    <div @contextmenu.stop="docFileContextMenu" style="height: 50px; clear: both;"></div>
    <dia-log 
      :item = "[
        {
          width: '500px',
          model: showDialogRenameDocFile,
          action: 'renameDocFileSubmit',
          edit: true,
          label: 'Lưu',
          icon: 'save'
        }
        ]
      "
      :show_button = true
      @closeDialog="(val) => (showDialogRenameDocFile = val)"
      @renameDocFileSubmit="renameDocFileSubmit"
    >
      <template slot="header">
        {{translate('doi_ten_van_ban')}}
      </template>
      <template slot="content">
        <v-form v-model="validDocFileForm" ref="docFileForm" lazy-validation >
          <v-layout wrap >
            <v-flex sm12>
              <v-text-field v-model="docFileName"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
              >
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </template>
    </dia-log>
    <JxMobilinkShared v-if="docFileSelected.docFileId"
      :visibilities_api="end_point + 'visibilities'"
      :resourceworkspace_get_api="end_point + 'resourceworkspaces'"
      :resourceroles_get_api="end_point + 'resourceroles'"
      :resourceusers_get_api="end_point + 'resourceusers'"
      :changelogs_get_api="end_point + 'changelogs'"
      :class_name="docFileClassName"
      :class_pk="docFileSelected.docFileId"
      :permission="docFileSelected.permission"
      :only_slot_btn="true"
      ref="mobilinkshare"
    >
      <template slot="slot_btn">
        <!-- comment share action @click.stop="shareActivity(scope.row)" -->
        <div></div>
      </template>
    </JxMobilinkShared>
    <dia-log 
      :item = "[
        {
          width: '900px',
          model: dialogAddNewDocFile,
          action: 'saveDialog1',
          edit: true,
          label: 'Lưu và thoát',
          icon: 'save'
        },
        {
          width: '900px',
          model: dialogAddNewDocFile,
          action: 'saveDialog2',
          edit: true,
          label: 'Lưu và thêm mới',
          icon: 'save'
        }
        ]
      "
      :show_button = true
      @closeDialog="(val) => (dialogAddNewDocFile = val)"
      @saveDialog1="submitSaveAndExit"
      @saveDialog2="submitSaveAndAddNew"
    >
      <template slot="header">
        {{translate('them_moi_tai_lieu')}}
      </template>
      <template slot="content">
        <AddDocFile 
        ref='addDocFileRef'
        :workspace_cur="workspaceActived"
        :workspaceAddItems="workspaceActived && workspaceActived.workspaceId ? [workspaceActived] : parentWorkspaceItems"
        @call-back="showDetailDocFileOwn"
        >
          
        </AddDocFile>
      </template>
    </dia-log>
  </div>

</template>

<script>
import AddDocFile from '../docfile/AddDocFile'
import JxMobilinkShared from '@/components/task/mobilink_shared.vue'

const COMPONENT_NAME = 'mobilink-folder-mgt-file-attachs'
export default {
  name: COMPONENT_NAME,
  components: {
    AddDocFile, JxMobilinkShared
  },
  props: {
    id: {
      default: 1
    },
    focusRef: {
      default: 'docFile'
    },
    workspaceActived: {
      default: {}
    },
    workspaceItems: {
      default: () => []
    },
    selectdocfile: {
      default: true
    }
  },
  data () {
    return {
      showDialogRenameDocFile: false,
      validDocFileForm: false,
      docFileName: '',
      isLoading: false,
      docFileSelected: {},
      docFileDetail: {},
      docFileActived: {},
      dialogAddNewDocFile: false
    }
  },
  created () {
    this.docFileActions = [
      {name: this.translate('them_moi'), action: 'addNewDocFile', icon: 'file_copy', enable: true},
      {name: 'Copy', action: 'copyDocFile', icon: 'file_copy', enable: true},
      {name: 'Paste', action: 'pasteDocFile', icon: 'file_copy', enable: true},
      {name: this.translate('doi_ten'), action: 'renameDocFile', icon: 'file_copy', enable: true},
      {name: this.translate('chia_se'), action: 'shareDocFile', icon: 'file_copy', enable: true},
      {name: this.translate('xoa'), action: 'deleteDocFile', icon: 'file_copy', enable: true},
      {name: this.translate('chi_tiet'), action: 'showDetailDocFileOwn', icon: 'file_copy', enable: true}
    ]
  },
  destroyed () {
    // delete this.id
    // delete this.focusRef
    // delete this.workspaceActived
    // delete this.workspaceItems
    // delete this.selectdocfile
    // delete this.showDialogRenameDocFile
    // delete this.validDocFileForm
    // delete this.docFileName
    // delete this.isLoading
    // delete this.docFileSelected
    // delete this.docFileDetail
    // delete this.docFileActived
    // delete this.dialogAddNewDocFile
    // delete this.parentWorkspaceItems
    // delete this.docFileItems
    // delete this.submitSaveAndExit
    // delete this.submitSaveAndAddNew
    // delete this.getDocFileSList
    // delete this.addNewDocFile
    // delete this.resetCopy
    // delete this.copyDocFile
    // delete this.pasteDocFile
    // delete this.renameDocFile
    // delete this.renameDocFileSubmit
    // delete this.shareDocFile
    // delete this.deleteDocFile
    // delete this.showDetailDocFileOwn
    // delete this.docFileActive
    // delete this.docFileContextMenu
    // delete this.modifiedDateTitle
    // delete this.saveToDocFile
  },
  watch: {
    workspaceActived () {
      this.getDocFileSList()
    },
    docFileItems () {
      this.$emit('listDocFileId', this.docFileItems.map(function (item) {
        return item.docFileId
      }))
    }
  },
  computed: {
    parentWorkspaceItems () {
      return this.workspaceItems.filter(item => item.editable)
    },
    docFileItems () {
      return this.$store.getters['docFile/docFileItems']
    }
  },
  methods: {
    submitSaveAndExit () {
      this.saveAndExit = true
      this.$refs.addDocFileRef.saveAndExit()
    },
    submitSaveAndAddNew () {
      this.saveAndExit = false
      this.$refs.addDocFileRef.saveAndAddNew()
    },
    getDocFileSList () {
      let vm = this
      vm.isLoading = true
      let queries = {
        sort: 'createDate',
        order: true,
        workspace: this.workspaceActived.workspaceId
      }
      vm.$store.dispatch('docFile/getDocFileItems', queries
      ).then(response => {
        vm.docFileActived = {}
        vm.isLoading = false
      }, error => {
        console.log(error)
        vm.isLoading = false
        window.showMessageByAPICode(error.response.status, error.response.data)
      })
    },
    addNewDocFile (emit) {
      // this.$refs.AddDocFileRef.addEmit = emit === true ? emit : false
      // this.$refs.AddDocFileRef.dialogAddDocFile = true
      this.dialogAddNewDocFile = true
    },
    resetCopy () {
      this.docFileCopy = undefined
    },
    copyDocFile () {
      this.docFileCopy = this.docFileSelected
    },
    pasteDocFile () {
      alert('paste docFile' + this.docFileCopy.subject)
    },
    renameDocFile () {
      this.docFileName = this.docFileSelected.subject
      this.showDialogRenameDocFile = true
    },
    renameDocFileSubmit () {
      if (this.validDocFileForm) {
        let vm = this
        vm.$store.dispatch('docFile/updateDocFile', {
          subject: vm.docFileName,
          docFileId: vm.docFileSelected.docFileId
        }).then(response => {
          vm.showDialogRenameDocFile = false
          window.showMessageToastr('success', 'Cập nhật thành công')
          vm.isLoading = false
        }, error => {
          console.log(error)
          vm.isLoading = false
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
      }
    },
    shareDocFile () {
      setTimeout(() => {
        this.$refs['mobilinkshare'].sharedDialogFunc()
      }, 100)
    },
    deleteDocFile () {
      let vm = this
      vm.$dialog.confirm('Bạn chắc chắn xóa văn bản này?', {
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
          vm.$store.dispatch('docFile/deleteDocFile',
            vm.docFileSelected.docFileId
          ).then(response => {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageToastr('success', 'Xóa văn bản thành công')
            vm.isLoading = false
          }, error => {
            console.log(error)
            vm.isLoading = false
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
    showDetailDocFileOwn (docFile, addNew) {
      if (docFile) {
        this.docFileDetail = docFile
      } else {
        this.docFileDetail = this.docFileSelected
      }
      if (!addNew) {
        this.dialogAddNewDocFile = false
        this.$emit('showDetailDocFile', true, this.docFileDetail)
      }
    },
    docFileActive (docFile) {
      window.$('.list-docfile-content').removeClass('active')
      window.$('.list-docfile-content.itemxx' + docFile.docFileId).addClass('active')
      this.docFileActived = docFile
      this.$emit('docFileActive', docFile)
    },
    docFileContextMenu (jsEvent, docFile, index) {
      jsEvent.preventDefault()
      if (docFile) {
        this.docFileSelected = docFile
        this.docFileSelected.index = index
        this.docFileActions[1].enable = true
        this.docFileActions[2].enable = false
        this.docFileActions[3].enable = docFile.permission === 'owner' || true
        this.docFileActions[4].enable = docFile.permission === 'owner' || true
        this.docFileActions[5].enable = docFile.permission === 'owner' || true
        this.docFileActions[6].enable = true
      } else {
        this.docFileActions[1].enable = false
        this.docFileActions[2].enable = this.docFileCopy !== undefined
        this.docFileActions[3].enable = false
        this.docFileActions[4].enable = false
        this.docFileActions[5].enable = false
        this.docFileActions[6].enable = false
      }
      this.$nextTick(() => {
        this.$emit('openmenuaction', this.docFileActions, jsEvent, this.focusRef)
      })
    },
    modifiedDateTitle (docFile) {
      let vm = this
      let rs = (window.moment(docFile.createDate).format(vm.localeDateProperties.dateTimeMomentPattern) ===
          window.moment(docFile.modifiedDate).format(vm.localeDateProperties.dateTimeMomentPattern) ? 'Ngày tạo ' : 'Ngày sửa '
      ) +
        (window.moment(docFile.modifiedDate).format(vm.localeDateProperties.dateTimeMomentPattern))
      return 'Tạo bởi: ' + (docFile.userName || '') + ', ' + rs
    },
    saveToDocFile (docFile) {
      this.$emit('saveToDocFile', docFile)
    }
  }
}
</script>
<style lang="scss" scoped>
.list-docfile-component{
  .list-docFile {
    .list-docfile-content {
      display: table-cell;
      float: left;
      margin: 5px;
      padding: 5px;
      border: 1px solid #ccc;
      cursor: pointer;
      &:hover {
        color: #039be5;
      }
    }.active {
      border: 1px solid #039be5;
      color: #039be5;
    }
  }
}

</style>

