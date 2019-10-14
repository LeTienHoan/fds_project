<template>
  <div>
    <mbl-expand-panel
      :ownExpanded= "ownExpanded"
    >
      <template slot="title-name">
        Liên lạc mới cập nhật
      </template>
      <template slot="card-text-container">
        <div>
          <v-layout wrap :key="index" v-for="(item, index) in contactUpdate" class="pa-2">
            <v-flex xs12>
              <div class="media">
                <div class="media-left">
                  <v-icon v-if="item.contactType === 0">person</v-icon>
                  <v-icon v-if="item.contactType === 2">supervisor_account</v-icon>
                  <v-icon v-if="item.contactType === 1">account_balance</v-icon>
                </div>
                <div class="media-body" style="word-break: break-all">
                  <div class="media-heading text-bold">{{item.fullName}}</div>
                  <div class="contentClass">{{item.email}}</div>
                </div>
              </div>
            </v-flex>
          </v-layout>
          <v-layout wrap v-if="contactUpdate.length == 0">
            <v-flex xs12 class="center-all my-2"><i>Không có dữ liệu</i></v-flex>
          </v-layout>
          <div class="pt-2 text-xs-right" v-if="contactUpdate.length != 0">
            <v-pagination v-model="paginationPage" :length="pagination"></v-pagination>
          </div>
        </div>
      </template>
    </mbl-expand-panel>
  </div>
  
</template>

<script>
const COMPONENT_NAME = 'new-contact-update'
export default {
  name: COMPONENT_NAME,
  components: {
  },
  props: {
  },
  watch: {
    'paginationPage': {
      handler () {
        this.$store.dispatch('setPaginationPageUpdate', {
          pagination: this.paginationPage
        })
      }
    }
  },
  computed: {
    contactUpdate () {
      return this.$store.getters.loadedContactsUpdate.data
    }
  },
  data () {
    return {
      valid: '',
      ownExpanded: true,
      paginationPage: 1,
      pagination: 2
    }
  },
  created () {
  },
  methods: {
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.dispatch('loadContactUpdate')
    })
  }
}
</script>

<style >
    
</style>