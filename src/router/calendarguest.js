import Vue from 'vue'
import Router from 'vue-router'
import CheckToken from '@/components/task_comp/CheckToken'
import Detail from '@/components/activity/DetailGuest'
import NoPrmission from '@/components/task_comp/NoPermission'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

// Routes
const activityEventRouter = [
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
  routes: activityEventRouter,
  linkExactActiveClass: 'active'
})

export { router as default }
