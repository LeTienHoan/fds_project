<template>
  <div class="navifilter-view scrollChildClass box">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex my-1">
          <v-icon>{{staticRouter.icon}}</v-icon>
          {{title}}&nbsp;<span v-if="isDetail"> - {{ dictItemModel.itemName }}</span>
        </div>
      </template>
    </jx-mobilink-toolbar>
    
    <v-layout wrap>
      <v-flex xs12>

        <v-form ref="form">

          <v-layout wrap>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Mã danh mục *</v-subheader>
              <v-text-field
                placeholder="Mã danh mục"
                v-model="dictItemModel.itemCode"
                :disabled="isDetail"
                :rules="[itemCodeRules.required, itemCodeRules.uniqueCode]"
                class="input-uppercase"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Tên danh mục *</v-subheader>
              <v-text-field
                placeholder="Tên danh mục"
                v-model="dictItemModel.itemName"
                :rules="[value => !!value || 'Tên danh mục bắt buộc phải nhập']"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Tên tiếng anh</v-subheader>
              <v-text-field 
                v-model="dictItemModel.itemNameEN"
                placeholder="Tên tiếng anh"  
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Mã danh mục cha</v-subheader>
              <v-select
                :items="dictItemParentItems"
                item-text="itemName"
                item-value="itemCode"
                v-model="dictItemModel.parentItem"
                placeholder="Mã danh mục cha"
                return-object
                clearable
                no-data-text=""
                autocomplete
              ></v-select>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Nhóm danh mục</v-subheader>
              <v-select
                v-bind:items="dictGroupItems"
                v-model="dictItemModel.groups"
                item-text="groupName"
                item-value="groupCode"
                autocomplete
                hide-selected
                multiple
                chips
                deletable-chips
                return-object
                placeholder="Nhóm danh mục"
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
                    {{ data.item.groupName }}
                  </v-chip>
                </template>
                <template slot="item" slot-scope="data">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="data.item['groupName']"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="data.item['groupCode']"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </template>
              </v-select>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Mô tả</v-subheader>
              <v-text-field
                placeholder="Mô tả"
                v-model="dictItemModel.itemDescription"
                multi-line :rows="3"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn
                class="right"
                color="primary"
                :disabled="isLoading"
                :loading="isLoading"
                @click="dictItemSubmit"
              >
                <v-icon>save</v-icon>
                {{title}}
              </v-btn>
              <v-btn @click="cancelChangeDictItem"
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
    dictItem: {
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
      dictItemModel: {
        groups: []
      },
      dictItemDefault: {
        itemCode: '',
        createDate: '',
        itemDescription: '',
        dictItemId: 0,
        modifiedDate: '',
        itemNameEN: '',
        itemName: '',
        groups: [],
        parentItem: {}
      },
      isLoading: false,
      readly: false,
      itemCodeRules: {
        required: value => !!value || 'Mã danh mục bắt buộc phải nhập',
        uniqueCode: value => {
          const indexxx = this.dictItemParentItems.findIndex(item => String(item.itemCode) === String(value))
          return indexxx === -1 || 'Mã danh mục đã tồn tại'
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
        return 'Chỉnh sửa danh mục'
      } else {
        return 'Thêm danh mục mới'
      }
    },
    dictItemParentItems () {
      return this.isDetail
        ? this.$store.getters['allDictItemItems'].filter(item => String(item.itemCode) !== String(this.dictItem.itemCode))
        : this.$store.getters['allDictItemItems']
    },
    dictGroupItems () {
      return this.$store.getters['allDictGroupItems']
    }
  },
  mounted () {
    this.$nextTick(() => {
      // const s = this.dictItem
      // this.dictItemModel = s
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
        this.setDictItemMapped(this.dictItem)
      } else {
        this.setDictItemMapped(this.dictItemDefault)
      }
    },
    dictItem (val) {
      this.setDictItemMapped(val)
    },
    collectionCode (val) {
      if (this.collectionCode && this.collectionCode !== this._dispatchAllDictGroupInDictCollection) {
        this.dispatchAllDictGroupInDictCollection()
      }
      if (this.collectionCode && this.collectionCode !== this._dispatchAllDictItemInDictCollection) {
        this.dispatchAllDictItemInDictCollection()
      }
    }
  },
  methods: {
    detailDictItem () {
      let vm = this
      this._detailDictItem = vm.dictItem.itemCode
      this.$store.dispatch('dictItem/readDictItem', {
        collectionCode: vm.collectionCode,
        itemCode: vm.dictItem.itemCode
      }).then(response => {
        vm.setDictItemMapped(response)
      }, error => {
        console.log('Got nothing from server. Prompt user to check internet connection and try again', error)
      })
    },
    dictItemSubmit () {
      let vm = this
      let params = {collectionCode: vm.collectionCode}
      for (const key in vm.dictItemModel) {
        params[key] = vm.dictItemModel[key] === null ? '' : vm.dictItemModel[key]
      }
      Object.assign(params, vm.getGroups(vm.dictItemModel.groups), vm.getParentCode(vm.dictItemModel.parentItem))
      if (this.isDetail && this.$refs.form.validate()) {
        this.editDictItem(params)
      } else if (this.$refs.form.validate()) {
        this.addDictItem(params)
      }
    },
    addDictItem (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Thêm mới dữ liệu...'
      })
      this.$store.dispatch('dictItem/createDictItem', params).then(response => {
        vm.isLoading = false
        vm.$emit('addDictItemsuccess', response)
        window.showMessageToastr('success', 'Thêm mới dữ liệu thành công')
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        // console.log('dictItem/createDictItem', params, response)
      }, error => {
        console.log(error)
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        window.showMessageByAPICode(error.response.status, error.response.data)
        vm.isLoading = false
      })
    },
    editDictItem (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Cập nhật dữ liệu...'
      })
      this.$store.dispatch('dictItem/updateDictItem', params).then(response => {
        vm.isLoading = false
        vm.$emit('editDictItemsuccess', response)
        window.showMessageToastr('success', 'Cập nhật dữ liệu thành công')
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        // console.log('dictItem/updateDictItem', params, response)
      }, error => {
        console.log(error)
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        window.showMessageByAPICode(error.response.status, error.response.data)
        vm.isLoading = false
      })
    },
    setDictItemMapped (dictItem) {
      let dictItemModel = {}
      for (const key in this.dictItemDefault) {
        if (key === 'groups') {
          dictItemModel[key] = this.setGroups(dictItem[key] || this.dictItemDefault[key])
        } else {
          dictItemModel[key] = dictItem[key] || this.dictItemDefault[key]
        }
      }
      Object.assign(this.dictItemModel, dictItemModel)
      if (dictItem.itemCode && dictItem.itemCode !== this._detailDictItem) {
        this.detailDictItem()
      }
    },
    setGroups (groups) {
      if (groups && groups.length >= 0) {
        return groups
      } else if (groups && Number(groups.dictGroupId) === 0) {
        return []
      } else {
        return [groups]
      }
    },
    getGroups (groups) {
      if (groups && groups.length) {
        const gg = groups
        let result = gg.map(item => item.dictGroupId)
        return {strDictGroupId: result.toString()}
      } else {
        return {strDictGroupId: ''}
      }
    },
    getParentCode (item) {
      return {parentItemCode: (item ? (item.itemCode || '') : '')}
    },
    dispatchAllDictGroupInDictCollection () {
      let vm = this
      this._dispatchAllDictGroupInDictCollection = vm.collectionCode
      vm.$store.dispatch('getAllDictGroupItems', {
        collectionCode: vm.collectionCode
      })
    },
    dispatchAllDictItemInDictCollection () {
      let vm = this
      this._dispatchAllDictItemInDictCollection = this.collectionCode
      this.$store.dispatch('getAllDictItemItems', {
        collectionCode: vm.collectionCode
      })
    },
    cancelChangeDictItem () {
      if (this.isDetail) {
        this.setDictItemMapped(this.dictItem)
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
