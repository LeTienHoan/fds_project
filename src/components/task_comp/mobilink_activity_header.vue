<template>
  <div>
    <mbl-expand-panel
      :leftactions="[
        {
          icon: 'bookmark_border'
        }
      ]"
      :ownExpanded=true
    >
      <template slot="title-name">
        <div class="layout flex">
          <custome-editable
            type="text"
            :text_options = "{
               text: activity.subject,
               multiline: false,
                rows: 5
              }"
            :api_update="end_point + 'activities/' + activity.activityId"
            key_update="subject"
            @update-success="updateEditableSuccess"
            :permission="activity.permission"
          >
          </custome-editable>
        </div>
      </template>
      <template slot="card-text-container">
        <v-layout wrap class="main-detail-info">
          <v-flex xs12>
            <v-layout wrap>
              <v-flex xs2 class="label_align">
                Nguồn công việc:
              </v-flex>
              <v-flex xs10 class="label_align">
                <a href="javascript:;" @click="clickDetail(activity.source.classPK)">
                  <span>{{ activity.source.subject }}</span>
                </a>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout wrap>
              <v-flex sm2 class="label_align">
                Thư mục:
              </v-flex>
              <v-flex md10>
                <custome-editable
                  class="control_class"
                  type="multiselect"
                  :multi_select_options = "{
                    usetemp: true,
                    api_get: end_point + 'workspaces/scope/TASK?start=-1&end=-1&sort=name_String',
                    init_value: 'workspaceId',
                    init_text: 'workspaceName',
                    key_value: 'workspaceId',
                    key_text: 'workspaceNamePath',
                    param_update_work: true,
                    class_name: class_name,
                    class_pk: class_pk,
                    item_workspace: activity.workspaces,
                    resource: resourceItems2
                  }"
                  @get-resource="(val) => (resourceItems2 = val)"
                  :api_update="end_point + 'resourceworkspaces/update'"
                  :permission="activity.permission"
                  @update-success="(val) => (activity = val)"
                >
                </custome-editable>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout wrap>
              <v-flex md2 sm2 class="label_align">
                Người giao việc:
              </v-flex>
              <v-flex md4 sm4>
                <custome-editable
                  type="select"
                  :select_options = "{
                      usetemp: true,
                      items: usersItems,
                      init_value: activity.leaderId,
                      init_text: activity.leaderName,
                      key_value: 'userId',
                      key_text: 'fullName',
                      key_hint: 'email'
                    }"
                  :api_update="end_point + 'activities/' + activity.activityId"
                  key_update="leaderId"
                  @update-success="updateEditableSuccessResetMenu"
                  :permission="activity.permission"
                >
                </custome-editable>
              </v-flex>
              <v-flex md2 sm3 class="label_align pl-3">
                Ngày bắt đầu:
              </v-flex>
              <v-flex md4 sm3>
                <custome-editable
                  type="date"
                  :date_options="{
                      init_text: activity.startDate,
                      init_value: activity.startDate,
                      end_date: activity.endDate
                  }"
                  :api_update="end_point + 'activities/' + activity.activityId"
                  key_update="startDate"
                  @update-success="updateEditableSuccess"
                  :permission="activity.permission"
                >
                </custome-editable>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout wrap>
              <v-flex md2 sm2 class="label_align">
                <span v-if="activity.assignType==1 || activity.assignType==4">Người thực hiện:</span>
                <span v-if="activity.assignType==2">Đơn vị thực hiện:</span>
              </v-flex>
              <v-flex md4 sm4>
                  <custome-editable
                  type="select"
                  :select_options = "{
                      usetemp: true,
                      items: usersItems,
                      init_value: activity.managerId,
                      init_text: activity.managerName,
                      key_value: 'userId',
                      key_text: 'fullName',
                      key_hint: 'email'
                    }"
                  :api_update="end_point + 'activities/' + activity.activityId"
                  key_update="managerId"
                  @update-success="updateEditableSuccessResetMenu"
                  :permission="activity.permission"
                  v-if="activity.assignType==1 || activity.assignType==4"
                  >
                  </custome-editable>
                  <custome-editable
                  type="select"
                  :select_options = "{
                      usetemp: true,
                      api_get: end_point + 'workingunits?start=-1&end=-1&sort=name_String',
                      init_value: activity.hostingId,
                      init_text: activity.hosting,
                      key_value: 'workingUnitId',
                      key_text: 'name',
                      key_hint: 'email'
                    }"
                  :api_update="end_point + 'activities/' + activity.activityId"
                  key_update="hostingId"
                  @update-success="updateEditableSuccessResetMenu"
                  :permission="activity.permission"
                  v-if="activity.assignType==2"
                  >
                  </custome-editable>
                <!-- <custome-editable
                type="select"
                :select_options = "{
                    usetemp: true,
                    api_get: end_point + 'jobpos?start=-1&end=-1',
                    init_value: activity.jobPosId,
                    init_text: activity.jobPosTitle,
                    key_value: 'jobPosId',
                    key_text: 'title',
                    key_hint: 'email'
                  }"
                :api_update="end_point + 'activities/' + activity.activityId"
                key_update="jobPosId"
                @update-success="updateEditableSuccess"
                :permission="activity.permission"
                v-if="activity.assignType==3"
                >
                </custome-editable> -->
              </v-flex>
              <v-flex md2 sm3 class="label_align pl-3">
                Hạn hoàn thành:
              </v-flex>
              <v-flex md4 sm3>
                <custome-editable
                  type="date"
                  :date_options="{
                    init_text: activity.endDate,
                    init_value: activity.endDate,
                    start_end: activity.startend,
                    start_date: activity.startDate
                  }"
                  :show_day_left= true
                  :api_update="end_point + 'activities/' + activity.activityId"
                  key_update="endDate"
                  @update-success="updateEditableSuccess"
                  :permission="activity.permission"
                >
                </custome-editable>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout wrap>
              <v-flex md2 sm2 class="label_align">
                <span v-if="activity.assignType==1 || activity.assignType==4">Nguời phối hợp:</span>
                <span v-if="activity.assignType==2">Đơn vị phối hợp:</span>
              </v-flex>
              <v-flex md4 sm4>
                  <custome-editable
                    class="control_class"
                    type="multiselect"
                    :multi_select_options = "{
                      usetemp: true,
                      items: usersItems,
                      api_get_muti_select: end_point + 'resourceinvitations/' + class_name + '/' + class_pk + '?right=1',
                      init_value: 'toUserId',
                      init_text: 'fullName',
                      key_value: 'userId',
                      key_text: 'fullName',
                      param_update_invi: true,
                      class_name: class_name,
                      class_pk: class_pk,
                      resource: resourceItems
                    }"
                    @get-resource="(val) => (resourceItems = val)"
                    :api_update="end_point + 'resourceinvitations/pack'"
                    :permission="activity.permission"
                    @update-success="updateEditableSuccessResetMenuCommitStore"
                    v-if="activity.assignType==1 || activity.assignType==4"
                  >
                  </custome-editable>
                  <custome-editable
                    class="control_class"
                    type="multiselect"
                    :multi_select_options = "{
                      usetemp: true,
                      api_get: end_point + 'workingunits?start=-1&end=-1',
                      api_get_muti_select: end_point + 'resourceinvitations/' + class_name + '/' + class_pk + '?right=3',
                      init_value: 'roleId',
                      init_text: 'fullName',
                      key_value: 'roleId',
                      key_text: 'name',
                      param_update_hos: true,
                      class_name: class_name,
                      class_pk: class_pk,
                      resource: resourceItems3
                    }"
                    @get-resource="(val) => (resourceItems3= val)"
                    :api_update="end_point + 'resourceinvitations/pack'"
                    :permission="activity.permission"
                    @update-success="updateEditableSuccessResetMenuCommitStore"
                    v-if="activity.assignType==2"
                  >
                  </custome-editable>
              </v-flex>
              <v-flex md2 sm3 class="label_align pl-3">
                Ngày hoàn thành:
              </v-flex>
              <v-flex md4 sm3 class="label_align">
                {{ activity.finishDate | date }}
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout wrap>
              <v-flex md2 sm2 class="label_align">
                Nguồn giao việc:
              </v-flex>
              <v-flex md4 sm4>
                <custome-editable
                    class="control_class"
                    type="select"
                    :select_options = "{
                      usetemp: true,
                      api_get: end_point + 'dictcollections/SOURCE_FROM/dictitems?start=-1&end=-1&sort=itemName_String',
                      init_value: activity.sourceFrom,
                      init_text: activity.sourceName,
                      key_value: 'itemCode',
                      key_text: 'itemName',
                    }"
                    :api_update="end_point + 'activities/' + activity.activityId"
                    key_update="sourceFrom"
                    :permission="activity.permission"
                    @update-success="(val) => (activity = val)"
                  >
                  </custome-editable>
              </v-flex>
              <v-flex md2 sm3 class="label_align pl-3">
                  Lĩnh vực:
              </v-flex>
              <v-flex md4 sm3>
                  <custome-editable
                    class="control_class"
                    type="select"
                    :select_options = "{
                      usetemp: true,
                      api_get: end_point + 'dictcollections/ACTIVITY_TYPE/dictitems?parent=TASK&start=-1&end=-1&sort=itemName_String',
                      init_value: activity.activityCat,
                      init_text: activity.categoryName,
                      key_value: 'itemCode',
                      key_text: 'itemName',
                    }"
                    :api_update="end_point + 'activities/' + activity.activityId"
                    key_update="activityCat"
                    :permission="activity.permission"
                    @update-success="(val) => (activity = val)"
                  >
                  </custome-editable>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 sm12>
            <v-layout wrap>
              <v-flex md2 sm2 class="label_align">
                Thẻ nhãn
              </v-flex>
              <v-flex md10 sm10>
                <custome-editable
                  class="control_class"
                  type="multiselect"
                  :multi_select_options = "{
                    usetemp: true,
                    api_get: end_point + 'resourcetags?start=-1&end=-1&sort=tag_String',
                    api_get_muti_select: end_point + 'resourcetags/' + class_name + '/' + class_pk,
                    init_value: 'resourceTagId',
                    init_text: 'tag',
                    key_value: 'resourceTagId',
                    key_text: 'tag',
                    param_update_tag: true,
                    class_name: class_name,
                    class_pk: class_pk,
                    resource: resourceItems1
                  }"
                  @get-resource="(val) => (resourceItems1 = val)"
                  :api_update="end_point + 'resourcetags/pack'"
                  :permission="activity.permission"
                  @update-success="(val) => (activity = val)"
                >
                </custome-editable>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 sm12 id="descriptionClass">
              <v-layout wrap>
                <v-flex class="label_align xs12 sm2">
                    Mô tả:
                </v-flex>
                  <v-flex xs12 sm10 class="control_class">
                    <div class="input-group input-group--dirty input-group--text-field input-group--multi-line">
                        <div class="input-group__input" style="align-items: center;">
                          <span v-if="description_hidden" class=" editable__content__value">{{activity.description}}
                          </span>

                          <v-text-field 
                              rows="5"
                              multi-line
                              class="flex sm12"
                              v-model="activity.description"
                              v-if="!description_hidden && ( activity.permission == 'owner'|| activity.permission== 'leader')"
                          ></v-text-field>
                          <div style="margin-left: auto; display: flex;"> 
                            <v-btn flat icon class="btn--editable btn--editable--done mx-0 my-0" color="grey darken-1"
                              v-if="description_hidden && ( activity.permission == 'owner'|| activity.permission== 'leader')"    
                              @click.stop.prevent="descriptionTempleData(activity)" 
                              :loading="description_hidden_loading" 
                              :disabled="description_hidden_loading"
                            >
                              <v-icon>create</v-icon>
                            </v-btn>
                            <v-btn flat icon class="btn--editable btn--editable--done mx-0 my-0" color="success"
                              v-if="!description_hidden && ( activity.permission == 'owner'|| activity.permission== 'leader')"
                              @click.stop.prevent="descriptionUpdateEvent(activity)" 
                              :loading="description_hidden_loading" 
                              :disabled="description_hidden_loading"
                            >
                              <v-icon>done</v-icon>
                            </v-btn>
                              
                            <v-btn flat icon class="mx-0 my-0" color="red darken-3"
                              v-if="!description_hidden && ( activity.permission == 'owner'|| activity.permission== 'leader')"
                              @click.stop.prevent="descriptionRolbackEvent(activity)" 
                              :loading="description_hidden_loading" 
                              :disabled="description_hidden_loading"
                            >
                              <v-icon color="red darken-3">clear</v-icon>
                            </v-btn>
                          </div>
                        </div>
                        <span class="xemthem sub-text mt-1"  @click="clickXemthem_description" v-if="clickRutgon_description && description_hidden && activity.description.length>0 && hidden_xemthem_description">
                          Xem thêm
                        </span>
                        <span class="rutgon sub-text mt-1" @click="clickXemthem_description" v-if="!clickRutgon_description && description_hidden && activity.description.length > 0 && hidden_xemthem_description">
                          Rút gọn
                        </span>
                    </div>

                  </v-flex>
              </v-layout>
          </v-flex>
          <v-flex xs12>
            <!-- <v-checkbox
              class="py-0 my-0 pr-3"
              v-model="checkboxModel"
              label="Ủy quyền"
              @click="checkboxInput"
            >
            </v-checkbox> -->
            <v-icon @click="checkboxInput(true)" v-if="checkboxModel" class="pointer">check_box</v-icon>
            <v-icon @click="checkboxInput(false)" v-else class="pointer">check_box_outline_blank</v-icon>
            <span class="ml-2">Ủy quyền</span>
          </v-flex>
            <v-flex xs12 v-if="checkboxModel == true">
              <v-layout wrap>
                <v-flex xs12 sm2 class="label_align">
                  Ủy quyền xử lí:
                </v-flex>
                <v-flex xs12 sm10 class="control_class">
                  <custome-editable
                    class="control_class"
                    type="multiselect"
                    :multi_select_options = "{
                      usetemp: true,
                      items: usersItems,
                      mutiItems: delegacyItems,
                      init_value: 'toUserId',
                      init_text: 'fullName',
                      key_value: 'toUserId',
                      key_text: 'fullName',
                      param_update_invi_right2: true,
                      class_name: class_name,
                      class_pk: class_pk,
                      resource: resourceItems4
                    }"
                    @get-resource="(val) => (resourceItems4 = val)"
                    :api_update="end_point + 'resourceinvitations/pack'"
                    :permission="hasPermission"
                    @update-success="(val) => (activity = val)"
                    
                  >
                  </custome-editable>
                </v-flex>
              </v-layout>
            </v-flex>
        </v-layout>
      </template>
    </mbl-expand-panel>
  </div>

