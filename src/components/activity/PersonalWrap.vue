<template>
    <div class="calendar-personal-wrap fullwidth">
      <router-view></router-view>
    </div>
</template>

<script>

export default {
  data () {
    return {
      titleName: 'Hoat dong',
      drawer: true,
      drawerWidth: '300'
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (Number(this.$route.params.id) >= 0) {
        console.log('Redirect to next')
      } else {
        this.$router.push('/notfound')
      }
    })
  }
}
</script>
<style lang="scss">

.listcontainer {
  display: flex;
}

div.inlineaaaa {
  float:left;
}

</style>