<template>
  <label role="checkbox" 
    :style="maxWidth"
    :class="className"
    :aria-checked="ariaChecked">
    <input type="checkbox"
        class="v-switch-input"
        @change.stop="toggle">
    <div class="v-switch-core"
        :style="coreStyle">
      <div class="v-switch-button"
        :style="buttonStyle"/>
    </div>
      <template v-if="labels">
        <span class="v-switch-label v-left"
          :title="title_checked"
          :style="labelStyle"
          v-if="toggled"
          v-html="labelChecked"/>
        <span class="v-switch-label v-right"
          :title="title_unchecked"
          :style="labelStyle"
          v-else
          v-html="labelUnchecked"/>
      </template>
  </label>
</template>

<script>
  const constants = {
    colorChecked: '#75C791',
    colorUnchecked: '#bfcbd9',
    cssColors: false,
    labelChecked: 'on',
    labelUnchecked: 'off',
    width: 50,
    height: 22,
    margin: 3
  }
  const contains = (object, title) => {
    return typeof object === 'object' && object.hasOwnProperty(title)
  }
  const px = v => v + 'px'
  export default {
    name: 'toggle-button',
    props: {
      title_checked: '',
      title_unchecked: '',
      value: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      sync: {
        type: Boolean,
        default: false
      },
      speed: {
        type: Number,
        default: 300
      },
      color: {
        type: [String, Object],
        validator (value) {
          return typeof value === 'object'
            ? (value.checked || value.unchecked)
            : typeof value === 'string'
        }
      },
      cssColors: {
        type: Boolean,
        default: false
      },
      labels: {
        type: [Boolean, Object],
        default: false,
        validator (value) {
          return typeof value === 'object'
            ? (value.checked || value.unchecked)
            : typeof value === 'boolean'
        }
      },
      height: {
        type: Number,
        default: constants.height
      },
      width: {
        type: Number,
        default: constants.width
      }
    },
    computed: {
      className () {
        let { toggled, disabled } = this
        return ['vue-js-switch', { toggled, disabled }]
      },
      ariaChecked () {
        return this.toggled.toString()
      },
      coreStyle () {
        return {
          width: px(this.width),
          height: px(this.height),
          backgroundColor: this.cssColors ? null : this.colorCurrent,
          borderRadius: px(Math.round(this.height / 2))
        }
      },
      maxWidth () {
        return {
          width: px(this.width) + '!important'
        }
      },
      buttonRadius () {
        return this.height - constants.margin * 2
      },
      distance () {
        return px(this.width - this.height + constants.margin)
      },
      buttonStyle () {
        return {
          width: px(this.buttonRadius),
          height: px(this.buttonRadius),
          transition: `transform ${this.speed}ms`,
          transform: this.toggled
            ? `translate3d(${this.distance}, 3px, 0px)`
            : null
        }
      },
      labelStyle () {
        return {
          lineHeight: px(this.height)
        }
      },
      colorChecked () {
        let { color } = this
        if (typeof color !== 'object') {
          return color || constants.colorChecked
        }
        return contains(color, 'checked')
          ? color.checked
          : constants.colorChecked
      },
      colorUnchecked () {
        let { color } = this
        return contains(color, 'unchecked')
          ? color.unchecked
          : constants.colorUnchecked
      },
      colorCurrent () {
        return this.toggled
          ? this.colorChecked
          : this.colorUnchecked
      },
      labelChecked () {
        return contains(this.labels, 'checked')
          ? this.labels.checked
          : constants.labelChecked
      },
      labelUnchecked () {
        return contains(this.labels, 'unchecked')
          ? this.labels.unchecked
          : constants.labelUnchecked
      }
    },
    watch: {
      value (value) {
        if (this.sync) {
          this.toggled = !!value
        }
      }
    },
    data () {
      return {
        toggled: !!this.value
      }
    },
    methods: {
      toggle (event) {
        this.toggled = !this.toggled
        this.$emit('input', this.toggled)
        this.$emit('change', {
          value: this.toggled,
          srcEvent: event
        })
      }
    },
    destroyed () {
      // delete this.title_checked
      // delete this.title_unchecked
      // delete this.value
      // delete this.disabled
      // delete this.sync
      // delete this.speed
      // delete this.color
      // delete this.cssColors
      // delete this.labels
      // delete this.height
      // delete this.width
      // delete this.className
      // delete this.ariaChecked
      // delete this.coreStyle
      // delete this.maxWidth
      // delete this.buttonRadius
      // delete this.distance
      // delete this.buttonStyle
      // delete this.labelStyle
      // delete this.colorChecked
      // delete this.colorUnchecked
      // delete this.colorCurrent
      // delete this.labelChecked
      // delete this.labelUnchecked
      // delete this.toggled
    }
  }
</script>

<style scoped>
.vue-js-switch {
  display: inline-block;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  user-select: none;
  font-size: 10px;
  cursor: pointer;
}
.vue-js-switch .v-switch-input {
  display: none;
}
.vue-js-switch .v-switch-label {
  position: absolute;
  top: 0;
  font-weight: 600;
  color: white;
}
.vue-js-switch .v-switch-label.v-left {
  left: 10px;
}
.vue-js-switch .v-switch-label.v-right {
  right: 10px;
}
.vue-js-switch .v-switch-core {
  display: block;
  position: relative;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: border-color .3s, background-color .3s;
  user-select: none;
}
.vue-js-switch .v-switch-core .v-switch-button {
  display: block;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  transform: translate3d(3px, 3px, 0);
  border-radius: 100%;
  background-color: #fff;
}
.vue-js-switch.disabled {
  pointer-events: none;
  opacity: 0.6;
}

</style>
