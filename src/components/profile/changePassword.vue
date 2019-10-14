<template>
  <div class="mobilink-all-component layout">
    <v-layout wrap>
      <mbl-expand-panel
        :ownExpanded= "ownExpanded"
      >
        <template slot="title-name">
          Đổi mật khẩu
        </template>
        <template slot="card-text-container">
          <v-form ref="form" lazy-validation>
            <v-layout wrap>
              <v-flex xs3>
                <v-subheader class="px-0">Mật khẩu cũ *:</v-subheader>
              </v-flex>
              <v-flex xs9>
                <v-text-field
                  placeholder=""
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                  type="password"
                  v-model="oldPasswordModel"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex xs3>
                <v-subheader class="px-0">Mật khẩu mới *:</v-subheader>
              </v-flex>
              <v-flex xs9>
                <v-text-field
                  placeholder=""
                  required
                  type="password"
                  v-model="newPasswordModel"
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc', v => v.length >= 6 || 'Nhập mật khẩu ít nhất 6 ký tự']"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex xs3>
                <v-subheader class="px-0">Nhập lại mật khẩu *:</v-subheader>
              </v-flex>
              <v-flex xs9>
                <v-text-field
                  placeholder=""
                  required
                  type="password"
                  v-model="enterNewPasswordModel"
                  :rules="[v => v == newPasswordModel || 'Nhập lại mật khẩu chưa đúng', v => !!v || 'Trường dữ liệu bắt buộc', v => v.length >= 6 || 'Nhập mật khẩu ít nhất 6 ký tự']"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex xs12>
                <i>(*)Mật khẩu có ít nhất 6 ký tự, có phân biệt chữ viết hoa.</i>
              </v-flex>
              <v-flex xs12>
                <v-btn class="primary btn--small mx-0" @click="changePassword">Đổi mật khẩu</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </template>
      </mbl-expand-panel>
    </v-layout>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'change-password'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {},
    watch: {
    },
    computed: {
    },
    data () {
      return {
        ownExpanded: true,
        oldPasswordModel: '',
        newPasswordModel: '',
        enterNewPasswordModel: ''
      }
    },
    created () {
      this.$nextTick(function () {
      })
    },
    methods: {
      changePassword () {
        let vm = this
        if (this.$refs.form.validate()) {
          let config = {
            headers: {
              'groupId': vm.group_id
            }
          }
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Đổi mật khẩu...'
          })
          let dataPost = new URLSearchParams()
          dataPost.append('oldPassword', vm.oldPasswordModel)
          dataPost.append('newPassword', vm.newPasswordModel)
          window.axios.post(vm.end_point + 'users/' + vm.user_id + '/changepass',
            dataPost,
            config
          )
            .then(function (response) {
              if (response.data === true) {
                window.showMessageToastr('success', 'Thay đổi mật khẩu thành công')
              } else {
                window.showMessageToastr('success', 'Thay đổi mật khẩu thất bại')
              }
              vm.$refs.form.reset()
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
            })
            .catch(function (error) {
              console.log(error.response)
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
      })
    }
  }
</script>

<style lang="scss" scoped>


</style>
