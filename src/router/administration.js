import Vue from 'vue'
import Router from 'vue-router'
import AdminManagement from '@/components/administration/AdminManagement'
import WorkTime from '@/components/administration/WorkTime'
import Holiday from '@/components/administration/Holiday'
import NotificationTemplate from '@/components/administration/NotificationTemplate'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

// Menu filter
const menuFilters = [
  {
    path: '/worktime',
    alias: '/',
    component: WorkTime,
    name: 'ngay_lam_viec',
    icon: 'event',
    total: 0,
    meta: { description: 'worktime of environment' }
  },
  {
    path: '/holiday',
    alias: '/',
    component: Holiday,
    name: 'ngay_nghi',
    icon: 'date_range',
    total: 0,
    meta: { description: 'holiday of environment' }
  },
  {
    path: '/notification',
    alias: '/',
    component: NotificationTemplate,
    name: 'mau_thong_bao',
    icon: 'email',
    total: 0,
    meta: { description: 'notification of environment' }
  }
]

// Routes
const AdministratorRouter = [
  {
    path: '/',
    component: AdminManagement,
    children: menuFilters
  },
  {
    // not found handler
    path: '*',
    component: HelloWorld
  }
]

const router = new Router({
  routes: AdministratorRouter,
  linkExactActiveClass: 'active'
})

export { router as default, menuFilters }
