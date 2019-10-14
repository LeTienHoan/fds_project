<template>
  <div>
  <v-navigation-drawer
      stateless
      v-model="drawer"
      :width="drawerWidth"
      :mini-variant.sync="mini" hide-overlay
  >
    <v-btn block color="primary" @click="openDiaglogAddGroup" v-if="$route.path === '/group'"
      depressed>
      Thêm nhóm
    </v-btn>
    <v-btn block color="primary" @click="openDiaglogAddContact" v-else
      depressed>
      Thêm liên lạc
    </v-btn>
    <v-list>
      <v-list-group v-for="(navigationItem, index) in menuFilterxx" :key="index"
        :prepend-icon="navigationItem.icon" @click="parentSelectedM(navigationItem)"
        :value="navigationItem.name === parentSelected" append-icon=""
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>{{navigationItem.name}}
          </v-list-tile-title>
        </v-list-tile>
      </v-list-group>
    </v-list>
    <add-contact ref="contact"></add-contact>
    <add-group ref="group"></add-group>
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
      parentSelected: ''
    }
  },
  computed: {
    title () {
      return this.translate(this.buttonName)
    },
    menuFilterxx () {
      return this.$store.getters.staticRouters
    },
    staticRouter () {
      return this.$store.getters.staticRouter
    }
  },
  methods: {
    openDiaglogAddContact () {
      this.$refs.contact.initGetData()
    },
    openDiaglogAddGroup () {
      this.$refs.group.initGetData({contactId: 0})
    },
    parentSelectedM (navigation) {
      this.parentSelected = navigation.name
      this.$router.push(navigation.path)
      // this.$store.dispatch('searchContact', '')
      this.$store.commit('setSearchContact', '')
    },
    openDiaglogAddActivity () {
      this.add_new_task = true
    },
    submitSaveAndExit () {
      this.$refs.activityAddRef.saveAndExit()
    },
    submitSaveAndAddNew () {
      this.$refs.activityAddRef.saveAndAddNew()
    },
    onAddActivitySuccess (activity) {
      this.dialogAdd = false
      window.showMessageToastr('success', 'Cập nhật thành công')
      this.$refs.activityAddRef.clearDataForm()
      this.$router.push('/detail/' + activity.activityId)
    },
    getCountTotal () {
      let staticRouters = this.menuFilterxx
      for (let k in staticRouters) {
        this.saveCount(k)
      }
    },
    saveCount (index) {
      let staticRouter = this.menuFilterxx[index]
      let url = this.end_point + 'activities/count'
      let vm = this
      let apiConfigHeader = {
        headers: {
          groupId: vm.group_id
        },
        params: {
          start: -1,
          end: -1
        }
      }
      apiConfigHeader.params = staticRouter.query
      window.axios.get(url, apiConfigHeader)
        .then(function (response) {
          vm.menuFilterxx[index].total = response.data
        })
        .catch(function (error) {
          console.log(error)
          vm.menuFilterxx[index].total = 0
        })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.parentSelected = this.$route.name || this.menuFilterxx[0]['name']
    })
  }
}
</script>
<style type="text/css">
  body .media-left .icon {
    font-size: 40px!important;
  }
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
    padding: 7px 15px!important;
  }
  .mobilink-all-component .expansion-panel__header>div>.layout>.align-center>span{
    color: #039be5!important;
  }
  .expansion-panel .expansion-panel__header .media .media-body .text-bold,.contact_all_class>.table .media .media-body .text-bold{
    color: #039be5!important;
  }
  .mobilink-all-component p {
    margin: 0;
  }
  .mobilink-all-component .media-heading {
    margin: 0;
  }
  .mobilink-all-component .card>.card__text>div>.layout{
    border-bottom: 1px dashed #e3e3e3;
  }
  .mobilink-all-component .card__text{
    border-top: 1px solid #039be5;
    padding: 0!important;
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
  .mobilink-all-component .expansion-panel__container .expansion-panel__body .card{
    border: 0!important;
  }
/*  .contact_list_class .expansion-panel__header{
    border-bottom: 1px solid #039be5;
    text-transform: uppercase;
    font-weight: bold;
    color: #039be5;
    padding: 8px 10px;
  }*/
  .link_activated {
     text-decoration: underline;
     color: #039BE5;
  }
  .input-group.input-group--selection-controls .input-group__details {
    display: none
  }
  .contact_all_class .input-group.input-group--selection-controls {
    margin-left: auto;
    flex-grow: 0.5;
  }
  .contentClass {
    text-transform: none!important;
    color: #000!important;
    font-weight: initial!important;
  }
/*  .input-group.input-group--selection-controls.switch .input-group--selection-controls__ripple--active {
    transform: translate(14px,-10px);
  }
  
  .input-group.input-group--selection-controls.switch .input-group--selection-controls__ripple {
    transform: translate(14px,-10px);
  }
  .input-group--selection-controls__ripple {
    height: 20px;
    width: 20px;
  }*/
</style>