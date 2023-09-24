import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core'

export const useUserStore = defineStore("userStore", () => {
  const token = useLocalStorage("store.token", "")
  const userInfo = useLocalStorage("store.userInfo", <userInfo>{
    nickname: "",
    username: "",
    user_pic: ""
  })
  async function initUserInfo() {
    const { getUserInfoAPI } = await import('@/api')
    const { data: res } = await getUserInfoAPI()
    if (res.code === 0) {
      userInfo.value = res.data
    }
  }

  return { token, userInfo, initUserInfo }
})
interface userInfo {
  nickname: string;
  username: string;
  user_pic: string;
}