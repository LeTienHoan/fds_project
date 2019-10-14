<template>
  <div>
    <mbl-expand-panel
      :leftactions="[
        {
          icon: 'bookmark_border'
        }
      ]"
      :rightactions="rightactions"
      :ownExpanded= 'ownExpanded'
      @callback2="callback2(activity)"
    >
      <template slot="title-name">
        <span v-if="activity.activityType == 'TASK'">Ghi chú kết quả</span>
        <span v-if="activity.activityType == 'EVENT'">Ghi chép cuộc họp</span>
      </template>
      <template slot="card-text-container">
        <div>
          <v-layout wrap v-if="activity.resultNote.length == 0 && resultnote_hidden">
            <v-flex xs12 class="text-xs-center" style="color: #ccc">
              <v-icon style="font-size: 26px!important">edit</v-icon>
              <br>
              Không có ghi chú nào
            </v-flex>
          </v-layout>
          <v-layout row wrap class="mx-0">
              <vue-editor 
                  v-if="resultnote_hidden && activity.resultNote.length>0"
                  v-model="activity.resultNote"
                  style="width: 100%!important;"
                  class="editable__content__value pt-0 resultNoteClass"
                  disabled
              >
              </vue-editor>
              <div class="flex xs12">
                <span class="xemthem sub-text"  @click="clickXemthem" v-if="clickRutgon && resultnote_hidden && activity.resultNote.length>0 && hidden_xemthem">
                    Xem thêm
                </span>
                <span class="xemthem sub-text" @click="clickXemthem" v-if="!clickRutgon && resultnote_hidden && activity.resultNote.length>0 && hidden_xemthem">
                    Rút gọn
                </span>
              </div>
              <vue-editor 
                  v-if="!resultnote_hidden && ( activity.permission == 'owner' || activity.permission == 'manager'|| activity.permission==   'hoster'||activity.permission=='leader' || activity.permission == 'write')"
                  v-model="activity.resultNote"
                  style="width: 100%!important"
                  class="resultNoteClassEdit"
                  >
              </vue-editor>
              <v-flex>
                  <v-btn small class="primary mx-0" style="min-width: 0px"
                      v-if="!resultnote_hidden && ( activity.permission == 'owner' || activity.permission == 'manager'|| activity.permission== 'hoster'||activity.permission=='leader'|| activity.permission == 'write')" 
                      @click.stop.prevent="resultnoteUpdate(activity)" 
                      :loading="resultnote_hidden_loading" 
                      :disabled="resultnote_hidden_loading">Lưu
                   </v-btn>
                   <v-btn small class="primary" style="min-width: 0px"
                      v-if="!resultnote_hidden && ( activity.permission == 'owner' || activity.permission == 'manager'|| activity.permission== 'hoster'||activity.permission=='leader'|| activity.permission == 'write')"
                      @click.stop.prevent="resultnoteBack(activity)" 
                      :loading="resultnote_hidden_loading" 
                      :disabled="resultnote_hidden_loading">Đóng
                  </v-btn>
              </v-flex>
          </v-layout>
        </div>
      </template>
    </mbl-expand-panel>

  </div>
  
</template>


