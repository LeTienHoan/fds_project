<template>
  <div class="navifilter-view scrollChildClass box">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex my-1">
          <v-icon>{{staticRouter.icon}}</v-icon>
          Reset mật khẩu - {{ user.fullName }}
        </div>
      </template>
    </jx-mobilink-toolbar>
    <v-layout wrap>
      <v-flex xs12>
        <v-form ref="form" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Mật khẩu mới *</v-subheader>
              <v-text-field
                placeholder="Mật khẩu mới"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc', v => v.length >= 6 || 'Nhập mật khẩu ít nhất 6 ký tự']"
                required
                type="password"
                v-model="newPasswordModel"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Nhập lại mật khẩu *</v-subheader>
              <v-text-field
                placeholder="Nhập lại mật khẩu"
                v-model="enterNewPasswordModel"
                type="password"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc', v => v.length >= 6 || 'Nhập mật khẩu ít nhất 6 ký tự']"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-checkbox v-model="checkboxModel" label="Yêu cầu đổi mật khẩu khi đăng nhập lại" style="padding-left: 0!important"></v-checkbox>
            </v-flex>
            <v-flex xs12 class="text-xs-right">
              <v-btn class="btn--small primary" @click="resetPass">Đổi mật khẩu</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth mt-2">
      <template slot="toolbar_title">
        <div class="align-center d-flex my-1">
          <v-icon>email</v-icon>
          Thay đổi email
        </div>
      </template>
    </jx-mobilink-toolbar>
    <v-layout wrap>
      <v-flex xs12>
        <v-form ref="formEmail" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Địa chỉ email cũ *</v-subheader>
              <v-text-field
                placeholder="Email cũ"
                :rules="[rules.required, rules.email]"
                required
                type="text"
                v-model="emailModel"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Địa chỉ email mới *</v-subheader>
              <v-text-field
                placeholder="Email mới"
                :rules="[rules.required, rules.email]"
                required
                type="text"
                v-model="newEmailModel"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 class="text-xs-right mt-2">
              <v-btn class="btn--small primary" @click="resetEmail">Thay đổi email</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
      <v-flex xs12>
        <b>Vai trò</b>
      </v-flex>
      <v-flex xs12>
        <v-select
          class="select-advanced-multichip"
          v-model="roleItems"
          chips
          tags
          item-text="roleName"
          item-value="roleId"
          return-object
          multiple
          disabled
        >
        </v-select>
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
    user: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      userModel: {},
      newPasswordModel: '',
      enterNewPasswordModel: '',
      checkboxModel: false,
      isLoading: false,
      readly: false,
      roleItems: [],
      emailModel: '',
      newEmailModel: '',
      rules: {
        required: value => !!value || 'Trường dữ liệu bắt buộc',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Nhập email không đúng'
        }
      }
    }
  },
  components: {
  },
  computed: {
    staticRouter () {
      return this.$store.getters.staticRouter
    },
    title () {
    }
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  watch: {
  },
  methods: {
    resetPass () {
      let vm = this
      if (this.$refs.form.validate()) {
        if (vm.newPasswordModel !== vm.enterNewPasswordModel) {
          window.showMessageToastr('error', 'Mật khẩu không trùng nhau')
        } else {
          let configData = {
            headers: {
              'groupId': vm.group_id
            }
          }
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Thay đổi mật khẩu...'
          })
          let dataPut = new URLSearchParams()
          dataPut.append('newPassword', vm.newPasswordModel)
          dataPut.append('passwordReset', vm.checkboxModel)
          window.axios.post(vm.end_point + 'users/' + vm.user.userId + '/resetpass',
            dataPut,
            configData
          )
            .then(function (response) {
              vm.newPasswordModel = ''
              vm.enterNewPasswordModel = ''
              window.showMessageToastr('success', 'Cập nhật dữ liệu thành công')
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
            })
            .catch(function (error) {
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              console.log(error.response)
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
        }
      }
    },
    resetEmail () {
      let vm = this
      if (this.$refs.formEmail.validate()) {
        if (vm.emailModel === vm.newEmailModel) {
          window.showMessageToastr('error', 'Email trùng nhau')
        } else {
          let configData = {
            headers: {
              'groupId': vm.group_id
            }
          }
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Thay đổi email...'
          })
          let dataPut = new URLSearchParams()
          dataPut.append('oldEmail', vm.emailModel)
          dataPut.append('newEmail', vm.newEmailModel)
          window.axios.post(vm.end_point + 'users/' + vm.user.userId + '/changeemail',
            dataPut,
            configData
          )
            .then(function (response) {
              vm.$emit('change-email', vm.newEmailModel, vm.user.userId)
              vm.emailModel = ''
              vm.newEmailModel = ''
              window.showMessageToastr('success', 'Cập nhật dữ liệu thành công')
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
            })
            .catch(function (error) {
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              console.log(error.response)
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
        }
      }
    },
    getRoles (id) {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      window.axios.get(vm.end_point + 'users/' + id + '/roles',
        config
      )
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.roleItems = serializable.data
          } else {
            vm.roleItems = []
          }
        })
        .catch(function (error) {
          console.log(error.response)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
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
