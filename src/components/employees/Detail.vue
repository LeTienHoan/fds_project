<template>
  <v-app id="inspire">
    <div class="mobilink-content">
      <main>
        <section class="content">

          <div class="fullwidth detail-wrapper">
            <div class="mobilink-all-component layout">
              <v-layout wrap>
                <v-flex xs5 class="pr-3">
                  <v-layout wrap class="detail_left">
                    <mbl-expand-panel
                      :ownExpanded= "ownExpanded"
                    >
                      <template slot="title-name">
                        <v-flex xs12 style="display: flex;">
                          <v-icon class="flex xs1" @click="backList">reply</v-icon>
                          <custome-editable
                            class="flex xs12"
                            type="text"
                            :text_options = "{
                                text: employeesDetail.fullName,
                                multiline: false,
                                rows: 5
                              }"
                            :api_update="end_point + 'employees/' + employeesDetail.employeeId"
                            key_update="fullName"
                            @update-success="(val) => (employeesDetail = val)"
                            :permission="'owner'"
                          >
                          </custome-editable>
                        </v-flex>
                      </template>
                      <template slot="card-text-container">
                        <v-layout wrap class="pb-2">
                          <v-flex xs5 style="text-align: center;padding-right: 10px;">
                            <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" :accept="MSystemConfiguration.configuration.profile.imageextensions || 'image/*'" style="display: none" />
                            <!-- <img :src="imgBlob" style="max-width: 100%;height: auto;"/> -->
                            <!-- <silentbox-group>
                              <silentbox-item :src="imgBlob" description="Sunken dreams II. by Arbebuk">
                                  <img :src="imgBlob" style="max-width: 100%;height: auto;">
                              </silentbox-item>
                            </silentbox-group> -->
                            <silentbox-single  :src="imgBlob" style="max-width: 100%;height: auto;">
                              <img :src="imgBlob" style="max-width: 100%;height: auto;">
                            </silentbox-single>
                            <v-btn v-on:click="handleFileUploadx()" class="primary ma-0 btn--small" style="width: 100%">Tải ảnh đại diện</v-btn>
                          </v-flex>
                          <v-flex xs7>
                            <v-layout wrap>
                              <v-icon class="flex xs1" title="Mã nhân sự">vpn_key</v-icon>
                              <custome-editable
                                type="text"
                                class="flex xs11 pl-2"
                                :text_options = "{
                                    text: employeesDetail.employeeNo,
                                    multiline: false,
                                    rows: 5
                                  }"
                                :api_update="end_point + 'employees/' + employeesDetail.employeeId"
                                key_update="employeeNo"
                                @update-success="(val) => (employeesDetail = val)"
                                :permission="'owner'"
                              >
                              </custome-editable>
                            </v-layout>
                            <v-layout wrap>
                              <v-icon class="flex xs1" title="Ngày sinh">calendar_today</v-icon>
                              <custome-editable
                                  type="datecustom"
                                  class="flex xs11 pl-2"
                                  :date_custom_options="{
                                    init_value: employeesDetail.birthdate,
                                  }"
                                  :api_update="end_point + 'employees/' + employeesDetail.employeeId"
                                  key_update="birthdate"
                                  @update-success="(val) => (employeesDetail = val)"
                                  :permission="'owner'"
                                >
                              </custome-editable>
                            </v-layout>
                            <v-layout wrap>
                              <v-icon class="flex xs1" title="Trạng thái công tác">work</v-icon>
                              <custome-editable
                                class="flex xs11 pl-2"
                                type="select"
                                :select_options = "{
                                    usetemp: true,
                                    items: statusItems,
                                    init_value: employeesDetail.workingStatus,
                                    init_text: statusItems[employeesDetail.workingStatus].name,
                                    key_value: 'id',
                                    key_text: 'name',
                                  }"
                                :api_update="end_point + 'employees/' + employeesDetail.employeeId"
                                key_update="workingStatus"
                                @update-success="(val) => (employeesDetail = val)"
                                :permission="'owner'"
                              >
                              </custome-editable>
                            </v-layout>
                            <v-layout wrap>
                              <v-icon class="flex xs1" title="Giới tính">star</v-icon>
                              <custome-editable
                                class="flex xs11 pl-2"
                                type="select"
                                :select_options = "{
                                    usetemp: true,
                                    items: genderItems,
                                    init_value: employeesDetail.gender,
                                    init_text: genderItems[employeesDetail.gender].name,
                                    key_value: 'id',
                                    key_text: 'name',
                                  }"
                                :api_update="end_point + 'employees/' + employeesDetail.employeeId"
                                key_update="gender"
                                @update-success="(val) => (employeesDetail = val)"
                                :permission="'owner'"
                              >
                              </custome-editable>
                            </v-layout>
                            <v-layout wrap>
                              <v-icon class="flex xs1" title="Điện thoại">phone</v-icon>
                              <custome-editable
                                type="text"
                                class="flex xs11 pl-2"
                                :text_options = "{
                                    text: employeesDetail.telNo,
                                    multiline: false,
                                    rows: 5
                                  }"
                                :api_update="end_point + 'employees/' + employeesDetail.employeeId"
                                key_update="telNo"
                                @update-success="(val) => (employeesDetail = val)"
                                :permission="'owner'"
                              >
                              </custome-editable>
                            </v-layout>
                            <v-layout wrap>
                              <v-icon class="flex xs1" title="Email liên hệ">email</v-icon>
                              <custome-editable
                                type="text"
                                class="flex xs11 pl-2"
                                :text_options = "{
                                    text: employeesDetail.email,
                                    multiline: false,
                                    rows: 5
                                  }"
                                :api_update="end_point + 'employees/' + employeesDetail.employeeId"
                                key_update="email"
                                @update-success="(val) => (employeesDetail = val)"
                                :permission="'owner'"
                              >
                              </custome-editable>
                            </v-layout>
                            <v-layout wrap>
                              <v-icon class="flex xs1" title="Học vị">school</v-icon>
                              <custome-editable
                                type="text"
                                class="flex xs11 pl-2"
                                :text_options = "{
                                    text: employeesDetail.title,
                                    multiline: false,
                                    rows: 5
                                  }"
                                :api_update="end_point + 'employees/' + employeesDetail.employeeId"
                                key_update="title"
                                @update-success="(val) => (employeesDetail = val)"
                                :permission="'owner'"
                              >
                              </custome-editable>
                            </v-layout>
                            <v-layout wrap>
                              <v-flex xs12>
                                <b>Tài khoản đăng nhập: </b>{{ employeesDetail.mappingUser.email }}
                              </v-flex>
                              <v-flex xs12 class="mt-1">
                                <b>Trạng thái hoạt động: </b> 
                                <span v-if="employeesDetail.mappingUser.agreedToTermsOfUse === false">Chờ kích hoạt</span>
                                <span v-if="employeesDetail.mappingUser.agreedToTermsOfUse === true && employeesDetail.mappingUser.status === 0">Đang hoạt động</span>
                                <span v-if="employeesDetail.mappingUser.agreedToTermsOfUse === true && employeesDetail.mappingUser.status === 5">Đã khóa</span>
                              </v-flex>
                            </v-layout>
                            <v-layout wrap class="link_activated">
                              <a @click="lockAccount()" v-if="employeesDetail.mappingUser === ''">Tạo tài khoản</a>
                              <a @click="sendMail()" v-if="employeesDetail.mappingUser.agreedToTermsOfUse === false">Gửi lại mail kích hoạt</a>
                              <a @click="lockAccount(true)" v-if="employeesDetail.mappingUser.agreedToTermsOfUse === true && employeesDetail.mappingUser.status === 0">Khóa tài khoản</a>
                              <a @click="lockAccount(false)" v-if="employeesDetail.mappingUser.agreedToTermsOfUse === true && employeesDetail.mappingUser.status === 5">Kích hoạt lại tài khoản</a>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </template>
                    </mbl-expand-panel>
                  </v-layout>
                </v-flex>
                <v-flex xs7>
                  <v-layout wrap class="detail_left">
                    <mbl-expand-panel
                      :ownExpanded= "ownExpanded"
                    >
                      <template slot="title-name">
                        <div class="employee-ttct">
                          Thông tin công tác
                        </div>
                      </template>
                      <template slot="card-text-container">
                        <v-layout wrap>
                          <v-flex xs4 class="label_align">
                            <b>Phòng ban:</b>
                          </v-flex>
                          <v-flex xs8>
                            <custome-editable
                              type="select"
                              :select_options = "{
                                  usetemp: true,
                                  api_get: end_point + 'workingunits?start=-1&end=-1',
                                  init_value: employeesDetail.workingUnitId,
                                  init_text: employeesDetail.workingUnitName,
                                  key_value: 'workingUnitId',
                                  key_text: 'name',
                                }"
                              :api_update="end_point + 'employees/' + employeesDetail.employeeId"
                              key_update="workingUnitId"
                              @update-success="(val) => (employeesDetail = val)"
                              :permission="'owner'"
                            >
                            </custome-editable>
                          </v-flex>
                        </v-layout>
                        <v-layout wrap>
                          <v-flex xs4 class="label_align">
                            <b>Chức vụ:</b>
                          </v-flex>
                          <v-flex xs8>
                            <custome-editable
                              type="select"
                              :select_options = "{
                                  usetemp: true,
                                  api_get: end_point + 'dictcollections/JOB_TITLE/dictitems?start=-1&end=-1',
                                  init_value: employeesDetail.jobTitle,
                                  init_text: employeesDetail.jobTitle,
                                  key_value: 'itemName',
                                  key_text: 'itemName',
                                }"
                              :api_update="end_point + 'employees/' + employeesDetail.employeeId"
                              key_update="jobTitle"
                              @update-success="(val) => (employeesDetail = val)"
                              :permission="'owner'"
                            >
                            </custome-editable>
                          </v-flex>
                        </v-layout>
                        <v-layout wrap>
                          <v-flex xs4 class="label_align">
                            <b>Phòng ban khác:</b>
                          </v-flex>
                          <v-flex xs8>
                            <custome-editable
                              class="control_class"
                              type="multiselect"
                              :multi_select_options = "{
                                usetemp: true,
                                api_get: end_point + 'workingunits?start=-1&end=-1',
                                api_get_muti_select: end_point + 'employees/' + employeesDetail.employeeId + '/workingunits',
                                init_value: 'workingUnitId',
                                init_text: 'workingUnitName',
                                key_value: 'workingUnitId',
                                key_text: 'name',
                                param_update_workingunit: true,
                                resource: resourceItems2
                              }"
                              @get-resource="(val) => (resourceItems2 = val)"
                              :api_update="end_point + 'employees/' + employeesDetail.employeeId + '/workingunits'"
                              :permission="'owner'"
                              @update-success="(val) => (employeesDetail = val)"
                            >
                            </custome-editable>
                          </v-flex>
                        </v-layout>
                        <v-layout wrap>
                          <v-flex xs4 class="label_align">
                            <b>Ngày bắt đầu làm việc:</b>
                          </v-flex>
                          <v-flex xs8>
                            <custome-editable
                                type="datecustom"
                                :date_custom_options="{
                                    init_value: employeesDetail.recruitDate,
                                }"
                                :api_update="end_point + 'employees/' + employeesDetail.employeeId"
                                key_update="recruitDate"
                                @update-success="(val) => (employeesDetail = val)"
                                :permission="'owner'"
                              >
                            </custome-editable>
                          </v-flex>
                        </v-layout>
                        <v-layout wrap>
                          <v-flex xs4 class="label_align">
                            <b>Ngày kết thúc làm việc:</b>
                          </v-flex>
                          <v-flex xs8>
                            <custome-editable
                                type="datecustom"
                                :date_custom_options="{
                                    init_value: employeesDetail.leaveDate,
                                }"
                                :api_update="end_point + 'employees/' + employeesDetail.employeeId"
                                key_update="leaveDate"
                                @update-success="(val) => (employeesDetail = val)"
                                :permission="'owner'"
                              >
                            </custome-editable>
                          </v-flex>
                        </v-layout>
                        <v-layout wrap style="border-bottom: 1px dashed #e1e2e1;margin-top: 5px;border-top: 1px dashed #e1e2e1;padding-bottom: 10px;">
                          <v-flex xs12 class="label_align mt-2">
                            <b>Thêm nhóm chức năng:</b>
                          </v-flex>
                          <v-flex xs12>
                            <v-select 
                              v-bind:items="jobposItems" 
                              v-model="jobposModel"
                              multiple
                              item-text="title" 
                              item-value="jobPosId"
                              tags
                              chips
                              return-object
                              hide-selected
                              placeholder="Chưa chọn chức vụ..."
                              @input="changeJobpos($event)"
                            >
                              <template slot="selection" slot-scope="data">
                                <v-chip
                                  @input="deleteJobpos(data)"
                                  class="chip--select-multi"
                                  :selected="data.selected"
                                  :disabled="data.disabled"
                                  :key="JSON.stringify(data.item)"
                                  close
                                >
                                  {{ data.item.title }}
                                </v-chip>
                              </template>
                            </v-select>
                          </v-flex>
                        </v-layout>
                        <v-layout wrap>
                          <v-flex xs12 class="label_align">
                            <input type="file" id="fileUpload" ref="fileUpload" v-on:change="handleFileUpload1()" style="display: none" />
                            <b>Tệp đính kèm:</b>
                            <v-btn v-on:click="handleFileUpload1" class="primary btn--small" style="margin-left: auto;">
                              <i class="fa fa-upload pr-1"></i>
                              Tải lên
                            </v-btn>
                          </v-flex>
                          <v-flex xs12>
                          </v-flex>
                        </v-layout>
                        <v-layout wrap class="mb-2" v-for="(item, index) in fileAttachItems" :key="index">
                          <v-flex xs1>
                            <v-icon>chevron_right</v-icon>
                          </v-flex>
                          <v-flex xs10>
                            <span @click="downloadFileAttach(item,index)" class="pointer">{{ item.createDate }}-{{item.fileName}}</span>
                          </v-flex>
                          <v-flex xs1 class="text-xs-right">
                            <v-icon @click="deleteFileAttach(item,index)" class="pointer">clear</v-icon>
                          </v-flex>
                        </v-layout>
                      </template>
                    </mbl-expand-panel>
                  </v-layout>
                </v-flex>
              </v-layout>
            </div>
          </div>
        </section>
      </main>
    </div>
  </v-app>
