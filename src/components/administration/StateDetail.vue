<template>
  <div class="navifilter-view scrollChildClass box">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex my-1">
          <v-icon>{{staticRouter.icon}}</v-icon>
          Quy trình
        </div>
      </template>
    </jx-mobilink-toolbar>
    
    <v-layout wrap>
      <v-flex xs12>
        <v-layout wrap class="mt-2 align-center d-flex state-detail-class" v-for="(item,index) in stateDetailItems" :key="index">
          <v-flex xs11>
            <custome-editable v-if="item.stateTransitionId"
              type="text"
              :text_options = "{
                 text: JSON.stringify(item),
                 multiline: true,
                  rows: 5
                }"
              post="put"
              :api_update="end_point + 'statetransitions/' + item.stateTransitionId"
              key_update="body"
              @update-success="updateEditableSuccess"
              :permission="'owner'"
            >
            </custome-editable>
            <custome-editable v-else
              type="text"
              :text_options = "{
                 text: JSON.stringify(item),
                 multiline: true,
                  rows: 5
                }"
              post="post"
              :api_update="end_point + 'statetransitions'"
              key_update="body"
              @update-success="updateEditableSuccess"
              :permission="'owner'"
            >
            </custome-editable>
          </v-flex>
          <v-flex xs1>
            <v-icon @click="addOneState" class="pointer">add_circle</v-icon>
            <v-icon @click="removeOneState(item.stateTransitionId, index)" class="pointer">remove_circle</v-icon>
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
      stateDetailItems: '',
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
      window.axios.get(vm.end_point + 'statetransitions',
        config
      )
        .then(function (response) {
          let serializable = response.data
          vm.stateDetailItems = serializable.data
        })
        .catch(function (error) {
          console.log(error.response)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    },
    addOneState () {
      this.stateDetailItems.push({
      })
    },
    updateEditableSuccess (val) {
      this.initGetData(this.itemDetail)
    },
    removeOneState (stateTransitionId, index) {
      let vm = this
      let configData = {
        headers: {
          'groupId': vm.group_id
        }
      }
      if (!stateTransitionId) {
        this.stateDetailItems.splice(index, 1)
      } else {
        vm.$dialog.confirm('Bạn muốn xóa dữ liệu', {
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
            window.axios.delete(vm.end_point + 'statetransitions/' + stateTransitionId,
              configData
            )
              .then(function (response) {
                vm.stateDetailItems.splice(index, 1)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageToastr('success', 'Xóa dữ liệu thành công')
              })
              .catch(function (error) {
                console.log(error.response)
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
  .state-detail-class {
    border-bottom: 1px dashed #EEE;
    padding-bottom: 10px;
  }
</style>
