<template>
  <div class="mobilink-all-component layout">
    <v-layout wrap>
      <v-flex xs9>
        <v-layout wrap>
          <v-flex xs12 mb-2 class="contact_all_class">
            <contact-header :count="count"></contact-header>
          </v-flex>
          <v-flex xs12>
            <div class="contact_all_class">
              <v-layout wrap>
                <v-flex xs5 class="px-3 align-center d-flex">
                  <span>
                    <b class="px-0">Tên cá nhân/tổ chức</b>
                    <p>Đơn vị trực thuộc/làm việc</p>
                  </span>
                </v-flex>
                <v-flex xs5 class="px-3 align-center d-flex">
                  <span>
                    <b class="px-0">Điện thoại</b>
                    <p>Email</p>
                  </span>
                </v-flex>
              </v-layout>
              <v-expansion-panel
                v-model="panel"
                expand
              >
                <v-expansion-panel-content
                  :key="index" v-for="(item, index) in contactItems"
                  expand-icon="mdi-menu-down"
                >
                  <div slot="header">
                    <v-layout wrap>
                      <div class="align-center d-flex align-center d-flex">
                        <v-icon style="font-size: 40px!important;">supervisor_account</v-icon>
                        <span class="pl-2">{{ item.fullName }}</span>
                      </div>
                      <span class="text-xs-right flex d-flex align-center">
                        <!-- style="display: flex;margin-left: auto;" -->
                        <div>
                          <!-- <v-switch @click.stop="shareContact(item)" style="flex-grow: 0;" class="mr-3" v-model="item.shared" v-if="item.shared === false" title="Bật chia sẻ"></v-switch>
                          <v-switch @click.stop="shareContact(item)" style="flex-grow: 0;" class="mr-3" v-model="item.shared" v-if="item.shared === true" title="Tắt chia sẻ"></v-switch> -->
                          <v-icon @click.stop="editContact(item,index)" title="Sửa liên lạc" class="">edit</v-icon>
                          <v-icon @click.stop="removeContact(item,index)" title="Xóa liên lạc" class="">cancel</v-icon>
                        </div>
                      </span>
                    </v-layout>
                  </div>
                  <div slot="actions">
                  </div>
                  <v-card>
                    <v-card-text>
                      <table class="table table-bs">
                        <tr :key="index" v-for="(items, indexs) in item.groupList.data">
                          <td class="col-xs-5">
                            <div class="media">
                              <div class="media-left">
                                <v-icon>person</v-icon>
                              </div>
                              <div class="media-body">
                                <div class="media-heading text-bold">{{items.fullName}}</div>
                                <div class="contentClass">{{items.companyName}}</div>
                              </div>
                            </div>
                          </td>
                          <td class="col-xs-7">
                            <div>{{items.telNo}}</div>
                            <div>{{items.email}}</div>
                          </td>
                        </tr>
                      </table>
                      <v-layout wrap v-if="item.groupList.total == 0">
                        <v-flex xs12 class="center-all my-2"><i>Không có liên hệ</i></v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-layout wrap v-if="count == 0">
                <v-flex xs12 class="center-all"><i>Không có dữ liệu</i></v-flex>
              </v-layout>
              <v-layout wrap class="align-center d-flex" v-if="count > 0">
                <div class="d-flex" style="width: 100%;justify-content: flex-end;">
                  <div class="select-page-size align-center d-flex">
                    <v-select
                      :items="pageNumberItems"
                      v-model="paginationSize"
                      :width="55"
                      :max-width="55"
                      :min-width="55"
                      no-data-text=""
                      @input="paginationSizeChange"
                    ></v-select>
                  </div>
                  <v-pagination v-model="paginationPage" :length="pagination" style="flex-grow: 0!important;"></v-pagination>
                </div>
              </v-layout>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs3>
        <new-contact-update class="contact_list_class"></new-contact-update>
      </v-flex>
    </v-layout>
    <add-group ref="group"></add-group>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'contact-group'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {},
    watch: {
      'paginationPage': {
        handler () {
          this.$store.dispatch('setPaginationPage', {
            pagination: this.paginationPage
          })
        }
      }
    },
    computed: {
      staticRouter () {
        return this.$store.getters.staticRouter
      },
      contactItems () {
        return this.$store.getters.loadedContacts.data
      },
      pagination () {
        return Math.ceil(this.$store.getters.loadedContacts.total / this.paginationSize)
      },
      count () {
        return this.$store.getters.loadedContacts.total
      }
    },
    data () {
      return {
        paginationPage: 1,
        select: ['Vuetify', 'Programming'],
        panel: '',
        paginationSize: 20
      }
    },
    created () {
      this.$nextTick(function () {
      })
    },
    methods: {
      editContact (item, index) {
        this.$refs.group.initGetData(item)
      },
      removeContact (item, index) {
        let vm = this
        this.$dialog.confirm('Bạn muốn xóa liên lạc', {
          html: true,
          loader: true,
          okText: 'Xác nhận',
          cancelText: 'Quay lại',
          animation: 'fade'
        })
          .then(function (dialog) {
            vm.$store.dispatch('loading/setLoading', {
              loading: true,
              message: 'Xóa dữ liệu...'
            })
            vm.$store.dispatch('deleteContact', item).then(response => {
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageToastr('success', 'Xóa dữ liệu thành công')
            }, error => {
              console.log(error)
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
            dialog.close()
            return false
          })
          .catch(function (e) {
            console.log(e)
          })
      },
      paginationSizeChange () {
        this.paginationPage = 1
        this.$store.dispatch('setPaginationSize', this.paginationSize)
      },
      shareContact (item) {
        let vm = this
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        let params = new URLSearchParams()
        if (item.shared === false) {
          params.append('shared', true)
        } else {
          params.append('shared', false)
        }
        window.axios.put(vm.end_point + 'contacts/' + item.contactId,
          params,
          config
        )
          .then(function (response) {
            if (response.data.shared === true) {
              window.showMessageToastr('success', 'Chia sẻ liên lạc thành công')
            } else {
              window.showMessageToastr('success', 'Không chia sẻ liên lạc thành công')
            }
            vm.$store.dispatch('loadContactUpdate')
            vm.$store.dispatch('loadContacts')
          })
          .catch(function (error) {
            console.log(error.response)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$store.dispatch('loadContacts')
      })
    }
  }
</script>

<style lang="scss" scoped>


</style>
