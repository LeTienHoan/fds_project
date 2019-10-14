import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/forgotPassword/List'
// import employeesWorkingunit from '@/components/employees/employeesWorkingunit'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)
// Menu filter
const menuFilters = [
]

// Routes
const ContactRouter = [
  {
    path: '/',
    component: List,
    children: menuFilters
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
