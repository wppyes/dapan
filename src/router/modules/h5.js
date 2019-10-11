

import Layout from '@/view/layout/Layout'
const activityRouter = {
  path: '/h5',
  component: Layout,
  alwaysShow: true,
  redirect: '/h5/joiner',
  name:'h5',
  title: 'title',
  children: [
    {
      path: 'joiner',
      component: () => import('@/view/h5/joiner'),
      meta: {
        title: '大赛名单'
      }
    },
    {
      path: 'range',
      component: () => import('@/view/h5/range'),
      meta: {
        title: '排行榜'
      }
    },
    {
      path: 'ticketset',
      component: () => import('@/view/h5/ticketset'),
      meta: {
        title: '票数设置'
      }
    },
    {
      path: 'setrange',
      component: () => import('@/view/h5/setrange'),
      meta: {
        title: '排名设置'
      }
    },
    {
      path: 'addphone',
      component: () => import('@/view/h5/addphone'),
      meta: {
        title: '手机号补充'
      }
    },
    {
      path: 'assist',
      component: () => import('@/view/h5/assist'),
      meta: {
        title: '辅助'
      }
    },
    {
      path: 'prize1',
      component: () => import('@/view/h5/prize1'),
      meta: {
        title: '奖品管理（拼图）'
      }
    },
    {
      path: 'prizeset1',
      component: () => import('@/view/h5/prizeset1'),
      meta: {
        title: '奖品发放（拼图）'
      }
    },
    {
      path: 'prize-malasong',
      component: () => import('@/view/h5/prize-malasong'),
      meta: {
        title: '奖品管理（马拉松）'
      }
    },
    {
      path: 'prizeset-malasong',
      component: () => import('@/view/h5/prizeset-malasong'),
      meta: {
        title: '奖品发放（马拉松）'
      }
    },
    {
      path: 'shouquan',
      component: () => import('@/view/h5/shouquan'),
      meta: {
        title: '公共授权'
      }
    },
  ]
}
export default activityRouter
