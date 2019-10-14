<template>

<div class="folder-mgt-component">
  <v-scale-transition>
    <template v-if="screenShowDetail && detailDocFile">
      <DetailDocFile :id="detailDocFile.docFileId"
        @showDetailDocFile="showDetailDocFile"
      />
    </template>
  </v-scale-transition>
  <v-fade-transition>
    <v-app v-show="!screenShowDetail">
      <div class="custome-toolbar d-flex white"
        :class="{'selectfile___': selectfile, 'selectdocfile___': selectdocfile}"
      >
        <v-btn v-if="!(selectfile || selectdocfile)" icon @click.stop="preFolder">
          <v-icon dark>arrow_back</v-icon>
        </v-btn>
      
        <div class="head-name" v-if="!(selectfile || selectdocfile) && workspaceActived.id>0">
          <v-icon>folder_open</v-icon>
          {{workspaceActived.name}}
        </div>
        <div class="head-name" v-else-if="!(selectfile || selectdocfile)">
          {{translate('quan_ly_thu_muc')}}
        </div>

        <v-spacer v-if="!(selectfile || selectdocfile)"></v-spacer>
        <v-btn v-if="!(selectfile || selectdocfile)" icon @click.stop="nextFolder"
          :disabled="!nextFolderEnable"
        >
          <v-icon dark>arrow_forward</v-icon>
        </v-btn>
        <v-btn-toggle v-model="viewType" mandatory
          v-if="!(selectfile || selectdocfile)"
        >
          <v-btn
            flat color="primary" value="thumbnail"
          >
            <v-icon>view_column</v-icon>
          </v-btn>
          <v-btn
            flat color="primary" value="list"
          >
            <v-icon>list</v-icon>
          </v-btn>
        </v-btn-toggle>
        <v-text-field
          v-model="keywordsModel"
          append-icon="search"
          :placeholder="translate('nhap_tu_khoa_tim_kiem')"
          :append-icon-cb="($event) => (keywordsChange($event))"
          v-on:keyup.enter="keywordsChange"
          @change="keywordsChange"
        ></v-text-field>
        <v-btn icon v-if="!(selectfile || selectdocfile)">
          <v-icon>filter_list</v-icon>
        </v-btn>
        <v-menu
          :nudge-top="appNudgeTop"
          :nudge-left="appNudgeLeft"  
          transition="scale-transition"
          offset-y
        >
          <v-btn
            slot="activator"
            color="primary"
            dark
          >
            Thêm mới
          </v-btn>
          <v-list>
            <v-list-tile
              @click="dialogAddWorkspaceOpen"
            >
              <v-list-tile-title>Thư mục</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              @click="dialogAddDocFileOpen"
            >
              <v-list-tile-title>Tài liệu</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
      <div class="">
        <MoveLayout>
          <template slot="left">
            <ListWorkspace
              :id="'foldermgt' + id"
              :ref="refsList[0]"
              :focusRef="refsList[0]"
              @workspaceActive="workspaceActive"
              @openmenuaction="openmenuaction"
              @workspacesMaped="(workspacesMaped) => (workspaceItems = workspacesMaped)"
            />
          </template>
          <template slot="center">
            <ListDocFile
              :id="'foldermgt' + id"
              :ref="refsList[1]"
              :focusRef="refsList[1]"
              @docFileActive="docFileActive"
              @openmenuaction="openmenuaction"
              @listDocFileId="(val) => (listDocFileId = val)"
              :workspaceActived="workspaceActived"
              :workspaceItems="workspaceItems"
              v-show="workspaceActived.id>0"
              @showDetailDocFile="showDetailDocFile"
              @saveToDocFile="saveToDocFile"
              :selectdocfile="selectdocfile"
            />
          </template>
          <template slot="right">
            <ListFileAttach
              :id="'foldermgt' + id"
              :ref="refsList[2]"
              :focusRef="refsList[2]"
              @openmenuaction="openmenuaction"
              @fileAttactsSelectedToActivity="fileAttactsSelectedToActivity"
              :docFileActived="docFileActived"
              :listDocFileId="listDocFileId"
              :selectfile="selectfile"
              :keywords="keywordsModel"
              :viewType="viewType"
            />
          </template>
        </MoveLayout>
      </div>
      <v-menu
        v-if="!(selectfile || selectdocfile)"
        v-model="showMenucontextMenuActions"
        :position-x="showMenucontextMenuActionsx"
        :position-y="showMenucontextMenuActionsy - appNudgeLeft"
        content-class="tree-menu-actions-menu"
        :nudge-top="appNudgeTop"
        :nudge-left="appNudgeLeft"
        absolute
        offset-y
      >
        <v-list>
          <v-list-tile
            v-for="(action, index) in contextMenuActions" :key="index"
            @click.stop="actionClick(action)"
            :class="{'disable': !action.enable}">
            <v-list-tile-title>{{ action.name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-app>
  </v-fade-transition>
</div>

</template>

<script>
import MoveLayout from './task_comp/MoveLayout'
import ListWorkspace from './folder_mgt/ListWorkspace'
import ListFileAttach from './folder_mgt/ListFileAttach'
import ListDocFile from './folder_mgt/ListDocFile'
import DetailDocFile from './folder_mgt/DetailDocFile'

const COMPONENT_NAME = 'mobilink-folder-mgt'
export default {
  name: COMPONENT_NAME,
  components: {
    MoveLayout,
    ListWorkspace,
    ListFileAttach,
    ListDocFile,
    DetailDocFile
  },
  props: {
    id: {
      default: 1
    },
    selectfile: {
      default: true
    },
    selectdocfile: {
      default: true
    }
  },
  data () {
    return {
      contextMenuActions: [],
      showMenucontextMenuActions: false,
      showMenucontextMenuActionsx: 0,
      showMenucontextMenuActionsy: 0,
      workspaceActived: {},
      docFileActived: {},
      refsList: ['workspace', 'docFile', 'fileAttach'],
      viewType: 'list',
      nextFolderEnable: false,
      keywordsModel: '',
      listDocFileId: [],
      workspaceItems: [],
      screenShowDetail: false,
      detailDocFile: {}
    }
  },
  created () {
  },
  methods: {
    workspaceActive (workspace) {
      this.workspaceActived = workspace
      this.docFileActived = {}
      this.keywordsModel = ''
      if (this.setNextFolderEnable) {
        this.setNextFolderEnable = false
        this.nextFolderEnable = true
      }
    },
    docFileActive (docFile) {
      this.docFileActived = docFile
    },
    fileAttactsSelectedToActivity (filesAttach) {
      // alert('Copy to activity: ' + filesAttach.length + ' files')
      this.$emit('copyFileAttachToRefClassName', filesAttach)
    },
    saveToDocFile (docFile) {
      this.$emit('copyFileAttachRefClassNameToDocFile', docFile)
    },
    openmenuaction (actions, jsEvent, focusRef) {
      this.focusRef = focusRef
      this.showMenucontextMenuActions = false
      this.contextMenuActions = actions
      this.showMenucontextMenuActionsx = jsEvent.clientX
      this.showMenucontextMenuActionsy = jsEvent.clientY
      this.$nextTick(() => {
        this.showMenucontextMenuActions = true
      })
    },
    actionClick (action) {
      if (action.enable) {
        let vm = this
        vm.$refs[vm.focusRef][action.action]()
        for (let key in this.refsList) {
          let refer = this.refsList[key]
          if (refer !== vm.focusRef) {
            vm.$refs[refer]['resetCopy']()
          }
        }
        this.showMenucontextMenuActions = false
      } else {
        this.showMenucontextMenuActions = true
      }
    },
    keywordsChange (jsEvent) {
      if (jsEvent) {
        jsEvent.preventDefault()
      }
      this.$refs[this.refsList[2]]['keywordsChange'](this.keywordsModel, this.docFileActive, this.listDocFileId)
    },
    nextFolder () {
      console.log('chua lam')
    },
    preFolder () {
      console.log('chua lam')
    },
    dialogAddWorkspaceOpen () {
      this.$refs[this.refsList[0]]['addNewWorkspace'](true)
    },
    dialogAddDocFileOpen () {
      this.$refs['docFile']['addNewDocFile'](true)
    },
    showDetailDocFile (stt, docFile) {
      if (!this.selectfile || !this.selectdocfile) {
        this.screenShowDetail = stt && !(this.selectfile || this.selectdocfile)
        this.detailDocFile = docFile
      }
    }
  }
}
</script>
<style lang="scss">
.custome-toolbar {
  align-items: center;
}
.tree-menu-actions-menu {
  .disable {
    color: #ccc;
    a {
      cursor: not-allowed;
    }
  }
  a {
    text-decoration: none;
  }
}
.folder-mgt-custome-tollbar {
  display: flex;
  align-items: center;
  min-height: 55px;
  padding: 10px;
}
.custome-toolbar {
  #left {
    overflow: auto;
  }
}
</style>