<script>
const COMPONENT_NAME = 'jx-mobilink-activity-resultnote'
export default {
  name: COMPONENT_NAME,
  components: {
  },
  props: {
    activity: {
      default: {}
    },
    class_pk: null,
    class_name: null
  },
  watch: {
    id (val) {
    }
  },
  data () {
    return {
      tempData6: '',
      resultnote_hidden: true,
      resultnote_hidden_loading: false,
      clickRutgon: true,
      hidden_xemthem: true,
      ownExpanded: true,
      rightactions: [
        {
          icon: 'create',
          action: 'callback2',
          text: 'Cập nhật ghi chú'
        }
      ]
    }
  },
  created () {
    let vm = this
    this.$nextTick(function () {
      if (vm.activity.permission === 'read') {
        vm.rightactions = []
      }
      vm.setHeight()
    })
  },
  destroyed () {
    // delete this.activity
    // delete this.class_pk
    // delete this.class_name
    // delete this.tempData6
    // delete this.resultnote_hidden
    // delete this.resultnote_hidden_loading
    // delete this.clickRutgon
    // delete this.hidden_xemthem
    // delete this.ownExpanded
    // delete this.rightactions
    // delete this.setHeight
    // delete this.clickXemthem
    // delete this.callback2
    // delete this.resultnoteBack
    // delete this.resultnoteUpdate
  },
  methods: {
    setHeight: function () {
      let vm = this
      setTimeout(function () {
        window.$('.ql-editor').css({'height': 'auto', 'overflow': 'hidden'})
        if (window.$('.ql-editor').height() <= 400) {
          window.$('.ql-editor').css({'height': 'auto'})
          vm.hidden_xemthem = false
        } else {
          window.$('.ql-editor').css({'height': '400px'})
          vm.hidden_xemthem = true
          vm.clickRutgon = true
        }
      }, 1000)
    },
    clickXemthem: function () {
      let vm = this
      vm.clickRutgon = !vm.clickRutgon
      window.$('.resultNoteClass .ql-editor').animate({scrollTop: 0}, 100)
      if (vm.clickRutgon === true) {
        window.$('.resultNoteClass .ql-editor').css({'height': '400px', 'overflow': 'hidden'})
      } else {
        window.$('.resultNoteClass .ql-editor').css({'overflow': 'auto', 'height': '600px'})
      }
    },
    callback2: function (data) {
      let vm = this
      vm.tempData6 = data.resultNote
      vm.ownExpanded = true
      vm.resultnote_hidden = false
    },
    resultnoteBack: function (data) {
      let vm = this
      data.resultNote = this.tempData6
      setTimeout(function () {
        window.$('.ql-editor').css({'height': 'auto', 'overflow': 'hidden'})
        if (window.$('.ql-editor').height() <= 400) {
          window.$('.ql-editor').css({'height': 'auto'})
          vm.hidden_xemthem = false
        } else {
          window.$('.ql-editor').css({'height': '400px'})
          vm.hidden_xemthem = true
          vm.clickRutgon = true
        }
      }, 200)
      this.resultnote_hidden = !this.resultnote_hidden
    },
    resultnoteUpdate: function (item) {
      let vm = this
      let dataToAPI = new URLSearchParams()
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      dataToAPI.append('resultNote', item.resultNote)
      vm.$store.dispatch('loading/setLoading', {
        loading: true,
        message: 'Cập nhật dữ liệu...'
      })
      let url = vm.end_point + 'activities/' + item.activityId
      window.axios.put(url, dataToAPI, config).then(function (response) {
        vm.tempData6 = response.data.resultNote
        vm.$store.dispatch('loading/setLoading', {
          loading: false
        })
        setTimeout(function () {
          window.$('.ql-editor').css({'height': 'auto', 'overflow': 'hidden'})
          if (window.$('.ql-editor').height() <= 400) {
            window.$('.ql-editor').css({'height': 'auto'})
            vm.hidden_xemthem = false
          } else {
            window.$('.ql-editor').css({'height': '400px'})
            vm.hidden_xemthem = true
            vm.clickRutgon = true
          }
        }, 200)
        vm.resultnote_hidden = !vm.resultnote_hidden
        window.showMessageToastr('success', 'Cập nhật thành công')
      })
        .catch(function (error) {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          console.log(error)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    }
  }
}
</script>

<style >
    .resultNoteClass p{
            margin: 0;
      }
      .resultNoteClass .ql-toolbar{
          display: none;
      }
      .resultNoteClass .ql-container{
          border: 0;
      }
      .resultNoteClass .ql-editor{
          min-height: 10px;
          padding-top: 0;
          padding-bottom: 0;
          height: 400px;
          overflow: hidden;
          font-size: 13px;
      }
      .resultNoteClassEdit .ql-editor{
            height: 400px!important;
            overflow: auto!important;
            font-size: 13px!important;
        }
        .resultNoteClassEdit .ql-container{
            height: 400px;
        }
        .resultWidth{
            max-width: 100%;
        }
        .xemthem,.rutgon{
        float: right;
        margin-left: auto;
        cursor: pointer;
      }
    .resultNoteClass .ql-editor::-webkit-scrollbar-track,.resultNoteClassEdit .ql-editor::-webkit-scrollbar-track{
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 8px;
        background-color: #F5F5F5;
    }
    .resultNoteClass .ql-editor::-webkit-scrollbar,.resultNoteClassEdit .ql-editor::-webkit-scrollbar
    {
        width: 8px;
        background-color: #F5F5F5;
    }
    .resultNoteClass .ql-editor::-webkit-scrollbar-thumb,.resultNoteClassEdit .ql-editor::-webkit-scrollbar-thumb
    {
        border-radius: 8px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: rgb(181, 181, 181);
    }
</style>