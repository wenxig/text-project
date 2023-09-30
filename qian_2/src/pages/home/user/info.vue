<template>
  <div class="userInfo-container">
    <el-card class="box-card">
      <template #header>
        <el-text type="primary" size="large">基本资料</el-text>
      </template>
      <!-- 表单 -->
      <el-form class="w-[500px]" :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="100px">
        <el-form-item label="登录名称" prop="username">
          <el-input v-model="userForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="userForm.nickname" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交修改</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { updateUserInfoAPI } from '@/api';
import { useUserStore } from '@/store';
const userStore = useUserStore()
import { reactive, ref } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
const userFormRef = ref<FormInstance>()

const userForm = reactive({
  ...userStore.userInfo
})
const userFormRules = reactive<FormRules<typeof userForm>>({
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '昵称必须是1-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
})

function submitForm() {
  (<FormInstance>userFormRef.value).validate(async (valid) => {
    if (valid) {
      // console.log(this.userForm)
      // 根据接口要求，必须要一个id值
      userForm.id = userStore.userInfo.id
      const { data: res } = await updateUserInfoAPI(userForm)
      // console.log(res)

      if (res.code === 0) {
        ElMessage.success('修改用户信息成功！')
        userStore.initUserInfo()
      } else {
        ElMessage.success('修改用户信息失败！')
      }
    } else {
      return false
    }
  })
}

function resetForm() {
  (<FormInstance>userFormRef.value).resetFields()
}
</script>