<template>
<keep-alive>
  <div v-if="!active" class="text-xs-right pr-5 grey--text">
    <i v-show="false">Chưa sẵn sàng</i>
  </div>
  <div v-else-if="componentActive" class="activity-task-advanced-wrap pr-0">
    <span style="flex: 1 1;"
      @click="showAdvanedType = 'filter'"
    >
      <v-select
        class="select-advanced-multichip"
        v-model="advancedSearchValue"
        chips
        tags
        deletable-chips
        item-text="text"
        item-value="value"
        return-object
        multiple
        placeholder="Gõ từ khóa để tìm kiếm"
        @input="advancedSearchValueOnAddWorkspaceOrRemoveByBackspace"
        append-icon="clear"
        :append-icon-cb="($event) => (clearAll($event))"
      >
        <template slot="selection" slot-scope="data">
          <v-chip
            :selected="data.selected"
            :disabled="data.disabled"
            :key="JSON.stringify(data.item)"
            close
            :class="'chip--select-multi ' + data.item.bgClass"
            @input="deleteClear(data.item)"
          >
            <span @click.stop="showAdvanedType = false">{{ data.item.text }}</span>
          </v-chip>
        </template>
      </v-select>
    </span>
    <v-btn icon  flat color="primary"
      :class="{'ma-0': true, 'btn--active': showAdvanedType}"
      @click="showAdvanedType = showAdvanedType==='filter' ? false : 'filter'">
      <v-icon>filter_list</v-icon>
    </v-btn>
    <v-btn icon  flat color="primary"
      :class="{'ma-0': true, 'btn--active': showAdvanedType}"
      @click="showAdvanedType = showAdvanedType==='advancedSearch' ? false : 'advancedSearch'">
      <v-icon>search</v-icon>
    </v-btn>
    <v-slide-y-transition>
      <keep-alive>
      <div class="activity-task-advanced"
        v-if="showAdvanedType"
      >
        <AdvancedSearchLayout
          ref="advancedSearchLayoutRefs"
          v-show="showAdvanedType === 'filter'"
          :allowAddNew="allowAddNew"
          :active="showAdvanedType"
          :preferenceKey="apiKey.preferenceKey"
          :advancedsearchDictKey="apiKey.advancedsearchDictKey"
          :advancedsearchDefaultFilterKey="apiKey.advancedsearchDefaultFilterKey"
        />

        <AdvancedSearchEdit
          ref="advancedSearchEditRefs"
          v-show="showAdvanedType === 'advancedSearch' || showAdvanedType === 'edit' || showAdvanedType === 'add'"
          :showAdvanedType="showAdvanedType"
          :active="showAdvanedType"
          :preferenceKey="apiKey.preferenceKey"
          :advancedsearchDictKey="apiKey.advancedsearchDictKey"
          :advancedsearchDefaultFilterKey="apiKey.advancedsearchDefaultFilterKey"
        />

      </div>
      </keep-alive>
    </v-slide-y-transition>
  </div>
</keep-alive>
</template>

