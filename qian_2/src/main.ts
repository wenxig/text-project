import './assets/main.scss'
import "tailwindcss/tailwind.css"
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import dayjs from 'dayjs'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.config.globalProperties.$formatDate = (date: Parameters<typeof dayjs>[0]) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

app.mount('#app')
