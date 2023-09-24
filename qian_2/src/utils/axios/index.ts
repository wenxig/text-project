import axios from 'axios'
import { useUserStore } from '@s/index'
import { ElMessage as Message } from 'element-plus';
import $router from '@/router/index';
const $store = useUserStore()

// 为图片准备基地址
// dev:127 server: big-event
export const baseURL = (<any>import.meta).env.DEV ? 'http://127.0.0.1:3000' : 'http://big-event-vue-api-t.itheima.net'

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
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 解决token过期问题
reqAxios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (error.response.status === 401) {
      // console.dir(error)
      // 无效的 token
      // 把 pinia 中的 token 重置为空，并跳转到登录页面
      $store.token = ""
      $router.push('/login')

      // 弹窗提示
      Message.error('用户身份以过期！！')
    }
    return Promise.reject(error)
  }
)

// 导出自定义的axios方法, 供外面调用传参发请求
export default reqAxios


// 重试
//@ts-ignore
axios.defaults.retry = 3; //重试次数
//@ts-ignore
axios.defaults.retryDelay = 1000;//重试延时
//@ts-ignore
axios.defaults.shouldRetry = (error) => true;//重试条件，默认只要是错误都需要重试
axios.interceptors.response.use(undefined, (err) => {
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
  return new Promise<void>(resolve => {
    setTimeout(resolve, delay);
  }).then(() => {
    return axios(config);
  });
});

