<template>
  <div class="mobilink-checklist-component">
    <mbl-expand-panel
      :rightactions="rightactions"
      :leftactions="[
        {
          icon: 'bookmark_border'
        }
      ]"
      @ckeckButtonHeadingClick="ckeckButtonHeadingClick"
      :ownExpanded="ownExpanded"
    >
      <template slot="title-name">
        {{checklist_title}}
      </template>
      <template slot="card-text-container">
        <div>
          <v-layout wrap v-if="checklistItems.length == 0 && showAdd">
            <v-flex xs12 class="text-xs-center" style="color: #ccc">
              <v-icon style="font-size: 26px!important">timeline</v-icon>
              <br>
              Không có tiến độ nào
            </v-flex>
          </v-layout>
            <v-form ref="form" lazy-validation v-if="hasClassPermission && !showAdd">
              <v-layout wrap>
                <v-flex xs12>
                  <div class="d-flex">
                    <v-text-field v-model="checkllist_doItem"
                      placeholder="Tên nhiệm vụ"
                      rows="2"
                      multi-line
                      :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                      required
                    >
                    </v-text-field>
                    <v-btn outline color="primary" @click="saveAndAddNew" icon>
                     <v-icon>done</v-icon>
                    </v-btn>
                  </div>
                </v-flex>
              </v-layout>
            </v-form>
            <div v-if="checklistItems.length > 0" class="list-checklist-wrap">
              <div :key="index" v-for="(item, index) in checklistItems" class="checklist-wrap-item">
                <v-btn icon 
                  @click="changeChecklistStartend(item, index)"
                >
                  <v-icon color="primary" v-if="item.startend === CHECKLIST_STARTEND.onSuccess" >check_box
                  </v-icon>
                  <v-icon v-else>check_box_outline_blank
                  </v-icon>
                </v-btn>
                <span v-if="item.startend === CHECKLIST_STARTEND.onSuccess" class="grey--text truncated"
                   :title="item.doItem"
                >
                  <strike>{{item.doItem}}</strike>
                </span>
                <span v-else class="truncated" :title="item.doItem">
                  {{item.doItem}}
                </span>
                <v-btn icon class="right"
                  v-if="hasClassPermission"
                  @click="removeChecklist(item, index)"
                >
                  <v-icon color="primary">clear
                  </v-icon>
                </v-btn>
              </div>
            </div>
        </div>
      </template>
    </mbl-expand-panel>

  </div>
  
</template>


<script>
const COMPONENT_NAME = 'jx-mobilink-checklist'
export default {
  name: COMPONENT_NAME,
  components: {
  },
  props: {
    class_pk: {
      type: Number,
      default: 0
    },
    class_name: {
      type: String,
      default: ''
    },
    checklist_title: {
      type: String,
      default: 'Bảng kiểm tra tiến độ'
    },
    checklist_api: {
      type: String,
      default: 'checklists'
    },
    permission: {
      type: String,
      default: ''
    }
  },
  watch: {
    class_pk (val) {
      this.getChecklists()
    }
  },
  data () {
    return {
      showAdd: true,
      ownExpanded: true,
      checkllist_doItem: '',
      checklistItems: [],
      rightactions: [],
      CHECKLIST_STARTEND: {
        onProcessing: 1,
        onSuccess: 3
      }
    }
  },
  created () {
    this.$nextTick(function () {
      this.getChecklists()
    })
  },
  destroyed () {
    // delete this.class_pk
    // delete this.class_name
    // delete this.checklist_title
    // delete this.checklist_api
    // delete this.permission
    // delete this.showAdd
    // delete this.ownExpanded
    // delete this.checkllist_doItem
    // delete this.checklistItems
    // delete this.rightactions
    // delete this.CHECKLIST_STARTEND
    // delete this.hasClassPermission
    // delete this.ckeckButtonHeadingClick
    // delete this.changeChecklistStartend
    // delete this.saveAndAddNew
    // delete this.getChecklists
    // delete this.removeChecklist
  },
  computed: {
    hasClassPermission () {
      let p = this.getPermissionText(this.permission)
      let hasClassPermission = 'owner, write'.indexOf(p) >= 0
      if (!hasClassPermission) {
        this.rightactions = []
      } else {
        this.rightactions = [
          {
            icon: this.showAdd ? 'add_circle' : 'do_not_disturb_on',
            action: 'ckeckButtonHeadingClick'
          }
        ]
      }
      return hasClassPermission
    }
  },
  methods: {
    ckeckButtonHeadingClick () {
      this.showAdd = !this.showAdd
      this.ownExpanded = true
    },
    changeChecklistStartend (item, index) {
      if (this.hasClassPermission) {
        let vm = this
        let urlgetNextAction = vm.end_point + 'visibilities/' + vm.checklistClassName + '/' + item.checklistId + '/actions'
        window.axios.get(urlgetNextAction, vm.configChecklistApi)
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              let paramsPutChecklist = new URLSearchParams()
              paramsPutChecklist.append('state', serializable.data[0].state)
              window.axios.put(vm.end_point + 'visibilities/' + vm.checklistClassName + '/' + item.checklistId,
                paramsPutChecklist,
                vm.apiConfigHeader
              )
                .then(function (response) {
                  window.showMessageToastr('success', 'Cập nhật thành công')
                  vm.checklistItems[index]['startend'] = item.startend === vm.CHECKLIST_STARTEND.onProcessing
                    ? vm.CHECKLIST_STARTEND.onSuccess : vm.CHECKLIST_STARTEND.onProcessing
                })
                .catch(function (error) {
                  console.log(error.response)
                  window.showMessageByAPICode(error.response.status, error.response.data)
                })
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    saveAndAddNew () {
      if (this.$refs.form.validate()) {
        let vm = this
        let paramsAddChecklist = new URLSearchParams()
        paramsAddChecklist.append('doItem', vm.checkllist_doItem)
        paramsAddChecklist.append('className', vm.class_name)
        paramsAddChecklist.append('classPK', vm.class_pk)
        window.axios.post(vm.end_point + vm.checklist_api,
          paramsAddChecklist,
          vm.apiConfigHeader
        )
          .then(function (response) {
            window.showMessageToastr('success', 'Thêm mới thành công')
            vm.$refs.form.reset()
            vm.checklistItems.unshift(response.data)
          })
          .catch(function (error) {
            console.log(error.response)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      }
    },
    getChecklists () {
      let vm = this
      vm.checklistItems = []
      let urlGet = vm.end_point + vm.checklist_api + '/' + vm.class_name + '/' + vm.class_pk
      window.axios.get(urlGet, vm.apiConfigHeader)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.checklistItems = serializable.data
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    removeChecklist (item, index) {
      let vm = this
      vm.$dialog.confirm('Bạn có chắc chắn muốn thực hiện hành động này?', {
        html: true,
        loader: true,
        okText: 'Xác nhận',
        cancelText: 'Quay lại',
        animation: 'fade'
      })
        .then((dialog) => {
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Xóa dữ liệu...'
          })
          window.axios.delete(vm.end_point + vm.checklist_api + '/' + item.checklistId, vm.apiConfigHeader)
            .then(function (response) {
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageToastr('success', 'Bạn đã thực hiện xoá thành công')
              vm.checklistItems.splice(index, 1)
            })
            .catch(function (error) {
              console.log(error)
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
          dialog.close()
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>

<style >
    
</style>