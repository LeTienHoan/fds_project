<template>
  <v-app id='dashboard' class="dashboard-wrapper-app">
    <DashboardTypeDetail2
      :templateCodeItems="loadedTemplateCodes"
    />
    <loading-page class="loading-page-included"></loading-page>
  </v-app>
</template>
  
<script>
  import DashboardTypeDetail2 from '@/components/administration/DashboardTypeDetail2'
  export default {
    components: {
      DashboardTypeDetail2
    },
    watch: {},
    computed: {
      loadedTemplateCodes () {
        return this.$store.getters['dashboard/loadedTemplateCodes']
      }
    },
    created () {
      this.$nextTick(() => {
        this.$store.dispatch('dashboard/loadTemplateCodes')
        this.$store.dispatch('user/getUserItems', {
          class: 'employee',
          start: -1,
          sort: 'fullName_String',
          end: -1
        })
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
