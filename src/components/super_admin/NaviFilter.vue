<template>
  <div>
  <v-navigation-drawer
      stateless
      v-model="drawer"
      :width="drawerWidth"
      :mini-variant.sync="mini" hide-overlay
  >
    <mobilink-custome-tree-menu
      v-show="!isLoading"
      id="supper-admin-22222"
      :treeitems="menuFiltersMapedInStore"
      @treeactive="menuFilterChange"
      :activeId="Number($route.params.id) || 0"
      :treecontextmenu="false"
      heightStyle="full"
    >
    </mobilink-custome-tree-menu>
  </v-navigation-drawer>
  
  </div>
</template>

<script>

export default {
  props: {
    drawerWidth: {
      default: 240
    }
  },
  data () {
    return {
      drawer: true,
      mini: false,
      isLoading: true
    }
  },
  computed: {
    menuFiltersMapedInStore () {
      let results = []
      const data = this.$store.getters.staticRouters
      for (const key in data) {
        results.push(this.mapMenuFlatToTree(data[key]))
      }
      console.log('>>>>>>>>>>>>>>results', results)
      return results
    }
  },
  methods: {
    menuFilterChange (menuFilter) {
      if (menuFilter.nodes.length > 0) {
        this.$router.push({path: '/type/' + menuFilter.nodes[0].id})
      } else {
        this.$router.push({path: '/type/' + menuFilter.id})
      }
    },
    mapMenuFlatToTree (menuFilter) {
      // let vm = this
      menuFilter.id = menuFilter.id
      menuFilter.labelx = this.translate(menuFilter.name)
      menuFilter.icon = menuFilter.icon
      menuFilter.iconOpen = menuFilter.icon_active
      menuFilter.color = menuFilter.color
      menuFilter.parent = menuFilter.parentId || 0
      // menuFilter.allowAddChild = 'owner, write'.indexOf(vm.getPermissionText(menuFilter.permission)) >= 0
      // menuFilter.allowUpdateNDel = 'owner'.indexOf(vm.getPermissionText(menuFilter.permission)) >= 0
      return menuFilter
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.isLoading = false
    })
  }
}
</script>
<style scoped>
.navigation-drawer {
  background: transparent;
  overflow: hidden;
}
</style>

<style>
  .base-administration-list .list__tile--link .list__tile__title {
    white-space: pre-line!important;
    word-wrap: break-word!important;
    height: auto!important;
    line-height: 20px!important;
  }
  .base-administration-list .list__tile--link {
    height: auto!important;
    min-height: 48px;
    border-bottom: 1px solid #f1f1f1!important;
    padding: 6px 16px!important;
  }
  .base-administration-list .list__tile--link:hover {
    background: #f0f1f1!important;
    color: #039be5!important;
  }
  .base-administration-list .superadmin-active {
    background: #e7f5fd!important;
  }
  body .box {
    padding: 10px 16px!important;
  }
</style>