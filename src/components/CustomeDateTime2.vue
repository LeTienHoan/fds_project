



<template>
  
  <div class="custome-date-time2" style="display: flex;">
   <!--  <v-menu style="width: 1px;"
      content-class="custome-date-time-menu"
      ref="menutime"
      :close-on-content-click="false"
      v-model="menutime"
      :nudge-right="40"
      :return-value.sync="time"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      max-width="290px"
      min-width="290px"
    >
      <v-text-field v-show="true"
        slot="activator" style="visibility: hidden"
        v-model="time"
        readonly
      ></v-text-field>
      <v-time-picker v-model="time" @change="changeTime"></v-time-picker>
    </v-menu> -->
    <v-menu style="flex-grow: 1;"
      content-class="custome-date-time-menu2"
      ref="menudate"
      :close-on-content-click="false"
      v-model="menudate"
      :nudge-top="appNudgeTop"
      :nudge-left="appNudgeLeft"
      :return-value.sync="date"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      max-width="290px"
      min-width="290px"
    >
      <v-text-field
        slot="activator"
        v-model="datetimetext"
        :label="label"
        :prepend-icon="prependicon"
        :append-icon="appendicon"
        :placeholder="placeholder"
        :rules="rules"
        :clearable="clearable"
        readonly
      ></v-text-field>
      <v-text-field v-show="false"
        slot="activator"
        v-model="date"
        label="Picker without buttons"
        prepend-icon="event"
        readonly
      ></v-text-field>
      <v-date-picker v-model="date" @input="changeDate"></v-date-picker>
    </v-menu>
  </div>

</template>

<script>

export default {
  name: 'custome-date-time2',
  props: {
    id: {
      type: Number,
      default: null
    },
    datetimevalue: null,
    label: {
      type: String,
      default: ''
    },
    prependicon: {
      type: String,
      default: ''
    },
    appendicon: {
      type: String,
      default: 'event'
    },
    placeholder: {
      type: String,
      default: ''
    },
    clearable: {
      default: false
    },
    rules: {
      type: Array
    },
    format: {
      type: String,
      default: 'DD/MM/YYYY'
    },
    onlydate: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      time: null,
      menudate: false,
      menutime: false,
      date: null,
      datetimetext: '',
      _datetimevalue: this.datetimevalue
    }
  },
  methods: {
    changeDate (date) {
      let vm = this
      vm.$refs.menudate.save(date)
      vm._datetimevalue = window.moment(vm.date || 'YYYY-MM-DD')
      vm.datetimetext = vm._datetimevalue.format(vm.format)
      vm.$emit('syncxxx', vm._datetimevalue)
      if (!vm.onlydate) {
        vm.menutime = true
      }
    },
    changeTime (time) {
      let vm = this
      vm.$refs.menutime.save(time)
      vm._datetimevalue = window.moment(vm.date || 'YYYY-MM-DD')
      vm.datetimetext = vm._datetimevalue.format(vm.format)
      vm.$emit('syncxxx', vm._datetimevalue)
    },
    initComponent () {
      let vm = this
      if (vm._datetimevalue) {
        vm._datetimevalue = window.moment(vm._datetimevalue)
        vm.time = vm._datetimevalue.format('HH:mm')
        vm.date = vm._datetimevalue.format('YYYY-MM-DD')
        vm.datetimetext = vm._datetimevalue.format(vm.format)
      }
    }
  },
  created () {
    this.$nextTick(function () {
      this._datetimevalue = this.datetimevalue
      this.initComponent()
    })
  },
  watch: {
    datetimevalue (val) {
      if (val !== this._datetimevalue) {
        this._datetimevalue = val
        this.initComponent()
      }
    }
  }
}
</script>

<style>
/** to overflow in popup */
.custome-date-time-menu2 {
  overflow-y: hidden;
}
</style>
