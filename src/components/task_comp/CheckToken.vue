<template>
  <!-- Main content -->
  <v-app id="inspire">
    <main>
      <section class="content">
        <div class="fullwidth" >
          <dia-log 
            :item = "[
              {
                width: '900px',
                model: dialogCheckToken,
                action: 'createTokenSubmit',
                edit: true,
                label: 'Gửi',
                icon: 'save'
              }
              ]
            "
            :show_button = true
            @createTokenSubmit="createTokenSubmit"
            @closeDialog="(val) => ($refs.form.reset())"
          >
            <template slot="header">
              {{title}}
            </template>
            <template slot="content">
              <v-layout wrap
              >
                <v-flex xs12>
                  <v-form ref="form" lazy-validation
                  >
                    <v-layout wrap
                    >
                      <v-flex xs12 sm2 class="label_align">
                        <v-subheader >Email </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm10>
                        <v-text-field
                          v-model="email"
                          :rules="[v => !!v || 'Trường dữ liệu bắt buộc',
                            v => /.+@.+/.test(v) || 'Trường dữ liệu E-mail']"
                          required
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2 class="label_align">
                        <v-subheader>Mã bảo mật </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm10>
                        <v-text-field
                          v-model="token"
                          :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                          required
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-flex>
              </v-layout>
            </template>
          </dia-log>
        </div>
      </section>
    </main>
  </v-app>
  <!-- /.content -->

</template>

<script>
export default {
  data () {
    return {
      titleName: 'Xác thực người dùng',
      dialogCheckToken: false,
      createToken_hidden_loading: false,
      email: '',
      token: ''
    }
  },
  components: {
  },
  computed: {
    title () {
      return this.titleName
    },
    id () {
      return this.$route.params.id
    }
  },
  methods: {
    createTokenSubmit () {
      let vm = this
      vm.createToken_hidden_loading = true
      if (!this.$refs.form.validate()) {
        vm.createToken_hidden_loading = false
        return
      } else {
        const token = vm.email + ':' + vm.token
        const tk = window.btoa(token)
        console.log(token, tk, window.atob(tk))
        vm.goToDetail(vm.id, tk)
      }
      // TODO: reminder submit call api
      setTimeout(() => {
        vm.addReminder_hidden_loading = false
      }, 500)
    },
    goToDetail (id, token) {
      this.$router.push('/detail/' + id + '/' + token)
    }
  },
  mounted () {
    let vm = this
    vm.dialogCheckToken = true
    if (!(Number(vm.id) >= 0)) {
      vm.$router.push('/noprmission')
    }
  }
}
</script>