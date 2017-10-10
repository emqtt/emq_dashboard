import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store'


Vue.use(Router)


const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false },
  },
  // {
  //   path: '/signup',
  //   component: () => import('@/views/Signup.vue'),
  //   meta: { requiresAuth: false },
  // },
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '',
        alias: 'overview',
        component: () => import('@/views/Overview.vue'),
      },
      {
        path: '/plugins',
        component: () => import('@/views/Plugins.vue'),
      },
      {
        path: '/plugins/:nodeName/:pluginName',
        component: () => import('@/views/Plugins.vue'),
      },
      {
        path: '/listeners',
        component: () => import('@/views/Listeners'),
      },
      {
        path: '/websocket',
        component: () => import('@/views/Websocket.vue'),
      },
      {
        path: '/http_api',
        component: () => import('@/views/HttpApi.vue'),
      },
      {
        path: '/users',
        component: () => import('@/views/Users.vue'),
      },
      {
        path: '/clients',
        component: () => import('@/views/Datas.vue'),
      },
      {
        path: '/sessions',
        component: () => import('@/views/Datas.vue'),
      },
      {
        path: '/routes',
        component: () => import('@/views/Datas.vue'),
      },
      {
        path: '/subscriptions',
        component: () => import('@/views/Datas.vue'),
      },
    ],
  },
  {
    path: '*',
    meta: { requiresAuth: false },
    component: () => import('@/views/404.vue'),
  },
]

// Routing logic
const router = new Router({
  // mode: 'history',
  routes,
})

// check if logged in, if not, redirect to login page.
router.beforeEach((to, from, next) => {
  const { requiresAuth = true } = to.meta
  if (requiresAuth) {
    // if (!store.state.user.token) {
    if (!store.state.user.password) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    } else {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      next()
    }
  } else {
    next()
  }
})

export default router
