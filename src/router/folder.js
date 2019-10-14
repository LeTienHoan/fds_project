import Vue from 'vue'
import Router from 'vue-router'
import Detail from '@/components/folder_mgt/DetailDocFile'
import NoPrmission from '@/components/task_comp/NoPermission'
import FolderMgt from '@/components/FolderMgt'

Vue.use(Router)

// Routes
const folderRouter = [
  {
    path: '/list',
    alias: '/',
    name: 'FolderMgt',
    component: FolderMgt,
    meta: { description: 'FolderMgt of environment' }
  },
  {
    path: '/detail/:id',
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
    component: NoPrmission
  }
]

const router = new Router({
  routes: folderRouter,
  linkExactActiveClass: 'active'
})

export { router as default }
