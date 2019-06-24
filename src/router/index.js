import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Layout from '@/view/layout/Layout'
import nav from '@/view/nav'
import managerRouter from './modules/manager'
import activityRouter from './modules/activity'
import h5Router from './modules/h5'
import DB from '@/view/DB0';
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/view/login/index'),
    hidden: true,
    meta: {
      title: '登录'
    }
  }, 
   
  {
    path: '/',
    component:Layout,
    hidden: true,
    children: [
      {
        path: 'console',
        component: () => import('@/view/console'),
        meta: {
          title: '欢迎'
        }
      },
    ]
  },
  {
    path: '/dapan',
    component: Layout,
    redirect: 'index',
    name: '大盘',
    meta: {
      title: '大盘',
      icon: '404'
    },
    children: [
      {
        path: '',
        component: nav,
        children:[
          {
            path: 'DB:id',
            component:DB,
            meta: { title: 'DB'}
          },
          {
            path: 'index',
            component: () => import('@/view/index'),
            meta: { title: '控制台'}
          },
        ]
      },
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/view/errorPage/401'),
        name: 'Page401',
        meta: { title: '401',}
      },
      {
        path: '404',
        component: () => import('@/view/errorPage/404'),
        name: 'Page404',
        meta: { title: '404'}
      }
    ]
  },
  managerRouter,
  activityRouter,
  h5Router
]
const router = new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  to.meta.keepAlive = false;
  next()
})

  
export default router