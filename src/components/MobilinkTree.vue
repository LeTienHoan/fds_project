<template>
<div :style="Number(heightStyle)>0 ? 'height:' + heightStyle + 'px;' : 'height:' + maxHeight + ';'">
  <div :id="'mobilink-custome-tree-menu-component-container-wrapper'+id"
    :style="heightStyle === 'autoScroll' ? 'margin:0; height: 99%; overflow:hidden;' : ''"
  >
  <div :id="'mobilink-custome-tree-menu-component-container-container-ch'+id"
    :style="heightStyle === 'autoScroll' ? 'margin:0; height: 100%; width: 100%; overflow: hidden; position: relative;' : ''"
  >
  <div :id="'mobilink-custome-tree-menu-component-container-container-ch-ch'+id"
    :style="heightStyle === 'autoScroll' ? 'margin:0; position: absolute; top: 0px; bottom: 0px; left: 0px; right: -16px; overflow: auto;' : ''"
  >

    <div :id="'mobilink-custome-tree-menu-component-container' + id"
      class="mobilink-custome-tree-menu-component-container"
      @contextmenu.stop="componentTreeRightClick"
      :style="heightStyle === 'autoScroll' && !hasScrollBar ? 'margin-right:16px;' : ''"
    >
      <div v-show="false">
        <h4>Mobilink Expandable Tree Menu<br/><small>(Recursive Components)</small></h4>
      </div>
      <template v-for="(tree, index) in trees">
        <custome-tree-menu v-if="readly"
          :key="0 + '' + index"
          :nodes="tree.nodes" 
          :depth="0"   
          :itemx="tree"
          :id="id"
          :showActiveList="showActiveList"
          :activeId="activeId"
          :treeShowAll="treeShowAll"
        ></custome-tree-menu>
      </template>
    </div>

    <script type="text/x-template" id="custome-tree-menu">
    <v-slide-y-transition mode="out-in">
      <div class="custome-tree-menu" v-if="readlyx"
        @contextmenu.stop="openMenu"
        @mouseenter="() => (showAction = true)"
        @mouseleave="() => (showAction = false)"
      >
        <div :class="labelClasses"
          @click="toggleChildren"
          :title="tooltipTree(itemx)"
        >
          <div class="custome-tree-menu-action">
            <v-btn icon
              v-if="itemx.allowUpdateNDel == false && showAction"
              @click.stop="viewChildren"
            >
              <v-icon>error_outline</v-icon>
            </v-btn>
            <v-btn icon
              v-if="itemx.allowUpdateNDel == true && showAction"
              @click.stop="editChildren"
            >
              <v-icon>create</v-icon>
            </v-btn>
            <v-btn icon
              v-if="itemx.allowUpdateNDel && showAction"
              @click.stop="deleteChildren"
            >
              <v-icon class="overdue-hover">cancel</v-icon>
            </v-btn>
            <v-btn icon
              @click.stop="onlyToggleChildren"
              v-if="labelClasses['has-children']"
            >
              <v-slide-y-transition :hide-on-leave="true">
                <v-icon class="overdue-hover"
                  v-text="showChildren ? 'arrow_drop_up' : 'arrow_drop_down'">
                </v-icon>
              </v-slide-y-transition>
            </v-btn>
          </div>
          <div :style="indent" class="label-content">
            <v-icon v-text="iconClasses" :color="itemx.color"></v-icon>
            <span class="truncated" v-text="itemx.labelx"></span>
          </div>
        </div>
        <custome-tree-menu 
          v-show="showChildren"
          v-for="(node, index) in nodes" 
          :key="depth + 1 + '' + index"
          :nodes="node.nodes" 
          :itemx="node"
          :depth="depth + 1"
          :id="id"
          :showActiveList="showActiveList"
          :activeId="activeId"
          :treeShowAll="treeShowAll"
        >
        </custome-tree-menu>
      </div>
    </v-slide-y-transition>
    </script>

  </div>
  </div>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import { EventBus } from '@/eventbus'

