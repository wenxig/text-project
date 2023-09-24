import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@s/index'
import routes from './routes';

// 解决编程式路由往同一地址跳转时会报错的情况🍗
// 删了，那就不要向同一个地方跳转啊

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 权限访问控制
const whiteList = ['/login', '/register'] // 白名单页面 (登陆，注册)
router.beforeEach(async (to) => {
  const $store = useUserStore()
  const token = $store.token
  if (token) { //是否有token
    if (!$store.userInfo.username) {
      // 有token但是没有用户信息, 才去请求用户信息保存到pinia里
      await $store.initUserInfo()
      // 下次切换页面pinia里有用户信息数据就不会重复请求用户信息
    }
    return true
  } else {
    // 如果去的是白名单✨页面, 则放行
    if (whiteList.includes(to.path)) {
      return true
    } else {
      return '/login'
    }
  }
})

export default router
