<template>
  
  <div :class="'custome-date-time custome-date-time-' + id">
    <v-menu style="flex-grow: 1;"
      :content-class="'custome-date-time-menu custome-date-time-' + id"
     
      v-model="menudate"
      :nudge-top="appNudgeTop"
      :nudge-left="appNudgeLeft"  
      transition="scale-transition"
      offset-y
      full-width
      :disabled="disabled"
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
        :disabled="disabled"
      ></v-text-field>
      <vue-ctk-date-time-picker
        v-model="ownComponentModel"
        :minute-interval="10"
        color="primary"
        time-format="HH:mm"
        without-input
        :locale="language"
        :disable-time="onlydate"
      >
      </vue-ctk-date-time-picker>
    </v-menu>
  </div>

</template>

<script>

export default {
  name: 'custome-date-time',
  props: {
    id: {
      type: Number,
      default: null
    },
    customeclass: {
      type: String,
      default: 'custome-date-time'
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
      default: 'DD/MM/YYYY HH:mm'
    },
    onlydate: {
      type: Boolean,
      default: false
    },
    autocomplate: {
      type: Boolean,
      default: false
    },
    autoopen: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    datetimevalue (val) {
      let newV = window.moment(val).format(this.format)
      let curV = window.moment(this.ownComponentModel).format(this.format)
      if (newV !== curV) {
        this.ownComponentModel = this.datetimevalue ? window.moment(this.datetimevalue) : null
        this.datetimetext = this.datetimevalue ? window.moment(this.datetimevalue).format(this.format) : null
      }
    },
    menudate (val) {
      if (!val) {
        this.syncxxx()
      }
    },
    ownComponentModel () {
      if (this.autocomplate && this.menudate) {
        this.menudate = false
      }
    },
    datetimetext (val) {
      if (!val) {
        this.ownComponentModel = null
        this.syncxxx()
      }
    }
  },
  data () {
    return {
      menudate: false,
      datetimetext: null,
      ownComponentModel: null
    }
  },
  mounted () {
    let vm = this
    vm.ownComponentModel = this.datetimevalue ? window.moment(this.datetimevalue) : null
    vm.datetimetext = this.datetimevalue ? window.moment(this.datetimevalue).format(this.format) : null
    this.menudate = this.autoopen
    if (!vm.autocomplate) {
      window.$('.custome-date-time-menu .ctk-date-time-picker').append(
        window.$('<button/>', {
          'class': 'btn btn-close-ctk-date-time',
          'id': 'btn-close-ctk-date-time-id-' + vm.id,
          'text': 'OK'
        })
      )
      window.$('#btn-close-ctk-date-time-id-' + vm.id).click(function (event) {
        vm.menudate = false
      })
    }
  },
  destroyed () {
    /** delete this.id
    delete this.customeclass
    delete this.datetimevalue
    delete this.label
    delete this.prependicon
    delete this.appendicon
    delete this.placeholder
    delete this.clearable
    delete this.rules
    delete this.format
    delete this.onlydate
    delete this.autocomplate
    delete this.autoopen
    delete this.disabled
    delete this.menudate
    delete this.datetimetext
    delete this.ownComponentModel
    delete this.syncxxx */
  },
  methods: {
    syncxxx () {
      let value = this.ownComponentModel
      if (value) {
        this.$emit('syncxxx', value)
        this.datetimetext = window.moment(value).format(this.format)
      } else {
        this.$emit('syncxxx', null)
        this.datetimetext = ''
      }
    }
  }
}
</script>

<style lang="scss">
/** to overflow in popup */
.custome-date-time-menu {
  .ctk-date-time-picker {
    .btn-close-ctk-date-time {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 5;
      border-radius: 50%;
      padding: 0;
      height: 30px;
      min-width: inherit;
      width: 30px;
      border: 1px solid #b9ddff;
      background: transparent!important;
      box-shadow: none;
      color: #b9ddff;
      &:hover {
        border-color: white;
        color: white;
      }
    }
    .datepicker-container {
      flex-shrink: 0;
    }
    .timepicker-container {
      flex-grow: 0;
    }
    .time-container.hours-container {
      position: absolute;
      width: 90px !important;
    }
    .time-container.minutes-container {
      position: absolute;
      width: 90px !important;
      background: white;
      right: 0;
    }
    .datetimepicker {
      margin-bottom: 0 !important;
      background-color: white;
      padding-bottom: 10px;
    }
    .numbers-container.mh-100 {
      max-height: 307px !important;
    }
  }
}
</style>
