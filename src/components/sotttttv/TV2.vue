<template>
  <v-app id='dashboard' class="dashboard-tv-wrapper-app">
    <div class="text-xs-center">
      <WidgetLayoutTV
        :templateCode="templateCode"
        :flagCallApi="flagCallApi"
      />
    </div>
    <loading-page class="loading-page-included"></loading-page>
  </v-app>
</template>
  
<script>
  import WidgetLayoutTV from './WidgetLayoutTV'
  export default {
    components: {
      WidgetLayoutTV
    },
    watch: {
      tvSelected (val) {
        this.flagCallApi = this.flagCallApi + 1
      }
    },
    data () {
      return {
        tabs: window.TV2_MENU_FILTER_BTN_NUM || 1,
        templateCode: window.DASHBOARD_TV_2 || 'DASHBOARD_TV_2',
        tvSelected: 0,
        flagCallApi: 0
      }
    },
    created () {
      this.$nextTick(() => {
        this.tabs = window.TV2_MENU_FILTER_BTN_NUM || 1
        this.tvSelected = window.tv2Selected || 0
        let vm = this
        window.intervalTVInner2 = setInterval(function () {
          vm.tvSelected = window.tv2Selected || 0
          vm.tabs = window.TV2_MENU_FILTER_BTN_NUM || 1
        }, 100)
      })
    },
    beforeDestroy () {
      if (window.intervalTVInner2) {
        clearInterval(window.intervalTVInner2)
      }
    },
    mounted () {
      this.$nextTick(() => {
      })
    },
    methods: {
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
