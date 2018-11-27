import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex)

let store = new vuex.Store({ // store对象
  state: {
    token: '',
    url: ''
  },
  mutations: {
    setToken (state, token) { // 这里的state对应着上面这个state
      state.token = token // 你还可以在这里执行其他的操作改变state
      sessionStorage.setItem('token', token)
    },
    delToken (state, token) {
      state.token = token // 你还可以在这里执行其他的操作改变state
      sessionStorage.removeItem('token', token)
    },
    switchPage (state, url) {
      state.url = url
    }
  }
})

export default store
