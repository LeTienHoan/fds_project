<template>
  <div class="full-calendar-header">
    <div class="header-left">
      <span class="prev-month" @click.stop="goPrev">
        <i class="material-icons">fast_rewind</i>
      </span>
      <span class="title">{{title}}</span>
      <span class="next-month" @click.stop="goNext">
        <i class="material-icons">fast_forward</i>
      </span>
    </div>
    <div class="header-center">
      <slot name="header-center">
      </slot>
    </div>
    <div class="header-right">
      <slot name="header-right">
      </slot>
    </div>
  </div>
</template>
<script type="text/babel">
  const COMPONENT_NAME = 'jx-mobilink-calendar-header'
  export default {
    name: COMPONENT_NAME,
    props : {
      currentMonth : {},
      titleFormat  : {},
      firstDay     : {},
      monthNames   : {},
      locale       : {}
    },
    data () {
      return {
        
      }
    },
    computed: {
      title () {
        if (!this.currentMonth) return;
        return this.currentMonth.locale(this.locale).format('MMMM YYYY')
      }
    },
    methods : {
      goPrev () {
        let newMonth = moment(this.currentMonth).subtract(1, 'months').startOf('month');
        this.$emit('change', newMonth);
      },
      goNext () {
        let newMonth = moment(this.currentMonth).add(1, 'months').startOf('month');
        this.$emit('change', newMonth);
      }
    }
  }
</script>
<style>
.full-calendar-header {
  display: flex;
  align-items: center;
}
.full-calendar-header .header-left, .full-calendar-header .header-right {
  flex: 1;
}
.full-calendar-header .header-center {
  flex: 3;
  text-align: center;
}
.full-calendar-header .header-center .title {
  margin: 0 10px;
}
.full-calendar-header .header-center .prev-month, .full-calendar-header .header-center .next-month {
  cursor: pointer;
}
</style>
