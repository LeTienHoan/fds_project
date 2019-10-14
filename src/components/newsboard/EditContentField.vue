<template>
  <v-layout wrap class="newsboard-edit-content">

    <v-flex xs12 sm12 class="control_class">
      <div class="custome-editable-with-icon-newsboard">
        <div>
          <span v-if="description_hidden" class="hiddenEditor editable__content__value"
            :class="{'show-less': hasShowLess && isShowLess}"
          >
            <vue-editor
              id="newsBoardEditField1"
              v-model="tempNewsBoard.content"
              disabled
            >
            </vue-editor>
            <div v-if="tempNewsBoard.newsType ==='QNA' && tempNewsBoard.answer">
              <b class="grey--text"><i>Trả lời: </i></b>{{tempNewsBoard.answer || ''}}
            </div>
            <a
              class="right primary--text pr-2"
              v-if="hasShowLess"
              @click.stop="isShowLess = !isShowLess">
              {{ isShowLess ? 'Xem thêm' : 'Ẩn đi' }}
            </a>
          </span>
          <vue-editor
            id="newsBoardEditField2"
            class="flex sm12"
            v-model="tempNewsBoard.content"
            v-if="!description_hidden && hasPermission"
          >
          </vue-editor>
          <v-text-field
            v-if="!description_hidden && hasPermission && (tempNewsBoard.newsType ==='QNA')"
            placeholder="Trả lời"
            class="flex sm12"
            v-model="tempNewsBoard.answer"
          ></v-text-field>
        </div>
        <span> 
          <v-btn flat icon class="btn--editable btn--editable--done mx-0 my-0" color="grey darken-1"
            v-if="description_hidden && hasPermission"    
            @click.stop.prevent="descriptionTempleData(tempNewsBoard)" 
            :loading="description_hidden_loading" 
            :disabled="description_hidden_loading"
          >
            <v-icon>create</v-icon>
          </v-btn>
          <v-btn flat icon class="btn--editable btn--editable--done mx-0 my-0" color="success"
            v-if="!description_hidden && hasPermission"
            @click.stop.prevent="descriptionUpdateEvent(tempNewsBoard)" 
            :loading="description_hidden_loading" 
            :disabled="description_hidden_loading"
          >
            <v-icon>done</v-icon>
          </v-btn>
            
          <v-btn flat icon class="mx-0 my-0" color="red darken-3"
            v-if="!description_hidden && hasPermission"
            @click.stop.prevent="descriptionRolbackEvent(tempNewsBoard)" 
            :loading="description_hidden_loading" 
            :disabled="description_hidden_loading"
          >
            <v-icon color="red darken-3">clear</v-icon>
          </v-btn>
        </span>
      </div>
    </v-flex>
      
  </v-layout>

</template>


<script>
export default {
  props: {
    newsBoard: {
      default: []
    }
  },
  watch: {
    newsBoard (val) {
      this.tempNewsBoard = val
    }
  },
  computed: {
    hasPermission () {
      return this.tempNewsBoard.permission === 'owner' || this.tempNewsBoard.permission === 'leader'
    },
    hasShowLess () {
      return (this.tempNewsBoard.content || '').length > 1500
    }
  },
  data () {
    return {
      description_hidden: true,
      description_hidden_loading: false,
      tempData10: '',
      tempNewsBoard: {},
      resourceItems1: '',
      resourceItems2: '',
      isShowLess: true
    }
  },
  created () {
    this.$nextTick(function () {
      this.tempNewsBoard = this.newsBoard
    })
  },
  methods: {
    descriptionTempleData: function (data) {
      this.tempData10 = data.description
      this.description_hidden = !this.description_hidden
    },
    descriptionRolbackEvent: function (data) {
      data.description = this.tempData10
      this.clickRutgon_description = true
      this.description_hidden = !this.description_hidden
    },
    descriptionUpdateEvent: function (item) {
      let vm = this
      vm.description_hidden_loading = true
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      let dataToAPI = new URLSearchParams()
      dataToAPI.append('content', item.content)
      dataToAPI.append('answer', item.answer)
      let url = vm.end_point + 'newsboards/' + item.newsBoardId
      window.axios.put(url, dataToAPI, config).then(function (response) {
        vm.description_hidden = !vm.description_hidden
        vm.description_hidden_loading = false
        window.showMessageToastr('success', 'Cập nhật thành công')
      })
        .catch(function (error) {
          console.log(error)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    }
  }
}
</script>

<style type="text/css" scoped>

  .custome-editable-with-icon-newsboard {
      display: -webkit-flex; /* Safari */
      display: flex;
  }
  .custome-editable-with-icon-newsboard div {
     -webkit-flex: 1; /* Safari 6.1+ */
     flex: 1;
  }
  
</style>
<style>
  .hiddenEditor .ql-toolbar {
    display: none;
  }
  .hiddenEditor #quill-container{
    border: 0!important;
  }
  .hiddenEditor .ql-editor {
    padding-left: 0;
    padding-right: 0;
    min-height: 32px;
    font-family: 'Roboto',sans-serif;
    font-size: 13px;
  }
  .hiddenEditor .ql-container {
    font-family: 'Roboto',sans-serif;
    font-size: 13px;
  }
  .hiddenEditor .ql-container.ql-snow {
    border: 0;
  }
  .hiddenEditor td {
    padding: 0!important;
  }

  .show-less.hiddenEditor .ql-editor {
    height: 200px;
    overflow: hidden;
    font-family: 'Roboto',sans-serif;
    font-size: 13px;
  }
</style>
