<template>
  <div class="mobilink-advancedSearchZ-list fullwidth">
    <v-list class="base-advancedSearchZ-list pa-2">
      <template v-for="(item, index) in advancedSearchZItems"
      >
        <v-divider v-if="index > 0" :key="'v-divider'+index"></v-divider>
        <v-list-tile :key="'v-list-tile'+index"
          @click="toggleAdvancedSearchZItem(item, true)"
          :class="{'advancedSearchZ-active': selectedItems.indexOf(item.advancedSearchZUUID) > 0, 
            'primary--text': selectedItems.indexOf(item.advancedSearchZUUID) >= 0}"
        >
          <v-list-tile-content>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
            <div class="list-action">
              <v-btn icon
                v-if="item.allowView"
                color="grey"
                flat class="ma-0"
                @click.stop="viewDetailAdvancedSearchZ(item)"
                :disabled="btnActionIsLoading"
                :loading="btnActionIsLoading"
              >
                <v-icon>error_outline</v-icon>
              </v-btn>
              <v-btn icon
                v-if="item.allowDelete"
                color="red darken-3"
                flat class="ma-0"
                @click.stop="deleteAdvancedSearchZ(item)"
                :disabled="btnActionIsLoading"
                :loading="btnActionIsLoading"
              >
                <v-icon>clear</v-icon>
              </v-btn>
            </div>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
    <v-btn icon class="right pr-2" v-if="allowAddNew" @click="addNewAdvancedSearch">
      <v-icon>add_circle</v-icon>
    </v-btn>
  </div>
</template>

<script>
const COMPONENT_NAME = 'mobilink-advancedSearchZ'

