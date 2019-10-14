<template>
<v-slide-y-transition>
    <div v-if="!active && !readly" class="text-xs-right pr-5 grey--text">
      <i v-show="false">Chưa sẵn sàng</i>
    </div>
    <div v-else-if="readly" class="activity-task-advanced-children">
      <template v-for="(showX, index) in showFieldsVal">
        <!-- date range -->
          <v-layout wrap
            :key="index"
            v-if="showX.type === 'date-range'"
          >
            <v-flex xs12 sm2 class="label_align">
              <v-subheader class="pl-0 pr-2">{{showX.name}} </v-subheader>
            </v-flex>
            <v-flex xs6 sm5>
              <custome-date-time
                :id="index + 1"
                :datetimevalue="showX.fromDate"
                autocomplate
                :format="localeDateProperties.dateMomentPattern"
                :placeholder="'từ ngày'"
                :onlydate="true"
                :clearable="true"
                @syncxxx="(val) => (utilChangDate(index, 'fromDate', val))"
                appendicon=""
                prependicon="event"
              />
            </v-flex>
            <v-flex xs6 sm5>
              <custome-date-time
                :id="index + 2"
                :datetimevalue="showX.toDate"
                autocomplate
                :format="localeDateProperties.dateMomentPattern"
                :placeholder="'đến ngày'"
                :onlydate="true"
                :clearable="true"
                @syncxxx="(val) => (utilChangDate(index, 'toDate', val))"
                appendicon=""
                prependicon="event"
              />
            </v-flex>
          </v-layout>
        <!-- date time range -->
          <v-layout wrap
            :key="index"
            v-else-if="showX.type === 'date-time-range'"
          >
            <v-flex xs12 sm2 class="label_align">
              <v-subheader class="pl-0 pr-2">{{showX.name}} </v-subheader>
            </v-flex>
            <v-flex xs6 sm5>
              <custome-date-time
                :id="index + 1"
                :datetimevalue="showX.fromDate"
                :clearable="true"
                :placeholder="'từ ngày'"
                @syncxxx="(val) => (utilChangDateTime(index, 'fromDate', val))"
                appendicon=""
                prependicon="event"
              >
              </custome-date-time>
            </v-flex>
            <v-flex xs6 sm5>
              <custome-date-time
                :id="index + 2"
                :datetimevalue="showX.toDate"
                :clearable="true"
                :placeholder="'đến ngày'"
                @syncxxx="(val) => (utilChangDateTime(index, 'toDate', val))"
                appendicon=""
                prependicon="event"
              >
              </custome-date-time>
            </v-flex>
          </v-layout>

          <!-- text field -->
          <v-layout wrap
            :key="index"
            v-else-if="showX.type === 'text-field'"
          >
            <v-flex xs12 sm2 class="label_align">
              <v-subheader class="pl-0 pr-2">{{showX.name}} </v-subheader>
            </v-flex>
            <v-flex xs12 sm10>
              <v-text-field
                :key="index"
                v-model="showX.value"
                :placeholder="showX.name"
              ></v-text-field>
            </v-flex>
          </v-layout>

          <!-- select -->
          <v-layout wrap
            :key="index"
            v-else-if="showX.type === 'select-field'"
          >
            <v-flex xs12 sm2 class="label_align">
              <v-subheader class="pl-0 pr-2">{{showX.name}} </v-subheader>
            </v-flex>
            <v-flex xs12 sm10>
              <v-select 
                :key="index"
                v-bind:items="itemSource[showX.getItemURL] || showX.items || []"
                v-model="showX.value"
                :item-text="showX.item_text"
                :item-value="showX.item_value"
                autocomplete
                hide-selected
                clearable
                no-data-text=""
                :placeholder="showX.name"
                return-object
              >
                <template slot="item" slot-scope="data">
                  <template>
                    <v-list-tile-content>
                      <v-list-tile-title :attr="index" v-html="data.item[showX.item_text]"></v-list-tile-title>
                      <v-list-tile-sub-title v-html="data.item[showX.item_text_sub]"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </template>
                </template>
              </v-select>
            </v-flex>
          </v-layout>

          <!-- multi select -->
          <v-layout wrap
            :key="index"
            v-else-if="showX.type === 'multi-select'"
          >
            <v-flex xs12 sm2 class="label_align">
              <v-subheader class="pl-0 pr-2">{{showX.name}} </v-subheader>
            </v-flex>
            <v-flex xs12 sm10>
              <v-select 
                :key="index"
                v-bind:items="itemSource[showX.getItemURL] || showX.items || []"
                v-model="showX.value"
                :item-text="showX.item_text"
                :item-value="showX.item_value"
                autocomplete
                multiple
                chips
                hide-selected
                clearable
                no-data-text=""
                :placeholder="showX.name"
                return-object
              >
                <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :key="JSON.stringify(data.item)"
                    close
                    class="chip--select-multi"
                    @input="data.parent.selectItem(data.item)"
                    :attr="index"
                  >
                    {{ data.item[showX.item_text] }}
                  </v-chip>
                </template>
                <template slot="item" slot-scope="data">
                  <template>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="data.item[showX.item_text]"></v-list-tile-title>
                      <v-list-tile-sub-title v-html="data.item[showX.item_text_sub]"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </template>
                </template>
              </v-select>
            </v-flex>
          </v-layout>
      </template>

    </div>
