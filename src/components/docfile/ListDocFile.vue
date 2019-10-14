<template lang="html">
  <div class="list-docfile-grid-component">
    <div class="text-xs-center fullwidth pt-3"
      v-show="isLoading"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
  <v-slide-y-transition>
    <table v-show="!isLoading" class="table table-default-override table-basic">
      <thead>
        <tr class="layout wrap">
          <th v-for="gridColumnx in gridColumns[staticRouter.name] || gridColumns['default']"
            :class="'label_align justify-center flex xs' + gridColumnx.width"
          >
            {{gridColumnx.text}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(docFile, index) in tableEventListItems"
          class="layout wrap"
        >
          <td
            v-for="gridColumnx in gridColumns[staticRouter.name] || gridColumns['default']"
            :class="'justify-' + gridColumnx.align + ' flex xs' + gridColumnx.width"
            class="label_align"
          >
            <template v-if="gridColumnx.value ==='action'"
            >
              <v-btn icon small class="ma-0" @click.stop="downloadDocFile(docFile)"
                :loading="docFile.download_loading"
                :disabled="docFile.download_loading"
              >
                <v-icon>file_download</v-icon>
              </v-btn>
              <v-btn icon small class="ma-0" @click.stop="deleteDocFile(docFile)"
                :loading="docFile.download_loading"
                :disabled="docFile.download_loading"
                v-if="'owner'.indexOf(getPermissionText(docFile.permission)) >= 0"
              >
                <v-icon>clear</v-icon>
              </v-btn>
            </template>
            <a v-else href="javascript:;"
              :class="{'text-bold': !docFile.visited}"
              v-on:click="goToDetail(docFile)"
            >
              <span v-if="gridColumnx.dataType === 'datetime'"
                v-bind:title="docFile[gridColumnx.value] | datetime"
              >
                {{docFile[gridColumnx.value] | datetime}}
              </span>
              <span v-else-if="gridColumnx.dataType === 'date'"
                v-bind:title="docFile[gridColumnx.value] | date"
              >
                {{docFile[gridColumnx.value] | datetime}}
              </span>
              <span v-else-if="gridColumnx.dataType === 'so_ky_hieu'"
                v-bind:title="docFile['codeNo'] + '/' + docFile['codeNotation']">
                {{docFile['codeNo'] + '/' + docFile['codeNotation']}}
              </span>
              <span v-else v-bind:title="docFile[gridColumnx.value]">
                {{docFile[gridColumnx.value]}}
              </span>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </v-slide-y-transition>

  <v-slide-x-transition>  
    <div class="pt-2 layout center-all" v-show="pagination.length > 0"> <!-- -->
      
        <div class="select-page-size">
          <v-select
            :items="pageNumberItems"
            v-model="paginationSize"
            :width="55"
            :max-width="55"
            :min-width="55"
            no-data-text=""
          ></v-select>
        </div>
        <v-pagination v-if="!isLoading" 
          @input="paginationPageChange"
          v-model="pagination.page" :length="pagination.length">
        </v-pagination>
      
    </div>
  </v-slide-x-transition>
  </div>
</template>

<script>
  import { EventBus } from '@/eventbus'
  export default {
    subject: 'gridtree',
    components: {
    },
    props: {
      active: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      active (val) {
        if (val) {
          this.getData()
        }
      },
      paginationSize (val) {
        this.$store.dispatch('advancedSearch/updateAdvancedSearchNewQueries', {
          grid_paginationSize: val,
          grid_paginationPage: 1
        })
      },
      advancedSearchNewQueriesCPQueries: function (val) {
        this.getData()
      }
    },
    data () {
      return {
        isLoading: false,
        download_loading: {},
        pagination: {
          page: 1,
          length: 0
        },
        paginationSize: 50,
        dataByIndex: {},
        showTreePathDialog: false,
        treePathItems: [],
        activitySelected: {},
        gridColumns: {
          default: [
            {
              text: this.translate('ten_van_ban'),
              align: 'start',
              sortable: false,
              value: 'subject',
              width: '2',
              dataType: 'text'
            },
            {
              text: this.translate('ngay_tao'),
              align: 'end',
              sortable: false,
              value: 'createDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('so_ky_hieu'),
              align: 'end',
              sortable: false,
              value: 'so_ky_hieu',
              width: '2',
              dataType: 'so_ky_hieu'
            },
            {
              text: this.translate('ngay_ban_hanh'),
              align: 'end',
              sortable: false,
              value: 'promulgationDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('loai_van_ban'),
              align: 'start',
              sortable: false,
              value: 'categoryName',
              width: '2'
            },
            {
              text: '',
              align: 'end',
              sortable: false,
              value: 'action',
              width: '1'
            }
          ],
          truy_cap_gan_day: [
            {
              text: this.translate('ten_van_ban'),
              align: 'start',
              sortable: false,
              value: 'subject',
              width: '4',
              dataType: 'text'
            },
            {
              text: this.translate('ngay_tao'),
              align: 'end',
              sortable: false,
              value: 'createDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('so_ky_hieu'),
              align: 'end',
              sortable: false,
              value: 'so_ky_hieu',
              width: '2',
              dataType: 'so_ky_hieu'
            },
            {
              text: this.translate('ngay_ban_hanh'),
              align: 'end',
              sortable: false,
              value: 'promulgationDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('loai_van_ban'),
              align: 'start',
              sortable: false,
              value: 'categoryName',
              width: '2'
            }
          ],
          tai_lieu_cua_toi: [
            {
              text: this.translate('ten_van_ban'),
              align: 'start',
              sortable: false,
              value: 'subject',
              width: '3',
              dataType: 'text'
            },
            {
              text: this.translate('ngay_tao'),
              align: 'end',
              sortable: false,
              value: 'createDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('so_ky_hieu'),
              align: 'end',
              sortable: false,
              value: 'so_ky_hieu',
              width: '2',
              dataType: 'so_ky_hieu'
            },
            {
              text: this.translate('ngay_ban_hanh'),
              align: 'end',
              sortable: false,
              value: 'promulgationDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('loai_van_ban'),
              align: 'start',
              sortable: false,
              value: 'categoryName',
              width: '2'
            },
            {
              text: '',
              align: 'end',
              sortable: false,
              value: 'action',
              width: '1'
            }
          ],
          van_ban_cho_thuc_hien: [
            {
              text: this.translate('ten_van_ban'),
              align: 'start',
              sortable: false,
              value: 'subject',
              width: '3',
              dataType: 'text'
            },
            {
              text: this.translate('ngay_tao'),
              align: 'end',
              sortable: false,
              value: 'createDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('so_ky_hieu'),
              align: 'end',
              sortable: false,
              value: 'so_ky_hieu',
              width: '2',
              dataType: 'so_ky_hieu'
            },
            {
              text: this.translate('ngay_ban_hanh'),
              align: 'end',
              sortable: false,
              value: 'promulgationDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('loai_van_ban'),
              align: 'start',
              sortable: false,
              value: 'categoryName',
              width: '2'
            },
            {
              text: '',
              align: 'end',
              sortable: false,
              value: 'action',
              width: '1'
            }
          ],
          van_ban_di: [
            {
              text: this.translate('ten_van_ban'),
              align: 'start',
              sortable: false,
              value: 'subject',
              width: '3',
              dataType: 'text'
            },
            {
              text: this.translate('ngay_tao'),
              align: 'end',
              sortable: false,
              value: 'createDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('so_ky_hieu'),
              align: 'end',
              sortable: false,
              value: 'so_ky_hieu',
              width: '2',
              dataType: 'so_ky_hieu'
            },
            {
              text: this.translate('ngay_ban_hanh'),
              align: 'end',
              sortable: false,
              value: 'promulgationDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('loai_van_ban'),
              align: 'start',
              sortable: false,
              value: 'categoryName',
              width: '2'
            },
            {
              text: '',
              align: 'end',
              sortable: false,
              value: 'action',
              width: '1'
            }
          ],
          van_ban_den: [
            {
              text: this.translate('ten_van_ban'),
              align: 'start',
              sortable: false,
              value: 'subject',
              width: '3',
              dataType: 'text'
            },
            {
              text: this.translate('ngay_tao'),
              align: 'end',
              sortable: false,
              value: 'createDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('so_ky_hieu'),
              align: 'end',
              sortable: false,
              value: 'so_ky_hieu',
              width: '2',
              dataType: 'so_ky_hieu'
            },
            {
              text: this.translate('ngay_ban_hanh'),
              align: 'end',
              sortable: false,
              value: 'promulgationDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('loai_van_ban'),
              align: 'start',
              sortable: false,
              value: 'categoryName',
              width: '2'
            },
            {
              text: '',
              align: 'end',
              sortable: false,
              value: 'action',
              width: '1'
            }
          ],
          tai_lieu_trinh_duyet: [
            {
              text: this.translate('ten_van_ban'),
              align: 'start',
              sortable: false,
              value: 'subject',
              width: '3',
              dataType: 'text'
            },
            {
              text: this.translate('ngay_tao'),
              align: 'end',
              sortable: false,
              value: 'createDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('so_ky_hieu'),
              align: 'end',
              sortable: false,
              value: 'so_ky_hieu',
              width: '2',
              dataType: 'so_ky_hieu'
            },
            {
              text: this.translate('ngay_ban_hanh'),
              align: 'end',
              sortable: false,
              value: 'promulgationDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('loai_van_ban'),
              align: 'start',
              sortable: false,
              value: 'categoryName',
              width: '2'
            },
            {
              text: '',
              align: 'end',
              sortable: false,
              value: 'action',
              width: '1'
            }
          ],
          don_thu_hanh_chinh: [
            {
              text: this.translate('ten_van_ban'),
              align: 'start',
              sortable: false,
              value: 'subject',
              width: '3',
              dataType: 'text'
            },
            {
              text: this.translate('ngay_tao'),
              align: 'end',
              sortable: false,
              value: 'createDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('so_ky_hieu'),
              align: 'end',
              sortable: false,
              value: 'so_ky_hieu',
              width: '2',
              dataType: 'so_ky_hieu'
            },
            {
              text: this.translate('ngay_ban_hanh'),
              align: 'end',
              sortable: false,
              value: 'promulgationDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('loai_van_ban'),
              align: 'start',
              sortable: false,
              value: 'categoryName',
              width: '2'
            },
            {
              text: '',
              align: 'end',
              sortable: false,
              value: 'action',
              width: '1'
            }
          ],
          tai_lieu_lay_y_kien_gop_y: [
            {
              text: this.translate('ten_van_ban'),
              align: 'start',
              sortable: false,
              value: 'subject',
              width: '3',
              dataType: 'text'
            },
            {
              text: this.translate('ngay_tao'),
              align: 'end',
              sortable: false,
              value: 'createDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('so_ky_hieu'),
              align: 'end',
              sortable: false,
              value: 'so_ky_hieu',
              width: '2',
              dataType: 'so_ky_hieu'
            },
            {
              text: this.translate('ngay_ban_hanh'),
              align: 'end',
              sortable: false,
              value: 'promulgationDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('loai_van_ban'),
              align: 'start',
              sortable: false,
              value: 'categoryName',
              width: '2'
            },
            {
              text: '',
              align: 'end',
              sortable: false,
              value: 'action',
              width: '1'
            }
          ],
          tai_lieu_luu_tru: [
            {
              text: this.translate('ten_van_ban'),
              align: 'start',
              sortable: false,
              value: 'subject',
              width: '3',
              dataType: 'text'
            },
            {
              text: this.translate('ngay_tao'),
              align: 'end',
              sortable: false,
              value: 'createDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('so_ky_hieu'),
              align: 'end',
              sortable: false,
              value: 'so_ky_hieu',
              width: '2',
              dataType: 'so_ky_hieu'
            },
            {
              text: this.translate('ngay_ban_hanh'),
              align: 'end',
              sortable: false,
              value: 'promulgationDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('loai_van_ban'),
              align: 'start',
              sortable: false,
              value: 'categoryName',
              width: '2'
            },
            {
              text: '',
              align: 'end',
              sortable: false,
              value: 'action',
              width: '1'
            }
          ],
          tat_ca_tai_lieu: [
            {
              text: this.translate('ten_van_ban'),
              align: 'start',
              sortable: false,
              value: 'subject',
              width: '3',
              dataType: 'text'
            },
            {
              text: this.translate('ngay_tao'),
              align: 'end',
              sortable: false,
              value: 'createDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('so_ky_hieu'),
              align: 'end',
              sortable: false,
              value: 'so_ky_hieu',
              width: '2',
              dataType: 'so_ky_hieu'
            },
            {
              text: this.translate('ngay_ban_hanh'),
              align: 'end',
              sortable: false,
              value: 'promulgationDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('loai_van_ban'),
              align: 'start',
              sortable: false,
              value: 'categoryName',
              width: '2'
            },
            {
              text: '',
              align: 'end',
              sortable: false,
              value: 'action',
              width: '1'
            }
          ],
          thung_rac: [
            {
              text: this.translate('ten_van_ban'),
              align: 'start',
              sortable: false,
              value: 'subject',
              width: '3',
              dataType: 'text'
            },
            {
              text: this.translate('ngay_tao'),
              align: 'end',
              sortable: false,
              value: 'createDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('so_ky_hieu'),
              align: 'end',
              sortable: false,
              value: 'so_ky_hieu',
              width: '2',
              dataType: 'so_ky_hieu'
            },
            {
              text: this.translate('ngay_ban_hanh'),
              align: 'end',
              sortable: false,
              value: 'promulgationDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('loai_van_ban'),
              align: 'start',
              sortable: false,
              value: 'categoryName',
              width: '2'
            },
            {
              text: '',
              align: 'end',
              sortable: false,
              value: 'action',
              width: '1'
            }
          ],
          ho_so_luu_tru: [
            {
              text: this.translate('ten_van_ban'),
              align: 'start',
              sortable: false,
              value: 'subject',
              width: '3',
              dataType: 'text'
            },
            {
              text: this.translate('ngay_tao'),
              align: 'end',
              sortable: false,
              value: 'createDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('so_ky_hieu'),
              align: 'end',
              sortable: false,
              value: 'so_ky_hieu',
              width: '2',
              dataType: 'so_ky_hieu'
            },
            {
              text: this.translate('ngay_ban_hanh'),
              align: 'end',
              sortable: false,
              value: 'promulgationDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('loai_van_ban'),
              align: 'start',
              sortable: false,
              value: 'categoryName',
              width: '2'
            },
            {
              text: '',
              align: 'end',
              sortable: false,
              value: 'action',
              width: '1'
            }
          ],
          thu_muc_luu_tru: [
            {
              text: this.translate('ten_van_ban'),
              align: 'start',
              sortable: false,
              value: 'subject',
              width: '3',
              dataType: 'text'
            },
            {
              text: this.translate('ngay_tao'),
              align: 'end',
              sortable: false,
              value: 'createDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('so_ky_hieu'),
              align: 'end',
              sortable: false,
              value: 'so_ky_hieu',
              width: '2',
              dataType: 'so_ky_hieu'
            },
            {
              text: this.translate('ngay_ban_hanh'),
              align: 'end',
              sortable: false,
              value: 'promulgationDate',
              width: '2',
              dataType: 'datetime'
            },
            {
              text: this.translate('loai_van_ban'),
              align: 'start',
              sortable: false,
              value: 'categoryName',
              width: '2'
            },
            {
              text: '',
              align: 'end',
              sortable: false,
              value: 'action',
              width: '1'
            }
          ]
        }
      }
    },
    computed: {
      tableEventListItems () {
        let vm = this
        return vm.$store.getters['docFile/docFileItems'].map(item => {
          item.download_loading = item.docFileId === vm.download_loading.docFileId
          return item
        })
      },
      staticRouter () {
        return this.$store.getters.staticRouter
      },
      advancedSearchNewQueriesCPQueries () {
        const queries = this.advancedSearchNewQueriesCP.advansearchListAmazings || []
        let query = {}
        for (let k in queries) {
          Object.assign(query, queries[k].query)
        }
        return query
      },
      advancedSearchNewQueriesCP () {
        return this.$store.getters['advancedSearch/advancedSearchNewQueries']
      }
    },
    mounted () {
      let vm = this
      this.$nextTick(() => {
        vm.paginationSize = this.$store.getters['advancedSearch/advancedSearchNewQueries'].grid_paginationSize || 50
        vm.pagination.page = this.$store.getters['advancedSearch/advancedSearchNewQueries'].grid_paginationPage || 1
        this.getData()
      })
    },
    methods: {
      getData () {
        let vm = this
        if (!this.active || vm.isLoading) {
          return
        }
        vm.isLoading = true
        let start = this.pagination.page * this.paginationSize - this.paginationSize
        let end = this.pagination.page * this.paginationSize
        let queries = {
          start: start || 0,
          end: end || vm.paginationSize
          // register: vm.docFileOtherType ? 0 : ''
        }
        Object.assign(queries,
          // vm.$route.meta.query || {},
          vm.advancedSearchNewQueriesCPQueries
        )
        vm.$store.dispatch('docFile/getDocFileItems', queries
        ).then(response => {
          vm.pagination.length = Math.ceil(Number(response.total) / vm.paginationSize)
          vm.isLoading = false
        }, error => {
          console.log(error)
          vm.isLoading = false
          window.showMessageByAPICode(error.response.status, error.response.data)
        })
      },
      goToDetail (doc) {
        if (!doc.permission) {
          return
        }
        // this.$router.push('/detail/' + doc.docFileId)
        this.$router.replace({
          query: { id: doc.docFileId }
        })
      },
      paginationPageChange (val) {
        this.$store.dispatch('advancedSearch/updateAdvancedSearchNewQueries', {
          grid_paginationPage: val
        })
      },
      downloadDocFile (docFile) {
        let vm = this
        vm.download_loading = docFile
        let onsuccess = function () {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          vm.download_loading = {}
        }
        let onerror = function (error) {
          vm.$store.dispatch('loading/setLoading', {
            loading: false
          })
          docFile.download_loading = {}
          console.log(error)
        }
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Đang tải dữ liệu...'
        })
        window.downloadFile2({
          url: vm.end_point + 'docfiles/' + docFile.docFileId + '/download',
          groupId: vm.group_id,
          fileName: docFile.subject + '.zip'
        }, onsuccess, onerror)
      },
      deleteDocFile (docFile) {
        let vm = this
        vm.$dialog.confirm('Bạn muốn xóa văn bản ' + docFile.subject + '?', {
          html: true,
          loader: true,
          okText: 'Xác nhận',
          cancelText: 'Quay lại',
          animation: 'fade'
        })
          .then(function (dialog) {
            vm.download_loading = docFile
            vm.$store.dispatch('loading/setLoading', {
              loading: true,
              message: 'Xóa dữ liệu...'
            })
            vm.$store.dispatch('docFile/deleteDocFile', docFile.docFileId
            ).then(response => {
              EventBus.$emit('count_filter', true)
              vm.download_loading = {}
              vm.$store.dispatch('loading/setLoading', {
                loading: false
              })
            }, error => {
              console.log(error)
              vm.download_loading = {}
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
      }
    }
  }
</script>

<style lang="css">
.select-page-size {
  width: 55px;
  align-items: center;
  display: inline-flex;
}
.select-page-size .input-group {
  padding-top: 0px;
}
.select-page-size .input-group__details {
  min-height: 0px !important;
}
</style>
