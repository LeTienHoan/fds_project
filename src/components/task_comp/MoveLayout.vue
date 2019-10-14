<template>
<div :id="'m-move-m-layout-m-wraper' + id" class="move-layout-wraper">
  <div id="moveLayout">
    <div id="bigLeftContainer">
      <div id="smallLeft">
        <div id="moveLayoutLeftContent" style="padding-right: 4px;">
          <slot name="left"></slot>
        </div>
      </div>
      <div id="center">
        <div id="bigLeftHandle"></div>
        <div id="moveLayoutCenterContent" style="padding-left: 4px; padding-right: 4px;">
          <slot name="center"></slot>
        </div>
      </div>
    </div>
    <div id="bigRightContainer">
      <div id="bigRightHandle"></div>
      <div id="moveLayoutRightContent" style="padding-left: 4px;">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  const COMPONENT_NAME = 'move-layout'
  export default {
    name: COMPONENT_NAME,
    props: {
      id: {
        default: '1'
      },
      laylouts: {
        type: Object,
        default: {
          cssLeft_width: 50,
          cssLeft_min_width: 30,
          center_width: 60
        }
      }
    },
    data () {
      return {
      }
    },
    created () {
      this.$nextTick(function () {
        this.setMinHeightMoveLayoutWraper()
        let isResizing = false
        let isResizing1 = false
        let vm = this
        window.$(function () {
          vm.initLayoutSize()
          let moveLayoutWrapper = (window.$('#m-move-m-layout-m-wraper' + vm.id + '.move-layout-wraper').width() * 20) / 100
          let bigLeftContainer = window.$('#m-move-m-layout-m-wraper' + vm.id + ' #bigLeftContainer')
          let smallLeft = window.$('#m-move-m-layout-m-wraper' + vm.id + ' #bigLeftContainer #smallLeft')
          let center = window.$('#m-move-m-layout-m-wraper' + vm.id + ' #bigLeftContainer #center')
          let bigLeftHandle = window.$('#m-move-m-layout-m-wraper' + vm.id + ' #bigLeftContainer #bigLeftHandle')
          let moveLayout = window.$('#m-move-m-layout-m-wraper' + vm.id + ' #moveLayout')
          let bigRightContainer = window.$('#m-move-m-layout-m-wraper' + vm.id + ' #bigRightContainer')
          let bigRightHandle = window.$('#m-move-m-layout-m-wraper' + vm.id + ' #bigRightContainer #bigRightHandle')
          bigLeftHandle.on('mousedown', function (e) {
            isResizing = true
          })
          bigRightHandle.on('mousedown', function (e) {
            isResizing1 = true
          })
          window.$(document).on('mousemove', function (e) {
            if (!isResizing) {
              return
            }
            let offsetRight = bigLeftContainer.width() - (e.clientX - bigLeftContainer.offset().left)
            smallLeft.css('right', offsetRight)
            center.css('width', offsetRight)
            vm.$emit('resized', {left: smallLeft.width(), center: center.width(), right: bigRightContainer.width()})
          }).on('mouseup', function (e) {
            isResizing = false
          })
          //
          window.$(document).on('mousemove', function (e) {
            if (!isResizing1) {
              return
            }
            let offsetRight1 = moveLayout.width() - (e.clientX - moveLayout.offset().left)
            bigLeftContainer.css('right', offsetRight1)
            if (e.clientX - moveLayout.offset().left < moveLayout.width()) {
              bigLeftContainer.css('width', e.clientX - moveLayout.offset().left)
            }
            if (moveLayoutWrapper > offsetRight1) {
              bigLeftContainer.css('width', moveLayout.width() - moveLayoutWrapper)
            }
            if (moveLayoutWrapper > e.clientX - moveLayout.offset().left) {
              bigLeftContainer.css('width', moveLayoutWrapper)
            }
            bigRightContainer.css('width', offsetRight1)
            vm.$emit('resized', {left: smallLeft.width(), center: center.width(), right: bigRightContainer.width()})
          }).on('mouseup', function (e) {
            isResizing1 = false
          })
        })
      })
    },
    watch: {
    },
    methods: {
      setMinHeightMoveLayoutWraper () {
        let vm = this
        if (window.$('#m-move-m-layout-m-wraper' + vm.id + ' #moveLayoutLeftContent').length) {
          let leftHeight = window.$('#m-move-m-layout-m-wraper' + vm.id + ' #moveLayoutLeftContent').outerHeight()
          let centerHeight = window.$('#m-move-m-layout-m-wraper' + vm.id + ' #moveLayoutCenterContent').outerHeight()
          let rightHeight = window.$('#m-move-m-layout-m-wraper' + vm.id + ' #moveLayoutRightContent').outerHeight()
          window.$('#m-move-m-layout-m-wraper' + vm.id + '.move-layout-wraper').css('min-height', Math.max(leftHeight, centerHeight, rightHeight))
          setTimeout(() => {
            vm.setMinHeightMoveLayoutWraper()
          }, 1000)
        }
      },
      initLayoutSize () {
        let vm = this
        window.$('#m-move-m-layout-m-wraper' + vm.id + ' #bigLeftContainer').css({
          'min-width': (String(vm.laylouts.cssLeft_min_width) + '%'),
          'width': (String(vm.laylouts.cssLeft_width) + '%')
        })
        window.$('#m-move-m-layout-m-wraper' + vm.id + ' #bigRightContainer').css({
          'width': (String(100 - vm.laylouts.cssLeft_width) + '%'),
          'max-width': (String(100 - vm.laylouts.cssLeft_min_width) + '%')
        })
        window.$('#m-move-m-layout-m-wraper' + vm.id + ' #bigLeftContainer #smallLeft').css({
          'right': (String(vm.laylouts.center_width) + '%')
        })
        window.$('#m-move-m-layout-m-wraper' + vm.id + ' #bigLeftContainer #center').css({
          'width': (String(vm.laylouts.center_width) + '%')
        })
      }
    }
  }
</script>

<style>
  .move-layout-wraper {
    position: relative;
    min-height: 100vh;
    max-height: 100%;
  }
</style>


<style lang="scss" scoped>
  #m-move-m-layout-m-wrapernewsboard-layout {
    min-height: inherit !important;
    height: calc(100vh - 130px);
  }
  #moveLayout {
      width: 100%;
      min-height: 300px;
  }
  #bigLeftContainer {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      /** bigLeftContainer width + bigRightContainer width = 100%*/
      width: 50%;
      /** bigLeftContainer min-width + bigRightContainer max-width = 100%*/
      min-width: 30%;
  }
  #bigRightContainer {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 50%;
      min-width: 20%;
      max-width: 70%;
 /*     white-space: nowrap;
      overflow: hidden;*/
      background: #fff;
  }
  #bigLeftContainer #smallLeft {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      /** smallLeft right = center width */
      right: 60%;
      min-width: 20%;
      max-width: 80%; 
      white-space: nowrap;
      overflow: hidden;
      background: #fff
  }
  #bigLeftContainer #center {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 60%;
      max-width: 80%;
      min-width: 20%;
      /*white-space: nowrap;*/
      /*overflow: hidden;*/
      background: #fff;
  }
  #bigLeftContainer #bigLeftHandle {
      position: absolute;
      left: -4px;
      top: 0;
      bottom: 0;
      width: 8px;
      cursor: w-resize;
      background: #eee;
  }
  #bigRightContainer #bigRightHandle {
      position: absolute;
      left: -4px;
      top: 0;
      bottom: 0;
      width: 8px;
      cursor: w-resize;
      background: #eee;
  }

</style>
