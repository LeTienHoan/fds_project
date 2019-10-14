<template>
  <v-toolbar flat>
      <v-toolbar-side-icon v-if="sideicon">
      </v-toolbar-side-icon>
      <v-toolbar-title class="ml-1">
        <slot name="toolbar_title"></slot>
      </v-toolbar-title>
      <v-toolbar-title style="margin-left: auto;" ml-3>
        <slot name="forfilter"></slot>
      </v-toolbar-title>
      <v-spacer v-if="spacer"></v-spacer>
      <slot name="toolbar_right"></slot>
  </v-toolbar>
</template>

<script>

export default {
  name: 'jx-mobilink-toolbar',
  props: {
    extension: false,
    sideicon: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: true
    },
    spacer: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      titleName: 'Hoat dong'
    }
  },
  computed: {
    title () {
      return this.titleName
    }
  },
  methods: {
  },
  mounted () {
    this.$nextTick(() => {
    })
  }
}
</script>