<template>
    <div v-if="!active" class="text-xs-right pr-5 grey--text">
      <i v-show="false">Chưa sẵn sàng</i>
    </div>
    <div v-else class="activity-statistic-advanced box">
      <v-layout wrap
      >

        <v-flex xs6 sm2>
          <v-select class="pr-3"
            v-bind:items="yearItems"
            v-model="year"
            item-text="text"
            item-value="value"
            :placeholder="translate('nam')"
            autocomplete
            hide-selected
            no-data-text=""
          ></v-select>
        </v-flex>

        <v-flex xs6 sm2>
          <v-select class="pr-3"
            v-bind:items="monthItems"
            v-model="month"
            item-text="text"
            item-value="value"
            :placeholder="translate('thang')"
            autocomplete
            hide-selected
            clearable
            no-data-text=""
          ></v-select>
        </v-flex>
        <v-flex xs12 sm8>
          <div class="d-flex">
            <div class="layout pr-3">
              <v-select class="flex"
                :class="{'pr-3': typeSelectMulti === 'user'}"
                v-bind:items="statisticItems"
                v-model="statistic"
                item-text="text"
                item-value="value"
                :placeholder="'Loại công việc'"
                autocomplete
                hide-selected
                no-data-text=""
              ></v-select>
                <v-select class="flex sm5"
                  v-if="typeSelectMulti === 'user'"
                  v-bind:items="workingUnitItems"
                  v-model="workingUnit"
                  item-text="name"
                  item-value="workingUnitId"
                  :placeholder="'Chọn theo đơn vị'"
                  autocomplete
                  hide-selected
                  clearable
                  no-data-text=""
                ></v-select>
            </div>
            <v-btn small class="ma-0" color="primary" @click.stop="submitAdvanedSearch">{{translate('tim_kiem')}}</v-btn>
          </div>
        </v-flex>

      </v-layout>
    </div>
</template>

<script>

export default {
  props: {
    active: {
      default: false
    },
    typeSelectMulti: {
      default: 'user'
    },
    initAdvancedSearch: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      month: this.initAdvancedSearch.month || '',
      year: this.initAdvancedSearch.year || '',
      statistic: this.initAdvancedSearch.statistic || '',
      workingUnit: this.initAdvancedSearch.workingUnit || ''
    }
  },
  computed: {
    yearItems () {
      let d = new Date()
      const thisYear = d.getFullYear()
      let yearItems = []
      for (let i = thisYear; i > thisYear - 10; i--) {
        yearItems.push({
          text: this.translate('nam') + ' ' + i,
          value: i
        })
      }
      return yearItems
    },
    monthItems () {
      let monthItems = []
      for (let i = 0; i <= 11; i++) {
        monthItems.push({
          text: this.translate('thang') + ' ' + (i + 1),
          value: i + 1
        })
      }
      return monthItems
    },
    statisticItems () {
      return this.typeSelectMulti === 'user'
        ? [
          {
            text: this.translate('tat_ca_cong_viec_cua_ca_nhan_trong_co_quan'),
            value: 'all'
          },
          {
            text: this.translate('cong_viec_ca_nhan_tu_giao'),
            value: 'manager'
          },
          {
            text: this.translate('cong_viec_ca_nhan_thuc_hien'),
            value: 'manager_'
          },
          {
            text: this.translate('cong_viec_ca_nhan_giao'),
            value: 'leader'
          },
          {
            text: this.translate('cong_viec_ca_nhan_phoi_hop'),
            value: 'invitation'
          }
        ]
        : [
          {
            text: this.translate('tat_ca_cong_viec_cua_don_vi'),
            value: 'all'
          },
          {
            text: this.translate('cong_viec_don_vi_thuc_hien'),
            value: 'hosting'
          },
          {
            text: this.translate('cong_viec_don_vi_phoi_hop'),
            value: 'invitation'
          }
        ]
    },
    workingUnitItems () {
      return this.$store.getters['workingUnit/workingUnitItems']
    }
  },
  watch: {
    active (val) {
      if (val) {
        this.initComponent()
      }
    }
  },
  methods: {
    submitAdvanedSearch () {
      let payload = {
        year: this.year || '',
        month: this.month || '',
        statistic: this.statistic || ''
      }
      if (this.typeSelectMulti === 'user') {
        payload.statisticType = 1
        payload.workingUnit = this.workingUnit || ''
      } else {
        payload.statisticType = 2
      }
      if (this.statistic === 'manager') {
        payload.statisticType = 4
      } else if (this.statistic === 'manager_') {
        payload.statistic = 'manager'
      }
      this.$emit('advancedSearchChange', payload)
    },
    cancelAdvanedSearch () {
      this.$parent['showAdvanced'] = false
    },
    initComponent () {
      console.log('init advanced search')
      // TODO: init value to variables
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.typeSelectMulti === 'user') {
        this.$store.dispatch('workingUnit/getWorkingUnitItems', {
          start: -1,
          end: -1
        })
      }
    })
  }
}
</script>

<style>
/**
.activity-statistic-advanced .input-group {
  padding-top: 9px;
}
.activity-statistic-advanced .input-group__details {
  min-height: 16px !important;
}
*/
</style>

