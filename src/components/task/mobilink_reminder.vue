<template>
  <div class="mobilink-component-reminder">

    <mbl-expand-panel
      :rightactions="rightactions"
      :leftactions="[
        {
          icon: 'bookmark_border'
        }
      ]"
      :ownExpanded="ownExpanded"
      @addReminderShowForm="showAddForm = !showAddForm"
    >
      <template slot="title-name">
        {{ reminderTitle }}
      </template>
      <template slot="card-text-container">
        <div>
          <v-layout wrap v-if="reminderItems.length == 0 && !showAddForm">
            <v-flex xs12 class="text-xs-center" style="color: #ccc">
              <v-icon style="font-size: 26px!important">calendar_today</v-icon>
              <br>
              Không có nhắc lịch nào
            </v-flex>
          </v-layout>
            <v-form ref="form" lazy-validation
              v-if="showAddForm && rightactions.length > 0"
            >
              <v-layout wrap>
                <v-flex sm12>
                  <v-select
                    v-bind:items="startendItems"
                    v-model="fastFormItem.startend"
                    clearable
                    placeholder="Nhắc tôi..."
                    item-text="text"
                    item-value="value"
                    autocomplete
                    :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                    required
                  ></v-select>
                </v-flex>
                <v-flex sm6>
                  <v-text-field
                    placeholder="Thời luợng..."
                    v-model="fastFormItem.durationUnit"
                    :rules="[value => Number(value) >= 0 || 'Bắt buộc nhập số', value => !!value || 'Bắt buộc nhập số']"
                  ></v-text-field>
                </v-flex>
                <v-flex sm6>
                  <v-select
                    v-bind:items="durationTypes"
                    v-model="fastFormItem.durationType"
                    clearable
                    placeholder="Chọn đơn vị..."
                    item-text="text"
                    item-value="value"
                    autocomplete
                    :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                    required
                  ></v-select>
                </v-flex>
                <v-flex sm12>
                  <v-btn class="primary ma-0" small depressed 
                    @click.native="addReminderSubmit"
                    :loading="addReminder_hidden_loading" 
                    :disabled="addReminder_hidden_loading"
                    >
                      Gửi
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          <div v-for="(item, index) in reminderItems" :key="index" class="reminder-item">
            <span>{{
              startendItems[item.startend]['text'] + ' ' + item.durationUnit + ' ' + durationTypes[item.durationType]['text']
              }}</span>
            <v-btn icon class="ma-0 right delete-reminder"
              v-if="item.userId===user_id || permission==='owner'" 
              @click.stop="removeReminder(item, index)"
              :loading="item.loading" 
              :disabled="item.loading"
              title="Xóa"
            >
              <v-icon>cancel</v-icon>
            </v-btn>
          </div>
        </div>
      </template>
    </mbl-expand-panel>

  </div>
</template>

<script>
const COMPONENT_NAME = 'jx-mobilink-reminder'
export default {
  name: COMPONENT_NAME,
  props: {
    id: null,
    class_pk: null,
    class_name: null,
    reminderTitle: {
      type: String,
      default: 'Nhắc lịch'
    },
    permission: {
      type: String,
      default: 'read'
    }
  },
  components: {
  },
  watch: {
    class_pk (val) {
      this.initComponent()
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.initComponent()
    })
  },
  destroyed () {
    // delete this.id
    // delete this.class_pk
    // delete this.class_name
    // delete this.reminderTitle
    // delete this.permission
    // delete this.rightactions
    // delete this.ownExpanded
    // delete this.showAddForm
    // delete this.addReminder_hidden_loading
    // delete this.startendItems
    // delete this.durationTypes
    // delete this.fastFormItem
    // delete this.reminderItems
    // delete this.initComponent
    // delete this.addReminderSubmit
    // delete this.removeReminder
  },
  data () {
    return {
      rightactions: [
        {
          icon: 'add',
          action: 'addReminderShowForm',
          title: 'Thêm nhắc lịch'
        }
      ],
      ownExpanded: true,
      showAddForm: false,
      addReminder_hidden_loading: false,
      startendItems: [
        {text: 'Nhắc truớc ngày thực hiện', value: 1},
        {text: 'Nhắc truớc ngày kết thúc', value: 2}
      ],
      durationTypes: [
        {text: 'Phút', value: 1},
        {text: 'Giờ', value: 2},
        {text: 'Ngày', value: 3}
      ],
      fastFormItem: {
        startend: 1,
        durationType: 1,
        durationUnit: 60
      },
      reminderItems: []
    }
  },
  methods: {
    initComponent: function () {
      let vm = this
      if (vm.permission === 'read') {
        vm.rightactions = []
      }
      const config = {
        headers: {
          'groupId': vm.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      vm.reminderItems = []
      let url = vm.end_point + 'reminders/' + vm.class_name + '/' + vm.class_pk
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          vm.reminderItems = serializable.data
        }
      })
        .catch(function (error) {
          console.log(error)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    },
    addReminderSubmit () {
      let vm = this
      vm.addReminder_hidden_loading = true
      if (!this.$refs.form.validate()) {
        vm.addReminder_hidden_loading = false
      } else {
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Thêm mới dữ liệu...'
        })
        const params = {
          startend: vm.fastFormItem.startend - 1,
          durationUnit: vm.fastFormItem.durationUnit,
          durationType: vm.fastFormItem.durationType - 1,
          className: vm.class_name,
          classPK: vm.class_pk
        }
        window.axios.post(vm.end_point + 'reminders',
          params, vm.apiConfigHeader
        )
          .then(function (response) {
            vm.$refs.form.reset()
            vm.showAddForm = false
            window.showMessageToastr('success', 'Thêm mới thành công')
            vm.reminderItems.push(response.data)
            vm.addReminder_hidden_loading = false
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          })
          .catch(function (error) {
            console.log(error)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            vm.addReminder_hidden_loading = false
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      }
    },
    removeReminder (item, index) {
      let vm = this
      vm.$dialog.confirm('Bạn có muốn xóa nội dung này?', {
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
          window.axios.delete(vm.end_point + 'reminders' + '/' + item.reminderId,
            vm.apiConfigHeader)
            .then(function (response) {
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageToastr('success', 'Đã xoá thành công')
              vm.reminderItems.splice(index, 1)
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
<style scoped>
.reminder-item {
  padding-top: 5px;
  margin-top: 5px;
  border-top: 1px solid #bcbec0;
}
</style>
