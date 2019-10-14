<template>
  <div class="mobilink-advancedSearchZ-edit fullwidth">
    <v-layout wrap class="pa-2">
      <v-flex xs12 sm2 class="label_align" v-show="showAdvanedType !== 'advancedSearch'"
      >
        <v-subheader class="pl-0 pr-2">Tên bộ lọc </v-subheader>
      </v-flex>
      <v-flex sm10 xs12 v-show="showAdvanedType !== 'advancedSearch'"
      >
          <v-text-field
            v-model="advancedSearchZSelected.name"
            placeholder="Nhập tên bộ lọc"
            :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
            required
            autofocus
          ></v-text-field>
      </v-flex>
      <v-flex sm12 xs12
        >
          <AdvancedSearchAutoGen
            :style="showAdvanedType === 'add' ? 'min-height: 300px;' : ''"
            :active="active"
            :showFields="showFieldsComputed"
            @showFieldsChange="(val) => (showFieldsToSubmit = val)"
          />
      </v-flex>
      <v-flex sm12 xs12>
        <v-btn
          class="right"
          color="primary"
          @click="$parent.showAdvanedType = false">
          Đóng
        </v-btn>
        <v-btn
          class="right"
          v-show="showAdvanedType === 'add' || (showAdvanedType === 'edit' && advancedSearchZSelected.allowDelete)"
          color="primary"
          @click="saveNewFilter">
          Lưu bộ lọc
        </v-btn>
        <v-btn class="right" color="primary"
          v-show="showAdvanedType === 'advancedSearch'"
          @click="submitAdvancedSearch()">
          Tìm kiếm
        </v-btn>
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="500"
          :nudge-top="appNudgeTop + 20"
          :nudge-left="appNudgeLeft"
          offset-y
          top
          transition="slide-y-transition"
          class=""
        >
          <v-btn class="right"
            v-show="showAdvanedType === 'add' || (showAdvanedType === 'edit' && advancedSearchZSelected.allowDelete)"
            slot="activator"
            color="primary"
          >
            Điều kiện lọc
          </v-btn>

          <v-card>
            <v-card-actions>
              <v-layout wrap>
                <v-flex xs6 sm4
                  v-for="(fieldItem, index) in dictZZZFields"
                  :key="index"
                >
                    <v-checkbox v-model="checkListFields"
                      :label="fieldItem.name" :value="fieldItem.idd"
                    >
                    </v-checkbox>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import AdvancedSearchAutoGen from './AdvancedSearchAutoGen'
const COMPONENT_NAME = 'mobilink-advancedSearchZ'

