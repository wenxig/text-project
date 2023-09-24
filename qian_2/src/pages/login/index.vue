<template>
  <div class="comLogin-container">
    <!-- 登录的盒子 -->
    <div class="login-box grid content-center">
      <!-- 标题的盒子 -->
      <div class="title-box">个人文章后台管理系统</div>
      <!-- 登录的表单区域 —— 使用element-ui -->
      <el-form ref="loginFormEl" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="login(loginFormEl)">登录</el-button>
        </el-form-item>
      </el-form>
      <el-link class="change-link" type="info" @click="$router.push('/register')">没有账号?</el-link>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useUserStore } from '@/store';
import { ref } from 'vue';
import { reactive } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { loginAPI } from '@/api';
import { useRouter } from 'vue-router';
const router = useRouter()
const userStore = useUserStore()
const loginFormEl = ref<FormInstance>()
interface LoginForm {
  username: string
  password: string
}
const loginForm = reactive<LoginForm>({
  username: "",
  password: ''
})
const loginRules = reactive<FormRules<LoginForm>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,10}$/,
      message: '用户名必须是1-10的字母数字',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15的非空字符',
      trigger: 'blur'
    }
  ]
})

function login(form?: FormInstance) {
  if (!form) return
  form.validate(async (valid) => {
    if (!valid) return false
    const { data: res } = await loginAPI(loginForm)
    if (res.code === 0) {
      ElMessage.success(res.message)
      userStore.token = res.token
      router.push('/home')
    } else {
      ElMessage.error(res.message)
    }
  })
}
</script>

<style lang="scss" scoped>
.comLogin-container {
  background: url('/login-bg.webp') center;
  background-size: cover;
  height: 100%;

  .login-box {
    width: 400px;
    height: 270px;
    background-color: #6f88a8;
    opacity: 0.8;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
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

    .btn-login {
      width: 100%;
    }

    .change-link {
      color: #afbbc7;
      font-weight: 800;
      border-bottom: 2px solid red;
      position: absolute;
      bottom: 0;
      right: 10%;
    }
  }
}
</style>
