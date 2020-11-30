import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const autoLoadRoutes = []
/**
 * 自动注入路由 结合业务做好分类
 * 1.带有route.js的文件会自主注入到路由
 * 2.对应的route对应相应的文件夹
 */
const reqRouter = require.context('./', true, /\.route\.js$/)
reqRouter.keys().forEach(name => {
  autoLoadRoutes.push(...reqRouter(name).default)
})
const routes = [
  ...autoLoadRoutes,
  {
    // 所有的可匹配路由写在404前面
    path: '*',
    name: '404',
    component: () => import('@/views/404')
  }
]
export default new Router({
  routes,
  mode: 'history',
  base: process.env.VUE_APP_BASEURL,
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  }
})
