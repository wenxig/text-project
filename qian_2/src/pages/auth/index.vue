<script setup lang='ts'>

</script>

<template>
  <div class="comRegister-container">
    <div class="reg-box grid content-center">
      <div class="title-box mb-5 text-white">个人笔记后台管理系统</div>
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style lang="scss">
.comRegister-container {
  background: url('/login-bg.webp') center;
  background-size: cover;
  height: 100%;
  .reg-box {
    min-width: 450px;
    min-height: 35%;
    background-color: #6f88a8;
    opacity: 0.8;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
    padding: 0 30px;
    box-sizing: border-box;
    .title-box {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 600;
    }

    .btn-reg {
      width: 100%;
    }

    .change-link {
      color: #afbbc7;
      float: right;
      font-weight: 800;
      border-bottom: 2px solid red;
    }
  }
}
</style>