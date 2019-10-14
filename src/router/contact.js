import Vue from 'vue'
import Router from 'vue-router'
import ContactMain from '@/components/contact/ContactMain'
import ContactAll from '@/components/contact/contactAll'
import ContactGroup from '@/components/contact/contactGroup'
import MyContact from '@/components/contact/myContact'
import ContactShared from '@/components/contact/contactShared'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)
// Menu filter
const menuFilters = [
  {
    path: '/mycontact',
    alias: '/',
    component: MyContact,
    name: 'Liên lạc của tôi',
    icon: 'perm_contact_calendar',
    total: 0,
    meta: { description: 'mycontact of environment' }
  },
  {
    path: '/group',
    alias: '/',
    component: ContactGroup,
    name: 'Nhóm liên lạc',
    icon: 'supervisor_account',
    total: 0,
    meta: { description: 'group of environment' }
  },
  {
    path: '/shared',
    alias: '/',
    component: ContactShared,
    name: 'Liên lạc được chia sẻ',
    icon: 'share',
    total: 0,
    meta: { description: 'shared of environment' }
  },
  {
    path: '/all',
    alias: '/',
    component: ContactAll,
    name: 'Tất cả',
    icon: 'contacts',
    total: 0,
    meta: { description: 'all of environment' }
  }
]

// Routes
const ContactRouter = [
  {
    path: '/',
    component: ContactMain,
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
