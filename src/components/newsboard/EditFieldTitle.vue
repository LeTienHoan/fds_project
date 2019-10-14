<template>
  <div class="newsboard-edit">
    <v-card class="newsboard-edit-header">
      <v-card-text>
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
        <div style="display: flex;">
          <span class="grey--text">
            {{tempNewsBoard.userName}} - {{newsBoard.createDate | datetime}}
            <v-icon style="font-size: 6px !important;" class="px-2 grey--text">fiber_manual_record</v-icon>
            <a href="javascript:;"
              class="primary--text"
              @click.stop="$refs.visitLogsRef.showVisitLog = true"
            >
              {{tempNewsBoard.visitedCount}} người đã xem
            </a>
          </span>
          <VisitLogs
            ref="visitLogsRef"
            :class_name="newsBoardClassName"
            :class_pk="tempNewsBoard.newsBoardId"
          />
          <span v-if="tempNewsBoard.priority"
            class="red--text" style="margin-left: auto;text-transform: none;">
            Khẩn
          </span>
        </div>
      </v-card-text>
    </v-card>
    <v-card class="newsboard-edit-card">
      <v-card-text>
        <v-layout wrap class="">
          <v-flex sm2 class="label_editable">
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
          <v-flex xs12 sm2 class="label_editable">
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
          <v-flex xs12 sm2 class="label_editable">
            Chia sẻ
          </v-flex>
          <v-flex xs12 sm10>
            <!--
            <EditableResource
              class="control_class"
              typeEdit="multiselect"
              :hasPermission="true"
              placeholder="Chia sẻ cho đơn vị"
              :multi_select_options = "{
                api_get: end_point + 'resourceroles?start=-1&end=-1',
                api_update: end_point + 'resourceroles/update',
                init_value: [2222, 1111],
                key_value: 'userId',
                key_text: 'userName'
              }"
            />
            -->
            <EditableResource
              class="control_class"
              typeEdit="multiselect"
              :hasPermission="hasPermission"
              :boolenCheckbox="checkboxModel"
              placeholder="Chọn đơn vị để chia sẻ"
              :loadingBtn="shareRolesLoading"
              :multi_select_options = "{
                api_get: end_point + 'resourceroles/' + newsBoardClassName + '/' + newsBoard.newsBoardId + '?sort=roleName_String&full=true&roleType=0&start=-1&end=-1',
                init_value_from_resource: true,
                key_value: 'roleId',
                key_text: 'roleName'
              }"
              @submitMultiSelect="submitRoles"
            />
          </v-flex>
          <v-flex xs12 sm2 class="label_editable">
          </v-flex>
          <v-flex xs12 sm10>
            <EditableResource
              class="control_class"
              typeEdit="multiselect"
              :hasPermission="hasPermission"
              :boolenCheckbox="checkboxModel"
              placeholder="Chọn cá nhân để chia sẻ"
              :loadingBtn="shareUsersLoading"
              :multi_select_options = "{
                api_get: end_point + 'resourceusers/' + newsBoardClassName + '/' + newsBoard.newsBoardId + '?full=employee&sort=fullName_String&start=-1&end=-1',
                init_value_from_resource: true,
                key_value: 'userId',
                key_text: 'fullName',
                key_hint: 'email',
                filter: customFilterUser
              }"
              @submitMultiSelect="submitUsers"
            />
          </v-flex>
          <v-flex xs12 sm2 class="label_editable">
          </v-flex>
          <v-flex xs12 sm10 class="mt-2">
            <v-checkbox
              style="float: left;"
              class="py-0 my-0 pr-3"
              v-model="checkboxModel"
              label="Chia sẻ toàn cơ quan"
              :disabled="!hasPermission"
              v-if="staticRouter.path=='/notification' || staticRouter.path=='/qna'"
              @change="clickVisibilities"
            >
            </v-checkbox>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>

</template>

