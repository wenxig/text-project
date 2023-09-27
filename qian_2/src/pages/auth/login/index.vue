<template>
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
    <el-link class="change-link" type="info" @click="$router.push('/auth/register')">没有账号?</el-link>
  </el-form>
</template>


<script setup lang="ts">
import { useUserStore } from '@s/index';
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
      router.push(`/home/${loginForm.username}`)
    } else {
      ElMessage.error(res.message)
    }
  })
}
</script>
