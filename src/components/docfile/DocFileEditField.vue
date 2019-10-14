<template>
  <div>
    <mbl-expand-panel
      :leftactions="[
        {
          icon: 'bookmark_border'
        }
      ]"
      :ownExpanded=true
    >
      <template slot="title-name">
        <div class="layout flex">
          <custome-editable
            type="text"
            :text_options = "{
              text: tempDocFile.subject,
              multiline: false
            }"
            :api_update="end_point + 'docfiles/' + docFile.docFileId"
            key_update="subject"
            @update-success="updateEditableSuccess"
            :permission="tempDocFile.permission"
          >
          </custome-editable>
        </div>
      </template>
      <template slot="card-text-container">
        <v-layout wrap class="main-detail-info">
          <v-flex xs12>
            <v-layout wrap>
              <v-flex sm2 class="label_align">
                <!--{{translate(docFileOtherType ? 'thu_muc_luu_tru' : 'ho_so_luu_tru')}}-->
                {{translate('thu_muc')}}
              </v-flex>
              <v-flex md10>
                <custome-editable
                  class="control_class"
                  type="multiselect"
                  :multi_select_options = "{
                    usetemp: true,
                    api_get: end_point + 'workspaces/scope/docfile?start=-1&end=-1',
                    init_value: 'workspaceId',
                    init_text: 'workspaceName',
                    key_value: 'workspaceId',
                    key_text: 'name',
                    param_update_work: true,
                    class_name: docFileClassName,
                    class_pk: docFile.docFileId,
                    item_workspace: docFile.workspaces.length > 0 && docFile.workspaces[0].workspaceId != 0 ? docFile.workspaces : [],
                    resource: resourceItems2
                  }"
                  @get-resource="(val) => (resourceItems2 = val)"
                  :api_update="end_point + 'resourceworkspaces/update'"
                  :permission="tempDocFile.permission"
                >
                </custome-editable>
              </v-flex>

              <v-flex xs2 class="label_align" v-if="!docFileOtherType">
                {{translate('so_ky_hieu')}}
              </v-flex>
              <v-flex xs5 v-if="!docFileOtherType">
                <div class="custome-editable-with-icon-docfile">    
                  <div class="editable-text" v-if="codeNo_codeNotation_hidden" >{{ tempDocFile.codeNo + '/' + tempDocFile.codeNotation  }}</div>
                  
                  <v-text-field 
                    v-if="!codeNo_codeNotation_hidden && hasPermission"
                    v-model="tempDocFile.codeNo" autofocus
                    append-icon="remove"
                  ></v-text-field>
                  <v-text-field 
                    v-model="tempDocFile.codeNotation"
                    v-if="!codeNo_codeNotation_hidden && hasPermission"
                  ></v-text-field>

                  <v-btn flat icon color="grey darken-1" class="ma-0"
                    v-if="codeNo_codeNotation_hidden && hasPermission"
                    @click.stop.prevent="codeNo_codeNotation_hidden = !codeNo_codeNotation_hidden" 
                    :loading="codeNo_codeNotation_hidden_loading" 
                    :disabled="codeNo_codeNotation_hidden_loading">
                    <v-icon>create</v-icon>
                  </v-btn>
                  <v-btn flat icon color="success" class="ma-0"
                    v-if="!codeNo_codeNotation_hidden && hasPermission"
                    @click.stop.prevent="UpdateCodeNoCodeNotation()" 
                    :loading="codeNo_codeNotation_hidden_loading" 
                    :disabled="codeNo_codeNotation_hidden_loading">
                    <v-icon>done</v-icon>
                  </v-btn>
                  
                  <v-btn flat icon color="red darken-3" class="ma-0"
                    v-if="!codeNo_codeNotation_hidden && hasPermission"
                    @click.stop.prevent="codeNo_codeNotation_hidden = !codeNo_codeNotation_hidden" 
                    :loading="codeNo_codeNotation_hidden_loading" 
                    :disabled="codeNo_codeNotation_hidden_loading">
                    <v-icon>clear</v-icon>
                  </v-btn>
                </div>
              </v-flex>
              <v-flex xs2 class="label_align pl-3"  v-if="!docFileOtherType">
                {{translate('so_van_ban')}}
              </v-flex>
              <v-flex xs3  v-if="!docFileOtherType">
                <custome-editable
                  type="select"
                  :select_options = "{
                      usetemp: false,
                      api_get: end_point + 'docfiles?template=1&sort=subject&start=-1&end=-1',
                      init_value: tempDocFile.templateNo,
                      init_text: tempDocFile.templateNo || '',
                      key_value: 'templateNo',
                      key_text: 'templateNo'
                    }"
                  :api_update="end_point + 'docfiles/' + docFile.docFileId"
                  key_update="templateNo"
                  @update-success="updateEditableSuccess"
                  :permission="tempDocFile.permission"
                >
                </custome-editable>
                <!--
                <custome-editable
                  class="control_class"
                  type="text"
                  :text_options = "{
                    text: tempDocFile.templateNo,
                    multiline: false
                  }"
                  :api_update="end_point + 'docfiles/' + docFile.docFileId"
                  key_update="templateNo"
                  :permission="tempDocFile.permission"
                  @update-success="(val) => (tempDocFile = val)"
                >
                </custome-editable>
                
                <custome-editable
                  type="select"
                  :select_options = "{
                      usetemp: false,
                      api_get: end_point + 'docfiles?template=1&sort=subject',
                      init_value: tempDocFile.templateNo,
                      init_text: tempDocFile.templateNo,
                      key_value: 'templateNo',
                      key_text: 'templateNo'
                    }"
                  :api_update="end_point + 'docfiles/' + docFile.docFileId"
                  key_update="leaderId"
                  @update-success="updateEditableSuccess"
                  :permission="tempDocFile.permission"
                >
                </custome-editable>
                -->
              </v-flex>
              
              <v-flex xs2 class="label_align"  v-if="!docFileOtherType">
                {{translate('ngay_co_hieu_luc')}}
              </v-flex>
              <v-flex xs5  v-if="!docFileOtherType">
                <custome-editable
                  type="date"
                  :date_options="{
                      init_text: tempDocFile.promulgationDate,
                      init_value: tempDocFile.promulgationDate
                  }"
                  :api_update="end_point + 'docfiles/' + docFile.docFileId"
                  key_update="promulgationDate"
                  @update-success="updateEditableSuccess"
                  :permission="tempDocFile.permission"
                >
                </custome-editable>
              </v-flex>
              <v-flex xs2 class="label_align pl-3"  v-if="!docFileOtherType">
                {{tempDocFile.register === 1 ? translate('ngay_phat_hanh') : ''}}
                {{tempDocFile.register === 2 ? translate('ngay_den') : ''}}
                {{tempDocFile.register !== 1 && tempDocFile.register !== 2 ? translate('ngay_ban_hanh') : ''}}
              </v-flex>
              <v-flex xs3  v-if="!docFileOtherType">
                <custome-editable
                  type="date"
                  :date_options="{
                    init_text: tempDocFile.registerDate,
                    init_value: tempDocFile.registerDate,
                  }"
                  :show_day_left= true
                  :api_update="end_point + 'docfiles/' + docFile.docFileId"
                  key_update="registerDate"
                  @update-success="updateEditableSuccess"
                  :permission="tempDocFile.permission"
                >
                </custome-editable>
              </v-flex>

              <v-flex xs2 class="label_align"  v-if="!docFileOtherType">
                {{translate('nguoi_ky')}}
              </v-flex>
              <v-flex xs5  v-if="!docFileOtherType">
                  <custome-editable
                    class="control_class"
                    type="text"
                    :text_options = "{
                      text: tempDocFile.signerInfo,
                      multiline: false
                    }"
                    :api_update="end_point + 'docfiles/' + docFile.docFileId"
                    key_update="signerInfo"
                    :permission="tempDocFile.permission"
                    @update-success="(val) => (tempDocFile = val)"
                  >
                  </custome-editable>
              </v-flex>
              <v-flex xs2 class="label_align pl-3"  v-if="!docFileOtherType">
                {{translate('loai_van_ban')}}
              </v-flex>
              <v-flex xs3  v-if="!docFileOtherType">
                  <custome-editable
                    class="control_class"
                    type="select"
                    :select_options = "{
                      usetemp: false,
                      items: documentCatItems,
                      init_value: tempDocFile.documentCat,
                      init_text: tempDocFile.categoryName,
                      key_value: 'itemCode',
                      key_text: 'itemName',
                    }"
                    :api_update="end_point + 'docfiles/' + docFile.docFileId"
                    key_update="documentCat"
                    :permission="tempDocFile.permission"
                    @update-success="(val) => (tempDocFile = val)"
                  >
                  </custome-editable>
              </v-flex>
              <v-flex xs2 class="label_align"  v-if="!docFileOtherType">
                {{translate('co_quan_ban_hanh')}}
              </v-flex>
              <v-flex xs10  v-if="!docFileOtherType">
                  <custome-editable
                    class="control_class"
                    type="select"
                    :select_options = "{
                      usetemp: false,
                      api_get: end_point + 'dictcollections/GOVERMENT_AGENCY/dictitems?level=0&start=-1&end=-1',
                      init_value: tempDocFile.issuerCode,
                      init_text: tempDocFile.issuerName,
                      key_value: 'itemCode',
                      key_text: 'itemName',
                    }"
                    :api_update="end_point + 'docfiles/' + docFile.docFileId"
                    key_update="issuerCode"
                    :permission="tempDocFile.permission"
                    @update-success="(val) => (tempDocFile = val)"
                  >
                  </custome-editable>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 sm12 id="descriptionClass_doc">
              <v-layout wrap>
                <v-flex class="label_align xs12 sm2">
                  {{translate('mo_ta')}}
                </v-flex>
                  <v-flex xs12 sm10 class="control_class">
                    <div class="input-group input-group--dirty input-group--text-field input-group--multi-line">
                        <div class="input-group__input" style="align-items: center;">
                          <span v-if="description_hidden" class=" editable__content__value">{{tempDocFile.content}}
                          </span>

                          <v-text-field 
                              rows="5"
                              multi-line
                              class="flex sm12"
                              v-model="tempDocFile.content"
                              v-if="!description_hidden && hasPermission"
                          ></v-text-field>
                          <div style="margin-left: auto; display: flex;"> 
                            <v-btn flat icon class="btn--editable btn--editable--done mx-0 my-0" color="grey darken-1"
                              v-if="description_hidden && hasPermission"    
                              @click.stop.prevent="descriptionTempleData(tempDocFile)" 
                              :loading="description_hidden_loading" 
                              :disabled="description_hidden_loading"
                            >
                              <v-icon>create</v-icon>
                            </v-btn>
                            <v-btn flat icon class="btn--editable btn--editable--done mx-0 my-0" color="success"
                              v-if="!description_hidden && hasPermission"
                              @click.stop.prevent="descriptionUpdateEvent(tempDocFile)" 
                              :loading="description_hidden_loading" 
                              :disabled="description_hidden_loading"
                            >
                              <v-icon>done</v-icon>
                            </v-btn>
                              
                            <v-btn flat icon class="mx-0 my-0" color="red darken-3"
                              v-if="!description_hidden && hasPermission"
                              @click.stop.prevent="descriptionRolbackEvent(tempDocFile)" 
                              :loading="description_hidden_loading" 
                              :disabled="description_hidden_loading"
                            >
                              <v-icon color="red darken-3">clear</v-icon>
                            </v-btn>
                          </div>
                        </div>
                        <span class="xemthem sub-text mt-1"  @click="clickXemthem_description" v-if="clickRutgon_description && description_hidden && docFile.content.length>0 && hidden_xemthem_description">
                          Xem thêm
                        </span>
                        <span class="rutgon sub-text mt-1" @click="clickXemthem_description" v-if="!clickRutgon_description && description_hidden && docFile.content.length > 0 && hidden_xemthem_description">
                          Rút gọn
                        </span>
                    </div>

                  </v-flex>
              </v-layout>
          </v-flex>
          <v-flex xs12 :class="{'order-lg1': true}">
            <v-layout wrap>
              <v-flex xs12 sm2 class="label_align">
                {{translate('the_nhan')}}
              </v-flex>
              <v-flex xs12 sm10>
                <custome-editable
                  class="control_class"
                  type="multiselect"
                  :multi_select_options = "{
                    usetemp: true,
                    api_get: end_point + 'resourcetags?start=-1&end=-1',
                    api_get_muti_select: end_point + 'resourcetags/' + docFileClassName + '/' + docFile.docFileId + '?start=-1&end=-1',
                    init_value: 'resourceTagId',
                    init_text: 'tag',
                    key_value: 'resourceTagId',
                    key_text: 'tag',
                    param_update_tag: true,
                    class_name: docFileClassName,
                    class_pk: docFile.docFileId,
                    resource: resourceItems1
                  }"
                  @get-resource="(val) => (resourceItems1 = val)"
                  :api_update="end_point + 'resourcetags/pack'"
                  :permission="tempDocFile.permission"
                >
                </custome-editable>
              </v-flex>
            </v-layout>
          </v-flex>
          
        </v-layout>
      </template>
    </mbl-expand-panel>
  </div>

