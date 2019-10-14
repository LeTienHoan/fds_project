<template>
  <div>
      <mbl-expand-panel
        :usecard="false"
        :leftactions="[
          {
            icon: 'bookmark_border'
          }
        ]"
        :ownExpanded= "ownExpanded"
        :visibilities="visibilities"
        v-if="(detail__VisibilitiesEditable.editable == 0 && calendar == true) || (calendar != true)"
        >
        <template slot="title-name">
          Trạng thái
        </template>
        <template slot="card-text-container">
          <div class="card">
            <div class="card__text statusClass">
                <v-layout wrap 
                v-for="(item,index) in detail__VisibilitiesStatelogs"
                :key="'VisibilitiesStatelogs'+index"
                v-if="detail__VisibilitiesStatelogs.length != 0 && detail__VisibilitiesEditable.editable!=0 && calendar != true"
                >
                  <v-flex xs12>
                    <ul>
                      <li style="display: flex;align-items: flex-start;">
                          <v-icon class="colorStatus_text">fiber_manual_record</v-icon>
                        <span>
                          <span class="colorStatus_text">{{ item.createDate | datetime }}</span> - {{ item.userName }}
                          <div>{{  item.action }}<span v-if="item.comment != ''">:</span> <span style="color: #939393">{{item.comment}}</span></div>
                        </span>
                      </li>
                    </ul>
                  </v-flex>
                </v-layout>
              <div class="align-center d-flex" v-if="hasPermission">
                <v-btn outline small
                  style="max-width: max-content;color: #039be5"
                  v-for="(item, index) in editableArr"
                  :key="index" 
                  @click="changeEditable(item,index)" 
                  v-if="detail__VisibilitiesEditable.editable==0"
                  >
                    {{ item.texteditable }}
                  </v-btn>
              </div>
               <div v-if="(detail__VisibilitiesEditable.editable == 1 || detail__VisibilitiesEditable.editable == 2) && hasPermission && calendar != true" class="">
                  <v-btn outline small
                  style="max-width: max-content;color: #039be5"
                  v-if="detail__Visibilities.length!=0"
                  :key="index"
                  v-for="(item,index) in detail__Visibilities" 
                  @click="changeState(item,index)"
                  >
                    {{ item.actionName }}
                  </v-btn>
                </div>
                <v-layout wrap v-if="check_change_state == true && hasPermission">
                  <v-flex xs12>
                      <v-text-field
                      class="contentVisibiliti"
                      placeholder="Nhập nội dung ..."
                      v-model='commentVisibiliti'
                      textarea
                      rows="1"
                      ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                      <v-btn class="primary" @click="commentVisibilities" small>Gửi</v-btn>
                  </v-flex>
              </v-layout>
            </div>
          </div>
        </template>
      </mbl-expand-panel>
  </div>
</template>


