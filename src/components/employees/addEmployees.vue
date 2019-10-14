<template>
  <div class="">
    <dia-log
    :item = "[
      {
        width: '900px',
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
      <span>Thêm mới nhân sự</span>
    </template>
    <template slot="content">
      <v-form ref="form" lazy-validation>
        <v-layout wrap>
          <v-flex xs2>
            <v-subheader class="px-0">Mã nhân sự * </v-subheader>
          </v-flex>
          <v-flex xs10>
            <v-text-field
              placeholder=""
              v-model="codeModel"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs2>
            <v-subheader class="px-0">Họ tên * </v-subheader>
          </v-flex>
          <v-flex xs10>
            <v-text-field
              placeholder=""
              v-model="nameModel"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs2>
            <v-subheader class="px-0">Ngày sinh</v-subheader>
          </v-flex>
          <v-flex xs4>
            <v-menu
              ref="menu1"
              style="width: 100%;"
              :close-on-content-click="false"
              v-model="menu1"
              :nudge-width="100"
              :nudge-top="appNudgeTop"
              :nudge-left="appNudgeLeft"
              content-class="dateCustom"
            >
              <v-text-field
                slot="activator"
                v-model="dateFormatted"
                persistent-hint
                @blur="date = parseDate(dateFormatted)"
              ></v-text-field>
              <v-date-picker :locale="language" v-model="date" no-title @input="menu1 = false"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs2>
            <v-subheader class="px-0 pull-right pr-2">Giới tính</v-subheader>
          </v-flex>
          <v-flex xs4>
            <v-select 
              v-bind:items="genderItems" 
              v-model="genderModel"
              autocomplete
              item-text="name" 
              item-value="id"
              hide-selected
            >
            </v-select>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs2>
            <v-subheader class="px-0">Ngày bắt đầu làm việc</v-subheader>
          </v-flex>
          <v-flex xs4>
            <v-menu
              ref="menu2"
              style="width: 100%;"
              :close-on-content-click="false"
              v-model="menu2"
              :nudge-width="100"
              :nudge-top="appNudgeTop"
              :nudge-left="appNudgeLeft"
            >
              <v-text-field
                slot="activator"
                v-model="dateFormatted2"
                persistent-hint
                @blur="date2 = parseDate(dateFormatted2)"
              ></v-text-field>
              <v-date-picker :locale="language" v-model="date2" no-title @input="menu2 = false"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs2>
            <v-subheader class="px-0 pull-right pr-2">Ngày kết thúc làm việc</v-subheader>
          </v-flex>
          <v-flex xs4>
           <v-menu
              style="width: 100%;"
              ref="menu3"
              :close-on-content-click="false"
              v-model="menu3"
              :nudge-width="100"
              :nudge-top="appNudgeTop"
              :nudge-left="appNudgeLeft"
            >
              <v-text-field
                slot="activator"
                v-model="dateFormatted3"
                persistent-hint
                @blur="date3 = parseDate(dateFormatted3)"
              ></v-text-field>
              <v-date-picker :locale="language" v-model="date3" no-title @input="menu3 = false"></v-date-picker>
            </v-menu>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs2>
            <v-subheader class="px-0">Học hàm, học vị </v-subheader>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              placeholder=""
              v-model="degreeModel"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs2>
            <v-subheader class="px-0 pull-right pr-2">Số CMND/Hộ chiếu </v-subheader>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              placeholder=""
              v-model="passportModel"
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs2>
            <v-subheader class="px-0">Số điện thoại liên lạc </v-subheader>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              placeholder=""
              v-model="phoneModel"
              :rules="[value => Number(value) >= 0 || 'Bắt buộc nhập số']"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs2>
            <v-subheader class="px-0 pull-right pr-2">Địa chỉ email </v-subheader>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              placeholder=""
              v-model="emailModel"
              :rules="[rules.email]"
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs2>
            <v-subheader class="px-0">Chức vụ </v-subheader>
          </v-flex>
          <v-flex xs4>
            <v-select 
              v-bind:items="positionItems" 
              v-model="positionModel"
              autocomplete
              return-object
              clearable
              item-text="itemName" 
              item-value="dictItemId"
              hide-selected
            >
            </v-select>
          </v-flex>
          <v-flex xs2>
            <v-subheader class="px-0 pull-right pr-2">Phòng ban </v-subheader>
          </v-flex>
          <v-flex xs4>
            <v-select 
              v-bind:items="departmentItems" 
              v-model="departmentModel"
              autocomplete
              item-text="name" 
              item-value="workingUnitId"
              hide-selected
            >
            </v-select>
          </v-flex>
        </v-layout>
      </v-form>
    </template>
  </dia-log>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'add-employees'
  export default {
    name: COMPONENT_NAME,
    components: {
    },
    props: {
    },
    watch: {
      date (val) {
        this.dateFormatted = this.formatDate(this.date)
      },
      date2 (val) {
        this.dateFormatted2 = this.formatDate(this.date2)
      },
      date3 (val) {
        this.dateFormatted3 = this.formatDate(this.date3)
      }
    },
    data () {
      return {
        add_new: false,
        genderItems: [
          {
            id: 1,
            name: 'Nam'
          },
          {
            id: 0,
            name: 'Nữ'
          }
        ],
        genderModel: 1,
        nameModel: '',
        codeModel: '',
        birthday: '',
        timeStart: '',
        timeEnd: '',
        degreeModel: '',
        passportModel: '',
        rules: {
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Sai email'
          }
        },
        emailModel: '',
        phoneModel: '',
        positionModel: '',
        departmentModel: '',
        date: '',
        dateFormatted: '',
        menu1: false,
        date2: '',
        dateFormatted2: '',
        menu2: false,
        date3: '',
        dateFormatted3: '',
        menu3: false
      }
    },
    computed: {
      departmentItems () {
        return this.$store.getters['workingUnit/workingUnitItems']
      },
      positionItems () {
        return this.$store.getters.loadedPosition.data
      }
    },
    created () {
      this.$nextTick(function () {
      })
    },
    methods: {
      formatDate (date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      parseDate (date) {
        if (!date) return null
        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      initGetData () {
        this.add_new = true
        this.$store.dispatch('workingUnit/getWorkingUnitItems')
        this.$store.dispatch('loadPosition')
      },
      submit () {
        let vm = this
        let yearMonthDay1 = ''
        let yearMonthDay2 = ''
        let yearMonthDay3 = ''
        if (vm.date) {
          const [year, month, day] = vm.date.split('-')
          yearMonthDay1 = `${year}${month}${day}`
        }
        if (vm.date2) {
          const [year, month, day] = vm.date2.split('-')
          yearMonthDay2 = `${year}${month}${day}`
        }
        if (vm.date3) {
          const [year, month, day] = vm.date3.split('-')
          yearMonthDay3 = `${year}${month}${day}`
        }
        if (vm.$refs.form.validate()) {
          const config = {
            headers: {
              'groupId': vm.group_id
            }
          }
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Thêm mới dữ liệu...'
          })
          let params = new URLSearchParams()
          params.append('employeeNo', vm.codeModel)
          params.append('fullName', vm.nameModel)
          params.append('gender', vm.genderModel)
          params.append('birthdate', yearMonthDay1)
          params.append('title', vm.degreeModel)
          params.append('workingUnitId', vm.departmentModel)
          params.append('visa', vm.passportModel)
          params.append('telNo', vm.phoneModel)
          params.append('email', vm.emailModel)
          if (vm.positionModel === '' || vm.positionModel === null) {
            params.append('jobTitle', '')
          } else {
            params.append('jobTitle', vm.positionModel.itemName)
          }
          params.append('recruitDate', yearMonthDay2)
          params.append('leaveDate', yearMonthDay3)
          window.axios.post(vm.end_point + 'employees',
            params,
            config
          )
            .then(function (response) {
              vm.add_new = false
              vm.$router.push('/employees/' + response.data.employeeId)
              window.showMessageToastr('success', 'Cập nhật liên lạc thành công')
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