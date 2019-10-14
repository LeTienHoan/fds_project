<template>
  <div class="contact-header">
    <v-layout wrap class="px-3 align-center">
      <div>
        <b>{{ textHeader }}</b> <span><i>Tổng số {{ count }} tài khoản được tìm thấy </i></span>
      </div>
      <div class="ml-3 employees-advanced-wrap">
        <v-select
          class="select-advanced-multichip"
          v-model="advancedSearchValue"
          chips
          tags
          deletable-chips
          item-text="text"
          item-value="value"
          return-object
          multiple
          @input="changeAdvancedSearch"
        >
          <template slot="selection" slot-scope="data">
            <v-chip
              :selected="data.selected"
              :disabled="data.disabled"
              :key="JSON.stringify(data.item)"
              close
              class="chip--select-multi"
              @input="deleteClear(data)"
            >
              <span @click.stop="showAdvaned = true">{{ data.item.text }}</span>
            </v-chip>
          </template>
        </v-select>
        <v-btn icon  flat color="primary" :class="{'ma-0': true, 'btn--active': showAdvaned}" @click="showAdvaned = !showAdvaned">
          <v-icon>filter_list</v-icon>
        </v-btn>
        <div v-show="showAdvaned" class="employees-advanced">
          <v-layout wrap v-show="showFields.indexOf('workingunit') >= 0">
            <v-flex xs12 sm3 class="label_align">
              <v-subheader>Lọc theo đơn vị</v-subheader>
            </v-flex>
            <v-flex xs12 sm9>
              <v-select 
                class="pr-2"
                v-bind:items="workingunitItems"
                v-model="workingunitModel"
                item-text="name"
                item-value="workingUnitId"
                autocomplete
                hide-selected
                clearable
                return-object
                no-data-text=""
                @input="submitAdvanedSearch"
              ></v-select>
            </v-flex>
          </v-layout>
          <v-layout wrap v-show="showFields.indexOf('jobpos') >= 0">
            <v-flex xs12 sm3 class="label_align">
              <v-subheader>Lọc theo vị trí công tác</v-subheader>
            </v-flex>
            <v-flex xs12 sm9>
              <v-select 
                v-bind:items="jobposItems" 
                v-model="jobposModel"
                autocomplete
                item-text="title" 
                item-value="jobPosId"
                hide-selected
                placeholder="Vị trí công tác"
                @input="submitAdvanedSearch"
                return-object
                clearable
              >
              </v-select>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs12 class="d-flex align-center">
              <v-select
                :items="advancedSearchFieldItems"
                v-model="advancedSearchField"
                item-text="fieldName"
                item-value="fieldValue"
                autocomplete
                multiple
                return-object
                ref="selectzzz"
                no-data-text=""
              >
                <template
                  slot="selection"
                  slot-scope="{ item, index }"
                >
                  <v-chip v-if="index === advancedSearchField.length - 1">
                    <span>{{ advancedSearchField[advancedSearchField.length - 1].fieldName }}</span>
                  </v-chip>
                  <span
                    v-if="advancedSearchField.length > 0 && index === advancedSearchField.length - 1"
                    class="grey--text caption"
                  >(+{{ advancedSearchField.length - 1 }} others)</span>
                </template>
              </v-select>
              <v-btn class="primary" @click="showAdvaned = false">
                <v-icon left>close</v-icon>
                <span>{{translate('quay_lai')}}</span>
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </v-layout>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'employees-header'
  export default {
    name: COMPONENT_NAME,
    components: {
    },
    props: {
      count: ''
    },
    watch: {
    },
    computed: {
      textHeader () {
        return this.$store.getters.textHeader
      },
      showFields () {
        return this.advancedSearchField.map(item => item.fieldValue)
      },
      jobposItems () {
        return this.$store.getters.loadedJobpos.data
      }
    },
    data () {
      return {
        searchModel: '',
        advancedSearchValue: '',
        showAdvaned: false,
        advancedSearchFieldItems: [
          {
            fieldValue: 'workingunit',
            fieldName: 'Đơn vị'
          },
          {
            fieldValue: 'jobpos',
            fieldName: 'Vị trí công tác'
          }
        ],
        advancedSearchField: [],
        workingunitItems: [],
        workingunitModel: '',
        jobposModel: ''
      }
    },
    created () {
      this.$nextTick(function () {
        this.getWorkingUnit()
      })
    },
    methods: {
      changeAdvancedSearch (event) {
        if (event.length > 0 && typeof event[event.length - 1] === 'string') {
          if (event[event.length - 2] && event[event.length - 2].value.indexOf('keywords') >= 0) {
            this.advancedSearchValue[event.length - 2] = {
              text: 'keywords:' + event[event.length - 1],
              value: 'keywords',
              id: ''
            }
            this.advancedSearchValue.splice(event.length - 1, 1)
          } else {
            this.advancedSearchValue[event.length - 1] = {
              text: 'keywords:' + event[event.length - 1],
              value: 'keywords'
            }
          }
        } else {
          this.advancedSearchValue[event.length - 1] = {
            text: 'keywords:' + event[event.length - 1],
            value: 'keywords',
            id: ''
          }
        }
        this.$store.dispatch('searchEmployees', this.advancedSearchValue)
      },
      getWorkingUnit () {
        let vm = this
        let url = vm.end_point + 'workingunits'
        let config = {
          headers: {
            'groupId': vm.group_id
          },
          params: {
            start: -1,
            end: -1
          }
        }
        window.axios.get(url, config).then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.workingunitItems = serializable.data
          } else {
            vm.workingunitItems = []
          }
        })
          .catch(function (error) {
            console.log(error)
          })
      },
      submitAdvanedSearch (event) {
        let advanced = []
        for (var key in this.showFields) {
          if (this.showFields[key] === 'workingunit') {
            advanced.push({
              text: 'workingunit:' + (this.workingunitModel.name ? this.workingunitModel.name : ''),
              value: 'workingunit',
              id: this.workingunitModel.workingUnitId
            })
          } else if (this.showFields[key] === 'jobpos') {
            advanced.push({
              text: 'jobpos:' + (this.jobposModel.title ? this.jobposModel.title : ''),
              value: 'jobpos',
              id: this.jobposModel.jobPosId
            })
          }
        }
        if (this.advancedSearchValue.length > 0 && this.advancedSearchValue[this.advancedSearchValue.length - 1].value.indexOf('keywords') >= 0) {
          advanced.push(this.advancedSearchValue[this.advancedSearchValue.length - 1])
        }
        this.advancedSearchValue = advanced
        this.$store.dispatch('searchEmployees', this.advancedSearchValue)
      },
      deleteClear (data) {
        this.advancedSearchValue = this.advancedSearchValue.filter(i => data.item.value !== i.value)
        if (data.item.value === 'keywords') {
        } else {
          this.advancedSearchField = this.advancedSearchField.filter(function (i) {
            return data.item.value !== i.fieldValue
          })
        }
        this.$store.dispatch('searchEmployees', this.advancedSearchValue)
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$store.dispatch('loadJobpos')
      })
    }
  }
</script>
<style type="text/css" scoped>
  .truncated {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .employees-advanced-wrap {
    display: flex;
    flex: 1 1;
    flex-wrap: wrap;
    min-width: 24px;
    padding: 10px;
    position: relative;
    width: 100%;
    outline: none;
  }
  .employees-advanced {
    position: absolute;
    top: 100%;
    width: calc(100% - 70px);
    box-shadow: 0px 2px 5px 1px rgba(0,0,0,0.2);
    border-top: 1px solid #039be5;
    background-color: white;
    padding: 5px 20px 10px 0;
  }
</style>