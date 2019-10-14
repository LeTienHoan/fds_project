import Vue from 'vue'
import Router from 'vue-router'
import DocFileMain from '@/components/docfile/DocFileMain'
import NaviView from '@/components/docfile/NaviView'
import Detail from '@/components/docfile/Detail'
import NoPrmission from '@/components/task_comp/NoPermission'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

// Menu filter
const menuFilter = [
  {
    path: '/recently',
    alias: '/',
    component: NaviView,
    name: 'truy_cap_gan_day',
    icon: 'work_outline',
    meta: {
      position: 'top',
      query: {
        /** template: false, */
        sort: 'endDate_Number',
        order: false,
        recent: true
      },
      description: 'recently of environment',
      docFileOtherType: true,
      showTotal: false,
      total: 0,
      mapFilters: ['m_menu_gan_day']
    }
  },
  {
    path: '/mine',
    alias: '',
    component: NaviView,
    name: 'tai_lieu_cua_toi',
    icon: 'person',
    meta: {
      position: 'top',
      query: {
        /** template: false, */
        sort: 'endDate_Number',
        order: false,
        permission: 'owner'
      },
      description: 'mine of environment',
      docFileOtherType: true,
      showTotal: true,
      total: 0,
      keyGetTotal: 'me',
      mapFilters: ['m_menu_toi_tao']
    }

  },
  {
    path: '/waiting',
    alias: '',
    component: NaviView,
    name: 'van_ban_cho_thuc_hien',
    icon: 'pause_circle_outline',
    meta: {
      position: 'top',
      query: {
        /** template: false, */
        sort: 'endDate_Number',
        order: false,
        permission: 'invitation'
      },
      description: 'invitation of environment',
      docFileOtherType: false,
      showTotal: false,
      total: 0,
      mapFilters: ['m_menu_cho_thuc_hien']
    }

  },
  {
    path: '/van_ban_di',
    alias: '',
    component: NaviView,
    name: 'van_ban_di',
    icon: 'assignment',
    meta: {
      query: {
        /** template: false, */
        sort: 'endDate_Number',
        order: false,
        register: 1
      },
      description: 'register of environment',
      type: 'register',
      registerDoc: true,
      docFileOtherType: false,
      showTotal: false,
      total: 0,
      mapFilters: ['m_menu_van_ban_di']
    }
  },
  {
    path: '/van_ban_den',
    alias: '',
    component: NaviView,
    name: 'van_ban_den',
    icon: 'assignment',
    meta: {
      query: {
        /** template: false, */
        sort: 'endDate_Number',
        order: false,
        register: 2
      },
      description: 'register of environment',
      type: 'register',
      registerDoc: true,
      docFileOtherType: false,
      showTotal: false,
      total: 0,
      mapFilters: ['m_menu_van_ban_den']
    }
  },
  {
    path: '/tai_lieu_trinh_duyet',
    alias: '',
    component: NaviView,
    name: 'tai_lieu_trinh_duyet',
    icon: 'assignment',
    meta: {
      query: {
        /** template: false, */
        sort: 'endDate_Number',
        order: false,
        register: 3
      },
      description: 'register of environment',
      type: 'register',
      registerDoc: false,
      docFileOtherType: false,
      showTotal: false,
      total: 0,
      mapFilters: ['m_menu_tai_lieu_trinh_duyet']
    }
  },
  {
    path: '/don_thu_hanh_chinh',
    alias: '',
    component: NaviView,
    name: 'don_thu_hanh_chinh',
    icon: 'assignment',
    meta: {
      query: {
        /** template: false, */
        sort: 'endDate_Number',
        order: false,
        register: 4
      },
      description: 'register of environment',
      type: 'register',
      registerDoc: false,
      docFileOtherType: false,
      showTotal: false,
      total: 0,
      mapFilters: ['m_menu_don_thu_hanh_chinh']
    }
  },
  {
    path: '/tai_lieu_lay_y_kien_gop_y',
    alias: '',
    component: NaviView,
    name: 'tai_lieu_lay_y_kien_gop_y',
    icon: 'assignment',
    meta: {
      query: {
        /** template: false, */
        sort: 'endDate_Number',
        order: false,
        register: 5,
        showTotal: false,
        total: 0
      },
      description: 'register of environment',
      type: 'register',
      registerDoc: false,
      docFileOtherType: false,
      showTotal: false,
      total: 0,
      mapFilters: ['m_menu_tai_lieu_lay_y_kien_gop_y']
    }
  },
  {
    path: '/tai_lieu_luu_tru',
    alias: '',
    component: NaviView,
    name: 'tai_lieu_luu_tru',
    icon: 'assignment',
    meta: {
      query: {
        /** template: false, */
        register: 0
      },
      description: 'register of environment',
      type: 'register',
      registerDoc: true,
      docFileOtherType: false,
      showTotal: false,
      total: 0,
      mapFilters: ['m_menu_tai_lieu_luu_tru']
    }
  },
  {
    path: '/all',
    alias: '',
    component: NaviView,
    name: 'tat_ca_tai_lieu',
    icon: 'assignment',
    meta: {
      query: {
        /** template: false, */
        sort: 'endDate_Number',
        order: false
      },
      description: 'all of environment',
      docFileOtherType: true,
      showTotal: true,
      total: 0,
      keyGetTotal: 'all',
      mapFilters: ['m_menu_tat_ca']
    }
  },
  {
    path: '/trash',
    alias: '',
    component: NaviView,
    name: 'thung_rac',
    icon: 'delete_outline',
    meta: {
      query: {
        /** template: false, */
        sort: 'endDate_Number',
        order: false,
        editable: 2,
        permission: 'owner'
      },
      description: 'trash of environment',
      docFileOtherType: true,
      showTotal: true,
      total: 0,
      keyGetTotal: 'trash',
      mapFilters: ['m_menu_thung_rac', 'm_menu_toi_tao']
    }
  },
  {
    path: '/workspace/:workspaceId',
    alias: '',
    component: NaviView,
    name: (window.ACTIVITY_CONST && window.ACTIVITY_CONST.docFileOtherType === false) ? 'ho_so_luu_tru' : 'thu_muc_luu_tru',
    icon: 'folder',
    meta: {
      query: {
        /** template: false, */
        sort: 'endDate_Number',
        order: false
      },
      description: 'workspace of environment',
      type: 'workspace',
      docFileOtherType: true
    }
  }
]

// Routes
const activityTaskRouter = [
  {
    path: '/',
    component: DocFileMain,
    children: menuFilter.concat([
      {
        path: '/detail/:id',
        name: 'Detail',
        component: Detail,
        meta: { description: 'Detail of environment', checkPermission: true }
      }
    ])
  },
  {
    path: '/noprmission',
    name: 'NoPrmission',
    component: NoPrmission,
    meta: { description: 'NoPrmission of environment' }
  },
  {
    // not found handler
    path: '*',
    component: HelloWorld
  }
]

const router = new Router({
  routes: activityTaskRouter,
  linkExactActiveClass: 'active'
})

export { router as default, menuFilter }
