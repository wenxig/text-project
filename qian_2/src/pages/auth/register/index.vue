<template>
  <el-form ref="loginFormEl" :model="regFrom" :rules="regRules">
    <el-form-item prop="username">
      <el-input v-model="regFrom.username" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="regFrom.password" placeholder="请输入密码" type="password"></el-input>
    </el-form-item>
    <el-form-item prop="repassword">
      <el-input v-model="regFrom.repassword" placeholder="请再次确认密码" type="password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="btn-reg" type="primary" @click="btn_reg(loginFormEl as any)">立即创建</el-button>
      <el-link class="change-link" type="info" @click="router.push('/auth/login')">去登录</el-link>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { registerAPI } from '@/api';
const loginFormEl = ref<FormInstance>()

const router = useRouter()
const validatePass = (_rule: any, value: string, callback: (ret?: any) => void) => {
  if (value !== regFrom.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

interface RegFrom {
  username: string,
  password: string,
  repassword: string
}
const regFrom = reactive<RegFrom>({
  username: '',
  password: '',
  repassword: ''
})

const regRules = reactive<FormRules<RegFrom>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,10}$/,
      message: '用户名必须是1-10的大小写字母数字',
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
  ],
  repassword: [
    { required: true, message: '请再次确认密码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ]
})

function btn_reg(form: FormInstance) {
  form.validate(async (valid) => {
    if (valid) {
      const { data: res } = await registerAPI(regFrom)
      if (res.code !== 0) return ElMessage.error(res.message)
      ElMessage.success(res.message)
      router.push('/auth/login')
    } else {
      return false
    }
  })
}
</script>
