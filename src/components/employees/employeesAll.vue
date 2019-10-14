<template>
  <div class="mobilink-all-component layout">
    <v-layout wrap>
      <v-flex xs12 mb-2 class="contact_all_class">
        <employees-header :count="count"></employees-header>
      </v-flex>
      <v-flex xs12>
        <div class="contact_all_class">
          <v-layout wrap>
            <v-flex xs1 class="px-3 align-center d-flex text-bold">
              Mã
            </v-flex>
            <v-flex xs3 class="px-3 align-center d-flex text-bold">
              Họ và tên
            </v-flex>
             <v-flex xs3 class="px-3 align-center d-flex text-bold">
              Chức vụ
            </v-flex>
             <v-flex xs2 class="px-3 align-center d-flex text-bold">
              Liên lạc
            </v-flex>
            <v-flex xs2 class="px-3 align-center d-flex text-bold">
              Tài khoản
            </v-flex>
             <v-flex xs1 class="px-3 align-center d-flex">
            </v-flex>
          </v-layout>
          <table class="table table-bs">
            <tr :key="index" v-for="(item, index) in employeesItems">
              <td class="col-xs-1">
                {{ item.employeeNo }}
              </td>
              <td class="col-xs-3">
                <div class="text-bold pointer" @click="detailEmpoyees(item,index)">{{ item.fullName }}</div>
                <div>{{ item.birthdate | date}}</div>
              </td>
              <td class="col-xs-3">
                <div>{{ item.jobTitle }}</div>
                <div>{{ item.workingUnitName }}</div>
              </td>
              <td class="col-xs-2">
                <div>{{ item.telNo }}</div>
                <div>{{ item.email }}</div>
              </td>
              <td class="col-xs-2">
                <div v-if="item.mappingUser.email">{{ item.mappingUser.email }}</div>
                <div v-if="item.mappingUser === ''" class="unfulfilled">Chưa có tài khoản</div>
                <div v-if="item.mappingUser.agreedToTermsOfUse === false" class="unfulfilled">Chờ kích hoạt</div>
                <div v-if="item.mappingUser.agreedToTermsOfUse === true && item.mappingUser.status === 0" class="finished">Đang hoạt động</div>
                <div v-if="item.mappingUser.agreedToTermsOfUse === true && item.mappingUser.status === 5" class="overdue">Đã khóa</div>
              </td>
              <td class="col-xs-1 text-xs-right ">
                <v-icon @click="removeEmployees(item,index)" class="pointer" v-if="item.mappingUser.agreedToTermsOfUse === false || item.mappingUser === ''">cancel</v-icon>
                <v-icon @click="lockAccount(true,item,index)" class="pointer" v-if="item.mappingUser.agreedToTermsOfUse === true && item.mappingUser.status === 0">lock</v-icon>
                <v-icon @click="lockAccount(false,item,index)" class="pointer" v-if="item.mappingUser.agreedToTermsOfUse === true && item.mappingUser.status === 5">lock_open</v-icon>
              </td>
            </tr>
          </table>
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
      <!-- <v-flex xs3>
        <birthdate class="contact_list_class"></birthdate>
      </v-flex> -->
    </v-layout>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'employees-all'
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
      employeesItems () {
        return this.$store.getters.loadedEmployees.data
      },
      pagination () {
        return Math.ceil(this.$store.getters.loadedEmployees.total / this.paginationSize)
      },
      count () {
        return this.$store.getters.loadedEmployees.total
      }
    },
    data () {
      return {
        paginationPage: 1,
        panel: '',
        paginationSize: 20
      }
    },
    created () {
      this.$nextTick(function () {
      })
    },
    methods: {
      detailEmpoyees (item, index) {
        // this.$router.push('/employees/' + item.employeeId)
        window.location = this.MSystemConfiguration.configuration.systemurl.employeeurl + 'employees/' + item.employeeId
      },
      removeEmployees (item, index) {
        let vm = this
        this.$dialog.confirm('Bạn muốn xóa bản ghi này', {
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
            vm.$store.dispatch('deleteEmployees', item).then(response => {
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
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
      lockAccount (boolen, item, index) {
        let vm = this
        if (item.email === '') {
          alert('Chưa tồn tại email nhân sự')
        } else {
          let config = {
            headers: {
              'groupId': vm.group_id
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('locked', boolen)
          window.axios.post(vm.end_point + 'employees/' + item.employeeId + '/lock',
            dataPost,
            config
          )
            .then(function (response) {
              if (boolen === true) {
                window.showMessageToastr('success', 'Khóa tài khoản thành công')
              } else {
                window.showMessageToastr('success', 'Kích hoạt tài khoản thành công')
              }
              vm.$store.dispatch('loadEmployees')
            })
            .catch(function (error) {
              console.log(error.response)
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$store.dispatch('loadEmployees')
      })
    }
  }
</script>

<style lang="scss" scoped>


</style>
