<template>
    <div :id="'chip-in-select'+id" class="chip-in-select" v-if="managerPermision(permission_prop)||resourceTag.length!=0">
      <!-- <v-flex xs12 sm2>
        <v-subheader class="px-0">Thẻ nhãn:</v-subheader>
      </v-flex> -->
      <v-flex xs12 sm12>

        <v-select
          v-bind:items="resourceTagItems"
          v-model="resourceTag"
          chips
          tags
          item-text="tagCount"
          item-value="resourceTagId"
          return-object
          hide-selected
          @input = "searchTag($event)"
          @keyup.delete = "keyupDelete($event)"
          :disabled = "managerPermision(permission_prop)&&complete==false?false:true"
        >
          <template slot="selection" slot-scope="data">
            <v-chip
              @input="deleteTag(data)"
              class="chip--select-multi"
              :selected="data.selected"
              :disabled="data.disabled"
              :key="JSON.stringify(data.item)"
              :close = "managerPermision(permission_prop)?true:false"
            >
              
              {{ data.item.tag?data.item.tag:data.item}}
            </v-chip>
          </template>
        </v-select>

      </v-flex>

    </div>
</template>


<script>
  const COMPONENT_NAME = 'jx-mobilink-chip-select'
  export default {
    name: COMPONENT_NAME,
    props: {
      id: null,
      class_pk: null,
      class_name: null,
      permission_prop: null,
      startend_prop: null
    },
    watch: {
    },
    created () {
      let vm = this
      vm.$nextTick(function () {
        console.log(vm._props)
        vm.initResourceTags()
      })
    },
    destroyed () {
      // delete this.id
      // delete this.class_pk
      // delete this.class_name
      // delete this.permission_prop
      // delete this.startend_prop
      // delete this.resourceTag
      // delete this.resourceTagItems
      // delete this.eventSearchTag
      // delete this.currentSeclected
      // delete this.currentResourceTag
      // delete this.complete
      // delete this.keyupDelete
      // delete this.initResourceTags
      // delete this.getResourseTag
      // delete this.getResourseTagClassPk
      // delete this.searchTag
      // delete this.addRessourceTag
      // delete this.deleteRessourceTag
      // delete this.deleteTag
      // delete this.managerPermision
    },
    data () {
      return {
        resourceTag: [],
        resourceTagItems: [],
        eventSearchTag: true,
        currentSeclected: 0,
        currentResourceTag: [],
        complete: false
      }
    },
    methods: {
      keyupDelete: function (event) {
        let vm = this
        // console.log(event)
        // console.log(vm)
        if (vm.resourceTag.length < vm.currentResourceTag.length) {
          let tagFilter = {}
          for (var key in vm.currentResourceTag) {
            let itemTag = true
            for (var keys in vm.resourceTag) {
              if (vm.currentResourceTag[key].resourceTagId === vm.resourceTag[keys].resourceTagId) {
                itemTag = false
                break
              }
            }
            if (itemTag) {
              tagFilter = vm.currentResourceTag[key]
            }
          }
          // console.log(tagFilter)
          vm.deleteRessourceTag(tagFilter.resourceTagId)
        }
      },
      initResourceTags: function () {
        let vm = this
        vm.getResourseTagClassPk()
      },
      getResourseTag: function () {
        let vm = this
        let paramsGetTags = {
        }
        const configGetTags = {
          params: paramsGetTags,
          headers: {
            'groupId': vm.group_id
          }
        }
        vm.resourceTagItems = []
        window.axios.get(vm.end_point + 'resourcetags', configGetTags)
          .then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              for (var key in serializable.data) {
                if (vm.resourceTag.length > 0) {
                  let itemTag = true
                  for (var keys in vm.resourceTag) {
                    if (serializable.data[key].tag === vm.resourceTag[keys].tag) {
                      itemTag = false
                      break
                    }
                  }
                  if (itemTag) {
                    vm.resourceTagItems.push({
                      tag: serializable.data[key].tag,
                      tagCount: serializable.data[key].tag + ' (' + serializable.data[key].count + ')',
                      resourceTagId: serializable.data[key].resourceTagId
                    })
                  }
                } else {
                  vm.resourceTagItems.push({
                    tag: serializable.data[key].tag,
                    tagCount: serializable.data[key].tag + ' (' + serializable.data[key].count + ')',
                    resourceTagId: serializable.data[key].resourceTagId
                  })
                }
              }
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      getResourseTagClassPk: function () {
        let vm = this
        let paramsGetTagsClassPk = {
        }
        const configGetTagClassPk = {
          params: paramsGetTagsClassPk,
          headers: {
            'groupId': vm.group_id
          }
        }
        vm.resourceTag = []
        window.axios.get(vm.end_point + 'resourcetags/' + vm.class_name + '/' + vm.class_pk, configGetTagClassPk)
          .then(function (response) {
            let serializable = response.data
            let dataTag = []
            if (serializable.hasOwnProperty('data')) {
              for (var key in serializable.data) {
                dataTag.push({
                  tag: serializable.data[key].tag,
                  resourceTagId: serializable.data[key].resourceTagId
                })
              }
              vm.resourceTag = dataTag
            }
            vm.currentSeclected = vm.resourceTag.length
            vm.currentResourceTag = vm.resourceTag
            vm.getResourseTag()
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      searchTag: function (event) {
        let vm = this
        setTimeout(function () {
          // console.log(event.length+'--'+vm.currentSeclected)
          if (event.length > vm.currentSeclected) {
            // console.log(vm)
            // console.log(event)
            let tagAdd = event[event.length - 1]
            if (typeof tagAdd === 'object') {
              tagAdd = tagAdd.tag
            }
            // console.log('-->tag = '+tagAdd)
            vm.addRessourceTag(tagAdd)
          }
          return false
        }, 200)
      },
      addRessourceTag: function (tag) {
        let vm = this
        vm.complete = true
        let dataPostResourceTag = new URLSearchParams()
        dataPostResourceTag.append('className', vm.class_name)
        dataPostResourceTag.append('classPK', vm.class_pk)
        dataPostResourceTag.append('tag', tag)
        let paramsPostResourceTag = {
        }
        const configPostResourceTag = {
          params: paramsPostResourceTag,
          headers: {
            'groupId': vm.group_id
          }
        }
        let urlUpdate = vm.end_point + 'resourcetags'
        window.axios.post(urlUpdate, dataPostResourceTag, configPostResourceTag)
          .then(function (response) {
            // setTimeout(function () {
            vm.complete = false
            vm.resourceTag[vm.resourceTag.length - 1] = {'resourceTagId': response.data.resourceTagId, 'tag': response.data.tag}
            vm.currentSeclected = vm.resourceTag.length
            vm.currentResourceTag = vm.resourceTag
            // vm.getResourseTagClassPk()
            window.showMessageToastr('success', 'Thêm thẻ nhãn thành công')
            vm.getResourseTag()
            // }, 1000)
          })
          .catch(function (error) {
            vm.complete = false
            window.showMessageByAPICode(error.response.status, error.response.data)
            vm.getResourseTagClassPk()
            console.log(error.response)
          })
      },
      deleteRessourceTag: function (tagId) {
        let vm = this
        vm.complete = true
        let paramsDeleteResourceTag = {
        }
        const configDeleteResourceTag = {
          params: paramsDeleteResourceTag,
          headers: {
            'groupId': vm.group_id
          }
        }
        let urlUpdate = vm.end_point + 'resourcetags/' + tagId
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Xóa dữ liệu...'
        })
        window.axios.delete(urlUpdate, configDeleteResourceTag)
          .then(function (response) {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageToastr('success', 'Xóa thẻ nhãn thành công')
            vm.currentSeclected -= 1
            setTimeout(function () {
              vm.complete = false
              // vm.getResourseTagClassPk()
              console.log(vm.resourceTag)
              vm.getResourseTag()
            }, 1000)
          })
          .catch(function (error) {
            vm.complete = false
            vm.getResourseTagClassPk()
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            window.showMessageByAPICode(error.response.status, error.response.data)
            console.log(error.response)
          })
      },
      deleteTag: function (data) {
        let vm = this
        setTimeout(function () {
          // console.log('Event Input Chip')
          // console.log(data)
          data.parent.selectItem(data.item)
          console.log(data.item)
          let resourceTagId = data.item.resourceTagId
          vm.deleteRessourceTag(resourceTagId)
        }, 200)
      },
      managerPermision: function (permision) {
        if ('owner,leader'.indexOf(permision) >= 0) {
          return true
        } else {
          return false
        }
      }
    }
  }
</script>

<style>

</style>
