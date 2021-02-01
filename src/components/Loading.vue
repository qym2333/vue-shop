<template>
  <div class="mask">
    <div class="loading"></div>
  </div>
</template>

<script>
export default {
  name: 'Loading' // 定义的组件名称 使用时写法：loading
}
</script>

<style scoped lang="less">
.loading {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: url('./../assets/loading.svg') center center no-repeat
    rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}
</style>
