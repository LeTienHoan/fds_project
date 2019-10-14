<template>
  <div id="layoutResize">
    <div id="layoutResizeLeft">
      <div id="layoutResizeLeftContent" :style="{paddingRight: (leftMaxWidth?4:0) +'px;'}">
        <slot name="left"></slot>
      </div>
    </div>
    <div id="layoutResizeRight">
      <div id="handle1" v-show="leftMaxWidth!=0"></div>
      <div id="layoutResizeRightContent" :style="'padding-left: ' + (leftMaxWidth?4:0) +'px;'">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'move-layout'
  export default {
    name: COMPONENT_NAME,
    props: {
      leftWidth: {
        type: Number,
        default: 30
      },
      leftMinWidth: {
        type: Number,
        default: 20
      },
      leftMaxWidth: {
        type: Number,
        default: 50
      }
    },
    data () {
      return {
      }
    },
    created () {
      this.$nextTick(function () {
        let vm = this
        vm.setMinHeightMoveLayoutWraper()
        vm.initComp()
      })
    },
    watch: {
      leftMaxWidth () {
        this.initComp()
      }
    },
    methods: {
      emitWidth (layoutResizeLeftDiv, layoutResizeRightDiv) {
        this.$emit('resized', {left: layoutResizeLeftDiv.width(), right: layoutResizeRightDiv.width()})
      },
      setMinHeightMoveLayoutWraper () {
        let vm = this
        if (document.getElementById('layoutResize')) {
          let leftHeight = document.getElementById('layoutResizeLeftContent').offsetHeight
          let rightHeight = document.getElementById('layoutResizeRightContent').offsetHeight
          window.$('#layoutResize').css('min-height', leftHeight > rightHeight ? leftHeight : rightHeight)
          setTimeout(() => {
            vm.setMinHeightMoveLayoutWraper()
          }, 1000)
        }
      },
      initComp () {
        let vm = this
        let isResizing1 = false
        let layoutResizeLeftDiv = window.$('#layoutResizeLeft')
        let layoutResizeRightDiv = window.$('#layoutResizeRight')
        layoutResizeLeftDiv.css({
          width: (String(vm.leftWidth) + '%'),
          'min-width': (String(vm.leftMinWidth) + '%'),
          'max-width': (String(vm.leftMaxWidth) + '%')
        })
        layoutResizeRightDiv.css({
          width: (String(100 - vm.leftWidth) + '%'),
          'min-width': (String(100 - vm.leftMaxWidth) + '%'),
          'max-width': (String(100 - vm.leftMinWidth) + '%')
        })
        window.$(function () {
          let minLeftWrap = (window.$('#layoutResize').width() * vm.leftMinWidth) / 100
          let layoutResizeDiv = window.$('#layoutResize')
          let handle1 = window.$('#handle1')
          handle1.on('mousedown', function (e) {
            isResizing1 = true
          })
          //
          window.$(document).on('mousemove', function (e) {
            if (!isResizing1) {
              return
            }
            let offsetRight = e.clientX - layoutResizeDiv.offset().left
            let rightWidth = layoutResizeDiv.width() - offsetRight
            let leftWidth = offsetRight
            if (minLeftWrap > offsetRight) {
              rightWidth = layoutResizeDiv.width() - minLeftWrap
              leftWidth = minLeftWrap
            }
            layoutResizeLeftDiv.css('width', leftWidth)
            layoutResizeLeftDiv.css('right', rightWidth)
            layoutResizeRightDiv.css('width', rightWidth)
            vm.emitWidth(layoutResizeLeftDiv, layoutResizeRightDiv)
          }).on('mouseup', function (e) {
            vm.emitWidth(layoutResizeLeftDiv, layoutResizeRightDiv)
            isResizing1 = false
          })
          vm.emitWidth(layoutResizeLeftDiv, layoutResizeRightDiv)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  #layoutResize {
    position: relative;
    min-height: 100vh;
    max-height: 100%;
    width: 100%;
    #layoutResizeLeft {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
    }
    #layoutResizeRight {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      /* white-space: nowrap;
      overflow: hidden; */
      /** background: #fff; */
      #handle1 {
        position: absolute;
        left: -4px;
        top: 0;
        bottom: 0;
        width: 8px;
        cursor: ew-resize;
        background: transparent;
      }
    }
  }

</style>

<style>
/**
#layoutResizeLeft, #layoutResizeRight {
	color: #fff;
	background: linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB);
	background-size: 400% 400%;
	-webkit-animation: Gradient 15s ease infinite;
	-moz-animation: Gradient 15s ease infinite;
	animation: Gradient 15s ease infinite;
}

@-webkit-keyframes Gradient {
	0% {
		background-position: 0% 50%
	}
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
}

@-moz-keyframes Gradient {
	0% {
		background-position: 0% 50%
	}
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
}

@keyframes Gradient {
	0% {
		background-position: 0% 50%
	}
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
} */
</style>