<script>
const COMPONENT_NAME = 'jx-mobilink-activity-visibilities'
export default {
  name: COMPONENT_NAME,
  components: {
  },
  props: {
    activity: {
      default: []
    },
    class_pk: null,
    class_name: null,
    calendar: false
  },
  watch: {
    id (val) {
    }
  },
  data () {
    return {
      detail__VisibilitiesEditable: [],
      detail__Visibilities: [],
      detail__VisibilitiesStatelogs: [],
      visibilities: {
        class: '',
        text: ''
      },
      ownExpanded: true,
      editableArr: [
        {
          editable: 1,
          texteditable: 'Không lưu nháp/ ban hành'
        },
        {
          editable: 2,
          texteditable: 'Hủy'
        }
      ],
      commentVisibiliti: '',
      check_change_state: false,
      state_true: '',
      start_end: '',
      hasPermission: false
    }
  },
  created () {
    this.$nextTick(function () {
      this.hasPermission = 'owner,write,leader,hoster,manager'.indexOf(this.activity.permission || 'none') >= 0
      if (this.calendar !== true) {
        this._initVisibilities()
        this._initVisibilitiesStatelogs()
      }
      this._initVisibilitiesEditable()
      this.start_end = this.activity.startend
    })
  },
  destroyed () {
    // delete this.activity
    // delete this.class_pk
    // delete this.class_name
    // delete this.detail__VisibilitiesEditable
    // delete this.detail__Visibilities
    // delete this.detail__VisibilitiesStatelogs
    // delete this.visibilities
    // delete this.ownExpanded
    // delete this.editableArr
    // delete this.commentVisibiliti
    // delete this.check_change_state
    // delete this.state_true
    // delete this.start_end
    // delete this.hasPermission
    // delete this._initVisibilitiesEditable
    // delete this._initVisibilities
    // delete this._initVisibilitiesStatelogs
    // delete this._initVisibilitiesStatelogs
    // delete this.changeState
    // delete this.commentVisibilities
  },
  methods: {
    _initVisibilitiesEditable: function () {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      let url = vm.end_point + 'visibilities/' + vm.class_name + '/' + vm.class_pk
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        vm.detail__VisibilitiesEditable = serializable
        if (vm.detail__VisibilitiesEditable.editable !== 0) {
          if (vm.start_end === 0) {
            vm.visibilities.class = 'tag-unfulfilled'
          } else if (vm.start_end === 1) {
            vm.visibilities.class = 'tag-underway'
          } else if (vm.start_end === 2) {
            vm.visibilities.class = 'tag-pending'
          } else if (vm.start_end === 3) {
            vm.visibilities.class = 'tag-finished'
          } else if (vm.start_end === 4) {
            vm.visibilities.class = 'tag-overdue'
          }
          vm.visibilities.text = serializable.stateName
        } else {
          vm.visibilities.class = 'tag tag-pause tag-big'
          vm.visibilities.text = 'Bản nháp'
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    _initVisibilities: function () {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      let url = vm.end_point + 'visibilities/' + vm.class_name + '/' + vm.class_pk + '/actions'
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          vm.detail__Visibilities = serializable.data
        }
      })
        .catch(function (error) {
          console.log(error)
          vm.detail__Visibilities = []
        })
    },
    _initVisibilitiesStatelogs: function () {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      let url = vm.end_point + 'visibilities/' + vm.class_name + '/' + vm.class_pk + '/statelogs?opinion=false&order=false&sort=modified_Number'
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          vm.detail__VisibilitiesStatelogs = serializable.data
        } else {
          vm.detail__VisibilitiesStatelogs = []
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    changeEditable: function (item, index) {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      let url = vm.end_point + 'visibilities/' + vm.class_name + '/' + vm.class_pk
      let paramsChangeEditable = new URLSearchParams()
      paramsChangeEditable.append('editable', item.editable)
      window.axios.put(url, paramsChangeEditable, config).then(function (response) {
        vm._initVisibilitiesEditable()
        window.showMessageToastr('success', 'Cập nhật thành công')
      })
        .catch(function (error) {
          console.log(error)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    },
    changeState: function (item, index) {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      if (item.comment === false) {
        let url = vm.end_point + 'visibilities/' + vm.class_name + '/' + vm.class_pk
        let paramsChangeOpeningState = new URLSearchParams()
        paramsChangeOpeningState.append('state', item.state)
        window.axios.put(url, paramsChangeOpeningState, config).then(function (response) {
          vm.check_change_state = false
          vm.start_end = response.data.startend
          vm.commentVisibiliti = ''
          if (response.data.finishDate !== '') {
            vm.$emit('update-finishdate', response.data.finishDate)
          }
          vm.$emit('update-startend', response.data.startend)
          vm._initVisibilities()
          vm._initVisibilitiesEditable()
          vm._initVisibilitiesStatelogs()
          window.showMessageToastr('success', 'Cập nhật thành công')
        })
          .catch(function (error) {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      } else {
        vm.state_true = item.state
        vm.check_change_state = true
      }
    },
    commentVisibilities: function () {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      if (vm.commentVisibiliti !== '') {
        let dataToAPI = new URLSearchParams()
        dataToAPI.append('comment', vm.commentVisibiliti)
        dataToAPI.append('state', vm.state_true)
        let url = vm.end_point + 'visibilities/' + vm.class_name + '/' + vm.class_pk
        window.axios.put(url, dataToAPI, config).then(function (response) {
          vm.start_end = response.data.startend
          vm._initVisibilities()
          vm._initVisibilitiesEditable()
          vm._initVisibilitiesStatelogs()
          vm.check_change_state = false
        })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  }
}
</script>

<style>
  body .contentVisibiliti .input-group__input{
    border: 1px solid #e6e7e8!important;
    border-width: 0 0 1px!important;
    padding: 5px!important;
    border-radius: 0!important;
  }
  body .contentVisibiliti textarea {
    font-size: 13px!important;
  }
  body .statusClass i {
    font-size: 10px!important;
    margin: 5px 5px 0 0;
  }
  body .colorStatus_text {
    color: #039be5!important;
  }
</style>