import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/activity/List'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

// Routes
const DashboardRouter = [
  {
    path: '/',
    component: List
  },
  {
    // not found handler
    path: '*',
    component: HelloWorld
  }
]

const router = new Router({
  routes: DashboardRouter,
  linkExactActiveClass: 'active'
})

export default router
