<template>
  <div class="comRegister-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box">个人笔记库后台系统</div>
      <!-- 注册的表单区域 —— 【element-plue✨】 -->
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
          <el-link class="change-link" type="info" @click="router.push('/login')">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { registerAPI } from '@/api';
const loginFormEl = ref<FormInstance>()

const router = useRouter()
const validatePass = (rule, value, callback) => {
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
      const { data: res } = await registerAPI(this.regFrom)
      if (res.code !== 0) return ElMessage.error(res.message)
      ElMessage.success(res.message)
      router.push('/login')
    } else {
      return false
    }
  })
}
</script>
<style lang="less" scoped>
.comRegister-container {
  background: url('/login-bg.jpg') center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
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
