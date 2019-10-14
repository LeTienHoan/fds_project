<template>

  <div class="activity--manager--component layout wrap">
    <jx-mobilink-toolbar :extension="true">
      <template slot="toolbar_title">
        <div style="align-items: center;display: flex;">
          <v-icon>search</v-icon> Theo dõi kết luận
        </div>
      </template>
      <template slot="forfilter">
        <v-layout wrap class="navTable px-3 label_class">
          <v-flex xs4>
            <v-layout>
              <custome-date-time
                class="custome_time_class control_class"
                :id="1"
                :datetimevalue="timeStart"
                onlydate
                :format="localeDateProperties.dateMomentPattern"
                @syncxxx="timeStartChange"
                placeholder="Thời gian bắt đầu"
              >
              </custome-date-time>
            </v-layout>
          </v-flex>
          <v-flex xs4 class="ml-4">
            <v-layout>
              <custome-date-time
                class="custome_time_class control_class"
                :id="1"
                :datetimevalue="timeEnd"
                onlydate
                :format="localeDateProperties.dateMomentPattern"
                @syncxxx="timeEndChange"
                placeholder="Thời gian kết thúc"
              >
              </custome-date-time>
            </v-layout>
          </v-flex>
          
        </v-layout>
      </template>
      
    </jx-mobilink-toolbar>

    <div id="list-content" class="layout wrap">
      <v-expansion-panel expand class="expansion-blue">
        <v-expansion-panel-content
          v-for="(item,index) in mainItems" :key="item.leader.userId"
          value="true" class="openLeader"
        >
            <div slot="header"  @click="getListActivitySource(item.activityItems[index].activityId,index,index)" 
            class="groupHeader mr-2 pl-0" style="width: 90%;font-family: sans-serif" v-if="item.bol == true">
              <p v-if="radioGroup == 'leader'" :title="item.leader.fullName" class="my-0">
                {{ item.leader.fullName }}
              </p>
              <p v-if="radioGroup == 'activityCat'" :title="item.leader.itemName" class="my-0">{{item.leader.itemName}}</p>
            </div>
          <v-icon slot="actions" icon @click="getListActivitySource(item.activityItems[0].activityId,index,0)">keyboard_arrow_down</v-icon>
          <v-card class="">
            <v-card-text class="px-0 py-0">
              <v-expansion-panel expand>
                  <v-expansion-panel-content
                    v-for="(item1,index1) in item.activityItems" 
                    v-bind:key="item1.activityId"
                    :value="true"
                    v-model="item1.isOpen"
                    @input="getListActivitySource(item1.activityId,index,index1, item1.isOpen)"
                    v-if="item.activitySourceItems[index1].length > 0"
                  >
                    <div slot="header">
                      <p :title="item1.subject" @click.stop="activityDetail(item1,index1)" style="display: contents;">
                        {{item1.subject}} <b>({{ item1.startDate | datetime }} - {{ item1.endDate | datetime }})</b>
                      </p>
                    </div>
                    <v-icon slot="actions">keyboard_arrow_down</v-icon>
                    <v-data-table id="subTableActivity"
                      :headers="mainHeaders"
                      no-data-text="Không có kết luận"
                      :items="item.activitySourceItems[index1]"
                      item-key="activityId"
                      hide-actions
                      >
                        <template slot="items" slot-scope="props">
                          
                          <tr v-bind:class="{'active': props.index%2==1}">
                            <td class="text-xs-center py-2" >
                              <span :class="textBoldVisited(props.item.visited)">{{props.index + 1}}</span>
                            </td>
                            <td class="py-2"  :title="props.item.subject">
                              <a href="javascript:;" @click="clickDetail(props.item)">
                                <span :class="textBoldVisited(props.item.visited)">{{ props.item.subject }}</span>
                              </a>
                            </td>
                            <td class="text-xs-center py-2">
                              <span :class="textBoldVisited(props.item.visited)">
                                {{parseDateView(new Date(props.item.startDate))}}
                              </span>
                            </td>
                            <td class="text-xs-center py-2" >
                              <span :class="textBoldVisited(props.item.visited)">
                                {{parseDateView(new Date(props.item.endDate))}}
                              </span>
                            </td>
                            <td class="py-2">
                              <span v-if="props.item.assignType == 1 || props.item.assignType == 4" :class="textBoldVisited(props.item.visited)">{{ props.item.managerName }}</span>
                              <span v-else :class="textBoldVisited(props.item.visited)">{{ props.item.hosting }}</span>
                            </td>
                            <td class="text-xs-center" >
                              <span class="my-2" :style="'color:' + getStatusTextColor(props.item.state) + ';'" :class="textBoldVisited(props.item.visited)">{{props.item.stateName}}</span>
                            </td>
                            <td class="py-2">
                              <v-btn icon class="ma-0 pull-right" @click.stop="removeActivity(props.item,props.index)" v-if="props.item.permission=='owner' || props.item.permission=='leader'">
                                <v-icon class="red--text text--darken-3">clear</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                          
                        </template>
                    </v-data-table>
                  </v-expansion-panel-content>
              </v-expansion-panel>
              
            </v-card-text>
          </v-card>
          <v-divider xs12 class="my-0"></v-divider>
        </v-expansion-panel-content>
        <v-divider xs12 class="my-0"></v-divider>
      </v-expansion-panel>
      <p class="py-3 flex xs12" v-if="activityListItems.length == 0" style="text-align: center; background-color: #fff;">
        <i>Không có cuộc họp nào được tìm thấy</i>
      </p>
    </div>
    
  </div>
