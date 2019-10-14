<template>
  <div class="d-flex align-center">
 <!--    <div style="text-align: left;position: absolute;line-height: 46px">Tổng số <span class="text-bold primary--text">{{total}}</span> bản ghi. </div> -->
<!--     <div v-if="total > 0" class="vue-tiny-pagination pagination layout" style="justify-content: flex-end; -webkit-justify-content: flex-end">
      <div class="px-3 xs4 flex">
        <v-select
          v-bind:items="totalPagesData"
          v-model="currentPage"
          item-text="text"
          item-value="value"
          autocomplete
          @input="goToPage"
        ></v-select>
      </div> -->
      <div class="select-page-size mr-2">
        <v-select
          :items="pageNumberItems"
          v-model="paginationSize"
          :width="55"
          :max-width="55"
          :min-width="55"
          no-data-text=""
          @input="changePageSize"
        ></v-select>
      </div>
      <ul class="tiny-pagination" :class="customClass">
        <li class="page-item" :class="classFirstPage">
          <button @click.prevent="lastPageLast" :class="classFirstPage" class="pagination__navigation">
            <i aria-hidden="true" class="material-icons icon">first_page</i>
          </button>
        </li>
        <li class="page-item" :class="classFirstPage">
          <button @click.prevent="lastPage" :class="classFirstPage" class="pagination__navigation" style="border-left: 0;">
            <i aria-hidden="true" class="material-icons icon">chevron_left</i>
          </button>
        </li>
        <li class="page-item" style="margin-right: 0;">
          <button class="pagination__navigation pagination__navigation--disabled text-bold primary--text" style="border-right: 0; border-left: 0;">
            {{titlePage}}
          </button>
        </li>
        <li class="page-item" :class="classLastPage" style="margin-right: 0;">
          <button @click.prevent="nextPage" :class="classLastPage" class="pagination__navigation" style="border-left: 0;">
            <i aria-hidden="true" class="material-icons icon">chevron_right</i>
          </button>
        </li>
        <li class="page-item" :class="classLastPage">
          <button @click.prevent="nextPageLast" :class="classLastPage" class="pagination__navigation">
            <i aria-hidden="true" class="material-icons icon">last_page</i>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const COMPONENT_NAME = 'TinyPagination'
export default {
  name: COMPONENT_NAME,
  props: {
    total: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      default: 1
    },
    paginationSize: {
      type: Number,
      default: 1
    },
    lang: {
      type: String,
      default: 'en'
    },
    customClass: {
      type: String
    },
    limits: {
      type: Array,
      default () {
        return [10, 15, 20, 50, 100]
      }
    },
    showLimit: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      version: '0.2.1',
      currentPage: 1,
      currentLimit: 15,
      translations: {
        en: {
          prev: 'Previous',
          title: 'Page',
          next: 'Next'
        }
      },
      availableLanguages: ['en']
    }
  },
  created () {
    this.currentPage = this.page
  },
  watch: {
    page (val) {
      this.currentPage = parseInt(val)
    }
  },
  computed: {
    translation () {
      return this.availableLanguages.includes(this.lang)
        ? this.translations[this.lang]
        : this.translations['en']
    },
    totalPages () {
      return Math.ceil(this.total / this.paginationSize)
    },
    totalPagesData () {
      let totalDatas = []
      let data = {}
      for (var index = 1; index <= this.totalPages; ++index) {
        data = {
          value: index,
          text: 'Trang ' + index
        }
        totalDatas.push(data)
      }
      return totalDatas
    },
    titlePage () {
      return `${this.currentPage}`
    },
    classFirstPage () {
      return {
        'c-not-allowed': this.currentPage === 1
      }
    },
    classLastPage () {
      return {
        'c-not-allowed': this.currentPage === this.totalPages
      }
    }
  },
  methods: {
    changePageSize () {
      this.$emit('tiny:change-page', {
        page: 1,
        paginationSize: this.paginationSize
      })
    },
    nextPage () {
      if (this.currentPage !== this.totalPages) {
        this.currentPage += 1
        this.$emit('tiny:change-page', {
          page: this.currentPage,
          paginationSize: this.paginationSize
        })
      }
    },
    lastPage () {
      if (this.currentPage > 1) {
        this.currentPage -= 1
        this.$emit('tiny:change-page', {
          page: this.currentPage,
          paginationSize: this.paginationSize
        })
      }
    },
    nextPageLast () {
      this.currentPage = this.totalPages
      this.$emit('tiny:change-page', {
        page: this.totalPages,
        paginationSize: this.paginationSize
      })
    },
    lastPageLast () {
      this.currentPage = 1
      this.$emit('tiny:change-page', {
        page: 1,
        paginationSize: this.paginationSize
      })
    },
    goToPage () {
      this.$emit('tiny:change-page', {
        page: this.currentPage,
        paginationSize: this.paginationSize
      })
    },
    onLimitChange () {
      this.currentPage = 1
    }
  }
}
</script>
<style>
.application .theme--light.pagination__item,.theme--light .pagination__item {
    background: #fff;
    color: #000
}

.application .theme--light.pagination__item--active,.theme--light .pagination__item--active {
    color: #fff
}

.application .theme--light.pagination__navigation,.theme--light .pagination__navigation {
    background: #fff
}

.application .theme--light.pagination__navigation .icon,.theme--light .pagination__navigation .icon {
    color: rgba(0,0,0,.54)
}

.application .theme--dark.pagination__item,.theme--dark .pagination__item {
    background: #424242;
    color: #fff
}

.application .theme--dark.pagination__item--active,.theme--dark .pagination__item--active {
    color: #fff
}

.application .theme--dark.pagination__navigation,.theme--dark .pagination__navigation {
    background: #424242
}

.application .theme--dark.pagination__navigation .icon,.theme--dark .pagination__navigation .icon {
    color: #fff
}

.pagination {
    display: -ms-inline-flexbox;
    display: inline-flex;
    list-style-type: none;
    margin: 0;
    max-width: 100%;
    padding: 0
}

.pagination,.pagination>li {
    -ms-flex-align: center;
    align-items: center
}

.pagination>li {
    display: -ms-flexbox;
    display: flex
}

.pagination--circle .pagination__item,.pagination--circle .pagination__more,.pagination--circle .pagination__navigation {
    border-radius: 50%
}

.pagination--disabled {
    pointer-events: none;
    opacity: .6
}

.pagination__item {
    border-radius: 4px;
    font-size: 14px;
    background: transparent;
    height: 34px;
    width: 34px;
    margin: .3rem;
    transition: .3s cubic-bezier(0,0,.2,1)
}

.pagination__item,.pagination__navigation {
    display: -ms-inline-flexbox;
    display: inline-flex;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    text-decoration: none
}

.pagination__navigation {
    height: 30px;
    border: 1px solid #ccc;
    width: 30px;
    margin: 0
}

.pagination__navigation .icon {
    font-size: 18px;
    transition: .2s cubic-bezier(.4,0,.6,1);
    vertical-align: middle
}

.pagination__navigation--disabled {
    opacity: .6;
    pointer-events: none
}

.pagination__more {
    margin: .3rem;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -ms-flex-align: end;
    align-items: flex-end;
    -ms-flex-pack: center;
    justify-content: center;
    height: 2rem;
    width: 2rem
}
body .tiny-pagination {
    list-style: none;
}

body .tiny-pagination,body .vue-tiny-pagination {
    display: -ms-flexbox;
    display: flex
}

body .vue-tiny-pagination>div {
    max-width: 120px!important
}
.datatable__actions__pagination {
    display: block;
    text-align: center;
    margin: 0 32px 0 24px
}
</style>