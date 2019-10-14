<template>
  <div class="jx-mobilink-component-editable control_class" v-if="componentReadly">
    <v-layout wrap>
      <v-flex sm12>
        <div class="custome-editable-with-icon-2">
          <v-select 
            v-bind:items="editableSelectItems" 
            v-model="modelInputComponent"
            single-line 
            autocomplete
            :item-text="multi_select_options.key_text" 
            :item-value="multi_select_options.key_value"
            hide-selected
            @input="searchSelect($event)"
            tags
            chips
            return-object
            :disabled="editable_hidden"
            :placeholder="placeholder"
            :filter="multi_select_options.filter"
          >
            <template slot="selection" slot-scope="data">
              <v-chip
                class="chip--select-multi"
                @input="data.parent.selectItem(data.item)"
                :close="!editable_hidden"
              >
                {{ data.item[multi_select_options.key_text] }}
              </v-chip>
            </template>
            <template slot="item" slot-scope="data">
              <template>
                <v-list-tile-content>
                  <v-list-tile-title v-html="data.item[ multi_select_options.key_text ]"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="data.item[ multi_select_options.key_hint ]"></v-list-tile-sub-title>
                </v-list-tile-content>
              </template>
            </template>
          </v-select>

          <v-btn flat icon color="grey darken-1" class="ma-0"
            v-if="editable_hidden && hasPermission && !boolenCheckbox"
            @click.stop.prevent="onEdittingData()" 
            :loading="loadingBtn" 
            :disabled="loadingBtn">
            <v-icon>create</v-icon>
          </v-btn>
          <v-btn flat icon color="success" class="ma-0"
            v-if="!editable_hidden && hasPermission && !boolenCheckbox"
            @click.stop.prevent="submitUpdate()" 
            :loading="loadingBtn" 
            :disabled="loadingBtn">
            <v-icon>done</v-icon>
          </v-btn>
          
          <v-btn flat icon color="red darken-3" class="ma-0"
            v-if="!editable_hidden && hasPermission && !boolenCheckbox"
            @click.stop.prevent="cancelChange()" 
            :loading="loadingBtn" 
            :disabled="loadingBtn">
            <v-icon>clear</v-icon>
          </v-btn>
        </div>
        
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
  const COMPONENT_NAME = 'custome-editable-resource'
  export default {
    name: COMPONENT_NAME,
    props: {
      typeEdit: {
        type: String,
        default: 'resource'
      },
      hasPermission: {
        type: Boolean,
        default: false
      },
      boolenCheckbox: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: 'select'
      },
      loadingBtn: false,
      multi_select_options: {
        items: [],
        api_get: '',
        api_update: '',
        init_value: [],
        key_value: '',
        key_text: '',
        key_hint: '',
        init_value_from_resource: true,
        filter: undefined
      }
    },
    watch: {
      props (val) {
        // this.initComponent()
      }
    },
    created () {
      let vm = this
      vm.$nextTick(function () {
        this.multi_select_options_a = this.multi_select_options
        this.initComponent()
      })
    },
    data () {
      return {
        componentReadly: false,
        apiGetItems: [],
        editable_hidden: true,
        tempData: '',
        modelInputComponent: '',
        multi_select_options_a: {},
        editableSelectItems: []
      }
    },
    methods: {
      initComponent () {
        if (this.typeEdit === 'resource') {
          alert(11)
        } else {
          this.initMultiSelect()
        }
      },
      initMultiSelect () {
        let vm = this
        this.editableSelectItems = []
        this.modelInputComponent = []
        this.tempData = []
        if (this.multi_select_options.items) {
          this.editableSelectItems = this.multi_select_options.items
          this.modelInputComponent = this.editableSelectItems.filter(item => {
            return (this.multi_select_options.init_value || []).indexOf(
              item[vm.multi_select_options.key_value]) >= 0
          })
          this.tempData = this.modelInputComponent
        } else {
          this.getApiMutiSelect()
        }
        this.componentReadly = true
      },
      getApiMutiSelect () {
        let vm = this
        vm.editableSelectItems = []
        vm.modelInputComponent = []
        vm.tempData = []
        window.axios.get(this.multi_select_options.api_get)
          .then(function (response) {
            const serilizable = response.data
            if (serilizable.hasOwnProperty('data')) {
              vm.editableSelectItems = serilizable.data
              if (vm.multi_select_options.init_value_from_resource) {
                vm.modelInputComponent = vm.editableSelectItems.filter(item => {
                  return item['selected']
                })
              } else {
                vm.modelInputComponent = vm.editableSelectItems.filter(item => {
                  return (vm.multi_select_options.init_value || []).indexOf(
                    item[vm.multi_select_options.key_value]) >= 0
                })
              }
              vm.tempData = vm.modelInputComponent
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        /** data test
          vm.editableSelectItems = [
            {
              userId: 1111,
              userName: 'abcd',
              userEmail: 'abcd',
              selected: true
            }, {
              userId: 2222,
              userName: 'abcd',
              userEmail: 'dddd',
              selected: false
            }
          ]
          if (vm.multi_select_options.init_value_from_resource) {
            vm.modelInputComponent = this.editableSelectItems.filter(item => {
              return item['selected']
            })
          } else {
            vm.modelInputComponent = this.editableSelectItems.filter(item => {
              return (this.multi_select_options.init_value || []).indexOf(
                item[vm.multi_select_options.key_value]) >= 0
            })
          }
          vm.tempData = vm.modelInputComponent
        */
      },
      onEdittingData () {
        this.editable_hidden = !this.editable_hidden
      },
      submitUpdate () {
        this.tempData = this.modelInputComponent || []
        this.editable_hidden = !this.editable_hidden
        if (this.typeEdit === 'multiselect' && this.multi_select_options.init_value_from_resource) {
          this.$emit('submitMultiSelect', this.tempData)
        }
      },
      cancelChange () {
        this.modelInputComponent = this.tempData
        this.editable_hidden = !this.editable_hidden
      }
    }
  }
</script>
<style type="text/css">

  .jx-mobilink-component-editable .editable__content__value {
    white-space: pre-line;
  }
  .custome-editable-with-icon-2 .editable-text{
    min-height: 28px;
    display: flex;
    align-items: center;
  }
  .custome-editable-with-icon-2 {
      display: -webkit-flex; /* Safari */
      -webkit-align-items: center; /* Safari 7.0+ */
      display: flex;
      align-items: center;
  }
  .custome-editable-with-icon-2 div {
     -webkit-flex: 1; /* Safari 6.1+ */
     flex: 1;
  }
  .custome-editable-with-icon-2 .input-group {
    padding: 0;
    display: block;
  }
  .custome-editable-with-icon-2 .input-group__details {
    padding-top: 0;
    min-height: 1px;
  }
  .custome-editable-with-icon-2 .input-group .menu{
    display: none !important;
  }
  .custome-editable-with-icon-2 .input-group--disabled .icon.icon--disabled {
    display: none !important;
  }
</style>
