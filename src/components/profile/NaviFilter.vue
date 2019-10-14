<template>
  <div>
  <v-navigation-drawer
      stateless
      v-model="drawer"
      :width="drawerWidth"
      :mini-variant.sync="mini" hide-overlay
  >
    <div style="text-align: center;">
      <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" :accept="MSystemConfiguration.configuration.profile.imageextensions || 'image/*'" style="display: none" />
      <img :src="imgBlob" style="max-width: 100%;height: auto;">
      <v-btn v-on:click="handleFileUploadx()" class="primary ma-0 btn--small" style="width: 100%">Tải ảnh đại diện</v-btn>
    </div>
    <v-layout wrap class="center-all my-2" style="text-align: center;">
      <v-flex xs12>
        <b>Tài khoản</b>
      </v-flex>
      <v-flex xs12>
        {{ personalInformation.account }}
      </v-flex>
    </v-layout>
    <v-list>
      <v-list-group v-for="(navigationItem, index) in menuFilterxx" :key="index"
        :prepend-icon="navigationItem.icon" @click="parentSelectedM(navigationItem)"
        :value="navigationItem.name === parentSelected" append-icon=""
        v-if="!navigationItem.meta.notShow"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>{{navigationItem.name}}
          </v-list-tile-title>
        </v-list-tile>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
  
  </div>
</template>

