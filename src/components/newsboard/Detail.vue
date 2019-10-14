<template>
  <div class="fullwidth detail-wrapper newsboard-detail-wrapper simplebar" data-simplebar >
    <v-slide-x-transition>
      <v-layout wrap v-if="$route.query.newsBoardId && isReadly && newsBoard.newsBoardId > 0"
        class=""      
        >
        <v-flex xs12>
          
          <EditFieldTitle class="mb-2"
            v-if="newsBoardMapWorkspaces.newsBoardId"
            :id="newsBoard.newsBoardId"
            :newsBoard="newsBoardMapWorkspaces"
            :class_name="newsBoardClassName"
            :class_pk="newsBoard.newsBoardId"
            @change="emitNewsboard"
          >
          </EditFieldTitle>

          <v-btn-toggle v-model="viewComment" mandatory
            class="btn--flat"
          >
            <v-btn
              flat color="primary" value="content"
            >
              Nội dung
            </v-btn>
            <v-btn
              flat color="primary" value="comment"
            >
              {{ (newsBoard.newsType === 'FAQ' ? 'Trả lời' : 'Thảo luận' + '' ) + ' (' + commentNumber + ')'}}
            </v-btn>
          </v-btn-toggle>
        
          <v-card style="box-shadow: none;border: none;border-top: 1px solid #ccc;">
            <div class="mbl-comment">
              <JxMobilinkComment
                v-show="viewComment==='comment'"
                id="1234" class="mb-2"
                @init-comment="initComment"
                :class_name="newsBoardClassName"
                :class_pk="newsBoard.newsBoardId"
                comments_api="comments"
                :user_id="user_id"
                :full_name="current_user_name"
                :contacts="contacts"
                :newsBoard_type="newsBoard.newsBoardType"
                :start_end="newsBoard.startend"
                :showExpandHeader=false
                @countComments="(val) => (commentNumber = val)"
                @countCommentsIncrease="(val) => (commentNumber = commentNumber + val)"
              ></JxMobilinkComment>
            </div>
            <v-card-text>
              <EditContentField
                v-show="viewComment==='content'"
                :id="newsBoard.newsBoardId"
                :newsBoard="newsBoardMapWorkspaces"
              />
            </v-card-text>
          </v-card>

          <v-card style="box-shadow: none;border: none;border-top: 1px solid #ccc;">
            <v-card-text class="detail-newsboard-upload">
              <uploader 
                :options="optionsFileAttach" class="uploader-example">
                  <uploader-unsupport></uploader-unsupport>
                  <uploader-list 
                      :id="newsBoard.newsBoardId + '1'"
                      view-id='DOCS'
                      :class_name="newsBoardClassName"
                      :class_pk="newsBoard.newsBoardId"
                      :file_attach_api="end_point + 'fileattachs'"
                      :resourceusers_get_api="end_point + 'resourceusers'"
                      extensions_upload="true"
                      :permission="newsBoard.permission"
                      :appendix="true"
                      :edit_online_key="serviceEditorCode"
                      :showlist="true"
                      :mbl_attach="true"
                  ></uploader-list>
              </uploader>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <div v-else class="no-newsboard-selected" >
          <div class="text-xs-center">
            <v-icon size="46">speaker_notes_off</v-icon>
            <div class="text-no-noti grey--text">Để xem một bản tin, hãy bấm chuột vào nó</div>
          </div>
      </div>
    </v-slide-x-transition>
  </div>
</template>

<script>
import EditFieldTitle from './EditFieldTitle'
import EditContentField from './EditContentField'
import JxMobilinkComment from '@/components/task/mobilink_comment.vue'

