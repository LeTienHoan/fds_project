<template>
  <div class="navifilter-view scrollChildClass box">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex my-1">
          <v-icon>{{staticRouter.icon}}</v-icon>
          {{title}}&nbsp;<span v-if="isDetail"> - {{ holidayModel.description }}</span>
        </div>
      </template>
    </jx-mobilink-toolbar>
    
    <v-layout wrap>
      <v-flex xs12>

        <v-form ref="form">

          <v-layout wrap>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Ngày nghỉ *</v-subheader>
            </v-flex>
            <v-flex xs12 sm12>
              <custome-date-time
                :id="1"
                :datetimevalue="getADateByTimeStamp(holidayModel.holidayDate)"
                autocomplate
                :format="localeDateProperties.dateMomentPattern"
                :onlydate="true"
                :disabled="isDetail"
                @syncxxx="(val) => (holidayModel.holidayDate = new Date (val))"
              >
              </custome-date-time>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Mô tả</v-subheader>
            </v-flex>
            <v-flex xs12 sm12 class="pt-1">

              <v-text-field
                placeholder="Mô tả"
                v-model="holidayModel.description"
                multi-line
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn
                class="right"
                color="primary"
                :disabled="isLoading"
                :loading="isLoading"
                @click="holidaySubmit"
              >
                <v-icon>save</v-icon>
                {{title}}
              </v-btn>
              <v-btn @click="cancelChangeHoliday"
                class="right"
                color="primary"
              >
                <v-icon>cancel</v-icon>
                Huỷ
              </v-btn>
            </v-flex>
          </v-layout>

        </v-form>


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
    holiday: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      holidayModel: {},
      holidayDefault: {
        holidayDate: new Date(),
        description: ''
      },
      isLoading: false,
      readly: false
    }
  },
  components: {
  },
  computed: {
    staticRouter () {
      return this.$store.getters.staticRouter
    },
    title () {
      if (this.isDetail) {
        return 'Chỉnh sửa ngày nghỉ'
      } else {
        return 'Thêm ngày nghỉ'
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      // const s = this.holiday
      // this.holidayModel = s
      this.readly = true
    })
  },
  watch: {
    isDetail (val) {
      if (val) {
        this.setHolidayMapped(this.holiday)
      } else {
        this.setHolidayMapped(this.holidayDefault)
      }
    },
    holiday (val) {
      this.setHolidayMapped(val)
    }
  },
  methods: {
    // deprecated
    detailHoliday () {
      let vm = this
      vm.isLoading = true
      this.$store.dispatch('holiday/readHoliday', 1).then(response => {
        vm.isLoading = false
        console.log('Got some data, now lets show something in this component', response)
      }, error => {
        vm.isLoading = false
        console.log('Got nothing from server. Prompt user to check internet connection and try again', error)
      })
    },
    holidaySubmit () {
      let vm = this
      const params = {
        holidayDate: window.moment(vm.holidayModel.holidayDate).format('YYYYMMDD'),
        description: vm.holidayModel.description
      }
      if (this.isDetail && this.$refs.form.validate()) {
        this.editHoliday(params)
      } else if (this.$refs.form.validate()) {
        this.addHoliday(params)
      }
    },
    addHoliday (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Thêm mới dữ liệu...'
      })
      this.$store.dispatch('holiday/createHoliday', params).then(response => {
        vm.isLoading = false
        vm.$emit('addholidaysuccess', response)
        window.showMessageToastr('success', 'Thêm mới dữ liệu thành công')
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
      }, error => {
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        console.log(error)
        window.showMessageByAPICode(error.response.status, error.response.data)
        vm.isLoading = false
      })
    },
    editHoliday (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Cập nhật dữ liệu...'
      })
      this.$store.dispatch('holiday/updateHoliday', params).then(response => {
        vm.isLoading = false
        window.showMessageToastr('success', 'Cập nhật dữ liệu thành công')
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        vm.$emit('editholidaysuccess', response)
      }, error => {
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        console.log(error)
        window.showMessageByAPICode(error.response.status, error.response.data)
        vm.isLoading = false
      })
    },
    setHolidayMapped (holiday) {
      this.holidayModel = {
        holidayDate: this.getADateByTimeStamp(holiday.holidayDate),
        description: holiday.description
      }
    },
    getADateByTimeStamp (timeStamp) {
      if (timeStamp) {
        return new Date(Number(timeStamp))
      } else {
        return new Date()
      }
    },
    cancelChangeHoliday () {
      if (this.isDetail) {
        this.setHolidayMapped(this.holiday)
      } else {
        this.$emit('canceladdnew', true)
      }
    }
  }
}
</script>

<style scoped>
.navifilter-view {
  width: 100%;
}
</style>

