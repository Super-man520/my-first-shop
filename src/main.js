import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
// 引入element-ui
import ElementUI from 'element-ui'
// import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/common.css'
import './font/font.less'
// import './style/index.less'
import moment from 'moment'

// 引入富文本
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 接收router
import router from './router'
Vue.use(VueQuillEditor /* { 全局使用 } */)
// console.log(ElementUI)
// const { Message } = ElementUI
// 只要是第三方插件都要使用use
Vue.use(ElementUI)
// 挂载在实例
console.log(Vue.prototype)

Vue.prototype.$axios = axios

// 设置基准url
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 是否显示打印信息
Vue.config.productionTip = false

// 过滤器处理时间戳
Vue.filter('timer', (value, str = 'YYYY-MM-DD  HH:mm:ss') => {
  return moment(value * 1000).format(str)
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log(config)
  // 请求拦截统一添加token
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  // console.log(response)
  if (response.meta.status === 401) {
    // 修改提示信息
    // Message.warning({
    //   showClose: true,
    //   message: '页面发生错误',
    //   type: 'warning',
    //   duration: 1200
    // })
    response.meta.msg = '登录已过期，请重新登录'
    // 移除本地存储的token
    localStorage.removeItem('token')
    // 并拦截到登录界面
    // this.$router = router
    router.push('/login')
    // console.log(response)
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
