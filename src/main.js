import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/global.css'
import 'element-ui/lib/theme-chalk/base.css'
import ZkTable from 'vue-table-with-tree-grid'
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './plugins/vueQuillEditor'

Vue.prototype.$axios = axios

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})
router.afterEach(() => {
  NProgress.done()
})
// axios配置
axios.defaults.baseURL = 'http://115.159.87.220:8888/api/private/v1/'
// axios 请求拦截器
axios.interceptors.request.use(config => {
  NProgress.start() // 设置加载进度条(开始..)
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
// axios响应拦截器
axios.interceptors.response.use(
  function (response) {
    NProgress.done() // 设置加载进度条(结束..)
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)
Vue.component('tree-grid', ZkTable)
Vue.filter('dateFormat', val => {
  const date = new Date(val * 1000)
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  return y + '-' + m + '-' + d
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
