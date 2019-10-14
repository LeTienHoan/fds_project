<template>
  <div class="navifilter-view scrollChildClass box">
    <jx-mobilink-toolbar :dark="false" color="white" :sideicon="false" class="fullwidth">
      <template slot="toolbar_title">
        <div class="align-center d-flex my-1">
          <v-icon>{{staticRouter.icon}}</v-icon>
          {{title}}&nbsp;<span v-if="isDetail"> - {{ dictCollectionModel.collectionName }}</span>
        </div>
      </template>
    </jx-mobilink-toolbar>
    
    <v-layout wrap>
      <v-flex xs12>

        <v-form ref="form">

          <v-layout wrap>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Mã nhóm danh mục *</v-subheader>
              <v-text-field
                placeholder="Mã nhóm danh mục"
                class="input-uppercase"
                v-model="dictCollectionModel.collectionCode"
                :disabled="isDetail"
                :rules="[collectionCodeRules.required, collectionCodeRules.uniqueCode]"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Tên nhóm danh mục *</v-subheader>
              <v-text-field
                placeholder="Tên nhóm danh mục"
                v-model="dictCollectionModel.collectionName"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Tên tiếng anh</v-subheader>
              <v-text-field 
                v-model="dictCollectionModel.collectionNameEN"
                placeholder="Tên tiếng anh"  
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-subheader class="px-0">Mô tả</v-subheader>
              <v-text-field
                placeholder="Mô tả"
                v-model="dictCollectionModel.description"
                multi-line :rows="3"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn
                class="right"
                color="primary"
                :disabled="isLoading"
                :loading="isLoading"
                @click="dictCollectionSubmit"
              >
                <v-icon>save</v-icon>
                {{title}}
              </v-btn>
              <v-btn @click="cancelChangeDictCollection"
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
    dictCollection: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      dictCollectionModel: {},
      dictCollectionDefault: {
        collectionCode: '',
        createDate: '',
        description: '',
        dictCollectionId: 0,
        modifiedDate: '',
        collectionNameEN: '',
        collectionName: ''
      },
      isLoading: false,
      readly: false,
      collectionCodeRules: {
        required: value => !!value || 'Mã nhóm danh mục bắt buộc phải nhập',
        uniqueCode: value => {
          const indexxx = this.allDictCollectionItems.findIndex(item => String(item.collectionCode) === String(value))
          return indexxx === -1 || this.isDetail || 'Mã nhóm danh mục đã tồn tại'
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
        return 'Chỉnh sửa từ điển'
      } else {
        return 'Thêm từ điển mới'
      }
    },
    allDictCollectionItems () {
      return this.isDetail
        ? this.$store.getters['allDictCollectionItems'].filter(item => String(item.collectionCode) !== String(this.dictCollection.collectionCode))
        : this.$store.getters['allDictCollectionItems']
    }
  },
  mounted () {
    this.$nextTick(() => {
      const s = this.dictCollection
      this.dictCollectionModel = s
      this.readly = true
    })
  },
  watch: {
    isDetail (val) {
      if (val) {
        this.setDictCollectionMapped(this.dictCollection)
      } else {
        this.setDictCollectionMapped(this.dictCollectionDefault)
      }
    },
    dictCollection (val) {
      this.setDictCollectionMapped(val)
    }
  },
  methods: {
    // unuse
    detailDictCollection () {
      let vm = this
      vm.isLoading = true
      this.$store.dispatch('dictCollection/readDictCollection', 1).then(response => {
        vm.isLoading = false
        console.log('Got some data, now lets show something in this component', response)
      }, error => {
        vm.isLoading = false
        console.log('Got nothing from server. Prompt user to check internet connection and try again', error)
      })
    },
    dictCollectionSubmit () {
      let vm = this
      const params = {}
      for (const key in vm.dictCollectionModel) {
        params[key] = vm.dictCollectionModel[key] === null ? '' : vm.dictCollectionModel[key]
      }
      if (this.isDetail && this.$refs.form.validate()) {
        this.editDictCollection(params)
      } else if (this.$refs.form.validate()) {
        this.addDictCollection(params)
      }
    },
    addDictCollection (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Thêm mới dữ liệu...'
      })
      this.$store.dispatch('dictCollection/createDictCollection', params).then(response => {
        vm.isLoading = false
        window.showMessageToastr('success', 'Thêm mới dữ liệu thành công')
        vm.$emit('addDictCollectionsuccess', response)
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        // console.log('dictCollection/createDictCollection', params, response)
      }, error => {
        console.log(error)
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        window.showMessageByAPICode(error.response.status, error.response.data)
        vm.isLoading = false
      })
    },
    editDictCollection (params) {
      let vm = this
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Cập nhật dữ liệu...'
      })
      this.$store.dispatch('dictCollection/updateDictCollection', params).then(response => {
        vm.isLoading = false
        window.showMessageToastr('success', 'Cập nhật dữ liệu thành công')
        vm.$emit('editDictCollectionsuccess', response)
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        // console.log('dictCollection/updateDictCollection', params, response)
      }, error => {
        console.log(error)
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        window.showMessageByAPICode(error.response.status, error.response.data)
        vm.isLoading = false
      })
    },
    setDictCollectionMapped (dictCollection) {
      let dictCollectionModel = {}
      for (const key in dictCollection) {
        dictCollectionModel[key] = dictCollection[key]
      }
      this.dictCollectionModel = dictCollectionModel
      this.dispatchAllDictCollection()
    },
    dispatchAllDictCollection () {
      let vm = this
      vm.$store.dispatch('getAllDictCollectionItems')
    },
    cancelChangeDictCollection () {
      if (this.isDetail) {
        this.setDictCollectionMapped(this.dictCollection)
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

