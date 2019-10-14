import Vue from 'vue'
import Router from 'vue-router'
import ProfileMain from '@/components/profile/ProfileMain'
import Configuration from '@/components/profile/configuration'
import Information from '@/components/profile/information'
import changePassword from '@/components/profile/changePassword'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)
// Menu filter
const menuFilters = [
  {
    path: '/profile',
    alias: '/',
    component: Information,
    name: 'Thông tin tài khoản',
    icon: '',
    total: 0,
    meta: { description: 'mycontact of environment' }
  },
  {
    path: '/configuration',
    alias: '/',
    component: Configuration,
    name: 'Cấu hình cá nhân',
    icon: '',
    total: 0,
    meta: { description: 'group of environment' }
  },
  {
    path: '/password',
    alias: '/',
    component: changePassword,
    name: 'Đổi mật khẩu',
    icon: '',
    total: 0,
    meta: { description: 'shared of environment' }
  }
]

// Routes
const ContactRouter = [
  {
    path: '/',
    component: ProfileMain,
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