<script>
export default {
  props: {
    drawerWidth: {
      default: 240
    }
  },
  data () {
    return {
      buttonName: 'them_moi_cong_viec',
      drawer: true,
      mini: false,
      parentSelected: '',
      menuFilterxx: this.$store.getters.staticRouters,
      imgBlob: ''
    }
  },
  created () {
    this.$nextTick(function () {
    })
  },
  computed: {
    title () {
      return this.translate(this.buttonName)
    },
    personalInformation: function () { return this.$store.state.personalInformation }
  },
  methods: {
    getEmployeeId () {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      let url = this.end_point + 'users/' + vm.user_id + '/profile'
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        vm.$store.commit('updatePersonalInformation', serializable)
        vm.getBase64()
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    getBase64 () {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        },
        responseType: 'arraybuffer'
      }
      window.axios.get(vm.end_point + 'employees/' + vm.personalInformation.classPK + '/photo',
        config
      )
        .then(function (response) {
          let blob = new Blob([response.data], {type: 'image/png'})
          vm.imgBlob = window.URL.createObjectURL(blob)
        })
        .catch(function (error) {
          // vm.imgBlob = '/o/frontend-web-usermgt/images/user_02.png'
          vm.imgBlob = 'http://qa.mobilink.vn/image/user_portrait?img_id=79937&img_id_token=LRmJEVeKMCqCJhX37wKHPt6iWj0%3D'
          console.log(error.response)
        })
    },
    handleFileUploadx () {
      window.$('#file').trigger({type: 'click'})
    },
    handleFileUpload () {
      let vm = this
      vm.file = vm.$refs.file.files[0]
      if (vm.file.size >= Number(this.MSystemConfiguration.configuration.profile.maximagesize)) {
        window.showMessageToastr('error', 'Quá giới hạn file tải lên')
      } else if (this.MSystemConfiguration.configuration.profile.imageextensions &&
        (this.MSystemConfiguration.configuration.profile.imageextensions.indexOf(vm.file.type) < 0)) {
        window.showMessageToastr('error', 'Bạn cần chọn file hình ảnh')
      } else {
        let config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        let dataPut = new FormData()
        dataPut.append('file', vm.file)
        dataPut.append('fileName', vm.file.name)
        dataPut.append('fileType', vm.file.type)
        dataPut.append('fileSize', vm.file.size)
        dataPut.append('className', '')
        dataPut.append('classPK', vm.$route.params.id)
        window.axios.put(vm.end_point + 'employees/' + vm.personalInformation.classPK + '/photo',
          dataPut,
          config
        )
          .then(function (response) {
            window.showMessageToastr('success', 'Tải ảnh đại diện thành công')
            setTimeout(function () {
              vm.getBase64()
            }, 500)
          })
          .catch(function (error) {
            vm.imgBlob = '/o/mobilink-theme/images/avatar.png'
            console.log(error.response)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      }
    },
    openAddEmployees () {
      this.$refs.employees.initGetData()
    },
    searchDeparment () {
      this.$store.dispatch('searchJobpos', this.jobposModel)
    },
    searchStatus () {
      this.$store.dispatch('searchStatus', this.statusModel)
    },
    parentSelectedM (navigation) {
      this.parentSelected = navigation.name
      this.$router.push(navigation.path)
    }
    // workingUnitChange (workingUnit) {
    //   this.$router.push({path: '/workingunits/' + workingUnit.workingUnitId + '/' + workingUnit.name})
    // }
  },
  mounted () {
    this.$nextTick(() => {
      this.getEmployeeId()
      this.parentSelected = this.$route.name || this.menuFilterxx[0]['name']
    })
  }
}
</script>
<style type="text/css">
  .contact_all_class>.layout{
    background: #fff;
    border-bottom: 2px solid #dae9f4;
    height: 50px;
  }
  .contact_all_class table {
    margin: 0;
  }
  .contact_all_class table tr {
    border-bottom: 1px solid #e3e3e3;
  }
  .contact_all_class table tr td{
    padding-bottom: 5px;
    padding-top: 5px;
  }
  .mobilink-all-component .custome-expand-panel .custome-expand-panel-width-action .expansion-panel__header,.mobilink-all-component .expansion-panel__header{
    font-weight: 500;
    padding: 10px 10px;
  }
  .mobilink-all-component p {
    margin: 0;
  }
  .mobilink-all-component .media-heading {
    margin: 0;
  }
  .mobilink-all-component .card>.card__text>div>.layout{
    border-bottom: 1px solid #e3e3e3;
  }
  .mobilink-all-component .detail_left {
    background: #fff;
  }
  .contact_all_class {
    padding-right: 5px;
  }
  .radio-group>.input-group__input {
    display: flex;
  }
  .radio-group>.input-group__input .input-group {
    margin: 0;
  }
  .contact-header {
    background: #fff;
  }
  .select-page-size {
    width: 40px;
    flex-grow: 0!important;
  }
  .mobilink-all-component  .table-bs td[class*="col-"] {
    padding: 5px 15px;
  }
  .mobilink-all-component .expansion-panel__container .expansion-panel__header {
    text-transform: uppercase;
    font-weight: bold;
    color: #039be5;
    padding: 8px 10px;
  }
  .mobilink-all-component .expansion-panel__container .expansion-panel__header+.expansion-panel__body .card {
    border-top: 1px solid #039be5;
  }
  #avtivity-task .task-category .filter-workingunit-wrap+.input-group--placeholder, #avtivity-task .task-category .filter-workingunit-wrap+.input-group--placeholder+.input-group--placeholder {
    margin-top: 10px;
    padding: 10px;
    background-color: white;
  }
  table td[class*="col-"], table th[class*="col-"] {
    float: left;
  }
  .tree-menu {
    padding: 0 10px 10px 10px;
  }
  .mobilink-tree-menu-component-container {
    background: #fff;
    padding: 0!important;
  }
  .mobilink-tree-menu-component-container .tree-menu .label-wrapper {
    background-color: #f0f1f1;
    padding: 10px!important;
    height: 44px;
    align-items: center;
    display: flex;
    border: 0!important;
  }
  .mobilink-tree-menu-component-container .tree-menu .label-wrapper .label-content {
    display: flex;
  }
  body .truncated {
    padding-left: 8px;
  }
  .mobilink-tree-menu-component-container .tree-menu .label-wrapper.active, .mobilink-tree-menu-component-container .tree-menu .label-wrapper .label-content:hover {
    background-color: #e7f5fd;
    color: #039be5!important;
  }
  .menuable__content__active{
    min-width:0px!important
  }
  .link_activated {
   text-decoration: underline;
   color: #039BE5;
  }
  #silentbox-overlay__embed iframe, #silentbox-overlay__embed img {
    box-shadow: none!important;
    background: none;
  }
  #silentbox-overlay {
    z-index: 5;
    left: -60px;
    position: fixed;
    top: -70px;
  }
  #profile-info-detail-wraper {
    width: 100%;
  }
  .alpaca-field-object {
    border: 1px solid #eee!important;
    padding: 10px!important;
    margin-bottom: 10px!important;
  }
  .checkbox, .radio {
    padding-left: 32px!important;
    position: relative!important;
    font-size: 14px!important;
    font-weight: normal!important;
    line-height: 1.5!important;
    color: rgb(51, 51, 51)!important;
    transition: color 0.25s linear 0s!important;
  }
  .checkbox input, .radio input {
    width: auto;
  }
  .alpaca-container-item > .alpaca-container > .alpaca-field-object, .alpaca-field-array.alpaca-top, .alpaca-field-object.alpaca-top, .alpaca-field-object.alpaca-top .alpaca-container {
    border-width: 0px!important;
    border-style: initial!important;
    border-color: initial!important;
    border-image: initial!important;
  }
  .alpaca-control-label {
    line-height: unset;
    position: relative;
  }
</style>