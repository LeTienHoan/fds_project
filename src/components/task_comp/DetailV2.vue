<template>
  <!-- Main content -->
  <div class="fullwidth detail-wrapper" >
      <v-layout wrap v-if="isReadly && activity.activityId > 0">
        <v-flex xs9>

          <div class="layout mb-2 align-center">
            <v-btn v-if="!showBackBtn"
              outline @click="backToList" color="primary" small class="ma-0">
              <v-icon left>reply</v-icon>
              {{translate('quay_lai')}}
            </v-btn>
            <v-spacer></v-spacer>
            <v-icon v-if="notificationShared === true" title="Đăng ký theo dõi" @click="openNotification(true)" class="mr-2 pointer notiClass">alarm_on</v-icon>
            <v-icon v-if="notificationShared === false" title="Bỏ theo dõi" @click="openNotification(false)" class="mr-2 pointer notiClass">alarm_off</v-icon>
            <v-menu offset-y :nudge-top="appNudgeTop"
              :nudge-left="appNudgeLeft"
            >
              <v-btn
                slot="activator"
                small
                :color="getPriorityColor(activity['priority'])"
                class="white--text ma-0" depressed
              >
                {{getPriorityName(activity['priority'])}}
              </v-btn>
                <v-list v-if="activity.permission == 'owner' || activity.permission == 'leader' || activity.permission == 'write' || activity.permission == 'manager' || activity.permission == 'hoster'">
                  <v-list-tile
                    v-for="(item, index) in constantPriorityKey"
                    :key="index"
                    @click="changeState(activity['priority'] = item.value)"
                    :class="{'primary white--text': item.value === activity['priority']}"
                  >
                    <v-list-tile-title>
                      {{ item.text }}
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
            </v-menu>
              <JxMobilinkActivityStar
                class="starClass ml-2"
                :class_name="activityClassName"
                :class_pk="activity.activityId"
                :group_id="group_id"
                :end_point= "end_point"
                :okrArchive="activity.okrArchive"
                :permission="activity.permission"
                v-if="activity.editable==1"
              ></JxMobilinkActivityStar>
          </div>
          <JxMobilinkActivityHeader class="mb-2"
            :id="activity.activityId"
            :activity="activity"
            :class_name="activityClassName"
            :class_pk="activity.activityId"
          >
          </JxMobilinkActivityHeader>

          <div class="tab-groups">
            <div class="btn-tab-groups">
              <v-btn-toggle v-model="tabView" mandatory
                class="btn-tab-group btn--flat"
              >
                <v-btn
                  flat color="primary" value="comment"
                >
                  <v-icon left dark>message</v-icon>
                  THẢO LUẬN ({{commentNumber}})
                </v-btn>
                <v-btn
                  flat color="primary" value="document"
                >
                  <v-icon left dark>assignment</v-icon>
                  TÀI LIỆU ({{documentNumber}})
                </v-btn>
                <v-btn
                  flat color="primary" value="resultNote"
                >
                  <v-icon left dark>edit</v-icon>
                  GHI CHÚ ({{resultNoteNumber}})
                </v-btn>
              </v-btn-toggle>
            </div>
            <v-slide-x-transition>
              <keep-alive>
            
                <JxMobilinkActivityDocument  class="mb-2 mbl-document"
                  :class_name="activityClassName"
                  :class_pk="activity.activityId"
                  :permission="activity.permission"
                  :user_id="user_id"
                  v-if="tabView === 'document'"
                  >
                </JxMobilinkActivityDocument>

                <JxMobilinkActivityResultnote class="mb-2 mbl-result-note"
                  :id="activity.activityId"
                  :activity="activity"
                  :class_name="activityClassName"
                  :class_pk="activity.activityId"
                  v-if="tabView === 'resultNote'"
                  >
                </JxMobilinkActivityResultnote>

                <JxMobilinkComment 
                  id="1234" class="mb-2 mbl-comment"
                  @init-comment="initComment"
                  :class_name="activityClassName"
                  :class_pk="activity.activityId"
                  comments_api="comments"
                  :user_id="user_id"
                  :full_name="current_user_name"
                  :contacts="contacts"
                  :activity_type="activity.activityType"
                  :start_end="activity.startend"
                  v-if="tabView === 'comment'"
                  :showExpandHeader=false
                  @countComments="(val) => (commentNumber = val)"
                  @countCommentsIncrease="(val) => (commentNumber = commentNumber + val)"
                ></JxMobilinkComment>

              </keep-alive>
            </v-slide-x-transition>
          </div>

          <JxMobilinkActivityEventLink class="mb-2"
            @delete_activity="removeActivity"
            @view_detail="goToDetail"
            :class_pk = "activity.activityId"
            :class_name ="activityClassName"
            :source_type="getSourceTypeValue('EVENT_TASK')"
            :end_point= "end_point"
            :startend_prop = "activity.startend"
            :permission="activity.permission"
          ></JxMobilinkActivityEventLink>
          
          <jobAssignment class="mb-2"
            :id="activity.activityId"
            :activity="activity"
            :class_name="activityClassName"
            :user_id="user_id"
            :class_pk="activity.activityId"
            :permission="activity.permission"
            >
          </jobAssignment>

        </v-flex>
        <v-flex xs3 class="pl-2">
          <JxMobilinkShared class="mb-2"
              :visibilities_api="end_point + 'visibilities'"
              :resourceworkspace_get_api="end_point + 'resourceworkspaces'"
              :resourceroles_get_api="end_point + 'resourceroles'"
              :resourceusers_get_api="end_point + 'resourceusers'"
              :changelogs_get_api="end_point + 'changelogs'"
              :class_name="activityClassName"
              :class_pk="activity.activityId"
              :permission="activity.permission"
              :constant_permission_key="constantPermissionKey"
              @resourceuser="callBackShared"
              ref='activityShared'
          ></JxMobilinkShared>

          <JxMobilinkActivityVisibilities
            class="mb-2"
            :activity="activity"
            :class_name="activityClassName"
            :class_pk="activity.activityId"
            @update-finishdate="(val) => (activity.finishDate = val)"
          ></JxMobilinkActivityVisibilities>

          <JxMobilinkChecklist class="mb-2"
            :class_name="activityClassName"
            :class_pk="activity.activityId"
            checklist_title="Bảng kiểm tra tiến độ"
            checklist_api="checklists"
            :permission="activity.permission"
          ></JxMobilinkChecklist>
          
          <JxMobilinkAlbumImageUse
            class="mb-2"
            :id="activity.activityId"
            :class_name="activityClassName"
            :class_pk="activity.activityId"
            @init-album-file-upload="initAlbumFileUpload"
            :options="optionsAlbum"
            :album_api="end_point + 'albumfiles'"
            :permission= "activity.permission"
          >
          </JxMobilinkAlbumImageUse>
          
          <JxMobilinkVoting class="mb-2"
            :class_name="activityClassName"
            :class_pk="activity.activityId"
            expanded="true"
            voting-title="Lấy ý kiến thống nhất"
            voting_api="votings"
            :permission="activity.permission"
            :user_id="user_id"
          ></JxMobilinkVoting>

          <MobilinkReminder
            class="mb-2"
            :id="activity.activityId"
            :class_name="activityClassName"
            :class_pk="activity.activityId"
            :permission="activity.permission"
          >
          </MobilinkReminder>
          
          <ShowHistory
            :activity="activity"
            :id="activity.activityId"
            :class_name="activityClassName"
            :class_pk="activity.activityId"
          >
          </ShowHistory>
        </v-flex>
      </v-layout>
    <h1 v-show="false">{{changeId}}</h1>
  </div>
  <!-- /.content -->

