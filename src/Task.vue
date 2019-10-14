<template>
  <div id='avtivity-task'>
      <router-view></router-view>
    <loading-page class="loading-page-included"></loading-page>
  </div>
</template>
  
<script>
  export default {
    created () {
      this.$store.dispatch('user/getUserItems', {
        class: 'employee',
        start: -1,
        sort: 'fullName_String',
        end: -1
      })
    }
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
