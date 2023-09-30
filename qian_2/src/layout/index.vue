<script setup lang="ts">
import { reactive } from 'vue';
import Avatar from './avatar.c.vue';
const menus = reactive([
  {
    indexPath: '2',
    title: '文章管理',
    icon: 'el-icon-s-order',
    children: [
      {
        indexPath: '/article/cate',
        title: '文章分类',
        icon: 'el-icon-s-data'
      },
      {
        indexPath: '/article/list',
        title: '文章列表',
        icon: 'el-icon-document-copy'
      }
    ]
  },
  {
    indexPath: '3',
    title: '个人中心',
    icon: 'el-icon-user-solid',
    children: [
      {
        indexPath: '/user/info',
        title: '基本资料',
        icon: 'el-icon-s-operation'
      },
      {
        indexPath: '/user/avatar',
        title: '更换头像',
        icon: 'el-icon-camera-solid'
      },
      {
        indexPath: '/user/password',
        title: '重置密码',
        icon: 'el-icon-key'
      }
    ]
  }
])
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
const router = useRouter()
const userStore = useUserStore()
function logout() {
  ElMessageBox.confirm('您确认退出登录吗', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('退出成功!')
    userStore.$reset()
    userStore.token = ""
    router.replace('/login')
  }).catch(() => {
    ElMessage.info('已取消退出操作')
  })
}
</script>

<template>
  <div class="comhome-container">
    <el-container class="main-container">
      <el-header>
        <!-- 左侧logo -->
        <img src="/favicon.svg" alt="logo" />
        <div class="title-box">个人笔记后台管理系统</div>
        <el-menu class="el-menu-top" mode="horizontal" background-color="#2e3846" text-color="#fff"
          active-text-color="#409EFF" router>
          <el-sub-menu index="1">
            <template #title>
              <!-- 头像 -->
              <Avatar :src="userStore.userInfo.user_pic"></Avatar>
              <span>个人中心</span>
            </template>
            <el-menu-item index="/user/info"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
            <el-menu-item index="/user/avatarPro"><i class="el-icon-camera-solid"></i>更换头像</el-menu-item>
            <el-menu-item index="/user/pwd"><i class="el-icon-key"></i>重置密码</el-menu-item>
          </el-sub-menu>
          <!-- 退出 -->
          <el-menu-item index="" @click="logout"><i class="el-icon-switch-button"></i>退出</el-menu-item>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <div class="user-box">
            <Avatar :src="userStore.userInfo.user_pic"></Avatar>
            <span>欢迎 {{ userStore.userInfo.nickname || userStore.userInfo.username }}</span>
          </div>
          <el-menu :default-active="$route.path" class="el-menu-vertical-demo" background-color="#2e3846"
            text-color="#fff" active-text-color="#409EFF" unique-opened router>
            <template v-for="item in menus">
              <el-sub-menu :index="item.indexPath">
                <template #title>
                  <i :class="item.icon"></i>
                  <span>{{ item.title }}</span>
                </template>
                <el-menu-item v-for="subItem in item.children" :key="subItem.indexPath"
                  :index="subItem.indexPath">
                  <i :class="subItem.icon"></i>{{ subItem.title }}
                </el-menu-item>
              </el-sub-menu>
            </template>
          </el-menu>
        </el-aside>
        <el-container>
          <slot></slot>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.comhome-container {
  height: 100%;

  .main-container {
    height: 100%;

    .el-header,
    .el-aside {
      background-color: #2e3846;
    }

    .el-header {
      padding: 0;
      display: flex;
      justify-content: space-between;
    }

    .el-main {
      overflow-y: scroll;
      height: calc(100vh - 60px);
      background-color: #f2f2f2;
    }

    .el-footer {
      background-color: #eee;
      font-size: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}


// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #2e3846;
  border-bottom: 1px solid #2e3846;
  user-select: none;
  width: 90%;

  span {
    color: white;
    font-size: 12px;
  }
}

// 侧边栏菜单的样式
.el-aside {

  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}

.title-box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: #f2f2f2;
  padding: 0px 10px;
}
</style>