</v-slide-y-transition>
</template>

<script>
// import { EventBus } from '@/eventbus'
export default {
  props: {
    active: {
      default: false
    },
    showFields: {
      type: Array,
      default: () => [
        {
          idd: 1,
          name: 'date range',
          type: 'date-range',
          fromDate: '',
          toDate: '',
          queryKeys: ['startDate', 'endDate']
        },
        {
          idd: 2,
          name: 'date time range',
          type: 'date-time-range',
          fromDate: '',
          toDate: '',
          queryKeys: ['startDate', 'endDate']
        },
        {
          idd: 3,
          name: 'text field',
          type: 'text-field',
          value: '',
          queryKeys: ['key_text_field']
        },
        {
          idd: 4,
          name: 'select field',
          type: 'select-field',
          value: {text: 'dummy', value: 'dummy'},
          items: [
            {text: 'dummy', value: 'dummy'},
            {text: 'dummy2', value: 'dummy2'}
          ],
          getItemURL: '',
          item_text: 'text',
          item_text_sub: 'text',
          item_value: 'value',
          queryKeys: ['key_select_field']
        },
        {
          idd: 5,
          name: 'multi select field',
          type: 'multi-select',
          getItemURL: '',
          value: [{text: 'dummy', value: 'dummy'}],
          items: [
            {text: 'dummy', value: 'dummy'},
            {text: 'dummy2', value: 'dummy2'}
          ],
          item_text: 'text',
          item_text_sub: 'text',
          item_value: 'value',
          queryKeys: ['key_select_multi_field']
        }
      ]
    }
  },
  data () {
    return {
      showFieldsVal: [],
      readly: false,
      itemUrls: [],
      itemSource: {}
    }
  },
  watch: {
    showFields (val) {
      let vm = this
      vm.readly = false
      setTimeout(() => { vm.readly = true }, 100)
      this.showFieldsVal = val
      this.getAllItems()
    }
  },
  methods: {
    cancelAdvanedSearch () {
      this.$parent['showAdvanced'] = false
    },
    getAllItems () {
      for (const index in this.showFieldsVal) {
        this.getItemByItemURL(index, this.showFieldsVal[index].getItemURL)
      }
    },
    getItemByItemURL (index, url) {
      let vm = this
      if (url && this.itemUrls.indexOf(url) < 0) {
        this.itemUrls.push(url)
        window.axios.get(vm.end_point + url)
          .then(function (response) {
            const serializable = response.data
            const result = {
              total: serializable.total,
              data: [...serializable.data || []]
            }
            vm.itemSource[url] = result.data
          })
          .catch(function (error) {
            console.log(error)
          })
      } else if (url && vm.itemSource[url] && vm.itemSource[url].length > 0) {
        vm.showFieldsVal[index].items = vm.itemSource[url]
      }
    },
    utilChangDate (index, key, timeStamp) {
      let setTo = ''
      if (timeStamp && Number(timeStamp) > 0) {
        setTo = new Date(Number(timeStamp))
      } else if (timeStamp) {
        setTo = timeStamp
      } else {
        setTo = ''
      }
      this.showFieldsVal[index][key] = setTo
    },
    utilChangDateTime (index, key, val) {
      this.showFieldsVal[index][key] = val
    }
  },
  mounted () {
    let vm = this
    this.$nextTick(() => {
      this.showFieldsVal = this.showFields
      this.getAllItems()
      setTimeout(() => { vm.readly = true }, 100)
    })
  },
  destroyed () {
    // delete this.active
    // delete this.showFields
    // delete this.showFieldsVal
    // delete this.readly
    // delete this.itemUrls
    // delete this.itemSource
    // delete this.cancelAdvanedSearch
    // delete this.getAllItems
    // delete this.getItemByItemURL
    // delete this.utilChangDate
    // delete this.utilChangDateTime
  }
}
</script>

<style>
/**
.activity-task-advanced .input-group {
  padding-top: 9px;
}
.activity-task-advanced .input-group__details {
  min-height: 16px !important;
}
*/
</style>

