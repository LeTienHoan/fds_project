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
  props: {
    drawerWidth: {
      default: 240
    }
  },
  data () {
    return {
      drawer: true,
      mini: false,
      parentSelected: ''
    }
  },
  computed: {
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
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.parentSelected = this.$route.name || this.menuFilterxx[0]['name']
    })
  }
}
</script>