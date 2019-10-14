<template>
  <div class="fullwidth detail-wrapper" >
    <v-layout wrap v-if="isReadly">
      <v-flex xs9>

        <div class="layout mb-2 align-center">
          <v-btn v-if="!showBackBtn"
            outline @click="backToList" color="primary" small class="ma-0">
            <v-icon left>reply</v-icon>
            {{translate('quay_lai')}}
          </v-btn>
          
          <v-spacer></v-spacer>
          <div class="grey--text px-2">
            <i>
              {{ translate('tao_boi') + ': ' + docFile.userName }}
              - {{translate('ngay_tao')}}: {{docFile.createDate | date}}
              - {{translate('ngay_sua')}}: {{docFile.modifiedDate | date}}
            </i>
          </div>
          <v-icon v-if="notificationShared === true" title="Đăng ký theo dõi" @click="openNotification(true)" class="mr-2 pointer notiClass">alarm_on</v-icon>
          <v-icon v-if="notificationShared === false" title="Bỏ theo dõi" @click="openNotification(false)" class="mr-2 pointer notiClass">alarm_off</v-icon>
          <v-menu offset-y :nudge-top="appNudgeTop"
            :nudge-left="appNudgeLeft"
          >
            <v-btn
              slot="activator"
              small
              :color="getPriorityColor(docFile['priority'])"
              class="white--text ma-0" depressed
            >
              {{getPriorityName(docFile['priority'])}}
            </v-btn>
            <v-list v-if="docFile.permission == 'owner' || docFile.permission == 'leader' || docFile.permission == 'write' || docFile.permission == 'manager' || docFile.permission == 'hoster'">
              <v-list-tile
                v-for="(item, index) in constantPriorityKey"
                :key="index"
                @click="changeState(docFile['priority'] = item.value)"
                :class="{'primary white--text': item.value === docFile['priority']}"
              >
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          <JxMobilinkActivityStar
            class="starClass ml-2"
            :class_name="docFileClassName"
            :class_pk="docFile.docFileId"
            :group_id="group_id"
            :end_point= "end_point"
            v-if="docFile.editable==1"
          ></JxMobilinkActivityStar>
        </div>
        <DocFileEditField class="mb-2"
          :id="docFile.docFileId"
          :docFile="docFileMapWorkspaces"
          :class_name="docFileClassName"
          :class_pk="docFile.docFileId"
        >
        </DocFileEditField>

        <JxMobilinkActivityDocument  class="mb-2"
          :class_name="docFileClassName"
          :class_pk="docFile.docFileId"
          :permission="docFile.permission"
          :user_id="user_id"
          >
        </JxMobilinkActivityDocument>
        <JxMobilinkTextForwarding class="mb-2"
          v-if="!docFileOtherType"
          :class_name="docFileClassName"
          :class_pk="docFile.docFileId"
          :permission="docFile.permission"
        >
          
        </JxMobilinkTextForwarding>
        <JxMobilinkActivityEventLink class="mb-2"
          @delete_docFile="removeActivity"
          @view_detail="goToDetail"
          :class_pk = "docFile.docFileId"
          :class_name ="docFileClassName"
          :source_type="getSourceTypeValue('EVENT_DOCUMENT')"
          :end_point= "end_point"
          :startend_prop = "docFile.startend"
          :permission="docFile.permission"
        ></JxMobilinkActivityEventLink>
        
        <!-- v-if="!(docFile.assignType==1 || docFile.assignType==4)" -->
        <jobAssignment class="mb-2"
          :id="docFile.docFileId"
          :activity="docFile"
          :class_name="docFileClassName"
          :user_id="user_id"
          :class_pk="docFile.docFileId"
          :permission="docFile.permission"
          >
        </jobAssignment>

        <JxMobilinkComment
          id="1234" class="mb-2"
          @init-comment="initComment"
          :class_name="docFileClassName"
          :class_pk="docFile.docFileId"
          comments_api="comments"
          :user_id="user_id"
          :full_name="current_user_name"
          :contacts="contacts"
          :docFile_type="docFile.docFileType"
          :start_end="docFile.startend"
        ></JxMobilinkComment>

      </v-flex>
      <v-flex xs3 class="pl-2">
        <JxMobilinkShared class="mb-2"
            :visibilities_api="end_point + 'visibilities'"
            :resourceworkspace_get_api="end_point + 'resourceworkspaces'"
            :resourceroles_get_api="end_point + 'resourceroles'"
            :resourceusers_get_api="end_point + 'resourceusers'"
            :changelogs_get_api="end_point + 'changelogs'"
            :class_name="docFileClassName"
            :class_pk="docFile.docFileId"
            :permission="docFile.permission"
            :constant_permission_key="constantPermissionKey"
            @resourceuser="callBackShared"
            ref='docfileShared'
        ></JxMobilinkShared>

       <!--  <JxMobilinkActivityVisibilities
          v-if="!docFileOtherType"
          class="mb-2"
          :activity="docFile"
          :class_name="docFileClassName"
          :class_pk="docFile.docFileId"
          @update-finishdate="(val) => (docFile.finishDate = val)"
        ></JxMobilinkActivityVisibilities> -->
        <JxMobilinkChecklist class="mb-2"
          v-if="!docFileOtherType"
          :class_name="docFileClassName"
          :class_pk="docFile.docFileId"
          checklist_title="Bảng kiểm tra tiến độ"
          checklist_api="checklists"
          :permission="docFile.permission"
        ></JxMobilinkChecklist>
        <JxMobilinkAlbumImageUse
          class="mb-2"
          :id="docFile.docFileId"
          :class_name="docFileClassName"
          :class_pk="docFile.docFileId"
          @init-album-file-upload="initAlbumFileUpload"
          :options="optionsAlbum"
          :album_api="end_point + 'albumfiles'"
          :permission= "docFile.permission"
        >
        </JxMobilinkAlbumImageUse>
        
        <JxMobilinkVoting class="mb-2"
          :class_name="docFileClassName"
          :class_pk="docFile.docFileId"
          expanded="true"
          voting-title="Lấy ý kiến thống nhất"
          voting_api="votings"
          :permission="docFile.permission"
          :user_id="user_id"
        ></JxMobilinkVoting>
        <MobilinkReminder
          v-if="!docFileOtherType"
          class="mb-2"
          :id="docFile.docFileId"
          :class_name="docFileClassName"
          :class_pk="docFile.docFileId"
          :permission="docFile.permission"
        >
        </MobilinkReminder>
        <ShowHistory
          :activity="docFile"
          :id="docFile.docFileId"
          :class_name="docFileClassName"
          :class_pk="docFile.docFileId"
        >
        </ShowHistory>
      </v-flex>
    </v-layout>
    <h1 v-show="false">{{changeId}}</h1>
  </div>

