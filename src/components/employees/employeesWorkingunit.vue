<template>
  <div class="mobilink-all-component layout">
    <v-layout wrap>
      <v-flex xs9>
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
                <v-flex xs4 class="px-3 align-center d-flex text-bold">
                  Họ và tên
                </v-flex>
                 <v-flex xs3 class="px-3 align-center d-flex text-bold">
                  Chức vụ
                </v-flex>
                 <v-flex xs3 class="px-3 align-center d-flex text-bold">
                  Liên lạc
                </v-flex>
                 <v-flex xs1 class="px-3 align-center d-flex">
                </v-flex>
              </v-layout>
              <table class="table table-bs">
                <tr :key="index" v-for="(item, index) in employeesItems">
                  <td class="col-xs-1">
                    {{ item.employeeNo }}
                  </td>
                  <td class="col-xs-4">
                    <div class="text-bold" @click="detailEmpoyees(item,index)">{{ item.fullName }}</div>
                    <div>{{ item.birthdate | date}}</div>
                  </td>
                  <td class="col-xs-3">
                    <div>{{ item.jobTitle }}</div>
                    <div>{{ item.workingUnitName }}</div>
                  </td>
                  <td class="col-xs-3">
                    <div>{{ item.telNo }}</div>
                    <div>{{ item.email }}</div>
                  </td>
                  <td class="col-xs-1 text-xs-right">
                    <v-icon @click="removeEmployees(item,index)">clear</v-icon>
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
        </v-layout>
      </v-flex>
      <v-flex xs3>
        <birthdate class="contact_list_class"></birthdate>
      </v-flex>
    </v-layout>
    <add-contact ref="contact"></add-contact>
    <add-group ref="group"></add-group>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'employees-working-unit'
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
      },
      '$route.params.id' () {
        this.$store.dispatch('loadEmployees')
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
        paginationSize: 50
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
