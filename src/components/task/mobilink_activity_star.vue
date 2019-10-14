<template>
  <div :class="['vue-star-rating', {'vue-star-rating-rtl':rtl}, {'vue-star-rating-inline': inline}]">
    <div @mouseleave="resetRating" class="vue-star-rating" :title="formattedRating">
      <span v-for="n in maxRating" :class="[{'vue-star-rating-pointer': !readOnly }, 'vue-star-rating-star']">
        <star :fill="fillLevel[n-1]" :size="starSize" :star-id="n" :step="step" :active-color="activeColor" :inactive-color="inactiveColor" :border-color="borderColor" :border-width="borderWidth" :padding="padding" @star-selected="setRating($event, mouse_permission)" @star-mouse-move="setRating" :rtl="rtl"></star>
      </span>
    </div>
  </div>
</template>


<script type="text/javascript">
import star from './star.vue'
const COMPONENT_NAME = 'jx-mobilink-star'
export default {
  name: COMPONENT_NAME,
  components: {
    star
  },
  model: {
    prop: 'rating',
    event: 'rating-selected'
  },
  props: {
    increment: {
      type: Number,
      default: 0.2
    },
    rating: {
      type: Number,
      default: 0
    },
    roundStartRating: {
      type: Boolean,
      default: true
    },
    activeColor: {
      type: String,
      default: '#ffd055'
    },
    inactiveColor: {
      type: String,
      default: '#d8d8d8'
    },
    maxRating: {
      type: Number,
      default: 5
    },
    starSize: {
      type: Number,
      default: 25
    },
    showRating: {
      type: Boolean,
      default: true
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    textClass: {
      type: String,
      default: ''
    },
    inline: {
      type: Boolean,
      default: false
    },
    borderColor: {
      type: String,
      default: '#999'
    },
    borderWidth: {
      type: Number,
      default: 0
    },
    padding: {
      type: Number,
      default: 0
    },
    rtl: {
      type: Boolean,
      default: false
    },
    fixedPoints: {
      type: Number,
      default: null
    },
    class_pk: null,
    class_name: null,
    okrArchive: null,
    permission: null
  },
  created () {
    let vm = this
    this.step = this.increment * 100
    vm.$nextTick(function () {
      vm.currentRating = vm.okrArchive
      vm.selectedRating = vm.currentRating
      vm.createStars(vm.roundStartRating)
      if (vm.permission === 'leader' || vm.permission === 'owner') {
        vm.mouse_permission = true
      } else {
        vm.mouse_permission = false
      }
      // window.axios.get(vm.end_point + 'activities/' + vm.class_pk, config).then(function (response) {
      //   let serializable = response.data
      //   vm.currentRating = serializable.okrArchive
      //   vm.selectedRating = vm.currentRating
      //   vm.createStars(vm.roundStartRating)
      //   if (serializable.permission === 'leader' || serializable.permission === 'owner') {
      //     vm.mouse_permission = true
      //   } else {
      //     vm.mouse_permission = false
      //   }
      // })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
    })
  },
  destroyed () {
    // delete this.increment
    // delete this.rating
    // delete this.roundStartRating
    // delete this.activeColor
    // delete this.inactiveColor
    // delete this.maxRating
    // delete this.starSize
    // delete this.showRating
    // delete this.readOnly
    // delete this.textClass
    // delete this.inline
    // delete this.borderColor
    // delete this.borderWidth
    // delete this.padding
    // delete this.rtl
    // delete this.fixedPoints
    // delete this.class_pk
    // delete this.class_name
    // delete this.okrArchive
    // delete this.permission
    // delete this.setRating
    // delete this.resetRating
    // delete this.createStars
    // delete this.round
    // delete this.formattedRating
    // delete this.shouldRound
    // delete this.step
    // delete this.fillLevel
    // delete this.currentRating
    // delete this.selectedRating
    // delete this.ratingSelected
    // delete this.mouse_permission
  },
  methods: {
    setRating ($event, persist) {
      if (!this.readOnly) {
        const position = (this.increment) ? $event.position / 100 : (100 - $event.position) / 100
        this.currentRating = (($event.id + position) - 1).toFixed(2)
        this.currentRating = (this.currentRating > this.maxRating) ? this.maxRating : this.currentRating
        this.createStars()
        if (persist) {
          let vm = this
          vm.selectedRating = vm.currentRating
          const configStar = {
            headers: {
              'groupId': vm.group_id
            }
          }
          let paramsStar = new URLSearchParams()
          paramsStar.append('okrArchive', vm.selectedRating)
          window.axios.put(vm.end_point + 'activities/' + vm.class_pk,
            paramsStar,
            configStar
          )
            .then(function (response) {
              let serializable = response.data
              window.showMessageToastr('success', 'Cập nhật thành công')
              vm.$emit('rating-selected', serializable.okrArchive)
              vm.ratingSelected = true
            })
            .catch(function (error) {
              console.log(error)
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
        } else {
          this.$emit('current-rating', this.currentRating)
        }
      }
    },
    resetRating () {
      if (!this.readOnly) {
        this.currentRating = this.selectedRating
        this.createStars(this.shouldRound)
      }
    },
    createStars (round = true) {
      if (round) {
        this.round()
      }
      for (var i = 0; i < this.maxRating; i++) {
        let level = 0
        if (i < this.currentRating) {
          level = (this.currentRating - i > 1) ? 100 : (this.currentRating - i) * 100
        }
        this.$set(this.fillLevel, i, Math.round(level))
      }
    },
    round () {
      let inv = 1.0 / this.increment
      this.currentRating = Math.min(this.maxRating, Math.ceil(this.currentRating * inv) / inv)
    }
  },
  computed: {
    formattedRating () {
      return (this.fixedPoints === null) ? this.currentRating : this.currentRating.toFixed(this.fixedPoints)
    },
    shouldRound () {
      return this.ratingSelected || this.roundStartRating
    }
  },
  watch: {
    rating (val) {
      this.currentRating = val
      this.selectedRating = val
      this.createStars()
    }
  },
  data () {
    return {
      step: 0,
      fillLevel: [],
      currentRating: 0,
      selectedRating: 0,
      ratingSelected: false,
      mouse_permission: true
    }
  }
}
</script>

<style scoped>
.vue-star-rating-star {
  display: inline-block;
}
.vue-star-rating-pointer {
  cursor: pointer;
}
.vue-star-rating {
  display: flex;
  align-items: center;
}
.vue-star-rating-inline {
  display: inline-flex;
}
.vue-star-rating-rating-text {
  margin-top: 7px;
  margin-left: 7px;
}
.vue-star-rating-rtl {
  direction: rtl;
}
.vue-star-rating-rtl .vue-star-rating-rating-text {
  margin-right: 10px;
  direction:rtl;
}
</style>