Vue.component('custome-tree-menu', {
  template: '#custome-tree-menu',
  props: [ 'id', 'nodes', 'itemx', 'depth', 'showActiveList', 'activeId', 'treeShowAll' ],
  data () {
    return {
      showChildren: false,
      readlyx: false,
      showAction: false
    }
  },
  computed: {
    iconClasses () {
      return this.showChildren ? this.itemx.iconOpen : this.itemx.icon
    },
    labelClasses () {
      let classes = {}
      classes['has-children'] = this.hasNodes
      classes['label-wrapper'] = true
      classes['itemxx' + this.itemx.id] = true
      classes['active'] = this.itemx.id === this.activeId
      return classes
    },
    indent () {
      return { transform: `translate(${this.depth * 20}px)` }
    },
    hasNodes () {
      return this.nodes && this.nodes.length > 0
    }
  },
  watch: {
    activeId (val) {
      if (Number(val) !== Number(this.itemx.id)) {
        this.checkShowChildren()
      } else {
        EventBus.$emit('tree-active-trigger-for-delay' + this.id, this.itemx)
      }
    }
  },
  methods: {
    onlyToggleChildren () {
      if (this.hasNodes) {
        this.showChildren = !this.showChildren
      }
    },
    toggleChildren () {
      /** window.$('.label-wrapper').removeClass('active')
      window.$('.label-wrapper.itemxx' + this.itemx.id).addClass('active') */
      EventBus.$emit('tree-active' + this.id, this.itemx)
      if (this.hasNodes) {
        this.showChildren = !this.showChildren
      }
    },
    openMenu ($event) {
      EventBus.$emit('open-menu' + this.id, $event, this.itemx)
    },
    tooltipTree (tree) {
      return defaultTooltip(tree)
    },
    editChildren () {
      EventBus.$emit('tree-edit' + this.id, this.itemx)
    },
    viewChildren () {
      EventBus.$emit('tree-view' + this.id, this.itemx)
    },
    deleteChildren () {
      EventBus.$emit('tree-delete' + this.id, this.itemx)
    },
    checkShowChildren () {
      this.showChildren = (this.showActiveList.findIndex(item => item.id === this.itemx.id) >= 0) || this.treeShowAll
      if (Number(this.activeId) === Number(this.itemx.id)) {
        EventBus.$emit('tree-active-trigger-for-delay' + this.id, this.itemx)
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      // use when default close tree. now open all --curent not all--
      this.checkShowChildren()
      this.readlyx = true
    })
  }
})
const COMPONENT_NAME = 'mobilink-custome-tree-menu'
var defaultTooltip = function (tree) {
  if (tree && tree.labelx) {
    return tree.labelx
  } else {
    return ''
  }
}
export default {
  name: COMPONENT_NAME,
  props: {
    id: {
      default: 1
    },
    toolTipShow: {
      default: defaultTooltip
    },
    activeId: {
      type: Number,
      default: 0
    },
    treecontextmenu: {
      type: Boolean,
      default: true
    },
    treeShowAll: {
      type: Boolean,
      default: false
    },
    heightStyle: { // heightStyle=50 ~ height 50px -- heightStyle=full height auto -- heightStyle=autoScroll height = parent height and have scroll
      type: String,
      default: 'full'
    },
    maxHeight: {
      type: String,
      default: '100%'
    },
    sortKey: {
      type: String //, default: 'asc_labelx'
    },
    treeitems: {
      default: () => {
        return [
          {
            labelx: 'root',
            id: 1,
            icon: 'folder',
            iconOpen: 'folder_open',
            color: 'amber accent-2',
            parent: 0
          },
          {
            labelx: 'item1',
            id: 2,
            icon: 'folder',
            iconOpen: 'folder_open',
            color: 'amber accent-2',
            parent: 1
          },
          {
            labelx: 'item1.1',
            id: 3,
            icon: 'folder',
            iconOpen: 'folder_open',
            color: 'amber accent-2',
            parent: 2
          },
          {
            labelx: 'item1.2',
            id: 4,
            icon: 'folder',
            iconOpen: 'folder_open',
            color: 'amber accent-2',
            parent: 2
          },
          {
            labelx: 'item2',
            id: 5,
            icon: 'folder',
            iconOpen: 'folder_open',
            color: 'amber accent-2',
            parent: 1
          },
          {
            labelx: 'item2.1',
            id: 6,
            icon: 'folder',
            iconOpen: 'folder_open',
            color: 'amber accent-2',
            parent: 5
          },
          {
            labelx: 'item2.2',
            id: 7,
            icon: 'folder',
            iconOpen: 'folder_open',
            color: 'amber accent-2',
            parent: 5
          },
          {
            labelx: 'root2',
            id: 8,
            icon: 'folder',
            iconOpen: 'folder_open',
            color: 'amber accent-2',
            parent: 10000
          }
        ]
      }
    }
  },
  computed: {
    trees () {
      let arr = this.arrayToTree(this.treeitems, 'id', 'parent', 'nodes', this.sortKey)
      const ix = this.treeitems.find(item => item.id === this.activeId)
      this.showActiveList = ix ? (ix.parentList || []) : []
      return arr
    }
  },
  watch: {
    trees () {
      let vm = this
      const ix = vm.treeitems.find(item => item.id === vm.activeId)
      vm.showActiveList = ix ? ix.parentList : []
    }
  },
  data () {
    return {
      // tree: tree,
      readly: false,
      showActiveList: [],
      hasScrollBar: false
    }
  },
  created () {
    let vm = this
    defaultTooltip = this.toolTipShow || defaultTooltip
    vm.$nextTick(function () {
      EventBus.$on('open-menu' + vm.id, function ($event, model) {
        vm.componentTreeRightClick($event, model)
      })
      EventBus.$on('tree-active' + vm.id, function (model) {
        vm.$emit('treeactive', model)
        vm.checkHasScrollbar()
      })
      EventBus.$on('tree-active-trigger-for-delay' + vm.id, function (model) {
        vm.$emit('treeactivetriggerfordelay', model)
      })
      EventBus.$on('tree-edit' + vm.id, function (model) {
        vm.$emit('treeedit', model)
      })
      EventBus.$on('tree-view' + vm.id, function (model) {
        vm.$emit('treeview', model)
      })
      EventBus.$on('tree-delete' + vm.id, function (model) {
        vm.$emit('treedelete', model)
        vm.checkHasScrollbar()
      })
      vm.readly = true
      vm.checkHasScrollbar()
    })
  },
  destroyed () {
    let vm = this
    EventBus.$off('open-menu' + vm.id)
    EventBus.$off('tree-active' + vm.id)
    EventBus.$off('tree-active-trigger-for-delay' + vm.id)
    EventBus.$off('tree-edit' + vm.id)
    EventBus.$off('tree-view' + vm.id)
    EventBus.$off('tree-delete' + vm.id)
  },
  methods: {
    checkHasScrollbar () {
      if (this.heightStyle === 'autoScroll') {
        let vm = this
        setTimeout(() => {
          vm.hasScrollBar = document.getElementById('mobilink-custome-tree-menu-component-container-container-ch-ch' + vm.id).scrollHeight >
            document.getElementById('mobilink-custome-tree-menu-component-container-container-ch-ch' + vm.id).clientHeight
        }, 500)
      }
    },
    arrayToTree (arr, idKey, parentKey, childrenKey, sortKey) {
      let tree = []
      let mappedArr = {}
      let arrElem = []
      let mappedElem = []

      if (sortKey) {
        let sortTypeKey = sortKey.split('_')
        arr.sort(function (a, b) {
          if (a[sortTypeKey[1]] < b[sortTypeKey[1]]) {
            return sortTypeKey[0] === 'asc' ? -1 : 1
          }
          if (a[sortTypeKey[1]] > b[sortTypeKey[1]]) {
            return sortTypeKey[0] === 'asc' ? 1 : -1
          }
          return 0
        })
      }

      idKey = (idKey === null || idKey === '' || idKey === undefined) ? 'id' : idKey
      parentKey = (parentKey === null || parentKey === '' || parentKey === undefined) ? 'parentId' : parentKey
      childrenKey = (childrenKey === null || childrenKey === '' || childrenKey === undefined) ? 'childrens' : childrenKey

      // First map the nodes of the array to an object -> create a hash table.
      for (var i = 0, len = arr.length; i < len; i++) {
        arr[i]['index'] = i
        arr[i]['level'] = 0
        arr[i]['parentList'] = []
        arrElem = arr[i]
        mappedArr[arrElem[idKey]] = arrElem
        mappedArr[arrElem[idKey]][childrenKey] = []
      }
      for (const i in arr) {
        const id = arr[i][idKey]
        if (mappedArr.hasOwnProperty(id)) {
          mappedElem = mappedArr[id]
          // If the element is not at the root level, add it to its parent array of children.
          if (mappedElem[parentKey] && mappedArr[mappedElem[parentKey]]) {
            // set level for element
            let parent = mappedArr[mappedElem[parentKey]]
            mappedElem.level = parent.level + 1
            let parentItem = [{}]
            parentItem[0][idKey] = parent[idKey]
            parentItem[0]['index'] = parent['index']
            parentItem[0]['labelx'] = parent['labelx']
            mappedElem.parentList = parent.parentList.concat(parentItem)
            mappedArr[mappedElem[parentKey]][childrenKey].push(mappedElem)
          } else { // If the element is at the root level, add it to first level elements array.
            tree.push(mappedElem)
          }
        }
      }
      return tree
    },
    componentTreeRightClick (jsEvent, model) {
      if (this.treecontextmenu) {
        jsEvent.preventDefault()
        this.$emit('ontreecontextmenu', jsEvent, model)
      }
    },
    treeDeActive () {
      let vm = this
      window.$('#mobilink-custome-tree-menu-component-container' + vm.id + ' .label-wrapper').removeClass('active')
    }
  }
}
</script>

