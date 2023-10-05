<template>
  <div class="resetPassword-container">
    <el-card class="box-card">
      <template #header>
        <el-text type="primary" size="large">重置密码</el-text>
      </template>
      <!-- 表单 -->
      <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdFormRef" label-width="100px">
        <el-form-item label="原密码" prop="old_pwd">
          <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_pwd">
          <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="re_pwd">
          <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updatePwdFn">修改密码</el-button>
          <el-button @click="resetFn">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { updatePwdAPI } from '@/api'
import { useUserStore } from '@/store';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const userStore = useUserStore()
const pwdFormRef = ref<FormInstance>()
// 检测新旧密码是否相同
const samePwd = (_rule: any, value: string, callback: Function) => {
  if (value === pwdForm.old_pwd) {
    return callback(new Error('新旧密码不能相同！'))
  }
  callback()
}
// 检测两次新密码是否一致
const rePwd = (_rule: any, value: string, callback: Function) => {
  if (value !== pwdForm.new_pwd) {
    return callback(new Error('两次新密码不一致！'))
  }
  callback()
}

const pwdForm = reactive({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
// 表单的验证规则对象
const pwdFormRules = reactive<FormRules<typeof pwdForm>>({
  old_pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: samePwd, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请再次确认新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: rePwd, trigger: 'blur' }
  ]
})

function updatePwdFn() {
  pwdFormRef.value?.validate(async (valid) => {
    if (!valid) return false // 未通过校验拦住

    const { data: res } = await updatePwdAPI(pwdForm)
    if (res.code !== 0) return ElMessage.error('更新密码失败！')

    ElMessage.success('更新密码成功！')
    pwdFormRef.value?.resetFields()

    // 重置密码后的操作
    userStore.token = ""
    router.push('/login')
  })
}

function resetFn() {
  pwdFormRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.el-form {
  width: 500px;
}
</style>
