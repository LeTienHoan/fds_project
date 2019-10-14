<template>
<div :class="'voting-result-'+voting_id" class="other">
    <v-layout wrap>
        <v-flex xs12 class="layout align-center">
          <v-checkbox
            class="py-0 my-0"
            v-model="checkboxModel"
            label="Ý kiến khác">
          </v-checkbox>
          <div class="voting_result_summer pointer" @click="openVoting=!openVoting">
            {{ countComment }}
          </div>
        </v-flex>
        <v-flex xs12 v-if="checkboxModel">
          <v-text-field
            v-model="myComment"
            @input="onChangeMyComment"
            placeholder="Nhập ý kiến khác"
            textarea
            rows="1"
          >
          </v-text-field>
        </v-flex>
        <dia-log 
          :item = "[
            {
              width: '700px',
              model: openVoting,
              action: 'saveDialog',
              edit: true
            }]
          "
          :show_button = false
          @closeDialog="(val) => (openVoting = val)"
        >
          <template slot="header">
            Ý kiến khác
          </template>
          <template slot="content">
            <v-layout wrap>
              <v-flex xs12 v-for="(item, index) in votingResultItems" :key="index">
                  <div v-if="item.comment != ''">
                      <!-- <v-divider v-if="index>0" class="ml-5" ></v-divider> -->
                      <!-- <v-layout wrap>
                        <v-flex xs2>
                          <v-icon>person</v-icon>
                        </v-flex>
                        <v-flex xs10>
                          <p>{{item.fullName}}</p>
                          <p>{{item.comment}}</p>
                          <p>{{ item.createDate | datetime }}</p>
                        </v-flex>
                      </v-layout> -->
                      <div class="media">
                        <div class="media-left">
                          <v-icon>person</v-icon>
                        </div>
                        <div class="media-body">
                          <div class="media-heading text-bold">{{item.fullName}}</div>
                          <div class="contentClass">{{item.comment}}</div>
                          <div class="sub-text">{{ item.createDate | datetime }}</div>
                        </div>
                      </div>
                      <!-- <div class="custome-panel-heading-with-icon">
                          <div>
                          <v-icon class="pr-2" x-large>perm_identity</v-icon>
                          {{item.fullName}}
                          </div>
                          <i class='grey--text'> {{ getMoment(item.createDate).format('HH:mm DD/MM/YYYY') }}</i>
                      </div>
                      <div class="pl-5">
                          {{item.comment}}
                      </div> -->
                  </div>
              </v-flex>
            </v-layout>
          </template>
        </dia-log>        
    </v-layout>
</div>
</template>

<script>
const COMPONENT_NAME = 'jx-mobilink-voting-result'
export default {
  name: COMPONENT_NAME,
  components: {
  },
  props: {
    voting_id: 0,
    my_comment: {
      default: ''
    },
    voting_api: {
      default: '127.0.0.1:8081/votings'
    },
    answersCount: 0
  },
  data: function () {
    return {
      votingResultItems: [],
      myComment: this.my_comment,
      checkboxModel: false,
      openVoting: false,
      countComment: 0
    }
  },
  methods: {
    /*
    * on input sync comment
    */
    getMoment (date) {
      return window.moment(date)
    },
    onChangeMyComment: function () {
      let vm = this
      vm.$emit('sync-vl', vm.myComment)
    }
  },
  mounted () {
    /**
     * get result by id
     */
    let vm = this
    const config = {
      headers: {
        'groupId': vm.group_id
      }
    }
    window.axios.get(vm.voting_api + '/' + vm.voting_id + '/results' + '?sort=createDate&start=-1&end=-1', config)
      .then(function (response) {
        let serializable = response.data
        vm.countComment = 0
        if (serializable.hasOwnProperty('data')) {
          vm.votingResultItems = serializable.data
          serializable.data.filter(function (item) {
            if (item.comment !== '') {
              vm.countComment = vm.countComment + 1
            }
          })
          serializable.data.filter(function (item) {
            if (item.userId === vm.user_id) {
              vm.myComment = item.comment
            }
            return true
          })
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  destroyed () {
    // delete this.voting_id
    // delete this.my_comment
    // delete this.voting_api
    // delete this.answersCount
    // delete this.votingResultItems
    // delete this.myComment
    // delete this.checkboxModel
    // delete this.openVoting
    // delete this.countComment
    // delete this.getMoment
    // delete this.onChangeMyComment
  }
}
</script>

<style>


</style>