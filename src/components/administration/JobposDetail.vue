<template>
  <div class="navifilter-view scrollChildClass box"">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex my-1">
          <v-icon>{{staticRouter.icon}}</v-icon>
          {{title}}&nbsp;<span v-if="isDetail"> - {{ jobposModel.title }}</span>
        </div>
      </template>
    </jx-mobilink-toolbar>
    
    <v-layout wrap>
      <v-flex xs12>

        <v-form ref="form">

          <v-layout wrap>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Mã nhóm chức năng *</v-subheader>
              <v-text-field
                placeholder="Mã nhóm chức năng"
                v-model="jobposModel.code"
                :disabled="isDetail"
                :rules="[codeRules.required, codeRules.uniqueCode]"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Tên nhóm chức năng *</v-subheader>
              <v-text-field
                placeholder="Tên nhóm chức năng"
                v-model="jobposModel.title"
                :rules="[value => !!value || 'Tên nhóm chức năng bắt buộc phải nhập']"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Quyền hạn</v-subheader>
              <v-select
                v-bind:items="jobposPermissionItems"
                v-model="jobposModel.permissionszzz"
                item-text="actionId"
                item-value="actionId"
                autocomplete
                hide-selected
                multiple
                chips
                deletable-chips
                return-object
                placeholder="Quyền hạn"
                no-data-text=""
              >
                <template slot="selection" slot-scope="data">
                    <v-chip
                        close
                        @input="data.parent.selectItem(data.item)"
                        :selected="data.selected"
                        class="chip--select-multi"
                        :key="JSON.stringify(data.item)"
                    >
                        {{ data.item.actionId }}
                    </v-chip>
                </template>
                <template slot="item" slot-scope="data">
                  {{ data.item.actionId }}
                </template>
              </v-select>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Mô tả</v-subheader>
              <v-text-field
                placeholder="Mô tả"
                v-model="jobposModel.description"
                multi-line :rows="3"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn
                class="right"
                color="primary"
                :disabled="isLoading"
                :loading="isLoading"
                @click="jobposSubmit"
              >
                <v-icon>save</v-icon>
                {{title}}
              </v-btn>
              <v-btn @click="cancelChangeJobpos"
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
    jobpos: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      jobposModel: {},
      jobposDefault: {
        code: '',
        createDate: '',
        description: '',
        jobPosId: 0,
        modifiedDate: '',
        permissions: [],
        title: ''
      },
      isLoading: false,
      readly: false,
      codeRules: {
        required: value => !!value || 'Mã nhóm chức năng bắt buộc phải nhập',
        uniqueCode: value => {
          const indexxx = this.jobposParentItems.findIndex(item => String(item.code) === String(value))
          return indexxx === -1 || 'Mã nhóm chức năng đã tồn tại'
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
        return 'Chỉnh sửa nhóm chức năng'
      } else {
        return 'Thêm nhóm chức năng mới'
      }
    },
    jobposParentItems () {
      return this.isDetail
        ? []
        : this.$store.getters['allJobposItems']
    }
  },
  mounted () {
    this.$nextTick(() => {
      // const s = this.jobpos
      // this.jobposModel = s
      this.dispatchAllJobpos()
      this.readly = true
    })
  },
  watch: {
    isDetail (val) {
      if (val) {
        this.setJobposMapped(this.jobpos)
      } else {
        this.setJobposMapped(this.jobposDefault)
      }
    },
    jobpos (val) {
      this.setJobposMapped(val)
    }
  },
  methods: {
    detailJobpos () {
      let vm = this
      this._detailJobpos = vm.jobpos.jobPosId
      vm.isLoading = true
      this.$store.dispatch('jobpos/readJobpos', vm.jobpos.jobPosId).then(response => {
        vm.isLoading = false
        vm.setJobposMapped(response)
      }, error => {
        vm.isLoading = false
        console.log('Got nothing from server. Prompt user to check internet connection and try again', error)
        vm.jobposModel.permissionszzz = vm.jobposDefault.permissions
      })
    },
    jobposSubmit () {
      let vm = this
      let params = {}
      for (const key in vm.jobposModel) {
        params[key] = vm.jobposModel[key] === null ? '' : vm.jobposModel[key]
      }
      Object.assign(params, vm.getPermissions(vm.jobposModel.permissionszzz))
      if (this.isDetail && this.$refs.form.validate()) {
        this.editJobpos(params)
      } else if (this.$refs.form.validate()) {
        this.addJobpos(params)
      }
    },
    addJobpos (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Thêm mới dữ liệu...'
      })
      this.$store.dispatch('jobpos/createJobpos', params).then(response => {
        vm.isLoading = false
        vm.dispatchAllJobpos()
        vm.$emit('addJobpossuccess', response)
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
    editJobpos (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Cập nhật dữ liệu...'
      })
      this.$store.dispatch('jobpos/updateJobpos', params).then(response => {
        vm.isLoading = false
        vm.$emit('editJobpossuccess', response)
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
    setJobposMapped (jobpos) {
      let jobposModel = {}
      for (const key in this.jobposDefault) {
        if (key === 'permissions') {
          jobposModel['permissionszzz'] = this.setPermissions(jobpos[key] || this.jobposDefault[key])
        } else {
          jobposModel[key] = jobpos[key]
        }
      }
      Object.assign(this.jobposModel, jobposModel)
      if (jobpos.jobPosId && jobpos.jobPosId !== this._detailJobpos) {
        this.detailJobpos()
      }
    },
    setPermissions (permissions) {
      const checker = permissions
      if (checker && checker.length > 0) {
        return checker
      } else if (checker && checker.actionId) {
        return [checker]
      } else {
        return []
      }
    },
    getPermissions (val) {
      if (val && val.length) {
        return {permissions: JSON.stringify(val)}
      } else {
        return {permissions: ''}
      }
    },
    cancelChangeJobpos () {
      if (this.isDetail) {
        this.setJobposMapped(this.jobpos)
      } else {
        this.$emit('canceladdnew', true)
      }
    },
    dispatchAllJobpos () {
      let vm = this
      setTimeout(() => {
        vm.$store.dispatch('getAllJobposItems', {
          start: -1,
          end: -1
        })
      }, 500)
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
