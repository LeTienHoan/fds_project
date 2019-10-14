<template>
  <div class="navifilter-view scrollChildClass box">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex my-1">
          <v-icon>{{staticRouter.icon}}</v-icon>
          {{ title }}&nbsp;<span v-if="isDetail"> - {{ widget.widgetName }}</span>
        </div>
      </template>
    </jx-mobilink-toolbar>
    <v-layout wrap>
      <v-flex xs12>
        <v-form ref="form">
          <v-layout wrap>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">WidgetName *</v-subheader>
              <v-text-field
                placeholder="WidgetName"
                v-model="widget.widgetName"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">WidgetCode *</v-subheader>
              <v-text-field
                placeholder="WidgetCode"
                v-model="widget.widgetCode"
                :rules="[widgetCodeRules.required, widgetCodeRules.uniqueCode]"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Mã ftl</v-subheader>
              <v-text-field v-model="widget.widgetTemplate" multi-line :rows="15" solo label="Mã ftl"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 class="text-xs-right mt-3">
              <v-btn color="primary" class="btn--small" @click="cancelWidget">Hủy</v-btn>
              <v-btn
                class="right btn--small"
                color="primary"
                :disabled="isLoading"
                :loading="isLoading"
                @click="widgetSubmit"
                >
                {{title}}
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
    widget: {
      type: Object,
      default: {}
    },
    end_point_widget: null
  },
  data () {
    return {
      isLoading: false,
      readly: false,
      widgetAllItems: [],
      widgetCodeRules: {
        required: value => !!value || 'Trường dữ liệu bắt buộc',
        uniqueCode: value => {
          const indexxx = this.widgetAllItems.findIndex(item => String(item.widgetCode) === String(value))
          return indexxx === -1 || this.isDetail || 'WidgetCode đã tồn tại'
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
        return 'Chỉnh sửa Widget'
      } else {
        this.getApiAllWidget()
        return 'Thêm mới Widget'
      }
    },
    widgetObj () {
      return this.$store.state.widgetObj
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.readly = true
    })
  },
  watch: {
    isDetail (val) {
      if (val) {
      } else {
        this.widget = {}
      }
    }
  },
  methods: {
    getApiAllWidget () {
      let vm = this
      let params = {
        start: -1,
        end: -1
      }
      const config = {
        params: params,
        headers: {
          'groupId': vm.group_id
        }
      }
      window.axios.get(vm.end_point_widget + 'widgettypes',
        config
      )
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.widgetAllItems = serializable.data
          } else {
            vm.widgetAllItems = []
          }
        })
        .catch(function (error) {
          console.log(error.response)
        })
    },
    widgetSubmit () {
      let vm = this
      const config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      if (this.$refs.form.validate()) {
        if (vm.isDetail) {
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Cập nhật dữ liệu...'
          })
          window.axios.put(vm.end_point_widget + 'widgettypes/' + vm.widget.widgetTypeId,
            vm.widget,
            config
          )
            .then(function (response) {
              vm.$emit('updateWidget', response.data)
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
        } else {
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Thêm mới dữ liệu...'
          })
          window.axios.post(vm.end_point_widget + 'widgettypes',
            vm.widget,
            config
          )
            .then(function (response) {
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              vm.$emit('addWidget', response.data)
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
    },
    cancelWidget () {
      let vm = this
      if (vm.isDetail) {
        vm.widget = vm.widgetObj
      } else {
        vm.widget = {}
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