</template>


<script>
  const COMPONENT_NAME = 'jx-mobilink-activity-manager'

  export default {
    name: COMPONENT_NAME,
    components: {
    },
    watch: {
      '$store.getters.keywords' (val) {
        this.keywords = val
        this.pagination = {
          page: 1,
          length: 0
        }
        this.getActivity()
      }
    },
    created () {
      let vm = this
      vm.$nextTick(function () {
        vm.getManager()
        vm.getActivityCat()
      })
    },
    data () {
      return {
        class_name: 'org.mobilink.activitymgt.model.Activity',
        mainItems: [],
        userId: '',
        activityListItems: [],
        radioGroup: 'leader',
        managerItems: [],
        manager: '',
        activityCatItems: [],
        activityCat: '',
        timeStart: new Date((new Date()).setDate(((new Date()).getDate() - 30))),
        timeEnd: new Date(),
        timeEndMin: '',
        timeStartMax: '',
        subItems: [],
        paramsGet: {},
        mainHeaders: [
          {
            text: 'STT',
            align: 'center',
            value: 'activityId',
            sortable: false
          },
          {
            text: 'Tên kết luận',
            align: 'center',
            value: 'subject',
            sortable: false
          },
          {
            text: 'Ngày bắt đầu',
            align: 'center',
            value: 'startDate',
            sortable: false
          },
          {
            text: 'Hạn hoàn thành',
            align: 'center',
            value: 'endDate',
            sortable: false
          },
          {
            text: 'Người phụ trách',
            align: 'center',
            value: 'managerName',
            sortable: false
          },
          {
            text: 'Trạng thái',
            align: 'center',
            value: 'stateName',
            sortable: false
          },
          {
            text: '',
            align: 'center',
            value: 'clear',
            sortable: false
          }
        ]
      }
    },
    methods: {
      removeActivity (item, index) {
        let vm = this
        let config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        vm.$dialog.confirm('Bạn có chắc chắn muốn thực hiện hành động này không?', {
          html: true,
          loader: true,
          okText: 'Xác nhận',
          cancelText: 'Quay lại',
          animation: 'fade'
        })
          .then((dialog) => {
            vm.$store.dispatch('loading/setLoading', {
              loading: true,
              message: 'Xóa dữ liệu...'
            })
            window.axios.delete(vm.end_point + 'activities/' + item.activityId, config)
              .then(function (response) {
                window.showMessageToastr('success', 'Xóa kết luận thành công')
                setTimeout(function () {
                  vm.getActivity()
                }, 1000)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
              })
              .catch(function (error) {
                console.log(error)
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
            dialog.close()
          })
          .catch((e) => {
            console.log(e)
          })
      },
      /* Load data lãnh đạo */
      getManager: function () {
        /* console.log('run get mamager') */
        let vm = this
        /* Load data employees */
        let paramsEmployees = {
          'class': 'employee',
          'start': -1,
          'end': -1
        }
        const configEmployees = {
          params: paramsEmployees,
          headers: {
            'groupId': vm.group_id
          }
        }
        //
        window.axios.get(vm.end_point + 'users', configEmployees)
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              for (var key in serializable.data) {
                vm.managerItems.push(serializable.data[key])
              }
            }
            vm.getActivity()
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      /* Load data đơn vị chủ trì */
      getActivityCat: function () {
        /* console.log('run get activityCat') */
        let vm = this
        let paramsTypeProcess = {
          sort: 'treeIndex',
          start: -1,
          end: -1
        }
        const configTypeProcess = {
          params: paramsTypeProcess,
          headers: {
            'groupId': vm.group_id
          }
        }
        /* Load data loại hoạt động */
        window.axios.get(vm.end_point + 'dictcollections/ACTIVITY_TYPE/dictitems', configTypeProcess)
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              for (var key in serializable.data) {
                if (serializable.data[key].level === 1) {
                  vm.activityCatItems.push({
                    itemName: serializable.data[key].itemName,
                    itemCode: serializable.data[key].itemCode
                  })
                }
              }
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      /* Load data activity */
      getActivity: function () {
        /* console.log('run get getActivity') */
        let vm = this
        let paramsGetActivity = {
          sort: 'startDate_Number',
          type: 'EVENT',
          fromdate: vm.timeStart ? vm.dateFormatToCallAPI(vm.timeStart) : null,
          todate: vm.timeEnd ? vm.dateFormatToCallAPI(vm.timeEnd) : null,
          keywords: vm.keywords
        }
        vm.paramsGet = paramsGetActivity
        let configGetActivity = {
          params: vm.paramsGet,
          headers: {
            groupId: vm.group_id
          }
        }
        let url = vm.end_point + 'activities'
        window.axios.get(url, configGetActivity).then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.activityListItems = []
            vm.mainItems = []
            for (var key in serializable.data) {
              vm.activityListItems.push(serializable.data[key])
            }
            if (vm.radioGroup === 'activityCat') {
              // vm.getListItemGroup(vm.activityCatItems)
              // vm.getListActivityItemsGroup(vm.activityCatItems)
              // vm.getListActivitySource(vm.mainItems[0].activityItems[0].activityId, 0, 0)
            } else if (vm.radioGroup === 'leader') {
              vm.getListItemGroup(vm.managerItems)
              vm.getListActivityItemsGroup()
              for (var keys in vm.mainItems) {
                for (var keyss in vm.mainItems[keys].activityItems) {
                  vm.getListActivitySource(vm.mainItems[keys].activityItems[keyss].activityId, keys, keyss)
                  if (Number(keyss) === vm.mainItems[keys].activityItems.length - 1) {
                    break
                  }
                }
                if (Number(keys) === vm.mainItems.length - 1) {
                  break
                }
              }
            }
          }
          console.log(vm)
        })
          .catch(function (error) {
            console.log(error)
          })
      },
      /** Load activity detail */
      activityDetail: function (item, index) {
        console.log(item)
        this.$emit('view_detail', item, index)
      },
      callGetActivity: function () {
        let vm = this
        vm.activityListItems = []
        vm.mainItems = []
        let paramsGetActivity = {
          sort: 'startDate_Number',
          type: 'EVENT',
          fromdate: vm.timeStart ? vm.dateFormatToCallAPI(vm.timeStart) : null,
          todate: vm.timeEnd ? vm.dateFormatToCallAPI(vm.timeEnd) : null,
          keywords: vm.keywords
        }
        let configGetActivity = {
          params: paramsGetActivity,
          headers: {
            groupId: vm.group_id
          }
        }
        let url = vm.end_point + 'activities'
        window.axios.get(url, configGetActivity).then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            for (var key in serializable.data) {
              vm.activityListItems.push(serializable.data[key])
            }
            if (vm.radioGroup === 'activityCat') {
              // vm.getListItemGroup(vm.activityCatItems)
              // vm.getListActivityItemsGroup(vm.activityCatItems)
              // vm.getListActivitySource(vm.mainItems[0].activityItems[0].activityId, 0, 0)
            } else if (vm.radioGroup === 'leader') {
              vm.getListItemGroup()
              vm.getListActivityItemsGroup()
              for (var keys in vm.mainItems) {
                for (var keyss in vm.mainItems[keys].activityItems) {
                  vm.getListActivitySource(vm.mainItems[keys].activityItems[keyss].activityId, keys, keyss)
                  if (Number(keyss) === vm.mainItems[keys].activityItems.length - 1) {
                    break
                  }
                }
                if (Number(keys) === vm.mainItems.length - 1) {
                  break
                }
              }
            }
          }
        })
          .catch(function (error) {
            console.log(error)
          })
      },
      timeStartChange: function (val) {
        let vm = this
        vm.timeStart = val
        vm.timeEndMin = vm.timeStart ? new Date(vm.timeStart) : ''
        vm.timeStartMax = vm.timeEnd ? new Date(vm.timeEnd) : ''
        vm.callGetActivity()
      },
      timeEndChange: function (val) {
        let vm = this
        vm.timeEnd = val
        vm.timeEndMin = vm.timeStart ? new Date(vm.timeStart) : ''
        vm.timeStartMax = vm.timeEnd ? new Date(vm.timeEnd) : ''
        vm.callGetActivity()
      },
      /** Lọc theo leader */
      // getFilterLeader: function () {
      //   let vm = this
      //   setTimeout(function () {
      //     vm.paramsGet.leader = vm.manager.userId
      //     vm.callGetActivity()
      //   }, 200)
      // },
      /** Lọc theo activityCat */
      // getFilterActivityCat: function () {
      //   let vm = this
      //   setTimeout(function () {
      //     vm.paramsGet.category = vm.activityCat.itemCode
      //     vm.callGetActivity()
      //   }, 200)
      // },
      /** get list leader group */
      getListItemGroup: function () {
        let vm = this
        vm.mainItems = []
        vm.subItems = []
        for (var key in vm.managerItems) {
          for (var index in vm.activityListItems) {
            // if (vm.radioGroup === 'activityCat') {
            // if (target[key].itemCode === vm.activityListItems[index].activityCat) {
            //   vm.mainItems.push(
            //     {
            //       'leader': target[key],
            //       activityItems: [],
            //       activitySourceItems: []
            //     }
            //   )
            //   break
            // }
            // } else if (vm.radioGroup === 'leader') {
            if (vm.managerItems[key].userId === vm.activityListItems[index].leaderId) {
              vm.mainItems.push(
                {
                  'leader': vm.managerItems[key],
                  activityItems: [],
                  activitySourceItems: [],
                  bol: false
                }
              )
              break
            }
            // }
          }
          if (Number(key) === vm.managerItems.length - 1) {
            break
          }
        }
      },
      /** get list activity group */
      getListActivityItemsGroup: function () {
        let vm = this
        for (var key in vm.mainItems) {
          for (var index in vm.activityListItems) {
            if (vm.radioGroup === 'activityCat' && vm.mainItems.length !== 0) {
              // if (vm.activityListItems[index].activityCat === vm.mainItems[key].leader.itemCode) {
              //   vm.mainItems[key].activityItems.push(vm.activityListItems[index])
              //   vm.mainItems[key].activitySourceItems.push([])
              // }
            } else if (vm.radioGroup === 'leader' && vm.mainItems.length !== 0) {
              if (vm.activityListItems[index].leaderId === vm.mainItems[key].leader.userId) {
                vm.mainItems[key].activityItems.push(vm.activityListItems[index])
                vm.mainItems[key].activitySourceItems.push([])
              }
              if (Number(index) === vm.activityListItems.length - 1) {
                break
              }
            }
          }
          if (Number(key) === vm.mainItems.length - 1) {
            break
          }
        }
      },
      /** get list source group */
      getListActivitySource: function (classPk, indexGroup, index) {
        let vm = this
        let paramsGetSource = {
          start: -1,
          end: -1
        }
        const configGetSource = {
          params: paramsGetSource,
          headers: {
            'groupId': vm.group_id
          }
        }
        if (vm.mainItems[indexGroup].activitySourceItems[index].length === 0) {
          window.axios.get(vm.end_point + 'activities/source/' + vm.class_name + '/' + classPk, configGetSource)
            .then(function (response) {
              let serializable = response.data
              if (serializable.hasOwnProperty('data')) {
                for (var key in serializable.data) {
                  vm.mainItems[indexGroup].activitySourceItems[index].push(
                    serializable.data[key]
                  )
                  vm.mainItems[indexGroup].bol = true
                  if (Number(key) === serializable.data.length - 1) {
                    break
                  }
                }
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      },
      getKeyGroup: function (radio) {
        if (radio === 'activityCat') {
          return 'itemCode'
        } else if (radio === 'leader') {
          return 'userId'
        }
      },
      parseDateView: function (fullDate) {
        let date
        if (fullDate) {
          date = fullDate.getDate().toString().padStart(2, '0') + '/' + (fullDate.getMonth() + 1).toString().padStart(2, '0') + '/' + fullDate.getFullYear()
        } else {
          date = ''
        }
        return date
      },
      dateFormatToCallAPI: function (fullDate) {
        let date
        if (fullDate) {
          date = window.moment(fullDate).format('YYYYMMDD')
        } else {
          date = ''
        }
        return date
      },
      /** */
      getColor: function (item) {
        let color
        switch (item) {
          case 1:
            color = 'red'
            break
          case 2:
            color = 'purple'
            break
          case 3:
            color = 'orange'
            break
          case 4:
            color = 'blue-grey'
            break
          case 5:
            color = 'orange'
            break
          case 6:
            color = 'light-blue'
            break
          case 7:
            color = 'light-green'
            break
          case 8:
            color = 'green'
            break
          case 9:
            color = 'light-green'
            break
          case 10:
            color = 'orange'
            break
          case 11:
            color = 'deep-orange'
            break
          case 12:
            color = 'blue'
            break
        }
        return color
      },
      clickDetail (item) {
        window.location = this.MSystemConfiguration.configuration.systemurl.taskurl + 'detail/' + item.activityId
      }
    }
  }
</script>

<style>


  .activity--manager--component #subTableActivity td a:hover {
    color: blue!important
  }
  .activity--manager--component .list--group__header--active .list__tile__action > i{
    -webkit-transform: rotate(-180deg);
    -ms-transform: rotate(-180deg);
    transform: rotate(-180deg);
  }
  .activity--manager--component .list--group__header--active{
    background-color: #cbddf7!important
  }
  .activity--manager--component .header-menu div{
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap;
    border: 1px solid #ddd !important;
    padding: 8px 5px!important;
  }
  .activity--manager--component #list-content .expansion-panel{
    border-bottom: 1px solid #e7e7e7;
  }
  
  .activity--manager--component #list-content table tr td{
    overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap;
    border: 1px solid #ddd;
    padding: 8px 5px!important;
  }
  .activity--manager--component table thead tr th{
    border: 1px solid #ddd ;
    color: #000!important;
    padding: 0 5px!important;
  }
  .activity--manager--component table thead tr th:first-child, .activity--manager--component table tbody tr td:first-child{
    border-left: 0px!important;
  }
  .activity--manager--component table thead tr th:last-child, .activity--manager--component table tbody tr td:last-child{
    border-right: 0px!important;
  }
  .activity--manager--component table.table thead tr th:nth-child(1),.activity--manager--component table.table tbody tr td:nth-child(1) {
    width: 4%!important;
  }
  .activity--manager--component table.table thead tr th:nth-child(2),.activity--manager--component table.table tbody tr td:nth-child(2) {
    width: 30%!important;
  }
  .activity--manager--component table.table thead tr th:nth-child(3),.activity--manager--component table.table tbody tr td:nth-child(3) {
    width: 15%!important;
  }
  .activity--manager--component table.table thead tr th:nth-child(4),.activity--manager--component table.table tbody tr td:nth-child(4) {
    width: 15%!important;
  }
  .activity--manager--component table.table thead tr th:nth-child(5),.activity--manager--component table.table tbody tr td:nth-child(5) {
    width: 17%!important;
  }
  .activity--manager--component table.table thead tr th:nth-child(6),.activity--manager--component table.table tbody tr td:nth-child(6) {
    width: 15%!important;
  }
  .activity--manager--component table.table thead tr th:nth-child(7),.activity--manager--component table.table tbody tr td:nth-child(7) {
    width: 4%!important;
  }
  .activity--manager--component .groupHeader p{
    max-width: 100%!important;
    overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap;
  }
