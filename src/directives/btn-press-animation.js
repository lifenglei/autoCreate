import Vue from 'vue'
// 按钮按下时的缩放动画 (默认缩小为90%)
Vue.directive('pressAnimation', {
  inserted: function(el, binding) {
    let lock = false
    el.addEventListener('touchstart', () => {
      el.style.transform = `scale(${binding.value})`
      lock = true
      setTimeout(() => {
        lock = false
      }, 50)
    })
    el.addEventListener('touchend', () => {
      if (lock) {
        setTimeout(() => {
          el.style.transform = 'scale(1)'
        }, 50)
      } else {
        el.style.transform = 'scale(1)'
      }
    })
  }
})

export default {}
