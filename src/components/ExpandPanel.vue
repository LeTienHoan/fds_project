<template>
  <v-expansion-panel expand class="custome-expand-panel">
    <v-expansion-panel-content
      :value="ownExpanded"
      @change="onExpandChange"
      :class="{'custome-expand-panel-width-action': true, 'has-left-action': leftactionsuse.length > 0}"
    >
      <div slot="header" v-if="showheader">
        <div class="custome-panel-heading-with-icon">

          <v-icon v-for="(item, index) in leftactionsuse" :key="index" class="heading-left-icon"
          @click.stop="emitclickaction(item)">{{item.icon}} </v-icon>
          <div class="title-name">
            <slot name="title-name"></slot>
          </div>
          <v-btn class="expandedClass" :key="'right'+index"
            v-for="(item, index) in rightactionsuse"
            :icon="!item.text"
            @click.stop="emitclickaction(item)"
            :title="item.title"
          >
            <v-icon>{{  item.icon }}</v-icon>
            <span class="ml-2" v-if="item.text">{{  item.text }}</span>
          </v-btn>
          <div v-if="visibilities.class" class="align-center d-flex">
            <span :class="visibilities.class" class="tag-header">
              {{visibilities.text}}
            </span>
          </div>
        </div>
      </div>
      <span slot="actions" icon class="ma-0">
      </span>
      <v-card v-if="usecard">
        <v-card-text>
          <slot name="card-text-container"></slot>
        </v-card-text>
      </v-card>
      <div v-else>
        <slot name="card-text-container"></slot>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
  const COMPONENT_NAME = 'mbl-expand-panel'
  export default {
    name: COMPONENT_NAME,
    props: {
      rightactions: {
        type: Array,
        default: () => []
      },
      leftactions: {
        type: Array,
        default: () => []
      },
      visibilities: {
        type: Object,
        default: () => {
          return {}
        }
      },
      expanded: {
        type: Boolean,
        default: false
      },
      showheader: {
        type: Boolean,
        default: true
      },
      usecard: {
        type: Boolean,
        default: true
      },
      ownExpanded: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      leftactionsuse () {
        return this.leftactions
      },
      rightactionsuse () {
        return this.rightactions
      }
    },
    data () {
      return {
      }
    },
    methods: {
      emitclickaction (item) {
        this.ownExpanded = true
        this.$emit(item.action)
      },
      onExpandChange (val) {
        this.ownExpanded = true
        this.$emit('expandchange', true)
      }
    }
  }
</script>

<style>
  .custome-expand-panel .custome-expand-panel-width-action .expansion-panel__header {
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 16px;
    padding-right: 16px;
  }
  .custome-expand-panel .custome-expand-panel-width-action.has-left-action .expansion-panel__header {
    padding-left: 16px;
  }
  
  .custome-panel-heading-with-icon {
	    display: -webkit-flex; /* Safari */
	    -webkit-align-items: center; /* Safari 7.0+ */
	    display: flex;
	    align-items: center;
	}
	.custome-panel-heading-with-icon div {
	   -webkit-flex: 1; /* Safari 6.1+ */
	   flex: 1;
	}
  .tag-header {
    text-transform: capitalize;
    font-weight: lighter;
    text-align: center;
    font-size: 13px;
    color: white;
    padding: 3px 5px 2px;
    border-radius: 20px;
    display: inline-block;
  }
  .expandedClass {
    box-shadow: none!important;
  }
  .expandedClass .btn__content {
    padding: 0;
  }
</style>
