<template>
  <div class="">
    <dia-log
    :item = "[
      {
        width: '700px',
        model: add_new,
        action: 'saveDialog1',
        edit: true,
        label: 'Xác nhận',
        icon: 'done'
      }
      ]
    "
    :show_button = 'true'
    @closeDialog="(val) => (add_new = val)"
    @saveDialog1="submit"
  >
    <template slot="header">
      <span v-if="contactId === 0">Thêm liên hệ</span>
      <span v-else>Sửa liên hệ</span>
    </template>
    <template slot="content">
      <v-form ref="form" lazy-validation>
        <v-layout wrap>
          <v-flex xs12>
            <v-radio-group v-model="radioModel">
              <v-radio
                v-for="(item,index) in radioItems"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></v-radio>
            </v-radio-group>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs12>
            <v-subheader class="px-0" v-if="radioModel === 1">Tên cá nhân * </v-subheader>
            <v-subheader class="px-0" v-if="radioModel === 2">Tên tổ chức * </v-subheader>
            <v-text-field
              placeholder=""
              v-model="nameModel"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-subheader class="px-0">Tên tổ chức trực thuộc/làm việc * </v-subheader>
            <v-text-field
              placeholder=""
              v-model="groupNameModel"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-subheader class="px-0">Số điện thoại liên lạc * </v-subheader>
            <v-text-field
              placeholder=""
              v-model="phoneModel"
              :rules="[v => Number(v) >= 0 || 'Bắt buộc nhập số',v => !!v || 'Trường dữ liệu bắt buộc',v => (v.length < 12 && v.length >9)|| 'Nhập số điện thoại 10 hoặc 11 số']"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-subheader class="px-0">Địa chỉ email * </v-subheader>
            <v-text-field
              placeholder=""
              v-model="emailModel"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc',rules.email]"
              required
            ></v-text-field>
          </v-flex>
          <!-- <v-flex xs12>
            <v-checkbox label="Chia sẻ dùng chung" v-model="checkboxModel"></v-checkbox>
          </v-flex> -->
        </v-layout>
      </v-form>
    </template>
  </dia-log>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'add-contact'
  export default {
    name: COMPONENT_NAME,
    components: {
    },
    props: {
    },
    watch: {
    },
    data () {
      return {
        add_new: false,
        radioItems: [
          {
            id: 1,
            name: 'Cá nhân'
          },
          {
            id: 2,
            name: 'Tổ chức'
          }
        ],
        radioModel: 1,
        nameModel: '',
        groupNameModel: '',
        phoneModel: '',
        emailModel: '',
        rules: {
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Nhập sai email.'
          }
        },
        contactId: 0
      }
    },
    created () {
      this.$nextTick(function () {
      })
    },
    methods: {
      initGetData (item) {
        let vm = this
        if (typeof item === 'object') {
          vm.nameModel = item.fullName
          vm.groupNameModel = item.companyName
          vm.phoneModel = item.telNo
          vm.emailModel = item.email
          // vm.checkboxModel = item.shared
          vm.radioModel = item.contactType + 1
          vm.contactId = item.contactId
        } else {
          vm.$refs.form.reset()
          vm.radioModel = 1
          vm.contactId = 0
        }
        vm.add_new = true
      },
      submit () {
        let vm = this
        if (vm.$refs.form.validate()) {
          const config = {
            headers: {
              'groupId': vm.group_id
            }
          }
          let params = new URLSearchParams()
          params.append('fullName', vm.nameModel)
          params.append('companyName', vm.groupNameModel)
          params.append('telNo', vm.phoneModel)
          params.append('email', vm.emailModel)
          params.append('shared', false)
          params.append('groupList', '')
          params.append('userMappingId', 0)
          if (vm.radioModel === 1) {
            params.append('contactType', 0)
          } else {
            params.append('contactType', 1)
          }
          if (vm.contactId !== 0) {
            vm.$store.dispatch('loading/setLoading', {
              loading: true,
              message: 'Cập nhật dữ liệu...'
            })
            window.axios.put(vm.end_point + 'contacts/' + vm.contactId,
              params,
              config
            )
              .then(function (response) {
                vm.add_new = false
                vm.$store.dispatch('loadContactList')
                vm.$store.dispatch('loadContacts')
                window.showMessageToastr('success', 'Cập nhật liên lạc thành công')
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
          } else {
            vm.$store.dispatch('loading/setLoading', {
              loading: true,
              message: 'Thêm mới dữ liệu...'
            })
            window.axios.post(vm.end_point + 'contacts',
              params,
              config
            )
              .then(function (response) {
                vm.add_new = false
                vm.$store.dispatch('loadContactList')
                vm.$store.dispatch('loadContacts')
                window.showMessageToastr('success', 'Thêm mới liên lạc thành công')
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
      }
    }
  }
</script>
<style type="text/css" scoped>
  .truncated {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>