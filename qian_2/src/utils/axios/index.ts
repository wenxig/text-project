import axios from 'axios'
import { useUserStore } from '@s/index'
import { ElMessage } from 'element-plus';
import $router from '@/router/index';
const $store = useUserStore()

// 为图片准备基地址
// dev:127 server: big-event
export const baseURL = (<any>import.meta).env.DEV ? '/api' : 'http://big-event-vue-api-t.itheima.net'

// 创建一个自定的axios方法(比原axios多了个基地址)
// axios函数请求的url地址前面会被拼接基地址, 然后axios请求baseURL+url后台完整地址
const reqAxios = axios.create({
  baseURL: baseURL
})

// 使用axios拦截器处理api接口调用时，部分参数重复调用问题
reqAxios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 调用接口时统一为请求头挂载 Authorization 字段
    if ($store.token) {
      config.headers.Authorization = $store.token
    }
    return config
  }
)

// 解决token过期问题
reqAxios.interceptors.response.use((res) => {
  if ((typeof res.data === 'string') && res.data.startsWith("身份认证")) {
    ElMessage.error(res.data)
    $router.replace('/auth/login')
    return
  }
  return <any>res
})

// 导出自定义的axios方法, 供外面调用传参发请求
export default reqAxios


// 重试
//@ts-ignore
reqAxios.defaults.retry = 3; //重试次数
//@ts-ignore
reqAxios.defaults.retryDelay = 1000;//重试延时
//@ts-ignore
reqAxios.defaults.shouldRetry = (error) => true;//重试条件，默认只要是错误都需要重试
reqAxios.interceptors.response.use(undefined, async (err) => {
  const config = err.config;
  if (!config || !config.retry || !config.shouldRetry || typeof config.shouldRetry != 'function' || !config.shouldRetry(err)) {
    return Promise.reject(err);
  }
  config.__retryCount = config.__retryCount || 0;
  if (config.__retryCount >= config.retry) {
    return Promise.reject(err);
  }
  config.__retryCount += 1;
  const delay = config.retryDelay || 1;
  await new Promise<void>(resolve => {
    setTimeout(resolve, delay);
  });
  return await axios(config);
});

