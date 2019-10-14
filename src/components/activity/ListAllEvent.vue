<template>
  <div class="calendar-list-wrapper layout wrap">
    <jx-mobilink-toolbar>
      <template slot="toolbar_title">
        <div style="align-items: center;display: flex;">
          <v-btn icon><v-icon dark>event</v-icon></v-btn> Tất cả các cuộc họp
        </div>
      </template>
    </jx-mobilink-toolbar>
    <div class="flex xs12">
        <div class="tableAllEventList__class">
          <v-data-table
          id = "table_search"
          no-data-text = "Không có dữ liệu"
          :headers = "tableEventListheaders"
          :items = "tableEventListItems"
          hide-actions
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-center">
                    <span :class="textBoldVisited(props.item.visited)">{{ props.index + 1 }}</span>
                </td>
                <td class="text-xs-center">
                    <span v-bind:title="props.item.startDate|datetime" :class="textBoldVisited(props.item.visited)">{{props.item.startDate|datetime}}</span>
                </td>
                <td class="text-xs-center">
                    <span v-bind:title="props.item.endDate|datetime" :class="textBoldVisited(props.item.visited)">{{props.item.endDate|datetime}}</span>
                </td>
                <td>
                    <a href="javascript:;" v-on:click="goToDetail(props.item.activityId)">
                      <span v-bind:title="props.item.subject" :class="textBoldVisited(props.item.visited)">{{props.item.subject}}</span>
                    </a>
                </td>
                <td>
                    <span v-bind:title="props.item.leaderName" :class="textBoldVisited(props.item.visited)">{{props.item.leaderName}}</span>
                </td>
                <td>
                    <span v-bind:title="props.item.location" :class="textBoldVisited(props.item.visited)">{{props.item.location}}</span>
                </td>
                <td class="text-xs-center">
                  <v-icon @click="toRemoveEvent(props.item)" class="cursor-pointer"
                  v-if="props.item.permission=='owner'||props.item.permission=='leader'||props.item.permission=='hoster'||props.item.permission=='manager'" icon color="red darken-3">clear</v-icon>
                </td>
              </tr>
            </template>

            <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Không có kết quả phù hợp!
            </v-alert>
          </v-data-table>
          <div class="pt-2 text-xs-center layout center-all" v-if="tableEventListItems.length > 0">
            <div class="select-page-size align-center d-flex">
              <v-select
                :items="pageNumberItems"
                v-model="paginationSize"
                :width="55"
                :max-width="55"
                :min-width="55"
                no-data-text=""
                @input="paginationSizeChange"
              ></v-select>
            </div>
            <v-pagination v-model="paginationPage" :length="pagination"></v-pagination>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.tableEventListheaders = [{
        text: '#',
        align: 'left',
        sortable: false,
        value: 'activityId'
      },
      {
        text: 'Ngày bắt đầu',
        align: 'left',
        sortable: false,
        value: 'startDate'
      },
      {
        text: 'Ngày kết thúc',
        align: 'left',
        sortable: false,
        value: 'endDate'
      },
      {
        text: 'Tên cuộc họp',
        align: 'left',
        sortable: false,
        value: 'subject'
      },
      {
        text: 'Người chủ trì',
        align: 'left',
        sortable: false,
        value: 'leaderName'
      },
      {
        text: 'Địa điểm',
        align: 'left',
        sortable: false,
        value: 'location'
      },
      {
        text: '',
        align: 'left',
        sortable: false,
        value: 'clear'
      }
      ]
    })
  },
  watch: {
    'paginationPage': {
      handler () {
        this.$store.dispatch('setPaginationPage', {
          pagination: this.paginationPage
        })
      }
    }
  },
  data () {
    return {
      tableEventListCout: 0,
      tableEventListheaders: [],
      paginationPage: 1,
      titleName: 'Danh sách',
      paginationSize: 5
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.dispatch('loadActivities')
    })
  },
  computed: {
    staticRouters () {
      return this.$store.getters.staticRouters
    },
    tableEventListItems () {
      let activities = this.$store.getters.loadedActivities.data
      return activities
    },
    pagination () {
      let vm = this
      return Math.ceil(vm.$store.getters.loadedActivities.total / vm.paginationSize)
    }
  },
  methods: {
    goToLink (link, icon) {
      this.$router.push(link)
    },
    goToDetail (id) {
      this.$router.push('/detail/' + id)
    },
    toRemoveEvent (item) {
      let vm = this
      vm.$dialog.confirm('Bạn muốn xóa sự kiện', {
        html: true,
        loader: true,
        okText: 'Xác nhận',
        cancelText: 'Quay lại',
        animation: 'fade'
      })
        .then(function (dialog) {
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'xóa sự kiện...'
          })
          vm.$store.dispatch('deleteActivity', item).then(response => {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          }, error => {
            console.log(error)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          })
          dialog.close()
          return false
        })
        .catch(function (e) {
          console.log(e)
        })
    },
    getColor_list: function (item) {
      let color
      switch (item) {
        case 1:
          color = 'red--text'
          break
        case 2:
          color = 'purple--text'
          break
        case 3:
          color = 'orange--text'
          break
        case 4:
          color = 'blue-grey--text'
          break
        case 5:
          color = 'orange--text'
          break
        case 6:
          color = 'light-blue--text'
          break
        case 7:
          color = 'light-green--text'
          break
        case 8:
          color = 'green--text'
          break
        case 9:
          color = 'light-green--text'
          break
        case 10:
          color = 'orange--text'
          break
        case 11:
          color = 'deep-orange--text'
          break
        case 12:
          color = 'blue--text'
          break
      }
      return color
    },
    paginationSizeChange () {
      this.paginationPage = 1
      this.$store.dispatch('setPaginationSize', this.paginationSize)
    }
  }
}
</script>

