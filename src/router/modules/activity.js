

import Layout from '@/view/layout/Layout'
const activityRouter = {
  path: '/activity',
  component: Layout,
  alwaysShow: true,
  redirect: '/activity/list',
  name:'activity',
  title: 'title',
  children: [
    {
      path: 'list',
      component: () => import('@/view/activity/list'),
      meta: {
        title: '活动列表'
      }
    },
    {
      path: 'prize',
      component: () => import('@/view/activity/prize'),
      meta: {
        title: '奖品管理'
      }
    },
    {
      path: 'statistics',
      component: () => import('@/view/activity/statistics'),
      meta: {
        title: '统计管理'
      }
    },
    {
      path: 'prizenext',
      component: () => import('@/view/activity/prizenext'),
      meta: {
        title: '下期奖品'
      }
    },
    {
      path: 'addavtivity',
      component: () => import('@/view/activity/addavtivity'),
      meta: {
        title: '活动管理'
      }
    },
    {
      path: 'postgood',
      component: () => import('@/view/activity/postgood'),
      meta: {
        title: '物流管理'
      }
    },
    {
      path: 'prizeset',
      component: () => import('@/view/activity/prizeset'),
      meta: {
        title: '奖品发放'
      }
    },
    {
      path: 'prizeset-yinhang',
      component: () => import('@/view/activity/prizeset-yinhang'),
      meta: {
        title: '银行物流'
      }
    },
    {
      path: 'prizeset-huabing',
      component: () => import('@/view/activity/prizeset-huabing'),
      meta: {
        title: '银行奖品发放'
      }
    },
  ]
}
export default activityRouter