</template>

<script>
import DocFileEditField from './DocFileEditField'
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
import JxMobilinkChecklist from '@/components/task/mobilink_checklist.vue'
import JxMobilinkTextForwarding from '@/components/docfile/textForwarding.vue'

export default {
  props: {
    id: 0
  },
  components: {
    DocFileEditField,
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
    JxMobilinkChecklist,
    JxMobilinkTextForwarding
  },
  data () {
    return {
      titleName: 'CHI TIET Hoat dong',
      current_user_name: 'MRX',
      docFile: {},
      optionsAlbum: {},
      isReadly: false,
      notificationShared: true,
      resourceUserModel: [],
      resourceUserItems: []
    }
  },
  computed: {
    title () {
      return this.titleName
    },
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
      return this.$route.params.id || this.$route.query.id
    },
    showBackBtn () {
      return this.$route.params.token
    },
    docFileMapWorkspaces () {
      const docFile = this.docFile
      let rs = docFile
      let ws = []
      if (docFile.workspaces && docFile.workspaces.length) {
        ws = docFile.workspaces
      } else if (docFile.workspaces && !docFile.workspaces.length) {
        ws = [docFile.workspaces]
      }
      rs.workspaces = ws.map(item => {
        item.workspaceName = item.name
        return item
      })
      return rs
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
              if (vm.docFile.permission === 'owner') {
                vm.resourceUserItems[key].right = 5
              } else if (vm.docFile.permission === 'write') {
                vm.resourceUserItems[key].right = 1
              } else if (vm.docFile.permission === 'read') {
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
        params.append('className', vm.docFileClassName)
        params.append('classPK', vm.docFile.docFileId)
        params.append('userClass', 'employee')
        window.axios.post(vm.end_point + 'resourceusers/pack',
          params,
          config)
          .then(function (response) {
            vm.notificationShared = false
            vm.$refs.docfileShared._initInvitedUser_1()
          })
          .catch(function (error) {
            console.log(error)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      } else {
        window.axios.delete(vm.end_point + 'resourceusers/' + vm.docFileClassName + '/' + vm.docFile.docFileId + '/' + vm.user_id,
          config)
          .then(function (response) {
            vm.notificationShared = true
            vm.$refs.docfileShared._initInvitedUser_1()
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
      window.axios.put(vm.end_point + 'docfiles/' + vm.docFile.docFileId,
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
    removeActivity (docFile) {
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
          vm.$store.dispatch('deleteActivity', docFile).then(response => {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageToastr('success', 'Xóa dữ liệu thành công')
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
    goToDetailTask (docFile) {
      window.open(window.themeDisplay.getCDNBaseURL() + '/group/guest/docFile/-/detail/' + docFile.docFileId)
    },
    goToDetail (docFile) {
      this.$router.push('/detail/' + docFile.docFileId)
    },
    initDetail () {
      this.$nextTick(() => {
        let vm = this
        if (!(vm.$route.params.id || this.$route.query.id)) {
          return
        }
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Đang tải dữ liệu...'
        })
        vm.$store.dispatch('docFile/readDocFile', vm.$route.params.id || this.$route.query.id
        ).then(response => {
          let docFile = response
          let checkPermission = 'owner,leader,hoster,manager,writer,read'.indexOf(docFile.permission || 'none') >= 0
          if (checkPermission) {
            vm.docFile = docFile
            vm.isReadly = true
          } else {
            vm.$router.push('/noprmission')
          }
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
        }, error => {
          console.log(error)
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          vm.$router.push('/noprmission')
        })
      })
    },
    backToList () {
      if (this.$route.params.id) {
        this.$router.back()
      } else {
        this.$router.replace({
          query: {}
        })
      }
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
  }
}
</script>

<style type="text/css">
  body .notiClass {
    color: #0091ea!important;
    font-size: 25px!important;
  }
</style>