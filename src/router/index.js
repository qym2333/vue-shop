import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/users/Users.vue'
import Rights from '../views/rights/Rights.vue'
import Roles from '../views/rights/Roles.vue'
import Cates from '../views/goods/Cates.vue'
import Params from '../views/goods/Params.vue'
import Goods from '../views/goods/Goods.vue'
import Add from '../views/goods/Add.vue'
import Orders from '../views/orders/Orders.vue'
import Reports from '../views/reports/reports.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/home'
}, {
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  }, {
    path: '/users',
    component: Users
  }, {
    path: '/rights',
    component: Rights
  }, {
    path: '/roles',
    component: Roles
  }, {
    path: '/categories',
    component: Cates
  }, {
    path: '/params',
    component: Params
  }, {
    path: '/goods',
    component: Goods
  }, {
    path: '/goods/add',
    component: Add
  }, {
    path: '/orders',
    component: Orders
  }, {
    path: '/reports',
    component: Reports
  }]
}]

const router = new VueRouter({
  routes
})

// 路由全局守卫，每一个路由进入之前
router.beforeEach((to, from, next) => {
  if (sessionStorage.getItem('token')) {
    next()
  } else {
    to.path === '/login' ? next() : next('/login')
  }
})
export default router
