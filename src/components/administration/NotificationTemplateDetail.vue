<template>
  <div class="navifilter-view scrollChildClass box">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex my-1">
          <v-icon>{{staticRouter.icon}}</v-icon>
          {{title}}&nbsp;<span v-if="isDetail"> - {{ notificationTemplateModel.notificationType }}</span>
        </div>
      </template>
    </jx-mobilink-toolbar>
    
    <v-layout wrap>
      <v-flex xs12>

        <v-form ref="form">

          <v-layout wrap>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Mã thông báo *</v-subheader>
            </v-flex>
            <v-flex xs12 sm12>
              <v-text-field
                placeholder="notificationType"
                v-model="notificationTemplateModel.notificationType"
                :disabled="isDetail"
                :rules="[value => !!value || 'Mã thông báo bắt buộc phải nhập']"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Chủ đề thư *</v-subheader>
            </v-flex>
            <v-flex xs12 sm12>
              <v-text-field
                placeholder="Chủ đề thư"
                v-model="notificationTemplateModel.emailSubject"
                :rules="[value => !!value || 'Chủ đề thư bắt buộc phải nhập']"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Nội dung thư</v-subheader>
            </v-flex>
            <v-flex xs12 sm12>
              <v-text-field v-model="notificationTemplateModel.emailBody" multi-line :rows="15"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0 d-flex">
                <div class="custome-subheader-with-icon">
                  <div>
                    Nội dung thông báo
                  </div>
                  <span>
                    Tổng số  {{notificationTemplateModel.textMessage ? notificationTemplateModel.textMessage.length : 0}} ký tự
                  </span>
                </div>
              </v-subheader>
             
            </v-flex>
            <v-flex xs12 sm12>
              <v-text-field
                placeholder="Chủ đề thư"
                v-model="notificationTemplateModel.textMessage"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Số giờ sau khi tạo thông báo bị expire nếu không gửi đựơc</v-subheader>
            </v-flex>
            <v-flex xs12 sm12>
              <v-text-field
                placeholder="Số giờ sau khi tạo thông báo bị expire nếu không gửi đựơc"
                v-model="notificationTemplateModel.expireDuration"
                :rules="[value => Number(value) >= 0 || 'Bắt buộc nhập số']"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Lịch kiểm tra để gửi thông báo</v-subheader>
            </v-flex>
            <v-flex xs12 sm12>
              <v-select
                :items="notificationIntervalItems"
                placeholder="Lịch kiểm tra để gửi thông báo"
                v-model="notificationTemplateModel.interval"
                clearable
              ></v-select>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Đối tuợng gửi</v-subheader>
            </v-flex>
            <v-flex xs4 sm3>
              <v-checkbox v-model="notificationTemplateModel.recipient" label="Owner" value="3"></v-checkbox>
            </v-flex>
            <v-flex xs4 sm3>
              <v-checkbox v-model="notificationTemplateModel.recipient" label="Tham gia" value="2"></v-checkbox>
            </v-flex>
            <v-flex xs4 sm3>
              <v-checkbox v-model="notificationTemplateModel.recipient" label="Theo dõi" value="1"></v-checkbox>
            </v-flex>
            <v-flex xs4 sm3>
              <v-checkbox v-model="notificationTemplateModel.recipient" label="Truy cập" value="0"></v-checkbox>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Địa chỉ truy cập dành cho user</v-subheader>
            </v-flex>
            <v-flex xs12 sm12>
              <v-text-field
                placeholder="Địa chỉ truy cập dành cho user"
                v-model="notificationTemplateModel.userUrlPattern"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Địa chỉ truy cập dành cho guest</v-subheader>
            </v-flex>
            <v-flex xs12 sm12>
              <v-text-field
                placeholder="Địa chỉ truy cập dành cho guest"
                v-model="notificationTemplateModel.guestUrlPattern"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm6>
              <v-checkbox label="Gửi tin nhắn" v-model="notificationTemplateModel.sendSMS"></v-checkbox>
            </v-flex>
            <v-flex xs6 sm6>
              <v-checkbox label="Gửi mail" v-model="notificationTemplateModel.sendEmail"></v-checkbox>
            </v-flex>
            <v-flex xs12>
              <v-btn
                class="right"
                color="primary"
                :disabled="isLoading"
                :loading="isLoading"
                @click="notificationTemplateSubmit"
              >
                <v-icon>save</v-icon>
                {{title}}
              </v-btn>
              <v-btn @click="cancelChangeNotificationTemplate"
                class="right"
                color="primary"
              >
                <v-icon>cancel</v-icon>
                Huỷ
              </v-btn>
            </v-flex>
          </v-layout>

        </v-form>


      </v-flex>
    </v-layout>
  </div>
</template>

<script>