</template>


<script>
export default {
  props: {
    docFile: {
      default: []
    }
  },
  watch: {
    docFile (val) {
      this.tempDocFile = val
    }
  },
  computed: {
    hasPermission () {
      return this.tempDocFile.permission === 'owner' || this.tempDocFile.permission === 'leader'
    }
  },
  data () {
    return {
      clickRutgon_description: true,
      description_hidden: true,
      description_hidden_loading: false,
      tempData10: '',
      hidden_xemthem_description: true,
      documentCatItems: [],
      codeNo_codeNotation_hidden: true,
      codeNo_codeNotation_hidden_loading: false,
      tempDocFile: {},
      resourceItems1: '',
      resourceItems2: ''
    }
  },
  created () {
    this.$nextTick(function () {
      this.setHeight_description()
      this.initDataComponent()
      this.tempDocFile = this.docFile
    })
  },
  methods: {
    initDataComponent () {
      let vm = this
      window.axios.get(vm.end_point + 'dictcollections/DOCUMENT_TYPE/dictitems?sort=treeIndexNumber_Number&&order=false&start=-1&end=-1', vm.apiConfigHeader)
        .then(function (response) {
          let serializable = response.data
          if (serializable.hasOwnProperty('data')) {
            for (var key in serializable.data) {
              if (serializable.data[key].level === 0) {
                vm.documentCatItems.push({
                  header: serializable.data[key].itemName
                })
              } else {
                vm.documentCatItems.push({
                  itemName: serializable.data[key].itemName,
                  itemCode: serializable.data[key].itemCode
                })
              }
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    updateEditableSuccess (val) {
      this.tempDocFile = val
    },
    clickXemthem_description: function () {
      let vm = this
      vm.clickRutgon_description = !vm.clickRutgon_description
      window.$('#descriptionClass_doc .input-group__input').animate({scrollTop: 0}, 100)
      if (vm.clickRutgon_description === true) {
        window.$('#descriptionClass_doc .input-group__input').css({'height': '80px', 'overflow': 'hidden'})
      } else {
        window.$('#descriptionClass_doc .input-group__input').css({'overflow': 'auto', 'height': '200px'})
      }
    },
    setHeight_description: function () {
      let vm = this
      setTimeout(function () {
        window.$('#descriptionClass_doc .input-group__input').css({'height': 'auto', 'overflow': 'hidden'})
        if (window.$('#descriptionClass_doc .input-group__input').height() <= 80) {
          window.$('#descriptionClass_doc .input-group__input').css({'height': 'auto'})
          vm.hidden_xemthem_description = false
        } else {
          window.$('#descriptionClass_doc .input-group__input').css({'height': '80px'})
          vm.hidden_xemthem_description = true
          vm.clickRutgon_description = true
        }
      }, 1000)
    },
    descriptionTempleData: function (data) {
      this.tempData10 = data.description
      window.$('#descriptionClass_doc .input-group__input').css({'height': 'auto'})
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
      let url = vm.end_point + 'docfiles/' + item.docFileId
      window.axios.put(url, dataToAPI, config).then(function (response) {
        vm.setHeight_description()
        vm.description_hidden = !vm.description_hidden
        vm.description_hidden_loading = false
        window.showMessageToastr('success', 'Cập nhật thành công')
      })
        .catch(function (error) {
          console.log(error)
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    },
    UpdateCodeNoCodeNotation () {
      let vm = this
      let config = {
        headers: {
          'groupId': vm.group_id
        }
      }
      vm.codeNo_codeNotation_hidden_loading = true
      let dataToAPI = new URLSearchParams()
      dataToAPI.append('codeNo', vm.tempDocFile.codeNo)
      dataToAPI.append('codeNotation', vm.tempDocFile.codeNotation)
      let url = vm.end_point + 'docfiles/' + vm.docFile.docFileId
      window.axios.put(url, dataToAPI, config).then(function (response) {
        vm.codeNo_codeNotation_hidden = !vm.codeNo_codeNotation_hidden
        vm.codeNo_codeNotation_hidden_loading = false
        vm.tempDocFile = response.data
        vm.docFile.codeNo = response.data.codeNo
        vm.docFile.codeNotation = response.data.codeNotation
        window.showMessageToastr('success', 'Cập nhật thành công')
      })
        .catch(function (error) {
          console.log(error)
          vm.codeNo_codeNotation_hidden_loading = false
          vm.tempDocFile.codeNo = vm.docFile.codeNo
          vm.tempDocFile.codeNotation = vm.docFile.codeNotation
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
    }
  }
}
</script>

<style scoped>
    #descriptionClass_doc .input-group__input .editable__content__value{
        width: 100%;
        white-space: pre-line;
    }
    #descriptionClass_doc .input-group__input{
        min-height: 10px;
        height: auto;
        overflow: hidden;
    }
    .xemthem,.rutgon{
        float: right;
        margin-left: auto;
        cursor: pointer;
    }
    #descriptionClass_doc .input-group__input::-webkit-scrollbar-track,#descriptionClass_doc textarea::-webkit-scrollbar-track
    {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 8px;
        background-color: #F5F5F5;
    }
    #descriptionClass_doc .input-group__input::-webkit-scrollbar,#descriptionClass_doc textarea::-webkit-scrollbar
    {
        width: 8px;
        background-color: #F5F5F5;
    }
    #descriptionClass_doc .input-group__input::-webkit-scrollbar-thumb,#descriptionClass_doc textarea::-webkit-scrollbar-thumb
    {
        border-radius: 8px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: rgb(181, 181, 181);
    }
    
</style>

<style type="text/css" scoped>

  .main-detail-info .editable__content__value {
    white-space: pre-line;
  }
  .custome-editable-with-icon-docfile .editable-text{
    min-height: 28px;
    display: flex;
    align-items: center;
  }
  .custome-editable-with-icon-docfile {
      display: -webkit-flex; /* Safari */
      -webkit-align-items: center; /* Safari 7.0+ */
      display: flex;
      align-items: center;
  }
  .custome-editable-with-icon-docfile div {
     -webkit-flex: 1; /* Safari 6.1+ */
     flex: 1;
  }
  .custome-editable-with-icon-docfile .input-group {
    padding: 0;
    display: block;
  }
  .custome-editable-with-icon-docfile .input-group__details {
    padding-top: 0;
  }
  
</style>