<script>
import EditableResource from './EditableResource'
import VisitLogs from './VisitLogs'
export default {
  props: {
    newsBoard: {
      default: []
    }
  },
  components: {
    EditableResource,
    VisitLogs
  },
  watch: {
    newsBoard (val) {
      this.tempNewsBoard = val
    }
  },
  computed: {
    hasPermission () {
      return this.tempNewsBoard.permission === 'owner' || this.tempNewsBoard.permission === 'leader'
    },
    staticRouter () {
      return this.$store.getters.staticRouter
    }
  },
  data () {
    return {
      description_hidden: true,
      description_hidden_loading: false,
      tempData10: '',
      tempNewsBoard: {},
      resourceItems1: '',
      resourceItems2: '',
      shareUsersLoading: false,
      shareRolesLoading: false,
      checkboxModel: false
    }
  },
  created () {
    this.$nextTick(function () {
      this.tempNewsBoard = this.newsBoard
      if (this.staticRouter.path === '/notification' || this.staticRouter.path === '/qna') {
        this.getVisibilities()
      }
    })
  },
  methods: {
    getVisibilities (id) {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      let url = vm.end_point + 'visibilities/' + vm.newsBoardClassName + '/' + vm.newsBoard.newsBoardId
      window.axios.get(url, config).then(function (response) {
        if (response.data.visible === 1) {
          vm.checkboxModel = true
        } else {
          vm.checkboxModel = false
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    clickVisibilities () {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      let url = vm.end_point + 'visibilities/' + vm.newsBoardClassName + '/' + vm.newsBoard.newsBoardId
      let paramsPutVisible = new URLSearchParams()
      if (vm.checkboxModel === true) {
        paramsPutVisible.append('visible', 1)
      } else {
        paramsPutVisible.append('visible', 2)
      }
      window.axios.put(url, paramsPutVisible, config).then(function (response) {
        if (response.data.visible === 1) {
          window.showMessageToastr('success', 'Chia sẻ toàn cơ quan thành công')
        } else {
          window.showMessageToastr('success', 'Hủy chia sẻ toàn cơ quan thành công')
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    updateEditableSuccess (val) {
      this.tempNewsBoard = val
      this.$emit('change', val)
    },
    submitRoles (tempData) {
      let vm = this
      vm.shareRolesLoading = true
      let paramsApi3 = new URLSearchParams()
      paramsApi3.append('roles', JSON.stringify(tempData.map(item => {
        item.right = vm.constantPermissionKey.read
        return item
      })))
      paramsApi3.append('className', vm.newsBoardClassName)
      paramsApi3.append('classPK', vm.newsBoard.newsBoardId)
      window.axios.post(vm.end_point + 'resourceroles/update',
        paramsApi3)
        .then(function (response) {
          vm.shareRolesLoading = false
          window.showMessageToastr('success', 'Chia sẻ thành công')
        })
        .catch(function (error) {
          console.log(error)
          vm.shareRolesLoadin = false
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    },
    submitUsers (tempData) {
      let vm = this
      vm.shareUsersLoading = true
      let paramsApi4 = new URLSearchParams()
      paramsApi4.append('users', JSON.stringify(tempData.map(item => {
        item.right = vm.constantPermissionKey.read
        return item
      })))
      paramsApi4.append('className', vm.newsBoardClassName)
      paramsApi4.append('classPK', vm.newsBoard.newsBoardId)
      paramsApi4.append('userClass', 'employee')
      window.axios.post(vm.end_point + 'resourceusers/pack',
        paramsApi4)
        .then(function (response) {
          vm.shareUsersLoading = false
          window.showMessageToastr('success', 'Chia sẻ thành công')
        })
        .catch(function (error) {
          console.log(error)
          vm.shareUsersLoading = false
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    }
  }
}
</script>

<style lang="scss">
.newsboard-edit {
  .newsboard-edit-header {
    background-color: #ddf5ff;
    box-shadow: none;
    border: none;
    .editable-text {
      color: #039BE5;
      text-transform: uppercase;
      font-weight: bold;
    }
  }
  .newsboard-edit-card {
    box-shadow: none;
    border: none;
    border-top: 1px solid #ccc;
  }
}
.label_editable {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: flex-start;
  align-items: flex-start;
  line-height: 28px;
}
</style>

