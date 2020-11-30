<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive>
        <router-view class="pageRouter"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'project',
  data() {
    return {
      transitionName: '', // 初始过渡动画方向
    }
  },
  watch: {
    $route(to, from) {
      this.transitionName = 'opacity-page'
    }
  }
}
</script>
<style lang="less">
.pageRouter {
  width: 100%;
  position: absolute;
  height: auto;
  transition: all 0.4s ease;
  will-change: opacity;
  top: 0px;
  left: 0px;
  backface-visibility: hidden;
  perspective: 1000;
  transform-style: preserve-3d;
  box-sizing: border-box;
}
.opacity-page-enter,
.opacity-page-leave-active {
  opacity: 0;
}
</style>
