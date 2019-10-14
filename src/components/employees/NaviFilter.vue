<template>
  <div>
    <v-navigation-drawer
        stateless
        v-model="drawer"
        :width="drawerWidth"
        :mini-variant.sync="mini" hide-overlay
    >
      <v-btn block color="primary" @click="openAddEmployees"
        depressed>
        Thêm mới nhân sự
      </v-btn>
      <v-list>
        <v-list-group v-for="(navigationItem, index) in menuFilterxx" :key="index"
          :prepend-icon="navigationItem.icon" @click="parentSelectedM(navigationItem)"
          :value="navigationItem.name === parentSelected" append-icon=""
          v-if="!navigationItem.meta.notShow"
        >
          <v-list-tile slot="activator">
            <v-list-tile-title>
              {{navigationItem.name}}
            </v-list-tile-title>
          </v-list-tile>
        </v-list-group>
      </v-list>
      <!-- <FilterWorkingUnit 
        ref='FilterWorkingUnit'
        :initWorkingUnitActive="Number($route.params.id) || 0"
        @workingUnitActive="workingUnitChange"
        >
      </FilterWorkingUnit>
      <v-select 
        v-bind:items="jobposItems" 
        v-model="jobposModel"
        autocomplete
        item-text="title" 
        item-value="jobPosId"
        hide-selected
        placeholder="Vị trí công tác"
        @input="searchDeparment"
        return-object
        clearable
      >
      </v-select>
      <v-select 
        v-bind:items="statusItems" 
        v-model="statusModel"
        autocomplete
        item-text="name" 
        item-value="id"
        hide-selected
        placeholder="Trạng thái làm việc"
        @input="searchStatus"
        return-object
        clearable
      >
      </v-select> -->
      <add-employees ref="employees"></add-employees>
    </v-navigation-drawer>
  </div>
</template>

<script>

// import FilterWorkingUnit from './FilterWorkingUnit'

export default {
  components: {
    // FilterWorkingUnit
  },
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
      jobposModel: '',
      statusItems: [
        {
          id: 1,
          name: 'Đang làm việc'
        },
        {
          id: 0,
          name: 'Đã nghỉ việc'
        }
      ],
      statusModel: ''
    }
  },
  computed: {
    title () {
      return this.translate(this.buttonName)
    },
    jobposItems () {
      return this.$store.getters.loadedJobpos.data
    }
  },
  methods: {
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
      this.$store.dispatch('searchEmployees', '')
    }
    // workingUnitChange (workingUnit) {
    //   this.$router.push({path: '/workingunits/' + workingUnit.workingUnitId + '/' + workingUnit.name})
    // }
  },
  mounted () {
    this.$nextTick(() => {
      this.parentSelected = this.$route.name || this.menuFilterxx[0]['name']
      this.$store.dispatch('loadJobpos')
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
  .dateCustom{
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
</style>