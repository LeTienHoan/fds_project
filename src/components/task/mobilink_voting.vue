<template>
  <div class="mobilink-component-voting">

    <mbl-expand-panel
      :rightactions="rightactions"
      :leftactions="[
        {
          icon: 'bookmark_border'
        }
      ]"
      :ownExpanded="ownExpanded"
      @newvotingadd="newVotingAdd"
    >
      <template slot="title-name">
        {{ votingTitle }}
      </template>
      <template slot="card-text-container">
        <div>
          <v-layout wrap v-if="votingItems.length == 0">
            <v-flex xs12 class="text-xs-center" style="color: #ccc">
              <v-icon style="font-size: 26px!important">done_all</v-icon>
              <br>
              Không có bình chọn nào
            </v-flex>
          </v-layout>
          <v-list class="mobilink--voting pa-0">
            <template v-for="(item, index) in votingItems">
                <v-list-tile :key="'vonting'+index"
                  v-if="!isLoading"
                >
                  <v-list-tile-content>
                    <v-list-tile-sub-title class="grey--text text--darken-4 layout">
                      <div class="voting-number">{{index + 1}}</div> <span class="pr-2">{{ item.subject }}</span>
                        <v-btn v-if="hasPermission || (isWriter && user_id === item.userId)" 
                          v-on:click.native="votingEdit(item, index)" 
                          flat icon class="ma-0 pull-right" color="grey darken-1"
                          title="Sửa"
                        >
                          <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn v-if="hasPermission || (isWriter && user_id === item.userId)"
                            v-on:click.native="votingRemove(item, index)" 
                            flat icon class="ma-0 pull-right" color="red darken-3"
                            title="Xóa"
                          >
                          <v-icon>clear</v-icon>
                        </v-btn>
                    </v-list-tile-sub-title>
                    <!-- <v-list-tile-sub-title class="text-xs-right">
                      Tạo bởi {{ item.userName }} <span class="grey--text">{{ item.createDate | datetime}}</span>
                      
                    </v-list-tile-sub-title> -->
                    
                    <ul class="voting_results">
                      <v-radio-group v-model="item.selected">
                      <li v-for="(itemChilds, indexResults) in item.choices" v-bind:key="indexResults">
                        <div status="success" class="light-blue lighten-5">
                          <div v-if="item.answersCount > 0 && item.answers[indexResults]" class="uploader-file-progress" :style="'background: white;transform: translateX(' + (item.answers[indexResults] / item.answersCount)*100 + '%);'"></div>
                          <div v-else class="uploader-file-progress" :style="'background: white;transform: translateX(0%);'"></div>
                          <div class="uploader-file-info">
                            <div class="voting-processing">
                              <v-radio 
                                :label="itemChilds"
                                color="primary"
                                :value="indexResults + 1"></v-radio>
                            </div>
                            <div class="voting_result_summer">{{item.answers[indexResults]}} / {{item.answersCount}}</div>
                          </div>
                        </div>
                      </li>
                      </v-radio-group>
                        <MobilinkVotingResult v-if="item.commentable"
                          :my_comment.sync="item.comment"
                          :voting_id="item.votingId"
                          :group_id="group_id"
                          :user_id="user_id"
                          :voting_api="end_point + voting_api"
                          :answersCount="item.answersCount"
                          @sync-vl="(val) => ( item.comment = val)"
                        >
                        </MobilinkVotingResult>
                    </ul>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider v-if="index + 1 < votingItems.length" :key="'divider'+index"></v-divider>
            </template>
            <!-- <v-btn flat block color="primary" @click.native="doVottingResultSubmit"
              v-if="votingItems.length > 0"
              :loading="votingDialog_hidden_loading" 
              :disabled="votingDialog_hidden_loading"
            >
              Gửi ý kiến &nbsp;&nbsp;
              <v-icon class="primary--text">send</v-icon>
            </v-btn> -->
            <v-btn class="primary ma-0" small depressed @click.native="doVottingResultSubmit"
              style="min-width: 0px"
              v-if="votingItems.length > 0"
              :loading="votingDialog_hidden_loading" 
              :disabled="votingDialog_hidden_loading"
              >
                Gửi
            </v-btn>
          </v-list>
        </div>
      </template>
    </mbl-expand-panel>
    
    <dia-log 
      :item = "[
        {
          width: '900px',
          model: votingDialog,
          show_button: true,
          action: 'saveDialog',
          edit: (hasPermission || ( isWriter && (user_id === voteUserId || votingId === 0) ) ) && votingId === 0,
          label: 'Ghi lại',
          icon: 'save'
        },
        {
          width: '900px',
          model: votingDialog,
          show_button: true,
          action: 'saveDialog2',
          edit: (hasPermission || ( isWriter && (user_id === voteUserId || votingId === 0) ) ) && votingId > 0,
          label: 'Ghi lại',
          icon: 'save'
        }
        ]
      "
      @closeDialog="(val) => (votingDialog = val)"
      @saveDialog="doVottingSubmit"
      @saveDialog2="doVottingEditSubmit"
    >
      <template slot="header">
        Thêm nội dung lấy ý kiến
      </template>
      <template slot="content">
        <v-form ref="form" lazy-validation name="fullFormVoting">
          <v-layout wrap>
            <v-flex xs12 class="mb-2">
              <v-text-field
                label="Nội dung xin ý kiến"
                :rules="[v => !!v || 'Nội dung xin ý kiến bắt buộc nhập']"
                required
                multi-line
                autofocus
                rows="3"
                name="subject"
                v-model="subject"
                class="input-group--placeholder"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 :key="index" v-for="(item, index) in choices ">
                <v-text-field
                  label="Câu trả lời"
                  :name="'choice'+index"
                  :rules="[v => !!v || 'Câu trả lời bắt buộc nhập']"
                  autofocus
                  required
                  :value="item"
                  append-icon="clear"
                  :append-icon-cb="() => ( choiceRemove( item, index ))"
                  class="input-group--placeholder"
                >
              </v-text-field>
            </v-flex>
            <v-flex xs12 class="custome-panel-heading-with-icon">
              <div class="votting__no_padding">
                <v-checkbox label="Sử dụng câu trả lời khác" v-model="commentable" light></v-checkbox>
              </div>
              <v-btn
                @click.native="choiceAdd"
                icon
                class="ma-0"
                >
                <v-icon class="primary--text">add_circle</v-icon>
              </v-btn>
              
            </v-flex>
          </v-layout>
        </v-form>
      </template>
    </dia-log>

  <!--   <v-dialog v-model="votingDialog" persistent max-width="900" transition="fade-transition">
      <v-card>
          <v-card-title class="px-0 py-0" style="background-color: rgb(214, 233, 247);min-height: 43px;position: fixed;max-width: 900px;width: 100%;z-index: 9999;">
              <span class="pl-3">Thêm nội dung lấy ý kiến</span>
              <v-spacer></v-spacer>
              
              <div class="menu" style="display: inline-block;">
                  <div class="menu__activator">
                      <v-btn icon slot="activator" @click.native="votingDialog = false">
                          <v-icon>close</v-icon>
                      </v-btn>
                  </div>
              </div>

          </v-card-title>
          <v-card-text class="voting__add" style="padding-top: 65px;">
            <v-form v-model="validFormVoting" ref="form" lazy-validation name="fullFormVoting">
              <v-layout wrap>
                <v-flex xs12 class="mb-2">
                  <v-text-field
                    label="Nội dung xin ý kiến"
                    placeholder="Nhập nội dung xin ý kiến"
                    :rules="[v => !!v || 'Nội dung xin ý kiến bắt buộc nhập']"
                    required
                    multi-line
                    autofocus
                    rows="3"
                    name="subject"
                    v-model="subject"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 :key="index" v-for="(item, index) in choices ">
          
                    <v-text-field
                      label="Câu trả lời"
                      placeholder="nhập câu trả lời..."
                      :name="'choice'+index"
                      :rules="[v => !!v || 'Câu trả lời bắt buộc nhập']"
                      autofocus
                      required
                      :value="item"
                      append-icon="clear"
                      :append-icon-cb="() => ( choiceRemove( item, index ))"
                    >
                  </v-text-field>
                </v-flex>
                <v-flex xs12 class="custome-panel-heading-with-icon">
                  <div class="votting__no_padding">
                    <v-checkbox label="Sử dụng câu trả lời khác" v-model="commentable" light></v-checkbox>
                  </div>
                  <v-btn
                    @click.native="choiceAdd"
                    icon
                    >
                    <v-icon class="primary--text" >add_circle</v-icon>
                  </v-btn>
                  
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn primary @click.native="votingDialog = false">
              <v-icon left>close</v-icon>Quay lại 
            </v-btn>
            <v-btn primary @click.native="doVottingSubmit" 
              v-if="(hasPermission || ( isWriter && (user_id === voteUserId || votingId === 0) ) ) && votingId === 0"
              :loading="votingDialog_hidden_loading" 
              :disabled="votingDialog_hidden_loading"
            >
              <v-icon left>save</v-icon>Ghi lại 
            </v-btn>
            <v-btn primary @click.native="doVottingEditSubmit" 
              v-if="(hasPermission || ( isWriter && (user_id === voteUserId || votingId === 0) ) ) && votingId > 0"
              :loading="votingDialog_hidden_loading" 
              :disabled="votingDialog_hidden_loading"
            >
              <v-icon left>save</v-icon>Ghi lại 
            </v-btn>
          </v-card-actions>

        </v-card>
    </v-dialog> -->

    <!--
    <v-snackbar :timeout="3000" :top="true" :bottom="false" 
      :right="true" :left="false" :multi-line="true" 
      :vertical="false" v-model="snackbarSucc" class="snackbar-success" > 
      <v-icon flat color="white">check_circle</v-icon> 
      {{alertMess}}
      <v-btn flat fab mini color="white" @click.native="snackbarSucc = false">Tắt</v-btn> 
    </v-snackbar>

    <v-snackbar :timeout="3000" :top="true" :bottom="false" 
      :right="true" :left="false" :multi-line="true" 
      :vertical="false" v-model="snackbarErr" class="snackbar-error" > 
      <v-icon flat color="white">check_circle</v-icon> 
      {{alertMess}}
      <v-btn flat fab mini color="white" @click.native="snackbarErr = false">Tắt</v-btn> 
    </v-snackbar>
    -->

  </div>
