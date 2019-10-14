import Vue from 'vue'
import Router from 'vue-router'
import CheckToken from '@/components/task_comp/CheckToken'
import NaviView from '@/components/task_comp/NaviView'
import Detail from '@/components/task_comp/DetailGuest'
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
    query: {
      template: false,
      sort: 'startDate_Number',
      order: true,
      type: 'TASK',
      join: 'own',
      startend: '0,1,2',
      editable: 1
    },
    viewTypes: [{icon: 'view_column', value: 'Kanban'}, {icon: 'list', value: 'TreeGrid'}],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: { description: 'owner of environment' },
    actions: ['share', 'info', 'delete']
  },
  {
    path: '/individual',
    alias: '',
    component: NaviView,
    name: 'cong_viec_ca_nhan',
    icon: 'person',
    query: {
      template: false,
      sort: 'startDate_Number',
      order: true,
      type: 'TASK',
      join: 'me',
      startend: '0,1,2',
      editable: 1
    },
    viewTypes: [{ icon: 'view_column', value: 'Kanban' }, { icon: 'list', value: 'TreeGrid' }],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: { description: 'owner of environment' },
    actions: ['share', 'info', 'delete']
  },
  {
    path: '/doer',
    alias: '',
    component: NaviView,
    name: 'cong_viec_toi_thuc_hien',
    icon: 'work_outline',
    query: {
      template: false,
      sort: 'startDate_Number',
      order: true,
      type: 'TASK',
      join: 'do',
      startend: '0,1,2',
      editable: 1
    },
    viewTypes: [{icon: 'view_column', value: 'Kanban'}, {icon: 'list', value: 'TreeGrid'}],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: { description: 'doer of environment' },
    actions: ['info']
  },
  {
    path: '/integration',
    alias: '',
    component: NaviView,
    name: 'cong_viec_toi_phoi_hop',
    icon: 'work_outline',
    query: {
      template: false,
      sort: 'startDate_Number',
      order: true,
      type: 'TASK',
      join: 'support',
      startend: '0,1,2',
      editable: 1
    },
    viewTypes: [{icon: 'view_column', value: 'Kanban'}, {icon: 'list', value: 'TreeGrid'}],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: { description: 'integration of environment' },
    actions: ['info']
  },
  {
    path: '/manager',
    alias: '',
    component: NaviView,
    name: 'cong_viec_toi_giao',
    icon: 'work_outline',
    query: {
      template: false,
      sort: 'startDate_Number',
      order: true,
      type: 'TASK',
      join: 'leader',
      startend: '0,1,2',
      editable: 1
    },
    viewTypes: [{icon: 'view_column', value: 'Kanban'}, {icon: 'list', value: 'TreeGrid'}],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: { description: 'manager of environment' },
    actions: ['share', 'info']
  },
  {
    path: '/follow',
    alias: '',
    component: NaviView,
    name: 'cong_viec_toi_theo_doi',
    icon: 'find_in_page',
    query: {
      template: false,
      sort: 'startDate_Number',
      order: true,
      type: 'TASK',
      join: 'follow',
      startend: '0,1,2',
      editable: 1
    },
    viewTypes: [{icon: 'view_column', value: 'Kanban'}, {icon: 'list', value: 'TreeGrid'}],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: { description: 'follow of environment' },
    actions: ['share', 'info']
  },
  {
    path: '/all',
    alias: '',
    component: NaviView,
    name: 'tat_ca_cong_viec',
    icon: 'assignment',
    query: {
      template: false,
      sort: 'startDate_Number',
      order: true,
      type: 'TASK',
      all: true,
      editable: 1
    },
    viewTypes: [{icon: 'view_column', value: 'Kanban'}, {icon: 'list', value: 'TreeGrid'}],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: { description: 'all of environment' },
    actions: ['info']
  },
  {
    path: '/npublish',
    alias: '',
    component: NaviView,
    name: 'luu_nhap',
    icon: 'work_outline',
    query: {
      template: false,
      sort: 'startDate_Number',
      order: true,
      type: 'TASK',
      editable: 0
    },
    viewTypes: [{ icon: 'list', value: 'TreeGrid' }],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: { description: 'npublish of environment' },
    actions: [],
    selectionType: true
  },
  {
    path: '/trash',
    alias: 'TreeGrid',
    component: NaviView,
    name: 'thung_rac',
    icon: 'delete_outline',
    query: {
      template: false,
      sort: 'startDate_Number',
      order: true,
      type: 'TASK',
      editable: 2,
      join: 'follow,leader,support,do,me,own'
    },
    viewTypes: [{ icon: 'list', value: 'TreeGrid' }],
    view: 'TreeGrid',
    total: 0,
    totalTreeResult: 0,
    meta: { description: 'trash of environment' },
    actions: ['info', 'delete']
  }
]

// Routes
const activityTaskRouter = [
  {
    path: '/detail/:id',
    name: 'CreateToken',
    component: CheckToken,
    meta: { description: 'CreateToken of environment' }
  },
  {
    path: '/detail/:id/:token',
    name: 'Detail',
    component: Detail,
    meta: { description: 'Detail of environment', checkPermission: true }
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