/*  .activity--manager--component .expansion-panel__container>.expansion-panel__header{   
    padding: 0 10px 0 20px;
  }*/
  .activity--manager--component .icon_view:hover{
    color: blue;
    cursor: pointer;
  }
  .activity--manager--component .icon_view{
    display: inline-block;
    max-width: 100%!important;
    overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap;
  }

  .activity--manager--component .expansion-panel__container{
    max-width: 100%!important
  }
  
  .activity--manager--component #list-content .list--group__container{
    border: 1px solid #ddd !important;
  }
  .activity--manager--component .input-group .input-group__details{
    display: none
  }
  .activity--manager--component .navTable .selectBoder{
    background-color: #ffffff!important;
    padding-left: 10px!important;
    border-radius: 2px!important;
    height: 34px!important;
  }
  .activity--manager--component #subTableActivity table{
    table-layout: fixed
  }
  .activity--manager--component .mx-datepicker{
    width: 100%!important
  }
  .activity--manager--component .breakRow{
    margin-left: 15px;
  }
  .custome_time_class{
      margin: 10px 0px;
      width: 100%;
      line-height: 1.4;
      color: #555!important;
    }
    .activity--manager--component > div:first-child * {
        color: white !important
    }
    .activity--manager--component > div:first-child .custome-date-time * {
        color: #2a2a2a !important;
    }
    .activity--manager--component p{
      margin: 0!important
    }
  @media only screen and (min-width: 320px) and (max-width: 1024px) {
    .activity--manager--component .header-menu{
      height: 50px;
    }
    .activity--manager--component .header-menu div{
      white-space: normal!important;
    }
    .activity--manager--component .groupHeader p{
      overflow: visible!important;
      text-overflow: clip!important; 
      white-space: normal!important;
    }
    .activity--manager--component .breakRow{
      margin-left: 0px;
    }
    .activity--manager--component .activity-date-field .input-group {
      padding-top: 10px !important;
    }
    
  }
  @media only screen and (device-width: 768px) {
    .openLeader:not(:nth-child(-n+7)){
      display: none;
    }
  }

</style>