<template>
  <div class="navifilter-view scrollChildClass box">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex my-1">
          <v-icon>{{staticRouter.icon}}</v-icon>
          {{title}}&nbsp;<span v-if="isDetail"> - {{ workingUnitModel.name }}</span>
        </div>
      </template>
    </jx-mobilink-toolbar>
    
    <v-layout wrap>
      <v-flex xs12>

        <v-form ref="form">

          <v-layout wrap>
            <v-flex xs12 sm6 class="px-2">
              <v-subheader class="px-0">Mã phòng ban *</v-subheader>
              <v-text-field
                placeholder="Mã phòng ban"
                v-model="workingUnitModel.govAgencyCode"
                :disabled="isDetail"
                :rules="[govAgencyCodeRules.required, govAgencyCodeRules.uniqueCode]"
                class="input-uppercase"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2">
              <v-subheader class="px-0">Tên phòng ban *</v-subheader>
              <v-text-field
                placeholder="Tên phòng ban"
                v-model="workingUnitModel.name"
                :rules="[value => !!value || 'Tên phòng ban bắt buộc phải nhập']"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2">
              <v-subheader class="px-0">Tên tiếng anh</v-subheader>
              <v-text-field 
                v-model="workingUnitModel.enName"
                placeholder="Tên tiếng anh"  
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2">
              <v-subheader class="px-0">Phòng ban cấp trên</v-subheader>
              <v-select
                :items="workingUnitParentItems"
                item-text="name"
                item-value="workingUnitId"
                autocomplete
                v-model="workingUnitModel.parentWorkingUnitId"
                clearable
                placeholder="Phòng ban cấp trên"
                no-data-text=""
              ></v-select>
            </v-flex>
            <v-flex xs12 sm6 class="px-2">
              <v-subheader class="px-0">Ngày thành lập</v-subheader>
              <custome-date-time
                :id="1"
                :datetimevalue="workingUnitModel.ceremonyDate"
                autocomplate
                :format="localeDateProperties.dateMomentPattern"
                placeholder="Ngày thành lập"
                :onlydate="true"
                :clearable="true"
                @syncxxx="(val) => (workingUnitModel.ceremonyDate = setCeremonyDate(val))"
              >
              </custome-date-time>
            </v-flex>
            <v-flex xs12 sm6 class="px-2">
              <v-subheader class="px-0">Người lãnh đạo</v-subheader>
              <v-select 
                v-bind:items="getUserItems"
                v-model="workingUnitModel.leaderId"
                item-text="fullName"
                item-value="userId"
                autocomplete
                hide-selected
                clearable
                no-data-text=""
                :filter="customFilterUser"
                placeholder="Người lãnh đạo"
              >
                <template slot="item" slot-scope="data">
                  <template>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="data.item.fullName"></v-list-tile-title>
                      <v-list-tile-sub-title v-html="data.item.email"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </template>
                </template>
              </v-select>
            </v-flex>
            <v-flex xs12 sm6 class="px-2">
              <v-subheader class="px-0">Địa chỉ</v-subheader>
              <v-text-field 
                v-model="workingUnitModel.address"
                placeholder="Địa chỉ"  
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2">
              <v-subheader class="px-0">Số điện thoại</v-subheader>
              <v-text-field
                placeholder="Số điện thoại"
                v-model="workingUnitModel.telNo"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2">
              <v-subheader class="px-0">Số fax</v-subheader>
              <v-text-field
                placeholder="Số fax"
                v-model="workingUnitModel.faxNo"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2">
              <v-subheader class="px-0">Email</v-subheader>
              <v-text-field
                placeholder="Email"
                v-model="workingUnitModel.email"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2">
              <v-subheader class="px-0">Website</v-subheader>
              <v-text-field
                placeholder="Website"
                v-model="workingUnitModel.website"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2">
              <v-subheader class="px-0">Số thứ tự cùng cấp</v-subheader>
              <v-text-field
                placeholder="Số thứ tự cùng cấp"
                v-model="workingUnitModel.sibling"
                :disabled="true"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn
                class="right"
                color="primary"
                :disabled="isLoading"
                :loading="isLoading"
                @click="workingUnitSubmit"
              >
                <v-icon>save</v-icon>
                {{title}}
              </v-btn>
              <v-btn @click="cancelChangeWorkingUnit"
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
    workingUnit: {
      type: Object,
      default: {}
    },
    workingUnitParentItems: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      workingUnitModel: {},
      workingUnitDefault: {
        workingUnitId: 0,
        parentWorkingUnitId: 0,
        leaderId: 0,
        govAgencyCode: '',
        name: '',
        enName: '',
        address: '',
        telNo: '',
        faxNo: '',
        email: '',
        website: '',
        sibling: 0,
        ceremonyDate: ''
      },
      isLoading: false,
      readly: false,
      govAgencyCodeRules: {
        required: value => !!value || 'Mã phòng ban bắt buộc phải nhập',
        uniqueCode: value => {
          const indexxx = this.workingUnitParentItems.findIndex(item => String(item.govAgencyCode) === String(value))
          return indexxx === -1 || 'Mã phòng ban đã tồn tại'
        }
      }
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
        return 'Chỉnh sửa phòng ban'
      } else {
        return 'Thêm phòng ban mới'
      }
    },
    getUserItems () {
      return this.$store.getters['user/userItems']
    },
    // deprecated
    getParentWorkingUnitItems () {
      let vm = this
      return this.$store.getters['workingUnit/workingUnitItems'].filter(item => {
        if (!vm.isDetail) {
          return true
        } else {
          const checkIsChildren = item.parentList.find(itemP => {
            return itemP.id === vm.workingUnit.workingUnitId
          })
          return !(checkIsChildren && checkIsChildren.id > 0) && (item.workingUnitId !== vm.workingUnit.workingUnitId)
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      // const s = this.workingUnit
      // this.setWorkingUnitMapped(s)
      this.runDispatchUser()
      this.readly = true
    })
  },
  watch: {
    isDetail (val) {
      if (val) {
        this.setWorkingUnitMapped(this.workingUnit)
      } else {
        this.setWorkingUnitMapped(this.workingUnitDefault)
      }
    },
    workingUnit (val) {
      this.setWorkingUnitMapped(val)
    }
  },
  methods: {
    detailWorkingUnit () {
      let vm = this
      this._detailWorkingUnit = vm.workingUnit.workingUnitId
      vm.isLoading = true
      this.$store.dispatch('workingUnit/readWorkingUnit', vm.workingUnit.workingUnitId).then(response => {
        vm.isLoading = false
        vm.setWorkingUnitMapped(response)
      }, error => {
        vm.isLoading = false
        console.log('Got nothing from server. Prompt user to check internet connection and try again', error)
      })
    },
    runDispatchUser () {
      let vm = this
      if (!vm.runedDispatchUser) {
        this.$store.dispatch('user/getUserItems', {
          class: 'employee',
          start: -1,
          end: -1
        }).then(response => {
          vm.runedDispatchUser = true
        }, error => {
          console.log(error)
        })
      }
    },
    workingUnitSubmit () {
      let vm = this
      const params = {}
      for (const key in vm.workingUnitModel) {
        params[key] = vm.workingUnitModel[key] === null ? '' : vm.workingUnitModel[key]
      }
      Object.assign(params, {
        ceremonyDate: vm.workingUnitModel.ceremonyDate ? window.moment(vm.workingUnitModel.ceremonyDate).format('YYYYMMDD') : ''
      }, vm.getLeaderId(vm.workingUnitModel.leaderId))
      if (this.isDetail && this.$refs.form.validate() && this.invalidParentWorkingUnit(vm.workingUnitModel.workingUnitId, vm.workingUnitModel.parentWorkingUnitId)) {
        this.editWorkingUnit(params)
      } else if (!this.isDetail && this.$refs.form.validate()) {
        this.addWorkingUnit(params)
      }
    },
    addWorkingUnit (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Thêm mới dữ liệu...'
      })
      this.$store.dispatch('workingUnit/createWorkingUnit', params).then(response => {
        vm.isLoading = false
        vm.$emit('addWorkingUnitsuccess', response)
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
    editWorkingUnit (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Cập nhật dữ liệu...'
      })
      this.$store.dispatch('workingUnit/updateWorkingUnit', params).then(response => {
        vm.isLoading = false
        vm.$emit('editWorkingUnitsuccess', response)
        window.showMessageToastr('success', 'Cập nhật dữ liệu thành công')
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
    setWorkingUnitMapped (workingUnit) {
      let workingUnitModel = {}
      for (const key in this.workingUnitDefault) {
        if (key === 'ceremonyDate') {
          workingUnitModel[key] = this.setCeremonyDate(workingUnit[key] || this.workingUnitDefault[key])
        } else {
          workingUnitModel[key] = workingUnit[key] || this.workingUnitDefault[key]
        }
      }
      this.workingUnitModel = workingUnitModel
      if (workingUnit.workingUnitId && workingUnit.workingUnitId !== this._detailWorkingUnit) {
        this.detailWorkingUnit()
      }
    },
    setCeremonyDate (timeStamp) {
      if (timeStamp && Number(timeStamp) > 0) {
        return new Date(Number(timeStamp))
      } else if (timeStamp) {
        return timeStamp
      } else {
        return ''
      }
    },
    getLeaderId (id) {
      const user = this.getUserItems.find(item => String(item.userId) === String(id))
      return {leaderId: (user ? (user.classPK || 0) : 0)}
    },
    cancelChangeWorkingUnit () {
      if (this.isDetail) {
        this.setWorkingUnitMapped(this.workingUnit)
      } else {
        this.$emit('canceladdnew', true)
      }
    },
    invalidParentWorkingUnit (id, parent) {
      /**
      if (parent && parent !== this.workingUnit.parentWorkingUnitId) {
        // check thang dang duoc chon co con hoac thang cha duoc chon co cha
        let check = this.workingUnitParentItems.findIndex(item => {
          return item.parentWorkingUnitId === id || (item.workingUnitId === parent && item.parentWorkingUnitId)
        })
        if (check >= 0) {
          window.showMessageToastr('error', 'Không được thay đổi phòng ban cha')
          return false
        } else {
          return true
        }
      } else {
        return true
      } */
      return true
    }
  }
}
</script>

<style scoped>
.navifilter-view {
  width: 100%;
}

.custome-subheader-with-icon {
    display: -webkit-flex; /* Safari */
    -webkit-align-items: center; /* Safari 7.0+ */
    display: flex;
    align-items: center;
}
.custome-subheader-with-icon div {
    -webkit-flex: 1; /* Safari 6.1+ */
    flex: 1;
}
</style>
<style>
.input-uppercase input{
  text-transform: uppercase
}
</style>
