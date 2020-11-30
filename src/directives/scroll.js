import Vue from 'vue'
Vue.directive('scroll', {
  bind: (el, binding, vnode) => {
    // 是否执行回调事件
    let eventAction = true
    // 距离底部剩余距离开始触发回调
    let distance = 100 // (unit: px)
    // 监听滚动事件
    el.onscroll = e => {
      // 获取当前节点可滚动的距离   节点滚动条总高度 - 节点本身高度
      let scrollHeight = e.target.scrollHeight - e.target.offsetHeight
      // 获取节点剩余可滚动的高度   可滚动距离  -  已经滚动的距离
      // let residualHeight = scrollHeight - e.target.offsetTop
      let residualHeight = scrollHeight - e.target.scrollTop
      //  滚动到指定区域执行回调事件
      if (typeof binding.value === 'function' && residualHeight < distance && eventAction) {
        // 执行事件回调函数   如果不明白此处的binding.value的同学请点击上面的链接,自行去官方查看
        binding.value()
        eventAction = false
      } else if (residualHeight > distance) {
        eventAction = true
      }
    }
  }
})
export default {}
