<template>
  <div>
    <mbl-expand-panel
      :leftactions="[
        {
          icon: ''
        }
      ]"
      :ownExpanded=true
    >
      <template slot="title-name">
        <custome-editable
          type="text"
          :text_options = "{
            text: tempNewsBoard.title,
            multiline: false
          }"
          :api_update="end_point + 'newsboards/' + newsBoard.newsBoardId"
          key_update="title"
          @update-success="updateEditableSuccess"
          :permission="tempNewsBoard.permission"
        >
        </custome-editable>
        <div>
          <span class="grey--text">
            {{tempNewsBoard.userName}} - {{newsBoard.modifiedDate | date}}
          </span>
          <span class="right red--text" style="text-transform: none;">
            Khẩn
          </span>
        </div>
      </template>
      <template slot="card-text-container">
        <v-layout wrap class="">
          <v-flex sm2 class="label_align">
            {{translate('thu_muc')}}
          </v-flex>
          <v-flex sm10>
            <custome-editable
              class="control_class"
              type="multiselect"
              :multi_select_options = "{
                usetemp: true,
                api_get: end_point + 'workspaces/scope/newsboard?start=-1&end=-1',
                init_value: 'workspaceId',
                init_text: 'workspaceName',
                key_value: 'workspaceId',
                key_text: 'name',
                param_update_work: true,
                class_name: newsBoardClassName,
                class_pk: newsBoard.newsBoardId,
                item_workspace: newsBoard.workspaces.length > 0 && newsBoard.workspaces[0].workspaceId != 0 ? newsBoard.workspaces : [],
                resource: resourceItems2
              }"
              @get-resource="(val) => (resourceItems2 = val)"
              :api_update="end_point + 'resourceworkspaces/update'"
              :permission="tempNewsBoard.permission"
            >
            </custome-editable>
          </v-flex>
          <v-flex xs12 sm2 class="label_align">
            {{translate('the_nhan')}}
          </v-flex>
          <v-flex xs12 sm10>
            <custome-editable
              class="control_class"
              type="multiselect"
              :multi_select_options = "{
                usetemp: true,
                api_get: end_point + 'resourcetags?start=-1&end=-1',
                api_get_muti_select: end_point + 'resourcetags/' + newsBoardClassName + '/' + newsBoard.newsBoardId + '?start=-1&end=-1',
                init_value: 'resourceTagId',
                init_text: 'tag',
                key_value: 'resourceTagId',
                key_text: 'tag',
                param_update_tag: true,
                class_name: newsBoardClassName,
                class_pk: newsBoard.newsBoardId,
                resource: resourceItems1
              }"
              @get-resource="(val) => (resourceItems1 = val)"
              :api_update="end_point + 'resourcetags/pack'"
              :permission="tempNewsBoard.permission"
            >
            </custome-editable>
          </v-flex>

          <!-- 
            <v-flex xs12 sm12 class="control_class">
              <div class="custome-editable-with-icon-newsboard">
                <div>
                  <span v-if="description_hidden" class="hiddenEditor editable__content__value">
                    <vue-editor
                      id="newsBoardEditField1"
                      v-model="tempNewsBoard.content"
                      disabled
                    >
                    </vue-editor>
                    <div v-if="tempNewsBoard.newsType ==='QNA' && tempNewsBoard.answer">
                      <b class="grey--text"><i>Trả lời: </i></b>{{tempNewsBoard.answer || ''}}
                    </div>
                  </span>
                  <vue-editor
                    id="newsBoardEditField2"
                    class="flex sm12"
                    v-model="tempNewsBoard.content"
                    v-if="!description_hidden && hasPermission"
                  >
                  </vue-editor>
                  <v-text-field
                    v-if="!description_hidden && hasPermission && (tempNewsBoard.newsType ==='QNA')"
                    placeholder="Trả lời"
                    class="flex sm12"
                    v-model="tempNewsBoard.answer"
                  ></v-text-field>
                </div>
                <span> 
                  <v-btn flat icon class="btn--editable btn--editable--done mx-0 my-0" color="grey darken-1"
                    v-if="description_hidden && hasPermission"    
                    @click.stop.prevent="descriptionTempleData(tempNewsBoard)" 
                    :loading="description_hidden_loading" 
                    :disabled="description_hidden_loading"
                  >
                    <v-icon>create</v-icon>
                  </v-btn>
                  <v-btn flat icon class="btn--editable btn--editable--done mx-0 my-0" color="success"
                    v-if="!description_hidden && hasPermission"
                    @click.stop.prevent="descriptionUpdateEvent(tempNewsBoard)" 
                    :loading="description_hidden_loading" 
                    :disabled="description_hidden_loading"
                  >
                    <v-icon>done</v-icon>
                  </v-btn>
                    
                  <v-btn flat icon class="mx-0 my-0" color="red darken-3"
                    v-if="!description_hidden && hasPermission"
                    @click.stop.prevent="descriptionRolbackEvent(tempNewsBoard)" 
                    :loading="description_hidden_loading" 
                    :disabled="description_hidden_loading"
                  >
                    <v-icon color="red darken-3">clear</v-icon>
                  </v-btn>
                </span>
              </div>
            </v-flex>
          -->
          
        </v-layout>
      </template>
    </mbl-expand-panel>
  </div>

