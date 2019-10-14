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
      <span v-if="contactId === 0">Thêm nhóm danh bạ</span>
      <span v-else>Sửa nhóm danh bạ</span>
    </template>
    <template slot="content">
      <v-form ref="form" lazy-validation>
        <v-layout wrap>
          <v-flex xs12>
            <v-subheader class="px-0">Tên nhóm * </v-subheader>
            <v-text-field
              placeholder=""
              v-model="nameGroupModel"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-subheader class="px-0">Danh sách liên hệ trong nhóm * </v-subheader>
            <v-select
              v-bind:items="contactItems"
              v-model="contactModel"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
              item-text="fullName"
              item-value="contactId"
              return-object
              multiple
              chips
              hide-selected
              autocomplete
              :filter="customFilterUser"
            >
              <template slot="item" slot-scope="data">
                <template>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="data.item.fullName"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="data.item.email"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </template>
              </template>
              <template slot="selection" slot-scope="data">
                <v-chip
                  @input="deleteGroup(data)"
                  :selected="data.selected"
                  :disabled="data.disabled"
                  :key="JSON.stringify(data.item)"
                  close
                >
                  
                  {{ data.item.fullName}}
                </v-chip>
              </template>
            </v-select>
          </v-flex><!-- 
          <v-flex xs12>
            <v-checkbox label="Có chia sẻ" v-model="checkboxModel"></v-checkbox>
          </v-flex> -->
        </v-layout>
      </v-form>
    </template>
  </dia-log>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'add-group'
  export default {
    name: COMPONENT_NAME,
    components: {
    },
    props: {
    },
    watch: {
    },
    computed: {
    },
    data () {
      return {
        add_new: false,
        nameGroupModel: '',
        groupNameModel: '',
        contactModel: '',
        contactId: 0,
        contactItems: [],
        sharedGroup: false
      }
    },
    created () {
      this.$nextTick(function () {
      })
    },
    methods: {
      initGetData (item) {
        let vm = this
        vm.getContactItems()
        vm.contactModel = []
        if (item.contactId !== 0) {
          vm.nameGroupModel = item.fullName
          if (item.groupList.total === 0) {
            vm.contactModel = []
          } else {
            vm.contactModel = item.groupList.data
          }
          // vm.checkboxModel = item.shared
          vm.contactId = item.contactId
          vm.sharedGroup = item.shared
        } else {
          vm.$refs.form.reset()
          vm.contactId = 0
        }
        vm.add_new = true
      },
      deleteGroup: function (data) {
        data.parent.selectItem(data.item)
      },
      getContactItems () {
        let vm = this
        let url = this.end_point + 'contacts'
        let paramsContact = {
          contactType: '0,1',
          scope: 'me',
          start: -1,
          end: -1
        }
        let config = {
          params: paramsContact,
          headers: {
            'groupId': this.group_id
          }
        }
        window.axios.get(url, config).then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.contactItems = serializable.data
          } else {
            vm.contactItems = []
          }
        })
          .catch(function (error) {
            console.log(error)
          })
      },
      submit () {
        let vm = this
        if (vm.$refs.form.validate()) {
          const config = {
            headers: {
              'groupId': vm.group_id
            }
          }
          let list = ''
          for (var key in vm.contactModel) {
            list = list + vm.contactModel[key].contactId
            if (vm.contactModel.length > Number(key) + 1) {
              list = list + ','
            }
          }
          let params = new URLSearchParams()
          params.append('fullName', vm.nameGroupModel)
          params.append('shared', vm.sharedGroup)
          params.append('groupList', list)
          params.append('contactType', 2)
          if (vm.contactId === 0) {
            vm.$store.dispatch('loading/setLoading', {
              loading: true,
              message: 'Thêm mới dữ liệu...'
            })
            params.append('companyName', '')
            params.append('telNo', '')
            params.append('email', '')
            params.append('userMappingId', 0)
            window.axios.post(vm.end_point + 'contacts',
              params,
              config
            )
              .then(function (response) {
                vm.add_new = false
                vm.$store.dispatch('loadContacts')
                vm.$store.dispatch('loadContactList')
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
          } else {
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
                vm.$store.dispatch('loadContacts')
                vm.$store.dispatch('loadContactList')
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
          }
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
      })
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