</template>

<script>
import VueContentPlaceholders from 'vue-content-placeholders'
import MobilinkVotingResult from './mobilink_voting_result'
const COMPONENT_NAME = 'jx-mobilink-voting'
export default {
  name: COMPONENT_NAME,
  props: {
    id: null,
    class_pk: null,
    class_name: null,
    profilePictureURL: {
      type: String,
      default: 'https://viima-app.s3.amazonaws.com/media/user_profiles/user-icon.png'
    },
    voting_api: '',
    votingTitle: {
      type: String,
      default: 'Lấy ý kiến thống nhất'
    },
    permission: {
      type: String,
      default: 'read'
    }
  },
  components: {
    MobilinkVotingResult,
    VueContentPlaceholders
  },
  watch: {
    class_pk (val) {
      this.initData()
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.initData()
      if (vm.permission === 'read') {
        vm.rightactions = []
      }
    })
  },
  destroyed () {
    // delete this.id
    // delete this.class_pk
    // delete this.class_name
    // delete this.profilePictureURL
    // delete this.voting_api
    // delete this.votingTitle
    // delete this.permission
    // delete this.subject
    // delete this.choices
    // delete this.expanded
    // delete this.commentable
    // delete this.votingItems
    // delete this.votingSelected
    // delete this.votingPer
    // delete this.votingDialog
    // delete this.votingDialog_hidden_loading
    // delete this.votingId
    // delete this.voteUserId
    // delete this.newChoiceItem
    // delete this.isLoading
    // delete this.snackbarSucc
    // delete this.snackbarErr
    // delete this.alertMess
    // delete this.hasPermission
    // delete this.isWriter
    // delete this.rightactions
    // delete this.ownExpanded
    // delete this.initData
    // delete this._initVotingList
    // delete this.doVottingResultSubmit
    // delete this.doVottingSubmit
    // delete this.doVottingEditSubmit
    // delete this.newVotingAdd
    // delete this.votingEdit
    // delete this.votingRemove
    // delete this.choiceAdd
    // delete this.choiceRemove
  },
  data () {
    return {
      subject: '',
      choices: ['', ''],
      expanded: false,
      commentable: false,
      votingItems: [],
      votingSelected: '',
      votingPer: 0,
      votingDialog: false,
      votingDialog_hidden_loading: false,
      votingId: 0,
      voteUserId: 0,
      newChoiceItem: '',
      isLoading: false,
      snackbarSucc: false,
      snackbarErr: false,
      alertMess: '',
      hasPermission: false,
      isWriter: false,
      rightactions: [
        {
          icon: 'add',
          action: 'newvotingadd',
          title: 'Thêm ý kiến'
        }
      ],
      ownExpanded: true
    }
  },
  methods: {
    initData: function () {
      let vm = this
      vm.hasPermission = 'owner,write,leader,hoster,manager'.indexOf(vm.permission || 'none') >= 0
      vm.isWriter = 'writer'.indexOf(vm.permission || 'none') >= 0
      vm.votingItems = []
      window.axios.get(vm.end_point + vm.voting_api + '/' + vm.class_name + '/' + vm.class_pk + '?sort=createDate&start=-1&end=-1',
        vm.apiConfigHeader)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.votingItems = serializable.data
            if (vm.votingItems.length > 0) {
              vm.ownExpanded = true
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    _initVotingList: function () {
      let vm = this
      vm.isLoading = true
      vm.votingItems = []
      window.axios.get(vm.end_point + vm.voting_api + '/' + vm.class_name + '/' + vm.class_pk + '?sort=createDate&start=-1&end=-1',
        vm.apiConfigHeader)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            vm.votingItems = serializable.data
          }
          vm.isLoading = false
        })
        .catch(function (error) {
          console.log(error)
          vm.isLoading = false
        })
    },
    doVottingResultSubmit: function () {
      let vm = this
      vm.votingDialog_hidden_loading = true
      for (var key in vm.votingItems) {
        let params = new URLSearchParams()
        if (vm.votingItems[key].comment) {
          params.append('comment', vm.votingItems[key].comment)
        }
        params.append('selected', vm.votingItems[key].selected)
        params.append('email', vm.$store.guestEmail || vm.user_id)
        params.append('fullName', vm.$store.guestEmail || window.themeDisplay.getUserName())

        window.axios.post(vm.end_point + vm.voting_api + '/' + vm.votingItems[key].votingId + '/results',
          params,
          vm.apiConfigHeader
        )
          .then(function (response) {
            vm.votingDialog_hidden_loading = false
            window.showMessageToastr('success', 'Cập nhật thành công')
            vm.snackbarSucc = true
            vm._initVotingList()
          })
          .catch(function (error) {
            console.log(error)
            vm.votingDialog_hidden_loading = false
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      }
    },
    doVottingSubmit: function () {
      let vm = this
      vm.votingDialog_hidden_loading = true
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Thêm mới dữ liệu...'
      })
      if (!this.$refs.form.validate()) {
        vm.votingDialog_hidden_loading = false
        vm.alertMess = 'Nhập đầy đủ các trường dữ liệu bắt buộc'
        vm.snackbarErr = true
        return
      }
      let x = document.forms['fullFormVoting']
      let choicesItems = ''
      for (var i = 0; i < x.length; i++) {
        let field = x[i]
        if (field.name.indexOf('choice' || 'none') >= 0) {
          if (field.value === '') {
            vm.votingDialog_hidden_loading = false
            vm.alertMess = 'Nhập đầy đủ các trường dữ liệu bắt buộc'
            vm.snackbarErr = true
            return
          } else {
            choicesItems += field.value + '\r\n'
          }
        }
      }
      let params = new URLSearchParams()
      params.append('className', vm.class_name)
      params.append('classPK', vm.class_pk)
      params.append('subject', vm.subject)
      params.append('choices', choicesItems)
      params.append('commentable', vm.commentable)
      params.append('email', vm.$store.guestEmail || vm.user_id)

      window.axios.post(vm.end_point + vm.voting_api,
        params,
        vm.apiConfigHeader
      )
        .then(function (response) {
          /** vm._initVotingList() */
          vm.votingItems.push(response.data)
          vm.votingDialog_hidden_loading = false
          vm.votingDialog = false
          window.showMessageToastr('success', 'Cập nhật thành công')
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
        })
        .catch(function (error) {
          console.log(error)
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          vm.votingDialog_hidden_loading = false
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    },
    doVottingEditSubmit: function () {
      let vm = this
      vm.votingDialog_hidden_loading = true
      // if (!vm.validFormVoting) {
      //   vm.votingDialog_hidden_loading = false
      //   return
      // }
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Cập nhật dữ liệu...'
      })
      let x = document.forms['fullFormVoting']
      let choicesItems = ''
      for (var i = 0; i < x.length; i++) {
        let field = x[i]
        if (field.name.indexOf('choice' || 'none') >= 0) {
          choicesItems += field.value + '\r\n'
        }
      }
      let params = new URLSearchParams()
      params.append('className', vm.class_name)
      params.append('classPK', vm.class_pk)
      params.append('subject', vm.subject)
      params.append('choices', choicesItems)
      params.append('commentable', vm.commentable)
      params.append('email', vm.$store.guestEmail || vm.user_id)

      window.axios.put(vm.end_point + vm.voting_api + '/' + vm.votingId,
        params,
        vm.apiConfigHeader
      )
        .then(function (response) {
          window.showMessageToastr('success', 'Cập nhật thành công')
          vm.snackbarSucc = true
          vm._initVotingList()
          vm.votingDialog_hidden_loading = false
          vm.votingDialog = false
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
        })
        .catch(function (error) {
          console.log(error)
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          vm.votingDialog_hidden_loading = false
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    },
    newVotingAdd: function () {
      this.votingDialog = true
      this.votingId = 0
      this.subject = ''
      this.choices = [this.newChoiceItem, this.newChoiceItem]
      this.commentable = false
      this.voteUserId = 0
    },
    votingEdit: function (item, index) {
      this.votingDialog = true
      this.votingId = item.votingId
      this.subject = item.subject
      this.choices = item.choices
      this.commentable = item.commentable
      this.voteUserId = item.userId
    },
    votingRemove: function (item, index) {
      let vm = this
      vm.$dialog.confirm('Bạn có muốn xóa nội dung này?', {
        html: true,
        loader: true,
        okText: 'Xác nhận',
        cancelText: 'Quay lại',
        animation: 'fade'
      })
        .then((dialog) => {
          let params = new URLSearchParams()
          params.append('email', vm.$store.guestEmail || vm.user_id)
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Xóa dữ liệu...'
          })
          window.axios.delete(vm.end_point + vm.voting_api + '/' + item.votingId,
            params,
            vm.apiConfigHeader)
            .then(function (response) {
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageToastr('success', 'Xóa nội dung thành công')
              vm.votingItems.splice(index, 1)
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
    choiceAdd: function () {
      let vm = this
      vm.choices.push(vm.newchoiceItem)
    },
    choiceRemove: function (item, index) {
      if (this.choices.length > 2) {
        this.choices.splice(index, 1)
      }
    }
  }
}
</script>

<style>
.mobilink--voting .list__tile {
  height: auto;
  padding: 0;
}
.mobilink--voting .voting_results {
  width: 100%;
}
.mobilink--voting .voting_results .input-group__details{
  min-height: 2px;
}
.mobilink--voting .voting_results li {
  position: relative;
  margin-bottom: 2px;
  display: block;
}
.uploader-file-progress {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #e2eeff;
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
}

.mobilink--voting .voting_result_summer {
  width: 20%;
  text-align: right;
  padding-right: 15px;
  position: absolute;
  right: 0;
  top: 8px;
}
.mobilink--voting .voting-results-wrap {
  background: rgb(19, 93, 198);
}
.mobilink--voting .voting-processing {
  width: 80%;
}
.mobilink--voting .uploader-file-info {
  padding: 3px;
  padding-left: 10px;
}
.voting__add .input-group--text-field.input-group--textarea:not(.input-group--full-width) label{
    top: 0px !important;
    left: 0px !important;
    transform: translate(0, -8px) scale(1) !important;
}
.votting__no_padding label {
  padding-left: 0px;
}
.mobilink--voting .btn .icon{
	font-size: 17px;
}
.mobilink--voting .btn--block .btn__content {
      justify-content: left !important;
}
.mobilink--voting > li .list__tile{
  padding: 0;
}
.mobilink--voting .voting_results > .radio-group{
  padding: 0;
}

	.custome-panel-heading-with-icon {
	    display: -webkit-flex; /* Safari */
	    -webkit-align-items: center; /* Safari 7.0+ */
	    display: flex;
	    align-items: center;
	}
	.custome-panel-heading-with-icon div {
	   -webkit-flex: 1; /* Safari 6.1+ */
	   flex: 1;
	}
</style>
