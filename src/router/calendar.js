import Vue from 'vue'
import Router from 'vue-router'
import CalendarMain from '@/components/activity/CalendarMain'
import ListTable from '@/components/activity/ListTable'
// import ListAllEvent from '@/components/activity/ListAllEvent'
import ListWeek from '@/components/activity/ListWeek'
import ListMonth from '@/components/activity/ListMonth'
import MobilinkActivityManager from '@/components/activity/MobilinkActivityManager'
import ListTableNotPublish from '@/components/activity/ListTableNotPublish'
import ListTableTrash from '@/components/activity/ListTableTrash'
import Detail from '@/components/activity/Detail'
import NoPrmission from '@/components/task_comp/NoPermission'
import MWeekView from '@/components/activity/MWeekView'
import HelloWorld from '@/components/HelloWorld'
import PersonalWrap from '@/components/activity/PersonalWrap'
import WorkspaceWrap from '@/components/activity/WorkspaceWrap'

Vue.use(Router)
var viewTypes = [
  {
    path: 'month',
    alias: '/month',
    component: ListMonth,
    name: 'lich_thang',
    meta: { description: 'ListTable of environment', icon: 'date_range', type: 'workspace' }
  },
  {
    path: 'week',
    alias: '/week',
    component: ListWeek,
    name: 'lich_tuan',
    meta: { description: 'ListTable of environment', icon: 'calendar_today', type: 'workspace' }
  },
  {
    path: 'list',
    alias: '/list',
    component: ListTable,
    name: 'danh_sach_lich',
    meta: { description: 'ListTable of environment', icon: 'reorder', type: 'workspace' }
  }
]
var viewTypes2 = [
  {
    path: 'month',
    alias: '/month',
    component: ListMonth,
    name: 'lich_thang',
    meta: { description: 'ListTable of environment', icon: 'date_range', type: 'personal' }
  },
  {
    path: 'week',
    alias: '/week',
    component: MWeekView,
    name: 'lich_tuan',
    meta: { description: 'ListTable of environment', icon: 'calendar_today', type: 'personal' }
  },
  {
    path: 'list',
    alias: '/list',
    component: ListTable,
    name: 'danh_sach_lich',
    meta: { description: 'ListTable of environment', icon: 'reorder', type: 'personal' }
  }
]
var menuFilters = [
  {
    path: '/personal/:id',
    pathHidden: '/personal/',
    component: PersonalWrap,
    name: 'lich_ca_nhan',
    meta: {
      description: 'Personal of environment',
      id: 0,
      type: 'personal',
      query: {
        personalId: ''
      },
      icon: 'event_available',
      childrens: [
        // {
        //   name: 'Lịch của tôi',
        //   id: 0,
        //   type: 'personal',
        //   pathHidden: '/personal/',
        //   query: {
        //     personalId: ''
        //   },
        //   icon: 'person'
        // }
      ]
    },
    children: viewTypes2
  },
  {
    path: 'workspace/:id',
    pathHidden: '/workspace/',
    component: WorkspaceWrap,
    name: 'lich_co_quan',
    meta: {
      description: 'Workspace of environment',
      id: 0,
      type: 'workspace',
      query: {
        workspace: ''
      },
      icon: 'event_available',
      childrens: [
        // {
        //   name: 'Toàn cơ quan',
        //   id: 0,
        //   type: 'workspace',
        //   pathHidden: '/workspace/',
        //   query: {
        //     workspace: ''
        //   },
        //   icon: 'folder'
        // }
      ]
    },
    children: viewTypes
  },
  /** {
    path: '/all',
    alias: '',
    component: ListAllEvent,
    name: 'tat_ca_cac_cuoc_hop',
    meta: {
      description: 'ListAllEvent of environment',
      query: {
        all: true
      },
      icon: 'event'
    }
  }, */
  {
    path: '/result',
    component: MobilinkActivityManager,
    name: 'theo_doi_ket_luan',
    meta: {
      description: 'MobilinkActivityManager of environment',
      query: {
        all: true
      },
      icon: 'search'
    }
  },
  {
    path: '/npublish',
    component: ListTableNotPublish,
    name: 'luu_nhap',
    meta: {
      description: 'ListTableNotPublish of environment',
      query: {
        all: true
      },
      icon: 'record_voice_over'
    }
  },
  {
    path: '/trash',
    component: ListTableTrash,
    name: 'thung_rac',
    meta: {
      description: 'ListTableTrash of environment',
      query: {
        all: true
      },
      icon: 'delete'
    }
  }
]
// Routes
const activityRouter = [
  {
    path: '/',
    component: CalendarMain,
    children: menuFilters.concat([
      {
        path: '/detail/:id',
        name: 'Detail',
        component: Detail,
        meta: { description: 'Detail of environment', checkPermission: true }
      }
    ]),
    meta: {
      description: 'person of environment', redirectPage: true, nextTo: '/personal/0/month'
    }
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
  routes: activityRouter,
  linkExactActiveClass: 'active'
})

export { router as default, menuFilters, viewTypes, viewTypes2 }
