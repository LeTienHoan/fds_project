<template>
  <div class="mobilink-all-component layout">
    <v-layout wrap>
      <mbl-expand-panel
        :ownExpanded= "ownExpanded"
      >
        <template slot="title-name">
          Thông tin tài khoản
        </template>
        <template slot="card-text-container">
          <v-layout wrap class="py-2">
            <v-flex xs3>
              <b>Mã nhân viên:</b>
            </v-flex>
            <v-flex xs9>
              {{ personalInformation.userClassNo }}
            </v-flex>
          </v-layout>
          <v-layout wrap class="py-2">
            <v-flex xs3>
              <b>Trạng thái:</b>
            </v-flex>
            <v-flex xs9>
              {{ statusItems[personalInformation.workingStatus].name }}
            </v-flex>
          </v-layout>
          <v-layout wrap class="py-2">
            <v-flex xs3>
              <b>Họ và tên:</b>
            </v-flex>
            <v-flex xs9>
              {{ personalInformation.fullName }}
            </v-flex>
          </v-layout>
          <v-layout wrap class="py-2">
            <v-flex xs3>
              <b>Giới tính:</b>
            </v-flex>
            <v-flex xs9>
              <span v-if="personalInformation.gender === 'female'">Nữ</span>
              <span v-if="personalInformation.gender === 'male'">Nam</span>
            </v-flex>
          </v-layout>
          <v-layout wrap class="py-2">
            <v-flex xs3>
              <b>Ngày sinh:</b>
            </v-flex>
            <v-flex xs9>
              <span v-html="parseDate(personalInformation.birthdate)" v-if="personalInformation.birthdate !== ''"></span>
              <i v-else>Chưa có</i>
            </v-flex>
          </v-layout>
          <v-layout wrap class="py-2">
            <v-flex xs3>
              <b>Học hàm:</b>
            </v-flex>
            <v-flex xs9>
              <span v-if="personalInformation.title !== ''">{{ personalInformation.title }}</span>
              <i v-else>Chưa có</i>
            </v-flex>
          </v-layout>
          <v-layout wrap class="py-2">
            <v-flex xs3>
              <b>Chức vụ/Phòng ban:</b>
            </v-flex>
            <v-flex xs9>
              <span v-if="personalInformation.mainWorkingUnit !== ''">{{ personalInformation.mainWorkingUnit }}</span>
              <i v-else>Chưa có</i>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs3 class="align-center d-flex">
              <b>Số điện thoại:</b>
            </v-flex>
            <v-flex xs9>
              <custome-editable
                type="text"
                class="flex xs12"
                :text_options = "{
                   text: personalInformation.contactTelNo,
                   multiline: false,
                    rows: 5
                  }"
                :api_update="end_point + 'users/' + user_id + '/' + personalInformation.className + '/' + personalInformation.classPK"
                key_update="contactTelNo"
                @update-success="updateReponse"
                :permission="'owner'"
              >
              </custome-editable>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs3 class="align-center d-flex">
              <b>Email liên hệ:</b>
            </v-flex>
            <v-flex xs9>
              <custome-editable
                type="text"
                class="flex xs12"
                :text_options = "{
                   text: personalInformation.contactEmail,
                   multiline: false,
                    rows: 5
                  }"
                :api_update="end_point + 'users/' + user_id + '/' + personalInformation.className + '/' + personalInformation.classPK"
                key_update="contactEmail"
                @update-success="updateReponse"
                :permission="'owner'"
              >
              </custome-editable>
            </v-flex>
          </v-layout>
          <v-layout wrap class="py-2">
            <v-flex xs3>
              <b>Ngày bắt đầu làm việc:</b>
            </v-flex>
            <v-flex xs9>
              <span v-html="parseDate(personalInformation.recruitDate)" v-if="personalInformation.recruitDate !== ''"></span>
              <i v-else>Chưa có</i>
            </v-flex>
          </v-layout>
          <v-layout wrap class="py-2">
            <v-flex xs3>
              <b>Ngày kết thúc làm việc:</b>
            </v-flex>
            <v-flex xs9>
              <span v-html="parseDate(personalInformation.leaveDate)" v-if="personalInformation.leaveDate !== ''"></span>
              <i v-else v-show="employeeId">Chưa có</i>
            </v-flex>
          </v-layout>
        </template>
      </mbl-expand-panel>
      <mbl-expand-panel
        :ownExpanded= "ownExpanded"
        class="mt-3"
      >
        <template slot="title-name">
          Tài liệu liên quan
        </template>
        <template slot="card-text-container" v-if="fileAttachItems.length !== 0">
          <v-layout wrap class="mb-2" v-for="(item, index) in fileAttachItems" :key="index">
            <v-flex xs12 class="align-center" style="display: flex;">
              <v-icon>chevron_right</v-icon>
              <span @click="downloadFileAttach(item,index)" class="pointer ml-2">{{ item.createDate }} - {{item.fileName}}</span>
            </v-flex>
          </v-layout>
          <v-layout wrap v-if="fileAttachItems.length === 0" class="center-all">
            <v-flex><i>Không có tài liệu nào</i></v-flex>
          </v-layout>
        </template>
      </mbl-expand-panel>
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
    },
    computed: {
      personalInformation: function () {
        if (typeof this.$store.state.personalInformation.classPK !== 'undefined') {
          this.getFileAttachs(this.$store.state.personalInformation.classPK)
        }
        return this.$store.state.personalInformation
      }
    },
    data () {
      return {
        ownExpanded: true,
        statusItems: [
          {
            id: 0,
            name: 'Đã nghỉ việc'
          },
          {
            id: 1,
            name: 'Đang làm việc'
          }
        ],
        genderItems: [
          {
            id: 0,
            name: 'Nữ'
          },
          {
            id: 1,
            name: 'Nam'
          }
        ],
        fileAttachItems: [],
        id: ''
      }
    },
    created () {
      this.$nextTick(function () {
      })
    },
    methods: {
      updateReponse (val) {
        this.$store.commit('updatePersonalInformation', val)
      },
      parseDate (date) {
        return window.moment(date).format(this.localeDateProperties.dateMomentPattern)
      },
      getFileAttachs (item) {
        let vm = this
        let config = {
          headers: {
            'groupId': vm.group_id,
            'Accept': 'application/json'
          }
        }
        let className = 'org.mobilink.common.model.Employee'
        window.axios.get(vm.end_point + 'fileattachs/' + className + '/' + item + '?appendix=true',
          config
        )
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              vm.fileAttachItems = serializable.data
            } else {
              vm.fileAttachItems = []
            }
          })
          .catch(function (error) {
            console.log(error.response)
          })
      },
      downloadFileAttach (item, index) {
        let vm = this
        item['download_loading'] = true
        let onsuccess = function () {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          item['download_loading'] = false
        }
        let onerror = function (error) {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          item['download_loading'] = false
          console.log(error)
        }
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Đang tải dữ liệu...'
        })
        window.downloadFile2({
          url: vm.end_point + 'fileattachs/' + item.fileAttachId,
          groupId: vm.group_id,
          fileName: item.fileName
        }, onsuccess, onerror)
      }
    },
    mounted () {
      this.$nextTick(() => {
        // this.getFileAttachs()
      })
    }
  }
</script>

<style lang="scss" scoped>


</style>
