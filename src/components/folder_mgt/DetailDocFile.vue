<template>
  <!-- Main content -->
  <v-app id="inspire">
    <main>
      <section class="content">
        <div class="fullwidth" >
          <v-layout wrap v-if="isReadly && docFile.docFileId > 0">
            <v-flex xs9>

              <div class="layout mb-2 align-center">
                <v-btn v-if="!showBackBtn"
                  outline @click="backToList" color="primary" small class="ma-0">
                  <v-icon left>reply</v-icon>
                  {{translate('quay_lai')}}
                </v-btn>
                <v-spacer></v-spacer>
              </div>
              <DocFileEditField class="mb-2"
                :id="docFile.docFileId"
                :docFile="docFile"
                :class_name="docFileClassName"
                :class_pk="docFile.docFileId"
              >
              </DocFileEditField>

              <DocFileAttachFile  class="mb-2"
                :class_name="docFileClassName"
                :class_pk="docFile.docFileId"
                :permission="docFile.permission"
                >
              </DocFileAttachFile>

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
              ></JxMobilinkShared>
              <JxMobilinkVoting class="mb-2"
                :class_name="docFileClassName"
                :class_pk="docFile.docFileId"
                expanded="true"
                voting-title="Lấy ý kiến thống nhất"
                voting_api="votings"
                :permission="docFile.permission"
                :user_id="user_id"
              ></JxMobilinkVoting>
            </v-flex>
          </v-layout>
          <h1 v-show="false">{{changeId}}</h1>
        </div>
      </section>
    </main>
  </v-app>
  <!-- /.content -->

</template>

<script>
import DocFileAttachFile from './DocFileAttachFile'
import DocFileEditField from './DocFileEditField'
import JxMobilinkComment from '@/components/task/mobilink_comment.vue'
import JxMobilinkVoting from '@/components/task/mobilink_voting.vue'
import JxMobilinkShared from '@/components/task/mobilink_shared.vue'

export default {
  props: {
    id: 0
  },
  components: {
    DocFileAttachFile,
    DocFileEditField,
    JxMobilinkComment,
    JxMobilinkVoting,
    JxMobilinkShared
  },
  data () {
    return {
      titleName: 'CHI TIET Hoat dong',
      current_user_name: 'MRX',
      docFile: {},
      isReadly: false
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
      return (this.$route.params.id || this.id)
    },
    showBackBtn () {
      return this.$route.params.token
    }
  },
  methods: {
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
    initDetail () {
      this.$nextTick(() => {
        let vm = this
        let url = vm.end_point + 'docfiles/' + (this.$route.params.id || this.id)
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
            let docFile = response.data
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
          })
          .catch(function (error) {
            console.log(error)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          })
      })
    },
    backToList () {
      if (this.id) {
        this.$emit('showDetailDocFile', false)
      } else {
        this.$router.back()
      }
    }
  },
  mounted () {
    this.$store.dispatch('loadContacts')
  },
  destroyed () {
    // delete this.id
    // delete this.titleName
    // delete this.current_user_name
    // delete this.docFile
    // delete this.isReadly
    // delete this.title
    // delete this.contacts
    // delete this.changeId
    // delete this.showBackBtn
    // delete this.changeState
    // delete this.initComment
    // delete this.initDetail
    // delete this.backToList
  }
}
</script>