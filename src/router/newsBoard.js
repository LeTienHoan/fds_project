import Vue from 'vue'
import Router from 'vue-router'
import NewsBoardMain from '@/components/newsboard/NewsBoardMain'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

// Menu filter
const menuFilter = [
  {
    path: '/notification',
    alias: '/',
    component: NewsBoardMain,
    name: 'thong_bao',
    icon: 'speaker_notes',
    meta: {
      query: {
        template: false,
        sort: 'endDate_Number',
        order: false,
        newsType: 'ANNOUNCE',
        editable: 1
      },
      position: 'top',
      description: 'new of environment'
    },
    total: 0,
    countUnread: 0
  },
  {
    path: '/qna',
    alias: '/',
    component: NewsBoardMain,
    name: 'hoi_dap',
    icon: 'speaker_notes',
    meta: {
      query: {
        template: false,
        sort: 'endDate_Number',
        order: false,
        newsType: 'FAQ',
        editable: 1
      },
      position: 'top',
      description: 'new of environment'
    },
    total: 0,
    countUnread: 0
  },
  {
    path: '/mine',
    alias: '',
    component: NewsBoardMain,
    name: 'tin_cua_toi',
    icon: 'speaker_notes',
    meta: {
      query: {
        template: false,
        sort: 'endDate_Number',
        order: false,
        permission: 'owner',
        me: true,
        editable: 1
      },
      position: 'top',
      description: 'mine of environment'
    },
    total: 0
  },
  {
    path: '/all',
    alias: '',
    component: NewsBoardMain,
    name: 'tin_tong_hop',
    icon: 'speaker_notes',
    meta: {
      query: {
        template: false,
        sort: 'endDate_Number',
        order: false,
        editable: 1
      },
      position: 'bottom',
      description: 'all of environment'
    }
  },
  {
    path: '/trash',
    alias: '',
    component: NewsBoardMain,
    name: 'thung_rac',
    icon: 'delete_outline',
    meta: {
      query: {
        template: false,
        sort: 'endDate_Number',
        order: false,
        editable: 2,
        permission: 'owner',
        me: true
      },
      position: 'bottom',
      description: 'trash of environment'
    },
    total: 0,
    countUnread: 0
  },
  {
    path: '/workspace/:workspaceId',
    alias: '',
    component: NewsBoardMain,
    name: 'thu_muc',
    icon: 'folder',
    meta: {
      query: {
        template: false,
        sort: 'endDate_Number',
        order: false,
        editable: 1
      },
      description: 'workspace of environment',
      type: 'workspace'
    }
  }
]

const router = new Router({
  routes: menuFilter.concat([
    {
      // not found handler
      path: '*',
      component: HelloWorld
    }
  ]),
  linkExactActiveClass: 'active'
})

export { router as default, menuFilter }
