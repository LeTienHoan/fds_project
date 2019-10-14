import Vue from 'vue'
import Router from 'vue-router'
import SuperAdminMgt from '@/components/super_admin/SuperAdminMgt'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)
// Menu filter
var menuFilters = [
  {
    'id': 1,
    'name': 'du_lieu_dung_chung',
    'accessible': true,
    'parentId': 0,
    'icon': 'folder',
    'icon_active': 'folder_open',
    'color': 'amber accent-2',
    'componentDynamic': import('@/components/HelloWorld')
  },
  {
    'id': 2,
    'name': 'he_thong',
    'parentId': 0,
    'icon': 'settings',
    'icon_active': 'settings_applications',
    'color': 'blue-grey lighten-2',
    'componentDynamic': import('@/components/HelloWorld')
  },
  {
    'id': 3,
    'name': 'tu_dien',
    'code': 'worktime',
    'parentId': 1,
    'icon': 'import_contacts',
    'icon_active': 'import_contacts',
    'color': 'cyan darken-1',
    'componentDynamic': import('@/components/administration/DictCollection')
  },
  {
    'id': 4,
    'name': 'nhom_danh_muc',
    'code': 'worktime',
    'parentId': 1,
    'icon': 'file_copy',
    'icon_active': 'file_copy',
    'color': 'green darken-1',
    'componentDynamic': import('@/components/administration/DictGroup')
  },
  {
    'id': 5,
    'name': 'danh_muc',
    'code': 'worktime',
    'parentId': 1,
    'icon': 'library_books',
    'icon_active': 'library_books',
    'color': 'orange lighten-2',
    'componentDynamic': import('@/components/administration/DictItem')
  },
  /** {
    'id': 4,
    'name': 'quan_ly_danh_muc',
    'code': 'worktime',
    'parentId': 1,
    'icon': 'folder',
    'icon_active': 'folder_open',
    'color': 'amber accent-2',
    'componentDynamic': import('@/components/HelloWorld')
  }, */
  {
    'id': 6,
    'name': 'phong_ban',
    'code': 'worktime',
    'parentId': 1,
    'icon': 'card_travel',
    'icon_active': 'work_outline',
    'color': 'blue-grey lighten-2',
    'componentDynamic': import('@/components/administration/WorkingUnit')
  },
  {
    'id': 7,
    'name': 'ngay_lam_viec',
    'code': 'worktime',
    'parentId': 1,
    'icon': 'event',
    'icon_active': 'event',
    'color': 'blue-grey lighten-2',
    'componentDynamic': import('@/components/administration/WorkTime')
  },
  {
    'id': 8,
    'name': 'ngay_nghi',
    'code': 'worktime',
    'parentId': 1,
    'icon': 'date_range',
    'icon_active': 'date_range',
    'color': 'blue-grey lighten-2',
    'componentDynamic': import('@/components/administration/Holiday')
  },
  {
    'id': 9,
    'name': 'nhom_chuc_nang',
    'code': 'worktime',
    'parentId': 1,
    'icon': 'extension',
    'icon_active': 'extension',
    'color': 'teal lighten-2',
    'componentDynamic': import('@/components/administration/Jobpos')
  },
  {
    'id': 17,
    'name': 'dia_diem',
    'code': 'location',
    'parentId': 1,
    'icon': 'location_on',
    'icon_active': 'location_on',
    'color': 'red accent-2',
    'componentDynamic': import('@/components/administration/Location')
  },
  {
    'id': 10,
    'name': 'nguoi_dung',
    'code': 'worktime',
    'parentId': 2,
    'icon': 'person',
    'icon_active': 'person',
    'color': 'light-blue darken-2',
    'componentDynamic': import('@/components/administration/User')
  },
  {
    'id': 11,
    'name': 'widget',
    'code': 'worktime',
    'parentId': 2,
    'icon': 'widgets',
    'icon_active': 'widgets',
    'color': 'cyan lighten-3',
    'componentDynamic': import('@/components/administration/Widget')
  },
  {
    'id': 16,
    'name': 'dashboard',
    'code': 'dashboard',
    'parentId': 2,
    'icon': 'dashboard',
    'icon_active': 'dashboard',
    'color': 'cyan lighten-3',
    'componentDynamic': import('@/components/administration/DashboardType')
  },
  {
    'id': 12,
    'name': 'quy_trinh',
    'code': 'worktime',
    'parentId': 2,
    'icon': 'bubble_chart',
    'icon_active': 'indigo lighten-2',
    'color': 'teal lighten-2',
    'componentDynamic': import('@/components/administration/State')
  },
  {
    'id': 13,
    'name': 'mau_thong_bao',
    'code': 'worktime',
    'parentId': 2,
    'icon': 'email',
    'icon_active': 'email',
    'color': 'blue-grey lighten-2',
    'componentDynamic': import('@/components/administration/NotificationTemplate')
  },
  {
    'id': 14,
    'name': 'phan_quyen_truy_cap',
    'code': 'worktime',
    'parentId': 2,
    'icon': 'announcement',
    'icon_active': 'announcement',
    'color': 'indigo darken-4',
    'componentDynamic': import('@/components/administration/AccessPermissions')
  },
  {
    'id': 15,
    'name': 'cau_hinh',
    'code': 'worktime',
    'parentId': 2,
    'icon': 'build',
    'icon_active': 'build',
    'color': 'teal darken-3',
    'componentDynamic': import('@/components/administration/Configuration')
  }
]
var routerChildrens = [
  {
    path: '/type/:id',
    alias: '/type',
    component: (pr, pr1, pr2) => {
      return import('@/components/super_admin/DynamicComp')
    },
    icon: 'person',
    total: 0,
    meta: { description: 'person of environment', notShow: true }
  }
]

// Routes
const ContactRouter = [
  {
    path: '/',
    component: SuperAdminMgt,
    children: routerChildrens,
    meta: {
      description: 'person of environment', redirectPage: true, nextTo: '/type/3' }
  },
  {
    // not found handler
    path: '*',
    component: HelloWorld
  }
]

const router = new Router({
  routes: ContactRouter,
  linkExactActiveClass: 'active'
})

export { router as default, menuFilters }
