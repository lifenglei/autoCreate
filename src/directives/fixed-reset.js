import Vue from 'vue'
// 兼容 iOS12、iOS13 微信 弹框内的键盘弹出 导致页面上移滚动不能恢复的情况 适用于 input 和 textarea
let scrollLock = false
let ua = window.navigator.userAgent.toUpperCase()
Vue.directive('fixdReset', {
  inserted: function(el, binding) {
    if (ua.indexOf('IPHONE') > -1) {
      // if (ua.indexOf('IPHONE') > -1 && ua.indexOf('MICROMESSENGER') > -1) {
      el.addEventListener('blur', () => {
        setTimeout(() => {
          if (!scrollLock) {
            document.body.scroll(0, 0)
            document.documentElement.scroll(0, 0)
          }
        }, 20)
      })
      el.addEventListener('focus', () => {
        scrollLock = true
        setTimeout(() => {
          scrollLock = false
        }, 100)
      })
    }
  }
})

export default {}
