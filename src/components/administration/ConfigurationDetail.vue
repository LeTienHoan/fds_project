<template>
  <div class="navifilter-view scrollChildClass box">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex my-1">
          <v-icon>{{staticRouter.icon}}</v-icon>
          Cấu hình - {{ keyConfig }}
        </div>
      </template>
    </jx-mobilink-toolbar>
    
    <v-layout wrap>
      <v-flex xs12>
        <v-form ref="form" lazy-validation>
          <v-layout wrap v-for="(item,index) in config" :key="index" class="mt-2">
            <v-flex xs2>
              <v-text-field
                class="keyClass"
                placeholder="index"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
                v-model="item.key"
                disabled
              ></v-text-field>
            </v-flex>
            <v-flex xs12 >
              <v-text-field 
                placeholder="value"
                v-model="item.value" 
                multi-line :rows="4">
              </v-text-field>
            </v-flex>
            <!-- <v-flex xs2 class="pl-3">
              <v-text-field
                placeholder="index"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
                v-model="item.dataType"
                disabled
              ></v-text-field>
            </v-flex> -->
          </v-layout>
        </v-form>
        <v-layout wrap class="mt-2">
          <v-flex xs12 class="text-xs-right">
            <v-btn small class="primary" @click="saveConfig"><v-icon class="mr-1">save</v-icon>Lưu</v-btn>
          </v-flex>
        </v-layout>
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
    }
  },
  data () {
    return {
      keyModel: '',
      isLoading: false,
      readly: false,
      typeItems: [
        {
          id: 1,
          name: 'Text'
        }, {
          id: 2,
          name: 'Json'
        }, {
          id: 3,
          name: 'Xml'
        }, {
          id: 4,
          name: 'Number'
        }, {
          id: 5,
          name: 'Base 64'
        }
      ],
      typeModelModel: 1,
      config: '',
      keyConfig: ''
    }
  },
  components: {
  },
  computed: {
    staticRouter () {
      return this.$store.getters.staticRouter
    },
    title () {
    }
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  watch: {
    isDetail (val) {
      if (val) {
      }
    }
  },
  methods: {
    initGetData (item, index) {
      let vm = this
      vm.config = item
      vm.keyConfig = index
    },
    saveConfig () {
      let vm = this
      let configData = {
        headers: {
          'groupId': vm.group_id
        }
      }
      if (this.$refs.form.validate()) {
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Cập nhật dữ liệu...'
        })
        let obj = {
          [vm.keyConfig]: vm.config
        }
        let dataPutConfig = new URLSearchParams()
        dataPutConfig.append('configuration', JSON.stringify(obj))
        window.axios.put(vm.end_point + 'systemconfigs',
          dataPutConfig,
          configData
        )
          .then(function (response) {
            vm.$emit('editConfig', response.data, vm.keyConfig)
            window.showMessageToastr('success', 'Cập nhật dữ liệu thành công')
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
  .keyClass .input-group__input input {
    text-transform: uppercase!important;
  }
</style>