export default {
  props: {
    isDetail: {
      type: Boolean,
      default: false
    },
    notificationTemplate: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      notificationTemplateModel: {},
      notificationTemplateDefault: {
        'notificationType': '',
        'typeName': '',
        'emailSubject': '',
        'emailBody': '',
        'textMessage': '',
        'sendEmail': true,
        'sendSMS': false,
        'expireDuration': 0,
        'userUrlPattern': '',
        'guestUrlPattern': '',
        'interval': '',
        'grouping': false,
        'recipient': ['0', '1', '2', '3']
      },
      isLoading: false,
      readly: false
    }
  },
  components: {
  },
  computed: {
    staticRouter () {
      return this.$store.getters.staticRouter
    },
    title () {
      if (this.isDetail) {
        return 'Chỉnh sửa mẫu thông báo'
      } else {
        return 'Thêm mẫu thông báo'
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      // const s = this.notificationTemplate
      // this.notificationTemplateModel = s
      this.readly = true
    })
  },
  watch: {
    isDetail (val) {
      if (val) {
        this.setNotificationTemplateMapped(this.notificationTemplate)
      } else {
        this.setNotificationTemplateMapped(this.notificationTemplateDefault)
      }
    },
    notificationTemplate (val) {
      this.setNotificationTemplateMapped(val)
    }
  },
  methods: {
    // unuse
    detailNotificationTemplate () {
      let vm = this
      vm.isLoading = true
      this.$store.dispatch('notification/readNotificationTemplate', 1).then(response => {
        vm.isLoading = false
        console.log('Got some data, now lets show something in this component', response)
      }, error => {
        vm.isLoading = false
        console.log('Got nothing from server. Prompt user to check internet connection and try again', error)
      })
    },
    deduplicate (arr) {
      let isExist = (arr, x) => arr.indexOf(x) > -1
      let ans = []
      arr.forEach(element => {
        if (!isExist(ans, element)) ans.push(element)
      })
      return ans
    },
    notificationTemplateSubmit () {
      let vm = this
      var params = {}
      var list = []
      for (const key in vm.notificationTemplateModel) {
        if (key === 'recipient') {
          for (var keys in vm.notificationTemplateModel[key]) {
            if (Number(vm.notificationTemplateModel[key][keys]) === 1 || Number(vm.notificationTemplateModel[key][keys]) === 2 || Number(vm.notificationTemplateModel[key][keys]) === 3 || Number(vm.notificationTemplateModel[key][keys]) === 0) {
              list.push(vm.notificationTemplateModel[key][keys].trim())
            }
          }
          params[key] = vm.deduplicate(list).join(',')
        } else {
          params[key] = vm.notificationTemplateModel[key] === null ? '' : vm.notificationTemplateModel[key]
        }
      }
      console.log('>>>>>>>>>>>>', params)
      if (this.isDetail && this.$refs.form.validate()) {
        this.editNotificationTemplate(params)
      } else if (this.$refs.form.validate()) {
        this.addNotificationTemplate(params)
      }
    },
    addNotificationTemplate (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Thêm mới dữ liệu...'
      })
      this.$store.dispatch('notification/createNotificationTemplate', params).then(response => {
        vm.isLoading = false
        vm.$emit('addNotificationTemplatesuccess', response)
        window.showMessageToastr('success', 'Thêm mới dữ liệu thành công')
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
      }, error => {
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        console.log(error)
        window.showMessageByAPICode(error.response.status, error.response.data)
        vm.isLoading = false
      })
    },
    editNotificationTemplate (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Cập nhật dữ liệu...'
      })
      this.$store.dispatch('notification/updateNotificationTemplate', params).then(response => {
        vm.isLoading = false
        vm.$emit('editNotificationTemplatesuccess', response)
        window.showMessageToastr('success', 'Cập nhật dữ liệu thành công')
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
      }, error => {
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        console.log(error)
        window.showMessageByAPICode(error.response.status, error.response.data)
        vm.isLoading = false
      })
    },
    setNotificationTemplateMapped (notificationTemplate) {
      let notificationTemplateModel = {}
      for (const key in notificationTemplate) {
        if (key === 'recipient') {
          for (var keys in notificationTemplate[key]) {
            notificationTemplate[key][keys] = notificationTemplate[key][keys].trim()
          }
        }
        notificationTemplateModel[key] = notificationTemplate[key]
      }
      this.notificationTemplateModel = notificationTemplateModel
    },
    cancelChangeNotificationTemplate () {
      if (this.isDetail) {
        this.setNotificationTemplateMapped(this.notificationTemplate)
      } else {
        this.$emit('canceladdnew', true)
      }
    }
  }
}
</script>

<style scoped>
.navifilter-view {
  width: 100%;
}

.custome-subheader-with-icon {
    display: -webkit-flex; /* Safari */
    -webkit-align-items: center; /* Safari 7.0+ */
    display: flex;
    align-items: center;
}
.custome-subheader-with-icon div {
    -webkit-flex: 1; /* Safari 6.1+ */
    flex: 1;
}
</style>