</template>

<script>
  const COMPONENT_NAME = 'detail'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {},
    watch: {
      '$route.params.id' () {
        this.initDetail()
      }
    },
    computed: {
      positionItems () {
        return this.$store.getters.loadedPosition.data
      },
      jobposItems () {
        let count = []
        if (typeof this.$store.getters.loadedJobpos.data !== 'undefined') {
          for (var key in this.$store.getters.loadedJobpos.data) {
            for (var key1 in this.jobposModel) {
              if (this.jobposModel[key1].jobPosId === this.$store.getters.loadedJobpos.data[key].jobPosId) {
                count.push(key)
                this.$store.getters.loadedJobpos.data.splice(key, 1)
                break
              }
            }
          }
        }
        return this.$store.getters.loadedJobpos.data
      }
    },
    data () {
      return {
        employeesDetail: [],
        statusItems: [
          {
            id: 0,
            name: 'Đã nghỉ việc'
          },
          {
            id: 1,
            name: 'Đang làm việc'
          }
        ],
        genderItems: [
          {
            id: 0,
            name: 'Nữ'
          },
          {
            id: 1,
            name: 'Nam'
          }
        ],
        jobposModel: '',
        imgBlob: '',
        file: '',
        fileUpload: '',
        fileAttachItems: [],
        current: 0,
        ownExpanded: true,
        resourceItems2: ''
      }
    },
    created () {
      this.$nextTick(function () {
      })
    },
    methods: {
      handleFileUploadx () {
        window.$('#file').trigger({type: 'click'})
      },
      handleFileUpload () {
        let vm = this
        vm.file = vm.$refs.file.files[0]
        if (vm.file.size >= Number(this.MSystemConfiguration.configuration.profile.maximagesize)) {
          window.showMessageToastr('error', 'Quá giới hạn file tải lên')
        } else if (this.MSystemConfiguration.configuration.profile.imageextensions &&
          (this.MSystemConfiguration.configuration.profile.imageextensions.indexOf(vm.file.type) < 0)) {
          window.showMessageToastr('error', 'Bạn cần chọn file hình ảnh')
        } else {
          let config = {
            headers: {
              'groupId': vm.group_id
            }
          }
          let dataPut = new FormData()
          dataPut.append('file', vm.file)
          dataPut.append('fileName', vm.file.name)
          dataPut.append('fileType', vm.file.type)
          dataPut.append('fileSize', vm.file.size)
          dataPut.append('className', '')
          dataPut.append('classPK', vm.$route.params.id)
          window.axios.put(vm.end_point + 'employees/' + this.$route.params.id + '/photo',
            dataPut,
            config
          )
            .then(function (response) {
              window.showMessageToastr('success', 'Tải ảnh đại diện thành công')
              setTimeout(function () {
                vm.getBase64()
              }, 500)
            })
            .catch(function (error) {
              vm.imgBlob = '/o/mobilink-theme/images/avatar.png'
              console.log(error.response)
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
        }
      },
      handleFileUpload1 () {
        let vm = this
        window.$('#fileUpload').trigger({type: 'click'})
        vm.fileUpload = vm.$refs.fileUpload.files[0]
        let config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        let dataPut = new FormData()
        dataPut.append('appendix', true)
        dataPut.append('file', vm.fileUpload)
        dataPut.append('fileName', vm.fileUpload.name)
        dataPut.append('fileType', vm.fileUpload.type)
        dataPut.append('fileSize', vm.fileUpload.size)
        dataPut.append('className', 'org.mobilink.common.model.Employee')
        dataPut.append('classPK', vm.$route.params.id)
        window.axios.post(vm.end_point + 'fileattachs/upload',
          dataPut,
          config
        )
          .then(function (response) {
            window.showMessageToastr('success', 'Tải tệp đính kèm thành công')
            setTimeout(function () {
              vm.fileAttachItems.push(response.data)
            }, 500)
          })
          .catch(function (error) {
            console.log(error.response)
            // window.showMessageByAPICode(error.response, error.response)
          })
      },
      downloadFileAttach (item, index) {
        let vm = this
        item['download_loading'] = true
        let onsuccess = function () {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          item['download_loading'] = false
        }
        let onerror = function (error) {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          item['download_loading'] = false
          console.log(error)
        }
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Đang tải dữ liệu...'
        })
        window.downloadFile2({
          url: vm.end_point + 'fileattachs/' + item.fileAttachId,
          groupId: vm.group_id,
          fileName: item.fileName
        }, onsuccess, onerror)
      },
      deleteFileAttach (item, index) {
        let vm = this
        let config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        vm.$dialog.confirm('Bạn chắc chắn xóa văn bản này?', {
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
            window.axios.delete(vm.end_point + 'fileattachs/' + item.fileAttachId,
              config
            )
              .then(function (response) {
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageToastr('success', 'Xóa tệp đính kèm thành công')
                vm.fileAttachItems.splice(index, 1)
              })
              .catch(function (error) {
                vm.$store.dispatch('loading/setLoading', {
                  loading: false
                })
                window.showMessageByAPICode(error.response.status, error.response.data)
                console.log(error.response)
              })
            dialog.close()
            return false
          })
          .catch(function (e) {
            console.log(e)
          })
      },
      backList () {
        this.$router.back()
      },
      getBase64 () {
        let vm = this
        let config = {
          headers: {
            'groupId': vm.group_id
          },
          responseType: 'arraybuffer'
        }
        window.axios.get(vm.end_point + 'employees/' + this.$route.params.id + '/photo',
          config
        )
          .then(function (response) {
            let blob = new Blob([response.data], {type: 'image/png'})
            vm.imgBlob = window.URL.createObjectURL(blob)
          })
          .catch(function (error) {
            vm.imgBlob = '/o/mobilink-theme/images/avatar.png'
            console.log(error.response)
          })
      },
      getFileAttachs () {
        let vm = this
        let config = {
          headers: {
            'groupId': vm.group_id,
            'Accept': 'application/json'
          }
        }
        let className = 'org.mobilink.common.model.Employee'
        window.axios.get(vm.end_point + 'fileattachs/' + className + '/' + this.$route.params.id + '?appendix=true',
          config
        )
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              vm.fileAttachItems = serializable.data
            } else {
              vm.fileAttachItems = []
            }
          })
          .catch(function (error) {
            console.log(error.response)
          })
      },
      changeJobpos (event) {
        let vm = this
        if (event.length > vm.current) {
          let config = {
            headers: {
              'groupId': vm.group_id
            }
          }
          let dataPost = new URLSearchParams()
          for (var key in vm.jobposModel) {
            if (vm.jobposModel.length === Number(key) + 1) {
              dataPost.append('jobPosId', vm.jobposModel[key].jobPosId)
            }
          }
          window.axios.post(vm.end_point + 'employees/' + this.$route.params.id + '/jobpos',
            dataPost,
            config
          )
            .then(function (response) {
              let serializable = response.data
              vm.jobposModel = []
              for (var key in serializable.data) {
                if (serializable.data[key].selected === true) {
                  vm.jobposModel.push({
                    title: serializable.data[key].jobPosTitle,
                    jobPosId: serializable.data[key].jobPosId
                  })
                }
              }
              vm.current = vm.jobposModel.length
            })
            .catch(function (error) {
              console.log(error.response)
              window.showMessageByAPICode(error.response.status, error.response.data)
            })
        }
      },
      deleteJobpos (data) {
        let vm = this
        let config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Xóa dữ liệu...'
        })
        window.axios.delete(vm.end_point + 'employees/' + vm.$route.params.id + '/jobpos/' + data.item.jobPosId,
          config
        )
          .then(function (response) {
            for (var key in vm.jobposModel) {
              if (vm.jobposModel[key].jobPosId === data.item.jobPosId) {
                vm.jobposModel.splice(key, 1)
                vm.jobposItems.push(data.item)
              }
            }
            // data.parent.selectItem(data.item)
            vm.current = vm.current - 1
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageToastr('success', 'Xóa dữ liệu thành công')
          })
          .catch(function (error) {
            console.log(error.response)
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      initDetail () {
        let vm = this
        let config = {
          headers: {
            'groupId': vm.group_id
          },
          params: {
            start: -1,
            end: -1
          }
        }
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Đang tải dữ liệu...'
        })
        window.axios.get(vm.end_point + 'employees/' + this.$route.params.id,
          config
        )
          .then(function (response) {
            vm.employeesDetail = response.data
            let checkPermission = 'owner,leader,hoster,manager,writer,read'.indexOf(vm.employeesDetail.permission || 'none') >= 0
            if (checkPermission) {
              if (vm.employeesDetail.mappingUser.portraitId > 0) {
                vm.getBase64()
              } else {
                vm.imgBlob = '/o/mobilink-theme/images/avatar.png'
                // vm.imgBlob = 'http://qa.mobilink.vn/image/user_portrait?img_id=79937&img_id_token=LRmJEVeKMCqCJhX37wKHPt6iWj0%3D'
              }
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
        window.axios.get(vm.end_point + 'employees/' + this.$route.params.id + '/jobpos',
          config
        )
          .then(function (response) {
            let serializable = response.data
            vm.jobposModel = []
            for (var key in serializable.data) {
              vm.jobposModel.push({
                title: serializable.data[key].jobPosTitle,
                jobPosId: serializable.data[key].jobPosId
              })
            }
            vm.current = vm.jobposModel.length
          })
          .catch(function (error) {
            console.log(error.response)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      lockAccount (item) {
        let vm = this
        if (vm.employeesDetail.email === '') {
          alert('Chưa tồn tại email nhân sự')
        } else {
          let config = {
            headers: {
              'groupId': vm.group_id
            }
          }
          let dataPost = new URLSearchParams()
          if (item === true || item === false) {
            dataPost.append('locked', item)
            window.axios.post(vm.end_point + 'employees/' + vm.$route.params.id + '/lock',
              dataPost,
              config
            )
              .then(function (response) {
                if (item === true) {
                  window.showMessageToastr('success', 'Khóa tài khoản thành công')
                } else {
                  window.showMessageToastr('success', 'Kích hoạt tài khoản thành công')
                }
                vm.employeesDetail = response.data
              })
              .catch(function (error) {
                console.log(error.response)
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
          } else {
            window.axios.post(vm.end_point + 'employees/' + vm.$route.params.id + '/account',
              dataPost,
              config
            )
              .then(function (response) {
                window.showMessageToastr('success', 'Tạo tài khoản thành công')
                vm.employeesDetail = response.data
              })
              .catch(function (error) {
                console.log(error.response)
                window.showMessageByAPICode(error.response.status, error.response.data)
              })
          }
        }
      },
      sendMail () {
        let vm = this
        let config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        let dataPost = new URLSearchParams()
        window.axios.post(vm.end_point + 'employees/' + vm.$route.params.id + '/resendverifyemail',
          dataPost,
          config
        )
          .then(function (response) {
            window.showMessageToastr('success', 'Gửi email thành công')
          })
          .catch(function (error) {
            console.log(error.response)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.initDetail()
        // this.$store.dispatch('workingUnit/getWorkingUnitItems')
        this.$store.dispatch('loadPosition')
        this.$store.dispatch('loadJobpos')
        this.getFileAttachs()
      })
    }
  }
</script>

<style lang="scss">

  .employee-ttct {
    min-height: 28px;
    line-height: 28px;
  }
</style>
