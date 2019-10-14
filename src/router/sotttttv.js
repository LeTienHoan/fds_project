import Vue from 'vue'
import Router from 'vue-router'
import TV from '@/components/sotttttv/TV'
import TV2 from '@/components/sotttttv/TV2'
import NoPrmission from '@/components/task_comp/NoPermission'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

// Menu filter
// const menuFilterTV = [
//   {
//     path: '/week',
//     alias: '/',
//     component: TV1Week,
//     name: 'tuan',
//     icon: 'work_outline',
//     meta: {
//       description: 'week of environment'
//     }
//   },
//   {
//     path: '/month',
//     alias: '/',
//     component: TV1Month,
//     name: 'thang',
//     icon: 'work_outline',
//     meta: {
//       description: 'week of environment'
//     }
//   },
//   {
//     path: '/quarter',
//     alias: '/',
//     component: TV1Quarter,
//     name: 'quy',
//     icon: 'work_outline',
//     meta: {
//       description: 'quarter of environment'
//     }
//   },
//   {
//     path: '/year',
//     alias: '/',
//     component: TV1Year,
//     name: 'nam',
//     icon: 'work_outline',
//     meta: {
//       description: 'year of environment'
//     }
//   }
// ]

// Routes
const activityTaskRouter = [
  {
    path: '/tv',
    alias: '/',
    component: TV
  },
  {
    path: '/tv2',
    component: TV2
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

export { router as default }
