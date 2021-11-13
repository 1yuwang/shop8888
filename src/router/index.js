import { createRouter, createWebHistory } from 'vue-router'

const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const Users = () => import('../components/user/Users.vue')
const Welcome = () => import('../components/Welcome.vue')
const Roles = () => import('../components/power/Roles.vue')
const Rights = () => import('../components/power/Rights.vue')
const Categories = () => import('../components/goods/Categories.vue')
const Params = () => import('../components/goods/Params.vue')
const Goods = () => import('../components/goods/Goods.vue')
const AddGoods = () => import('../components/goods/AddGoods.vue')
const Reports = () => import('../components/reports/Reports.vue')

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/welcome',
    component: Home,
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome
      },
      {
        path: '/users',
        name: 'User',
        component: Users
      },
      {
        path: '/roles',
        name: 'Roles',
        component: Roles
      },
      {
        path: '/rights',
        name: 'Rights',
        component: Rights
      },
      {
        path: '/categories',
        name: 'Categories',
        component: Categories
      },
      {
        path: '/params',
        name: 'Params',
        component: Params
      },
      {
        path: '/goods',
        name: 'Goods',
        component: Goods
      },
      {
        path: '/goods/add',
        name: 'AddGoods',
        component: AddGoods
      },
      {
        path: '/reports',
        name: 'Reports',
        component: Reports
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, form, next) => {
  // 如果访问的是login页面则next
  if(to.name == 'Login') {
    next()
  } else {
    // 如果访问的不是login页面 则判断是否携带token
    const token = window.sessionStorage.getItem('token');
    // 如果没有token令牌则跳转到login页面
    if(!token) {
      next('/')
    } else {
      next()
    }
  }
})

export default router