<style>
  .tableAllEventList__class table thead tr th,.tableAllEventList__class table tbody td{
    border: 1px solid #ddd !important;
  }
  body .tableAllEventList__class table.table td,body .tableAllEventList__class table.table th{
    padding: 0 5px!important;
  }
  body .tableAllEventList__class table.table th{
    text-align: center!important;
    color: black;
  }
  .tableAllEventList__class table.table th i{
    display: none;
  }
  .tableAllEventList__class table.table td i{
    font-size: 13px;
  }
  .tableAllEventList__class table.table td button{
    width: 30px;
    height: 30px;
  }
  body .tableAllEventList__class table.table td:nth-child(1) div,body .tableAllEventList__class table.table td:nth-child(2) div,body .tableAllEventList__class table.table td:nth-child(3) div,body .tableAllEventList__class table.table td:nth-child(4) div,body .tableAllEventList__class table.table td:nth-child(5) div,body .tableAllEventList__class table.table td:nth-child(6) div{
    overflow: hidden;
    text-overflow: ellipsis; 
    /** white-space: nowrap; */
  }
  body .tableAllEventList__class table.table th:nth-child(1),body .tableAllEventList__class table.table td:nth-child(1){
    width: 5%!important;
  }
  body .tableAllEventList__class table.table th:nth-child(2),body .tableAllEventList__class table.table td:nth-child(2){
    width: 15%!important;
  }
  body .tableAllEventList__class table.table th:nth-child(3),body .tableAllEventList__class table.table td:nth-child(3){
    width: 15%!important;
  }
  body .tableAllEventList__class table.table th:nth-child(4),body .tableAllEventList__class table.table td:nth-child(4){
    width: 25%!important;
  }
  body .tableAllEventList__class table.table th:nth-child(5),body .tableAllEventList__class table.table td:nth-child(5){
    width: 17%!important;
  }
  body .tableAllEventList__class table.table th:nth-child(6),body .tableAllEventList__class table.table td:nth-child(6){
    width: 20%!important;
  }
  body .tableAllEventList__class table.table th:nth-child(7),body .tableAllEventList__class table.table td:nth-child(7){
    width: 3%!important;
  }


  .tableAllEventList__class .column {
    float: none !important;
  }
  .tableAllEventList__class tr {
    height: auto !important;
  }
  .tableAllEventList__class th, .tableAllEventList__class td {
    vertical-align: middle !important;
  }
</style>