export default {
  name: COMPONENT_NAME,
  props: {
    active: {
      default: false
    },
    showAdvanedType: {
      default: 'add'
    },
    preferenceKey: {
      type: String,
      default: 'FILTERTASK'
    },
    advancedsearchDictKey: {
      type: String,
      default: 'dictionarytask'
    },
    advancedsearchDefaultFilterKey: {
      type: String,
      default: 'filtertask'
    }
  },
  components: {AdvancedSearchAutoGen},
  computed: {
    dictZZZFields () {
      return this.$store.getters['advancedSearch/dictFields']
    },
    showFieldsComputed () {
      let rs = []
      for (const key in this.checkListFields) {
        const exits = (this.showAdvanedType === 'advancedSearch' ? (this.submitAdvancedSearchSave || this.dictZZZFields || []) : (this.dictZZZFields || [])).find(item => item.idd === this.checkListFields[key])
        if (exits) {
          rs.push(
            (this.advancedSearchZSelected.geoadvancedSearch || []).find(item => item.idd === this.checkListFields[key]) ||
            exits
          )
        }
      }
      return rs
    }
  },
  watch: {
    showAdvanedType (val) {
      if (val === 'add') {
        this.checkListFields = []
      } else if (val === 'edit') {
        this.checkListFields = (this.advancedSearchZSelected.geoadvancedSearch || []).map(item => Number(item.idd))
      } else if (val === 'advancedSearch') {
        this.checkListFields = (this.dictZZZFields || []).map(item => item.idd)
      }
    }
  },
  data () {
    return {
      btnActionIsLoading: false,
      advancedSearchZSelected: {},
      checkListFields: [],
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
      ],
      submitAdvancedSearchSave: ''
    }
  },
  created () {
    this.$nextTick(function () {
      // this.runDispatchAdvancedSearchZ()
    })
  },
  destroyed () {
    // delete this.active
    // delete this.dictZZZFields
    // delete this.showFieldsComputed
    // delete this.btnActionIsLoading
    // delete this.advancedSearchZSelected
    // delete this.checkListFields
    // delete this.menu
    // delete this.submitAdvancedSearch
    // delete this.saveNewFilter
  },
  methods: {
    submitAdvancedSearch () {
      const showFields = this.showFieldsComputed
      this.submitAdvancedSearchSave = showFields
      let advancedSearch = []
      for (let k in showFields) {
        if (this.isNotEmpty(showFields[k].value || '') || showFields[k].fromDate || showFields[k].toDate) {
          const query = this.mapQuery(showFields[k])
          advancedSearch.push({
            advancedSearchZUUID: showFields[k].idd,
            text: query.text,
            value: showFields[k].idd,
            bgClass: this.bgClasses[Math.floor(Math.random() * this.bgClasses.length)],
            query: query.query
          })
        }
      }
      this.$store.dispatch('advancedSearch/setAdvancedSearchNewQueries', {
        advansearchListAmazings: advancedSearch
      })
      this.$parent.showAdvanedType = false
    },
    isNotEmpty (obj) {
      return !(obj.length <= 0)
    },
    mapQuery (fieldItem) {
      let queriesAdvanced = {
        query: {},
        text: fieldItem.name + ':'
      }
      if (fieldItem.type === 'date-range') {
        queriesAdvanced['query'][fieldItem.queryKeys[0]] = fieldItem.fromDate
          ? window.moment(fieldItem.fromDate).format('YYYYMMDD') : ''
        queriesAdvanced['query'][fieldItem.queryKeys[1]] = fieldItem.toDate
          ? window.moment(fieldItem.toDate).format('YYYYMMDD') : ''
        queriesAdvanced['text'] += fieldItem.fromDate
          ? ' từ ngày ' + window.moment(fieldItem.fromDate).format('DD/MM/YYYY') : '---/'
        queriesAdvanced['text'] += fieldItem.toDate
          ? ' đến ngày ' + window.moment(fieldItem.toDate).format('DD/MM/YYYY') : '---'
      } else if (fieldItem.type === 'date-time-range') {
        queriesAdvanced['query'][fieldItem.queryKeys[0]] = fieldItem.fromDate
          ? window.moment(fieldItem.fromDate).format('YYYYMMDDHHmm') : ''
        queriesAdvanced['query'][fieldItem.queryKeys[1]] = fieldItem.toDate
          ? window.moment(fieldItem.toDate).format('YYYYMMDDHHmm') : ''
        queriesAdvanced['text'] += fieldItem.fromDate
          ? ' từ ngày ' + window.moment(fieldItem.fromDate).format('HH:mm DD/MM/YYYY') : '---/'
        queriesAdvanced['text'] += fieldItem.toDate
          ? ' đến ngày ' + window.moment(fieldItem.toDate).format('HH:mm DD/MM/YYYY') : '---'
      } else if (fieldItem.type === 'multi-select') {
        queriesAdvanced['query'][fieldItem.queryKeys[0]] = (fieldItem.value || []).map(item => item[fieldItem.item_value]).join()
        queriesAdvanced['text'] += (fieldItem.value || []).map(item => item[fieldItem.item_text]).join()
      } else if (fieldItem.type === 'select-field') {
        queriesAdvanced['query'][fieldItem.queryKeys[0]] = (fieldItem.value || {})[fieldItem.item_value] || ''
        queriesAdvanced['text'] += (fieldItem.value || {})[fieldItem.item_text] || ''
      } else {
        queriesAdvanced['query'][fieldItem.queryKeys[0]] = fieldItem.value || ''
        queriesAdvanced['text'] += fieldItem.value || ''
      }
      return queriesAdvanced
    },
    saveNewFilter () {
      if (!this.advancedSearchZSelected.name) {
        window.showMessageToastr('error', 'Chưa nhập tên bộ lọc')
        return
      }
      let vm = this
      let action = 'advancedSearch/createAdvancedSearch'
      if (vm.advancedSearchZSelected.advancedSearchZUUID) {
        action = 'advancedSearch/updateAdvancedSearch'
      }
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Cập nhật dữ liệu...'
      })
      vm.$store.dispatch(action, {
        preferenceKey: this.preferenceKey,
        data: Object.assign({},
          vm.advancedSearchZSelected,
          {
            allowDelete: true,
            allowView: true,
            geoadvancedSearch: this.showFieldsComputed
          })
      })
        .then(response => {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          vm.advancedSearchZSelected.advancedSearchZUUID = response.advancedSearchZUUID || 0
          vm.$parent.showAdvanedType = 'filter'
          window.showMessageToastr('success', 'Cập nhật dữ liệu thành công')
        }, error => {
          console.log(error)
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          window.showMessageByAPICode(error.response.status, error.response.data)
          vm.btnActionIsLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .base-administration-list {
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
