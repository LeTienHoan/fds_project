<template>
  <div>
  <v-layout wrap pt-2 pl-2 pb-2 pr-2>
    <v-flex xs12 sm2 class="mt-2 pl-3">
      <v-subheader class="px-0">Từ ngày </v-subheader>
    </v-flex>
    <v-flex xs12 sm4>
      <v-date-picker v-bind:not-after="timeStartMax" class="mt-3"
        v-model="timeStart" placeholder="Chọn ngày" 
        :lang="language" type="date" :format="localeDateProperties.dateMomentPattern"
      ></v-date-picker>
    </v-flex>
    <v-flex xs12 sm2 class="pl-3 mt-2">
        <v-subheader class="px-0">Đến ngày </v-subheader>
    </v-flex>
    <v-flex xs12 sm4>
        <v-date-picker v-bind:not-before="timeEndMin" class="mt-3"
          v-model="timeEnd" placeholder="Chọn ngày" 
          :lang="language" type="date" :format="localeDateProperties.dateMomentPattern"
        ></v-date-picker>
    </v-flex>
    <v-flex xs12 sm2 class="mt-2 pl-3">
      <v-subheader class="px-0">Đơn vị tổ chức</v-subheader>
    </v-flex>
    <v-flex xs12 sm4>
      <v-select 
        v-bind:items="hostingIdItems"
        v-model="hostingId"
        item-text="name"
        item-value="workingUnitId"
        autocomplete
        hide-selected
        clearable
        return-object
      ></v-select>
    </v-flex>
    <v-flex xs12 sm2 class="mt-2 pl-3">
      <v-subheader class="px-0">Người chủ trì</v-subheader>
    </v-flex>
    <v-flex xs12 sm4>
      <v-select 
        v-bind:items="managerIdItems"
        v-model="managerId"
        clearable
        item-text="fullName"
        item-value="userId"
        autocomplete
        hide-selected
        return-object
        :filter="customFilterUser"
      >
        <template slot="item" slot-scope="data">
          <template>
            <v-list-tile-content>
              <v-list-tile-title v-html="data.item.fullName"></v-list-tile-title>
              <v-list-tile-sub-title v-html="data.item.email"></v-list-tile-sub-title>
            </v-list-tile-content>
          </template>
        </template>
      </v-select>
    </v-flex>
    <v-flex xs12 sm2 class="mt-2 pl-3">
      <v-subheader class="px-0">Trạng thái</v-subheader>
    </v-flex>
    <v-flex xs12 sm4>
      <v-select 
        v-bind:items="statusItems"
        v-model="status"
        item-text="statusName"
        item-value="statusCode"
        autocomplete
        hide-selected
        clearable
        return-object
      ></v-select>
    </v-flex>
    <v-flex xs12 sm2 class="mt-2 pl-3">
      <v-subheader class="px-0">Lĩnh vực</v-subheader>
    </v-flex>
    <v-flex xs12 sm4>
      <v-select 
        v-bind:items="activityCatItems"
        v-model="activityCat"
        item-text="categoryName"
        item-value="activityCat"
        autocomplete
        hide-selected
        clearable
        return-object
      ></v-select>
    </v-flex>
    <v-flex xs12 sm2 class="mt-2 pl-3">
      <v-subheader class="px-0">Địa điểm</v-subheader>
    </v-flex>
    <v-flex xs12 sm4>
      <v-select 
        v-bind:items="locationItems"
        v-model="locationId"
        item-text="location"
        item-value="locationId"
        autocomplete
        hide-selected
        clearable
        return-object
      ></v-select>
    </v-flex>
    <v-flex xs12 sm2 class="mt-2 pl-3">
      <v-subheader class="px-0">Thẻ nhãn</v-subheader>
    </v-flex>
    <v-flex xs12 sm4>
      <v-select 
        v-bind:items="resourceTagItems"
        v-model="resourceTag"
        item-text="tagCount"
        item-value="resourceTagId"
        autocomplete
        hide-selected
        clearable
        return-object
      ></v-select>
    </v-flex>
    <v-flex xs12 class="mt-3">
      <div class="right">
        <v-btn class="primary" @click="submitAdvanedSearch">
          <v-icon left>search</v-icon>
          <span>Tìm kiếm</span>
        </v-btn>
        <v-btn class="primary" @click="cancelAdvanedSearch">
          <v-icon left>close</v-icon>
          <span>Hủy</span>
        </v-btn>
      </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      timeStart: '',
      timeEnd: '',
      timeStartMax: '',
      timeEndMin: '',
      hostingId: '',
      managerId: '',
      status: '',
      activityCat: '',
      locationId: '',
      resourceTag: ''
    }
  },
  computed: {
    hostingIdItems () {
      return this.$store.getters.workingunitsItems
    },
    managerIdItems () {
      return this.$store.getters['user/userItems']
    },
    statusItems () {
      return this.$store.getters.statusItems
    },
    activityCatItems () {
      return this.$store.getters.activityCatItems
    },
    locationItems () {
      return this.$store.getters.locationsItems
    },
    resourceTagItems () {
      return this.$store.getters.resourcetagsItems
    }
  },
  methods: {
    submitAdvanedSearch () {
      let payload = []
      if (this.timeStart) {
        payload.push({
          key: 'timeStart',
          value: this.timeStart,
          text: this.timeStart,
          keytext: 'Từ ngày'
        })
      }
      if (this.timeEnd) {
        payload.push({
          key: 'timeEnd',
          value: this.timeEnd,
          text: this.timeEnd,
          keytext: 'Đến ngày'
        })
      }
      if (this.hostingId) {
        payload.push({
          key: 'hostingId',
          value: this.hostingId.workingUnitId,
          text: this.hostingId.name,
          obj: this.hostingId,
          keytext: 'Đơn vị tổ chức'
        })
      }
      if (this.managerId) {
        payload.push({
          key: 'managerId',
          value: this.managerId.userId,
          text: this.managerId.fullName,
          obj: this.managerId,
          keytext: 'Người chủ trì'
        })
      }
      if (this.status) {
        payload.push({
          key: 'status',
          value: this.status.managerId,
          text: this.status.statusName,
          obj: this.status,
          keytext: 'Trạng thái'
        })
      }
      if (this.activityCat) {
        payload.push({
          key: 'activityCat',
          value: this.activityCat.activityCat,
          text: this.activityCat.categoryName,
          obj: this.activityCat,
          keytext: 'Lĩnh vực'
        })
      }
      if (this.locationId) {
        payload.push({
          key: 'locationId',
          value: this.locationId.locationId,
          text: this.locationId.location,
          obj: this.locationId,
          keytext: 'Địa điểm'
        })
      }
      if (this.resourceTag) {
        payload.push({
          key: 'resourceTag',
          value: this.resourceTag.resourceTagId,
          text: this.resourceTag.tagCount,
          obj: this.resourceTag,
          keytext: 'Thẻ nhãn'
        })
      }
      this.$store.dispatch('setAdvancedSearch', payload)
      this.$emit('active', false)
    },
    cancelAdvanedSearch () {
      this.$emit('active', false)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.dispatch('setWorkingunitsItems')
      this.$store.dispatch('setStatusItems')
      this.$store.dispatch('setActivityCatItems')
      this.$store.dispatch('setLocationsItems')
      this.$store.dispatch('setResourcetagsItems')

      let setAdvancedSearchModel = this.$store.getters.advancedSearch
      let vm = this
      for (let key in setAdvancedSearchModel) {
        vm[setAdvancedSearchModel[key]['key']] = setAdvancedSearchModel[key]['obj']
      }
    })
  }
}
</script>