<template>
  <div class="navifilter-view scrollChildClass box">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex my-1">
          <v-icon>{{staticRouter.icon}}</v-icon>
          Phân quyền truy cập - {{ itemDetail.name }}
        </div>
      </template>
    </jx-mobilink-toolbar>
    
    <v-layout wrap>
      <v-flex xs12>
        <v-layout wrap class="mt-2 align-center d-flex state-detail-class" v-for="(item,index) in accessPermissionDetailItems" :key="index">
          <v-flex xs11>
            {{ item.name }}
          </v-flex>
          <v-flex xs1>
            <v-icon v-if="item.view" @click="checkPermission(item)" style="float: right;color: #039be5 !important;" class="pointer">check_box</v-icon>
            <v-icon v-else @click="checkPermission(item)" style="float: right;color: #039be5 !important;" class="pointer">check_box_outline_blank</v-icon>
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
      valid: '',
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
      accessPermissionDetailItems: '',
      itemDetail: ''
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
    initGetData (item) {
      let vm = this
      vm.itemDetail = item
      let params = {
        start: -1,
        end: -1,
        className: item.className,
        subclass: item.subclass
      }
      const config = {
        params: params,
        headers: {
          'groupId': vm.group_id
        }
      }
      window.axios.get(vm.end_point + 'layoutconfigs/' + item.plid + '/roles',
        config
      )
        .then(function (response) {
          let serializable = response.data
          vm.accessPermissionDetailItems = serializable.data
        })
        .catch(function (error) {
          console.log(error.response)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    },
    checkPermission (item) {
      let vm = this
      let configData = {
        headers: {
          'groupId': vm.group_id
        }
      }
      let params
      if (item.view === false) {
        params = {
          action: 'view',
          actionValue: true
        }
      } else {
        params = {
          action: 'view',
          actionValue: false
        }
      }
      window.axios.put(vm.end_point + 'layoutconfigs/' + vm.itemDetail.plid + '/roles/' + item.roleId,
        params,
        configData
      )
        .then(function (response) {
          // setTimeout(function () {
          //   vm.initGetData(vm.itemDetail)
          // }, 500)
          item.view = response.data.view
          window.showMessageToastr('success', 'Cập nhật dữ liệu thành công')
        })
        .catch(function (error) {
          console.log(error.response)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
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
  .state-detail-class {
    border-bottom: 1px dashed #EEE;
    padding-bottom: 10px;
  }
  .checkPermissionClass .input-group__details {
    display: none;
  }
</style>