</template>


<script>
export default {
  props: {
    newsBoard: {
      default: []
    }
  },
  watch: {
    newsBoard (val) {
      this.tempNewsBoard = val
    }
  },
  computed: {
    hasPermission () {
      return this.tempNewsBoard.permission === 'owner' || this.tempNewsBoard.permission === 'leader'
    }
  },
  data () {
    return {
      description_hidden: true,
      description_hidden_loading: false,
      tempData10: '',
      tempNewsBoard: {},
      resourceItems1: '',
      resourceItems2: ''
    }
  },
  created () {
    this.$nextTick(function () {
      this.tempNewsBoard = this.newsBoard
    })
  },
  methods: {
    updateEditableSuccess (val) {
      this.tempNewsBoard = val
    },
    descriptionTempleData: function (data) {
      this.tempData10 = data.description
      this.description_hidden = !this.description_hidden
    },
    descriptionRolbackEvent: function (data) {
      data.description = this.tempData10
      this.clickRutgon_description = true
      this.description_hidden = !this.description_hidden
    },
    descriptionUpdateEvent: function (item) {
      let vm = this
      vm.description_hidden_loading = true
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      let dataToAPI = new URLSearchParams()
      dataToAPI.append('content', item.content)
      dataToAPI.append('answer', item.answer)
      let url = vm.end_point + 'newsboards/' + item.newsBoardId
      window.axios.put(url, dataToAPI, config).then(function (response) {
        vm.description_hidden = !vm.description_hidden
        vm.description_hidden_loading = false
        window.showMessageToastr('success', 'Cập nhật thành công')
      })
        .catch(function (error) {
          console.log(error)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    }
  }
}
</script>

<style type="text/css" scoped>

  .custome-editable-with-icon-newsboard {
      display: -webkit-flex; /* Safari */
      -webkit-align-items: center; /* Safari 7.0+ */
      display: flex;
      align-items: center;
  }
  .custome-editable-with-icon-newsboard div {
     -webkit-flex: 1; /* Safari 6.1+ */
     flex: 1;
  }
  
</style>
<style>
  .hiddenEditor .ql-toolbar {
    display: none;
  }
  .hiddenEditor #quill-container{
    border: 0!important;
  }
  .hiddenEditor .ql-editor {
    padding-left: 0;
    padding-right: 0;
    min-height: 32px;
  }
  .hiddenEditor .ql-container.ql-snow {
    border: 0;
  }
  .hiddenEditor td {
    padding: 0!important;
  }
</style>