<script>
import AdvancedSearchLayout from './AdvancedSearchLayout'
import AdvancedSearchEdit from './AdvancedSearchEdit'
export default {
  props: {
    active: {
      default: false
    },
    apiKey: {
      type: Object,
      default: () => {
        return {
          preferenceKey: 'FILTERTASK',
          advancedsearchDictKey: 'dictionarytask',
          advancedsearchDefaultFilterKey: 'filtertask'
        }
      }
    },
    allowAddNew: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      advancedSearchValue: [],
      showAdvanedType: false,
      componentActive: false
    }
  },
  components: {
    AdvancedSearchLayout,
    AdvancedSearchEdit
  },
  watch: {
    active (val) {},
    cpAdvancedSearchNewQueries (val) {
      /** .push({
          text: '' + val.workspace,
          value: 'workspace',
          bgClass: 'amber accent-1 primary--text'
        } */
      this.advancedSearchValue = val
    }
  },
  computed: {
    cpAdvancedSearchNewQueries () {
      return this.$store.getters['advancedSearch/advancedSearchNewQueries'].advansearchListAmazings
    },
    dictZZZFields () {
      return this.$store.getters['advancedSearch/dictFields']
    },
    advancedSearchZItems () {
      return this.$store.getters['advancedSearch/advancedSearchItems']
    }
  },
  methods: {
    advancedSearchValueOnAddWorkspaceOrRemoveByBackspace (val) {
      console.log('delete by backspace', val)
      const advancedSearchLength = val.length
      const fakeNewKeywords = val[advancedSearchLength - 1]
      if (advancedSearchLength === 0) {
        this.$store.dispatch('advancedSearch/setAdvancedSearchNewQueries', {
          advansearchListAmazings: []
        })
      } else if (advancedSearchLength > 0 && typeof fakeNewKeywords === 'string') {
        // truong hop them moi keywords
        this.$store.dispatch('advancedSearch/setAdvancedSearchNewQueries', {
          advansearchListAmazings: this.cpAdvancedSearchNewQueries.filter(item => item.advancedSearchZUUID !== 'keywords')
            .concat([{
              text: 'Từ khóa: ' + fakeNewKeywords,
              advancedSearchZUUID: 'keywords',
              value: 'keywords',
              bgClass: 'green darken-1 white--text',
              query: {keywords: fakeNewKeywords}
            }])
        })
      } else {
        this.$store.dispatch('advancedSearch/setAdvancedSearchNewQueries', {
          advansearchListAmazings: val
        })
      }
      this.showAdvanedType = false
    },
    deleteClear (item) {
      this.$store.dispatch('advancedSearch/setAdvancedSearchNewQueries', {
        advansearchListAmazings: this.cpAdvancedSearchNewQueries.filter(i => i.advancedSearchZUUID !== item.advancedSearchZUUID)
      })
      this.showAdvanedType = false
    },
    clearAll () {
      this.$store.dispatch('advancedSearch/setAdvancedSearchNewQueries', {
        advansearchListAmazings: []
      })
      this.showAdvanedType = false
    },
    runDispatchAdvancedSearchItemsZ () {
      if (this.dictZZZFields.length === 0 && this.advancedSearchZItems.length === 0) {
        this.$store.dispatch('advancedSearch/getAdvancedSearchItems', {
          preferenceKey: this.preferenceKey,
          advancedsearchDefaultFilterKey: this.advancedsearchDefaultFilterKey,
          start: -1,
          end: -1
        })
        this.$store.dispatch('advancedSearch/getDictFields', {
          advancedsearchDictKey: this.advancedsearchDictKey,
          start: -1,
          end: -1
        })
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      let vm = this
      vm.componentActive = true
      this.advancedSearchValue = this.cpAdvancedSearchNewQueries
      window.$(document).on('click', function (e) {
        if (vm.showAdvanedType &&
          window.$(e.target).is('.activity-task-advanced-wrap, .activity-task-advanced-wrap *') === false
        ) {
          vm.showAdvanedType = false
        }
      })
      vm.runDispatchAdvancedSearchItemsZ()
    })
  },
  destroyed () {
    // delete this.initValue
    // delete this.advancedSearchValue
    // delete this.showAdvanedType
    // delete this.cpAdvancedSearchNewQueries
    // delete this.advancedSearchValueOnAddWorkspaceOrRemoveByBackspace
    // delete this.deleteClear
    // delete this.componentActive
  }
}
</script>

<style>

.activity-task-advanced-wrap {
    display: flex;
    flex: 1 1;
    flex-wrap: wrap;
    min-width: 24px;
    padding: 10px;
    position: relative;
    width: 100%;
    outline: none;
}
.activity-task-advanced-wrap .activity-task-advanced {
  position: absolute;
  /* top: 100%; */
  top: 74%;
  right: 0;
  width: calc(100% - 10px);
  box-shadow: 0px 2px 5px 1px rgba(0,0,0,0.2);
  z-index: 1;
  background-color: white;
}
.select-advanced-multichip .icon.material-icons.input-group__append-icon.input-group__icon-cb {
  /*display: none;*/
}
</style>

