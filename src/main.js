import Vue from 'vue'
import App from './App.vue'
import router from '@/routers/index'
import store from './store'
import mixin from './mixin'
Vue.mixin(mixin)

const Fastclick = () => import('fastclick')
Fastclick().then(function(fastclick) {
  // 判断只有在ios且版本小于11加入fastClick
  const str = navigator.userAgent.toLowerCase()
  const ver = str.match(/cpu iphone os (.*?) like mac os/)
  if (!ver || parseInt(ver[1]) < 11) {
    // 非IOS系统或者系统版本小于11
    fastclick.attach(document.body)
  } else {
    console.log('iOS11以上不用fastclick')
  }
})

router.afterEach((to, from) => {
  if (to.meta.st) {
    Vue.prototype.$report('page', to.meta.st)
  }
})

Vue.config.productionTip = process.env.NODE_ENV !== 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'
console.log('8888888888888')
// Vue.config.devtools = true
new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {

  }
}).$mount('#app')
