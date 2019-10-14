<template>
  <div>
  <v-navigation-drawer
      stateless
      v-model="drawer"
      :width="drawerWidth"
      :mini-variant.sync="mini" hide-overlay
  >
    <v-list>
      <v-list-group v-for="(navigationItem, index) in menuFilterxx" :key="index"
        :prepend-icon="navigationItem.icon" @click="parentSelectedM(navigationItem)"
        :value="navigationItem.name === parentSelected" append-icon=""
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>{{translate(navigationItem.name)}}
          </v-list-tile-title>
        </v-list-tile>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
  
  </div>
</template>

<script>

export default {
  data () {
    return {
      buttonName: 'them_moi_cong_viec',
      drawer: true,
      drawerWidth: '240',
      mini: false,
      parentSelected: ''
    }
  },
  computed: {
    title () {
      return this.translate(this.buttonName)
    },
    menuFilterxx () {
      return this.$store.getters.staticRouters
    },
    staticRouter () {
      return this.$store.getters.staticRouter
    }
  },
  methods: {
    parentSelectedM (navigation) {
      this.parentSelected = navigation.name
      this.$router.push(navigation.path)
    },
    openDiaglogAddActivity () {
      this.add_new_task = true
    },
    submitSaveAndExit () {
      this.$refs.activityAddRef.saveAndExit()
    },
    submitSaveAndAddNew () {
      this.$refs.activityAddRef.saveAndAddNew()
    },
    onAddActivitySuccess (activity) {
      this.dialogAdd = false
      window.showMessageToastr('success', 'Cập nhật thành công')
      this.$refs.activityAddRef.clearDataForm()
      this.$router.push('/detail/' + activity.activityId)
    },
    getCountTotal () {
      let staticRouters = this.menuFilterxx
      for (let k in staticRouters) {
        this.saveCount(k)
      }
    },
    saveCount (index) {
      let staticRouter = this.menuFilterxx[index]
      let url = this.end_point + 'activities/count'
      let vm = this
      let apiConfigHeader = {
        headers: {
          groupId: vm.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      apiConfigHeader.params = staticRouter.query
      window.axios.get(url, apiConfigHeader)
        .then(function (response) {
          vm.menuFilterxx[index].total = response.data
        })
        .catch(function (error) {
          console.log(error)
          vm.menuFilterxx[index].total = 0
        })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.parentSelected = this.$route.name || this.menuFilterxx[0]['name']
    })
  }
}
</script>