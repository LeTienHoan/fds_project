import Vue from 'vue'
import Router from 'vue-router'
import TaskMain from '@/components/task_comp/TaskMain'
import NaviView from '@/components/task_comp/NaviView'
import Detail from '@/components/task_comp/DetailV2'
import NoPrmission from '@/components/task_comp/NoPermission'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

// Menu filter
const menuFilter = [
  {
    path: '/owner',
    alias: '/',
    component: NaviView,
    name: 'cong_viec_toi_tao',
    icon: 'work_outline',
    viewTypes: [{icon: 'view_column', value: 'Kanban'}, {icon: 'list', value: 'TreeGrid'}],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: {
      description: 'owner of environment',
      filterStyle: {
        possition: 'top',
        isStaticFilter: true
      },
      mapFilters: ['m_menu_toi_tao', 'm_menu_chua_hoan_thanh']
    },
    actions: ['share', 'info', 'delete']
  },
  {
    path: '/individual',
    alias: '',
    component: NaviView,
    name: 'cong_viec_ca_nhan',
    icon: 'person',
    viewTypes: [{ icon: 'view_column', value: 'Kanban' }, { icon: 'list', value: 'TreeGrid' }],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: {
      description: 'owner of environment',
      filterStyle: {
        possition: 'top',
        isStaticFilter: true
      },
      query: {
        template: false,
        sort: 'endDate_Number',
        order: false,
        type: 'TASK',
        join: 'me',
        startend: '0,1,2'/** ,
        editable: 1 */
      },
      mapFilters: ['m_menu_ca_nhan', 'm_menu_chua_hoan_thanh']
    },
    actions: ['share', 'info', 'delete']
  },
  {
    path: '/doer',
    alias: '',
    component: NaviView,
    name: 'cong_viec_toi_thuc_hien',
    icon: 'work_outline',
    viewTypes: [{icon: 'view_column', value: 'Kanban'}, {icon: 'list', value: 'TreeGrid'}],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: {
      description: 'doer of environment',
      filterStyle: {
        possition: 'top',
        isStaticFilter: true
      },
      query: {
        template: false,
        sort: 'endDate_Number',
        order: false,
        type: 'TASK',
        join: 'do',
        startend: '0,1,2'/** ,
        editable: 1 */
      },
      mapFilters: ['m_menu_toi_thuc_hien', 'm_menu_chua_hoan_thanh']
    },
    actions: ['info']
  },
  {
    path: '/integration',
    alias: '',
    component: NaviView,
    name: 'cong_viec_toi_phoi_hop',
    icon: 'work_outline',
    viewTypes: [{icon: 'view_column', value: 'Kanban'}, {icon: 'list', value: 'TreeGrid'}],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: {
      description: 'integration of environment',
      filterStyle: {
        possition: 'top',
        isStaticFilter: true
      },
      query: {
        template: false,
        sort: 'endDate_Number',
        order: false,
        type: 'TASK',
        join: 'support',
        startend: '0,1,2'/** ,
        editable: 1 */
      },
      mapFilters: ['m_menu_toi_phoi_hop', 'm_menu_chua_hoan_thanh']
    },
    actions: ['info']
  },
  {
    path: '/manager',
    alias: '',
    component: NaviView,
    name: 'cong_viec_toi_giao',
    icon: 'work_outline',
    viewTypes: [{icon: 'view_column', value: 'Kanban'}, {icon: 'list', value: 'TreeGrid'}],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: {
      description: 'manager of environment',
      filterStyle: {
        possition: 'top',
        isStaticFilter: true
      },
      query: {
        template: false,
        sort: 'endDate_Number',
        order: false,
        type: 'TASK',
        join: 'leader',
        startend: '0,1,2'/** ,
        editable: 1 */
      },
      mapFilters: ['m_menu_toi_giao', 'm_menu_chua_hoan_thanh']
    },
    actions: ['share', 'info']
  },
  {
    path: '/follow',
    alias: '',
    component: NaviView,
    name: 'cong_viec_toi_theo_doi',
    icon: 'find_in_page',
    viewTypes: [{icon: 'view_column', value: 'Kanban'}, {icon: 'list', value: 'TreeGrid'}],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: {
      description: 'follow of environment',
      filterStyle: {
        possition: 'top',
        isStaticFilter: true
      },
      query: {
        template: false,
        sort: 'endDate_Number',
        order: false,
        type: 'TASK',
        join: 'follow',
        startend: '0,1,2'/** ,
        editable: 1 */
      },
      mapFilters: ['m_menu_toi_theo_doi', 'm_menu_chua_hoan_thanh']
    },
    actions: ['share', 'info']
  },
  {
    path: '/finished',
    alias: '',
    component: NaviView,
    name: 'cong_viec_da_hoan_thanh',
    icon: 'work_outline',
    viewTypes: [{ icon: 'list', value: 'TreeGrid' }],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: {
      description: 'follow of environment',
      filterStyle: {
        possition: 'top',
        isStaticFilter: true
      },
      query: {
        template: false,
        sort: 'modified_Number',
        order: false,
        type: 'TASK',
        join: 'own',
        startend: '3',
        editable: '1'
      },
      mapFilters: ['m_menu_da_hoan_thanh']
    },
    actions: ['share', 'info']
  },
  {
    path: '/all',
    alias: '',
    component: NaviView,
    name: 'tat_ca_cong_viec',
    icon: 'assignment',
    viewTypes: [{icon: 'view_column', value: 'Kanban'}, {icon: 'list', value: 'TreeGrid'}],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: {
      description: 'all of environment',
      filterStyle: {
        possition: 'bottom',
        isStaticFilter: false
      },
      query: {
        template: false,
        sort: 'endDate_Number',
        order: false,
        type: 'TASK',
        join: 'all'/** ,
        editable: 1 */
      },
      mapFilters: ['m_menu_tat_ca', 'm_menu_chua_hoan_thanh']
    },
    actions: ['info']
  },
  {
    path: '/npublish',
    alias: '',
    component: NaviView,
    name: 'luu_nhap',
    icon: 'work_outline',
    viewTypes: [{ icon: 'list', value: 'TreeGrid' }],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: {
      description: 'npublish of environment',
      filterStyle: {
        possition: 'bottom',
        isStaticFilter: true
      },
      query: {
        template: false,
        sort: 'endDate_Number',
        order: false,
        type: 'TASK',
        editable: 0
      },
      mapFilters: ['m_menu_luu_nhap']
    },
    actions: [],
    selectionType: true
  },
  {
    path: '/trash',
    alias: 'TreeGrid',
    component: NaviView,
    name: 'thung_rac',
    icon: 'delete_outline',
    viewTypes: [{ icon: 'list', value: 'TreeGrid' }],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: {
      description: 'trash of environment',
      filterStyle: {
        possition: 'bottom',
        isStaticFilter: true
      },
      query: {
        template: false,
        sort: 'endDate_Number',
        order: false,
        type: 'TASK',
        editable: 2,
        join: 'follow,leader,support,do,me,own'
      },
      mapFilters: ['m_menu_thung_rac']
    },
    actions: ['info', 'republish', 'delete']
  },
  // workspace router
  {
    path: '/workspace/:workspaceId',
    component: NaviView,
    name: 'cong_viec_trong_thu_muc',
    icon: 'folder_open',
    viewTypes: [{ icon: 'view_column', value: 'Kanban' }, { icon: 'list', value: 'TreeGrid' }],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: {
      description: 'workspace of environment',
      query: {
        template: false,
        sort: 'endDate_Number',
        order: false,
        type: 'TASK',
        /** editable: 1, */
        workspace: 0
      }
    },
    actions: ['info']
  }
]

// Routes
const activityTaskRouter = [
  {
    path: '/',
    component: TaskMain,
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
