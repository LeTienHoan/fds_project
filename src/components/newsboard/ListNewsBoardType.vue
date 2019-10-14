<template>
  <div class="mobilink-newsboard-component fullwidth">
    <v-layout wrap>

      <v-flex sm12 class="">
        <v-layout wrap class="primary title-list-newsboard align-center px-3">
          {{translate(staticRouter.name)}} ({{totalUnreadList}}/{{totalRepon}})
        </v-layout>
        <v-layout wrap class="header-list-newboard">
          <v-checkbox v-model="checkboxModel" label="" @click="checkAll" class="ma-0">
          </v-checkbox>
          <span class="sortUrgentClass" @click="sortPriorityNewsBoard">
            <v-icon style="color: red!important">stop</v-icon>
            Khẩn
            <v-icon v-if="sort_priority == true">expand_less</v-icon>
            <v-icon v-else>expand_more</v-icon>
          </span>
          <div class="listIcon">
            <!-- <span class="icon-padding-class">
              <v-icon title="Chia sẻ">share</v-icon>
            </span> -->
            <span class="icon-padding-class" @click="watchedNewsboad">
              <v-icon title="Đã xem">visibility</v-icon>
            </span>
            <span class="icon-padding-class" @click="sortNewsBoard">
              <v-icon title="Sắp xếp">swap_vert</v-icon>
            </span> 
            <span v-if="staticRouter.path=='/mine' || staticRouter.path=='/trash'" class="icon-padding-class" @click="deleteNewsBoard" >
              <v-icon title="Xóa">delete</v-icon>
            </span>
          </div>
        </v-layout>
        <div class="list-news-class simplebar" v-scroll="onScroll">
          <div class="list-news-child-class">
            <v-layout wrap v-for="(item, index) in tableEventListItems" :key="index" class="list-newboard-class pointer" @click="clickDetailNewsBoard(item)" :class="{'newsboard-active': Number($route.query ? $route.query.newsBoardId : 0) === Number(item.newsBoardId), 'priorityClass': item.priority == true}">
              <v-flex xs6> 
                <div class="align-center" style="display: flex">
                  <span @click.stop="changeCheckbox(item, index)">
                    <v-icon style="color: #039be5!important" v-if="item.bool == true" >check_box
                    </v-icon>
                    <v-icon v-else>check_box_outline_blank
                    </v-icon>
                  </span>
                  <span class="ml-2" style="white-space: nowrap;">
                    {{item.userName}}
                  </span>
                  <span class="ml-2 starClass" style="width: 20px;">
                    <!-- <v-icon style="color: #EFCC32!important;display: block;" v-if="item.ontop == true" @click="changeOnTop(item, true)">star_rate</v-icon> -->
                    <i class="fa fa-star icon" style="color: #EFCC32!important" v-if="item.ontop == true" @click="changeOnTop(item, true)"></i>
                    <i class="fa fa-star icon" v-else @click="changeOnTop(item, false)"></i>
                    <!-- <v-icon v-else @click="changeOnTop(item, false)" style="display: block;">star_rate</v-icon> -->
                  </span>
                  <span class="ml-2 commentCountClass">
                    {{  item.commentCount }}
                  </span>
                </div>
              </v-flex>
              <v-flex xs6 class="align-center" style="display: flex;">
                <span style="margin-left: auto;" class="">
                  {{ item.createDate | datetime }}
                </span>
              </v-flex>
              <v-flex xs12 class="mt-2 test-wrapper" :class="{'pl-4': item.visited === false}">
                <v-icon v-if="item.visited === true">fiber_manual_record</v-icon>
                <div class="ring-wrapper" v-else>
                  <div class="ring-pulse"></div>
                </div>
                <span class="truncated ml-2">{{ item.title }}</span>
              </v-flex>
            </v-layout>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'mobilink-list-newboard'
  export default {
    name: COMPONENT_NAME,
    props: {
      width: 0,
      changeNewsboard: '',
      propnewsBoardId: {
        default: 0
      }
    },
    components: {},
    computed: {
      staticRouter () {
        return this.$store.getters.staticRouter
      }
    },
    watch: {
      '$route.path' (val) {
        this.pagination.page = 1
        this.sort_priority = ''
        this.checkboxModel = false
        this.getData()
      },
      // '$route.query.load' (val) {
      //   if (Number(val) > 0) {
      //     this.pagination.page = 1
      //     this.sort_priority = ''
      //     this.checkboxModel = false
      //     this.getData()
      //   }
      // },
      changeNewsboard (val) {
        let vm = this
        var arr = vm.tableEventListItems
        vm.tableEventListItems = []
        for (let key in arr) {
          if (Number(arr[key].newsBoardId) === Number(val.newsBoardId)) {
            arr[key] = val
          }
        }
        vm.tableEventListItems = arr
      }
      // width (val) {
      //   window.$('.list-news-class .simplebar-scroll-content').width(val + 20)
      // }
    },
    data () {
      return {
        pagination: {
          page: 1,
          length: 0
        },
        paginationSize: 100,
        checkboxModel: false,
        tableEventListItems: [],
        sort_priority: '',
        heightFull: 0,
        order: true,
        totalRepon: 0,
        totalUnreadList: 0
      }
    },
    created () {
      this.$nextTick(function () {
        this.getData()
      })
    },
    mounted () {
      // this.$nextTick(() => {
      //   window.$(function () {
      //     window.$('.list-news-class').attr('data-simplebar', '')
      //   })
      // })
    },
    methods: {
      onScroll (item) {
        var vm = this
        if (window.$('.list-news-class').scrollTop() + window.$('.list-news-class').height() === vm.heightFull) {
          if (window.$('.list-news-class').scrollTop() !== 0) {
            vm.pagination.page = vm.pagination.page + 1
            if (vm.pagination.length >= vm.pagination.page) {
              vm.getData(true)
            }
          }
        }
      },
      sortPriorityNewsBoard () {
        var vm = this
        vm.pagination.page = 1
        vm.totalUnreadList = 0
        if (vm.sort_priority === '') {
          vm.sort_priority = true
        } else {
          vm.sort_priority = ''
        }
        vm.getData()
      },
      sortNewsBoard () {
        var vm = this
        vm.pagination.page = 1
        vm.totalUnreadList = 0
        vm.order = !vm.order
        vm.getData()
      },
      watchedNewsboad () {
        let vm = this
        let listClassPk = ''
        let arr = []
        for (var key in vm.tableEventListItems) {
          if (vm.tableEventListItems[key].bool === true) {
            arr.push(vm.tableEventListItems[key])
          }
        }
        for (var keys in arr) {
          if (Number(keys) !== arr.length - 1) {
            listClassPk = listClassPk + vm.tableEventListItems[keys].newsBoardId + ','
          } else {
            listClassPk = listClassPk + vm.tableEventListItems[keys].newsBoardId
          }
        }
        let url = vm.end_point + 'visitlogs/' + vm.newsBoardClassName + '/markasreads'
        let params = new URLSearchParams()
        params.append('classPK', listClassPk)
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        window.axios.put(url, params, config)
          .then(function (response) {
            vm.pagination.page = 1
            vm.totalUnreadList = 0
            vm.getData()
          })
          .catch(function (error) {
            window.showMessageByAPICode(error.response.status, error.response.data)
            console.log(error.response.status)
          })
      },
      getData (boolscroll) {
        let vm = this
        if (boolscroll === true) {
          window.$('.list-news-class').animate({
            scrollTop: vm.heightFull - 40
          }, 600)
        }
        setTimeout(function () {
          window.$('.list-news-class').css('height', 'auto')
          vm.heightFull = window.$('.list-news-class').height()
        }, 499)
        vm.isLoading = true
        let start = this.pagination.page * this.paginationSize - this.paginationSize
        let end = this.pagination.page * this.paginationSize
        let queries = {
          start: start || 0,
          end: end || vm.paginationSize
        }
        setTimeout(function () {
          window.$('.list-news-class').css('height', 'calc(100vh - 235px)')
        }, 500)
        const workspace = this.$route.params.workspaceId || ''
        Object.assign(queries, vm.staticRouter.meta.query, {workspace: workspace || '', sort: 'publicationDate_Number', priority: vm.sort_priority, order: vm.order})
        vm.$store.dispatch('newsBoard/getNewsBoardItems', queries
        ).then(response => {
          vm.totalRepon = response.total
          if (boolscroll === true) {
            vm.totalUnreadList = vm.totalUnreadList + response.data.length
            for (var key in response.data) {
              vm.tableEventListItems.push(response.data[key])
            }
          } else {
            vm.tableEventListItems = response.data
          }
          vm.totalUnreadList = 0
          for (var i in vm.tableEventListItems) {
            if (vm.tableEventListItems[i].visited === false) {
              vm.totalUnreadList = vm.totalUnreadList + 1
            }
          }
          vm.pagination.length = Math.ceil(Number(response.total) / vm.paginationSize)
          vm.isLoading = false
          vm.tableEventListItems = vm.tableEventListItems.map(item => {
            item.bool = false
            return item
          })
        }, error => {
          console.log(error)
          vm.isLoading = false
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
      },
      clickDetailNewsBoard (item) {
        if (item.visited === false) {
          this.totalUnreadList = this.totalUnreadList - 1
        }
        item.visited = true
        this.$router.replace({
          name: this.$route.name,
          params: this.$route.params,
          query: Object.assign({}, this.$route.query, {
            newsBoardId: item.newsBoardId
          })
        })
      },
      changeCheckbox (item, index) {
        item.bool = !item.bool
        var arr = this.tableEventListItems
        this.tableEventListItems = []
        arr[index].bool = item.bool
        this.tableEventListItems = arr
      },
      checkAll () {
        if (this.checkboxModel === false) {
          this.tableEventListItems.map(item => {
            item.bool = true
            return item
          })
        } else {
          this.tableEventListItems.map(item => {
            item.bool = false
            return item
          })
        }
      },
      deleteNewsBoard () {
        let vm = this
        let check = false
        let newsBoardId = 0
        for (var key in vm.tableEventListItems) {
          if (vm.tableEventListItems[key].bool === true) {
            check = true
          }
        }
        if (check === true) {
          vm.$dialog.confirm('Bạn có chắc chắn muốn thực hiện hành động này không?', {
            html: true,
            loader: true,
            okText: 'Xác nhận',
            cancelText: 'Quay lại',
            animation: 'fade'
          })
            .then((dialog) => {
              for (var key in vm.tableEventListItems) {
                if (vm.tableEventListItems[key].bool === true) {
                  newsBoardId = vm.tableEventListItems[key].newsBoardId
                  vm.apiDelete(vm.tableEventListItems[key].newsBoardId)
                }
              }
              if (Number(newsBoardId) === Number(vm.$route.query.newsBoardId)) {
                newsBoardId = 0
              }
              dialog.close()
              setTimeout(function () {
                vm.totalUnreadList = 0
                vm.getData()
                vm.$router.replace({
                  name: vm.$route.name,
                  params: vm.$route.params,
                  query: {
                    newsBoardId: newsBoardId
                  }
                })
              }, 1000)
            })
            .catch((e) => {
              console.log(e)
            })
        }
      },
      apiDelete (id) {
        let vm = this
        let url = vm.end_point + 'newsboards/' + id
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        window.axios.delete(url, config)
          .then(function (response) {
            vm.totalRepon = vm.totalRepon - 1
          })
          .catch(function (error) {
            window.showMessageByAPICode(error.response.status, error.response.data)
            console.log(error.response.status)
          })
      },
      changeOnTop (item, boolen) {
        let vm = this
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        if (item.permission === 'owner') {
          let params = new URLSearchParams()
          if (boolen === true) {
            params.append('ontop', false)
          } else {
            params.append('ontop', true)
          }
          window.axios.put(vm.end_point + 'newsboards/' + item.newsBoardId, params, config)
            .then(function (response) {
              vm.pagination.page = 1
              vm.totalUnreadList = 0
              vm.getData()
            })
            .catch(function (error) {
              console.log(error)
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
        }
      }
    }
  }
</script>

<style lang="scss">
  .header-list-newboard {
    display: flex;
    align-items: center;
    padding: 10px;
  }
  .header-list-newboard .checkbox {
    width: 30px;
    flex: none;
  }
  .header-list-newboard .listIcon {
    margin-left: auto;
    display: inline-table; 
  }
  .header-list-newboard .listIcon .icon-padding-class, .sortUrgentClass{
    border: 1px solid #ddd;
    padding: 8px;
    border-radius: 3px;
    cursor: pointer;
    margin-right: 3px;
  }
  .icon-padding-class:hover {
    color: #039be5;
  }
  .list-newboard-class, .header-list-newboard {
    border-bottom: 1px solid #f1f1f1;
    padding: 10px;
  }
  .list-newboard-class .checkbox {
     margin: 0;
  }
  .list-newboard-class .checkbox .input-group__details,.header-list-newboard .checkbox .input-group__details{
    display: none;
  }
  .list-news-class {
    overflow: auto;
    visibility: hidden;
  }
  .list-news-child-class,.list-news-class:hover,.list-news-class:focus {
    visibility: visible;
  }
  .list-news-class::-webkit-scrollbar-track {
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*/
    background-color: #fff;
    border-radius: 7px;
  }
  .list-news-class::-webkit-scrollbar {
    width: 7px;
    background-color: #fff;
  }
  .list-news-class::-webkit-scrollbar-thumb {
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);*/
    background-color: #8E979C;
    border-radius: 7px;
  }
  .priorityClass {
    border-left: 3px solid red;
  }
  .title-list-newsboard {
    height: 40px;
    color: #fff;
    text-transform: uppercase;
    display: flex;
    font-weight: 500;
  }
  .newsboard-active {
    background: #e7f5fd;
    color: #039be5!important;
  }
  .list-newboard-class:hover {
    background: #f0f1f1;
  }
  .commentCountClass {
    /*font-size: 1rem;*/
    background-color: rgb(167, 161, 148);
    color: white;
    padding: 0px 4px;
    border-radius: 50%;
  }
  .test-wrapper {
    display: flex;
    position: relative;
  }
  .test-wrapper i {
    font-size: 13px!important;
    padding-left: 4px;
  }
  .ring-wrapper {
    width: 8px;
    height: 8px;
    background-color: #00aeff;
    position: absolute;
    left: 7px;
    top: 7px;
    border-radius: 50%;
  }

  .ring-pulse {
    position: absolute;
    top: -9px;
    right: -8px;
    height: 24px;
    width: 24px;
    z-index: 10;
    background-color: rgba(109, 207, 246, 0.5);
    border-radius: 100%;
    -webkit-animation: pulsate 1s ease-out;
    -webkit-animation-iteration-count: infinite;
    opacity: 0;
  }

  body .starClass i {
    font-size: 18px!important;
  }

  @-webkit-keyframes pulsate {
    0% {
      -webkit-transform: scale(0.1, 0.1);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      -webkit-transform: scale(1.2, 1.2);
      opacity: 0;
    }
  }
</style>