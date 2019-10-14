<template>
  <v-app id='sotttttv' class="sotttttv-wrapper-app">
    <router-view></router-view>
    <loading-page class="loading-page-included"></loading-page>
  </v-app>
</template>
  
<script>
  export default {
    watch: {},
    computed: {
    },
    created () {
      this.$nextTick(() => {
      })
    },
    mounted () {
      this.$nextTick(() => {
      })
    },
    methods: {}
  }
</script>

<style>
.fullwidth {
  width: calc(100% - 0px);
}
.cursor-pointer {
  cursor: pointer;
}

.label_align {
  display: flex;
  align-items: center;
}
.tooltip {
  opacity: 1;
  z-index: 0;
}
.card__title{
  padding: 0px 16px;
}


.avtivity-task {
  position: relative;
}
.loading-page-included {
  position: fixed;
  width: 100%;
  z-index: 9999;
  top: 0;
  left: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
