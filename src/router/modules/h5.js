

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
  ]
}
export default activityRouter
