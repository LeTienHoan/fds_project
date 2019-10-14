<template>
  <div>
    <mbl-expand-panel
      :ownExpanded= "ownExpanded"
    >
      <template slot="title-name">
        Sinh nhật tháng {{ birthdate }}
      </template>
      <template slot="card-text-container">
        <div>
          <v-layout wrap :key="index" v-for="(item, index) in employeesBirthday" class="pa-2">
            <v-flex xs3>
              <span v-show="false" :data-call="getImgBlob(item)"></span>
              <img :id="'img-avarta-' + item.employeeId" :src="defaultUserImg" style="height: 100%;width: 100%;max-height: 60px;max-width: 60px;border-radius: 50%;"/>
            </v-flex>
            <v-flex xs9 class="pl-2">
              <div class="text-bold">{{item.fullName}}</div>
              <div class="">{{item.jobTitle}}</div>
              <div>SN: {{ item.birthdate | date }}</div>
            </v-flex>
          </v-layout>
          <div class="pt-2 text-xs-right">
            <v-pagination v-model="paginationPage" :length="pagination"></v-pagination>
          </div>
        </div>
      </template>
    </mbl-expand-panel>
  </div>
  
</template>

<script>
const COMPONENT_NAME = 'birthdate'
export default {
  name: COMPONENT_NAME,
  components: {
  },
  props: {
  },
  watch: {
    'paginationPage': {
      handler () {
        this.$store.dispatch('setPaginationPageBirthday', {
          pagination: this.paginationPage
        })
      }
    }
  },
  computed: {
    employeesBirthday () {
      return this.$store.getters.loadedEmployeesBirthday.data
    },
    pagination () {
      return Math.ceil(this.$store.getters.loadedEmployeesBirthday.total / 5)
    }
  },
  data () {
    return {
      valid: '',
      ownExpanded: true,
      paginationPage: 1,
      birthdate: 0
    }
  },
  created () {
  },
  methods: {
    getImgBlob (item) {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        },
        responseType: 'arraybuffer'
      }
      let imgBlob = ''
      window.axios.get(vm.end_point + 'employees/' + item.employeeId + '/photo',
        config
      )
        .then(function (response) {
          let blob = new Blob([response.data], {type: 'image/png'})
          imgBlob = window.URL.createObjectURL(blob)
          window.$('#img-avarta-' + item.employeeId).attr('src', imgBlob)
        })
        .catch(function (error) {
          console.log(error.response)
          window.$('#img-avarta-' + item.employeeId).attr('src', vm.defaultUserImg)
        })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.birthdate = window.moment(new Date()).month() + 1
      this.$store.dispatch('loadEmployeesBirthday', this.birthdate)
    })
  }
}
</script>

<style >
    
</style>