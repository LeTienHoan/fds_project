<template>
    <div v-if="componentActive">
      <mbl-expand-panel
        :leftactions="[
          {
            icon: 'bookmark_border'
          }
        ]"
        :ownExpanded= "ownExpanded"
        :showheader=showExpandHeader
      >
      <template slot="title-name">
          Thảo luận
      </template>
      <template slot="card-text-container">
        <v-layout wrap class="comments__container">
          <v-flex sm12>
            <div id="mobilink-comments-container"></div>
            <div v-if="hidden__text"><span class="see__more primary--text" @click="changeSeemoreStatus" v-if="less">Xem thêm</span></div>
            <div v-if="hidden__text"><span class="see__less primary--text" @click="changeSeemoreStatus" v-if="!less">Rút gọn</span></div>
          </v-flex>
        </v-layout>
      </template>
      </mbl-expand-panel>
    </div>
</template>

<script>
import moment from 'moment'
const COMPONENT_NAME = 'jx-mobilink-comment'

export default {
  name: COMPONENT_NAME,
  components: {
  },
  props: {
    showExpandHeader: {
      type: Boolean,
      default: true
    },
    class_pk: null,
    class_name: null,
    start_end: null,
    activity_type: null,
    textareaRows: {
      type: Number,
      default: 1
    },
    enableAttachments: {
      type: Boolean,
      default: true
    },
    enableHashtags: {
      type: Boolean,
      default: true
    },
    enablePinging: {
      type: Boolean,
      default: true
    },
    postCommentOnEnter: {
      type: Boolean,
      default: false
    },
    forceResponsive: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    newestText: {
      type: String,
      default: 'Mới nhất'
    },
    oldestText: {
      type: String,
      default: 'Cũ nhất'
    },
    popularText: {
      type: String,
      default: 'Phổ biến'
    },
    attachmentsText: {
      type: String,
      default: 'Đính kèm'
    },
    sendText: {
      type: String,
      default: 'Gửi'
    },
    replyText: {
      type: String,
      default: 'Trả lời'
    },
    editText: {
      type: String,
      default: 'Sửa'
    },
    editedText: {
      type: String,
      default: 'Đã sửa'
    },
    youText: {
      type: String,
      default: 'Bạn'
    },
    saveText: {
      type: String,
      default: 'Ghi lại'
    },
    deleteText: {
      type: String,
      default: 'Xóa'
    },
    viewAllRepliesText: {
      type: String,
      default: 'Xem tất cả câu trả lời'
    },
    hideRepliesText: {
      type: String,
      default: 'Ẩn câu trả lời'
    },
    noCommentsText: {
      type: String,
      default: 'Không có bình luận nào'
    },
    noAttachmentsText: {
      type: String,
      default: 'Không có tệp đính kèm'
    },
    attachmentDropText: {
      type: String,
      default: 'Kéo thả tệp đính kèm'
    },
    id: {
      type: String,
      default: 'commentId'
    },
    parent: {
      type: String,
      default: 'parent'
    },
    userId: {
      type: String,
      default: 'userId'
    },
    created: {
      type: String,
      default: 'createdDate'
    },
    modified: {
      type: String,
      default: 'modifiedDate'
    },
    content: {
      type: String,
      default: 'content'
    },
    fileURL: {
      type: String,
      default: 'fileUrl'
    },
    fileMimeType: {
      type: String,
      default: 'fileType'
    },
    fileName: {
      type: String,
      default: 'fileName'
    },
    pings: {
      type: String,
      default: 'pings'
    },
    pingName: {
      type: String,
      default: 'pingName'
    },
    creator: {
      type: String,
      default: 'userId'
    },
    fullname: {
      type: String,
      default: 'fullname'
    },
    profileURL: {
      type: String,
      default: 'profileUrl'
    },
    profilePictureURL: {
      type: String,
      default: '/image/user_male_portrait'
    },
    isNew: {
      type: String,
      default: 'isNew'
    },
    createdByAdmin: {
      type: String,
      default: 'isAdmin'
    },
    createdByCurrentUser: {
      type: String,
      default: 'createdByCurrentUser'
    },
    upvoteCount: {
      type: String,
      default: 'upvoteCount'
    },
    userHasUpvoted: {
      type: String,
      default: 'userHasUpvoted'
    },
    email: {
      type: String,
      default: 'email'
    },
    className: {
      type: String,
      default: 'className'
    },
    classPK: {
      type: String,
      default: 'classPK'
    },
    comments_api: '',
    contacts: {
      type: Array,
      default: () => []
    },
    full_name: {
      type: String,
      default: ''
    }
  },
  created () {
    let vm = this
    vm.componentActive = true
    vm.$nextTick(function () {
      vm.expanded = false
      this.initPrevewConfig()
      vm.$emit('init-comment', vm.prevewConfig)
    })
  },
  destroyed () {
    window.$('#mobilink-comments-container').remove()
    // this.componentActive = false
    // delete this.class_pk
    // delete this.class_name
    // delete this.start_end
    // delete this.activity_type
    // delete this.textareaRows
    // delete this.enableAttachments
    // delete this.enableHashtags
    // delete this.enablePinging
    // delete this.postCommentOnEnter
    // delete this.forceResponsive
    // delete this.readOnly
    // delete this.newestText
    // delete this.oldestText
    // delete this.popularText
    // delete this.attachmentsText
    // delete this.sendText
    // delete this.replyText
    // delete this.editText
    // delete this.editedText
    // delete this.youText
    // delete this.saveText
    // delete this.deleteText
    // delete this.viewAllRepliesText
    // delete this.hideRepliesText
    // delete this.noCommentsText
    // delete this.noAttachmentsText
    // delete this.attachmentDropText
    // delete this.id
    // delete this.parent
    // delete this.userId
    // delete this.created
    // delete this.modified
    // delete this.content
    // delete this.fileURL
    // delete this.fileMimeType
    // delete this.fileName
    // delete this.pings
    // delete this.pingName
    // delete this.creator
    // delete this.fullname
    // delete this.profileURL
    // delete this.profilePictureURL
    // delete this.isNew
    // delete this.createdByAdmin
    // delete this.createdByCurrentUser
    // delete this.upvoteCount
    // delete this.userHasUpvoted
    // delete this.email
    // delete this.className
    // delete this.classPK
    // delete this.comments_api
    // delete this.contacts
    // delete this.full_name
    // delete this.title
    // delete this.prevewConfig
    // delete this.users
    // delete this.comment
    // delete this.less
    // delete this.hidden__text
    // delete this.expanded
    // delete this.ownExpanded
    // delete this.newCommentsId
    // delete this.changeSeemoreStatus
    // delete this.checkSeemoreStatus
    // delete this.initPrevewConfig
    // delete this.formatComment
  },
  watch: {
    class_pk (val) {
      let vm = this
      vm.initPrevewConfig()
      vm.$emit('init-comment', vm.prevewConfig)
    },
    contacts (val) {
      this.$emit('init-comment', this.prevewConfig)
    }
  },
  data () {
    return {
      title: this.translate('trao_doi_thao_luan'),
      prevewConfig: {},
      users: this.contacts,
      comment: {
      },
      less: true,
      hidden__text: false,
      expanded: true,
      ownExpanded: true,
      newCommentsId: [],
      componentActive: false
    }
  },
  methods: {
    changeSeemoreStatus: function () {
      let vm = this
      vm.less = !vm.less
      window.$('.comments__container .data-container').animate({scrollTop: 0}, 100)
      if (vm.less === false) {
        window.$('.comments__container .data-container').css({height: '300px', overflow: 'auto'})
      } else {
        window.$('.comments__container .data-container').css({'height': '150px', 'overflow': 'hidden'})
      }
    },
    checkSeemoreStatus: function () {
      let vm = this
      setTimeout(function () {
        window.$('.comments__container .data-container').css({'height': 'auto', 'overflow': 'hidden'})
        if (window.$('.comments__container .data-container').height() > 150) {
          if (vm.less === true) {
            window.$('.comments__container .data-container').css({'height': '150px', 'overflow': 'hidden'})
          } else {
            window.$('.comments__container .data-container').css({'height': '300px', 'overflow': 'auto'})
          }
          vm.hidden__text = true
        } else {
          window.$('.comments__container .data-container').css({'height': 'auto'})
          vm.hidden__text = false
        }
      }, 1000)
    },
    initPrevewConfig: function () {
      let vm = this
      const config = {
        headers: {
          groupId: vm.group_id
        }
      }
      vm.users = vm.contacts
      vm.prevewConfig = {
        profilePictureURL: vm.profilePictureURL,
        textareaRows: vm.textareaRows,
        enableAttachments: vm.enableAttachments,
        enableHashtags: vm.enableHashtags,
        enablePinging: vm.enablePinging,
        postCommentOnEnter: vm.postCommentOnEnter,
        forceResponsive: vm.forceResponsive,
        readOnly: vm.readOnly,
        newestText: vm.newestText,
        oldestText: vm.oldestText,
        popularText: vm.popularText,
        attachmentsText: vm.attachmentsText,
        sendText: vm.sendText,
        replyText: vm.replyText,
        editText: vm.editText,
        editedText: vm.editedText,
        youText: vm.youText,
        saveText: vm.saveText,
        deleteText: vm.deleteText,
        viewAllRepliesText: vm.viewAllRepliesText,
        hideRepliesText: vm.hideRepliesText,
        noCommentsText: vm.noCommentsText,
        noAttachmentsText: vm.noAttachmentsText,
        attachmentDropText: vm.attachmentDropText,
        fieldMappings: {
          id: 'commentId',
          parent: 'parent',
          userId: 'userId',
          created: 'createdDate',
          modified: 'modifiedDate',
          content: 'content',
          fileURL: 'fileUrl',
          fileMimeType: 'fileType',
          fileName: 'fileName',
          pings: 'pings',
          pingName: 'pingName',
          creator: 'userId',
          fullname: 'fullName',
          profileURL: 'profileUrl',
          /** profilePictureURL: 'pictureUrl', */
          profilePictureURL: 'profileUrl',
          isNew: 'isNew',
          createdByAdmin: 'isAdmin',
          createdByCurrentUser: 'createdByCurrentUser',
          upvoteCount: 'upvoteCount',
          userHasUpvoted: 'userHasUpvoted',
          email: 'email',
          opinion: 'opinion',
          className: 'className',
          classPK: 'classPK'
        },
        timeFormatter: function (time) {
          if (time !== null) {
            return window.moment(time).format('HH:mm DD/MM/YYYY')
          }
          return ''
        },
        getUsers: function (onSuccess, onError) {
          onSuccess(vm.contacts)
          /* onError() */
        },
        getComments: function (onSuccess, onError) {
          let url = vm.end_point + vm.comments_api + '/' + vm.class_name + '/' + vm.class_pk + '?opinion='
          let config = {
            headers: {
              'groupId': vm.group_id
            },
            params: {
              start: -1,
              end: -1
            }
          }
          window.axios.get(url, config).then(function (response) {
            let data = []
            if (response.hasOwnProperty('data')) {
              let serializable = response.data.data
              for (var key in serializable) {
                vm.comment = serializable[key]
                vm.formatComment(vm.comment)
                data.push(vm.comment)
              }
              onSuccess(data)
            }
            vm.$emit('countComments', data.length)
            vm.checkSeemoreStatus()
          })
            .catch(function (error) {
              console.log(error)
              onSuccess([])
            })
        },
        appendNewComments: function (commentJSONs, onSuccess, onError) {
          let commentById = {}
          let oldCommentsId = commentJSONs.map(function (c) {
            c.code = c.id + '' + c.userHasUpvoted + '' + c.upvoteCount + '' + c.content
            commentById[c.id] = c
            return c.id
          })
          oldCommentsId = oldCommentsId.concat(vm.newCommentsId.filter(function (item) {
            return oldCommentsId.indexOf(item) < 0
          }))
          vm.newCommentsId = []
          let url = vm.end_point + vm.comments_api + '/' + vm.class_name + '/' + vm.class_pk + '?start=0&end=10&sort=modified_Number&order=true&opinion='
          window.axios.get(url, config).then(function (response) {
            let data = []
            let dataEdited = []
            if (response.hasOwnProperty('data')) {
              let serializable = response.data.data
              let curId = 0
              let code = ''
              for (var key in serializable) {
                vm.comment = serializable[key]
                curId = vm.comment['commentId']
                code = vm.comment['commentId'] + '' + vm.comment['userHasUpvoted'] + '' + vm.comment['upvoteCount'] + '' + vm.comment['content']
                vm.formatComment(vm.comment)
                /** check return if not exist */
                if (oldCommentsId.indexOf(curId) === -1) {
                  data.push(vm.comment)
                  vm.checkSeemoreStatus()
                } else if (code !== commentById[curId].code) {
                  /** if have changed */
                  dataEdited.push(vm.comment)
                  vm.checkSeemoreStatus()
                }
                delete commentById[curId]
              }
              onSuccess(data, dataEdited, commentById)
            }
            vm.$emit('countComments', data.length + commentJSONs.length)
          })
            .catch(function (error) {
              console.log(error)
            })
        },
        postComment: function (data, onSuccess, onError) {
          const config = {
            headers: {
              groupId: vm.group_id
            }
          }
          let strPings = data.pings.join()
          let strPingName = data.pingName.join()
          let params = new URLSearchParams()
          params.append('className', vm.class_name)
          params.append('classPK', vm.class_pk)
          params.append('parent', data.parent !== null ? data.parent : 0)
          params.append('pings', strPings)
          params.append('pingName', strPingName)
          params.append('content', data.content)
          params.append('upvoteCount', data.upvoteCount !== null ? data.upvoteCount : 0)
          params.append('email', vm.$store.guestEmail || vm.user_id)
          params.append('opinion', document.getElementById('opinion').checked)
          window.axios.post(vm.end_point + vm.comments_api,
            params,
            config
          )
            .then(function (response) {
              if (response !== null) {
                if (response.data.opinion) {
                  window.$('.opinion').hide()
                }
                document.getElementById('opinion').checked = false
                vm.comment = response.data
                vm.formatComment(vm.comment)
                vm.newCommentsId.push(vm.comment.commentId)
                onSuccess(vm.comment)
              } else {
                onSuccess([])
              }
              vm.checkSeemoreStatus()
              vm.$emit('countCommentsIncrease', 1)
            })
            .catch(function (error) {
              onError()
              console.log(error)
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
        },
        putComment: function (data, onSuccess, onError) {
          const config = {
            headers: {
              groupId: vm.group_id
            }
          }
          let strPings = data.pings.join()
          let strPingName = data.pingName.join()
          let params = new URLSearchParams()
          params.append('className', vm.class_name)
          params.append('classPK', vm.class_pk)
          params.append('parent', data.parent !== null ? data.parent : 0)
          params.append('pings', strPings)
          params.append('pingName', strPingName)
          params.append('content', data.content)
          params.append('upvoteCount', data.upvoteCount !== null ? data.upvoteCount : 0)
          params.append('email', vm.$store.guestEmail || vm.user_id)
          window.axios.put(vm.end_point + vm.comments_api + '/' + data.commentId,
            params,
            config
          )
            .then(function (response) {
              vm.checkSeemoreStatus()
              if (response !== null) {
                vm.comment = response.data
                vm.formatComment(vm.comment)
                onSuccess(vm.comment)
              } else {
                onSuccess([])
              }
            })
            .catch(function (error) {
              window.showMessageByAPICode(error.response.status, error.response.data)
              console.log(error)
            })
        },
        deleteComment: function (data, onSuccess, onError) {
          const config = {
            headers: {
              groupId: vm.group_id
            }
          }
          // let params = new URLSearchParams()
          // params.append('email', vm.$store.guestEmail || vm.user_id)
          vm.$store.dispatch('loading/setLoading', {
            loading: true,
            message: 'Xóa dữ liệu...'
          })
          window.axios.delete(vm.end_point + vm.comments_api + '/' + data.commentId, config).then(function (response) {
            vm.checkSeemoreStatus()
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            vm.$emit('countCommentsIncrease', -1)
            window.showMessageToastr('success', 'Đã xóa bình luận')
            onSuccess()
          })
            .catch(function (error) {
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              window.showMessageByAPICode(error.response.status, error.response.data)
              console.log(error)
            })
        },
        upvoteComment: function (data, onSuccess, onError) {
          const config = {
            headers: {
              groupId: vm.group_id
            }
          }
          if (data.userHasUpvoted) {
            let params = new URLSearchParams()
            params.append('className', vm.class_name)
            params.append('classPK', vm.class_pk)
            params.append('commentId', data.commentId)
            params.append('upvoteCount', data.upvoteCount !== null ? data.upvoteCount : 0)
            params.append('email', vm.$store.guestEmail || vm.user_id)
            window.axios.put(vm.end_point + vm.comments_api + '/' + data.commentId + '/upvotes',
              params,
              config
            )
              .then(function (response) {
                if (response !== null) {
                  vm.comment = response.data
                  vm.formatComment(vm.comment)
                  onSuccess(vm.comment)
                } else {
                  onSuccess([])
                }
              })
              .catch(function (error) {
                window.showMessageByAPICode(error.response.status, error.response.data)
                console.log(error)
              })
          } else {
            vm.$store.dispatch('loading/setLoading', {
              loading: true,
              message: 'Cập nhật dữ liệu...'
            })
            window.axios.delete(vm.end_point + vm.comments_api + '/' + data.commentId + '/upvotes', config).then(function (response) {
              vm.comment = response.data
              vm.formatComment(vm.comment)
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
              onSuccess(vm.comment)
            })
              .catch(function (error) {
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageByAPICode(error.response.status, error.response.data)
                console.log(error)
              })
          }
        },
        uploadAttachments: function (comments, onSuccess, onError) {
          let responses = 0
          let successfulUploads = []
          let serverResponded = function () {
            responses++
            if (responses === comments.length) {
              if (successfulUploads.length === 0) {
                onError()
              } else {
                onSuccess(successfulUploads)
              }
            }
          }
          window.$(comments).each(function (index, comment) {
            let formData = new FormData()
            formData.append('file', comment.file)
            formData.append('className', vm.class_name)
            formData.append('classPK', vm.class_pk)
            formData.append('parent', comment.parent !== null ? comment.parent : 0)
            formData.append('fileName', comment.file.name)
            formData.append('fileType', comment.file.type)
            formData.append('fileSize', comment.file.size)
            formData.append('pings', comment.pings.join())
            formData.append('pingName', comment.pingName.join())
            formData.append('email', vm.$store.guestEmail || vm.user_id)
            formData.append('fullName', vm.full_name)
            formData.append('opinion', document.getElementById('opinion').checked)
            window.$.ajax({
              url: vm.end_point + 'comments/uploads',
              dataType: 'json',
              type: 'POST',
              headers: {
                groupId: vm.group_id,
                Authorization: vm.$store.guestToken
              },
              data: formData,
              cache: false,
              contentType: false,
              processData: false,
              success: function (comment) {
                if (comment.opinion) {
                  window.$('.opinion').hide()
                }
                document.getElementById('opinion').checked = false
                vm.formatComment(comment)
                successfulUploads.push(vm.comment)
                serverResponded()
                if (comment.opinion) {
                  window.$('.opinion').hide()
                }
                document.getElementById('opinion').checked = false
                vm.$emit('countCommentsIncrease', 1)
              },
              error: function (xhr, data) {
                serverResponded()
              }
            })
          })
        }
      }
    },
    formatComment: function (comment) {
      let vm = this
      vm.comment = comment
      if (comment.parent === 0) {
        vm.comment.parent = null
      }
      if (comment.fileName === '') {
        vm.comment.fileName = null
      }
      if (comment.fileType === '') {
        vm.comment.fileType = null
      }
      if (comment.fileUrl === '') {
        vm.comment.fileUrl = null
      }
      if (comment.pictureUrl === '') {
        vm.comment.pictureUrl = null
      }
      if (comment.profileUrl === '') {
        vm.comment.profileUrl = '/image/user_male_portrait'
      }
      vm.comment.fullname = comment.fullName
      let pings = comment.pings
      let pingName = comment.pingName
      vm.comment.pings = pings.toString().split(',')
      vm.comment.pingName = pingName.toString().split(',')
      vm.comment.createdDate = moment(vm.comment.createDate).format('YYYY-MM-DD HH:mm')
      vm.comment.modifiedDate = moment(vm.comment.modifiedDate).format('YYYY-MM-DD HH:mm')
    }
  }
}
</script>

<style>
  .comments__container .see__more, .comments__container .see__less{
    float: right;
    margin-left: auto;
    cursor: pointer;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .comments__container .data-container{
    height: auto;
  }


  .comments__container .data-container::-webkit-scrollbar-track
  {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      border-radius: 8px;
      background-color: #F5F5F5;
  }

  .comments__container .data-container::-webkit-scrollbar
  {
      width: 8px;
      background-color: #F5F5F5;
  }

  .comments__container .data-container::-webkit-scrollbar-thumb
  {
      border-radius: 8px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      background-color: rgb(181, 181, 181);
  }
</style>
