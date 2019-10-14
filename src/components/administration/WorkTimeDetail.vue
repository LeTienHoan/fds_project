<template>
  <div class="navifilter-view scrollChildClass box">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex my-1">
          <v-icon>{{staticRouter.icon}}</v-icon>
          {{title}}&nbsp;<span v-if="isDetail"> - {{ daysOfWeek[workTimeModel.day].text }}</span>
        </div>
      </template>
    </jx-mobilink-toolbar>
    <v-layout wrap>
      <v-flex xs12>

        <v-form ref="form">

          <v-layout wrap>
            <v-flex xs12>
              <v-subheader class="px-0">Ngày làm việc *</v-subheader>
            </v-flex>
            <v-flex xs12>
              <v-select
                v-model="workTimeModel.day"
                :items="daysOfWeek"
                item-text="text"
                item-value="value"
                :rules="[v => (v!==undefined && v!=='' && Number(v) >= 0 && Number(v) <= 6 ) || 'Ngày làm việc bắt buộc chọn từ thứ hai đến chủ nhật']"
                required
                :disabled="isDetail"
              ></v-select>
            </v-flex>
          </v-layout>
          <v-flex xs12>
            <v-subheader class="px-0">Buổi sáng</v-subheader>
          </v-flex>
          <v-layout wrap>
            <v-flex xs6>
              <v-layout wrap>
                <v-flex xs12>
                  <v-subheader class="px-0">Từ *</v-subheader>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    :rules="[rules.required, rules.typeHour]"
                    v-model="startMorning"
                    @input="changestartMorning"
                    placeholder="08.00"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs6 pl-2>
              <v-layout wrap>
                <v-flex xs12>
                  <v-subheader class="px-0">đến *</v-subheader>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                  :rules="[rules.required, rules.typeHour]"
                    v-model="endMorning"
                    placeholder="12.00"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-flex xs12>
            <v-subheader class="px-0">Buổi chiều</v-subheader>
          </v-flex>
          <v-layout wrap>
            <v-flex xs6 pl-2>
              <v-layout wrap>
                <v-flex xs12>
                  <v-subheader class="px-0">Từ *</v-subheader>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    :rules="[rules.required, rules.typeHour]"
                    v-model="startAfternoon"
                    placeholder="13.30"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs6 pl-2>
              <v-layout wrap>
                <v-flex xs12>
                  <v-subheader class="px-0">đến *</v-subheader>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    :rules="[rules.required, rules.typeHour]"
                    v-model="endAfternoon"
                    placeholder="17.30"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-btn
            :disabled="isLoading"
            :loading="isLoading"
            @click="workTimeSubmit"
            class="right"
            color="primary"
          >
            <v-icon>save</v-icon>
            {{title}}
          </v-btn>
          <v-btn v-if="!isDetail" @click="$emit('canceladdnew', true)"
            class="right"
            color="primary"
          >
            <v-icon>cancel</v-icon>
            Quay lại
          </v-btn>
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
    workTime: {
      type: Object,
      default: {}
    },
    daysOfWeek: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      workTimeModel: this.workTime,
      workTimeDefault: {
        day: 1,
        hours: '08.00-12.00  13.30-18.00'
      },
      isLoading: false,
      startMorning: '',
      endMorning: '',
      startAfternoon: '',
      endAfternoon: '',
      rules: {
        required: value => !!value || 'Trường thông tin bắt buộc phải nhập',
        typeHour: value => {
          // const pattern = /^([0-9]{2}-[0-9]{2})$/
          // return pattern.test(value) || 'Invalid e-mail.'
          try {
            let valuex = value.split('.')
            let v1 = Boolean(
              valuex[0].length === 2 &&
              Number(valuex[0]) >= 0 &&
              Number(valuex[0]) < 24)
            let v2 = Boolean(
              valuex[1].length === 2 &&
              Number(valuex[1]) >= 0 &&
              Number(valuex[1]) < 60)
            return (v1 && v2 && valuex.length === 2) || 'Sai định dạng giờ HH.mm'
          } catch (err) {
            return 'Sai định dạng giờ HH.mm'
          }
        }
      }
    }
  },
  components: {
  },
  created () {
    // let vm = this
    this.$nextTick(function () {
      // vm.workTimeModel = vm.workTime
    })
  },
  computed: {
    staticRouter () {
      return this.$store.getters.staticRouter
    },
    title () {
      if (this.isDetail) {
        return 'Chỉnh sửa ngày làm việc'
      } else {
        return 'Thêm ngày làm việc'
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      // this.setWorktimeMapped(this.workTime)
    })
  },
  watch: {
    isDetail (val) {
      if (val) {
        this.setWorktimeMapped(this.workTime)
      } else {
        this.setWorktimeMapped(this.workTimeDefault)
      }
    },
    workTime (val) {
      let vm = this
      if (val !== vm.workTimeModel) {
        this.setWorktimeMapped(val)
      }
    }
  },
  methods: {
    setWorktimeMapped (workTime) {
      this.workTimeModel = workTime
      this.startMorning = workTime.hours.slice(0, 5)
      this.endMorning = workTime.hours.slice(6, 11)
      this.startAfternoon = workTime.hours.slice(13, 18)
      this.endAfternoon = workTime.hours.slice(19, 24)
    },
    test (value) {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(value) || false
    },
    changestartMorning () {
      let vm = this
      vm.test(vm.startMorning)
    },
    detailWorkTime () {
      let vm = this
      vm.isLoading = true
      this.$store.dispatch('workTime/readWorkTime', 1).then(response => {
        vm.isLoading = false
        console.log('Got some data, now lets show something in this component', response)
      }, error => {
        vm.isLoading = false
        console.log('Got nothing from server. Prompt user to check internet connection and try again', error)
      })
    },
    workTimeSubmit () {
      let vm = this
      let workTime = {
        day: vm.workTimeModel.day
      }
      workTime.hours = vm.startMorning + '-' + vm.endMorning + '  ' +
        vm.startAfternoon + '-' + vm.endAfternoon
      if (this.isDetail && this.$refs.form.validate()) {
        this.editWorkTime(workTime)
      } else if (this.$refs.form.validate()) {
        this.addWorkTime(workTime)
      }
    },
    addWorkTime (workTime) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Thêm mới dữ liệu...'
      })
      this.$store.dispatch('workTime/createWorkTime', workTime).then(response => {
        vm.isLoading = false
        window.showMessageToastr('success', 'Thêm mới dữ liệu thành công')
        vm.$emit('addworktimesuccess', response)
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
    editWorkTime (workTime) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Cập nhật dữ liệu...'
      })
      this.$store.dispatch('workTime/updateWorkTime', workTime).then(response => {
        vm.isLoading = false
        window.showMessageToastr('success', 'Cập nhật dữ liệu thành công')
        vm.$emit('editworktimesuccess', response)
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
    }
  }
}
</script>

<style scoped>
.navifilter-view {
  width: 100%;
}
</style>

