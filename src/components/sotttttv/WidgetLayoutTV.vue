<template>
  <div class="dashboard-wrapper-tv">
    <div style="height: 150px;overflow:scroll;" v-show="false"> <!--console change widget layout-->
      {{eventLog}}
    </div>
    <v-layout wrap class="dashboard-wrapper-tv">
      <v-flex xs12>
        <grid-layout 
          :layout="layoutxxx"
          :col-num="20"
          :row-height="1"
          :is-draggable="draggable"
          :is-resizable="resizable"
          :vertical-compact="true"
          :use-css-transforms="true"
          :right-to-left="true"
        >
          <grid-item 
            v-for="(item, itemIndex) in layoutxxx" :key="itemIndex"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            @resize="resizeEvent"
            @move="moveEvent"
            @resized="resizedEvent"
            @moved="movedEvent"
          >
            <div :id="'content-aaa-' + item.widgetLayoutId" class="grid-item-content-template">
              <div class="text">
                <div class="text-xs-center pt-2">
                  <v-progress-circular
                    :size="50"
                    color="grey"
                    indeterminate
                  ></v-progress-circular>
                </div>
              </div>
            </div>
          </grid-item>
        </grid-layout>
      </v-flex>
    </v-layout>
  </div>
</template>
  
<script>
  export default {
    props: {
      templateCode: {
        type: String,
        default: ''
      },
      curselected: null,
      flagCallApi: {
        type: Number,
        default: 0
      }
    },
    components: {
      'grid-item': window.VueGridLayout.GridItem,
      'grid-layout': window.VueGridLayout.GridLayout
    },
    data () {
      return {
        copyOneTime: {},
        // nnn
        draggable: true,
        resizable: true,
        eventLog: [],
        layoutxxx: []
      }
    },
    watch: {
      flagCallApi (val) {
        for (let i in this.layoutxxx) {
          if (window[this.layoutxxx[i].widgetCode]) {
            window[this.layoutxxx[i].widgetCode]()
          }
        }
      }
    },
    created () {
      this.$nextTick(() => {
        let vm = this
        this.$store.dispatch('dashboard/loadLayouts', this.templateCode)
          .then(response => {
            let tempLayouts = [].concat(response.data || [])
            let layout = tempLayouts.map(function (item) {
              return {
                x: item.widgetX,
                y: item.widgetY,
                w: item.widgetWidth,
                h: item.widgetHeight,
                i: item.widgetLayoutId.toString(),
                widgetX: item.widgetX,
                widgetY: item.widgetY,
                widgetWidth: item.widgetWidth,
                widgetHeight: item.widgetHeight,
                widgetLayoutId: item.widgetLayoutId,
                widgetCode: item.widgetCode,
                widgetName: item.widgetName
              }
            })
            vm.setContent(layout)
            vm.layoutxxx = layout
          }, error => {
            console.log(error)
          })
      })
    },
    mounted () {
      this.$nextTick(() => {
        this.readly = true
      })
    },
    methods: {
      /**
       *
       * @param i the item id/index
       * @param newH new height in grid rows
       * @param newW new width in grid columns
       * @param newHPx new height in pixels
       * @param newWPx new width in pixels
       *
       */
      moveEvent (i, newX, newY) {
        let msg = 'MOVE i=' + i + ', X=' + newX + ', Y=' + newY
        this.eventLog.push(msg)
      },
      resizeEvent (i, newH, newW) {
        let msg = 'RESIZE i=' + i + ', H=' + newH + ', W=' + newW
        this.eventLog.push(msg)
      },
      movedEvent (ixx, newX, newY) {
        let msg = 'MOVED i=' + ixx + ', X=' + newX + ', Y=' + newY
        this.eventLog.push(msg)
        let layoutEdit = this.layoutxxx.filter(({ i }) => i === ixx)
        console.log(layoutEdit)
        layoutEdit[0]['widgetX'] = newX
        layoutEdit[0]['widgetY'] = newY
        this.$store.dispatch('dashboard/editLayout', layoutEdit[0])
      },
      resizedEvent (ixx, newH, newW, newHPx, newWPx) {
        let msg = 'RESIZED i=' + ixx + ', H=' + newH + ', W=' + newW + ', H(px)=' + newHPx + ', W(px)=' + newWPx
        this.eventLog.push(msg)
        let layoutEdit = this.layoutxxx.filter(({ i }) => i === ixx)
        layoutEdit[0]['widgetWidth'] = newW
        layoutEdit[0]['widgetHeight'] = newH
        this.$store.dispatch('dashboard/editLayout', layoutEdit[0])
      },
      setContent (layouts) {
        let vm = this
        layouts.forEach((layout) => {
          vm.callAjaxWidget(layout.widgetLayoutId)
        })
      },
      callAjaxWidget (widgetLayoutId) {
        let vm = this
        let url = vm.end_point_new + 'widgetlayouts/content/' + widgetLayoutId
        window.axios.get(url, vm.apiConfigHeader)
          .then(function (response) {
            window.$('#content-aaa-' + widgetLayoutId).html(response.data || 'NO HTML')
          })
          .catch(function (error) {
            console.log(error)
          })
      }
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

/*** EXAMPLE ***/
#content {
    width: 100%;
}

.vue-grid-layout {
    background: transparent !important;
}

.layoutJSON {
    background: #ddd;
    border: 1px solid black;
    margin-top: 10px;
    padding: 10px;
}

.eventsJSON {
    background: #ddd;
    border: 1px solid black;
    margin-top: 10px;
    padding: 10px;
    height: 100px;
    overflow-y: scroll;
}

.columns {
    -moz-columns: 120px;
    -webkit-columns: 120px;
    columns: 120px;
}



.vue-resizable-handle {
    z-index: 5000;
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: 0;
    right: 0;
    background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
    background-position: bottom right;
    padding: 0 3px 3px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: se-resize;
}

.vue-grid-item:not(.vue-grid-placeholder) {
    background: rgb(255, 253, 253) !important;
    border: 0 !important;
}

.vue-grid-item.resizing {
    opacity: 0.9;
}

.vue-grid-item.static {
    background: #cce;
}

.vue-grid-item .text {
    font-size: 24px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 100%;
    width: 100%;
}

.vue-grid-item .no-drag {
    height: 100%;
    width: 100%;
}

.vue-grid-item .minMax {
    font-size: 12px;
}

.vue-grid-item .add {
    cursor: pointer;
}

.vue-draggable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
    background-position: bottom right;
    padding: 0 8px 8px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: pointer;
}

/** HungPD */
.dashboard-wrapper-tv + div .menu__activator .btn {
  bottom: 40px;
    left: 0;
    z-index: 10;
    box-shadow: none;
    height: 40px;
    width: 50px;
    min-width: inherit;
    border-radius: 0;
}
.dashboard-wrapper-tv + div .menu__activator img {
  height: 20px;
}

.grid-item-content-template {
  height: 100%;
}

</style>