</template>

<script>
import JxMobilinkActivityHeader from './mobilink_activity_header.vue'
import ShowHistory from '@/components/task/show_history.vue'
import JxMobilinkAlbumImageUse from '@/components/task/mobilink_album_image_use.vue'
import JxMobilinkComment from '@/components/task/mobilink_comment.vue'
import JxMobilinkVoting from '@/components/task/mobilink_voting.vue'
import JxMobilinkActivityStar from '@/components/task/mobilink_activity_star.vue'
import jobAssignment from '@/components/task/job_assignment.vue'
import JxMobilinkActivityEventLink from '@/components/task/mobilink_activity_eventlink.vue'
import MobilinkReminder from '@/components/task/mobilink_reminder.vue'
import JxMobilinkShared from '@/components/task/mobilink_shared.vue'
import JxMobilinkActivityDocument from '@/components/task/mobilink_activity_document.vue'
import JxMobilinkActivityVisibilities from '@/components/task/mobilink_activity_visibilities_1.vue'
import JxMobilinkActivityResultnote from '@/components/task/mobilink_activity_resultnote.vue'
import JxMobilinkChecklist from '@/components/task/mobilink_checklist.vue'

export default {
  props: {
    id: 0
  },
  components: {
    JxMobilinkActivityHeader,
    ShowHistory,
    JxMobilinkAlbumImageUse,
    JxMobilinkComment,
    JxMobilinkVoting,
    JxMobilinkActivityStar,
    jobAssignment,
    JxMobilinkActivityEventLink,
    MobilinkReminder,
    JxMobilinkShared,
    JxMobilinkActivityDocument,
    JxMobilinkActivityVisibilities,
    JxMobilinkActivityResultnote,
    JxMobilinkChecklist
  },
  data () {
    return {
      tabView: 'comment',
      current_user_name: 'MRX',
      activity: {},
      optionsAlbum: {},
      isReadly: false,
      notificationShared: true,
      resourceUserModel: [],
      resourceUserItems: [],
      commentNumber: 0,
      documentNumber: 0,
      resultNoteNumber: 0
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
    changeId () {
      this.isReadly = false
      this.initDetail()
      return this.$route.params.id
    },
    showBackBtn () {
      return this.$route.params.token
    }
  },
  methods: {
    callBackShared (model, items) {
      var vm = this
      vm.notificationShared = true
      vm.resourceUserModel = model
      vm.resourceUserItems = items
      if (model.length !== 0) {
        for (var key in model) {
          if (model[key].userId === Number(vm.user_id)) {
            vm.notificationShared = false
            break
          }
        }
      }
    },
    openNotification (item) {
      var vm = this
      var config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      if (item === true) {
        if (vm.resourceUserItems.length !== 0) {
          for (var key in vm.resourceUserItems) {
            if (vm.resourceUserItems[key].userId === Number(vm.user_id)) {
              if (vm.activity.permission === 'owner') {
                vm.resourceUserItems[key].right = 5
              } else if (vm.activity.permission === 'write') {
                vm.resourceUserItems[key].right = 1
              } else if (vm.activity.permission === 'read') {
                vm.resourceUserItems[key].right = 0
              }
              vm.resourceUserModel.push({
                email: vm.resourceUserItems[key].email,
                fullName: vm.resourceUserItems[key].fullName,
                portraitId: vm.resourceUserItems[key].portraitId,
                selected: vm.resourceUserItems[key].selected,
                sex: vm.resourceUserItems[key].sex,
                telNo: vm.resourceUserItems[key].telNo,
                userId: vm.resourceUserItems[key].userId,
                userClass: vm.resourceUserItems[key].userClass,
                right: vm.resourceUserItems[key].right
              })
            }
          }
        }
        var params = new URLSearchParams()
        params.append('users', JSON.stringify(vm.resourceUserModel))
        params.append('className', vm.activityClassName)
        params.append('classPK', vm.activity.activityId)
        params.append('userClass', 'employee')
        window.axios.post(vm.end_point + 'resourceusers/pack',
          params,
          config)
          .then(function (response) {
            vm.notificationShared = false
            vm.$refs.activityShared._initInvitedUser_1()
          })
          .catch(function (error) {
            console.log(error)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      } else {
        window.axios.delete(vm.end_point + 'resourceusers/' + vm.activityClassName + '/' + vm.activity.activityId + '/' + vm.user_id,
          config)
          .then(function (response) {
            vm.notificationShared = true
            vm.$refs.activityShared._initInvitedUser_1()
          })
          .catch(function (error) {
            console.log(error)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      }
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
      window.axios.put(vm.end_point + 'activities/' + vm.activity.activityId,
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
    initAlbumFileUpload (prevewConfig) {
      this.optionsAlbum.target = this.end_point + 'albumfiles/upload/' + prevewConfig.className + '/' + prevewConfig.classPK + '/' + prevewConfig.groupId
    },
    removeActivity (activity) {
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
            message: 'Xóa dữ liệu...'
          })
          vm.$store.dispatch('deleteActivity', activity).then(response => {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          }, error => {
            console.log(error)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
          dialog.close()
          return false
        })
        .catch(function (e) {
          console.log(e)
        })
    },
    goToDetail (activity) {
      this.$router.push('/detail/' + activity.activityId)
    },
    initDetail () {
      this.$nextTick(() => {
        let vm = this
        if (this.$route.params.id) {
          let url = vm.end_point + 'activities/' + this.$route.params.id
          let configGetActivity = {
            headers: {
              'groupId': vm.group_id
            }
          }
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Đang tải dữ liệu...'
          })
          window.axios.get(url, configGetActivity)
            .then(function (response) {
              let activity = response.data
              let checkPermission = 'owner,leader,hoster,manager,writer,read'.indexOf(activity.permission || 'none') >= 0
              if (checkPermission) {
                vm.activity = activity
                vm.isReadly = true
              } else {
                vm.$router.push('/noprmission')
              }
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
            })
            .catch(function (error) {
              console.log(error)
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              vm.$router.push('/noprmission')
            })
        }
      })
    },
    backToList () {
      this.$router.push(this.$store.getters.backToListUrl || '/')
    }
  },
  mounted () {
    let vm = this
    this.optionsAlbum = {
      target: this.end_point + 'albumfiles/upload/',
      chunkSize: 500 * 1024 * 1024,
      fileMaxSize: Number(this.MSystemConfiguration.configuration.albumfile.maximagesize || 1024),
      fileType: this.MSystemConfiguration.configuration.albumfile.imageextensions || 'NONE',
      headers: {
        groupId: this.group_id,
        appendix: true
      },
      allowDuplicateUploads: true
    }
    vm.$store.dispatch('loadContacts')
  },
  destroyed () {
    this.isReadly = false
    // delete this.current_user_name
    // delete this.activity
    // delete this.optionsAlbum
    // delete this.contacts
    // delete this.changeId
    // delete this.showBackBtn
    // delete this.changeState
    // delete this.initComment
    // delete this.initAlbumFileUpload
    // delete this.removeActivity
    // delete this.goToDetail
    // delete this.initDetail
    // delete this.backToList
  }
}
</script>

<style lang="scss">
  body {
    .notiClass {
      color: #0091ea!important;
      font-size: 25px!important;
    }
    .tab-groups {
      background-color: #ffffff;
      .btn-tab-groups {
        border-bottom: 1px solid #cccccc;
      }
      .mbl-comment {

      }
      .mbl-document {

      }
      .mbl-result-note {
        .heading-left-icon, .title-name span {
          display: none;
        }
      }
    }
  }
</style>