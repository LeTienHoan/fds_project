<template>
  <div v-if="isReadly">
    <mbl-expand-panel
    :ownExpanded='true'
    :leftactions="[
      {
        icon: 'bookmark_border'
      }
    ]">
      <template slot="title-name">
        <div class="layout align-center">
          File đính kèm ({{ document1 }})
          <uploader :options="options" class="uploader-example">
              <uploader-unsupport></uploader-unsupport>
              <uploader-list 
                  :id="class_pk + 'docfileattachfile1'"
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
                  :mbl_attach="false"
              ></uploader-list>
          </uploader>
        </div>
      </template>
      <template slot="card-text-container">
        <div class="flex" :class="{'order-lg1': true}">
          <list-file-attach
            :id="class_pk + 'docfileattachfile1'"
            :permission="permission"
          ></list-file-attach>
        </div>
      </template>
    </mbl-expand-panel>
    
  </div>
</template>
<!--
<script type="text/javascript" src="http://apis.google.com/js/api.js?onload=onApiLoad"></script>
<script type="text/javascript"
src="https://www.dropbox.com/static/api/2/dropins.js"
id="dropboxjs"
data-app-key="${(Request.dropboxDeveloperKey)!}">
</script>
-->
<script>
import { EventBus } from '@/eventbus'
import ListFileAttach from '@/components/task/list_file_attach'
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
      isReadly: false,
      document1: 0
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      EventBus.$on('on_attach_change' + vm.class_pk + 'docfileattachfile1', function (val) {
        vm.document1 = val.length
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
      vm.options.target = vm.end_point + 'fileattachs/upload/' + vm.class_name + '/' + vm.class_pk + '/' + vm.group_id
      vm.isReadly = true
    })
  },
  destroyed () {
    EventBus.$off('on_attach_change' + this.class_pk + 'docfileattachfile1')
    // delete this.id
    // delete this.class_pk
    // delete this.class_name
    // delete this.permission
    // delete this.options
    // delete this.isReadly
    // delete this.document1
  },
  methods: {
  }
}
</script>

<style scoped>
   
</style>