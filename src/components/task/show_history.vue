<template>
  <div>
    <mbl-expand-panel
      :ownExpanded=true
      :showheader=false
    >
      <template slot="card-text-container">
        <v-layout wrap>
          <v-flex xs12 class="text-main-color">
            Tạo bởi: {{ activity.userName }} - {{ activity.createDate | datetime }}
          </v-flex>
          <v-flex xs12>
            <v-btn class="primary mx-0" small @click="open_dialog_history">
              Xem lịch sử
            </v-btn>
          </v-flex>
        </v-layout>        
      </template>
    </mbl-expand-panel>
    <dia-log 
      :item = "[
        {
          width: '900px',
          model: dialog_history,
          action: 'saveDialog1',
          edit: true,
          label: 'Lưu và thoát',
          icon: 'save'
        },
        ]
      "
      :show_button = false
      @closeDialog="(val) => (dialog_history = val)"
    >
      <template slot="header">
        Lịch sử
      </template>
      <template slot="content">
        <v-layout wrap>
          <v-layout wrap>
            <v-flex xs6>
              <v-text-field
                placeholder="Tìm kiếm theo từ khóa"
                v-model="keywordModel"
                required
                v-on:keyup.enter="getHistory"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 class="pl-4">
              <custome-date-time
                :id="1"
                class="control_class"
                :datetimevalue="timeCreateDate"
                :format="localeDateProperties.dateMomentPattern" :onlydate="true"
                @syncxxx="timeChangeSearch"
                placeholder="Tìm kiếm theo ngày"
              >
              </custome-date-time>
            </v-flex>
          </v-layout>
          <v-layout wrap v-for="(item, index) in historyItems" :key="index" class="historyClass">
            <v-flex xs12>
              <div class="media">
                <div class="media-left">
                    <img :src="item.profileURL" v-if="item.profileURL !== ''" class="img-circle" width="35" height="35">
                    <img src="/o/mobilink-theme/images/avatar.png" v-else class="img-circle" width="35" height="35">
                </div>
                <div class="media-body">
                  <div class="media-heading text-bold">
                    <span v-if="item.actionType === 'auto'">Hệ thống <span style="float: right;">{{ item.createDate | datetime }}</span></span>
                    <span v-else>{{ item.fullName }} ({{ item.email }}) <span style="float: right;">{{ item.createDate | datetime }}</span></span>
                  </div>
                  <div class="contentClass">{{ item.content }}: 
                      <span v-if="item.payload[0].to">
                        #{{ item.payload[0].to }}
                      </span>
                      <span v-else>
                        <span v-if="item.payload[0].before">
                          <span v-if="item.payload[0].before[Object.keys(item.payload[0].before)[0]].length > 50">
                            
                            <a v-if="showBefore_after" @click="showBefore_after = !showBefore_after" class="pointer" style="color: #039BE5">Xem thêm<v-icon>expand_more</v-icon>
                            </a>
                            <a v-if="!showBefore_after" @click="showBefore_after = !showBefore_after" class="pointer" style="color: #039BE5">Rút gọn  <v-icon>expand_less</v-icon>
                            </a>
                              <v-flex xs12 v-if="!showBefore_after">
                                <table class="table table-bs mt-2" style="margin: 0">
                                  <tbody>
                                    <tr class="headerHistory">
                                      <th class="col-xs-6 text-xs-center">Trước ({{ Object.keys(item.payload[0].before)[0] }})</th>
                                      <th class="col-xs-6 text-xs-center">Sau ({{ Object.keys(item.payload[0].after)[0] }})</th> 
                                    </tr>
                                    <tr class='hiddenEditor'>
                                      <td>
                                        <vue-editor 
                                          v-model="item.payload[0].before[Object.keys(item.payload[0].before)[0]]"
                                          disabled
                                        >
                                        </vue-editor>
                                      </td>
                                      <td>
                                        <vue-editor 
                                          v-model="item.payload[0].after[Object.keys(item.payload[0].after)[0]]"
                                          disabled
                                        >
                                        </vue-editor>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </v-flex>
                          </span>
                          <span v-else>
                            {{ Object.keys(item.payload[0].before)[0] }} = {{ item.payload[0].before[Object.keys(item.payload[0].before)[0]] }} -> {{ Object.keys(item.payload[0].after)[0] }} = {{ item.payload[0].after[Object.keys(item.payload[0].after)[0]] }}
                          </span>
                        </span> 
                        <span v-else>#{{ item.payload[0].primaryKeyObj }}</span>
                      </span>
                  </div>
                </div>
              </div>
            </v-flex>
          </v-layout>
          <div class="text-xs-right pt-2 flex xs12" v-if="historyItems.length != 0">
            <v-pagination class="right" v-model="paginationModel" :length="paginationPages"></v-pagination>
          </div>
        </v-layout>
      </template>
    </dia-log>
  </div>
  
