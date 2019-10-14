import Vue from 'vue'
import Router from 'vue-router'
import StatisticMain from '@/components/taskStatistic/StatisticMain'
import UserStatistic from '@/components/taskStatistic/UserStatistic'
import WorkingUnitStatistic from '@/components/taskStatistic/WorkingUnitStatistic'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

// Menu filter
const menuFilters = [
  {
    path: '/user',
    alias: '/',
    component: UserStatistic,
    name: 'cong_viec_ca_nhan',
    icon: 'work_outline',
    total: 0,
    meta: {
      description: 'owner of environment'
    }
  },
  {
    path: '/workingUnit',
    alias: '/',
    component: WorkingUnitStatistic,
    name: 'cong_viec_cua_don_vi',
    icon: 'work_outline',
    total: 0,
    meta: {
      description: 'owner of environment'
    }
  }
]

// Routes
const TaskStatisticRouter = [
  {
    path: '/',
    component: StatisticMain,
    children: menuFilters
  },
  {
    // not found handler
    path: '*',
    component: HelloWorld
  }
]

const router = new Router({
  routes: TaskStatisticRouter,
  linkExactActiveClass: 'active'
})

export {
  router as
  default, menuFilters
}