</template>


<script>
import { EventBus } from '@/eventbus'
const COMPONENT_NAME = 'jx-mobilink-activity-header'
export default {
  name: COMPONENT_NAME,
  props: {
    activity: {
      default: []
    },
    permission: {
      default: 'read'
    },
    class_pk: null,
    class_name: null
  },
  watch: {
    id (val) {
    },
    activity (val) {
      let hasPermission = 'owner,leader,write,manager,hoster'.indexOf(val.permission || 'none') >= 0
      if (hasPermission === true) {
        this.hasPermission = 'owner'
      }
    }
  },
  computed: {
    usersItems () {
      return this.$store.getters['user/userItems']
    }
  },
  data () {
    return {
      clickRutgon_description: true,
      description_hidden: true,
      description_hidden_loading: false,
      tempData10: '',
      hidden_xemthem_description: true,
      resourceItems: '',
      resourceItems1: '',
      resourceItems2: '',
      resourceItems3: '',
      resourceItems4: '',
      checkboxModel: false,
      delegacyItems: [],
      hasPermission: 'read'
    }
  },
  created () {
    this.$nextTick(function () {
      let hasPermission = 'owner,leader,write,manager,hoster'.indexOf(this.activity.permission || 'none') >= 0
      if (hasPermission === true) {
        this.hasPermission = 'owner'
      }
      this.getResourceInvitation()
      this.setHeight_description()
    })
  },
  destroyed () {
    // delete this.activity
    // delete this.permission
    // delete this.class_pk
    // delete this.class_name
    // delete this.usersItems
    // delete this.clickRutgon_description
    // delete this.description_hidden
    // delete this.description_hidden_loading
    // delete this.tempData10
    // delete this.hidden_xemthem_description
    // delete this.resourceItems
    // delete this.resourceItems1
    // delete this.resourceItems2
    // delete this.resourceItems3
    // delete this.clickDetail
    // delete this.updateEditableSuccess
    // delete this.clickXemthem_description
    // delete this.setHeight_description
    // delete this.descriptionTempleData
    // delete this.descriptionRolbackEvent
    // delete this.descriptionUpdateEvent
  },
  methods: {
    checkboxInput (bool) {
      var vm = this
      var config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      if (vm.hasPermission === 'owner') {
        if (bool === true) {
          var paramsApi6 = new URLSearchParams()
          paramsApi6.append('invitations', [])
          paramsApi6.append('className', vm.class_name)
          paramsApi6.append('classPK', vm.class_pk)
          paramsApi6.append('invitationType', 6)
          paramsApi6.append('right', 2)
          vm.$dialog.confirm('Bạn muốn hủy ủy quyền?', {
            html: true,
            loader: true,
            okText: 'Xác nhận',
            cancelText: 'Quay lại',
            animation: 'fade'
          })
            .then((dialog) => {
              vm.checkboxModel = true
              vm.$store.dispatch('loading/setLoading', {
                loading: true,
                message: 'Xóa dữ liệu...'
              })
              var url = vm.end_point + 'resourceinvitations/pack'
              window.axios.post(url, paramsApi6, config).then(function (response) {
                vm.checkboxModel = false
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
              })
                .catch(function (error) {
                  vm.checkboxModel = true
                  vm.delegacyItems = []
                  console.log(error)
                  vm.$store.dispatch('loading/setLoading', {
                    loading: false
                  })
                  window.showMessageByAPICode(error.response.status, error.response.data)
                })
              dialog.close()
            })
            .catch((e) => {
              vm.checkboxModel = true
              console.log(e)
            })
        } else {
          vm.checkboxModel = true
        }
      }
    },
    getResourceInvitation () {
      var vm = this
      var config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      vm.delegacyItems = []
      var url = vm.end_point + 'resourceinvitations/' + vm.class_name + '/' + vm.class_pk + '?right=2'
      window.axios.get(url, config).then(function (response) {
        var serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          if (serializable.data.length > 0) {
            vm.checkboxModel = true
            vm.delegacyItems.push(serializable.data[0])
          }
        } else {
          vm.checkboxModel = false
          vm.delegacyItems = []
        }
      })
        .catch(function (error) {
          console.log(error)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    },
    clickDetail (id) {
      window.location = this.MSystemConfiguration.configuration.systemurl.taskurl + 'detail/' + id
    },
    updateEditableSuccess (val) {
      this.activity = val
    },
    updateEditableSuccessResetMenu (val) {
      this.activity = val
      EventBus.$emit('count_filter', true)
    },
    updateEditableSuccessResetMenuCommitStore (val) {
      EventBus.$emit('count_filter', true)
    },
    clickXemthem_description: function () {
      let vm = this
      vm.clickRutgon_description = !vm.clickRutgon_description
      window.$('#descriptionClass .editable__content__value').animate({scrollTop: 0}, 100)
      if (vm.clickRutgon_description === true) {
        window.$('#descriptionClass .editable__content__value').css({'height': '80px', 'overflow': 'hidden'})
      } else {
        window.$('#descriptionClass .editable__content__value').css({'overflow': 'auto', 'height': '200px'})
      }
    },
    setHeight_description: function () {
      let vm = this
      setTimeout(function () {
        window.$('#descriptionClass .editable__content__value').css({'height': 'auto', 'overflow': 'hidden'})
        if (window.$('#descriptionClass .editable__content__value').height() <= 80) {
          window.$('#descriptionClass .editable__content__value').css({'height': 'auto'})
          vm.hidden_xemthem_description = false
        } else {
          window.$('#descriptionClass .editable__content__value').css({'height': '80px'})
          vm.hidden_xemthem_description = true
          vm.clickRutgon_description = true
        }
      }, 1000)
    },
    descriptionTempleData: function (data) {
      this.tempData10 = data.description
      window.$('#descriptionClass .editable__content__value').css({'height': 'auto'})
      this.description_hidden = !this.description_hidden
    },
    descriptionRolbackEvent: function (data) {
      data.description = this.tempData10
      this.clickRutgon_description = true
      this.description_hidden = !this.description_hidden
    },
    descriptionUpdateEvent: function (item) {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      let dataToAPI = new URLSearchParams()
      dataToAPI.append('description', item.description)
      let url = vm.end_point + 'activities/' + item.activityId
      window.axios.put(url, dataToAPI, config).then(function (response) {
        vm.setHeight_description()
        vm.description_hidden = !vm.description_hidden
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

<style scoped>
    #descriptionClass .editable__content__value{
        width: 100%;
        white-space: pre-line;
        min-height: 10px;
        height: auto;
        overflow: hidden;
    }
    .xemthem,.rutgon{
        float: right;
        margin-left: auto;
        cursor: pointer;
    }
    #descriptionClass .editable__content__value::-webkit-scrollbar-track,#descriptionClass textarea::-webkit-scrollbar-track
    {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 8px;
        background-color: #F5F5F5;
    }
    #descriptionClass .editable__content__value::-webkit-scrollbar,#descriptionClass textarea::-webkit-scrollbar
    {
        width: 8px;
        background-color: #F5F5F5;
    }
    #descriptionClass .editable__content__value::-webkit-scrollbar-thumb,#descriptionClass textarea::-webkit-scrollbar-thumb
    {
        border-radius: 8px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: rgb(181, 181, 181);
    }
    
</style>