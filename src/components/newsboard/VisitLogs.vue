<template>
  <div class="newsboard-VisitLogs">
    <dia-log 
      :item = "[
        {
          width: '900px',
          model: showVisitLog
        }]
      "
      :show_button="false"
      @closeDialog="(val) => (showVisitLog = val)"
    >
      <template slot="header">
        {{title}}
      </template>
      <template slot="content">
        <div class="no-visit-log" v-if="visitLogsItems.length === 0">
          <v-icon class="pr-2">speaker_notes_off</v-icon>
          Không ai xem
        </div>
        <v-list v-else>
          <template v-for="(item, index) in visitLogsItems">
            <v-divider
              v-if="index > 0"
              :key="index"
            ></v-divider>

            <v-list-tile
              :key="item.visitLogId"
              avatar
            >
              <v-list-tile-avatar>
                <img :src="item.profileUrl || '/image/user_male_portrait'">
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-html="item.fullname"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.email"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </template>
    </dia-log>
  </div>

</template>

<script>
export default {
  props: {
    class_name: {
      default: 'unknow'
    },
    class_pk: {
      default: 'unknow'
    }
  },
  watch: {
    showVisitLog (val) {
      if (val) {
        this.getVisitLogs()
      }
    }
  },
  data () {
    return {
      showVisitLog: false,
      title: 'Danh sách những người đã xem',
      visitLogsItems: []
    }
  },
  methods: {
    createTokenSubmit () {
      this.showVisitLog = false
    },
    getVisitLogs () {
      let vm = this
      this.visitLogsItems = []
      /**
      this.visitLogsItems = [{
        'visitLogId': 0,
        'userId': 0,
        'createDate': 1552884088899,
        'modifiedDate': 1552884088899,
        'fullname': 'Thanh nv',
        'email': 'ThanhNv@fds.vn',
        urlImage: 'https://media.gettyimages.com/photos/yellow-shafted-northern-flicker-picture-id173086226'
      }] */
      window.axios.get(vm.end_point + 'visitlogs/' + this.class_name + '/' + this.class_pk + '?start=-1&end=-1')
        .then(function (response) {
          if (response.data.hasOwnProperty('data')) {
            vm.visitLogsItems = [].concat(response.data.data)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
.no-visit-log {
  height: 300px;
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>

