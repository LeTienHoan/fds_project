<template>
  <!-- Main content -->
  <v-app id="inspire">
    <div class="listcontainer">
      <v-layout wrap class="centerClass">
        <v-form ref="form" lazy-validation style="width: 100%">
          <v-flex xs12 class="bgClass">
            <b>Quên mật khẩu</b>
            <p class="mt-1">Vui lòng nhập email để tìm kiếm tài khoản</p>
            <v-text-field
              placeholder="Nhập email tài khoản"
              v-model="forgotPasswordModel"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc', rules.email]"
              required
              :disabled="disabledModel"
            ></v-text-field>
            <!-- <vue-recaptcha sitekey="6LcT3okUAAAAAGLEAZqVzfmVnFM6bzN47tY4w96d"></vue-recaptcha> -->
            <div id="recaptcha" class="mt-2"></div>
            <v-btn class="primary" @click="sendMail" :disabled="disabledModel">Đồng ý</v-btn>
          </v-flex>
        </v-form>
        <v-form ref="formcode" lazy-validation style="width: 100%">
          <v-flex xs12 class="bgClass mt-3" v-if="showScreenSecurity">
            <b>Nhập mã bảo mật</b>
            <p class="mt-1">Bạn vui lòng kiểm tra email để xem nội dung văn bản có mã</p>
            <v-flex class="align-center" style="display: flex;justify-content: center;">
              <v-text-field
                placeholder="Nhập mã"
                class="flex xs4"
                v-model="codeModel"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
              ></v-text-field>
              <i class="ml-2 pointer" @click="sendMailAgain">Bạn chưa có mã?</i>
            </v-flex>
            <v-btn class="primary mt-3" @click="sendMailCode">Đồng ý</v-btn>
          </v-flex>
        </v-form>
      </v-layout>
    </div>
  </v-app>
  <!-- /.content -->

</template>

<script>
import VueRecaptcha from 'vue-recaptcha'
export default {
  data () {
    return {
      titleName: 'Hoat dong',
      drawer: true,
      forgotPasswordModel: '',
      codeModel: '',
      showScreenSecurity: false,
      rules: {
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Sai email'
        }
      },
      disabledModel: false
    }
  },
  components: {
    VueRecaptcha
  },
  computed: {
    title () {
      return this.titleName
    },
    recaptcha: function () { return this.$store.state.recaptcha }
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    sendMail () {
      let vm = this
      // vm.showScreenSecurity = true
      if (vm.recaptcha === false) {
        window.showMessageToastr('error', 'Bạn cần xác thực')
      } else {
        if (vm.$refs.form.validate()) {
          let config = {
            headers: {
              'groupId': vm.group_id
            }
          }
          window.axios.get(vm.end_point + 'users/' + vm.forgotPasswordModel + '/forgot', config)
            .then(function (response) {
              window.showMessageToastr('success', 'Hệ thống gửi mã thành công')
              vm.showScreenSecurity = true
              vm.disabledModel = true
            })
            .catch(function (error) {
              console.log(error)
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
        }
      }
    },
    sendMailAgain () {
      let vm = this
      if (vm.$refs.form.validate()) {
        let config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        window.axios.get(vm.end_point + 'users/' + vm.forgotPasswordModel + '/forgot', config)
          .then(function (response) {
            window.showMessageToastr('success', 'Hệ thống gửi lại mã thành công')
          })
          .catch(function (error) {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      }
    },
    sendMailCode () {
      let vm = this
      if (vm.$refs.formcode.validate()) {
        let config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        window.axios.get(vm.end_point + 'users/' + vm.forgotPasswordModel + '/forgot/confirm/' + vm.codeModel, config)
          .then(function (response) {
            window.showMessageToastr('success', 'Hệ thống gửi mật khẩu mới thành công')
          })
          .catch(function (error) {
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      }
    }
  }
}
</script>

<style lang="css">
.listcontainer {
  display: flex
}
.task-content {
  width: 100%;
}
.bgClass {
  background: #fff;
  text-align: center;
  padding: 20px;
}
.centerClass {
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 50%;
  position: fixed;
}
.bgClass .input-group__input{
  border: 1px solid #eee
}
/*.bgClass .input-group__details {
  display: none
}*/
.bgClass button {
  box-shadow: none!important;
  -webkit-box-shadow: none!important;
  text-transform: none!important;
  font-size: 13px!important;
  height: 30px;
}
.bgClass b {
  text-transform: uppercase;
}
.bgClass input {
  padding-left: 10px;
}
.bgClass i {
  color: #cccccc;
}
.application .theme--light.input-group:not(.input-group--error) .input-group__details:before, .theme--light .input-group:not(.input-group--error) .input-group__details:before {
  background: none
}
</style>
