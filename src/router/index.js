import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/index.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  // name 做标识用
  { path: '/index', name: 'index', component: Index },
  { path: '/login', name: 'login', component: Login }
]

const router = new VueRouter({
  // 挂载
  routes
})

export default router