export default {
  name: COMPONENT_NAME,
  props: {
    active: {
      default: false
    },
    preferenceKey: {
      type: String,
      default: 'FILTERTASK'
    },
    advancedsearchDefaultFilterKey: {
      type: String,
      default: 'filtertask'
    },
    allowAddNew: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    advancedSearchZItems () {
      return this.$store.getters['advancedSearch/advancedSearchItems']
    },
    advancedSearchNewQueriesCP () {
      return this.$store.getters['advancedSearch/advancedSearchNewQueries'].advansearchListAmazings
    },
    selectedItems () {
      return this.advancedSearchNewQueriesCP.map(item => item.advancedSearchZUUID)
    }
  },
  watch: {
  },
  data () {
    return {
      btnActionIsLoading: false,
      menu: false,
      bgClasses: [
        'purple darken-1 white--text',
        'pink darken-1 white--text',
        'red darken-1 white--text',
        'deep-purple darken-1 white--text',
        'indigo darken-1 white--text',
        'blue darken-1 white--text',
        'light-blue darken-1 white--text',
        'cyan darken-1 white--text',
        'teal darken-1 white--text',
        'orange darken-1 white--text',
        'blue-grey darken-1 white--text'
      ]
    }
  },
  created () {
    this.$nextTick(function () {
      // this.runDispatchAdvancedSearchItemsZ()
    })
  },
  destroyed () {
    // delete this.active
    // delete this.advancedSearchZItems
    // delete this.showFieldsComputed
    // delete this.btnActionIsLoading
    // delete this.advancedSearchZSelected
    // delete this.menu
    // delete this.viewDetailAdvancedSearchZ
    // delete this.deleteAdvancedSearchZ
    // delete this.saveNewFilter
  },
  methods: {
    toggleAdvancedSearchZItem (item, emit) {
      let advancedSearchNewQueriesCP = this.advancedSearchNewQueriesCP
      if (this.selectedItems.indexOf(item.advancedSearchZUUID) >= 0) {
        advancedSearchNewQueriesCP = advancedSearchNewQueriesCP.filter(i => i.advancedSearchZUUID !== item.advancedSearchZUUID)
      } else {
        advancedSearchNewQueriesCP.push({
          advancedSearchZUUID: item.advancedSearchZUUID,
          text: item.name,
          value: item.advancedSearchZUUID,
          bgClass: this.bgClasses[Math.floor(Math.random() * this.bgClasses.length)],
          query: item.query || this.mapQuery(item.geoadvancedSearch || [])
        })
      }
      this.$store.dispatch('advancedSearch/setAdvancedSearchNewQueries', {
        advansearchListAmazings: advancedSearchNewQueriesCP
      })
      this.$parent.showAdvanedType = false
    },
    mapQuery (geoadvancedSearch) {
      let queriesAdvanced = {}
      for (let i in geoadvancedSearch) {
        if (geoadvancedSearch[i].type === 'date-range') {
          queriesAdvanced[geoadvancedSearch[i].queryKeys[0]] = geoadvancedSearch[i].fromDate
            ? window.moment(geoadvancedSearch[i].fromDate).format('YYYYMMDD') : ''
          queriesAdvanced[geoadvancedSearch[i].queryKeys[1]] = geoadvancedSearch[i].toDate
            ? window.moment(geoadvancedSearch[i].toDate).format('YYYYMMDD') : ''
        } else if (geoadvancedSearch[i].type === 'date-time-range') {
          queriesAdvanced[geoadvancedSearch[i].queryKeys[0]] = geoadvancedSearch[i].fromDate
            ? window.moment(geoadvancedSearch[i].fromDate).format('YYYYMMDDHHmm') : ''
          queriesAdvanced[geoadvancedSearch[i].queryKeys[1]] = geoadvancedSearch[i].toDate
            ? window.moment(geoadvancedSearch[i].toDate).format('YYYYMMDDHHmm') : ''
        } else if (geoadvancedSearch[i].type === 'multi-select') {
          queriesAdvanced[geoadvancedSearch[i].queryKeys[0]] = (geoadvancedSearch[i].value || []).map(item => item[geoadvancedSearch[i].item_value]).join()
        } else if (geoadvancedSearch[i].type === 'select-field') {
          queriesAdvanced[geoadvancedSearch[i].queryKeys[0]] = (geoadvancedSearch[i].value || {})[geoadvancedSearch[i].item_value] || ''
        } else {
          queriesAdvanced[geoadvancedSearch[i].queryKeys[0]] = geoadvancedSearch[i].value || ''
        }
      }
      return queriesAdvanced
    },
    viewDetailAdvancedSearchZ (item) {
      this.$parent.showAdvanedType = 'edit'
      this.$parent.$refs.advancedSearchEditRefs.advancedSearchZSelected = item
    },
    addNewAdvancedSearch () {
      this.$parent.showAdvanedType = 'add'
      this.$parent.$refs.advancedSearchEditRefs.advancedSearchZSelected = {}
    },
    deleteAdvancedSearchZ (item) {
      let vm = this
      if (item.advancedSearchZUUID) {
        this.$dialog.confirm('Bạn có chắc chắn xóa dữ liệu này không?', {
          html: true,
          loader: true,
          okText: 'Xác nhận',
          cancelText: 'Quay lại',
          animation: 'fade'
        })
          .then(function (dialog) {
            vm.btnActionIsLoading = true
            vm.$store.dispatch('loading/setLoading', {
              loading: true,
              message: 'Xóa dữ liệu...'
            })
            vm.$store.dispatch('advancedSearch/deleteAdvancedSearch', {
              advancedSearchZUUID: item.advancedSearchZUUID,
              preferenceKey: vm.preferenceKey
            }).then(response => {
              vm.btnActionIsLoading = false
              if (vm.selectedItems.indexOf(item.advancedSearchZUUID) >= 0) {
                vm.$store.dispatch('advancedSearch/setAdvancedSearchNewQueries', {
                  advansearchListAmazings: vm.advancedSearchNewQueriesCP.filter(i => i.advancedSearchZUUID !== item.advancedSearchZUUID)
                })
              }
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageToastr('success', 'Xóa dữ liệu thành công')
            }, error => {
              console.log(error)
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageByAPICode(error.response.status, error.response.data)
              vm.btnActionIsLoading = false
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

<style lang="scss" scoped>
  .base-advancedSearchZ-list {
    .list__tile__content {
      .list__tile__title {
        font-size: 13px;
      }
      .list-action {
        position: absolute;
        right: 0;
        button {
          width: auto;
          height: auto;
          margin: 0;
        }
      }
    }
    .divider {
      margin: 0;
    }
  }
</style>
