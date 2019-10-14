<template>
  <div class="mobilink-users-component fullwidth">
    <v-layout wrap>

      <v-flex sm3 xs3 class="px-2">
        <div class="base-administration-list scrollClass" v-scroll="onScroll">
          <v-list class="scrollChildClass">
            <template v-for="(item, index) in userItems"
            >
              <v-list-tile @click="detailUser(item)"
                :class="{'superadmin-active': item.userId === userSelected.userId, 
                  'primary--text': item.userId === userSelected.userId}"
              >
                <v-list-tile-content>
                  <v-list-tile-title><b>{{ item.fullName }}</b></v-list-tile-title>
                  <v-list-tile-title>{{ item.email }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </div>
      </v-flex>
      <v-flex sm9 xs9 class="scrollClass setHeightClass mobilink-users-component-right">
        <UserDetail
          :isDetail="isDetail"
          :user="userSelected"
          ref='userdetail'
          @change-email="changeemail"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import UserDetail from './UserDetail'
  const COMPONENT_NAME = 'mobilink-users'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {UserDetail},
    computed: {
      staticRouter () {
        return this.$store.getters.staticRouter
      }
    },
    watch: {
      '$store.getters.keywords' (val) {
        this.keywords = val
        this.pagination = {
          page: 1
        }
        this.runDispatchUser()
      }
    },
    data () {
      return {
        isLoading: false,
        btnActionIsLoading: false,
        userSelected: {},
        isDetail: false,
        keywords: this.$store.getters.keywords || '',
        pagination: {
          page: 1,
          total: 1
        },
        paginationSize: 20,
        heightFull: 0,
        userItems: [],
        paginationLength: 0
      }
    },
    created () {
      this.$nextTick(function () {
        this.runDispatchUser()
      })
    },
    methods: {
      onScroll () {
        var vm = this
        if (window.$('.base-administration-list').scrollTop() + window.$('.base-administration-list').height() === vm.heightFull) {
          if (window.$('.base-administration-list').scrollTop() !== 0) {
            vm.pagination.page = vm.pagination.page + 1
            if (vm.paginationLength >= vm.pagination.page) {
              vm.runDispatchUser(true)
            }
          }
        }
      },
      changeemail (email, id) {
        for (let key in this.userItems) {
          if (this.userItems[key].userId === id) {
            this.userItems[key].email = email
          }
        }
      },
      runDispatchUser (boolscroll) {
        let vm = this
        vm.userItems = []
        if (boolscroll === true) {
          window.$('.base-administration-list').animate({
            scrollTop: vm.heightFull - 40
          }, 600)
        }
        setTimeout(function () {
          vm.heightFull = window.$('.base-administration-list .scrollChildClass').height() + 16
        }, 499)
        let params = {
          start: this.pagination.page * this.paginationSize - this.paginationSize,
          end: this.pagination.page * this.paginationSize,
          class: 'employee',
          keywords: vm.keywords ? vm.keywords : ''
        }
        const config = {
          params: params,
          headers: {
            'groupId': vm.group_id
          }
        }
        window.axios.get(vm.end_point + 'users',
          config
        )
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              if (boolscroll === true) {
                vm.userItems = vm.userItems.concat(serializable.data)
              } else {
                vm.userItems = serializable.data
                if (serializable.data.length > 0) {
                  vm.detailUser(serializable.data[0])
                } else {
                  vm.isDetail = false
                }
              }
              vm.paginationLength = Math.ceil(serializable.total / vm.paginationSize)
            } else {
              vm.userItems = []
              vm.isDetail = false
            }
          })
          .catch(function (error) {
            console.log(error.response)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      },
      detailUser (item) {
        this.isDetail = true
        let result = {}
        window.$('.mobilink-users-component-right').animate({
          scrollTop: 0
        }, 600)
        Object.assign(result, item)
        this.userSelected = result
        this.$refs.userdetail.getRoles(result.userId)
      },
      onEditJobposSuccess (newJobpos) {
        this.detailJobpos(newJobpos)
      },
      paggingData (config) {
        this.pagination.page = config.page
        this.paginationSize = config.paginationSize
        this.runDispatchUser()
      }
    }
  }
</script>

<style>
  .className {
    display: flex;
    width: 100%
  }
  .className li {
    border: 1px solid red;
    margin-left: 10px
  }
  .base-administration-list {
    height: calc(100vh - 178px);
    overflow: auto;
  }
</style>