export default {
  props: {
    width: 0
  },
  components: {
    EditFieldTitle,
    EditContentField,
    JxMobilinkComment
  },
  data () {
    return {
      current_user_name: 'MRX',
      newsBoard: {},
      optionsFileAttach: {},
      isReadly: false,
      viewComment: 'content',
      commentNumber: '0'
    }
  },
  watch: {
    '$route.query.newsBoardId' (val) {
      if (val) {
        this.initDetail()
      }
    },
    width (val) {
      window.$('.newsboard-detail-wrapper .simplebar-scroll-content').width(val + 20)
    },
    commentNumber (val) {
      if (this.newsBoard) {
        this.$emit('change-detail-newsboard', Object.assign({}, this.newsBoard, {commentCount: val}))
      }
    }
  },
  computed: {
    contacts () {
      let arrTemp = []
      let contactArr = this.$store.getters.loadedContacts
      for (var key in contactArr) {
        arrTemp.push({
          id: contactArr[key].contactId,
          fullname: contactArr[key].fullName,
          email: contactArr[key].email,
          profilePictureURL: contactArr[key].profileUrl || '/image/user_male_portrait'
        })
      }
      return arrTemp
    },
    newsBoardMapWorkspaces () {
      const newsBoard = this.newsBoard
      let rs = newsBoard
      let ws = []
      if (newsBoard.workspaces && newsBoard.workspaces.length) {
        ws = newsBoard.workspaces
      } else if (newsBoard.workspaces && !newsBoard.workspaces.length) {
        ws = [newsBoard.workspaces]
      }
      rs.workspaces = ws.map(item => {
        item.workspaceName = item.name || item.workspaceName
        return item
      })
      return rs
    }
  },
  methods: {
    emitNewsboard (val) {
      var vm = this
      vm.newsBoard = val
      vm.$emit('change-detail-newsboard', val)
      // (response) => ($emit('change-detail-newsboard', response))
    },
    changeState (item) {
      let vm = this
      const config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      let params = new URLSearchParams()
      params.append('priority', item)
      window.axios.put(vm.end_point + 'newsboards/' + vm.newsBoard.newsBoardId,
        params,
        config
      )
        .then(function (response) {
          window.showMessageToastr('success', 'Cập nhật thành công')
        })
        .catch(function (error) {
          console.log(error.response)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    },
    initComment (prevewConfig) {
      window.$('#mobilink-comments-container').comments(prevewConfig)
    },
    removeActivity (newsBoard) {
      let vm = this
      vm.$dialog.confirm('Bạn muốn xóa sự kiện', {
        html: true,
        loader: true,
        okText: 'Xác nhận',
        cancelText: 'Quay lại',
        animation: 'fade'
      })
        .then(function (dialog) {
          vm.$store.dispatch('deleteActivity', newsBoard)
          dialog.close()
          return false
        })
        .catch(function (e) {
          console.log(e)
        })
    },
    initDetail () {
      if (this.$route.query.newsBoardId) {
        this.$nextTick(() => {
          let vm = this
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Đang tải dữ liệu...'
          })
          vm.$store.dispatch('newsBoard/readNewsBoard', vm.$route.query.newsBoardId
          ).then(response => {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            if (response.editable === 2 && response.permission === 'owner') {
              vm.$router.replace({
                name: 'thung_rac',
                params: vm.$route.params,
                query: Object.assign({}, vm.$route.query, {
                  newsBoardId: response.newsBoardId
                })
              })
            } else if (response.editable === 2 && response.permission !== 'owner') {
              vm.$router.replace({
                name: vm.$route.name,
                params: vm.$route.params,
                query: Object.assign({}, vm.$route.query, {
                  newsBoardId: 0
                })
              })
            }
            if (response.newsType === 'ANNOUNCE' && vm.$route.path === '/notification') {
              vm.$router.replace({
                name: 'thong_bao',
                params: vm.$route.params,
                query: Object.assign({}, vm.$route.query, {
                  newsBoardId: response.newsBoardId
                })
              })
            } else if (response.newsType === 'FAQ' && vm.$route.path === '/qna') {
              vm.$router.replace({
                name: 'hoi_dap',
                params: vm.$route.params,
                query: Object.assign({}, vm.$route.query, {
                  newsBoardId: response.newsBoardId
                })
              })
            }
            vm.$emit('change-detail-newsboard', response)
            vm.optionsFileAttach = {
              target: vm.end_point + 'fileattachs/upload/' + vm.newsBoardClassName +
                '/' + vm.$route.query.newsBoardId + '/' + vm.group_id,
              chunkSize: 500 * 1024 * 1024,
              fileMaxSize: Number(vm.MSystemConfiguration.configuration.fileattach.maxfilesize || 1024),
              fileType: vm.MSystemConfiguration.configuration.fileattach.fileextensions || 'NONE',
              headers: {
                groupId: vm.group_id,
                appendix: true
              },
              allowDuplicateUploads: true
            }
            let checkPermission = 'owner,leader,hoster,manager,writer,read'.indexOf(response.permission || 'NONE') >= 0
            if (checkPermission) {
              vm.newsBoard = response
              vm.isReadly = true
            } else {
              vm.$router.push('/noprmission')
            }
          }, error => {
            console.log(error)
            vm.$router.replace({
              name: vm.$route.name,
              params: vm.$route.params,
              query: Object.assign({}, vm.$route.query, {
                newsBoardId: 0
              })
            })
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          })
        })
      }
    }
  },
  mounted () {
    let vm = this
    vm.initDetail()
    vm.$store.dispatch('loadContacts')
    window.$(function () {
      // window.$('.newsboard-detail-wrapper').attr('data-simplebar', '')
    })
  }
}
</script>

<style lang="scss">
.listcontainer {
  display: flex
}
.task-content {
  overflow: auto;
  width: 100%;
}
.no-newsboard-selected{
  height: calc(100vh - 130px);
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    font-size: 46px !important;
  }
}
.no-newsboard-selected .text-no-noti {
  font-weight: bold;
}
.newsboard-detail-wrapper {
  height: calc(100vh - 130px);
  .simplebar-track.vertical {
    right: -2px;
  }
}

.newsboard-detail-wrapper .mbl-comment {
  .card, .expansion-panel {
    box-shadow: none;
  }
  .card__text {
    padding: 0;
  }
}

.detail-newsboard-upload {
  .component-uploader-list {
    padding: 10px;
  }
  table.table-bs tr {
    border: 1px solid #e6e7e8;
    border-top: 0;
  }
}

</style>
