import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Users from '../components/Users.vue'
import Rights from '../components/Rights.vue'
import Roles from '../components/Roles.vue'
import Goods from '../components/Goods.vue'
import Params from '../components/Params.vue'
import Categories from '../components/Categories.vue'
import Orders from '../components/Orders.vue'
import Reports from '../components/Reports.vue'
import GoodsAdd from '../components/Goods-add.vue'

Vue.use(VueRouter)

// 解除路由打印错误
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  { path: '/', redirect: '/index' },
  // name 做标识用
  { path: '/index',
    name: 'index',
    component: Index,
    children: [
      { path: '/users', name: 'users', component: Users },
      { path: '/rights', name: 'rights', component: Rights },
      { path: '/roles', name: 'roles', component: Roles },
      { path: '/goods',
        name: 'goods',
        component: Goods
        // children: [
        //   { path: '/goods-add', name: 'goods-add', component: GoodsAdd }
        // ]
      },
      { path: '/goods-add', name: 'goods-add', component: GoodsAdd },
      { path: '/params', name: 'params', component: Params },
      { path: '/categories', name: 'categories', component: Categories },
      { path: '/orders', name: 'orders', component: Orders },
      { path: '/reports', name: 'reports', component: Reports }
    ]
  },
  { path: '/login', name: 'login', component: Login }
]

const router = new VueRouter({
  // 挂载
  routes
})

// 导航守卫
// to即将进入的目标  from来自哪里  next放行  next('/login')进入登录页
// 如果有token放行    如果去登陆，放行    其他情况，拦截到登录页
router.beforeEach((to, from, next) => {
  const $token = localStorage.getItem('token')
  if (to.path === '/login' || $token) {
    next()
  } else {
    next('/login')
  }
})
export default router
