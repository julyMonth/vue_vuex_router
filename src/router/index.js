import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import store from '../store/store'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

if (store.state.token) {
  sessionStorage.setItem('token', store.state.token)
} else {
  sessionStorage.removeItem('token')
}
const router = new Router({
  routes: [{
    path: '/',
    redirect: 'login.html'
  },
  {
    path: '/login.html',
    name: 'Login',
    component: Login
  },
  {
    path: '/helloWorld.html',
    name: 'HelloWorld',
    component: HelloWorld
  },
  {
    path: '/index.html',
    name: 'Index',
    component: Index
  }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (store.state.token) { // 通过vuex state获取当前的token是否存在
      next()
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})

export default router
