<template>
  <div class="navifilter-view scrollChildClass box">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex my-1">
          <v-icon>{{staticRouter.icon}}</v-icon>
          {{title}}&nbsp;<span v-if="isDetail"> - {{ locationModel.location }}</span>
        </div>
      </template>
    </jx-mobilink-toolbar>
    
    <v-layout wrap>
      <v-flex xs12>

        <v-form ref="form">

          <v-layout wrap>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Tên địa điểm *</v-subheader>
            </v-flex>
            <v-flex xs12 sm12>
              <v-text-field
                placeholder="Tên địa điểm"
                v-model="locationModel.location"
                :rules="[value => !!value || 'Tên địa điểm bắt buộc phải nhập']"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Geolocation</v-subheader>
            </v-flex>
            <v-flex xs12 sm12>
              <v-text-field
                placeholder="Geolocation"
                v-model="locationModel.geolocation"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn
                class="right"
                color="primary"
                :disabled="isLoading"
                :loading="isLoading"
                @click="locationSubmit"
              >
                <v-icon>save</v-icon>
                {{title}}
              </v-btn>
              <v-btn @click="cancelChangeLocation"
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
    location: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      locationModel: {},
      locationDefault: {
        locationId: 0,
        location: '',
        geolocation: ''
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
        return 'Chỉnh sửa địa điểm'
      } else {
        return 'Thêm địa điểm'
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      // const s = this.location
      // this.locationModel = s
      this.readly = true
    })
  },
  watch: {
    isDetail (val) {
      if (val) {
        this.setLocationMapped(this.location)
      } else {
        this.setLocationMapped(this.locationDefault)
      }
    },
    location (val) {
      this.setLocationMapped(val)
    }
  },
  methods: {
    locationSubmit () {
      let vm = this
      const params = {
        locationId: vm.locationModel.locationId,
        location: vm.locationModel.location,
        geolocation: vm.locationModel.geolocation
      }
      if (this.isDetail && this.$refs.form.validate()) {
        this.editLocation(params)
      } else if (this.$refs.form.validate()) {
        this.addLocation(params)
      }
    },
    addLocation (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Thêm mới dữ liệu...'
      })
      this.$store.dispatch('location/createLocation', params).then(response => {
        vm.isLoading = false
        vm.$emit('addlocationsuccess', response)
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        window.showMessageToastr('success', 'Thêm mới dữ liệu thành công')
      }, error => {
        console.log(error)
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        window.showMessageByAPICode(error.response.status, error.response.data)
        vm.isLoading = false
      })
    },
    editLocation (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Cập nhật dữ liệu...'
      })
      this.$store.dispatch('location/updateLocation', params).then(response => {
        vm.isLoading = false
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        window.showMessageToastr('success', 'Cập nhật dữ liệu thành công')
        vm.$emit('editlocationsuccess', response)
      }, error => {
        console.log(error)
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        window.showMessageByAPICode(error.response.status, error.response.data)
        vm.isLoading = false
      })
    },
    setLocationMapped (location) {
      this.locationModel = {
        locationId: location.locationId,
        location: location.location,
        geolocation: location.geolocation
      }
    },
    cancelChangeLocation () {
      if (this.isDetail) {
        this.setLocationMapped(this.location)
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

