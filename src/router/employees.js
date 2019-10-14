import Vue from 'vue'
import Router from 'vue-router'
import EmployeesMain from '@/components/employees/EmployeesMain'
import EmployeesAll from '@/components/employees/employeesAll'
import Detail from '@/components/employees/Detail'
// import employeesWorkingunit from '@/components/employees/employeesWorkingunit'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)
// Menu filter
const menuFilters = [
  {
    path: '/working',
    alias: '/',
    component: EmployeesAll,
    name: 'Đang làm việc',
    icon: 'contacts',
    total: 0,
    meta: { description: 'all of environment' }
  },
  {
    path: '/hasRetired',
    alias: '/',
    component: EmployeesAll,
    name: 'Đã nghỉ việc',
    icon: 'contacts',
    total: 0,
    meta: { description: 'all of environment' }
  },
  {
    path: '/all',
    alias: '/',
    component: EmployeesAll,
    name: 'Tất cả',
    icon: 'contacts',
    total: 0,
    meta: { description: 'all of environment' }
  }
  // {
  //   path: '/workingunits/:id/:name',
  //   alias: '/',
  //   component: employeesWorkingunit,
  //   icon: 'person',
  //   total: 0,
  //   meta: { description: 'person of environment', notShow: true }
  // }
]

// Routes
const ContactRouter = [
  {
    path: '/',
    component: EmployeesMain,
    children: menuFilters
  },
  {
    path: '/employees/:id',
    name: 'Detail',
    component: Detail,
    meta: { description: 'Detail of environment', checkPermission: true }
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