<style lang="scss">

.mobilink-custome-tree-menu-component-container {
  /**
  width: 300px;
  margin: 0 auto;
  */
  // padding-bottom: 60px;
}
.mobilink-custome-tree-menu-component-container {
  padding-bottom: 0;

  ::-webkit-scrollbar {
    display: none;
  }
  .custome-tree-menu {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .label-wrapper {
    padding: 5px;
    border: 0;
    white-space: normal;
    position: relative;

    &.active {
      background-color: #f0f1f1;
      color: #039be5;

      .custome-tree-menu-action {
        background-color: #f0f1f1;
      }
    }
    
    .custome-tree-menu-action {
      position: absolute;
      z-index: 1;
      right: 0px;
      padding: 0 5px;
    }

    button {
      width: auto;
      height: auto;
      margin: 0;

      .icon {
        font-size: 16px !important;
        vertical-align: bottom;
        margin-left: 3px;
      }
    }
  }

  .label-content {
    &:hover {
      color:#039be5;
    }
    display: -webkit-box;
    display: flex;
    -webkit-align-items: end;
    align-items: end;
    cursor: pointer;
    > i {

      &:nth-child(1) {
        margin-right: 5px;
      }
    }
  }
}
.tree-menu-actions-menu {
  .disable {
    color: #ccc;
    a {
      cursor: not-allowed;
    }
  }
  a {
    text-decoration: none;
  }
}
</style>

<style scoped>
  .mobilink-custome-tree-menu-component-container {
    background-color: white;
  }
  .custome-tree-menu-action {
    background-color: white;
  }
  .mobilink-custome-tree-menu-component-container ::-webkit-scrollbar {
    display: none;
  }


</style>