</template>


<script>

const COMPONENT_NAME = 'show-history'
export default {
  name: COMPONENT_NAME,
  props: {
    activity: {
      default: []
    },
    class_pk: null,
    class_name: null
  },
  watch: {
    'paginationModel': {
      handler () {
        this.getHistory()
      }
    }
  },
  data () {
    return {
      dialog_history: false,
      historyItems: [],
      paginationModel: 1,
      paginationPages: 0,
      timeCreateDate: '',
      keywordModel: '',
      showBefore_after: true
    }
  },
  created () {
    this.$nextTick(function () {
    })
  },
  destroyed () {
    // delete this.activity
    // delete this.class_pk
    // delete this.class_name
    // delete this.dialog_history
    // delete this.historyItems
    // delete this.paginationModel
    // delete this.paginationPages
    // delete this.timeCreateDate
    // delete this.keywordModel
    // delete this.showBefore_after
    // delete this.open_dialog_history
    // delete this.getHistory
    // delete this.timeChangeSearch
  },
  methods: {
    open_dialog_history () {
      let vm = this
      vm.dialog_history = true
      vm.timeCreateDate = ''
      vm.keywordModel = ''
      vm.getHistory()
    },
    getHistory () {
      let vm = this
      let params = {
        start: vm.paginationModel * 10 - 10,
        end: vm.paginationModel * 10,
        status: 1,
        keywords: vm.keywordModel,
        sort: 'createDate',
        order: true,
        createDate: vm.timeCreateDate ? window.moment(vm.timeCreateDate).format('YYYYMMDD') : ''
      }
      let config = {
        params: params,
        headers: {
          groupId: vm.group_id
        }
      }
      let url = vm.end_point + 'changelogs/' + vm.class_name + '/' + vm.class_pk
      window.axios.get(url, config).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data')) {
          vm.historyItems = []
          for (var key in serializable.data) {
            vm.historyItems.push({
              actionType: serializable.data[key].actionType,
              content: serializable.data[key].content,
              createDate: serializable.data[key].createDate,
              fullName: serializable.data[key].fullName,
              email: serializable.data[key].email,
              profileURL: serializable.data[key].profileURL,
              payload: JSON.parse('[' + serializable.data[key].payload + ']')
            })
          }
        }
        vm.paginationPages = Math.ceil(serializable.total / 10)
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    timeChangeSearch (val) {
      this.timeCreateDate = val
      this.getHistory()
    }
  }
}
</script>

<style >
  .historyClass {
    border-bottom: 1px dashed #999;
    padding: 10px 0px;
  }
  .historyClass .media-heading {
    margin: 0;
  }
  .hiddenEditor .ql-toolbar {
    display: none;
  }
  .hiddenEditor #quill-container{
    border: 0!important;
  }
  .hiddenEditor td {
    padding: 0!important;
  }
  .headerHistory th {
    border: 1px solid #e6e7e8;
    vertical-align: middle!important;
  }
</style>