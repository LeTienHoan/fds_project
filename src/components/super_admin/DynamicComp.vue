<template>
  <v-fab-transition>
    <component :is="component" v-if="component" />
  </v-fab-transition>
</template>
<script>
export default {
  name: 'dynamic-link',
  data () {
    return {
      component: null,
      defaultComponent: import('@/components/HelloWorld')
    }
  },
  computed: {
    loader () {
      if (!this.$route.params.id) {
        return null
      }
      let type = this.$store.getters.staticRouters.find(item =>
        Number(item.id) === Number(this.$route.params.id)) ||
        { componentDynamic: this.defaultComponent }
      return () => type.componentDynamic
    }
  },
  watch: {
    '$route.params' (val) {
      this.checkLoader()
    }
  },
  mounted () {
    this.checkLoader()
  },
  methods: {
    checkLoader () {
      this.loader()
        .then(() => {
          this.component = () => this.loader()
        })
        .catch(() => {
          this.component = () => this.defaultComponent
        })
    }
  }
}
</script>