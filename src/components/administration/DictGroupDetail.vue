<template>
  <div class="navifilter-view scrollChildClass box">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex my-1">
          <v-icon>{{staticRouter.icon}}</v-icon>
          {{title}}&nbsp;<span v-if="isDetail"> - {{ dictGroupModel.groupName }}</span>
        </div>
      </template>
    </jx-mobilink-toolbar>
    
    <v-layout wrap>
      <v-flex xs12>

        <v-form ref="form">
          <v-layout wrap>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Mã nhóm *</v-subheader>
              <v-text-field
                placeholder="Mã nhóm"
                v-model="dictGroupModel.groupCode"
                :disabled="isDetail"
                :rules="[groupCodeRules.required, groupCodeRules.uniqueCode]"
                class="input-uppercase"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Tên nhóm *</v-subheader>
              <v-text-field
                placeholder="Tên nhóm"
                v-model="dictGroupModel.groupName"
                :rules="[value => !!value || 'Tên nhóm bắt buộc phải nhập']"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Tên tiếng anh</v-subheader>
              <v-text-field 
                v-model="dictGroupModel.groupNameEN"
                placeholder="Tên tiếng anh"  
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 v-if="false">
              <v-subheader class="px-0">Nhóm danh mục cha</v-subheader>
              <v-select
                :items="dictGroupParentItems"
                item-text="groupName"
                item-value="groupCode"
                v-model="dictGroupModel.parentItem"
                placeholder="Nhóm danh mục cha"
                no-data-text=""
                autocomplete
              ></v-select>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Danh mục</v-subheader>
              <v-select
                v-bind:items="dictItemItems"
                v-model="dictGroupModel.dictItems"
                item-text="itemName"
                item-value="itemCode"
                autocomplete
                hide-selected
                multiple
                chips
                deletable-chips
                return-object
                placeholder="Danh mục"
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
                    {{ data.item.itemName }}
                  </v-chip>
                </template>
                <template slot="item" slot-scope="data">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="data.item['itemName']"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="data.item['itemCode']"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </template>
              </v-select>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Mô tả</v-subheader>
              <v-text-field
                placeholder="Mô tả"
                v-model="dictGroupModel.groupDescription"
                multi-line :rows="3"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn
                class="right"
                color="primary"
                :disabled="isLoading"
                :loading="isLoading"
                @click="dictGroupSubmit"
              >
                <v-icon>save</v-icon>
                {{title}}
              </v-btn>
              <v-btn @click="cancelChangeDictGroup"
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
    dictGroup: {
      type: Object,
      default: {}
    },
    collectionCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dictGroupModel: {},
      dictGroupDefault: {
        groupCode: '',
        createDate: '',
        groupDescription: '',
        dictGroupId: 0,
        modifiedDate: '',
        groupNameEN: '',
        groupName: '',
        dictItems: [],
        parentItem: ''
      },
      isLoading: false,
      readly: false,
      groupCodeRules: {
        required: value => !!value || 'Mã nhóm bắt buộc phải nhập',
        uniqueCode: value => {
          const indexxx = this.dictGroupParentItems.findIndex(item => String(item.groupCode) === String(value))
          return indexxx === -1 || 'Mã nhóm đã tồn tại'
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
        return 'Chỉnh sửa nhóm danh mục'
      } else {
        return 'Thêm nhóm danh mục mới'
      }
    },
    dictItemItems () {
      return this.$store.getters['allDictItemItems']
    },
    dictGroupParentItems () {
      return this.isDetail
        ? this.$store.getters['allDictGroupItems'].filter(item => String(item.groupCode) !== String(this.dictGroupModel.groupCode))
        : this.$store.getters['allDictGroupItems']
    }
  },
  mounted () {
    this.$nextTick(() => {
      // const s = this.dictGroup
      // this.dictGroupModel = s
      if (this.collectionCode && this.collectionCode !== this._dispatchAllDictGroupInDictCollection) {
        this.dispatchAllDictGroupInDictCollection()
      }
      if (this.collectionCode && this.collectionCode !== this._dispatchAllDictItemInDictCollection) {
        this.dispatchAllDictItemInDictCollection()
      }
      this.readly = true
    })
  },
  watch: {
    isDetail (val) {
      if (val) {
        this.setDictGroupMapped(this.dictGroup)
      } else {
        this.setDictGroupMapped(this.dictGroupDefault)
      }
    },
    dictGroup (val) {
      this.setDictGroupMapped(val)
    },
    collectionCode (val) {
      if (this.collectionCode && this._dispatchAllDictItemInDictCollection !== this.collectionCode) {
        this.dispatchAllDictItemInDictCollection()
      }
      if (this.collectionCode && this._dispatchAllDictGroupInDictCollection !== this.collectionCode) {
        this.dispatchAllDictGroupInDictCollection()
      }
    }
  },
  methods: {
    // unuse
    detailDictGroup () {
      let vm = this
      vm.isLoading = true
      this.$store.dispatch('dictGroup/readDictGroup', {
        collectionCode: vm.collectionCode,
        groupCode: vm.dictGroup.groupCode
      }).then(response => {
        vm.isLoading = false
        // console.log('Got some data, now lets show something in this component', response)
      }, error => {
        vm.isLoading = false
        console.log('Got nothing from server. Prompt user to check internet connection and try again', error)
      })
    },
    dictGroupSubmit () {
      let vm = this
      let params = {collectionCode: vm.collectionCode}
      for (const key in vm.dictGroupModel) {
        params[key] = vm.dictGroupModel[key] === null ? '' : vm.dictGroupModel[key]
      }
      Object.assign(params, vm.getDictItems(vm.dictGroupModel.dictItems))
      if (this.isDetail && this.$refs.form.validate()) {
        this.editDictGroup(params)
      } else if (this.$refs.form.validate()) {
        this.addDictGroup(params)
      }
    },
    addDictGroup (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Thêm mới dữ liệu...'
      })
      this.$store.dispatch('dictGroup/createDictGroup', params).then(response => {
        vm.isLoading = false
        vm.$emit('addDictGroupsuccess', response)
        window.showMessageToastr('success', 'Thêm mới dữ liệu thành công')
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        // console.log('dictGroup/createDictGroup', params, response)
      }, error => {
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        console.log(error)
        window.showMessageByAPICode(error.response.status, error.response.data)
        vm.isLoading = false
      })
    },
    editDictGroup (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Cập nhật dữ liệu...'
      })
      this.$store.dispatch('dictGroup/updateDictGroup', params).then(response => {
        vm.isLoading = false
        vm.$emit('editDictGroupsuccess', response)
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        window.showMessageToastr('success', 'Cập nhật dữ liệu thành công')
        // console.log('dictGroup/updateDictItem', params, response)
      }, error => {
        console.log(error)
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        window.showMessageByAPICode(error.response.status, error.response.data)
        vm.isLoading = false
      })
    },
    setDictGroupMapped (dictGroup) {
      let dictGroupModel = {}
      for (const key in this.dictGroupDefault) {
        dictGroupModel[key] = dictGroup[key] || this.dictGroupDefault[key]
      }
      this.dictGroupModel = dictGroupModel
      if (dictGroup.groupCode) {
        this.dispatchGetDictItemInDictGroup(dictGroup)
      }
    },
    getDictItems (dictItems) {
      if (dictItems && dictItems.length) {
        const gg = dictItems
        let result = gg.map(item => item.dictItemId)
        return {strDictItemId: result.toString()}
      } else {
        return {strDictItemId: ''}
      }
    },
    dispatchAllDictItemInDictCollection () {
      this._dispatchAllDictItemInDictCollection = this.collectionCode
      let vm = this
      vm.$store.dispatch('getAllDictItemItems', {
        collectionCode: vm.collectionCode
      })
    },
    dispatchAllDictGroupInDictCollection () {
      this._dispatchAllDictGroupInDictCollection = this.collectionCode
      let vm = this
      vm.$store.dispatch('getAllDictGroupItems', {
        collectionCode: vm.collectionCode
      })
    },
    dispatchGetDictItemInDictGroup (params) {
      let vm = this
      this.$store.dispatch('dictGroup/getDictItemInDictGroups', Object.assign(params, {
        collectionCode: vm.collectionCode
      })).then(response => {
        vm.dictGroupModel.dictItems = response.data
      }, error => {
        console.log(error)
      })
    },
    cancelChangeDictGroup () {
      if (this.isDetail) {
        this.setDictGroupMapped(this.dictGroup)
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
