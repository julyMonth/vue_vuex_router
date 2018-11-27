// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/commen.css'
import store from './store/store'

Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$http = axios.create({
  baseURL: process.env.BASE_API, // api
  timeout: 5000, // 请求超时时间
  withCredentials: true // 请求带上cookie
})
// http请求拦截器
Vue.prototype.$http.interceptors.request.use(config => {
  return config
}, error => {
  // Message.error({
  // message: '加载超时'
  // })
  return Promise.reject(error)
})
// http响应拦截器
Vue.prototype.$http.interceptors.response.use(data => { // 响应成功关闭loading
  return data
}, error => {
  // Message.error({
  // message: '加载失败'
  // })
  return Promise.reject(error)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
