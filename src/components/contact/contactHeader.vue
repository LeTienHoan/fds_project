<template>
  <div class="contact-header">
    <v-layout wrap class="px-3 align-center">
      <div>
        <b>{{ textHeader }}</b> <span><i>Tổng số {{ count }} kết quả </i></span>
      </div>
      <div class="ml-3 employees-advanced-wrap">
        <v-text-field
          placeholder="Tìm theo tên, điện thoại, email, tên tổ chức..."
          v-model="searchModel"
          required
          v-on:keyup.enter="searchContact"
          append-icon="search"
          v-if="$route.path === '/group'"
        ></v-text-field>
        <v-layout wrap v-else>
          <v-flex xs12 class="d-flex align-center">
            <v-select
              :items="advancedSearchFieldItems"
              v-model="advancedSearchValue"
              item-text="fieldName"
              item-value="fieldValue"
              autocomplete
              multiple
              chips
              tags
              return-object
              no-data-text=""
              placeholder="Tìm theo từ khóa, liên lạc cá nhân, liên lạc tổ chức"
              @input = "searchKeyword($event)"
            >
              <template slot="selection" slot-scope="data">
                <v-chip
                  @input="deleteClear(data)"
                  class="chip--select-multi"
                  :selected="data.selected"
                  :disabled="data.disabled"
                  :key="JSON.stringify(data.item)"
                  close
                >
                  {{ data.item.fieldName }}
                </v-chip>
              </template>
            </v-select>
          </v-flex>
        </v-layout>
      </div>
    </v-layout>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'contact-header'
  export default {
    name: COMPONENT_NAME,
    components: {
    },
    props: {
      count: ''
    },
    watch: {
    },
    computed: {
      textHeader () {
        return this.$store.getters.textHeader
      }
    },
    data () {
      return {
        searchModel: '',
        advancedSearchValue: '',
        advancedSearchFieldItems: [
          {
            fieldValue: 'person',
            fieldName: 'Liên lạc cá nhân'
          },
          {
            fieldValue: 'organization',
            fieldName: 'Liên lạc tổ chức'
          }
        ],
        current: 0
      }
    },
    created () {
      this.$nextTick(function () {
      })
    },
    methods: {
      searchContact () {
        this.$store.dispatch('searchContact', this.searchModel)
      },
      deleteClear (data) {
        this.advancedSearchValue = this.advancedSearchValue.filter(function (i) {
          return data.item.fieldValue !== i.fieldValue
        })
        this.$store.dispatch('searchContact', this.advancedSearchValue)
      },
      searchKeyword: function (event) {
        // let vm = this
        if (event.length > 0 && typeof event[event.length - 1] === 'string') {
          if (event[event.length - 2] && event[event.length - 2].fieldName.indexOf('keywords') >= 0) {
            this.advancedSearchValue[event.length - 2] = {
              fieldName: 'keywords:' + event[event.length - 1],
              fieldValue: 'keywords'
            }
            this.advancedSearchValue.splice(event.length - 1, 1)
          } else {
            this.advancedSearchValue[event.length - 1] = {
              fieldName: 'keywords:' + event[event.length - 1],
              fieldValue: 'keywords'
            }
          }
        } else if (event.length > 0 && typeof event[event.length - 1] === 'object') {
          let advanced = []
          let keyw = []
          for (var key in event) {
            if (event[event.length - (Number(key) + 1)].fieldName.indexOf('keywords') >= 0) {
              keyw.push(event[event.length - (Number(key) + 1)])
            } else {
              advanced.push(event[event.length - (Number(key) + 1)])
            }
          }
          this.advancedSearchValue = advanced.concat(keyw)
        }
        this.$store.dispatch('searchContact', this.advancedSearchValue)
      }
    }
  }
</script>
<style type="text/css" scoped>
  .truncated {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .employees-advanced-wrap {
    display: flex;
    flex: 1 1;
    flex-wrap: wrap;
    min-width: 24px;
    padding: 10px;
    position: relative;
    width: 100%;
    outline: none;
  }
  .employees-advanced {
    position: absolute;
    top: 100%;
    width: calc(100% - 70px);
    box-shadow: 0px 2px 5px 1px rgba(0,0,0,0.2);
    border-top: 1px solid #039be5;
    background-color: white;
    padding: 5px 20px 10px 0;
  }
</style>