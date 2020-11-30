<template>
  <div class="pub-404">
    <img src="@/assets/image/404.png" alt="" />
    <p class="info">哎呀迷路了...</p>
    <dl>
      <dt>可能的原因：</dt>
      <dd>原来的页面不存在了</dd>
      <dd>我们的服务器被外星人劫持了</dd>
    </dl>
    <p>
      <a href="javascript:void(0);" class="btn" @click="toIndex">返回首页</a>
    </p>
  </div>
</template>
<script>
export default {
  mounted() {
    document.title = '哎呀，迷路了'
  },
  methods: {
    toIndex() {
      
    }
  }
}
</script>
<style lang="less">
.pub-404 {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  font-size: 0.36rem;
  img {
    display: block;
    width: 3rem;
    margin: 0 auto;
  }
  .info {
    padding: 0.5rem 0;
  }
  p {
    text-align: center;
  }
  dl {
    width: 4rem;
    display: block;
    margin: 0 auto 0.3rem;
    font-size: 0.3rem;
    color: #777;
  }
  dd {
    margin-inline-start: 0.2rem;
    font-size: 0.28rem;
    margin-top: 0.1rem;
  }
  .btn {
    margin-top: 1rem;
    display: inline-block;
    height: 0.6rem;
    line-height: 0.6rem;
    border-radius: 0.4rem;
    width: 2rem;
    background: #2cc7c5;
    color: #fff;
  }
}
</style>
