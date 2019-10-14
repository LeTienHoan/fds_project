<template>
    <div v-if="isReadly">
      <div class="mb-2">
        <mbl-expand-panel
        :ownExpanded='true'
        :leftactions="[
          {
            icon: 'bookmark_border'
          }
        ]">
          <template slot="title-name">
            <div class="layout align-center">
              Tệp chính thức <span style="text-transform: initial; color: #cccccc" class="ml-2" @click.stop="downloadAll(true)">(Tải xuống)</span>
              <uploader :options="options" class="uploader-example">
                  <uploader-unsupport></uploader-unsupport>
                  <uploader-list 
                      :id="class_pk + '1'"
                      view-id='DOCS'
                      :class_name="class_name"
                      :class_pk="class_pk"
                      :file_attach_api="end_point + 'fileattachs'"
                      :resourceusers_get_api="end_point + 'resourceusers'"
                      extensions_upload="true"
                      :permission="permission"
                      :appendix="true"
                      :edit_online_key="serviceEditorCode"
                      :showlist="false"
                      :mbl_attach="true"
                  ></uploader-list>
              </uploader>
            </div>
          </template>
          <template slot="card-text-container">
            <div class="flex" :class="{'order-lg1': true}">
              <v-layout wrap v-if="document1 == 0">
                <v-flex xs12 class="text-xs-center" style="color: #ccc">
                  <v-icon style="font-size: 26px!important">assignment</v-icon>
                  <br>
                  Không có tệp chính thức nào
                </v-flex>
              </v-layout>
              <list-file-attach
                :id="class_pk + '1'"
                :permission="permission"
                :mbl_attach="true"
              ></list-file-attach>
            </div>
          </template>
        </mbl-expand-panel>
      </div>
      <div>
        <mbl-expand-panel
        :ownExpanded='true'
        :leftactions="[
          {
            icon: 'bookmark_border'
          }
        ]">
          <template slot="title-name">
            <div class="layout align-center">
              Tệp đính kèm <span style="text-transform: initial; color: #cccccc" class="ml-2" @click.stop="downloadAll(false)">(Tải xuống)</span>
              <uploader :options="appendixOptions" class="uploader-example">
                  <uploader-unsupport></uploader-unsupport>
                  <uploader-list 
                      :id="class_pk + '2'"
                      view-id='DOCS'
                      :class_name="class_name"
                      :class_pk="class_pk"
                      :file_attach_api="end_point + 'fileattachs'"
                      :resourceusers_get_api="end_point + 'resourceusers'"
                      extensions_upload="true"
                      :permission="permission"
                      :appendix="false"
                      :edit_online_key="serviceEditorCode"
                      :showlist="false"
                      :mbl_attach="true"
                  ></uploader-list>
              </uploader>
            </div>
          </template>
          <template slot="card-text-container">
            <div class="flex" :class="{'order-lg1': true}">
              <v-layout wrap v-if="document2 == 0">
                <v-flex xs12 class="text-xs-center" style="color: #ccc">
                  <v-icon style="font-size: 26px!important">assignment</v-icon>
                  <br>
                  Không có tệp đính kèm nào
                </v-flex>
              </v-layout>
              <list-file-attach
                :id="class_pk + '2'"
                :permission="permission"
                :mbl_attach="true"
              ></list-file-attach>
            </div>
          </template>
        </mbl-expand-panel>
      </div>
        
    </div>
</template>

<!-- <script type="text/javascript" src="https://apis.google.com/js/api.js?onload=onApiLoad"></script> -->
<!--<script type="text/javascript"
src="https://www.dropbox.com/static/api/2/dropins.js"
id="dropboxjs"
data-app-key="${(Request.dropboxDeveloperKey)!}">
</script>
-->
<script>
import { EventBus } from '@/eventbus'
import ListFileAttach from './list_file_attach'
const COMPONENT_NAME = 'jx-mobilink-activity-document'
export default {
  name: COMPONENT_NAME,
  components: {
    ListFileAttach
  },
  props: {
    class_pk: null,
    class_name: null,
    permission: null
  },
  watch: {
    id (val) {
    }
  },
  data () {
    return {
      options: {
      },
      appendixOptions: {
      },
      isReadly: false,
      document1: 0,
      document2: 0
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      EventBus.$on('on_attach_change' + vm.class_pk + '1', function (val) {
        vm.document1 = val.length
      })
      EventBus.$on('on_attach_change' + vm.class_pk + '2', function (val) {
        vm.document2 = val.length
      })
      vm.options = {
        target: vm.end_point + 'fileattachs/upload',
        chunkSize: 500 * 1024 * 1024,
        fileMaxSize: Number(this.MSystemConfiguration.configuration.fileattach.maxfilesize || 1024),
        fileType: this.MSystemConfiguration.configuration.fileattach.fileextensions || 'NONE',
        headers: {
          groupId: vm.group_id,
          appendix: true
        },
        allowDuplicateUploads: true
      }
      vm.appendixOptions = {
        target: vm.end_point + 'fileattachs/upload',
        chunkSize: 500 * 1024 * 1024,
        fileMaxSize: Number(this.MSystemConfiguration.configuration.fileattach.maxfilesize || 1024),
        fileType: this.MSystemConfiguration.configuration.fileattach.fileextensions || 'NONE',
        headers: {
          groupId: vm.group_id,
          appendix: false
        },
        allowDuplicateUploads: true
      }
      vm.options.target = vm.end_point + 'fileattachs/upload/' + vm.class_name + '/' + vm.class_pk + '/' + vm.group_id
      vm.appendixOptions.target = vm.end_point + 'fileattachs/upload/' + vm.class_name + '/' + vm.class_pk + '/' + vm.group_id
      vm.isReadly = true
    })
  },
  destroyed () {
    let vm = this
    EventBus.$off('on_attach_change' + vm.class_pk + '1')
    EventBus.$off('on_attach_change' + vm.class_pk + '2')
  },
  methods: {
    downloadAll (bool) {
      let vm = this
      let config = {
        params: {
          'appendix': bool
        },
        headers: {
          'groupId': vm.group_id,
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/octet-stream'
        },
        responseType: 'arraybuffer'
      }
      let url = vm.end_point + 'fileattachs/' + vm.activityClassName + '/' + vm.class_pk + '/download'
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Đang tải dữ liệu...'
      })
      window.axios.get(url, config).then(function (response) {
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        let blob = new Blob([response.data], { type: 'application/zip' })
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob)
        } else {
          let fileURL = URL.createObjectURL(blob)
          let newWin = window.open(fileURL)
          newWin.focus()
          // newWin.reload(true)
        }
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
   
</style>